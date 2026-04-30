import type { Product, ProductCategory } from "../data/products";

const CATEGORY_CARD_IMAGE: Record<ProductCategory, string> = {
  powder: "site/shop-powders.jpg",
  seasoning: "site/home-seasoning.png",
  fresh: "fresh/fresh-baby-kale.jpg",
};

/** Relative path under `public/images/` for list/detail hero when no SKU-specific art exists. */
export function getProductListImage(product: Product): string {
  return CATEGORY_CARD_IMAGE[product.category];
}
