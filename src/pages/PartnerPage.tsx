import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { siteImage } from "../lib/images";
import "./PartnerPage.css";

const audiences = [
  {
    title: "Restaurants",
    text: "Consistent microgreens and blends for plates that need color, crunch, and nutrition.",
  },
  {
    title: "Cafés & juice bars",
    text: "Bright garnishes and smoothie-friendly greens with reliable weekly rhythm.",
  },
  {
    title: "Health-focused businesses",
    text: "Wholesale supply aligned to your quality bar and delivery windows.",
  },
] as const;

const steps = [
  { title: "Connect", body: "Tell us about your menu, volume, and schedule." },
  { title: "Customize", body: "We tailor mixes, cuts, and pack sizes to your kitchen." },
  {
    title: "Receive consistent supply",
    body: "Dependable harvests from our hydroponic farm to your door.",
  },
] as const;

export function PartnerPage() {
  return (
    <>
      <Section bg="white" className="partner-hero">
        <p className="partner-eyebrow">Partner with GROWN</p>
        <h1 className="partner-title">Reliable, nutrient-dense products</h1>
        <p className="partner-lede">
          Reliable, nutrient-dense products for restaurants and businesses.
        </p>
      </Section>

      <Section bg="blush" id="who">
        <h2 className="partner-section-heading">Who we work with</h2>
        <div className="partner-audience-grid">
          {audiences.map((item) => (
            <article key={item.title} className="partner-audience-card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section bg="white" className="partner-feature-photo">
        <div className="partner-feature-photo__inner">
          <img
            className="partner-feature-photo__img"
            src={siteImage("site/partner-hydroponic.jpg")}
            alt="Rows of leafy greens growing in an indoor hydroponic system"
            loading="lazy"
            decoding="async"
            width={1200}
            height={900}
          />
        </div>
      </Section>

      <Section bg="blush" id="how">
        <h2 className="partner-section-heading">How it works</h2>
        <ol className="partner-steps">
          {steps.map((s, i) => (
            <li key={s.title} className="partner-step">
              <span className="partner-step__index">{i + 1}</span>
              <div>
                <h3 className="partner-step__title">{s.title}</h3>
                <p className="partner-step__body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section bg="warm" className="partner-cta">
        <h2 className="partner-cta__title">Start a conversation</h2>
        <p className="partner-cta__text">
          Share a few details about your business—we typically respond within
          24 hours.
        </p>
        <LinkButton to="/contact">Connect with GROWN</LinkButton>
      </Section>
    </>
  );
}
