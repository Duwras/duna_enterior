/* A weboldal szerveroldali végpontja.

   A weboldal statikus, tehát nincs hova POST-olni — ez a Cloudflare
   Worker veszi át azt a néhány dolgot, amihez szerver kell.

   Két dolgot csinál, útvonal szerint:

     /                 — a kapcsolati űrlap:
                         1. ellenőrzi a reCAPTCHA jegyet a Google-nél
                         2. eltárolja az üzenetet a D1 adatbázisban
                         3. elküldi e-mailben a Resenden át
     /gh-beallitas     — megmondja az adminfelületnek, be van-e állítva
                         a GitHub-belépés
     /gh-vissza        — a GitHub ide tér vissza belépés után; itt
                         cserélődik a kód kulcsra

   A tárolás azért van a küldés ELŐTT, mert ha az e-mail elakad (lejárt
   kulcs, szolgáltatáskimaradás), az üzenet akkor se vesszen el.

   Beállítás: worker/OLVASSEL.md
*/

const CORS = (eredet) => ({
  'Access-Control-Allow-Origin': eredet,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
});

/* Csak a saját oldalról fogadunk küldést.

   A duna-enterior.pages.dev a bemutató cím: a domain élesítéséig ezen
   nézhető az oldal. A domainváltás után ez a sor TÖRLENDŐ. */
const ENGEDETT = [
  'https://dunaenterior.hu',
  'https://www.dunaenterior.hu',
  'https://duna-enterior.pages.dev'
];

/* Helyi próbához (`npm run elonezet` + `wrangler dev`) a localhost is
   kell. NEM alapból: csak akkor, ha a FEJLESZTES változó be van állítva,
   amit élesben soha nem adunk meg. */
const HELYI = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function engedett(eredet, kornyezet) {
  if (ENGEDETT.includes(eredet)) return true;
  return !!kornyezet.FEJLESZTES && HELYI.test(eredet);
}

const MEZOK = ['nev', 'email', 'telefon', 'telepules', 'uzenet'];
const HOSSZ = { nev: 120, email: 160, telefon: 40, telepules: 160, uzenet: 5000 };

function valasz(adat, kod, eredet) {
  return new Response(JSON.stringify(adat), {
    status: kod,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS(eredet) }
  });
}

/* A beérkező szöveg e-mailbe és adatbázisba is megy — a HTML-t
   semlegesítjük, hogy a levélben ne értelmeződjön semmi. */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ============================================================
   GitHub-belépés az adminfelülethez
   ============================================================

   Az adminfelület a GitHub API-val commitol. Ehhez kulcs kell. Eddig a
   tulajdonosnak kézzel kellett kulcsot készítenie és beillesztenie —
   ami lejárt (a finomhangolt kulcs alapból 30 nap), és onnantól a
   belépés érthetetlen 401-gyel elszállt.

   Ezzel a két végponttal a kulcs magától megjön: a tulajdonos a
   GitHubon rábólint egyszer, és a böngészője megkapja a hozzáférést.
   Az OAuth-kulcs nem jár le.

   Miért a Worker a visszatérési cím, és nem a weboldal? Mert a GitHub
   EGYETLEN visszatérési címet enged az alkalmazásnál, az oldal viszont
   ma a pages.dev-en, holnap a saját domainen van. Így a GitHub mindig
   ide jön vissza, mi pedig a `state`-ben kapott — és az ENGEDETT
   listához mért — címre küldjük tovább.

   A kulcs a válasz URL-jének KETTŐSKERESZT UTÁNI részében utazik: azt a
   böngésző nem küldi el egyetlen szervernek sem, és az adminfelület
   azonnal ki is törli a címsorból. */

const GH_HITELESIT = 'https://github.com/login/oauth/access_token';

/* A `state` a CSRF-védelem: az adminfelület sorsol egy egyszeri
   azonosítót, mi érintetlenül visszaadjuk, és ott dől el, ő indította-e
   a belépést. A visszatérési cím is benne utazik. */
function allapotOlvas(nyers, kornyezet) {
  try {
    const d = JSON.parse(atob(String(nyers).replace(/-/g, '+').replace(/_/g, '/')));
    if (!d || typeof d.vissza !== 'string' || typeof d.n !== 'string') return null;
    /* Nyitott átirányítás ellen: csak a saját oldalainkra küldünk vissza. */
    const cel = new URL(d.vissza);
    if (!engedett(cel.origin, kornyezet)) return null;
    /* Az útvonalat is szabályozzuk — csak az adminfelületre térünk vissza.
       A .html elhagyható: a Cloudflare Pages a /admin címet is kiszolgálja. */
    if (!/^\/[a-z0-9\-/]*admin(\.html)?$/.test(cel.pathname)) return null;
    return { vissza: cel.origin + cel.pathname, n: d.n };
  } catch {
    return null;
  }
}

function ghVissza(cim, adatok) {
  const q = new URLSearchParams(adatok).toString();
  return new Response(null, { status: 302, headers: { Location: cim + '#' + q } });
}

async function ghBelepes(keres, kornyezet) {
  const cim = new URL(keres.url);
  const allapot = allapotOlvas(cim.searchParams.get('state') || '', kornyezet);

  /* Érvénytelen state esetén nincs hova visszaküldeni — ilyenkor a
     böngészőben maradunk, üzenettel. */
  if (!allapot) {
    return new Response(
      'Érvénytelen belépési kérés. Indítsa a belépést az adminfelületről.',
      { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  const ghHiba = cim.searchParams.get('error_description') || cim.searchParams.get('error');
  if (ghHiba) return ghVissza(allapot.vissza, { ghHiba, n: allapot.n });

  const kod = cim.searchParams.get('code');
  if (!kod) return ghVissza(allapot.vissza, { ghHiba: 'A GitHub nem küldött belépési kódot.', n: allapot.n });

  if (!kornyezet.GH_CLIENT_ID || !kornyezet.GH_CLIENT_SECRET) {
    return ghVissza(allapot.vissza, {
      ghHiba: 'A GitHub-belépés nincs beállítva a szerveren (GH_CLIENT_ID / GH_CLIENT_SECRET).',
      n: allapot.n
    });
  }

  const valaszGh = await fetch(GH_HITELESIT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: kornyezet.GH_CLIENT_ID,
      client_secret: kornyezet.GH_CLIENT_SECRET,
      code: kod
    })
  }).then((v) => v.json()).catch(() => null);

  if (!valaszGh || !valaszGh.access_token) {
    const nyers = valaszGh && (valaszGh.error_description || valaszGh.error || valaszGh.message);
    /* Az access_denied és a lejárt kód a felhasználó dolga, minden más
       a beállításé — ott a hibaüzenet magában semmit nem mond, ezért
       megmondjuk, hol kell keresni. */
    const ismert = valaszGh && /access_denied|bad_verification_code|expired/.test(valaszGh.error || '');
    return ghVissza(allapot.vissza, {
      ghHiba: ismert
        ? nyers
        : 'A GitHub elutasította a belépést' + (nyers ? ' („' + nyers + '”)' : '') +
          '. Ellenőrizze a Workerben a GH_CLIENT_ID és GH_CLIENT_SECRET értékét, ' +
          'és hogy az alkalmazás visszatérési címe pontosan ez-e: ' +
          new URL(keres.url).origin + '/gh-vissza',
      n: allapot.n
    });
  }

  return ghVissza(allapot.vissza, { gh: valaszGh.access_token, n: allapot.n });
}

export default {
  async fetch(keres, kornyezet) {
    const eredet = keres.headers.get('Origin') || '';
    const szabad = engedett(eredet, kornyezet);
    const jo = szabad ? eredet : ENGEDETT[0];
    const ut = new URL(keres.url).pathname.replace(/\/+$/, '') || '/';

    /* ---------- GitHub-belépés ---------- */

    /* A GitHub sima átirányítással jön ide, nem böngészőből indított
       kéréssel: itt nincs CORS, és nem is kell. */
    if (ut === '/gh-vissza') return ghBelepes(keres, kornyezet);

    /* Az adminfelület ebből tudja meg, felkínálhatja-e a GitHub-gombot.
       A client_id nyilvános adat — a belépési címben úgyis látszik. */
    if (ut === '/gh-beallitas') {
      if (keres.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS(jo) });
      return valasz({
        van: !!(kornyezet.GH_CLIENT_ID && kornyezet.GH_CLIENT_SECRET),
        clientId: kornyezet.GH_CLIENT_ID || null
      }, 200, jo);
    }

    /* ---------- kapcsolati űrlap ---------- */

    if (keres.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS(jo) });
    if (keres.method !== 'POST') return valasz({ hiba: 'Csak POST.' }, 405, jo);
    if (!szabad) return valasz({ hiba: 'Ismeretlen küldő oldal.' }, 403, jo);

    let adat;
    try {
      adat = await keres.json();
    } catch {
      return valasz({ hiba: 'Hibás küldemény.' }, 400, jo);
    }

    /* ---------- ellenőrzés ---------- */

    for (const mezo of MEZOK) {
      const ertek = (adat[mezo] || '').trim();
      if (!ertek) return valasz({ hiba: 'Minden csillagozott mezőt ki kell tölteni.' }, 400, jo);
      if (ertek.length > HOSSZ[mezo]) return valasz({ hiba: 'Túl hosszú: ' + mezo }, 400, jo);
    }
    if (!adat.gdpr) {
      return valasz({ hiba: 'Az adatkezelési tájékoztató elfogadása kötelező.' }, 400, jo);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adat.email.trim())) {
      return valasz({ hiba: 'Az e-mail cím nem tűnik érvényesnek.' }, 400, jo);
    }

    /* ---------- reCAPTCHA ---------- */

    if (kornyezet.RECAPTCHA_SECRET) {
      const ellenorzes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: kornyezet.RECAPTCHA_SECRET,
          response: adat.recaptcha || ''
        })
      }).then((v) => v.json()).catch(() => null);

      /* A v3 pontszámot ad, nem igen/nem választ. 0.5 alatt gyanús, de
         nem dobjuk el: megjelöljük, és az e-mail tárgya jelzi. Egy
         téves elutasítás elveszett megrendelés lenne. */
      if (!ellenorzes || !ellenorzes.success) {
        return valasz({ hiba: 'A robotellenőrzés nem sikerült. Töltse újra az oldalt.' }, 400, jo);
      }
      adat._pontszam = ellenorzes.score;
    }

    const gyanus = typeof adat._pontszam === 'number' && adat._pontszam < 0.5;
    const mikor = new Date().toISOString();

    /* ---------- tárolás ---------- */

    let tarolva = false;
    if (kornyezet.DB) {
      try {
        await kornyezet.DB.prepare(
          `INSERT INTO uzenetek (mikor, nev, email, telefon, telepules, uzenet, pontszam, ip)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          mikor, adat.nev.trim(), adat.email.trim(), adat.telefon.trim(),
          adat.telepules.trim(), adat.uzenet.trim(),
          adat._pontszam ?? null,
          keres.headers.get('CF-Connecting-IP') || null
        ).run();
        tarolva = true;
      } catch (hiba) {
        console.error('D1 írás nem sikerült:', hiba.message);
      }
    }

    /* ---------- e-mail ---------- */

    if (!kornyezet.RESEND_KULCS) {
      return tarolva
        ? valasz({ ok: true, megjegyzes: 'tárolva, e-mail nincs beállítva' }, 200, jo)
        : valasz({ hiba: 'A küldés jelenleg nem elérhető. Kérjük, írjon közvetlenül e-mailben.' }, 503, jo);
    }

    const targy = (gyanus ? '[ellenőrizendő] ' : '') +
      `Ajánlatkérés — ${adat.nev.trim()} (${adat.telepules.trim()})`;

    const level = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + kornyezet.RESEND_KULCS,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: kornyezet.FELADO || 'Weboldal <urlap@dunaenterior.hu>',
        to: [kornyezet.CIMZETT || 'office@dunaenterior.hu'],
        reply_to: adat.email.trim(),
        subject: targy,
        html: `
          <h2>Új üzenet a weboldalról</h2>
          <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">
            <tr><td><b>Név</b></td><td>${esc(adat.nev.trim())}</td></tr>
            <tr><td><b>E-mail</b></td><td>${esc(adat.email.trim())}</td></tr>
            <tr><td><b>Telefon</b></td><td>${esc(adat.telefon.trim())}</td></tr>
            <tr><td><b>Település</b></td><td>${esc(adat.telepules.trim())}</td></tr>
          </table>
          <h3>Üzenet</h3>
          <p style="white-space:pre-wrap;font-family:sans-serif">${esc(adat.uzenet.trim())}</p>
          <hr>
          <p style="color:#777;font-size:12px;font-family:sans-serif">
            Beérkezett: ${mikor}${gyanus ? ' — a robotellenőrzés alacsony pontszámot adott, érdemes átnézni' : ''}
          </p>`
      })
    }).catch(() => null);

    if (!level || !level.ok) {
      /* Az üzenet ilyenkor is megvan az adatbázisban — ezt megmondjuk,
         nem hagyjuk a látogatót abban a hitben, hogy elveszett. */
      console.error('Resend hiba:', level ? await level.text() : 'nincs válasz');
      return tarolva
        ? valasz({ ok: true, megjegyzes: 'tárolva, az értesítő levél nem ment ki' }, 200, jo)
        : valasz({ hiba: 'A küldés nem sikerült. Kérjük, írjon közvetlenül e-mailben.' }, 502, jo);
    }

    return valasz({ ok: true }, 200, jo);
  }
};
