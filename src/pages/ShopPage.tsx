import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import { siteImage } from "../lib/images";
import {
  parseShopCategory,
  productMatchesShopCategory,
  type ShopCategoryId,
} from "../lib/shopCategory";
import { products, getFulfillmentBadge } from "../data/products";
import { useStripePricesFetchState } from "../context/useStripePricesFetchState";
import { canPurchaseSubscription } from "../lib/productPricing";
import { getOneTimePresentation } from "../lib/stripePricePresentation";
import { useProductModal } from "../context/useProductModal";
import { getProductListImage } from "../lib/productImages";
import "./ShopPage.css";

const LEGACY_FILTER_TO_CATEGORY: Record<string, ShopCategoryId> = {
  "fresh-produce": "fresh-produce",
  microgreens: "microgreens",
  seasoning: "seasoning",
  powder: "pantry-blends",
};

const CATEGORY_COPY: Record<
  ShopCategoryId,
  {
    title: string;
    intro: string;
    image: string;
    imageAlt: string;
    showContactPricing: boolean;
    showVarietyRow: boolean;
    varietyLine?: string;
    showProduceGallery: boolean;
    showMicroGallery: boolean;
    showConnect: boolean;
    /** Title + optional image only (no body copy / CTA button). */
    connectLayout?: "default" | "pink-visual";
    connectImage?: string;
    connectImageAlt?: string;
    showStrip: boolean;
    showSubscribe: boolean;
  }
> = {
  "fresh-produce": {
    title: "Fresh Produce",
    intro:
      "We supply restaurants and wholesale buyers with fresh herbs, leafy greens, and mushrooms grown for year\u2011round consistency. Everything is harvested at peak freshness, with additional items sourced from trusted partners who meet our standards.",
    image: "catalog/products/fresh-butter-lettuce.jpg",
    imageAlt: "Fresh butter lettuce from the farm",
    showContactPricing: true,
    showVarietyRow: false,
    showProduceGallery: false,
    showMicroGallery: false,
    showConnect: true,
    connectLayout: "pink-visual",
    connectImage: "shop/fresh-produce-connect-salad.png",
    connectImageAlt: "Fresh salad and produce from GROWN",
    showStrip: true,
    showSubscribe: false,
  },
  microgreens: {
    title: "Fresh Microgreens",
    intro:
      "Full trays and harvested microgreens for restaurants and home kitchens — picked for flavor, color, and nutrition.",
    image: "shop/category-microgreens.jpg",
    imageAlt: "Tray of fresh microgreens",
    showContactPricing: true,
    showVarietyRow: true,
    varietyLine:
      "Broccoli • Radish • Sunflower • Pea shoots • Basil • Cabbage • Custom",
    showProduceGallery: false,
    showMicroGallery: true,
    showConnect: false,
    showStrip: false,
    showSubscribe: false,
  },
  "pantry-blends": {
    title: "Pantry Blends",
    intro:
      "Smoothie boosters, mushroom coffee, matcha, and drink refreshers powered by spirulina, saffron, mushrooms, microgreens, and other super-ingredients crafted for everyday rituals.",
    image: "shop/category-pantry-blends.jpg",
    imageAlt: "Pantry blend jars on a counter",
    showContactPricing: false,
    showVarietyRow: false,
    showProduceGallery: false,
    showMicroGallery: false,
    showConnect: false,
    showStrip: true,
    showSubscribe: true,
  },
  seasoning: {
    title: "Pantry Microgreen Seasonings",
    intro:
      "Creative, flavorful blends with about a quarter tray of microgreens in every jar — made for finishing dishes at home or on the line.",
    image: "shop/category-seasoning.jpg",
    imageAlt: "Jars of microgreen seasonings",
    showContactPricing: false,
    showVarietyRow: false,
    showProduceGallery: false,
    showMicroGallery: false,
    showConnect: false,
    showStrip: true,
    showSubscribe: true,
  },
};

const PRODUCE_GALLERY = [
  {
    label: "Herbs",
    caption: "Basil, cilantro, parsley, mint, and more.",
    image: "catalog/produce/herbs.jpg",
    imageAlt: "Fresh basil",
  },
  {
    label: "Lettuce",
    caption: "Tender heads for plates and sandwiches.",
    image: "catalog/products/fresh-butter-lettuce.jpg",
    imageAlt: "Fresh butter lettuce",
  },
  {
    label: "Kale",
    caption: "Hearty leaves for sautés, juices, and bowls.",
    image: "catalog/produce/kale.jpg",
    imageAlt: "Fresh kale",
  },
  {
    label: "Rosemary & aromatics",
    caption: "Fragrant bunches and classic herbs for wholesale kitchens.",
    image: "catalog/produce/aromatics.jpg",
    imageAlt: "Fresh rosemary",
  },
] as const;

const MICRO_GALLERY = [
  {
    title: "Full trays",
    body: "Living trays delivered on a rhythm that matches your kitchen.",
    image: "catalog/microgreens/full-trays.jpg",
    imageAlt: "Microgreen growing tray",
  },
  {
    title: "Harvested greens",
    body: "Cut and packed for fast pickup, garnishes, and nutrition-forward plates.",
    image: "catalog/microgreens/harvested.jpg",
    imageAlt: "Harvested microgreens",
  },
  {
    title: "Restaurant & home",
    body: "Sized for line service or home cooking — ask about custom mixes.",
    image: "catalog/microgreens/restaurant-home.jpg",
    imageAlt: "Microgreens in the kitchen",
  },
] as const;

const SEASONING_WAYS_TO_USE = [
  {
    title: "Roasted Vegetables",
    body: "Toss potatoes, carrots, or squash with olive oil and a sprinkle of seasoning for a bright, herb-forward finish.",
  },
  {
    title: "Sautéed Greens",
    body: "Add to warm kale, spinach, or broccolini for clean flavor and extra nutrients.",
  },
  {
    title: "Grain Bowls",
    body: "Mix into quinoa, rice, or farro bowls to add depth without heavy sauces.",
  },
  {
    title: "Avocado Toast",
    body: "Finish with a pinch for color, crunch, and a nutrient-dense boost.",
  },
  {
    title: "Soups & Stews",
    body: "Stir in just before serving to brighten the flavor of plant-based dishes.",
  },
  {
    title: "Roasted Potatoes",
    body: "Coat crispy potatoes with your ranch, pesto, or medi-green salt for a gourmet upgrade.",
  },
] as const;

const SEASONING_WAYS_IMAGE = "home/hero-01-baked-potato-garden.png";

export function ShopPage() {
  const stripePricesState = useStripePricesFetchState();
  const { openProductById } = useProductModal();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const filterParam = searchParams.get("filter");

  useEffect(() => {
    if (!filterParam || categoryParam) return;
    const mapped = LEGACY_FILTER_TO_CATEGORY[filterParam];
    if (!mapped) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("filter");
        next.set("category", mapped);
        return next;
      },
      { replace: true },
    );
  }, [filterParam, categoryParam, setSearchParams]);

  const activeCategory = parseShopCategory(searchParams);
  const copy = activeCategory ? CATEGORY_COPY[activeCategory] : null;

  const inSection = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => productMatchesShopCategory(p, activeCategory));
  }, [activeCategory]);

  const defaultTitle = "Shop GROWN";
  const defaultLede =
    "Browse everything we offer — or jump to Fresh Produce, Microgreens, Pantry Seasonings, or Pantry Blends from the menu above.";
  const defaultImage = "shop/default.jpg";
  const defaultImageAlt = "GROWN farm products";

  const freshProduceLayout = activeCategory === "fresh-produce";
  const microgreensLayout = activeCategory === "microgreens";
  const seasoningLayout = activeCategory === "seasoning";

  return (
    <>
      <Section
        bg="white"
        className={`shop-hero${freshProduceLayout ? " shop-hero--fresh-produce" : ""}${microgreensLayout ? " shop-hero--microgreens" : ""}`}
      >
        <div className="shop-hero__inner">
          <h1 className="shop-title">{copy?.title ?? defaultTitle}</h1>
          <hr className="shop-hero__rule" />
          <p className="shop-lede shop-lede--primary">{copy?.intro ?? defaultLede}</p>
          {copy?.showVarietyRow && copy.varietyLine ? (
            <p className="shop-variety-line">{copy.varietyLine}</p>
          ) : null}
          {copy?.showContactPricing ? (
            <div className="shop-hero__cta">
              <LinkButton to="/contact" variant="primary" className="grown-btn--sharp">
                Contact for pricing
              </LinkButton>
            </div>
          ) : null}
        </div>
      </Section>

      <Section
        bg="white"
        className={`shop-feature-visual${freshProduceLayout ? " shop-feature-visual--tight" : ""}${freshProduceLayout || microgreensLayout ? " shop-feature-visual--snug-under-hero" : ""}`}
      >
        <div className="shop-feature-visual__frame">
          <img
            className="shop-feature-visual__img"
            src={siteImage(copy?.image ?? defaultImage)}
            alt={copy?.imageAlt ?? defaultImageAlt}
            loading="lazy"
            decoding="async"
            width={1600}
            height={1200}
          />
        </div>
      </Section>

      {copy?.showProduceGallery ? (
        <Section bg="white" className="shop-produce-gallery-wrap">
          <div className="shop-section-break shop-section-break--thin" aria-hidden />
          <h2 className="shop-gallery-heading">What we grow</h2>
          <div className="shop-produce-gallery">
            {PRODUCE_GALLERY.map((row) => (
              <article key={row.label} className="shop-produce-tile">
                <div className="shop-produce-tile__media">
                  <img
                    src={siteImage(row.image)}
                    alt={row.imageAlt}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={420}
                  />
                </div>
                <h3 className="shop-produce-tile__title">{row.label}</h3>
                <p className="shop-produce-tile__caption">{row.caption}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      {copy?.showMicroGallery ? (
        <Section bg="white" className="shop-micro-gallery-wrap">
          <div className="shop-section-break shop-section-break--thin" aria-hidden />
          <h2 className="shop-gallery-heading">How we pack them</h2>
          <div className="shop-micro-gallery">
            {MICRO_GALLERY.map((block) => (
              <article key={block.title} className="shop-micro-card">
                <div className="shop-micro-card__media">
                  <img
                    src={siteImage(block.image)}
                    alt={block.imageAlt}
                    loading="lazy"
                    decoding="async"
                    width={720}
                    height={480}
                  />
                </div>
                <h3 className="shop-micro-card__title">{block.title}</h3>
                <p className="shop-micro-card__body">{block.body}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <Section bg="white" className="shop-grid-section">
        <div className="shop-product-grid">
          {activeCategory && inSection.length === 0 ? (
            <p className="shop-connect__text">No products are listed in this section yet.</p>
          ) : null}
          {inSection.map((item) => (
            <ProductCard
              key={item.id}
              name={item.name}
              subtitle={item.subtitle}
              shortDescription={item.shortDescription}
              priceOneTime={getOneTimePresentation(item, stripePricesState).label}
              priceSubscription={
                canPurchaseSubscription(item) ? item.priceSubscription : null
              }
              fulfillmentBadge={getFulfillmentBadge(item)}
              imageSrc={siteImage(getProductListImage(item))}
              imageAlignTop={
                item.category === "seasoning" || item.id === "microgreens-full-tray"
              }
              onOpenDetails={() => openProductById(item.id)}
            />
          ))}
        </div>
      </Section>

      {copy?.showConnect && copy.connectLayout === "pink-visual" && copy.connectImage ? (
        <Section bg="blush" className="shop-connect shop-connect--pink">
          <h2 className="shop-connect__title shop-connect__title--solo">
            Connect with GROWN
          </h2>
          <div className="shop-connect__visual-frame">
            <img
              className="shop-connect__visual-img"
              src={siteImage(copy.connectImage)}
              alt={copy.connectImageAlt ?? "Fresh GROWN produce"}
              loading="lazy"
              decoding="async"
              width={1200}
              height={800}
            />
          </div>
        </Section>
      ) : copy?.showConnect ? (
        <Section bg="white" className="shop-connect">
          <h2 className="shop-connect__title">Connect With GROWN</h2>
          <p className="shop-connect__text">
            Reach out for wholesale orders, custom blends, or questions about what you see here.
            Available for local delivery in the West Michigan area.
          </p>
          <LinkButton to="/contact" variant="rose" className="shop-connect__btn">
            Get in touch
          </LinkButton>
        </Section>
      ) : null}

      {copy?.showStrip ? (
        <Section bg="blush" className="shop-strip">
          <h2 className="shop-strip__title">Grown locally. Delivered fresh.</h2>
          <p className="shop-strip__text">
            Hydroponic greens picked at peak nutrition—consistent quality from seed to shelf.{" "}
            {freshProduceLayout ? (
              <>
                Pricing for wholesale and restaurant orders is handled personally: open any fresh
                item for the inquiry form, or{" "}
                <Link className="shop-strip__link" to="/contact">
                  contact us
                </Link>{" "}
                directly.
              </>
            ) : (
              <>
                Pricing and subscriptions for fresh produce and microgreen trays are handled
                personally: open any fresh item for the inquiry form, or{" "}
                <Link className="shop-strip__link" to="/contact">
                  contact us
                </Link>{" "}
                directly.
              </>
            )}
          </p>
        </Section>
      ) : null}

      {seasoningLayout ? (
        <Section bg="white" className="shop-seasoning-uses">
          <h2 className="shop-seasoning-uses__title">Ways to Use Microgreen Seasonings</h2>
          <div className="shop-seasoning-uses__layout">
            <div className="shop-seasoning-uses__media">
              <img
                className="shop-seasoning-uses__img"
                src={siteImage(SEASONING_WAYS_IMAGE)}
                alt="Seasoned roasted potato dish with garden greens"
                loading="lazy"
                decoding="async"
                width={1600}
                height={1200}
              />
            </div>
            <ul className="shop-seasoning-uses__list">
              {SEASONING_WAYS_TO_USE.map((row) => (
                <li key={row.title} className="shop-seasoning-uses__item">
                  <strong className="shop-seasoning-uses__item-title">{row.title}</strong>
                  <span className="shop-seasoning-uses__item-dash"> — </span>
                  <span>{row.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {copy?.showSubscribe &&
      activeCategory !== "fresh-produce" &&
      activeCategory !== "microgreens" ? (
        <Section bg="warm" className="shop-subscribe">
          <h2 className="shop-subscribe__title">Subscribe & save</h2>
          <p className="shop-subscribe__text">
            Monthly subscriptions save 7% and include free shipping. Build a box of any three
            seasonings, or any two products from our other categories (Golden Calm and Lemon Zest are
            one-time only). Orders of $60 or more qualify for free shipping. Open any eligible
            product for one-time and subscription options.
          </p>
        </Section>
      ) : null}

      {!copy ? (
        <>
          <Section bg="white" className="shop-connect">
            <h2 className="shop-connect__title">Connect With GROWN</h2>
            <p className="shop-connect__text">
              Reach out for wholesale orders, custom blends, or questions about what you see here.
              Available for local delivery in the West Michigan area.
            </p>
            <LinkButton to="/contact" variant="rose" className="shop-connect__btn">
              Get in touch
            </LinkButton>
          </Section>

          <Section bg="blush" className="shop-strip">
            <h2 className="shop-strip__title">Grown locally. Delivered fresh.</h2>
            <p className="shop-strip__text">
              Hydroponic greens picked at peak nutrition—consistent quality from seed to shelf.
              Pricing and subscriptions for fresh produce and microgreen trays are handled
              personally: open any fresh item for the inquiry form, or{" "}
              <Link className="shop-strip__link" to="/contact">
                contact us
              </Link>{" "}
              directly.
            </p>
          </Section>

          <Section bg="warm" className="shop-subscribe">
            <h2 className="shop-subscribe__title">Subscribe & save</h2>
            <p className="shop-subscribe__text">
              Monthly subscriptions save 7% and include free shipping. Build a box of any three
              seasonings, or any two products from our other categories (Golden Calm and Lemon Zest
              are one-time only). Orders of $60 or more qualify for free shipping. Open any eligible
              product for one-time and subscription options.
            </p>
          </Section>
        </>
      ) : null}

      <Section bg="blush" className="shop-footer-message">
        <h2 className="shop-footer-message__title">Grown locally. Delivered fresh.</h2>
        <p className="shop-footer-message__text">
          Hydroponic greens picked at peak nutrition—consistent quality from seed to shelf. Pricing
          for fresh produce and microgreen trays is handled personally: open any fresh item for the
          inquiry form or{" "}
          <Link className="shop-strip__link" to="/contact">
            contact us
          </Link>{" "}
          directly. Pantry orders of $60 or more qualify for free shipping. Subscribe & Save pantry
          blend subscriptions launch August 2026—stay tuned.
        </p>
      </Section>
    </>
  );
}
