import { Customer } from "@/types/Customer";

export const customers: Customer[] = [
  // 1. Normal eligible refund
  {
    id: "C001",
    name: "John Doe",
    email: "john@example.com",
    orderId: "ORD1001",
    product: "Wireless Mouse",
    productType: "physical",
    purchaseDate: "2026-08-22",
    deliveredDate: "2026-08-24",
    price: 999,
    damaged: false,
    refundCount: 0,
    orderStatus: "delivered",
  },

  // 2. Digital product - not refundable
  {
    id: "C002",
    name: "Sarah Smith",
    email: "sarah@example.com",
    orderId: "ORD1002",
    product: "React Masterclass",
    productType: "digital",
    purchaseDate: "2026-08-22",
    deliveredDate: "2026-08-23",
    price: 1999,
    damaged: false,
    refundCount: 1,
    orderStatus: "delivered",
  },

  // 3. Product damaged by customer
  {
    id: "C003",
    name: "Mike Johnson",
    email: "mike@example.com",
    orderId: "ORD1003",
    product: "Bluetooth Headphones",
    productType: "physical",
    purchaseDate: "2026-08-22",
    deliveredDate: "2026-08-24",
    price: 2499,
    damaged: true,
    refundCount: 0,
    orderStatus: "delivered",
  },

  // 4. Customer already requested 2 refunds
  {
    id: "C004",
    name: "Alex Brown",
    email: "alex@example.com",
    orderId: "ORD1004",
    product: "Mechanical Keyboard",
    productType: "physical",
    purchaseDate: "2026-08-22",
    deliveredDate: "2026-08-24",
    price: 4999,
    damaged: false,
    refundCount: 2,
    orderStatus: "delivered",
  },

  // 5. Old order - outside 7 day refund period
  {
    id: "C005",
    name: "David Wilson",
    email: "david@example.com",
    orderId: "ORD1005",
    product: "Gaming Monitor",
    productType: "physical",
    purchaseDate: "2026-07-10",
    deliveredDate: "2026-07-12",
    price: 24999,
    damaged: false,
    refundCount: 0,
    orderStatus: "delivered",
  },

  // 6. Expensive product - manager approval required
  {
    id: "C006",
    name: "Priya Sharma",
    email: "priya@example.com",
    orderId: "ORD1006",
    product: "Professional Laptop",
    productType: "physical",
    purchaseDate: "2026-08-22",
    deliveredDate: "2026-08-24",
    price: 60000,
    damaged: false,
    refundCount: 0,
    orderStatus: "delivered",
  },
];