import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {Record<string, { stripe_product_id?: string, one_time?: string, subscription?: string, shipping_weight_lb?: number }>} */
const catalog = JSON.parse(
  readFileSync(join(__dirname, "stripe-catalog.json"), "utf8"),
);

const FREE_SHIPPING_SUBTOTAL_CENTS = 10_000;
const SHIPPING_TIER_ONE_MAX_LB = 1;
const SHIPPING_TIER_TWO_MAX_LB = 3;

const SHIPPING_PRODUCTS = {
  tier1: {
    productId: "prod_UTUZPxfMjTVQkh",
    amountCents: 1000,
    displayName: "Shipping Tier One",
  },
  tier2: {
    productId: "prod_UTUZtuQ0JU643n",
    amountCents: 1300,
    displayName: "Shipping Tier Two",
  },
  tier3: {
    productId: "prod_UTUaAOqCrcdkoW",
    amountCents: 1500,
    displayName: "Shipping Tier Three",
  },
  free: {
    productId: "prod_UTUckCpV6YxpnB",
    amountCents: 0,
    displayName: "Free Shipping",
  },
};

/**
 * @param {number} subtotalCents
 * @param {number} totalWeightLb
 */
function resolveShippingTier(subtotalCents, totalWeightLb) {
  if (subtotalCents >= FREE_SHIPPING_SUBTOTAL_CENTS) {
    return SHIPPING_PRODUCTS.free;
  }
  if (totalWeightLb <= SHIPPING_TIER_ONE_MAX_LB) {
    return SHIPPING_PRODUCTS.tier1;
  }
  if (totalWeightLb <= SHIPPING_TIER_TWO_MAX_LB) {
    return SHIPPING_PRODUCTS.tier2;
  }
  return SHIPPING_PRODUCTS.tier3;
}

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

/**
 * @param {Stripe} stripe
 * @param {Record<string, unknown>} row
 * @param {'one_time'|'subscription'} purchaseKind
 * @param {Map<string, string>} resolvedPriceCache
 */
async function resolveCatalogPriceId(stripe, row, purchaseKind, resolvedPriceCache) {
  let priceId =
    purchaseKind === "subscription"
      ? /** @type {{ subscription?: string }} */ (row).subscription?.trim()
      : /** @type {{ one_time?: string }} */ (row).one_time?.trim();

  const stripeProductId =
    typeof row.stripe_product_id === "string"
      ? row.stripe_product_id.trim()
      : "";

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

  return priceId?.trim() || null;
}

function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}

function matchesPath(rawPath, suffix) {
  return rawPath === suffix || rawPath.endsWith(suffix);
}

/**
 * GET /catalog/one-time-prices — amounts from Stripe Price objects (same IDs as checkout).
 */
async function handleGetCatalogOneTimePrices(stripeSecret, hdrs) {
  const stripe = new Stripe(stripeSecret);
  const resolvedPriceCache = new Map();
  /** @type {Record<string, { priceId: string, unitAmount: number, currency: string } | null>} */
  const prices = {};

  await Promise.all(
    Object.keys(catalog).map(async (internalId) => {
      const row = catalog[internalId];
      const stripeProductId =
        typeof row.stripe_product_id === "string"
          ? row.stripe_product_id.trim()
          : "";
      if (!stripeProductId) {
        prices[internalId] = null;
        return;
      }
      try {
        const priceId = await resolveCatalogPriceId(
          stripe,
          row,
          "one_time",
          resolvedPriceCache,
        );
        if (!priceId) {
          prices[internalId] = null;
          return;
        }
        const p = await stripe.prices.retrieve(priceId);
        if (p.unit_amount == null || typeof p.currency !== "string") {
          prices[internalId] = null;
          return;
        }
        prices[internalId] = {
          priceId: p.id,
          unitAmount: p.unit_amount,
          currency: p.currency,
        };
      } catch {
        prices[internalId] = null;
      }
    }),
  );

  return {
    statusCode: 200,
    headers: hdrs,
    body: JSON.stringify({
      ok: true,
      fetchedAt: new Date().toISOString(),
      prices,
    }),
  };
}

async function handlePostCheckoutSession(event, stripeSecret, siteUrl, hdrs) {
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

  const resolvedPriceCache = new Map();
  const priceAmountCache = new Map();
  let subtotalCents = 0;
  let totalWeightLb = 0;

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

    if (
      purchaseKind === "subscription" &&
      !Object.prototype.hasOwnProperty.call(row, "subscription")
    ) {
      return {
        statusCode: 400,
        headers: hdrs,
        body: JSON.stringify({
          error: `Product is not sold as subscription: ${productId}`,
        }),
      };
    }

    const priceId = await resolveCatalogPriceId(
      stripe,
      row,
      purchaseKind,
      resolvedPriceCache,
    );

    if (!priceId) {
      return {
        statusCode: 400,
        headers: hdrs,
        body: JSON.stringify({
          error: `Product is not sold as ${purchaseKind}: ${productId}`,
        }),
      };
    }

    if (purchaseKind === "one_time") {
      const shippingWeightLb = Number(row.shipping_weight_lb);
      if (!Number.isFinite(shippingWeightLb) || shippingWeightLb <= 0) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({
            error: `Missing shipping weight for product: ${productId}`,
          }),
        };
      }

      let unitAmountCents;
      if (priceAmountCache.has(priceId)) {
        unitAmountCents = priceAmountCache.get(priceId);
      } else {
        const price = await stripe.prices.retrieve(priceId);
        unitAmountCents = price.unit_amount;
        priceAmountCache.set(priceId, unitAmountCents ?? null);
      }

      if (!Number.isInteger(unitAmountCents) || unitAmountCents < 0) {
        return {
          statusCode: 400,
          headers: hdrs,
          body: JSON.stringify({
            error: `Invalid Stripe price amount for product: ${productId}`,
          }),
        };
      }

      subtotalCents += unitAmountCents * qty;
      totalWeightLb += shippingWeightLb * qty;
    }

    line_items.push({ price: priceId, quantity: qty });
  }

  if (line_items.length === 0) {
    return {
      statusCode: 400,
      headers: hdrs,
      body: JSON.stringify({ error: "Cart is empty" }),
    };
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

  if (purchaseKind === "one_time") {
    const shippingTier = resolveShippingTier(subtotalCents, totalWeightLb);
    params.shipping_options = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingTier.amountCents,
            currency: "usd",
          },
          display_name: shippingTier.displayName,
          metadata: {
            shipping_product_id: shippingTier.productId,
            computed_weight_lb: totalWeightLb.toFixed(2),
            computed_subtotal_cents: String(subtotalCents),
          },
        },
      },
    ];
    params.metadata = {
      shipping_product_id: shippingTier.productId,
      shipping_weight_lb: totalWeightLb.toFixed(2),
      shipping_subtotal_cents: String(subtotalCents),
    };
  }

  const email = typeof customerEmail === "string" ? customerEmail.trim() : "";
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
}

export async function handler(event) {
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  const hdrs = headers(corsOrigin);

  const httpMethod =
    event.requestContext?.http?.method ?? event.httpMethod ?? "POST";
  const rawPath = event.rawPath ?? event.path ?? "";

  if (httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: hdrs, body: "" };
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
    if (httpMethod === "GET" && matchesPath(rawPath, "/catalog/one-time-prices")) {
      return await handleGetCatalogOneTimePrices(stripeSecret, hdrs);
    }

    if (httpMethod === "POST" && matchesPath(rawPath, "/checkout/session")) {
      const siteUrl = (process.env.SITE_URL || "").replace(/\/$/, "");
      if (!siteUrl) {
        return {
          statusCode: 500,
          headers: hdrs,
          body: JSON.stringify({ error: "Server missing SITE_URL" }),
        };
      }
      return await handlePostCheckoutSession(
        event,
        stripeSecret,
        siteUrl,
        hdrs,
      );
    }

    return {
      statusCode: 404,
      headers: hdrs,
      body: JSON.stringify({ error: "Not found" }),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return {
      statusCode: 500,
      headers: hdrs,
      body: JSON.stringify({ error: msg }),
    };
  }
}
