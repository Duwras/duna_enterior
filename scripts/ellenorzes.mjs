/* ELLENŐRZÉS — a KIMENETET vizsgálja, nem a forrást.

   Futtatás:  npm run ellenorzes      (a npm run build UTÁN)

   Öt kérdésre válaszol, mindegyikre a deploy/ mappából:

     NO-JS   megvan-e a tartalom szkript nélkül
     A11Y    címrend, alt, nyelv, egyedi azonosítók, űrlapcímkék
     SEO     canonical, cím, leírás, Open Graph, sitemap
     BIZTONS. maradt-e benne kulcs, helyi útvonal, hibakeresés
     ADMIN   bájtra ugyanaz-e, ami a forrásban

   Miért nem a buildben fut: a build KAPU — megállítja a hibás
   adatot. Ez AUDIT — végignézi, ami már elkészült, és felsorolja,
   ami emberi döntést kíván. A kettő keverve mindkettő rosszabb lenne.

   A kilépési kód 1, ha SÚLYOS tételt talál. */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { adatBetolt } from './forras-modell.mjs';

const OUT = 'deploy';
const { CEG, ELO } = adatBetolt('.');

const sulyos = [];
const enyhe = [];
const S = (hol, mi) => sulyos.push(`${hol}: ${mi}`);
const E = (hol, mi) => enyhe.push(`${hol}: ${mi}`);

/* ---------- a lapok ---------- */

const LAPOK = [];
(function gyujt(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!/\/(img|fonts|data)$/.test(p)) gyujt(p); }
    else if (e.name.endsWith('.html')) LAPOK.push(p);
  }
})(OUT);

const nev = (f) => f.slice(OUT.length + 1).replace(/\\/g, '/');
const KIVETEL = new Set(['admin.html']);          /* az admin nem publikus lap */

/* ---------- 1. NO-JS + A11Y + SEO laponként ---------- */

for (const f of LAPOK) {
  const n = nev(f);
  if (KIVETEL.has(n)) continue;
  const h = readFileSync(f, 'utf8');
  const a404 = n === '404.html';

  /* --- nyelv --- */
  if (!/<html[^>]+lang="hu"/.test(h)) S(n, 'hiányzik a <html lang="hu">');

  /* --- címrend --- */
  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 === 0) S(n, 'nincs <h1>');
  else if (h1 > 1) S(n, `${h1} db <h1> — egy kell`);

  const szintek = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  let elozo = 0;
  for (const sz of szintek) {
    if (elozo && sz > elozo + 1) { E(n, `címszint ugrás: h${elozo} → h${sz}`); break; }
    elozo = sz;
  }

  /* --- NO-JS: valódi tartalom a jelölésben --- */
  const linkek = (h.match(/<a\s[^>]*href="(?!#|javascript:)/g) || []).length;
  if (linkek < 5 && !a404) S(n, `csak ${linkek} valódi <a href> — szkript nélkül nincs navigáció`);

  const csakData = (h.match(/<img\b(?![^>]*\ssrc=)[^>]*\sdata-src=/g) || []).length;
  const osszKep = (h.match(/<img\b/g) || []).length;
  if (csakData && csakData === osszKep) {
    S(n, `mind a ${osszKep} kép csak data-src — szkript nélkül üres a lap`);
  } else if (csakData) {
    E(n, `${csakData} / ${osszKep} kép csak data-src (a térbeli rétegek — szándékos)`);
  }

  /* Rejtett TARTALOM: a hidden attribútum a jelenetkockákon szándékos
     (a nyitás egyszerre egyet mutat), és a szkript által vezérelt
     ÁLLAPOTÜZENETEKEN is (pl. a szűrő „nincs találat” sora, ami
     szkript nélkül nem is volna igaz). Amit keresünk: rejtett
     SZAKASZ vagy CIKK — az valódi tartalom, és szkript nélkül
     elvész. */
  const rejtettSzoveg = (h.match(/<(section|article)\b[^>]*\shidden\b/g) || []).length;
  if (rejtettSzoveg) E(n, `${rejtettSzoveg} rejtett szakasz (hidden) — szkript nélkül olvashatatlan`);

  /* --- alt ---

     A <dialog> tartalma zárva nem is látszik a hozzáférhetőségi fán,
     és a benne lévő nagyítókép alt szövegét a galeria.js a megnyitás
     pillanatában írja be a megnyitott kép sajátjából. Ezt kihagyjuk. */
  const dialogNelkul = h.replace(/<dialog\b[\s\S]*?<\/dialog>/g, '');
  const kepek = [...dialogNelkul.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const altNelkul = kepek.filter((k) => !/\salt=/.test(k));
  if (altNelkul.length) S(n, `${altNelkul.length} kép alt nélkül`);
  const uresAlt = kepek.filter((k) => /\salt=""/.test(k) && !/aria-hidden="true"/.test(k));
  if (uresAlt.length) E(n, `${uresAlt.length} üres alt aria-hidden nélkül`);

  /* --- egyedi azonosítók --- */
  const idk = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupla = idk.filter((x, i) => idk.indexOf(x) !== i);
  if (dupla.length) S(n, `ismétlődő id: ${[...new Set(dupla)].join(', ')}`);

  /* --- gombok és hivatkozások neve --- */
  const nevtelenGomb = (h.match(/<button\b(?![^>]*aria-label)[^>]*>\s*<\/button>/g) || []).length;
  if (nevtelenGomb) S(n, `${nevtelenGomb} üres, névtelen <button>`);

  /* --- űrlapmezők --- */
  for (const mezo of h.match(/<(input|select|textarea)\b[^>]*>/g) || []) {
    if (/type="(hidden|submit|button)"/.test(mezo)) continue;
    const id = (mezo.match(/\sid="([^"]+)"/) || [])[1];
    const cimke = id && new RegExp(`<label[^>]*for="${id}"`).test(h);
    if (!cimke && !/aria-label/.test(mezo)) E(n, `címke nélküli űrlapmező: ${mezo.slice(0, 60)}`);
  }

  /* --- SEO --- */
  if (!a404) {
    const cim = (h.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1].trim();
    if (!cim) S(n, 'nincs <title>');
    else if (cim.length > 65) E(n, `a <title> ${cim.length} karakter (a találati listában ~60 fér ki)`);

    const leiras = (h.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [, ''])[1];
    if (!leiras) E(n, 'nincs meta description');
    else if (leiras.length > 165) E(n, `a description ${leiras.length} karakter`);

    const kanon = (h.match(/rel="canonical"\s+href="([^"]+)"/) || [, ''])[1];
    if (!kanon) S(n, 'nincs rel="canonical"');
    else if (!kanon.startsWith(`https://${CEG.domain}/`)) S(n, `a canonical nem a saját domainre mutat: ${kanon}`);

    for (const t of ['og:title', 'og:url', 'og:image', 'og:type']) {
      if (!h.includes(`property="${t}"`)) E(n, `hiányzó Open Graph: ${t}`);
    }
  }

  /* --- BIZTONSÁG --- */
  for (const [minta, mit] of [
    [/localhost:\d+/g, 'localhost hivatkozás'],
    [/127\.0\.0\.1/g, 'helyi IP'],
    [/file:\/\/\//g, 'helyi fájlútvonal'],
    [/C:\\\\Users/gi, 'helyi fájlútvonal'],
    [/\.pages\.dev/g, 'ideiglenes pages.dev cím'],
    [/console\.(log|debug|table)\s*\(/g, 'hibakereső kiírás'],
    [/(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}/gi, 'kulcsnak látszó érték'],
    [/sourceMappingURL/g, 'forrástérkép-hivatkozás']
  ]) {
    const t = h.match(minta);
    if (t) S(n, `${mit} a kimenetben: ${[...new Set(t)].slice(0, 3).join(', ')}`);
  }
}

/* ---------- 2. SZKRIPTEK: kulcs, hibakeresés, helyi cím ---------- */

for (const f of readdirSync(OUT).filter((x) => x.endsWith('.js'))) {
  const h = readFileSync(`${OUT}/${f}`, 'utf8');
  for (const [minta, mit] of [
    [/localhost:\d+/g, 'localhost hivatkozás'],
    [/\.pages\.dev/g, 'ideiglenes pages.dev cím'],
    [/sourceMappingURL/g, 'forrástérkép-hivatkozás'],
    [/(secret|password)\s*[:=]\s*["'][^"']{8,}/gi, 'kulcsnak látszó érték']
  ]) {
    const t = h.match(minta);
    if (t) S(f, `${mit}: ${[...new Set(t)].slice(0, 3).join(', ')}`);
  }
  const konzol = (h.match(/console\.(log|debug|table)\s*\(/g) || []).length;
  if (konzol) E(f, `${konzol} hibakereső kiírás (console.log)`);
}

/* A NYILVÁNOS reCAPTCHA-kulcs SZÁNDÉKOSAN benne van a kimenetben —
   a titkos párja a Cloudflare-nél él. Ha bármi MÁS kulcsnak látszó
   érték is bekerülne, azt a fenti minta elkapja. */

/* ---------- 3. ADMIN: bájtra ugyanaz? ---------- */

for (const f of ['admin.html', 'admin.js', 'admin.css']) {
  if (!existsSync(f) || !existsSync(`${OUT}/${f}`)) continue;
  const forras = readFileSync(f);
  const ki = readFileSync(`${OUT}/${f}`);
  if (f === 'admin.css') {
    if (!forras.equals(ki)) S(f, 'a kimenet eltér a forrástól');
  } else {
    /* A build behelyettesíti a {{kulcs}} helyeket és a ?v= bélyeget —
       ezek nélkül nem is működne. Amit ellenőrzünk: NINCS más
       különbség, csak ez a kettő. */
    let vart = readFileSync(f, 'utf8');
    for (const [k, v] of Object.entries(CEG)) {
      if (k.startsWith('_') || typeof v === 'object') continue;
      vart = vart.split(`{{${k}}}`).join(String(v));
    }
    vart = vart.replace(/\{\{ev\}\}/g, String(new Date().getFullYear()))
      .replace(/\{\{projektSzam\}\}/g, String(ELO.length))
      .replace(/\{\{kepSzam\}\}/g, String(ELO.reduce((n, p) => n + p.kepek.length, 0)));
    /* A bélyeg a FORRÁSBAN nincs benne, a kimenetben igen — tehát
       ki kell venni, nem egységesíteni. */
    const norm = (s) => s.replace(/\?v=[0-9a-f]{8}/g, '');
    if (norm(vart) !== norm(ki.toString('utf8'))) {
      S(f, 'a kimenet a behelyettesítésen és a gyorsítótár-bélyegen TÚL is eltér a forrástól');
    }
  }
}

/* ---------- 4. SITEMAP és ROBOTS ---------- */

const sm = existsSync(`${OUT}/sitemap.xml`) ? readFileSync(`${OUT}/sitemap.xml`, 'utf8') : '';
const smUrl = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
/* Ami a saját fejlécében noindex, az NEM való a sitemapbe: a kettő
   együtt ellentmondó jelzés a keresőnek. Az ellenőrzés mindkét
   irányban fog — ha egy lapról leveszik a noindexet, hiányként jön
   vissza, ha rárakják, fölöslegként. 8. fázis. */
const noindexLap = (n) =>
  /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(readFileSync(`${OUT}/${n}`, 'utf8'));

const varhato = LAPOK.map(nev)
  .filter((n) => !KIVETEL.has(n) && n !== '404.html' && !n.startsWith('lab/') && !noindexLap(n))
  .map((n) => `https://${CEG.domain}/` + (n === 'index.html' ? '' : n.replace(/(^|\/)index\.html$/, '$1')));

for (const u of varhato) if (!smUrl.includes(u)) S('sitemap.xml', `hiányzó cím: ${u}`);
for (const u of smUrl) if (!varhato.includes(u)) S('sitemap.xml', `nem létező cím: ${u}`);

const robots = existsSync(`${OUT}/robots.txt`) ? readFileSync(`${OUT}/robots.txt`, 'utf8') : '';
if (!/Disallow:\s*\/admin\.html/.test(robots)) S('robots.txt', 'az admin nincs kizárva');
if (!robots.includes(`https://${CEG.domain}/sitemap.xml`)) E('robots.txt', 'nincs sitemap hivatkozás');

const fejlecek = existsSync(`${OUT}/_headers`) ? readFileSync(`${OUT}/_headers`, 'utf8') : '';
/* A `/*` blokk a 8. fázistól több fejlécet is hordoz (nosniff,
   Referrer-Policy, X-Frame-Options, Permissions-Policy), tehát a
   noindex sor nem feltétlenül az első alatta. A blokkot vágjuk ki, és
   abban keresünk. */
const mindenLapBlokk = (fejlecek.match(/^\/\*\s*\n((?:[ \t]+.+\n?)*)/m) || [, ''])[1];
const siteWideNoindex = /X-Robots-Tag:\s*noindex/i.test(mindenLapBlokk);

if (!CEG.sajatDomainEl && !siteWideNoindex) {
  S('_headers', 'a sajatDomainEl false, de nincs site-wide noindex');
}
if (CEG.sajatDomainEl && siteWideNoindex) {
  S('_headers', 'a sajatDomainEl true, de a site-wide noindex bent maradt');
}

/* Alap biztonsági fejlécek — a 8. fázis tette ki őket, és nem
   veszhetnek el némán egy későbbi szerkesztésben. */
for (const kell of ['X-Content-Type-Options: nosniff', 'Referrer-Policy:', 'X-Frame-Options:', 'Permissions-Policy:']) {
  if (!mindenLapBlokk.includes(kell)) E('_headers', `hiányzó biztonsági fejléc: ${kell}`);
}

/* ---------- 5. NEM PUBLIKUS FÁJLOK ---------- */

for (const tilos of ['partials', 'scripts', 'node_modules', 'worker', '.kepgyorstar', 'docs', 'lab', 'mockup', 'atvetel']) {
  if (existsSync(`${OUT}/${tilos}`)) S('deploy', `nem publikus mappa került ki: ${tilos}/`);
}
for (const f of readdirSync(OUT)) {
  if (/\.(mjs|map|bak|orig|log|zip)$/.test(f)) S('deploy', `nem publikus fájl: ${f}`);
}
/* A data/ mappából CSAK a projektek.json publikus (az admin tölti be).
   Minden más build-idejű bemenet, és a forras.json belső ítéleteket
   is tartalmaz. */
if (existsSync(`${OUT}/data`)) {
  for (const f of readdirSync(`${OUT}/data`)) {
    if (f !== 'projektek.json') S('deploy/data', `nem publikus adatfájl került ki: ${f}`);
  }
}

/* ---------- jelentés ---------- */

const vonal = '='.repeat(66);
console.log(`\n${vonal}\nELLENŐRZÉS — ${LAPOK.length} lap a ${OUT}/ mappában\n${vonal}`);
if (enyhe.length) console.log(`\nÉSZREVÉTEL (${enyhe.length})\n  ` + enyhe.map((s) => '~ ' + s).join('\n  '));
if (sulyos.length) console.log(`\nSÚLYOS (${sulyos.length})\n  ` + sulyos.map((s) => '! ' + s).join('\n  '));
if (!sulyos.length && !enyhe.length) console.log('\nNincs kifogás.');
console.log(`\n${vonal}`);
console.log(sulyos.length ? `NEM MEHET KI — ${sulyos.length} súlyos tétel.` : 'KIMEHET.');
console.log(`${vonal}\n`);
process.exit(sulyos.length ? 1 : 0);
