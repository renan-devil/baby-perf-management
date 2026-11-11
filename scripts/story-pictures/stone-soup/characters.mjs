import { PAL, transformPath } from '../lib.mjs';

// Stone Soup: the traveller, the little girl, the old woman, the big black pot and the vegetables,
// shared by the five pictures. Each is drawn once here and placed in each picture with a transform
// (place). The build only draws files named <n>.mjs, so this file is not a picture. Standing
// characters have their feet at y = 0 and look at us.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint, bubble) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (arm, leg, stick) along a centreline of [x, y, width] points, open at the root. */
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

/** Where the point (x, y) of a character lands once placed with the transform t. */
export function at(x, y, t) {
  const p = transformPath(`M${x} ${y}`, t).split(' ');
  return [Number(p[1]), Number(p[2])];
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
function arm(pts, sleeve, o = 0.55, hand = 4.6) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.55, d: h }] };
}

/**
 * Eyes and mouth shared by the faces: eyes at (±ex, ey), mouth at my. mood: 'happy' (open eyes, big
 * smile), 'laugh' (eyes squeezed shut, mouth wide open), 'mmm' (eyes shut, a contented little smile),
 * 'wow' (eyes wide, mouth a small "o"), 'peep' / 'peepL' (looking right / left, curious), 'sniff' (eyes shut,
 * mouth a small "o").
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const shut = (up) => `M${-ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0M${ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0`;
  if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 9} ${w} ${my + 9} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(shut(true), mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'mmm') {
    fine.push(shut(false), `M${-w + 1} ${my}q${w - 1} 4 ${2 * w - 2} 0`);
  } else if (mood === 'sniff') {
    fine.push(shut(false));
    fills.push(dot(0, my + 1, 1.8));
  } else {
    const dx = mood === 'peep' ? 1.3 : mood === 'peepL' ? -1.3 : 0;
    const rr = mood === 'wow' ? r + 0.4 : r;
    fills.push(dot(-ex + dx, ey, rr), dot(ex + dx, ey, rr));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.55), dot(ex + dx - 0.5, ey - 0.6, 0.55));
    if (mood === 'wow') fills.push(dot(0, my + 1, 2.2));
    else if (mood === 'peep' || mood === 'peepL') fine.push(`M-3 ${my}q3 2.4 6 0`);
    else fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

// ---------------------------------------------------------------------------------------------
// The traveller's head (centre of the face at 0,0): a big floppy terracotta hat with an ochre band
// and a red feather, a round rosy nose and a wide smile, wisps of grey hair under the hat.
// The face outline stops under the brim; the hat sits above the eyes.
const tFace = 'M-13.6 -8C-14.6 4 -8 17 0 17C8 17 14.6 4 13.6 -8';
const tFaceFill = `${tFace}C10 -11 -10 -11 -13.6 -8Z`;
const tBrim = 'M-36 -10C-30 -18 -18 -20 0 -20C18 -20 30 -18 37 -9C40 -4 36 -1 31 -4C20 -10 -20 -10 -31 -3C-37 0 -40 -5 -36 -10Z';
const tCrown = 'M-17 -19C-20 -34 -12 -44 1 -44C14 -44 21 -35 17 -19';
const tBand = 'M-17 -19C-18 -22 -18 -24 -17.5 -26C-6 -29 6 -29 17.5 -26C18 -24 18 -22 17 -19C6 -21 -6 -21 -17 -19Z';
const tFeather = 'M14 -26C22 -36 30 -46 38 -50C36 -42 28 -32 16 -24Z';
export function travellerHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 5.5, ey: -2, my: 9, w: 6 });
  return {
    lines: [tFace, tBrim, tCrown],
    fine: [
      tFeather,
      'M16 -25C24 -34 30 -42 37 -49',
      'M-3 -43q3 5 7 0',
      'M-14 -2q-3 3 -1 7M-13 3q-3 4 0 7M14 -2q3 3 1 7M13 3q3 4 0 7',
      ...m.fine,
    ],
    washes: [
      { c: PAL.rose, o: 0.32, d: tFaceFill },
      { c: PAL.terracotta, o: 0.8, d: `${tBrim}${tCrown}Z` },
      { c: PAL.ochre, o: 0.9, d: tBand },
      { c: PAL.red, o: 0.85, d: tFeather },
      { c: PAL.rose, o: 0.85, d: dot(1, 3.5, 3.6) },
      { c: PAL.rose, o: 0.55, d: dot(-9, 6, 2.6) + dot(10, 6, 2.6) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, dot(0, 2.2, 0.9)],
  };
}

// The traveller (feet at 0,0), about 195 tall: a long patched green coat, a red scarf, grey trousers
// and big terracotta boots. Head at (0, -143), drawn 1.2 times bigger and turned by tilt. arms: two limb centrelines from the
// shoulders (±22, -108). upper: only the part above y = -60 (he sits behind the table).
export const T_HEAD = [0, -143];
export const T_ARMS = {
  down: [
    [[-22, -108, 11], [-28, -90, 10], [-30, -72, 10], [-29, -62, 10]],
    [[22, -108, 11], [28, -90, 10], [30, -72, 10], [29, -62, 10]],
  ],
};
export function traveller({ mood = 'happy', tilt = 0, arms = T_ARMS.down, upper = false } = {}) {
  const hem = upper ? '' : 'C-14 -25 14 -25 32 -28';
  const sideL = upper ? 'M-12 -116C-22 -114 -26 -106 -26 -96C-26 -84 -27 -72 -27 -60' : 'M-12 -116C-22 -114 -26 -106 -26 -96C-27 -72 -30 -48 -32 -28';
  const sideR = upper ? 'M12 -116C22 -114 26 -106 26 -96C26 -84 27 -72 27 -60' : 'M12 -116C22 -114 26 -106 26 -96C27 -72 30 -48 32 -28';
  const coat = `${sideL}${hem}`;
  const coatFill = upper
    ? 'M-12 -116C-22 -114 -26 -106 -26 -96C-26 -84 -27 -72 -27 -60L27 -60C27 -72 26 -84 26 -96C26 -106 22 -114 12 -116Z'
    : 'M-12 -116C-22 -114 -26 -106 -26 -96C-27 -72 -30 -48 -32 -28C-14 -25 14 -25 32 -28C30 -48 27 -72 26 -96C26 -106 22 -114 12 -116Z';
  const scarf = 'M-14 -124C-6 -119 6 -119 14 -124C17 -120 16 -115 12 -113C4 -110 -4 -110 -12 -113C-16 -115 -17 -120 -14 -124Z';
  const scarfEnd = 'M4 -112L8 -90L15 -92L12 -113';
  const patch = 'M8 -78L20 -79L21 -66L9 -65Z';
  const lines = [sideL, sideR, scarf, scarfEnd];
  if (!upper) lines[0] = coat;
  const fine = ['M0 -110L0 ' + (upper ? -60 : -28), dot(-4, -100, 1.6), dot(-4, -86, 1.6), dot(-4, -72, 1.6), 'M8 -91l7 -1M8 -96l6 -1'];
  const once = [];
  const washes = [
    { c: PAL.green, o: 0.62, d: coatFill },
    { c: PAL.red, o: 0.8, d: `${scarf}${scarfEnd}Z` },
    { c: PAL.ochre, o: 0.8, d: patch },
  ];
  fine.push(patch);
  if (!upper) {
    fine.push('M-10 -40q2 6 1 10M14 -46q-1 8 1 15');
    const legs = 'M-17 -27L-16 -7M-5 -26L-5 -7M5 -26L5 -7M17 -27L16 -7';
    const boots = 'M-16 -7C-25 -7 -27 1 -21 1L-3 1L-5 -7ZM16 -7C25 -7 27 1 21 1L3 1L5 -7Z';
    lines.push(legs, boots);
    washes.push({ c: PAL.grey, o: 0.75, d: 'M-17 -27L-16 -7L-5 -7L-5 -26ZM5 -26L5 -7L16 -7L17 -27Z' }, { c: PAL.terracotta, o: 0.9, d: boots });
  }
  const parts = arms.map((a) => arm(a, PAL.green, 0.62, 5));
  const head = place(travellerHead({ mood }), `translate(${T_HEAD[0]} ${T_HEAD[1]}) rotate(${tilt}) scale(1.2)`);
  return merge({ lines, fine, once, washes }, ...parts, head);
}

/** The traveller's walking stick: a knobbly stick standing on (0,0), about 150 tall. */
export function stick() {
  const s = limb([[0, 0, 5], [2, -60, 5.5], [-1, -120, 5], [1, -146, 6]]);
  return {
    lines: [s],
    fine: ['M2 -50l4 -4M-1 -100l-4 -3'],
    washes: [{ c: PAL.terracotta, o: 0.75, d: `${s}Z` }, { c: PAL.ochre, o: 0.5, d: `${s}Z` }],
  };
}

/** The long wooden spoon, from the handle end (0,0) to the bowl, along +y, about len long (bowl: false
 * when the bowl is under the soup). */
export function spoon(len = 80, { bowl = true } = {}) {
  const handle = limb([[0, 0, 4.4], [0, bowl ? len - 10 : len, 4.4]]);
  const b = bowl ? oval(0, len - 4, 6, 8) : '';
  return {
    lines: [handle, b].filter(Boolean),
    washes: [{ c: PAL.ochre, o: 0.85, d: `${handle}Z${b}` }],
  };
}

// ---------------------------------------------------------------------------------------------
// The little girl's head (centre of the face at 0,0): ochre hair with a fringe and two bunches tied
// with red ribbons, freckles and rosy cheeks.
// the face outline stops under the hair
const gFace = 'M-12.6 -2C-13 8 -6 14 0 14C6 14 13 8 12.6 -2';
const gFaceFill = `${gFace}C11 -8 6 -10 0 -8C-5 -10 -10 -8 -12.6 -2Z`;
const gHair = 'M-13 -1C-15 -13 -8 -19 0 -19C8 -19 15 -13 13 -1C11 -8 6 -10 0 -8C-5 -10 -10 -8 -13 -1Z';
const gBunL = 'M-12 -6C-21 -11 -27 -2 -24 6C-22 11 -16 9 -13 2Z';
const gBunR = 'M12 -6C21 -11 27 -2 24 6C22 11 16 9 13 2Z';
export function girlHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 4.5, ey: 0, my: 7, r: 1.7, w: 4 });
  const bows = dot(-13, -5, 2.6) + dot(13, -5, 2.6);
  return {
    lines: [gFace, gHair, gBunL, gBunR],
    fine: ['M-5 -12q2 3 1 5M2 -14q1 3 0 5M-20 0q2 2 4 0M20 0q-2 2 -4 0', 'M0.5 2c1.6 1.2 1.6 2.4 -0.5 2.8', bows, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: gFaceFill },
      { c: PAL.ochre, o: 0.9, d: `${gHair}${gBunL}${gBunR}` },
      { c: PAL.red, o: 0.9, d: bows },
      { c: PAL.rose, o: 0.7, d: dot(-7.5, 5, 2.4) + dot(7.5, 5, 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}

// The little girl (feet at 0,0), about 100 tall: a red dress with a white collar, slate shoes. Head
// at (0, -80); arms from the shoulders (±12, -62). upper: only the part above y = -36.
export const G_HEAD = [0, -80];
export const G_ARMS = {
  down: [
    [[-12, -62, 7], [-16, -52, 6.5], [-18, -42, 6.5], [-18, -36, 6.5]],
    [[12, -62, 7], [16, -52, 6.5], [18, -42, 6.5], [18, -36, 6.5]],
  ],
};
export function girl({ mood = 'happy', tilt = 0, arms = G_ARMS.down, upper = false } = {}) {
  const sides = upper
    ? 'M-7 -67C-13 -65 -15 -60 -15 -54C-15 -48 -16 -42 -16 -36M7 -67C13 -65 15 -60 15 -54C15 -48 16 -42 16 -36'
    : 'M-7 -67C-13 -65 -15 -60 -15 -54C-17 -42 -20 -30 -22 -18C-8 -15 8 -15 22 -18C20 -30 17 -42 15 -54C15 -60 13 -65 7 -67';
  const fill = upper
    ? 'M-7 -67C-13 -65 -15 -60 -15 -54C-15 -48 -16 -42 -16 -36L16 -36C16 -42 15 -48 15 -54C15 -60 13 -65 7 -67Z'
    : `${sides}Z`;
  const collar = 'M-8 -67C-6 -60 -1 -60 0 -64C1 -60 6 -60 8 -67C4 -68 -4 -68 -8 -67Z';
  const lines = [sides];
  const fine = [collar];
  const washes = [{ c: PAL.red, o: 0.68, d: fill }];
  if (!upper) {
    const legs = [limb([[-7, -17, 4.5], [-7, -4, 4]]), limb([[7, -17, 4.5], [7, -4, 4]])];
    const shoes = 'M-6 -4C-12 -4 -13 1 -9 1L-3 1L-3 -4ZM6 -4C12 -4 13 1 9 1L3 1L3 -4Z';
    lines.push(...legs, shoes);
    fine.push('M-14 -26l3 1M12 -32l-3 1');
    washes.push({ c: PAL.rose, o: 0.4, d: legs.map((d) => `${d}Z`).join('') }, { c: PAL.slate, o: 0.8, d: shoes });
  }
  const parts = arms.map((a) => arm(a, PAL.red, 0.68, 3.6));
  const head = place(girlHead({ mood }), `translate(${G_HEAD[0]} ${G_HEAD[1]}) rotate(${tilt})`);
  return merge({ lines, fine, washes, whites: [collar] }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// The old woman's head (centre of the face at 0,0): a red spotted headscarf knotted under her chin,
// a grey fringe, little round spectacles and rosy cheeks.
// the face outline stops under the grey fringe
const wFace = 'M-9 -9C-12 -5 -12.5 3 -11 7C-8 13 -4 14 0 14C4 14 8 13 11 7C12.5 3 12 -5 9 -9';
const wFaceFill = `${wFace}C6 -14 -6 -14 -9 -9Z`;
const wScarf = 'M-13 13C-21 4 -22 -12 -13 -19C-7 -24 7 -24 13 -19C22 -12 21 4 13 13C9 16 -9 16 -13 13Z';
const wKnot = 'M-3 14C-4 18 4 18 3 14ZM-1 17L-6 25L-1 24ZM1 17L6 25L1 24Z';
export function womanHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 7.5, r: 1.6, w: 4.5 });
  const specs = dot(-5, 0, 3.8) + dot(5, 0, 3.8);
  const spots = [dot(-15, -6, 1.4), dot(-11, -15, 1.4), dot(0, -19.5, 1.4), dot(11, -15, 1.4), dot(15, -6, 1.4), dot(-16, 4, 1.3), dot(16, 4, 1.3)];
  return {
    lines: [wScarf, wFace, 'M-3 14C-4 18 4 18 3 14'],
    fine: [
      specs,
      'M-1.2 -0.5q1.2 -1.2 2.4 0',
      'M-9 -9q3 -4 9 -4q6 0 9 4M-6 -10l1 3M0 -11l0 3M6 -10l-1 3',
      'M0.6 2.5c1.8 1.4 1.8 2.6 -0.6 3.2',
      'M-11 6q2 2 1 4M11 6q-2 2 -1 4',
      'M-1 17L-6 25L-1 24M1 17L6 25L1 24',
      ...m.fine,
    ],
    washes: [
      { c: PAL.red, o: 0.8, d: `${wScarf}${wFaceFill}`, rule: 'evenodd' },
      { c: PAL.red, o: 0.8, d: wKnot },
      { c: PAL.rose, o: 0.3, d: wFaceFill },
      { c: PAL.grey, o: 0.7, d: 'M-9 -9q3 -4 9 -4q6 0 9 4C6 -8 -6 -8 -9 -9Z' },
      { c: PAL.rose, o: 0.65, d: dot(-8, 6, 2.3) + dot(8, 6, 2.3) },
      ...m.washes,
    ],
    whites: [...spots, specs],
    fills: m.fills,
    glints: m.glints,
  };
}

// The old woman (feet at 0,0), about 140 tall: a long sky-blue dress, an ochre shawl and a white
// apron. Head at (0, -113), drawn 1.15 times bigger; arms from the shoulders (±17, -90). upper: only above y = -56.
export const W_HEAD = [0, -113];
export const W_ARMS = {
  down: [
    [[-17, -90, 9], [-22, -78, 8], [-24, -66, 8], [-23, -58, 8]],
    [[17, -90, 9], [22, -78, 8], [24, -66, 8], [23, -58, 8]],
  ],
};
export function woman({ mood = 'happy', tilt = 0, arms = W_ARMS.down, upper = false } = {}) {
  const top = 'M-12 -97C-21 -94 -23 -86 -23 -76';
  const topR = 'M12 -97C21 -94 23 -86 23 -76';
  const sides = upper ? `${top}L-23 -56${topR}L23 -56` : `${top}C-24 -50 -28 -24 -30 -5${topR}C24 -50 28 -24 30 -5C12 -1 -12 -1 -30 -5`;
  const fill = upper
    ? 'M-12 -97C-21 -94 -23 -86 -23 -76L-23 -56L23 -56L23 -76C23 -86 21 -94 12 -97Z'
    : 'M-12 -97C-21 -94 -23 -86 -23 -76C-24 -50 -28 -24 -30 -5C-12 -1 12 -1 30 -5C28 -24 24 -50 23 -76C23 -86 21 -94 12 -97Z';
  const shawl = 'M-13 -99C-22 -96 -25 -88 -24 -78C-13 -74 -4 -68 0 -60C4 -68 13 -74 24 -78C25 -88 22 -96 13 -99C7 -95 -7 -95 -13 -99Z';
  const apron = 'M-14 -64L14 -64C16 -44 18 -24 18 -10C6 -8 -6 -8 -18 -10C-18 -24 -16 -44 -14 -64Z';
  const lines = [sides, shawl];
  const fine = ['M-24 -81l-1 5M-18 -77l-1 5M-12 -73l-1 5M-6 -68l0 5M6 -68l0 5M12 -73l1 5M18 -77l1 5M24 -81l1 5'];
  const washes = [
    { c: PAL.sky, o: 0.6, d: fill },
    { c: PAL.ochre, o: 0.75, d: shawl },
  ];
  const whites = [];
  if (!upper) {
    const feet = 'M-12 -3C-18 -3 -19 2 -14 2L-4 2L-4 -3M12 -3C18 -3 19 2 14 2L4 2L4 -3';
    lines.push(feet, apron);
    fine.push('M-8 -40q1 10 0 22M8 -48q1 14 0 30', 'M-22 -30q-1 10 -2 20M22 -30q1 10 2 20');
    whites.push(apron);
    washes.push({ c: PAL.slate, o: 0.75, d: `${feet}Z` });
  }
  const parts = arms.map((a) => arm(a, PAL.sky, 0.6, 4.3));
  const head = place(womanHead({ mood }), `translate(${W_HEAD[0]} ${W_HEAD[1]}) rotate(${tilt}) scale(1.15)`);
  return merge({ lines, fine, washes, whites }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// Vegetables, each centred on (0,0).

/** An onion, about 18 wide, its tip up. */
export function onion() {
  const o = 'M0 -10C-2 -6 -9 -4 -9 2C-9 8 -4 10 0 10C4 10 9 8 9 2C9 -4 2 -6 0 -10Z';
  return {
    lines: [o],
    fine: ['M0 -10l1 -5M-1 10l-2 3M1 10l2 3', 'M-4 -3C-6 2 -5 6 -3 9M4 -3C6 2 5 6 3 9'],
    washes: [{ c: PAL.ochre, o: 0.9, d: o }, { c: PAL.terracotta, o: 0.4, d: o }],
  };
}

/** A round green cabbage of radius r: a wavy outline and leaves wrapped round its heart. */
export function cabbage(r = 14) {
  const n = 9;
  let c = '';
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const [x, y] = [Math.cos(a) * r, Math.sin(a) * r];
    if (i === 0) c += `M${f(x)} ${f(y)}`;
    else {
      const m = a - Math.PI / n;
      c += `Q${f(Math.cos(m) * r * 1.22)} ${f(Math.sin(m) * r * 1.22)} ${f(x)} ${f(y)}`;
    }
  }
  c += 'Z';
  const k = r / 14;
  const p = (pts) => pts.map(([x, y]) => `${f(x * k)} ${f(y * k)}`).join(' ');
  // two outer leaves wrap up from the stalk to either side of the pale heart
  const leaf1 = `M${p([[1, 13]])}C${p([[-10, 9], [-12, -4], [-3, -10]])}`;
  const leaf2 = `M${p([[-1, 13]])}C${p([[10, 9], [12, -4], [3, -10]])}`;
  const heart = `M${p([[-3, -10]])}C${p([[-1, -12], [1, -12], [3, -10]])}C${p([[6, -2], [-6, -2], [-3, -10]])}Z`;
  const veins = `M${p([[-12, 6]])}C${p([[-14, -2], [-12, -8], [-8, -11]])}M${p([[12, 6]])}C${p([[14, -2], [12, -8], [8, -11]])}`;
  return {
    lines: [c],
    fine: [leaf1, leaf2, veins],
    washes: [
      { c: PAL.green, o: 0.9, d: c },
      { c: PAL.green, o: 0.45, d: `${leaf1}C${p([[-10, -12], [-14, 2], [1, 13]])}Z${leaf2}C${p([[10, -12], [14, 2], [-1, 13]])}Z` },
      { c: PAL.ochre, o: 0.35, d: heart },
    ],
  };
}

/** A carrot pointing down from its green top at (0,0), about 30 long (top: false hides the leaves). */
export function carrot({ top: leaves = true } = {}) {
  const c = 'M-5 0C-4 10 -2 20 0 30C2 20 4 10 5 0C2 -1 -2 -1 -5 0Z';
  const top = 'M-2 -1C-6 -8 -8 -12 -6 -15M0 -1C0 -8 1 -12 3 -16M2 -1C6 -6 9 -9 11 -10';
  const green = 'M-2 -1C-6 -8 -8 -12 -6 -15C-3 -10 0 -6 2 -1ZM0 -1C0 -8 1 -12 3 -16C3 -10 4 -6 2 -1ZM2 -1C6 -6 9 -9 11 -10C9 -6 6 -3 3 0Z';
  return {
    lines: [c],
    fine: [...(leaves ? [top] : []), 'M-4 8l3 1M3 14l-3 1M-2 20l2 1'],
    washes: [{ c: PAL.terracotta, o: 0.9, d: c }, { c: PAL.ochre, o: 0.5, d: c }, ...(leaves ? [{ c: PAL.green, o: 0.85, d: green }] : [])],
  };
}

/** A knobbly potato about 20 wide. */
export function potato() {
  const p = 'M-10 0C-11 -6 -5 -8 0 -7C6 -8 11 -5 10 1C9 6 4 8 -1 7C-6 8 -10 5 -10 0Z';
  return {
    lines: [p],
    fine: ['M-4 -2l1 1M4 2l1 1M1 -4l1 1'],
    washes: [{ c: PAL.ochre, o: 0.6, d: p }, { c: PAL.grey, o: 0.55, d: p }],
  };
}

/** A sprig of parsley, its stalk at (0,0), about 22 tall. */
export function parsley() {
  const leaves = `${dot(-5, -16, 4.5)}${dot(3, -20, 4.5)}${dot(7, -12, 4)}${dot(-1, -11, 3.6)}`;
  return {
    fine: ['M0 0C0 -6 -2 -10 -4 -14M0 0C1 -8 2 -14 3 -18M0 0C3 -5 5 -8 7 -10', leaves],
    washes: [{ c: PAL.green, o: 0.95, d: leaves }],
  };
}

/** The round, smooth grey stone (centre 0,0), about 20 wide. */
export function stone() {
  const s = oval(0, 0, 10, 8);
  return {
    lines: [s],
    fine: ['M-3 4q4 2 8 -1'],
    washes: [{ c: PAL.grey, o: 0.95, d: s }, { c: PAL.slate, o: 0.5, d: s }],
    glints: ['M-6 -3q2 -3 6 -3q-3 1 -6 3Z'],
  };
}

/** A wicker basket (bottom centre 0,0), about 54 wide, with a handle. */
export function basket() {
  const b = 'M-27 -22L27 -22C25 -14 23 -6 19 0L-19 0C-23 -6 -25 -14 -27 -22Z';
  const handle = 'M-23 -22C-24 -48 24 -48 23 -22';
  return {
    lines: [b, handle],
    fine: ['M-26 -15L26 -15M-24 -8L24 -8', 'M-14 -22L-12 0M0 -22L0 0M14 -22L12 0'],
    washes: [{ c: PAL.ochre, o: 0.8, d: b }, { c: PAL.terracotta, o: 0.35, d: b }, { c: PAL.ochre, o: 0.6, d: limb([[-23, -22, 4], [-16, -40, 4], [0, -45, 4], [16, -40, 4], [23, -22, 4]]) }],
  };
}

// ---------------------------------------------------------------------------------------------
// The big black pot (feet at 0,0), about 120 wide and 125 tall, on three stubby legs. The mouth of
// the pot is the ellipse at (0, -110). inside: 'water' (bubbling water with the stone in it),
// 'soup' (golden soup), or 'full' (vegetables heaped up over the rim). fire: a little
// fire of crossed logs underneath.
export const POT_MOUTH = [0, -110];
const pBody = 'M-50 -110C-60 -96 -64 -70 -58 -50C-52 -32 -32 -22 0 -22C32 -22 52 -32 58 -50C64 -70 60 -96 50 -110';
const pIn = oval(0, -110, 42, 9);
export function pot({ inside = 'water', fire = true, withStone = true } = {}) {
  const outer = oval(0, -110, 50, 14);
  const legs = [limb([[-34, -28, 9], [-38, -2, 7]]), limb([[34, -28, 9], [38, -2, 7]]), limb([[-2, -22, 8], [-2, -2, 7]])];
  const ears = 'M-55 -98C-66 -100 -68 -88 -60 -84M55 -98C66 -100 68 -88 60 -84';
  const front = 'M-50 -110C-50 -102 -28 -96 0 -96C28 -96 50 -102 50 -110';
  const lines = [pBody, ...legs, ears];
  const fine = ['M-44 -60q-2 14 4 24M44 -64q3 12 -2 22'];
  // the black of the pot: with a heap of vegetables, only the front of the rim shows
  const dark = inside === 'full' ? `${pBody}L42 -110C42 -104 24 -101 0 -101C-24 -101 -42 -104 -42 -110Z` : `${pBody}A50 14 0 0 0 -50 -110Z${pIn}`;
  const washes = [
    { c: PAL.slate, o: 0.9, d: dark, rule: 'evenodd' },
    { c: PAL.ink, o: 0.55, d: dark, rule: 'evenodd' },
    { c: PAL.slate, o: 0.9, d: legs.map((d) => `${d}Z`).join('') },
    { c: PAL.ink, o: 0.5, d: legs.map((d) => `${d}Z`).join('') },
  ];
  const glints = ['M-46 -86C-50 -74 -49 -62 -44 -52C-46 -64 -46 -76 -42 -88Z'];
  const parts = [];
  if (inside === 'full') {
    // the heap hides the back of the rim
    lines.push(front, 'M-42 -110C-42 -104 -24 -101 0 -101C24 -101 42 -104 42 -110', 'M-50 -110C-50 -114 -48 -117 -44 -119M50 -110C50 -114 48 -117 44 -119');
    const heap = 'M-44 -110C-48 -124 -40 -136 -30 -134C-28 -150 -12 -158 0 -154C12 -158 28 -150 30 -134C40 -136 48 -124 44 -110C24 -104 -24 -104 -44 -110Z';
    washes.push({ c: PAL.ochre, o: 0.45, d: heap });
    parts.push(
      place(carrot({ top: false }), 'translate(-26 -128) rotate(160) scale(1.1)'),
      place(carrot({ top: false }), 'translate(27 -128) rotate(-158) scale(1.1)'),
      place(parsley(), 'translate(-12 -148) rotate(-24)'),
      place(parsley(), 'translate(12 -150) rotate(22) scale(0.95)'),
      place(cabbage(16), 'translate(0 -136)'),
      place(potato(), 'translate(-32 -115) rotate(-10) scale(1.05)'),
      place(onion(), 'translate(-11 -116) scale(0.9)'),
      place(potato(), 'translate(10 -114) rotate(8)'),
      place(onion(), 'translate(31 -117) rotate(12) scale(0.9)'),
    );
  } else {
    lines.push(outer, pIn);
    const bubbles = [dot(-28, -110, 3), dot(-18, -106, 2.2), dot(30, -108, 2.4), dot(34, -113, 1.6), dot(-32, -114, 1.6)];
    washes.push({ c: inside === 'soup' ? PAL.ochre : PAL.sky, o: 0.7, d: pIn });
    fine.push(...bubbles);
    if (inside === 'water' && withStone) parts.push(place(stone(), 'translate(6 -110) scale(1.35 0.8)'));
  }
  if (fire) {
    const logs = [limb([[-56, 4, 9], [50, -2, 9]]), limb([[-48, -4, 9], [56, 4, 9]])];
    const flames = transformPath(
      'M-50 -2C-58 -12 -52 -22 -50 -32C-46 -24 -42 -18 -40 -14C-40 -22 -36 -30 -30 -36C-28 -28 -22 -22 -20 -16C-18 -24 -12 -30 -8 -34C-4 -26 2 -22 4 -16C8 -24 14 -28 18 -36C22 -26 26 -22 28 -14C32 -22 38 -26 44 -32C46 -22 52 -14 50 -2Z',
      'scale(1 0.72)',
    );
    const core = 'M-36 -2C-36 -6 -32 -9 -30 -13C-26 -9 -22 -9 -18 -12C-14 -7 -8 -9 -4 -13C0 -9 6 -9 10 -12C14 -7 20 -9 24 -13C28 -7 32 -6 32 -2Z';
    lines.push(...logs);
    fine.push(flames, 'M-40 2l6 -1M30 1l6 1M-10 0l5 0');
    washes.push(
      { c: PAL.terracotta, o: 0.8, d: logs.map((d) => `${d}Z`).join('') },
      { c: PAL.red, o: 0.85, d: flames },
      { c: PAL.ochre, o: 0.95, d: core },
    );
  }
  return merge({ lines, fine, washes, glints }, ...parts);
}

/** Curls of steam rising from (0,0), about 50 tall. */
export function steam(n = 3, h = 50) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = (i - (n - 1) / 2) * 14;
    d += `M${x} 0c-6 -${h / 6} 6 -${h / 3} 0 -${h / 2}c-6 -${h / 6} 6 -${h / 3} 0 -${h / 2}`;
  }
  return { fine: [d] };
}
