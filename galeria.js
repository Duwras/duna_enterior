/* Képnagyító a projekt-aloldalakon.

   A galéria minden képe nagyban is megnyitható; a nagyítóban nyíllal
   és billentyűvel is lehet lépkedni. A <dialog> viszi a fókuszcsapdát
   és az Esc-et, azt nem kell külön megírni. */
(function () {
  'use strict';

  var parbeszed = document.getElementById('nagyito');
  var kep = document.getElementById('nagyitoKep');
  var szam = document.getElementById('nagyitoSzam');
  if (!parbeszed || !kep) return;

  var linkek = [].slice.call(document.querySelectorAll('[data-nagyit]'));
  if (!linkek.length) return;

  var hol = 0;

  function mutat(i) {
    hol = (i + linkek.length) % linkek.length;
    var a = linkek[hol];
    kep.src = a.getAttribute('href');
    kep.alt = a.querySelector('img') ? a.querySelector('img').alt : '';
    szam.textContent = (hol + 1) + ' / ' + linkek.length;
  }

  linkek.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      mutat(i);
      parbeszed.showModal();
    });
  });

  document.getElementById('nagyitoZar').addEventListener('click', function () { parbeszed.close(); });
  document.getElementById('nagyitoElozo').addEventListener('click', function () { mutat(hol - 1); });
  document.getElementById('nagyitoKovetkezo').addEventListener('click', function () { mutat(hol + 1); });

  document.addEventListener('keydown', function (e) {
    if (!parbeszed.open) return;
    if (e.key === 'ArrowLeft') mutat(hol - 1);
    if (e.key === 'ArrowRight') mutat(hol + 1);
  });

  /* a háttérre kattintva is záruljon — a kép maga ne */
  parbeszed.addEventListener('click', function (e) {
    if (e.target === parbeszed) parbeszed.close();
  });
})();
