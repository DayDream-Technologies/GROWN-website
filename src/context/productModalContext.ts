import { createContext } from "react";
import type { SquareCatalogItem } from "../types/square";

export type ProductModalContextValue = {
  selectedProduct: SquareCatalogItem | null;
  openProductById: (id: string) => void;
  closeProduct: () => void;
};

export const ProductModalContext =
  createContext<ProductModalContextValue | null>(null);
