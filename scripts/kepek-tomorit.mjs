/* Egyszeri futtatás: a régi oldalról letöltött eredeti képeket
   forrásméretre tömöríti, hogy ne a repóban hízzon 200+ MB.

   A repóban lévő kép a FORRÁS — ebből készíti a build a rácsképet és a
   nagyítót. 1800 px hosszabb oldal bőven elég: a nagyítóban is legfeljebb
   ekkora dobozban látszik, retina kijelzőn is. */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import sharp from 'sharp';

const ROOT = 'img/projektek';
const MAX_EDGE = 1800;

let before = 0, after = 0, count = 0;

for (const slug of readdirSync(ROOT)) {
  const dir = `${ROOT}/${slug}`;
  if (!statSync(dir).isDirectory()) continue;

  for (const name of readdirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(name)) continue;
    const path = `${dir}/${name}`;
    const src = readFileSync(path);

    const out = await sharp(src)
      .rotate()                                   // EXIF forgatás beégetése
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer();

    before += src.length;
    count++;
    // PNG-t is JPEG-re cserélünk, kivéve ha az eredeti kisebb maradt
    if (out.length < src.length) { writeFileSync(path, out); after += out.length; }
    else after += src.length;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`${count} kép: ${mb(before)} MB -> ${mb(after)} MB`);
