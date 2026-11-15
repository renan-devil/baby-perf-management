import { PAL } from '../lib.mjs';
import { boat, compose, emperor, place, waves, wind } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 9: "More wind!" Whoosh! The wind fills the red sail and
// carries the boat far away over the waves, while the Emperor holds on to his hat. Far ahead
// waits a little green island.
const B = 'translate(180 244) rotate(-5) scale(1.08)';
const E = 'translate(140 300) rotate(-5) scale(0.9)';
const sea = 'M0 236C120 230 280 230 400 236L400 300L0 300Z';
const island = 'M330 234C336 216 368 214 380 234Z';
const tree = 'M356 220C356 208 352 200 348 194M348 194C340 190 334 192 330 196M348 194C356 188 364 190 368 196M348 194C346 186 348 180 352 176';

export default compose({
  title: 'The wind carries the boat away',
  seed: 899,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 236L0 236Z' },
    { c: PAL.sky, o: 0.85, d: sea },
    { c: PAL.slate, o: 0.35, d: sea },
    { c: PAL.green, o: 0.8, d: island },
  ],
  lines: [island],
  fine: [
    tree,
    wind(12, 70, 70, 1.2),
    wind(30, 130, 60, 1),
    wind(8, 190, 54, 0.9),
    wind(250, 60, 50, 0.9),
    waves(0, 400, 262, 5, 12, true),
    waves(-20, 400, 292, 4, 12, true),
    waves(220, 330, 244, 3, 4),
    'M300 120q10 -4 20 0M314 134q8 -3 16 0',
  ],
  parts: [
    place(
      emperor({
        mood: 'wow',
        upper: true,
        arms: [
          [[-22, -116, 13], [-48, -124, 12], [-44, -150, 11]],
          [[22, -116, 13], [48, -124, 12], [44, -150, 11]],
        ],
      }),
      E,
    ),
    place(boat({ sail: 'full' }), B),
  ],
});
