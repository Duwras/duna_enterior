/* A kapcsolati űrlap végpontja.

   A weboldal statikus, tehát nincs hova POST-olni — ez a Cloudflare
   Worker veszi át azt a néhány dolgot, amihez szerver kell:

     1. ellenőrzi a reCAPTCHA jegyet a Google-nél
     2. eltárolja az üzenetet a D1 adatbázisban
     3. elküldi e-mailben a Resenden át

   A tárolás azért van a küldés ELŐTT, mert ha az e-mail elakad (lejárt
   kulcs, szolgáltatáskimaradás), az üzenet akkor se vesszen el.

   Beállítás: worker/OLVASSEL.md
*/

const CORS = (eredet) => ({
  'Access-Control-Allow-Origin': eredet,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
});

/* Csak a saját oldalról fogadunk küldést. A github.io cím addig kell,
   amíg a domain nem áll át.

   IDEIGLENES: az ertekpontpenzugyek.hu a Duwras.github.io felhasználói
   Pages-oldal saját domainje, és a projektoldalak öröklik — a
   duwras.github.io/duna_enterior/ cím 301-gyel oda irányít, tehát a
   bongeszo ONNAN kuld, azt az Origin-t latjuk. Nelkule az urlap sajat
   magunkat dobna vissza. A domainvaltas utan ez a sor TORLENDO. */
const ENGEDETT = [
  'https://dunaenterior.hu',
  'https://www.dunaenterior.hu',
  'https://duwras.github.io',
  'https://ertekpontpenzugyek.hu'
];

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

export default {
  async fetch(keres, kornyezet) {
    const eredet = keres.headers.get('Origin') || '';
    const jo = ENGEDETT.includes(eredet) ? eredet : ENGEDETT[0];

    if (keres.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS(jo) });
    if (keres.method !== 'POST') return valasz({ hiba: 'Csak POST.' }, 405, jo);
    if (!ENGEDETT.includes(eredet)) return valasz({ hiba: 'Ismeretlen küldő oldal.' }, 403, jo);

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
