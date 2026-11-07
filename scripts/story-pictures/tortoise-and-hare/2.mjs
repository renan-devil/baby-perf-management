import { PAL, hatch, paths, tufts } from '../lib.mjs';

// The Tortoise and the Hare, 2: Hare rolls on his back laughing, legs kicking in the air, while
// Tortoise waits beside him, calm and patient. A little duck giggles behind her wing.
const f = (n) => Math.round(n * 10) / 10;
// Point mapper for 'translate(tx ty) rotate(a) scale(sx sy)', and a path mapper for absolute paths.
const at = (tx, ty, a, sx, sy = sx) => (x, y) => {
  const r = (a * Math.PI) / 180;
  return [tx + x * sx * Math.cos(r) - y * sy * Math.sin(r), ty + x * sx * Math.sin(r) + y * sy * Math.cos(r)];
};
const tp = (d, fn) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => fn(+x, +y).map(f).join(' '));
// A smooth limb (leg, arm, ear) along a centreline of [x, y, width] points, open at the root.
function limb(pts) {
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

const ground = 'M0 252C70 249 150 254 230 252C300 250 350 253 400 251';

// The hare on his back (drawn with the ground at y=0): head on the left, legs kicking on the right
const HS = 'translate(134 253) scale(1.12)';
const hs = at(134, 253, 0, 1.12);
const back = 'M-66 -2C-40 3 0 3 30 -2C42 -6 48 -16 44 -28';
const belly = 'M-50 -5C-42 -24 -18 -38 8 -38C18 -38 26 -37 30 -34';
const leg1 = limb([[44, -26, 16], [54, -50, 12], [60, -76, 9], [62, -94, 9], [70, -104, 10], [80, -107, 9]]);
const leg2 = limb([[28, -36, 16], [18, -54, 13], [12, -70, 10], [20, -88, 9], [30, -102, 9], [35, -113, 10]]);
const arm = limb([[-34, -10, 9], [-22, -26, 8], [-8, -36, 9]]);
const tail = 'M42 -10C50 -12 52 -2 44 -1';
const ear1 = limb([[-70, -30, 9], [-82, -34, 10], [-94, -30, 9], [-101, -20, 6], [-103, -10, 4]]);
const ear2 = limb([[-66, -35, 9], [-74, -46, 10], [-88, -50, 9], [-100, -46, 6], [-107, -38, 4]]);
const innerEars = limb([[-74, -32, 3], [-83, -35, 4], [-94, -31, 3], [-99, -22, 2]]) + 'Z' + limb([[-70, -38, 3], [-77, -46, 4], [-88, -48, 3], [-99, -44, 2]]) + 'Z';
const toes = 'M84 -110l5 -1M84 -105l5 1M38 -118l1 5M33 -117l-2 4';

// His head is drawn upright (facing right, centre 0,0) like on the cover, then tipped back
const HT = `${HS} translate(-58 -22) rotate(-25)`;
const ht = (x, y) => hs(...at(-58, -22, -25, 1)(x, y));
const head = 'M-19 1C-19 -11 -5 -17 7 -13C17 -10 21 -3 19 3C15 11 3 15 -7 13C-15 11 -19 7 -19 1Z';
const mouth = 'M2 2C8 4 13 4 17 1C18 7 15 11 10 11C5 11 2 7 2 2Z';
const laughEye = 'M-4 -3Q0 -10 5 -4';
const whiskers = 'M19 -1l9 -4M20 1l10 0';

// Tortoise from the cover, turned to face him
const TT = 'translate(296 246) scale(-1 1)';
const T = at(296, 246, 0, -1, 1);
const shell = 'M-42 -6C-40 -36 -20 -48 0 -48C22 -48 40 -34 42 -6Z';
const shellRim = 'M-46 -5C-20 2 20 2 46 -5';
const plates = 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM-12 -36L-18 -45M10 -36L16 -45M18 -22L38 -24M8 -10L14 -4M-10 -10L-16 -4M-18 -22L-38 -24';
const neck = 'M36 -16C44 -22 52 -26 58 -28M38 -6C46 -10 54 -14 60 -18';
const tHead = 'M54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30Z';
const tLegs = 'M26 -2L24 8L36 8L36 -3M-30 -3L-34 7L-22 8L-20 -2';
const tTail = 'M-44 -8L-54 -4L-44 -2';
// calm face: half-lowered lid, small patient smile
const tFace = 'M64 -40l10 -1M64 -24Q71 -19 79 -24M66 -32C66 -38 76 -38 76 -32C76 -26 66 -26 66 -32Z';
const lid = 'M65.6 -33.6C68 -34.6 74 -34.6 76.4 -33.6';
const eyeWhite = 'M66 -33.4C69 -34.2 73 -34.2 76 -33.4C76 -26.5 66 -26.5 66 -33.4Z';

// A little duck (facing left, ground at y=0) giggling behind her wing
const DT = 'translate(372 253)';
const duck = 'M-12 -25C-22 -20 -24 -6 -14 -1C-4 3 12 2 19 -4C22 -8 23 -14 24 -21C19 -18 13 -19 7 -23';
const duckHead = 'M-16 -34C-16 -47 4 -47 4 -34C4 -26 -2 -23 -6 -23C-12 -23 -16 -27 -16 -34Z';
const bill = 'M-15 -37C-20 -39 -26 -37 -28 -34C-24 -31 -19 -30 -15 -31';
const wing = 'M10 -12C2 -18 -6 -24 -12 -28C-16 -30 -21 -30 -20 -26C-18 -20 -8 -11 2 -7';
const giggle = 'M-10 -36Q-7 -40 -4 -36M-18 -50l-3 -5M-7 -53l0 -6M5 -50l3 -5M28 -30l5 -3M29 -24l6 0';

// laugh marks round his head, kick marks by his feet
const marks = 'M58 192l-4 -9M73 187l0 -10M89 190l5 -9M38 200l-8 -5M240 116q9 7 4 18M249 110q13 9 7 27M183 98q-9 -5 -14 4M186 89q-13 -9 -22 4';

export default {
  title: 'Hare laughs, Tortoise waits',
  seed: 32,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 248C70 245 150 250 230 248C300 246 350 249 400 247L400 300L0 300Z' },
    // hare fur
    {
      c: PAL.grey,
      o: 0.6,
      t: HS,
      d: `M-50 -5C-42 -24 -18 -38 8 -38C26 -38 46 -30 46 -16C46 -6 40 -3 30 -2C0 3 -40 3 -66 -2Z${leg1}Z${leg2}Z${ear1}Z${ear2}Z${arm}Z`,
    },
    { c: PAL.grey, o: 0.6, t: HT, d: head },
    { c: PAL.rose, o: 0.55, t: HS, d: innerEars },
    { c: PAL.red, o: 0.75, t: HT, d: mouth },
    { c: PAL.rose, o: 0.8, t: HT, d: 'M19 1C21 -1 23 1 21 4ZM6 9C8 7 12 7 14 9C12 11 8 11 6 9Z' },
    // tortoise
    { c: PAL.green, o: 0.7, t: TT, d: 'M-40 -6C-38 -34 -20 -46 0 -46C22 -46 38 -32 40 -6Z' },
    { c: PAL.ochre, o: 0.6, t: TT, d: 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30ZM36 -16C46 -22 52 -26 58 -28L60 -18C52 -14 44 -10 38 -6ZM26 -2L24 8L36 8L36 -3ZM-30 -3L-34 7L-22 8L-20 -2Z' },
    // a tear of laughter
    { c: PAL.sky, o: 0.85, d: tp('M-7 0C-10 4 -9 8 -6 8C-3 8 -3 4 -7 0Z', ht) },
    // duck
    { c: PAL.ochre, o: 0.62, t: DT, d: duck + 'C2 -26 4 -30 4 -34C4 -47 -16 -47 -16 -34C-16 -30 -14 -27 -12 -25Z' },
    { c: PAL.ochre, o: 0.5, t: DT, d: wing + 'Z' },
    { c: PAL.terracotta, o: 0.8, t: DT, d: bill + 'Z' },
  ],
  whites: tp('M-40 -12C-30 -30 -8 -36 14 -31C6 -18 -22 -9 -40 -12Z', hs) + tp(eyeWhite, T),
  lines: paths([ground]) + paths([back, belly, leg1, leg2, arm, tail, ear1, ear2], HS) + paths([head, mouth, laughEye], HT) + paths([shell, neck, tHead, tLegs, tTail], TT) + paths([duck, duckHead, bill, wing], DT),
  fine:
    paths([
      marks,
      hatch(10, 272, 120, 272, 10, 6, 160, 6),
      hatch(220, 272, 390, 270, 10, 6, 160, 7),
      tufts([[118, 253], [204, 252], [334, 251], [20, 252]], 9, 9),
    ]) +
    paths([toes], HS) +
    paths([whiskers], HT) +
    paths([shellRim, plates, tFace, lid], TT) +
    paths([giggle], DT),
  fills: `<circle cx="73.6" cy="-30.6" r="2.4" transform="${TT}"/>`,
  glints: `<circle cx="72.8" cy="-31.6" r="0.8" transform="${TT}"/>`,
};
