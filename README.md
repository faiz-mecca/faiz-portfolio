# Faiz Mecca — Portfolio Website

Single-page portfolio for a content creator / talent / videographer / video editor.

## Current state
- `index.html` — markup; the Portfolio grid is rendered at runtime from `videos.generated.json`
- `style.css` — all styling (dark theme, gold accent #d4af37 family, matching the pricelist PDF color scheme)
- `script.js` — scroll reveal animation, nav dot active state, and Portfolio rendering (grouped by category)
- Sections: Hero, About (skill breakdown), Portfolio (real videos, 4 categories), Pricelist (matches PDF exactly)
- Copy is in English, casual tone

## Dev workflow
- `npm install` once, then `npm run dev` → live-server with live reload at http://127.0.0.1:5173
- Git initialised; commit per milestone

## Portfolio videos — how it works
- **Edit only `videos.json`** to add/remove videos. Each item: `{ "url", "caption" }` under one of the 4 categories
  (Talent, Videographer, Short Form Edit, Long Form Edit). Optional `"ar"` (`"9/16"` / `"16/9"`) overrides the auto guess.
- Run **`npm run build:videos`** — `scripts/build-videos.mjs` fetches each video's title + thumbnail across
  YouTube / TikTok / Instagram / Google Drive, downloads thumbnails into `assets/thumbs/`, and writes `videos.generated.json`.
  Build-time (not browser) because those endpoints don't send CORS headers and CDN thumbnail URLs expire.
- Per-platform notes: YouTube + TikTok via oEmbed; Instagram via og:image (needs the facebookexternalhit UA, title unavailable —
  caption is shown); Google Drive thumbnail endpoint (file must be shared "anyone with link"). Card label always uses `caption`.
- `assets/thumbs/` and `videos.generated.json` are committed so deploys need no build step / network access.

## Still needed / next steps
1. **Deployment** — publish to a real domain (Vercel or Netlify; static site, no build needed).
2. Replace placeholder footer contact with real email / WhatsApp / Instagram links.

## Design reference
- Color palette: dark background (#06080d, #0d1119), gold accent (#d4af37, #e8c468, #f3d878), card borders (#232838)
- Fonts: Bebas Neue (display/headlines), Inter (body)
- Inspiration: rockstargames.com/VI (cinematic feel) — simplified, less heavy than the reference
- Pricelist data matches uploaded PDF (Standard/Premium tiers, Extra Revision, Express addon, Monthly retainer)

