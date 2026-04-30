import { useEffect, useState } from "react";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { siteImage } from "../lib/images";
import "./HomePage.css";

const CATEGORY_CARDS = [
  {
    title: "Fresh Produce",
    subtitle: "For restaurants and wholesale",
    detail:
      "Leafy greens, herbs & mushrooms available in bulk",
    image: "site/home-produce.png",
    imageAlt: "Fresh leafy greens",
    href: "/shop?category=fresh-produce",
    cta: "Explore Produce",
    buttonVariant: "primary" as const,
  },
  {
    title: "Fresh Microgreens",
    subtitle: "For restaurants and home kitchens",
    detail:
      "Sold as full trays or harvested microgreens — perfect for cooking, garnishing, or everyday nutrition",
    image: "_unpack/Fw__microgreen_pics_for_home_page/IMG_4187.jpeg",
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
    image: "site/home-seasoning.png",
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
    image: "site/home-pantry-blend.png",
    imageAlt: "Pantry blend jars",
    href: "/shop?category=pantry-blends",
    cta: "Explore Pantry Blends",
    buttonVariant: "maroon" as const,
  },
];

/** Potato scene, founder / coffee moment, microgreen tray — per GROWN layout brief */
const HERO_IMAGE_PATHS = [
  "site/hero-home.png",
  "_unpack/Fw__microgreen_pics_for_home_page/IMG_4190.jpeg",
  "_unpack/Fw__microgreen_pics_for_home_page/IMG_4187.jpeg",
];

const MISSION_TEXT =
  "We grow what we can in-house — hydroponic microgreens and fresh produce, and partner with local farms that share our growing philosophy for anything we don’t grow ourselves. Every ingredient is clean-grown and chosen with intention. Our blends are crafted to nourish daily life, making it easier to eat well, cook simply, and feel connected to real food again.";

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
            <h1 className="home-hero__title">From seed to shelf</h1>
            <p className="home-hero__lede">
              Nutrient-rich food, grown with intention — from our farm to your kitchen.
            </p>
          </div>
        </div>
      </Section>

      <Section bg="warm" className="home-shelf" aria-labelledby="home-shelf-heading">
        <div className="home-shelf__break" aria-hidden />
        <p className="home-shelf__eyebrow">From seed to shelf</p>
        <h2 id="home-shelf-heading" className="home-shelf__title">
          From seed to shelf
        </h2>
        <p className="home-shelf__pipeline">grow • preserve • use</p>
        <p className="home-shelf__body">
          We grow fresh produce and microgreens, preserve excess through freeze-drying, and transform
          them into nutrient-dense pantry seasonings and blends. No shortcuts — just real ingredients
          and steady craft.
        </p>
        <div className="home-shelf__break" aria-hidden />
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
      <div className="home-mission__bands" aria-hidden="true">
        <span className="home-mission__band home-mission__band--green" />
        <span className="home-mission__band home-mission__band--maroon" />
        <span className="home-mission__band home-mission__band--brown" />
      </div>
    </>
  );
}
