import { PAL, transformPath } from '../lib.mjs';

// Goldilocks and the Three Bears: the characters shared by the five pictures, drawn once here and
// placed in each picture with a transform (place). The build only draws files named <n>.mjs, so this
// file is not a picture. Standing characters have their feet at y = 0.

const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
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
// Goldilocks's head (centre of the face at 0,0): a round face in a big cloud of golden curls that
// falls to her shoulders. mood: 'happy', 'peep' (looking to the right), 'yum' (eyes shut with
// delight), 'sleep' or 'surprised'.
const deg = Math.PI / 180;
const hairR = (a) => 22 + 7 * Math.max(0, Math.sin(a * deg)); // fuller curls lower down at the sides
const HAIR_FROM = 128;
const HAIR_TO = 412;
const HAIR_N = 12;
const hairPt = (a, extra = 0) => [Math.cos(a * deg) * (hairR(a) + extra), Math.sin(a * deg) * (hairR(a) + extra)];
const hairEdge = (() => {
  let d = '';
  for (let i = 0; i <= HAIR_N; i++) {
    const a = HAIR_FROM + ((HAIR_TO - HAIR_FROM) * i) / HAIR_N;
    const [x, y] = hairPt(a);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const [cx, cy] = hairPt(a - (HAIR_TO - HAIR_FROM) / HAIR_N / 2, 8);
      d += `Q${f(cx)} ${f(cy)} ${f(x)} ${f(y)}`;
    }
  }
  return d;
})();
const hairFill = `${hairEdge}Q0 30 ${f(hairPt(HAIR_FROM)[0])} ${f(hairPt(HAIR_FROM)[1])}Z`;
const face = 'M-14 0C-14 -9 -7 -14 0 -14C8 -14 14 -8 14 0C14 9 7 14 0 14C-8 14 -14 8 -14 0Z';
const fringe = 'M-13 -5Q-10 -1 -6 -6Q-3 -1 1 -7Q4 -2 7 -7Q10 -2 13 -5';
const fringeFill = `${fringe}C11 -11 6 -14 0 -14C-7 -14 -11 -10 -13 -5Z`;
const curlMarks = (() => {
  let d = '';
  for (const a of [150, 178, 205, 236, 270, 304, 335, 362, 390]) {
    const [x, y] = hairPt(a, -4);
    d += `M${f(x - 2.5)} ${f(y + 1)}c0 -4 5 -4 5 -1c0 2 -3 3 -3 1`;
  }
  return d;
})();

export function goldiHead({ mood = 'happy' } = {}) {
  const fine = [fringe, curlMarks];
  const fills = [];
  const whites = [];
  const glints = [];
  if (mood === 'sleep') {
    fine.push('M-8 1q3 2.5 6 0M2 1q3 2.5 6 0', 'M-2 8q2 1.5 4 0');
  } else if (mood === 'yum') {
    fine.push('M-8 1q3 -3.5 6 0M2 1q3 -3.5 6 0', 'M-5 6q5 5 10 0');
  } else if (mood === 'surprised') {
    whites.push(dot(-5, 0, 3.4), dot(5, 0, 3.4));
    fine.push(dot(-5, 0, 3.4), dot(5, 0, 3.4), 'M-9 -9q3 -3 6 -1M3 -10q3 -2 6 1');
    fills.push(dot(-5, 0.4, 1.6), dot(5, 0.4, 1.6), oval(0, 8, 2.6, 3.2));
  } else {
    const dx = mood === 'peep' ? 1 : 0;
    fills.push(dot(-5 + dx, 0, 1.9), dot(5 + dx, 0, 1.9));
    glints.push(dot(-5.5 + dx, -0.7, 0.6), dot(4.5 + dx, -0.7, 0.6));
    fine.push(mood === 'peep' ? 'M-2 7q3 2 6 -0.5' : 'M-5 6q5 5 10 0');
  }
  return {
    lines: [hairEdge, face],
    fine,
    washes: [
      { c: PAL.ochre, o: 0.85, d: `${hairFill}${face}`, rule: 'evenodd' },
      { c: PAL.ochre, o: 0.85, d: fringeFill },
      { c: PAL.rose, o: 0.25, d: face },
      { c: PAL.rose, o: 0.6, d: dot(-9, 5, 2.6) + dot(9, 5, 2.6) },
    ],
    whites,
    fills,
    glints,
  };
}

// Goldilocks's body (feet at 0,0): a sky-blue dress with puffed sleeves, red shoes. The head sits at
// HEAD = (0, -86), turned by tilt. arms: two limb centrelines from the shoulders (±8, -64).
export const HEAD = [0, -86];
const dress = 'M-7 -70C-13 -60 -19 -42 -24 -24C-8 -20 8 -20 24 -24C19 -42 13 -60 7 -70';
const hem = 'M-23 -27C-8 -23 8 -23 23 -27';
const sleeves = 'M-7 -70C-14 -70 -16 -62 -12 -58M7 -70C14 -70 16 -62 12 -58';
const neck = 'M-3 -73L-3 -69M3 -73L3 -69';
const legs = 'M-6 -22L-6 -4M7 -22L7 -4';
const shoes = 'M-13 0C-13 -5 -5 -6 -3 -1ZM3 -1C4 -6 12 -5 13 0Z';
export const ARMS = {
  down: [[[-9, -64, 6], [-14, -52, 5], [-17, -40, 5], [-18, -34, 5]], [[9, -64, 6], [14, -52, 5], [17, -40, 5], [18, -34, 5]]],
};

export function goldilocks({ mood = 'happy', tilt = 0, arms = ARMS.down, upper = false } = {}) {
  const head = place(goldiHead({ mood }), `translate(${HEAD[0]} ${HEAD[1]}) rotate(${tilt})`);
  const armPaths = arms.map(limb);
  const body = upper
    ? 'M-7 -70C-11 -62 -15 -50 -17 -38M7 -70C11 -62 15 -50 17 -38'
    : dress;
  const bodyFill = upper ? 'M-7 -70C-11 -62 -15 -50 -18 -36L18 -36C15 -50 11 -62 7 -70Z' : `${dress}Z`;
  return merge(
    {
      lines: [body, ...armPaths, ...(upper ? [] : [legs, shoes])],
      fine: [neck, sleeves, ...(upper ? [] : [hem])],
      washes: [
        { c: PAL.sky, o: 0.75, d: bodyFill },
        { c: PAL.rose, o: 0.35, d: `${armPaths.join('Z')}Z` },
        ...(upper ? [] : [{ c: PAL.red, o: 0.8, d: shoes }]),
      ],
    },
    head,
  );
}

// Goldilocks sitting on the floor (bottom at 0,0), legs out to the right, both arms flung up.
export function goldiSitting({ mood = 'surprised', tilt = -8 } = {}) {
  const head = place(goldiHead({ mood }), `translate(-4 -64) rotate(${tilt})`);
  const top = 'M-10 -48C-14 -36 -18 -20 -20 -4C-8 0 8 0 16 -4C14 -20 10 -36 2 -48';
  const skirt = 'M-20 -4C-14 6 12 6 26 -2C22 -10 18 -14 14 -16';
  const sitLegs = 'M22 -6L52 -8M22 3L52 2';
  const sitShoes = 'M52 -12C60 -14 64 -6 62 2C58 4 54 4 52 3Z';
  const armL = limb([[-9, -44, 6], [-20, -52, 5], [-28, -62, 5], [-32, -70, 5]]);
  const armR = limb([[2, -44, 6], [14, -52, 5], [22, -62, 5], [26, -70, 5]]);
  return merge(
    {
      lines: [top, skirt, sitLegs, sitShoes, armL, armR],
      fine: ['M-4 -51L-4 -47M1 -51L1 -47'],
      washes: [
        { c: PAL.sky, o: 0.75, d: `${top}Z${skirt}L-6 -10Z` },
        { c: PAL.rose, o: 0.35, d: `${armL}Z${armR}Z` },
        { c: PAL.rose, o: 0.25, d: 'M22 -6L52 -8L52 2L22 3Z' },
        { c: PAL.red, o: 0.8, d: sitShoes },
      ],
    },
    head,
  );
}

// ---------------------------------------------------------------------------------------------
// The little bed, side view (floor at 0,0): headboard on the left, footboard on the right, a fat
// pillow and a rose patchwork blanket. lump: the blanket rises over a sleeping child ('sleep') or lies
// flat over her legs when she sits up ('sit').
const bedFrame =
  'M-86 0L-86 -84C-86 -94 -64 -94 -64 -84L-64 0M-78 -90C-78 -98 -72 -98 -72 -90M64 0L64 -60C64 -70 84 -70 84 -60L84 0M-64 -26L64 -26M-64 -14L64 -14';
const bedFill = 'M-86 0L-86 -84C-86 -94 -64 -94 -64 -84L-64 0ZM64 0L64 -60C64 -70 84 -70 84 -60L84 0ZM-64 -26L64 -26L64 -14L-64 -14Z';
const pillow = 'M-64 -36C-66 -48 -58 -54 -44 -52C-30 -50 -24 -46 -26 -38C-30 -34 -56 -32 -64 -36Z';
export function bed({ lump = 'sleep' } = {}) {
  const blanket =
    lump === 'sleep'
      ? 'M-40 -40C-30 -54 -10 -58 10 -52C30 -46 52 -44 64 -42L64 -16C30 -12 -20 -12 -42 -18C-46 -26 -46 -34 -40 -40Z'
      : 'M-58 -34C-30 -38 10 -42 48 -46C58 -48 64 -44 64 -40L64 -16C30 -12 -20 -12 -60 -18C-64 -24 -64 -30 -58 -34Z';
  const patches =
    lump === 'sleep' ? 'M-6 -55L-4 -14M22 -48L22 -13M50 -44L50 -15M-42 -32C-10 -34 30 -32 64 -30' : 'M-24 -38L-24 -14M10 -42L10 -14M38 -45L38 -14M-60 -26C-20 -28 30 -30 64 -30';
  // when she sits up, she hides the pillow
  const pillowLines = lump === 'sleep' ? [pillow] : [];
  return {
    lines: [bedFrame, ...pillowLines, blanket],
    fine: [patches, 'M-80 -60l0 40M70 -40l0 24'],
    washes: [
      { c: PAL.ochre, o: 0.6, d: bedFill },
      { c: PAL.terracotta, o: 0.25, d: bedFill },
      ...(lump === 'sleep' ? [{ c: PAL.sky, o: 0.2, d: pillow }] : []),
      { c: PAL.rose, o: 0.7, d: blanket },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// A bear, standing and seen from the front (feet at 0,0), about 100 tall before scaling. fur: the
// brown wash; extra: Daddy's green bow tie, Mummy's rose apron, Baby's red scarf. point: Baby's
// right arm reaches out to the left (towards the bed); clasp: both paws folded in front.
const bHead = 'M-21 -78C-21 -92 -11 -98 0 -98C11 -98 21 -92 21 -78C21 -66 12 -60 0 -60C-12 -60 -21 -66 -21 -78Z';
const bEars = 'M-17 -91C-24 -94 -26 -104 -19 -108C-13 -111 -7 -106 -8 -98M17 -91C24 -94 26 -104 19 -108C13 -111 7 -106 8 -98';
const bEarFill = 'M-17 -91C-24 -94 -26 -104 -19 -108C-13 -111 -7 -106 -8 -98L-12 -92ZM17 -91C24 -94 26 -104 19 -108C13 -111 7 -106 8 -98L12 -92Z';
const bInnerEars = 'M-16 -99C-19 -103 -15 -106 -12 -102ZM16 -99C19 -103 15 -106 12 -102Z';
const bMuzzle = oval(0, -71, 9, 7);
const bBody = 'M-14 -61C-28 -56 -32 -30 -28 -12C-24 -2 24 -2 28 -12C32 -30 28 -56 14 -61';
const bBelly = 'M-14 -44C-18 -32 -16 -16 0 -12C16 -16 18 -32 14 -44C8 -50 -8 -50 -14 -44Z';
const bFeet = 'M-24 -4C-26 2 -8 3 -6 -3M24 -4C26 2 8 3 6 -3';
const bArmL = limb([[-22, -52, 11], [-30, -40, 10], [-32, -28, 9], [-31, -22, 9]]);
const bArmRDown = limb([[22, -52, 11], [30, -40, 10], [32, -28, 9], [31, -22, 9]]);
const bArmLPoint = limb([[-22, -52, 11], [-32, -58, 10], [-40, -68, 9], [-44, -78, 8]]);
const bClasp = [limb([[-22, -52, 11], [-27, -42, 10], [-20, -33, 9], [-9, -31, 9]]), limb([[22, -52, 11], [27, -42, 10], [20, -33, 9], [9, -31, 9]])];

export function bear({ fur = PAL.terracotta, o = 0.7, extra = 'none', point = false, clasp = false, mood = 'kind' } = {}) {
  const arms = clasp ? bClasp : [point ? bArmLPoint : bArmL, bArmRDown];
  const furFill = `${bHead}${bEarFill}${bBody}Z${arms.join('Z')}ZM-24 -4C-26 2 -8 3 -6 -3ZM24 -4C26 2 8 3 6 -3Z`;
  const lines = [bEars, bHead, bBody, ...arms, bFeet];
  const fine = [bMuzzle, 'M0 -71L0 -67M-4 -65Q0 -62 4 -65', 'M-8 -32l3 0M-2 -30l3 0M-6 -24l3 0'];
  const washes = [
    { c: fur, o, d: furFill },
    { c: PAL.rose, o: 0.5, d: bInnerEars },
  ];
  if (extra === 'bow') {
    const bow = 'M0 -58L-10 -63L-10 -53ZM0 -58L10 -63L10 -53Z';
    lines.push(bow);
    washes.push({ c: PAL.green, o: 0.85, d: bow });
  } else if (extra === 'apron') {
    const apron = 'M-15 -46C-17 -30 -15 -16 -12 -8C-4 -6 4 -6 12 -8C15 -16 17 -30 15 -46C8 -48 -8 -48 -15 -46Z';
    lines.push(apron, 'M-15 -46L-21 -55M15 -46L21 -55');
    washes.push({ c: PAL.rose, o: 0.65, d: apron });
    fine.push('M-12 -25C-4 -23 4 -23 12 -25');
  } else if (extra === 'scarf') {
    const scarf = 'M-14 -61C-6 -56 6 -56 14 -61L15 -55C6 -51 -6 -51 -15 -55ZM6 -54L10 -40L16 -42L12 -55Z';
    lines.push(scarf);
    washes.push({ c: PAL.red, o: 0.75, d: scarf });
  }
  const eyes = mood === 'wide' ? [dot(-8, -81, 2.6), dot(8, -81, 2.6)] : [dot(-8, -81, 2.2), dot(8, -81, 2.2)];
  return {
    lines,
    fine,
    washes,
    whites: [bMuzzle, ...(extra === 'apron' ? [] : [bBelly])],
    fills: [...eyes, oval(0, -73, 3.4, 2.4)],
    glints: [dot(-8.6, -81.8, 0.7), dot(7.4, -81.8, 0.7)],
  };
}
