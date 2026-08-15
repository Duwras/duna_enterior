# A weboldal szerveroldali végpontja

A weboldal statikus, tehát nincs hova elküldeni az űrlapot. Ez a Worker
veszi át azt, amihez szerver kell.

**A kapcsolati űrlap** (`/`):

1. ellenőrzi a reCAPTCHA jegyet a Google-nél
2. eltárolja az üzenetet (D1 adatbázis)
3. elküldi e-mailben (Resend)

A tárolás a küldés **előtt** történik: ha az e-mail elakad, az üzenet
akkor is megvan.

**Az adminfelület belépése** (`/gh-beallitas`, `/gh-vissza`) — lásd lent,
a *GitHub-belépés* fejezetet. Ez nem kötelező: nélküle az adminfelület a
kézzel beillesztett kulccsal működik.

Mindkét szolgáltatás ingyenes szintje bőven elég ehhez a forgalomhoz.

## Beállítás

Egyszer kell végigcsinálni. Kell hozzá egy Cloudflare-fiók.

### 1. Wrangler

```bash
npm install -g wrangler
```

```bash
wrangler login
```

### 2. Adatbázis

```bash
wrangler d1 create duna-uzenetek
```

A parancs kiír egy `database_id`-t. Írd be a `wrangler.toml`-ba a
`[KITÖLTENDŐ]` helyére, majd hozd létre a táblát:

```bash
wrangler d1 execute duna-uzenetek --remote --file=sema.sql
```

### 3. Titkok

A kulcsok **soha nem kerülnek a repóba** — a Cloudflare tárolja őket.

```bash
wrangler secret put RESEND_KULCS
```

```bash
wrangler secret put RECAPTCHA_SECRET
```

- **RESEND_KULCS** — [resend.com](https://resend.com) → API Keys. A
  `dunaenterior.hu` domaint igazolni kell a Resendben (SPF és DKIM
  rekord a DNS-be), különben a levél nem megy ki.
- **RECAPTCHA_SECRET** — [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
  → **reCAPTCHA v3**. A kulcsnál fel kell sorolni minden domaint, ahol az
  oldal fut: `dunaenterior.hu`, és amíg a domain nem áll át,
  `duna-enterior.pages.dev` is. Ami nincs a listán, arról a Google
  eldobja a jegyet, és az űrlap hibát ad. Két kulcsot kapsz: a *site key*
  a weboldalra megy (lásd lent), a *secret key* ide.

### 4. Telepítés

```bash
wrangler deploy
```

A parancs kiír egy címet, valami ilyet:
`https://duna-urlap.<felhasznalonev>.workers.dev`

### 5. A weboldal összekötése

A `data/ceg-adatok.json`-ban töltsd ki:

- `urlapVegpont` — a fenti workers.dev cím
- `recaptchaSiteKey` — a reCAPTCHA **site** kulcsa
- `gaId` — a Google Analytics 4 mérőazonosító (`G-…`)

Push a `main` ágra, és 2-4 perc múlva él.

Amíg ezek nincsenek kitöltve, az űrlap **nem tesz úgy, mintha elküldte
volna**: megmondja, hogy nincs beállítva, és felkínálja az e-mail címet.

## GitHub-belépés az adminfelülethez

Ez teszi feleslegessé, hogy a referenciák kezeléséhez kézzel készített
kulcsot kelljen beilleszteni. Utána a belépés: egy kattintás, és kész.
Az így kapott hozzáférés **nem jár le**.

Egyszer kell végigcsinálni, kb. öt perc.

### 1. GitHub-alkalmazás

[github.com/settings/developers](https://github.com/settings/developers)
→ **OAuth Apps** → **New OAuth App**

| Mező | Érték |
| --- | --- |
| Application name | `Duna Enterior admin` |
| Homepage URL | `https://dunaenterior.hu` |
| Authorization callback URL | `https://duna-urlap.dunaenterior.workers.dev/gh-vissza` |

A visszatérési címnek **karakterre pontosan** ennek kell lennie —
ez a Worker címe, `/gh-vissza` végződéssel. (Ha a Worker címe más, a
sajátodat írd be; a `wrangler deploy` mindig kiírja.)

Mentés után a lapon látszik a **Client ID**, és ott a
**Generate a new client secret** gomb. A titok csak egyszer látszik.

### 2. A két érték a Workerbe

```bash
wrangler secret put GH_CLIENT_ID
```

```bash
wrangler secret put GH_CLIENT_SECRET
```

### 3. Telepítés

```bash
wrangler deploy
```

Ennyi. Az adminfelületen megjelenik a **Belépés GitHub-fiókkal** gomb —
a Worker mondja meg neki, hogy már be van állítva. Ha valami hiányzik, a
gomb nem jelenik meg, és a kulcsmező változatlanul működik.

### Hogyan biztonságos ez?

- A `client_secret` a Cloudflare-nél marad, a weboldalra soha nem kerül.
- A kapott hozzáférés csak `public_repo` jogú: a privát repókhoz nem fér.
- A visszaküldés címét a Worker az `ENGEDETT` listához méri — idegen
  címre nem irányít át.
- A belépést egyszeri, sorsolt azonosító köti ahhoz az ablakhoz, amelyik
  indította; máshonnan érkező választ az adminfelület eldob.
- A hozzáférés a cím kettőskereszt utáni részében érkezik vissza, amit a
  böngésző nem küld el szervernek — az adminfelület azonnal törli is a
  címsorból.

Visszavonni a
[github.com/settings/applications](https://github.com/settings/applications)
lapon lehet, bármikor.

## Helyi próba

A `wrangler dev` alapból nem fogad küldést a `localhost`-ról, mert az
`ENGEDETT` lista csak az éles címeket tartalmazza. Próbához:

```bash
wrangler dev --var FEJLESZTES:1
```

Ezt a változót **élesben soha ne add meg**.

## Az üzenetek megnézése

```bash
wrangler d1 execute duna-uzenetek --remote --command "SELECT mikor, nev, telefon, telepules FROM uzenetek ORDER BY id DESC LIMIT 20"
```

## Ha a domain átáll

A Workerben az `ENGEDETT` lista tartalmazza, mely oldalakról fogadunk
küldést. A `dunaenterior.hu` és az ideiglenes `duna-enterior.pages.dev`
is benne van, tehát átálláskor küldeni nincs teendő — utána viszont a
`duna-enterior.pages.dev` sor törölhető a listából, majd `wrangler deploy`.
