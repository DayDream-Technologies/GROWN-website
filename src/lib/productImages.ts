import type { Product, ProductCategory } from "../data/products";

const CATEGORY_FALLBACK: Record<ProductCategory, string> = {
  powder: "site/shop-powders.jpg",
  seasoning: "site/home-seasoning.png",
  fresh: "fresh/fresh-baby-kale.jpg",
};

/**
 * Product card / modal hero art from `GROWN LAYOUT.md` (extracted to
 * `public/images/shop-layout/img-*.png` via `scripts/extract-layout-shop-images.mjs`).
 *
 * Produce page: images 33 (top), 35–37 (herbs), 38–40 (lettuce), 41 (kale). Image 34
 * (mushrooms) has no matching SKU in the catalog; file remains in repo for future use.
 * Microgreens page: image 42. Pantry blends: image 47. Seasonings: images 49–52.
 */
const LIST_IMAGE_BY_ID: Partial<Record<string, string>> = {
  "ice-balls-frozen": "shop-layout/img-33.png",
  "fresh-rosemary": "shop-layout/img-35.png",
  "fresh-dill": "shop-layout/img-36.png",
  "fresh-italian-parsley": "shop-layout/img-37.png",
  "fresh-butter-lettuce": "shop-layout/img-38.png",
  "fresh-mint": "shop-layout/img-39.png",
  "fresh-basil": "shop-layout/img-40.png",
  "fresh-baby-kale": "shop-layout/img-41.png",
  "microgreens-full-tray": "shop-layout/img-42.png",
  "elevated-brew-mushroom": "shop-layout/img-47.png",
  "green-leaf": "shop-layout/img-47.png",
  "berry-gut-glow": "shop-layout/img-47.png",
  "matcha-revival": "shop-layout/img-47.png",
  "golden-calm": "shop-layout/img-47.png",
  "lemon-zest": "shop-layout/img-47.png",
  "medi-green-salt": "shop-layout/img-49.png",
  "garden-luxe-ranch": "shop-layout/img-50.png",
  "salsa-verde-zest": "shop-layout/img-51.png",
  "harvest-pesto-blend": "shop-layout/img-52.png",
};

/** Relative path under `public/images/` for list/detail hero. */
export function getProductListImage(product: Product): string {
  return LIST_IMAGE_BY_ID[product.id] ?? CATEGORY_FALLBACK[product.category];
}
