import { findCustomerByOrderId } from "@/lib/customer";

export function getOrderStatus(orderId: string) {
  const customer = findCustomerByOrderId(orderId);

  if (!customer) {
    return null;
  }

  return {
    orderId: customer.orderId,
    customerName: customer.name,
    product: customer.product,
    status: customer.orderStatus,
    deliveredDate: customer.deliveredDate,
  };
}