import { useState } from "react";
import { Message } from "@/types/chat";
import QuickActions from "./QuickActions";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
  const [message, setMessage] = useState<Message[]>([
     {
    id: 1,
    sender: "assistant",
    text: "Hello! I'm your AI customer support assistant. How can I help you today?",
    time: "10:30 AM",
  },
  ])
  return (
  <section className="mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl">

      {/* Welcome Area */}
      <div className="flex flex-col items-center justify-center py-4">

  <div className="mb-4 flex h-15 w-15 items-center justify-center rounded-full bg-blue-100">
    <span className="text-4xl">🤖</span>
  </div>

  <h2 className="text-3xl font-bold   text-slate-900">
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

      {/* Chat messages will come here */}
      <ChatMessages />

      {/* Chat Input will come here */}
     <ChatInput />
    </section>
  );
}