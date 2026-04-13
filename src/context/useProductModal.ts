import { useContext } from "react";
import {
  ProductModalContext,
  type ProductModalContextValue,
} from "./productModalContext";

export function useProductModal(): ProductModalContextValue {
  const ctx = useContext(ProductModalContext);
  if (!ctx) {
    throw new Error("useProductModal must be used within ProductModalProvider");
  }
  return ctx;
}
