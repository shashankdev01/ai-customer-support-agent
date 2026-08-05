import ChatContainer from "@/components/ChatContainer";
import ChatHeader from "@/components/ChatHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <ChatHeader />

      <div className="mx-auto w-[92%] max-w-362.5 py-6">
        <ChatContainer />
      </div>
    </main>
  );
}