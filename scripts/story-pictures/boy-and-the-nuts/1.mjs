import { PAL, hatch, parseTransform, rng, transformPath } from '../lib.mjs';

// The Boy and the Nuts, 1 (cover): little Tom, in his striped T-shirt, stands by the
// kitchen table and reaches up to the tall glass jar with the narrow neck, full to the top with
// hazelnuts, walnuts and almonds. His hand is just above the opening: he has not got stuck yet (the
// child will guess the answer to that puzzle later).
//
// Tom and the jar are drawn here once, in their own coordinates, and picture 2 imports them and
// places them with a transform (place). Tom stands with his feet at y = 0; the jar's base centre is
// at 0,0.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb along a centreline of [x, y, width] points, open at both ends. */
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
  return { a: `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}`, b: `M${f(R[0][0])} ${f(R[0][1])}${curve(R)}`, shape: `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}L${f(R[0][0])} ${f(R[0][1])}${curve(R)}Z` };
}

// A drawing part: { lines, fine, once, washes: [{c, o, d}], whites, fills, glints }, each a list.
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
export function compose({ title, seed, washes = [], whites = '', lines = [], fine = [], once = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k] ?? []);
  const tags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes')],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: tags([...lines, ...all('lines')]),
    fine: tags([...fine, ...all('fine')]),
    once: once + tags(all('once')),
    fills: tags(all('fills')),
    glints: tags(all('glints')),
  };
}

/** Where the point (x, y) of a part ends up once placed with the transform t. */
export function at(t, x, y) {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** The point of a part (in its own coordinates) that the transform t puts at the scene point (x, y). */
export function from(t, x, y) {
  const [a, b, c, d, e, g] = parseTransform(t);
  const det = a * d - b * c;
  return [(d * (x - e) - c * (y - g)) / det, (-b * (x - e) + a * (y - g)) / det];
}

// ---------------------------------------------------------------------------------------------
// The nuts: hazelnuts (round, a little point on top, a pale cap), walnuts (bigger, a wavy seam)
// and almonds (pointed ovals). Centre at x, y, turned by a degrees.
export function nut(kind, x, y, a = 0, s = 1) {
  const t = `translate(${f(x)} ${f(y)}) rotate(${f(a)}) scale(${s})`;
  if (kind === 'walnut') {
    const d = transformPath(oval(0, 0, 6.6, 5.8), t);
    return { fine: [d, transformPath('M0 -5.8C-2 -3 2 -1 -1 1C-3 3 1 4 0 5.8', t)], washes: [{ c: PAL.ochre, o: 0.6, d }, { c: PAL.terracotta, o: 0.3, d }] };
  }
  if (kind === 'almond') {
    const d = transformPath('M-7 0C-5 -4 1 -4.6 7 0C1 4.6 -5 4 -7 0Z', t);
    return { fine: [d], washes: [{ c: PAL.terracotta, o: 0.45, d }, { c: PAL.ochre, o: 0.5, d }] };
  }
  const d = transformPath('M0 -6C3 -5 5.4 -2 5.2 1.4C5 4.4 2.6 5.6 0 5.6C-2.6 5.6 -5 4.4 -5.2 1.4C-5.4 -2 -3 -5 0 -6Z', t);
  const cap = transformPath('M-4.8 -0.8Q0 1 4.8 -0.8', t);
  return { fine: [d, cap], washes: [{ c: PAL.terracotta, o: 0.72, d }, { c: PAL.ochre, o: 0.4, d: transformPath('M-4.8 -0.8Q0 1 4.8 -0.8C4 -4 2 -5.6 0 -6C-2 -5.6 -4 -4 -4.8 -0.8Z', t) }] };
}

// ---------------------------------------------------------------------------------------------
// The jar (base centre at 0,0), about 108 tall: clear glass, a tall round body, sloping shoulders,
// a narrow neck and a rolled lip; full to the top with nuts.
export const JAR_NECK = [0, -106]; // the middle of the opening
const jarSide = 'M-10.5 -104L-10.5 -88C-12 -80 -33 -76 -34 -50C-35 -26 -33 -8 -26 0C-10 3.5 10 3.5 26 0C33 -8 35 -26 34 -50C33 -76 12 -80 10.5 -88L10.5 -104';
const jarSil = 'M-12.5 -106L-12.5 -88C-14 -80 -33 -76 -34 -50C-35 -26 -33 -8 -26 0C-10 3.5 10 3.5 26 0C33 -8 35 -26 34 -50C33 -76 14 -80 12.5 -88L12.5 -106Z';
const lip = oval(0, -106, 14, 3.6);
const neckRing = 'M-11 -98Q0 -95.5 11 -98';
const shine = 'M-25.5 -62C-27.5 -46 -27 -28 -22.5 -14L-19 -15C-22.5 -28 -23 -46 -21.5 -62Z';
const shine2 = 'M-7 -100L-7 -91L-4.6 -91L-4.6 -100Z';
/** The half-width of the inside of the jar at height y (y < 0). */
function inside(y) {
  const T = [[0, 23], [-5, 29], [-18, 32.5], [-50, 32.5], [-64, 29], [-72, 22], [-78, 15], [-84, 10.5], [-88, 9], [-108, 9]];
  for (let i = 1; i < T.length; i++) {
    if (y >= T[i][0]) {
      const [y0, w0] = T[i - 1];
      const [y1, w1] = T[i];
      return w0 + ((w1 - w0) * (y - y0)) / (y1 - y0);
    }
  }
  return 0;
}
/** The nuts that fill the jar, leaving out any whose centre falls in skip(x, y). */
export function jarNuts({ skip = () => false, top = -101 } = {}) {
  const r = rng(29);
  const kinds = ['hazel', 'walnut', 'almond', 'hazel', 'walnut', 'hazel', 'almond'];
  const out = [];
  let row = 0;
  for (let y = -7.5; y >= top; y -= 9.5, row++) {
    const hw = inside(y) - 6;
    for (let x = -hw + ((row % 2) * 6); x <= hw + 0.1; x += 12) {
      const px = x + (r() - 0.5) * 2.5;
      const py = y + (r() - 0.5) * 2.5;
      const k = kinds[Math.floor(r() * kinds.length)];
      const a = r() * 360;
      if (Math.abs(px) > inside(py) - 4.5 || skip(px, py)) continue;
      out.push(nut(k, px, py, a, 0.98));
    }
  }
  return merge(...out);
}
export function jar({ nuts = jarNuts(), back = '' } = {}) {
  return merge(
    { washes: [{ c: PAL.sky, o: 0.28, d: jarSil }, { c: PAL.slate, o: 0.12, d: jarSil }] },
    nuts,
    {
      lines: [jarSide, lip],
      fine: [neckRing, back],
      washes: [{ c: PAL.sky, o: 0.35, d: lip }],
      whites: [shine, shine2],
    },
  );
}

// ---------------------------------------------------------------------------------------------
// Tom (feet at 0,0), about 112 tall: a little boy of five with a mop of conker-brown hair, a
// striped T-shirt (sky blue with red stripes), slate shorts and red shoes. Head centre at TOM_HEAD;
// shoulders at (±15, -71).
export const TOM_HEAD = [0, -91];
export const TOM_SHOULDER = 15;
const tomFace = oval(0, 0, 16, 16.5);
const tomHair =
  'M-16.6 2C-20 -10 -12 -21 0 -21.5C12 -21.5 20 -11 16.6 2C15.6 -3 14 -6 12 -7.5L10.5 -3.5L7.5 -8.5L4.5 -4L1.5 -9L-1.5 -4.5L-4.5 -9L-7.5 -4.5L-10.5 -8.5C-13 -6.5 -15.5 -3 -16.6 2Z';
const cowlick = 'M0 -21.5q-1 -6 4 -8M-3 -21q-3 -4 -1 -8';
const ears = 'M-16 0c-3.5 1 -3.5 7.5 0 8.5M16 0c3.5 1 3.5 7.5 0 8.5';
const nose = 'M0.5 4c2 1.5 2 3 -0.5 3.5';
/**
 * Tom's head. mood: 'eager' (wide eyes looking up, open smile) or 'cry' (eyes squeezed shut,
 * worried brows, a wide wobbly mouth, tears down both cheeks).
 */
export function tomHead({ mood = 'eager', look = [0, 0] } = {}) {
  const fine = [ears, nose, cowlick];
  const fills = [];
  const glints = [];
  const washes = [
    { c: PAL.rose, o: 0.3, d: tomFace },
    { c: PAL.terracotta, o: 0.75, d: tomHair },
    { c: PAL.ochre, o: 0.35, d: tomHair },
    { c: PAL.rose, o: 0.65, d: mood === 'cry' ? dot(-13, 9, 2.6) + dot(13, 9, 2.6) : dot(-10, 8, 2.8) + dot(10, 8, 2.8) },
  ];
  const whites = [];
  const [lx, ly] = look;
  if (mood === 'cry') {
    fine.push('M-10 -0.5L-4 2.5L-9.5 5M10 -0.5L4 2.5L9.5 5', 'M-10.5 -3.5L-3.5 -6M3.5 -6L10.5 -3.5');
    const mouth = 'M-7 13C-6 9 -2 8 0 8.6C2 8 6 9 7 13C5 16 2 16.5 0 16C-2 16.5 -5 16 -7 13Z';
    fills.push(mouth);
    washes.push({ c: PAL.red, o: 0.5, d: 'M-4 14.5Q0 12 4 14.5Q0 16 -4 14.5Z' });
    const tears = 'M-9.5 4.5C-12.5 10 -13.5 15 -10.5 16.5C-7.5 15.5 -7.5 10 -9.5 4.5ZM9.5 4.5C7.5 10 7.5 15.5 10.5 16.5C13.5 15 12.5 10 9.5 4.5ZM-13.5 19.5C-15.3 22.5 -15.3 25 -13.3 25.6C-11.3 25 -11.7 22.5 -13.5 19.5Z';
    fine.push(tears);
    washes.push({ c: PAL.sky, o: 1, d: tears }, { c: PAL.slate, o: 0.25, d: tears });
  } else {
    fine.push('M-10 -4.5q3.5 -2.5 7 -0.5M3 -5q3.5 -2 7 0.5');
    fills.push(dot(-5.5 + lx, 2 + ly, 2), dot(5.5 + lx, 2 + ly, 2));
    glints.push(dot(-6.1 + lx, 1.3 + ly, 0.65), dot(4.9 + lx, 1.3 + ly, 0.65));
    fills.push('M-5.5 9.5Q0 17 5.5 9.5Q0 11.5 -5.5 9.5Z');
  }
  return { lines: [tomFace, tomHair], fine, washes, whites, fills, glints };
}

// An open hand, wrist at 0,0, the fingers pointing down (+y), the thumb on the +x side.
const openHand =
  'M-4.6 0C-5.8 4 -6.2 8 -5.4 11.5C-5 14 -3 14 -2.9 11.8L-2.6 14.4C-2.4 16.6 -0.2 16.6 0 14.4L0.2 15C0.5 17.2 2.6 17 2.7 14.8L2.9 12.6C3.3 14.4 5.2 14.2 5.2 12C5.4 9 5.3 5 4.6 0';
const thumb = 'M4.9 4C7.6 4.6 9.2 6.6 8.6 9.6C8.2 11 6.6 10.6 6.4 9.4C6.2 8 5.6 7.4 5 7.2';
// A fist, wrist at 0,0, the knuckles towards +y: much wider than the wrist (and than the jar's neck).
export const fist = 'M-5 0C-9 2 -11 6 -10.5 11C-10 15.5 -6 17.5 0 17.5C6 17.5 10 15.5 10.5 11C11 6 9 2 5 0';
const knuckles = 'M-6.5 13.5q1.6 1.6 3.2 0q1.6 1.6 3.2 0q1.6 1.6 3.2 0q1.6 1.6 3.2 0M-3 4.5Q0 6.5 4 5';

/**
 * One arm: a short sky-blue sleeve from the shoulder, then the bare arm and a hand.
 * pts: [shoulder, sleeve end, elbow, wrist, …] as [x, y]. hand: 'round' (a little round hand at
 * the end), 'open' or 'fist' (drawn from the wrist, turned by angle degrees: 0 points down; mirror
 * puts the thumb on the other side).
 */
export function tomArm(pts, { hand = 'round', angle = 0, mirror = false } = {}) {
  const sleeve = limb([[...pts[0], 13], [...pts[1], 12.5]]);
  const skin = limb(pts.slice(1).map(([x, y], i, a) => [x, y, i === a.length - 1 ? 7 : 8.2]));
  const out = {
    lines: [sleeve.a, sleeve.b, skin.a, skin.b],
    fine: [],
    washes: [
      { c: PAL.sky, o: 0.7, d: sleeve.shape },
      { c: PAL.rose, o: 0.4, d: skin.shape },
    ],
  };
  const [x, y] = pts[pts.length - 1];
  if (hand === 'round') {
    const [px, py] = pts[pts.length - 2];
    const l = Math.hypot(x - px, y - py);
    const h = dot(x + ((x - px) / l) * 4.2, y + ((y - py) / l) * 4.2, 5);
    out.lines.push(h);
    out.washes.push({ c: PAL.rose, o: 0.55, d: h });
  } else {
    const t = `translate(${f(x)} ${f(y)}) rotate(${f(angle)}) scale(${mirror ? -1.1 : 1.1} 1.1)`;
    const shape = transformPath(hand === 'fist' ? fist : openHand, t);
    out.lines.push(shape);
    if (hand === 'open') out.lines.push(transformPath(thumb, t));
    else out.fine.push(transformPath(knuckles, t));
    out.washes.push({ c: PAL.rose, o: 0.55, d: `${shape}Z` });
  }
  return out;
}

const shirt = 'M-13 -75C-19 -73 -21 -65 -21 -55L-21 -40C-8 -37.5 8 -37.5 21 -40L21 -55C21 -65 19 -73 13 -75C6 -72 -6 -72 -13 -75Z';
const collar = 'M-8 -73.8Q0 -68 8 -73.8';
const stripes = 'M-20.5 -64.5Q0 -61.5 20.5 -64.5L20.8 -60.5Q0 -57.5 -20.8 -60.5ZM-21 -55Q0 -52 21 -55L21 -51Q0 -48 -21 -51ZM-21 -46Q0 -43 21 -46L21 -42.5Q0 -39.5 -21 -42.5Z';
const shorts = 'M-21 -41C-8 -38.5 8 -38.5 21 -41L22.5 -25L3 -25L0 -33L-3 -25L-22.5 -25Z';
const legs = 'M-17.5 -25L-16.5 -8M-6.5 -25L-7 -8M6.5 -25L7 -8M17.5 -25L16.5 -8';
const legsWash = 'M-17.5 -25L-6.5 -25L-7 -8L-16.5 -8ZM6.5 -25L17.5 -25L16.5 -8L7 -8Z';
const socks = 'M-16.8 -12L-6.8 -12M6.8 -12L16.8 -12';
const shoes = 'M-17 -8C-22 -4 -20 1 -14 1L-5 1L-5.5 -8ZM17 -8C22 -4 20 1 14 1L5 1L5.5 -8Z';

/** Tom. arms: [left arm, right arm] for tomArm; armOpts: options for each; tilt: head tilt. */
export function tom({ mood = 'eager', look = [0, 0], arms, armOpts = [{}, {}], tilt = 0 } = {}) {
  return merge(
    {
      lines: [legs, shoes, shorts, shirt],
      fine: [collar, socks, 'M0 -38.5L0 -33'],
      washes: [
        { c: PAL.rose, o: 0.35, d: legsWash },
        { c: PAL.sky, o: 0.7, d: shirt },
        { c: PAL.red, o: 0.6, d: stripes },
        { c: PAL.slate, o: 0.8, d: shorts },
        { c: PAL.red, o: 0.8, d: shoes },
      ],
    },
    tomArm(arms[0], armOpts[0]),
    tomArm(arms[1], armOpts[1]),
    place(tomHead({ mood, look }), `translate(${TOM_HEAD[0]} ${TOM_HEAD[1]}) rotate(${tilt})`),
  );
}

// ---------------------------------------------------------------------------------------------
// The kitchen: the floor, and the end of a wooden table (its top at TABLE_Y).
export const FLOOR = 'M0 274C90 271 190 276 290 273C340 272 370 274 400 272';
export const floorWash = { c: PAL.ochre, o: 0.25, d: 'M0 270C90 267 190 272 290 269C340 268 370 270 400 268L400 296C300 297 100 296 0 294Z' };
export const floorHatch = hatch(12, 286, 388, 286, 12, 7, 166, 5);
export const TABLE_Y = 160;
export const tableTop = `M200 ${TABLE_Y}L392 ${TABLE_Y}L392 ${TABLE_Y + 11}L200 ${TABLE_Y + 11}Z`;
export const tableLegs = `M208 ${TABLE_Y + 11}L208 273M218 ${TABLE_Y + 11}C217 210 217 245 218 273M374 ${TABLE_Y + 11}L374 270M384 ${TABLE_Y + 11}C385 220 385 250 384 270`;
export const tableWash = `${tableTop}M208 ${TABLE_Y + 11}L218 ${TABLE_Y + 11}L218 273L208 273ZM374 ${TABLE_Y + 11}L384 ${TABLE_Y + 11}L384 270L374 270Z`;
// a little kitchen window up on the wall, with a sill
export const windowFrame = 'M312 20L380 20L380 84L312 84ZM306 84L386 84L386 91L306 91Z';
export const windowIn = 'M319 27L373 27L373 77L319 77Z';
export const windowBars = 'M346 27L346 77M319 52L373 52';
export const windowSill = 'M306 84L386 84L386 91L306 91Z';
export const windowGlass = 'M325 42q8 -6 16 -2M352 66q8 -5 16 -1';
export const tableGrain = `M212 ${TABLE_Y + 5}q30 -2 60 0M300 ${TABLE_Y + 6}q30 -2 70 0`;

// ---------------------------------------------------------------------------------------------
// Picture 1.
const T = 'translate(158 271) scale(1.85)'; // Tom
const J = `translate(246 ${TABLE_Y})`;
// His wrist is beside the neck and his open hand reaches over towards the opening.
const [wx, wy] = from(T, ...at(J, -32, -100));
const [ox, oy] = from(T, ...at(J, -8, -116));
const handAngle = (Math.atan2(-(ox - wx), oy - wy) * 180) / Math.PI;
const shoulder = [TOM_SHOULDER, -71];
const reach = [
  shoulder,
  [shoulder[0] + 4, shoulder[1] - 8],
  [shoulder[0] + (wx - shoulder[0]) * 0.55 + 3, shoulder[1] + (wy - shoulder[1]) * 0.55],
  [wx, wy],
];
const down = [[-TOM_SHOULDER, -71], [-19, -61], [-22, -51], [-24, -43]];

const looseNuts = merge(nut('walnut', 312, TABLE_Y - 5.5, 10), nut('hazel', 328, TABLE_Y - 5.5, -8), nut('almond', 344, TABLE_Y - 3.5, 6));

export default compose({
  title: 'The Boy and the Nuts',
  seed: 57,
  washes: [
    floorWash,
    { c: PAL.sky, o: 0.5, d: windowIn },
    { c: PAL.ochre, o: 0.45, d: windowSill },
    { c: PAL.terracotta, o: 0.6, d: tableWash },
    { c: PAL.ochre, o: 0.4, d: tableWash },
  ],
  lines: [FLOOR, tableTop, tableLegs, windowFrame],
  fine: [tableGrain, floorHatch, windowIn, windowBars, windowGlass],
  parts: [
    looseNuts,
    place(jar(), J),
    place(tom({ mood: 'eager', look: [1.8, -1.8], arms: [down, reach], armOpts: [{}, { hand: 'open', angle: handAngle, mirror: true }], tilt: 8 }), T),
  ],
});
