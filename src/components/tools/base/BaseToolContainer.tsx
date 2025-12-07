import { ppMori } from "@/app/lib/fonts";
import { BaseToolContainerProps, ToolSize } from "../types";
import { cn } from "@/lib/utils";

// Size configurations for different tool types
const sizeConfig: Record<ToolSize, string> = {
  compact: "max-w-md",
  default: "max-w-2xl",
  wide: "max-w-4xl",
  full: "max-w-full"
};

// Base container styles that all tools will share
const baseStyles = "rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-6 my-4 transition-all duration-200 hover:border-gray-700";

export default function BaseToolContainer({
  size = "default",
  className,
  children
}: BaseToolContainerProps) {
  return (
    <div
      className={cn(
        baseStyles,
        sizeConfig[size],
        ppMori.regular,
        className
      )}
    >
      {children}
    </div>
  );
}