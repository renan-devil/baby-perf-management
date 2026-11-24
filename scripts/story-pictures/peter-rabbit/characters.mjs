import { PAL, parseTransform, transformPath } from '../lib.mjs';

// The Tale of Peter Rabbit: the characters shared by the five pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (arm, leg, ear) along a centreline of [x, y, width] points, open at the root. */
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

/** A teardrop (tip up) of height h at (x, y). */
export const tear = (x, y, h) =>
  `M${f(x)} ${f(y - h)}C${f(x + h * 0.15)} ${f(y - h * 0.5)} ${f(x + h * 0.42)} ${f(y - h * 0.2)} ${f(x + h * 0.36)} ${f(y + h * 0.05)}C${f(x + h * 0.3)} ${f(y + h * 0.36)} ${f(x - h * 0.3)} ${f(y + h * 0.36)} ${f(x - h * 0.36)} ${f(y + h * 0.05)}C${f(x - h * 0.42)} ${f(y - h * 0.2)} ${f(x - h * 0.15)} ${f(y - h * 0.5)} ${f(x)} ${f(y - h)}Z`;

// ---------------------------------------------------------------------------------------------
// A rabbit's head (Peter, and his Mother scaled up), centre 0,0, facing right: a round head with a
// short snout, a pink nose, whiskers, and two long ears from the top of the head. The ears are drawn
// upright and turned about their roots by `ears` degrees (0 upright, -60 flat back, -30 drooping).
// mood: 'happy', 'scared' (wide eye), 'cry' (shut eye, big tears), 'sleepy', 'kind'.
const rHead = 'M-15 2C-16 -9 -8 -16 2 -16C11 -16 17 -10 20 -3C22 2 19 7 13 9C6 12 -9 13 -15 2Z';
const rNose = 'M18.5 -4.5C20.5 -5 22.5 -4 21.5 -2C20.5 -0.5 18 -1.5 18.5 -4.5Z';
const rMouth = 'M20 -1q0 3 -3.5 4M20 -1q1.5 2.5 -0.5 4.5';
const rWhiskers = 'M22 -2l10 -3M22 0l10 1.5M21 1l8 4';
const rCheek = 'M-8 4c3 3 7 4 10 3';
const EAR_ROOTS = [
  [-6, -13],
  [1, -15],
];
const earLimb = (x, y) => limb([[x, y, 7], [x - 1.5, y - 13, 9], [x - 2, y - 26, 8], [x - 1, y - 35, 4]]);
const earInner = (x, y) => limb([[x - 0.5, y - 5, 2.5], [x - 1.5, y - 14, 4.5], [x - 2, y - 25, 3.5], [x - 1.5, y - 31, 1.5]]);

export function rabbitHead({ mood = 'happy', ears = -12, earSpread = 14, fur = PAL.grey } = {}) {
  const earParts = EAR_ROOTS.map(([x, y], i) => {
    const t = `rotate(${ears + (i === 0 ? -earSpread / 2 : earSpread / 2)} ${x} ${y})`;
    return place(
      {
        lines: [earLimb(x, y)],
        washes: [
          { c: fur, o: 0.6, d: `${earLimb(x, y)}Z` },
          { c: PAL.ochre, o: 0.22, d: `${earLimb(x, y)}Z` },
          { c: PAL.rose, o: 0.6, d: `${earInner(x, y)}Z` },
        ],
      },
      t,
    );
  });
  const fine = [rMouth, rWhiskers, rCheek, rNose];
  const fills = [];
  const glints = [];
  const whites = [];
  const washes = [
    { c: fur, o: 0.6, d: rHead },
    { c: PAL.ochre, o: 0.25, d: rHead },
    { c: PAL.rose, o: 0.9, d: rNose },
    { c: PAL.rose, o: 0.45, d: dot(9, 3, 3) },
  ];
  if (mood === 'happy' || mood === 'kind') {
    fills.push(dot(7, -6, 2.3));
    glints.push(dot(6.3, -6.8, 0.7));
    if (mood === 'kind') fine.push('M3 -11q4 -2 8 0');
  } else if (mood === 'scared') {
    whites.push(oval(7, -6, 3.8, 4.4));
    fine.push(oval(7, -6, 3.8, 4.4), 'M2 -13q5 -4 10 -1');
    fills.push(dot(8.2, -5.6, 2));
    glints.push(dot(7.6, -6.3, 0.6));
  } else if (mood === 'cry') {
    fine.push('M3 -6q4 2.5 8 -0.5', 'M3 -11q4 -1 8 2', 'M14 4q3 2 6 0');
    for (const [x, y, h] of [[8, 1, 6], [4, 10, 7]]) {
      fine.push(tear(x, y, h));
      washes.push({ c: PAL.sky, o: 0.9, d: tear(x, y, h) });
    }
  } else if (mood === 'sleepy') {
    fine.push('M3 -6q4 2.5 8 0', 'M3.5 -6.5q4 -2.5 7 -0.5');
  }
  return merge(...earParts, { lines: [rHead], fine, washes, whites, fills, glints });
}

// ---------------------------------------------------------------------------------------------
// Peter (facing right), his torso centred at 0,0 in a sky-blue jacket with big brass buttons down
// its front, his head on top at PETER_HEAD. A pose turns the torso and head and gives his arms and
// legs (limb centrelines in the torso's own coordinates, before the turn).
export const PETER_HEAD = [7, -31];
const pJacket = 'M-9 -19C-17 -13 -19 2 -17 17C-6 21 6 21 15 17C18 4 16 -9 9 -19C4 -22 -4 -22 -9 -19Z';
const pCollar = 'M-9 -19C-6 -13 3 -13 9 -19M9 -19L4 -10';
const BUTTONS = [
  [12, -5],
  [13, 5],
  [13, 14],
];
const buttons = (r = 2.4) => BUTTONS.map(([x, y]) => dot(x, y, r)).join('');
const pTail = dot(-20, 18, 5.5);

export const PETER_POSES = {
  // sitting up, hunched and crying (tummy towards us), paws to his face
  sit: {
    torso: '',
    head: 'rotate(14)',
    ears: -48,
    arms: [[[4, -14, 7], [14, -4, 6.5], [20, 4, 6]]],
    legs: [[[-8, 14, 14], [-6, 24, 13], [8, 28, 9], [22, 28, 7]]],
  },
  // running flat out, ears streaming back
  run: {
    torso: 'rotate(58)',
    head: 'rotate(-40)',
    ears: -78,
    arms: [
      [[4, -12, 7], [16, -10, 6.5], [28, -18, 6]],
      [[0, -10, 6.5], [10, -2, 6], [22, -2, 5.5]],
    ],
    legs: [
      [[-8, 14, 13], [-10, 28, 11], [-6, 42, 8], [-4, 54, 7]],
      [[2, 14, 11], [2, 28, 9], [10, 38, 7], [16, 46, 6]],
    ],
  },
  // squeezing flat on his tummy, front paws reaching out, back legs pushing
  crawl: {
    torso: 'rotate(84)',
    head: 'rotate(-70)',
    ears: -84,
    arms: [[[6, -12, 7], [16, -22, 6.5], [22, -36, 6]]],
    legs: [[[-8, 14, 13], [-8, 30, 11], [-6, 44, 8], [-2, 56, 7]]],
  },
};

export function peter({ pose = 'sit', mood = 'happy', head = undefined, ears = undefined, buttonR = 2.4 } = {}) {
  const P = typeof pose === 'string' ? PETER_POSES[pose] : pose; // a name, or a pose of the same shape
  const legParts = P.legs.map((l) => {
    const d = limb(l);
    return { lines: [d], washes: [{ c: PAL.grey, o: 0.6, d: `${d}Z` }, { c: PAL.ochre, o: 0.22, d: `${d}Z` }] };
  });
  const armParts = P.arms.map((a) => {
    const d = limb(a);
    const [x, y] = a[a.length - 1];
    const paw = dot(x + (a[a.length - 1][0] - a[a.length - 2][0]) * 0.25, y + (a[a.length - 1][1] - a[a.length - 2][1]) * 0.25, 3.6);
    return {
      lines: [d],
      fine: [paw],
      washes: [
        { c: PAL.sky, o: 0.8, d: `${d}Z` },
        { c: PAL.grey, o: 0.6, d: paw },
      ],
    };
  });
  const body = {
    lines: [pJacket, pTail],
    fine: [pCollar, buttons(buttonR), 'M-14 8l4 0M-15 12l4 0'],
    washes: [
      { c: PAL.sky, o: 0.8, d: pJacket + buttons(buttonR), rule: 'evenodd' },
      { c: PAL.slate, o: 0.18, d: pJacket + buttons(buttonR), rule: 'evenodd' },
      { c: PAL.ochre, o: 0.95, d: buttons(buttonR) },
    ],
    glints: BUTTONS.map(([x, y]) => dot(x - 0.7, y - 0.8, 0.7)),
  };
  const h = place(rabbitHead({ mood, ears: ears ?? P.ears }), `translate(${PETER_HEAD[0]} ${PETER_HEAD[1]}) ${head ?? P.head}`);
  const inner = merge(...legParts.slice(1), legParts[0], body, ...armParts.slice(1), h, armParts[0]);
  return P.torso ? place(inner, P.torso) : inner;
}

/** Just Peter's two ears (roots at 0,0, upright), to stick out of things. */
export function peterEars({ ears = -8, spread = 22 } = {}) {
  const head = rabbitHead({ ears, earSpread: spread });
  // the ears are the first two parts of the head; take only their shapes
  const keep = (list, n) => list.slice(0, n);
  return { lines: keep(head.lines, 2), washes: keep(head.washes, 6) };
}

// ---------------------------------------------------------------------------------------------
// Mother Rabbit (feet at 0,0, facing left), about 150 tall: Peter's head scaled up, a rose dress
// under a white apron, holding out a cup of camomile tea in both paws.
const mDress = 'M-12 -98C-22 -86 -26 -60 -28 -40C-30 -24 -32 -10 -30 -2C-12 2 12 2 30 -2C30 -14 28 -34 24 -56C22 -76 20 -90 12 -98C4 -102 -4 -102 -12 -98Z';
const mApron = 'M-14 -66C-18 -48 -22 -26 -22 -6C-8 -3 8 -3 20 -6C18 -26 16 -48 12 -66C2 -63 -6 -63 -14 -66Z';
const mBib = 'M-10 -66L-8 -86L6 -86L8 -66';
const mStrings = 'M-14 -66C-22 -64 -26 -60 -26 -56M12 -66C18 -64 22 -60 24 -54';
const mFeet = 'M-22 -2C-28 -2 -34 2 -30 4L-14 4L-12 -1M20 -2C26 -2 30 2 26 4L12 4L10 -1';
export const MOTHER_CUP = [-38, -64];
export function mother() {
  const arms = [
    [[-6, -86, 11], [-18, -78, 10], [-30, -72, 9]],
    [[8, -86, 11], [-4, -70, 10], [-24, -64, 9]],
  ].map((a) => {
    const d = limb(a);
    return { lines: [d], washes: [{ c: PAL.rose, o: 0.6, d: `${d}Z` }] };
  });
  const paws = dot(-33, -72, 4.6) + dot(-27, -63, 4.6);
  const head = place(rabbitHead({ mood: 'kind', ears: -6, earSpread: 12 }), 'translate(-4 -116) scale(-1.25 1.25) rotate(8)');
  const body = {
    lines: [mDress, mFeet],
    fine: [mApron, mBib, mStrings, 'M-6 -40q6 3 12 0'],
    washes: [
      { c: PAL.rose, o: 0.6, d: mDress },
      { c: PAL.grey, o: 0.6, d: mFeet },
    ],
    whites: [mApron + mBib + 'Z'],
  };
  const pawPart = { fine: [paws], washes: [{ c: PAL.grey, o: 0.6, d: paws }] };
  return merge(arms[1], body, head, arms[0], pawPart);
}

/** A teacup on its saucer (base centre 0,0), with curls of steam. */
export function teacup() {
  const cup = 'M-9 -14C-9 -4 -6 0 0 0C6 0 9 -4 9 -14Z';
  const handle = 'M9 -11C14 -12 15 -5 8 -4';
  const saucer = 'M-15 0C-8 3 8 3 15 0';
  const steam = 'M-3 -18c-3 -4 3 -6 0 -10c-2 -3 2 -5 1 -7M4 -18c-3 -4 3 -6 0 -10';
  return {
    lines: [cup, saucer],
    fine: [handle, steam, 'M-9 -14C-4 -12 4 -12 9 -14'],
    washes: [
      { c: PAL.paper, o: 1, d: cup },
      { c: PAL.sky, o: 0.45, d: cup },
      { c: PAL.ochre, o: 0.8, d: 'M-8.5 -14C-4 -12 4 -12 8.5 -14C4 -15.5 -4 -15.5 -8.5 -14Z' },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Mr McGregor (feet at 0,0, running to the right), about 160 tall: an old gardener with a white
// beard, a big round nose, a battered straw hat, a white shirt with red braces, slate trousers and
// brown boots, waving a rake high over his head.
const gFace = oval(0, 0, 12, 14);
const gNose = oval(12, 1, 4.5, 4);
const gBeard = 'M-11 0C-15 16 -6 34 8 32C19 30 23 18 18 5C13 10 6 11 2 8C-3 10 -8 6 -11 0Z';
const gMouth = oval(10, 14, 3.2, 3.8);
const gHat = 'M-26 -8C-12 -14 14 -15 28 -8C16 -4 -14 -3 -26 -8ZM-13 -10C-14 -24 -4 -29 2 -29C10 -29 14 -22 13 -11';
const gBand = 'M-13 -12C-4 -9 6 -9 13 -12L13 -16C6 -13 -4 -13 -13 -16Z';
const gBrow = 'M1 -9l10 4';
export function mcgregorHead() {
  return {
    lines: ['M-11 3C-13 -8 -7 -14 0 -14C7 -14 12 -8 12 -2', gHat],
    fine: [gNose, gBeard, gBrow, 'M-8 -2c-3 -1 -4 3 -1 4', 'M-11 -6l-3 -2M-12 -1l-4 0'],
    washes: [
      { c: PAL.rose, o: 0.4, d: gFace },
      { c: PAL.rose, o: 0.8, d: gNose },
      { c: PAL.ochre, o: 0.75, d: gHat },
      { c: PAL.terracotta, o: 0.85, d: gBand },
      { c: PAL.grey, o: 0.25, d: gBeard },
    ],
    whites: [gBeard],
    fills: [dot(5, -3, 2), gMouth],
  };
}
const gShirt = 'M-14 -114C-22 -98 -22 -78 -18 -62L12 -62C16 -80 16 -98 10 -116C3 -120 -8 -120 -14 -114Z';
const gBraces = 'M-11 -62L-8 -116M4 -62L5 -117';
const gBracesWash = 'M-13 -62L-10 -116L-6 -116L-9 -62ZM2 -62L3 -117L7 -117L6 -62Z';
const boot = (x, y) => `M${f(x - 7)} ${f(y - 4)}L${f(x - 8)} ${f(y + 5)}L${f(x + 12)} ${f(y + 5)}C${f(x + 13)} ${f(y)} ${f(x + 8)} ${f(y - 3)} ${f(x + 5)} ${f(y - 4)}Z`;
export function mcgregor() {
  const legs = [
    [[-12, -62, 15], [-28, -36, 13], [-46, -14, 12]],
    [[2, -62, 15], [18, -36, 13], [22, -5, 12]],
  ].map((l) => {
    const d = limb(l);
    const [x, y] = l[l.length - 1];
    const b = boot(x, y);
    return { lines: [d, b], washes: [{ c: PAL.slate, o: 0.7, d: `${d}Z` }, { c: PAL.terracotta, o: 0.85, d: b }] };
  });
  const arms = [
    [[-10, -108, 10], [-28, -96, 9], [-36, -80, 8]],
    [[8, -110, 10], [36, -108, 9], [48, -138, 8]],
  ].map((a) => {
    const d = limb(a);
    const [x, y] = a[a.length - 1];
    const hand = dot(x, y - 2, 5);
    return { lines: [d], fine: [hand], washes: [{ c: PAL.sky, o: 0.3, d: `${d}Z` }, { c: PAL.rose, o: 0.55, d: hand }] };
  });
  // the rake, held high and shaken: a long handle, a crossbar and its teeth
  const rake = 'M38 -112L80 -200M64 -207L98 -189';
  const teeth = 'M68 -205l5 -8M75 -201l5 -8M82 -197l5 -8M89 -193l5 -8M96 -189l5 -8';
  const rakePart = { lines: [rake], fine: [teeth], washes: [{ c: PAL.ochre, o: 0.7, d: 'M36 -111L78 -201L82 -199L40 -109Z' }] };
  const body = {
    lines: [gShirt],
    fine: [gBraces, 'M-4 -116q4 6 8 0'],
    washes: [
      { c: PAL.sky, o: 0.3, d: gShirt },
      { c: PAL.red, o: 0.8, d: gBracesWash },
    ],
  };
  const head = place(mcgregorHead(), 'translate(2 -136) rotate(4) scale(1.1)');
  const lean = 'rotate(10 -4 -62)';
  return merge(legs[0], place(merge(arms[0], body), lean), legs[1], place(merge(head, rakePart, arms[1]), lean));
}

// ---------------------------------------------------------------------------------------------
// A little sparrow (centre 0,0, flying to the right, wings up): a brown body, an ochre wing, a grey
// tummy and a short beak.
const sBody = 'M-12 2C-8 -6 2 -8 9 -7C12 -12 20 -11 21 -5C22 0 16 5 8 7C0 9 -8 7 -12 2Z';
const sTail = 'M-11 0L-22 -4C-24 0 -24 4 -22 7L-10 4Z';
const sWing = 'M-4 -3C-8 -12 -4 -24 8 -30C7 -25 9 -21 7 -17C10 -14 9 -8 5 -4';
const sBelly = 'M-6 5C0 8 8 7 14 3C8 4 0 4 -6 5Z';
export function sparrow() {
  return {
    lines: [sBody, sTail],
    fine: [sWing, 'M21 -5l5 1.5l-5 1.5', 'M0 -22l3 -2M1 -16l4 -1'],
    washes: [
      { c: PAL.terracotta, o: 0.6, d: sBody + sTail },
      { c: PAL.ochre, o: 0.7, d: `${sWing}Z` },
      { c: PAL.grey, o: 0.5, d: sBelly },
      { c: PAL.ochre, o: 0.9, d: 'M21 -5l5 1.5l-5 1.5Z' },
    ],
    fills: [dot(15.5, -6.5, 1.5)],
    glints: [dot(15.1, -6.9, 0.45)],
  };
}
