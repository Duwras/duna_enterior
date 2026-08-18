/* Megkeresi azokat a mobil felülírásokat, amiket egy nagyobb
   specificitású alapszabály némán legyőz.

   A hiba fajtája, ahogy a főoldal metszeténél előfordult:

     body[data-lemezek] .metszet-ragad { grid-template-columns: … }  0-2-1
     @media (max-width: 900px) { .metszet-ragad { … } }              0-1-0

   A médiakérdés NEM ad specificitást, tehát a mobil szabály sosem
   érvényesül. Ott ez 390 px-en 81 px-es bélyeggé zsugorította a
   színpad aktív lemezét, a feliratát a képmezőn kívülre vágva.

   Három szűkítés kell, különben a jelzés használhatatlanul zajos:

     1. Az alapszabálynak a mobil szelektorra kell VÉGZŐDNIE. Csak így
        biztos, hogy ugyanarra az elemre illik: a `.harom article h2`
        és a `.metszet-fej h2` mindkettő `h2`-re végződik, de más
        felmenővel — soha nem ugyanaz az elem.
     2. A két fájlnak egy lapon kell lennie. A fooldal.css csak az
        index.html-en van, a keszules.css csak a keszules.html-en —
        közöttük nincs ütközés, akármit írnak.
     3. Az ÉRTÉKNEK különbözni kell. A `.ter-reteg.koz` telefonon és a
        lapos tartalékban is `display: none` — a nagyobb specificitás
        ott nem okoz néma különbséget, tehát nem hiba.

   Futtatás:  npm run specificitas
   Kilépési kód 1, ha talált — így CI-ben is használható.
*/
import { readFileSync } from 'node:fs';

/* melyik lap melyik stíluslapot tölti be */
const LAPOK = {
  'index.html':    ['fonts.css', 'rendszer.css', 'style.css', 'ter.css', 'terv.css', 'fooldal.css'],
  'flotta.html':   ['fonts.css', 'rendszer.css', 'style.css', 'ter.css', 'terv.css', 'flotta.css'],
  'keszules.html': ['fonts.css', 'rendszer.css', 'style.css', 'ter.css', 'terv.css', 'keszules.css'],
  'admin.html':    ['fonts.css', 'admin.css']
};
const FAJLOK = [...new Set(Object.values(LAPOK).flat())];

const egyLapon = (a, b) =>
  a === b || Object.values(LAPOK).some((l) => l.includes(a) && l.includes(b));

const spec = (sel) => {
  const id = (sel.match(/#[\w-]+/g) || []).length;
  const cls = (sel.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+(\([^)]*\))?/g) || [])
    .filter((s) => !/^:(?:before|after|first-line|first-letter)$/.test(s)).length;
  const tag = (sel.match(/(^|[\s>+~])[a-z][\w-]*/g) || []).length;
  return [id, cls, tag];
};
const nagyobb = (a, b) => (a[0] - b[0]) || (a[1] - b[1]) || (a[2] - b[2]);
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/* tulajdonság → érték, mert az egyező érték nem hiba */
const deklaraciok = (blokk) => {
  const ki = {};
  for (const d of blokk.split(';')) {
    const k = d.indexOf(':');
    if (k < 0) continue;
    const nev = norm(d.slice(0, k));
    if (!/^[-a-z]+$/.test(nev)) continue;
    ki[nev] = norm(d.slice(k + 1)).replace(/!important$/, '').trim();
  }
  return ki;
};

const szabalyok = [];
for (const f of FAJLOK) {
  let css;
  try { css = readFileSync(f, 'utf8'); } catch { continue; }
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');

  const media = [];
  css = css.replace(/@media([^{]+)\{((?:[^{}]|\{[^{}]*\})*)\}/g, (_, q, body) => {
    media.push([norm(q), body]); return '';
  });

  const bont = (body, mediaQ) => {
    for (const m of body.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const props = deklaraciok(m[2]);
      for (const sel of m[1].split(',')) {
        const s = norm(sel);
        if (!s || s.startsWith('@')) continue;
        szabalyok.push({ f, sel: s, mediaQ, props, spec: spec(s) });
      }
    }
  };
  bont(css, null);
  for (const [q, body] of media) bont(body, q);
}

const mobil = szabalyok.filter((r) => r.mediaQ && /max-width/.test(r.mediaQ));
const alap  = szabalyok.filter((r) => !r.mediaQ);

const illik = (a, m) => a === m || a.endsWith(' ' + m);

/* Ha ugyanarra az elemre egy MÁSIK mobil szabály már nagyobb
   specificitással szól, a felülírás rendben van. */
const vanErosebbMobil = (m, prop) => mobil.some((x) =>
  x !== m && egyLapon(x.f, m.f) && prop in x.props &&
  illik(x.sel, m.sel) && nagyobb(x.spec, m.spec) > 0);

const talalat = [];
for (const m of mobil) {
  for (const a of alap) {
    if (!egyLapon(a.f, m.f)) continue;
    if (nagyobb(a.spec, m.spec) <= 0) continue;
    if (!illik(a.sel, m.sel)) continue;
    const utkozo = Object.keys(m.props).filter((p) =>
      p in a.props && a.props[p] !== m.props[p] && !vanErosebbMobil(m, p));
    if (!utkozo.length) continue;
    talalat.push({ props: utkozo,
      mobil: `${m.f}  @media ${m.mediaQ}  ${m.sel}  [${m.spec.join('-')}]`,
      alap:  `${a.f}  ${a.sel}  [${a.spec.join('-')}]` });
  }
}

for (const t of talalat) {
  console.log(`!! ${t.props.join(', ')}`);
  console.log(`   mobil VESZÍT: ${t.mobil}`);
  console.log(`   alap  NYER  : ${t.alap}\n`);
}
console.log(talalat.length
  ? `${talalat.length} néma felülírás. Emeld a mobil szabály specificitását.`
  : `Nincs néma felülírás. (${szabalyok.length} szabály: ${mobil.length} mobil, ${alap.length} alap.)`);
process.exit(talalat.length ? 1 : 0);
