import { Message } from "ai";
import { ppMori } from "../app/lib/fonts";
import { Download } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onToolResult?: (toolCallId: string, result: string) => void;
}

// Base types for tool invocations
interface BaseToolInvocation {
  toolCallId: string;
  toolName: string;
  state: "call" | "partial-call" | "result";
  args?: Record<string, unknown>;
  result?: unknown;
}

interface ToolComponentProps {
  invocation: BaseToolInvocation;
  onResult?: (toolCallId: string, result: string) => void;
}

const LoadingIndicator = ({ text }: { text: string }) => (
  <div className={`flex items-center gap-2 text-gray-300 ${ppMori.regular}`}>
    <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
    {text}
  </div>
);

const ToolResult = ({ label, value }: { label: string; value: string }) => (
  <div className={`text-gray-300 ${ppMori.regular}`}>
    {label}: {value}
  </div>
);

const ConfirmationTool = ({ invocation, onResult }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
      return (
        <div className="bg-gray-700 rounded-lg p-4 my-2">
          <p className={`mb-3 ${ppMori.regular}`}>
            {(invocation.args as { message?: string })?.message}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                onResult?.(invocation.toolCallId, "Yes, confirmed.")
              }
              className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ${ppMori.semiBold}`}
            >
              Yes
            </button>
            <button
              onClick={() => onResult?.(invocation.toolCallId, "No, denied")}
              className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ${ppMori.semiBold}`}
            >
              No
            </button>
          </div>
        </div>
      );
    case "result":
      return (
        <ToolResult label="Confirmation" value={String(invocation.result)} />
      );
    default:
      return null;
  }
};

const LocationTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
      return <LoadingIndicator text="Getting location..." />;
    case "result":
      return <ToolResult label="Location" value={String(invocation.result)} />;
    default:
      return null;
  }
};

const WeatherTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "partial-call":
      return (
        <div className="bg-gray-700 rounded-lg p-3 my-2">
          <pre
            className={`text-sm text-gray-300 overflow-x-auto ${ppMori.regular}`}
          >
            {JSON.stringify(invocation, null, 2)}
          </pre>
        </div>
      );
    case "call":
      return (
        <LoadingIndicator
          text={`Getting weather information for ${
            (invocation.args as { city?: string })?.city
          }...`}
        />
      );
    case "result":
      return (
        <ToolResult
          label={`Weather in ${(invocation.args as { city?: string })?.city}`}
          value={String(invocation.result)}
        />
      );
    default:
      return null;
  }
};

const ResumeTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
    case "result":
      return (
        <div className="bg-gray-700 rounded-lg p-4 my-4 max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-semibold text-white ${ppMori.semiBold}`}
            >
              Aaron&apos;s Resume
            </h3>
            <a
              href="/resume.pdf"
              download="Aaron_Goidel_Resume.pdf"
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 ${ppMori.semiBold}`}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          </div>
          <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-white">
            <iframe
              src="/resume.pdf"
              className="w-full h-full"
              title="Aaron's Resume"
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

const TOOL_COMPONENTS: Record<
  string,
  React.ComponentType<ToolComponentProps>
> = {
  askForConfirmation: ConfirmationTool,
  getLocation: LocationTool,
  getWeatherInformation: WeatherTool,
  showResume: ResumeTool,
};

const ToolInvocationRenderer = ({
  invocation,
  onResult,
}: ToolComponentProps) => {
  const ToolComponent = TOOL_COMPONENTS[invocation.toolName];

  if (!ToolComponent) {
    return (
      <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-3 my-2">
        <p className={`text-yellow-200 text-sm ${ppMori.semiBold}`}>
          Unknown tool: {invocation.toolName}
        </p>
        <pre
          className={`text-xs text-gray-300 mt-2 overflow-x-auto ${ppMori.regular}`}
        >
          {JSON.stringify(invocation, null, 2)}
        </pre>
      </div>
    );
  }

  return <ToolComponent invocation={invocation} onResult={onResult} />;
};

const MessageContent = ({ message, onToolResult }: ChatMessageProps) => {
  if (message.parts) {
    return (
      <>
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "text":
              return (
                <div key={index} className="prose prose-invert max-w-none">
                  <p className={`whitespace-pre-wrap ${ppMori.regular}`}>
                    {part.text}
                  </p>
                </div>
              );
            case "tool-invocation":
              return (
                <ToolInvocationRenderer
                  key={part.toolInvocation.toolCallId}
                  invocation={part.toolInvocation as BaseToolInvocation}
                  onResult={onToolResult}
                />
              );
            default:
              return null;
          }
        })}
      </>
    );
  }

  return (
    <p className={`whitespace-pre-wrap ${ppMori.regular}`}>{message.content}</p>
  );
};

export default function ChatMessage({
  message,
  onToolResult,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex rounded-md gap-4 p-4 ${isUser ? "" : "bg-[#020203]"}`}
    >
      <div className="flex-1 min-w-0">
        <div className="text-gray-100">
          <MessageContent message={message} onToolResult={onToolResult} />
        </div>
      </div>
    </div>
  );
}

export { TOOL_COMPONENTS, LoadingIndicator, ToolResult };
export type { ToolComponentProps, BaseToolInvocation };
