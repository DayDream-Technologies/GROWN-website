import { useMemo, useState } from "react";
import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import { PlaceholderImage } from "../components/PlaceholderImage";
import {
  products,
  type Product,
  type ProductCategory,
  getFulfillmentBadge,
} from "../data/products";
import { useProductModal } from "../context/useProductModal";
import "./ShopPage.css";

type FilterId = "all" | ProductCategory | "local-only";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All products" },
  { id: "powder", label: "Powders & drinks" },
  { id: "seasoning", label: "Seasonings" },
  { id: "fresh", label: "Fresh & local" },
  { id: "local-only", label: "Local pickup only" },
];

function matchesFilter(product: Product, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "local-only") return !!product.localOnly;
  return product.category === filter;
}

export function ShopPage() {
  const { openProductById } = useProductModal();
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = useMemo(
    () => products.filter((p) => matchesFilter(p, filter)),
    [filter],
  );

  return (
    <>
      <Section bg="white" className="shop-hero">
        <p className="shop-eyebrow">Shop for your home</p>
        <h1 className="shop-title">Nutrient-dense essentials</h1>
        <p className="shop-lede">
          Nutrient-dense essentials designed for everyday life.
        </p>
      </Section>

      <Section bg="white" className="shop-feature-visual">
        <PlaceholderImage
          label="Picture of kitchen — lifestyle photography"
          tone="warm"
        />
      </Section>

      <Section bg="white" className="shop-filters">
        <div className="shop-filter-bar" role="group" aria-label="Product filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={
                f.id === filter
                  ? "shop-filter-bar__item shop-filter-bar__item--active"
                  : "shop-filter-bar__item"
              }
              aria-pressed={f.id === filter}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Section>

      <Section bg="white" className="shop-grid-section">
        <div className="shop-product-grid">
          {visible.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              subtitle={p.subtitle}
              shortDescription={p.shortDescription}
              priceOneTime={`${p.priceOneTime} one-time`}
              priceSubscription={p.priceSubscription}
              fulfillmentBadge={getFulfillmentBadge(p)}
              onOpenDetails={() => openProductById(p.id)}
            />
          ))}
        </div>
      </Section>

      <Section bg="blush" className="shop-strip">
        <h2 className="shop-strip__title">Grown locally. Delivered fresh.</h2>
        <p className="shop-strip__text">
          Hydroponic greens picked at peak nutrition—consistent quality from
          seed to shelf.
        </p>
      </Section>

      <Section bg="warm" className="shop-subscribe">
        <h2 className="shop-subscribe__title">Subscribe & save</h2>
        <p className="shop-subscribe__text">
          Many powders and pantry items include a subscription price—open any
          product for one-time and subscription options.
        </p>
      </Section>
    </>
  );
}
