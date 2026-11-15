import { PAL, hatch, tufts } from '../lib.mjs';
import { beanstalk, castle, cloud, compose, cottage, jack, place } from './characters.mjs';

// Jack and the Beanstalk, 1 (cover): Jack climbs an enormous beanstalk, one hand gripping the stalk
// and the other waving, up and up towards the clouds, where a castle sits on top. Far below, the
// little cottage.
const stalk = [
  [128, 308, 46],
  [168, 252, 41],
  [136, 192, 35],
  [170, 140, 29],
  [206, 114, 24],
  [228, 104, 20],
];

export default compose({
  title: 'Jack and the Beanstalk',
  seed: 211,
  washes: [
    { c: PAL.sky, o: 0.28, d: 'M0 0L400 0L400 268C330 256 260 266 200 278C130 262 60 254 0 270Z' },
    { c: PAL.green, o: 0.5, d: 'M0 270C60 254 130 262 200 276C260 266 330 256 400 268L400 300L0 300Z' },
  ],
  lines: ['M0 272C40 262 90 258 130 262M180 270C190 273 200 276 210 276C266 266 330 258 400 270'],
  fine: [tufts([[236, 284], [300, 276], [376, 280]], 8, 5), hatch(240, 292, 380, 290, 6, 7, 170, 9)],
  parts: [
    place(cottage({ dark: false }), 'translate(334 270) scale(0.3)'),
    beanstalk(stalk, {
      open: true,
      leaves: [
        { at: [112, 286], a: 195, s: 1.15 },
        { at: [182, 256], a: 4, s: 1.15 },
        { at: [120, 206], a: 200, s: 1.05 },
        { at: [150, 168], a: 168, s: 0.8 },
        { at: [190, 126], a: -40, s: 0.75 },
      ],
      tendrils: [
        [150, 232, -12, 1.2],
        [196, 116, -60, 0.7],
      ],
    }),
    cloud(292, 82, 112, 26, 11, 1),
    cloud(52, 44, 40, 12, 7, 2),
    place(castle(), 'translate(306 62) scale(0.44)'),
    place(
      jack({
        mood: 'happy',
        tilt: -8,
        arms: [
          [[-16, -84, 8], [-28, -100, 7.5], [-34, -116, 7]],
          [[16, -84, 8], [30, -92, 7.5], [40, -108, 7]],
        ],
        legs: [
          { pts: [[-8, -47, 10], [-16, -30, 9.5], [-18, -10, 9]], dir: -1 },
          { pts: [[8, -47, 10], [16, -30, 9.5], [14, -10, 9]], dir: 1 },
        ],
      }),
      'translate(200 256) scale(0.95) rotate(4)',
    ),
  ],
});
