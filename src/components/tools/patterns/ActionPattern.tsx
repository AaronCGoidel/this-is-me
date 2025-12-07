import { ToolPatternProps } from "../types";
import LoadingPattern from "./LoadingPattern";

interface ActionPatternProps extends ToolPatternProps {
  loadingText: string;
}

/**
 * Simple action pattern for tools that just show loading state
 * Used for login, logout, verification, etc.
 */
export default function ActionPattern({
  invocation,
  loadingText
}: ActionPatternProps) {
  switch (invocation.state) {
    case "call":
      return <LoadingPattern text={loadingText} />;
    case "result":
    default:
      return null;
  }
}