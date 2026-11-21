import { parseTransform, tufts } from '../lib.mjs';
import { HENNY_HEAD, acorn, bonk, compose, foxEyes, ground, henny, oak, place } from './characters.mjs';

// Henny Penny, 4: at the dark door of Foxy Loxy's den, under an old oak, another acorn falls, bonk,
// on Henny Penny's head. She looks up and sees the oak tree: so that is what fell on her! Two sly
// eyes peep out of the den. The characters are drawn in characters.mjs.

const f = (n) => Math.round(n * 10) / 10;
const G = 264;
const H = `translate(146 ${G}) rotate(-16) scale(1.5)`;
const m = parseTransform(H);
const top = [m[0] * HENNY_HEAD[0] + m[2] * HENNY_HEAD[1] + m[4], m[1] * HENNY_HEAD[0] + m[3] * HENNY_HEAD[1] + m[5]];

export default compose({
  title: 'Another acorn falls at the fox’s den',
  seed: 53,
  parts: [
    ground(G),
    place(oak({ den: true }), `translate(262 ${G})`),
    place(foxEyes(), `translate(263 ${G - 24}) scale(-1.7 1.7)`),
    { fine: [tufts([[30, G], [210, G - 1], [372, G - 1]], 9, 7)] },
    place(henny({ mood: 'surprised', look: [0.3, -1] }), H),
    place(acorn(), `translate(${f(top[0] - 4)} ${f(top[1] - 20)}) rotate(20) scale(2.3)`),
    bonk(top[0] - 4, top[1] - 18, 26, [-215, -95]),
  ],
});
