import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { FaGithub, FaRobot, FaUser } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { ScrollArea } from "./ui/scroll-area";
import { Embed, EmbedCard, EmbedType } from "./Embeds";
import { ChatInput } from "./ChatInput";

export enum SentBy {
  User,
  Bot,
}

export interface Message {
  message_parts: string[];
  embeds?: Embed[][];
  sent_by: SentBy;
}

interface ChatMessageProps {
  message: Message;
  number: number;
}

function ChatMessage({ message, number }: ChatMessageProps) {
  const genMessage = (message: Message) => {
    return (
      <div className="mt-2">
        {message.message_parts.map((message_part, idx) => (
          <div key={idx}>
            <p className="text-2xl mb-2">{message_part}</p>
            {message.embeds && message.embeds[idx]
              ? message.embeds[idx].map((embed, idx) => (
                  <EmbedCard key={idx} embed={embed} />
                ))
              : null}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-4 pt-1 md:pt-4 pb-4 shadow-lg  shadow-purple-600/[0.1]">
      <CardContent className="md:flex items-start py-2 px-4">
        <div className="mb-2 mr-4 md:h-auto flex-shrink-0">
          {message.sent_by === SentBy.Bot ? (
            <FaRobot size={32} />
          ) : (
            <FaUser size={28} />
          )}
        </div>
        {genMessage(message)}
      </CardContent>
    </Card>
  );
}

interface ChatProps {
  messages: Message[];
}

export function Chat({ messages }: ChatProps) {
  return (
    <div>
      <ScrollArea className="px-4 md:px-8">
        {messages.map((message, idx) => (
          <ChatMessage key={idx} message={message} number={idx} />
        ))}
      </ScrollArea>
      <ChatInput className="sticky bottom-0" />
    </div>
  );
}
