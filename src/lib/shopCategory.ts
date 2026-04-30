import type { SquareCatalogItem } from "../types/square";

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

function textOf(item: SquareCatalogItem) {
  return `${item.name} ${item.description} ${item.variationName ?? ""}`.toLowerCase();
}

function isMicrogreensItem(item: SquareCatalogItem) {
  const t = textOf(item);
  return (
    t.includes("microgreen") ||
    t.includes("micro green") ||
    (t.includes("tray") && !t.includes("seasoning"))
  );
}

function isLikelyFreshProduceField(item: SquareCatalogItem) {
  const t = textOf(item);
  if (isMicrogreensItem(item)) return false;
  const keys = [
    "produce",
    "fresh",
    "lettuce",
    "kale",
    "spinach",
    "arugula",
    "basil",
    "mint",
    "cilantro",
    "parsley",
    "herb",
    "greens",
    "mushroom",
    "bulk",
    "wholesale",
    "hydroponic",
  ];
  return keys.some((k) => t.includes(k));
}

function isSeasoningItem(item: SquareCatalogItem) {
  const t = textOf(item);
  if (isMicrogreensItem(item)) return false;
  if (t.includes("smoothie") || t.includes("booster")) return false;
  if (t.includes("coffee") && (t.includes("instant") || t.includes("brew"))) {
    return false;
  }
  return (
    t.includes("seasoning") ||
    (t.includes("salt") && t.includes("microgreen")) ||
    (t.includes("salt") && t.includes("jar"))
  );
}

function isPantryBlendItem(item: SquareCatalogItem) {
  const t = textOf(item);
  if (isMicrogreensItem(item)) return false;
  if (isSeasoningItem(item)) return false;
  const keys = [
    "powder",
    "smoothie",
    "coffee",
    "matcha",
    "booster",
    "spirulina",
    "elevated brew",
    "green leaf",
    "golden calm",
    "lemon zest",
  ];
  if (t.includes("mushroom") && t.includes("coffee")) return true;
  return keys.some((k) => t.includes(k));
}

export function itemMatchesShopCategory(
  item: SquareCatalogItem,
  category: ShopCategoryId,
): boolean {
  switch (category) {
    case "fresh-produce":
      return isLikelyFreshProduceField(item);
    case "microgreens":
      return isMicrogreensItem(item);
    case "pantry-blends":
      return isPantryBlendItem(item);
    case "seasoning":
      return isSeasoningItem(item);
    default:
      return true;
  }
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
