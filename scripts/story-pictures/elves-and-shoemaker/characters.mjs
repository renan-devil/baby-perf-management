import { PAL, rays, transformPath } from '../lib.mjs';

// The Elves and the Shoemaker: the characters and props shared by the ten pictures, drawn once here
// and placed in each picture with a transform (place). The build only draws files named <n>.mjs, so
// this file is not a picture. Standing characters have their feet at y = 0.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint, coin) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (leg, arm) along a centreline of [x, y, width] points, open at the root. */
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

// A character: { lines: [d], fine: [d], once: [d], washes: [{c, o, d, rule?}], whites: [d], fills: [d], glints: [d] }.
const KEYS = ['lines', 'fine', 'once', 'washes', 'whites', 'fills', 'glints'];
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a character with an SVG transform string (applied to the coordinates themselves). */
export function place(ch, t) {
  const out = {};
  for (const k of KEYS) out[k] = (ch[k] ?? []).map((v) => (k === 'washes' ? { ...v, d: tr(v.d, t) } : tr(v, t)));
  return out;
}

/** Puts several characters together into one. */
export const merge = (...parts) => {
  const out = Object.fromEntries(KEYS.map((k) => [k, []]));
  for (const p of parts) for (const k of KEYS) out[k].push(...(p[k] ?? []));
  return out;
};

/** Joins placed characters with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', fills = '', glints = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k] ?? []);
  const pathTags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: pathTags([...lines, ...all('lines')]),
    fine: pathTags([...fine, ...all('fine')]),
    once: once + pathTags(all('once')),
    fills: fills + pathTags(all('fills')),
    glints: glints + pathTags(all('glints')),
  };
}

/** An arm (limb along pts) with a round hand at its end. */
function arm(pts, sleeve, o = 0.5, hand = 4.6) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.5, d: h }] };
}

/** Eyes, mouth and brows shared by the faces. Eyes at (±ex, ey), mouth at my. */
function faceMarks({ mood, ex, ey, my, r = 1.8 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const whites = [];
  if (mood === 'wow') {
    fills.push(dot(-ex, ey, r + 0.4), dot(ex, ey, r + 0.4), oval(0, my + 1, 2.6, 3.4));
    fine.push(`M${-ex - 4} ${ey - 7}q4 -3 7 -1M${ex - 3} ${ey - 8}q4 -2 7 1`);
  } else if (mood === 'shut') {
    fine.push(`M${-ex - 3} ${ey}q3 -3 6 0M${ex - 3} ${ey}q3 -3 6 0`, `M-5 ${my}q5 5 10 0`);
  } else {
    const dx = mood === 'peepR' ? 1.2 : mood === 'peepL' ? -1.2 : 0;
    const dy = mood === 'down' ? 1 : 0;
    fills.push(dot(-ex + dx, ey + dy, r), dot(ex + dx, ey + dy, r));
    glints.push(dot(-ex + dx - 0.5, ey + dy - 0.6, 0.55), dot(ex + dx - 0.5, ey + dy - 0.6, 0.55));
    fine.push(mood === 'peepR' || mood === 'peepL' ? `M-3 ${my}q3 2 6 0` : `M-5 ${my}q5 4.5 10 0`);
  }
  return { fine, fills, glints, whites };
}

// ---------------------------------------------------------------------------------------------
// The old shoemaker's head (centre of the face at 0,0): bald and round, a fluffy white fringe over the
// ears, bushy white brows, round spectacles and a kind smile. mood: 'happy', 'wow', 'down' (looking
// down at his work), 'peepR' / 'peepL' (eyes to one side), 'shut' (beaming).
const smFace = oval(0, 0, 14, 16);
const smFringe =
  'M-13 -9C-18 -12 -23 -8 -20 -4C-24 -2 -24 3 -20 4C-23 8 -19 13 -14 10C-12 4 -12 -3 -13 -9ZM13 -9C18 -12 23 -8 20 -4C24 -2 24 3 20 4C23 8 19 13 14 10C12 4 12 -3 13 -9Z';
export function shoemakerHead({ mood = 'happy', cap = false } = {}) {
  const m = faceMarks({ mood, ex: 6, ey: -1, my: 9, r: 1.5 });
  const lines = [smFace, smFringe];
  const washes = [
    { c: PAL.rose, o: 0.3, d: smFace },
    { c: PAL.grey, o: 0.28, d: smFringe },
    { c: PAL.rose, o: 0.6, d: dot(-9.5, 6, 2.6) + dot(9.5, 6, 2.6) },
  ];
  const specs = dot(-6, -1, 4.6) + dot(6, -1, 4.6);
  const fine = [
    specs,
    'M-1.4 -1.5q1.4 -1.6 2.8 0M-10.6 -1.5L-13.5 -3M10.6 -1.5L13.5 -3',
    'M0.6 2c2.6 1.8 2.6 3.8 -0.6 4.4',
    mood === 'wow' ? '' : 'M-10.5 -8q4 -3 8 -1M2.5 -9q4 -2 8 1',
    'M-17 -6q-2 3 0 6M-18 3q2 2 0 5M17 -6q2 3 0 6M18 3q-2 2 0 5',
    ...m.fine,
  ];
  const glints = [...m.glints];
  if (!cap) glints.push('M-7 -12q4 -3 8 -3.5q-4 1.5 -8 3.5Z');
  return { lines, fine, washes, fills: m.fills, glints, whites: [specs] };
}

// The shoemaker's body (feet at 0,0), about 150 tall: a sky-blue shirt, a long leather apron, slate
// trousers and brown boots. The head sits at HEAD (0, -128), turned by tilt. arms: two limb centrelines
// from the shoulders (±20, -104). upper: only the part above y = -50 (he stands behind the bench).
// seated: on a low stool, knees to the right.
export const SM_HEAD = [0, -128];
export const SM_ARMS = {
  down: [
    [[-20, -104, 10], [-25, -88, 9], [-27, -72, 9], [-26, -62, 9]],
    [[20, -104, 10], [25, -88, 9], [27, -72, 9], [26, -62, 9]],
  ],
};
export function shoemaker({ mood = 'happy', tilt = 0, arms = SM_ARMS.down, upper = false, seated = false } = {}) {
  const b = upper ? -52 : -40;
  const ab = upper ? -52 : seated ? -42 : -18;
  const torso = `M-22 ${b}C-25 -60 -27 -72 -26 -84C-26 -98 -23 -107 -13 -111M22 ${b}C25 -60 27 -72 26 -84C26 -98 23 -107 13 -111`;
  const torsoFill = `M-22 ${b}C-25 -60 -27 -72 -26 -84C-26 -98 -23 -107 -13 -111L13 -111C23 -107 26 -98 26 -84C27 -72 25 -60 22 ${b}Z`;
  const apronSides = `M-21 ${ab}L-20 -66C-19 -74 -16 -78 -13 -80L-12 -100L12 -100L13 -80C16 -78 19 -74 20 -66L21 ${ab}`;
  const apron = upper ? apronSides : `${apronSides}C8 ${ab + 3} -8 ${ab + 3} -21 ${ab}`;
  const apronFill = `${apronSides}C8 ${ab + 3} -8 ${ab + 3} -21 ${ab}Z`;
  const lines = [torso, apron];
  const fine = ['M-12 -100L-9 -111M12 -100L9 -111', 'M-4 -113L-4 -109M4 -113L4 -109'];
  if (!upper) fine.push('M-9 -64L9 -64L9 -52L-9 -52');
  const washes = [
    { c: PAL.sky, o: 0.5, d: torsoFill },
    { c: PAL.terracotta, o: 0.62, d: apronFill },
  ];
  const parts = [];
  if (!upper && !seated) {
    const legs = 'M-20 -18L-18 -5L-5 -5L-3 -18M3 -18L5 -5L18 -5L20 -18';
    const boots = 'M-18 -5C-25 -5 -26 1 -21 1L-4 1L-5 -5ZM18 -5C25 -5 26 1 21 1L4 1L5 -5Z';
    lines.push(legs, boots);
    washes.push({ c: PAL.slate, o: 0.6, d: 'M-20 -18L-18 -5L-5 -5L-3 -18ZM3 -18L5 -5L18 -5L20 -18Z' }, { c: PAL.terracotta, o: 0.85, d: boots });
  }
  if (seated) {
    const leg = limb([[-6, -36, 17], [12, -39, 16], [28, -38, 15], [31, -22, 13], [31, -6, 12]]);
    const leg2 = 'M12 -46L30 -46C38 -46 40 -40 40 -34L40 -6';
    const boots = 'M24 -6C22 1 26 2 30 2L46 2C48 -2 44 -6 38 -6ZM34 -6L48 -6';
    lines.push(leg, leg2, 'M24 -6C22 1 26 2 30 2L46 2C48 -2 44 -6 38 -6Z');
    washes.push(
      { c: PAL.slate, o: 0.6, d: `${leg}ZM12 -46L30 -46C38 -46 40 -40 40 -34L40 -6L30 -6L30 -40Z` },
      { c: PAL.terracotta, o: 0.85, d: boots },
    );
  }
  for (const a of arms) parts.push(arm(a, PAL.sky, 0.5));
  const head = place(shoemakerHead({ mood }), `translate(${SM_HEAD[0]} ${SM_HEAD[1]}) rotate(${tilt})`);
  return merge({ lines, fine, washes }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// The shoemaker's wife's head (centre of the face at 0,0): grey hair drawn up into a bun, rosy cheeks.
// cap: her frilly nightcap instead of the bun (picture 2).
const wFace = oval(0, 0, 13, 15);
const wHair = 'M-14 1C-16 -12 -8 -18 0 -18C8 -18 16 -12 14 1C12 -8 7 -10 0 -10C-7 -10 -12 -8 -14 1Z';
const wBun = dot(0, -22, 6.5);
const wCap = 'M-16 3C-19 -12 -10 -22 0 -22C10 -22 19 -14 16 3C10 -4 -10 -4 -16 3Z';
const wCapTip = 'M8 -20C18 -24 28 -20 31 -8';
const wCapFrill = 'M-16 3q2 -4 4 -2q2 -4 4 -2q2 -3 4 -2q2 -3 4 -1q2 -2 4 0q2 -2 4 1q2 -2 4 2q2 -2 3 3';
export function wifeHead({ mood = 'happy', cap = false } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 7 });
  const lines = [wFace];
  const fine = ['M0.5 2c2 1.5 2 3 -0.5 3.5', ...m.fine];
  const washes = [
    { c: PAL.rose, o: 0.3, d: wFace },
    { c: PAL.rose, o: 0.65, d: dot(-8.5, 5, 2.6) + dot(8.5, 5, 2.6) },
  ];
  if (cap) {
    lines.push(wCap, wCapTip, dot(32, -6, 3.4));
    fine.push(wCapFrill, 'M-4 -18q2 6 1 12M6 -17q1 6 -1 11');
    washes.push({ c: PAL.sky, o: 0.35, d: `${wCap}${wCapTip}C26 -14 18 -18 8 -14Z` }, { c: PAL.rose, o: 0.7, d: dot(32, -6, 3.4) });
  } else {
    lines.push(wHair, wBun);
    fine.push('M-3 -10q-6 2 -9 7M3 -10q6 2 9 7M-3 -24q3 3 6 0');
    washes.push({ c: PAL.grey, o: 0.65, d: wHair + wBun });
  }
  return { lines, fine, washes, fills: m.fills, glints: m.glints, whites: [] };
}

// The wife's body (feet at 0,0), about 145 tall: a long green dress, a rose shawl over her shoulders.
// Head at (0, -124); arms from the shoulders (±18, -100). upper: only the part above y = -50.
// seated: sitting on a chair, her lap to the right.
export const W_HEAD = [0, -124];
export const W_ARMS = {
  down: [
    [[-18, -100, 9], [-23, -86, 8], [-25, -72, 8], [-24, -64, 8]],
    [[18, -100, 9], [23, -86, 8], [25, -72, 8], [24, -64, 8]],
  ],
};
export function wife({ mood = 'happy', tilt = 0, arms = W_ARMS.down, upper = false, seated = false, cap = false } = {}) {
  let dressSides;
  let dressFill;
  const top = 'C-24 -90 -22 -103 -12 -107';
  if (upper) {
    dressSides = `M-24 -52C-24 -64 -24 -76 -24 -80${top}M24 -52C24 -64 24 -76 24 -80C24 -90 22 -103 12 -107`;
    dressFill = `M-24 -52C-24 -64 -24 -76 -24 -80${top}L12 -107C22 -103 24 -90 24 -80C24 -76 24 -64 24 -52Z`;
  } else if (seated) {
    dressSides = `M-24 -80${top}M12 -107C22 -103 24 -90 22 -66C34 -64 50 -60 52 -50C54 -36 52 -20 50 -4C40 -1 26 -1 16 -4C18 -20 18 -34 18 -40C2 -40 -20 -40 -26 -44C-26 -60 -24 -72 -24 -80`;
    dressFill = `M-24 -80${top}L12 -107C22 -103 24 -90 22 -66C34 -64 50 -60 52 -50C54 -36 52 -20 50 -4C40 -1 26 -1 16 -4C18 -20 18 -34 18 -40C2 -40 -20 -40 -26 -44C-26 -60 -24 -72 -24 -80Z`;
  } else {
    dressSides = `M-24 -80${top}M12 -107C22 -103 24 -90 24 -80C26 -50 30 -24 32 -6C12 -2 -12 -2 -32 -6C-30 -24 -26 -50 -24 -80`;
    dressFill = `${dressSides}Z`;
  }
  const shawl = 'M-15 -108C-24 -104 -27 -94 -26 -84C-14 -80 -4 -74 0 -66C4 -74 14 -80 26 -84C27 -94 24 -104 15 -108C8 -103 -8 -103 -15 -108Z';
  const fringe = 'M-24 -83l-1 5M-18 -80l-1 5M-12 -77l-1 5M-6 -73l0 5M6 -73l0 5M12 -77l1 5M18 -80l1 5M24 -83l1 5';
  const lines = [dressSides, shawl];
  const fine = [fringe, 'M0 -66l-3 8M0 -66l3 8'];
  const washes = [
    { c: PAL.green, o: 0.58, d: dressFill },
    { c: PAL.rose, o: 0.72, d: shawl },
  ];
  if (!upper && !seated) {
    const feet = 'M-12 -3C-18 -3 -19 2 -14 2L-4 2L-4 -3M12 -3C18 -3 19 2 14 2L4 2L4 -3';
    lines.push(feet);
    washes.push({ c: PAL.slate, o: 0.7, d: `${feet}Z` });
    fine.push('M-12 -30q2 10 1 22M12 -40q-1 14 1 30');
  }
  if (seated) {
    const feet = 'M26 -3C22 2 28 3 32 3L44 3C46 -1 42 -3 38 -3';
    lines.push(feet);
    washes.push({ c: PAL.slate, o: 0.7, d: `${feet}Z` });
  }
  const parts = arms.map((a) => arm(a, PAL.green, 0.55, 4.2));
  const head = place(wifeHead({ mood, cap }), `translate(${W_HEAD[0]} ${W_HEAD[1]}) rotate(${tilt})`);
  return merge({ lines, fine, washes }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// A tiny elf (feet at 0,0), about 64 tall: a big round head with pointy ears and rosy cheeks.
// dressed: false = ragged grey tunic, bare feet, tousled hair; true = green coat with buttons,
// slate stockings, terracotta shoes with ochre buckles and a woolly hat (hat: PAL.red or PAL.sky).
// hair: hair colour. arms / legs: limb centrelines from the shoulders (±7, -32) and hips (±5, -14);
// the last point of each leg is the foot, pointing to footDir (-1 left, 1 right) per leg.
export const ELF_ARMS = {
  down: [
    [[-7, -32, 4.5], [-11, -26, 4], [-13, -19, 4]],
    [[7, -32, 4.5], [11, -26, 4], [13, -19, 4]],
  ],
  wave: [
    [[-7, -32, 4.5], [-11, -26, 4], [-13, -19, 4]],
    [[7, -32, 4.5], [14, -38, 4], [17, -48, 4]],
  ],
  up: [
    [[-7, -32, 4.5], [-14, -38, 4], [-17, -48, 4]],
    [[7, -32, 4.5], [14, -38, 4], [17, -48, 4]],
  ],
  hug: [
    [[-7, -32, 4.5], [-11, -25, 4], [-3, -23, 4]],
    [[7, -32, 4.5], [11, -25, 4], [3, -24, 4]],
  ],
};
export const ELF_LEGS = {
  stand: [
    [[-5, -14, 5], [-6, -7, 4.5], [-6, -2, 4.5]],
    [[5, -14, 5], [6, -7, 4.5], [6, -2, 4.5]],
  ],
  // sitting on an edge: the hips at y = -14 sit on the bench, the legs hang down in front
  sit: [
    [[-5, -14, 5], [-6, -6, 4.5], [-7, 4, 4.5]],
    [[5, -14, 5], [6, -6, 4.5], [7, 4, 4.5]],
  ],
  kick: [
    [[-5, -14, 5], [-6, -7, 4.5], [-6, -2, 4.5]],
    [[5, -14, 5], [13, -15, 4.5], [20, -20, 4.5]],
  ],
  hop: [
    [[-5, -14, 5], [-9, -8, 4.5], [-6, -3, 4.5]],
    [[5, -14, 5], [10, -9, 4.5], [8, -5, 4.5]],
  ],
};
const eFace = oval(0, -46, 11, 11.5);
const eEars = 'M-10 -50C-15 -53 -20 -57 -24 -60C-21 -51 -16 -45 -10 -42M10 -50C15 -53 20 -57 24 -60C21 -51 16 -45 10 -42';
const eEarFill = 'M-10 -50C-15 -53 -20 -57 -24 -60C-21 -51 -16 -45 -10 -42ZM10 -50C15 -53 20 -57 24 -60C21 -51 16 -45 10 -42Z';
const eHair = 'M-11 -49C-12 -55 -9 -60 -5 -58C-4 -63 2 -63 2 -58C5 -62 10 -59 9 -55C12 -55 12 -51 11 -49C6 -53 -6 -53 -11 -49Z';
const eHat = 'M-12 -48C-13 -58 -7 -64 0 -64C7 -64 13 -58 12 -48Z';
const eHatBand = 'M-12.5 -49C-5 -52 5 -52 12.5 -49M-12 -53C-5 -56 5 -56 12 -53';
export function elf({ dressed = false, hat = PAL.red, hair = PAL.terracotta, arms = ELF_ARMS.down, legs = ELF_LEGS.stand, footDir = [-1, 1], mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 4, ey: -46, my: -40, r: 1.6 });
  const lines = [eEars, eFace];
  const fine = ['M0.4 -44c1.6 1 1.6 2.2 -0.4 2.6', ...m.fine.map((d) => d.replace(/q5 4.5 10 0/, 'q3.5 3 7 0').replace(/M-5 /, 'M-3.5 '))];
  const washes = [
    { c: PAL.rose, o: 0.32, d: eFace + eEarFill },
    { c: PAL.rose, o: 0.7, d: dot(-7, -41.5, 2.4) + dot(7, -41.5, 2.4) },
  ];
  // legs and feet
  const legPaths = legs.map(limb);
  lines.push(...legPaths);
  washes.push({ c: dressed ? PAL.slate : PAL.rose, o: dressed ? 0.55 : 0.35, d: `${legPaths.join('Z')}Z` });
  const feet = legs.map((l, i) => {
    const [x, y] = l[l.length - 1];
    const s = footDir[i];
    return dressed
      ? `M${f(x - 3 * s)} ${f(y - 2)}C${f(x - 4 * s)} ${f(y + 3)} ${f(x + 4 * s)} ${f(y + 3)} ${f(x + 9 * s)} ${f(y + 2)}C${f(x + 11 * s)} ${f(y + 1)} ${f(x + 10 * s)} ${f(y - 2)} ${f(x + 12 * s)} ${f(y - 4)}C${f(x + 6 * s)} ${f(y - 3)} ${f(x + 2 * s)} ${f(y - 4)} ${f(x - 3 * s)} ${f(y - 2)}Z`
      : `M${f(x - 3 * s)} ${f(y - 2)}C${f(x - 4 * s)} ${f(y + 3)} ${f(x + 4 * s)} ${f(y + 3)} ${f(x + 7 * s)} ${f(y + 1)}C${f(x + 9 * s)} ${f(y)} ${f(x + 8 * s)} ${f(y - 3)} ${f(x + 5 * s)} ${f(y - 3)}C${f(x + 2 * s)} ${f(y - 3)} ${f(x)} ${f(y - 4)} ${f(x - 3 * s)} ${f(y - 2)}Z`;
  });
  lines.push(...feet);
  if (dressed) {
    washes.push({ c: PAL.terracotta, o: 0.9, d: feet.join('') });
    const buckles = legs.map((l, i) => {
      const [x, y] = l[l.length - 1];
      return dot(x + 2 * footDir[i], y - 1.5, 1.6);
    });
    washes.push({ c: PAL.ochre, o: 1, d: buckles.join('') });
    fine.push(...buckles);
  } else {
    washes.push({ c: PAL.rose, o: 0.45, d: feet.join('') });
  }
  // body
  if (dressed) {
    const coat = 'M-6 -35C-12 -32 -14 -22 -15 -11C-5 -9 5 -9 15 -11C14 -22 12 -32 6 -35';
    const coatFill = `${coat}Z`;
    lines.push(coat);
    fine.push('M-6 -35L0 -29L6 -35M0 -29L0 -10', 'M-14 -17C-5 -15 5 -15 14 -17');
    washes.push({ c: PAL.green, o: 0.85, d: coatFill });
    m.fills.push(dot(2.5, -25, 1.1), dot(2.5, -20, 1.1));
  } else {
    const tunic = 'M-6 -35C-11 -32 -13 -24 -13 -14L-10 -10L-7 -14L-4 -10L-1 -14L2 -10L5 -14L8 -10L10 -14L13 -11C13 -24 11 -32 6 -35';
    lines.push(tunic);
    const patch = 'M2 -28L8 -27L7 -21L2 -22Z';
    fine.push(patch, 'M3 -27l1 1M6 -26l1 1M-8 -25l3 2M-9 -20l3 1');
    washes.push({ c: PAL.grey, o: 0.75, d: `${tunic}Z` }, { c: PAL.ochre, o: 0.55, d: patch });
  }
  const parts = arms.map((a) => {
    const d = limb(a);
    const [x, y] = a[a.length - 1];
    const h = dot(x, y, 2.8);
    return { lines: [d], fine: [h], washes: [{ c: dressed ? PAL.green : PAL.grey, o: dressed ? 0.85 : 0.7, d: `${d}Z` }, { c: PAL.rose, o: 0.5, d: h }] };
  });
  // hair or hat on top
  if (dressed) {
    const bobble = dot(0, -67, 4);
    lines.push(eHat, bobble);
    fine.push(eHatBand, 'M-6 -59l1 4M0 -60l0 4M6 -59l-1 4');
    washes.push({ c: hat, o: hat === PAL.sky ? 0.95 : 0.85, d: eHat + bobble });
  } else {
    lines.push(eHair);
    washes.push({ c: hair, o: 0.8, d: eHair });
  }
  return merge({ lines, fine, washes, fills: m.fills, glints: m.glints }, ...parts);
}

// ---------------------------------------------------------------------------------------------
// The workbench (floor at 0,0), seen a little from above: a thick plank top of width w at height h,
// with a back edge (so things can stand on it) and four sturdy legs. TOP(h) is the y of the front edge.
export function bench({ w = 200, h = 70 } = {}) {
  const x0 = -w / 2;
  const x1 = w / 2;
  const top = `M${x0} ${-h}L${x1} ${-h}L${x1 - 10} ${-h - 16}L${x0 + 10} ${-h - 16}Z`;
  const front = `M${x0} ${-h}L${x0} ${-h + 10}L${x1} ${-h + 10}L${x1} ${-h}`;
  const legs = `M${x0 + 8} ${-h + 10}L${x0 + 10} 0L${x0 + 20} 0L${x0 + 20} ${-h + 10}M${x1 - 8} ${-h + 10}L${x1 - 10} 0L${x1 - 20} 0L${x1 - 20} ${-h + 10}`;
  const back = `M${x0 + 24} ${-h + 10}L${x0 + 26} -14M${x1 - 24} ${-h + 10}L${x1 - 26} -14M${x0 + 25} -30L${x1 - 25} -30`;
  const fill = `${top}${front}Z${legs.replace(/M/g, 'Z M').slice(1)}Z`;
  return {
    lines: [top, front, legs],
    fine: [back, `M${x0 + 30} ${-h - 7}l40 0M${x1 - 70} ${-h - 10}l30 0M${x0 + 40} ${-h + 5}l60 0`],
    washes: [
      { c: PAL.ochre, o: 0.62, d: fill },
      { c: PAL.ochre, o: 0.35, d: `${top}` },
      { c: PAL.terracotta, o: 0.2, d: `${front}Z` },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A shoe seen from the side, toe to the right (bottom of the heel at 0,0), about 34 long.
// c: leather colour. A pair: two shoes, the second a little behind and to the right.
const shoeBody = 'M0 0C-1 -6 -1 -12 2 -15L11 -15C13 -11 17 -10 23 -9C31 -8 35 -5 35 -1L35 0Z';
const shoeOpening = 'M2 -15C4 -18 9 -18 11 -15C9 -13 4 -13 2 -15Z';
export function shoe({ c = PAL.terracotta, o = 0.85 } = {}) {
  return {
    lines: [shoeBody],
    fine: [shoeOpening, 'M0 -2L35 -2', 'M14 -12l3 3M17 -12l-3 3M19 -10.5l2.5 2.5'],
    washes: [
      { c, o, d: shoeBody },
      { c: PAL.ink, o: 0.55, d: shoeOpening },
    ],
    glints: ['M22 -7q5 -1 8 1q-4 0 -8 -1Z'],
  };
}
export function shoePair({ c = PAL.terracotta, o = 0.85 } = {}) {
  return merge(place(shoe({ c, o }), 'translate(10 -4)'), shoe({ c, o }));
}

/** Leather cut out for a pair (lying flat on the bench): two soles and two uppers. Centre at 0,0. */
export function leather() {
  const pieces =
    'M-30 -4C-32 -9 -26 -12 -16 -11C-8 -10 -6 -6 -10 -3C-14 0 -26 1 -30 -4Z' +
    'M-2 -6C-4 -11 4 -13 12 -11C18 -9 18 -5 14 -3C8 0 0 -1 -2 -6Z' +
    'M20 2C18 -4 30 -6 36 -2C38 2 34 5 28 5C24 5 21 4 20 2Z' +
    'M-22 6C-24 2 -14 0 -8 3C-6 6 -10 9 -16 9C-20 9 -22 8 -22 6Z';
  return {
    lines: [pieces],
    fine: ['M-26 -5l14 -2M2 -7l10 0'],
    washes: [{ c: PAL.terracotta, o: 0.75, d: pieces }],
  };
}

/** A candle in a little dish with a soft glow (base of the dish at 0,0). glow: radius of the halo. */
export function candle({ glow = 60, lit = true } = {}) {
  const dish = 'M-14 -2C-14 3 14 3 14 -2C14 -5 -14 -5 -14 -2Z';
  const handle = 'M14 -3C22 -4 22 -12 15 -11';
  const stick = 'M-4.5 -3L-4.5 -28L4.5 -28L4.5 -3';
  const drip = 'M-4.5 -24c2 1 2 5 1 7';
  const flame = 'M0 -30C-5 -34 -3 -40 0 -47C3 -40 5 -34 0 -30Z';
  const lines = [dish, handle, stick];
  const fine = ['M0 -28L0 -31', drip, oval(0, -28, 4.5, 1.4)];
  const washes = [
    { c: PAL.grey, o: 0.6, d: dish },
    { c: PAL.ochre, o: 0.15, d: 'M-4.5 -3L-4.5 -28L4.5 -28L4.5 -3Z' },
  ];
  if (lit) {
    lines.push(flame);
    washes.unshift({ c: PAL.ochre, o: 0.28, d: dot(0, -38, glow) }, { c: PAL.ochre, o: 0.3, d: dot(0, -38, glow * 0.45) });
    washes.push({ c: PAL.ochre, o: 0.95, d: flame }, { c: PAL.red, o: 0.45, d: 'M0 -32C-2 -34 -1 -37 0 -40C1 -37 2 -34 0 -32Z' });
    fine.push(rays(0, -39, 13, 22, 10, 7));
  }
  return { lines, fine, washes };
}

/** Falling snow: little paper flakes (whites) over a dark sky, or ink flakes on the paper. */
export function snowDots(points, r = 1.8) {
  return points.map(([x, y], i) => dot(x, y, r * (0.75 + ((i * 37) % 10) / 20))).join('');
}
export function snowFlakes(points, s = 3) {
  return points.map(([x, y]) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}M${f(x - s * 0.7)} ${f(y - s * 0.7)}L${f(x + s * 0.7)} ${f(y + s * 0.7)}M${f(x - s * 0.7)} ${f(y + s * 0.7)}L${f(x + s * 0.7)} ${f(y - s * 0.7)}`).join('');
}

/** A cottage window (top-left at x,y): four panes; night: dark slate sky with snow; day: pale sky. */
export function windowPanes(x, y, w, h, { night = true, snow = [] } = {}) {
  const frame = `M${x} ${y}L${x + w} ${y}L${x + w} ${y + h}L${x} ${y + h}Z`;
  const bars = `M${x + w / 2} ${y}L${x + w / 2} ${y + h}M${x} ${y + h / 2}L${x + w} ${y + h / 2}`;
  const sill = `M${x - 8} ${y + h}L${x + w + 8} ${y + h}L${x + w + 6} ${y + h + 7}L${x - 6} ${y + h + 7}Z`;
  return {
    lines: [frame, sill],
    fine: [bars],
    washes: [
      { c: night ? PAL.slate : PAL.sky, o: night ? 0.7 : 0.35, d: frame },
      { c: PAL.ochre, o: 0.55, d: sill },
    ],
    whites: snow.length ? [snowDots(snow)] : [],
  };
}

/** A shiny coin (centre 0,0) with a sparkle. */
export function coin(r = 6) {
  return {
    lines: [dot(0, 0, r)],
    fine: [dot(0, 0, r * 0.6)],
    washes: [{ c: PAL.ochre, o: 0.95, d: dot(0, 0, r) }],
    glints: [dot(-r * 0.35, -r * 0.35, r * 0.22)],
  };
}

/** A little musical note (quaver) of height s, its head at (0,0). */
export function note(s = 18, double = false) {
  const head = oval(0, 0, s * 0.24, s * 0.17);
  const stem = `M${f(s * 0.22)} 0L${f(s * 0.22)} ${f(-s)}`;
  const flag = double ? `M${f(s * 0.22)} ${f(-s)}L${f(s * 0.95)} ${f(-s * 0.85)}L${f(s * 0.95)} ${f(-s * 0.15)}` : `M${f(s * 0.22)} ${f(-s)}C${f(s * 0.5)} ${f(-s * 0.7)} ${f(s * 0.75)} ${f(-s * 0.6)} ${f(s * 0.6)} ${f(-s * 0.3)}`;
  const head2 = double ? oval(s * 0.73, -s * 0.15, s * 0.24, s * 0.17) : '';
  return { lines: [stem, flag], fills: [head, head2].filter(Boolean) };
}
