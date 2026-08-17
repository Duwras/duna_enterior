# DUNA — PHASE 0 AUDIT

**Date:** 2026-08-15
**Scope:** Ground-truth audit only. No redesign, no new libraries, no asset changes.
**Repo:** `C:\Users\timar\Documents\Claude\duna_enterior` (branch `main`, HEAD `175aad3`)
**Live site inspected:** https://duna-enterior.pages.dev/

Method note: every claim below is backed by a file read, a script run over the actual
assets, or a live-DOM/network measurement. Where something could not be determined it is
marked **UNKNOWN**; where an asset does not exist it is marked **NOT FOUND**.

---

## 1. Executive Summary

The current site is **not a framework app**. It is a hand-written static site: plain HTML
files with `<!--PLACEHOLDER-->` slots, one 986-line CSS file, one 21 KB vanilla-JS motion
layer, and a 400-line Node build script (`build.mjs`) that stitches partials, generates the
30 project sub-pages from `data/projektek.json`, resizes every image with `sharp`, and
content-hashes the CSS/JS URLs. Deployment is GitHub Actions → Cloudflare Pages. One
Cloudflare Worker (`worker/`) backs the contact form (D1 + Resend + reCAPTCHA v3) and the
GitHub OAuth handshake for the browser-based admin.

The codebase is **unusually disciplined for a hand-rolled static site** — the build fails
loudly on a missing image or an unsubstituted `{{key}}`, motion is a strictly optional
second layer, `prefers-reduced-motion` is honoured everywhere, and every visible number
(30 projects, 371 photos) is computed from data rather than typed. It is a good foundation
to *inherit content and data conventions from*, and a poor foundation to *build WebGL on*:
there is no bundler, no module system (every script is an IIFE loaded with a bare
`<script src>`), no TypeScript, no test harness, no linter.

The three findings that most constrain THE LIVING INTERIOR:

1. **Every project description is empty.** All 30 projects have `"leiras": ""`. The
   "A projektről" section renders as an empty block on all 30 live project pages
   (verified in the live DOM). There is no per-project story, location, date, client,
   material or scope text anywhere in the repo.
2. **Per-image metadata is effectively absent.** All 371 images have an `alt`, but 82 are
   machine junk — Hotel Domus Collis's 20 alts are Facebook CDN filenames
   (`332721968_1578885315912501_...`), Duna Cruises's 22 are the identical string
   "Duna Cruises HABLEÁNY", Bodajki's are `galeria_kep_21`. Nothing records *which room*,
   *which viewpoint*, or *wide vs. detail*. Any spatial assembly must start with a manual
   or AI-assisted tagging pass.
3. **Resolution ceiling ≈ 2 MP.** The repository's "originals" are already web-derived:
   the largest project image is 1800×1350 / 1536×2048; project average is 0.54–2.88 MP.
   True camera originals are **NOT FOUND** in the repo. Full-bleed 4K immersive treatment
   will hit visible softness on most projects without re-sourcing the masters.

Strongest immersive candidate on the actual pixels: **Duna Cruises HABLEÁNY** (a single
continuous wooden deck salon shot from ~15 viewpoints, day and night, with the Danube and
Budapest through the glass). Runner-up: **Hotel Domus Collis** (20 professional
architectural interiors with real doorway/threshold enfilades). Third: **Bodajki
Vadászkastély** (dramatic museum-exhibition rooms).

---

## 2. Current Technology Stack

| Layer | What is actually there |
|---|---|
| Framework | **None.** Hand-written HTML5. No React/Vue/Svelte/Astro/Next. |
| Language | ES5-flavoured vanilla JS in IIFEs (`var`, `function`), except `build.mjs` which is modern ESM. No TypeScript. |
| Package manager | npm (`package-lock.json`, lockfileVersion present) |
| Build system | `node build.mjs` — a single custom script. No bundler, no Vite/webpack/rollup/esbuild. |
| Dependencies | **One:** `sharp@^0.34.4` (devDependency). Zero runtime dependencies. |
| Routing | Filesystem. `*.html` at root + generated `deploy/referenciak/<slug>/index.html`. Cloudflare Pages serves `/referenciak` extensionless (verified live). |
| Component architecture | Three HTML partials (`partials/fejlec.html`, `lablec.html`, `projekt-sablon.html`) injected by string replacement on HTML comment markers. |
| Styling | One `style.css` (38 KB, 986 lines) + `admin.css` + `fonts.css`. Custom properties on `:root`. No Tailwind, no preprocessor, no CSS modules. |
| Animation | Hand-written `script.js` (21 KB). No GSAP, no Framer Motion, no Lenis. |
| 3D / WebGL | **None.** No Three.js, no WebGL, no canvas, no shaders anywhere in the repo. |
| Image handling | Build-time `sharp` → two derivatives per source (`-800`, `-1400`), mozjpeg q78, progressive. `loading="lazy"`/`eager`, `decoding="async"`. No `<picture>`, no `srcset`, no WebP/AVIF output. |
| Fonts | Self-hosted woff2, 10 files, subset by `unicode-range`. Cormorant Garamond 300/300i/400, Archivo 400/500. `font-display: swap`. No CDN. |
| CMS / data | Three JSON files in `data/`: `projektek.json` (42 KB, 30 projects), `ceg-adatok.json`, `palyazatok.json`. Edited via `admin.html` which commits straight to GitHub via the GitHub API. |
| API integrations | Cloudflare Worker `duna-urlap` (form → D1 → Resend), Google reCAPTCHA v3, Google Analytics (consent-gated), OpenStreetMap embed iframe, GitHub API (admin). |
| Deployment | `.github/workflows/deploy.yml` → `cloudflare/wrangler-action@v3` → `pages deploy deploy --project-name duna-enterior` |
| Env vars / secrets | Worker secrets `RESEND_KULCS`, `RECAPTCHA_SECRET` (set via `wrangler secret put`, never in repo). Repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Public reCAPTCHA site key lives in `data/ceg-adatok.json` (correct — it is public). |
| Cloudflare config | `worker/wrangler.toml`: D1 binding `DB` → `duna-uzenetek` (`b6b530f4-…`), vars `CIMZETT`, `FELADO`, `workers_dev = true`, `preview_urls = false`. Build emits `_headers` with `X-Robots-Tag: noindex, nofollow` while `sajatDomainEl` is `false`. |
| Scripts | `build`, `kozzetetel` (build + wrangler deploy), `elonezet` (http-server on :4190), `kepek` (`scripts/kepek-tomorit.mjs`) |
| Linting | **NOT FOUND** — no ESLint/Biome/Prettier config, no `lint` script. |
| Formatting | **NOT FOUND** |
| Testing | **NOT FOUND** — no test runner, no test files, no CI test step. |
| Build validation | Present and good: build hard-fails on (a) an image listed in JSON that does not exist on disk, (b) a `kiemelt` cover not present in `kepek`, (c) any `{{key}}` left unsubstituted in output HTML *or* JS. |

Build verified working during this audit:
`Kész: 41 oldal, 30 projekt, 371 kép (742 webes változat), domain dunaenterior.hu.`

---

## 3. Repository Architecture

```
/
├── index.html  rolunk.html  referenciak.html  design-manufaktura.html
├── kapcsolat.html  palyazatok.html  admin.html  404.html
├── impresszum.html  adatkezelesi-tajekoztato.html  sutik.html
├── style.css (38 KB)  admin.css  fonts.css
├── script.js (21 KB)  admin.js (37 KB)  consent.js  szuro.js  galeria.js  urlap.js
├── build.mjs (15 KB)          ← the whole build
├── partials/                  ← NOT published (deliberately excluded from ASSETS)
│   ├── fejlec.html            ← header + nav, one source of truth
│   ├── lablec.html            ← footer, EU grant block, admin login link
│   └── projekt-sablon.html    ← the project detail page template
├── data/
│   ├── projektek.json         ← 30 projects, 371 image records
│   ├── ceg-adatok.json        ← company facts, contacts, keys, domain flags
│   └── palyazatok.json        ← EU grant disclosures (legally mandatory content)
├── img/
│   ├── projektek/<slug>/NN.jpg   ← 371 source images, 30 folders
│   ├── brand/                    ← 8 files (logos, favicon, EU infoblock, slider-2.png)
│   └── palyazat/                 ← 3 grant boards
├── fonts/                     ← 10 woff2
├── worker/
│   ├── src/index.js (13 KB)   ← form endpoint + GitHub OAuth callback
│   ├── wrangler.toml  sema.sql  OLVASSEL.md
├── scripts/kepek-tomorit.mjs  ← NOT published
├── mockup/hero-iranyok.html   ← 1.3 MB, three hero directions, historical
├── .github/workflows/deploy.yml
└── deploy/                    ← build output, gitignored, 131 MB
```

**Where things are implemented:**

| Concern | Location |
|---|---|
| Homepage | [index.html](../index.html) — hero, "Tevékenység" trio, marquee, horizontal process rail, 6 featured projects, dark Manufaktúra CTA |
| References index | [referenciak.html](../referenciak.html) + `<!--SZURO-->` / `<!--PROJEKTEK-->` filled by `build.mjs:140,301` |
| Project detail pages | [partials/projekt-sablon.html](../partials/projekt-sablon.html), generated in `build.mjs:217-243` |
| Project data | [data/projektek.json](../data/projektek.json) |
| Image references | Only in `data/projektek.json` (galleries) + 4 hard-coded `<img src>` in `index.html:42-44` and `design-manufaktura.html` |
| Global styles | [style.css](../style.css), tokens at `:root` |
| Navigation | [partials/fejlec.html](../partials/fejlec.html); active state via `<!--FEJLEC:key-->` → `aria-current="page"` (`build.mjs:206`) |
| Animations | [script.js](../script.js) — sections 0–9, all optional |
| Responsive | `style.css` media queries at 900px, 860px, 600px, plus `min-width: 901px` and `prefers-reduced-motion` |

---

## 4. Existing Routes

Verified live and/or in build output. `deploy/` contains **41 HTML pages**.

| Route | Source | Notes |
|---|---|---|
| `/` | `index.html` | Homepage |
| `/rolunk` | `rolunk.html` | About + services + MD's letter |
| `/referenciak` | `referenciak.html` | 30-card grid + multi-select category filter (verified live) |
| `/referenciak/<slug>/` × 30 | generated | Cover, empty description block, gallery, lightbox, 0–3 related |
| `/design-manufaktura` | `design-manufaktura.html` | Sub-brand page, pulls 3 `egyedi` projects |
| `/kapcsolat` | `kapcsolat.html` | Contact cards + form + OSM iframe |
| `/palyazatok` | `palyazatok.html` | EU grant disclosures (mandatory) |
| `/impresszum` | `impresszum.html` | |
| `/adatkezelesi-tajekoztato` | | GDPR notice |
| `/sutik` | `sutik.html` | Cookie policy |
| `/admin` | `admin.html` | Reference manager; writes to GitHub via API; linked from footer as "Belépés" |
| `/404` | `404.html` | `noindex` |
| `/sitemap.xml`, `/robots.txt`, `/_headers`, `/.nojekyll` | generated | `_headers` currently emits site-wide `noindex` because `sajatDomainEl: false` |

**External:** header and footer both link out to `https://dunahajok.hu/` ("Hajóépítés ↗"). That
is a separate property and a real content/brand split worth resolving in Phase 1.

**Route fragility to note:** project cards use the relative href `referenciak/<slug>/`.
From the extensionless URL `/referenciak` this resolves correctly to
`/referenciak/<slug>/` (verified live). If Cloudflare ever served `/referenciak/` with a
trailing slash, every card link would break to `/referenciak/referenciak/<slug>/`.

---

## 5. Existing Components

There is no component system. The reusable units are:

**Build-time HTML fragments**
- `fejlec` — skip link, sticky header, logo, `Menü` toggle, 6-item nav
- `lablec` — 4-column footer, EU ERFA info block + grant list, legal nav, admin link
- `projekt-sablon` — the entire project page shell
- `kartya(p, i)` (`build.mjs:129`) — the project card; `--k: i%6` staggers the reveal
- `szuroGombok()` — filter buttons, only for categories that actually contain work
- `kiemeltek()` — 6 homepage picks, one per category, to avoid a single-discipline hero row

**CSS-level components** (from `style.css`): `.hero`, `.szekcio` (+ `.halvany`, `.sotet`),
`.belul` (max-width container), `.racs` (card grid), `.kartya` / `.keret` / `.alatt`,
`.harom` (3-up), `.ketto` (2-up), `.lista-racs`, `.szalag` (marquee), `.vizszintes` (pinned
horizontal rail), `.galeria`, `.nagyito` (`<dialog>` lightbox), `.szuro`, `.gomb`,
`.link-nyil`, `.felcim` (eyebrow), `.eloszo` (lede), `.idezet`, `.palyazat`, `.urlap-doboz`,
`.szemely-kartya`, `.morzsa`.

**Behaviour modules** (each a standalone IIFE): `script.js` (shared motion),
`szuro.js` (category filter, state in `location.hash`), `galeria.js` (lightbox),
`urlap.js` (contact form), `consent.js` (cookie banner + GA gating), `admin.js` (CMS).

---

## 6. Existing Design System

**Colour** (`style.css :root`) — a warm paper-and-oak palette, no dark mode:

| Token | Value | Role |
|---|---|---|
| `--paper` | `#fbf8f3` | page background |
| `--paper-2` | `#f4efe6` | alternating section |
| `--ink` | `#1a150f` | headings, dark surfaces |
| `--ink-2` | `#4c4238` | body copy |
| `--smoke` | `#857a6c` | secondary, eyebrows |
| `--line` | `#ded3c3` | hairlines, background grid |
| `--brass` | `#7e5f35` | accent on dark |
| `--oak` | `#c2884a` | accent on light |

**Type**
- `--display`: Cormorant Garamond (300 Light, 400, 300 italic) — large, high-contrast serif; italic used for the emphasised final line of headlines ("*több száz tér.*")
- `--sans`: Archivo 400/500 — body, UI, eyebrows (uppercase, wide letter-spacing)
- `--mono`: Consolas / SF Mono — present as a token
- H1 measured live: 40 px @375 px viewport; fluid above

**Rhythm**
- `--gut`: `clamp(20px, 4.6vw, 76px)` — page gutter
- `--blokk`: `clamp(56px, 9vh, 118px)` — vertical section rhythm
- `--max`: `1360px`

**Ornament:** a faint vertical rule grid behind the hero (visible in the screenshot),
hairline dividers, `◆` separators in the marquee, `→`/`↗` arrow glyphs.

There is **no** dark mode, no spacing scale beyond the two clamps, no documented type
scale, no icon set (arrows are text glyphs), and no SVG assets of any kind.

---

## 7. Existing Interactions

All of `script.js`, organised as two engines plus nine optional features. Design principle
stated in its header comment: layer one is function (menu, header, year), layer two is
motion and is *pure decoration* — if any part fails the page is still complete.

**Engines**
- Scroll dispatcher: one passive `scroll` listener, rAF-throttled, all subscribers read
  position once per frame (`script.js:31-44`)
- Frame engine: sleeps when no member requests work; `dt` clamped to 3 frames so a
  backgrounded tab does not jump on return (`script.js:51-79`)
- Scroll impulse: computed from time since last scroll (`0.86^frames` decay) rather than
  damped in the loop, so every consumer reads the same value (`script.js:87-100`)
- Resize: debounced 160 ms, single shared handler

**Features**
1. Mobile menu — `aria-expanded`, closes on link click
2. Header state on scroll
3. **Word-split heading reveals** — headings are split into words so each rotates in
   individually; `.jon` / `.bal` / `.jobb` / `.kesik-N` classes drive stagger
4. `IntersectionObserver` reveal for `.jon` elements; falls back to "everything visible"
   when reduced-motion is set or IO is missing
5. **Parallax** via `data-parallax="0.14"` (hero strip) and `-0.05` with `--pnag: 1.12`
   (project covers scale up so the drift never exposes an edge)
6. Count-up on hero stats (`data-szam`)
7. **Pinned horizontal rail** — the process section grows tall, pins, and translates the
   `.vonat` horizontally; base class `.kezi` keeps it a native swipe-scroller with no JS and
   on mobile (verified live: still `vizszintes kezi` at 375 px)
8. Auto-drifting marquee, nudged by scroll impulse; duplicated copies get `aria-hidden`
9. Pointer-tracked tilt/hover on cards (`hover: hover and pointer: fine` only)
10. Footer reveal — content slides over the footer, which is exposed at the page bottom
11. **Cross-page fade transition** — outgoing page fades, incoming fades in; `pageshow`
    handles bfcache
12. Lightbox (`<dialog>`, arrow keys, backdrop click, `showModal()` for focus trapping)

Everything above is disabled when `prefers-reduced-motion: reduce` is set.

**Accessibility already present:** skip link, `aria-current` on the active nav item,
`aria-pressed` on filter buttons, `aria-live` on the filter status and form status, labelled
`<dialog>` controls, `aria-hidden` on decorative glyphs, honest `alt` attributes on every
image (even where the text itself is poor), honeypot field marked `aria-hidden`.

---

## 8. Reference Portfolio Inventory

**30 projects, 371 images, 57.8 MB of source JPEG.** All 30 have `allapot: "publikalt"`;
there are no drafts. Category counts as rendered by the live filter bar:
Hotel 3 · Étterem 1 · Lakóingatlan 4 · Kastély 2 · Szakrális 2 · Egyedi 3 · **Hajó 15**.

Boats are half the portfolio. That is a real brand fact, not an accident of sampling.

Metadata available per project: `slug`, `cim`, `kategoria`, `link`, `leiras`, `kiemelt`,
`allapot`, `kepek[{file, alt}]`. **There is no location field, no year, no client, no
materials, no scope, no credits, no photographer.**

| # | Project | Cat. | Imgs | MB | avg MP | max px | Aspect mix | Link | Descr. |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Garzon Pláza Hotel | hotel | 20 | 3.5 | 1.93 | 1350×1800 | 11 portrait / 9 landscape | ✓ | ∅ |
| 2 | Öttevényi kastély | kastely | 8 | 1.7 | 1.57 | 1448×1086 | 7 L / 1 P | ✓ | ∅ |
| 3 | Vatikáni díszdoboz | egyedi | 5 | 1.1 | 2.41 | 1372×1800 | 4 P / 1 L | – | ∅ |
| 4 | Mercedes plató | egyedi | 10 | 3.0 | 1.91 | 1600×1067 | 8 L / 2 P | – | ∅ |
| 5 | Szent László Látogatóközpont fa kapuja | szakralis | 8 | 2.4 | 2.88 | 1536×2048 | 8 P | – | ∅ |
| 6 | Hotel Domus Collis | hotel | 20 | 2.8 | 1.64 | 1800×1350 | 20 L | – | ∅ |
| 7 | Bodajki Vadászkastély | kastely | 10 | 2.5 | 2.16 | 1800×1200 | 10 L | – | ∅ |
| 8 | Zirci Apátság | szakralis | 10 | 0.6 | 0.64 | 800×800 | 10 square | – | ∅ |
| 9 | Kristály Étterem | etterem | 10 | 1.4 | 1.14 | 1422×800 | 10 L | – | ∅ |
| 10 | Domus Pellegrini Hotel – Apartmanok | hotel | 5 | 0.4 | 0.96 | 1200×800 | 5 L | – | ∅ |
| 11 | Fúzió a tájjal | lakoingatlan | 20 | 1.9 | 0.69 | 1317×800 | 13 L / 7 P | – | ∅ |
| 12 | Családi ház | lakoingatlan | 14 | 1.7 | 1.14 | 1422×800 | 14 L | – | ∅ |
| 13 | Budai ház | lakoingatlan | 12 | 1.8 | 1.14 | 1422×800 | 12 L | – | ∅ |
| 14 | Belvárosban – nyugalomban | lakoingatlan | 15 | 1.1 | 0.71 | 1241×800 | 8 L / 7 P | – | ∅ |
| 15 | Fafaragások | egyedi | 10 | 2.5 | 1.57 | 1445×1088 | 8 L / 2 P | – | ∅ |
| 16 | **Duna Cruises HABLEÁNY** | hajo | 23 | 7.4 | 1.86 | 1350×1800 | 16 L / 7 P | ✓ | ∅ |
| 17 | Duna Hajók 6.1 KADÉT | hajo | 11 | 3.9 | 2.23 | 1600×1600 | 8 L / 3 sq | ✓ | ∅ |
| 18 | Duna Hajók 6.1 Cabin | hajo | 26 | 6.2 | 2.04 | 1800×1350 | 26 L | ✓ | ∅ |
| 19 | Bojan – Harcos | hajo | 3 | 0.4 | 0.73 | 1066×800 | 2 L / 1 P | – | ∅ |
| 20 | Boesch 640 De Luxe | hajo | 19 | 1.5 | 0.69 | 1067×800 | 17 L / 2 P | – | ∅ |
| 21 | Boesch 580 | hajo | 18 | 1.4 | 0.66 | 1024×768 | 18 L | – | ∅ |
| 22 | Jolle 25 | hajo | 10 | 1.4 | 0.72 | 1067×800 | 9 L / 1 P | – | ∅ |
| 23 | Arcangeli Super Jolly | hajo | 13 | 1.1 | 0.70 | 1067×800 | 12 L / 1 P | – | ∅ |
| 24 | Boesch 560 De Luxe | hajo | 17 | 1.4 | 0.54 | 1067×800 | 16 L / 1 P | – | ∅ |
| 25 | Rivális vitorlás hajó | hajo | 8 | 0.7 | 0.60 | 1036×751 | 5 P / 3 L | – | ∅ |
| 26 | Veterán motorcsónak | hajo | 8 | 0.8 | 0.85 | 1067×800 | 8 L | – | ∅ |
| 27 | Volvo Penta motorcsónak | hajo | 12 | 1.1 | 0.68 | 1203×800 | 11 L / 1 P | – | ∅ |
| 28 | Jégvitorlás | hajo | 7 | 0.5 | 0.71 | 1067×800 | 5 L / 2 P | – | ∅ |
| 29 | Meyer motorcsónak 1. | hajo | 12 | 0.9 | 0.72 | 1067×800 | 10 L / 2 P | – | ∅ |
| 30 | Meyer motorcsónak 2. | hajo | 7 | 0.8 | 0.79 | 1067×800 | 7 L | – | ∅ |

∅ = `leiras` is the empty string. **This is true for all 30 projects.**

Only 5 projects carry an external `link`: Garzon Pláza, Öttevényi kastély, and the three
Duna Hajók / Duna Cruises entries.

### Shot-type analysis (from visual inspection of contact sheets)

Contact sheets were rendered in a scratch directory from the actual source files; the
repository was not modified.

| Project | Wide/architectural | Same space, multiple viewpoints | Detail / material | Object / furniture | Nature |
|---|---|---|---|---|---|
| Hotel Domus Collis | **Yes, many** — corridors, doorway enfilades, room-to-room sightlines | **Yes** — apartments repeat across angles | Yes (bathroom marble, slatted screens) | Yes | Professional interior photography |
| Duna Cruises HABLEÁNY | **Yes** — full-length deck salon bow-to-stern | **Yes, strongest in the portfolio** — same salon from ~15 positions, plus day *and* night | Yes (window frames, brass, planking) | Yes (tables, benches) | Photo, HDR-processed |
| Bodajki Vadászkastély | Yes — exhibition halls, diorama rooms | Partial — adjacent rooms, some overlap | Yes (floor graphics, cases) | Yes (taxidermy, vitrines) | Professional, dramatic lighting |
| Garzon Pláza Hotel | Yes — reception, breakfast room, corridors | Partial — reception ×3, breakfast ×5 | Yes | **Yes, studio-quality armchair shots on white** | Mixed: photos + hand sketches + material moodboards + exterior |
| Fúzió a tájjal | Yes — corridors with glazed walls, open-plan living | Partial | Yes | Yes | Photo, **visible "Duna Enterior" watermark on most frames** |
| Öttevényi kastély | Yes — ballroom, empty and dressed | **Yes** — ballroom from 3+ angles, empty | Some | Some | Professional, clean, chandeliers/parquet |
| Kristály Étterem | Yes | Yes | Some | Some | **100 % CGI renders, not photographs** |
| Zirci Apátság | Yes | Yes | – | Some | **100 % CGI renders**, watermarked, 800×800 crops only |
| Fafaragások | Two staircase shots | No | **Yes — the best craft/carving closeups in the portfolio** | Yes | Photo; one frame shows the workshop in the background |
| Duna Hajók 6.1 Cabin / KADÉT | Exterior beauty + studio seamless | Turntable-adjacent (bow / side / 3-4 views on grey) | Yes (teak, wheel, fittings) | **Yes — the boat as hero object** | Professional product photography |
| Boesch / Meyer / Jolle / Arcangeli / Jégvitorlás / etc. | Mostly documentary snapshots | No | Some | Yes | Low-res (0.5–0.85 MP), inconsistent |

---

## 9. Asset Inventory

Full scan of the working tree (excluding `node_modules`, `.git`, `.wrangler`, `deploy`):
**393 media files, 60.99 MB.**

| Format | Count | Size |
|---|---|---|
| JPG | 377 | 59.72 MB |
| PNG | 6 | 0.96 MB |
| WOFF2 | 10 | 0.30 MB |
| **JPEG/PNG/WOFF2 total** | **393** | **60.99 MB** |

**NOT FOUND — no assets of these types exist anywhere in the repository:**
WEBP · AVIF · SVG · GIF · MP4/WebM/MOV (video) · GLB/GLTF · USDZ · HDR/EXR · KTX2 ·
texture maps · icon fonts · icon sprites · Lottie/JSON animation · point clouds ·
panoramas/equirectangular images · TTF/OTF.

**Non-project assets**

| File | Format | Size | Dimensions |
|---|---|---|---|
| `img/brand/fejlec-logo.png` | PNG | 35 KB | 1230×313 |
| `img/brand/logo2_c.png` | PNG | 10 KB | 1230×313 |
| `img/brand/dunaenterior_logo.png` | PNG | 12 KB | 300×92 |
| `img/brand/favicon.png` | PNG | 5 KB | 61×61 |
| `img/brand/eu-infoblokk-erfa.png` | PNG | 14 KB | 400×276 |
| `img/brand/slider-2.png` | PNG | **906 KB** | 1920×600 |
| `img/brand/ddm-vebre.jpg` | JPG | 58 KB | 400×400 |
| `img/brand/latvanyterv.jpg` | JPG | 227 KB | 1349×696 |
| `img/brand/ginop-8-3-5.jpg` | JPG | 386 KB | 2048×1448 |
| `img/palyazat/ginop-2-1-7-15-2016-02148.jpg` | JPG | 377 KB | 2560×1784 |
| `img/palyazat/ginop-8-3-5-18-b-4.jpg` | JPG | 386 KB | 2048×1448 |
| `img/palyazat/ginop-9-1-1-21.jpg` | JPG | 545 KB | 2048×1427 |
| `fonts/*.woff2` | WOFF2 | 19–37 KB each | 10 files, 312 KB total |

**Unreferenced brand assets:** `slider-2.png` (906 KB), `logo2_c.png`, `dunaenterior_logo.png`,
`ddm-vebre.jpg`, `latvanyterv.jpg` are not referenced by any published HTML. They are still
copied into `deploy/` (the build copies `img/` wholesale). Legacy from the WordPress import.

### Duplicates

**Exact (SHA-1):** 1 pair —
`img/brand/ginop-8-3-5.jpg` ≡ `img/palyazat/ginop-8-3-5-18-b-4.jpg` (386 KB stored twice).

**Near-duplicates (8×8 mean-hash, Hamming ≤ 5):**
- `budai-haz/04.jpg` ~ `budai-haz/07.jpg` (d=3)
- `duna-hajok-6-1-cabin/22.jpg` ~ `24.jpg` (d=4)
- `garzon-plaza-hotel/15.jpg` ~ `17.jpg` (d=3) — the same armchair on white
- `garzon-plaza-hotel/12.jpg` ~ `19.jpg` (d=5)
- `duna-hajok-6-1-cabin/23.jpg` ~ `zirci-apatsag/10.jpg` (d=2) — **false positive**, both
  are near-white studio backgrounds; the mean-hash cannot separate them
- `jolle-25/10.jpg` ~ `volvo-penta-motorcsonak/01.jpg` (d=2), `boesch-640/18.jpg` ~
  `jolle-25/10.jpg` (d=5) — also low-information frames

Mean-hash is weak on flat/white images. Treat the cross-project matches as unverified.

### Resolution ceiling

The repository contains **no camera originals**. The largest project image is 1536×2048
(3.15 MP); typical is 1800 px on the long edge or, for the older boat sets, 1024–1067 px.
Storage density is 84–196 KB per megapixel, consistent with already-compressed web
derivatives. The build then produces `-800` and `-1400` from these.

**Implication:** a full-bleed 2560-px-wide immersive frame would be an upscale for every
project except Szent László (2048 px tall) and the grant boards. Sourcing the masters is
a Phase 1 prerequisite for any project promoted to a "Living Room".

### Particularly valuable imagery for immersive work

- `duna-cruises-hableany/03, 05, 06, 08, 11, 12, 13, 14, 15, 16` — the deck salon interior
  from many positions; `19, 21, 22, 23` — the same salon at night, lit
- `hotel-domus-collis/02, 04, 09, 14, 18, 20` — corridors, doorways and room-to-room
  sightlines with real depth cues
- `bodajki-vadaszkastely/01–10` — high-contrast exhibition rooms, strong foreground/background
  separation, ideal for depth-map extraction
- `ottevenyi-kastely/02, 03, 04` — the same empty ballroom from three angles; chandeliers,
  parquet, tall windows
- `fafaragasok/01, 04, 05, 08, 09` — carving macro detail; the best material texture in the repo
- `fuzio-a-tajjal/04, 05` — long glazed corridors, excellent one-point perspective
  (**but watermarked**)
- `garzon-plaza-hotel/01, 05, 14–17` — hand sketch → render → built → product shot, the
  only complete "drawing to object" chain in the portfolio
- `duna-hajok-6-1-cabin/22, 23, 24` — the boat on grey seamless from bow/side, close to a
  turntable set

---

## 10. Immersive Project Candidates

Assessed on the actual pixels, not on project names.

### A — Strong Candidates

**A1. Duna Cruises HABLEÁNY** (hajo, 23 images, avg 1.86 MP)
One continuous physical space — an enclosed wooden deck salon — documented from roughly
fifteen positions along its length, both directions, plus night versions of the same
viewpoints. The space has strong repeating structure (posts, roof planking, window
mullions) that gives an unusually reliable perspective skeleton, and the glazing means the
Danube and Budapest are *in* the interior. It is simultaneously the most spatially coherent
set and the literal embodiment of the Danube metaphor. Day/night coverage enables a time
transition inside a single room, which almost nothing else in the portfolio supports.

**A2. Hotel Domus Collis** (hotel, 20 images, 1800×1350, all landscape)
Professional architectural interior photography with consistent lens and lighting.
Critically, several frames are shot *through* doorways and along corridors — real thresholds
that can carry portal transitions between rooms rather than cuts. Multiple apartments repeat
across frames, giving a plausible room-graph. Coherent art direction already (deep green,
oak herringbone, brass, white).

**A3. Bodajki Vadászkastély** (kastely, 10 images, 1800×1200, all landscape)
Museum-exhibition interiors with theatrical lighting and very strong figure/ground
separation (lit objects against dark walls) — the easiest set in the repo for depth-map
extraction and layered parallax. Rooms are visually distinct from one another, which makes a
sequence of spaces read as *movement through a building*. Fewer frames than A1/A2, so
coverage is thinner.

### B — Partial / 2.5D Candidates

**B1. Öttevényi kastély** (8) — the ballroom appears empty from three angles; classical
symmetry, chandeliers, parquet. Enough for a layered parallax room, not enough for free
navigation. The bar room is a strong second beat.

**B2. Garzon Pláza Hotel** (20) — not spatially coherent, but it holds the only complete
*process* narrative in the portfolio: hand sketch → material moodboard → render → built
space → studio product shot of the resulting armchair. A 2.5D "how a chair became real"
sequence is more valuable here than a room.

**B3. Fúzió a tájjal** (20) — architecturally the most photogenic house, with long glazed
corridors that give textbook one-point perspective. Held back by the visible "Duna Enterior"
watermark on most frames and a low ceiling of 1.05 MP. Usable if the masters can be
re-sourced.

**B4. Duna Hajók 6.1 Cabin / KADÉT** (26 + 11) — studio seamless shots from several angles
make a *photographic turntable* of the boat as an object realistic. Object-in-space, not
space-you-enter.

**B5. Fafaragások** (10) — no room, but the best material macro imagery in the repo. The
natural home for a craft/material chapter with depth-of-field and scroll-driven scale.

**B6. Kristály Étterem** (10) — entirely CGI. Because it is synthetic it is internally
consistent and reprojects cleanly, and the "digital building" concept can honestly present
it as a design that exists only as a drawing. Currently the homepage hero uses one of these
renders as the primary photograph, which is worth a deliberate decision.

### C — Content / Archive Candidates

**C1. Zirci Apátság** — CGI, watermarked, cropped to 800×800. Too small for anything full-bleed.
**C2. Szent László Látogatóközpont fa kapuja** — 8 frames, highest resolution in the repo
(1536×2048), but a single object (a door) rather than a space. Strong editorial hero, not a room.
**C3. Vatikáni díszdoboz**, **C4. Mercedes plató** — object studies, 5 and 10 frames.
**C5. Családi ház**, **C6. Budai ház**, **C7. Belvárosban – nyugalomban** — competent
residential documentation at 1.14 MP and below; good grid content, insufficient viewpoint
overlap.
**C8. Domus Pellegrini Hotel – Apartmanok** — only 5 images.
**C9–C15. Boesch 560/580/640, Meyer 1–2, Jolle 25, Arcangeli, Rivális, Veterán, Volvo Penta,
Jégvitorlás, Bojan – Harcos** — 0.54–0.85 MP documentary snapshots, inconsistent lighting.
Collectively 15 of the 30 projects. These are the *archive* — and their volume is itself a
brand statement ("we have built this many boats"), best expressed as a dense index rather
than 15 thin pages.

---

## 11. Recommended First Immersive Project

### 1st — Duna Cruises HABLEÁNY

| Criterion | Assessment |
|---|---|
| Image quality | 23 frames, avg 1.86 MP, max 1350×1800; heaviest set in the repo at 7.4 MB |
| Usable images | ~18 of 23 are inside or on the vessel; 5 are exteriors/city, useful as establishing shots |
| Viewpoint variety | **Highest in the portfolio** — one salon, ~15 camera positions, both directions |
| Spatial coherence | **Highest** — repeating posts, planked ceiling and window mullions give a strong, recoverable perspective grid |
| Visual character | Varnished mahogany, white planked ceiling, brass, glass — unmistakably DUNA |
| Depth potential | Excellent: near mullion → mid furniture → far river/city is a natural 3-layer split in almost every frame |
| Digital-room potential | It is already a room, and it *moves* — a boat is a room that travels |
| Brand relationship | Boats are 15/30 of the portfolio and half the company's identity; this is the flagship |
| Transition potential | Day and night versions of the same viewpoints permit a time transition inside one space — unique in this portfolio |
| Awwwards potential | The Danube metaphor is not applied to this project, it *is* this project: an interior on the river, with the river visible through it |

Risk: several frames are heavily HDR-processed with halos; and the set is a passenger vessel
photographed partly for marketing (Christmas garlands appear in some frames), which
constrains a timeless treatment. Both are art-directable by frame selection.

### 2nd — Hotel Domus Collis

The strongest *architectural* set: consistent professional photography, all landscape at
1800×1350, and genuine doorway/corridor sightlines that make threshold-based transitions
between rooms honest rather than decorative. It is the better choice if Phase 1 wants to
prove the "walk through a building" navigation model specifically. Two things hold it to
second: 20 identical-format landscape frames give less compositional range than HABLEÁNY,
and its alt-text provenance (Facebook CDN filenames) suggests the files came from social
media — the masters should be requested before committing.

### 3rd — Bodajki Vadászkastély

The most cinematic lighting in the repository and the easiest depth extraction, with rooms
that are strongly distinct from one another. Ten frames is the limiting factor: enough for
a curated sequence of spaces, not enough for exploration. An excellent *second* room in a
multi-room build, and a good proof case for the depth-map pipeline at low asset cost.

---

## 12. Recommended Technical Direction

### CURRENT STACK

Static HTML + one CSS file + vanilla-JS IIFEs · `sharp` at build time · custom
`build.mjs` · GitHub Actions → Cloudflare Pages · one Cloudflare Worker (D1 + Resend +
reCAPTCHA) · GitHub-API-based admin. No bundler, no modules, no 3D, no tests, no linter.

**Verdict: adequate for the site that exists, insufficient for THE LIVING INTERIOR.**

What is worth *keeping* rather than rebuilding:
- `data/projektek.json` as the single content source, and the admin that writes to it
- the build's hard-fail validations (missing image, unsubstituted `{{key}}`)
- content-hash cache busting
- the Worker, D1 schema and form pipeline — unrelated to the redesign, already working
- the Cloudflare Pages + Actions deployment path
- the reduced-motion discipline and the "motion is layer two" architecture, which is
  exactly the right posture for a WebGL site

What blocks the concept:
- **No module system or bundler.** Three.js cannot be added to bare `<script src>` IIFEs
  without either an import map or a bundler.
- **No image pipeline beyond two JPEG widths.** Immersive work needs AVIF/WebP with
  `srcset`, plus depth maps or generated geometry.
- **No route-level transition model.** The current cross-page fade cannot carry a
  continuous spatial transition between projects.
- **No asset budget or loading orchestration.** A 131 MB `deploy/` with no preloading
  strategy will not support progressive scene loading.

### RECOMMENDED FUTURE STACK

Recommendation, not an instruction to install anything now. Nothing below has been added.

| Concern | Recommendation | Why |
|---|---|---|
| Build / bundler | **Vite** | Fastest path from "no bundler" to code-split ESM; keeps the existing `build.mjs` logic portable as a Vite plugin or pre-step. |
| Framework | **Keep it framework-light — Astro, or stay vanilla + Vite** | The site is content-static with islands of interactivity. Astro gives per-route islands and keeps HTML-first output, which preserves the current SEO and no-JS resilience. A full SPA framework buys little here and costs the graceful-degradation property that this codebase currently has. |
| 3D | **Three.js (WebGLRenderer)** | The only mature option for image-based depth, plane reprojection and shader transitions. WebGPU: not yet — Safari/iOS support and the mobile GPU profile of the target audience (Hungarian construction/hospitality clients) do not justify a WebGPU-only path in 2026. Consider it as a progressive upgrade via Three's WebGPURenderer later. |
| Smooth scroll | **Lenis** | Needed for scroll-driven 3D; small, well-behaved, and — important here — respects `prefers-reduced-motion`. |
| Animation | **GSAP + ScrollTrigger** | The pinned horizontal rail already in `script.js` is a hand-rolled ScrollTrigger; GSAP replaces ~200 lines of bespoke engine with a battle-tested one and unlocks timeline-based cinematic transitions. |
| Spatial technique | **2.5D depth-map displacement first, not photogrammetry** | The imagery is single-camera, uncalibrated, non-overlapping and ≤2 MP. Photogrammetry/Gaussian splatting will fail on this input. Monocular depth estimation (e.g. Depth Anything class models, run **offline at build time**, output baked as a grayscale depth PNG per hero image) + a displacement shader gives convincing parallax from exactly the assets that exist. |
| Transitions | **Shader-based displacement/dissolve between project textures** | Project-to-project transitions become a single full-screen quad crossfading two textures through a noise or depth field — cheap, and works identically on mobile. |
| Image delivery | **AVIF + WebP with JPEG fallback, `<picture>` + `srcset`; Cloudflare Images or `sharp` in-build** | Current output is JPEG-only with no `srcset`. AVIF alone should cut the image payload 40–60 %. |
| Video | **None available today.** If motion footage is ever shot, prefer short muted MP4/WebM as video textures over image sequences. | |
| Asset loading | Explicit loading manager, per-room lazy scene init, `IntersectionObserver`-gated context creation | Prevents 131 MB of assets from becoming a 131 MB first paint. |
| Responsive 3D | Device-tier detection: full displacement on desktop, reduced mesh density on tablet, **static `<picture>` with CSS parallax on phones** | Mobile GPUs and Hungarian mobile bandwidth make a shared code path unrealistic; the existing `.kezi` fallback pattern in `script.js` is the right precedent to follow. |
| Mobile GPU limits | Cap DPR at 2, cap texture size at 2048, single render target, no post-processing stack on mobile | The imagery is ≤2 MP anyway, so 2048 costs nothing in fidelity. |
| CSS 3D / canvas | Use CSS 3D only for card tilt and small ornament; do not attempt room-scale spatial work in CSS | CSS 3D cannot do displacement or masking by depth. |
| TypeScript | **Adopt** | A scene graph, room definitions and per-project spatial metadata are exactly the kind of data that silently breaks untyped. |
| Testing | Vitest for build/data validation; Playwright for route smoke tests | The current build validations should become tests rather than `process.exit(1)` calls. |
| Linting | ESLint + Prettier, or Biome | Currently absent; will matter once there is more than one contributor's IIFE style. |

---

## 13. Performance Baseline

Measured live on 2026-08-15 against `https://duna-enterior.pages.dev` via the Resource
Timing API. Desktop viewport 1265 px, uncached.

**Homepage `/`**

| Metric | Value |
|---|---|
| Total transfer | **817.5 KB** |
| HTML | 4.6 KB |
| CSS | 11.7 KB transfer / 42.1 KB decoded (2 files) |
| JS | 9.5 KB transfer / 24.7 KB decoded (2 files) |
| Fonts | **315.0 KB (10 files — all of them)** |
| Images | 481.3 KB (4 files) |
| DOM nodes | 359 |
| DOMContentLoaded | 1645 ms |
| Load | 4083 ms |
| Horizontal overflow | none (`scrollWidth == clientWidth`) |

**References `/referenciak`** (after full scroll, all lazy images resolved)

| Metric | Value |
|---|---|
| Total transfer | **1933 KB** |
| Images | 1929 KB across 32 requests (30 cards at `-800`, ~64–71 KB each) |

**Deployed artifact:** `deploy/` is **131 MB**, of which `deploy/img` is 130 MB:

| Tier | Files | Size |
|---|---|---|
| Source originals | 371 | 57.8 MB |
| `-800` derivatives | 371 | 21.1 MB |
| `-1400` derivatives | 371 | 45.7 MB |

### Problems identified (not fixed — this is an audit)

1. **All 10 font files load on every page — 315 KB, the single largest category on the
   homepage, larger than the CSS, JS and HTML combined.** The `unicode-range` subsetting is
   correctly configured, but both the `latin` and `latin-ext` slices of all five faces are
   still requested. Hungarian copy contains ő/ű (U+0151/U+0171), which forces `latin-ext`;
   the `latin` slices then load too. Net effect: no saving from the subsetting. There are no
   `<link rel="preload">` hints, so fonts are discovered only after CSS parses.
2. **The homepage hero loads unresized originals.** `index.html:42-44` references
   `img/projektek/kristaly-etterem/02.jpg` (139 KB), `hotel-domus-collis/01.jpg` (**263 KB**)
   and `fuzio-a-tajjal/01.jpg` (44 KB) — the source files, not the `-800`/`-1400`
   derivatives the build generates. `design-manufaktura.html` does the same with
   `fafaragasok/01.jpg`. These four are the only reason the 57.8 MB of originals must ship.
3. **57.8 MB of originals are deployed but only 4 are ever requested.** `build.mjs:56`
   copies `img/` wholesale into `deploy/`. Fixing (2) would make ~57.7 MB of the deploy
   removable.
4. **No `srcset`, no `sizes`, no `<picture>`.** Every card is served the `-800` JPEG
   regardless of viewport or DPR; retina desktop is under-served and phones are over-served.
5. **No modern formats.** JPEG only. AVIF/WebP would plausibly halve the 1.9 MB references
   page.
6. **No code splitting** — but with 24.7 KB of decoded JS total, this costs nothing today.
   It becomes critical the moment Three.js is added.
7. **`load` at 4083 ms vs. DCL at 1645 ms** — the ~2.4 s gap is font and image settling.
8. **Cache headers unverified.** `_headers` currently sets only `X-Robots-Tag`. Cloudflare
   Pages defaults apply; the content-hash `?v=` query on CSS/JS means long-lived caching
   would be safe but is not explicitly configured. **UNKNOWN** whether Pages is applying
   `Cache-Control: immutable` to the hashed assets.
9. **Unreferenced assets shipped:** `slider-2.png` (906 KB), `logo2_c.png`,
   `dunaenterior_logo.png`, `ddm-vebre.jpg`, `latvanyterv.jpg`, plus one exact-duplicate
   386 KB grant image.
10. **Unnecessary dependencies: none.** One devDependency, zero runtime dependencies. This
    is genuinely excellent and worth protecting as the stack grows.
11. **Third-party:** OpenStreetMap iframe on `/kapcsolat` (lazy-loaded), reCAPTCHA v3 and
    Google Analytics both consent-gated via `consent.js` — nothing loads before consent.

**Not measured (out of scope for Phase 0 / no tooling run):** Lighthouse scores, LCP, CLS,
INP, TBT. Marked **UNKNOWN**.

---

## 14. Mobile Baseline

Measured live at 375×812 (mobile emulation) and via `style.css`.

**Breakpoints:** `max-width: 900px`, `max-width: 860px`, `max-width: 600px`,
`min-width: 901px`, plus `prefers-reduced-motion: reduce`. JS uses its own threshold —
`keskeny() = innerWidth <= 900` (`script.js:21`) — and `matchMedia('(hover: hover) and
(pointer: fine)')` to gate pointer-tracked effects.

**Findings**

| Aspect | Observed |
|---|---|
| Horizontal overflow | **None.** `scrollWidth === clientWidth === 375` on both `/` and `/referenciak`. |
| Navigation | `Menü` button `display: block`; nav collapses to a toggled panel; label swaps to `Bezár`; closes on link tap. Correct `aria-expanded`. |
| Typography | H1 = 40 px at 375 px; body = 16 px. Readable; the Cormorant Light 300 at display sizes is the thing to watch on low-DPI Android. |
| Hero image strip | `#heroSav` stays `display: grid` at 375 px — the three-image strip is retained on mobile, not dropped. |
| Horizontal process rail | Stays `class="vizszintes kezi"` on mobile — i.e. native touch scrolling, JS pinning never engages. **This is the correct pattern and the precedent to follow for WebGL fallbacks.** |
| Marquee | `.szalag-sor` is 1770 px wide inside a clipped container; does not leak into page scroll. |
| Reveal animations | `.jon.bal` elements sit at `left: -32px` pre-reveal; because they translate rather than reflow, they add no scroll width. |
| Touch interactions | Card tilt/hover is gated off on coarse pointers. Lightbox works via `<dialog>`; **swipe gestures are not implemented** — only the ‹ › buttons and keyboard arrows. |
| Images on mobile | Every card gets the same `-800` JPEG as desktop. At 375 px CSS width × DPR 3, that is roughly correct by accident; at DPR 2 it is oversized. |
| Performance concern | 315 KB of fonts on a mobile connection before first meaningful text; `font-display: swap` means a FOUT rather than a block. |

**What will matter for THE LIVING INTERIOR:** the codebase already has a working
progressive-enhancement idiom (`.kezi` base class → JS upgrade when there is room). That
same idiom should carry the WebGL layer: static `<picture>` on phones, displacement scenes
on desktop. Nothing about the current mobile implementation blocks this.

**Not tested:** real devices, iOS Safari specifically, slow-3G throttling, touch-drag on the
horizontal rail with a real finger. Marked **UNKNOWN**.

---

## 15. Content / Brand Audit

### WHAT WE HAVE

**Brand statements**
- Positioning line: *"Harminc év, egy műhely, több száz tér."* (index hero)
- *"Komplett kivitelezés, egy kézből."* — the core promise, repeated across pages
- *"A tervezéstől a kivitelezésig egy kézben: saját gyártókapacitás, szerelőcsapatok és
  belsőépítész-tervezői háttér."*
- Sub-brand line: *"Ahol a fa nem alapanyag, hanem inspiráció."* (Duna Design Manufaktúra)
- *"Exkluzivitás, amit meg lehet érinteni"*, *"nem tömegtermelés, hanem egyedi alkotás"*

**About text** (`rolunk.html`) — two solid paragraphs of company history: founded 1991 by
Győrffy Péter, several hundred projects, Győr site, 1200 m² production hall, modern
technology, experienced staff. Plus three value blocks (services in one hand, predictable
process, quality in the details).

**Managing director's letter** (`rolunk.html`) — four paragraphs signed Győrffy Péter,
ügyvezető. Genuinely good copy: *"a minőségi környezet nem csupán esztétikai kérdés, hanem
életérzés"*, *"egy munka nem az átadással ér véget – ekkor kezdődik az a bizalmi kapcsolat"*.

**Services** — a complete, specific list: furniture joinery, building joinery, facility
fit-out, leisure and sport boat design and manufacture, boat repair/refit/conversion, full
detail-design documentation, in-house manufacture, delivery and installation, study and
structural plans, consultancy, contract joinery, planing, surface finishing, contact sanding.

**Process** — five named steps on the homepage: 01 Igényfelmérés → 02 Tervezés →
03 Gyártás (1200 m², saját gépek) → 04 Felület → 05 Szerelés.

**Craftsmanship messaging** — present but thin: "gyalulás, kontaktcsiszolás, korszerű
gépsor", "saját felületkezelő részlegben", the workshop-vocabulary marquee on `/rolunk`.

**Manufacturing messaging** — the 1200 m² figure and the in-house-everything claim carry it.

**Boat content** — the largest single block of the portfolio (15/30 projects) yet the
thinnest editorially: three lines on the homepage, two bullets on `/rolunk`, and an outbound
link to a **separate site, `dunahajok.hu`**, in both the header and footer.

**Contact information** — four named people with role, direct mobile and email; company
registration number, tax number, two addresses, map coordinates.

**Existing CTAs** — "Referenciák →", "Ajánlatkérés", "Rólunk bővebben →", "Mind a 30 projekt →",
"A manufaktúráról →", "Összes egyedi munka →", "Üzenet küldése →", "Megnyitás a Google
Térképen ↗".

**Legally mandatory content that must survive any redesign:** the EU/Széchenyi 2020 ERFA
info block and the grant list in the footer, and `/palyazatok` in full. `build.mjs:178`
records that under KTK 2020 this text may not be shortened.

### WHAT IS MISSING

1. **All 30 project descriptions.** `leiras: ""` for every project. This is the single
   largest content gap in the repository.
2. **All project metadata:** no location, year, client, floor area, materials, scope,
   collaborators, architect, or photographer credit anywhere.
3. **Meaningful image metadata.** 82 of 371 alts are machine junk; none identify room,
   viewpoint or shot type.
4. **Workshop / manufacturing imagery.** The brand rests on "saját 1200 m²-es üzem" and
   there is essentially no photograph of it — one incidental workshop background in
   `fafaragasok/10.jpg`. For a concept built on craft storytelling, this is a serious hole.
5. **People.** No photographs of the team, the founder, or hands at work. Four names and
   phone numbers, no faces.
6. **The Danube itself.** Despite the company name and the proposed metaphor, the only
   river imagery is incidental — through HABLEÁNY's windows and behind the 6.1 boats.
7. **Materials story.** No wood species, no finish samples, no material library.
8. **Timeline / history.** "1991" and "harminc év" are asserted; there is no chronology,
   no milestones, no archive.
9. **English (or any second) language.** The site is Hungarian-only, `lang="hu"`.
   An Awwwards submission is judged by an international jury.
10. **Video.** None. Zero motion footage anywhere.
11. **Testimonials / client names.** Only five projects even link to the client.

### WHAT COULD BE REUSED

- The managing director's letter — the most human writing on the site; the natural voice
  for an "entry hall" or intro sequence
- The five-step process — already a spatial sequence; maps directly onto rooms or floors
- The service list — precise and specific; strong material for a "what this building
  contains" index
- Company facts (1991, 1200 m², 30 references, 371 photos) — already data-driven and already
  animated as count-ups
- `data/ceg-adatok.json` as the single source of company truth
- The pályázatok content, verbatim and unshortened (legally required)
- The category taxonomy (hotel / étterem / lakóingatlan / kastély / szakrális / egyedi /
  hajó) — a serviceable first draft of a room typology

### WHAT SHOULD PROBABLY BE REWRITTEN LATER

- Everything on `/rolunk` written in third-person corporate register
  (*"Vállalkozásunkat Győrffy Péter alapította azzal a céllal, hogy…"*) — competent but
  generic; will read as boilerplate under an immersive art direction
- The three "Tevékenység" cards on the homepage — currently descriptive, not evocative
- `/design-manufaktura` — leans on superlatives ("exkluzív", "különleges", "legmagasabb
  minőség") rather than showing specific work
- The boat story — needs to become a first-class narrative on this site, or the
  `dunahajok.hu` split needs a deliberate decision
- All 30 project descriptions — to be written from scratch, not rewritten
- Image alt text — needs a full re-authoring pass regardless of the redesign, for
  accessibility alone

**Known content inconsistency (deliberate, documented):** `data/ceg-adatok.json` records
that the legacy site published two different addresses — Ikrényi út **2.** on the impressum
and GDPR notice, Ikrényi út **14.** everywhere else. The current build reproduces both in
their original locations by client decision. Flagging it so it is not "fixed" by accident.

---

## 16. Risks

| # | Risk | Severity | Detail |
|---|---|---|---|
| 1 | **Resolution ceiling** | **High** | No camera originals in the repo; max 3.15 MP, typical 1–2 MP. Full-bleed immersive treatment will be visibly soft. Mitigation: request the masters from the client before committing to a hero project. |
| 2 | **No project copy at all** | **High** | 30 empty descriptions. An immersive site with nothing to say in each room is a slideshow. Requires a real content project, not a copy pass. |
| 3 | **No image metadata** | **High** | Spatial assembly needs room identity and viewpoint per frame. Must be produced manually or with an AI tagging pass, then stored — probably as new fields in `projektek.json`. |
| 4 | **Watermarks** | Medium | "Duna Enterior" watermark on most of `fuzio-a-tajjal` and all of `zirci-apatsag`. Cannot be full-bleed without the unwatermarked masters. |
| 5 | **Renders presented as photography** | Medium | Kristály Étterem and Zirci Apátság are 100 % CGI, and a Kristály render is the current homepage hero. Under a "digital building made from what DUNA has built" concept this needs an honest editorial decision. |
| 6 | **Provenance of Hotel Domus Collis** | Medium | Alt texts are Facebook CDN filenames, implying social-media sourcing and prior recompression. Verify rights and obtain masters before making it a hero. |
| 7 | **Mobile GPU budget** | Medium | Hungarian B2B audience on mid-range Android. A WebGL-only site will exclude visitors. The existing `.kezi` progressive pattern must be extended, not abandoned. |
| 8 | **No bundler / no modules** | Medium | Adding Three.js to bare IIFE scripts is not viable. This is a stack migration, not an addition — plan it as one. |
| 9 | **Font payload already at 315 KB** | Medium | Before any 3D asset is added, fonts alone are the biggest homepage category. A WebGL layer on top of this budget will be slow. |
| 10 | **Losing the working system** | Medium | The admin (`admin.js`, GitHub API commits) is how the client updates content. Any rebuild must preserve or replace it, or the site becomes uneditable by its owner. |
| 11 | **Loss of no-JS resilience** | Medium | Today the site is fully readable with JS disabled. An immersive rebuild will trade some of this away; decide deliberately how much. |
| 12 | **Legal content** | Medium | The EU ERFA block, grant list and `/palyazatok` are mandatory under KTK 2020 and cannot be shortened or aesthetically removed. |
| 13 | **SEO regression** | Medium | 41 indexable pages, a sitemap, per-project titles and descriptions exist today. A canvas-driven experience can lose all of it. Note also `sajatDomainEl: false` currently emits site-wide `noindex` — correct for a staging domain, but it must be flipped at go-live. |
| 14 | **Boat story split across two domains** | Low–Medium | `dunahajok.hu` holds half the identity. Unresolved, it will fragment the "one building" concept. |
| 15 | **Build time** | Low | 371 sources × 2 derivatives already takes 2–4 minutes in CI (per `deploy.yml`). Adding depth maps and AVIF will multiply this; plan for caching derivatives. |
| 16 | **Single-language** | Low–Medium | Hungarian only, against an international award ambition. |

---

## 17. Open Questions

1. **Do the original camera files exist?** This is the single most consequential unknown.
   Who holds them — the client, the photographer, an agency?
2. **Who shot Hotel Domus Collis, Bodajki, Öttevényi and HABLEÁNY, and what are the usage
   rights?** No photographer is credited anywhere.
3. **Can we photograph the workshop?** A new shoot of the 1200 m² hall, the machines, the
   surface-finishing department and the hands would transform the craft narrative — and it
   is the one gap no amount of clever code can fill.
4. **Is video possible?** Even 30 seconds of a plane taking a shaving would change the
   register of the whole site.
5. **What happens to `dunahajok.hu`?** Absorb, cross-link, or keep separate?
6. **English version — in scope?**
7. **Does the client accept CGI presented as CGI?** (Kristály Étterem, Zirci Apátság)
8. **How much of the 30-project archive should survive as full pages** versus becoming a
   dense index? 15 of 30 are low-resolution boat snapshots.
9. **Must the GitHub-API admin survive the rebuild?** It is the client's only editing route.
10. **Is a full stack migration acceptable**, or must the new site remain a no-build static
    site?
11. **What is the actual performance floor** — target devices and connection?
12. **Is a hard `noindex` acceptable during the rebuild**, and when does `dunaenterior.hu`
    go live?
13. **Öttevényi ballroom and Bodajki: are these DUNA's own work or venues DUNA fitted out?**
    The photographs show finished spaces; the repo does not say what DUNA contributed.
14. **Is there any floor plan or drawing archive?** For a "digital building", real plans
    would be extraordinary source material. Only one hand sketch survives, in Garzon Pláza.

---

## 18. Recommended Next Steps

Ordered. None of these were performed in Phase 0.

1. **Ask the client for the master image files** for HABLEÁNY, Hotel Domus Collis and
   Bodajki, plus photographer credits and usage rights. Everything downstream depends on
   the answer.
2. **Commission project copy** — a location, year, scope, materials and 100–200 words for at
   least the 8–10 projects that will get real treatment.
3. **Run an image tagging pass** over the ~90 images of the top candidates: room identity,
   viewpoint, shot type (wide / detail / object / exterior), primary material. Store it as
   new fields in `data/projektek.json` so the existing admin and build validation keep working.
4. **Propose a workshop photo (and video) shoot.** Highest content return of anything on
   this list.
5. **Decide the stack migration question** (§17.10) before any prototyping — it determines
   whether Phase 1 is a prototype or a rebuild.
6. **Build a throwaway spike:** one HABLEÁNY frame + an offline-generated depth map +
   a Three.js displacement shader, to establish whether ~1.9 MP source holds up full-screen.
   Throwaway, not the foundation.
7. **Fix the four hero images to use the `-1400` derivatives** — a two-line change worth
   ~57.7 MB off the deployed artifact. Deliberately *not* done in Phase 0.
8. **Define the room typology and the building metaphor** — what floors, what rooms, what
   the Danube actually does in the navigation.
9. **Set an explicit asset and performance budget** before the first line of WebGL.
10. **Decide the boat/`dunahajok.hu` question.**

---

## 19. Phase 1 Requirements

Phase 1 should not start until these are in place:

**Content prerequisites**
- Master image files for the chosen hero project, or a written decision to proceed at ≤2 MP
- Written copy for the hero project (title, location, year, scope, narrative)
- Per-image tagging for the hero project's frames
- A decision on English

**Technical prerequisites**
- A decision on the stack migration (Vite/Astro + TypeScript, or stay vanilla)
- A decision on how `data/projektek.json` and the GitHub-API admin survive
- An asset budget: max first-load transfer, max texture size, target devices
- A defined mobile fallback contract — what phones get instead of WebGL

**Scope for Phase 1 (proposed)**
- **One** room, not a building. Duna Cruises HABLEÁNY.
- Prove three things and nothing else:
  1. depth-based parallax reads as *space* at the available resolution
  2. a day→night transition inside one room is achievable and beautiful
  3. it degrades honestly on a mid-range Android phone
- Keep the existing site live and untouched throughout; build the prototype on a branch.

**Explicit non-goals for Phase 1**
- No multi-room navigation, no global redesign, no new visual identity, no copy rewrite
  beyond the one hero project, no touching the Worker, the form, the admin or the legally
  mandated grant content.

---

## Appendix — Changes made during Phase 0

**Files created (1):**
- `docs/PHASE-0-AUDIT.md` — this document.

`docs/` is a new directory. It is **not** in the `ASSETS` array in `build.mjs:44-52`, so it
is not copied into `deploy/` and does not reach the published site.

**Files modified:** none.
**Assets modified, renamed, compressed or deleted:** none.
**Dependencies added or changed:** none. `package.json` untouched.

**Verification performed:**
- `git status --porcelain` before and after: the only entry is `?? .claude/`, which was
  already untracked at the start of this session.
- `npm run build` re-run and passing:
  `Kész: 41 oldal, 30 projekt, 371 kép (742 webes változat), domain dunaenterior.hu.`
- Asset scan re-run after the build: 393 media files, 60.99 MB — unchanged.

Analysis scripts (asset forensics, perceptual-hash duplicate detection, contact-sheet
generation) were written to and executed from a temporary scratch directory outside the
repository. They read the repository's images but wrote nothing to it.
