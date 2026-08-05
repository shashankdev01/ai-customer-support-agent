export default function WelcomeCard() {
  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold text-gray-800">
        👋 Welcome!
      </h2>

      <p className="mt-3 text-gray-600">
        I'm your AI Customer Support Assistant. I can help you with refunds,
        orders, return policies and general product support.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">

        <button className="rounded-xl border p-4 hover:bg-blue-50 transition">
          💰
          <p className="mt-2 font-medium">Refund</p>
        </button>

        <button className="rounded-xl border p-4 hover:bg-blue-50 transition">
          📦
          <p className="mt-2 font-medium">Order Status</p>
        </button>

        <button className="rounded-xl border p-4 hover:bg-blue-50 transition">
          📄
          <p className="mt-2 font-medium">Return Policy</p>
        </button>

        <button className="rounded-xl border p-4 hover:bg-blue-50 transition">
          ❓
          <p className="mt-2 font-medium">Help</p>
        </button>

      </div>
    </div>
  );
}