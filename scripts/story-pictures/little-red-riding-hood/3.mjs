import { PAL, tufts } from '../lib.mjs';
import { G_ARMS, basket, compose, flower, girl, place, wolf } from './characters.mjs';

// Little Red Riding Hood, 3: on the forest path, out steps the big grey wolf, with his pointed ears,
// his long nose and his very big smile, and bows to her ever so politely. "Good morning, little girl."
const path = 'M0 258C90 250 200 258 300 250C340 247 372 250 400 248L400 272C300 278 120 274 0 284Z';
const pathEdges = 'M0 258C90 250 200 258 300 250C340 247 372 250 400 248M0 284C120 274 300 278 400 272';
// two trees behind them
const t1 = 'M20 252C24 200 18 120 26 60M42 252C38 200 42 120 38 60';
const c1 = 'M-10 64C-24 52 -14 26 8 26C16 10 50 8 60 26C78 26 86 46 74 60C80 76 62 84 48 76C34 86 12 84 6 74C-8 76 -18 70 -10 64Z';
const t2 = 'M360 250C362 200 358 150 364 100M378 250C374 200 378 150 376 100';
const c2 = 'M336 104C322 94 330 72 350 70C358 56 388 54 398 70C412 72 414 92 404 102C410 118 392 124 380 116C368 126 348 124 342 114C330 116 326 108 336 104Z';
const flowers = [
  [70, 250, PAL.red],
  [84, 252, PAL.ochre],
  [300, 250, PAL.sky],
  [314, 249, PAL.red],
];

export default compose({
  title: 'Good morning, little girl',
  seed: 107,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 254C90 246 200 254 300 246C340 243 372 246 400 244L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.42, d: path },
    { c: PAL.ochre, o: 0.45, d: 'M20 252C24 200 18 120 26 70L38 70C42 120 38 200 42 252Z' },
    { c: PAL.green, o: 0.6, d: c1 },
    { c: PAL.ochre, o: 0.45, d: 'M360 250C362 200 358 150 364 110L376 110C378 150 374 200 378 250Z' },
    { c: PAL.green, o: 0.6, d: c2 },
  ],
  lines: [t1, c1, t2, c2],
  fine: [
    pathEdges,
    'M18 40c3 -5 8 -5 10 0M50 50c3 -5 8 -5 10 0M354 90c3 -5 8 -5 10 0',
    'M150 270c4 -2 8 -2 12 0M330 264c4 -2 8 -2 12 0',
    // little musical notes of birdsong
    'M150 40l0 -14l8 3M220 56l0 -12l7 3',
    tufts([[110, 252], [200, 254], [390, 246]], 9, 6),
  ],
  fills: '<path d="M146 41a4 3 0 1 0 8 0a4 3 0 1 0 -8 0ZM216 57a4 3 0 1 0 8 0a4 3 0 1 0 -8 0Z"/>',
  parts: [
    ...flowers.map(([x, y, c]) => place(flower(c), `translate(${x} ${y})`)),
    place(girl({ arms: G_ARMS.basket, mood: 'peep' }), 'translate(120 266) scale(1.3)'),
    place(basket(), 'translate(153.8 201) scale(1.3)'),
    place(wolf({ pose: 'bow', mouth: 'grin' }), 'translate(282 264) scale(-1.02 1.02)'),
  ],
});
