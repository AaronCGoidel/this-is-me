"use client";

import { useChat } from "@ai-sdk/react";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import HamburgerMenu from "../components/HamburgerMenu";
import WelcomeScreen from "../components/WelcomeScreen";
import LoadingIndicator from "../components/LoadingIndicator";
import Header from "@/components/Header";
import { BackdropProvider } from "@/components/BackdropProvider";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    isLoading,
    stop,
    setMessages,
    append,
  } = useChat({
    maxSteps: 5,

    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      console.log(`toolCall: ${JSON.stringify(toolCall)}`);
      if (toolCall.toolName === "getLocation") {
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
        const city = cities[Math.floor(Math.random() * cities.length)];
        return city;
      }

      if (toolCall.toolName === "showResume") {
        // Return immediately so the tool doesn't block subsequent messages
        return "Resume displayed successfully";
      }

      if (toolCall.toolName === "showSocialLinks") {
        // Return immediately so the tool doesn't block subsequent messages
        const args = toolCall.args as { platforms?: string[] };
        const platforms = args.platforms || [
          "github",
          "linkedin",
          "instagram",
          "email",
        ];
        return `The chat ui has been updated to display Aaron's social links: ${platforms.join(
          ", "
        )}`;
      }

      if (toolCall.toolName === "showCalendly") {
        // Return immediately so the tool doesn't block subsequent messages
        return "Calendly booking widget displayed successfully";
      }
    },
  });

  const handlePromptClick = (prompt: string) => {
    append({
      role: "user",
      content: prompt,
    });
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  const handleToolResult = (toolCallId: string, result: string) => {
    addToolResult({ toolCallId, result });
  };

  const isEmptyChat = messages.length === 0;

  return (
    <BackdropProvider>
      <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
        <Header
          handlePromptClick={handlePromptClick}
          handleResetChat={handleResetChat}
        />

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {isEmptyChat ? (
            <WelcomeScreen onPromptClick={handlePromptClick} />
          ) : (
            <ChatMessages messages={messages} onToolResult={handleToolResult} />
          )}
        </div>

        {isLoading && <LoadingIndicator onStop={stop} />}

        <div className="flex-shrink-0">
          <ChatInput
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </BackdropProvider>
  );
}
