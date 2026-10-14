import type { SafeHtml } from "../lib/html.js";
import { stateOfObservability2026 } from "./posts/state-of-observability-2026.js";

export interface Post {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  tags: string[];
  /** Trusted, author-written HTML. */
  body: SafeHtml;
}

/** Newest first. Add a file under src/data/posts/ and list it here. */
export const posts: Post[] = [stateOfObservability2026].sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string): Post | undefined => posts.find((p) => p.slug === slug);

export function readingMinutes(p: Post): number {
  const words = p.body.value.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
