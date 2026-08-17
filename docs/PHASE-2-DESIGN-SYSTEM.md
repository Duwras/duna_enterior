# DUNA — THE LIVING INTERIOR
# PHASE 2 — DESIGN SYSTEM

**Date:** 2026-08-15
**Scope:** Visual and interaction foundation, the Threshold Pass technical foundation, the new
spatial data architecture, four independent performance fixes, and one isolated prototype route.
**Not in scope:** the seven-scene homepage, the HABLEÁNY room proper, the plan, the fleet, the
craft chapter, About, Contact. Those are Phase 3+.
**Basis:** [PHASE-0-AUDIT.md](PHASE-0-AUDIT.md), [PHASE-1-EXPERIENCE-ARCHITECTURE.md](PHASE-1-EXPERIENCE-ARCHITECTURE.md).

**Stack decision made here:** no migration. Phase 1 §22 sketched Vite + TypeScript + Three.js +
Lenis + GSAP. None of it was installed, and the Threshold Pass does not need any of it — see
§10.3 for why, and §21 for what that costs us. The repository still has **one devDependency**
(`sharp`) and **zero runtime dependencies**.

---

## 1. Visual Principles

The existing art direction in `style.css` — *"Műhelyrajz"*, workshop drawing: warm paper ground,
drafting grid, thin-stroke Garamond — was found correct and was **not replaced**. Phase 2 adds
what the concept needs and nothing else:

| Principle | What it means in the code |
|---|---|
| **The photograph is the material** | Interface elements sit on the *edge* of the frame, never in a card over its middle. The only full-surface element over a photograph is a two-band scrim, and it exists solely for contrast (§5). |
| **The interface has a night** | A second register (`[data-hangulat="ejjel"]`), not a dark-mode toggle. The visitor does not choose it; they walk into it. |
| **One accent, and it has a reason** | The accent is functional (state, focus, the active mark) and, inside a room, is drawn from that room's own dominant material via `terek.json`. |
| **Quiet by subtraction** | Five typographic roles, ten spacing steps, six durations, three easing curves. Anything not on the list has to displace something. |
| **Uppercase is a tool, not a look** | Uppercase is reserved for technical metadata and UI controls. Titles and body are never uppercased. |
| **Depth is photographic, not synthetic** | No geometry, no shader, no gradient "3D". Depth comes from splitting one photograph along its own perspective and moving the pieces at different rates (§9). |

---

## 2. Typography

**Decision: no new typeface, no new weight.** The audit's largest single payload was the font
set; adding a face would have paid for the design system with the thing the design system is
supposed to fix. Both existing families carry all five roles.

`rendszer.css` defines five roles. Each has a token triple (size / line-height / tracking) and a
matching class, so the role is enforceable and not merely documented.

| Role | Family | Weight | Size | Line-height | Tracking | Class |
|---|---|---|---|---|---|---|
| **DISPLAY** | Cormorant Garamond | 300 | `clamp(2.5rem, 6vw, 5.1rem)` | 1.04 | −0.012em | `.tipo-cim` |
| **DISPLAY 2** | Cormorant Garamond | 300 | `clamp(1.85rem, 3.9vw, 3.1rem)` | 1.10 | −0.012em | `.tipo-cim-2` |
| **EDITORIAL** | Cormorant Garamond | 400 | `clamp(1.12rem, 1.7vw, 1.42rem)` | 1.62 | — | `.tipo-vezeto` |
| **BODY** | Archivo | 400 | 1rem | 1.70 | — | `.tipo-folyo` |
| **TECHNICAL** | Archivo | 500 | 0.69rem | 1.35 | 0.24em, uppercase | `.tipo-muszaki` |
| **DATA** | Archivo | 400 | 0.72rem | — | 0.04em, `tabular-nums` | `.tipo-adat` |
| **UI** | Archivo | 500 | 0.74rem | 1 | 0.16em, uppercase | `.tipo-ui` |

DATA is a deliberate seventh: counters, coordinates and measurements need tabular figures and
must **not** be uppercased — `01 / 05` should not shout.

**Line length.** `--hossz-szoveg: 68ch` (body), `--hossz-vezeto: 46ch` (lede). Both applied by
the role classes, not per component.

**Accessibility constraint, encoded as a token.** `--display-min: 24px`. Cormorant Light 300 is
never used below that size — the audit flagged its stroke weight on low-DPI Android and it was
right. Anything smaller uses Archivo.

**Signature retained.** Setting the last line of a headline in italic (*"több száz tér."*) is
treated as a rule of the system, not an accident of one page.

---

## 3. Color

**Decision: no new palette. One new register.** The existing eight-value palette in
`style.css :root` is unchanged and remains the single definition of the raw colours.
`rendszer.css` adds a **semantic layer** on top of it, so one component can live in both
registers without a second stylesheet.

### Semantic tokens (the layer components actually use)

| Token | Day | Night |
|---|---|---|
| `--alap` | `--paper` `#fbf8f3` | `--ejjel` `#0e0b07` |
| `--alap-2` | `--paper-2` `#f4efe6` | `--ejjel-2` `#171208` |
| `--szoveg` | `--ink` `#1a150f` | `--ejjel-szov` `#e8dfd1` |
| `--szoveg-2` | `--ink-2` `#4c4238` | `--ejjel-szov2` `#b9ab97` |
| `--halk` | `--smoke` `#857a6c` | `--ejjel-halk` `#8a7c6a` |
| `--vonal` | `--line` `#ded3c3` | `rgba(232,223,209,.16)` |
| `--akcent` | `--brass` `#7e5f35` | `--oak` `#c2884a` |
| `--fokusz` | `--brass` | `--oak` |

Switching is one attribute: `[data-hangulat="ejjel"]`.

### Contrast (measured, not assumed)

| Pair | Ratio | Use |
|---|---|---|
| `#1a150f` on `#fbf8f3` | 15.4:1 | day headings |
| `#4c4238` on `#fbf8f3` | 8.4:1 | day body |
| `#7e5f35` on `#fbf8f3` | 5.9:1 | day accent, focus ring |
| `#e8dfd1` on `#0e0b07` | 14.4:1 | night headings |
| `#b9ab97` on `#0e0b07` | 8.1:1 | night body |
| `#c2884a` on `#0e0b07` | 6.4:1 | night accent, focus ring |
| `#857a6c` on `#fbf8f3` | 3.6:1 | **secondary only, ≥16px** — not for body copy |

The accent flip exists for exactly this reason: brass fails on ink, oak fails on paper.

### The material accent

`--anyag` defaults to `--akcent`, and a room overrides it from its own `anyagok[]` /
`anyagszin` in `terek.json`. This is the only place a colour is allowed to be project-specific,
and it has a functional justification: the interface takes its accent from the material the
visitor is standing in.

### Type over photography

Never relies on the photograph. `--fatyol-lagy` / `--fatyol-eros` drive a two-band scrim
(top 0–26%, bottom 60–100%) that leaves the middle of every frame untouched, plus a
`text-shadow` on overlay type. HABLEÁNY has a white ceiling and a pale oak floor — both bands
were required, and both were verified against real frames rather than assumed.

**No decorative gradients.** The only gradients in the system are the scrim and the depth masks;
both are structural.

---

## 4. Grid / Spacing

A fixed scale for detail, fluid measures for page structure. Both in `rendszer.css`.

```
--space-1  4px     --space-6  32px
--space-2  8px     --space-7  48px
--space-3  12px    --space-8  64px
--space-4  16px    --space-9  96px
--space-5  24px    --space-10 144px
```

| Measure | Value | Role |
|---|---|---|
| `--margo` (= existing `--gut`) | `clamp(20px, 4.6vw, 76px)` | page side margin |
| `--ritmus` (= existing `--blokk`) | `clamp(56px, 9vh, 118px)` | section rhythm |
| `--szeles` (= existing `--max`) | `1360px` | contained content width |
| `--keret` | `clamp(14px, 2.4vw, 34px)` | **spatial inset** |
| `--koz` | `clamp(14px, 2vw, 28px)` | gutter |

`--keret` is the one genuinely new measure and it carries an idea: labels inside a room are
inset from the **image** edge, not from the page margin, because they belong to the room and not
to the document. It is deliberately smaller than `--margo`, which is what makes a full-bleed
frame read as a space rather than as a wide picture.

**Full bleed** is the default inside a room (`.szinpad`, 100svh, `overflow: hidden`).
**Contained** is the default everywhere else, unchanged from the existing site.

---

## 5. Spatial UI

The rule: *the interface never competes with the room.* Concretely, in `ter.css`:

| Element | Treatment | Position |
|---|---|---|
| Project / room label | eyebrow in TECHNICAL + hairline rule, room name in Cormorant 300 | top-left, at `--keret` |
| Dossier control | 1px outlined button, `Esc` hint set in the button | top-right, persistent |
| Technical strip | `Nézőpont 03 / 05 · Idő · Anyag` in DATA, tabular figures | bottom-left |
| Next threshold | threshold *type* in TECHNICAL + destination in UI + a rule that lengthens on hover | bottom-right |
| Enfilade indicator | hairline marks, one per viewpoint; the current one is longer and oak | left edge (desktop), under the title (mobile) |
| Gate | a 13px hairline square + one word, label on hover/focus, square rotates 45° | positioned in the frame from data |

No floating cards. No panels over the middle of a photograph. No pulsing dots. The single
translucent surface in the whole spatial layer is the dossier, and it is a document, not chrome.

**A gate is a real `<button>`** positioned over the image — never canvas hit-testing — so it is
tabbable, focusable and announced. Gates hide themselves during a threshold pass, because a
button whose position is being animated is lying about where it is.

---

## 6. Navigation

The visitor must always be able to answer three questions. Each has exactly one answer in the UI:

| Question | Answer |
|---|---|
| **Where am I?** | The room label (top-left) and the counter `03 / 05` (bottom-left). |
| **What is ahead?** | The next-threshold control names the *type* (Ajtó / Ablak / Kapu) and the *destination* by name. The enfilade indicator shows how many spaces exist and which one this is. |
| **How do I leave?** | The dossier control is persistent, top-right, bound to `Esc`, and the dossier contains the link out to the ordinary project page. |

**Movement.** Vertical scroll advances the enfilade; horizontal swipe steps between real camera
positions; `←`/`→` do the same on a keyboard; the indicator marks jump directly; gates jump to a
named viewpoint or open the dossier.

**Scroll is never hijacked.** The stage is `position: sticky` inside a section of real height
(one viewport per viewpoint). Scroll position remains the source of truth, the scrollbar tells
the truth, and touch momentum stays native. The viewpoint change is a *consequence* of scrolling,
not a replacement for it.

**The enfilade is not a dead end.** At the last viewpoint the forward control reads
"Enfilád vége — Vissza az első térbe" and does exactly that.

The plan (`/alaprajz`) does not exist yet; in the prototype the dossier occupies its slot and its
`Esc` binding. Phase 3 promotes the plan into that position and the dossier moves to a secondary
control.

---

## 7. Project Dossier

Every room has a plain-HTML twin. It is not a degraded fallback — it is the project's
architectural document, and it is what search engines, screen readers and no-JS visitors get.

**Visual language:** always the paper register, even at night. A document is something you read,
not an atmosphere. Cormorant 300 title, one editorial lede, a two-column fact list ruled top and
bottom, materials as outlined chips, the threshold list, then the complete gallery.

**Honesty rule, encoded:** fields that do not exist render as *"nincs adat"* in italic smoke —
they are never invented, never hidden, never filled with the project title. Today that means
`Helyszín`, `Év`, `Megbízó`, `Alapterület`, `Hatókör` and `Fotó készítője` all show as missing
for HABLEÁNY, which is the accurate state of the archive (Phase 1 open question 2).

**Server-rendered and open by default.** The panel ships in the HTML with no `hidden` attribute;
`ter.js` is what slides it away. Kill JavaScript and the page is a complete project document.

---

## 8. Image System

| Treatment | Where | Implementation |
|---|---|---|
| Full bleed | rooms | `object-fit: cover` in a 100svh stage |
| Contained | dossier gallery | `aspect-ratio: 4/3`, `align-items: start` on the grid |
| Near / mid / far | rooms | §9 |
| Flat | exterior and object frames | `data-lapos` — one layer, no masks |

**Responsive strategy.** Room frames carry `srcset` with the build's `-800` and `-1400`
derivatives and `sizes="100vw"`, so a 375px phone fetches the 800px file and a desktop fetches
the 1400px one. Explicit `width`/`height`, `decoding="async"`, `loading="lazy"` on everything
except the first frame, which is `fetchpriority="high"` because it is the LCP element.

**Loading.** Only the current viewpoint ±1 has real `src` attributes; the rest carry `data-src`
and are promoted by `ter.js` on approach. Five viewpoints therefore cost three images, not five.
The three layers of one viewpoint share one URL and therefore one fetch.

**Source assets are untouched.** Nothing was resized, recompressed, renamed or deleted in
`img/`. The build generates derivatives into `deploy/` as it always did.

---

## 9. Depth / 2.5D

### The decision: authored apertures, not estimated depth maps

Phase 1 §6.4 specified an offline monocular depth-estimation pass (Depth Anything class) over
~40 frames, hand-corrected. That pipeline is still the right long-term answer, but it needs a
model, a GPU pass and a retouching budget, and it is not a prerequisite for the transition.

What these photographs *do* contain, for free, is one-point perspective. In the HABLEÁNY salon —
and in the Domus Collis corridors — the near objects (door jambs, mahogany posts, window
mullions, ceiling arches) are at the **edge of the frame**, and the far space is in the
**opening in the middle**. So the depth split is authored from the photograph itself:

```jsonc
"nyilas": [0.66, 0.42, 0.19, 0.25]   // x, y, rx, ry — normalised
```

Four numbers per frame, read off the actual image. From them, `ter.css` derives:

| Layer | Mask | Base scale | Pointer travel |
|---|---|---|---|
| **TÁVOLI** (far) | none — the whole photograph | 1.000 | 0.25% |
| **KÖZÉP** (mid) | transparent inside 2.2× the aperture | 1.025 | 0.75% |
| **KÖZELI** (near) | transparent inside 3.6× the aperture | 1.055 | 1.70% |

The same four numbers drive the Threshold Pass reveal (§10). That is the point: the next room
appears exactly where the opening was, because both read the same authored geometry.

**Why it does not look like a game:** the layers are cut from one photograph, they never rotate,
the pointer travel is under 2% of frame width, and the damping is a 720ms CSS transition — so the
image always arrives late and slows to a stop. There is no roll, no FOV change and no
displacement of pixels within a layer.

**Graceful degradation:** `data-lapos` on a viewpoint disables the mid and near layers entirely —
a flat photograph, still fully navigable. Reduced motion sets all pointer travel to 0%.

**Upgrade path preserved:** when real depth maps exist, only the mask *source* changes
(`radial-gradient` → `mask-image: url(...)`). Layer structure, timing, physics and the whole
threshold implementation stay as they are. The `melyseg` field is already reserved in the schema.

---

## 10. Threshold Pass

`kuszob.js`. One interaction; every location change on the site is this interaction.

### 10.1 The physics

Not a set of tuned scale curves — a camera moving forward, with each layer scaled by its own
depth:

```
scale(layer) = z / (z − travel)
```

| Layer | z | Meaning |
|---|---|---|
| near | 1.60 | the jamb / post / mullion, at arm's length |
| aperture | 1.90 | the plane of the opening — what we pass through |
| mid | 6.00 | furniture, walls |
| far | 14.00 | the space beyond the opening |

This is the whole reason it does not read as a crossfade: the near layer barely moves, then
accelerates past the camera, while the far layer hardly changes — which is what walking through
a door actually looks like. A single shared easing curve cannot produce that relationship.

### 10.2 The timeline (900 ms)

| Phase | ms | Outgoing | Incoming |
|---|---|---|---|
| Approach | 0–260 | near layer begins to grow | held, opacity 0 |
| Pass | 260–620 | near layer accelerates past the camera and fades (30–62% of the timeline) | becomes visible at 16–34% — **inside the aperture, while it is still small** — then the aperture widens |
| Settle | 620–900 | last remnant fades at 74–94% | scale eases 0.945 → 1.000 on the water curve; nothing overshoots |

The camera curve is `cubic-bezier(0.42, 0.16, 0, 1)`: slow start, the movement in the middle, long
deceleration. The system's `--ease-water` is used for the settle only — applied to the whole pass
it front-loads the motion and empties the middle of the transition.

### 10.3 How the reveal is implemented without WebGL

The incoming room sits in a `.nyilas` wrapper whose `mask-image` is a hard-edged ellipse at the
outgoing frame's authored aperture. The wrapper is **scaled up** while the room inside it is
**scaled down by exactly the inverse** — so the photograph stands still and only the *hole* grows.

The inverse is supplied as 17 sampled keyframes, because interpolating `1/x` between two
keyframes is not the inverse of interpolating `x` (a two-keyframe version is ~40% wrong at the
midpoint). With 17 samples the error is under 0.3%.

Consequence: the entire pass is `transform` + `opacity`, so it stays on the compositor. No
per-frame mask repaint, no WebGL context, no `requestAnimationFrame` loop, no library. This is
why the Three.js migration was not needed to build the signature interaction.

### 10.4 Three types, one physics

| Type | Travel | Near layer leaves | Lateral | Means |
|---|---|---|---|---|
| **AJTÓ** | 1.35 | 30–62% | — | another room |
| **ABLAK** | 1.20 | 26–56% | 3.4% | something that moves |
| **KAPU** | 1.55 | 34–66% | — | a change of chapter |

Same code path, same curve, three rows in one table. The aperture reaches 3.45× (ajtó),
2.71× (ablak) and 5.43× (kapu) — the gate opens widest, which is what makes a chapter change feel
like one.

### 10.5 Both directions

Backwards is not a second animation. The forward timeline is built with the roles swapped, then
played in reverse at `playbackRate = −1.875` — 900 ms of choreography in 480 ms. The visitor sees
themselves walk back out through the same door, and the speed hierarchy of Phase 1 §20.7 falls
out of the arithmetic. *(Verified: 7 animations, rate −1.875, starting at t=900.)*

### 10.6 Reduced motion

Short-circuits before any of the above: a 200 ms opacity fade, no masks, no transforms, no
sampling. The transition still *communicates* that the location changed, which is information,
not decoration.

---

## 11. Motion System

All in `rendszer.css`. Six durations, three curves, and a rule that a seventh has to displace one.

```
--motion-gyors    120ms   hover, focus, small state
--motion-normal   240ms   fades
--motion-tipus    520ms   type reveal (40ms stagger)
--motion-vissza   480ms   backwards — the familiar move is faster
--motion-terv     620ms   plan → room, panel slide
--motion-kuszob   900ms   THE THRESHOLD — the slowest thing on the site

--ease-water   cubic-bezier(.16, .84, .24, 1)   threshold settle, spatial moves
--ease-lagy    cubic-bezier(.4, 0, .2, 1)       fades
--ease-tipus   cubic-bezier(.2, .7, .2, 1)      type
```

The most important move is the slowest. No bounce, no overshoot, no spring, anywhere.

**Where motion is deliberately absent:** a room at rest does not move at all. There is no idle
drift in the prototype — HABLEÁNY's 0.4%/s float (Phase 1 §10) belongs to the finished room, not
to a transition test, and adding it here would have made the pass harder to judge.

---

## 12. Cursor

A 16px hairline square, fine pointers only, only inside a stage. Three states:

| State | Appearance | Means |
|---|---|---|
| default | 16px outlined square | you are looking |
| over a gate | 26px, oak, rotated 45° | you can enter |
| over a control | 30px, oak | you can act |
| off-stage | invisible | the ordinary cursor is back |

It is an instrument, not a mascot: no trail, no lag, no blend mode, no growth on click. Disabled
entirely on touch and under reduced motion.

---

## 13. Mobile

Designed first, and it is a different instrument — not a smaller desktop.

| Breakpoint | Behaviour |
|---|---|
| ≤ 720px | spatial layer switches to the mobile arrangement |
| ≤ 900px | existing site's breakpoint, unchanged |

**Layout.** One column. The room name and the enfilade indicator sit at the top; everything
touchable is in the bottom third: the technical strip, the next-threshold control, and a
full-width dossier button. Touch targets are ≥ 44px.

**Gestures.** Vertical scroll advances the enfilade (native, never hijacked). Horizontal swipe
(48px threshold, and only when clearly more horizontal than vertical) steps between real camera
positions — on a phone, *the photographs are the camera*. Pinch, long-press and two-finger
gestures are left to the OS.

**No WebGL, on any platform.** The depth system is CSS masks and transforms, so there is nothing
to opt into and nothing to download.

**Gate labels are always visible** under `@media (hover: none)` — a label that only appears on
hover does not exist on a touch screen.

**Measured first load, `/lab/threshold`, 375px viewport:**

| | Bytes |
|---|---|
| HTML + CSS + JS (gzip) | 32.6 KB |
| Fonts (3 faces + 3 ext slices) | 80.7 KB |
| First frame (`05-800.jpg`, chosen by `srcset`) | 104.2 KB |
| **Total** | **217.5 KB** — within the ≤ 300 KB budget |

Desktop pulls the 1400px frame instead (269.4 KB), giving **382.7 KB** — **over** the ≤ 350 KB
desktop budget by ~33 KB. See §19 and §21.

---

## 14. Accessibility

| Requirement | Implementation |
|---|---|
| Semantic HTML | One `<h1>` per route (in the dossier, where the document is), real `<nav>`, `<aside>`, `<dl>`, real `<button>`s |
| Keyboard | Everything reachable in DOM order. `←`/`→`/`↑`/`↓` move through viewpoints; `Esc` closes the dossier, otherwise returns focus to the persistent control; gates activate with Enter/Space |
| Visible focus | Existing `:focus-visible` rule; `--fokusz` flips to oak in the night register so the ring never lands brass-on-ink |
| Skip link | Present, and it *opens* the dossier rather than jumping into a slid-away panel |
| Announcements | `aria-live="polite"` region announces the room name and its context on every change. Spatial state is never narrated — it is decoration |
| Images | Every layer image is `alt=""` + `aria-hidden` (they are three copies of one picture); the real alt text lives once, in the dossier gallery, from `projektek.json` |
| Indicator | `aria-current="true"` on the active viewpoint; each mark has a hidden text label ("3. nézőpont — Zárt szalon, tat felé") |
| Panel state | Closed dossier uses `visibility: hidden`, so it is out of the tab order and out of the accessibility tree |
| Contrast | §3, measured. Type over photography always has a scrim *and* a text shadow |
| No-JS | The first frame, the complete overlay (server-rendered with the first viewpoint's real values) and the fully open dossier with all 23 photographs |

**82 junk alt texts: 53 fixed.** Every image of the three Living-Interior candidate projects
(HABLEÁNY 23, Hotel Domus Collis 20, Bodajki Vadászkastély 10) now has a written description
based on inspecting the actual photograph. The remaining ~38 are repeated project titles on the
archive boat sets, which are wrong but not machine noise; they are listed in §21.

---

## 15. Reduced Motion

An intentional mode, not a switch-off. Under `prefers-reduced-motion: reduce`:

- every duration token collapses to ≤ 200 ms (`--motion-kuszob` included)
- all three pointer-travel tokens go to `0%` — the depth layers stop responding to the pointer
- `kuszob.js` short-circuits to a 200 ms opacity fade: no masks, no transforms, no sampling
- the layer transition on images is removed outright
- smooth scrolling becomes instant, so keyboard and indicator jumps land immediately
- **navigation, content, labels, gates, the dossier and the visual hierarchy are all unchanged**

The visitor still learns that they changed location — that is information. They simply are not
moved through space to find it out. *(Verified with `matchMedia` forced: correct end state,
masks reset, no console errors.)*

---

## 16. Data Architecture

```
data/projektek.json   UNCHANGED. Client-owned, admin-writable.
data/terek.json       NEW. Studio-owned. Keyed by slug. Purely additive.
img/melyseg/<slug>/   RESERVED. Depth maps, when they exist.
```

**Why separate, restated because it is the load-bearing decision:** `admin.js:827 tisztit()`
rebuilds every project from a fixed field list on every save. Anything we added to
`projektek.json` would be silently deleted the next time the client edited that project. Nothing
in `admin.js`, `admin.html` or `admin.css` was touched in this phase, and `projektek.json`
changed only in `alt` values — which the admin does preserve.

### Schema (only fields Phase 1 justifies)

| Field | Purpose |
|---|---|
| `szint` | 1 room · 2 cinematic · 3 story — from the Phase 1 §5.1 checklist |
| `tipus` | `belso` / `targy` / `jarmu` |
| `sorrend` | position in the curated enfilade |
| `hangulat` | `{ alap, allapotok[] }` — which time states exist |
| `anyagok[]`, `anyagszin` | dominant materials; the room's accent |
| `szobak[]` | `{ id, nev, nezopontok[] }` |
| `nezopontok[]` | `{ id, nev, kep, hangulat, nyilas[4], kuszob{fajta,el}, kapuk[], lapos? }` |
| `reszletek[]` | macro detail frames |
| `adatok{}` | six nullable facts — never invented |
| `szoveg` | 100–200 words, `null` today |

`melyseg` is documented in the schema header and unused — the depth-map upgrade path.

**Join, enforced by the build:** `terek.json` may not reference a project, an image file or a
malformed aperture that `projektek.json` does not support. The build hard-fails with the exact
path. *(Verified: renaming one frame to a nonexistent file stops the build with
`duna-cruises-hableany/nyitott-szalon/orr: nincs ilyen kép (99.jpg)`.)*

**Absence is safe:** with `data/terek.json` removed, the build produces 41 pages and no lab
route, and every existing project renders exactly as before. *(Verified.)*

### Adjacency

No new taxonomy. The seven existing `KATEGORIAK` keys in `build.mjs:30` remain the adjacency
graph; the curated sequence is the array order in `terek.json`. Nothing is hardcoded in the
components.

---

## 17. Design Tokens

One file, `rendszer.css`, loaded on every page between `fonts.css` and `style.css`. It defines
**no styles** — only measures — with one exception: the seven typographic role classes, so a role
is enforceable rather than merely described.

Groups: register (day/night semantic colours) · typography (families, sizes, line-heights,
tracking, line lengths) · spacing (10 steps + 5 structural measures) · motion (6 durations,
3 curves) · depth (3 base scales, 3 travel values, mask softness).

It does **not** re-declare the eight raw colours — it references `style.css :root` through
`var()`, so every value still exists in exactly one place.

---

## 18. Component Foundation

Only what the current architecture actually needs. No speculative library.

| Component | Where | What it is |
|---|---|---|
| `DepthFrame` | `.ter` + 3 × `.ter-reteg` | a photograph split along its authored aperture |
| `ThresholdTransition` | `kuszob.js` → `Kuszob.at()` | the only transition primitive on the site |
| `SpatialLabel` | `.ter-felirat` | eyebrow + rule + room name, edge-aligned |
| `TechnicalLabel` | `.tipo-muszaki` / `.tipo-adat` | uppercase metadata / tabular figures |
| `RoomIndicator` | `.ter-jelzo` | hairline marks, one per viewpoint |
| `Gate` | `.ter-kapu` | a real button placed in the frame from data |
| `Dossier` | `.adatlap` | the accessible twin |
| `Pointer` | `.mutato` | the three-state instrument |

Deliberately **not** built yet: `DunaLogo` (exists in the header partial and needs no change),
`PlanTrigger` (the plan does not exist), `Navigation` (the six-item header is untouched),
`ProjectMeta` / `ProjectTitle` (the existing project template already covers them).

### Separation

```
CONTENT       data/projektek.json          (client-owned)
DATA          data/terek.json              (studio-owned)
MARKUP        build.mjs §5/b               (server-rendered, no-JS complete)
PRESENTATION  rendszer.css · ter.css       (tokens · spatial layer)
MOTION        kuszob.js                    (the threshold, and nothing else)
BEHAVIOUR     ter.js                       (state, input, loading — knows no project)
```

`ter.js` contains no project name, no file path and no aperture value. Adding a second room is a
`terek.json` entry plus a build run.

---

## 19. Performance Changes

All four of the independent fixes from Phase 1 §26 were implemented. None of them depends on the
redesign; all of them improve the site that is live today.

### 1. Unresized hero images → −59 MB from the deployed artifact

`index.html` referenced three source photographs and `design-manufaktura.html` a fourth. Those
four references were the only reason the whole 59 MB `img/projektek/` source tree had to be
deployed. They now point at the build's `-1400` derivatives, and the build no longer copies
project source images at all.

Guarded by a new build step (**6/c**) that scans the generated HTML for any project image
reference without a `-800`/`-1400` suffix and **fails the build**. This exact mistake cannot
come back silently.

**`deploy/`: ~130 MB → 71 MB.**

### 2. Font subsetting: 312 KB → 126 KB (−60%)

`scripts/betuk-metszes.mjs`, run offline like the depth-map pipeline, never in CI. It cuts each
of the ten Google slices down to the glyphs the site can actually contain — gathered from the
repository's own HTML and JSON, plus a Hungarian safety set for what the client may type into the
admin later. 164 glyphs.

Filenames and `unicode-range` are unchanged, so `fonts.css` needed no edit and the browser still
fetches only what it needs. The `latin-ext` slices — which a Hungarian page always pulls because
of `ő`/`ű` — drop from ~32 KB to ~2 KB each.

Originals are preserved in `fonts/forras/` (git-tracked, excluded from deploy).

Plus `<link rel="preload">` for the two above-the-fold faces on every page.

| | Before | After |
|---|---|---|
| All faces | 312.1 KB | 125.8 KB |
| Critical path (Cormorant 300 + Archivo 400 + ext) | ~150 KB | **54.5 KB** |

The ≤ 90 KB target from Phase 1 §18.1 is met for the critical path but **not** for the full set —
126 KB across five faces. Getting under 90 KB in total requires dropping a face; the obvious
candidate is Cormorant 400, but it carries the editorial lede and dropping it would push that
text onto Cormorant 300 below the 24px accessibility floor. **Recommendation: keep five faces and
treat 126 KB as the honest number.**

### 3. Junk alt texts: 53 rewritten

See §14.

### 4. Unreferenced assets: excluded from deploy

`slider-2.png` (906 KB), `ginop-8-3-5.jpg` (386 KB, a duplicate of the `img/palyazat/` copy),
`latvanyterv.jpg`, `ddm-vebre.jpg`, `dunaenterior_logo.png`, `logo2_c.png` — ~1.6 MB, verified
unreferenced across all HTML, CSS, JS and JSON.

**They were not deleted.** They are excluded from the deploy copy by a documented skip list in
`build.mjs`, which is a reversible decision. Deleting a client's asset on the strength of a grep
is not.

### Also added

`_headers` now always emits `X-Robots-Tag: noindex, nofollow` for `/lab/*`, in addition to the
existing site-wide staging header. The lab page carries a `robots` meta tag as a second lock and
is excluded from the sitemap.

---

## 20. Prototype

**Route:** `/lab/threshold` — built from `lab/kuszob.html` only if that file exists, so removing
the `lab/` directory removes the route. Not in the sitemap, `noindex` twice over.

**Project:** Duna Cruises HABLEÁNY, the Phase 1 flagship candidate. Real repository imagery, five
real camera positions, in a sequence that is an argument rather than a demo reel:

| # | Frame | Space | Time | Threshold out | Near layer |
|---|---|---|---|---|---|
| 1 | `05` | Fedélzeti szalon, orr felől | nappal | **AJTÓ** | mahagóni oszlop |
| 2 | `13` | Átjáró a felépítmény felé | nappal | **AJTÓ** | ajtótok |
| 3 | `03` | Zárt szalon, tat felé | nappal | **KAPU** | oszlop és mennyezetív |
| 4 | `20` | Zárt szalon, éjjel | éjjel | **ABLAK** | ablakkeret |
| 5 | `17` | A HABLEÁNY a Dunán | éjjel | — | (flat) |

The KAPU is the day→night chapter change; the ABLAK opens onto the boat from outside, at night,
on the river. The room turns out to have been floating the whole time — Phase 1 §12.3, in five
frames.

### Verified

| Check | Result |
|---|---|
| Threshold pass, forward | ✓ — incoming appears inside the aperture at ~300 ms, spreads outward, settles at 900 ms |
| Threshold pass, backward | ✓ — same timeline, `playbackRate −1.875`, 480 ms |
| All three types | ✓ — AJTÓ ×2, KAPU (day→night), ABLAK (into the exterior) |
| Depth layers | ✓ — masks computed from the authored aperture; pointer travel 0.25 / 0.75 / 1.70% |
| Night register | ✓ — ground, accent and focus ring all flip on the viewpoint |
| Deep link | ✓ — `#tat` opens at viewpoint 3 |
| Keyboard | ✓ — arrows move, `Esc` closes the dossier, gates are focusable buttons, queued targets |
| Reduced motion | ✓ — 200 ms fade, masks reset, correct end state, no errors |
| Mobile 375×812 | ✓ — controls in the thumb zone, indicator under the title, no overlap |
| No-JS | ✓ — first frame + complete overlay + fully open dossier with all 23 photographs |
| Console | ✓ — no errors or warnings |
| Existing routes | ✓ — homepage, `/referenciak`, project pages, admin all unchanged; no broken images |
| Existing admin | ✓ — `admin.js` / `admin.html` / `admin.css` byte-identical; `projektek.json` changed only in `alt` |
| Build validation | ✓ — bad `terek.json` reference and raw-image reference both stop the build |

### Judged against the Phase 2 §23 quality bar

*Does the photography stay dominant?* Yes — the interface occupies the two edge bands and nothing
else. *Does the UI disappear into the space?* Yes, to the point where the enfilade indicator had
to be lengthened twice to stay findable. *Does the threshold feel like crossing a boundary?* Yes
in the enclosed salon, where the perspective is strong and the near layer is a real post; it is
weakest at viewpoint 1, where the aperture is off-centre and the two frames share so much
structure that the middle of the pass briefly reads as a double exposure. *Does it feel like
DUNA?* The night salon (viewpoint 4) is the answer — that frame with this typography is the
project.

---

## 21. Known Limitations

1. **Depth is authored, not measured.** Four numbers per frame instead of a depth map. It works
   because these interiors are one-point perspective; it will work less well on frames that are
   not. The upgrade path is intact (§9) but the depth-map pipeline is still unbuilt, so Phase 1
   §22 STEP A (does 1.86 MP survive true displacement?) remains unanswered.
2. **Desktop first load is 383 KB against a 350 KB budget.** Entirely the 1400px JPEG at 269 KB.
   The fix is AVIF/WebP derivatives with `<picture>`, which is a build change and a CI-time
   change, and Phase 2 was told not to start broad performance work.
3. **The full font set is 126 KB, not ≤ 90 KB.** §19.2 — reaching the target means dropping a
   face, which is a design decision with an accessibility consequence.
4. **~38 alt texts are still the project title repeated** — the archive boat sets
   (Boesch 560/580/640, Arcangeli, Veterán, 6.1 Cabin). Not machine noise, but not descriptions
   either. They need the same pass; they were left because those projects are Level 3 and their
   imagery is 0.54–0.85 MP.
5. **The transition is weakest between frames of the same space.** Viewpoints 1→2 share posts,
   railings and ceiling, so the middle of the pass can read as a double exposure. A hard-edged
   aperture and earlier near-layer fade improved it; frame selection is the real fix, and that is
   art direction.
6. **No `hashchange` handling.** Deep links work on load; changing the hash by hand afterwards
   does nothing. History is `replaceState` only — no per-viewpoint history entries yet.
7. **The whole of `style.css` (9.7 KB gzip) loads on the lab route** although the spatial layer
   uses little of it. Splitting critical CSS is Phase 3.
8. **No plan yet.** The dossier occupies the persistent top-right control and the `Esc` binding.
   The Phase 1 guarantee "the plan is always one key away" is therefore only half kept.
9. **`leiras` is still empty for all 30 projects**, so every dossier says so out loud. Phase 1
   open question 2 is unchanged and is still the biggest risk to the submission.
10. **Only one room exists.** Domus Collis and Bodajki are qualified but unauthored; Domus Collis
    still has the Facebook-CDN rights question (Phase 0 risk #6).

---

## 22. Phase 3 Requirements

### Blocking questions (unchanged from Phase 1, in order)

1. Do camera masters exist for HABLEÁNY? — decides whether real depth maps are worth authoring
2. Can the workshop be photographed? — decides whether the craft chapter is good or extraordinary
3. Will copy be commissioned for 8–10 projects? — every dossier currently admits it has none
4. Hotel Domus Collis image rights — decides whether room #2 exists
5. English version? — routing decision, must be taken before Phase 3, not retrofitted

### Build, in this order

1. **The plan (`/alaprajz`)** — before any further rooms. It is the persistent exit the whole
   architecture promises, and it is the only navigation guarantee currently unmet.
2. **AVIF/WebP derivatives** with `<picture>` + `srcset`. Closes the desktop budget gap and pays
   for itself again on `/referenciak` (1933 KB of covers today).
3. **The seven-scene homepage**, on the foundation this phase produced.
4. **Rooms 2 and 3** — Domus Collis (pending rights) and Bodajki. Each should be a `terek.json`
   entry, frames, and nothing else. *If either needs a code change, this phase failed.*
5. **The depth-map pipeline**, if question 1 is answered yes — swapping the mask source per §9.
6. **Per-viewpoint history** (`pushState` + `popstate`), so browser back plays the reverse pass.
7. **THE FLEET**, the craft chapter, the About rewrite.

### Carried forward as hard rules

- `data/projektek.json` stays the client's surface; the admin is not touched
- server-rendered HTML first, spatial layer second, on every route
- one transition, three types; a second transition type must displace something
- reduced motion, keyboard and no-JS are release blockers, not a final pass
- `sajatDomainEl` must be flipped at go-live — the build still emits site-wide `noindex`

---

## Appendix — Changes made during Phase 2

**Created (8):**
`rendszer.css` · `ter.css` · `kuszob.js` · `ter.js` · `data/terek.json` ·
`lab/kuszob.html` · `scripts/betuk-metszes.mjs` · `docs/PHASE-2-DESIGN-SYSTEM.md`

**Modified (14):**
`build.mjs` (terek.json join + validation, lab route, deploy skip list, raw-image guard,
`_headers`, stamping) · `index.html` and `design-manufaktura.html` (hero images → derivatives) ·
`data/projektek.json` (**53 `alt` values only**) · ten page heads (`rendszer.css` link + two font
preloads) · the ten `fonts/*.woff2` files (subset; originals preserved in `fonts/forras/`)

**Not modified:** `admin.js`, `admin.html`, `admin.css`, `script.js`, `style.css`, `fonts.css`,
`consent.js`, `szuro.js`, `galeria.js`, `urlap.js`, `partials/fejlec.html`,
`partials/lablec.html`, `data/ceg-adatok.json`, `data/palyazatok.json`, the Worker, the form.

**Assets:** no source image was resized, recompressed, renamed or deleted. Six unreferenced brand
files are excluded from deploy but remain in the repository.

**Dependencies:** none added. `subset-font` is used once, offline, via
`npm install --no-save subset-font`, and is not in `package.json`, not in CI, and not required to
build the site.
