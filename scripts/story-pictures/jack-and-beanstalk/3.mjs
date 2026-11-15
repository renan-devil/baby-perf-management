import { PAL, hatch, tufts } from '../lib.mjs';
import { bean, compose, cottage, merge, mother, place } from './characters.mjs';

// Jack and the Beanstalk, 3: "BEANS?" Jack's mother, very cross, leans in the cottage window and
// flings the five magic beans out into the garden: whizz!
const win = [-2, -84, 82, 62];
const H = 'translate(132 290) scale(1.5)';
const M = 'translate(190 320) scale(1.02)';
const hand = [50, -124];
// the beans fly off in an arc, each with a little whizz line behind it
const flying = [
  [292, 132, -14],
  [328, 116, -4],
  [362, 132, 16],
  [314, 164, 8],
  [352, 176, 30],
];

export default compose({
  title: 'Beans!',
  seed: 233,
  washes: [
    { c: PAL.sky, o: 0.28, d: 'M0 0L400 0L400 270L0 270Z' },
    { c: PAL.green, o: 0.5, d: 'M0 272C120 266 280 268 400 272L400 300L0 300Z' },
  ],
  fine: [
    tufts([[340, 284], [380, 280], [30, 290]], 9, 13),
    hatch(290, 292, 390, 292, 4, 7, 170, 6),

  ],
  parts: [
    place(cottage({ win, smoke: false }), H),
    place(
      mother({
        mood: 'cross',
        tilt: 8,
        upper: true,
        arms: [
          [[-17, -102, 8], [-32, -88, 7.5], [-20, -76, 7]],
          [[17, -102, 8], [34, -114, 7.5], hand.concat(7)],
        ],
      }),
      M,
    ),
    ...flying.map(([x, y, a], i) => place(merge(bean(i), { fine: ['M-9 -2L-18 -3M-9 2L-15 3'] }), `translate(${x} ${y}) rotate(${a}) scale(1.9)`)),
  ],
});
