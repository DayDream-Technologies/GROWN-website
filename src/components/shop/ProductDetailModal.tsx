import { useEffect, useId, useRef } from "react";
import type { Product } from "../../data/products";
import { useCart } from "../../context/useCart";
import { Button } from "../Button";
import { PlaceholderImage } from "../PlaceholderImage";
import { FreshProductInquiryForm } from "./FreshProductInquiryForm";
import { siteImage } from "../../lib/images";
import { getProductListImage } from "../../lib/productImages";
import {
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
      try {
        if (typeof el.showModal === "function" && !el.open) {
          el.showModal();
        }
      } catch {
        /* InvalidStateError if top-layer / open race (e.g. StrictMode double effect) */
      }
      queueMicrotask(() => {
        closeBtnRef.current?.focus();
      });
    } else if (el.open) {
      try {
        el.close();
      } catch {
        /* ignore */
      }
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

  const titleLine = product
    ? product.subtitle
      ? `${product.name} — ${product.subtitle}`
      : product.name
    : "";

  const heroPath = product ? getProductListImage(product) : null;
  const heroUrl = heroPath ? siteImage(heroPath) : null;
  const unitCents = product ? getOneTimeUnitCents(product) : null;
  const subscriptionCents = product
    ? getSubscriptionUnitCents(product)
    : null;
  const purchasable = unitCents != null && !product?.contactForPricing;
  const subscribable =
    product &&
    purchasable &&
    canPurchaseSubscription(product) &&
    subscriptionCents != null;

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
              {titleLine}
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
            <div className="product-modal__hero">
              {heroUrl ? (
                <img
                  className="product-modal__hero-img"
                  src={heroUrl}
                  alt={`${titleLine} — product photo`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <PlaceholderImage label="No product photo" tone="warm" />
              )}
            </div>
            <p className="product-modal__meta">{product.size}</p>
            <p className="product-modal__lede">{product.shortDescription}</p>
            <div className="product-modal__prose">
              <p>{product.longDescription}</p>
            </div>
            <details className="product-modal__details-block">
              <summary>Ingredients</summary>
              <p>{product.ingredients}</p>
            </details>
            {product.recipes.length > 0 ? (
              <details className="product-modal__details-block">
                <summary>Ideas & recipes</summary>
                <ul className="product-modal__recipe-list">
                  {product.recipes.map((r) => (
                    <li key={r.title}>
                      <strong>{r.title}</strong> — {r.body}
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}

            {product.contactForPricing ? (
              <FreshProductInquiryForm productLabel={titleLine} />
            ) : (
              <>
                <dl className="product-modal__prices">
                  <div>
                    <dt>One-time</dt>
                    <dd>{product.priceOneTime}</dd>
                  </div>
                  {product.priceSubscription ? (
                    <div>
                      <dt>Subscribe & save</dt>
                      <dd>{product.priceSubscription}</dd>
                    </div>
                  ) : null}
                </dl>
                {purchasable ? (
                  <div className="product-modal__cart-actions">
                    <Button
                      type="button"
                      variant="primary"
                      className="product-modal__add"
                      onClick={() => {
                        addLine({
                          productId: product.id,
                          purchaseKind: "one_time",
                          unitAmountCents: unitCents,
                          productName: titleLine,
                        });
                      }}
                    >
                      Add to cart — one-time
                    </Button>
                    {subscribable ? (
                      <Button
                        type="button"
                        variant="ghost"
                        className="product-modal__add product-modal__add--subscribe"
                        onClick={() => {
                          addLine({
                            productId: product.id,
                            purchaseKind: "subscription",
                            unitAmountCents: subscriptionCents,
                            productName: titleLine,
                          });
                        }}
                      >
                        Add to cart — subscribe
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
