# dunaenterior.hu

A **Duna Belsőépítészet Kft.** (Duna Enterior Asztalos és Hajóépítő Üzem, Győr)
weboldalának forrása. Statikus oldal, a közzététel GitHub Actionsből megy.

**Élő cím:** <https://duna-enterior.pages.dev/>

> Ez a bemutató cím a `dunaenterior.hu` élesítéséig. Kereső nem indexeli: amíg
> a `sajatDomainEl` `false`, a build kiír egy `_headers` fájlt
> `X-Robots-Tag: noindex, nofollow` fejléccel, így az ideiglenes cím nem lesz
> duplikált tartalom az éles domain mellett.
>
> Korábban GitHub Pages-en volt. Azért került át: a `Duwras.github.io`
> felhasználói Pages-oldalhoz az `ertekpontpenzugyek.hu` saját domain van
> kötve, a projektoldalak ezt öröklik, és a `duwras.github.io/duna_enterior/`
> 301-gyel oda irányított — az ügyfél oldala idegen domain alatt látszott.
> A repó Pages-oldala azóta le van kapcsolva.

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
ami buildel és feltölti a Cloudflare Pages `duna-enterior` projektbe. Kb.
**2-4 perc** (a 371 képből képenként két webes méret készül).

Ehhez két titok kell a repóban (*Settings* → *Secrets and variables* →
*Actions* → *New repository secret*):

| Titok | Érték |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `2c4bd69d5d235682acc4d491599182fe` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare → *My Profile* → *API Tokens* → *Create Token* → **Edit Cloudflare Workers** sablon (a Pages-hez is ez kell), vagy egyedi token *Account* → *Cloudflare Pages: Edit* jogosultsággal |

Amíg a token nincs beállítva, a munkafolyamat pirosra vált — ez szándékos, egy
némán elmaradó közzététel rosszabb lenne. Addig kézzel is élesíthető:

```bash
npm run kozzetetel
```

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

1. Cloudflare → *Workers & Pages* → `duna-enterior` → *Custom domains* → **Set
   up a domain**: `dunaenterior.hu`, majd ugyanígy `www.dunaenterior.hu`.
2. DNS. Ha a domain a Cloudflare-en van, a fenti lépés magától felveszi a
   rekordot. Ha máshol, ezt kell felvenni a szolgáltatónál:

   | Típus | Név | Érték |
   |---|---|---|
   | CNAME | `@` (vagy `dunaenterior.hu`) | `duna-enterior.pages.dev` |
   | CNAME | `www` | `duna-enterior.pages.dev` |

   A tanúsítványt a Cloudflare adja, kézzel nincs teendő.
3. `data/ceg-adatok.json`-ban `"sajatDomainEl": true`, push. Ettől marad el a
   `_headers` noindex fejléce, tehát innentől indexelhet a kereső.
4. `worker/src/index.js` — az `ENGEDETT` listából a `duna-enterior.pages.dev`
   sor törlendő, utána `npx wrangler deploy` a `worker/` mappában.

## A régi GitHub Pages cím

Megszűnt. A repó Pages-oldala le lett kapcsolva, így az
`ertekpontpenzugyek.hu/duna_enterior/` és a `duwras.github.io/duna_enterior/`
is 404 — az `ertekpontpenzugyek.hu` alatt csak a saját oldal marad. Ha valaha
mégis kellene, a repó *Settings* → *Pages* alatt visszakapcsolható, de a
munkafolyamat már nem oda tölt fel.

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
