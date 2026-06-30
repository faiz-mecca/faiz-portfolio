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

// ---- render Portfolio from generated data ----
const PLAY_SVG = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2l10 6-10 6V2z"/></svg>';
const esc = (s = '') => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function cardHTML(item) {
  const thumbStyle = item.thumb ? ` style="background-image:url('${esc(item.thumb)}')"` : '';
  const cls = item.thumb ? 'thumb has-img' : 'thumb';
  return `<a class="vcard" style="--ar:${esc(item.ar)}" href="${esc(item.link)}" target="_blank" rel="noopener" title="${esc(item.title)}">
    <div class="${cls}"${thumbStyle}>
      <span class="ptag">${esc(item.platformLabel)}</span>
      <div class="play">${PLAY_SVG}</div>
    </div>
    <div class="meta"><div class="vtitle">${esc(item.caption)}</div></div>
  </a>`;
}

function groupHTML(cat) {
  return `<div class="vgroup reveal">
    <div class="vgroup-head">
      <h3>${esc(cat.title)}</h3>
      ${cat.blurb ? `<span class="vgroup-blurb">${esc(cat.blurb)}</span>` : ''}
    </div>
    <div class="vrow">${cat.items.map(cardHTML).join('')}</div>
  </div>`;
}

(async function renderPortfolio() {
  const mount = document.getElementById('portfolio-groups');
  if (!mount) return;
  try {
    const res = await fetch('videos.generated.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    mount.innerHTML = data.categories.map(groupHTML).join('');
    observeReveals(mount);
  } catch (err) {
    mount.innerHTML = `<p class="vload-error">Couldn't load portfolio data. Run <code>npm run build:videos</code> to generate it.</p>`;
    console.error('portfolio render failed:', err);
  }
})();
