import { useEffect, useState } from "react";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { siteImage } from "../lib/images";
import "./HomePage.css";

const CATEGORY_CARDS = [
  {
    title: "Fresh Produce (Bulk)",
    subtitle: "Local restaurants",
    image: "site/home-produce.png",
    imageAlt: "Fresh leafy greens",
    href: "/shop?filter=fresh-produce",
    cta: "Explore produce",
    buttonVariant: "primary" as const,
  },
  {
    title: "Fresh Microgreens",
    subtitle: "For local restaurants & home kitchens",
    image: "_unpack/Fw__microgreen_pics_for_home_page/IMG_4187.jpeg",
    imageAlt: "Tray of fresh microgreens",
    href: "/shop?filter=microgreens",
    cta: "Explore microgreens",
    buttonVariant: "maroon" as const,
  },
  {
    title: "Microgreen Seasonings",
    subtitle: "For home kitchens & wholesale",
    image: "site/home-seasoning.png",
    imageAlt: "Jars of microgreen seasonings",
    href: "/shop?filter=seasoning",
    cta: "Explore seasonings",
    buttonVariant: "maroon" as const,
  },
  {
    title: "Pantry Blends",
    subtitle: "For boosting drinks in home kitchens",
    image: "site/home-pantry-blend.png",
    imageAlt: "Pantry blend jars",
    href: "/shop?filter=powder",
    cta: "Explore pantry blends",
    buttonVariant: "maroon" as const,
  },
];

const HERO_IMAGE_PATHS = [
  "site/hero-home.png",
  "_unpack/Fw__microgreen_pics_for_home_page/IMG_4190.jpeg",
  "fresh/fresh-baby-kale.jpg",
  "products/medi-green-salt.jpg",
  "site/shop-powders.jpg",
];

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
          <div className="home-hero__scrim" aria-hidden />
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              Nutrient-rich food, grown with intention — from seed to spice
            </h1>
            <p className="home-hero__lede">
              Microgreens, pantry blends, and nutrient-dense blends designed for
              everyday life.
            </p>
          </div>
        </div>
      </Section>

      <Section bg="white" className="home-ribbon" aria-labelledby="home-ribbon-heading">
        <div className="home-ribbon__row">
          <span className="home-ribbon__line" aria-hidden />
          <h2 id="home-ribbon-heading" className="home-ribbon__title">
            From seed to spice
          </h2>
          <span className="home-ribbon__line" aria-hidden />
        </div>
        <p className="home-ribbon__pipeline">grow → preserve → use</p>
      </Section>

      <Section bg="white" className="home-categories">
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
          <blockquote className="home-mission__quote">
            At GROWN, we believe food should be simple, intentional, and deeply
            nourishing. We grow with care, preserve with purpose, and craft blends
            that support everyday life — without the noise, without chasing
            trends, and without compromise. From seed to spice, our work is rooted
            in quality, transparency, and the belief that nutrition should feel
            natural.
          </blockquote>
        </div>
      </Section>
      <div className="home-mission__bands" aria-hidden="true">
        <span className="home-mission__band home-mission__band--green" />
        <span className="home-mission__band home-mission__band--maroon" />
        <span className="home-mission__band home-mission__band--brown" />
      </div>
    </>
  );
}
