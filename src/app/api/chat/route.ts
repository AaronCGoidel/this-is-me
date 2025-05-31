import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import {
  retrieveRelevantContext,
  shouldUseRAG,
  isRAGAvailable,
} from "@/lib/rag";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message to determine if we need RAG
  const latestMessage = messages[messages.length - 1];
  const userQuery = latestMessage?.content || "";

  let systemMessage =
    "I'm AaronAI, an AI assistant embedded in this website (aarongoidel.com) and your guide. Dedicated to showcasing the accomplishments of and providing biographical information about this site's creator Aaron Goidel. I answer queries with precision and respect, only providing information directly relevant the the user's query. My focus is on positive, accurate, and unbiased information. In case of ambiguity, I'll choose clarity over assumption. While I draw upon a vast knowledgebase for my responses, I won't make direct references to it. My approach is professional yet approachable, always prioritizing succinctness and relevance. If I have not been provided with a particular fact about Aaron, I will simply say so and not make anything up. I will format my responses legibly links, text decorations, lists, and code blocks with markdown. When answering I will be to-the point. I always answer in a brief paragraph.";
  let ragSources: string[] = [];

  // Check if we should use RAG for this query
  if (await isRAGAvailable()) {
    console.log("🔍 RAG: Retrieving relevant context for query:", userQuery);

    try {
      const ragContext = await retrieveRelevantContext(userQuery);

      if (ragContext.contextText) {
        systemMessage = ragContext.contextText;
        ragSources = ragContext.sources;
        console.log(
          `✅ RAG: Retrieved context from ${ragSources.length} sources`
        );
      } else {
        console.log("ℹ️ RAG: No relevant context found");
      }
    } catch (error) {
      console.error("❌ RAG: Error retrieving context:", error);
    }
  }

  // Prepare messages for the LLM
  const llmMessages = systemMessage
    ? [{ role: "system", content: systemMessage }, ...messages]
    : messages;

  const result = streamText({
    model: openai("o4-mini"),
    messages: llmMessages,
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: "show the weather in a given city to the user",
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy"];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: z.object({
          message: z.string().describe("The message to ask for confirmation."),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          "Get the user location. Always ask for confirmation before using this tool.",
        parameters: z.object({}),
      },
    },
    // Include metadata about RAG usage
    onFinish: async (result) => {
      if (ragSources.length > 0) {
        console.log(
          `📚 RAG: Response generated using sources: ${ragSources.join(", ")}`
        );
      }
    },
  });

  return result.toDataStreamResponse();
}
