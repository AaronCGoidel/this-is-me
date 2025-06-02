"use client";

import { ppMori } from "@/app/lib/fonts";
import { getCarouselPrompts } from "@/lib/cannedPrompts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PromptCarouselProps {
  onPromptClick: (prompt: string) => void;
}

export default function PromptCarousel({ onPromptClick }: PromptCarouselProps) {
  const cannedPrompts = getCarouselPrompts();

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel
        className="w-full"
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
        <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:hidden text-center">
          Swipe to see more
        </p>
        <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
        <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
      </Carousel>
    </div>
  );
}
