import { customers } from "@/data/Customers";

export function getProductInfo(productName: string) {
  const customer = customers.find(
    (customer) =>
      customer.product.toLowerCase() === productName.toLowerCase()
  );

  if (!customer) {
    return null;
  }

  return {
    product: customer.product,
    productType: customer.productType,
    price: customer.price,
  };
}
