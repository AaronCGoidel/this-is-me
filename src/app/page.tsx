import { Chat, Message, SentBy } from "@/components/Chat";
import { TextGenerate } from "@/components/ui/text-generate";
import Image from "next/image";
import { EmbedType } from "@/components/Embeds";

export default function Home() {
  const intro_msg =
    "Hi, I'm AaronAI! I'm a digital assistant here to answer your questions about Aaron Goidel. Ask me anything!";

  const messages: Message[] = [
    {
      message_parts: [intro_msg, "Hello, World!"],
      sent_by: SentBy.Bot,
      embeds: [
        [
          {
            type: EmbedType.File,
            id: "Aaron's Resume",
          },
          {
            type: EmbedType.Link,
            id: "Github Profile",
          },
        ],
      ],
    },
    {
      message_parts: [
        "Tempor non dolor enim nulla velit nostrud laboris dolore eiusmod pariatur nostrud commodo esse incididunt. Consectetur anim do aute irure duis deserunt commodo cupidatat.",
        "Enim et laboris in duis occaecat do occaecat ipsum mollit.",
      ],
      sent_by: SentBy.User,
      embeds: [
        [
          {
            type: EmbedType.Project,
            id: "foo",
          },
        ],
        [
          {
            type: EmbedType.Link,
            id: "Foo Bar",
          },
        ],
      ],
    },
  ];
  return (
    <main className="w-screen h-screen p-2 md:p-6 overflow-auto">
      <Chat messages={messages} />
    </main>
  );
}
