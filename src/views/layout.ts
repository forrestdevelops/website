import { html, type SafeHtml } from "../lib/html.js";
import { nav, site } from "../data/site.js";
import { config } from "../config.js";

interface LayoutOptions {
  title?: string;
  description?: string;
  path: string;
  active?: "store" | "blog" | "videos";
  body: SafeHtml;
  headerExtra?: SafeHtml;
  scripts?: string[];
  /** Classic (non-module) scripts, loaded with defer before module scripts run. */
  classicScripts?: string[];
}

export function layout(o: LayoutOptions): string {
  const title = o.title ? `${o.title} · ${site.name}` : `${site.name} · ${site.tagline}`;
  const description = o.description ?? site.description;
  const url = `${config.siteUrl}${o.path}`;

  return (
    "<!doctype html>" +
    html`<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${config.siteUrl}/og-image.svg">
<meta name="theme-color" content="#0D1014">
<link rel="icon" href="/favicon.ico">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/css/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="/">
      <span class="brand-mark">f/d_</span>
      <span>forrest<span class="accent">develops</span></span>
    </a>
    <nav aria-label="Main" class="nav">
      ${nav.map((n) => {
        const current = "key" in n && n.key === o.active;
        return html`<a href="${n.href}" class="nav-link${current ? " is-current" : ""}"${current ? html` aria-current="page"` : ""}>${n.label}</a>`;
      })}
      ${o.headerExtra ?? html`<a class="nav-cta" href="${site.githubUrl}">GitHub ↗</a>`}
    </nav>
  </div>
</header>
<main id="main">
${o.body}
</main>
<footer class="site-footer">
  <div class="wrap footer-row mono">
    <span>© ${new Date().getFullYear()} ${site.name} · ${site.location}</span>
    <div class="footer-links">
      <a href="/">home</a>
      <a href="/blog">blog</a>
      <a href="/videos">videos</a>
      <a href="/store">store</a>
      <a href="${site.githubUrl}">github</a>
    </div>
  </div>
</footer>
${(o.classicScripts ?? []).map((s) => html`<script defer src="${s}"></script>`)}
${(o.scripts ?? []).map((s) => html`<script type="module" src="${s}"></script>`)}
</body>
</html>`.value
  );
}
