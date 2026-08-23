"use client";

import { useState } from "react";
import { Message } from "@/types/chat";

import QuickActions from "./QuickActions";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I'm your AI customer support assistant. How can I help you today?",
      time: "10:30 AM",
    },
  ]);

  const [input, setInput] = useState("");

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input;

  const newMessage: Message = {
    id: Date.now(),
    sender: "user",
    text: userMessage,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  setMessages((prev) => [...prev, newMessage]);
  setInput("");
  setIsTyping(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history: messages,
      }),
    });

    const data = await response.json();

    const aiMessage: Message = {
      id: Date.now() + 1,
      sender: "assistant",
      text: data.reply,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "assistant",
        text: "Sorry, something went wrong.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <section className="mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
      {/* Welcome Area */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="mb-4 flex h-15 w-15 items-center justify-center rounded-full bg-blue-100">
          <span className="text-4xl">🤖</span>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Hello, Shashank 👋
        </h2>

        <p className="mt-4 max-w-xl text-center text-lg text-slate-500">
          I'm your AI Customer Support Assistant.
          I can help you with refunds, orders,
          return policies and product support.
        </p>
      </div>

      <div className="my-8 border-t border-gray-200">
        <QuickActions />
      </div>

      <ChatMessages 
      messages={messages} 
      isTyping={isTyping}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </section>
  );
}