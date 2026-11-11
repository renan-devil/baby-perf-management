import { PAL, transformPath } from '../lib.mjs';

// The Bremen Town Musicians: the Donkey, the Dog, the Cat, the Rooster and the robbers, drawn once
// here and placed in each picture with a transform (place). The build only draws files named <n>.mjs,
// so this file is not a picture. Every character faces right with its feet at y = 0; flip with
// scale(-1 1).

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

/** Merges several character parts into one. */
export const merge = (...parts) => {
  const out = { lines: [], fine: [], washes: [], whites: [], fills: [], glints: [] };
  for (const p of parts) for (const k of Object.keys(out)) out[k].push(...(p[k] ?? []));
  return out;
};

const close = (list) => list.map((d) => `${d}Z`).join('');

/** A round eye looking right: white, pupil and glint. */
const eye = (x, y, r) => ({
  whites: [dot(x, y, r)],
  fine: [dot(x, y, r)],
  fills: [dot(x + r * 0.25, y, r * 0.6)],
  glints: [dot(x + r * 0.05, y - r * 0.3, r * 0.2)],
});

// ---------------------------------------------------------------------------------------------
// The Donkey: an old grey donkey seen from the side, facing right, with very long ears, a pale
// muzzle, a dark mane and a tufted tail. About 175 tall to the ear tips.
// ears: 'up' or 'droop'; mouth: 'shut', 'smile' or 'open' (braying).
const dTorso =
  'M-46 -60C-56 -70 -52 -90 -34 -92C-14 -95 10 -92 28 -94C44 -96 52 -84 50 -70C48 -56 38 -48 22 -48C4 -46 -16 -46 -30 -48C-40 -50 -44 -54 -46 -60Z';
const dNeckHead =
  'M24 -92C32 -106 40 -120 50 -128C56 -138 70 -140 78 -132C86 -124 94 -114 98 -104C101 -95 93 -89 84 -92C77 -94 71 -99 66 -102C62 -92 56 -80 48 -66';
const dMuzzle = 'M84 -117C92 -112 98 -106 98 -101C99 -94 93 -90 85 -92C79 -94 76 -100 78 -108C79 -112 81 -116 84 -117Z';
const dEar1 = 'M54 -132C44 -150 42 -164 44 -174C52 -166 60 -152 62 -136';
const dEar2 = 'M62 -136C62 -154 66 -168 74 -176C78 -164 76 -148 70 -133';
const dEarIn = 'M53 -140C48 -152 47 -160 47 -167C52 -160 56 -150 58 -140ZM65 -140C65 -152 68 -162 72 -169C73 -160 71 -150 68 -139Z';
const dLegs = [
  limb([[-38, -56, 13], [-40, -30, 9], [-38, -5, 8.5]]),
  limb([[-24, -54, 11], [-24, -30, 8.5], [-22, -5, 8.5]]),
  limb([[28, -56, 12], [30, -30, 8.5], [30, -5, 8.5]]),
  limb([[40, -56, 11], [42, -30, 8.5], [43, -5, 8.5]]),
];
const dHooves = 'M-43 -6L-33 -6L-32 0L-44 0ZM-27 -6L-17 -6L-16 0L-28 0ZM25 -6L35 -6L36 0L24 0ZM38 -6L48 -6L49 0L37 0Z';
const dTail = limb([[-48, -82, 4], [-58, -64, 3.5], [-60, -46, 3]]);
const dTailTuft = 'M-63 -48C-66 -40 -64 -32 -60 -28C-56 -32 -55 -40 -57 -48Z';
const dMane = 'M22 -94L21 -102L28 -100L28 -108L34 -106L35 -114L40 -112L42 -121L46 -118L49 -128';
const dManeFill = `${dMane}C40 -120 32 -106 24 -92Z`;

export function donkey({ ears = 'up', mouth = 'smile' } = {}) {
  const e = (d) => (ears === 'droop' ? transformPath(d, 'rotate(-105 58 -134)') : d);
  const mouths = {
    shut: 'M86 -95q5 2 10 -1',
    smile: 'M84 -96q6 4 12 -2',
    open: 'M80 -97C86 -94 94 -95 99 -100C100 -90 92 -84 84 -88C81 -90 80 -93 80 -97Z',
  };
  return merge(
    {
      lines: [dTail, ...dLegs, dTorso, dNeckHead, e(dEar1), e(dEar2)],
      fine: [dMuzzle, dMane, e(dEarIn), mouths[mouth], 'M-30 -60q8 4 18 2', 'M64 -132q3 -4 7 -3'],
      washes: [
        { c: PAL.grey, o: 0.9, d: `${dTorso}${dNeckHead}Z${close(dLegs)}${e(dEar1)}Z${e(dEar2)}Z${dTail}Z` },
        { c: PAL.slate, o: 0.35, d: `${dLegs[0]}Z${dLegs[1]}Z${dTail}ZM-46 -60C-40 -50 -10 -46 22 -48C38 -48 48 -56 50 -70C40 -60 10 -56 -20 -56C-34 -56 -42 -58 -46 -60Z` },
        { c: PAL.ink, o: 0.75, d: `${dHooves}${dTailTuft}${dManeFill}` },
        { c: PAL.rose, o: 0.6, d: e(dEarIn) },
      ],
      whites: [dMuzzle],
      fills: [dot(93, -104, 1.5), ...(mouth === 'open' ? [mouths.open] : [])],
    },
    eye(70, -122, 3.6),
    { fine: ['M64 -127q6 -3 11 0'] },
  );
}

// ---------------------------------------------------------------------------------------------
// The Dog: a brown-ochre dog, facing right, with floppy terracotta ears and a wagging tail.
// pose 'stand' (walking, about 85 tall) or 'lie' (lying flat, chin up, tongue out, panting).
// The head is drawn around its neck point (0,0) and placed on the body.
const gHead =
  'M-6 -4C-10 -16 -2 -26 10 -27C20 -28 26 -22 28 -16L40 -15C45 -14 46 -6 41 -3L26 -2C18 2 4 3 -2 0Z';
const gEar = 'M8 -25C0 -26 -6 -16 -4 -2C0 1 5 -3 7 -9C9 -15 11 -21 8 -25Z';
const gTongue = 'M30 -2C30 6 34 9 37 6C38 3 37 0 36 -2Z';

function dogHead({ tongue = false, mouth = 'smile' } = {}) {
  const m = { smile: 'M28 -4q5 2 9 -1', open: 'M27 -3C30 4 38 4 41 -3C36 -2 32 -2 27 -3Z' };
  return merge(
    {
      lines: [gHead, gEar],
      fine: [m[mouth], 'M16 -24q4 -2 7 0'],
      washes: [
        { c: PAL.ochre, o: 0.85, d: gHead },
        { c: PAL.terracotta, o: 0.85, d: gEar },
        { c: PAL.terracotta, o: 0.3, d: 'M-6 -4C-10 -16 -2 -26 10 -27L8 -2C2 0 -2 0 -6 -4Z' },
        ...(tongue ? [{ c: PAL.rose, o: 0.95, d: `${gTongue}` }] : []),
        ...(mouth === 'open' ? [{ c: PAL.red, o: 0.6, d: m.open }] : []),
      ],
      fills: [dot(42, -10, 3.2)],
    },
    eye(19, -18, 3.2),
    tongue ? { fine: [gTongue] } : {},
  );
}

export function dog({ pose = 'stand', mouth = 'smile' } = {}) {
  if (pose === 'lie') {
    const body = 'M-44 0C-50 -10 -42 -24 -24 -26C-6 -28 14 -26 24 -18C30 -12 30 -4 26 0Z';
    const legs = [limb([[16, -6, 9], [32, -3, 7.5], [44, -2, 7]]), limb([[8, -4, 9], [24, 0, 7.5], [36, 1, 7]])];
    const tail = limb([[-44, -8, 6], [-58, -4, 5], [-70, -2, 4]]);
    return merge(
      {
        lines: [tail, ...legs, body],
        fine: ['M-30 -20q6 4 12 2', 'M-36 -6q4 -5 10 -4', 'M40 -2l0 3M44 -2l0 3'],
        washes: [
          { c: PAL.ochre, o: 0.85, d: `${body}${close(legs)}${tail}Z` },
          { c: PAL.terracotta, o: 0.35, d: 'M-30 -25C-18 -28 -4 -28 6 -26C0 -22 -12 -22 -30 -22Z' },
        ],
      },
      place(dogHead({ tongue: true, mouth: 'open' }), 'translate(18 -18) rotate(-6)'),
    );
  }
  const body = 'M-34 -42C-38 -56 -24 -62 -6 -60C10 -59 22 -60 28 -56C34 -52 34 -40 26 -34C14 -30 -10 -30 -24 -32C-30 -34 -33 -37 -34 -42Z';
  const legs = [
    limb([[-26, -36, 10], [-28, -18, 7.5], [-26, -3, 7]]),
    limb([[-16, -34, 9], [-16, -18, 7.5], [-14, -3, 7]]),
    limb([[16, -36, 9], [18, -18, 7.5], [18, -3, 7]]),
    limb([[24, -36, 9], [27, -18, 7.5], [28, -3, 7]]),
  ];
  const tail = limb([[-32, -48, 6], [-44, -58, 5], [-48, -72, 4]]);
  return merge(
    {
      lines: [tail, ...legs, body],
      fine: ['M-20 -54q6 4 14 2', 'M-48 -74l-4 -4M-44 -76l2 -5', 'M-30 -1l0 2M-17 -1l0 2M15 -1l0 2M25 -1l0 2'],
      washes: [
        { c: PAL.ochre, o: 0.85, d: `${body}${close(legs)}${tail}Z` },
        { c: PAL.terracotta, o: 0.35, d: `${legs[0]}Z${legs[1]}ZM-24 -60C-12 -62 4 -61 12 -58C4 -54 -12 -54 -24 -56Z` },
      ],
    },
    place(dogHead({ mouth }), 'translate(26 -54)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The Cat (she): a grey cat with slate stripes. pose 'walk' (side view to the right, tail up,
// about 55 tall), 'sit' (sitting, face to us; mood 'sad' gives her a long, long face, 'happy' a
// round smiling one) or 'eyes' (only her two glowing eyes in the dark).
const cEarsSide = 'M22 -49L23 -64L31 -54M36 -54L43 -64L45 -48';

function catFaceFront(mood) {
  if (mood === 'sad') {
    // a long, drooping face
    const head = 'M-14 -4C-15 -16 -8 -20 0 -20C8 -20 15 -16 14 -4C13 10 8 22 0 22C-8 22 -13 10 -14 -4Z';
    const ears = 'M-12 -12L-15 -27L-4 -19M4 -19L15 -27L12 -12';
    return {
      lines: [head, ears],
      fine: [
        'M-9 -4q4 3 8 0M1 -4q4 3 8 0', // heavy lids
        'M-10 -10l6 2M10 -10l-6 2', // sad brows
        'M-6 15q6 -4 12 0', // down-turned mouth
        'M-6 9l-13 0M-6 11l-11 5M6 9l13 0M6 11l11 5',
        'M-3 -19l1 5M0 -20l0 6M3 -19l-1 5',
      ],
      washes: [
        { c: PAL.grey, o: 0.9, d: `${head}M-12 -12L-15 -27L-4 -19ZM4 -19L15 -27L12 -12Z` },
        { c: PAL.slate, o: 0.6, d: 'M-4 -19l2 6l1 0l-1 -7ZM-1 -20l0 6l2 0l0 -6ZM3 -19l-2 6l1 0l3 -6Z' },
        { c: PAL.rose, o: 0.7, d: 'M-11 -14L-13 -23L-7 -18ZM11 -14L13 -23L7 -18ZM-2 8L2 8L0 10Z' },
        { c: PAL.sky, o: 0.9, d: 'M-6 2C-8 6 -8 8 -6 9C-4 8 -4 6 -6 2Z' }, // a tear
      ],
      fills: [dot(-5, -1.5, 1.4), dot(5, -1.5, 1.4)],
    };
  }
  const head = 'M-15 -2C-15 -13 -8 -16 0 -16C8 -16 15 -13 15 -2C15 8 8 12 0 12C-8 12 -15 8 -15 -2Z';
  const ears = 'M-13 -8L-14 -24L-3 -15M3 -15L14 -24L13 -8';
  return {
    lines: [head, ears],
    fine: [
      'M-9 -3q3 -4 7 0M2 -3q3 -4 7 0', // happy closed eyes
      'M0 4q-3 4 -6 1M0 4q3 4 6 1',
      'M-6 3l-13 -2M-6 5l-12 4M6 3l13 -2M6 5l12 4',
      'M-3 -15l1 5M0 -16l0 6M3 -15l-1 5',
    ],
    washes: [
      { c: PAL.grey, o: 0.9, d: `${head}M-13 -8L-14 -24L-3 -15ZM3 -15L14 -24L13 -8Z` },
      { c: PAL.slate, o: 0.6, d: 'M-4 -15l2 6l1 0l-1 -7ZM-1 -16l0 6l2 0l0 -6ZM3 -15l-2 6l1 0l3 -6Z' },
      { c: PAL.rose, o: 0.7, d: 'M-10 -11L-12 -20L-6 -14ZM10 -11L12 -20L6 -14ZM-2 2L2 2L0 4Z' },
      { c: PAL.rose, o: 0.55, d: `${dot(-10, 3, 2.6)}${dot(10, 3, 2.6)}` },
    ],
  };
}

export function cat({ pose = 'walk', mood = 'happy', mouth = 'shut' } = {}) {
  if (pose === 'eyes') {
    const eyes = 'M-14 0C-11 -6 -4 -6 -1 0C-4 5 -11 5 -14 0ZM1 0C4 -6 11 -6 14 0C11 5 4 5 1 0Z';
    return {
      lines: [],
      fine: [eyes],
      washes: [{ c: PAL.ochre, o: 1, d: eyes }, { c: PAL.green, o: 0.55, d: eyes }],
      fills: ['M-7.5 -4C-6 -2 -6 2 -7.5 4C-9 2 -9 -2 -7.5 -4ZM7.5 -4C9 -2 9 2 7.5 4C6 2 6 -2 7.5 -4Z'],
      glints: [dot(-9, -1.6, 0.9), dot(6, -1.6, 0.9)],
    };
  }
  if (pose === 'sit') {
    const body = 'M-16 -40C-26 -30 -28 -10 -22 0L22 0C28 -10 26 -30 16 -40Z';
    const tail = limb([[18, -4, 7], [32, -2, 6.5], [40, -10, 6], [38, -20, 5]]);
    const paws = 'M-12 0C-12 -6 -2 -6 -2 0M2 0C2 -6 12 -6 12 0';
    const stripes = 'M-22 -24q5 2 8 6M-24 -12q5 1 8 5M22 -24q-5 2 -8 6M24 -12q-5 1 -8 5';
    return merge(
      {
        lines: [tail, body],
        fine: [paws, stripes, 'M33 -2l2 -6M38 -12l4 -3'],
        washes: [
          { c: PAL.grey, o: 0.9, d: `${body}${tail}Z` },
          { c: PAL.slate, o: 0.6, d: 'M-22 -24q5 2 8 6l-2 1q-3 -4 -7 -5ZM-24 -12q5 1 8 5l-2 1q-3 -3 -7 -4ZM22 -24q-5 2 -8 6l2 1q3 -4 7 -5ZM24 -12q-5 1 -8 5l2 1q3 -3 7 -4Z' },
          { c: PAL.paper, o: 0.6, d: 'M-8 -36C-10 -24 -10 -10 -6 0L6 0C10 -10 10 -24 8 -36Z' },
        ],
      },
      place(catFaceFront(mood), mood === 'sad' ? 'translate(0 -58)' : 'translate(0 -52)'),
    );
  }
  // walking to the right, tail up
  const body = 'M-30 -24C-32 -36 -20 -40 -4 -39C12 -38 22 -37 26 -28C28 -18 18 -12 0 -12C-14 -12 -28 -14 -30 -24Z';
  const head = 'M19 -40C19 -49 26 -54 33 -54C41 -54 47 -49 47 -40C47 -32 41 -27 33 -27C26 -27 19 -32 19 -40Z';
  const legs = [
    limb([[-22, -18, 8], [-24, -8, 6.5], [-22, -3, 6.5]]),
    limb([[-12, -16, 8], [-11, -8, 6.5], [-10, -3, 6.5]]),
    limb([[10, -18, 8], [11, -8, 6.5], [11, -3, 6.5]]),
    limb([[19, -20, 8], [21, -8, 6.5], [22, -3, 6.5]]),
  ];
  const tail = limb([[-28, -28, 7], [-38, -42, 6], [-38, -58, 5.5], [-30, -64, 5]]);
  const stripes = 'M-18 -38C-16 -30 -16 -22 -18 -16M-6 -39C-4 -30 -4 -20 -6 -14M6 -38C8 -30 8 -20 6 -14M-38 -42l7 2M-40 -52l7 0';
  return merge({
    lines: [tail, ...legs, body, head, cEarsSide],
    fine: [stripes, 'M40 -35q2 3 5 0', 'M42 -35l11 -3M42 -33l11 3', 'M30 -51l1 4M34 -51l0 4'],
    washes: [
      { c: PAL.grey, o: 0.9, d: `${body}${head}${close(legs)}${tail}ZM22 -49L23 -64L31 -54ZM36 -54L43 -64L45 -48Z` },
      { c: PAL.slate, o: 0.6, d: 'M-18 -38C-16 -30 -16 -22 -18 -16L-14 -16C-12 -22 -12 -30 -14 -38ZM-6 -39C-4 -30 -4 -20 -6 -14L-2 -14C0 -20 0 -30 -2 -39ZM6 -38C8 -30 8 -20 6 -14L10 -14C12 -20 12 -30 10 -38Z' },
      { c: PAL.rose, o: 0.7, d: 'M24 -52L25 -60L29 -54ZM38 -54L42 -60L43 -51ZM45 -38L48 -37L46 -35Z' },
    ],
    fills: mouth === 'open' ? ['M38 -33C40 -27 46 -27 47 -33C44 -32 41 -32 38 -33Z'] : [],
  }, eye(38, -42, 3));
}

// ---------------------------------------------------------------------------------------------
// The Rooster: a proud rooster facing right, terracotta and ochre feathers, a big red comb and
// wattle, an arching red tail. About 115 tall. pose 'stand' or 'crow' (head thrown back, beak wide).
const rBody = 'M4 -60C-6 -56 -16 -56 -22 -52C-28 -44 -26 -32 -16 -26C-6 -20 14 -20 24 -28C34 -36 34 -52 24 -60';
const rNeckHead = 'M4 -60C4 -72 6 -84 10 -92C13 -101 26 -104 30 -96C32 -91 30 -86 28 -82C26 -74 26 -66 24 -60';
const rComb = 'M10 -100C6 -108 10 -114 14 -108C14 -116 22 -118 22 -110C24 -117 32 -114 29 -104C24 -102 16 -102 10 -100Z';
const rWattle = 'M27 -89C31 -84 30 -77 26 -78C23 -80 23 -85 26 -89Z';
const rHackles = 'M8 -82l5 6M7 -72l6 6M18 -84l3 6M20 -74l3 6';
const rTail = [
  'M-16 -56C-20 -82 -32 -100 -48 -98C-55 -97 -58 -90 -56 -82C-50 -90 -42 -86 -36 -74C-32 -66 -28 -58 -24 -48',
  'M-20 -52C-30 -72 -46 -82 -58 -74C-62 -68 -60 -62 -56 -58C-52 -68 -42 -68 -34 -58C-30 -54 -28 -48 -26 -42',
  'M-24 -44C-34 -54 -48 -54 -54 -46C-55 -40 -52 -36 -48 -34C-44 -42 -36 -42 -26 -34',
];
const rWing = 'M-12 -46C0 -52 16 -48 20 -40C22 -32 12 -28 2 -30C-6 -30 -14 -36 -15 -42C-15 -44 -14 -45 -12 -46Z';
const rWingMarks = 'M-6 -34q4 -6 12 -6M2 -31q4 -6 12 -6';
const rLegs = [limb([[-4, -24, 5], [-5, -1, 3.6]]), limb([[10, -24, 5], [11, -1, 3.6]])];
const rToes = 'M-5 -1l-9 1M-5 -1l-1 3M-5 -1l8 1M11 -1l-7 1M11 -1l1 3M11 -1l9 1';
const CROW = 'rotate(-28 14 -60)';

export function rooster({ pose = 'stand' } = {}) {
  const h = (d) => (pose === 'crow' ? transformPath(d, CROW) : d);
  const beak = pose === 'crow' ? 'M29 -99L42 -104L31 -96M30 -94L41 -88L29 -91' : 'M29 -99L40 -95L29 -91';
  const beakFill = pose === 'crow' ? 'M29 -99L42 -104L31 -96ZM30 -94L41 -88L29 -91Z' : 'M29 -99L40 -95L29 -91Z';
  return merge(
    {
      lines: [...rTail, ...rLegs, rBody, h(rNeckHead), h(rComb), h(beak), rWing],
      fine: [h(rHackles), rWingMarks, rToes, h(rWattle), 'M-12 -30q3 2 6 0M0 -26q3 2 6 0'],
      washes: [
        { c: PAL.red, o: 0.75, d: `${rTail[0]}Z${rTail[2]}Z` },
        { c: PAL.terracotta, o: 0.9, d: `${rTail[1]}Z${rBody}Z` },
        { c: PAL.ochre, o: 0.95, d: `${h(rNeckHead)}Z${close(rLegs)}${h(beakFill)}` },
        { c: PAL.terracotta, o: 0.45, d: h('M6 -66C6 -76 8 -84 12 -90L28 -82C27 -76 26 -70 24 -64Z') },
        { c: PAL.ochre, o: 0.85, d: rWing },
        { c: PAL.terracotta, o: 0.4, d: rWing },
        { c: PAL.red, o: 0.95, d: `${h(rComb)}${h(rWattle)}` },
      ],
      fills: pose === 'crow' ? [h('M31 -96L30 -94L35 -94.5Z')] : [],
    },
    place(eye(20, -95, 3), pose === 'crow' ? CROW : ''),
  );
}

// ---------------------------------------------------------------------------------------------
// A robber: a round, comic little man with a big black hat, a striped jumper, a pink nose and a
// bushy moustache. Seen from the front, about 105 tall, feet at y = 0.
// pose 'sit' (seated, seen from the waist up) or 'jump' (leaping up with fright, arms up, hat
// flying off).
const bHead = 'M-14 -70C-15 -84 -8 -90 0 -90C8 -90 15 -84 14 -70C13 -60 8 -55 0 -55C-8 -55 -13 -60 -14 -70Z';
const bHat = 'M-24 -84C-12 -88 12 -88 24 -84C22 -80 -22 -80 -24 -84ZM-13 -86C-13 -98 -8 -104 0 -104C8 -104 13 -98 13 -86';
const bMoustache = 'M0 -65C-4 -68 -10 -67 -14 -62C-8 -62 -4 -61 0 -63C4 -61 8 -62 14 -62C10 -67 4 -68 0 -65Z';
const bNose = dot(0, -69, 4, 3.4);
const bBody = 'M-12 -56C-26 -54 -30 -36 -28 -20C-26 -10 -14 -6 0 -6C14 -6 26 -10 28 -20C30 -36 26 -54 12 -56';
const bStripes = 'M-27 -40C-10 -36 10 -36 27 -40M-28 -28C-10 -24 10 -24 28 -28M-25 -16C-10 -12 10 -12 25 -16';

export function robber({ pose = 'sit', tint = PAL.sky } = {}) {
  const jump = pose === 'jump';
  const hat = jump ? transformPath(bHat, 'translate(8 -26) rotate(20 0 -90)') : bHat;
  const mouth = jump ? dot(0, -58.5, 2.6, 3) : 'M-5 -59q5 3 10 0';
  const parts = merge(
    {
      lines: [bBody, bHead, hat],
      fine: [bStripes, bMoustache, bNose, mouth, jump ? 'M-10 -82q4 -3 8 -1M2 -83q4 -2 8 1' : 'M-9 -80q4 -2 7 0M2 -80q4 -2 7 0'],
      washes: [
        { c: PAL.rose, o: 0.7, d: bHead },
        { c: PAL.rose, o: 0.9, d: bNose },
        { c: PAL.ink, o: 0.85, d: `${hat}Z` },
        { c: PAL.slate, o: 0.85, d: bMoustache },
        { c: tint, o: 0.8, d: `${bBody}Z` },
        { c: PAL.paper, o: 0.9, d: 'M-27 -36C-10 -32 10 -32 27 -36L28 -30C10 -26 -10 -26 -28 -30ZM-26 -22C-10 -18 10 -18 26 -22L26 -18C10 -14 -10 -14 -26 -18Z' },
      ],
      whites: [dot(-5, -75, jump ? 3.2 : 2.6), dot(5, -75, jump ? 3.2 : 2.6)],
      fills: [...(jump ? [dot(-5, -75, 1.2), dot(5, -75, 1.2), mouth] : [dot(-4.4, -75, 1.5), dot(5.6, -75, 1.5)])],
    },
    { fine: [dot(-5, -75, jump ? 3.2 : 2.6), dot(5, -75, jump ? 3.2 : 2.6)] },
  );
  if (jump) {
    const arms = [limb([[-24, -48, 8], [-38, -66, 7], [-42, -86, 6]]), limb([[24, -48, 8], [38, -66, 7], [42, -86, 6]])];
    const legs = [limb([[-10, -10, 10], [-22, 4, 9], [-26, 22, 8]]), limb([[10, -10, 10], [20, 0, 9], [32, 4, 8]])];
    const hands = `${dot(-42, -90, 5)}${dot(42, -90, 5)}`;
    const boots = 'M-34 20C-34 30 -20 30 -18 22ZM26 -2C38 -4 42 8 32 10Z';
    return merge(
      {
        lines: [...arms, ...legs],
        washes: [
          { c: tint, o: 0.8, d: close(arms) },
          { c: PAL.slate, o: 0.75, d: close(legs) },
          { c: PAL.rose, o: 0.75, d: hands },
          { c: PAL.ink, o: 0.8, d: boots },
        ],
      },
      parts,
      { lines: [hands, boots] },
    );
  }
  return parts;
}

// ---------------------------------------------------------------------------------------------
// Little things shared by several pictures.

/** A music note (quaver) with its head at (x, y), size s, tilted by deg. */
export function note(x, y, s = 1, deg = 0) {
  const t = `translate(${x} ${y}) rotate(${deg}) scale(${s})`;
  const head = 'M-5 0C-5 -4 1 -6 4 -4C6 -2 5 2 1 3C-3 4 -5 2 -5 0Z';
  return {
    fine: [transformPath('M4 -2L4 -22C8 -18 12 -16 12 -10', t)],
    fills: [transformPath(head, t)],
  };
}

/** A cosy wood fire: logs and three flames, base centre at (0,0), about 60 wide and 50 tall. */
export function fire({ glow = true } = {}) {
  const logs = 'M-30 0C-30 -6 -26 -9 -20 -8L24 -2C29 -1 30 6 25 7L-24 7C-28 7 -30 4 -30 0ZM-24 -2L22 -10C27 -11 30 -6 27 -2L-20 6';
  const flames =
    'M-18 -4C-24 -16 -18 -28 -12 -34C-12 -26 -8 -22 -4 -20C-6 -30 0 -42 6 -50C6 -40 12 -32 14 -26C16 -30 20 -32 22 -34C26 -22 22 -10 16 -4Z';
  const inner = 'M-8 -4C-12 -12 -6 -20 -2 -24C0 -18 4 -16 6 -14C8 -18 10 -20 12 -22C14 -14 12 -8 8 -4Z';
  return {
    lines: [logs],
    fine: [flames],
    washes: [
      ...(glow ? [{ c: PAL.ochre, o: 0.35, d: dot(0, -20, 46, 36) }] : []),
      { c: PAL.terracotta, o: 0.85, d: logs },
      { c: PAL.red, o: 0.85, d: flames },
      { c: PAL.ochre, o: 1, d: inner },
    ],
  };
}
