import { ppMori } from "@/app/lib/fonts";
import { BaseToolContentProps } from "../types";
import { cn } from "@/lib/utils";

export default function BaseToolContent({
  children,
  className
}: BaseToolContentProps) {
  return (
    <div className={cn("text-gray-100", ppMori.regular, className)}>
      {children}
    </div>
  );
}