import type { Product } from "../data/products";

const base = import.meta.env.BASE_URL;

function encodePathSegments(relativePath: string): string {
  return relativePath
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

/** Static files under `public/images/` (e.g. `home/hero-01-lettuce-table.jpg`, `brand/…`). */
export function siteImage(relativePath: string): string {
  return `${base}images/${encodePathSegments(relativePath)}`;
}

/** Legacy convention: per-id JPG under `products/` or `fresh/` (prefer `getProductListImage`). */
export function getProductImageUrl(product: Product): string {
  const folder = product.category === "fresh" ? "fresh" : "products";
  return `${base}images/${encodePathSegments(`${folder}/${product.id}.jpg`)}`;
}
