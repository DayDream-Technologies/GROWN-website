import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Section } from "../components/sections/Section";
import {
  fetchStripeProductsDebug,
  type StripeCatalogCheckRow,
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

function catalogRowStatus(row: StripeCatalogCheckRow): {
  label: string;
  variant: "pass" | "fail";
} {
  const ok =
    Boolean(row.stripeProductId) &&
    row.stripeActive === true &&
    row.oneTimeOk &&
    row.subscriptionOk &&
    row.issues.length === 0;
  return ok ? { label: "OK", variant: "pass" } : { label: "Fail", variant: "fail" };
}

export function StripeProductsDebugPage() {
  const [searchParams] = useSearchParams();
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
  }, [searchParams]);

  return (
    <Section bg="white" className="stripe-debug">
      <div className="grown-section__inner stripe-debug__inner">
        <header className="stripe-debug__header">
          <p className="stripe-debug__badge">Temporary · URL only · remove later</p>
          <h1 className="stripe-debug__title">Stripe products (live API)</h1>
          <p className="stripe-debug__lede">
            Active products and prices from your Stripe account via{" "}
            <code className="stripe-debug__code">GET /debug/stripe-products</code>,
            plus a pass/fail table for each SKU in{" "}
            <code className="stripe-debug__code">stripe-catalog.json</code> (same
            Product IDs checkout uses). Redeploy the debug Lambda after catalog
            changes. Not linked from site navigation.
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
              Add{" "}
              <code className="stripe-debug__code">
                ?checkoutApi=https://…execute-api….amazonaws.com
              </code>{" "}
              (HTTPS, no trailing slash) for a one-off test. For GitHub Pages, set
              repository variable{" "}
              <code className="stripe-debug__code">VITE_CHECKOUT_API_URL</code> on
              the <strong>production</strong> environment so the site build embeds
              it — same value as <strong>HttpApiUrl</strong> from your SAM stack.
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

            {state.data.catalogChecks && state.data.catalogChecks.length > 0 ? (
              <>
                <div
                  className={`stripe-debug__catalog-banner stripe-debug__catalog-banner--${
                    state.data.catalogAllOk ? "pass" : "fail"
                  }`}
                  role="status"
                >
                  <strong>Catalog checkout readiness</strong>
                  <span>
                    {state.data.catalogAllOk
                      ? "All mapped SKUs resolve one-time (and subscription where configured) Prices on active Stripe Products."
                      : "One or more SKUs failed verification — fix Stripe or stripe-catalog.json before relying on checkout."}
                  </span>
                </div>

                <h2 className="stripe-debug__h2">
                  Site catalog ↔ Stripe (full test)
                </h2>
                <p className="stripe-debug__catalog-note">
                  Rows mirror <code className="stripe-debug__code">stripe-catalog.json</code>{" "}
                  shipped with the debug Lambda.{" "}
                  <code className="stripe-debug__code">Resolved</code> prices use the same
                  rules as <code className="stripe-debug__code">POST /checkout/session</code>{" "}
                  when only <code className="stripe-debug__code">stripe_product_id</code> is
                  set.
                </p>
                <div className="stripe-debug__table-wrap">
                  <table className="stripe-debug__table stripe-debug__table--catalog">
                    <thead>
                      <tr>
                        <th>Internal ID</th>
                        <th>Stripe product</th>
                        <th>Name (Stripe)</th>
                        <th>One-time price</th>
                        <th>Subscription price</th>
                        <th>In list*</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.data.catalogChecks.map((row) => {
                        const st = catalogRowStatus(row);
                        const ot =
                          row.explicitOneTimePriceId ?? row.resolvedOneTimePriceId ?? "—";
                        const sub = row.expectsSubscription
                          ? row.explicitSubscriptionPriceId ??
                            row.resolvedSubscriptionPriceId ??
                            "—"
                          : "—";
                        return (
                          <tr key={row.internalId}>
                            <td className="stripe-debug__mono">{row.internalId}</td>
                            <td className="stripe-debug__mono stripe-debug__small">
                              {row.stripeProductId || "—"}
                            </td>
                            <td>{row.stripeName ?? "—"}</td>
                            <td className="stripe-debug__mono stripe-debug__small">
                              {typeof ot === "string" ? ot : "—"}
                            </td>
                            <td className="stripe-debug__mono stripe-debug__small">
                              {typeof sub === "string" ? sub : "—"}
                            </td>
                            <td>{row.inActiveProductList ? "yes" : "no"}</td>
                            <td>
                              <span
                                className={`stripe-debug__badge-cell stripe-debug__badge-cell--${st.variant}`}
                              >
                                {st.label}
                              </span>
                              {row.issues.length > 0 ? (
                                <ul className="stripe-debug__issues">
                                  {row.issues.map((msg) => (
                                    <li key={msg}>{msg}</li>
                                  ))}
                                </ul>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="stripe-debug__footnote">
                  *First 100 active products only; “no” can still be OK if the Product exists.
                </p>
              </>
            ) : (
              <p className="stripe-debug__catalog-note stripe-debug__catalog-note--warn">
                This API response has no <code className="stripe-debug__code">catalogChecks</code>
                — redeploy the Stripe SAM stack so the debug Lambda includes the latest catalog
                verifier.
              </p>
            )}

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
