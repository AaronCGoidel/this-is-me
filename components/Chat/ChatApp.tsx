import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingMessage from "./Loading";
import { v4 as uuidv4 } from "uuid";

async function* streamingFetch(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init)
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  for (; ;) {
    const { done, value } = await reader.read()
    if (done) break;

    try {
      yield decoder.decode(value)
    }
    catch (e: any) {
      console.warn(e.message)
    }
  }
}

const ChatApp = ({ }) => {
  const example_prompts = [
    "Write me a poem about Aaron",
    "Where did Aaron go to school?",
  ];
  const initialMessages = [];

  const [messages, setMessages] = useState([...initialMessages]);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const chatId = uuidv4();
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

  const limit = 10;
  const overLimit = messages.length >= limit;

  const handleNewUserMessage = async (content) => {
    if (awaitingResponse || overLimit) {
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
    if (!awaitingResponse || streaming) {
      return;
    }

    const lookupKnowledge = async (query, n) => {
      console.log(`Looking up knowledge for "${query}"...`);

      try {
        const res = await fetch(
          `/api/search?query=${encodeURIComponent(query)}&n=${n}`
        );
        const data = await res.json();

        return data;
      } catch (error) {
        console.error("Error fetching knowledge:", error);

        return [];
      }
    };

    const queryModel = async () => {
      console.log("Querying model...");

      const userPrompt = messages[messages.length - 1].content;
      console.log("userPrompt:", userPrompt);

      const chatHistory = messages
        .slice(0, messages.length - 1)
        .map((message) => message.content)
        .slice(-4);
      console.log("chatHistory:", chatHistory);

      let knowledge = await lookupKnowledge(userPrompt, 4);
      if (chatHistory.length > 0) {
        const last_message = chatHistory[chatHistory.length - 1];
        const last_message_knowledge = await lookupKnowledge(last_message, 3);
        knowledge = [...knowledge, ...last_message_knowledge];
      }
      console.log("knowledge:", knowledge);

      try {
        const stream = streamingFetch("/api/predictions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_prompt: userPrompt,
            chat_history: chatHistory,
            knowledge: knowledge,
            chat_id: chatId,
          }),
        });

        console.log("Streaming predictions...");
        setStreaming(true);
        const newMessage = {
          content: "",
          isReceived: true,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setAwaitingResponse(false);

        for await (const chunk of stream) {
          const content = chunk;
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const updatedLastMessage = {
              ...lastMessage,
              content: lastMessage.content + content,
            };

            return [
              ...prevMessages.slice(0, prevMessages.length - 1),
              updatedLastMessage,
            ];
          });
        }
        setStreaming(false);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the async function
    queryModel();
  }, [awaitingResponse, messages]);

  return (
    <div
      className="flex flex-col w-full bg-white shadow-xl rounded-lg overflow-hidden flex-grow"
      style={{ height: "600px" }}
    >
      <p>
        <span
          className={`text-gray-500 text-sm absolute bg-white rounded-md p-1 shadow-md ml-2 mt-1 ${overLimit ? "text-red-500" : ""
            }`}
        >
          {messages.length} / {limit}
        </span>
      </p>
      <div
        className={`flex flex-col flex-grow p-4 overflow-y-auto ${messages.length == 0 ? "justify-center" : undefined
          }`}
      >
        {messages.length == 0 && (
          <h2 className="text-center text-gray-400">Say hello!</h2>
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            isReceived={message.isReceived}
            content={message.content}
          />
        ))}
        {awaitingResponse && <LoadingMessage isReceived={true} />}{" "}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex flex-row flex-wrap justify-center">
        {example_prompts.map((prompt, index) => (
          <button
            className="border-gray-500 border text-gray-500 py-2 px-2 rounded m-2 text-sm hover:bg-gray-200 hover:text-gray-700 hover:border-gray-700"
            key={index}
            onClick={async () => {
              await handleNewUserMessage(prompt);
            }}
          >
            {prompt}
          </button>
        ))}
      </div>
      <ChatInput
        awaitingResponse={awaitingResponse}
        onSend={handleNewUserMessage}
        disabled={overLimit}
      />
    </div>
  );
};

export default ChatApp;
