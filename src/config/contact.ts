/** Inbound email for product inquiries and the contact page. Override with VITE_CONTACT_EMAIL. */
export const contactEmail: string =
  typeof import.meta.env.VITE_CONTACT_EMAIL === "string" &&
  import.meta.env.VITE_CONTACT_EMAIL.length > 0
    ? import.meta.env.VITE_CONTACT_EMAIL
    : "hello@grown.example";
