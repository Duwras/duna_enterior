/* Kategóriaszűrő a referencia-rácson.

   Alapból egy kategória sincs bekapcsolva: aki ideérkezik, mindent lát.
   Több kategória egyszerre is választható. */
(function () {
  'use strict';

  var racs = document.getElementById('racs');
  if (!racs) return;

  var gombok = [].slice.call(document.querySelectorAll('.szuro-gomb'));
  var kartyak = [].slice.call(racs.querySelectorAll('.kartya'));
  var allas = document.getElementById('szuroAllas');
  var ures = document.getElementById('uresUzenet');
  var mind = document.querySelector('.szuro-gomb[data-kat="mind"]');

  function valasztott() {
    return gombok
      .filter(function (g) { return g.dataset.kat !== 'mind' && g.getAttribute('aria-pressed') === 'true'; })
      .map(function (g) { return g.dataset.kat; });
  }

  function frissit() {
    var kivalasztva = valasztott();
    var szures = kivalasztva.length > 0;

    mind.setAttribute('aria-pressed', szures ? 'false' : 'true');

    var latszik = 0;
    kartyak.forEach(function (k) {
      var mutat = !szures || kivalasztva.indexOf(k.dataset.kat) !== -1;
      k.hidden = !mutat;
      if (mutat) latszik++;
    });

    allas.textContent = szures
      ? latszik + ' projekt · ' + kivalasztva.length + ' kategória'
      : latszik + ' projekt';
    ures.hidden = latszik > 0;

    /* a cím a megosztható állapotot is hordozza, hogy a visszalépés
       ne dobja vissza az embert a szűretlen listára */
    var hash = szures ? '#' + kivalasztva.join('+') : '';
    history.replaceState(null, '', location.pathname + hash);
  }

  gombok.forEach(function (g) {
    g.addEventListener('click', function () {
      if (g.dataset.kat === 'mind') {
        gombok.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      } else {
        g.setAttribute('aria-pressed', g.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      }
      frissit();
    });
  });

  /* a címben hozott állapot visszaállítása */
  var kezdo = decodeURIComponent(location.hash.slice(1)).split('+').filter(Boolean);
  kezdo.forEach(function (kat) {
    var g = gombok.filter(function (x) { return x.dataset.kat === kat; })[0];
    if (g) g.setAttribute('aria-pressed', 'true');
  });

  frissit();
})();
