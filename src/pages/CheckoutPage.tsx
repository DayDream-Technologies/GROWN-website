import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { createEmbeddedCheckoutPageFromSession } from "../lib/stripeEmbeddedCheckout";
import { Section } from "../components/sections/Section";
import { useCart } from "../context/useCart";
import { cartHasMixedPurchaseKinds } from "../lib/cartPurchaseKinds";
import { createCheckoutSession } from "../lib/checkoutApi";
import "./CheckoutPage.css";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, getCheckoutPayload } = useCart();
  const mountRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<{ destroy: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lines.length === 0) {
      navigate("/shop", { replace: true });
      return;
    }

    if (cartHasMixedPurchaseKinds(lines)) {
      setError(
        "Your cart mixes one-time purchases with subscriptions. Remove one type of item (or split into two orders), then try again.",
      );
      setLoading(false);
      return;
    }

    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();
    if (!pk) {
      setError("Payments are not configured yet (missing publishable key).");
      setLoading(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const payload = getCheckoutPayload();
        const session = await createCheckoutSession({
          lines: payload.lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            purchaseKind: l.purchaseKind,
          })),
        });
        if (cancelled) return;

        const stripe = await loadStripe(pk);
        if (!stripe) throw new Error("Unable to load Stripe.");

        const checkout = await createEmbeddedCheckoutPageFromSession(
          stripe,
          session.clientSecret,
        );
        if (cancelled) {
          checkout.destroy();
          return;
        }

        const el = mountRef.current;
        if (!el) {
          checkout.destroy();
          return;
        }
        checkout.mount(el);
        checkoutRef.current = checkout;
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Checkout failed.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      checkoutRef.current?.destroy();
      checkoutRef.current = null;
    };
  }, [lines, navigate, getCheckoutPayload]);

  return (
    <Section bg="white" className="checkout-page">
      <div className="checkout-page__inner">
        <header className="checkout-page__header">
          <h1 className="checkout-page__title">Checkout</h1>
          <p className="checkout-page__lede">
            Secure payment powered by Stripe. Need to adjust your cart first?{" "}
            <Link className="checkout-page__link" to="/shop">
              Back to shop
            </Link>
          </p>
        </header>

        {loading ? (
          <p className="checkout-page__status" aria-live="polite">
            Preparing checkout…
          </p>
        ) : null}

        {error ? (
          <div className="checkout-page__error" role="alert">
            <p>{error}</p>
          </div>
        ) : null}

        {!error ? (
          <aside className="checkout-page__local-notice" aria-label="Local order instructions">
            <p>
              If you are placing a local order, please enter the code{" "}
              <code className="checkout-page__promo-code">LocalOrderOne</code> at checkout to avoid
              shipping charges. We will reach out within 24 hours to arrange local delivery.
            </p>
          </aside>
        ) : null}

        <div
          ref={mountRef}
          className="checkout-page__stripe-root"
          aria-busy={loading}
        />
      </div>
    </Section>
  );
}
