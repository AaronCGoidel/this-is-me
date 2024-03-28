import ChatInput from "@/components/ChatInput";
import { TextGenerate } from "@/components/ui/text-generate";
import { WavyBackground } from "@/components/ui/wavy-background";
import Image from "next/image";

export default function Home() {
  const intro_msg =
    "Hi, I'm AaronAI! I'm a digital assistant here to answer your questions about Aaron Goidel. Ask me anything!";
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <WavyBackground className="max-w-4xl mx-auto">
        <TextGenerate words={intro_msg} className="text-2xl text-white" />
        <ChatInput />
      </WavyBackground>
    </main>
  );
}
