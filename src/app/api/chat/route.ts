import OpenAI from "openai";
import { NextResponse } from "next/server";
import { findCustomerByOrderId } from "@/lib/customer";

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
`
      : "No customer information was found.";

    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
      {
  role: "system",
  content: `
You are an AI customer support assistant.

Answer the customer's question professionally and naturally.

Use the provided customer information when relevant.
Never invent customer or order information.

Keep responses concise and easy to read.
Do not use Markdown links.
Do not create mailto links.
For emails, display only the plain email address.

Customer information:
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