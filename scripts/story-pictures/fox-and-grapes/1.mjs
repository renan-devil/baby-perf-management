import { PAL, rays } from '../lib.mjs';
import { compose, fox, place } from '../fox-and-crow/characters.mjs';
import { scene } from './scene.mjs';

// The Fox and the Grapes, 1 (cover): on a hot day the red fox sits looking up, licking his lips,
// at a big bunch of purple grapes hanging high on the vine over an old stone wall.
const s = scene();
// a drop of drool: he would love those grapes
const drool = 'M199 128c-2 5 -3 8 0 10c3 -2 2 -5 0 -10Z';
const sun = 'M40 50C40 36 52 28 64 28C76 28 86 38 86 50C86 63 76 72 63 72C51 72 40 63 40 50Z';

export default compose({
  title: 'The Fox and the Grapes',
  seed: 61,
  washes: [{ c: PAL.sky, o: 0.7, d: drool }, { c: PAL.ochre, o: 0.7, d: 'M38 52C36 36 54 26 66 28C80 32 88 44 86 56C82 70 66 76 54 72C44 68 39 60 38 52Z' }, ...s.washes],
  lines: [...s.lines, sun],
  fine: [...s.fine, rays(63, 50, 30, 42, 11, 4), drool],
  glints: s.glints,
  parts: [place(fox(), 'translate(120 270) scale(1.3)')],
});
