import { PAL, rays, transformPath } from '../lib.mjs';

// The Frog Prince: the characters and props shared by the ten pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. Standing characters have their feet at y = 0; the frog sits with its bottom at y = 0.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint, ball) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (arm, leg) along a centreline of [x, y, width] points, open at the root. */
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
  const pathTags = (list) => list.filter(Boolean).map((d) => `<path d="${d}"/>`).join('');
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
function arm(pts, sleeve, o = 0.55, hand = 3.6) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.45, d: h }] };
}

/**
 * Eyes, brows and mouth of the children's faces (eyes at ±ex, ey; mouth at my).
 * mood: 'happy', 'cry', 'cross', 'crossShut' (asleep, still cross), 'laugh', 'wow', 'sly', 'asleep'.
 */
function faceMarks(mood, { ex = 5, ey = 0, my = 7, r = 1.7 } = {}) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const open = () => {
    fills.push(dot(-ex, ey, r), dot(ex, ey, r));
    glints.push(dot(-ex - 0.5, ey - 0.6, 0.5), dot(ex - 0.5, ey - 0.6, 0.5));
  };
  if (mood === 'happy') {
    open();
    fine.push(`M-4 ${my}q4 4 8 0`);
  } else if (mood === 'sly') {
    fills.push(dot(-ex + 1.3, ey + 0.4, r), dot(ex + 1.3, ey + 0.4, r));
    fine.push(`M${-ex - 3} ${ey - 2.5}l6 1M${ex - 3} ${ey - 1.5}l6 -1`, `M-3 ${my}q5 3 7 -2`);
  } else if (mood === 'cry') {
    fine.push(`M${-ex - 3} ${ey}q3 2 6 0M${ex - 3} ${ey}q3 2 6 0`, `M${-ex - 3} ${ey - 5}l5 -2M${ex + 3} ${ey - 5}l-5 -2`);
    fills.push(`M-4 ${my + 3}q4 -6 8 0q-4 -2 -8 0Z`);
    const tears = dot(-ex - 1, ey + 6, 1.6) + dot(ex + 1, ey + 6, 1.6) + dot(-ex - 2, ey + 11, 1.3);
    washes.push({ c: PAL.sky, o: 0.95, d: tears });
    fine.push(`M${-ex - 1} ${ey + 2}l0 2.5M${ex + 1} ${ey + 2}l0 2.5`);
  } else if (mood === 'cross' || mood === 'crossShut') {
    if (mood === 'cross') open();
    else fine.push(`M${-ex - 3} ${ey}l6 0M${ex - 3} ${ey}l6 0`);
    fine.push(`M${-ex - 4} ${ey - 5}l7 2.5M${ex + 4} ${ey - 5}l-7 2.5`, `M-4 ${my + 1.5}q4 -3.5 8 0`);
  } else if (mood === 'laugh') {
    fine.push(`M${-ex - 3} ${ey + 0.5}q3 -3.5 6 0M${ex - 3} ${ey + 0.5}q3 -3.5 6 0`);
    fills.push(`M-5 ${my - 1}q5 1 10 0q-1 7 -5 7q-4 0 -5 -7Z`);
  } else if (mood === 'wow') {
    fills.push(dot(-ex, ey, r + 0.4), dot(ex, ey, r + 0.4), oval(0, my + 1, 2.2, 3));
    glints.push(dot(-ex - 0.6, ey - 0.7, 0.6), dot(ex - 0.6, ey - 0.7, 0.6));
    fine.push(`M${-ex - 3} ${ey - 6}q3 -2 6 0M${ex - 3} ${ey - 6}q3 -2 6 0`);
  } else if (mood === 'asleep') {
    fine.push(`M${-ex - 3} ${ey}q3 2.5 6 0M${ex - 3} ${ey}q3 2.5 6 0`, `M-3 ${my}q3 2 6 0`);
  }
  return { fine, fills, glints, washes };
}

// ---------------------------------------------------------------------------------------------
// The princess's head (centre of the face at 0,0): golden hair to her shoulders with a fringe, a little
// golden crown, rosy cheeks.
const pFace = oval(0, 0, 13, 14);
const pTop = 'M-14 1C-17 -13 -9 -20 0 -20C9 -20 17 -13 14 1C12 -6 7 -10 1 -8C-4 -11 -11 -7 -14 1Z';
const pLockL = 'M-13 -2C-18 6 -19 18 -15 27C-12 29 -9 26 -10 20C-11 14 -10 7 -10 1Z';
const pLockR = 'M13 -2C18 6 19 18 15 27C12 29 9 26 10 20C11 14 10 7 10 1Z';
const pCrown = 'M-8 -18L-10 -29L-4 -23L0 -31L4 -23L10 -29L8 -18C3 -20 -3 -20 -8 -18Z';
export function princessHead({ mood = 'happy', crown = true } = {}) {
  const m = faceMarks(mood, { ex: 5, ey: 1, my: 7 });
  const lines = [pFace, pTop, pLockL, pLockR];
  const washes = [
    { c: PAL.rose, o: 0.28, d: pFace },
    { c: PAL.ochre, o: 0.78, d: pTop + pLockL + pLockR },
    { c: PAL.rose, o: 0.6, d: dot(-8.5, 6, 2.4) + dot(8.5, 6, 2.4) },
    ...m.washes,
  ];
  const fine = ['M-6 -12q2 4 1 7M2 -12q2 3 4 5', ...m.fine];
  if (crown) {
    lines.push(pCrown);
    washes.push({ c: PAL.ochre, o: 0.9, d: pCrown });
    fine.push(dot(0, -21, 1.2));
  }
  return { lines, fine, washes, fills: m.fills, glints: m.glints };
}

// The princess (feet at 0,0), about 145 tall: a rose bell-shaped dress with a golden sash. Her head
// sits at P_HEAD, turned by tilt. arms: two limb centrelines from the shoulders (±10, -91). run: one
// foot kicked back under the hem.
export const P_HEAD = [0, -110];
export const P_ARMS = {
  down: [
    [[-10, -91, 7], [-16, -80, 6], [-19, -68, 6]],
    [[10, -91, 7], [16, -80, 6], [19, -68, 6]],
  ],
  // both hands up together, throwing (or about to catch) the ball overhead
  up: [
    [[-10, -91, 7], [-23, -106, 6], [-24, -126, 6], [-18, -144, 6]],
    [[10, -91, 7], [23, -106, 6], [24, -126, 6], [18, -144, 6]],
  ],
  // right hand raised, palm out: "I promise!"; left on her chest
  promise: [
    [[-10, -91, 7], [-16, -80, 6], [-6, -78, 6]],
    [[10, -91, 7], [24, -96, 6], [28, -116, 6]],
  ],
  // both fists rubbing her eyes
  cry: [
    [[-10, -91, 7], [-22, -88, 6], [-17, -101, 6]],
    [[10, -91, 7], [22, -88, 6], [17, -101, 6]],
  ],
  // hugging the ball to her chest
  hug: [
    [[-10, -91, 7], [-16, -82, 6], [-4, -76, 6]],
    [[10, -91, 7], [16, -82, 6], [5, -78, 6]],
  ],
  // arms folded, sulking
  fold: [
    [[-10, -91, 7], [-17, -82, 6], [6, -80, 6]],
    [[10, -91, 7], [17, -80, 6], [-5, -78, 6]],
  ],
};
const pDress =
  'M-10 -96C-13 -86 -13 -77 -11 -69C-19 -50 -29 -26 -33 -5C-12 -1 12 -1 33 -5C29 -26 19 -50 11 -69C13 -77 13 -86 10 -96C4 -99 -4 -99 -10 -96Z';
const pSash = 'M-11 -69C-4 -66 4 -66 11 -69L11 -74C4 -71 -4 -71 -11 -74Z';
const pHem = 'M-30 -14C-14 -9 14 -9 30 -14';
export function princess({ mood = 'happy', tilt = 0, arms = P_ARMS.down, run = false, crown = true } = {}) {
  const lines = [pDress];
  const fine = [pSash, pHem, 'M-3 -96q3 3 6 0'];
  const washes = [
    { c: PAL.rose, o: 0.62, d: pDress },
    { c: PAL.ochre, o: 0.8, d: pSash },
    { c: PAL.rose, o: 0.35, d: 'M-4 -97L4 -97L3 -103L-3 -103Z' },
  ];
  const neck = 'M-3 -97L-3 -102M3 -97L3 -102';
  fine.push(neck);
  const feet = run
    ? 'M-12 -4C-14 0 -22 1 -24 -3L-17 -6M14 -6C20 -8 28 -10 30 -6C30 -2 22 -1 16 -2'
    : 'M-14 -3C-16 2 -6 2 -5 -2M14 -3C16 2 6 2 5 -2';
  lines.push(feet);
  washes.push({ c: PAL.terracotta, o: 0.7, d: run ? 'M-12 -4C-14 0 -22 1 -24 -3L-17 -6ZM14 -6C20 -8 28 -10 30 -6C30 -2 22 -1 16 -2Z' : 'M-14 -3C-16 2 -6 2 -5 -2ZM14 -3C16 2 6 2 5 -2Z' });
  const parts = arms.map((a) => arm(a, PAL.rose, 0.55));
  const head = place(princessHead({ mood, crown }), `translate(${P_HEAD[0]} ${P_HEAD[1]}) rotate(${tilt})`);
  return merge({ lines, fine, washes }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// The frog (sitting, bottom centre at 0,0, facing us), about 56 wide and 46 tall: a fat green body with
// a pale tummy, two big goggly eyes on top, a very wide mouth, folded back legs with webbed feet.
// mood: 'happy', 'sad', 'shut' (asleep), 'wow', 'chew' (cheeks full). look: pupils' shift [dx, dy].
// mouth: false to leave the mouth out (when something is in it).
const frBody = 'M-21 -3C-28 -13 -25 -30 -13 -36C-6 -39 6 -39 13 -36C25 -30 28 -13 21 -3C10 1 -10 1 -21 -3Z';
const frEyeL = 'M-19 -35C-20 -45 -12 -49 -7 -46C-3 -44 -2 -39 -4 -35';
const frEyeR = 'M19 -35C20 -45 12 -49 7 -46C3 -44 2 -39 4 -35';
const frLegL = 'M-20 -6C-32 -6 -36 -18 -27 -24C-24 -26 -22 -22 -23 -14M-23 -1L-36 -1C-41 -1 -41 3 -36 3L-22 3';
const frLegR = 'M20 -6C32 -6 36 -18 27 -24C24 -26 22 -22 23 -14M23 -1L36 -1C41 -1 41 3 36 3L22 3';
const frLegsWash = 'M-20 -6C-32 -6 -36 -18 -27 -24C-24 -26 -22 -22 -23 -14ZM-23 -1L-36 -1C-41 -1 -41 3 -36 3L-22 3ZM20 -6C32 -6 36 -18 27 -24C24 -26 22 -22 23 -14ZM23 -1L36 -1C41 -1 41 3 36 3L22 3Z';
const frArms = 'M-9 -12C-11 -8 -11 -4 -10 0M9 -12C11 -8 11 -4 10 0';
const frFingers = 'M-14 1l4 -1l4 1M-10 0l0 2M6 1l4 -1l4 1M10 0l0 2';
const frTummy = 'M-12 -6C-14 -14 -8 -21 0 -21C8 -21 14 -14 12 -6C6 -3 -6 -3 -12 -6Z';
const frSpots = dot(-17, -26, 1.8) + dot(15, -18, 1.5) + dot(18, -29, 1.3) + dot(-19, -15, 1.4);
export const FROG_EYES = [[-11.5, -40], [11.5, -40]];
export function frog({ mood = 'happy', look = [0, 0], mouth = true } = {}) {
  const lines = [frBody, frEyeL, frEyeR, frLegL, frLegR];
  const fine = [frArms, frFingers, 'M-4 -31l0 0.5M4 -31l0 0.5'];
  const washes = [
    { c: PAL.green, o: 0.85, d: frBody + 'M-19 -35C-20 -45 -12 -49 -7 -46C-3 -44 -2 -39 -4 -35ZM19 -35C20 -45 12 -49 7 -46C3 -44 2 -39 4 -35Z' + frLegsWash },
    { c: PAL.ochre, o: 0.4, d: frTummy },
    { c: PAL.green, o: 0.7, d: frSpots },
  ];
  const whites = [];
  const fills = [];
  const glints = [];
  const [lx, ly] = look;
  if (mood === 'shut') {
    fine.push('M-15 -39q3.5 2.5 7 0M8 -39q3.5 2.5 7 0');
  } else {
    whites.push(dot(-11.5, -40, 4.6), dot(11.5, -40, 4.6));
    fine.push(dot(-11.5, -40, 4.6), dot(11.5, -40, 4.6));
    const r = mood === 'wow' ? 2.8 : 2.3;
    fills.push(dot(-11.5 + lx, -40 + ly, r), dot(11.5 + lx, -40 + ly, r));
    glints.push(dot(-12.3 + lx, -41 + ly, 0.7), dot(10.7 + lx, -41 + ly, 0.7));
    if (mood === 'sad') fine.push('M-17 -48l7 -2M17 -48l-7 -2');
  }
  if (mouth) {
    if (mood === 'sad') fine.push('M-12 -24C-6 -28 6 -28 12 -24');
    else if (mood === 'wow') fine.push('M-12 -27C-6 -24 6 -24 12 -27', oval(0, -25, 3, 2.4));
    else fine.push('M-15 -28C-8 -22 8 -22 15 -28M-16 -27l-2 -2M16 -27l2 -2');
  }
  if (mood === 'chew') washes.push({ c: PAL.green, o: 0.5, d: dot(-15, -24, 4) + dot(15, -24, 4) });
  return { lines, fine, washes, whites, fills, glints };
}

// The frog in mid-hop (bottom centre at 0,0, facing right): body stretched, back legs kicked out.
const fjBody = 'M-16 -10C-20 -22 -8 -34 8 -34C20 -34 28 -26 26 -16C24 -8 12 -4 0 -5C-8 -5 -14 -6 -16 -10Z';
const fjEye = 'M10 -32C10 -42 20 -44 24 -38C26 -34 25 -30 22 -28';
const fjLeg = 'M-14 -12C-26 -14 -38 -8 -46 -4L-54 -6M-46 -4L-52 0M-12 -8C-22 -4 -34 2 -42 6L-50 6M-42 6L-46 10';
const fjArm = 'M18 -8C22 -2 26 2 30 4L34 3M30 4L32 7';
export function frogHop({ mood = 'happy' } = {}) {
  const lines = [fjBody, fjEye, fjLeg];
  const fine = [fjArm, mood === 'sad' ? 'M14 -18C18 -21 22 -21 26 -19' : 'M12 -20C17 -16 22 -16 27 -20'];
  const washes = [
    { c: PAL.green, o: 0.85, d: fjBody + 'M10 -32C10 -42 20 -44 24 -38C26 -34 25 -30 22 -28Z' + limb([[-14, -12, 7], [-30, -12, 6], [-46, -4, 4]]) + 'Z' + limb([[-12, -8, 6], [-28, 0, 5], [-42, 6, 4]]) + 'Z' },
    { c: PAL.ochre, o: 0.4, d: 'M-10 -8C-2 -6 12 -6 20 -10C14 -4 0 -3 -10 -8Z' },
    { c: PAL.green, o: 0.7, d: dot(-4, -26, 1.6) + dot(4, -18, 1.4) },
  ];
  const whites = [dot(17, -36, 4.2)];
  fine.push(dot(17, -36, 4.2));
  const fills = [dot(18.5, -36, 2.2)];
  const glints = [dot(17.8, -37, 0.6)];
  if (mood === 'sad') fine.push('M12 -44l8 1');
  return { lines, fine, washes, whites, fills, glints };
}

// ---------------------------------------------------------------------------------------------
// The golden ball (centre 0,0, radius r) with a shine and a band round its middle.
export function ball(r = 10) {
  const d = dot(0, 0, r);
  return {
    lines: [d],
    fine: [`M${f(-r)} 0C${f(-r * 0.5)} ${f(r * 0.45)} ${f(r * 0.5)} ${f(r * 0.45)} ${f(r)} 0`],
    washes: [{ c: PAL.ochre, o: 0.95, d }],
    glints: [`M${f(-r * 0.55)} ${f(-r * 0.25)}q${f(r * 0.15)} ${f(-r * 0.4)} ${f(r * 0.5)} ${f(-r * 0.45)}q${f(-r * 0.25)} ${f(r * 0.2)} ${f(-r * 0.5)} ${f(r * 0.45)}Z`],
  };
}

// ---------------------------------------------------------------------------------------------
// The king's head (centre 0,0): a big round face, a bushy white beard and moustache, a tall golden crown.
const kFace = oval(0, 0, 14, 15);
const kBeard = 'M-14 1C-17 14 -9 30 0 32C9 30 17 14 14 1C10 8 5 6 0 8C-5 6 -10 8 -14 1Z';
const kMoustache = 'M0 5C-4 2 -10 3 -12 7C-8 6 -4 8 0 7C4 8 8 6 12 7C10 3 4 2 0 5Z';
const kCrown = 'M-13 -11L-15 -30L-8 -21L-3 -33L3 -21L8 -33L15 -21L14 -11C5 -14 -5 -14 -13 -11Z';
const kHair = 'M-14 -5C-18 -4 -19 4 -15 6M14 -5C18 -4 19 4 15 6';
export function kingHead({ mood = 'stern' } = {}) {
  const lines = [kFace, kBeard, kCrown];
  const fine = [kMoustache, kHair, 'M0.5 -1c2 2 2 4 -0.5 4.5', 'M-6 22q-1 4 1 7M6 20q1 4 -1 7M0 14l0 6'];
  const fills = [];
  const glints = [];
  if (mood === 'stern') {
    fine.push('M-10 -7l7 1.5M10 -7l-7 1.5');
    fills.push(dot(-5.5, -2, 1.7), dot(5.5, -2, 1.7));
  } else {
    fine.push('M-10 -8q4 -2 7 0M3 -8q4 -2 7 0', 'M-8 -2q2.5 -2.5 5 0M3 -2q2.5 -2.5 5 0');
  }
  const washes = [
    { c: PAL.rose, o: 0.32, d: kFace },
    { c: PAL.grey, o: 0.35, d: kBeard + kMoustache },
    { c: PAL.ochre, o: 0.9, d: kCrown },
    { c: PAL.red, o: 0.85, d: dot(-8, -16, 1.6) + dot(0, -17, 1.8) + dot(8, -16, 1.6) },
    { c: PAL.rose, o: 0.55, d: dot(-9, 2, 2.4) + dot(9, 2, 2.4) },
  ];
  return { lines, fine, washes, fills, glints, whites: [kBeard] };
}

// The king's upper body (the middle of his waist at 0,0; the table hides the rest): a red robe with a
// white ermine collar. arms: two limb centrelines from the shoulders (±20, -48).
export const K_HEAD = [0, -70];
export const K_ARMS = {
  rest: [
    [[-20, -48, 11], [-28, -30, 10], [-24, -10, 9]],
    [[20, -48, 11], [28, -30, 10], [24, -10, 9]],
  ],
  // right hand raised with one finger up: "A promise is a promise."
  finger: [
    [[-20, -48, 11], [-28, -30, 10], [-20, -8, 9]],
    [[20, -48, 11], [34, -42, 10], [40, -64, 9]],
  ],
};
const kRobe = 'M-24 0C-28 -20 -28 -38 -22 -48C-14 -54 14 -54 22 -48C28 -38 28 -20 24 0Z';
const kCollar = 'M-20 -50C-12 -42 12 -42 20 -50C14 -56 -14 -56 -20 -50Z';
export function king({ mood = 'stern', arms = K_ARMS.rest, finger = false } = {}) {
  const lines = [kRobe];
  const fine = [kCollar, 'M0 -44L0 0'];
  const washes = [
    { c: PAL.red, o: 0.62, d: kRobe },
    { c: PAL.paper, o: 1, d: kCollar },
  ];
  const fills = [dot(-10, -48, 0.9), dot(-2, -46, 0.9), dot(6, -47, 0.9), dot(13, -49, 0.9)];
  const parts = arms.map((a) => arm(a, PAL.red, 0.55, 5));
  if (finger) {
    const [x, y] = arms[1][arms[1].length - 1];
    const d = `M${x - 1.5} ${y - 3}L${x - 1} ${y - 13}C${x - 1} ${y - 15} ${x + 2} ${y - 15} ${x + 2} ${y - 13}L${x + 2} ${y - 3}`;
    parts.push({ lines: [], fine: [d], washes: [{ c: PAL.rose, o: 0.45, d: `${d}Z` }] });
  }
  const head = place(kingHead({ mood }), `translate(${K_HEAD[0]} ${K_HEAD[1]})`);
  return merge({ lines, fine, washes, fills }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// The prince (feet at 0,0), the size of the princess: a boy with short red-brown hair, a little golden
// crown, frog-green eyes and a green tunic over slate tights.
const prTop = 'M-14 1C-17 -13 -9 -20 0 -20C9 -20 17 -13 14 1C12 -5 9 -8 6 -7C4 -10 -2 -11 -5 -8C-9 -9 -12 -5 -14 1Z';
export function princeHead({ mood = 'happy' } = {}) {
  const m = faceMarks(mood, { ex: 5, ey: 1, my: 7 });
  const lines = [pFace, prTop, pCrown];
  const washes = [
    { c: PAL.rose, o: 0.28, d: pFace },
    { c: PAL.terracotta, o: 0.75, d: prTop },
    { c: PAL.ochre, o: 0.9, d: pCrown },
    { c: PAL.rose, o: 0.6, d: dot(-8.5, 6, 2.4) + dot(8.5, 6, 2.4) },
    { c: PAL.green, o: 0.9, d: dot(-5, 1, 2.4) + dot(5, 1, 2.4) },
    ...m.washes,
  ];
  return { lines, fine: ['M-14 -1q-3 3 0 6M14 -1q3 3 0 6', dot(0, -21, 1.2), ...m.fine], washes, fills: m.fills, glints: m.glints };
}
export const PR_ARMS = {
  down: P_ARMS.down,
  wave: [
    [[-10, -91, 7], [-16, -80, 6], [-19, -68, 6]],
    [[10, -91, 7], [22, -100, 6], [26, -118, 6]],
  ],
};
const prTunic = 'M-11 -96C-15 -84 -16 -64 -17 -40L17 -40C16 -64 15 -84 11 -96C4 -99 -4 -99 -11 -96Z';
const prBelt = 'M-16 -58L16 -58L16 -53L-16 -53Z';
const prLegs = 'M-12 -40L-11 -6M-3 -40L-4 -6M3 -40L4 -6M12 -40L11 -6';
const prBoots = 'M-11 -8L-12 0L-20 0C-22 -3 -18 -6 -14 -6M11 -8L12 0L20 0C22 -3 18 -6 14 -6';
export function prince({ mood = 'happy', tilt = 0, arms = PR_ARMS.down } = {}) {
  const lines = [prTunic, prLegs, prBoots];
  const fine = ['M-17 -40q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0', 'M-3 -96q3 3 6 0M-3 -97L-3 -102M3 -97L3 -102'];
  const washes = [
    { c: PAL.green, o: 0.7, d: prTunic },
    { c: PAL.terracotta, o: 0.8, d: prBelt },
    { c: PAL.slate, o: 0.5, d: 'M-12 -40L-11 -6L-4 -6L-3 -40ZM3 -40L4 -6L11 -6L12 -40Z' },
    { c: PAL.terracotta, o: 0.8, d: 'M-11 -8L-12 0L-20 0C-22 -3 -18 -6 -14 -6ZM11 -8L12 0L20 0C22 -3 18 -6 14 -6Z' },
  ];
  fine.push(prBelt);
  const parts = arms.map((a) => arm(a, PAL.green, 0.6));
  const head = place(princeHead({ mood }), `translate(${P_HEAD[0]} ${P_HEAD[1]}) rotate(${tilt})`);
  return merge({ lines, fine, washes }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// Faithful Heinrich, the prince's servant (feet at 0,0), about 180 tall: a coachman's tall hat, a big
// moustache and a long slate coat. popped: the three iron bands round his chest burst off (ping!).
const hFace = oval(0, 0, 14, 16);
const hHat = 'M-13 -11L-11 -38L11 -38L13 -11ZM-21 -11L21 -11';
const hMoustache = 'M0 6C-4 2 -14 2 -17 8C-12 7 -6 10 0 8C6 10 12 7 17 8C14 2 4 2 0 6Z';
const hCoat = 'M-19 -138C-27 -116 -29 -74 -28 -40L28 -40C29 -74 27 -116 19 -138C9 -142 -9 -142 -19 -138Z';
const hLegs = 'M-14 -40L-14 -6M-3 -40L-3 -6M3 -40L3 -6M14 -40L14 -6';
const hBoots = 'M-14 -8L-14 0L-24 0C-26 -4 -20 -8 -14 -8ZM14 -8L14 0L24 0C26 -4 20 -8 14 -8Z';
export const H_HEAD = [0, -158];
export function heinrich({ popped = true } = {}) {
  const lines = [hFace, hHat, hCoat, hLegs, hBoots];
  const fine = [hMoustache, 'M-9 -4q3 -3 6 0M3 -4q3 -3 6 0', 'M-5 12q5 4 10 0', 'M0 -138L0 -40', dot(-4, -110, 1.5), dot(-4, -80, 1.5), dot(-4, -56, 1.5)];
  const washes = [
    { c: PAL.slate, o: 0.6, d: hCoat },
    { c: PAL.ink, o: 0.55, d: 'M-13 -11L-11 -38L11 -38L13 -11ZM-21 -12L21 -12L21 -10L-21 -10Z' },
    { c: PAL.rose, o: 0.35, d: hFace },
    { c: PAL.grey, o: 0.6, d: hMoustache },
    { c: PAL.rose, o: 0.6, d: dot(-9, 3, 2.4) + dot(9, 3, 2.4) },
    { c: PAL.grey, o: 0.5, d: 'M-14 -40L-14 -6L-3 -6L-3 -40ZM3 -40L3 -6L14 -6L14 -40Z' },
    { c: PAL.terracotta, o: 0.8, d: hBoots },
  ];
  const head = (d) => transformPath(d, `translate(${H_HEAD[0]} ${H_HEAD[1]})`);
  const out = { lines: lines.map((d, i) => (i < 2 ? head(d) : d)), fine: fine.map((d, i) => (i < 3 ? head(d) : d)), washes: washes.map((w, i) => (i === 1 || i === 2 || i === 3 || i === 4 ? { ...w, d: head(w.d) } : w)) };
  // arms flung up for joy
  const arms = [
    [[-19, -132, 11], [-34, -142, 10], [-42, -164, 9], [-44, -180, 9]],
    [[19, -132, 11], [34, -142, 10], [42, -164, 9], [44, -180, 9]],
  ].map((a) => arm(a, PAL.slate, 0.6, 5));
  // the three iron bands: whole round his chest, or burst in two halves flying off with a "ping!"
  const bands = [];
  const bandWash = [];
  const pings = [];
  for (const [i, y] of [-128, -108, -88].entries()) {
    const half = (s) => `M${s * 2} ${y}C${s * 12} ${y + 1} ${s * 22} ${y - 1} ${s * 28} ${y - 6}L${s * 30} ${y}C${s * 23} ${y + 5} ${s * 12} ${y + 7} ${s * 2} ${y + 6}Z`;
    for (const s of [-1, 1]) {
      const t = popped ? `translate(${s * (22 + i * 5)} ${-8 + i * 2}) rotate(${s * -24} ${s * 15} ${y})` : '';
      const d = t ? transformPath(half(s), t) : half(s);
      bands.push(d);
      bandWash.push(d);
      if (popped) pings.push(transformPath(rays(0, 0, 5, 12, 6, 5 + i * 2 + (s > 0 ? 1 : 0)), `translate(${s * (54 + i * 4)} ${y - 18 + i * 2})`));
    }
  }
  return merge(
    out,
    { lines: bands, fine: pings, washes: [{ c: PAL.slate, o: 0.85, d: bandWash.join('') }] },
    ...arms,
  );
}

// ---------------------------------------------------------------------------------------------
// The well (centre of the rim's front at 0,0): a round stone well seen a little from above, rim 140
// wide. water: a dark round of water inside.
export function well({ w = 140, h = 70 } = {}) {
  const a = w / 2;
  const rimTop = `M${-a} 0C${-a} ${-22} ${a} ${-22} ${a} 0`;
  const rimFront = `M${-a} 0C${-a} 18 ${a} 18 ${a} 0`;
  const inner = `M${-a + 10} 0C${-a + 10} -14 ${a - 10} -14 ${a - 10} 0C${a - 10} 9 ${-a + 10} 9 ${-a + 10} 0Z`;
  const sides = `M${-a} 0L${-a + 2} ${h}C${-a + 30} ${h + 14} ${a - 30} ${h + 14} ${a - 2} ${h}L${a} 0`;
  const stones =
    `M${-a + 16} 22l0 14M${-a + 44} 26l0 14M${-12} 28l0 14M${22} 27l0 14M${a - 26} 23l0 14` +
    `M${-a + 2} 36C${-a + 30} 50 ${a - 30} 50 ${a - 2} 36` +
    `M${-a + 30} 50l0 14M${0} 54l0 14M${a - 40} 50l0 14`;
  return {
    lines: [rimTop + rimFront, sides],
    fine: [stones, inner],
    washes: [
      { c: PAL.grey, o: 0.55, d: `M${-a} 0C${-a} -22 ${a} -22 ${a} 0L${a - 2} ${h}C${a - 30} ${h + 14} ${-a + 30} ${h + 14} ${-a + 2} ${h}Z` },
      { c: PAL.slate, o: 0.75, d: inner },
    ],
    whites: [],
  };
}

// The old lime tree (foot of the trunk at 0,0), about 230 tall: crown of soft round leaves.
export function limeTree() {
  const trunk = 'M-12 0C-8 -40 -12 -90 -6 -130M12 0C8 -40 14 -90 8 -130M-12 0C-4 4 6 4 12 0';
  const branches = 'M-4 -120C-20 -140 -36 -150 -50 -156M6 -122C20 -142 36 -150 52 -152M0 -126L2 -160';
  const crown =
    'M-70 -150C-92 -164 -86 -200 -60 -204C-58 -228 -24 -238 -6 -224C12 -240 48 -232 52 -208C78 -206 90 -176 72 -160C80 -140 58 -124 36 -132C20 -122 -12 -122 -26 -132C-46 -124 -72 -132 -70 -150Z';
  return {
    lines: [trunk, branches, crown],
    fine: ['M-4 -40c3 5 3 10 0 14M4 -80c-3 5 -3 10 0 14', 'M-46 -186c3 -5 8 -5 10 0M10 -206c3 -5 8 -5 10 0M38 -170c3 -5 8 -5 10 0M-20 -160c3 -5 8 -5 10 0'],
    washes: [
      { c: PAL.green, o: 0.6, d: crown },
      { c: PAL.ochre, o: 0.5, d: 'M-12 0C-8 -40 -12 -90 -6 -130L8 -130C14 -90 8 -40 12 0Z' },
    ],
  };
}

/** Water splashing up on both sides (around 0,0), with flying drops. */
export function splash(s = 1) {
  const d =
    `M${-10 * s} 0C${-18 * s} ${-6 * s} ${-24 * s} ${-14 * s} ${-28 * s} ${-22 * s}M${-16 * s} ${2 * s}C${-24 * s} ${-2 * s} ${-32 * s} ${-6 * s} ${-38 * s} ${-12 * s}` +
    `M${10 * s} 0C${18 * s} ${-6 * s} ${24 * s} ${-14 * s} ${28 * s} ${-22 * s}M${16 * s} ${2 * s}C${24 * s} ${-2 * s} ${32 * s} ${-6 * s} ${38 * s} ${-12 * s}`;
  const drops = dot(-32 * s, -30 * s, 2.4 * s) + dot(32 * s, -30 * s, 2.4 * s) + dot(-44 * s, -18 * s, 2 * s) + dot(44 * s, -18 * s, 2 * s) + dot(-24 * s, -40 * s, 1.8 * s) + dot(24 * s, -40 * s, 1.8 * s);
  return { lines: [], fine: [d, drops], washes: [{ c: PAL.sky, o: 0.85, d: drops }] };
}

// The frog peeping over the rim of the well (the rim at y = 0): the top of his head, his goggly eyes
// and his fingers holding on. look: pupils' shift [dx, dy].
export function frogPeep({ look = [0, 0] } = {}) {
  const top = 'M-21 2C-22 -6 -20 -11 -18 -13C-20 -23 -12 -28 -7 -25C-3 -23 -2 -18 -4 -14C-1 -15 1 -15 4 -14C2 -18 3 -23 7 -25C12 -28 20 -23 18 -13C20 -11 22 -6 21 2';
  const hands = 'M-30 3l2 -5l3 4l2 -5l3 5M24 3l2 -5l3 4l2 -5l3 5';
  const [lx, ly] = look;
  return {
    lines: [top],
    fine: [hands, dot(-11, -18, 4.3), dot(11, -18, 4.3)],
    washes: [{ c: PAL.green, o: 0.85, d: `${top}Z` + 'M-30 3l2 -5l3 4l2 -5l3 5ZM24 3l2 -5l3 4l2 -5l3 5Z' }],
    whites: [dot(-11, -18, 4.3), dot(11, -18, 4.3)],
    fills: [dot(-11 + lx, -18 + ly, 2.2), dot(11 + lx, -18 + ly, 2.2)],
    glints: [dot(-11.7 + lx, -19 + ly, 0.6), dot(10.3 + lx, -19 + ly, 0.6)],
  };
}

/** A golden plate (centre 0,0) seen from the side. */
export function plate(w = 50) {
  const a = w / 2;
  const top = `M${-a} 0C${-a} -8 ${a} -8 ${a} 0C${a} 8 ${-a} 8 ${-a} 0Z`;
  const inner = `M${-a + 8} 0C${-a + 8} -4 ${a - 8} -4 ${a - 8} 0C${a - 8} 4 ${-a + 8} 4 ${-a + 8} 0Z`;
  return { lines: [top], fine: [inner], washes: [{ c: PAL.ochre, o: 0.9, d: top }] };
}

/** "Ping!" burst marks around (0,0). */
export const burst = (r1 = 8, r2 = 16, n = 7, seed = 3) => rays(0, 0, r1, r2, n, seed);

/** The moon, a crescent (centre 0,0). */
export function moon(r = 18) {
  const d = `M${f(r * 0.2)} ${-r}C${f(-r * 0.9)} ${f(-r * 0.7)} ${f(-r * 0.9)} ${f(r * 0.7)} ${f(r * 0.2)} ${r}C${f(-r * 0.4)} ${f(r * 0.4)} ${f(-r * 0.4)} ${f(-r * 0.4)} ${f(r * 0.2)} ${-r}Z`;
  return { lines: [], fine: [d], washes: [{ c: PAL.ochre, o: 0.8, d }] };
}

/** A small four-point star (centre 0,0). */
export const star = (s = 5) => `M0 ${-s}L0 ${s}M${-s} 0L${s} 0`;
