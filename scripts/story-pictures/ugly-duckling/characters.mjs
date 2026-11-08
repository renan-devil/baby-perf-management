import { PAL, transformPath } from '../lib.mjs';

// The Ugly Duckling: the characters shared by the ten pictures, drawn once here and placed in each
// picture with a transform (place). The build only draws files named <n>.mjs, so this file is not a
// picture. Every character faces right with its feet (or waterline) at y = 0; flip with scale(-1 1).

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

// ---------------------------------------------------------------------------------------------
// The grey duckling: a scruffy grey bird with a dark beak and a tuft on his head. head turns the
// head and neck about the base of the neck (positive = drooping forward, negative = looking up);
// legs adds his orange feet for standing on the ground (feet at y = 20).
const DUCK_PIVOT = '19 -22';
const dBody = 'M-38 -20C-32 -16 -26 -25 -10 -27C6 -29 18 -25 24 -17C30 -8 26 2 12 4C-2 6 -20 6 -30 0C-36 -4 -38 -12 -38 -20Z';
const dWing = 'M-27 -15C-17 -25 1 -23 10 -13C0 -7 -16 -7 -27 -15';
const dWingMarks = 'M-21 -12l7 1M-15 -14l7 1M-8 -14l6 2M-38 -20l-5 -5M-37 -17l-7 -1M-12 -24l2 -5M-4 -26l1 -5M-20 -21l1 -5';
const dNeck = 'M12 -24C14 -32 9 -38 11 -46C13 -55 28 -58 32 -48C34 -42 30 -36 28 -30C27 -26 27 -22 26 -18';
const dNeckFill = `${dNeck}L12 -18Z`;
const dBeak = 'M31 -50C37 -51 42 -49 45 -46C41 -42 35 -42 31 -43';
const dTuft = 'M16 -53l-4 -6M20 -55l0 -7M23 -54l4 -5';
const dEye = dot(24, -47, 3.4);
const dLegs = 'M-6 4L-8 18M-15 20L-8 17L-1 20M6 4L6 18M-1 20L6 17L13 20';
const dFeet = 'M-15 20L-8 17L-1 20ZM-1 20L6 17L13 20Z';

export function duckling({ head = 0, legs = false } = {}) {
  const h = (d) => transformPath(d, `rotate(${head} ${DUCK_PIVOT})`);
  return {
    lines: [dBody, dWing, h(dNeck), h(`${dBeak}`), ...(legs ? [dLegs] : [])],
    fine: [dWingMarks, h(dTuft), h(dEye)],
    washes: [
      { c: PAL.grey, o: 0.85, d: dBody + h(dNeckFill) },
      { c: PAL.slate, o: 0.35, d: `${dWing}Z` },
      { c: PAL.slate, o: 0.7, d: h(`${dBeak}Z`) },
      ...(legs ? [{ c: PAL.terracotta, o: 0.75, d: dFeet }] : []),
    ],
    whites: [h(dEye)],
    fills: [h(dot(25, -47, 2))],
    glints: [h(dot(24.3, -47.8, 0.7))],
  };
}

// ---------------------------------------------------------------------------------------------
// Mother duck: a smooth brown duck with an ochre beak, half as big again as the grey duckling.
const mBody = 'M-52 -26C-44 -22 -38 -33 -16 -35C6 -37 24 -31 32 -20C40 -10 34 2 18 5C0 8 -28 7 -40 0C-48 -6 -52 -16 -52 -26Z';
const mWing = 'M-37 -18C-23 -33 0 -31 13 -17C1 -9 -22 -9 -37 -18';
const mWingMarks = 'M-30 -15l9 1M-22 -17l9 1M-13 -18l8 2';
const mNeck = 'M16 -31C18 -41 13 -49 15 -57C17 -68 34 -70 38 -59C40 -51 36 -45 34 -39C33 -35 33 -31 32 -25';
const mBeak = 'M37 -61C45 -62 52 -59 55 -55C50 -51 42 -52 37 -54';
const mEye = dot(28, -59, 3.4);

export function motherDuck({ surprised = false } = {}) {
  return {
    lines: [mBody, mWing, mNeck, mBeak],
    fine: [mWingMarks, surprised ? dot(28, -59, 4.2) : mEye, surprised ? 'M22 -67q6 -5 12 -1' : 'M23 -64q5 -3 10 0'],
    washes: [
      { c: PAL.terracotta, o: 0.55, d: `${mBody}${mNeck}L16 -25Z` },
      { c: PAL.ochre, o: 0.55, d: `${mWing}Z` },
      { c: PAL.ochre, o: 0.85, d: `${mBeak}Z` },
    ],
    whites: [surprised ? dot(28, -59, 4.2) : mEye],
    fills: [dot(surprised ? 28 : 29, -59, surprised ? 1.6 : 2)],
    glints: [dot(28.4, -59.8, 0.6)],
  };
}

// A little yellow duckling, a third of the grey duckling's size.
const yBody = 'M-14 -8C-12 -4 -8 -12 0 -12C8 -12 12 -8 12 -4C12 1 6 2 0 2C-8 2 -14 0 -14 -8Z';
const yHead = 'M3 -11C0 -19 4 -25 10 -24C16 -23 17 -16 13 -11';
const yBeak = 'M15 -20L21 -18L15 -16Z';

export function littleDuckling() {
  return {
    lines: [yBody, yHead],
    fine: [yBeak, 'M-6 -6q4 2 8 0'],
    washes: [
      { c: PAL.ochre, o: 0.85, d: `${yBody}${yHead}Z` },
      { c: PAL.terracotta, o: 0.8, d: yBeak },
    ],
    fills: [dot(11, -19, 1.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// A white swan swimming: paper and ink, with a faint grey shade under the wing. neck 'up' (proud,
// S-shaped) or 'bow' (head bent low in front). cut is the outline to leave out of the water wash.
const sBody = 'M-62 -30C-54 -24 -48 -38 -28 -42C-8 -46 14 -40 26 -28C34 -18 32 -4 18 0C-4 4 -38 4 -50 -4C-58 -10 -62 -20 -62 -30Z';
const sWing = 'M-52 -27C-38 -48 -4 -50 16 -32C0 -22 -28 -18 -52 -27';
const sWingMarks = 'M-52 -27l-6 -8M-46 -33l-4 -9M-40 -24l10 1M-30 -23l10 1M-20 -23l9 0';
const sShade = 'M-58 -14C-40 -6 0 -4 26 -12C24 -2 16 1 10 2C-10 4 -38 3 -50 -4ZM-50 -26C-28 -18 0 -22 16 -32C6 -22 -24 -16 -50 -26Z';
const NECKS = {
  up: {
    neck: 'M14 -36C22 -48 16 -60 12 -70C6 -86 18 -100 32 -99C40 -98 45 -94 45 -89C45 -86 41 -85 37 -86C31 -87 24 -82 23 -74C22 -64 30 -54 28 -40C27 -34 27 -30 26 -26',
    beak: 'M44 -94C50 -94 56 -91 60 -86C54 -85 48 -86 44 -88Z',
    knob: dot(45, -92, 2.3),
    eye: dot(36, -93, 1.8),
  },
  bow: {
    neck: 'M14 -36C16 -54 28 -68 44 -68C56 -68 63 -60 62 -50C61 -45 57 -42 53 -44C50 -46 50 -54 44 -55C36 -56 30 -48 29 -40C28 -34 27 -30 26 -26',
    beak: 'M61 -48C63 -42 62 -36 59 -31C56 -36 55 -40 55 -44Z',
    knob: dot(59, -48, 2.3),
    eye: dot(54, -58, 1.8),
  },
};

export function swan({ neck = 'up', young = false } = {}) {
  const n = NECKS[neck];
  return {
    lines: [sBody, sWing, n.neck, n.beak],
    fine: [sWingMarks],
    washes: [
      { c: young ? PAL.grey : PAL.sky, o: young ? 0.3 : 0.18, d: sShade },
      { c: PAL.terracotta, o: 0.85, d: n.beak },
    ],
    fills: [n.knob, n.eye],
  };
}
/** The swan's outline, to cut out of a water wash (fill-rule evenodd). */
export const swanCut = (neck = 'up') => `${sBody}${NECKS[neck].neck}L14 -36Z`;

// A swan flying (centre of the body at 0,0, flying right), long neck stretched out, wings raised.
const flBody = 'M-52 2C-44 -10 -14 -14 8 -12C22 -11 34 -8 44 -7C56 -7 64 -10 72 -12C78 -13 83 -9 81 -5C79 -2 73 -1 66 -1C54 0 42 4 30 10C10 18 -30 18 -52 2Z';
const flTail = 'M-52 2L-64 -4L-62 8Z';
const flBeak = 'M81 -9C87 -9 93 -7 96 -5C91 -3 86 -3 81 -4Z';
const flWingNear = 'M-6 -12C-14 -36 -30 -58 -56 -70C-52 -62 -54 -56 -50 -50C-58 -52 -66 -50 -72 -46C-64 -40 -60 -36 -56 -32C-62 -30 -66 -26 -68 -22C-50 -20 -34 -16 -22 -12';
const flWingFar = 'M10 -12C12 -32 22 -50 38 -62C38 -50 36 -40 34 -32C32 -24 28 -16 24 -10';
const flMarks = 'M-50 -50l-5 9M-56 -32l-3 8M-40 -38l-8 8M-30 -30l-10 8M-40 12l-14 8M-36 14l-10 10';
const flShade = 'M-46 6C-26 14 10 14 30 8C40 4 52 0 64 -1C52 1 42 5 30 10C10 18 -30 18 -46 6ZM-56 -32C-48 -26 -36 -18 -22 -12C-34 -16 -50 -20 -68 -22C-66 -26 -62 -30 -56 -32ZM10 -12C12 -32 22 -50 38 -62C38 -50 36 -40 34 -32C32 -24 28 -16 24 -10Z';
/** The flying swan's outline, to cut out of a sky wash (fill-rule evenodd). */
export const flyingCut = `${flBody}${flWingNear}Z`;

export function flyingSwan({ grey = false } = {}) {
  return {
    lines: [flBody, flTail, flWingNear, flWingFar, flBeak],
    fine: [flMarks],
    washes: [
      { c: PAL.grey, o: grey ? 0.42 : 0.22, d: grey ? `${flBody}${flWingNear}Z${flWingFar}Z` : flShade },
      ...(grey ? [{ c: PAL.grey, o: 0.25, d: flShade }] : []),
      { c: PAL.terracotta, o: 0.85, d: flBeak },
    ],
    fills: [dot(81.5, -7, 1.8), dot(75, -8.5, 1.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// A fat brown hen with a red comb. laughing closes her eye into a smile and opens her beak.
const hBody = 'M-28 -40C-34 -50 -36 -62 -32 -70C-26 -60 -18 -54 -6 -54C2 -54 8 -58 10 -64C12 -74 26 -76 29 -66C31 -60 27 -54 27 -48C32 -34 26 -16 8 -12C-8 -8 -24 -18 -28 -40Z';
const hTailFill = 'M-32 -70C-38 -80 -46 -78 -48 -71C-42 -67 -38 -60 -31 -52ZM-31 -64C-44 -68 -50 -60 -48 -54C-42 -54 -36 -50 -30 -45Z';
const hTail = 'M-32 -70C-38 -80 -46 -78 -48 -71C-42 -67 -38 -60 -31 -52M-31 -64C-44 -68 -50 -60 -48 -54C-42 -54 -36 -50 -30 -45';
const hWing = 'M-16 -40C-6 -48 10 -46 14 -34C2 -26 -10 -28 -16 -40';
const hComb = 'M13 -72C11 -80 17 -81 18 -75C19 -82 24 -82 24 -75C26 -80 31 -77 27 -70Z';
const hWattle = 'M28 -61C30 -56 27 -53 26 -58Z';
const hLegs = 'M-4 -11L-6 0M-12 1L-6 0L0 1M6 -12L6 0M0 1L6 0L12 1';

export function hen({ laughing = false } = {}) {
  const beak = laughing ? 'M29 -70L37 -70L29 -66ZM29 -64L36 -59L28 -61Z' : 'M29 -68L36 -66L29 -63Z';
  const eye = dot(21, -67, 2.8);
  return {
    lines: [hBody, hTail, hWing, hLegs, hComb],
    fine: [hWattle, beak, laughing ? 'M18 -68q3.5 -3.5 7 0' : eye, 'M-8 -38l8 1M-2 -40l8 1'],
    washes: [
      { c: PAL.ochre, o: 0.6, d: hBody + hTailFill },
      { c: PAL.terracotta, o: 0.5, d: `${hWing}Z${hTailFill}` },
      { c: PAL.red, o: 0.8, d: hComb + hWattle },
      { c: PAL.ochre, o: 0.9, d: beak },
    ],
    whites: laughing ? [] : [eye],
    fills: laughing ? [] : [dot(21.6, -67, 1.6)],
  };
}

// ---------------------------------------------------------------------------------------------
// A child (the farmer's little girl), facing right: round face, ochre hair in a bob, a red dress.
// pose 'sit' (on the floor, arm held out) or 'wave' (standing, one arm up).
const cHead = 'M-12 -84C-12 -96 -2 -102 6 -100C16 -98 20 -90 18 -82C16 -74 8 -70 0 -71C-8 -72 -12 -78 -12 -84Z';
const cHair = 'M-14 -80C-18 -94 -8 -106 6 -104C18 -102 22 -92 19 -86C12 -88 6 -94 4 -98C0 -92 -6 -88 -11 -86Z';
const cFace = 'M10 -80q3 2 6 -1';
export function child({ pose = 'wave' } = {}) {
  if (pose === 'sit') {
    const dress = 'M-6 -70C-14 -56 -18 -30 -22 -4C-6 0 10 0 18 -4C16 -30 12 -56 6 -70';
    const legs = 'M14 -13L52 -12M14 -3L52 -2';
    const shoes = 'M52 -14C60 -17 65 -10 63 -2C59 0 55 0 52 -1Z';
    const arm = limb([[4, -62, 7], [18, -56, 6], [30, -52, 5], [40, -50, 5]]);
    return {
      lines: [cHead, dress, legs, arm, shoes],
      fine: [cHair, cFace],
      washes: [
        { c: PAL.rose, o: 0.4, d: `${cHead}${arm}Z` },
        { c: PAL.ochre, o: 0.7, d: cHair },
        { c: PAL.red, o: 0.65, d: `${dress}Z` },
        { c: PAL.slate, o: 0.45, d: 'M14 -13L52 -12L52 -2L14 -3Z' },
        { c: PAL.slate, o: 0.7, d: shoes },
      ],
      fills: [dot(9, -86, 1.7)],
    };
  }
  const dress = 'M-6 -70C-14 -56 -18 -40 -20 -28C-6 -24 10 -24 20 -28C16 -42 12 -58 6 -70';
  const legs = 'M-6 -26L-7 -4M8 -26L9 -4M-13 -2C-12 -6 -6 -6 -5 -3ZM6 -3C7 -6 14 -6 15 -2Z';
  const armUp = limb([[6, -64, 6], [16, -76, 5], [22, -92, 5], [24, -100, 5]]);
  const armDown = 'M-6 -64C-12 -54 -14 -46 -14 -40';
  return {
    lines: [cHead, dress, legs, armUp, armDown],
    fine: [cHair, cFace, 'M30 -106q4 4 3 10M33 -112q7 6 6 16'],
    washes: [
      { c: PAL.rose, o: 0.4, d: `${cHead}${armUp}Z` },
      { c: PAL.ochre, o: 0.7, d: cHair },
      { c: PAL.red, o: 0.65, d: `${dress}Z` },
    ],
    fills: [dot(9, -86, 1.7)],
  };
}
