# LAUNCH KAPU — ÁLLAPOTJELENTÉS

**DUNA — THE LIVING INTERIOR**
Készült: 2026-08-16. A repó állapota: **RELEASE CANDIDATE**.

**Ez nem fejlesztési fázis.** Egyetlen sor kód sem változott a kapu
felállítása közben. Amit ez a lap tartalmaz: **mérés, leltár és
osztályozás** — a döntések a tulajdonoséi.

---

## 0. A KÉT SOR

> **MŰSZAKILAG ÉLESÍTHETŐ: IGEN.**
> `npm run ellenorzes` → **KIMEHET**, 0 hiba, 6 tájékoztató észrevétel
> (mind a szándékos `data-src` rétegekről). 44 lap, 39 sitemap-cím,
> 0 törött hivatkozás.

> **AWWWARDS-RA BEADHATÓ: NEM.**
> A 15 kapuból **13 nyitatlan**. Részletesen: §5.

---

## 1. AMIT MA MÉRTÜNK — GÉPI ÁLLAPOT

| Mit | Eredmény |
|---|---|
| `npm run ellenorzes` | **KIMEHET** — 0 hiba, 6 észrevétel |
| Lapok száma | 44 |
| `sitemap.xml` `<loc>` | **39** |
| `deploy/_headers` | `X-Robots-Tag: noindex, nofollow` a `/*` blokkban — **jelen van** |
| `deploy/robots.txt` | `Disallow: /admin.html` + sitemap-hivatkozás — helyes |
| `deploy/CNAME` | **nincs** — helyes, amíg `sajatDomainEl` `false` |
| `canonical` (minta) | `https://dunaenterior.hu/`, `…/flotta.html` — az **éles** domainre mutat |
| `sajatDomainEl` | **`false`** |
| `deploy/` frissessége | **naprakész** — újabb minden forrásfájlnál |

**A `noindex` ma szándékos és helyes.** Ez az egyetlen kapcsoló a lap és a
keresők között, és tulajdonosi jóváhagyás nélkül nem mozdul.

---

## 2. DOMUS COLLIS — LELTÁR ÉS DÖNTÉS

**Teljes leltár és a döntési tábla: [DOMUS-COLLIS-DONTES.md](DOMUS-COLLIS-DONTES.md)**

Röviden, a `deploy/` kimenetből mérve:

| Felület | Kép |
|---|---|
| `/referenciak/hotel-domus-collis/` | **mind a 20** |
| `/` — az enfilád **5 kerete a 13-ból** | 02, 04, 07, 14, 20 |
| `/referenciak.html` borító | 01 |
| `/alaprajz.html` cella | 01 |
| `/#alaprajz` fedőréteg (`/`, `/flotta.html`, `/keszules.html`) | 01 |
| `sitemap.xml` | 1 cím |

**`og:image` NEM Domus Collis** — `bodajki-vadaszkastely/02`, kifejezetten a
tisztázatlan jog miatt választva.

**A súlyt ez adja:** a főoldal **1. és 2. kerete** is ebből a projektből
van. Ez a lap nyitánya.

**Döntés:** `KEEP (jog megszerezve)` · `KEEP (kockázattal)` · `REMOVE` ·
`REPLACE (csak a főoldalról)` · `WAIT FOR RIGHTS` — a következményekkel
együtt a fenti lapon. **Amíg nincs döntés, a lap NEM adható be.**

---

## 3. „HARMINC ÉV” — TELJES TALÁLATI LISTA

**Repóban és a `deploy/` kimeneten egyaránt keresve.**

### 3.1 Ami VALÓBAN időtartamot állít — döntést igényel

| # | Fájl | Sor | A szöveg | Hol látszik |
|---|---|---|---|---|
| 1 | `index.html` | 79 | „**Harminc év**, egy műhely, több száz tér.” | a főoldal `<h1>`-je, közvetlenül az „Alapítva 1991” fölött |
| 2 | `build.mjs` | 1274 | „**Harminc év**, egy lapon.” | az **alaprajz fejléce** — `/alaprajz.html` **és** a `/#alaprajz` fedőréteg minden lapon |
| 3 | `rolunk.html` | 26 | „**Közel három évtized** egy szakmában.” | a Rólunk lap `<h1>`-je |
| 4 | `rolunk.html` | 39 | „…**közel három évtizede** áll ügyfelei rendelkezésére…” | a Rólunk lap szövegtörzse |

**Alapítás: 1991** (`data/ceg-adatok.json` → `"alapitas": "1991"`).
**2026-ban ez 35 év.**

**A `deploy/` kimeneten mérve: 8 lap visz időtartam-állítást.**
„Harminc év” 7 lapon (`alaprajz.html`, `index.html`, `flotta.html`,
`keszules.html` és a három bejárható tér lapja — az alaprajz fedőréteg
mindenhová viszi), „közel három évtized” a `rolunk.html`-en, kétszer.

> **Eltérés a korábbi dokumentációtól.** A
> [LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) 1. pontja és a
> [LAUNCH-CONTENT-REVIEW.md §5.1](LAUNCH-CONTENT-REVIEW.md) egyaránt
> **„egy sor az `index.html`-ben”**-t mond. **Négy hely van, három fájlban**,
> és a 2. minden lapon látszik, ahol az alaprajz fedőréteg elérhető.
> Ha a döntés megszületik, **mind a négyet együtt** kell átvezetni,
> különben a lap önmagának mond ellent.

### 3.2 Ami NEM időtartam — nem érinti a döntés

Ezek a **30 projektre** utalnak, és **helyesek**:

| Fájl | Sor | A szöveg |
|---|---|---|
| `index.html` | 179 | „Harminc munkából tizenöt hajó” |
| `flotta.html` | 89 | „Harminc munkából tizenöt hajó…” |
| `keszules.html` | 229 | „Harminc projekt, hét szárny, egy lapon.” |

**Ezekhez nem szabad hozzányúlni.** Ha a projektszám valaha változik, a
`tartalom-matrix` az egyetlen megbízható leltár.

### 3.3 Ami csak dokumentáció

`docs/PHASE-0…8`, `docs/AWWWARDS-CASE-STUDY.md`, `docs/LAUNCH-*` — a fázisok
saját feljegyzései. **Nem publikus, nem érinti a döntést.**

### 3.4 A döntés

```
[ ] A. MARAD — "Harminc év" (nem hamis: 35 > 30)
[ ] B. FRISSÍTVE — "Harmincöt év" (pontos, de 2027-ben újra elavul)
[ ] C. NEM ÉVÜLŐ — "Több mint harminc év" (a 8. fázis javaslata)
```

**Ha B vagy C:** mind a négy hely egyszerre, aztán
`npm run build && npm run ellenorzes`. **Nem automatikus — a repó nem
változtatja meg magától.**

---

## 4. SZEMÉLYISÉGI JOG — KÉT PROJEKT

`data/forras.json` → `projektek` → `szemely: "engedelyre-var"`.

### 4.1 Szent László Látogatóközpont fa kapuja

| | |
|---|---|
| **Kép** | `06.jpg`, `08.jpg` |
| **Mi látszik** | `06` — „A becsomagolt kapuszárny állítva a szállítójármű mellett, **két ember tartja**”<br>`08` — „**Több ember együtt emeli** a becsomagolt kapuszárnyat a lépcsőn” |
| **Indok** | felismerhető emberek munka közben, névtelenül, a saját beépítésükről. Modellszerződés nincs |
| **Mai használat** | `/referenciak/szent-laszlo-latogatokozpont-fa-kapuja/` (galéria) **ÉS `/keszules.html`** — a `keszules.json` „A szállítás” és „A szárny megemelése a helyszínen” állomásai |
| **Döntés** | `[ ] KÖZÖLHETŐ`  `[ ] KIVENNI`  `[ ] KÉRDÉS` |

> **A KÉSZÜLÉS-beli használat súlyosabb, mint ahogy a
> [LAUNCH-CONTENT-REVIEW.md §7.2](LAUNCH-CONTENT-REVIEW.md) sugallja.**
> A 08 képaláírása a fejezetben: *„Ez a fejezet egyetlen fényképe, amelyen
> több kéz is a tárgyon van.”* — vagyis szerkesztőileg **kiemelt** hely.

### 4.2 Vatikáni díszdoboz

| | |
|---|---|
| **Kép** | `01.jpg`, `02.jpg` |
| **Mi látszik** | `01` — „A díszdoboz **átadása** egy vatikáni teremben, állványon a nyitott dobozzal”<br>`02` — „**Csoportkép** a díszdoboz átadásán, mögöttük az állványon a tárggyal” |
| **Indok** | csoportkép az átadásról, felismerhető emberekkel |
| **Mai használat** | `02` → **csak** `/referenciak/vatikani-diszdoboz/`<br>`01` → **a projekt borítóképe (`kiemelt`)**, és ezért **12 lapon** megjelenik: `/`, `/referenciak.html`, `/alaprajz.html`, `/flotta.html`, `/keszules.html`, `/design-manufaktura.html`, és öt projektlap kapcsolódó-sávja |
| **Döntés** | `[ ] KÖZÖLHETŐ`  `[ ] MÁSIK BORÍTÓKÉP`  `[ ] KIVENNI`  `[ ] KÉRDÉS` |

> **Ez a leltár lényegesen szélesebb, mint a §7.2-ben álló
> „szerkesztői okból már ma sincs a KÉSZÜLÉS lapján”.** Az a mondat a
> **fejezet-sorozatokra** igaz. De a `01` mint **borítókép** ott van a
> `/keszules.html` alaprajz-fedőrétegében is, és még tíz további lapon.
> **Ha a tulajdonos úgy dönt, hogy a 01 nem közölhető, akkor a
> `kiemelt` mezőt is át kell állítani** — különben a kép a bélyegképeken
> marad. Ez **adatmunka, nem kódmunka**: `projektek.json` → `kiemelt`.

**Kép eltávolítása automatikusan NEM történt meg és nem is fog.**

---

## 5. AWWWARDS-KAPU — 15 TÉTEL

```
[ ]  1. éles domain él
[ ]  2. noindex eltávolítva
[ ]  3. Domus Collis jog rendezve
[ ]  4. tartalom jóváhagyva (30 leírás)
[ ]  5. személyiségi jog rendezve
[ ]  6. „35 év” állítás megerősítve
[ ]  7. iPhone tesztelve
[ ]  8. Android tesztelve
[ ]  9. éles mély hivatkozások tesztelve
[ ] 10. teljesítmény élesben mérve
[x] 11. akadálymentesség tesztelve      ← gépi audit + emuláció; §6 fenntartással
[ ] 12. képernyőképek valós élesből
[x] 13. esettanulmány átnézve            ← AWWWARDS-CASE-STUDY.md
[x] 14. projektleírás átnézve            ← AWWWARDS-READINESS.md
[x] 15. beadási szöveg átnézve           ← §7
```

# NOT READY

**4 / 15.** A hiányzó 11 közül **egy sem műszaki** — mind tulajdonosi
döntés, jogi rendezés, fizikai készülék vagy éles mérés.

**A lánc:** 3 + 4 + 5 + 6 → 1 + 2 → 9 + 10 + 12 → 7 + 8 → beadás.
**A 3. tétel a legelső**, mert a nyitány öt kerete azon áll.

---

## 6. FENNTARTÁS A 11. TÉTELHEZ

Az akadálymentesség **gépi audittal és valódi érintőemulációval** mérve
(375 / 390 / 412 px, `pointer: coarse`), és hibátlan — **egy tudatosan
vállalt kivétellel**:

`.ter-felirat .honnan` kísérőfelirata világos képkockán **~3:1**
kontraszton áll. A WCAG AA 4,5:1-hez a fátylat kellene erősíteni, ami
**minden képkockát sötétítene**. A felirat információja máshol is megvan
(`<h1>`, morzsa, alsó sáv). **Szerkesztői döntés, nem hiba** — de a
beadásnál ki kell mondani, nem eltakarni.

**A 11. tétel az `[x]` ellenére nem végleges,** amíg a 7. és a 8. (fizikai
készülék, képernyőolvasó és rendszerszintű mozgáscsökkentés) le nem fut:
[DEVICE-QA.md](DEVICE-QA.md) 12. szakasz.

---

## 7. BEADÁSI SZÖVEG — ELŐKÉSZÍTVE, NEM BEADVA

**PROJECT TITLE**

```
DUNA — THE LIVING INTERIOR
```

**SHORT DESCRIPTION**

```
A spatial website for DUNA's interiors, where the visitor moves through
the photographic archive as if moving through the spaces themselves.
```

**LONG DESCRIPTION** → [AWWWARDS-CASE-STUDY.md](AWWWARDS-CASE-STUDY.md),
rövidítés nélkül, felnagyítás nélkül.

**TECHNOLOGIES**

```
HTML · CSS · Vanilla JavaScript · Web Animations API · AVIF/WebP ·
Cloudflare Pages
```

**AMIT NEM ÁLLÍTUNK** (a beadásban is kimondva):
nincs díj · nem teljes a lap (nincs MŰHELY-fejezet) · nem minden jog
rendezett · a fotóanyag archív, 18 projekten vízjellel.

**Ez a blokk KÉSZ, de NEM BEADHATÓ**, amíg a 15-ből 11 kapu zárva van.

---

## 8. KÉPERNYŐKÉPEK — 0 / 9

Egyetlen kép sem készülhet el, amíg a lap nem áll éles címen `noindex`
nélkül. A lista, beállításokkal együtt:
[AWWWARDS-READINESS.md](AWWWARDS-READINESS.md) — *BEADÁSI ANYAGOK*.

**Retusálás, szerkesztés, gyengeség eltakarása tilos.**

---

## 9. OSZTÁLYOZOTT ÉSZREVÉTELEK — MI SZÜLETETT MA

A kapu felállítása közben **négy** eltérést találtunk. **Egyik sem
ENGINEERING BUG, ezért egyetlen kódsor sem változott.**

| # | Észrevétel | Osztály | Teendő |
|---|---|---|---|
| 1 | A „harminc év” **négy** helyen áll, nem egyben (§3.1) | **CONTENT** | a tulajdonos dönt, aztán mind a négy együtt |
| 2 | A Domus Collis leltár **hat** felület, nem négy (§2) | **CONTENT** *(dokumentációs pontosítás)* | rögzítve, a döntést nem változtatja |
| 3 | `vatikani-diszdoboz/01` **borítókép**, ezért 12 lapon látszik (§4.2) | **LEGAL / OWNER DECISION** | a tulajdonos dönt; ha kivétel, a `kiemelt` mező is átáll |
| 4 | `szent-laszlo/06, 08` a **KÉSZÜLÉS kiemelt állomásai** (§4.1) | **LEGAL / OWNER DECISION** | a tulajdonos dönt |

**ENGINEERING BUG: 0.** A build és az audit hibátlan.

---

## 10. A KÖVETKEZŐ LÉPÉS

**Nem fejlesztés.** Sorrendben:

1. **[DOMUS-COLLIS-DONTES.md](DOMUS-COLLIS-DONTES.md)** — a tulajdonos jelöl egyet
2. **[OWNER-APPROVAL.md](OWNER-APPROVAL.md)** — a harminc leírás végigjelölve
3. **§4** — a négy kép személyiségi joga
4. **§3.4** — „harminc év” döntés
5. **[DEVICE-QA.md](DEVICE-QA.md)** — iPhone és Android kézbe véve
6. Ha 1–5 megvan: `npm run tartalom` → `npm run muhely` → `npm run ellenorzes` → `npm run build`
7. Tulajdonosi jóváhagyással: `sajatDomainEl` → `true`, majd
   [LAUNCH-CHECKLIST.md 13.](LAUNCH-CHECKLIST.md) hét lépése
8. Élesítés, majd **éles** ellenőrzés (`curl -I`) — a legfontosabb:
   **nincs véletlen `noindex`**
9. Éles teljesítménymérés, éles képernyőképek
10. `FINAL-LAUNCH-REPORT.md`, majd beadás

**Nincs 9. fázis.**

---

*Kapcsolódó: [DOMUS-COLLIS-DONTES.md](DOMUS-COLLIS-DONTES.md) ·
[OWNER-APPROVAL.md](OWNER-APPROVAL.md) · [DEVICE-QA.md](DEVICE-QA.md) ·
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) ·
[LAUNCH-CONTENT-REVIEW.md](LAUNCH-CONTENT-REVIEW.md) ·
[AWWWARDS-READINESS.md](AWWWARDS-READINESS.md)*
