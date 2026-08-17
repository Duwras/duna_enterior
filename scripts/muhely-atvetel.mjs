/* MŰHELYÁTVÉTEL — egy fotós leadott mappájának ellenőrzése.

   Futtatás:
     npm run muhely -- atvetel/2026-09-14-muhely
     npm run muhely -- atvetel/2026-09-14-muhely --bemasol

   Mit válaszol meg EGY szóban: READY vagy NOT READY.

   Miért létezik: a 6. fázis sikerkritériuma az, hogy egy fotós le
   tudjon adni mesterképeket és alapadatot, és a rendszer KÓD
   ELOLVASÁSA NÉLKÜL meg tudja mondani, használható-e. Eddig ehhez
   valakinek meg kellett néznie a build forrását.

   Amit NEM csinál: nem ír a data/ fájlokba. A --bemasol csak a
   MESTEREKET másolja az img/projektek/<slug>/ alá, és KIÍRJA azt a
   JSON-részletet, amit be lehet illeszteni. A projektek.json az
   ügyfél felülete; oda gép nem nyúl.

   ---- A LEADÁSI SZERKEZET ----

     atvetel/<ÉÉÉÉ-HH-NN>-<téma>/
       atvetel.json          — az adatlap (lásd lentebb)
       kepek/                — a mesterek, ide semmi más

   Fájlnév:  <sorszám>-<tipus-kisbetűvel>[-<variáns>].<kiterjesztés>
             01-workshop-wide.jpg
             07-hand-material-b.jpg
             12-day-night-reggel.jpg

   atvetel.json:
   {
     "atvetel":       "2026-09-14-muhely",
     "fotos":         "Kovács Anna",
     "datum":         "2026-09-14",
     "helyszin":      "Győr, Ikrényi út 14.",
     "jogok":         "korlatlan-webes",
     "modellszerzodes": true,
     "celProjekt":    "muhely",
     "kepek": {
       "01-workshop-wide.jpg": {
         "tipus":       "WORKSHOP_WIDE",
         "alt":         "A műhelycsarnok a bejárat felől, ...",
         "idoallapot":  "nappal",
         "allasId":     "csarnok-1",
         "emberek":     true
       }
     }
   }

   A mezők jelentését a docs/PHASE-6-SOURCE-SYSTEM.md 8. pontja írja le. */

import {
  existsSync, readFileSync, readdirSync, statSync, mkdirSync, copyFileSync, writeFileSync
} from 'node:fs';
import sharp from 'sharp';
import { adatBetolt, gepiAlt, kuszobAlatt, ALAP_MESTER } from './forras-modell.mjs';

const { FORRAS, PROJEKTEK } = adatBetolt('.');
const MESTER = FORRAS?.mester || ALAP_MESTER;

/* ---------- a tizenkét felvételtípus ----------

   A PHASE-5 §15.2 táblázatából. A `melyseg: true` azt jelenti, hogy
   ez a típus küszöbön ÁTMEHET a Living Interior szint-1 rétegzésébe,
   tehát a szigorúbb, 3000 px-es mércét kapja. A `nyilas: true` azt,
   hogy a felvételen VALÓDI NYÍLÁSNAK kell lennie (ajtó, kapu,
   átjáró) — nyílás nélküli képből nem lesz küszöb, akármilyen szép. */
const TIPUSOK = {
  WORKSHOP_WIDE:   { nev: 'Műhely, teljes',        melyseg: true,  nyilas: true  },
  WORKBENCH:       { nev: 'Munkapad',              melyseg: false, nyilas: false },
  HAND_MATERIAL:   { nev: 'Kéz és anyag',          melyseg: false, nyilas: false },
  TOOL_MATERIAL:   { nev: 'Szerszám és anyag',     melyseg: false, nyilas: false },
  MATERIAL_DETAIL: { nev: 'Anyagközeli',           melyseg: false, nyilas: false },
  JOINERY:         { nev: 'Kötés',                 melyseg: false, nyilas: false },
  CONSTRUCTION:    { nev: 'Szerkezet, épülőben',   melyseg: false, nyilas: false },
  OBJECT_PROGRESS: { nev: 'Tárgy készülőben',      melyseg: false, nyilas: false },
  FINISHED_OBJECT: { nev: 'Kész tárgy',            melyseg: false, nyilas: false },
  OBJECT_SPACE:    { nev: 'Tárgy a saját terében', melyseg: true,  nyilas: true  },
  PEOPLE_WORKING:  { nev: 'Emberek munka közben',  melyseg: false, nyilas: false },
  DAY_NIGHT:       { nev: 'Ugyanaz az állás, más napszak', melyseg: true, nyilas: true }
};

const IDOALLAPOT = ['nappal', 'aranyora', 'ejjel'];

/* ---------- 1. a mappa ---------- */

const mappa = process.argv[2];
const bemasol = process.argv.includes('--bemasol');

if (!mappa) {
  console.error(`
Használat:  npm run muhely -- <mappa> [--bemasol]

Példa:      npm run muhely -- atvetel/2026-09-14-muhely

A mappa szerkezete:
  <mappa>/atvetel.json
  <mappa>/kepek/*.jpg

A tizenkét felvételtípus:
${Object.entries(TIPUSOK).map(([k, v]) => `  ${k.padEnd(18)} ${v.nev}`).join('\n')}
`);
  process.exit(2);
}

/* Minden állapot ELŐRE deklarálva: a zaras() a legkorábbi hibaágból
   is meghívódhat, és egy még nem inicializált const ott TDZ-hibát
   dobna a jelentés helyett. */
let adat = null;
let fajlok = [];
let tipusSzam = Object.fromEntries(Object.keys(TIPUSOK).map((t) => [t, 0]));
let hianyzoTipus = [];
const rendben = [];
const allasok = new Map();

const hiba = [];   /* NOT READY okok */
const figy = [];   /* elfogadható, de tudni kell róla */
const jo = [];

const H = (s) => hiba.push(s);
const F = (s) => figy.push(s);

if (!existsSync(mappa)) { H(`Nincs ilyen mappa: ${mappa}`); zaras(); }
if (!existsSync(`${mappa}/atvetel.json`)) H(`Hiányzik: ${mappa}/atvetel.json`);
if (!existsSync(`${mappa}/kepek`)) H(`Hiányzik: ${mappa}/kepek/`);
if (hiba.length) zaras();

try { adat = JSON.parse(readFileSync(`${mappa}/atvetel.json`, 'utf8')); }
catch (e) { H(`Az atvetel.json nem olvasható JSON: ${e.message}`); zaras(); }

/* ---------- 2. az adatlap ---------- */

for (const m of ['fotos', 'datum', 'helyszin', 'jogok', 'celProjekt']) {
  if (!adat[m]) H(`atvetel.json: hiányzó kötelező mező — ${m}`);
}
if (adat.jogok && adat.jogok !== 'korlatlan-webes') {
  F(`atvetel.json: a jogok "${adat.jogok}". A rendszer a "korlatlan-webes" értéket ismeri ` +
    `elfogadottnak; minden más kézi jóváhagyást kíván.`);
}
if (adat.datum && !/^\d{4}-\d{2}-\d{2}$/.test(adat.datum)) {
  H(`atvetel.json: a datum formája ÉÉÉÉ-HH-NN legyen (találva: ${adat.datum}).`);
}
if (adat.celProjekt && !PROJEKTEK.some((p) => p.slug === adat.celProjekt)) {
  F(`atvetel.json: a celProjekt "${adat.celProjekt}" ma nincs a projektek.json-ban. ` +
    `Új projekt esetén ez rendben van — a bemásolás létrehozza a mappát.`);
}
if (typeof adat.kepek !== 'object' || !adat.kepek) {
  H('atvetel.json: hiányzik a kepek objektum.');
  zaras();
}

/* ---------- 3. a fájlok ---------- */

fajlok = readdirSync(`${mappa}/kepek`).filter((f) => !f.startsWith('.')).sort();
const megnevezett = Object.keys(adat.kepek);

for (const f of fajlok) {
  if (!megnevezett.includes(f)) H(`${f}: ott van a kepek/ mappában, de nincs az atvetel.json-ban.`);
}
for (const f of megnevezett) {
  if (!fajlok.includes(f)) H(`${f}: szerepel az atvetel.json-ban, de nincs a kepek/ mappában.`);
}

/* allasok: allasId → Map(idoallapot → felvétel) */

for (const f of fajlok) {
  const meta = adat.kepek[f];
  if (!meta) continue;
  const ut = `${mappa}/kepek/${f}`;

  /* --- fájlnév --- */
  if (!/^\d{2,3}-[a-z0-9-]+\.(jpe?g|png|tiff?)$/i.test(f)) {
    H(`${f}: a fájlnév nem <sorszám>-<tipus-kisbetűvel>[-<variáns>].<kit> alakú.`);
  }

  /* --- típus --- */
  const T = TIPUSOK[meta.tipus];
  if (!T) {
    H(`${f}: ismeretlen tipus "${meta.tipus}". Készlet: ${Object.keys(TIPUSOK).join(', ')}`);
    continue;
  }
  tipusSzam[meta.tipus]++;
  const varhatoNev = meta.tipus.toLowerCase().replace(/_/g, '-');
  if (!f.toLowerCase().includes(varhatoNev)) {
    F(`${f}: a fájlnév nem tartalmazza a típust (${varhatoNev}). Nem hiba, de kereshetetlen.`);
  }

  /* --- mérés --- */
  let m;
  try { m = await sharp(ut).metadata(); }
  catch (e) { H(`${f}: nem olvasható képfájl (${e.message}).`); continue; }

  const bajt = statSync(ut).size;
  const meret = {
    w: m.width, h: m.height,
    mp: +((m.width * m.height) / 1e6).toFixed(2),
    hosszu: Math.max(m.width, m.height)
  };
  const arany = m.width / m.height;

  /* --- formátum és színtér --- */
  const kit = (m.format || '').toLowerCase();
  if (['avif', 'webp'].includes(kit)) {
    H(`${f}: ${kit.toUpperCase()} mester. Ez a MI kimeneti formátumunk — mesterként ` +
      `kétszeres veszteséges kódolás. Kérjen JPEG q90+ vagy 16 bites TIFF fájlt.`);
  } else if (!MESTER.formatum.includes(kit)) {
    H(`${f}: nem támogatott mesterformátum (${kit}). Kell: ${MESTER.formatum.join(' | ')}.`);
  }
  if (m.space && m.space !== MESTER.szinter) {
    F(`${f}: színtér ${m.space}, várt ${MESTER.szinter}. A színek némán elmozdulhatnak.`);
  }
  if (bajt / (m.width * m.height) < MESTER.gyanusBajtPerKeppont) {
    F(`${f}: ${(bajt / (m.width * m.height)).toFixed(3)} bájt/képpont — ez már ` +
      `újratömörített fájl, nem kameramester.`);
  }

  /* --- felbontás: a típus dönti el, melyik mércével --- */
  const mercNev = T.melyseg ? 'melysegKritikus' : 'ajanlott';
  const merc = MESTER[mercNev];
  if (kuszobAlatt(meret, MESTER.minimum)) {
    H(`${f}: ${meret.w}×${meret.h} (${meret.mp} MP) — a MINIMUM ` +
      `${MESTER.minimum.megapixel} MP / ${MESTER.minimum.hosszabbOldal} px. Használhatatlan.`);
  } else if (kuszobAlatt(meret, merc)) {
    const mit = T.melyseg
      ? `Ez MÉLYSÉGKRITIKUS típus (${T.nev}): a rétegzéshez ${merc.hosszabbOldal} px kell.`
      : `Az ajánlott ${merc.hosszabbOldal} px alatt van — használható, de nem áll teljes szélességben.`;
    (T.melyseg ? H : F)(`${f}: ${meret.w}×${meret.h} (${meret.mp} MP). ${mit}`);
  }

  /* --- oldalarány --- */
  if (arany < MESTER.oldalarany.min || arany > MESTER.oldalarany.max) {
    H(`${f}: oldalarány ${arany.toFixed(2)} a ${MESTER.oldalarany.min}–${MESTER.oldalarany.max} ` +
      `sávon kívül.`);
  }

  /* --- vágási tartalék --- */
  const tartalek = Math.round(meret.hosszu * (1 - MESTER.vagasTartalek));
  if (tartalek < MESTER.minimum.hosszabbOldal) {
    F(`${f}: nincs vágási tartaléka — ${Math.round(MESTER.vagasTartalek * 100)}% levágás után ` +
      `${tartalek} px maradna, a minimum ${MESTER.minimum.hosszabbOldal}. Vágni nem lehet rajta.`);
  }

  /* --- nyílás: ami küszöb akar lenni, azon legyen mit átnézni --- */
  if (T.nyilas && meta.nyilas === undefined) {
    F(`${f}: ${T.nev} típus — a küszöbhöz kell egy valódi nyílás a képen ` +
      `(ajtó, kapu, átjáró), és a helyét fel kell venni: "nyilas": [x, y, rx, ry]. ` +
      `Nyílás nélkül a felvétel nem lehet küszöb, csak háttér.`);
  }
  if (meta.nyilas !== undefined &&
    (!Array.isArray(meta.nyilas) || meta.nyilas.length !== 4 ||
      meta.nyilas.some((v) => typeof v !== 'number' || v < 0 || v > 1))) {
    H(`${f}: a nyilas [x, y, rx, ry] négy szám 0 és 1 között.`);
  }

  /* --- leírás --- */
  if (!meta.alt) H(`${f}: hiányzik az alt — a képnek leírás kell, nem fájlnév.`);
  else if (gepiAlt(meta.alt)) {
    H(`${f}: az alt gépi címkének látszik ("${meta.alt}"). Írja le, MI LÁTSZIK a képen, ` +
      `legalább négy szóval, a projekt címének ismétlése nélkül.`);
  }

  /* --- vízjel és dátumbélyeg: ÚJ mesteren tilos --- */
  if (meta.vizjel) H(`${f}: vízjeles. Új mester nem jöhet vízjellel.`);
  if (meta.datumbelyeg) H(`${f}: beégetett dátumbélyeg. A gépórát ki kell kapcsolni.`);

  /* --- emberek --- */
  if (meta.emberek || meta.tipus === 'PEOPLE_WORKING') {
    const van = adat.modellszerzodes === true ||
      (Array.isArray(adat.modellszerzodes) && adat.modellszerzodes.length);
    if (!van) {
      H(`${f}: felismerhető embert mutat, és az atvetel.json nem igazol modellszerződést. ` +
        `Vegye fel: "modellszerzodes": true vagy a nevek tömbje.`);
    }
  }

  /* --- időállapot és állás: ebből lesz a nappal→éjjel KAPU --- */
  if (meta.idoallapot && !IDOALLAPOT.includes(meta.idoallapot)) {
    H(`${f}: ismeretlen idoallapot "${meta.idoallapot}". Készlet: ${IDOALLAPOT.join(' | ')}.`);
  }
  if (meta.allasId) {
    if (!allasok.has(meta.allasId)) allasok.set(meta.allasId, new Map());
    allasok.get(meta.allasId).set(meta.idoallapot || 'nappal', { f, meret });
  }

  rendben.push({ f, ut, meta, meret });
}

/* ---------- 4. nappal → éjjel ---------- */

const naptEjt = [];
for (const [azon, allapotok] of allasok) {
  if (allapotok.size < 2) continue;
  const meretek = [...allapotok.values()].map((v) => `${v.meret.w}×${v.meret.h}`);
  if (new Set(meretek).size > 1) {
    F(`${azon}: ${allapotok.size} napszak, de ELTÉRŐ képméret (${meretek.join(' / ')}). ` +
      `A KAPU csak akkor illeszkedik, ha az állvány nem mozdult és a vágás azonos.`);
  } else {
    naptEjt.push(`${azon}: ${[...allapotok.keys()].join(' → ')} — ${meretek[0]}`);
  }
}
if (naptEjt.length) {
  jo.push(`NAPPAL → ÉJJEL KAPU lehetséges ${naptEjt.length} álláson:\n     ` + naptEjt.join('\n     '));
}

/* ---------- 5. lefedettség ---------- */

hianyzoTipus = Object.entries(tipusSzam).filter(([, n]) => !n).map(([t]) => t);

/* ---------- 6. bemásolás ---------- */

if (bemasol && !hiba.length) {
  const cel = `img/projektek/${adat.celProjekt}`;
  mkdirSync(cel, { recursive: true });
  const megvan = existsSync(cel) ? readdirSync(cel).filter((f) => /^\d+\.[a-z]+$/i.test(f)) : [];
  let n = megvan.reduce((max, f) => Math.max(max, parseInt(f, 10) || 0), 0);

  const bejegyzesek = [];
  for (const r of rendben) {
    n++;
    const nev = `${String(n).padStart(2, '0')}.jpg`;
    copyFileSync(r.ut, `${cel}/${nev}`);
    bejegyzesek.push({ file: nev, alt: r.meta.alt });
  }

  const naplo = `${mappa}/bemasolva.json`;
  writeFileSync(naplo, JSON.stringify({
    mikor: new Date().toISOString(),
    celProjekt: adat.celProjekt,
    fotos: adat.fotos,
    datum: adat.datum,
    kepek: rendben.map((r, i) => ({ forras: r.f, lett: bejegyzesek[i].file, tipus: r.meta.tipus }))
  }, null, 1) + '\n');

  console.log(`\n== BEMÁSOLVA ==  ${rendben.length} mester → ${cel}/`);
  console.log(`   Napló: ${naplo}\n`);
  console.log(`Illessze be a data/projektek.json "${adat.celProjekt}" projektjének kepek tömbjébe:\n`);
  console.log(bejegyzesek.map((b) => '      ' + JSON.stringify(b)).join(',\n'));
  console.log(`\nÉs vegye fel a data/forras.json projektek szakaszába:\n`);
  console.log(JSON.stringify({
    [adat.celProjekt]: {
      jogok: 'sajat-uj-fotozas',
      fotos: adat.fotos,
      ev: adat.datum.slice(0, 4),
      allapot: 'READY'
    }
  }, null, 2));
  console.log(`\nUtána:  npm run build   majd   npm run tartalom\n`);
} else if (bemasol) {
  console.log('\n-- A bemásolás kimaradt: előbb a hibákat kell rendezni.\n');
}

/* ---------- 7. jelentés ---------- */

zaras();

function zaras() {
  const sor = '='.repeat(66);
  console.log(`\n${sor}\nMŰHELYÁTVÉTEL — ${mappa || '(nincs mappa)'}\n${sor}`);

  if (adat?.fotos) {
    console.log(`Fotós: ${adat.fotos} · ${adat.datum} · ${adat.helyszin}`);
    console.log(`Felvétel: ${fajlokSzama()} · célprojekt: ${adat.celProjekt}\n`);
  }

  if (typeof tipusSzam === 'object' && tipusSzam) {
    console.log('LEFEDETTSÉG');
    for (const [t, v] of Object.entries(TIPUSOK)) {
      const n = tipusSzam[t] || 0;
      console.log(`  ${n ? '✓' : '·'} ${String(n).padStart(2)} ${t.padEnd(18)} ${v.nev}` +
        (v.melyseg && n ? '   [mélységkritikus]' : ''));
    }
    if (hianyzoTipus?.length) {
      console.log(`\n  ${hianyzoTipus.length} típus hiányzik. EZ NEM HIBA — egy leadás nem ` +
        `kell hogy mindet tartalmazza.`);
    }
  }

  if (jo.length) console.log('\nAMI MEGVAN\n  ' + jo.map((s) => '+ ' + s).join('\n  '));
  if (figy.length) console.log(`\nFIGYELEM (${figy.length}) — átmegy, de tudni kell róla\n  ` +
    figy.map((s) => '~ ' + s).join('\n  '));
  if (hiba.length) console.log(`\nHIBA (${hiba.length}) — ezek nélkül nem vehető át\n  ` +
    hiba.map((s) => '! ' + s).join('\n  '));

  console.log(`\n${sor}`);
  console.log(hiba.length
    ? `NOT READY — ${hiba.length} hiba. A leadás javítva átvehető.`
    : `READY — a leadás átvehető.` +
      (figy.length ? `  (${figy.length} figyelmeztetéssel)` : '') +
      `\n         Bemásolás:  npm run muhely -- ${mappa} --bemasol`);
  console.log(`${sor}\n`);
  process.exit(hiba.length ? 1 : 0);
}

function fajlokSzama() {
  try { return `${readdirSync(`${mappa}/kepek`).filter((f) => !f.startsWith('.')).length} kép`; }
  catch { return '—'; }
}
