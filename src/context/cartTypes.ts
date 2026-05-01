export type PurchaseKind = "one_time" | "subscription";

export type CartLine = {
  /** Stable merge key */
  lineKey: string;
  productId: string;
  purchaseKind: PurchaseKind;
  quantity: number;
  unitAmountCents: number;
  currency: "usd";
  productName: string;
};

export const CART_STORAGE_KEY = "grown-cart-v2";

export function cartLineKey(
  productId: string,
  purchaseKind: PurchaseKind,
): string {
  return `${productId}__${purchaseKind}`;
}
