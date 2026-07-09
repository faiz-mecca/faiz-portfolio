const TRANSLATIONS = {
  en: {
    nav_about: 'About', nav_portfolio: 'Portfolio', nav_pricing: 'Pricing', nav_contact: 'Contact Me',
    hero_eyebrow: 'Content Creator',
    hero_bio: "I'm the guy in front of the camera, behind it, and the one cutting it all together after — sometimes all three on the same project. I keep it simple: no clutter, just a story that actually lands.",
    scroll_cue: 'Scroll',
    about_role: 'Content Creator · Talent · Videographer · Editor',
    about_bio: "I do four things: act on camera, shoot, edit short-form, edit long-form. They all feed into each other — being in front of the camera makes me a sharper editor, and editing makes me pay more attention on set. It all comes together in the end.",
    about_s1: 'Talent',         about_s1d: "Comfortable in front of the camera, whether it's a scripted bit or just talking straight to the lens — both come out natural.",
    about_s2: 'Videographer',   about_s2d: 'Beauty and cinematic shoots, framed with real intention — lighting, movement, and angles that actually serve the story.',
    about_s3: 'Short Form Edit', about_s3d: "Fast, punchy Reels and TikToks made to hook you in the first second and keep you watching.",
    about_s4: 'Long Form Edit', about_s4d: 'YouTube edits paced right so people actually stick around till the end.',
    section_tag_portfolio: 'Portfolio',
    portfolio_h2: "What I've Made",
    portfolio_desc: "A bit of everything — talent, shooting, editing. Click any card to watch it right here.",
    contact_eyebrow: "Let's Work",
    contact_title_html: 'Start a <span>Project</span>',
    contact_sub: "Pick what fits — I'll reply quick on WhatsApp.",
    contact_label: 'I want to hire Faiz as a:',
    btn_talent: 'Talent', btn_video: 'Videographer', btn_short: 'Short Edit', btn_long: 'Long Edit',
    wa_cta: 'Chat on WhatsApp',
    wa_talent: "Hi Faiz, I'm interested in hiring you as Talent.",
    wa_video:  "Hi Faiz, I'm interested in hiring you as a Videographer.",
    wa_short:  "Hi Faiz, I'm interested in ordering your Short Form Editing service.",
    wa_long:   "Hi Faiz, I'm interested in ordering your Long Form Editing service.",
    pricing_eyebrow: 'Pricelist',
    pricing_h2: 'Video Editing',
    pricing_desc: 'Short Form · Long Form · Motion Graphics',
    // short form
    sf_tag: 'Short Form', sf_subdesc: 'Reels, TikToks & Shorts — max 1:30 min',
    sf_std_name: 'Standard', sf_std_desc: 'Clean cut, subtitles, and a light sound mix — simple and straight to the point.',
    sf_prem_name: 'Premium', sf_prem_desc: 'Full cut with visual effects and energetic sound design — built to grab and hold attention.',
    sf_price_note: 'per video · max 1:30 min',
    sf_feat_sd_light: 'Light sound mix', sf_feat_sfx: 'Visual effects', sf_feat_sd_full: 'Energetic sound design',
    sf_no_sfx: 'No visual effects',
    // long form
    lf_tag: 'Long Form', lf_subdesc: 'YouTube videos & long-form content',
    std_name: 'Standard', std_desc: 'Basic cuts, functional pacing, and a light sound mix — no motion graphics.',
    prem_pill: 'MOST POPULAR', prem_name: 'Premium', prem_desc: 'Full edit — tight pacing, full sound design, and motion graphics.',
    tbl_dur: 'FINAL DURATION', tbl_price: 'PRICE',
    custom_row: '60 min+ → custom quote',
    feat_cut: 'Cut & trim', feat_sound: 'Light sound mix', feat_subs: 'Subtitles',
    lf_feat_pacing_std: 'Functional pacing', lf_feat_pacing_prem: 'Tight pacing', lf_feat_sound_prem: 'Full sound design',
    feat_rev1: '1× revision', feat_rev2: '2× revisions', feat_mg: 'Motion graphics',
    addon_rev: 'Extra Revision', addon_rev_u: '/ revision',
    addon_exp: 'Express < 48 Hours', addon_exp_u: 'of total',
    ret_title: 'Monthly Plan',
    ret_desc_html: 'All retainer plans use <b>Premium</b> service (46–60 min tier) — motion graphics included. Better rates + priority queue.',
    ret_billed_html: 'Billed at <b>end of month</b>',
    ret_vol: 'VOLUME', ret_reg: 'REGULAR PRICE', ret_ret: 'RETAINER PRICE', ret_save: 'SAVE', ret_total: 'TOTAL / MONTH',
    ret_4: '4 videos', ret_6: '6 videos', ret_8: '8 videos',
    // terms
    terms_tag: 'TERMS',
    sf_term_1_html: 'Standard turnaround is <b>~half a day</b>, Premium is <b>~1 day</b> (or faster).',
    sf_term_2_html: 'Duration is based on <b>final video length</b> (max 1:30 min), not raw footage.',
    sf_term_3_html: 'Payment is <b>due in full</b> after the final video is approved.',
    sf_term_4_html: 'Turnaround starts from your <b>agreed schedule</b>.',
    lf_term_1_html: 'Standard turnaround is <b>3 days</b> for client preview.',
    lf_term_2_html: 'Duration is based on <b>final video length</b>, not raw footage.',
    lf_term_3_html: 'Payment is <b>due in full</b> after the final video is approved.',
    lf_term_4_html: 'Retainer is billed at <b>end of month</b>.',
    lf_term_5_html: 'Turnaround starts from your <b>agreed schedule</b>.',
  },
  id: {
    nav_about: 'Tentang', nav_portfolio: 'Portofolio', nav_pricing: 'Harga', nav_contact: 'Hubungi Aku',
    hero_eyebrow: 'Kreator Konten',
    hero_bio: 'Aku yang di depan kamera, yang syuting di baliknya, sampai yang edit videonya juga — kadang ketiganya sekaligus dalam satu project. Aku suka yang simpel: nggak neko-neko, yang penting ceritanya sampai.',
    scroll_cue: 'Gulir',
    about_role: 'Kreator Konten · Talent · Videografer · Editor',
    about_bio: 'Ada empat hal yang aku kerjain: tampil di kamera, syuting, edit video pendek, dan edit video panjang. Semuanya nyambung satu sama lain — jadi talent bikin aku lebih peka pas ngedit, dan ngedit bikin aku lebih hati-hati pas syuting. Ujung-ujungnya semua nyatu jadi satu hasil yang rapi.',
    about_s1: 'Talent',         about_s1d: 'Nyaman di depan kamera, mau itu akting sesuai skrip atau ngomong langsung ke kamera — dua-duanya keluar natural.',
    about_s2: 'Videografer',    about_s2d: 'Syuting beauty dan sinematik yang emang dipikirin baik-baik — lighting, gerakan, dan angle yang beneran mendukung ceritanya.',
    about_s3: 'Short Form Edit', about_s3d: 'Reels dan TikTok yang cepat dan nampol, dibuat buat nangkep perhatian di detik pertama dan bikin betah nonton sampai habis.',
    about_s4: 'Long Form Edit', about_s4d: 'Edit YouTube dengan pacing yang pas biar penonton betah sampai video kelar.',
    section_tag_portfolio: 'Portofolio',
    portfolio_h2: 'Yang Sudah Aku Buat',
    portfolio_desc: 'Semuanya ada di sini — talent, syuting, editing. Klik aja kartunya buat nonton langsung.',
    contact_eyebrow: 'Ayo Kerja Sama',
    contact_title_html: 'Mulai <span>Proyek</span>',
    contact_sub: 'Pilih yang sesuai — aku balas cepat di WhatsApp.',
    contact_label: 'Aku mau hire Faiz sebagai:',
    btn_talent: 'Talent', btn_video: 'Videografer', btn_short: 'Edit Pendek', btn_long: 'Edit Panjang',
    wa_cta: 'Chat di WhatsApp',
    wa_talent: 'Halo Faiz, aku tertarik untuk hire kamu sebagai Talent.',
    wa_video:  'Halo Faiz, aku tertarik untuk hire kamu sebagai Videographer.',
    wa_short:  'Halo Faiz, aku tertarik untuk pesan jasa Short Form Editing kamu.',
    wa_long:   'Halo Faiz, aku tertarik untuk pesan jasa Long Form Editing kamu.',
    pricing_eyebrow: 'Daftar Harga',
    pricing_h2: 'Editing Video',
    pricing_desc: 'Short Form · Long Form · Motion Graphics',
    // short form
    sf_tag: 'Short Form', sf_subdesc: 'Reels, TikTok & Shorts — maks 1:30 menit',
    sf_std_name: 'Standard', sf_std_desc: 'Potongan bersih, subtitle, dan sound mix ringan — simpel dan langsung ke tujuan.',
    sf_prem_name: 'Premium', sf_prem_desc: 'Potongan lengkap dengan efek visual dan sound design yang ramai — dibuat untuk narik dan menahan perhatian.',
    sf_price_note: 'per video · maks 1:30 mnt',
    sf_feat_sd_light: 'Sound mix ringan', sf_feat_sfx: 'Efek visual', sf_feat_sd_full: 'Sound design yang ramai',
    sf_no_sfx: 'Tanpa efek visual',
    // long form
    lf_tag: 'Long Form', lf_subdesc: 'Video YouTube & konten long-form',
    std_name: 'Standard', std_desc: 'Potongan dasar, pacing fungsional, dan sound mix ringan — tanpa motion graphics.',
    prem_pill: 'PALING POPULER', prem_name: 'Premium', prem_desc: 'Edit lengkap — pacing ketat, full sound design, dan motion graphics.',
    tbl_dur: 'DURASI FINAL', tbl_price: 'HARGA',
    custom_row: '60 mnt+ → harga custom',
    feat_cut: 'Pemotongan & trim', feat_sound: 'Sound mix ringan', feat_subs: 'Subtitle',
    lf_feat_pacing_std: 'Pacing fungsional', lf_feat_pacing_prem: 'Pacing ketat', lf_feat_sound_prem: 'Full sound design',
    feat_rev1: '1× revisi', feat_rev2: '2× revisi', feat_mg: 'Motion graphics',
    addon_rev: 'Revisi Tambahan', addon_rev_u: '/ revisi',
    addon_exp: 'Express < 48 Jam', addon_exp_u: 'dari total',
    ret_title: 'Paket Bulanan',
    ret_desc_html: 'Semua paket retainer menggunakan layanan <b>Premium</b> (tier 46–60 mnt) — sudah termasuk motion graphics. Harga lebih baik + antrean prioritas.',
    ret_billed_html: 'Ditagih di <b>akhir bulan</b>',
    ret_vol: 'VOLUME', ret_reg: 'HARGA REGULER', ret_ret: 'HARGA RETAINER', ret_save: 'HEMAT', ret_total: 'TOTAL / BULAN',
    ret_4: '4 video', ret_6: '6 video', ret_8: '8 video',
    // terms
    terms_tag: 'KETENTUAN',
    sf_term_1_html: 'Pengerjaan Standard <b>~setengah hari</b>, Premium <b>~1 hari</b> (atau bisa lebih cepat).',
    sf_term_2_html: 'Durasi dihitung dari <b>panjang video final</b> (maks 1:30 mnt), bukan footage mentah.',
    sf_term_3_html: 'Pembayaran <b>lunas</b> setelah video final disetujui.',
    sf_term_4_html: 'Pengerjaan dimulai dari <b>jadwal yang sudah disepakati</b>.',
    lf_term_1_html: 'Pengerjaan Standard <b>3 hari</b> untuk preview client.',
    lf_term_2_html: 'Durasi dihitung dari <b>panjang video final</b>, bukan footage mentah.',
    lf_term_3_html: 'Pembayaran <b>lunas</b> setelah video final disetujui.',
    lf_term_4_html: 'Retainer ditagih di <b>akhir bulan</b>.',
    lf_term_5_html: 'Pengerjaan dimulai dari <b>jadwal yang sudah disepakati</b>.',
  },
};

function applyLang(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;

  // Static HTML elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });

  // WA order buttons
  const waKeys = { wa_talent: 'btn_talent', wa_video: 'btn_video', wa_short: 'btn_short', wa_long: 'btn_long' };
  document.querySelectorAll('.order-btn[data-wa-key]').forEach(btn => {
    const msgKey = btn.dataset.waKey;
    const lblKey = waKeys[msgKey];
    if (t[msgKey]) btn.dataset.msg = t[msgKey];
    if (lblKey && t[lblKey]) btn.textContent = t[lblKey];
  });

  // Dynamically-rendered portfolio: descriptions
  document.querySelectorAll('[data-desc-en]').forEach(el => {
    el.textContent = lang === 'id' && el.dataset.descId ? el.dataset.descId : el.dataset.descEn;
  });

  // Dynamically-rendered portfolio: eyebrow category names
  document.querySelectorAll('.sc-eyebrow[data-cat-en]').forEach(el => {
    const cat = lang === 'id' ? el.dataset.catId : el.dataset.catEn;
    el.textContent = cat + ' · ' + el.dataset.platform;
  });

  // Dynamically-rendered portfolio: group titles and blurbs
  document.querySelectorAll('.vgroup-head h3[data-title-en]').forEach(el => {
    el.textContent = lang === 'id' ? el.dataset.titleId : el.dataset.titleEn;
  });
  document.querySelectorAll('.vgroup-blurb[data-blurb-en]').forEach(el => {
    el.textContent = lang === 'id' ? el.dataset.blurbId : el.dataset.blurbEn;
  });

  // Toggle button state
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang)
  );

  document.documentElement.lang = lang === 'id' ? 'id' : 'en';
  localStorage.setItem('lang', lang);
}

function initLang() {
  applyLang(localStorage.getItem('lang') || 'en');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  initLang();
});
