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

function cardHTML(item) {
  const bg = item.thumb ? `--ar:${esc(item.ar)};background-image:url('${esc(item.thumb)}')` : `--ar:${esc(item.ar)}`;
  const thumbCls = item.thumb ? 'thumb has-img' : 'thumb';
  return `<a class="vcard" href="${esc(item.link)}" target="_blank" rel="noopener"
      data-embed="${esc(item.embed)}" data-ar="${esc(item.ar)}" data-platform="${esc(item.platform)}"
      data-caption="${esc(item.caption)}" title="Play — ${esc(item.title)}">
    <div class="${thumbCls}" style="${bg}">
      <span class="ptag">${esc(item.platformLabel)}</span>
      <div class="play">${PLAY_SVG}</div>
    </div>
    <div class="meta">
      <div class="vtitle">${esc(item.caption)}</div>
      ${item.description ? `<p class="vdesc">${esc(item.description)}</p>` : ''}
    </div>
  </a>`;
}

function groupHTML(cat) {
  const vertical = (cat.items[0]?.ar || '16/9').startsWith('9/');
  return `<div class="vgroup reveal ${vertical ? 'vgroup--vertical' : 'vgroup--horizontal'}">
    <div class="vgroup-head">
      <h3>${esc(cat.title)}</h3>
      ${cat.blurb ? `<span class="vgroup-blurb">${esc(cat.blurb)}</span>` : ''}
    </div>
    <div class="vrow">${cat.items.map(cardHTML).join('')}</div>
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
      <div class="lb-frame"><iframe allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe></div>
      <a class="lb-source" target="_blank" rel="noopener">Open on platform &#8599;</a>
    </div>`;
  document.body.appendChild(lightbox);
  const close = () => closeLightbox();
  lightbox.querySelector('.lb-backdrop').addEventListener('click', close);
  lightbox.querySelector('.lb-close').addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) close(); });
}
function openLightbox({ embed, ar, platform, link, caption }) {
  if (!embed) { window.open(link, '_blank', 'noopener'); return; }
  if (!lightbox) buildLightbox();
  const stage = lightbox.querySelector('.lb-stage');
  stage.classList.toggle('vertical', ar.startsWith('9/'));
  stage.dataset.platform = platform;
  lightbox.querySelector('.lb-frame').style.aspectRatio = ar.replace('/', ' / ');
  lightbox.querySelector('iframe').src = embed;
  const src = lightbox.querySelector('.lb-source');
  src.href = link; src.textContent = `Open on ${platform === 'drive' ? 'Drive' : platform.charAt(0).toUpperCase() + platform.slice(1)} ↗`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.querySelector('iframe').src = 'about:blank'; // stop playback
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
      const card = e.target.closest('.vcard');
      if (!card) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let new-tab / source open
      e.preventDefault();
      openLightbox({
        embed: card.dataset.embed, ar: card.dataset.ar || '16/9',
        platform: card.dataset.platform, link: card.href, caption: card.dataset.caption,
      });
    });
  } catch (err) {
    mount.innerHTML = `<p class="vload-error">Couldn't load portfolio data. Run <code>npm run build:videos</code> to generate it.</p>`;
    console.error('portfolio render failed:', err);
  }
})();
