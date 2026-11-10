import { PAL, parseTransform, transformPath } from '../lib.mjs';

// The Boy Who Cried Wolf: the characters shared by the five pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. Standing characters have their feet at y = 0.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (leg, arm, tail) along a centreline of [x, y, width] points, open at the root. */
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

/** A woolly cloud edge: an ellipse of little round bumps, as closed path data. */
export function wool(cx, cy, rx, ry, n = 11, bump = 1.25, start = 0) {
  const pt = (a, k = 1) => [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * 2 * Math.PI;
    const [x, y] = pt(a);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const [c1x, c1y] = pt(a - (2 * Math.PI) / n * 0.8, bump);
      const [c2x, c2y] = pt(a - (2 * Math.PI) / n * 0.2, bump);
      d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x)} ${f(y)}`;
    }
  }
  return `${d}Z`;
}

// A character: { lines: [d], fine: [d], washes: [{c, o, d, rule?}], whites: [d], fills: [d], glints: [d] }.
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

/** Puts several characters together into one. */
export const merge = (...parts) => {
  const out = { lines: [], fine: [], washes: [], whites: [], fills: [], glints: [] };
  for (const p of parts) for (const k of Object.keys(out)) out[k].push(...(p[k] ?? []));
  return out;
};

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

// ---------------------------------------------------------------------------------------------
// Faces (centre of the face at 0,0, radius 13), shared by Peter and the villagers.
//   mood: 'happy', 'call' (calling out: mouth a big O), 'shout' (eyes wide in alarm, mouth a big O), 'laugh' (eyes screwed shut, mouth wide open),
//   'giggle' (eyes screwed shut; his hand hides the mouth), 'cross' (brows down, a frown),
//   'puff' (out of breath: round cheeks and a little o), 'content' (eyes shut, smiling), 'sad'.
const faceShape = 'M-13 0C-13 -9 -7 -13 0 -13C8 -13 13 -8 13 0C13 9 7 13 0 13C-8 13 -13 8 -13 0Z';

function faceMarks(mood, { brows = true } = {}) {
  const fine = [];
  const fills = [];
  const whites = [];
  const glints = [];
  const washes = [];
  const shut = 'M-8 0q3 -3.5 6 0M2 0q3 -3.5 6 0';
  const eyes = (r = 1.9, dy = 0) => {
    fills.push(dot(-5, dy, r), dot(5, dy, r));
    glints.push(dot(-5.5, dy - 0.7, 0.6), dot(4.5, dy - 0.7, 0.6));
  };
  if (mood === 'call') {
    eyes(2.1, -2);
    fills.push(oval(0, 7.5, 3.6, 4.4));
  } else if (mood === 'shout') {
    whites.push(dot(-5, -1, 3.2), dot(5, -1, 3.2));
    fine.push(dot(-5, -1, 3.2), dot(5, -1, 3.2));
    fills.push(dot(-5, -0.6, 1.5), dot(5, -0.6, 1.5), oval(0, 7.5, 3.8, 4.6));
    if (brows) fine.push('M-9 -7q3 -3 6 -1M3 -8q3 -2 6 1');
  } else if (mood === 'laugh') {
    fine.push(shut, 'M-6 4C-5 11 5 11 6 4Z');
    washes.push({ c: PAL.red, o: 0.85, d: 'M-6 4C-5 11 5 11 6 4Z' });
  } else if (mood === 'giggle') {
    fine.push(shut);
  } else if (mood === 'content') {
    fine.push(shut, 'M-5 5q5 5 10 0');
  } else if (mood === 'cross') {
    eyes(1.8, 0);
    fine.push('M-9 -6L-2 -3.5M2 -3.5L9 -6', 'M-5 8q5 -4 10 0');
  } else if (mood === 'puff') {
    eyes(1.8, -1);
    fills.push(oval(0, 7, 2, 2.4));
    if (brows) fine.push('M-8 -7q3 -2 6 0M2 -7q3 -2 6 0');
  } else if (mood === 'sad') {
    eyes(1.8, 0);
    fine.push('M-8 -5L-3 -7M3 -7L8 -5', 'M-4 7q4 -3 8 0');
  } else {
    eyes();
    fine.push('M-5 5q5 5 10 0');
  }
  const cheek = mood === 'puff' ? 3.6 : 2.6;
  washes.push({ c: mood === 'puff' ? PAL.red : PAL.rose, o: mood === 'puff' ? 0.55 : 0.6, d: dot(-9, 4, cheek) + dot(9, 4, cheek) });
  return { fine, fills, whites, glints, washes };
}

// Peter's tousled ochre hair: a crown of uneven tufts with a jagged fringe.
const peterHair = (() => {
  const N = 7;
  const tip = [20, 23, 21, 24, 20, 22, 19];
  const at = (deg, r) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
  const step = 210 / N;
  let d = `M${at(165, 14).map(f).join(' ')}`;
  for (let i = 0; i < N; i++) {
    const [cx, cy] = at(165 + step * (i + 0.5) + (i % 2 ? 6 : -4), tip[i]);
    const [x, y] = at(165 + step * (i + 1), 15);
    d += `Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}`;
  }
  return `${d}L11 -4L7 -8L4 -4L0 -9L-4 -4L-8 -8L-11 -3Z`;
})();

/** Peter's head (centre of the face at 0,0). */
export function peterHead({ mood = 'happy' } = {}) {
  const m = faceMarks(mood, { brows: false });
  return {
    lines: [faceShape, peterHair],
    fine: ['M-6 -15q2 -3 5 -3M4 -15q3 -1 5 1', ...m.fine],
    washes: [{ c: PAL.rose, o: 0.25, d: faceShape }, { c: PAL.ochre, o: 0.9, d: peterHair }, ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

// ---------------------------------------------------------------------------------------------
// Peter, the shepherd boy (feet at 0,0, about 108 tall): a terracotta tunic with a belt, bare
// legs, slate shoes. The head sits at PETER_HEAD, turned by tilt. arms: two limb centrelines from
// the shoulders (±9, -68), each ending at the hand. legs: 'stand', 'run' or 'kick' (in the air).
export const PETER_HEAD = [0, -86];
export const PETER_ARMS = {
  down: [[-9, -68, 6.5], [-14, -56, 5.5], [-17, -44, 5.5]],
  cup: [[-9, -68, 6.5], [-22, -70, 5.5], [-8, -77, 5.5]],
  up: [[-9, -68, 6.5], [-20, -80, 5.5], [-26, -96, 5.5]],
  belly: [[-9, -68, 6.5], [-16, -58, 5.5], [-6, -52, 5.5]],
  mouth: [[-9, -68, 6.5], [-16, -66, 5.5], [-4, -80, 5.5]],
};
/** Mirrors a left arm to the right side. */
export const right = (pts) => pts.map(([x, y, w]) => [-x, y, w]);

const tunic = 'M-8 -72C-14 -62 -18 -46 -20 -32C-8 -28 8 -28 20 -32C18 -46 14 -62 8 -72';
const PETER_LEGS = {
  stand: [[[-6, -31, 7], [-7, -16, 6], [-7, -4, 6]], [[6, -31, 7], [7, -16, 6], [7, -4, 6]]],
  run: [[[-6, -31, 7], [-14, -18, 6], [-22, -10, 6]], [[6, -31, 7], [12, -18, 6], [10, -4, 6]]],
  kick: [[[-5, -31, 7], [12, -40, 6], [28, -47, 6]], [[6, -31, 7], [22, -27, 6], [39, -33, 6]]],
};
const shoe = (pts) => {
  const [x, y] = pts[pts.length - 1];
  return oval(x, y + 1, 5, 3.2);
};

export function peter({ mood = 'happy', tilt = 0, arms = [PETER_ARMS.down, right(PETER_ARMS.down)], legs = 'stand' } = {}) {
  const head = place(peterHead({ mood }), `translate(${PETER_HEAD[0]} ${PETER_HEAD[1]}) rotate(${tilt})`);
  const armPaths = arms.map(limb);
  const legPts = PETER_LEGS[legs];
  const legPaths = legPts.map(limb);
  const shoes = legPts.map(shoe).join('');
  const hands = arms.map((a) => dot(a[a.length - 1][0], a[a.length - 1][1], 3.6)).join('');
  return merge(
    {
      lines: [...legPaths, tunic, ...armPaths],
      fine: ['M-3 -75L-3 -71M3 -75L3 -71', 'M-16 -48C-6 -45 6 -45 16 -48', shoes, 'M-2 -60l4 4M-9 -40l3 3M8 -38l3 -3'],
      washes: [
        { c: PAL.rose, o: 0.3, d: `${legPaths.join('Z')}Z${hands}` },
        { c: PAL.terracotta, o: 0.78, d: `${tunic}Z${armPaths.join('Z')}Z` },
        { c: PAL.ochre, o: 0.6, d: 'M-16 -48C-6 -45 6 -45 16 -48L16 -44C6 -41 -6 -41 -16 -44Z' },
        { c: PAL.slate, o: 0.75, d: shoes },
      ],
    },
    head,
  );
}

/** Where Peter's hand is for an arm centreline. */
export const handOf = (arm) => arm[arm.length - 1].slice(0, 2);

/** Peter's shepherd's crook (bottom at 0,0, about 120 tall), an ochre staff with a hook at the top. */
export function crook() {
  const staff = 'M0 0L0 -108C0 -124 18 -124 18 -110C18 -104 14 -102 11 -104';
  return {
    lines: [staff],
    fine: ['M-2 -40l4 0M-2 -76l4 0'],
    washes: [{ c: PAL.ochre, o: 0.8, d: 'M-2 0L-2 -108C-2 -127 20 -127 20 -110C20 -103 14 -100 10 -103L12 -106C16 -106 16 -120 2 -116L2 0Z' }],
  };
}

// ---------------------------------------------------------------------------------------------
// The villagers (feet at 0,0, about 150 tall): the head sits at V_HEAD. kind:
//   'baker'  white apron and tall white hat, sky shirt, grey trousers, a ginger moustache;
//   'farmer' green dress, terracotta hair in a bun.
// arms: two limb centrelines from the shoulders (±11, -100); legs: 'stand' or 'run'.
export const V_HEAD = [0, -118];
export const V_ARMS = {
  down: [[-11, -100, 8], [-17, -84, 7], [-20, -66, 7]],
  hip: [[-11, -100, 8], [-27, -86, 7], [-17, -70, 7]],
  fwd: [[-11, -100, 8], [-24, -94, 7], [-36, -100, 7]],
  back: [[-11, -100, 8], [-22, -88, 7], [-34, -82, 7]],
  up: [[-11, -100, 8], [-24, -112, 7], [-30, -130, 7]],
  low: [[-11, -100, 8], [-20, -86, 7], [-28, -74, 7]],
};

const vTorso = 'M-11 -102C-17 -90 -19 -70 -18 -50L18 -50C19 -70 17 -90 11 -102';
const vDress = 'M-11 -102C-17 -84 -24 -40 -28 -14C-10 -10 10 -10 28 -14C24 -40 17 -84 11 -102';
const V_LEGS = {
  stand: [[[-8, -52, 11], [-9, -26, 10], [-9, -4, 9]], [[8, -52, 11], [9, -26, 10], [9, -4, 9]]],
  run: [[[-7, -52, 11], [-20, -30, 10], [-34, -18, 9]], [[7, -52, 11], [18, -30, 10], [16, -4, 9]]],
};
const D_LEGS = {
  stand: [[[-7, -14, 6], [-7, -4, 6]], [[7, -14, 6], [7, -4, 6]]],
  run: [[[-9, -16, 6], [-18, -8, 6]], [[9, -16, 6], [14, -4, 6]]],
};
const bigShoe = (pts) => {
  const [x, y] = pts[pts.length - 1];
  return oval(x + 2, y + 1, 7, 3.6);
};

// the heads' own hair and hats (centre of the face at 0,0)
const bakerHat = 'M-12 -8L-12 -17C-22 -18 -23 -33 -13 -34C-12 -45 4 -46 7 -38C15 -45 26 -34 17 -27C21 -22 17 -17 12 -17L12 -8Z';
const bakerHatMarks = 'M-12 -17L12 -17M-4 -17C-6 -24 -4 -30 0 -33M6 -18C8 -24 10 -28 14 -30';
const bakerHair = 'M-13 -4C-16 -2 -16 4 -13 6M13 -4C16 -2 16 4 13 6';
const moustache = 'M-8 4C-5 0 -1 1 0 3C1 1 5 0 8 4C5 6 -5 6 -8 4Z';
const farmerHair = 'M-14 3C-16 -9 -10 -16 0 -16C10 -16 16 -9 14 3C12 -3 10 -7 6 -9C2 -6 -4 -6 -8 -9C-11 -7 -13 -3 -14 3Z';
const farmerBun = 'M-6 -19C-6 -24 6 -24 6 -19C6 -14 -6 -14 -6 -19Z';

export function villagerHead({ kind = 'baker', mood = 'happy' } = {}) {
  const m = faceMarks(mood);
  const k = {
    baker: {
      lines: [faceShape, bakerHat],
      fine: [bakerHatMarks, bakerHair, moustache],
      washes: [{ c: PAL.terracotta, o: 0.8, d: moustache }, { c: PAL.terracotta, o: 0.6, d: 'M-13 -4C-16 -2 -16 4 -13 6ZM13 -4C16 -2 16 4 13 6Z' }],
      whites: [bakerHat],
    },
    farmer: {
      lines: [faceShape, farmerHair, farmerBun],
      fine: ['M-8 -12q4 -3 8 -2M4 -14q4 1 6 4'],
      washes: [{ c: PAL.terracotta, o: 0.8, d: farmerHair + farmerBun }],
      whites: [],
    },
  }[kind];
  return {
    lines: k.lines,
    fine: [...k.fine, ...m.fine],
    washes: [{ c: PAL.rose, o: 0.25, d: faceShape }, ...m.washes, ...k.washes],
    whites: [...m.whites, ...k.whites],
    fills: m.fills,
    glints: m.glints,
  };
}

export function villager({ kind = 'baker', mood = 'happy', tilt = 0, arms = [V_ARMS.down, right(V_ARMS.down)], legs = 'stand' } = {}) {
  const head = place(villagerHead({ kind, mood }), `translate(${V_HEAD[0]} ${V_HEAD[1]}) rotate(${tilt})`);
  const armPaths = arms.map(limb);
  const hands = arms.map((a) => dot(a[a.length - 1][0], a[a.length - 1][1], 4.6)).join('');
  const dress = kind === 'farmer';
  const legPts = (dress ? D_LEGS : V_LEGS)[legs];
  const legPaths = legPts.map(limb);
  const shoes = legPts.map(bigShoe).join('');
  const top = dress ? vDress : vTorso;
  const shirt = dress ? PAL.green : PAL.sky;
  const apron = dress ? '' : 'M-12 -84L12 -84L15 -40C6 -37 -6 -37 -15 -40Z';
  return merge(
    {
      lines: [...legPaths, top, ...(apron ? [apron] : []), ...armPaths],
      fine: [
        'M-4 -106L-4 -101M4 -106L4 -101',
        shoes,
        dress ? 'M-26 -18C-10 -14 10 -14 26 -18M-6 -90C-2 -86 2 -86 6 -90' : 'M-18 -54L18 -54',
        ...(kind === 'baker' ? ['M-12 -84L-10 -100M12 -84L10 -100', 'M-6 -64L6 -64L6 -56L-6 -56'] : []),
      ],
      washes: [
        { c: dress ? PAL.rose : PAL.grey, o: dress ? 0.3 : 0.6, d: `${legPaths.join('Z')}Z` },
        { c: shirt, o: 0.72, d: `${top}Z${armPaths.join('Z')}Z` },
        { c: PAL.rose, o: 0.45, d: hands },
        { c: PAL.slate, o: 0.8, d: shoes },
      ],
      whites: kind === 'baker' ? [apron] : [],
    },
    head,
  );
}

// Things the villagers carry (held at 0,0).
/** A stick, held in the middle, pointing up at angle a (degrees from upright). */
export function stick(len = 70) {
  const d = `M0 ${f(len * 0.35)}L0 ${f(-len * 0.65)}`;
  return {
    lines: [d],
    fine: [`M0 ${f(-len * 0.3)}l-5 -6M0 ${f(len * 0.1)}l4 -5`],
    washes: [{ c: PAL.terracotta, o: 0.7, d: `M-2 ${f(len * 0.35)}L-2 ${f(-len * 0.65)}L2 ${f(-len * 0.65)}L2 ${f(len * 0.35)}Z` }],
  };
}
/** A bucket hanging from the hand by its handle. */
export function bucket() {
  const body = 'M-13 10L13 10L10 34L-10 34Z';
  return {
    lines: [body, 'M-13 10C-13 -4 13 -4 13 10'],
    fine: ['M-12 16L12 16M-11 28L11 28'],
    washes: [{ c: PAL.slate, o: 0.55, d: body }, { c: PAL.sky, o: 0.6, d: 'M-12 12L12 12L11.5 15L-11.5 15Z' }],
  };
}
/** The farmer's pitchfork, held in the middle. */
export function pitchfork() {
  return {
    lines: ['M0 50L0 -52', 'M-9 -52L9 -52M-9 -52L-9 -72M0 -52L0 -74M9 -52L9 -72'],
    washes: [{ c: PAL.ochre, o: 0.8, d: 'M-2 50L-2 -52L2 -52L2 50Z' }, { c: PAL.slate, o: 0.6, d: 'M-10 -54L10 -54L10 -50L-10 -50Z' }],
  };
}

// ---------------------------------------------------------------------------------------------
// A sheep, side view facing right (feet at 0,0, about 64 long and 46 tall): a round cloud of
// cream wool, a grey face with floppy ears, slate legs. head: 'up' or 'munch' (down at the grass).
const sheepWool = wool(-2, -27, 27, 17, 12, 1.22, 0.3);
export function sheep({ head = 'up', mood = 'happy' } = {}) {
  const legs = 'M-16 -14L-17 0M-8 -12L-8 0M8 -12L9 0M16 -14L17 0';
  const H = head === 'munch' ? 'translate(27 -14) rotate(32)' : 'translate(27 -30) rotate(-6)';
  const face = transformPath('M-6 -6C-6 -13 6 -13 6 -6L5 7C4 12 -4 12 -5 7Z', H);
  const ears = transformPath('M-5 -7C-12 -8 -15 -4 -13 -2C-10 -2 -7 -3 -5 -4ZM5 -7C12 -8 15 -4 13 -2C10 -2 7 -3 5 -4Z', H);
  const topknot = transformPath(wool(0, -10, 6, 4, 6, 1.3), H);
  const eyesFine = mood === 'content' ? transformPath('M-4.5 -2q2 -2 4 0M0.5 -2q2 -2 4 0', H) : '';
  const fills = mood === 'content' ? [] : [transformPath(dot(-2.5, -2, 1.3), H), transformPath(dot(2.5, -2, 1.3), H)];
  return {
    lines: [sheepWool, face, ears],
    fine: [legs, topknot, transformPath('M-2 7q2 1.5 4 0', H), ...(eyesFine ? [eyesFine] : []), 'M-14 -30c3 -3 6 -3 8 0M2 -36c3 -3 6 -3 8 0M-4 -22c3 -3 6 -3 8 0'],
    washes: [
      { c: PAL.grey, o: 0.85, d: face + ears },
      { c: PAL.slate, o: 0.75, d: 'M-18 -14L-15 -14L-15 0L-19 0ZM-10 -12L-6 -12L-6 0L-10 0ZM6 -12L10 -12L11 0L7 0ZM14 -14L18 -14L19 0L15 0Z' },
      { c: PAL.rose, o: 0.5, d: transformPath('M-11 -4C-10 -6 -8 -6 -7 -5ZM11 -4C10 -6 8 -6 7 -5Z', H) },
    ],
    whites: [sheepWool, topknot],
    fills,
    glints: [],
  };
}

/** A sheep's head peeping over the top of a rock (the rock's top edge at y = 0). */
export function sheepPeek({ mood = 'happy' } = {}) {
  const face = 'M-7 -14C-7 -22 7 -22 7 -14L6 -2C5 3 -5 3 -6 -2Z';
  const ears = 'M-6 -15C-14 -17 -18 -11 -16 -9C-12 -9 -8 -11 -6 -12ZM6 -15C14 -17 18 -11 16 -9C12 -9 8 -11 6 -12Z';
  const topknot = wool(0, -21, 7, 4.5, 7, 1.3);
  const back = 'M-20 0C-26 -6 -20 -14 -14 -12C-18 -8 -8 -4 -7 0ZM20 0C26 -6 20 -14 14 -12C18 -8 8 -4 7 0Z';
  return {
    lines: [face, ears],
    fine: [topknot, 'M-2 -3q2 1.5 4 0', ...(mood === 'content' ? ['M-5 -11q2 -2 4 0M1 -11q2 -2 4 0'] : []), 'M-20 0C-26 -6 -20 -14 -14 -12M20 0C26 -6 20 -14 14 -12'],
    washes: [{ c: PAL.grey, o: 0.85, d: face + ears }],
    whites: [topknot, back],
    fills: mood === 'content' ? [] : [dot(-3, -11, 1.4), dot(3, -11, 1.4)],
    glints: [],
  };
}

// ---------------------------------------------------------------------------------------------
// The wolf, creeping low on all fours and facing right (feet at 0,0, about 190 long and 80 tall):
// shaggy slate-grey fur, a pale chest, yellow eyes, a long grey nose and a big bushy tail. Sly,
// never gory: his mouth stays shut.
const wBody = 'M-52 -42C-40 -60 16 -62 38 -50C48 -44 50 -32 44 -22C28 -18 -28 -18 -48 -24C-58 -28 -60 -36 -52 -42Z';
const wHead = 'M34 -50C40 -64 62 -64 70 -54C78 -50 92 -46 98 -40C100 -35 96 -31 90 -31C80 -31 72 -29 63 -27C50 -25 36 -34 34 -50Z';
const wEars = 'M40 -58L42 -76L54 -62ZM54 -62L62 -78L66 -58Z';
const wInner = 'M44 -62L45 -71L50 -63ZM58 -63L61 -71L63 -60Z';
const wEye = 'M60 -50C62 -54 70 -54 72 -49C68 -46 63 -46 60 -50Z';
const wTail = 'M-50 -40C-64 -52 -90 -50 -106 -36C-100 -35 -102 -29 -96 -28C-92 -32 -86 -30 -82 -33C-80 -28 -72 -28 -68 -32C-64 -28 -58 -28 -50 -30Z';
const wTailTip = 'M-106 -36C-100 -35 -102 -29 -96 -28C-92 -32 -88 -31 -86 -32C-88 -38 -92 -42 -96 -43C-100 -41 -103 -39 -106 -36Z';
const wLegs = [
  [[30, -26, 11], [44, -14, 9], [56, -4, 8]],
  [[18, -24, 11], [26, -12, 9], [30, -2, 8]],
  [[-32, -26, 13], [-46, -14, 10], [-40, -3, 8]],
  [[-44, -28, 13], [-58, -16, 10], [-56, -3, 8]],
];
const wFeet = wLegs.map((p) => oval(p[2][0] + 3, p[2][1] + 1, 7, 3.4)).join('');
export function wolf() {
  const legs = wLegs.map(limb);
  return {
    lines: [wTail, legs[2], legs[1], wBody, legs[3], legs[0], wHead, wEars],
    fine: [
      wInner,
      wEye,
      'M66 -31C74 -32 82 -34 90 -34',
      'M58 -56L72 -54',
      wFeet,
      'M-30 -54l-3 -5M-16 -58l-2 -6M0 -58l-1 -6M16 -56l1 -6M-44 -30l-4 3M30 -24l2 4',
      'M-92 -38l6 2M-78 -42l5 3M-66 -44l4 3',
    ],
    washes: [
      { c: PAL.slate, o: 0.72, d: `${wBody}${wHead}${wEye}${wEars}${wTail}${legs.join('Z')}Z`, rule: 'evenodd' },
      { c: PAL.grey, o: 0.55, d: `${wTailTip}M40 -34C50 -30 60 -28 66 -29C60 -24 46 -24 40 -34Z${wFeet}` },
      { c: PAL.rose, o: 0.7, d: wInner },
      { c: PAL.ochre, o: 1, d: wEye },
    ],
    whites: [],
    fills: [dot(67, -50, 1.7), 'M94 -42C94 -46 101 -45 100 -40C99 -37 94 -38 94 -42Z'],
    glints: [dot(67.6, -50.7, 0.6)],
  };
}

// ---------------------------------------------------------------------------------------------
// Scenery
/** A grey boulder (bottom centre at 0,0, w wide, h tall). */
export function rock(w = 60, h = 34) {
  const a = w / 2;
  const d = `M${-a} 0C${f(-a - 4)} ${f(-h * 0.6)} ${f(-a * 0.5)} ${-h} ${f(-a * 0.05)} ${f(-h * 0.95)}C${f(a * 0.4)} ${f(-h * 1.05)} ${f(a + 3)} ${f(-h * 0.7)} ${a} 0Z`;
  return {
    lines: [`M${-a} 0C${f(-a - 4)} ${f(-h * 0.6)} ${f(-a * 0.5)} ${-h} ${f(-a * 0.05)} ${f(-h * 0.95)}C${f(a * 0.4)} ${f(-h * 1.05)} ${f(a + 3)} ${f(-h * 0.7)} ${a} 0`],
    fine: [`M${f(a * 0.3)} ${f(-h * 0.5)}l${f(a * 0.25)} ${f(h * 0.25)}M${f(-a * 0.5)} ${f(-h * 0.3)}l${f(a * 0.2)} 3`],
    washes: [
      { c: PAL.grey, o: 0.75, d },
      { c: PAL.slate, o: 0.45, d: `M${f(a * 0.1)} ${f(-h * 0.6)}C${f(a * 0.6)} ${f(-h * 0.5)} ${f(a * 0.9)} ${f(-h * 0.3)} ${a} 0L${f(a * 0.1)} 0Z` },
    ],
  };
}

/** A little village house far below (bottom centre at 0,0): terracotta roof, cream walls, a window. */
export function house(w = 30) {
  const a = w / 2;
  const h = w * 0.55;
  const walls = `M${-a} 0L${-a} ${f(-h)}L${a} ${f(-h)}L${a} 0`;
  const roof = `M${f(-a - 4)} ${f(-h + 1)}L0 ${f(-h - w * 0.5)}L${f(a + 4)} ${f(-h + 1)}Z`;
  return {
    lines: [walls, roof],
    fine: [`M${f(-a * 0.5)} ${f(-h * 0.7)}l${f(a * 0.4)} 0l0 ${f(h * 0.35)}l${f(-a * 0.4)} 0Z`, `M${f(a * 0.25)} 0l0 ${f(-h * 0.55)}l${f(a * 0.4)} 0l0 ${f(h * 0.55)}`],
    washes: [
      { c: PAL.terracotta, o: 0.8, d: roof },
      { c: PAL.ochre, o: 0.25, d: `${walls}Z` },
      { c: PAL.sky, o: 0.6, d: `M${f(-a * 0.5)} ${f(-h * 0.7)}l${f(a * 0.4)} 0l0 ${f(h * 0.35)}l${f(-a * 0.4)} 0Z` },
    ],
  };
}

/** Where the point (x, y) of a character lands once placed with transform t. */
export function at(t, x, y) {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}
