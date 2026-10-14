import { html } from "../lib/html.js";
import { videos } from "../data/videos.js";
import { layout } from "./layout.js";
import { icons } from "./icons.js";

export function videosPage(): string {
  const body = html`
<section class="wrap store-hero">
  <p class="eyebrow mono">$ ls ./videos</p>
  <h1 class="store-title">The Channel</h1>
  <p class="hero-lede">Screen-share walkthroughs and build videos, start to finish. The first episodes are in production.</p>
</section>
<section class="wrap products" aria-label="Upcoming videos">
  <div class="product-grid">
    ${videos.map(
      (v) => html`
    <article class="product video-card">
      <div class="video-thumb mono" aria-hidden="true">${icons.video}<span>coming soon</span></div>
      <div class="product-body">
        <p class="product-cat mono">${v.topic}</p>
        <h2>${v.title}</h2>
        <p class="muted small">${v.description}</p>
        <div class="product-foot">
          ${v.url
            ? html`<a class="btn btn-primary btn-sm" href="${v.url}">Watch</a>`
            : html`<span class="status mono">status: coming soon</span>`}
        </div>
      </div>
    </article>`,
    )}
  </div>
</section>`;
  return layout({
    title: "Videos",
    description: "Build videos and walkthroughs from forrestdevelops. Coming soon.",
    path: "/videos",
    active: "videos",
    body,
  });
}
