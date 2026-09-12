import { connectDB } from "@/lib/mongodb";
import { RefundRequest } from "@/models/RefundRequest";

export async function updateRefundStatus(
  orderId: string,
  status: string
) {
  await connectDB();

  return await RefundRequest.findOneAndUpdate(
    { orderId },
    { status },
    {
      new: true,
      sort: { createdAt: -1 },
    }
  );
}