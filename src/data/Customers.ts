import {Customer} from '@/types/Customer';

export const customers: Customer[] = [
  {
    id: "C001",
    name: "John Doe",
    email: "john@example.com",
    orderId: "ORD1001",
    product: "Wireless Mouse",
    productType: "physical",
    purchaseDate: "2026-07-20",
    deliveredDate: "2026-07-22",
    price: 999,
    damaged: false,
    refundCount: 0,
    orderStatus: "delivered",
  },
  {
    id: "C002",
    name: "Sarah Smith",
    email: "sarah@example.com",
    orderId: "ORD1002",
    product: "React Masterclass",
    productType: "digital",
    purchaseDate: "2026-07-15",
    deliveredDate: "2026-07-15",
    price: 1999,
    damaged: false,
    refundCount: 1,
    orderStatus: "delivered",
  },
];