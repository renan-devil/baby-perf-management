import { PAL, transformPath } from '../lib.mjs';

// The Little Red Hen: the hen, the cat, the dog, the duck and the chicks shared by the two pictures, drawn once
// here and placed in each picture with a transform (place). The build only draws files named <n>.mjs,
// so this file is not a picture. Every character stands with its feet at y = 0.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

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

// A character: { lines: [d], fine: [d], washes: [{c, o, d}], whites: [d], fills: [d], glints: [d] }.
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

const mirror = (pts) => pts.map(([x, y, w]) => [-x, y, w]);
const close = (list) => list.map((d) => `${d}Z`).join('');

// ---------------------------------------------------------------------------------------------
// The Little Red Hen: a plump terracotta hen seen from the side, facing right, with a red comb and
// wattle, an ochre beak and legs, a kind eye under a determined brow, and her tail up. Feet at (0,0),
// about 110 tall. wing: 'fold' (resting), 'up' (held up in front, as if showing something) or
// 'out' (held forward, as if carrying). henWingTip(pose) says where the tip of the wing is.
const hBody =
  'M28 -72C33 -86 30 -100 20 -101C10 -102 5 -94 7 -84C3 -76 -8 -70 -18 -70C-24 -78 -32 -90 -40 -96C-47 -80 -48 -62 -40 -44C-34 -26 -18 -16 0 -16C20 -16 34 -26 36 -44C37 -58 31 -64 28 -72Z';
const hTail = 'M-40 -96C-38 -86 -34 -79 -27 -74M-45 -84C-41 -76 -37 -70 -31 -66M-47 -70C-44 -64 -40 -60 -35 -57';
const hComb = 'M12 -99C9 -106 14 -111 17 -105C18 -112 25 -112 24 -104C28 -109 33 -104 28 -98C23 -100 17 -101 12 -99Z';
const hBeak = 'M31 -94L43 -89L31 -84';
const hWattle = 'M30 -84C34 -79 32 -73 28 -75C25 -77 26 -82 29 -85Z';
const hBreast = 'M20 -54q3 3 6 0M12 -44q3 3 6 0M24 -40q3 3 6 0M4 -32q3 3 6 0M16 -28q3 3 6 0M-28 -40q3 3 6 0M-20 -30q3 3 6 0';
const hLegs = [limb([[-6, -18, 5], [-7, -1, 3.6]]), limb([[9, -18, 5], [10, -1, 3.6]])];
const hToes = 'M-7 -1l-9 1M-7 -1l-1 3M-7 -1l8 1M10 -1l-7 1M10 -1l1 3M10 -1l9 1';
// One wing drawn pointing right from its shoulder at (0,0), with a scalloped lower edge
const hWing = 'M-4 -6C10 -12 30 -11 42 -5C46 -2 44 3 39 3C37 7 31 8 28 5C25 9 18 9 15 6C10 9 2 9 -4 5C-8 2 -8 -3 -4 -6Z';
const hWingMarks = 'M14 6C18 1 24 -1 30 -3M28 5C32 2 36 0 40 -1M2 6C6 1 10 -1 16 -2';
const WING = {
  fold: 'translate(14 -56) scale(-0.95 0.95) rotate(-8)',
  up: 'translate(6 -56) rotate(-22)',
  out: 'translate(6 -54) rotate(-4)',
};
export const henWingTip = (pose) => {
  const p = transformPath('M44 0', WING[pose]).split(' ');
  return [Number(p[1]), Number(p[2])];
};

export function hen({ wing = 'fold' } = {}) {
  const w = (d) => transformPath(d, WING[wing]);
  return {
    lines: [hBody, hComb, hBeak, ...hLegs, w(hWing)],
    fine: [hTail, hBreast, hToes, w(hWingMarks), 'M17 -97Q21 -99 26 -97', 'M31 -89L38 -89'],
    washes: [
      { c: PAL.terracotta, o: 0.8, d: hBody },
      { c: PAL.terracotta, o: 0.85, d: w(hWing) },
      { c: PAL.red, o: 0.35, d: `${w(hWing)}M-40 -96C-47 -80 -48 -62 -40 -50C-34 -60 -30 -70 -24 -76Z` },
      { c: PAL.red, o: 0.85, d: `${hComb}${hWattle}` },
      { c: PAL.ochre, o: 0.9, d: `${hBeak}Z${close(hLegs)}` },
      { c: PAL.rose, o: 0.7, d: dot(23, -85, 3.2) },
    ],
    whites: [dot(21.5, -92, 3.6)],
    fills: [dot(22.3, -92, 2.2)],
    glints: [dot(21.6, -92.8, 0.75)],
  };
}

/** One grain of wheat (centre 0,0), lying along the x axis. */
export function grain() {
  const g = 'M-6 0C-6 -4 -2 -5 2 -4C6 -3 7 0 6 2C4 5 -2 5 -5 3C-6 2 -6 1 -6 0Z';
  return {
    lines: [g],
    fine: ['M-4 0C-1 1 2 1 5 0'],
    washes: [{ c: PAL.ochre, o: 0.95, d: g }],
  };
}

/** A stalk of ripe wheat, base at (0,0), about 70 tall. */
export function wheat() {
  const stem = 'M0 0C1 -20 2 -40 4 -56';
  let ear = '';
  let marks = '';
  for (let i = 0; i < 6; i++) {
    const y = -46 - i * 4.4;
    const x = 3 + i * 0.4;
    ear += `M${f(x)} ${f(y)}C${f(x - 6)} ${f(y - 2)} ${f(x - 7)} ${f(y - 7)} ${f(x - 1)} ${f(y - 6)}Z`;
    ear += `M${f(x + 0.6)} ${f(y)}C${f(x + 6.6)} ${f(y - 2)} ${f(x + 7.6)} ${f(y - 7)} ${f(x + 1.6)} ${f(y - 6)}Z`;
    marks += `M${f(x - 5)} ${f(y - 5)}l-4 -6M${f(x + 6)} ${f(y - 5)}l4 -6`;
  }
  ear += 'M5.5 -72C3 -74 3 -78 5.5 -80C8 -78 8 -74 5.5 -72Z';
  return {
    lines: [stem],
    fine: [ear, marks, 'M2 -26C-4 -30 -8 -30 -12 -26M3 -34C8 -38 12 -38 15 -34'],
    washes: [
      { c: PAL.ochre, o: 0.85, d: ear },
      { c: PAL.green, o: 0.5, d: 'M2 -26C-4 -30 -8 -30 -12 -26C-8 -27 -4 -26 2 -24ZM3 -34C8 -38 12 -38 15 -34C11 -35 7 -34 3 -32Z' },
    ],
  };
}

/** A little yellow chick, facing right, feet at (0,0), about 20 tall. */
export function chick() {
  const body = 'M-9 -9C-10 -16 -4 -19 1 -18C2 -24 8 -25 11 -21C13 -18 11 -14 9 -12C10 -6 6 -2 0 -2C-6 -2 -9 -5 -9 -9Z';
  return {
    lines: [body],
    fine: ['M11 -20L16 -18L11 -16', 'M-2 -2L-2 0M3 -2L3 0M-4 0L0 0M1 0L5 0', 'M-6 -10q4 3 8 0'],
    washes: [
      { c: PAL.ochre, o: 0.75, d: body },
      { c: PAL.terracotta, o: 0.85, d: 'M11 -20L16 -18L11 -16Z' },
    ],
    fills: [dot(7.5, -20, 1.2)],
  };
}

// ---------------------------------------------------------------------------------------------
// The Cat: a lazy grey cat with ochre stripes. Its round face looks at us (centre 0,0 in catFace).
// pose 'sleep' (curled up on the ground, eyes shut, tail wrapped round) or 'run' (bounding to the
// right, eyes wide, tongue out). Feet at (0,0).
const cHead = 'M-14 0C-14 -10 -7 -13 0 -13C7 -13 14 -10 14 0C14 8 7 12 0 12C-7 12 -14 8 -14 0Z';
const cEars = 'M-12 -6L-12 -21L-3 -12M3 -12L12 -21L12 -6';
const cEarsFill = 'M-12 -6L-12 -21L-3 -12ZM3 -12L12 -21L12 -6Z';
const cStripesHead = 'M-3 -12l1 5M0 -13l0 6M3 -12l-1 5';
const cWhiskers = 'M-7 5l-13 -2M-7 7l-12 4M7 5l13 -2M7 7l12 4';

function catFace(open) {
  const eyes = open ? [dot(-5, -2, 3.2), dot(5, -2, 3.2)] : [];
  return {
    lines: [cHead, cEars],
    fine: [
      cStripesHead,
      cWhiskers,
      open ? 'M0 5q-3 4 -6 1M0 5q3 4 6 1' : 'M-9 -2q3 3 7 0M2 -2q3 3 7 0M0 5q-3 3 -5 1M0 5q3 3 5 1',
      ...eyes,
    ],
    washes: [
      { c: PAL.grey, o: 0.85, d: `${cHead}${cEarsFill}` },
      { c: PAL.rose, o: 0.75, d: 'M-9 -9L-10 -17L-5 -11ZM9 -9L10 -17L5 -11ZM-2 3L2 3L0 5Z' },
      { c: PAL.ochre, o: 0.85, d: 'M-4 -12l2 6l1 0l-1 -7ZM-1 -13l0 6l2 0l0 -6ZM3 -12l-2 6l1 0l3 -6Z' },
      ...(open ? [{ c: PAL.rose, o: 0.95, d: 'M-3 7C-3 13 3 13 3 7Z' }] : []),
    ],
    whites: eyes,
    fills: open ? [dot(-4.5, -1.6, 1.8), dot(5.5, -1.6, 1.8)] : [],
    glints: open ? [dot(-5.2, -2.4, 0.6), dot(4.8, -2.4, 0.6)] : [],
  };
}
const merge = (...parts) => {
  const out = { lines: [], fine: [], washes: [], whites: [], fills: [], glints: [] };
  for (const p of parts) for (const k of Object.keys(out)) out[k].push(...(p[k] ?? []));
  return out;
};

export function cat({ pose = 'sleep' } = {}) {
  if (pose === 'sleep') {
    const body = 'M-40 0C-46 -20 -26 -34 -2 -32C20 -30 34 -20 34 -4L34 0Z';
    const tail = limb([[-38, -4, 8], [-30, 3, 7], [-10, 5, 6.5], [8, 3, 6]]);
    const stripes = 'M-26 -27C-22 -20 -22 -12 -24 -6M-12 -31C-8 -22 -8 -14 -10 -8M2 -31C6 -24 6 -16 4 -10';
    return merge(
      {
        lines: [body, tail],
        fine: [stripes, 'M-30 3l3 4M-18 5l2 4M-6 5l1 4'],
        washes: [
          { c: PAL.grey, o: 0.85, d: `${body}${tail}Z` },
          { c: PAL.ochre, o: 0.85, d: 'M-26 -27C-22 -20 -22 -12 -24 -6L-20 -6C-18 -12 -18 -20 -22 -28ZM-12 -31C-8 -22 -8 -14 -10 -8L-6 -8C-4 -14 -4 -22 -8 -32ZM2 -31C6 -24 6 -16 4 -10L8 -10C10 -16 10 -24 6 -31Z' },
        ],
      },
      place(catFace(false), 'translate(26 -14) rotate(14)'),
    );
  }
  // bounding to the right: front legs reaching forward, back legs pushing off, tail up
  const body = 'M-30 -30C-32 -42 -12 -46 8 -44C22 -42 30 -36 28 -26C26 -18 10 -16 -10 -18C-24 -18 -30 -22 -30 -30Z';
  const legs = [
    limb([[16, -24, 8], [30, -14, 6.5], [42, -8, 6]]),
    limb([[10, -22, 8], [22, -8, 6.5], [32, -2, 6]]),
    limb([[-22, -24, 9], [-34, -14, 7], [-46, -10, 6]]),
    limb([[-16, -22, 9], [-24, -8, 7], [-34, -1, 6]]),
  ];
  const tail = limb([[-28, -34, 7], [-40, -46, 6], [-40, -62, 6], [-32, -68, 5.5]]);
  const stripes = 'M-20 -43C-18 -36 -18 -28 -20 -20M-8 -45C-6 -38 -6 -28 -8 -18M4 -44C6 -36 6 -26 4 -18';
  return merge(
    {
      lines: [...legs, tail, body],
      fine: [stripes],
      washes: [
        { c: PAL.grey, o: 0.85, d: `${body}${close(legs)}${tail}Z` },
        { c: PAL.ochre, o: 0.85, d: 'M-20 -43C-18 -36 -18 -28 -20 -20L-16 -20C-14 -28 -14 -36 -16 -44ZM-8 -45C-6 -38 -6 -28 -8 -18L-4 -18C-2 -28 -2 -38 -4 -45ZM4 -44C6 -36 6 -26 4 -18L8 -18C10 -26 10 -36 8 -43Z' },
      ],
    },
    place(catFace(true), 'translate(30 -46) rotate(-8)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The Dog: a big sleepy ochre dog with long floppy terracotta ears and a pale muzzle. Its face looks
// at us (centre 0,0 in dogFace). pose 'lie' (lying with his chin on his paws, eyes half shut) or
// 'run' (galloping to the right, ears flying, tongue out). Feet at (0,0).
const gHead = 'M-14 -2C-15 -14 -8 -19 0 -19C8 -19 15 -14 14 -2C13 8 7 12 0 12C-7 12 -13 8 -14 -2Z';
const gMuzzle = 'M-8 5C-8 -2 8 -2 8 5C8 11 -8 11 -8 5Z';

function dogFace(open, flying = false) {
  const earL = flying
    ? 'M-11 -14C-20 -20 -30 -18 -34 -10C-28 -10 -20 -8 -13 -6Z'
    : 'M-11 -15C-22 -15 -27 2 -21 11C-16 13 -13 6 -13 -3Z';
  const earR = flying
    ? 'M11 -14C18 -22 28 -24 34 -18C28 -14 20 -10 13 -6Z'
    : 'M11 -15C22 -15 27 2 21 11C16 13 13 6 13 -3Z';
  const eyes = open ? [dot(-5, -6, 3.2), dot(5, -6, 3.2)] : [];
  return {
    lines: [gHead, earL, earR],
    fine: [
      gMuzzle,
      open ? 'M0 4L0 7M0 7q-3 3 -6 1M0 7q3 3 6 1' : 'M0 4L0 7M0 7q-3 2 -5 0M0 7q3 2 5 0',
      open ? '' : 'M-9 -6q4 -2 7 0M2 -6q4 -2 7 0M-8 -5q3 2 6 0M3 -5q3 2 6 0',
      ...eyes,
    ].filter(Boolean),
    washes: [
      { c: PAL.ochre, o: 0.8, d: gHead },
      { c: PAL.terracotta, o: 0.85, d: `${earL}${earR}` },
      ...(open ? [{ c: PAL.rose, o: 0.95, d: 'M-3 9C-4 18 4 18 3 9Z' }] : []),
    ],
    whites: [gMuzzle, ...eyes],
    fills: [dot(0, 2, 2.6), ...(open ? [dot(-4.5, -5.6, 1.8), dot(5.5, -5.6, 1.8)] : [])],
    glints: open ? [dot(-5.2, -6.4, 0.6), dot(4.8, -6.4, 0.6), dot(-0.8, 1.2, 0.7)] : [dot(-0.8, 1.2, 0.7)],
  };
}

export function dog({ pose = 'lie' } = {}) {
  if (pose === 'lie') {
    const body = 'M-48 0C-50 -18 -34 -30 -12 -28C8 -26 18 -18 20 -6L20 0Z';
    const tail = limb([[-46, -6, 6], [-58, -4, 5], [-66, 0, 4.5]]);
    const paws = 'M-4 0C-6 -8 8 -10 11 -3C12 1 2 1 -4 0ZM16 0C14 -8 28 -10 31 -3C32 1 22 1 16 0Z';
    return merge(
      {
        lines: [tail, body, paws],
        fine: ['M-28 -18q4 2 8 0M-38 -10q3 2 6 0', 'M2 -1l1 -3M6 -1l1 -3M22 -1l1 -3M26 -1l1 -3'],
        washes: [
          { c: PAL.ochre, o: 0.8, d: `${body}${tail}Z` },
          { c: PAL.terracotta, o: 0.5, d: 'M-30 -28C-20 -32 -8 -28 -4 -22C-14 -20 -24 -22 -30 -28Z' },
          { c: PAL.ochre, o: 0.6, d: paws },
        ],
      },
      place(dogFace(false), 'translate(13 -17) scale(1.2)'),
    );
  }
  const body = 'M-34 -34C-36 -46 -14 -50 8 -48C24 -46 32 -40 30 -30C28 -20 12 -18 -12 -20C-28 -20 -34 -24 -34 -34Z';
  const legs = [
    limb([[18, -26, 10], [32, -16, 8], [44, -10, 7]]),
    limb([[12, -24, 10], [24, -10, 8], [34, -3, 7]]),
    limb([[-24, -26, 11], [-38, -16, 8], [-50, -12, 7]]),
    limb([[-18, -24, 11], [-26, -10, 8], [-36, -2, 7]]),
  ];
  const tail = limb([[-32, -38, 6], [-44, -48, 5], [-50, -56, 4.5]]);
  return merge(
    {
      lines: [...legs, tail, body],
      fine: ['M-14 -44q4 2 8 0'],
      washes: [{ c: PAL.ochre, o: 0.8, d: `${body}${close(legs)}${tail}Z` }, { c: PAL.terracotta, o: 0.5, d: 'M-20 -48C-10 -52 4 -48 8 -42C-2 -40 -14 -42 -20 -48Z' }],
    },
    place(dogFace(true, true), 'translate(34 -48) rotate(-6)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The Duck: a plump white duck with an ochre bill and feet, a sky-blue wing and a curl on her tail,
// facing right. pose 'sit' (sitting lazily, eyes half shut) or 'run' (waddling fast, wings flapping,
// bill open). Feet at (0,0).
const kBody = 'M-34 -24C-40 -28 -42 -36 -37 -38C-30 -32 -20 -34 -6 -32C8 -30 18 -24 20 -12C20 -2 8 2 -10 2C-26 2 -34 -10 -34 -24Z';
const kNeck = 'M2 -30C6 -34 4 -40 5 -46C6 -54 12 -57 17 -56C23 -55 26 -49 24 -43C22 -38 18 -37 17 -33C17 -30 18 -28 19 -24';
const kBill = 'M23 -48C30 -50 37 -47 37 -44C35 -41 29 -41 23 -42';
const kBillOpen = 'M23 -48C30 -52 37 -51 38 -49C33 -46 28 -46 24 -46M24 -44C29 -42 34 -40 37 -38C33 -36 27 -38 23 -41';
const kWing = 'M-24 -18C-14 -26 2 -24 8 -14C0 -8 -14 -8 -24 -18';
const kWingUp = 'M-6 -26C-14 -40 -30 -52 -40 -54C-38 -46 -34 -40 -30 -36C-34 -34 -34 -30 -30 -28C-22 -24 -12 -22 -6 -26';

export function duck({ pose = 'sit' } = {}) {
  const run = pose === 'run';
  const wing = run ? kWingUp : kWing;
  const bill = run ? kBillOpen : kBill;
  const feet = run
    ? 'M-6 0L-12 10L-20 12L-14 14L-4 12ZM8 0L10 10L4 14L12 14L18 11Z'
    : 'M-2 2L8 0L14 3L6 5Z';
  const legs = run ? 'M-6 0L-10 10M8 0L10 10' : '';
  const eye = dot(17, -48, run ? 3.2 : 2.8);
  return {
    lines: [kBody, kNeck, bill, wing, ...(legs ? [legs] : [])],
    fine: [
      feet,
      'M-37 -38C-42 -42 -40 -48 -35 -46',
      run ? 'M-30 -36l6 -4M-22 -30l8 -4' : 'M-18 -16l7 1M-11 -18l7 1',
      ...(run ? [eye] : ['M14 -48q3 2 6 0', 'M14 -49q3 -1 6 0']),
    ],
    washes: [
      { c: PAL.sky, o: 0.3, d: `${kBody}${kNeck}L2 -24Z` },
      { c: PAL.sky, o: 0.7, d: `${wing}Z` },
      { c: PAL.ochre, o: 0.95, d: `${run ? kBillOpen.replace('M24 -44', 'ZM24 -44') : kBill}Z${feet}` },
      ...(run ? [{ c: PAL.red, o: 0.5, d: 'M24 -46C28 -46 33 -46 38 -49L37 -38C33 -40 28 -42 24 -44Z' }] : []),
    ],
    whites: run ? [eye] : [],
    fills: run ? [dot(18, -48, 1.8)] : [],
    glints: run ? [dot(17.3, -48.8, 0.6)] : [],
  };
}

// ---------------------------------------------------------------------------------------------
// The Little Red Hen's bread: a big round golden loaf (centre 0,0, about 52 wide) with curls of steam.
export function loaf({ steam = true } = {}) {
  const l = 'M-26 6C-30 -10 -16 -24 0 -24C16 -24 30 -10 26 6C18 12 -18 12 -26 6Z';
  const s = 'M-10 -30c-6 -6 6 -10 0 -16c-6 -6 6 -10 0 -16M4 -32c-6 -6 6 -10 0 -16c-6 -6 6 -10 0 -16c-6 -6 6 -10 0 -14M16 -28c-6 -6 6 -10 0 -16c-6 -6 6 -10 0 -14';
  return {
    lines: [l],
    fine: ['M-16 -12q6 -6 12 -4M-6 -16q6 -6 12 -4M4 -10q6 -6 12 -4', ...(steam ? [s] : [])],
    washes: [
      { c: PAL.ochre, o: 0.95, d: l },
      { c: PAL.terracotta, o: 0.55, d: 'M-24 -2C-24 -14 -14 -24 0 -24C14 -24 24 -14 24 -2C14 -10 -14 -10 -24 -2Z' },
    ],
    glints: ['M-14 -14q4 -4 8 -4q-4 2 -8 4Z'],
  };
}

// A round clay bread oven (bottom centre 0,0, about 100 wide), with the fire glowing inside.
export function oven() {
  const dome = 'M-52 0L-52 -34C-52 -84 52 -84 52 -34L52 0Z';
  const door = 'M-24 0L-24 -26C-24 -46 24 -46 24 -26L24 0Z';
  const flames = 'M-16 0C-18 -10 -10 -14 -10 -22C-4 -16 -2 -10 0 -6C2 -14 6 -20 8 -28C12 -18 18 -10 16 0Z';
  return {
    lines: [dome, door],
    fine: [flames, 'M-44 -30l10 2M-40 -52l9 4M34 -56l8 -4M38 -26l10 -2M-12 -68l6 2M12 -66l7 -2', 'M-58 0L58 0'],
    washes: [
      { c: PAL.terracotta, o: 0.7, d: `${dome}${door}`, rule: 'evenodd' },
      { c: PAL.slate, o: 0.75, d: door },
      { c: PAL.red, o: 0.85, d: flames },
      { c: PAL.ochre, o: 0.9, d: 'M-10 0C-10 -6 -6 -10 -4 -14C0 -8 4 -12 6 -16C8 -8 10 -4 10 0Z' },
    ],
  };
}
