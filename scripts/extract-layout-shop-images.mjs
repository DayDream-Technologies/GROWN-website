/**
 * One-off / CI: read `GROWN LAYOUT.md` reference-style image lines and write
 * decoded files under `public/images/shop-layout/` for shop product art.
 */
import fs from "node:fs";
import readline from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "GROWN LAYOUT.md");
const outDir = path.join(root, "public", "images", "shop-layout");

/** Image indices referenced for shop product / gallery art in GROWN LAYOUT.md */
const NEEDED = new Set([
  11, 12, 13, 14, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  53,
]);

/** Line is entire `[imageN]: <data:image/TYPE;base64,BASE64...` (may end with `>` or EOF) */
const lineRe =
  /^\[image(\d+)\]:\s*<data:image\/(png|jpeg|jpg|webp);base64,(.+)$/i;

async function main() {
  if (!fs.existsSync(mdPath)) {
    console.error("Missing GROWN LAYOUT.md at", mdPath);
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });

  const rl = readline.createInterface({
    input: fs.createReadStream(mdPath, { encoding: "utf8" }),
    crlfDelay: Infinity,
  });

  let wrote = 0;
  for await (const raw of rl) {
    const line = raw.trimEnd();
    const m = line.match(lineRe);
    if (!m) continue;
    const n = Number(m[1]);
    if (!NEEDED.has(n)) continue;
    const mimeExt = m[2].toLowerCase();
    const ext = mimeExt === "jpeg" ? "jpg" : mimeExt;
    const b64 = m[3].replace(/\s+/g, "").replace(/>$/, "");
    const buf = Buffer.from(b64, "base64");
    const file = path.join(outDir, `img-${n}.${ext}`);
    fs.writeFileSync(file, buf);
    wrote += 1;
    console.info("wrote", path.relative(root, file), `(${buf.length} bytes)`);
  }

  console.info("done,", wrote, "files");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
