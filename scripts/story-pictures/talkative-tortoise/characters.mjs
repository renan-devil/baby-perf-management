import { PAL, transformPath } from '../lib.mjs';

// The Talkative Tortoise: the two characters, drawn once here and placed in every picture.
// A character is { lines, fine, washes: [{c, o, d}], whites, fills, glints }, all lists of path data
// in the character's own coordinates; place() moves it into a picture and compose() builds the drawing.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (circle as path data, so it can be placed like any other shape). */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x + r)} ${f(y)}A${r} ${r} 0 1 0 ${f(x - r)} ${f(y)}Z`;

// A smooth limb (leg) along a centreline of [x, y, width] points, open at the root.
function limb(pts) {
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
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k]);
  const tags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: tags([...lines, ...all('lines')]),
    fine: tags([...fine, ...all('fine')]),
    once,
    fills: tags(all('fills')),
    glints: tags(all('glints')),
  };
}

// ---------------------------------------------------------------------------------------------
// The Tortoise: a small round tortoise with a green shell, ochre plates and a little rose flower
// tucked behind her eye. Origin (0,0) between her feet, facing right.
//   mouth: 'chat' (wide open, talking), 'smile', 'sad', 'bite' (clamped shut on the stick),
//          'open' (letting go of the stick)
//   legs:  'stand', 'dangle' (pointing towards `down`, the direction of the ground in her own
//          coordinates, in degrees from her +x axis), 'none' (in the water)
//   head:  extra turn of the head in degrees around the neck (positive droops it)
const shell = 'M-42 -6C-40 -36 -20 -48 0 -48C22 -48 40 -34 42 -6Z';
const shellFill = 'M-40 -6C-38 -34 -20 -46 0 -46C22 -46 38 -32 40 -6Z';
const shellRim = 'M-46 -5C-20 2 20 2 46 -5';
const plates = 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM-12 -36L-18 -45M10 -36L16 -45M18 -22L38 -24M8 -10L14 -4M-10 -10L-16 -4M-18 -22L-38 -24';
const plateFill = 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22Z';
const neck = 'M36 -16C44 -22 52 -26 58 -28M38 -6C46 -10 54 -14 60 -18';
const neckFill = 'M36 -16C46 -22 52 -26 58 -28L60 -18C52 -14 44 -10 38 -6Z';
const tTail = 'M-44 -8L-54 -4L-44 -2';
const legsStand = 'M26 -2L24 8L36 8L36 -3M-30 -3L-34 7L-22 8L-20 -2';
const legsStandFill = 'M26 -2L24 8L36 8L36 -3ZM-30 -3L-34 7L-22 8L-20 -2Z';

const HEADS = {
  closed: 'M54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30Z',
  open: 'M54 -30C56 -42 78 -45 85 -35L71 -27L83 -19C78 -13 62 -14 56 -21C54 -24 53 -27 54 -30Z',
};
const MOUTHS = {
  chat: { head: 'open', line: '', inside: 'M85 -35L71 -27L83 -19Z' },
  open: { head: 'open', line: '', inside: 'M85 -35L71 -27L83 -19Z' },
  smile: { head: 'closed', line: 'M62 -25Q72 -17 83 -26' },
  sad: { head: 'closed', line: 'M67 -21Q74 -26 82 -22' },
  bite: { head: 'closed', line: 'M64 -24Q74 -26 84 -28' },
};
const eye = 'M66 -32C66 -38 76 -38 76 -32C76 -26 66 -26 66 -32Z';
// her little rose flower, just behind the eye
const flowerAt = [60, -41];
const petals = [0, 72, 144, 216, 288].map((a) => {
  const r = (a * Math.PI) / 180;
  return dot(flowerAt[0] + Math.cos(r) * 3.4, flowerAt[1] + Math.sin(r) * 3.4, 2.4);
});

export function tortoise({ mouth = 'smile', legs = 'stand', down = 90, head = 0 } = {}) {
  const m = MOUTHS[mouth];
  const H = head ? `rotate(${head} 56 -24)` : '';
  const h = (d) => tr(d, H);
  const brow = mouth === 'sad' ? 'M64 -37Q70 -42 77 -41' : mouth === 'open' ? 'M65 -42Q71 -46 77 -43' : '';
  const legParts = { lines: [], fill: '' };
  if (legs === 'stand') {
    legParts.lines.push(legsStand);
    legParts.fill = legsStandFill;
  } else if (legs === 'dangle') {
    // between straight down and straight out from her belly, so the legs splay and show
    const a = (down * Math.PI) / 180;
    const [ux, uy] = [Math.cos(a) * 0.7, Math.sin(a) * 0.7 + 0.8];
    const [dx, dy] = [ux / Math.hypot(ux, uy), uy / Math.hypot(ux, uy)];
    for (const [x, y, len] of [[30, -5, 17], [20, -3, 14], [-28, -5, 17], [-18, -3, 14]]) {
      const l = limb([[x, y, 9], [x + dx * len * 0.5, y + dy * len * 0.5, 8.5], [x + dx * len, y + dy * len, 7.5]]);
      legParts.lines.push(l);
      legParts.fill += `${l}Z`;
    }
  }
  return {
    lines: [...legParts.lines, shell, neck, tTail, h(HEADS[m.head])],
    fine: [shellRim, plates, h(eye), ...(mouth === 'sad' ? [h('M66 -32Q71 -34.5 76 -32')] : []), ...(m.line ? [h(m.line)] : []), ...(brow ? [h(brow)] : []), ...(mouth === 'sad' ? [h('M72 -24C70 -20 70 -17 72.5 -16.5C75 -17 75 -20 72 -24Z')] : []), ...petals.map(h)],
    washes: [
      { c: PAL.green, o: 0.7, d: shellFill },
      { c: PAL.ochre, o: 0.6, d: `${plateFill}${h(HEADS[m.head])}${neckFill}${legParts.fill}` },
      ...(m.inside ? [{ c: PAL.red, o: 0.75, d: h(m.inside) }] : []),
      { c: PAL.rose, o: 0.85, d: petals.map(h).join('') },
      ...(mouth === 'sad' ? [{ c: PAL.sky, o: 0.9, d: h('M72 -24C70 -20 70 -17 72.5 -16.5C75 -17 75 -20 72 -24Z') }] : []),
    ],
    // sad: a heavy upper lid (the head's ochre shows over the top of the eye), looking down
    whites: [h(mouth === 'sad' ? 'M66 -32Q71 -34.5 76 -32C76 -26 66 -26 66 -32Z' : eye)],
    fills: [h(mouth === 'sad' ? dot(71.5, -29.6, 2.3) : dot(73, -33, 2.6))],
    glints: [h(mouth === 'sad' ? dot(70.8, -30.4, 0.7) : dot(72.2, -34, 0.8))],
  };
}
/** Her shell and standing legs, to cut out of a ground wash. */
// (the pieces of a cut must not overlap, or the overlap fills in again under fill-rule evenodd)
export const tortoiseHeadCut = (head = 0) => `M41 -19C47 -23 51 -25 54.5 -26L55 -20C50 -15 45 -11 41 -9Z${tr(HEADS.closed, head ? `rotate(${head} 56 -24)` : '')}`;
/** Her outline above the waterline (shell, neck and head), to cut out of a water wash. */
export const tortoiseCut = () => `${shell}${tortoiseHeadCut()}`;
export const tortoiseBodyCut = 'M-42 -6C-40 -36 -20 -48 0 -48C22 -48 40 -34 42 -6L36 -3L36 8L24 8L26 -2L-20 -2L-22 8L-34 7L-30 -3Z';

// ---------------------------------------------------------------------------------------------
// A white goose standing, facing right, origin (0,0) at her feet: paper and ink, with an orange beak
// and feet and grey wing tips. sleepy half-closes the eye (listening patiently).
const gBody =
  'M-50 -64C-38 -60 -24 -60 -12 -60C0 -60 8 -66 10 -76C12 -86 8 -94 10 -102C12 -112 28 -114 32 -104C34 -98 30 -94 27 -90C24 -82 24 -70 28 -58C34 -40 22 -20 -2 -20C-26 -20 -42 -36 -50 -64Z';
const gBeak = 'M31 -106C38 -106 44 -103 47 -100C42 -97 36 -96 30 -97Z';
const gWing = 'M-44 -56C-26 -60 0 -56 12 -44C0 -34 -24 -34 -44 -56';
const gWingTips = 'M-50 -64C-46 -60 -44 -56 -44 -56C-38 -48 -32 -42 -26 -40C-34 -46 -40 -54 -42 -60C-45 -62 -48 -63 -50 -64Z';
const gTipFill = 'M-50 -64C-38 -60 -30 -60 -24 -58C-16 -50 -18 -44 -26 -40C-36 -46 -44 -54 -50 -64Z';
const gMarks = 'M-30 -48l9 3M-20 -50l9 3M-36 -44l-4 -5';
const gLegs = 'M-8 -21L-9 -2M6 -21L7 -2';
const gFeet = 'M-9 -2C-5 -2 0 -1 3 1C-2 2 -8 2 -14 1C-12 0 -10 -2 -9 -2ZM7 -2C11 -2 16 -1 19 1C14 2 8 2 2 1C4 0 6 -2 7 -2Z';
const gEye = dot(21, -104, 1.8);

export function goose({ sleepy = false } = {}) {
  return {
    lines: [gBody, gWing, gLegs, gBeak],
    fine: [gMarks, 'M31 -101l9 0', ...(sleepy ? ['M18 -104Q21 -101 24 -104'] : [])],
    washes: [
      { c: PAL.grey, o: 0.55, d: gTipFill },
      { c: PAL.grey, o: 0.18, d: 'M-20 -22C2 -18 24 -30 28 -50C26 -34 14 -24 -2 -22C-10 -22 -16 -22 -20 -22ZM-44 -56C-26 -60 0 -56 12 -44C0 -34 -24 -34 -44 -56Z' },
      { c: PAL.terracotta, o: 0.85, d: gBeak + gFeet },
    ],
    fills: sleepy ? [] : [gEye],
    glints: [],
  };
}
export const gooseCut = gBody;

// A white goose flying, facing right, body centre (0,0), wings raised. neck 'straight' or 'down'
// (bent down to hold the stick: the beak tip is then at about (62, 40)). glide spreads the wings
// out flat for landing.
const flBodyBack = 'M-48 0C-40 -10 -16 -14 6 -12C18 -11 28 -10 36 -9';
const FLY_NECKS = {
  straight: {
    front: 'M36 -9C46 -9 54 -14 62 -14C70 -14 74 -10 72 -5C70 -2 64 -1 58 -1C48 0 40 4 30 10',
    beak: 'M71 -11C77 -11 82 -9 85 -7C80 -5 75 -5 71 -6Z',
    eye: dot(65, -8.5, 1.7),
    tip: [85, -7],
  },
  down: {
    front: 'M36 -9C46 -6 50 2 52 12C54 18 58 19 62 22C67 26 67 35 61 38C55 41 48 37 47 31C46 24 42 14 30 10',
    beak: 'M62 35C66 39 68 43 68 48C64 46 60 43 57 39Z',
    eye: dot(58, 27, 1.7),
    tip: [68, 48],
  },
};
const flBelly = 'M30 10C10 18 -28 16 -48 0';
const flTail = 'M-48 0L-60 -6L-58 6Z';
const flyBody = (neck) => `${flBodyBack}${FLY_NECKS[neck].front.slice(FLY_NECKS[neck].front.indexOf('C'))}${flBelly.slice(flBelly.indexOf('C'))}Z`;
const WINGS = {
  up: {
    near: 'M-4 -12C-12 -36 -28 -56 -52 -66C-50 -58 -52 -52 -48 -46C-56 -48 -64 -46 -70 -42C-62 -36 -58 -32 -54 -28C-60 -26 -64 -22 -66 -18C-48 -16 -32 -14 -20 -12',
    tips: 'M-52 -66C-50 -58 -52 -52 -48 -46C-56 -48 -64 -46 -70 -42C-62 -36 -58 -32 -54 -28C-60 -26 -64 -22 -66 -18C-56 -20 -48 -26 -42 -34C-38 -42 -40 -54 -52 -66Z',
    far: 'M10 -12C12 -32 22 -50 38 -62C38 -50 36 -40 34 -32C32 -24 28 -16 24 -10',
    marks: 'M-36 -34l-8 8M-28 -26l-10 6',
  },
  glide: {
    near: 'M-6 -12C-20 -26 -40 -36 -70 -40C-64 -34 -62 -30 -62 -28C-70 -28 -78 -24 -82 -20C-74 -18 -70 -16 -68 -14C-72 -12 -76 -8 -78 -4C-56 -6 -36 -8 -20 -10',
    tips: 'M-70 -40C-64 -34 -62 -30 -62 -28C-70 -28 -78 -24 -82 -20C-74 -18 -70 -16 -68 -14C-72 -12 -76 -8 -78 -4C-66 -6 -58 -12 -54 -20C-52 -28 -58 -36 -70 -40Z',
    far: 'M12 -12C18 -26 30 -38 48 -46C46 -36 42 -26 36 -18C32 -14 28 -12 24 -10',
    marks: 'M-40 -24l-8 6M-30 -20l-10 5',
  },
};
const flFeet = 'M-30 11C-38 15 -46 18 -56 18C-50 13 -44 11 -38 9Z';

export function flyingGoose({ neck = 'straight', wings = 'up' } = {}) {
  const n = FLY_NECKS[neck];
  const w = WINGS[wings];
  return {
    lines: [flyBody(neck), flTail, w.near, w.far, n.beak],
    fine: [w.marks, flFeet],
    washes: [
      { c: PAL.grey, o: 0.55, d: w.tips + flTail },
      { c: PAL.grey, o: 0.2, d: `${w.far}Z${flBelly}C-30 10 10 12 30 10Z` },
      { c: PAL.terracotta, o: 0.85, d: n.beak + flFeet },
    ],
    fills: [n.eye],
  };
}
/** Where the flying goose's beak tip is, in its own coordinates. */
export const beakTip = (neck = 'straight') => FLY_NECKS[neck].tip;
/** The flying goose's outline, to cut out of a sky wash. */
export const flyingCut = (neck = 'straight', wings = 'up') => `${flyBody(neck)}${WINGS[wings].near}Z`;
