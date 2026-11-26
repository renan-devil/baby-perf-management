import { PAL, transformPath } from '../lib.mjs';
import { compose, dot, flyingGoose, place, tortoise, tortoiseCut } from './characters.mjs';

// The Talkative Tortoise, 5: SPLOOSH! She lands in the big blue lake and bobs up again among tiny
// silver fish, and the geese come gliding down beside her. She just smiles, mouth closed.
const T = 'translate(190 230) scale(1.25)';
const lake = 'M10 220C12 168 110 148 200 148C300 148 390 168 390 220C390 270 300 292 200 292C100 292 8 270 10 220Z';
const waves = 'M128 228c6 -3 12 3 18 0c6 -3 12 3 18 0M232 228c6 -3 12 3 18 0c6 -3 12 3 18 0M40 200c6 -3 12 3 18 0M330 196c6 -3 12 3 18 0M180 168c6 -3 12 3 18 0';
// the splash: rings on the water around her, and drops flying up
const rings =
  'M126 218C106 222 96 228 98 236C102 248 150 254 196 254C250 254 298 248 300 236C301 228 290 222 272 218' +
  'M58 244C60 258 120 270 196 270C270 270 330 262 340 248';
const drops =
  'M108 196C104 188 106 182 110 178C114 184 114 190 108 196Z' +
  'M136 176C133 170 135 164 138 162C141 166 141 172 136 176Z' +
  'M286 190C290 182 288 176 284 172C280 178 280 184 286 190Z' +
  'M258 170C261 164 259 158 256 156C253 160 253 166 258 170Z' +
  'M90 216C84 212 82 206 84 202C88 206 90 210 90 216Z' +
  'M304 212C310 208 312 202 310 198C306 202 304 206 304 212Z';
const bubbles = dot(290, 206, 3.5) + dot(298, 194, 2.5) + dot(294, 184, 1.8);
// tiny silver fish, nose to the right (origin at the nose)
const fish = 'M0 0C-5 -5 -13 -5 -18 0C-13 5 -5 5 0 0ZM-18 0L-24 -4L-24 4Z';
const fishAt = ['translate(110 270)', 'translate(300 262) scale(-1 1)', 'translate(270 282) scale(0.8)', 'translate(68 254) scale(-0.8 0.8)'];
const fishes = fishAt.map((t) => transformPath(fish, t)).join('');

export default compose({
  title: 'Sploosh!',
  seed: 49,
  washes: [
    { c: PAL.sky, o: 0.75, rule: 'evenodd', d: lake + transformPath(tortoiseCut(), T) },
    { c: PAL.grey, o: 0.6, d: fishes },
    { c: PAL.sky, o: 0.6, d: drops },
  ],
  lines: [lake, rings],
  fine: [drops, bubbles, fishes, waves],
  parts: [
    place(tortoise({ mouth: 'smile', legs: 'none' }), T),
    place(flyingGoose({ wings: 'glide' }), 'translate(84 86) rotate(24) scale(0.8)'),
    place(flyingGoose({ wings: 'glide' }), 'translate(322 70) rotate(-24) scale(-0.8 0.8)'),
  ],
});
