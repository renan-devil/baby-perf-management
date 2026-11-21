// Pick cherries: pairs of red cherries hang from a leafy branch above a little wicker basket heaped with cherries.
import { PAL, hatch, paths, rng, transformPath, tufts } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;

/** A smooth closed curve through the points (Catmull-Rom turned into cubic Béziers). */
function loop(pts) {
  const n = pts.length;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return `${d}Z`;
}

/** A cherry of radius r: a round fruit with a little dip at the top where its stem goes in. */
function cherry(cx, cy, r, seed) {
  const R = rng(seed);
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i / 12) * 2 * Math.PI;
    const k = r * (i === 0 ? 0.8 : 1 + (R() - 0.5) * 0.08);
    pts.push([cx + Math.cos(a) * k * 1.04, cy + Math.sin(a) * k]);
  }
  return loop(pts);
}

/** A pointed cherry leaf from its base (x, y), turned by angle (degrees), len long. */
function leaf(x, y, angle, len, w) {
  const a = (angle * Math.PI) / 180;
  const [ux, uy, nx, ny] = [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a)];
  const p = (t, s) => [x + ux * len * t + nx * w * s, y + uy * len * t + ny * w * s];
  const outline = loop([p(0, 0), p(0.25, 0.8), p(0.6, 0.95), p(1, 0), p(0.6, -0.95), p(0.25, -0.8)]);
  let veins = `M${f(x)} ${f(y)}L${f(p(0.95, 0)[0])} ${f(p(0.95, 0)[1])}`;
  for (const t of [0.3, 0.5, 0.7]) {
    for (const s of [1, -1]) {
      const [a0, a1] = [p(t, 0), p(t + 0.14, 0.62 * s)];
      veins += `M${f(a0[0])} ${f(a0[1])}L${f(a1[0])} ${f(a1[1])}`;
    }
  }
  return { outline, veins };
}

// --- The branch across the top, with its leaves. ---
const branch = 'M0 34C60 30 124 42 190 40C252 38 304 28 352 16C358 16 360 22 354 25C306 40 254 52 190 54C124 56 60 46 0 50';
const branchWash = `${branch}Z`;
const twigs = 'M120 44C128 30 136 22 146 16M246 44C256 52 262 60 266 70M300 34C304 22 312 14 322 10';
const bark = 'M40 40c6 1 12 1 18 0M150 46c6 1 10 1 16 0M220 46c6-1 10-1 16-3';
const leaves = [
  leaf(46, 48, 128, 62, 17),
  leaf(146, 16, -22, 54, 15),
  leaf(116, 46, 70, 50, 14),
  leaf(266, 70, 62, 52, 14),
  leaf(322, 10, -8, 54, 14),
  leaf(352, 22, 40, 50, 14),
  leaf(214, 50, 108, 46, 13),
];

// --- Pairs of cherries hanging on their stems from a node on the branch. ---
const pairs = [
  { node: [92, 46], a: [-16, 70], b: [10, 78] },
  { node: [176, 50], a: [-12, 56], b: [14, 62] },
  { node: [262, 44], a: [-18, 70], b: [8, 64] },
  { node: [334, 26], a: [-10, 64], b: [16, 72] },
];
const R = 11.5;
const hanging = pairs.flatMap(({ node: [x, y], a, b }) => [
  { x: x + a[0], y: y + a[1] + R, stem: `M${x} ${y}C${x - 2} ${y + 20} ${x + a[0] * 0.8} ${y + a[1] * 0.6} ${x + a[0]} ${y + a[1] + 1}` },
  { x: x + b[0], y: y + b[1] + R, stem: `M${x} ${y}C${x + 2} ${y + 22} ${x + b[0] * 0.9} ${y + b[1] * 0.6} ${x + b[0]} ${y + b[1] + 1}` },
]);

// The branch, its leaves and the hanging cherries are drawn above, then lowered a little.
const BR = 'translate(0 14)';
const br = (d) => transformPath(d, BR);

// --- The wicker basket on its patch of grass, heaped with cherries. ---
const basket = 'M136 220C138 260 156 284 205 284C254 284 272 260 274 220Z';
const rim = 'M132 216C170 210 240 210 278 216L278 226C240 220 170 220 132 226Z';
const ears = 'M133 217C118 212 116 232 133 226M277 217C292 212 294 232 277 226';
const weave =
  'M139 238C170 244 240 244 271 238M144 254C174 260 236 260 266 254M154 270C178 275 232 275 256 270' +
  'M152 226L160 280M170 228L174 283M188 228L190 284M206 228L206 284M224 228L222 284M242 228L238 283M260 226L252 280';
const heap = [
  [150, 209], [172, 206], [196, 204], [220, 205], [244, 206], [264, 210],
  [162, 192], [186, 188], [210, 187], [234, 190], [254, 195],
  [198, 172], [222, 175],
].map(([x, y], i) => ({ x, y, r: 10.5, d: cherry(x, y, 10.5, 70 + i) }));
const heapStems = 'M198 162C200 154 204 150 210 148M222 165C220 157 224 152 230 150';
// Two cherries dropped on the grass beside the basket.
const dropped = [cherry(312, 276, 10, 91), cherry(330, 280, 10, 92)];
const droppedStem = 'M312 266C314 256 318 250 324 248C326 254 328 262 330 270';

const hangingD = hanging.map((c, i) => cherry(c.x, c.y, R, 10 + i)).join('');
const heapD = heap.map((c) => c.d).join('') + dropped.join('');

export default {
  title: 'Pick cherries',
  seed: 109,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M70 280C110 268 300 266 360 278C376 286 340 296 260 296C170 298 80 296 70 280Z' },
    { c: PAL.terracotta, o: 0.55, d: br(branchWash) },
    {
      c: PAL.ink,
      o: 0.15,
      d: br('M0 44C60 40 124 50 190 48C254 46 306 34 354 22C358 22 360 22 354 25C306 40 254 52 190 54C124 56 60 46 0 50Z'),
    },
    { c: PAL.green, o: 0.68, d: br(leaves.map((l) => l.outline).join('')) },
    { c: PAL.ochre, o: 0.6, d: basket + rim },
    { c: PAL.terracotta, o: 0.28, d: basket },
    { c: PAL.red, o: 0.85, d: br(hangingD) + heapD },
    { c: PAL.ink, o: 0.18, d: heap.slice(0, 6).map((c) => c.d).join('') },
  ],
  lines: paths([branch, hangingD], BR) + paths([basket, rim, ears]),
  fine:
    paths([twigs, bark, ...leaves.map((l) => l.veins), ...leaves.map((l) => l.outline), ...hanging.map((c) => c.stem)], BR) +
    paths([
      weave,
      ...heap.map((c) => c.d),
      heapStems,
      ...dropped,
      droppedStem,
      tufts([[92, 282], [128, 278], [290, 280], [356, 282]], 9, 3),
      hatch(100, 290, 340, 291, 7, 6, 165, 9),
    ]),
  glints: [...hanging.map((c) => [c.x - 4, c.y + 14 - 3, 2.6]), ...heap.map((c) => [c.x - 3.5, c.y - 3, 2]), [308, 273, 2], [326, 277, 2]]
    .map(([x, y, r]) => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${r}" ry="${f(r * 0.7)}" transform="rotate(-35 ${f(x)} ${f(y)})"/>`)
    .join(''),
};
