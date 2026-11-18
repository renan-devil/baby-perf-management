import { PAL, paths, transformPath } from '../lib.mjs';
import { camel, sand } from './1.mjs';

// How the Camel Got His Hump, 5: Pouf! The Camel's back has puffed up into a great big humph. He looks
// round over his shoulder at it, eyes wide open in surprise, the twig fallen out of his mouth.

const CT = 'translate(196 262) scale(1.08)';
// head up above his chest, turned back (mirrored) and tipped down to look at the hump
const CHT = 'translate(64 -176) scale(-1.25 1.25) rotate(8)';
const cm = camel(CT, { headT: CHT, hump: true, eye: 'open', look: [-1, 1.5], twig: false, neckTop: [24, -16], neckFront: [30, -6], neckInto: [1.1, 0.8], swapNeck: true });
const ground = sand(262, 9);

// puff marks round the hump (camel coordinates): arcs following its curve, little dashes flying
// off it, and two small clouds of "pouf"
const puffArcs =
  'M-66 -110C-70 -128 -62 -148 -46 -160M-36 -166C-24 -171 -12 -171 0 -167' +
  'M-78 -118C-80 -134 -74 -150 -62 -160M-50 -176C-40 -180 -28 -181 -18 -179';
const dashes = 'M-86 -100l-10 2M-90 -140l-10 -4M-70 -176l-7 -8M-34 -190l-2 -10M-2 -186l4 -9';
const cloud = 'M0 0C-4 -6 2 -12 8 -9C10 -15 20 -14 20 -7C26 -7 27 1 21 3C20 8 11 9 9 5C4 8 -2 4 0 0Z';
const clouds = [
  [-120, -150, 1],
  [-96, -196, 0.85],
]
  .map(([x, y, k]) => transformPath(cloud, `${CT} translate(${x} ${y}) scale(${k})`))
  .join('');
// the prickly twig, dropped on the sand
const twig = 'M272 262L310 256M282 260l-1 -5M292 259l2 -5M302 257l-1 5';
const leaf = 'M296 258C298 252 304 250 306 251C304 256 300 258 296 258Z';

export default {
  title: 'The Camel’s hump',
  seed: 75,
  washes: [{ c: PAL.ochre, o: 0.32, d: ground.wash }, ...cm.washes, { c: PAL.grey, o: 0.3, d: clouds }, { c: PAL.green, o: 0.8, d: leaf }],
  whites: cm.whites,
  lines: cm.lines + paths([ground.line, twig]),
  fine: cm.fine + paths([puffArcs, dashes], CT) + paths([ground.ripples, clouds, leaf]),
  fills: cm.fills,
  glints: cm.glints,
};
