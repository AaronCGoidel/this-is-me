"use client"
import { Chat } from "@/components/Chat";
import { TextGenerate } from "@/components/ui/text-generate";
import Image from "next/image";
import { EmbedType } from "@/components/Embeds";
import { Message, SentBy, parseBotMessageString } from "@/lib/messages";
import { useEffect } from "react";

export default function Home() {
  const introMessage =
  "TODO: FIX EMBED PARSING POSITION. Hi, I'm AaronAI! I'm a digital assistant here to answer your questions about Aaron Goidel.\nSome examples of things you can ask me are: $!prompt:bio!$ $!prompt:projects!$ Here are some useful links: $!link:github!$ $!link:linkedin!$ Or, you can ask me anything you'd like! Just type your question in the chat box below!";

  useEffect(() => {
    console.log(parseBotMessageString(introMessage));
  }, []);

  const messages: Message[] = [
    parseBotMessageString(introMessage),
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
    <main className="w-screen h-screen max-h-screen overflow-auto">
      <Chat messages={messages} />
    </main>
  );
}