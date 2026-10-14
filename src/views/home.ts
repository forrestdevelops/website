import { html } from "../lib/html.js";
import { site } from "../data/site.js";
import { formatDate, posts } from "../data/posts.js";
import { videos } from "../data/videos.js";
import { layout } from "./layout.js";
import { icons } from "./icons.js";

const placeholderProduct = html`
  <div class="placeholder-card">
    <div class="placeholder-img mono">[PRODUCT IMAGE]</div>
    <div class="placeholder-row"><span>[PRODUCT NAME]</span><span class="mono muted">[PRICE]</span></div>
  </div>`;

export function homePage(): string {
  const latest = posts[0];
  const nextVideo = videos[0];
  const body = html`
<section id="top" class="wrap hero">
  <p class="eyebrow mono">$ tail -f ~/notes</p>
  <h1 class="hero-title">${site.tagline}</h1>
  <p class="hero-lede">${site.description}</p>
  <div class="btn-row">
    <a class="btn btn-primary" href="/blog">Read the blog</a>
    <a class="btn btn-ghost" href="/videos">Watch videos</a>
  </div>
</section>

<section aria-label="Channels" class="band">
  <div class="wrap channel-grid">
    <article id="blog" class="card">
      <div class="card-kicker mono">${icons.doc}<span>01 / blog</span></div>
      <h2>The Blog</h2>
      <p class="muted">Long-form posts and how-tos: OpenTelemetry pipelines, Grafana dashboards, Azure and AWS builds, and practical agentic AI.</p>
      ${latest
        ? html`<a class="latest" href="/blog/${latest.slug}"><span class="mono small dim">latest · ${formatDate(latest.date)}</span><span class="latest-title">${latest.title} →</span></a>`
        : html`<p class="mono dim small">First post coming soon</p>`}
    </article>
    <article id="videos" class="card">
      <div class="card-kicker mono">${icons.video}<span>02 / videos</span></div>
      <h2>The Channel</h2>
      <p class="muted">Screen-share walkthroughs and build videos — rack installs, Raspberry Pi projects, monitoring setups, start to finish.</p>
      <a class="latest" href="/videos"><span class="mono small dim">status: coming soon · first up</span><span class="latest-title">${nextVideo?.title ?? "First episode"} →</span></a>
    </article>
  </div>
</section>

<section id="about" class="wrap about">
  <div class="about-side">
    <p class="eyebrow mono">03 / about</p>
    <picture class="headshot">
      <source type="image/webp" srcset="/images/about/forrest-640.webp 640w, /images/about/forrest-1280.webp 1280w" sizes="320px">
      <img src="/images/about/forrest-640.jpg" srcset="/images/about/forrest-640.jpg 640w, /images/about/forrest-1280.jpg 1280w" sizes="320px" width="320" height="320" alt="Forrest, smiling, in a grey sweater over a collared shirt" loading="lazy" decoding="async">
    </picture>
  </div>
  <div class="about-main">
    <h2 class="section-title">Hi, I'm Forrest.</h2>
    <p class="muted lg">I'm a CIO based in Indianapolis. Before that I spent years as an engineer, architect and practice lead — building event-driven systems and helping teams get real visibility into what their software is doing.</p>
    <p class="muted lg">My background runs through observability and SRE — AppDynamics, Splunk, Datadog, Dynatrace — plus cloud infrastructure on Azure and AWS and, lately, agentic AI on AWS Bedrock. forrestdevelops is where I share what I learn, at work and in the homelab.</p>
    <ul class="tags mono" aria-label="Topics">
      ${site.tags.map((t) => html`<li>${t}</li>`)}
    </ul>
    <a class="btn btn-ghost mono" href="${site.githubUrl}">${icons.code}<span>github.com/${site.githubHandle}</span></a>
  </div>
</section>

<section id="store" class="band">
  <div class="wrap store-teaser">
    <div class="store-teaser-head">
      <div class="stack">
        <p class="eyebrow mono">04 / store</p>
        <h2 class="section-title">Store — coming soon</h2>
        <p class="muted">Gear, merch and downloads are on the way.</p>
        <a class="btn btn-primary btn-sm" href="/store">Preview the store →</a>
      </div>
      <span class="status mono">status: under construction</span>
    </div>
    <div class="placeholder-grid">
      ${placeholderProduct}${placeholderProduct}${placeholderProduct}
    </div>
  </div>
</section>`;

  return layout({ path: "/", body });
}
