import { openai } from "@ai-sdk/openai";
import { streamText, CoreMessage } from "ai";
import { extractUserQuery, prepareLLMMessages } from "@/lib/chat/utils";
import { retrieveRAGContext } from "@/lib/chat/rag-context";
import { getToolDefinitions } from "@/lib/chat/tools";
import { createClient } from "@/lib/supabase/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function createStreamingResponse(
  llmMessages: CoreMessage[],
  ragSources: string[]
) {
  return streamText({
    model: openai("gpt-5.1"),
    messages: llmMessages,
    tools: getToolDefinitions(),
    onFinish: async () => {
      if (ragSources.length > 0) {
        console.log(
          `📚 RAG: Response generated using sources: ${ragSources.join(", ")}`
        );
      }
    },
  });
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the current user (if any) from the Supabase session cookies
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId: string | undefined = session?.user?.id;

  // Extract user query and enrich with RAG context when available
  const userQuery = extractUserQuery(messages);
  const { systemMessage, sources: ragSources } = await retrieveRAGContext(
    userQuery,
    userId
  );

  // Prepare final message array for the LLM and stream the response
  const llmMessages = prepareLLMMessages(systemMessage, messages);
  const result = createStreamingResponse(llmMessages, ragSources);

  return result.toDataStreamResponse();
}
