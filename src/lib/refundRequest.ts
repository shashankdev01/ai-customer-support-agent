import { Customer } from "@/types/Customer";
import { connectDB } from "@/lib/mongodb";
import { RefundRequest } from "@/models/RefundRequest";

export async function createRefundRequest(customer: Customer) {
  await connectDB();

  const requestId =
    "REF-" + Date.now().toString().slice(-6);

  const refundRequest = await RefundRequest.create({
    requestId,
    customerId: customer.id,
    orderId: customer.orderId,
    customerName: customer.name,
    product: customer.product,
    amount: customer.price,
    status: "pending",
  });

  return refundRequest;
}