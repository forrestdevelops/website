import { html } from "../lib/html.js";
import { formatDate, posts, readingMinutes, type Post } from "../data/posts.js";
import { site } from "../data/site.js";
import { layout } from "./layout.js";

const meta = (p: Post) =>
  html`<p class="post-meta mono"><time datetime="${p.date}">${formatDate(p.date)}</time> · ${readingMinutes(p)} min read</p>`;

const tagList = (p: Post) =>
  html`<ul class="tags mono" aria-label="Tags">${p.tags.map((t) => html`<li>${t}</li>`)}</ul>`;

export function blogIndexPage(): string {
  const body = html`
<section class="wrap store-hero">
  <p class="eyebrow mono">$ ls ./blog</p>
  <h1 class="store-title">The Blog</h1>
  <p class="hero-lede">Long-form posts and how-tos on observability, cloud, agentic AI and homelab builds.</p>
</section>
<section class="wrap post-list" aria-label="Posts">
  ${posts.map(
    (p) => html`
  <article class="post-card">
    ${meta(p)}
    <h2><a href="/blog/${p.slug}">${p.title}</a></h2>
    <p class="muted">${p.summary}</p>
    ${tagList(p)}
  </article>`,
  )}
</section>`;
  return layout({
    title: "Blog",
    description: "Posts on observability, cloud infrastructure, agentic AI and homelab builds.",
    path: "/blog",
    active: "blog",
    body,
  });
}

export function postPage(p: Post): string {
  const body = html`
<article class="wrap post">
  <header class="post-header">
    <a class="mono small back" href="/blog">← /blog</a>
    <h1 class="post-title">${p.title}</h1>
    ${meta(p)}
    ${tagList(p)}
  </header>
  <div class="prose">
    ${p.body}
  </div>
  <footer class="post-footer">
    <p class="mono small dim">Written by Forrest · <a href="${site.githubUrl}">github.com/${site.githubHandle}</a></p>
    <a class="btn btn-ghost btn-sm" href="/blog">← All posts</a>
  </footer>
</article>`;
  return layout({ title: p.title, description: p.summary, path: `/blog/${p.slug}`, active: "blog", body });
}
