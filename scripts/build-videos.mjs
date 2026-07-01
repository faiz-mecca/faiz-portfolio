#!/usr/bin/env node
/**
 * build-videos.mjs
 * Reads videos.json (the source list you edit), fetches each video's title and
 * thumbnail across YouTube / TikTok / Instagram / Google Drive, downloads the
 * thumbnails locally, and writes videos.generated.json which the site renders.
 *
 * Run: npm run build:videos
 *
 * Why build-time (not in the browser): the oEmbed/page endpoints don't send CORS
 * headers, and the CDN thumbnail URLs expire. Fetching here and saving the images
 * locally keeps the deployed site 100% static, fast, and host-agnostic.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THUMB_DIR = path.join(ROOT, 'assets', 'thumbs');
const VIDEO_DIR = path.join(ROOT, 'assets', 'videos');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';
// Instagram strips og:* tags for browser-like UAs; it only serves them to crawlers.
const FB_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

const decodeEntities = (s = '') =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Figure out platform + a stable id + the canonical watch/open link. */
function parseUrl(raw) {
  const url = raw.trim();
  let m;
  if ((m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/)))
    return { platform: 'youtube', id: m[1], link: `https://www.youtube.com/watch?v=${m[1]}`, label: 'YouTube' };
  if ((m = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)))
    return { platform: 'tiktok', id: m[1], link: url.split('?')[0], label: 'TikTok' };
  if ((m = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/)))
    return { platform: 'instagram', id: m[1], link: `https://www.instagram.com/reel/${m[1]}/`, label: 'Reels' };
  if ((m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)))
    return { platform: 'drive', id: m[1], link: url.split('?')[0], label: 'Video' };
  return { platform: 'unknown', id: encodeURIComponent(url).slice(0, 24), link: url, label: 'Watch' };
}

async function fetchText(url, ua = UA) {
  const res = await fetch(url, { headers: { 'User-Agent': ua, 'Accept-Language': 'en;q=0.9' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}
async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

/** Resolve { title, thumbUrl } for a parsed video, per platform. */
async function resolveMeta({ platform, id, link }) {
  if (platform === 'youtube') {
    const o = await fetchJson(`https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${id}`);
    return { title: o.title, thumbUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` };
  }
  if (platform === 'tiktok') {
    const o = await fetchJson(`https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`);
    return { title: o.title, thumbUrl: o.thumbnail_url };
  }
  if (platform === 'drive') {
    let title = '';
    try {
      const html = await fetchText(`https://drive.google.com/file/d/${id}/view`);
      const m = html.match(/<meta property="og:title" content="([^"]*)"/);
      title = m ? decodeEntities(m[1]).replace(/\.(mp4|mov|mkv|webm|avi)$/i, '') : '';
    } catch { /* title is optional; caption is shown anyway */ }
    return { title, thumbUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w1000` };
  }
  if (platform === 'instagram') {
    const html = await fetchText(link, FB_UA);
    const img = html.match(/property="og:image"\s+content="([^"]*)"/) || html.match(/content="([^"]*)"\s+property="og:image"/);
    return { title: '', thumbUrl: img ? decodeEntities(img[1]) : '' };
  }
  return { title: '', thumbUrl: '' };
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://www.google.com/' }, redirect: 'follow' });
  if (!res.ok) throw new Error(`thumb HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error(`thumb too small (${buf.length}b) — likely blocked/placeholder`);
  await writeFile(dest, buf);
  return buf.length;
}

/**
 * Google Drive serves an HTML "can't scan for viruses" confirmation page instead of
 * the file for some videos. Self-hosting (rather than the /preview iframe) is what
 * lets us fully control composition and controls, so we try a couple of URL forms
 * and bail out to the iframe embed if Drive won't hand over raw video bytes.
 */
async function downloadDriveVideo(id, dest) {
  const urls = [
    `https://drive.google.com/uc?export=download&id=${id}`,
    `https://drive.google.com/uc?export=download&confirm=t&id=${id}`,
  ];
  for (const url of urls) {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://drive.google.com/' }, redirect: 'follow' });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.startsWith('video/')) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 10240) throw new Error(`video too small (${buf.length}b) — likely blocked`);
      await writeFile(dest, buf);
      return buf.length;
    }
  }
  throw new Error('drive would not serve raw video (too large / confirm page)');
}

const inferAr = (platform, override) => override || (platform === 'tiktok' || platform === 'instagram' ? '9/16' : '16/9');

/** Inline-player (iframe) URL per platform. All four verified embeddable. */
function buildEmbed({ platform, id }) {
  if (platform === 'youtube') return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  // player/v1 = clean video-only player (no profile/likes/comments UI)
  if (platform === 'tiktok') return `https://www.tiktok.com/player/v1/${id}?autoplay=1&music_info=0&description=0&controls=1&rel=0&native_context_menu=0`;
  if (platform === 'instagram') return `https://www.instagram.com/reel/${id}/embed/`;
  if (platform === 'drive') return `https://drive.google.com/file/d/${id}/preview`;
  return '';
}

/** Self-host Drive videos so the site never depends on Google's own preview UI (no
 *  composition quirks, no "open in Drive" affordance). Falls back to the iframe
 *  embed if Drive won't serve raw bytes. */
async function resolveDriveFile(info, existingFile, caption) {
  if (existingFile) return existingFile;
  if (info.platform !== 'drive') return '';
  const rel = `assets/videos/drive-${info.id}.mp4`;
  const dest = path.join(ROOT, rel);
  if (existsSync(dest)) return rel;
  try {
    const bytes = await downloadDriveVideo(info.id, dest);
    console.log(`  ok   [drive-video] ${caption} — ${(bytes / 1024 / 1024).toFixed(1)}mb`);
    return rel;
  } catch (e) {
    console.warn(`  WARN [drive-video] ${caption} — ${e.message} (falling back to Drive iframe)`);
    return '';
  }
}

async function main() {
  await mkdir(THUMB_DIR, { recursive: true });
  await mkdir(VIDEO_DIR, { recursive: true });
  const source = JSON.parse(await readFile(path.join(ROOT, 'videos.json'), 'utf8'));
  const out = { generatedAt: new Date().toISOString(), categories: [] };
  let ok = 0, warn = 0;

  for (const cat of source.categories) {
    const items = [];
    for (const v of cat.videos) {
      // Pair entry (urls array) — produces one item with a nested `videos` array
      if (Array.isArray(v.urls)) {
        const videos = [];
        for (const rawUrl of v.urls) {
          const info = parseUrl(rawUrl);
          const rel = `assets/thumbs/${info.platform}-${info.id}.jpg`;
          const dest = path.join(ROOT, rel);
          let thumbOk = false;
          try {
            const meta = await resolveMeta(info);
            if (meta.thumbUrl) {
              const bytes = await download(meta.thumbUrl, dest);
              thumbOk = true;
              console.log(`  ok   [${info.platform}] ${v.caption} — ${(bytes / 1024).toFixed(0)}kb`);
            } else throw new Error('no thumbnail url');
            ok++;
          } catch (e) {
            warn++;
            if (existsSync(dest)) { thumbOk = true; console.warn(`  keep [${info.platform}] ${v.caption} — reusing cached thumb (${e.message})`); }
            else console.warn(`  WARN [${info.platform}] ${v.caption} — ${e.message} (card will use gradient fallback)`);
          }
          const file = await resolveDriveFile(info, v.file, v.caption);
          videos.push({
            platform: info.platform,
            platformLabel: info.label,
            link: file ? '' : info.link,
            embed: file ? '' : buildEmbed(info),
            file,
            thumb: thumbOk ? rel : '',
            ar: inferAr(info.platform, v.ar),
          });
        }
        items.push({
          caption: v.caption,
          description: v.description || '',
          description_id: v.description_id || '',
          source: v.source || '',
          tier: v.tier || '',
          videos,                          // paired thumbnails rendered side-by-side
        });
        continue;
      }

      // Single entry (existing behaviour)
      const info = parseUrl(v.url);
      const rel = `assets/thumbs/${info.platform}-${info.id}.jpg`;
      const dest = path.join(ROOT, rel);
      let title = '', thumbOk = false;
      try {
        const meta = await resolveMeta(info);
        title = meta.title || '';
        if (meta.thumbUrl) {
          const bytes = await download(meta.thumbUrl, dest);
          thumbOk = true;
          console.log(`  ok   [${info.platform}] ${v.caption} — ${(bytes / 1024).toFixed(0)}kb`);
        } else throw new Error('no thumbnail url');
        ok++;
      } catch (e) {
        warn++;
        if (existsSync(dest)) { thumbOk = true; console.warn(`  keep [${info.platform}] ${v.caption} — reusing cached thumb (${e.message})`); }
        else console.warn(`  WARN [${info.platform}] ${v.caption} — ${e.message} (card will use gradient fallback)`);
      }
      const file = await resolveDriveFile(info, v.file, v.caption);
      items.push({
        caption: v.caption,
        description: v.description || '',
        description_id: v.description_id || '',
        source: v.source || '',
        tier: v.tier || '',
        title: title || v.caption,
        platform: info.platform,
        platformLabel: info.label,
        link: file ? '' : info.link,
        embed: file ? '' : buildEmbed(info),
        file,
        thumb: thumbOk ? rel : '',
        ar: inferAr(info.platform, v.ar),
      });
    }
    out.categories.push({ id: cat.id, title: cat.title, title_id: cat.title_id || cat.title, blurb: cat.blurb || '', blurb_id: cat.blurb_id || '', items });
  }

  await writeFile(path.join(ROOT, 'videos.generated.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(`\nDone → videos.generated.json  (${ok} fetched, ${warn} warning${warn === 1 ? '' : 's'})`);
}

main().catch((e) => { console.error('build-videos failed:', e); process.exit(1); });
