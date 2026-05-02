import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcFile = join(root, "infra", "checkout-session", "stripe-catalog.json");
const destDir = join(root, "src", "data");
const destFile = join(destDir, "stripeCheckoutCatalog.json");

mkdirSync(destDir, { recursive: true });
copyFileSync(srcFile, destFile);
console.log("Synced infra/checkout-session/stripe-catalog.json → src/data/stripeCheckoutCatalog.json");
