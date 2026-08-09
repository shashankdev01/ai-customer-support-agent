import { Customer } from "@/types/Customer";

interface RefundResult {
  eligible: boolean;
  reason: string;
  refundAmount: number;
  managerApprovalRequired: boolean;
}

export function checkRefundEligibility(
  customer: Customer
): RefundResult {
  // Rule 1: Digital products are non-refundable
  if (customer.productType === "digital") {
    return {
      eligible: false,
      reason: "Digital products are non-refundable.",
      refundAmount: 0,
      managerApprovalRequired: false,
    };
  }

  // Rule 2: Customer-damaged products are not eligible
  if (customer.damaged) {
    return {
      eligible: false,
      reason: "Products damaged by the customer are not eligible for a refund.",
      refundAmount: 0,
      managerApprovalRequired: false,
    };
  }

  // Rule 3: Maximum 2 refunds per year
  if (customer.refundCount >= 2) {
    return {
      eligible: false,
      reason: "The customer has already reached the maximum of 2 refunds per year.",
      refundAmount: 0,
      managerApprovalRequired: false,
    };
  }

  // Rule 4: Refund only within 7 days of delivery
  const deliveredDate = new Date(customer.deliveredDate);
  const currentDate = new Date();

  const differenceInMs =
    currentDate.getTime() - deliveredDate.getTime();

  const differenceInDays =
    differenceInMs / (1000 * 60 * 60 * 24);

  if (differenceInDays > 7) {
    return {
      eligible: false,
      reason: "Refund requests are only allowed within 7 days of delivery.",
      refundAmount: 0,
      managerApprovalRequired: false,
    };
  }

  // Rule 5: Refunds above ₹50,000 require manager approval
  const managerApprovalRequired = customer.price > 50000;

  return {
    eligible: true,
    reason: managerApprovalRequired
      ? "Refund is eligible but requires manager approval because the amount exceeds ₹50,000."
      : "The order is eligible for a refund.",
    refundAmount: customer.price,
    managerApprovalRequired,
  };
}