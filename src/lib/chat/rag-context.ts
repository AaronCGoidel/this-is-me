import {
  retrieveRelevantContext,
  isRAGAvailable,
  selectRelevantCategories,
  shouldUseRAG,
} from "@/lib/rag";
import { getSystemMessage } from "./system-message";
import { Profile } from "@/contexts/UserContext";
import { createClient } from "@/lib/supabase/server";

export type RAGResult = {
  systemMessage: string;
  sources: string[];
};

const getUserProfile = async (user_id?: string): Promise<Profile | null> => {
  if (!user_id) {
    return null;
  }

  const supabase = await createClient();
  const { data: user_profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();

  if (error) {
    throw new Error("Error getting user profile");
  }

  return user_profile;
};

/**
 * Retrieve RAG context if available and applicable
 */
export async function retrieveRAGContext(
  userQuery: string,
  user_id?: string
): Promise<RAGResult> {
  const user_profile = await getUserProfile(user_id);
  const defaultMessage = getSystemMessage(user_profile);

  const ragAvailable = await isRAGAvailable();
  const useRag = ragAvailable && (await shouldUseRAG(userQuery));

  if (!useRag) {
    return {
      systemMessage: defaultMessage,
      sources: [],
    };
  }

  console.log("🔍 RAG: Retrieving relevant context for query:", userQuery);

  try {
    // Classify which categories to search within the knowledge base
    const relevantCategories = await selectRelevantCategories(userQuery);
    if (relevantCategories.length > 0) {
      console.log(
        `📂 RAG: Limiting search to categories: ${relevantCategories.join(
          ", "
        )}`
      );
    }

    const ragContext = await retrieveRelevantContext(
      userQuery,
      relevantCategories
    );

    if (ragContext.contextText) {
      console.log(
        `✅ RAG: Retrieved context from ${ragContext.sources.length} sources`
      );
      return {
        systemMessage: `${defaultMessage}\n${ragContext.contextText}`,
        sources: ragContext.sources,
      };
    } else {
      console.log("ℹ️ RAG: No relevant context found");
      return {
        systemMessage: defaultMessage,
        sources: [],
      };
    }
  } catch (error) {
    console.error("❌ RAG: Error retrieving context:", error);
    return {
      systemMessage: defaultMessage,
      sources: [],
    };
  }
}
