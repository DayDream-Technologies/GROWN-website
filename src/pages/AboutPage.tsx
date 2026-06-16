import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { siteImage } from "../lib/images";
import "./AboutPage.css";

const whatWeGrow = [
  "Hydroponic microgreens and fresh produce grown with care.",
  "Nutrient-boosted seasonings and pantry staples made with freeze-dried greens and clean power ingredients.",
  "Ready-to-use products for busy lives: sprinkle, stir, or blend them into everyday meals.",
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
        <div className="about-hero__copy">
          <h1 className="about-title">About GROWN</h1>
          <hr className="about-title-rule" />
          <p className="about-tagline">
            Nutrient-dense food, grown with intention from seed to shelf.
          </p>
        </div>
        <div className="about-hero__media">
          <img
            className="about-hero__img"
            src={siteImage("about/washing_lettuce.jpg")}
            alt="Fresh lettuce being washed after harvest"
            decoding="async"
            fetchPriority="high"
            width={1600}
            height={1200}
          />
        </div>
      </Section>

      <Section bg="white" id="our-story" className="about-story">
        <div className="about-editorial">
          <div className="about-editorial__copy">
            <p className="about-kicker">Our story</p>
            <h2 className="about-section-title">
              We grow, preserve, and make food easier to use.
            </h2>
            <p className="about-prose">
              GROWN started with microgreens and the simple goal of preserving their
              flavor and nutrients so nothing went to waste. Freeze-dried greens found
              their first home in seasoning blends: a small pinch that adds vitamins,
              color, and flavor to everyday meals.
            </p>
            <p className="about-prose">
              From there, the work expanded into fresh produce, drink refresher powders, and
              wholesale relationships with kitchens that care about consistency.
            </p>
          </div>
          <div className="about-editorial__note">
            <p>
              Clean-grown produce, thoughtful preservation, and pantry products that
              make real food feel easy to reach for.
            </p>
          </div>
        </div>
      </Section>

      <Section bg="white" id="what-we-grow" className="about-grow">
        <div className="about-split">
          <div className="about-photo-frame">
            <img
              className="about-photo"
              src={siteImage("catalog/produce/lettuce_growing_rows.jpg")}
              alt="Rows of lettuce growing in the farm"
              loading="lazy"
              decoding="async"
              width={1200}
              height={800}
            />
          </div>
          <div className="about-split__copy">
            <p className="about-kicker">What we grow and make</p>
            <h2 className="about-section-title">Fresh greens become everyday pantry staples.</h2>
            <ul className="about-bullet-list">
              {whatWeGrow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section bg="blush" id="values" className="about-values-section">
        <p className="about-kicker about-kicker--center">Our values</p>
        <h2 className="about-section-title about-section-title--center">
          Built for food that feels clean, useful, and close to home.
        </h2>
        <hr className="about-title-rule" />
        <div className="about-values about-values--four">
          {values.map((v) => (
            <article key={v.title} className="about-value-card">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section bg="white" id="why-it-matters" className="about-kitchen">
        <div className="about-split about-split--reverse">
          <div className="about-split__copy">
            <p className="about-kicker">Why it matters</p>
            <h2 className="about-section-title">From the kitchen table outward.</h2>
            <p className="about-prose">
              You should not have to choose between convenience and quality. GROWN is
              built around the same questions we ask at home: what tastes good, what
              fuels us, and what can we keep simple?
            </p>
            <p className="about-prose">
              That mindset shapes how we grow, preserve, and share every product, from
              fresh greens for restaurants to seasonings and blends for busy kitchens.
            </p>
          </div>
          <div className="about-photo-frame about-photo-frame--portrait">
            <img
              className="about-photo"
              src={siteImage("about/founder-kitchen-seasoning.png")}
              alt="Sprinkling GROWN seasoning over a fresh meal in the kitchen"
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
            />
          </div>
        </div>
      </Section>

      <Section bg="white" id="process" className="about-process-section">
        <div className="about-process">
          <div className="about-process__text">
            <p className="about-kicker">From our farm to you</p>
            <h2 className="about-section-title">Consistent greens, handled with care.</h2>
            <p className="about-prose">
              Hydroponic growing lets us control light, water, and nutrients precisely
              so greens stay tender, vibrant, and consistent week after week.
            </p>
            <p className="about-prose">
              We harvest, pack, and deliver with minimal handling and maximum freshness.
            </p>
          </div>
          <div className="about-photo-frame">
            <img
              className="about-photo"
              src={siteImage("about/hydroponic-greens-pipes.png")}
              alt="Leafy greens growing in hydroponic channels"
              loading="lazy"
              decoding="async"
              width={1200}
              height={800}
            />
          </div>
        </div>
      </Section>

      <Section bg="blush" className="about-cta">
        <h2 className="about-cta__title">Bring GROWN home or to your business</h2>
        <div className="about-cta__actions">
          <LinkButton to="/shop?category=pantry-blends">Shop drink refresher powders</LinkButton>
          <LinkButton to="/contact">Contact Us</LinkButton>
          <LinkButton to="/shop?category=fresh-produce">
            Fresh produce & wholesale
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
