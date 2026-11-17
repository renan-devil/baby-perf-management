import { PAL, transformPath, tufts } from '../lib.mjs';
import { G_ARMS, WOLF_PEEP_BACK, basket, compose, flower, girl, place, wolfPeep } from './characters.mjs';

// Little Red Riding Hood, 1 (cover): in her red hooded cape, with her basket under its white cloth,
// she walks along the forest path, tip-tap. Behind a big tree, the grey wolf peeps out at her and
// grins.
const path = 'M0 262C90 254 200 262 300 254C340 251 372 254 400 252L400 274C300 280 120 276 0 286Z';
const pathEdges = 'M0 262C90 254 200 262 300 254C340 251 372 254 400 252M0 286C120 276 300 280 400 274';
// the big tree on the right, the wolf peeping out from its left side
const WT = 'translate(292 128) scale(-1.15 1.15)';
const trunkFill = 'M290 254C296 200 290 120 297 60L337 60C334 120 342 200 350 254Z';
const trunkL = ['M290 254C293 222 293 194 292 176', 'M292 98C293 82 295 72 297 64'];
const trunkR = 'M350 254C342 200 334 120 337 64';
const roots = 'M290 254C282 256 276 258 270 260M350 254C358 256 366 258 374 258';
const crown = 'M250 40C232 30 238 6 262 4C268 -10 300 -14 314 -4C330 -14 362 -10 368 6C392 4 404 24 396 42C404 60 386 74 370 66C356 80 330 80 318 70C300 80 272 78 264 66C246 68 240 54 250 40Z';
// a thin tree far off on the left
const farTrunk = 'M40 248C42 200 38 140 44 70M58 248C54 200 58 140 54 70';
const farCrown = 'M14 72C0 62 8 40 28 40C36 24 66 24 74 40C92 40 98 58 88 70C94 86 76 94 62 86C50 96 30 94 24 84C8 86 4 76 14 72Z';
const flowers = [
  [100, 252, PAL.red],
  [116, 250, PAL.ochre],
  [214, 252, PAL.sky],
  [228, 250, PAL.rose],
  [380, 250, PAL.ochre],
];

export default compose({
  title: 'Little Red Riding Hood',
  seed: 101,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 250C80 246 180 252 280 248C330 246 370 249 400 247L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.42, d: path },
    { c: PAL.ochre, o: 0.55, d: `${trunkFill}${transformPath(WOLF_PEEP_BACK, WT)}`, rule: 'evenodd' },
    { c: PAL.green, o: 0.66, d: crown },
    { c: PAL.ochre, o: 0.45, d: 'M40 248C42 200 38 140 44 70L54 70C58 140 54 200 58 248Z' },
    { c: PAL.green, o: 0.55, d: farCrown },
  ],
  lines: [...trunkL, trunkR, roots, crown, farTrunk, farCrown],
  fine: [
    pathEdges,
    'M326 220c3 6 3 12 0 18M318 70c-3 6 -3 12 0 16M330 110c2 5 2 10 0 14',
    'M270 30c3 -5 8 -5 10 0M300 12c3 -5 8 -5 10 0M346 40c3 -5 8 -5 10 0M30 60c3 -5 8 -5 10 0',
    'M70 230c4 -2 8 -2 12 0M250 268c4 -2 8 -2 12 0M150 280c4 -2 8 -2 12 0',
    tufts([[20, 248], [180, 250], [260, 248], [392, 247]], 9, 8),
  ],
  parts: [
    ...flowers.map(([x, y, c]) => place(flower(c), `translate(${x} ${y})`)),
    place(wolfPeep({ mouth: 'grin' }), WT),
    place(girl({ arms: G_ARMS.basket, legs: 'walk', mood: 'happy', tilt: 4 }), 'translate(160 268) scale(1.3)'),
    place(basket(), 'translate(193.8 203) scale(1.3)'),
  ],
});
