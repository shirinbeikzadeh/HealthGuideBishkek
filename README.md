# HealthGuide Bishkek

A static Vite website for health information in Bishkek. No backend, database, account, paid API or tracking is required. Search and language preferences stay in the browser. Geolocation is optional and is never sent to a server. External source links and Google Maps open external sites.

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

The included GitHub Actions workflow builds and deploys to GitHub Pages. In repository settings, choose **Pages → Build and deployment → GitHub Actions**. Push to the default branch and check the Actions run. Cloudflare Pages or Netlify can build with `npm run build` and publish `dist`; set the appropriate base path first.

## Content maintenance

All published content is in `src/data/`. The empty clinic and pharmacy directories are intentional. Do not publish a listing until a person has checked it against reliable sources and obtained permission to reuse material where necessary.

* To add a clinic, add an object to `clinics.json` with a unique `id`, `name`, `address`, `verificationStatus: "verified"`, `lastVerified` (YYYY-MM-DD), and `sources` (objects with `label` and `url`). Optional fields: `type`, `coordinates: {lat,lng}`, `phone`, `website`, `specialties`, `languages`, `prices`, `hours`, `insuranceAccepted`, `emergency`, and `mapUrl`. Include optional facts only when verified.
* Add a pharmacy to `pharmacies.json` using the same required fields. Optional fields include `phone`, `hours`, `open24Hours`, and `mapUrl`.
* Add a guide to `guides.json` with a unique ID, an existing category ID, title, summary, sections with headings and text, and authoritative sources. Add a category to `categories.json` if needed.
* Update interface dictionaries in `src/data/translations/`. Missing strings fall back to English. Medical articles are English-only and explicitly marked when another language is selected; do not claim a translation exists until it has been reviewed by a qualified translator.
* Run `npm run validate` and `npm run build` after editing. A human must verify facts and dates; validation checks structure, not truth. Review emergency numbers and insurance rules periodically and update their review dates and sources. FOMS pages currently differ on document requirements; users are directed to confirm current requirements.

## Research workflow (second phase)

Automated collection is intentionally deferred. A researcher should review approved official sources manually, respect each site's access and reuse rules, record URLs and dates, check possible duplicates and missing fields, and save proposed records separately for human review. Never add unverified candidates to published JSON. No AI key is needed.

## Current limitations

The directories are empty pending verification; no university contact is configured. Article translations and full translations of some interface text remain to be completed and reviewed. Geolocation requests permission but cannot calculate distances until verified coordinates are added. The mountain hero and category artwork are original CSS illustrations, not photographs of specific facilities.
