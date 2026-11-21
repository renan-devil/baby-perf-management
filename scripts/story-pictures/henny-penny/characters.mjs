import { PAL, hatch, transformPath } from '../lib.mjs';

// Henny Penny: the birds, Foxy Loxy, the acorn and the oak, drawn once here and placed in the five
// pictures with a transform (place). The build only draws files named <n>.mjs, so this file is not a
// picture. Every character faces right with its feet at 0,0 (flip with scale(-1 1)).

export const f = (n) => Math.round(n * 10) / 10;

/** A round dot (eye, pupil, glint) as path data. */
export const dot = (x, y, r) => `M${f(x - r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

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

// A part: { lines, fine, once, washes: [{c, o, d}], whites, fills, glints }, each a list.
const KEYS = ['lines', 'fine', 'once', 'washes', 'whites', 'fills', 'glints'];
const tr = (d, t) => (t ? transformPath(d, t) : d);

/** Places a part with an SVG transform string (applied to the coordinates themselves). */
export function place(part, t) {
  const out = {};
  for (const k of KEYS) out[k] = (part[k] ?? []).map((v) => (k === 'washes' ? { ...v, d: tr(v.d, t) } : tr(v, t)));
  return out;
}

/** Puts several parts together into one. */
export function merge(...parts) {
  const out = Object.fromEntries(KEYS.map((k) => [k, []]));
  for (const p of parts) for (const k of KEYS) out[k].push(...(p[k] ?? []));
  return out;
}

/** Joins placed parts into the drawing that svg() takes. */
export function compose({ title, seed, parts = [] }) {
  const all = merge(...parts);
  const tags = (list) => list.map((d) => `<path d="${d}"/>`).join('');
  return {
    title,
    seed,
    washes: all.washes,
    whites: all.whites.join(''),
    lines: tags(all.lines),
    fine: tags(all.fine),
    once: tags(all.once),
    fills: tags(all.fills),
    glints: tags(all.glints),
  };
}

/** An eye at (x, y): open (pupil nudged by look = [dx, dy]) or 'shut' in a happy laughing curve. */
function eye(x, y, r, { shut = false, look = [0.4, 0] } = {}) {
  if (shut) return { fine: [`M${f(x - r)} ${f(y + 0.5)}q${f(r)} ${f(-r * 1.3)} ${f(2 * r)} 0`] };
  return {
    whites: [dot(x, y, r)],
    fine: [dot(x, y, r)],
    fills: [dot(x + look[0] * r * 0.5, y + look[1] * r * 0.5, r * 0.55)],
    glints: [dot(x + look[0] * r * 0.5 + r * 0.18, y + look[1] * r * 0.5 - r * 0.22, r * 0.17)],
  };
}

/** Little laugh marks fanning out in front of a beak at (x, y). */
const laughMarks = (x, y) => `M${x + 4} ${y - 8}l5 -4M${x + 6} ${y - 1}l7 0M${x + 4} ${y + 6}l5 4`;

// ---------------------------------------------------------------------------------------------
// Henny Penny, about 76 tall: a round, plump little hen, warm ochre with a terracotta tail and
// wing, a small red comb. mood: 'surprised' (eye wide, beak open), 'worried', 'laugh'.
// look: where the pupil points. holding: one wing held out in front, the acorn on its tip at
// HENNY_HOLD.
const hpBody =
  'M-30 -34C-30 -46 -16 -50 -2 -46C6 -48 9 -55 11 -63C13 -71 20 -76 27 -74C33 -72 35 -66 34 -60C33 -55 29 -52 31 -45C35 -30 26 -13 6 -11C-14 -9 -30 -20 -30 -34Z';
const hpTail = 'M-28 -32C-38 -38 -44 -50 -41 -62C-36 -56 -30 -54 -24 -52C-26 -58 -26 -64 -22 -70C-18 -60 -12 -54 -6 -47';
const hpTailWash = 'M-28 -32C-38 -38 -44 -50 -41 -62C-36 -56 -30 -54 -24 -52C-26 -58 -26 -64 -22 -70C-18 -60 -12 -54 -6 -47Z';
const hpWing = 'M-16 -34C-6 -41 9 -38 14 -29C8 -20 -6 -18 -15 -24C-18 -28 -18 -31 -16 -34Z';
const hpWingMarks = 'M-12 -25q2 3 4 1q2 3 4 1q2 3 4 1';
const hpWingOut = 'M-10 -32C-4 -40 14 -42 30 -42C42 -42 52 -44 58 -40C55 -33 44 -29 30 -27C14 -24 -2 -23 -10 -28Z';
const hpWingOutMarks = 'M30 -34l8 0M40 -36l9 -1M8 -32q2 3 4 1q2 3 4 1';
export const HENNY_HOLD = [56, -46];
const hpComb = 'M17 -74C15 -80 19 -82 21 -78C21 -83 26 -84 27 -79C29 -82 33 -79 31 -75C30 -73 27 -73 25 -74Z';
const hpWattle = 'M32 -56C30 -52 31 -49 34 -50C36 -51 36 -54 34 -57Z';
const hpBeak = 'M33 -67L42 -63L33 -59Z';
const hpBeakOpen = 'M33 -68L43 -67L34 -63ZM34 -61L41 -57L32 -59Z';
const hpLegs = 'M-3 -11L-4 0M-10 0L0 0M-4 0l-3 -3M8 -11L9 0M4 0L14 0M9 0l3 -3';
export const HENNY_HEAD = [24, -76]; // the top of her head, where acorns land

export function henny({ mood = 'worried', look = [0.4, 0], holding = false, legs = true } = {}) {
  const shut = mood === 'laugh';
  const open = mood !== 'worried';
  const beak = open ? hpBeakOpen : hpBeak;
  const part = {
    lines: [hpTail, hpBody, hpComb, hpWattle, beak, ...(legs ? [hpLegs] : [])],
    fine: [holding ? hpWingOut : hpWing, holding ? hpWingOutMarks : hpWingMarks, 'M14 -48q3 2 6 0M8 -40q3 2 6 0M-20 -40q3 2 6 0'],
    washes: [
      { c: PAL.terracotta, o: 0.75, d: hpTailWash },
      { c: PAL.ochre, o: 0.78, d: hpBody },
      { c: PAL.terracotta, o: 0.55, d: holding ? hpWingOut : hpWing },
      { c: PAL.rose, o: 0.6, d: dot(28, -58, 3) },
      { c: PAL.red, o: 0.9, d: hpComb + hpWattle },
      { c: PAL.ochre, o: 0.95, d: beak },
      { c: PAL.terracotta, o: 0.4, d: beak },
    ],
  };
  if (mood === 'worried') part.fine.push('M21 -72l7 1');
  if (mood === 'surprised') part.fine.push('M20 -75q4 -3 8 -1');
  return merge(part, eye(25, -65, shut ? 3 : 3.4, { shut, look }), shut && !holding ? { fine: [laughMarks(42, -62)] } : {});
}

// ---------------------------------------------------------------------------------------------
// Cocky Locky, about 92 tall: a proud cockerel, terracotta with an ochre neck ruff, a big red comb
// and a long green sickle tail.
const ckBody =
  'M-24 -38C-26 -50 -14 -54 -2 -52C4 -51 8 -56 10 -64C11 -74 15 -80 22 -80C29 -80 33 -75 32 -68C31 -62 27 -58 29 -50C31 -34 24 -18 6 -16C-10 -14 -22 -24 -24 -38Z';
const ckRuff = 'M10 -64C12 -56 18 -52 28 -51C26 -56 28 -62 31 -66C26 -64 18 -64 10 -64Z';
const ckTail = [
  'M-20 -44C-24 -68 -40 -84 -55 -76C-62 -70 -60 -57 -54 -47C-50 -59 -43 -65 -35 -63C-29 -61 -25 -53 -23 -37',
  'M-23 -36C-30 -56 -48 -62 -61 -50C-64 -44 -62 -35 -58 -29C-55 -39 -47 -45 -39 -43C-33 -41 -29 -36 -25 -29',
];
const ckWing = 'M-14 -40C-4 -46 10 -44 14 -34C8 -26 -4 -24 -14 -30C-16 -34 -16 -37 -14 -40Z';
const ckComb = 'M14 -78C11 -86 16 -90 18 -84C18 -92 25 -93 25 -86C27 -92 34 -89 31 -82C34 -81 33 -77 29 -77Z';
const ckWattle = 'M30 -63C28 -57 30 -53 33 -55C35 -57 34 -61 32 -64Z';
const ckBeak = 'M31 -73L40 -69L31 -66Z';
const ckBeakOpen = 'M31 -74L41 -73L32 -69ZM32 -67L39 -63L30 -65Z';
const ckLegs = 'M-2 -16L-3 0M-9 0L1 0M-3 0l-3 -3M8 -16L9 0M4 0L14 0M9 0l3 -3';

export function cocky({ mood = 'proud', legs = true } = {}) {
  const shut = mood === 'laugh';
  const beak = shut ? ckBeakOpen : ckBeak;
  return merge(
    {
      lines: [...ckTail, ckBody, ckComb, ckWattle, beak, ...(legs ? [ckLegs] : [])],
      fine: [ckWing, 'M-10 -31q2 3 4 1q2 3 4 1q2 3 4 1', 'M14 -56l3 3M19 -54l2 4M23 -53l2 3'],
      washes: [
        { c: PAL.green, o: 0.78, d: ckTail.map((t) => `${t}Z`).join('') },
        { c: PAL.slate, o: 0.25, d: `${ckTail[1]}Z` },
        { c: PAL.terracotta, o: 0.82, d: ckBody },
        { c: PAL.ochre, o: 0.85, d: ckRuff },
        { c: PAL.ochre, o: 0.45, d: ckWing },
        { c: PAL.red, o: 0.92, d: ckComb + ckWattle },
        { c: PAL.ochre, o: 0.95, d: beak },
      ],
    },
    eye(23, -71, shut ? 2.8 : 3, { shut }),
    shut ? { fine: [laughMarks(40, -69)] } : {},
  );
}

// ---------------------------------------------------------------------------------------------
// Ducky Lucky, about 60 tall: a white duck with soft sky-blue shading, an ochre bill and feet.
const dkBody =
  'M-28 -20C-34 -27 -33 -35 -27 -32C-20 -29 -10 -30 0 -30C5 -33 6 -40 5 -46C4 -54 10 -60 18 -60C25 -60 29 -55 29 -50C29 -45 25 -42 22 -38C20 -34 22 -32 25 -29C31 -22 28 -10 14 -8C-2 -5 -22 -9 -28 -20Z';
const dkBill = 'M27 -52C33 -54 40 -53 42 -50C42 -47 36 -46 28 -47Z';
const dkBillOpen = 'M27 -53C33 -56 40 -57 42 -54C41 -51 35 -50 28 -50ZM28 -48C34 -47 39 -45 40 -42C36 -42 31 -43 27 -46Z';
const dkWing = 'M-18 -24C-10 -30 4 -28 9 -20C2 -14 -10 -13 -18 -18C-20 -20 -20 -22 -18 -24Z';
const dkFeet = 'M1 -6L1 0M-4 1L6 1M11 -8L11 0M7 1L16 1';

export function ducky({ mood = 'calm', legs = true } = {}) {
  const shut = mood === 'laugh';
  const bill = shut ? dkBillOpen : dkBill;
  return merge(
    {
      lines: [dkBody, bill, ...(legs ? [dkFeet] : [])],
      fine: [dkWing, 'M-14 -18q2 2 4 0q2 2 4 0q2 2 4 0', 'M28 -50l6 0'],
      washes: [
        { c: PAL.sky, o: 0.38, d: dkBody },
        { c: PAL.sky, o: 0.55, d: dkWing },
        { c: PAL.slate, o: 0.18, d: 'M-28 -20C-22 -12 0 -8 14 -9C24 -10 28 -16 27 -22C18 -14 -8 -14 -28 -20Z' },
        { c: PAL.ochre, o: 0.95, d: bill },
        ...(legs ? [{ c: PAL.ochre, o: 0.9, d: 'M-4 -1L6 -1L6 2L-4 2ZM7 -1L16 -1L16 2L7 2Z' }] : []),
      ],
    },
    eye(18, -51, shut ? 2.6 : 2.8, { shut }),
    shut ? { fine: [laughMarks(40, -50)] } : {},
  );
}

// ---------------------------------------------------------------------------------------------
// Goosey Loosey, about 80 tall: a grey goose with a long neck and a terracotta bill.
const gsBody =
  'M-36 -22C-42 -30 -40 -37 -32 -34C-22 -31 -10 -33 2 -35C8 -39 10 -49 10 -61C10 -71 15 -79 23 -79C30 -79 34 -74 34 -69C34 -65 31 -63 27 -61C23 -55 21 -47 25 -38C31 -29 29 -13 11 -9C-7 -5 -30 -10 -36 -22Z';
const gsBill = 'M33 -73C39 -73 45 -71 46 -68C45 -65 39 -65 32 -66Z';
const gsBillOpen = 'M33 -74C39 -75 45 -75 46 -72C44 -69 38 -69 32 -69ZM32 -67C38 -66 43 -64 44 -61C40 -61 35 -62 31 -64Z';
const gsWing = 'M-24 -26C-14 -32 2 -31 9 -23C1 -15 -14 -14 -24 -19C-26 -21 -26 -24 -24 -26Z';
const gsFeet = 'M-2 -8L-2 0M-8 1L3 1M10 -9L10 0M5 1L16 1';

export function goosey({ mood = 'calm', legs = true } = {}) {
  const shut = mood === 'laugh';
  const bill = shut ? gsBillOpen : gsBill;
  return merge(
    {
      lines: [gsBody, bill, ...(legs ? [gsFeet] : [])],
      fine: [gsWing, 'M-20 -19q2 2 4 0q2 2 4 0q2 2 4 0q2 2 4 0', 'M14 -58l3 2M14 -50l3 2'],
      washes: [
        { c: PAL.grey, o: 0.5, d: gsBody },
        { c: PAL.slate, o: 0.4, d: gsWing },
        { c: PAL.terracotta, o: 0.85, d: bill },
        { c: PAL.ochre, o: 0.4, d: bill },
        ...(legs ? [{ c: PAL.terracotta, o: 0.8, d: 'M-8 -1L3 -1L3 2L-8 2ZM5 -1L16 -1L16 2L5 2Z' }] : []),
      ],
      whites: ['M-30 -21C-20 -14 0 -12 14 -14C22 -15 26 -19 27 -24C24 -16 6 -10 -10 -12C-20 -13 -26 -16 -30 -21Z'],
    },
    eye(24, -71, shut ? 2.6 : 2.8, { shut }),
    shut ? { fine: [laughMarks(44, -68)] } : {},
  );
}

// ---------------------------------------------------------------------------------------------
// Foxy Loxy, bowing low on his hind legs: a terracotta fox with a white chin and chest, dark socks,
// a big bushy tail with a white tip, half-shut sly eyes and a sly smile. His front paw sweeps down
// and forward, pointing the way. About 100 tall.
export function foxyBow() {
  const body = 'M-18 -46C-20 -60 -4 -74 14 -80C28 -84 38 -76 36 -66C34 -56 22 -48 12 -40C2 -34 -16 -34 -18 -46Z';
  const back = 'M33 -55C26 -48 20 -44 12 -40C2 -34 -16 -34 -18 -46C-20 -60 -4 -74 14 -80C22 -83 29 -82 33 -79';
  const head = 'M31 -70C31 -80 42 -85 50 -79L69 -57C71 -54 69 -51 65 -52L51 -52C45 -47 36 -49 33 -55C31 -59 30 -65 31 -70Z';
  const chin = 'M50 -52L65 -52C61 -47 55 -45 48 -48Z';
  const ears = 'M34 -76L22 -88L41 -81M42 -80L40 -96L51 -78';
  const innerEar = 'M33 -79L27 -85L37 -81Z';
  const legs = [limb([[-14, -42, 11], [-15, -20, 8], [-12, -2, 7]]), limb([[-3, -40, 11], [1, -20, 8], [6, -2, 7]])];
  const socks = 'M-18 0C-18 -6 -7 -7 -5 0ZM0 0C0 -6 11 -7 13 0Z';
  const arm = limb([[28, -55, 9], [40, -44, 7], [54, -36, 6], [65, -33, 5.5]]);
  const finger = 'M66 -35L77 -36C79 -35 79 -33 77 -32L67 -31Z';
  const tail = limb([
    [-16, -44, 9],
    [-32, -48, 16],
    [-46, -60, 19],
    [-52, -78, 15],
    [-48, -92, 7],
  ]);
  const tip = limb([[-52, -80, 14], [-48, -92, 7]]);
  return {
    lines: [tail, ...legs, back, arm, finger, head, ears, 'M38 -71q7 -5 14 0'],
    fine: [
      innerEar,
      'M-50 -74C-54 -78 -54 -82 -52 -85',
      'M-38 -54l6 -2M-46 -66l6 1M2 -64l6 2',
      // a sly eye: the lid drawn half down over the pupil; a long sly smile curling up
      'M49 -56q8 5 15 -1q2 -2 1 -4',
      'M40 -82l8 3',
    ],
    washes: [
      { c: PAL.terracotta, o: 0.9, d: `${tail}Z${body}${head}${ears}Z${legs.map((l) => `${l}Z`).join('')}${arm}Z${finger}` },
      { c: PAL.red, o: 0.22, d: `${tail}Z` },
      { c: PAL.ink, o: 0.45, d: innerEar },
      { c: PAL.ink, o: 0.6, d: socks },
    ],
    whites: [`${tip}Z`, chin],
    fills: [dot(68, -55, 2.2), 'M39.5 -71q5.5 5 11 0Z'],
    glints: [],
  };
}

/** Foxy Loxy's two sly eyes, peeping out of the dark (centre 0,0), looking to the right. */
export function foxEyes() {
  const lid = (x) => `M${x - 4} 0C${x - 2} -3 ${x + 2} -3 ${x + 4} 0C${x + 2} 2 ${x - 2} 2 ${x - 4} 0Z`;
  return {
    whites: [lid(-6) + lid(6)],
    fine: [lid(-6), lid(6)],
    fills: [dot(-4.5, 0, 1.4), dot(7.5, 0, 1.4)],
  };
}

// ---------------------------------------------------------------------------------------------
// The acorn (centre 0,0, about 14 tall): an ochre nut in a grey scaly cup, with a little stalk.
export function acorn() {
  const nut = 'M-5.5 -1C-6 5 -3 10 0 11C3 10 6 5 5.5 -1Z';
  const cup = 'M-7 0C-8 -5 -4 -7 0 -7C4 -7 8 -5 7 0C3 1 -3 1 -7 0Z';
  return {
    lines: [nut, cup, 'M0 -7L1 -10'],
    fine: ['M-4 -4l2 2M0 -5l1 2M3 -4l2 2'],
    washes: [
      { c: PAL.ochre, o: 0.95, d: nut },
      { c: PAL.terracotta, o: 0.45, d: nut },
      { c: PAL.grey, o: 0.9, d: cup },
    ],
    glints: [dot(-2.5, 3, 1)],
  };
}

/** A bonk: short impact strokes fanning out above (x, y), and two little stars. */
export function bonk(x, y, r = 10, [from, to] = [-160, -20]) {
  const star = (sx, sy, s) => `M${f(sx - s)} ${f(sy)}L${f(sx + s)} ${f(sy)}M${f(sx)} ${f(sy - s)}L${f(sx)} ${f(sy + s)}`;
  let strokes = '';
  for (let i = 0; i < 6; i++) {
    const a = ((from + (i * (to - from)) / 5) * Math.PI) / 180;
    const r2 = r + 8 + (i % 2) * 4;
    strokes += `M${f(x + Math.cos(a) * r)} ${f(y + Math.sin(a) * r)}L${f(x + Math.cos(a) * r2)} ${f(y + Math.sin(a) * r2)}`;
  }
  const sa = (from * Math.PI) / 180;
  const sb = (to * Math.PI) / 180;
  return { lines: [strokes], once: [star(x + Math.cos(sa) * (r + 12), y + Math.sin(sa) * (r + 12) + 4, 3.5), star(x + Math.cos(sb) * (r + 12), y + Math.sin(sb) * (r + 12) + 2, 3)] };
}

// ---------------------------------------------------------------------------------------------
// An old oak, trunk foot at 0,0, about 230 tall and 230 wide. den: a dark hole at the foot of the
// trunk (the fox's den).
export function oak({ den = false } = {}) {
  const trunk = 'M-34 0C-22 -8 -18 -30 -18 -60C-18 -90 -24 -110 -32 -130M34 0C22 -8 18 -30 18 -64C18 -92 26 -112 36 -132';
  const roots = 'M-34 0C-44 2 -54 2 -62 1M34 0C44 2 54 2 62 0M-14 -2C-18 2 -24 3 -30 3';
  const crown =
    'M-96 -138C-122 -146 -122 -182 -98 -192C-102 -220 -68 -240 -40 -228C-24 -248 20 -248 34 -226C62 -234 92 -214 86 -188C108 -176 104 -146 80 -140C68 -124 40 -124 24 -132C4 -120 -26 -122 -40 -132C-58 -124 -84 -126 -96 -138Z';
  const crownWash =
    'M-94 -140C-118 -148 -116 -180 -96 -190C-98 -216 -66 -236 -40 -224C-24 -244 18 -244 32 -222C60 -230 88 -212 82 -188C104 -176 100 -148 78 -142C66 -128 40 -128 24 -136C4 -124 -26 -126 -40 -136C-58 -128 -82 -130 -94 -140Z';
  const trunkWash = 'M-34 0C-22 -8 -18 -30 -18 -60C-18 -90 -24 -110 -32 -132L36 -134C26 -112 18 -92 18 -64C18 -30 22 -8 34 0Z';
  const bark = 'M-6 -100c-3 8 -3 16 0 22M8 -70c2 6 2 12 0 16M-8 -40c-2 6 -2 10 0 14M10 -118c3 6 3 10 0 14';
  const ticks = 'M-80 -170c3 -5 8 -5 10 0M-40 -200c3 -5 8 -5 10 0M10 -210c3 -5 8 -5 10 0M50 -184c3 -5 8 -5 10 0M-10 -160c3 -5 8 -5 10 0M-60 -146c3 -5 8 -5 10 0M40 -150c3 -5 8 -5 10 0';
  const acorns = [[-60, -142], [30, -138], [64, -160]];
  const hole = 'M-19 0C-21 -28 -10 -48 1 -48C12 -48 22 -28 20 0Z';
  const part = {
    lines: [trunk, roots, crown, ...(den ? ['M-23 0C-25 -32 -12 -53 1 -53C14 -53 26 -32 24 0'] : [])],
    fine: [
      bark,
      ticks,
      hatch(-90, -160, -60, -140, 6, 8, 125, 11),
      hatch(50, -160, 80, -146, 5, 8, 125, 12),
      ...acorns.map(([x, y]) => `M${x - 3} ${y}C${x - 3} ${y + 5} ${x + 3} ${y + 5} ${x + 3} ${y}Z`),
    ],
    washes: [
      { c: PAL.grey, o: 0.6, d: trunkWash },
      { c: PAL.terracotta, o: 0.22, d: trunkWash },
      { c: PAL.green, o: 0.68, d: crownWash },
      { c: PAL.green, o: 0.35, d: 'M-60 -150C-50 -164 -20 -168 0 -160C14 -152 8 -140 -8 -138C-24 -136 -50 -138 -60 -150Z' },
      { c: PAL.ochre, o: 0.9, d: acorns.map(([x, y]) => `M${x - 3} ${y}C${x - 3} ${y + 5} ${x + 3} ${y + 5} ${x + 3} ${y}Z`).join('') },
      ...(den
        ? [
            { c: PAL.slate, o: 0.8, d: hole },
            { c: PAL.ink, o: 0.65, d: hole },
          ]
        : []),
    ],
  };
  return part;
}

/** The ground line across the picture at y, with a soft green wash below it. */
export function ground(y = 262) {
  return {
    lines: [`M0 ${y + 1}C70 ${y - 2} 150 ${y + 3} 230 ${y}C300 ${y - 2} 350 ${y + 1} 400 ${y - 1}`],
    fine: [hatch(14, y + 18, 386, y + 18, 13, 6, 162, 6)],
    washes: [{ c: PAL.green, o: 0.38, d: `M0 ${y - 3}C70 ${y - 6} 150 ${y - 1} 230 ${y - 4}C300 ${y - 6} 350 ${y - 3} 400 ${y - 5}L400 ${y + 34}C300 ${y + 36} 100 ${y + 35} 0 ${y + 33}Z` }],
  };
}
