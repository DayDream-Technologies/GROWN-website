import { useEffect, useState } from "react";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { BRAND_HERO_LOGO } from "../config/branding";
import { siteImage } from "../lib/images";
import "./HomePage.css";

const heroLogoPath =
  import.meta.env.VITE_HERO_LOGO?.trim() || BRAND_HERO_LOGO;

const CATEGORY_CARDS = [
  {
    title: "Fresh Produce",
    subtitle: "For restaurants and wholesale",
    detail:
      "Leafy greens, herbs & mushrooms available in bulk",
    image: "home/category-fresh-produce.png",
    imageAlt: "Fresh cilantro, lettuce, and rosemary on stone",
    href: "/shop?category=fresh-produce",
    cta: "Explore Produce",
    buttonVariant: "primary" as const,
  },
  {
    title: "Fresh Microgreens",
    subtitle: "For restaurants and home kitchens",
    detail:
      "Sold as full trays or harvested microgreens — perfect for cooking, garnishing, or everyday nutrition",
    image: "home/category-microgreens.jpg",
    imageAlt: "Tray of fresh microgreens",
    href: "/shop?category=microgreens",
    cta: "Explore Microgreens",
    buttonVariant: "maroon" as const,
  },
  {
    title: "Pantry Microgreen Seasonings",
    subtitle: "For restaurants and home kitchens",
    detail:
      "Creative, flavorful blends with about a quarter tray of microgreens in every jar",
    image: "home/category-seasoning.jpg",
    imageAlt: "Jars of microgreen seasonings",
    href: "/shop?category=seasoning",
    cta: "Explore Pantry Seasonings",
    buttonVariant: "maroon" as const,
  },
  {
    title: "Pantry Blends",
    subtitle: "For home kitchens",
    detail:
      "Smoothie boosters, mushroom coffee, matcha & drink refreshers powered by spirulina, saffron, mushrooms & microgreens",
    image: "home/category-pantry-blends.jpg",
    imageAlt: "Pantry blend jars",
    href: "/shop?category=pantry-blends",
    cta: "Explore Pantry Blends",
    buttonVariant: "maroon" as const,
  },
];

/** Hero slides — `public/images/home/hero-0{1..3}-*.png` (garden dish → tray → lifestyle). */
const HERO_IMAGE_PATHS = [
  "home/hero-01-baked-potato-garden.png",
  "home/hero-02-powders.png",
  "home/hero-03-lifestyle-garden.png",
];

const MISSION_TEXT =
  "We supply restaurants and wholesale buyers with fresh herbs, leafy greens, and mushrooms grown for year-round consistency. Everything is harvested at peak freshness, with additional items sourced from trusted partners who meet our standards.";

export function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroIndex((previousIndex) => (previousIndex + 1) % HERO_IMAGE_PATHS.length);
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Section bg="white" className="home-hero">
        <div className="home-hero__shell">
          {HERO_IMAGE_PATHS.map((imagePath, index) => (
            <img
              key={imagePath}
              className={`home-hero__bg ${index === heroIndex ? "is-active" : ""}`}
              src={siteImage(imagePath)}
              alt=""
              width={2400}
              height={1600}
              decoding="async"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
            />
          ))}
          <div className="home-hero__content">
            <h1 className="home-hero__brand">
              <span className="home-hero__logo-wrap">
                <img
                  className="home-hero__logo"
                  src={siteImage(heroLogoPath)}
                  alt="GROWN Hydroponic Farms"
                  width={380}
                  height={144}
                  decoding="async"
                  fetchPriority="high"
                />
              </span>
            </h1>
          </div>
        </div>
      </Section>

      <Section bg="warm" className="home-shelf" aria-labelledby="home-shelf-heading">
        <div className="home-shelf__break" aria-hidden />
        <h2 id="home-shelf-heading" className="home-shelf__title">
          From seed to shelf
        </h2>
        <p className="home-shelf__pipeline">grow • preserve • use</p>
        <p className="home-shelf__body">
          We grow fresh produce and microgreens, preserve excess through freeze-drying, and transform
          them into nutrient-dense pantry seasonings and blends. Our blends make everyday nutrition
          easier - sprinkle them over plain noodles for a quick boost, blend a smoothie booster when
          there's no time for veggies, or reach for our mushroom blends when you want support for
          focus and steady energy. No shortcuts, just real ingredients from our farm and a process
          you can trust.
        </p>
        <div className="home-shelf__break" aria-hidden />
      </Section>

      <Section
        bg="white"
        className="home-categories"
        aria-labelledby="home-offerings-heading"
      >
        <div className="home-mission__heading-row">
          <span className="home-mission__line" aria-hidden />
          <h2 id="home-offerings-heading" className="home-mission__title">
            Our Offerings
          </h2>
          <span className="home-mission__line" aria-hidden />
        </div>
        <div className="home-categories__grid">
          {CATEGORY_CARDS.map((c) => (
            <article key={c.href} className="home-cat-card">
              <div className="home-cat-card__media">
                <img
                  src={siteImage(c.image)}
                  alt={c.imageAlt}
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={520}
                />
              </div>
              <div className="home-cat-card__body">
                <h3 className="home-cat-card__title">{c.title}</h3>
                <p className="home-cat-card__subtitle">{c.subtitle}</p>
                <p className="home-cat-card__detail">{c.detail}</p>
                <LinkButton
                  to={c.href}
                  variant={c.buttonVariant}
                  className="grown-btn--sharp home-cat-card__btn"
                >
                  {c.cta}
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section bg="blush" className="home-mission" aria-labelledby="home-mission-heading">
        <div className="home-mission__inner">
          <div className="home-mission__heading-row">
            <span className="home-mission__line" aria-hidden />
            <h2 id="home-mission-heading" className="home-mission__title">
              Our mission
            </h2>
            <span className="home-mission__line" aria-hidden />
          </div>
          <p className="home-mission__text">{MISSION_TEXT}</p>
        </div>
      </Section>
    </>
  );
}
