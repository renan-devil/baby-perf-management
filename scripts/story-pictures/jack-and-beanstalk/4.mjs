import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { beanstalk, cloud, compose, cottage, dot, jack, place } from './characters.mjs';

// Jack and the Beanstalk, 4: next morning, Jack leans out of his window, eyes wide: in the garden
// stands an enormous beanstalk, as thick as a tree, with leaves as big as umbrellas, going up and
// up into the clouds. The sun is just rising.
const win = [-2, -84, 82, 62];
const stalk = [
  [306, 310, 54],
  [328, 244, 48],
  [300, 176, 42],
  [324, 116, 35],
  [306, 70, 29],
  [314, 50, 26],
];

export default compose({
  title: 'The beanstalk',
  seed: 241,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 272L0 272Z' },
    { c: PAL.ochre, o: 0.35, d: dot(56, 46, 40) },
    { c: PAL.ochre, o: 0.9, d: dot(56, 46, 17) },
    { c: PAL.green, o: 0.5, d: 'M0 272C120 266 280 268 400 272L400 300L0 300Z' },
  ],
  lines: [dot(56, 46, 17)],
  fine: [rays(56, 46, 24, 36, 10, 5), tufts([[24, 290], [250, 286], [380, 288]], 9, 17), hatch(230, 294, 390, 294, 5, 7, 170, 8)],
  parts: [
    place(cottage({ win, smoke: true }), 'translate(112 290) scale(1.4)'),
    beanstalk(stalk, {
      open: true,
      leaves: [
        { at: [290, 282], a: 190, s: 1.1 },
        { at: [348, 236], a: -15, s: 1.2 },
        { at: [286, 170], a: 228, s: 1 },
        { at: [342, 128], a: -25, s: 1.05 },
        { at: [296, 92], a: 210, s: 0.9 },
      ],
      tendrils: [
        [324, 206, 10, 1.3],
        [314, 150, -20, 1.1],
      ],
    }),
    cloud(326, 30, 92, 22, 10, 3),
    place(
      jack({
        mood: 'wow',
        tilt: 10,
        upper: true,
        arms: [
          [[-16, -84, 8], [-30, -94, 7.5], [-34, -110, 7]],
          [[16, -84, 8], [30, -94, 7.5], [36, -110, 7]],
        ],
      }),
      'translate(166 330) scale(1.18)',
    ),
  ],
});
