import { PAL, hatch, tufts } from '../lib.mjs';
import { castleDoor, compose, mouse, place, puss, speed } from './characters.mjs';

// Puss in Boots, 9: POOF! The Ogre is now a teeny-tiny grey mouse. Squeak! He scampers out of the
// big castle door and away down the hill, with Puss bounding after him, much too late to catch him.
const ground = 'M0 282C90 278 190 284 290 282C340 281 370 284 400 286';

export default compose({
  title: 'Pounce!',
  seed: 131,
  washes: [{ c: PAL.green, o: 0.38, d: 'M0 280C90 276 190 282 290 280C340 279 370 282 400 284L400 300L0 300Z' }],
  lines: [ground],
  fine: [
    tufts([[150, 282], [270, 282], [392, 285]], 9, 9),
    hatch(10, 292, 390, 294, 10, 8, 172, 8),
    // little "squeak" marks above the mouse
    'M344 236l2 -8M356 238l6 -6M332 240l-4 -6',
  ],
  parts: [
    place(castleDoor({ open: 'ajar', wall: 22, battlements: true }), 'translate(84 282) scale(0.98)'),
    place(
      puss({
        mood: 'happy',
        lean: 28,
        tilt: -10,
        tail: 'left',
        legs: [
          { hip: [-9, -52], top: [-28, -42], toe: 1, turn: -10 },
          { hip: [9, -52], top: [26, -40], toe: 1, turn: 30 },
        ],
        arms: [
          [[-15, -80, 8], [4, -96, 7], [24, -104, 7]],
          [[15, -80, 8], [34, -86, 7], [50, -92, 7]],
        ],
      }),
      'translate(204 268) scale(1.02)',
    ),
    place(speed(3, 34, 9), 'translate(292 266)'),
    place(mouse(), 'translate(338 282) scale(2.3)'),
  ],
});
