import { PAL, hatch, tufts } from '../lib.mjs';
import { apple, appleTree, compose, flowers, marie, place } from './characters.mjs';

// Mother Holle, 4: Marie holds the trunk of the apple tree and shakes it, laughing; the red apples
// tumble down all around her, pom, pom, pom, and the first ones already lie in the grass.
const TT = 'translate(214 266) scale(1.2)';
const ground = 'M16 266C120 263 290 263 388 266';
// the crown shivers: little shake marks on each side
const shake = 'M96 92l-10 -4M92 112l-12 0M94 132l-10 4M332 86l10 -4M336 106l12 0M334 126l10 4M242 190l8 -2M242 204l9 0M242 218l8 2';

export default compose({
  title: 'Marie Shakes the Apple Tree',
  seed: 1404,
  washes: [{ c: PAL.green, o: 0.4, d: 'M12 264C120 256 290 256 392 264C388 280 300 288 200 288C110 288 16 282 12 264Z' }],
  lines: [ground],
  fine: [shake, hatch(40, 278, 370, 278, 12, 6, 160, 4), tufts([[28, 266], [100, 266], [330, 266], [380, 266]], 9, 6)],
  parts: [
    place(appleTree({ apples: [[-60, -150], [-30, -180], [10, -160], [44, -176], [60, -140], [-20, -130]] }), TT),
    place(
      marie({
        mood: 'laugh',
        look: 1,
        up: 1,
        tilt: 4,
        arms: [
          [[-12, -80, 7], [-2, -66, 6.5], [14, -58, 6.5], [27, -56, 6.5]],
          [[12, -80, 7], [22, -76, 6.5], [29, -72, 6.5]],
        ],
      }),
      'translate(166 266) scale(1.2)',
    ),
    apple(118, 150, true),
    apple(112, 196, true),
    apple(268, 160, true),
    apple(300, 206, true),
    apple(254, 226, true),
    apple(76, 228, true),
    apple(332, 176, true),
    apple(122, 262),
    apple(252, 264),
    apple(270, 268),
    apple(304, 262),
    apple(84, 268),
    flowers([[40, 280], [356, 280], [380, 258]], 6),
  ],
});
