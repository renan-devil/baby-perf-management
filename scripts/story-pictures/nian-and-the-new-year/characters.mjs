import { PAL, parseTransform, transformPath } from '../lib.mjs';

// Nian and the First New Year: the characters and things shared by the five pictures, drawn once
// here and placed in each picture with a transform (place). The build only draws files named
// <n>.mjs, so this file is not a picture. Standing characters have their feet at y = 0.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (leg, arm, tail) along a centreline of [x, y, width] points, open at the root. */
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

/**
 * A fluffy edge: little round bumps along an ellipse, from angle a0 to a1 (degrees, clockwise from
 * the right). The whole way round it is closed; part of the way it stays open (hidden behind
 * something else).
 */
export function fluff(cx, cy, rx, ry, n = 11, bump = 1.25, a0 = 0, a1 = 360) {
  const rad = (deg) => (deg * Math.PI) / 180;
  const pt = (a, k = 1) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  const step = rad(a1 - a0) / n;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = rad(a0) + i * step;
    const [x, y] = pt(a);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const [c1x, c1y] = pt(a - step * 0.8, bump);
      const [c2x, c2y] = pt(a - step * 0.2, bump);
      d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x)} ${f(y)}`;
    }
  }
  return a1 - a0 >= 360 ? `${d}Z` : d;
}

// A character: { lines: [d], fine: [d], washes: [{c, o, d, rule?}], whites: [d], fills: [d], glints: [d] }.
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a character with an SVG transform string (applied to the coordinates themselves). */
export function place(ch, t) {
  return {
    lines: (ch.lines ?? []).map((d) => tr(d, t)),
    fine: (ch.fine ?? []).map((d) => tr(d, t)),
    washes: (ch.washes ?? []).map((w) => ({ ...w, d: tr(w.d, t) })),
    whites: (ch.whites ?? []).map((d) => tr(d, t)),
    fills: (ch.fills ?? []).map((d) => tr(d, t)),
    glints: (ch.glints ?? []).map((d) => tr(d, t)),
  };
}

/** Puts several characters together into one. */
export const merge = (...parts) => {
  const out = { lines: [], fine: [], washes: [], whites: [], fills: [], glints: [] };
  for (const p of parts) for (const k of Object.keys(out)) out[k].push(...(p[k] ?? []));
  return out;
};

/** Joins placed characters with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', fills = '', glints = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k]);
  const pathTags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: pathTags([...lines, ...all('lines')]),
    fine: pathTags([...fine, ...all('fine')]),
    once,
    fills: fills + pathTags(all('fills')),
    glints: glints + pathTags(all('glints')),
  };
}

/** Where the point (x, y) of a character lands once placed with transform t. */
export function at(t, x, y) {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** Mirrors a left arm to the right side. */
export const right = (pts) => pts.map(([x, y, w]) => [-x, y, w]);
/** Where the hand is at the end of an arm centreline. */
export const handOf = (arm) => arm[arm.length - 1].slice(0, 2);

// ---------------------------------------------------------------------------------------------
// Nian, the beast from the mountains, facing right (feet at 0,0, about 190 long and 160 tall
// with his horn): a big round fluffy green body, a shaggy green mane round a friendly face, an
// ochre muzzle and belly, one stubby ochre horn, little ox ears, short legs and a tufted tail.
// Big and greedy, but comic and never frightening: round eyes, no teeth, no claws.
//   mood: 'curious' (looking up, a little "o"), 'startled' (eyes wide, mouth a big O),
//   'happy' (a wide smile). look: where the pupils look [dx, dy]. legs: 'stand' or 'leap'.
const NIAN_BODY = [-12, -62, 70, 46];
const NIAN_MANE = [62, -90, 38, 36];
const nFace = oval(68, -86, 24, 22);
const nMuzzle = oval(80, -74, 15, 10.5);
const nEars = 'M32 -106C22 -118 10 -118 6 -112C12 -104 24 -102 32 -104ZM94 -110C104 -122 116 -122 120 -116C114 -108 102 -106 94 -106Z';
const nEarsIn = 'M26 -108C18 -114 12 -114 10 -112C16 -108 22 -106 26 -107ZM100 -111C106 -116 112 -117 115 -115C110 -111 104 -109 100 -109Z';
const nHorn = 'M58 -122C56 -136 60 -148 68 -158C72 -148 76 -136 74 -122';
const nHornWash = 'M58 -122C56 -136 60 -148 68 -158C72 -148 76 -136 74 -122C70 -119 62 -119 58 -122Z';
const nBelly = 'M-44 -30C-30 -20 20 -18 40 -28C34 -38 -32 -42 -44 -30Z';
const NIAN_LEGS = {
  stand: [
    [[-56, -26, 20], [-56, -12, 19], [-56, -3, 18]],
    [[-30, -22, 20], [-30, -10, 19], [-30, -3, 18]],
    [[10, -22, 20], [12, -10, 19], [12, -3, 18]],
    [[36, -26, 20], [38, -12, 19], [38, -3, 18]],
  ],
  leap: [
    [[-58, -30, 20], [-76, -22, 19], [-94, -18, 18]],
    [[-34, -24, 20], [-50, -12, 19], [-66, -6, 18]],
    [[14, -26, 20], [32, -18, 19], [48, -16, 18]],
    [[36, -32, 20], [56, -28, 19], [72, -28, 18]],
  ],
};

export function nian({ mood = 'curious', look = [2, -2], legs = 'stand' } = {}) {
  const [bx, by, brx, bry] = NIAN_BODY;
  const [mx, my, mrx, mry] = NIAN_MANE;
  const body = fluff(bx, by, brx, bry, 10, 1.14, 0, 360);
  const bodyOpen = fluff(bx, by, brx, bry, 8, 1.14, 8, 296); // the part not hidden by the mane
  const mane = fluff(mx, my, mrx, mry, 11, 1.38, 10, 370);
  const legPts = NIAN_LEGS[legs];
  const legPaths = legPts.map(limb);
  const paws = legPts.map((p) => oval(p[p.length - 1][0] + 2, p[p.length - 1][1] + 1, 12, 6)).join('');
  const toes = legPts.map((p) => {
    const [x, y] = p[p.length - 1];
    return `M${f(x + 2)} ${f(y - 4)}l0 6M${f(x + 7)} ${f(y - 3)}l0 5`;
  });
  const tail = legs === 'leap' ? [[-78, -72, 7], [-104, -80, 6], [-122, -96, 5]] : [[-78, -70, 7], [-100, -88, 6], [-104, -110, 5]];
  const tailPath = limb(tail);
  const [tx, ty] = tail[tail.length - 1];
  const tuft = fluff(tx, ty - 6, 11, 10, 7, 1.3);

  const fine = [nEarsIn, 'M59 -130l14 0M61 -140l10 -1M64 -149l6 0', toes.join('')];
  const fills = [oval(76, -78, 1.6, 2.2), oval(84, -78, 1.6, 2.2)];
  const whites = [];
  const glints = [];
  const washes = [];
  const [lx, ly] = look;
  if (mood === 'startled') {
    whites.push(dot(58, -94, 7.5), dot(78, -94, 7.5));
    fine.push(dot(58, -94, 7.5), dot(78, -94, 7.5), 'M49 -106q6 -6 12 -2M72 -108q6 -4 12 2');
    fills.push(dot(58 + lx, -94 + ly, 2.6), dot(78 + lx, -94 + ly, 2.6), oval(80, -63, 6, 7));
  } else {
    whites.push(dot(58, -94, 6), dot(78, -94, 6));
    fine.push(dot(58, -94, 6), dot(78, -94, 6));
    fills.push(dot(58 + lx, -94 + ly, 3), dot(78 + lx, -94 + ly, 3));
    glints.push(dot(57 + lx, -95.5 + ly, 1), dot(77 + lx, -95.5 + ly, 1));
    if (mood === 'curious') {
      fine.push('M50 -104q6 -5 12 -3M72 -108q6 -3 12 0');
      fills.push(oval(80, -64, 3, 3.4));
    } else {
      fine.push('M50 -104q6 -3 12 -1M72 -105q6 -2 12 1', 'M68 -66C74 -58 88 -58 92 -67');
    }
  }
  washes.push({ c: PAL.rose, o: 0.55, d: dot(50, -78, 4.5) + dot(96, -80, 4) });

  return {
    lines: [...legPaths, tailPath, tuft, bodyOpen, nEars, mane, nHorn, nFace, nMuzzle],
    fine: [
      ...fine,
      paws,
      nBelly,
      // fur marks on the body and mane
      'M-60 -82c4 -4 9 -4 12 0M-30 -96c4 -4 9 -4 12 0M-46 -60c4 -4 9 -4 12 0M-6 -78c4 -4 9 -4 12 0M-70 -50c4 -4 9 -4 12 0',
      'M34 -112c3 -3 6 -3 8 0M92 -60c3 -3 6 -3 8 0M38 -70c3 -3 6 -3 8 0',
    ],
    washes: [
      { c: PAL.green, o: 0.66, d: `${body}${legPaths.join('Z')}Z${tailPath}Z` },
      { c: PAL.terracotta, o: 0.75, d: mane + nEars + tuft },
      { c: PAL.ochre, o: 0.55, d: nFace },
      { c: PAL.ochre, o: 0.3, d: nMuzzle },
      { c: PAL.ochre, o: 0.7, d: nBelly },
      { c: PAL.grey, o: 0.9, d: nHornWash },
      { c: PAL.grey, o: 0.6, d: paws },
      { c: PAL.rose, o: 0.7, d: nEarsIn },
      ...washes,
    ],
    whites,
    fills,
    glints,
  };
}

// ---------------------------------------------------------------------------------------------
// The people (feet at 0,0, about 150 tall), in simple traditional village clothes: a jacket
// fastened at the side, loose trousers and cloth shoes. The head sits at P_HEAD (face radius 13).
//   who: 'granny'  grey hair in a bun, sky-blue jacket, slate trousers;
//        'oldman'  white hair in a topknot, a long white beard, a long ochre robe (red: a red one);
//        'child'   black hair in two little buns, a red jacket.
// arms: two limb centrelines from the shoulders (±11, -100). cut: only down to the waist (behind a
// table).
export const P_HEAD = [0, -118];
export const ARMS = {
  down: [[-11, -100, 8], [-16, -84, 7], [-18, -66, 7]],
  front: [[-11, -100, 8], [-20, -86, 7], [-30, -80, 7]],
  give: [[-11, -100, 8], [-24, -88, 7], [-40, -90, 7]],
  up: [[-11, -100, 8], [-22, -116, 7], [-26, -136, 7]],
  reach: [[-11, -100, 8], [-28, -112, 7], [-44, -128, 7]],
  stroke: [[-11, -100, 8], [-20, -90, 7], [-8, -96, 7]],
  wave: [[-11, -100, 8], [-26, -108, 7], [-30, -126, 7]],
  table: [[-11, -100, 8], [-20, -82, 7], [-10, -66, 7]],
};

const face = 'M-13 0C-13 -9 -7 -13 0 -13C8 -13 13 -8 13 0C13 9 7 13 0 13C-8 13 -13 8 -13 0Z';

function faceMarks(mood) {
  const fine = [];
  const fills = [];
  const glints = [];
  if (mood === 'content') fine.push('M-8 -1q3 -3 6 0M2 -1q3 -3 6 0', 'M-4 5q4 4 8 0');
  else if (mood === 'surprised') {
    fills.push(dot(-5, -1, 1.8), dot(5, -1, 1.8), oval(0, 6, 2.2, 2.8));
    fine.push('M-8 -7q3 -2 6 0M2 -7q3 -2 6 0');
  } else if (mood === 'laugh') {
    fine.push('M-8 -1q3 -3 6 0M2 -1q3 -3 6 0', 'M-5 4C-4 10 4 10 5 4Z');
  } else {
    fills.push(dot(-5, -1, 1.8), dot(5, -1, 1.8));
    glints.push(dot(-5.5, -1.6, 0.55), dot(4.5, -1.6, 0.55));
    fine.push('M-4 5q4 4 8 0');
  }
  return { fine, fills, glints };
}

const grannyHair = 'M-14 2C-16 -10 -9 -16 0 -16C9 -16 16 -10 14 2C12 -4 8 -8 2 -9C-4 -8 -10 -5 -14 2Z';
const grannyBun = oval(0, -19, 7, 5);
const oldHair = 'M-13 -2C-14 -10 -8 -15 0 -15C8 -15 14 -10 13 -2C10 -7 6 -9 0 -9C-6 -9 -10 -7 -13 -2Z';
const oldKnot = oval(0, -18, 4.5, 4);
const beard = 'M-11 3C-12 16 -6 30 0 38C6 30 12 16 11 3C7 8 -7 8 -11 3Z';
const moustache = 'M-7 4C-4 1 -1 2 0 3.5C1 2 4 1 7 4C4 6 -4 6 -7 4Z';
const childHair = 'M-14 2C-16 -10 -9 -16 0 -16C9 -16 16 -10 14 2C11 -4 6 -9 0 -8C-6 -9 -11 -4 -14 2Z';
const childBuns = oval(-11, -14, 5, 4.5) + oval(11, -14, 5, 4.5);

export function head({ who = 'granny', mood = 'happy' } = {}) {
  const m = faceMarks(mood);
  const cheeks = { c: PAL.rose, o: 0.55, d: dot(-8, 4, 2.4) + dot(8, 4, 2.4) };
  const skin = { c: PAL.rose, o: 0.22, d: face };
  if (who === 'oldman') {
    return {
      lines: [face, oldHair, oldKnot, beard],
      fine: [...m.fine.filter((d) => !d.startsWith('M-4 5') && !d.startsWith('M-5 4')), moustache, 'M-3 14q-1 8 1 16M4 14q1 8 -1 14', 'M-9 -6q3 -2 6 -1M3 -7q3 -1 6 1'],
      washes: [skin, { c: PAL.grey, o: 0.25, d: oldHair + oldKnot }, cheeks],
      whites: [beard],
      fills: m.fills,
      glints: m.glints,
    };
  }
  if (who === 'child') {
    return {
      lines: [face, childHair, childBuns],
      fine: m.fine,
      washes: [skin, { c: PAL.slate, o: 0.9, d: childHair + childBuns }, cheeks],
      whites: [],
      fills: m.fills,
      glints: m.glints,
    };
  }
  return {
    lines: [face, grannyHair, grannyBun],
    fine: [...m.fine, 'M-6 -13q4 -2 8 0', 'M-11 -3l-2 -2M11 -3l2 -2'],
    washes: [skin, { c: PAL.grey, o: 0.75, d: grannyHair + grannyBun }, cheeks],
    whites: [],
    fills: m.fills,
    glints: m.glints,
  };
}

const jacket = 'M-11 -102C-18 -90 -22 -70 -23 -50C-8 -46 8 -46 23 -50C22 -70 18 -90 11 -102';
const robe = 'M-11 -102C-19 -86 -24 -50 -28 -14C-10 -10 10 -10 28 -14C24 -50 19 -86 11 -102';
const waist = 'M-11 -102C-18 -90 -22 -72 -23 -56';
const waistR = 'M11 -102C18 -90 22 -72 23 -56';
const LEGS = [[[-9, -52, 11], [-10, -26, 10], [-10, -4, 9]], [[9, -52, 11], [10, -26, 10], [10, -4, 9]]];
const ROBE_LEGS = [[[-9, -16, 8], [-9, -4, 8]], [[9, -16, 8], [9, -4, 8]]];

export function person({ who = 'granny', red = false, mood = 'happy', tilt = 0, arms = [ARMS.down, right(ARMS.down)], cut = false } = {}) {
  const h = place(head({ who, mood }), `translate(${P_HEAD[0]} ${P_HEAD[1]}) rotate(${tilt})`);
  const armPaths = arms.map(limb);
  const hands = arms.map((a) => dot(a[a.length - 1][0], a[a.length - 1][1], 4.6)).join('');
  const long = who === 'oldman';
  const colour = who === 'granny' ? PAL.sky : who === 'child' || red ? PAL.red : PAL.ochre;
  const top = cut ? `${waist}M${waistR.slice(1)}` : long ? robe : jacket;
  const topWash = cut ? 'M-11 -102C-18 -90 -22 -72 -23 -56L23 -56C22 -72 18 -90 11 -102Z' : `${top}Z`;
  const legPts = cut ? [] : long ? ROBE_LEGS : LEGS;
  const legPaths = legPts.map(limb);
  const shoes = legPts.map((p) => oval(p[p.length - 1][0] + 2, p[p.length - 1][1] + 1, 7, 3.6)).join('');
  // the side fastening of the jacket, from the collar across to the right, with two knot buttons
  const fastening = 'M-4 -104C-2 -96 6 -92 14 -88';
  const hem = cut ? '' : long ? 'M-26 -18C-10 -14 10 -14 26 -18' : 'M-22 -54C-8 -50 8 -50 22 -54';
  return merge(
    {
      lines: [...legPaths, top, ...armPaths],
      fine: [fastening, 'M3 -97l3 1M9 -92l3 1', shoes, hem, ...(long && !cut ? ['M-6 -40l0 22M8 -60l2 36'] : [])].filter(Boolean),
      washes: [
        { c: who === 'granny' ? PAL.slate : PAL.grey, o: 0.55, d: legPaths.length ? `${legPaths.join('Z')}Z` : '' },
        { c: colour, o: who === 'granny' ? 0.7 : red || who === 'child' ? 0.78 : 0.55, d: `${topWash}${armPaths.join('Z')}Z` },
        { c: PAL.rose, o: 0.4, d: hands },
        { c: PAL.slate, o: 0.85, d: shoes },
      ].filter((w) => w.d),
    },
    h,
  );
}

// ---------------------------------------------------------------------------------------------
// Things
/** The old man's walking stick (held at 0,0, bottom end about 70 below). */
export function walkingStick() {
  return {
    lines: ['M0 -12L0 74', 'M0 -12C0 -20 8 -22 10 -16'],
    washes: [{ c: PAL.terracotta, o: 0.6, d: 'M-2 -12L-2 74L2 74L2 -12Z' }],
  };
}

/** A cloth bundle on the back (centre at 0,0). */
export function bundle() {
  const d = 'M-16 4C-20 -8 -10 -18 0 -16C12 -18 20 -8 16 4C10 10 -10 10 -16 4Z';
  return {
    lines: [d, 'M-4 -16L2 -24L8 -17'],
    fine: ['M-8 -4l16 4'],
    washes: [{ c: PAL.slate, o: 0.5, d }],
  };
}

/** A round red paper lantern hanging from (0,0), r wide; glow: an ochre halo of candlelight. */
export function lantern(r = 14, { glow = true, string = 10 } = {}) {
  const top = string;
  const body = oval(0, top + 5 + r * 0.85, r, r * 0.85);
  const cy = top + 5 + r * 0.85;
  const capT = `M${f(-r * 0.45)} ${top}L${f(r * 0.45)} ${top}L${f(r * 0.5)} ${top + 5}L${f(-r * 0.5)} ${top + 5}Z`;
  const by = top + 5 + r * 1.7;
  const capB = `M${f(-r * 0.45)} ${f(by - 1)}L${f(r * 0.45)} ${f(by - 1)}L${f(r * 0.4)} ${f(by + 4)}L${f(-r * 0.4)} ${f(by + 4)}Z`;
  const tassel = `M0 ${f(by + 4)}L0 ${f(by + 8)}M-3 ${f(by + 8)}L-4 ${f(by + 18)}M0 ${f(by + 8)}L0 ${f(by + 19)}M3 ${f(by + 8)}L4 ${f(by + 18)}`;
  const ribs = `M0 ${f(cy - r * 0.85)}L0 ${f(cy + r * 0.85)}M${f(-r * 0.5)} ${f(cy - r * 0.7)}C${f(-r * 0.7)} ${f(cy - r * 0.2)} ${f(-r * 0.7)} ${f(cy + r * 0.2)} ${f(-r * 0.5)} ${f(cy + r * 0.7)}M${f(r * 0.5)} ${f(cy - r * 0.7)}C${f(r * 0.7)} ${f(cy - r * 0.2)} ${f(r * 0.7)} ${f(cy + r * 0.2)} ${f(r * 0.5)} ${f(cy + r * 0.7)}`;
  return {
    lines: [`M0 0L0 ${top}`, body, capT, capB],
    fine: [ribs, tassel],
    washes: [
      ...(glow ? [{ c: PAL.ochre, o: 0.3, d: oval(0, cy, r * 1.9, r * 1.7) }] : []),
      { c: PAL.red, o: 0.85, d: body },
      { c: PAL.ochre, o: 0.9, d: capT + capB },
      { c: PAL.ochre, o: 0.55, d: oval(-r * 0.25, cy - r * 0.2, r * 0.3, r * 0.4) },
      { c: PAL.red, o: 0.7, d: `M-3 ${f(by + 8)}L3 ${f(by + 8)}L4 ${f(by + 18)}L-4 ${f(by + 18)}Z` },
    ],
  };
}

/**
 * A village house with a grey tiled roof and curling eaves (bottom centre at 0,0, w wide, walls h
 * tall), a wooden double door in the middle; red: red paper strips beside and above the door and
 * a red diamond on each leaf.
 */
export function house({ w = 220, h = 90, red = false, door = 0 } = {}) {
  const a = w / 2;
  const walls = `M${-a} 0L${-a} ${-h}M${a} 0L${a} ${-h}`;
  const roof = `M${-a - 34} ${-h + 2}C${-a - 26} ${-h - 2} ${-a - 18} ${-h - 6} ${-a - 10} ${-h - 14}L${-a + 18} ${-h - 46}L${a - 18} ${-h - 46}L${a + 10} ${-h - 14}C${a + 18} ${-h - 6} ${a + 26} ${-h - 2} ${a + 34} ${-h + 2}C${a + 10} ${-h + 4} ${-a - 10} ${-h + 4} ${-a - 34} ${-h + 2}Z`;
  const ridge = `M${-a + 8} ${-h - 46}L${a - 8} ${-h - 46}M${-a + 8} ${-h - 46}C${-a + 4} ${-h - 52} ${-a + 8} ${-h - 58} ${-a + 14} ${-h - 56}M${a - 8} ${-h - 46}C${a - 4} ${-h - 52} ${a - 8} ${-h - 58} ${a - 14} ${-h - 56}`;
  let tiles = '';
  for (let x = -a + 4; x <= a - 4; x += 12) tiles += `M${f(x * 0.92)} ${-h - 44}L${f(x * 1.12)} ${-h - 2}`;
  const dx = door;
  const dw = 22;
  const dh = 62;
  const doorPath = `M${dx - dw} 0L${dx - dw} ${-dh}L${dx + dw} ${-dh}L${dx + dw} 0M${dx} 0L${dx} ${-dh}`;
  const strips = `M${dx - dw - 14} ${-dh + 4}L${dx - dw - 5} ${-dh + 4}L${dx - dw - 5} -6L${dx - dw - 14} -6ZM${dx + dw + 5} ${-dh + 4}L${dx + dw + 14} ${-dh + 4}L${dx + dw + 14} -6L${dx + dw + 5} -6ZM${dx - dw} ${-dh - 14}L${dx + dw} ${-dh - 14}L${dx + dw} ${-dh - 4}L${dx - dw} ${-dh - 4}Z`;
  const diamonds = `M${dx - 11} ${-dh + 18}L${dx - 3} ${-dh + 28}L${dx - 11} ${-dh + 38}L${dx - 19} ${-dh + 28}ZM${dx + 11} ${-dh + 18}L${dx + 19} ${-dh + 28}L${dx + 11} ${-dh + 38}L${dx + 3} ${-dh + 28}Z`;
  const rings = dot(dx - 4, -dh / 2 + 4, 2) + dot(dx + 4, -dh / 2 + 4, 2);
  return {
    lines: [walls, roof, ridge, doorPath, ...(red ? [strips, diamonds] : [])],
    fine: [tiles, rings, `M${-a} -6L${a} -6`, `M${dx - dw + 6} -10l0 -40M${dx + dw - 6} -10l0 -40`],
    washes: [
      { c: PAL.ochre, o: 0.18, d: `M${-a} 0L${-a} ${-h}L${a} ${-h}L${a} 0Z` },
      { c: PAL.slate, o: 0.6, d: roof },
      { c: PAL.grey, o: 0.5, d: `M${-a} 0L${-a} -6L${a} -6L${a} 0Z` },
      { c: PAL.terracotta, o: 0.55, d: `M${dx - dw} 0L${dx - dw} ${-dh}L${dx + dw} ${-dh}L${dx + dw} 0Z` },
      ...(red ? [{ c: PAL.red, o: 0.88, d: strips + diamonds }] : []),
    ],
  };
}

/** A little round window with a lattice (centre at 0,0). */
export function windowLattice(r = 16) {
  const d = oval(0, 0, r, r);
  return {
    lines: [d],
    fine: [`M${-r} 0L${r} 0M0 ${-r}L0 ${r}M${f(-r * 0.7)} ${f(-r * 0.7)}L${f(r * 0.7)} ${f(r * 0.7)}M${f(-r * 0.7)} ${f(r * 0.7)}L${f(r * 0.7)} ${f(-r * 0.7)}`],
    washes: [{ c: PAL.ochre, o: 0.45, d }],
  };
}

/** A dumpling, seen from the side (bottom centre at 0,0), pleated on top. */
export const dumpling = (s = 1) => {
  const d = `M${f(-9 * s)} 0C${f(-10 * s)} ${f(-6 * s)} ${f(-5 * s)} ${f(-10 * s)} 0 ${f(-10 * s)}C${f(5 * s)} ${f(-10 * s)} ${f(10 * s)} ${f(-6 * s)} ${f(9 * s)} 0Z`;
  return { lines: [d], fine: [`M${f(-3 * s)} ${f(-9 * s)}l1 ${f(3 * s)}M0 ${f(-10 * s)}l0 ${f(3 * s)}M${f(3 * s)} ${f(-9 * s)}l-1 ${f(3 * s)}`], whites: [d] };
};
