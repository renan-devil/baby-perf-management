import { PAL, hatch, tufts } from '../lib.mjs';
import { ball, compose, dot, frog, place, princess } from './characters.mjs';

// The Frog Prince, 9: the princess laughs and laughs as the frog balances her golden ball on the tip
// of his nose. They are becoming friends.
const ground = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const wobble = 'M246 116q-8 4 -10 12M296 116q8 4 10 12M240 98q-6 0 -10 4M302 98q6 0 10 4';
const haha = 'M184 92l8 -6M186 104l10 -2M182 80l4 -8';
const flowers = dot(30, 262, 4) + dot(206, 264, 4) + dot(376, 262, 4);
const stems = 'M30 266L30 272M206 268L206 274M376 266L376 272';
const CLAP = [
  [[-10, -91, 7], [-21, -80, 6], [-4, -84, 6]],
  [[10, -91, 7], [21, -80, 6], [4, -86, 6]],
];

export default compose({
  title: 'A ball on his nose',
  seed: 59,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 268C90 265 200 270 300 267C340 266 370 268 400 267L400 300L0 300Z' },
    { c: PAL.red, o: 0.8, d: flowers },
  ],
  lines: [ground],
  fine: [wobble, haha, flowers, stems, hatch(14, 284, 384, 286, 12, 7, 165, 4), tufts([[70, 272], [240, 273], [340, 271]], 9, 5)],
  parts: [
    place(princess({ mood: 'laugh', tilt: -8, arms: CLAP }), 'translate(118 278) scale(1.45)'),
    place(frog({ mood: 'happy', look: [0, -1.8] }), 'translate(272 264) scale(2.1)'),
    place(ball(12), 'translate(272 148)'),
  ],
});
