import type { Stripe } from "@stripe/stripe-js";

/**
 * Embedded Checkout (`stripe.createEmbeddedCheckoutPage`) is not always in package
 * typings; cast at runtime.
 *
 * @see https://docs.stripe.com/js/embedded_checkout/create
 */
export async function createEmbeddedCheckoutPageFromSession(
  stripe: Stripe,
  clientSecret: string,
): Promise<{ mount: (target: HTMLElement | string) => void; destroy: () => void }> {
  const withEmbedded = stripe as unknown as {
    createEmbeddedCheckoutPage: (opts: {
      clientSecret: string;
    }) => Promise<{ mount: (target: HTMLElement | string) => void; destroy: () => void }>;
  };
  return withEmbedded.createEmbeddedCheckoutPage({ clientSecret });
}
