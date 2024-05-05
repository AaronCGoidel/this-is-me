import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaArrowUp, FaPaperPlane } from "react-icons/fa";
import { Card, CardContent } from "./ui/card";

const SuggestedPrompt = ({ prompt }: { prompt: string }) => {
  return (
    <Card className="flex justify-center">
      <CardContent className="flex items-center p-4 w-60 md:max-w-56">
        <p className="mr-2">{prompt}</p>
        <Button
          className="min-h-8 min-w-8 max-w-8 max-h-8 p-0 ml-auto"
          variant={"outline"}
        >
          <FaArrowUp size={12} />
        </Button>
      </CardContent>
    </Card>
  );
};

const SuggestedPrompts = () => {
  const prompts = [
    "Who is Aaron?",
    "What are some projects Aaron has worked on?",
    "Write me a haiku about Aaron",
    "Explain what Aaron does for work to a five-year-old",
    "Can I have a copy of Aaron's resume?",
  ];
  return (
    <div className="flex md:justify-center overflow-scroll gap-2 md:gap-6 mb-2">
      {prompts.map((prompt, idx) => (
        <SuggestedPrompt key={idx} prompt={prompt} />
      ))}
    </div>
  );
};

interface ChatInputProps {
  className?: string;
}

export const ChatInput = ({ className }: ChatInputProps) => {
  return (
    <div
      className={`${className} w-screen bg-gradient-to-t from-black via-black to-transparent px-4`}
    >
      {/* <SuggestedPrompts /> */}
      <div
        className={`flex w-full justify-between py-4 bg-black rounded-xl px-4 border`}
      >
        <Input className={`mr-4 h-12`} placeholder="Ask AaronAI anything..." />
        <Button className={`h-12 w-16`}>
          <FaPaperPlane />
        </Button>
      </div>
      <p className="text-xs text-center pt-1 text-slate-200/[.5]">
        {`*AaronAI\'s responses may contain inaccurate information.`}
      </p>
    </div>
  );
};
