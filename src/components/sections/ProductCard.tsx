import { Button } from "../Button";
import "./ProductCard.css";

type Props = {
  name: string;
  price?: string;
  subtitle?: string;
  shortDescription?: string;
  priceOneTime?: string;
  priceSubscription?: string | null;
  fulfillmentBadge?: string;
  /** When set, shown in the card header area */
  imageSrc?: string;
  onOpenDetails?: () => void;
};

export function ProductCard({
  name,
  price,
  subtitle,
  shortDescription,
  priceOneTime,
  priceSubscription,
  fulfillmentBadge,
  imageSrc,
  onOpenDetails,
}: Props) {
  const primaryPrice = priceOneTime ?? price ?? "";
  const subLine =
    priceSubscription != null && priceSubscription !== ""
      ? `Subscription: ${priceSubscription}`
      : null;

  const inner = (
    <>
      <div
        className={
          imageSrc
            ? "product-card__visual product-card__visual--photo"
            : "product-card__visual"
        }
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${name} — product photo`}
            className="product-card__photo"
            loading="lazy"
            decoding="async"
          />
        ) : null}
      </div>
      <h3 className="product-card__name">{name}</h3>
      {subtitle ? (
        <p className="product-card__subtitle">{subtitle}</p>
      ) : null}
      {shortDescription ? (
        <p className="product-card__blurb">{shortDescription}</p>
      ) : null}
      <p className="product-card__price">{primaryPrice}</p>
      {subLine ? (
        <p className="product-card__subprice">{subLine}</p>
      ) : null}
      {fulfillmentBadge ? (
        <p className="product-card__fulfillment">{fulfillmentBadge}</p>
      ) : null}
      {onOpenDetails ? (
        <span className="product-card__btn product-card__btn--fake">
          View details
        </span>
      ) : (
        <Button type="button" className="product-card__btn">
          Add to Cart
        </Button>
      )}
    </>
  );

  if (onOpenDetails) {
    return (
      <div
        role="button"
        tabIndex={0}
        className="product-card product-card--interactive"
        aria-label={`View details: ${name}`}
        onClick={onOpenDetails}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenDetails();
          }
        }}
      >
        {inner}
      </div>
    );
  }

  return <article className="product-card">{inner}</article>;
}
