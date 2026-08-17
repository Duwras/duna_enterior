/* A FORRÁS MODELLJE — közös a build és a tartalommátrix között.

   Miért külön fájl, amikor a build.mjs szándékosan egyetlen fájl:
   mert két helyen kellett ugyanaz a szabály, és a MÁSODIK MINDIG
   lemarad. Pontosan ez történt korábban a GYORS halmazzal: külön
   bejárta ugyanazt az öt adatszerkezetet, mint az ellenőrzés, és
   minden új fejezetnél kézzel kellett bővíteni.

   Itt csak az van, amit MINDKETTŐ használ:
     - melyik kép mire van használva (szerepek)
     - mikor számít egy alt szöveg gépi címkének
     - a felbontási küszöb kiértékelése

   Ami NINCS itt: a HTML-előállítás, a származékgyártás és a
   megjelenítés. Azok a build dolgai.

   Ezt a fájlt a build.mjs importálja, a scripts/tartalom-matrix.mjs
   pedig ugyanígy. A deploy/-ba nem kerül ki (a scripts/ nincs az
   ASSETS listán). */

import { existsSync, readFileSync } from 'node:fs';

/* ---------- adatbetöltés ---------- */

export function adatBetolt(gyoker = '.') {
  const be = (f) => existsSync(`${gyoker}/data/${f}`)
    ? JSON.parse(readFileSync(`${gyoker}/data/${f}`, 'utf8'))
    : null;

  const projektek = be('projektek.json') || [];
  return {
    PROJEKTEK: projektek,
    ELO: projektek.filter((p) => p.allapot !== 'vazlat'),
    TEREK: be('terek.json') || {},
    FLOTTA: be('flotta.json'),
    KESZULES: be('keszules.json'),
    FORRAS: be('forras.json'),
    CEG: be('ceg-adatok.json') || {}
  };
}

/* ---------- szerepek ----------

   Kulcs mindenütt `slug/fájlnév`. Egy képnek TÖBB szerepe is lehet:
   a fafaragasok/09 egyszerre főoldali metszetlemez és a készülés
   nyitóképkockája. A szigorúbb szerep dönt. */

export function szerepekSzamit({ ELO, TEREK, FLOTTA, KESZULES }) {
  const szerep = new Map();
  const ad = (slug, kep, mi) => {
    if (!slug || !kep) return;
    const k = `${slug}/${kep}`;
    if (!szerep.has(k)) szerep.set(k, new Set());
    szerep.get(k).add(mi);
  };

  for (const p of ELO) ad(p.slug, p.kiemelt || p.kepek[0].file, 'projekt-borito');

  const fooldal = TEREK.$fooldal;
  if (fooldal) {
    for (const k of fooldal.keretek || []) ad(k.slug, k.kep, 'fooldal-jelenet');
    for (const k of fooldal.metszet || []) ad(k.slug, k.kep, 'fooldal-metszet');
    if (fooldal.ajto) ad(fooldal.ajto.slug, fooldal.ajto.kep, 'fooldal-jelenet');
  }

  for (const [slug, ter] of Object.entries(TEREK)) {
    if (slug.startsWith('$')) continue;
    for (const szoba of ter.szobak || []) {
      for (const n of szoba.nezopontok || []) {
        ad(slug, n.kep, ter.szint === 1 ? 'szint1-nezopont' : 'ter-nezopont');
      }
    }
    for (const r of ter.reszletek || []) ad(slug, r, 'ter-reszlet');
  }

  if (FLOTTA) {
    for (const k of FLOTTA.nyitas?.keretek || []) ad(k.slug, k.kep, 'flotta-nyitas');
    for (const h of FLOTTA.hajok || []) ad(h.slug, h.borito, 'flotta-borito');
  }

  if (KESZULES) {
    for (const k of KESZULES.nyitas?.keretek || []) ad(k.slug, k.kep, 'keszules-nyitas');
    for (const s of KESZULES.sorozatok || []) {
      for (const a of s.allomasok || []) ad(a.slug, a.kep, 'keszules-lemez');
    }
    if (KESZULES.muhely) ad(KESZULES.muhely.slug, KESZULES.muhely.kep, 'keszules-muhely');
  }

  return szerep;
}

/* ---------- gépi címke vagy megírt leírás? ----------

   Az archívum örökölt alt szövegei fájlnevek és belső jelölések:
   „Duna-Enterior-…-referencia-007”, „Öttevényi kastély_belső2”,
   „GM2 e”, „3-IMG_0799”. Ezek a jelölésben ALT-ként ülnek, tehát a
   képnek FORMÁLISAN van leírása — a képernyőolvasó viszont egy
   fájlnevet mond fel.

   A szabály nem ízlés kérdése: négy szónál rövidebb, vagy aláhúzást,
   IMG_ jelet, „referencia-<szám>” végződést, számmal kezdődő
   előtagot tartalmaz. Ez a heurisztika pontosan a PHASE-5 §22.13-ban
   megszámolt 104 tételt adja vissza. */

export function gepiAlt(alt) {
  const a = String(alt || '').trim();
  if (!a) return true;
  if (a.split(/\s+/).length < 4) return true;
  if (/_/.test(a)) return true;
  if (/IMG_/i.test(a)) return true;
  if (/referencia-?\d+$/i.test(a)) return true;
  if (/^\d+-/.test(a)) return true;
  return false;
}

/* ---------- felbontási kiértékelés ---------- */

export const ALAP_MESTER = {
  minimum: { megapixel: 1.5, hosszabbOldal: 1400 },
  ajanlott: { megapixel: 3.0, hosszabbOldal: 2400 },
  melysegKritikus: { megapixel: 6.0, hosszabbOldal: 3000 },
  formatum: ['jpg', 'jpeg', 'png', 'tif', 'tiff'],
  szinter: 'srgb',
  oldalarany: { min: 0.42, max: 2.2 },
  szarmazekSzelessegek: [400, 800, 1400],
  gyanusBajtPerKeppont: 0.055,
  vagasTartalek: 0.12
};

export function kuszobAlatt(meret, kuszob) {
  return meret.mp < kuszob.megapixel || meret.hosszu < kuszob.hosszabbOldal;
}

/* ---------- állapot ----------

   Egy kép EGY állapotot kap, a legsúlyosabbat. A sorrend nem
   önkényes: amit nem szabad kitenni (jog), az előbbre való, mint
   amit rosszul néz ki kitenni (felbontás), és az is előbbre való,
   mint ami csak hiányos (leírás). */

export const ALLAPOT_SULY = {
  NEEDS_RIGHTS: 0,
  NEEDS_MASTER: 1,
  NEEDS_PHOTOGRAPHY: 2,
  NEEDS_DEPTH: 3,
  ARCHIVE_ONLY: 4,
  NEEDS_COPY: 5,
  READY: 6
};

export function sulyosabb(a, b) {
  if (!a) return b;
  if (!b) return a;
  return ALLAPOT_SULY[a] <= ALLAPOT_SULY[b] ? a : b;
}
