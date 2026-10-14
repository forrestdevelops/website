#!/usr/bin/env bash
# Removes the leftover T3 / Next.js files after the switch to the Express app.
# Run from the repo root:  bash scripts/remove-t3.sh
set -euo pipefail

git rm -r --quiet --ignore-unmatch \
  next.config.js .eslintrc.cjs postcss.config.cjs prettier.config.js tailwind.config.ts \
  src/pages src/components src/server/api src/utils src/env.js src/styles \
  src/data/beer.json src/data/recipe.json \
  scripts/generate-sitemap.js scripts/update-sitemap.js scripts/README.md \
  public/sitemap.xml public/images/beer public/images/recipe

rm -rf .next node_modules package-lock.json
echo "T3 files removed. Now run: npm install && npm run dev"
