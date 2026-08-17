# DUNA — THE LIVING INTERIOR

**Esettanulmány**

---

## 1. A PROBLÉMA

Egy győri asztalos- és hajóépítő üzem 1991 óta dolgozik. Szállodákat,
kastélyokat, éttermeket, lakásokat és hajókat rendez be — a tervezéstől a
kivitelezésig, egy kézben.

A munka nem tárgy. **A munka a tér, amiben az ember áll.** Egy portfóliórács
pontosan azt veszi el belőle, ami: a bent-létet. Harminc projekt, 371
fénykép, és mindegyik ugyanabba a hálóba szorítva, egyforma dobozokban,
sorban.

És volt egy nehezebb probléma is. Az archívum nem tökéletes. Húsz éves
fényképek, vízjelek, beégetett dátumbélyegek, néhány látványterv fénykép
helyett, és egy műhely, amiről **egyetlen** használható felvétel létezik.

Két hazug megoldás kínálkozott: eltakarni a hiányt, vagy kitalálni, ami
nincs meg. **Egyikbe sem mentünk bele.**

---

## 2. AZ ÖTLET

> A DUNA nem házakat épít. A DUNA a házak belsejét építi.

Ha a munka a belső tér, akkor a lap legyen **egyetlen összefüggő belső tér**,
összerakva azokból a belső terekből, amiket a DUNA épített.

Nem metafora. Működési szabály:

**„Egy szoba, aztán a következő. Soha nem egy oldal.”**

Következménye azonnal: **minden átmenet egy küszöb.** Nincs oldalváltás,
nincs betöltés, nincs vissza-a-listához. Van egy nyílás, és mögötte a
következő tér.

---

## 3. A RENDSZER

Öt mozgásprimitív, és nincs hatodik:

**küszöb · vízgörbe · lépték · fedettség · regiszterváltás**

Ha valami nem fejezhető ki ezzel az öttel, akkor **nem kerül a lapra**.

A rendszer adatvezérelt: a frontend egyetlen projektről sem tud semmit.
Elolvassa, mit írt ki a build a jelölésbe — nézőpontokat, nyílásokat,
küszöbfajtákat, kapukat —, és ezt vezényli. **Új tér = új adat, nem új kód.**

A lap **két rétegben** épül. Az első a működés: a tartalom, a
hivatkozások, a dokumentum. A második a mozgás. Ha a második nem fut le, az
első a helyén marad.

---

## 4. A KÜSZÖB

A lap egyetlen átmenete. **900 ms**, három szakaszban:

```
  0–260 ms   közeledés    a közeli réteg nőni kezd
260–620 ms   áthaladás    a közeli réteg elmegy a kamera mellett,
                          a nyílás tágul, a következő tér benne jelenik meg
620–900 ms   megülepedés  a következő tér 1.0-ra áll, és nem lő túl
```

Három fajta, ugyanaz a fizika, más úthossz és más jelentés: **AJTÓ** (másik
szoba) · **ABLAK** (ami mozog) · **KAPU** (fejezetváltás).

Amitől nem áttűnés: a következő tér **először a nyílásban** jelenik meg, és
onnan terjed kifelé — a nyílás pedig az előző kép **saját** nyílása. Ez a
különbség a *rajta át* és a *fölötte* között.

A mozgás nem tetszőleges görbékből áll. **Egy kamera megy előre**, és minden
réteg annyit nő, amennyit a saját mélységéből következik:

```
nagyítás = z / (z − út)
```

Az ajtótok karnyújtásnyira (z = 1,6) eleinte alig változik, aztán hirtelen
elrobog a fej mellett. A nyíláson túli tér (z = 14) alig mozdul. **Egyetlen
közös lineáris áttűnés soha nem tudja ezt megcsinálni** — ezért olvasódna
áttűnésnek.

A maszkot nem rajzoljuk újra képkockánként: a maszkot **vivő** elemet
nagyítjuk, és a benne lévő képet pontosan ellentétesen kicsinyítjük. Így a
fotó áll, és a **lyuk** tágul — az egész a kompozitoron marad. Az
ellenskálát 17 mintavételezett kulcskép adja, mert két kulcskép között az
1/x nem a x lineáris interpoláltja; a hiba < 0,3%.

Visszafelé **nem másik animáció**. Ugyanaz a szalag, hátrafelé, 480 ms alatt
— az ismerős út gyorsabb. Ezért érzi a látogató, hogy **ugyanazon az ajtón
lép ki**, amin bejött.

Csökkentett mozgásnál a küszöb 200 ms-os áttűnésre rövidül. **A mozgás
tűnik el, nem a tartalom.**

Az egész: **14 KB nyers JavaScript.** Nincs WebGL, nincs 3D-motor, nincs
animációs könyvtár, nincs futásidejű függőség.

---

## 5. A LIVING INTERIOR

Ahol az archívum elég sűrű — legalább két megírt nézőpont ugyanabból a
térből —, ott a projekt **nem lap, hanem tér**.

A `/referenciak/duna-cruises-hableany/` cím maga a bejárás. Öt kameraállás,
küszöbökkel köztük, nézőpont-horgonyokkal a címben (`#orr`, `#atjaro`, …),
és **alatta ott marad a teljes projektdokumentum**. Az URL nem változik.

Ma három ilyen tér van: egy sétahajó, egy szálloda és egy vadászkastély.
A negyedikhez nem kód kell, hanem fénykép.

---

## 6. AZ ALAPRAJZ

A lap térbeli indexe. Nem portfóliórács: **építészeti rajz** —
hajszálvonal, felirat, koordináta, üres hely.

A cella szélessége a projekt **fotószámából** jön: nagyobb anyag, nagyobb
szoba. Ettől lesz rajz, és nem egyenrácsos katalógus. **A forma nem
rangsor** — a nagyobb cella többet mutat, nem többet ér.

Hét szárny, harminc szoba, egy lapon.

És ugyanazon a mozdulaton át jön elő, mint egy szoba: a **KAPU** 620 ms-a,
ugyanazokkal a mintákkal és ugyanazzal a kameragörbével. Nem második
átmenet — a lapon **nincs** második átmenet.

Bárhonnan `Esc`, és ott van.

---

## 7. A FLOTTA

Tizenöt hajó: sétahajó, motorcsónakok, vitorlások, egy jégvitorlás.

A vízvonal-index nem rangsorol. Azt mondja meg, az archívum **melyik
állomásait** dokumentálja ennek a hajónak — váz · felület · belső · vízen.
Ahol nincs adat, ott **üres marad**.

A legrövidebb sor a `Bojan – Harcos`: három fénykép, nulla állomás. Ott van,
mert valódi DUNA-hajó. **A kihagyása a szebb index kedvéért volna a
torzítás.**

A Flotta nyitánya egy pár: ugyanaz a hajótest bordákból, majd készen. Ez az
archívum egyetlen elejétől-végéig tartó lánca — és ingyen volt, nem kellett
hozzá fotózni.

---

## 8. A KÉSZÜLÉS

A fejezet, ami megmutatja, hogyan lesz a fából tér.

Négy sorozat, és mindegyikben legalább két **különböző lépték** — részlet,
tárgy, tér. Enélkül nincs mit felfedni: a sorozat nem sorozat, csak képsor.
A build megáll, ha nincs meg.

**A készülés lapján egyetlen látványterv sincs.** Szerkesztői szabály: a
metszet azt mutatja, ami elkészült, nem azt, amit rajzoltunk.

És a fejezet **a saját legnagyobb hiányával zárul.** Egyetlen fénykép, ami
magát a műhelyteret mutatja: 2004, 0,75 megapixel, beégetett dátumbélyeggel.
Mellette a kimondott hiány.

**Nem pótoltuk semmivel.** Ez a lap legőszintébb pillanata, és ez a jövőbeli
fotózás megrendelésének alapja.

---

## 9. MOBIL

Nem kicsinyített asztali nézet.

**Telefonon a fényképek MAGUK a kamera.** Vízszintes ujjmozdulat lépteti a
valódi kameraállásokat; a függőleges görgetés az enfilád. A vezérlők a
hüvelykujj sávjába kerülnek, alulra. A főoldalon a műszaki sáv eltűnik —
nincs döntése; a Flottán marad, mert van: hányadik állomáson állunk a
hatból.

A nézőpontjelző telefonon **léptékké** válik: a képmező szélességét osztja
fel, minden keret ugyanakkora szeletet kap, akárhány van belőlük.

Mérve 375 × 812, 390 × 844 és 412 × 915 mellett, valódi érintőemulációval:
**vízszintes túlcsordulás sehol, levágott vezérlő sehol, érintőcél
mindenütt.**

---

## 10. TELJESÍTMÉNY

Statikus HTML, CSS és nyers JavaScript. **Nincs keretrendszer, nincs
futásidejű függőség.**

| Lap | Kezdeti letöltés |
|---|---:|
| Főoldal | **170,7 KB** |
| A KÉSZÜLÉS | **248,0 KB** |
| Szint-1 szoba (HABLEÁNY) | **285,3 KB** |
| A flotta | **345,5 KB** |

*(brotli a szövegre, nyers a képre és a betűre)*

A térbeli rétegek nem töltenek le előre: **csak a szomszédos képkocka**
kerül be. Az AVIF ott van, ahol nyer; a betűkészlet metszve, öt fájl, mind
használt.

**Asztali keret: 350 KB — belül.** Mobil keret: 300 KB — a Flotta kívül,
**egyetlen kép miatt**, néven nevezve: a nyitó képkocka mestere 1,81
megapixel, és AVIF-ként is 197 KB. Jobb mester, és a lap egy lépésben
belül van. Ez fotó, nem kód.

---

## 11. AKADÁLYMENTESSÉG

**A csökkentett mozgás a mozgást veszi el, nem a tartalmat.** A küszöb
200 ms-os áttűnésre rövidül, a rétegmozgás szorzója nullára áll — de
egyetlen `display: none` sincs a `prefers-reduced-motion` ágakban.

Szkript nélkül a lap **teljes**: tartalom, szerkezet, navigáció. Ahol a
színpad egy képkockát mutatna, ott a build egy **valódi listát** tesz ki —
minden képkocka, minden képaláírás, minden hivatkozás.

Az alaprajz valódi párbeszédablak: a háttér `inert`, a fókusz bent van, az
`Esc` zár, és a fókusz **oda tér vissza, ahonnan indult**. Nyitott alaprajz
alatt a fejléc nem látszik — mert `inert`, és ami nem működik, az ne is
látsszon élőnek.

Mind a 371 képnek van alt szövege, **a fényképből írva**. Egy `<h1>`
laponként, címszint-ugrás nélkül. Érintőcél mindenütt.

---

## 12. AZ EREDMÉNY

Negyvennégy lap. Harminc projekt. 371 fénykép. Három bejárható tér.
Tizenöt hajó. Egy küszöb.

De nem ez az eredmény.

**Az eredmény az, hogy a lap úgy viselkedik, ahogy a munka, amit bemutat.**
Egy DUNA-belsőben az ember nem lapoz. Átmegy egy ajtón, és egy másik térben
áll. A lapon ugyanez történik, ugyanannyi idő alatt, ugyanazzal a
súlyponttal.

És az eredmény az is, hogy **a lap kimondja, mije nincs.** Huszonkét mondat
a harminc leírásban így végződik: *nincs felvétel · nincs adat · nem
dokumentált.* A vízjelek ott maradtak. A húszéves dátumbélyegek ott
maradtak. A látványterv látványtervnek van nevezve.

A KÉSZÜLÉS fejezet az archívum egyetlen műhelyfényképével zárul, 2004-ből,
0,75 megapixelen — és a kimondott hiánnyal.

**Egy asztalosüzemnek ez a legpontosabb önarcképe, ami ma elkészíthető.**
Nem azért, mert minden megvan benne, hanem mert nincs benne semmi, ami
nincs meg.

---

*Kapcsolódó: [AWWWARDS-READINESS.md](AWWWARDS-READINESS.md) ·
[PHASE-8-FINAL-POLISH.md](PHASE-8-FINAL-POLISH.md)*
