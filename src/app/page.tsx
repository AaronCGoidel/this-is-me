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
      if (toolCall.toolName === "getLocation") {
        const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
        const city = cities[Math.floor(Math.random() * cities.length)];
        return city;
      }
    },
  });

  const cannedPrompts = [
    "What is Aaron's favorite food?",
    "What is Aaron's favorite color?",
    "What is Aaron's favorite book?",
    "What is Aaron's favorite song?",
    "What is Aaron's favorite movie?",
    "What is Aaron's favorite TV show?",
    "What is Aaron's favorite game?",
    "What is Aaron's favorite sport?",
    "What is Aaron's favorite animal?",
    "What is Aaron's favorite plant?",
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
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-4xl mx-auto px-4 w-full">
              <h1
                className={`text-6xl md:text-7xl lg:text-8xl mb-4 leading-tight`}
              >
                Hi, I&apos;m <TextHoverEffect text="AaronAI" />
              </h1>
              <p className={`text-xl md:text-2xl mb-8 ${ppMori.regular}`}>
                You can ask me anything about Aaron Goidel
              </p>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="-ml-2">
                  {cannedPrompts.map((prompt, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-2 basis-5/6 sm:basis-1/2 lg:basis-1/3"
                    >
                      <button
                        key={index}
                        onClick={() => handlePromptClick(prompt)}
                        className={`w-full h-24 md:h-28 bg-[#020203] rounded-lg text-white hover:bg-[#020203]/70 transition-all duration-200 px-4 py-2 text-sm md:text-base ${ppMori.regular} flex items-center justify-center text-center`}
                      >
                        {prompt}
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <p className="text-sm text-gray-500 mt-1 sm:hidden">
                  Swipe to see more
                </p>
                <CarouselPrevious className="hidden sm:flex -left-12" />
                <CarouselNext className="hidden sm:flex -right-12" />
              </Carousel>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onToolResult={(toolCallId, result) =>
                addToolResult({ toolCallId, result })
              }
            />
          ))
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center p-2">
          <button
            onClick={stop}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors ${ppMori.regular}`}
          >
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            Stop generating
          </button>
        </div>
      )}

      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
