/** Parse first USD amount in a string to integer cents. Returns null if none found. */
export function parseFirstUsdCents(text: string): number | null {
  const m = text.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(/,/g, ""));
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Stripe amounts are minor units (e.g. cents); `currency` is ISO 4217 lowercase. */
export function formatMoneyFromMinorUnits(
  minorUnits: number,
  currency: string,
): string {
  const code = currency.trim().toUpperCase() || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(minorUnits / 100);
  } catch {
    return formatUsdFromCents(minorUnits);
  }
}
