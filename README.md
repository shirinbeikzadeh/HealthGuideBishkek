# HealthGuide Bishkek

A static Vite website for health information in Bishkek. No backend, database, account, paid API or tracking is required. Search and language preferences stay in the browser. Geolocation is optional; coordinates are used in the browser and are not stored. Maps use OpenStreetMap tiles, whose provider can infer the approximate viewed map area from tile requests. External source links and map links open external sites.

## Develop and test

Install Node.js 20.19+ or 22.12+, then run:

```sh
npm install
npm run dev
npm run validate
npm run build
npm run preview
```

Use the address Vite prints. The build outputs static files in `dist/`. Hash-based URLs work on static hosts without server rewrites. The Vite base path is configured for GitHub Pages at `/HealthGuideBishkek/`; change it in `vite.config.js` for a custom domain or another host.

## Deploy

GitHub Pages currently serves the repository root on `main`. After any source change, run `npm run build`, copy `dist/index.html` to the repository root and copy `dist/assets/` to the root `assets/` directory, then commit those published files with the source. The Vite configuration uses the source entry when developing or building. The included Actions workflow can also deploy the build if Pages is configured for GitHub Actions. Cloudflare Pages or Netlify can build with `npm run build` and publish `dist`; set the appropriate base path first.

## Content maintenance

All published content is in `src/data/`. The empty clinic and pharmacy directories are intentional. Do not publish a listing until a person has checked it against reliable sources and obtained permission to reuse material where necessary.

* To add a clinic, add an object to `clinics.json` with a unique `id`, `name`, `address`, `verificationStatus: "verified"`, `lastVerified` (YYYY-MM-DD), and `sources` (objects with `label` and `url`). Optional fields: `type`, `coordinates: {lat,lng}`, `phone`, `website`, `specialties`, `languages`, `prices`, `hours`, `insuranceAccepted`, `emergency`, and `mapUrl`. Include optional facts only when verified.
* Add a pharmacy to `pharmacies.json` using the same required fields. Optional fields include `phone`, `hours`, `open24Hours`, and `mapUrl`.
* Add a guide to `guides.json` with a unique ID, an existing category ID, title, summary, sections with headings and text, and authoritative sources. Add a category to `categories.json` if needed.
* Update interface dictionaries in `src/data/translations/`. Missing strings fall back to English. Medical articles are English-only and explicitly marked when another language is selected; do not claim a translation exists until it has been reviewed by a qualified translator.
* Run `npm run validate` and `npm run build` after editing. A human must verify facts and dates; validation checks structure, not truth. Review emergency numbers and insurance rules periodically and update their review dates and sources. FOMS pages currently differ on document requirements; users are directed to confirm current requirements.

## Research workflow (second phase)

Automated collection is intentionally deferred. A researcher should review approved official sources manually, respect each site's access and reuse rules, record URLs and dates, check possible duplicates and missing fields, and save proposed records separately for human review. Initial candidates are in `research/candidates.json`; they are not included in the public website. A person must approve the individual records before adding them to published JSON. No AI key is needed.

## Current limitations

The directory contains a small initial set of listings sourced from provider websites; confirm details directly before visiting. Pins are approximate address locations from OpenStreetMap, not confirmed entrances; listings without a reliable address coordinate remain list-only. Distances are straight-line estimates, not travel distances. An English-language note for the hospital is based on the UK government's October 2025 list and must be confirmed with the provider. No university contact is configured. Article translations and some interface translations remain to be completed and reviewed. The hero and topic images are AI-generated illustrations, not documentary photographs or depictions of specific facilities.
