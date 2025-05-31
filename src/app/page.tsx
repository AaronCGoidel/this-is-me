"use client";

import { useChat } from "@ai-sdk/react";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import { ppMori } from "./lib/fonts";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    isLoading,
    stop,
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

  const cannedPrompts = [
    "Give me a brief bio for Aaron",
    "How can I connect with Aaron?",
    "What does Aaron like to do outside of work?",
    "Can I have a copy of Aaron's resume?",
    "Schedule a meeting with Aaron",
    "What is Aaron's favorite book?",
    "Write me a poem about Aaron",
  ];

  const handlePromptClick = (prompt: string) => {
    // Create a temporary form and input to trigger proper submission
    const form = document.createElement("form");
    const input = document.createElement("input");
    input.value = prompt;
    form.appendChild(input);

    // Update the state first
    const syntheticEvent = {
      target: { value: prompt },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);

    // Then submit
    setTimeout(() => {
      form.requestSubmit();
    }, 10);
  };

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh]">
      <div className="flex-1 overflow-y-auto min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-full p-4">
            <div className="text-center w-full max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-6 lg:mb-8 leading-tight break-words">
                Hi, I&apos;m <TextHoverEffect text="AaronAI" automatic />
              </h1>
              <p
                className={`text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 lg:mb-12 ${ppMori.regular} px-4`}
              >
                You can ask me anything about Aaron Goidel
              </p>

              <div className="w-full max-w-6xl mx-auto px-4">
                <Carousel
                  className="w-full"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {cannedPrompts.map((prompt, index) => (
                      <CarouselItem
                        key={index}
                        className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                      >
                        <button
                          onClick={() => handlePromptClick(prompt)}
                          className={`w-full h-20 sm:h-24 md:h-28 bg-[#020203] rounded-lg text-white transition-all duration-200 px-3 sm:px-4 py-2 text-sm sm:text-base ${ppMori.regular} flex items-center justify-center text-center leading-tight hover:cursor-pointer hover:bg-[#020203]/30`}
                        >
                          {prompt}
                        </button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:hidden text-center">
                    Swipe to see more
                  </p>
                  <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
                  <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
                </Carousel>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onToolResult={(toolCallId, result) =>
                  addToolResult({ toolCallId, result })
                }
              />
            ))}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            onClick={stop}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors ${ppMori.regular}`}
          >
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            Stop generating
          </button>
        </div>
      )}

      <div className="flex-shrink-0">
        <ChatInput
          input={input}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
