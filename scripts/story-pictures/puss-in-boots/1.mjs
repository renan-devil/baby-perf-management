import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place, puss } from './characters.mjs';

// Puss in Boots, 1 (cover): Puss stands proudly in his tall red boots and feathered hat, one paw on
// his hip and the other raised, his tail curled up behind him.
const ground = 'M60 268C130 264 270 266 340 268';

export default compose({
  title: 'Puss in Boots',
  seed: 101,
  washes: [{ c: PAL.green, o: 0.4, d: 'M56 266C130 258 270 260 344 266C350 274 330 282 290 282C220 286 140 286 90 282C60 280 50 272 56 266Z' }],
  lines: [ground],
  fine: [tufts([[86, 268], [318, 268], [128, 266]], 10, 7), hatch(110, 276, 300, 278, 8, 8, 170, 3)],
  parts: [
    place(
      puss({
        mood: 'proud',
        tilt: -4,
        arms: [
          [[-15, -80, 8], [-28, -88, 7], [-36, -100, 7]],
          [[15, -80, 8], [30, -72, 7], [24, -58, 7]],
        ],
      }),
      'translate(200 270) scale(1.62)',
    ),
  ],
});
