import { FormEvent } from "react";
import { ppMori } from "../app/lib/fonts";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
  placeholder = "Let the magic begin, Ask a question",
  disabled = false,
}: ChatInputProps) {
  return (
    <div className="p-4">
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            value={input}
            onChange={onInputChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-[#020203] rounded-lg text-white focus:outline-none focus:border-gray-500 transition-colors ${ppMori.regular}`}
            disabled={isLoading || disabled}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim() || disabled}
          className="px-4 py-3 bg-[#020203] hover:bg-[#020203] disabled:bg-[#020203] disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send />
          )}
        </button>
      </form>
    </div>
  );
}
