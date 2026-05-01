import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { formatUsdFromCents } from "../../lib/money";
import { cartHasMixedPurchaseKinds } from "../../lib/cartPurchaseKinds";
import { useCart } from "../../context/useCart";
import { contactEmail } from "../../config/contact";
import { isCheckoutConfigured } from "../../lib/checkoutEnv";
import "./CartDrawer.css";

export function CartDrawer() {
  const panelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const {
    lines,
    subtotalCents,
    isOpen,
    closeCart,
    setQuantity,
    removeLine,
    clearCart,
    getCheckoutPayload,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => closeRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const stripeCheckoutEnabled = isCheckoutConfigured();
  const mixedKinds = cartHasMixedPurchaseKinds(lines);
  const canUseStripeCheckout =
    stripeCheckoutEnabled && lines.length > 0 && !mixedKinds;

  const handleEmailOrderRequest = () => {
    const payload = getCheckoutPayload();
    if (payload.lines.length === 0) return;
    const subject = encodeURIComponent("Website cart — order request");
    const body = encodeURIComponent(
      [
        "Please use this as a starting point for my order:",
        "",
        ...payload.lines.map((l) => {
          const kind =
            l.purchaseKind === "subscription"
              ? " (monthly subscription)"
              : " (one-time)";
          return `- ${l.productName}${kind} × ${l.quantity} @ ${formatUsdFromCents(l.unitAmountCents)} each`;
        }),
        "",
        `Subtotal: ${formatUsdFromCents(payload.subtotalCents)}`,
      ].join("\n"),
    );
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    closeCart();
  };

  return (
    <div className="cart-drawer-root" role="presentation">
      <button
        type="button"
        className="cart-drawer__backdrop"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside
        id={panelId}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <header className="cart-drawer__header">
          <h2 id="cart-drawer-title" className="cart-drawer__title">
            Your cart
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="cart-drawer__close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </header>

        {lines.length === 0 ? (
          <p className="cart-drawer__empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {lines.map((line) => (
                <li key={line.lineKey} className="cart-drawer__line">
                  <div className="cart-drawer__line-top">
                    <div>
                      <p className="cart-drawer__line-name">{line.productName}</p>
                      <p className="cart-drawer__line-mode">
                        {line.purchaseKind === "subscription"
                          ? "Monthly subscription"
                          : "One-time"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="cart-drawer__remove"
                      onClick={() => removeLine(line.lineKey)}
                      aria-label={`Remove ${line.productName}`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-drawer__line-controls">
                    <label className="cart-drawer__qty">
                      <span className="cart-drawer__qty-label">Qty</span>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={line.quantity}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          if (Number.isNaN(v)) return;
                          setQuantity(line.lineKey, v);
                        }}
                      />
                    </label>
                    <p className="cart-drawer__line-sub">
                      {formatUsdFromCents(
                        line.unitAmountCents * line.quantity,
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Subtotal</span>
                <strong>{formatUsdFromCents(subtotalCents)}</strong>
              </div>
              <p className="cart-drawer__hint">
                Free shipping on orders over $60. Subscription orders include free
                shipping and 7% off eligible items. Taxes and shipping are finalized in
                Stripe checkout.
              </p>
              {stripeCheckoutEnabled ? (
                mixedKinds ? (
                  <p className="cart-drawer__hint cart-drawer__hint--warn" role="alert">
                    Your cart mixes one-time items with subscriptions. Adjust the cart so
                    it contains only one purchase type, then proceed to checkout.
                  </p>
                ) : null
              ) : (
                <p className="cart-drawer__hint">
                  Online checkout uses Stripe when configured. Until then, you can email{" "}
                  {contactEmail} with your cart using the button below.
                </p>
              )}
              <div className="cart-drawer__actions">
                {canUseStripeCheckout ? (
                  <Link
                    className="cart-drawer__checkout cart-drawer__checkout--link"
                    to="/checkout"
                    onClick={() => closeCart()}
                  >
                    Proceed to checkout
                  </Link>
                ) : stripeCheckoutEnabled ? (
                  <button
                    type="button"
                    className="cart-drawer__checkout"
                    disabled
                    aria-disabled="true"
                  >
                    Proceed to checkout
                  </button>
                ) : null}
                {!stripeCheckoutEnabled ? (
                  <button
                    type="button"
                    className="cart-drawer__checkout"
                    onClick={handleEmailOrderRequest}
                  >
                    Email order request
                  </button>
                ) : null}
                <button
                  type="button"
                  className="cart-drawer__clear"
                  onClick={clearCart}
                >
                  Clear cart
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
