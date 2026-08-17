# DUNA — THE LIVING INTERIOR
# PHASE 1 — EXPERIENCE ARCHITECTURE

**Date:** 2026-08-15
**Scope:** Architecture and planning only. No implementation, no new dependencies, no asset changes.
**Basis:** [docs/PHASE-0-AUDIT.md](PHASE-0-AUDIT.md), read in full, plus a fresh inspection of
`index.html`, `partials/`, `build.mjs`, `admin.js`, `style.css`, `script.js`, `data/projektek.json`,
`data/ceg-adatok.json`.
**Status of the repo after this phase:** unchanged except for this file.

Every recommendation below is tied to something that exists — a file, a field, a measured
number, an actual photograph. Where a recommendation depends on content that does **not**
exist yet, it is marked **[BLOCKED ON CONTENT]** and given a fallback that works with today's
assets.

---

## 0. Corrections and additions to the Phase 0 audit

The audit holds up. Three additions, one of which changes a Phase 0 recommendation.

### 0.1 CORRECTION — spatial metadata must not live in `projektek.json`

Phase 0 §18.3 recommends storing per-image tagging "as new fields in `data/projektek.json`
so the existing admin and build validation keep working."

**This is unsafe.** `admin.js:827` contains a whitelisting serializer:

```js
function tisztit(p) {
  return {
    slug, cim, kategoria, link, leiras, kiemelt, allapot,
    kepek: p.kepek.map(k => ({ file: k.file, alt: k.alt || p.cim }))
  };
}
```

`tisztit()` runs on every save (`admin.js:870`) and rebuilds each project from a fixed field
list. **Any field we add to a project — or to an image record — is silently deleted the next
time the client edits that project in the admin and presses save.** Room definitions,
viewpoint tags, depth-map references and level assignments would disappear without an error,
weeks later, with no way to tell which save destroyed them.

**Decision:** all Living Interior metadata lives in a **new, separate file, `data/terek.json`**,
keyed by project `slug`. `projektek.json` stays exactly as it is and remains the client's
editable surface. `terek.json` is authored by us (and later, optionally, by an extended admin
tab). The build joins the two by slug and hard-fails if `terek.json` references a slug or an
image file that `projektek.json` does not contain — the same fail-loud discipline the build
already has.

This also means: **the admin keeps working untouched through the entire rebuild** (Phase 0
risk #10 closed), and the client can keep publishing ordinary projects while immersive rooms
are being built.

### 0.2 ADDITION — the existing project URLs can survive verbatim

Project pages are generated at `deploy/referenciak/<slug>/index.html` (`build.mjs:217-243`)
and served extensionless. A Living Room can be published at **exactly the same URL** as the
project page it replaces. No redirect map, no lost inbound links, no sitemap churn.
Phase 0 risk #13 (SEO regression) is therefore mostly a *rendering* problem, not a *routing*
problem — solvable by keeping server-rendered HTML underneath the experience, which is what
§16 and §18 below require anyway.

### 0.3 ADDITION — the category map is a closed set

`build.mjs:30` defines `KATEGORIAK` as seven fixed keys, and `szuroGombok()` renders a button
only for categories that actually contain published work. The taxonomy is therefore already
data-driven and safe to reuse as a first-draft room typology (§19), but it is *not* a
navigation model — see §8 for why we do not use it as one.

---

## 1. Experience Principle

> ### DUNA does not build buildings. DUNA builds the inside of them.
> ### So the site is not a portfolio of projects — it is one continuous interior, assembled
> ### from every interior DUNA has built. You never open a page. You pass through a threshold
> ### into the next room. And the building drifts, because half of what DUNA builds floats.

**In one working sentence, for the team:**

> **"One room, then the next. Never a page."**

### Why this and not the literal "digital building"

The working direction — *a digital building made from everything DUNA has ever built* — is
right, but a "building" implies floors, a facade, an exterior, a plan. The audit is clear
that DUNA has **no exterior imagery, no workshop imagery, no people, no drawings, no
Danube** (§15 "What is missing", items 4–8). A digital *building* would spend its budget on
things we cannot photograph.

What DUNA does have, 371 times over, is **the inside of things**. A hotel corridor. A
castle ballroom. A church door. A living room. And fifteen boat interiors. The single true
common denominator across all 30 projects — including every boat — is *fitted interior*.
That is also literally the company's trade: bútorasztalos, épületasztalos, belsőépítészet,
hajóbelső.

So we build the thing we actually have pictures of: **an interior with no outside.** The
visitor is never shown a facade, never placed on a street, never given an establishing
shot of a building. They start inside and stay inside. This is not a limitation dressed as a
concept — it is the concept, and it happens to be exactly buildable from a 371-image archive
of interiors at 2 MP.

### The five qualities, made operational

| Quality | What it concretely means here |
|---|---|
| Architectural | Composition is governed by thresholds, sightlines and enfilades, not by cards and grids |
| Cinematic | The camera moves the way a steadicam moves through a house: forward, slow, at eye height |
| Tactile | Every room ends in a macro detail at real scale — grain, brass, lacquer (`fafaragasok` is the reference) |
| Quiet | One accent per screen. No more than one thing moves under its own power at a time |
| Human | The founder's letter and the four named people are the only voices; no corporate "we deliver solutions" |

### Explicit anti-goals

No hero video loop. No particle systems. No cursor followers. No "scroll to explode the
model". No liquid distortion on hover. No fullscreen menu that flies in from the corner. No
counting numbers as decoration (the existing count-ups stay only because they carry real
facts: 1991, 1200 m², 30, 371). No WebGL on anything that a well-timed CSS transform does
equally well.

---

## 2. Creative Direction

### 2.1 The material world

Inherited from `style.css` `:root` and kept, because it is already correct and already
DUNA: warm paper (`--paper #fbf8f3`), oak-shifted greys, ink (`--ink #1a150f`), brass
(`--brass #7e5f35`), oak (`--oak #c2884a`). The existing stylesheet header states the
intent — *"Műhelyrajz"*, workshop drawing: paper ground, drafting-table grid, thin-stroke
Garamond over it. That tension (engineering precision + elegant surface) is the right voice
and does not need replacing.

**One addition, required by the concept:** the current palette has no dark. An interior has
shadow, and HABLEÁNY at night is one of our two strongest assets. We need a **night register**
— not a "dark mode" toggle, but a second ground the experience moves into and out of as part
of the narrative (§4 SCENE 03, §20). Ink becomes the page, brass becomes the only warm light.
Defining its tokens is Phase 2 work, not Phase 1.

### 2.2 Typography

Cormorant Garamond 300 for display, Archivo for everything functional — unchanged. The
existing device of setting the last line of a headline in italic (*"több száz tér."*) is a
genuine signature and should be treated as a rule, not an accident.

**Constraint carried forward:** fonts are already 315 KB and the single largest payload
category on the homepage (Phase 0 §13.1). No new face may be added. Any new weight must be
paid for by removing another.

### 2.3 The frame

The site is composed as a sequence of **held frames**, not scrolling documents. A frame is
one photograph at full bleed or near-full bleed, with type placed in the negative space that
the photograph actually contains. This is why the shot-type analysis in Phase 0 §8 matters
operationally: frames with a dark wall, an empty ceiling or an out-of-focus foreground are
frames that can carry a headline. Frame selection is art direction, and it is a real
deliverable in Phase 2.

### 2.4 What "quiet" costs

At most one element per viewport is in continuous motion. Scroll-driven motion does not count
as continuous. This rule alone prevents the site from becoming the thing rule 13 and 14 of the
brief forbid.

---

## 3. User Journey

Seven stages. Each names what is seen, what can be done, what should be felt, what is said,
and the exit.

### 3.1 ENTRY — *Előtér*

- **Sees:** one still interior frame, already inside, already lit. The existing headline:
  *"Harminc év, egy műhely, több száz tér."* No logo animation, no overlay, no enter button.
- **Does:** nothing is required. Reading is enough. Scrolling is the only affordance and it
  is signposted by the existing `Görgessen` cue.
- **Feels:** *I have walked in on something already in progress.* Calm, not spectacle.
- **Says:** who DUNA is, in four data points that are already computed from real data (1991,
  1200 m², 30 references, 371 photos).
- **Exit:** the first scroll begins the first threshold pass (§20). The site teaches its own
  grammar with the very first gesture.

### 3.2 DISCOVERY — *A folyosó*

- **Sees:** the frame dollies forward; the near edge of the image (a door jamb, a post, a
  mullion) passes the camera and leaves; a second interior resolves behind it.
- **Does:** keeps scrolling. Optionally notices that the incoming room is labelled and
  clickable.
- **Feels:** *movement is the interface.* The transition is the thesis statement.
- **Says:** the three disciplines — bútor, belsőépítészet, hajó — but as three spaces, not
  three cards. (The current homepage's "Tevékenység" trio becomes three thresholds.)
- **Exit:** the third threshold does not resolve into another corridor. It opens into a room
  and stops.

### 3.3 EXPLORATION — *A szoba*

- **Sees:** the HABLEÁNY salon, full bleed, with genuine depth. Forward motion stops; the
  visitor is *in* a place rather than travelling through one.
- **Does:** looks around — pointer parallax on desktop, swipe between the ~15 real camera
  positions on mobile. Triggers the day→night change by continuing to scroll.
- **Feels:** *this is a real room and I am standing in it.* This is the emotional peak of the
  homepage and the one moment that must be flawless.
- **Says:** what DUNA actually builds, without adjectives. Name, category, and — when copy
  exists — location and year.
- **Exit:** a window. Not a door. See §12.

### 3.4 PROJECT DISCOVERY — *Az alaprajz*

- **Sees:** the camera pulls back from the room until the whole set of rooms is visible at
  once: the plan. Every project DUNA has built, laid out as a floor plan of one impossible
  building, grouped by the seven existing categories.
- **Does:** scans, filters, chooses, enters any room directly. This is also where the
  keyboard user and the screen-reader user have been able to arrive from the very first
  moment (§9).
- **Feels:** *there is a lot of this, and I can get anywhere.* Relief and scale at once.
- **Says:** 30 projects, 371 photographs, seven kinds of space, thirty years.
- **Exit:** entering any room is a threshold pass; leaving any room returns here, not to the
  homepage.

### 3.5 CRAFT DISCOVERY — *A metszet*

- **Sees:** a vertical section cut through the making of one real object — the Garzon Pláza
  chain that exists in the archive: hand sketch → material moodboard → render → built space →
  the finished armchair on white.
- **Does:** scrolls down through the stages; scale changes rather than position (macro to
  room).
- **Feels:** *someone's hands did this.*
- **Says:** the five-step process that is already written and already good (01 Igényfelmérés
  → 05 Szerelés), plus the 1200 m² claim.
- **Exit:** into the DUNA story, or back to the plan.

### 3.6 DUNA STORY — *A műhely*

- **Sees:** the founder's letter, set as the only long-form reading surface on the site,
  against the quietest imagery in the archive.
- **Does:** reads. Deliberately low interaction.
- **Feels:** *there is a person behind this.*
- **Says:** 1991, Győr, Győrffy Péter, the shop, the river, the boats.
- **Exit:** the only outward-facing door on the site — contact.

### 3.7 CONTACT — *A kapu*

- **Sees:** the existing contact page, essentially unchanged in structure: four named people
  with direct mobiles, the form, the map, the two addresses.
- **Does:** writes, calls, or copies an email address. Nothing clever.
- **Feels:** *this is easy and these are real people.*
- **Says:** where the workshop is, and that visiting it is possible.
- **Exit:** the journey ends here by design. The success state is a sent message, not another
  scroll.

---

## 4. Homepage Storyboard

Seven scenes. The homepage is the concept's complete argument in one page; every other route
is a variation on scenes already established here.

Asset references below are real files verified in `img/projektek/`. Frame selection is
provisional and subject to the art-direction pass in Phase 2.

---

### SCENE 01 — ELŐTÉR (ENTRY)

| | |
|---|---|
| **Purpose** | Establish that we are already inside a space, and deliver the brand line before anything moves. Carry LCP. |
| **Composition** | One full-bleed interior frame, right two-thirds. Type block left, on paper ground, overlapping the image edge by one gutter. The existing hairline drafting grid remains behind the type. Candidate frames: `hotel-domus-collis/02` or `04` (corridor with real depth), fallback `ottevenyi-kastely/02` (ballroom, three-angle set, no rights question). |
| **Content** | `Asztalos és hajóépítő üzem · Győr` / H1 *"Harminc év, egy műhely, több száz tér."* / the existing lede / the four count-up facts / two buttons (Referenciák, Ajánlatkérés). All of this exists today in `index.html:19-37` and is reused verbatim. |
| **Interaction** | None required. Scroll cue only. Pointer produces a ≤6 px parallax offset between image and type on fine pointers only. |
| **Camera** | Static. The camera has not started moving yet — this is deliberate, so that the first movement in SCENE 02 registers as an event. |
| **Scroll** | 0–100 vh. Type block drifts up at 1.0×, image at 0.86× (the existing `data-parallax="0.14"` value, kept). |
| **In** | Cold start. First paint is this frame's LQIP, upgraded in place. No splash, no curtain. |
| **Out** | At ~85 vh the image begins to scale from 1.0 → 1.06 and the type fades. This *pre-loads the gesture* of SCENE 02. |
| **Desktop** | As described. |
| **Mobile** | Type first, image below at 4:5, scale 1.0 → 1.03. Count-ups retained (they are cheap and they are facts). |
| **Performance** | This frame is the only image preloaded. `<link rel="preload">` for it and for the two above-the-fold font slices. Target: LCP < 1.8 s on mid-range Android / 4G. The current homepage ships 481 KB of images and 315 KB of fonts before anything is visible; this scene's budget is **≤ 260 KB total**. |

---

### SCENE 02 — A FOLYOSÓ (THE ENFILADE)

| | |
|---|---|
| **Purpose** | Teach the site's grammar. The first threshold pass happens here, within the first two seconds of scrolling, so that every later transition is already understood. |
| **Composition** | Full-bleed, edge to edge, no gutters. Three consecutive interiors, each entered through the previous one. Each carries one word of the trade — *Bútor · Belsőépítészet · Hajó* — set small, bottom-left, in Archivo caps. |
| **Content** | The three disciplines. The current homepage says this with three text cards (`index.html:61-77`); here the same three claims are made by three spaces. The card copy survives as the accessible text layer. |
| **Interaction** | Scroll drives it entirely. Clicking a discipline word jumps to that filter in the plan (SCENE 06). |
| **Camera** | Forward dolly, constant velocity, no rotation. Eye height fixed. |
| **Scroll** | Three passes across ~250 vh. Each pass consumes ~70 vh; the 15 vh between passes is a *rest* — the frame is held, nothing moves. Rest beats are what stop this from being a gimmick reel. |
| **In** | Continues SCENE 01's scale ramp; the first threshold completes what that ramp started. |
| **Out** | The third pass decelerates instead of completing — the camera arrives *in* a room and stops. |
| **Desktop** | WebGL threshold pass (§20), three-layer depth displacement. |
| **Mobile** | CSS threshold pass: three stacked layers, `transform: scale()` + `opacity`, masked. Same choreography, no GL context. |
| **Performance** | Four textures at 1400 px max. Loaded as a single group when SCENE 01 is ≥ 50 % scrolled, never at page load. If the group is not ready, the scene degrades to hard cuts with a 240 ms fade and nobody is told. |

---

### SCENE 03 — A SZOBA (THE ROOM)

| | |
|---|---|
| **Purpose** | The proof. Deliver one real, inhabitable DUNA interior at full fidelity and hold it. This is the scene the site is judged on. |
| **Composition** | HABLEÁNY's deck salon, full bleed. Bow-to-stern sightline. Varnished mahogany, planked white ceiling, brass, and the Danube through the glazing on both sides. Type: project name only, small, lower left. |
| **Content** | `Duna Cruises HABLEÁNY`. Location, year and a 100–200-word narrative **[BLOCKED ON CONTENT]** — `leiras` is empty for all 30 projects. Fallback until copy exists: name, category, photo count, and the external `dunacruises.com` link, which this project actually has. |
| **Interaction** | Pointer/gyro parallax within the frame, ±3° of apparent yaw — enough to feel volumetric, far too little to feel like a game. Continuing to scroll runs day → night (see below). |
| **Camera** | Effectively still. Micro-drift only: a 0.4 %/s lateral float, like a moored boat. This is the one place the Danube metaphor is literal (§10). |
| **Scroll** | ~180 vh of pinned scroll. First 60 vh: the room settles and the label arrives. Middle 60 vh: **day → night**, cross-dissolving the day frames into the night frames of the *same viewpoints* — an asset combination that exists in this project and nowhere else in the portfolio (Phase 0 §11). Final 60 vh: night holds, brass becomes the only warm value, and the page ground has become ink. |
| **In** | Deceleration out of SCENE 02 — the camera stops, the room does not. |
| **Out** | A **window** threshold, not a door (§12): the near mullion passes the camera, and what is on the other side is the river and the hull. The room turns out to have been floating the whole time. |
| **Desktop** | Depth-displaced plane, offline-generated depth map, three layers (near mullion / mid furniture / far river). |
| **Mobile** | Full-bleed still + horizontal swipe through the real camera positions along the salon. Day→night runs on vertical scroll as a two-image crossfade. No depth shader by default. |
| **Performance** | Two textures (day, night) at 1400 px + two 8-bit depth maps at 512 px ≈ 180 KB total. Scene initialises only when SCENE 02 is ≥ 60 % complete. Single shared WebGL context — never a second one. |

---

### SCENE 04 — AZ ABLAK (SPACES THAT MOVE)

| | |
|---|---|
| **Purpose** | Convert the biggest structural fact in the archive — 15 of 30 projects are boats — from a portfolio oddity into the payoff of the concept. |
| **Composition** | Immediately after the window pass: the hull from outside, on water. Then a hard rhythmic sequence of boat frames at held tempo, ending on the studio-seamless 6.1 Cabin shots (`duna-hajok-6-1-cabin/22, 23, 24`) where the boat has become an *object* on grey. |
| **Content** | One line, and it is the whole argument: **"Tereket építünk. Néhány közülük elindul."** *(We build spaces. Some of them leave.)* Plus the count: 15 boats in the archive. |
| **Interaction** | Scroll only. The last frame links into THE FLEET (§12.3). |
| **Camera** | The only outward-facing move on the site: the camera exits the interior, then immediately re-enters an object. |
| **Scroll** | ~140 vh, faster tempo than SCENE 03 — this is the site's one allowed acceleration. |
| **In** | The window pass from SCENE 03. |
| **Out** | Cut to paper ground. The abrupt return to daylight and to the drafting-grid surface resets the visitor before the craft chapter. |
| **Desktop / Mobile** | Identical treatment. This scene is a cut sequence, not a 3D scene — it costs nothing on mobile and should not be downgraded there. |
| **Performance** | 5–6 textures at 1400 px, served as AVIF/WebP with JPEG fallback. Streamed as the scene enters. |

---

### SCENE 05 — A METSZET (THE SECTION)

| | |
|---|---|
| **Purpose** | Say that DUNA makes the thing, not just specifies it — using only imagery that exists today. |
| **Composition** | A vertical section: the viewport holds one stage at a time while *scale* changes rather than position. Macro grain → carving detail (`fafaragasok/01, 04, 05, 08, 09` — the best material texture in the repository) → hand sketch → moodboard → render → built room → the armchair on white (`garzon-plaza-hotel/01, 05, 14–17` — the only complete drawing-to-object chain in the archive). |
| **Content** | The existing five process steps, verbatim: 01 Igényfelmérés · 02 Tervezés · 03 Gyártás (1200 m², saját gépek) · 04 Felület · 05 Szerelés. This copy is already good and already spatial. |
| **Interaction** | Scroll. On desktop only, hovering a stage reveals the one-line description that already exists in `index.html:107-131`. |
| **Camera** | Pure dolly-in. Depth of field opens from macro to room. |
| **Scroll** | ~300 vh. This replaces the existing pinned horizontal rail — its `.kezi` progressive pattern is the precedent we keep, its horizontality is not. |
| **In** | Hard cut on paper. |
| **Out** | Pull back to the plan. |
| **Desktop** | Scale + blur transitions between plates. |
| **Mobile** | Identical, minus blur (mobile GPU cost of a large-radius blur is not worth it); scale + crossfade only. The existing `.vizszintes.kezi` swipe rail survives as the reduced-motion and no-JS fallback. |
| **Performance** | 7 plates, ≤ 1400 px, lazily grouped. No WebGL in this scene at all. |
| **[BLOCKED ON CONTENT]** | This scene is the one that most wants a workshop shoot (Phase 0 §17.3). Designed so that adding real workshop stills or 20 seconds of a plane taking a shaving is an **asset swap into existing slots**, not a redesign. |

---

### SCENE 06 — AZ ALAPRAJZ (THE PLAN)

| | |
|---|---|
| **Purpose** | Release. Show the whole building at once and hand navigation back to the visitor. This is the honest home of the grid — and by placing it here, after the experience rather than instead of it, the grid stops being a portfolio index and becomes a floor plan. |
| **Composition** | Paper ground, drafting grid at full strength for the only time on the site. 30 projects as plan cells, sized by photo count, grouped into the seven existing categories. Boats occupy the largest zone, honestly, because they are half the archive. |
| **Content** | Titles, categories, photo counts — all of which exist. The existing filter (`szuro.js`, state in `location.hash`) is preserved outright, including its `aria-pressed` and `aria-live` behaviour. |
| **Interaction** | Hover a cell → its cover frame fades up in place. Click → threshold pass into that room. Filter buttons work exactly as they do today. |
| **Camera** | Orthographic top-down in feel: no perspective anywhere in this scene. Deliberate contrast with everything before it. |
| **Scroll** | Normal document scroll. No pinning, no hijack. After 800 vh of choreography the visitor gets a plain, fast, scrollable page. |
| **In** | Camera pull-back from SCENE 05. |
| **Out** | Any cell, or continue to SCENE 07. |
| **Desktop / Mobile** | Mobile drops to a single-column plan with the same grouping and the same filter. |
| **Performance** | Covers at `-800`, lazy, `content-visibility: auto`. Today `/referenciak` transfers 1933 KB of images; with AVIF + `srcset` this target is **≤ 700 KB** for the same 30 covers. |

---

### SCENE 07 — A KAPU (THE DOOR OUT)

| | |
|---|---|
| **Purpose** | End the journey somewhere a human can be reached. |
| **Composition** | Dark ground. A single frame of a real DUNA door — `szent-laszlo-latogatokozpont-fa-kapuja` is the highest-resolution set in the repository (1536×2048) and is literally a door. It has waited the whole site for this. |
| **Content** | Two lines from the founder's letter, the four named contacts with direct mobiles, and one primary CTA. |
| **Interaction** | Links and a button. Nothing else. |
| **Camera** | Static. |
| **Scroll** | ~120 vh, then the footer — including the mandatory EU ERFA block and grant list, at full length, unshortened. |
| **In** | Fade from paper to ink. |
| **Out** | To `/kapcsolat`. |
| **Desktop / Mobile** | Identical. |
| **Performance** | One texture. Nothing else. |

**Total homepage budget:** ~1290 vh of scroll, ~19 images, and a WebGL context that only ever
exists for SCENES 02–03. First-load transfer target **≤ 350 KB** (today: 817 KB).

---

## 5. Living Room Concept

A **Living Room** (*élő tér*) is a project presented as a place the visitor stands inside,
rather than a page they read.

### 5.1 What makes a project become a room

Five qualification criteria, all checkable against `data/projektek.json` and the images
themselves. A project becomes a room only if it meets **all five**:

1. **One contiguous physical space** appears in ≥ 6 frames.
2. **≥ 3 distinct camera positions** within that space.
3. **A recoverable perspective skeleton** — repeating structure (posts, mullions, joins,
   coffers, planking) that a depth estimator and a human eye can both read.
4. **≥ 1.5 MP average**, un-watermarked.
5. **A usable near layer** — something within ~1.5 m of the camera in at least two frames, so
   that a threshold pass has something to push past.

Applying this to the actual archive:

| Project | 1 | 2 | 3 | 4 | 5 | Room? |
|---|---|---|---|---|---|---|
| Duna Cruises HABLEÁNY | ✓ (~15) | ✓ | ✓ strong | ✓ 1.86 | ✓ posts, mullions | **Yes — flagship** |
| Hotel Domus Collis | ✓ | ✓ | ✓ | ✓ 1.64 | ✓ doorjambs | **Yes**, pending rights (Phase 0 risk #6) |
| Bodajki Vadászkastély | ✓ (10) | partial | ✓ | ✓ 2.16 | ✓ vitrines | **Yes**, thin coverage |
| Öttevényi kastély | ballroom only | ✓ ×3 | ✓ | ✓ 1.57 | weak | No → Level 2 |
| Fúzió a tájjal | ✓ | partial | ✓ | ✗ watermark, 0.69 | ✓ | No → Level 2 if masters arrive |
| Everything else | — | — | — | — | — | No |

**Three rooms exist in this archive. Not thirty.** The system must therefore be built to make
non-rooms first-class (§7), not to make everything a room badly.

### 5.2 Entering a room

Always a threshold pass (§20), never a page load and never a modal. Three entry points:

- from the enfilade — the room simply arrives next
- from the plan — the plan cell expands to full bleed *through* its cover frame's near layer
- from a direct URL — the room assembles itself in place: static frame first, depth layer
  after. A visitor arriving from Google gets a complete, readable page and then, silently, a
  room.

### 5.3 Leaving a room

Four guaranteed exits, always available, never hidden behind a hover:

1. **Backwards** — reverse threshold pass to where you came from. Browser back does this too.
2. **The plan** — one persistent control, top-right, and the `Esc` key.
3. **Onwards** — the next room in the category enfilade, at the end of the room.
4. **The global menu** — the existing six-item nav, always reachable (§9).

A room is never a trap. This is a hard rule and a release blocker.

### 5.4 What is interactive inside a room

Exactly four things, and no others:

- **Look** — pointer/gyro parallax within the frame (desktop ±3°, mobile via swipe between
  real camera positions).
- **Gates** (*kapuk*) — 0–3 marked points that lead to another viewpoint, another room, or a
  detail. Marked with a hairline square and a one-word label; never a pulsing dot.
- **Details** (*részletek*) — macro frames reachable from a gate, shown at real scale.
- **The dossier** (*adatlap*) — a slide-over panel with the full project text, the whole
  gallery and the existing lightbox. **This panel is the room's accessible twin** (§16) and
  contains everything the room contains, as ordinary HTML.

### 5.5 How much content is inside

| Element | Amount |
|---|---|
| Frames in the spatial layer | 6–12 |
| Gates | 0–3 |
| Detail macros | 2–5 |
| Narrative | 100–200 words **[BLOCKED ON CONTENT]** |
| Facts | Category, photo count, external link — available today. Location, year, scope, materials **[BLOCKED ON CONTENT]** |
| Full gallery | All frames, in the dossier |

### 5.6 How a room communicates project information

In three tiers, so that a visitor who never opens anything still learns something:

1. **Ambient** — name and category, always visible, small, fixed.
2. **On demand** — the gates surface one fact each ("tölgy, olajozott", "1200 m²-es
   üzemünkben gyártva"), and one fact is worth more than a paragraph nobody opens.
3. **Complete** — the dossier. Everything, as text.

### 5.7 If a project lacks imagery for a full room

It does not become a room. It becomes Level 2 or Level 3 (§7). There is no degraded room and
no "room with only four pictures". The level is computed from the qualification checklist in
§5.1, not assigned by taste — see `terek.json` in §6.

### 5.8 2.5D versus full 3D

| | 2.5D (Level 2) | Room (Level 1) |
|---|---|---|
| Geometry | Flat planes, layered | Displaced plane from a depth map |
| Camera | Constrained to the photograph's own axis | Free within a small volume, ±3° |
| Viewpoints | One per plate | Multiple real positions, traversable |
| Occlusion | Painter's algorithm | True depth occlusion at edges |
| Cost | ~0 (CSS transforms) | One shared WebGL context |
| Failure mode | Cannot fail | Falls back to 2.5D |

**We are not doing full 3D anywhere.** There is no geometry, no reconstruction, no
photogrammetry — the audit is right that ≤ 2 MP single-camera uncalibrated imagery cannot
support it. "Room" means *depth-displaced photography*, and it must be described that way
internally so nobody builds toward the wrong target.

### 5.9 Common to every room / unique to each

**Always the same:** the threshold pass in and out; the persistent name/category label; the
plan control; `Esc`; the dossier; the gate visual language; the loading behaviour;
the reduced-motion and no-WebGL fallbacks.

**Allowed to differ:** which threshold type (door / window / gate, §20.4); the atmosphere
(day, night, or a transition between them); the number and placement of gates; the accent
value drawn from the room's own dominant material; whether the room has a second time state
at all — today only HABLEÁNY does.

---

## 6. Room Engine Concept

A room is **data**, not code. One renderer, N room definitions.

### 6.1 Where the data lives — and why not in `projektek.json`

Per §0.1: `admin.js:827` strips unknown fields on every save. Therefore:

```
data/projektek.json     ← UNCHANGED. Client-owned. Admin-writable. Source of truth for
                          which projects exist, their titles, categories, covers, galleries.
data/terek.json         ← NEW. Studio-owned. Never touched by the current admin.
                          Spatial layer, keyed by slug. Purely additive.
img/melyseg/<slug>/     ← NEW. Generated depth maps, one per spatial frame.
```

The build joins by slug and **hard-fails** if `terek.json` names a slug or a file that
`projektek.json` does not have — matching the existing validation discipline in `build.mjs`
(missing image, missing cover, unsubstituted `{{key}}`). A project with no `terek.json` entry
renders exactly as it does today. **The site is never broken by a missing room.**

### 6.2 The model

Field names in Hungarian, matching the repository's existing convention.

```jsonc
// data/terek.json
{
  "duna-cruises-hableany": {
    "szint": 1,                       // 1 room · 2 cinematic · 3 story — from the §5.1 checklist
    "tipus": "jarmu",                 // belso | targy | jarmu — what kind of space this is
    "sorrend": 10,                    // position in the curated enfilade
    "hangulat": {
      "alap": "nappal",               // which time state the room opens in
      "allapotok": ["nappal", "ejjel"] // HABLEÁNY is currently the only project with two
    },
    "anyagok": ["mahagoni", "sargarez", "uveg", "lakkozott-fa"],
    "szobak": [
      {
        "id": "szalon",
        "nev": "Fedélzeti szalon",
        "nezopontok": [
          {
            "id": "orr",
            "kep":     { "nappal": "05.jpg", "ejjel": "19.jpg" },
            "melyseg": { "nappal": "05.png", "ejjel": "19.png" },
            "iranyszog": 0,           // degrees, relative to the room's long axis
            "retegek": [0.12, 0.45, 1.0],  // near / mid / far depth cuts
            "kuszob": { "tipus": "ajto", "el": "oszlop" }  // what passes the camera on exit
          }
        ],
        "kapuk": [
          { "cel": "szalon#tat", "pozicio": [0.62, 0.48], "cimke": "Tat felé", "tipus": "ajto" },
          { "cel": "reszlet:11", "pozicio": [0.18, 0.71], "cimke": "Sárgaréz",  "tipus": "reszlet" },
          { "cel": "projekt:duna-hajok-6-1-cabin", "pozicio": [0.88, 0.40],
            "cimke": "A hajó kívülről", "tipus": "ablak" }
        ]
      }
    ],
    "reszletek": ["11.jpg", "14.jpg"],
    "adatok": {                       // ALL nullable. Never invented. Rendered only if present.
      "helyszin": null, "ev": null, "megbizo": null,
      "terulet": null, "hatokor": null, "fotos": null
    },
    "szoveg": null                    // 100–200 words. [BLOCKED ON CONTENT]
  }
}
```

Level 2 entries carry `szint: 2`, a `lemezek[]` (plates) array with layer offsets, and no
`melyseg`. Level 3 entries carry `szint: 3` and nothing else — or no entry at all.

### 6.3 The engine

```
TÉRMOTOR (room engine)
├── Betöltő        loading orchestration: one manifest per room, priority-ordered
├── Vászon         ONE WebGLRenderer for the whole site — never one per room
├── Jelenet        builds a scene from a `szobak[].nezopontok[]` entry
├── Küszöb         the threshold pass; the only transition primitive that exists
├── Kapuk          gate hit-testing; renders as real DOM buttons over the canvas
├── Adatlap        the dossier — plain HTML, works with the canvas destroyed
└── Tartalék       degradation ladder: room → 2.5D → static plate → text
```

Adding a project means: write a `terek.json` entry, drop in frames and depth maps, run the
build. **No new application, no new route, no new component.** That is the test the design
must pass and the reason the data model is worth this much attention now.

### 6.4 Depth-map pipeline

Offline, at authoring time, never in CI and never in the browser: a monocular depth estimator
(Depth Anything class) run over the ~40 selected frames, output as 8-bit grayscale PNG at
512 px, **hand-corrected** where it fails (glazing, reflections and HDR halos will all
mislead it, and HABLEÁNY has all three). Committed as ordinary assets. This keeps the CI build
time — already 2–4 minutes for 371×2 derivatives — from multiplying (Phase 0 risk #15).

---

## 7. Experience Levels

### LEVEL 01 — TÉR (ROOM)

- **When:** all five §5.1 criteria met. **Today: 3 projects.** HABLEÁNY, Hotel Domus Collis
  (pending rights), Bodajki Vadászkastély.
- **Looks like:** full-bleed depth-displaced photography, ±3° look, 0–3 gates, optional
  second time state.
- **Feels like:** standing in the space.
- **Connects by:** threshold passes in both directions; sits on the main enfilade.
- **Costs:** ~200 KB per room + one shared WebGL context.

### LEVEL 02 — MOZGÓKÉP (CINEMATIC SPACE)

- **When:** strong imagery, insufficient viewpoint overlap — or a sequence that is better as a
  narrative than as a place. **Today: 7 projects.** Öttevényi kastély (ballroom ×3),
  Garzon Pláza (the sketch→object chain), Fúzió a tájjal (if masters arrive), Duna Hajók 6.1
  Cabin + KADÉT (object turntable), Fafaragások (material macros), Szent László door (object
  hero), Kristály Étterem (CGI, and **presented as CGI** — Phase 0 risk #5).
- **Looks like:** held plates, layered parallax, scale-driven transitions, no free look.
- **Feels like:** watching a very slow, very deliberate film about one place.
- **Connects by:** the same threshold pass. The visitor cannot tell where Level 1 ends and
  Level 2 begins, and that is the point.
- **Costs:** CSS transforms. No WebGL.

### LEVEL 03 — TÖRTÉNET (STORY / PLATE)

- **When:** documentation-grade imagery, or an archive entry. **Today: 20 projects** — the
  residential trio, Zirci Apátság, Vatikáni díszdoboz, Mercedes plató, Domus Pellegrini, and
  the 13 low-resolution boats.
- **Looks like:** a fast, quiet editorial page — one cover, the facts, the gallery with the
  existing lightbox. Very close to the project template that ships today.
- **Feels like:** an archive that is proud of being an archive.
- **Connects by:** cut transitions, not threshold passes. Speed is the feature here.
- **Special case:** the 13 archive boats are not 13 pages. They are **one** page — THE FLEET
  (§12.3) — a dense wall of hulls where the volume is the message.

### Navigating between levels

The visitor is never told which level they are in and never chooses one. The plan (§4 SCENE
06) is the single entry point to everything, and the level only changes how the destination
behaves once entered. Level is an **implementation budget**, not an information architecture.

---

## 8. Project Discovery

### The chosen system: THE ENFILADE (*enfilád*)

An enfilade is the architectural device of aligning doorways so a suite of rooms shares one
sightline. It is the only discovery mechanism on this site, and it is grounded in the actual
photographs: Hotel Domus Collis was shot *through* doorways along corridors (Phase 0 §10 A2),
and HABLEÁNY is one long salon photographed bow-to-stern.

**How it works:**

1. **You always see the next space through the one you're in.** The far layer of the current
   frame contains the near layer of the next. Depth does the signposting; no arrow, no
   instruction, no "scroll to explore" label is needed.
2. **Straight ahead is the curated sequence** — the `sorrend` field in `terek.json`. Keep
   scrolling and you get the strongest work in the best order, without making a single
   decision.
3. **Sideways is a choice.** 0–3 gates per room lead to adjacent work. Categories are what
   makes two rooms adjacent, so the seven existing `KATEGORIAK` keys become the adjacency
   graph — reused, not re-invented.
4. **The plan is always one key away.** `Esc`, or the persistent control top-right. The plan
   is a legitimate first move, not an escape hatch for people who "failed" at the experience.

**Why not a grid as the primary interaction:** a grid asks the visitor to evaluate 30 things
at once, and in this archive 20 of the 30 will lose that evaluation on image quality alone.
The enfilade presents the best work first, in sequence, and lets the archive be discovered as
depth rather than as a comparison.

**Why not doors-as-menu, rooms-as-map, or an object-based navigation:** all three require
assets we do not have — a building exterior, a floor plan, or 3D objects. The enfilade
requires only what every one of these photographs already contains: a foreground and a
background.

**Why it is understandable without instructions:** the first scroll performs a threshold pass
before the visitor has made any decision. The grammar is taught by the site's own first
movement, and every subsequent movement is the same movement.

---

## 9. Navigation Architecture

### 9.1 Primary

The existing six-item header, preserved: Főoldal · Rólunk · Referenciák · Design manufaktúra ·
Hajóépítés ↗ · Kapcsolat, plus the skip link, `aria-current`, and the `Menü` toggle. It thins
to a hairline over immersive scenes but never disappears and never requires a hover to
reappear. **The immersive layer never removes a way out.**

### 9.2 Secondary — the plan control

One persistent control, top-right: `Alaprajz`. Available on every route including inside every
room. Bound to `Esc`. This is the single most important usability guarantee on the site.

### 9.3 Project navigation

Inside a room: back (reverse threshold) · plan · next in category · dossier. Between rooms:
gates, or the plan. The existing breadcrumb (`morzsa` in `projekt-sablon.html`) is retained in
the dossier and in the non-WebGL rendering.

### 9.4 Back behaviour

Browser back is a first-class citizen. Every room, viewpoint and dossier state is a real URL
via the History API, and back always plays the reverse threshold pass. The existing
`pageshow`/bfcache handling in `script.js` is the precedent. **Never trap history.**

### 9.5 Home behaviour

The logo returns to `/`, always, from anywhere, with a fade rather than a threshold pass —
going home is not a spatial move, it is leaving.

### 9.6 Progress indication

Homepage: a hairline rule down the left gutter, marking the seven scenes. Inside a room:
nothing — a room is a place, not a timeline. No percentages anywhere.

### 9.7 Menu behaviour

The existing pattern is kept as-is: a toggled panel, `aria-expanded`, closes on link tap.
It does not become a fullscreen takeover with animated letters.

### 9.8 Mobile navigation

See §15. Same six items, same toggle. The plan control moves to bottom-right, in thumb reach.

### 9.9 Keyboard

`Tab` reaches everything in DOM order. `Esc` → plan. `←`/`→` → previous/next viewpoint or
gallery image (matching the existing lightbox). `Enter`/`Space` → activate a gate. Gates are
real `<button>` elements positioned over the canvas — never canvas hit-testing alone. Focus is
visible everywhere via the existing `:focus-visible` rule with `--brass`.

### 9.10 Accessibility fallback path

Every room has a complete non-spatial rendering: cover, facts, narrative, full gallery,
lightbox — essentially today's project page. It is **server-rendered and present in the HTML
before any JavaScript runs**, and the spatial layer is an enhancement over it. Screen readers,
`prefers-reduced-motion` users, no-JS users, crawlers and low-end devices all receive the same
document. This preserves the property the audit correctly identifies as the codebase's best
existing quality — *"motion is layer two"*.

---

## 10. Danube / Flow Concept

### DECISION: **SECONDARY MOTIF — with one structural job and one literal appearance.**
### NOT the navigation system.

**Why not core.** The audit is unambiguous: *"Despite the company name and the proposed
metaphor, the only river imagery is incidental"* (§15.6). There is no Danube photography, no
water footage, no aerial, no map asset, no SVG. A navigation system built on the river would
be built on assets that do not exist — violating the brief's own rules 2 and 9. A generic
WebGL water shader in place of the actual river would be exactly the "technology for
technology's sake" the brief forbids, and it would be the first thing an Awwwards jury calls
decorative.

**What it does instead — three specific, non-negotiable jobs:**

1. **It is the motion law (§21).** Everything on this site decelerates like water, not like a
   spring: long ease-outs, no bounce, no overshoot, momentum that decays rather than snaps.
   The scroll retains drift. Nothing on this site stops dead. This is the most pervasive
   expression of the metaphor and it costs nothing.
2. **It appears literally exactly where it actually exists in the pixels.** Through
   HABLEÁNY's glazing (SCENE 03), and behind the 6.1 boats (SCENE 04). In SCENE 03 the room
   holds a 0.4 %/s lateral micro-drift — the site's only perpetual motion — because the room
   *is on the water*. Nowhere else.
3. **It is the geography of the story.** Győr is on the Danube; the workshop is there; the
   boats leave from there. That belongs in the About narrative (§13) as fact, not as visual
   effect.

**Reconsider promoting it to core only if** the client supplies real river footage or a
workshop-to-water shoot. Then the transition between the interior chapters and the boat
chapters could become a literal passage over water. Until then: motion law, two appearances,
no shader.

---

## 11. Craft / Material Experience

### The concept: THE SECTION CUT (*A metszet*)

A services page lists capabilities. A section cut shows what something is made of. DUNA's
actual claim — design and manufacture in one hand, in a 1200 m² hall — is best proved by
following one real object all the way down.

```
NYERSANYAG  raw material   →  the grain, at macro scale
   ↓
KÉZ         craft          →  the carving, the tool mark, the sanded edge
   ↓
TÁRGY       object         →  the finished piece, on white
   ↓
TÉR         space          →  the same piece, in the room it was built for
   ↓
ÉLMÉNY      experience     →  the room, inhabited
```

**Built from assets that exist today:**

- `fafaragasok/01, 04, 05, 08, 09` — the best material macro imagery in the repository, and
  the only frame in the whole archive with the workshop visible in the background (`10.jpg`).
- `garzon-plaza-hotel/01, 05, 14–17` — hand sketch → material moodboard → render → built space
  → the armchair on white seamless. **The only complete drawing-to-object chain in the
  archive**, and the reason this chapter is possible at all.
- The five process steps, already written, already spatial.
- The service list from `rolunk.html` — precise and unglamorous (gyalulás, kontaktcsiszolás,
  pácolás, lakkozás). Used as a plain index at the bottom of the chapter, not dressed up.

**How it avoids being a services page:** it names one chair, follows it, and lets the general
claim be inferred. Nothing is described as "exclusive", "premium", or "the highest quality" —
the audit is right that `/design-manufaktura` currently leans on those superlatives instead of
showing work.

**[BLOCKED ON CONTENT] — and this is the single highest-value gap on the project.** Phase 0
§17.3 asks whether the workshop can be photographed. The answer determines whether this
chapter is good or extraordinary. Designed so that a workshop shoot drops into existing slots:
`NYERSANYAG` wants a stack of timber, `KÉZ` wants hands and a plane, `TÁRGY` wants the piece
leaving the finishing department. Three photographs would transform it. Twenty seconds of
video would transform the whole site's register.

**Material as a system:** each room in `terek.json` carries an `anyagok[]` array. Over time
this becomes a material index — *"show me everything in oak"* — a genuinely novel way to
navigate an interior portfolio, and one that costs nothing beyond the tagging pass that
Phase 0 §18.3 already recommends. Not in the first prototype. Designed for.

---

## 12. Boat / Interior Relationship

### DECISION: **CORE.** Boats are the proof of the concept, not a category within it.

### 12.1 The line

> **"Tereket építünk. Néhány közülük elindul."**
> *We build spaces. Some of them leave.*

This is stronger than "we build spaces that move" because it keeps the interior as the
subject and treats movement as something that happens to it — which is exactly the
relationship in the photographs. It is also true: HABLEÁNY is an interior that sails.

### 12.2 Why this is grounded, not forced

- **15 of 30 projects are boats.** Half the archive. Ignoring it would be the distortion;
  featuring it is the accurate description.
- **The single best interior in the archive is a boat interior.** HABLEÁNY's salon is a room
  by every criterion in §5.1, and it is a room with the Danube in the windows.
- **The trade is the same trade.** `rolunk.html` lists boat design, manufacture, repair and
  refit alongside furniture and building joinery. It is one workshop, one set of machines, one
  surface-finishing department.
- **The concept demands it.** "An interior with no outside" is a claim that becomes remarkable
  the moment one of those interiors turns out to be floating.

### 12.3 Structural placement — three tiers

1. **HABLEÁNY is the flagship room** (SCENE 03). It is not introduced as a boat. It is
   introduced as a room, and it is revealed as a boat at the window threshold. The reveal is
   the payoff of the entire homepage.
2. **The 6.1 Cabin / KADÉT are objects** (Level 2). Studio seamless frames make a photographic
   turntable honest — the boat as a made object, which links them to the craft chapter rather
   than to the interior chapter.
3. **THE FLEET** (*A flotta*) — the 13 remaining low-resolution boats, on **one** page, as a
   dense wall of hulls with names, at deliberately small scale. 0.54–0.85 MP documentary
   snapshots are weak at full bleed and strong in quantity. The audit's own reading, adopted
   verbatim: their volume is itself a brand statement.

### 12.4 Threshold grammar

Boats are reached through **window** thresholds; interiors through **door** thresholds. Two
gestures, one physics. The visitor learns the difference without ever being told, and it
carries meaning: a door leads to another room, a window leads to something that moves.

### 12.5 `dunahajok.hu` — recommendation

The boat *interiors* belong on this site; they are DUNA's interior work and they are the
concept's proof. `dunahajok.hu` should keep the commercial boat-sales function and be linked
from THE FLEET and from the footer, not from the primary navigation. Today it occupies a slot
in the main six-item nav, which sends the visitor away at the exact moment the site is making
its strongest argument.

**Client decision required** (Phase 0 §17.5). If absorption is refused, the fallback is a
strong cross-link at the end of THE FLEET, and the concept still holds — HABLEÁNY, the 6.1
sets and the fleet index are all already on this site's own domain.

---

## 13. DUNA DNA / About

Not an About page. **The workshop is the room the whole building was made in.**

### The sequence

| Beat | Content | Source | Treatment |
|---|---|---|---|
| **01 — A hang** | The founder's letter, four paragraphs, signed | `rolunk.html`, exists | The only long-form reading surface on the site. Quiet type on paper. No imagery competing with it. |
| **02 — Az idő** | 1991 → today. Thirty years. | Asserted today, **[BLOCKED ON CONTENT]** — no chronology exists | Fallback: the four existing count-up facts, kept honest. With a timeline: a vertical rule with the real milestones. |
| **03 — A hely** | Győr. The Danube. Ikrényi út. The 1200 m² hall. | Facts exist in `ceg-adatok.json`; **imagery does not** | Fallback: the map that already ships on `/kapcsolat`, treated as a drawing rather than an embed. |
| **04 — A gép** | Gyalulás, kontaktcsiszolás, felületkezelés | Copy exists, **no photographs** | Falls back to §11's macro material frames. **This beat is the workshop shoot's home.** |
| **05 — A kéz** | Craftsmanship | **[BLOCKED ON CONTENT]** — no people photographed anywhere | Fallback: `fafaragasok` macros stand in for hands. Honest, but a shoot would change it entirely. |
| **06 — Az emberek** | Four named people, roles, direct mobiles | Exists in `ceg-adatok.json`; **no faces** | Fallback: names set as type, at scale, treated seriously. Four portraits would be worth more than any WebGL feature on this site. |
| **07 — A víz** | Boats leave from here | True, thinly documented | Hands off to §12. |

### Register

First person plural, past tense, specific. The audit's judgement on the current third-person
corporate copy (*"Vállalkozásunkat Győrffy Péter alapította azzal a céllal…"*) is correct: it
will read as boilerplate under this art direction. The founder's letter already demonstrates
the right voice; the rest of `/rolunk` should be rewritten toward it. **That is a copy project,
not a Phase 2 implementation task**, and it should be commissioned in parallel.

---

## 14. Contact Experience

**Design principle for this route: change almost nothing.** The existing contact page is the
most functional thing on the site — four named people with direct mobiles and emails, a
working form backed by a Cloudflare Worker + D1 + Resend, reCAPTCHA v3, a map, `aria-live`
status. It works. The redesign's job is to *frame* it, not to improve it.

| Element | Decision |
|---|---|
| **Entry point** | The last scene of the homepage (§4 SCENE 07), the end of every room's dossier, and the persistent header item. Three routes in, always. |
| **CTA** | One: `Ajánlatkérés`. The site currently has eight competing CTAs (Phase 0 §15). One primary, everywhere. |
| **Form** | Unchanged: same fields, same Worker endpoint, same honeypot, same `aria-live`. It gets a paper ground and the Archivo/Garamond pairing, and nothing else. |
| **Direct contact** | Four people, roles, mobiles, emails — as prominent as the form, not below it. For a B2B fit-out client a direct mobile number is worth more than a contact form, and the site should behave as if it knows that. |
| **Location** | Both addresses, reproduced as they are today. **Do not "fix" the Ikrényi út 2 / 14 discrepancy** — it is a documented client decision (Phase 0 §15). |
| **Studio visit** | New, and worth it: *"A műhely megnézhető."* The workshop is the brand's central claim; inviting people into it is the most natural conclusion this journey can have. **Requires client confirmation** before publishing. |
| **Completion** | The existing success state, with one addition: the sent message resolves to a held frame of a finished DUNA interior and one line. The journey ends inside a room — the same place it started. |
| **Never** | A multi-step form, a chat widget, a calendar embed, or an animated success checkmark. |

---

## 15. Mobile Experience

Mobile is **not** the desktop experience with the WebGL removed. It is the same architecture
executed with a different instrument: **the thumb instead of the camera.**

### 15.1 The model: PLATES AND PASSES

Same rooms. Same thresholds. Same sequence. But a room on mobile is a **full-bleed plate** and
depth is produced by layered CSS transforms rather than a displacement shader. The threshold
pass is choreographically identical — near layer scales past the viewer and fades, far layer
scales up from 0.94 — and costs three composited layers.

**This is not a downgrade, it is the correct instrument.** On a 6-inch screen held 30 cm from
the face, a 3° parallax shift is invisible; a full-bleed photograph that fills your entire
field of view is not.

### 15.2 Gestures

| Gesture | Meaning | Everywhere on the site |
|---|---|---|
| Vertical scroll | Move forward through the enfilade | Yes |
| Horizontal swipe | Look around — step between the real camera positions in this room | Inside rooms |
| Tap a frame | Open the detail / lightbox | Yes |
| Tap a gate | Enter | Yes |
| Two-finger, pinch, long-press | **Nothing.** Reserved for the OS | — |

Horizontal swipe inside a room is the mobile answer to "free look", and it uses exactly the
asset that already exists — HABLEÁNY's ~15 camera positions along the salon. On mobile, the
photographs *are* the camera.

### 15.3 Scroll model

Native scroll. **No scroll hijacking on touch, ever.** Pinned scenes use `position: sticky`
with real scroll distance, so the scrollbar never lies and momentum stays native. The existing
`.vizszintes.kezi` pattern — base class is a plain swipe scroller, JS upgrades it only when
there is room — is the precedent and it is already proven on this codebase.

### 15.4 Project discovery on mobile

The plan becomes a single-column list with the same seven category groupings and the existing
filter, which already works correctly at 375 px. The enfilade still runs first; the plan is
one thumb-reachable tap away, bottom-right.

### 15.5 Fallback ladder

```
Room (depth shader)        ← desktop, and only high-tier mobile that opts in
  ↓
Plate + CSS layer pass     ← mobile default
  ↓
Plate + crossfade          ← reduced motion, or low-tier device
  ↓
Static page, no motion     ← no JS
```

Each step down is silent. The visitor is never notified that they received a lesser version,
and there is no "enable high quality" nag. **One opt-in only:** inside a Level 1 room, on a
device that passes a tier check, a single unobtrusive control — `Belépés a térbe` — turns on
the depth layer. Opt-in, never automatic, remembered per session.

### 15.6 Reduced motion

`prefers-reduced-motion: reduce` disables all threshold passes, all parallax, all drift and
all auto-motion. Transitions become 200 ms opacity fades. The existing codebase already honours
this everywhere; that discipline must survive the rebuild without exception.

### 15.7 Performance strategy

| Rule | Value |
|---|---|
| First-load transfer | **≤ 350 KB** (today the homepage is 817 KB) |
| Largest single image | ≤ 90 KB (AVIF, 1080 px wide) |
| WebGL on mobile | Off by default. Bundle not downloaded unless opted in |
| Simultaneous decoded images | ≤ 4 |
| Texture / image cap | 2048 px, DPR capped at 2 |
| Fonts | Two faces above the fold, preloaded. The current 315 KB all-ten-files load must be fixed first — see §18 |

### 15.8 What mobile does *better* than desktop

Worth stating, because "mobile must be first-class" (brief rule 7) is only true if something is
actually better there: swiping through the real camera positions of a room is more direct and
more tactile than mouse-driven parallax, and holding a full-bleed interior in your hand at
arm's length is closer to standing in it than a browser window ever is. **The mobile
experience is designed first and the desktop treatment is derived from it.**

---

## 16. Accessibility

Accessibility is the fallback ladder's bottom rung, which means it is load-bearing for the
whole architecture rather than a compliance pass at the end.

| Requirement | How |
|---|---|
| **Keyboard** | Everything reachable in DOM order. `Esc` → plan. Arrows → viewpoints/gallery. Gates are real `<button>`s over the canvas, never canvas-only hit tests. |
| **Visible focus** | The existing `:focus-visible { outline: 2px solid var(--brass) }` rule, kept, and verified against dark grounds — brass on ink needs checking and may need a light variant. |
| **Semantic structure** | One `<h1>` per route, real `<nav>`/`<main>`/`<article>`, the existing skip link and `aria-current`. The canvas is `aria-hidden`; the content lives in the DOM beside it. |
| **Reduced motion** | §15.6. Non-negotiable. |
| **Readable typography** | Body ≥ 16 px, measure ≤ 70 characters. **Cormorant Light 300 must not be used below 24 px** — the audit flags it as the thing to watch on low-DPI Android, and it is right. |
| **Contrast** | 4.5:1 for body, 3:1 for large display. **Type over photographs must never rely on the photograph** — every text-over-image placement gets a scrim or sits in a solid field. This must be checked per frame during art direction, not assumed. |
| **Alternative navigation path** | The plan is a complete, ordinary, linked index of every route. Anyone can bypass the entire spatial layer permanently. |
| **Non-WebGL fallback** | Every room is server-rendered as a complete project page *first*; the spatial layer is added on top. Kill WebGL entirely and the site is still whole. |
| **Alt text** | 82 of 371 alts are machine junk (Facebook CDN filenames, `galeria_kep_21`, 22 identical strings). **A full re-authoring pass is required regardless of the redesign.** Alts are authored per image in `projektek.json` — which the admin *does* preserve — so this work is safe to do now, before any rebuild, and should be. |
| **Screen readers** | A room announces: name, category, "N photographs", and the dossier as a link. It does not narrate spatial state, because spatial state is decoration. Gates announce their destination and nothing about the geometry. |
| **Language** | `lang="hu"` correct today. If an English version is commissioned (Phase 0 §17.6), it is a routing decision that must be taken before Phase 2, not retrofitted. |

**The test:** navigate the whole site with a keyboard, with `prefers-reduced-motion` on, with
WebGL disabled, and reach every project, About and Contact. If that fails, the release is
blocked.

---

## 17. Loading Experience

### Principle: **the room is always already there.**

There is no loading screen. There is no percentage. There is no logo that draws itself. The
first thing painted is a real photograph of a real DUNA interior, and everything else arrives
behind it while the visitor is already reading.

### How it actually behaves

1. **0 ms** — HTML, critical CSS, and the SCENE 01 LQIP (a ~2 KB blurred inline placeholder).
   Text is readable immediately.
2. **~400 ms** — the SCENE 01 frame resolves in place. This is LCP. Target < 1.8 s on mid
   Android / 4G.
3. **Behind it, silently** — fonts (preloaded, two faces), then the SCENE 02 texture group,
   fetched when SCENE 01 is 50 % scrolled.
4. **The only progress signal is the photograph itself.** LQIP → sharp is a real, honest,
   continuous indicator of loading, and it needs no chrome around it.

### When a room is entered directly

The static project page renders instantly and completely — cover, facts, gallery. If the
spatial layer is coming, a **hairline rule fills across the top of the frame in proportion to
bytes actually decoded** — never a synthesised timer. When it completes, the room takes over
with a threshold pass. If it never completes, nothing visibly fails: the visitor keeps a
complete page and is never told they missed anything.

### Failure

| Failure | Response |
|---|---|
| WebGL unavailable / context lost | Silent drop to plates. No message. |
| Texture group times out (> 3 s) | Stay on plates permanently for this session. |
| Depth map missing | Room renders flat. Still a room, just without displacement. |
| Everything fails | Today's project page. Which is a good page. |

**Never:** a fake percentage, a spinner over an empty room, a "best viewed on desktop" notice,
or a skip-intro button — the last of which implies there was an intro worth skipping.

---

## 18. Performance Architecture

### 18.1 Budgets (hard limits — a build that exceeds them fails)

| Budget | Desktop | Mobile |
|---|---|---|
| First-load transfer | ≤ 350 KB | ≤ 300 KB |
| LCP | < 1.5 s | < 1.8 s (mid Android / 4G) |
| Fonts, first load | ≤ 90 KB (down from 315 KB) | ≤ 90 KB |
| JS, first load, decoded | ≤ 60 KB | ≤ 60 KB |
| WebGL bundle | Lazy, never in first load | Not downloaded unless opted in |
| Per-room transfer | ≤ 400 KB | ≤ 250 KB |
| Largest image | ≤ 140 KB | ≤ 90 KB |
| Texture cap / DPR cap | 2048 px / 2 | 2048 px / 2 |
| Simultaneous WebGL contexts | **1**, for the whole site | 1 |

### 18.2 Rules

1. **Fix the fonts before writing a line of WebGL.** 315 KB of fonts is currently the largest
   category on the homepage — larger than CSS, JS and HTML combined — and the `unicode-range`
   subsetting yields nothing because Hungarian ő/ű forces `latin-ext` and `latin` then loads
   too. Subset to actual glyph coverage, preload the two above-the-fold faces. **This is the
   single biggest performance win available and it is independent of the redesign.**
2. **Fix the four unresized hero images.** `index.html:42-44` and `design-manufaktura.html`
   reference source originals rather than the `-1400` derivatives the build already generates.
   Those four references are the only reason 57.8 MB of originals must ship. Fixing them makes
   ~57.7 MB of `deploy/` removable — a two-line change.
3. **AVIF + WebP + JPEG fallback, `<picture>` + `srcset`.** No `srcset` exists today; every
   card is served the same `-800` JPEG at every viewport and DPR.
4. **Nothing immersive loads at page load.** Room assets load on approach, gated by
   `IntersectionObserver`, in priority order from a per-room manifest.
5. **One renderer, ever.** The canvas is created once and reused. Rooms swap textures and
   uniforms; they never create contexts. Contexts are the resource mobile GPUs run out of.
6. **Depth maps are authored offline**, committed as assets, and never generated in CI. CI
   already spends 2–4 minutes on 371×2 derivatives; derivative caching is required before
   adding anything to that step.
7. **No post-processing stack on mobile.** No bloom, no DOF, no full-screen passes.
8. **Reduced motion short-circuits before allocation** — the WebGL bundle is not fetched at
   all when `prefers-reduced-motion: reduce` is set.
9. **Every route must be complete before JS.** Server-rendered HTML is the deliverable; the
   experience is the enhancement. This is also what preserves the 41 indexable pages and the
   sitemap (Phase 0 risk #13).
10. **Ship nothing unreferenced.** `slider-2.png` (906 KB), `logo2_c.png`,
    `dunaenterior_logo.png`, `ddm-vebre.jpg`, `latvanyterv.jpg` and one exact-duplicate 386 KB
    grant image are deployed and never requested.
11. **Explicit cache headers.** The content-hash `?v=` scheme already makes long-lived
    immutable caching safe; `_headers` currently sets only `X-Robots-Tag`. Make it explicit
    rather than relying on Cloudflare Pages defaults (Phase 0 §13.8, marked UNKNOWN).
12. **Flip `sajatDomainEl` at go-live.** The build currently emits site-wide `noindex`. Correct
    for staging, catastrophic if it ships.

---

## 19. Information Architecture

### 19.1 User-facing structure

```
/                          A ház — the homepage journey (7 scenes)
│
├── /alaprajz              THE PLAN — every project, filterable          [NEW]
│   └── (replaces /referenciak as the primary index; /referenciak stays as an alias)
│
├── /referenciak/<slug>/   Any project — renders as Room, Cinematic or Story
│   │                      depending on `szint` in terek.json. URL UNCHANGED (§0.2).
│   └── #adatlap           The dossier — the accessible twin of every room
│
├── /flotta                THE FLEET — 13 archive boats as one dense index [NEW]
│
├── /metszet               THE SECTION — craft, material, manufacture      [NEW]
│                          (absorbs and replaces /design-manufaktura's role)
│
├── /rolunk                DUNA DNA — the founder's letter and the workshop story
│
├── /kapcsolat             Contact — structurally unchanged
│
├── /palyazatok            EU grant disclosures — legally mandatory, unchanged
├── /impresszum  /adatkezelesi-tajekoztato  /sutik    Legal, unchanged
├── /admin                 The client's CMS, untouched
└── /404
```

**Routes removed: none.** `/design-manufaktura` is retained and re-pointed at `/metszet` when
the section chapter ships, so no inbound link breaks. `Hajóépítés ↗` moves out of the primary
nav into `/flotta` and the footer (§12.5).

### 19.2 Underlying content structure

```
data/projektek.json    ← UNCHANGED. Client-owned, admin-writable.
                         slug · cim · kategoria · link · leiras · kiemelt · allapot · kepek[{file,alt}]
                         Content gaps to fill here: 30 empty `leiras`, 82 junk `alt`.

data/terek.json        ← NEW. Studio-owned. Keyed by slug. Additive; never touched by admin.
                         szint · tipus · sorrend · hangulat · anyagok[] ·
                         szobak[{ id, nev, nezopontok[], kapuk[] }] · reszletek[] ·
                         adatok{helyszin,ev,megbizo,terulet,hatokor,fotos} · szoveg

data/ceg-adatok.json   ← UNCHANGED. Single source of company truth.
data/palyazatok.json   ← UNCHANGED. Legally mandatory.

img/projektek/<slug>/  ← UNCHANGED source frames.
img/melyseg/<slug>/    ← NEW. Depth maps, 8-bit PNG, 512 px, authored offline.
```

**Join rule:** the build joins by `slug` and hard-fails if `terek.json` references a slug or a
file that `projektek.json` does not contain — matching the existing `build.mjs` validation
discipline. A project with no `terek.json` entry renders exactly as it does today.

### 19.3 The seven categories

`hotel · etterem · lakoingatlan · kastely · szakralis · egyedi · hajo` are kept exactly as
they are in `build.mjs:30`. They are the adjacency graph for the enfilade (§8) and the grouping
in the plan. They are **not** the navigation.

---

## 20. Signature Interaction

# THE THRESHOLD PASS — *A küszöb*

One interaction. Every transition on the site is this interaction. There is no second effect.

### 20.1 What it is

The frame you are looking at moves toward you. The nearest thing in it — a door jamb, a post,
a window mullion, a wall edge — grows past the edges of the screen and dissolves as it passes
your head. What was behind it is now the room you are in.

Not a crossfade. Not a slide. Not a wipe. **The physical experience of walking through a
doorway**, produced from a photograph and a depth map.

### 20.2 What triggers it

- Continuing to scroll forward at the end of a scene
- Clicking a project in the plan
- Activating a gate inside a room
- Browser back (played in reverse)

**Every navigation on this site is a threshold pass.** That is what makes it a language
instead of an effect.

### 20.3 What happens, precisely

| Phase | ms | Outgoing frame | Incoming frame |
|---|---|---|---|
| Approach | 0–260 | Near layer scales 1.00 → 1.35, mid 1.00 → 1.12, far 1.00 → 1.03 | Held at 0.94, opacity 0 |
| Pass | 260–620 | Near layer scales to 2.4 and fades out from the edges inward | Far layer rises to 0.98, opacity 0 → 1 through the outgoing near layer's depth mask |
| Settle | 620–900 | Gone | Scales 0.98 → 1.00 with a long ease-out. Nothing overshoots |

The critical detail: the incoming image is revealed **through the outgoing image's depth
mask** — it appears first in the doorway-shaped hole and spreads outward as the frame passes.
That is what makes it read as *through* rather than *over*, and it is the entire difference
between this and a crossfade.

Total 900 ms. Slow enough to feel like weight, fast enough that repeating it fifteen times is
not a tax.

### 20.4 Why it exists

Because it is what DUNA sells. DUNA builds the thing you pass through — doors, panelled walls,
fitted joinery, the inside of a hull. The threshold is literally the product. A site about
fitted interiors whose only interaction is *passing through fitted interiors* is a site whose
form and content are the same argument.

### 20.5 Three types, one physics

| Type | Near layer | Means | Where |
|---|---|---|---|
| **Ajtó** (door) | A jamb, an edge, a panel | Another room | Between interiors |
| **Ablak** (window) | A mullion, glazing, a frame | Something that moves | Into and out of the boats |
| **Kapu** (gate) | A large opening, a threshold at scale | A change of chapter | Into the craft section, into the plan |

Same physics, same timing, different near layer, different meaning. This is what keeps fifteen
repetitions from feeling like fifteen repetitions.

### 20.6 On mobile

Identical choreography, three composited CSS layers, no WebGL, no depth mask — the incoming
layer is revealed by a static radial or shape mask baked at authoring time instead of derived
from the depth map. Visually ~85 % of the desktop effect at ~2 % of the cost. The 15 % that is
lost is edge fidelity at the passing layer, which nobody perceives at 900 ms on a 6-inch
screen.

### 20.7 How it avoids becoming repetitive

- **Rest beats.** Every pass is followed by a held frame where nothing moves. The rest is what
  makes the movement register.
- **Three types**, each meaning something different.
- **Speed hierarchy.** Room→room is 900 ms; plan→room is 620 ms; back is 480 ms. Familiar moves
  are faster.
- **It is never decorative.** It only ever fires when the visitor actually changed location.
  It is never used for a section change within a page.

---

## 21. Motion Principles

### 21.1 Transition philosophy

There is one transition (§20) and one fade (leaving the site's spatial layer — home, contact).
Nothing else moves between states. A second transition type must be argued for and would have
to earn its place by displacing the threshold pass somewhere.

### 21.2 Camera philosophy

The camera walks. It does not fly, orbit, roll, whip-pan, or fall. It moves forward at eye
height at roughly walking speed, and when it stops, it stops completely — with one exception:
HABLEÁNY drifts, because it is on the water (§10).

Never: barrel roll, dolly zoom, shake, orbit-around-object, "cinematic" FOV pumping.

### 21.3 Scroll relationship

Scroll is position, not a trigger. One pixel of scroll is always one unit of forward movement;
the relationship never inverts, never accelerates non-linearly, and never continues after the
finger lifts beyond natural momentum decay. **No scroll hijacking on touch.** Pinned scenes use
real scroll distance so the scrollbar tells the truth.

### 21.4 Hover philosophy

Hover reveals information; it never moves geometry. A gate brightens its hairline and shows its
label. A plan cell fades up its cover frame. Cards do not tilt toward the cursor — the existing
pointer-tracked tilt is retired, because in a site about real spatial depth, fake CSS depth on a
card reads as cheap. Gated to `hover: hover and pointer: fine`, as the codebase already does.

### 21.5 Easing philosophy

Water, not springs.

| Move | Curve | Duration |
|---|---|---|
| Threshold pass | `cubic-bezier(0.16, 0.84, 0.24, 1)` | 900 ms |
| Reverse pass | same | 480 ms |
| Fade | `cubic-bezier(0.4, 0, 0.2, 1)` | 240 ms |
| Type reveal | `cubic-bezier(0.2, 0.7, 0.2, 1)` | 520 ms, 40 ms stagger |
| Hover | linear-ish | 120 ms |

**No bounce, no overshoot, no elastic, no spring, anywhere, ever.** Momentum decays; it does
not rebound. The existing scroll-impulse decay (`0.86^frames` in `script.js`) is exactly the
right feel and should be carried into the new engine.

### 21.6 Speed hierarchy

```
120 ms   hover, focus, small state
240 ms   fades, reduced-motion substitutes
480 ms   backwards, familiar moves
520 ms   type reveals
900 ms   the threshold pass — the slowest thing on the site, deliberately
```

The most important move is the slowest. Weight is communicated by duration.

### 21.7 Motion reduction

`prefers-reduced-motion: reduce` → every duration above collapses to a 200 ms opacity fade,
parallax is 0, drift is 0, auto-motion is 0, and the WebGL bundle is never fetched. The
existing codebase honours this everywhere and that record must not be broken.

---

## 22. First Prototype Definition

### Two steps. The first is throwaway. The second is the foundation.

### STEP A — the spike (throwaway, ~2 days)

Does 1.86 MP hold up full-screen with depth displacement? Everything else depends on the
answer, and it is cheap to find out.

- **What:** one HABLEÁNY frame + one offline-generated depth map + a displacement shader, on a
  scratch branch, outside the site.
- **Success:** the near mullion separates cleanly from the far river with no visible tearing
  or stretching at 1440p, and the HDR halos in the source do not destroy the depth edges.
- **If it fails:** the whole Level 1 tier collapses into Level 2, the concept survives intact
  (the threshold pass works fine on flat layers), and the architecture above needs no
  restructuring — only §7's counts change. **This is why the concept was designed not to
  depend on it.**

### STEP B — the prototype

| | |
|---|---|
| **Page** | `/referenciak/duna-cruises-hableany/` — the real, existing URL, on a branch. The live site stays untouched. |
| **Project** | Duna Cruises HABLEÁNY. |
| **Assets** | 6 day frames + 4 night frames of the salon from the existing 23 (`03, 05, 06, 08, 11, 12` day; `19, 21, 22, 23` night), 10 hand-corrected depth maps, 2 macro details. Nothing new is shot or bought. |
| **Interaction** | The threshold pass (§20), in both directions — desktop WebGL and mobile CSS. Plus horizontal swipe between viewpoints on mobile. |
| **Transition** | Day → night inside the room, on scroll. |
| **Tech** | Vite + TypeScript + Three.js (`WebGLRenderer`) + Lenis + GSAP/ScrollTrigger, per Phase 0 §12. `build.mjs`'s image and validation logic ported as a pre-step, not rewritten. `data/terek.json` created with exactly one entry. |
| **Explicitly out of scope** | Multi-room navigation, the plan, the homepage, the craft chapter, any copy rewrite beyond this one project, and anything touching the Worker, the form, the admin or the grant content. |

### Success criteria — measured, not judged

| # | Criterion | Threshold |
|---|---|---|
| 1 | The transition reads as *going through*, not *fading* | 5 of 5 people describe it in spatial language, unprompted |
| 2 | Depth reads as space | The room is described as a place, not a picture |
| 3 | Desktop performance | ≥ 58 fps through the pass, 1440p, mid-range GPU |
| 4 | Mobile performance | ≥ 45 fps, mid-range Android, CSS path |
| 5 | Mobile first load | ≤ 300 KB; LCP < 1.8 s on 4G |
| 6 | Degradation | WebGL off → complete page, no visible failure, no console error |
| 7 | Keyboard + reduced motion | Full content reachable; nothing animates |
| 8 | Resolution honesty | No visible softness at full bleed on a 1440p display |
| 9 | Admin safety | Client edits the project in the live admin, saves — `terek.json` is unaffected |

**Criterion 9 is the one that protects the client's ability to run their own site, and it is
the reason for the §0.1 correction.**

### What the prototype decides

If it passes: Phase 3 builds the homepage's seven scenes and promotes Domus Collis and Bodajki
to rooms. If criteria 3–5 fail: the site ships entirely at Level 2 — flat layered plates with
the same threshold pass — which is still a coherent, distinctive site, and is the honest
outcome given the asset ceiling.

---

## 23. Awwwards Strategy

Not a gimmick plan. An assessment of where this experience is genuinely strong and where it is
genuinely weak.

| Criterion | Strength | Weakness | Action |
|---|---|---|---|
| **Design** | A committed, unusual, material-specific art direction already exists in `style.css` — paper, oak-shifted greys, thin Garamond over a drafting grid. It is not a template and it does not look like anything else. | No dark register yet; type-over-photograph contrast unproven. | Define the night tokens; check every text-over-image placement individually. |
| **Creativity** | *An interior with no outside* is a genuinely original organising idea, and the reveal that the flagship room floats is a real narrative turn. | Depends on the boat reveal actually landing. | The reveal is the prototype's second success criterion. |
| **Usability** | The plan is always one key away; every room has four exits; every route is a complete page before JS. | Enfilade navigation is unfamiliar and could confuse on first contact. | The first scroll teaches the grammar before any decision is required. Test with five people who have never seen it. |
| **Content** | 30 years, 371 photographs, a real 1200 m² workshop, 15 boats, a genuinely good founder's letter. This is not a fictional agency portfolio. | **30 empty descriptions. No workshop photos. No people. No video. Hungarian only.** This is the biggest risk to the submission, not the technology. | Commission copy for 8–10 projects. Push hard for the workshop shoot. Decide on English before Phase 2. |
| **Interaction** | **One** interaction, used everywhere, that means something. Juries reward coherence over quantity. | If the pass is even slightly wrong it will read as a crossfade. | 900 ms, depth-masked reveal, rest beats. Prototype criterion 1. |
| **Motion** | Water easing, no bounce anywhere, a real speed hierarchy, exemplary reduced-motion handling. | Long durations risk reading as slow rather than deliberate. | Rest beats and the reverse-pass speed-up exist precisely for this. |
| **3D / WebGL** | Used in exactly two places, for a reason, with a complete fallback. | It is 2.5D, not 3D, and a jury may want more spectacle. | Do not pretend otherwise. Restraint with a working non-WebGL path is more defensible than an unstable showcase. |
| **Performance** | Hard budgets, one context, lazy everything, and a codebase that already has genuinely excellent discipline (one devDependency, zero runtime dependencies). | Current baseline is 817 KB with 315 KB of fonts. | Fix fonts and the four hero images first — both are independent of the redesign. |

### The honest summary

This site's competitive advantage is **coherence and truthfulness**, not spectacle. It cannot
out-spectacle a studio with a budget for 3D scanning and video. It can be the site where every
single element — the palette, the transition, the structure, the copy — comes from the same
place, and where that place is a real workshop in Győr that has been building the inside of
things since 1991.

**The single highest-return investment is not technical. It is a day of photography in the
workshop.**

---

## 24. Risks

Phase 0's sixteen risks stand. These are new or changed by this architecture.

| # | Risk | Severity | Detail | Mitigation |
|---|---|---|---|---|
| 1 | **The admin destroys spatial metadata** | **High → Resolved** | `admin.js:827 tisztit()` whitelists fields and silently drops unknown ones on every save. | §0.1: spatial data lives in `data/terek.json`, which the admin never touches. Prototype criterion 9 verifies it. |
| 2 | **No project copy** | **High** | 30 empty `leiras`. A room with nothing to say is a slideshow. | Commission copy for 8–10 projects. Every room renders without it, but weakly. |
| 3 | **Resolution ceiling** | **High** | ~1.86 MP for the flagship. Full-bleed may be visibly soft. | STEP A spike answers this in two days, before anything is built on it. |
| 4 | **The enfilade is not understood** | Medium | An unfamiliar navigation model can read as "broken" rather than "different". | Teach it with the first scroll; keep the plan one key away; test with five naive users. |
| 5 | **Depth estimation fails on this imagery** | Medium | HDR halos, glazing and reflections all mislead monocular depth models — and HABLEÁNY has all three. | Hand-correct all ~10 maps. Budget the time. Flat rooms are an acceptable fallback. |
| 6 | **The threshold pass reads as a crossfade** | Medium | If the depth-masked reveal is wrong, the entire signature collapses into an ordinary transition. | Prototype criterion 1, tested with people, not with opinions. |
| 7 | **Motion sickness** | Medium | Sustained forward camera movement triggers it in a real minority of visitors. | Constant velocity, no rotation, no FOV change, rest beats, and full reduced-motion honouring. |
| 8 | **Stack migration risk** | Medium | Vite + TS + Three.js is a migration, not an addition. The current site works and is deployed. | Branch only. Live site untouched throughout. Ported build validations must pass identically. |
| 9 | **SEO** | Medium | 41 indexable pages exist today. | Server-rendered HTML per route; identical URLs (§0.2); flip `sajatDomainEl` at go-live. |
| 10 | **Content gaps make the craft chapter thin** | Medium | §11 is designed around one chair because that is all the archive contains. | It works today; it becomes strong with three workshop photographs. Ask. |
| 11 | **Boat domain split** | Low–Medium | `dunahajok.hu` currently sits in the primary nav and sends visitors away mid-argument. | §12.5 recommendation; client decision required. |
| 12 | **Scope creep from "the plan"** | Low | The plan is the easiest thing on the site to over-design. | It is orthographic, flat, fast, and deliberately the least cinematic route. Hold that line. |

---

## 25. Open Questions

Phase 0's fourteen questions all still need answers. These are the ones that now block
specific decisions in this document.

| # | Question | Blocks |
|---|---|---|
| 1 | **Do the camera masters exist**, for HABLEÁNY at minimum? | The Level 1 tier. §7, §22 STEP A |
| 2 | **Will copy be commissioned** for 8–10 projects? | §5.6, §7. Rooms render without it, but the content criterion in §23 fails |
| 3 | **Can the workshop be photographed?** | §11 and §13 beats 04–06. The highest-return open question on the project |
| 4 | **Any video at all?** Even 20 seconds. | Would change the register of §11 entirely |
| 5 | **Hotel Domus Collis rights** — Facebook-CDN provenance | Whether room #2 exists |
| 6 | **`dunahajok.hu`: absorb or cross-link?** | §12.5 and the primary nav |
| 7 | **English version?** | Routing. Must be decided before Phase 2, not retrofitted |
| 8 | **Is the stack migration approved?** | Everything in §22 STEP B |
| 9 | **Is CGI acceptable presented as CGI?** (Kristály, Zirci) | §7 Level 2 |
| 10 | **Can we say "the workshop can be visited"?** | §14 |
| 11 | **Do floor plans or drawings exist anywhere?** | Would materially improve §4 SCENE 06 and §13 |
| 12 | **Who are the four people, and can they be photographed?** | §13 beat 06 |

**The three that matter most, in order: 1, 3, 2.** Masters, workshop shoot, copy. Two of the
three are content problems that no amount of engineering can solve, and both are cheap
relative to the build.

---

## 26. Phase 2 Requirements

Phase 2 is **not** the full site. It is the spike, then the prototype.

### Before Phase 2 starts

- [ ] Answer open questions 1, 2, 3 and 8 (masters, copy, workshop, stack approval)
- [ ] Written confirmation that the live site is not touched during the rebuild
- [ ] Approve the §18.1 performance budgets as hard limits
- [ ] Approve the §15.5 mobile fallback contract
- [ ] Approve `data/terek.json` as a separate file (§0.1) — this is a technical decision with
      a client-facing consequence: the admin keeps working unchanged

### Independent of everything above — do these now, they are pure wins

These four are not part of the redesign, carry no risk, and improve the site that is live today:

1. **Fix the four hero images** to use the `-1400` derivatives. Two lines. ~57.7 MB off the
   deployed artifact.
2. **Subset and preload the fonts.** 315 KB → target ≤ 90 KB. The largest single performance
   win available.
3. **Re-author the 82 junk alt texts** in `projektek.json`. Accessibility, and the admin
   preserves this field, so the work is safe and permanent.
4. **Remove the unreferenced assets** (`slider-2.png`, `logo2_c.png`, `dunaenterior_logo.png`,
   `ddm-vebre.jpg`, `latvanyterv.jpg`, one duplicate grant image).

### Phase 2 deliverables

1. STEP A spike, and a written go/no-go on Level 1
2. STEP B prototype at `/referenciak/duna-cruises-hableany/`, on a branch
3. `data/terek.json` with one complete entry, and the schema documented
4. The depth-map authoring procedure, written down and repeatable
5. Measured results against all nine success criteria in §22
6. `docs/PHASE-2-PROTOTYPE.md`

### Phase 3 preview (not approved, for planning only)

The homepage's seven scenes; the plan; promotion of Domus Collis and Bodajki to rooms; the
craft section; THE FLEET; the About rewrite. Only after Phase 2's criteria are met.

---

## Appendix — Changes made during Phase 1

**Files created (1):** `docs/PHASE-1-EXPERIENCE-ARCHITECTURE.md` — this document.

**Files modified:** none.
**Assets modified, renamed, compressed or deleted:** none.
**Dependencies added or changed:** none.
**Code written:** none. The JSON and JS in this document are specifications, not implementations.

`docs/` is not in the `ASSETS` array in `build.mjs:44`, so this file is not copied into
`deploy/` and does not reach the published site.
