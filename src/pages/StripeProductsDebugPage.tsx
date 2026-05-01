import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "../components/sections/Section";
import {
  fetchStripeProductsDebug,
  type StripeProductsDebugSuccess,
} from "../lib/stripeDebugApi";
import "./StripeProductsDebugPage.css";

function formatMoney(
  amount: unknown,
  currency: unknown,
): string | null {
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  const c = typeof currency === "string" && currency ? currency : "usd";
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: c.toUpperCase(),
    }).format(amount / 100);
  } catch {
    return `${(amount / 100).toFixed(2)} ${c}`;
  }
}

function priceRow(p: Record<string, unknown>, key: string) {
  const id = typeof p.id === "string" ? p.id : key;
  const product =
    typeof p.product === "string"
      ? p.product
      : typeof p.product === "object" &&
          p.product !== null &&
          "id" in p.product
        ? String((p.product as { id: unknown }).id)
        : "—";
  const recurring =
    typeof p.recurring === "object" && p.recurring !== null
      ? JSON.stringify(p.recurring)
      : String(p.type ?? "—");
  const unit_amount = p.unit_amount;
  const currency = p.currency;
  const formatted = formatMoney(unit_amount, currency);
  return (
    <tr key={id}>
      <td className="stripe-debug__mono">{id}</td>
      <td className="stripe-debug__mono">{product}</td>
      <td>{formatted ?? String(unit_amount ?? "—")}</td>
      <td>{typeof currency === "string" ? currency : "—"}</td>
      <td className="stripe-debug__small">{recurring}</td>
    </tr>
  );
}

export function StripeProductsDebugPage() {
  const [state, setState] = useState<
    | { status: "idle" | "loading" }
    | { status: "ok"; data: StripeProductsDebugSuccess }
    | { status: "error"; message: string }
  >({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetchStripeProductsDebug().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setState({ status: "error", message: result.error });
        return;
      }
      setState({ status: "ok", data: result });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section bg="white" className="stripe-debug">
      <div className="grown-section__inner stripe-debug__inner">
        <header className="stripe-debug__header">
          <p className="stripe-debug__badge">Temporary · URL only · remove later</p>
          <h1 className="stripe-debug__title">Stripe products (live API)</h1>
          <p className="stripe-debug__lede">
            Active products and prices from your Stripe account via{" "}
            <code className="stripe-debug__code">GET /debug/stripe-products</code>.
            Not linked from site navigation.
          </p>
          <Link to="/" className="stripe-debug__back">
            ← Home
          </Link>
        </header>

        {(state.status === "loading" || state.status === "idle") && (
          <p className="stripe-debug__status">Loading Stripe data…</p>
        )}
        {state.status === "error" && (
          <div className="stripe-debug__panel stripe-debug__panel--error" role="alert">
            <strong>Request failed</strong>
            <p className="stripe-debug__err">{state.message}</p>
            <p className="stripe-debug__hint">
              Set <code className="stripe-debug__code">VITE_CHECKOUT_API_URL</code> to
              your API Gateway base (same as checkout), deploy the stack with the debug
              Lambda, and open this page on the deployed site.
            </p>
          </div>
        )}
        {state.status === "ok" && (
          <div className="stripe-debug__panel">
            <p className="stripe-debug__meta">
              <span className="stripe-debug__pill">
                Mode: {state.data.mode}
              </span>
              <span>
                {state.data.productCount} product
                {state.data.productCount === 1 ? "" : "s"} ·{" "}
                {state.data.priceCount} price
                {state.data.priceCount === 1 ? "" : "s"}
              </span>
              <span className="stripe-debug__muted">
                {state.data.fetchedAt}
              </span>
            </p>

            <h2 className="stripe-debug__h2">Products (active)</h2>
            <div className="stripe-debug__table-wrap">
              <table className="stripe-debug__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Default price</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.products.map(
                    (row: Record<string, unknown>, i: number) => (
                      <tr key={typeof row.id === "string" ? row.id : String(i)}>
                        <td className="stripe-debug__mono">
                          {typeof row.id === "string" ? row.id : "—"}
                        </td>
                        <td>{typeof row.name === "string" ? row.name : "—"}</td>
                        <td className="stripe-debug__mono stripe-debug__small">
                          {typeof row.default_price === "string"
                            ? row.default_price
                            : row.default_price &&
                                typeof row.default_price === "object" &&
                                row.default_price !== null &&
                                "id" in row.default_price
                              ? String(
                                  (row.default_price as { id: unknown }).id,
                                )
                              : "—"}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            <h2 className="stripe-debug__h2">Prices (active)</h2>
            <div className="stripe-debug__table-wrap">
              <table className="stripe-debug__table">
                <thead>
                  <tr>
                    <th>Price ID</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>Recurring / type</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.prices.map(
                    (p: Record<string, unknown>, i: number) =>
                      priceRow(p, String(i)),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
