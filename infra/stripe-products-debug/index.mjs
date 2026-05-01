import Stripe from "stripe";

function headers(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Content-Type": "application/json",
  };
}

/**
 * Lists active Stripe products and prices (temporary diagnostic endpoint).
 * GET /debug/stripe-products
 */
export async function handler(event) {
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  const hdrs = headers(corsOrigin);

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
