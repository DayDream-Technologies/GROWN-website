import type { Product } from "../data/products";

const base = import.meta.env.BASE_URL;

/** Static files under `public/images/` (e.g. `site/hero-home.jpg`). */
export function siteImage(relativePath: string): string {
  const p = relativePath.replace(/^\/+/, "");
  return `${base}images/${p}`;
}

/** Product photo: `public/images/products/` or `public/images/fresh/` by category. */
export function getProductImageUrl(product: Product): string {
  const folder = product.category === "fresh" ? "fresh" : "products";
  return `${base}images/${folder}/${product.id}.jpg`;
}
