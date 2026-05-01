import { createContext } from "react";
import type { CartLine, PurchaseKind } from "./cartTypes";
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
    purchaseKind: PurchaseKind;
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
