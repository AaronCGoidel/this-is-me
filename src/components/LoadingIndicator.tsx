"use client";

import { ppMori } from "@/app/lib/fonts";

interface LoadingIndicatorProps {
  onStop: () => void;
}

export default function LoadingIndicator({ onStop }: LoadingIndicatorProps) {
  return (
    <div className="flex justify-center p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <button
        onClick={onStop}
        className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors ${ppMori.regular}`}
      >
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        Stop generating
      </button>
    </div>
  );
}
