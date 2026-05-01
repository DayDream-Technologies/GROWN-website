export function isCheckoutConfigured(): boolean {
  const api = import.meta.env.VITE_CHECKOUT_API_URL?.trim();
  const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();
  return Boolean(api && pk);
}
