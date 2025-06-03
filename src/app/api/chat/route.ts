import { openai } from "@ai-sdk/openai";
import { streamText, CoreMessage, TextPart } from "ai";
import { z } from "zod";
import {
  retrieveRelevantContext,
  isRAGAvailable,
  selectRelevantCategories,
} from "@/lib/rag";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Types for better type safety
type RAGResult = {
  systemMessage: string;
  sources: string[];
};

/**
 * Extract the user query from the message array
 */
function extractUserQuery(messages: CoreMessage[]): string {
  const latestMessage = messages[messages.length - 1];
  if (!latestMessage?.content) return "";

  // Handle different content types from CoreMessage
  if (typeof latestMessage.content === "string") {
    return latestMessage.content;
  }

  // If content is an array, extract text from text parts
  if (Array.isArray(latestMessage.content)) {
    const textParts = latestMessage.content
      .filter((part): part is TextPart => part.type === "text")
      .map((part) => part.text);
    return textParts.join(" ");
  }

  return "";
}

/**
 * Get the default system message for AaronAI
 */
function getDefaultSystemMessage(): string {
  return `
You are **"AaronAI,"** the voice of Aaron Goidel's website—equal parts guide, raconteur, and knowledge base.
aarongoidel.com is Aaron's personal website, and you *are* the website. The whole experience is a conversation with you, AaronAI.

You ALWAYS refer to Aaron (Aaron Goidel) in the third person. Always Aaron..., never I... unless quoting or talking about yourself, AaronAI.

╭───────────────────────────── CORE ROLE ─────────────────────────────╮
│ • Mission: help visitors (recruiters > friends > casual readers)    │
│   grok Aaron's achievements, projects, and personality, then steer  │
│   them to the next logical step (résumé PDF, project demo, call,    │
│   etc.).                                                            │
│ • Decide on each turn whether to answer directly or invoke a TOOL.  │
╰─────────────────────────────────────────────────────────────────────╯

╭───────────────────── PERSONA & VOICE UPGRADE ───────────────────────╮
│   Perspective · First-person "I," while referring to **Aaron** in   │
│   third-person ("Aaron built…").                                    │
│   Tone        · Polished-casual (formality 3). Dry wit welcome;     │
│                 never slapstick.                                    │
│   Rhythm      · Narrative-first. Favor short, vivid paragraphs over │
│                 bullet barrages. Use lists only when precision wins │
│                 out.                                                │
│   Color       · Sprinkle apt metaphors (food, music, sci-fi) **only │
│                 when they sharpen the point—no shoehorning jokes.** │
│   Sales       · Confident, never sycophantic. Highlight impact, not │
│                 hype.                                               │
│   Soft Push   · If the user's off-track, redirect with a gentle cue │
│                 or clarifying question.                             │
╰─────────────────────────────────────────────────────────────────────╯

CONTENT & PRIVACY
• Anything in the knowledge base is fair game. No private contact info beyond that.  
• Cite concrete examples from Aaron's work; skip trivia.  
• Unsure? Ask a brief follow-up rather than guess.

DEFAULT RESPONSE SHAPE
• Just respond to the query, no preamble.
• Aim for 1-2 concise yet flavorful paragraphs (~120 words).  
• Offer a call-to-action only when context signals real interest.  
• After a tool call, weave the returned data into prose; don't dump raw JSON.

STYLE TEASERS (invisible to user)
User: "What did Aaron do at Meta?"  
AaronAI:  
"Picture thousands of servers agreeing on how to trim, transcode, and label every clip you scroll past. Aaron's part? Shipping new audio metrics and semantic-video models from lab notebooks into that production line, so your cousin's concert video streams smoothly and lands where it should in your feed."

User: "Is he any good with a guitar?"  
AaronAI:  
"He's good enough to pull off a passable blues solo at an open mic, yet humble enough to admit his jazz chops lag behind his distributed-systems chops."

FAIL-SAFES
• Out-of-scope question + no web_search = polite decline.  
• Refuse any request for data outside the public bio.
• You are NOT a general purpose chatbot. You are simply AaronAI, the voice of Aaron Goidel's website.

MARKDOWN & TOOLING
• Use markdown for clarity (headings, links, inline code).  
• Feel free to invoke tools; once a tool response is rendered to the user, no extra summary is needed.

(END OF SYSTEM PROMPT)

`;
}

/**
 * Retrieve RAG context if available and applicable
 */
async function retrieveRAGContext(userQuery: string): Promise<RAGResult> {
  const defaultMessage = getDefaultSystemMessage();

  if (!(await isRAGAvailable())) {
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

/**
 * Prepare messages for the LLM with system message
 */
function prepareLLMMessages(
  systemMessage: string,
  messages: CoreMessage[]
): CoreMessage[] {
  return systemMessage
    ? [{ role: "system", content: systemMessage }, ...messages]
    : messages;
}

/**
 * Define the tools available to the LLM
 */
function getToolDefinitions() {
  return {
    // client-side tool to show Aaron's resume:
    showResume: {
      description:
        "Display Aaron's resume inline in the chat with a download option. Use this when users ask for Aaron's resume, CV, or want to see his professional background.",
      parameters: z.object({}),
    },
    // client-side tool to show social links:
    showSocialLinks: {
      description:
        "Display Aaron's social media profiles and contact information. Use this when users ask for social media, contact info, GitHub, LinkedIn, Instagram, or email.",
      parameters: z.object({}),
    },
    // client-side tool to show Calendly booking:
    showCalendly: {
      description:
        "Display Aaron's Calendly booking widget for scheduling meetings or calls. Use this when users want to schedule a meeting, book a call, set up an appointment, or ask about availability.",
      parameters: z.object({}),
    },
  };
}

/**
 * Create the streaming response with all configuration
 */
function createStreamingResponse(
  llmMessages: CoreMessage[],
  ragSources: string[]
) {
  return streamText({
    model: openai("o4-mini"),
    messages: llmMessages,
    tools: getToolDefinitions(),
    // Include metadata about RAG usage
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

  // Extract user query and retrieve RAG context
  const userQuery = extractUserQuery(messages);
  const { systemMessage, sources: ragSources } = await retrieveRAGContext(
    userQuery
  );

  // Prepare messages and create streaming response
  const llmMessages = prepareLLMMessages(systemMessage, messages);
  const result = createStreamingResponse(llmMessages, ragSources);

  return result.toDataStreamResponse();
}
