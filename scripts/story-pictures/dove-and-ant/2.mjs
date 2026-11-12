import { PAL, hatch, tufts } from '../lib.mjs';
import { ant, compose, dove, hunter, place } from './characters.mjs';

// The Dove and the Ant, 2: a hunter creeps up with his net raised to catch the dove on her branch,
// but the little ant bites his ankle. Pinch! He winces and lifts one leg, and the dove looks round.
const ground = 'M0 272C80 268 180 274 280 270C330 268 370 271 400 269';
const trunk = 'M338 271C342 230 336 160 344 60M372 271C366 230 372 160 366 60M332 272C346 266 362 266 378 272';
const bark = 'M350 238c3 6 3 12 0 18M358 150c-3 6 -3 12 0 16M354 100c2 4 2 8 0 12';
const branch = 'M340 120C310 124 270 128 224 130M340 134C310 136 270 138 224 138';
const twig = 'M250 129C244 118 238 112 230 110';
const leaves = 'M230 110C222 104 224 96 232 96C234 102 234 106 230 110ZM224 134C214 134 210 126 216 122C220 126 222 130 224 134Z';
const crown =
  'M318 50C302 42 306 20 326 18C334 2 362 -2 376 10C388 2 404 4 404 16L404 86C394 94 382 90 374 82C364 92 346 90 338 80C322 82 310 66 318 50Z';
// "pinch!" burst at the ankle, little "ouch" marks round his head, and his tiptoe motion lines
const pinch = 'M136 234l-4 -13M144 232l3 -14M152 236l9 -10M155 245l13 -3M154 254l12 5M128 236l-10 -9';
const ouch = 'M128 70l-8 -6M124 86l-10 -1M200 66l7 -7M206 82l9 -2';

export default compose({
  title: 'The hunter and the little ant',
  seed: 87,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 268C80 264 180 270 280 266C330 264 370 267 400 265L400 300L0 300Z' },
    { c: PAL.green, o: 0.66, d: 'M320 48C306 40 310 22 328 22C336 6 362 2 374 12C386 4 400 6 400 20L400 82C392 90 382 86 374 78C364 88 348 86 340 76C324 78 314 64 320 48Z' },
    { c: PAL.ochre, o: 0.55, d: 'M340 270C344 230 338 160 346 62L364 62C368 160 362 230 368 270Z' },
    { c: PAL.terracotta, o: 0.45, d: 'M340 121C310 125 270 129 224 131L224 137C270 137 310 135 340 133Z' },
    { c: PAL.green, o: 0.8, d: leaves },
  ],
  lines: [ground, trunk, branch, twig, crown],
  fine: [
    bark,
    leaves,
    pinch,
    ouch,
    hatch(350, 110, 362, 250, 8, 8, 110, 3),
    'M330 36c3 -5 8 -5 10 0M358 22c3 -5 8 -5 10 0M384 40c3 -5 8 -5 10 0',
    hatch(20, 284, 300, 286, 12, 6, 160, 6),
    tufts([[30, 271], [220, 272], [270, 271], [390, 270]], 9, 8),
  ],
  parts: [
    place(hunter({ mood: 'ouch' }), 'translate(160 271) scale(1.3)'),
    place(ant(), 'translate(97 272) scale(1.5)'),
    place(dove({ wings: 'folded' }), 'translate(290 102) scale(1.3)'),
  ],
});
