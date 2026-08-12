/* Előállítja a közzétehető oldalt a deploy/ mappába.

   Az oldal statikus: nincs szerveroldali kód, minden fájl készen áll.
   A közzétételt a .github/workflows/deploy.yml végzi — minden main-re
   küldött push után lefuttatja ezt, és a deploy/ tartalmát élesíti.

   Amit itt intézünk el, hogy ne kelljen kézzel karbantartani:
     - a lábléc és a cégadatok EGY helyről kerülnek minden oldalra
     - a projektek aloldalai a data/projektek.json-ból generálódnak
     - a képekből webes méret készül (a forrás 1800 px, a rácsban 800 kell)
     - a CSS/JS hivatkozások mögé tartalomból számolt ?v= bélyeg kerül

   Helyi ellenőrzés:  npm run build   majd   npm run elonezet
*/
import {
  cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, statSync
} from 'node:fs';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const OUT = 'deploy';

const CEG = JSON.parse(readFileSync('data/ceg-adatok.json', 'utf8'));
const PROJEKTEK = JSON.parse(readFileSync('data/projektek.json', 'utf8'));
const PALYAZATOK = JSON.parse(readFileSync('data/palyazatok.json', 'utf8'));

/* csak a publikált projektek kerülnek ki — a vázlat az adminban marad */
const ELO = PROJEKTEK.filter((p) => p.allapot !== 'vazlat');

const KATEGORIAK = {
  hotel: 'Hotel',
  etterem: 'Étterem',
  lakoingatlan: 'Lakóingatlan',
  kastely: 'Kastély',
  szakralis: 'Szakrális',
  egyedi: 'Egyedi',
  hajo: 'Hajó'
};

/* ---------- 1. másolás ---------- */

const ASSETS = [
  'index.html', 'rolunk.html', 'referenciak.html', 'design-manufaktura.html',
  'kapcsolat.html', 'palyazatok.html', 'admin.html', '404.html',
  'impresszum.html', 'adatkezelesi-tajekoztato.html', 'sutik.html',
  'style.css', 'admin.css', 'fonts.css',
  'script.js', 'admin.js', 'consent.js', 'szuro.js', 'galeria.js',
  'fonts', 'img', 'data',
  'robots.txt', 'sitemap.xml'
].filter(existsSync);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const a of ASSETS) cpSync(a, `${OUT}/${a}`, { recursive: true });

writeFileSync(`${OUT}/CNAME`, `${CEG.domain}\n`);
writeFileSync(`${OUT}/.nojekyll`, '');

/* ---------- 2. ellenőrzés ---------- */

/* Egy elgépelt fájlnév némán törött képet adna az éles oldalon. Inkább
   álljon meg a build, mint hogy hiányos oldal menjen ki. */
const hianyzo = [];
for (const p of ELO) {
  for (const k of p.kepek) {
    if (!existsSync(`img/projektek/${p.slug}/${k.file}`)) hianyzo.push(`${p.slug}/${k.file}`);
  }
  if (p.kiemelt && !p.kepek.some((k) => k.file === p.kiemelt)) {
    hianyzo.push(`${p.slug}: a kiemelt kép (${p.kiemelt}) nincs a képek közt`);
  }
}
if (hianyzo.length) {
  console.error('\n!! HIBA — hiányzó kép a data/projektek.json szerint:\n  ' + hianyzo.join('\n  ') + '\n');
  process.exit(1);
}

/* ---------- 3. képek webes méretben ---------- */

/* A forrás 1800 px hosszabb oldal. A rácsban és a lapozóban ennél
   sokkal kisebb kell — a nagy fájl csak lassítana. */
const MERETEK = [{ utotag: '-800', szeles: 800 }, { utotag: '-1400', szeles: 1400 }];

let keszult = 0;
for (const p of ELO) {
  const dir = `${OUT}/img/projektek/${p.slug}`;
  for (const k of p.kepek) {
    const forras = readFileSync(`img/projektek/${p.slug}/${k.file}`);
    const alap = k.file.replace(/\.[^.]+$/, '');
    for (const m of MERETEK) {
      const buf = await sharp(forras)
        .resize({ width: m.szeles, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true, progressive: true })
        .toBuffer();
      writeFileSync(`${dir}/${alap}${m.utotag}.jpg`, buf);
      keszult++;
    }
  }
}

/* ---------- 4. sablonok ---------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const kep = (slug, file, meret) =>
  `img/projektek/${slug}/${file.replace(/\.[^.]+$/, '')}${meret}.jpg`;

function kartya(p) {
  const elso = p.kiemelt || p.kepek[0].file;
  const alt = p.kepek.find((k) => k.file === elso)?.alt || p.cim;
  return `<a class="kartya jon" href="referenciak/${p.slug}/" data-kat="${esc(p.kategoria)}">
          <div class="keret"><img src="${kep(p.slug, elso, '-800')}" alt="${esc(alt)}" loading="lazy" decoding="async" width="800" height="600"></div>
          <div class="alatt"><span class="nev">${esc(p.cim)}</span><span class="kat">${esc(KATEGORIAK[p.kategoria] || p.kategoria)}</span></div>
        </a>`;
}

/* a szűrő csak azokat a kategóriákat kínálja, amikben tényleg van munka —
   üres gomb csak zavarna */
function szuroGombok() {
  return Object.entries(KATEGORIAK)
    .filter(([kulcs]) => ELO.some((p) => p.kategoria === kulcs))
    .map(([kulcs, nev]) => {
      const db = ELO.filter((p) => p.kategoria === kulcs).length;
      return `<button type="button" class="szuro-gomb" data-kat="${esc(kulcs)}" aria-pressed="false">${esc(nev)} <span class="szam">${db}</span></button>`;
    }).join('\n        ');
}

/* a főoldalra hat projekt: kategóriánként a legelső, hogy a válogatás
   ne egy szakágra szűküljön */
function kiemeltek() {
  const latott = new Set();
  const valogatas = [];
  for (const p of ELO) {
    if (latott.has(p.kategoria)) continue;
    latott.add(p.kategoria);
    valogatas.push(p);
    if (valogatas.length === 6) break;
  }
  return valogatas.map(kartya).join('\n        ');
}

const kapcsolatLista = CEG.kapcsolatok.map((k) => `<div class="szemely">
            <b>${esc(k.nev)}</b>
            <span>${esc(k.beosztas)}</span>
            <a href="tel:${esc(k.telefonHivas)}">${esc(k.telefon)}</a>
          </div>`).join('\n          ');

const palyazatLinkek = PALYAZATOK.map((p) =>
  `<li><a href="palyazatok.html#${esc(p.slug)}">${esc(p.azonosito)}</a></li>`).join('\n            ');

const LABLEC = readFileSync('partials/lablec.html', 'utf8')
  .replace('<!--KAPCSOLATOK-->', kapcsolatLista)
  .replace('<!--PALYAZAT-LINKEK-->', palyazatLinkek);

/* ---------- 5. projekt-aloldalak ---------- */

const SABLON = readFileSync('partials/projekt-sablon.html', 'utf8');

for (const p of ELO) {
  const dir = `${OUT}/referenciak/${p.slug}`;
  mkdirSync(dir, { recursive: true });

  const galeria = p.kepek.map((k, i) => `<figure class="galeria-elem jon">
        <a href="../../${kep(p.slug, k.file, '-1400')}" data-nagyit>
          <img src="../../${kep(p.slug, k.file, '-800')}" alt="${esc(k.alt)}" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">
        </a>
      </figure>`).join('\n      ');

  const link = p.link
    ? `<a class="link-nyil" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.link.replace(/^https?:\/\//, '').replace(/\/$/, ''))} <span aria-hidden="true">↗</span></a>`
    : '';

  const mas = ELO.filter((x) => x.kategoria === p.kategoria && x.slug !== p.slug).slice(0, 3);

  writeFileSync(`${dir}/index.html`, SABLON
    .split('{{cim}}').join(esc(p.cim))
    .split('{{kategoria}}').join(esc(KATEGORIAK[p.kategoria] || p.kategoria))
    .split('{{leiras}}').join(esc(p.leiras || ''))
    .split('{{kepSzam}}').join(String(p.kepek.length))
    .split('{{borito}}').join('../../' + kep(p.slug, p.kiemelt || p.kepek[0].file, '-1400'))
    .replace('<!--GALERIA-->', galeria)
    .replace('<!--KULSO-LINK-->', link)
    .replace('<!--HASONLO-->', mas.map(kartya).join('\n        ').replace(/href="referenciak\//g, 'href="../'))
  );
}

/* ---------- 6. behelyettesítés minden lapon ---------- */

const OLDALAK = [];
(function gyujt(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!/\/(img|fonts|data)$/.test(p)) gyujt(p); }
    else if (e.name.endsWith('.html')) OLDALAK.push(p);
  }
})(OUT);

/* Gyorsítótár-törés: a GitHub Pages fejléceit nem tudjuk átírni, ezért a
   fájl tartalmából számolt bélyeg kerül a hivatkozás mögé. Ha a fájl
   változik, változik az URL is — a visszatérő látogató biztosan újat tölt. */
const BELYEGZETT = ['style.css', 'admin.css', 'fonts.css', 'script.js', 'admin.js',
  'consent.js', 'szuro.js', 'galeria.js']
  .filter((f) => existsSync(`${OUT}/${f}`))
  .map((f) => [f, createHash('sha1').update(readFileSync(`${OUT}/${f}`)).digest('hex').slice(0, 8)]);

const SZAMOK = {
  projektSzam: String(ELO.length),
  kepSzam: String(ELO.reduce((n, p) => n + p.kepek.length, 0)),
  ev: String(new Date().getFullYear())
};

for (const oldal of OLDALAK) {
  let html = readFileSync(oldal, 'utf8');
  const melyseg = oldal.slice(OUT.length + 1).split('/').length - 1;
  const gyoker = '../'.repeat(melyseg);

  html = html
    .replace('<!--LABLEC-->', LABLEC)
    .replace('<!--KIEMELT-->', kiemeltek())
    .replace('<!--SZURO-->', szuroGombok())
    .replace('<!--PROJEKTEK-->', ELO.map(kartya).join('\n        '));

  for (const [kulcs, ertek] of Object.entries({ ...CEG, ...SZAMOK })) {
    if (kulcs.startsWith('_') || typeof ertek === 'object') continue;
    html = html.split(`{{${kulcs}}}`).join(String(ertek));
  }

  for (const [fajl, b] of BELYEGZETT) {
    html = html.split(`"${fajl}"`).join(`"${gyoker}${fajl}?v=${b}"`);
  }

  /* az aloldalakon a gyökérből másolt lábléc hivatkozásai relatívak */
  if (melyseg > 0) {
    html = html.replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/|\.\.\/)/g, `$1="${gyoker}`);
  }

  writeFileSync(oldal, html);
}

/* ---------- 7. sitemap ---------- */

const ma = new Date().toISOString().slice(0, 10);
const urlek = [
  '', 'rolunk.html', 'referenciak.html', 'design-manufaktura.html',
  'kapcsolat.html', 'palyazatok.html', 'impresszum.html',
  'adatkezelesi-tajekoztato.html', 'sutik.html'
].concat(ELO.map((p) => `referenciak/${p.slug}/`));

writeFileSync(`${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urlek.map((u) => `  <url><loc>https://${CEG.domain}/${u}</loc><lastmod>${ma}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`);

/* ---------- kész ---------- */

const kitoltetlen = Object.entries(CEG)
  .filter(([, v]) => typeof v === 'string' && v.startsWith('[KITÖLTENDŐ'))
  .map(([k]) => k);

console.log(
  `Kész: ${OLDALAK.length} oldal, ${ELO.length} projekt, ` +
  `${SZAMOK.kepSzam} kép (${keszult} webes változat), domain ${CEG.domain}.`
);

if (kitoltetlen.length) {
  console.log(
    `\n!! FIGYELEM — a data/ceg-adatok.json még kitöltetlen mezőket tartalmaz:\n` +
    kitoltetlen.map((k) => `   - ${k}`).join('\n') +
    `\n   Az oldal működik, de ezek a funkciók addig nem élnek.\n`
  );
}
