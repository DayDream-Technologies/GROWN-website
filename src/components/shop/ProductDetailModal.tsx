import { useEffect, useId, useRef } from "react";
import type { Product } from "../../data/products";
import { useCart } from "../../context/useCart";
import { Button } from "../Button";
import {
  canPurchaseOneTime,
  canPurchaseSubscription,
  getOneTimeUnitCents,
  getSubscriptionUnitCents,
} from "../../lib/productPricing";
import "./ProductDetailModal.css";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: Props) {
  const { addLine } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (product) {
      if (!el.open) {
        el.showModal();
      }
      queueMicrotask(() => {
        closeBtnRef.current?.focus();
      });
    } else if (el.open) {
      el.close();
    }
  }, [product]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  const handleClose = () => {
    onClose();
  };

  const handleDialogPointerDown = (e: React.PointerEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const subLine = product
    ? product.subtitle
      ? `${product.name} — ${product.subtitle}`
      : product.name
    : "";

  return (
    <dialog
      ref={dialogRef}
      className="product-modal"
      aria-labelledby={product ? titleId : undefined}
      aria-modal={product ? "true" : undefined}
      aria-hidden={product ? undefined : "true"}
      onClose={handleClose}
      onPointerDown={handleDialogPointerDown}
    >
      {product ? (
        <div
          className="product-modal__panel"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <header className="product-modal__header">
            <h2 id={titleId} className="product-modal__title">
              {subLine}
            </h2>
            <button
              ref={closeBtnRef}
              type="button"
              className="product-modal__close"
              aria-label="Close product details"
              onClick={handleClose}
            >
              ×
            </button>
          </header>

          <div className="product-modal__body">
            <p className="product-modal__meta">
              <strong>Size:</strong> {product.size}
            </p>
            <p className="product-modal__lede">{product.shortDescription}</p>

            <dl className="product-modal__prices">
              <div>
                <dt>One-time</dt>
                <dd>{product.priceOneTime}</dd>
              </div>
              <div>
                <dt>Subscription</dt>
                <dd>{product.priceSubscription ?? "N/A"}</dd>
              </div>
            </dl>

            <div className="product-modal__cart-actions">
              <Button
                type="button"
                variant="primary"
                className="product-modal__add"
                disabled={!canPurchaseOneTime(product)}
                title={
                  canPurchaseOneTime(product)
                    ? undefined
                    : "One-time price unavailable for checkout"
                }
                onClick={() => {
                  const cents = getOneTimeUnitCents(product);
                  if (cents == null) return;
                  addLine({
                    productId: product.id,
                    purchaseMode: "one_time",
                    unitAmountCents: cents,
                    productName: subLine,
                  });
                }}
              >
                Add one-time
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="product-modal__add"
                disabled={!canPurchaseSubscription(product)}
                title={
                  canPurchaseSubscription(product)
                    ? undefined
                    : "Subscription not available or price TBD"
                }
                onClick={() => {
                  const cents = getSubscriptionUnitCents(product);
                  if (cents == null) return;
                  addLine({
                    productId: product.id,
                    purchaseMode: "subscription",
                    unitAmountCents: cents,
                    productName: subLine,
                  });
                }}
              >
                Add subscription
              </Button>
            </div>
            <p className="product-modal__stripe-hint">
              Checkout uses sample cart totals. Map Stripe Price IDs in{" "}
              <code className="product-modal__code">src/config/stripe.ts</code>{" "}
              for live Stripe Checkout or a backend session.
            </p>

            <p className="product-modal__fulfillment">
              <strong>Fulfillment:</strong> {product.fulfillment}
            </p>

            <section className="product-modal__section">
              <h3 className="product-modal__section-title">About</h3>
              <p className="product-modal__long">{product.longDescription}</p>
            </section>

            <section className="product-modal__section">
              <h3 className="product-modal__section-title">Ingredients</h3>
              <p className="product-modal__ingredients">{product.ingredients}</p>
            </section>

            <section className="product-modal__section">
              <h3 className="product-modal__section-title">Recipes &amp; uses</h3>
              <ol className="product-modal__recipes">
                {product.recipes.map((r) => (
                  <li key={r.title}>
                    <strong>{r.title}</strong> — {r.body}
                  </li>
                ))}
              </ol>
              {product.suggestedUses && product.suggestedUses.length > 0 ? (
                <div className="product-modal__suggested">
                  <p className="product-modal__suggested-label">Suggested uses</p>
                  <ul>
                    {product.suggestedUses.map((u) => (
                      <li key={u}>{u}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            {product.labelNotes ? (
              <section className="product-modal__section">
                <h3 className="product-modal__section-title">Label notes</h3>
                <p className="product-modal__notes">{product.labelNotes}</p>
              </section>
            ) : null}

            {product.extraNotes && product.extraNotes.length > 0 ? (
              <section className="product-modal__section">
                <h3 className="product-modal__section-title">
                  Additional details
                </h3>
                <ul className="product-modal__extra">
                  {product.extraNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
