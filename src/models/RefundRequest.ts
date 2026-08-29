import mongoose, { Schema, Document } from "mongoose";

export interface IRefundRequest extends Document {
  requestId: string;
  customerId: string;
  customerName: string;
  orderId: string;
  product: string;
  amount: number;
  status: string;
  createdAt: Date;
}

const refundRequestSchema = new Schema<IRefundRequest>({
  requestId: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const RefundRequest =
  mongoose.models.RefundRequest ||
  mongoose.model<IRefundRequest>(
    "RefundRequest",
    refundRequestSchema
  );