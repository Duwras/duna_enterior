# dunaenterior.hu

A **Duna Belsőépítészet Kft.** (Duna Enterior Asztalos és Hajóépítő Üzem, Győr)
weboldalának forrása. Statikus oldal, a közzététel GitHub Actionsből megy.

## Mi hol van

| Mappa / fájl | Mi ez |
|---|---|
| `data/projektek.json` | A referenciák — 30 projekt, 371 kép. Ezt szerkeszti az admin felület. |
| `data/palyazatok.json` | A négy GINOP pályázat kötelező adattartalma, szó szerint a régi oldalról. |
| `data/ceg-adatok.json` | Cégadatok egy helyen; innen kerülnek a `{{kulcs}}` helyekre minden oldalon. |
| `img/projektek/<slug>/` | A projektek képei. |
| `img/palyazat/` | Pályázati arculati képek, EU infoblokk, régi logók. |
| `img/brand/` | Logó és egyéb arculati elem. |
| `build.mjs` | A `deploy/` mappát állítja elő: aloldalak generálása, képméretek, cache-törés. |
| `worker/` | A kapcsolati űrlap végpontja (Cloudflare Worker): reCAPTCHA, Resend, üzenettár. |

## Közzététel

Nincs kézi feltöltés. Minden `main`-re küldött push után a GitHub lefuttatja a
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) munkafolyamatot,
ami buildel és élesít. Kb. 1–2 perc.

Helyi ellenőrzés:

```bash
npm run build
```

```bash
npm run elonezet
```

## Tartalommegőrzés

A régi WordPress oldal teljes szöveges tartalma és mind a 371 referenciakép át
lett emelve, a WP REST API-ból (`/wp-json/wp/v2/pages`) szó szerint. Ide tartozik
a **négy GINOP pályázat** kötelezően megjelenítendő adattartalma és az EU
infoblokk is — ezek a KTK 2020 szerint kötelező aloldalakon szerepelnek.

Két pont, ami eltér a réginek látszó állapottól, mindkettő tudatosan:

- **Székhely.** A régi oldal két címet közöl: az impresszum és az adatkezelési
  tájékoztató „Ikrényi út 2.”, a kapcsolat és a többi oldal „Ikrényi út 14.”.
  Megrendelői döntés alapján egyiket sem módosítottuk — mindkettő a saját
  eredeti helyén szerepel.
- **Hajóépítési referenciák.** A menüben a *Hajóépítés* a dunahajok.hu-ra vezet,
  de a régi `/hajoepites/` oldal 15 hajós projektje (194 kép) nem veszett el:
  a referenciák közt, `hajo` kategóriában megtalálható mind.
