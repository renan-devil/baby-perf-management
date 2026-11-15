import { PAL, hatch, tufts } from '../lib.mjs';
import { at, axe, beanstalk, cloud, compose, cottage, giant, jack, place } from './characters.mjs';

// Jack and the Beanstalk, 10: Chop! Chop! CHOP! In the garden Jack swings the axe into the
// beanstalk, chips flying, and the stalk wobbles. Far above, the Giant gets such a fright that he
// scrambles back up into the clouds as fast as he can go.
const stalk = [
  [262, 312, 48],
  [272, 244, 44],
  [252, 174, 38],
  [270, 112, 32],
  [256, 62, 28],
  [262, 30, 26],
];
const J = 'translate(176 286) scale(1.22)';
const hands = [26, -70];
const [hx, hy] = at(...hands, J);
// chips of beanstalk flying out where the axe bites
const chips = 'M226 168l6 -3l2 4l-6 3ZM216 214l5 -4l3 3l-5 4ZM230 228l6 1l-1 5l-6 -1ZM212 180l5 2l-2 5l-5 -2Z';

export default compose({
  title: 'Chop!',
  seed: 307,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 270L0 270Z' },
    { c: PAL.green, o: 0.5, d: 'M0 270C120 264 280 266 400 270L400 300L0 300Z' },
  ],
  after: [{ c: PAL.green, o: 0.9, d: chips }],
  fine: [
    chips,
    'M238 172l-6 -8M244 214l-4 8M232 198l-12 0',
    // the stalk wobbles
    'M226 150l-10 -4M228 162l-12 0M298 128l10 -4M300 140l12 0M296 90l10 -2',
    tufts([[20, 286], [330, 284], [380, 290]], 9, 23),
    hatch(300, 294, 390, 294, 4, 7, 170, 7),
  ],
  parts: [
    place(cottage({ dark: false }), 'translate(58 272) scale(0.5)'),
    beanstalk(stalk, {
      open: true,
      leaves: [
        { at: [290, 268], a: -15, s: 1.1 },
        { at: [290, 196], a: -30, s: 0.9 },
        { at: [234, 122], a: 205, s: 0.8 },
      ],
      tendrils: [[284, 160, 20, 1]],
    }),
    cloud(270, 6, 150, 26, 12, 6),
    place(
      giant({
        mood: 'fright',
        tilt: 8,
        arms: [
          [[-48, -160, 22], [-56, -196, 20], [-58, -232, 19]],
          [[48, -160, 22], [62, -196, 20], [58, -228, 19]],
        ],
        legs: [
          [[-24, -70, 30], [-38, -42, 28], [-34, -14, 26]],
          [[24, -70, 30], [48, -54, 28], [70, -52, 26]],
        ],
      }),
      'translate(286 132) scale(0.36)',
    ),
    place(axe(), `translate(${hx} ${hy}) rotate(70) scale(-1 1)`),
    place(
      jack({
        mood: 'cross',
        tilt: 6,
        arms: [
          [[-16, -84, 8], [4, -76, 7.5], [hands[0] - 4, hands[1], 7]],
          [[16, -84, 8], [24, -78, 7.5], hands.concat(7)],
        ],
        legs: [
          { pts: [[-8, -47, 10], [-16, -28, 9.5], [-22, -8, 9]], dir: -1 },
          { pts: [[8, -47, 10], [16, -28, 9.5], [20, -8, 9]], dir: 1 },
        ],
      }),
      J,
    ),
  ],
});
