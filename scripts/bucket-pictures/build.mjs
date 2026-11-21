// Draws the bucket-list pictures into bucket-list/<item>.svg:
//   npm run build:bucket-pictures                  every picture
//   npm run build:bucket-pictures -- see-the-sea   one picture (or several, separated by spaces)
// The picture of an item is drawn by scripts/bucket-pictures/<item>.mjs, with the same look as the
// story pictures (paper, ink, watercolour: ../story-pictures/lib.mjs). Drawings are deterministic,
// so an unchanged picture comes out identical.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { svg } from '../story-pictures/lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.env.BUCKET_PICTURES_OUT ?? path.join(here, '../../bucket-list');

const pictures = fs
  .readdirSync(here)
  .filter((f) => f.endsWith('.mjs') && f !== 'build.mjs' && !f.endsWith('.test.mjs'))
  .map((f) => ({ item: f.slice(0, -'.mjs'.length), file: path.join(here, f) }))
  .sort((a, b) => a.item.localeCompare(b.item));

const targets = process.argv.slice(2);
const chosen = targets.length ? pictures.filter((p) => targets.includes(p.item)) : pictures;
if (!chosen.length) throw new Error(`No picture matches ${targets.join(' ')}`);
for (const p of chosen) {
  const picture = (await import(pathToFileURL(p.file).href)).default;
  const out = path.join(outDir, `${p.item}.svg`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, svg(picture));
  console.log(path.relative(process.cwd(), out), fs.statSync(out).size, 'bytes');
}
