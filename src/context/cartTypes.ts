import type { PurchaseMode } from "../lib/productPricing";

export type CartLine = {
  /** Stable merge key */
  lineKey: string;
  productId: string;
  purchaseMode: PurchaseMode;
  quantity: number;
  unitAmountCents: number;
  currency: "usd";
  productName: string;
};

export const CART_STORAGE_KEY = "grown-cart-v1";
