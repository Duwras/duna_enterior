# DUNA — THE LIVING INTERIOR
# PHASE 6 — THE SOURCE / MASTER & CONTENT SYSTEM

Phase 6 built no new experience. It built the machinery that decides whether the *next* one can
exist — and then spent the rest of its budget closing the performance and release debts that four
previous phases carried forward.

Two sentences summarise the phase:

1. **A photographer can now hand over a folder and get the word READY or NOT READY**, with reasons,
   without anyone reading the build source.
2. **The Fleet is inside its performance budget for the first time** — 342.9 KB against 350 — and
   it got there without touching a single photograph, because 54.5 KB of the font payload turned
   out to be the same two files downloaded twice.

Everything below is measured against the repository as it stands after this phase, not against
what the earlier documents claim.

---

## 1. Current Content State

### 1.1 What Phase 0–5 said, and what the files actually say

Every number in this section was re-measured with `sharp` against `img/projektek/**`. The phase
documents were treated as claims to verify, not as facts.

| | Measured, Phase 6 |
|---|---|
| Master photographs | **371**, across 30 published projects |
| Format | 371 / 371 JPEG. No PNG, TIFF, AVIF or WebP masters |
| Colour space | 371 / 371 sRGB (5 with an embedded ICC profile) |
| Resolution, median | **1.14 MP** |
| Resolution, range | 0.27 MP (`fuzio-a-tajjal/01`, 529 × 640) – 3.15 MP |
| Long edge, max | **2048 px** — one project (`szent-laszlo-…`, 1536 × 2048) |
| Below 1.5 MP | 224 / 371 (60 %) |
| At or above 3 MP | **5 / 371** |
| At or above 3000 px long edge | **0 / 371** |

The last line is the whole phase in one number. **Not one photograph in the archive can carry a
depth-critical Level 1 frame at the specification Phase 5 wrote.** The specification was right; the
archive simply predates it.

### 1.2 Distribution

| Band | Count |
|---|---|
| < 0.5 MP | 49 |
| 0.5 – 1 MP | 135 |
| 1 – 1.5 MP | 40 |
| 1.5 – 3 MP | 142 |
| 3 – 6 MP | 5 |

The bimodal shape is the archive's two eras: the boat documentation of 2002–2004 (0.31–0.85 MP,
camera date stamps, `Duna HAJÓK` watermark) and the interior photography of the 2010s
(1.5–2.4 MP, clean).

### 1.3 The 26 images that carry the site

Of 371 masters, **88 have any role at all**; 283 exist only in a project gallery. Of those 88,
**26 are CRITICAL** — full-bleed, above the fold, or a Level 1 camera position.

Five of the 26 are below the 1.5 MP minimum. All five are boats, all five are in
`data/forras.json` with a named, reasoned waiver, and all five name the photograph that would
replace them:

| Image | Size | Role | Unblocked by |
|---|---|---|---|
| `jegvitorlas/05` | 600 × 800 · 0.48 MP | Fleet opening 2 | two hulls under construction, 3000 px |
| `rivalis-vitorlas-hajo/06` | 669 × 800 · 0.54 MP | Fleet opening turn | any other boat interior, 2400 px |
| `meyer-motorcsonak-2/05` | 1029 × 730 · 0.75 MP | **the Making's closing workshop frame** | Phase 5 §15.2 shot 1 |
| `boesch-640-de-luxe/05` | 1024 × 768 · 0.79 MP | Fleet opening | the finishing department in use |
| `boesch-640-de-luxe/13` | 1067 × 800 · 0.85 MP | Fleet opening | the finishing department in use |

`meyer-motorcsonak-2/05` is still the only workshop photograph in the archive. Phase 5 said so;
Phase 6 measured it and wired the build to refuse to forget it.

### 1.4 Rights, watermarks, date stamps

Recorded per project in `data/forras.json`, sourced from the Phase 0 / 4 / 5 audits — nothing was
invented, and where the audits are silent the default `sajat-archivum` stands.

| Condition | Projects |
|---|---|
| Rights not established in writing | `hotel-domus-collis` (Facebook CDN provenance, Phase 0 §6) |
| Recognisable people, permission not confirmed | `szent-laszlo-…` (06, 08), `vatikani-diszdoboz` (01, 02) |
| `Duna HAJÓK` watermark | 13 boat projects |
| `Duna Enterior` watermark | `fuzio-a-tajjal`, `zirci-apatsag` |
| Burnt-in camera date | `boesch-560-de-luxe`, `meyer-motorcsonak-2`, `volvo-penta-motorcsonak` |
| CGI, not photography | `zirci-apatsag`, `kristaly-etterem`, 5 frames of `garzon-plaza-hotel` |

`hotel-domus-collis` is the sharpest problem: it carries **four homepage scenes and a whole Level 1
room**, and its usage rights have been open since Phase 0. It is the only project in the matrix
whose status is `NEEDS_RIGHTS` on a critical asset.

### 1.5 Copy

Unchanged and untouched by this phase, because no amount of engineering writes it:

- `leiras` is empty for **30 / 30** projects.
- **104 / 371** alt texts are archive labels, not descriptions. The matrix identifies them by rule
  (`scripts/forras-modell.mjs` → `gepiAlt`), and the rule reproduces Phase 5's count of 104 exactly.

---

## 2. Master Image Rules

Declared once, machine-readable, in `data/forras.json` → `mester`. The build reads them; so does the
ingestion tool; so does the content matrix. There is no second copy.

```
minimum          1.5 MP  /  1400 px long edge
recommended      3.0 MP  /  2400 px long edge
depth-critical   6.0 MP  /  3000 px long edge
```

**Why 1400 and not 2400 as the minimum.** 1400 px is what the build actually ships as its largest
derivative. A 1400 px master is therefore exactly sufficient for today's output and has *zero* crop
or reframe headroom. That is the floor below which an image is not merely imperfect but unusable.
2400 px is what a new shoot must deliver, and it is what the ingestion tool enforces on incoming
work. 3000 px is Phase 5 §15.1's figure for frames that will be layered into a Level 1 room; the
tool applies it to the three shot types that can become thresholds.

Also declared:

| Rule | Value | Reason |
|---|---|---|
| Crop reserve | 12 % | after trimming 12 % off the long edge the frame must still clear the minimum |
| Aspect ratio | 0.42 – 2.2 | outside this band the current layout either breaks or crops half the frame away |
| Formats | jpg, jpeg, png, tif, tiff | **AVIF and WebP are forbidden as masters** — those are our output formats |
| Colour space | sRGB, profile embedded | `sharp` converts everything else silently, so the colour would shift without warning |
| Watermark | none on new masters | existing archive marks are the client's own provenance and are not retouched away |
| Date stamp | none | a camera clock is not a client-confirmed fact (Phase 4 §19.3) |
| Retouching | dust and sensor spots only | no sky replacement, no compositing, no tool placed where it wasn't |

One archive image violates the aspect band: `duna-hajok-6-1-kadet/06` at 2.40. It is not in a
critical role, so it warns rather than fails.

---

## 3. Derivative Pipeline

### 3.1 The three tiers, named

```
MASTER       img/projektek/<slug>/<file>            in the repo, never written by the build
DERIVATIVE   deploy/img/.../<file>-{400,800,1400}.{jpg,webp,avif}    rebuilt every time
CACHE        .kepgyorstar/                          disposable, not versioned
```

The build only ever *reads* masters. Masters are excluded from `deploy/` by `KIHAGY`, so a
derivative can never be served in place of one, and step 6/c fails the build if any page links a
raw source path.

### 3.2 The `-400` step now exists for every image

Previously `-400` was generated only for priority images. The project galleries — grid cells
268–400 px wide — therefore downloaded the **800 px** JPEG, ~95 KB per photograph. Scrolling one
23-photograph boat page cost **2.24 MB**.

Every image now gets `-400`. Measured on `duna-cruises-hableany`:

| | Before | After |
|---|---|---|
| Full gallery scroll | 2238 KB | **626 KB** (−72 %) |

Cost: 283 additional JPEG encodes on a cold build (+~6 s), `deploy/` 98 MB → 104 MB. Priority
images are byte-identical — they already had all three sizes.

### 3.3 Detecting a poisoned source chain

Phase 6 added checks for the failure the separation exists to prevent: someone saves an image from
the published site and puts it back as a source.

**Fails the build**

- a derivative suffix in the master filename (`-400`, `-800`, `-1400`)
- an AVIF or WebP master — our own output formats, so a double lossy pass
- any other unsupported format

**Warns**

- master width exactly 400, 800 or 1400 px — the same widths we emit. Eleven archive images trip
  this legitimately (the `zirci-apatsag` 800 × 800 crops, `volvo-penta/01`), and they carry
  `"vagott": true` on the project to say so out loud.
- fewer than 0.055 bytes per pixel — heavier recompression than any camera produces. Four images
  trip it, worst `duna-hajok-6-1-cabin/22` at 0.032.

These are signals, not proof, which is why the second group warns. The build prints warnings
**grouped by kind with two examples each**, not as ninety-one lines; the full list lives in the
matrix. Ninety-one lines every build is the same as none.

### 3.4 The encoder has nothing left — measured, not assumed

Phase 5 asserted the Fleet's 197 KB LCP frame could not be encoded smaller. Phase 6 tested it:

| Setting | Size |
|---|---|
| q36, effort 4 (current) | 196.6 KB |
| q36, effort 7 | 198.2 KB |
| q36, effort 9 | 198.8 KB |
| q36, effort 4, chroma 4:2:0 | 189.9 KB |
| q46, effort 4 | 267.9 KB |

Higher effort makes it *larger*. 4:2:0 saves 3.4 % and costs colour fidelity on lacquered mahogany.
Phase 5 was right and the claim is now backed by numbers. **The remaining fix is a photograph.**

---

## 4. Quality Validation

`build.mjs` step **2/e**. Every master gets one metadata read (371 header parses, ~0.4 s), then:

- format, colour space, aspect ratio, source-chain signals — all images
- resolution against the minimum — **by role**

Roles are computed once, in `scripts/forras-modell.mjs`, from `terek.json` / `flotta.json` /
`keszules.json` / `projektek.json`. Nine roles; five are marked critical in `data/forras.json`:

| Role | Critical | Meaning |
|---|---|---|
| `szint1-nezopont` | ✔ | a Level 1 camera position, full bleed, layered |
| `fooldal-jelenet` | ✔ | a homepage cinematic frame |
| `flotta-nyitas` | ✔ | a Fleet opening frame |
| `keszules-nyitas` | ✔ | a Making opening frame |
| `keszules-muhely` | ✔ | the Making's closing workshop frame |
| `fooldal-metszet`, `keszules-lemez`, `flotta-borito`, `projekt-borito` | | sized, not full bleed |

**A critical image below the minimum stops the build.** It can only pass with a named waiver under
`data/forras.json` → `kepek` → `<key>` → `mentesseg`, which requires a reason, a status and the
sentence describing what would resolve it. This is the difference between *we know, and it is
written down* and *nobody noticed*.

Verified by removing the workshop frame's waiver:

```
!! HIBA — a mesterképek nem felelnek meg a data/forras.json szabályának:
  meyer-motorcsonak-2/05.jpg: 1029×730 (0.75 MP) — a küszöb 1.5 MP / 1400 px. Szerep: keszules-muhely.
     Ez KRITIKUS szerep. Vagy jobb mester kell, vagy egy névre szóló, indokolt felmentés …
```

The reverse is checked too: a waiver on an image that now passes, or that has no critical role, is
reported as stale and removable. Waivers cannot quietly outlive their reason.

### One duplication removed

The `GYORS` set (which images get AVIF/WebP) used to walk the same five data structures as the
validator, separately, by hand — and needed manual extension for every new chapter. It is now
`new Set(SZEREP.keys())`. Verified byte-identical: the rebuild after the change re-encoded **0**
derivatives.

---

## 5. Room Data Model

`data/terek.json` remains the only home for spatial metadata, for the reason Phase 3 gave: `admin.js`
cleans `projektek.json` to a fixed field list on save, so anything added there would be silently
dropped by the next client edit.

`build.mjs` step **2/f** validates every `szint: 1` room and prints failures as a table, in the
format Phase 6 specified:

```
  PROJEKT                KAMERA                 MEZŐ             VÁRT                              TALÁLT
  ---------------------  ---------------------  ---------------  --------------------------------  -------------------
  duna-cruises-hableany  nyitott-szalon/orr     kuszob.fajta     ajto | ablak | kapu               nincs mező
  duna-cruises-hableany  nyitott-szalon/orr     melyseg.z        { kozel, koz, tav } — három szám  {"kozel":1}
  duna-cruises-hableany  nyitott-szalon/orr     melyseg.bizalom  szerzoi | mert | becsult          kitalalt
  duna-cruises-hableany  zart-szalon/tat-ejjel  kapuk[0].cel     létező nézőpont ebben a térben    nezopont:nincsilyen
  bodajki-vadaszkastely  —                      hangulat.alap    nappal | aranyora | ejjel         hajnal
```

(That output is real — produced by deliberately corrupting `terek.json`, then restored.)

**Required** — project slug, at least one camera, materials, base time state, and per camera: id
(unique), name, image, threshold type, a four-number `nyilas` inside the frame with visible radii,
and a way out (a gate or a further camera; a room you cannot leave is a picture, not a room). Gate
targets are resolved: `nezopont:<id>` must exist in this room, `projekt:<slug>` must be published.

**Not required** — a depth map. Author-defined depth is the valid current state, not a placeholder.

---

## 6. Camera Position Model

Every field below is **optional and unused today**, and validated the moment it appears. No room
declares any of them: HABLEÁNY's five existing positions remain authoritative, and a camera's real
position must be *measured* off a photograph, not guessed.

| Field | Shape | Purpose |
|---|---|---|
| `id` | string, unique in room | camera identity *(already required)* |
| `sorrend` | number | traversal order |
| `kep` | filename | the frame *(already required)* |
| `allas` | `{ x, y, z }` metres from room origin | real position |
| `irany` | `{ azimut 0–360, emelkedes -90–90 }` degrees | orientation |
| `atmenet` | `kuszob \| vagas \| uszas` | how we arrive |
| `szomszed` | `[camera id, …]` | adjacency, resolved against this room |
| `vagas.mobil` / `vagas.asztali` | `[x, y, w, h]` 0–1 | per-aspect crop |
| `kuszob.fajta` | `ajto \| ablak \| kapu` | threshold type *(already required)* |

The point is that a future room **cannot be authored wrongly in silence**. Consuming `vagas`,
`allas` and `irany` is Phase 7 work; declaring them correctly is possible today.

---

## 7. Depth Authoring

### 7.1 What exists

Three CSS layers cut from one photograph, masked by a hand-placed four-number aperture
(`nyilas: [x, y, rx, ry]`) read off the frame itself. Parallax comes from three global tokens in
`rendszer.css`. This is **author-defined depth, and it is the current valid state** — not a
temporary stand-in.

### 7.2 What Phase 6 added

`nezopont.melyseg`, optional:

```jsonc
"melyseg": {
  "z":       { "kozel": 1.6, "koz": 1.1, "tav": 1.0 },  // MULTIPLIER on the global parallax
  "bizalom": "szerzoi",        // szerzoi | mert | becsult
  "terkep":  "orr-melyseg.png",// file under img/melyseg/<slug>/ — no such file, no renderer
  "fokusz":  [0.62, 0.44]      // the sharp point of the frame
}
```

**`z` is a multiplier, not an absolute value, and that is a correctness decision, not a style one.**
The motion budget lives in `rendszer.css`, and `@media (prefers-reduced-motion: reduce)` zeroes it
there. An inline absolute value would beat the media query and silently restore motion for someone
who switched it off. A multiplier times zero is still zero. `ter.css` reads
`var(--melyseg-kozel, 1)`; the build emits the custom properties **only** when a viewpoint declares
them, so today the markup is byte-identical to Phase 5's.

`terkep` and `fokusz` are validated but not emitted — an attribute nothing reads would ship on every
page for nothing. The build does check that a declared depth-map file exists.

### 7.3 What was deliberately not built

No ML inference, no automatic depth estimation, no WebGL renderer, no GPU pipeline, no new
dependency. The 2.5D CSS implementation is unchanged.

---

## 8. Workshop Ingestion

`scripts/muhely-atvetel.mjs` — `npm run muhely -- <folder> [--bemasol]`. This is the phase's
success criterion made executable.

### 8.1 Folder convention

```
atvetel/<YYYY-MM-DD>-<topic>/
  atvetel.json          the delivery note
  kepek/                the masters, nothing else
```

Filename: `<number>-<type-in-lowercase>[-<variant>].<ext>` — `01-workshop-wide.jpg`,
`07-hand-material-b.jpg`, `12-day-night-ejjel.jpg`.

`atvetel/` is git-ignored: it is a staging area. Masters become versioned when `--bemasol` copies
them into `img/projektek/<slug>/`.

### 8.2 The delivery note

Required: `fotos`, `datum` (YYYY-MM-DD), `helyszin`, `jogok`, `celProjekt`, and a `kepek` object
keyed by filename. Per image, required: `tipus`, `alt`. Optional: `idoallapot`, `allasId`, `nyilas`,
`emberek`, `vizjel`, `datumbelyeg`.

### 8.3 The twelve shot types

All twelve from Phase 5 §15.2 are recognised. **None is mandatory** — the tool reports what is
missing and does not fail for it. Three are *depth-critical* (3000 px, and a real opening in frame,
because a frame with nothing to look through cannot become a threshold): `WORKSHOP_WIDE`,
`OBJECT_SPACE`, `DAY_NIGHT`.

### 8.4 What it refuses

Verified against a synthetic delivery:

```
HIBA (5) — ezek nélkül nem vehető át
  ! 03-joinery.jpg: 900×1201 (1.08 MP) — a MINIMUM 1.5 MP / 1400 px. Használhatatlan.
  ! 03-joinery.jpg: az alt gépi címkének látszik ("kotes"). Írja le, MI LÁTSZIK a képen…
  ! 05-people-working.webp: WEBP mester. Ez a MI kimeneti formátumunk — …
  ! 05-people-working.webp: felismerhető embert mutat, és az atvetel.json nem igazol modellszerződést.
```

and, once corrected:

```
AMI MEGVAN
  + NAPPAL → ÉJJEL KAPU lehetséges 1 álláson:
     csarnok-1: nappal → ejjel — 3200×2133
==================================================================
READY — a leadás átvehető.
```

`--bemasol` copies masters into `img/projektek/<slug>/` with sequential names, writes a
`bemasolva.json` log, and **prints** the JSON to paste into `projektek.json` and `forras.json`. It
does not write those files: `projektek.json` is the client's surface, and no script edits it.

---

## 9. Day / Night Capability

The vocabulary is now three-valued: **`nappal` · `aranyora` · `ejjel`**, enforced by the room
validator and named by `ter.js` (previously anything not `ejjel` displayed as "Nappal", so a golden
hour frame would have been labelled wrong).

`aranyora` appears on **zero** frames today. The vocabulary exists so that when a locked-off tripod
series arrives, no code and no structure has to change.

The ingestion tool groups frames by `allasId` and reports the capability directly. It also refuses
to promise a KAPU when the frames do not actually align:

```
~ csarnok-1: 2 napszak, de ELTÉRŐ képméret (3200×2133 / 2400×1600).
  A KAPU csak akkor illeszkedik, ha az állvány nem mozdult és a vágás azonos.
```

No day → night transition was built. HABLEÁNY's existing day/night pair is two *different* camera
positions, not one position at two times; using it would fake the thing the mechanism is for.

---

## 10. Content Matrix

`npm run tartalom` → `docs/tartalom.json` (machine) + `docs/TARTALOM.md` (readable). Generated, never
hand-maintained — a hand-kept list lies by the third image swap. It imports the same
`scripts/forras-modell.mjs` the build uses, so the report and the gate cannot drift.

Per image it records PROJECT · ROOM · IMAGE · RESOLUTION · BYTES/PIXEL · ROLE · CRITICAL · BELOW
THRESHOLD · WAIVER · RIGHTS · WATERMARK · DATE STAMP · PEOPLE · ALT · COPY · DEPTH · CAMERA ·
MASTER · STATUS.

Current state:

| Status | Images |
|---|---|
| ARCHIVE_ONLY | 149 |
| READY | 99 |
| NEEDS_COPY | 50 |
| NEEDS_MASTER | 40 |
| NEEDS_RIGHTS | 33 |

Plus, separately, because they are not properties of a file that exists: **8 missing Making
stations** (`NEEDS_PHOTOGRAPHY`) and **11 of 12 workshop shot types absent**.

One deliberate scoping decision: a project's missing `leiras` does **not** demote its images to
`NEEDS_COPY`. With 30 empty descriptions every image would be `NEEDS_COPY` and the matrix would show
zero READY rows — true, and useless. Text is a project-level fact and the project table states it.

---

## 11. Performance

All figures are gzip −9 for HTML/CSS/JS plus bytes on disk for fonts and images, measured from a
cold browser cache at 1440 × 900 and 390 × 844.

| Route | Phase 3–5 | **Phase 6** | Budget |
|---|---|---|---|
| Homepage, desktop | 231.0 | **167.0** | ≤ 300 ✅ |
| Homepage, mobile | — | **153.2** | ≤ 300 ✅ |
| **Fleet, desktop** | 409.2 | **342.9** | ≤ 350 ✅ *(first time)* |
| Fleet, mobile | 282.8 | **213.0** | ≤ 300 ✅ |
| Making, desktop | 312.2 | **247.1** | ≤ 350 ✅ |
| Making, mobile | 257.9 | **189.3** | ≤ 300 ✅ |
| Level 1 room, desktop | 346.1 | **262.9** | ≤ 350 ✅ |

Requests on the Fleet: 26 → 22.

### 11.1 Where it came from

**Fonts, −54.5 KB on every route** (§12). The single largest win of the phase, and it hits the
homepage, the Fleet, the Making, every room and every archive page at once.

**Level 1 rooms, −278 KB.** The room page was measured at **541.1 KB**, not the 346.1 KB Phase 3
recorded — because the project gallery's first three images carried `loading="eager"` with no
`srcset` and no dimensions. On an ordinary project page that is right: the gallery *is* the top of
the page. On a traversable room the gallery sits below the spatial stage, so three 800 px JPEGs
(283 KB) were downloaded for photographs nobody sees above the fold. Eager now applies only to the
first image, and only where there is no room. Dimensions were also missing entirely, so the page
shifted while loading.

**Brand images, −8.6 KB on every route.** The mandatory EU information block (KTK 2020) was a
13.9 KB PNG shown at 232 px; it is now AVIF/WebP at 232 and 464 px (3.6 KB served), PNG retained as
fallback, source untouched. The favicon was a 61 × 61 RGBA PNG at 5.1 KB, requested by all 44 pages;
palette quantisation takes it to 1.99 KB with the same drawing. The source file is unchanged — the
build overwrites the copy in `deploy/`, so the filename and all fourteen `<link rel="icon">` lines
stay as they are.

### 11.2 What was investigated and rejected

- **AVIF encoder settings** (§3.4) — nothing left.
- **A `-600` derivative step.** Phase 4 §19.13 suggested it for the plan's wider cells. The `-400`
  rollout addressed the larger case (galleries); a further step is 371 more encodes for a partial
  win on one grid. Not done.
- **Extracting scene typography into a fourth stylesheet** — it would add a render-blocking request
  to exactly the three most important pages. It went into `rendszer.css` instead (§18).

### 11.3 One measurement artefact, recorded so it is not re-discovered

At 390 px the Fleet appeared to fetch *both* `01-800.avif` and `01-1400.avif`. It does not. Chrome
prefers an already-cached larger `srcset` candidate, and the 1400 px file was warm from a previous
desktop visit. From a genuinely cold cache at 390 px, only `-800` is fetched. Verified by closing
the browser context and re-measuring.

---

## 12. Typography Budget

**125.8 KB → 71.3 KB served (70.1 KB on the homepage, which does not need the italic Latin-Extended
slice). Target was ≤ 90 KB. No weight was dropped and nothing looks different.**

### 12.1 What was actually wrong

The five faces were shipped as ten woff2 slices. Hashing them showed:

```
archivo-400-latin.woff2            == archivo-500-latin.woff2              (md5 0c2d62e6…)
archivo-400-latin-ext.woff2        == archivo-500-latin-ext.woff2
cormorant-garamond-300-latin.woff2 == cormorant-garamond-400-latin.woff2   (md5 fdd27f74…)
cormorant-garamond-300-latin-ext…  == cormorant-garamond-400-latin-ext…
```

Byte-identical, and identical in `fonts/forras/` too — so the duplication was in the download, not
the subsetting. Parsing the woff2 table directory explains why: both families carry
`fvar` / `gvar` / `avar` / `STAT`. **They are variable fonts, and Google Fonts returns the same file
for every weight of a family.** Browsers cache by URL, so all ten slices were downloaded — 54.5 KB
of them a second copy of a file already in memory, for no typographic gain whatsoever.

### 12.2 The fix

Four duplicate files deleted. The `@font-face` rules now declare weight *ranges* against the
surviving files — `font-weight: 400 500` for Archivo, `300 400` for upright Cormorant — and the
browser sets the variable `wght` axis. `scripts/betuk-metszes.mjs` now skips duplicate sources by
content hash, removes stale outputs, and says which file replaces which, so a naive re-run cannot
bring the problem back.

Filenames were **not** changed: sixteen `<link rel="preload">` lines point at them and a rename
would be pure risk. The number in the name is the low end of the range, and the file says so.

### 12.3 Verified in the browser, not assumed

Rendering the same string at each weight:

| Face | Rendered width @ 40 px |
|---|---|
| Archivo 400 | 514.76 px |
| Archivo 500 | **521.80 px** |
| Cormorant 300 | 460.73 px |
| Cormorant 400 | **462.13 px** |

Different widths mean the axis is genuinely interpolating, not falling back. Hungarian `ő`/`ű` render
from the Latin-Extended slices as before. Network on the homepage: **5 files, 71,792 bytes.**

### 12.4 The remaining budget, and why it stops here

Five typographic roles are in real use: Cormorant 300 (display) and 400 (editorial), Archivo 400
(body) and 500 (technical/UI), Cormorant 300 italic. All five are needed; three files serve them.
Going lower means dropping a role or dropping Latin-Extended — the second would break Hungarian
outright. **71.3 KB is the rational floor for this typography.**

---

## 13. Accessibility

Audited across PLAN · FLEET · MAKING · LIVING INTERIOR as one system.
`npm run ellenorzes` re-runs the static half over `deploy/`.

### 13.1 Fixed

| Issue | Where | Fix |
|---|---|---|
| Heading level skipped (h1 → h3) | `/alaprajz` | the plan's wing headings now follow the page level: h2 standalone, h3 in the overlay |
| Heading level skipped | `design-manufaktura.html` | three card titles h3 → h2, with a scoped rule keeping the *size* identical (25.6 px, measured before and after) |
| Heading level skipped | `adatkezelesi-tajekoztato.html` | first section h3 → h2; `.ceg-doboz` already sized both at 1.4 rem, so no visual change |
| Touch target 71 × **34** | mobile menu button, all 44 pages | `min-height: 44px` |
| Touch target 34 × 44 | Level 1 / chapter viewpoint indicators | 44 × 44; the visible hairline is drawn by `::before` and is unchanged |
| Touch target 16 px tall | footer link lists | 44 px under `@media (pointer: coarse)`; unchanged for mouse |
| Time state mislabelled | `ter.js` | three-value lookup, so `aranyora` will not announce as "Nappal" |

### 13.2 Verified working

- **Plan overlay dialog semantics** — on open, focus moves to the close button and 15 body-level
  siblings receive `inert`; Esc closes, `inert` is removed from all of them, and focus returns to
  the element that opened it (confirmed: `BUTTON · Alaprajz Esc`).
- **Deep link + register** — `/referenciak/duna-cruises-hableany/#tat-ejjel` loads the correct
  camera and applies the night register.
- Every route: exactly one `<h1>`, `lang="hu"`, `main#tartalom`, a skip link, `aria-current` present.
- No image without `alt`; no duplicate `id`; no unnamed `<button>`; every form field labelled.
- Reduced motion continues to zero the parallax tokens, and the new depth multiplier is a multiplier
  precisely so it cannot defeat that (§7.2).

### 13.3 Known, not fixed

Footer link targets are enlarged only under `pointer: coarse`. The rule was verified present and
correct via CSSOM; it could not be verified *rendering* in this harness, which reports
`pointer: fine`. It should be confirmed on a real handset before launch.

---

## 14. No-JS

**Closed this phase: the homepage section cut.** It was the last chapter whose content depended on
JavaScript. Previously the sticky one-plate-at-a-time layout was the *default* and six of seven
plates sat at `opacity: 0` without a script — the markup was complete but the page understated
itself.

Now the default is an ordinary vertical list, every plate with its full caption, and `fooldal.js`
opts into the sticky behaviour by setting `body[data-lemezek]` — and only when it has verified that
plates and markers match. This is the pattern Phase 5 introduced for the Making, now applied to the
homepage as Phase 5 §23 recommended. Confirmed by removing the flag: `position: static`, 7 of 7
plates visible.

Verified without JavaScript across all 44 pages by the audit:

- every route renders text, headings and navigation
- every route has ≥ 5 real `<a href>` links
- no route depends on `data-src` for all its images
- section cut, Making sequences, Fleet index, project pages and the plan all render their content

**Still degraded** — the homepage's and the Fleet's *opening frames* 2–6 ship with `hidden`. All the
text, the index and every link are present; the photographs are not. The Making no longer has this
problem. Applying the same treatment to the two openings is a Phase 7 item; it is a picture-count
issue, not a content-loss issue.

---

## 15. History

Audited across homepage, plan, Fleet, Making and rooms. The model is correct and unchanged; this
phase verified it rather than altering it.

| Surface | Behaviour |
|---|---|
| Rooms | **deliberate** moves (indicator, gate, next, keyboard) `pushState`; **scroll-driven** moves `replaceState`. No animation frame becomes a history entry. |
| Plan overlay | one `pushState('#alaprajz')`; Esc calls `history.back()` if it pushed, else `replaceState` to drop the hash. Room viewpoint writes are suppressed while the plan is open, so back cannot land in the wrong place. |
| Filter | `replaceState` only — a filter is a view, not a place. |
| Homepage / Fleet / Making | no history writes at all. Pure scroll; nothing to corrupt. |

Measured: open plan from a room → `history.length` 4 → 5, hash `#alaprajz`. Esc → length stays 5
(went back, did not push), hash back to `#tat-ejjel`, overlay closed, focus restored. Deep links
survive refresh.

---

## 16. SEO / Launch Readiness

### 16.1 Done this phase

**Canonical URLs on every route.** Phase 5 §22.14 listed this as a release blocker: two pages had
them, forty did not. Rather than hand-editing, the build now derives the canonical from each output
page's own path and injects it if absent — so the thirty generated project pages get one for free
and the forty-third route cannot be forgotten. An explicit canonical in the source is never
overwritten.

**Open Graph and Twitter card on every public route** — `og:type`, `og:site_name`, `og:locale`,
`og:url`, `og:title`, `og:description`, `og:image` (+ width, height, alt),
`twitter:card=summary_large_image`. Title and description come from the page's own tags; there is no
second copy to fall out of sync.

**A social image.** 1200 × 630, cropped by the build around a declared focal point from an existing
master — `bodajki-vadaszkastely/02`. It was the only candidate meeting all four conditions at once:
rights clear (so not Domus Collis), no watermark, no date stamp, above 2 MP, and showing interior
architecture *and* cabinetmaking in one frame. It is also the homepage's third scene, so the share
card says what the page says. 117 KB. Its alt text is read from `projektek.json` — not written twice.

**`admin.html` and `404.html` are excluded** from both, deliberately: neither is shareable content,
and the admin must not move.

**`data/` is no longer published wholesale.** Only `projektek.json` ships (`admin.js` loads it);
`terek.json`, `flotta.json`, `keszules.json`, `palyazatok.json`, `ceg-adatok.json` and `forras.json`
are build-time inputs. `forras.json` in particular carries internal judgements — which project is
awaiting rights clearance, which frames are watermarked — and has no business in a public directory.

### 16.2 Production checklist

| Item | State |
|---|---|
| `robots.txt` | ✔ present, `/admin.html` disallowed, sitemap referenced |
| `sitemap.xml` | ✔ 42 URLs, verified against the built page list in both directions |
| Canonical | ✔ all 42 public routes (44 pages − `admin.html` − `404.html`) |
| `<title>` / description | ✔ every route, all within length |
| Open Graph | ✔ every public route |
| Social image | ✔ `img/brand/kozossegi.jpg`, 1200 × 630 |
| Favicon | ✔ 1.99 KB |
| `lang="hu"` | ✔ every route |
| 404 | ✔ present, excluded from sitemap and OG |
| Trailing slash | ✔ project routes are directories with `index.html` |
| HTTPS | Cloudflare Pages; nothing to change in the repo |
| Analytics | GA id present in `ceg-adatok.json`, gated behind consent. **Nothing added.** |
| Staging references | ✔ none — no `localhost`, no `.pages.dev`, no local paths in any output |
| **`sajatDomainEl`** | **still `false`** — the whole site is `noindex`. Sixth phase carrying it. |

`sajatDomainEl` was **not** flipped: switching indexing on is the owner's decision and Phase 6 was
told not to do it automatically. The audit now checks the flag in both directions — it fails if the
flag is false and the site-wide `noindex` header is missing, and equally if the flag is true and the
header was left behind.

---

## 17. Security

`npm run ellenorzes` scans every built page and script for: `localhost`, `127.0.0.1`, `file:///`,
Windows paths, `.pages.dev`, `sourceMappingURL`, `console.log`/`debug`/`table`, and
`api_key|secret|password|token` assignments. **Result: clean.**

The reCAPTCHA **site** key is in the output and belongs there — it is the public half; the secret
lives in Cloudflare (`wrangler secret put RECAPTCHA_SECRET`) and never enters the repository.

**Authentication architecture untouched.** No change to `admin.js`, `admin.html`, `admin.css` or the
Worker.

**The admin is byte-identical** and this is now enforced rather than asserted. The audit reconstructs
the expected output from the source plus the two transformations the build is allowed to make —
`{{key}}` substitution and the `?v=` cache stamp — and fails on any other difference. `admin.css`
must match byte for byte. Confirmed: the only differences in `admin.html` are three cache stamps.

One tightening: internal metadata no longer ships (§16.1).

---

## 18. Visual Regression

No redesign. Phase 3 homepage, Phase 4 Fleet, Phase 5 Making and the Level 1 rooms were compared at
1440 × 900 and 390 × 844 for typography, spacing, colour, motion, header, buttons, plan, thresholds.

**Fixed — genuine regressions or long-standing defects:**

1. Gallery images had no `width`/`height` at all, so project pages shifted while loading.
2. Three touch targets below 44 px (§13.1).
3. Three heading-level skips (§13.1) — each fixed with the rendered size held constant.

**Changed by design, verified identical on screen:**

The scene typography that the homepage, the Fleet and the Making each carried a private copy of —
about 40 lines, three times — moved into `rendszer.css`. Phase 4 and Phase 5 both defended the
duplication (the three files never load together, so a homepage redesign cannot break a chapter);
Phase 5 §22.8 then said the third copy was the point to extract. It is extracted.

Only what all three shared moved. What differs stayed: the Fleet sets its own text right, the
homepage keeps its wider opening (40 rem) and turn sentence (44 rem) and its accent `tipo-muszaki`,
the Making keeps its 28 rem lede and its `tipo-adat`. Two colour rules that looked shareable were
deliberately left behind — not all three chapters use them inside scene text, and "obviously"
unifying them would have silently recoloured a line somewhere.

**Honestly, this costs bytes rather than saving them:** roughly +0.6 KB gzip on the eleven archive
pages and +0.25 KB on the three chapter pages. There is no home that reaches exactly those three
without adding a render-blocking request to them. It is a maintainability decision and the CSS says
so in place of a nicer story.

Screenshots confirm the homepage, Fleet and Making openings, the section cut with and without its
script, the footer with the new EU block, the room gallery and mobile Making are unchanged apart
from the fixes listed above.

---

## 19. Known Limitations

1. **No photograph in the archive reaches 3000 px.** Max long edge 2048. The depth-critical
   specification cannot be satisfied by any existing asset, only by new photography.
2. **One workshop photograph exists**, 0.75 MP, 2004, with a burnt-in date. Sixth phase saying it.
   It is now a build-enforced waiver rather than a paragraph.
3. **Hotel Domus Collis rights are still open**, and it carries four homepage scenes and a Level 1
   room. Fifth phase asking.
4. **`leiras` is empty for 30 / 30 projects.** Unchanged since Phase 0 and still the largest risk to
   the submission.
5. **104 alt texts are archive labels.** The matrix identifies them exactly; writing them is copy
   work and was not attempted here, because Phase 6's objectives (A–T) do not include it and 104
   fabricated descriptions would be worse than 104 honest gaps.
6. **The Fleet's LCP frame is 197 KB and cannot be encoded smaller** (§3.4). The route is inside
   budget anyway; a better photograph would give back 100 KB.
7. **The homepage and Fleet openings still fall back to one frame without JavaScript.** The Making
   does not. Same `data-lemezek` treatment would fix both; not done here.
8. **`aranyora` has no imagery.** The vocabulary is ready, the frames are not.
9. **No room declares `melyseg.z`, `allas`, `irany` or `vagas`.** By design: measured camera data
   must be measured. The validator means they cannot be added wrongly.
10. **`vagas`, `melyseg.terkep` and `melyseg.fokusz` are validated but not consumed.** Rendering them
    is Phase 7.
11. **Footer touch-target enlargement is unverified on a real handset** (§13.3).
12. **The `-400` rollout grows `deploy/` from 98 MB to 104 MB** and adds ~6 s to a cold build. Warm
    builds are unaffected.
13. **The header nav is eight items.** Unchanged from Phase 5 §22.10 and still a client decision.
14. **`sajatDomainEl` is `false`.** Sixth phase carrying it. It is now the last technical blocker to
    launch.
15. **Six frames appear in both the homepage section cut and the Making.** Unchanged; a shoot removes
    the need.
16. **The "harminc év" copy is 35 years old.** Client text, unchanged.

---

## 20. Required Real-World Content

In the order that unlocks the most:

| # | What | Unlocks |
|---|---|---|
| 1 | **The workshop, one day, 3000 px** — Phase 5 §15.2 shot 1, with a real opening in frame and people at work | the site's largest single gap; a Level 1 workshop room; the Making's closing frame; `WORKSHOP_WIDE`, `WORKBENCH`, `PEOPLE_WORKING` |
| 2 | **One locked-off tripod position, day + golden + night** | the DAY → NIGHT KAPU. The mechanism, the vocabulary and the checker are built; only the frames are missing |
| 3 | **Hotel Domus Collis rights, in writing** | four homepage scenes and a Level 1 room stop being `NEEDS_RIGHTS` |
| 4 | **Two hulls under construction, 3000 px, no watermark** | three of the five waivers; the Fleet at full quality; a `szint: 1` treatment for boatbuilding |
| 5 | **Thirty project descriptions** | 30 × `NEEDS_COPY` at project level |
| 6 | **104 image descriptions** | the remaining image-level `NEEDS_COPY` |
| 7 | **Model releases** for `szent-laszlo-…/06, 08` and `vatikani-diszdoboz/01, 02` | two `NEEDS_RIGHTS` projects |
| 8 | **The finishing department in use** | the missing station between *váz* and *felület*; two waivers |
| 9 | **Any boat interior other than HABLEÁNY / 6.1 / Rivális** | a second traversable vessel |

Items 1, 2, 4 and 8 are **one shoot**. `npm run muhely` will accept or reject it on delivery.

---

## 21. Phase 7 Recommendation

**Do not start Phase 7 until question 1 in §20 is answered.** That has been the top blocker for
three phases; Phase 6 removed every remaining excuse for not asking it, because the answer is now
the only thing standing between the archive and a new room.

### If the workshop can be photographed

**Phase 7 = THE WORKSHOP.** A fourth Level 1 room, entered from the Making. It should be a
`terek.json` entry, a `forras.json` entry and new masters — **no new frontend project**. If it turns
out to need one, Phase 6 failed and the phase should stop and say so.

Then, in order:
1. Consume `melyseg.terkep` if camera masters arrive with depth data — the data model is ready and
   the 2.5D renderer stays the default.
2. Build the DAY → NIGHT KAPU on the aligned tripod series.
3. Apply `data-lemezek` to the homepage and Fleet openings, closing the last no-JS gap.

### If it cannot

**Phase 7 = COPY AND LAUNCH.** Nothing else in the archive supports another chapter, and a fifth
sequence from the same material would repeat the Fleet.
1. Thirty project descriptions and 104 image descriptions — the matrix lists them in priority order.
2. The About rewrite; Phase 5 §12 notes beats 03–05 need the shoot, so only 01, 02, 06, 07 today.
3. Flip `sajatDomainEl`, verify the site-wide `noindex` disappears (the audit checks both
   directions), confirm the footer touch targets on a handset, and launch.

### Either way

- Re-run `npm run tartalom` after any content change; it is the only trustworthy inventory.
- `npm run muhely` before accepting any delivery.
- `npm run ellenorzes` before any deploy.
- **`admin.*` stays byte-identical**, and the audit now enforces it rather than trusting it.

---

## Appendix — Changes made during Phase 6

**Created (6):**
`data/forras.json` · `scripts/forras-modell.mjs` · `scripts/tartalom-matrix.mjs` ·
`scripts/muhely-atvetel.mjs` · `scripts/ellenorzes.mjs` · `docs/PHASE-6-SOURCE-SYSTEM.md`
*(plus the generated `docs/TARTALOM.md` and `docs/tartalom.json`)*

**Modified (12):**
`build.mjs` (role computation §2/d, master validation §2/e, Level 1 room validation §2/f, the
`-400` derivative for every image, the gallery generator, the social image, canonical + Open Graph
injection, the EU block and favicon derivatives, the plan's wing heading level, `data/` publication
narrowed) ·
`fonts.css` (weight ranges) · `scripts/betuk-metszes.mjs` (duplicate-source skip) ·
`rendszer.css` (shared scene typography) · `fooldal.css`, `flotta.css`, `keszules.css` (their copies
removed; no-JS section cut) · `fooldal.js` (`data-lemezek`) · `ter.js` (three-value time state) ·
`ter.css` (depth multiplier, 44 × 44 indicator) · `style.css` (menu button, footer targets, card
heading size) · `partials/lablec.html` (EU block `<picture>`) ·
`design-manufaktura.html`, `adatkezelesi-tajekoztato.html` (heading levels) ·
`data/terek.json` (**`$sema` documentation only** — no room data changed) ·
`package.json` (four scripts) · `.gitignore` (`atvetel/`)

**Deleted (4):** `fonts/archivo-500-latin.woff2`, `fonts/archivo-500-latin-ext.woff2`,
`fonts/cormorant-garamond-400-latin.woff2`, `fonts/cormorant-garamond-400-latin-ext.woff2` — each
byte-identical to a file that remains.

**Not modified:** `admin.html`, `admin.js`, `admin.css`, the Worker, `data/projektek.json`,
`data/ceg-adatok.json`, `data/flotta.json`, `data/keszules.json`, `data/palyazatok.json`,
`kuszob.js`, `terv.js`, `flotta.js`, `keszules.js`, `script.js`, `consent.js`, `szuro.js`,
`galeria.js`, `urlap.js`, `terv.css`, `partials/projekt-sablon.html`, `partials/ter-sablon.html`,
`partials/fejlec.html`, `robots.txt`.

**Assets:** no source photograph was resized, recompressed, renamed or deleted. New *derivatives*
only: `-400` JPEG for 283 previously non-priority images, the EU block at two sizes in two formats,
a re-encoded favicon in `deploy/`, and the 1200 × 630 social image.

**Dependencies:** none added.

**Routes:** unchanged. 44 pages, sitemap 42.
