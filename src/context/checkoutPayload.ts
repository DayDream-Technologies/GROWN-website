export type CheckoutPayload = {
  currency: "usd";
  lines: { catalogObjectId: string; quantity: number }[];
  subtotalCents: number;
};
