import { Customer } from "@/types/Customer";

export function createRefundRequest(customer: Customer) {
    const requestId =
        "REF-" + Date.now().toString().slice(-6);

    return {
        requestId,
        customerId: customer.id,
        orderId: customer.orderId,
        customerName: customer.name,
        amount: customer.price,
        status: "pending",
        createdAt: new Date().toISOString(),
    };
}