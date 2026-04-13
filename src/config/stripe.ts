import type { PurchaseMode } from "../lib/productPricing";

/**
 * Stripe integration helpers (client-side catalog).
 *
 * Add your Stripe Price IDs here as you create them in the Stripe Dashboard.
 * Server-side Checkout Session creation should prefer Price IDs over ad-hoc amounts
 * for subscriptions and recurring billing.
 *
 * Env alternative: set e.g. VITE_STRIPE_PUBLISHABLE_KEY in `.env` for future
 * Stripe.js / Elements usage (see `stripePublishableKey`).
 */
export const stripePublishableKey: string | undefined =
  typeof import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === "string"
    ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    : undefined;

/**
 * Maps product id + purchase mode → Stripe Price ID (`price_...`).
 * Leave entries empty until prices exist in Stripe; checkout can still use
 * amount-based line items from the cart for demos if your backend allows it.
 */
const STRIPE_PRICE_CATALOG: Partial<
  Record<string, { oneTime?: string; subscription?: string }>
> = {
  // Example wiring (uncomment and replace when ready):
  // "immunity-smoothie-booster": {
  //   oneTime: "price_xxxxxxxxxxxxxxxx",
  //   subscription: "price_yyyyyyyyyyyyyyyy",
  // },
};

export function getStripePriceId(
  productId: string,
  mode: PurchaseMode,
): string | undefined {
  const row = STRIPE_PRICE_CATALOG[productId];
  if (!row) return undefined;
  return mode === "one_time" ? row.oneTime : row.subscription;
}

/** Build Stripe Checkout `line_items` when Price IDs exist; omit or use backend for the rest. */
export function buildStripeLineItemsFromPriceIds(
  items: { productId: string; mode: PurchaseMode; quantity: number }[],
): { price: string; quantity: number }[] {
  const out: { price: string; quantity: number }[] = [];
  for (const it of items) {
    const price = getStripePriceId(it.productId, it.mode);
    if (price) out.push({ price, quantity: it.quantity });
  }
  return out;
}
