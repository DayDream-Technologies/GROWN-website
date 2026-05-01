import type { CartLine } from "../context/cartTypes";

/** True when the cart mixes subscription lines with one-time lines (Stripe Checkout needs one mode per session). */
export function cartHasMixedPurchaseKinds(lines: CartLine[]): boolean {
  if (lines.length <= 1) return false;
  const first = lines[0]?.purchaseKind;
  return lines.some((l) => l.purchaseKind !== first);
}
