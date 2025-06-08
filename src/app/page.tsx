"use client";

import { useChat } from "@ai-sdk/react";
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import WelcomeScreen from "../components/WelcomeScreen";
import LoadingIndicator from "../components/LoadingIndicator";
import Header from "@/components/Header";
import { BackdropProvider } from "@/components/BackdropProvider";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "@/contexts/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

export default function Chat() {
  const { profile, loading, profileLoading, updateSession, signOut } =
    useUser();

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
      if (toolCall.toolName === "showResume") {
        return "Resume displayed successfully";
      }

      if (toolCall.toolName === "showSocialLinks") {
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
        return "Calendly booking widget displayed successfully";
      }

      if (toolCall.toolName === "logout") {
        const { error } = await signOut();
        if (error) {
          return "Failed to log out. Please try again.";
        }
        return "Logged out successfully";
      }
    },
  });

  // Monitor messages for successful OTP verification
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.parts) {
      for (const part of latestMessage.parts) {
        if (
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "verifyOtp" &&
          part.toolInvocation.state === "result"
        ) {
          interface VerifyOtpResult {
            success: boolean;
            session: Session;
            profile: Profile;
          }

          const result = part.toolInvocation.result as VerifyOtpResult;

          if (result && result.success && result.session && result.profile) {
            updateSession(result.session, result.profile);
          }
        }
      }
    }
  }, [messages, updateSession]);

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

  if (loading || profileLoading) {
    return (
      <BackdropProvider>
        <div className="flex flex-col h-[100dvh] max-w-6xl mx-auto p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="flex-1 space-y-4 overflow-hidden">
            <Skeleton className="h-full w-full" />
          </div>
          <Skeleton className="h-12 w-full" />
        </div>
      </BackdropProvider>
    );
  }

  return (
    <BackdropProvider>
      <div className="flex flex-col h-[100dvh] max-h-[100dvh] max-w-6xl mx-auto">
        <Header
          handlePromptClick={handlePromptClick}
          handleResetChat={handleResetChat}
          profile={profile}
          signOut={signOut}
        />

        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {isEmptyChat ? (
            <WelcomeScreen
              onPromptClick={handlePromptClick}
              profile={profile}
            />
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
