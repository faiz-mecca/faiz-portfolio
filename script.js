// ---- scroll restoration: always start at top on load/refresh ----
history.scrollRestoration = 'manual';

// Hash navigation from another page (e.g. pricing → index.html#contact), or a direct
// link straight to a portfolio category (e.g. #short-form-edit). Portfolio groups are
// rendered async from fetched JSON, so the target may not exist yet on `load` — this
// gets called again once that render finishes.
function scrollToHash() {
  if (!location.hash) return;
  const el = document.querySelector(location.hash);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
}
window.addEventListener('load', scrollToHash);

// ---- topbar: hide on scroll down, show on scroll up ----
const topbar = document.querySelector('.topbar');
if (topbar) {
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y <= 0) {
      topbar.classList.remove('tb-hidden');
    } else if (y > lastY) {
      topbar.classList.add('tb-hidden');
    } else if (y < lastY) {
      topbar.classList.remove('tb-hidden');
    }
    lastY = y;
  }, { passive: true });
}

// ---- reveal-on-scroll (also used for portfolio groups added later) ----
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, { threshold: 0.15 });
const observeReveals = (scope = document) => scope.querySelectorAll('.reveal:not(.in)').forEach(el => revealIO.observe(el));
observeReveals();

// ---- top-bar active link (highlights the section in view; only on pages with in-page sections) ----
const navLinks = document.querySelectorAll('.tb-nav a[data-nav]');
if (navLinks.length) {
  const linkFor = id => document.querySelector(`.tb-nav a[data-nav="${id}"]`);
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = linkFor(e.target.id);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  ['about', 'portfolio'].forEach(id => {
    const el = document.getElementById(id);
    if (el) navIO.observe(el);
  });
}

// ---- helpers ----
const PLAY_SVG = '<svg width="18" height="18" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6V2z"/></svg>';
const esc = (s = '') => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const platformName = p => p === 'drive' ? 'Drive'
  : ({ youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram' }[p] || (p.charAt(0).toUpperCase() + p.slice(1)));

// Self-hosted (Drive) videos have no external link — never expose one.
const mediaHref = link => link ? esc(link) : 'javascript:void(0)';

// Last word outlined (ghost), like the reference's display titles.
function ghostTitle(caption) {
  const words = (caption || '').trim().split(/\s+/);
  if (words.length <= 1) return esc(words[0] || '');
  const last = words.pop();
  return `${esc(words.join(' '))} <span class="sc-ghost">${esc(last)}</span>`;
}

function showcaseHTML(item, cat) {
  const vertical = (item.ar || '16/9').startsWith('9/');
  const bg = item.thumb ? `background-image:url('${esc(item.thumb)}')` : '';
  const name = platformName(item.platform);
  return `<div class="showcase reveal ${vertical ? 'showcase--vertical' : 'showcase--horizontal'}">
    <a class="sc-media" href="${mediaHref(item.link)}"${item.link ? ' target="_blank" rel="noopener"' : ''}
       data-embed="${esc(item.embed)}" data-file="${esc(item.file || '')}"
       data-ar="${esc(item.ar)}" data-platform="${esc(item.platform)}"
       title="Play — ${esc(item.title)}">
      <div class="thumb" style="${bg}">
        <span class="ptag">${esc(item.platformLabel)}</span>
        <div class="play">${PLAY_SVG}</div>
      </div>
    </a>
    <div class="sc-text">
      ${eyebrow(cat.title, cat.title_id, item.source || name, item.tier)}
      <h3 class="sc-title">${ghostTitle(item.caption)}</h3>
      ${descHTML(item)}
    </div>
  </div>`;
}

// Portrait card: thumbnail on top (height-capped), text below — used for 9/16 categories
function getLang() { return localStorage.getItem('lang') || 'en'; }

function descHTML(item) {
  const en = item.description || '';
  const id = item.description_id || en;
  if (!en) return '';
  const cur = getLang() === 'id' ? id : en;
  return `<p class="sc-desc" data-desc-en="${esc(en)}" data-desc-id="${esc(id)}">${esc(cur)}</p>`;
}

function eyebrow(catTitleEn, catTitleId, platformOrSource, tier) {
  const catEn = tier ? `${catTitleEn} ${tier}` : catTitleEn;
  const catId = tier ? `${catTitleId} ${tier}` : catTitleId;
  const cur = getLang() === 'id' ? catId : catEn;
  return `<span class="sc-eyebrow" data-cat-en="${esc(catEn)}" data-cat-id="${esc(catId)}" data-platform="${esc(platformOrSource)}">${esc(cur)} · ${esc(platformOrSource)}</span>`;
}

function portraitCardHTML(item, cat) {
  // Paired entry: two thumbnails side-by-side, one shared caption + description
  if (item.videos) {
    const name = platformName(item.videos[0].platform);
    const thumbsHTML = item.videos.map(v => {
      const bg = v.thumb ? `background-image:url('${esc(v.thumb)}')` : '';
      return `<a class="sc-media" href="${mediaHref(v.link)}"${v.link ? ' target="_blank" rel="noopener"' : ''}
         data-embed="${esc(v.embed)}" data-file="${esc(v.file || '')}"
         data-ar="${esc(v.ar)}" data-platform="${esc(v.platform)}"
         title="Play — ${esc(item.caption)}">
        <div class="thumb portrait-thumb" style="${bg}">
          <span class="ptag">${esc(v.platformLabel)}</span>
          <div class="play">${PLAY_SVG}</div>
        </div>
      </a>`;
    }).join('');
    return `<div class="portrait-card portrait-pair reveal">
      <div class="portrait-thumbs">${thumbsHTML}</div>
      <div class="portrait-text">
        ${eyebrow(cat.title, cat.title_id, item.source || name, item.tier)}
        <h3 class="sc-title">${ghostTitle(item.caption)}</h3>
        ${descHTML(item)}
      </div>
    </div>`;
  }

  // Single entry
  const bg = item.thumb ? `background-image:url('${esc(item.thumb)}')` : '';
  const name = platformName(item.platform);
  return `<div class="portrait-card reveal">
    <a class="sc-media" href="${mediaHref(item.link)}"${item.link ? ' target="_blank" rel="noopener"' : ''}
       data-embed="${esc(item.embed)}" data-file="${esc(item.file || '')}"
       data-ar="${esc(item.ar)}" data-platform="${esc(item.platform)}"
       title="Play — ${esc(item.title)}">
      <div class="thumb portrait-thumb" style="${bg}">
        <span class="ptag">${esc(item.platformLabel)}</span>
        <div class="play">${PLAY_SVG}</div>
      </div>
    </a>
    <div class="sc-text">
      ${eyebrow(cat.title, cat.title_id, item.source || name, item.tier)}
      <h3 class="sc-title">${ghostTitle(item.caption)}</h3>
      ${descHTML(item)}
    </div>
  </div>`;
}

function groupHTML(cat) {
  const usePortrait = cat.id === 'short-form-edit' || cat.id === 'talent';
  const lang = getLang();
  const title = lang === 'id' ? (cat.title_id || cat.title) : cat.title;
  const blurb = lang === 'id' ? (cat.blurb_id || cat.blurb) : cat.blurb;
  return `<div class="vgroup reveal" id="${esc(cat.id)}">
    <div class="vgroup-head">
      <h3 data-title-en="${esc(cat.title)}" data-title-id="${esc(cat.title_id || cat.title)}">${esc(title)}</h3>
      ${cat.blurb ? `<span class="vgroup-blurb" data-blurb-en="${esc(cat.blurb)}" data-blurb-id="${esc(cat.blurb_id || cat.blurb)}">${esc(blurb)}</span>` : ''}
    </div>
    ${usePortrait
      ? `<div class="portrait-row">${cat.items.map(it => portraitCardHTML(it, cat)).join('')}</div>`
      : `<div class="showcases">${cat.items.map(it => showcaseHTML(it, cat)).join('')}</div>`
    }
  </div>`;
}

// ---- lightbox player ----
let lightbox;
function buildLightbox() {
  lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-stage" role="dialog" aria-modal="true">
      <button class="lb-close" aria-label="Close">&times;</button>
      <div class="lb-frame"></div>
    </div>`;
  document.body.appendChild(lightbox);
  const close = () => closeLightbox();
  lightbox.querySelector('.lb-backdrop').addEventListener('click', close);
  lightbox.querySelector('.lb-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) close(); });
}
function openLightbox({ embed, file, ar, platform, link }) {
  if (!embed && !file) { window.open(link, '_blank', 'noopener'); return; }
  if (!lightbox) buildLightbox();
  const stage = lightbox.querySelector('.lb-stage');
  stage.classList.toggle('vertical', ar.startsWith('9/'));
  stage.dataset.platform = platform;
  const frame = lightbox.querySelector('.lb-frame');
  frame.style.aspectRatio = ar.replace('/', ' / ');
  frame.innerHTML = file
    ? `<video src="${file}" controls autoplay playsinline></video>`            // self-hosted, clean
    : `<iframe src="${embed}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.querySelector('.lb-frame').innerHTML = ''; // stop playback (iframe or video)
  document.body.style.overflow = '';
}

// ---- contact: order type selector updates WA link ----
const WA_BASE = 'https://wa.me/6285162573133';
const orderBtns = document.querySelectorAll('.order-btn');
const waCta = document.getElementById('waCta');
if (orderBtns.length && waCta) {
  orderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      orderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      waCta.href = `${WA_BASE}?text=${encodeURIComponent(btn.dataset.msg)}`;
    });
  });
}

// ---- render Portfolio from generated data ----
(async function renderPortfolio() {
  const mount = document.getElementById('portfolio-groups');
  if (!mount) return;
  try {
    const res = await fetch('videos.generated.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    mount.innerHTML = data.categories.map(groupHTML).join('');
    observeReveals(mount);
    scrollToHash();
    mount.addEventListener('click', e => {
      const trigger = e.target.closest('.sc-media');
      if (!trigger) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab / source open
      e.preventDefault();
      openLightbox({
        embed: trigger.dataset.embed, file: trigger.dataset.file, ar: trigger.dataset.ar || '16/9',
        platform: trigger.dataset.platform, link: trigger.href,
      });
    });
  } catch (err) {
    mount.innerHTML = `<p class="vload-error">Couldn't load portfolio data. Run <code>npm run build:videos</code> to generate it.</p>`;
    console.error('portfolio render failed:', err);
  }
})();
