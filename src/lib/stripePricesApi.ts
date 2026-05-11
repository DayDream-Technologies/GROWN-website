import { checkoutApiBase } from "./checkoutApi";

export type CatalogOneTimePriceRow = {
  priceId: string;
  unitAmount: number;
  currency: string;
};

export type CatalogOneTimePricesResponse = {
  ok: true;
  fetchedAt: string;
  prices: Record<string, CatalogOneTimePriceRow | null>;
};

export type StripePricesFetchState =
  | { status: "skipped" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready";
      prices: Record<string, CatalogOneTimePriceRow | null>;
    };

export async function fetchCatalogOneTimePrices(): Promise<CatalogOneTimePricesResponse> {
  const base = checkoutApiBase();
  if (!base) {
    throw new Error("Checkout API URL is not configured.");
  }
  const res = await fetch(`${base}/catalog/one-time-prices`, { method: "GET" });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    throw new Error(err);
  }
  if (
    !data ||
    typeof data !== "object" ||
    (data as { ok?: unknown }).ok !== true ||
    typeof (data as { fetchedAt?: unknown }).fetchedAt !== "string" ||
    typeof (data as { prices?: unknown }).prices !== "object" ||
    (data as { prices?: unknown }).prices === null
  ) {
    throw new Error("Invalid response from pricing API.");
  }
  return data as CatalogOneTimePricesResponse;
}
