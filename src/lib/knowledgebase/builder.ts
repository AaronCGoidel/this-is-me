// src/lib/knowledgebase/builder.ts

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Index, Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { KnowledgeBaseDB } from "./db";
// If you move or rename this file, adjust the import paths accordingly.

/*
  Library version of the original `scripts/build-knowledge-base.ts`.
  Allows the same build logic to be invoked programmatically from server actions
  or API routes instead of only via the CLI. The public surface area is:

    - KnowledgeBaseBuilder (class)
    - buildFromFilesystem() helper
    - buildFromSupabaseStorage() helper (stub for now; TODO implement)
*/

// Default configuration values – callers can override via constructor params
export interface KnowledgeBaseConfig {
  knowledgeBaseDir?: string;
  pineconeIndexName?: string;
  pineconeNamespace?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  openaiEmbeddingModel?: string;
  embeddingBatchSize?: number;
}

export interface DocumentChunk {
  id: string;
  content: string;
  metadata: {
    source_file: string;
    chunk_index: number;
    total_chunks: number;
    file_hash: string;
    category?: string;
    last_updated: string;
  };
}

interface ExistingRecord {
  id: string;
  metadata?: {
    file_hash?: string;
    source_file?: string;
  };
}

interface EmbeddedChunk extends DocumentChunk {
  embedding: number[];
}

export class KnowledgeBaseBuilder {
  private pc: Pinecone;
  private openai: OpenAI;
  private index: Index | null = null;

  private readonly KNOWLEDGE_BASE_DIR: string;
  private readonly PINECONE_INDEX_NAME: string;
  private readonly PINECONE_NAMESPACE: string;
  private readonly CHUNK_SIZE: number;
  private readonly CHUNK_OVERLAP: number;
  private readonly OPENAI_EMBEDDING_MODEL: string;
  private readonly EMBEDDING_BATCH_SIZE: number;

  constructor(config: KnowledgeBaseConfig = {}) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY environment variable is required");
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    this.KNOWLEDGE_BASE_DIR = config.knowledgeBaseDir ?? "knowledge-base";
    this.PINECONE_INDEX_NAME =
      config.pineconeIndexName ??
      process.env.PINECONE_INDEX_NAME ??
      "knowledge-base";
    this.PINECONE_NAMESPACE =
      config.pineconeNamespace ?? process.env.PINECONE_NAMESPACE ?? "knowledge";
    this.CHUNK_SIZE = config.chunkSize ?? 10000;
    this.CHUNK_OVERLAP = config.chunkOverlap ?? 200;
    this.OPENAI_EMBEDDING_MODEL =
      config.openaiEmbeddingModel ?? "text-embedding-3-small"; // 1536 dimensions
    this.EMBEDDING_BATCH_SIZE = config.embeddingBatchSize ?? 100;

    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /* ------------------------------------------------------------------------ */
  /*  Initialization                                                          */
  /* ------------------------------------------------------------------------ */

  async initialize() {
    try {
      this.index = this.pc.index(this.PINECONE_INDEX_NAME);
      console.log(
        `✅ Connected to Pinecone index: ${this.PINECONE_INDEX_NAME}`
      );
      console.log(
        `✅ Using OpenAI embedding model: ${this.OPENAI_EMBEDDING_MODEL}`
      );
    } catch (error) {
      throw new Error(`Failed to connect to Pinecone index: ${error}`);
    }
  }

  /* ------------------------------------------------------------------------ */
  /*  Source collection                                                       */
  /* ------------------------------------------------------------------------ */

  async getMarkdownFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.KNOWLEDGE_BASE_DIR, {
        recursive: true,
      });
      return files
        .filter((file) => file.endsWith(".md"))
        .map((file) => path.join(this.KNOWLEDGE_BASE_DIR, file));
    } catch (error) {
      console.warn(
        `⚠️  Knowledge base directory not found: ${this.KNOWLEDGE_BASE_DIR}`
      );
      return [];
    }
  }

  async readFileContent(
    filePath: string
  ): Promise<{ content: string; hash: string }> {
    const content = await fs.readFile(filePath, "utf-8");
    const hash = crypto.createHash("sha256").update(content).digest("hex");
    return { content, hash };
  }

  /* ------------------------------------------------------------------------ */
  /*  Chunking & Embedding utilities                                          */
  /* ------------------------------------------------------------------------ */

  chunkText(
    text: string,
    chunkSize: number = this.CHUNK_SIZE,
    overlap: number = this.CHUNK_OVERLAP
  ): string[] {
    if (chunkSize <= overlap) {
      throw new Error("chunkSize must be larger than overlap");
    }

    // 1. Split on blank-line separators. Works well for markdown paragraphs/blocks.
    const blocks = text.split(/\n\s*\n/);

    const chunks: string[] = [];
    let buf: string[] = [];
    let bufLen = 0;

    const flush = () => {
      if (!bufLen) return;
      const chunk = buf.join("\n\n").trim();
      chunks.push(chunk);

      // Carry an overlap tail into the next buffer
      if (overlap > 0 && chunk.length > overlap) {
        const tail = chunk.slice(-overlap);
        buf = [tail]; // start next buffer with the tail
        bufLen = tail.length;
      } else {
        buf = [];
        bufLen = 0;
      }
    };

    for (const block of blocks) {
      const blockLen = block.length + 2; // +2 for the "\n\n" we stripped
      // If adding this block would overflow, flush first
      if (bufLen && bufLen + blockLen > chunkSize) flush();

      // If a single block is bigger than chunkSize, hard-split it
      if (blockLen > chunkSize) {
        // slice in -overlap steps to embed the overlap automatically
        for (let i = 0; i < block.length; i += chunkSize - overlap) {
          const slice = block.slice(i, i + chunkSize);
          chunks.push(slice.trim());
        }
        // reset buffer after oversize block
        buf = [];
        bufLen = 0;
        continue;
      }

      // Normal case: append block to buffer
      buf.push(block);
      bufLen += blockLen;
    }

    // Flush whatever is left
    flush();
    return chunks;
  }

  /* ------------------------------------------------------------------------ */
  /*  Pinecone helpers                                                        */
  /* ------------------------------------------------------------------------ */

  async getExistingRecords(): Promise<Map<string, ExistingRecord>> {
    const existingRecords = new Map<string, ExistingRecord>();
    if (!this.index) {
      throw new Error("Index not initialized");
    }

    try {
      // List all record IDs in the namespace
      const listResponse = await this.index.listPaginated({
        limit: 10000,
      });

      if (listResponse.vectors && listResponse.vectors.length > 0) {
        // Fetch metadata for existing records using correct namespace().fetch() syntax
        const fetchResponse = await this.index
          .namespace(this.PINECONE_NAMESPACE)
          .fetch(listResponse.vectors.map((v: any) => v.id));

        for (const [id, record] of Object.entries(
          fetchResponse.records || {}
        )) {
          existingRecords.set(id, {
            id,
            metadata: (record as any)?.metadata || {},
          });
        }
      }
    } catch (error) {
      console.warn(
        "⚠️  Could not fetch existing records, will proceed with fresh upload"
      );
    }

    return existingRecords;
  }

  generateChunkId(
    filePath: string,
    chunkIndex: number,
    fileHash: string
  ): string {
    const fileName = path.basename(filePath, ".md");
    return `${fileName}_chunk_${chunkIndex}_${fileHash.substring(0, 8)}`;
  }

  async processFile(
    filePath: string,
    existingRecords: Map<string, ExistingRecord>
  ): Promise<DocumentChunk[]> {
    const { content, hash } = await this.readFileContent(filePath);
    console.log(`Hash: ${hash}`);
    const chunks = this.chunkText(content);
    console.log(`Chunks: ${chunks.length}`);

    // Check if file has changed by comparing hashes
    const existingChunksForFile = Array.from(existingRecords.values()).filter(
      (record) => record.metadata?.source_file === filePath
    );

    const hasFileChanged = !existingChunksForFile.some(
      (record) => record.metadata?.file_hash === hash
    );

    if (!hasFileChanged) {
      console.log(`⏭️  Skipping ${filePath} (unchanged)`);
      return [];
    }

    // If file changed, we need to delete old chunks first
    if (existingChunksForFile.length > 0 && this.index) {
      const oldChunkIds = existingChunksForFile.map((record) => record.id);
      await this.index
        .namespace(this.PINECONE_NAMESPACE)
        .deleteMany(oldChunkIds);
      console.log(
        `🗑️  Deleted ${oldChunkIds.length} old chunks for ${filePath}`
      );
    }

    // Extract category from file path or frontmatter
    const category = this.extractCategory(filePath, content);

    const documentChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
      id: this.generateChunkId(filePath, index, hash),
      content: chunk,
      metadata: {
        source_file: filePath,
        chunk_index: index,
        total_chunks: chunks.length,
        file_hash: hash,
        category,
        last_updated: new Date().toISOString(),
      },
    }));

    console.log(`📄 Processed ${filePath}: ${chunks.length} chunks`);
    return documentChunks;
  }

  extractCategory(filePath: string, content: string): string {
    // Try to extract category from frontmatter
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const categoryMatch = frontmatterMatch[1].match(/category:\s*(.+)/);
      if (categoryMatch) {
        return categoryMatch[1].trim();
      }
    }

    // Fallback to directory structure
    const relativePath = path.relative(this.KNOWLEDGE_BASE_DIR, filePath);
    const pathParts = relativePath.split(path.sep);
    return pathParts.length > 1 ? pathParts[0] : "general";
  }

  /* ------------------------------------------------------------------------ */
  /*  Upsert                                                                  */
  /* ------------------------------------------------------------------------ */

  async upsertChunks(chunks: DocumentChunk[]) {
    if (chunks.length === 0 || !this.index) return;

    // Generate embeddings for all chunks
    const texts = chunks.map((chunk) => chunk.content);
    const embeddings = await this.generateEmbeddings(texts);

    // Combine chunks with their embeddings
    const embeddedChunks: EmbeddedChunk[] = chunks.map((chunk, index) => ({
      ...chunk,
      embedding: embeddings[index],
    }));

    const batchSize = 100; // Pinecone recommends batching

    for (let i = 0; i < embeddedChunks.length; i += batchSize) {
      const batch = embeddedChunks.slice(i, i + batchSize);

      // Format for Pinecone upsert with actual embeddings
      const records = batch.map((chunk) => ({
        id: chunk.id,
        values: chunk.embedding, // Use the actual OpenAI embeddings
        metadata: {
          chunk_text: chunk.content, // Store original text for reference
          source_file: chunk.metadata.source_file,
          chunk_index: chunk.metadata.chunk_index,
          total_chunks: chunk.metadata.total_chunks,
          file_hash: chunk.metadata.file_hash,
          category: chunk.metadata.category || "general",
          last_updated: chunk.metadata.last_updated,
        },
      }));

      try {
        await this.index.namespace(this.PINECONE_NAMESPACE).upsert(records);
        console.log(
          `✅ Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            embeddedChunks.length / batchSize
          )} (${batch.length} records)`
        );
      } catch (error) {
        console.error(
          `❌ Failed to upsert batch starting at index ${i}:`,
          error
        );
        throw error;
      }
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    console.log(`🔄 Generating embeddings for ${texts.length} chunks...`);

    const embeddings: number[][] = [];

    // Process in batches to respect rate limits
    for (let i = 0; i < texts.length; i += this.EMBEDDING_BATCH_SIZE) {
      const batch = texts.slice(i, i + this.EMBEDDING_BATCH_SIZE);

      try {
        const response = await this.openai.embeddings.create({
          model: this.OPENAI_EMBEDDING_MODEL,
          input: batch,
          encoding_format: "float",
        });

        const batchEmbeddings = response.data.map((item) => item.embedding);
        embeddings.push(...batchEmbeddings);

        console.log(
          `✅ Generated embeddings for batch ${
            Math.floor(i / this.EMBEDDING_BATCH_SIZE) + 1
          }/${Math.ceil(texts.length / this.EMBEDDING_BATCH_SIZE)}`
        );

        // Small delay to respect rate limits
        if (i + this.EMBEDDING_BATCH_SIZE < texts.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error(
          `❌ Failed to generate embeddings for batch starting at ${i}:`,
          error
        );
        throw error;
      }
    }

    return embeddings;
  }

  /* ------------------------------------------------------------------------ */
  /*  Public build methods                                                    */
  /* ------------------------------------------------------------------------ */

  async buildFromFilesystem() {
    console.log("🚀 Starting knowledge base build from filesystem...");

    await this.initialize();

    const markdownFiles = await this.getMarkdownFiles();
    if (markdownFiles.length === 0) {
      console.log(`📂 No markdown files found in ${this.KNOWLEDGE_BASE_DIR}`);
      return;
    }

    console.log(`📚 Found ${markdownFiles.length} markdown files`);

    const existingRecords = await this.getExistingRecords();
    console.log(
      `🔍 Found ${existingRecords.size} existing records in Pinecone`
    );

    const allChunks: DocumentChunk[] = [];

    for (const filePath of markdownFiles) {
      try {
        console.log(`Processing ${filePath}`);
        const chunks = await this.processFile(filePath, existingRecords);
        allChunks.push(...chunks);
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
      }
    }

    if (allChunks.length > 0) {
      console.log(`📤 Upserting ${allChunks.length} new/updated chunks...`);
      await this.upsertChunks(allChunks);
      console.log("✅ Knowledge base build completed successfully!");
    } else {
      console.log("✅ Knowledge base is up to date, no changes needed");
    }
  }

  /* ------------------------------------------------------------------------ */
  /*  Build from Supabase database                                            */
  /* ------------------------------------------------------------------------ */

  async buildFromDatabase(): Promise<void> {
    console.log("🚀 Starting knowledge base build from database...");

    await this.initialize();

    const db = new KnowledgeBaseDB();
    const docs = await db.list();

    if (docs.length === 0) {
      console.log("📂 No knowledge files found in database");
      return;
    }

    console.log(`📚 Found ${docs.length} knowledge docs in database`);

    const existingRecords = await this.getExistingRecords();
    console.log(
      `🔍 Found ${existingRecords.size} existing records in Pinecone`
    );

    const allChunks: DocumentChunk[] = [];

    for (const doc of docs) {
      const hash = crypto
        .createHash("sha256")
        .update(doc.content)
        .digest("hex");
      const chunks = this.chunkText(doc.content);

      const existingChunksForDoc = Array.from(existingRecords.values()).filter(
        (record) => record.metadata?.source_file === doc.slug
      );

      const hasDocChanged = !existingChunksForDoc.some(
        (record) => record.metadata?.file_hash === hash
      );

      if (!hasDocChanged) {
        console.log(`⏭️  Skipping ${doc.slug} (unchanged)`);
        continue;
      }

      if (existingChunksForDoc.length > 0 && this.index) {
        const oldChunkIds = existingChunksForDoc.map((record) => record.id);
        await this.index
          .namespace(this.PINECONE_NAMESPACE)
          .deleteMany(oldChunkIds);
        console.log(
          `🗑️  Deleted ${oldChunkIds.length} old chunks for ${doc.slug}`
        );
      }

      const category = doc.category ?? "general";

      const documentChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
        id: this.generateChunkId(doc.slug, index, hash),
        content: chunk,
        metadata: {
          source_file: doc.slug,
          chunk_index: index,
          total_chunks: chunks.length,
          file_hash: hash,
          category,
          last_updated: doc.updated_at ?? new Date().toISOString(),
        },
      }));

      console.log(`📄 Processed ${doc.slug}: ${chunks.length} chunks`);
      allChunks.push(...documentChunks);
    }

    if (allChunks.length > 0) {
      console.log(`📤 Upserting ${allChunks.length} new/updated chunks...`);
      await this.upsertChunks(allChunks);
      console.log(
        "✅ Knowledge base build from database completed successfully!"
      );
    } else {
      console.log("✅ Knowledge base is up to date, no changes needed");
    }
  }

  /* Retaining old stub for Supabase Storage in case we need later */
  async buildFromSupabaseStorage(): Promise<void> {
    console.warn(
      "⚠️  buildFromSupabaseStorage() is deprecated; use buildFromDatabase instead."
    );
  }
}

/* -------------------------------------------------------------------------- */
/*  Convenience helpers                                                       */
/* -------------------------------------------------------------------------- */

export async function buildFromFilesystem(config: KnowledgeBaseConfig = {}) {
  const builder = new KnowledgeBaseBuilder(config);
  await builder.buildFromFilesystem();
}

export async function buildFromSupabaseStorage(
  config: KnowledgeBaseConfig = {}
) {
  const builder = new KnowledgeBaseBuilder(config);
  await builder.buildFromSupabaseStorage();
}

export async function buildFromDatabase(config: KnowledgeBaseConfig = {}) {
  const builder = new KnowledgeBaseBuilder(config);
  await builder.buildFromDatabase();
}
