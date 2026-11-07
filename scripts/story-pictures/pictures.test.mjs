// Every picture in stories/ is drawn by its file here (stories/<id>/picture-<n>.svg ← <id>/<n>.mjs)
// and must be exactly what that drawing produces: change a picture by editing its drawing, then
// run `npm run build:pictures`. This keeps all the pictures in one consistent style.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { svg, transformPath } from './lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const storiesDir = path.join(here, '../../stories');
const folders = (dir) => fs.readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

const drawings = folders(here).flatMap((story) =>
  fs
    .readdirSync(path.join(here, story))
    .filter((f) => /^\d+\.mjs$/.test(f))
    .map((f) => ({ story, n: Number.parseInt(f, 10), file: path.join(here, story, f) })),
);

describe('placing shapes (transformPath)', () => {
  it('moves, turns, mirrors and scales path data', () => {
    expect(transformPath('M0 0L10 0', 'translate(5 5)')).toBe('M 5 5 L 15 5');
    expect(transformPath('M10 10l5 0h5v5z', 'translate(1 2)')).toBe('M 11 12 L 16 12 L 21 12 L 21 17 Z');
    expect(transformPath('M10 0', 'rotate(90)')).toBe('M 0 10');
    expect(transformPath('M20 10', 'rotate(90 10 10)')).toBe('M 10 20');
    expect(transformPath('M10 0', 'scale(-1 1)')).toBe('M -10 0');
    expect(transformPath('M1 1', 'translate(10 0) scale(2)')).toBe('M 12 2'); // right to left, as in SVG
    expect(transformPath('M0 0c1 1 2 2 3 3s1 1 2 2q1 1 2 2t1 1', 'translate(1 1)')).toBe('M 1 1 C 2 2 3 3 4 4 S 5 5 6 6 Q 7 7 8 8 T 9 9');
    expect(transformPath('M0 0 5 5', 'scale(2)')).toBe('M 0 0 L 10 10'); // pairs after a move are lines
  });

  it('keeps arcs exact when turned or mirrored', () => {
    expect(transformPath('M0 0A5 10 30 0 1 10 0', 'rotate(90)')).toBe('M 0 0 A 5 10 120 0 1 0 10');
    expect(transformPath('M0 0A5 10 30 0 1 10 0', 'scale(-2 2)')).toBe('M 0 0 A 10 20 150 0 0 -20 0');
    expect(() => transformPath('M0 0A5 5 0 0 1 10 0', 'scale(1 2)')).toThrow();
  });
});

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
