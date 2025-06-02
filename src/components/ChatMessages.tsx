"use client";

import { Message } from "@ai-sdk/react";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
  onToolResult: (toolCallId: string, result: string) => void;
}

export default function ChatMessages({
  messages,
  onToolResult,
}: ChatMessagesProps) {
  const latestMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="px-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          ref={
            message.id === messages[messages.length - 1].id
              ? latestMessageRef
              : null
          }
        >
          <ChatMessage message={message} onToolResult={onToolResult} />
        </div>
      ))}
    </div>
  );
}
