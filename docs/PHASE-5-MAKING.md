# DUNA — THE LIVING INTERIOR
# PHASE 5 — THE MAKING / THE WORKSHOP

**Date:** 2026-08-16
**Scope:** the content audit of every making-related photograph in the archive, THE MAKING at
`/keszules.html`, the reusable section-cut system, and three verified Phase 4 carry-overs.
**Basis:** [PHASE-0-AUDIT.md](PHASE-0-AUDIT.md), [PHASE-1-EXPERIENCE-ARCHITECTURE.md](PHASE-1-EXPERIENCE-ARCHITECTURE.md),
[PHASE-2-DESIGN-SYSTEM.md](PHASE-2-DESIGN-SYSTEM.md), [PHASE-3-PLAN-HOMEPAGE.md](PHASE-3-PLAN-HOMEPAGE.md),
[PHASE-4-FLEET.md](PHASE-4-FLEET.md).
**Built in the prescribed order:** audit → data → route → experience → connection → cleanup → validation.

**Stack unchanged.** One devDependency (`sharp`), zero runtime dependencies. No React, no Vite,
no Three.js, no GSAP. `kuszob.js`, `ter.js`, `terv.js` and `fooldal.js` were **not touched at all**.
The opening runs on the engine that already existed; the sequences run on the section cut that
already existed.

---

## 1. Content Audit

Every candidate photograph was opened and looked at — not read off a filename. Contact sheets were
rendered into a scratch directory; the repository was not modified. Resolutions were measured with
`sharp`, not assumed.

### 1.1 The decisive finding

**The archive documents the work, not the workplace.**

371 photographs. **Exactly one** shows the hall itself (`meyer-motorcsonak-2/05`, 0.75 MP, 2004,
with a burnt-in date stamp). There is no workbench-with-tools frame, no machine, no finishing
department, no timber store, no portrait of anyone. What there *is*, in quantity, is **evidence of
things being made**: stripped hulls, free ribs, clamps by the dozen, glued plank edges, primer,
spray booths, raw carvings, material samples, and one gate being carried into a building by eight
people.

So Phase 5 is not a workshop chapter. It is a **making** chapter, and it says so.

### 1.2 The second decisive finding — resolution splits the material in two

| Group | Projects | Resolution | Full-bleed capable? |
|---|---|---|---|
| Furniture / object making | `fafaragasok`, `vatikani-diszdoboz`, `garzon-plaza-hotel`, `szent-laszlo-…`, `mercedes-plato` | **1.57 – 3.15 MP** | ✔ |
| Boat making (the strongest process record) | `boesch-640`, `boesch-580`, `jegvitorlas`, `boesch-560`, `arcangeli`, `volvo-penta`, `meyer-2` | **0.31 – 0.85 MP** | ✘ |

`boesch-640-de-luxe/10` — the best material macro in the boat archive — is **640 × 480**.

This single table decided the whole page's form. The making evidence is *documentary*, and a
documentary photograph shown full-bleed at 1440px is a lie about its own quality. Phase 4 already
paid for this (its limitation #4: the Rivális cabin frame at 0.46 MP is visibly soft). So THE
MAKING is **not** a full-bleed enfilade. It is the **section cut** — paper ground, one plate at a
time, sized honestly — which is exactly the surface Phase 3 §12 invented for "the photograph stops
being a space and becomes a page."

### 1.3 Inventory — every sequence considered

Legend: **type** = construction / material / object / space. **WM** = watermark. **date** = burnt-in
camera date stamp.

| Source | Project | Frames | Res. | WM | Date | Type | Used as |
|---|---|---|---|---|---|---|---|
| `fafaragasok/09` | Fafaragások | 1 | 1.57 MP | — | — | material | **opening 1 — RÉSZLET** |
| `fafaragasok/10` | Fafaragások | 1 | 1.57 MP | — | — | object, in the plant | **opening 2 — TÁRGY** |
| `fafaragasok/03` | Fafaragások | 1 | 1.57 MP | — | — | space | **opening 3 — TÉR** |
| `fafaragasok/08` | Fafaragások | 1 | 1.57 MP | — | — | material | homepage section cut (kept) |
| `fafaragasok/01,02,04,05,06,07` | Fafaragások | 6 | 1.57 MP | — | — | object / space | gallery only |
| `boesch-640-de-luxe/10` | Boesch 640 | 1 | **0.31 MP** | ✔ | — | material macro | **A HAJÓTEST — anyag** |
| `boesch-640-de-luxe/03` | Boesch 640 | 1 | 0.48 MP | ✔ | — | construction (ribs) | **A HAJÓTEST — kéz** |
| `boesch-640-de-luxe/04` | Boesch 640 | 1 | 0.79 MP | ✔ | — | construction (clamps) | **A HAJÓTEST — kéz** |
| `boesch-640-de-luxe/12` | Boesch 640 | 1 | 0.85 MP | ✔ | — | surface macro | **A HAJÓTEST — kéz** |
| `boesch-640-de-luxe/13` | Boesch 640 | 1 | 0.85 MP | ✔ | — | object (spray booth) | **A HAJÓTEST — tárgy** |
| `boesch-640-de-luxe/19` | Boesch 640 | 1 | 0.85 MP | ✔ | — | interior | **A HAJÓTEST — tér** |
| `boesch-640` remainder | Boesch 640 | 13 | 0.31–0.85 | ✔ | — | construction | Fleet + gallery |
| `szent-laszlo-…/06` | Szent László kapu | 1 | **3.15 MP** | — | — | **installation, hands** | **A KAPU — kéz** |
| `szent-laszlo-…/08` | Szent László kapu | 1 | 3.15 MP | — | — | **installation, many hands** | **A KAPU — kéz** |
| `szent-laszlo-…/02` | Szent László kapu | 1 | 2.43 MP | — | — | object in situ | **A KAPU — tárgy** |
| `szent-laszlo-…/01` | Szent László kapu | 1 | 2.43 MP | — | — | space | **A KAPU — tér** |
| `szent-laszlo-…/03,04,05,07` | Szent László kapu | 4 | 3.15 MP | — | — | installation | gallery (alt written) |
| `garzon-plaza-hotel/14` | Garzon Pláza | 1 | 2.43 MP | — | — | **material samples** | **A SZÉK — anyag** |
| `garzon-plaza-hotel/15` | Garzon Pláza | 1 | 2.43 MP | — | — | object on white | **A SZÉK — tárgy** |
| `garzon-plaza-hotel/16` | Garzon Pláza | 1 | 2.43 MP | — | — | joinery macro | **A SZÉK — tárgy** |
| `garzon-plaza-hotel/02` | Garzon Pláza | 1 | 2.23 MP | — | — | space | **A SZÉK — tér** |
| `garzon-plaza-hotel/01,05,07,12,19` | Garzon Pláza | 5 | 2.2–2.4 | ✔ | — | **renders** | homepage only — see §1.5 |
| `vatikani-diszdoboz/05` | Vatikáni díszdoboz | 1 | **2.47 MP** | — | — | **material macro** | **A DOBOZ — anyag** |
| `vatikani-diszdoboz/03,04` | Vatikáni díszdoboz | 2 | 2.47 MP | — | — | object on white | **A DOBOZ — tárgy** |
| `vatikani-diszdoboz/01,02` | Vatikáni díszdoboz | 2 | 2.47 MP | — | — | handover, identifiable people | **deliberately excluded — §1.6** |
| `meyer-motorcsonak-2/05` | Meyer 2 | 1 | 0.75 MP | ✔ | ✔ `'04 3.22` | **workshop wide** | **the closing evidence frame** |
| `boesch-580/10` | Boesch 580 | 1 | 0.79 MP | ✔ | — | **person with a power tool** | **not used — §1.7** |
| `arcangeli-super-jolly/13` | Arcangeli | 1 | 0.48 MP | ✔ | — | person in background | not used |
| `jegvitorlas/01` | Jégvitorlás | 1 | 0.85 MP | ✔ | — | **planks on the workbench** | not used — Fleet already carries it |
| `meyer-motorcsonak-2/01,02` | Meyer 2 | 2 | 0.74 MP | ✔ | ✔ | rot / damage | not used |
| `volvo-penta/01,02,03` | Volvo Penta | 3 | 0.76 MP | ✔ | ✔ `'03 12 18` | restoration | not used |
| `boesch-560/02,04` | Boesch 560 | 2 | 0.76 MP | ✔ | ✔ `'03 4 23` | **timber stock**, stripped hull | not used |
| `mercedes-plato/04,06` | Mercedes plató | 2 | 2.04 MP | ✔ | — | joinery macro | not used — §1.4 |

**Legal / usage status:** every frame above comes from `data/projektek.json`, i.e. from the client's
own published portfolio. Nothing was sourced from outside the repository. No stock, no AI, no
third-party imagery was introduced in this phase. The only usage questions that remain are the ones
Phase 0 already opened (Domus Collis provenance) plus one new one, §1.6.

### 1.4 What was rejected, and why

- **`mercedes-plato`** — 2.04 MP, real joinery macros, a genuinely made object. Rejected because the
  archive holds **no construction and no material stage** for it: a sequence would have been two
  plates of the same finished object at two scales. That is a photo pair, not a chain, and the
  build now refuses it (§4.3).
- **`jegvitorlas`** — the best workbench frame in the archive (planks clamped on the bench, tools and
  a timber rack behind). Not used here because the Fleet's opening already carries this project as
  its VÁZ station, and duplicating it would have made THE MAKING look like a second Fleet.
- **The other five restoration sets** (Boesch 580 / 560, Volvo Penta, Meyer 2, Arcangeli) — real,
  strong, and all already visible in the Fleet's waterline with their `Váz` / `Felület` marks. THE
  MAKING links to the Fleet rather than repeating it.

### 1.5 One editorial rule that came out of the audit: **no renders on this page**

The archive contains five látványterv (CGI) frames, and the homepage's section cut uses one of them —
correctly labelled `· látványterv`, per Phase 0 risk #5. THE MAKING uses **none**. A render is what
was *drawn*, not what was *made*, and this chapter's whole claim is about the difference. The rule is
recorded in `data/keszules.json`'s schema header so a future editor does not undo it by accident.

### 1.6 One exclusion that needs the owner's decision

`vatikani-diszdoboz/01` and `/02` document the finished box being handed over in a Vatican room, and
one of the people present is publicly identifiable. These are real, undated-but-evidently-documented
photographs of a real DUNA object reaching its recipient — the only such frames in the archive.

**They were deliberately left out of the sequence.** Reasons, in order: (a) the chapter is about
making, and a handover is not a making stage; (b) captioning them accurately would mean asserting
who is in them, and no client-confirmed caption exists; (c) building the page's emotional peak on a
famous face would be exactly the "look how important we are" move the brief rules out. Their `alt`
text was written descriptively, without naming anyone, and they remain in the project gallery where
they always were. **If the owner wants them used, that is a content decision, not a code change.**

### 1.7 The strongest "hand" frame in the archive, and why it is not on the page

`boesch-580/10` shows a man, arm raised, a power tool in his hand, working on a lacquered hull. It is
the single clearest "someone actually made this" photograph DUNA has. It is 0.79 MP, watermarked,
and **the person is identifiable and unnamed**.

`szent-laszlo-…/06` and `/08` were used instead: they show hands and bodies on the object, the work
is unambiguous, and no one is the subject of a portrait. The same likeness question applies to them
in a milder form and is listed as an open item in §22.

---

## 2. Core Concept

The homepage ends its section cut on a chain. The Fleet ends on a hull that became a room. Both
leave the same question open — *who did this, and when?* — and the archive can only answer half of
it. So the chapter answers the half it can:

```
ANYAG    a surface you cannot yet place
   ↓
KÉZ      the state of being worked on — clamps, straps, sanding, eight people lifting
   ↓
TÁRGY    the finished thing, before it belongs anywhere
   ↓
TÉR      the room it turned into
   ↓
ÉLMÉNY   the room in use
```

The chapter's claim, made by the pictures rather than asserted in copy: **the finished room is the
visible end of a much longer process, and DUNA has photographs of the middle.**

Its second claim is made by an absence, in public: **ÉLMÉNY is 0 / 4.** No sequence in the archive
reaches the last station. The page prints that number.

Hungarian title: **A KÉSZÜLÉS** — *the making / the becoming*. Not "A műhely" (the workshop), because
we cannot show one; not "Rólunk", because the story emerges from the work.

---

## 3. Making Information Architecture

**Route:** `/keszules.html`, following the repository's own convention for top-level pages
(`alaprajz.html`, `flotta.html`). No rewrite rules, no redirects, **no existing URL changed.**

```
/keszules.html
├── A NYITÁS    three frames, one sticky stage, every threshold a KAPU
│                 RÉSZLET → TÁRGY → TÉR, one craft, one project
├── A GERINC    the five stations and how many sequences reach each
├── ×4 SOROZAT  the section cut, once per sequence, scale-driven
├── AZ ANYAG    the material vocabulary, derived from the sequences
├── A MŰHELY    one 2004 photograph and the stated gap
└── KIVEZETÉS   four real exits
    + the plan as an overlay, on Esc, exactly as in a room
```

**Deviation from the Phase 3/4 build lists, stated plainly:** both earlier phases named this route
`/metszet`. It is `/keszules.html` instead, because *metszet* (section cut) is the **device** — and
that device is already in use on the homepage at `#metszet`. Naming the route after the device would
have given the site a `#metszet` and a `/metszet` showing different things. The device kept its name
in the code (`.metszet`, `lemezHtml`); the chapter got its own.

Nothing is a separate microsite: same header, same footer, same plan overlay, same threshold engine,
same typographic roles, same tokens. The only new files the browser loads are `keszules.css`
(5.9 KB gzip) and `keszules.js` (2.5 KB gzip).

---

## 4. Section Cut System

Phase 3 built the section cut as **one hardcoded chain of seven plates** on the homepage. Phase 5
turns the underlying mechanism into a system that any number of sequences can use, **without
touching the homepage's proven output**.

### 4.1 What was actually made reusable

| Layer | Before | After |
|---|---|---|
| Plate markup | inline in `metszetHtml` | `lemezHtml(m, i, o)` — one generator |
| Plate CSS | `fooldal.css` only | `fooldal.css` (homepage) + `keszules.css` (chapter), same class names |
| Stepping | `fooldal.js`, bound to `#metszet` | `keszules.js`, **N sequences per page**, discovered by `[data-sorozat]` |
| Data | `terek.json $fooldal.metszet` | + `data/keszules.json` `sorozatok[]` |

**Verified:** the homepage's seven plates are unchanged after the refactor — same count, same
`sizes`, same project links, same `· látványterv` label, and no new attributes (§20).

### 4.2 The data model — the simplest structure that works

```jsonc
{
  "nyitas":  { "keretek": [ … ] },        // 3 frames, same shape ter.js already reads
  "sorozatok": [{
    "id", "felcim", "nev", "nevDolt",
    "bevezeto",                            // what this chain is
    "projekt",                             // ← the slug it becomes; the "what space" answer
    "flotta": true,                        // optional: also link into the Fleet
    "anyagok": ["mahagóni", "lakk", …],    // only what the photographs show
    "hianyzo": "…",                        // ← the missing-stage sentence, in words
    "allomasok": [{
      "szakasz": "anyag|kez|targy|ter|elmeny",   // the spine position
      "lepes":   "A palánk",                     // the displayed label
      "lepte":   "reszlet|targy|ter",            // THE SCALE
      "slug", "kep", "cimke"
    }]
  }],
  "muhely": { "slug", "kep", "cimke" }
}
```

Three things this model deliberately does *not* do: it does not duplicate any project content (it
holds a slug and a filename, and joins at build time); it does not add a stage the brief did not
ask for; and it does not let a sequence claim a station it has no photograph for.

`szakasz` and `lepte` are separate on purpose. The spine is *where in the process this is*; the
scale is *how close the camera is*. They correlate but are not the same — `A HAJÓTEST` sits at
`kez` for four plates while its scale goes object → object → detail.

**Tolerating missing stages is the point.** No sequence has all five. `A DOBOZ` has no `ter` at all,
and rather than invent one it prints: *"Ehhez a munkához nem tartozik tér… az archívumban nincs
fénykép arról, hol áll ma."*

### 4.3 Build validation — five guards, all tested

The build **hard-fails** if `keszules.json` references a project or image `projektek.json` does not
contain, or an aperture that is not four numbers (shared with `terek.json` / `flotta.json` via
`keretEllenor`). Plus three checks that only make sense here:

| Guard | Why | Verified message |
|---|---|---|
| Unknown `szakasz` / `lepte` | a typo would silently drop a plate out of the spine | `keszules/a-kapu/1: ismeretlen szakasz (muhely) — anyag \| kez \| targy \| ter \| elmeny` |
| **The spine may not run backwards** | ANYAG → … → ÉLMÉNY is the chapter's only assertion; a chain that goes back is bad data, not a missing stage | `keszules/a-hajotest/6: a gerinc visszafelé megy (anyag a(z) targy után)` |
| **At least two different `lepte`** | with one scale there is nothing to reveal — it is a photo strip, not a sequence. Better absent than weak. | `keszules/a-doboz: legalább két különböző lépték kell (most: targy)` |
| Nonexistent image | | `keszules/a-hajotest/3: nincs ilyen kép (boesch-640-de-luxe/99.jpg)` |
| `projekt` must exist | every sequence must be able to answer "what did it become" | — |

All four messages above are copied from actual failing runs.

**Absence is safe, and this was fixed properly.** Delete `data/keszules.json` and the build produces
**43 pages, no `/keszules.html`, no nav item, no footer item, no homepage button, no Fleet exit, no
sitemap entry** — and everything else is byte-identical. (The first implementation left a broken
`keszules.html` and four dead links in place; the nav/footer entries are now stripped by
`fejezetSor()` and the page is removed from `deploy/`. Verified both ways.)

---

## 5. Scale Reveal

This is the chapter's core interaction and its **entire** motion idea. No new duration, no new
curve, no new easing, no zoom, no camera.

### 5.1 The opening — three frames, one craft

```
fafaragasok/09   RÉSZLET  a carved winged head on a bare panel — you cannot place it yet
    ↓ KAPU
fafaragasok/10   TÁRGY    the same craft as a finished bed-head, in the Győr plant
    ↓ KAPU
fafaragasok/03   TÉR      a carved balustrade, installed, on a stair landing
```

One project, three frames, 1.57 MP each, no watermark, no date stamp. `--h` values 96 / 76 / 84.
Apertures authored from the actual images (`[0.38, 0.44, 0.20, 0.24]`, `[0.86, 0.28, 0.13, 0.26]`,
`[0.24, 0.62, 0.16, 0.22]`).

**Every threshold here is KAPU**, and that is the phase's whole threshold decision. The Fleet is
ABLAK five times because everything there moves; THE MAKING is KAPU three times because every frame
changes *structural layer*. One chapter, one threshold type — the same idea as Phase 4, expressed in
a JSON field rather than in code. **No fourth transition type was created.**

### 5.2 The sequences — scale is a width, not a zoom

Each plate's displayed **width** is a function of its `lepte`. The photograph does not move and is
not scaled inside its frame; the frame itself changes size, and the reader physically steps back.

| `lepte` | Desktop width | Mobile width | Max height |
|---|---|---|---|
| `reszlet` | **62 %** | 84 % | 50 svh / 36 svh |
| `targy` | **82 %** | 94 % | 56 svh / 40 svh |
| `ter` | **100 %** | 100 % | 62 svh / 44 svh |

Transitioned with `--motion-terv` (620 ms) on `--ease-water` — both existing tokens, both already
used by the plan's KAPU. Measured on the built page at 1440px, stepping through `A HAJÓTEST`:

```
01 A palánk   reszlet  533 px
02 A borda    targy    706 px
03 A szorító  targy    706 px
04 A felület  reszlet  533 px
05 A fényező  targy    706 px
06 Bent       ter      860 px
```

The scale also drives the `sizes` attribute, so a detail plate fetches the `-800` derivative and a
space plate fetches `-1400`. Verified on the wire: `garzon-plaza-hotel/16-800.avif` and
`boesch-640-de-luxe/19-1400.avif` in the same sequence.

### 5.3 Why it is not a generic zoom

The small thing and the large thing are the *same work* — that is the argument, and the page makes
it three ways: the opening's three frames are one project; each sequence's plates are one object;
and the plate's size tells you which end of the process you are looking at before you read a word.

---

## 6. Material

**No invented DUNA material palette.** `anyagok[]` per sequence, and every entry is something
visible in that sequence's own photographs, cross-checked against the company's own service list in
`rolunk.html` (*gyalulás, kontaktcsiszolás, pácolás, lakkozás*).

| Material | Where it is evidenced |
|---|---|
| mahagóni, fenyő, lakk, króm | A hajótest |
| tömörfa, pác | A kapu |
| bőr, bouclé, réz | A szék |
| tölgy, aranyozás | A doboz |

Rendered as a ruled index (`AZ ANYAG`), material on the left, the sequences it appears in on the
right. No swatches, no colour chips, no fake texture overlays, no material photography that is not
in the archive. The section's lede says where the operation names come from.

---

## 7. Hand / Process

**No craftsman was manufactured.** No invented biography, no "our master joiner", no stock hands.

What the archive gave, and what it did not:

| | |
|---|---|
| Hands visibly on the object | **`szent-laszlo-…/06` and `/08`** — two and then several people carrying and lifting the wrapped gate leaf. Used, as `A KAPU`'s two `kez` plates. |
| A person working with a tool | `boesch-580/10`. Real, and **not used** — §1.7. |
| Named people | **none in any photograph.** `ceg-adatok.json` names four; not one of them is identifiable in any frame. |
| Faces | present incidentally in the gate sequence; nobody is the subject of a portrait |

The caption on `A KAPU`'s second plate states the fact rather than dramatising it: *"Ez a fejezet
egyetlen fényképe, amelyen több kéz is a tárgyon van."*

Where the hand cannot be shown, the **state of being worked on** stands in for it — twelve clamps, a
strap, a sanded but unlacquered bow. The clamps say a person was there without a person being in
frame. That is the honest substitute, and it is the archive's own idea, not ours.

---

## 8. Object

Four objects, each followed as far as the photographs go:

| Sequence | Object | Stations present | Stations absent |
|---|---|---|---|
| **A hajótest** | one Boesch 640 hull, 19 archive frames | anyag · kéz ×3 · tárgy · tér | élmény |
| **A kapu** | one two-leaf solid-timber gate | kéz ×2 · tárgy · tér | anyag · élmény |
| **A szék** | one hotel armchair | anyag · tárgy ×2 · tér | kéz · élmény |
| **A doboz** | one solid-oak presentation box | anyag · tárgy ×2 | kéz · tér · élmény |

Every one of those "absent" cells is printed on the page, twice: as a hollow square in the
sequence's spine mark, and as a sentence in `Ami nincs meg`.

`A hajótest` is the archive's only work photographed from start to finish, and it is the reason the
chapter is possible. Frames 03 (bare ribs) and 13 (lacquered, in the spray booth) are the same hull
ten photographs apart.

---

## 9. Space

Every sequence ends in a real address. `Mi lett belőle →` links to `/referenciak/<slug>/`, which is
the project's existing URL, already in the sitemap, already indexed-when-live. **No duplicate project
presentation was built** — no making-specific project page, no second gallery, no parallel taxonomy.

Three of the four sequences reach a `ter` plate photographically as well:

- `A hajótest` → the finished interior from the stern — *"Innentől ez belsőépítészet."*
- `A kapu` → both leaves open, the courtyard beyond — the gate becomes a passage
- `A szék` → the built reception. **The chair is not in this photograph**, and the sequence says so
  in `hianyzo` rather than implying otherwise.

---

## 10. Fleet Connection

Two-way, and the Fleet page was **not duplicated or rebuilt**:

| Direction | Mechanism |
|---|---|
| Making → Fleet | `A hajótest` carries a second exit, `A flotta · HA·05 →`, beside its project link |
| Making → Fleet | the closing `KIVEZETÉSEK` block leads with the Fleet |
| Fleet → Making | a new fourth exit on `/flotta.html`: *"A hajótest sorozata →"*, deep-linking `#a-hajotest` |

The relationship is the honest one: the Fleet shows **fifteen** vessels and marks which of them the
archive holds structure for (seven); THE MAKING follows **one** of them all the way through. Breadth
there, depth here.

`FLEET → A HAJÓ → A VÁZ → A SZOBA → THE LIVING INTERIOR` closes, and so does the reverse.

---

## 11. Living Interior Connection

| Route | Binding |
|---|---|
| Homepage → Making | a new primary button at the end of the section cut: *A készülés →* (the section cut is now explicitly the trailer for the chapter) |
| Making → Plan | `Esc` anywhere, or the persistent `Alaprajz` control — the same overlay, through the same KAPU, `terv.js` unchanged |
| Making → Plan (explicit) | `Az alaprajz →` in the closing block |
| Making → Room | `A HABLEÁNY szalonja →` in the closing block |
| Making → Project | every sequence, ×4 |
| Making → Contact | `Ajánlatkérés →` |
| Every page → Making | header nav (`Készülés`) and footer page list |

Verified: `Esc` on `/keszules.html` opens the plan with 30 cells, pushes `#alaprajz`, moves focus to
the close button and marks the background `inert`; a second `Esc` closes it.

---

## 12. Rólunk Foundation

**No About page was built, and none should be built until §13's blockers are answered.** What Phase 5
establishes is the narrative structure, and it is derived from what this chapter proved works.

The founder's letter in `rolunk.html` is already the right voice. The rest of that page is
third-person corporate boilerplate that will read as filler under this art direction (Phase 0 §15,
Phase 1 §13 — unchanged).

**Proposed structure, with the evidence each beat actually has today:**

| Beat | Claim | Evidence status |
|---|---|---|
| 01 — A hang | the founder's letter, four paragraphs, signed | ✔ exists verbatim in `rolunk.html`; already quoted on the homepage |
| 02 — Az idő | founded **1991** | ✔ `ceg-adatok.json alapitas`. **No chronology, no milestones, no awards exist.** Do not invent a timeline. |
| 03 — A hely | Győr, Ikrényi út, **1200 m²** | ✔ facts in `ceg-adatok.json`. ✘ **no photograph of the site or the hall** beyond the single 2004 frame |
| 04 — A gép | gyalulás, kontaktcsiszolás, pácolás, lakkozás, felületkezelés | ✔ the company's own service list. ✘ no photograph of any machine |
| 05 — A kéz | craft | **THE MAKING is this beat.** `/keszules.html` should be linked, not summarised again |
| 06 — Az emberek | four real people, roles, direct mobiles | ✔ `ceg-adatok.json`. ✘ **no portraits** |
| 07 — A víz | boats leave from here | ✔ hands off to the Fleet |

**Claims that may be made:** 1991; one workshop in Győr; 1200 m²; 30 published projects; 371
photographs; design-through-installation in one hand; the service list; the four names and roles.

**Claims that may NOT be made without new source material:** any milestone year other than 1991, any
count of employees, any award, any client name, any "since X we have been the leading…", any square
metre other than 1200, and any number of projects other than what `projektek.json` contains.

One caution found during this phase: the homepage says *"Harminc év, egy műhely, több száz tér"* and
`rolunk.html` says *"közel három évtized"*. From 1991 that is now **35 years**. Both lines are the
client's own existing copy and were **not** changed here, but the About rewrite must resolve it
rather than inherit a number that ages.

---

## 13. Team Data

`ceg-adatok.json` holds four real people — Győrffy Péter (ügyvezető), Győrffy-Domokos Szilvia
(iroda-pénzügy), Lakasz Péter (hajóépítő üzemvezető), Dani Zoltán (üzemiroda vezető) — with roles,
direct mobiles and emails. They already close the homepage.

**Phase 5 did not integrate them further, and that was deliberate.** Everything that could be built
from names alone has been built. Lakasz Péter's role (*hajóépítő üzemvezető*) is the one direct link
between a named person and this chapter's strongest sequence, and attaching his name to
`A hajótest` was considered and rejected: nothing in the archive documents who worked on that hull,
and a plausible attribution is still an invented one.

**What a deeper team story needs, in priority order:**

1. **Four portraits**, shot in the workshop, at the bench, not against a backdrop. Landscape and
   portrait crops of each. This is worth more than any feature on the roadmap.
2. **One sentence per person, in their own words**, about what they do — not a job description.
3. **How long each has been there.** Currently unknown for all four.
4. **Which trades exist in the plant** and roughly how many people. The site cannot presently say
   whether DUNA is six people or sixty.
5. **Permission to name the people visible in the gate installation frames**, or confirmation that
   they may stay anonymous. See §22.

---

## 14. Future Workshop Shoot

The chapter is built so that a shoot is an **asset swap, not a redesign**. Concretely: every slot
below is either an existing `lepte` value on an existing plate, a new `allomasok[]` entry in
`data/keszules.json`, or a new `sorozatok[]` element. **None of them requires a code change.**

### 14.1 What a shoot would unlock, in order of value

| Shot | Unlocks | Priority |
|---|---|---|
| Workshop wide, in use | replaces the 2004 / 0.75 MP frame that currently carries §"A MŰHELY" — and lets that section stop being an apology | **1** |
| Hand + material, close | a real `kez` plate for `A szék` and `A doboz`, the two sequences that have none | **1** |
| Object in progress on the bench | the missing `kez` station generally; the archive has this only for boats | **1** |
| People working | the About page's beat 05, and the four portraits of §13 | **2** |
| Finishing department in use | the missing station between *váz* and *felület*, for the Fleet as well | **2** |
| Object in space, same object as the studio shot | the first genuine `elmeny` plate on the site — currently **0 / 4** | **2** |
| Timber store / material stock | a real `anyag` plate that is not a macro of something half-built | **3** |

---

## 15. Asset Specification

Written against **this implementation**, not against an ideal. Every number below is what the current
build and CSS actually consume.

### 15.1 Global requirements

| | |
|---|---|
| **Minimum long edge** | **2400 px** (delivers the `-1400` derivative with headroom; the current archive ceiling is 2048 px and it shows) |
| Ideal long edge | 3000–4000 px. **Do not ask for more** — the build downsamples to 1400 px and `deploy/` is already 98 MB |
| Format from the photographer | JPEG q90+ **or** 16-bit TIFF. The build produces AVIF/WebP/JPEG at 400/800/1400 itself |
| Colour | sRGB, embedded profile |
| **Watermark** | **none.** Clean masters. The `Duna HAJÓK` mark on the boat archive is the single biggest reason those frames cannot stand full-bleed |
| **Date stamp** | camera clock **off**. Burnt-in stamps are unremovable and are visible today on 3 sets |
| Retouching | dust and sensor spots only. No sky replacement, no compositing, no adding tools that were not there |
| Delivery | one folder per subject, sequential filenames, plus a plain-text list of what each frame shows |
| Rights | written confirmation of unlimited web use, and a **model release for every recognisable person** |

### 15.2 Per-shot specification

`TP` = can serve the **Threshold Pass** (needs a real opening — a doorway, a gate, a passage — with
near objects at the frame edge and depth in the middle, per Phase 2 §9).
`SC` = can serve the **Section Cut** as a plate. `FO` = usable on the homepage.

| # | Shot | Orientation | Min. long edge | Framing | Near/mid/far | TP | SC | FO |
|---|---|---|---|---|---|---|---|---|
| 1 | **Workshop wide** | landscape | 3000 px | the hall end-to-end, machines and work in progress visible, people at work if possible | **all three** — this is the one shot that must have real depth | **✔** | ✔ `ter` | ✔ |
| 2 | **Workbench** | landscape + portrait | 2400 px | one bench, one job on it, tools where they were left | near (tools) / mid (bench) / far (hall) | ✔ | ✔ `targy` | — |
| 3 | **Hand + material** | landscape | 2400 px | hands and the work, cropped at the forearm; the face need not be in frame | flat, shallow DOF | — | ✔ `reszlet` | ✔ |
| 4 | **Tool + material** | landscape | 2400 px | the plane / chisel / sander in contact with the wood | flat | — | ✔ `reszlet` | — |
| 5 | **Material closeup** | landscape | 2400 px | grain, an end grain, a glue line, a lacquer edge. Fill the frame | flat | — | ✔ `reszlet` | ✔ |
| 6 | **Joinery** | landscape | 2400 px | one joint, resolved. The thing a competitor cannot fake | flat | — | ✔ `reszlet` | — |
| 7 | **Construction detail** | either | 2400 px | clamps, a jig, a form, a frame under assembly | near/mid | — | ✔ `targy` | — |
| 8 | **Object in progress** | landscape | 2400 px | the whole piece, unfinished, on the bench or on trestles | near/mid | — | ✔ `targy` | — |
| 9 | **Finished object** | portrait **and** landscape | 3000 px | seamless or neutral ground, one piece, three angles minimum | flat | — | ✔ `targy` | ✔ |
| 10 | **Object in space** | landscape | **3000 px** | the same piece from #9, in the room it was made for, room readable | **all three** | **✔** | ✔ `ter` | ✔ |
| 11 | **People working** | landscape + portrait | 3000 px | two to four frames per person; working, not posed. Plus one deliberate portrait each | near/mid | — | ✔ `targy` | ✔ |
| 12 | **Workshop at different times** | landscape | 3000 px | shot #1's position at morning, midday and after dark, **tripod unmoved** | all three | **✔ — this is the KAPU pair** | ✔ | ✔ |

**Shot 12 is the highest-leverage item in this table and the least obvious.** Two frames from one
locked-off tripod at different times of day are what makes a day→night KAPU possible — exactly the
move HABLEÁNY makes on the homepage (Phase 3 §10), and the only one the site can currently make
anywhere. It costs the photographer one return visit and no additional setup.

### 15.3 Which slots each shot drops into

| Shot | Drops into |
|---|---|
| 1, 12 | `A MŰHELY` section; a new opening frame; the About page's beat 03 |
| 2, 3, 4 | `kez` plates for `A szék` and `A doboz` — the two sequences that lack one |
| 5, 6 | `anyag` plates; the material index could gain a frame per material |
| 7, 8 | `kez` / `targy` plates for any new sequence |
| 9, 10 | the first complete `anyag → kez → targy → ter → elmeny` chain the site has ever had |
| 11 | About beats 05–06; §13 |

### 15.4 Depth-layer requirements (shots 1, 10, 12)

The Threshold Pass needs **one-point perspective with the opening in the middle of the frame and
solid objects at the edges** (a door jamb, a post, a machine, a stack of timber). Camera at
eye height, lens 24–35 mm equivalent, **not** wide-angle distorted. The aperture is then four
numbers authored by hand — no depth map, no scan, no special capture. A frame without an opening in
it cannot be a threshold, however beautiful it is.

---

## 16. Mobile

Designed at 375 × 812 first; the desktop arrangement derives from it. Measured on the built page:
**no horizontal overflow (`scrollWidth` 375), every control ≥ 44 px.**

| | Desktop | Mobile (≤ 800 / ≤ 720 px) |
|---|---|---|
| Opening copy | left column, vertical scrim band | inside the bottom of the frame, even scrim, thumb zone |
| Frame caption | top-right | name only, eyebrow dropped |
| Sequence header | left column beside the plate | above the plate, full width |
| **Sequence lede** | shown | **shown** — see below |
| Plate scale | 62 / 82 / 100 % | 84 / 94 / 100 % |
| Plate height cap | 50 / 56 / 62 svh | 36 / 40 / 44 svh |
| Sequence footer | 3 columns | stacked |
| Spine row | 3 columns | 2 columns, ratio wraps under the name |
| Scene height | `--h` × 1 svh | `--h` × 0.82 svh |
| Scroll marker | 52 svh | 60 svh |

**One deliberate divergence from the homepage.** `fooldal.css` hides the section cut's lede on
mobile. `keszules.css` **does not** — it shrinks it instead. On the homepage that lede is one
decorative line; here it is the sentence that says what the sequence is and how complete it is, and
hiding it would remove content from small screens only.

The DETAIL → OBJECT → SPACE narrative is intact on mobile: the opening is three full frames with
horizontal swipe between them (the existing gesture, 48 px threshold, only when clearly horizontal),
and the plate widths still differ by scale. **No hover, no pointer precision, no desktop-only
parallax is required anywhere.** Vertical scroll is never intercepted.

---

## 17. Accessibility

| Requirement | Implementation |
|---|---|
| One `<h1>` | *"Anyag és tér között van egy kéz."* Everything else is `<h2>`/`<h3>`. Verified: 1 `<h1>`, 11 `<h2>`. |
| **Server-rendered first** | Verified on the built HTML: the `<h1>`, all three opening scene blocks, the first frame with a real `src`, **all 17 plates with full captions and no `hidden`**, the 5-row spine, the material index, the workshop frame, 4 exits, the complete plan (30 cells), the footer. **74 real `<a href>` elements.** |
| **No-JS** | **Fixed properly, and this is better than the homepage.** The plates' one-at-a-time behaviour is gated on `body[data-lemezek]`, which `keszules.js` sets only after it has successfully wired the sequences. Without JavaScript every plate renders as an ordinary stacked list, in order, at full size, with its caption. Nothing is hidden. |
| Real links | every sequence's outcome, every exit, every nav item is a real `<a>`. No content is reachable only by scrolling. |
| Keyboard | `↑↓←→` step the opening while the stage is in view (verified: 1 → 2 → 3 with correct captions and technical strip); `Esc` opens/closes the plan; focus returns to the trigger; the background is `inert` while open. |
| Announcements | `aria-live="polite"` announces sequence + step + scale on every plate change — *"A hajótest — 03 A szorító Tárgy"* — and only while that sequence is actually in the viewport, so four sequences cannot talk over each other. Spatial state is never narrated. |
| **Missing stages, spoken** | the spine squares are `aria-hidden` decoration **plus** a visually-hidden sentence per sequence: *"Ebben a sorozatban megvan: anyag, kéz, tárgy, tér. Nincs fénykép erről: élmény."* |
| Images | depth layers are `alt=""` + `aria-hidden`; every plate image carries a written `alt` from `projektek.json` (§19). |
| Contrast | type over photography always has a scrim **and** a text shadow. The opening's scrim was re-measured against its own frames — all three are pale (raw oak, white-painted carving, industrial windows) — and uses the Fleet's steeper ramp rather than the homepage's. |
| Touch targets | **≥ 44 px, and this was broken before this phase.** See §21. |
| Reduced motion | §18. |

---

## 18. Reduced Motion

Verified by forcing the `prefers-reduced-motion` block onto the built page and stepping the whole of
`A HAJÓTEST`:

| | Behaviour |
|---|---|
| `Kuszob.lassit` | `true` — the opening's KAPU short-circuits to a 200 ms fade before any mask or transform |
| Plate change | 200 ms opacity, `transform: none` |
| **Plate scale** | **kept.** Measured 568 / 751 / 915 px across the six plates — the full 62 / 82 / 100 % range |
| Plate width transition | `none` — the size changes, it does not glide |
| Scene copy | still cross-fades (opacity only), no movement |
| Scene heights | shortened (`--h` × 0.8) |
| Everything else | unchanged: all 3 frames, all 17 plates, the spine, the material index, the workshop frame, the plan, the exits |

**The scale narrative is information, so it stays. Only the movement goes.** All six plates advanced
with correct captions and no console errors.

---

## 19. Performance

Measured on the built artifact. Text is gzip −9 (Cloudflare Pages compresses; the local preview does
not, so these are computed); images are bytes on disk.

### 19.1 `/keszules.html`, first load

| | Desktop 1440 | Mobile 390 |
|---|---|---|
| HTML | 13.1 KB | 13.1 KB |
| CSS (6 files) | 30.1 KB | 30.1 KB |
| JS (6 files) | 24.6 KB | 24.6 KB |
| Fonts (10 slices) | 125.8 KB | 125.8 KB |
| Brand images | 21.3 KB | 21.3 KB |
| LCP frame (AVIF) | 97.2 KB | 43.0 KB |
| **Total** | **312.2 KB** | **257.9 KB** |
| **Budget** | ≤ 350 KB ✅ | ≤ 300 KB ✅ |
| Requests | 26 | 26 |

**Both budgets met.** Only one photograph loads before first paint; the other two opening frames and
all 17 plates are lazy. Scrolling the entire page costs a further **884 KB** on desktop / **697 KB**
on mobile — high, and honestly so: this page is 21 photographs. The per-scale `sizes` is what keeps
it from being worse (detail plates fetch `-800`, not `-1400`).

### 19.2 The Fleet's desktop budget — Phase 4 limitation #1, partly closed

Phase 4 §20 build item 2 was the per-image quality override. Implemented as `KEPMINOSEG` in
`build.mjs`: a per-file quality map that is **part of the derivative cache key**, so exactly one
image re-encodes and no other measurement moves.

`duna-cruises-hableany/01` AVIF q46 → **q36**:

| | Before | After |
|---|---|---|
| LCP frame, 1400 | 267.9 KB | **196.6 KB** (−27 %) |
| LCP frame, 800 | 98.0 KB | **70.2 KB** |
| `/flotta.html` desktop total | 478.9 KB | **409.2 KB** |
| `/flotta.html` mobile total | 295.4 KB | **282.8 KB** |
| Budget | ≤ 350 KB ❌ (+129) | ≤ 350 KB ❌ (**+59**) |

q32, q36, q40 and q46 were rendered and compared at 1:1 on the deck-and-water crop — the hardest
part of the frame. q40 and q46 are indistinguishable; **q36 shows no artefact**; q32 visibly smooths
the water and dulls the brass. q36 was chosen. Going further would not reach the budget anyway
(q32 lands at 377 KB), so the remaining 59 KB is a photography problem, not an encoder setting. See
§21.

### 19.3 Build

| | |
|---|---|
| Cold build (cache deleted) | **2m22s** (44 pages, 371 images, 830 JPEG + 528 AVIF/WebP) |
| Warm build | **9.7 s** |
| `deploy/` | 98 MB (94 MB in Phase 4) |

### 19.4 New files

| File | Raw | gzip |
|---|---|---|
| `keszules.html` (source) | 11.6 KB | 4.0 KB |
| `keszules.css` | 19.5 KB | 5.9 KB |
| `keszules.js` | 6.6 KB | 2.5 KB |
| `data/keszules.json` | 10.0 KB | 3.4 KB |
| `deploy/keszules.html` (generated) | 94.4 KB | 13.1 KB |

The generated page is 94.4 KB raw because the full plan overlay is inlined, exactly as in every
room. It compresses to 13.1 KB.

---

## 20. SEO

| | |
|---|---|
| Route | `/keszules.html` — crawlable, in the sitemap (**42 URLs**, was 41) |
| `<title>` | `A készülés — Duna Belsőépítészet Kft.` |
| `<meta name="description">` | written, names the four stations and the evidence rule |
| Canonical | `https://{{domain}}/keszules.html`, substituted from `ceg-adatok.json` |
| Semantics | one `<h1>`, `<section aria-labelledby>`, `<nav aria-label>`, `<ol>`/`<ul>` of real elements, `<figure>`/`<figcaption>` per plate |
| Internal links in | header nav, footer, the homepage's section cut, the Fleet's exits |
| Internal links out | 4 project URLs + `/flotta.html` + `/alaprajz.html` + a room + `/kapcsolat.html` |
| Existing URLs | **unchanged.** All 30 `/referenciak/<slug>/` verified present and rendering. |

**`sajatDomainEl` is still `false`**, deliberately untouched, so the build emits site-wide
`X-Robots-Tag: noindex, nofollow` plus the permanent `/lab/*` rule. **The Making, like every other
route, is `noindex` until the flag is flipped at go-live.** This is the fifth phase carrying it.

**Navigation change:** `Készülés` was **added** as an eighth item, between `Flotta` and
`Design manufaktúra`, and added to the footer page list. Nothing was removed. Eight items is the
practical ceiling for this header — see §21.

---

## 21. Validation

### The Making

| Check | Result |
|---|---|
| Route builds and serves | ✓ 44 pages (was 43) |
| Three opening frames advance | ✓ 1 → 2 → 3, correct captions, counter `01/03`…`03/03`, technical strip follows |
| Every opening threshold is KAPU | ✓ from data; `data-kuszob="kapu"` on all three |
| Four sequences step on scroll | ✓ all 17 plates, counters, and live announcements |
| **Scale reveal measurable** | ✓ 533 / 706 / 860 px by `lepte`, and `sizes` fetches `-800` vs `-1400` accordingly |
| Missing stages do not break layout | ✓ `A doboz` (3 plates, no `ter`) and `A kapu` (no `anyag`) both render and both state the gap |
| Project links work | ✓ all 4 resolve to existing `/referenciak/<slug>/` |
| Fleet links work | ✓ both directions, `#a-hajotest` deep link lands |
| Plan works | ✓ `Esc` opens 30 cells, pushes `#alaprajz`, focuses close, `inert` background; second `Esc` closes |
| Mobile 375 × 812 | ✓ no horizontal overflow, all targets ≥ 44 px |
| Keyboard | ✓ arrows step the opening, `Esc` opens/closes the plan |
| Reduced motion | ✓ scale preserved, motion removed, all plates reachable |
| **No-JS** | ✓ 17 plates, 74 links, 30 plan cells, full captions, nothing `hidden` |
| Console | ✓ no errors, no warnings |
| **No fake content** | ✓ every image joins to a `projektek.json` entry; no render, no stock, no generated image, no invented person, date or claim |

### Existing world

| Check | Result |
|---|---|
| Homepage | ✓ 13 frames present; section cut steps 01 → 07 with correct labels including `· látványterv` |
| **Section cut unchanged by the refactor** | ✓ 7 plates, no new attributes, identical `sizes`, 7 project links |
| Plan | ✓ 30 cells, filter, overlay |
| Fleet | ✓ 15 rows, filter, now 4 exits |
| HABLEÁNY room | ✓ renders, plan overlay present |
| All 30 project URLs | ✓ present, none short, none broken |
| Network | ✓ every asset 200; no 404 on any route |
| **Admin** | ✓ `admin.js` / `admin.html` / `admin.css` **byte-identical** (`git diff` empty) |
| `projektek.json` | ✓ **only `alt` values changed** — verified: every changed line is an `"alt"` line |
| Build guards | ✓ all five stop the build with exact messages |
| Absence of `keszules.json` | ✓ 43 pages, no route, no nav item, no footer item, no homepage button, no Fleet exit, no sitemap entry, no dead links |

### Files not modified in this phase

`admin.js` · `admin.html` · `admin.css` · `kuszob.js` · `ter.js` · `terv.js` · `fooldal.js` ·
`ter.css` · `terv.css` · `rendszer.css` · `style.css` · `script.js` · `fonts.css` · `consent.js` ·
`szuro.js` · `galeria.js` · `urlap.js` · `data/terek.json` · `data/ceg-adatok.json` ·
`data/flotta.json` · `data/palyazatok.json` · `partials/projekt-sablon.html` ·
`partials/ter-sablon.html` · the Worker · the form · the fonts.

No source image was resized, recompressed, renamed or deleted.

### Technical cleanup carried out (three items, all verified before fixing)

1. **The Fleet's desktop budget** — §19.2. −69.7 KB.
2. **Content flush to the viewport edge below 1360 px.** `.belul` is only
   `max-width: 1360px; margin: 0 auto` — it has no side padding, and every other section supplies the
   gutter from its own `padding`. `/flotta.html`'s two sections did not. At 1440 px `margin: auto`
   accidentally hides this (1440 − 1360 = 2 × 40 px); at **1360 px and below the type touches the
   screen edge**, which is most laptops and every tablet and phone. Measured `left: 0` at 375 px,
   confirmed on the Fleet. Fixed in `flotta.css` and avoided in `keszules.css`; re-measured 20 px at
   375 px, 66 px at 1440 px.
3. **`.link-nyil` touch targets were 27 px.** Phase 4 §13 corrected the `ter.css` spatial controls to
   44 px but this link form was missed, and it is what every exit on both chapter pages uses. Fixed
   in `flotta.css` and `keszules.css` under `≤ 720px`. Re-measured: **zero targets under 44 px on
   either page.**

Nothing else was refactored.

---

## 22. Known Limitations

1. **`/flotta.html` desktop is still 409 KB against a 350 KB budget**, and 197 KB of it is one
   photograph. The encoder has no honest lever left (§19.2). The fix is a replacement frame — one
   good photograph of the HABLEÁNY under way, at 3000 px, without a watermark.
2. **The archive has exactly one photograph of the workshop**, 0.75 MP, from 2004, with a burnt-in
   date stamp. The page states this rather than working around it, but it is the single biggest gap
   on the site and §14–15 exist to close it.
3. **ÉLMÉNY is 0 / 4.** No sequence reaches the final station, because no object in the archive was
   photographed in use in the space it was made for. The page prints the ratio.
4. **`A szék` has no `kez` plate and `A kapu` has no `anyag` plate.** Both are stated in `hianyzo`.
   One workshop shoot closes both.
5. **The likeness question in the gate sequence.** `szent-laszlo-…/06` and `/08` show recognisable
   people at work. They are DUNA's own archive photographs of DUNA's own installation, they are used
   as documentation of work rather than as portraits, and no one is named. **The owner should
   confirm this is acceptable**, and any future shoot must come with model releases (§15.1).
6. **`vatikani-diszdoboz/01–02` were excluded on editorial grounds** (§1.6) and that is a judgement
   call the owner may reverse. It costs two `allomasok[]` entries and no code.
7. **The boat making evidence is 0.31–0.85 MP.** `A hajótest`'s first plate is a 640 × 480
   photograph. Shown at 62 % width it is not upscaled and does not look broken, but it cannot ever
   be larger. Six good photographs of one hull under construction would transform this sequence.
8. **`keszules.css` duplicates ~40 lines of scene typography** from `fooldal.css` and `flotta.css`.
   Deliberate, for the reason Phase 4 gave (the three files are never loaded together, so a homepage
   redesign cannot break a chapter) — but it is now duplicated **three** times, not two, and that is
   the point at which it should be extracted. Recommended for Phase 6.
9. **The homepage and the Fleet still fall back to one frame without JavaScript.** THE MAKING no
   longer does (§17), and the same `data-lemezek` technique would fix the homepage's section cut in
   a few lines. Not done here, because it means touching `fooldal.js` and `fooldal.css` for a
   benefit outside this phase's scope.
10. **The header nav is now eight items.** It still fits, but the next chapter cannot simply be
    added. `Design manufaktúra` is the obvious candidate to fold into `Készülés` — its page leans on
    the superlatives Phase 0 flagged, and this chapter shows the work instead. **That is a client
    decision and was not taken here.**
11. **Six frames appear both in the homepage's section cut and in this chapter** (`fafaragasok/09`,
    `garzon-plaza-hotel/14, 15, 02`, and two more at different crops of the same subjects). This is
    trailer-and-feature, the same relationship Phase 4 established between homepage scene 13 and
    Fleet frame 1 — but it is repetition, and a shoot would remove the need for it.
12. **`leiras` is empty for all 30 projects.** Unchanged since Phase 0, still the single biggest risk
    to the submission, and no amount of engineering touches it.
13. **104 alt texts are still archive labels** — 130 at the end of Phase 4, 26 written here for the
    four projects this chapter uses. The remainder are the non-making projects.
14. **`index.html`, `alaprajz.html` and the 30 project pages have no `<link rel="canonical">`.** Only
    `flotta.html` and `keszules.html` do. Pre-existing, harmless while the site is `noindex`, and a
    release blocker for go-live.
15. **The "harminc év" / "közel három évtized" copy is now 35 years old.** Both lines are the
    client's existing text and were not changed (§12).
16. **`sajatDomainEl` is still `false`** — the whole site is `noindex` until go-live. Fifth phase
    carrying this.
17. **The full font set is 125.8 KB and every route requests all of it** — unchanged from Phase 3
    limitation #3, and unchanged in cause.

---

## 23. Phase 6 Requirements

### Blocking questions, in order

1. **Can the workshop be photographed?** Now the top question by a wide margin, and §14–15 turn it
   into a shoot brief that can be handed to a photographer as-is. Every other content gap on the
   site is downstream of it. *Fourth phase asking.*
2. **Hotel Domus Collis image rights.** Still blocking the homepage and a room. *Fourth phase asking.*
3. **Will copy be commissioned?** Thirty empty `leiras`. The Fleet and now THE MAKING both
   demonstrate that structure can carry a chapter without prose; they cannot carry the whole site.
4. **May the people in the gate installation frames be shown?** New, and answerable in a sentence
   (§22.5).
5. **Should `vatikani-diszdoboz/01–02` be used?** New, editorial (§1.6).
6. **Can the boats be re-photographed?** Would close the Fleet's remaining 59 KB and let seven
   restoration sets stand at full size.
7. **English version?** A routing decision that must precede the work. *Fifth phase asking.*

### Build, in this order

1. **Nothing new until question 1 is answered.** THE MAKING is complete for the material that
   exists; adding a fifth sequence from the same archive would repeat the Fleet.
2. **The remaining 104 alt texts.** Order and rule as Phase 4 §20 gave them.
3. **The About rewrite** toward the founder's-letter register, on the structure in §12 — but only
   beats 01, 02, 06 and 07 can be written today. Beats 03–05 need the shoot.
4. **Extract the shared scene typography** out of `fooldal.css` / `flotta.css` / `keszules.css`
   (§22.8). It is now duplicated three times.
5. **Apply the `data-lemezek` no-JS pattern to the homepage's section cut** (§22.9).
6. **Canonical tags on every route** (§22.14) — a release blocker.
7. **A fourth room**, if new photography arrives — a `terek.json` entry and nothing else.
8. **The depth-map pipeline**, if camera masters exist.

### Carried forward as hard rules

- `data/projektek.json` stays the client's surface; `admin.js` / `admin.html` / `admin.css` remain
  byte-identical to what the client uses today.
- Server-rendered HTML first, spatial layer second, on every route.
- One transition, three types. A second transition type must displace something. **One chapter, one
  threshold type** — ABLAK for the Fleet, KAPU for the Making.
- Reduced motion, keyboard and no-JS are release blockers.
- **Nothing is asserted that the archive cannot show**, and where a stage is missing the page says
  so out loud rather than filling it.
- No renders on the making page.
- **`sajatDomainEl` must be flipped at go-live.**

---

## Appendix — Changes made during Phase 5

**Created (5):**
`keszules.html` · `keszules.css` · `keszules.js` · `data/keszules.json` · `docs/PHASE-5-MAKING.md`

**Modified (6):**
`build.mjs` (making validation §2/c, making priority images, the `KEPMINOSEG` per-image quality map,
the shared `lemezHtml()` plate generator, the making generators §5/c, `fejezetSor()` for conditional
nav/footer entries, the conditional homepage button and Fleet exit, sitemap, assets, stamping) ·
`index.html` (the section cut now leads to the chapter) ·
`flotta.html` (a fourth exit, into `A hajótest`) ·
`flotta.css` (**two verified fixes only** — the `.belul` gutter and 44 px touch targets, §21) ·
`fooldal.css` (**one rule** — `.metszet-tovabb`, so the section cut's two buttons wrap) ·
`partials/fejlec.html` + `partials/lablec.html` (`Készülés` added) ·
`data/projektek.json` (**26 `alt` values only** — a field the admin preserves)

**Not modified:** `kuszob.js`, `ter.js`, `terv.js`, `fooldal.js`, `ter.css`, `terv.css`,
`rendszer.css`, `style.css`, `script.js`, `fonts.css`, `consent.js`, `szuro.js`, `galeria.js`,
`urlap.js`, `admin.*`, `data/terek.json`, `data/ceg-adatok.json`, `data/flotta.json`,
`data/palyazatok.json`, `partials/projekt-sablon.html`, `partials/ter-sablon.html`, the Worker,
the form, the fonts.

**Assets:** no source image was resized, recompressed, renamed or deleted. One image (`duna-cruises-hableany/01`)
has a new AVIF derivative at q36; all other derivatives are byte-identical.

**Dependencies:** none added.

**Routes:** `+/keszules.html`. All 30 project URLs unchanged. Sitemap 41 → 42.
