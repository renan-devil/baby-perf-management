import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { compose, dot, oval, place, prince, thumbelina } from './characters.mjs';

// Thumbelina, 10: in a warm land full of big white flowers, Thumbelina, with new wings on her back,
// smiles at a tiny flower prince with a gold crown.
const ground = 'M0 262C90 258 180 264 260 261C320 259 370 262 400 260';
/** A big white flower of n petals round (cx, cy), petals r long. */
function bloom(cx, cy, r, n = 6, turn = 0) {
  const petal = oval(0, -r * 0.55, r * 0.3, r * 0.55);
  const petals = Array.from({ length: n }, (_, i) => transformPath(petal, `translate(${cx} ${cy}) rotate(${turn + (i * 360) / n})`));
  return { petals, heart: dot(cx, cy, r * 0.22) };
}
const left = bloom(62, 62, 52, 6, 10);
const right = bloom(342, 70, 48, 6, 30);
const stemL = 'M30 262C24 200 30 140 48 108M44 262C40 200 46 150 60 112';
const stemR = 'M370 262C378 200 374 150 356 116M384 262C390 200 388 150 370 114';
const leafL = 'M32 210C10 196 0 176 4 160C20 168 30 186 34 200Z';
const leafR = 'M378 200C396 184 400 166 396 150C382 160 374 176 374 194Z';
const TH_ARMS = [
  [[-12, -62, 6], [-16, -52, 5.5], [-18, -42, 5], [-18, -36, 5]],
  [[12, -62, 6], [24, -54, 5.5], [38, -46, 5], [52, -42, 5]],
];
const PR_ARMS = [
  [[-12, -62, 6], [-24, -54, 5.5], [-38, -46, 5], [-52, -42, 5]],
  [[12, -62, 6], [16, -52, 5.5], [18, -42, 5], [18, -36, 5]],
];

export default compose({
  title: 'Thumbelina and the flower prince',
  seed: 110,
  washes: [
    { c: PAL.green, o: 0.45, d: 'M0 262C90 258 180 264 260 261C320 259 370 262 400 260L400 298C300 300 100 300 0 298Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 262C90 258 180 264 260 261C320 259 370 262 400 260L400 298C300 300 100 300 0 298Z' },
    { c: PAL.green, o: 0.7, d: `${stemL}Z${stemR}Z${leafL}${leafR}` },
    { c: PAL.grey, o: 0.22, d: [...left.petals, ...right.petals].join('') },
    { c: PAL.ochre, o: 0.95, d: left.heart + right.heart },
  ],
  lines: [ground, ...left.petals, ...right.petals, stemL, stemR, leafL, leafR],
  fine: [
    left.heart,
    right.heart,
    'M10 176l18 22M392 166l-16 22',
    tufts([[110, 262], [200, 262], [300, 260], [220, 263]], 10, 7),
    hatch(30, 282, 380, 284, 9, 7, 170, 6),
    'M196 96l0 10M191 101l10 0M222 70l0 8M218 74l8 0',
  ],
  parts: [
    place(thumbelina({ arms: TH_ARMS, mood: 'peep', wings: true }), 'translate(128 262) scale(1.38)'),
    place(prince({ arms: PR_ARMS }), 'translate(272 262) scale(1.38)'),
  ],
});
