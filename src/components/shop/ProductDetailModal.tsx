import { useEffect, useId, useRef } from "react";
import type { SquareCatalogItem } from "../../types/square";
import { useCart } from "../../context/useCart";
import { Button } from "../Button";
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
    ? product.variationName
      ? `${product.name} — ${product.variationName}`
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
            <div className="product-modal__hero">
              <img
                className="product-modal__hero-img"
                src={product.imageUrls[0]}
                alt={`${subLine} — product photo`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="product-modal__lede">{product.description}</p>
            <dl className="product-modal__prices">
              <div>
                <dt>Price</dt>
                <dd>{formatUsdFromCents(product.amountCents)}</dd>
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
                    unitAmountCents: product.amountCents,
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
