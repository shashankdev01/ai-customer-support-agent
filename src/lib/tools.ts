import { customers } from "@/data/Customers";

export function findCustomerByOrderId(orderId: string) {
  return customers.find(
    (Customer) => Customer.orderId.toLowerCase() === orderId.toLowerCase()
  );
}