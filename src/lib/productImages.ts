import type { Product, ProductCategory } from "../data/products";

const CATEGORY_FALLBACK: Record<ProductCategory, string> = {
  powder: "site/shop-powders.jpg",
  seasoning: "site/home-seasoning.png",
  fresh: "fresh/fresh-baby-kale.jpg",
};

/**
 * Curated hero/card paths under `public/images/`.
 * Prefer SKU-specific art; falls back to product `category` defaults.
 */
const LIST_IMAGE_BY_ID: Partial<Record<string, string>> = {
  "elevated-brew-mushroom": "site/shop-powders.jpg",
  "green-leaf": "site/home-pantry-blend.png",
  "berry-gut-glow": "site/home-pantry-blend.png",
  "matcha-revival": "site/shop-powders.jpg",
  "golden-calm": "site/home-pantry-blend.png",
  "lemon-zest": "site/home-pantry-blend.png",
  "medi-green-salt": "site/home-seasoning.png",
  "garden-luxe-ranch": "site/home-seasoning.png",
  "salsa-verde-zest": "site/home-seasoning.png",
  "harvest-pesto-blend": "site/home-seasoning.png",
  "ice-balls-frozen": "site/home-produce.png",
  "fresh-butter-lettuce": "site/home-produce.png",
  "microgreens-full-tray": "site/home-microgreens.png",
  "fresh-rosemary": "site/home-produce.png",
  "fresh-dill": "site/home-produce.png",
  "fresh-italian-parsley": "site/home-produce.png",
  "fresh-mint": "site/home-produce.png",
  "fresh-basil": "site/home-produce.png",
  "fresh-baby-kale": "fresh/fresh-baby-kale.jpg",
};

/** Relative path under `public/images/` for list/detail hero. */
export function getProductListImage(product: Product): string {
  return LIST_IMAGE_BY_ID[product.id] ?? CATEGORY_FALLBACK[product.category];
}
