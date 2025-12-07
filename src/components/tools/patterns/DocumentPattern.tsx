import { ppMori } from "@/app/lib/fonts";
import { DocumentPatternProps } from "../types";
import BaseToolContainer from "../base/BaseToolContainer";
import BaseToolHeader from "../base/BaseToolHeader";
import BaseToolContent from "../base/BaseToolContent";
import LoadingPattern from "./LoadingPattern";
import BaseToolError from "../base/BaseToolError";
import { Download, FileText } from "lucide-react";

export default function DocumentPattern({
  invocation,
  title,
  downloadUrl,
  downloadFilename,
  embedUrl,
  height = "600px"
}: DocumentPatternProps) {
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
          <div className={`w-full border rounded-lg overflow-hidden bg-white`} style={{ height }}>
            <iframe
              src={embedUrl}
              className="w-full h-full"
              title={title}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const headerActions = downloadUrl ? (
    <a
      href={downloadUrl}
      download={downloadFilename}
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 ${ppMori.semiBold}`}
    >
      <Download className="w-4 h-4" />
      Download PDF
    </a>
  ) : undefined;

  return (
    <BaseToolContainer size="wide">
      <BaseToolHeader
        title={title}
        icon={<FileText className="w-5 h-5" />}
        status={invocation.state === "call" ? "loading" : "success"}
        actions={headerActions}
      />
      <BaseToolContent>
        {renderContent()}
      </BaseToolContent>
    </BaseToolContainer>
  );
}