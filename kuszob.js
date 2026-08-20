/* ============================================================
   DUNA — THE LIVING INTERIOR
   kuszob.js — A KÜSZÖB

   Az oldal EGYETLEN átmenete. Nincs második effekt: minden helyváltás
   ez a mozdulat, csak más nyílással és más jelentéssel.

   Amit a néző lát: a kép közeledik, a legközelebbi dolog benne — egy
   ajtótok, egy oszlop, egy ablakkeret — elhalad a feje mellett, és ami
   mögötte volt, az lett a tér, amiben áll.

   Amitől nem áttűnés: a következő tér ELŐSZÖR a nyílásban jelenik meg,
   és onnan terjed kifelé. A nyílás az előző kép saját nyílása. Ez a
   különbség a „rajta át” és a „fölötte” között.

   Fizika, egyszer:                       760 ms
     0–220 ms  közeledés — a közeli réteg nőni kezd, a lyuk résnyi
     220–520   áthaladás — a közeli réteg elmegy a kamera mellett,
               a lyuk kinyílik, és elnyeli a képmezőt
     520–760   megülepedés — a következő tér 1.0-ra áll, nem lő túl

   Három fajta, ugyanaz a fizika:
     AJTÓ   másik szoba          — belső terek között
     ABLAK  ami mozog            — ki a hajóra, vissza a térbe
     KAPU   fejezetváltás        — más idő, más rész, más regiszter

   Technika: a lyukat a belépő burok clip-path ellipszise adja, a
   KÉPMEZŐ koordinátáiban. Ezért marad az éle éles akkor is, amikor a
   lyuk már az egész képernyő — és ezért nem kell a képet ellentétesen
   kicsinyíteni. Az alapalakzatos clip-path animációja a kompozitoron
   marad; a lyuk a nyílás mélységéből tágul, mintavételezett
   kulcsképekkel (a perspektíva 1/x-e nem lineáris).

   Ami eddig itt volt és MIÉRT NEM VÁLT BE: a maszkot vivő elemet
   nagyítottuk, és a képet ellentétesen kicsinyítettük. A nagyítás a
   maszk LÁGY PEREMÉT is nagyította (3,4-szeresére), a belépő tér pedig
   halványan úszott be — a kettő együtt a teljes képmezőn átderengő
   kettős kép lett. A néző ezt áttűnésnek látta, nem ajtónak. A maszkot
   már nem nagyítjuk, a belépő kép nem halványodik: ami feltárul, az
   azonnal teljes fedettséggel ott van.
   ============================================================ */
(function () {
  'use strict';

  var lassit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tudAnimalni = typeof Element !== 'undefined' && !!Element.prototype.animate;

  /* ============================================================
     KÉPKÉSZENLÉT — semmi nem tárul fel, amíg nincs mit mutatni
     ============================================================

     A küszöb korábban abban a pillanatban indult, amikor a ter.js
     ráírta a src-et a következő képkockára. A feltárás 144 ms-nál
     kezdett látszani, a kilépő kép 666 ms-nál kezdett fogyni — egy
     hideg kép ennyi idő alatt lassú hálózaton nincs kint. Ilyenkor a
     nyílásban nem a következő tér jelent meg, hanem a --ejjel alap.

     „Kész” nem azt jelenti, hogy létezik az <img>. Azt jelenti:
     kiválasztott forrás · letöltve · DEKÓDOLVA · van mérete.

     A rejtett (`hidden` → display:none) burokban a böngésző a
     `loading="lazy"` képet nem tölti le, és a <picture> forrásválasztás
     sem fut le, mert nincs elrendezés. Ezért a felkészítés a burkot
     ELŐBB elrendezésbe teszi — átlátszóan, kattinthatatlanul —, és csak
     utána vár. Amíg ez tart, a képmezőn semmi nem változik: a kilépő
     kép áll, teljes fedettséggel. */

  var KESZ_KAP = 12000;   /* ennyi után föladjuk, és maradunk, ahol vagyunk */

  function ido(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  function egyKep(im) {
    if (im.getAttribute('data-srcset')) {
      im.setAttribute('srcset', im.getAttribute('data-srcset'));
      im.removeAttribute('data-srcset');
    }
    if (im.getAttribute('data-src')) {
      im.setAttribute('src', im.getAttribute('data-src'));
      im.removeAttribute('data-src');
    }
    /* A halasztás itt már hazugság: ez a kép MOST kell. */
    if (im.getAttribute('loading') === 'lazy') im.setAttribute('loading', 'eager');

    if (im.complete && im.naturalWidth > 0) return dekodol(im);

    return new Promise(function (kesz) {
      var vege = function () {
        im.removeEventListener('load', vege);
        im.removeEventListener('error', vege);
        kesz();
      };
      im.addEventListener('load', vege);
      im.addEventListener('error', vege);
    }).then(function () { return dekodol(im); });
  }

  /* A dekódolás nem mindenhol van meg, és nem mindig ér véget (a
     megszakított src-csere elutasítással jár). Egyik sem hiba: a
     letöltés akkor is megvolt, a festés legrosszabb esetben egy
     képkockával később történik. */
  function dekodol(im) {
    if (!im.decode) return Promise.resolve();
    return Promise.race([im.decode().catch(function () {}), ido(2000)]);
  }

  /* Fest-e ez a burok bármit? Ha egyetlen rétege sincs meg, nincs mit
     feltárni — akkor inkább nem mozdulunk. */
  function festhet(gyoker) {
    var im = gyoker.querySelectorAll('img');
    for (var i = 0; i < im.length; i++) if (im[i].naturalWidth > 0) return true;
    return im.length === 0;
  }

  function keszit(burok) {
    if (!burok) return Promise.resolve(false);
    var voltRejtve = burok.hidden;

    /* Elrendezésbe tesszük, de láthatatlanul: enélkül a <picture> nem
       választ forrást és a lazy kép el sem indul. */
    if (voltRejtve) {
      burok.hidden = false;
      burok.style.visibility = 'hidden';
    }

    var im = [].slice.call(burok.querySelectorAll('img'));

    /* Elindítani mindet elindítjuk — VÁRNI viszont csak arra várunk,
       ami tényleg a képmezőben lesz. A szabály az, hogy ne legyen ÜRES
       FELÜLET; egy hajtás alatti kép nem üres felület, hanem még nem
       görgettük oda.

       A színpadon ez nem változtat semmin: ott mind a három réteg
       teljes képmezős. Az alaprajznál viszont igen — mérve Slow 4G-n,
       hidegen: mind a harminc borítóra várva 5,4 másodperc telt el a
       kattintás és a kapu megnyílása között, pedig a hajtás fölött hat
       borító áll. A többi menet közben érkezik, ahogy minden más
       lapon is. */
    var mh = window.innerHeight || 800;
    var kell = im.filter(function (e) {
      var r = e.getBoundingClientRect();
      if (!r.width && !r.height) return true;          /* még nincs elrendezve: várunk rá */
      return r.top < mh * 1.25 && r.bottom > -mh * 0.25;
    });
    im.forEach(function (e) { if (kell.indexOf(e) < 0) egyKep(e); });

    var mind = Promise.all(kell.map(egyKep));

    return Promise.race([mind, ido(KESZ_KAP)]).then(function () {
      if (voltRejtve) burok.style.visibility = '';
      /* a rejtettséget NEM állítjuk vissza: a hívó dönti el, mi legyen
         vele — a melegítés visszarejti, a küszöb megmutatja */
      if (voltRejtve) burok.hidden = true;
      return festhet(burok);
    });
  }

  /* Előmelegítés: ugyanaz, csak a végén minden marad, ahogy volt.
     A KÖVETKEZŐ képkockára használjuk, nem az egész oldalra. */
  function melegit(burok) {
    if (!burok) return Promise.resolve(false);
    return keszit(burok);
  }

  /* ---------- kompozitálási jelzés, csak a mozdulat idejére ----------

     Lásd ter.css: állandó `will-change: transform` mellett a réteg
     raszterét a böngésző egy léptéken tartja, és a nyugalmi nagyítás
     fölnagyított raszterként kerül a képernyőre. */
  function jelez(elemek, ertek) {
    for (var i = 0; i < elemek.length; i++) {
      if (elemek[i]) elemek[i].style.willChange = ertek;
    }
  }

  /* ---------- a mozgás modellje ----------

     Nem tetszőleges skálagörbék: egy KAMERA megy előre, és minden réteg
     annyit nő, amennyit a saját mélységéből következik.

         nagyítás = z / (z − út)

     ahol z a réteg távolsága, út pedig hogy meddig jutott a kamera.
     Ez adja azt, amit gyalogosan is látni: a közeli ajtótok eleinte
     alig változik, aztán hirtelen elrobog a fejünk mellett — míg a
     távoli folyó alig mozdul. Egyetlen közös lineáris áttűnés soha nem
     tudja ezt megcsinálni, ezért olvasódna áttűnésnek.

     A rétegek mélysége (a kamera 1 egysége nagyjából egy lépés): */

  var Z = {
    kozel:  1.60,   /* ajtótok, oszlop, ablakkeret — karnyújtásnyira */
    nyilas: 1.90,   /* maga a nyílás síkja — ezen megyünk át */
    koz:    6.00,   /* bútor, fal */
    tav:   14.00    /* a nyíláson túli tér */
  };

  /* Fajták: ugyanaz a fizika, más úthossz és más jelentés.
     ut  — meddig megy a kamera (1.0 fölött már elhagytuk a közeli réteget)
     el  — a közeli réteg mikor tűnik el (az úthoz képest)
     ules— mekkorából ül helyre a belépő tér
     oldal — oldalirányú elcsúszás %-ban (csak az ablaknál) */
  var FAJTAK = {
    ajto:  { ut: 1.35, el: [0.30, 0.62], ules: 0.945, oldal: 0.0 },
    ablak: { ut: 1.20, el: [0.26, 0.56], ules: 0.955, oldal: 3.4 },
    kapu:  { ut: 1.55, el: [0.34, 0.66], ules: 0.930, oldal: 0.0 }
  };

  var IDO = { elore: 760, vissza: 420 };

  /* A feltárás mértanának két száma:
     KEZDET — ekkora hányadról indul a lyuk (a nyílás sugarához mérve).
              Résnyire nyitott ajtó, nem folt.
     SAROK  — a végén ennyivel nyúlik túl a legtávolabbi képsarkon.
              1,415 a matematikai minimum; a maradék a kerekítésé. */
  var KEZDET = 0.30;
  var SAROK  = 1.45;

  function bez(t, p1, p2) {
    var u = 1 - t;
    return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
  }
  function gorbe(x, x1, x2, y1, y2) {
    var a = 0, b = 1, t = x, i;
    for (i = 0; i < 18; i++) {
      t = (a + b) / 2;
      if (bez(t, x1, x2) < x) a = t; else b = t;
    }
    return bez(t, y1, y2);
  }

  /* A KAMERA menete. Nem a CSS vízgörbéje: az túl korán elveszi a
     mozgás nagy részét, és a küszöb közepe üresen maradna. Ez lassan
     indul (közeledés), középen viszi a mozgást (áthaladás), és hosszan
     lassulva áll meg (megülepedés) — a 260 / 620 / 900 ms-os
     tagolásnak megfelelően. */
  function kamera(x) { return gorbe(x, 0.42, 0.16, 0, 1); }

  /* a megülepedéshez a rendszer saját vízgörbéje */
  function viz(x) { return gorbe(x, 0.16, 0.24, 0.84, 1); }

  /* Ennyi kulcskép. A böngésző két kulcskép KÖZÖTT lineárisan
     interpolál, a doboz nagyítása és a benne álló kép ellenskálája
     viszont egymás pontos fordítottja — a szorzatuk csak a
     kulcsképeken 1,000. Ami közte marad, az méretlüktetés a belépő
     képen, és pont úgy néz ki, mintha a lap ejtené a képkockákat.

     Mérve (főoldal, 1. keret, 1440 px, ajtó), a legnagyobb eltérés:
       17 kulcskép … 5,48%   (48 ms-onként egy)
       33 ………………… 1,36%
       49 ………………… 0,62%
       81 ………………… 0,22%   (10 ms-onként egy)

     A régi, maszkos megoldásnál 17 elég volt, mert ott a nagyítás
     3,4-szeres volt. A vágódoboz 16-szorosra nő, és a hiba a
     nagyítási tartománnyal együtt nő. */
  var MINTA = 81;

  function minták(fn) {
    var ki = [];
    for (var i = 0; i < MINTA; i++) {
      var x = i / (MINTA - 1);
      ki.push(fn(x, kamera(x)));
    }
    return ki;
  }

  /* nagyítás egy adott mélységű rétegre, adott kameraútnál */
  function nagy(z, ut) { return z / Math.max(0.08, z - ut); }

  /* A lyuk tágulása 0-tól 1-ig, ugyanabból a perspektívából, amiből a
     rétegek nagyítása: nem lineáris, hanem a küszöbön áthaladó kameráé. */
  function tagulas(fajta, ut) {
    var veg = nagy(Z.nyilas, fajta.ut);
    return (nagy(Z.nyilas, fajta.ut * ut) - 1) / (veg - 1);
  }

  /* szakasz: 0 marad tól-ig, aztán fut 1-ig */
  function sav(x, tol, ig) {
    if (x <= tol) return 0;
    if (x >= ig) return 1;
    return (x - tol) / (ig - tol);
  }

  /* ---------- a futó mozdulat ----------

     Egyszerre egy küszöb fut. Ha a látogató közben TOVÁBB kér (gyors
     görgetés, nyomva tartott nyíl), nem sorakozik föl mögé egy második
     mozdulat: a futót SIETTETJÜK. Így a színpad nem marad le a görgetés
     mögött, és nem is torlódik — ugyanaz a mozdulat pereg gyorsabban. */
  var futoMenet = null;

  function siettet(k) {
    if (!futoMenet) return;
    k = Math.max(1, Math.min(3, k || 2));
    for (var i = 0; i < futoMenet.futok.length; i++) {
      futoMenet.futok[i].playbackRate = futoMenet.alap * k;
    }
  }

  /* ---------- egy réteg animálása ---------- */

  function animal(elem, kulcsok, ms) {
    return elem.animate(kulcsok, {
      duration: ms,
      easing: 'linear',           /* a görbe már a mintákban van */
      fill: 'both'
    });
  }

  /* ---------- a küszöb ----------

     ter  — ahol most állunk   (.nyilas > .ter)
     cel  — ahová megyünk      (.nyilas > .ter)

     Előre: a `ter` közeli rétege megy el mellettünk, a `cel` a `ter`
     nyílásán át tárul fel.
     Vissza: ugyanez a mozdulat, visszafelé lejátszva — nem egy másik
     animáció. Ezért érzi a látogató, hogy ugyanazon az ajtón lép ki. */

  function at(be) {
    var ter = be.ter;
    var cel = be.cel;

    /* 1. LÉPÉS, MINDEN ELŐTT: a célképkocka legyen festhető.

       Amíg ez tart, a képmezőn semmi nem történik — a kilépő kép áll,
       teljes fedettséggel. A mozdulat KÉSHET; üresen kezdődnie nem
       szabad. Ha a cél sehogy sem áll össze (hálózati hiba, hiányzó
       fájl), egyáltalán nem indulunk el: `false`-szal térünk vissza, és
       a hívó ott marad, ahol volt. */
    return keszit(cel.parentNode).then(function (fest) {
      if (!fest) {
        if (window.console) console.warn('Küszöb: a célképkocka nem festhető, maradunk.');
        cel.parentNode.hidden = true;
        return false;
      }
      return atMost(be, ter, cel);
    });
  }

  function atMost(be, ter, cel) {
    var fajta = FAJTAK[be.fajta] || FAJTAK.ajto;
    var vissza = be.irany === 'vissza';

    /* visszafelé a szerepek cserélődnek: az „előre” idővonalat
       építjük fel a másik irányban, és hátrafelé játsszuk le */
    var kifele = vissza ? cel : ter;
    var befele = vissza ? ter : cel;

    var kifBurok = kifele.parentNode;      /* .nyilas */
    var befBurok = befele.parentNode;

    cel.parentNode.hidden = false;

    /* --- csökkentett mozgás: rövid áttűnés, semmi kamera --- */
    if (lassit || !tudAnimalni) {
      return egyszeru(ter, cel);
    }

    /* A NYÍLÁS HELYE. Mindig a KIFELÉ menő kép saját nyílása — azon
       látunk át. Százalékban, a képmezőhöz mérve. */
    var nyx  = szazalek(kifele, '--nyx', 50);
    var nyy  = szazalek(kifele, '--nyy', 50);
    var nyrx = szazalek(kifele, '--nyrx', 20);
    var nyry = szazalek(kifele, '--nyry', 22);

    /* A FELTÁRÁS MÉRTANA — A VÁGÓDOBOZ.

       A lyuk a nyílás harmadáról indul — akkora, mint egy résnyire
       nyitott ajtó —, és addig tágul, amíg a képmező legtávolabbi
       SARKÁT is elnyeli. Ezért nincs a végén áttűnés: a kilépő képet
       nem elhalványítjuk, hanem BEFEDJÜK.

       A lyukat nem clip-path rajzolja képkockánként, és nem is lágy
       maszk: a belépő burokból ellipszis alakú VÁGÓDOBOZ lesz
       (border-radius: 50% + overflow: hidden), és ezt a dobozt
       NAGYÍTJUK. A benne álló képkocka pontosan ellentétesen kicsinyül,
       a nyílás pontja körül — tehát a KÉP ÁLL, csak a lyuk nő.

       Miért így: a doboz nagyítása transform, ami a kompozitoron marad,
       a mozdulat alatt nincs festés. A clip-path sugarát viszont a
       böngésző képkockánként újrarajzolja, teljes képmezőn, három
       képréteggel — ez a lapon másodpercenként egy-két képkockára esett
       vissza. Ugyanaz a mértan, csak most a kompozitor viszi.

       A doboz kerek kivágású doboz (rounded rect), nem lágy maszk: a
       pereme akkor is ÉL, amikor a lyuk már az egész képernyő. */
    var mezo = befBurok.getBoundingClientRect();
    var kw = mezo.width || window.innerWidth || 1;
    var kh = mezo.height || window.innerHeight || 1;

    var px = nyx / 100 * kw, py = nyy / 100 * kh;      /* a nyílás pontja */
    var felW = SAROK * Math.max(px, kw - px);          /* a doboz fél szélessége */
    var felH = SAROK * Math.max(py, kh - py);
    var bal = px - felW, fent = py - felH;

    /* Ahonnan indul: a nyílás saját mérete, annak is a harmada. */
    var sx0 = Math.max(0.004, KEZDET * (nyrx / 100 * kw) / felW);
    var sy0 = Math.max(0.004, KEZDET * (nyry / 100 * kh) / felH);

    function lepteknel(g) {
      return { x: sx0 + (1 - sx0) * g, y: sy0 + (1 - sy0) * g };
    }

    dobozBe(befBurok, befele, bal, fent, felW * 2, felH * 2, kw, kh, nyx, nyy);

    kifBurok.style.zIndex = '1';
    befBurok.style.zIndex = '2';

    /* A belépő oldal MÉLYSÉGRÉTEGEI a mozdulat alatt nem kellenek: a kép
       áll, a két maszkos másolat viszont két teljes képmezős kompozitsík.
       A távoli réteg maga a teljes fénykép. */
    var beKoz = befele.querySelector('.ter-reteg.koz');
    var beKozel = befele.querySelector('.ter-reteg.kozel');
    if (beKoz) beKoz.style.display = 'none';
    if (beKozel) beKozel.style.display = 'none';

    var kozel = kifele.querySelector('.ter-reteg.kozel');
    var koz   = kifele.querySelector('.ter-reteg.koz');
    var tav   = kifele.querySelector('.ter-reteg.tav');

    var alapKozel = szam(kifele, '--reteg-kozel-nagy', 1.055);
    var alapKoz   = szam(kifele, '--reteg-koz-nagy', 1.025);
    var alapTav   = szam(kifele, '--reteg-tav-nagy', 1);

    var ms = IDO.elore;
    var futok = [];

    /* 1. A LYUK. Nem lineárisan tágul: a saját mélységéből — sokáig alig
          változik, aztán a küszöbön áthaladva hirtelen kinyílik. */
    futok.push(animal(befBurok, minták(function (x, ut) {
      var l = lepteknel(tagulas(fajta, ut));
      return { transform: 'scale(' + l.x + ',' + l.y + ')' };
    }), ms));

    /* 2. A BELÉPŐ TÉR. Az ellenskála tartja állva a képet; a megülepedés
          0,94-ről ülteti 1,00-ra, lassulva, túllövés nélkül. A kép a lyuk
          mögött VÉGIG teljes fedettségű — nem halványodik be. Ami
          feltárul, az azonnal ott van. */
    futok.push(animal(befele, minták(function (x, ut) {
      var l = lepteknel(tagulas(fajta, ut));
      var ules = fajta.ules + (1 - fajta.ules) * viz(sav(x, 0.06, 1));
      return { transform: 'scale(' + (ules / l.x) + ',' + (ules / l.y) + ')' };
    }), ms));

    /* 3. A KÖZELI RÉTEG elmegy a kamera mellett. Ez az egyetlen elem,
          ami gyorsul: karnyújtásnyira van, tehát a perspektíva kidobja
          a képmezőből. Mire kifutna a felbontásából, már nem látszik. */
    if (kozel) {
      futok.push(animal(kozel, minták(function (x, ut) {
        return {
          transform: 'translate3d(' + (fajta.oldal * ut) + '%,0,0) scale(' +
            (alapKozel * nagy(Z.kozel, fajta.ut * ut)) + ')',
          opacity: 1 - sav(x, fajta.el[0], fajta.el[1])
        };
      }), ms));
    }
    if (koz) {
      futok.push(animal(koz, minták(function (x, ut) {
        return { transform: 'scale(' + (alapKoz * nagy(Z.koz, fajta.ut * ut)) + ')' };
      }), ms));
    }
    if (tav) {
      futok.push(animal(tav, minták(function (x, ut) {
        return { transform: 'scale(' + (alapTav * nagy(Z.tav, fajta.ut * ut)) + ')' };
      }), ms));
    }

    /* 4. A kilépő kép a legvégén tűnik el — amikor a lyuk már úgyis
          befedte. Nem átmenet, hanem biztosíték: a kerekítésen múló
          egy-két képpontnyi perem se villanhasson föl. */
    futok.push(animal(kifBurok, minták(function (x) {
      return { opacity: 1 - sav(x, 0.90, 1) };
    }), ms));

    /* visszafelé: ugyanez a szalag, hátrafelé, gyorsabban */
    var alapUtem = 1;
    if (vissza) {
      alapUtem = -(IDO.elore / IDO.vissza);
      for (var i = 0; i < futok.length; i++) {
        futok[i].currentTime = ms;
        futok[i].playbackRate = alapUtem;
      }
    }
    futoMenet = { futok: futok, alap: alapUtem };

    /* A kompozitálási jelzés csak most, és csak a mozdulat idejére */
    jelez([kifBurok, befBurok, befele, kozel, koz, tav], 'transform');

    /* Bármelyik irányba mentünk, a végén a CÉL marad a képernyőn. A
       záró lépések egyetlen feladatban futnak le, tehát a böngésző
       egyetlen képkockában véglegesíti őket. */
    return varas(futok).then(function () {
      futoMenet = null;
      takarit(kifBurok, kifele);
      takarit(befBurok, befele);
      cel.parentNode.hidden = false;
      ter.parentNode.hidden = true;
      return true;
    });
  }

  /* ---------- egyszerű áttűnés (csökkentett mozgás / régi böngésző) ---------- */

  /* A cél KÉSZ — az at() ezt már kivárta. Ezért marad igaz az is, amit
     a csökkentett mozgás ígér: nem „elrejt, vár, megmutat”, hanem a
     kilépő kép áll teljes fedettséggel, amíg a belépő rá nem ült. */
  function egyszeru(ter, cel) {
    var celBurok = cel.parentNode;
    celBurok.hidden = false;
    celBurok.style.zIndex = '2';
    ter.parentNode.style.zIndex = '1';

    if (!tudAnimalni) {
      ter.parentNode.hidden = true;
      return Promise.resolve(true);
    }
    var a = celBurok.animate([{ opacity: 0 }, { opacity: 1 }],
      { duration: 200, easing: 'ease', fill: 'both' });
    return varas([a]).then(function () {
      celBurok.style.opacity = '';
      ter.parentNode.hidden = true;
      return true;
    });
  }

  /* ---------- segédek ---------- */

  function szam(elem, kulcs, alap) {
    var v = parseFloat(getComputedStyle(elem).getPropertyValue(kulcs));
    return isNaN(v) ? alap : v;
  }

  /* Ugyanaz, csak százalékban írt értékre — a nyílás helyét és sugarát
     a build százalékban írja ki (--nyx: 66.0%). */
  function szazalek(elem, kulcs, alap) {
    var v = parseFloat(elem.style.getPropertyValue(kulcs));
    if (isNaN(v)) v = parseFloat(getComputedStyle(elem).getPropertyValue(kulcs));
    return isNaN(v) ? alap : v;
  }

  function allj(elem) {
    if (!elem || !elem.getAnimations) return;
    var lista = elem.getAnimations();
    for (var i = 0; i < lista.length; i++) lista[i].cancel();
  }

  /* A VÁGÓDOBOZ. A burokból ellipszis alakú lyuk lesz, a benne álló
     képkocka pedig ott marad, ahol a képmezőben áll. Csak a mozdulat
     idejére — a takarit mindent visszabont. */
  function dobozBe(burok, ter, bal, fent, szel, mag, kw, kh, nyx, nyy) {
    burok.style.left = bal + 'px';
    burok.style.top = fent + 'px';
    burok.style.right = 'auto';
    burok.style.bottom = 'auto';
    burok.style.width = szel + 'px';
    burok.style.height = mag + 'px';
    burok.style.borderRadius = '50%';
    burok.style.overflow = 'hidden';
    burok.style.transformOrigin = '50% 50%';

    /* A képkocka a dobozon BELÜL is a képmező helyén áll, és a nyílás
       pontja körül skálázódik — ezt oltja ki a doboz nagyítása. */
    ter.style.position = 'absolute';
    ter.style.left = (-bal) + 'px';
    ter.style.top = (-fent) + 'px';
    ter.style.width = kw + 'px';
    ter.style.height = kh + 'px';
    ter.style.transformOrigin = nyx + '% ' + nyy + '%';
  }

  function dobozKi(burok, ter) {
    var b = burok.style, t = ter.style;
    b.left = b.top = b.right = b.bottom = b.width = b.height = '';
    b.borderRadius = b.overflow = b.transformOrigin = '';
    t.position = t.left = t.top = t.width = t.height = t.transformOrigin = '';
    var lista = ter.querySelectorAll('.ter-reteg');
    for (var i = 0; i < lista.length; i++) lista[i].style.display = '';
  }

  function takarit(burok, ter) {
    allj(burok);
    allj(ter);
    dobozKi(burok, ter);
    var retegek = ter.querySelectorAll('.ter-reteg');
    for (var i = 0; i < retegek.length; i++) { allj(retegek[i]); retegek[i].style.willChange = ''; }
    burok.style.zIndex = '';
    burok.style.opacity = '';
    burok.style.transform = '';
    burok.style.willChange = '';
    burok.style.visibility = '';
    ter.style.transform = '';
    ter.style.opacity = '';
  }

  function varas(futok) {
    return Promise.all(futok.map(function (a) {
      return a.finished.catch(function () { /* megszakítás nem hiba */ });
    }));
  }

  /* ---------- feltárulás: KAPU egy nem-térbeli rétegre ----------

     Az alaprajz nem egy másik szoba, hanem a szerkezet, ami a szobák
     alatt van. Mégis ugyanazon a mozdulaton át jön elő, mert a
     látogató helye tényleg megváltozik — és mert ha másképp jönne,
     az egy MÁSODIK átmenet volna, amiből ezen az oldalon nincs.

     Amit itt használunk, az a küszöb belépő oldala: ugyanaz a vágás,
     ugyanaz a kameragörbe. Nincs új fizika, nincs új görbe, nincs új
     időzítés — csak az út rövidebb, mert az ismerős mozdulat gyorsabb
     (--motion-terv, 620 ms).

     burok — a vágást vivő elem (a kapu)
     belso — ami benne áll (a lap), és ami a végén helyre ül
     vissza — igaz: ugyanez visszafelé lejátszva */
  function feltarul(burok, belso, be) {
    be = be || {};
    /* Ugyanaz a szabály, mint a küszöbnél: befelé menet a réteg akkor
       tárul fel, ha van mit mutatnia. Az alaprajz `hidden`-ben áll,
       tehát a képei addig el sem indulnak — enélkül a kapu üres
       cellákra nyílna. Visszafelé nincs mit kivárni: ami látszik, az
       már ott van. */
    if (!be.vissza) {
      /* A hívó már láthatóra állította a réteget, mert szkript nélkül
         is nyitva kell lennie. A várakozás alatt viszont nem villanhat
         föl: nullán tartjuk, amíg a mozdulat át nem veszi. */
      burok.style.opacity = '0';
      return keszit(burok).then(function () {
        burok.hidden = false;
        burok.style.opacity = '';
        return feltarulMost(burok, belso, be);
      });
    }
    return feltarulMost(burok, belso, be);
  }

  function feltarulMost(burok, belso, be) {
    var fajta = FAJTAK[be.fajta] || FAJTAK.kapu;
    var ms = be.ms || 620;

    if (lassit || !tudAnimalni) {
      if (!tudAnimalni) return Promise.resolve();
      var f = burok.animate(
        be.vissza ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }],
        { duration: 200, easing: 'ease', fill: 'both' });
      return varas([f]).then(function () { burok.style.opacity = ''; });
    }

    /* A kapu helye — a terv.js az éppen látott képkockáról veszi át. */
    var kx  = szazalek(burok, '--terv-x', 50);
    var ky  = szazalek(burok, '--terv-y', 50);
    var krx = szazalek(burok, '--terv-rx', 20);
    var kry = szazalek(burok, '--terv-ry', 22);

    /* Ugyanaz a vágódoboz, mint a színpadon. A lap a doboz alatt áll;
       a görgetés a mozdulat idejére nem kell (most nyílt ki), utána
       mindent visszabontunk. */
    var mezo = burok.getBoundingClientRect();
    var kw = mezo.width || window.innerWidth || 1;
    var kh = mezo.height || window.innerHeight || 1;

    var px = kx / 100 * kw, py = ky / 100 * kh;
    var felW = SAROK * Math.max(px, kw - px);
    var felH = SAROK * Math.max(py, kh - py);
    var bal = px - felW, fent = py - felH;

    var sx0 = Math.max(0.004, KEZDET * (krx / 100 * kw) / felW);
    var sy0 = Math.max(0.004, KEZDET * (kry / 100 * kh) / felH);

    var voltGorgetes = burok.style.overflowY;
    burok.style.overflowY = 'hidden';
    dobozBe(burok, belso, bal, fent, felW * 2, felH * 2, kw, kh, kx, ky);

    var futok = [
      animal(burok, minták(function (x, ut) {
        var g = tagulas(fajta, ut);
        return { transform: 'scale(' + (sx0 + (1 - sx0) * g) + ',' +
                                       (sy0 + (1 - sy0) * g) + ')' };
      }), ms),
      animal(belso, minták(function (x, ut) {
        var g = tagulas(fajta, ut);
        var lx = sx0 + (1 - sx0) * g, ly = sy0 + (1 - sy0) * g;
        var ules = fajta.ules + (1 - fajta.ules) * viz(sav(x, 0.06, 1));
        return { transform: 'scale(' + (ules / lx) + ',' + (ules / ly) + ')' };
      }), ms)
    ];

    if (be.vissza) {
      for (var i = 0; i < futok.length; i++) {
        futok[i].currentTime = ms;
        futok[i].playbackRate = -(IDO.elore / IDO.vissza);
      }
    }

    jelez([burok, belso], 'transform');

    return varas(futok).then(function () {
      allj(burok); allj(belso);
      dobozKi(burok, belso);
      burok.style.overflowY = voltGorgetes;
      burok.style.transform = ''; burok.style.opacity = '';
      burok.style.willChange = ''; belso.style.willChange = '';
      belso.style.transform = '';
    });
  }

  window.Kuszob = {
    at: at,
    siettet: siettet,
    feltarul: feltarul,
    keszit: keszit,
    melegit: melegit,
    FAJTAK: FAJTAK,
    IDO: IDO,
    lassit: lassit
  };
})();
