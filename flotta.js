/* ============================================================
   DUNA — THE LIVING INTERIOR
   flotta.js — A FLOTTA viselkedése

   A nyitó enfiládot NEM ez a fájl vezényli: azt a ter.js csinálja,
   pontosan úgy, ahogy egy projekt bejárható terét vagy a főoldal
   első aktusát. A flotta ugyanaz a szerkezet, csak más adattal — és
   csak azzal a különbséggel, hogy itt minden küszöb ABLAK, ami
   viszont a data/flotta.json-ban áll, nem itt.

   Ami ide maradt, három apróság, és mindhárom szükséges:

     1. Egyszerre egy mondat. A képkocka egy, tehát a szedés is egy.
        (Ugyanaz a mozdulat, mint a fooldal.js-ben; azt a fájlt a
        #metszet és a #aktus azonosítója köti a főoldalhoz, ezért nem
        közösíthető anélkül, hogy mindkettőt átírnánk.)

     2. A regiszter visszaállítása. A nyitás első képkockája éjszakai
        (a HABLEÁNY a Dunán), a vízvonal viszont papír. A váltást nem
        a jelenet „hangulata” dönti el, hanem hogy melyik szakaszban
        vagyunk.

     3. A vízvonal szűrője: mit őriz az archívum. Valódi gombok,
        aria-pressed, élő számláló — pontosan úgy, mint az alaprajzon.

   Ha ez a fájl nem fut le: a hat állomás, a teljes szedés, a tizenöt
   sor és minden hivatkozás ott marad. Csak a halkítás, a
   regiszterváltás és a szűrés esik ki.
   ============================================================ */
(function () {
  'use strict';

  var nyitas = document.getElementById('flottaNyitas');

  /* ---------- 1. egyszerre egy mondat ---------- */

  /* A szabály a script.js „9/c. EGYSZERRE EGY MONDAT” szakaszában áll:
     a főoldal és a készülés nyitása ugyanez a szerkezet. */
  if (window.Szedes) {
    window.Szedes.indit([].slice.call(document.querySelectorAll('.flotta-szoveg .jelenet-belul')));
  }

  /* ---------- 2. a regiszter ----------

     A ter.js a látott képkocka szerint állítja a lap regiszterét.
     Amint kigördültünk a nyitásból, a lap megint papír: a vízvonal
     index, nem hangulat. */

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

  /* ---------- 3. a vízvonal szűrője ----------

     Nem kategóriára szűr, hanem arra, MIT ŐRÍZ az archívum. Ezért
     hasznos: aki a készülésre kíváncsi, a „Váz” gombbal megkapja azt
     a hat hajót, amiről tényleg van bordafotó. */

  var lap = document.getElementById('vizvonal');
  if (!lap) return;

  var gombok = [].slice.call(lap.querySelectorAll('.flotta-gomb'));
  var sorok  = [].slice.call(lap.querySelectorAll('.hajo'));
  var lista  = lap.querySelector('.hajok');
  var allas  = lap.querySelector('.flotta-allas');
  var mind   = lap.querySelector('.flotta-gomb[data-flotta-allomas="mind"]');
  if (!gombok.length || !mind) return;

  function valasztott() {
    return gombok
      .filter(function (g) {
        return g.dataset.flottaAllomas !== 'mind' && g.getAttribute('aria-pressed') === 'true';
      })
      .map(function (g) { return g.dataset.flottaAllomas; });
  }

  /* ---------- melyik négyzet melyik ----------

     Az öt jel HELYE hordozza a jelentést, és a hely önmagában néma.
     A jelmagyarázat megtanítja (ott mind az öt hely látszik), ez a
     kiemelés pedig visszakeresi: amíg a „Váz” gomb fölött áll az
     egér — vagy amíg arra szűrünk —, minden sorban az első négyzet
     marad hangsúlyos, a többi elhalkul. Így a gomb felirata és az
     oszlop helye egyszer és jól összeér. */

  var rogzitett = '';

  function kiemel(kulcs) {
    if (!lista) return;
    if (kulcs) lista.setAttribute('data-kiemelt', kulcs);
    else lista.removeAttribute('data-kiemelt');
  }

  function frissit() {
    var kivalasztva = valasztott();
    var szures = kivalasztva.length > 0;
    mind.setAttribute('aria-pressed', szures ? 'false' : 'true');

    var latszik = 0;
    sorok.forEach(function (s) {
      var van = (s.dataset.allomas || '').split(' ').filter(Boolean);
      /* ÉS, nem VAGY: két gomb együtt azt kérdezi, melyik hajóról
         van MINDKETTŐ. Ez a hasznos kérdés — a „vagy” csak
         összeadná a listákat. */
      var mutat = !szures || kivalasztva.every(function (k) { return van.indexOf(k) !== -1; });
      s.hidden = !mutat;
      if (mutat) latszik++;
    });

    /* Egy állomás: kiemelhető. Kettő vagy több: nincs egyetlen hely,
       amit ki lehetne emelni — akkor a jelsor marad, ahogy van. */
    rogzitett = kivalasztva.length === 1 ? kivalasztva[0] : '';
    kiemel(rogzitett);

    if (allas) {
      allas.textContent = szures
        ? latszik + ' hajó · ' + kivalasztva.length + ' állomás együtt'
        : latszik + ' hajó · a teljes flotta';
    }
  }

  gombok.forEach(function (g) {
    var kulcs = g.dataset.flottaAllomas;

    if (kulcs !== 'mind') {
      var ra   = function () { kiemel(kulcs); };
      var role = function () { kiemel(rogzitett); };
      g.addEventListener('mouseenter', ra);
      g.addEventListener('mouseleave', role);
      g.addEventListener('focus', ra);
      g.addEventListener('blur', role);
    }

    g.addEventListener('click', function () {
      if (g.dataset.flottaAllomas === 'mind') {
        gombok.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      } else {
        g.setAttribute('aria-pressed', g.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      }
      frissit();
    });
  });

  /* A jelmagyarázat sorai ugyanezt teszik: rájuk mutatva a vízvonalon
     is az a hely gyullad ki, amiről a mondat szól. */
  [].slice.call(lap.querySelectorAll('.jelcsoport p[data-allomas]')).forEach(function (p) {
    p.addEventListener('mouseenter', function () { kiemel(p.dataset.allomas); });
    p.addEventListener('mouseleave', function () { kiemel(rogzitett); });
  });

  frissit();
})();
