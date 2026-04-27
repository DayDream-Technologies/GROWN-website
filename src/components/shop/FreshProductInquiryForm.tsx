import { useId, useState } from "react";
import { contactEmail } from "../../config/contact";
import { Button } from "../Button";
import "./FreshProductInquiryForm.css";

type Props = {
  productLabel: string;
};

export function FreshProductInquiryForm({ productLabel }: Props) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Fresh product inquiry: ${productLabel}`,
    );
    const body = encodeURIComponent(
      [
        `Product: ${productLabel}`,
        "",
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Phone: ${phone.trim() || "(not provided)"}`,
        "",
        "Notes / quantity / timing:",
        message.trim() || "(none)",
      ].join("\n"),
    );
    setSubmitted(true);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      className="fresh-inquiry"
      onSubmit={handleSubmit}
      aria-label={`Request pricing: ${productLabel}`}
    >
      <p className="fresh-inquiry__intro">
        Tell us what you need and we&apos;ll follow up with pricing and
        availability.
      </p>
      <div className="fresh-inquiry__field">
        <label htmlFor={`${formId}-name`}>Name</label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="fresh-inquiry__field">
        <label htmlFor={`${formId}-email`}>Email</label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="fresh-inquiry__field">
        <label htmlFor={`${formId}-phone`}>Phone (optional)</label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="fresh-inquiry__field">
        <label htmlFor={`${formId}-message`}>
          What are you looking for?
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          placeholder="e.g. volume, delivery timing, restaurant vs. home…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button type="submit" variant="rose" className="fresh-inquiry__submit">
        Email to request pricing
      </Button>
      {submitted ? (
        <p className="fresh-inquiry__hint" role="status">
          If your mail app didn&apos;t open, reach us at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          and mention this product.
        </p>
      ) : (
        <p className="fresh-inquiry__hint">
          Opens your email app with this information—no account required. You can
          also email{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a> directly.
        </p>
      )}
    </form>
  );
}
