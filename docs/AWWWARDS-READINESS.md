# AWWWARDS — BEADÁSI KÉSZENLÉT

**DUNA — THE LIVING INTERIOR · 8. fázis, 5. szakasz**
Készült: 2026-08-16.

**Ez a dokumentum nem beadás.** Azt írja le, mi kell hozzá, mi van meg, és
mi hiányzik — hogy amikor a tulajdonos dönt, ne kelljen semmit kitalálni.

---

## PROJEKT

**DUNA — THE LIVING INTERIOR**

---

## AZ ALAPGONDOLAT

> A DUNA nem házakat épít.
> A DUNA a házak **belsejét** építi.
>
> A lap egyetlen összefüggő belső tér, amit azokból a belső terekből raktunk
> össze, amiket a DUNA épített.
>
> Minden átmenet egy küszöb.
> Minden szoba egy másik szobába vezet.
>
> A lap úgy viselkedik, ahogy a munka, amit bemutat.

Az elv egy mondatban: **„Egy szoba, aztán a következő. Soha nem egy oldal.”**

---

## POZICIONÁLÁS — a lap tíz legerősebb tulajdonsága

Sorrendben, aszerint, hogy melyik nehezebben másolható.

### 1. Egyetlen átmenet az egész lapon — A KÜSZÖB

Nem effektkészlet. **Egy** mozdulat, 900 ms, és minden helyváltás ez a
mozdulat — más nyílással, más jelentéssel:

| Fajta | Mit jelent | Hol |
|---|---|---|
| **AJTÓ** | másik szoba | belső terek között |
| **ABLAK** | ami mozog | ki a hajóra, vissza a térbe |
| **KAPU** | fejezetváltás | más idő, más rész, más regiszter |

A fizika mindháromnál ugyanaz, csak az úthossz más. Visszafelé **nem másik
animáció**: ugyanaz a szalag, hátrafelé lejátszva, 480 ms alatt — ezért érzi
a látogató, hogy **ugyanazon az ajtón lép ki**.

### 2. Fényképi mélység-eltolás — nem áttűnés, hanem átjárás

A kamera előremegy, és **minden réteg annyit nő, amennyit a saját
mélységéből következik**: `nagyítás = z / (z − út)`. Az ajtótok
karnyújtásnyira (z = 1,6) eleinte alig mozdul, aztán elrobog a fej mellett;
a nyíláson túli tér (z = 14) alig változik.

A következő tér **először a nyílásban jelenik meg**, és onnan terjed kifelé.
Ez a különbség a „rajta át” és a „fölötte” között.

Technikailag: a maszkot vivő elem nő, a benne lévő kép **pontosan
ellentétesen** kicsinyül — a fotó áll, a **lyuk** tágul. Az ellenskála
17 mintavételezett kulcsképpel, mert két kulcskép között az 1/x nem a x
lineáris interpoláltja. A hiba < 0,3%, és az egész a kompozitoron marad.

**Mindez 14 KB nyers JavaScript.** Nincs WebGL, nincs 3D-motor, nincs
animációs könyvtár.

### 3. A LIVING INTERIOR — a projekt maga a tér

Három projektnél a `/referenciak/<slug>/` cím **nem lap, hanem bejárható
tér**: valódi kameraállásokkal, nézőpont-horgonyokkal, és a teljes
projektdokumentummal alatta. **Az URL nem változik** — ugyanaz a cím
hordozza a bejárást és a dokumentumot.

### 4. A FLOTTA mint építési archívum, nem galéria

Tizenöt hajó, és a vízvonal-index nem rangsorol: azt mondja meg, az archívum
**melyik állomásait** dokumentálja ennek a hajónak — váz, felület, belső,
vízen. Ahol nincs adat, ott üres marad.

A `bojan-harcos` **három fényképpel és nulla állomással** ott van, mert
valódi DUNA-hajó. A kihagyása a szebb index kedvéért volna a torzítás.

### 5. A METSZET — a fénykép lappá válik

Az egyetlen hely, ahol nincs küszöb: itt nem a hely változik, hanem a
**lépték**. A fénykép abbahagyja, hogy tér legyen, és dokumentummá válik.

### 6. AZ ALAPRAJZ mint valódi térbeli index

Nem portfóliórács. Építészeti index: hajszálvonal, felirat, koordináta, üres
hely. **A cella szélessége a fotószámból jön** — nagyobb anyag, nagyobb
szoba. Ettől lesz rajz, és nem egyenrácsos katalógus.

És ugyanazon a mozdulaton át jön elő, mint egy szoba: a **KAPU** 620 ms-a.
Nem egy második átmenet — a lapon nincs második átmenet.

### 7. Mobil: a fényképek MAGUK a kamera

Nem kicsinyített asztali nézet. Vízszintes ujjmozdulat lépteti a valódi
kameraállásokat, a függőleges görgetés az enfilád, a vezérlők a hüvelykujj
sávjában. A főoldalon a műszaki sáv eltűnik (nincs döntése), a Flottán marad
(van: hányadik állomás a hatból).

### 8. Visszafogottság mint tartalom

Nincs kurzoreffekt, szemcse, 3D, izzó színátmenet, folyadék, részecske,
görgetéseltérítés, hang, előtöltő-színház, hamis építészeti drótváz.

**Öt mozgásprimitív, és nincs hatodik:** küszöb · vízgörbe · lépték ·
fedettség · regiszterváltás.

### 9. Dokumentarista tisztesség

A lap **kimondja, mije nincs.** Huszonkét mondat a harminc leírásban így
végződik: *nincs felvétel · nincs adat · nem dokumentált.* A vízjelek és a
beégetett dátumbélyegek ott maradnak. A látványtervet a lap **látványtervnek
nevezi**, nem fényképnek — szóhasználatban is.

**A KÉSZÜLÉS fejezet a saját legnagyobb hiányával zárul:** egyetlen
műhelyfényképpel 2004-ből, 0,75 megapixelen, beégetett dátummal — és a
kimondott hiánnyal.

### 10. Nincs futásidejű függőség

Nincs keretrendszer, nincs build-lánc a böngészőben, nincs betöltött
könyvtár. Statikus HTML, CSS és nyers JavaScript. **A második réteg a
mozgás:** ha egyetlen szkript sem fut le, a tartalom, a szerkezet és a
navigáció **a helyén marad** — mérve mind a kilenc fő lapon.

---

## AMIT NEM ÁLLÍTUNK

- **Nincs díjunk.** Se Awwwards, se CSSDA, se FWA, se semmi. A lapon és a
  dokumentációban egyetlen díjjelvény sem szerepel, és nem is szerepelhet.
- **Nem „a világ legjobb belsőépítészeti oldala”**, és semmi hasonló.
- **Nem állítjuk, hogy a fotóanyag kifogástalan.** Nem az: 18 projekten
  vízjel van, öt kritikus kép a felbontási minimum alatt, és a műhelyről
  egyetlen használható felvétel létezik.
- **Nem állítjuk, hogy a lap teljes.** A MŰHELY hiányzik, és ezt a lap maga
  is kimondja.
- **Nem állítjuk, hogy minden jog rendezett.** Egy projekté nem az.

Egy Awwwards-zsűri ezeket úgyis látja. Jobb, ha a beadó mondja ki előbb.

---

## BEADÁSI ANYAGOK — ellenőrzőlista

**Egyetlen képernyőkép sem készülhet el szerkesztéssel, retusálással vagy
gyengeség eltakarásával. Mind valós éles állapotból.**

A beadás előtt `sajatDomainEl` **legyen `true`** és a lap éles címen álljon
— az Awwwards élő URL-t kér.

| # | Anyag | Honnan | Beállítás | Állapot |
|---|---|---|---|---|
| 1 | **Asztali hero** | `/` | 1440 × 900, görgetés 0, sütisáv elintézve | ⬜ |
| 2 | **Mobil** | `/` | 390 × 844, DPR 2 | ⬜ |
| 3 | **Küszöb** | `/` | a 10. és 11. keret között, ~450 ms-nál — a nyílás nyitva, a következő tér már benne látszik | ⬜ |
| 4 | **Living Interior** | `/referenciak/duna-cruises-hableany/#atjaro` | 1440 × 900 | ⬜ |
| 5 | **Flotta** | `/flotta.html` | 1440 × 900, a vízvonal-index látszik | ⬜ |
| 6 | **Alaprajz** | `/#alaprajz` | 1440 × 900, „Mind” szűrő | ⬜ |
| 7 | **A KÉSZÜLÉS** | `/keszules.html` | 1440 × 900, a Boesch 640 sorozat | ⬜ |
| 8 | **Projektlap** | `/referenciak/boesch-640-de-luxe/` | 1440 × 900 | ⬜ |
| 9 | **Az utolsó ajtó** | `/` legalja | 1440 × 900 — a lap zárása | ⬜ |

**Videó (ha kérik):** egyetlen folyamatos felvétel, hang nélkül, vágás
nélkül — főoldal → első küszöb → HABLEÁNY → hajófelfedés → metszet →
alaprajz → projekt. **A vágatlanság itt érv:** a lapnak nincs mit
elrejtenie a vágások közé.

**Szöveges mezők:** a rövid leírás a fenti *ALAPGONDOLAT*, az esettanulmány
[AWWWARDS-CASE-STUDY.md](AWWWARDS-CASE-STUDY.md).

**Technológiák, ha kérik:** *HTML · CSS · Vanilla JavaScript · Web Animations
API · AVIF/WebP · Cloudflare Pages.* Nem hiányos lista: tényleg ennyi.

---

## BEADÁS ELŐTTI KAPUK

Beadás **nem indulhat**, amíg mind a négy nem teljesül:

1. **`sajatDomainEl` = `true`**, éles domain, `noindex` eltűnt, visszamérve
   ([LAUNCH-CHECKLIST.md 13.](LAUNCH-CHECKLIST.md))
2. **Hotel Domus Collis jogi helyzete lezárva** — a zsűri által látott
   nyitány öt kerete ebből a projektből van
   ([LAUNCH-CONTENT-REVIEW.md §7.1](LAUNCH-CONTENT-REVIEW.md))
3. **A tulajdonos elolvasta a harminc leírást**
4. **Egy iPhone és egy Android kézbe véve** — az emuláció rendben van, de a
   beadás mobilon is látszik

**Erősen ajánlott, nem kapu:** jobb mester a Flotta nyitóképéhez. Ez a lap
egyetlen mérhető gyengesége (`duna-cruises-hableany/01`, 1,81 MP, 197 KB
AVIF) — ~100 KB-ot ad vissza, és a Flotta a mobil 300 KB-os kereten belülre
kerül.

---

## AMI A LAPBÓL HIÁNYZIK, ÉS A ZSŰRI IS LÁTNI FOGJA

Nyíltan, mert úgyis kiderül:

1. **Nincs MŰHELY-fejezet.** A lap a saját készítőjének a terét nem mutatja
   meg, mert nincs róla fénykép. **Ez a lap egyetlen igazi hiánya**, és a
   KÉSZÜLÉS zárása ki is mondja.
2. **A nappal → éjjel KAPU nem szól.** A mechanizmus, a szótár
   (`nappal · aranyora · ejjel`) és az ellenőrző kész; az aranyóra **egyetlen
   felvételen sincs meg**. Egy rögzített állványállás három időpontban
   megnyitná.
3. **Archív felbontás.** Tizennyolc projekten vízjel, tizenkettőn 2003–2004-es
   dátumbélyeg. **Nem hiba, hanem kor** — de a zsűri látni fogja.
4. **A Flotta a mobil súlykereten kívül.** Egyetlen kép miatt, néven nevezve.

---

*Kapcsolódó: [AWWWARDS-CASE-STUDY.md](AWWWARDS-CASE-STUDY.md) ·
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) ·
[PHASE-8-FINAL-POLISH.md](PHASE-8-FINAL-POLISH.md)*
