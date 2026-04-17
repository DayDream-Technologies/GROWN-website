import type { Product } from "../data/products";
import { parseFirstUsdCents } from "./money";

export type PurchaseMode = "one_time" | "subscription";

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
  return getSubscriptionUnitCents(product) != null;
}
