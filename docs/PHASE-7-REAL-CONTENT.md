# DUNA — THE LIVING INTERIOR
# PHASE 7 — REAL CONTENT / THE LIVING INTERIOR EXPANSION

Phase 7 opened with a gate, and the gate answered **C**: there is no workshop shoot, and there are
no new masters. Under Phase 6 §21 that makes this phase **COPY AND LAUNCH**, not THE WORKSHOP.

Two sentences summarise it:

1. **The site's two remaining content gaps are closed.** 30 / 30 project descriptions and 104 / 104
   image descriptions are written — from the photographs themselves, not from imagination. The
   content matrix now reports `NEEDS_COPY: 0`.
2. **Looking at all 104 images found three things the archive audit had wrong**, and the site now
   says something different in four places because of it: two projects are 100 % renderings and were
   not recorded as such, two more carry a watermark that was not recorded, and one watermark
   record was a misreading of a photographed sign.

No new room was built. No new chapter, no new interaction model, no new navigation layer. That is
the correct outcome for branch C, and the rest of this document is the evidence.

---

## 1. Content Gate Result

Run before any code was touched:

```
npm run tartalom   → 371 masters · 104 machine labels · 30 / 30 projects without text · 8 missing stations
npm run muhely     → prints usage; there is no atvetel/ folder to hand it
npm run ellenorzes → 44 pages, 6 notices, KIMEHET
```

| Condition | Evidence | Verdict |
|---|---|---|
| A — workshop shoot + masters available | `atvetel/` does not exist; 11 of 12 shot types still at 0 | ✗ |
| B — partial content available | no new master arrived; `371` masters, identical set to Phase 6 | ✗ |
| **C — workshop shoot not available** | `WORKSHOP_WIDE: 1` (the 2004 archive frame), everything else 0; `≥ 3000 px: 0 / 371` | **✓** |

**Branch C.** Per the brief: complete the strongest existing rooms, finish legitimate copy, finish
legitimate alt text, resolve rights, improve room depth where masters permit, verify every
experience, prepare the remaining asset list, stop.

---

## 2. Workshop Shoot Status

**Not photographed.** Seventh phase recording it.

The archive still contains exactly **one** workshop photograph — `meyer-motorcsonak-2/05.jpg`,
1029 × 730 (0.75 MP), with a burnt-in camera date. It carries the Making's closing frame under a
named waiver in `data/forras.json`, and the build still refuses to forget it.

Nothing was invented in its place. No workshop room, no workshop sequence, no team story, no
fabricated section-cut stage. `npm run muhely` was run and reported only its own usage, because
there was nothing to hand it.

---

## 3. Master Assets

**New masters this phase: 0.**

Not one photograph was added, resized, recompressed, renamed or deleted. The measured set is
byte-identical to Phase 6:

| | Phase 6 | Phase 7 |
|---|---|---|
| Masters | 371 | **371** |
| At or above 3000 px long edge | 0 | **0** |
| Longest edge in the archive | 2048 px | **2048 px** |
| Below the 1.5 MP minimum | 224 | 224 |
| Critical role, below minimum | 5 (all waived) | 5 (all waived) |

Derivative counts are unchanged too: `1113 JPEG + 528 AVIF/WebP, 0 re-encoded` on the final build.

---

## 4. Rights Status

Rights were treated as a hard gate. **No image changed its permitted use this phase.**

### 4.1 Hotel Domus Collis — still open, still unchanged

`jogok: "tisztazando"`, `eredet: "kulso-fotos"`, `allapot: "NEEDS_RIGHTS"`. It carries four homepage
scenes and a Level 1 room, exactly as it did in Phase 6.

The brief's warning was followed literally: *"it was already on the website" does not mean "it is
cleared for a new use."* Domus Collis therefore received **no new immersive presentation** — no new
camera position, no depth authoring, no promotion, no new full-bleed placement. It received exactly
what every other project received: a written description and truthful alt text on assets already in
use. Nothing was substituted for the missing rights: no stock, no AI imagery, no altered frames, no
screenshots, no watermark removal.

**This remains an external decision and is the single largest rights blocker.**

### 4.2 Model releases — unchanged

`szent-laszlo-…/06, 08` and `vatikani-diszdoboz/01, 02` show recognisable people without confirmed
permission. Their editorial exclusions from the Making page stand. The written descriptions for both
projects describe what the images show without naming or characterising anyone.

### 4.3 Three rights-relevant facts the audit did not have

Found by opening all 104 undescribed masters at full size. All three are recorded in
`data/forras.json` with the reasoning, and all three flow automatically into the matrix:

| Project | Finding | Consequence |
|---|---|---|
| `csaladi-haz` | **100 % renderings**, not photographs. Every one of the 14 also carries a burnt-in disclaimer: *"A látványterven megjelenített termékek nem minden esetben egyeznek meg a költségvetésben szereplő termékekkel."* Plus a `Duna Enterior` watermark. Phase 6 §1.4's CGI list did not include it. | `eredet: latvanyterv` → `ARCHIVE_ONLY`; page wording changed (§14.3) |
| `budai-haz` | **100 % renderings**, watermarked. Also absent from the CGI list. | as above |
| `belvarosban-nyugalomban`, `domus-pellegrini-…` | `Duna Enterior` watermark on every frame; not previously recorded | `ARCHIVE_ONLY` |
| `mercedes-plato` | **The recorded `Duna HAJÓK` watermark is wrong.** At full resolution the mark on `05` is the workshop's own sign photographed *through the car's rear window*, and on `07` it is on the building's facade. Compare `boesch-640-de-luxe/13`, where the semi-transparent overlay is unmistakable. These are 1.71–2.05 MP modern photographs, not 2000s archive frames. | watermark record removed, with the comparison written down |

The renderings matter for truthfulness, not only for bookkeeping: a rendering shown as a photograph
is a claim that the work was built.

---

## 5. HABLEÁNY

**No upgrade was possible, and none was faked.**

The brief conditions the definitive pass on *"if appropriate high-resolution masters now exist"*.
They do not. HABLEÁNY's five camera positions run on 1600 × 1070 – 1600 × 1200 masters; the
depth-critical specification is 3000 px. The room is therefore unchanged: same five positions, same
author-defined depth, same day/night pair, same URL.

**`/referenciak/hableany/` — the brief names this URL; the repository's actual URL is
`/referenciak/duna-cruises-hableany/`, matching the project slug.** It was not changed. Renaming a
live route to match a document would break every deep link for the sake of a footnote.

What HABLEÁNY did gain this phase:

- a written project description, which the room's data sheet renders as its lead paragraph
  (verified in the browser: the sheet now opens with the description instead of an empty block);
- a no-JS fallback listing all five viewpoints as real photographs with captions (§20).

Verified working after the change: deep link `#tat-ejjel` loads the night register (`Idő: Éjjel`),
indicator navigation steps `#orr → #tat → #tat-ejjel` with `pushState`, the plan overlay opens with
focus on its close button and 14 `inert` siblings, Esc returns without adding a history entry.

---

## 6. Domus Collis

**Rights not cleared → not promoted, not touched.** See §4.1.

It remains a Level 1 room exactly as Phase 3 built it, because removing an existing presentation
would be a different decision from the one the owner has been asked to make. What it did *not*
receive is any new use. If rights arrive it will be evaluated against the same ten criteria as any
other candidate.

---

## 7. Bodajki

**Left exactly as it is: a Level 1 room, unchanged.**

It was re-examined against the room quality bar rather than assumed. It passes on resolution
(1800 × 1200, the archive's joint best), on rights (own archive, no watermark, no people), and on
its three real camera positions. It is not *improvable* without new photography: its three positions
are the only three that exist, so a fourth cannot be authored.

**No room-count target was pursued.** The site has three Level 1 rooms because three spaces support
them, not because a plan asked for three.

---

## 8. Workshop

There is no workshop chapter, no workshop room and no workshop sequence, because there is no
workshop photography. The Making page continues to say so in its own words, and the content matrix
continues to list the eight missing stations by name.

`npm run muhely` remains ready. The moment a delivery folder exists it will accept or reject it
against the same rules, and this phase changed none of them.

---

## 9. A Készülés

**Unchanged. Four sequences, no fifth.**

The brief permits a fifth sequence only if it *"reveals a genuinely new relationship."* The archive
offers no new relationship — only the same frames at the same resolutions. Adding a fifth sequence
from existing material would have repeated the Fleet, which Phase 6 §21 predicted and warned
against.

The eight missing stations (`elmeny` ×4, `kez` ×2, `anyag`, `ter`) are still eight, still named,
still `NEEDS_PHOTOGRAPHY`. The page states the gap rather than filling it.

The Making's opening frames did gain the no-JS fallback (§20).

---

## 10. Section Cut

**Unchanged.** The reusable plate system is a core component and was not modified.

No new chain was assembled, because no new stage was documented. The interface's ability to say
*"ÉLMÉNY — nincs dokumentálva"* is precisely why nothing needed to be invented: the honest statement
already exists and is already rendered.

---

## 11. Homepage

**The choreography is untouched.** Seven acts, thirteen frames, in the same order:

```
already inside → threshold → three trades → HABLEÁNY → boat revelation → section cut → plan → DUNA gate
```

No scene was added. No new material earned a position, because no new material arrived.

Two changes reached the homepage, both textual or structural rather than choreographic:

1. The hero statistic label `Fotó 371` became **`Kép 371`**. 51 of the 371 masters are renderings
   (`zirci-apatsag` 10, `csaladi-haz` 14, `budai-haz` 12, `kristaly-etterem` 10, `garzon-plaza-hotel`
   5), so "371 photographs" was not true. One word, and the number stops overclaiming.
2. A `<noscript>` list of all thirteen frames (§20).

Verified after the change at 1440 × 900: the sticky stage steps normally, 12 of 13 frames hidden by
`ter.js`, 79 images in the DOM — the same 79 as before.

---

## 12. Plan

**Not touched.** No hard-coded category was drawn, no featured geometry invented.

The plan reads the same data model it always did, and the data model changed only in ways it already
understood. Nothing about form-versus-ranking needed restating: no project changed form.

`/alaprajz` measured byte-identical before and after (6207 B gzip, 47 443 B raw) — the copy work does
not reach it, which is correct: the plan shows structure, not text.

---

## 13. Fleet

**Not redesigned. No boat added.**

No new boat content qualified: no new masters, no new metadata, no new rights clearance. The Fleet
remains a record of making and movement, and the fifteen boats are the fifteen boats.

All fifteen boat projects received written descriptions. Several of them say plainly what the Fleet
has always implied but never wrote down — for example `bojan-harcos`:

> Three photographs survive, all in the same place: on a trailer, on a grassy plot. There is no
> photograph of the building, and none of the boat on the water.

That is the Fleet's own principle in the project's own words.

---

## 14. Copy

**30 / 30 written. `Projekt szöveg (leiras) nélkül: 0 / 30`.**

### 14.1 Method

Every description was written from evidence in the repository: the photographs themselves (all 104
previously undescribed masters were opened and examined; the other 267 were read through their
existing descriptions), the project's own category and external link, and the recorded facts in
`data/forras.json`.

**Nothing was invented.** No date, no material name that is not visible, no client, no location, no
authorship, no dimension, no chronology. Where the archive is silent the text says so. Twenty-two of
the thirty descriptions end on an explicit absence, in the project's own terms:

- *"A műhelyben töltött időről — az anyagról és a faragásról — nincs felvétel."* (`szent-laszlo-…`)
- *"Az építés folyamata nincs dokumentálva."* (`duna-hajok-6-1-kadet`)
- *"Arról nincs adat, hogy a terv megépült-e."* (all four rendering-only projects)
- *"Maga a faragás közben nem készült fénykép."* (`fafaragasok`)

### 14.2 What the descriptions are not

They are not marketing. There is no "prémium", no "egyedülálló", no "díjnyertes", no adjective the
photograph does not support. A description answers four questions: what is visible, what the object
or space is, what is documented, and what is not known.

### 14.3 One consequence: renderings stop being called photographs

Every project page carried `N fotó a munkáról` and a data label `Fotó`. For the four
rendering-only projects that was false twice over — they are not photographs, and they do not show
that work happened. The word now comes from the source, not the template
(`build.mjs → kepSzavak()`), driven by `forras.json → eredet: latvanyterv`:

| Project | Before | After |
|---|---|---|
| `csaladi-haz` | Fotó · "14 fotó a munkáról." | **Látványterv · "14 látványterv a tervről."** |
| `budai-haz` | Fotó · "12 fotó a munkáról." | **Látványterv · "12 látványterv a tervről."** |
| `zirci-apatsag` | Fotó · "10 fotó a munkáról." | **Látványterv · "10 látványterv a tervről."** |
| `kristaly-etterem` | Fotó · "10 fotó a munkáról." | **Látványterv · "10 látványterv a tervről."** |
| every other project | Fotó · "N fotó a munkáról." | unchanged |

The page `<meta name="description">` follows the same rule. Verified on all six sampled projects.

### 14.4 Where the text appears

`leiras` renders in two places, both verified in the browser: the project page's *A projektről*
section, and — for Level 1 rooms — the data sheet's lead paragraph, where an empty block previously
sat.

---

## 15. Alt Text

**104 / 104 written. `Gépi címke alt helyett: 0`. Total: 371 / 371 written descriptions.**

Every one of the 104 images was looked at. They were rendered as labelled contact sheets (six per
sheet at 780 px per cell) so that each frame could be described from what it actually shows.

| Project | Images | What they turned out to be |
|---|---|---|
| `fuzio-a-tajjal` | 20 | photographs of the finished house, lake at the end of the plot |
| `belvarosban-nyugalomban` | 15 | photographs of a finished flat, watermarked |
| `csaladi-haz` | 14 | **renderings**, disclaimer burnt in |
| `budai-haz` | 12 | **renderings** |
| `kristaly-etterem` | 10 | **renderings** (already recorded) |
| `zirci-apatsag` | 10 | **renderings** (already recorded) |
| `mercedes-plato` | 10 | photographs of a finished wooden pickup bed |
| `ottevenyi-kastely` | 8 | photographs of the finished halls and cellar bar |
| `domus-pellegrini-…` | 5 | photographs of finished guest rooms, watermarked |

Every rendering's description now begins with the word **`Látványterv:`**. A reader — including a
screen-reader user, who previously received the string
`Duna-Enterior-Asztalos-es-Hajoepito-uzem-csaladi-haz-referencia-007` — is told what kind of image it
is before being told what is in it.

The descriptions answer *what · where · relation · action*. There is no keyword stuffing, no "luxury
interior", no "award-winning". Where a material could not be confirmed from the frame the text says
"sötét fa", not a species name.

---

## 16. Depth Maps

**No depth map was created, and that is a measured decision, not an omission.**

The declared rule in `data/forras.json → mester.melysegKritikus` is 6.0 MP / 3000 px. Measured
against the three Level 1 rooms:

| Room | Camera positions | Master resolution | Longest edge | Depth-critical? |
|---|---|---|---|---|
| `duna-cruises-hableany` | 5 | 1.71 – 1.92 MP | 1600 px | ✗ |
| `hotel-domus-collis` | 5 | 1.50 – 2.43 MP | 1800 px | ✗ (and rights open) |
| `bodajki-vadaszkastely` | 3 | 2.16 MP | 1800 px | ✗ |

Not one frame reaches half the required long edge. A measured depth map derived from a 1600 px
source would be a measurement of nothing — it would carry the *authority* of `bizalom: "mert"` with
the *content* of a guess, which is worse than the honest author-defined depth already in place.

`melyseg.z` (the author-defined multiplier) was likewise **not** authored. It is available and the
build already emits it, but a per-viewpoint parallax multiplier can only be judged in motion, and
tuning it blind would be decoration presented as depth authoring. Author-defined depth remains the
valid current state, exactly as Phase 6 §7.1 stated.

`depthSource` / `depthConfidence` / `depthMap` (`melyseg.bizalom` / `melyseg.terkep`) therefore
remain declared, validated, and unused. The fallback to author-defined depth is not a fallback
today — it is the only mode.

---

## 17. Camera Positions

**Unchanged: 5 + 5 + 3 = 13 real camera positions across three rooms.**

No position was added, because a camera position is a photograph and no photograph arrived. No
`allas`, `irany`, `sorrend`, `szomszed` or `vagas` was declared, for the reason Phase 6 §6 gave and
this phase re-confirmed: a camera's real position must be measured off the frame, not guessed.

`vagas` (per-aspect crop) was re-examined specifically, since Phase 6 §19.10 listed consuming it as
Phase 7 work. Measured at 390 × 844, the rooms' existing `object-fit` crop is spatially coherent —
the HABLEÁNY salon keeps its pillars, window band and table in frame, and all controls stay inside
the viewport at 44 × 44. **There is no crop to fix, so no crop was authored.** Building a consumer
for data that no frame needs would have added a code path with no caller.

---

## 18. Performance

Measured as gzip −9 over the built HTML, plus the gzip −9 delta on `rendszer.css`, the only
stylesheet that changed. Image bytes, font bytes and request counts are unchanged.

### 18.1 HTML, before and after (gzip −9, bytes)

| Route | Before Phase 7 | After | Δ |
|---|---|---|---|
| `index.html` | 12 830 | 14 175 | **+1 345** |
| `flotta.html` | 12 102 | 12 909 | +807 |
| `keszules.html` | 13 807 | 14 254 | +447 |
| `alaprajz.html` | 6 208 | 6 207 | −1 |
| `referenciak/duna-cruises-hableany/` | 10 985 | 11 567 | +582 |
| `referenciak/hotel-domus-collis/` | 10 537 | 11 118 | +581 |
| `referenciak/bodajki-vadaszkastely/` | 9 763 | 10 234 | +471 |
| `referenciak/fuzio-a-tajjal/` | 4 377 | 5 451 | **+1 074** |
| `referenciak/csaladi-haz/` | 4 244 | 5 048 | +804 |
| `referenciak/garzon-plaza-hotel/` | 5 016 | 5 238 | +222 |

`rendszer.css`: 5 031 → **5 465** (+434) for the no-JS list styling.

### 18.2 Against the Phase 6 budgets

| Route | Phase 6 | **Phase 7** | Budget | |
|---|---|---|---|---|
| Homepage, desktop | 167.0 | **168.7** | ≤ 300 | ✅ |
| Homepage, mobile | 153.2 | **154.9** | ≤ 300 | ✅ |
| Fleet, desktop | 342.9 | **344.1** | ≤ 350 | ✅ |
| Fleet, mobile | 213.0 | **214.2** | ≤ 300 | ✅ |
| Making, desktop | 247.1 | **248.0** | ≤ 350 | ✅ |
| Making, mobile | 189.3 | **190.2** | ≤ 300 | ✅ |
| Level 1 room, desktop | 262.9 | **263.9** | ≤ 350 | ✅ |

**Requests: unchanged. LCP frame: unchanged. CLS: unchanged** — nothing was added above the fold on
any route, and every added image carries `width`/`height`.

The `<noscript>` payload is bytes only: verified in the browser that with scripting enabled the
DOM contains **0** `.nojs-lista` elements and the same image count as before (homepage 79, HABLEÁNY
74). The browser never parses the block, so it costs no request and no decode.

**The Fleet is the route to watch.** At 344.1 KB it has 5.9 KB of headroom against 350, and Phase 6
already established that its 197 KB LCP frame cannot be encoded smaller. The next thing added to the
Fleet should be measured before it is written.

### 18.3 Where the growth came from

Roughly 55 % of it is the written copy itself — descriptions and 104 alt strings are text that must
ship. `fuzio-a-tajjal` is the clearest case: +1 074 B for one description and twenty image
descriptions on a page that had neither. That is not overhead; that is the content arriving.

---

## 19. Accessibility

`npm run ellenorzes` over all 44 built pages: **KIMEHET**, 6 notices, all of them the intentional
spatial-layer note. Manually verified in the browser beyond the static audit:

| Check | Result |
|---|---|
| Room keyboard + focus | Plan overlay opens with focus on its close button; 14 body-level siblings receive `inert`; Esc closes, removes `inert` from all 14, and goes back rather than pushing (`history.length` 14 → 14) |
| Deep link + register | `#tat-ejjel` loads the correct camera and announces `Idő: Éjjel` |
| Touch targets, mobile room | All five viewpoint indicators measured **44 × 44**; `Tovább` 347 × 49; `Alaprajz` 339 × 44 |
| Mobile controls in view | At 390 × 844 every control sits inside the viewport |
| Alt text | 371 / 371 written; renderings identified as such in the description itself |
| New markup | The no-JS list is an `<ol>` of `<figure>` elements with real `alt` from `projektek.json`, a visible `<figcaption>` and a real link per item — no heading level introduced, so no heading order changed |
| Reduced motion | The added CSS declares no animation, transition or transform, so the `prefers-reduced-motion` behaviour verified in Phase 6 §13.2 is unaffected by inspection |

**Known, not fixed** (carried from Phase 6 §13.3): the footer's `pointer: coarse` touch-target
enlargement still could not be verified rendering in this harness. Confirm on a real handset before
launch.

---

## 20. No-JS

**The last no-JS gap is closed.** Phase 6 §14 left one: the homepage's and the Fleet's opening
frames 2–n shipped with `hidden` and `data-src`, so a visitor without JavaScript saw exactly one
photograph of the chapter. Measured this phase, the same was true of the Making's opening and of all
three Level 1 rooms — six surfaces, not two.

### 20.1 What was built

`build.mjs → nojsKeretek()` emits, after each stage, a `<noscript>` section listing **every** frame
of that stage as an ordinary figure: a real `src` at 800 px, the frame's own name, its place, and a
link to the project. Styling is 30 lines in `rendszer.css`.

| Surface | Frames a no-JS visitor saw | Now |
|---|---|---|
| Homepage | 1 | **13** |
| Fleet | 1 | **6** |
| Making | 1 | **3** |
| HABLEÁNY | 1 | **5** |
| Hotel Domus Collis | 1 | **5** |
| Bodajki | 1 | **3** |

### 20.2 Why `<noscript>` and not a restructured stage

The obvious alternative was the `data-lemezek` pattern Phase 6 applied to the section cut: make the
flat list the default and let the script opt into the sticky stage. Rejected, and the reason is
written into `build.mjs`: `.nyilas` is absolutely positioned inside a sticky `.szinpad`, so the flag
gating that behaviour has to be set by a synchronous script in `<head>`, and on the site's most
important page a mis-timed flag means a flash of a thirteen-item list before the stage takes over.
`<noscript>` delivers the same content with zero runtime cost and zero risk to the stage.

### 20.3 Verified, not assumed

Each surface was loaded twice: once normally, and once from a copy with the `<script>` tags and the
`<noscript>` wrappers stripped — which is exactly what a browser without JavaScript parses.

- **Without JS:** two-column grid, 13 / 6 / 3 / 5 items, every image loaded with a real `currentSrc`,
  every caption reading `Name · Place · Project →`, 13 working links, no horizontal scroll at
  1440 × 900. Screenshotted on the homepage, the Fleet, the Making and HABLEÁNY.
- **With JS:** `document.querySelectorAll('.nojs-lista').length === 0` on every surface;
  `document.images.length` identical to before the change; the stage steps, the thresholds fire, the
  hash updates.

**Known no-JS characteristic, deliberate and pre-existing:** on a room page the data sheet
(`#adatlap`) is open without JavaScript — `ter.js` closes it on init, and the code says why: it is
the only way its content is reachable at all. It occupies the right-hand side and its close button
does nothing. The page behind it scrolls and every link works. Left as designed; recorded here so it
is a decision rather than a surprise.

---

## 21. Visual Quality

No spatial experience changed, so the honest test is regression, not improvement.

Compared at 1440 × 900 and 390 × 844 after every change:

- **Homepage** — stage intact, frame 04 (`Bodajki Vadászkastély`) renders with correct crop and
  register; the indicator reads `04 / 13`, `Nappal`. Unchanged from Phase 6.
- **HABLEÁNY, desktop** — viewpoint stepping, night register and threshold unchanged.
- **HABLEÁNY, mobile** — the salon crop keeps its pillars, window band and tables; spatially
  coherent, not a squeezed desktop.
- **Project page** — the new *A projektről* text sets in the editorial register (Cormorant 400) at
  the intended measure; the section is no longer an empty block under a heading.
- **No-JS list** — sets in the site's own type and colour; it reads as part of the site, not as a
  fallback bolted on.

Against the award-level test: nothing here is "more impressive". The change that most improves the
work is a paragraph of true sentences under each project, and the change that most improves the
*implementation* is that four projects stopped calling renderings photographs.

---

## 22. Known Limitations

1. **No workshop photography.** Seventh phase. One 0.75 MP frame from 2004.
2. **No photograph in the archive reaches 3000 px.** Max long edge 2048. Measured depth remains
   impossible; §16.
3. **Hotel Domus Collis rights are still open**, and it still carries four homepage scenes and a
   Level 1 room. Sixth phase asking. It received no new use this phase.
4. **`aranyora` has no imagery.** The vocabulary and the checker are ready; the frames are not.
5. **No DAY → GOLDEN → NIGHT gate.** HABLEÁNY's day/night pair is two *different* camera positions,
   not one position at two times. Using it would fake the mechanism.
6. **No room declares `melyseg.z`, `allas`, `irany` or `vagas`.** By design; §16, §17.
7. **The Fleet's LCP frame is 197 KB and cannot be encoded smaller**; the route now sits at
   344.1 / 350 KB.
8. **`/referenciak/hableany/` does not exist**; the live URL is `/referenciak/duna-cruises-hableany/`
   and was deliberately not renamed.
9. **The room data sheet is open without JavaScript** and cannot be closed; §20.3.
10. **Footer touch-target enlargement is still unverified on a real handset.**
11. **The header nav is eight items.** Client decision, unchanged.
12. **The "harminc év" copy is 35 years old.** Client text, unchanged.
13. **Six frames still appear in both the homepage section cut and the Making.** A shoot removes the
    need.
14. **`sajatDomainEl` is `false`** — the site is still site-wide `noindex`. Seventh phase carrying
    it, and now the last technical blocker.
15. **Five critical images remain below the resolution minimum**, all five waived by name, all five
    naming the photograph that would replace them.
16. **The descriptions are the author's reading of the photographs.** They contain no invented fact,
    but the owner is the only source for dates, clients, materials and locations — and should read
    all thirty before launch.

---

## 23. Remaining Real-World Content

Unchanged in substance from Phase 6 §20, minus the two items this phase closed. In the order that
unlocks the most:

| # | What | Unlocks |
|---|---|---|
| 1 | **The workshop, one day, 3000 px** — Phase 5 §15.2 shot 1, with a real opening in frame and people at work | the site's largest gap; a Level 1 workshop room; the Making's closing frame; `WORKSHOP_WIDE`, `WORKBENCH`, `PEOPLE_WORKING` |
| 2 | **One locked-off tripod position, day + golden + night** | the DAY → NIGHT KAPU. Mechanism, vocabulary and checker are built; only the frames are missing |
| 3 | **Hotel Domus Collis rights, in writing** | four homepage scenes and a Level 1 room stop being `NEEDS_RIGHTS` |
| 4 | **Two hulls under construction, 3000 px, no watermark** | three of the five waivers; the Fleet at full quality; a `szint: 1` treatment for boatbuilding |
| 5 | **Model releases** for `szent-laszlo-…/06, 08` and `vatikani-diszdoboz/01, 02` | two `NEEDS_RIGHTS` projects |
| 6 | **The finishing department in use** | the missing station between *váz* and *felület*; two waivers |
| 7 | **Any boat interior other than HABLEÁNY / 6.1 / Rivális** | a second traversable vessel |
| 8 | **Owner review of the thirty descriptions**, plus any dates, clients, materials or locations they wish to add | turns a truthful reading into a sourced record |
| 9 | **Whether the four rendering-only projects were ever built** | if built and photographed, four projects stop being `ARCHIVE_ONLY` |
| 10 | **A better master for the Fleet's opening frame** (`duna-cruises-hableany/01`, 1.81 MP) | ~100 KB back on the tightest route |

**Closed this phase:** Phase 6's items 5 (thirty project descriptions) and 6 (104 image
descriptions).

Items 1, 2, 4 and 6 are still **one shoot**. `npm run muhely` will accept or reject it on delivery.

---

## 24. Phase 8 Recommendation

**Phase 8 is not a build phase. It is a decision phase, and it belongs to the owner.**

Everything the repository can do without new real-world input is done. The three questions that
remain are not engineering questions:

1. **Can the workshop be photographed?** Seven phases have asked. The tooling to accept the answer
   has existed since Phase 6 and was exercised again this phase.
2. **Are the Domus Collis rights obtainable in writing?** Four homepage scenes and a Level 1 room
   depend on it.
3. **Are the thirty descriptions accurate?** They contain no invented fact, but only the owner can
   add the facts that are not in the photographs.

### If the answers arrive

`Phase 8 = THE WORKSHOP`, as Phase 6 §21 specified: a `terek.json` entry, a `forras.json` entry and
new masters — **no new frontend project**. Then, in order: consume `melyseg.terkep` if the masters
carry depth data; build the DAY → NIGHT KAPU on the aligned tripod series.

### If they do not

`Phase 8 = LAUNCH`, and it is short:

1. Owner reads the thirty descriptions.
2. Resolve or accept the Domus Collis rights position.
3. Flip `sajatDomainEl`, verify the site-wide `noindex` disappears (the audit checks both
   directions), confirm the footer touch targets on a handset, deploy.

**Do not invent a Phase 8 to keep building.** The site is finished to the edge of its evidence, and
the next honest increment is a photograph, a signature, or a launch — not more code.

### Either way

- Re-run `npm run tartalom` after any content change; it is the only trustworthy inventory.
- `npm run muhely` before accepting any delivery.
- `npm run ellenorzes` before any deploy.
- `admin.*` stays byte-identical, and the audit enforces it.

---

## Appendix — Changes made during Phase 7

**Created (1):** `docs/PHASE-7-REAL-CONTENT.md`
*(plus the regenerated `docs/TARTALOM.md` and `docs/tartalom.json`)*

**Modified (8):**

- `data/projektek.json` — **30 `leiras` written, 104 `alt` rewritten.** No other field touched; the
  file is written in `admin.js`'s own format (`JSON.stringify(lista, null, 2)`), so the next client
  save is a no-op diff.
- `data/forras.json` — four projects added (`csaladi-haz`, `budai-haz`, `belvarosban-nyugalomban`,
  `domus-pellegrini-hotel-apartmanok`), one corrected (`mercedes-plato`), each with its reasoning.
- `build.mjs` — `nojsKeretek()` (no-JS stage fallback) and `kepSzavak()` (photograph vs rendering
  wording), wired into the four stages and both project templates.
- `rendszer.css` — 30 lines styling the no-JS list.
- `index.html` — `<!--JELENET-NOJS-->` placeholder; hero label `Fotó` → `Kép`.
- `flotta.html`, `keszules.html` — `<!--FLOTTA-NOJS-->` / `<!--KESZ-NOJS-->` placeholders.
- `partials/projekt-sablon.html`, `partials/ter-sablon.html` — `<!--NOJS-KERETEK-->` placeholder;
  `Fotó` / `N fotó a munkáról` / `N fotóval` replaced by `{{kepCimke}}` / `{{kepMondat}}` /
  `{{kepMeta}}`.

**Not modified:** `admin.html`, `admin.js`, `admin.css`, the Worker, `data/terek.json`,
`data/flotta.json`, `data/keszules.json`, `data/palyazatok.json`, `data/ceg-adatok.json`, `ter.js`,
`ter.css`, `kuszob.js`, `terv.js`, `terv.css`, `flotta.js`, `keszules.js`, `fooldal.js`,
`fooldal.css`, `flotta.css`, `keszules.css`, `script.js`, `consent.js`, `szuro.js`, `galeria.js`,
`urlap.js`, `style.css`, `fonts.css`, `partials/fejlec.html`, `partials/lablec.html`, `robots.txt`,
all five `scripts/*.mjs`.

**Assets:** no source photograph was added, resized, recompressed, renamed or deleted. No new
derivative: the final build re-encoded **0** images.

**Dependencies:** none added. **Routes:** unchanged — 44 pages, sitemap 42.

**`sajatDomainEl`: still `false`.** Not flipped, per the brief. The site-wide `noindex` header is
present and the audit checks the flag in both directions.
