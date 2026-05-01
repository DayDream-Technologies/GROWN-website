import Stripe from "stripe";

export async function handler(event) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return { statusCode: 500, body: "Missing Stripe configuration" };
  }

  const stripe = new Stripe(stripeSecret);

  const sig =
    event.headers?.["stripe-signature"] ??
    event.headers?.["Stripe-Signature"] ??
    "";

  let rawBody = event.body ?? "";
  if (event.isBase64Encoded && typeof rawBody === "string") {
    rawBody = Buffer.from(rawBody, "base64").toString("utf8");
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret,
    );

    switch (stripeEvent.type) {
      case "checkout.session.completed":
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.paid":
      case "invoice.payment_failed":
        break;
      default:
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verify failed";
    return { statusCode: 400, body: `Webhook Error: ${message}` };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ received: true }),
  };
}
