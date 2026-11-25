import { PAL, hatch, parseTransform, rays, transformPath, tufts } from '../lib.mjs';

// The Three Wishes, cover: in the forest, CRACK! BOOM! Jupiter, king of the sky, appears on a big grey
// cloud with a thunderbolt in his raised hand. The poor woodcutter throws up his arms in surprise and
// his axe drops to the ground (Clonk!).
//
// This file also draws the woodcutter, Jupiter and the sausage once, for the other pictures to place
// with a transform (place). Fanchon, the woodcutter's wife, is drawn in 3.mjs.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so any transform can squash it). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (arm, leg, sausage) along a centreline of [x, y, width] points, open at the root. */
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

/** A limb rounded at both ends (the sausage): the limb, then back along it with a round cap. */
export function roll(pts) {
  const [sx, sy, sw] = pts[0];
  const [nx, ny] = pts[1];
  const k = (sw * 0.66) / Math.hypot(nx - sx, ny - sy);
  const d = limb(pts);
  // the limb ends back at the root's other side; close it with a round cap to where it started
  const [, x0, y0] = d.match(/^M(-?[\d.]+) (-?[\d.]+)/);
  const [, x1, y1] = d.match(/(-?[\d.]+) (-?[\d.]+)$/);
  return `${d}C${f(+x1 - (nx - sx) * k)} ${f(+y1 - (ny - sy) * k)} ${f(+x0 - (nx - sx) * k)} ${f(+y0 - (ny - sy) * k)} ${x0} ${y0}Z`;
}

// A part: { lines, fine, once, washes: [{c, o, d, rule?}], whites, fills, glints }, each a list.
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

/** Joins the scene's own shapes and the placed parts into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = [], lines = [], fine = [], once = [], fills = [], glints = [], parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k] ?? []);
  const tags = (list) => list.filter(Boolean).map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [...whites, ...all('whites')].filter(Boolean).join(''),
    lines: tags([...lines, ...all('lines')]),
    fine: tags([...fine, ...all('fine')]),
    once: tags([...once, ...all('once')]),
    fills: tags([...fills, ...all('fills')]),
    glints: tags([...glints, ...all('glints')]),
  };
}

/** Where the point (x, y) of a part ends up once placed with the transform t. */
export function at(t, x, y) {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** An arm along pts with a round hand at its end. */
export function arm(pts, sleeve, o = 0.6, hand = 4.2) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.55, d: h }] };
}

// ---------------------------------------------------------------------------------------------
// The woodcutter (feet at 0,0, about 140 tall, facing us): a red stocking cap that flops to one side
// with a bobble, a bushy brown beard, a green tunic with a belt, slate trousers and grey boots.
// arms: two arm centrelines (from the shoulders at ±16, -84). legs: 'stand' or two leg centrelines
// (from the hips at ±7, -38) for running, or false (only down to his tunic's hem). mood: 'wow', 'happy', 'laugh', 'cross'. look: pupils [dx, dy].
export const W_CAP = 'M-15 -115C-13 -131 0 -140 13 -137C24 -134 31 -124 33 -112C31 -110 28 -111 27 -114C23 -122 18 -124 14 -118';
export const W_BAND = 'M-16 -116C-8 -121 8 -121 16 -116L16 -111C8 -115 -8 -115 -16 -111Z';
export const W_FACE = 'M-13 -112C-14.5 -107 -14 -103 -12.5 -100M13 -112C14.5 -107 14 -103 12.5 -100';
export const W_BEARD = 'M-13.5 -106C-18 -94 -12 -80 0 -77C12 -80 18 -94 13.5 -106C9 -99 -9 -99 -13.5 -106Z';
export const W_TUNIC = 'M-16 -86C-20 -70 -22 -54 -24 -36L24 -36C22 -54 20 -70 16 -86C10 -89 -10 -89 -16 -86Z';
export const W_TROUSERS = 'M-18 -36L-16 -6L-3 -6L-1 -28L1 -28L3 -6L16 -6L18 -36';
export const W_BOOTS = 'M-16 -6L-18 0C-13 2 -4 2 -2 0L-3 -6ZM16 -6L18 0C13 2 4 2 2 0L3 -6Z';
export const W_ARMS = {
  down: [
    [[-16, -84, 9], [-22, -66, 8], [-24, -50, 8]],
    [[16, -84, 9], [22, -66, 8], [24, -50, 8]],
  ],
  // both arms flung up in surprise
  up: [
    [[-16, -84, 9], [-32, -100, 8], [-40, -124, 7]],
    [[16, -84, 9], [32, -100, 8], [40, -124, 7]],
  ],
};
export const W_LEGS = {
  // running to the right: left leg kicked back, right leg stepping forward
  run: [
    [[-7, -38, 14], [-18, -22, 12], [-32, -12, 11]],
    [[7, -38, 14], [18, -24, 12], [20, -6, 11]],
  ],
};
export function woodcutter({ mood = 'happy', arms = W_ARMS.down, legs = 'stand', look = [0, 0], tilt = 0 } = {}) {
  const lines = [W_TUNIC, W_BAND, W_CAP, W_FACE, W_BEARD];
  const fine = [
    dot(33, -110, 3.2), // bobble
    'M-24 -45C-8 -42 8 -42 24 -45', // belt
    'M-4 -46l8 0l0 6l-8 0Z',
    'M-3 -86L0 -80L3 -86', // collar
    'M-8 -100C-5 -103 -2 -102 0 -100C2 -102 5 -103 8 -100', // moustache
    'M-1 -109c-2 3 -1 5 2 5', // nose
    'M-6 -92l1 5M0 -89l0 6M6 -92l-1 5', // beard strands
    'M-12 -66l6 4M10 -70l6 3M-6 -56l5 3', // tunic folds
  ];
  const washes = [
    { c: PAL.red, o: 0.72, d: `${W_CAP}C8 -122 -8 -122 -15 -115Z${dot(33, -110, 3.2)}` },
    { c: PAL.red, o: 0.45, d: W_BAND },
    { c: PAL.rose, o: 0.32, d: 'M-13 -114C-15 -108 -14 -103 -13 -100C-8 -98 8 -98 13 -100C14 -103 15 -108 13 -114Z' },
    { c: PAL.rose, o: 0.65, d: dot(0.5, -105, 2.6) },
    { c: PAL.terracotta, o: 0.75, d: W_BEARD },
    { c: PAL.green, o: 0.72, d: W_TUNIC },
    { c: PAL.ochre, o: 0.7, d: 'M-24 -45C-8 -42 8 -42 24 -45L24 -41C8 -38 -8 -38 -24 -41Z' },
  ];
  const fills = [];
  const glints = [];
  const [lx, ly] = look;
  const eyes = (r) => {
    fills.push(dot(-5 + lx, -110 + ly, r), dot(5 + lx, -110 + ly, r));
    glints.push(dot(-5.5 + lx, -110.7 + ly, 0.55), dot(4.5 + lx, -110.7 + ly, 0.55));
  };
  if (mood === 'wow') {
    eyes(2.2);
    fine.push('M-9 -116q4 -3 7 -1M9 -116q-4 -3 -7 -1');
    fills.push(oval(0, -94, 3, 4));
  } else if (mood === 'laugh') {
    fine.push('M-8 -110q3 -3.5 6 0M2 -110q3 -3.5 6 0', 'M-9 -114l5 -1M9 -114l-5 -1');
    fills.push('M-6 -97C-4 -92 4 -92 6 -97C2 -96 -2 -96 -6 -97Z');
    washes.push({ c: PAL.rose, o: 0.6, d: dot(-9, -104, 2.4) + dot(9, -104, 2.4) });
  } else if (mood === 'cross') {
    eyes(1.8);
    fine.push('M-9 -115l6 2M9 -115l-6 2', 'M-4 -95q4 -2.5 8 0');
  } else {
    eyes(1.8);
    fine.push('M-4 -96q4 3 8 0');
  }
  const low = { lines: [], fine: [], washes: [] };
  if (legs === 'stand') {
    low.lines.push(W_TROUSERS, W_BOOTS);
    low.washes.push({ c: PAL.slate, o: 0.55, d: `${W_TROUSERS}Z` }, { c: PAL.slate, o: 0.85, d: W_BOOTS });
  } else if (legs) {
    for (const pts of legs) {
      const d = limb(pts);
      const [x, y] = pts[pts.length - 1];
      const [px, py] = pts[pts.length - 2];
      const a = (Math.atan2(y - py, x - px) * 180) / Math.PI;
      // a boot: a little foot pointing forward (right), turned with the leg
      const boot = transformPath(`M-6 -5C-6 -8 4 -8 6 -5C12 -4 14 0 12 3C4 4 -4 4 -7 3C-8 0 -7 -3 -6 -5Z`, `translate(${x} ${y}) rotate(${f((a - 90) * 0.6)})`);
      low.lines.push(d, boot);
      low.washes.push({ c: PAL.slate, o: 0.55, d: `${d}Z` }, { c: PAL.slate, o: 0.85, d: boot });
    }
  }
  const all = merge(low, { lines, fine, washes, fills, glints }, arm(arms[0], PAL.green, 0.62), arm(arms[1], PAL.green, 0.62));
  return tilt ? place(all, `rotate(${tilt})`) : all;
}

// The axe: handle along y from 0 (end of the handle) to -46, blade at the top pointing to +x.
export const AXE_HANDLE = 'M-2 0L-2 -46L2 -46L2 0Z';
export const AXE_HEAD = 'M-3 -48L6 -50C10 -54 14 -56 16 -56C17 -48 17 -40 16 -32C14 -32 10 -34 6 -38L-3 -40Z';
export const axe = () => ({
  lines: [AXE_HEAD, AXE_HANDLE],
  washes: [
    { c: PAL.ochre, o: 0.75, d: AXE_HANDLE },
    { c: PAL.slate, o: 0.6, d: AXE_HEAD },
  ],
  glints: ['M12 -52L14 -52L14 -36L12 -37Z'],
});

// ---------------------------------------------------------------------------------------------
// Jupiter, king of the sky (cloud centre at 0,0): a big grey cloud, and above it his slate robe, a
// long white beard, a golden crown and a zigzag thunderbolt held up in his right hand (on our right).
const J_CLOUD =
  'M-74 12C-90 10 -92 -10 -74 -14C-78 -32 -54 -40 -42 -28C-36 -44 -10 -46 -2 -32C8 -46 34 -42 38 -26C52 -36 76 -26 70 -10C88 -8 88 14 70 16C40 24 -40 24 -74 12Z';
const J_ROBE = 'M-22 -32C-24 -46 -24 -58 -18 -66C-10 -70 10 -70 18 -66C24 -58 24 -46 22 -32';
const J_HEAD = 'M-13 -84C-13 -94 -7 -98 0 -98C7 -98 13 -94 13 -84';
const J_HAIR = 'M-13 -86C-20 -86 -22 -78 -18 -72C-22 -66 -16 -60 -12 -64M13 -86C20 -86 22 -78 18 -72C22 -66 16 -60 12 -64';
const J_BEARD = 'M-13 -82C-18 -68 -14 -46 -6 -34C-3 -38 0 -36 0 -32C2 -36 4 -38 7 -34C14 -46 18 -68 13 -82C8 -76 -8 -76 -13 -82Z';
const J_CROWN = 'M-12 -95L-14 -110L-6 -102L0 -114L6 -102L14 -110L12 -95C6 -97 -6 -97 -12 -95Z';
export const BOLT = 'M0 0L8 -10L3 -11L12 -24L4 -23L10 -36L-4 -20L2 -19L-7 -8L-1 -7Z';
export const J_ARMS = [
  // his left arm (on our left) held out towards the woodcutter, open hand
  [[-17, -64, 10], [-32, -54, 9], [-48, -52, 8]],
  // his right arm raised high with the thunderbolt
  [[17, -64, 10], [30, -78, 9], [34, -98, 8]],
];
export function jupiter({ look = [-1.6, 1] } = {}) {
  const [lx, ly] = look;
  const boltT = 'translate(32 -100) rotate(15) scale(1.15)';
  const bolt = transformPath(BOLT, boltT);
  const beardStrands = 'M-6 -66l1 10M0 -64l0 14M6 -66l-1 10M-8 -52l2 8M7 -52l-2 8';
  const armL = limb(J_ARMS[0]);
  const armR = limb(J_ARMS[1]);
  const [hx, hy] = J_ARMS[0][2];
  const [rx, ry] = J_ARMS[1][2];
  return {
    lines: [J_ROBE, armL, armR, J_HEAD, J_HAIR, J_BEARD, J_CROWN, dot(hx, hy, 4.6), J_CLOUD, bolt],
    fine: [
      dot(rx, ry, 4.6),
      beardStrands,
      'M-8 -78C-5 -81 -2 -80 0 -78C2 -80 5 -81 8 -78', // moustache
      'M-1 -86c-2 3 -1 5 2 5',
      'M-10 -92l6 -1.5M10 -92l-6 -1.5', // bushy brows
      'M-56 -4q8 -6 16 0M14 -2q8 -6 16 0M-20 8q10 -5 20 0', // cloud curls
      rays(37, -114, 18, 30, 9, 11, 0),
    ],
    washes: [
      { c: PAL.slate, o: 0.6, d: `${J_ROBE}Z${armL}Z${armR}Z` },
      { c: PAL.rose, o: 0.35, d: `${J_HEAD}L13 -80L-13 -80Z` },
      { c: PAL.rose, o: 0.55, d: dot(hx, hy, 4.6) + dot(rx, ry, 4.6) + dot(0.5, -82, 2.4) },
      { c: PAL.ochre, o: 0.9, d: J_CROWN },
      { c: PAL.red, o: 0.8, d: dot(0, -100, 1.8) },
      { c: PAL.grey, o: 0.62, d: J_CLOUD },
      { c: PAL.sky, o: 0.22, d: 'M-60 6C-30 14 30 14 60 8C40 20 -40 20 -60 6Z' },
      { c: PAL.ochre, o: 0.42, d: dot(37, -114, 24) },
      { c: PAL.ochre, o: 0.95, d: bolt },
    ],
    whites: [J_BEARD, `${J_HAIR.split('M13')[0]}Z`, `M13${J_HAIR.split('M13')[1]}Z`],
    fills: [dot(-5 + lx, -88 + ly, 1.8), dot(5 + lx, -88 + ly, 1.8)],
    glints: [dot(-5.5 + lx, -88.7 + ly, 0.5), dot(4.5 + lx, -88.7 + ly, 0.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// The sausage: one long, fat, terracotta sausage along a centreline (rounded at both ends, tied with a
// little string at its last end, unless tie is false). Its default shape is a gentle curve 120 long, centred on (0,0).
export const SAUSAGE_PTS = [
  [-60, 4, 20],
  [-30, -4, 22],
  [0, -6, 22],
  [30, -4, 22],
  [60, 4, 20],
];
export function sausage(pts = SAUSAGE_PTS, { tie = true } = {}) {
  const d = roll(pts);
  const [ex, ey] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(ex - px, ey - py);
  const [ux, uy] = [(ex - px) / l, (ey - py) / l];
  const w = pts[pts.length - 1][2];
  const tx = ex + ux * w * 0.62;
  const ty = ey + uy * w * 0.62;
  const string = `M${f(tx)} ${f(ty)}c${f(ux * 4 - uy * 2)} ${f(uy * 4 + ux * 2)} ${f(ux * 8 + uy * 2)} ${f(uy * 8 - ux * 2)} ${f(ux * 10 + uy * 5)} ${f(uy * 10 - ux * 5)}`;
  // a shine along the top
  const n = pts.length;
  let shine = pts.map(([x, y, ww], i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [x + ((b[1] - a[1]) * ww * 0.28) / L, y - ((b[0] - a[0]) * ww * 0.28) / L, ww];
  });
  // a shine along the top, stopping short of both ends
  const toward = (p, q, t) => p.map((v, k) => v + (q[k] - v) * t);
  shine = [toward(shine[0], shine[1], 0.5), ...shine.slice(1, -1), toward(shine[n - 1], shine[n - 2], 0.5)];
  return {
    lines: [d],
    fine: tie ? [string] : [],
    washes: [
      { c: PAL.terracotta, o: 0.88, d },
      { c: PAL.red, o: 0.3, d },
    ],
    glints: [limb(shine.map(([x, y, w]) => [x, y, Math.max(1.4, w * 0.12)]))],
  };
}

// ---------------------------------------------------------------------------------------------
// The cover scene
export const ground = 'M0 252C70 249 140 254 210 251C280 248 340 253 400 250';
// A forest tree (trunk foot at 44,252), to place with a transform.
const trunk = 'M30 252C36 222 34 180 40 140M58 252C52 222 54 182 52 140M30 252C38 256 50 256 58 252';
const crown =
  'M2 136C-14 118 -2 86 20 84C22 58 56 46 74 62C96 54 116 76 104 98C118 112 106 140 84 138C70 150 44 148 34 140C20 148 4 146 2 136Z';
const bark = 'M40 200c3 6 3 12 0 18M48 170c-3 6-3 12 0 16M44 230c2 4 2 8 0 12';
export const tree = () => ({
  lines: [trunk, crown],
  fine: [bark, hatch(14, 102, 44, 124, 5, 8, 125, 12), 'M30 80c3 -5 8 -5 10 0M70 70c3 -5 8 -5 10 0'],
  washes: [
    { c: PAL.green, o: 0.66, d: crown },
    { c: PAL.green, o: 0.3, d: 'M30 120C40 106 66 102 82 110C94 118 88 130 74 132C60 134 40 132 30 120Z' },
    { c: PAL.ochre, o: 0.55, d: 'M32 250C38 222 36 182 41 142L52 142C53 184 52 222 56 250Z' },
  ],
});
const W = 'translate(132 252) scale(1.1)';
const AX = 'translate(190 208) rotate(122) scale(1.15)';
const J = 'translate(298 156) scale(1.02)';
const clonk = rays(236, 252, 9, 17, 6, 4, -165).split('M').slice(0, 4).join('M');

export default compose({
  title: 'Jupiter appears to the woodcutter',
  seed: 71,
  washes: [
    { c: PAL.green, o: 0.36, d: `${ground}L400 300L0 300Z` },
  ],
  lines: [ground],
  fine: [
    hatch(10, 272, 120, 272, 9, 6, 160, 6),
    hatch(230, 274, 390, 270, 10, 6, 160, 7),
    tufts([[90, 252], [300, 251], [372, 250], [236, 252]], 9, 9),
    clonk,
    // motion of the falling axe
    'M178 150q14 8 18 26M168 158q12 10 14 26',
  ],
  parts: [
    tree(),
    place(woodcutter({ mood: 'wow', arms: W_ARMS.up, look: [1.6, -1.2] }), W),
    place(axe(), AX),
    place(jupiter(), J),
  ],
});
