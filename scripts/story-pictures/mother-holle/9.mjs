import { PAL, tufts } from '../lib.mjs';
import { L_ARMS, cloud, compose, crowMarks, flowers, loaf, lotte, oven, place } from './characters.mjs';

// Mother Holle, 9: in the same meadow, the loaves peep out of the oven and call, "Take us out!
// Take us out!" But Lotte marches straight past with her eyes shut and her nose in the air.
const OT = 'translate(118 258) scale(1.1)';
const ground = 'M12 258C120 255 290 255 392 258';
// the loaves' calls: little lines bursting from the oven mouth towards Lotte
const calls = crowMarks(206, 202);

export default compose({
  title: 'Lotte Walks Past the Oven',
  seed: 1409,
  washes: [{ c: PAL.green, o: 0.45, d: 'M8 256C120 248 290 248 396 256L396 296C300 300 100 300 8 296Z' }],
  lines: [ground],
  fine: [calls, tufts([[20, 258], [210, 258], [384, 258]], 9, 8), 'M244 248l-10 0M240 238l-12 0M244 228l-8 0'],
  parts: [
    place(oven(), OT),
    place(loaf({ face: true }), 'translate(104 206) rotate(-8) scale(0.95)'),
    place(loaf({ face: true }), 'translate(133 208) rotate(6) scale(0.95)'),
    place(
      lotte({
        mood: 'proud',
        tilt: -14,
        arms: L_ARMS.swing,
        legs: [
          [[-7, -8, 5.5], [-10, -4, 5]],
          [[7, -8, 5.5], [12, -4, 5]],
        ],
      }),
      'translate(282 258) scale(1.3)',
    ),
    cloud(250, 56, 70),
    flowers([[30, 276], [60, 286], [210, 282], [250, 288], [370, 278], [384, 252]], 9),
  ],
});
