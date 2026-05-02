import type { Product } from "../data/products";
import stripeCheckoutCatalog from "../data/stripeCheckoutCatalog.json";
import { parseFirstUsdCents } from "./money";

export type PurchaseMode = "one_time" | "subscription";

type CheckoutCatalogRow = {
  stripe_product_id?: string;
  one_time?: string;
  subscription?: string;
};

/**
 * True when `stripe-catalog.json` includes a `subscription` field for this SKU.
 * Checkout only allows subscription lines for those rows (after a recurring Price exists in Stripe).
 */
export function checkoutCatalogAllowsSubscription(productId: string): boolean {
  const row = (stripeCheckoutCatalog as Record<string, CheckoutCatalogRow>)[
    productId
  ];
  if (!row || typeof row !== "object") return false;
  return Object.prototype.hasOwnProperty.call(row, "subscription");
}

export function getOneTimeUnitCents(product: Product): number | null {
  if (product.contactForPricing) return null;
  return parseFirstUsdCents(product.priceOneTime);
}

export function getSubscriptionUnitCents(product: Product): number | null {
  if (product.contactForPricing) return null;
  if (product.priceSubscription == null || product.priceSubscription === "") {
    return null;
  }
  if (/^tbd$/i.test(product.priceSubscription.trim())) return null;
  return parseFirstUsdCents(product.priceSubscription);
}

export function canPurchaseOneTime(product: Product): boolean {
  return getOneTimeUnitCents(product) != null;
}

export function canPurchaseSubscription(product: Product): boolean {
  return (
    checkoutCatalogAllowsSubscription(product.id) &&
    getSubscriptionUnitCents(product) != null
  );
}
