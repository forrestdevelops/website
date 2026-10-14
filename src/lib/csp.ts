import { config } from "../config.js";

type Directives = Record<string, string[]>;

const base: Directives = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'self'"],
  "img-src": ["'self'", "data:", "https:"],
  "object-src": ["'none'"],
  "script-src": ["'self'"],
  "script-src-attr": ["'none'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
};

/** Build a Content-Security-Policy, optionally widening some directives. */
export function buildCsp(extra: Directives = {}): string {
  const d: Directives = { ...base };
  for (const [k, v] of Object.entries(extra)) d[k] = [...new Set([...(d[k] ?? []), ...v])];
  const parts = Object.entries(d).map(([k, v]) => `${k} ${v.join(" ")}`);
  // Safari applies this to http://localhost too, so production only.
  if (config.isProd) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

export const defaultCsp = buildCsp();
