# HOTEL DOMUS COLLIS — FELHASZNÁLÁSI JOG, DÖNTÉSI ÍV

**DUNA — THE LIVING INTERIOR · launch kapu**
Készült: 2026-08-16. A leltár a **valós build kimenetből** készült
(`deploy/`, 44 lap), nem dokumentációból.

**Ez a lap semmit nem változtat meg.** Kimondja, hol van ma a Domus Collis
képanyag, és mi történik a négy lehetséges döntés mindegyikénél. **A döntés
a tulajdonosé.**

---

## 1. A TÉNYÁLLÁS

`data/forras.json` → `projektek` → `hotel-domus-collis`:

```json
{
  "jogok": "tisztazando",
  "eredet": "kulso-fotos",
  "allapot": "NEEDS_RIGHTS"
}
```

- A húsz kép alt szövege eredetileg **Facebook CDN fájlnév** volt (0. fázis §6)
  — közösségi médiából való átvételre és korábbi újratömörítésre utal.
- **A fényképész személye ismeretlen.**
- **Felhasználási jog írásban nincs.**

**Ez a lap egyetlen nyitott jogi tétele.** A többi 29 projekt `sajat-archivum`.

---

## 2. HOL JELENIK MEG MA — TELJES LELTÁR

Gépi leltár a `deploy/` kimeneten: minden `img/projektek/hotel-domus-collis/…`
hivatkozás és minden `href`.

### 2.1 Ahol a **fénykép maga** látszik

| Cím | Mi | Mester | Súly |
|---|---|---|---|
| `/referenciak/hotel-domus-collis/` | bejárható tér (szint 1) + teljes galéria | **mind a 20** (01–20) | a projekt egésze |
| `/` (főoldal) | az enfilád **5 kerete a 13-ból** | 02, 04, 07, 14, 20 | **a nyitány 38%-a** |
| `/referenciak.html` | projektlista, borítókép | 01 | bélyegkép |
| `/alaprajz.html` | Hotel szárny, cella háttere | 01 | bélyegkép |
| `/#alaprajz` fedőréteg — beágyazva ide: `/`, `/flotta.html`, `/keszules.html` | ugyanaz a cella | 01 | bélyegkép |

**Külön kiemelve, mert a döntés súlyát ez adja:** a főoldal 13 keretéből
**öt** ebből a projektből van, és **ez a lap nyitánya** — az 1. és a 2. keret
is Domus Collis. **A látogató és a zsűri ezt látja először.**

### 2.2 Ahol csak **hivatkozás** van, kép nélkül

`/flotta.html`, `/keszules.html`, `/referenciak.html`, `/alaprajz.html`,
és kapcsolódó projektként: `/referenciak/bodajki-vadaszkastely/`,
`/referenciak/domus-pellegrini-hotel-apartmanok/`,
`/referenciak/duna-cruises-hableany/`, `/referenciak/garzon-plaza-hotel/`.

### 2.3 `sitemap.xml`

1 cím: `https://dunaenterior.hu/referenciak/hotel-domus-collis/`

### 2.4 Ahol **NINCS** — ellenőrizve

| Felület | Állapot |
|---|---|
| `og:image` (közösségi megosztókép) | **NEM Domus Collis.** `bodajki-vadaszkastely/02` — a `forras.json` `kozossegi` bejegyzése kifejezetten a tisztázatlan jog miatt zárta ki |
| A KÉSZÜLÉS (`/keszules.html`) sorozatai | nincs Domus Collis állomás |
| A FLOTTA (`/flotta.html`) vízvonal-index | nincs (nem hajó) |
| A METSZET (főoldal) | nincs |
| Az utolsó ajtó (főoldal zárása) | nincs — `szent-laszlo-…-fa-kapuja/01` |

> **Eltérés a korábbi dokumentációtól.** A
> [LAUNCH-CONTENT-REVIEW.md §7.1](LAUNCH-CONTENT-REVIEW.md) négy felületet
> sorol. A tényleges kimenet **hat**: kimaradt belőle a `/referenciak.html`
> borítókép és az, hogy az alaprajz fedőrétege a `/flotta.html`-en és a
> `/keszules.html`-en is viszi a bélyegképet. **Kép-súlyban a különbség
> elhanyagolható** (ugyanaz az egy bélyegkép), a leltár teljessége miatt
> mégis rögzítve.

---

## 3. A DÖNTÉSI TÁBLA

Jelöljön **egyet**.

```
[ ] 1. KEEP — JOG MEGSZEREZVE
[ ] 2. KEEP — JOG NÉLKÜL, VÁLLALT KOCKÁZATTAL
[ ] 3. REMOVE — A PROJEKT KIVÉTELE
[ ] 4. REPLACE — CSAK A FŐOLDALRÓL KIVÉVE
[ ] 5. WAIT FOR RIGHTS — ÉLESÍTÉS HALASZTVA
```

### 1. KEEP — írásos engedély a fényképésztől / a szállodától

| | |
|---|---|
| **Kódmunka** | **nincs** |
| **Adatmunka** | `forras.json` → `jogok: "rendezett"`, a `NEEDS_RIGHTS` lekerül |
| **A lapon látszik** | semmi nem változik |
| **Awwwards-kapu** | **KINYÍLIK** |
| **Kockázat** | nincs |

**Ez a kívánatos kimenet.** A nyitány érintetlen marad.

### 2. KEEP — élesítés engedély nélkül

| | |
|---|---|
| **Kódmunka** | **nincs** |
| **A lapon látszik** | semmi nem változik |
| **Awwwards-kapu** | technikailag kinyílik, **de a kockázat a beadással nő** — a beadás nyilvánosságot csinál |
| **Kockázat** | szerzői jogi igény a fényképész részéről. **A mai `noindex` ezt nem csökkenti érdemben** — a lap elérhető, csak nem indexelt |

**Üzleti döntés, nem műszaki.** A repó ezt nem hozhatja meg.

### 3. REMOVE — a projekt teljes kivétele

| | |
|---|---|
| **Adatmunka** | `projektek.json` → `allapot: "vazlat"` **ÉS** `terek.json` → a `$fooldal.keretek` 5 eleme és a `hotel-domus-collis` szint-1 tér kivétele |
| **Figyelmeztetés** | **ha csak a `projektek.json` változik, a build MEGÁLL** — a `terek.json` érvénytelen slugra hivatkozna |
| **A lapon látszik** | az enfilád **13 → 8 keret**. **A nyitány érezhetően szegényebb** (a mai 1. és 2. keret is ez). A Hotel szárny 3 → 2 projekt. Referencia 30 → 29, kép 371 → 351. A sitemap 39 → 38 |
| **Awwwards-kapu** | kinyílik, de **gyengébb lappal** |
| **Kockázat** | nincs jogi. Van tartalmi: a lap legerősebb hotelbelsője esik ki |

### 4. REPLACE — csak a főoldalról kivéve, a projektlap marad

| | |
|---|---|
| **Adatmunka** | csak `terek.json` → `$fooldal.keretek` 5 eleme más projektre cserélve vagy törölve |
| **A lapon látszik** | a nyitány más képekkel indul; a projektlap és a bejárható tér **változatlan** |
| **Awwwards-kapu** | **NEM nyílik ki** — a jog a projektlapon továbbra is rendezetlen |
| **Kockázat** | ugyanaz, mint a 2. pontnál, csak kevesebb felületen |

**Félmegoldás.** Csökkenti a láthatóságot, nem oldja a jogot.

### 5. WAIT FOR RIGHTS — élesítés halasztva, amíg az engedély megjön

| | |
|---|---|
| **Kódmunka** | **nincs** |
| **A lapon látszik** | semmi — a lap marad `noindex` alatt |
| **Awwwards-kapu** | zárva |
| **Kockázat** | nincs jogi. Van idői: a beadás csúszik |

---

## 4. AMIT A REPÓ NEM DÖNTHET EL

**Ha a jog nem rendeződik, a lap NEM adható be Awwwards-ra** — a zsűri által
látott nyitány öt kerete ebből a projektből van, és a beadás nyilvánosságot
csinál abból, ami ma `noindex` alatt áll.

A 8. fázis **nem tett hozzá** új Domus Collis felhasználást, és a projekt
címét nem változtatta.

---

*Kapcsolódó: [LAUNCH-CONTENT-REVIEW.md §7.1](LAUNCH-CONTENT-REVIEW.md) ·
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) ·
[AWWWARDS-READINESS.md](AWWWARDS-READINESS.md) ·
[OWNER-APPROVAL.md](OWNER-APPROVAL.md)*
