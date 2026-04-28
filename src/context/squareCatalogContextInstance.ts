import { createContext } from "react";
import type { SquareCatalogItem } from "../types/square";

export type SquareCatalogContextValue = {
  items: SquareCatalogItem[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export const SquareCatalogContext =
  createContext<SquareCatalogContextValue | null>(null);
