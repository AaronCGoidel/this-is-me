import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingMessage from "./Loading";
import { v4 as uuidv4 } from "uuid";
import { FaPaperPlane } from "react-icons/fa";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MessageCounter: React.FC<{
  messages: any[];
  limit: number;
  overLimit: boolean;
}> = ({ messages, limit, overLimit }) => {
  return (
    <p>
      <span
        className={`text-gray-500 text-sm absolute bg-white rounded-md p-1 shadow-md ml-2 mt-1 ${
          overLimit ? "text-red-500" : ""
        }`}
      >
        {messages.length} / {limit}
      </span>
    </p>
  );
};

const ChatBot = ({}) => {
  const example_prompts = [
    "What are some of Aaron's ML projects?",
    "Where did Aaron go to school?",
    "Can I have a copy of Aaron's resume?",
    "Write me a haiku about Aaron.",
  ];
  const initialMessages = [
    {
      content: "Hi, I'm Aaron's chatbot! Ask me anything.",
      isReceived: true,
    },
  ];

  const [messages, setMessages] = useState([...initialMessages]);
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const chatId = uuidv4();
  const messagesEndRef = useRef(null);
  const [hoveredPromptIndex, setHoveredPromptIndex] = useState(null);

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
        const response = await fetch("/api/predictions", {
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

        const prediction = await response.json();

        if (prediction && prediction.urls && prediction.urls.stream) {
          console.log("Streaming predictions...");
          setStreaming(true);
          const newMessage = {
            content: "",
            isReceived: true,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setAwaitingResponse(false);
          const source = new EventSource(prediction.urls.stream, {
            withCredentials: true,
          });

          source.addEventListener("output", (e) => {
            const streamedData = e.data;

            setMessages((prevMessages) => {
              // we want to update the last message with the new streamed data
              const lastMessage = prevMessages[prevMessages.length - 1];
              const updatedLastMessage = {
                ...lastMessage,
                content: lastMessage.content + streamedData,
              };

              return [
                ...prevMessages.slice(0, prevMessages.length - 1),
                updatedLastMessage,
              ];
            });
          });

          source.addEventListener("error", (e) => {
            console.error("Streaming error", e);
          });

          source.addEventListener("done", (e) => {
            source.close();
            setStreaming(false);
            setAwaitingResponse(false);
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Call the async function
    queryModel();
  }, [awaitingResponse, messages]);

  return (
    <div className="flex flex-col w-full h-full bg-background">
      {/* <MessageCounter messages={messages} limit={limit} overLimit={overLimit} /> */}
      <div
        className={`flex flex-col flex-grow p-4 overflow-y-auto ${
          messages.length == 0 ? "justify-center" : undefined
        }`}
      >
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

      <div className="flex justify-center">
        <div className="md:grid md:grid-cols-2 gap-1 p-4 flex space-x-2 overflow-x-scroll w-full md:w-4/6">
          {example_prompts.map((prompt, index) => (
            <button
              className="border-gray-500 border text-left text-gray-500 py-6 px-2 rounded m-2 text-sm flex items-center justify-between hover:bg-gray-400 flex-shrink-0 bg-opacity-0 bg-white hover:bg-opacity-25"
              key={index}
              onMouseEnter={() => setHoveredPromptIndex(index)}
              onMouseLeave={() => setHoveredPromptIndex(null)}
              onClick={async () => {
                await handleNewUserMessage(prompt);
              }}
            >
              {prompt}
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-md bg-white shadow ${
                  hoveredPromptIndex === index ? "visible" : "invisible"
                }`}
              >
                <FaPaperPlane className="text-background" />
              </div>
            </button>
          ))}
        </div>
      </div>
      <ChatInput
        awaitingResponse={awaitingResponse}
        onSend={handleNewUserMessage}
        disabled={overLimit}
      />
    </div>
  );
};

export default ChatBot;
