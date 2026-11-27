import { PAL, rng, transformPath } from '../lib.mjs';

// The Mitten: the red mitten and everybody who comes to live in it, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. A character is { lines, fine, washes: [{c, o, d}], whites, fills, glints }, all lists
// of path data in the character's own coordinates. Everybody faces right, feet at y = 0, unless said.

export const f = (n) => Math.round(n * 10) / 10;
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

/** An oval drawn with curves (so it survives any transform, even a stretch). */
export function oval(cx, cy, rx, ry = rx) {
  const k = 0.5523;
  return (
    `M${f(cx + rx)} ${f(cy)}C${f(cx + rx)} ${f(cy + ry * k)} ${f(cx + rx * k)} ${f(cy + ry)} ${f(cx)} ${f(cy + ry)}` +
    `C${f(cx - rx * k)} ${f(cy + ry)} ${f(cx - rx)} ${f(cy + ry * k)} ${f(cx - rx)} ${f(cy)}` +
    `C${f(cx - rx)} ${f(cy - ry * k)} ${f(cx - rx * k)} ${f(cy - ry)} ${f(cx)} ${f(cy - ry)}` +
    `C${f(cx + rx * k)} ${f(cy - ry)} ${f(cx + rx)} ${f(cy - ry * k)} ${f(cx + rx)} ${f(cy)}Z`
  );
}
export const dot = (x, y, r) => oval(x, y, r, r);

/** A smooth closed shape through the points (Catmull-Rom). */
export function closed(P) {
  const n = P.length;
  let d = `M${pt(P[0])}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [P[(i - 1 + n) % n], P[i], P[(i + 1) % n], P[(i + 2) % n]];
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return `${d}Z`;
}

/** A smooth open line through the points. */
export function open(P) {
  const n = P.length;
  let d = `M${pt(P[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const [p0, p1, p2, p3] = [P[Math.max(0, i - 1)], P[i], P[i + 1], P[Math.min(n - 1, i + 2)]];
    d += `C${pt([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${pt([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${pt(p2)}`;
  }
  return d;
}

/** A limb (leg, arm, tail) along [x, y, width] points, closed with a round end. */
export function limb(pts) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  // (drawn clockwise, like the bodies, so a wash of body and limbs together fills without gaps)
  const L = side(-1);
  const R = side(1);
  const [ex, ey, ew] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const l = Math.hypot(ex - px, ey - py);
  const tip = [ex + ((ex - px) / l) * ew * 0.5, ey + ((ey - py) / l) * ew * 0.5];
  return open([...L, tip, ...R.reverse()]);
}
/** limb() as a closed shape, for washes. */
export const limbFill = (pts) => `${limb(pts)}Z`;

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

/** Joins placed characters with the scene's own shapes into the drawing that svg() takes. */
export function compose({ title, seed, washes = [], after = [], whites = '', lines = [], fine = [], once = '', parts = [] }) {
  const all = (k) => parts.flatMap((p) => p[k] ?? []);
  const tags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: [...washes, ...all('washes'), ...after],
    whites: [whites, ...all('whites')].filter(Boolean).join(''),
    lines: tags([...lines, ...all('lines')]),
    fine: tags([...fine, ...all('fine')]),
    once: once ? tags([once]) : '',
    fills: tags(all('fills')),
    glints: tags(all('glints')),
  };
}

const eye = (x, y, r = 1.6) => ({ fills: [dot(x, y, r)], glints: [dot(x - r * 0.35, y - r * 0.35, r * 0.32)] });
const merge = (...cs) => {
  const out = { lines: [], fine: [], washes: [], whites: [], fills: [], glints: [] };
  for (const c of cs) for (const k of Object.keys(out)) out[k].push(...(c[k] ?? []));
  return out;
};

// ---------------------------------------------------------------------------------------------
// The red mitten, lying on its side: the fingers to the left, the thumb sticking up, the knitted rib
// cuff on the right with its opening facing right. Origin (0,0) under the middle of the mitten.
//   fat:   0 (an ordinary mitten) … 1 (stretched round as a drum)
//   creak: little strain marks round the edge
// mittenInfo(fat) tells where the opening is, so heads can peek out of it.
export function mittenInfo(fat = 0) {
  const H = 46 + 64 * fat; // body height
  const W = 54 + 18 * fat; // body reaches left to -W
  const cy = -H / 2;
  const ch = 20 + 5 * fat; // half height of the cuff
  const cx0 = 26 + 4 * fat;
  const cx1 = cx0 + 20 + 3 * fat;
  return { H, W, cy, ch, cx0, cx1, top: [-6 - 6 * fat, -H] };
}

export function mitten({ fat = 0, creak = false, seed = 5 } = {}) {
  const { H, W, cy, ch, cx0, cx1 } = mittenInfo(fat);
  const r = rng(seed);
  const ex = (34 - W) / 2; // body ellipse centre
  const rx = (34 + W) / 2 + 4 * fat;
  const ry = H / 2;
  const at = (deg, k = 1) => {
    const a = (deg * Math.PI) / 180;
    return [ex + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  };
  const lump = () => 1 + (r() - 0.5) * 0.06 * fat;
  const pts = [];
  // from the top of the cuff, round over the top (with the thumb), the fingers and the bottom
  const start = -(Math.asin(Math.min(0.95, ch / ry)) * 180) / Math.PI - 4;
  const thumbA = -66 - 6 * fat;
  let thumb = false;
  for (let deg = start; deg >= -360 - start; deg -= 16) {
    if (deg < thumbA + 8 && deg > thumbA - 28) {
      if (!thumb) {
        // the thumb, sticking up and leaning towards the fingers
        const [bx, by] = at(thumbA + 6);
        const [cx, cy2] = at(thumbA - 24);
        const s = 1 + 0.25 * fat;
        pts.push([bx, by], [bx - 1 * s, by - 12 * s], [bx - 7 * s, by - 20 * s], [bx - 15 * s, by - 19 * s], [cx + 1, cy2 - 7 * s], [cx, cy2]);
        thumb = true;
      }
      continue;
    }
    pts.push(at(deg, lump()));
  }
  // close against the cuff (the inner edge is hidden behind it)
  pts.push([cx0 + 2, cy + ch - 2], [cx0 + 2, cy - ch + 2]);
  const body = closed(pts);
  const cuff = `M${f(cx0)} ${f(cy - ch)}L${f(cx1)} ${f(cy - ch - 3)}L${f(cx1)} ${f(cy + ch + 3)}L${f(cx0)} ${f(cy + ch)}Z`;
  const hole = oval(cx1, cy, 6 + fat, ch + 2);
  const ribs = [0.25, 0.5, 0.75].map((t) => {
    const x = cx0 + (cx1 - cx0) * t;
    const h = ch + 3 * t - 2;
    return `M${f(x)} ${f(cy - h)}L${f(x)} ${f(cy + h)}`;
  });
  // knitted stitches: little rows of v's across the back of the hand
  const stitches = [];
  for (const [row, n, y] of [[0, 4, -0.28], [1, 5, 0.05], [2, 4, 0.36]]) {
    for (let i = 0; i < n; i++) {
      const x = ex - rx * 0.62 + (i + (row % 2) * 0.5) * rx * 0.3;
      const yy = cy + y * ry * 1.1;
      stitches.push(`M${f(x - 2.4)} ${f(yy - 2)}l2.4 3l2.4 -3`);
    }
  }
  const strain = creak
    ? [
        `M${f(at(-140)[0] - 6)} ${f(at(-140)[1] - 6)}l-5 -4M${f(at(-150)[0] - 8)} ${f(at(-150)[1] - 1)}l-7 -1`,
        `M${f(at(-200)[0] - 8)} ${f(at(-200)[1])}l-7 2M${f(at(-212)[0] - 6)} ${f(at(-212)[1] + 4)}l-6 4`,
        `M${f(at(-40)[0] + 4)} ${f(at(-40)[1] - 6)}l4 -6M${f(at(-30)[0] + 7)} ${f(at(-30)[1] - 4)}l6 -3`,
      ]
    : [];
  return {
    lines: [body, cuff, hole],
    fine: [...ribs, ...stitches, ...strain],
    washes: [
      { c: PAL.red, o: 0.78, d: body },
      { c: PAL.red, o: 0.88, d: cuff },
      { c: PAL.ink, o: 0.55, d: hole },
    ],
  };
}

/** The small red mitten (worn, or the lost one falling), upright, about 33 tall, origin under the cuff. */
export function littleMitten({ plain = false } = {}) {
  const m = closed([[-8, -7], [-10, -17], [-8, -27], [-2, -32], [5, -30], [8, -23], [9, -18], [13, -22], [17, -21], [16, -15], [10, -9], [8, -7]]);
  const cuff = 'M-9 -7L9 -7L10 1L-10 1Z';
  return {
    lines: [m, cuff],
    fine: plain ? [] : ['M-5 -6l0 6M-1 -6l0 6M3 -6l0 6M7 -6l0 6', 'M-4 -20l2 2.4l2 -2.4M1 -16l2 2.4l2 -2.4M-5 -13l2 2.4l2 -2.4'],
    washes: [{ c: PAL.red, o: 0.8, d: m }, { c: PAL.red, o: 0.9, d: cuff }],
  };
}

// ---------------------------------------------------------------------------------------------
// Grandfather, walking, about 150 tall: a grey fur hat with ear flaps, a big white beard, a rosy
// nose, a slate coat, felt boots. His near arm swings back with the bare hand (the mitten has just
// slipped off it); the far hand still wears its red mitten.
export function grandfather() {
  const hat = closed([[-14, -129], [-14, -142], [-5, -151], [8, -151], [18, -143], [19, -133], [10, -135], [-1, -136], [-8, -134]]);
  const flap = closed([[-13, -131], [-4, -132], [-3, -120], [-8, -116], [-13, -121]]);
  const face = open([[18, -133], [20, -127], [21, -122]]);
  const nose = closed([[19, -127], [23, -126], [26, -122], [24, -118], [19, -119]]);
  const beard = closed([[-3, -124], [5, -119], [13, -119], [20, -118], [26, -116], [27, -108], [24, -98], [18, -88], [12, -82], [8, -92], [3, -102], [-1, -112]]);
  const tash = 'M12 -117C16 -113 22 -113 27 -117';
  const coat = closed([[-9, -116], [5, -112], [13, -106], [16, -90], [20, -62], [25, -42], [6, -37], [-16, -37], [-25, -42], [-21, -70], [-17, -100]]);
  const belt = 'M-20 -76C-8 -73 6 -73 18 -76';
  const legB = [[-8, -40, 12], [-15, -20, 11], [-22, -4, 11]];
  const legF = [[8, -40, 12], [15, -20, 11], [21, -4, 11]];
  const bootB = closed([[-29, -6], [-16, -6], [-13, 0], [-30, 1]]);
  const bootF = closed([[15, -6], [26, -6], [31, 0], [14, 1]]);
  const armB = [[-6, -106, 10], [-18, -92, 9], [-30, -82, 8]];
  const armF = [[10, -106, 9], [22, -92, 8], [31, -80, 8]];
  const hand = dot(-33, -79, 4.6);
  const glove = place(littleMitten({ plain: true }), 'translate(33 -79) rotate(-150) scale(0.42)');
  const head = place(
    {
      lines: [hat, flap, face, beard],
      fine: [tash, nose, 'M9 -131q4 -3 8 0', 'M8 -110c2 4 2 8 0 12M15 -108c2 4 1 9 -2 12M21 -106c1 4 0 7 -2 10', 'M-6 -145l3 -3M2 -147l3 -3M9 -144l3 -3'],
      washes: [
        { c: PAL.grey, o: 0.55, d: `${hat}${flap}` },
        { c: PAL.rose, o: 0.5, d: 'M-3 -134C6 -136 18 -135 19 -131C21 -126 21 -121 16 -119L0 -122Z' },
        { c: PAL.rose, o: 0.8, d: nose },
      ],
      whites: [beard],
      ...eye(13, -127, 1.6),
    },
    'translate(4 -112) scale(1.3) translate(-4 112)',
  );
  return merge(
    {
      lines: [limb(legB), limb(legF), bootB, bootF, coat, limb(armB), limb(armF)],
      fine: [belt, 'M-22 -44l4 -3M-14 -41l4 -3M-4 -40l4 -3M8 -40l4 -3M18 -42l4 -3', hand],
      washes: [
        { c: PAL.slate, o: 0.55, d: `${coat}${limbFill(armB)}${limbFill(armF)}` },
        { c: PAL.grey, o: 0.7, d: `${limbFill(legB)}${limbFill(legF)}${bootB}${bootF}` },
        { c: PAL.rose, o: 0.5, d: hand },
      ],
    },
    head,
    glove,
  );
}

// ---------------------------------------------------------------------------------------------
// Grandfather's little dog: a scruffy ochre terrier with one terracotta ear, about 34 long.
//   run: legs stretched out at a gallop instead of trotting
export function dog({ run = false } = {}) {
  const body = closed([[-14, -13], [-9, -21], [2, -22], [12, -21], [16, -15], [11, -9], [0, -9], [-10, -9]]);
  const head = closed([[11, -21], [13, -29], [21, -32], [28, -28], [34, -24], [31, -19], [22, -17], [14, -16]]);
  const ear = closed([[15, -29], [19, -33], [22, -25], [18, -21]]);
  const tail = open([[-13, -17], [-19, -24], [-18, -31]]);
  const legs = run
    ? [[[-10, -11, 5], [-17, -6, 4.5], [-24, -4, 4]], [[-5, -11, 5], [-11, -5, 4.5], [-16, -1, 4]], [[8, -11, 5], [16, -7, 4.5], [24, -7, 4]], [[12, -12, 5], [20, -9, 4.5], [28, -11, 4]]]
    : [[[-10, -11, 5], [-12, -5, 4.5], [-13, 0, 4]], [[-5, -11, 5], [-3, -5, 4.5], [-1, 0, 4]], [[7, -11, 5], [6, -5, 4.5], [4, 0, 4]], [[11, -11, 5], [14, -6, 4.5], [16, -1, 4]]];
  const legD = legs.map(limb);
  return {
    lines: [...legD, body, head, tail],
    fine: [ear, 'M26 -20q3 2 6 0', 'M-4 -21l2 -3M2 -22l2 -3M8 -21l2 -3'],
    washes: [
      { c: PAL.ochre, o: 0.62, d: `${body}${head}${legD.join('Z')}Z` },
      { c: PAL.terracotta, o: 0.75, d: ear },
    ],
    fills: [dot(34, -24, 1.8), dot(24.5, -26.5, 1.4)],
    glints: [dot(24, -27, 0.45)],
  };
}

// ---------------------------------------------------------------------------------------------
// Squeaky Mouse, grey with big round rose ears. mouseHead() is just her head and front paws (for
// peeking out of the mitten), origin under her chin; mouse() is all of her, about 34 long.
export function mouseHead() {
  const head = closed([[-6, 0], [-8, -7], [-4, -13], [4, -13], [9, -10], [16, -6], [18, -4], [11, -1], [3, 1]]);
  const earB = dot(-3, -15, 4.2);
  const earF = dot(5, -15.5, 4.8);
  const paws = `${dot(5, 1.5, 2.4)}${dot(11, 0.5, 2.2)}`;
  return {
    lines: [earB, head, earF],
    fine: [paws, 'M15 -5l8 -3M15 -4l8 1M14 -3.5l7 4'],
    washes: [
      { c: PAL.grey, o: 0.62, d: `${head}${earB}${earF}${paws}` },
      { c: PAL.rose, o: 0.75, d: `${dot(-3, -15, 2.4)}${dot(5, -15.5, 2.8)}` },
    ],
    fills: [dot(18, -4.5, 1.3), dot(9.5, -8.5, 1.4)],
    glints: [dot(9, -9, 0.45)],
  };
}
export function mouse() {
  const body = closed([[-14, -3], [-15, -9], [-8, -15], [2, -15], [9, -12], [17, -6], [19, -4], [12, -1], [2, 0], [-9, 0]]);
  const ear = dot(5, -15, 4.6);
  const tail = open([[-14, -5], [-22, -3], [-28, -9], [-35, -8]]);
  return {
    lines: [body, ear, tail],
    fine: ['M16 -5l8 -3M16 -4l8 1', 'M-8 0l-2 3M4 0l2 3'],
    washes: [
      { c: PAL.grey, o: 0.62, d: `${body}${ear}` },
      { c: PAL.rose, o: 0.75, d: dot(5, -15, 2.6) },
    ],
    fills: [dot(19, -4.5, 1.3), dot(11, -9, 1.4)],
    glints: [dot(10.5, -9.5, 0.45)],
  };
}

// ---------------------------------------------------------------------------------------------
// Froggy Frog, green with darker spots and big bulging eyes, mid-hop: his back legs stretched out
// behind, origin at his back foot. About 54 long.
export function frog() {
  const body = closed([[-6, -8], [0, -16], [10, -23], [20, -26], [28, -22], [27, -16], [18, -11], [6, -6]]);
  const bump = dot(19, -27, 4.8);
  const thigh = [[-1, -9, 9], [-10, -5, 6.5], [-19, -1, 4.5]];
  const foot = closed([[-18, -3], [-27, -3], [-29, 1], [-17, 1]]);
  const arm = [[17, -12, 5.5], [23, -6, 4.5], [28, -2, 3.5]];
  const hand = closed([[27, -3], [32, -2], [33, 1], [27, 1]]);
  return {
    lines: [limb(thigh), foot, body, bump, limb(arm), hand],
    fine: ['M28 -18q-4 3 -10 2', 'M-24 -2l-3 -1M-22 0l-4 1'],
    washes: [
      { c: PAL.green, o: 0.78, d: `${body}${bump}${limbFill(thigh)}${foot}${limbFill(arm)}${hand}` },
      { c: PAL.green, o: 0.6, d: `${dot(8, -17, 2)}${dot(13, -20, 1.5)}${dot(4, -12, 1.4)}${dot(-6, -6, 1.6)}` },
      { c: PAL.ochre, o: 0.4, d: 'M8 -7C16 -9 22 -12 27 -16C26 -12 20 -9 12 -6Z' },
    ],
    whites: [dot(19, -27, 3.4)],
    fills: [dot(20, -27.5, 1.7)],
    glints: [dot(19.5, -28, 0.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// Jumpy Hare, soft grey-brown with long rose-lined ears. hareEars() are just the two ears (origin at
// their roots), for sticking out of the mitten; hare() is all of him leaping, about 60 long.
export function hareEars() {
  const a = [[0, 0, 7], [1, -14, 7.5], [3, -27, 5.5]];
  const b = [[7, 1, 7], [12, -12, 7.5], [19, -23, 5.5]];
  return {
    lines: [limb(a), limb(b)],
    fine: ['M1 -6C1 -14 2 -20 3 -24', 'M9 -4C12 -10 14 -15 17 -20'],
    washes: [
      { c: PAL.grey, o: 0.6, d: `${limbFill(a)}${limbFill(b)}` },
      { c: PAL.ochre, o: 0.3, d: `${limbFill(a)}${limbFill(b)}` },
      { c: PAL.rose, o: 0.7, d: 'M0 -4C-1 -12 1 -20 3 -24C4 -18 4 -10 3 -4ZM8 -3C11 -10 14 -15 17 -20C17 -14 14 -8 10 -2Z' },
    ],
  };
}
export function hare() {
  const body = closed([[-22, -22], [-14, -31], [2, -33], [15, -30], [21, -24], [13, -17], [-4, -15], [-17, -15]]);
  const head = closed([[13, -31], [17, -39], [27, -42], [34, -37], [37, -32], [30, -28], [20, -26]]);
  const earA = [[20, -39, 6], [10, -48, 6.5], [-2, -54, 4.5]];
  const earB = [[24, -41, 6], [17, -53, 6.5], [8, -62, 4.5]];
  const legs = [[[-18, -18, 8], [-30, -12, 6], [-42, -10, 5]], [[-12, -16, 7], [-24, -8, 5.5], [-34, -4, 4.5]], [[12, -20, 6], [24, -14, 5], [34, -12, 4]], [[8, -18, 6], [18, -9, 5], [28, -6, 4]]];
  const tail = dot(-22, -26, 4.5);
  const ld = legs.map(limb);
  return {
    lines: [...ld, limb(earA), body, head, limb(earB), tail],
    fine: ['M36 -31l7 -2M36 -30l7 1', 'M33 -33q2 2 4 1'],
    washes: [
      { c: PAL.grey, o: 0.6, d: `${body}${head}${limbFill(earA)}${limbFill(earB)}${ld.join('Z')}Z` },
      { c: PAL.ochre, o: 0.3, d: `${body}${head}${ld.join('Z')}Z` },
      { c: PAL.rose, o: 0.7, d: 'M17 -42C10 -47 4 -51 0 -53C6 -50 12 -46 17 -40ZM21 -44C17 -50 13 -56 10 -60C14 -55 18 -50 22 -42Z' },
    ],
    whites: [tail],
    fills: [dot(37.5, -33, 1.4), dot(27, -36, 1.6)],
    glints: [dot(26.5, -36.5, 0.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// Sister Fox, terracotta with a white-tipped bushy tail. foxTail() is just the tail (root at 0,0,
// sweeping right), for hanging out of the mitten; fox() is all of her, running, about 90 long.
export function foxTail() {
  const tail = closed([[0, -5], [10, -9], [22, -9], [33, -5], [40, 1], [34, 7], [22, 8], [10, 5], [0, 4]]);
  const tip = closed([[29, -7], [35, -4], [40, 1], [34, 7], [28, 7], [30, 0]]);
  return {
    lines: [tail],
    fine: ['M29 -7C31 -2 31 3 28 7', 'M10 -2l6 1M16 2l6 0'],
    washes: [{ c: PAL.terracotta, o: 0.8, d: tail }],
    whites: [tip],
  };
}
export function fox() {
  const body = closed([[-28, -26], [-18, -34], [2, -35], [18, -32], [24, -24], [14, -18], [-6, -17], [-24, -18]]);
  const head = closed([[16, -32], [22, -42], [32, -44], [40, -40], [52, -36], [46, -31], [34, -28], [22, -26]]);
  const ears = 'M23 -41L24 -54L31 -44M30 -44L35 -55L38 -41';
  const earFill = 'M23 -41L24 -54L31 -44ZM30 -44L35 -55L38 -41Z';
  const legs = [[[-22, -20, 7], [-32, -12, 5.5], [-40, -8, 4.5]], [[-16, -19, 7], [-24, -8, 5.5], [-30, -2, 4.5]], [[12, -22, 6], [24, -16, 5], [34, -14, 4]], [[8, -20, 6], [16, -10, 5], [24, -6, 4]]];
  const ld = legs.map(limb);
  const tail = place(foxTail(), 'translate(-26 -26) rotate(170) scale(1.15)');
  return merge(
    {
      lines: [...ld, body, head, ears],
      fine: ['M38 -33C42 -30 46 -30 50 -33', 'M-2 -18C6 -20 12 -22 16 -26'],
      washes: [
        { c: PAL.terracotta, o: 0.78, d: `${body}${head}${earFill}${ld.join('Z')}Z` },
        { c: PAL.ink, o: 0.45, d: ld.slice(2).join('Z') + 'Z' },
      ],
      whites: ['M36 -30C42 -29 46 -30 50 -33L46 -30C42 -27 38 -27 36 -30Z'],
      fills: [dot(52, -36, 1.8), dot(36, -38, 1.5)],
      glints: [dot(35.5, -38.5, 0.5)],
    },
    tail,
  );
}

// ---------------------------------------------------------------------------------------------
// Grey Wolf, walking, about 100 long and 64 tall: grey with a slate back, a long snout, pointed ears
// and a bushy tail.
export function wolf() {
  const body = closed([[-36, -32], [-26, -43], [0, -45], [20, -43], [30, -38], [33, -28], [24, -20], [0, -21], [-26, -21], [-36, -25]]);
  const head = closed([[26, -40], [30, -50], [38, -54], [45, -50], [58, -44], [63, -40], [56, -35], [42, -33], [31, -31]]);
  const ears = 'M33 -50L35 -63L41 -52M39 -52L44 -63L46 -50';
  const earFill = 'M33 -50L35 -63L41 -52ZM39 -52L44 -63L46 -50Z';
  const tail = [[-34, -36, 9], [-46, -30, 11], [-54, -16, 8]];
  const legs = [[[-28, -24, 9], [-30, -12, 7.5], [-32, -1, 7]], [[-18, -23, 9], [-14, -12, 7.5], [-12, -1, 7]], [[16, -24, 9], [14, -12, 7.5], [11, -1, 7]], [[24, -25, 9], [28, -13, 7.5], [32, -2, 7]]];
  const ld = legs.map(limb);
  return {
    lines: [...ld, limb(tail), body, head, ears],
    fine: ['M50 -37C54 -36 58 -37 61 -39', 'M-20 -40l4 -3M-8 -42l4 -3M4 -42l4 -3', 'M-50 -24l4 2M-46 -18l4 1'],
    washes: [
      { c: PAL.grey, o: 0.72, d: `${body}${head}${earFill}${limbFill(tail)}${ld.join('Z')}Z` },
      { c: PAL.slate, o: 0.45, d: 'M-34 -32C-24 -42 0 -44 20 -42C26 -40 30 -38 32 -34C20 -36 0 -36 -32 -28Z' + earFill },
    ],
    whites: ['M40 -36C46 -34 52 -35 58 -37L56 -35C50 -32 44 -32 40 -34Z'],
    fills: [dot(63, -40.5, 2), dot(44, -45, 1.6)],
    glints: [dot(43.5, -45.5, 0.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// Snorty Boar: brown-grey and bristly, with a rose snout and little white tusks. boarHead() is the
// head alone, facing right, origin at the neck (for poking out of the mitten).
export function boarHead() {
  const head = closed([[-10, 2], [-12, -10], [-4, -19], [8, -18], [18, -12], [24, -8], [24, 1], [14, 5], [0, 5]]);
  const snout = oval(24.5, -3.5, 3, 5);
  const ear = 'M-5 -17L-2 -28L5 -17';
  return {
    lines: [head, ear],
    fine: [snout, 'M18 3q4 -1 6 -6', 'M-8 -16l-2 -4M-2 -19l-1 -4M4 -19l0 -4', 'M23.5 -5l0 1.5M25.5 -5l0 1.5'],
    washes: [
      { c: PAL.grey, o: 0.7, d: `${head}M-5 -17L-2 -28L5 -17Z` },
      { c: PAL.terracotta, o: 0.4, d: head },
      { c: PAL.rose, o: 0.8, d: snout },
    ],
    whites: ['M18 3q4 -1 6 -6l1 2q-3 5 -7 5Z'],
    fills: [dot(10, -11, 1.6)],
    glints: [dot(9.5, -11.5, 0.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// Big Brown Bear, standing up and pushing forwards (towards +x), about 125 tall. mood 'push' (eyes
// squeezed shut with the effort) or 'laugh' (eyes shut in a smile, mouth open).
export function bear({ mood = 'push' } = {}) {
  const body = closed([[-30, -22], [-34, -52], [-24, -82], [-4, -98], [18, -100], [32, -88], [32, -62], [24, -32], [10, -16], [-14, -14]]);
  const head = closed([[16, -102], [20, -116], [34, -122], [46, -117], [58, -110], [63, -102], [55, -95], [40, -91], [26, -92]]);
  const earA = open([[20, -112], [16, -122], [24, -127], [30, -120]]);
  const earB = open([[31, -121], [32, -130], [40, -130], [41, -120]]);
  const muzzle = closed([[47, -113], [58, -110], [63, -102], [55, -96], [46, -100]]);
  const armA = [[18, -86, 15], [40, -85, 13.5], [60, -83, 12]];
  const armB = [[16, -70, 15], [38, -66, 13.5], [58, -64, 12]];
  const legA = [[-18, -28, 20], [-30, -13, 17], [-38, -1, 15]];
  const legB = [[4, -22, 20], [11, -10, 17], [15, -1, 15]];
  const face =
    mood === 'push'
      ? ['M36 -111l6 2.5l-6 2.5', 'M50 -98q4 1 8 -1M53 -96l0 -2.5']
      : ['M35 -109q4 -4 8 0', 'M48 -99C51 -92 58 -92 60 -98C56 -96 52 -96 48 -99Z'];
  const ld = [limb(legA), limb(legB)];
  const ad = [limb(armB), limb(armA)];
  const brown = `${body}${ld.join('Z')}Z${ad.join('Z')}Z`;
  const H = 'translate(24 -94) scale(1.3) translate(-24 94)';
  const h = (d) => transformPath(d, H);
  const headBrown = h(`${head}${earA}Z${earB}Z`);
  return {
    lines: [...ld, body, h(earA), h(earB), h(head), ...ad],
    fine: [h(muzzle), ...face.map(h), h('M24 -120l1 -4M44 -128l1 -3'), 'M-20 -70l5 -3M-14 -50l5 -3M0 -84l5 -3', 'M56 -88l3 3M58 -79l3 -2M54 -69l3 3M56 -60l3 -2'],
    washes: [
      { c: PAL.terracotta, o: 0.62, d: brown + headBrown },
      { c: PAL.grey, o: 0.42, d: brown + headBrown },
      { c: PAL.ochre, o: 0.5, d: h(`${muzzle}${dot(25, -121, 2.6)}${dot(36, -126, 2.4)}`) },
      ...(mood === 'laugh' ? [{ c: PAL.red, o: 0.7, d: h('M48 -99C51 -92 58 -92 60 -98C56 -96 52 -96 48 -99Z') }] : []),
    ],
    fills: [h(dot(62, -105, 2.8))],
    glints: [h(dot(61, -106, 0.8))],
  };
}

// ---------------------------------------------------------------------------------------------
// The tiny Beetle, seen from above, head to the right, about 14 long: a shiny green-slate shell.
export function beetle() {
  const shell = oval(0, 0, 6, 4.6);
  const head = dot(7.4, 0, 2.2);
  return {
    lines: [shell],
    fine: ['M-6 0L6 0', 'M-3 -4l-2 -3M1 -4.5l0 -3M4 -4l2 -3M-3 4l-2 3M1 4.5l0 3M4 4l2 3', 'M9 -1l3 -3M9 1l3 3'],
    washes: [{ c: PAL.green, o: 0.7, d: shell }, { c: PAL.slate, o: 0.7, d: shell }],
    fills: [head],
    glints: [dot(-2, -2, 0.9)],
  };
}
