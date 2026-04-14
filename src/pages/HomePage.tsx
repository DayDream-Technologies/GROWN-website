import { useMemo } from "react";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import {
  featuredProductIds,
  products,
  getFulfillmentBadge,
} from "../data/products";
import { useProductModal } from "../context/useProductModal";
import "./HomePage.css";

export function HomePage() {
  const { openProductById } = useProductModal();
  const heroImageSrc = `${import.meta.env.BASE_URL}images/Danelle.jpg`;

  const featured = useMemo(() => {
    const set = new Set(featuredProductIds);
    return products.filter((p) => set.has(p.id));
  }, []);

  return (
    <>
      <Section bg="white" className="home-hero">
        <div className="home-hero__grid">
          <div className="home-hero__copy">
            <h1 className="home-hero__title">
              Nutrient-rich food, grown with intention — from seed to shelf
            </h1>
            <p className="home-hero__lede">
              Microgreens, pantry blends, and nutrient-dense products designed
              for everyday life.
            </p>
            <div className="home-hero__actions">
              <LinkButton to="/shop">Shop Fresh Produce</LinkButton>
              <LinkButton to="/shop" variant="ghost">
                Shop Smoothie & Pantry Blends
              </LinkButton>
            </div>
          </div>
          <img
            className="home-hero__image"
            src={heroImageSrc}
            alt="Woman standing in a kitchen holding a mug."
          />
        </div>
      </Section>

      <Section bg="blush" id="from-seed">
        <p className="home-section-label">From seed to shelf</p>
        <h2 className="home-section-title">
          Everyday nutrition without the noise
        </h2>
        <p className="home-section-body">
          We focus on quality, simplicity, and real nutrition—so you can build
          meals that feel as good as they taste.
        </p>
      </Section>

      <Section bg="white" id="paths">
        <p className="home-section-label">Choose your path</p>
        <h2 className="home-section-title">Two ways to work with GROWN</h2>
        <div className="home-paths">
          <article className="home-path-card">
            <h3 className="home-path-card__title">Shop for your home</h3>
            <p className="home-path-card__text">
              Stock your kitchen with microgreens and pantry essentials made
              for daily routines.
            </p>
            <LinkButton to="/shop">Browse the shop</LinkButton>
          </article>
          <article className="home-path-card">
            <h3 className="home-path-card__title">Partner with us</h3>
            <p className="home-path-card__text">
              Reliable supply for restaurants, cafés, and health-focused
              businesses.
            </p>
            <LinkButton to="/partner">Start a conversation</LinkButton>
          </article>
        </div>
      </Section>

      <Section bg="white" id="preview">
        <p className="home-section-label">Product preview</p>
        <h2 className="home-section-title">A taste of what we grow</h2>
        <div className="home-preview-grid">
          {featured.map((p) => (
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

      <Section bg="blush" className="home-cta">
        <h2 className="home-cta__title">Ready to eat more intentionally?</h2>
        <p className="home-cta__text">
          Explore the shop or reach out to talk wholesale and partnerships.
        </p>
        <div className="home-cta__actions">
          <LinkButton to="/shop">Shop Fresh Produce</LinkButton>
          <LinkButton to="/shop" variant="ghost">
            Shop Smoothie & Pantry Blends
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
