import { useEffect, useId, useRef, useState } from "react";
import { formatUsdFromCents } from "../../lib/money";
import { useCart } from "../../context/useCart";
import { createSquareCheckout } from "../../lib/squareApi";
import "./CartDrawer.css";

export function CartDrawer() {
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleCheckout = async () => {
    try {
      setCheckoutError(null);
      setIsSubmitting(true);
      const payload = getCheckoutPayload();
      const checkoutUrl = await createSquareCheckout(payload.lines);
      window.location.assign(checkoutUrl);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to create checkout link.",
      );
      setIsSubmitting(false);
    }
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
                    <p className="cart-drawer__line-name">{line.productName}</p>
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
                shipping and 7% off eligible items. Taxes calculated at checkout.
              </p>
              {checkoutError ? (
                <p className="cart-drawer__hint">{checkoutError}</p>
              ) : null}
              <div className="cart-drawer__actions">
                <button
                  type="button"
                  className="cart-drawer__checkout"
                  onClick={() => void handleCheckout()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Redirecting..." : "Checkout"}
                </button>
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
