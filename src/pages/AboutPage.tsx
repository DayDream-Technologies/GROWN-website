import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { siteImage } from "../lib/images";
import "./AboutPage.css";

const whatWeGrow = [
  "Hydroponic microgreens and fresh produce grown with care.",
  "Nutrient-boosted seasonings and pantry staples made with our freeze-dried microgreens or other clean power ingredients like saffron, spirulina, and functional mushrooms — alone or combined.",
  "Ready-to-use products for busy lives—sprinkle, stir, or blend them into breakfasts, lunches, snacks, and dinners.",
] as const;

const values = [
  {
    title: "Clean ingredients",
    text: "We grow as much as possible ourselves and source the rest from trusted, transparent suppliers.",
  },
  {
    title: "Practical nutrition",
    text: "Small, consistent additions that fit into real family routines.",
  },
  {
    title: "Sustainability",
    text: "Hydroponic growing and preserving methods that reduce waste and maximize nutrients.",
  },
  {
    title: "Community-first",
    text: "We partner with local restaurants and serve direct-to-consumer customers who care about health and flavor.",
  },
] as const;

export function AboutPage() {
  return (
    <>
      <Section bg="white" className="about-hero">
        <h1 className="about-title">About GROWN</h1>
        <p className="about-tagline">
          Nutrient-dense food, grown with intention — from seed to shelf.
        </p>
      </Section>

      <Section bg="white" id="our-story">
        <img
          className="about-story-photo"
          src={siteImage("site/about-story.jpg")}
          alt="GROWN produce and products"
          loading="lazy"
          decoding="async"
          width={1200}
          height={800}
        />
        <h2 className="about-section-title about-section-title--tight">
          Our story
        </h2>
        <p className="about-prose">
          I started by growing microgreens and freeze-drying them to preserve
          flavor and nutrients, so nothing went to waste. Those freeze-dried
          greens found their first home in seasoning blends — a pinch here and
          there that adds vitamins and flavor to everyday meals. From there we
          expanded: more produce, more clean power ingredients, and more ways to
          make wholesome eating effortless.
        </p>
      </Section>

      <Section bg="white" id="what-we-grow">
        <h2 className="about-section-title">What we grow and make</h2>
        <ul className="about-bullet-list">
          {whatWeGrow.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section bg="blush" id="values">
        <h2 className="about-section-title about-section-title--center">
          Our values
        </h2>
        <div className="about-values about-values--four">
          {values.map((v) => (
            <article key={v.title} className="about-value-card">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section bg="white" id="why-it-matters">
        <h2 className="about-section-title">Why it matters</h2>
        <p className="about-prose">
          You shouldn&apos;t have to choose between convenience and quality. Our
          products let families add meaningful nutrition to everyday meals
          without extra time or fuss—so you can feed your family well and get on
          with the rest of your day.
        </p>
      </Section>

      <Section bg="white">
        <div className="about-split">
          <img
            className="about-photo"
            src={siteImage("site/about-founder.jpg")}
            alt="Founder in a bright home kitchen with a mug"
            loading="lazy"
            decoding="async"
            width={800}
            height={1000}
          />
          <div className="about-split__copy">
            <h2 className="about-subheading">From the kitchen table outward</h2>
            <p className="about-prose">
              GROWN is built around the same questions we ask at home: what
              tastes good, what fuels us, and what can we keep simple? That
              mindset shapes how we grow, preserve, and share every product.
            </p>
          </div>
        </div>
      </Section>

      <Section bg="white" id="process">
        <h2 className="about-section-title">From our farm to you</h2>
        <div className="about-process">
          <div className="about-process__text">
            <p className="about-prose">
              Hydroponic growing lets us control light, water, and nutrients
              precisely—so greens stay tender, vibrant, and consistent week after
              week.
            </p>
            <p className="about-prose">
              Harvest, pack, and deliver with minimal handling and maximum
              freshness.
            </p>
          </div>
          <img
            className="about-photo about-photo--rounded"
            src={siteImage("site/about-freeze-dry.jpg")}
            alt="Fresh produce on trays inside a freeze dryer"
            loading="lazy"
            decoding="async"
            width={800}
            height={800}
          />
        </div>
      </Section>

      <Section bg="blush" className="about-cta">
        <h2 className="about-cta__title">Bring GROWN home or to your business</h2>
        <div className="about-cta__actions">
          <LinkButton to="/shop?category=pantry-blends">Shop pantry blends</LinkButton>
          <LinkButton to="/contact" variant="ghost">
            Contact Us
          </LinkButton>
          <LinkButton to="/shop?category=fresh-produce" variant="ghost">
            Fresh produce & wholesale
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
