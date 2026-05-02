import { useState, type FormEvent } from "react";
import { Button } from "../components/Button";
import { LinkButton } from "../components/LinkButton";
import { Section } from "../components/sections/Section";
import { contactEmail } from "../config/contact";
import { getWeb3FormsAccessKey } from "../config/web3forms";
import "./ContactPage.css";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

export function ContactPage() {
  const accessKey = getWeb3FormsAccessKey();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const key = getWeb3FormsAccessKey();
    if (!key) {
      setStatus("error");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setStatus("submitting");

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          subject: "Contact form — GROWN website",
          name,
          email,
          message,
        }),
      });

      const data = (await res.json()) as { success?: boolean; message?: string };

      if (!res.ok || data.success === false) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Section bg="white" className="contact-hero">
        <h1 className="contact-title">Contact GROWN</h1>
        <p className="contact-lede">We&apos;d love to hear from you</p>
        <p className="contact-note">We typically respond within 24 hours</p>
      </Section>

      <Section bg="white" className="contact-body">
        <div className="contact-grid">
          {accessKey ? (
            <form
              className="contact-form"
              onSubmit={handleSubmit}
              aria-label="Contact form"
            >
              <div className="contact-field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={status === "submitting"}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={status === "submitting"}
                />
              </div>
              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  disabled={status === "submitting"}
                />
              </div>

              <Button
                type="submit"
                variant="rose"
                className="contact-form__submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Submit"}
              </Button>

              {status === "success" ? (
                <p className="contact-form__status contact-form__status--success" role="status">
                  Thanks — your message was sent. We&apos;ll get back to you soon.
                </p>
              ) : null}
              {status === "error" ? (
                <p className="contact-form__status contact-form__status--error" role="alert">
                  Something went wrong. Please try again or email us at{" "}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
                </p>
              ) : null}
            </form>
          ) : (
            <div className="contact-notice">
              <p className="contact-notice__title">Contact form unavailable</p>
              <p className="contact-notice__body">
                Add <code className="contact-notice__code">VITE_WEB3FORMS_ACCESS_KEY</code> to
                your environment at build time to enable the form. Until then, reach out at{" "}
                <a className="contact-notice__link" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          )}

          <aside className="contact-aside">
            <h2 className="contact-aside__title">Partner With GROWN</h2>
            <p className="contact-aside__text">
              Whether you&apos;re a restaurant, café, wellness team, or an individual
              looking for nutrient{'\u2011'}dense produce, we&apos;ll build a custom order that
              fits your needs.
            </p>
            <p className="contact-aside__subhead">We offer:</p>
            <ul className="contact-aside__list">
              <li>Bulk fresh produce</li>
              <li>Custom microgreen trays or harvested microgreens</li>
            </ul>
            <p className="contact-aside__text">
              Tell us what you&apos;re looking for, and we&apos;ll follow up with options,
              availability, and next steps.
            </p>
            <div className="contact-aside__meta">
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
