import { useContext } from "react";
import { SquareCatalogContext } from "./squareCatalogContextInstance";

export function useSquareCatalog() {
  const ctx = useContext(SquareCatalogContext);
  if (!ctx) {
    throw new Error("useSquareCatalog must be used within SquareCatalogProvider");
  }
  return ctx;
}
