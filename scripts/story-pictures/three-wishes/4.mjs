import { PAL, hatch, rays } from '../lib.mjs';
import { compose, place, sausage, woodcutter } from './1.mjs';
import { F_ARMS, F_NOSE, fanchon } from './3.mjs';

// The Three Wishes, 4: "I wish that sausage were stuck on the end of your nose!" Whoosh! Boing! The
// long sausage jumps out of the pan and sticks on the end of Fanchon's nose, dangling down to her chin.
// Fanchon flings up her arms, astonished; the woodcutter clutches his cap: oh dear, what has he done?
const F = 'translate(250 286) scale(2)';
const W = 'translate(92 286) scale(1.35)';
const wArms = [
  [[-16, -84, 9], [-30, -98, 8], [-18, -120, 7]],
  [[16, -84, 9], [30, -98, 8], [18, -120, 7]],
];
const [nx, ny] = F_NOSE;
// the sausage, in Fanchon's own coordinates: from the end of her nose, wiggling down past her chin
const SAUSAGE = [
  [nx + 0.5, ny + 0.5, 8],
  [nx + 2, ny + 8, 10],
  [nx + 4.5, ny + 16, 10.5],
  [nx + 3, ny + 24, 10],
];

export default compose({
  title: "The sausage on Fanchon's nose",
  seed: 74,
  washes: [{ c: PAL.ochre, o: 0.3, d: 'M0 286C80 284 160 288 240 285C300 283 350 286 400 285L400 300L0 300Z' }],
  lines: ['M0 286C80 284 160 288 240 285C300 283 350 286 400 285'],
  fine: [hatch(20, 294, 380, 294, 14, 5, 168, 3)],
  parts: [
    place(woodcutter({ mood: 'wow', arms: wArms, look: [2, 0] }), W),
    place(fanchon({ mood: 'wow', arms: F_ARMS.up, look: [0, 1.4], nosey: true }), F),
    place(sausage(SAUSAGE, { tie: false }), F),
    place(
      {
        fine: [
          // boing! wiggle marks either side of the sausage
          'M-8 -78q-3 2 -1 5q2 3 -1 5M16 -80q3 2 1 5q-2 3 1 5',
          // surprise marks above her head
          rays(0, -112, 24, 31, 9, 6, -170).split('M').slice(0, 6).join('M'),
        ],
      },
      F,
    ),
  ],
});
