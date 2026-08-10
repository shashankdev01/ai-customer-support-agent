import { customers } from "@/data/Customers";

export function findCustomerByEmail(email: string) {
  return customers.find(
    (customer) => customer.email.toLowerCase() === email.toLowerCase()
  );
}

export function findCustomerByOrderId(orderId: string) {
  return customers.find(
    (customer) => customer.orderId.toLowerCase() === orderId.toLowerCase()
  );
}

export function findCustomerByName(name: string) {
  return customers.find(
    (customer) =>
      customer.name.toLowerCase() === name.toLowerCase()
  );
}

export function getAllCustomers() {
  return customers;
}