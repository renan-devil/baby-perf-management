import { PAL, hatch, parseTransform, rays } from '../lib.mjs';
import { SONS, compose, merge, place, son, sonPoint, spade } from './characters.mjs';

// The Farmer and His Sons, 2: the very next morning the three sons dig the whole field with their
// spades, dig, dig, dig, and the earth flies. The eldest flings a spadeful over his shoulder, the
// middle one pushes his spade deep into the ground, the youngest lifts a spadeful high.
const f = (n) => Math.round(n * 10) / 10;
const K = 1.05; // the sons' size in this picture

// the inverse of a placing transform, to find the body point that lands on a given picture point
function inverse(t) {
  const [a, b, c, d, e, g] = parseTransform(t);
  const det = a * d - b * c;
  return [d / det, -b / det, -c / det, a / det, (c * g - d * e) / det, (b * e - a * g) / det];
}
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

/**
 * A son at work: placed with t, bent by bend at the waist, his two hands on the spade's handle at
 * u1 and u2 from the tip of its blade (tip, angle: 0 = handle straight up, positive = leaning right).
 * elbow: how far each elbow bows out (+ to the left of the shoulder-to-hand line, - to the right).
 */
function digger(who, { t, bend, legs = 'wide', look = 1, mood = 'grin', tip, angle, len, u = [0.55, 0.85], elbow = [6, 6] }) {
  const r = (angle * Math.PI) / 180;
  const along = (k) => [tip[0] + Math.sin(r) * len * k, tip[1] - Math.cos(r) * len * k];
  const inv = inverse(`${t} rotate(${bend} 0 -62)`);
  const arms = [-13, 13].map((sx, i) => {
    const S = sonPoint(sx, -100, bend, t);
    const H = along(u[i]);
    const [dx, dy] = [H[0] - S[0], H[1] - S[1]];
    const l = Math.hypot(dx, dy);
    const E = [(S[0] + H[0]) / 2 - (dy / l) * elbow[i], (S[1] + H[1]) / 2 + (dx / l) * elbow[i]];
    return [S, E, H].map((p, j) => [...apply(inv, p).map(f), [8, 7.5, 7][j]]);
  });
  return merge(place(son(who, { arms, bend, legs, look, mood }), t), place(spade(len), `translate(${tip[0]} ${tip[1]}) rotate(${angle})`));
}

// The field: turned earth in long furrows (the lines behind the boys stop where they stand)
const ground = 'M8 200C30 198 50 197 64 197M130 196C150 195 168 195 182 195M262 194C276 194 286 194 292 193M350 192C366 192 380 193 394 194';
const furrows =
  'M14 232C30 230 48 229 62 228M132 226C146 225 160 225 176 224M352 222C366 221 380 221 392 220' +
  'M10 278C120 270 260 274 392 266M26 294C140 288 260 290 372 286';
const mound = 'M240 270C242 262 252 258 262 260C270 256 280 260 282 268C270 271 252 272 240 270Z';
const sun = 'M186 48a14 14 0 1 0 28 0a14 14 0 1 0 -28 0Z';

// Clods of earth flying up from the spades, with little motion strokes
const clod = (x, y, r) =>
  `M${f(x - r)} ${f(y)}C${f(x - r)} ${f(y - r * 0.9)} ${f(x + r * 0.2)} ${f(y - r * 1.1)} ${f(x + r * 0.8)} ${f(y - r * 0.6)}C${f(x + r * 1.2)} ${f(y - r * 0.1)} ${f(x + r * 0.7)} ${f(y + r)} ${f(x)} ${f(y + r * 0.9)}C${f(x - r * 0.6)} ${f(y + r * 0.8)} ${f(x - r)} ${f(y + r * 0.4)} ${f(x - r)} ${f(y)}Z`;
const CLODS = [
  [355, 158, 6], [24, 82, 6], [52, 64, 5], [14, 112, 4.5], [78, 56, 4], [40, 96, 3.5],
  [370, 128, 6], [348, 108, 5], [386, 98, 4.5], [362, 150, 3.5], [332, 92, 3.5],
  [252, 244, 4], [266, 232, 3.5], [278, 246, 3],
];
const clods = CLODS.map(([x, y, r]) => clod(x, y, r * 1.25)).join('');
const flyMarks = 'M34 104l-6 6M60 78l-4 7M86 66l-3 6M24 126l-5 4M352 122l5 6M380 112l3 6M338 106l3 5M258 236l3 -5M272 240l3 -4';

export default compose({
  title: 'Dig, dig, dig!',
  seed: 121,
  washes: [
    { c: PAL.ochre, o: 0.42, d: 'M8 198C100 194 260 190 394 192L396 294C300 300 120 300 6 294Z' },
    { c: PAL.terracotta, o: 0.3, d: 'M14 232C120 226 260 222 392 220L392 232C260 236 120 240 14 244ZM10 278C120 270 260 274 392 266L392 278C260 286 120 282 10 290Z' },
    { c: PAL.terracotta, o: 0.6, d: mound },
    { c: PAL.terracotta, o: 0.6, d: 'M196 278C202 270 216 270 224 278Z' },
    { c: PAL.ochre, o: 0.72, d: sun },
    { c: PAL.terracotta, o: 0.8, d: clods },
  ],
  lines: [ground],
  fine: [furrows, mound, sun, rays(200, 48, 20, 29, 9, 6), 'M196 278C202 270 216 270 224 278', clods, flyMarks, hatch(30, 280, 380, 274, 10, 6, 165, 8)],
  parts: [
    digger('eldest', {
      t: `translate(96 248) scale(${SONS.eldest.s * K})`,
      bend: -6,
      tip: [36, 96],
      angle: 140,
      len: 124,
      u: [0.62, 0.85],
      elbow: [-8, 4],
    }),
    digger('middle', {
      t: `translate(206 262) scale(${SONS.middle.s * K})`,
      bend: 10,
      tip: [210, 274],
      angle: 7,
      len: 102,
      u: [0.82, 0.62],
      elbow: [8, -8],
    }),
    digger('youngest', {
      t: `translate(318 252) scale(${SONS.youngest.s * K})`,
      bend: 12,
      tip: [366, 160],
      angle: -118,
      len: 92,
      u: [0.62, 0.9],
      elbow: [8, -6],
    }),
  ],
});
