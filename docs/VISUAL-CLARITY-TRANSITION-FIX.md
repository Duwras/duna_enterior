# VIZUÁLIS ÉLESSÉG ÉS ÁTMENET-MEGBÍZHATÓSÁG

Két gyártási hiba javítása. Nem újratervezés, nem új fázis: a meglévő
DUNA-rendszer koncepciója, tipográfiája, elrendezése, képanyaga, a
Küszöb fizikája (900 / 480 ms), a három küszöbfajta és a navigációs
modell változatlan.

Minden szám ebben a dokumentumban **mért**, nem becsült. Ahol nem
mértünk, ott az is ki van írva.

---

## 1. A LÁGYSÁG OKA

### 1/a. A fő ok: a származéklétra 1400 px-en végződött

A színpad teljes képmezős felület (`100vw × 100svh`, `object-fit:
cover`), a származéklétra viszont `400 / 800 / 1400` volt. A böngésző
tehát jól választott — csak nem volt miből.

Mérve, `/` (főoldal), 1440 × 900, `devicePixelRatio 1.25`:

| réteg  | megjelenési szélesség | készülék-képpont | legnagyobb jelölt | felnagyítás |
|--------|----------------------|------------------|-------------------|-------------|
| távoli | 1425 CSS px          | 1781 px          | 1400 px           | **1,27 ×**  |
| közép  | 1460 CSS px          | 1826 px          | 1400 px           | **1,30 ×**  |
| közeli | 1503 CSS px          | 1879 px          | 1400 px           | **1,34 ×**  |

Ugyanez `devicePixelRatio 2`-n, 1440-es képmezőn: a szükséglet 2872 px,
a jelölt 1400 px — **2,05-szörös felnagyítás minden fényképen**.

Ez pontosan az a tünet, amit a hibajelentés leír: az élek nem elég
élesek, a faerezet mikroszerkezete elvész, a hatás az EGÉSZ kompozíción
látszik (nem csak a szöveg mögött), miközben a tipográfia éles marad —
a betűt ugyanis a böngésző a valódi felbontáson rajzolja, a fényképet
nem.

A rétegek eltérő felnagyítása azt is megmagyarázza, miért a képmező
SZÉLE tűnik a legpuhábbnak: a közeli réteg alapnagyítása 1,055, tehát
az kapja a legnagyobb felnagyítást — és éppen az a réteg maszkolódik a
kép peremére.

### 1/b. A srcset `w` leírója nem a valódi szélességet mondta

A leíró a fok NEVÉBŐL jött (`-1400.jpg 1400w`), nem a fájlból. A
származékok `withoutEnlargement: true`-val készülnek, tehát egy 1200 px
széles mesterből a „-1400” fok is 1200 px marad. Ilyenkor a böngésző
nem létező felbontásra tervezett, és két azonos méretű fok közül a
nagyobbnak hazudottat töltötte le.

Példa a mai anyagból: `arcangeli-super-jolly/01.jpg` mestere 600 × 800.
A `-800` és a `-1400` származék bájtra ugyanaz a 600 px-es kép, a
jelölés mégis két külön jelöltnek mondta, 800w és 1400w leíróval.

### 1/c. A `sizes` mindhárom rétegre `100vw` volt

A rétegek nem egyforma szélesek: a ter.css alapnagyítása miatt
1425 / 1460 / 1503 CSS px-en állnak (mérve, 1440-es képmezőn). A
böngésző a transformot nem számolja bele a `sizes`-ba, tehát a közeli
réteget tudatosan 5,5%-kal alulméreteztük.

### 1/d. Állandó `will-change: transform` a rétegeken és a nyíláson

`.ter-reteg` és `.nyilas` állandóan `will-change: transform`-ot vitt. A
böngésző ilyenkor a réteget saját kompozit síkra teszi, és a raszterét
EGY léptéken tartja, mert azt feltételezi, hogy a transform mindjárt
változni fog. A rétegek viszont NYUGALOMBAN is nagyításban állnak
(1,008 / 1,025 / 1,055) — a rögzített raszter tehát fölnagyítva kerül a
képernyőre, és ott a legerősebben, ahol a nagyítás a legnagyobb.

### 1/e. Amit MEGVIZSGÁLTUNK, és NEM ez volt az ok

A teljes kódbázist végigkerestük a következőkre: `filter`, `blur(`,
`backdrop-filter`, `-webkit-backdrop-filter`, `opacity`,
`mix-blend-mode`, `mask`, `mask-image`, `clip-path`, `will-change`,
`transform`, `scale`, `scale3d`, `perspective`, `contain`, `isolation`,
`background-blend-mode`, valamint a `fátyol` / `veil` / `haze` / `soft`
/ `blur` szavakra.

Fénykép fölött **egyetlen elmosás sincs**. Amit találtunk:

| hely | mi | ítélet |
|------|-----|--------|
| `style.css` `.fejlec` | `backdrop-filter: blur(10px)` | csak a fejlécsáv; a sötét regiszterben a `ter.css` amúgy is `none`-ra állítja. Nem érinti a színpadot. **Marad.** |
| `fooldal.css` `.ajto-kep img` | `brightness(.62) saturate(.86)` | szándékos halkítás EGYETLEN képen (az utolsó ajtó), hogy a szedés megálljon rajta. Nem globális. **Marad.** |
| `flotta.css` | `saturate(.92)` | egy borítósor. **Marad.** |
| `ter.css` `.ter-jelzo button::before` | `drop-shadow` | 1 px-es hajszálvonalon, nem képen. **Marad.** |
| `style.css` `.tamogatas img` | `grayscale(.25)` | logósor. **Marad.** |
| `.szinpad::after`, `.aktus .szinpad::before` | színátmenetes fátyol | csak SÖTÉTÍT, nem mos. A kép közepe és jobb oldala érintetlen. **Marad.** |

A fátyol tehát a helyén marad: a szöveg olvashatósága továbbra sem
múlik azon, mi van épp a képen.

### 1/f. A kódoló mérve: másodlagos ok

Nagyfrekvenciás energia (Laplace-szűrő szórásnégyzete, azonos 1400 px-es
rácson), a mesterhez viszonyítva:

| kép | mester | JPEG q78 | WebP q72 | AVIF q46 (1400) | AVIF q46 (1800) |
|-----|--------|----------|----------|------------------|------------------|
| `hotel-domus-collis/04` | 149,7 | 130,7 (87%) | 136,9 (91%) | 119,1 (**80%**) | 125,6 (84%) |
| `duna-cruises-hableany/05` | 1921,9 | 1729,6 (90%) | — | 1795,5 (93%) | 1850,2 (96%) |
| `bodajki-vadaszkastely/02` | 456,8 | 343,1 (75%) | — | 359,7 (**79%**) | 402,2 (88%) |

Az AVIF a leggyengébb a három közül, és éppen azt kapja a modern
böngésző. **A minőséget mégsem emeltük** — mert megmértük, mibe kerülne:

| kép | q46→q54 | q46→q58 | nyereség |
|-----|---------|---------|----------|
| `domus-collis/04` @1800 | +10,3 KB | +18,3 KB | +6 … +10 százalékpont |
| `hableany/05` @1800 | +58,2 KB | +95,2 KB | +2 … +3 százalékpont |
| `bodajki/02` @1800 | +43,1 KB | +73,1 KB | +6 … +10 százalékpont |

A puszta felbontásemelés ugyanezt vagy többet adott **+2,7 KB**-ért az
LCP-képkockán. A mért bizonyíték tehát azt mondja: a kódoló nem a fő
ok, és a globális minőségemelés rossz üzlet. A `KEPMINOSEG` névre szóló
kivételtára változatlan.

---

## 2. AZ ÁTMENET HIBÁJÁNAK OKA

### 2/a. Nem volt készenléti kapu

A `ter.js` `menj()` abban a pillanatban indította a küszöböt, amikor
ráírta a `src`-et a következő képkockára:

```js
kepekBe(cel);                       // src beírása — a letöltés MOST kezdődik
szinpad.setAttribute('data-atmenet', '');
window.Kuszob.at({ … });            // a mozdulat AZONNAL indul
```

A `kuszob.js` időzítése ehhez képest:

- a belépő tér fedettsége a 16–34% között kapcsol be → **144–306 ms**
- a kilépő burok fedettsége a 74–94% között fogy el → **666–846 ms**

Egy hideg kép lassú hálózaton ennyi idő alatt nincs kint. Ilyenkor a
nyílásban nem a következő tér jelent meg, hanem a `.ter` alapszíne
(`--ejjel`), a 846. ms után pedig az egész képmezőn.

### 2/b. A rejtett burok képei el sem indultak

A nem első képkockák jelölése `loading="lazy"` + `data-src`, a burkuk
pedig `hidden` (`display: none`). A `kepekBe()` beírta a `src`-et — de
egy `display: none` elemen a böngésző a lusta képet nem tölti le, és a
`<picture>` forrásválasztás sem fut le, mert nincs elrendezés. A
„szomszédság előtöltése” tehát a gyakorlatban nem töltött elő semmit.

### 2/c. A feltáró maszk SOHA nem tudja befedni a képmezőt

Ez volt a súlyosabb hiba, és ez tisztán geometria.

A maszk a BELÉPŐ burkon (`.nyilas`) ül, és a burok a saját
DOBOZKÖZEPE körül nagyítódik. Ha a nyílás nem a képmező közepén van,
az ellipszis középpontja a nagyítással kifelé sodródik — gyorsabban,
mint ahogy a sugara nő.

Mérve a főoldal első küszöbén (nyílás 66% / 46%, sugarak 20% / 32%),
t = 820 ms-nál befagyasztott animáción, 1440 × 900-as képmezőn:

```
a burok transformja      scale(3,416)
az ellipszis középpontja x ≈ 1492 px   (a képmezőn KÍVÜL, jobbra)
átlátszatlan sugár       ≈ 760 px      (a 78%-os megállónál)
→ a képmező bal oldali ~35%-a a maszkon kívül esik
```

**Bizonyítva képernyőfelvétellel**: a kilépő képkockát elrejtve a bal
harmad tiszta fekete volt. A valós lejátszásban ez azért nem volt
folyton nyilvánvaló, mert a kilépő kép ott halványodott alatta
(t = 820 ms-nál 0,144 fedettségen) — a 846. ms után viszont az is
elfogyott, majd a `takarit()` egyetlen képkockán levette a maszkot, és
a fekete ék eltűnt. Ez a villanás.

Ráhangolással nem javítható. A sarok tagja a nagyításban:

```
lim (s→∞)  ((0,5 + 0,16·s) / (0,156·s))²  =  (0,16 / 0,156)²  =  1,052  >  1
```

Vagyis akármekkora nagyításnál a bal alsó sarok kívül marad. A
fedéshez az AJTÓ-nál 4,75-szörös nagyítás kellene; a fizika 3,42-t ad.

### 2/d. Visszafelé ugyanez, csak rögtön az elején

A visszajátszás első képkockáján a kilépő burok fedettsége még 0
(a `1 - sav(x, 0.74, 0.94)` görbe x = 1-nél nulla), a belépő pedig
maszkolt. Vagyis a visszalépés AZONNAL a fekete ékkel nyitott.

### 2/e. Lapok között: 240 ms üresség, szerkezetből

```css
html.atmenet body          { opacity: 0 }
html.atmenet.betoltve body { opacity: 1; transition: .42s }
html.atmenet.tavozik body  { opacity: 0; transition: .24s }
```

A `script.js` kattintásra feltette a `tavozik` osztályt, 230 ms múlva
navigált. A menet tehát: TÉR A → **240 ms csupasz lapszín** →
navigáció → TÉR B nulláról jön fel 420 ms alatt. Ez nem hiba volt a
kódban — pontosan ezt csinálta, amit leírtak róla. Csak épp ez az,
amit a küszöb koncepciója tagad.

### 2/f. A távoli rétegnek nem volt fedési tartaléka

`--reteg-tav-nagy: 1.00`, miközben a képe `±0.25%`-ot mozdul a mutató
után. Egy 1440 px-es képmezőn ez **3,6 px csupasz `--ejjel` csík** a
kép szélén, minden egérmozdulatnál. (A közép és a közeli fedett volt:
1,025 a 2 × 0,75% mellett, illetve 1,055 a 2 × 1,70% mellett.)

---

## 3. MEGVÁLTOZOTT FÁJLOK

| fájl | mi változott |
|------|--------------|
| `build.mjs` | `-1800` fok a teljes képmezős szerepeknek; valódi `w` leírók; rétegenkénti `sizes`; az utolsó ajtó `sizes`-a; a `NYERS` őr ismeri az új fokot |
| `kuszob.js` | képkészenlét (`keszit`, `melegit`); készenléti kapu az `at()`-ban és a `feltarul()`-ban; alaplap; `will-change` csak a mozdulat idejére |
| `ter.js` | jegy alapú versenyvédelem; sikertelen menet nem véglegesít; `elorelat()` tétlen időben; mély hivatkozásnál előbb `kepekBe` |
| `ter.css` | állandó `will-change` levéve; `.nyilas[data-alap]` |
| `rendszer.css` | `--reteg-tav-nagy: 1.00 → 1.008` |
| `style.css` | az oldal-áttűnés három szabálya kivezetve (és a hozzá tartozó `prefers-reduced-motion` mentesítés) |
| `script.js` | a lapáttűnés helyett szándékra induló `prefetch` |
| `fooldal.js`, `keszules.js` | a lemezléptetés megvárja a lemez képét (jegy alapú) |

Nem változott: `admin.js`, `admin.html`, `admin.css` (a forrásfájlok
érintetlenek — `git status` szerint sem módosultak), a tartalom, a
képanyag, az adatmodell, a projekt-URL-ek, a küszöb fizikája és
időzítése, a mélységmodell, a három küszöbfajta, a tipográfia, a
paletta, a nappal/éjjel regiszter, a főoldal koreográfiája, a Flotta,
a KÉSZÜLÉS és az alaprajz koncepciója.

Nincs új függőség. Nincs WebGL, GSAP, Three.js. Nincs új stíluslap és
nincs új szkriptfájl.

---

## 4. MEGVÁLTOZOTT SZELEKTOROK ÉS FÜGGVÉNYEK

**CSS**

- `.ter-reteg` — `will-change: transform` **törölve**
- `.nyilas` — `will-change: transform` **törölve**
- `.nyilas[data-alap]` — **új**: `z-index: 0`, maszk nélkül, transform
  nélkül, `pointer-events: none`
- `:root --reteg-tav-nagy` — `1.00 → 1.008`
- `html.atmenet body`, `html.atmenet.betoltve body`,
  `html.atmenet.tavozik body` — **törölve**
- a `@media (prefers-reduced-motion: reduce)` blokk `html.atmenet`
  mentesítése — **törölve** (tárgytalan)

**JavaScript**

- `kuszob.js`: `egyKep()`, `dekodol()`, `festhet()`, `keszit()`,
  `melegit()`, `alaplap()`, `alaplapEl()`, `jelez()` — **új**
- `kuszob.js`: `at()` kettévált — a kapu az `at()`-ban, a mozdulat az
  `atMost()`-ban; `feltarul()` / `feltarulMost()` ugyanígy
- `kuszob.js`: `at()` és `egyszeru()` mostantól `true` / `false`-t ad
  vissza (véglegesített-e)
- `kuszob.js`: `takarit()` a `will-change`-t és a `visibility`-t is
  takarítja
- `ter.js`: `menj()` — jegy, elavult menet eldobása, sikertelen menet
  kezelése; `elorelat()` — **új**
- `fooldal.js`, `keszules.js`: `allit()` kettévált `allit()` (kapu) és
  `valt()` (csere) párra
- `script.js`: a lapáttűnés blokkja helyén szándékvezérelt `prefetch`

**Build**

- `TELJES_SZEREPEK`, `teljesE()`, `MERET_1800` — **új**
- `pictureKep()` `sorozat()` — a `w` leíró a mért szélességből, azonos
  szélességű fokok kiszűrve
- `egyReteg()` — `RETEG_SIZES`, `lepcso: ['-800','-1400','-1800']`
- `NYERS` — a `-1800` érvényes fok

---

## 5. A KÉPKÉSZENLÉT STRATÉGIÁJA

„Kész” nem azt jelenti, hogy létezik az `<img>`. Azt jelenti:
**kiválasztott forrás · letöltve · dekódolva · van mérete**.

A `keszit(burok)` menete:

1. A burkot elrendezésbe teszi (`hidden = false`), de láthatatlanul
   (`visibility: hidden`). Enélkül a `<picture>` nem választ forrást és
   a lusta kép el sem indul. **Ellenőrizve**: melegítés közben a burok
   `visibility: hidden` — nem tud festeni.
2. `data-srcset` → `srcset`, `data-src` → `src`, `loading="lazy"` →
   `"eager"` (a halasztás ezen a ponton már hazugság).
3. Megvárja a `load` / `error` eseményt, majd `img.decode()`-ot hív
   (2000 ms-os versenyfutással, mert a megszakított `src`-csere
   elutasítással jár; ez nem hiba, csak egy képkockányi késés).
4. **Csak arra vár, ami a képmezőben lesz** (a rect a látómezőt
   ±25%-kal kiterjesztve metszi). A többit elindítja, de nem várja meg.
   A színpadon ez nem változtat semmin — ott mind a három réteg teljes
   képmezős; az alaprajznál viszont igen (lásd 12.).
5. Végül `festhet()`: van-e legalább egy réteg, aminek
   `naturalWidth > 0`.

Felső korlát: **12 000 ms**. Utána a menet elmarad, a kilépő kép marad
a helyén, és a konzolra figyelmeztetés kerül. Üres képmezőt a látogató
akkor sem lát.

**Az alaplap.** A geometriai bizonyítás (2/c) szerint a maszk nem tud
mindig fedni, tehát a fedést nem szabad a maszkra bízni. A belépő
képkocka maszk nélküli, nyugalmi helyzetű másolata a legalsó síkon
(`z-index: 0`) áll a mozdulat teljes ideje alatt. Ugyanaz a `src`,
tehát **ugyanaz a már dekódolt bitkép — nincs új hálózati kérés**. A
másolatból a gombok, a hivatkozások és az azonosítók ki vannak véve, és
`aria-hidden`-t kap.

Előre menet ez a CÉL képkocka, visszafelé az AKTUÁLIS — mindkét esetben
ugyanaz az elem (a `befele` burka), mert mindkét irányban ez az, ami a
maszk alól kilátszhatna.

Csökkentett mozgásnál nem készül alaplap: ott a kilépő kép végig teljes
fedettséggel áll a belépő alatt, tehát nincs mit fedni.

---

## 6. AZ ELŐTÖLTÉS STRATÉGIÁJA

Nem töltünk le mindent. A szabály: **a KÖVETKEZŐ, ténylegesen szükséges
képkocka, és semmi más.**

- **Színpadon belül**: `elorelat(i)` a `i+1` és `i-1` képkockát
  melegíti, **tétlen időben** (`requestIdleCallback`, 3000 ms-os
  határidővel; ahol nincs, 1200 ms-os időzítő). Induláskor a `load`
  esemény UTÁN.

  Miért tétlen időben: mérve, azonnal indítva a melegítés **43 KB**-tal
  terhelte a főoldal első betöltését, mert a második képkocka a
  nyitóképpel egy sávon versengett. Halasztva az első betöltés
  képanyaga 30 KB (lásd 9.).

  Ha a látogató hamarabb lép tovább, semmi nem törik el: a küszöb saját
  kapuja (`keszit`) úgyis kivárja a célt. Ez gyorsítás, nem feltétel.

- **Lapok között**: szándékra (`pointerenter`, `focusin`,
  `touchstart`) egyetlen `<link rel="prefetch" as="document">` a célra.
  Laponként egyszer, legfeljebb 12 cél. Adattakarékos módban
  (`saveData`) és 2G-n egyáltalán nem. A dokumentumból a böngésző
  előolvasója már kiszedi a célképkocka URL-jét, tehát a belépő kép is
  melegen érkezik.

  **Ellenőrizve**: a `focusin` hatására egy 24 KB-os `link` típusú
  dokumentumkérés indult a célra, és a második azonos szándék nem
  csinált újat.

- **Amit NEM csinálunk**: nem töltjük elő a 371 képet, nem melegítjük a
  nem szomszédos képkockákat, és nem emeljük meg a lusta képek
  elsőbbségét ott, ahol nincs rájuk szükség.

---

## 7. VERSENYHELYZETEK

Két külön mechanizmus, mert két külön szakasz van (várakozás,
animáció):

- **`dolgozik`** — sorosítás: egyszerre egy mozdulat. (Meglévő.)
- **`jegy`** — a BEFEJEZÉS joga: minden `menj()` hívás kap egy növekvő
  sorszámot, és a `.then()` csak akkor véglegesít (állítja a `hol`-t, a
  felületet, a történetet), ha a saját jegye még a legutolsó. (Új.)

Enélkül egy „tovább — tovább — vissza” alatt a régebbi, még várakozó
menet tette volna ki a végén a saját képkockáját.

Ha az `at()` `false`-szal tér vissza (a cél nem festhető), a `hol` és a
`celzott` érintetlen marad, a `varakozo` törlődik — a látogató ott
marad, ahol volt, és a kilépő kép végig teljes fedettséggel áll.

A lemezléptetőkben (`fooldal.js`, `keszules.js`) ugyanez a minta:
`allit()` a kapu, `valt()` a csere, jegy védi a sorrendet.

**Mérve**, `/referenciak/bodajki-vadaszkastely/`, négy kattintás
360 ms alatt (1 → 2 → 1 → 2):

```
végállapot          Bambuszerdő (#bambusz) — a LEGUTOLSÓ kérés
jelző               false,false,true       — egyezik
látható burok       1 db, fedettség 1
maradék alaplap     nincs
futó animáció       0
maradék will-change 0
```

---

## 8. ELŐTTE / UTÁNA

**Élesség** (mért felnagyítás; 1 = pontosan 1:1):

| eset | előtte | utána |
|------|--------|-------|
| Bodajki, 1440 × 900, DPR 1,25 (mester 1800 px) | 1,28 × | **1,00 ×** |
| Bodajki, 1440 × 900, DPR 2 | 2,05 × | **1,60 ×** ¹ |
| Főoldal LCP-keret, DPR 1,25 (mester 1500 px) | 1,27 × | **1,20 ×** ¹ |
| Mobil 390 × 844, DPR 3 | 1400w jelölt | 1400w jelölt (változatlan, helyes) |

¹ A maradék a MESTER felbontásából jön, nem a csővezetékből — lásd 16.

**Átmenet** (a főoldal első küszöbe, t = 820 ms, a kilépő képkocka
elrejtve, hogy a belépő oldal önmagában fedjen):

| | előtte | utána |
|---|--------|-------|
| a képmező bal ~35%-a | **tiszta fekete** | a belépő tér képe |
| fedetlen pillanat 151 mintában (Slow 4G) | — | **0** |

**Lapok között:**

| | előtte | utána |
|---|--------|-------|
| `body` fedettsége kattintáskor | 1 → 0 (240 ms) | végig 1 |
| üres lapszín két tér között | ≥ 240 ms, szerkezetből | nincs |
| `html.atmenet` osztály a kimeneten | van | nincs (ellenőrizve mind a 6 vizsgált lapon) |

---

## 9. TELJESÍTMÉNY

**Első betöltés, `/`, 1440 × 900, hideg gyorsítótár** (a `load`
eseményig lejött erőforrások, a helyi kiszolgáló nem tömörít, ezért a
szöveges részek nyers méretben szerepelnek):

```
dokumentum        123 KB nyers   ( 11,6 KB brotli)
CSS               112 KB nyers   ( 29,3 KB brotli, 5 fájl)
JS                 84 KB nyers   ( 22,0 KB brotli, 4 fájl)
betűkészlet        70 KB          (woff2, már tömörített)
kép                30 KB          (ebből az LCP-keret 24 KB)
                  ────────────────────────────────────────
reálisan a dróton  ~157 KB        (brotli + betű + kép)
```

A **350 KB**-os asztali költségvetés tartva.

Változás a képanyagban: az LCP-keret `04-1400.avif` (21,1 KB) →
`04-1800.avif` (23,8 KB) = **+2,7 KB**.

Mobil (390 × 844, DPR 3): a böngésző a `-1400` fokot választja
(szükséglet 1181–1236 készülék-képpont) — **a mobil első betöltés nem
nőtt**. A `-1800` fok csak nagy képmezőn vagy nagy DPR-en jön szóba.

Lemezen: 1113 → 1138 JPEG és 528 → 578 AVIF/WebP származék (a
`-1800` fok 24 teljes képmezős képre). A `keszules-muhely` szerep
szándékosan kimaradt: a szereptár „teljes szélességben”-t ír róla, de a
`keszules.css` mérve 520 px-es dobozban állítja — ott a `-1800`
származék soha nem hivatkozódna meg.

**Nem mértük**: Lighthouse-pontszám, LCP/CLS/INP szám, és a
CPU-fojtás hatása.

---

## 10. ASZTALI EREDMÉNYEK

Minden futásban 30–60 ms-onként mintavételeztük a színpad állapotát, és
azt kérdeztük: **van-e legalább egy olyan burok, ami teljesen
átlátszatlan, maszk nélküli, látható, és fest is?** Ha nincs, az
fedetlen pillanat.

| lap / eset | képmező | hálózat | minta | fedetlen | JS-hiba |
|------------|---------|---------|-------|----------|---------|
| HABLEÁNY, előre + vissza | 1440 × 900 · DPR 1 | Slow 4G, hideg | 151 | **0** | 0 |
| Flotta, messzire előre + teljes vissza | 1440 × 900 · DPR 1 | normál | 201 | **0** | 0 |
| Bodajki, teljes körbejárás oda-vissza | 1440 × 900 · **DPR 2** | normál | 214 | **0** | 0 |
| Bodajki, 4 kattintás 360 ms alatt | 1440 × 900 · DPR 1,25 | normál | — | — | 0 |
| Alaprajz (KAPU), nyitás | 1440 × 900 · DPR 2 | normál | 95 | **0** | 0 |

Konzol: `error` és `warn` szintű üzenet egyik futásban sem keletkezett.

Befagyasztott képkocka t = 820 ms-nál, a kilépő képkockát elrejtve: a
képmezőt a belépő oldal **önmagában** befedi (képernyőfelvétellel
igazolva, előtte / utána).

**Nem mértük**: 1920-as képmezőt külön (a mérés 1440-en és mobilon
történt; a 1920-as eset ugyanazt a `sizes`/létra-logikát futtatja, a
szükséglet 1920 px, a legnagyobb jelölt 1500–1800 px — vagyis ott a
maradék felnagyítás nagyobb, mint 1440-en).

---

## 11. MOBIL EREDMÉNYEK

390 × 844, `devicePixelRatio 3`, érintés emulálva, **Slow 4G, hideg
gyorsítótár**, `/referenciak/duna-cruises-hableany/`:

```
képkocka-választás   03-1400.avif  (szükséglet 1181–1236 készülék-képpont)
                     helyes: nem tölt le -1800-at
minta                181
fedetlen pillanat    0
menet                messzire előre (0 → 3), majd vissza (3 → 1)
```

**Nem mértük**: 375 × 812-t külön (a 390 × 844 ugyanazt az elrendezési
ágat futtatja: `max-width: 720px`), és a valódi ujjmozdulatot
(a lépéseket a jelzőgombokon keresztül váltottuk ki, ami ugyanabba a
`gorgessOda()` → `menj()` útba fut).

---

## 12. LASSÚ HÁLÓZAT

Slow 4G, hideg gyorsítótár, minden fenti mérés ezen is lefutott.

Ami a küszöbnél történik: a kilépő kép **áll, teljes fedettséggel**,
amíg a cél össze nem áll; a mozdulat ezután indul. Nincs áttűnés
feketébe, nincs várakozó képernyő, nincs pörgő jel, nincs csontváz,
nincs százalék.

Az alaprajz KAPU-ja külön mérés, mert ott 30 borító van a rétegben:

| | idő a kattintástól a nyílásig | fedetlen pillanat |
|---|---|---|
| minden képre várva | 5403 ms | 0 |
| **csak a képmezőben lévőkre várva** | **2361 ms** | 0 |

A második a végleges viselkedés. A hajtás alatti borítók menet közben
érkeznek, ahogy minden más lapon — egy hajtás alatti kép nem üres
felület, hanem még nem görgettük oda. A megnyílás utáni állapotban a
képmezőben lévő 3 borítóból 3 festett, és végül mind a 30 megérkezett.

**Nem mértük**: Fast 4G-t és Slow 3G-t külön (a Slow 4G a szigorúbb
eset a Fast 4G-nél; a Slow 3G-t nem futtattuk), és a CPU-fojtást.

---

## 13. CSÖKKENTETT MOZGÁS

A `prefers-reduced-motion: reduce` a `matchMedia` felülírásával,
dokumentum-előtti szkriptként (tehát mielőtt a `kuszob.js` beolvassa).
Ellenőrizve: `window.Kuszob.lassit === true`.

```
lap                 /referenciak/duna-cruises-hableany/
képmező             1440 × 900
minta               161  (25 ms-onként)
fedetlen pillanat   0
alaplap készült     nem  (nem is kell: az egyszerű ág fedett)
végállapot          „Zárt szalon, éjjel” — a kért nézőpont
```

A menet itt sem „elrejt, vár, megmutat”: az `at()` a rövid áttűnés
ELŐTT is kivárja a célt, a kilépő kép pedig teljes fedettséggel áll a
belépő alatt, és csak a végén tűnik el.

**Nem mértük**: valódi operációs rendszer szintű beállítással (a
`matchMedia`-felülírás ugyanazt a kódágat futtatja, de a CSS
médiaszabályokat nem kapcsolja át — a `--motion-*` rövidítéseket és a
nullázott rétegmozgást tehát ebben a futásban nem érvényesítettük).

---

## 14. SZKRIPT NÉLKÜL

A `/` és a `/referenciak/duna-cruises-hableany/` lefordított kimenetéből
minden `<script>` eltávolítva, a `<noscript>` tartalma kibontva, majd
betöltve (1440 × 900).

- A nyitó képkocka teljes képmezőben, élesen áll. Nincs üres terület,
  nincs törött kép.
- A szedés, a négy tény, a két gomb, a lábsáv és a menü a helyén.
- A `body` fedettsége 1 az első képkockától. (Ez a javítás után
  szerkezetből igaz: a `html.atmenet body { opacity: 0 }` megszűnt.
  Korábban is működött, mert az osztályt a szkript tette fel — de most
  már nincs is mit elrontani.)
- A `.szinpad .nyilas:not(:first-of-type) { display: none }` tartalék és
  a `<noscript>` képkockalista változatlan.

**Nem mértük**: böngészőszintű JS-tiltással (a szkriptek eltávolítása a
lefordított HTML-ből ugyanazt a DOM-ot adja, de nem azonos a
`javascript: disabled` beállítással).

---

## 15. REGRESSZIÓ

```
npm run build       Kész: 44 oldal, 30 projekt, 371 kép
                    (1138 JPEG + 578 AVIF/WebP), 3 bejárható tér
npm run ellenorzes  KIMEHET.  —  6 észrevétel, mind a már ismert
                    „a térbeli rétegek data-src-esek — szándékos”
```

- **44 lap** — változatlan.
- **Sitemap** — a lapok halmaza változatlan.
- **`admin.*`** — a források érintetlenek (`git status` szerint sem
  módosultak). A telepített változat a szokásos build-behelyettesítésben
  tér el a forrástól (`{{urlapVegpont}}`, `?v=` bélyegek) — ez a
  javítástól független, meglévő viselkedés.
- **Törött URL / `data-src` / képhivatkozás** — az `ellenorzes.mjs` és a
  build `NYERS` őre is tiszta. Hat lap HTTP 200-zal válaszol, a
  `.nyilas` elemek száma a vártnak megfelelő (13 / 6 / 3 / 0 / 5 / 3).
- **Nyers forráskép nem került a kimenetbe** — a `NYERS` őr most a
  `-1800` fokot is érvényesnek ismeri, a többi szabálya változatlan.
- **Hozzáférhetőség** — az `ellenorzes.mjs` szerint KIMEHET. Az alaplap
  `aria-hidden`-t kap, és se gombot, se hivatkozást, se azonosítót nem
  duplikál.
- **Teljesítmény** — lásd 9.: az asztali első betöltés +2,7 KB képben,
  a mobil változatlan.
- **Szkript nélkül / csökkentett mozgás** — lásd 13. és 14.

---

## 16. AMI MEGMARADT KORLÁTNAK

1. **A mesterek felbontása.** A színpadi képkockák mesterei ma
   1500–1800 px szélesek (a `kepek-tomorit.mjs` 1800 px-es hosszabb
   oldalra vágta őket). A `-1800` fok tehát 1440-es képmezőn DPR 1,25-ig
   1:1-et ad, DPR 2-n viszont még mindig 1,60-szoros felnagyítás marad
   (2872 px szükséglet 1800 px rasztertől). **Ez a maradék nem a
   csővezetékből jön.** A build saját FORRÁS-vizsgálata amúgy is 35
   küszöb alatti mestert jelez. Orvosság: a ~24 színpadi képkockához
   ≥ 2800 px-es mester, és egy további fok a `MERETEK` mellé; kódot
   nem kell hozzá írni, csak egy sort.

2. **Lapok között nincs valódi átmenet.** A fekete villanás megszűnt, de
   a helyére nem került mozdulat: a folytonosságot a böngésző saját
   festés-visszatartása és az előhozás adja. Cross-document
   View Transition vagy SPA-váltás nélkül ennél tovább nem lehet menni,
   és mindkettő túlmutat a feladat keretein (nincs új függőség).

3. **Az alaprajz nyitása lassú hálózaton 2,4 másodperc.** Ez a
   szabály ára: nem nyitunk üres rétegre. Rövidíthető volna, ha az
   alaprajz első képernyője kevesebb borítót vinne — de az tartalmi
   döntés, nem javítás.

4. **Amit nem mértünk**, tételesen: 1920-as képmező, 375 × 812, valódi
   ujjmozdulat, Fast 4G, Slow 3G, CPU-fojtás, operációs rendszer szintű
   csökkentett mozgás, böngészőszintű JS-tiltás, Lighthouse-pontszám,
   LCP/CLS/INP szám, és a Safari/WebKit viselkedése (minden mérés
   Chromiumon készült). A `mask-image` és az `img.decode()` viselkedése
   WebKitben eltérhet; a kód mindkettőre visszalépéssel készült
   (`-webkit-mask-image`, `decode()` hiánya és elutasítása egyaránt
   kezelve), de ez **nincs mérve**.

5. **A 12 másodperces felső korlát.** Ha egy színpadi kép ennyi idő
   alatt sem áll össze, a menet elmarad, és a látogató ott marad, ahol
   volt. Ez a helyes viselkedés (üres képmező helyett), de a
   visszajelzése ma egyetlen konzolüzenet — a felületen semmi nem
   mondja meg, hogy a lépés nem sikerült.
