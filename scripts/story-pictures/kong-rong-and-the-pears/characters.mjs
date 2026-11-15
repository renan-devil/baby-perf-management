import { PAL, transformPath } from '../lib.mjs';

// Kong Rong and the Pears: the characters and props shared by the two pictures, drawn once here and
// placed in each picture with a transform (place). The build only draws files named <n>.mjs, so this
// file is not a picture. Standing characters have their feet at y = 0. Clothes are simple Han-period
// robes: a crossed collar (left panel over right, like a "y"), a sash at the waist, wide sleeves, and
// hair tied up in a topknot.

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, cheek, hand) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/** An ellipse as path data (no arcs, so it can be squashed by any transform). */
export const oval = (x, y, rx, ry) =>
  `M${f(x - rx)} ${f(y)}C${f(x - rx)} ${f(y - ry * 0.55)} ${f(x - rx * 0.55)} ${f(y - ry)} ${f(x)} ${f(y - ry)}C${f(x + rx * 0.55)} ${f(y - ry)} ${f(x + rx)} ${f(y - ry * 0.55)} ${f(x + rx)} ${f(y)}C${f(x + rx)} ${f(y + ry * 0.55)} ${f(x + rx * 0.55)} ${f(y + ry)} ${f(x)} ${f(y + ry)}C${f(x - rx * 0.55)} ${f(y + ry)} ${f(x - rx)} ${f(y + ry * 0.55)} ${f(x - rx)} ${f(y)}Z`;

/** A smooth limb (a sleeved arm) along a centreline of [x, y, width] points, open at the root. */
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
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}L${f(R[0][0])} ${f(R[0][1])}${curve(R)}`;
}

// A character: { lines: [d], fine: [d], once: [d], washes: [{c, o, d}], whites: [d], fills: [d], glints: [d] }.
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

/** A wide sleeve along pts, with a round hand at its end. */
function arm(pts, sleeve, o, hand) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const h = dot(x + ((x - px) / l) * hand * 0.9, y + ((y - py) / l) * hand * 0.9, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.5, d: h }] };
}

/** Where a hand drawn by arm() sits. */
export function handAt(pts, hand) {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  return [x + ((x - px) / l) * hand * 0.9, y + ((y - py) / l) * hand * 0.9];
}

/** Eyes, cheeks and mouth. Eyes at (±ex, ey), mouth at my. mood: 'happy', 'shut' (blissful), 'grin'. */
function face({ mood, ex, ey, my, r = 1.8, cheek = 10, look = [0, 0] }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const [lx, ly] = look;
  if (mood === 'shut') fine.push(`M${-ex - 3} ${ey}q3 -3 6 0M${ex - 3} ${ey}q3 -3 6 0`);
  else {
    fills.push(dot(-ex + lx, ey + ly, r), dot(ex + lx, ey + ly, r));
    glints.push(dot(-ex + lx - 0.5, ey + ly - 0.6, 0.55), dot(ex + lx - 0.5, ey + ly - 0.6, 0.55));
  }
  if (mood === 'grin') fills.push(`M-5.5 ${my - 1}Q0 ${my + 6} 5.5 ${my - 1}Q0 ${my + 1} -5.5 ${my - 1}Z`);
  else fine.push(`M-4.5 ${my}q4.5 4 9 0`);
  const washes = [{ c: PAL.rose, o: 0.6, d: dot(-cheek, ey + 6, 2.6) + dot(cheek, ey + 6, 2.6) }];
  return { fine, fills, glints, washes };
}

// ---------------------------------------------------------------------------------------------
// A pear (centre of its round bottom at x, y; s = size), with a little stem and a leaf.
export function pear(x, y, s = 1, { leaf = true, tilt = 0 } = {}) {
  const body = `M0 10C-12 10 -13 -4 -7 -8C-4.5 -11 -6 -17 0 -18.5C6 -17 4.5 -11 7 -8C13 -4 12 10 0 10Z`;
  const stem = 'M0 -18.5Q0.5 -22 3 -24';
  const lf = 'M2 -21.5C5 -26 11 -26 13 -23C10 -19 5 -19 2 -21.5Z';
  const t = `translate(${x} ${y}) rotate(${tilt}) scale(${s})`;
  const lines = [transformPath(body, t)];
  const fine = [transformPath(stem, t), transformPath('M-5 2q-2 -4 0 -7', t)];
  const washes = [{ c: PAL.ochre, o: 0.75, d: transformPath(body, t) }, { c: PAL.green, o: 0.3, d: transformPath('M-6 -9C-4 -12 -5 -16 0 -17.5C5 -16 4 -12 6 -9Z', t) }];
  if (leaf) {
    fine.push(transformPath(lf, t));
    washes.push({ c: PAL.green, o: 0.75, d: transformPath(lf, t) });
  }
  return { lines, fine, washes };
}

// The round basket (centre of its rim at 0,0; about 80 wide), full of pears when full is true.
const rim = oval(0, 0, 40, 8);
const bowl = 'M-40 0C-38 22 -22 32 0 32C22 32 38 22 40 0';
const weave = 'M-39 8C-20 14 20 14 39 8M-36 16C-18 22 18 22 36 16M-29 24C-14 29 14 29 29 24M-26 6L-23 28M-13 9L-12 31M0 10L0 32M13 9L12 31M26 6L23 28';
export function basket({ full = true } = {}) {
  const parts = [];
  if (full) {
    parts.push(
      pear(-22, -5, 0.95, { leaf: false, tilt: -16 }),
      pear(22, -6, 1, { leaf: false, tilt: 14 }),
      pear(0, -10, 1.2, { tilt: -3 }),
    );
  }
  const front = `${bowl}C26 6 -26 6 -40 0Z`;
  return merge(...parts, {
    lines: [bowl, full ? 'M-40 0C-30 7 30 7 40 0' : rim],
    fine: [weave],
    washes: [{ c: PAL.terracotta, o: 0.5, d: front }, { c: PAL.ochre, o: 0.45, d: front }],
  });
}

// ---------------------------------------------------------------------------------------------
// Kong Rong (feet at 0,0), about 125 tall: a little boy of four in a red robe with an ochre sash,
// black hair tied in a topknot with a red ribbon. Head centre at KR_HEAD; shoulders at (±14, -74).
export const KR_HEAD = [0, -96];
export const KR_ARMS = {
  // Cover: one hand on the table's edge, the other by his side.
  table: [
    [[-13, -75, 13], [-20, -60, 12], [-23, -46, 11]],
    [[13, -75, 13], [26, -64, 12], [38, -54, 11]],
  ],
  // Picture 2: the left hand holds the small pear up high, the right gives a big pear away.
  share: [
    [[-13, -75, 13], [-24, -92, 12], [-28, -112, 11]],
    [[13, -75, 13], [28, -64, 12], [44, -58, 11]],
  ],
};
const krFace = oval(0, 0, 16, 17);
const krHair = 'M-16.4 -1C-17.5 -14 -9 -19 0 -19C9 -19 17.5 -14 16.4 -1C14 -7 9 -9 4 -8.5C2 -9.5 0 -11 -1 -12C-3 -9 -9 -8 -16.4 -1Z';
const krBun = oval(0, -24, 7, 6.5);
const krRibbon = 'M-6 -20Q0 -17 6 -20L6 -17Q0 -14 -6 -17Z';
export function kongRongHead({ mood = 'happy', look = [0, 0] } = {}) {
  const m = face({ mood, ex: 6, ey: 1, my: 9, look });
  return {
    lines: [krFace, krHair, krBun],
    fine: ['M0.5 3c2 1.5 2 3 -0.5 3.5', 'M-16 -1c-3 1 -3 7 0 8M16 -1c3 1 3 7 0 8', 'M-3 -27q3 -2 6 0', krRibbon, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: krFace },
      { c: PAL.ink, o: 0.72, d: krHair + krBun },
      { c: PAL.red, o: 0.85, d: krRibbon },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, 'M-9 -14q4 -3 8 -3q-4 1.5 -8 3Z'],
  };
}
export function kongRong({ mood = 'happy', look = [0, 0], arms = KR_ARMS.table, tilt = 0 } = {}) {
  const robe = 'M-12 -79C-20 -77 -23 -68 -24 -52C-26 -36 -28 -22 -29 -9C-10 -6 10 -6 29 -9C28 -22 26 -36 24 -52C23 -68 20 -77 12 -79C5 -76 -5 -76 -12 -79Z';
  const collar = 'M6 -78L-14 -50.5M12 -78.5L-8 -49.5M-11 -78.5L-1 -66M-6 -78.5L1.5 -69';
  const collarBand = 'M6 -78L12 -78.5L-8 -49.5L-14 -50.5ZM-11 -78.5L-6 -78.5L1.5 -69L-1 -66Z';
  const sash = 'M-24.5 -51Q0 -46 24.5 -51L25 -43Q0 -38 -25 -43Z';
  const ties = 'M6 -42q-3 8 -5 15M10 -42q2 8 6 14';
  const shoes = 'M-15 -7C-19 -2 -16 1 -11 1L-3 1L-3 -7M15 -7C19 -2 16 1 11 1L3 1L3 -7';
  const parts = arms.map((a) => arm(a, PAL.red, 0.72, 5));
  const head = place(kongRongHead({ mood, look }), `translate(${KR_HEAD[0]} ${KR_HEAD[1]}) rotate(${tilt})`);
  return merge(
    {
      lines: [robe, shoes],
      fine: [collar, ties, 'M-26 -15Q0 -10 26 -15'],
      washes: [
        { c: PAL.red, o: 0.72, d: robe },
        { c: PAL.ochre, o: 0.8, d: sash + collarBand },
        { c: PAL.slate, o: 0.75, d: `${shoes}Z` },
      ],
    },
    ...parts,
    head,
  );
}

// ---------------------------------------------------------------------------------------------
// Father (feet at 0,0), about 215 tall: a long green robe with a terracotta sash, his hair tied up
// under a small black cap, a neat moustache and a little beard. Head centre at FA_HEAD; shoulders at
// (±20, -152). arms 'offer': the near hand held out, palm up, towards the basket.
export const FA_HEAD = [0, -182];
export const FA_ARMS = {
  offer: [
    [[-20, -152, 17], [-34, -134, 16], [-48, -122, 14], [-60, -118, 13]],
    [[20, -152, 17], [27, -128, 16], [29, -104, 15], [28, -92, 14]],
  ],
};
const faFace = oval(0, 0, 15, 18);
const faHair = 'M-15.2 -2C-16 -15 -8 -20 0 -20C8 -20 16 -15 15.2 -2C12 -9 6 -11 0 -11C-6 -11 -12 -9 -15.2 -2Z';
const faCap = 'M-7 -18L-7 -28C-7 -33 7 -33 7 -28L7 -18Z';
export function fatherHead({ look = [0, 0] } = {}) {
  const m = face({ mood: 'happy', ex: 5.5, ey: 0, my: 12.5, r: 1.6, cheek: 9.5, look });
  return {
    lines: [faFace, faHair, faCap],
    fine: [
      'M-10.5 -6q4 -2 7 -0.5M3.5 -6.5q4 -1.5 7 0.5',
      'M0.5 2c2 1.5 2 3 -0.5 3.5',
      'M-15 0c-3 1 -3 7 0 8M15 0c3 1 3 7 0 8',
      'M-12 -28.5L12 -30.5',
      'M-1 9C-3.5 8 -6.5 8.5 -8.5 11M1 9C3.5 8 6.5 8.5 8.5 11',
      'M-2.5 18Q0 24 2.5 18',
      ...m.fine,
    ],
    washes: [
      { c: PAL.rose, o: 0.3, d: faFace },
      { c: PAL.ink, o: 0.75, d: faHair + faCap },
      { c: PAL.ink, o: 0.5, d: 'M-2.5 18Q0 24 2.5 18Q0 19 -2.5 18Z' },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export function father({ look = [0, 0], arms = FA_ARMS.offer, tilt = 0 } = {}) {
  const robe = 'M-14 -164C-24 -161 -31 -148 -32 -122C-34 -84 -38 -40 -41 -8C-14 -4 14 -4 41 -8C38 -40 34 -84 32 -122C31 -148 24 -161 14 -164C6 -161 -6 -161 -14 -164Z';
  const collar = 'M6 -163L-18 -118.5M13 -163.5L-11 -116.5M-13 -163.5L-1 -148M-7 -163.5L2 -152';
  const collarBand = 'M6 -163L13 -163.5L-11 -116.5L-18 -118.5ZM-13 -163.5L-7 -163.5L2 -152L-1 -148Z';
  const sash = 'M-32 -119Q0 -113 32 -119L33 -109Q0 -103 -33 -109Z';
  const ties = 'M4 -107q-3 10 -6 22M9 -107q2 10 7 21';
  const shoes = 'M-20 -6C-25 -1 -22 2 -16 2L-5 2L-5 -6M20 -6C25 -1 22 2 16 2L5 2L5 -6';
  const parts = arms.map((a) => arm(a, PAL.green, 0.62, 5.4));
  const head = place(fatherHead({ look }), `translate(${FA_HEAD[0]} ${FA_HEAD[1]}) rotate(${tilt})`);
  return merge(
    {
      lines: [robe, shoes],
      fine: [collar, ties, 'M-39 -18Q0 -13 39 -18', 'M-14 -90q-3 30 -5 70M16 -80q2 30 4 60'],
      washes: [
        { c: PAL.green, o: 0.62, d: robe },
        { c: PAL.terracotta, o: 0.8, d: sash },
        { c: PAL.slate, o: 0.75, d: collarBand },
        { c: PAL.slate, o: 0.8, d: `${shoes}Z` },
      ],
    },
    ...parts,
    head,
  );
}

// ---------------------------------------------------------------------------------------------
// The little brother (feet at 0,0), about 82 tall: a toddler of two in a sky-blue robe, his hair in
// a little tuft on top, both hands reaching up. Head centre at LB_HEAD.
export const LB_HEAD = [0, -58];
export const LB_ARMS = {
  // Picture 2: one hand takes the big pear, the other waves with joy.
  reach: [
    [[-9, -42, 10], [-18, -50, 9], [-24, -58, 9]],
    [[9, -42, 10], [20, -52, 9], [27, -63, 9]],
  ],
};
const lbFace = oval(0, 0, 14, 14);
const lbHair = 'M-13.6 -3C-14 -12 -7 -15 0 -15C7 -15 14 -12 13.6 -3C10 -8 4 -9 0 -9C-4 -9 -10 -8 -13.6 -3Z';
const lbTufts = oval(0, -17.5, 4.6, 4);
export function brother({ arms = LB_ARMS.reach, look = [0, 0] } = {}) {
  const m = face({ mood: 'grin', ex: 5, ey: 1, my: 7, r: 1.6, cheek: 8.5, look });
  const head = {
    lines: [lbFace, lbHair, lbTufts],
    fine: ['M0.5 2.5c1.6 1.2 1.6 2.4 -0.5 2.8', 'M0 -21.5q-1 -4 2 -6M1 -21q3 -3 6 -2', 'M-14 -1c-2.6 1 -2.6 6 0 7M14 -1c2.6 1 2.6 6 0 7', ...m.fine],
    washes: [{ c: PAL.rose, o: 0.3, d: lbFace }, { c: PAL.ink, o: 0.7, d: lbHair + lbTufts }, ...m.washes],
    fills: m.fills,
    glints: m.glints,
  };
  const robe = 'M-9 -45C-15 -43 -18 -36 -19 -26C-20 -18 -21 -12 -22 -7C-8 -4 8 -4 22 -7C21 -12 20 -18 19 -26C18 -36 15 -43 9 -45C4 -43 -4 -43 -9 -45Z';
  const collar = 'M4 -43.5L-10 -26M-4 -43L0 -37';
  const shoes = 'M-11 -6C-15 -2 -13 1 -9 1L-2 1L-2 -6M11 -6C15 -2 13 1 9 1L2 1L2 -6';
  const parts = arms.map((a) => arm(a, PAL.sky, 0.65, 4.2));
  return merge(
    {
      lines: [robe, shoes],
      fine: [collar, 'M-20 -12Q0 -8 20 -12'],
      washes: [
        { c: PAL.sky, o: 0.65, d: robe },
        { c: PAL.slate, o: 0.75, d: `${shoes}Z` },
      ],
    },
    ...parts,
    place(head, `translate(${LB_HEAD[0]} ${LB_HEAD[1]})`),
  );
}
