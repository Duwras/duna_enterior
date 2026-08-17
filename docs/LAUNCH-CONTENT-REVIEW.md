# LAUNCH — TARTALMI ÁTNÉZÉS

**DUNA — THE LIVING INTERIOR · 8. fázis, 1. szakasz**
Készült: 2026-08-16. Alap: `data/projektek.json` (30 projekt, 371 kép),
`data/forras.json`, `data/terek.json`, `data/flotta.json`, `data/keszules.json`.

Ez a dokumentum **nem szerkesztési javaslat**. Két dolgot csinál:

1. tételesen kimondja, mi az, ami **műszakilag kész**, és mi az, amihez
   **a tulajdonos jóváhagyása** kell;
2. rögzíti a nyitva maradt **jogi** kérdéseket úgy, ahogy vannak.

A 8. fázis a szövegeket **nem írta át**. Egyetlen mondat változott, alább
tételesen indokolva (§4).

---

## 0. A leglényegesebb két sor

**MŰSZAKILAG KÉSZ.** A harminc leírás, a 371 alt szöveg, a címek, a
tipográfia és a hivatkozások ellenőrizve; a build és az audit hibátlan.
A lap **ma kimehetne**.

**JÓVÁHAGYÁSRA VÁR.** A harminc leírást a tulajdonos **még nem olvasta el**.
A leírások a fényképek olvasatai — nem tartalmaznak kitalált tényt, de
nem is tartalmaznak olyan tényt, ami nincs benne a fényképben (dátum,
megrendelő, anyag, helyszín). Egy projektnél (`hotel-domus-collis`) a
**felhasználási jog írásban nincs rendezve**.

A kettő független. A második nem műszaki blokkoló; a tulajdonos döntése,
hogy megvárja-e.

---

## 1. Mit ellenőriztünk, és mivel

| Vizsgálat | Eszköz | Eredmény |
|---|---|---|
| Egyenes idézőjel, aposztróf, dupla szóköz, szóköz írásjel előtt | gépi, mind a 30 leíráson és mind a 371 alton | **0 találat** |
| Kötőjel gondolatjel helyett | gépi | **0 találat** |
| Írásjel utáni hiányzó szóköz | gépi | **0 találat** |
| Nyitó/záró szóköz | gépi | **0 találat** |
| Hiányzó alt | gépi (`npm run ellenorzes`) | **0** — mind a 371 kép |
| Üres alt `aria-hidden` nélkül | gépi | **0** |
| Projekten belüli azonos alt | gépi | **0** |
| Számnév ↔ tényleges képszám | tételesen, mind a 30-on | **egyezik** |
| Felsőfokú és egyediségi állítások | tételesen, `flotta.json`/`keszules.json` adataival ütköztetve | **1 pontatlanság** → §4 |
| Kimondott bizonytalanság megőrzése | tételesen | **megőrizve, egy sem lett „javítva”** |
| HABLEÁNY-cím | teljes repó + build kimenet | **helyes mindenütt** → §6 |

---

## 2. A harminc leírás — állapottábla

`kimondott hiány` = a leírás maga mondja ki, hogy valamiről **nincs
felvétel / nincs adat / nincs dokumentálva**. Ez **helyes tartalom**, nem
hiányosság. Nem pótolandó, és semmilyen körülmények között nem cserélendő
kitalált bizonyosságra.

| Projekt | Szárny | Kép | Jelzés |
|---|---|---|---|
| `garzon-plaza-hotel` | Hotel | 20 | kimondott hiány |
| `ottevenyi-kastely` | Kastély | 8 | kimondott hiány |
| `vatikani-diszdoboz` | Egyedi | 5 | kimondott hiány · személyiségi jog |
| `mercedes-plato` | Egyedi | 10 | kimondott hiány |
| `szent-laszlo-latogatokozpont-fa-kapuja` | Szakrális | 8 | kimondott hiány · NEEDS_RIGHTS · személyiségi jog |
| `hotel-domus-collis` | Hotel | 20 | kimondott hiány · NEEDS_RIGHTS · **JOG TISZTÁZANDÓ** |
| `bodajki-vadaszkastely` | Kastély | 10 | kimondott hiány |
| `zirci-apatsag` | Szakrális | 10 | kimondott hiány · ARCHIVE_ONLY · vízjel · látványterv |
| `kristaly-etterem` | Étterem | 10 | kimondott hiány · ARCHIVE_ONLY · látványterv |
| `domus-pellegrini-hotel-apartmanok` | Hotel | 5 | kimondott hiány · ARCHIVE_ONLY · vízjel |
| `fuzio-a-tajjal` | Lakóingatlan | 20 | kimondott hiány · ARCHIVE_ONLY · vízjel |
| `csaladi-haz` | Lakóingatlan | 14 | kimondott hiány · ARCHIVE_ONLY · vízjel · látványterv |
| `budai-haz` | Lakóingatlan | 12 | kimondott hiány · ARCHIVE_ONLY · vízjel · látványterv |
| `belvarosban-nyugalomban` | Lakóingatlan | 15 | kimondott hiány · ARCHIVE_ONLY · vízjel |
| `fafaragasok` | Egyedi | 10 | kimondott hiány |
| `duna-cruises-hableany` | Hajó | 23 | kimondott hiány |
| `duna-hajok-6-1-kadet` | Hajó | 11 | kimondott hiány |
| `duna-hajok-6-1-cabin` | Hajó | 26 | kimondott hiány |
| `bojan-harcos` | Hajó | 3 | kimondott hiány · NEEDS_MASTER · vízjel |
| `boesch-640-de-luxe` | Hajó | 19 | NEEDS_MASTER · vízjel |
| `boesch-580` | Hajó | 18 | NEEDS_MASTER · vízjel |
| `jolle-25` | Hajó | 10 | kimondott hiány · NEEDS_MASTER · vízjel |
| `arcangeli-super-jolly` | Hajó | 13 | NEEDS_MASTER · vízjel |
| `boesch-560-de-luxe` | Hajó | 17 | NEEDS_MASTER · vízjel |
| `rivalis-vitorlas-hajo` | Hajó | 8 | kimondott hiány · NEEDS_MASTER · vízjel |
| `veteran-motorcsonak` | Hajó | 8 | kimondott hiány · NEEDS_MASTER · vízjel |
| `volvo-penta-motorcsonak` | Hajó | 12 | NEEDS_MASTER · vízjel |
| `jegvitorlas` | Hajó | 7 | NEEDS_MASTER · vízjel |
| `meyer-motorcsonak-1` | Hajó | 12 | NEEDS_MASTER · vízjel |
| `meyer-motorcsonak-2` | Hajó | 7 | NEEDS_MASTER · vízjel |

**Összesítés:** 30 projektből **22-ben** van legalább egy kimondott hiány.
Ez nem gyengeség, hanem a lap tartása: az archívum azt mondja meg, mi van
meg, és azt is, mi nincs.

---

## 3. Kimondott hiányok — a teljes lista

Ezek a mondatok a nyilvános lapon állnak. **Egyik sem törlendő** anélkül,
hogy a hiányt valóban pótló fénykép megérkezne.

| Projekt | A mondat |
|---|---|
| `garzon-plaza-hotel` | „A kivitelezés köztes állapotairól nincs felvétel.” |
| `ottevenyi-kastely` | „A famunkák készítéséről nincs felvétel.” |
| `vatikani-diszdoboz` | „A készítés folyamatáról — az anyagról, a kézről, a doboz saját teréről — nincs felvétel.” |
| `mercedes-plato` | „Az átalakítás munkafolyamata nincs dokumentálva.” |
| `szent-laszlo-…-fa-kapuja` | „A műhelyben töltött időről — az anyagról és a faragásról — nincs felvétel.” |
| `hotel-domus-collis` | „…a kivitelezésről és a beépítésről nincs felvétel.” |
| `bodajki-vadaszkastely` | „A tárlók és az installációk készítéséről nincs felvétel.” |
| `zirci-apatsag` | „Arról nincs adat, hogy a terv megépült-e.” |
| `kristaly-etterem` | „Arról nincs adat, hogy a terv megépült-e.” |
| `csaladi-haz` | „Arról nincs adat, hogy a terv megépült-e.” |
| `budai-haz` | „Arról nincs adat, hogy a terv megépült-e.” |
| `domus-pellegrini-…` | „A bútorok készítéséről nincs felvétel.” |
| `fuzio-a-tajjal` | „A kivitelezésről nincs felvétel.” |
| `belvarosban-nyugalomban` | „A beépített bútorok készítéséről nincs felvétel.” |
| `fafaragasok` | „Maga a faragás közben nem készült fénykép.” |
| `duna-cruises-hableany` | „Az építésről és a beépítésről nincs felvétel.” |
| `duna-hajok-6-1-kadet` | „Az építés folyamata nincs dokumentálva.” |
| `duna-hajok-6-1-cabin` | „Az építés folyamata nincs dokumentálva.” |
| `bojan-harcos` | „Sem az építésről, sem a hajóról a vízen nincs felvétel.” |
| `jolle-25` | „Az építésről nincs felvétel.” |
| `rivalis-vitorlas-hajo` | „Az építésről és a hajóról a vízen nincs felvétel.” |
| `veteran-motorcsonak` | „A felújítás vagy az építés nincs dokumentálva.” |

**Négy projektnél** (`zirci-apatsag`, `kristaly-etterem`, `csaladi-haz`,
`budai-haz`) a hiány magára a megvalósulásra vonatkozik: a lap kimondja,
hogy **nincs adat arról, megépült-e a terv**. Ha a tulajdonos tudja a
választ, ez a négy mondat lecserélhető tényre — és csak ő cserélheti le.

---

## 4. Az EGYETLEN tartalmi javítás ebben a fázisban

**`meyer-motorcsonak-2`, leírás, utolsó mondat.**

Volt:

> Az ötödik felvétel **az egyetlen műhelybelső az egész archívumban** — több
> hajóval és egy csónakmotorral.

Lett:

> Az ötödik felvétel **az archívum egyetlen olyan képe, amely magát a
> műhelyteret mutatja, nem egy benne álló hajót** — több hajóval és egy
> csónakmotorral.

**Miért.** A régi megfogalmazás **ellentmondott a saját lapjának**: ugyanennek
a projektnek a 04-es képe alt szövege szerint „Egy kész, sötét mahagóni
csónak **a műhelyben**”, és további hat projekt leírása is a műhelyben
készült felvételeket említ (`boesch-640-de-luxe`, `boesch-580`,
`boesch-560-de-luxe`, `arcangeli-super-jolly`, `jegvitorlas`,
`meyer-motorcsonak-1`). Az állítás úgy volt igaz, ahogy a `keszules.json`
mondja ki — „Egyetlen fénykép, ami **magát a műhelyt** mutatja” —, és nem
úgy, ahogy a leírás állította. A javítás **ehhez a saját, pontosabb
megfogalmazáshoz** igazít. Új tényt nem állít, régit nem töröl.

**Megjegyzés a stúdiónak:** `data/forras.json` → `meyer-motorcsonak-2` →
`megjegyzes` mezőjében ugyanaz a pontatlan megfogalmazás áll („Az 05 az
EGYETLEN műhelyfotó az archívumban”). Ez **belső jegyzet, nem publikus**,
ezért nem lett átírva — de ha valaki később szöveget merít belőle, ez a
mondat félrevezet.

---

## 5. Amit szándékosan NEM javítottunk

### 5.1 „Harminc év” a főoldal főcímében

A hero így szól: **„Harminc év, egy műhely, több száz tér.”** — közvetlenül
alatta pedig **„ALAPÍTVA 1991”**. 2026-ban ez **35 év**.

Nem hamis (35 több mint 30), de **elavult**, és a két adat egymás mellett
áll a lap első képernyőjén. **Ügyfélszöveg**, a 7. fázis is így hagyta.

**Döntés a tulajdonosé.** Ha frissíteni akarja, egyetlen helyen kell:
`index.html`, a hero `<h1>`-je. Javasolt változat, ami nem évül el:
**„Több mint harminc év, egy műhely, több száz tér.”**

### 5.2 Nyolc elemű főmenü

Ügyféldöntés a 3. fázistól. Nem lett rövidítve.

### 5.3 Gondolatjel: — és nem –

A magyar helyesírás a gondolatjelre a nagykötőjelet (–) írja elő; a lap
végig **nagy gondolatjelet (—)** használ, kivéve három projektcímet
(`Domus Pellegrini Hotel – Apartmanok`, `Belvárosban – nyugalomban`,
`Bojan – Harcos`), ahol a – az ügyfél saját címírása.

**Mérve:** a forrásban (HTML, CSS, JS, JSON; a build kimenete és a
dokumentáció nélkül) **695 db —** és **47 db –**, és a – szinte mindenütt
tulajdonnévben vagy tartományban áll. Vagyis a lap **következetes
önmagához**; ez házirendi döntés, nem hiba. Nem nyúltunk hozzá. Ha a
tulajdonos szigorú AkH-t kér, az **egyetlen, gépi csere**, de mind a 44
lapot érinti, és a 8. fázisban nem volt szabad futtatni.

### 5.4 A „legteljesebb folyamatdokumentáció” állítás

`boesch-640-de-luxe` leírása így nevezi magát, és a `keszules.json` így: „Az
archívum **egyetlen** munkája, amit elejétől a végéig lefényképeztek.”

**Ellenőrizve, és megáll.** A 19 alt szöveg tételesen: bontás (01) → csupasz
test és bordázat (02–10) → felépítményváz (11) → csiszolt nyers felület (12)
→ lakkozás, fényezőfülke (13–14) → motor beépítés előtt (15) → kész,
kárpitozott csónak (16–19). A többi hajónál a lánc szakad: a `boesch-580`
nem indul a bontásnál, az `arcangeli-super-jolly` sem, a
`boesch-560-de-luxe` felületkezelése hiányzik.

**Egy felszíni ellentmondás marad, és tudatosan:** a flotta vízvonal-indexe
a `boesch-580`-nál **négy** állomást mutat (`vaz · felulet · belso · vizen`),
a `boesch-640`-nél **hármat**. Aki a két lapot egymás mellé teszi, joggal
kérdezheti, hogy akkor melyik a teljesebb. A válasz: az `allomasok` mező a
**képanyag lefedettségéről** szól, nem a lánc folytonosságáról — a 640-nél a
lánc szakadatlan, az 580-nál a víz állomása is megvan, de a bontás nincs
meg. **Nem javítottuk**, mert mindkét állítás igaz a saját értelmében, és a
mező jelentését a `flotta.json` sémája kimondja.

### 5.5 Az „Idő: Nappal” felirat éjszakai képkockán

A főoldal 10. keretén a mérő „Nappal”-t mutat, miközben már látszik a
11. keret éjszakai képe. **Nem hiba: ez a küszöb.** A belépő tér a
900 ms-os mozdulat 34%-ánál válik láthatóvá, a kilépő 94%-nál tűnik el, a
mérő pedig a **megérkezéskor** vált — 54 ms-mal a régi képkocka eltűnése
után. A felirat a hellyel együtt lép, nem a képpel. Ellenőrizve
`kuszob.js` időzítéséből és a lapon is. Nem nyúltunk hozzá.

---

## 6. HABLEÁNY — a cím ellenőrzése

**A valódi cím `/referenciak/duna-cruises-hableany/`, és mindenütt ez áll.**

| Hol | Ellenőrizve | Eredmény |
|---|---|---|
| Belső hivatkozások | mind a 44 lap, gépi | csak `duna-cruises-hableany` |
| `sitemap.xml` | `<loc>` sor | `…/referenciak/duna-cruises-hableany/` |
| `canonical` | a lap fejlécéből | egyezik a valódi címmel |
| `og:url` | a lap fejlécéből | egyezik a canonicallal |
| Morzsa | a lap jelöléséből | `Referenciák → Duna Cruises HABLEÁNY` |
| Főoldal enfilád (9., 10., 11., 12. keret) | `terek.json` | `duna-cruises-hableany` |
| Flotta vízvonal-index | `flotta.json` | `duna-cruises-hableany` |
| Alaprajz (Hajó szárny) | build kimenet | `/referenciak/duna-cruises-hableany/` |
| Kapcsolódó projektek | build kimenet | `../duna-cruises-hableany/` |
| Böngészőelőzmény (nézőpont-horgony) | élő lapon | `#orr`, `#atjaro`, … a valódi cím alatt |

**`/referenciak/hableany/` a repóban és a kimenetben egyaránt 0 találat.**
A mély hivatkozások érvényesek maradnak.

---

## 7. JOGI ÁLLAPOT — ez a rész a tulajdonosé

### 7.1 Hotel Domus Collis — **NYITOTT, ÉS EZ A LEGSÚLYOSABB TÉTEL**

**A tényállás, ahogy a `data/forras.json` rögzíti:**

- A húsz kép alt szövege eredetileg **Facebook CDN fájlnév** volt (0. fázis §6).
  Ez közösségi médiából való átvételre és korábbi újratömörítésre utal.
- **A fényképész személye ismeretlen.**
- **Felhasználási jog írásban nincs.**
- Jelölés: `jogok: "tisztazando"`, `allapot: "NEEDS_RIGHTS"`.

**Hol jelenik meg ma, éles állapotban:**

| Felület | Mennyi |
|---|---|
| `/referenciak/hotel-domus-collis/` — bejárható tér (szint 1) | 5 nézőpont, 20 kép |
| Főoldal enfilád | **5 keret a 13-ból** (01, 02, 06, 07, 08) |
| Alaprajz, Hotel szárny | 1 cella |
| `sitemap.xml` | 1 cím |

**A 8. fázis ehhez NEM tett hozzá semmit.** Nem került új Domus Collis
felhasználás sehová, és a meglévő URL nem változott.

**A tulajdonos négy lehetősége, következményekkel:**

1. **Írásos engedélyt szerez a fényképésztől / a szállodától.**
   → Nincs teendő a kódban. `forras.json`-ban `jogok: "rendezett"`, és a
   `NEEDS_RIGHTS` jelzés lekerül. **Ez a kívánatos kimenet.**

2. **Élesít engedély nélkül**, vállalva a kockázatot.
   → Nincs teendő a kódban. A kockázat: szerzői jogi igény a fényképész
   részéről. A jelenlegi `noindex` állapot ezt nem csökkenti érdemben.

3. **Kiveszi a projektet.**
   → `data/projektek.json`-ban `allapot: "vazlat"` (nem `publikalt`).
   A build ezután **magától** kihagyja a lapról, a sitemapből és az
   alaprajzból. **De:** a főoldal enfiládjának 5 keretét és a szint-1 teret
   a `data/terek.json`-ból is ki kell venni, különben a build megáll.
   Az enfilád 13-ról 8 keretre rövidül — **a nyitány érezhetően szegényebb
   lesz**, és a Hotel szárny háromról két projektre fogy.

4. **Csak a főoldalról veszi ki, a projektlapot meghagyja.**
   → Csak `terek.json`, a `$fooldal.keretek` 5 eleme. A projektlap és a
   bejárható tér marad.

**Ez nem műszaki döntés, és a 8. fázis nem hozta meg helyette.**

### 7.2 Személyiségi jog — két projekt

| Projekt | Kép | Mi látszik | Állapot |
|---|---|---|---|
| `szent-laszlo-latogatokozpont-fa-kapuja` | 06, 08 | felismerhető emberek munka közben, névtelenül, a saját beépítésükről | `engedelyre-var` — a tulajdonos megerősítése hiányzik (5. fázis §22.5) |
| `vatikani-diszdoboz` | 01, 02 | csoportkép az átadásról, felismerhető emberekkel | `engedelyre-var` — szerkesztői okból már ma sincs a KÉSZÜLÉS lapján (5. fázis §1.6) |

**Teendő:** a tulajdonos erősítse meg, hogy a négy felvétel közölhető.
**Bármely jövőbeli fotózásnál minden felismerhető személyre modellszerződés
kell** — ez a KÉSZÜLÉS lapjának bővítésénél azonnal esedékes lesz.

### 7.3 Vízjel és archív eredet — 18 projekt

**Nem jogi kockázat**, mert a vízjel a sajátunk. Minőségi kérdés:

- **`Duna Enterior` vízjel:** `fuzio-a-tajjal`, `zirci-apatsag`,
  `csaladi-haz`, `budai-haz`, `belvarosban-nyugalomban`,
  `domus-pellegrini-hotel-apartmanok` — 6 projekt.
- **`Duna HAJÓK` vízjel:** mind a 12 archív hajó.
- **Beégetett dátumbélyeg:** `boesch-560-de-luxe` (`'03 4 23`),
  `meyer-motorcsonak-2` (`'04 3.22`), `volvo-penta-motorcsonak` (`'03 12 18`).
- **Beégetett jogi felirat:** `csaladi-haz` mind a 14 képén — „A látványterven
  megjelenített termékek nem minden esetben egyeznek meg a költségvetésben
  szereplőkkel.” A leírás **ki is mondja**, hogy ez a felirat ott van.

**A lap ezt nem takarja el és nem retusálja.** Ez szerkesztői döntés a
0. fázis óta, és a 8. fázis megerősíti: a vízjel az archívum kora, nem hiba.

### 7.4 Látványterv ≠ fénykép — négy projekt

`zirci-apatsag`, `kristaly-etterem`, `csaladi-haz`, `budai-haz`
**100%-ban látványterv**. A 7. fázis óta a lap ezt **szóhasználatban is**
elválasztja (`kepSzavak()`: „kép” és nem „fotó”), és mind a négy leírás
első két mondatában kimondja. Ezek a projektek a KÉSZÜLÉS lapján
**szabály szerint nem szerepelhetnek** (5. fázis §1.5).

---

## 8. Archívkép-fenntartások

**Öt kritikus kép a felbontási minimum alatt**, mind az öt névre szólóan
elfogadva a 6–7. fázisban, és mind az öt megnevezi a fényképet, ami
leváltaná. Legfontosabb:

| Kép | Miért számít |
|---|---|
| `duna-cruises-hableany/01` (1,81 MP) | **a Flotta LCP képkockája.** AVIF-ként q36-on is **197 KB** — egyedül ez viszi a Flottát a mobil 300 KB-os keret fölé. Jobb mester ~100 KB-ot ad vissza. |
| `boesch-640-de-luxe` sorozat (0,31–0,85 MP) | a hajóépítés legjobb folyamatdokumentációja, és a leggyengébb felbontása |
| `meyer-motorcsonak-2/05` (0,75 MP, 2004) | a KÉSZÜLÉS zárófényképe — **az archívum egyetlen műhelytér-képe** |
| `duna-hajok-6-1-kadet/06` | oldalaránya 2,40, a 0,42–2,2 sávon kívül — az elrendezés levágja |

---

## 9. Jóváhagyásra váró lapok

| Lap | Mi vár jóváhagyásra |
|---|---|
| **mind a 30 projektlap** | a leírás mint a fényképek olvasata; a tulajdonos által hozzátehető dátum, megrendelő, anyag, helyszín |
| `/referenciak/hotel-domus-collis/` | **felhasználási jog** (§7.1) |
| `/referenciak/szent-laszlo-latogatokozpont-fa-kapuja/` | személyiségi jog, 06 + 08 |
| `/referenciak/vatikani-diszdoboz/` | személyiségi jog, 01 + 02 |
| `/` (főoldal) | „Harminc év” → 35 (§5.1); 5 Domus Collis keret sorsa (§7.1) |
| `/rolunk.html`, `/kapcsolat.html`, `/impresszum.html` | cégadatok, nevek, beosztások, telefonszámok — ügyfélszöveg, nem ellenőriztük |
| `/palyazatok.html` | KTK 2020 kötelező tartalom, szó szerint a régi lapról — nem rövidíthető, nem szerkesztettük |
| `/adatkezelesi-tajekoztato.html`, `/sutik.html` | jogi szöveg — nem ellenőriztük |

---

## 10. Összegzés

**TECHNICALLY READY** — a tartalom gépi és tételes ellenőrzésen átment;
egyetlen ellentmondás volt, javítva (§4); a HABLEÁNY-cím mindenütt helyes;
a build és az audit hibátlan.

**OWNER APPROVAL PENDING** — sorrendben:

1. **Hotel Domus Collis felhasználási joga** (§7.1) — a négy lehetőség
   következményeivel együtt leírva. Az egyetlen tétel, aminek **jogi** tétje van.
2. **A harminc leírás elolvasása** (§2, §3) — különösen a négy „nincs adat
   arról, hogy megépült-e” mondat (§3).
3. **Két projekt személyiségi joga** (§7.2).
4. **„Harminc év” → 35** (§5.1) — egy sor a főoldalon.

Egyik sem akadályozza a műszaki élesítést. Az 1. pont **üzleti kockázat**,
és a tulajdonos vállalja vagy elhárítja.

---

*Kapcsolódó: [PHASE-8-FINAL-POLISH.md](PHASE-8-FINAL-POLISH.md) ·
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) ·
[PHASE-7-REAL-CONTENT.md](PHASE-7-REAL-CONTENT.md) · [TARTALOM.md](TARTALOM.md)*
