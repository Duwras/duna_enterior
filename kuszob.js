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

   Fizika, egyszer:                       900 ms
     0–260 ms  közeledés — a közeli réteg nőni kezd
     260–620   áthaladás — a közeli réteg elmegy a kamera mellett,
               a nyílás tágul, a következő tér benne jelenik meg
     620–900   megülepedés — a következő tér 1.0-ra áll, nem lő túl

   Három fajta, ugyanaz a fizika:
     AJTÓ   másik szoba          — belső terek között
     ABLAK  ami mozog            — ki a hajóra, vissza a térbe
     KAPU   fejezetváltás        — más idő, más rész, más regiszter

   Technika: a maszkot nem képkockánként rajzoljuk újra (az minden
   képkockán újrafestés lenne), hanem a maszkot VIVŐ elemet nagyítjuk,
   és a benne lévő képet pontosan ellentétesen kicsinyítjük. Így a kép
   áll, csak a lyuk nő — és az egész a kompozitoron marad.
   Az ellentétes skálát mintavételezett kulcsképekkel adjuk meg, mert
   két kulcskép között az 1/x nem a x lineáris interpoláltja.
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

  /* ---------- az alaplap ----------

     A belépő képkocka maszk nélküli, nyugalmi helyzetű másolata, a
     legalsó síkon. Ugyanaz a src, tehát ugyanaz a már dekódolt bitkép:
     nincs új hálózati kérés. Amit a feltáró maszk geometriája nem tud
     befedni (lásd ter.css, „AZ ALAPLAP”), azt ez fedi — a képmezőben
     így soha nincs csupasz háttér. */
  function alaplap(burok) {
    var m = burok.cloneNode(true);
    m.setAttribute('data-alap', '');
    m.setAttribute('data-maszk', 'nincs');
    m.setAttribute('aria-hidden', 'true');
    m.removeAttribute('data-nezopont');
    m.hidden = false;
    m.style.visibility = '';

    /* A másolat nem vezérlő és nem tartalom: se gomb, se hivatkozás,
       se azonosító nem maradhat benne kétszer. */
    var ki = m.querySelectorAll('button, a[href]');
    for (var i = 0; i < ki.length; i++) ki[i].parentNode.removeChild(ki[i]);
    var azon = m.querySelectorAll('[id]');
    for (var j = 0; j < azon.length; j++) azon[j].removeAttribute('id');

    var t = m.querySelector('.ter');
    if (t) { t.style.transform = 'none'; t.style.opacity = '1'; }

    burok.parentNode.insertBefore(m, burok.parentNode.firstChild);
    return m;
  }

  function alaplapEl(m) {
    if (m && m.parentNode) m.parentNode.removeChild(m);
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

  var IDO = { elore: 900, vissza: 480 };

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

  var MINTA = 17;   /* ennyi kulcskép — az ellenskála hibája így <0,3% */

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

  /* szakasz: 0 marad tól-ig, aztán fut 1-ig */
  function sav(x, tol, ig) {
    if (x <= tol) return 0;
    if (x >= ig) return 1;
    return (x - tol) / (ig - tol);
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

    /* AZ ALAPLAP. A belépő képkocka maszk nélküli mása a legalsó síkon:
       ez a garancia, hogy a feltárás alól semmilyen fázisban nem
       látszik ki a háttér. Előre menet ez a CÉL (a maszk azt nem tudja
       befedni), visszafelé az AKTUÁLIS tér (a visszajátszás első
       képkockáján a kilépő burok fedettsége még nulla). Mindkét
       esetben ugyanaz az elem: a `befele` burka. */
    var alap = alaplap(befBurok);

    /* A feltárás nyílása mindig a KIFELÉ menő kép saját nyílása —
       ott van a lyuk, amin átlátunk. */
    befBurok.style.setProperty('--nyx',  kifele.style.getPropertyValue('--nyx')  || '50%');
    befBurok.style.setProperty('--nyy',  kifele.style.getPropertyValue('--nyy')  || '50%');
    befBurok.style.setProperty('--nyrx', kifele.style.getPropertyValue('--nyrx') || '20%');
    befBurok.style.setProperty('--nyry', kifele.style.getPropertyValue('--nyry') || '22%');
    befBurok.removeAttribute('data-maszk');

    kifBurok.style.zIndex = '1';
    befBurok.style.zIndex = '2';

    var kozel = kifele.querySelector('.ter-reteg.kozel');
    var koz   = kifele.querySelector('.ter-reteg.koz');
    var tav   = kifele.querySelector('.ter-reteg.tav');

    var alapKozel = szam(kifele, '--reteg-kozel-nagy', 1.055);
    var alapKoz   = szam(kifele, '--reteg-koz-nagy', 1.025);
    var alapTav   = szam(kifele, '--reteg-tav-nagy', 1);

    var ms = IDO.elore;
    var futok = [];

    /* 1. A NYÍLÁS. A maszkot vivő burok nő; a benne lévő kép pontosan
          ellentétesen kicsinyül, tehát nem a fotó nagyobbodik, hanem a
          LYUK tágul. A nyílás a saját mélységéből nő — ezért marad
          sokáig kicsi, és ezért nyílik ki hirtelen, amikor átérünk. */
    futok.push(animal(befBurok, minták(function (x, ut) {
      return { transform: 'scale(' + nagy(Z.nyilas, fajta.ut * ut) + ')' };
    }), ms));

    /* 2. A BELÉPŐ TÉR. Az ellenskála mellett kap egy hosszú, lassuló
          megülepedést is: 0,94-ről áll 1,00-ra, és nem lő túl. */
    futok.push(animal(befele, minták(function (x, ut) {
      var nyilas = nagy(Z.nyilas, fajta.ut * ut);
      var ules = fajta.ules + (1 - fajta.ules) * viz(sav(x, 0.30, 1));
      return { transform: 'scale(' + (ules / nyilas) + ')' };
    }), ms));

    /* 3. Láthatóság: akkor kapcsol be, amikor a nyílás még KICSI.
          Ez a lényeg — a következő tér előbb látszik a lyukban, mint
          bárhol máshol a képen. */
    futok.push(animal(befele,
      minták(function (x) { return { opacity: sav(x, 0.16, 0.34) }; }), ms));

    /* 4. A KÖZELI RÉTEG elmegy a kamera mellett. Ez az egyetlen elem,
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

    /* 5. A kilépő tér maradéka a legvégén fogy el. Korábban nem: akkor
          a kettő egymásba úszna, és pontosan azt az áttűnést kapnánk,
          amit ez az egész el akar kerülni. */
    futok.push(animal(kifBurok, minták(function (x) {
      return { opacity: 1 - sav(x, 0.74, 0.94) };
    }), ms));

    /* visszafelé: ugyanez a szalag, hátrafelé, gyorsabban */
    if (vissza) {
      var arany = IDO.elore / IDO.vissza;
      for (var i = 0; i < futok.length; i++) {
        futok[i].currentTime = ms;
        futok[i].playbackRate = -arany;
      }
    }

    /* A kompozitálási jelzés csak most, és csak a mozdulat idejére */
    jelez([befBurok, kifBurok, kozel, koz, tav], 'transform');

    /* Bármelyik irányba mentünk, a végén a CÉL marad a képernyőn. A
       záró lépések egyetlen feladatban futnak le, tehát a böngésző
       egyetlen képkockában véglegesíti őket: nincs olyan festés,
       amelyikben a maszk már nincs, de az alaplap még ott van. */
    return varas(futok).then(function () {
      takarit(kifBurok, kifele);
      takarit(befBurok, befele);
      cel.parentNode.hidden = false;
      ter.parentNode.hidden = true;
      alaplapEl(alap);
      return true;
    });
  }

  /* ---------- egyszerű áttűnés (csökkentett mozgás / régi böngésző) ---------- */

  /* A cél KÉSZ — az at() ezt már kivárta. Ezért marad igaz az is, amit
     a csökkentett mozgás ígér: nem „elrejt, vár, megmutat”, hanem a
     kilépő kép áll teljes fedettséggel, amíg a belépő rá nem ült. */
  function egyszeru(ter, cel) {
    var celBurok = cel.parentNode;
    celBurok.setAttribute('data-maszk', 'nincs');
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

  function allj(elem) {
    if (!elem || !elem.getAnimations) return;
    var lista = elem.getAnimations();
    for (var i = 0; i < lista.length; i++) lista[i].cancel();
  }

  function takarit(burok, ter) {
    allj(burok);
    allj(ter);
    var retegek = ter.querySelectorAll('.ter-reteg');
    for (var i = 0; i < retegek.length; i++) { allj(retegek[i]); retegek[i].style.willChange = ''; }
    burok.setAttribute('data-maszk', 'nincs');
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

     Amit itt használunk, az a küszöb 1–3. lépése (a belépő oldal),
     ugyanazokkal a mintákkal és ugyanazzal a kameragörbével. Nincs új
     fizika, nincs új görbe, nincs új időzítés — csak az út rövidebb,
     mert az ismerős mozdulat gyorsabb (--motion-terv, 620 ms).

     burok — a maszkot vivő elem (a nyílás)
     belso — ami benne áll, és amit ellentétesen kicsinyítünk
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

    var futok = [
      animal(burok, minták(function (x, ut) {
        return { transform: 'scale(' + nagy(Z.nyilas, fajta.ut * ut) + ')' };
      }), ms),
      animal(belso, minták(function (x, ut) {
        var ny = nagy(Z.nyilas, fajta.ut * ut);
        var ules = fajta.ules + (1 - fajta.ules) * viz(sav(x, 0.30, 1));
        return { transform: 'scale(' + (ules / ny) + ')' };
      }), ms),
      animal(burok, minták(function (x) {
        return { opacity: sav(x, 0.16, 0.34) };
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
      burok.style.transform = ''; burok.style.opacity = '';
      burok.style.willChange = ''; belso.style.willChange = '';
      belso.style.transform = '';
    });
  }

  window.Kuszob = {
    at: at,
    feltarul: feltarul,
    keszit: keszit,
    melegit: melegit,
    FAJTAK: FAJTAK,
    IDO: IDO,
    lassit: lassit
  };
})();
