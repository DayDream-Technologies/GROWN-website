import { createContext } from "react";
import type { Product } from "../data/products";

export type ProductModalContextValue = {
  selectedProduct: Product | null;
  openProductById: (id: string) => void;
  closeProduct: () => void;
};

export const ProductModalContext =
  createContext<ProductModalContextValue | null>(null);
