/* dunaenterior.hu — közös viselkedés.

   Szándékosan kevés: menü, fejléc-vonal, belépő mozgás, hero-sáv.
   Minden mozgás kikapcsol, ha a látogató rendszerszinten kérte. */
(function () {
  'use strict';

  var lassit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobil menü ---------- */
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

  /* ---------- fejléc alsó vonala csak görgetés után ---------- */
  var fejlec = document.getElementById('fejlec');
  if (fejlec) {
    var allit = function () { fejlec.classList.toggle('uszik', window.scrollY > 8); };
    window.addEventListener('scroll', allit, { passive: true });
    allit();
  }

  /* ---------- belépő mozgás ---------- */
  var jonnek = document.querySelectorAll('.jon');
  if (!jonnek.length) return;

  if (lassit || !('IntersectionObserver' in window)) {
    jonnek.forEach(function (el) { el.classList.add('itt'); });
  } else {
    var figyelo = new IntersectionObserver(function (bejegyzesek) {
      bejegyzesek.forEach(function (b) {
        if (!b.isIntersecting) return;
        b.target.classList.add('itt');
        figyelo.unobserve(b.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    jonnek.forEach(function (el) { figyelo.observe(el); });
  }

  /* ---------- hero fotósáv: lassabban mozog, mint az oldal ---------- */
  var sav = document.getElementById('heroSav');
  if (sav && !lassit) {
    var var_ = false;
    var mozgat = function () {
      var_ = false;
      sav.style.transform = 'translate3d(0,' + (-window.scrollY * 0.13).toFixed(1) + 'px,0)';
    };
    window.addEventListener('scroll', function () {
      if (var_) return;
      var_ = true;
      requestAnimationFrame(mozgat);
    }, { passive: true });
  }

  /* ---------- évszám a láblécben ---------- */
  var ev = document.getElementById('ev');
  if (ev) ev.textContent = new Date().getFullYear();
})();
