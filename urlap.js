/* Kapcsolati űrlap.

   Az oldal statikus, tehát a küldést egy külön végpont végzi (lásd
   worker/). Az itt futó kód csak annyit csinál, hogy ellenőrzi a
   mezőket, beszerzi a reCAPTCHA jegyet, és elküldi az adatokat.

   Ha a végpont még nincs beállítva, az űrlap NEM tesz úgy, mintha
   elküldte volna: megmondja, és felkínálja az e-mailt. Egy néma
   hiba itt elveszett megrendelés. */
(function () {
  'use strict';

  var urlap = document.getElementById('kapcsolatUrlap');
  if (!urlap) return;

  var VEGPONT = '{{urlapVegpont}}';        /* a build helyettesíti be */
  var RECAPTCHA = '{{recaptchaSiteKey}}';
  var EMAIL = '{{email}}';

  var gomb = document.getElementById('kuldGomb');
  var uzenetHely = document.getElementById('urlapUzenet');

  var beallitva = VEGPONT && VEGPONT.indexOf('KITÖLTENDŐ') === -1;

  function uzenet(szoveg, tipus) {
    uzenetHely.className = 'urlap-uzenet' + (tipus ? ' ' + tipus : '');
    uzenetHely.innerHTML = szoveg;
  }

  /* ---------- reCAPTCHA ---------- */

  var recaptchaTolt = null;

  function recaptchaJegy() {
    if (!RECAPTCHA || RECAPTCHA.indexOf('KITÖLTENDŐ') !== -1) return Promise.resolve('');

    if (!recaptchaTolt) {
      recaptchaTolt = new Promise(function (kesz, hiba) {
        var s = document.createElement('script');
        s.src = 'https://www.google.com/recaptcha/api.js?render=' + RECAPTCHA;
        s.onload = kesz;
        s.onerror = function () { hiba(new Error('A reCAPTCHA nem tölthető be.')); };
        document.head.appendChild(s);
      });
    }

    return recaptchaTolt.then(function () {
      return new Promise(function (kesz) {
        window.grecaptcha.ready(function () {
          window.grecaptcha.execute(RECAPTCHA, { action: 'kapcsolat' }).then(kesz);
        });
      });
    });
  }

  /* ---------- küldés ---------- */

  urlap.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!urlap.checkValidity()) {
      urlap.reportValidity();
      return;
    }

    /* a robotcsapdát csak automata tölti ki — csendben elnyeljük */
    if (urlap.honlap.value) { uzenet('Köszönjük, az üzenet elment.', 'ok'); return; }

    if (!beallitva) {
      uzenet(
        'Az űrlap küldése még nincs beállítva ezen a példányon. ' +
        'Kérjük, írjon közvetlenül: <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>',
        'hiba'
      );
      return;
    }

    gomb.disabled = true;
    uzenet('Küldés…');

    var adat = {
      nev: urlap.nev.value.trim(),
      email: urlap.email.value.trim(),
      telefon: urlap.telefon.value.trim(),
      telepules: urlap.telepules.value.trim(),
      uzenet: urlap.uzenet.value.trim(),
      gdpr: urlap.gdpr.checked
    };

    recaptchaJegy()
      .then(function (jegy) {
        adat.recaptcha = jegy;
        return fetch(VEGPONT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adat)
        });
      })
      .then(function (v) {
        return v.json().catch(function () { return {}; }).then(function (d) {
          if (!v.ok) throw new Error(d.hiba || 'A küldés nem sikerült (' + v.status + ').');
          return d;
        });
      })
      .then(function () {
        urlap.reset();
        uzenet('Köszönjük! Az üzenet megérkezett, hamarosan válaszolunk.', 'ok');
        gomb.disabled = false;
      })
      .catch(function (err) {
        gomb.disabled = false;
        uzenet(
          err.message + ' Ha nem megy, írjon ide: ' +
          '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>',
          'hiba'
        );
      });
  });
})();
