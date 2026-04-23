import type { Product } from "../data/products";

const base = import.meta.env.BASE_URL;

function encodePathSegments(relativePath: string): string {
  return relativePath
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

/** Static files under `public/images/` (e.g. `site/hero-home.jpg`). */
export function siteImage(relativePath: string): string {
  return `${base}images/${encodePathSegments(relativePath)}`;
}

/** Product photo: `public/images/products/` or `public/images/fresh/` by category. */
export function getProductImageUrl(product: Product): string {
  const folder = product.category === "fresh" ? "fresh" : "products";
  return `${base}images/${encodePathSegments(`${folder}/${product.id}.jpg`)}`;
}
