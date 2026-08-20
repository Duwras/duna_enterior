/* Képnagyító a projekt-aloldalakon.

   A galéria minden képe nagyban is megnyitható; a nagyítóban nyíllal
   és billentyűvel is lehet lépkedni. A <dialog> viszi a fókuszcsapdát
   és az Esc-et, azt nem kell külön megírni.

   LAPOZÁS — nem képcsere, hanem feltárás
   --------------------------------------
   A régi megoldás egyetlen <img> src-jét írta át. Ezzel két baj volt:
   a kép egyik képkockáról a másikra ugrott (dekódolatlanul egy villanás
   üres mező), és a gyorsan nyomott nyíl minden lenyomásra új, hideg
   képet kezdett tölteni — az oldal ettől akadt.

   Most: az új kép EGY PONTBÓL tárul fel — a megnyomott gomb, a
   kattintás vagy a bélyegkép helyéről —, körben kifelé terjedve, amíg
   be nem tölti a képmezőt. Ugyanez visszafelé is: az irányt a kiindulási
   pont hordozza (előző = bal él, következő = jobb él).

   Fizika, egyszer:                      560 ms
     a kivágó kör 0-ról a legtávolabbi képernyősarokig nő,
     lassuló ütemben (cubic-bezier(.16,.84,.34,1))

   Technika: a feltáró réteg kör alakú VÁGÓDOBOZ (border-radius: 50% +
   overflow: hidden), és ezt a dobozt nagyítjuk; a benne álló lap
   pontosan ellentétesen kicsinyül a kiindulási pont körül, tehát a KÉP
   ÁLL, csak a lyuk nő. Mindkettő transform, tehát a mozdulat a
   kompozitoron marad: nincs képkockánkénti újrafestés. (A clip-path
   sugarát a böngésző képkockánként újrarajzolja — teljes képmezős
   fényképen ez látható akadás.) Ugyanaz a megoldás, mint a színpadi
   küszöbé (kuszob.js).

   SEBESSÉGHATÁR: egyszerre egy mozdulat fut. Aki közben tovább lapoz,
   nem sorba állít újabb menetet — a CÉLT mozdítja el. A futó menet a
   végén oda megy, ahová a látogató legutóbb mutatott. Így a nyomva
   tartott nyíl nem tíz animációt és tíz képletöltést jelent, hanem
   egyet, a végállomásra.

   És semmi nem indul el üres kézzel: a kép előbb letöltve és DEKÓDOLVA
   van, csak utána nyílik a kör. Amíg ez tart, a képmezőn a régi kép áll. */
(function () {
  'use strict';

  var parbeszed = document.getElementById('nagyito');
  var kep = document.getElementById('nagyitoKep');
  var szam = document.getElementById('nagyitoSzam');
  if (!parbeszed || !kep) return;

  var linkek = [].slice.call(document.querySelectorAll('[data-nagyit]'));
  if (!linkek.length) return;

  var gombElozo = document.getElementById('nagyitoElozo');
  var gombKov = document.getElementById('nagyitoKovetkezo');

  var lassit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tudAnimalni = typeof Element !== 'undefined' && !!Element.prototype.animate;

  var IDO = 560;        /* a feltárás hossza */
  var KESZ_KAP = 4000;  /* ennyi után animáció nélkül tesszük ki a képet */

  var hol = -1;         /* ami a képmezőben áll (-1: még semmi) */
  var celzott = 0;      /* ahová a látogató legutóbb kért */
  var celPont = null;   /* és onnan, ahonnan kérte */
  var dolgozik = false;
  var jegy = 0;         /* nyitásonként új: a régi menet nem véglegesít */

  /* ---------- a feltáró réteg ----------
     Ugyanaz a képmező, mint a nagyítóé, csak körrel kivágva. A jelölésbe
     nem kell beleírni: itt születik, és aria-hidden — a képaláírást és a
     számlálót a lenti, „igazi” kép viszi. */
  var reteg = document.createElement('div');
  reteg.className = 'nagyito-uj';
  reteg.setAttribute('aria-hidden', 'true');
  reteg.hidden = true;
  var lap = document.createElement('div');
  lap.className = 'nagyito-lap';
  var ujKep = document.createElement('img');
  ujKep.alt = '';
  ujKep.decoding = 'async';
  lap.appendChild(ujKep);
  reteg.appendChild(lap);
  parbeszed.appendChild(reteg);

  /* ---------- képkészenlét ---------- */

  function ido(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function dekodol(im) {
    if (!im.decode) return Promise.resolve();
    return Promise.race([im.decode()['catch'](function () {}), ido(1500)]);
  }

  function betolt(im, url) {
    if (im.getAttribute('src') === url && im.complete && im.naturalWidth > 0) {
      return dekodol(im);
    }
    im.src = url;
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

  /* ---------- a kiindulási pont ---------- */

  function kozep(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  /* Egérrel a mutató helye, billentyűvel a gomb közepe. A click esemény
     billentyűről 0/0 koordinátát ad — az nem pont, hanem hiányzó adat. */
  function pont(e, tartalek) {
    if (e && (e.clientX || e.clientY)) return { x: e.clientX, y: e.clientY };
    return kozep(tartalek);
  }

  function kepmezoKozepe() {
    return { x: (window.innerWidth || 800) / 2, y: (window.innerHeight || 600) / 2 };
  }

  /* a legtávolabbi képernyősarok — addig kell nőnie a lyuknak */
  function sugar(p) {
    var w = window.innerWidth || 800;
    var h = window.innerHeight || 600;
    var t = function (x, y) { return Math.sqrt(x * x + y * y); };
    return Math.max(
      t(p.x, p.y), t(w - p.x, p.y), t(p.x, h - p.y), t(w - p.x, h - p.y)
    ) + 2;
  }

  /* A vágódoboz: a réteg a végállapotban akkora kör, ami a képernyő
     legtávolabbi sarkát is elnyeli; a benne álló lap pontosan a
     képmező. Onnantól már csak nagyítás — layout nem változik. */
  function dobozBe(p, r) {
    reteg.style.left = (p.x - r) + 'px';
    reteg.style.top = (p.y - r) + 'px';
    reteg.style.right = 'auto';
    reteg.style.bottom = 'auto';
    reteg.style.width = (r * 2) + 'px';
    reteg.style.height = (r * 2) + 'px';
    reteg.style.transformOrigin = '50% 50%';

    lap.style.left = (r - p.x) + 'px';
    lap.style.top = (r - p.y) + 'px';
    lap.style.width = (window.innerWidth || 800) + 'px';
    lap.style.height = (window.innerHeight || 600) + 'px';
    lap.style.transformOrigin = p.x + 'px ' + p.y + 'px';
  }

  /* A mozdulat görbéje, mintavételezve. Két kulcskép között a böngésző
     lineárisan interpolál — a doboz nagyítása és a lap ellenskálája
     viszont egymás fordítottja, a szorzatuk csak a kulcsképeken 1,000.
     Ami közte marad, az méretlüktetés a képen: pont úgy fest, mintha a
     lap képkockákat ejtene. 81 mintán a hiba 0,2% alatt marad. */
  var MINTA = 81;

  function kulcsok(s0) {
    var doboz = [], belso = [];
    for (var i = 0; i < MINTA; i++) {
      var x = i / (MINTA - 1);
      var q = 1 - Math.pow(1 - x, 3);              /* lassuló kifutás */
      var s = s0 + (1 - s0) * q;
      doboz.push({ transform: 'scale(' + s + ')' });
      belso.push({ transform: 'scale(' + (1 / s) + ')' });
    }
    return { doboz: doboz, belso: belso };
  }

  /* ---------- felület ---------- */

  function felulet(i) {
    var im = linkek[i].querySelector('img');
    kep.alt = im ? im.alt : '';
    if (szam) szam.textContent = (i + 1) + ' / ' + linkek.length;
  }

  function retegElrejt() {
    reteg.hidden = true;
    reteg.style.left = reteg.style.top = reteg.style.right = reteg.style.bottom = '';
    reteg.style.width = reteg.style.height = '';
    reteg.style.transform = reteg.style.transformOrigin = reteg.style.willChange = '';
    lap.style.left = lap.style.top = lap.style.width = lap.style.height = '';
    lap.style.transform = lap.style.transformOrigin = lap.style.willChange = '';
  }

  /* ---------- előrelátás: a két szomszéd, semmi több ----------
     Tétlen időben. Ennyi kell ahhoz, hogy a következő lapozás ne várjon
     letöltésre — és nem több, hogy egy húszképes galéria ne induljon el
     egyszerre. */
  var elore = {};
  function elorelat() {
    var munka = function () {
      [hol + 1, hol - 1].forEach(function (k) {
        var i = (k + linkek.length) % linkek.length;
        var u = linkek[i].getAttribute('href');
        if (!u || elore[u]) return;
        elore[u] = new Image();
        elore[u].decoding = 'async';
        elore[u].src = u;
      });
    };
    if (window.requestIdleCallback) window.requestIdleCallback(munka, { timeout: 2000 });
    else setTimeout(munka, 400);
  }

  /* ---------- helyváltás ---------- */

  function azonnal(i) {
    hol = celzott = i;
    kep.src = linkek[i].getAttribute('href');
    felulet(i);
    retegElrejt();
    elorelat();
  }

  /* A kérés csak a CÉLT mozdítja. Ha épp fut egy mozdulat, az a végén
     idenéz vissza — nem sorakozik föl mögé újabb menet. */
  function ker(i, p) {
    celzott = (i + linkek.length) % linkek.length;
    celPont = p || celPont || kepmezoKozepe();
    if (celzott === hol) return;
    if (lassit || !tudAnimalni) { azonnal(celzott); return; }
    if (dolgozik) return;
    menj();
  }

  function menj() {
    if (dolgozik) return;
    dolgozik = true;

    var sajat = jegy;
    var cel = celzott;
    var p = celPont || kepmezoKozepe();
    var url = linkek[cel].getAttribute('href');

    Promise.race([betolt(ujKep, url), ido(KESZ_KAP)]).then(function () {
      /* Elavult menet: közben bezárták vagy újranyitották a nagyítót.
         A képernyőn nem változtat semmit. */
      if (!parbeszed.open || sajat !== jegy) { dolgozik = false; return; }

      /* Közben továbblapozott: a most megérkezett kép már nem az, amit
         kér. Nem mutatjuk meg — az újat töltjük helyette. */
      if (celzott !== cel) { dolgozik = false; menj(); return; }

      /* A célkép nem állt össze (hálózat, hibás fájl): maradunk, ahol
         voltunk. Üres képmezőt nem mutatunk. */
      if (!ujKep.naturalWidth) {
        dolgozik = false;
        celzott = hol >= 0 ? hol : cel;
        if (hol < 0) azonnal(cel);   /* nyitáskor legalább a src legyen kint */
        return;
      }

      var r = sugar(p);
      var s0 = Math.max(0.02, 90 / r);      /* résnyi lyuk, nem tűhegy */
      var k = kulcsok(s0);

      dobozBe(p, r);
      reteg.style.transform = 'scale(' + s0 + ')';
      lap.style.transform = 'scale(' + (1 / s0) + ')';
      reteg.style.willChange = 'transform';
      lap.style.willChange = 'transform';
      reteg.hidden = false;

      /* A görbe már a mintákban van, tehát itt lineáris. */
      var idozit = { duration: IDO, easing: 'linear', fill: 'forwards' };
      var anim = reteg.animate(k.doboz, idozit);
      lap.animate(k.belso, idozit);

      var kesz = function () {
        /* A lenti kép megkapja ugyanazt a forrást — a gyorstárból, tehát
           azonnal. Csak akkor vesszük le a feltáró réteget, amikor a
           lenti kép már dekódolva áll: így nincs egy képkocka üresség. */
        felulet(cel);
        hol = cel;
        betolt(kep, url).then(function () {
          requestAnimationFrame(function () {
            retegElrejt();
            dolgozik = false;
            if (sajat !== jegy) return;
            elorelat();
            if (celzott !== hol) menj();
          });
        });
      };

      if (anim.finished) anim.finished.then(kesz)['catch'](kesz);
      else anim.onfinish = kesz;
    });
  }

  /* ---------- nyitás: a bélyegkép helyéről ---------- */

  linkek.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      jegy++;
      hol = -1;
      celzott = i;
      celPont = pont(e, a);
      dolgozik = false;
      retegElrejt();
      kep.removeAttribute('src');
      parbeszed.showModal();
      if (lassit || !tudAnimalni) { azonnal(i); return; }
      menj();
    });
  });

  /* ---------- lapozás ---------- */

  document.getElementById('nagyitoZar').addEventListener('click', function () {
    parbeszed.close();
  });

  if (gombElozo) {
    gombElozo.addEventListener('click', function (e) { ker(celzott - 1, pont(e, gombElozo)); });
  }
  if (gombKov) {
    gombKov.addEventListener('click', function (e) { ker(celzott + 1, pont(e, gombKov)); });
  }

  document.addEventListener('keydown', function (e) {
    if (!parbeszed.open) return;
    /* A billentyűs lapozás a megfelelő él közepéről nyílik — a mozdulat
       iránya így a kép nélkül is olvasható. */
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      ker(celzott - 1, gombElozo ? kozep(gombElozo) : kepmezoKozepe());
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      ker(celzott + 1, gombKov ? kozep(gombKov) : kepmezoKozepe());
    }
  });

  /* a háttérre kattintva is záruljon — a kép maga ne */
  parbeszed.addEventListener('click', function (e) {
    if (e.target === parbeszed) parbeszed.close();
  });

  /* zárás után nincs félbehagyott mozdulat */
  parbeszed.addEventListener('close', function () {
    jegy++;
    retegElrejt();
    dolgozik = false;
    celzott = hol;
  });
})();
