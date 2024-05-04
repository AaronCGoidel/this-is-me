import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { FaGithub, FaRobot, FaUser } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { ScrollArea } from "./ui/scroll-area";

function ChatInput() {
  return (
    <div>
      <Input />
      <Button />
    </div>
  );
}

export enum SentBy {
  User,
  Bot,
}

export enum EmbedType {
  File,
  Project,
  Link,
  Social,
}

interface Embed {
  type: EmbedType;
  id: string;
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
  const genEmbed = (embed: Embed) => {
    const EmbedSkeleton = () => {
      return (
        <Card className="max-w-96">
          <CardContent>{embed.id}</CardContent>
        </Card>
      );
    };

    switch (embed.type) {
      case EmbedType.File:
      case EmbedType.Project:
        return (
          <CardContainer className="inter-var">
            <CardBody className="max-w-96 relative group/card">
              <CardItem translateZ="50" className="text-xl font-bold">
                Project Card Title
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Brief description of the project. This is a brief description of
                the project.
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  height="1000"
                  width="1000"
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                  alt="thumbnail"
                />
              </CardItem>
              <div className="flex justify-end items-center mt-20">
                <CardItem translateZ={20}>
                  <Button>
                    <FaGithub className="mr-2" />
                    View on Github
                  </Button>
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        );
      case EmbedType.Link:
      case EmbedType.Social:
      default:
        return <EmbedSkeleton />;
    }
  };

  const genMessage = (message: Message) => {
    return (
      <div>
        {message.message_parts.map((message_part, idx) => (
          <div key={idx}>
            <p className="text-2xl mb-2">{message_part}</p>
            {message.embeds && message.embeds[idx]
              ? message.embeds[idx].map((embed, idx) => genEmbed(embed))
              : null}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-2 pt-4 pb-4">
      <CardContent className="flex items-start py-2 px-4">
        <div className="mr-4">
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
    <ScrollArea className="foo">
      {messages.map((message, idx) => (
        <ChatMessage key={idx} message={message} number={idx} />
      ))}
    </ScrollArea>
  );
}
