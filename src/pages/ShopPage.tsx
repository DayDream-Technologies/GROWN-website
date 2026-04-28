import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import { siteImage } from "../lib/images";
import { useSquareCatalog } from "../context/useSquareCatalog";
import { useProductModal } from "../context/useProductModal";
import { formatUsdFromCents } from "../lib/money";
import "./ShopPage.css";

const SHOP_EDITORIAL = {
  title: "Shop GROWN",
  lede: "Available products are loaded directly from our Square catalog.",
  image: "site/shop-powders.jpg",
  imageAlt: "Pantry blend jars and fresh ingredients on a counter",
};

const PRODUCE_KEYWORDS = [
  "produce",
  "fresh",
  "microgreen",
  "lettuce",
  "kale",
  "spinach",
  "arugula",
  "basil",
  "mint",
  "cilantro",
  "parsley",
  "herb",
  "greens",
];

function isLikelyProduce(name: string, description: string) {
  const text = `${name} ${description}`.toLowerCase();
  return PRODUCE_KEYWORDS.some((keyword) => text.includes(keyword));
}

export function ShopPage() {
  const { openProductById } = useProductModal();
  const { items, isLoading, error, reload } = useSquareCatalog();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const freshProduceMode = searchParams.get("filter") === "fresh-produce";

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (freshProduceMode && !isLikelyProduce(item.name, item.description)) {
          return false;
        }
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }),
    [freshProduceMode, items, search],
  );

  return (
    <>
      <Section bg="white" className="shop-hero">
        <div className="shop-hero__inner">
          <h1 className="shop-title">{SHOP_EDITORIAL.title}</h1>
          <hr className="shop-hero__rule" />
          <p className="shop-lede">{SHOP_EDITORIAL.lede}</p>
        </div>
      </Section>

      <Section bg="white" className="shop-feature-visual">
        <div className="shop-feature-visual__frame">
          <img
            className="shop-feature-visual__img"
            src={siteImage(SHOP_EDITORIAL.image)}
            alt={SHOP_EDITORIAL.imageAlt}
            loading="lazy"
            decoding="async"
            width={1600}
            height={1200}
          />
        </div>
      </Section>

      <Section bg="white" className="shop-filters">
        <div className="shop-filter-bar" aria-label="Catalog search">
          <input
            type="search"
            className="shop-filter-bar__item"
            placeholder={
              freshProduceMode ? "Search fresh produce" : "Search catalog"
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Section>

      <Section bg="white" className="shop-grid-section">
        {isLoading ? (
          <p className="shop-connect__text">Loading products from Square...</p>
        ) : error ? (
          <div>
            <p className="shop-connect__text">
              We could not load the Square catalog right now.
            </p>
            <button type="button" className="shop-filter-bar__item" onClick={() => void reload()}>
              Retry
            </button>
          </div>
        ) : (
          <div className="shop-product-grid">
            {freshProduceMode && visible.length === 0 ? (
              <p className="shop-connect__text">
                No produce items matched. Add produce items in Square and they will
                appear here.
              </p>
            ) : null}
            {visible.map((item) => (
              <ProductCard
                key={item.id}
                name={item.name}
                shortDescription={item.description}
                priceOneTime={`${formatUsdFromCents(item.amountCents)} one-time`}
                priceSubscription={null}
                fulfillmentBadge="Square catalog item"
                imageSrc={item.imageUrls[0]}
                onOpenDetails={() => openProductById(item.id)}
              />
            ))}
          </div>
        )}
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
