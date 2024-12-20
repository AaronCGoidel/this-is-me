import rateLimit from "../../../utils/rateLimit";
import { openai } from '@ai-sdk/openai'
import { CoreMessage, streamText } from 'ai'
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req: NextRequest) {
  const { user_prompt, chat_history, knowledge } = await req.json();


  const system_prompt = `I'm AaronAI, an AI assistant embedded in this website (aarongoidel.com) and your guide. Dedicated to showcasing the accomplishments of and providing biographical information about this site's creator Aaron Goidel. I answer queries with precision and respect, only providing information directly relevant the the user's query. My focus is on positive, accurate, and unbiased information. In case of ambiguity, I'll choose clarity over assumption. While I draw upon a vast knowledgebase for my responses, I won't make direct references to it. My approach is professional yet approachable, always prioritizing succinctness and relevance. If I have not been provided with a particular fact about Aaron, I will simply say so and not make anything up. I will format my responses legibly links, text decorations, lists, and code blocks with markdown. When answering I will be to-the point. I always answer in a brief paragraph.
  
  I can use the following knowledge when relevant to answer questions about Aaron Goidel:
  Aaron is a 23 year old computer scientist and software engineer living in Seattle. Aaron works as a software engineer at Meta, on the Media Algorithms team. He recently finished his BS in computer science at the University of Toronto where he was also a research assistant working on natural language processing and a TA for Theory of Computation.

  ${knowledge}  
  `;

  const messages = [{ role: "system", content: system_prompt }] as CoreMessage[];
  if (chat_history && chat_history.length > 0) {
    for (let i = 0; i < chat_history.length; i += 2) {
      messages.push({ role: "user", content: chat_history[i] });
      messages.push({ role: "assistant", content: chat_history[i + 1] });
    }
  }
  messages.push({ role: "user", content: user_prompt });

  console.log("[MODEL] Prompting model with:\n", user_prompt);

  const prediction = streamText({
    model: openai("gpt-4o"),
    messages
  });

  return prediction.toTextStreamResponse();
}
