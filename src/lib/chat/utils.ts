import { CoreMessage, TextPart } from "ai";

/**
 * Extract the user query from the message array
 */
export function extractUserQuery(messages: CoreMessage[]): string {
  const latestMessage = messages[messages.length - 1];
  if (!latestMessage?.content) return "";

  // Handle different content types from CoreMessage
  if (typeof latestMessage.content === "string") {
    return latestMessage.content;
  }

  // If content is an array, extract text from text parts
  if (Array.isArray(latestMessage.content)) {
    const textParts = (latestMessage.content as TextPart[])
      .filter((part): part is TextPart => part.type === "text")
      .map((part) => part.text);
    return textParts.join(" ");
  }

  return "";
}

/**
 * Prepend the system message to the conversation if provided
 */
export function prepareLLMMessages(
  systemMessage: string,
  messages: CoreMessage[]
): CoreMessage[] {
  return systemMessage
    ? [{ role: "system", content: systemMessage }, ...messages]
    : messages;
}
