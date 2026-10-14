import express from "express";
import compression from "compression";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
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

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:"],
        scriptSrc: ["'self'"],
        // Safari applies this to http://localhost too, which breaks every asset in dev.
        upgradeInsecureRequests: config.isProd ? [] : null,
      },
    },
    // HSTS only makes sense behind real HTTPS.
    strictTransportSecurity: config.isProd,
  }),
);
app.use(compression());

const send = (render: () => string) => (_req: express.Request, res: express.Response) => {
  res.type("html").send(render());
};

app.get("/", send(homePage));
app.get("/store", send(storePage));
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

app.listen(config.port, config.host, () => {
  console.log(`forrestdevelops listening on http://localhost:${config.port}`);
});
