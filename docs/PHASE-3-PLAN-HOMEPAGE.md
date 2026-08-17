# DUNA — THE LIVING INTERIOR
# PHASE 3 — PLAN + HOMEPAGE

**Date:** 2026-08-16
**Scope:** the plan (`/alaprajz`), AVIF/WebP delivery, the seven-scene homepage, and — as a
consequence of the plan having to tell the truth — the promotion of three qualified projects
into real traversable rooms at their existing URLs.
**Basis:** [PHASE-0-AUDIT.md](PHASE-0-AUDIT.md), [PHASE-1-EXPERIENCE-ARCHITECTURE.md](PHASE-1-EXPERIENCE-ARCHITECTURE.md),
[PHASE-2-DESIGN-SYSTEM.md](PHASE-2-DESIGN-SYSTEM.md).
**Built in the prescribed order:** plan → images → homepage → validation.

**Stack unchanged.** Still one devDependency (`sharp`), zero runtime dependencies. No Three.js,
no GSAP, no framework. The threshold engine (`kuszob.js`) was **not rewritten**; it gained one
function (§3.4) that reuses its own physics.

---

## 1. Plan Architecture

The plan is generated **once**, by `alaprajzHtml(aktivSlug, { fedo })` in `build.mjs`, and
placed in three positions. One generator, because a plan that disagrees with itself is not a
plan:

| Placement | `data-hely` | Where | Heading | Behaviour |
|---|---|---|---|---|
| **Own page** | `lap` | `/alaprajz.html` | `<h1>` | Ordinary document. Filter state lives in the URL hash. |
| **In the flow** | `folyam` | end of the homepage | `<h2>` | This *is* the plan-reveal scene. Can be promoted to an overlay in place. |
| **Overlay** | `fedo` | every room | `<h2>` | `hidden` until opened; opens through a KAPU. |

The homepage case matters: the same element is the scene **and** the overlay. Opening it sets
`data-hely="fedo"` (fixed, full-screen), closing restores `folyam` and the scroll position. The
markup is never duplicated, so the plan the visitor reaches with `Esc` is byte-identical to the
one they scroll into.

### The visual language

It is an architect's index, not a portfolio page:

- **Seven wings**, one per existing `KATEGORIAK` key, each ruled off with a 1px line and a count
  (`HOTEL — 3 projekt · 45 fotó`).
- **Cells sized by photo count** — `span 3 / 2 / 1` of a six-column grid at ≥18 / ≥11 / fewer
  photographs. On a real plan the bigger room is bigger; here the bigger body of work is bigger.
- **Coordinates**: wing code + number within the wing (`HO·01`, `HA·01`). Two letters, because
  Hotel and Hajó both start with H.
- **The drafting grid at full strength** — the only place on the site where it is not a whisper.
- **Cover images do not exist until asked for**: no card, no frame, no shadow. On hover/focus the
  project's cover fades up *inside* the cell at 22% opacity, behind the type.
- **Always paper, even at night.** Same argument as the dossier in Phase 2 §7: a document is
  something you read, not an atmosphere.

No masonry, no shadows, no 3D, no cards, no images-by-default.

### The three representations, and the refusal to rank

The plan distinguishes what the brief requires — immersive rooms, cinematic spaces, project
stories — but as a **form**, not a grade:

| Mark | Label | Condition (derived, not asserted) |
|---|---|---|
| 26px oak rule | **Bejárható tér** | `szint: 1` **and** ≥2 authored viewpoints |
| 16px rule | **Mozgókép** | `szint: 2` |
| 8px rule | **Történet** | everything else |

The legend spells it out, and ends with the sentence that makes the distinction safe:
*"A forma azt mondja meg, milyen anyag áll rendelkezésre — nem azt, melyik munka ér többet."*
(The form says what material exists, not which work is worth more.)

The condition is computed from the data, so a project cannot be labelled traversable while
having nothing to traverse. This is why §1 has a consequence in §2.

---

## 2. Plan Data Model

**No new taxonomy. No metadata duplication. No spatial data in `projektek.json`.**

```
data/projektek.json   UNCHANGED contract. Client-owned, admin-writable.
                      slug · cim · kategoria · link · leiras · kiemelt · allapot · kepek[{file,alt}]
                      Phase 3 touched only 22 `alt` values — a field the admin preserves.

data/terek.json       Studio-owned. Keyed by slug, plus two `$` keys the build skips as projects.
                      szint · tipus · sorrend · hangulat · anyagok[] · anyagszin ·
                      szobak[].nezopontok[] · reszletek[] · adatok{} · szoveg
```

The plan reads: titles, categories and photo counts from `projektek.json`; `szint` and the
viewpoint count from `terek.json`. Nothing is stored twice.

### Two new `$` keys

`$sema` (documentation, from Phase 2) and **`$fooldal`** (new): the homepage's frames and their
geometry — `keretek[]` (13 frames), `metszet[]` (7 plates), `ajto` (1 frame). Copy is *not* here;
copy is content and lives in `index.html`. What lives here is what has to be validated against the
archive: a slug, a file name, an aperture.

### The rooms that now exist

Three projects met the Phase 1 §5.1 checklist and have authored viewpoints:

| Project | `szint` | Viewpoints | Thresholds out |
|---|---|---|---|
| Duna Cruises HABLEÁNY | 1 | 5 | ajtó ×2, kapu (nap→éj), ablak |
| Hotel Domus Collis | 1 | 5 | ajtó ×3, kapu |
| Bodajki Vadászkastély | 1 | 3 | kapu, ajtó |

Seven further projects carry `szint: 2` with materials and no geometry. Twenty carry no entry at
all and render exactly as they always have.

**Adding rooms 2 and 3 required no code.** They are `terek.json` entries and a build run — the
test Phase 2 §22 set for itself. The only code that changed was the *decision* rule (§1), not the
renderer.

### Validation, unchanged in spirit

The build hard-fails if `terek.json` — including `$fooldal` — names a project or an image file
that `projektek.json` does not contain, or an aperture that is not four numbers. Verified: pointing
a homepage frame at a nonexistent file stops the build with the exact path.

---

## 3. Plan Navigation

### 3.1 Reaching it

| Route | Control |
|---|---|
| Every page | **`Alaprajz`** in the header nav (new, seventh item) |
| Inside a room | persistent top-right `Alaprajz` button with an `Esc` hint; the dossier moved to a secondary control beside it |
| Homepage | the same button on the immersive stage; the plan is also simply *there* if you keep scrolling |
| Anywhere with a keyboard | `Esc` |
| Deep link | `#alaprajz` on any room or on `/` opens it on load |

`Esc` is never the only mechanism, and on mobile it is never the mechanism at all: the button is
in the thumb row (bottom-right on the homepage, full-width-plus-secondary in a room).

### 3.2 Inside it

Real `<a>` elements to `/referenciak/<slug>/`, real `<button>` filters with `aria-pressed`, a
live count in an `aria-live` region, and `aria-current="page"` on the cell you came from — with a
2px oak rule down its left edge, so "where am I" is answerable without reading.

Filtering hides cells **and** empty wings, so a filtered plan is a smaller plan, not a plan full
of empty rooms. On `/alaprajz` the filter state is written to the hash (`#hajo`, `#hotel+etterem`)
exactly as `szuro.js` does on `/referenciak` — the same contract, a separate implementation, so
`szuro.js` stayed untouched.

### 3.3 Leaving it

Closing returns focus to the control that opened it and, on the homepage, **restores the exact
scroll position** (measured: 3780px → 3780px). While it is open, everything behind it is `inert`,
so `Tab` cannot walk into a room the visitor cannot see.

### 3.4 The KAPU — how it opens

Not a modal fade. The plan is revealed through the current frame's **own authored aperture**:

- `terv.js` copies `--nyx/--nyy/--nyrx/--nyry` off the visible `.ter` into the overlay's mask.
- `Kuszob.feltarul(burok, belso, { fajta: 'kapu', ms: 620 })` plays steps 1–3 of the existing
  threshold — aperture growth by `z / (z − travel)`, the inverse-scaled interior, and the
  16–34% opacity entry — with the same 17 sampled keyframes and the same camera curve.
- Closing plays the same tape backwards at `playbackRate = −1.875`.

**No new physics, no new curve, no new duration.** 620ms is `--motion-terv`, which the motion
system already reserved for exactly this move; the familiar structural move is faster than the
900ms room-to-room threshold, which is the Phase 1 §20.7 speed hierarchy falling out of the
arithmetic again.

Under `prefers-reduced-motion`, `feltarul` short-circuits to a 200ms opacity fade before any mask
or transform is touched.

---

## 4. History / Deep Links

Phase 2's limitation #6 (*"no hashchange, no viewpoint history"*) is closed. The rule:

> **Scrolling is not a station. Choosing is.**

| Event | History |
|---|---|
| Scroll changes the viewpoint | `replaceState` — the URL follows you, the back button does not fill up |
| Indicator click, gate, next-threshold button, arrow key | `pushState` — you asked to be somewhere else |
| Plan opened | `pushState('#alaprajz')` |
| Plan closed | `history.back()` if we pushed; otherwise the hash is cleaned with `replaceState` |
| `popstate` / `hashchange` | moves to that viewpoint **playing the reverse pass**, or opens/closes the plan |
| Homepage frames | **no hash at all** (`data-horgony="nem"`) — the homepage is one place, and 13 hash entries on the front page would be noise |

While the plan is open, the room stops writing history entirely — otherwise a still-running
threshold would overwrite `#alaprajz` underneath it and the back button would land in the wrong
room. *(That bug existed for about twenty minutes and is the reason the guard is there.)*

**URLs are unchanged.** `/referenciak/<slug>/` is still every project's address, still in the
sitemap (now 40 URLs, `+/alaprajz.html`), no redirects were introduced. Verified: all 30 project
pages exist, 3 render as rooms, 27 render exactly as before.

---

## 5. Image Delivery

### What was done

`<picture>` with **AVIF → WebP → JPEG**, `srcset` at 400/800/1400, explicit `width`/`height` from
the *measured* output (sources are not all 3:2), `sizes` per context, `fetchpriority="high"` on the
one LCP frame, `loading="lazy"` on everything else, and `data-src`/`data-srcset` deferral for
viewpoints more than one step away.

**Not every image.** An AVIF encode is ~0.6s against ~0.18s for JPEG; converting all 371 × 2 would
have tripled the build to buy nothing for a visitor who never opens the 19th gallery photograph.
The priority set is what everyone actually downloads:

1. every homepage scene frame (including the LCP frame),
2. every viewpoint and detail of the three rooms,
3. every project's cover (the grid and the plan are made of these).

**60 images × 3 sizes × 3 formats.** Everything else stays progressive JPEG at 800/1400, exactly
as before.

### Measured (bytes on disk)

| Image | JPEG q78 | WebP q72 | AVIF q46 | Saving vs JPEG |
|---|---|---|---|---|
| Homepage LCP frame, 1400 (`hotel-domus-collis/04`) | 83.0 KB | 39.0 KB | **21.1 KB** | −75% |
| Homepage LCP frame, 800 | 34.7 KB | 17.9 KB | **10.9 KB** | −69% |
| HABLEÁNY room LCP, 1400 (`05`) | 269.4 KB | 232.6 KB | **143.6 KB** | −47% |
| HABLEÁNY room LCP, 800 | 104.2 KB | 95.8 KB | **65.7 KB** | −37% |
| Plan cell cover, 400 (`garzon/01`) | 20.0 KB | 12.8 KB | **7.6 KB** | −62% |
| **30 covers at 800, together** | **1906 KB** | — | **970 KB** | **−49%** |

The header logo was the other finding: `fejlec-logo.png` is 1230×313 (35.8 KB) displayed at
160×40 — **larger than the homepage's LCP photograph**, on every page. It now ships as a 320px
AVIF (2.8 KB) / WebP (4.7 KB) with the untouched PNG as fallback. −33 KB on every route.

### Build cost, and the cache that pays it back

A cold build with the new formats is **2m06s**. Since the output is deterministic (same source +
same settings = same bytes), derivatives are cached in `.kepgyorstar/` keyed by
`settings + file + width + format`, invalidated by source mtime. A warm build is **15s**.

The cache is git-ignored and optional: delete it and everything still builds, just slowly. The
settings stamp (`j78-w72-a46e4-v1`) is part of the key, so changing a quality setting invalidates
it automatically. This also answers Phase 1 §18 rule 6 (*derivative caching is required before
adding anything to the image step*) — CI can now cache the directory.

### What was not done

No source image was resized, recompressed, renamed or deleted. No existing image reference was
broken — the build's 6/c guard (which fails on any un-suffixed project-image reference) was
extended to accept `-400` and `.avif`, and still fails on raw sources.

---

## 6. Homepage Scene 01 — ALREADY INSIDE

**Frame:** `hotel-domus-collis/04` — an open white door onto a green living room, herringbone
floor, arched mirror at the left edge. Aperture `[0.66, 0.46, 0.20, 0.32]`.

There is no facade, no establishing shot, no "welcome". The first thing painted is the inside of a
DUNA apartment, and the composition already contains the site's whole thesis: **you are looking
through one room into the next.**

The existing language is kept verbatim: `Asztalos és hajóépítő üzem · Győr` /
*"Harminc év, egy műhely, több száz tér."* / the existing lede / the four count-up facts (1991,
1200 m², 30, 371) — which are facts, not decoration, and so they stayed. One change: the primary
button is now `Alaprajz`, because that is now the honest first move.

The four facts are no longer a boxed table on paper; over a photograph they are four columns
separated by hairlines. Same data, correct surface.

This frame is the LCP element: `fetchpriority="high"`, AVIF, 21.1 KB.

---

## 7. Homepage Scene 02 — THE FIRST THRESHOLD

**Frame:** `hotel-domus-collis/07` — the living room that was visible through the door, from
inside it. Threshold **AJTÓ**, 900ms, the existing engine, integrated and not retuned.

Nothing explains it. The visitor scrolls, the door jamb grows past the camera, and the room that
was in the opening is now the room they are standing in. The only text on this frame is one line
of existing copy — *"A tervezéstől a kivitelezésig egy kézben."*

The grammar is taught by the first movement, before any decision is required. Every later
transition on the site is this same movement.

---

## 8. Homepage Scene 03 — THREE SPACES / THREE TRADES

Three frames, three real projects, the three disciplines the company actually lists — and the card
copy from the old homepage, kept word for word:

| Frame | Trade | Copy | Leads to |
|---|---|---|---|
| `fafaragasok/10` — a carved, painted bed-head and chairs standing in the Győr workshop | **Asztalosipar · Egyedi bútor** | existing | `/alaprajz#egyedi` |
| `bodajki-vadaszkastely/02` — the walnut trophy hall with its lit vitrines | **Belsőépítészet · Teljes berendezés** | existing | `/alaprajz#hotel+etterem+kastely` |
| `duna-hajok-6-1-cabin/02` — the helm of the 6.1 Cabin, water beyond | **Hajógyártás · Hajó és hajóbelső** | existing | `/alaprajz#hajo` |

Space → space → space, not slide → slide → slide: each is entered through the previous one's
aperture, and the third exits through a **KAPU**, because what follows is a change of chapter.

The three-card section of the old homepage is gone; its three claims are now made by three rooms,
and its text is the accessible layer of those rooms.

---

## 9. Homepage Scene 04 — THE ENFILADE

Three Hotel Domus Collis frames in a row, chosen because that project was photographed *through*
doorways:

1. `14` — the kitchen, with an opening at the right into a dark green room
2. `20` — the breakfast room, with a passage between slatted dividers
3. `02` — the upper corridor, the far door at the end of it

Forward motion decelerates here (the frames are shorter and the copy thins out to a single line
and then to nothing — scene 04's middle frame carries **no text at all**, which is the rest beat
Phase 1 §20.7 asks for). Depth does the signposting; there is not one arrow in the scene. The
enfilade indicator on the right edge shows thirteen marks and which one you are on.

The third frame exits through a **KAPU** into HABLEÁNY.

---

## 10. HABLEÁNY

**Frames:** `05` (deck salon, day) → `03` (closed salon, day) → `20` (closed salon, night).

The room is allowed to be still. Two of these three frames carry almost no interface: a name, a
counter, and the way out. The middle frame carries nothing at all.

### Day → night

Real frames, not a colour grade. `03` and `20` are the same closed salon photographed by day and
at night; the transition between them is a **KAPU**, and the site's register flips with it —
`data-hangulat="ejjel"` on the stage and on `<html>`, so ground, accent and focus ring all move
to the night values defined in Phase 2 §3. Brass becomes oak, because brass fails on ink.

The visitor reads it as the light changing. It is also, literally, the light changing.

---

## 11. Boat Reveal

**Threshold: ABLAK, not AJTÓ** — the one transition type reserved for *something that moves*, and
the only one with lateral travel (3.4%).

The window frame passes the camera and what is on the other side is `duna-cruises-hableany/17`:
the HABLEÁNY at night, from outside, on the Danube, against the lit embankment. The room the
visitor has been standing in for three frames has been floating the whole time.

Then one more KAPU to `duna-hajok-6-1-cabin/23` — the boat as an *object*, on a plinth, on studio
grey. The interior becomes a thing that was made, which is the hinge into the section cut.

The line sits on the first of those two frames:

> **Tereket építünk.**
> *Néhány közülük elindul.*

**No water shader. No river footage. No liquid anything.** The Danube appears exactly where it is
in the pixels — through HABLEÁNY's glazing and behind the hull — and nowhere else. The reveal is
carried by the physical movement of a window frame past the camera, which is enough.

---

## 12. Section Cut

The photograph stops being a space and becomes a **page**: paper ground, the drafting grid, one
plate at a time, and scale rather than position doing the moving. This is the site's only
transition that is *not* a threshold, and it is not one because nothing here is a place.

Seven plates, all from the existing archive:

| # | Step | Frame | What it is |
|---|---|---|---|
| 01 | Nyersanyag | `fafaragasok/08` | a raw carving, unfinished, on the workshop floor |
| 02 | Kéz | `fafaragasok/09` | a hand-carved winged medallion in bare wood |
| 03 | Rajz | `garzon-plaza-hotel/14` | the chair sketched on paper, with fabric and leather samples |
| 04 | Terv · **látványterv** | `garzon-plaza-hotel/05` | the breakfast counter as a render — labelled as a render |
| 05 | Tárgy | `garzon-plaza-hotel/15` | the finished armchair on white |
| 06 | Tér | `garzon-plaza-hotel/02` | the built reception, with its corridor |
| 07 | Élmény | `garzon-plaza-hotel/09` | the same counter, in the morning, in use |

Plates 04 → 07 are the archive's only complete render-to-reality pair, and the CGI one says so on
its own caption (Phase 0 risk #5). The five existing process steps (01 Igényfelmérés → 05
Szerelés) follow as a ruled index, unshortened.

Nothing was fabricated to fill a step. Where the chain jumps projects — the raw material and the
hand are `fafaragasok`, the object and the space are Garzon Pláza — it jumps visibly, because
inventing a continuous one would have meant inventing photographs.

---

## 13. Plan Reveal

At the end of the section cut the camera stops pretending, and the whole body of work is on one
page: §1, in the flow, at full width. Thirty projects, seven wings, filterable, flat and fast.

This is also the moment the immersive layer hands navigation back. Everything the visitor has just
walked through is a cell here, and every cell is an ordinary link to an ordinary URL.

The plan reached with `Esc` from any room is the same markup — so the structure the visitor
discovers at the end of the journey is the structure they can summon at any point during it.

---

## 14. Final Door

**Frame:** `szent-laszlo-latogatokozpont-fa-kapuja/01` — a real DUNA gate, both leaves open, the
courtyard between them. Cropped to the leaves (`object-position: 50% 64%`) and dimmed to 62%
brightness so type can stand on it.

**Honest note:** the source is a daylight photograph and stays one. The darkness of this scene
comes from the ink ground and the scrim, not from a night-time colour grade. There is no night
photograph of a DUNA door in the archive, and we did not invent one.

Behind the door, four real people from `ceg-adatok.json` — Győrffy Péter, Győrffy-Domokos
Szilvia, Lakasz Péter, Dani Zoltán — with their roles and their direct mobiles, exactly as they
appear on the contact page. Above them, two sentences from the founder's own letter, quoted from
`rolunk.html` and attributed.

One CTA: `Ajánlatkérés`. One line under it: the workshop is in Győr, on Ikrényi út. No
"let's talk" block, no second CTA, no form on the homepage.

---

## 15. Mobile

Not a reduced desktop. What changes:

| | Desktop | Mobile (≤720px) |
|---|---|---|
| Scene type | left column, vertical scrim band on the left third | inside the bottom of the frame, even scrim, heavier at the foot |
| Scene 01 | left column, four facts in a row | centred in the frame, facts wrap, scroll cue dropped |
| Frame caption | — (the story carries it) | — |
| Technical strip | `Tér 03 / 13 · Idő` | hidden on the homepage; it carries no decision there |
| Controls | top-right | bottom row: project link left, `Alaprajz` right, both in the thumb zone |
| Indicator | right edge, vertical | under the header, horizontal |
| Enfilade step | 100svh per viewpoint | 88svh |
| Scene height | `--h` × 1svh | `--h` × 0.82svh |
| Plan cells | 6-column grid | 2 columns ≤900px, 1 column ≤560px |
| Filter buttons | 36px | 44px |

Horizontal swipe still steps between real camera positions (48px threshold, only when clearly
horizontal). Vertical scroll is never intercepted. Pinch, long-press and two-finger gestures
belong to the OS. No WebGL anywhere, on any platform, so there is nothing to opt into.

The seven-scene narrative survives intact: room → threshold → room → HABLEÁNY → boat → section →
plan → door. The pacing differs; the order does not.

---

## 16. Reduced Motion

Verified with `matchMedia` forced true, on the homepage and in a room:

| | Behaviour |
|---|---|
| Threshold pass | 200ms opacity fade — no masks, no transforms, no sampling |
| Plan open/close | 200ms fade, mask never applied |
| Scene copy | still fades between blocks (opacity only), no movement |
| Section-cut plates | swap without the scale change |
| Depth layers | pointer travel 0% |
| Scene heights | shortened further (`--h` × 0.8) — less scrolling to reach the same content |
| Smooth scrolling | instant, so indicator and keyboard jumps land immediately |
| Everything else | unchanged: all thirteen frames, all copy, day→night, the plan, the door |

Measured under forced reduced motion: frames advanced 04 → 08 → 12 of 13, the section cut reached
plate 6, day→night flipped the register, no console errors. **The story is fully legible; only the
camera is gone.**

---

## 17. Performance

Measured on the built artifact. Text assets are gzip −9 (Cloudflare Pages compresses; the local
preview does not, so these are computed, not read off the wire); images are bytes on disk; fonts
are the nine woff2 slices the page actually requests.

### Homepage, first load

| | Desktop (1440) | Mobile (390) |
|---|---|---|
| HTML | 11.9 KB | 11.9 KB |
| CSS (6 files) | 28.4 KB | 28.4 KB |
| JS (6 files) | 24.0 KB | 24.0 KB |
| Fonts (9 slices) | 124.6 KB | 124.6 KB |
| LCP frame (AVIF) | 21.1 KB | 10.9 KB |
| Logo + favicon + EU block | 21.3 KB | 21.3 KB |
| **Total** | **231.4 KB** | **221.1 KB** |
| **Budget** | ≤ 350 KB ✅ | ≤ 300 KB ✅ |
| Requests | 27 | 27 |
| LCP (local, unthrottled) | **188 ms** | — |
| CLS | **0.03** | — |

Phase 0 measured the old homepage at **817 KB**. This one is 231 KB and does considerably more.

### Room page (`/referenciak/duna-cruises-hableany/`)

| | Desktop | Mobile |
|---|---|---|
| HTML | 9.9 KB | 9.9 KB |
| CSS + JS | 46.7 KB | 46.7 KB |
| Fonts | 124.6 KB | 124.6 KB |
| First frame (AVIF) | 143.6 KB | 65.7 KB |
| Brand images | 21.3 KB | 21.3 KB |
| **Total** | **346.1 KB** | **268.3 KB** |
| **Budget** | ≤ 350 KB ✅ (by 4 KB) | ≤ 300 KB ✅ |

Phase 2's equivalent (the lab route) was **382.7 KB desktop / 217.5 KB mobile**. Desktop is now
inside budget; mobile grew by 51 KB because the page is no longer a bare prototype — it carries the
header, the footer, the plan, the dossier and the full project document.

### The plan

`/alaprajz` is **180.8 KB before any cover loads** (5.5 KB of HTML for thirty cells). Covers are
lazy 400px AVIF at ~8 KB each; a visitor who scrolls the whole plan pays about 240 KB more.

### Image payload elsewhere

`/referenciak`'s thirty covers: **1906 KB → 970 KB** (−49%) where AVIF is supported. Phase 1's
≤700 KB target is not met; see §19.

### Build

| | |
|---|---|
| Cold build | 2m06s (42 pages, 371 images, 801 JPEG + 354 AVIF/WebP derivatives) |
| Warm build (cache) | **15s** |
| `deploy/` | 90 MB (71 MB in Phase 2; +19 MB is the AVIF/WebP set) |

---

## 18. Accessibility

| Requirement | Implementation |
|---|---|
| One `<h1>` per route | Homepage: the brand line. Room: the project title, in the document under the enfilade. Plan page: the plan's own title. *(The dossier's title dropped to `<h2>`.)* |
| Server-rendered first | Every route is complete before JavaScript: the first frame with a real `src`, all thirteen scene texts, all seven section plates, all thirty plan cells, all four people, the complete gallery. Verified on the built HTML. |
| Keyboard | Everything in DOM order. `Esc` → plan (or closes the dossier first). `←→↑↓` → viewpoints, but only while that stage is in the viewport. Gates are real buttons. Filters are real buttons. Cells are real links. |
| Focus | Plan focuses its close button on open and returns focus to the trigger on close; the background is `inert` while it is open. |
| Announcements | `aria-live="polite"` announces the room name and its context on every change. Spatial state is never narrated. |
| Images | Three depth layers of one photograph are `alt=""` + `aria-hidden`; the description lives once, in the gallery. Plan cover images are decorative — the cell's link text carries the name. |
| Contrast | Type over photography always has a scrim *and* a text shadow. The homepage adds a third band (left on desktop, overall on mobile) because the scene copy sits where Phase 2's two bands do not reach. Night register values are unchanged and measured (Phase 2 §3). |
| Touch targets | ≥44px on mobile, including the plan's filter buttons. |
| Reduced motion | §16. |
| No-JS | The plan is a real page at a real URL, reachable from the header on every route. Rooms fall back to the first frame plus the complete project document. The homepage falls back to thirteen full-height captioned frames, the section cut, the plan and the door — one screen per scene, no overlap. |

**Alt text status, honestly:** 75 of 371 images now have written descriptions (53 from Phase 2, 22
added here). Every photograph used in the homepage, in the three rooms or in the section cut is
among them. The remaining 296 are the archive's original labels — many are filenames — and they
are concentrated in the low-resolution boat sets. See §19.

---

## 19. Known Limitations

1. **Hotel Domus Collis is now a room, and its image rights are still unresolved.** Phase 0 risk
   #6 (Facebook-CDN provenance) is unchanged, and this phase increased the exposure: those
   photographs now carry scenes 01, 02 and 04 of the homepage as well as a room. If the rights
   answer is no, the homepage needs four replacement frames and one `terek.json` entry deleted —
   no code, but real art direction.
2. **Bodajki's apertures are the weakest authored geometry on the site.** Its halls are display
   rooms, not enfilades: the "opening" on `02` is a lit vitrine, not a passage. The threshold
   works, but it reads more like a push-in than a walk-through.
3. **The full font set is 124.6 KB and the homepage requests all of it** — five faces plus four
   `latin-ext` slices, because the first screen legitimately uses Cormorant 300, its italic,
   Cormorant 400 and Archivo 400/500. Phase 2's ≤90 KB target still fails, for the reason Phase 2
   gave: getting under it means dropping a face, and the obvious candidate carries the editorial
   lede.
4. **The HABLEÁNY room is 4 KB under the desktop budget.** Its first frame is a 143.6 KB AVIF —
   the heaviest single asset on the site. Any richer opening frame breaks 350 KB.
5. **296 alt texts are still archive labels.** §18. The boat sets are the bulk of it.
6. **`leiras` is empty for all 30 projects.** Every dossier still says so out loud. This remains
   the single biggest risk to the submission, and no amount of engineering touches it.
7. **`/referenciak` is 970 KB of covers, against a 700 KB target.** Reaching it needs a smaller
   grid derivative (the grid asks for 800px and displays ~330px) — a one-line change that was left
   out of this phase because it would have re-encoded every cover during homepage work.
8. **Depth is still authored, not measured.** Four numbers per frame. Phase 1 §22 STEP A (does
   1.86 MP survive true displacement?) is still unanswered, and `img/melyseg/` is still empty.
9. **The `/lab/threshold` route was retired.** The room it prototyped now exists at its real URL,
   and keeping two templates for one thing would have guaranteed they drift. `lab/kuszob.html`
   remains in the repository, unbuilt; the `_headers` noindex rule for `/lab/*` was left in place
   so the route cannot come back indexable.
10. **The homepage is ~1330vh of choreography** (act I 894, section cut 336, door 96) plus the plan
    and footer as ordinary document — about 1900vh in total. Phase 1's ~1290vh referred to the
    choreographed part; that number is met, but the whole page is longer than that figure suggests.
11. **CLS is 0.03**, not 0. It comes from the font swap on the first screen, not from layout.
12. **Two projects still have no cover-quality opening frame in the plan** (`bojan-harcos` at 3
    photographs, `meyer-motorcsonak-2` at 7). They render correctly; they are simply thin.

---

## 20. Phase 4 Requirements

### Blocking questions, in order (unchanged, and now more expensive to answer late)

1. **Hotel Domus Collis image rights.** Now blocks the homepage, not just a room.
2. **Will copy be commissioned for 8–10 projects?** Thirty empty descriptions.
3. **Can the workshop be photographed?** The section cut has one raw-material plate and one
   hand plate, both from the same carving set. Three photographs would transform the chapter.
4. **Do camera masters exist for HABLEÁNY?** Decides the depth-map pipeline.
5. **English version?** Still a routing decision that must precede the work, not follow it.

### Build, in this order

1. **A `-400` grid derivative for `/referenciak`** and the plan — closes limitation #7 in one line.
2. **The remaining alt texts**, starting with the boat sets. Safe, permanent, admin-preserved.
3. **THE FLEET** (`/flotta`) — the thirteen archive boats as one dense index, per Phase 1 §12.3.
   The plan currently gives each of them a cell of its own, which is the only place the plan
   flatters the archive.
4. **The craft chapter as its own route** (`/metszet`), with the homepage's section cut as its
   opening. Only worth it after question 3 is answered.
5. **The About rewrite** toward the founder's-letter register (Phase 1 §13).
6. **The depth-map pipeline**, if question 4 is yes — only the mask source changes.
7. **A fourth room**, if new photography arrives. It should be a `terek.json` entry and nothing
   else; if it needs code, this phase failed.

### Carried forward as hard rules

- `data/projektek.json` stays the client's surface; `admin.js` / `admin.html` / `admin.css` remain
  byte-identical to what the client uses today.
- Server-rendered HTML first, spatial layer second, on every route.
- One transition, three types. A second transition type must displace something.
- Reduced motion, keyboard and no-JS are release blockers.
- **`sajatDomainEl` must be flipped at go-live** — the build still emits site-wide `noindex`.

---

## Appendix — Changes made during Phase 3

**Created (7):**
`alaprajz.html` · `terv.css` · `terv.js` · `fooldal.css` · `fooldal.js` ·
`partials/ter-sablon.html` · `docs/PHASE-3-PLAN-HOMEPAGE.md`

**Modified (8):**
`build.mjs` (plan generator, room route, homepage scene injection, AVIF/WebP priority set,
derivative cache, brand-logo derivatives, `$fooldal` validation, sitemap, guard regex) ·
`index.html` (rewritten as the seven-scene journey) · `ter.js` (multi-stage, history, `<source>`
promotion, header register) · `kuszob.js` (**one added function**, `feltarul`; the pass itself is
untouched) · `ter.css` · `rendszer.css` (`picture { display: contents }`) ·
`partials/fejlec.html` (logo `<picture>`, `Alaprajz` nav item) · `data/terek.json` (`$fooldal`,
two new rooms, seven `szint: 2` entries)

**Data:** `data/projektek.json` changed in **22 `alt` values only** — a field the admin preserves.

**Not modified:** `admin.js`, `admin.html`, `admin.css`, `script.js`, `style.css`, `fonts.css`,
`consent.js`, `szuro.js`, `galeria.js`, `urlap.js`, `partials/lablec.html`,
`partials/projekt-sablon.html`, `data/ceg-adatok.json`, `data/palyazatok.json`, the Worker, the
form, the fonts.

**Assets:** no source image was resized, recompressed, renamed or deleted. New derivatives only.

**Dependencies:** none added.

**Routes:** `+/alaprajz.html`; `−/lab/threshold`; all 30 project URLs unchanged, 3 of them now
rendering as rooms.
