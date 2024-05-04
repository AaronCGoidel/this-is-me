import ChatInput from "@/components/ChatInput";
import { Chat, EmbedType, Message, SentBy } from "@/components/Chat";
import { TextGenerate } from "@/components/ui/text-generate";
import { WavyBackground } from "@/components/ui/wavy-background";
import Image from "next/image";

export default function Home() {
  const intro_msg =
    "Hi, I'm AaronAI! I'm a digital assistant here to answer your questions about Aaron Goidel. Ask me anything!";

  const messages: Message[] = [
    {
      message_parts: [intro_msg, "erf"],
      sent_by: SentBy.Bot,
      embeds: [
        [
          {
            type: EmbedType.Link,
            id: "foo",
          },
          {
            type: EmbedType.Link,
            id: "bar",
          },
        ],
      ],
    },
    {
      message_parts: [intro_msg, "erf"],
      sent_by: SentBy.User,
      embeds: [
        [
          {
            type: EmbedType.Project,
            id: "foo",
          },
          {
            type: EmbedType.Link,
            id: "bar",
          },
        ],
      ],
    },
  ];
  return (
    <main className="w-screen h-screen">
      <WavyBackground className="p-4">
        <Chat messages={messages} />
      </WavyBackground>
    </main>
  );
}
