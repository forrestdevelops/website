# forrestdevelops

The forrestdevelops website — a small TypeScript + Node app (Express, server-rendered HTML, no front-end framework).

## Stack

- **Node 20+ / TypeScript** (strict, ESM)
- **Express** for routing, with `helmet` (security headers + CSP) and `compression`
- **Server-rendered views** written as typed template functions (`src/views/*.ts`) using a tiny auto-escaping `html` tag (`src/lib/html.ts`)
- **Client TS** for the store's filter/cart (`src/client/store.ts` → `public/js/store.js`)
- Plain CSS with design tokens (`public/css/site.css`) — IBM Plex Sans/Mono, dark theme, amber accent

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000 — server reloads on change, client TS rebuilds
```

Production:

```bash
npm run build      # compiles server → dist/, client → public/js/
npm start          # NODE_ENV=production node dist/server.js
```

## Routes

| Route | What |
| --- | --- |
| `/` | Home: hero, blog + channel, about, store teaser |
| `/store` | Store preview with category filter and cart counter |
| `/api/products` | Product catalog as JSON |
| `/healthz` | Health check |
| `/sitemap.xml` | Generated from the route list + `SITE_URL` |

## Layout

```
src/
  server.ts          Express app + routes
  config.ts          env config (PORT, HOST, SITE_URL)
  lib/html.ts        auto-escaping html`` template tag
  data/site.ts       site copy, links, nav  ← fill in [PLACEHOLDERS]
  data/products.ts   store catalog          ← set priceCents
  views/             layout + page templates
  client/store.ts    browser script for /store
public/
  css/site.css
  images/brand/      mark, prompt, sticker, wordmark SVGs
```

## Config

Copy `.env.example` to `.env` (or set env vars in your host):

- `PORT` (default `3000`)
- `HOST` (default `0.0.0.0`)
- `SITE_URL` — canonical URL used for meta tags and the sitemap

## To do

Placeholders still to fill in: GitHub handle, channel link, first post title, product prices, and store policies (shipping/returns/sizing).

## Deploying to Vercel

`vercel.json` pins the framework to **Express** (overriding any old Next.js preset in project settings) and runs `npm run build`.
On Vercel the app is exported as a function (`export default app` in `src/server.ts`); files in `public/` are served from the CDN.
Set `SITE_URL` in the Vercel project's environment variables once the domain is live (otherwise the production `*.vercel.app` URL is used).
