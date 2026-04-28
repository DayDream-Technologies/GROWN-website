export type SquareCatalogItem = {
  id: string;
  itemId: string;
  name: string;
  description: string;
  amountCents: number;
  currency: string;
  imageUrls: string[];
  variationName: string | null;
};
