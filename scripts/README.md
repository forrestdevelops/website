# SEO Scripts

This directory contains scripts to automatically maintain your website's SEO.

## Scripts

### `generate-sitemap.js`
**Main script for builds** - Automatically generates a complete sitemap.xml with:
- Current date for all pages
- All main pages (home, beer, recipe)
- All individual beer review pages
- All individual recipe pages
- Proper priorities and change frequencies

**Usage:**
```bash
npm run generate-sitemap
```

### `update-sitemap.js`
**Legacy script** - Only updates dates in existing sitemap (kept for compatibility)

## Automatic Integration

The sitemap is automatically updated when you run:
```bash
npm run build
```

This ensures your sitemap always has fresh dates for search engines.

## Manual Updates

If you add new beers or recipes, you can manually regenerate the sitemap:
```bash
npm run generate-sitemap
```

## What Gets Updated

- **Main pages**: Weekly updates (home, beer list, recipe list)
- **Content pages**: Monthly updates (individual beers, recipes)
- **Dates**: Always current date when script runs
- **URLs**: Automatically discovered from your data files

## Benefits

✅ **Fresh SEO**: Search engines see recent activity  
✅ **Complete coverage**: All pages automatically included  
✅ **No manual work**: Runs automatically on build  
✅ **Accurate dates**: Always current when deployed
