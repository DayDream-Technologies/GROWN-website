import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchSquareCatalog } from "../lib/squareApi";
import type { SquareCatalogItem } from "../types/square";
import { SquareCatalogContext } from "./squareCatalogContextInstance";

export function SquareCatalogProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SquareCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setItems(await fetchSquareCatalog());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load catalog");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      error,
      reload: load,
    }),
    [items, isLoading, error, load],
  );

  return (
    <SquareCatalogContext.Provider value={value}>
      {children}
    </SquareCatalogContext.Provider>
  );
}
