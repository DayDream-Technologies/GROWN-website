import { checkoutApiBase } from "./checkoutApi";

/**
 * Resolves API base for the temporary `/stripe-debug` page: env first, then
 * optional `?checkoutApi=https://…` (no trailing slash) for ad-hoc tests
 * without rebuilding.
 */
export function resolveStripeDebugApiBase(): string {
  const fromEnv = checkoutApiBase();
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") return "";
  const q = new URLSearchParams(window.location.search)
    .get("checkoutApi")
    ?.trim();
  if (!q) return "";
  const normalized = q.replace(/\/$/, "");
  if (!normalized.startsWith("https://")) {
    return "";
  }
  return normalized;
}

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

const MISSING_BASE_HINT =
  "No API base URL: set VITE_CHECKOUT_API_URL (local .env or GitHub → Environments → production for Pages builds), or append ?checkoutApi=https://YOUR.execute-api.REGION.amazonaws.com to this page’s URL (HTTPS only, no trailing slash).";

export async function fetchStripeProductsDebug(): Promise<StripeProductsDebugResponse> {
  const base = resolveStripeDebugApiBase();
  if (!base) {
    return { ok: false, error: MISSING_BASE_HINT };
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
