import { PAL, hatch, tufts } from '../lib.mjs';
import { G_ARMS, basket, compose, flower, girl, mother, place } from './characters.mjs';

// Little Red Riding Hood, 2: at the cottage door, Mother hands her the basket of good things and
// raises one finger: "Stay on the path!"
const ground = 'M0 262C90 258 200 264 300 260C350 258 380 261 400 259';
// the end of their house on the left: a cream wall, the open doorway with its dark inside, a step
const wall = 'M0 40L76 40L76 262';
const roof = 'M-6 46L92 18L92 8L-6 36';
const doorway = 'M14 262L14 96C14 76 66 76 66 96L66 262';
const door = 'M14 262L14 96L-4 104L-4 268Z';
const step = 'M6 262L84 262L88 272L2 272Z';
const flowers = [
  [290, 262, PAL.ochre],
  [330, 262, PAL.red],
  [346, 260, PAL.sky],
  [360, 262, PAL.rose],
];

export default compose({
  title: 'Stay on the path!',
  seed: 103,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 258C90 254 200 260 300 256C350 254 380 257 400 255L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.32, d: 'M0 40L76 40L76 262L0 262Z' },
    { c: PAL.terracotta, o: 0.7, d: `${roof}Z` },
    { c: PAL.ink, o: 0.22, d: `${doorway}Z` },
    { c: PAL.green, o: 0.7, d: door },
    { c: PAL.grey, o: 0.6, d: step },
  ],
  lines: [ground, wall, roof, doorway, door, step],
  fine: [
    'M30 60c4 -2 8 -2 12 0M54 70c4 -2 8 -2 12 0',
    'M0 140l10 3M0 220l10 3',
    hatch(150, 280, 390, 282, 9, 8, 170, 4),
    tufts([[160, 262], [250, 262], [390, 260]], 9, 5),
  ],
  parts: [
    ...flowers.map(([x, y, c]) => place(flower(c), `translate(${x} ${y})`)),
    place(mother({ mood: 'stern' }), 'translate(118 266) scale(1.12)'),
    place(basket(), 'translate(171.8 174.2) scale(1.2)'),
    place(girl({ arms: G_ARMS.take, mood: 'happy' }), 'translate(232 266) scale(-1.25 1.25)'),
  ],
});
