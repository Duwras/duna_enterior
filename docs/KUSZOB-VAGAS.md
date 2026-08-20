# A KÜSZÖB VÁGÁSA — a lágy maszk helyett vágódoboz

A küszöb mozdulata nem változott: ugyanaz a kamera, ugyanaz a három
fajta (ajtó / ablak / kapu), ugyanaz a rétegfizika. Ami változott: mi
vágja ki a lyukat, amin átlépünk — és hány kulcsképből.

---

## 1. A PANASZ ÉS A MÉRÉS

A tulajdonos felvette képernyőre, hogyan lapoz végig egy átlagos
látogató a főoldalon (28 s, 1920 × 1080, 60 fps). A visszajelzés: az
átmenetek „nagyon nem dinamikusak”.

A felvételből képkockánként kibontva (`fps=20`, 4,9–6,5 s és
11,7–13,3 s), és a lapon újrajátszva (Chromium, 1440 × 810, a
mozdulatot megállítva): a következő tér **nem egy nyíláson át jelent
meg, hanem a fél képmezőn átderengett**. Két kép, egymáson,
körülbelül egy másodpercig. Vagyis pontosan az az áttűnés, amit a
küszöb eredeti leírása ki akart zárni.

Miért:

1. **A maszkot a burok nagyítása tágította** — és vele nagyítódott a
   maszk LÁGY PEREME is. A perem 78–100% között lágyult, a burok a
   mozdulat végére 3,45-szörösére nőtt: a nyílás széle a képmező
   tizedénél is szélesebb elmosódás lett.
2. **A nyílás alapmérete nagy**: a főoldal első képkockáján `rx 20%`,
   `ry 32%` — vagyis induláskor, 1,0-es léptéken a lyuk már a képmező
   40 × 64%-a volt. Nem rés, hanem folt.
3. **A belépő tér befelé halványodott** (a mozdulat 16–34%-a között
   0-ról 1-re). Nagy, lágy folt + halványodás = kettős kép.
4. **A kilépő kép a végén globálisan halványodott el** (74–94%), mert
   a maszk geometriája a képmezőt sosem tudta befedni. Ez a maradék
   fele-fele arányú keverés.

## 2. AMI MOST TÖRTÉNIK

A belépő burokból ellipszis alakú **vágódoboz** lesz a mozdulat
idejére (`border-radius: 50%` + `overflow: hidden`), és ezt a dobozt
nagyítjuk. A benne álló képkocka pontosan ellentétesen kicsinyül, a
nyílás pontja körül — tehát a **kép áll, csak a lyuk nő**.

- **Éles perem.** Kivágás, nem lágy maszk. A doboz pereme akkor is él,
  amikor a lyuk már az egész képernyő.
- **Résből indul.** A kezdő méret a nyílás 30%-a (`KEZDET`), a
  végállapot a legtávolabbi képsarkon is túlér (`SAROK = 1,45`; a
  matematikai minimum 1,415). Amit a lyuk elnyel, azt nem kell
  elhalványítani: a kilépő kép **befedve** tűnik el, nem átúszva.
- **Nincs behalványodás.** Ami a lyukban feltárul, az azonnal teljes
  fedettséggel ott van.
- **A tágulás nem lineáris.** Ugyanaz a perspektíva viszi, mint a
  rétegek nagyítását: `z / (z − út)`. Sokáig alig változik, aztán a
  küszöbön áthaladva kinyílik.
- **Nincs többé alaplap.** A belépő képkocka maszk nélküli másolatát
  azért kellett a legalsó síkra tenni, mert a maszk geometriája nem
  fedte be a képmezőt. A vágódoboz befedi, tehát a másolat — egy teljes
  DOM-klón minden helyváltásnál — elmaradt.

Az idő rövidült: **760 ms** előre (volt 900), 420 ms vissza (volt
480), a kapu 620 ms maradt. Ugyanez a vágás nyitja az alaprajzot
(`feltarul`) és a képnagyítót (`galeria.js`), tehát a lapon továbbra
is EGY mozdulat van.

## 3. KÖZBEN: A CLIP-PATH ZSÁKUTCA

Az első javítás a lyukat `clip-path: ellipse()`-szel vágta ki,
képkockánként újraszámolt sugárral. A mértan jó volt, a mozgás nem: a
visszajelzés szerint „olyan érzés, mintha nagyon alacsony fps-sel
futna, egy átmenet egy-két képkockából áll”.

Két ok, és mindkettő számolható:

**a) A clip-path sugarát a böngésző FESTI.** A transform a
kompozitoron marad, a clip-path alapalakzat animációja viszont —
teljes képmezős elemen, három képréteggel — képkockánkénti
újrarajzolás. A vágódoboz nagyítása ehelyett transform, tehát a
mozdulat alatt nincs festés.

**b) 17 kulcskép kevés volt az új tartományhoz.** A böngésző két
kulcskép között lineárisan interpolál. A doboz nagyítása és a benne
álló kép ellenskálája egymás pontos fordítottja — a szorzatuk viszont
csak a kulcsképeken 1,000. Ami közte marad, az méretlüktetés a belépő
képen, és pont úgy fest, mintha a lap képkockákat ejtene.

Mérve (főoldal, 1. keret, 1440 px, ajtó), a legnagyobb eltérés:

| kulcskép | két kulcskép között | legnagyobb hiba |
|----------|--------------------|-----------------|
| 17       | 48 ms              | **5,48%**       |
| 33       | 24 ms              | 1,36%           |
| 49       | 16 ms              | 0,62%           |
| **81**   | **10 ms**          | **0,22%**       |

A régi, maszkos megoldásnál 17 elég volt, mert ott a nagyítás
3,4-szeres volt. A vágódoboz 16-szorosra nő, és a hiba a nagyítási
tartománnyal együtt nő. Most 81 kulcskép megy.

Ellenőrizve a lapon (a mozdulatot megállítva, 20 ms-onként léptetve):
a doboz és a képkocka nagyításának szorzata 0,945-ről 1,000-re fut,
monoton, lüktetés nélkül. A képnagyítóban ugyanez: a kép mért
szélessége a mozdulat alatt 640,0 és 641,9 px között marad (0,3%).

## 4. SEBESSÉGHATÁR GÖRGETÉS KÖZBEN

A felvételen a látogató gyorsabban görgetett, mint ahogy a küszöb
lefutott. Eddig ilyenkor a kérés sorba állt (`varakozo`), és a
színpad végig félkész állapotokat mutatott.

Most a futó mozdulat **siettethető**: `Kuszob.siettet(k)` a futó
animációk `playbackRate`-jét szorozza (1–3 ×), a ter.js pedig annál
nagyobb `k`-val hívja, minél messzebbre kéri magát a látogató. Egy
mozdulat fut egyszerre, csak gyorsabban pereg; sor nem épül belőle.

Az előretöltés határideje is rövidült: a szomszédos képkocka
`requestIdleCallback` határideje 3000 ms volt, most 700 ms. Aki
görget, MOST fog továbblépni, és a küszöb megvárja a képet — ez a
várakozás az, amit a látogató akadásnak lát.

A belépő oldal két maszkos mélységrétege a mozdulat idejére kikapcsol
(`display: none`): a kép áll, a másolatok nem látszanak, viszont két
teljes képmezős kompozitsíkkal kevesebb van.

## 5. AMI NINCS MÉRVE

- **Képkockaidő.** A fejetlen böngésző rAF-je ezen a gépen 1 Hz-re
  fojtva fut (nyugalomban is), tehát a mozdulat valódi képkockaideje
  **nincs mérve** — sem a régié, sem az újé. Ami mérve van: mi fest és
  mi nem (transform vs. clip-path), és a mintavételezés hibája.
- **Valódi mobil GPU**, és a WebKit/Gecko viselkedése ezen a lapon.
- A nyílások helye (`--nyx/--nyy`) adat, nem kód: ahol a nyílás nem
  valódi ajtón áll, ott a mozdulat most jobban látszik — és jobban
  látszik az is, ha az adat pontatlan.
