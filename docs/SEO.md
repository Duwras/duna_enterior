# Keresőoptimalizálás

Két dologra célzunk: **Győrre** és arra, amit a cég ténylegesen csinál —
egyedi bútor, épületasztalos munka, létesítményberendezés, belsőépítészet,
hajóépítés és hajófelújítás. Minden más ennek van alárendelve.

Egy szabály végig érvényes, és ez az egyetlen, amit nem szabad megsérteni:
**a jelölés nem mondhat többet, mint a lap.** Ezért nincs nyitvatartás (nem
tudjuk), nincs értékelés (nincs a lapon), és nincs Product/ár (egyedi
gyártás, ár sehol nem szerepel). Amit a JSON-LD állít, annak a szedésben is
ott a fedezete.

## Mi hol dől el

| Réteg | Hol | Mit csinál |
|---|---|---|
| Cím és leírás | a lapok `<head>`-je | a találati listában ez látszik |
| Projektlapok címe/leírása | `build.mjs` → `projektCim()`, `projektLeiras()` | a projekt saját nevéből és szövegéből |
| Kanonikus cím, Open Graph | `build.mjs` 6/a | minden lapra, a lap saját címéből |
| JSON-LD | `build.mjs` 6/a6 | cég, weboldal, lap, morzsa, galéria, GYIK |
| Sitemap + képsitemap | `build.mjs` 7 | a noindex lapok magától kimaradnak |
| Ellenőrzés | `scripts/ellenorzes.mjs` | cím/leírás hossza, canonical, OG, JSON-LD |

## A címek

A találati listában ~60 karakter fér ki, ezért a `<title>` a
**szolgáltatással és a várossal kezdődik**, a márka a végén áll:

```
Egyedi bútor és belsőépítészet Győrben — Duna Enterior
Rólunk — asztalos és hajóépítő üzem Győrben, 1991 óta
Kapcsolat — Duna Enterior, 9025 Győr, Ikrényi út 14.
```

A harminc projektlap címe nem fix sablon: a `projektCim()` fokozatokban
próbálkozik, és a leghosszabb változat megy ki, ami 65 karakter alatt marad
— különben a hosszú nevek (`Szent László Látogatóközpont fa kapuja`)
levágódnának. A leírásuk a `projektek.json` saját szövegéből készül, szón
vágva: harminc egyforma mondat helyett harminc különböző.

## A gépi olvasat (JSON-LD)

Laponként egy `@graph`, `@id`-vel összekötve:

- **Organization + HomeAndConstructionBusiness** — név, cím, koordináta,
  telefon, e-mail, adószám, alapítás, ellátott terület. A teljes változat
  (szolgáltatáskatalógus + a négy megszólítható ember) csak a főoldalon, a
  Rólunkon és a kapcsolaton megy ki; máshol elég az `@id`.
- **WebSite**, **WebPage** (a lap fajtája szerint `AboutPage`,
  `ContactPage`, `CollectionPage`, `ImageGallery`)
- **BreadcrumbList** — a projektlapokon ugyanaz az út, ami a morzsában látszik
- **ImageObject** — a projektgalériákból, a `projektek.json` alt szövegével
- **CreativeWork** — maga a munka, `creator`-ként a céggel
- **FAQPage** — a Rólunk lap GYIK szakaszából

A szolgáltatáslista és a GYIK **nincs kétszer leírva**: a build a
`rolunk.html` látható szedéséből olvassa ki (`id="szolgaltatasok"`,
`id="kerdesek"`). Ha ott változik a szöveg, a jelölés is változik — és ha a
szakasz szerkezete elmozdul, a build megáll, nem pedig némán elhagyja.

## A cím kérdése

A régi oldal két címet közöl: székhely `Ikrényi út 2.`, telephely
`Ikrényi út 14.` (lásd `data/ceg-adatok.json`). A gépi adatba a
**telephely** megy — oda jön a látogató, azt hozza a kapcsolat lap és a
lábléc, és a helyi találatban ennek kell egyeznie a térképes adattal.

## Ami még hátravan — ez nem kódkérdés

1. **`sajatDomainEl: true`.** Amíg false, az egész oldal `noindex`. Enélkül
   minden más itt leírt munka a fióknak szól. Lásd a README domainváltás
   szakaszát.
2. **Google Cégprofil (Business Profile).** A helyi találat legnagyobb
   egyetlen tényezője, és nem a weboldalon dől el. Ugyanaz a név, cím és
   telefonszám kell bele, mint amit a lábléc mond — betűre.
3. **Nyitvatartás.** Ha megvan, felvehető a `ceg-adatok.json`-ba, és a
   jelölés `openingHoursSpecification`-je kiegészíthető. Addig szándékosan
   hiányzik.
4. **`sameAs`.** Ma egyetlen cím áll benne, a dunahajok.hu. Ha van Facebook-
   vagy LinkedIn-oldal, oda való.
5. **Search Console.** A sitemap beadása és az indexelés figyelése.
