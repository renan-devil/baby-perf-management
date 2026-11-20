import { PAL, parseTransform, rays, rng, transformPath } from '../lib.mjs';

// Rumpelstiltskin: the characters and props shared by the ten pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is not
// a picture. Standing people have their feet at y = 0.
//
// Ink lines are always drawn on top of every wash, so a shape in front cannot hide the lines of a
// shape behind it: characters stand side by side, and a few outlines are drawn in pieces.

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

/** A small four-point sparkle (centre x, y, size s), as path data. */
export const sparkle = (x, y, s) =>
  `M${f(x)} ${f(y - s)}Q${f(x + s * 0.18)} ${f(y - s * 0.18)} ${f(x + s)} ${f(y)}Q${f(x + s * 0.18)} ${f(y + s * 0.18)} ${f(x)} ${f(y + s)}Q${f(x - s * 0.18)} ${f(y + s * 0.18)} ${f(x - s)} ${f(y)}Q${f(x - s * 0.18)} ${f(y - s * 0.18)} ${f(x)} ${f(y - s)}Z`;

/** Golden sparkles at [x, y, size] points: ink outline and an ochre wash. */
export function sparkles(list) {
  const d = list.map(([x, y, s]) => sparkle(x, y, s)).join('');
  return { fine: [d], washes: [{ c: PAL.ochre, o: 0.95, d }] };
}

/** Little burst marks (surprise, shining) around (cx, cy). */
export const burst = (cx, cy, r1, r2, n, seed = 3, offset = 0) => rays(cx, cy, r1, r2, n, seed, offset);

/** An arm (limb along pts) with a round hand at its end. */
function arm(pts, sleeve, o = 0.6, hand = 3.8) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.5, d: h }] };
}

/**
 * Eyes, brows and mouth (eyes at ±ex, ey; mouth at my).
 * mood: 'happy', 'smile' (eyes closed, smiling), 'wow', 'cry', 'worried', 'grumpy', 'sly',
 * 'shock', 'sing', 'no' (eyes squeezed shut, frowning).
 */
function faceMarks(mood, { ex = 5, ey = 0, my = 7, r = 1.8, w = 4.5 } = {}) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const open = (rr = r) => {
    fills.push(dot(-ex, ey, rr), dot(ex, ey, rr));
    glints.push(dot(-ex - 0.4, ey - 0.5, rr * 0.3), dot(ex - 0.4, ey - 0.5, rr * 0.3));
  };
  const closedUp = `M${f(-ex - 2.8)} ${f(ey + 0.5)}q2.8 -3 5.6 0M${f(ex - 2.8)} ${f(ey + 0.5)}q2.8 -3 5.6 0`;
  const closedDown = `M${f(-ex - 2.8)} ${f(ey - 0.5)}q2.8 2.6 5.6 0M${f(ex - 2.8)} ${f(ey - 0.5)}q2.8 2.6 5.6 0`;
  if (mood === 'happy') {
    open();
    fine.push(`M${-w} ${my}q${w} ${w} ${2 * w} 0`);
  } else if (mood === 'smile') {
    fine.push(closedUp, `M${-w} ${my}q${w} ${w} ${2 * w} 0`);
  } else if (mood === 'wow') {
    open(r + 0.3);
    fills.push(oval(0, my + 1, w * 0.5, w * 0.7));
    fine.push(`M${f(-ex - 3)} ${f(ey - 5)}q3 -2.5 6 0M${f(ex - 3)} ${f(ey - 5)}q3 -2.5 6 0`);
  } else if (mood === 'cry') {
    fine.push(closedDown, `M${f(-ex - 3)} ${f(ey - 4)}l5 -1.5M${f(ex + 3)} ${f(ey - 4)}l-5 -1.5`);
    fills.push(`M${-w * 0.8} ${my + 1}q${w * 0.8} -3 ${w * 1.6} 0q${-w * 0.8} 2 ${-w * 1.6} 0Z`);
    const tears = `M${f(-ex - 1)} ${f(ey + 2.5)}c-1.4 2.4 -1.4 4 0 4.4c1.4 -0.4 1.4 -2 0 -4.4ZM${f(ex + 1)} ${f(ey + 2.5)}c-1.4 2.4 -1.4 4 0 4.4c1.4 -0.4 1.4 -2 0 -4.4Z`;
    fine.push(tears);
    washes.push({ c: PAL.sky, o: 0.95, d: tears });
  } else if (mood === 'worried') {
    open();
    fine.push(`M${f(-ex - 3)} ${f(ey - 4)}l5 -1.8M${f(ex + 3)} ${f(ey - 4)}l-5 -1.8`, `M${-w * 0.8} ${my + 1}q${w * 0.4} -1.6 ${w * 0.8} 0q${w * 0.4} 1.6 ${w * 0.8} 0`);
  } else if (mood === 'grumpy') {
    open(r - 0.1);
    fine.push(`M${f(-ex - 3)} ${f(ey - 4.5)}l5 2M${f(ex + 3)} ${f(ey - 4.5)}l-5 2`, `M${-w * 0.8} ${my + 1.5}q${w * 0.8} -2.5 ${w * 1.6} 0`);
  } else if (mood === 'sly') {
    open(r - 0.1);
    fine.push(`M${f(-ex - 3)} ${f(ey - 4.5)}l5 2M${f(ex + 3)} ${f(ey - 4.5)}l-5 2`, `M${-w} ${my}q${w} ${w * 0.8} ${2 * w} -1.5`);
  } else if (mood === 'shock') {
    fills.push(dot(-ex, ey, r * 0.8), dot(ex, ey, r * 0.8));
    fine.push(dot(-ex, ey, r * 2), dot(ex, ey, r * 2), `M${f(-ex - 3)} ${f(ey - 6)}q3 -3 6 0M${f(ex - 3)} ${f(ey - 6)}q3 -3 6 0`);
    fills.push(oval(0, my + 1.5, w * 0.6, w * 0.8));
  } else if (mood === 'sing') {
    fine.push(closedUp);
    fills.push(oval(0, my + 1, w * 0.55, w * 0.55));
  } else if (mood === 'no') {
    fine.push(`M${f(-ex - 2.5)} ${f(ey - 1.5)}l4.5 1.5l-4.5 1.5M${f(ex + 2.5)} ${f(ey - 1.5)}l-4.5 1.5l4.5 1.5`, `M${-w * 0.8} ${my + 1.5}q${w * 0.8} -2.5 ${w * 1.6} 0`);
  }
  return { fine, fills, glints, washes };
}

// ---------------------------------------------------------------------------------------------
// The funny little man (feet at 0,0), about 100 tall with his hat: a tall red pointed hat with a
// floppy tip, a big round nose, grumpy eyebrows and a long white beard down to his knees, a green
// tunic, slate trousers and terracotta shoes with curly pointed toes. The beard hides most of his
// tunic. Face centre at LM_HEAD; shoulders at (±11, -39); hips at (±5, -16).
export const LM_HEAD = [0, -50];
const lmHat = 'M-12 -5C-11 -18 -5 -31 3 -43C8 -48 15 -45 19 -38C17 -36 13 -37 10 -39C9 -27 11 -16 12 -5C4 -10 -4 -10 -12 -5Z';
const lmHatBand = 'M-12 -5C-4 -10 4 -10 12 -5L11.6 -9C4 -13 -4 -13 -11.6 -9Z';
const lmFaceSides = 'M-12 -5C-13 -1 -12 2 -10 4M12 -5C13 -1 12 2 10 4';
const lmBeard = 'M-10 4C-12 15 -10 29 -3 41C-1 44 1 44 3 41C10 29 12 15 10 4C7 8 3 8 0 6.5C-3 8 -7 8 -10 4Z';
const lmBeardHair = 'M-5 12q-2 10 1 22M4 12q2 9 -1 20M0 14l0.5 14';
// the beard standing on end: bristling out in all directions like a startled brush
const lmBeardUp = 'M-10 4L-22 2L-17 9L-29 12L-19 17L-27 25L-15 23L-15 34L-7 26L-2 38L2 27L9 37L11 24L22 30L18 19L29 17L19 11L27 3L10 4C7 8 3 8 0 6.5C-3 8 -7 8 -10 4Z';
const lmBeardUpHair = 'M-6 12l-10 6M-3 15l-5 12M3 15l4 12M6 12l10 5M0 14l0 13';
const lmFaceWash = 'M-12 -5C-4 -10 4 -10 12 -5C13 -1 12 2 10 4C7 8 3 8 0 6.5C-3 8 -7 8 -10 4C-12 2 -13 -1 -12 -5Z';
const lmEars = 'M-12 -3c-4 -1 -4.5 5 -1 5.5M12 -3c4 -1 4.5 5 1 5.5';
const lmNose = oval(0, 1.5, 3.8, 3.1);
// a rough outline round the whole head, hat and beard (to leave a hole in a dark doorway)
export const LM_HEAD_SHAPE = 'M-17 -4L-13 -10L2 -47L21 -40L14 -8L17 2L12 8L5 44L-5 44L-12 8L-17 2Z';
const lmMoustache = 'M0 6c-3 -1.5 -7 0 -9 3M0 6c3 -1.5 7 0 9 3';

/** The little man's head (face centre at 0,0). beard: 'down' or 'up'; hat: true, or a transform for a flying hat. */
export function lmHead({ mood = 'grumpy', beard = 'down', hat = true } = {}) {
  const m = faceMarks(mood, { ex: 5, ey: -3, my: 9.5, r: 1.5, w: 3.4 });
  const hatT = typeof hat === 'string' ? hat : '';
  const beardD = beard === 'up' ? lmBeardUp : lmBeard;
  const head = {
    lines: [lmFaceSides, beardD, lmNose],
    fine: [lmEars, beard === 'up' ? lmBeardUpHair : lmBeardHair, lmMoustache, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: lmFaceWash },
      { c: PAL.rose, o: 0.85, d: lmNose },
      { c: PAL.rose, o: 0.55, d: dot(-8.5, 2, 2) + dot(8.5, 2, 2) },
      ...m.washes,
    ],
    whites: [beardD],
    fills: m.fills,
    glints: [...m.glints, dot(-1.2, 0.3, 0.9)],
  };
  if (!hat) return head;
  if (hatT) {
    // the hat has jumped off: his bald head shows, with a few hairs standing up
    const dome = 'M-12 -5C-13 -16 13 -16 12 -5';
    head.lines.push(dome);
    head.fine.push('M-3 -13l-2 -6M0 -13l0 -7M3 -13l2 -6');
    head.washes.push({ c: PAL.rose, o: 0.32, d: `${dome}C4 -10 -4 -10 -12 -5Z` });
  }
  const hatPart = place(
    {
      lines: [lmHat],
      fine: [lmHatBand],
      washes: [
        { c: PAL.red, o: 0.82, d: lmHat },
        { c: PAL.ochre, o: 0.9, d: lmHatBand },
      ],
    },
    hatT,
  );
  return merge(head, hatPart);
}

export const LM_ARMS = {
  // sitting at the wheel on his left (our right): one hand turning the wheel, one drawing the thread
  spin: [
    [[-11, -39, 5.5], [-20, -32, 5], [-26, -40, 4.5]],
    [[11, -39, 5.5], [20, -33, 5], [28, -40, 4.5]],
  ],
  // hands on his hips (grumpy)
  hips: [
    [[-11, -39, 5.5], [-20, -31, 5], [-14, -24, 4.5]],
    [[11, -39, 5.5], [20, -31, 5], [14, -24, 4.5]],
  ],
  // pointing one finger up (our right), the other hand on his hip
  point: [
    [[-11, -39, 5.5], [-20, -31, 5], [-14, -24, 4.5]],
    [[11, -39, 5.5], [19, -48, 5], [21, -60, 4.5]],
  ],
  // holding out both hands for the baby (to our right)
  want: [
    [[-11, -39, 5.5], [-18, -32, 5], [-24, -36, 4.5]],
    [[11, -39, 5.5], [21, -35, 5], [31, -38, 4.5]],
  ],
  // both arms up in the air (dancing)
  dance: [
    [[-11, -39, 5.5], [-21, -49, 5], [-24, -62, 4.5]],
    [[11, -39, 5.5], [21, -49, 5], [24, -62, 4.5]],
  ],
  // flung out wide (surprise)
  shock: [
    [[-11, -39, 5.5], [-24, -44, 5], [-33, -54, 4.5]],
    [[11, -39, 5.5], [24, -44, 5], [33, -54, 4.5]],
  ],
};
export const LM_LEGS = {
  stand: [
    [[-5, -17, 6.5], [-7, -9, 6], [-8, -3, 5.5]],
    [[5, -17, 6.5], [7, -9, 6], [8, -3, 5.5]],
  ],
  // hopping on his right leg (our left), the other knee up
  hop: [
    [[-5, -17, 6.5], [-6, -9, 6], [-6, -3, 5.5]],
    [[5, -17, 6.5], [14, -15, 6], [16, -7, 5.5]],
  ],
  // sitting, legs dangling apart
  sit: [
    [[-5, -17, 6.5], [-10, -10, 6], [-12, -3, 5.5]],
    [[5, -17, 6.5], [10, -10, 6], [12, -3, 5.5]],
  ],
};
const lmShoe = (x, y, dir) =>
  `M${f(x - 3 * dir)} ${f(y - 3)}L${f(x - 3 * dir)} ${f(y + 2)}L${f(x + 7 * dir)} ${f(y + 2)}C${f(x + 12 * dir)} ${f(y + 2)} ${f(x + 13 * dir)} ${f(y - 3)} ${f(x + 11 * dir)} ${f(y - 5)}C${f(x + 10 * dir)} ${f(y - 2)} ${f(x + 8 * dir)} ${f(y - 2)} ${f(x + 5 * dir)} ${f(y - 3)}Z`;
const lmTunic = 'M-11 -40C-14 -32 -16 -24 -17 -15C-14 -14 -10 -14 -7 -14M11 -40C14 -32 16 -24 17 -15C14 -14 10 -14 7 -14';
const lmTunicWash = 'M-11 -41C-14 -32 -16 -24 -17 -15C-6 -13 6 -13 17 -15C16 -24 14 -32 11 -41C4 -44 -4 -44 -11 -41Z';

/** The little man. tilt: head turn (deg). hat/beard: see lmHead. */
export function littleMan({ mood = 'grumpy', tilt = 0, arms = LM_ARMS.hips, legs = LM_LEGS.stand, beard = 'down', hat = true } = {}) {
  const legParts = legs.map((l, i) => {
    const d = limb(l);
    const [x, y] = l[l.length - 1];
    const s = lmShoe(x, y + 1, i === 0 ? -1 : 1);
    return { lines: [d, s], washes: [{ c: PAL.slate, o: 0.6, d: `${d}Z` }, { c: PAL.terracotta, o: 0.85, d: s }] };
  });
  const body = {
    lines: [lmTunic],
    fine: ['M-15 -20l2 -4M15 -20l-2 -4'],
    washes: [{ c: PAL.green, o: 0.8, d: lmTunicWash }],
  };
  const armParts = arms.map((a) => arm(a, PAL.green, 0.8, 3.1));
  const head = place(lmHead({ mood, beard, hat }), `translate(${LM_HEAD[0]} ${LM_HEAD[1]}) rotate(${tilt})`);
  return merge(...legParts, body, head, ...armParts);
}

// ---------------------------------------------------------------------------------------------
// Annie, the miller's daughter (feet at 0,0), about 116 tall: auburn hair parted in the middle with
// one long plait over her shoulder tied with a red ribbon, a plain sky-blue dress and a white apron.
// As the Queen (queen: true): a golden crown and a rose dress, no apron. Face at ANNIE_HEAD;
// shoulders at (±9, -80). sit: sitting on the floor, her skirt spread out (its hem at y = -30).
export const ANNIE_HEAD = [0, -96];
const anFace = oval(0, 0, 12, 13);
const anHair = 'M-13 3C-16 -12 -7 -19 0 -19C7 -19 16 -12 13 3C11 -6 5 -10 0 -12C-5 -10 -11 -6 -13 3Z';
const anPlait = limb([
  [10, 2, 8],
  [16, 14, 7.6],
  [16, 30, 7],
  [14, 44, 6],
]);
const anBraid = 'M12 9l6 2M14 16l5 2M13 23l6 1M13 30l5 1M12 37l5 0';
const anRibbon = 'M14 47L9 53L14 51L18 55L18 48Z';
const anCrown = 'M-10 -16L-12 -30L-5 -23L0 -32L5 -23L12 -30L10 -16C4 -18 -4 -18 -10 -16Z';
export function annieHead({ mood = 'happy', queen = false } = {}) {
  const m = faceMarks(mood, { ex: 4.6, ey: 0, my: 5, r: 1.7, w: 4 });
  const lines = [anFace, anHair, anPlait];
  const fine = [anBraid, anRibbon, ...m.fine];
  const washes = [
    { c: PAL.rose, o: 0.28, d: anFace },
    { c: PAL.terracotta, o: 0.8, d: `${anHair}${anPlait}Z` },
    { c: PAL.red, o: 0.85, d: anRibbon },
    { c: PAL.rose, o: 0.6, d: dot(-8, 5.5, 2.2) + dot(8, 5.5, 2.2) },
    ...m.washes,
  ];
  if (queen) {
    lines.push(anCrown);
    fine.push(dot(0, -21, 1.4));
    washes.push({ c: PAL.ochre, o: 0.95, d: anCrown }, { c: PAL.red, o: 0.85, d: dot(0, -21, 1.4) });
  }
  return { lines, fine, washes, fills: m.fills, glints: m.glints };
}
const anDress = 'M-9 -84C-12 -76 -12 -68 -12 -62C-18 -46 -24 -26 -27 -6C-10 -2 10 -2 27 -6C24 -26 18 -46 12 -62C12 -68 12 -76 9 -84C3 -87 -3 -87 -9 -84Z';
const anApron = 'M-10 -60C-13 -44 -16 -26 -16 -11C-5 -8 5 -8 16 -11C16 -26 13 -44 10 -60C3 -58 -3 -58 -10 -60Z';
const anDressSit = 'M-9 -84C-12 -76 -12 -68 -12 -62C-20 -54 -32 -44 -38 -32C-20 -27 20 -27 38 -32C32 -44 20 -54 12 -62C12 -68 12 -76 9 -84C3 -87 -3 -87 -9 -84Z';
const anApronSit = 'M-10 -60C-16 -52 -22 -42 -24 -31C-8 -29 8 -29 24 -31C22 -42 16 -52 10 -60C3 -58 -3 -58 -10 -60Z';
export const ANNIE_ARMS = {
  down: [
    [[-9, -80, 6.5], [-15, -68, 6], [-17, -56, 5.5]],
    [[9, -80, 6.5], [15, -68, 6], [17, -56, 5.5]],
  ],
  // wiping a tear (our left), the other hand in her lap (sitting)
  cry: [
    [[-9, -80, 6.5], [-19, -72, 6], [-12, -90, 5.5]],
    [[9, -80, 6.5], [17, -66, 6], [8, -52, 5.5]],
  ],
  // hands clasped under her chin
  worried: [
    [[-9, -80, 6.5], [-17, -70, 6], [-3, -74, 5.5]],
    [[9, -80, 6.5], [17, -70, 6], [3, -75, 5.5]],
  ],
  // cradling the baby across her chest (its head on our left)
  baby: [
    [[-9, -80, 6.5], [-18, -68, 6], [-20, -58, 5.5]],
    [[9, -80, 6.5], [17, -64, 6], [0, -54, 5.5]],
  ],
  // the baby held in her left arm (our left), her right hand raised, one finger up
  ask: [
    [[-9, -80, 6.5], [-17, -68, 6], [-12, -60, 5.5]],
    [[9, -80, 6.5], [21, -78, 6], [24, -92, 5.5]],
  ],
  // holding up the top of the long list in front of her (our right)
  scroll: [
    [[-9, -80, 6.5], [-14, -68, 6], [-2, -66, 5.5]],
    [[9, -80, 6.5], [20, -76, 6], [30, -84, 5.5]],
  ],
};
export function annie({ mood = 'happy', queen = false, tilt = 0, arms = ANNIE_ARMS.down, sit = false, held = null } = {}) {
  const dressC = queen ? PAL.rose : PAL.sky;
  const shoes = sit
    ? 'M-14 -33C-20 -33 -22 -28 -18 -27L-9 -27L-9 -31ZM14 -33C20 -33 22 -28 18 -27L9 -27L9 -31Z'
    : 'M-6 -2C-12 -2 -13 2 -10 2L-3 2L-3 -2ZM6 -2C12 -2 13 2 10 2L3 2L3 -2Z';
  const dress = sit ? anDressSit : anDress;
  const body = {
    lines: [dress, shoes],
    fine: ['M-4 -86q4 4 8 0'],
    washes: [
      { c: dressC, o: queen ? 0.8 : 0.72, d: dress },
      { c: PAL.ink, o: 0.6, d: shoes },
    ],
    whites: [],
  };
  if (queen) {
    body.fine.push(`${dot(-5, -81, 1.2)}${dot(0, -79.5, 1.2)}${dot(5, -81, 1.2)}`);
    body.washes.push({ c: PAL.red, o: 0.4, d: sit ? anDressSit : 'M-27 -6C-10 -2 10 -2 27 -6L26 -12C10 -8 -10 -8 -26 -12Z' });
  } else {
    const apron = sit ? anApronSit : anApron;
    body.fine.push(apron, 'M-10 -60C-14 -62 -16 -60 -15 -57M10 -60C14 -62 16 -60 15 -57');
    body.whites.push(apron);
  }
  const armParts = arms.map((a) => arm(a, dressC, 0.75, 3.4));
  const head = place(annieHead({ mood, queen }), `translate(${ANNIE_HEAD[0]} ${ANNIE_HEAD[1]}) rotate(${tilt})`);
  // held: a part (the baby) drawn between her body and her arms
  return merge(body, held ?? {}, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The baby (centre of the bundle at 0,0, head on the left), about 44 long: wrapped in a rose blanket
// with a little hood, one curl of hair. mood: 'asleep' or 'happy'.
export function baby({ mood = 'asleep' } = {}) {
  const blanket = 'M-21 -4C-23 -14 -10 -16 2 -13C14 -11 23 -6 22 3C21 10 8 12 -4 11C-15 10 -20 6 -21 -4Z';
  const face = oval(-11, -1, 7, 7);
  // the same face drawn the other way round, to leave a hole in the white blanket
  const faceHole = 'M-18 -1C-18 2.9 -14.9 6 -11 6C-7.1 6 -4 2.9 -4 -1C-4 -4.9 -7.1 -8 -11 -8C-14.9 -8 -18 -4.9 -18 -1Z';
  const hood = 'M-19 -3C-21 -11 -14 -14 -8 -12';
  const eyes =
    mood === 'asleep'
      ? { fine: ['M-15 -2q1.6 1.4 3.2 0M-9.5 -2q1.6 1.4 3.2 0', 'M-12.5 3q1.5 1 3 0'], fills: [], glints: [] }
      : { fine: ['M-13 2.5q1.8 1.8 3.6 0'], fills: [dot(-14, -1.5, 1.1), dot(-8, -1.5, 1.1)], glints: [] };
  return {
    lines: [blanket, face],
    fine: [hood, 'M-12 -8c1 -3 4 -3 3 0', 'M0 -8c4 4 6 10 4 16M10 -6c2 4 2 8 0 12', ...eyes.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: face },
      { c: PAL.rose, o: 0.6, d: dot(-15.5, 1.5, 1.5) + dot(-6.5, 1.5, 1.5) },
    ],
    // a white blanket, so the bundle shows up against any dress
    whites: [blanket + faceHole],
    fills: eyes.fills,
    glints: eyes.glints,
  };
}

// ---------------------------------------------------------------------------------------------
// The King (feet at 0,0), about 146 tall with his crown: a plump comic king with a golden crown, grey
// curls and a big curly moustache, a round red robe with a white ermine collar, front and hem.
// Face at KING_HEAD; shoulders at (±16, -92). riding: sitting on a horse (seat at y = -30), one leg
// hanging down the horse's side.
export const KING_HEAD = [0, -116];
const kFace = oval(0, 0, 15, 15);
const kCrown = 'M-12 -11L-15 -31L-6 -22L0 -34L6 -22L15 -31L12 -11C4 -14 -4 -14 -12 -11Z';
const kCurls = 'M-15 -4c-5 -2 -7 4 -3 6c-4 2 -3 8 2 7M15 -4c5 -2 7 4 3 6c4 2 3 8 -2 7';
const kMoustache = 'M0 5C-4 2 -10 2 -14 6C-10 6 -7 8 -3 7.5C-2 7.5 -1 7 0 6.5C1 7 2 7.5 3 7.5C7 8 10 6 14 6C10 2 4 2 0 5Z';
const kNose = oval(0, 1.5, 3.8, 3.4);
export function kingHead({ mood = 'happy' } = {}) {
  const m = faceMarks(mood, { ex: 6, ey: -4, my: mood === 'wow' ? 10.5 : 9.5, r: 1.9, w: mood === 'wow' ? 5.2 : 4.5 });
  return {
    lines: [kFace, kCrown, kNose],
    fine: [kCurls, kMoustache, dot(0, -20, 1.6), dot(-8, -16, 1.2), dot(8, -16, 1.2), ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: kFace },
      { c: PAL.ochre, o: 0.95, d: kCrown },
      { c: PAL.red, o: 0.9, d: dot(0, -20, 1.6) + dot(-8, -16, 1.2) + dot(8, -16, 1.2) },
      { c: PAL.grey, o: 0.85, d: kMoustache },
      { c: PAL.grey, o: 0.6, d: 'M-15 -4c-5 -2 -7 4 -3 6c-4 2 -3 8 2 7L-13 -4ZM15 -4c5 -2 7 4 3 6c4 2 3 8 -2 7L13 -4Z' },
      { c: PAL.rose, o: 0.75, d: kNose },
      { c: PAL.rose, o: 0.6, d: dot(-10, 5, 3) + dot(10, 5, 3) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, dot(-1.3, 0.3, 0.9)],
  };
}
const kRobe = 'M-13 -98C-30 -90 -38 -66 -36 -44C-35 -26 -32 -14 -30 -4L30 -4C32 -14 35 -26 36 -44C38 -66 30 -90 13 -98C5 -101 -5 -101 -13 -98Z';
const kRobeRide = 'M-13 -98C-30 -90 -38 -66 -36 -44C-35 -38 -34 -34 -32 -30C-12 -26 12 -26 32 -30C34 -34 35 -38 36 -44C38 -66 30 -90 13 -98C5 -101 -5 -101 -13 -98Z';
const kCollar = 'M-17 -97C-8 -90 8 -90 17 -97C10 -103 -10 -103 -17 -97Z';
const kFront = 'M-5 -92L-6 -4L6 -4L5 -92Z';
const kFrontRide = 'M-5 -92L-6 -28L6 -28L5 -92Z';
const kHem = 'M-30 -11C-10 -7 10 -7 30 -11L30 -4L-30 -4Z';
const ermine = (pts) => pts.map(([x, y]) => `M${x} ${y}l0 3.2`).join('');
export const KING_ARMS = {
  down: [
    [[-16, -92, 9], [-30, -76, 8.5], [-32, -58, 8]],
    [[16, -92, 9], [30, -76, 8.5], [32, -58, 8]],
  ],
  // both hands up beside his face (amazed)
  wow: [
    [[-16, -92, 9], [-34, -96, 8.5], [-28, -114, 8]],
    [[16, -92, 9], [34, -96, 8.5], [28, -114, 8]],
  ],
  // holding the reins (riding), the other hand waving
  reins: [
    [[-16, -92, 9], [-30, -78, 8.5], [-40, -64, 8]],
    [[16, -92, 9], [30, -80, 8.5], [24, -62, 8]],
  ],
  // one hand on the open door (our left), the other up in surprise
  door: [
    [[-16, -92, 9], [-30, -80, 8.5], [-44, -88, 8]],
    [[16, -92, 9], [34, -96, 8.5], [30, -116, 8]],
  ],
};
export function king({ mood = 'happy', tilt = 0, arms = KING_ARMS.down, riding = false } = {}) {
  const robe = riding ? kRobeRide : kRobe;
  const front = riding ? kFrontRide : kFront;
  const body = {
    lines: [robe],
    fine: [kCollar, ermine([[-8, -96], [0, -94], [8, -96], [0, -80], [-1, -60], [1, -40], [0, -20]].filter(([, y]) => !riding || y < -32))],
    washes: [
      { c: PAL.red, o: 0.82, d: robe },
      { c: PAL.ochre, o: 0.9, d: 'M-35 -50C-12 -44 12 -44 35 -50L35 -44C12 -38 -12 -38 -35 -44Z' },
    ],
    whites: [kCollar, front],
  };
  if (riding) {
    // one leg hanging down the horse's side, in a red stocking and a black boot
    const leg = limb([
      [-16, -32, 11],
      [-20, -8, 9],
      [-21, 14, 8],
    ]);
    const boot = 'M-26 12L-26 22L-8 22C-8 16 -12 14 -16 12Z';
    body.lines.push(leg, boot);
    body.washes.push({ c: PAL.red, o: 0.7, d: `${leg}Z` }, { c: PAL.ink, o: 0.75, d: boot });
    body.fine.push('M-6 -92L-6 -28M6 -92L6 -28');
  } else {
    const shoes = 'M-16 -4L-18 2L-4 2L-4 -4ZM16 -4L18 2L4 2L4 -4Z';
    body.lines.push(shoes);
    body.washes.push({ c: PAL.ink, o: 0.75, d: shoes });
    body.whites.push(kHem);
    body.fine.push('M-6 -92L-6 -10M6 -92L6 -10', 'M-30 -11C-10 -7 10 -7 30 -11', ermine([[-22, -9], [-12, -8], [12, -8], [22, -9]]));
  }
  const armParts = arms.map((a) => arm(a, PAL.red, 0.82, 4.4));
  const head = place(kingHead({ mood }), `translate(${KING_HEAD[0]} ${KING_HEAD[1]}) rotate(${tilt})`);
  return merge(body, ...armParts, head);
}

// ---------------------------------------------------------------------------------------------
// The King's big white horse (hooves at y = 0, facing left), about 190 long: white with grey shading,
// a grey mane and tail, a red bridle and a red saddle cloth. The King sits on it at about y = -104.
export function horse() {
  const body =
    'M22 -104C40 -106 56 -98 56 -84C56 -72 48 -62 38 -60C20 -55 -20 -55 -34 -60C-46 -62 -54 -72 -52 -86C-56 -98 -60 -110 -64 -118C-72 -112 -82 -108 -88 -108C-95 -108 -97 -114 -93 -120C-87 -128 -81 -134 -75 -140L-73 -151L-66 -142C-56 -132 -42 -112 -30 -104C-27 -104 -24 -104 -22 -104';
  const legs = [
    [[-40, -62, 11], [-44, -34, 9], [-44, -7, 8]],
    [[-26, -58, 11], [-24, -32, 9], [-26, -7, 8]],
    [[30, -60, 12], [36, -34, 9], [32, -7, 8]],
    [[44, -66, 12], [50, -36, 9], [48, -7, 8]],
  ];
  const legD = legs.map((l) => limb(l));
  const hooves = legs.map((l) => {
    const [x] = l[l.length - 1];
    return `M${x - 5} -8L${x - 6} 0L${x + 6} 0L${x + 5} -8Z`;
  });
  const mane = 'M-66 -142C-56 -132 -42 -114 -30 -104C-36 -106 -40 -106 -42 -110C-46 -110 -50 -114 -52 -118C-56 -118 -58 -124 -60 -128C-64 -130 -66 -136 -66 -142Z';
  const tail = 'M55 -92C68 -90 74 -72 70 -50C66 -56 64 -64 62 -70C60 -62 56 -58 54 -56C58 -66 58 -76 54 -84';
  const cloth = 'M-24 -106L-27 -72C-10 -68 10 -68 27 -72L24 -106C10 -108 -10 -108 -24 -106Z';
  const bridle = 'M-67 -136L-90 -115M-75 -128L-62 -117M-62 -117C-50 -104 -40 -92 -36 -86';
  return {
    lines: [body, ...legD, ...hooves, tail, cloth],
    fine: [mane, bridle, 'M-90 -113c1 1 2 1 3 0', 'M-46 -112l4 -3M-50 -118l3 -3M-56 -124l4 -3', 'M-22 -76C-10 -73 10 -73 22 -76'],
    washes: [
      { c: PAL.grey, o: 0.14, d: `${body}L22 -104Z` },
      { c: PAL.sky, o: 0.12, d: `${body}L22 -104Z` },
      { c: PAL.grey, o: 0.28, d: legD.map((d) => `${d}Z`).join('') },
      { c: PAL.ink, o: 0.55, d: hooves.join('') },
      { c: PAL.grey, o: 0.85, d: mane + `${tail}Z` },
      { c: PAL.red, o: 0.78, d: cloth },
      { c: PAL.ochre, o: 0.9, d: 'M-27 -76C-10 -72 10 -72 27 -76L27 -72C10 -68 -10 -68 -27 -72Z' },
    ],
    fills: [dot(-79, -128, 1.9)],
    glints: [dot(-79.6, -128.7, 0.6)],
  };
}

// ---------------------------------------------------------------------------------------------
// The miller (feet at 0,0, seen from the side, facing right), about 128 tall standing: round and
// floury, a bald head with a grey tuft, a big nose and a big smile, a brown smock dusted with flour
// under a white apron, grey trousers and wooden clogs; his floppy brown cap is in his hand.
// bow: how far he bows from the hips (deg, his top towards our right).
export function miller({ bow = 0, mood = 'smile' } = {}) {
  const legs = [
    [[-3, -48, 12], [-6, -24, 10], [-6, -6, 9]],
    [[5, -48, 12], [7, -24, 10], [8, -6, 9]],
  ].map((l) => limb(l));
  const clogs = 'M-12 -6L-12 2L6 2C6 -3 2 -6 -2 -6ZM2 -6L2 2L20 2C20 -3 16 -6 12 -6Z';
  const lower = {
    lines: [...legs, clogs],
    washes: [
      { c: PAL.grey, o: 0.5, d: legs.map((d) => `${d}Z`).join('') },
      { c: PAL.terracotta, o: 0.85, d: clogs },
    ],
  };
  // the upper body, standing straight (hips at 0, -48)
  const smock = oval(2, -76, 25, 30);
  const apron = 'M14 -98C28 -92 32 -70 26 -50C20 -46 12 -46 6 -48C10 -64 12 -82 14 -98Z';
  const face = oval(4, -118, 14, 14);
  const nose = oval(18, -116, 4.5, 3.6);
  const tuft = 'M-9 -116c-5 -1 -6 5 -2 6c-3 3 0 7 4 5';
  const ear = 'M0 -120c-4 0 -4 6 0 6';
  const eye = mood === 'smile' ? 'M7 -123q2.5 -2.5 5 0' : '';
  const mouth = 'M8 -110q5 4 9 -1';
  const armBack = limb([
    [-4, -96, 9],
    [-22, -86, 8],
    [-36, -78, 7.5],
  ]);
  const armFront = limb([
    [6, -96, 9],
    [14, -82, 8],
    [24, -72, 7.5],
  ]);
  const hands = dot(-36, -78, 4.4) + dot(24, -72, 4.4);
  const cap = 'M-32 -74C-42 -78 -52 -74 -52 -66C-48 -60 -38 -60 -32 -64C-30 -68 -30 -72 -32 -74Z';
  const upper = place(
    {
      lines: [smock, face, armBack, armFront, cap],
      fine: [apron, nose, tuft, ear, eye, mouth, hands, 'M-42 -62c4 1 8 0 10 -2', dot(-48, -72, 1.5)],
      washes: [
        { c: PAL.terracotta, o: 0.5, d: smock },
        { c: PAL.terracotta, o: 0.5, d: `${armBack}Z${armFront}Z` },
        { c: PAL.rose, o: 0.35, d: face },
        { c: PAL.rose, o: 0.85, d: nose },
        { c: PAL.rose, o: 0.6, d: dot(8, -112, 2.8) },
        { c: PAL.grey, o: 0.7, d: `${tuft}Z` },
        { c: PAL.rose, o: 0.5, d: hands },
        { c: PAL.terracotta, o: 0.85, d: cap },
        { c: PAL.ink, o: 0.2, d: cap },
      ],
      whites: [apron, dot(0, -128, 2.4), dot(-12, -86, 2.4), dot(-8, -60, 2), dot(-16, -70, 1.6), dot(16, -104, 1.6)],
      glints: [dot(19, -118, 1.1)],
    },
    `rotate(${bow} 0 -48)`,
  );
  return merge(lower, upper);
}

// ---------------------------------------------------------------------------------------------
// The spinning wheel (floor at y = 0, centre x = 0), about 110 wide: a big wheel with spokes on two
// posts, a slanting bench on three legs and the spindle on the left with its bobbin. gold: the bobbin
// is full of golden thread.
export function wheel({ gold = true } = {}) {
  const rim = dot(4, -64, 30);
  const inner = dot(4, -64, 25.5);
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 + 0.2;
    return `M${f(4 + Math.cos(a) * 4)} ${f(-64 + Math.sin(a) * 4)}L${f(4 + Math.cos(a) * 25.5)} ${f(-64 + Math.sin(a) * 25.5)}`;
  }).join('');
  const hub = dot(4, -64, 4);
  const bench = 'M-56 -26L40 -34L41 -28L-55 -20Z';
  const legs = 'M-50 -21L-58 0M-40 -22L-34 0M34 -30L42 0';
  const posts = 'M-2 -31L1 -64M10 -32L7 -64';
  const maiden = 'M-46 -23L-46 -52M-40 -24L-40 -52';
  const bobbin = 'M-54 -56L-54 -64L-32 -64L-32 -56Z';
  const band = 'M-34 -64L4 -94M-34 -56L4 -34';
  const treadle = 'M-8 -2L22 -6L22 -2L-8 2Z';
  return {
    lines: [rim, bench, legs, posts, maiden, bobbin],
    fine: [inner, spokes, hub, band, treadle, 'M10 -32L16 -4'],
    washes: [
      { c: PAL.terracotta, o: 0.6, d: rim + inner },
      { c: PAL.ochre, o: 0.45, d: rim + inner },
      { c: PAL.terracotta, o: 0.7, d: bench + 'M-47 -23L-39 -23L-39 -52L-47 -52Z' },
      { c: PAL.ochre, o: 0.4, d: bench },
      { c: PAL.terracotta, o: 0.55, d: treadle },
      { c: gold ? PAL.ochre : PAL.terracotta, o: gold ? 1 : 0.5, d: bobbin },
    ],
    once: gold ? ['M-52 -62l2 4M-47 -63l2 6M-42 -63l2 6M-37 -63l2 6'] : [],
  };
}

// ---------------------------------------------------------------------------------------------
// Heaps and props.

/**
 * A heap of straw (bottom centre at 0,0), w wide and h tall, bristling with stalks. flat: the width of
 * a flat top (for someone to sit on).
 */
export function straw(w = 60, h = 30, seed = 5, flat = 0) {
  const r = rng(seed);
  const half = w / 2;
  const t = flat / 2;
  const outline = `M${-half} 0C${f(-half + (half - t) * 0.08)} ${f(-h * 0.6)} ${f(-t - (half - t) * 0.5)} ${-h} ${f(-t)} ${-h}L${f(t)} ${-h}C${f(t + (half - t) * 0.5)} ${-h} ${f(half - (half - t) * 0.08)} ${f(-h * 0.6)} ${half} 0`;
  const topAt = (x) => (Math.abs(x) <= t ? -h : -h * Math.sin((Math.PI / 2) * (1 - (Math.abs(x) - t) / (half - t))));
  let stalks = '';
  const n = Math.round(w / 6);
  for (let i = 0; i < n; i++) {
    const x = -half + w * ((i + 0.5) / n);
    const top = topAt(x);
    const y = top + (0.15 + r() * 0.5) * h;
    const a = -Math.PI / 2 + (r() - 0.5) * 1.6;
    const l = Math.min(7 + r() * 8, (y - top) * 0.9 + 6);
    if (flat && Math.abs(x) < t) {
      stalks += `M${f(x)} ${f(y + 4)}l${f((r() - 0.5) * 14)} ${f(-3 + r() * 6)}`;
      continue;
    }
    stalks += `M${f(x)} ${f(y)}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`;
  }
  // a few stalks poking out of the top
  for (let i = 0; i < 4; i++) {
    const x = flat ? (i < 2 ? -1 : 1) * (t + (half - t) * (0.15 + r() * 0.3)) : (r() - 0.5) * w * 0.6;
    const a = -Math.PI / 2 + (r() - 0.5) * 1.4;
    const l = 8 + r() * 6;
    stalks += `M${f(x)} ${f(topAt(x) * 0.92)}l${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)}`;
  }
  return {
    lines: [outline],
    fine: [stalks],
    washes: [{ c: PAL.ochre, o: 0.42, d: `${outline}Z` }],
  };
}

/** An arched doorway in the wall (left x, top y, width w, floor at y0), dark inside except for hole. */
export function doorway(x, y, w, y0, hole = '') {
  const r = w / 2;
  const frame = `M${x} ${y0}L${x} ${y + r}C${x} ${f(y + r * 0.45)} ${f(x + r * 0.45)} ${y} ${x + r} ${y}C${f(x + r * 1.55)} ${y} ${x + w} ${f(y + r * 0.45)} ${x + w} ${y + r}L${x + w} ${y0}`;
  const outer = `M${x - 7} ${y0}L${x - 7} ${y + r}C${x - 7} ${f(y + r * 0.4 - 7)} ${f(x + r * 0.42)} ${y - 7} ${x + r} ${y - 7}C${f(x + r * 1.58)} ${y - 7} ${x + w + 7} ${f(y + r * 0.4 - 7)} ${x + w + 7} ${y + r}L${x + w + 7} ${y0}`;
  return {
    lines: [frame],
    fine: [outer],
    washes: [
      { c: PAL.slate, o: 0.8, d: `${frame}Z${hole}`, rule: 'evenodd' },
      { c: PAL.grey, o: 0.5, d: `${outer}Z${frame}Z`, rule: 'evenodd' },
    ],
  };
}

/** A heap of golden thread (bottom centre at 0,0), w wide and h tall: deep gold, with loops of thread. */
export function goldHeap(w = 60, h = 30, seed = 7) {
  const r = rng(seed);
  const d = `M${-w / 2} 0C${f(-w * 0.46)} ${f(-h * 0.6)} ${f(-w * 0.28)} ${-h} 0 ${-h}C${f(w * 0.28)} ${-h} ${f(w * 0.46)} ${f(-h * 0.6)} ${w / 2} 0Z`;
  let loops = '';
  const n = Math.round(w / 9);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const x = -w / 2 + w * t;
    const y = -h * Math.sin(Math.PI * t) * (0.3 + r() * 0.45);
    loops += `M${f(x - 4)} ${f(y)}c1 -4 7 -4 7 0c0 3 -5 3 -4 0`;
  }
  return {
    lines: [`M${-w / 2} 0C${f(-w * 0.46)} ${f(-h * 0.6)} ${f(-w * 0.28)} ${-h} 0 ${-h}C${f(w * 0.28)} ${-h} ${f(w * 0.46)} ${f(-h * 0.6)} ${w / 2} 0`],
    fine: [loops],
    washes: [
      { c: PAL.ochre, o: 1, d },
      { c: PAL.ochre, o: 0.5, d },
    ],
    whites: [`M${f(-w * 0.2)} ${f(-h * 0.8)}C${f(-w * 0.1)} ${f(-h * 0.92)} ${f(w * 0.05)} ${f(-h * 0.94)} ${f(w * 0.14)} ${f(-h * 0.88)}C${f(w * 0.04)} ${f(-h * 0.86)} ${f(-w * 0.08)} ${f(-h * 0.84)} ${f(-w * 0.2)} ${f(-h * 0.8)}Z`],
  };
}

/** A spool of golden thread standing on the floor (bottom centre at 0,0), about 18 tall. */
export function spool() {
  const top = 'M-9 -18C-9 -21 9 -21 9 -18C9 -15 -9 -15 -9 -18Z';
  const body = 'M-6 -16C-8 -12 -8 -6 -6 -2L6 -2C8 -6 8 -12 6 -16Z';
  const base = 'M-9 -2C-9 -5 9 -5 9 -2C9 1 -9 1 -9 -2Z';
  return {
    lines: [top, body, base],
    fine: ['M-6 -12l12 -1M-6 -8l12 -1M-6 -5l12 -1'],
    washes: [
      { c: PAL.terracotta, o: 0.7, d: top + base },
      { c: PAL.ochre, o: 1, d: body },
    ],
  };
}

/**
 * A little three-legged wooden stool (seat top at y = -h), about 36 wide. gap: the half-width of the
 * middle of the seat's front edge left undrawn, where someone sitting on it hides it.
 */
export function stool(h = 26, gap = 0) {
  const seat = `M-18 ${-h}C-18 ${-h - 5} 18 ${-h - 5} 18 ${-h}L18 ${-h + 4}C18 ${-h + 8} -18 ${-h + 8} -18 ${-h + 4}Z`;
  const seatLine = gap
    ? `M${-gap} ${-h - 3.6}C-10 ${-h - 4} -18 ${-h - 3} -18 ${-h}L-18 ${-h + 4}C-18 ${-h + 6} ${-gap - 4} ${-h + 7} ${-gap} ${-h + 7}M${gap} ${-h - 3.6}C10 ${-h - 4} 18 ${-h - 3} 18 ${-h}L18 ${-h + 4}C18 ${-h + 6} ${gap + 4} ${-h + 7} ${gap} ${-h + 7}`
    : seat;
  const legs = gap ? `M-12 ${-h + 6}L-17 0M12 ${-h + 6}L17 0` : `M-12 ${-h + 6}L-17 0M12 ${-h + 6}L17 0M0 ${-h + 8}L0 0`;
  return {
    lines: [seatLine, legs],
    washes: [
      { c: PAL.terracotta, o: 0.7, d: seat },
      { c: PAL.terracotta, o: 0.5, d: `M-13 ${-h + 6}L-18 0L-15 0L-10 ${-h + 6}ZM10 ${-h + 6}L15 0L18 0L13 ${-h + 6}Z` },
    ],
  };
}

/** The big wooden spoon (the end of the handle at 0,0, the bowl along +x), about 130 long. */
export function spoon() {
  const handle = 'M0 -4C30 -5 70 -5 96 -4L96 4C70 5 30 5 0 4C-3 4 -3 -4 0 -4Z';
  const bowl = 'M96 -4C102 -14 120 -16 130 -10C138 -4 138 4 130 10C120 16 102 14 96 4Z';
  return {
    lines: [handle, bowl],
    fine: ['M104 -6C112 -10 122 -10 128 -6', 'M20 -1l14 0M50 1l16 0'],
    washes: [
      { c: PAL.ochre, o: 0.7, d: handle + bowl },
      { c: PAL.terracotta, o: 0.45, d: handle + bowl },
    ],
  };
}

/** A round-topped window in the stone wall (left x, top y, width w, height h), night or day. */
export function windowArch(x, y, w, h, { night = true, moon = true, open = false } = {}) {
  const r = w / 2;
  const frame = `M${x} ${y + h}L${x} ${y + r}C${x} ${f(y + r * 0.45)} ${f(x + r * 0.45)} ${y} ${x + r} ${y}C${f(x + r * 1.55)} ${y} ${x + w} ${f(y + r * 0.45)} ${x + w} ${y + r}L${x + w} ${y + h}Z`;
  const out = {
    lines: [frame],
    fine: [`M${x - 4} ${y + h}L${x + w + 4} ${y + h}L${x + w + 4} ${y + h + 5}L${x - 4} ${y + h + 5}Z`],
    washes: [{ c: night ? PAL.slate : PAL.sky, o: night ? 0.75 : 0.5, d: frame }],
    whites: [],
  };
  if (!open) out.fine.push(`M${x + r} ${y}L${x + r} ${y + h}M${x} ${f(y + h * 0.55)}L${x + w} ${f(y + h * 0.55)}`);
  if (moon && night) {
    const mx = x + w * 0.3;
    const my = y + h * 0.3;
    const moonD = `M${f(mx)} ${f(my - 7)}C${f(mx - 9)} ${f(my - 6)} ${f(mx - 9)} ${f(my + 6)} ${f(mx)} ${f(my + 7)}C${f(mx - 4)} ${f(my + 3)} ${f(mx - 4)} ${f(my - 3)} ${f(mx)} ${f(my - 7)}Z`;
    out.fine.push(moonD);
    out.whites.push(moonD);
  }
  return out;
}

/** Whirring marks: arcs around (cx, cy) at radius r, one for each [from, to] angle pair (degrees). */
export function whirr(cx, cy, r, spans) {
  const p = (a, rr) => [f(cx + Math.cos((a * Math.PI) / 180) * rr), f(cy + Math.sin((a * Math.PI) / 180) * rr)];
  return spans
    .map(([a1, a2], i) => {
      const rr = r + (i % 2) * 5;
      const [x1, y1] = p(a1, rr);
      const [x2, y2] = p(a2, rr);
      return `M${x1} ${y1}A${rr} ${rr} 0 0 1 ${x2} ${y2}`;
    })
    .join('');
}

/** Shining rays fanning out above a point (cx, cy): n short strokes from angle a1 to a2 (degrees). */
export function shine(cx, cy, r1, r2, n, a1 = 200, a2 = 340) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = ((a1 + ((a2 - a1) * i) / (n - 1)) * Math.PI) / 180;
    const k = i % 2 ? 0.8 : 1;
    d += `M${f(cx + Math.cos(a) * r1)} ${f(cy + Math.sin(a) * r1)}L${f(cx + Math.cos(a) * r2 * k)} ${f(cy + Math.sin(a) * r2 * k)}`;
  }
  return d;
}
