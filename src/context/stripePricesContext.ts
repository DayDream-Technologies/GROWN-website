import { createContext } from "react";
import type { StripePricesFetchState } from "../lib/stripePricesApi";

export const StripePricesContext =
  createContext<StripePricesFetchState | null>(null);
