import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ChatInput = ({ onSend }) => {
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
    <div className="flex items-center h-16 w-full border-t border-primary p-4">
      <input
        className="flex items-center h-10 w-full rounded px-3 text-sm focus:outline-none"
        type="text"
        placeholder="Ask AaronAI…"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />

      <button
        className="flex items-center justify-center h-10 w-20 rounded-md bg-primary hover:bg-primary-dark text-white focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={handleSend}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default ChatInput;
