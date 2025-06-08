"use client";

import { ppMori } from "@/app/lib/fonts";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import PromptCarousel from "./PromptCarousel";
import { type Profile } from "@/contexts/UserContext";

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
  profile: Profile | null;
}

export default function WelcomeScreen({
  onPromptClick,
  profile,
}: WelcomeScreenProps) {
  const IntroText = (
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-6 lg:mb-8 leading-tight break-words">
      {profile ? `Hi ${profile.first_name}, I'm` : "Hi, I'm"}
      <TextHoverEffect text="AaronAI" automatic />
    </h1>
  );

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <div className="text-center w-full max-w-4xl mx-auto">
        {IntroText}
        <p
          className={`text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 lg:mb-12 ${ppMori.regular} px-4`}
        >
          You can ask me anything about Aaron Goidel
        </p>

        <PromptCarousel onPromptClick={onPromptClick} />
      </div>
    </div>
  );
}
