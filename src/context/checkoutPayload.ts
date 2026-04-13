import type { PurchaseMode } from "../lib/productPricing";

export type CheckoutPayload = {
  currency: "usd";
  lines: {
    productId: string;
    purchaseMode: PurchaseMode;
    quantity: number;
    unitAmountCents: number;
    productName: string;
  }[];
  subtotalCents: number;
  /** Populated when Stripe Price IDs are configured in `src/config/stripe.ts` */
  stripeLineItems: { price: string; quantity: number }[];
};
