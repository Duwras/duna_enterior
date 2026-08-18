/* ============================================================
   DUNA — THE LIVING INTERIOR
   ter.js — a térbeli réteg viselkedése

   Ugyanaz a felállás, mint a script.js-ben: az ELSŐ réteg a működés
   (a lap tartalma, az adatlap, a linkek), a MÁSODIK a mozgás. Ha ez a
   fájl nem fut le, a lapon akkor is ott van az első nézőpont képe és
   a teljes dokumentum — nem marad üres képernyő.

   Nem tud semmit egyetlen projektről sem. Amit csinál: elolvassa, mit
   írt ki a build a jelölésbe (nézőpontok, nyílások, küszöbfajták,
   kapuk), és ezt vezényli. Új tér = új adat a data/terek.json-ban,
   nem új kód.

   PHASE 3 óta több színpadot is kiszolgál ugyanez a kód: a
   projektlapok bejárható terét ÉS a főoldal enfiládját. A különbség
   nem a viselkedésben van, hanem abban, hogy melyik felületi elem van
   jelen — ami nincs, azzal nem foglalkozik.

   A küszöböt nem ez a fájl animálja — az a kuszob.js dolga.
   ============================================================ */
(function () {
  'use strict';

  if (!window.Kuszob) return;

  var lassit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finom  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var adatlap = document.getElementById('adatlap');
  var homaly  = document.getElementById('homaly');

  /* ============================================================
     ADATLAP — laponként egy, a színpadoktól függetlenül
     ============================================================ */

  function adatlapNyit() {
    if (!adatlap) return;
    adatlap.hidden = false;
    if (homaly) homaly.setAttribute('data-lathato', '');
    var zar = adatlap.querySelector('.adatlap-zar');
    if (zar) zar.focus();
  }
  function adatlapZar() {
    if (!adatlap) return;
    adatlap.hidden = true;
    if (homaly) homaly.removeAttribute('data-lathato');
  }

  if (adatlap) {
    var nyitok = document.querySelectorAll('[data-adatlap="nyit"]');
    for (var n = 0; n < nyitok.length; n++) nyitok[n].addEventListener('click', adatlapNyit);
    var zarok = document.querySelectorAll('[data-adatlap="zar"]');
    for (var z = 0; z < zarok.length; z++) zarok[z].addEventListener('click', adatlapZar);
    if (homaly) homaly.addEventListener('click', adatlapZar);

    /* szkript nélkül nyitva van — most csúsztatjuk félre */
    adatlap.hidden = true;

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !adatlap.hidden) { e.preventDefault(); adatlapZar(); }
    });
  }

  /* ============================================================
     EGY SZÍNPAD
     ============================================================ */

  function indit(szakasz) {
    var szinpad = szakasz.querySelector('.szinpad');
    if (!szinpad) return;

    var szobak = [].slice.call(szinpad.querySelectorAll('.nyilas'));
    if (!szobak.length) return;

    var jelzo   = szakasz.querySelector('.ter-jelzo');
    var tovabb  = szakasz.querySelector('.ter-tovabb');
    var felirat = szakasz.querySelector('.ter-felirat');
    var adatSav = szakasz.querySelector('.ter-adat');
    var kifele  = szakasz.querySelector('.ter-projekt');
    var elo     = document.getElementById('terElo');

    /* A főoldal nem ír nézőpontot a címsorba: ott a helyváltás nem
       önálló állomás, hanem a görgetés következménye. */
    var horgonyoz = szakasz.getAttribute('data-horgony') !== 'nem';

    var hol = 0;
    var celzott = 0;
    var dolgozik = false;
    var varakozo = null;
    var szandek = false;   /* a látogató kérte a váltást, vagy csak görgetett? */

    /* ---------- 1. képek — csak a szomszédság töltődik ---------- */

    function kepekBe(i) {
      for (var k = i - 1; k <= i + 1; k++) {
        var szoba = szobak[k];
        if (!szoba) continue;
        var lista = szoba.querySelectorAll('[data-src], [data-srcset]');
        for (var j = 0; j < lista.length; j++) {
          var e = lista[j];
          if (e.getAttribute('data-srcset')) {
            e.setAttribute('srcset', e.getAttribute('data-srcset'));
            e.removeAttribute('data-srcset');
          }
          if (e.getAttribute('data-src')) {
            e.setAttribute('src', e.getAttribute('data-src'));
            e.removeAttribute('data-src');
          }
        }
      }
    }

    /* ---------- 2. felület ---------- */

    function ter(i) { return szobak[i].querySelector('.ter'); }
    function pad(x) { return (x < 10 ? '0' : '') + x; }
    function fajtaNev(f) { return f === 'ablak' ? 'Ablak' : f === 'kapu' ? 'Kapu' : 'Ajtó'; }

    var IDOALLAPOT = { nappal: 'Nappal', aranyora: 'Aranyóra', ejjel: 'Éjjel' };

    function felulet(i) {
      var t = ter(i);

      if (felirat) {
        var nev = felirat.querySelector('.nev');
        var honnan = felirat.querySelector('.honnan span');
        if (nev) nev.textContent = t.getAttribute('data-nev');
        if (honnan) honnan.textContent = t.getAttribute('data-honnan');
      }
      if (adatSav) {
        var mezo = function (m) { return adatSav.querySelector('[data-mezo="' + m + '"]'); };
        if (mezo('sorszam')) mezo('sorszam').textContent = pad(i + 1) + ' / ' + pad(szobak.length);
        /* Időállapot. A készlet háromelemű (6. fázis): nappal ·
           aranyora · ejjel. Az aranyóra ma egyetlen felvételen sincs
           meg — a szótár azért van itt, hogy amikor megjön, ne
           „Nappal”-ként jelenjen meg. Ismeretlen érték esetén nappal. */
        if (mezo('hangulat')) mezo('hangulat').textContent =
          IDOALLAPOT[t.getAttribute('data-hangulat')] || IDOALLAPOT.nappal;
        if (mezo('anyag')) mezo('anyag').textContent =
          t.getAttribute('data-anyag') || t.getAttribute('data-szak') || '—';
      }

      if (tovabb) {
        var kov = szobak[i + 1] ? ter(i + 1) : null;
        var f = tovabb.querySelector('.fajta');
        var c = tovabb.querySelector('.cel');
        if (kov) {
          if (f) f.textContent = fajtaNev(t.getAttribute('data-kuszob'));
          if (c) c.textContent = kov.getAttribute('data-nev');
        } else {
          /* Az enfilád vége nem zsákutca. */
          if (f) f.textContent = 'Enfilád vége';
          if (c) c.textContent = 'Vissza az első térbe';
        }
      }

      /* ahol a keret valódi projekthez tartozik, oda ki lehet lépni */
      if (kifele) {
        var ut = t.getAttribute('data-projekt');
        kifele.hidden = !ut;
        if (ut) {
          kifele.href = ut;
          var cimke = kifele.querySelector('.cel');
          if (cimke) cimke.textContent = t.getAttribute('data-honnan');
        }
      }

      if (jelzo) {
        var gombok = jelzo.querySelectorAll('button');
        for (var g = 0; g < gombok.length; g++) {
          gombok[g].setAttribute('aria-current', g === i ? 'true' : 'false');
        }
      }

      /* regiszter: nappal / éjjel — a lap alapszíne is ezzel vált */
      var h = t.getAttribute('data-hangulat') || 'nappal';
      szinpad.setAttribute('data-hangulat', h);
      document.documentElement.setAttribute('data-hangulat', h);

      /* a tér saját anyaga adja az akcentet */
      szinpad.style.setProperty('--anyag', t.getAttribute('data-anyagszin') || 'var(--oak)');

      if (elo) elo.textContent = t.getAttribute('data-nev') + ' — ' + t.getAttribute('data-honnan');
    }

    /* ---------- 3. történet ----------

       A görgetés NEM állomás: aki lefelé húz, nem akar tíz
       visszalépést. Ami állomás: a jelzőre kattintás, a kapu, a
       tovább gomb és a billentyű — vagyis amikor a látogató
       kimondottan máshová akart menni. */

    function cim(i) {
      return location.pathname + location.search + '#' + szobak[i].getAttribute('data-nezopont');
    }
    function tortenet(i, szandekos) {
      if (!horgonyoz || !history.replaceState) return;
      /* Nyitott alaprajz alatt a cím az alaprajzé. Egy még futó
         nézőpontváltás különben kiírná alóla a saját horgonyát, és a
         vissza gomb rossz helyre vinne. */
      if (document.documentElement.hasAttribute('data-terv')) return;
      if (szandekos && history.pushState) history.pushState({ nezopont: i }, '', cim(i));
      else history.replaceState({ nezopont: i }, '', cim(i));
    }

    /* ---------- 4. helyváltás — mindig küszöbön át ---------- */

    /* Minden helyváltásnak saját jegye van.

       A küszöb ma VÁR a célképkockára, mielőtt elindulna, és a várakozás
       tetszőlegesen hosszú lehet lassú hálózaton. Enélkül egy gyors
       „tovább — tovább — vissza” alatt két menet dolgozna ugyanazon a
       színpadon, és a régebbi tenné ki a végén a saját képkockáját.
       A jegy ezt zárja ki: ami nem a legutolsó kérés, az nem véglegesít.

       A `dolgozik` a sorosítás (egyszerre egy mozdulat), a jegy a
       BEFEJEZÉS joga. Kettő kell, mert a várakozás és az animáció külön
       szakasz. */
    var jegy = 0;

    function menj(cel, szandekos) {
      cel = Math.max(0, Math.min(szobak.length - 1, cel));
      if (cel === hol) return;
      if (dolgozik) { varakozo = cel; return; }
      dolgozik = true;

      var sajat = ++jegy;
      var innen = hol;
      var irany = cel > innen ? 'elore' : 'vissza';

      kepekBe(cel);
      szinpad.setAttribute('data-atmenet', '');

      var t = ter(innen);
      window.Kuszob.at({
        ter: t,
        cel: ter(cel),
        fajta: (irany === 'elore' ? t : ter(cel)).getAttribute('data-kuszob') || 'ajto',
        irany: irany
      }).then(function (sikerult) {
        dolgozik = false;
        szinpad.removeAttribute('data-atmenet');

        /* Elavult menet: a képernyőn nem változtat semmit — az újabb
           kérés a saját befejezésekor úgyis a helyére teszi. */
        if (sajat !== jegy) return;

        /* Ha a célképkocka nem állt össze, ott maradunk, ahol voltunk.
           A kilépő kép végig teljes fedettséggel állt: a látogató annyit
           lát, hogy a mozdulat nem indult el. Üres képmezőt nem lát. */
        if (sikerult === false) {
          varakozo = null;
          celzott = hol;
          return;
        }

        hol = cel;
        felulet(hol);
        kepekBe(hol);
        elorelat(hol);
        tortenet(hol, szandekos === true || szandek);
        szandek = false;
        if (varakozo !== null && varakozo !== hol) {
          var v = varakozo; varakozo = null; menj(v);
        } else {
          varakozo = null;
        }
      });
    }

    /* ---------- előrelátás: a KÖVETKEZŐ képkocka, semmi több ----------

       Nem az oldal betöltése: a szomszédos két képkocka, dekódolásig.
       Ennyi kell ahhoz, hogy a küszöb ne várakozzon — és nem több, hogy
       a 371 fénykép ne induljon el egyszerre. A ter.js eddig is csak a
       szomszédságra írta ki a src-et (kepekBe); ami hiányzott, az a
       DEKÓDOLÁS: egy letöltött, de dekódolatlan kép is elég ahhoz, hogy
       a feltárás első képkockája üres legyen. */
    function elorelat(i) {
      if (!window.Kuszob.melegit) return;

      /* Tétlen időben, és nem előbb. Mérve: a melegítés a főoldalon
         azonnal indítva 43 KB-tal terhelte az ELSŐ betöltést, mert a
         második képkocka a nyitóképpel egy sávon versengett. A
         következő képkockára viszont csak akkor van szükség, amikor a
         látogató továbblép — addigra a tétlen idő rég lehozta.

         Ha közben mégis hamarabb lép tovább, semmi nem törik el: a
         küszöb saját felkészítése (kuszob.js, keszit) úgyis kivárja a
         célt. Ez gyorsítás, nem feltétel. */
      var munka = function () {
        [i + 1, i - 1].forEach(function (k) {
          if (szobak[k] && szobak[k].hidden) window.Kuszob.melegit(szobak[k]);
        });
      };
      if (window.requestIdleCallback) window.requestIdleCallback(munka, { timeout: 3000 });
      else setTimeout(munka, 1200);
    }

    /* ---------- 5. görgetés: a görgő adja a helyzetet ---------- */

    /* Ha a szakaszban keretenként külön szövegblokk áll (a főoldalon
       így van), akkor AZ szabja a tempót: nem egyenlő szeleteket
       vágunk, hanem a szedés hosszát követjük. Enélkül a szöveg és a
       képkocka szétcsúszna, és a leghosszabb blokk alatt kettőt is
       lépnénk. */
    var jelolok = [].slice.call(szakasz.querySelectorAll('[data-keret]'));
    if (jelolok.length !== szobak.length) jelolok = null;

    var kesz = true;
    function gorgetes() {
      kesz = true;
      var uj;
      if (jelolok) {
        uj = 0;
        var hatar = window.innerHeight * 0.5;
        for (var j = 0; j < jelolok.length; j++) {
          if (jelolok[j].getBoundingClientRect().top <= hatar) uj = j;
        }
      } else {
        var doboz = szakasz.getBoundingClientRect();
        var teljes = szakasz.offsetHeight - window.innerHeight;
        if (teljes <= 0) return;
        var arany = Math.min(0.999, Math.max(0, -doboz.top / teljes));
        uj = Math.floor(arany * szobak.length);
      }
      if (uj !== hol) { celzott = uj; menj(uj, false); }

      /* A fejléc regisztere: amíg a színpad tölti ki a képmezőt,
         sötét felületen áll. Egy attribútum, semmi több. */
      var sz = szinpad.getBoundingClientRect();
      var bent = sz.top < window.innerHeight * 0.35 && sz.bottom > window.innerHeight * 0.65;
      if (bent !== terbenVolt) {
        terbenVolt = bent;
        if (bent) document.body.setAttribute('data-terben', '');
        else document.body.removeAttribute('data-terben');
      }
    }
    var terbenVolt = false;
    window.addEventListener('scroll', function () {
      if (!kesz) return;
      kesz = false;
      requestAnimationFrame(gorgetes);
    }, { passive: true });

    /* A szándékot itt jegyezzük fel: a gördülés úgyis idehoz, de a
       történetben csak az számít, hogy a látogató KÉRTE-e a váltást. */
    function gorgessOda(i) {
      celzott = Math.max(0, Math.min(szobak.length - 1, i));
      szandek = true;
      var y;
      if (jelolok) {
        y = window.scrollY + jelolok[celzott].getBoundingClientRect().top
            - window.innerHeight * 0.5 + 8;
      } else {
        var teljes = szakasz.offsetHeight - window.innerHeight;
        if (teljes <= 0) { menj(celzott, true); return; }
        y = szakasz.offsetTop + (celzott + 0.5) / szobak.length * teljes;
      }
      window.scrollTo({ top: y, behavior: lassit ? 'auto' : 'smooth' });
    }

    /* ---------- 6. kezelés: gomb, billentyű, ujj ---------- */

    if (tovabb) {
      tovabb.addEventListener('click', function () {
        gorgessOda(celzott + 1 >= szobak.length ? 0 : celzott + 1);
      });
    }

    if (jelzo) {
      jelzo.addEventListener('click', function (e) {
        var gomb = e.target.closest('button');
        if (gomb) gorgessOda(+gomb.getAttribute('data-hova'));
      });
    }

    /* kapuk: valódi gombok, tehát billentyűvel is működnek */
    szinpad.addEventListener('click', function (e) {
      var kapu = e.target.closest('.ter-kapu');
      if (!kapu) return;
      var cel = kapu.getAttribute('data-cel') || '';
      if (cel === 'adatlap') { adatlapNyit(); return; }
      if (cel.indexOf('nezopont:') === 0) {
        var id = cel.slice(9);
        for (var i = 0; i < szobak.length; i++) {
          if (szobak[i].getAttribute('data-nezopont') === id) { gorgessOda(i); return; }
        }
      }
      if (cel.indexOf('projekt:') === 0) location.href = '/referenciak/' + cel.slice(8) + '/';
    });

    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented) return;
      if (adatlap && !adatlap.hidden) return;
      if (document.documentElement.hasAttribute('data-terv')) return;
      var fokusz = document.activeElement;
      if (fokusz && /^(INPUT|TEXTAREA|SELECT)$/.test(fokusz.tagName)) return;
      /* csak akkor lépünk, ha ez a szakasz van a képmezőben */
      var d = szakasz.getBoundingClientRect();
      if (d.bottom < window.innerHeight * 0.4 || d.top > window.innerHeight * 0.6) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); gorgessOda(celzott + 1); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); gorgessOda(celzott - 1); }
    });

    /* Vízszintes ujjmozdulat: a valódi kameraállások között lépünk.
       Telefonon a fényképek MAGUK a kamera. */
    var ujjX = 0, ujjY = 0, ujjEl = false;
    szinpad.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { ujjEl = false; return; }
      ujjX = e.touches[0].clientX; ujjY = e.touches[0].clientY; ujjEl = true;
    }, { passive: true });
    szinpad.addEventListener('touchend', function (e) {
      if (!ujjEl) return;
      ujjEl = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - ujjX, dy = t.clientY - ujjY;
      if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      gorgessOda(dx < 0 ? celzott + 1 : celzott - 1);
    }, { passive: true });

    /* ---------- 7. mutató és körülnézés ---------- */

    if (finom) {
      var mutato = document.querySelector('.mutato');
      if (!mutato) {
        mutato = document.createElement('div');
        mutato.className = 'mutato';
        mutato.setAttribute('aria-hidden', 'true');
        mutato.setAttribute('data-allapot', 'rejt');
        document.body.appendChild(mutato);
      }
      szinpad.setAttribute('data-mutato', '');

      szinpad.addEventListener('pointerover', function (e) {
        if (!e.target.closest) return;
        mutato.setAttribute('data-allapot',
          e.target.closest('.ter-kapu') ? 'kapu'
            : e.target.closest('button, a') ? 'tovabb' : 'nez');
      });

      if (!lassit) {
        szinpad.addEventListener('pointermove', function (e) {
          var d = szinpad.getBoundingClientRect();
          var mx = (e.clientX - d.left) / d.width * 2 - 1;
          var my = (e.clientY - d.top) / d.height * 2 - 1;
          szinpad.style.setProperty('--mx', (-mx).toFixed(3));
          szinpad.style.setProperty('--my', (-my).toFixed(3));
          mutato.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
        });
        szinpad.addEventListener('pointerleave', function () {
          szinpad.style.setProperty('--mx', '0');
          szinpad.style.setProperty('--my', '0');
          mutato.setAttribute('data-allapot', 'rejt');
        });
      }
    }

    /* ---------- 8. indulás és mély hivatkozás ---------- */

    for (var s = 1; s < szobak.length; s++) szobak[s].hidden = true;
    szobak[0].hidden = false;

    function horgonyra(hash, azonnal) {
      var id = hash.replace('#', '');
      if (!id) return false;
      for (var h = 0; h < szobak.length; h++) {
        if (szobak[h].getAttribute('data-nezopont') !== id) continue;
        if (azonnal) {
          /* Mély hivatkozás: a képek src-je előbb, a csere utána —
             különben a képmező a keret betöltéséig üres alapszín. */
          kepekBe(h);
          szobak[hol].hidden = true;
          szobak[h].hidden = false;
          hol = h; celzott = h;
        } else {
          gorgessOda(h);
        }
        return true;
      }
      return false;
    }

    if (horgonyoz && location.hash) horgonyra(location.hash, true);

    /* A vissza gomb visszafelé játssza a mozdulatot — nem ugrik. */
    window.addEventListener('popstate', function () {
      if (!horgonyoz) return;
      if (location.hash === '#alaprajz' || !location.hash) return;
      horgonyra(location.hash, false);
    });
    window.addEventListener('hashchange', function () {
      if (!horgonyoz || location.hash === '#alaprajz') return;
      horgonyra(location.hash, false);
    });

    celzott = hol;
    kepekBe(hol);
    felulet(hol);
    /* Induláskor a melegítés a betöltés UTÁN indul: a nyitókép egyedül
       kapja a sávot, ahogy eddig is. */
    if (document.readyState === 'complete') elorelat(hol);
    else window.addEventListener('load', function () { elorelat(hol); });
    /* Induláskor csak akkor írunk a címbe, ha nincs ott más horgony —
       a #dokumentum vagy a #alaprajz nem a mi dolgunk. */
    if (!location.hash || location.hash === '#' + szobak[hol].getAttribute('data-nezopont')) {
      tortenet(hol, false);
    }
    gorgetes();
    szinpad.setAttribute('data-kesz', '');
  }

  var szakaszok = document.querySelectorAll('.enfilad');
  for (var i = 0; i < szakaszok.length; i++) indit(szakaszok[i]);
})();
