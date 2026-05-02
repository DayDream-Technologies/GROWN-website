import { useContext } from "react";
import { StripePricesContext } from "./stripePricesContext";

export function useStripePricesFetchState() {
  const ctx = useContext(StripePricesContext);
  if (!ctx) {
    throw new Error(
      "useStripePricesFetchState must be used within StripePricesProvider",
    );
  }
  return ctx;
}
