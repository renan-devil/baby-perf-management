import { PAL } from '../lib.mjs';
import { HENNY_HEAD, acorn, bonk, compose, ground, henny, oak, place } from './characters.mjs';

// Henny Penny, 1 (cover): Henny Penny is pecking for corn under the old oak when an acorn falls,
// bonk, right on her head. The characters are drawn in characters.mjs.

const f = (n) => Math.round(n * 10) / 10;
const HX = 236;
const HS = 1.65;
const H = `translate(${HX} 262) scale(${HS})`;
const top = [HX + HENNY_HEAD[0] * HS, 262 + HENNY_HEAD[1] * HS];

// a few grains of corn scattered at her feet
const corn = [[300, 266], [314, 270], [326, 265], [338, 271], [286, 272], [350, 267]];
const cornD = corn.map(([x, y]) => `M${x - 2.5} ${y}C${x - 2.5} ${y - 3} ${x + 2.5} ${y - 3} ${x + 2.5} ${y}C${x + 2.5} ${y + 3} ${x - 2.5} ${y + 3} ${x - 2.5} ${y}Z`).join('');

// the acorn's fall from the branch, in little dashes
const fall = `M${f(top[0] - 30)} 70q8 8 10 16M${f(top[0] - 18)} 92q3 4 4 8`;

export default compose({
  title: 'Henny Penny under the oak tree',
  seed: 41,
  parts: [
    ground(262),
    place(oak(), 'translate(138 262)'),
    place(henny({ mood: 'surprised', look: [0.2, -0.9] }), H),
    { washes: [{ c: PAL.ochre, o: 0.9, d: cornD }], fine: [cornD] },
    place(acorn(), `translate(${f(top[0] - 2)} ${f(top[1] - 22)}) rotate(-24) scale(2.3)`),
    bonk(top[0] - 2, top[1] - 20, 26),
    { fine: [fall] },
  ],
});
