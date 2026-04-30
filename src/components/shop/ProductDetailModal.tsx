import { useEffect, useId, useRef } from "react";
import type { SquareCatalogItem } from "../../types/square";
import { useCart } from "../../context/useCart";
import { Button } from "../Button";
import { PlaceholderImage } from "../PlaceholderImage";
import { formatUsdFromCents } from "../../lib/money";
import "./ProductDetailModal.css";

type Props = {
  product: SquareCatalogItem | null;
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

  const subLine = product
    ? product.variationName
      ? `${product.name} — ${product.variationName}`
      : product.name
    : "";

  const heroUrl =
    product?.imageUrls?.find((u) => typeof u === "string" && u.length > 0) ??
    null;
  const amountCents =
    typeof product?.amountCents === "number" && Number.isFinite(product.amountCents)
      ? product.amountCents
      : 0;

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
            <div className="product-modal__hero">
              {heroUrl ? (
                <img
                  className="product-modal__hero-img"
                  src={heroUrl}
                  alt={`${subLine} — product photo`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <PlaceholderImage label="No product photo" tone="warm" />
              )}
            </div>
            <p className="product-modal__lede">{product.description ?? ""}</p>
            <dl className="product-modal__prices">
              <div>
                <dt>Price</dt>
                <dd>{formatUsdFromCents(amountCents)}</dd>
              </div>
            </dl>
            <div className="product-modal__cart-actions">
              <Button
                type="button"
                variant="primary"
                className="product-modal__add"
                onClick={() => {
                  addLine({
                    productId: product.id,
                    unitAmountCents: amountCents,
                    productName: subLine,
                  });
                }}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
