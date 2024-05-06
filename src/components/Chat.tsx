import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { FaGithub, FaRobot, FaUser } from "react-icons/fa";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { ScrollArea } from "./ui/scroll-area";
import { EmbedCard } from "./Embeds";
import { Embed, EmbedType } from "@/lib/knowledgebase/knowledge";
import { ChatInput } from "./ChatInput";
import { FaMeta } from "react-icons/fa6";
import { Message, SentBy } from "@/lib/messages";
import { TextGenerate } from "./ui/text-generate";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: Message;
  number: number;
  onComplete?: () => void;
}

function ChatMessage({ message, number, onComplete }: ChatMessageProps) {
  const [currentPart, setCurrentPart] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (currentPart >= message.message_parts.length && !hasCompleted) {
      onComplete && onComplete();
      setHasCompleted(true);
    }
  }, [currentPart, message.message_parts.length, onComplete, hasCompleted]);

  const handleTextComplete = () => {
    setCurrentPart((prev) => prev + 1);
  };

  const genMessage = (message: Message) => {
    return (
      <div className="mt-2">
        {message.message_parts.map((message_part, idx) => (
          <div key={idx}>
            {idx <= currentPart && (
              <div>
                <TextGenerate
                  className="text-2xl mb-1 mt-4"
                  words={message_part}
                  onComplete={handleTextComplete}
                />
                {message.embeds && message.embeds[idx] && idx < currentPart ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap gap-4 mt-4"
                  >
                    {message.embeds[idx].map((embed, embedIdx) => (
                      <EmbedCard key={embedIdx} embed={embed} />
                    ))}
                  </motion.div>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-4 pt-1 md:pt-4 pb-4 shadow-lg shadow-purple-600/[0.1]">
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
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  return (
    <div className="w-full max-h-dvh">
      <ScrollArea className="p-4 h-dvh md:px-10">
        {messages.map((message, idx) => (
          <ChatMessage key={idx} message={message} number={idx} />
        ))}
      </ScrollArea>
      <ChatInput className="sticky bottom-0" />
    </div>
  );
}
