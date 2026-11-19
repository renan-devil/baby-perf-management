import { PAL, parseTransform, rays, transformPath } from '../lib.mjs';

// The Golden Goose: the characters and props shared by the five pictures, drawn once here and placed
// in each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. Standing people have their feet at y = 0; the goose's tummy rests at y = 0.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot as path data. */
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
  const tags = (list) => list.filter(Boolean).map((d) => `<path d="${d}"/>`).join('');
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

/** A small four-point sparkle (centre x, y, size s), as path data. */
export const sparkle = (x, y, s) =>
  `M${f(x)} ${f(y - s)}Q${f(x + s * 0.18)} ${f(y - s * 0.18)} ${f(x + s)} ${f(y)}Q${f(x + s * 0.18)} ${f(y + s * 0.18)} ${f(x)} ${f(y + s)}Q${f(x - s * 0.18)} ${f(y + s * 0.18)} ${f(x - s)} ${f(y)}Q${f(x - s * 0.18)} ${f(y - s * 0.18)} ${f(x)} ${f(y - s)}Z`;

/** Golden sparkles at [x, y, size] points: ink outline and an ochre wash. */
export function sparkles(list) {
  const d = list.map(([x, y, s]) => sparkle(x, y, s)).join('');
  return { fine: [d], washes: [{ c: PAL.ochre, o: 0.95, d }] };
}

/** Little burst marks (surprise, laughter) around (cx, cy). */
export const burst = (cx, cy, r1, r2, n, seed = 3, offset = 0) => rays(cx, cy, r1, r2, n, seed, offset);

/** An arm (limb along pts) with a round hand at its end. */
function arm(pts, sleeve, o = 0.6, hand = 3.8) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.5, d: h }] };
}

/** An arm from the shoulder (sx, sy) to the hand (hx, hy), with the elbow bent by bend (+ down). */
function reach(sx, sy, hx, hy, bend = 6, w = 6.5) {
  const mx = (sx + hx) / 2;
  const my = (sy + hy) / 2;
  const l = Math.hypot(hx - sx, hy - sy) || 1;
  const nx = (-(hy - sy) / l) * bend;
  const ny = ((hx - sx) / l) * bend;
  return [
    [sx, sy, w + 0.5],
    [mx + nx, my + ny, w],
    [hx, hy, w - 0.5],
  ];
}
export { reach };

/**
 * Eyes, brows and mouth (eyes at ±ex, ey; mouth at my).
 * mood: 'happy', 'asleep', 'wow', 'laugh', 'puff' (out of breath), 'kind' (old man's twinkly eyes).
 */
function faceMarks(mood, { ex = 5, ey = 0, my = 7, r = 1.8 } = {}) {
  const fine = [];
  const fills = [];
  const glints = [];
  const open = (rr = r) => {
    fills.push(dot(-ex, ey, rr), dot(ex, ey, rr));
    glints.push(dot(-ex - 0.5, ey - 0.6, 0.55), dot(ex - 0.5, ey - 0.6, 0.55));
  };
  if (mood === 'happy') {
    open();
    fine.push(`M-4.5 ${my}q4.5 4.5 9 0`);
  } else if (mood === 'asleep') {
    fine.push(`M${-ex - 3} ${ey}q3 2.5 6 0M${ex - 3} ${ey}q3 2.5 6 0`, `M-2.5 ${my + 1}q2.5 1.5 5 0`);
  } else if (mood === 'wow') {
    open(r + 0.4);
    fills.push(oval(0, my + 0.5, 1.9, 2.5));
    fine.push(`M${-ex - 3} ${ey - 6}q3 -2.5 6 0M${ex - 3} ${ey - 6}q3 -2.5 6 0`);
  } else if (mood === 'laugh') {
    fine.push(`M${-ex - 3} ${ey + 0.5}q3 -3.5 6 0M${ex - 3} ${ey + 0.5}q3 -3.5 6 0`);
    fills.push(`M-6 ${my - 1}q6 1.5 12 0q-1.5 9 -6 9q-4.5 0 -6 -9Z`);
  } else if (mood === 'puff') {
    open(r - 0.2);
    fills.push(oval(0, my + 0.5, 1.6, 2));
  } else if (mood === 'kind') {
    fine.push(`M${-ex - 2.5} ${ey + 0.5}q2.5 -3 5 0M${ex - 2.5} ${ey + 0.5}q2.5 -3 5 0`);
  }
  return { fine, fills, glints };
}

// ---------------------------------------------------------------------------------------------
// Hans (feet at 0,0), about 132 tall: a small young man with straw-coloured hair, a floppy green cap
// whose long tip flops behind him, a sky-blue tunic with a brown belt, grey trousers and brown boots.
// His face is at HANS_HEAD; shoulders at (±11, -88); hips at (±6, -44).
export const HANS_HEAD = [0, -106];
const hFace = oval(0, 0, 13, 14);
const hCap = 'M-15 -3C-17 -16 -8 -24 2 -24C11 -23 17 -15 15 -3C5 -7 -5 -7 -15 -3Z';
const hCapTip = 'M-4 -22C-16 -27 -27 -20 -29 -6L-23 -6C-22 -14 -16 -18 -7 -16';
const hCapTipWash = `${hCapTip}Z`;
const hPompom = dot(-26, -3.5, 3.4);
const hHair = 'M-14 -4C-16 1 -15 5 -13 7L-12 2M14 -4C16 1 15 5 13 7L12 2M-9 -6L-7 -2L-4 -6L-1 -2L2 -6L5 -2L8 -6';
const hHairWash = 'M-14 -4C-16 1 -15 5 -13 7L-12 2L-11 -5ZM14 -4C16 1 15 5 13 7L12 2L11 -5ZM-10 -6L-7 -2L-4 -6L-1 -2L2 -6L5 -2L9 -6Z';
export function hansHead({ mood = 'happy' } = {}) {
  const m = faceMarks(mood, { ex: 5, ey: 1, my: 7 });
  return {
    lines: [hFace, hCap, hCapTip],
    fine: [hHair, hPompom, 'M0.5 2c2 1.5 2 3 -0.5 3.5', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.28, d: hFace },
      { c: PAL.ochre, o: 0.75, d: hHairWash },
      { c: PAL.green, o: 0.85, d: hCap + hCapTipWash },
      { c: PAL.red, o: 0.7, d: hPompom },
      { c: PAL.rose, o: 0.6, d: dot(-8.5, 6, 2.4) + dot(8.5, 6, 2.4) },
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export const HANS_ARMS = {
  // right arm (on our right) bent round the goose at his hip, left arm swinging back as he walks
  carry: [
    [[-11, -88, 7], [-20, -74, 6], [-25, -60, 6]],
    [[11, -88, 7], [22, -82, 6.5], [34, -74, 6]],
  ],
  // the goose tucked under his left arm (on our left), right arm swinging forward as he strides
  carryBack: [
    [[-11, -88, 7], [-24, -82, 6.5], [-34, -74, 6]],
    [[11, -88, 7], [20, -74, 6], [26, -62, 6]],
  ],
  // right arm holding out a piece of cake, left hand resting on his knee
  share: [
    [[-11, -88, 7], [-17, -72, 6], [-10, -58, 6]],
    [[11, -88, 7], [24, -80, 6], [38, -82, 6]],
  ],
  // both hands folded in his lap (asleep)
  lap: [
    [[-11, -88, 7], [-17, -70, 6], [-4, -56, 6]],
    [[11, -88, 7], [17, -70, 6], [4, -58, 6]],
  ],
};
export const HANS_LEGS = {
  walk: [
    [[-6, -44, 9.5], [-12, -24, 8.5], [-18, -5, 7.5]],
    [[6, -44, 9.5], [12, -24, 8.5], [16, -5, 7.5]],
  ],
  // sitting on a seat at the height of his hips (y = -44), knees apart, feet on the ground
  sit: [
    [[-6, -44, 9.5], [-14, -32, 9], [-13, -16, 8], [-12, -5, 7.5]],
    [[6, -44, 9.5], [14, -32, 9], [14, -16, 8], [13, -5, 7.5]],
  ],
};
const hTunic = 'M-11 -93C-13 -82 -15 -66 -16 -50C-17 -46 -19 -43 -20 -40C-7 -36 7 -36 20 -40C19 -43 17 -46 16 -50C15 -66 13 -82 11 -93C4 -96 -4 -96 -11 -93Z';
const hBelt = 'M-15 -64C-5 -61 5 -61 15 -64L15.5 -58C5 -55 -5 -55 -15.5 -58Z';
const boot = (x, y, dir = 1) =>
  `M${f(x - 5 * dir)} ${f(y - 2)}L${f(x - 5 * dir)} ${f(y + 5)}L${f(x + 9 * dir)} ${f(y + 5)}C${f(x + 10 * dir)} ${f(y + 1)} ${f(x + 6 * dir)} ${f(y - 1)} ${f(x + 4 * dir)} ${f(y - 2)}Z`;
export function hans({ mood = 'happy', tilt = 0, arms = HANS_ARMS.carry, legs = HANS_LEGS.walk, under = null } = {}) {
  const legParts = legs.map((l) => {
    const d = limb(l);
    const [x, y] = l[l.length - 1];
    const b = boot(x, y, 1);
    return { lines: [d, b], washes: [{ c: PAL.grey, o: 0.65, d: `${d}Z` }, { c: PAL.terracotta, o: 0.8, d: b }] };
  });
  const body = {
    lines: [hTunic],
    fine: [hBelt, 'M-4 -94q4 4 8 0', 'M-18 -42l2 -4M-6 -38l1 -4M6 -38l-1 -4M18 -42l-2 -4'],
    washes: [
      { c: PAL.sky, o: 0.72, d: hTunic },
      { c: PAL.terracotta, o: 0.85, d: hBelt },
    ],
  };
  const head = place(hansHead({ mood }), `translate(${HANS_HEAD[0]} ${HANS_HEAD[1]}) rotate(${tilt})`);
  const armParts = arms.map((a) => arm(a, PAL.sky, 0.72));
  // under: a part (the goose) drawn between his body and his carrying arm
  return merge(...legParts, body, armParts[0], under ?? {}, armParts[1], head);
}

// ---------------------------------------------------------------------------------------------
// The golden goose (tummy at 0,0, facing right), about 72 long: a plump goose washed in gold, with a
// terracotta beak and feet, a wing folded on her side and a sparkle of light on her back.
// mood: 'awake' or 'asleep'. feet: draw her standing feet.
const gBody = 'M-24 -27C-12 -32 4 -31 14 -25C22 -20 23 -8 14 -3C4 2 -14 2 -25 -4C-31 -8 -33 -14 -31 -19L-39 -27C-34 -27 -29 -29 -24 -27Z';
const gNeck = 'M10 -26C15 -32 12 -42 16 -50C19 -57 28 -59 32 -53C35 -48 31 -44 27 -43C23 -41 23 -35 24 -30C25 -26 23 -22 19 -20';
const gNeckWash = 'M10 -26C15 -32 12 -42 16 -50C19 -57 28 -59 32 -53C35 -48 31 -44 27 -43C23 -41 23 -35 24 -30C25 -26 23 -22 19 -20Z';
const gBeak = 'M31 -54C35 -55 40 -54 43 -51C40 -49 35 -48 31 -48Z';
const gWing = 'M-20 -19C-10 -25 4 -23 10 -15C2 -9 -12 -9 -22 -14';
const gFeathers = 'M-12 -14l5 3M-5 -15l5 3M2 -15l4 3M-30 -21l5 1M-32 -24l6 0';
const gShine = 'M-16 -26C-8 -29 2 -28 8 -25C2 -26 -8 -26 -16 -24Z';
const gFeet = 'M-2 0L-3 7M7 -1L8 7';
const gToes = 'M-9 7L3 7L-3 4ZM2 7L14 7L8 4Z';
export function goose({ mood = 'awake', feet = false } = {}) {
  const fine = [gWing, gFeathers, gBeak, 'M31 -51l6 0.5'];
  const fills = [];
  const glints = [];
  if (mood === 'asleep') fine.push('M24 -53q2.5 2 5 0');
  else {
    fills.push(dot(26.5, -52, 1.8));
    glints.push(dot(26, -52.6, 0.5));
  }
  const lines = [gBody, gNeck];
  const washes = [
    { c: PAL.ochre, o: 0.88, d: gBody + gNeckWash },
    { c: PAL.terracotta, o: 0.25, d: 'M-20 -19C-10 -25 4 -23 10 -15C2 -9 -12 -9 -22 -14Z' },
    { c: PAL.terracotta, o: 0.9, d: gBeak },
  ];
  if (feet) {
    fine.push(gFeet, gToes);
    washes.push({ c: PAL.terracotta, o: 0.9, d: gToes });
  }
  return { lines, fine, washes, whites: [gShine], fills, glints };
}

// ---------------------------------------------------------------------------------------------
// The little grey old man (feet at 0,0), about 80 tall: a pointed grey hood and cloak down to his
// boots, a big round nose and a long grey beard down to his tummy. arms: limb centrelines from his
// shoulders (±10, -44). Face at OLD_HEAD.
export const OLD_HEAD = [0, -54];
const oHood = 'M-13 6C-16 -6 -12 -16 -4 -22C0 -26 6 -32 10 -34C8 -26 10 -20 12 -14C15 -6 15 0 13 6';
const oFace = oval(0, 0, 9, 9.5);
const oBeard = 'M-9 2C-11 14 -6 28 1 36C7 26 11 14 9 2C6 6 -5 6 -9 2Z';
const oNose = oval(0, 2.5, 2.8, 2.4);
const oCloak = 'M-12 -46C-17 -30 -22 -16 -24 -3C-8 1 8 1 24 -3C22 -16 17 -30 12 -46C5 -50 -5 -50 -12 -46Z';
export const OLD_ARMS = {
  rest: [
    [[-11, -42, 6.5], [-16, -30, 6], [-12, -22, 5.5]],
    [[11, -42, 6.5], [16, -30, 6], [12, -22, 5.5]],
  ],
  // left hand (on our left) holding up a piece of cake to his mouth, right on his tummy
  eat: [
    [[-11, -42, 6.5], [-22, -34, 6], [-20, -46, 5.5]],
    [[11, -42, 6.5], [16, -30, 6], [8, -24, 5.5]],
  ],
};
export function oldMan({ mood = 'kind', arms = OLD_ARMS.rest } = {}) {
  const m = faceMarks(mood, { ex: 3.6, ey: -2, my: 6, r: 1.3 });
  const headT = `translate(${OLD_HEAD[0]} ${OLD_HEAD[1]})`;
  const head = place(
    {
      lines: [oHood, oFace, oBeard],
      fine: [oNose, 'M-7 -6l5 1.5M7 -6l-5 1.5', 'M-3 14q-1 6 1 10M3 12q1 6 -1 10', ...m.fine.filter((d) => !d.startsWith('M-2.5') && !d.startsWith('M-4.5'))],
      washes: [
        { c: PAL.grey, o: 0.75, d: `${oHood}Z${oFace}`, rule: 'evenodd' },
        { c: PAL.rose, o: 0.32, d: oFace },
        { c: PAL.rose, o: 0.75, d: oNose },
        { c: PAL.grey, o: 0.35, d: oBeard },
      ],
      fills: m.fills,
      glints: m.glints,
    },
    headT,
  );
  const shoes = 'M-12 -2C-15 1 -14 3 -6 3L-5 -1M12 -2C15 1 14 3 6 3L5 -1';
  const body = {
    lines: [oCloak, shoes],
    fine: ['M-14 -24l3 6M14 -24l-3 6'],
    washes: [
      { c: PAL.grey, o: 0.75, d: oCloak + transformPath(oBeard, `translate(${OLD_HEAD[0]} ${OLD_HEAD[1]})`), rule: 'evenodd' },
      { c: PAL.slate, o: 0.25, d: oCloak + transformPath(oBeard, `translate(${OLD_HEAD[0]} ${OLD_HEAD[1]})`), rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.7, d: 'M-12 -2C-15 1 -14 3 -6 3L-5 -1ZM12 -2C15 1 14 3 6 3L5 -1Z' },
    ],
  };
  const armParts = arms.map((a) => arm(a, PAL.grey, 0.75, 3.2));
  return merge(body, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The innkeeper's daughters (feet at 0,0), about 116 tall: auburn hair in two plaits with red ribbons,
// a dress (colour: dress) under a white apron. Face at GIRL_HEAD; shoulders at (±9, -80).
export const GIRL_HEAD = [0, -96];
const gFace = oval(0, 0, 12, 13);
const gHair = 'M-13 2C-16 -11 -8 -19 0 -19C8 -19 16 -11 13 2C11 -5 7 -9 1 -8C-4 -11 -10 -6 -13 2Z';
const gPlaitL = 'M-12 -4C-19 1 -22 10 -21 20C-20 23 -17 23 -17 20C-17 13 -16 7 -12 3';
const gPlaitR = 'M12 -4C19 1 22 10 21 20C20 23 17 23 17 20C17 13 16 7 12 3';
const gBraid = 'M-19 6l3 2M-21 11l4 2M-21 16l4 1M19 6l-3 2M21 11l-4 2M21 16l-4 1';
const gRibbons = 'M-21 21L-24 26L-19 24L-16 27L-16 21ZM21 21L24 26L19 24L16 27L16 21Z';
export function girlHead({ mood = 'happy' } = {}) {
  const m = faceMarks(mood, { ex: 4.6, ey: 0, my: 4.5, r: 1.7 });
  return {
    lines: [gFace, gHair, gPlaitL, gPlaitR],
    fine: [gBraid, gRibbons, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.28, d: gFace },
      { c: PAL.terracotta, o: 0.8, d: `${gHair}${gPlaitL}Z${gPlaitR}Z` },
      { c: PAL.red, o: 0.85, d: gRibbons },
      { c: PAL.rose, o: 0.6, d: dot(-8, 5.5, 2.2) + dot(8, 5.5, 2.2) },
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
const gDress = 'M-9 -84C-12 -76 -12 -68 -11 -62C-17 -46 -24 -26 -27 -7C-10 -3 10 -3 27 -7C24 -26 17 -46 11 -62C12 -68 12 -76 9 -84C3 -87 -3 -87 -9 -84Z';
const gApron = 'M-10 -60C-13 -44 -16 -26 -16 -11C-5 -8 5 -8 16 -11C16 -26 13 -44 10 -60C3 -58 -3 -58 -10 -60Z';
export const GIRL_ARMS = {
  down: [
    [[-9, -80, 6.5], [-15, -68, 6], [-18, -56, 5.5]],
    [[9, -80, 6.5], [15, -68, 6], [18, -56, 5.5]],
  ],
};
export function girl({ mood = 'happy', dress = PAL.green, tilt = 0, arms = GIRL_ARMS.down, hop = false } = {}) {
  const legs = hop ? 'M-6 -5L-8 -12M6 -5L10 -1' : 'M-6 -5L-6 -1M6 -5L6 -1';
  const shoes = hop ? 'M-9 -14C-14 -14 -16 -11 -14 -9L-7 -9ZM9 -3C9 1 14 2 17 0L13 -4Z' : 'M-6 -2C-12 -2 -13 2 -10 2L-3 2L-3 -2ZM6 -2C12 -2 13 2 10 2L3 2L3 -2Z';
  const body = {
    lines: [gDress, shoes],
    fine: [gApron, legs, 'M-10 -60C-14 -62 -16 -60 -15 -57M10 -60C14 -62 16 -60 15 -57'],
    washes: [
      { c: dress, o: 0.7, d: gDress },
      { c: PAL.ink, o: 0.6, d: shoes },
    ],
    whites: [gApron],
  };
  const armParts = arms.map((a) => arm(a, dress, 0.7, 3.4));
  const head = place(girlHead({ mood }), `translate(${GIRL_HEAD[0]} ${GIRL_HEAD[1]}) rotate(${tilt})`);
  return merge(body, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The parson (feet at 0,0), about 128 tall: a long black coat, a white collar, a wide black hat.
export const PARSON_HEAD = [0, -104];
const pcFace = oval(0, 0, 12, 13);
const pcHat = 'M-22 -8C-14 -12 14 -12 22 -8C18 -6 -18 -6 -22 -8ZM-12 -10L-11 -24C-4 -27 4 -27 11 -24L12 -10';
const pcCoat = 'M-11 -91C-15 -76 -18 -40 -20 -4L20 -4C18 -40 15 -76 11 -91C4 -94 -4 -94 -11 -91Z';
const pcCollar = 'M-6 -91L-5 -86L5 -86L6 -91Z';
export function parson({ mood = 'puff', tilt = 0, arms } = {}) {
  const m = faceMarks(mood, { ex: 4.6, ey: 1, my: 6.5, r: 1.7 });
  const head = place(
    {
      lines: [pcFace, pcHat],
      fine: ['M-12 -4c-3 2 -3 7 0 8M12 -4c3 2 3 7 0 8', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.3, d: pcFace },
        { c: PAL.ink, o: 0.85, d: `${pcHat}Z` },
        { c: PAL.rose, o: 0.6, d: dot(-8, 5.5, 2.2) + dot(8, 5.5, 2.2) },
      ],
      fills: m.fills,
      glints: m.glints,
    },
    `translate(${PARSON_HEAD[0]} ${PARSON_HEAD[1]}) rotate(${tilt})`,
  );
  const shoes = 'M-12 -4L-12 1L-2 1L-3 -4ZM3 -4L2 1L12 1L12 -4Z';
  const body = {
    lines: [pcCoat, shoes],
    fine: ['M0 -86L0 -4', dot(-3, -70, 1.2), dot(-3, -54, 1.2), dot(-3, -38, 1.2)],
    washes: [
      { c: PAL.slate, o: 0.85, d: pcCoat },
      { c: PAL.ink, o: 0.35, d: pcCoat },
      { c: PAL.ink, o: 0.7, d: shoes },
    ],
    whites: [pcCollar],
  };
  const armParts = (arms ?? GIRL_ARMS.down).map((a) => arm(a, PAL.slate, 0.9, 3.4));
  return merge(body, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The farmer (feet at 0,0), about 124 tall: a straw hat, an ochre smock, green trousers and a spade on
// his shoulder.
export const FARMER_HEAD = [0, -100];
const fmFace = oval(0, 0, 12, 13);
const fmHat = 'M-24 -5C-14 -10 14 -10 24 -5C16 -2 -16 -2 -24 -5ZM-11 -8C-11 -18 -6 -21 0 -21C6 -21 11 -18 11 -8';
const fmSmock = 'M-12 -87C-16 -74 -19 -56 -21 -40C-8 -36 8 -36 21 -40C19 -56 16 -74 12 -87C4 -90 -4 -90 -12 -87Z';
const fmLegs = 'M-14 -40L-14 -6L-3 -6L-2 -38ZM2 -38L3 -6L14 -6L14 -40Z';
export function farmer({ mood = 'puff', tilt = 0, arms } = {}) {
  const m = faceMarks(mood, { ex: 4.6, ey: 1, my: 6.5, r: 1.7 });
  const head = place(
    {
      lines: [fmFace, fmHat],
      fine: ['M-12 -4c-3 2 -3 7 0 8M12 -4c3 2 3 7 0 8', 'M-8 9q-1 3 1 4M8 9q1 3 -1 4', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.3, d: fmFace },
        { c: PAL.ochre, o: 0.85, d: `${fmHat}Z` },
        { c: PAL.red, o: 0.6, d: 'M-11 -9C-4 -11 4 -11 11 -9L11 -7C4 -9 -4 -9 -11 -7Z' },
        { c: PAL.rose, o: 0.6, d: dot(-8, 5.5, 2.2) + dot(8, 5.5, 2.2) },
      ],
      fills: m.fills,
      glints: m.glints,
    },
    `translate(${FARMER_HEAD[0]} ${FARMER_HEAD[1]}) rotate(${tilt})`,
  );
  const boots = 'M-14 -6L-14 1L-2 1L-3 -6ZM3 -6L2 1L14 1L14 -6Z';
  // the spade rests on his left shoulder (on our left), blade up behind him
  const handle = 'M-8 -86L-34 -134M-6 -84L-32 -136';
  const blade = 'M-36 -132C-44 -140 -46 -150 -42 -160L-26 -152C-26 -144 -28 -136 -32 -132Z';
  const body = {
    lines: [fmSmock, fmLegs, boots, blade],
    fine: [handle, 'M-6 -86l0 6M6 -86l0 6', 'M-18 -46q18 4 36 0'],
    washes: [
      { c: PAL.ochre, o: 0.55, d: fmSmock },
      { c: PAL.terracotta, o: 0.3, d: fmSmock },
      { c: PAL.green, o: 0.75, d: fmLegs },
      { c: PAL.ink, o: 0.6, d: boots },
      { c: PAL.grey, o: 0.85, d: blade },
      { c: PAL.ochre, o: 0.8, d: 'M-8 -86L-34 -134L-32 -136L-6 -84Z' },
    ],
  };
  const armParts = (arms ?? GIRL_ARMS.down).map((a) => arm(a, PAL.ochre, 0.7, 3.4));
  return merge(body, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The princess (the middle of her waist at 0,0; the window sill hides the rest): golden hair down to
// her shoulders, a little golden crown, a rose dress. Face at PRINCESS_HEAD; shoulders at (±12, -40).
export const PRINCESS_HEAD = [0, -60];
const prFace = oval(0, 0, 14, 15);
const prTop = 'M-15 1C-18 -14 -10 -21 0 -21C10 -21 18 -14 15 1C13 -6 8 -11 1 -9C-4 -12 -12 -7 -15 1Z';
const prLockL = 'M-14 -2C-20 6 -21 20 -17 30C-13 32 -10 28 -11 22C-12 14 -11 7 -11 1Z';
const prLockR = 'M14 -2C20 6 21 20 17 30C13 32 10 28 11 22C12 14 11 7 11 1Z';
const prCrown = 'M-9 -19L-11 -31L-4 -24L0 -33L4 -24L11 -31L9 -19C3 -21 -3 -21 -9 -19Z';
export function princessHead({ mood = 'laugh' } = {}) {
  const m = faceMarks(mood, { ex: 5.5, ey: 1, my: 7.5, r: 1.9 });
  return {
    lines: [prFace, prTop, prLockL, prLockR, prCrown],
    fine: ['M-6 -13q2 4 1 7M2 -13q2 3 4 5', dot(0, -23, 1.3), ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.28, d: prFace },
      { c: PAL.ochre, o: 0.78, d: prTop + prLockL + prLockR },
      { c: PAL.ochre, o: 0.95, d: prCrown },
      { c: PAL.red, o: 0.8, d: dot(0, -23, 1.3) },
      { c: PAL.rose, o: 0.7, d: dot(-9.5, 6.5, 2.8) + dot(9.5, 6.5, 2.8) },
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
const prBodice = 'M-12 -43C-16 -32 -18 -16 -20 0L20 0C18 -16 16 -32 12 -43C5 -47 -5 -47 -12 -43Z';
export const PRINCESS_ARMS = {
  // both arms hugging her tummy as she laughs
  tummy: [
    [[-12, -40, 7], [-21, -26, 6.5], [-6, -14, 6]],
    [[12, -40, 7], [21, -26, 6.5], [6, -16, 6]],
  ],
};
export function princess({ mood = 'laugh', tilt = 0, arms = PRINCESS_ARMS.tummy } = {}) {
  const body = {
    lines: [prBodice],
    fine: ['M-5 -45q5 5 10 0', 'M-3 -46L-3 -48M3 -46L3 -48'],
    washes: [{ c: PAL.rose, o: 0.65, d: prBodice }],
  };
  const armParts = arms.map((a) => arm(a, PAL.rose, 0.65, 3.8));
  const head = place(princessHead({ mood }), `translate(${PRINCESS_HEAD[0]} ${PRINCESS_HEAD[1]}) rotate(${tilt})`);
  return merge(body, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The big sweet cake (bottom centre at 0,0), about 44 wide: a round sponge, creamy icing dripping down
// its sides and a red cherry on top. cut: a slice taken out of the front.
export function cake({ cut = true } = {}) {
  const sides = 'M-22 -20L-22 -2C-10 3 10 3 22 -2L22 -20';
  const top = 'M-22 -20C-22 -28 22 -28 22 -20C22 -13 -22 -13 -22 -20Z';
  const drips = 'M-22 -20C-22 -15 -18 -13 -17 -16C-16 -12 -12 -11 -11 -15C-8 -10 -4 -11 -3 -14C0 -10 4 -10 5 -14C7 -10 11 -10 12 -14C14 -11 18 -12 18 -15C20 -13 22 -15 22 -20';
  const cherry = dot(2, -27, 3.4);
  const washes = [
    { c: PAL.terracotta, o: 0.7, d: 'M-22 -20L-22 -2C-10 3 10 3 22 -2L22 -20Z' },
    { c: PAL.ochre, o: 0.4, d: 'M-22 -20L-22 -2C-10 3 10 3 22 -2L22 -20Z' },
    { c: PAL.red, o: 0.9, d: cherry },
  ];
  const fine = [drips, 'M-22 -9C-10 -5 10 -5 22 -9', 'M2 -30q2 -6 6 -8'];
  const whites = [top + drips + 'L22 -20Z'];
  const lines = [sides, top, cherry];
  if (cut) {
    // a dark wedge where the slice was taken (front right)
    const wedge = 'M4 -18L10 -2L18 -3L19 -16Z';
    lines.push('M4 -18L10 -2');
    washes.push({ c: PAL.terracotta, o: 0.5, d: wedge });
  }
  return { lines, fine, washes, whites, glints: [dot(1, -28.5, 0.9)] };
}
/** A slice of cake (centre 0,0) held in a hand. */
export function slice() {
  const d = 'M-7 -5L7 -7L8 4L-6 5Z';
  return {
    lines: [d],
    fine: ['M-7 -5L7 -7L6 -3C3 -1 0 -3 -2 -1C-4 -3 -6 -2 -7 -3Z', 'M-6 1L8 0'],
    washes: [
      { c: PAL.terracotta, o: 0.75, d },
      { c: PAL.ochre, o: 0.35, d },
    ],
    whites: ['M-7 -5L7 -7L6 -3C3 -1 0 -3 -2 -1C-4 -3 -6 -2 -7 -3Z'],
  };
}
