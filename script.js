/* dunaenterior.hu — közös viselkedés és mozgás.

   Két rétegre bomlik. Az elsőben a működés van: menü, fejléc, évszám —
   enélkül az oldal használhatatlan lenne. A másodikban a mozgás:
   feltárások, parallax, vízszintes szakasz, szalag. A második réteg
   végig díszítés — ha bármelyik darabja kimarad, az oldal attól még
   teljes: a tartalom ott van, a linkek működnek.

   Két közös motor hajtja az egészet, hogy ne szaporodjanak a
   figyelők: egy görgetés-figyelő (képkockánként egyszer olvas
   pozíciót) és egy képkocka-motor (csak addig fut, amíg van dolga).

   Minden mozgás kikapcsol, ha a látogató rendszerszinten kérte. */
(function () {
  'use strict';

  var lassit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finom  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var doc    = document.documentElement;

  var keskeny = function () { return window.innerWidth <= 900; };

  /* ============================================================
     0. motorok
     ============================================================ */

  /* --- görgetés: minden feliratkozó egy képkockán belül fut le --- */
  var gorgetok = [];
  var frameKesz = true;

  function gorgetesLep() {
    frameKesz = true;
    var y = window.pageYOffset;
    for (var i = 0; i < gorgetok.length; i++) gorgetok[i](y);
  }
  function gorgetesre(fn) {
    gorgetok.push(fn);
    fn(window.pageYOffset);
  }
  window.addEventListener('scroll', function () {
    if (!frameKesz) return;
    frameKesz = false;
    requestAnimationFrame(gorgetesLep);
  }, { passive: true });

  /* --- képkocka-motor: alvó, amíg egyetlen tagja sem kér munkát --- */
  var motorosok = [];
  var motorFut = false;
  var elozoIdo = 0;

  function motorLep(ido) {
    /* dt = hány 60 fps-es képkockányi idő telt el; a felső korlát a
       háttérből visszatérő fület védi az ugrástól */
    var dt = Math.min((ido - elozoIdo) / 16.667, 3);
    elozoIdo = ido;

    var dolgozik = false;
    for (var i = 0; i < motorosok.length; i++) {
      if (motorosok[i].aktiv) { motorosok[i].fn(dt); dolgozik = true; }
    }
    if (dolgozik) requestAnimationFrame(motorLep);
    else motorFut = false;
  }

  function motorra(fn) {
    var tag = {
      fn: fn,
      aktiv: false,
      ebreszt: function (be) {
        tag.aktiv = be;
        if (!be || motorFut) return;
        motorFut = true;
        elozoIdo = performance.now();
        requestAnimationFrame(motorLep);
      }
    };
    motorosok.push(tag);
    return tag;
  }

  /* --- görgetési lendület: a szalag ebből kap lökést ---

     Nem a motorban csillapítjuk, hanem az utolsó görgetés óta eltelt
     időből számoljuk: így akárhány felhasználója lehet, mindegyik
     ugyanazt az értéket kapja, és akkor is elhal, ha épp egyik motor
     sem fut. */
  var lokesEro = 0;
  var lokesIdo = 0;
  var utolsoY = window.pageYOffset;

  gorgetesre(function (y) {
    lokesEro = Math.max(-60, Math.min(60, lokesEro + (y - utolsoY)));
    lokesIdo = performance.now();
    utolsoY = y;
  });

  function lendulet() {
    var kepkockak = (performance.now() - lokesIdo) / 16.667;
    return lokesEro * Math.pow(0.86, kepkockak);
  }

  /* --- átméretezés: egy helyen, ritkítva --- */
  var meretezok = [];
  var meretIdozit = 0;
  function meretre(fn) { meretezok.push(fn); }
  window.addEventListener('resize', function () {
    clearTimeout(meretIdozit);
    meretIdozit = setTimeout(function () {
      for (var i = 0; i < meretezok.length; i++) meretezok[i]();
      gorgetesLep();
    }, 160);
  });

  /* ============================================================
     1. mobil menü
     ============================================================ */

  var gomb = document.getElementById('menuGomb');
  var menu = document.getElementById('menu');

  if (gomb && menu) {
    gomb.addEventListener('click', function () {
      var nyitva = menu.dataset.nyitva === 'igen';
      menu.dataset.nyitva = nyitva ? 'nem' : 'igen';
      gomb.setAttribute('aria-expanded', nyitva ? 'false' : 'true');
      gomb.textContent = nyitva ? 'Menü' : 'Bezár';
    });
    /* linkre kattintva záruljon — különben a menü rajta marad az új oldalon */
    menu.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') return;
      menu.dataset.nyitva = 'nem';
      gomb.setAttribute('aria-expanded', 'false');
      gomb.textContent = 'Menü';
    });
  }

  /* ============================================================
     2. fejléc: vonal, elrejtés, haladásjelző
     ============================================================ */

  var fejlec = document.getElementById('fejlec');
  if (fejlec) {
    var halado = document.createElement('div');
    halado.className = 'halado';
    halado.setAttribute('aria-hidden', 'true');
    fejlec.appendChild(halado);

    var elozoFejY = window.pageYOffset;

    gorgetesre(function (y) {
      fejlec.classList.toggle('uszik', y > 8);

      /* Lefelé haladva a fejléc elhúzódik az útból, felfelé azonnal
         visszajön. Nyitott menü mellett soha — az kilógna a képből. */
      var nyitva = menu && menu.dataset.nyitva === 'igen';
      if (y > 260 && y > elozoFejY + 4 && !nyitva) fejlec.classList.add('bujik');
      else if (y < elozoFejY - 4 || y <= 260) fejlec.classList.remove('bujik');
      elozoFejY = y;

      var teljes = doc.scrollHeight - window.innerHeight;
      halado.style.transform =
        'scaleX(' + (teljes > 0 ? Math.min(y / teljes, 1).toFixed(4) : 0) + ')';
    });
  }

  /* ============================================================
     3. belépő mozgás + szavankénti címfeltárás
     ============================================================ */

  /* A címeket szavakra bontjuk, hogy egyenként fordulhassanak a sorba.
     A bejárás megőrzi a sortöréseket és a kiemeléseket — a hero h1-ben
     <br> és <em> is van, azokat elveszíteni sortörés-hibát adna. */
  function szavakra(honnan, hova, allas) {
    Array.prototype.forEach.call(honnan.childNodes, function (cs) {
      if (cs.nodeType === 3) {
        cs.nodeValue.split(/(\s+)/).forEach(function (resz) {
          if (!resz) return;
          if (/^\s+$/.test(resz)) { hova.appendChild(document.createTextNode(' ')); return; }
          var kulso = document.createElement('span');
          var belso = document.createElement('span');
          kulso.className = 'szo';
          belso.className = 'szo-b';
          belso.textContent = resz;
          belso.style.transitionDelay = (allas.n * 42) + 'ms';
          kulso.appendChild(belso);
          hova.appendChild(kulso);
          allas.n++;
        });
        return;
      }
      if (cs.nodeType !== 1) return;
      if (cs.tagName === 'BR') { hova.appendChild(document.createElement('br')); return; }
      var mas = cs.cloneNode(false);
      szavakra(cs, mas, allas);
      hova.appendChild(mas);
    });
  }

  var feltarando = Array.prototype.slice.call(document.querySelectorAll('.jon'));

  if (!lassit) {
    document.querySelectorAll('main h1, main h2').forEach(function (cim) {
      if (cim.classList.contains('rejtett') || cim.dataset.tordel === 'nem') return;
      var uj = document.createDocumentFragment();
      szavakra(cim, uj, { n: 0 });
      cim.textContent = '';
      cim.appendChild(uj);
      cim.classList.add('tordelt');
      if (!cim.classList.contains('jon')) feltarando.push(cim);
    });
  }

  if (lassit || !('IntersectionObserver' in window)) {
    feltarando.forEach(function (el) { el.classList.add('itt'); });
  } else {
    var figyelo = new IntersectionObserver(function (bejegyzesek) {
      bejegyzesek.forEach(function (b) {
        if (!b.isIntersecting) return;
        b.target.classList.add('itt');
        figyelo.unobserve(b.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    feltarando.forEach(function (el) { figyelo.observe(el); });
  }

  /* ============================================================
     4. parallax
     ============================================================ */

  /* A képek a lapnál lassabban mozognak. Az erőt a data-parallax adja
     (negatív érték ellenirányba húz), az oldalsó sodrást a
     data-parallax-x. A számítás a látómező közepéhez viszonyít, így a
     réteg akkor áll az alaphelyzetében, amikor épp középen jár. */
  var retegek = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));

  if (retegek.length && !lassit) {
    var reteget = function () {
      retegek.forEach(function (el) {
        var d = el.getBoundingClientRect();
        el._kozep = d.top + window.pageYOffset + d.height / 2;
        el._ero  = parseFloat(el.dataset.parallax) || 0;
        el._eroX = parseFloat(el.dataset.parallaxX) || 0;
      });
    };
    reteget();
    meretre(reteget);
    /* a képek később érkeznek, mint a lap — akkor változik a magasság */
    window.addEventListener('load', function () { reteget(); gorgetesLep(); });

    gorgetesre(function (y) {
      var kozep = y + window.innerHeight / 2;
      retegek.forEach(function (el) {
        var tav = kozep - el._kozep;
        /* a látómezőn jóval kívül eső réteget hiába számolnánk */
        if (Math.abs(tav) > window.innerHeight * 2) return;
        el.style.setProperty('--py', (tav * el._ero).toFixed(1) + 'px');
        if (el._eroX) el.style.setProperty('--px', (tav * el._eroX).toFixed(1) + 'px');
      });
    });
  }

  /* ============================================================
     5. számlálók
     ============================================================ */

  /* A hero adatai nullától futnak fel. Csak szám lehet bennük — a
     mértékegység a szomszéd <small>-ban ül, azt nem bántjuk. */
  var szamlalok = document.querySelectorAll('[data-szam]');

  if (szamlalok.length) {
    var szamlal = function (el) {
      var cel = parseInt(el.dataset.szam, 10);
      if (isNaN(cel)) return;
      if (lassit) { el.textContent = cel; return; }
      /* A szám számjegyeinek kimért helyet foglalunk, különben a
         futás közben rövidebb érték magával rántaná a mértékegységet. */
      el.style.display = 'inline-block';
      el.style.minWidth = String(cel).length + 'ch';
      var kezdet = performance.now();
      var ido = 1100;
      var lep = function (most) {
        var p = Math.min((most - kezdet) / ido, 1);
        var lassulo = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(cel * lassulo);
        if (p < 1) requestAnimationFrame(lep);
      };
      el.textContent = '0';
      requestAnimationFrame(lep);
    };

    if (lassit || !('IntersectionObserver' in window)) {
      szamlalok.forEach(function (el) { el.textContent = el.dataset.szam; });
    } else {
      var szamFigyelo = new IntersectionObserver(function (b) {
        b.forEach(function (e) {
          if (!e.isIntersecting) return;
          szamFigyelo.unobserve(e.target);
          szamlal(e.target);
        });
      }, { threshold: 0.6 });
      szamlalok.forEach(function (el) { szamFigyelo.observe(el); });
    }
  }

  /* ============================================================
     6. vízszintes szakasz
     ============================================================ */

  /* A szakasz magasra nő, a belseje kitapad, és a vonat annyit csúszik
     oldalra, amennyit a látogató lefelé görgetett. A követés lágy:
     a vonat a célpozíció felé húz, nem ugrik rá — ettől lesz súlya.

     Keskeny kijelzőn és csendes módban marad a .kezi állapot, vagyis a
     natív, ujjal húzható vízszintes görgetés. */
  document.querySelectorAll('[data-vizszintes]').forEach(function (szakasz) {
    var ragad = szakasz.querySelector('.vizszintes-ragad');
    var vonat = szakasz.querySelector('.vonat');
    var halad = szakasz.querySelector('.vizszintes-halad');
    if (!ragad || !vonat) return;

    var ut = 0, cel = 0, most = 0, atvesz = false;

    var meret = function () {
      atvesz = !lassit && !keskeny();
      szakasz.classList.toggle('kezi', !atvesz);

      if (!atvesz) {
        szakasz.style.height = '';
        vonat.style.transform = '';
        return;
      }
      /* A vonat vége a jobb oldali margónál álljon meg, ne a képernyő
         peremén: a scrollWidth a záró belső margót nem számolja bele,
         ezért adjuk hozzá a bal oldaliból kiolvasott értéket. */
      var margo = parseFloat(getComputedStyle(vonat).paddingLeft) || 0;
      ut = Math.max(vonat.scrollWidth + margo - window.innerWidth, 0);
      /* a függőleges út valamivel hosszabb: így nem rohan a szem előtt */
      szakasz.style.height = (window.innerHeight + ut * 1.15) + 'px';
      most = cel;
    };

    var tag = motorra(function (dt) {
      var kulonbseg = cel - most;
      if (Math.abs(kulonbseg) < .12) { most = cel; }
      else { most += kulonbseg * Math.min(.13 * dt, 1); }
      vonat.style.transform = 'translate3d(' + most.toFixed(1) + 'px,0,0)';
    });

    gorgetesre(function () {
      if (!atvesz) return;
      /* a szakasz tetejéhez képest mérünk, nem a lap tetejéhez: a
         fölötte lévő képek betöltése különben elcsúsztatná a számítást */
      var hossz = szakasz.offsetHeight - window.innerHeight;
      var p = hossz > 0 ? -szakasz.getBoundingClientRect().top / hossz : 0;
      p = Math.max(0, Math.min(1, p));
      cel = -p * ut;
      if (halad) halad.style.setProperty('--p', p.toFixed(4));
    });

    meret();
    meretre(meret);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (b) {
        tag.ebreszt(atvesz && b[0].isIntersecting);
      }, { rootMargin: '20% 0px' }).observe(szakasz);
    } else {
      tag.ebreszt(atvesz);
    }
  });

  /* ============================================================
     7. végtelen szalag
     ============================================================ */

  /* A felirat magától sodródik, és a görgetés meglöki: lefelé haladva
     gyorsul, felfelé lassul vagy visszafordul. A tartalom annyiszor
     ismétlődik, hogy két képernyőnyit kitöltsön, így a visszaugrás a
     periódus határán nem látszik. */
  document.querySelectorAll('[data-szalag]').forEach(function (szalag) {
    var sor = szalag.querySelector('.szalag-sor');
    var elso = sor && sor.firstElementChild;
    if (!elso || lassit) return;

    var alap = parseFloat(szalag.dataset.szalag) || .5;
    var x = 0, periodus = 0;

    var meret = function () {
      /* a felesleges másolatokat eldobjuk, aztán újra feltöltjük */
      while (sor.children.length > 1) sor.removeChild(sor.lastElementChild);
      var egy = elso.getBoundingClientRect().width;
      if (!egy) return;
      /* Legalább egy másolat kell, különben nincs mihez visszaugrani.
         A felső korlát a rejtett vagy még nulla szélességű ablakot
         fogja meg: abból különben ezer másolat születne. */
      var kell = Math.min(Math.max(Math.ceil((window.innerWidth * 2) / egy) + 1, 2), 12);
      for (var i = 1; i < kell; i++) {
        var masolat = elso.cloneNode(true);
        masolat.setAttribute('aria-hidden', 'true');
        sor.appendChild(masolat);
      }
      periodus = sor.children[1].getBoundingClientRect().left -
                 elso.getBoundingClientRect().left;
    };

    var tag = motorra(function (dt) {
      if (!periodus) return;
      x -= (alap + lendulet() * .22) * dt;
      while (x <= -periodus) x += periodus;
      while (x > 0) x -= periodus;
      sor.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    });

    meret();
    meretre(function () { meret(); });
    document.fonts && document.fonts.ready.then(meret);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (b) {
        tag.ebreszt(b[0].isIntersecting);
      }, { rootMargin: '10% 0px' }).observe(szalag);
    } else {
      tag.ebreszt(true);
    }
  });

  /* ============================================================
     8. kurzorra reagáló apróságok
     ============================================================ */

  if (finom && !lassit) {
    /* mágneses gombok: a kurzor felé billennek egy hajszálnyit */
    document.querySelectorAll('.gomb, .link-nyil').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var d = el.getBoundingClientRect();
        el.style.setProperty('--mx', (((e.clientX - d.left) / d.width - .5) * 10).toFixed(1) + 'px');
        el.style.setProperty('--my', (((e.clientY - d.top) / d.height - .5) * 6).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      });
    });

    /* a kártyán a kurzor után úszik a fényfolt */
    document.querySelectorAll('.kartya .keret').forEach(function (keret) {
      keret.addEventListener('pointermove', function (e) {
        var d = keret.getBoundingClientRect();
        keret.style.setProperty('--hx', (e.clientX - d.left).toFixed(0) + 'px');
        keret.style.setProperty('--hy', (e.clientY - d.top).toFixed(0) + 'px');
      });
    });
  }

  /* ============================================================
     9. lábléc mögüle előbukkanó rétege
     ============================================================ */

  /* A tartalom fedi a láblécet, és a lap aljára érve engedi elő. Ehhez
     a főtartalom alá pont annyi hely kell, amennyi a lábléc — ezt csak
     mérésből tudjuk, ezért kapcsol be szkriptből. */
  var lablec = document.querySelector('.lablec');
  var fotartalom = document.getElementById('tartalom');

  if (lablec && fotartalom && !lassit) {
    var lablecMeret = function () {
      if (keskeny()) {
        document.body.classList.remove('lablec-fedes');
        fotartalom.style.marginBottom = '';
        return;
      }
      document.body.classList.add('lablec-fedes');
      fotartalom.style.marginBottom = lablec.offsetHeight + 'px';
    };
    lablecMeret();
    meretre(lablecMeret);
    window.addEventListener('load', lablecMeret);
  }

  /* ============================================================
     10. oldal-áttűnés
     ============================================================ */

  /* Az oldalak közti váltás ne villanjon: a régi lap elhalványul, az új
     felúszik. Csak saját, sima linkeken — a nagyítót, a letöltést, az
     új lapra nyílót és a módosítóbillentyűs kattintást békén hagyjuk. */
  if (!lassit) {
    doc.classList.add('atmenet');
    /* Az időzítő biztosíték: a képkocka-kérés nem fut le olyan lapon,
       amit a böngésző nem rajzol (háttérfül, beágyazott előnézet) — a
       lap addig átlátszó maradna. */
    var betoltve = function () { doc.classList.add('betoltve'); };
    requestAnimationFrame(betoltve);
    setTimeout(betoltve, 80);

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target || a.hasAttribute('download') || a.hasAttribute('data-nagyit')) return;
      if (a.origin !== location.origin) return;

      var cel = a.getAttribute('href');
      if (!cel || cel.charAt(0) === '#') return;
      if (a.pathname === location.pathname && a.search === location.search) return;

      e.preventDefault();
      doc.classList.add('tavozik');
      setTimeout(function () { location.href = a.href; }, 230);
      /* ha a navigáció mégsem indulna el, ne maradjon üres a lap */
      setTimeout(function () { doc.classList.remove('tavozik'); }, 2500);
    });

    /* visszalépéskor a böngésző a gyorsítótárból veszi elő a lapot —
       az „elmegyünk” állapot különben rajta ragadna */
    window.addEventListener('pageshow', function () {
      doc.classList.remove('tavozik');
    });
  }

  /* ============================================================
     11. évszám a láblécben
     ============================================================ */

  var ev = document.getElementById('ev');
  if (ev) ev.textContent = new Date().getFullYear();
})();
