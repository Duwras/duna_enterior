# 8. FÁZIS — ZÁRÓ CSISZOLÁS

**DUNA — THE LIVING INTERIOR**
Készült: 2026-08-16. Ez az **utolsó mérnöki fázis**.

Nem tervezési fázis. Nem épült új szakasz, nem került be új interakció, nem
jött díszítő effekt, nem lett keretrendszer, nem lett Three.js vagy GSAP, és
nem került be egyetlen futásidejű függőség sem.

**A cél az volt, hogy a meglévő élmény befejezettnek érződjön** — vagyis hogy
elfogyjanak azok az okok, amiktől nem annak érződik.

---

## 1. Kiindulási állapot

A 7. fázis a **C ágon** ért véget: **nem volt műhelyfotózás**, tehát a
MŰHELY nem létezik. A 8. fázis **nem építette meg, nem szimulálta, és nem
gyártott hozzá pótanyagot.**

Ami készen állt: 44 lap, 30 projekt, 371 leírt kép, 3 bejárható tér,
15 hajó, 4 sorozat a KÉSZÜLÉS-ben, szkript nélküli tartalék,
csökkentett mozgás, mobil koreográfia, tartalommátrix, forrás/mester
ellenőrzés, teljesítménykeret, akadálymentességi audit, canonical/OG,
sitemap, mély hivatkozások, böngészőelőzmény, admin bájt-azonosság.

A rendszer koherens volt. **A feladat az utolsó 5% elvétele volt, nem a
hozzáadása.**

Hét dolgot találtunk, ami miatt a lap befejezetlennek érződhetett. Mind a
hét **rendszerszintű**, nem laponkénti folt.

---

## 2. Tartalmi ellenőrzés

Teljes jelentés: **[LAUNCH-CONTENT-REVIEW.md](LAUNCH-CONTENT-REVIEW.md)**.

**Gépi ellenőrzés mind a 30 leíráson és mind a 371 alt szövegen:**

| Vizsgálat | Találat |
|---|---|
| Egyenes idézőjel, aposztróf | 0 |
| Dupla szóköz, szóköz írásjel előtt, hiányzó szóköz utána | 0 |
| Kötőjel gondolatjel helyett | 0 |
| Nyitó/záró szóköz | 0 |
| Hiányzó vagy üres alt | 0 |
| Projekten belüli azonos alt | 0 |
| Számnév ↔ tényleges képszám eltérése | 0 |

**Egyetlen tartalmi javítás.** `meyer-motorcsonak-2` leírásának utolsó
mondata azt állította, hogy az 5. felvétel „az egyetlen műhelybelső az egész
archívumban”. Ez **ellentmondott a saját lapjának**: ugyanennek a projektnek
a 04-es képe alt szövege szerint egy csónak áll „a műhelyben”, és további
hat projekt leírása is műhelyben készült felvételeket említ. A `keszules.json`
ugyanezt pontosan mondja ki: „Egyetlen fénykép, ami **magát a műhelyt**
mutatja.” A mondat **ehhez a saját, pontosabb megfogalmazáshoz** igazodott.
Új tény nem került bele, régi nem tűnt el.

**Amit szándékosan nem javítottunk:** a főcím „Harminc év”-e (35 volna,
ügyfélszöveg — a tulajdonos döntése), a nyolc elemű főmenü (ügyféldöntés), a
gondolatjel házirendje (— és nem –, de **következetesen**: 695 db — és 47 db
– a forrásban), és a `boesch-640-de-luxe` „legteljesebb folyamatdokumentáció”
állítása (**ellenőrizve a 19 alt szövegen és a `flotta.json` állomásadatain
— megáll**).

**22 kimondott hiány** („nincs felvétel”, „nincs adat”, „nem dokumentált”)
maradt érintetlenül. **Egy sem lett kitalált bizonyosságra cserélve.**

---

## 3. Élmény-ellenőrzés

Az öt útvonal végigjárva valódi böngészőben, nem képernyőkép-összevetéssel.

| Útvonal | Eredmény |
|---|---|
| **A** főoldal → küszöb → szakmák → HABLEÁNY → hajófelfedés → metszet → alaprajz → projekt | működik |
| **B** alaprajz → Living Interior → szobaváltás → vissza → alaprajz | működik |
| **C** Flotta → hajó → Flotta → alaprajz | működik |
| **D** A KÉSZÜLÉS → sorozat → projekt → alaprajz | működik |
| **E** mély hivatkozás → szoba → küszöb → vissza → előző kontextus | működik |

**Amit találtunk — és ez volt a fázis legfontosabb egyetlen felfedezése:**

> **Nyitott alaprajz alatt a fejléc a papír FÖLÉ rajzolódott.**

A `terv.js` a testvéreket a `body`-ig `inert`-té teszi, tehát a nyolc
navigációs hivatkozás **már nem működött**. De a fejléc a `<body>` gyereke,
az alaprajz a `<main>`-en belül él — a rétegsorrend szerint a fejléc
felülre került. **Élőnek látszó, halott sáv a lap legfontosabb navigációs
felületén**, mind a hat olyan lapon, ahol az alaprajz fedőrétegként nyílik.

Nem a `z-index`-et emeltük (az a következő szerkezeti változásnál újra
elromlana), hanem kimondtuk, amit az `inert` már eldöntött: **az alaprajz
alatt nincs fejléc.** A kilépés az alaprajz saját BEZÁR / `Esc` gombja.

**Amit szándékosan NEM adtunk hozzá:** kurzoreffekt, szemcse, 3D, izzó
színátmenet, felesleges elmosás, folyadékhatás, részecske, egérkövetés,
görgetéseltérítés, hang, előtöltő-színház, hamis építészeti drótváz.

---

## 4. Küszöb-ellenőrzés

Mind a négy változat, 375 / 390 / 768 / 1440 / 1920 px-en.

| Változat | Eredmény |
|---|---|
| AJTÓ előre | rendben |
| AJTÓ vissza | rendben — ugyanaz a szalag hátrafelé, 480 ms |
| KAPU nappal → éjjel | **a mechanizmus rendben; képanyag nincs hozzá** (aranyóra egyetlen felvételen sincs) |
| ABLAK szoba → hajó | rendben |

Keresve: képszakadás, maszkél, rétegrés, kivágásugrás, perspektívatörés,
villanás, rossz rétegsorrend, fókuszvesztés, görgetéspozíció-hiba,
előzményhiba. **Egyik sem fordult elő.**

**Egy jelenség vizsgálva, és nem hiba.** A főoldal 10. keretén a mérő
„Nappal”-t mutat, miközben már látszik a 11. keret éjszakai képe. Ez a
küszöb menetrendje: a belépő tér a mozdulat 34%-ánál válik láthatóvá, a
kilépő 94%-nál tűnik el, és a mérő a **megérkezéskor** vált — 54 ms-mal a
régi képkocka eltűnése után. **A felirat a hellyel lép, nem a képpel.**
Ellenőrizve a `kuszob.js` időzítéséből. Nem nyúltunk hozzá.

**A 900 ms nem lett gyorsabb.** A visszafelé menet 480 ms maradt. Egyetlen
időzítés, egyetlen görbe, egyetlen mélységmodell nem változott.

**Nem került be hatodik mozgásnyelv.**

---

## 5. Alaprajz-ellenőrzés

| Vizsgálat | Eredmény |
|---|---|
| Minden látható cél elérhető | igen — 0 törött hivatkozás a 44 lapon |
| Minden releváns projekt szerepel | 30 / 30, hét szárnyban |
| A jelenlegi hely felismerhető | igen |
| „forma ≠ rangsor” érthető marad | igen — a cellaszélesség a fotószámból jön, változatlanul |
| Billentyűzet | működik |
| `Esc` | zár és **kitakarítja a címből** a `#alaprajz`-ot |
| Fókusz | a bezáró gombra ugrik, záráskor a nyitóra tér vissza |
| Háttér inert | igen, a testvérek a `body`-ig |
| Mobil | működik, túlcsordulás nélkül |
| Mély hivatkozás (`#alaprajz`) | megnyitja a fedőréteget |

**Két javítás, egyik sem újratervezés:**

1. A fejléc nem látszik nyitott alaprajz alatt (§3).
2. A fedőréteg megkapja a `role="dialog"` + `aria-modal="true"` jelölést —
   **és becsukáskor le is teszi.** Ez azért nem statikus a jelölésben, mert
   a főoldalon **ugyanez az elem** a folyamban álló jelenet: ott nem
   párbeszédablak, és nem is szabad annak lennie.

---

## 6. Mobil-ellenőrzés

Mérve **valódi érintőeszköz-emulációval** (`pointer: coarse`, 5 érintőpont,
mobil user agent), 375 × 812 · 390 × 844 · 412 × 915.

### Amit találtunk

**a) A nézőpontjelző kilógott a képmezőből.**
A főoldal 13 keretével a rögzített 44 + 10 px-es lépés **692 px**-t adott egy
375 px-es képernyőn. **Hat jel a képmezőn kívül**, érintéssel elérhetetlenül
— és a billentyűs fókusz is oda vándorolt, ahol nincs mit látni. A
jelsor mostantól **a képmező szélességét osztja fel**: minden keret
ugyanakkora szeletet kap, akárhány van. 13 keretnél ~27 px, ötnél ~66 px,
mindegyik 44 px magas.

**b) Az ALAPRAJZ gomb 15 px-el kilógott a Flottán.**
A `grid-template-columns: 1fr auto` bal oszlopa nem ment a saját min-content
mérete alá (218 px), és kilökte a jobb oszlopot. `minmax(0, 1fr)` — a
főoldalon és a Flottán egyaránt.

**c) A kapcsolat lapja vízszintesen görgethető volt.**
A `.jon.jobb` belépő mozgás 52 px-el jobbra állítja az elemet, amíg a
görgetés fel nem tárja. A `ter.css` ezt a `.ter-oldal` és a `.fooldal`
esetében levágta; a közönséges lapokon **nem volt semmi**, és a kapcsolat
lapja 375 px-en **407 px** görgethető szélességet adott. Most a `main` vágja
— `clip`, nem `hidden`, tehát a ragadós elemek ragadósak maradnak
(ellenőrizve: a metszet és a színpad `position: sticky` viselkedése
változatlan). **A `body`-n nem működött volna:** a body túlcsordulása a
nézőablakra propagálódik, és a body maga `visible`-ként viselkedik — mérve.

**d) Érintőcélok a szedés magasságán maradtak.**
A 6. fázis a listákat vitte 44 px-re, de hét helyet kihagyott. Mérve:

| Hol | Volt | Miért számít |
|---|---|---|
| Lábléc névjegyek, telefonszámok | 12 px | `tel:` hivatkozás — telefonon ez a legfontosabb célpont |
| Az utolsó ajtó négy telefonszáma | 12 px | **a lap végső tette** |
| Morzsa | 18 px | a projektlap egyetlen felfelé vezető útja |
| Metszet-aláírás projekthivatkozása | 13 px | kivezetés a metszetből |
| Alaprajz szárnyhivatkozás | 12 px | „A flotta →” |
| Cégdoboz e-mail | 18 px | önálló vezérlő |
| Hozzájárulási négyzet | 18 × 18 | kötelező mező |

Mind a hét `pointer: coarse` alatt kapott 44 px-es (a négyzet 24 px-es)
megfogható területet. **A látható szedés egyik helyen sem változott.**

### Eredmény a három szélességen

**Vízszintes túlcsordulás: sehol. Levágott vezérlő: sehol. 24 × 24 alatti
érintőcél: sehol.**

---

## 7. Teljesítmény

Kezdeti letöltés, brotli a szövegre, nyers a képre és a betűre:

| Lap | Össz | HTML | CSS | JS | Betű | Kép |
|---|---:|---:|---:|---:|---:|---:|
| `/` | **170,7** | 11,3 | 30,9 | 22,0 | 50,4 | 56,1 |
| `/flotta.html` | **345,5** | 10,4 | 30,9 | 22,2 | 50,4 | 231,5 |
| `/keszules.html` | **248,0** | 11,8 | 31,2 | 22,4 | 50,4 | 132,2 |
| `/referenciak/duna-cruises-hableany/` | **285,3** | 9,5 | 26,1 | 20,8 | 50,4 | 178,5 |
| `/referenciak/bodajki-vadaszkastely/` | **201,2** | 8,5 | 26,1 | 20,8 | 50,4 | 95,5 |
| `/referenciak/hotel-domus-collis/` | **187,0** | 9,1 | 26,1 | 20,8 | 50,4 | 80,6 |
| `/alaprajz.html` | **120,5** | 5,1 | 19,4 | 10,6 | 50,4 | 35,0 |
| `/referenciak.html` | **115,6** | 5,6 | 16,1 | 8,4 | 50,4 | 35,0 |
| `/kapcsolat.html` | **114,1** | 3,5 | 16,1 | 9,1 | 50,4 | 35,0 |
| `/404.html` | **111,4** | 2,3 | 16,1 | 7,6 | 50,4 | 35,0 |

**Asztali keret 350 KB: BELÜL** (legnehezebb 345,5).
**Mobil keret 300 KB: a Flotta KÍVÜL.**

Valós böngészőmérés a Flottán, 412 px / DPR 2: **19 kérés**, ebből a kép
199,3 KB, a betű 70,1 KB. **Egyetlen kép viszi:**
`duna-cruises-hableany/01-1400.avif`, **197 KB** — a mestere 1,81 megapixel.
Jobb mester ~100 KB-ot ad vissza, és a lap egy lépésben a kereten belülre
kerül. **Ez fotó, nem kód.**

**Amit kerestünk és nem találtunk:** véletlen `preload` (kettő van, a két
legtöbbet használt betű), duplikált erőforrás, kihasználatlan CSS-fájl vagy
JS-fájl, felesleges betű, redundáns képkérés. **Az öt letöltött betűfájl
mind használt** — a `latin-ext` nem elhagyható: az `ő` és az `ű` abban van.

**Amit nem csináltunk:** nem áldoztuk fel a képminőséget mérhetetlen
mikro-optimalizálásért, és nem hajszoltunk számokat a keret alá.

A 8. fázis CSS-többlete brotli után: **+0,0 KB a Flottán, +0,2 KB a
főoldalon.**

**Hálózati mérés valós eszközön (Fast 4G, Slow 4G, közepes mobil CPU) nem
készült el** — a fejlesztői környezetben csak emuláció volt elérhető. Ez
élesítés utáni feladatként rögzítve: [LAUNCH-CHECKLIST.md 14.](LAUNCH-CHECKLIST.md)

---

## 8. Akadálymentesség

`npm run ellenorzes` → **KIMEHET.** Hat tájékoztató észrevétel, mind a
szándékos `data-src` térbeli rétegekről.

Kézi ellenőrzés: billentyűzet, tereptárgyak, fókuszláthatóság,
fókuszvisszaállítás, `Escape`, párbeszédablak, `inert`, csökkentett mozgás,
érintőcélok, címsorrend, hivatkozások, gombok, képek, alt szövegek.

**Javítva a 8. fázisban:**

- a fejléc nem látszik nyitott alaprajz alatt (§3)
- `role="dialog"` + `aria-modal="true"` a fedőrétegen, dinamikusan (§5)
- hét érintőcél-osztály (§6d)
- a nézőpontjelző hat jele visszakerült a képmezőbe (§6a) — ez **fókuszhiba
  is volt**, nemcsak érintési
- a `.ter-felirat .honnan` kísérőfelirata megkapta a tér nevének árnyékát

**Csökkentett mozgás:** ellenőrizve mind a hét stíluslapon. **A mozgás tűnik
el, nem a tartalom** — egyetlen `display: none` sincs a
`prefers-reduced-motion` ágakban. A küszöb 200 ms-os áttűnésre rövidül, a
rétegmozgás szorzója nullára áll, a görgetés `auto`.

**Ismert korlát.** A `.ter-felirat .honnan` világos képkockán ~3:1
kontraszton áll (mérve, kompozit háttérrel). A 8. fázis megkapta a
szövegárnyékot; a WCAG AA 4,5:1-hez a fátylat kellene erősíteni, **ami
minden képkockát sötétítene**. A felirat információja a `<h1>`-ben, a
morzsában és az alsó sávban is megvan, ezért a fénykép élvezett elsőbbséget.
**Tudatos döntés, nem elnézés.**

---

## 9. Szkript nélkül

Mérve valódi szkript nélküli megjelenítéssel mind a kilenc fő lapon.

| Lap | Hivatkozás | Kép `src`-vel | Tartalék lista | Vízszintes görgetés |
|---|---:|---:|---:|---|
| `/` | 99 | 56 | 13 keret | nincs |
| `/flotta.html` | 93 | 56 | 6 állomás | nincs |
| `/keszules.html` | 77 | 56 | 3 sorozat | nincs |
| `/referenciak/duna-cruises-hableany/` | 102 | 66 | 5 nézőpont | nincs |
| `/referenciak/hotel-domus-collis/` | 94 | 62 | 5 nézőpont | nincs |
| `/referenciak/garzon-plaza-hotel/` | 57 | 25 | — | nincs |
| `/alaprajz.html` | 63 | 32 | — | nincs |
| `/kapcsolat.html` | 43 | 2 | — | nincs |
| `/404.html` | 34 | 2 | — | nincs |

**TARTALOM · SZERKEZET · NAVIGÁCIÓ mindenütt megvan.**

**Amit találtunk.** A tartalom megvolt — de **ott maradt egy sor halott
gomb**: a jelzősor, a „tovább” gomb, az Alaprajz és az Adatlap gombja, a
szűrők. Élőnek látszó, nem működő vezérlő; pontosan az, amitől egy lap
befejezetlennek érződik.

**A megoldás egyetlen `<noscript><style>` a fejben.** Nincs hozzá szkript,
nincs hozzá osztály a `<html>`-en, és szkript mellett a böngésző soha nem
alkalmazza. Amit csinál:

1. elrejti a kizárólag szkriptből működő vezérlőket,
2. a színpadból az **első** képkockát hagyja állni (a többi nem torlódik rá),
3. **az adatlapot fedőrétegből a folyamban álló dokumentumrésszé teszi.**

A 3. pont **lezárja a 7. fázis 9. korlátját**: „a szoba adatlapja szkript
nélkül nyitva van, és nem lehet becsukni.” Most nincs mit becsukni — a lap
része.

**Amit nem rejt el: semmilyen tartalmat.** Minden fénykép, minden szöveg és
minden hivatkozás a helyén maradt.

`admin.html` **érintetlen** — a blokk oda nem kerül be.

---

## 10. SEO

| Vizsgálat | Eredmény |
|---|---|
| `<title>` | 44 / 44, mind ≤ 65 karakter |
| `meta description` | minden nyilvános lapon, 50–165 karakter |
| `canonical` | minden nyilvános lapon, mind a saját domainre |
| `og:url` = `canonical` | 44 / 44 |
| Open Graph teljesség | `og:type`, `og:site_name`, `og:locale`, `og:url`, `og:title`, `og:description`, `og:image` + méret + alt |
| `twitter:card` | `summary_large_image` |
| `lang="hu"` | 44 / 44 |
| `<h1>` laponként | pontosan 1, mind a 44-en |
| Címszint-ugrás | 0 |
| Törött belső hivatkozás | **0** |
| Törött `data-src` | **0** |
| Véletlen `noindex` tartalmi lapon | 0 |

**Egy hiba javítva.** Az `impresszum.html`, az
`adatkezelesi-tajekoztato.html` és a `sutik.html` **`noindex` fejlécet visel
ÉS benne volt a sitemapben** — ez a kereső felé ellentmondó jelzés. A
sitemap mostantól **magától kiszűri** a `noindex` lapokat, és az audit
**mindkét irányban** fog: ha egy lapról leveszik a `noindex`-et, hiányként
jön vissza; ha rárakják, fölöslegként.

**Sitemap: 42 → 39 cím.**

**A `404.html`-nek nincs canonicalja és nincs Open Graphja** — szándékos, és
`noindex`-et visel.

**`sajatDomainEl` értéke `false`, és a 8. fázis NEM állította át.**
→ §16.

---

## 11. Biztonság

**A build kimenete átvizsgálva, nem a `.gitignore` alapján.**

Nincs a kimenetben: `partials/`, `scripts/`, `docs/`, `lab/`, `mockup/`,
`worker/`, `node_modules/`, `.kepgyorstar/`, `atvetel/`. Nincs `.mjs`,
`.map`, `.bak`, `.orig`, `.log`, `.zip`. Nincs `localhost`, helyi IP,
`file:///`, helyi útvonal, `pages.dev` cím, `console.log`,
forrástérkép-hivatkozás, kulcsnak látszó érték.

`deploy/data/` — **kizárólag `projektek.json`.** A `forras.json` (belső
jogi és minőségi ítéletek), a `terek.json`, a `flotta.json`, a
`keszules.json` és a `ceg-adatok.json` build-idejű bemenet, és **egyik sem
kerül ki.**

**Hozzáadva a 8. fázisban:** alap biztonsági fejlécek minden lapra —
`X-Content-Type-Options: nosniff`, `Referrer-Policy:
strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`,
`Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()`.
Az audit ezek meglétét mostantól ellenőrzi.

**CSP szándékosan nincs.** A lap `<noscript><style>`-t használ, és a
sütikezelő futásidőben hoz létre `<script>` elemet — `'unsafe-inline'`
nélkül a szabály eltörné az oldalt, azzal pedig alig érne többet a
semminél. **Fél CSP rosszabb, mint a nyíltan vállalt hiánya.** A rendes út
leírva: [LAUNCH-CHECKLIST.md 9.](LAUNCH-CHECKLIST.md)

---

## 12. Admin

**`admin.html`, `admin.js`, `admin.css` bájtra változatlan.**

Az audit a behelyettesítésen és a gyorsítótár-bélyegen túli **minden**
eltérést hibának vesz — és a 8. fázisban **egyszer el is bukott**: az új
`<noscript>` blokk először az adminba is bekerült. A build azonnal
kizárta, és az audit újra átment. **A védőháló működik.**

**Launch-blokkoló hibát az adminban nem találtunk**, tehát nem is nyúltunk
hozzá. A `data/projektek.json` egymondatos javítása az admin saját
formátumában készült (`JSON.stringify(lista, null, 2)`), tehát a következő
ügyfélmentés **nem ad eltérő formátumú diffet**.

---

## 13. Cím-mátrix

**44 lap · HTTP 200 mind · `<title>` mind · canonical mind · OG mind ·
1 `<h1>` mind · 0 törött hivatkozás · sitemap 39.**

### Fő útvonalak

| Cím | Súly | Sitemap | Mobil | Szkript nélkül |
|---|---:|:---:|:---:|:---:|
| `/` | 170,7 KB | ✓ | ✓ | ✓ 13 keret |
| `/referenciak.html` | 115,6 KB | ✓ | ✓ | ✓ |
| `/alaprajz.html` | 120,5 KB | ✓ | ✓ | ✓ |
| `/flotta.html` | 345,5 KB | ✓ | ✓ | ✓ 6 állomás |
| `/keszules.html` | 248,0 KB | ✓ | ✓ | ✓ 3 sorozat |
| `/rolunk.html` · `/kapcsolat.html` · `/design-manufaktura.html` · `/palyazatok.html` | 113–116 KB | ✓ | ✓ | ✓ |
| `/impresszum.html` · `/adatkezelesi-tajekoztato.html` · `/sutik.html` | — | **noindex, kihagyva** | ✓ | ✓ |
| `/404.html` | 111,4 KB | **kihagyva** | ✓ | ✓ |
| `/admin.html` | — | **kihagyva, `robots.txt` tiltja** | — | — |

### A harminc projektcím

Mind `/referenciak/<slug>/` alakban, mind a sitemapben:

`arcangeli-super-jolly` · `belvarosban-nyugalomban` · `bodajki-vadaszkastely` ·
`boesch-560-de-luxe` · `boesch-580` · `boesch-640-de-luxe` · `bojan-harcos` ·
`budai-haz` · `csaladi-haz` · `domus-pellegrini-hotel-apartmanok` ·
**`duna-cruises-hableany`** · `duna-hajok-6-1-cabin` · `duna-hajok-6-1-kadet` ·
`fafaragasok` · `fuzio-a-tajjal` · `garzon-plaza-hotel` · `hotel-domus-collis` ·
`jegvitorlas` · `jolle-25` · `kristaly-etterem` · `mercedes-plato` ·
`meyer-motorcsonak-1` · `meyer-motorcsonak-2` · `ottevenyi-kastely` ·
`rivalis-vitorlas-hajo` · `szent-laszlo-latogatokozpont-fa-kapuja` ·
`vatikani-diszdoboz` · `veteran-motorcsonak` · `volvo-penta-motorcsonak` ·
`zirci-apatsag`

> **`/referenciak/duna-cruises-hableany/` — NEM lett átnevezve
> `/referenciak/hableany/`-ra.** A rövid alak a repóban és a kimenetben
> egyaránt **0 találat**. Ellenőrizve: belső hivatkozások, sitemap,
> canonical, Open Graph, morzsa, alaprajz, főoldal, Flotta, kapcsolódó
> projektek, böngészőelőzmény.

### A három bejárható tér és nézőpont-horgonyaik

| Cím | Horgonyok |
|---|---|
| `/referenciak/duna-cruises-hableany/` | `#orr` · `#atjaro` · `#tat` · `#tat-ejjel` · `#hajo` |
| `/referenciak/hotel-domus-collis/` | `#folyoso` · `#ajto` · `#nappali` · `#konyha` · `#reggelizo` |
| `/referenciak/bodajki-vadaszkastely/` | `#trofeaterem` · `#szavanna` · `#bambusz` |

Betöltéskor a helyes képkockára állnak; a görgetés `replaceState`-tel
követi őket, a szándékos váltás `pushState`-tel.

### Egyéb állapotok

| Állapot | Viselkedés |
|---|---|
| `#alaprajz` bárhol | megnyitja a fedőréteget; `Esc` zár és **kitakarítja a címből** |
| `/referenciak.html#egyedi` | szárnyszűrés |
| `/alaprajz.html#hajo`, `#egyedi`, `#hotel+etterem+kastely` | szárnyszűrés |
| `/keszules.html#a-hajotest` | sorozathorgony |
| `/palyazatok.html#ginop-…` | négy pályázati horgony |

### Hibaállapotok

| Eset | Viselkedés |
|---|---|
| Ismeretlen projekt (`/referenciak/nincs-ilyen/`) | `404.html` — a DUNA saját rendszerében, nem külön látványvilágban |
| Ismeretlen útvonal | `404.html` |
| Hiányzó fájl | `404.html` |
| Hiányzó kép, szobaadat, érvénytelen küszöb, alaprajz-cél vagy hajó | **a build megáll** — nem jut ki élesre |
| Hiányzó metaadat | a build megáll a behelyettesítetlen kulcsnál |

---

## 14. Élesítési ellenőrzőlista

**[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md)** — 14 fejezet: tartalom,
jogok, címek, SEO, teljesítmény, akadálymentesség, mobil, szkript nélkül,
biztonság, admin, analitika, élesítés, domain, élesítés utáni figyelés.

Tartalmi átnézés: **[LAUNCH-CONTENT-REVIEW.md](LAUNCH-CONTENT-REVIEW.md)**.

---

## 15. Awwwards-készenlét

**[AWWWARDS-READINESS.md](AWWWARDS-READINESS.md)** — pozicionálás, tíz
erősség, beadási anyagok ellenőrzőlistája, négy beadás előtti kapu, és
tételesen az, amit **nem** állítunk (nincs díj, nincs alátámasztatlan
felsőfok).

Esettanulmány: **[AWWWARDS-CASE-STUDY.md](AWWWARDS-CASE-STUDY.md)** —
12 fejezet arról, **miért létezik** a lap.

**Egyetlen képernyőkép sem készült**, és nem is készülhet szerkesztéssel
vagy gyengeség eltakarásával. Mind valós éles állapotból, a beadás
pillanatában.

---

## 16. Külső döntések

Sorrendben, aszerint, hogy melyik nyit ki a legtöbbet.

| # | Döntés | Kié | Mit nyit ki |
|---|---|---|---|
| 1 | **Hotel Domus Collis felhasználási jog** | tulajdonos | 5 főoldali keret + 1 szint-1 tér jogi helyzete. **Az egyetlen jogi tétje a lapnak.** Négy lehetőség következményekkel: [LAUNCH-CONTENT-REVIEW.md §7.1](LAUNCH-CONTENT-REVIEW.md) |
| 2 | **`sajatDomainEl` → `true`** | tulajdonos | a site-wide `noindex` megszűnése. Lépésről lépésre: [LAUNCH-CHECKLIST.md 13.](LAUNCH-CHECKLIST.md) |
| 3 | **A harminc leírás elolvasása** | tulajdonos | a fényképolvasatból forrásolt tény lesz |
| 4 | **A műhely, egy nap, 3000 px** | valóság | a lap legnagyobb tartalmi hiánya, egy szint-1 műhelytér, a KÉSZÜLÉS zárófényképe |
| 5 | **Egy rögzített állványállás: nappal + aranyóra + éjjel** | valóság | a nappal→éjjel KAPU. Mechanizmus, szótár és ellenőrző kész; **csak a képkockák hiányoznak** |
| 6 | **Modellszerződések** (`szent-laszlo-…/06, 08`, `vatikani-diszdoboz/01, 02`) | tulajdonos | két projekt személyiségi jogi helyzete |
| 7 | **Jobb mester a Flotta nyitóképéhez** | valóság | ~100 KB, és a Flotta a mobil 300 KB-os kereten belülre kerül |
| 8 | **„Harminc év” → 35** | tulajdonos | egy sor a főoldalon |
| 9 | **Két hajótest építés közben, 3000 px** | valóság | öt felbontási felmentésből három |
| 10 | **Megépült-e a négy tervprojekt** | tulajdonos | négy `ARCHIVE_ONLY` projekt tényleges státusza |

---

## 17. Ismert korlátok

1. **A MŰHELY nem létezik.** Egyetlen fénykép mutatja a műhelyteret
   (`meyer-motorcsonak-2/05`, 0,75 MP, 2004, beégetett dátummal). **Nem
   épült meg, nem lett szimulálva, nem lett pótolva.**
2. **A nappal → éjjel KAPU nem szól.** Az `aranyora` időállapot **egyetlen
   felvételen sincs meg.** A szótár és az ellenőrző azért létezik, hogy
   amikor megjön, ne „Nappal”-ként jelenjen meg.
3. **A Flotta a mobil 300 KB-os kereten kívül** (~330 KB, 412 px / DPR 2).
   Egyetlen kép, néven nevezve.
4. **A `.ter-felirat .honnan` kontrasztja ~3:1** világos képkockán. Tudatos
   döntés a fénykép javára; az információ máshol is megvan. (§8)
5. **Öt kritikus kép a felbontási minimum alatt**, mind az öt névre szólóan
   elfogadva, mind az öt megnevezi a leváltó fényképet.
6. **`duna-hajok-6-1-kadet/06` oldalaránya 2,40**, a 0,42–2,2 sávon kívül.
7. **A „harminc év” 35 éves.** Ügyfélszöveg.
8. **A főmenü nyolc elemű.** Ügyféldöntés.
9. **CSP nincs.** Nyíltan vállalva, indoklással. (§11)
10. **Hálózati mérés valós eszközön nem készült el** — csak emuláció volt
    elérhető. Élesítés utáni feladat.
11. **Valódi készülék nem volt kézben.** Az érintőemuláció a `pointer: coarse`
    ágat helyesen futtatja, de egy iPhone és egy Android ezt nem váltja ki.
12. **A tulajdonos a harminc leírást nem olvasta el.**
13. **`sajatDomainEl` `false`** — a lap site-wide `noindex`. **Nyolcadik
    fázis, ami ezt viszi, és az utolsó műszaki akadály.**
14. **Hat képkocka még mindig szerepel a főoldal metszetében ÉS a
    KÉSZÜLÉS-ben is.** Egy fotózás megszünteti a szükségét.

---

## 18. Zárójavaslat

**A lap műszakilag KÉSZ AZ ÉLESÍTÉSRE.**

A 8. fázis hét rendszerszintű hibát talált és javított — a fejléc a papír
fölött, hat elérhetetlen jel a mobil jelzősoron, egy levágott gomb, egy
vízszintesen görgethető lap, hét apró érintőcél, egy ellentmondó
sitemap-jelzés, és egy sor halott gomb szkript nélkül. **Egyik sem
laponkénti folt volt: mind a rendszerben lett javítva.**

**Új szakasz, új interakció, új függőség, új mozgásnyelv nem került be.**
A 900 ms nem lett gyorsabb. A metszet, az alaprajz, a Flotta és a főoldal
koncepciója nem változott. Fénykép nem lett cserélve, és nem készült
mesterséges kép.

**A három nyitott kérdés közül egy sem mérnöki:**

1. Le lehet-e fényképezni a műhelyt?
2. Megszerezhetők-e írásban a Domus Collis jogai?
3. Pontosak-e a harminc leírás?

**Ez a repó minden mást megcsinált, ami új valós bemenet nélkül
megcsinálható.**

A következő őszinte lépés **nem több kód.** Egy fénykép, egy aláírás, vagy
egy `true` a `sajatDomainEl` helyén.

**Ne induljon 9. fázis, hogy legyen mit építeni.**

---

## Függelék — a 8. fázisban módosított fájlok

**Létrehozva (5):**
`docs/PHASE-8-FINAL-POLISH.md` · `docs/LAUNCH-CONTENT-REVIEW.md` ·
`docs/LAUNCH-CHECKLIST.md` · `docs/AWWWARDS-READINESS.md` ·
`docs/AWWWARDS-CASE-STUDY.md`

**Módosítva (9):**

| Fájl | Mi |
|---|---|
| `build.mjs` | sitemap kiszűri a `noindex` lapokat · `NOJS_STILUS` beszúrása minden lapra az admin **kivételével** · alap biztonsági fejlécek egyetlen `/*` blokkban |
| `scripts/ellenorzes.mjs` | a sitemap-ellenőrzés kihagyja a `noindex` lapokat · a `noindex`-figyelő reguláris kifejezés általánosítva a bővült `/*` blokkra · **új**: a négy biztonsági fejléc megléte |
| `data/projektek.json` | **egyetlen mondat** — `meyer-motorcsonak-2` műhelyfotó-állítása (§2) |
| `terv.css` | nyitott alaprajz alatt nincs fejléc · `.szarny-ki` érintőcél |
| `terv.js` | `role="dialog"` + `aria-modal="true"` nyitáskor, levéve záráskor |
| `ter.css` | `.honnan` szövegárnyék · a mobil nézőpontjelző léptékké válik |
| `fooldal.css` | `.aktus .felulet` `minmax(0, 1fr)` · a jelzősor nyújtva · metszet-aláírás és az utolsó ajtó érintőcéljai |
| `flotta.css` | `.flotta-nyitas .felulet` `minmax(0, 1fr)` · a jelzősor nyújtva |
| `style.css` | `main { overflow-x: clip }` · lábléc névjegyek · morzsa · cégdoboz e-mail · hozzájárulási négyzet |

**Nem módosítva:** `admin.html`, `admin.js`, `admin.css` (**bájtra
azonos**), a Worker, `data/terek.json`, `data/flotta.json`,
`data/keszules.json`, `data/forras.json`, `data/palyazatok.json`,
`data/ceg-adatok.json`, `kuszob.js`, `ter.js`, `fooldal.js`, `flotta.js`,
`keszules.js`, `script.js`, `consent.js`, `szuro.js`, `galeria.js`,
`urlap.js`, `rendszer.css`, `keszules.css`, `fonts.css`, `robots.txt`,
`partials/*`, a többi `scripts/*.mjs`.

**Fotó:** egyetlen forráskép sem lett hozzáadva, átméretezve, újratömörítve,
átnevezve vagy törölve. **A build 0 képet kódolt újra.**

**Függőség:** nincs hozzáadva. **Útvonalak:** 44 lap változatlanul,
**sitemap 42 → 39** (a három `noindex` lap kiszűrve).

**`sajatDomainEl`: továbbra is `false`.** Nem lett átállítva, a brief
szerint. A site-wide `noindex` fejléc a helyén, és az audit a jelzőt
**mindkét irányban** ellenőrzi.
