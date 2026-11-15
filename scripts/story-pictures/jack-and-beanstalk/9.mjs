import { PAL } from '../lib.mjs';
import { beanstalk, cloud, compose, giant, harp, jack, note, place } from './characters.mjs';

// Jack and the Beanstalk, 9: "COME BACK HERE!" The Giant climbs down the beanstalk after Jack,
// shaking his fist, his big boots kicking; the whole beanstalk shakes and sways. Below him, Jack
// slides down whoosh! holding the little golden harp, which plays a merry tune.
const stalk = [
  [196, 312, 46],
  [204, 244, 42],
  [186, 172, 38],
  [202, 104, 34],
  [192, 44, 30],
  [196, 22, 28],
];

export default compose({
  title: 'Down the beanstalk',
  seed: 293,
  washes: [{ c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 300L0 300Z' }],
  fine: [
    // shaking marks either side of the stalk, and Jack's speed lines
    'M160 60l-10 -3M162 72l-12 0M240 268l10 -3M242 280l12 0',
    'M136 168l0 -22M150 160l0 -28M164 166l0 -18',
  ],
  parts: [
    beanstalk(stalk, {
      open: true,
      leaves: [
        { at: [182, 84], a: 200, s: 1 },
        { at: [176, 148], a: 168, s: 0.85 },
        { at: [212, 222], a: 8, s: 1.15 },
        { at: [226, 282], a: -20, s: 0.9 },
      ],
      tendrils: [[178, 110, 190, 1]],
    }),
    cloud(250, -8, 170, 22, 12, 5),
    place(
      giant({
        mood: 'roar',
        tilt: -10,
        arms: [
          [[-48, -160, 22], [-66, -186, 20], [-68, -212, 19]],
          [[48, -160, 22], [74, -184, 20], [80, -212, 19]],
        ],
        legs: [
          [[-24, -70, 30], [-48, -46, 28], [-62, -28, 26]],
          [[24, -70, 30], [36, -38, 28], [40, -12, 26]],
        ],
      }),
      'translate(270 226) scale(0.84)',
    ),
    place(harp(), 'translate(114 262) scale(0.95) rotate(-8)'),
    place(note(16), 'translate(80 220) rotate(-10)'),
    place(note(14, true), 'translate(52 192) rotate(8)'),
    place(note(12), 'translate(86 170) rotate(-6)'),
    place(
      jack({
        mood: 'wow',
        tilt: 6,
        arms: [
          [[-16, -84, 8], [-30, -74, 7.5], [-38, -64, 7]],
          [[16, -84, 8], [26, -98, 7.5], [32, -110, 7]],
        ],
        legs: [
          { pts: [[-8, -47, 10], [-4, -28, 9.5], [4, -12, 9]], dir: 1 },
          { pts: [[8, -47, 10], [22, -36, 9.5], [30, -22, 9]], dir: 1 },
        ],
      }),
      'translate(150 286) scale(0.92)',
    ),
  ],
});
