import OpenAI from "openai";
import { NextResponse } from "next/server";
import { findCustomerByOrderId } from "@/lib/customer";
import { checkRefundEligibility } from "@/lib/refund";
import { getOrderStatus } from "@/lib/order";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {

    const { message } = await req.json();

    // Find an order ID like ORD1001 or ORD-1001
    const orderMatch = message.match(/ORD-?\d+/i);

    let customer = null;

    if (orderMatch) {
      const orderId = orderMatch[0].replace("-", "").toUpperCase();

      customer = findCustomerByOrderId(orderId);
    }

    console.log("Detected customer:", customer);

    const lowerMessage = message.toLowerCase();

    const isRefundRequest =
      lowerMessage.includes("refund") ||
      lowerMessage.includes("money back") ||
      lowerMessage.includes("return my money");

    const isOrderRequest =
      lowerMessage.includes("where is my order") ||
      lowerMessage.includes("order status") ||
      lowerMessage.includes("track my order") ||
      lowerMessage.includes("where is my package") ||
      lowerMessage.includes("track order");
    let refundResult = null;
    let orderResult = null;

    if (customer && isRefundRequest) {
      refundResult = checkRefundEligibility(customer);

      console.log("Refund Result:", refundResult);
    }

    if (customer && isOrderRequest) {
      orderResult = getOrderStatus(customer.orderId);

      console.log("Order Result:", orderResult);
    }
    // Give the AI the customer information when available
    const context = customer
      ? `
            Customer information:
            Name: ${customer.name}
            Email: ${customer.email}
            Order ID: ${customer.orderId}
            Product: ${customer.product}
            Product Type: ${customer.productType}
            Purchase Date: ${customer.purchaseDate}
            Delivered Date: ${customer.deliveredDate}
            Price: ₹${customer.price}
            Damaged: ${customer.damaged}
            Previous Refunds: ${customer.refundCount}
            ${refundResult ? `
            Refund eligibility:
            Eligible: ${refundResult.eligible}
            Reason: ${refundResult.reason}
            Refund Amount: ₹${refundResult.refundAmount}
            Manager Approval Required: ${refundResult.managerApprovalRequired}
            ` : ""}

                      ${orderResult ? `
            Order status:
            Status: ${orderResult.status}
            Delivered Date: ${orderResult.deliveredDate}
            ` : ""}
            `
      : "No customer information was found.";

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `
You are an AI customer support assistant.

Answer the customer's question professionally and clearly.

IMPORTANT RULES:

- Use ONLY the customer, refund, and order information provided in the context.
- Never invent customer information.
- Never invent refund policies.
- Never invent order status.
- If the refund eligibility says false, clearly explain the provided reason.
- If the refund eligibility says true, explain that the customer is eligible.
- If the user asks about order status, use the provided order status.
- Do not create fake support emails or links.
- Keep responses concise.
- Display email addresses as plain text.

${context}
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}