/**
 * Stamped plugin: sells the forrest-develops store from StampedDesigner on this site.
 *
 * Same model as the StampedDesigner WordPress plugin, for a non-WordPress host:
 *  - vendored bundles in public/vendor/stamped/ (SDK `pd-sdk.iife.js` -> window.ProductDesigner,
 *    and the designer `product-designer.js`, which defines <product-designer> and <brand-store>)
 *  - the SDK's loadDesigner() injects the designer bundle (see src/client/store.ts)
 *  - a server-rendered <brand-store> element; products come from the Stamped hub, and
 *    Add to cart / Checkout hand off to stampedpromo.com (WooCommerce) via the checkout link.
 *
 * Config (env):
 *   STAMPED_API_KEY    publishable pk_ key (required to go live; never an sk_ key)
 *   STAMPED_STORE      store id under templates/ (default forrest-develops)
 *   STAMPED_BRAND      brand id to lock the store to (default forrestdevelops)
 *   STAMPED_API_URL    hub override (default: the bundle's production hub)
 *   STAMPED_SHOP_URL   WooCommerce site for cart/checkout (default https://stampedpromo.com)
 *   STAMPED_SCRIPT_URL / STAMPED_SDK_URL  load the bundles from elsewhere instead of public/vendor/stamped
 *
 * Updating the bundles: rebuild in StampedDesigner (`pnpm run wp:zip` builds both), then copy
 * apps/designer/dist/product-designer.js and packages/sdk/dist/pd-sdk.iife.js into public/vendor/stamped/.
 */
import type { RequestHandler } from "express";
import "../../config.js"; // loads .env before process.env is read below
import { html, type SafeHtml } from "../../lib/html.js";
import { buildCsp } from "../../lib/csp.js";

const env = (k: string, d = "") => (process.env[k] ?? d).trim();
const shopUrl = env("STAMPED_SHOP_URL", "https://stampedpromo.com").replace(/\/+$/, "");

export const stamped = {
  name: "Stamped",
  storeId: env("STAMPED_STORE", "forrest-develops"),
  brandId: env("STAMPED_BRAND", "forrestdevelops"),
  apiKey: env("STAMPED_API_KEY"),
  apiUrl: env("STAMPED_API_URL"),
  shopUrl,
  shopHost: shopUrl.replace(/^https?:\/\//, ""),
  cartUrl: `${shopUrl}/cart/`,
  checkoutUrl: `${shopUrl}/checkout/`,
  sdkUrl: env("STAMPED_SDK_URL", "/vendor/stamped/pd-sdk.iife.js"),
  scriptUrl: env("STAMPED_SCRIPT_URL", "/vendor/stamped/product-designer.js"),
  /** Live once a publishable key is configured. */
  get live(): boolean {
    return /^pk_/.test(this.apiKey);
  },
};

if (/^sk_/i.test(stamped.apiKey)) {
  throw new Error("STAMPED_API_KEY is a secret (sk_) key. Use the publishable pk_ key; it is printed in the page.");
}

const origin = (u: string) => (/^https?:\/\//.test(u) ? [new URL(u).origin] : []);

/** CSP for pages that host the store: the bundle calls the hub, CloudFront, Cognito and S3 from the browser. */
const csp = buildCsp({
  "script-src": [...origin(stamped.scriptUrl), ...origin(stamped.sdkUrl)],
  // The designer fetches Google Fonts CSS + files to embed them in previews and print files.
  "connect-src": [
    "'self'",
    stamped.shopUrl,
    ...origin(stamped.apiUrl),
    "https://*.cloudfront.net",
    "https://*.amazonaws.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ],
  "img-src": ["blob:", "https:"],
  "font-src": ["data:"],
  "worker-src": ["'self'", "blob:"],
});

/** Express middleware: widen the CSP on routes that render the store. */
export const stampedCsp: RequestHandler = (_req, res, next) => {
  if (stamped.live) res.setHeader("Content-Security-Policy", csp);
  next();
};

/** Classic scripts the store page needs (the SDK must be a classic script to set window.ProductDesigner). */
export const stampedScripts = (): string[] => (stamped.live ? [stamped.sdkUrl] : []);

/** The <brand-store> element, with the designer bundle URL for the client loader. */
export function brandStoreElement(): SafeHtml {
  return html`<brand-store
      data-stamped
      data-script-url="${stamped.scriptUrl}"
      store="${stamped.storeId}"
      brand="${stamped.brandId}"
      api-key="${stamped.apiKey}"
      ${stamped.apiUrl ? html`api-url="${stamped.apiUrl}"` : ""}
      cart-url="${stamped.cartUrl}"
      checkout-url="${stamped.checkoutUrl}"
      theme="dark"
      locale="en-US"
    ></brand-store>`;
}
