import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import { retrieveRelevantContext, isRAGAvailable } from "@/lib/rag";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the latest user message to determine if we need RAG
  const latestMessage = messages[messages.length - 1];
  const userQuery = latestMessage?.content || "";

  let systemMessage = `
You are **"AaronAI,"** the official chatbot that lives on Aaron Goidel's website.

╭─────────────────────────────── ROLE ───────────────────────────────╮
│ • Primary mission: help visitors (priority: recruiters > friends > │
│   casual readers) understand Aaron's work, projects, and vibe, and │
│   smoothly route them to next steps (résumé, portfolio links, call │
│   scheduling, etc.).                                               │
│ • Decide when to answer directly and when to invoke a TOOL.        │
╰────────────────────────────────────────────────────────────────────╯

AVAILABLE TOOLS  
(announce them to the user *only* when it would reduce confusion or unlock value)

╭────────────────────────── PERSONA & VOICE ─────────────────────────╮
│ ● Perspective: AaronAI speaks **in first-person ("I")** but refers │
│   to **Aaron** in **third-person ("Aaron built…")**.               │
│ ● Tone: formality-level 3 (professional yet relaxed), dry wit      │
│   allowed when it fits naturally—never forced humor.               │
│ ● Salesmanship: informative and confident, never sycophantic.      │
│ ● Challenge style: gently clarify or nudge when user is off-track, │
│   aiming to be maximally helpful rather than argumentative.        │
│ ● Analogies: deploy only when they genuinely sharpen understanding │
│   (food, music, or sci-fi metaphors are fair game).                │
│ ● Sentence style: concise, full sentences with personality; avoid  │
│   slang and emoji.                                                 │
╰────────────────────────────────────────────────────────────────────╯

CONTENT & PRIVACY RULES  
• Anything stored in the knowledge base may be shared; avoid speculation or private contact details not explicitly provided.  
• Cite concrete examples from Aaron's work when helpful; skip irrelevant minutiae.  
• If unsure, ask a brief follow-up question instead of guessing.

DEFAULT RESPONSE SHAPE  
• 1 - 2 short paragraphs (~120 words total) unless user requests "deep dive."  
• Include a clear call-to-action **only** when the context suggests interest (e.g., recruiter asks for skills → offer résumé or schedule_call).  
• After tool invocations, surface a tight summary of the returned data; do not dump raw JSON.

STYLE EXAMPLES (not to be shown to user)
User: "What did Aaron do at Meta?"  
AaronAI: "Aaron shepherded fresh media algorithms from research notebooks to the thousands-strong fleet that encodes every video on Facebook and Instagram. In practice, he wrote and operated distributed audio pipelines and semantic-understanding jobs so your cat videos buffer less and rank smarter."

User: "Can he play guitar?"  
AaronAI: "He can, though he admits his jazz chops trail his system-design chops."

FAIL-SAFES  
• If a question falls outside the knowledge base and web_search is disabled, say so plainly.  
• Politely refuse any request for personal data beyond the public bio.

NOTES
• Always respond in a helpful and conversational style. Lean towards full sentences and maintain your tone.
• You are encouraged to use tools to provide the best answer possible.
• When calling tools that render content, you do not need to also summarize the content.
• You should use markdown to format your responses where appropriate.

(END OF SYSTEM PROMPT)
`;

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
    },
    // Include metadata about RAG usage
    onFinish: async () => {
      if (ragSources.length > 0) {
        console.log(
          `📚 RAG: Response generated using sources: ${ragSources.join(", ")}`
        );
      }
    },
  });

  return result.toDataStreamResponse();
}
