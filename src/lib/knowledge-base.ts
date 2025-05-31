import { Pinecone } from "@pinecone-database/pinecone";

export interface KnowledgeBaseConfig {
  indexName: string;
  namespace: string;
  topK?: number;
}

export interface QueryResult {
  content: string;
  metadata: {
    source_file: string;
    category: string;
    chunk_index: number;
    total_chunks: number;
  };
  score: number;
}

export class KnowledgeBaseQuery {
  private pc: Pinecone;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private index: any;
  private config: KnowledgeBaseConfig;

  constructor(config: KnowledgeBaseConfig) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("PINECONE_API_KEY environment variable is required");
    }

    this.pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.config = {
      topK: 5,
      ...config,
    };

    this.index = this.pc.index(this.config.indexName);
  }

  /**
   * Query the knowledge base with a text query
   * Uses Pinecone's query functionality with integrated embeddings
   */
  async query(
    queryText: string,
    options?: {
      topK?: number;
      category?: string;
      includeMetadata?: boolean;
    }
  ): Promise<QueryResult[]> {
    const topK = options?.topK || this.config.topK;

    try {
      // Build filter if category is specified
      const filter = options?.category
        ? {
            category: { $eq: options.category },
          }
        : undefined;

      // Query using text (Pinecone will convert to embeddings automatically)
      const queryResponse = await this.index.query({
        queryText,
        topK,
        namespace: this.config.namespace,
        includeMetadata: options?.includeMetadata ?? true,
        filter,
      });

      // Transform results
      const results: QueryResult[] =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryResponse.matches?.map((match: any) => ({
          content: String(match.metadata?.chunk_text || ""),
          metadata: {
            source_file: String(match.metadata?.source_file || ""),
            category: String(match.metadata?.category || ""),
            chunk_index: Number(match.metadata?.chunk_index) || 0,
            total_chunks: Number(match.metadata?.total_chunks) || 1,
          },
          score: match.score || 0,
        })) || [];

      return results;
    } catch (error) {
      console.error("Error querying knowledge base:", error);
      throw new Error("Failed to query knowledge base");
    }
  }

  /**
   * Get all available categories from the knowledge base
   */
  async getCategories(): Promise<string[]> {
    try {
      // This is a simplified approach - in a real implementation,
      // you might want to maintain a separate index of categories
      // or use Pinecone's metadata filtering capabilities more extensively

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const queryResponse = await (this.index as any).query({
        vector: new Array(1536).fill(0), // Use dummy vector instead of queryText
        topK: 100,
        namespace: this.config.namespace,
        includeMetadata: true,
      });

      const categories = new Set<string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryResponse.matches?.forEach((match: any) => {
        if (match.metadata?.category) {
          categories.add(String(match.metadata.category));
        }
      });

      return Array.from(categories).sort();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  /**
   * Search for information and return formatted context for AI
   */
  async getContextForAI(
    query: string,
    options?: {
      maxChunks?: number;
      category?: string;
    }
  ): Promise<string> {
    const maxChunks = options?.maxChunks || 3;

    const results = await this.query(query, {
      topK: maxChunks,
      category: options?.category,
    });

    if (results.length === 0) {
      return "No relevant information found in the knowledge base.";
    }

    // Format results for AI consumption
    const context = results
      .map((result, index) => {
        const source = result.metadata.source_file.replace(
          "knowledge-base/",
          ""
        );
        return `Source ${index + 1} (${source}, ${result.metadata.category}):
${result.content}`;
      })
      .join("\n\n---\n\n");

    return `Here is relevant information from the knowledge base:

${context}

Please use this information to answer questions about Aaron Goidel.`;
  }
}

// Default instance for easy use
export const createKnowledgeBase = () => {
  return new KnowledgeBaseQuery({
    indexName: process.env.PINECONE_INDEX_NAME || "knowledge-base",
    namespace: process.env.PINECONE_NAMESPACE || "knowledge",
  });
};
