import { ppMori } from "@/app/lib/fonts";
import { CardGridPatternProps } from "../types";
import BaseToolContainer from "../base/BaseToolContainer";
import BaseToolHeader from "../base/BaseToolHeader";
import BaseToolContent from "../base/BaseToolContent";
import LoadingPattern from "./LoadingPattern";
import BaseToolError from "../base/BaseToolError";
import { ExternalLink, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CardGridPattern({
  invocation,
  title,
  cards,
  columns = 2
}: CardGridPatternProps) {
  const renderContent = () => {
    switch (invocation.state) {
      case "call":
        return <LoadingPattern text={`Loading ${title.toLowerCase()}...`} />;

      case "result":
        const result = invocation.result as { error?: string };
        if (result?.error) {
          return (
            <BaseToolError
              message={result.error}
              type="general"
            />
          );
        }

        return (
          <div className={cn(
            "grid gap-3",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 sm:grid-cols-2",
            columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {cards.map((card) => (
              <a
                key={card.id}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "rounded-lg p-4 transition-all duration-200 flex items-center gap-3 group",
                  card.bgColor
                )}
              >
                <div className="flex-shrink-0 text-white">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("font-semibold text-white group-hover:text-gray-100", ppMori.semiBold)}>
                    {card.label}
                  </div>
                  {card.username && (
                    <div className={cn("text-sm text-gray-200 group-hover:text-gray-300", ppMori.regular)}>
                      {card.username}
                    </div>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white/90 flex-shrink-0" />
              </a>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BaseToolContainer size="default">
      <BaseToolHeader
        title={title}
        icon={<Users className="w-5 h-5" />}
        status={invocation.state === "call" ? "loading" : "success"}
      />
      <BaseToolContent>
        {renderContent()}
      </BaseToolContent>
    </BaseToolContainer>
  );
}