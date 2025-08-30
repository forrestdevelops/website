#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Path to sitemap
const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');

// Read current sitemap
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

// Update all lastmod dates to current date
sitemapContent = sitemapContent.replace(
  /<lastmod>.*?<\/lastmod>/g,
  `<lastmod>${currentDate}</lastmod>`
);

// Write updated sitemap
fs.writeFileSync(sitemapPath, sitemapContent);

console.log(`✅ Sitemap updated with current date: ${currentDate}`);
