import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import { PlaceholderImage } from "../components/PlaceholderImage";
import "./ShopPage.css";

const products = [
  { name: "Sunflower microgreens", price: "$8.00" },
  { name: "Pea shoot microgreens", price: "$9.00" },
  { name: "Radish micro mix", price: "$9.50" },
  { name: "Salad blend", price: "$10.00" },
  { name: "Herb pantry kit", price: "$14.00" },
  { name: "Weekly greens box", price: "$28.00" },
  { name: "Chef’s micro mix", price: "$12.00" },
  { name: "Juice bar pack", price: "$22.00" },
  { name: "Family size blend", price: "$18.00" },
] as const;

export function ShopPage() {
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
        <div className="shop-filter-bar" role="group" aria-label="Filters">
          <span className="shop-filter-bar__item shop-filter-bar__item--active">
            All products
          </span>
          <span className="shop-filter-bar__item">Microgreens</span>
          <span className="shop-filter-bar__item">Blends</span>
          <span className="shop-filter-bar__item">Pantry</span>
        </div>
      </Section>

      <Section bg="white" className="shop-grid-section">
        <div className="shop-product-grid">
          {products.map((p) => (
            <ProductCard key={p.name} name={p.name} price={p.price} />
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
          Draft placeholder for a subscription block—swap for real plan copy
          and signup when ready.
        </p>
      </Section>
    </>
  );
}
