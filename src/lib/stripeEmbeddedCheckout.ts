import type { Stripe } from "@stripe/stripe-js";

/** Embedded Checkout exists on Stripe.js at runtime; package typings omit it in some builds. */
export async function initEmbeddedCheckoutFromSession(
  stripe: Stripe,
  clientSecret: string,
): Promise<{ mount: (target: HTMLElement | string) => void; destroy: () => void }> {
  const embedded = stripe as unknown as {
    initEmbeddedCheckout: (opts: {
      clientSecret: string;
    }) => Promise<{ mount: (target: HTMLElement | string) => void; destroy: () => void }>;
  };
  return embedded.initEmbeddedCheckout({ clientSecret });
}
