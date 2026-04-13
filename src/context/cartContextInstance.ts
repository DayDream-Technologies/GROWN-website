import { createContext } from "react";
import type { PurchaseMode } from "../lib/productPricing";
import type { CartLine } from "./cartTypes";
import type { CheckoutPayload } from "./checkoutPayload";

export type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addLine: (args: {
    productId: string;
    purchaseMode: PurchaseMode;
    unitAmountCents: number;
    productName: string;
    quantity?: number;
  }) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  removeLine: (lineKey: string) => void;
  clearCart: () => void;
  getCheckoutPayload: () => CheckoutPayload;
};

export const CartContext = createContext<CartContextValue | null>(null);
