export type CheckoutLine = {
  productId: string;
  productName: string;
  quantity: number;
  unitAmountCents: number;
};

export type CheckoutPayload = {
  currency: "usd";
  lines: CheckoutLine[];
  subtotalCents: number;
};
