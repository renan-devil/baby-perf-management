import { PAL, hatch, paths, rng, transformPath, tufts } from '../lib.mjs';

// The Oak and the Reed: a big proud oak stands beside a thin little reed at the edge of a calm pond.
// The oak and the reed are drawn around their own base point (0,0) and reused in picture 2.
const f = (n) => Math.round(n * 10) / 10;
const pt = (p) => `${f(p[0])} ${f(p[1])}`;

/** A smooth band (stem, blade) along a centreline of [x, y, width] points; rounded at the tip, and at the root too if asked. */
export function band(pts, roundRoot = false) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  const curve = (P) =>
    P.slice(1)
      .map((p2, j) => {
        const p0 = P[Math.max(0, j - 1)];
        const p1 = P[j];
        const p3 = P[Math.min(P.length - 1, j + 2)];
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${pt(p2)}`;
      })
      .join('');
  const cap = (A, B, [ex, ey, ew], [px, py]) => {
    const k = (ew * 0.66) / Math.hypot(ex - px, ey - py);
    return `C${f(A[0] + (ex - px) * k)} ${f(A[1] + (ey - py) * k)} ${f(B[0] + (ex - px) * k)} ${f(B[1] + (ey - py) * k)} ${pt(B)}`;
  };
  const L = side(1);
  const R = side(-1).reverse();
  const tip = cap(L[n - 1], R[0], pts[n - 1], pts[n - 2]);
  const root = roundRoot ? cap(R[n - 1], L[0], pts[0], pts[1]) : 'Z';
  return `M${pt(L[0])}${curve(L)}${tip}${curve(R)}${root}`;
}

/** Centreline points from (x0,y0): starts at angle a0 (degrees from straight up, + leans right) and curls by `bend` degrees. */
export function sweep(x0, y0, a0, len, bend, widths, power = 1.4) {
  const n = widths.length;
  const steps = 60;
  const out = [];
  let [x, y] = [x0, y0];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const k = Math.round(t * (n - 1) * 1000) / 1000;
    if (Number.isInteger(k)) out.push([x, y, widths[k]]);
    const a = ((a0 + bend * t ** power) * Math.PI) / 180;
    x += (Math.sin(a) * len) / steps;
    y -= (Math.cos(a) * len) / steps;
  }
  return out;
}

/** The Reed (base at 0,0): a slender stem with a brown cattail head and two long blades. bend curls her over. */
export function reed(bend = 6, bladeBend = 0) {
  const stemPts = sweep(0, 0, 2, 158, bend, [5, 4.6, 4.2, 4, 3.8, 3.6, 3.4, 3.2, 3, 2.6, 2]);
  // the head sits on the stem from point 6 to point 9; the stem runs on above it as a little spike
  const head = band(stemPts.slice(6, 10).map(([x, y], i) => [x, y, [9, 13, 13, 9][i]]), true);
  const stem = band(stemPts.slice(0, 7));
  const spike = `M${pt(stemPts[9])}L${pt(stemPts[10])}`;
  const blades =
    band(sweep(-2, 0, -14, 92, 26 + bladeBend * 0.7, [6, 6, 5, 4, 3, 1.6]), false) +
    band(sweep(2, 0, 16, 74, 30 + bladeBend * 0.5, [5, 5, 4, 3, 1.4]), false);
  const headMarks = stemPts
    .slice(6, 9)
    .map(([x, y], i) => {
      const [nx, ny] = stemPts[7 + i];
      const a = Math.atan2(ny - y, nx - x) + Math.PI / 2;
      return `M${pt([x + Math.cos(a) * 3, y + Math.sin(a) * 3])}l${f((nx - x) * 0.4)} ${f((ny - y) * 0.4)}`;
    })
    .join('');
  return { stem, head, spike, blades, headMarks, top: stemPts[10] };
}

/** A scalloped leafy crown. */
export function scallop(cx, cy, rx, ry, n, depth, seed) {
  const r = rng(seed);
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = ((i + (r() - 0.5) * 0.3) / n) * 2 * Math.PI;
    const k = 1 + (r() - 0.5) * 0.12;
    p.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  let d = `M${pt(p[0])}`;
  for (let i = 0; i < n; i++) {
    const a = p[i];
    const b = p[(i + 1) % n];
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = (b[1] - a[1]) / len;
    let ny = -(b[0] - a[0]) / len;
    if (nx * (m[0] - cx) + ny * (m[1] - cy) < 0) [nx, ny] = [-nx, -ny];
    d += `Q${pt([m[0] + nx * len * depth, m[1] + ny * len * depth])} ${pt(b)}`;
  }
  return d + 'Z';
}

// ---- The Oak (base of the trunk at 0,0)
export const oakCrown = scallop(0, -138, 98, 60, 11, 0.38, 7);
export const oakCrownWash = scallop(0, -138, 94, 56, 11, 0.32, 7);
export const oakCrownShade = 'M-70 -118C-50 -100 -10 -94 30 -98C60 -102 80 -112 86 -124C80 -96 50 -84 10 -84C-30 -84 -60 -96 -70 -118Z';
export const oakTrunk = 'M-20 0C-12 -26 -15 -62 -12 -100M20 0C13 -26 16 -62 12 -100';
export const oakRootFlares = 'M-20 0C-26 3 -34 5 -42 6M20 0C26 3 34 5 42 6';
export const oakTrunkWash = 'M-20 2C-12 -26 -15 -62 -13 -86L13 -86C16 -62 13 -26 20 2C28 5 36 6 42 7L-42 7C-34 6 -26 5 -20 2Z';
export const oakBranches = 'M-12 -92C-28 -104 -46 -112 -62 -116M12 -94C28 -106 46 -114 62 -118M0 -100L0 -126M-30 -106L-34 -126M34 -110L40 -128';
export const oakBark = 'M-9 -20c3 6 3 12 0 18M7 -82c-3 6-3 12 0 16M8 -18c-2 4-2 8 0 12';
export const oakLeafMarks = 'M-70 -150q3 4 6 0q3 4 6 0M-30 -176q3 4 6 0q3 4 6 0M20 -164q3 4 6 0q3 4 6 0M56 -140q3 4 6 0q3 4 6 0M-48 -126q3 4 6 0q3 4 6 0M24 -124q3 4 6 0q3 4 6 0';
export const oakAcorns = 'M-56 -100c0-4 6-4 6 0c0 4-6 4-6 0zM44 -96c0-4 6-4 6 0c0 4-6 4-6 0zM-8 -90c0-4 6-4 6 0c0 4-6 4-6 0z';
// his proud face in the bark: eyes shut, nose in the air, a pleased little smile
export const oakProudFace = 'M-11 -58q4 -4 8 0M3 -58q4 -4 8 0M-6 -45q6 4 12 0';
export const oakShadeHatch = hatch(-60, -110, 60, -100, 9, 9, 125, 11);

// ---- The scene
const OT = 'translate(126 252) scale(1.15)';
const RT = 'translate(268 254)';
const R = reed(6, 0);
const ground = 'M0 252C60 250 110 254 170 252C200 251 222 252 240 254';
const pond = 'M240 254C252 248 280 248 310 249C344 250 376 252 394 258C392 266 372 272 340 274C300 276 262 274 244 268C234 264 232 258 240 254Z';
const ripples = 'M296 262q10 -3 20 0M330 266q8 -2 16 0M356 258q6 -2 12 0M276 268q6 -2 12 0';
const lilyPad = 'M342 258C342 253 356 252 360 256L352 258L360 260C356 264 342 263 342 258Z';
const birds = 'M318 70q5 -6 10 0q5 -6 10 0M350 92q4 -5 8 0q4 -5 8 0';

const tp = (d, t) => transformPath(d, t);

export default {
  title: 'The Oak and the Reed',
  seed: 41,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 250C60 248 110 252 170 250C200 249 222 250 240 252C232 258 236 266 246 270C210 276 120 278 0 274Z' },
    { c: PAL.sky, o: 0.6, d: 'M242 254C254 249 280 249 310 250C344 251 374 253 392 258C390 265 370 271 340 273C300 275 264 273 246 267C236 263 235 258 242 254Z' },
    { c: PAL.green, o: 0.68, d: tp(oakCrownWash, OT) },
    { c: PAL.green, o: 0.35, d: tp(oakCrownShade, OT) },
    { c: PAL.ochre, o: 0.55, d: tp(oakTrunkWash, OT) },
    { c: PAL.terracotta, o: 0.55, d: tp(oakAcorns, OT) },
    { c: PAL.green, o: 0.75, d: tp(R.stem + R.blades, RT) + lilyPad },
    { c: PAL.terracotta, o: 0.85, d: tp(R.head, RT) },
    { c: PAL.slate, o: 0.35, d: tp(R.head, RT) },
  ],
  lines: paths([oakCrown, oakTrunk, oakRootFlares, oakBranches], OT) + paths([R.stem, R.head, R.blades], RT) + paths([ground, pond]),
  fine:
    paths([oakBark, oakLeafMarks, oakAcorns, oakProudFace, oakShadeHatch], OT) +
    paths([R.spike, R.headMarks], RT) +
    paths([
      ripples,
      lilyPad,
      birds,
      hatch(20, 264, 220, 266, 12, 6, 160, 3),
      tufts([[18, 252], [214, 252], [236, 254], [384, 258]], 9, 5),
    ]),
};
