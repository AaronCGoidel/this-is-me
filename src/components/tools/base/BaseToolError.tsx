import { ppMori } from "@/app/lib/fonts";
import { BaseToolErrorProps } from "../types";
import { cn } from "@/lib/utils";
import { AlertTriangle, Wifi, RefreshCw } from "lucide-react";

// Error type configurations
const errorTypeConfig = {
  network: {
    icon: Wifi,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30"
  },
  validation: {
    icon: AlertTriangle,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30"
  },
  general: {
    icon: AlertTriangle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30"
  }
};

export default function BaseToolError({
  message,
  type = "general",
  retry,
  className
}: BaseToolErrorProps) {
  const config = errorTypeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "rounded-lg border p-4 flex items-start gap-3",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <Icon className={cn("w-5 h-5 mt-0.5 flex-shrink-0", config.color)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", config.color, ppMori.regular)}>
          {message}
        </p>
        {retry && (
          <button
            onClick={retry}
            className={cn(
              "mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors",
              "border border-gray-600 hover:border-gray-500 hover:bg-gray-800/50",
              "text-gray-300 hover:text-white",
              ppMori.regular
            )}
          >
            <RefreshCw className="w-3 h-3" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}