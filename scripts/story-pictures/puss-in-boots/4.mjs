import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place, puss, rock, sleevePeeking, splash, youth } from './characters.mjs';

// Puss in Boots, 4: the miller's son splashes in the river, only his head and shoulders above the
// water, while Puss, on the bank, pushes a big rock over his old patched clothes (a sleeve still
// pokes out from under it).
// the river fills the left of the picture; the grassy bank rises on the right
const bank = 'M184 300C188 272 198 254 222 249C290 244 350 246 400 246';
const water = 'M0 300L0 200C60 194 140 202 216 198C206 230 190 270 184 300Z';
const Y = 'translate(108 340) scale(1.45)';

export default compose({
  title: 'Splash!',
  seed: 109,
  washes: [
    { c: PAL.sky, o: 0.7, d: water },
    { c: PAL.slate, o: 0.18, d: 'M0 300L0 250C80 244 160 252 200 248C192 270 188 290 184 300Z' },
    { c: PAL.green, o: 0.55, d: `${bank}L400 300Z` },
  ],
  lines: [bank, 'M0 200C60 194 140 202 216 198'],
  fine: [
    'M14 236q12 -5 24 0M150 250q12 -5 24 0M180 226q12 -5 24 0M30 272q12 -5 24 0M128 282q12 -5 24 0',
    tufts([[214, 252], [270, 248]], 10, 5),
    hatch(220, 270, 390, 268, 8, 8, 170, 4),
  ],
  parts: [
    place(
      youth({
        clothes: 'none',
        mood: 'laugh',
        tilt: -8,
        arms: [
          [[-21, -108, 9], [-36, -112, 8.5], [-44, -124, 8.5], [-48, -132, 8.5]],
          [[21, -108, 9], [36, -112, 8.5], [44, -124, 8.5], [48, -132, 8.5]],
        ],
      }),
      Y,
    ),
    // water ripples round him and drops flying up
    place(splash(50), 'translate(108 202)'),
    place(splash(30), 'translate(108 186) scale(1.3)'),
    place(rock(100), 'translate(333 247)'),
    place(sleevePeeking(), 'translate(344 256) rotate(12) scale(1.15)'),
    place(
      puss({
        mood: 'sly',
        lean: 35,
        tilt: -20,
        tail: 'left',
        arms: [
          [[-15, -80, 8], [6, -72, 7], [30, -66, 7]],
          [[15, -80, 8], [30, -76, 7], [46, -72, 7]],
        ],
        legs: [
          { hip: [-9, -52], top: [-24, -38], toe: -1, turn: 28 },
          { hip: [9, -52], top: [10, -34], toe: 1 },
        ],
      }),
      'translate(240 247) scale(1.1)',
    ),
  ],
});
