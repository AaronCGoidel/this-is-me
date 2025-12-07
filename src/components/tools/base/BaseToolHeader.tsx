import { ppMori } from "@/app/lib/fonts";
import { BaseToolHeaderProps, ToolStatus } from "../types";
import { cn } from "@/lib/utils";

// Status indicator styles
const statusConfig: Record<ToolStatus, { color: string; pulse?: boolean }> = {
  loading: { color: "text-blue-400", pulse: true },
  success: { color: "text-green-400" },
  error: { color: "text-red-400" },
  idle: { color: "text-gray-400" }
};

// Status indicator component
const StatusIndicator = ({ status }: { status: ToolStatus }) => {
  const config = statusConfig[status];

  if (status === "loading") {
    return (
      <div className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-'))}>
        <div className={cn("w-full h-full rounded-full animate-pulse", config.color.replace('text-', 'bg-'))} />
      </div>
    );
  }

  return (
    <div className={cn("w-2 h-2 rounded-full", config.color.replace('text-', 'bg-'))} />
  );
};

export default function BaseToolHeader({
  title,
  icon,
  status,
  actions,
  className
}: BaseToolHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-blue-400 flex-shrink-0">
            {icon}
          </div>
        )}
        <h3 className={cn("text-lg font-semibold text-white", ppMori.semiBold)}>
          {title}
        </h3>
        {status && status !== "idle" && (
          <StatusIndicator status={status} />
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}