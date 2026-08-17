# DUNA — THE LIVING INTERIOR
# PHASE 4 — THE FLEET

**Date:** 2026-08-16
**Scope:** the safe cleanup Phase 3 deferred (the `-400` grid derivative, the boat alt texts), and
THE FLEET at `/flotta.html`.
**Basis:** [PHASE-0-AUDIT.md](PHASE-0-AUDIT.md), [PHASE-1-EXPERIENCE-ARCHITECTURE.md](PHASE-1-EXPERIENCE-ARCHITECTURE.md),
[PHASE-2-DESIGN-SYSTEM.md](PHASE-2-DESIGN-SYSTEM.md), [PHASE-3-PLAN-HOMEPAGE.md](PHASE-3-PLAN-HOMEPAGE.md).
**Built in the prescribed order:** cleanup → audit → data → route → experience → connection →
validation.

**Stack unchanged.** One devDependency (`sharp`), zero runtime dependencies. No Vite, no React,
no Three.js, no GSAP. `kuszob.js` was **not touched at all** in this phase; `ter.js` was **not
touched at all**. The Fleet runs on the engine that already existed, which was the point.

---

## 1. Content Audit

### The number is 15, not 13

Phase 1 spoke of "the 13 archive boats". Verified against `data/projektek.json`: the `hajo`
category holds **15 projects and 194 photographs** — 12 archive boats plus HABLEÁNY and the two
6.1 types, which Phase 1 counted separately. Every one of the 194 files was opened and measured.

| Project | Photos | Resolution range | Interior? | On water? | Project URL |
|---|---|---|---|---|---|
| Duna Cruises HABLEÁNY | 23 | 1.33–2.43 MP | ✔ salon, day + night | ✔ | dunacruises.com |
| Duna Hajók 6.1 Cabin | 26 | 1.62–2.43 MP | ✔ cockpit, berth, basin | ✔ | dunahajok.hu |
| Duna Hajók 6.1 KADÉT | 11 | 1.35–2.56 MP | ✔ cockpit | ✔ | dunahajok.hu |
| Boesch 580 | 18 | 0.31–0.79 MP | ✔ helm | ✔ lake | — |
| Boesch 640 De Luxe | 19 | 0.31–0.85 MP | ✔ | — | — |
| Boesch 560 De Luxe | 17 | 0.27–0.85 MP | ✔ full interior | — | — |
| Arcangeli Super Jolly | 13 | 0.31–0.85 MP | ✔ | — | — |
| Volvo Penta motorcsónak | 12 | 0.31–0.96 MP | ✔ | ✔ river | — |
| Meyer motorcsónak 1. | 12 | 0.45–0.85 MP | ✔ | — | — |
| Veterán motorcsónak | 8 | 0.85 MP | ✔ | — | — |
| Meyer motorcsónak 2. | 7 | 0.74–0.85 MP | ✔ | — | — |
| Jégvitorlás | 7 | 0.48–0.85 MP | — | — | — |
| Jolle 25 | 10 | 0.39–0.85 MP | — | ✔ under sail | — |
| Rivális vitorlás hajó | 8 | 0.46–0.78 MP | ✔ saloon, berth, heads | — | — |
| Bojan – Harcos | 3 | 0.48–0.85 MP | — | — | — |

`leiras` is empty for all 15. `terek.json` has entries for three of them (HABLEÁNY at `szint: 1`,
the two 6.1 types at `szint: 2`). No year, location, client, or scope exists for any boat.

### The finding that decided the whole phase

The archive's boat sets are **not** weak snapshots of finished boats. Opened one by one, they turn
out to be a **construction and restoration record**: bare frames under a dozen clamps, planking
being glued, hulls stripped to the ribs, rotten transoms, primer, spray booths, and only then the
finished lacquered hull.

Seven of the fifteen sets contain photographs of the structure. That is the single most valuable
thing in the boat archive, it is not visible anywhere else on the site, and it is exactly the
material a chapter called THE FLEET should be made of. **The Fleet is not a boat catalogue; it is
the record of a room being built as a hull.**

### What is *not* in the archive

No year, no client, no length, no engine, no launch date, no drawings, no crew, no named
photographer. Camera date stamps are burned into some Boesch 560, Meyer 2 and Volvo Penta frames
(`'03 3 10`, `'04 2 9`, …) — these are visible evidence but not client-confirmed metadata, so they
are **not** presented as project years anywhere. See §19.

---

## 2. Fleet Concept

The homepage ends its boat reveal on one line:

> **Tereket építünk.** *Néhány közülük elindul.*

The Fleet answers the question that line leaves open — *how does a room become something that can
leave?* — and the archive answers it literally, with frames and clamps.

```
A HAJÓ     the HABLEÁNY under way on the Danube — where the homepage stopped
   ↓
A BORDA    ribs and planks under clamps, Boesch 640, the Győr workshop
   ↓
A VÁZ      the frame from above, Jégvitorlás — every boat is the same here
   ↓
A FELÜLET  the same Boesch 640 hull, lacquered, in the spray booth
   ↓
A SZOBA    a berth inside a mahogany hull, Rivális — this is interior design now
   ↓
A MOZGÁS   the 6.1 Cabin under way, people aboard
```

Six stations, six real photographs, no invented step. The chapter's claim, made by the pictures
rather than asserted in copy: **a boat is a room whose relationship to place has changed, and the
change is manufactured — in the same workshop, on the same machines, with the same finishing
department.**

Frames 02 and 04 are **the same hull**, twenty photographs apart in the archive: bare ribs and
finished lacquer. That is the only complete before-and-after chain the boat archive contains, and
it cost nothing to find.

The word **HAJÓK** appears nowhere as a section title.

---

## 3. Information Architecture

**Route:** `/flotta.html`, following the repository's own convention for top-level pages
(`alaprajz.html`, `referenciak.html`). No rewrite rules, no redirects, **no existing URL changed.**

```
/flotta.html
├── A NYITÁS      six frames, one sticky stage, every threshold an ABLAK
├── A VÍZVONAL    all fifteen vessels on one page, ordered, filterable
└── A VISSZA      three real exits back into the world
    + the plan as an overlay, on Esc, exactly as in a room
```

Nothing is a separate microsite: same header, same footer, same plan overlay, same threshold, same
typographic roles, same tokens. The only new file the browser loads is `flotta.css` (5.1 KB gzip)
and `flotta.js` (2.3 KB gzip).

**No boat detail pages were created.** Every vessel already has an address — `/referenciak/<slug>/`
— and three of them already render as more than a plate. Building a second set of boat pages would
have duplicated thirty existing URLs to show the same photographs. The Fleet links out to the real
ones. (Phase 1 §7 asked for this explicitly: *the boats are one page, not thirteen.*)

### Navigation, one model

**The enfilade of windows.** Native vertical scroll drives a sticky stage; the frame changes as a
consequence, never as a replacement. The scrollbar tells the truth, momentum stays native, nothing
is hijacked.

The one thing that differs from every other stage on the site is a single field in the data:
**every threshold here is ABLAK.** Phase 1 §12.4 fixed the grammar — a door leads to another room,
a window leads to something that moves. A fleet is therefore a corridor of windows, and the
visitor learns that without being told, because they have already crossed 14 doors and one window
on the homepage.

No carousel, no slider, no horizontal scroll hijack, no instructions.

---

## 4. Visual System

Phase 2's system, unchanged. Five typographic roles, ten spacing steps, six durations, three
curves, two registers. No new colour, no new typeface, no new duration.

What the Fleet is allowed to change, and why:

| | Homepage | Fleet |
|---|---|---|
| Scene typography | left column | **right column** |
| Scrim band | left | **right**, and steeper |
| Enfilade indicator | right edge | **left edge** (the system default) |
| Threshold types | ajtó ×9, kapu ×3, ablak ×1 | **ablak ×5** |
| Ground under the index | paper | paper |

The Fleet is the homepage mirrored. That is the entire visual signal that the chapter changed, and
it costs nothing.

**The steeper scrim is measured, not stylistic.** The homepage's `.66 / .40 / .12` ramp reaches
only ~0.25 opacity where the Fleet's copy sits, because the Fleet's frames are the lightest
material on the site — raw pine, white workshop walls, varnished mahogany — where the homepage's
are dark interiors. The Fleet uses `.74 / .56 / .34 / .10`, plus a reinforced top band
(`.60 / .34 → transparent at 32%`) because the frame caption's eyebrow is small oak type and the
`ter.css` top band was tuned for dark ceilings.

No water shader, no reflections, no blue wash, no stock river footage, no generated imagery, no
WebGL. The Danube appears where it is in the pixels — under the HABLEÁNY, under the 6.1 Cabin, at
the Volvo Penta's dock — and nowhere else.

---

## 5. Fleet Opening

Six frames, `--h` values 108 / 74 / 66 / 62 / 78 / 82 (viewport-height multiples), so the pace is
set by the length of the sentence, not by a made-up number. Copy lives in `flotta.html` because it
is content; frames and geometry live in `data/flotta.json` because they have to be validated
against the archive.

**Frame 1 was changed during the build, and the reason is recorded in the data file.** The first
choice was `duna-cruises-hableany/17` — the frame the homepage's boat reveal ends on, for
continuity. Rendered full-bleed at 16:10 it is a night cityscape in which the boat is a speck
along the bottom edge. `01.jpg` is the same vessel on the same river, filling the frame, under
way, with passengers at the tables. Continuity of *subject* beat continuity of *file*, and the
frame now also states the chapter's thesis on its own.

**Frame 4 was changed for a second measured reason.** The first choice, `boesch-560/06` (deck
slats close up), carries the `Duna HAJÓK` watermark dead centre on a pale, even surface, where at
1440px it dominates the frame. `boesch-640/13` puts the same watermark on dark lacquer where it
reads as provenance rather than as a logo — and it happens to be the same hull as frame 2, which
made the sequence better.

The opening works without motion, without JavaScript, and at 0.46 MP. It does not upscale, sharpen,
retouch or crop-fake anything.

---

## 6. Boat Navigation

**A VÍZVONAL** — fifteen rows on one page, each on a hairline, no cards, no shadows, no masonry.

Each row carries: the plan's coordinate, a 400px cover, the name, the type, the photo count, five
station marks, and the form label. The whole row is one real `<a>` to the project's existing URL.

### The coordinate and the order are deliberately different things

The coordinate is **the plan's**: `HA·01 … HA·15`, computed the same way `alaprajzHtml` computes
it, from the order in `projektek.json`. The row order is computed from the material:

```
rang (bejárható tér → saját típus → archívum)
  → number of documented stations, descending
    → photo count, descending
```

So HABLEÁNY is `HA·01` and first; the 6.1 KADÉT is `HA·02` but third; Boesch 580 is `HA·06` and
fourth. On a real plan the address and the route through the building are not the same list, and
here they are not either. **There is no `sorrend` field** — the order cannot be overridden by
taste, and a boat added in the admin lands in its correct place by itself.

### The five station marks

The row's most useful column is not the photo count. It is **what the archive holds** about that
vessel:

| Mark | Means |
|---|---|
| **Váz** | the ribs or the structure are visible |
| **Felület** | sanding, lacquer, a planking detail |
| **Belső** | the boat's interior, as a space |
| **Vízen** | the boat on the water |
| **Stúdió** | photographed as an object on seamless |

Filled = there are photographs. Empty = there are none. The legend says the thing that makes this
safe out loud: *"A jel azt mondja meg, mit őriz az archívum — nem azt, mi történt a műhelyben.
Ahol nincs jel, ott fénykép nincs."*

Bojan – Harcos has five empty marks and three photographs. That is the truth about it, and the
index says so instead of hiding it behind a cover image.

The filter is **AND**, not OR: `Váz + Belső` asks *which boats do we have both of*, and answers
six. Verified: Váz = 7, Váz+Belső = 6 (Jégvitorlás drops, correctly — it has no interior frame).

---

## 7. Boat Detail

**No detail pages were built, and this was a content decision, not an architectural one.**

For each vessel the minimum useful representation was determined:

| Content available | Representation |
|---|---|
| ≥2 authored viewpoints, `szint: 1` | already a traversable room at its own URL — HABLEÁNY |
| Publication-grade set, on water + interior | already a project page with a full gallery — the two 6.1 types |
| 3–19 documentary frames, no metadata | a row in the waterline + the existing project page |

A detail page would have had a name, a photo count and a gallery — all three of which the existing
project page already shows, at an address that is already in the sitemap and already indexed.
Fields that would have had to be invented to justify a detail page (year, length, client, engine)
do not exist, and no such field appears anywhere in the Fleet.

---

## 8. HABLEÁNY Connection

HABLEÁNY is the bridge in both directions, and it was **not rebuilt, re-presented or duplicated.**

- The Fleet **opens** on it — frame 1, the vessel the homepage's window threshold revealed.
- The Fleet **closes** with a link into the existing immersive room ("A HABLEÁNY szalonja").
- The room and its project document **link back**: three `/flotta.html` links on
  `/referenciak/duna-cruises-hableany/` (the dossier, the document, the plan overlay's Hajó wing).
- The waterline lists it first, marked **Bejárható tér** — the same label the plan uses, with the
  same ink-not-brass treatment, so the two views agree.

`ROOM → VESSEL → FLEET` is therefore literal: the same photographs, the same URL, the same room.

---

## 9. Plan Connection

Four bindings, no second sitemap:

| Direction | Mechanism |
|---|---|
| Fleet → Plan | `Esc` anywhere on `/flotta.html`, or the persistent top-right `Alaprajz` control — the same overlay, opened through the same KAPU, in `terv.js`, unchanged |
| Fleet → Plan (explicit) | "Az alaprajz hajószárnya →" in the closing section, deep-linking `#hajo` |
| Plan → Fleet | a new `A flotta →` control in the Hajó wing's header, on all three plan placements |
| Boat → Fleet | every one of the 15 boat project pages carries `A flotta · HA·NN →` |

Verified: `Esc` on the Fleet opens the plan with 30 cells, pushes `#alaprajz`, moves focus to the
close button, marks the background `inert`; a second `Esc` closes it, cleans the hash, restores
focus and removes `inert`.

`PLAN → FLEET → BOAT → PROJECT` and `FLEET → PLAN → LIVING INTERIOR` both close.

---

## 10. Object Relationship

Phase 1 §12.3 proposed the 6.1 Cabin and KADÉT as a separate **object** layer. **Rejected, on the
evidence.**

- Of the 6.1 Cabin's 26 frames, **3** are studio-seamless. The other 23 are the boat on the water,
  at a dock, on a trailer, and its interior — including a berth with two pillows and a plumbed
  wash basin.
- Of the KADÉT's 11 frames, **none** are studio.

Two boats, one of which has three object photographs, is not a layer. So "object" became what it
actually is in this archive: **a station one vessel's photography reached** — `studio`, one of the
five marks, count 1. The distinction is preserved, it is visible in the index, and it did not cost
a second taxonomy.

The 6.1 pair sit in the Fleet as `rang: "sorozat"` — the types DUNA still builds, with modern
photography — which is a real distinction backed by resolution (≥1.62 MP against 0.27–0.96 MP) and
by a commercial site that exists.

---

## 11. Motion

**No new motion system. No new duration. No new curve. `kuszob.js` was not modified.**

| Move | Source |
|---|---|
| Frame → frame | `Kuszob.at({ fajta: 'ablak' })` — 900 ms, `ut: 1.20`, near layer leaves at 26–56%, **3.4% lateral travel** |
| Backwards | the same tape at `playbackRate −1.875`, 480 ms |
| Plan open / close | `Kuszob.feltarul({ fajta: 'kapu', ms: 620 })` |
| Copy cross-fade | `--motion-normal` / `--ease-lagy`, opacity only |
| Row hover | `--motion-terv` / `--ease-water`, 1.04 scale on the cover |

ABLAK is the only threshold type with lateral displacement, and it is the one the system already
reserved for *something that moves*. Using it five times in a row is the phase's entire motion
idea, and it required a JSON field rather than code.

It reads as passing, not as a carousel, because the near layer accelerates out of frame on its own
depth curve while the far layer barely moves — `scale = z / (z − travel)`, Phase 2 §10.1.

---

## 12. Mobile

Designed at 390×844 first; the desktop arrangement derives from it.

| | Desktop | Mobile (≤720px) |
|---|---|---|
| Scene copy | right column, vertical scrim band | inside the bottom of the frame, even scrim |
| Opening scene | vertically centred | **bottom-aligned like every other scene** — the horizontal indicator sits where a centred block would land |
| Frame caption | eyebrow + name, top-left | **name only** — the eyebrow repeats the bottom-left link |
| Bottom-left link | full text | one line, ellipsised at 46vw |
| Technical strip | Állomás / Idő / Szakasz | **kept** — unlike the homepage, it carries a real decision here |
| Indicator | left edge, vertical | under the title, horizontal |
| Waterline row | 5 columns | cover left, everything else stacked right; the form label drops |
| Scene height | `--h` × 1svh | `--h` × 0.82svh |

Vertical scroll is never intercepted. Horizontal swipe steps between stations (48px threshold, only
when clearly horizontal) — the same gesture as every other stage. Pinch, long-press and two-finger
gestures belong to the OS. Measured: no horizontal overflow at 390px (scrollWidth 375).

---

## 13. Accessibility

| Requirement | Implementation |
|---|---|
| One `<h1>` | *"Tizenöt tér, ami elindult."* Everything else is `<h2>`/`<h3>`. |
| Server-rendered first | Verified with JavaScript disabled: the `<h1>`, all six scene blocks, the first frame with a real `src`, **15 rows as 15 real links**, 6 filter buttons, the complete plan with 30 cells, 3 exits, the footer. |
| Real links | Every vessel is an `<a href="/referenciak/<slug>/">`. **No boat is reachable only by clicking an image.** |
| Keyboard | `↑↓←→` step between stations while the stage is in view; `Esc` opens/closes the plan; filters and the indicator are real `<button>`s in DOM order. Verified: `ArrowDown` from load advances to station 02. |
| Visible focus | The existing `:focus-visible` ring; `--fokusz` follows the register. |
| Announcements | `aria-live="polite"` announces station name + context on every change. Spatial state is never narrated. |
| Station marks | `aria-hidden` decorative squares **plus** a visually-hidden sentence per row: *"Az archívumban: váz, felület, belső"* — or *"…csak külső felvétel van"* when empty. |
| Filter state | `aria-pressed` on every button, a live count in an `aria-live` region. |
| Images | Depth layers are `alt=""` + `aria-hidden`; index covers are decorative (the row's link text carries the name); the written description lives once, in the project gallery. |
| Contrast | Type over photography always has a scrim **and** a text shadow. The Fleet's scrim was re-measured against its own (lighter) frames rather than inherited. |
| Touch targets | **≥44px — and this was broken before this phase.** See below. |
| Reduced motion | §14. |

**A correction to Phase 3 §18.** Phase 3 claimed *"≥44px on mobile"*. Measured on the built
artifact, the spatial controls were **33px** (`Alaprajz`), **24px** (project link) and **20px**
(indicator marks) — the height of the type, not of a target. Fixed in `ter.css`'s mobile block, so
the correction lands on the homepage and both other rooms as well as the Fleet. Re-measured: 44 /
44 / 44. The Fleet's own filter buttons went 36 → 44.

---

## 14. Reduced Motion

Verified with `prefers-reduced-motion: reduce` forced, on the built page:

| | Behaviour |
|---|---|
| `Kuszob.lassit` | `true` — the pass short-circuits before any mask or transform |
| Threshold | 200 ms opacity fade; `data-maszk="nincs"` on every wrapper, `transform: none` |
| Motion tokens | `--motion-kuszob` 900ms → **200ms** |
| Pointer travel | `--reteg-kozel-mozog` 1.70% → **0%** |
| Scene copy | still cross-fades (opacity only), no movement |
| Row hover | no scale, no underline sweep |
| Scene heights | shortened further (`--h` × 0.8) |
| Everything else | unchanged: all six stations, all copy, the waterline, the filter, the plan, the three exits |

Measured under forced reduced motion the sequence still advanced through stations 3, 5 and 6 with
correct captions and no console errors. **The narrative is fully legible; only the camera is gone.**

---

## 15. Performance

Measured on the built artifact with `PerformanceResourceTiming.encodedBodySize`. Text figures are
gzip −9 (Cloudflare Pages compresses; the local preview does not, so those are computed);
images are what the browser actually fetched.

### `/flotta.html`, first load

| | Desktop 1440 @1× | Mobile 390 @2× |
|---|---|---|
| HTML | 11.3 KB | 11.3 KB |
| CSS (6 files) | 29.3 KB | 29.3 KB |
| JS (6 files) | 24.5 KB | 24.5 KB |
| Fonts (10 slices) | 124.6 KB | 124.6 KB |
| Brand images | 21.4 KB | 7.8 KB |
| LCP frame (AVIF) | 267.9 KB (`01-1400`) | 98.0 KB (`01-800`) |
| **Total** | **478.9 KB** | **295.4 KB** |
| **Budget** | ≤ 350 KB ❌ (+129) | ≤ 300 KB ✅ |
| Requests | 26 | 25 |

**Only one photograph loads before the first paint** — the other five stations and all fifteen
covers are lazy. Scrolling the whole page costs 638.5 KB of images on desktop, 346.4 KB on mobile.

**The desktop miss is one file.** `duna-cruises-hableany/01` is an intrinsically expensive
photograph — river texture plus fine deck detail — and AVIF q46 is already the cheapest of the
three encodings the build produces (AVIF 267.9 KB vs WebP 362.0 KB vs JPEG 355.6 KB). There is no
honest lever left inside the current system: the stage is `100vw`, so a 1440px viewport genuinely
needs the 1400px file, and lying in `sizes` to fetch a smaller one would ship a blurred hero. See
§19 and §20.

### Part A — the `-400` grid derivative, measured

Phase 3 limitation #7 said `/referenciak` was 970 KB of covers against a 700 KB target, and that a
`-400` derivative would fix it "in one line". It needed two, and the second one was the one that
mattered: **the `-400` files already existed and the browser was never choosing them**, because
`sizes` claimed `33vw` (475px at 1440) for a cell that is measurably 288–330 CSS px wide.

| Route | Before | After | Change |
|---|---|---|---|
| `/referenciak`, 30 covers @1× | 970.4 KB | **329.8 KB** | **−66%** |
| `/referenciak`, 30 covers @2× | 970.4 KB | 970.4 KB | unchanged — correct |
| `/alaprajz`, 30 covers @1× | 970.4 KB | **605.7 KB** | **−38%** |
| `/alaprajz`, 30 covers @2× | 970.4 KB | 970.4 KB | unchanged — correct |

The Phase 4 brief's ~450 KB target is beaten on `/referenciak` at 1×. **The 2× figure is
deliberately unchanged**: a 2× screen showing a 330px cell genuinely needs 660 device pixels, and
serving it 400px would be a visible quality loss to buy a number. That is the "do not optimize
purely for a number" rule applied honestly rather than as an excuse — the 1× win is real and the
2× non-win is explained rather than hidden.

The plan's improvement is smaller because its cells are *legitimately* larger: a `span 3` cell is
645 CSS px. Its `sizes` is now computed per cell from `cellaSzelesseg()` (`N × 215px`) instead of a
flat `30vw`, so only the span-1 cells drop to `-400`.

### Build

| | |
|---|---|
| Cold build (cache deleted) | **2m05s** (43 pages, 371 images, 816 JPEG + 444 AVIF/WebP) |
| Warm build | **16s** |
| `deploy/` | 94 MB (90 MB in Phase 3) |

### New files

| File | Raw | gzip |
|---|---|---|
| `flotta.html` (source) | 11.6 KB | 3.9 KB |
| `flotta.css` | 15.6 KB | 5.1 KB |
| `flotta.js` | 5.6 KB | 2.3 KB |
| `data/flotta.json` | 8.5 KB | 2.7 KB |
| `deploy/flotta.html` (generated) | 97.7 KB | 11.3 KB |

The generated page is 97.7 KB raw because the full plan overlay (30 cells) is inlined, exactly as
in every room. It compresses to 11.3 KB.

---

## 16. SEO

| | |
|---|---|
| Route | `/flotta.html` — crawlable, in the sitemap (**41 URLs**, was 40) |
| `<title>` | `A flotta — Duna Belsőépítészet Kft.` |
| `<meta name="description">` | written, 158 chars, names the material and the chapter |
| Canonical | `https://{{domain}}/flotta.html`, substituted from `ceg-adatok.json` |
| Semantics | one `<h1>`, `<section aria-labelledby>`, `<nav aria-label>`, `<ol>` of real `<a>` elements |
| Internal links in | header nav, footer, homepage scene 13, the plan's Hajó wing, all 15 boat project pages |
| Internal links out | 15 project URLs + `/alaprajz.html#hajo` + `dunahajok.hu` |
| Existing URLs | **unchanged.** All 30 `/referenciak/<slug>/` pages verified present and rendering. |

**`sajatDomainEl` is still `false`**, so the build emits site-wide
`X-Robots-Tag: noindex, nofollow` in `_headers`, plus the permanent `/lab/*` rule. This is the
correct development state and was deliberately not changed — but it means **the Fleet, like every
other route, is `noindex` until the flag is flipped at go-live.** This is the fourth phase in a row
carrying that item.

### Navigation change

`Hajóépítés ↗` (an external link to `dunahajok.hu`) left the primary nav; **`Flotta`** took its
place. This is Phase 1 §12.5 and §19.1 executed: the external commercial site no longer pulls the
visitor away at the exact moment the site is making its strongest argument. `dunahajok.hu` remains
reachable from the footer and from the Fleet's closing section, where it is now framed as what it
is — where you buy the two types that are still built. No URL was removed; `Alaprajz` and `Flotta`
were also added to the footer's page list.

---

## 17. Data Architecture

```
data/projektek.json   UNCHANGED CONTRACT. Client-owned, admin-writable.
                      Phase 4 touched 166 `alt` values and nothing else.

data/terek.json       UNCHANGED in this phase.

data/flotta.json      NEW. Studio-owned. Keyed by slug, purely additive.
                      $sema · nyitas.keretek[] · hajok[]
```

Same reasoning as `terek.json`, restated because it is still the load-bearing decision:
`admin.js:827 tisztit()` rebuilds every project from a fixed field list on every save, so anything
added to `projektek.json` would be silently deleted the next time the client edits that project.
`admin.js`, `admin.html` and `admin.css` are **byte-identical** to what the client uses today
(verified with `git diff`).

**Absence is safe.** Delete `data/flotta.json` and the build produces 42 pages, no `/flotta.html`,
no fleet links, no sitemap entry — and everything else is unchanged.

### Validation, and one bug found by testing it

The build hard-fails if `flotta.json` names a project or an image file `projektek.json` does not
contain, if an aperture is not four numbers, if `rang` is not one of three values, or if a station
is not one of five. **Plus one check that only makes sense here:**

> If the client adds a boat in the admin and it is not in `flotta.json`, the build stops.

A missing row would otherwise produce a silently shorter fleet that nobody would notice. Verified —
removing Jégvitorlás from the data file produces:

```
!! HIBA — a data/flotta.json nem illeszkedik a projektekhez:
  jegvitorlas: hajó kategóriájú projekt, de nincs a data/flotta.json hajok listájában
```

Writing that test found a real bug in the first implementation: `keretEllenor()` pushed fleet frame
errors into `terHiba`, an array that had **already been evaluated** two sections earlier, so a
nonexistent frame image passed the build silently. `keretEllenor` now takes its target array as a
parameter. Re-verified: pointing frame 2 at `99.jpg` stops the build with the exact path.

### Separation

```
CONTENT       flotta.html (copy) · projektek.json (client)
DATA          data/flotta.json (studio)
MARKUP        build.mjs §4/d — server-rendered, no-JS complete
PRESENTATION  rendszer.css · ter.css · flotta.css
MOTION        kuszob.js — untouched
BEHAVIOUR     ter.js (untouched) · terv.js (untouched) · flotta.js (fade, register, filter)
```

`flotta.js` contains **no boat name, no file path and no aperture value.** Neither does `ter.js`,
which drives the whole opening. Adding a sixteenth boat is a `flotta.json` entry and a build run.
Adding a seventh station to the opening is one array element.

---

## 18. Validation

### Fleet

| Check | Result |
|---|---|
| Route builds and serves | ✓ 43 pages (was 42) |
| Six stations advance on scroll | ✓ 1 → 2 → 4 → 5 → 6 with correct captions, counters and project links |
| Every threshold is ABLAK | ✓ from data; `data-kuszob="ablak"` on all six |
| All 15 boats discoverable | ✓ 15 rows, 15 real links, no boat omitted (build-enforced) |
| No boat invented | ✓ every row joins to a `projektek.json` slug |
| Project links work | ✓ all 15 resolve to existing `/referenciak/<slug>/` |
| HABLEÁNY connection | ✓ opens on it; room and document carry 3 links back |
| Plan connection | ✓ `Esc` opens the overlay; Hajó wing links to the Fleet |
| Filter | ✓ AND semantics; Váz 7, Váz+Belső 6, Mind 15 |
| Mobile 390×844 | ✓ no horizontal overflow, thumb-zone controls, 44px targets |
| Keyboard | ✓ arrows step, `Esc` opens/closes, focus returns, background `inert` |
| Reduced motion | ✓ 200ms fade, masks reset, 0% travel, story intact |
| No-JS | ✓ h1, 6 scene blocks, first frame, 15 links, 6 filter buttons, 30 plan cells, 3 exits |
| Console | ✓ no errors, no warnings |

### Existing world

| Check | Result |
|---|---|
| Homepage | ✓ frames 01 → 13, day→night at 11, paper at the section cut |
| Plan | ✓ 30 cells, filter, overlay, `#hajo` deep link |
| HABLEÁNY room | ✓ viewpoints 01 → 05, per-viewpoint hashes, night register |
| Domus Collis / Bodajki rooms | ✓ load, no console errors |
| All 30 project URLs | ✓ present, unchanged |
| Ordinary project pages | ✓ e.g. `/referenciak/jegvitorlas/` renders as before, plus one fleet link |
| `/referenciak` filtering | ✓ `szuro.js` untouched |
| Admin | ✓ `admin.js` / `admin.html` / `admin.css` byte-identical |
| Build guards | ✓ missing boat, nonexistent frame, unknown station — all three stop the build |

### Files not modified in this phase

`admin.js` · `admin.html` · `admin.css` · `kuszob.js` · `ter.js` · `terv.js` · `fooldal.js` ·
`fooldal.css` · `terv.css` · `rendszer.css` · `style.css` · `script.js` · `fonts.css` ·
`consent.js` · `szuro.js` · `galeria.js` · `urlap.js` · `data/terek.json` ·
`data/ceg-adatok.json` · `data/palyazatok.json` · `partials/projekt-sablon.html` ·
`partials/ter-sablon.html` · the Worker · the form · the fonts.

No source image was resized, recompressed, renamed or deleted.

---

## 19. Known Limitations

1. **`/flotta.html` desktop first load is 479 KB against a 350 KB budget**, and 268 KB of it is one
   AVIF. The fix is a per-image quality override in the build (this frame at q38 would land near
   180 KB) or a replacement photograph. It was not done here because changing the global AVIF
   setting would re-encode all 444 derivatives and silently move every number Phase 3 measured.
   Mobile is inside budget at 295 KB.
2. **The archive's watermark is on almost every boat frame.** `Duna HAJÓK` in pale blue, usually
   centred. At index-thumbnail size it is invisible; at full bleed it competes. Frame selection
   mitigated it (§5) and nothing was retouched away — it is the archive's own provenance mark, and
   removing it from a client asset on our own initiative would be the wrong call. It remains the
   strongest argument for re-photographing the finished boats.
3. **Camera date stamps are burned into some frames** (Boesch 560, Meyer 2, Volvo Penta —
   `'02`–`'04`). They are visible in the Fleet's index thumbnails and in frame 4's lower corner.
   They are also the only dating evidence the boat archive contains. They are **not** presented as
   project years anywhere, because a camera clock is not a client-confirmed fact.
4. **The Rivális cabin frame is 0.46 MP shown full-bleed at 1440px** and is visibly soft. It is
   also the only photograph in the entire archive of a boat interior that reads as a *room* other
   than HABLEÁNY and the 6.1 Cabin, so it carries the chapter's turn. Nothing was upscaled or
   sharpened. If it fails review, the honest replacement is `duna-hajok-6-1-cabin/15` (the berth),
   which is 1.82 MP but is a modern boat, so the sequence would lose its archive register.
5. **130 alt texts are still archive labels** — every non-boat project. §20 gives the order.
6. **`leiras` is empty for all 30 projects**, and for all 15 boats. Every dossier still says so out
   loud. Unchanged since Phase 0 and still the single biggest risk to the submission.
7. **No boat has a year, a location, a client or a length.** The Fleet shows type and photo count
   because those are derivable; everything else would have been invented.
8. **Bojan – Harcos has three photographs and no station.** It is in the Fleet because omitting a
   real DUNA boat to make the index prettier would be the distortion. It looks thin because it is.
9. **`sajatDomainEl` is still `false`** — the whole site, Fleet included, is `noindex` until
   go-live. Fourth phase carrying this.
10. **The Fleet's no-JS fallback shows one photograph, not six.** All six text blocks, the full
    index and every link are there, but frames 2–6 ship with `hidden`. This is the same behaviour
    as the homepage (Phase 3 §18 described it more generously than the markup warrants).
11. **`flotta.css` duplicates ~40 lines of scene typography from `fooldal.css`.** Deliberate: the
    two files are never loaded together, and the duplication means a homepage redesign cannot break
    the Fleet. It is still duplication.
12. **The full font set is 124.6 KB and the Fleet requests all of it** — unchanged from Phase 3
    limitation #3, and unchanged in cause.
13. **The plan's `-400` win is partial (−38%)** because its span-2 and span-3 cells are genuinely
    430–645 px wide. Reaching further needs a `-600` step, which is a new derivative for every
    cover.

---

## 20. Phase 5 Requirements

### Blocking questions, in order

1. **Hotel Domus Collis image rights.** Unchanged since Phase 0, now blocking the homepage as well
   as a room. Third phase asking.
2. **Will copy be commissioned?** Thirty empty `leiras`, fifteen of them boats. The Fleet
   demonstrates that structure can carry a chapter without prose; it cannot carry the whole site.
3. **Can the boats be re-photographed?** §19.2. Six good photographs of two finished hulls —
   without a watermark, at 20 MP — would let the archive boats stand full-bleed instead of at
   index scale.
4. **Can the workshop be photographed?** Now doubly valuable: the Fleet proved the *making* is the
   strongest thing in the archive, and there are only seven boats it can show it for.
5. **Do camera masters exist for HABLEÁNY?** Decides the depth-map pipeline. Unchanged.
6. **English version?** A routing decision that must precede the work. Fourth phase asking.

### What new photography would unlock, specifically

| Photography | Unlocks |
|---|---|
| 2 hulls under construction, 20 MP, no watermark | frames 2 and 3 of the Fleet at full quality; a `szint: 1` treatment for the making |
| The finishing department in use | the missing station between *váz* and *felület*, and the craft chapter |
| Any boat interior other than HABLEÁNY / 6.1 / Rivális | a second traversable vessel — currently the archive supports exactly one |
| One boat, one day, launch to water | the only sequence that could make ROOM → VESSEL → MOVEMENT one continuous shot |

### Build, in this order

1. **The remaining 130 alt texts.** Order: `fuzio-a-tajjal` (20), `belvarosban-nyugalomban` (15),
   `csaladi-haz` (14), `budai-haz` (12), `garzon-plaza-hotel` (11), `mercedes-plato` (10),
   `zirci-apatsag` (10), `kristaly-etterem` (10), `ottevenyi-kastely` (8),
   `szent-laszlo-…` (6), `vatikani-diszdoboz` (5), `domus-pellegrini-…` (5),
   `fafaragasok` (4). Rule, as applied to the 166 written in this phase: describe only what is
   visible in the photograph; never repeat the project title; never write marketing copy; leave the
   description out rather than guess at a material, a place or a date.
2. **The one-image quality override** in the build (§19.1) — closes the Fleet's desktop budget.
3. **The craft chapter as its own route** (`/metszet`), with the homepage's section cut as its
   opening. The Fleet's *váz → felület* pair is the second half of the same argument and should
   cross-link.
4. **The About rewrite** toward the founder's-letter register (Phase 1 §13).
5. **A fourth room**, if new photography arrives — a `terek.json` entry and nothing else.
6. **The depth-map pipeline**, if question 5 is yes.

### Carried forward as hard rules

- `data/projektek.json` stays the client's surface; `admin.js` / `admin.html` / `admin.css` remain
  byte-identical to what the client uses today.
- Server-rendered HTML first, spatial layer second, on every route.
- One transition, three types. A second transition type must displace something.
- Reduced motion, keyboard and no-JS are release blockers.
- Nothing is asserted that the archive cannot show.
- **`sajatDomainEl` must be flipped at go-live** — the build still emits site-wide `noindex`.

---

## Appendix — Changes made during Phase 4

**Created (5):**
`flotta.html` · `flotta.css` · `flotta.js` · `data/flotta.json` · `docs/PHASE-4-FLEET.md`

**Modified (6):**
`build.mjs` (fleet validation §2/b, fleet priority images, fleet generators §4/d, the boat→fleet
return link, the plan's Hajó-wing link, per-cell `sizes` on the plan, `-400` + measured `sizes` on
the grid card, `keretEllenor` target-array fix, sitemap, assets, stamping) ·
`ter.css` (**mobile touch targets only** — 44px, §13) ·
`index.html` (scene 13 now links to the Fleet) ·
`partials/fejlec.html` (`Hajóépítés ↗` → `Flotta`) ·
`partials/lablec.html` (`Alaprajz` and `Flotta` added to the page list) ·
`data/projektek.json` (**166 `alt` values only** — a field the admin preserves)

**Not modified:** `kuszob.js`, `ter.js`, `terv.js`, `fooldal.js`, `fooldal.css`, `terv.css`,
`rendszer.css`, `style.css`, `script.js`, `fonts.css`, `consent.js`, `szuro.js`, `galeria.js`,
`urlap.js`, `admin.*`, `data/terek.json`, `data/ceg-adatok.json`, `data/palyazatok.json`,
`partials/projekt-sablon.html`, `partials/ter-sablon.html`, the Worker, the form, the fonts.

**Assets:** no source image was resized, recompressed, renamed or deleted. New derivatives only.

**Dependencies:** none added.

**Routes:** `+/flotta.html`. All 30 project URLs unchanged. Sitemap 40 → 41.
