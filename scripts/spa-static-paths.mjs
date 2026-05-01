/**
 * After Vite build, copy dist/index.html to dist/<route>/index.html for each
 * client-only path. Static hosts (e.g. Amplify/S3) often serve /shop/ as a
 * directory lookup; without SPA rewrites, that 404s unless this file exists.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "..", "dist");
const indexPath = path.join(dist, "index.html");

const ROUTES = [
  "shop",
  "partner",
  "about",
  "contact",
  "checkout",
  "checkout/return",
  "stripe-debug",
];

if (!fs.existsSync(indexPath)) {
  console.warn("[spa-static-paths] dist/index.html not found; skipping.");
  process.exit(0);
}

const html = fs.readFileSync(indexPath, "utf8");
for (const route of ROUTES) {
  const dir = path.join(dist, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.info(`[spa-static-paths] Wrote ${ROUTES.length} route shells under dist/`);
