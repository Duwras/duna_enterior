/* A TARTALOMMÁTRIX — mi van meg, mi hiányzik, és mi kell hozzá.

   Futtatás:  npm run tartalom
   Kimenet:   docs/tartalom.json   (gépi)
              docs/TARTALOM.md     (olvasható)

   Miért generált és nem kézzel vezetett: mert egy kézi lista a
   harmadik képcsere után hazudik. Itt minden szám a repóból jön —
   a felbontás a fájlból, a szerep az adatfájlokból, a jog a
   data/forras.json-ból. Ami nem vezethető le, az és CSAK az van
   kézzel írva, a forras.json-ban.

   Mit válaszol meg:
     Mi van meg?              → allapot: READY
     Mi hiányzik?             → NEEDS_*
     Mi elég jó?              → kuszob: true, de nem READY
     Mit kell fotózni?        → NEEDS_MASTER / NEEDS_PHOTOGRAPHY
     Mihez kell szöveg?       → NEEDS_COPY
     Mihez kell jogtisztázás? → NEEDS_RIGHTS

   Ez a szkript SEMMIT nem módosít a repóban a két kimeneti fájlon
   kívül, és nem része a buildnek. A build a KAPU (megáll, ha baj
   van); ez a TÉRKÉP (megmutatja, mennyi baj van). */

import { writeFileSync, statSync, existsSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import {
  adatBetolt, szerepekSzamit, gepiAlt, kuszobAlatt, ALAP_MESTER, sulyosabb
} from './forras-modell.mjs';

const { ELO, TEREK, FLOTTA, KESZULES, FORRAS } = adatBetolt('.');
const SZEREP = szerepekSzamit({ ELO, TEREK, FLOTTA, KESZULES });
const MESTER = FORRAS?.mester || ALAP_MESTER;
const SZEREPTAR = FORRAS?.szerepek || {};

const kritikusE = (kulcs) => [...(SZEREP.get(kulcs) || [])]
  .some((sz) => SZEREPTAR[sz]?.kritikus === true);

/* ---------- 1. melyik kép melyik szobához tartozik ---------- */

const SZOBA = new Map();      /* 'slug/file' → 'szobaId/nezopontId' */
for (const [slug, ter] of Object.entries(TEREK)) {
  if (slug.startsWith('$')) continue;
  for (const sz of ter.szobak || []) {
    for (const n of sz.nezopontok || []) SZOBA.set(`${slug}/${n.kep}`, `${sz.id}/${n.id}`);
  }
}

const MELYSEG = new Map();    /* 'slug/file' → 'szerzoi' | 'mert' | 'becsult' | null */
const KAMERA = new Map();
for (const [slug, ter] of Object.entries(TEREK)) {
  if (slug.startsWith('$')) continue;
  for (const sz of ter.szobak || []) {
    for (const n of sz.nezopontok || []) {
      const k = `${slug}/${n.kep}`;
      MELYSEG.set(k, n.lapos ? 'lapos'
        : n.melyseg?.bizalom || (Array.isArray(n.nyilas) ? 'szerzoi' : null));
      KAMERA.set(k, n.allas ? 'mert' : 'szerzoi');
    }
  }
}
for (const k of TEREK.$fooldal?.keretek || []) MELYSEG.set(`${k.slug}/${k.kep}`, k.nyilas ? 'szerzoi' : null);
for (const k of FLOTTA?.nyitas?.keretek || []) MELYSEG.set(`${k.slug}/${k.kep}`, k.nyilas ? 'szerzoi' : null);
for (const k of KESZULES?.nyitas?.keretek || []) MELYSEG.set(`${k.slug}/${k.kep}`, k.nyilas ? 'szerzoi' : null);

/* ---------- 2. minden kép megmérése ---------- */

const sorok = [];
for (const p of ELO) {
  const pf = FORRAS?.projektek?.[p.slug] || {};
  for (const k of p.kepek) {
    const kulcs = `${p.slug}/${k.file}`;
    const ut = `img/projektek/${p.slug}/${k.file}`;
    if (!existsSync(ut)) continue;
    const m = await sharp(ut).metadata();
    const bajt = statSync(ut).size;
    const meret = {
      w: m.width, h: m.height,
      mp: +((m.width * m.height) / 1e6).toFixed(2),
      hosszu: Math.max(m.width, m.height)
    };
    const szerepek = [...(SZEREP.get(kulcs) || [])].sort();
    const kritikus = kritikusE(kulcs);
    const alatt = kuszobAlatt(meret, MESTER.minimum);
    const mentes = FORRAS?.kepek?.[kulcs]?.mentesseg || null;

    /* --- ÁLLAPOT: a legsúlyosabb igaz állítás A KÉPRŐL ---

       A projekt hiányzó `leiras`-a NEM rontja le a képet. Harminc
       üres leírás mellett minden kép NEEDS_COPY volna, és a mátrix
       egyetlen READY sort sem mutatna — ami igaz, de használhatatlan.
       A szöveghiány projektszintű tény, és a 3. táblázat mondja ki. */
    let allapot = 'READY';
    if (gepiAlt(k.alt)) allapot = sulyosabb(allapot, 'NEEDS_COPY');
    if (pf.eredet === 'latvanyterv' || pf.vizjel) allapot = sulyosabb(allapot, 'ARCHIVE_ONLY');
    if (szerepek.includes('szint1-nezopont') && !MELYSEG.get(kulcs)) {
      allapot = sulyosabb(allapot, 'NEEDS_DEPTH');
    }
    if (alatt && szerepek.length) allapot = sulyosabb(allapot, 'NEEDS_MASTER');
    if (pf.jogok === 'tisztazando' || pf.szemely === 'engedelyre-var') {
      allapot = sulyosabb(allapot, 'NEEDS_RIGHTS');
    }

    sorok.push({
      PROJEKT: p.slug,
      SZOBA: SZOBA.get(kulcs) || null,
      KEP: k.file,
      FELBONTAS: `${meret.w}×${meret.h}`,
      MEGAPIXEL: meret.mp,
      HOSSZABB_OLDAL: meret.hosszu,
      BAJT: bajt,
      BAJT_PER_KEPPONT: +(bajt / (meret.w * meret.h)).toFixed(3),
      SZEREP: szerepek,
      KRITIKUS: kritikus,
      KUSZOB_ALATT: alatt,
      FELMENTES: mentes ? mentes.ok : null,
      JOG: pf.jogok || 'sajat-archivum',
      VIZJEL: pf.vizjel || null,
      DATUMBELYEG: pf.datumbelyeg || null,
      SZEMELY: pf.szemely || null,
      ALT: gepiAlt(k.alt) ? 'gepi-cimke' : 'megirt',
      ALT_SZOVEG: k.alt || '',
      SZOVEG: (p.leiras || '').trim() ? 'megvan' : 'hianyzik',
      MELYSEG: MELYSEG.get(kulcs) || null,
      KAMERA: KAMERA.get(kulcs) || null,
      MESTER: ut,
      ALLAPOT: allapot
    });
  }
}

/* ---------- 3. mit KELL még lefényképezni ----------

   Ez a rész nem a meglévő fájlokból jön, hanem a PHASE-5 §14–15
   felvételi listájából, összevetve azzal, hogy a készülés lapján
   melyik állomás üres. Amit a rendszer nem lát a fájlrendszerben, azt
   nem tudja megmérni — de meg tudja MONDANI, hogy hiányzik. */

const MUHELY_TIPUSOK = [
  'WORKSHOP_WIDE', 'WORKBENCH', 'HAND_MATERIAL', 'TOOL_MATERIAL', 'MATERIAL_DETAIL',
  'JOINERY', 'CONSTRUCTION', 'OBJECT_PROGRESS', 'FINISHED_OBJECT', 'OBJECT_SPACE',
  'PEOPLE_WORKING', 'DAY_NIGHT'
];

const hianyzoAllomas = [];
for (const s of KESZULES?.sorozatok || []) {
  const megvan = new Set((s.allomasok || []).map((a) => a.szakasz));
  for (const sz of ['anyag', 'kez', 'targy', 'ter', 'elmeny']) {
    if (!megvan.has(sz)) {
      hianyzoAllomas.push({
        SOROZAT: s.id, PROJEKT: s.projekt, ALLOMAS: sz, ALLAPOT: 'NEEDS_PHOTOGRAPHY'
      });
    }
  }
}

/* ---------- 4. összegzés ---------- */

const szamlal = (lista, mezo) => lista.reduce((m, r) => {
  const k = r[mezo] ?? '—';
  m[k] = (m[k] || 0) + 1;
  return m;
}, {});

const osszeg = {
  kepekOsszesen: sorok.length,
  allapotSzerint: szamlal(sorok, 'ALLAPOT'),
  kritikusSzerep: sorok.filter((r) => r.KRITIKUS).length,
  kritikusKuszobAlatt: sorok.filter((r) => r.KRITIKUS && r.KUSZOB_ALATT).length,
  kritikusFelmentessel: sorok.filter((r) => r.KRITIKUS && r.FELMENTES).length,
  kuszobAlattOsszesen: sorok.filter((r) => r.KUSZOB_ALATT).length,
  szerepNelkul: sorok.filter((r) => !r.SZEREP.length).length,
  altGepiCimke: sorok.filter((r) => r.ALT === 'gepi-cimke').length,
  altMegirt: sorok.filter((r) => r.ALT === 'megirt').length,
  leirasHianyzik: ELO.filter((p) => !(p.leiras || '').trim()).length,
  projektekSzama: ELO.length,
  ajanlottFolott: sorok.filter((r) => r.MEGAPIXEL >= MESTER.ajanlott.megapixel).length,
  melysegKritikusKepes: sorok.filter((r) => r.HOSSZABB_OLDAL >= MESTER.melysegKritikus.hosszabbOldal).length,
  hianyzoAllomasok: hianyzoAllomas.length,
  muhelyTipusok: Object.fromEntries(MUHELY_TIPUSOK.map((t) => [t, 0]))
};

/* A műhelytípusokból ma EGY van meg, és az is 0,75 MP-es 2004-es
   felvétel. Nem számoljuk ki, hanem kimondjuk: a rendszer felismeri
   a tizenkét típust, és jelenti, melyik hiányzik. */
osszeg.muhelyTipusok.WORKSHOP_WIDE = KESZULES?.muhely ? 1 : 0;

mkdirSync('docs', { recursive: true });
writeFileSync('docs/tartalom.json', JSON.stringify({
  keszult: new Date().toISOString().slice(0, 10),
  szabaly: MESTER,
  osszeg,
  kepek: sorok,
  hianyzoAllomasok: hianyzoAllomas,
  muhelyTipusok: MUHELY_TIPUSOK
}, null, 1) + '\n');

/* ---------- 5. olvasható változat ---------- */

const t = (s) => String(s ?? '—');
function tabla(fejlec, adatsorok) {
  if (!adatsorok.length) return '_Nincs ilyen tétel._\n';
  return `| ${fejlec.join(' | ')} |\n| ${fejlec.map(() => '---').join(' | ')} |\n` +
    adatsorok.map((r) => `| ${r.map(t).join(' | ')} |`).join('\n') + '\n';
}

const projektOssz = ELO.map((p) => {
  const r = sorok.filter((x) => x.PROJEKT === p.slug);
  const rossz = r.filter((x) => x.ALLAPOT !== 'READY').length;
  return [
    p.slug, r.length,
    Math.min(...r.map((x) => x.MEGAPIXEL)).toFixed(2) + '–' + Math.max(...r.map((x) => x.MEGAPIXEL)).toFixed(2),
    r.filter((x) => x.SZEREP.length).length,
    r.filter((x) => x.ALT === 'megirt').length + ' / ' + r.length,
    (p.leiras || '').trim() ? 'van' : '**nincs**',
    r[0].JOG === 'sajat-archivum' ? 'saját' : '**' + r[0].JOG + '**',
    rossz ? `${rossz} tétel` : 'rendben'
  ];
}).sort((a, b) => a[0].localeCompare(b[0], 'hu'));

const kritikusSorok = sorok.filter((r) => r.KRITIKUS)
  .sort((a, b) => a.MEGAPIXEL - b.MEGAPIXEL)
  .map((r) => [
    r.PROJEKT + '/' + r.KEP, r.FELBONTAS, r.MEGAPIXEL,
    r.SZEREP.join(', '),
    r.KUSZOB_ALATT ? (r.FELMENTES ? 'felmentve' : '**HIBA**') : 'megfelel',
    r.ALLAPOT
  ]);

const md = `# DUNA — TARTALOMMÁTRIX

**Generált fájl. Ne szerkeszd kézzel** — a \`npm run tartalom\` felülírja.
Forrás: \`data/projektek.json\`, \`data/terek.json\`, \`data/flotta.json\`,
\`data/keszules.json\`, \`data/forras.json\` + a mesterképek megmérve.
Gépi változat: \`docs/tartalom.json\`.

Készült: ${new Date().toISOString().slice(0, 10)}

---

## 1. Összegzés

| | |
|---|---|
| Mesterkép összesen | **${osszeg.kepekOsszesen}** |
| Ebből valamilyen szerepben | ${osszeg.kepekOsszesen - osszeg.szerepNelkul} |
| Csak galériában | ${osszeg.szerepNelkul} |
| **Kritikus szerepben** | **${osszeg.kritikusSzerep}** |
| Kritikus és küszöb alatti | ${osszeg.kritikusKuszobAlatt} — mind ${osszeg.kritikusFelmentessel} névre szóló felmentéssel |
| Küszöb alatt (bármilyen szerep) | ${osszeg.kuszobAlattOsszesen} |
| Ajánlott (≥ ${MESTER.ajanlott.megapixel} MP) fölött | ${osszeg.ajanlottFolott} |
| Mélységkritikus fotózásra alkalmas (≥ ${MESTER.melysegKritikus.hosszabbOldal} px) | **${osszeg.melysegKritikusKepes}** |
| Megírt képleírás | ${osszeg.altMegirt} / ${osszeg.kepekOsszesen} |
| Gépi címke képleírás helyett | **${osszeg.altGepiCimke}** |
| Projekt szöveg (\`leiras\`) nélkül | **${osszeg.leirasHianyzik} / ${osszeg.projektekSzama}** |
| Hiányzó készülés-állomás | ${osszeg.hianyzoAllomasok} |

### Állapot szerint

${tabla(['ÁLLAPOT', 'DB'], Object.entries(osszeg.allapotSzerint)
    .sort((a, b) => b[1] - a[1]))}

---

## 2. Kritikus szerepű képek

Ezekre a build HIBÁVAL áll meg, ha küszöb alá esnek és nincs névre szóló
felmentés a \`data/forras.json\`-ban. Küszöb: **${MESTER.minimum.megapixel} MP /
${MESTER.minimum.hosszabbOldal} px**.

${tabla(['KÉP', 'FELBONTÁS', 'MP', 'SZEREP', 'KÜSZÖB', 'ÁLLAPOT'], kritikusSorok)}

---

## 3. Projektenként

${tabla(['PROJEKT', 'KÉP', 'MP-tartomány', 'szerepben', 'megírt alt', 'szöveg', 'jog', 'állapot'], projektOssz)}

---

## 4. Hiányzó készülés-állomások

Amit a \`data/keszules.json\` sorozatai NEM tudnak megmutatni. Nem hiba —
a fejezet ki is mondja. Egy műhelyfotózás zárja őket.

${tabla(['SOROZAT', 'PROJEKT', 'HIÁNYZÓ ÁLLOMÁS', 'ÁLLAPOT'],
    hianyzoAllomas.map((h) => [h.SOROZAT, h.PROJEKT, h.ALLOMAS, h.ALLAPOT]))}

---

## 5. Műhelyfelvétel-típusok

A rendszer tizenkét típust ismer föl. Egyik sem KÖTELEZŐ — a hiányt jelenti,
nem bünteti. A felvételi leírás a \`docs/PHASE-5-MAKING.md\` §15-ben áll.

${tabla(['TÍPUS', 'MEGVAN'], MUHELY_TIPUSOK.map((x) => [x, osszeg.muhelyTipusok[x] || 0]))}

---

## 6. Jogi állapot

${tabla(['PROJEKT', 'JOG', 'VÍZJEL', 'DÁTUMBÉLYEG', 'SZEMÉLY', 'MEGJEGYZÉS'],
    Object.entries(FORRAS?.projektek || {})
      .filter(([k]) => !k.startsWith('_'))
      .filter(([, v]) => v.jogok !== 'sajat-archivum' || v.vizjel || v.datumbelyeg || v.szemely)
      .map(([k, v]) => [k, v.jogok, v.vizjel, v.datumbelyeg, v.szemely,
        (v.megjegyzes || '').slice(0, 110)]))}
`;

writeFileSync('docs/TARTALOM.md', md);

console.log(`Tartalommátrix kész.
  docs/tartalom.json   ${osszeg.kepekOsszesen} kép
  docs/TARTALOM.md

  Kritikus szerep:        ${osszeg.kritikusSzerep}
  Ebből küszöb alatt:     ${osszeg.kritikusKuszobAlatt} (mind felmentéssel)
  Gépi címke alt helyett: ${osszeg.altGepiCimke}
  Szöveg nélküli projekt: ${osszeg.leirasHianyzik} / ${osszeg.projektekSzama}
  Hiányzó állomás:        ${osszeg.hianyzoAllomasok}`);
