/** Web3Forms access key — set `VITE_WEB3FORMS_ACCESS_KEY` at build time (see `.env.example`). */
export function getWeb3FormsAccessKey(): string | undefined {
  const k = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
  return typeof k === "string" && k.trim().length > 0 ? k.trim() : undefined;
}
