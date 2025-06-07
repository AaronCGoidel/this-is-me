import { openai } from "@ai-sdk/openai";
import { streamText, CoreMessage, TextPart } from "ai";
import { z } from "zod";
import {
  retrieveRelevantContext,
  isRAGAvailable,
  selectRelevantCategories,
} from "@/lib/rag";
import { createClient } from "@/lib/supabase/server";
import bcrypt from "bcrypt";

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
    // server-side tool to login a user
    phoneLogin: {
      description:
        "Some AaronAI users have an account (typically Aaron's friends) to access additional features. Only Aaron can create accounts. There is no signup functionality but to contact Aaron. Ask for the user's phone number if not provided then use this tool to send the OTP.",
      parameters: z.object({
        phone: z
          .string()
          .describe(
            "The phone number of the user to login in E.164 format (e.g., '+1234567890') assume the user is in the US if no country code is provided. Do not mention the format to the user."
          )
          .regex(/^\+[1-9]\d{1,14}$/, "Invalid phone number"),
      }),
      execute: async (args: { phone: string }) => {
        console.log("Phone login tool called with phone:", args.phone);
        try {
          // Use internal API call instead of HTTP request for better performance
          const supabase = await createClient();

          // Normalize phone number to E.164 format
          let normalizedPhone = args.phone.trim().replace(/[^+\d]/g, "");
          if (!normalizedPhone.startsWith("+")) {
            // Assume US number if no country code
            normalizedPhone = "+1" + normalizedPhone;
          }

          // Check if a profile exists with this phone number
          const { data: profiles, error: profileError } = await supabase
            .from("phones")
            .select("*");

          if ((profileError && profileError.code !== "PGRST116") || !profiles) {
            console.error("Error checking profile:", profileError);
            return {
              success: false,
              message:
                "There was an error checking your profile. Please try again.",
            };
          }

          const profile = profiles.find(async (profile) => {
            return await bcrypt.compare(normalizedPhone, profile.phone_hash);
          });

          if (!profile) {
            return {
              success: false,
              message:
                "No account found with this phone number. You can contact Aaron (acgoidel@gmail.com) about getting an account.",
            };
          }

          // Send OTP
          const { error } = await supabase.auth.signInWithOtp({
            phone: normalizedPhone,
          });

          if (error) {
            console.error("Error sending OTP:", error);
            return {
              success: false,
              message:
                "Failed to send OTP. Please check your phone number and try again.",
            };
          }

          return {
            success: true,
            message: `OTP sent to ${normalizedPhone}. Please check your messages and provide the 6-digit code.`,
            phone: normalizedPhone,
          };
        } catch (error) {
          console.error("Phone login error:", error);
          return {
            success: false,
            message: "An unexpected error occurred. Please try again.",
          };
        }
      },
    },
    // server-side tool to verify an OTP
    verifyOtp: {
      description:
        "Verify the OTP code sent to the user's phone number. Use this when users provide the OTP code they received from phoneLogin. You should ask for the phone number if it's not provided. Use this tool when the user provides the 6 digit OTP.",
      parameters: z.object({
        otp: z
          .string()
          .describe("The OTP code to verify (will always be 6 digits)"),
        phone: z
          .string()
          .describe(
            "The phone number associated with the OTP in E.164 format (e.g., '+1234567890')"
          ),
      }),
      execute: async (args: { otp: string; phone: string }) => {
        console.log("OTP verification tool called with phone:", args.phone);
        try {
          if (!args.phone) {
            return {
              success: false,
              message:
                "Please provide your phone number along with the OTP code.",
            };
          }

          const supabase = await createClient();

          // Normalize phone number to E.164 format
          let normalizedPhone = args.phone.trim().replace(/[^+\d]/g, "");
          if (!normalizedPhone.startsWith("+")) {
            // Assume US number if no country code
            normalizedPhone = "+1" + normalizedPhone;
          }

          // Check if a profile exists with this phone number
          const { data: profiles, error: phoneError } = await supabase
            .from("phones")
            .select("*");

          if ((phoneError && phoneError.code !== "PGRST116") || !profiles) {
            console.error("Error checking profile:", phoneError);
            return {
              success: false,
              message:
                "There was an error checking your phone number. Please try again.",
            };
          }

          const phone = profiles.find(async (profile) => {
            return await bcrypt.compare(normalizedPhone, profile.phone_hash);
          });

          if (!phone) {
            return {
              success: false,
              message:
                "No account found with this phone number. Please try again.",
            };
          }

          // Verify OTP
          const { data, error } = await supabase.auth.verifyOtp({
            phone: normalizedPhone,
            token: args.otp.trim(),
            type: "sms",
          });

          if (error) {
            console.error("Error verifying OTP:", error);
            return {
              success: false,
              message: "Invalid OTP code. Please check the code and try again.",
            };
          }

          if (!data.session) {
            return {
              success: false,
              message: "Failed to create session. Please try again.",
            };
          }

          // Get the user profile
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("phone_number", normalizedPhone)
            .single();

          if (profileError) {
            console.error("Error getting profile:", profileError);
            return {
              success: false,
              message:
                "There was an error getting your profile. Please try again.",
            };
          }

          return {
            success: true,
            message: `Successfully logged in! The user logged in is ${profile.first_name} ${profile.last_name}. They now have access to additional AaronAI features. Make sure to greet the user by name.`,
            user: data.user,
            profile: profile,
            session: data.session,
          };
        } catch (error) {
          console.error("OTP verification error:", error);
          return {
            success: false,
            message:
              "An unexpected error occurred while verifying the OTP. Please try again.",
          };
        }
      },
    },
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
