import type { SquareCatalogItem } from "../types/square";

/**
 * Returns true if `originUrl` targets loopback or RFC1918 private LAN — unsafe to
 * call from a public HTTPS site (browser Private Network Access + connection failures).
 */
function isLocalOrPrivateHost(originUrl: string): boolean {
  try {
    const { hostname } = new URL(originUrl);
    const h = hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "::1") {
      return true;
    }
    if (/^10\./.test(h) || /^192\.168\./.test(h)) {
      return true;
    }
    const m = /^172\.(\d+)\./.exec(h);
    if (m) {
      const second = Number(m[1]);
      if (second >= 16 && second <= 31) return true;
    }
    return false;
  } catch {
    return true;
  }
}

/**
 * Production: set `VITE_BFF_ORIGIN` to your deployed BFF (https://…, no trailing slash).
 * Local dev: omit `VITE_BFF_ORIGIN` so requests use `/api` and Vite proxies to the Node BFF.
 * Never set `VITE_BFF_ORIGIN` to localhost/private hosts in Amplify — it is baked into the bundle.
 */
function resolveApiBase(): string {
  const raw = import.meta.env.VITE_BFF_ORIGIN?.trim();
  if (!raw) {
    return "/api";
  }
  if (import.meta.env.PROD && isLocalOrPrivateHost(raw)) {
    console.warn(
      "[square] VITE_BFF_ORIGIN is localhost or a private address; ignoring it and using /api. " +
        "Remove VITE_BFF_ORIGIN from Amplify or set it to your public HTTPS API origin.",
    );
    return "/api";
  }
  return `${raw.replace(/\/$/, "")}/api`;
}

const apiBase = resolveApiBase();

export async function fetchSquareCatalog(): Promise<SquareCatalogItem[]> {
  const response = await fetch(`${apiBase}/catalog`);
  if (!response.ok) {
    throw new Error("Failed to load catalog");
  }
  const json = (await response.json()) as { items?: SquareCatalogItem[] };
  return Array.isArray(json.items) ? json.items : [];
}

export async function createSquareCheckout(
  lines: { catalogObjectId: string; quantity: number }[],
): Promise<string> {
  const response = await fetch(`${apiBase}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines }),
  });
  if (!response.ok) {
    throw new Error("Checkout failed");
  }
  const json = (await response.json()) as { checkoutUrl?: string };
  if (!json.checkoutUrl) {
    throw new Error("Checkout URL missing");
  }
  return json.checkoutUrl;
}
