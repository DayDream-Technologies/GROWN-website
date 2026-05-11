import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, { stripe_product_id?: string, one_time?: string, subscription?: string }>} */
const siteCatalog = JSON.parse(
  readFileSync(join(__dirname, "stripe-catalog.json"), "utf8"),
);

/**
 * Same resolution rules as checkout-session Lambda (prod_… → price_…).
 *
 * @param {Stripe} stripe
 * @param {string} stripeProductId
 * @param {'one_time'|'subscription'} purchaseKind
 */
async function resolvePriceIdFromStripeProduct(
  stripe,
  stripeProductId,
  purchaseKind,
) {
  const product = await stripe.products.retrieve(stripeProductId);
  const defaultRef = product.default_price;
  const defaultPriceId =
    typeof defaultRef === "string" ? defaultRef : defaultRef?.id;

  const { data: prices } = await stripe.prices.list({
    product: stripeProductId,
    active: true,
    limit: 100,
  });

  const matches = prices.filter((p) =>
    purchaseKind === "subscription"
      ? Boolean(p.recurring)
      : !p.recurring,
  );

  if (matches.length === 0) return null;

  const defaultMatch =
    defaultPriceId && matches.some((p) => p.id === defaultPriceId)
      ? matches.find((p) => p.id === defaultPriceId)
      : null;

  return (defaultMatch ?? matches[0]).id;
}

/** Trim and strip trailing slashes so config can match browser `Origin`. */
function normalizeOrigin(o) {
  const t = String(o ?? "").trim();
  if (!t || t === "*") return t;
  return t.replace(/\/+$/, "");
}

function parseCorsAllowlist(raw) {
  const s = String(raw ?? "*").trim();
  if (!s) return ["*"];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * @param {string[]} allowlist
 * @param {Record<string, string | undefined> | undefined} requestHeaders
 */
function pickAccessControlAllowOrigin(allowlist, requestHeaders) {
  if (allowlist.includes("*")) return "*";

  const rawOrigin =
    typeof requestHeaders?.origin === "string"
      ? requestHeaders.origin
      : typeof requestHeaders?.Origin === "string"
        ? requestHeaders.Origin
        : "";

  if (!rawOrigin) {
    const first = allowlist[0];
    return first && first !== "*" ? normalizeOrigin(first) : first ?? null;
  }

  const normRequest = normalizeOrigin(rawOrigin);
  for (const entry of allowlist) {
    if (entry === "*") return "*";
    if (normalizeOrigin(entry) === normRequest) return rawOrigin;
  }
  return null;
}

/** @param {string | null} allowOrigin */
function corsHeaders(allowOrigin) {
  /** @type {Record<string, string>} */
  const h = { "Content-Type": "application/json" };
  if (allowOrigin != null && allowOrigin !== "") {
    h["Access-Control-Allow-Origin"] = allowOrigin;
    h["Access-Control-Allow-Headers"] = "Content-Type, Accept";
    h["Access-Control-Allow-Methods"] = "GET,OPTIONS";
  }
  return h;
}

/**
 * @param {Record<string, unknown>} row
 */
function expectsOneTime(row) {
  return Object.prototype.hasOwnProperty.call(row, "one_time");
}

/**
 * @param {Record<string, unknown>} row
 */
function expectsSubscription(row) {
  return Object.prototype.hasOwnProperty.call(row, "subscription");
}

/**
 * Lists active Stripe products and prices, and verifies `stripe-catalog.json`
 * against the Stripe API (same checks checkout uses for prod-only IDs).
 * GET /debug/stripe-products
 */
export async function handler(event) {
  const allowlist = parseCorsAllowlist(process.env.CORS_ORIGIN);
  const hdrs = corsHeaders(
    pickAccessControlAllowOrigin(allowlist, event.headers),
  );

  const httpMethod =
    event.requestContext?.http?.method ?? event.httpMethod ?? "GET";

  if (httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: hdrs, body: "" };
  }

  if (httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: hdrs,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return {
      statusCode: 500,
      headers: hdrs,
      body: JSON.stringify({ error: "Server missing Stripe configuration" }),
    };
  }

  try {
    const stripe = new Stripe(stripeSecret);
    const mode = stripeSecret.startsWith("sk_test_") ? "test" : "live";

    const [products, prices] = await Promise.all([
      stripe.products.list({
        active: true,
        limit: 100,
        expand: ["data.default_price"],
      }),
      stripe.prices.list({
        active: true,
        limit: 100,
      }),
    ]);

    const catalogChecks = [];

    for (const internalId of Object.keys(siteCatalog).sort()) {
      const row = /** @type {Record<string, unknown>} */ (siteCatalog[internalId]);
      const stripeProductId =
        typeof row.stripe_product_id === "string"
          ? row.stripe_product_id.trim()
          : "";
      const explicitOt =
        typeof row.one_time === "string" ? row.one_time.trim() : "";
      const explicitSub =
        typeof row.subscription === "string" ? row.subscription.trim() : "";

      /** @type {string[]} */
      const issues = [];

      if (!stripeProductId) {
        issues.push("Missing stripe_product_id in stripe-catalog.json");
        catalogChecks.push({
          internalId,
          stripeProductId: "",
          stripeName: null,
          stripeActive: null,
          inActiveProductList: false,
          expectsOneTime: expectsOneTime(row),
          expectsSubscription: expectsSubscription(row),
          explicitOneTimePriceId: explicitOt || null,
          explicitSubscriptionPriceId: explicitSub || null,
          resolvedOneTimePriceId: null,
          resolvedSubscriptionPriceId: null,
          oneTimeOk: false,
          subscriptionOk: false,
          issues,
        });
        continue;
      }

      let stripeName = null;
      let stripeActive = null;
      let inActiveProductList = products.data.some((p) => p.id === stripeProductId);

      try {
        const prod = await stripe.products.retrieve(stripeProductId);
        stripeName = typeof prod.name === "string" ? prod.name : null;
        stripeActive = prod.active;
        if (!prod.active) {
          issues.push("Stripe product exists but is not active");
        }
      } catch {
        issues.push("stripe.products.retrieve failed (wrong ID or deleted)");
      }

      let resolvedOneTimePriceId = explicitOt || null;
      let resolvedSubscriptionPriceId = explicitSub || null;

      if (!explicitOt && stripeProductId) {
        try {
          resolvedOneTimePriceId = await resolvePriceIdFromStripeProduct(
            stripe,
            stripeProductId,
            "one_time",
          );
        } catch (e) {
          issues.push(
            `Resolve one_time price: ${e instanceof Error ? e.message : String(e)}`,
          );
          resolvedOneTimePriceId = null;
        }
      }

      if (!explicitSub && stripeProductId && expectsSubscription(row)) {
        try {
          resolvedSubscriptionPriceId = await resolvePriceIdFromStripeProduct(
            stripe,
            stripeProductId,
            "subscription",
          );
        } catch (e) {
          issues.push(
            `Resolve subscription price: ${e instanceof Error ? e.message : String(e)}`,
          );
          resolvedSubscriptionPriceId = null;
        }
      }

      const needOt = expectsOneTime(row);
      const needSub = expectsSubscription(row);

      const oneTimeOk =
        !needOt ||
        Boolean(explicitOt ? explicitOt.startsWith("price_") : resolvedOneTimePriceId);

      const subscriptionOk =
        !needSub ||
        Boolean(
          explicitSub
            ? explicitSub.startsWith("price_")
            : resolvedSubscriptionPriceId,
        );

      if (needOt && !oneTimeOk) {
        issues.push("No one-time Price resolved (add active one-time Price in Stripe)");
      }
      if (needSub && !subscriptionOk) {
        issues.push(
          "No recurring Price resolved (add active monthly Price in Stripe)",
        );
      }

      catalogChecks.push({
        internalId,
        stripeProductId,
        stripeName,
        stripeActive,
        inActiveProductList,
        expectsOneTime: needOt,
        expectsSubscription: needSub,
        explicitOneTimePriceId: explicitOt || null,
        explicitSubscriptionPriceId: explicitSub || null,
        resolvedOneTimePriceId,
        resolvedSubscriptionPriceId,
        oneTimeOk,
        subscriptionOk,
        issues,
      });
    }

    const catalogAllOk = catalogChecks.every(
      (r) => r.oneTimeOk && r.subscriptionOk && r.stripeActive === true,
    );

    return {
      statusCode: 200,
      headers: hdrs,
      body: JSON.stringify({
        ok: true,
        mode,
        fetchedAt: new Date().toISOString(),
        productCount: products.data.length,
        priceCount: prices.data.length,
        products: products.data,
        prices: prices.data,
        siteCatalog,
        catalogChecks,
        catalogAllOk,
      }),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Stripe list failed";
    return {
      statusCode: 500,
      headers: hdrs,
      body: JSON.stringify({ ok: false, error: msg }),
    };
  }
}
