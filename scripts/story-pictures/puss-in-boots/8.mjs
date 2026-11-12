import { PAL, hatch, rays } from '../lib.mjs';
import { compose, cupboard, lion, place, poof, puss } from './characters.mjs';

// Puss in Boots, 8: POOF! The Ogre has turned into an enormous roaring lion. Puss has jumped right
// up to the top of the tallest cupboard, boots and all, his fur standing on end.
const floor = 'M0 282C90 278 190 284 290 280C340 278 370 281 400 279';
const C = 'translate(334 282)';
const H = 150;

export default compose({
  title: 'ROOOAAAR!',
  seed: 127,
  washes: [{ c: PAL.terracotta, o: 0.25, d: 'M0 280C90 276 190 282 290 278C340 276 370 279 400 277L400 300L0 300Z' }],
  lines: [floor],
  fine: [hatch(14, 291, 386, 292, 10, 8, 172, 7), rays(236, 172, 22, 44, 7, 5, -75)],
  parts: [
    place(poof(44, 30), 'translate(66 128)'),
    place(lion(), 'translate(118 282) scale(0.98)'),
    place(cupboard(88, H), C),
    place(
      puss({
        mood: 'fright',
        bristle: true,
        tilt: -6,
        arms: [
          [[-15, -80, 8], [-28, -92, 7], [-34, -106, 7]],
          [[15, -80, 8], [28, -92, 7], [34, -106, 7]],
        ],
        legs: [
          { hip: [-9, -52], top: [-14, -34], toe: -1 },
          { hip: [9, -52], top: [14, -34], toe: 1 },
        ],
      }),
      `${C} translate(0 ${-H - 8}) scale(0.7)`,
    ),
  ],
});
