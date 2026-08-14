# A kapcsolati űrlap végpontja

A weboldal statikus, tehát nincs hova elküldeni az űrlapot. Ez a Worker
veszi át azt a három dolgot, amihez szerver kell:

1. ellenőrzi a reCAPTCHA jegyet a Google-nél
2. eltárolja az üzenetet (D1 adatbázis)
3. elküldi e-mailben (Resend)

A tárolás a küldés **előtt** történik: ha az e-mail elakad, az üzenet
akkor is megvan.

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

## Az üzenetek megnézése

```bash
wrangler d1 execute duna-uzenetek --remote --command "SELECT mikor, nev, telefon, telepules FROM uzenetek ORDER BY id DESC LIMIT 20"
```

## Ha a domain átáll

A Workerben az `ENGEDETT` lista tartalmazza, mely oldalakról fogadunk
küldést. A `dunaenterior.hu` és az ideiglenes `duna-enterior.pages.dev`
is benne van, tehát átálláskor küldeni nincs teendő — utána viszont a
`duna-enterior.pages.dev` sor törölhető a listából, majd `wrangler deploy`.
