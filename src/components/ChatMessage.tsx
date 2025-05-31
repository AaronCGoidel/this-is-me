import { Message } from "ai";
import { ppMori } from "../app/lib/fonts";
import {
  Download,
  Github,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  Calendar,
} from "lucide-react";
import CalendlyEmbed from "./CalendlyEmbed";

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
        <div className="rounded-lg p-4 my-4 max-w-4xl">
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

const SocialLinksTool = ({ invocation }: ToolComponentProps) => {
  const socialData = {
    github: {
      icon: Github,
      label: "GitHub",
      username: "AaronCGoidel",
      url: "https://github.com/AaronCGoidel",
      bgColor: "bg-gray-800 hover:bg-gray-900",
    },
    linkedin: {
      icon: Linkedin,
      label: "LinkedIn",
      username: "AaronCGoidel",
      url: "https://linkedin.com/in/AaronCGoidel",
      bgColor: "bg-blue-600 hover:bg-blue-700",
    },
    instagram: {
      icon: Instagram,
      label: "Instagram",
      username: "im_an_aaron",
      url: "https://instagram.com/im_an_aaron",
      bgColor:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    },
    email: {
      icon: Mail,
      label: "Email",
      username: "acgoidel@gmail.com",
      url: "mailto:acgoidel@gmail.com",
      bgColor: "border border-gray-300 hover:border-gray-400 hover:bg-gray-800",
    },
    calendly: {
      icon: Calendar,
      label: "Calendly",
      username: "acgoidel",
      url: "https://calendly.com/acgoidel",
      bgColor: "bg-yellow-600 hover:bg-yellow-700",
    },
  };

  switch (invocation.state) {
    case "call":
    case "result":
      const args = invocation.args as { platforms?: string[] };
      const platformsToShow = args?.platforms || [
        "github",
        "linkedin",
        "instagram",
        "email",
        "calendly",
      ];

      return (
        <div className="rounded-lg p-4 my-4 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <h3
              className={`text-lg font-semibold text-white ${ppMori.semiBold}`}
            >
              Connect with Aaron
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {platformsToShow.map((platform) => {
              const social = socialData[platform as keyof typeof socialData];
              if (!social) return null;

              const IconComponent = social.icon;

              return (
                <a
                  key={platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${social.bgColor} text-white rounded-lg p-3 transition-all duration-200 flex items-center gap-3 group`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${ppMori.semiBold}`}>
                      {social.label}
                    </div>
                    <div
                      className={`text-sm opacity-90 truncate ${ppMori.regular}`}
                    >
                      {social.username}
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>
      );
    default:
      return null;
  }
};

const CalendlyTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
    case "result":
      return <CalendlyEmbed url="https://calendly.com/acgoidel" />;
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
  showSocialLinks: SocialLinksTool,
  showCalendly: CalendlyTool,
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
