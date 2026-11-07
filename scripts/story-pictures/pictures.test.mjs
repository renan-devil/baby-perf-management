// Every picture in stories/ is drawn by its file here (stories/<id>/picture-<n>.svg ← <id>/<n>.mjs)
// and must be exactly what that drawing produces: change a picture by editing its drawing, then
// run `npm run build:pictures`. This keeps all the pictures in one consistent style.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { svg } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const storiesDir = path.join(here, '../../stories');
const folders = (dir) => fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

const drawings = folders(here).flatMap((story) =>
  fs
    .readdirSync(path.join(here, story))
    .filter((f) => /^\d+\.mjs$/.test(f))
    .map((f) => ({ story, n: Number.parseInt(f, 10), file: path.join(here, story, f) })),
);

describe('story pictures', () => {
  it('has a drawing for every picture', () => {
    for (const story of folders(storiesDir)) {
      for (const f of fs.readdirSync(path.join(storiesDir, story)).filter((f) => /^picture-\d+\.svg$/.test(f))) {
        const n = Number.parseInt(f.slice('picture-'.length), 10);
        expect(drawings.some((d) => d.story === story && d.n === n), `stories/${story}/${f} needs scripts/story-pictures/${story}/${n}.mjs`).toBe(true);
      }
    }
  });

  it('is up to date with its drawing', async () => {
    for (const d of drawings) {
      const expected = svg((await import(pathToFileURL(d.file).href)).default);
      const file = path.join(storiesDir, d.story, `picture-${d.n}.svg`);
      const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '(missing)';
      expect(actual === expected, `stories/${d.story}/picture-${d.n}.svg is out of date: run npm run build:pictures`).toBe(true);
    }
  });
});
