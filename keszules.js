/* ============================================================
   DUNA — THE LIVING INTERIOR
   keszules.js — A KÉSZÜLÉS viselkedése

   A nyitó három képkockát NEM ez a fájl vezényli: azt a ter.js
   csinálja, pontosan úgy, ahogy egy szobát vagy a flotta nyitását.
   A különbség egyetlen adatmezőben áll (data/keszules.json): itt
   minden küszöb KAPU.

   Ami ide maradt, három dolog:

     1. Egyszerre egy mondat a nyitásban — ugyanaz a mozdulat, mint a
        fooldal.js-ben és a flotta.js-ben. (Azok a fájlok a saját
        lapjuk azonosítóihoz kötöttek, ezért nem közösíthetők
        anélkül, hogy mindhármat átírnánk; a duplikáció szándékos és
        olcsóbb, mint a kockázat.)

     2. A LEMEZLÉPTETÉS, sorozatonként. Ez a fejezet lényege: a
        fényképek nem terek, hanem lapok, és nem a helyük változik,
        hanem a LÉPTÉKÜK. Egyszerre egy lemez áll a képmezőben.
        Tetszőleges számú sorozatot kiszolgál — a jelölésben csak
        annyi kell, hogy a .metszet-jelolo-k száma egyezzen a
        lemezekével.

     3. A regiszter. A nyitás fénykép; onnantól a lap papír.

   Ha ez a fájl nem fut le: mind a három képkocka, mind a négy
   sorozat minden lemeze, a gerinc, az anyaglista, a műhelykép és az
   összes hivatkozás ott marad. Csak a halkítás, a léptetés és a
   regiszterváltás esik ki — a lemezek egyszerűen egymás alatt
   állnak.
   ============================================================ */
(function () {
  'use strict';

  var nyitas = document.getElementById('keszulesNyitas');
  var elo = document.getElementById('terElo');

  /* ---------- 1. egyszerre egy mondat a nyitásban ---------- */

  /* A szabály a script.js „9/c. EGYSZERRE EGY MONDAT” szakaszában áll:
     a főoldal és a flotta nyitása ugyanez a szerkezet. */
  if (window.Szedes) {
    window.Szedes.indit([].slice.call(document.querySelectorAll('.keszules-szoveg .jelenet-belul')));
  }

  /* ---------- 2. a lemezek léptetése, sorozatonként ----------

     Egy sorozat = egy .metszet blokk. A görgetőhosszat a jelölők
     adják (lemezenként egy), tehát a görgetősáv itt sem hazudik: a
     szakasz tényleg olyan magas, amennyit lépni kell benne.

     A bejelentés csak akkor szólal meg, ha a sorozat tényleg a
     képmezőben van — különben négy sorozat léptetése egyszerre
     beszélne a képernyőolvasóba görgetés közben. */

  function sorozatIndit(szakasz) {
    var lemezek = [].slice.call(szakasz.querySelectorAll('.lemez'));
    var jelolok = [].slice.call(szakasz.querySelectorAll('.metszet-jelolo'));
    var allas = szakasz.querySelector('.sorozat-allas .most');
    var cim = szakasz.querySelector('.metszet-fej .felcim');
    if (!lemezek.length || lemezek.length !== jelolok.length) return null;

    var hol = -1;
    var jegy = 0;

    /* Lásd a fooldal.js azonos helyén: a lemez akkor lép a képmezőbe,
       ha van mit mutatnia — különben lassú hálózaton üres papírfelület
       állna a fénykép helyén. A jegy védi a sorrendet: görgetés közben
       a régebbi várakozás nem írhatja felül az újabb döntést. */
    function allit(uj) {
      if (uj === hol) return;
      var sajat = ++jegy;
      var kep = lemezek[uj].querySelector('img');
      if (kep && !(kep.complete && kep.naturalWidth > 0)) {
        kep.setAttribute('loading', 'eager');
        var tovabb = function () {
          kep.removeEventListener('load', tovabb);
          kep.removeEventListener('error', tovabb);
          if (sajat === jegy) valt(uj);
        };
        kep.addEventListener('load', tovabb);
        kep.addEventListener('error', tovabb);
        return;
      }
      valt(uj);
    }

    function valt(uj) {
      if (uj === hol) return;
      var elozo = hol;
      hol = uj;
      for (var i = 0; i < lemezek.length; i++) {
        if (i === hol) {
          lemezek[i].setAttribute('data-aktiv', '');
          lemezek[i].removeAttribute('data-elmult');
        } else {
          lemezek[i].removeAttribute('data-aktiv');
          if (i < hol) lemezek[i].setAttribute('data-elmult', '');
          else lemezek[i].removeAttribute('data-elmult');
        }
      }
      if (allas) allas.textContent = (hol + 1 < 10 ? '0' : '') + (hol + 1);

      /* Bejelentés: a lépés neve és a lépték. A térbeli állapotot
         soha nem mondjuk fel — az díszítés. Ez viszont tartalom. */
      if (elo && elozo !== -1) {
        var d = szakasz.getBoundingClientRect();
        if (d.top < window.innerHeight * 0.75 && d.bottom > window.innerHeight * 0.25) {
          var fc = lemezek[hol].querySelector('figcaption .tipo-muszaki');
          elo.textContent = (cim ? cim.textContent + ' — ' : '') +
            (fc ? fc.textContent.trim() : (hol + 1) + '. lemez');
        }
      }
    }

    function merre() {
      var hatar = window.innerHeight * 0.55;
      var uj = 0;
      for (var i = 0; i < jelolok.length; i++) {
        if (jelolok[i].getBoundingClientRect().top <= hatar) uj = i;
      }
      allit(uj);
    }

    allit(0);
    return merre;
  }

  var sorozatok = [].slice.call(document.querySelectorAll('.metszet[data-sorozat]'))
    .map(sorozatIndit)
    .filter(Boolean);

  if (sorozatok.length) {
    /* Csak most kapcsoljuk át a lapot az „egyszerre egy lemez”
       viselkedésre. Az alapállapot egy közönséges, olvasható lista;
       ha ez a sor nem fut le, az marad — nem üres képmező. */
    document.body.setAttribute('data-lemezek', '');

    var keszLemez = true;
    window.addEventListener('scroll', function () {
      if (!keszLemez) return;
      keszLemez = false;
      requestAnimationFrame(function () {
        keszLemez = true;
        for (var i = 0; i < sorozatok.length; i++) sorozatok[i]();
      });
    }, { passive: true });
    for (var s = 0; s < sorozatok.length; s++) sorozatok[s]();
  }

  /* ---------- 3. a regiszter ----------

     A ter.js a látott képkocka szerint állítja a lap regiszterét.
     Amint kigördültünk a nyitásból, a lap megint papír — a gerinc, a
     sorozatok és az anyaglista dokumentum, nem hangulat. */

  if (nyitas) {
    var utolso = '';
    var varakozik = false;

    var regiszter = function () {
      varakozik = false;
      var d = nyitas.getBoundingClientRect();
      var bent = d.top < window.innerHeight * 0.5 && d.bottom > window.innerHeight * 0.5;
      if (bent) { utolso = 'nyitas'; return; }   /* itt a ter.js dolga */
      if (utolso !== 'lap') {
        utolso = 'lap';
        document.documentElement.setAttribute('data-hangulat', 'nappal');
      }
    };

    window.addEventListener('scroll', function () {
      if (varakozik) return;
      varakozik = true;
      requestAnimationFrame(regiszter);
    }, { passive: true });
    regiszter();
  }
})();
