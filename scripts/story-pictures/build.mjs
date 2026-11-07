// Draws the story pictures into stories/<story>/picture-<n>.svg:
//   npm run build:pictures                            every picture
//   npm run build:pictures -- tortoise-and-hare       every picture of one story
//   npm run build:pictures -- tortoise-and-hare/3     one picture
// Picture <n> of a story is drawn by scripts/story-pictures/<story>/<n>.mjs (picture 1 is the cover);
// the shared look (paper, ink, watercolour) is in lib.mjs. Drawings are deterministic, so an
// unchanged picture comes out identical.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { svg } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = process.env.STORY_PICTURES_OUT ?? path.join(here, '../../stories');

const pictures = fs
  .readdirSync(here, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .flatMap((d) =>
    fs
      .readdirSync(path.join(here, d.name))
      .filter((f) => /^\d+\.mjs$/.test(f))
      .map((f) => ({ story: d.name, n: Number.parseInt(f, 10), file: path.join(here, d.name, f) })),
  )
  .sort((a, b) => a.story.localeCompare(b.story) || a.n - b.n);

const targets = process.argv.slice(2);
const chosen = targets.length ? pictures.filter((p) => targets.includes(p.story) || targets.includes(`${p.story}/${p.n}`)) : pictures;
if (!chosen.length) throw new Error(`No picture matches ${targets.join(' ')}`);
for (const p of chosen) {
  const picture = (await import(pathToFileURL(p.file).href)).default;
  const out = path.join(outDir, p.story, `picture-${p.n}.svg`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, svg(picture));
  console.log(path.relative(process.cwd(), out), fs.statSync(out).size, 'bytes');
}
