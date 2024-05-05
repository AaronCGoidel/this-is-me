import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { FaGithub, FaRobot, FaUser } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { ScrollArea } from "./ui/scroll-area";
import { Embed, EmbedCard, EmbedType } from "./Embeds";
import { ChatInput } from "./ChatInput";
import { FaMeta } from "react-icons/fa6";
import { Message, SentBy } from "@/lib/messages";

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
            {message.embeds && message.embeds[idx] ? (
              <div className="flex flex-wrap gap-4 mt-2">
                {message.embeds[idx].map((embed, idx) => (
                  <EmbedCard key={idx} embed={embed} />
                ))}
              </div>
            ) : null}
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
      {message.sent_by === SentBy.Bot && (
        <CardFooter className="flex justify-end py-0">
          <FaMeta className="mr-2" />
          <span className="text-xs">Powered by Llama 3</span>
        </CardFooter>
      )}
    </Card>
  );
}

interface ChatProps {
  messages: Message[];
}

export function Chat({ messages }: ChatProps) {
  return (
    <div className="w-full max-h-screen">
      <ScrollArea className="p-4 md:px-10">
        {messages.map((message, idx) => (
          <ChatMessage key={idx} message={message} number={idx} />
        ))}
      </ScrollArea>
      <ChatInput className="sticky bottom-0" />
    </div>
  );
}
