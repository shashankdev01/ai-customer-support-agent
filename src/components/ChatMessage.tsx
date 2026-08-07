import { Bot, User } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatMessages({ messages,isTyping }: ChatMessagesProps) {
  return (
    <div className="space-y-6 p-6">
      {messages.map((message) =>
        message.sender === "assistant" ? (
          <div key={message.id} className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <Bot size={20} />
            </div>

            <div className="max-w-xl rounded-2xl rounded-tl-sm border bg-white p-4 shadow-sm">
              {message.text}
            </div>
          </div>
        ) : (
          <div key={message.id} className="flex justify-end">
            <div className="max-w-xl rounded-2xl rounded-br-sm bg-blue-600 p-4 text-white">
              {message.text}
            </div>

            <div className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <User size={20} />
            </div>
          </div>
        )
      )}
      {isTyping && (
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
      <Bot size={20} />
    </div>

    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]"></span>
      </div>
    </div>
  </div>
)}
    </div>
  );
}