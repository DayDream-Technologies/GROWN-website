import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { siteImage } from "../lib/images";
import "./AboutPage.css";

const values = [
  {
    title: "Intention over hype",
    text: "We grow for flavor and nutrition—not trends that fade next season.",
  },
  {
    title: "Simplicity you can taste",
    text: "Clean processes, clear labeling, and food that fits real routines.",
  },
  {
    title: "People at the center",
    text: "From home cooks to busy kitchens, we build around how you actually eat.",
  },
] as const;

export function AboutPage() {
  return (
    <>
      <Section bg="white" className="about-hero">
        <h1 className="about-title">About GROWN</h1>
        <p className="about-tagline">
          Rooted in intention. Built for everyday life.
        </p>
      </Section>

      <Section bg="white" id="why">
        <h2 className="about-section-title">Why GROWN exists</h2>
        <div className="about-two-col">
          <div>
            <p className="about-prose">
              Started with a desire to create cleaner, more intentional food—
              microgreens and blends that earn a permanent spot in your fridge,
              not a fleeting spot on a feed.
            </p>
          </div>
          <div>
            <p className="about-prose">
              Focus on quality, simplicity, and real nutrition. Every harvest
              is handled with the same care we want around our own table.
            </p>
          </div>
        </div>
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
            <h2 className="about-subheading">Built to make healthy eating easier</h2>
            <p className="about-prose">
              You can change this to what you want—draft copy for an
              approachable founder story and farm ethos.
            </p>
          </div>
        </div>
      </Section>

      <Section bg="blush" id="values">
        <h2 className="about-section-title about-section-title--center">Values</h2>
        <div className="about-values">
          {values.map((v) => (
            <article key={v.title} className="about-value-card">
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section bg="white" id="process">
        <h2 className="about-section-title">From our farm to you</h2>
        <div className="about-process">
          <div className="about-process__text">
            <p className="about-prose">
              Hydroponic growing lets us control light, water, and nutrients
              precisely—so greens stay tender, vibrant, and consistent week
              after week.
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
          <LinkButton to="/shop">Shop for Your Home</LinkButton>
          <LinkButton to="/partner" variant="ghost">
            Partner With Us
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
