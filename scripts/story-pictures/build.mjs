// Draws the story pictures: npm run build:pictures [-- story-id ...] (default: all).
// Writes stories/<id>/picture.svg. The shared look (paper, ink, watercolour) is in lib.mjs and
// each picture has its own file; drawings are deterministic, so unchanged pictures stay identical.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svg } from './lib.mjs';

const PICTURES = {
  'crow-and-pitcher': './crow.mjs',
  'north-wind-and-sun': './wind.mjs',
  'tortoise-and-hare': './tortoise.mjs',
  'lion-and-mouse': './lion.mjs',
  'town-mouse-and-country-mouse': './mice.mjs',
};
const outDir = process.env.STORY_PICTURES_OUT ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '../../stories');
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PICTURES);
for (const name of names) {
  const picture = (await import(PICTURES[name])).default;
  const out = path.join(outDir, name, 'picture.svg');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, svg(picture));
  console.log(out, fs.statSync(out).size, 'bytes');
}
