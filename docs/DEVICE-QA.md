# VALÓS KÉSZÜLÉKES ELLENŐRZÉS — iPhone és Android

**DUNA — THE LIVING INTERIOR · launch kapu**
Készült: 2026-08-16.

**MINDEN TÉTEL ÁLLAPOTA MA: `NOT TESTED`.**

Ez a lap **nem szimulálható**. A 8. fázis a `pointer: coarse` ágat valódi
érintőemulációval, 375 / 390 / 412 px-en végigmérte — **ez nem váltja ki egy
iPhone és egy Android kézbevételét**, és nem is állítjuk, hogy kiváltaná.
Amit az emuláció nem tud: a valódi ujj mérete, a Safari és a Chrome
címsávjának mozgása görgetéskor, a `100vh` és a `dvh` viselkedése,
a kompozitor terhelése valódi mobil GPU-n, a visszalapozó ujjmozdulat
ütközése a vízszintes kameraléptetéssel, és a rendszerszintű
„mozgás csökkentése” kapcsoló.

---

## KITÖLTÉSI SZABÁLY

Három érték, és **nincs negyedik**:

| Jel | Jelentés |
|---|---|
| `PASS` | **kézbe véve, megnézve, jó.** |
| `FAIL` | kézbe véve, megnézve, **nem jó** — a „mit láttam” oszlop kötelező |
| `NOT TESTED` | nem lett kézbe véve |

**Kitalált eredményt beírni tilos.** Egy üresen hagyott `NOT TESTED` őszintébb
és hasznosabb, mint egy feltételezett `PASS`. Ha a tétel az adott készüléken
nem értelmezhető (pl. nincs bekapcsolva a mozgáscsökkentés), az
`NOT TESTED` + megjegyzés, **nem** `PASS`.

---

## A KÉT KÉSZÜLÉK

Töltse ki a mérés előtt:

```
iPHONE
  modell:  ______________________
  iOS:     ______________________
  böngésző: Safari  /  ______________
  hálózat: Wi-Fi  /  mobil
  dátum:   ______________________

ANDROID
  modell:  ______________________
  Android: ______________________
  böngésző: Chrome  /  ______________
  hálózat: Wi-Fi  /  mobil
  dátum:   ______________________
```

**Cím:** amíg `sajatDomainEl` `false`, a **pages.dev** cím mérendő.
Átállás után **újra kell futtatni** az éles domainen.

```
Mért cím: ______________________________________________
```

---

## 1. FŐOLDAL — `/`

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 1.1 | Betölt, a hero szedése olvasható, nem esik szét | NOT TESTED | NOT TESTED | |
| 1.2 | **Nincs vízszintes görgetés** — húzza oldalra a lapot | NOT TESTED | NOT TESTED | |
| 1.3 | Az „Alaprajz” és az „Ajánlatkérés” gomb **egészben** látszik, nem lóg ki | NOT TESTED | NOT TESTED | |
| 1.4 | A számadatok (1991 · 1200 · 30 · 371) megjelennek | NOT TESTED | NOT TESTED | |
| 1.5 | Görgetéskor a címsáv mozgása **nem vágja el** a képkockát | NOT TESTED | NOT TESTED | |
| 1.6 | A sütisáv megjelenik, elintézhető, és **nem takar vezérlőt** | NOT TESTED | NOT TESTED | |

## 2. AZ ELSŐ KÜSZÖB — `/`, 1. → 2. keret

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 2.1 | Az első görgetésre **átmegy egy ajtón** — a következő tér a nyílásban jelenik meg, nem fölötte | NOT TESTED | NOT TESTED | |
| 2.2 | A mozdulat **nem akad**, nincs képkockaesés | NOT TESTED | NOT TESTED | |
| 2.3 | Visszafelé görgetve **ugyanazon az ajtón** lép ki | NOT TESTED | NOT TESTED | |
| 2.4 | Gyors, ideges görgetésnél sem ragad be félúton | NOT TESTED | NOT TESTED | |
| 2.5 | Végig a 13 kereten: **egyik sem marad üresen** (lusta képbetöltés) | NOT TESTED | NOT TESTED | |

## 3. HABLEÁNY — `/referenciak/duna-cruises-hableany/`

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 3.1 | A cím **megnyílik**, a bejárható tér áll | NOT TESTED | NOT TESTED | |
| 3.2 | **Vízszintes ujjmozdulat lépteti a kameraállásokat** | NOT TESTED | NOT TESTED | |
| 3.3 | A vízszintes mozdulat **nem indítja el** a böngésző visszalapozását (iOS Safari élgesztus!) | NOT TESTED | NOT TESTED | |
| 3.4 | **Függőleges görgetés = enfilád**, nem keveredik a vízszintessel | NOT TESTED | NOT TESTED | |
| 3.5 | A nézőpontjelző sor **teljes egészében a képmezőn belül** van, minden jel elérhető ujjal | NOT TESTED | NOT TESTED | |
| 3.6 | Mély hivatkozás: `…/duna-cruises-hableany/#atjaro` **a helyes képkockára áll** betöltéskor | NOT TESTED | NOT TESTED | |
| 3.7 | A tér alatti projektdokumentum végiggörgethető, a galéria bélyegképei megnyílnak | NOT TESTED | NOT TESTED | |

## 4. FLOTTA — `/flotta.html`

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 4.1 | **Betöltési idő mobilhálózaton** — ez a legnehezebb lap (345,5 KB asztali, ~330 KB mobil) | NOT TESTED | NOT TESTED | |
| 4.2 | A nyitó képkocka (`duna-cruises-hableany/01`, 197 KB AVIF) **mennyi idő alatt jelenik meg** | NOT TESTED | NOT TESTED | |
| 4.3 | A **vízvonal-index** olvasható, nem csúszik szét | NOT TESTED | NOT TESTED | |
| 4.4 | A műszaki sáv (hányadik állomás a hatból) látszik | NOT TESTED | NOT TESTED | |
| 4.5 | Mind a 15 hajó elérhető, a rács nem vág le cellát | NOT TESTED | NOT TESTED | |
| 4.6 | Nincs vízszintes görgetés | NOT TESTED | NOT TESTED | |

**Írja ide a mért időt** (stopper is elég, a látott betöltésre):

```
iPhone:  ______ mp   (hálózat: ____________)
Android: ______ mp   (hálózat: ____________)
```

## 5. A KÉSZÜLÉS — `/keszules.html`

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 5.1 | A három sorozat végiggörgethető, a lépések sorrendben állnak | NOT TESTED | NOT TESTED | |
| 5.2 | A Boesch 640 lánca (bontás → váz → felület → motor → kész) végigmegy | NOT TESTED | NOT TESTED | |
| 5.3 | A záró műhelyfénykép és a **kimondott hiány** szövege látszik | NOT TESTED | NOT TESTED | |
| 5.4 | A képaláírások olvashatók, nem takarják a képet | NOT TESTED | NOT TESTED | |

## 6. ALAPRAJZ — `/alaprajz.html` és `/#alaprajz`

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 6.1 | Az önálló lap (`/alaprajz.html`) betölt, mind a 30 cella elérhető | NOT TESTED | NOT TESTED | |
| 6.2 | A **fedőréteg** (`/#alaprajz`) a KAPU mozdulaton át jön elő | NOT TESTED | NOT TESTED | |
| 6.3 | Nyitott fedőréteg alatt **a fejléc nem látszik** | NOT TESTED | NOT TESTED | |
| 6.4 | A szűrők (Mind / Hotel / Kastély / …) működnek, és **ujjal eltalálhatók** | NOT TESTED | NOT TESTED | |
| 6.5 | A háttér **nem görög** a nyitott fedőréteg alatt | NOT TESTED | NOT TESTED | |
| 6.6 | Bezárás után a cím **kitisztul** (`#alaprajz` eltűnik) | NOT TESTED | NOT TESTED | |
| 6.7 | Mély hivatkozás: `/#alaprajz` **nyitva** töltődik be | NOT TESTED | NOT TESTED | |

## 7. PROJEKTLAP — `/referenciak/boesch-640-de-luxe/`

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 7.1 | Betölt, a leírás olvasható | NOT TESTED | NOT TESTED | |
| 7.2 | A galéria bélyegképei megnyitják a nagy képet | NOT TESTED | NOT TESTED | |
| 7.3 | A morzsa (Referenciák → …) működik | NOT TESTED | NOT TESTED | |
| 7.4 | A kapcsolódó projektek elérhetők | NOT TESTED | NOT TESTED | |
| 7.5 | Nincs vízszintes görgetés | NOT TESTED | NOT TESTED | |

## 8. PÁRBESZÉDABLAKOK

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 8.1 | **Adatlap** megnyílik egy bejárható téren, és **bezárható** | NOT TESTED | NOT TESTED | |
| 8.2 | Nyitott adatlap alatt a háttér nem görög | NOT TESTED | NOT TESTED | |
| 8.3 | Az alaprajz fedőréteg bezáró gombja **44 px magas**, ujjal eltalálható | NOT TESTED | NOT TESTED | |
| 8.4 | A sütisáv elfogadható és elutasítható, és **utána nem jön vissza** | NOT TESTED | NOT TESTED | |
| 8.5 | Külső billentyűzettel (ha van): `Esc` zár | NOT TESTED | NOT TESTED | |

## 9. VISSZA NAVIGÁCIÓ

**Ez a legkényesebb tétel mobilon.** A lap `pushState`-et használ a szándékos
váltásokra és `replaceState`-et a görgetésre — a cél az, hogy a vissza gomb
**ne kérjen tíz visszalépést**.

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 9.1 | Főoldal → projektlap → **vissza** = főoldal, **egy** lépésben | NOT TESTED | NOT TESTED | |
| 9.2 | Végiggörgetve a 13 kereten, majd **vissza** — hány lépés kell? | NOT TESTED | NOT TESTED | |
| 9.3 | Bejárható téren 5 nézőpontot végigléptetve, majd **vissza** — hány lépés? | NOT TESTED | NOT TESTED | |
| 9.4 | Nyitott alaprajz → **vissza** = bezárja, nem hagyja el a lapot | NOT TESTED | NOT TESTED | |
| 9.5 | **Android rendszerszintű vissza** (gesztus vagy gomb) ugyanígy viselkedik | NOT TESTED | NOT TESTED | |
| 9.6 | iOS **él-húzás visszafelé** nem ütközik a vízszintes kameraléptetéssel | NOT TESTED | NOT TESTED | |

**Írja ide a lépésszámot:**

```
9.2  iPhone: ____ lépés    Android: ____ lépés
9.3  iPhone: ____ lépés    Android: ____ lépés
```

## 10. VÍZSZINTES KAMERAMOZDULAT

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 10.1 | Balra/jobbra húzás lépteti a kameraállást — **HABLEÁNY** | NOT TESTED | NOT TESTED | |
| 10.2 | Ugyanez — **Hotel Domus Collis** | NOT TESTED | NOT TESTED | |
| 10.3 | Ugyanez — **Bodajki Vadászkastély** | NOT TESTED | NOT TESTED | |
| 10.4 | A mozdulat **nem nyeli el** a függőleges görgetést | NOT TESTED | NOT TESTED | |
| 10.5 | Az utolsó nézőpont után **nem ragad be** | NOT TESTED | NOT TESTED | |

## 11. FÜGGŐLEGES GÖRGETÉS

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 11.1 | A görgetés végig **sima**, nincs akadás | NOT TESTED | NOT TESTED | |
| 11.2 | **Nincs ragadós elem**, ami elnyelné a görgetést | NOT TESTED | NOT TESTED | |
| 11.3 | A lendületes görgetés (fling) nem hagy üres képkockát maga után | NOT TESTED | NOT TESTED | |
| 11.4 | Az „utolsó ajtó” (a főoldal legalja) **elérhető**, és a lábléc alatta áll | NOT TESTED | NOT TESTED | |
| 11.5 | A lábléc telefonszámai és e-mail-címei **ujjal eltalálhatók** | NOT TESTED | NOT TESTED | |

## 12. CSÖKKENTETT MOZGÁS

**Hol kapcsolható:**
iPhone → *Beállítások → Kisegítő lehetőségek → Mozgás → Mozgás csökkentése*
Android → *Beállítások → Kisegítő lehetőségek → Animációk eltávolítása*

**A várt viselkedés: a mozgás eltűnik, a TARTALOM NEM.**

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 12.1 | Bekapcsolás után a küszöb **200 ms-os áttűnésre** rövidül | NOT TESTED | NOT TESTED | |
| 12.2 | A rétegmozgás megáll | NOT TESTED | NOT TESTED | |
| 12.3 | **Egyetlen tér, keret vagy szöveg sem tűnik el** — mind a 13 keret elérhető marad | NOT TESTED | NOT TESTED | |
| 12.4 | Az alaprajz és az adatlap továbbra is megnyílik és bezárul | NOT TESTED | NOT TESTED | |
| 12.5 | A bejárható terek nézőpontjai továbbra is léptethetők | NOT TESTED | NOT TESTED | |
| 12.6 | A készülék **nem támogatja / nem található a kapcsoló** | NOT TESTED | NOT TESTED | |

## 13. SZKRIPT NÉLKÜL *(nem kapu — ha a böngésző engedi)*

| # | Amit meg kell nézni | iPhone | Android | Mit láttam (ha FAIL) |
|---|---|---|---|---|
| 13.1 | JavaScript kikapcsolva a főoldal **tartalma, szerkezete és navigációja** a helyén | NOT TESTED | NOT TESTED | |
| 13.2 | **Nincs élőnek látszó, halott gomb** | NOT TESTED | NOT TESTED | |

---

## ÖSSZESÍTÉS

Kitöltés után:

```
iPHONE
  PASS: ____    FAIL: ____    NOT TESTED: ____

ANDROID
  PASS: ____    FAIL: ____    NOT TESTED: ____
```

**A kapu akkor nyílik, ha mindkét készüléken nincs `FAIL`, és nincs
`NOT TESTED` az 1–12. szakaszban.**

Ha `FAIL` születik: **osztályozza** — `DEVICE BUG` vagy `ENGINEERING BUG`.
Csak az utóbbi vezethet kódváltoztatáshoz, és akkor is a
[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md) 12. pontjának teljes
újrafuttatásával.

---

## FAIL-NAPLÓ

```
#____  készülék: __________  mit láttam:
_______________________________________________________________
osztályozás: [ ] DEVICE BUG   [ ] ENGINEERING BUG

#____  készülék: __________  mit láttam:
_______________________________________________________________
osztályozás: [ ] DEVICE BUG   [ ] ENGINEERING BUG
```

---

*Kapcsolódó: [LAUNCH-CHECKLIST.md 7.](LAUNCH-CHECKLIST.md) ·
[AWWWARDS-READINESS.md](AWWWARDS-READINESS.md) ·
[PHASE-8-FINAL-POLISH.md](PHASE-8-FINAL-POLISH.md)*
