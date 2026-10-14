import { html } from "../lib/html.js";
import { layout } from "./layout.js";

export function notFoundPage(path: string): string {
  const body = html`
<section class="wrap hero">
  <p class="eyebrow mono">$ cd ${path}</p>
  <h1 class="hero-title">404 — no such file or directory.</h1>
  <p class="hero-lede">That page doesn't exist (yet).</p>
  <div class="btn-row"><a class="btn btn-primary" href="/">Back home</a></div>
</section>`;
  return layout({ title: "Not found", path, body });
}
