/* ============================================================
   DUNA — THE LIVING INTERIOR
   terv.js — AZ ALAPRAJZ viselkedése

   Két dolgot csinál, és semmi mást:

     1. SZŰR — a hét meglévő kategória szerint. Valódi gombok,
        aria-pressed, élő számláló. A saját lapján a cím is hordozza
        az állapotot, hogy a megosztott hivatkozás ugyanazt mutassa.

     2. NYIT / ZÁR — a tereken és a főoldalon fedőrétegként. A nyitás
        KAPU: a kuszob.js feltárulása, ugyanazzal a fizikával, csak
        rövidebb úton (--motion-terv). Nincs második átmenet.

   Ha ez a fájl nem fut le: az alaprajz akkor is teljes, olvasható és
   végigkattintható lap — a saját címén és a főoldal végén egyaránt.
   Csak a szűrés és a fedőréteg marad el.
   ============================================================ */
(function () {
  'use strict';

  var lassit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. SZŰRÉS
     ============================================================ */

  var lapok = [].slice.call(document.querySelectorAll('.alaprajz'));

  lapok.forEach(function (lap) {
    var gombok = [].slice.call(lap.querySelectorAll('.terv-gomb'));
    var cellak = [].slice.call(lap.querySelectorAll('.cella'));
    var szarnyak = [].slice.call(lap.querySelectorAll('.szarny'));
    var allas = lap.querySelector('.terv-allas');
    var mind = lap.querySelector('.terv-gomb[data-terv-kat="mind"]');
    if (!gombok.length || !mind) return;

    var sajatLap = lap.getAttribute('data-hely') === 'lap';

    function valasztott() {
      return gombok
        .filter(function (g) {
          return g.dataset.tervKat !== 'mind' && g.getAttribute('aria-pressed') === 'true';
        })
        .map(function (g) { return g.dataset.tervKat; });
    }

    function frissit() {
      var kivalasztva = valasztott();
      var szures = kivalasztva.length > 0;
      mind.setAttribute('aria-pressed', szures ? 'false' : 'true');

      var latszik = 0;
      cellak.forEach(function (c) {
        var mutat = !szures || kivalasztva.indexOf(c.dataset.kat) !== -1;
        c.hidden = !mutat;
        if (mutat) latszik++;
      });
      /* üres szárny nem marad ott üres kerettel */
      szarnyak.forEach(function (sz) {
        sz.hidden = szures && kivalasztva.indexOf(sz.dataset.kat) === -1;
      });

      if (allas) {
        allas.textContent = szures
          ? latszik + ' projekt · ' + kivalasztva.length + ' kategória'
          : latszik + ' projekt · mind a ' + szarnyak.length + ' szárny';
      }

      if (sajatLap) {
        history.replaceState(history.state, '',
          location.pathname + (szures ? '#' + kivalasztva.join('+') : ''));
      }
    }

    gombok.forEach(function (g) {
      g.addEventListener('click', function () {
        if (g.dataset.tervKat === 'mind') {
          gombok.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        } else {
          g.setAttribute('aria-pressed', g.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        }
        frissit();
      });
    });

    if (sajatLap) {
      decodeURIComponent(location.hash.slice(1)).split('+').filter(Boolean).forEach(function (kat) {
        var g = gombok.filter(function (x) { return x.dataset.tervKat === kat; })[0];
        if (g) g.setAttribute('aria-pressed', 'true');
      });
    }
    frissit();
  });

  /* ============================================================
     2. FEDŐRÉTEG
     ============================================================ */

  var terv = document.getElementById('alaprajz');
  if (!terv) return;

  var belso = terv.querySelector('.alaprajz-lap');
  var eredetiHely = terv.getAttribute('data-hely');   /* fedo | folyam */
  var nyitva = false;
  var dolgozik = false;
  var honnan = null;      /* ide adjuk vissza a fókuszt */
  var hovaVissza = 0;     /* a folyamban álló alaprajznál a görgetés helye */
  var sajatLepes = false; /* mi tettük-e be a történetbe */

  /* A nyílás, amin át feltárul: mindig az éppen látott képkocka saját
     nyílása. Ugyanaz az adat, amiből a rétegmaszk és a küszöb számol —
     ezért jelenik meg az alaprajz pontosan ott, ahol az ajtó volt. */
  function nyilasAtvesz() {
    var ter = document.querySelector('.nyilas:not([hidden]) .ter');
    var v = ['--nyx', '--nyy', '--nyrx', '--nyry'];
    var cel = ['--terv-x', '--terv-y', '--terv-rx', '--terv-ry'];
    var alap = ['50%', '50%', '20%', '22%'];
    for (var i = 0; i < v.length; i++) {
      terv.style.setProperty(cel[i], (ter && ter.style.getPropertyValue(v[i])) || alap[i]);
    }
  }

  /* Nyitott alaprajz mögött nincs mit tabolni. Nem fókuszcsapdát
     építünk kézzel: a testvéreket tesszük inertté fölfelé a body-ig,
     így a főoldalon is működik, ahol az alaprajz a folyamban áll. */
  function hatterKi(be) {
    var el = terv;
    while (el && el.parentNode && el.parentNode.nodeType === 1) {
      var tesok = el.parentNode.children;
      for (var i = 0; i < tesok.length; i++) {
        if (tesok[i] === el) continue;
        if (be) tesok[i].setAttribute('inert', ''); else tesok[i].removeAttribute('inert');
      }
      el = el.parentNode;
      if (el === document.body) break;
    }
  }

  function nyit(tortenet) {
    if (nyitva || dolgozik) return;
    dolgozik = true;
    nyitva = true;
    honnan = document.activeElement;

    if (eredetiHely === 'folyam') {
      hovaVissza = window.scrollY;
      terv.setAttribute('data-hely', 'fedo');
    }
    nyilasAtvesz();
    terv.removeAttribute('data-maszk');
    terv.hidden = false;
    document.documentElement.setAttribute('data-terv', '');
    hatterKi(true);

    /* A szerepet csak most kapja meg, és nem a jelölésben: a főoldalon
       ugyanez az elem a folyamban álló jelenet, ott NEM párbeszédablak.
       Fedőrétegként viszont az — a háttér inert, a fókusz bent van, az
       Esc zár. A képernyőolvasó ebből tudja meg, hogy réteg nyílt.
       8. fázis. */
    terv.setAttribute('role', 'dialog');
    terv.setAttribute('aria-modal', 'true');

    var zaroGomb = terv.querySelector('[data-terv="zar"]');
    if (zaroGomb) zaroGomb.focus({ preventScroll: true });

    if (tortenet !== false && history.pushState) {
      history.pushState({ terv: 1 }, '', '#alaprajz');
      sajatLepes = true;
    }

    var kesz = (window.Kuszob && belso && !lassit)
      ? window.Kuszob.feltarul(terv, belso, { fajta: 'kapu', ms: 620 })
      : Promise.resolve();

    kesz.then(function () {
      terv.setAttribute('data-maszk', 'nincs');
      dolgozik = false;
    });
  }

  function zar(tortenet) {
    if (!nyitva || dolgozik) return;
    dolgozik = true;

    /* Visszafelé ugyanaz a mozdulat, gyorsabban — a látogató ugyanazon
       a kapun lép vissza, amin bejött. */
    terv.removeAttribute('data-maszk');
    var kesz = (window.Kuszob && belso && !lassit)
      ? window.Kuszob.feltarul(terv, belso, { fajta: 'kapu', ms: 620, vissza: true })
      : Promise.resolve();

    kesz.then(function () {
      terv.setAttribute('data-maszk', 'nincs');
      nyitva = false;
      dolgozik = false;
      hatterKi(false);
      document.documentElement.removeAttribute('data-terv');
      terv.removeAttribute('role');
      terv.removeAttribute('aria-modal');

      if (eredetiHely === 'folyam') {
        terv.setAttribute('data-hely', 'folyam');
        window.scrollTo({ top: hovaVissza, behavior: 'auto' });
      } else {
        terv.hidden = true;
      }
      if (honnan && honnan.focus) honnan.focus({ preventScroll: true });

      if (tortenet === false) return;
      if (sajatLepes) {
        sajatLepes = false;
        history.back();
      } else if (location.hash === '#alaprajz' && history.replaceState) {
        /* mély hivatkozásból nyílt: a cím ne maradjon az alaprajzé */
        history.replaceState(history.state, '', location.pathname + location.search);
      }
    });
  }

  /* ---------- kezelés ---------- */

  var nyitok = document.querySelectorAll('[data-terv="nyit"]');
  for (var i = 0; i < nyitok.length; i++) {
    nyitok[i].addEventListener('click', function (e) { e.preventDefault(); nyit(); });
  }
  var zarok = terv.querySelectorAll('[data-terv="zar"]');
  for (var z = 0; z < zarok.length; z++) {
    zarok[z].addEventListener('click', function () { zar(); });
  }

  /* Esc: ha az alaprajz nyitva van, becsukja. Ha az adatlap van nyitva,
     azt a ter.js zárja — ide nem tartozik. Egyébként nyit: ez az a
     billentyű, amit a szerkezet ígér. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || e.defaultPrevented) return;
    if (nyitva) { zar(); return; }
    var adatlap = document.getElementById('adatlap');
    if (adatlap && !adatlap.hidden) return;
    var fokusz = document.activeElement;
    if (fokusz && /^(INPUT|TEXTAREA|SELECT)$/.test(fokusz.tagName)) return;
    nyit();
  });

  /* A vissza gomb valódi állomás: az alaprajz megnyitása helyváltás. */
  window.addEventListener('popstate', function () {
    var kell = location.hash === '#alaprajz';
    if (kell && !nyitva) { sajatLepes = false; nyit(false); }
    if (!kell && nyitva) { sajatLepes = false; zar(false); }
  });

  /* Mély hivatkozás: /referenciak/<slug>/#alaprajz azonnal a
     szerkezetet nyitja, a megfelelő cellán állva. */
  if (location.hash === '#alaprajz') {
    terv.setAttribute('data-maszk', 'nincs');
    nyit(false);
  }

  window.Terv = { nyit: nyit, zar: zar, nyitvaE: function () { return nyitva; } };
})();
