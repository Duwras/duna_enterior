/* Kontrasztmérés fényképen álló szedéshez.

   A HÁTTERET a szöveg elrejtésével készült felvételen mérjük. Ez nem
   pedantéria: a szövegdobozban a legvilágosabb pixelek MAGUK A BETŰK,
   tehát ugyanazon a felvételen mérve a „legrosszabb háttérfolt” a
   betű fényét adja vissza, nem a háttérét.

   Használat:
     node kontraszt-teszt.mjs <hatter.png> '<[{cls,txt,color,size,box}]>'
*/
import sharp from 'sharp';

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const hi = Math.max(L(a), L(b)), lo = Math.min(L(a), L(b));
  return (hi + 0.05) / (lo + 0.05);
};

if (!process.argv[2] || !process.argv[3]) {
  console.error(
    '\nHasználat:\n' +
    '  node scripts/kontraszt.mjs <hatter.png> \'<[{cls,txt,color,size,box}]>\'\n\n' +
    'A <hatter.png> a szedés ELREJTÉSÉVEL készült felvétel — különben a\n' +
    'legvilágosabb pixelek maguk a betűk lesznek, és a mérés a betű\n' +
    'fényét adja vissza a háttéré helyett. A box [x, y, szélesség,\n' +
    'magasság] a getBoundingClientRect-ből, CSS-pixelben.\n');
  process.exit(2);
}

const items = JSON.parse(process.argv[3]);
const { data, info } = await sharp(process.argv[2]).raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;

for (const it of items) {
  let [x, y, w, h] = it.box;
  if (y < 0) { h += y; y = 0; }
  if (h <= 0 || y >= info.height) { console.log(`${it.cls.padEnd(14)} — képmezőn kívül`); continue; }
  h = Math.min(h, info.height - y);
  w = Math.min(w, info.width - x);

  const px = [];
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      const p = (j * info.width + i) * ch;
      px.push([data[p], data[p + 1], data[p + 2]]);
    }
  }
  px.sort((a, b) => L(a) - L(b));

  const med = px[Math.floor(px.length * 0.5)];
  const legvilagosabb = px[Math.floor(px.length * 0.98)];   /* a 2% szélső zaj kimarad */
  const fg = it.color.match(/\d+/g).map(Number);
  const fok = parseFloat(it.size);
  const kell = fok >= 18.66 ? 3.0 : 4.5;                    /* WCAG AA: nagy szedés 3:1 */
  const rMed = ratio(fg, med), rMin = ratio(fg, legvilagosabb);
  const jel = rMin >= kell ? 'OK' : (rMed >= kell ? 'HATÁRESET' : 'BUKIK');

  console.log(
    `${it.cls.padEnd(14)} ${String(Math.round(fok) + 'px').padEnd(6)} "${it.txt}"\n` +
    `   szöveg rgb(${fg})  ·  háttér medián rgb(${med}) → ${rMed.toFixed(2)}:1` +
    `  ·  legvilágosabb háttér rgb(${legvilagosabb}) → ${rMin.toFixed(2)}:1  ·  kell ${kell}:1  →  ${jel}`
  );
}
