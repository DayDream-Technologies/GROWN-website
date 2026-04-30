import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { ProductCard } from "../components/sections/ProductCard";
import { siteImage } from "../lib/images";
import {
  itemMatchesShopCategory,
  parseShopCategory,
  type ShopCategoryId,
} from "../lib/shopCategory";
import { useSquareCatalog } from "../context/useSquareCatalog";
import { useProductModal } from "../context/useProductModal";
import { formatUsdFromCents } from "../lib/money";
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
    searchPlaceholder: string;
    showContactPricing: boolean;
    showVarietyRow: boolean;
    varietyLine?: string;
    showProduceGallery: boolean;
    showMicroGallery: boolean;
    showConnect: boolean;
    showStrip: boolean;
    showSubscribe: boolean;
  }
> = {
  "fresh-produce": {
    title: "Fresh Produce",
    intro:
      "We supply restaurants and wholesale buyers with an array of fresh herbs, leafy greens, and mushrooms.",
    image: "site/home-produce.png",
    imageAlt: "Fresh leafy greens and produce",
    searchPlaceholder: "Search fresh produce",
    showContactPricing: true,
    showVarietyRow: false,
    showProduceGallery: true,
    showMicroGallery: false,
    showConnect: true,
    showStrip: true,
    showSubscribe: true,
  },
  microgreens: {
    title: "Fresh Microgreens",
    intro:
      "Full trays and harvested microgreens for restaurants and home kitchens — picked for flavor, color, and nutrition.",
    image: "_unpack/Fw__microgreen_pics_for_home_page/IMG_4187.jpeg",
    imageAlt: "Tray of fresh microgreens",
    searchPlaceholder: "Search microgreens",
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
      "Smoothie boosters, mushroom coffee, matcha, and drink refreshers powered by spirulina, saffron, mushrooms, microgreens, and other super-ingredients — crafted for everyday rituals.",
    image: "site/shop-powders.jpg",
    imageAlt: "Pantry blend jars on a counter",
    searchPlaceholder: "Search pantry blends",
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
    image: "site/home-seasoning.png",
    imageAlt: "Jars of microgreen seasonings",
    searchPlaceholder: "Search seasonings",
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
    image: "fresh/fresh-baby-kale.jpg",
    imageAlt: "Fresh herbs and greens",
  },
  {
    label: "Lettuce",
    caption: "Tender heads for plates and sandwiches.",
    image: "site/home-produce.png",
    imageAlt: "Leafy lettuce and greens",
  },
  {
    label: "Kale",
    caption: "Hearty leaves for sautés, juices, and bowls.",
    image: "fresh/fresh-baby-kale.jpg",
    imageAlt: "Fresh kale",
  },
  {
    label: "Mushrooms",
    caption: "Clean-grown varieties for wholesale kitchens.",
    image: "site/hero-home.png",
    imageAlt: "Fresh mushrooms",
  },
] as const;

const MICRO_GALLERY = [
  {
    title: "Full trays",
    body: "Living trays delivered on a rhythm that matches your kitchen.",
    image: "_unpack/Fw__microgreen_pics_for_home_page/IMG_4190.jpeg",
    imageAlt: "Microgreen growing tray",
  },
  {
    title: "Harvested greens",
    body: "Cut and packed for fast pickup, garnishes, and nutrition-forward plates.",
    image: "_unpack/Fw__microgreen_pics_for_home_page/IMG_4187.jpeg",
    imageAlt: "Harvested microgreens",
  },
  {
    title: "Restaurant & home",
    body: "Sized for line service or home cooking — ask about custom mixes.",
    image: "site/home-produce.png",
    imageAlt: "Microgreens in the kitchen",
  },
] as const;

export function ShopPage() {
  const { openProductById } = useProductModal();
  const { items, isLoading, error, reload } = useSquareCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
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

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (activeCategory && !itemMatchesShopCategory(item, activeCategory)) {
          return false;
        }
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }),
    [activeCategory, items, search],
  );

  const defaultTitle = "Shop GROWN";
  const defaultLede =
    "Browse everything we offer — or jump to Fresh Produce, Microgreens, Pantry Seasonings, or Pantry Blends from the menu above.";
  const defaultImage = "site/hero-home.png";
  const defaultImageAlt = "GROWN farm products";

  return (
    <>
      <div className="shop-section-break" aria-hidden />

      <Section bg="white" className="shop-hero">
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

      <Section bg="white" className="shop-feature-visual">
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

      <Section bg="white" className="shop-filters">
        <div className="shop-filter-bar" aria-label="Catalog search">
          <input
            type="search"
            className="shop-filter-bar__item shop-filter-bar__input"
            placeholder={
              copy?.searchPlaceholder ??
              (activeCategory ? "Search this category" : "Search catalog")
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
            {activeCategory && visible.length === 0 ? (
              <p className="shop-connect__text">
                No items matched this category in Square yet. Add or tag catalog items and they will
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

      {copy?.showConnect ? (
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
            Hydroponic greens picked at peak nutrition—consistent quality from seed to shelf.
            Pricing and subscriptions for fresh produce and microgreen trays are handled personally:
            open any fresh item for the inquiry form, or{" "}
            <Link className="shop-strip__link" to="/contact">
              contact us
            </Link>{" "}
            directly.
          </p>
        </Section>
      ) : null}

      {copy?.showSubscribe ? (
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
    </>
  );
}
