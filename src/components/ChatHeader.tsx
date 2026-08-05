import { Settings, User, Plus } from "lucide-react";

export default function ChatHeader() {
  return (
   <header className="sticky top-0 z-50 w-full border-b border-gray-300 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-10 py-4  ">

        {/* Left Side */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold">
            AI
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Customer Support
            </h1>

            <p className="text-sm text-gray-500">
              Refunds • Orders • Support
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
            <Plus size={16} />
            New Chat
          </button>

          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Settings size={20} />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
            <User size={18} />
          </button>

        </div>

      </div>
    </header>
  );
}