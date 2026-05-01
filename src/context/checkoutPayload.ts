import type { PurchaseKind } from "./cartTypes";

export type CheckoutLine = {
  productId: string;
  productName: string;
  quantity: number;
  unitAmountCents: number;
  purchaseKind: PurchaseKind;
};

export type CheckoutPayload = {
  currency: "usd";
  lines: CheckoutLine[];
  subtotalCents: number;
};
