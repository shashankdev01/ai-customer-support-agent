import OpenAI from "openai";
import { NextResponse } from "next/server";

import {
  findCustomerByOrderId,
  findCustomerByName,
  findCustomerByEmail,
} from "@/lib/customer";

import { checkRefundEligibility } from "@/lib/refund";
import { getOrderStatus } from "@/lib/order";
import { customers } from "@/data/Customers";
import { refundPolicy } from "@/lib/refundPolicy";
import { getProductInfo } from "@/lib/product";
import { detectIntent } from "@/lib/intent";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // --------------------------------------------------
    // 1. DETECT INTENT
    // --------------------------------------------------

    const intent = detectIntent(message);

    console.log("Detected intent:", intent);

    // --------------------------------------------------
    // 2. CUSTOMER LOOKUP
    // --------------------------------------------------

    let customer = null;

    // Find Order ID
    const orderMatch = message.match(/ORD-?\d+/i);

    if (orderMatch) {
      const orderId = orderMatch[0]
        .replace("-", "")
        .toUpperCase();

      customer = findCustomerByOrderId(orderId);
    }

    // Find Email
    // Find Email
    if (!customer) {
      const emailMatch = message.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );

      if (emailMatch) {
        const email = emailMatch[0].toLowerCase();

        customer = findCustomerByEmail(email);
      }
    }

    // Find Customer by Name
    if (!customer) {
      const customerName = customers.find((c) =>
        message.toLowerCase().includes(c.name.toLowerCase())
      );

      if (customerName) {
        customer = findCustomerByName(customerName.name);
      }
    }

    // --------------------------------------------------
    // 3. CHECK PREVIOUS CHAT HISTORY
    // --------------------------------------------------

    if (!customer && history) {
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
          const email = previousEmailMatch[0].toLowerCase();

          const foundCustomer = customers.find(
            (c) => c.email.toLowerCase() === email
          );

          if (foundCustomer) {
            customer = foundCustomer;
            break;
          }
        }

        // Previous Customer Name
        const previousCustomer = customers.find((c) =>
          chat.text.toLowerCase().includes(c.name.toLowerCase())
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

    // --------------------------------------------------
    // 4. REFUND / ORDER RESULTS
    // --------------------------------------------------

    let refundResult = null;
    let orderResult = null;
    let productResult = null;
    // Refund
    if (customer && intent === "refund") {
      refundResult = checkRefundEligibility(customer);

      console.log("Refund Result:", refundResult);
    }


    // Order
    if (customer && intent === "order") {
      orderResult = getOrderStatus(customer.orderId);

      console.log("Order Result:", orderResult);
    }

    // Product information 

    if (customer) {
      productResult = getProductInfo(customer.product);

      console.log("Product Result:", productResult);
    }

    // --------------------------------------------------
    // 5. CUSTOMER CONTEXT
    // --------------------------------------------------

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
`
      : "No customer information was found.";



    // --------------------------------------------------
    // 6. REFUND POLICY CONTEXT
    // --------------------------------------------------

    const policyContext =
      intent === "policy"
        ? `
Refund Policy:

${refundPolicy}
`
        : "";

    // --------------------------------------------------
    // 7. SEND REQUEST TO AI
    // --------------------------------------------------

    const completion =
      await client.chat.completions.create({
        model: "google/gemini-2.5-flash",

        messages: [
          {
            role: "system",

            content: `
You are an AI customer support assistant.

Your job is to help customers with:

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

6. If refund eligibility is false, clearly explain the provided reason.

7. If refund eligibility is true, clearly explain that the customer is eligible.

8. If the user asks about an order, use the provided order information.

9. If the user asks about the refund policy, use ONLY the provided Refund Policy.

10. If no customer information is available and the user asks for specific customer/order information, politely ask for an Order ID, customer name, or email.

11. If the user asks for the general refund policy, you do NOT need customer information.

12. Do not create fake support emails, phone numbers, links, or policies.

13. Keep responses concise and professional.

14. Display email addresses as plain text.

15. If the user asks for the refund policy, refund rules, refund guidelines, or return policy, provide all available refund policy rules, not just one rule.

16. Do not summarize the policy unless the user specifically asks for a summary.

17. If the user asks about the product, use the provided Product information.

18. Never invent product information, features, specifications, or prices.

--------------------------------
CUSTOMER CONTEXT
--------------------------------

${customerContext}

--------------------------------
POLICY CONTEXT
--------------------------------

${policyContext}
`,
          },

          {
            role: "user",
            content: message,
          },
        ],

        max_tokens: 300,
      });

    // --------------------------------------------------
    // 8. RETURN AI RESPONSE
    // --------------------------------------------------

    const reply = completion.choices[0].message.content || "";

    const cleanReply = reply
      .replace(/\*\*/g, "")
      .replace(/^\s*\*\s+/gm, "")
      .trim();

    return NextResponse.json({
      reply: cleanReply,
    });
  } catch (error) {
    console.error(error);

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