import { PAL, transformPath } from '../lib.mjs';

// The Hare and the Hedgehog: the characters shared by all five pictures, drawn once here and placed
// in each picture with a transform (place). The build only draws files named <n>.mjs, so this file
// is not a picture. Every character faces right with its feet at y = 0; flip with scale(-1 1).
// Mr and Mrs Hedgehog are the very same drawing: that is the whole trick of the story.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, nose, glint) as path data. */
export const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;

/** A smooth limb (leg, arm, ear) along a centreline of [x, y, width] points, open at the root. */
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

// A character: { lines: [d], fine: [d], washes: [{c, o, d}], whites: [d], fills: [d], glints: [d] }.
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a character (or part of one) with an SVG transform string. */
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

/** Puts several parts together into one character. */
const merge = (...parts) => {
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

// ---------------------------------------------------------------------------------------------
// The Hedgehog: a little round fellow standing on two short, crooked legs, a spiky brown coat over
// his back and the top of his head, a pale face with a pointed snout and a black button nose.

// The coat of spines: a zigzag round the back, from the forehead to the bottom of the back.
const SP = { cx: 0, cy: -38, rin: 28, rout: 37, from: -62, to: -252, n: 21 };
const polar = (a, r) => [SP.cx + r * Math.cos((a * Math.PI) / 180), SP.cy + r * Math.sin((a * Math.PI) / 180)];
const spikes = (() => {
  let d = `M${polar(SP.from, SP.rin).map(f).join(' ')}`;
  for (let i = 0; i < SP.n; i++) {
    const a0 = SP.from + ((SP.to - SP.from) * i) / SP.n;
    const a1 = SP.from + ((SP.to - SP.from) * (i + 1)) / SP.n;
    const tip = polar((a0 + a1) / 2 + (i % 2 ? 2 : -2), SP.rout + (i % 3 === 1 ? 3 : 0));
    d += `L${tip.map(f).join(' ')}L${polar(a1, SP.rin).map(f).join(' ')}`;
  }
  return d;
})();
const [sx0, sy0] = polar(SP.from, SP.rin).map(f);
const [sx1, sy1] = polar(SP.to, SP.rin).map(f);
// where the coat meets the face and tummy
const coatEdge = `M${sx0} ${sy0}C8 -50 4 -38 2 -28C0 -20 -4 -14 ${sx1} ${sy1}`;
// face and tummy: forehead, long snout, chin, round tummy
const front = `M${sx0} ${sy0}C19 -60 26 -54 33 -49L42 -46C45 -44 44 -40 40 -40C32 -40 26 -38 24 -32C27 -22 22 -12 14 -9C6 -6 -2 -8 ${sx1} ${sy1}`;
const coat = `${spikes}C-4 -14 0 -20 2 -28C4 -38 8 -50 ${sx0} ${sy0}Z`;
const faceFill = `${coatEdge.replace(/^M[^C]+/, `M${sx0} ${sy0}`)}C-2 -8 6 -6 14 -9C22 -12 27 -22 24 -32C26 -38 32 -40 40 -40C44 -40 45 -44 42 -46L33 -49C26 -54 19 -60 ${sx0} ${sy0}Z`;
const ear = 'M12 -58C8 -62 12 -68 17 -65';
const quills = 'M-6 -50l-6 -6M-16 -42l-7 -5M-20 -30l-8 -3M-10 -36l-6 -6M-14 -20l-8 -1M2 -60l-3 -7M-4 -24l-6 -4';
const nose = dot(42, -44, 2.8, 2.4);

const hhLegs = {
  // short, crooked, bandy legs, each with a little foot
  stand: [
    [[-3, -12, 7], [-9, -6, 6], [-6, -1, 5], [2, 0, 5]],
    [[12, -13, 7], [17, -7, 6], [12, -1, 5], [21, 0, 5]],
  ],
  trot: [
    [[-3, -12, 7], [-10, -8, 6], [-15, -3, 5], [-9, 1, 5]],
    [[12, -13, 7], [20, -10, 6], [24, -4, 5], [31, -4, 5]],
  ],
};
const hhArms = {
  down: [[16, -30, 6], [21, -22, 5], [22, -15, 5]],
  hip: [[16, -30, 6], [25, -27, 5], [22, -18, 5]],
  wave: [[17, -27, 6], [29, -22, 5], [41, -23, 5], [49, -31, 5]],
  swing: [[16, -30, 6], [25, -24, 5], [32, -22, 5]],
  point: [[17, -31, 6], [28, -34, 5], [38, -40, 5]],
};
// eye: a bright bead; 'wink' and 'happy' are little closed arcs
const hhEyes = {
  open: { fine: [], fill: dot(25, -51, 2.6) },
  happy: { fine: ['M21 -51Q25 -56 29 -51'] },
  wink: { fine: ['M21 -52Q25 -48 29 -52', 'M22 -56l6 1'] },
  cross: { fine: ['M21 -57l7 2'], fill: dot(25, -51, 2.4) },
};
const hhMouths = {
  smile: 'M30 -40Q34 -36 38 -39',
  grin: 'M29 -41Q34 -34 40 -39M29 -41l-1 -2',
  flat: 'M31 -40l6 0',
};

/** The Hedgehog (or Mrs Hedgehog: the very same). */
export function hedgehog({ legs = 'stand', arm = 'down', eye = 'open', mouth = 'smile' } = {}) {
  const armPath = limb(hhArms[arm]);
  const legPaths = hhLegs[legs].map(limb);
  const e = hhEyes[eye];
  return {
    lines: [spikes, front, ...legPaths, armPath],
    fine: [coatEdge, ear, quills, hhMouths[mouth], ...e.fine],
    washes: [
      { c: PAL.terracotta, o: 0.55, d: coat },
      { c: PAL.slate, o: 0.3, d: coat },
      { c: PAL.ochre, o: 0.4, d: faceFill },
      { c: PAL.ochre, o: 0.4, d: `${armPath}Z${legPaths.join('Z')}Z` },
      { c: PAL.rose, o: 0.6, d: `${ear}Z${dot(29, -44, 3, 2.2)}` },
    ],
    whites: [],
    fills: [nose, ...(e.fill ? [e.fill] : [])],
    glints: [dot(41, -45.2, 0.8), ...(e.fill ? [dot(24.2, -52, 0.8)] : [])],
  };
}

// ---------------------------------------------------------------------------------------------
// The Hare: tall, long-eared, grey with pink inside his ears, sitting up on his big hind feet.
// His head is drawn on its own (centre 0,0, facing right) so it can tip back, droop or look up.
const head = 'M-19 1C-19 -11 -5 -17 7 -13C17 -10 21 -3 19 3C15 11 3 15 -7 13C-15 11 -19 7 -19 1Z';
const hNose = 'M19 1C21 -1 23 1 21 4Z';
const whiskers = 'M19 1l11 -3M19 3l11 2';
const earsUp = [
  [[-14, -10, 9], [-17, -28, 10], [-19, -46, 8], [-18, -61, 4]],
  [[-5, -13, 9], [-3, -31, 10], [0, -49, 8], [2, -62, 4]],
];
const earsBack = [
  [[-14, -10, 9], [-26, -24, 10], [-40, -34, 8], [-54, -38, 4]],
  [[-6, -13, 9], [-14, -30, 10], [-26, -44, 8], [-40, -52, 4]],
];
const earsFlop = [
  [[-14, -8, 9], [-28, -12, 10], [-42, -8, 8], [-52, 0, 4]],
  [[-8, -12, 9], [-22, -20, 10], [-38, -20, 8], [-50, -14, 4]],
];
const inner = (ear) => limb(ear.slice(0, -1).map(([x, y, w], i) => [x + (i ? 0 : 1), y, w * 0.38]).concat([[...ear.at(-1).slice(0, 2), 1.5]]));
const faces = {
  // laughing: eye squeezed shut, mouth wide open
  laugh: { fine: ['M-4 -3Q0 -10 5 -4', whiskers], mouth: 'M2 2C8 4 13 4 17 1C18 7 15 11 10 11C5 11 2 7 2 2Z' },
  // fright: big round eye, little round mouth
  shock: { fine: ['M-2 -4C-2 -12 10 -12 10 -4C10 4 -2 4 -2 -4Z', 'M-3 -14l8 -3', whiskers], white: 'M-2 -4C-2 -12 10 -12 10 -4C10 4 -2 4 -2 -4Z', pupil: dot(5, -5, 2), mouth: 'M11 8C11 4 16 4 16 8C16 12 11 12 11 8Z' },
  // tired out: droopy eyelid, tongue hanging out
  tired: { fine: ['M-1 -4C-1 -9 7 -9 7 -4C7 1 -1 1 -1 -4ZM-2 -5L8 -5', 'M7 5Q11 10 16 6', 'M19 1l8 2M19 3l7 5'], white: 'M-1 -5L7 -5C7 1 -1 1 -1 -5Z', pupil: dot(3.5, -2.5, 1.6), tongue: 'M11 8C10 15 12 19 15 18C18 17 16 12 15 8' },
  // proud sneer: half-closed eye, nose in the air, smug grin
  smug: { fine: ['M-1 -5C1 -8 6 -8 8 -5', 'M-1 -3Q3 -1 8 -3', 'M6 6Q12 9 18 4', whiskers], pupil: dot(4, -4.2, 1.6) },
};

function hareHead(face, ears) {
  const fc = faces[face];
  const E = { up: earsUp, back: earsBack, flop: earsFlop }[ears].map(limb);
  const I = { up: earsUp, back: earsBack, flop: earsFlop }[ears].map(inner);
  return {
    lines: [head, ...E, ...(fc.mouth ? [fc.mouth] : [])],
    fine: [...fc.fine, ...(fc.tongue ? [fc.tongue] : [])],
    washes: [
      { c: PAL.grey, o: 0.6, d: `${head}${E.join('Z')}Z` },
      { c: PAL.rose, o: 0.55, d: `${I.join('Z')}Z` },
      { c: PAL.rose, o: 0.8, d: hNose },
      ...(fc.mouth ? [{ c: PAL.red, o: 0.7, d: fc.mouth }] : []),
      ...(fc.tongue ? [{ c: PAL.rose, o: 0.85, d: `${fc.tongue}Z` }] : []),
    ],
    whites: fc.white ? [fc.white] : [],
    fills: fc.pupil ? [fc.pupil] : [],
    glints: [],
  };
}

// Sitting-up body (feet at y = 0, facing right)
const hBack = 'M-2 -74C-16 -68 -26 -44 -25 -22C-24 -8 -18 -1 -8 0';
const hFront = 'M17 -74C23 -62 22 -44 18 -30C16 -22 15 -14 16 -8';
const hHaunch = 'M-20 -12C-22 -28 -8 -36 2 -28C8 -22 8 -10 3 -3';
const hFoot = 'M-8 0L34 0C40 0 40 -7 33 -8L6 -8';
const hTail = 'M-24 -18C-32 -20 -32 -10 -25 -9';
const hFur = 'M-18 -64l-5 -4M-22 -54l-6 -2M-24 -42l-6 0';
const hBodyFill = 'M-2 -74C-16 -68 -26 -44 -25 -22C-24 -8 -18 -1 -8 0L34 0C40 0 40 -7 33 -8L16 -8C15 -14 16 -22 18 -30C22 -44 23 -62 17 -74Z';
const hBelly = 'M15 -66C21 -54 20 -40 16 -30C10 -38 9 -54 15 -66Z';
const hareArms = {
  // pointing down at something in front of him, the other paw on his hip
  point: [[[14, -58, 8], [26, -48, 7], [38, -38, 6], [48, -32, 5]], [[6, -60, 7], [-2, -50, 6], [-8, -40, 6]]],
  // both paws flung up in fright
  up: [[[16, -52, 8], [28, -54, 7], [40, -60, 8]], [[11, -58, 7], [20, -64, 6], [30, -72, 7]]],
  // holding his tummy as he laughs
  belly: [[[14, -58, 8], [22, -48, 7], [20, -38, 7]], [[8, -60, 7], [14, -50, 6], [12, -42, 6]]],
};

/** The Hare, sitting up. head: laugh | shock | tired | smug; ears: up | back | flop; arms: point | up | belly. */
export function hare({ face = 'laugh', ears = 'up', arms = 'belly', tilt = 0 } = {}) {
  const A = hareArms[arms].map(limb);
  const body = {
    lines: [hBack, hFront, hHaunch, hFoot, hTail, ...A],
    fine: [hFur, ...(arms === 'point' ? ['M50 -36l6 -1M49 -30l6 2'] : [])],
    washes: [{ c: PAL.grey, o: 0.6, d: `${hBodyFill}${A.join('Z')}Z` }],
    whites: [hBelly],
  };
  return merge(body, place(hareHead(face, ears), `translate(10 -88) rotate(${tilt})`));
}

// Lying flat out on his tummy, legs stretched behind and in front, chin on the grass (ground y = 0).
const lBody = 'M-46 -6C-52 -22 -36 -38 -8 -38C14 -38 30 -30 36 -18';
const lHaunch = 'M-40 -10C-42 -26 -24 -32 -16 -20';
const lBelly = 'M-44 -2C-20 2 8 2 30 -2';
const lHind = [[-38, -8, 16], [-58, -5, 12], [-76, -3, 9], [-96, -2, 9]];
const lFore = [[24, -4, 9], [40, -2, 7], [54, -1, 6], [62, -1, 6]];
const lTail = 'M-46 -18C-54 -22 -56 -12 -48 -10';

/** The Hare, flopped flat on the grass, tired out (but fine!). */
export function hareFlat() {
  const hind = limb(lHind);
  const fore = limb(lFore);
  const body = {
    lines: [lBody, lBelly, lHaunch, hind, fore, lTail],
    fine: ['M-4 -34l-2 -5M8 -33l0 -5', 'M66 -4l5 -1M66 1l5 1', 'M-100 -6l5 1M-100 0l5 0'],
    washes: [{ c: PAL.grey, o: 0.6, d: `${lBody}C40 -10 34 -2 30 -2C8 2 -20 2 -44 -2C-46 -4 -46 -5 -46 -6Z${hind}Z${fore}Z` }],
    whites: ['M-30 -4C-14 -10 10 -10 26 -6C10 -1 -14 -1 -30 -4Z'],
  };
  return merge(body, place(hareHead('tired', 'flop'), 'translate(46 -16) rotate(10)'));
}
