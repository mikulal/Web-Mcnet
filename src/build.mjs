// Generátor statického webu MCnet. Node 18+, bez závislostí.
// Použití: node src/build.mjs
// Vstup:  data/firma.json, data/reference.json, src/pages/**/*.html
// Výstup: public/**/*.html, public/sitemap.xml, PLACEHOLDERY.md
// Vygenerované HTML je součástí repa, Cloudflare Pages nic nesestavuje.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const SRC = path.join(ROOT, 'src', 'pages');

const firma = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/firma.json'), 'utf8'));
const refs = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/reference.json'), 'utf8')).reference;
const SITE = firma.web.replace(/\/$/, '');

const warnings = [];
const warn = (msg) => warnings.push(msg);

// ---------- pomocné ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isPh = (s) => s == null || s === '' || /\[[^\]]*\]/.test(String(s));
const adresa = `${firma.sidlo.ulice}, ${firma.sidlo.psc} ${firma.sidlo.obec}`;
const telHref = () => 'tel:' + firma.telefon.replace(/[^\d+]/g, '');
const mailHref = (subject) => 'mailto:' + firma.email + (subject ? '?subject=' + encodeURIComponent(subject) : '');
const refUrl = (r) => `/reference/${r.slug}`;
const refBySlug = Object.fromEntries(refs.map((r) => [r.slug, r]));

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : d.name.endsWith('.html') ? [p] : [];
  });
}
function urlOf(rel) {
  rel = rel.split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel.replace(/\.html$/, '');
}
const depthPrefix = (rel) => '../'.repeat(rel.split(/[\\/]/).length - 1);

// ---------- dílčí bloky ----------
const parts = {
  tel(cls = '') {
    return isPh(firma.telefon)
      ? `<span class="${cls}">${esc(firma.telefon)}</span>`
      : `<a class="${cls}" href="${telHref()}">${esc(firma.telefon)}</a>`;
  },
  email(subject = 'Výkaz výměr k nacenění') {
    return isPh(firma.email) ? `<span>${esc(firma.email)}</span>` : `<a href="${esc(mailHref(subject))}">${esc(firma.email)}</a>`;
  },
  emailBtn(cls = 'btn', subject = 'Výkaz výměr k nacenění') {
    return isPh(firma.email)
      ? `<span class="${cls} is-pending">${esc(firma.email)}</span>`
      : `<a class="${cls}" href="${esc(mailHref(subject))}">${esc(firma.email)}</a>`;
  },
  telBtn(cls = 'btn btn-ghost mono') {
    return isPh(firma.telefon)
      ? `<span class="${cls} is-pending">${esc(firma.telefon)}</span>`
      : `<a class="${cls}" href="${telHref()}">${esc(firma.telefon)}</a>`;
  },
  refTable(mode) {
    const list = mode === 'home' ? refs.filter((r) => r.na_uvodu).slice(0, 6) : refs;
    const rows = list.map((r, i) => {
      const name = r.detail ? `<a href="${refUrl(r)}">${esc(r.nazev)}</a>` : esc(r.nazev);
      return `<tr>
          <td class="no" data-label="č.">${String(i + 1).padStart(2, '0')}</td>
          <td class="what" data-label="Stavba">${name}</td>
          <td data-label="Objednatel">${esc(r.tabulka_objednatel)}</td>
          <td class="spec" data-label="Rozsah">${esc(r.rozsah)}</td>
          <td class="spec" data-label="Rok">${esc(r.rok)}</td>
        </tr>`;
    });
    return `<table class="ref-table">
      <thead><tr><th scope="col">č.</th><th scope="col">Stavba</th><th scope="col">Objednatel / zhotovitel</th><th scope="col">Rozsah</th><th scope="col">Rok</th></tr></thead>
      <tbody>
        ${rows.join('\n        ')}
      </tbody>
    </table>`;
  },
  refList(slugs) {
    const items = slugs.map((s) => {
      const r = refBySlug[s];
      if (!r) { warn(`Neznámá reference: ${s}`); return ''; }
      const meta = [r.tabulka_objednatel, r.rok].filter(Boolean).map(esc).join(' · ');
      const name = r.detail ? `<a href="${refUrl(r)}">${esc(r.nazev)}</a>` : `<span>${esc(r.nazev)}</span>`;
      return `<li>${name}<small>${meta}</small></li>`;
    });
    return `<ul class="links">${items.join('')}</ul>`;
  },
  refsForService(service) {
    return parts.refList(refs.filter((r) => r.sluzby.includes(service)).map((r) => r.slug));
  },
  doklady() {
    const items = firma.doklady.map((d, i) => {
      const exists = fs.existsSync(path.join(PUB, 'doklady', d.soubor));
      return exists
        ? `<a class="doc" href="/doklady/${d.soubor}"><span>${esc(d.nazev)}</span><span class="meta">PDF · ${esc(d.platnost)}</span></a>`
        : `<div class="doc is-pending"><span>${esc(d.nazev)}</span><span class="meta">připravujeme</span></div>`;
    });
    return `<div class="docs">${items.join('\n')}</div>`;
  },
  photo(label, cls = '') {
    return `<div class="photo ${cls}" role="img" aria-label="Místo pro fotografii: ${esc(label)}">[Foto: ${esc(label)}]</div>`;
  },
};

// Tokeny v obsahu: {{firma.klic}}, {{adresa}}, {{tel}}, {{email}}, {{email_btn}}, {{tel_btn}},
// {{ref_table:home|all}}, {{ref_list:slug,slug}}, {{ref_sluzba:sluzba}}, {{doklady}}, {{foto:popisek|trida}}
function render(tpl) {
  return tpl.replace(/\{\{([a-z_]+)(?:[.:]([^}]*))?\}\}/g, (m, name, arg) => {
    switch (name) {
      case 'firma': {
        const v = arg.split('.').reduce((o, k) => (o == null ? o : o[k]), firma);
        if (v == null) { warn(`Chybí firma.${arg}`); return m; }
        return esc(v);
      }
      case 'adresa': return esc(adresa);
      case 'tel': return parts.tel(arg || '');
      case 'email': return parts.email();
      case 'email_btn': return parts.emailBtn(arg || 'btn');
      case 'tel_btn': return parts.telBtn();
      case 'ref_table': return parts.refTable(arg);
      case 'ref_list': return parts.refList(arg.split(',').map((s) => s.trim()));
      case 'ref_sluzba': return parts.refsForService(arg);
      case 'doklady': return parts.doklady();
      case 'foto': { const [label, cls] = arg.split('|'); return parts.photo(label, cls || ''); }
      default: warn(`Neznámý token ${m}`); return m;
    }
  });
}

// ---------- JSON-LD ----------
function orgNode() {
  const o = {
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${SITE}/#firma`,
    name: firma.nazev,
    legalName: firma.nazev,
    url: `${SITE}/`,
    vatID: firma.dic,
    identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: firma.ico },
    address: {
      '@type': 'PostalAddress',
      streetAddress: firma.sidlo.ulice,
      postalCode: firma.sidlo.psc,
      addressLocality: firma.sidlo.obec,
      addressCountry: firma.sidlo.stat,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Moravskoslezský kraj' },
      { '@type': 'AdministrativeArea', name: 'Olomoucký kraj' },
    ],
    knowsAbout: ['optické sítě', 'strukturovaná kabeláž', 'OTDR měření', 'projekce slaboproudu', 'DPS'],
  };
  if (!isPh(firma.telefon)) o.telephone = firma.telefon;
  if (!isPh(firma.email)) o.email = firma.email;
  if (!isPh(firma.linkedin)) o.sameAs = [firma.linkedin];
  if (firma.og_image) o.image = `${SITE}${firma.og_image}`;
  return o;
}
function crumbNode(page) {
  const items = [['Úvod', '/'], ...(page.meta.crumbs || []), [page.meta.crumb || page.meta.h1, page.url]];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })),
  };
}
function jsonLd(page) {
  const graph = [orgNode()];
  if (page.url !== '/') graph.push(crumbNode(page));
  if (page.meta.service) {
    graph.push({
      '@type': 'Service',
      name: page.meta.service.name,
      serviceType: page.meta.service.type,
      description: page.meta.description,
      url: SITE + page.url,
      provider: { '@id': `${SITE}/#firma` },
      areaServed: [{ '@type': 'AdministrativeArea', name: 'Moravskoslezský kraj' }, { '@type': 'AdministrativeArea', name: 'Olomoucký kraj' }],
    });
  }
  if (page.meta.reference) {
    const r = page.meta.reference;
    graph.push({
      '@type': 'CreativeWork',
      name: r.nazev,
      headline: r.nazev,
      url: SITE + page.url,
      description: page.meta.description,
      author: { '@id': `${SITE}/#firma` },
      about: { '@type': 'Place', name: r.nazev, address: { '@type': 'PostalAddress', addressLocality: r.mesto, addressCountry: 'CZ' } },
      inLanguage: 'cs',
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

// ---------- šablona stránky ----------
const NAV = [
  ['Služby', '/sluzby/'],
  ['Reference', '/reference/'],
  ['Pro zhotovitele', '/pro-zhotovitele'],
  ['Doklady', '/doklady'],
];
const FOOT = [
  ['Služby', [
    ['Optické trasy a páteře', '/sluzby/opticke-trasy'],
    ['Strukturovaná kabeláž', '/sluzby/strukturovana-kabelaz'],
    ['Měření a dokumentace', '/sluzby/mereni-a-dokumentace'],
    ['Projekce a aktivní prvky', '/sluzby/projekce-a-aktivni-prvky'],
  ]],
  ['Pro zadavatele', [
    ['Školy', '/pro-zadavatele/skoly'],
    ['Zdravotnictví', '/pro-zadavatele/zdravotnictvi'],
    ['Průmyslové areály', '/pro-zadavatele/prumyslove-arealy'],
    ['Obce, úřady, bezpečnostní složky', '/pro-zadavatele/obce-a-urady'],
  ]],
  ['Know-how', [
    ['Výkaz výměr pro optickou trasu', '/know-how/vykaz-vymer-opticka-trasa'],
    ['Protokoly a předání', '/know-how/protokoly-a-predani'],
    ['Optika ve veřejné zakázce', '/know-how/optika-ve-verejne-zakazce'],
    ['Kabely B2ca', '/know-how/kabely-b2ca'],
  ]],
  ['Firma', [
    ['Reference', '/reference/'],
    ['Pro zhotovitele', '/pro-zhotovitele'],
    ['Doklady', '/doklady'],
    ['Kontakt', '/kontakt'],
    ['Ochrana osobních údajů', '/ochrana-osobnich-udaju'],
  ]],
];

function isCurrent(navUrl, pageUrl) {
  return navUrl.endsWith('/') && navUrl !== '/' ? pageUrl.startsWith(navUrl) : pageUrl === navUrl;
}

function contactBlock() {
  return `<section class="contact" id="kontakt" aria-labelledby="kontakt-h">
  <div class="wrap">
    <div class="row">
      <div class="c-7 stack">
        <h2 class="h2" id="kontakt-h">Pošlete výkaz výměr. Ozveme se do dvou pracovních dnů.</h2>
        <p class="sub">Stačí e-mail s výkazem nebo projektem v příloze. Na menší dotazy odpovídáme telefonem rovnou.</p>
        <div class="btns">
          ${parts.emailBtn('btn')}
          ${parts.telBtn()}
        </div>
      </div>
      <div class="c-5 card">
        <div>
          <b>${esc(firma.jednatel)}</b>
          <div>${esc(firma.jednatel_role)}</div>
        </div>
        <div>
          <b>${esc(firma.nazev)}</b>
          <div>${esc(firma.sidlo.ulice)}</div>
          <div>${esc(firma.sidlo.psc)} ${esc(firma.sidlo.obec)}</div>
          <div>IČO ${esc(firma.ico)} · DIČ ${esc(firma.dic)}</div>
          <div>Datová schránka: ${esc(firma.datova_schranka)}</div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function layout(page) {
  const m = page.meta;
  const P = page.absAssets ? '/' : depthPrefix(page.rel);
  const canonical = SITE + page.url;
  const nav = NAV.map(([t, u]) => `<a href="${u}"${isCurrent(u, page.url) ? ' aria-current="page"' : ''}>${t}</a>`).join('\n        ');
  const crumbs = page.url === '/' || m.noCrumbs ? '' : `<nav aria-label="Drobečková navigace"><ol class="crumbs">${
    [['Úvod', '/'], ...(m.crumbs || [])].map(([t, u]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')
  }<li aria-current="page">${esc(m.crumb || m.h1)}</li></ol></nav>`;

  const head = m.h1 ? `<section class="page-head">
    <div class="wrap stack">
      ${crumbs}
      ${m.eyebrow ? `<span class="eyebrow">${esc(m.eyebrow)}</span>` : ''}
      <h1 class="h1">${esc(m.h1)}</h1>
      ${m.lead ? `<p class="lead">${m.lead}</p>` : ''}
    </div>
  </section>` : '';

  let body = render(page.body);
  if (m.layout === 'doc') {
    const [main, aside = ''] = body.split('<!--aside-->');
    body = `<section class="sec">
    <div class="wrap">
      <div class="row">
        <div class="c-8 prose">
${main.trim()}
        </div>
        <aside class="c-4 aside">
${aside.trim()}
        </aside>
      </div>
    </div>
  </section>`;
  }

  const og = [
    ['og:type', m.ogType || 'website'], ['og:site_name', firma.znacka], ['og:locale', 'cs_CZ'],
    ['og:title', m.ogTitle || m.title.replace(/\s*\|\s*MCnet$/, '')], ['og:description', m.description], ['og:url', canonical],
  ];
  if (m.ogImage || firma.og_image) og.push(['og:image', SITE + (m.ogImage || firma.og_image)]);

  const foot = FOOT.map(([h, links]) => `<div class="c-3">
          <h2>${esc(h)}</h2>
          <ul>${links.map(([t, u]) => `<li><a href="${u}">${esc(t)}</a></li>`).join('')}</ul>
        </div>`).join('\n        ');

  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.description)}">
<link rel="canonical" href="${canonical}">
${m.noindex ? '<meta name="robots" content="noindex">\n' : ''}${og.map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`).join('\n')}
<meta name="theme-color" content="#F3F1EC">
<link rel="preload" href="${P}fonts/plex-sans-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${P}fonts/plex-sans-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${P}css/style.css">
<link rel="icon" href="${P}favicon.svg" type="image/svg+xml">
<script>document.documentElement.className='js'</script>
<script type="application/ld+json">${jsonLd(page)}</script>
</head>
<body>
<a class="skip" href="#obsah">Přejít k obsahu</a>
<header class="site-head">
  <div class="wrap site-bar">
    <a class="logo" href="/"${page.url === '/' ? ' aria-current="page"' : ''}>
      <b>MCnet</b>
      <span>s.r.o. · Frýdek-Místek</span>
    </a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Hlavní navigace">
        ${nav}
        ${parts.tel('tel')}
    </nav>
  </div>
</header>
<main id="obsah">
  ${head}
  ${body}
</main>
${m.contact === false ? '' : contactBlock()}
<footer class="site-foot">
  <div class="wrap">
    <div class="row foot-links">
        ${foot}
    </div>
    <p class="foot-note">Drobné zakázky v optice, svařování, ukončení, měření OTDR a opravy po celé ČR, dělá naše servisní značka <a href="https://fajbr.cz">Fajbr</a>.</p>
    <div class="foot-bar">
      <span>© ${new Date().getFullYear()} ${esc(firma.nazev)} · IČO ${esc(firma.ico)}</span>
      <span>Optické a datové sítě · Frýdek-Místek · Ostrava</span>
    </div>
  </div>
</footer>
<script src="${P}js/menu.js" defer></script>
</body>
</html>
`;
}

// ---------- načtení stránek ----------
function parseSource(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const mm = raw.match(/^<!--meta\s*([\s\S]*?)-->\s*/);
  if (!mm) throw new Error(`Chybí <!--meta --> v ${file}`);
  return { meta: JSON.parse(mm[1]), body: raw.slice(mm[0].length) };
}

const pages = walk(SRC).map((file) => {
  const rel = path.relative(SRC, file);
  const { meta, body } = parseSource(file);
  return { rel, url: urlOf(rel), meta, body, absAssets: rel === '404.html' };
});

// Detailní stránky referencí
const refTpl = parseSource(path.join(ROOT, 'src', 'templates', 'reference.html'));
for (const r of refs.filter((x) => x.detail)) {
  const title = `${r.kratky_nazev || r.nazev} – reference MCnet`;
  const kv = [
    ['Objednatel', r.objednatel], ...(r.zhotovitel ? [['Zhotovitel', r.zhotovitel]] : []),
    ['Sektor', r.sektor], ['Doba realizace', r.doba_realizace], ['Rok', r.rok],
    ...r.rozsah_detail.map((x, i) => [i === 0 ? 'Rozsah' : '', x]),
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  const odst = ['zadani', 'omezeni', 'dodali', 'predano'].map((k) => r.odstavce[k]).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('\n');
  const fotky = r.fotky.length
    ? r.fotky.map((f) => `<figure><picture><source srcset="/img/${esc(f.soubor)}.webp" type="image/webp"><img src="/img/${esc(f.soubor)}.jpg" width="${f.sirka}" height="${f.vyska}" alt="${esc(f.alt)}" loading="lazy"></picture><figcaption>${esc(f.popisek)}</figcaption></figure>`).join('')
    : parts.photo(`${r.nazev} – vlastní fotka ze stavby`, 'photo-sm');
  const body = refTpl.body
    .replace('%KV%', kv).replace('%ODSTAVCE%', odst || '<p>[Text reference – zadání, omezení stavby, co jsme dodali, co bylo předáno]</p>')
    .replace('%FOTKY%', fotky).replace('%SOUVISEJICI%', `{{ref_list:${r.souvisejici.join(',')}}}`);
  pages.push({
    rel: path.join('reference', `${r.slug}.html`), url: refUrl(r), body, absAssets: false,
    meta: { ...refTpl.meta, title: title.length <= 60 ? title : `${r.nazev} | MCnet`, ogTitle: title, h1: r.nazev,
      description: r.description, crumbs: [['Reference', '/reference/']], reference: r, ogType: 'article',
      ogImage: r.fotky[0] ? `/img/${r.fotky[0].soubor}.jpg` : null },
  });
}

// ---------- kontroly ----------
const known = new Set(pages.map((p) => p.url));
const titles = new Map(), descs = new Map();
const out = [];
for (const page of pages) {
  const m = page.meta;
  const html = layout(page);
  if (page.rel !== '404.html') {
    if (m.title.length > 60) warn(`${page.url}: title má ${m.title.length} znaků (max 60)`);
    if (!/\| MCnet$/.test(m.title) && !m.reference) warn(`${page.url}: title nekončí „| MCnet“`);
    const dl = (m.description || '').length;
    if (dl < 140 || dl > 155) warn(`${page.url}: description má ${dl} znaků (140–155)`);
    if (titles.has(m.title)) warn(`${page.url}: duplicitní title s ${titles.get(m.title)}`);
    if (descs.has(m.description)) warn(`${page.url}: duplicitní description s ${descs.get(m.description)}`);
    titles.set(m.title, page.url); descs.set(m.description, page.url);
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) warn(`${page.url}: ${h1}× <h1>`);
  let last = 1;
  for (const [, lv] of html.matchAll(/<h([1-6])[\s>]/g)) {
    if (+lv > last + 1) warn(`${page.url}: přeskočená úroveň nadpisu h${last} → h${lv}`);
    last = +lv;
  }
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const u = href;
    if (known.has(u)) continue;
    const f = path.join(PUB, decodeURIComponent(u));
    if (fs.existsSync(f) && fs.statSync(f).isFile()) continue;
    warn(`${page.url}: odkaz na neexistující ${u}`);
  }
  out.push([page, html]);
}

// ---------- zápis ----------
for (const [page, html] of out) {
  const dest = path.join(PUB, page.rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
}

// odstranit detailní stránky referencí, které už nemají detail: true
const refDir = path.join(PUB, 'reference');
for (const f of fs.existsSync(refDir) ? fs.readdirSync(refDir) : []) {
  if (f !== 'index.html' && f.endsWith('.html') && !known.has(`/reference/${f.replace(/\.html$/, '')}`)) fs.unlinkSync(path.join(refDir, f));
}

const sitemapPages = out.filter(([p]) => p.rel !== '404.html' && !p.meta.noindex).map(([p]) => p.url).sort((a, b) => a.length - b.length || a.localeCompare(b));
fs.writeFileSync(path.join(PUB, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}
</urlset>
`);

// ---------- llms.txt (shrnutí pro AI vyhledávače, NAP z firma.json) ----------
const known_ = (v) => (isPh(v) ? null : v);
const llms = [
  `# ${firma.nazev}`, '',
  '> Optické a datové sítě jako subdodávka pro stavební zakázky a veřejné zadavatele v Moravskoslezském kraji a okolí: optické trasy a páteře, strukturovaná kabeláž, OTDR měření a dokumentace, projekce slaboproudu a aktivní prvky.', '',
  '## Firma', '',
  `- Název: ${firma.nazev}`, `- IČO: ${firma.ico}, DIČ: ${firma.dic}`, `- Sídlo: ${adresa}`,
  ...(known_(firma.telefon) ? [`- Telefon: ${firma.telefon}`] : []),
  ...(known_(firma.email) ? [`- E-mail: ${firma.email}`] : []),
  `- Působnost: ${firma.pusobnost.join(', ')}`, `- Web: ${SITE}/`, '',
  '## Stránky', '',
  ...out.filter(([p]) => p.rel !== '404.html').sort(([a], [b]) => a.url.length - b.url.length || a.url.localeCompare(b.url)).map(([p]) => `- [${p.meta.ogTitle && p.url === '/' ? 'Úvod' : p.meta.title.replace(/\s*\|\s*MCnet$/, '')}](${SITE}${p.url}): ${p.meta.description}`),
  '',
];
fs.writeFileSync(path.join(PUB, 'llms.txt'), llms.join('\n'));

// ---------- souhrn placeholderů ----------
const ph = new Map();
for (const [page, html] of out) {
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const [tok] of text.matchAll(/\[[^\]\n<>"]{1,80}\]/g)) {
    if (!ph.has(tok)) ph.set(tok, new Set());
    ph.get(tok).add(page.url);
  }
}
const scan = (obj, prefix, acc) => {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('_')) continue;
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string' && isPh(v) && v !== '') acc.push([key, v]);
    else if (v && typeof v === 'object') scan(v, key, acc);
  }
  return acc;
};
const dataPh = scan(firma, '', []);
const refPh = refs.map((r) => [r.nazev, scan(r, '', []).filter(([k]) => !k.startsWith('odstavce'))]);
let md = `# Placeholdery čekající na doplnění

Generováno skriptem \`node src/build.mjs\`. Po doplnění údajů v \`data/*.json\` spusť build znovu, tento seznam se aktualizuje.

## Firemní údaje (data/firma.json)

${dataPh.map(([k, v]) => `- \`${k}\`: ${v}`).join('\n')}
${firma.og_image ? '' : '- `og_image`: chybí vlastní fotka pro Open Graph (např. /img/og.jpg, 1200×630)\n'}
## Reference (data/reference.json)

Detailní stránky se generují až s \`"detail": true\`. Zatím: ${refs.filter((r) => r.detail).length} z ${refs.length}.

${refPh.map(([n, l]) => `### ${n}\n${l.map(([k, v]) => `- \`${k}\`: ${v}`).join('\n') || '- vše vyplněno'}`).join('\n\n')}

## Mimo data – k doplnění nebo rozhodnutí

- **Fotky ze staveb** (\`public/img/\`, WebP + JPEG, max. 1600 px): úvod 3×, služby 3×, Pro zhotovitele 1×, každá reference 1–2×. Zatím šedé bloky s popiskem.
- **PDF doklady** do \`public/doklady/\` s názvy z \`firma.json\` → po buildu se z „připravujeme“ stanou odkazy.
- **Další reference** „dle seznamu od Luboše“ – doplnit do \`data/reference.json\`.
- **Doba uložení nerealizovaných poptávek** na /ochrana-osobnich-udaju; text stránky nechat zkontrolovat (příjemci údajů).
- **Staré URL www.mcnet.cz** pro \`public/_redirects\` (dnes tam běží jen stránka „Vaše IP adresa“, bez sitemap).
- **HPE partnerství**: \`hpe_partner\` je \`false\`, web zmiňuje jen produkty HPE Aruba, ne partnerství.
- **NAP**: adresa je z ARES ve tvaru „J. Opletala 924“ (starý prototyp měl „Jana Opletala 924“) – stejný zápis použít v Google Business Profile a na firmy.cz.

## Výskyt na stránkách

| Placeholder | Stránky |
|---|---|
${[...ph.entries()].sort().map(([t, s]) => `| \`${t}\` | ${[...s].sort().join(', ')} |`).join('\n')}
`;
fs.writeFileSync(path.join(ROOT, 'PLACEHOLDERY.md'), md);

console.log(`Vygenerováno ${out.length} stránek, sitemap ${sitemapPages.length} URL, ${ph.size} různých placeholderů.`);
if (warnings.length) {
  console.log(`\nUpozornění (${warnings.length}):`);
  for (const w of warnings) console.log(' - ' + w);
  process.exitCode = 1;
}
