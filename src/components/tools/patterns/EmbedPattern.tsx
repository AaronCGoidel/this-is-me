import { EmbedPatternProps } from "../types";
import BaseToolContainer from "../base/BaseToolContainer";
import BaseToolHeader from "../base/BaseToolHeader";
import BaseToolContent from "../base/BaseToolContent";
import LoadingPattern from "./LoadingPattern";
import BaseToolError from "../base/BaseToolError";
import { ExternalLink } from "lucide-react";

export default function EmbedPattern({
  invocation,
  url,
  height = "600px",
  title = "Embedded Content"
}: EmbedPatternProps) {
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
          <div className="w-full rounded-lg overflow-hidden border border-gray-700" style={{ height }}>
            <iframe
              src={url}
              className="w-full h-full"
              title={title}
              loading="lazy"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BaseToolContainer size="wide">
      <BaseToolHeader
        title={title}
        icon={<ExternalLink className="w-5 h-5" />}
        status={invocation.state === "call" ? "loading" : "success"}
      />
      <BaseToolContent>
        {renderContent()}
      </BaseToolContent>
    </BaseToolContainer>
  );
}