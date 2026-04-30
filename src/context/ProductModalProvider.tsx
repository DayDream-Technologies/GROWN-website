import { useCallback, useMemo, useState, type ReactNode } from "react";
import { products } from "../data/products";
import { ProductModalContext } from "./productModalContext";

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    if (!selectedId) return null;
    return products.find((item) => item.id === selectedId) ?? null;
  }, [selectedId]);

  const openProductById = useCallback((id: string) => {
    if (products.some((item) => item.id === id)) setSelectedId(id);
  }, []);

  const closeProduct = useCallback(() => {
    setSelectedId(null);
  }, []);

  const value = useMemo(
    () => ({
      selectedProduct,
      openProductById,
      closeProduct,
    }),
    [selectedProduct, openProductById, closeProduct],
  );

  return (
    <ProductModalContext.Provider value={value}>
      {children}
    </ProductModalContext.Provider>
  );
}
