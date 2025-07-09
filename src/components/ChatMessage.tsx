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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
      return <LoadingIndicator text="Loading Calendly..." />;
    case "result":
      return (
        <CalendlyEmbed url="https://calendly.com/acgoidel?hide_gdpr_banner=1" />
      );
    default:
      return null;
  }
};

const PhoneLoginTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
      return <LoadingIndicator text="Sending you a code..." />;
    case "result":
    default:
      return null;
  }
};

const VerifyOtpTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
      return <LoadingIndicator text="Verifying your one time passcode..." />;
    case "result":
    default:
      return null;
  }
};

const LogoutTool = ({ invocation }: ToolComponentProps) => {
  switch (invocation.state) {
    case "call":
      return <LoadingIndicator text="Logging you out..." />;
    case "result":
    default:
      return null;
  }
};

const TOOL_COMPONENTS: Record<
  string,
  React.ComponentType<ToolComponentProps>
> = {
  showResume: ResumeTool,
  showSocialLinks: SocialLinksTool,
  showCalendly: CalendlyTool,
  phoneLogin: PhoneLoginTool,
  verifyOtp: VerifyOtpTool,
  logout: LogoutTool,
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
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      // Custom styling for markdown elements
                      p: ({ children }) => (
                        <p className={`mb-4 last:mb-0 ${ppMori.regular}`}>
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1
                          className={`text-2xl font-bold mb-4 ${ppMori.semiBold}`}
                        >
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2
                          className={`text-xl font-bold mb-3 ${ppMori.semiBold}`}
                        >
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3
                          className={`text-lg font-bold mb-2 ${ppMori.semiBold}`}
                        >
                          {children}
                        </h3>
                      ),
                      code: ({ children, className, ...props }) => {
                        const isInline = !className?.includes("language-");
                        return isInline ? (
                          <code
                            className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <code
                            className="block bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                          {children}
                        </pre>
                      ),
                      ul: ({ children }) => (
                        <ul
                          className={`list-disc list-inside mb-4 space-y-1 ${ppMori.regular}`}
                        >
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol
                          className={`list-decimal list-inside mb-4 space-y-1 ${ppMori.regular}`}
                        >
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className={`${ppMori.regular}`}>{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-600 pl-4 italic text-gray-300 mb-4">
                          {children}
                        </blockquote>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline transition-colors"
                        >
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => (
                        <strong className={`font-semibold ${ppMori.semiBold}`}>
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                    }}
                  >
                    {part.text}
                  </ReactMarkdown>
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
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Use the same custom components as above
          p: ({ children }) => (
            <p className={`mb-4 last:mb-0 ${ppMori.regular}`}>{children}</p>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code
                className="bg-gray-700 text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code
                className="block bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          strong: ({ children }) => (
            <strong className={`font-semibold ${ppMori.semiBold}`}>
              {children}
            </strong>
          ),
        }}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default function ChatMessage({
  message,
  onToolResult,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex rounded-lg gap-4 p-4 ${
        isUser ? "bg-[#020203] w-[80%] lg:w-[60%] ml-auto" : "mx-auto"
      }`}
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
