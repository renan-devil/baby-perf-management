import { PAL, hatch, tufts } from '../lib.mjs';
import { at, bundle, compose, farmer, local, place, son, sonFrame } from './characters.mjs';

// The Bundle of Sticks, 1 (cover): the old farmer holds out the bundle of sticks tied with red string,
// and his three sons pull at it in a line, the eldest gripping the bundle, the middle one holding on
// to the eldest and the youngest to the middle one. They strain and puff, but it will not break.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const S = 1.12;
const FARM = [76, 272];
const B = 'translate(178 170) rotate(-4) scale(1.05)';
const E = { x: 254, rot: 9 };
const M = { x: 314, rot: 11 };
const Y = { x: 364, rot: 13 };
const T = (p) => `translate(${p.x} 272) rotate(${p.rot}) scale(${S})`;
const L = (p, [x, y]) => local(x, y, p.x, 272, p.rot, S);

// where each one grips: the bundle's right end, then each brother's back
const eHands = [L(E, at(30, -3, B)), L(E, at(44, -1, B))];
const eBack = at(sonFrame('eldest').shoulders[1][0] - 2, sonFrame('eldest').hip - 4, T(E));
const mBack = at(sonFrame('middle').shoulders[1][0] - 2, sonFrame('middle').hip - 4, T(M));
const mHands = [L(M, [eBack[0] + 2, eBack[1] - 6]), L(M, [eBack[0] + 6, eBack[1] + 2])];
const yHands = [L(Y, [mBack[0] + 2, mBack[1] - 4]), L(Y, [mBack[0] + 6, mBack[1] + 3])];

// puffs of effort round the brothers' heads, and dust kicked up at their heels
const effort = (x, y) => `M${x - 20} ${y - 8}q-5 -4 -4 -10M${x + 20} ${y - 10}q5 -4 4 -10M${x + 22} ${y + 2}l7 -1`;
const sweat = (x, y) => `M${x} ${y}c-3 5 -3 8 0 9c3 -1 3 -4 0 -9Z`;
const heads = [
  at(...sonFrame('eldest').head, T(E)),
  at(...sonFrame('middle').head, T(M)),
  at(...sonFrame('youngest').head, T(Y)),
];
const drops = heads.map(([x, y]) => sweat(x - 18, y - 18)).join('');
const dust = 'M248 268c-6 -4 -12 -2 -14 2M308 268c-6 -4 -12 -2 -14 2M358 268c-6 -4 -12 -2 -14 2';

export default compose({
  title: 'The Bundle of Sticks',
  seed: 41,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 298C300 300 100 298 0 296Z' },
    { c: PAL.sky, o: 0.7, d: drops },
  ],
  lines: [ground],
  fine: [
    ...heads.map(([x, y]) => effort(x, y)),
    drops,
    dust,
    hatch(14, 284, 386, 286, 12, 7, 168, 4),
    tufts([[20, 270], [150, 272], [210, 271], [392, 269]], 9, 5),
  ],
  parts: [
    place(son('youngest', { mood: 'strain', hands: yHands, bends: [-4, 4], tilt: -6 }), T(Y)),
    place(son('middle', { mood: 'strain', hands: mHands, bends: [-5, 5], tilt: -6 }), T(M)),
    place(son('eldest', { mood: 'strain', hands: eHands, bends: [-6, 6], tilt: -6 }), T(E)),
    place(bundle(), B),
    place(farmer({ mood: 'happy', hands: [[-32, -70], local(...at(-38, 0, B), ...FARM, 0, S)], bends: [10, 6], tilt: 4 }), `translate(${FARM[0]} ${FARM[1]}) scale(${S})`),
  ],
});
