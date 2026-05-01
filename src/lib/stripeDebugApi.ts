import { checkoutApiBase } from "./checkoutApi";

export type StripeProductsDebugSuccess = {
  ok: true;
  mode: "test" | "live";
  fetchedAt: string;
  productCount: number;
  priceCount: number;
  products: Record<string, unknown>[];
  prices: Record<string, unknown>[];
};

export type StripeProductsDebugResponse =
  | StripeProductsDebugSuccess
  | { ok: false; error: string };

export async function fetchStripeProductsDebug(): Promise<StripeProductsDebugResponse> {
  const base = checkoutApiBase();
  if (!base) {
    return { ok: false, error: "VITE_CHECKOUT_API_URL is not set." };
  }
  const res = await fetch(`${base}/debug/stripe-products`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    return { ok: false, error: err };
  }
  if (
    !data ||
    typeof data !== "object" ||
    (data as { ok?: unknown }).ok !== true
  ) {
    return { ok: false, error: "Invalid response from debug API." };
  }
  const d = data as StripeProductsDebugSuccess;
  if (!Array.isArray(d.products) || !Array.isArray(d.prices)) {
    return { ok: false, error: "Invalid response shape from debug API." };
  }
  return d;
}
