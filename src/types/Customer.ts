export interface Customer {
  id: string;
  name: string;
  email: string;
  password: string,
  orderId: string;
  product: string;
  productType: "physical" | "digital";
  purchaseDate: string;
  deliveredDate: string;
  price: number;
  damaged: boolean;
  refundCount: number;

  orderStatus: "processing" | "shipped" | "delivered";
}