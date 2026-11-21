import { PAL, hatch, zed } from '../lib.mjs';
import { catAsleep, compose, cook, cushion, dogAsleep, oven, place, rug, sparkles } from './characters.mjs';

// Picture 7: all through the castle everyone falls asleep: the cook by the oven, the dog on the
// rug, the cat on its cushion.
const floor = 'M10 262C140 258 280 258 392 262';
const zzz = (x, y, s) => [zed(x, y, 6 * s), zed(x + 9 * s, y - 15 * s, 8 * s), zed(x + 22 * s, y - 34 * s, 10 * s)];

export default compose({
  title: 'The Whole Castle Asleep',
  seed: 2707,
  washes: [{ c: PAL.grey, o: 0.28, d: 'M10 262C140 258 280 258 392 262L392 284C280 288 140 288 8 284Z' }],
  lines: [floor],
  fine: [hatch(20, 274, 390, 274, 10, 6, 160, 10), ...zzz(192, 118, 1.1), ...zzz(206, 206, 1), ...zzz(330, 192, 0.9)],
  parts: [
    place(oven(), 'translate(58 262) scale(0.9)'),
    place(cook(), 'translate(152 262) scale(1.15)'),
    place(rug(64, [-50, 48]), 'translate(242 262) scale(1.25 1.1)'),
    place(dogAsleep(), 'translate(244 262) scale(1.35)'),
    place(cushion(), 'translate(350 266) scale(1.1)'),
    place(catAsleep(), 'translate(348 244) scale(1.35)'),
    sparkles([
      [120, 40, 5],
      [300, 60, 6],
      [216, 30, 4],
      [380, 120, 4],
    ]),
  ],
});
