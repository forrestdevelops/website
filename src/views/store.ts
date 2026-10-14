import { html, raw } from "../lib/html.js";
import { categories, products, type Product } from "../data/products.js";
import { stamped, brandStoreElement, stampedScripts } from "../plugins/stamped/index.js";
import { layout } from "./layout.js";

/* ---------- Live: the Stamped plugin's <brand-store> ---------- */

function brandStore() {
  return html`
<section aria-label="Shop" class="wrap shop">
  <div class="shop-frame">
    ${brandStoreElement()}
    <noscript><p class="muted">The store needs JavaScript. You can also shop at <a href="${stamped.shopUrl}">${stamped.shopHost}</a>.</p></noscript>
  </div>
  <p class="shop-error mono small" data-store-error hidden>The store couldn't load right now. Try refreshing, or visit <a href="${stamped.shopUrl}">${stamped.shopHost}</a>.</p>
</section>`;
}

/* ---------- Not live yet: preview of the first drop ---------- */

function productArt(p: Product) {
  if (p.kind === "tee") {
    return html`<svg aria-hidden="true" viewBox="0 0 100 100" class="garment"><path d="M31 10 L41 6 Q50 14 59 6 L69 10 L91 25 L81 41 L72 35 L72 94 L28 94 L28 35 L19 41 L9 25 Z" fill="${p.garment ?? "#1A1E24"}" stroke="${p.seam ?? "#3A4250"}" stroke-width="0.8" stroke-linejoin="round"/></svg>`;
  }
  if (p.kind === "mug") {
    return raw(
      `<svg aria-hidden="true" viewBox="0 0 100 100" class="garment mug"><path d="M76 34 h7 a10 10 0 0 1 0 28 h-7" fill="none" stroke="#C9D0DA" stroke-width="5"/><rect x="18" y="20" width="60" height="64" rx="7" fill="#F4F6F8" stroke="#C9D0DA" stroke-width="1"/></svg>`,
    );
  }
  return "";
}

function previewCard(p: Product) {
  return html`
  <article class="product" data-category="${p.category}">
    <div class="product-tile" style="background:${p.tile}">
      ${productArt(p)}
      <img src="${p.image}" alt="${p.name} artwork" loading="lazy" style="left:50%;top:${p.artTop}%;width:${p.artWidth}%">
    </div>
    <div class="product-body">
      <p class="product-cat mono">${p.category}</p>
      <h2>${p.name}</h2>
      <p class="muted small">${p.description}</p>
      <div class="product-foot"><span class="status mono">opening soon</span></div>
    </div>
  </article>`;
}

function preview() {
  return html`
<section aria-label="Preview" class="wrap products">
  <div role="group" aria-label="Filter by category" class="filters">
    ${categories.map(
      (c, i) =>
        html`<button type="button" class="pill mono" data-filter="${c}" aria-pressed="${i === 0 ? "true" : "false"}">${c}</button>`,
    )}
  </div>
  <div class="product-grid">${products.map(previewCard)}</div>
</section>`;
}

/* ---------- Page ---------- */

export function storePage(): string {
  const live = stamped.live;
  const host = stamped.shopHost;

  const body = html`
<section class="wrap store-hero">
  <p class="eyebrow mono">$ ls ./store</p>
  <h1 class="store-title">The Store</h1>
  <p class="hero-lede">${live
    ? html`Gear for people who keep the lights on. Pick a product, choose your color and size, and add a name if you want. Every piece is printed or embroidered to order by ${stamped.name}.`
    : html`Shirts, stickers and desk gear for people who keep the lights on. Opening soon. These are previews of the first drop.`}</p>
</section>

${live ? brandStore() : preview()}

<section aria-label="Store info" class="band">
  <div class="wrap info-grid">
    <div><p class="eyebrow mono">checkout</p><p class="muted">Secure checkout is handled by ${stamped.name} at ${host}. Your cart carries over when you check out.</p></div>
    <div><p class="eyebrow mono">made to order</p><p class="muted">Items are decorated when you order, then shipped by ${stamped.name}. See ${host} for shipping and return policies.</p></div>
    <div><p class="eyebrow mono">sizing</p><p class="muted">Sizes and colors for each product are shown in the store as you build your order.</p></div>
  </div>
</section>`;

  return layout({
    title: "Store",
    description: "forrestdevelops gear: apparel printed and embroidered to order by Stamped.",
    path: "/store",
    active: "store",
    body,
    headerExtra: live ? html`<a class="nav-cta" href="${stamped.cartUrl}">Cart ↗</a>` : undefined,
    classicScripts: stampedScripts(),
    scripts: ["/js/store.js"],
  });
}
