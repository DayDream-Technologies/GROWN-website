import { useCallback, useMemo, useState, type ReactNode } from "react";
import { useSquareCatalog } from "./useSquareCatalog";
import { ProductModalContext } from "./productModalContext";

export function ProductModalProvider({ children }: { children: ReactNode }) {
  const { items } = useSquareCatalog();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    if (!selectedId) return null;
    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  const openProductById = useCallback((id: string) => {
    if (items.some((item) => item.id === id)) setSelectedId(id);
  }, [items]);

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
