import { PAL, hatch, tufts } from '../lib.mjs';
import { GB_LEGS, compose, cow, gingerbread, horse, place } from './characters.mjs';

// The Gingerbread Man, 3: the spotted Cow and the big brown Horse gallop after him across the field
// (clomp, clomp! clippety-clop!), and the tiny Gingerbread Man runs on ahead, laughing.
const GY = 268;
const ground = `M0 ${GY}C90 ${GY - 4} 200 ${GY + 2} 300 ${GY - 2}C340 ${GY - 3} 370 ${GY - 1} 400 ${GY - 3}`;
// clods of earth kicked up by the hooves, and speed marks
const clods = 'M8 262c-3 -3 0 -7 4 -6c3 1 3 6 -1 6ZM18 248c-2 -2 0 -5 3 -4c2 1 2 4 -1 4ZM172 252c-3 -3 0 -7 4 -6c3 1 3 6 -1 6Z';
const speed = 'M344 214l-12 0M346 230l-14 1M342 246l-8 0';
// two soft clouds in the sky
const clouds =
  'M40 70C34 60 44 50 56 54C60 42 80 40 88 52C100 48 110 58 104 68C96 74 50 76 40 70ZM196 48C192 40 200 32 210 36C214 28 230 28 234 38C244 36 250 44 246 50C238 56 204 56 196 48Z';
const arms = [
  [[-20, -56], [-32, -62]],
  [[22, -46], [34, -40]],
];

export default compose({
  title: 'The Cow and the Horse',
  seed: 63,
  washes: [
    { c: PAL.green, o: 0.36, d: `M0 ${GY - 4}C90 ${GY - 8} 200 ${GY - 2} 300 ${GY - 6}C340 ${GY - 7} 370 ${GY - 5} 400 ${GY - 7}L400 300L0 300Z` },
    { c: PAL.terracotta, o: 0.6, d: clods },
    { c: PAL.sky, o: 0.45, d: clouds },
  ],
  lines: [ground],
  fine: [clods, speed, clouds, tufts([[30, GY - 1], [190, GY], [290, GY - 2], [384, GY - 3]], 10, 5), hatch(20, 286, 380, 288, 12, 7, 172, 3)],
  parts: [
    place(cow(), `translate(96 ${GY + 3}) scale(0.84)`),
    place(horse(), `translate(262 ${GY - 4}) scale(0.74)`),
    place(gingerbread({ arms, legs: GB_LEGS.run, mood: 'laugh' }), `translate(372 ${GY - 2}) rotate(8) scale(0.6)`),
  ],
});
