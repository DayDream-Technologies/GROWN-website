import type { Product, ProductCategory } from "../data/products";

const CATEGORY_FALLBACK: Record<ProductCategory, string> = {
  powder: "shop/category-pantry-blends.jpg",
  seasoning: "shop/category-seasoning.jpg",
  fresh: "catalog/products/fresh-butter-lettuce.jpg",
};

/**
 * Curated list/detail hero paths under `public/images/catalog/products/` (and fallbacks).
 * File names follow `public/images/New folder` source photos where applicable.
 */
const LIST_IMAGE_BY_ID: Partial<Record<string, string>> = {
  "elevated-brew-mushroom": "catalog/products/elevated_brew_product_pic.jpg",
  "green-leaf": "catalog/products/green_citrus_product_pic.PNG",
  "berry-gut-glow": "catalog/products/strawberry_rose_product_pic.jpg",
  "matcha-revival": "catalog/products/matcha_revival_product_pic.PNG",
  "golden-calm": "catalog/products/golden_calm_product_pic.jpg",
  "lemon-zest": "catalog/products/blue_lemon_product_pic.PNG",
  "medi-green-salt": "catalog/products/medi-green-salt.jpg",
  "garden-luxe-ranch": "catalog/products/garden-luxe-ranch.jpg",
  "salsa-verde-zest": "catalog/products/salsa-verde-zest.jpg",
  "harvest-pesto-blend": "catalog/products/harvest-pesto-blend.jpg",
  "ice-balls-frozen": "catalog/products/ice-balls-frozen.jpg",
  "fresh-butter-lettuce": "catalog/products/fresh-butter-lettuce.jpg",
  "microgreens-full-tray": "catalog/products/microgreens-full-tray.jpg",
  "fresh-rosemary": "catalog/products/fresh-rosemary.jpg",
  "fresh-dill": "catalog/products/fresh-dill.jpg",
  "fresh-italian-parsley": "catalog/products/fresh-italian-parsley.jpg",
  "fresh-mint": "catalog/products/fresh-mint.jpg",
  "fresh-basil": "catalog/products/fresh-basil.jpg",
  "fresh-baby-kale": "catalog/products/fresh-baby-kale.jpg",
};

const PACKSHOT_IMAGE_IDS = new Set([
  "elevated-brew-mushroom",
  "green-leaf",
  "berry-gut-glow",
  "matcha-revival",
  "golden-calm",
  "lemon-zest",
]);

/** Relative path under `public/images/` for list/detail hero. */
export function getProductListImage(product: Product): string {
  return LIST_IMAGE_BY_ID[product.id] ?? CATEGORY_FALLBACK[product.category];
}

export function isProductPackshot(product: Product): boolean {
  return PACKSHOT_IMAGE_IDS.has(product.id);
}
