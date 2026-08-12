/* Sütibanner és mérés.

   A mérést KIZÁRÓLAG ez az állomány indítja el, más sehol nem hivatkozik
   a Google Analyticsre. Amíg nincs hozzájárulás, a gtag kódja le sem
   töltődik — így nem kerül süti a látogató gépére.

   A döntés egy saját sütiben él (duna_suti_dontes), hogy a szerver
   naplózás nélkül is működjön, és a Sütik oldalon módosítható legyan. */
(function () {
  'use strict';

  var MERO = '{{gaId}}';                  /* a build helyettesíti be */
  var KULCS = 'duna_suti_dontes';
  var NAPOK = 182;                        /* fél év */

  /* ---------- süti kezelése ---------- */

  function olvas() {
    var talalat = document.cookie.match(new RegExp('(?:^|; )' + KULCS + '=([^;]*)'));
    return talalat ? decodeURIComponent(talalat[1]) : '';
  }

  function ir(ertek) {
    var lejar = new Date(Date.now() + NAPOK * 864e5).toUTCString();
    document.cookie = KULCS + '=' + encodeURIComponent(ertek) +
      '; expires=' + lejar + '; path=/; SameSite=Lax';
  }

  /* ---------- mérés ---------- */

  var elindult = false;

  function meresIndul() {
    if (elindult || !MERO || MERO.indexOf('KITÖLTENDŐ') !== -1) return;
    elindult = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MERO, { anonymize_ip: true });

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MERO;
    document.head.appendChild(s);
  }

  /* ---------- banner ---------- */

  function bannerMutat() {
    var doboz = document.createElement('div');
    doboz.className = 'suti-banner';
    doboz.setAttribute('role', 'dialog');
    doboz.setAttribute('aria-label', 'Sütik');
    doboz.innerHTML =
      '<div class="suti-belul">' +
        '<p>Az oldal működéséhez semmilyen süti nem kell. Mérésre használnánk egyet, ' +
        'hogy lássuk, mit néznek a látogatók — ehhez kérjük a hozzájárulását. ' +
        '<a href="sutik.html">Részletek</a></p>' +
        '<div class="suti-gombok">' +
          '<button type="button" class="gomb tolt" data-suti="elfogad">Rendben</button>' +
          '<button type="button" class="gomb" data-suti="elutasit">Csak a szükséges</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(doboz);
    requestAnimationFrame(function () { doboz.classList.add('itt'); });
    return doboz;
  }

  /* ---------- indulás ---------- */

  var dontes = olvas();
  if (dontes === 'elfogad') meresIndul();

  var banner = null;
  if (dontes !== 'elfogad' && dontes !== 'elutasit') {
    /* a banner ne akadályozza az első festést */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { banner = bannerMutat(); });
    } else {
      banner = bannerMutat();
    }
  }

  /* A gombok a bannerben és a Sütik oldalon is ugyanezek — egy
     eseménykezelő elég mindkettőre. */
  document.addEventListener('click', function (e) {
    var gomb = e.target.closest('[data-suti]');
    if (!gomb) return;

    var valasz = gomb.dataset.suti;
    ir(valasz);
    if (valasz === 'elfogad') meresIndul();

    if (banner) {
      banner.classList.remove('itt');
      setTimeout(function () { banner.remove(); banner = null; }, 300);
    }
    allasFrissit();
  });

  /* a Sütik oldal állapotkijelzője */
  function allasFrissit() {
    var hol = document.getElementById('sutiAllas');
    if (!hol) return;
    var d = olvas();
    hol.textContent = d === 'elfogad' ? 'mérés engedélyezve'
      : d === 'elutasit' ? 'mérés tiltva'
      : 'még nem döntött';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', allasFrissit);
  } else {
    allasFrissit();
  }
})();
