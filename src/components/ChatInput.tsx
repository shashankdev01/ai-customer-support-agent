"use client";

import { Paperclip, Mic, SendHorizonal } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
}: ChatInputProps) {
  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 rounded-3xl border border-gray-300 bg-white p-1 shadow-sm">

        {/* Attachment */}
        <button
          type="button"
          className="rounded-xl p-2 transition hover:bg-gray-100"
        >
          <Paperclip className="h-4 w-4 text-gray-600" />
        </button>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSend();
            }
          }}
          placeholder="Type your message here..."
          className="flex-1 border-none bg-transparent text-lg outline-none placeholder:text-gray-400"
        />

        {/* Microphone */}
        <button
          type="button"
          className="rounded-xl p-3 transition hover:bg-gray-100"
        >
          <Mic className="h-5 w-5 text-gray-600" />
        </button>

        {/* Send */}
        <button
          type="button"
          onClick={onSend}
          className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700"
        >
          <SendHorizonal className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
}