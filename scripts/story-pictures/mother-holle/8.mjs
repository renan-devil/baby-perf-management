import { PAL, hatch, tufts } from '../lib.mjs';
import { cockerel, compose, crowMarks, dot, marie, oval, place, twinkle, well } from './characters.mjs';

// Mother Holle, 8: back home, the cockerel stands on the edge of the old well, flaps his wings and
// crows, "Cock-a-doodle-doo! Our golden girl's come home to you!" Golden Marie waves as she comes
// back across the garden, her spindle in her other hand.
const WT = 'translate(122 278) scale(1.5)';
const CT = 'translate(104 196) scale(1.1)';
const ground = 'M14 278C120 275 290 275 390 278';
// the spindle in Marie's left hand (canvas coordinates)
const spindle = 'M341 196L348 240';
const whorl = oval(346.8, 231, 3.6, 2.6);

export default compose({
  title: 'The Cockerel Crows',
  seed: 1408,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M10 276C120 268 290 268 394 276C390 288 300 296 200 296C110 296 14 290 10 276Z' },
    { c: PAL.terracotta, o: 0.9, d: whorl },
    { c: PAL.ochre, o: 0.2, d: dot(296, 190, 66) },
  ],
  lines: [ground, spindle],
  fine: [
    whorl,
    crowMarks(158, 118),
    hatch(220, 288, 380, 288, 8, 6, 160, 6),
    tufts([[20, 278], [214, 278], [372, 278]], 9, 5),
    twinkle(250, 120, 6),
    twinkle(352, 140, 7),
    twinkle(240, 200, 5),
    twinkle(372, 210, 5),
    twinkle(318, 96, 4),
  ],
  parts: [
    place(well({ roof: false }), WT),
    place(cockerel({ crow: true }), CT),
    place(
      marie({
        mood: 'laugh',
        look: -1,
        gold: true,
        tilt: -4,
        arms: [
          [[-12, -80, 7], [-24, -88, 6.5], [-30, -102, 6.5], [-32, -114, 6.5]],
          [[12, -80, 7], [22, -70, 6.5], [30, -60, 6.5], [34, -54, 6.5]],
        ],
      }),
      'translate(300 278) scale(1.3)',
    ),
  ],
});
