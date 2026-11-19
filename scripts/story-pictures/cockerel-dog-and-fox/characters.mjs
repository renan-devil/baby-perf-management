import { PAL, hatch, transformPath } from '../lib.mjs';

// The Cockerel, the Dog and the Fox: the old oak and the three characters, drawn once here and
// placed in both pictures with a transform (place). The build only draws files named <n>.mjs, so
// this file is not a picture. Every character faces right.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
export const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;

/** A smooth limb (leg, tail) along a centreline of [x, y, width] points, open at the root. */
export function limb(pts) {
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
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      })
      .join('');
  const L = side(1);
  const R = side(-1).reverse();
  const [ex, ey, ew] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const k = (ew * 0.66) / Math.hypot(ex - px, ey - py);
  const cap = `C${f(L[n - 1][0] + (ex - px) * k)} ${f(L[n - 1][1] + (ey - py) * k)} ${f(R[0][0] + (ex - px) * k)} ${f(R[0][1] + (ey - py) * k)} ${f(R[0][0])} ${f(R[0][1])}`;
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}${cap}${curve(R)}`;
}

// A part: { lines, fine, once, washes: [{c, o, d}], whites, fills, glints }, each a list.
const KEYS = ['lines', 'fine', 'once', 'washes', 'whites', 'fills', 'glints'];
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a part with an SVG transform string (applied to the coordinates themselves). */
export function place(part, t) {
  const out = {};
  for (const k of KEYS) out[k] = (part[k] ?? []).map((v) => (k === 'washes' ? { ...v, d: tr(v.d, t) } : tr(v, t)));
  return out;
}

/** Puts several parts together into one. */
export function merge(...parts) {
  const out = Object.fromEntries(KEYS.map((k) => [k, []]));
  for (const p of parts) for (const k of KEYS) out[k].push(...(p[k] ?? []));
  return out;
}

/** Joins placed parts with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, parts = [] }) {
  const all = merge(...parts);
  const tags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: all.washes,
    whites: all.whites.join(''),
    lines: tags(all.lines),
    fine: tags(all.fine),
    once: tags(all.once),
    fills: tags(all.fills),
    glints: tags(all.glints),
  };
}

// ---------------------------------------------------------------------------------------------
// The scene: the ground and the old oak, drawn in picture coordinates (400 × 300). A knobbly trunk
// with a round hollow at its foot, a big crown, and one long branch reaching out to the right
// where the Cockerel sleeps and crows. BRANCH_AT gives the top of that branch at x.
export const GROUND_Y = 262;
const ground = 'M0 263C70 260 150 265 230 262C300 260 350 263 400 261';
const groundWash = 'M0 259C70 256 150 261 230 258C300 256 350 259 400 257L400 296C300 298 100 297 0 295Z';
const trunk = 'M30 264C50 256 56 236 60 206C64 176 72 148 82 118M198 264C178 256 168 236 166 206C162 180 154 156 146 120';
const roots = 'M30 264C22 266 14 266 6 265M198 264C208 266 218 266 226 264M52 262C48 266 42 268 36 268';
export const HOLLOW = 'M74 263C72 226 88 194 114 194C140 194 156 226 154 263Z';
const hollowRim = 'M70 263C68 222 86 188 114 188C142 188 160 222 158 263';
const crown =
  'M32 112C6 106 2 72 26 62C22 34 56 14 86 26C102 6 146 6 160 28C186 22 212 42 202 68C224 80 220 110 196 116C184 132 156 132 140 124C120 136 90 134 76 124C58 132 38 126 32 112Z';
const crownWash =
  'M34 110C10 104 6 74 28 64C26 38 58 18 86 30C102 10 144 10 158 32C184 26 208 44 198 70C218 82 214 108 194 114C182 128 156 128 140 120C120 132 92 130 78 120C60 128 40 124 34 110Z';
const crownTicks = 'M44 54c3-5 8-5 10 0M92 40c3-5 8-5 10 0M140 50c3-5 8-5 10 0M70 86c3-5 8-5 10 0M168 84c3-5 8-5 10 0M118 92c3-5 8-5 10 0';
const branch = 'M152 152C196 142 250 132 330 120M154 168C200 156 256 144 330 128M330 120C334 122 334 126 330 128';
const twig = 'M310 124C318 114 326 108 338 104M300 125C306 116 304 108 298 100';
const leaves = 'M338 104C344 98 352 100 352 100C348 106 342 107 338 104ZM298 100C292 96 292 90 292 90C298 92 300 96 298 100ZM322 112C326 106 332 106 334 106C330 112 326 112 322 112Z';
const branchWash = 'M150 150C196 140 250 130 330 118C336 122 336 126 330 130C256 146 200 158 152 170Z';
const trunkWash = 'M30 264C50 256 56 236 60 206C64 176 72 148 82 116L146 118C154 156 162 180 166 206C168 236 178 256 198 264Z';
const bark = 'M76 160c-3 8-3 16 0 22M98 136c-2 6-2 12 0 16M134 144c3 8 3 14 0 20M162 214c3 6 3 12 0 18M60 222c-2 5-2 10 0 14M120 160c-2 5-2 9 0 12';
/** The top of the long branch at x (between 160 and 330). */
export const BRANCH_AT = (x) => {
  // the branch top follows the curve from (152,152) to (330,120), close enough to a straight line
  return 152 - ((x - 152) * 32) / 178;
};

/** The oak; hole: path data left out of the dark hollow (so a character inside keeps its colours). */
export function oak({ hole = '' } = {}) {
  return {
    lines: [ground, trunk, roots, hollowRim, crown, branch, twig],
    fine: [
      bark,
      crownTicks,
      hatch(36, 96, 70, 116, 6, 8, 125, 11),
      hatch(150, 96, 190, 112, 5, 8, 125, 12),
      hatch(10, 280, 390, 280, 13, 6, 162, 6),
      leaves,
    ],
    washes: [
      { c: PAL.green, o: 0.38, d: groundWash },
      { c: PAL.grey, o: 0.6, d: trunkWash },
      { c: PAL.terracotta, o: 0.2, d: trunkWash },
      { c: PAL.grey, o: 0.6, d: branchWash },
      { c: PAL.terracotta, o: 0.2, d: branchWash },
      { c: PAL.green, o: 0.68, d: crownWash },
      { c: PAL.green, o: 0.35, d: 'M60 104C70 90 100 86 120 94C134 102 128 116 112 118C96 120 70 118 60 104Z' },
      { c: PAL.green, o: 0.8, d: leaves },
      { c: PAL.slate, o: 0.75, d: HOLLOW + hole, rule: 'evenodd' },
      { c: PAL.ink, o: 0.25, d: HOLLOW + hole, rule: 'evenodd' },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// The Cockerel, feet at 0,0, about 66 tall: a proud terracotta bird with an ochre neck ruff, a red
// comb and wattle, a green sickle tail. mood: 'crow' (head up, beak wide open, eye open) or
// 'laugh' (eyes squeezed shut, beak open, little laugh marks).
const ckBody =
  'M-20 -22C-22 -32 -14 -36 -4 -34C2 -33 6 -37 8 -43C9 -51 12 -57 18 -57C24 -57 28 -53 27 -47C26 -41 22 -37 24 -31C26 -20 20 -8 4 -6C-10 -4 -19 -12 -20 -22Z';
const ckRuff = 'M8 -43C10 -36 16 -32 24 -31C22 -37 26 -41 27 -47C22 -44 14 -44 8 -43Z';
const ckWing = 'M-12 -24C-4 -30 8 -28 13 -21C8 -13 -4 -11 -12 -16C-14 -19 -14 -22 -12 -24Z';
const ckWingMarks = 'M-9 -16q2 3 4 1q2 3 4 1q2 3 4 1q2 3 4 0';
const ckTail = [
  'M-16 -28C-18 -50 -30 -64 -43 -58C-50 -54 -50 -42 -45 -32C-42 -42 -36 -50 -29 -48C-23 -46 -21 -36 -20 -22Z',
  'M-19 -22C-25 -40 -40 -48 -52 -38C-56 -33 -55 -24 -51 -18C-48 -27 -41 -34 -34 -32C-28 -30 -24 -24 -22 -17Z',
  'M-20 -17C-30 -26 -44 -24 -49 -12C-42 -17 -34 -18 -22 -11Z',
];
const ckComb = 'M12 -55C10 -61 14 -64 16 -60C16 -66 21 -67 22 -61C23 -66 28 -64 26 -58C28 -57 27 -54 25 -54Z';
const ckWattle = 'M24 -44C22 -40 23 -36 26 -37C28 -38 28 -42 27 -45Z';
const ckLegs = 'M-2 -7L-3 0M-8 0L1 0M7 -7L8 0M3 0L12 0';
const beakOpen = 'M26 -51L36 -57L28 -48ZM27 -46L36 -44L26 -43Z';
const beakLines = 'M26 -51L36 -57L28 -48M27 -46L36 -44L26 -43';
export function cockerel({ mood = 'crow' } = {}) {
  const fine = [ckWingMarks, 'M10 -40l3 3M14 -38l2 4M18 -36l2 3'];
  const fills = [];
  const glints = [];
  const whites = [];
  if (mood === 'crow') {
    whites.push(dot(19, -50, 2.8));
    fine.push(dot(19, -50, 2.8));
    fills.push(dot(19.6, -50.2, 1.6));
    glints.push(dot(20, -50.8, 0.5));
  } else {
    fine.push('M16 -49q3 -4 6 0');
    fine.push('M17 -46q2 1 4 0');
  }
  return {
    lines: [ckBody, ...ckTail, ckComb, ckWattle, beakLines, ckLegs],
    fine: [...fine, ckWing],
    washes: [
      { c: PAL.green, o: 0.75, d: ckTail.join('') },
      { c: PAL.slate, o: 0.25, d: ckTail[1] },
      { c: PAL.terracotta, o: 0.8, d: ckBody },
      { c: PAL.ochre, o: 0.85, d: ckRuff },
      { c: PAL.ochre, o: 0.5, d: ckWing },
      { c: PAL.red, o: 0.9, d: ckComb + ckWattle },
      { c: PAL.ochre, o: 0.95, d: beakOpen },
    ],
    whites,
    fills,
    glints,
  };
}

// ---------------------------------------------------------------------------------------------
// The Dog: a friendly ochre dog with one terracotta patch and a floppy terracotta ear.
// His head (centre 0,0, facing right), sleeping or barking.
const dHead = 'M-12 -2C-13 -11 -5 -15 3 -14C9 -13 12 -9 13 -7L21 -6C25 -5 25 1 21 2L12 3C8 8 -6 9 -10 4C-12 2 -12 0 -12 -2Z';
// barking: the same skull, its jaw dropped wide open
const dHeadBark = 'M12 1C8 8 -6 9 -10 4C-12 2 -13 0 -12 -2C-13 -11 -5 -15 3 -14C9 -13 12 -9 13 -7L22 -6C26 -5 26 0 22 0L12 1';
const dJaw = 'M10 3L22 9C25 11 23 14 19 13L6 8';
const dMouth = 'M12 1L22 0L23 8L10 3Z';
const dEar = 'M-5 -12C-11 -12 -13 -3 -11 5C-7 5 -5 -1 -3 -10Z';
const dNose = 'M21 -6.5C23.5 -7 25 -5.5 24.6 -4C24.2 -2.6 22 -2.6 21 -3.4Z';
export function dogHead({ mood = 'sleep' } = {}) {
  if (mood === 'sleep') {
    return {
      lines: [dHead, dEar],
      fine: ['M1 -6.5q3.5 3 7 0', 'M12 1q-2 1.5 -4 1'],
      washes: [
        { c: PAL.ochre, o: 0.8, d: dHead },
        { c: PAL.terracotta, o: 0.8, d: dEar },
        { c: PAL.rose, o: 0.5, d: dot(4, -1, 2.2) },
      ],
      fills: [dNose],
    };
  }
  return {
    lines: [dHeadBark, dJaw, dEar],
    fine: [dot(4, -7, 2.4), 'M0 -11q4 -3 8 0'],
    washes: [
      { c: PAL.ochre, o: 0.8, d: `${dHeadBark}Z${dJaw}Z` },
      { c: PAL.red, o: 0.8, d: dMouth },
      { c: PAL.rose, o: 0.9, d: 'M14 4C17 5 19 7 18 9C16 9 14 7 14 4Z' },
      { c: PAL.terracotta, o: 0.8, d: dEar },
    ],
    whites: [dot(4, -7, 2.4)],
    fills: [dNose, dot(4.8, -6.8, 1.4)],
    glints: [dot(5.2, -7.3, 0.45)],
  };
}

/** The Dog curled up asleep, his chin on his paws; bottom centre at 0,0, about 62 wide. */
export function dogAsleep() {
  const body = 'M-30 0C-34 -14 -22 -27 -4 -27';
  const bodyWash = 'M-30 0C-34 -14 -22 -27 -4 -27C12 -27 22 -20 24 -10';
  const patch = 'M-16 -24C-10 -26 -2 -25 2 -21C0 -16 -8 -14 -14 -16C-18 -18 -18 -22 -16 -24Z';
  const tail = 'M-30 -1C-26 3 -10 3 2 1C-8 -2 -18 -2 -24 -6';
  const paws = 'M8 0C14 -2 26 -2 30 0C30 2 26 3 20 2M2 1C4 -1 8 -1 10 0';
  const haunch = 'M-22 -6C-24 -16 -14 -22 -6 -16';
  return merge(
    {
      lines: [body, tail, paws],
      fine: [haunch, 'M-30 0L30 1'],
      washes: [
        { c: PAL.ochre, o: 0.8, d: `${bodyWash}C26 -4 28 0 24 1L-30 1Z${tail}Z` },
        { c: PAL.terracotta, o: 0.7, d: patch },
      ],
    },
    place(dogHead({ mood: 'sleep' }), 'translate(12 -12) rotate(6) scale(1.2)'),
  );
}

/** The Dog leaping, front paws reaching forward, barking; body centre at 0,0. */
export function dogLeap() {
  const body = 'M-24 -2C-26 -10 -16 -14 0 -13C12 -12 20 -10 24 -4C24 4 12 9 -2 9C-14 9 -22 6 -24 -2Z';
  const patch = 'M-14 -12C-8 -13 -2 -12 2 -9C0 -4 -8 -3 -14 -5C-17 -7 -17 -10 -14 -12Z';
  const legs = [
    limb([[16, 2, 8], [28, 4, 6.5], [40, 2, 6]]),
    limb([[12, 5, 8], [22, 10, 6.5], [34, 10, 6]]),
    limb([[-18, 3, 9], [-30, 10, 7], [-42, 14, 6]]),
    limb([[-14, 6, 9], [-22, 14, 7], [-34, 20, 6]]),
  ];
  const tail = limb([[-23, -6, 6], [-31, -14, 5], [-36, -24, 3.5]]);
  const shape = `${body}${legs.map((l) => `${l}Z`).join('')}${tail}Z`;
  return merge(
    {
      lines: [...legs, tail, body],
      fine: ['M-18 2C-20 -4 -14 -8 -8 -5'],
      washes: [
        { c: PAL.ochre, o: 0.8, d: shape },
        { c: PAL.terracotta, o: 0.7, d: patch },
      ],
    },
    place(dogHead({ mood: 'bark' }), 'translate(29 -13) rotate(-14) scale(1.05)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The Fox, running flat out to the right: a terracotta fox with a white chin and a white tip to his
// big bushy tail, which streams out behind him like a flag. Body centre at 0,0.
export function foxRunning() {
  const body = 'M-22 -4C-20 -13 -6 -15 6 -14C16 -13 22 -9 24 -2C22 6 12 8 0 8C-12 8 -22 4 -22 -4Z';
  const head = 'M18 -12C20 -21 30 -24 37 -20L52 -14C54 -12 53 -10 50 -10L39 -7C34 -3 24 -2 20 -6C18 -8 18 -10 18 -12Z';
  const ears = 'M22 -18L12 -28L28 -22M28 -21L22 -32L34 -22';
  const innerEar = 'M21 -20L16 -25L25 -22Z';
  const chin = 'M39 -7L50 -10C48 -7 44 -5 38 -4Z';
  const legs = [
    limb([[16, 2, 7], [28, 6, 5], [40, 4, 4.5]]),
    limb([[12, 4, 7], [20, 12, 5], [28, 18, 4.5]]),
    limb([[-16, 2, 8], [-28, 8, 6], [-42, 8, 4.5]]),
    limb([[-12, 5, 8], [-18, 14, 6], [-26, 20, 4.5]]),
  ];
  const tailPts = [
    [-20, -6, 8],
    [-34, -10, 15],
    [-52, -12, 17],
    [-70, -12, 13],
    [-82, -11, 6],
  ];
  const tail = limb(tailPts);
  const tip = limb([[-68, -12, 13.6], [-82, -11, 6]]);
  const tipMark = 'M-67 -18.5C-69 -14 -69 -9 -67 -5.5';
  const fur = 'M-40 -12l7 -1M-54 -10l7 0M-6 -8l6 2';
  return {
    lines: [...legs, tail, body, head, ears],
    fine: [tipMark, fur, innerEar, 'M44 -13l-6 1', dot(30, -14, 2.8)],
    washes: [
      { c: PAL.terracotta, o: 0.9, d: `${tail}Z${body}${head}${ears}Z${legs.map((l) => `${l}Z`).join('')}` },
      { c: PAL.red, o: 0.25, d: `${tail}Z` },
      { c: PAL.ink, o: 0.45, d: innerEar },
    ],
    whites: [`${tip}Z`, chin, dot(30, -14, 2.8)],
    fills: [dot(52, -12, 1.8), dot(31, -14, 1.5)],
    glints: [dot(31.4, -14.6, 0.45)],
  };
}
