#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Paths
const publicDir = path.join(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const beerDataPath = path.join(process.cwd(), 'src', 'data', 'beer.json');
const recipeDataPath = path.join(process.cwd(), 'src', 'data', 'recipe.json');

// Read data files
const beers = JSON.parse(fs.readFileSync(beerDataPath, 'utf8'));
const recipes = JSON.parse(fs.readFileSync(recipeDataPath, 'utf8'));

// Generate sitemap XML
const generateSitemap = () => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Main pages
  xml += `  <url>\n`;
  xml += `    <loc>https://forrestdevelops.com/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;
  
  xml += `  <url>\n`;
  xml += `    <loc>https://forrestdevelops.com/beer</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
  
  xml += `  <url>\n`;
  xml += `    <loc>https://forrestdevelops.com/recipe</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
  
  // Individual beer pages
  beers.forEach(beer => {
    xml += `  <url>\n`;
    xml += `    <loc>https://forrestdevelops.com/beer/${beer.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });
  
  // Individual recipe pages
  recipes.forEach(recipe => {
    xml += `  <url>\n`;
    xml += `    <loc>https://forrestdevelops.com/recipe/${recipe.id}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += '</urlset>';
  
  return xml;
};

// Generate and write sitemap
const sitemapContent = generateSitemap();
fs.writeFileSync(sitemapPath, sitemapContent);

console.log(`✅ Sitemap generated with ${beers.length} beer pages and ${recipes.length} recipe pages`);
console.log(`📅 All dates updated to: ${currentDate}`);
console.log(`📁 Sitemap saved to: ${sitemapPath}`);
