/**
 * Server-side read of the forrest-develops store's products, for showing them outside the
 * <brand-store> element (home page cards). Mirrors what <brand-store> does in the browser:
 *   1. GET {cdn}/templates/{store}/index.json        -> product ids + colours for the brand
 *   2. GET {hub}/v1/products/{id}  (Bearer pk_...)    -> name, basePrice, views, variants
 * Results are cached in memory; any failure returns [] so the page still renders.
 */
import { stamped } from "./index.js";

export interface StoreProduct {
  id: string;
  name: string;
  /** e.g. "$0.99" (blank garment price; the store shows the same "from" price). */
  priceFrom: string | null;
  image: string | null;
  color: string | null;
}

interface Money {
  amount: number;
  currency: string;
}
interface HubVariant {
  id: string;
  active?: boolean;
  attributes?: { color?: string; size?: string };
  images?: Record<string, string>;
}
interface HubProduct {
  id: string;
  name: string;
  basePrice?: Money;
  views?: { id: string; imageUrl?: string }[];
  variants?: HubVariant[];
}
interface StoreIndex {
  enabled?: boolean;
  brands?: { id: string; enabled?: boolean; products?: { id: string; colors?: string[] }[] }[];
}

const CDN = (process.env.STAMPED_FILES_CDN ?? "https://d3aequhl0f7ydo.cloudfront.net").replace(/\/+$/, "");
const HUB = (stamped.apiUrl || `${stamped.shopUrl}/wp-json/product-designer`).replace(/\/+$/, "");
const TTL_OK = 5 * 60_000;
const TTL_FAIL = 30_000;

let cache: { at: number; ttl: number; data: StoreProduct[] } | null = null;
let inflight: Promise<StoreProduct[]> | null = null;

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json", ...headers }, signal: AbortSignal.timeout(4000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

function formatMoney(m?: Money): string | null {
  if (!m || typeof m.amount !== "number") return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: m.currency || "USD" }).format(m.amount / 100);
}

/** `mockup:garment/<style>/<view>/<RRGGBB>` refs are rendered by the hub; other refs are URLs already. */
function resolveImage(ref?: string): string | null {
  if (!ref) return null;
  if (ref.startsWith("mockup:")) {
    return `${HUB}/v1/mockups/${ref.slice("mockup:".length)}.svg?key=${encodeURIComponent(stamped.apiKey)}`;
  }
  return /^https?:\/\//.test(ref) ? ref : null;
}

function pickImage(p: HubProduct, color?: string): string | null {
  const variants = (p.variants ?? []).filter((v) => v.active !== false);
  const wanted = color?.toLowerCase();
  const variant = variants.find((v) => v.attributes?.color?.toLowerCase() === wanted) ?? variants[0];
  const view = p.views?.[0];
  if (!view) return null;
  return resolveImage(variant?.images?.[view.id] ?? view.imageUrl);
}

async function load(): Promise<StoreProduct[]> {
  const index = await getJson<StoreIndex>(`${CDN}/templates/${encodeURIComponent(stamped.storeId)}/index.json`);
  if (index.enabled === false) return [];
  const brand = index.brands?.find((b) => b.id === stamped.brandId && b.enabled !== false);
  const listed = brand?.products ?? [];
  const auth = { Authorization: `Bearer ${stamped.apiKey}` };
  const results = await Promise.allSettled(
    listed.map(async (item) => {
      const p = await getJson<HubProduct>(`${HUB}/v1/products/${encodeURIComponent(item.id)}`, auth);
      const color = item.colors?.[0] ?? null;
      return { id: p.id ?? item.id, name: p.name, priceFrom: formatMoney(p.basePrice), image: pickImage(p, color ?? undefined), color };
    }),
  );
  // Products removed from the catalogue (404) are skipped, like the store does.
  return results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
}

/** The store's products, cached. Never throws. */
export async function getStoreProducts(): Promise<StoreProduct[]> {
  if (!stamped.live) return [];
  if (cache && Date.now() - cache.at < cache.ttl) return cache.data;
  inflight ??= load()
    .then((data) => {
      cache = { at: Date.now(), ttl: data.length ? TTL_OK : TTL_FAIL, data };
      return data;
    })
    .catch((err: unknown) => {
      console.warn("[stamped] could not load store products:", err instanceof Error ? err.message : err);
      cache = { at: Date.now(), ttl: TTL_FAIL, data: cache?.data ?? [] };
      return cache.data;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
