/* Betűkészlet-metszés — KÉZI lépés, nem a build része.

   Miért nem a buildben fut: a metszés eredménye determinisztikus és
   ritkán változik, viszont egy wasm-os csomagot húzna be a CI-be minden
   közzétételkor. Ugyanaz az elv, mint a mélységtérképeknél: a drága
   előállítás offline történik, az eredmény pedig egyszerű, verziózott
   fájlként kerül a repóba.

   Mit old meg: a Google Fonts alapból két szeletre bontja a készletet
   (latin / latin-ext), és unicode-range-dzsel adja meg, melyik kell. A
   magyar ő/ű (U+0151, U+0171) a latin-ext-ben van, az alap betűk a
   latin-ban — vagyis MINDEN oldalon MINDKÉT szelet letöltődik. Öt
   betűváltozat × két szelet = 10 fájl, 312 KB. A szeletelés itt nem
   spórol semmit, csak duplázza a kéréseket.

   Amit csinálunk: a két szeletet MEGTARTJUK (a fájlnév és az
   unicode-range változatlan, a fonts.css-hez nem kell nyúlni), de
   mindkettőt levágjuk arra a jelkészletre, ami az oldalon tényleg
   előfordulhat.

   Miért nem lesz egyetlen fájl a kettőből: a Google-szeletek nem fedik
   egymást — a latin-ext-ben nincs cmap-bejegyzés az „a” betűre (csak
   összetett jelek alkatrészeként van meg), a latin-ban pedig nincs ő/ű.
   Összefésülni csak további eszközzel lehetne; a levágás enélkül is
   meghozza a megtakarítás nagy részét.

   Futtatás:
     npm install --no-save subset-font
     node scripts/betuk-metszes.mjs

   Forrás:  fonts/forras/*.woff2   (az eredeti, teljes szeletek — maradnak)
   Kimenet: fonts/*.woff2          (a metszett készlet, ez megy ki)
*/
import { readFileSync, writeFileSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import subsetFont from 'subset-font';

const FORRAS = 'fonts/forras';
const KI = 'fonts';

if (!existsSync(FORRAS)) {
  console.error(`!! HIBA — nincs meg a ${FORRAS} mappa (ide kell az eredeti woff2).`);
  process.exit(1);
}

/* ---------- 1. milyen jelekre van szükség ---------- */

/* Az oldal saját szövegéből gyűjtünk — így az sem marad ki, amit
   valaki később ír bele. */
const SZOVEGFORRAS = [
  ...readdirSync('.').filter((f) => f.endsWith('.html')),
  ...readdirSync('partials').map((f) => `partials/${f}`),
  ...readdirSync('data').map((f) => `data/${f}`)
];

let jelek = new Set();
for (const f of SZOVEGFORRAS) {
  for (const ch of readFileSync(f, 'utf8')) jelek.add(ch);
}

/* Biztonsági készlet: amit az ügyfél az adminban beírhat, az ma még
   nincs benne egyik fájlban sem. Magyar oldal, ezért a magyar ábécé
   teljes; a többi nyelvből csak az, ami magyar szövegben reálisan
   előfordul (idegen név, márkanév). Plusz a tipográfiai írásjelek és a
   felületen ténylegesen használt jelek. */
const BIZTOS = [
  ' !"#$%&\'()*+,-./0123456789:;<=>?@',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ[]_',
  'abcdefghijklmnopqrstuvwxyz{|}',
  'áéíóöúüőű',
  'ÁÉÍÓÖÚÜŐŰ',
  'àâäçèêëîïñôùûß',
  'ÀÄÇÈÊÑ',
  '§©®°±·×÷',
  '–—‘’‚“”„•…‰‹›',
  '€™←↑→↓↗◆✓✕'
].join('');

for (const ch of BIZTOS) jelek.add(ch);

/* a vezérlőjelek nem betűk */
const KESZLET = [...jelek].filter((c) => c.codePointAt(0) > 31).join('');

console.log(`Jelkészlet: ${KESZLET.length} különböző jel.\n`);

/* ---------- 2. metszés ---------- */

/* AZONOS FÁJL NEM ÍRÓDIK KI KÉTSZER (6. fázis).

   A Google Fonts VÁLTOZÓ betűt szolgál ki: ugyanaz a woff2 jön vissza a
   család minden fokozatához. A forras/ mappában emiatt bájtra azonos a

     archivo-400-latin.woff2            és  archivo-500-latin.woff2
     cormorant-garamond-300-latin.woff2 és  cormorant-garamond-400-latin.woff2

   (és a latin-ext párjuk). Kiírva mind a tíz szeletet a böngésző mind a
   tízet letöltötte — 54,5 KB fölösleg nulla tipográfiai haszonért.

   A fonts.css ma fokozatTARTOMÁNYT ad meg (`font-weight: 400 500`), és
   a megmaradt fájlra mutat; a változó betű wght tengelye adja a
   fokozatot. Ezért itt tartalom szerint szűrünk: amelyik forrás egy már
   kiírt fájllal azonos, azt kihagyjuk, és MEGMONDJUK, melyik helyettesíti.

   Ha egyszer valódi, eltérő rajzolatú statikus fokozat kerül a forras/
   mappába, a hash nem fog egyezni, és magától kiíródik. */
const FAJLOK = readdirSync(FORRAS).filter((f) => f.endsWith('.woff2')).sort();

let regiOssz = 0;
let ujOssz = 0;
const latott = new Map();   /* forrás-hash → az a fájlnév, ami már kiment */
const kihagyott = [];

for (const f of FAJLOK) {
  const forras = readFileSync(`${FORRAS}/${f}`);
  const ujjlenyomat = createHash('sha1').update(forras).digest('hex');
  regiOssz += forras.length;

  if (latott.has(ujjlenyomat)) {
    kihagyott.push([f, latott.get(ujjlenyomat)]);
    continue;
  }
  latott.set(ujjlenyomat, f);

  const buf = await subsetFont(forras, KESZLET, { targetFormat: 'woff2' });
  writeFileSync(`${KI}/${f}`, buf);
  ujOssz += buf.length;
  console.log(
    `${f.padEnd(46)} ${(forras.length / 1024).toFixed(1).padStart(6)} → ` +
    `${(buf.length / 1024).toFixed(1).padStart(6)} KB`
  );
}

for (const [f, helyette] of kihagyott) {
  console.log(`${f.padEnd(46)}   kihagyva — bájtra azonos: ${helyette}`);
  /* a korábbi futások maradéka ne ragadjon bent */
  if (existsSync(`${KI}/${f}`)) rmSync(`${KI}/${f}`);
}

console.log(
  `\nForrás:       ${(regiOssz / 1024).toFixed(1)} KB (${FAJLOK.length} szelet)` +
  `\nMetszett:     ${(ujOssz / 1024).toFixed(1)} KB (${latott.size} szelet)` +
  `\nMegtakarítás: ${((1 - ujOssz / regiOssz) * 100).toFixed(0)} %\n`
);
