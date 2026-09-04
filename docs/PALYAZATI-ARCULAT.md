# Pályázati nyilvánosság — hol kell az infoblokknak lennie

## A szabály

Forrás: **Széchenyi 2020 Kedvezményezettek Tájékoztatási Kötelezettségei
útmutató és arculati kézikönyv („KTK 2020”)**, 3.2.3. pont, 14. oldal.
A lap képe: [`szabaly/ktk2020-utmutato-14-oldal-honlap-szabaly.png`](szabaly/ktk2020-utmutato-14-oldal-honlap-szabaly.png).

> **FONTOS:** Az ún. infoblokknak mindig kiemelt helyen kell szerepelnie a
> honlapon, azaz a láthatósági területen kell lennie, megnyitáskor,
> görgetést nem igénylő pozícióban.

Ugyanez az arculati kézikönyv **8.5. WEB** fejezetében (104. oldal), a
méretmegkötéssel együtt:

> Az infóblokkot a honlapokra minden esetben színes változatban kell
> kihelyezni, továbbá a digitális eszköz megjelenítő felületén anélkül is
> látszania kell, hogy a használónak le kellene görgetnie az oldalt.
> (min. 150 px)

Ugyanez a pont írja elő azt is, hogy

- a főoldalról **jól látható helyen** legyen elérhető a fejlesztéseket
  bemutató aloldal, és
- az aloldalon szerepeljen a kedvezményezett neve, a projekt címe, a
  szerződött támogatás összege, a támogatás mértéke (%), a projekt
  tartalmának bemutatása, a tervezett befejezési dátum és a projekt
  azonosító száma.

Dokumentum: <https://www.palyazat.gov.hu/doc/25> (arculati kisokos),
letöltött példány:
<https://pak.elte.hu/media/18/7f/996b9a6daab7d6903886c408510738dd404e23daa7e5b729950ced0ec96e/Szechenyi%202020%20utmutato%20arculati%20kezikonyv.pdf>

## Amit ez az oldalon jelent

**A lábléc önmagában nem elég** — oda görgetni kell. Ezért az infoblokk két
helyen van:

| Hol | Mi | Fájl |
|-----|----|------|
| A lap tetején, a fejléc alatt, jobbra — minden lapon | `a.eu-jelzo`, 164 px (kis kijelzőn 150 px), színes, a Pályázatok lapra mutat | [`partials/fejlec.html`](../partials/fejlec.html), [`style.css`](../style.css) `.eu-jelzo` |
| A lábléc tájékoztató sávjában | `.eu-blokk` + a nyertes pályázatok listája | [`partials/lablec.html`](../partials/lablec.html) |

A fenti példány `absolute`, nem `fixed`: a szabály a *megnyitáskor* látható
területre szól, nem arra, hogy a blokk végigkísérje a görgetést — így
megnyitáskor ott van, utána nem takar semmit.

Az adattartalom a [`data/palyazatok.json`](../data/palyazatok.json)-ban él,
és a [`palyazatok.html`](../palyazatok.html) lapra kerül ki.
