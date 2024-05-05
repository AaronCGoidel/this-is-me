import { Embed, EmbedType } from "@/components/Embeds";

export enum SentBy {
  User,
  Bot,
}

export interface Message {
  message_parts: string[];
  embeds?: Embed[][];
  sent_by: SentBy;
}

const parseEmbedString = (embedString: string): Embed[] => {
  const embedPattern = /\$\!([a-z]+):([^\$]+)\!\$/g;
  let match;
  let embeds: Embed[] = [];

  while ((match = embedPattern.exec(embedString)) !== null) {
    const [, type, id] = match;
    embeds.push({
      type: EmbedType[type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof EmbedType],
      id: id,
    });
  }

  return embeds;
};

export const parseBotMessageString = (message: string): Message => {
  const parts = message.split(/(\$\![a-z]+:[^\$]+\!\$)/);
  const message_parts: string[] = [];
  const embeds: Embed[][] = [];

  let currentPart = "";
  let currentEmbeds: Embed[] = [];

  parts.forEach(part => {
    if (/\$\![a-z]+:[^\$]+\!\$/.test(part)) {
      if (currentPart.trim()) {
        message_parts.push(currentPart.trim());
        embeds.push(currentEmbeds);
        currentPart = "";
        currentEmbeds = [];
      }
      currentEmbeds.push(...parseEmbedString(part));
    } else {
      currentPart += part;
    }
  });

  if (currentPart.trim()) {
    message_parts.push(currentPart.trim());
    embeds.push(currentEmbeds);
  }

  return {
    message_parts,
    embeds,
    sent_by: SentBy.Bot,
  };
};

const testParseBotMessageString = () => {
  const raw_message = "Hi, I'm AaronAI! I'm a digital assistant here to answer your questions about Aaron Goidel.\nSome examples of things you can ask me are: $!prompt:bio!$ $!prompt:projects!$ Here are some useful links: $!link:github!$ $!link:linkedin!$ Or, you can ask me anything you'd like! Just type your question in the chat box below!";
  const expected_message: Message = {
    message_parts: [
      "Hi, I'm AaronAI! I'm a digital assistant here to answer your questions about Aaron Goidel.\nSome examples of things you can ask me are:",
      "Here are some useful links:",
      "Or, you can ask me anything you'd like! Just type your question in the chat box below!"
    ],
    sent_by: SentBy.Bot,
    embeds: [
      [
        { type: EmbedType.Prompt, id: "bio" },
        { type: EmbedType.Prompt, id: "projects" }
      ],
      [
        { type: EmbedType.Link, id: "github" },
        { type: EmbedType.Link, id: "linkedin" }
      ],
      []
    ]
  };

  const message = parseBotMessageString(raw_message);
  if (JSON.stringify(message) !== JSON.stringify(expected_message)) {
    console.log("parseBotMessageString FAILED!");
    console.log("Expected:", expected_message);
    console.log("Received:", message);
  } else {
    console.log("parseBotMessageString passed");
  }
};

testParseBotMessageString();
