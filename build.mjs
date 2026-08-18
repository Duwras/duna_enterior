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
import { szerepekSzamit, ALAP_MESTER } from './scripts/forras-modell.mjs';

const OUT = 'deploy';

const CEG = JSON.parse(readFileSync('data/ceg-adatok.json', 'utf8'));
const PROJEKTEK = JSON.parse(readFileSync('data/projektek.json', 'utf8'));
const PALYAZATOK = JSON.parse(readFileSync('data/palyazatok.json', 'utf8'));

/* A térbeli réteg KÜLÖN fájlban él. Ok: az admin mentéskor fix
   mezőlistára tisztítja a projekteket, tehát bármit, amit a
   projektek.json-ba tennénk, a következő ügyféloldali mentés némán
   eldobná. Így viszont az admin változatlanul működik tovább.
   Ha a fájl nincs meg, minden pontosan úgy épül, mint eddig. */
const TEREK = existsSync('data/terek.json')
  ? JSON.parse(readFileSync('data/terek.json', 'utf8'))
  : {};

/* A FLOTTA ugyanezen az elven él külön fájlban. Ha nincs meg, a
   /flotta.html egyszerűen nem épül meg, és minden más változatlan. */
const FLOTTA = existsSync('data/flotta.json')
  ? JSON.parse(readFileSync('data/flotta.json', 'utf8'))
  : null;

/* A KÉSZÜLÉS szintén. Ha nincs meg, a /keszules.html nem épül meg, és
   minden más — a főoldal metszete is — pontosan úgy marad. */
const KESZULES = existsSync('data/keszules.json')
  ? JSON.parse(readFileSync('data/keszules.json', 'utf8'))
  : null;

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

/* Csak ezek kerülnek fel. Ami nincs a listán, az nem publikus — a
   partials/ és a scripts/ például szándékosan marad ki. */
const ASSETS = [
  'index.html', 'rolunk.html', 'referenciak.html', 'design-manufaktura.html',
  'kapcsolat.html', 'palyazatok.html', 'admin.html', '404.html',
  'impresszum.html', 'adatkezelesi-tajekoztato.html', 'sutik.html',
  'alaprajz.html', 'flotta.html', 'keszules.html',
  'style.css', 'admin.css', 'fonts.css', 'rendszer.css', 'ter.css',
  'terv.css', 'fooldal.css', 'flotta.css', 'keszules.css',
  'script.js', 'admin.js', 'consent.js', 'szuro.js', 'galeria.js', 'urlap.js',
  'kuszob.js', 'ter.js', 'terv.js', 'fooldal.js', 'flotta.js', 'keszules.js',
  'fonts', 'img', 'data',
  'robots.txt', 'sitemap.xml'
].filter(existsSync);

/* Amit szándékosan NEM viszünk ki.

   1. fonts/forras — a metszés előtti, teljes betűszeletek. A repóban
      maradnak (ebből készül a kimenet), de kimenni nincs okuk.
   2. img/projektek/**  eredeti fotók — 59 MB. Helyettük a lentebb
      készülő -800 és -1400 változatok mennek. A 6/c ellenőrzés áll
      meg, ha valamelyik lap mégis az eredetire hivatkozna.
   3. hat hivatkozás nélküli arculati kép, összesen ~1,6 MB. Nincsenek
      törölve, csak nem kerülnek fel — visszavehető döntés. */
const KIHAGY = [
  /^fonts[\\/]forras([\\/]|$)/,
  /* A data/ mappából EGYETLEN fájlra van szükség a böngészőben: az
     admin.js a data/projektek.json-t tölti be szerkesztéshez. A többi
     build-idejű bemenet — a lapokba már bele van építve, amit
     mondanak. Nem titok egyik sem, de a forras.json belső ítéleteket
     tartalmaz (melyik projekt jogtisztázásra vár, melyik kép vízjeles),
     és annak nincs dolga a nyilvános kimenetben. 6. fázis. */
  /^data[\\/](?!projektek\.json$)/,
  /^img[\\/]projektek[\\/][^\\/]+[\\/][^\\/]+\.(jpe?g|png|webp)$/i,
  /^img[\\/]brand[\\/](slider-2\.png|logo2_c\.png|dunaenterior_logo\.png|ddm-vebre\.jpg|latvanyterv\.jpg|ginop-8-3-5\.jpg)$/
];

const kihagyando = (ut) => KIHAGY.some((r) => r.test(ut));

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const a of ASSETS) {
  cpSync(a, `${OUT}/${a}`, {
    recursive: true,
    filter: (forras) => !kihagyando(forras)
  });
}

/* Egy fejezet a saját adatfájlján áll. Ha az nincs meg, a lap se
   kerüljön ki: máskülönben egy behelyettesítetlen, üres oldal
   maradna a helyén. (A 6/b lépés ezt egyébként is elkapná, de a
   hiány nem hiba — csak a fejezet nem létezik.) */
if (!KESZULES) rmSync(`${OUT}/keszules.html`, { force: true });

/* A .nojekyll kikapcsolja a Jekyll feldolgozást, ami különben eldobná az
   aláhúzással kezdődő fájlokat és mappákat. */
writeFileSync(`${OUT}/.nojekyll`, '');

/* CNAME csak akkor, ha a domain tényleg a GitHubra mutat. Korábban kiírva
   a duwras.github.io/duna_enterior/ cím egy még nem működő domainre
   irányítana át — az oldal senkinek nem jönne be. */
if (CEG.sajatDomainEl) writeFileSync(`${OUT}/CNAME`, `${CEG.domain}\n`);

/* Amíg az éles domain nincs bekötve, az oldal ideiglenes címeken (pages.dev,
   github.io) látszik. Ezeket ne indexelje a kereső: a saját domain élesítése
   után különben duplikált tartalomként versenyeznének vele. A _headers-t a
   Cloudflare Pages veszi figyelembe, a GitHub Pages egyszerűen fájlként
   szolgálja ki — ott nem árt. */
const fejlecek = [];

/* Alap biztonsági fejlécek. Nem véd új támadási felületet — a lap
   statikus —, de a három olcsó dolgot megcsinálja: nem hagyja a
   böngészőt tartalomtípust találgatni, nem szivárogtatja a teljes
   hivatkozó címet idegen kiszolgálónak, és nem enged idegen lapba
   ágyazást. 8. fázis.

   CSP SZÁNDÉKOSAN NINCS. A lap `<noscript><style>`-t és a
   sütikezelőben futásidőben létrehozott <script>-et is használ,
   tehát a szabály `'unsafe-inline'` nélkül eltörné az oldalt, azzal
   pedig alig érne többet a semminél. Fél CSP rosszabb, mint a
   nyíltan vállalt hiánya: lásd docs/LAUNCH-CHECKLIST.md 9. pont. */
const mindenLap = [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  X-Frame-Options: SAMEORIGIN',
  '  Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()'
];
if (!CEG.sajatDomainEl) mindenLap.push('  X-Robots-Tag: noindex, nofollow');
fejlecek.push(mindenLap.join('\n'));

/* A labor fejlesztői útvonal: akkor sem indexelhető, ha az éles domain
   már be van kötve. A lapon is ott a robots meta — ez a második zár. */
fejlecek.push('/lab/*\n  X-Robots-Tag: noindex, nofollow');

writeFileSync(`${OUT}/_headers`, fejlecek.join('\n\n') + '\n');

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

/* A két adatfájl összekötése slug szerint. Ugyanaz a szigor, mint fent:
   ha a terek.json olyan projektre vagy képre hivatkozik, ami a
   projektek.json-ban nincs, álljon meg a build. A térbeli réteg nem
   hivatkozhat olyasmire, amit az ügyfél időközben kivett. */
const terHiba = [];

/* ugyanaz a szigor a főoldal jeleneteire: a hét jelenet képei is a
   projektek.json-ból származnak, nem külön képtárból */
/* A `hiba` paraméter azért van, mert ugyanezt a vizsgálatot a flotta
   is használja — az viszont KÉSŐBB fut, mint a terHiba kiértékelése.
   Ha mindkettő ugyanabba a tömbbe írna, a flotta hibái csendben
   elvesznének egy már leellenőrzött listában. (Pontosan ez történt
   egyszer: egy nem létező képfájlnév átment a builden.) */
function keretEllenor(hol, k, hiba = terHiba) {
  const p = ELO.find((x) => x.slug === k.slug);
  if (!p) { hiba.push(`${hol}: nincs ilyen publikált projekt (${k.slug})`); return; }
  if (!p.kepek.some((x) => x.file === k.kep)) {
    hiba.push(`${hol}: nincs ilyen kép (${k.slug}/${k.kep})`);
  }
  if (k.nyilas && (!Array.isArray(k.nyilas) || k.nyilas.length !== 4)) {
    hiba.push(`${hol}: a nyilas [x,y,rx,ry] négy szám kell legyen`);
  }
}

const FOOLDAL = TEREK.$fooldal || null;
if (FOOLDAL) {
  (FOOLDAL.keretek || []).forEach((k, i) => keretEllenor(`$fooldal/keret ${i + 1}`, k));
  (FOOLDAL.metszet || []).forEach((k, i) => keretEllenor(`$fooldal/metszet ${i + 1}`, k));
  if (FOOLDAL.ajto) keretEllenor('$fooldal/ajto', FOOLDAL.ajto);
}

for (const [slug, ter] of Object.entries(TEREK)) {
  if (slug.startsWith('$')) continue;                 /* $sema, $fooldal — nem projekt */
  const p = ELO.find((x) => x.slug === slug);
  if (!p) { terHiba.push(`${slug}: nincs ilyen publikált projekt`); continue; }

  for (const szoba of ter.szobak || []) {
    for (const n of szoba.nezopontok || []) {
      if (!p.kepek.some((k) => k.file === n.kep)) {
        terHiba.push(`${slug}/${szoba.id}/${n.id}: nincs ilyen kép (${n.kep})`);
      }
      if (!Array.isArray(n.nyilas) || n.nyilas.length !== 4) {
        terHiba.push(`${slug}/${szoba.id}/${n.id}: a nyilas [x,y,rx,ry] négy szám kell legyen`);
      }
    }
  }
  for (const r of ter.reszletek || []) {
    if (!p.kepek.some((k) => k.file === r)) terHiba.push(`${slug}: nincs ilyen részletkép (${r})`);
  }
}
if (terHiba.length) {
  console.error('\n!! HIBA — a data/terek.json nem illeszkedik a projektekhez:\n  ' +
    terHiba.join('\n  ') + '\n');
  process.exit(1);
}

/* ---------- 2/b. a flotta ellenőrzése ----------

   Ugyanaz a szigor, plusz EGY tétel, ami csak itt értelmes: ha az
   ügyfél új hajót vesz fel az adminban, a flotta NE hallgassa el.
   Egy hiányzó sor némán rövidebb flottát adna, és senki nem venné
   észre. Inkább álljon meg a build, és kérje a bejegyzést. */
const ALLOMASOK = {
  vaz:     'Váz',
  felulet: 'Felület',
  belso:   'Belső',
  vizen:   'Vízen',
  studio:  'Stúdió'
};

const flottaHiba = [];
if (FLOTTA) {
  (FLOTTA.nyitas?.keretek || []).forEach((k, i) =>
    keretEllenor(`flotta/nyitás ${i + 1}`, k, flottaHiba));

  const felvett = new Set();
  for (const h of FLOTTA.hajok || []) {
    const p = ELO.find((x) => x.slug === h.slug);
    if (!p) { flottaHiba.push(`flotta/${h.slug}: nincs ilyen publikált projekt`); continue; }
    felvett.add(h.slug);
    if (h.borito && !p.kepek.some((k) => k.file === h.borito)) {
      flottaHiba.push(`flotta/${h.slug}: nincs ilyen borítókép (${h.borito})`);
    }
    for (const a of h.allomasok || []) {
      if (!ALLOMASOK[a]) flottaHiba.push(`flotta/${h.slug}: ismeretlen állomás (${a})`);
    }
    if (!['zaszlohajo', 'sorozat', 'archivum'].includes(h.rang)) {
      flottaHiba.push(`flotta/${h.slug}: a rang zaszlohajo | sorozat | archivum lehet`);
    }
  }
  for (const p of ELO.filter((x) => x.kategoria === 'hajo')) {
    if (!felvett.has(p.slug)) {
      flottaHiba.push(`${p.slug}: hajó kategóriájú projekt, de nincs a data/flotta.json hajok listájában`);
    }
  }
}
if (flottaHiba.length) {
  console.error('\n!! HIBA — a data/flotta.json nem illeszkedik a projektekhez:\n  ' +
    flottaHiba.join('\n  ') + '\n');
  process.exit(1);
}

/* ---------- 2/c. a készülés ellenőrzése ----------

   Ugyanaz a képellenőrzés, plusz három tétel, ami csak itt értelmes:

     1. A GERINC NEM MEHET VISSZAFELÉ. Az ANYAG → KÉZ → TÁRGY → TÉR →
        ÉLMÉNY sorrend a fejezet egyetlen állítása. Ha egy sorozatban
        a tér után újra anyag jönne, az nem hiányzó állomás, hanem
        rossz adat — és a látogató a léptéken venné észre, nem mi.
     2. LEGALÁBB KÉT KÜLÖNBÖZŐ LÉPTÉK. Ha minden lemez ugyanabban a
        léptékben van, nincs mit felfedni: az nem sorozat, csak képsor.
        Inkább ne legyen ott, mint gyengén.
     3. A ZÁRÓ HIVATKOZÁS LÉTEZIK. Minden sorozatnak meg kell tudnia
        válaszolni, hogy mi lett belőle — ez egy valódi projektcím.

   Hiányzó állomás viszont NEM hiba. A rendszer pont attól használható,
   hogy elviseli: a doboznak nincs tere, a kapunak nincs anyagállomása. */

const SZAKASZOK = {
  anyag:  'Anyag',
  kez:    'Kéz',
  targy:  'Tárgy',
  ter:    'Tér',
  elmeny: 'Élmény'
};
const SZAKASZ_SULY = { anyag: 0, kez: 1, targy: 2, ter: 3, elmeny: 4 };
const LEPTEKEK = { reszlet: 'Részlet', targy: 'Tárgy', ter: 'Tér' };

const keszHiba = [];
if (KESZULES) {
  (KESZULES.nyitas?.keretek || []).forEach((k, i) =>
    keretEllenor(`keszules/nyitás ${i + 1}`, k, keszHiba));

  if (KESZULES.muhely) keretEllenor('keszules/műhely', KESZULES.muhely, keszHiba);

  const azonositok = new Set();
  for (const s of KESZULES.sorozatok || []) {
    const hol = `keszules/${s.id}`;
    if (!s.id) { keszHiba.push('keszules: van azonosító nélküli sorozat'); continue; }
    if (azonositok.has(s.id)) keszHiba.push(`${hol}: két sorozat ugyanazzal az azonosítóval`);
    azonositok.add(s.id);

    if (!ELO.some((p) => p.slug === s.projekt)) {
      keszHiba.push(`${hol}: a projekt nincs meg (${s.projekt})`);
    }

    const all = s.allomasok || [];
    if (all.length < 2) keszHiba.push(`${hol}: legalább két állomás kell`);

    let elozo = -1;
    for (const [i, a] of all.entries()) {
      keretEllenor(`${hol}/${i + 1}`, a, keszHiba);
      if (!SZAKASZOK[a.szakasz]) {
        keszHiba.push(`${hol}/${i + 1}: ismeretlen szakasz (${a.szakasz}) — ${Object.keys(SZAKASZOK).join(' | ')}`);
        continue;
      }
      if (!LEPTEKEK[a.lepte]) {
        keszHiba.push(`${hol}/${i + 1}: ismeretlen lépték (${a.lepte}) — ${Object.keys(LEPTEKEK).join(' | ')}`);
      }
      if (SZAKASZ_SULY[a.szakasz] < elozo) {
        keszHiba.push(`${hol}/${i + 1}: a gerinc visszafelé megy (${a.szakasz} a(z) ` +
          `${Object.keys(SZAKASZ_SULY).find((k) => SZAKASZ_SULY[k] === elozo)} után)`);
      }
      elozo = Math.max(elozo, SZAKASZ_SULY[a.szakasz]);
    }

    const lepteFajta = new Set(all.map((a) => a.lepte).filter((l) => LEPTEKEK[l]));
    if (lepteFajta.size < 2) {
      keszHiba.push(`${hol}: legalább két különböző lépték kell (most: ${[...lepteFajta].join(', ') || 'egy sem'})`);
    }
  }
}
if (keszHiba.length) {
  console.error('\n!! HIBA — a data/keszules.json nem illeszkedik a projektekhez:\n  ' +
    keszHiba.join('\n  ') + '\n');
  process.exit(1);
}

/* ---------- 2/d. A SZEREPEK ----------

   Melyik kép MIRE van használva. Egyetlen helyen számoljuk ki, mert
   három dolognak kell ugyanaz a lista:

     1. a minőségellenőrzésnek (2/e) — mert nem minden kép egyenlő: egy
        teljes szélességű nyitóképkocka más küszöböt bír el, mint egy
        288 px-es rácsborító;
     2. a származékgyártásnak (3.) — a GYORS halmaz eddig ugyanezt a
        bejárást csinálta végig, külön, kézzel;
     3. a tartalommátrixnak (scripts/tartalom-matrix.mjs), ami ezt a
        fájlt importálja, hogy ne kettőzze meg a szabályt.

   A kulcs mindenütt `slug/fájlnév`. A számítás a
   scripts/forras-modell.mjs-ben van, mert a tartalommátrixnak
   BETŰRE ugyanaz kell — két másolat közül a második mindig lemarad. */

const SZEREP = szerepekSzamit({ ELO, TEREK, FLOTTA, KESZULES });

/* ---------- 2/e. A MESTER ----------

   MESTER          img/projektek/<slug>/<fájl>      — a repóban, ez a forrás
   SZÁRMAZÉK       deploy/img/.../<fájl>-800.avif   — minden buildnél újra
   GYORSÍTÓTÁR     .kepgyorstar/                    — eldobható

   A build SOHA nem ír a mesterek közé. Amit itt ellenőrzünk, az a
   fordítottja: nem került-e SZÁRMAZÉK a mesterek helyére. Ez egyszer
   már majdnem megtörtént máshol: valaki a közzétett oldalról menti le
   a képet, és azt teszi vissza forrásnak. Az eredmény kétszeres
   veszteséges kódolás, és semmi nem jelzi.

   A minőségi küszöb SZEREP szerint szigorú. Ami teljes szélességben
   áll, arra HIBA; ami rácsban, arra figyelmeztetés. Egy küszöb alatti
   kritikus kép csak NÉVRE SZÓLÓ, indokolt felmentéssel mehet át
   (data/forras.json → kepek → mentesseg). Ez a különbség a között,
   hogy „tudjuk, és le van írva” és a között, hogy „senki nem vette
   észre”. */

const FORRAS = existsSync('data/forras.json')
  ? JSON.parse(readFileSync('data/forras.json', 'utf8'))
  : null;

/* Ha a fájl nincs meg, ezek az alapértékek élnek — a build ugyanúgy
   ellenőriz, csak felmentés és jogi állapot nélkül. */
const MESTER = FORRAS?.mester || ALAP_MESTER;

const SZEREPTAR = FORRAS?.szerepek || {};
const kritikusE = (kulcs) => [...(SZEREP.get(kulcs) || [])]
  .some((sz) => SZEREPTAR[sz]?.kritikus === true);

/* Egy fejléc-olvasás képenként. 371 fájlon ~0,4 s, és enélkül a
   származékgyártás után derülne ki, hogy a forrás rossz — akkor
   viszont már ki is kódoltuk. */
const MESTERADAT = new Map();
for (const p of ELO) {
  for (const k of p.kepek) {
    const ut = `img/projektek/${p.slug}/${k.file}`;
    const st = statSync(ut);
    const m = await sharp(ut).metadata();
    MESTERADAT.set(`${p.slug}/${k.file}`, {
      slug: p.slug, file: k.file, ut,
      w: m.width, h: m.height,
      mp: (m.width * m.height) / 1e6,
      hosszu: Math.max(m.width, m.height),
      arany: m.width / m.height,
      bajt: st.size,
      bpp: st.size / (m.width * m.height),
      formatum: m.format,
      szinter: m.space
    });
  }
}

const mesterHiba = [];

/* A figyelmeztetésekből SOK van, és jogosan: az archívum fele küszöb
   alatti. Ha mind a kilencven kiíródna minden buildnél, két hét múlva
   senki nem olvasná el egyiket sem — és a kilencvenegyedik, ami tényleg
   új, észrevétlen maradna. Ezért itt CSOPORTOSÍTVA, számmal és három
   példával jelenik meg; a teljes lista a tartalommátrixban áll
   (npm run tartalom), ahol tételesen lehet vele dolgozni. */
const mesterFigyTetel = [];
const mesterFigy = {
  push: (szoveg, fajta = 'egyeb') => mesterFigyTetel.push({ fajta, szoveg })
};

for (const [kulcs, d] of MESTERADAT) {
  const projekt = FORRAS?.projektek?.[d.slug] || {};
  const kepAdat = FORRAS?.kepek?.[kulcs] || {};
  const szerepek = [...(SZEREP.get(kulcs) || [])];

  /* --- a) gyanús forráslánc: SZÁRMAZÉK került a mesterek közé --- */
  if (/-(400|800|1400)\.[^.]+$/.test(d.file)) {
    mesterHiba.push(`${kulcs}: a fájlnév származék-utótagot visel (-400/-800/-1400). ` +
      `A mester nem lehet a deploy/ mappából visszamentett kép.`);
  }
  if (['avif', 'webp'].includes(d.formatum)) {
    mesterHiba.push(`${kulcs}: a mester ${d.formatum.toUpperCase()} — ez a MI kimeneti ` +
      `formátumunk. Mesterként kétszeres veszteséges kódolást jelent. Kell: ${MESTER.formatum.join(' | ')}.`);
  }
  if (!MESTER.formatum.includes(d.formatum) && !['avif', 'webp'].includes(d.formatum)) {
    mesterHiba.push(`${kulcs}: nem támogatott mesterformátum (${d.formatum}). Kell: ${MESTER.formatum.join(' | ')}.`);
  }

  /* Ezek csak JELEK, nem bizonyítékok — ezért figyelmeztetés. A zirci
     apátság 800×800-as archív vágásai és a volvo-penta 800 px-es
     képe valódi eredetik: náluk a `vagott: true` némítja el. */
  if (!projekt.vagott && MESTER.szarmazekSzelessegek.includes(d.w)) {
    mesterFigy.push(`${kulcs}: a szélesség pontosan ${d.w} px — ennyi a származékunk is. ` +
      `Ha ez tényleg az eredeti, vegye fel a projekthez a "vagott": true jelzőt.`, 'szarmazek-gyanu');
  }
  if (d.bpp < (MESTER.gyanusBajtPerKeppont ?? 0.055)) {
    mesterFigy.push(`${kulcs}: ${d.bpp.toFixed(3)} bájt/képpont — erősen újratömörített forrás. ` +
      `Ha van kamerából jövő eredeti, az jobb mester.`, 'ujratomoritett');
  }

  /* --- b) színtér --- */
  if (MESTER.szinter && d.szinter && d.szinter !== MESTER.szinter) {
    mesterFigy.push(`${kulcs}: színtér ${d.szinter}, várt ${MESTER.szinter}. ` +
      `A sharp átkonvertálja, de a színek némán elmozdulhatnak.`, 'szinter');
  }

  /* --- c) oldalarány --- */
  const ar = MESTER.oldalarany || {};
  if (ar.min && ar.max && (d.arany < ar.min || d.arany > ar.max)) {
    const arSor = `${kulcs}: oldalarány ${d.arany.toFixed(2)} a ${ar.min}–${ar.max} sávon kívül. ` +
      `A mai elrendezés vagy szétesik rajta, vagy levágja a felét.`;
    if (kritikusE(kulcs)) mesterHiba.push(arSor); else mesterFigy.push(arSor, 'oldalarany');
  }

  /* --- d) felbontás, szerep szerint --- */
  const min = MESTER.minimum;
  const alatta = d.mp < min.megapixel || d.hosszu < min.hosszabbOldal;
  if (!alatta || !szerepek.length) continue;

  const mentes = kepAdat.mentesseg;
  const sor = `${kulcs}: ${d.w}×${d.h} (${d.mp.toFixed(2)} MP) — a küszöb ` +
    `${min.megapixel} MP / ${min.hosszabbOldal} px. Szerep: ${szerepek.join(', ')}.`;

  if (kritikusE(kulcs)) {
    if (mentes) continue;                       /* le van írva, tudunk róla */
    mesterHiba.push(sor + `\n     Ez KRITIKUS szerep. Vagy jobb mester kell, vagy egy ` +
      `névre szóló, indokolt felmentés a data/forras.json → kepek → "${kulcs}" → mentesseg alá.`);
  } else {
    mesterFigy.push(sor, 'kuszob-alatt');
  }
}

/* --- e) elavult felmentés: a kép már megfelel, vagy nincs is szerepe --- */
for (const [kulcs, adat] of Object.entries(FORRAS?.kepek || {})) {
  if (kulcs.startsWith('_') || !adat?.mentesseg) continue;
  const d = MESTERADAT.get(kulcs);
  if (!d) { mesterHiba.push(`forras.json: felmentés nem létező képre (${kulcs}).`); continue; }
  const min = MESTER.minimum;
  if (d.mp >= min.megapixel && d.hosszu >= min.hosszabbOldal) {
    mesterFigy.push(`${kulcs}: a felmentés FÖLÖSLEGES — a kép ma ${d.w}×${d.h} ` +
      `(${d.mp.toFixed(2)} MP), átmegy a küszöbön. Törölhető a forras.json-ból.`, 'elavult-felmentes');
  } else if (!kritikusE(kulcs)) {
    mesterFigy.push(`${kulcs}: a felmentés fölösleges — a képnek nincs kritikus szerepe.`,
      'elavult-felmentes');
  }
}

const FIGY_NEV = {
  'kuszob-alatt':      'küszöb alatti felbontás, nem kritikus szerepben',
  'ujratomoritett':    'erősen újratömörített forrás',
  'szarmazek-gyanu':   'gyanús forráslánc — származékméretű mester',
  'oldalarany':        'szélsőséges oldalarány',
  'szinter':           'nem sRGB színtér',
  'elavult-felmentes': 'fölöslegessé vált felmentés a forras.json-ban',
  'egyeb':             'egyéb'
};
if (mesterFigyTetel.length) {
  const reszletes = process.argv.includes('--forras-reszletes');
  const csoport = new Map();
  for (const t of mesterFigyTetel) {
    if (!csoport.has(t.fajta)) csoport.set(t.fajta, []);
    csoport.get(t.fajta).push(t.szoveg);
  }
  console.log(`\n-- FORRÁS — ${mesterFigyTetel.length} észrevétel, ${csoport.size} fajta. ` +
    `A build nem áll meg tőlük.`);
  for (const [fajta, lista] of [...csoport].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`   ${String(lista.length).padStart(3)} × ${FIGY_NEV[fajta] || fajta}`);
    for (const s of reszletes ? lista : lista.slice(0, 2)) console.log(`         ${s}`);
    if (!reszletes && lista.length > 2) console.log(`         … és további ${lista.length - 2}`);
  }
  console.log(`   Teljes, tételes lista:  npm run tartalom` +
    (reszletes ? '' : `   ·   itt mind:  node build.mjs --forras-reszletes`) + '\n');
}
if (mesterHiba.length) {
  console.error('\n!! HIBA — a mesterképek nem felelnek meg a data/forras.json szabályának:\n  ' +
    mesterHiba.join('\n  ') +
    '\n\n  A küszöb és a felmentés rendszerét a docs/PHASE-6-SOURCE-SYSTEM.md 2. és 4. pontja írja le.\n');
  process.exit(1);
}

/* ---------- 2/f. A SZINT-1 SZOBÁK ELLENŐRZÉSE ----------

   Egy bejárható tér nem attól bejárható, hogy van hozzá kép. A 2/a
   lépés eddig azt nézte, LÉTEZIK-e a hivatkozott fájl. Ez a lépés azt
   nézi, TELJES-e a kameraállás.

   A kimenet szándékosan táblázatos — PROJEKT / KAMERA / MEZŐ / VÁRT /
   TALÁLT —, mert a hibát nem az javítja, aki írta, hanem az, aki fél
   év múlva új teret vesz fel.

   Amit NEM követelünk meg: mélységtérképet. A szerzői mélység (a
   négyszámos `nyilas`) MA ÉRVÉNYES ÁLLAPOT, nem átmeneti megoldás.
   Lásd a docs/PHASE-6-SOURCE-SYSTEM.md 7. pontját. */

const IDOALLAPOT = ['nappal', 'aranyora', 'ejjel'];
const KUSZOBFAJTA = ['ajto', 'ablak', 'kapu'];
const ATMENET = ['kuszob', 'vagas', 'uszas'];

const szobaHiba = [];
const rov = (v) => v === undefined ? 'nincs mező'
  : v === null ? 'null'
    : Array.isArray(v) ? `[${v.join(', ')}]`
      : typeof v === 'object' ? JSON.stringify(v)
        : String(v);

function szobaKifogas(projekt, kamera, mezo, vart, talalt) {
  szobaHiba.push({ projekt, kamera, mezo, vart, talalt: rov(talalt) });
}

for (const [slug, ter] of Object.entries(TEREK)) {
  if (slug.startsWith('$') || ter.szint !== 1) continue;

  const pontok = [];
  for (const szoba of ter.szobak || []) {
    for (const n of szoba.nezopontok || []) pontok.push({ szoba, n });
  }

  if (!pontok.length) {
    szobaKifogas(slug, '—', 'szobak[].nezopontok[]', 'legalább 1 kameraállás', 0);
    continue;
  }
  if (!(ter.anyagok || []).length) {
    szobaKifogas(slug, '—', 'anyagok[]', 'legalább 1 anyag', ter.anyagok);
  }
  if (!ter.hangulat?.alap) {
    szobaKifogas(slug, '—', 'hangulat.alap', IDOALLAPOT.join(' | '), ter.hangulat?.alap);
  } else if (!IDOALLAPOT.includes(ter.hangulat.alap)) {
    szobaKifogas(slug, '—', 'hangulat.alap', IDOALLAPOT.join(' | '), ter.hangulat.alap);
  }
  for (const a of ter.hangulat?.allapotok || []) {
    if (!IDOALLAPOT.includes(a)) {
      szobaKifogas(slug, '—', 'hangulat.allapotok[]', IDOALLAPOT.join(' | '), a);
    }
  }

  const azon = new Set();
  for (const { szoba, n } of pontok) {
    const kam = `${szoba.id || '?'}/${n.id || '?'}`;

    if (!n.id) szobaKifogas(slug, kam, 'nezopont.id', 'egyedi azonosító', n.id);
    else if (azon.has(n.id)) szobaKifogas(slug, kam, 'nezopont.id', 'egyedi a téren belül', n.id);
    azon.add(n.id);

    if (!n.nev) szobaKifogas(slug, kam, 'nezopont.nev', 'olvasható név', n.nev);
    if (!n.kep) szobaKifogas(slug, kam, 'nezopont.kep', 'fájlnév a projektek.json-ból', n.kep);

    /* BELÉPÉS: minden nézőpontnak kell küszöbfajtája — ez mondja meg,
       MILYEN átmenettel érkezünk ide. */
    if (!KUSZOBFAJTA.includes(n.kuszob?.fajta)) {
      szobaKifogas(slug, kam, 'kuszob.fajta', KUSZOBFAJTA.join(' | '), n.kuszob?.fajta);
    }

    /* MÉLYSÉG: a lapos képnek nincs, a többinek kell. A `nyilas` a
       szerzői mélység — négy szám, kézzel a fotóról. */
    if (!Array.isArray(n.nyilas) || n.nyilas.length !== 4) {
      szobaKifogas(slug, kam, 'nyilas', '[x, y, rx, ry] — négy szám 0–1 között', n.nyilas);
    } else if (n.nyilas.some((v) => typeof v !== 'number' || v < 0 || v > 1)) {
      szobaKifogas(slug, kam, 'nyilas', 'mind a négy szám 0 és 1 között', n.nyilas);
    } else if (!n.lapos) {
      const [x, y, rx, ry] = n.nyilas;
      if (x - rx < 0 || x + rx > 1 || y - ry < 0 || y + ry > 1) {
        szobaKifogas(slug, kam, 'nyilas', 'a nyílás a képkockán belül marad', n.nyilas);
      }
      if (rx <= 0.02 || ry <= 0.02) {
        szobaKifogas(slug, kam, 'nyilas', 'rx és ry > 0.02 (látható nyílás)', [rx, ry]);
      }
    }

    if (n.hangulat && !IDOALLAPOT.includes(n.hangulat)) {
      szobaKifogas(slug, kam, 'hangulat', IDOALLAPOT.join(' | '), n.hangulat);
    }

    /* KIJÁRAT: legalább egy megjelölt pont vagy egy következő
       nézőpont. Zsákutca nem lehet — az a tér, amiből nincs tovább,
       nem tér, hanem kép. */
    const van = (n.kapuk || []).length > 0;
    const vanTovabb = pontok.length > 1;
    if (!van && !vanTovabb) {
      szobaKifogas(slug, kam, 'kapuk[]', 'legalább 1 kijárat vagy 1 további nézőpont', 0);
    }
    for (const [i, k] of (n.kapuk || []).entries()) {
      if (!k.cimke) szobaKifogas(slug, kam, `kapuk[${i}].cimke`, 'olvasható címke', k.cimke);
      if (!Array.isArray(k.pozicio) || k.pozicio.length !== 2 ||
        k.pozicio.some((v) => typeof v !== 'number' || v < 0 || v > 1)) {
        szobaKifogas(slug, kam, `kapuk[${i}].pozicio`, '[x, y] 0–1 között', k.pozicio);
      }
      if (!/^(adatlap|nezopont:.+|projekt:.+)$/.test(k.cel || '')) {
        szobaKifogas(slug, kam, `kapuk[${i}].cel`, 'adatlap | nezopont:<id> | projekt:<slug>', k.cel);
      } else if (k.cel.startsWith('nezopont:')) {
        const cel = k.cel.slice(9);
        if (!pontok.some(({ n: m }) => m.id === cel)) {
          szobaKifogas(slug, kam, `kapuk[${i}].cel`, 'létező nézőpont ebben a térben', k.cel);
        }
      } else if (k.cel.startsWith('projekt:')) {
        const cel = k.cel.slice(8);
        if (!ELO.some((p) => p.slug === cel)) {
          szobaKifogas(slug, kam, `kapuk[${i}].cel`, 'publikált projekt', k.cel);
        }
      }
    }

    /* --- a JÖVŐ mezői. Nem kötelezők; ha ITT VANNAK, érvényesek
       kell legyenek. Így egy új tér szerzője nem tud rossz alakban
       felvenni mélységtérképet vagy kameraállást. --- */
    const m = n.melyseg;
    if (m !== undefined) {
      if (typeof m !== 'object' || m === null) {
        szobaKifogas(slug, kam, 'melyseg', 'objektum { z, bizalom, terkep, fokusz }', m);
      } else {
        if (m.z !== undefined && (typeof m.z !== 'object' || ['kozel', 'koz', 'tav']
          .some((r) => typeof m.z[r] !== 'number'))) {
          szobaKifogas(slug, kam, 'melyseg.z', '{ kozel, koz, tav } — három szám', m.z);
        }
        if (m.bizalom !== undefined && !['szerzoi', 'mert', 'becsult'].includes(m.bizalom)) {
          szobaKifogas(slug, kam, 'melyseg.bizalom', 'szerzoi | mert | becsult', m.bizalom);
        }
        if (m.terkep !== undefined && m.terkep !== null &&
          !existsSync(`img/melyseg/${slug}/${m.terkep}`)) {
          szobaKifogas(slug, kam, 'melyseg.terkep', `létező fájl az img/melyseg/${slug}/ alatt`, m.terkep);
        }
        if (m.fokusz !== undefined && (!Array.isArray(m.fokusz) || m.fokusz.length !== 2 ||
          m.fokusz.some((v) => typeof v !== 'number' || v < 0 || v > 1))) {
          szobaKifogas(slug, kam, 'melyseg.fokusz', '[x, y] 0–1 között', m.fokusz);
        }
      }
    }

    const kv = n.vagas;
    if (kv !== undefined) {
      if (typeof kv !== 'object' || kv === null) {
        szobaKifogas(slug, kam, 'vagas', 'objektum { mobil, asztali }', kv);
      } else {
        for (const oldal of ['mobil', 'asztali']) {
          const v = kv[oldal];
          if (v === undefined) continue;
          if (!Array.isArray(v) || v.length !== 4 ||
            v.some((q) => typeof q !== 'number' || q < 0 || q > 1)) {
            szobaKifogas(slug, kam, `vagas.${oldal}`, '[x, y, w, h] 0–1 között', v);
          }
        }
      }
    }

    if (n.atmenet !== undefined && !ATMENET.includes(n.atmenet)) {
      szobaKifogas(slug, kam, 'atmenet', ATMENET.join(' | '), n.atmenet);
    }
    if (n.szomszed !== undefined) {
      if (!Array.isArray(n.szomszed)) {
        szobaKifogas(slug, kam, 'szomszed', 'nézőpont-azonosítók tömbje', n.szomszed);
      } else for (const s of n.szomszed) {
        if (!pontok.some(({ n: q }) => q.id === s)) {
          szobaKifogas(slug, kam, 'szomszed[]', 'létező nézőpont ebben a térben', s);
        }
      }
    }
    if (n.sorrend !== undefined && typeof n.sorrend !== 'number') {
      szobaKifogas(slug, kam, 'sorrend', 'szám', n.sorrend);
    }

    /* VALÓDI KAMERAÁLLÁS. Ma egyik tér sem adja meg, és nem is
       találjuk ki: egy fényképről a kamera helyét megmérni kell, nem
       becsülni. Ha egyszer egy fotós lézeres helyszínrajzzal jön, ez
       a két mező fogadja. Méter és fok, a szoba saját origójától. */
    if (n.allas !== undefined) {
      if (typeof n.allas !== 'object' || n.allas === null ||
        ['x', 'y', 'z'].some((t) => typeof n.allas[t] !== 'number')) {
        szobaKifogas(slug, kam, 'allas', '{ x, y, z } — méter a szoba origójától', n.allas);
      }
    }
    if (n.irany !== undefined) {
      if (typeof n.irany !== 'object' || n.irany === null ||
        typeof n.irany.azimut !== 'number' || typeof n.irany.emelkedes !== 'number') {
        szobaKifogas(slug, kam, 'irany', '{ azimut, emelkedes } — fok', n.irany);
      } else if (n.irany.azimut < 0 || n.irany.azimut >= 360 ||
        n.irany.emelkedes < -90 || n.irany.emelkedes > 90) {
        szobaKifogas(slug, kam, 'irany', 'azimut 0–360, emelkedes -90–90',
          [n.irany.azimut, n.irany.emelkedes]);
      }
    }
  }
}

if (szobaHiba.length) {
  const osz = ['PROJEKT', 'KAMERA', 'MEZŐ', 'VÁRT', 'TALÁLT'];
  const sorok = szobaHiba.map((h) => [h.projekt, h.kamera, h.mezo, h.vart, h.talalt]);
  const szel = osz.map((c, i) => Math.max(c.length, ...sorok.map((s) => String(s[i]).length)));
  const sor = (s) => '  ' + s.map((v, i) => String(v).padEnd(szel[i])).join('  ').trimEnd();
  console.error('\n!! HIBA — hiányos szint-1 tér a data/terek.json-ban:\n');
  console.error(sor(osz));
  console.error('  ' + szel.map((w) => '-'.repeat(w)).join('  '));
  for (const s of sorok) console.error(sor(s));
  console.error('\n  A mezőket a docs/PHASE-6-SOURCE-SYSTEM.md 5. és 6. pontja írja le.\n');
  process.exit(1);
}

/* ---------- 3. képek webes méretben ---------- */

/* A forrás 1800 px hosszabb oldal. A rácsban és a lapozóban ennél
   sokkal kisebb kell — a nagy fájl csak lassítana.

   A -400 a 6. fázisig CSAK az elsőbbségi képekből készült. Emiatt a
   projektlapok galériája — 268–400 px széles rácscellák — a 800 px-es
   változatot töltötte le, képenként ~95 KB-ot: egy 23 fotós hajólap
   végiggörgetése 2,2 MB volt. A -400 JPEG minden képből elkészül;
   egy JPEG-kódolás olcsó (a drága az AVIF), és a gyorstár úgyis csak
   egyszer fizeti ki. Az elsőbbségi képek származékai bájtra
   változatlanok — ott eddig is megvolt mind a három méret. */
const MERETEK = [
  { utotag: '-400', szeles: 400 },
  { utotag: '-800', szeles: 800 },
  { utotag: '-1400', szeles: 1400 }
];

/* ---- TELJES SZÉLESSÉGŰ SZEREPEK: ezekhez -1800 is készül ----

   Mérve (VISUAL-CLARITY, 1. rész): a színpad 1440 px-es képmezőn
   1425–1503 CSS px-en áll, a mutatókövetés és a rétegnagyítás miatt a
   közeli réteg a legszélesebb. Készülék-képpontban ez 1,25-ös DPR-en
   1781–1879 px, kettesen 2850–3006 px — a létrán viszont 1400 px volt
   a legnagyobb fok. A böngésző jól választott, csak nem volt miből:
   1,27–1,34-szeres FELNAGYÍTÁS jutott minden fényképre, kettes DPR-en
   2,0–2,15-szörös. Ez az, ami globális lágyságnak látszik.

   A lépcső nem mindenhol nő: 371 kép × 3 formátum × egy újabb fok a
   build idejét és a tárat is megháromszorozná azért, hogy a galéria
   19. fotója is nagyobb legyen. Csak az kapja meg, ami TELJES
   KÉPMEZŐBEN áll — a szerepkiosztás már tudja, melyik az.

   A mesterek 1500–1800 px szélesek, a `withoutEnlargement` pedig nem
   hazudik felbontást: ahol a mester kisebb, ott a -1800 származék a
   mester méretén marad, és a srcset `w` értéke a valódi szélesség.

   A `keszules-muhely` NINCS a listán, pedig a szereptár „teljes
   szélességben”-t ír róla: a keszules.css mérve 520 px-es dobozban
   állítja, és a jelölése -400/-800 lépcsőt kér. Egy -1800 származék ott
   soha nem hivatkozódna meg — csak build-idő és lemez. A CSS-nek
   hiszünk, nem a leírásnak. */
const TELJES_SZEREPEK = new Set([
  'szint1-nezopont', 'fooldal-jelenet',
  'flotta-nyitas', 'keszules-nyitas'
]);
const teljesE = (kulcs) => [...(SZEREP.get(kulcs) || [])]
  .some((sz) => TELJES_SZEREPEK.has(sz));
const MERET_1800 = { utotag: '-1800', szeles: 1800 };

/* ---- ELSŐBBSÉGI KÉPEK: ezekből AVIF és WebP is készül ----

   Nem mindegyikből. Egy AVIF kódolás nagyságrenddel lassabb, mint egy
   JPEG, és 371 kép × 2 méret × 2 formátum megháromszorozná a build
   idejét azért, hogy a galéria 19. fotója is 40%-kal kisebb legyen —
   olyan képnél, amit a látogatók töredéke tölt le.

   Amit viszont MINDENKI letölt, az elsőbbséget kap:
     1. a főoldal jeleneteinek képei (köztük az LCP-keret)
     2. a bejárható terek nézőpontjai és részletei
     3. minden projekt borítója (a rács és az alaprajz ebből áll)

   A többi kép marad progresszív JPEG — pontosan úgy, mint eddig.

   6. fázis: ez a halmaz KORÁBBAN külön, kézzel bejárta ugyanazt az öt
   adatszerkezetet, amit a 2/d lépés is bejár. Két lista, egy szabály —
   és a második mindig azzal marad le, hogy valaki elfelejti bővíteni.
   Ma a szerepkiosztás A definíció: aminek van szerepe, az elsőbbséget
   kap. Egyetlen kép sem esett ki és egyetlen sem került be a
   váltáskor (a származékok bájtra azonosak maradtak). */
const GYORS = new Set(SZEREP.keys());

/* ---- EGY KÉPRE SZABOTT MINŐSÉG ----

   A 4. fázis mérése szerint a /flotta.html asztali első betöltése
   479 KB volt 350 KB helyett, és ebből 268 KB EGYETLEN AVIF: a
   HABLEÁNY a Dunán. Folyóvíz-textúra és apró fedélzeti részlet egy
   képen — a globális q46 ezen nem tud fogni.

   A globális beállítást NEM változtatjuk: az mind a 444 származékot
   újrakódolná, és némán elmozdítaná a 3. fázis összes mért számát.
   Ehelyett kép szerinti kivétel, ami a gyorstár kulcsába is beleszámít,
   tehát pontosan egy fájl kódolódik újra.

   Csak akkor kerüljön ide kép, ha MÉRTÉK, hogy kilóg. */
const KEPMINOSEG = {
  'duna-cruises-hableany/01.jpg': { avif: 36 }
};

/* A tényleges kimeneti méret: explicit width/height nélkül a böngésző
   nem tud helyet foglalni, és a lap ugrik betöltés közben. A források
   nem azonos oldalarányúak, tehát ezt mérni kell, nem feltételezni. */
const KEPMERET = new Map();

/* ---- gyorstár ----

   Egy AVIF kódolás fél másodperc; teljes újrakódolással a build két
   percig fut, és a CI is annyit fizetne minden apró szövegjavításért.
   A kimenet viszont determinisztikus: ugyanaz a forrás + ugyanaz a
   beállítás = ugyanaz a bájtsor. Ezért a származékok egy verziózott
   gyorstárba kerülnek, és amíg a forrás nem változott, onnan jönnek.

   A `.kepgyorstar/` nincs verziókövetve. Ha nincs meg, minden pontosan
   úgy épül, mint enélkül — csak lassabban. A BEALLITAS bélyeg része a
   kulcsnak: ha a minőség vagy a méret változik, a régi tár magától
   érvénytelen lesz. */
const TAR = '.kepgyorstar';
const BEALLITAS = 'j78-w72-a46e4-v1';
mkdirSync(TAR, { recursive: true });

async function szarmazek(kulcs, forras, mtime, szeles, kit) {
  /* a képre szabott minőség a gyorstár kulcsának is része — enélkül a
     tárban ragadna a régi, nagyobb fájl */
  const sajat = KEPMINOSEG[kulcs] || {};
  const jel = sajat[kit] ? `q${sajat[kit]}_` : '';
  const nev = `${TAR}/${BEALLITAS}_${jel}${kulcs.replace(/[\\/]/g, '_')}_${szeles}.${kit}`;
  if (existsSync(nev) && statSync(nev).mtimeMs >= mtime) {
    const buf = readFileSync(nev);
    return { data: buf, tarbol: true };
  }
  const p = sharp(forras).resize({ width: szeles, withoutEnlargement: true });
  const { data, info } = await (
    kit === 'jpg' ? p.jpeg({ quality: sajat.jpg || 78, mozjpeg: true, progressive: true })
      : kit === 'webp' ? p.webp({ quality: sajat.webp || 72 })
        : p.avif({ quality: sajat.avif || 46, effort: 4 })
  ).toBuffer({ resolveWithObject: true });
  writeFileSync(nev, data);
  return { data, info, tarbol: false };
}

let keszult = 0;
let gyorsult = 0;
let ujraszamolt = 0;
for (const p of ELO) {
  const dir = `${OUT}/img/projektek/${p.slug}`;
  for (const k of p.kepek) {
    const kulcs = `${p.slug}/${k.file}`;
    const ut = `img/projektek/${p.slug}/${k.file}`;
    const forras = readFileSync(ut);
    const mtime = statSync(ut).mtimeMs;
    const alap = k.file.replace(/\.[^.]+$/, '');

    /* A méretet a gyorstárból jövő fájlból is tudni kell — a
       width/height nélkül a lap ugrana betöltés közben. */
    const fokok = teljesE(kulcs) ? [...MERETEK, MERET_1800] : MERETEK;
    for (const m of fokok) {
      const kitek = GYORS.has(kulcs) ? ['jpg', 'webp', 'avif'] : ['jpg'];
      for (const kit of kitek) {
        const r = await szarmazek(kulcs, forras, mtime, m.szeles, kit);
        writeFileSync(`${dir}/${alap}${m.utotag}.${kit}`, r.data);
        if (!r.tarbol) ujraszamolt++;
        if (kit === 'jpg') keszult++; else gyorsult++;
      }
      const meta = await sharp(`${dir}/${alap}${m.utotag}.jpg`).metadata();
      KEPMERET.set(kulcs + m.utotag, [meta.width, meta.height]);
    }
  }
}

/* ---------- 3/b. arculati képek ----------

   A fejléc logója 1230×313-as PNG (35 KB), és 160×40-ben jelenik meg —
   minden lapon, a hajtás fölött. Ez több bájt volt, mint a főoldal
   nyitóképe. Az eredeti marad, ahol van; mellé kerül egy 320 px-es
   WebP és AVIF, és a jelölés azt kéri először. */
/* ---------- 3/c. a közösségi kép ----------

   Egy 1200×630-as JPEG, amit a Facebook / LinkedIn / Slack előnézet
   kér. Nem új fotó: MEGLÉVŐ mesterből vágjuk, a data/forras.json
   `kozossegi` bejegyzése szerint. A fokusz mondja meg, hova essen a
   vágás közepe — egy 3:2-es belsőt 1.91:1-re vágni felül-alul vág,
   és a vágás nem mindegy.

   Ha a bejegyzés hiányzik vagy a kép nincs meg, egyszerűen nem
   készül el, és az og:image kimarad a lapokból. */
const KOZOSSEGI = (() => {
  const k = FORRAS?.kozossegi;
  if (!k?.slug || !k?.kep) return null;
  const ut = `img/projektek/${k.slug}/${k.kep}`;
  if (!existsSync(ut)) return null;
  /* A leírás nem íródik kétszer: a képnek EGY alt szövege van, és az
     a projektek.json-ban él — ugyanaz, amit a galéria mond. */
  const p = ELO.find((x) => x.slug === k.slug);
  const alt = p?.kepek.find((x) => x.file === k.kep)?.alt || p?.cim || '';
  return { ...k, ut, alt, fajl: 'img/brand/kozossegi.jpg', szeles: 1200, magas: 630 };
})();

if (KOZOSSEGI) {
  const [fx, fy] = KOZOSSEGI.fokusz || [0.5, 0.5];
  const m = MESTERADAT.get(`${KOZOSSEGI.slug}/${KOZOSSEGI.kep}`);
  /* a legnagyobb 1200×630 arányú kivágás, a fókusz köré igazítva */
  const cel = KOZOSSEGI.szeles / KOZOSSEGI.magas;
  const [vw, vh] = m.arany > cel
    ? [Math.round(m.h * cel), m.h]
    : [m.w, Math.round(m.w / cel)];
  const bx = Math.max(0, Math.min(m.w - vw, Math.round(fx * m.w - vw / 2)));
  const by = Math.max(0, Math.min(m.h - vh, Math.round(fy * m.h - vh / 2)));
  writeFileSync(`${OUT}/${KOZOSSEGI.fajl}`, await sharp(KOZOSSEGI.ut)
    .extract({ left: bx, top: by, width: vw, height: vh })
    .resize(KOZOSSEGI.szeles, KOZOSSEGI.magas, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true }).toBuffer());
}

for (const nev of ['fejlec-logo']) {
  const be = `img/brand/${nev}.png`;
  if (!existsSync(be)) continue;
  const forras = readFileSync(be);
  writeFileSync(`${OUT}/img/brand/${nev}-320.webp`,
    await sharp(forras).resize({ width: 320, withoutEnlargement: true }).webp({ quality: 88 }).toBuffer());
  writeFileSync(`${OUT}/img/brand/${nev}-320.avif`,
    await sharp(forras).resize({ width: 320, withoutEnlargement: true }).avif({ quality: 60, effort: 4 }).toBuffer());
}

/* Az EU-infoblokk (KTK 2020 szerint kötelező) MINDEN lap alján ott van,
   400×276-os PNG-ként, és 232 CSS px-en jelenik meg. 13,9 KB — több,
   mint a fejléc logója volt a javítás előtt. Ugyanaz a kezelés: 232 és
   464 px (a kétszeres kijelzőhöz), AVIF és WebP, az eredeti PNG marad
   tartaléknak. A jelölés a partials/lablec.html-ben van.

   Nem méretezzük át magát a forrást: kötelező tájékoztatási elem, az
   eredeti fájl marad, ahol van. */
for (const nev of ['eu-infoblokk-erfa']) {
  const be = `img/brand/${nev}.png`;
  if (!existsSync(be)) continue;
  const forras = readFileSync(be);
  for (const sz of [232, 464]) {
    writeFileSync(`${OUT}/img/brand/${nev}-${sz}.webp`,
      await sharp(forras).resize({ width: sz, withoutEnlargement: true }).webp({ quality: 86 }).toBuffer());
    writeFileSync(`${OUT}/img/brand/${nev}-${sz}.avif`,
      await sharp(forras).resize({ width: sz, withoutEnlargement: true }).avif({ quality: 62, effort: 6 }).toBuffer());
  }
}

/* A favicon 61×61-es RGBA PNG, 5,1 KB — minden lap lekéri, és a
   böngésző 16–32 px-en rajzolja ki. Paletta-kvantálással 1,9 KB, és
   ugyanaz a rajz. A FORRÁS nem változik: a deploy/ példánya íródik
   felül, tehát a fájlnév és a tizennégy <link rel="icon"> érintetlen. */
if (existsSync('img/brand/favicon.png')) {
  writeFileSync(`${OUT}/img/brand/favicon.png`,
    await sharp('img/brand/favicon.png').png({ compressionLevel: 9, palette: true }).toBuffer());
}

/* ---------- 4. sablonok ---------- */

const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const kep = (slug, file, meret) =>
  `img/projektek/${slug}/${file.replace(/\.[^.]+$/, '')}${meret}.jpg`;

/* ---------- <picture>: AVIF → WebP → JPEG ----------

   Gyökérből induló útvonalat ad vissza. Oka: a 6. lépés csak a href és
   a src attribútumokat írja át az aloldalakon, a srcset-et és a
   data-srcset-et nem — egy relatív srcset tehát némán törött képet adna
   a projektlapokon. Ami a gyökérből indul, mindenhonnan ugyanoda mutat.

   Ahol nincs AVIF/WebP változat (a nem elsőbbségi képek), ott egyetlen
   <img> marad, srcset-tel. A jelölés nem hazudik formátumról, ami
   nincs a lemezen. */
const kepUt = (slug, file, meret, kit) =>
  `/img/projektek/${slug}/${file.replace(/\.[^.]+$/, '')}${meret}.${kit}`;

function kepMeret(slug, file, meret) {
  return KEPMERET.get(`${slug}/${file}${meret}`) || [1400, 1050];
}

/* o: { sizes, nagy, alt, eager, osztaly, extra, keses }
   keses = igaz  →  data-src / data-srcset, a szkript tölti be közeledéskor */
function pictureKep(slug, file, alt, o = {}) {
  const nagy = o.nagy || '-1400';
  const [w, h] = kepMeret(slug, file, nagy);
  const lepcso = o.lepcso || ['-800', '-1400'];

  /* A `w` leíró a VALÓDI szélesség, nem a fok neve.

     Eddig a fok nevéből jött: a -1400 származék `1400w`-t kapott akkor
     is, ha a mester 1200 px széles volt, és a `withoutEnlargement`
     miatt a fájl is 1200 px maradt. A böngésző így egy nem létező
     felbontásra tervezett — és a két azonos méretű fok közül (600 px-es
     mesternél a -800 és a -1400 bájtra ugyanaz) fölöslegesen a
     nagyobbnak hazudottat töltötte le.

     Ugyanez fordítva is számít: a most bevezetett -1800 fok ott, ahol a
     mester 1500 px, 1500w-t jelent. Ha 1800w-nak hazudnánk, a böngésző
     azt hinné, van tartalék DPR-re — és megint alulméretezne.

     Az azonos szélességű fokokból egy marad: két jelölt ugyanazzal a
     `w` értékkel nem választás, csak bájt a dróton. */
  const sorozat = (kit) => {
    const latott = new Set();
    return lepcso.map((m) => {
      /* szigorú keresés: ami nem készült el, az nem is kerülhet a
         srcset-be — a -1800 fok csak a teljes szélességű szerepeknél van */
      const sz = (KEPMERET.get(`${slug}/${file}${m}`) || [])[0];
      if (!sz || latott.has(sz)) return '';
      latott.add(sz);
      return `${kepUt(slug, file, m, kit)} ${sz}w`;
    }).filter(Boolean).join(', ');
  };
  const van = GYORS.has(`${slug}/${file}`);
  const s = o.keses ? 'data-srcset' : 'srcset';

  const forrasok = van
    ? `<source type="image/avif" ${s}="${sorozat('avif')}" sizes="${o.sizes || '100vw'}">
      <source type="image/webp" ${s}="${sorozat('webp')}" sizes="${o.sizes || '100vw'}">`
    : '';

  const kepAttr = [
    o.keses ? `data-src="${kepUt(slug, file, nagy, 'jpg')}"` : `src="${kepUt(slug, file, nagy, 'jpg')}"`,
    `${s}="${sorozat('jpg')}"`,
    `sizes="${o.sizes || '100vw'}"`,
    `width="${w}" height="${h}"`,
    `alt="${esc(alt || '')}"`,
    alt ? '' : 'aria-hidden="true"',
    'decoding="async"',
    o.eager ? 'fetchpriority="high"' : 'loading="lazy"',
    o.extra || ''
  ].filter(Boolean).join(' ');

  return `<picture${o.osztaly ? ` class="${o.osztaly}"` : ''}>${forrasok}
      <img ${kepAttr}></picture>`;
}

/* A --k a rácsban elfoglalt hely: ettől nem egyszerre, hanem egymás
   után tárulnak fel a kártyák. Hatnál tovább nem érdemes késleltetni,
   mert a sor végét már senki nem várná ki. */
function kartya(p, i = 0) {
  const elso = p.kiemelt || p.kepek[0].file;
  const alt = p.kepek.find((k) => k.file === elso)?.alt || p.cim;
  /* A borító MÉRT megjelenési mérete a rácsban 288–330 CSS px: a
     .racs auto-fill minmax(288px, 1fr), 1360 px-es tartalomszélességgel
     négy hasáb, 1000 px alatt kettő, 660 px alatt egy. A korábbi
     „33vw” ennél jóval nagyobbat kért (1440-en 475 px), ezért a
     böngésző soha nem választotta volna a 400-as változatot — a
     lépcsőt és a sizes-t EGYÜTT kellett javítani, külön-külön egyik
     sem ért volna semmit. A -400 minden borítóból létezik (GYORS). */
  const borito = pictureKep(p.slug, elso, alt, {
    nagy: '-800',
    lepcso: ['-400', '-800'],
    sizes: '(max-width: 659px) 92vw, (max-width: 999px) 46vw, 330px'
  });
  return `<a class="kartya jon" style="--k:${i % 6}" href="referenciak/${p.slug}/" data-kat="${esc(p.kategoria)}">
          <div class="keret">${borito}<span class="jel" aria-hidden="true">→</span></div>
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

/* ugyanez a négy ember a Kapcsolat és az Impresszum oldalon, bővebben */
const kapcsolatKartyak = CEG.kapcsolatok.map((k) => `<div class="szemely-kartya">
            <b>${esc(k.nev)}</b>
            <span class="beosztas">${esc(k.beosztas)}</span>
            <a href="tel:${esc(k.telefonHivas)}">${esc(k.telefon)}</a>
            <a href="mailto:${esc(k.email)}">${esc(k.email)}</a>
          </div>`).join('\n          ');

/* A pályázati adattartalom szó szerint a régi oldalról. A KTK 2020
   szerint ez kötelező tájékoztatási elem — nem rövidíthető. */
const palyazatTartalom = PALYAZATOK.map((p) => `<article class="palyazat jon" id="${esc(p.slug)}">
        <div class="palyazat-fej">
          <h2>${esc(p.azonosito)}</h2>
          <p class="palyazat-cim">${esc(p.cim)}</p>
        </div>
        ${p.kep ? `<figure class="palyazat-kep"><img src="${esc(p.kep)}" alt="${esc(p.azonosito)} pályázati tájékoztató tábla" loading="lazy"></figure>` : ''}
        <dl class="palyazat-adat">
          ${p.adatok.map(([cimke, ertek]) =>
            `<div><dt>${esc(cimke)}</dt><dd>${esc(ertek)}</dd></div>`).join('\n          ')}
        </dl>
        ${p.bekezdesek.length ? `<div class="palyazat-szoveg">
          <h3>${esc(p.bekezdesekCim || 'A projekt tartalmának bemutatása:')}</h3>
          ${p.bekezdesek.map((b) => `<p>${esc(b)}</p>`).join('\n          ')}
        </div>` : ''}
      </article>`).join('\n\n      ');

const palyazatLinkek = PALYAZATOK.map((p) =>
  `<li><a href="palyazatok.html#${esc(p.slug)}">${esc(p.azonosito)}</a></li>`).join('\n            ');

/* Ha egy fejezet adatfájlja nincs meg, a fejezet nem létezik — és
   akkor a menüben és a láblécben sem szabad ott állnia. Egy törött
   menüpont rosszabb, mint egy hiányzó. */
function fejezetSor(html, felt, minta) {
  return felt ? html : html.replace(minta, '');
}

const LABLEC = fejezetSor(
  readFileSync('partials/lablec.html', 'utf8')
    .replace('<!--KAPCSOLATOK-->', kapcsolatLista)
    .replace('<!--PALYAZAT-LINKEK-->', palyazatLinkek),
  KESZULES, /\s*<li><a href="keszules\.html">[^<]*<\/a><\/li>/);

/* A fejléc is egy helyen él. Az oldal a saját menüpontját
   <!--FEJLEC:rolunk--> alakban kéri, és csak azon lesz aria-current. */
const FEJLEC_SABLON = fejezetSor(
  readFileSync('partials/fejlec.html', 'utf8'),
  KESZULES, /\s*<a href="keszules\.html"[^>]*>[^<]*<\/a>/);

function fejlec(aktiv) {
  return FEJLEC_SABLON.replace(
    `data-oldal="${aktiv}"`,
    `data-oldal="${aktiv}" aria-current="page"`
  );
}

/* ---------- 4/b. AZ ALAPRAJZ ----------

   Nem portfóliórács és nem szűrőfelület: a teljes munka szerkezeti
   rajza. Egy lapon látszik, mi van, miből mennyi, és melyik hogyan
   járható be. Ugyanez a jelölés kerül a saját lapjára (/alaprajz) és
   fedőrétegként a terekbe meg a főoldalra — egy forrásból, hogy a
   kettő ne tudjon szétcsúszni.

   Amit NEM csinál: nem sorolja szintekbe a munkákat úgy, mintha
   volna köztük rangsor. A jelölés azt mondja meg, MILYEN FORMÁBAN
   nézhető meg egy projekt — nem azt, hogy mennyit ér. */

/* Melyik projekt jelenik meg bejárható térként? Amelyikhez van
   megírva legalább két valódi nézőpont. Ez adatkérdés, nem ízlés —
   és ugyanez a feltétel dönti el lentebb, hogy készül-e térlap. */
function terAdat(slug) {
  const t = TEREK[slug];
  if (!t || slug.startsWith('$')) return null;
  const pontok = [];
  for (const szoba of t.szobak || []) {
    for (const n of szoba.nezopontok || []) pontok.push({ ...n, szoba });
  }
  return { ...t, pontok };
}

const TERLAPOK = new Map();      /* slug → terAdat, ahol tényleg tér van */
for (const p of ELO) {
  const t = terAdat(p.slug);
  if (t && t.szint === 1 && t.pontok.length >= 2) TERLAPOK.set(p.slug, t);
}

function mod(slug) {
  if (TERLAPOK.has(slug)) return 'ter';
  const t = TEREK[slug];
  return t && t.szint === 2 ? 'mozgokep' : 'tortenet';
}

const MOD_NEV = {
  ter: 'Bejárható tér',
  mozgokep: 'Mozgókép',
  tortenet: 'Történet'
};

/* A cella szélessége a fotószámból jön: ami nagyobb anyag, az nagyobb
   helyet foglal az alaprajzon. Ugyanaz a logika, mint egy valódi
   alaprajzon — a nagyobb szoba nagyobb. */
function cellaSzelesseg(db) { return db >= 18 ? 3 : db >= 11 ? 2 : 1; }

/* A cellák koordinátája: szárnykód + a szárnyon belüli sorszám —
   ahogy egy alaprajzon is a szint és a szobaszám azonosít. A kód két
   betűs, mert a Hotel és a Hajó ugyanazzal kezdődik. */
const SZARNYKOD = {
  hotel: 'HO', etterem: 'ÉT', lakoingatlan: 'LA', kastely: 'KA',
  szakralis: 'SZ', egyedi: 'EG', hajo: 'HA'
};

function alaprajzHtml(aktiv, o = {}) {
  const cimke = o.fedo ? 'h2' : 'h1';
  const szarnyCimke = o.fedo ? 'h3' : 'h2';

  const szarnyak = Object.entries(KATEGORIAK)
    .filter(([kulcs]) => ELO.some((p) => p.kategoria === kulcs))
    .map(([kulcs, nev]) => {
      const lista = ELO.filter((p) => p.kategoria === kulcs);
      const fotok = lista.reduce((n, p) => n + p.kepek.length, 0);
      const jelBetu = SZARNYKOD[kulcs] || nev.slice(0, 2).toUpperCase();

      const cellak = lista.map((p, sorszam) => {
        const m = mod(p.slug);
        const borito = p.kiemelt || p.kepek[0].file;
        const alt = p.kepek.find((k) => k.file === borito)?.alt || p.cim;
        const itt = p.slug === aktiv;
        const sz = cellaSzelesseg(p.kepek.length);

        /* A sizes a CELLA tényleges szélességét mondja, nem egy
           kerek százalékot. A rács hat egyenlő hasáb 1290 px-en belül,
           tehát egy span-N cella ≈ N × 215 px; 900 px alatt két hasáb,
           560 alatt egy. A korábbi „30vw” 1440-en 432 px-t kért, így a
           böngésző soha nem választotta a 400-as változatot — pedig a
           borító itt 22%-os fedettségű háttér a szedés mögött. */
        const cellaSizes = sz >= 2
          ? `(max-width: 900px) 92vw, ${sz * 215}px`
          : '(max-width: 560px) 92vw, (max-width: 900px) 46vw, 215px';

        return `<li class="cella" data-kat="${esc(p.kategoria)}" data-mod="${m}" style="--sz:${sz}">
            <a href="/referenciak/${esc(p.slug)}/"${itt ? ' aria-current="page"' : ''}>
              <span class="hatter" aria-hidden="true">${pictureKep(p.slug, borito, '', { nagy: '-400', lepcso: ['-400', '-800'], sizes: cellaSizes })}</span>
              <span class="jel tipo-adat">${jelBetu}·${String(sorszam + 1).padStart(2, '0')}</span>
              <span class="cim">${esc(p.cim)}</span>
              <span class="mod tipo-adat"><i class="mod-jel" aria-hidden="true"></i>${MOD_NEV[m]} · ${p.kepek.length} fotó</span>
            </a>
          </li>`;
      }).join('\n          ');

      /* A hajószárnynak van saját fejezete: az alaprajz ott nem a
         legjobb nézet, mert tizenöt egyforma cellát ad. A flotta
         viszont sorba állítja őket. Egy hivatkozás, a szárny fejében. */
      const szarnyKi = kulcs === 'hajo' && FLOTTA
        ? `<a class="szarny-ki tipo-ui" href="/flotta.html">A flotta <span aria-hidden="true">→</span></a>`
        : '';

      /* A szárny fejcímének SZINTJE követi a lapét (6. fázis): a
         fedőrétegben a lap címe h2, tehát a szárny h3; az önálló
         /alaprajz lapon a cím h1, tehát a szárny h2. Fixen h3-ként
         az önálló lap h1 → h3 ugrást csinált, és a képernyőolvasó
         egy hiányzó szintet jelentett. */
      return `<section class="szarny" data-kat="${esc(kulcs)}">
          <${szarnyCimke} class="szarny-fej">
            <span class="tipo-muszaki">${esc(nev)}</span>
            <span class="tipo-adat">${lista.length} projekt · ${fotok} fotó</span>
            ${szarnyKi}
          </${szarnyCimke}>
          <ol class="cellak">
          ${cellak}
          </ol>
        </section>`;
    }).join('\n\n        ');

  const szuro = Object.entries(KATEGORIAK)
    .filter(([kulcs]) => ELO.some((p) => p.kategoria === kulcs))
    .map(([kulcs, nev]) =>
      `<button type="button" class="terv-gomb tipo-ui" data-terv-kat="${esc(kulcs)}" aria-pressed="false">${esc(nev)}</button>`)
    .join('\n          ');

  return `<div class="alaprajz-lap">
      <header class="alaprajz-fej">
        <div>
          <p class="tipo-muszaki">Alaprajz · a teljes munka</p>
          <${cimke} class="tipo-cim-2">Harminc év,<br><em>egy lapon.</em></${cimke}>
          <p class="alaprajz-osszeg tipo-adat">${ELO.length} projekt · ${ELO.reduce((n, p) => n + p.kepek.length, 0)} fotó · ${TERLAPOK.size} bejárható tér</p>
        </div>
        ${o.fedo ? `<button type="button" class="alaprajz-zar tipo-ui" data-terv="zar">Bezár <kbd>Esc</kbd></button>` : ''}
      </header>

      <nav class="alaprajz-szuro" aria-label="Szűrés a tér fajtájára">
        <div role="group" class="terv-gombok">
          <button type="button" class="terv-gomb tipo-ui" data-terv-kat="mind" aria-pressed="true">Mind</button>
          ${szuro}
        </div>
        <p class="terv-allas tipo-adat" aria-live="polite"></p>
      </nav>

      <div class="alaprajz-terkep">
        ${szarnyak}
      </div>

      <footer class="alaprajz-jelmagyarazat tipo-adat">
        <p><i class="mod-jel" data-mod="ter" aria-hidden="true"></i> <b>Bejárható tér</b> — mélységgel, nézőpontokkal, küszöbökkel.</p>
        <p><i class="mod-jel" data-mod="mozgokep" aria-hidden="true"></i> <b>Mozgókép</b> — tartott képek, léptékváltás, szabad körülnézés nélkül.</p>
        <p><i class="mod-jel" data-mod="tortenet" aria-hidden="true"></i> <b>Történet</b> — gyors, csendes dokumentum: borító, adatok, teljes galéria.</p>
        <p class="halk">A forma azt mondja meg, milyen anyag áll rendelkezésre — nem azt, melyik munka ér többet.</p>
      </footer>
    </div>`;
}

/* ---------- 4/c. A TÉR JELÖLÉSE ----------

   Egy helyen áll elő minden nézőponthoz tartozó jelölés. A ter.js
   ezt vezényli; projektet nem ismer. Ha új tér kerül a terek.json-ba,
   itt nem kell hozzányúlni semmihez. */

/* A rétegek ugyanannak a fotónak a másolatai: a képnek EGY leírása van,
   és az a galériában él. Itt alt="" + aria-hidden, különben a
   képernyőolvasó háromszor mondaná fel ugyanazt. */
/* ---------- SZKRIPT NÉLKÜLI TARTALÉK A SZÍNPADOKHOZ ----------

   A ragadós színpad EGY képkockát mutat, és a többit a ter.js lépteti
   (ter.js: `szobak[s].hidden = true`). Szkript nélkül tehát a nyitó
   enfiládból pontosan egy fénykép marad — a PHASE-6 §14 ezt írta le
   utolsó no-JS hiányként, és Phase 7 zárja.

   A megoldás szándékosan NEM a színpad átépítése. A `.nyilas` abszolút
   pozíciójú, a `.szinpad` ragadós: ahhoz, hogy szkript nélkül lapos
   lista legyen belőle, a ragadós viselkedést egy jelzőhöz kellene
   kötni, azt pedig a fejlécben futó soron kell kitenni — és a
   főoldal első festése közben egy pillanatra a lapos lista villanna
   föl. Egy <noscript> blokk ugyanazt a tartalmat adja, nulla
   kockázattal: szkript mellett a böngésző nem is elemzi, tehát egyetlen
   kérést sem indít, és a színpad bájtra ugyanaz marad.

   Ami benne van: MINDEN képkocka, a saját megírt képleírásával, a tér
   nevével, a helyével és a projekt linkjével. -800 px-ig, mert ez
   tartalék, nem előadás. */
/* ---------- FÉNYKÉP VAGY LÁTVÁNYTERV ----------

   A lapok eddig minden projektnél „N fotó a munkáról” feliratot írtak
   ki. Négy projekt anyaga viszont 100% látványterv (data/forras.json →
   eredet: latvanyterv), és ott ez nem igaz: nem fénykép, és nem is
   arról szól, hogy a munka megtörtént. A szó a forrásból jön, nem a
   sablonból. */
function kepSzavak(slug, db) {
  const terv = FORRAS?.projektek?.[slug]?.eredet === 'latvanyterv';
  return terv
    ? { cimke: 'Látványterv', mondat: `${db} látványterv a tervről.`, meta: `${db} látványtervvel` }
    : { cimke: 'Fotó',        mondat: `${db} fotó a munkáról.`,       meta: `${db} fotóval` };
}

function nojsKeretek(keretek, o = {}) {
  if (!keretek.length) return '';
  const tetelek = keretek.map((k) => {
    const pr = ELO.find((z) => z.slug === k.slug);
    const alt = pr?.kepek.find((x) => x.file === k.kep)?.alt || pr?.cim || '';
    return `<li>
          <figure>
            ${pictureKep(k.slug, k.kep, alt, {
              nagy: '-800', lepcso: ['-400', '-800'],
              sizes: '(max-width: 800px) 92vw, 46vw'
            })}
            <figcaption class="tipo-adat"><b>${esc(k.nev)}</b>${k.hol ? `<span>· ${esc(k.hol)}</span>` : ''}<a href="/referenciak/${esc(k.slug)}/">${esc(pr?.cim || k.slug)} →</a></figcaption>
          </figure>
        </li>`;
  }).join('\n        ');

  return `<noscript>
    <section class="szekcio halvany nojs-keretek">
      <div class="belul">
        <p class="felcim">${esc(o.cimke || 'A képkockák')}</p>
        <p class="tipo-folyo">${esc(o.bevezeto || '')}</p>
        <ol class="nojs-lista">
        ${tetelek}
        </ol>
      </div>
    </section>
  </noscript>`;
}

/* A réteg SAJÁT szélessége, a képmezőhöz képest.

   A `sizes` a kép megjelenési szélességét mondja meg — a rétegek
   viszont nem egyforma szélesek. A ter.css alapnagyítása (a
   --reteg-*-nagy) azért van, hogy körülnézéskor ne villanjon ki a kép
   széle; ennek az ára, hogy a közeli réteg 5,5%-kal nagyobb, mint a
   képmező. A böngésző a transformot nem számolja bele a `sizes`-ba,
   tehát ha mindhárom rétegnek 100vw-t mondunk, a közelit tudatosan
   alulméretezzük. Mérve 1440 px-en: 1425 / 1460 / 1503 CSS px. */
const RETEG_SIZES = { tav: '101vw', koz: '103vw', kozel: '106vw' };

function egyReteg(slug, file, osztaly, elso) {
  return `<div class="ter-reteg ${osztaly}">${pictureKep(slug, file, '', {
    /* A teljes képmezős lépcső — a -1800 fok csak itt jelenik meg, és
       csak akkor, ha a mester bírja (lásd a sorozat() szigorú
       keresését). Ez a VISUAL-CLARITY 1. részének fő javítása. */
    lepcso: ['-800', '-1400', '-1800'],
    nagy: '-1400',
    sizes: RETEG_SIZES[osztaly] || '100vw',
    eager: elso && osztaly === 'tav',
    keses: !elso,
    extra: elso && osztaly !== 'tav' ? 'fetchpriority="low"' : ''
  })}</div>`;
}

function terJeloles(p, ter) {
  const pontok = ter.pontok;
  const alt = (file) => p.kepek.find((k) => k.file === file)?.alt || p.cim;

  const reteg = (n, osztaly, elso) => egyReteg(p.slug, n.kep, osztaly, elso);

  /* A SZERZŐI MÉLYSÉG (6. fázis, E. rész) ma NEM kerül ki a jelölésbe.

     A rétegenkénti `melyseg.z` szorzót a ter.css olvasta, a mutató-
     követés rétegenkénti erejéhez. Az a szétválasztás megszűnt: egy
     fénykép három másolatát eltolni nem mélység, hanem szellemkép
     (lásd ter.css, .ter-reteg img). Amíg nincs megjelenítő, ami a z-t
     feldolgozná, ugyanaz a szabály áll rá, mint a mélységTÉRKÉPRE
     (melyseg.terkep): a build ELLENŐRZI az adatot (2/f), de egy soha
     nem olvasott inline változó nem utazik minden lapon. A
     felhasználása a 7. fázisé.

     Ma egyetlen nézőpont sem ad meg `melyseg.z`-t, tehát a kimenet
     ettől bájtra ugyanaz. */
  const melysegStilus = () => '';

  const szobakHtml = pontok.map((n, i) => {
    const [x, y, rx, ry] = n.nyilas;
    const kapuk = (n.kapuk || []).map((k) => `
          <button type="button" class="ter-kapu" style="left:${(k.pozicio[0] * 100).toFixed(1)}%; top:${(k.pozicio[1] * 100).toFixed(1)}%" data-cel="${esc(k.cel)}">
            <span class="jel" aria-hidden="true"></span><span class="cimke tipo-muszaki">${esc(k.cimke)}</span>
          </button>`).join('');

    return `<div class="nyilas" data-maszk="nincs" data-nezopont="${esc(n.id)}"${i ? ' hidden' : ''}>
        <div class="ter"${n.lapos ? ' data-lapos' : ''}
             style="--nyx:${(x * 100).toFixed(1)}%; --nyy:${(y * 100).toFixed(1)}%; --nyrx:${(rx * 100).toFixed(1)}%; --nyry:${(ry * 100).toFixed(1)}%${melysegStilus()}"
             data-nev="${esc(n.nev)}"
             data-honnan="${esc(p.cim + ' · ' + n.szoba.nev)}"
             data-hangulat="${esc(n.hangulat || ter.hangulat?.alap || 'nappal')}"
             data-kuszob="${esc(n.kuszob?.fajta || 'ajto')}"
             data-el="${esc(n.kuszob?.el || '')}"
             data-anyag="${esc((ter.anyagok || [])[0] || '')}"
             data-anyagszin="${esc(ter.anyagszin || '')}">
          ${reteg(n, 'tav', i === 0)}
          ${reteg(n, 'koz', i === 0)}
          ${reteg(n, 'kozel', i === 0)}${kapuk}
        </div>
      </div>`;
  }).join('\n\n      ');

  const jelzoHtml = pontok.map((n, i) =>
    `<button type="button" data-hova="${i}" aria-current="${i === 0 ? 'true' : 'false'}">
        <span class="rejtett">${i + 1}. nézőpont — ${esc(n.nev)}</span>
      </button>`).join('\n      ');

  const kuszobok = pontok.map((n, i) => {
    const kov = pontok[i + 1];
    if (!kov) return '';
    const fajta = { ajto: 'Ajtó', ablak: 'Ablak', kapu: 'Kapu' }[n.kuszob?.fajta] || 'Ajtó';
    return `<li><b>${esc(n.nev)}</b> → ${esc(kov.nev)} — ${esc(fajta)}${n.kuszob?.el ? `, a kamera mellett: ${esc(n.kuszob.el)}` : ''}</li>`;
  }).filter(Boolean).join('\n        ');

  const katNev = KATEGORIAK[p.kategoria] || p.kategoria;
  const tenyek = [
    ['Kategória', katNev],
    ['Fotó', `${p.kepek.length} db`],
    ['Nézőpont', `${pontok.length} db`],
    ['Helyszín', ter.adatok?.helyszin],
    ['Év', ter.adatok?.ev],
    ['Megbízó', ter.adatok?.megbizo],
    ['Alapterület', ter.adatok?.terulet],
    ['Hatókör', ter.adatok?.hatokor],
    ['Fotó készítője', ter.adatok?.fotos]
  ].map(([c, e]) => `<div><dt>${esc(c)}</dt><dd${e ? '' : ' class="nincs"'}>${esc(e || 'nincs adat')}</dd></div>`).join('\n      ');

  /* Az adatlap a tér írott ikertestvére — de a teljes galériát NEM
     ismétli meg: az ugyanezen a lapon, lejjebb, a dokumentumban áll.
     Kétszer kiírva minden fotó jelölése duplán utazna a dróton. */
  const adatlapHtml = `<div class="adatlap-fej">
        <div>
          <p class="tipo-muszaki">Adatlap · ${esc(katNev)}</p>
          <h2>${esc(p.cim)}</h2>
        </div>
        <button type="button" class="adatlap-zar" data-adatlap="zar" aria-label="Adatlap bezárása">✕</button>
      </div>

      ${ter.szoveg || p.leiras
        ? `<p class="tipo-vezeto">${esc(ter.szoveg || p.leiras)}</p>`
        : `<p class="tipo-folyo">A projekthez még nem készült leírás. Az alábbi adatok és a galéria a meglévő dokumentációból származnak.</p>`}

      <dl class="tenyek tipo-adat">
      ${tenyek}
      </dl>

      <p class="tipo-muszaki">Anyagok</p>
      <ul class="anyagok tipo-adat">
        ${(ter.anyagok || []).map((a) => `<li>${esc(a)}</li>`).join('\n        ')}
      </ul>

      <p class="tipo-muszaki" style="margin-top:var(--space-6)">Küszöbök</p>
      <ul class="tipo-folyo" style="padding-left:1.1em">
        ${kuszobok}
      </ul>

      <p class="tipo-ui" style="margin-top:var(--space-7)">
        <a href="#dokumentum">A teljes dokumentum és a galéria (${p.kepek.length} fotó) ↓</a>
      </p>
      ${FLOTTA_HAJOK.some((h) => h.slug === p.slug)
        ? `<p class="tipo-ui"><a href="/flotta.html">A flotta · ${esc(HAJO_KOORD.get(p.slug) || '')} →</a></p>` : ''}
      ${p.link ? `<p class="tipo-ui"><a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.link.replace(/^https?:\/\//, '').replace(/\/$/, ''))} ↗</a></p>` : ''}`;

  const nojsHtml = nojsKeretek(
    pontok.map((n) => ({ slug: p.slug, kep: n.kep, nev: n.nev, hol: n.szoba.nev })),
    { cimke: 'A tér nézőpontjai',
      bevezeto: 'Szkript nélkül a színpad nem tud továbblépni. A ' +
        pontok.length + ' nézőpont fényképe itt egymás után áll.' });

  return { pontok, szobakHtml, jelzoHtml, adatlapHtml, nojsHtml, alt };
}

/* ---------- 4/d. A FLOTTA ----------

   Két rétegből áll, és a kettő ugyanabból az adatból:

     1. A NYITÁS — hat képkocka, ugyanaz a szerkezet, mint egy szobában
        vagy a főoldal enfiládján, tehát ugyanaz a ter.js vezényli. A
        különbség egyetlen mezőben van: itt minden küszöb ABLAK.
     2. A VÍZVONAL — tizenöt sor egy lapon, valódi hivatkozásokkal a
        meglévő projektcímekre. Nem készül külön hajólap: amelyik
        hajónak van elég anyaga, annak MÁR VAN címe.

   A sorrendet nem kézzel adjuk meg. Rang, majd az állomások száma,
   majd a fotószám — így nem lehet a rangsort ízlésből felülírni, és
   új hajó felvételekor magától a helyére kerül.

   A KOORDINÁTA viszont az alaprajzé: ugyanaz a HA·NN, ami ott is a
   hajóé. A cím és a bejárási sorrend két külön dolog — egy valódi
   alaprajzon is így van. */

const HAJO_KOORD = new Map();
ELO.filter((p) => p.kategoria === 'hajo').forEach((p, i) => {
  HAJO_KOORD.set(p.slug, `${SZARNYKOD.hajo}·${String(i + 1).padStart(2, '0')}`);
});

const RANG_NEV = { zaszlohajo: 'Bejárható tér', sorozat: 'Saját típus', archivum: 'Archívum' };
const RANG_SULY = { zaszlohajo: 0, sorozat: 1, archivum: 2 };

const FLOTTA_HAJOK = !FLOTTA ? [] : (FLOTTA.hajok || [])
  .map((h) => {
    const p = ELO.find((x) => x.slug === h.slug);
    return { ...h, p, allomasok: h.allomasok || [] };
  })
  .sort((a, b) =>
    RANG_SULY[a.rang] - RANG_SULY[b.rang] ||
    b.allomasok.length - a.allomasok.length ||
    b.p.kepek.length - a.p.kepek.length);

/* --- a nyitó enfilád: pontosan az a jelölés, amit a ter.js ismer --- */
const flottaKeretek = !FLOTTA ? '' : (FLOTTA.nyitas?.keretek || []).map((k, i) => {
  const [x, y, rx, ry] = k.nyilas;
  return `<div class="nyilas" data-maszk="nincs" data-nezopont="f${i + 1}"${i ? ' hidden' : ''}>
        <div class="ter"${k.lapos ? ' data-lapos' : ''}
             style="--nyx:${(x * 100).toFixed(1)}%; --nyy:${(y * 100).toFixed(1)}%; --nyrx:${(rx * 100).toFixed(1)}%; --nyry:${(ry * 100).toFixed(1)}%"
             data-nev="${esc(k.nev)}"
             data-honnan="${esc(k.hol)}"
             data-hangulat="${esc(k.hangulat || 'nappal')}"
             data-kuszob="${esc(k.kuszob?.fajta || 'ablak')}"
             data-el="${esc(k.kuszob?.el || '')}"
             data-projekt="/referenciak/${esc(k.slug)}/"
             data-szak="${esc(k.allomas || '')}">
          ${egyReteg(k.slug, k.kep, 'tav', i === 0)}
          ${egyReteg(k.slug, k.kep, 'koz', i === 0)}
          ${egyReteg(k.slug, k.kep, 'kozel', i === 0)}
        </div>
      </div>`;
}).join('\n\n      ');

const flottaNojs = !FLOTTA ? '' : nojsKeretek(FLOTTA.nyitas?.keretek || [], {
  cimke: 'A nyitó képkockák',
  bevezeto: 'Szkript nélkül a színpad nem tud továbblépni. A nyitás ' +
    'képkockái itt egymás után állnak; a flotta teljes indexe alább van.'
});

const flottaJelzo = !FLOTTA ? '' : (FLOTTA.nyitas?.keretek || []).map((k, i) =>
  `<button type="button" data-hova="${i}" aria-current="${i === 0 ? 'true' : 'false'}">
        <span class="rejtett">${i + 1}. állomás — ${esc(k.allomas)}: ${esc(k.nev)}</span>
      </button>`).join('\n      ');

/* --- a vízvonal ---
   Az öt állomásjel nem díszítés: azt mondja meg, MIT ŐRZ az archívum
   erről a hajóról. Ami hiányzik, arról nincs fénykép — nem az, hogy
   nem történt meg. Ezt a jelmagyarázat ki is mondja. */
const flottaSorok = FLOTTA_HAJOK.map((h, i) => {
  const p = h.p;
  const borito = h.borito || p.kiemelt || p.kepek[0].file;
  const alt = p.kepek.find((k) => k.file === borito)?.alt || p.cim;
  const van = new Set(h.allomasok);

  const jelek = Object.entries(ALLOMASOK).map(([kulcs, nev]) =>
    `<i class="allomas-jel" data-allomas="${kulcs}"${van.has(kulcs) ? ' data-van' : ''} title="${esc(nev)}" aria-hidden="true"></i>`
  ).join('');

  const olvasva = h.allomasok.length
    ? 'Az archívumban: ' + h.allomasok.map((a) => ALLOMASOK[a].toLowerCase()).join(', ')
    : 'Az archívumban csak külső felvétel van';

  return `<li class="hajo" style="--sor:${i % 8}"
            data-rang="${esc(h.rang)}"
            data-allomas="${esc(h.allomasok.join(' '))}">
          <a href="/referenciak/${esc(p.slug)}/">
            <span class="hajo-kep">${pictureKep(p.slug, borito, '', { nagy: '-400', lepcso: ['-400', '-800'], sizes: '(max-width: 720px) 34vw, 210px' })}</span>
            <span class="hajo-jel tipo-adat">${esc(HAJO_KOORD.get(p.slug) || '')}</span>
            <span class="hajo-nev">${esc(p.cim)}</span>
            <span class="hajo-tipus tipo-adat">${esc(h.tipus || RANG_NEV[h.rang])} · ${p.kepek.length} fotó</span>
            <span class="hajo-allomasok">
              ${jelek}
              <span class="rejtett">${esc(olvasva)}</span>
            </span>
            <span class="hajo-rang tipo-adat">${esc(RANG_NEV[h.rang])}</span>
          </a>
        </li>`;
}).join('\n        ');

const flottaSzuro = Object.entries(ALLOMASOK).map(([kulcs, nev]) => {
  const db = FLOTTA_HAJOK.filter((h) => h.allomasok.includes(kulcs)).length;
  return `<button type="button" class="flotta-gomb tipo-ui" data-flotta-allomas="${kulcs}" aria-pressed="false">${esc(nev)} <span class="szam">${db}</span></button>`;
}).join('\n          ');

/* --- a visszaút ---
   A hurok akkor teljes, ha a hajólapról is vissza lehet lépni a
   flottába. Nem külön sablonelem: a meglévő külső-hivatkozás helyére
   kerül, tehát egyetlen HTML-sablont sem kellett hozzányúlni. Minden
   hajó kap ilyet — a bejárható tér és az archívum egyaránt. */
const flottaVissza = (slug) => {
  const h = FLOTTA_HAJOK.find((x) => x.slug === slug);
  if (!h) return '';
  return `<a class="link-nyil" href="/flotta.html">A flotta · ${esc(HAJO_KOORD.get(slug) || '')} <span aria-hidden="true">→</span></a>`;
};

const flottaOsszeg = !FLOTTA ? '' : (() => {
  const db = FLOTTA_HAJOK.length;
  const fotok = FLOTTA_HAJOK.reduce((n, h) => n + h.p.kepek.length, 0);
  const epult = FLOTTA_HAJOK.filter((h) => h.allomasok.includes('vaz')).length;
  return `${db} hajó · ${fotok} fotó · ${epult} olyan, amiről a váz is megvan`;
})();



/* ---------- 5. projekt-aloldalak ---------- */

const SABLON = readFileSync('partials/projekt-sablon.html', 'utf8');
const TER_SABLON = readFileSync('partials/ter-sablon.html', 'utf8');

for (const p of ELO) {
  const dir = `${OUT}/referenciak/${p.slug}`;
  mkdirSync(dir, { recursive: true });

  const terLap = TERLAPOK.get(p.slug);

  /* A GALÉRIA. Három javítás a 6. fázisban, mindhárom mérésből:

     1. LÉPCSŐ. A rács cellái 268–400 px szélesek, a jelölés mégis a
        800 px-es változatot kérte, srcset nélkül. Most -400/-800, és
        a sizes megmondja, mekkora a cella. Egy 23 fotós galéria
        2,2 MB helyett ~0,7 MB.
     2. MÉRET. Nem volt width/height: a lap ugrott betöltés közben.
        A 4/3-as aspect-ratio a CSS-ben van, de a böngésző az img
        saját arányát is használja, amíg a CSS meg nem érkezik.
     3. KÉSLELTETÉS. Az első három kép `eager` volt. Egy sima
        projektlapon ez helyes — ott a galéria a lap teteje. Egy
        BEJÁRHATÓ TÉREN viszont a galéria a térbeli színpad ALATT
        van, tehát három 800 px-es JPEG (283 KB) töltődött le olyan
        képekért, amiket senki nem lát a hajtás fölött. Ahol tér van,
        ott mind késleltetett.

     A nagyítás továbbra is az -1400-ast nyitja. */
  const galSizes = '(max-width: 700px) 92vw, 340px';
  const galeria = p.kepek.map((k, i) => {
    const [gw, gh] = kepMeret(p.slug, k.file, '-800');
    const azonnal = !terLap && i === 0;
    return `<figure class="galeria-elem jon" style="--k:${i % 4}">
        <a href="../../${kep(p.slug, k.file, '-1400')}" data-nagyit>
          <img src="../../${kep(p.slug, k.file, '-400')}"
               srcset="/${kep(p.slug, k.file, '-400')} 400w, /${kep(p.slug, k.file, '-800')} 800w"
               sizes="${galSizes}" width="${gw}" height="${gh}"
               alt="${esc(k.alt)}" loading="${azonnal ? 'eager' : 'lazy'}" decoding="async"${azonnal ? ' fetchpriority="high"' : ''}>
        </a>
      </figure>`;
  }).join('\n      ');

  /* A kifelé vezető hivatkozások: a projekt saját külső címe (ha van),
     és — hajóknál — a vissza a flottába. Ez zárja a hurkot:
     FLOTTA → HAJÓ → PROJEKT → FLOTTA. */
  const link = [
    p.link
      ? `<a class="link-nyil" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.link.replace(/^https?:\/\//, '').replace(/\/$/, ''))} <span aria-hidden="true">↗</span></a>`
      : '',
    flottaVissza(p.slug)
  ].filter(Boolean).join('\n      ');

  const mas = ELO.filter((x) => x.kategoria === p.kategoria && x.slug !== p.slug).slice(0, 3);
  const hasonlo = mas.map(kartya).join('\n        ').replace(/href="referenciak\//g, 'href="../');

  const ter = terLap;

  /* ---- ahol tér van, ott a cím MAGA a tér ----

     Az URL nem változik (/referenciak/<slug>/), a dokumentum sem tűnik
     el: az enfilád alatt ugyanaz a projektlap folytatódik — morzsa,
     adatok, teljes galéria, hasonló munkák. Aki görget, kijut belőle;
     aki keresőből jön, teljes lapot kap; aki szkript nélkül nézi, a
     nyitóképet és a dokumentumot látja. */
  if (ter) {
    const j = terJeloles(p, ter);
    const elso = j.pontok[0];
    const fajtaNev = { ajto: 'Ajtó', ablak: 'Ablak', kapu: 'Kapu' }[elso.kuszob?.fajta] || 'Ajtó';

    writeFileSync(`${dir}/index.html`, TER_SABLON
      .split('{{cim}}').join(esc(p.cim))
      .split('{{slug}}').join(esc(p.slug))
      .split('{{kategoria}}').join(esc(KATEGORIAK[p.kategoria] || p.kategoria))
      .split('{{kepSzam}}').join(String(p.kepek.length))
      .split('{{kepCimke}}').join(kepSzavak(p.slug, p.kepek.length).cimke)
      .split('{{kepMondat}}').join(esc(kepSzavak(p.slug, p.kepek.length).mondat))
      .split('{{kepMeta}}').join(esc(kepSzavak(p.slug, p.kepek.length).meta))
      .split('{{terDb}}').join(String(j.pontok.length).padStart(2, '0'))
      .split('{{terLepes}}').join(String(j.pontok.length))
      .split('{{terNev}}').join(esc(elso.nev))
      .split('{{terHonnan}}').join(esc(p.cim + ' · ' + elso.szoba.nev))
      .split('{{terHangulat}}').join(esc(elso.hangulat || ter.hangulat?.alap || 'nappal'))
      .split('{{terAnyag}}').join(esc((ter.anyagok || [])[0] || '—'))
      .split('{{terFajta}}').join(fajtaNev)
      .split('{{terKovetkezo}}').join(esc(j.pontok[1] ? j.pontok[1].nev : 'Vissza az első térbe'))
      .replace('<!--TER-SZOBAK-->', j.szobakHtml)
      .replace('<!--NOJS-KERETEK-->', j.nojsHtml)
      .replace('<!--TER-JELZO-->', j.jelzoHtml)
      .replace('<!--TER-ADATLAP-->', j.adatlapHtml)
      .replace('<!--ALAPRAJZ-->', alaprajzHtml(p.slug, { fedo: true }))
      .replace('<!--GALERIA-->', galeria)
      .replace('<!--KULSO-LINK-->', link)
      .replace('<!--HASONLO-->', hasonlo)
    );
    continue;
  }

  writeFileSync(`${dir}/index.html`, SABLON
    .split('{{cim}}').join(esc(p.cim))
    .split('{{kategoria}}').join(esc(KATEGORIAK[p.kategoria] || p.kategoria))
    .split('{{leiras}}').join(esc(p.leiras || ''))
    .split('{{kepSzam}}').join(String(p.kepek.length))
    .split('{{kepCimke}}').join(kepSzavak(p.slug, p.kepek.length).cimke)
    .split('{{kepMondat}}').join(esc(kepSzavak(p.slug, p.kepek.length).mondat))
    .split('{{kepMeta}}').join(esc(kepSzavak(p.slug, p.kepek.length).meta))
    .split('{{borito}}').join('../../' + kep(p.slug, p.kiemelt || p.kepek[0].file, '-1400'))
    .replace('<!--GALERIA-->', galeria)
    .replace('<!--KULSO-LINK-->', link)
    .replace('<!--HASONLO-->', hasonlo)
  );
}

/* ---------- 5/b. A FŐOLDAL JELENETEI ----------

   A hét jelenet KÉPEI és GEOMETRIÁJA a data/terek.json $fooldal
   szakaszából jönnek; a SZÖVEG az index.html-ben él, mert az tartalom.
   Így a szedés szerkeszthető marad anélkül, hogy bárki képfájlneveket
   írogatna a HTML-be, és a build meg tudja állítani magát, ha egy
   jelenet olyan képre hivatkozik, ami az ügyfélnél időközben eltűnt.

   A keretek EGYETLEN folyamatos enfiládot alkotnak: a főoldal nem hét
   egymásra tett szakasz, hanem egy tér, amin végigmegyünk. Ezért is
   ugyanaz a jelölés, mint egy szobában — és ezért ugyanaz a ter.js
   vezényli. */

const jelenetKeretek = !FOOLDAL ? '' : (FOOLDAL.keretek || []).map((k, i) => {
  const [x, y, rx, ry] = k.nyilas;
  const pr = ELO.find((z) => z.slug === k.slug);
  return `<div class="nyilas" data-maszk="nincs" data-nezopont="j${i + 1}" data-jelenet="${esc(k.jelenet)}"${i ? ' hidden' : ''}>
        <div class="ter"${k.lapos ? ' data-lapos' : ''}
             style="--nyx:${(x * 100).toFixed(1)}%; --nyy:${(y * 100).toFixed(1)}%; --nyrx:${(rx * 100).toFixed(1)}%; --nyry:${(ry * 100).toFixed(1)}%"
             data-nev="${esc(k.nev)}"
             data-honnan="${esc(k.hol || pr.cim)}"
             data-hangulat="${esc(k.hangulat || 'nappal')}"
             data-kuszob="${esc(k.kuszob?.fajta || 'ajto')}"
             data-el="${esc(k.kuszob?.el || '')}"
             data-projekt="/referenciak/${esc(k.slug)}/"
             data-szak="${esc(k.szak || '')}">
          ${egyReteg(k.slug, k.kep, 'tav', i === 0)}
          ${egyReteg(k.slug, k.kep, 'koz', i === 0)}
          ${egyReteg(k.slug, k.kep, 'kozel', i === 0)}
        </div>
      </div>`;
}).join('\n\n      ');

const jelenetNojs = !FOOLDAL ? '' : nojsKeretek(FOOLDAL.keretek || [], {
  cimke: 'A tizenhárom képkocka',
  bevezeto: 'Szkript nélkül a színpad nem tud továbblépni. Az enfilád ' +
    'képkockái itt egymás után állnak, a saját helyükkel és projektjükkel.'
});

const jelenetJelzo = !FOOLDAL ? '' : (FOOLDAL.keretek || []).map((k, i) =>
  `<button type="button" data-hova="${i}" aria-current="${i === 0 ? 'true' : 'false'}">
        <span class="rejtett">${i + 1}. tér — ${esc(k.nev)}</span>
      </button>`).join('\n      ');

/* ---------- A METSZET, mint újrahasznált rendszer ----------

   Itt megszűnik a fénykép mint tér, és lappá válik. Ezért nem küszöb
   választja el a lemezeket, hanem LÉPTÉK: egyszerre egy állomás van a
   képmezőben, és a méret változik, nem a hely.

   Ez a függvény adja a lemezt a főoldal metszetének ÉS a készülés
   minden sorozatának. Egy jelölés, egy stíluslap, egy viselkedés —
   így egy jövőbeli műhelyfotózás nem újratervezés, hanem képcsere.

   `lepte` csak ott kerül a jelölésbe, ahol van: a főoldal hét lemeze
   ma nincs léptékkel megjelölve, és nem is kell — a régi viselkedése
   bájtra ugyanaz marad. */
function lemezHtml(m, i, o = {}) {
  const pr = ELO.find((z) => z.slug === m.slug);
  const alt = pr.kepek.find((k) => k.file === m.kep)?.alt || pr.cim;
  /* A lépték a megjelenített méretet is meghatározza, tehát a
     böngészőnek adott `sizes`-t is — különben egy tenyérnyi
     részletlemezhez is 1400 px-es fájlt töltene. */
  const sizes = { reszlet: '(max-width: 800px) 86vw, 42vw',
                  targy:   '(max-width: 800px) 92vw, 56vw',
                  ter:     '(max-width: 800px) 96vw, 76vw' }[m.lepte]
                || '(max-width: 800px) 92vw, 62vw';

  return `<li class="lemez" data-lepes="${i + 1}"${m.lepte ? ` data-lepte="${esc(m.lepte)}"` : ''}${m.szakasz ? ` data-szakasz="${esc(m.szakasz)}"` : ''}${i === 0 ? ' data-aktiv' : ''}>
        <figure>
          ${pictureKep(m.slug, m.kep, alt, { nagy: '-1400', sizes })}
          <figcaption>
            <p class="tipo-muszaki"><span class="szam">${String(i + 1).padStart(2, '0')}</span> ${esc(m.lepes)}${m.cgi ? ' · látványterv' : ''}${m.lepte && o.leptekJel ? ` <span class="lepte-jel">${esc(LEPTEKEK[m.lepte])}</span>` : ''}</p>
            <p class="tipo-folyo">${esc(m.cimke)}</p>
            ${o.projektLink === false ? '' :
              `<p class="tipo-adat"><a href="/referenciak/${esc(m.slug)}/">${esc(pr.cim)} →</a></p>`}
          </figcaption>
        </figure>
      </li>`;
}

const metszetHtml = !FOOLDAL ? '' :
  (FOOLDAL.metszet || []).map((m, i) => lemezHtml(m, i)).join('\n      ');

/* ---------- 5/c. A KÉSZÜLÉS ----------

   Két rétegből áll, ugyanúgy, mint a flotta — és mindkettő meglévő
   gépezeten fut:

     1. A NYITÁS — három képkocka, egyetlen ragadós színpadon, a
        ter.js vezényletével. RÉSZLET → TÁRGY → TÉR. A különbség itt
        is egyetlen adatmezőben van: a flottában minden küszöb ABLAK,
        itt minden küszöb KAPU. Egy fejezet, egy küszöbfajta.

     2. A SOROZATOK — a metszet rendszere, sorozatonként egyszer,
        ugyanazzal a lemezHtml() függvénnyel, amit a főoldal is hív.
        A lemez MÉRETÉT a lépték adja: végiggörgetve a néző hátralép.

   Semmit nem találunk ki. Ha egy sorozatból hiányzik egy állomás, a
   gerincen üresen marad a jele, és a `hianyzo` mondat kimondja, hogy
   fénykép nincs — nem az, hogy a munka nem történt meg. */

const keszNyitasKeretek = !KESZULES ? '' : (KESZULES.nyitas?.keretek || []).map((k, i) => {
  const [x, y, rx, ry] = k.nyilas;
  return `<div class="nyilas" data-maszk="nincs" data-nezopont="k${i + 1}"${i ? ' hidden' : ''}>
        <div class="ter"${k.lapos ? ' data-lapos' : ''}
             style="--nyx:${(x * 100).toFixed(1)}%; --nyy:${(y * 100).toFixed(1)}%; --nyrx:${(rx * 100).toFixed(1)}%; --nyry:${(ry * 100).toFixed(1)}%"
             data-nev="${esc(k.nev)}"
             data-honnan="${esc(k.hol)}"
             data-hangulat="${esc(k.hangulat || 'nappal')}"
             data-kuszob="${esc(k.kuszob?.fajta || 'kapu')}"
             data-el="${esc(k.kuszob?.el || '')}"
             data-projekt="/referenciak/${esc(k.slug)}/"
             data-szak="${esc(k.allomas || '')}">
          ${egyReteg(k.slug, k.kep, 'tav', i === 0)}
          ${egyReteg(k.slug, k.kep, 'koz', i === 0)}
          ${egyReteg(k.slug, k.kep, 'kozel', i === 0)}
        </div>
      </div>`;
}).join('\n\n      ');

const keszNojs = !KESZULES ? '' : nojsKeretek(KESZULES.nyitas?.keretek || [], {
  cimke: 'A nyitó képkockák',
  bevezeto: 'Szkript nélkül a színpad nem tud továbblépni. A nyitás ' +
    'képkockái itt egymás után állnak; a sorozatok alább végig olvashatók.'
});

const keszNyitasJelzo = !KESZULES ? '' : (KESZULES.nyitas?.keretek || []).map((k, i) =>
  `<button type="button" data-hova="${i}" aria-current="${i === 0 ? 'true' : 'false'}">
        <span class="rejtett">${i + 1}. lépték — ${esc(k.allomas)}: ${esc(k.nev)}</span>
      </button>`).join('\n      ');

/* A gerinc jele: öt hely, és amelyik ebben a sorozatban megvan, az
   tömör. Ugyanaz a jelölés, mint a vízvonal állomásjelei — egy
   vizuális nyelv, két fejezet. A hiány itt információ. */
function gerincJel(sorozat) {
  const van = new Set((sorozat.allomasok || []).map((a) => a.szakasz));
  const jelek = Object.entries(SZAKASZOK).map(([kulcs, nev]) =>
    `<i class="allomas-jel" data-allomas="${kulcs}"${van.has(kulcs) ? ' data-van' : ''} title="${esc(nev)}" aria-hidden="true"></i>`
  ).join('');
  const megvan = Object.keys(SZAKASZOK).filter((k) => van.has(k)).map((k) => SZAKASZOK[k].toLowerCase());
  const nincs = Object.keys(SZAKASZOK).filter((k) => !van.has(k)).map((k) => SZAKASZOK[k].toLowerCase());
  return `<p class="gerinc-jel">
            ${jelek}
            <span class="rejtett">Ebben a sorozatban megvan: ${esc(megvan.join(', '))}.${nincs.length ? ` Nincs fénykép erről: ${esc(nincs.join(', '))}.` : ''}</span>
          </p>`;
}

const keszSorozatok = !KESZULES ? '' : (KESZULES.sorozatok || []).map((s) => {
  const pr = ELO.find((p) => p.slug === s.projekt);
  const lemezek = (s.allomasok || [])
    .map((a, i) => lemezHtml(a, i, { leptekJel: true, projektLink: false })).join('\n        ');
  const jelolok = (s.allomasok || [])
    .map((_, i) => `<div class="metszet-jelolo" data-lemez="${i + 1}"></div>`).join('\n      ');
  const anyagok = (s.anyagok || [])
    .map((a) => `<li>${esc(a)}</li>`).join('');

  return `<section class="metszet keszules-sorozat" id="${esc(s.id)}" data-sorozat
           aria-labelledby="cim-${esc(s.id)}">
    <!-- A ragadós színpad saját dobozban áll: a ragadás a befoglaló doboz
         aljáig tart, és ez a doboz nem a szakasz, hanem csak a színpad és
         a jelölők. Enélkül a sorozat lába rácsúszna a fejre. -->
    <div class="metszet-szinpad">
      <div class="metszet-ragad">
        <div class="metszet-fej">
          <p class="felcim">${esc(s.felcim)}</p>
          <h2 id="cim-${esc(s.id)}">${esc(s.nev)}${s.nevDolt ? `<br><em>${esc(s.nevDolt)}</em>` : ''}</h2>
          <p class="tipo-vezeto">${esc(s.bevezeto)}</p>
          ${gerincJel(s)}
          <p class="sorozat-allas tipo-adat" aria-hidden="true"><span class="most">01</span> / ${String((s.allomasok || []).length).padStart(2, '0')}</p>
        </div>

        <ol class="lemezek">
          ${lemezek}
        </ol>
      </div>

      <div class="metszet-jelolok" aria-hidden="true">
        ${jelolok}
      </div>
    </div>

    <div class="sorozat-lab belul">
      ${anyagok ? `<div class="sorozat-anyag">
        <p class="tipo-muszaki">Anyag</p>
        <ul class="anyag-sor tipo-adat">${anyagok}</ul>
      </div>` : ''}
      ${s.hianyzo ? `<div class="sorozat-hianyzo">
        <p class="tipo-muszaki">Ami nincs meg</p>
        <p class="tipo-folyo">${esc(s.hianyzo)}</p>
      </div>` : ''}
      <div class="sorozat-ki">
        <p class="tipo-muszaki">Mi lett belőle</p>
        <a class="link-nyil" href="/referenciak/${esc(s.projekt)}/">${esc(pr.cim)} <span aria-hidden="true">→</span></a>
        ${s.flotta && FLOTTA ? `<a class="link-nyil" href="/flotta.html">A flotta · ${esc(HAJO_KOORD.get(s.projekt) || '')} <span aria-hidden="true">→</span></a>` : ''}
      </div>
    </div>
  </section>`;
}).join('\n\n  ');

/* A GERINC mint index: öt hely, és mindegyiknél az, hogy hány sorozat
   ér el odáig. Nem infografika — egy szám és egy szó soronként. */
const keszGerinc = !KESZULES ? '' : Object.entries(SZAKASZOK).map(([kulcs, nev], i) => {
  const db = (KESZULES.sorozatok || [])
    .filter((s) => (s.allomasok || []).some((a) => a.szakasz === kulcs)).length;
  const ossz = (KESZULES.sorozatok || []).length;
  return `<li${db ? '' : ' data-ures'}>
          <span class="tipo-adat">${String(i + 1).padStart(2, '0')}</span>
          <b>${esc(nev)}</b>
          <span class="tipo-adat">${db} / ${ossz} sorozat</span>
        </li>`;
}).join('\n        ');

/* Az anyagszótár: kizárólag abból, ami a sorozatokban tényleg szerepel.
   Nincs kitalált DUNA-anyagpaletta. */
const keszAnyagok = !KESZULES ? '' : (() => {
  const terkep = new Map();
  for (const s of KESZULES.sorozatok || []) {
    for (const a of s.anyagok || []) {
      if (!terkep.has(a)) terkep.set(a, []);
      terkep.get(a).push(s.felcim);
    }
  }
  return [...terkep.entries()].map(([anyag, hol]) =>
    `<li><b>${esc(anyag)}</b> <span class="tipo-adat">${esc(hol.join(' · '))}</span></li>`
  ).join('\n          ');
})();

const keszMuhely = !KESZULES || !KESZULES.muhely ? '' : (() => {
  const m = KESZULES.muhely;
  const pr = ELO.find((p) => p.slug === m.slug);
  const alt = pr.kepek.find((k) => k.file === m.kep)?.alt || pr.cim;
  return pictureKep(m.slug, m.kep, alt, { nagy: '-800', lepcso: ['-400', '-800'], sizes: '(max-width: 800px) 88vw, 520px' });
})();

const keszMuhelyCimke = !KESZULES || !KESZULES.muhely ? '' : esc(KESZULES.muhely.cimke);

/* Egy szám a nyitóhoz: hány fénykép áll a fejezet mögött. Nem
   marketing — a lemezek darabszáma. */
/* A két kifelé mutató hivatkozás — a főoldal metszetéből és a flotta
   kivezetéseiből — szintén a fejezet létezésén áll. Ezért nem a
   forrás-HTML-ben állnak, hanem itt: ha nincs adat, nincs link. */
const keszGomb = !KESZULES ? '' :
  `<a class="gomb tolt" href="keszules.html">A készülés <span class="nyil">→</span></a>`;

const keszKijarat = !KESZULES ? '' : `<li>
          <p class="tipo-muszaki">Ahogy készül</p>
          <a class="link-nyil" href="keszules.html#a-hajotest">A hajótest sorozata <span aria-hidden="true">→</span></a>
          <p class="tipo-folyo">Egy test tizenkilenc fényképen: palánkél, borda, szorító, csiszolás, lakk, kárpit. Az archívum egyetlen végigfényképezett munkája.</p>
        </li>`;

const keszOsszeg = !KESZULES ? '' : (() => {
  const sor = (KESZULES.sorozatok || []).length;
  const lem = (KESZULES.sorozatok || []).reduce((n, s) => n + (s.allomasok || []).length, 0);
  const proj = new Set((KESZULES.sorozatok || []).map((s) => s.projekt)).size;
  return `${sor} sorozat · ${lem} fénykép · ${proj} munka`;
})();

/* AZ UTOLSÓ AJTÓ: egy valódi DUNA-kapu. Mögötte négy név — nem
   kitalált, hanem a ceg-adatok.json-ból. */
const ajtoHtml = !FOOLDAL || !FOOLDAL.ajto ? '' : (() => {
  const a = FOOLDAL.ajto;
  const pr = ELO.find((z) => z.slug === a.slug);
  const alt = pr.kepek.find((k) => k.file === a.kep)?.alt || pr.cim;
  /* Az utolsó ajtó a lap FELÉN áll (fooldal.css: .ajto két hasáb), és
     csak 900 px alatt megy teljes szélességre. A `100vw` itt kétszeres
     túlkérés volt. */
  return pictureKep(a.slug, a.kep, alt, { nagy: '-1400', sizes: '(max-width: 900px) 100vw, 50vw' });
})();

const emberekHtml = CEG.kapcsolatok.map((k) => `<li>
          <b class="nev">${esc(k.nev)}</b>
          <span class="tipo-adat">${esc(k.beosztas)}</span>
          <a class="tipo-ui" href="tel:${esc(k.telefonHivas)}">${esc(k.telefon)}</a>
        </li>`).join('\n        ');

/* ---------- 6. behelyettesítés minden lapon ---------- */

const OLDALAK = [];
(function gyujt(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) { if (!/\/(img|fonts|data)$/.test(p)) gyujt(p); }
    else if (e.name.endsWith('.html')) OLDALAK.push(p);
  }
})(OUT);

const SZAMOK = {
  projektSzam: String(ELO.length),
  kepSzam: String(ELO.reduce((n, p) => n + p.kepek.length, 0)),
  ev: String(new Date().getFullYear())
};

const ERTEKEK = { ...CEG, ...SZAMOK };

function behelyettesit(szoveg) {
  for (const [kulcs, ertek] of Object.entries(ERTEKEK)) {
    if (kulcs.startsWith('_') || typeof ertek === 'object') continue;
    szoveg = szoveg.split(`{{${kulcs}}}`).join(String(ertek));
  }
  return szoveg;
}

/* A szkriptek ugyanúgy tartalmaznak {{kulcs}} helyeket, mint a lapok — az
   űrlap végpontja, a reCAPTCHA kulcs és a mérőazonosító onnan kerül beléjük.
   Ez a bélyegzés ELŐTT kell megtörténjen, különben az ujjlenyomat a
   behelyettesítés előtti tartalomból számolódna, és a régi fájl ragadna
   bent a látogatók gyorsítótárában. */
const SZKRIPTEK = ASSETS.filter((a) => a.endsWith('.js'));
for (const f of SZKRIPTEK) {
  const ut = `${OUT}/${f}`;
  writeFileSync(ut, behelyettesit(readFileSync(ut, 'utf8')));
}

/* Gyorsítótár-törés: a GitHub Pages fejléceit nem tudjuk átírni, ezért a
   fájl tartalmából számolt bélyeg kerül a hivatkozás mögé. Ha a fájl
   változik, változik az URL is — a visszatérő látogató biztosan újat tölt. */
const BELYEGZETT = ['style.css', 'admin.css', 'fonts.css', 'rendszer.css', 'ter.css',
  'terv.css', 'fooldal.css', 'flotta.css', 'keszules.css',
  'script.js', 'admin.js', 'consent.js', 'szuro.js', 'galeria.js', 'urlap.js',
  'kuszob.js', 'ter.js', 'terv.js', 'fooldal.js', 'flotta.js', 'keszules.js']
  .filter((f) => existsSync(`${OUT}/${f}`))
  .map((f) => [f, createHash('sha1').update(readFileSync(`${OUT}/${f}`)).digest('hex').slice(0, 8)]);

/* ---------- 6/a. KANONIKUS CÍM ÉS MEGOSZTÁSI JELÖLÉS ----------

   Az 5. fázis végén két lapnak volt `rel="canonical"`-ja (flotta,
   keszules) és egynek sem volt Open Graph jelölése. Kézzel felvenni
   negyvenkét helyre azt jelentené, hogy a negyvenharmadik lemarad —
   és a harminc projektlap amúgy is generált.

   Ezért a fejlécet a build tölti ki, a lap SAJÁT címéből és
   leírásából. Amit a lap már megad (pl. a flotta canonicalja), azt
   nem írjuk felül: az explicit döntés erősebb a származtatottnál.

   Ami KIMARAD: az admin és a 404. Egyik sem megosztható tartalom, az
   adminra ráadásul hard szabály, hogy amit az ügyfél ma használ, az
   ne mozduljon.

   FIGYELEM: a kanonikus cím akkor is a saját domainre mutat, amikor
   a sajatDomainEl még false. Ez szándékos és helyes — pontosan ez
   akadályozza meg, hogy az ideiglenes pages.dev cím indexelődjön. A
   _headers noindex ettől függetlenül él. */

const MEGOSZTHATATLAN = new Set(['admin.html', '404.html']);

function oldalCime(oldal) {
  const ut = oldal.slice(OUT.length + 1).replace(/\\/g, '/');
  return ut === 'index.html' ? '' : ut.replace(/(^|\/)index\.html$/, '$1');
}

/* ---------- szkript nélküli állapot: ne maradjon halott vezérlő ----------

   A 8. fázis mérése: szkript nélkül a lapon OTT VAN minden tartalom (ez
   volt a cél, és teljesül), de ott maradt egy sor gomb is, ami nem
   csinál semmit — a jelzősor, a „tovább” gomb, az Alaprajz és az
   Adatlap gombja, a szűrők. Élőnek látszó, halott vezérlő; pontosan az,
   amitől egy lap befejezetlennek érződik.

   Egyetlen <noscript><style> a fejben. Nincs hozzá szkript, nincs hozzá
   osztály a <html>-en, és szkript mellett a böngésző soha nem
   alkalmazza. Amit csinál:

     · elrejti a kizárólag szkriptből működő vezérlőket,
     · a színpadból az ELSŐ képkockát hagyja állni (a többit a ter.js
       rejtené el; nélküle egymásra torlódnának),
     · az adatlapot lecsúsztatott fedőrétegből rendes, a folyamban álló
       dokumentumrésszé teszi — ez zárja a 7. fázis 9. korlátját, hogy
       „az adatlap szkript nélkül nyitva van és nem lehet becsukni”.

   Amit NEM csinál: nem rejt el tartalmat. Minden fénykép, minden szöveg
   és minden hivatkozás a helyén marad — a <noscript> keretlista is. */

const NOJS_STILUS = `<noscript><style>
  .ter-jelzo, .ter-vezerlok, .ter-tovabb,
  .szuro, .terv-gombok, .flotta-szuro { display: none; }
  .szinpad .nyilas:not(:first-of-type) { display: none; }

  /* Ami GÖRGETÉSRE tárul fel, az szkript nélkül eleve legyen itt.
     A .jon alapállapota opacity: 0, és az .itt osztályt egy
     IntersectionObserver teszi ki — ami szkript nélkül nem fut le.
     Mérve: a Hotel Domus Collis lapján 28 blokk maradt láthatatlanul,
     köztük a teljes fotósorozat. A kártyák képét ráadásul egy
     clip-path is elrejti ugyanezen a jelzőn. */
  .jon { opacity: 1; transform: none; }
  .kartya.jon .keret img { clip-path: none; transform: none; }
  .adatlap {
    position: static; width: auto; z-index: auto;
    border-left: 0; border-top: 1px solid var(--line);
    overflow: visible; translate: none; transition: none;
  }
  .adatlap-zar, #homaly { display: none; }
</style></noscript>`;

function fejMeta(oldal, html) {
  const rel = oldal.slice(OUT.length + 1).replace(/\\/g, '/');
  if (MEGOSZTHATATLAN.has(rel)) return html;
  if (!/<\/head>/i.test(html)) return html;

  const cim = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const leiras = (html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [, ''])[1].trim();
  const url = `https://{{domain}}/${oldalCime(oldal)}`;

  const sorok = [];
  if (!/rel="canonical"/i.test(html)) sorok.push(`<link rel="canonical" href="${url}">`);

  /* A `hu_HU` és a `website` mindenütt igaz; külön típus (article,
     product) csak akkor volna őszinte, ha volna hozzá szerző és
     dátum — nincs. */
  sorok.push(
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="{{cegNev}}">`,
    `<meta property="og:locale" content="hu_HU">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(cim)}">`);
  if (leiras) sorok.push(`<meta property="og:description" content="${esc(leiras)}">`);
  if (KOZOSSEGI) {
    sorok.push(
      `<meta property="og:image" content="https://{{domain}}/${KOZOSSEGI.fajl}">`,
      `<meta property="og:image:width" content="${KOZOSSEGI.szeles}">`,
      `<meta property="og:image:height" content="${KOZOSSEGI.magas}">`,
      `<meta property="og:image:alt" content="${esc(KOZOSSEGI.alt)}">`,
      `<meta name="twitter:card" content="summary_large_image">`);
  } else {
    sorok.push(`<meta name="twitter:card" content="summary">`);
  }

  return html.replace(/<\/head>/i, sorok.join('\n') + '\n</head>');
}

for (const oldal of OLDALAK) {
  let html = readFileSync(oldal, 'utf8');
  const melyseg = oldal.slice(OUT.length + 1).split('/').length - 1;
  const gyoker = '../'.repeat(melyseg);

  html = html
    .replace(/<!--FEJLEC:([a-z]+)-->/, (_, aktiv) => fejlec(aktiv))
    .replace('<!--LABLEC-->', LABLEC)
    .replace('<!--KIEMELT-->', kiemeltek())
    .replace('<!--SZURO-->', szuroGombok())
    .replace('<!--PROJEKTEK-->', ELO.map(kartya).join('\n        '))
    .replace('<!--KAPCSOLATOK-KARTYA-->', kapcsolatKartyak)
    .replace('<!--PALYAZAT-TARTALOM-->', palyazatTartalom)
    .replace('<!--JELENET-KERETEK-->', jelenetKeretek)
    .replace('<!--JELENET-JELZO-->', jelenetJelzo)
    .replace('<!--JELENET-NOJS-->', () => jelenetNojs)
    .replace('<!--FLOTTA-NOJS-->', () => flottaNojs)
    .replace('<!--KESZ-NOJS-->', () => keszNojs)
    .replace('<!--METSZET-->', metszetHtml)
    .replace('<!--AJTO-->', ajtoHtml)
    .replace('<!--EMBEREK-->', emberekHtml)
    .replace('<!--FLOTTA-KERETEK-->', flottaKeretek)
    .replace('<!--FLOTTA-JELZO-->', flottaJelzo)
    .replace('<!--FLOTTA-SOROK-->', () => flottaSorok)
    .replace('<!--FLOTTA-SZURO-->', flottaSzuro)
    .replace('<!--FLOTTA-OSSZEG-->', flottaOsszeg)
    .replace('<!--KESZ-KERETEK-->', keszNyitasKeretek)
    .replace('<!--KESZ-JELZO-->', keszNyitasJelzo)
    .replace('<!--KESZ-SOROZATOK-->', () => keszSorozatok)
    .replace('<!--KESZ-GERINC-->', keszGerinc)
    .replace('<!--KESZ-ANYAGOK-->', keszAnyagok)
    .replace('<!--KESZ-MUHELY-->', keszMuhely)
    .replace('<!--KESZ-MUHELY-CIMKE-->', keszMuhelyCimke)
    .replace('<!--KESZ-OSSZEG-->', keszOsszeg)
    .replace('<!--KESZ-GOMB-->', keszGomb)
    .replace('<!--KESZ-KIJARAT-->', keszKijarat)
    .replace('<!--ALAPRAJZ-FOLYAM-->', () => alaprajzHtml(null, { fedo: false }))
    .replace('<!--ALAPRAJZ-->', () => alaprajzHtml(null, { fedo: true }))
    .replace('<!--EGYEDIEK-->',
      ELO.filter((p) => p.kategoria === 'egyedi').slice(0, 3).map(kartya).join('\n        '));

  html = fejMeta(oldal, html);
  /* Az adminhoz nem nyúlunk: bájtra ugyanaz marad, mint a forrás — az
     ellenőrzés ezt külön vizsgálja, és jogosan bukott el, amikor ez a
     blokk még oda is bekerült. Az adminban amúgy sincs színpad. */
  if (oldal.slice(OUT.length + 1) !== 'admin.html' && /<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${NOJS_STILUS}\n</head>`);
  }
  html = behelyettesit(html);

  for (const [fajl, b] of BELYEGZETT) {
    html = html.split(`"${fajl}"`).join(`"${gyoker}${fajl}?v=${b}"`);
  }

  /* az aloldalakon a gyökérből másolt lábléc hivatkozásai relatívak */
  if (melyseg > 0) {
    html = html.replace(/(href|src)="(?!https?:|mailto:|tel:|#|\/|\.\.\/)/g, `$1="${gyoker}`);
  }

  writeFileSync(oldal, html);
}

/* ---------- 6/b. maradt-e behelyettesítetlen hely ---------- */

/* Ez a lépés azért van, mert egyszer már megtörtént: a szkriptekben bent
   maradt a {{urlapVegpont}}, és mivel a kód csak a 'KITÖLTENDŐ' szót
   kereste, némán rossz címre küldött. Egy elgépelt vagy hiányzó kulcs
   inkább itt bukjon el, mint az éles oldalon. */
const MARADEK = [];
for (const f of [...OLDALAK, ...SZKRIPTEK.map((s) => `${OUT}/${s}`)]) {
  const talalat = readFileSync(f, 'utf8').match(/\{\{[a-zA-Z][a-zA-Z0-9]*\}\}/g);
  if (talalat) MARADEK.push(`${f.slice(OUT.length + 1)}: ${[...new Set(talalat)].join(', ')}`);
}
if (MARADEK.length) {
  console.error('\n!! HIBA — behelyettesítetlen hely maradt a kimenetben:\n  ' +
    MARADEK.join('\n  ') +
    '\n\n  Vagy hiányzik a kulcs a data/ceg-adatok.json-ból, vagy el van gépelve.\n');
  process.exit(1);
}

/* ---------- 6/c. hivatkozik-e valami az eredeti fotókra ----------

   Az eredeti képek (59 MB) nem kerülnek ki, csak a -800 és -1400
   változat. Korábban négy hivatkozás mutatott közvetlenül forrásfájlra
   a főoldalon és a manufaktúra oldalon — emiatt kellett az egész
   könyvtárat felvinni. Ha ez visszakerülne, itt bukjon el, ne az éles
   oldalon egy törött képnél. */

/* A -1800 az ötödik érvényes fok (teljes képmezős szerepek, lásd
   MERET_1800). Enélkül a saját őrünk utasítaná el a most bevezetett
   származékot — helyesen, hiszen addig tényleg nem létezett. */
const NYERS = /img\/projektek\/[a-z0-9-]+\/[^"'\s]*?(?<!-400|-800|-1400|-1800)\.(jpe?g|png|webp|avif)/gi;
const nyersHivatkozas = [];
for (const f of OLDALAK) {
  const talalat = readFileSync(f, 'utf8').match(NYERS);
  if (talalat) nyersHivatkozas.push(`${f.slice(OUT.length + 1)}: ${[...new Set(talalat)].join(', ')}`);
}
if (nyersHivatkozas.length) {
  console.error('\n!! HIBA — átméretezetlen forráskép hivatkozás maradt:\n  ' +
    nyersHivatkozas.join('\n  ') +
    '\n\n  Használja a -800 vagy -1400 változatot (lásd build.mjs 3. lépés).\n');
  process.exit(1);
}

/* ---------- 7. sitemap ---------- */

const ma = new Date().toISOString().slice(0, 10);

/* A sorrend szerkesztői döntés, ezért kézzel írt lista marad. A
   SZŰRÉS viszont nem: ami a saját fejlécében noindex, annak nincs
   dolga a sitemapben — a kettő együtt ellentmondó jelzés a keresőnek.
   Az impresszum, az adatkezelési tájékoztató és a sütik lapja ilyen.
   Így ha egy lap noindexe később megszűnik, magától visszakerül. */
const noindexLap = (u) => {
  const f = `${OUT}/${u || 'index.html'}`.replace(/\/$/, '/index.html');
  if (!existsSync(f)) return false;
  return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(readFileSync(f, 'utf8'));
};

const urlek = [
  '', 'alaprajz.html', 'rolunk.html', 'referenciak.html', 'design-manufaktura.html',
  'kapcsolat.html', 'palyazatok.html', 'impresszum.html',
  'adatkezelesi-tajekoztato.html', 'sutik.html'
].concat(FLOTTA && existsSync('flotta.html') ? ['flotta.html'] : [])
  .concat(KESZULES && existsSync('keszules.html') ? ['keszules.html'] : [])
  .concat(ELO.map((p) => `referenciak/${p.slug}/`))
  .filter((u) => !noindexLap(u));

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
  `${SZAMOK.kepSzam} kép (${keszult} JPEG + ${gyorsult} AVIF/WebP változat, ` +
  `ebből ${ujraszamolt} újrakódolva), ` +
  `${TERLAPOK.size} bejárható tér, domain ${CEG.domain}.`
);

if (kitoltetlen.length) {
  console.log(
    `\n!! FIGYELEM — a data/ceg-adatok.json még kitöltetlen mezőket tartalmaz:\n` +
    kitoltetlen.map((k) => `   - ${k}`).join('\n') +
    `\n   Az oldal működik, de ezek a funkciók addig nem élnek.\n`
  );
}
