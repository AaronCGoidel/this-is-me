import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaArrowUp, FaPaperPlane } from "react-icons/fa";
import { Card, CardContent } from "./ui/card";

interface ChatInputProps {
  className?: string;
}

export const ChatInput = ({ className }: ChatInputProps) => {
  return (
    <div
      className={`${className} w-screen bg-gradient-to-t from-black via-black to-transparent px-4`}
    >
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
