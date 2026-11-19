import { PAL, parseTransform, transformPath } from '../lib.mjs';

// The Fisherman and His Wife: the characters and props shared by the ten pictures, drawn once here and
// placed in each picture with a transform (place). The build only draws files named <n>.mjs, so this
// file is not a picture. Standing characters have their feet at y = 0.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint, spot) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (arm) along a centreline of [x, y, width] points, open at the root, round at the end. */
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

// A part: { lines: [d], fine: [d], once: [d], washes: [{c, o, d, rule?}], whites: [d], fills: [d], glints: [d] }.
const KEYS = ['lines', 'fine', 'once', 'washes', 'whites', 'fills', 'glints'];
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a part with an SVG transform string (applied to the coordinates themselves). */
export function place(part, t) {
  const out = {};
  for (const k of KEYS) out[k] = (part[k] ?? []).map((v) => (k === 'washes' ? { ...v, d: tr(v.d, t) } : tr(v, t)));
  return out;
}

/** Puts several parts together into one. */
export const merge = (...parts) => {
  const out = Object.fromEntries(KEYS.map((k) => [k, []]));
  for (const p of parts) for (const k of KEYS) out[k].push(...(p[k] ?? []));
  return out;
};

/** Joins placed parts with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', fills = '', glints = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k] ?? []);
  const tags = (list) => list.filter(Boolean).map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: tags([...lines, ...all('lines')]),
    fine: tags([...fine, ...all('fine')]),
    once: once + tags(all('once')),
    fills: fills + tags(all('fills')),
    glints: glints + tags(all('glints')),
  };
}

/** Where the point (x, y) of a part ends up once placed with the transform t. */
export function at(t, x, y) {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** An arm along pts with a round hand at its end. */
function arm(pts, sleeve, o, hand) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.5, d: h }] };
}

// ---------------------------------------------------------------------------------------------
// The fisherman (feet at 0,0), about 140 tall: a gentle old man with a bushy grey beard, a floppy
// ochre hat, a sky-blue smock with a rope belt and a pocket, slate trousers and brown boots.
// legs: false draws him only down to the hem of his smock (y = -40), for when he sits in his boat or
// at the table. look: how far his pupils turn [dx, dy]. tilt: leaning (degrees, about his feet).
// mood: 'happy', 'content' (eyes shut, smiling), 'worried', 'shout', 'wow'.
const fsBrim = 'M-27 -115C-22 -122 -12 -124 0 -124C12 -124 22 -122 27 -115C21 -118 11 -119 0 -119C-11 -119 -21 -118 -27 -115Z';
const fsCrown = 'M-14 -121C-16 -134 -8 -141 1 -140C10 -139 15 -133 14 -121';
const fsFace = 'M-12 -118C-13.5 -112 -13.5 -107 -12 -104M12 -118C13.5 -112 13.5 -107 12 -104';
const fsBeard = 'M-12 -106C-16 -95 -10 -82 0 -79C10 -82 16 -95 12 -106C7 -101 -7 -101 -12 -106Z';
const fsSmock = 'M-15 -86C-19 -70 -21 -54 -21 -40L21 -40C21 -54 19 -70 15 -86C9 -89 -9 -89 -15 -86Z';
const fsTrousers = 'M-18 -40L-16 -6L-3 -6L-1 -32L1 -32L3 -6L16 -6L18 -40';
const fsBoots = 'M-16 -6L-18 0C-13 2 -5 2 -2 0L-3 -6ZM16 -6L18 0C13 2 5 2 2 0L3 -6Z';
export const F_ARMS = {
  down: [
    [[-15, -84, 8], [-21, -66, 7], [-23, -50, 7]],
    [[15, -84, 8], [21, -66, 7], [23, -50, 7]],
  ],
  // both hands cupped round his mouth: calling the fish
  call: [
    [[-15, -84, 8], [-27, -88, 7], [-15, -100, 6]],
    [[15, -84, 8], [27, -88, 7], [15, -100, 6]],
  ],
  // right hand holding his hat on, left arm flung out against the wind
  hat: [
    [[-15, -84, 8], [-30, -80, 7], [-44, -88, 6]],
    [[15, -84, 8], [28, -104, 7], [13, -134, 6]],
  ],
  // right arm raised, waving up at someone high above
  wave: [
    [[-15, -84, 8], [-21, -66, 7], [-23, -50, 7]],
    [[15, -84, 8], [27, -104, 7], [33, -128, 6]],
  ],
};
export function fisherman({ mood = 'happy', arms = F_ARMS.down, legs = true, look = [0, 0], tilt = 0 } = {}) {
  const lines = [fsSmock, fsBrim, fsCrown, fsFace, fsBeard];
  const fine = [
    'M-6 -137q6 3 12 0',
    'M-21 -48C-7 -45 7 -45 21 -48', // rope belt
    'M-2 -46l-3 7M2 -46l3 7',
    'M5 -66l10 0l0 9l-10 0Z', // pocket
    'M-8 -101C-5 -104 -2 -103 0 -101C2 -103 5 -104 8 -101', // moustache
    'M-1 -110c-2 3 -1 5 2 5',
    'M-6 -93l1 5M0 -90l0 6M6 -93l-1 5', // beard strands
  ];
  const washes = [
    { c: PAL.ochre, o: 0.75, d: `${fsBrim}${fsCrown}C8 -123 -8 -123 -14 -121Z` },
    { c: PAL.rose, o: 0.3, d: 'M-12 -119C-14 -111 -13 -105 -12 -104C-7 -101 7 -101 12 -104C13 -105 14 -111 12 -119Z' },
    { c: PAL.rose, o: 0.65, d: dot(0.5, -106, 2.6) },
    { c: PAL.grey, o: 0.7, d: fsBeard },
    { c: PAL.sky, o: 0.7, d: fsSmock },
    { c: PAL.slate, o: 0.25, d: 'M5 -66l10 0l0 9l-10 0Z' },
  ];
  const fills = [];
  const glints = [];
  const [lx, ly] = look;
  if (mood === 'content') {
    fine.push('M-8 -111q3 -3 6 0M2 -111q3 -3 6 0');
  } else {
    const r = mood === 'wow' ? 2 : 1.7;
    fills.push(dot(-5 + lx, -111 + ly, r), dot(5 + lx, -111 + ly, r));
    glints.push(dot(-5.5 + lx, -111.7 + ly, 0.5), dot(4.5 + lx, -111.7 + ly, 0.5));
  }
  if (mood === 'worried' || mood === 'shout' || mood === 'wow') fine.push('M-9 -115l5 -1.6M9 -115l-5 -1.6');
  if (mood === 'shout' || mood === 'wow') fills.push(oval(0, -96, 2.6, mood === 'shout' ? 3.6 : 2.6));
  else if (mood === 'worried') fine.push('M-3 -96q3 -2 6 0');
  else fine.push('M-4 -97q4 3 8 0');
  if (legs) {
    lines.push(fsTrousers, fsBoots);
    fine.push('M-16 -12l12 0M16 -12l-12 0');
    washes.push({ c: PAL.slate, o: 0.55, d: `${fsTrousers}Z` }, { c: PAL.terracotta, o: 0.75, d: fsBoots });
  }
  const all = merge({ lines, fine, washes, fills, glints }, arm(arms[0], PAL.sky, 0.6, 4), arm(arms[1], PAL.sky, 0.6, 4));
  return tilt ? place(all, `rotate(${tilt})`) : all; // leaning, turned about his feet
}

// ---------------------------------------------------------------------------------------------
// Ilsebill, his wife (feet at 0,0), about 124 tall standing: a rose dress, a white apron with a
// patch, and a red spotted headscarf knotted under her chin. When she grows grand she loses the
// apron and the scarf: her terracotta hair in a bun ('hair'), then a golden crown ('crown') and a huge
// one ('bigCrown'), with a red cloak (cape).
// pose: 'stand', 'sit' (on a bench or step about 32 high; the upper body sits 17 lower) or 'upper'
// (only down to the waist, behind a table; the waist is at y = -45, like 'sit').
// mood: 'cross', 'proud', 'wow', 'happy', 'content'.
const ilFaceIn = 'M-5 -89C-11 -91 -13 -97 -13 -103C-13 -109 -7 -112 0 -112C7 -112 13 -109 13 -103C13 -97 11 -91 5 -89';
const ilScarf = 'M-5 -89C-14 -90 -18 -97 -18 -105C-18 -118 -10 -125 0 -125C10 -125 18 -118 18 -105C18 -97 14 -90 5 -89';
const ilKnot = 'M-1 -89L-9 -82L-3 -80ZM1 -89L9 -82L3 -80Z';
const ilFace = 'M-13 -103C-13 -95 -7 -89 0 -89C7 -89 13 -95 13 -103C13 -109 7 -112 0 -112C-7 -112 -13 -109 -13 -103Z';
const ilHair = 'M-14 -101C-16 -117 -8 -123 0 -123C8 -123 16 -117 14 -101C12 -108 6 -112 0 -111C-6 -112 -12 -108 -14 -101Z';
const ilCrown = 'M-10 -117L-12 -132L-5 -125L0 -135L5 -125L12 -132L10 -117C4 -119 -4 -119 -10 -117Z';
const ilBigCrown = 'M-15 -115L-21 -158L-9 -142L0 -164L9 -142L21 -158L15 -115C5 -118 -5 -118 -15 -115Z';
const ilBodice = 'M-12 -88C-15 -80 -15 -70 -13 -62L13 -62C15 -70 15 -80 12 -88C6 -91 -6 -91 -12 -88Z';
const ilSkirt = 'M-13 -62C-20 -44 -26 -22 -28 -4C-10 0 10 0 28 -4C26 -22 20 -44 13 -62';
const ilShoes = 'M-14 -3C-16 2 -6 2 -5 -2M14 -3C16 2 6 2 5 -2';
const ilBib = 'M-7 -87L7 -87L9 -63L-9 -63Z';
const ilApron = 'M-10 -62C-13 -44 -16 -24 -17 -7C-6 -4 6 -4 17 -7C16 -24 13 -44 10 -62Z';
const ilPatch = 'M3 -30l8 -1l1 8l-8 1Z';
// sitting (waist at -45): the skirt over her knees, then her shins and shoes
const ilSitSkirt = 'M-13 -45C-22 -40 -29 -30 -30 -16C-10 -12 10 -12 30 -16C29 -30 22 -40 13 -45';
const ilSitApron = 'M-10 -45C-15 -38 -18 -28 -19 -17C-6 -14 6 -14 19 -17C18 -28 15 -38 10 -45Z';
const ilShins = 'M-12 -14L-12 -3M-5 -14L-5 -3M5 -14L5 -3M12 -14L12 -3';
const ilSitShoes = 'M-13 -3C-17 1 -7 2 -4 -1M13 -3C17 1 7 2 4 -1';
const ilCape = 'M-13 -86C-26 -66 -36 -34 -40 -2C-24 1 24 1 40 -2C36 -34 26 -66 13 -86';
const ilSitCape = 'M-13 -86C-26 -70 -34 -48 -38 -20L38 -20C34 -48 26 -70 13 -86';
export const I_ARMS = {
  hips: [
    [[-12, -86, 7], [-26, -76, 6], [-14, -64, 6]],
    [[12, -86, 7], [26, -76, 6], [14, -64, 6]],
  ],
  // flung wide: "look at my castle!"
  wide: [
    [[-12, -86, 7], [-27, -92, 6], [-38, -106, 6]],
    [[12, -86, 7], [27, -92, 6], [38, -106, 6]],
  ],
  // in her lap (sitting coordinates, before the 17 drop)
  lap: [
    [[-12, -86, 7], [-19, -72, 6], [-8, -62, 6]],
    [[12, -86, 7], [19, -72, 6], [8, -62, 6]],
  ],
  // hands flying up to her cheeks: surprise!
  cheeks: [
    [[-12, -86, 7], [-24, -82, 6], [-17, -100, 5.5]],
    [[12, -86, 7], [24, -82, 6], [17, -100, 5.5]],
  ],
  // left hand in her lap, right hand holding a sceptre upright
  sceptre: [
    [[-12, -86, 7], [-19, -72, 6], [-8, -62, 6]],
    [[12, -86, 7], [25, -76, 6], [27, -90, 6]],
  ],
};
/** Ilsebill's outline standing with her hands on her hips (to cut out of a dark doorway). */
export const I_SIL_HIPS =
  'M0 -126C11 -126 19 -118 19 -104C19 -96 16 -91 12 -90L27 -83L32 -75L17 -63C22 -44 27 -22 29 -3L15 3L-15 3L-29 -3C-27 -22 -22 -44 -17 -63L-32 -75L-27 -83L-12 -90C-16 -91 -19 -96 -19 -104C-19 -118 -11 -126 0 -126Z';
/** Ilsebill's outline standing with her arms flung wide, hair in a bun, no apron. */
export const I_SIL_WIDE =
  'M0 -132C9 -132 17 -122 17 -106C17 -98 15 -93 13 -91L26 -97L34 -112L44 -110L42 -98L28 -84L15 -80L14 -62C21 -44 27 -22 30 -3L15 3L-15 3L-30 -3C-27 -22 -21 -44 -14 -62L-15 -80L-28 -84L-42 -98L-44 -110L-34 -112L-26 -97L-13 -91C-15 -93 -17 -98 -17 -106C-17 -122 -9 -132 0 -132Z';
/** Ilsebill's outline sitting as a queen: crown, cloak, sceptre arm. */
export const I_SIL_QUEEN =
  'M0 -121L13 -120L17 -100C17 -93 15 -88 13 -85L17 -71C27 -61 33 -46 37 -26L40 -2L18 -1L-18 -1L-40 -2L-37 -26C-33 -46 -27 -61 -17 -71L-13 -85C-15 -88 -17 -93 -17 -100L-13 -120Z';
/** Ilsebill's outline sitting as an empress: huge crown, cloak, hands in her lap. */
export const I_SIL_EMPRESS =
  'M-23 -144L0 -150L23 -144L17 -97C17 -93 15 -88 13 -85L17 -71C27 -61 33 -46 37 -26L40 -2L18 -1L-18 -1L-40 -2L-37 -26C-33 -46 -27 -61 -17 -71L-13 -85C-15 -88 -17 -93 -17 -97Z';
/** Ilsebill's outline sitting, scarf on, hands flown up to her cheeks. */
export const I_SIL_SIT_CHEEKS =
  'M0 -109C11 -109 20 -101 20 -88L29 -82L31 -66L22 -56L20 -45C26 -38 31 -28 31 -16L15 3L-15 3L-31 -16C-31 -28 -26 -38 -20 -45L-22 -56L-31 -66L-29 -82L-20 -88C-20 -101 -11 -109 0 -109Z';
/** Ilsebill's outline sitting, scarf on, hands in her lap or at her cheeks. */
export const I_SIL_SIT =
  'M0 -109C11 -109 20 -101 20 -86C20 -80 16 -75 12 -73L23 -63L20 -45C26 -38 31 -28 31 -16L15 3L-15 3L-31 -16C-31 -28 -26 -38 -20 -45L-23 -63L-12 -73C-16 -75 -20 -80 -20 -86C-20 -101 -11 -109 0 -109Z';
export function ilsebill({ pose = 'stand', mood = 'cross', arms = I_ARMS.hips, head = 'scarf', apron = true, cape = false, look = [0, 0], tilt = 0 } = {}) {
  const lines = [ilBodice];
  const fine = [];
  const washes = [];
  const whites = [];
  const fills = [];
  const glints = [];
  // head
  const hl = [];
  const hf = [];
  const hw = [];
  const hg = [];
  if (head === 'scarf') {
    hl.push(ilScarf, ilFaceIn, ilKnot);
    hw.push({ c: PAL.rose, o: 0.3, d: `${ilFaceIn}Z` }, { c: PAL.red, o: 0.75, d: `${ilScarf}C11 -91 13 -97 13 -103C13 -109 7 -112 0 -112C-7 -112 -13 -109 -13 -103C-13 -97 -11 -91 -5 -89Z${ilKnot}` });
    hg.push(dot(-14, -108, 1), dot(-6, -119, 1), dot(6, -120, 1), dot(14, -110, 1), dot(-13, -96, 1), dot(13, -97, 1));
  } else {
    hl.push(ilFace, ilHair, oval(0, -125, 7, 5));
    hw.push({ c: PAL.rose, o: 0.3, d: ilFace }, { c: PAL.terracotta, o: 0.7, d: `${ilHair}${oval(0, -125, 7, 5)}` });
    if (head === 'crown' || head === 'bigCrown') {
      const c = head === 'crown' ? ilCrown : ilBigCrown;
      hl.push(c);
      hw.push({ c: PAL.ochre, o: 0.9, d: c });
      hw.push({ c: PAL.red, o: 0.85, d: head === 'crown' ? dot(0, -122, 1.6) : dot(0, -124, 3) + dot(-9, -122, 2.2) + dot(9, -122, 2.2) });
      if (head === 'bigCrown') hf.push('M-14 -130C-5 -133 5 -133 14 -130');
    }
  }
  hw.push({ c: PAL.rose, o: 0.65, d: dot(-8, -97, 2.3) + dot(8, -97, 2.3) });
  hf.push('M-1 -101q-1 2 1 3');
  const [lx, ly] = look;
  const eyes = (r = 1.6) => {
    fills.push(dot(-4.5 + lx, -103 + ly, r), dot(4.5 + lx, -103 + ly, r));
    hg.push(dot(-5 + lx, -103.6 + ly, 0.5), dot(4 + lx, -103.6 + ly, 0.5));
  };
  const hfills = [];
  if (mood === 'cross') {
    eyes();
    hf.push('M-8 -108l6 2M8 -108l-6 2', 'M-3 -94q3 -2 6 0');
  } else if (mood === 'proud') {
    hf.push('M-7 -103q2.5 -2.5 5 0M2 -103q2.5 -2.5 5 0', 'M-8 -107l5 -1.4M8 -107l-5 -1.4', 'M-3 -95q3 1.6 6 -1');
  } else if (mood === 'wow') {
    eyes(2);
    hf.push('M-7 -108q2.5 -2 5 0M2 -108q2.5 -2 5 0');
    hfills.push(oval(0, -94, 2, 2.6));
  } else if (mood === 'content') {
    hf.push('M-7 -103q2.5 -2.5 5 0M2 -103q2.5 -2.5 5 0', 'M-3 -95q3 2.5 6 0');
  } else {
    eyes();
    hf.push('M-3 -95q3 2.5 6 0');
  }
  let headPart = { lines: hl, fine: hf, washes: hw, glints: hg, fills: [...fills, ...hfills] };
  fills.length = 0;
  if (tilt) headPart = place(headPart, `rotate(${tilt} 0 -90)`);

  fine.push('M-3 -89L-3 -91M3 -89L3 -91');
  washes.push({ c: PAL.rose, o: 0.62, d: ilBodice });
  if (apron) {
    whites.push(ilBib);
    fine.push(ilBib, 'M-13 -62L-22 -55M13 -62L22 -56');
  } else {
    fine.push('M-12 -63C-4 -60 4 -60 12 -63', 'M-7 -87q7 6 14 0');
    washes.push({ c: PAL.ochre, o: 0.8, d: 'M-12 -63C-4 -60 4 -60 12 -63L12 -66C4 -63 -4 -63 -12 -66Z' });
    glints.push(dot(-4, -84, 1), dot(0, -83, 1), dot(4, -84, 1));
    washes.push({ c: PAL.ochre, o: 0.9, d: dot(-4, -84, 1.7) + dot(0, -83, 1.7) + dot(4, -84, 1.7) });
  }
  const upper = merge({ lines, fine, washes, whites, fills, glints }, headPart, arm(arms[0], PAL.rose, 0.55, 3.4), arm(arms[1], PAL.rose, 0.55, 3.4));
  if (pose === 'upper') return place(upper, 'translate(0 17)');
  const low = { lines: [], fine: [], washes: [], whites: [] };
  if (pose === 'stand') {
    low.lines.push(ilSkirt, ilShoes);
    low.washes.push({ c: PAL.rose, o: 0.62, d: `${ilSkirt}Z` }, { c: PAL.terracotta, o: 0.7, d: 'M-14 -3C-16 2 -6 2 -5 -2ZM14 -3C16 2 6 2 5 -2Z' });
    if (apron) {
      low.whites.push(ilApron);
      low.fine.push(ilApron, ilPatch, 'M5 -28l4 3M9 -28l-4 3');
    } else {
      low.fine.push('M-26 -14C-10 -9 10 -9 26 -14');
    }
    if (cape) {
      low.lines.push(ilCape);
      low.washes.push({ c: PAL.red, o: 0.7, d: `${ilCape}Z${ilBodice}${ilSkirt}L-13 -62Z`, rule: 'evenodd' });
    }
    return merge(low, upper);
  }
  // sitting
  low.lines.push(ilSitSkirt, ilShins, ilSitShoes);
  low.washes.push({ c: PAL.rose, o: 0.62, d: `${ilSitSkirt}Z` }, { c: PAL.terracotta, o: 0.7, d: 'M-13 -3C-17 1 -7 2 -4 -1ZM13 -3C17 1 7 2 4 -1Z' });
  if (apron) {
    low.whites.push(ilSitApron);
    low.fine.push(ilSitApron, 'M2 -34l7 -1l1 7l-7 1Z');
  } else {
    low.fine.push('M-28 -22C-10 -18 10 -18 28 -22');
  }
  const up = place(upper, 'translate(0 17)');
  if (cape) {
    up.lines.push(transformPath(ilSitCape, 'translate(0 17)'));
    up.washes.unshift({ c: PAL.red, o: 0.7, d: transformPath(`${ilSitCape}Z${ilBodice}`, 'translate(0 17)') + ilSitSkirt + 'Z', rule: 'evenodd' });
  }
  return merge(low, up);
}

// ---------------------------------------------------------------------------------------------
// A golden throne (bottom centre at 0,0), w wide and h tall: a tall rounded back with knobs, arms,
// short legs. cut: a shape (someone sitting on it, in the throne's own coordinates) that its gold
// leaves out; it must lie inside the throne's outline.
export function throne({ w = 96, h = 180, cut = '' } = {}) {
  const x = w / 2;
  const back = `M${-x} 0L${-x} ${-h + 30}C${-x} ${-h - 4} ${x} ${-h - 4} ${x} ${-h + 30}L${x} 0Z`;
  const inner = `M${-x + 10} ${-h * 0.42}L${-x + 10} ${-h + 34}C${-x + 10} ${-h + 8} ${x - 10} ${-h + 8} ${x - 10} ${-h + 34}L${x - 10} ${-h * 0.42}`;
  const knobs = dot(-x, -h + 26, 5.5) + dot(x, -h + 26, 5.5) + dot(0, -h - 8, 6);
  const armsD = `M${-x - 8} ${-h * 0.24}L${-x} ${-h * 0.24}M${x} ${-h * 0.24}L${x + 8} ${-h * 0.24}M${-x - 8} ${-h * 0.24}L${-x - 8} ${-h * 0.2}L${-x} ${-h * 0.2}M${x + 8} ${-h * 0.24}L${x + 8} ${-h * 0.2}L${x} ${-h * 0.2}`;
  return {
    lines: [back, armsD],
    fine: [inner, knobs, `M${-x + 4} 0L${-x + 4} 8M${x - 4} 0L${x - 4} 8`],
    washes: [
      { c: PAL.ochre, o: 0.8, d: `${back}${cut}`, rule: 'evenodd' },
      { c: PAL.red, o: 0.8, d: knobs },
      { c: PAL.ochre, o: 0.8, d: `M${-x - 8} ${-h * 0.24}L${-x} ${-h * 0.24}L${-x} ${-h * 0.2}L${-x - 8} ${-h * 0.2}ZM${x + 8} ${-h * 0.24}L${x} ${-h * 0.24}L${x} ${-h * 0.2}L${x + 8} ${-h * 0.2}Z` },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// The flounder (centre of its body at 0,0, head to the left), about 84 long: a big flat diamond of a
// fish, grey and ochre with terracotta spots, a frilly fin all round, both eyes on its top side and a
// friendly smile. talk: mouth open. head: only the front of it (for popping out of the water; the
// cut edge at x = 0 is the waterline once it is turned upright with rotate(90)).
const flBody = 'M-36 2C-26 -14 -10 -23 4 -22C18 -21 28 -10 32 0C28 10 18 21 4 22C-10 23 -26 16 -36 2Z';
const flTail = 'M31 0C36 -6 42 -12 49 -13C46 -4 46 4 49 13C42 12 36 6 31 0Z';
const flFinTop = 'M-28 -9C-18 -24 -2 -31 10 -29C20 -27 27 -18 30 -8';
const flFinBot = 'M-28 13C-18 26 -2 31 10 29C20 27 27 18 30 8';
const flHead = 'M0 -22C-12 -21 -26 -13 -36 2C-26 15 -12 22 0 22.5';
const flHeadFinTop = 'M-28 -9C-20 -21 -10 -28 0 -29';
const flHeadFinBot = 'M-28 13C-20 23 -10 29 0 30';
function finRays(x0, x1, top, n) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
    const u = (x + 36) / 68;
    const edge = top ? -(Math.sin(Math.PI * Math.min(1, u * 1.05)) * 22 + 1) : Math.sin(Math.PI * Math.min(1, u * 1.05)) * 22 + 2;
    d += `M${f(x)} ${f(edge)}l${f(1.5)} ${f(top ? -5.5 : 5.5)}`;
  }
  return d;
}
export function flounder({ talk = false, look = [0, 0], head = false } = {}) {
  const [lx, ly] = look;
  const lines = head ? [flHead] : [flBody, flTail];
  const fine = head ? [flHeadFinTop, flHeadFinBot, finRays(-26, -2, true, 6), finRays(-26, -2, false, 6)] : [flFinTop, flFinBot, finRays(-26, 28, true, 11), finRays(-26, 28, false, 11), 'M-20 4C-4 0 14 0 30 0', 'M36 -5l8 -6M36 5l8 6M37 0l9 0'];
  const fins = head ? `${flHeadFinTop}L0 -22C-12 -21 -22 -15 -28 -9ZM-28 13C-20 19 -10 22 0 22.5L0 30C-10 29 -20 23 -28 13Z` : `${flFinTop}C27 -10 18 -21 4 -22C-10 -23 -22 -16 -28 -9Z${flFinBot}C27 10 18 21 4 22C-10 23 -22 16 -28 13Z`;
  const washes = [
    { c: PAL.ochre, o: 0.45, d: head ? `${flHead}Z` : flBody + flTail },
    { c: PAL.grey, o: 0.65, d: head ? `${flHead}Z` : flBody + flTail },
    { c: PAL.ochre, o: 0.6, d: fins },
    { c: PAL.terracotta, o: 0.75, d: head ? dot(-14, 8, 2.2) + dot(-10, -10, 1.8) : dot(-14, 8, 2.2) + dot(0, -9, 2.6) + dot(12, 7, 2.4) + dot(18, -8, 2) + dot(-2, 12, 1.8) + dot(24, 2, 1.6) },
  ];
  const eyes = [[-22, -6], [-14, -11]];
  const whites = eyes.map(([x, y]) => dot(x, y, 3.8)).join('');
  fine.push(...eyes.map(([x, y]) => dot(x, y, 3.8)));
  const fills = eyes.map(([x, y]) => dot(x + lx, y + ly, 2));
  const glints = eyes.map(([x, y]) => dot(x + lx - 0.6, y + ly - 0.7, 0.6));
  if (talk) {
    fills.push('M-36 2C-33 0 -29 1 -27 3C-29 7 -33 8 -35 5Z');
  } else {
    fine.push('M-35 3C-31 7 -27 7 -24 3');
  }
  return { lines, fine, washes, whites: [whites], fills, glints };
}
/** The flounder's wee "words" marks, drawn beside its mouth (scene coordinates, origin at the mouth). */
export const talkMarks = (x, y, s = 1) => transformPath('M-6 -6l-7 -5M-8 1l-9 0M-6 7l-7 5', `translate(${x} ${y}) scale(${s})`);

// ---------------------------------------------------------------------------------------------
// The crooked little hut (base centre at 0,0), about 120 wide and 110 tall: shaped like an old
// upside-down pot, leaning a little, with a band round its rim, a round window, a crooked chimney
// and a dark arched door (about 40 wide and 64 tall, centred at x = -4).
const huBody = 'M-58 0C-62 -34 -52 -70 -22 -86C-6 -94 14 -92 30 -82C54 -66 64 -34 58 0';
const huBandL = 'M-60 -14C-47 -16 -35 -17.3 -24 -17.8';
const huBandR = 'M16 -18C30 -17.6 46 -16.4 60 -14';
const huDoor = 'M-24 0L-24 -50C-24 -79 16 -79 16 -50L16 0';
const huChimney = 'M10 -91L5 -114L18 -116L22 -88';
export const HUT_DOOR = [-4, 0];
/**
 * The hut. cut: a shape in the hut's own coordinates (someone standing in the doorway) that the dark
 * of the doorway leaves out, so they keep their own colours; it must lie inside the doorway.
 */
export function hut({ cut = '' } = {}) {
  const win = oval(36, -48, 9, 9);
  const lines = [huBody, 'M-68 0L68 0', huBandL, huBandR, huChimney, win, huDoor];
  const fine = [
    'M27 -48l18 0M36 -57l0 18',
    'M-44 -46l6 5M-46 -36l8 3M40 -28l6 -4M44 -20l7 -2M-12 -82l6 2',
    'M7 -110l11 -1',
    'M-42 -10l0 -6M30 -12l0 -6M46 -11l0 -6',
  ];
  const washes = [
    { c: PAL.grey, o: 0.55, d: `${huBody}Z${huChimney}Z${huDoor}Z`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.35, d: `${huBody}Z${huDoor}Z`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.45, d: `${huBandL}L-24 0L-58 0Z${huBandR}L58 0L16 0Z` },
    { c: PAL.sky, o: 0.35, d: win },
    { c: PAL.slate, o: 0.55, d: `${huDoor}Z${cut}`, rule: 'evenodd' },
  ];
  if (!cut) fine.push('M-4 -70l0 66', dot(9, -30, 1.5));
  return { lines, fine, washes };
}

/** The transform that undoes t, as a matrix() string (to bring scene shapes into a part's coordinates). */
export function inverse(t) {
  const [a, b, c, d, e, g] = parseTransform(t);
  const det = a * d - b * c;
  const m = [d / det, -b / det, -c / det, a / det, (c * g - d * e) / det, (b * e - a * g) / det];
  return `matrix(${m.join(' ')})`;
}

// ---------------------------------------------------------------------------------------------
// The little rowing boat (centre of the gunwale at 0,0), about 170 long, with an oar.
const boHull = 'M-85 -4C-78 14 -60 24 -30 26L34 26C62 22 80 10 86 -8';
const boRim = 'M-85 -4C-40 3 40 3 86 -8';
const BOAT_WASH = 'M-85 -4C-78 14 -60 24 -30 26L34 26C62 22 80 10 86 -8C40 3 -40 3 -85 -4Z';
export function boat() {
  return {
    lines: [boHull, boRim],
    fine: ['M-80 6C-40 13 40 13 82 2', 'M-70 16C-40 21 40 21 70 14', 'M-86 -4L-92 -8M86 -8L92 -14'],
    washes: [
      { c: PAL.terracotta, o: 0.6, d: BOAT_WASH },
      { c: PAL.ochre, o: 0.35, d: BOAT_WASH },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A hen (feet at 0,0, facing right), about 26 tall: a round ochre-brown body, a red comb. peck: bent
// down to the ground.
export function hen({ peck = false } = {}) {
  const body = 'M-11 -9C-13 -18 -5 -22 3 -20C6 -26 13 -27 15 -21L20 -19L15 -17C16 -11 12 -4 4 -3C-4 -2 -10 -4 -11 -9Z';
  const tail = 'M-11 -10C-16 -15 -17 -22 -13 -25C-11 -19 -8 -17 -6 -16';
  const comb = 'M7 -25C7 -29 10 -29 11 -27C12 -30 15 -29 14 -25Z';
  const part = {
    lines: [body, tail],
    fine: ['M-2 -14C2 -10 6 -11 8 -14', 'M1 -3L0 2M6 -3L7 2', 'M17 -20l-3 0'],
    washes: [
      { c: PAL.ochre, o: 0.7, d: body + `${tail}Z` },
      { c: PAL.terracotta, o: 0.4, d: `${tail}Z` + 'M-2 -14C2 -10 6 -11 8 -14Z' },
      { c: PAL.red, o: 0.85, d: comb + 'M14 -16C15 -13 13 -13 13 -15Z' },
    ],
    fills: [dot(11, -21.5, 1.1)],
  };
  return peck ? place(part, 'rotate(28 2 -2)') : part;
}
