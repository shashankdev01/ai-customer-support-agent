import { Bot, User, CheckCheck } from "lucide-react";

export default function ChatMessages() {
  return (
    <div className="space-y-8 px-8 py-6 bg-green-50">

      {/* Date */}
      <div className="flex justify-center">
        <span className="rounded-full bg-gray-100 px-4 py-1 text-sm text-gray-500">
          Today
        </span>
      </div>

      {/* AI Message */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
          <Bot size={22} />
        </div>

        <div>
          <div className="mb-1 flex items-center gap-3">
            <h3 className="font-semibold">AI Assistant</h3>
            <span className="text-sm text-gray-400">10:30 AM</span>
          </div>

          <div className="max-w-xl rounded-2xl rounded-tl-sm border border-gray-200 bg-white p-5 shadow-sm">
            <p className="leading-7 text-gray-700">
              Hello! I'm your AI customer support assistant.
            </p>

            <p className="mt-2 leading-7 text-gray-700">
              I can help you with refunds, order tracking,
              return policies and product support. 😊
            </p>
          </div>
        </div>
      </div>

      {/* User Message */}
      <div className="flex justify-end">
        <div className="max-w-xl">

          <div className="mb-1 flex items-center justify-end gap-2 text-sm text-gray-400">
            <span>10:31 AM</span>
            <CheckCheck size={16} className="text-blue-600" />
          </div>

          <div className="rounded-2xl rounded-br-sm bg-blue-600 px-6 py-4 text-white shadow">
            I want a refund for order ORD1001
          </div>

        </div>

        <div className="ml-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <User size={20} />
        </div>
      </div>

      {/* AI Reply */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
          <Bot size={22} />
        </div>

        <div>
          <div className="mb-1 flex items-center gap-3">
            <h3 className="font-semibold">AI Assistant</h3>
            <span className="text-sm text-gray-400">10:31 AM</span>
          </div>

          <div className="max-w-xl rounded-2xl rounded-tl-sm border border-gray-200 bg-white p-5 shadow-sm">
            <p className="leading-7 text-gray-700">
              Sure! Let me check the details of your order
              <strong> ORD1001</strong>.
            </p>

            <p className="mt-2 text-gray-700">
              Please give me a moment...
            </p>

            <div className="mt-3 flex gap-2">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]"></span>
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}