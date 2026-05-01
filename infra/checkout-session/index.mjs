import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, { stripe_product_id?: string, one_time?: string, subscription?: string }>} */
const catalog = JSON.parse(
  readFileSync(join(__dirname, "stripe-catalog.json"), "utf8"),
);

/**
 * Resolve a Stripe Price ID from a Product when the catalog stores `prod_…` only.
 * Prefers the product’s default price when it matches the requested purchase kind.
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

function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

export async function handler(event) {
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  const hdrs = headers(corsOrigin);

  const httpMethod =
    event.requestContext?.http?.method ?? event.httpMethod ?? "POST";

  if (httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: hdrs, body: "" };
  }

  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");

    if (!stripeSecret) {
      return {
        statusCode: 500,
        headers: hdrs,
        body: JSON.stringify({ error: "Server missing Stripe configuration" }),
      };
    }
    if (!siteUrl) {
      return {
        statusCode: 500,
        headers: hdrs,
        body: JSON.stringify({ error: "Server missing SITE_URL" }),
      };
    }

    const stripe = new Stripe(stripeSecret);
    /** @type {{ lines?: unknown[], customerEmail?: string }} */
    const body = JSON.parse(event.body || "{}");
    const { lines, customerEmail } = body;

    if (!Array.isArray(lines) || lines.length === 0) {
      return {
        statusCode: 400,
        headers: hdrs,
        body: JSON.stringify({ error: "Cart is empty" }),
      };
    }

    const kinds = new Set(
      lines.map((l) =>
        typeof l === "object" && l !== null && "purchaseKind" in l
          ? String(/** @type {{ purchaseKind?: string }} */ (l).purchaseKind)
          : "",
      ),
    );
    kinds.delete("");
    if (kinds.size > 1) {
      return {
        statusCode: 400,
        headers: hdrs,
        body: JSON.stringify({
          error:
            "Your cart mixes subscriptions with one-time purchases. Checkout one type at a time.",
        }),
      };
    }

    /** @type {'one_time'|'subscription'} */
    const purchaseKind =
      lines[0] &&
      typeof lines[0] === "object" &&
      lines[0] !== null &&
      /** @type {{ purchaseKind?: string }} */ (lines[0]).purchaseKind ===
        "subscription"
        ? "subscription"
        : "one_time";

    const mode = purchaseKind === "subscription" ? "subscription" : "payment";

    /** @type {{ price: string, quantity: number }[]} */
    const line_items = [];

    /** Cache Stripe Product → Price resolution within this invocation */
    const resolvedPriceCache = new Map();

    for (const raw of lines) {
      if (typeof raw !== "object" || raw === null) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({ error: "Invalid line item" }),
        };
      }
      const line = /** @type {{ productId?: unknown, quantity?: unknown }} */ (
        raw
      );
      const productId =
        typeof line.productId === "string" ? line.productId.trim() : "";
      const qty = Math.floor(Number(line.quantity));
      if (!productId) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({ error: "Missing productId" }),
        };
      }
      if (!Number.isFinite(qty) || qty < 1 || qty > 99) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({ error: "Invalid quantity" }),
        };
      }

      const lk =
        typeof raw === "object" &&
        raw !== null &&
        "purchaseKind" in raw &&
        /** @type {{ purchaseKind?: string }} */ (raw).purchaseKind ===
          "subscription"
          ? "subscription"
          : "one_time";

      if (lk !== purchaseKind) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({
            error: "Mixed purchase types in cart are not supported.",
          }),
        };
      }

      const row = catalog[productId];
      if (!row) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({
            error: `Product is not available for checkout: ${productId}`,
          }),
        };
      }

      let priceId =
        purchaseKind === "subscription"
          ? row.subscription?.trim()
          : row.one_time?.trim();

      const stripeProductId = row.stripe_product_id?.trim();

      if (!priceId && stripeProductId) {
        const cacheKey = `${stripeProductId}:${purchaseKind}`;
        if (resolvedPriceCache.has(cacheKey)) {
          priceId = resolvedPriceCache.get(cacheKey);
        } else {
          const resolved = await resolvePriceIdFromStripeProduct(
            stripe,
            stripeProductId,
            purchaseKind,
          );
          resolvedPriceCache.set(cacheKey, resolved ?? "");
          priceId = resolved ?? "";
        }
      }

      if (!priceId) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({
            error: `Product is not sold as ${purchaseKind}: ${productId}`,
          }),
        };
      }

      line_items.push({ price: priceId, quantity: qty });
    }

    const returnPath = `/checkout/return?session_id={CHECKOUT_SESSION_ID}`;
    const return_url = `${siteUrl}${returnPath}`;

    /** @type {import('stripe').Stripe.Checkout.SessionCreateParams} */
    const params = {
      ui_mode: "embedded",
      mode,
      line_items,
      return_url,
      customer_creation: "always",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["US"] },
    };

    const email =
      typeof customerEmail === "string" ? customerEmail.trim() : "";
    if (email) {
      params.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(params);

    if (!session.client_secret) {
      return {
        statusCode: 500,
        headers: hdrs,
        body: JSON.stringify({
          error: "Checkout session missing client_secret",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: hdrs,
      body: JSON.stringify({
        clientSecret: session.client_secret,
        sessionId: session.id,
      }),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Checkout failed";
    return {
      statusCode: 500,
      headers: hdrs,
      body: JSON.stringify({ error: msg }),
    };
  }
}
