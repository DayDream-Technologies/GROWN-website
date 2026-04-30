export type ShopCategoryId =
  | "fresh-produce"
  | "microgreens"
  | "seasoning"
  | "pantry-blends";

const LEGACY_FILTER_MAP: Record<string, ShopCategoryId> = {
  "fresh-produce": "fresh-produce",
  microgreens: "microgreens",
  seasoning: "seasoning",
  powder: "pantry-blends",
};

export function parseShopCategory(
  searchParams: URLSearchParams,
): ShopCategoryId | null {
  const raw = searchParams.get("category");
  if (raw && isShopCategoryId(raw)) {
    return raw;
  }
  const legacy = searchParams.get("filter");
  if (legacy && LEGACY_FILTER_MAP[legacy]) {
    return LEGACY_FILTER_MAP[legacy];
  }
  return null;
}

function isShopCategoryId(value: string): value is ShopCategoryId {
  return (
    value === "fresh-produce" ||
    value === "microgreens" ||
    value === "seasoning" ||
    value === "pantry-blends"
  );
}

export const SHOP_NAV_CATEGORIES: {
  id: ShopCategoryId;
  label: string;
  path: string;
}[] = [
  { id: "fresh-produce", label: "Fresh Produce", path: "/shop?category=fresh-produce" },
  { id: "microgreens", label: "Fresh Microgreens", path: "/shop?category=microgreens" },
  { id: "pantry-blends", label: "Pantry Blends", path: "/shop?category=pantry-blends" },
  {
    id: "seasoning",
    label: "Pantry Seasonings",
    path: "/shop?category=seasoning",
  },
];
