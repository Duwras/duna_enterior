# dunaenterior.hu

A **Duna Belsőépítészet Kft.** (Duna Enterior Asztalos és Hajóépítő Üzem, Győr)
weboldalának forrása. Statikus oldal, a közzététel GitHub Actionsből megy.

**Élő cím:** <https://duwras.github.io/duna_enterior/>

> A cím jelenleg átirányít a `ertekpontpenzugyek.hu/duna_enterior/` alá, mert a
> `Duwras.github.io` felhasználói Pages-oldalhoz az a saját domain van kötve, és
> a projektoldalak ezt öröklik. Az oldal tartalmilag rendben van, csak a
> címsorban látszik idegen domain. Amint a `dunaenterior.hu` a GitHubra mutat és
> a `sajatDomainEl` átvált `true`-ra, ez megszűnik.

## Mi hol van

| Mappa / fájl | Mi ez |
|---|---|
| `data/projektek.json` | A referenciák — 30 projekt, 371 kép. Ezt szerkeszti az admin felület. |
| `data/palyazatok.json` | A négy GINOP pályázat kötelező adattartalma, szó szerint a régi oldalról. |
| `data/ceg-adatok.json` | Cégadatok egy helyen; innen kerülnek a `{{kulcs}}` helyekre minden oldalra. |
| `partials/` | Fejléc, lábléc és a projekt-aloldal sablonja. Nem publikus, a build dolgozza fel. |
| `img/projektek/<slug>/` | A projektek képei, 1800 px forrásméretben. |
| `img/palyazat/`, `img/brand/` | Pályázati arculati képek, EU infoblokk, logók. |
| `build.mjs` | A `deploy/` mappát állítja elő: aloldalak, képméretek, cache-törés. |
| `worker/` | A kapcsolati űrlap végpontja (Cloudflare Worker) — lásd [worker/OLVASSEL.md](worker/OLVASSEL.md). |

## Közzététel

Nincs kézi feltöltés. Minden `main`-re küldött push után a GitHub lefuttatja a
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) munkafolyamatot,
ami buildel és élesít. Kb. **2-4 perc** (a 371 képből képenként két webes méret
készül).

Helyi ellenőrzés:

```bash
npm run build
```

```bash
npm run elonezet
```

## Referenciák szerkesztése

Az admin felület a `/admin.html` címen érhető el. Nincs saját jelszókezelés: a
belépés egy GitHub **fine-grained personal access token**tel megy, amit a
GitHub ellenőriz. A kulcs a böngészőben marad, a repóba soha nem kerül be.

Kulcs készítése egyszer:

1. GitHub → *Settings* → *Developer settings* → *Personal access tokens* →
   *Fine-grained tokens* → **Generate new token**
2. *Repository access*: **Only select repositories** → `duna_enterior`
3. *Permissions* → *Repository permissions* → **Contents: Read and write**
4. Lejárat: amennyit jónak látsz. Lejárat után újat kell készíteni.

A felület tud: új projekt, szerkesztés, leírás és link, korlátlan képfeltöltés,
sorrend húzással, borítókép kijelölése, vázlat/publikált állapot, törlés.
Minden mentés egy commit, ami elindítja a közzétételt.

## Ami még beállításra vár

A `data/ceg-adatok.json`-ban három mező `[KITÖLTENDŐ]`. Amíg üresek, az oldal
működik, csak ezek a funkciók nem élnek — és az űrlap **megmondja**, hogy nincs
beállítva, nem tesz úgy, mintha elküldte volna az üzenetet.

| Mező | Honnan |
|---|---|
| `gaId` | Google Analytics 4 mérőazonosító (`G-…`) |
| `recaptchaSiteKey` | [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) → reCAPTCHA **v3** |
| `urlapVegpont` | A telepített Cloudflare Worker címe — [worker/OLVASSEL.md](worker/OLVASSEL.md) |

## Domainváltás

Amikor a `dunaenterior.hu` DNS-e a GitHubra mutat:

| Típus | Név | Érték |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `duwras.github.io.` |

Utána a `data/ceg-adatok.json`-ban `"sajatDomainEl": true`, push — a build
kiírja a CNAME fájlt. Végül a repó *Settings* → *Pages* → *Custom domain* alatt
`dunaenterior.hu`, és **Enforce HTTPS**.

## Tartalommegőrzés

A régi WordPress oldal teljes szöveges tartalma és mind a 371 referenciakép át
lett emelve, a WP REST API-ból (`/wp-json/wp/v2/pages`) szó szerint. Ide tartozik
a **négy GINOP pályázat** kötelezően megjelenítendő adattartalma és az EU
infoblokk is — ezek a KTK 2020 szerint kötelező aloldalakon szerepelnek.

Két pont, ami eltér a réginek látszó állapottól, mindkettő tudatosan:

- **Székhely.** A régi oldal két címet közöl: az impresszum és az adatkezelési
  tájékoztató „Ikrényi út 2.", a kapcsolat és a többi oldal „Ikrényi út 14.".
  Megrendelői döntés alapján egyiket sem módosítottuk — mindkettő a saját
  eredeti helyén szerepel.
- **Hajóépítési referenciák.** A menüben a *Hajóépítés* a dunahajok.hu-ra vezet,
  de a régi `/hajoepites/` oldal 15 hajós projektje (194 kép) nem veszett el:
  a referenciák közt, `hajo` kategóriában megtalálható mind.
