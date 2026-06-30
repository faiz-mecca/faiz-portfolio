// ---- reveal-on-scroll (also used for portfolio groups added later) ----
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, { threshold: 0.15 });
const observeReveals = (scope = document) => scope.querySelectorAll('.reveal:not(.in)').forEach(el => revealIO.observe(el));
observeReveals();

// ---- nav dot active state ----
const sections = ['hero', 'about', 'portfolio', 'pricing'].map(id => document.getElementById(id));
const dots = document.querySelectorAll('nav.dots a');
const navIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const idx = sections.indexOf(e.target);
      dots.forEach(d => d.classList.remove('active'));
      if (dots[idx]) dots[idx].classList.add('active');
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => s && navIO.observe(s));

// ---- helpers ----
const PLAY_SVG = '<svg width="18" height="18" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6V2z"/></svg>';
const esc = (s = '') => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const platformName = p => p === 'drive' ? 'Drive'
  : ({ youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram' }[p] || (p.charAt(0).toUpperCase() + p.slice(1)));

// Last word outlined (ghost), like the reference's display titles.
function ghostTitle(caption) {
  const words = (caption || '').trim().split(/\s+/);
  if (words.length <= 1) return esc(words[0] || '');
  const last = words.pop();
  return `${esc(words.join(' '))} <span class="sc-ghost">${esc(last)}</span>`;
}

function showcaseHTML(item, categoryTitle) {
  const vertical = (item.ar || '16/9').startsWith('9/');
  const bg = item.thumb ? `background-image:url('${esc(item.thumb)}')` : '';
  const name = platformName(item.platform);
  return `<div class="showcase reveal ${vertical ? 'showcase--vertical' : 'showcase--horizontal'}">
    <a class="sc-media" href="${esc(item.link)}" target="_blank" rel="noopener"
       data-embed="${esc(item.embed)}" data-file="${esc(item.file || '')}"
       data-ar="${esc(item.ar)}" data-platform="${esc(item.platform)}"
       title="Play — ${esc(item.title)}">
      <div class="thumb" style="${bg}">
        <span class="ptag">${esc(item.platformLabel)}</span>
        <div class="play">${PLAY_SVG}</div>
      </div>
    </a>
    <div class="sc-text">
      <span class="sc-eyebrow">${esc(categoryTitle)} · ${esc(item.source || name)}</span>
      <h3 class="sc-title">${ghostTitle(item.caption)}</h3>
      ${item.description ? `<p class="sc-desc">${esc(item.description)}</p>` : ''}
    </div>
  </div>`;
}

function groupHTML(cat) {
  return `<div class="vgroup reveal">
    <div class="vgroup-head">
      <h3>${esc(cat.title)}</h3>
      ${cat.blurb ? `<span class="vgroup-blurb">${esc(cat.blurb)}</span>` : ''}
    </div>
    <div class="showcases">${cat.items.map(it => showcaseHTML(it, cat.title)).join('')}</div>
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
