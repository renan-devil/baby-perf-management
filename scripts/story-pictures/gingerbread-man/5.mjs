import { PAL, hatch, tufts } from '../lib.mjs';
import { GB_LEGS, at, compose, gingerbread, place, swimmingFox } from './characters.mjs';

// The Gingerbread Man, 5: "No, thank you, Mr Fox!" From the Fox's nose he leaps — hop! — right over
// the water onto the far bank, and the Fox's jaws go snap! on nothing at all.
const WY = 212; // the water's surface
const FOX = `translate(150 ${WY}) scale(1.5)`;
const TILT = -32;
const [nx, ny] = at(36, -2, `${FOX} translate(2 -26) rotate(${TILT})`);
// the far bank, a grassy shore on the right
const bank = 'M286 300C292 262 300 222 326 210C350 202 380 204 400 202';
const bankWash = 'M286 300C292 262 300 222 326 210C350 202 380 204 400 202L400 300Z';
const water = `M0 ${WY - 2}C80 ${WY - 6} 200 ${WY + 2} 300 ${WY - 2}L300 300L0 300Z`;
// ripples round the swimming Fox
const ripples = `M40 ${WY + 6}q10 -5 20 0M210 ${WY + 8}q12 -5 24 0t24 0M20 ${WY + 34}q10 -5 20 0t20 0M110 ${WY + 46}q12 -5 24 0M200 ${WY + 30}q10 -5 20 0M230 ${WY + 64}q10 -5 20 0`;
// snap! little marks bursting round the Fox's shut jaws
const snap = [
  [-12, -16, -20, -26],
  [2, -18, 4, -31],
  [14, -12, 24, -20],
  [18, 0, 31, 0],
].map(([a, b, c, d]) => `M${nx + a} ${ny + b}L${nx + c} ${ny + d}`).join('');
// his leap: a dotted arc from the Fox's nose to the bank
const arc = `M${nx + 6} ${ny - 34}C${nx + 40} ${ny - 100} 260 50 304 100`;
const GB = 'translate(334 188) rotate(14) scale(1)';
const arms = [
  [[-22, -58], [-30, -70]],
  [[22, -58], [32, -66]],
];

export default compose({
  title: 'Snap!',
  seed: 65,
  washes: [
    { c: PAL.sky, o: 0.6, d: water },
    { c: PAL.green, o: 0.55, d: bankWash },
    { c: PAL.ochre, o: 0.25, d: bankWash },
  ],
  lines: [bank, `M0 ${WY - 2}C12 ${WY - 3} 24 ${WY - 3} 34 ${WY - 3}M190 ${WY - 3}C220 ${WY} 250 ${WY} 290 ${WY - 2}`],
  fine: [ripples, snap, tufts([[318, 214], [350, 206], [392, 204]], 10, 4), hatch(316, 250, 390, 236, 6, 7, 150, 3)],
  once: `<path d="${arc}" stroke-dasharray="1 7"/>`,
  parts: [place(swimmingFox({ mood: 'snap', tilt: TILT }), FOX), place(gingerbread({ arms, legs: GB_LEGS.run, mood: 'cheeky' }), GB)],
});
