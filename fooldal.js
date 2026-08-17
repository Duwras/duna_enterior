/* ============================================================
   DUNA — THE LIVING INTERIOR
   fooldal.js — a hét jelenet vezénylése

   Az első aktust (a fényképezett teret) NEM ez a fájl vezényli: azt a
   ter.js csinálja, ugyanúgy, ahogy egy projekt bejárható terét — a
   főoldal ugyanaz a szerkezet, csak más adattal. Ha ez a fájl nem fut
   le, az enfilád, az alaprajz és a teljes szöveg ott marad.

   Ami maradt ide, két apróság:

     1. A METSZET léptetése. Itt nincs küszöb: a fénykép lappá vált,
        és nem a hely változik, hanem a lépték. Egyetlen aktív lemez
        van; a többi vár.

     2. A regiszter visszaállítása. Az első aktus végén a lap éjszakai
        alapon áll; a metszet viszont papír. A váltást nem a jelenet
        „hangulata” dönti el, hanem hogy melyik aktusban vagyunk.
   ============================================================ */
(function () {
  'use strict';

  var metszet = document.getElementById('metszet');
  var aktus = document.getElementById('aktus');

  /* ---------- 0. egyszerre egy mondat ----------

     Nem effekt: a képkocka egy, tehát a szöveg is legyen egy. A
     blokkok magasságát a szedés hossza adja, így óhatatlanul egymásba
     érnek — a képmező közepéhez közelebbi áll teljes erővel, a másik
     visszahalkul. Semmi nem mozdul, csak fedettség.

     A szabály maga a script.js „9/c. EGYSZERRE EGY MONDAT” szakaszában
     áll, mert a flotta és a készülés nyitása ugyanez. Három másolatban
     élt, és ugyanaz a két hiba volt mindháromban. */

  if (window.Szedes) {
    window.Szedes.indit([].slice.call(document.querySelectorAll('.aktus .jelenet-belul')));
  }

  /* ---------- 1. a metszet léptetése ---------- */

  if (metszet) {
    var lemezek = [].slice.call(metszet.querySelectorAll('.lemez'));
    var jelolok = [].slice.call(metszet.querySelectorAll('.metszet-jelolo'));

    if (lemezek.length && lemezek.length === jelolok.length) {
      /* A ragadós, egyszerre-egy-lemez elrendezést a CSS csak ezzel a
         jelzővel kapcsolja be. Itt tesszük ki, és nem a lap tetején:
         szkript nélkül — vagy ha a lemezek és a jelölők száma nem
         stimmel — a metszet közönséges, végiggörgethető listaként áll,
         mind a hat lemezzel. Ugyanaz a minta, mint a keszules.js-ben
         (5. fázis §17), most a főoldalon is. */
      document.body.setAttribute('data-lemezek', '');

      var hol = 0;
      var kesz = true;
      var jegy = 0;

      /* Ugyanaz a szabály, mint a küszöbnél, csak olcsóbban: a lemez
         akkor lép a képmezőbe, ha van mit mutatnia. A lemezek egy
         ragadós dobozban, egymáson állnak, tehát a böngésző általában
         mindet betölti, amikor a szakasz közeledik — lassú hálózaton
         viszont nem. Enélkül ott egy üres papírfelület állna.

         A jegy azért kell, mert a görgetés közben újabb lemez válhat
         aktuálissá, amíg az előzőre várunk: a régebbi várakozás nem
         írhatja felül az újabb döntést. */
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
      }

      function merre() {
        kesz = true;
        var hatar = window.innerHeight * 0.55;
        var uj = 0;
        for (var i = 0; i < jelolok.length; i++) {
          if (jelolok[i].getBoundingClientRect().top <= hatar) uj = i;
        }
        allit(uj);
      }

      window.addEventListener('scroll', function () {
        if (!kesz) return;
        kesz = false;
        requestAnimationFrame(merre);
      }, { passive: true });
      merre();
    }
  }

  /* ---------- 2. a regiszter ----------

     A ter.js a látott képkocka szerint állítja a lap regiszterét
     (nappal / éjjel). Amint kigördültünk az első aktusból, a lap
     megint papír — az alaprajz és a metszet dokumentum, nem hangulat. */

  if (aktus) {
    var utolso = '';
    var varakozik = false;

    function regiszter() {
      varakozik = false;
      var d = aktus.getBoundingClientRect();
      var bent = d.top < window.innerHeight * 0.5 && d.bottom > window.innerHeight * 0.5;
      if (bent) {
        /* az aktuson belül a ter.js dolga — nem nyúlunk hozzá */
        utolso = 'aktus';
        return;
      }
      if (utolso !== 'lap') {
        utolso = 'lap';
        document.documentElement.setAttribute('data-hangulat', 'nappal');
      }
    }

    window.addEventListener('scroll', function () {
      if (varakozik) return;
      varakozik = true;
      requestAnimationFrame(regiszter);
    }, { passive: true });
    regiszter();
  }
})();
