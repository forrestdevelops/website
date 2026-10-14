// Load .env for local dev (Node 20.12+). Hosts like Vercel inject env vars directly.
try {
  process.loadEnvFile();
} catch {
  /* no .env file: fine */
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  host: process.env.HOST ?? "0.0.0.0",
  isProd: process.env.NODE_ENV === "production",
  siteUrl: (
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
};
