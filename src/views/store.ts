import { html, raw } from "../lib/html.js";
import { categories, formatPrice, products, type Product } from "../data/products.js";
import { layout } from "./layout.js";
import { icons } from "./icons.js";

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

function productCard(p: Product) {
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
      <div class="product-foot">
        <span class="mono price">${formatPrice(p.priceCents)}</span>
        <button type="button" class="btn btn-primary btn-sm" data-add="${p.id}">Add to cart</button>
      </div>
    </div>
  </article>`;
}

export function storePage(): string {
  const cartButton = html`
    <button type="button" class="cart-btn mono" aria-label="Cart, 0 items" data-cart>
      ${icons.cart}<span>cart</span><span class="cart-count" data-cart-count>0</span>
    </button>`;

  const body = html`
<section class="wrap store-hero">
  <p class="eyebrow mono">$ ls ./store</p>
  <h1 class="store-title">The Store</h1>
  <p class="hero-lede">Shirts, stickers and desk gear for people who keep the lights on. Opening soon. These are previews of the first drop.</p>
</section>

<section aria-label="Products" class="wrap products">
  <div role="group" aria-label="Filter by category" class="filters">
    ${categories.map(
      (c, i) =>
        html`<button type="button" class="pill mono" data-filter="${c}" aria-pressed="${i === 0 ? "true" : "false"}">${c}</button>`,
    )}
  </div>
  <div class="product-grid">
    ${products.map(productCard)}
  </div>
</section>

<section aria-label="Store info" class="band">
  <div class="wrap info-grid">
    <div><p class="eyebrow mono">shipping</p><p class="muted">[SHIPPING POLICY — regions, timing, cost]</p></div>
    <div><p class="eyebrow mono">returns</p><p class="muted">[RETURN POLICY]</p></div>
    <div><p class="eyebrow mono">sizing</p><p class="muted">[SIZE CHART LINK]</p></div>
  </div>
</section>`;

  return layout({
    title: "Store",
    description: "Shirts, stickers and desk gear from forrestdevelops. Opening soon.",
    path: "/store",
    active: "store",
    body,
    headerExtra: cartButton,
    scripts: ["/js/store.js"],
  });
}
