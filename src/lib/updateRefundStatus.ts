import { connectDB } from "@/lib/mongodb";
import { RefundRequest } from "@/models/RefundRequest";

export async function updateRefundStatus(
  requestId: string,
  status: string
) {
  await connectDB();

  return await RefundRequest.findOneAndUpdate(
    { requestId },
    { status },
    { new: true }
  );
}