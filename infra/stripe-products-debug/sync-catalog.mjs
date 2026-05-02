import { copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "../checkout-session/stripe-catalog.json");
const dest = join(here, "stripe-catalog.json");
copyFileSync(src, dest);
console.log("Synced checkout-session/stripe-catalog.json → stripe-products-debug/");
