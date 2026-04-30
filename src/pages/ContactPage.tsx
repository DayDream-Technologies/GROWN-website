import { LinkButton } from "../components/LinkButton";
import { Button } from "../components/Button";
import { Section } from "../components/sections/Section";
import { contactEmail } from "../config/contact";
import "./ContactPage.css";

export function ContactPage() {
  return (
    <>
      <Section bg="white" className="contact-hero">
        <h1 className="contact-title">Contact GROWN</h1>
        <p className="contact-lede">We&apos;d love to hear from you</p>
        <p className="contact-note">We typically respond within 24 hours</p>
      </Section>

      <Section bg="white" className="contact-body">
        <div className="contact-grid">
          <form
            className="contact-form"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Contact form"
          >
            <div className="contact-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" />
            </div>
            <div className="contact-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="topic">Topic</label>
              <select id="topic" name="topic" defaultValue="general">
                <option value="general">General question</option>
                <option value="fresh-pricing">
                  Fresh produce &amp; microgreens pricing
                </option>
                <option value="partner">Wholesale / partner</option>
                <option value="press">Press</option>
              </select>
            </div>
            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} />
            </div>
            <Button type="submit" variant="rose" className="contact-form__submit">
              Send message
            </Button>
          </form>

          <aside className="contact-aside">
            <h2 className="contact-aside__title">Wholesale & restaurants</h2>
            <p className="contact-aside__text">
              Restaurants, cafés, and health-focused teams—tell us what you
              need and we&apos;ll follow up with options.
            </p>
            <LinkButton to="/shop?category=fresh-produce" variant="ghost">
              Fresh produce catalog
            </LinkButton>
            <div className="contact-aside__meta">
              <p>
                <strong>Email</strong>
                <br />
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
              <p>
                <strong>Farm</strong>
                <br />
                <span className="contact-muted">GROWN Hydroponic Farms</span>
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section bg="blush" className="contact-cta">
        <p className="contact-cta__text">
          Prefer to browse first? Start on the shop or read more about our
          story.
        </p>
        <div className="contact-cta__actions">
          <LinkButton to="/shop">Shop for Your Home</LinkButton>
          <LinkButton to="/about" variant="ghost">
            About GROWN
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
