import type { SquareCatalogItem } from "../types/square";

const baseOrigin = import.meta.env.VITE_BFF_ORIGIN?.trim();
const apiBase = baseOrigin ? `${baseOrigin.replace(/\/$/, "")}/api` : "/api";

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
