/* ============================================================
   Duna Enterior — referenciák kezelése.

   Az oldal statikus (Cloudflare Pages), nincs szerveroldali kód: nincs
   tehát mit jelszóval védeni, és nincs hova feltölteni. Helyette ez a
   felület KÖZVETLENÜL a GitHub API-val dolgozik — a böngésző készít egy
   commitot, a commit elindítja a GitHub Actions közzétételét, és 2-4
   perc múlva kint van.

   Amit ez a védelemre nézve jelent:

   - A hitelesítést a GitHub végzi, nem mi. A felület megnyitása
     önmagában semmit nem enged; kulcs nélkül minden írási kérés
     401-gyel elszáll. Ezért nincs baj abból, hogy az admin.html egy
     publikus repóban lévő statikus fájl.
   - A kulcs (fine-grained personal access token) SOHA nem kerül be a
     kódba vagy a repóba. A tulajdonos böngészőjének tárolójában él, és
     csak az api.github.com felé megy ki.
   - Alapból a lap bezárásáig él. A "jegyezze meg" jelölővel marad meg —
     ezt csak saját gépen érdemes bepipálni.

   Minden művelet EGYETLEN commit (Git Data API: blob → tree → commit →
   ref). Negyven kép feltöltése is egy közzétételt indít, nem negyvenet.
   ============================================================ */
(function () {
  'use strict';

  var TULAJ = 'Duwras';
  var REPO  = 'duna_enterior';
  var AG    = 'main';

  var API = 'https://api.github.com/repos/' + TULAJ + '/' + REPO;
  var NYERS = 'https://raw.githubusercontent.com/' + TULAJ + '/' + REPO;
  var LISTA = 'data/projektek.json';
  var KEPMAPPA = 'img/projektek';

  var KULCS = 'dunaEnteriorGithubKulcs';
  var GH_ALLAPOT = 'dunaEnteriorGhAllapot';   /* az egyszeri belépési azonosító */
  var FORRAS = 'dunaEnteriorKulcsForras';     /* 'gh' = gombbal, 'kezi' = beillesztve */
  var VEGPONT = '{{urlapVegpont}}';           /* a Worker címe — a build írja be */
  var MAX_EL = 1800;          /* a feltöltött kép hosszabb oldala */
  var MINOSEG = 0.82;
  var ADAGONKENT = 10;        /* ennyi kép megy egy commitban */

  var KATEGORIAK = {
    hotel: 'Hotel', etterem: 'Étterem', lakoingatlan: 'Lakóingatlan',
    kastely: 'Kastély', szakralis: 'Szakrális', egyedi: 'Egyedi', hajo: 'Hajó'
  };

  var $ = function (s) { return document.querySelector(s); };

  var kapu = $('#kapu');
  var app = $('#app');

  var projektek = [];      /* a data/projektek.json aktuális állapota */
  var aktiv = null;        /* a szerkesztett projekt */
  var fejSha = '';         /* a legutóbbi commit — a képek ezzel hivatkozódnak */
  var piszkos = false;     /* van-e mentetlen változás */
  var irasKetes = false;   /* belépéskor nem látszott írási jog */

  /* ============================================================
     GitHub API
     ============================================================ */

  function kulcs() {
    return sessionStorage.getItem(KULCS) || localStorage.getItem(KULCS) || '';
  }

  function gh(ut, opciok) {
    opciok = opciok || {};
    var fejlecek = {
      'Authorization': 'Bearer ' + kulcs(),
      'Accept': opciok.nyers ? 'application/vnd.github.raw' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };
    var init = { method: opciok.metodus || 'GET', headers: fejlecek };
    if (opciok.torzs) {
      fejlecek['Content-Type'] = 'application/json';
      init.body = JSON.stringify(opciok.torzs);
    }

    return fetch(API + ut, init)
      /* Ha maga a kérés nem indul el, a fetch nyers TypeError-t dob
         ("Failed to fetch"), amiből a felhasználó nem ért semmit. A
         leggyakoribb ok nem a hálózat, hanem egy reklámszűrő vagy céges
         proxy, ami az api.github.com-ot tiltja. */
      .catch(function () {
        var e = new Error('Nem sikerült elérni a GitHubot (api.github.com). ' +
          'Ellenőrizze az internetkapcsolatot, illetve hogy egy bővítmény ' +
          '(reklámszűrő, VPN) vagy a hálózat nem tiltja-e ezt a címet.');
        e.status = 0;
        throw e;
      })
      .then(function (v) {
        if (opciok.nyers && v.ok) return v.text();
        return v.json().catch(function () { return {}; }).then(function (d) {
          if (!v.ok) {
            var e = new Error(hibaSzoveg(v.status, d));
            e.status = v.status;
            e.sso = !!v.headers.get('x-github-sso');
            throw e;
          }
          return d;
        });
      });
  }

  /* A GitHub angolul és fejlesztőknek válaszol. Amit tényleg látni lehet,
     azt lefordítjuk használható mondatra. */
  function hibaSzoveg(kod, d) {
    if (kod === 401) return 'A kulcs érvénytelen, visszavont vagy lejárt. Készítsen újat a GitHubon. (401)';
    if (kod === 403) return 'Ennek a kulcsnak nincs írási joga ehhez a repóhoz (Contents: Read and write kell). (403)';
    if (kod === 404) return 'A kulcs nem látja a ' + TULAJ + '/' + REPO + ' repót. Finomhangolt kulcsnál: Repository access → Only select repositories → ' + REPO + ', és Permissions → Metadata: Read-only. (404)';
    if (kod === 409 || kod === 422) return 'Időközben más is módosított valamit. Töltse újra az oldalt, és próbálja meg újra.';
    if (kod === 413) return 'Túl nagy a küldemény. Töltsön fel kevesebb képet egyszerre.';
    return (d && d.message ? d.message : 'Hiba') + ' (' + kod + ')';
  }

  /* ---------- a kulcs alakja ----------

     Beillesztéskor a leggyakoribb baj nem az, hogy a kulcs rossz, hanem
     hogy nem a kulcs került a mezőbe: sortörés vagy szóköz ragadt bele
     (levélből, PDF-ből másolva), esetleg a kulcs NEVE lett kimásolva a
     kulcs helyett. Mindkettőt itt szűrjük ki, még a hálózat előtt. */

  function tisztitKulcs(s) {
    /* minden whitespace ki, a láthatatlan vezérlők (BOM, zero-width) is —
       a GitHub kulcsában ilyen soha nincs, másoláskor viszont belekerül */
    return String(s || '')
      .replace(/\s+/g, '')
      .replace(/[\u200B-\u200F\u2060\uFEFF]/g, '');
  }

  function kulcsAlak(t) {
    if (/^github_pat_[A-Za-z0-9_]{50,}$/.test(t)) return 'finomhangolt';
    if (/^gh[posur]_[A-Za-z0-9]{30,}$/.test(t)) return 'klasszikus';
    return '';
  }

  /* Amit a hibaüzenet végére teszünk: ennyi támpont kell ahhoz, hogy el
     lehessen dönteni, a kulccsal vagy a jogosultsággal van-e baj. */
  function kulcsJelzo(t) {
    var alak = kulcsAlak(t);
    return ' [a mezőben ' + t.length + ' karakter, ' +
      (alak ? alak + ' kulcs alakja' : 'nem GitHub-kulcs alakja: „' + t.slice(0, 8) + '…”') + ']';
  }

  /* A repó lekérése 401/403/404-gyel is elszállhat, és a három nagyon
     mást jelent. A /user végpont eldönti, melyikről van szó: azt MINDEN
     érvényes kulcs eléri, jogosultságtól függetlenül. Így a hibaüzenet
     megmondja, hogy a kulcsot kell újracsinálni, vagy csak a repó
     hozzáférését kell beállítani nála. */
  function diagnosztika(hiba, ertek) {
    var jelzo = kulcsJelzo(ertek);
    if ([401, 403, 404].indexOf(hiba.status) === -1) return Promise.resolve(hiba.message);

    return fetch('https://api.github.com/user', {
      headers: {
        'Authorization': 'Bearer ' + ertek,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then(function (v) {
      if (v.status === 401) {
        /* A tanács attól függ, hogyan lépett be: a gombbal szerzett
           kulcsot nincs mit „beilleszteni”. */
        return ghBelepett()
          ? 'A GitHub visszavonta ezt a hozzáférést. Lépjen be újra a ' +
            '„Belépés GitHub-fiókkal” gombbal.'
          : 'A GitHub magát a kulcsot nem fogadja el: érvénytelen, visszavont ' +
            'vagy lejárt. (A finomhangolt kulcsok alapból 30 nap után járnak le.) ' +
            'Készítsen újat, és a teljes kulcsot illessze be — a „Megmutat” gombbal ' +
            'ellenőrizheti, tényleg az került-e a mezőbe.' + jelzo;
      }
      return v.json().catch(function () { return {}; }).then(function (d) {
        var ki = d && d.login ? ' (' + d.login + ' néven)' : '';

        if (hiba.status === 404) {
          return 'A kulcs érvényes' + ki + ', de nem látja a ' + TULAJ + '/' + REPO +
            ' repót. A kulcs beállításánál: Resource owner → ' + TULAJ +
            ', Repository access → Only select repositories → ' + REPO +
            ', Permissions → Metadata: Read-only és Contents: Read and write.' + jelzo;
        }
        if (hiba.status === 403) {
          return 'A kulcs érvényes' + ki + ', de a GitHub megtagadta a hozzáférést' +
            (hiba.sso ? ' — a kulcsot a szervezet SSO-jához is engedélyezni kell.' : '.') +
            ' Ellenőrizze a Permissions résznél a Metadata: Read-only és a ' +
            'Contents: Read and write beállítást.' + jelzo;
        }
        return hiba.message + jelzo;
      });
    }).catch(function () {
      return hiba.message + jelzo;
    });
  }

  /* ---------- base64 ---------- */

  function b64Blob(blob) {
    return new Promise(function (kesz, hiba) {
      var o = new FileReader();
      o.onload = function () { kesz(String(o.result).split(',')[1]); };
      o.onerror = function () { hiba(new Error('A kép nem olvasható.')); };
      o.readAsDataURL(blob);
    });
  }

  /* btoa csak bájtokkal dolgozik, a JSON viszont ékezetes UTF-8 */
  function b64Szoveg(szoveg) {
    var bajtok = new TextEncoder().encode(szoveg);
    var s = '';
    for (var i = 0; i < bajtok.length; i++) s += String.fromCharCode(bajtok[i]);
    return btoa(s);
  }

  /* ---------- commit ----------
     valtozasok: [{ ut, base64 }] vagy [{ ut, torles: true }]
     Egy hívás = egy commit = egy közzététel. */
  function commit(uzenet, valtozasok) {
    var szulo;

    return gh('/git/ref/heads/' + AG)
      .then(function (ref) {
        szulo = ref.object.sha;
        return gh('/git/commits/' + szulo);
      })
      .then(function (alap) {
        return Promise.all(valtozasok.map(function (v) {
          if (v.torles) return { path: v.ut, mode: '100644', type: 'blob', sha: null };
          return gh('/git/blobs', {
            metodus: 'POST',
            torzs: { content: v.base64, encoding: 'base64' }
          }).then(function (blob) {
            return { path: v.ut, mode: '100644', type: 'blob', sha: blob.sha };
          });
        })).then(function (fa) {
          return gh('/git/trees', { metodus: 'POST', torzs: { base_tree: alap.tree.sha, tree: fa } });
        });
      })
      .then(function (fa) {
        return gh('/git/commits', {
          metodus: 'POST',
          torzs: { message: uzenet, tree: fa.sha, parents: [szulo] }
        });
      })
      .then(function (kesz) {
        return gh('/git/refs/heads/' + AG, { metodus: 'PATCH', torzs: { sha: kesz.sha } })
          .then(function () { fejSha = kesz.sha; return kesz.sha; });
      });
  }

  /* ============================================================
     belépés
     ============================================================ */

  function uzen(elem, szoveg, osztaly) {
    elem.className = 'uzenet' + (osztaly ? ' ' + osztaly : '');
    elem.textContent = szoveg;
  }

  function felejt() {
    sessionStorage.removeItem(KULCS);
    localStorage.removeItem(KULCS);
    localStorage.removeItem(FORRAS);
  }

  function ghBelepett() { return localStorage.getItem(FORRAS) === 'gh'; }

  function kaputMutat(szoveg) {
    felejt();
    app.hidden = true;
    kapu.hidden = false;
    if (szoveg) uzen($('#kapuUzenet'), szoveg, 'hiba');
    $('#kapuKulcs').focus();
  }

  /* A tárolt kulcsot a GitHubbal ellenőriztetjük, mielőtt a felület
     megjelenne: a repó lekérése 401-gyel száll el rossz kulcsra és
     404-gyel olyanra, amelyik nem látja ezt a repót.

     Az írási jogot NEM tesszük a belépés feltételévé. A válasz
     `permissions` mezője a felhasználó repóbeli jogát tükrözi, és
     finomhangolt kulcsnál hiányozhat vagy hamis lehet akkor is, amikor
     a Contents: Read and write megvan — ilyenkor a szigorú ellenőrzés
     kizárta a jogosult tulajdonost is. Ha nem látszik írási jog, csak
     figyelmeztetünk; a mentés úgyis megmondja a GitHub 403-mal, ha
     tényleg hiányzik. */
  function ellenoriz() {
    return gh('').then(function (repo) {
      return !!(repo.permissions && repo.permissions.push);
    });
  }

  /* ============================================================
     belépés GitHub-fiókkal
     ============================================================

     A kézzel készített kulcs két okból rossz megoldás a tulajdonosnak:
     lejár (a finomhangolt kulcs alapból 30 nap múlva), és 90-100
     karaktert kell hibátlanul beilleszteni. Ha a Workerben be van
     állítva a GitHub-alkalmazás, ez az egész elmarad: egy kattintás, a
     GitHubon egy rábólintás, és kész. Az így kapott kulcs nem jár le.

     A Worker beállítása: worker/OLVASSEL.md. Amíg nincs beállítva, ez a
     rész nem is látszik — a kulcsmező változatlanul működik. */

  function veletlen() {
    var t = new Uint8Array(16);
    window.crypto.getRandomValues(t);
    var s = '';
    for (var i = 0; i < t.length; i++) s += (t[i] + 256).toString(16).slice(1);
    return s;
  }

  function b64url(s) {
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function workerCim(ut) {
    return String(VEGPONT).replace(/\/+$/, '') + ut;
  }

  function ghBelepesIndit(clientId) {
    var n = veletlen();
    sessionStorage.setItem(GH_ALLAPOT, n);

    /* A visszatérési cím a state-ben utazik, mert a GitHub egyetlen
       visszatérési címet enged az alkalmazásnál — az a Worker. */
    var allapot = b64url(JSON.stringify({ n: n, vissza: location.origin + location.pathname }));

    /* public_repo: a repó nyilvános, ennél többre nincs szükség. A
       felhasználó privát repóihoz ez a kulcs nem fér hozzá. */
    location.href = 'https://github.com/login/oauth/authorize' +
      '?client_id=' + encodeURIComponent(clientId) +
      '&scope=public_repo' +
      '&state=' + encodeURIComponent(allapot);
  }

  /* A GitHubtól visszaérve a kulcs a cím kettőskereszt utáni részében
     van. Azt a böngésző nem küldi el szervernek — mi pedig azonnal ki is
     töröljük a címsorból, hogy ne maradjon az előzményekben. */
  function ghVisszaKezel() {
    if (!location.hash || location.hash.length < 2) return '';

    var p = new URLSearchParams(location.hash.slice(1));
    var kapott = p.get('gh');
    var ghHiba = p.get('ghHiba');
    if (!kapott && !ghHiba) return '';

    var vart = sessionStorage.getItem(GH_ALLAPOT);
    sessionStorage.removeItem(GH_ALLAPOT);
    history.replaceState(null, '', location.pathname + location.search);

    if (!vart || p.get('n') !== vart) {
      kaputMutat('A belépés nem ebből az ablakból indult. Biztonsági okból ' +
        'eldobtuk — indítsa újra a Belépés GitHub-fiókkal gombbal.');
      return 'hiba';
    }
    if (ghHiba) {
      kaputMutat('A GitHub-belépés nem sikerült: ' + ghHiba);
      return 'hiba';
    }

    /* Az OAuth-kulcs nem jár le, ezért tartósan tároljuk: a tulajdonosnak
       ezen a gépen soha többé nem kell belépnie. */
    felejt();
    localStorage.setItem(KULCS, kapott);
    localStorage.setItem(FORRAS, 'gh');
    return 'ok';
  }

  /* A gomb csak akkor jelenik meg, ha a Worker azt mondja, be van
     állítva. Így egy félkész beállítás nem visz zsákutcába. */
  function ghGombKeszit() {
    if (!/^https?:\/\//.test(VEGPONT)) return;

    fetch(workerCim('/gh-beallitas'), { headers: { Accept: 'application/json' } })
      .then(function (v) { return v.ok ? v.json() : null; })
      .then(function (d) {
        if (!d || !d.van || !d.clientId) return;
        $('#ghDoboz').hidden = false;
        $('#ghGomb').addEventListener('click', function () { ghBelepesIndit(d.clientId); });
      })
      .catch(function () { /* nincs beállítva vagy nem elérhető — marad a kulcsmező */ });
  }

  /* A takarás levehető: beillesztés után így ellenőrizhető, hogy tényleg
     a kulcs került a mezőbe, és nem egy jelszókezelő írta felül. */
  $('#kulcsMutat').addEventListener('click', function () {
    var mezo = $('#kapuKulcs');
    var takart = mezo.classList.toggle('takart');
    this.textContent = takart ? 'Megmutat' : 'Elrejt';
    this.setAttribute('aria-pressed', takart ? 'false' : 'true');
    mezo.focus();
  });

  /* Beillesztéskor azonnal takarítunk, hogy a mezőben pontosan az legyen,
     ami a GitHubhoz megy — így a "Megmutat" is a valóságot mutatja. */
  $('#kapuKulcs').addEventListener('input', function () {
    var tiszta = tisztitKulcs(this.value);
    if (tiszta !== this.value) this.value = tiszta;
  });

  $('#kapuUrlap').addEventListener('submit', function (e) {
    e.preventDefault();
    var ertek = tisztitKulcs($('#kapuKulcs').value);
    if (!ertek) return;

    var gomb = $('#kapuGomb');
    gomb.disabled = true;
    uzen($('#kapuUzenet'), 'Ellenőrzés…');

    felejt();
    ($('#kapuJegyezd').checked ? localStorage : sessionStorage).setItem(KULCS, ertek);
    localStorage.setItem(FORRAS, 'kezi');

    ellenoriz()
      .then(function (irhat) {
        gomb.disabled = false;
        $('#kapuUrlap').reset();
        uzen($('#kapuUzenet'), '');
        irasKetes = !irhat;
        appMutat();
      })
      .catch(function (hiba) {
        felejt();
        /* A GitHub válasza önmagában félrevisz: 401/403/404 mindegyike
           jöhet jó kulcstól rossz beállítással és rossz kulcstól is.
           A diagnosztika ezt bontja szét, mielőtt üzenetet írnánk ki. */
        diagnosztika(hiba, ertek).then(function (szoveg) {
          gomb.disabled = false;
          uzen($('#kapuUzenet'), szoveg, 'hiba');
        });
      });
  });

  $('#kilep').addEventListener('click', function () {
    if (piszkos && !confirm('Van mentetlen változás. Biztosan kilép?')) return;
    felejt();
    location.href = 'index.html';
  });

  function appMutat() {
    kapu.hidden = true;
    app.hidden = false;
    projektekBetolt();
  }

  /* ============================================================
     projektek betöltése
     ============================================================ */

  function projektekBetolt() {
    allapot('Betöltés…');

    gh('/git/ref/heads/' + AG)
      .then(function (ref) {
        fejSha = ref.object.sha;
        return gh('/contents/' + LISTA + '?ref=' + AG, { nyers: true });
      })
      .then(function (szoveg) {
        projektek = JSON.parse(szoveg);
        listaRajzol();
        allapot(projektek.length + ' projekt betöltve' + (irasKetes
          ? ' — az írási jogot nem sikerült előre ellenőrizni. Ha a mentés 403-mal elszáll, a kulcsnál a Contents: Read and write hiányzik.'
          : ''));
      })
      .catch(function (hiba) {
        if (hiba.status === 401) return kaputMutat('Lejárt a kulcs, adja meg újra.');
        allapot('Nem tölthető be: ' + hiba.message, 'hiba');
      });
  }

  function allapot(szoveg, osztaly) {
    var el = $('#globalAllapot');
    el.className = 'allapot' + (osztaly ? ' ' + osztaly : '');
    el.textContent = szoveg;
  }

  /* a képet a repóból mutatjuk, az AKTUÁLIS commit szerint — így az
     imént feltöltött kép is rögtön látszik, jóval azelőtt, hogy a
     weboldal újraépülne */
  function repoKep(slug, fajl) {
    return NYERS + '/' + fejSha + '/' + KEPMAPPA + '/' + slug + '/' + fajl;
  }

  /* ---------- lista ---------- */

  function listaRajzol() {
    var lista = $('#projektLista');
    var szuro = $('#kereso').value.trim().toLowerCase();
    lista.innerHTML = '';

    projektek
      .filter(function (p) { return !szuro || p.cim.toLowerCase().indexOf(szuro) !== -1; })
      .forEach(function (p) {
        var li = document.createElement('li');
        li.className = 'projekt-sor' + (aktiv && aktiv.slug === p.slug ? ' aktiv' : '');

        var gomb = document.createElement('button');
        gomb.type = 'button';

        var bori = document.createElement('img');
        bori.className = 'bori';
        bori.loading = 'lazy';
        bori.alt = '';
        if (p.kepek.length) bori.src = repoKep(p.slug, p.kiemelt || p.kepek[0].file);

        var szoveg = document.createElement('span');
        szoveg.className = 'sor-szoveg';
        szoveg.innerHTML =
          '<b>' + biztonsagos(p.cim) + '</b>' +
          '<small>' + (KATEGORIAK[p.kategoria] || p.kategoria) + ' · ' + p.kepek.length + ' kép</small>';

        gomb.appendChild(bori);
        gomb.appendChild(szoveg);

        if (p.allapot === 'vazlat') {
          var jel = document.createElement('span');
          jel.className = 'vazlat-jel';
          jel.textContent = 'vázlat';
          gomb.appendChild(jel);
        }

        gomb.addEventListener('click', function () { projektNyit(p); });
        li.appendChild(gomb);
        lista.appendChild(li);
      });
  }

  function biztonsagos(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  $('#kereso').addEventListener('input', listaRajzol);

  /* ============================================================
     szerkesztő
     ============================================================ */

  function projektNyit(p) {
    if (piszkos && !confirm('Van mentetlen változás. Eldobja?')) return;

    aktiv = JSON.parse(JSON.stringify(p));   /* másolaton dolgozunk, hogy a Mégse működjön */
    piszkos = false;

    $('#uresAllapot').hidden = true;
    $('#szerkeszto').hidden = false;
    $('#szerkesztoCim').textContent = p.cim;
    uzen($('#szerkesztoUzenet'), '');

    $('#mCim').value = aktiv.cim || '';
    $('#mKategoria').value = aktiv.kategoria || 'egyedi';
    $('#mAllapot').value = aktiv.allapot || 'publikalt';
    $('#mLink').value = aktiv.link || '';
    $('#mLeiras').value = aktiv.leiras || '';

    kepekRajzol();
    listaRajzol();
  }

  ['mCim', 'mKategoria', 'mAllapot', 'mLink', 'mLeiras'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () {
      if (!aktiv) return;
      aktiv.cim = $('#mCim').value;
      aktiv.kategoria = $('#mKategoria').value;
      aktiv.allapot = $('#mAllapot').value;
      aktiv.link = $('#mLink').value.trim() || null;
      aktiv.leiras = $('#mLeiras').value;
      piszkos = true;
    });
  });

  /* ---------- új projekt ---------- */

  var EKEZET = { 'á':'a','é':'e','í':'i','ó':'o','ö':'o','ő':'o','ú':'u','ü':'u','ű':'u' };

  function slugosit(s) {
    return s.toLowerCase()
      .replace(/[áéíóöőúüű]/g, function (c) { return EKEZET[c]; })
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'projekt';
  }

  function szabadSlug(alap) {
    var s = alap, n = 2;
    while (projektek.some(function (p) { return p.slug === s; })) s = alap + '-' + n++;
    return s;
  }

  $('#ujProjekt').addEventListener('click', function () {
    var nev = prompt('Az új projekt neve:');
    if (!nev || !nev.trim()) return;

    var uj = {
      slug: szabadSlug(slugosit(nev)),
      cim: nev.trim(),
      kategoria: 'egyedi',
      link: null,
      leiras: '',
      kiemelt: null,
      allapot: 'vazlat',     /* amíg nincs kép, ne kerüljön ki a weboldalra */
      kepek: []
    };

    projektek.push(uj);
    projektNyit(uj);
    piszkos = true;
    uzen($('#szerkesztoUzenet'),
      'Az új projekt még nincs mentve. Töltsön fel képeket, majd nyomjon Mentést.', 'info');
  });

  /* ---------- képek ---------- */

  function kepekRajzol() {
    var racs = $('#kepRacs');
    racs.innerHTML = '';
    $('#kepSzamlalo').textContent = aktiv.kepek.length ? '· ' + aktiv.kepek.length + ' db' : '· még nincs';

    aktiv.kepek.forEach(function (k, i) {
      var li = document.createElement('li');
      li.className = 'kep-elem' + (k.file === aktiv.kiemelt ? ' borito' : '');
      li.draggable = true;
      li.dataset.hely = i;

      var kep = document.createElement('img');
      kep.src = k.ujAdatUrl || repoKep(aktiv.slug, k.file);
      kep.alt = k.alt || '';
      kep.loading = 'lazy';

      var sav = document.createElement('div');
      sav.className = 'kep-sav';

      var bori = document.createElement('button');
      bori.type = 'button';
      bori.className = 'kep-gomb';
      bori.title = 'Legyen ez a borítókép';
      bori.textContent = k.file === aktiv.kiemelt ? '★ borító' : '☆';
      bori.addEventListener('click', function () {
        aktiv.kiemelt = k.file;
        piszkos = true;
        kepekRajzol();
      });

      var torol = document.createElement('button');
      torol.type = 'button';
      torol.className = 'kep-gomb veszelyes';
      torol.title = 'Kép törlése';
      torol.textContent = '✕';
      torol.addEventListener('click', function () {
        if (!confirm('Törli ezt a képet a projektből?')) return;
        aktiv.kepek.splice(i, 1);
        if (aktiv.kiemelt === k.file) aktiv.kiemelt = aktiv.kepek.length ? aktiv.kepek[0].file : null;
        piszkos = true;
        kepekRajzol();
      });

      var alt = document.createElement('input');
      alt.type = 'text';
      alt.className = 'kep-alt';
      alt.value = k.alt || '';
      alt.placeholder = 'Mi látszik a képen?';
      alt.setAttribute('aria-label', 'A kép rövid leírása');
      /* Ezt mondja fel a képernyőolvasó, és ezt indexeli a Google —
         ezért kérjük el, nem generáljuk. */
      alt.addEventListener('input', function () { k.alt = alt.value; piszkos = true; });

      sav.appendChild(bori);
      sav.appendChild(torol);
      li.appendChild(kep);
      li.appendChild(sav);
      li.appendChild(alt);
      racs.appendChild(li);
    });

    huzasBekot(racs);
  }

  /* ---------- sorrend húzással ---------- */

  function huzasBekot(racs) {
    var fogott = null;

    racs.addEventListener('dragstart', function (e) {
      var li = e.target.closest('.kep-elem');
      if (!li) return;
      fogott = +li.dataset.hely;
      li.classList.add('fogva');
      e.dataTransfer.effectAllowed = 'move';
    });

    racs.addEventListener('dragover', function (e) {
      e.preventDefault();
      var li = e.target.closest('.kep-elem');
      racs.querySelectorAll('.cel').forEach(function (x) { x.classList.remove('cel'); });
      if (li) li.classList.add('cel');
    });

    racs.addEventListener('drop', function (e) {
      e.preventDefault();
      var li = e.target.closest('.kep-elem');
      if (!li || fogott === null) return;
      var ide = +li.dataset.hely;
      if (ide === fogott) return;

      var mozgo = aktiv.kepek.splice(fogott, 1)[0];
      aktiv.kepek.splice(ide, 0, mozgo);
      piszkos = true;
      fogott = null;
      kepekRajzol();
    });

    racs.addEventListener('dragend', function () {
      racs.querySelectorAll('.fogva, .cel').forEach(function (x) {
        x.classList.remove('fogva', 'cel');
      });
      fogott = null;
    });
  }

  /* ---------- feltöltés ---------- */

  var feltolto = $('#feltolto');
  var bemenet = $('#fajlBemenet');

  $('#tallozGomb').addEventListener('click', function () { bemenet.click(); });
  bemenet.addEventListener('change', function () { fogad(bemenet.files); bemenet.value = ''; });

  ['dragenter', 'dragover'].forEach(function (ev) {
    feltolto.addEventListener(ev, function (e) { e.preventDefault(); feltolto.classList.add('felette'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    feltolto.addEventListener(ev, function (e) { e.preventDefault(); feltolto.classList.remove('felette'); });
  });
  feltolto.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) fogad(e.dataTransfer.files);
  });

  /* Telefonról érkező 5 MB-os képeket nincs értelme teljes méretben
     tárolni: a weboldal 1400 px-nél nagyobbat sosem mutat. Ha a böngésző
     nem tudja dekódolni (pl. HEIC asztali gépen), megy az eredeti. */
  function kicsinyit(fajl) {
    if (!window.createImageBitmap || !HTMLCanvasElement.prototype.toBlob) {
      return Promise.resolve(fajl);
    }
    return createImageBitmap(fajl, { imageOrientation: 'from-image' })
      .then(function (bmp) {
        var arany = Math.min(1, MAX_EL / Math.max(bmp.width, bmp.height));
        var sz = Math.round(bmp.width * arany);
        var m = Math.round(bmp.height * arany);

        var vaszon = document.createElement('canvas');
        vaszon.width = sz; vaszon.height = m;
        vaszon.getContext('2d').drawImage(bmp, 0, 0, sz, m);
        bmp.close();

        return new Promise(function (kesz) {
          vaszon.toBlob(function (blob) {
            kesz(!blob || blob.size >= fajl.size ? fajl : blob);
          }, 'image/jpeg', MINOSEG);
        });
      })
      .catch(function () { return fajl; });
  }

  /* a következő szabad sorszám a projekt mappájában */
  function kovetkezoSorszam() {
    var max = 0;
    aktiv.kepek.forEach(function (k) {
      var t = /^(\d+)\./.exec(k.file);
      if (t) max = Math.max(max, parseInt(t[1], 10));
    });
    return max + 1;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function fogad(fajlLista) {
    if (!aktiv) { alert('Előbb nyisson meg vagy hozzon létre egy projektet.'); return; }

    var fajlok = [].slice.call(fajlLista).filter(function (f) {
      return f.type.indexOf('image/') === 0 || /\.hei[cf]$/i.test(f.name);
    });
    if (!fajlok.length) {
      uzen($('#szerkesztoUzenet'), 'Csak képfájlt lehet feltölteni.', 'hiba');
      return;
    }

    uzen($('#szerkesztoUzenet'), fajlok.length + ' kép előkészítése…', 'info');

    var sorszam = kovetkezoSorszam();

    Promise.all(fajlok.map(function (f, i) {
      return kicsinyit(f).then(function (kicsi) {
        return b64Blob(kicsi).then(function (b64) {
          return {
            file: pad(sorszam + i) + '.jpg',
            alt: aktiv.cim,
            base64: b64,
            ujAdatUrl: URL.createObjectURL(kicsi)
          };
        });
      });
    }))
      .then(function (kesz) {
        kesz.forEach(function (k) { aktiv.kepek.push(k); });
        if (!aktiv.kiemelt && aktiv.kepek.length) aktiv.kiemelt = aktiv.kepek[0].file;
        piszkos = true;
        kepekRajzol();
        uzen($('#szerkesztoUzenet'),
          kesz.length + ' kép hozzáadva. A Mentés gombbal kerül fel a weboldalra.', 'ok');
      })
      .catch(function (hiba) {
        uzen($('#szerkesztoUzenet'), hiba.message, 'hiba');
      });
  }

  /* ============================================================
     mentés
     ============================================================ */

  /* Olvasható formában írjuk vissza, hogy kézzel is szerkeszthető
     maradjon, ha valaha kell. */
  function listaJson(lista) {
    return JSON.stringify(lista, null, 2) + '\n';
  }

  function tisztit(p) {
    return {
      slug: p.slug,
      cim: p.cim,
      kategoria: p.kategoria,
      link: p.link || null,
      leiras: p.leiras || '',
      kiemelt: p.kiemelt,
      allapot: p.allapot,
      kepek: p.kepek.map(function (k) { return { file: k.file, alt: k.alt || p.cim }; })
    };
  }

  $('#mentGomb').addEventListener('click', function () {
    if (!aktiv) return;

    if (!aktiv.cim.trim()) {
      uzen($('#szerkesztoUzenet'), 'A projektnek kell egy név.', 'hiba');
      return;
    }
    if (aktiv.allapot === 'publikalt' && !aktiv.kepek.length) {
      uzen($('#szerkesztoUzenet'),
        'Publikált projekthez legalább egy kép kell. Töltsön fel képet, vagy állítsa vázlatra.', 'hiba');
      return;
    }

    var gomb = $('#mentGomb');
    gomb.disabled = true;

    /* az újonnan érkezett képek fájljai */
    var ujak = aktiv.kepek.filter(function (k) { return k.base64; });

    /* a projekt korábbi állapotában szereplő, de mostanra kivett képek */
    var regi = projektek.filter(function (p) { return p.slug === aktiv.slug; })[0];
    var megvan = {};
    aktiv.kepek.forEach(function (k) { megvan[k.file] = true; });
    var torlendok = !regi ? [] : regi.kepek
      .filter(function (k) { return !megvan[k.file]; })
      .map(function (k) { return { ut: KEPMAPPA + '/' + aktiv.slug + '/' + k.file, torles: true }; });

    /* a listát frissítjük a mentett állapotra */
    var uj = projektek.slice();
    var hely = uj.findIndex(function (p) { return p.slug === aktiv.slug; });
    if (hely === -1) uj.push(tisztit(aktiv)); else uj[hely] = tisztit(aktiv);

    /* Nagy feltöltést adagokra bontunk: egy commitban tíz kép megy.
       Az utolsó adaggal megy a projektek.json is, hogy a lista soha ne
       hivatkozzon olyan képre, ami még nincs fent. */
    var adagok = [];
    for (var i = 0; i < ujak.length; i += ADAGONKENT) {
      adagok.push(ujak.slice(i, i + ADAGONKENT).map(function (k) {
        return { ut: KEPMAPPA + '/' + aktiv.slug + '/' + k.file, base64: k.base64 };
      }));
    }
    if (!adagok.length) adagok.push([]);

    var lanc = Promise.resolve();
    adagok.forEach(function (adag, sorszam) {
      var utolso = sorszam === adagok.length - 1;
      lanc = lanc.then(function () {
        uzen($('#szerkesztoUzenet'),
          adagok.length > 1
            ? 'Mentés… (' + (sorszam + 1) + '/' + adagok.length + ' adag)'
            : 'Mentés…', 'info');

        var valtozasok = adag.slice();
        if (utolso) {
          torlendok.forEach(function (t) { valtozasok.push(t); });
          valtozasok.push({ ut: LISTA, base64: b64Szoveg(listaJson(uj)) });
        }
        return commit('Referenciák: ' + aktiv.cim, valtozasok);
      });
    });

    lanc
      .then(function () {
        projektek = uj;
        aktiv.kepek.forEach(function (k) {
          if (k.ujAdatUrl) URL.revokeObjectURL(k.ujAdatUrl);
          delete k.base64;
          delete k.ujAdatUrl;
        });
        piszkos = false;
        listaRajzol();
        kepekRajzol();
        gomb.disabled = false;
        uzen($('#szerkesztoUzenet'),
          'Mentve. A weboldalon 2-4 perc múlva jelenik meg.', 'ok');
        allapot(projektek.length + ' projekt');
      })
      .catch(function (hiba) {
        gomb.disabled = false;
        if (hiba.status === 401) return kaputMutat('Lejárt a kulcs, adja meg újra.');
        uzen($('#szerkesztoUzenet'), hiba.message, 'hiba');
      });
  });

  /* ---------- projekt törlése ---------- */

  $('#torolProjekt').addEventListener('click', function () {
    if (!aktiv) return;
    if (!confirm('Törli a(z) "' + aktiv.cim + '" projektet és MINDEN képét? Ez nem vonható vissza.')) return;

    var gomb = $('#torolProjekt');
    gomb.disabled = true;
    uzen($('#szerkesztoUzenet'), 'Törlés…', 'info');

    var maradok = projektek.filter(function (p) { return p.slug !== aktiv.slug; });
    var valtozasok = aktiv.kepek.map(function (k) {
      return { ut: KEPMAPPA + '/' + aktiv.slug + '/' + k.file, torles: true };
    });
    valtozasok.push({ ut: LISTA, base64: b64Szoveg(listaJson(maradok)) });

    commit('Referenciák: törölve (' + aktiv.cim + ')', valtozasok)
      .then(function () {
        projektek = maradok;
        aktiv = null;
        piszkos = false;
        $('#szerkeszto').hidden = true;
        $('#uresAllapot').hidden = false;
        listaRajzol();
        gomb.disabled = false;
        allapot('Projekt törölve. A weboldalról 2-4 perc múlva tűnik el.', 'ok');
      })
      .catch(function (hiba) {
        gomb.disabled = false;
        if (hiba.status === 401) return kaputMutat('Lejárt a kulcs, adja meg újra.');
        uzen($('#szerkesztoUzenet'), hiba.message, 'hiba');
      });
  });

  /* mentetlen változás elhagyáskor */
  window.addEventListener('beforeunload', function (e) {
    if (!piszkos) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ---------- indulás ---------- */
  (function start() {
    ghGombKeszit();

    /* Ha most jöttünk vissza a GitHubtól, a kulcs ezzel kerül a helyére —
       ezért kell a tárolt kulcs kiolvasása ELŐTT lefutnia. */
    if (ghVisszaKezel() === 'hiba') return;

    var tarolt = kulcs();
    if (!tarolt) return kaputMutat();
    ellenoriz()
      .then(function (irhat) { irasKetes = !irhat; appMutat(); })
      .catch(function (hiba) {
        diagnosztika(hiba, tarolt).then(function (szoveg) { kaputMutat(szoveg); });
      });
  })();

})();
