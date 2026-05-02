import stripeCheckoutCatalog from "../data/stripeCheckoutCatalog.json";

type CatalogRow = {
  stripe_product_id?: string;
};

/** True when this internal SKU is listed in checkout `stripe-catalog.json` with a Stripe product id. */
export function productHasStripeCheckoutListing(productId: string): boolean {
  const row = (stripeCheckoutCatalog as Record<string, CatalogRow>)[productId];
  return Boolean(
    row &&
      typeof row.stripe_product_id === "string" &&
      row.stripe_product_id.trim(),
  );
}
