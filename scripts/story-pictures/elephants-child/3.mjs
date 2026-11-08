import { PAL, hatch, paths, transformPath, tufts } from '../lib.mjs';
import { elephant, f, limb } from './1.mjs';

// The Elephant's Child, 3: on the bank of the great grey-green, greasy Limpopo River, the
// Bi-Coloured-Python-Rock-Snake lies curled round and round on a rock and talks to the little elephant.
// The python is drawn here once, and picture 4 imports its head and its striped-body helper.

/** Catmull-Rom points between centreline points [x, y, w], k per segment. */
function densify(pts, k) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push(
        [0, 1, 2].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)),
      );
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/**
 * A two-coloured snake body along a centreline of [x, y, width] points: its outline (open at the far
 * end, where the head goes, unless open is false), its wash, the bands for the second colour and the ink lines between bands.
 */
export function snakeBody(pts, { k = 5, every = 3, open = true } = {}) {
  const P = densify(pts, k);
  const n = P.length;
  const sideAt = (i, s) => {
    const a = P[Math.max(0, i - 1)];
    const b = P[Math.min(n - 1, i + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [x, y, w] = P[i];
    return [f(x - (s * (b[1] - a[1]) * w) / 2 / l), f(y + (s * (b[0] - a[0]) * w) / 2 / l)];
  };
  let bands = '';
  let rings = '';
  for (let i = every; i + every < n - 2; i += every * 2) {
    const j = i + every;
    const q = [sideAt(i, 1), sideAt(j, 1), sideAt(j, -1), sideAt(i, -1)];
    bands += `M${q[0].join(' ')}L${q[1].join(' ')}L${q[2].join(' ')}L${q[3].join(' ')}Z`;
    rings += `M${sideAt(i, 1).join(' ')}L${sideAt(i, -1).join(' ')}M${sideAt(j, 1).join(' ')}L${sideAt(j, -1).join(' ')}`;
  }
  const outline = limb(P.filter((_, i) => i % 2 === 0 || i === n - 1), open);
  return { outline, wash: limb(P.filter((_, i) => i % 2 === 0 || i === n - 1)), bands, rings };
}

// ---- The python's head: facing left, the neck comes in at (0, 0) ----
export const PY = {
  head: 'M6 -9C-2 -15 -18 -15 -28 -9C-35 -5 -35 4 -28 7C-18 11 -2 10 6 7',
  smile: 'M-31 2Q-22 6 -12 3',
  nostril: 'M-29 -5l2 1',
  eye: 'M-17 -9C-17 -14 -9 -14 -9 -9C-9 -5 -17 -5 -17 -9Z',
  tongue: 'M-32 2L-42 3M-42 3l-5 -3M-42 3l-5 3',
  pupil: [-12.5, -9, 1.9],
};
PY.wash = PY.head + 'Z';

// ---- The python curled round and round on its rock (rock top centre at 0, 0) ----
const coils = [
  [60, 12, 2], [54, 2, 8], [42, -6, 14], [18, -10, 17], [-12, -10, 18], [-36, -9, 18], [-50, -14, 18], [-50, -26, 17],
  [-36, -30, 17], [-8, -29, 17], [20, -29, 16], [36, -32, 16], [40, -42, 16], [28, -48, 15], [4, -48, 15],
  [-12, -52, 14], [-20, -64, 13], [-18, -80, 12], [-8, -92, 12],
];
const RT = 'translate(292 204) scale(1.3)';
const body = snakeBody(coils);
// the head sits on top of the neck, looking down at the little elephant
const HT = `${RT} translate(-6 -92) rotate(-12) scale(1.15)`;

const rock = 'M218 262C210 238 222 210 248 202C276 194 320 194 344 204C366 214 374 240 366 262';
const rockLines = 'M240 222C236 232 236 244 240 254M352 222C356 232 356 244 352 254M300 238q10 -4 18 2';

// the little elephant on the bank, looking up at the python
const ET = 'translate(96 262) scale(1.12)';
const el = elephant(ET, { look: [1.2, -1.4] });

// the bank, and the greasy river round the foot of the rock
const bank = 'M10 262C70 258 150 264 204 260C210 268 206 282 200 296';
const waterEdge = 'M204 262L216 262M368 258C378 256 386 257 392 256';
const ripples = 'M226 276q10 -4 20 0M290 282q10 -4 20 0M350 274q8 -3 16 0M250 292q8 -3 16 0M374 288q8 -3 14 0';

const pt = (x, y, t) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);
const [hx, hy] = pt(PY.pupil[0], PY.pupil[1], HT);
const hs = 1.3 * 1.15;

export default {
  title: 'The Python on his rock',
  seed: 63,
  washes: [
    { c: PAL.sky, o: 0.5, d: 'M204 258C260 254 330 258 394 254L394 298L198 298C206 284 208 270 204 258Z' },
    { c: PAL.green, o: 0.4, d: 'M8 258C70 254 150 260 204 256C208 266 206 278 202 286C150 288 70 282 8 284Z' },
    { c: PAL.grey, o: 0.55, d: rock + 'Z' },
    { c: PAL.slate, o: 0.28, d: 'M218 262C210 238 222 210 248 202C240 220 238 244 246 262Z' },
    ...el.washes,
    { c: PAL.green, o: 0.72, t: RT, d: body.wash },
    { c: PAL.green, o: 0.72, t: HT, d: PY.wash },
    { c: PAL.ochre, o: 0.85, t: RT, d: body.bands },
    { c: PAL.red, o: 0.7, t: HT, d: 'M-32 1L-42 2L-47 0L-43 3L-47 6L-42 4L-32 3Z' },
  ],
  whites: el.whites + transformPath(PY.eye, HT),
  lines: el.lines + paths([rock, bank, waterEdge]) + paths([body.outline], RT) + paths([PY.head], HT),
  fine:
    el.fine +
    paths([body.rings], RT) +
    paths([PY.smile, PY.nostril, PY.eye, PY.tongue], HT) +
    paths([rockLines, ripples, tufts([[24, 262], [184, 262]], 9, 4), hatch(40, 274, 190, 274, 7, 6, 165, 8)]),
  fills: el.fills + `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(PY.pupil[2] * hs)}"/>`,
  glints: el.glints,
};
