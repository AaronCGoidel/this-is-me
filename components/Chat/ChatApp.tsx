import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatApp = ({}) => {
  const example_prompts = [
    "What are some of Aaron's ML projects?",
    "Where did Aaron go to school?",
  ];

  const initialMessages = [];

  const [messages, setMessages] = useState([...initialMessages]);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  useEffect(() => {
    if (messages.length > initialMessages.length) scrollToBottom();
  }, [messages]);

  const handleNewUserMessage = (content) => {
    if (awaitingResponse) {
      return;
    }

    const newMessage = {
      content: content,
      isReceived: false,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setAwaitingResponse(true);
  };

  useEffect(() => {
    if (!awaitingResponse) {
      return;
    }

    const newMessage = {
      content: "I'm a response!",
      isReceived: true,
    };

    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setAwaitingResponse(false);
    }, 1000);
  }, [awaitingResponse]);

  return (
    <div
      className="flex flex-col w-full bg-white shadow-xl rounded-lg overflow-hidden"
      style={{ height: "500px" }}
    >
      <div className={`flex flex-col flex-grow p-4 overflow-y-auto ${messages.length == 0 ? 'justify-center' : undefined}`}>
      {messages.length == 0 && <h2 className="text-center text-gray-400">Say hello!</h2>}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            isReceived={message.isReceived}
            content={message.content}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        {example_prompts.map((prompt, index) => (
          <button
            className="border-gray-500 border text-gray-500 py-2 px-2 rounded m-2 text-sm hover:bg-gray-200 hover:text-gray-700 hover:border-gray-700"
            key={index}
            onClick={() => handleNewUserMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
      <ChatInput
        awaitingResponse={awaitingResponse}
        onSend={handleNewUserMessage}
      />
    </div>
  );
};

export default ChatApp;
