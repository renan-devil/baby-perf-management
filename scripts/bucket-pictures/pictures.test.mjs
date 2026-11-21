// Every bucket-list picture (bucket-list/<item>.svg) is drawn by its file here (<item>.mjs), and must be
// exactly what that drawing produces: change a picture by editing its drawing, then run
// `npm run build:bucket-pictures`. This keeps the pictures in the same style as the stories'.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { svg } from '../story-pictures/lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const listDir = path.join(here, '../../bucket-list');
const items = JSON.parse(fs.readFileSync(path.join(listDir, 'items.json'), 'utf8')).map((i) => i.id);
const drawings = fs
  .readdirSync(here)
  .filter((f) => f.endsWith('.mjs') && f !== 'build.mjs' && !f.endsWith('.test.mjs'))
  .map((f) => f.slice(0, -'.mjs'.length));

describe('bucket-list pictures', () => {
  it('has a drawing for every item, and no drawing without an item', () => {
    for (const id of items) expect(drawings, `scripts/bucket-pictures/${id}.mjs`).toContain(id);
    for (const id of drawings) expect(items, `${id}.mjs has no item in bucket-list/items.json`).toContain(id);
  });

  it('is up to date with its drawing', async () => {
    for (const id of drawings) {
      const expected = svg((await import(pathToFileURL(path.join(here, `${id}.mjs`)).href)).default);
      const file = path.join(listDir, `${id}.svg`);
      const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '(missing)';
      expect(actual === expected, `bucket-list/${id}.svg is out of date: run npm run build:bucket-pictures`).toBe(true);
    }
  });
});
