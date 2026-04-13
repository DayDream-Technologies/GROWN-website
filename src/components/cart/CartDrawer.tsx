import { useEffect, useId, useRef } from "react";
import { formatUsdFromCents } from "../../lib/money";
import { useCart } from "../../context/useCart";
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

  const handleCheckoutSample = () => {
    const payload = getCheckoutPayload();
    // Replace with: POST /api/checkout-sessions → redirectToCheckout(sessionId)
    console.info("[GROWN] Sample checkout payload (wire to Stripe later)", payload);
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
                  <p className="cart-drawer__line-mode">
                    {line.purchaseMode === "one_time"
                      ? "One-time purchase"
                      : "Subscription"}
                  </p>
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
                Taxes and shipping calculated at checkout. Subscription items can
                be billed via Stripe when Price IDs are configured.
              </p>
              <div className="cart-drawer__actions">
                <button
                  type="button"
                  className="cart-drawer__checkout"
                  onClick={handleCheckoutSample}
                >
                  Checkout (sample)
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
