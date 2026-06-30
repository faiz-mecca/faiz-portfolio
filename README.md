# Faiz Mecca — Portfolio Website

Single-page portfolio for a content creator / talent / videographer / video editor.

## Current state
- `index.html` — markup only, links to style.css and script.js
- `style.css` — all styling (dark theme, gold accent #d4af37 family, matching the pricelist PDF color scheme)
- `script.js` — scroll reveal animation + nav dot active state
- Sections built so far: Hero, About (with skill breakdown), Portfolio (placeholder masonry grid), Pricelist (matches PDF exactly)
- Copy is in English, casual tone

## Still needed / next steps
1. **Portfolio section**: replace placeholder video cards with real YouTube videos.
   - Need: list of YouTube video links/IDs
   - Want: auto-fetch real thumbnails + titles (via YouTube oEmbed or Data API) instead of manual entry
   - Masonry grid with mixed aspect ratios (16:9 long-form, 9:16 shorts) — already supported via `--ar` CSS variable per card
2. **Local dev server + live reload** for faster iteration (e.g. VS Code Live Server, or Claude Code can run one)
3. **Git version control** — init repo, commit history
4. **Deployment** — eventually publish to a real domain (Vercel/Netlify or similar)
5. Consider moving video data (titles, links, aspect ratios) into a separate `videos.json` once real videos are added, instead of hardcoding in index.html

## Design reference
- Color palette: dark background (#06080d, #0d1119), gold accent (#d4af37, #e8c468, #f3d878), card borders (#232838)
- Fonts: Bebas Neue (display/headlines), Inter (body)
- Inspiration: rockstargames.com/VI (cinematic feel) — simplified, less heavy than the reference
- Pricelist data matches uploaded PDF (Standard/Premium tiers, Extra Revision, Express addon, Monthly retainer)

