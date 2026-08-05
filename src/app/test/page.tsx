import { findCustomerByOrderId } from "@/lib/tools";

export default function TestPage() {
  const customer = findCustomerByOrderId("ORD1001");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Customer Test</h1>

      <pre className="bg-gray-100 text-black p-4 rounded-lg">
        {JSON.stringify(customer, null, 2)}
      </pre>
    </main>
  );
}