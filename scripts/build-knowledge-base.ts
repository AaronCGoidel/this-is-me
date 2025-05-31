#!/usr/bin/env tsx

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Index, Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Configuration
const KNOWLEDGE_BASE_DIR = "knowledge-base";
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "knowledge-base";
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || "knowledge";
const CHUNK_SIZE = 10000;
const CHUNK_OVERLAP = 200;
const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dimensions
const EMBEDDING_BATCH_SIZE = 100; // OpenAI rate limiting

interface DocumentChunk {
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

class KnowledgeBaseBuilder {
  private pc: Pinecone;
  private openai: OpenAI;
  private index: Index | null = null;

  constructor() {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY environment variable is required");
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initialize() {
    try {
      this.index = this.pc.index(PINECONE_INDEX_NAME);
      console.log(`✅ Connected to Pinecone index: ${PINECONE_INDEX_NAME}`);
      console.log(`✅ Using OpenAI embedding model: ${OPENAI_EMBEDDING_MODEL}`);
    } catch (error) {
      throw new Error(`Failed to connect to Pinecone index: ${error}`);
    }
  }

  async getMarkdownFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(KNOWLEDGE_BASE_DIR, { recursive: true });
      return files
        .filter((file) => file.endsWith(".md"))
        .map((file) => path.join(KNOWLEDGE_BASE_DIR, file));
    } catch (error) {
      console.warn(
        `⚠️  Knowledge base directory not found: ${KNOWLEDGE_BASE_DIR}`
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

  chunkText(
    text: string,
    chunkSize: number = CHUNK_SIZE,
    overlap: number = CHUNK_OVERLAP
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
          .namespace(PINECONE_NAMESPACE)
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
    const fileName = path.basename(filePath, ".md");

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
      await this.index.namespace(PINECONE_NAMESPACE).deleteMany(oldChunkIds);
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
    const relativePath = path.relative(KNOWLEDGE_BASE_DIR, filePath);
    const pathParts = relativePath.split(path.sep);
    return pathParts.length > 1 ? pathParts[0] : "general";
  }

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
        await this.index.namespace(PINECONE_NAMESPACE).upsert(records);
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
    for (let i = 0; i < texts.length; i += EMBEDDING_BATCH_SIZE) {
      const batch = texts.slice(i, i + EMBEDDING_BATCH_SIZE);

      try {
        const response = await this.openai.embeddings.create({
          model: OPENAI_EMBEDDING_MODEL,
          input: batch,
          encoding_format: "float",
        });

        const batchEmbeddings = response.data.map((item) => item.embedding);
        embeddings.push(...batchEmbeddings);

        console.log(
          `✅ Generated embeddings for batch ${
            Math.floor(i / EMBEDDING_BATCH_SIZE) + 1
          }/${Math.ceil(texts.length / EMBEDDING_BATCH_SIZE)}`
        );

        // Small delay to respect rate limits
        if (i + EMBEDDING_BATCH_SIZE < texts.length) {
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

  async build() {
    console.log("🚀 Starting knowledge base build...");

    await this.initialize();

    const markdownFiles = await this.getMarkdownFiles();
    if (markdownFiles.length === 0) {
      console.log(`📂 No markdown files found in ${KNOWLEDGE_BASE_DIR}`);
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
}

// CLI execution
async function main() {
  try {
    const builder = new KnowledgeBaseBuilder();
    await builder.build();
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { KnowledgeBaseBuilder };
