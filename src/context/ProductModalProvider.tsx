import { useCallback, useMemo, useState, type ReactNode } from "react";
import { getProductById } from "../data/products";
import { ProductModalContext } from "./productModalContext";

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    if (!selectedId) return null;
    return getProductById(selectedId) ?? null;
  }, [selectedId]);

  const openProductById = useCallback((id: string) => {
    if (getProductById(id)) setSelectedId(id);
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
