"use client";

import { ppMori } from "@/app/lib/fonts";
import { getCarouselPrompts } from "@/lib/cannedPrompts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { ArrowRight, MoveRight } from "lucide-react";

interface PromptCarouselProps {
  onPromptClick: (prompt: string) => void;
}

export default function PromptCarousel({ onPromptClick }: PromptCarouselProps) {
  const cannedPrompts = getCarouselPrompts();

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel
        className="w-full px-4 max-w-2xl lg:max-w-none mx-auto"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cannedPrompts.map((cannedPrompt, index) => (
            <CarouselItem
              key={index}
              className="pl-2 md:pl-4 basis-4/5 sm:basis-3/5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <button
                onClick={() => onPromptClick(cannedPrompt.prompt)}
                className={`w-full h-20 sm:h-24 md:h-28 bg-[#020203] rounded-lg text-white transition-all duration-200 px-3 sm:px-4 py-2 text-sm sm:text-base ${ppMori.regular} flex items-center justify-center text-center leading-tight hover:cursor-pointer hover:bg-[#020203]/30`}
                title={cannedPrompt.description}
              >
                {cannedPrompt.prompt}
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
        <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
        <SwipeIndicator />
      </Carousel>
    </div>
  );
}

function SwipeIndicator() {
  const { scrollNext } = useCarousel();

  return (
    <div
      className="md:hidden flex flex-row items-center justify-center mt-2 cursor-pointer hover:opacity-70 transition-opacity"
      onClick={scrollNext}
    >
      <p className="text-xs sm:text-sm text-gray-500 text-center">
        Swipe to see more
      </p>
      <MoveRight className="w-4 h-4 text-gray-500 ml-1 mt-[2px]" />
    </div>
  );
}
