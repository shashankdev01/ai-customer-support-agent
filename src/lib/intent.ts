export type Intent =
  | "refund"
  | "order"
  | "policy"
  | "general";

export function detectIntent(message: string): Intent {
  const text = message.toLowerCase();

  // Refund-related questions
  if (
    text.includes("refund") ||
    text.includes("money back") ||
    text.includes("return my money") ||
    text.includes("get my money back") ||
    text.includes("want to return") ||
    text.includes("want a return") ||
    text.includes("return this")
  ) {
    return "refund";
  }

  // Order-related questions
  if (
    text.includes("order status") ||
    text.includes("where is my order") ||
    text.includes("track my order") ||
    text.includes("track order") ||
    text.includes("where is my package") ||
    text.includes("order details") ||
    text.includes("delivery status") ||
    text.includes("when will my order arrive")
  ) {
    return "order";
  }

  // Policy-related questions
  if (
    text.includes("refund policy") ||
    text.includes("refund rules") ||
    text.includes("refund guidelines") ||
    text.includes("return policy") ||
    text.includes("refund conditions") ||
    text.includes("how many days") ||
    text.includes("digital products refundable")
  ) {
    return "policy";
  }

  return "general";
}