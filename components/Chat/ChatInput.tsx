import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

type ChatInputProps = {
  onSend: (content: string) => void;
  awaitingResponse: boolean;
  disabled: boolean;
};

const ChatInput = ({ onSend, awaitingResponse, disabled }: ChatInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    // prevent sending empty messages
    if (inputValue.trim()) {
      onSend(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center justify-center h-16 w-full p-4">
      {!awaitingResponse ? (
        <>
          <input
            className="flex items-center h-12 rounded px-3 text-lg focus:outline-none bg-inherit w-full md:w-3/5 text-white ring-1 ring-white mr-4"
            type="text"
            placeholder={disabled ? "Message limit reached." : "Ask AaronAI…"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button
            className={`flex items-center justify-center h-12 w-20 rounded-md ${
              disabled
                ? "bg-gray-300 cursor-not-allowed"
                : "ring-white hover:bg-primary-dark focus:outline-none ring-1 focus:ring-primary"
            }  text-white `}
            onClick={handleSend}
          >
            <FaPaperPlane />
          </button>
        </>
      ) : (
        <div className="flex items-center h-10 w-full rounded px-3 text-sm focus:outline-none ">
          <p>Waiting for response...</p>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
