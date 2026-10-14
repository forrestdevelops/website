import express from "express";
import compression from "compression";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { defaultCsp } from "./lib/csp.js";
import { stampedCsp } from "./plugins/stamped/index.js";
import { getStoreProducts } from "./plugins/stamped/catalog.js";
import { homePage } from "./views/home.js";
import { storePage } from "./views/store.js";
import { notFoundPage } from "./views/notFound.js";
import { products } from "./data/products.js";
import { posts, getPost } from "./data/posts.js";
import { blogIndexPage, postPage } from "./views/blog.js";
import { videosPage } from "./views/videos.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

// Security headers. HSTS only in production (Safari applies it to http://localhost too).
app.use((_req, res, next) => {
  res.setHeader("Content-Security-Policy", defaultCsp);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  if (config.isProd) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});
app.use(compression());

const send = (render: () => string) => (_req: express.Request, res: express.Response) => {
  res.type("html").send(render());
};

app.get("/", async (_req, res, next) => {
  try {
    res.type("html").send(homePage(await getStoreProducts()));
  } catch (err) {
    next(err);
  }
});
app.get("/store", stampedCsp, send(storePage));
app.get("/blog", send(blogIndexPage));
app.get("/blog/:slug", (req, res, next) => {
  const post = getPost(req.params.slug);
  if (!post) return next();
  res.type("html").send(postPage(post));
});
app.get("/videos", send(videosPage));

app.get("/api/products", (_req, res) => {
  res.json({ products });
});

app.get("/healthz", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/sitemap.xml", (_req, res) => {
  const urls = ["/", "/blog", ...posts.map((p) => `/blog/${p.slug}`), "/videos", "/store"];
  res.type("application/xml").send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${config.siteUrl}${u}</loc></url>`)
      .join("\n")}\n</urlset>\n`,
  );
});

// Static assets after app routes so dynamic routes (e.g. sitemap.xml) win.
app.use(
  express.static(publicDir, {
    maxAge: config.isProd ? "7d" : 0,
    extensions: ["html"],
  }),
);

app.use((req, res) => {
  res.status(404).type("html").send(notFoundPage(req.path));
});

// On Vercel the app runs as a function (default export); locally/Docker we listen on a port.
if (!process.env.VERCEL) {
  app.listen(config.port, config.host, () => {
    console.log(`forrestdevelops listening on http://localhost:${config.port}`);
  });
}

export default app;
