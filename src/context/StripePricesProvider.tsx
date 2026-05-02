import { useEffect, useState, type ReactNode } from "react";
import { isCheckoutConfigured } from "../lib/checkoutEnv";
import {
  fetchCatalogOneTimePrices,
  type StripePricesFetchState,
} from "../lib/stripePricesApi";
import { StripePricesContext } from "./stripePricesContext";

export function StripePricesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StripePricesFetchState>(() =>
    isCheckoutConfigured() ? { status: "loading" } : { status: "skipped" },
  );

  useEffect(() => {
    if (!isCheckoutConfigured()) {
      setState({ status: "skipped" });
      return;
    }

    let cancelled = false;
    setState({ status: "loading" });

    fetchCatalogOneTimePrices()
      .then((data) => {
        if (cancelled) return;
        setState({ status: "ready", prices: data.prices });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          status: "error",
          message: e instanceof Error ? e.message : String(e),
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <StripePricesContext.Provider value={state}>
      {children}
    </StripePricesContext.Provider>
  );
}
