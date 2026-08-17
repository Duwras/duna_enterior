# DUNA — TARTALOMMÁTRIX

**Generált fájl. Ne szerkeszd kézzel** — a `npm run tartalom` felülírja.
Forrás: `data/projektek.json`, `data/terek.json`, `data/flotta.json`,
`data/keszules.json`, `data/forras.json` + a mesterképek megmérve.
Gépi változat: `docs/tartalom.json`.

Készült: 2026-08-16

---

## 1. Összegzés

| | |
|---|---|
| Mesterkép összesen | **371** |
| Ebből valamilyen szerepben | 88 |
| Csak galériában | 283 |
| **Kritikus szerepben** | **26** |
| Kritikus és küszöb alatti | 5 — mind 5 névre szóló felmentéssel |
| Küszöb alatt (bármilyen szerep) | 225 |
| Ajánlott (≥ 3 MP) fölött | 5 |
| Mélységkritikus fotózásra alkalmas (≥ 3000 px) | **0** |
| Megírt képleírás | 371 / 371 |
| Gépi címke képleírás helyett | **0** |
| Projekt szöveg (`leiras`) nélkül | **0 / 30** |
| Hiányzó készülés-állomás | 8 |

### Állapot szerint

| ÁLLAPOT | DB |
| --- | --- |
| ARCHIVE_ONLY | 181 |
| READY | 117 |
| NEEDS_MASTER | 40 |
| NEEDS_RIGHTS | 33 |


---

## 2. Kritikus szerepű képek

Ezekre a build HIBÁVAL áll meg, ha küszöb alá esnek és nincs névre szóló
felmentés a `data/forras.json`-ban. Küszöb: **1.5 MP /
1400 px**.

| KÉP | FELBONTÁS | MP | SZEREP | KÜSZÖB | ÁLLAPOT |
| --- | --- | --- | --- | --- | --- |
| jegvitorlas/05.jpg | 600×800 | 0.48 | flotta-nyitas | felmentve | NEEDS_MASTER |
| rivalis-vitorlas-hajo/06.jpg | 669×800 | 0.54 | flotta-borito, flotta-nyitas | felmentve | NEEDS_MASTER |
| meyer-motorcsonak-2/05.jpg | 1029×730 | 0.75 | keszules-muhely | felmentve | NEEDS_MASTER |
| boesch-640-de-luxe/05.jpg | 1024×768 | 0.79 | flotta-nyitas | felmentve | NEEDS_MASTER |
| boesch-640-de-luxe/13.jpg | 1067×800 | 0.85 | flotta-nyitas, keszules-lemez | felmentve | NEEDS_MASTER |
| hotel-domus-collis/04.jpg | 1500×1000 | 1.5 | fooldal-jelenet, szint1-nezopont | megfelel | NEEDS_RIGHTS |
| hotel-domus-collis/07.jpg | 1500×1000 | 1.5 | fooldal-jelenet, szint1-nezopont | megfelel | NEEDS_RIGHTS |
| hotel-domus-collis/14.jpg | 1500×1000 | 1.5 | fooldal-jelenet, szint1-nezopont | megfelel | NEEDS_RIGHTS |
| hotel-domus-collis/20.jpg | 1500×1000 | 1.5 | fooldal-jelenet, szint1-nezopont | megfelel | NEEDS_RIGHTS |
| fafaragasok/03.jpg | 1448×1086 | 1.57 | keszules-nyitas | megfelel | READY |
| fafaragasok/09.jpg | 1448×1086 | 1.57 | fooldal-metszet, keszules-nyitas | megfelel | READY |
| fafaragasok/10.jpg | 1448×1086 | 1.57 | fooldal-jelenet, keszules-nyitas | megfelel | READY |
| duna-hajok-6-1-cabin/02.jpg | 1800×945 | 1.7 | fooldal-jelenet | megfelel | READY |
| duna-cruises-hableany/17.jpg | 1600×1070 | 1.71 | fooldal-jelenet, szint1-nezopont | megfelel | READY |
| duna-cruises-hableany/20.jpg | 1600×1066 | 1.71 | fooldal-jelenet, szint1-nezopont | megfelel | READY |
| duna-cruises-hableany/01.jpg | 1600×1134 | 1.81 | flotta-borito, flotta-nyitas, projekt-borito | megfelel | READY |
| duna-hajok-6-1-cabin/03.jpg | 1800×1013 | 1.82 | flotta-borito, flotta-nyitas | megfelel | READY |
| duna-cruises-hableany/03.jpg | 1600×1200 | 1.92 | fooldal-jelenet, szint1-nezopont | megfelel | READY |
| duna-cruises-hableany/05.jpg | 1600×1200 | 1.92 | fooldal-jelenet, szint1-nezopont | megfelel | READY |
| duna-cruises-hableany/13.jpg | 1600×1200 | 1.92 | szint1-nezopont | megfelel | READY |
| bodajki-vadaszkastely/02.jpg | 1800×1200 | 2.16 | fooldal-jelenet, szint1-nezopont | megfelel | READY |
| bodajki-vadaszkastely/05.jpg | 1800×1200 | 2.16 | szint1-nezopont | megfelel | READY |
| bodajki-vadaszkastely/10.jpg | 1800×1200 | 2.16 | szint1-nezopont | megfelel | READY |
| szent-laszlo-latogatokozpont-fa-kapuja/01.jpg | 1350×1800 | 2.43 | fooldal-jelenet, keszules-lemez, projekt-borito | megfelel | NEEDS_RIGHTS |
| hotel-domus-collis/02.jpg | 1800×1350 | 2.43 | fooldal-jelenet, szint1-nezopont | megfelel | NEEDS_RIGHTS |
| duna-hajok-6-1-cabin/23.jpg | 1800×1350 | 2.43 | fooldal-jelenet | megfelel | READY |


---

## 3. Projektenként

| PROJEKT | KÉP | MP-tartomány | szerepben | megírt alt | szöveg | jog | állapot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| arcangeli-super-jolly | 13 | 0.31–0.85 | 2 | 13 / 13 | van | saját | 13 tétel |
| belvarosban-nyugalomban | 15 | 0.43–0.99 | 1 | 15 / 15 | van | saját | 15 tétel |
| bodajki-vadaszkastely | 10 | 2.16–2.16 | 6 | 10 / 10 | van | saját | rendben |
| boesch-560-de-luxe | 17 | 0.27–0.85 | 2 | 17 / 17 | van | saját | 17 tétel |
| boesch-580 | 18 | 0.31–0.79 | 2 | 18 / 18 | van | saját | 18 tétel |
| boesch-640-de-luxe | 19 | 0.31–0.85 | 9 | 19 / 19 | van | saját | 19 tétel |
| bojan-harcos | 3 | 0.48–0.85 | 2 | 3 / 3 | van | saját | 3 tétel |
| budai-haz | 12 | 1.14–1.14 | 1 | 12 / 12 | van | saját | 12 tétel |
| csaladi-haz | 14 | 1.14–1.14 | 1 | 14 / 14 | van | saját | 14 tétel |
| domus-pellegrini-hotel-apartmanok | 5 | 0.96–0.96 | 1 | 5 / 5 | van | saját | 5 tétel |
| duna-cruises-hableany | 23 | 1.33–2.43 | 8 | 23 / 23 | van | saját | rendben |
| duna-hajok-6-1-cabin | 26 | 1.62–2.43 | 4 | 26 / 26 | van | saját | rendben |
| duna-hajok-6-1-kadet | 11 | 1.35–2.56 | 1 | 11 / 11 | van | saját | rendben |
| fafaragasok | 10 | 1.57–1.57 | 5 | 10 / 10 | van | saját | rendben |
| fuzio-a-tajjal | 20 | 0.27–1.05 | 1 | 20 / 20 | van | saját | 20 tétel |
| garzon-plaza-hotel | 20 | 0.67–2.43 | 7 | 20 / 20 | van | saját | 1 tétel |
| hotel-domus-collis | 20 | 1.50–2.43 | 8 | 20 / 20 | van | **tisztazando** | 20 tétel |
| jegvitorlas | 7 | 0.48–0.85 | 3 | 7 / 7 | van | saját | 7 tétel |
| jolle-25 | 10 | 0.39–0.85 | 2 | 10 / 10 | van | saját | 10 tétel |
| kristaly-etterem | 10 | 1.14–1.14 | 1 | 10 / 10 | van | saját | 10 tétel |
| mercedes-plato | 10 | 1.71–2.05 | 1 | 10 / 10 | van | saját | rendben |
| meyer-motorcsonak-1 | 12 | 0.45–0.85 | 2 | 12 / 12 | van | saját | 12 tétel |
| meyer-motorcsonak-2 | 7 | 0.74–0.85 | 3 | 7 / 7 | van | saját | 7 tétel |
| ottevenyi-kastely | 8 | 1.57–1.57 | 1 | 8 / 8 | van | saját | rendben |
| rivalis-vitorlas-hajo | 8 | 0.46–0.78 | 2 | 8 / 8 | van | saját | 8 tétel |
| szent-laszlo-latogatokozpont-fa-kapuja | 8 | 2.43–3.15 | 4 | 8 / 8 | van | saját | 8 tétel |
| vatikani-diszdoboz | 5 | 2.16–2.47 | 4 | 5 / 5 | van | saját | 5 tétel |
| veteran-motorcsonak | 8 | 0.85–0.85 | 1 | 8 / 8 | van | saját | 8 tétel |
| volvo-penta-motorcsonak | 12 | 0.31–0.96 | 2 | 12 / 12 | van | saját | 12 tétel |
| zirci-apatsag | 10 | 0.64–0.64 | 1 | 10 / 10 | van | saját | 10 tétel |


---

## 4. Hiányzó készülés-állomások

Amit a `data/keszules.json` sorozatai NEM tudnak megmutatni. Nem hiba —
a fejezet ki is mondja. Egy műhelyfotózás zárja őket.

| SOROZAT | PROJEKT | HIÁNYZÓ ÁLLOMÁS | ÁLLAPOT |
| --- | --- | --- | --- |
| a-hajotest | boesch-640-de-luxe | elmeny | NEEDS_PHOTOGRAPHY |
| a-kapu | szent-laszlo-latogatokozpont-fa-kapuja | anyag | NEEDS_PHOTOGRAPHY |
| a-kapu | szent-laszlo-latogatokozpont-fa-kapuja | elmeny | NEEDS_PHOTOGRAPHY |
| a-szek | garzon-plaza-hotel | kez | NEEDS_PHOTOGRAPHY |
| a-szek | garzon-plaza-hotel | elmeny | NEEDS_PHOTOGRAPHY |
| a-doboz | vatikani-diszdoboz | kez | NEEDS_PHOTOGRAPHY |
| a-doboz | vatikani-diszdoboz | ter | NEEDS_PHOTOGRAPHY |
| a-doboz | vatikani-diszdoboz | elmeny | NEEDS_PHOTOGRAPHY |


---

## 5. Műhelyfelvétel-típusok

A rendszer tizenkét típust ismer föl. Egyik sem KÖTELEZŐ — a hiányt jelenti,
nem bünteti. A felvételi leírás a `docs/PHASE-5-MAKING.md` §15-ben áll.

| TÍPUS | MEGVAN |
| --- | --- |
| WORKSHOP_WIDE | 1 |
| WORKBENCH | 0 |
| HAND_MATERIAL | 0 |
| TOOL_MATERIAL | 0 |
| MATERIAL_DETAIL | 0 |
| JOINERY | 0 |
| CONSTRUCTION | 0 |
| OBJECT_PROGRESS | 0 |
| FINISHED_OBJECT | 0 |
| OBJECT_SPACE | 0 |
| PEOPLE_WORKING | 0 |
| DAY_NIGHT | 0 |


---

## 6. Jogi állapot

| PROJEKT | JOG | VÍZJEL | DÁTUMBÉLYEG | SZEMÉLY | MEGJEGYZÉS |
| --- | --- | --- | --- | --- | --- |
| hotel-domus-collis | tisztazando | — | — | — | A húsz alt szöveg Facebook CDN fájlnév volt (PHASE-0 §6). Ez közösségi médiából való átvételt és korábbi újrat |
| fuzio-a-tajjal | sajat-archivum | Duna Enterior | — | — | A legtöbb képkockán látszik a 'Duna Enterior' vízjel (PHASE-0 §329). 0.69 MP átlag. Teljes szélességben nem ál |
| zirci-apatsag | sajat-archivum | Duna Enterior | — | — | 100% látványterv, vízjellel, 800x800-as vágásban. Nem fénykép — a készülés lapján ezért nem szerepelhet (PHASE |
| csaladi-haz | sajat-archivum | Duna Enterior | — | — | PHASE-7-ben mind a 14 kép megnézve: 100% látványterv, nem fénykép. A vízjelen felül MINDEGYIKEN ott a beégetet |
| budai-haz | sajat-archivum | Duna Enterior | — | — | PHASE-7-ben mind a 12 kép megnézve: 100% látványterv, nem fénykép, vízjellel. A PHASE-6 §1.4 CGI-listája ezt a |
| belvarosban-nyugalomban | sajat-archivum | Duna Enterior | — | — | PHASE-7: mind a 15 fényképen látszik a 'Duna Enterior' vízjel. Korábban nem volt rögzítve. |
| domus-pellegrini-hotel-apartmanok | sajat-archivum | Duna Enterior | — | — | PHASE-7: mind az 5 fényképen látszik a 'Duna Enterior' vízjel. Korábban nem volt rögzítve. |
| szent-laszlo-latogatokozpont-fa-kapuja | sajat-archivum | — | — | engedelyre-var | A 06 és 08 felismerhető embereket mutat munka közben, névtelenül, a saját beépítésükről. A tulajdonos megerősí |
| vatikani-diszdoboz | sajat-archivum | — | — | engedelyre-var | A 01 és 02 az átadásról készült csoportkép, felismerhető emberekkel. Szerkesztői okból kizárva a készülés lapj |
| boesch-640-de-luxe | sajat-archivum | Duna HAJÓK | — | — | 0.31-0.85 MP. A hajóépítés legjobb folyamatdokumentációja, és a leggyengébb felbontása. |
| boesch-580 | sajat-archivum | Duna HAJÓK | — | — |  |
| boesch-560-de-luxe | sajat-archivum | Duna HAJÓK | '03 4 23 | — |  |
| meyer-motorcsonak-1 | sajat-archivum | Duna HAJÓK | — | — |  |
| meyer-motorcsonak-2 | sajat-archivum | Duna HAJÓK | '04 3.22 | — | Az 05 az EGYETLEN műhelyfotó az archívumban: 0.75 MP, 2004, beégetett dátummal. A készülés lapjának záróképe,  |
| volvo-penta-motorcsonak | sajat-archivum | Duna HAJÓK | '03 12 18 | — |  |
| jolle-25 | sajat-archivum | Duna HAJÓK | — | — |  |
| arcangeli-super-jolly | sajat-archivum | Duna HAJÓK | — | — |  |
| jegvitorlas | sajat-archivum | Duna HAJÓK | — | — |  |
| rivalis-vitorlas-hajo | sajat-archivum | Duna HAJÓK | — | — |  |
| veteran-motorcsonak | sajat-archivum | Duna HAJÓK | — | — |  |
| bojan-harcos | sajat-archivum | Duna HAJÓK | — | — | Három fénykép, nulla állomás. A flottában van, mert egy valódi DUNA hajó kihagyása a szebb index kedvéért voln |

