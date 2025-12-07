import { ReactNode } from "react";

// Base tool invocation types (from ChatMessage.tsx)
export interface BaseToolInvocation {
  toolCallId: string;
  toolName: string;
  state: "call" | "partial-call" | "result";
  args?: Record<string, unknown>;
  result?: unknown;
}

// Enhanced tool component props with unified functionality
export interface ToolComponentProps {
  invocation: BaseToolInvocation;
  onResult?: (toolCallId: string, result: string) => void;
  onViewAllPosts?: () => void; // For blog tools
}

// Extended props for BlogSearchTool
export interface BlogSearchToolProps extends ToolComponentProps {
  onViewAllPosts?: () => void;
}

// Container size variants
export type ToolSize = "compact" | "default" | "wide" | "full";

// Tool status types
export type ToolStatus = "loading" | "success" | "error" | "idle";

// Base container props
export interface BaseToolContainerProps {
  size?: ToolSize;
  className?: string;
  children: ReactNode;
}

// Base header props
export interface BaseToolHeaderProps {
  title: string;
  icon?: ReactNode;
  status?: ToolStatus;
  actions?: ReactNode;
  className?: string;
}

// Base content props
export interface BaseToolContentProps {
  children: ReactNode;
  className?: string;
}

// Error handling props
export interface BaseToolErrorProps {
  message: string;
  type?: "network" | "validation" | "general";
  retry?: () => void;
  className?: string;
}

// Tool pattern props
export interface ToolPatternProps {
  invocation: BaseToolInvocation;
  onResult?: (toolCallId: string, result: string) => void;
}

// Loading pattern props
export interface LoadingPatternProps {
  text: string;
  className?: string;
}

// Document pattern props (for resume-like tools)
export interface DocumentPatternProps extends ToolPatternProps {
  title: string;
  downloadUrl?: string;
  downloadFilename?: string;
  embedUrl: string;
  height?: string;
}

// Card grid pattern props (for social links)
export interface CardGridPatternProps extends ToolPatternProps {
  title: string;
  cards: Array<{
    id: string;
    icon: ReactNode;
    label: string;
    url: string;
    username?: string;
    bgColor: string;
  }>;
  columns?: number;
}

// Embed pattern props (for Calendly, iframes)
export interface EmbedPatternProps extends ToolPatternProps {
  url: string;
  height?: string;
  title?: string;
}

// Data display pattern props (for blog posts, search results)
export interface DataDisplayPatternProps extends ToolPatternProps {
  data: unknown[];
  renderItem: (item: unknown, index: number) => ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
}

// Tool registration metadata
export interface ToolMetadata {
  name: string;
  category: "content" | "action" | "display" | "embed";
  description: string;
  pattern: "loading" | "document" | "card-grid" | "embed" | "data-display" | "custom";
}

// Enhanced tool registry entry
export interface ToolRegistryEntry {
  component: React.ComponentType<ToolComponentProps>;
  metadata: ToolMetadata;
}