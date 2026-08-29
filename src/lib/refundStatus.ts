import { connectDB } from "@/lib/mongodb";
import { RefundRequest } from "@/models/RefundRequest";

export async function getRefundStatus(orderId: string) {
  await connectDB();

  const refundRequest = await RefundRequest.findOne({
    orderId,
  }).sort({ createdAt: -1 });

  return refundRequest;
}