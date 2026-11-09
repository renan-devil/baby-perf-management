import { PAL, hatch, tufts } from '../lib.mjs';
import { brick, compose, pig, pigHand, place, sticks, straw } from './characters.mjs';

// The Three Little Pigs, 1 (cover): the three little pigs stand side by side, ready to build. The
// first holds a bundle of straw, the second a bundle of sticks, the third holds up one red brick.
const S = 1.6;
const ground = 'M0 252C90 248 190 254 290 250C340 248 370 251 400 249';
const P = [
  { x: 88, scarf: PAL.green, arms: ['out', 'down'] },
  { x: 190, scarf: PAL.sky, arms: ['down', 'out'] },
  { x: 314, scarf: PAL.slate, arms: ['down', 'up'] },
];
const hand = (i, pose, side) => {
  const [hx, hy] = pigHand(pose, side);
  return [P[i].x + hx * S, 250 + hy * S];
};
const [sx, sy] = hand(0, 'out', -1);
const [kx, ky] = hand(1, 'out', 1);
const [bx, by] = hand(2, 'up', 1);

export default compose({
  title: 'The Three Little Pigs',
  seed: 41,
  washes: [{ c: PAL.green, o: 0.4, d: 'M0 248C90 244 190 250 290 246C340 244 370 247 400 245L400 292C300 296 100 294 0 292Z' }],
  lines: [ground],
  fine: [hatch(20, 270, 380, 272, 11, 8, 170, 4), tufts([[12, 251], [140, 251], [256, 251], [390, 249]], 9, 5)],
  parts: [
    ...P.map((p) => place(pig({ scarf: p.scarf, arms: p.arms }), `translate(${p.x} 250) scale(${S})`)),
    place(straw(), `translate(${sx + 1} ${sy + 6}) rotate(-12) scale(${S})`),
    place(sticks(), `translate(${kx + 3} ${ky + 6}) rotate(-6) scale(${S})`),
    place(brick(), `translate(${bx + 3} ${by - 16}) rotate(-6) scale(${S})`),
  ],
});
