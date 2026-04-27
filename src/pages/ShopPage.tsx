import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import {
  products,
  type Product,
  type ProductCategory,
  getFulfillmentBadge,
} from "../data/products";
import { getProductImageUrl, siteImage } from "../lib/images";
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

const SHOP_EDITORIAL: Record<
  FilterId,
  { title: string; lede: string; image: string; imageAlt: string }
> = {
  all: {
    title: "Shop GROWN",
    lede: "Pantry blends, microgreen seasonings, and fresh local produce — clean ingredients that boost nutrition in everyday meals.",
    image: "site/shop-powders.jpg",
    imageAlt: "Pantry blend jars and fresh ingredients on a counter",
  },
  powder: {
    title: "Pantry Blends — Fresh, Functional, and Clean",
    lede: "Our smoothie boosters and drink refreshers are powered by microgreens, mushrooms, spirulina, or saffron. Fresh, healthy ingredients that boost nutrition in every scoop.",
    image: "site/shop-powders.jpg",
    imageAlt: "Pantry blend powders on a kitchen counter",
  },
  seasoning: {
    title: "Microgreen Seasonings — Flavor Elevated",
    lede: "Crafted from freeze-dried microgreens to boost nutrition in every sprinkle and add flavor to every dish. Clean ingredients. Pure taste.",
    image: "site/hero-home.jpg",
    imageAlt: "Bright kitchen with microgreens and pantry items",
  },
  fresh: {
    title: "Fresh produce & microgreens",
    lede: "We supply restaurants, cafés, juice bars, and health-focused homes with herbs, microgreens, leafy greens, and more. Connect for pricing, delivery, and tray orders across West Michigan.",
    image: "site/smoothies-lifestyle.jpg",
    imageAlt: "Fresh greens, smoothies, and microgreens",
  },
  "local-only": {
    title: "Local pickup",
    lede: "These favorites are available for local delivery and pickup in the West Michigan area. Reach out for pricing, schedules, or wholesale.",
    image: "site/smoothies-lifestyle.jpg",
    imageAlt: "Fresh local produce from GROWN",
  },
};

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

  const editorial = SHOP_EDITORIAL[filter];

  return (
    <>
      <Section bg="white" className="shop-hero">
        <div className="shop-hero__inner">
          <h1 className="shop-title">{editorial.title}</h1>
          <hr className="shop-hero__rule" />
          <p className="shop-lede">{editorial.lede}</p>
        </div>
      </Section>

      <Section bg="white" className="shop-feature-visual">
        <div className="shop-feature-visual__frame">
          <img
            className="shop-feature-visual__img"
            src={siteImage(editorial.image)}
            alt={editorial.imageAlt}
            loading="lazy"
            decoding="async"
            width={1600}
            height={1200}
          />
        </div>
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
              priceOneTime={
                p.contactForPricing
                  ? p.priceOneTime
                  : `${p.priceOneTime} one-time`
              }
              priceSubscription={p.priceSubscription}
              fulfillmentBadge={getFulfillmentBadge(p)}
              imageSrc={getProductImageUrl(p)}
              imageAlignTop={p.category === "seasoning"}
              onOpenDetails={() => openProductById(p.id)}
            />
          ))}
        </div>
      </Section>

      <Section bg="white" className="shop-connect">
        <h2 className="shop-connect__title">Connect With GROWN</h2>
        <p className="shop-connect__text">
          Reach out for wholesale orders, custom blends, or questions about what
          you see here. Available for local delivery in the West Michigan area.
        </p>
        <LinkButton to="/contact" variant="rose" className="shop-connect__btn">
          Get in touch
        </LinkButton>
      </Section>

      <Section bg="blush" className="shop-strip">
        <h2 className="shop-strip__title">Grown locally. Delivered fresh.</h2>
        <p className="shop-strip__text">
          Hydroponic greens picked at peak nutrition—consistent quality from
          seed to shelf. Pricing and subscriptions for fresh produce and
          microgreen trays are handled personally: open any fresh item for the
          inquiry form, or{" "}
          <Link className="shop-strip__link" to="/contact">
            contact us
          </Link>{" "}
          directly.
        </p>
      </Section>

      <Section bg="warm" className="shop-subscribe">
        <h2 className="shop-subscribe__title">Subscribe & save</h2>
        <p className="shop-subscribe__text">
          Monthly subscriptions save 7% and include free shipping. Build a box
          of any three seasonings, or any two products from our other categories
          (Golden Calm and Lemon Zest are one-time only). Orders of $60 or more
          qualify for free shipping. Open any eligible product for one-time and
          subscription options.
        </p>
      </Section>
    </>
  );
}
