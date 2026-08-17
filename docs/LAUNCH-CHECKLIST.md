# LAUNCH — ELLENŐRZŐLISTA

**DUNA — THE LIVING INTERIOR · 8. fázis, 4. szakasz**
Készült: 2026-08-16. A lap állapota: **44 lap, 30 projekt, 371 kép,
3 bejárható tér, 39 cím a sitemapben.**

Jelölés: **[x]** kész és ellenőrizve · **[ ]** a tulajdonos döntése vagy
külső bemenet · **[!]** ismert korlát, tudatosan vállalva.

Az ellenőrzés egyetlen paranccsal megismételhető:

```bash
npm run build && npm run ellenorzes
```

---

## 1. TARTALOM

- [x] Mind a 30 projektnek van leírása — gépi ellenőrzés, 0 hiány
- [x] Mind a 371 képnek van alt szövege — 0 hiány, 0 üres alt `aria-hidden` nélkül
- [x] Tipográfia: egyenes idézőjel, aposztróf, dupla szóköz, rossz kötőjel — **0 találat**
- [x] Számnevek egyeznek a tényleges képszámmal — mind a 30-on
- [x] Kimondott bizonytalanság megőrizve („nincs felvétel”, „nincs adat”) — 22 mondat, egy sem lett kitalált bizonyosságra cserélve
- [x] Ellentmondás javítva: `meyer-motorcsonak-2` műhelyfotó-állítás → [LAUNCH-CONTENT-REVIEW.md §4](LAUNCH-CONTENT-REVIEW.md)
- [x] Felsőfokú állítások ütköztetve a `flotta.json` állomásadataival — megállnak
- [ ] **A tulajdonos elolvassa a 30 leírást** — különösen a négy „nincs adat arról, hogy megépült-e” mondatot
- [ ] **„Harminc év” → 35** a főoldal főcímében (alapítás: 1991) — egy sor az `index.html`-ben
- [!] A leírások a fényképek olvasatai. Nincs bennük kitalált tény, de dátum, megrendelő, anyag és helyszín csak a tulajdonostól jöhet.

## 2. JOGOK

- [ ] **Hotel Domus Collis felhasználási jog írásban** — fényképész ismeretlen, jog rendezetlen. A négy lehetőség és következményük: [LAUNCH-CONTENT-REVIEW.md §7.1](LAUNCH-CONTENT-REVIEW.md). **Ez az egyetlen jogi tétje a lapnak.**
- [ ] `szent-laszlo-…-fa-kapuja/06, 08` — felismerhető személyek, tulajdonosi megerősítés hiányzik
- [ ] `vatikani-diszdoboz/01, 02` — felismerhető személyek az átadásról
- [x] A 8. fázis **nem vezetett be új Domus Collis felhasználást**, és nem változtatta a címét
- [x] Vízjel és beégetett dátumbélyeg 18 projekten — saját archívum, nem retusáljuk, szerkesztői döntés
- [x] `csaladi-haz` beégetett költségvetési felirata — a leírás kimondja
- [x] EU / KTK 2020 kötelező tájékoztatási blokk minden lap alján, szó szerint

## 3. CÍMEK

- [x] **44 lap, 0 törött belső hivatkozás** — gépi, minden `href` és `src` a kimeneten
- [x] 0 törött `data-src` (a térbeli rétegek lusta forrásai)
- [x] Mind a 30 projektcím elérhető: `/referenciak/<slug>/`
- [x] **A HABLEÁNY címe `/referenciak/duna-cruises-hableany/`**, mindenütt — sitemap, canonical, OG, morzsa, alaprajz, flotta, főoldal, kapcsolódó projektek. `/referenciak/hableany/`: **0 találat**
- [x] 3 bejárható tér nézőpont-horgonyokkal (`#orr`, `#atjaro`, …) — mély hivatkozás betöltéskor a helyes képkockára áll
- [x] `#alaprajz` mély hivatkozás megnyitja a fedőréteget, `Esc` bezárja és **kitakarítja a címből**
- [x] Böngészőelőzmény: szándékos váltás `pushState`, görgetés `replaceState` — a vissza gomb nem kér tíz visszalépést
- [x] Teljes cím-mátrix: [PHASE-8-FINAL-POLISH.md §13](PHASE-8-FINAL-POLISH.md)

## 4. SEO

- [x] `<title>` mind a 44 lapon, mind ≤ 65 karakter
- [x] `meta description` minden nyilvános lapon, 50–165 karakter között
- [x] `canonical` minden nyilvános lapon, mind a saját domainre mutat
- [x] Open Graph teljes (`og:type`, `og:site_name`, `og:locale`, `og:url`, `og:title`, `og:description`, `og:image` + méret + alt), `twitter:card`
- [x] `og:url` = `canonical` mind a 44 lapon
- [x] `lang="hu"` mindenütt
- [x] **Pontosan egy `<h1>` laponként**, 0 címszint-ugrás
- [x] `sitemap.xml` — **39 cím**; a `noindex` lapok (impresszum, adatkezelési tájékoztató, sütik) **kikerültek belőle** (8. fázis javítás: a sitemap és a `noindex` együtt ellentmondó jelzés volt)
- [x] `robots.txt` — `Disallow: /admin.html`, sitemap-hivatkozás
- [x] `404.html` `noindex`, canonical és OG nélkül — szándékos
- [x] Nincs véletlen `noindex` egyetlen tartalmi lapon sem
- [ ] **`sajatDomainEl` átállítása** — → 13. pont

## 5. TELJESÍTMÉNY

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
| `/404.html` | **111,4** | 2,3 | 16,1 | 7,6 | 50,4 | 35,0 |

- [x] **Asztali keret 350 KB — BELÜL.** A legnehezebb lap a Flotta, 345,5 KB
- [!] **Mobil keret 300 KB — a Flotta KÍVÜL** (~330 KB valós mérésen, 412 px / DPR 2). **Egyetlen ok:** a nyitó képkocka `duna-cruises-hableany/01` mestere 1,81 MP, AVIF-ként q36-on is **197 KB**. Jobb mester ~100 KB-ot ad vissza, és a lap egy lépésben a kereten belülre kerül. Ez **fotó, nem kód**.
- [x] Nincs felesleges `preload`: két betűfájl, a legtöbbet használt kettő
- [x] Nincs kihasználatlan betű — 5 fájl tölt le, mind használt: Cormorant 300 (latin + latin-ext + kurzív), Archivo 400 (latin + latin-ext). **A latin-ext nem elhagyható: az `ő` és az `ű` abban van.**
- [x] Nincs duplikált erőforrás, nincs forrástérkép, nincs holt CSS-fájl
- [x] A térbeli rétegek `data-src`-vel várnak — csak a szomszédos képkocka tölt (`ter.js` `kepekBe()`)
- [x] A 8. fázis CSS-többlete: **+0,0 KB** a Flottán, +0,2 KB a főoldalon (brotli után)
- [ ] Hálózati mérés valós eszközön (Fast 4G / Slow 4G / közepes mobil CPU) — → 14. pont

## 6. AKADÁLYMENTESSÉG

- [x] `npm run ellenorzes` — **hibátlan**, 6 tájékoztató észrevétel (mind a szándékos `data-src` rétegekről)
- [x] Fókuszjel mindenütt: `:focus-visible { outline: 2px solid var(--brass) }`
- [x] **Alaprajz mint párbeszédablak:** háttér `inert` (a testvérek a `body`-ig), fókusz a bezáró gombra, `Esc` zár, fókusz visszaáll a nyitó gombra, cím kitakarítva
- [x] **Új a 8. fázisban:** az alaprajz fedőrétegként megkapja a `role="dialog"` + `aria-modal="true"` jelölést, és becsukáskor le is teszi (a főoldalon ugyanez az elem a folyamban álló jelenet — ott nem párbeszédablak)
- [x] **Új a 8. fázisban:** nyitott alaprajz alatt a fejléc nem látszik. Korábban a nyolc navigációs hivatkozás a papír fölé rajzolódott, `inert` állapotban — élőnek látszó, halott sáv
- [x] Billentyűzet: nyíl balra/jobbra/fel/le lépteti a nézőpontokat, csak amikor a szakasz a képmezőben van; űrlapmezőben és nyitott adatlapnál nem
- [x] `Esc`: nyitott alaprajzot zár, nyitott adatlapot zár, egyébként alaprajzot nyit
- [x] Címkézett űrlapmezők, névvel bíró gombok, ismétlődő `id` nélkül
- [x] Tereptárgyak: `header`, `nav`, `main`, `footer` minden lapon; ugrás-hivatkozás a tartalomra
- [x] **Csökkentett mozgás:** a mozgás eltűnik, a tartalom nem. A küszöb 200 ms-os áttűnésre rövidül, a rétegmozgás szorzója nullára áll, a görgetés `auto`. Egyetlen `display: none` sincs a `prefers-reduced-motion` ágakban — ellenőrizve mind a hét stíluslapon
- [x] Érintőcélok — mérve, valódi érintőemulációval (`pointer: coarse`), 375 / 390 / 412 px-en. **8. fázis javítások:** lábléc névjegyek és telefonszámok, morzsa, metszet-aláírás hivatkozásai, az utolsó ajtó négy telefonszáma, alaprajz szárnyhivatkozás, cégdoboz e-mail, hozzájárulási négyzet
- [!] `.ter-felirat .honnan` kísérőfelirata világos képkockán ~3:1 kontraszton áll (mérve). A 8. fázis megkapta a név árnyékát; a WCAG AA 4,5:1-hez a fátylat kellene erősíteni, ami **minden képkockát sötétítene**. A felirat információja máshol is megvan (`<h1>`, morzsa, alsó sáv), ezért a fénykép élvezett elsőbbséget. Tudatos döntés.

## 7. MOBIL

Mérve valódi érintőeszköz-emulációval, **375 × 812**, **390 × 844**, **412 × 915**.

- [x] **Nincs vízszintes túlcsordulás egyetlen lapon sem.** 8. fázis javítás: a `main` most levágja az oldalirányú belépő mozgást (`main { overflow-x: clip }`). A kapcsolat lapja 375 px-en **407 px-nyi görgethető szélességet** adott
- [x] Nincs levágott vezérlő. 8. fázis javítás: a Flotta és a főoldal rácsa `minmax(0, 1fr)` — az `1fr` nem ment a min-content alá, és az ALAPRAJZ gomb **15 px-el kilógott** a képmezőből
- [x] **Nézőpontjelző:** a főoldal 13 keretével a rögzített 44 + 10 px-es lépés **692 px** volt egy 375 px-es képernyőn — hat jel a képmezőn kívül, érintéssel elérhetetlenül. Most a sor a képmező szélességét osztja fel: minden keret ugyanakkora szeletet kap, 44 px magas, mind a 13 elérhető
- [x] Érintőcélok ≥ 24 × 24 (WCAG 2.5.8 AA), a vezérlők ≥ 44 px magasak
- [x] Vízszintes ujjmozdulat lépteti a kameraállásokat; a függőleges görgetés az enfilád
- [x] Nincs ragadós elem, ami elnyelné a görgetést
- [x] Tipográfia nem esik szét; a képkockák kivágása marad
- [x] A műszaki sáv a főoldalon elrejtve (nincs döntése), a Flottán marad (van: hányadik állomás)
- [ ] **Megerősítés valódi készüléken** — az emuláció a `pointer: coarse` ágat helyesen futtatja, de egy iPhone és egy Android kézbevétele ezt nem váltja ki

## 8. SZKRIPT NÉLKÜL

Mérve minden fő lapon, valódi szkript nélküli megjelenítéssel.

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

- [x] **TARTALOM · SZERKEZET · NAVIGÁCIÓ** mindenütt megvan
- [x] **Új a 8. fázisban:** egyetlen `<noscript><style>` a fejben elrejti a kizárólag szkriptből működő vezérlőket (jelzősor, „tovább” gomb, Alaprajz és Adatlap gombja, szűrők). Korábban **élőnek látszó, halott gombok** maradtak a lapon
- [x] **Új a 8. fázisban:** a színpadból az első képkocka áll, a többi nem torlódik rá
- [x] **Új a 8. fázisban — a 7. fázis 9. korlátja lezárva:** az adatlap fedőrétegből a folyamban álló dokumentumrésszé válik, a halott bezáró gomb eltűnik. Korábban „szkript nélkül nyitva van, és nem lehet becsukni”
- [x] A sütisáv szkriptből jön — szkript nélkül nincs halott sáv
- [x] A galéria bélyegképei valódi hivatkozások a nagy képre
- [x] `admin.html` **érintetlen** — a `<noscript>` blokk oda nem kerül be (az audit külön vizsgálja)

## 9. BIZTONSÁG

- [x] A kimenetben **nincs**: `partials/`, `scripts/`, `docs/`, `lab/`, `mockup/`, `worker/`, `node_modules/`, `.kepgyorstar/`, `atvetel/`
- [x] `deploy/data/` — **kizárólag `projektek.json`** (ezt tölti be az admin). A `forras.json`, `terek.json`, `flotta.json`, `keszules.json`, `ceg-adatok.json` build-idejű bemenet, és belső ítéleteket is tartalmaz — egyik sem kerül ki
- [x] Nincs `.mjs`, `.map`, `.bak`, `.orig`, `.log`, `.zip` a gyökérben
- [x] Nincs `localhost`, helyi IP, `file:///`, helyi útvonal, `pages.dev` cím a kimenetben
- [x] Nincs `console.log`, nincs forrástérkép-hivatkozás
- [x] Nincs kulcsnak látszó érték
- [x] Űrlap-mézesbödön (`.csapda`) a képmezőn kívül, `tabindex="-1"`
- [x] **Új a 8. fázisban — alap biztonsági fejlécek** minden lapon: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`, `Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=()`. Az audit ezek meglétét mostantól ellenőrzi
- [!] **CSP szándékosan nincs.** A lap `<noscript><style>`-t használ, és a sütikezelő futásidőben hoz létre `<script>` elemet — `'unsafe-inline'` nélkül a szabály eltörné az oldalt, azzal pedig alig érne többet a semminél. **Ha a tulajdonos CSP-t akar**, az önálló, mérhető munka: az inline stílus külön fájlba, a sütikezelő betöltője nonce-ra, majd `Content-Security-Policy-Report-Only` egy hétig. Fél CSP rosszabb, mint a nyíltan vállalt hiánya
- [x] `robots.txt`: `Disallow: /admin.html`

## 10. ADMIN

- [x] **`admin.html`, `admin.js`, `admin.css` bájtra változatlan** — az audit a behelyettesítésen és a gyorsítótár-bélyegen túli minden eltérést hibának vesz, és **a 8. fázisban egyszer el is bukott** (a `<noscript>` blokk oda is bekerült), majd javítva lett
- [x] Az admin ugyanabban a formában írja a `projektek.json`-t (`JSON.stringify(lista, null, 2)`) — a 8. fázis egymondatos javítása ezért nem okoz eltérő formátumú következő mentést
- [x] A `leiras` mezőhöz a 8. fázis nem nyúlt az egy javított mondaton kívül
- [x] Az admin `tisztit()` függvénye fix mezőlistára szűkít; a stúdiótulajdonú fájlokhoz (`terek.json`, `flotta.json`, `keszules.json`, `forras.json`) **hozzá sem nyúl**
- [x] Nem található launch-blokkoló hiba az adminban. **Ha valaki mégis talál, a 8. fázis szabálya: MEGÁLL és jelent, nem javít.**

## 11. ANALITIKA

- [x] **Nincs harmadik féltől származó analitika, és a 8. fázis nem is tett bele.**
- [x] A sütisáv jelen van, és a mérési sütihez **külön hozzájárulást kér** („Az oldal működéséhez semmilyen süti nem kell.”). A tájékoztató szövege igaz: mérés nélkül is teljes a lap
- [x] A hozzájárulás nélküli alapállapot: semmi nem tölt le
- [ ] **Ha a tulajdonos mérést akar**, a `consent.js` már megvan hozzá — csak a mérőkód azonosítója hiányzik. Adatkezelési szempontból önhosztolt, süti nélküli mérő (pl. szerveroldali napló) a legkevésbé beavatkozó
- [x] **Awwwards-hoz nem kell mérés.**

## 12. ÉLESÍTÉS

- [x] `npm run build` — hibátlan, 44 lap, **0 kép újrakódolva**
- [x] `npm run ellenorzes` — **KIMEHET**
- [x] Gyorsítótár-bélyeg (`?v=…`) minden CSS és JS hivatkozáson
- [x] `.nojekyll` kiírva
- [x] `_headers` kiírva
- [x] `CNAME` **nincs** kiírva (helyes: `sajatDomainEl` false)

Élesítés:

```bash
npm run kozzetetel
```

*(`node build.mjs && wrangler pages deploy deploy --project-name duna-enterior --branch main`)*

## 13. DOMAIN

**`sajatDomainEl` értéke `false`, és a 8. fázis NEM állította át.**

A repóban **nincs tulajdonosi jóváhagyás** az átállásra, tehát a jelző marad.

Amíg `false`:

- `_headers` → `X-Robots-Tag: noindex, nofollow` **minden lapon** — a kereső nem indexel
- `CNAME` nem íródik ki
- a `canonical` és az `og:url` **már ma is** `https://dunaenterior.hu/…`-ra mutat, tehát az átálláskor egyetlen cím sem változik

**A teljes átállás, ha a tulajdonos dönt:**

1. A domain DNS-e mutasson a Cloudflare Pages projektre, és a tanúsítvány álljon készen
2. `data/ceg-adatok.json` → `"sajatDomainEl": true`
3. `npm run build && npm run ellenorzes`
   *Az audit **mindkét irányban** fog: ha a jelző `true`, de a site-wide `noindex` bent maradt, megbukik; ha `false`, de hiányzik, szintén.*
4. Ellenőrizd, hogy a `deploy/_headers` `/*` blokkjából **eltűnt** az `X-Robots-Tag` sor, és `deploy/CNAME` **létrejött**
5. `npm run kozzetetel`
6. Élesben: `curl -I https://dunaenterior.hu/` → **ne legyen** `x-robots-tag` fejléc
7. Google Search Console: tulajdon igazolása, `sitemap.xml` beküldése (39 cím)

**Ez az egyetlen kapcsoló a lap és a keresők között. Egy sor, és utána visszamérhető.**

## 14. ÉLESÍTÉS UTÁNI FIGYELÉS

- [ ] **Első 24 óra:** `curl -I` a főoldalra, a Flottára, a KÉSZÜLÉS-re és egy projektlapra — 200-as válasz, helyes `canonical`, **nincs** `x-robots-tag`
- [ ] **Első hét:** Search Console — indexelt lapok száma a sitemap 39 címéhez képest; a `noindex` lapok (impresszum, adatkezelési tájékoztató, sütik) **ne** jelenjenek meg
- [ ] **Első hét:** valós felhasználói mérés (CrUX vagy kézi) Fast 4G és Slow 4G mellett, közepes mobil CPU-n — LCP, CLS, INP. **A Flotta a mérendő lap**, ott van a 197 KB-os nyitó képkocka
- [ ] **Első hét:** kézbe venni egy iPhone-t és egy Androidot. A küszöb, az alaprajz és a láblécgombok emulációban rendben vannak; a kéz ezt nem váltja ki
- [ ] **Folyamatos:** a kapcsolati űrlap tényleg megérkezik-e
- [ ] **Folyamatos:** minden ügyfélmentés után `npm run tartalom` — ez az egyetlen megbízható leltár
- [ ] **Bármely új képanyag érkezésekor:** `npm run muhely` fogadja vagy utasítja el, **mielőtt** bekerülne

---

## Ami a listán kívül marad

**Nem a lap dolga, hanem a valóságé.** Sorrendben, aszerint, hogy melyik
nyit ki a legtöbbet:

1. **A műhely, egy nap, 3000 px** — a lap legnagyobb tartalmi hiánya. Ma
   **egyetlen** fénykép mutatja a műhelyteret (`meyer-motorcsonak-2/05`,
   0,75 MP, 2004). A 8. fázis **nem építette meg a MŰHELY-t, és nem is
   pótolta semmivel.**
2. **Egy rögzített állványállás nappal + aranyóra + éjjel** — a nappal→éjjel
   KAPU mechanizmusa, szótára és ellenőrzője kész; **csak a képkockák hiányoznak.**
3. **Hotel Domus Collis jogai írásban** — 2. pont.
4. **Jobb mester a Flotta nyitóképéhez** — 5. pont; ez viszi a lapot a mobil
   keretbe.
5. **A harminc leírás tulajdonosi átolvasása** — 1. pont.

---

*Kapcsolódó: [LAUNCH-CONTENT-REVIEW.md](LAUNCH-CONTENT-REVIEW.md) ·
[PHASE-8-FINAL-POLISH.md](PHASE-8-FINAL-POLISH.md) ·
[AWWWARDS-READINESS.md](AWWWARDS-READINESS.md)*
