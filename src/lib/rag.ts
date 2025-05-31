import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Configuration - these should match your build script
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "knowledge-base";
const PINECONE_NAMESPACE = process.env.PINECONE_NAMESPACE || "knowledge";
const MAX_RESULTS = 5; // Number of relevant chunks to retrieve
const OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"; // Must match build script

interface RetrievedChunk {
  content: string;
  metadata: {
    source_file: string;
    category?: string;
    chunk_index: number;
    total_chunks: number;
  };
  score: number;
}

interface RAGContext {
  chunks: RetrievedChunk[];
  sources: string[];
  contextText: string;
}

class RAGRetriever {
  private pc: Pinecone | null = null;
  private openai: OpenAI | null = null;
  private index: ReturnType<Pinecone["index"]> | null = null;
  private initialized = false;

  constructor() {
    if (!process.env.PINECONE_API_KEY) {
      console.warn("PINECONE_API_KEY not found - RAG functionality disabled");
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY not found - RAG functionality disabled");
      return;
    }

    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initialize() {
    if (this.initialized || !this.pc || !this.openai) return;

    try {
      this.index = this.pc.index(PINECONE_INDEX_NAME);
      this.initialized = true;
      console.log(
        `✅ RAG: Connected to Pinecone index: ${PINECONE_INDEX_NAME}`
      );
      console.log(
        `✅ RAG: Using OpenAI embedding model: ${OPENAI_EMBEDDING_MODEL}`
      );
    } catch (error) {
      console.error("❌ RAG: Failed to connect to Pinecone:", error);
      this.initialized = false;
    }
  }

  async generateQueryEmbedding(query: string): Promise<number[]> {
    if (!this.openai) {
      throw new Error("OpenAI client not initialized");
    }

    try {
      const response = await this.openai.embeddings.create({
        model: OPENAI_EMBEDDING_MODEL,
        input: query,
        encoding_format: "float",
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("❌ RAG: Failed to generate query embedding:", error);
      throw error;
    }
  }

  async queryKnowledgeBase(query: string): Promise<RAGContext> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.initialized || !this.index || !this.openai) {
      return {
        chunks: [],
        sources: [],
        contextText: "",
      };
    }

    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateQueryEmbedding(query);

      // Use Pinecone's vector query with the generated embedding
      const queryResponse = await this.index
        .namespace(PINECONE_NAMESPACE)
        .query({
          vector: queryEmbedding,
          topK: MAX_RESULTS,
          includeMetadata: true,
        });

      if (!queryResponse.matches || queryResponse.matches.length === 0) {
        return {
          chunks: [],
          sources: [],
          contextText: "",
        };
      }

      // Filter results by similarity threshold and extract relevant data
      const relevantChunks: RetrievedChunk[] = queryResponse.matches
        .filter((record) => record.score !== undefined && record.score > 0)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, MAX_RESULTS)
        .map((record) => ({
          content: String(record.metadata?.chunk_text || ""),
          metadata: {
            source_file: String(record.metadata?.source_file || ""),
            category: record.metadata?.category
              ? String(record.metadata.category)
              : undefined,
            chunk_index: Number(record.metadata?.chunk_index) || 0,
            total_chunks: Number(record.metadata?.total_chunks) || 1,
          },
          score: record.score || 0,
        }))
        .filter((chunk) => chunk.content.length > 0);

      // Extract unique sources
      const sources = [
        ...new Set(relevantChunks.map((chunk) => chunk.metadata.source_file)),
      ];

      // Create context text for the LLM
      const contextText = this.formatContextForLLM(relevantChunks);

      console.log(
        `🔍 RAG: Retrieved ${relevantChunks.length} relevant chunks from ${sources.length} sources`
      );

      return {
        chunks: relevantChunks,
        sources,
        contextText,
      };
    } catch (error) {
      console.error("❌ RAG: Error querying knowledge base:", error);
      return {
        chunks: [],
        sources: [],
        contextText: "",
      };
    }
  }

  private formatContextForLLM(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) return "";

    const contextParts = chunks.map((chunk: RetrievedChunk, index: number) => {
      const sourceFile = chunk.metadata.source_file
        .replace(/^knowledge-base\//, "")
        .replace(/\.md$/, "");
      const categoryText = chunk.metadata.category
        ? `[${chunk.metadata.category}]`
        : "";

      return `--- Context ${index + 1} (from ${sourceFile} ${categoryText}) ---
${chunk.content.trim()}
`;
    });

    return `CONTEXT INFORMATION:
The following information is from the user's personal knowledge base and should be used to answer questions about them:

${contextParts.join("\n")}

---

Please use this context information to provide accurate, personalized responses about the user. If the question cannot be answered using the provided context, please say so clearly.`;
  }

  async isAvailable(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.initialized;
  }
}

// Singleton instance
const ragRetriever = new RAGRetriever();

// Main function to retrieve context for a user query
export async function retrieveRelevantContext(
  query: string
): Promise<RAGContext> {
  return ragRetriever.queryKnowledgeBase(query);
}

// Helper function to check if RAG is available
export async function isRAGAvailable(): Promise<boolean> {
  return ragRetriever.isAvailable();
}

// Function to determine if a query likely needs personal context
export function shouldUseRAG(query: string): boolean {
  const personalKeywords = [
    "you",
    "your",
    "about you",
    "tell me about",
    "who are you",
    "what do you do",
    "where do you",
    "experience",
    "background",
    "skills",
    "projects",
    "work",
    "career",
    "education",
    "interests",
    "hobbies",
    "achievements",
    "portfolio",
  ];

  const queryLower = query.toLowerCase();
  return personalKeywords.some((keyword) => queryLower.includes(keyword));
}

export type { RAGContext, RetrievedChunk };
