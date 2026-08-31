import OpenAI from "openai";
import { NextResponse } from "next/server";

import {
  findCustomerByOrderId,
  findCustomerByName,
  findCustomerByEmail,
} from "@/lib/customer";

import { getRefundStatus } from "@/lib/refundStatus";
import { checkRefundEligibility } from "@/lib/refund";
import { getOrderStatus } from "@/lib/order";
import { customers } from "@/data/Customers";
import { updateRefundStatus } from "@/lib/updateRefundStatus";
import { refundPolicy } from "@/lib/refundPolicy";
import { getProductInfo } from "@/lib/product";
import { detectIntent } from "@/lib/intent";
import { createRefundRequest } from "@/lib/refundRequest";


const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // 1. Detect intent
    const intent = detectIntent(message);

    console.log("Detected intent:", intent);

    // 2. Customer lookup
    let customer = null;

    // Find by Order ID
    const orderMatch = message.match(/ORD-?\d+/i);

    if (orderMatch) {
      const orderId = orderMatch[0]
        .replace("-", "")
        .toUpperCase();

      customer = findCustomerByOrderId(orderId);
    }

    // Find by Email
    if (!customer) {
      const emailMatch = message.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );

      if (emailMatch) {
        const email = emailMatch[0].toLowerCase();

        customer = findCustomerByEmail(email);
      }
    }

    // Find by Name
    if (!customer) {
      const customerName = customers.find((c) =>
        message.toLowerCase().includes(c.name.toLowerCase())
      );

      if (customerName) {
        customer = findCustomerByName(customerName.name);
      }
    }

    // 3. Check previous conversation
    if (!customer && Array.isArray(history)) {
      for (const chat of [...history].reverse()) {
        if (chat.sender !== "user") {
          continue;
        }

        // Previous Order ID
        const previousOrderMatch =
          chat.text.match(/ORD-?\d+/i);

        if (previousOrderMatch) {
          const orderId = previousOrderMatch[0]
            .replace("-", "")
            .toUpperCase();

          customer = findCustomerByOrderId(orderId);

          if (customer) {
            break;
          }
        }

        // Previous Email
        const previousEmailMatch = chat.text.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
        );

        if (previousEmailMatch) {
          const email =
            previousEmailMatch[0].toLowerCase();

          customer = findCustomerByEmail(email);

          if (customer) {
            break;
          }
        }

        // Previous Name
        const previousCustomer = customers.find((c) =>
          chat.text
            .toLowerCase()
            .includes(c.name.toLowerCase())
        );

        if (previousCustomer) {
          customer = findCustomerByName(
            previousCustomer.name
          );

          if (customer) {
            break;
          }
        }
      }
    }

    console.log("Detected customer:", customer);

    // 4. Business logic
    let refundResult = null;
    let refundRequest = null;
    let orderResult = null;
    let productResult = null;
    let refundStatus = null;
    let updatedRefund = null;
    // Refund
    if (customer && intent === "refund") {
      refundResult = checkRefundEligibility(customer);

      console.log("Refund Result:", refundResult);

      if (refundResult.eligible) {
        refundRequest = await createRefundRequest(customer);

        console.log(
          "Refund Request:",
          refundRequest
        );
      }
    }
    // refund status 
    if (
      customer &&
      (message.toLowerCase().includes("refund status") ||
        message.toLowerCase().includes("status of my refund"))
    ) {
      refundStatus = await getRefundStatus(customer.orderId);

      console.log("Refund Status:", refundStatus);
    }

    // Order
    if (customer && intent === "order") {
      orderResult = getOrderStatus(customer.orderId);

      console.log("Order Result:", orderResult);
    }

    // Product
    if (customer) {
      productResult = getProductInfo(customer.product);

      console.log("Product Result:", productResult);
    }

    // 5. Customer context
    const customerContext = customer
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

${refundResult
        ? `
Refund eligibility:

Eligible: ${refundResult.eligible}
Reason: ${refundResult.reason}
Refund Amount: ₹${refundResult.refundAmount}
Manager Approval Required: ${refundResult.managerApprovalRequired}
`
        : ""
      }

${orderResult
        ? `
Order information:

Order ID: ${orderResult.orderId}
Customer Name: ${orderResult.customerName}
Product: ${orderResult.product}
Status: ${orderResult.status}
Delivered Date: ${orderResult.deliveredDate}
`
        : ""
      }

${productResult
        ? `
Product information:

Product: ${productResult.product}
Product Type: ${productResult.productType}
Price: ₹${productResult.price}
`
        : ""
      }

${refundRequest
        ? `
Refund request:

Request ID: ${refundRequest.requestId}
Order ID: ${refundRequest.orderId}
Amount: ₹${refundRequest.amount}
Status: ${refundRequest.status}
Created At: ${refundRequest.createdAt}
`
        : ""
      }
      ${refundStatus
        ? `
Refund status:

Request ID: ${refundStatus.requestId}
Order ID: ${refundStatus.orderId}
Amount: ₹${refundStatus.amount}
Status: ${refundStatus.status}
Created At: ${refundStatus.createdAt}
`
        : ""
      }
`
      : "No customer information was found.";

    // 6. Refund policy
    const policyContext =
      intent === "policy"
        ? `
Refund Policy:

${refundPolicy}
`
        : "";

    // 7. Conversation history
    const conversationHistory: Array<{
      role: "user" | "assistant";
      content: string;
    }> = Array.isArray(history)
        ? history.map((chat: any) => ({
          role:
            chat.sender === "user"
              ? "user"
              : "assistant",
          content: String(chat.text || ""),
        }))
        : [];
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("approve refund") ||
      lowerMessage.includes("reject refund") ||
      lowerMessage.includes("complete refund")
    ) {
      const requestIdMatch = message.match(/REF-\d+/i);

      if (requestIdMatch) {
        let status = "";

        if (lowerMessage.includes("approve refund")) {
          status = "approved";
        } else if (lowerMessage.includes("reject refund")) {
          status = "rejected";
        } else if (lowerMessage.includes("complete refund")) {
          status = "completed";
        }

        updatedRefund = await updateRefundStatus(
          requestIdMatch[0].toUpperCase(),
          status
        );

        console.log("Updated Refund:", updatedRefund);
      }
    }

    // 8. AI request
    const completion =
      await client.chat.completions.create({
        model: "google/gemini-2.5-flash",

        messages: [
          {
            role: "system",

            content: `
You are an AI customer support assistant.

Help customers with:

- Orders
- Refunds
- Refund policies
- Customer information
- Product support

Detected intent:

${intent}

IMPORTANT RULES:

1. Use ONLY the information provided in the context.

2. Never invent customer information.

3. Never invent order information.

4. Never invent refund eligibility.

5. Never invent refund policies.

6. If refund eligibility is false, explain the provided reason.

7. If refund eligibility is true, explain that the customer is eligible.

8. If the user asks about an order, use the provided order information.

9. If the user asks about the refund policy, use ONLY the provided Refund Policy.

10. If customer information is unavailable for a specific customer question, ask for an Order ID, customer name, or email.

11. General refund policy questions do not require customer information.

12. Do not create fake support emails, phone numbers, links, or policies.

13. Keep responses concise and professional.

14. Display email addresses as plain text.

15. When asked for the refund policy, provide ALL available rules.

16. Do not summarize the policy unless specifically asked.

17. If the user asks about the product, use the provided Product information.

18. Never invent product information, features, specifications, or prices.

19. Use conversation history for follow-up questions.

20. Do not ask for information already provided earlier in the conversation.

21. Do not use Markdown formatting.

22. Do not use asterisks for bullets or bold text.

23. Use plain text only.

24. Put each item on a separate line.

25. If a refund request was created, tell the customer that it was created and provide the Refund Request ID.

26. Never claim a refund request was created unless Refund Request information exists in the context.

CUSTOMER CONTEXT:

${customerContext}

POLICY CONTEXT:

${policyContext}
`,
          },

          ...conversationHistory,

          {
            role: "user",
            content: message,
          },
        ],

        max_tokens: 300,
      });

    // 9. Clean response
    const reply =
      completion.choices[0].message.content || "";

    const cleanReply = reply
      .replace(/\*\*/g, "")
      .replace(/^\s*\*\s+/gm, "")
      .replace(/^[-•]\s+/gm, "")
      .trim();

    // 10. Return response
    return NextResponse.json({
      reply: cleanReply,
    });
  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        reply:
          "Something went wrong. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}