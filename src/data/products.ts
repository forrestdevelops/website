export type ProductKind = "tee" | "sticker" | "mug";
export type Category = "Apparel" | "Stickers" | "Drinkware";

export interface Product {
  id: string;
  name: string;
  category: Category;
  kind: ProductKind;
  description: string;
  /** Optional deep link to this product on the StampedDesigner store. Falls back to the store URL. */
  url?: string;
  /** Price in cents; null until pricing is set. */
  priceCents: number | null;
  image: string;
  /** Tile + garment colors and artwork placement (percent of tile). */
  tile: string;
  garment?: string;
  seam?: string;
  artWidth: number;
  artTop: number;
}

const IMG = "/images/brand";

export const categories: Array<"All" | Category> = ["All", "Apparel", "Stickers", "Drinkware"];

export const products: Product[] = [
  {
    id: "mark-tee",
    name: "f/d_ Mark Tee",
    category: "Apparel",
    kind: "tee",
    description: "Small amber mark on the chest. Black tee.",
    priceCents: null,
    image: `${IMG}/mark.svg`,
    tile: "#252B34",
    garment: "#1A1E24",
    seam: "#3A4250",
    artWidth: 20,
    artTop: 30,
  },
  {
    id: "prompt-tee",
    name: "Terminal Prompt Tee",
    category: "Apparel",
    kind: "tee",
    description: "$ forrestdevelops, full chest print. Black tee.",
    priceCents: null,
    image: `${IMG}/prompt.svg`,
    tile: "#2E3540",
    garment: "#1A1E24",
    seam: "#3A4250",
    artWidth: 40,
    artTop: 34,
  },
  {
    id: "light-tee",
    name: "Wordmark Tee",
    category: "Apparel",
    kind: "tee",
    description: "forrestdevelops wordmark on a light heather tee.",
    priceCents: null,
    image: `${IMG}/wordmark-light.svg`,
    tile: "#C9D0DA",
    garment: "#E9ECEF",
    seam: "#B8C0CA",
    artWidth: 40,
    artTop: 32,
  },
  {
    id: "round-sticker",
    name: "Round Sticker",
    category: "Stickers",
    kind: "sticker",
    description: "Observability, cloud, AI, homelab. Laptop-lid ready.",
    priceCents: null,
    image: `${IMG}/sticker.svg`,
    tile: "#1E242C",
    artWidth: 64,
    artTop: 18,
  },
  {
    id: "mark-sticker",
    name: "f/d_ Die-cut Sticker",
    category: "Stickers",
    kind: "sticker",
    description: "The mark, die-cut. Pairs well with a rack door.",
    priceCents: null,
    image: `${IMG}/mark.svg`,
    tile: "#2A2213",
    artWidth: 52,
    artTop: 24,
  },
  {
    id: "mug",
    name: "Wordmark Mug",
    category: "Drinkware",
    kind: "mug",
    description: "For long on-call nights.",
    priceCents: null,
    image: `${IMG}/wordmark-light.svg`,
    tile: "#2E3540",
    artWidth: 42,
    artTop: 44,
  },
];

export const formatPrice = (cents: number | null): string | null =>
  cents === null ? null : `$${(cents / 100).toFixed(2)}`;
