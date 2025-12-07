import { ppMori } from "@/app/lib/fonts";
import { LoadingPatternProps } from "../types";
import { cn } from "@/lib/utils";

export default function LoadingPattern({
  text,
  className
}: LoadingPatternProps) {
  return (
    <div className={cn("flex items-center gap-2 text-gray-300", ppMori.regular, className)}>
      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      {text}
    </div>
  );
}