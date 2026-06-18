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
import {
  getProductImageClassName,
  getProductListImage,
  isProductPackshot,
} from "../lib/productImages";
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
  }
> = {
  "fresh-produce": {
    title: "Fresh Produce",
    intro:
      "For restaurants and wholesale\n\nLeafy greens and mushrooms available in bulk. Custom orders and pricing to meet your needs.",
    image: "catalog/produce/lettuce_growing_rows.jpg",
    imageAlt: "Rows of lettuce growing in the farm",
    showContactPricing: false,
    showVarietyRow: false,
    showProduceGallery: false,
    showMicroGallery: false,
    showConnect: true,
    connectLayout: "pink-visual",
    connectImage: "catalog/produce/Salad.jpg",
    connectImageAlt: "Fresh salad with seasonal produce",
  },
  microgreens: {
    title: "Fresh Microgreens",
    intro:
      "Sold as full trays or harvested microgreens, our greens arrive either as living trays or freshly cut and packaged. You'll never have to deal with soggy, wilted store-bought microgreens again. Research shows that microgreens can contain 4 to 40 times more nutrients than their mature vegetable counterparts in certain vitamins, minerals, and antioxidants - so a little sprinkle goes a long way.",
    image: "shop/category-microgreens.jpg",
    imageAlt: "Tray of fresh microgreens",
    showContactPricing: false,
    showVarietyRow: true,
    varietyLine:
      "Broccoli | Radish | Sunflower | Pea shoots | Basil | Cabbage | Custom",
    showProduceGallery: false,
    showMicroGallery: true,
    showConnect: false,
  },
  "pantry-blends": {
    title: "Pantry Drink Refreshers",
    intro:
      "Simply mix our pure freeze-dried fruit and veggie powders with water to enjoy delicious flavors and nutritional benefits, all powered by microgreens, spirulina, mushrooms, or saffron. Our offerings include Blue Lemon Zest, Strawberry Rosé and Green Citrus Leaf (drink refresher powders), Elevated Brew (mushroom coffee) and Matcha Revival (mushroom matcha), and Golden Calm (loose leaf tea) which can be enjoyed hot or cold.",
    image: "catalog/products/spices_on_table2.jpg",
    imageAlt: "Pantry drink refresher powder jars on a counter",
    showContactPricing: false,
    showVarietyRow: false,
    showProduceGallery: false,
    showMicroGallery: false,
    showConnect: false,
  },
  seasoning: {
    title: "Pantry Microgreen Seasonings",
    intro:
      "Creative, flavorful blends made with about a quarter tray of microgreens in every jar. Perfect for busy nights, picky eaters, or anyone who wants an easy nutrition upgrade - a simple sprinkle delivers a natural boost. Freeze-dried at peak nutrition and blended with clean, everyday spices to concentrate vitamins, minerals, and antioxidants in every shake. Made with clean ingredients you can trust, so you can feel good about what you're eating.",
    image: "shop/category-seasoning.jpg",
    imageAlt: "Jars of microgreen seasonings",
    showContactPricing: false,
    showVarietyRow: false,
    showProduceGallery: false,
    showMicroGallery: false,
    showConnect: false,
  },
};

const PRODUCE_GALLERY = [
  {
    label: "Mushrooms",
    caption: "A selection of fresh mushroom varieties.",
    image: "catalog/produce/Mushrooms.jpg",
    imageAlt: "Fresh mushroom varieties",
  },
  {
    label: "Herbs",
    caption: "A variety of fresh culinary herbs.",
    image: "catalog/produce/herbs_bowl.jpg",
    imageAlt: "Fresh culinary herbs",
  },
  {
    label: "Kale & Baby Kale",
    caption: "Kale and tender baby kale options.",
    image: "catalog/produce/kale.jpg",
    imageAlt: "Fresh kale and baby kale",
  },
  {
    label: "Lettuce",
    caption: "Butter lettuce and other crisp, fresh varieties.",
    image: "catalog/produce/butter_lettuce.jpg",
    imageAlt: "Fresh lettuce varieties",
  },
] as const;

const MICRO_GALLERY = [
  {
    title: "Full trays",
    body: "Delivered as living trays that keep growing on your windowsill. Harvest a little each day for peak freshness and nutrients.",
    image: "catalog/microgreens/microgreen-trays-2.png",
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
    body: "Sized for line service or home cooking - ask about custom mixes.",
    image: "catalog/microgreens/restaurant-home.jpg",
    imageAlt: "Microgreens in the kitchen",
  },
] as const;

const MICROGREENS_USE_CASES = [
  {
    title: "Smoothies",
    body: "Add a handful for a clean, nutrient-dense boost without changing the flavor.",
  },
  {
    title: "Nutrition Boost",
    body: "Mix into bowls, eggs, or weeknight meals for extra vitamins and antioxidants.",
  },
  {
    title: "Gourmet Finish",
    body: "Elevate dishes with delicate greens that add freshness, texture, and color.",
  },
  {
    title: "Salad Garnish",
    body: "Top salads with a bright, crisp layer of microgreens for added depth.",
  },
] as const;

const MICROGREENS_USE_IMAGES = [
  {
    src: "catalog/microgreens/salad_microgreen.jpg",
    alt: "Salad topped with fresh microgreens",
  },
  {
    src: "catalog/microgreens/smoothie_microgreen.JPG",
    alt: "Green smoothie prepared with microgreens",
  },
] as const;

const SEASONING_WAYS_TO_USE = [
  {
    title: "Roasted Vegetables",
    body: "Toss potatoes, carrots, or squash with olive oil and a sprinkle of seasoning for a bright, herb-forward finish.",
  },
  {
    title: "Sauteed Greens",
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

const SEASONING_WAYS_IMAGE = "catalog/products/potato_seasoned.jpg";

const PANTRY_BENEFITS = [
  {
    title: "Spirulina - Clean Energy + Antioxidants",
    body: "A nutrient-dense blue-green algae packed with B-vitamins, iron, and antioxidants. Known for supporting natural energy and filling nutrient gaps when life gets busy.",
  },
  {
    title: "Functional Mushrooms - Focus + Steady Energy",
    body: "Lion's mane, reishi, cordyceps, and other functional mushrooms used for centuries and studied today for cognitive support, calm focus, and balanced daily energy.",
  },
  {
    title: "Microgreens - 4-40x More Nutrient Dense",
    body: "Young vegetable greens harvested at peak nutrition. Research shows they can contain 4-40x more vitamins and antioxidants than mature veggies - so even a small scoop delivers real benefits.",
  },
  {
    title: "Saffron - Mood + Emotional Well-Being",
    body: "A premium botanical long used for emotional balance and now clinically studied for supporting mood, stress resilience, and overall well-being.",
  },
] as const;

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
    const matchingProducts = products.filter((p) =>
      productMatchesShopCategory(p, activeCategory),
    );
    if (activeCategory === "microgreens") {
      return matchingProducts.filter((p) => p.id !== "microgreens-full-tray");
    }
    return matchingProducts;
  }, [activeCategory]);

  const defaultTitle = "Shop GROWN";
  const defaultLede =
    "Browse everything we offer - or jump to Fresh Produce, Microgreens, Pantry Seasonings, or Pantry Drink Refresher Powders from the menu above.";
  const defaultImage = "shop/default.jpg";
  const defaultImageAlt = "GROWN farm products";

  const freshProduceLayout = activeCategory === "fresh-produce";
  const microgreensLayout = activeCategory === "microgreens";
  const pantryBlendsLayout = activeCategory === "pantry-blends";
  const seasoningLayout = activeCategory === "seasoning";

  return (
    <>
      <Section
        bg="white"
        className={`shop-hero${freshProduceLayout ? " shop-hero--fresh-produce" : ""}${microgreensLayout ? " shop-hero--microgreens" : ""}${pantryBlendsLayout ? " shop-hero--pantry-blends" : ""}${seasoningLayout ? " shop-hero--seasoning" : ""}`}
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
        className={`shop-feature-visual${freshProduceLayout ? " shop-feature-visual--tight" : ""}${freshProduceLayout || microgreensLayout || pantryBlendsLayout || seasoningLayout ? " shop-feature-visual--snug-under-hero" : ""}`}
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

      {freshProduceLayout || microgreensLayout ? (
        <Section bg="white" className="shop-after-image-cta">
          <LinkButton to="/contact" variant="primary" className="grown-btn--sharp">
            Contact Us
          </LinkButton>
        </Section>
      ) : null}

      {pantryBlendsLayout ? (
        <Section bg="white" className="shop-pantry-benefits">
          <div className="shop-section-break shop-section-break--thin" aria-hidden />
          <div className="shop-pantry-benefits__grid">
            {PANTRY_BENEFITS.map((item) => (
              <article key={item.title} className="shop-pantry-benefit">
                <h2 className="shop-pantry-benefit__title">{item.title}</h2>
                <p className="shop-pantry-benefit__body">{item.body}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

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

      {microgreensLayout ? (
        <Section bg="white" className="shop-microgreens-uses">
          <h2 className="shop-microgreens-uses__title">How to Use Microgreens</h2>
          <div className="shop-microgreens-uses__layout">
            <div className="shop-microgreens-uses__media">
              <img
                className="shop-microgreens-uses__img"
                src={siteImage(MICROGREENS_USE_IMAGES[0].src)}
                alt={MICROGREENS_USE_IMAGES[0].alt}
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
              />
            </div>
            <ul className="shop-microgreens-uses__list">
              {MICROGREENS_USE_CASES.map((useCase) => (
                <li key={useCase.title} className="shop-microgreens-uses__item">
                  <strong className="shop-microgreens-uses__item-title">{useCase.title}</strong>
                  <span className="shop-microgreens-uses__item-dash"> - </span>
                  <span>{useCase.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      <Section bg="white" className="shop-grid-section">
        {freshProduceLayout || pantryBlendsLayout || seasoningLayout ? (
          <>
            <h2 className="shop-grid-heading">
              {pantryBlendsLayout
                ? "Shop Pantry Drink Refreshers"
                : seasoningLayout
                  ? "Pantry Microgreen Seasonings"
                  : "Shop Fresh Produce"}
            </h2>
            <hr className="shop-grid-heading__rule" />
          </>
        ) : null}
        {freshProduceLayout ? (
          <div className="shop-produce-category-grid">
            {PRODUCE_GALLERY.map((row) => (
              <article key={row.label} className="shop-produce-category-card">
                <div className="shop-produce-category-card__media">
                  <img
                    src={siteImage(row.image)}
                    alt={row.imageAlt}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={520}
                  />
                </div>
                <div className="shop-produce-category-card__body">
                  <h3 className="shop-produce-category-card__title">{row.label}</h3>
                  <p className="shop-produce-category-card__caption">{row.caption}</p>
                  <LinkButton
                    to="/contact"
                    variant="primary"
                    className="grown-btn--sharp shop-produce-category-card__btn"
                  >
                    Contact for Pricing
                  </LinkButton>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className={`shop-product-grid${seasoningLayout ? " shop-product-grid--seasoning" : ""}`}
          >
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
                servingLine={item.servingLine}
                imageSrc={siteImage(getProductListImage(item))}
                imageAlignTop={
                  item.category === "seasoning" || item.id === "microgreens-full-tray"
                }
                imageContain={isProductPackshot(item)}
                imageClassName={getProductImageClassName(item)}
                onOpenDetails={() => openProductById(item.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {copy?.showConnect && copy.connectLayout === "pink-visual" && copy.connectImage ? (
        <Section bg="blush" className="shop-connect shop-connect--pink">
          <h2 className="shop-connect__title shop-connect__title--solo">
            Always fresh, always in season
          </h2>
          <hr className="shop-connect__rule" />
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
                  <span className="shop-seasoning-uses__item-dash"> - </span>
                  <span>{row.body}</span>
                </li>
              ))}
            </ul>
          </div>
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
        </>
      ) : null}

      <Section bg="blush" className="shop-footer-message">
        <h2 className="shop-footer-message__title">Grown locally. Delivered fresh.</h2>
        <p className="shop-footer-message__text">
          Hydroponic greens picked at peak nutrition consistent quality from seed to shelf. Pricing
          for fresh produce and microgreen trays is handled personally: open any Fresh item for the
          inquiry form or{" "}
          <Link className="shop-footer-message__link" to="/contact">
            contact us
          </Link>{" "}
          directly. Pantry orders $100 or more qualify for free shipping. Subscribe & Save pantry
          blend subscriptions launch August 2026 stay tuned.
        </p>
      </Section>
    </>
  );
}
