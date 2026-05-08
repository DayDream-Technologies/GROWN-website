import type { Product } from "../data/products";
import type {
  CatalogOneTimePriceRow,
  StripePricesFetchState,
} from "./stripePricesApi";
import { formatMoneyFromMinorUnits } from "./money";
import { checkoutCatalogAllowsSubscription, getSubscriptionUnitCents } from "./productPricing";
import { productHasStripeCheckoutListing } from "./stripeCatalogProduct";

export const COMING_SOON_LABEL = "Coming soon";

export type OneTimePresentation = {
  /** Line shown as primary price on cards / modal */
  label: string;
  /** Minor units (e.g. cents) when priced; null otherwise */
  cents: number | null;
  currency: string;
  /** User can add one-time to cart */
  purchasableOneTime: boolean;
};

function rowToPresentation(row: CatalogOneTimePriceRow): OneTimePresentation {
  const cents = row.unitAmount;
  const currency = row.currency || "usd";
  return {
    label: formatMoneyFromMinorUnits(cents, currency),
    cents,
    currency,
    purchasableOneTime: Number.isFinite(cents),
  };
}

export function getOneTimePresentation(
  product: Product,
  fetchState: StripePricesFetchState,
): OneTimePresentation {
  const fallbackLabel = product.priceOneTime.trim() || COMING_SOON_LABEL;

  if (product.contactForPricing) {
    return {
      label: product.priceOneTime,
      cents: null,
      currency: "usd",
      purchasableOneTime: false,
    };
  }

  if (!productHasStripeCheckoutListing(product.id)) {
    return {
      label: COMING_SOON_LABEL,
      cents: null,
      currency: "usd",
      purchasableOneTime: false,
    };
  }

  switch (fetchState.status) {
    case "skipped":
    case "error":
      return {
        label: fallbackLabel,
        cents: null,
        currency: "usd",
        purchasableOneTime: false,
      };
    case "loading":
      return {
        label: "Loading price…",
        cents: null,
        currency: "usd",
        purchasableOneTime: false,
      };
    default: {
      const row = fetchState.prices[product.id];
      if (row == null) {
        return {
          label: fallbackLabel,
          cents: null,
          currency: "usd",
          purchasableOneTime: false,
        };
      }
      return rowToPresentation(row);
    }
  }
}

/** Subscription display still uses product copy until a subscription prices API exists. */
export function getSubscriptionPresentation(product: Product): {
  label: string | null;
  cents: number | null;
  subscribable: boolean;
} {
  const allowed = checkoutCatalogAllowsSubscription(product.id);
  const cents = getSubscriptionUnitCents(product);
  const subscribable = allowed && cents != null;
  return {
    label: product.priceSubscription?.trim() || null,
    cents,
    subscribable,
  };
}
