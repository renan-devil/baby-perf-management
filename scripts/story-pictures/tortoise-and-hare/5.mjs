import { PAL, hatch, paths, tufts } from '../lib.mjs';

// The Tortoise and the Hare, 5: Tortoise has passed the red flag at the top of the hill and smiles while
// a duck, a rabbit and a little mole cheer and clap. Hare puffs up the slope behind, ears all droopy.
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
const oval = (cx, cy, rx, ry = rx) =>
  `M${f(cx - rx)} ${f(cy)}C${f(cx - rx)} ${f(cy - ry * 1.33)} ${f(cx + rx)} ${f(cy - ry * 1.33)} ${f(cx + rx)} ${f(cy)}C${f(cx + rx)} ${f(cy + ry * 1.33)} ${f(cx - rx)} ${f(cy + ry * 1.33)} ${f(cx - rx)} ${f(cy)}Z`;

// The top of the hill
const hill = 'M0 268C36 264 70 250 100 230C124 212 146 194 180 190C250 186 330 188 400 187';

// The red flag, just behind Tortoise now
const flag = 'M152 194L152 106M152 108C164 101 174 115 186 110C179 122 167 124 152 129';

// Tortoise from the cover, past the flag, smiling at her friends
const TT = 'translate(214 186) scale(0.96)';
const T = at(214, 186, 0, 0.96);
const shell = 'M-42 -6C-40 -36 -20 -48 0 -48C22 -48 40 -34 42 -6Z';
const shellRim = 'M-46 -5C-20 2 20 2 46 -5';
const plates = 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM-12 -36L-18 -45M10 -36L16 -45M18 -22L38 -24M8 -10L14 -4M-10 -10L-16 -4M-18 -22L-38 -24';
const neck = 'M36 -16C44 -22 52 -26 58 -28M38 -6C46 -10 54 -14 60 -18';
const tHead = 'M54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30Z';
const tLegs = 'M26 -2L24 8L36 8L36 -3M-30 -3L-34 7L-22 8L-20 -2';
const tTail = 'M-44 -8L-54 -4L-44 -2';
const tFace = 'M63 -41l11 -3M62 -25Q72 -16 83 -26M66 -32C66 -38 76 -38 76 -32C76 -26 66 -26 66 -32Z';
const eyeWhite = 'M66 -32C66 -38 76 -38 76 -32C76 -26 66 -26 66 -32Z';

// Duck (facing left, ground at 0,0) flapping both wings: quack!
const DT = 'translate(330 187) scale(0.9)';
const duck = 'M-12 -25C-22 -20 -24 -6 -14 -1C-4 3 12 2 19 -4C22 -8 23 -14 24 -21C19 -18 13 -19 7 -23';
const duckHead = 'M-16 -34C-16 -47 4 -47 4 -34C4 -26 -2 -23 -6 -23C-12 -23 -16 -27 -16 -34Z';
const bill = 'M-15 -39L-29 -39L-15 -34ZM-15 -32L-27 -28L-14 -29Z';
const dWing1 = 'M4 -14C0 -24 2 -38 12 -48C15 -44 19 -43 20 -39C24 -40 27 -36 25 -32C29 -31 29 -26 25 -24C22 -17 13 -12 4 -14Z';
const dWing2 = 'M14 -22C16 -32 22 -40 30 -44C32 -40 32 -36 30 -33C33 -32 33 -28 30 -26C26 -22 20 -20 14 -22Z';
const duckFace = 'M-10 -37Q-7 -41 -4 -37';

// Rabbit (facing left) hopping for joy
const RT = 'translate(370 160) scale(0.9)';
const rabbit = 'M10 -10C18 -16 18 -32 8 -38C0 -42 -10 -38 -12 -28C-14 -18 -8 -8 2 -8Z';
const rHead = oval(-10, -46, 10, 9);
const rEars = limb([[-14, -54, 7], [-17, -67, 8], [-19, -79, 5]]) + limb([[-7, -55, 7], [-5, -68, 8], [-3, -80, 5]]);
const rArm = limb([[-8, -30, 6], [-18, -36, 5], [-24, -46, 6]]);
const rFoot = limb([[6, -12, 9], [12, -4, 7], [20, 0, 6]]);
const rFace = 'M-15 -48Q-12 -52 -9 -48M-19 -42Q-16 -39 -13 -42';
const hops = 'M-4 22q6 -4 12 0M12 18q5 -3 10 0';

// Little mole popping out of a molehill, clapping
const MT = 'translate(322 268) scale(1.25)';
const molehill = 'M-28 8C-24 -6 -12 -12 0 -12C12 -12 24 -6 28 8';
const clods = 'M-20 4l3 -2M14 -2l3 2M22 4l2 -3';
const mole = 'M-13 -6C-15 -20 -9 -32 1 -32C11 -32 15 -20 13 -6';
const mNose = 'M-9 -24C-14 -26 -18 -26 -19 -23C-17 -20 -13 -20 -9 -20';
const mPaws = oval(-5, -13, 5, 4) + oval(4, -14, 5, 4);
const mFace = 'M-5 -25Q-3 -28 -1 -25M4 -25Q6 -28 8 -25';
const claps = 'M0 -21l0 -4M-11 -16l-4 -2M12 -17l4 -2';

// The hare, trudging up the slope behind (facing right, leaning forward, feet at y=0)
const HS = 'translate(66 250) rotate(-24)';
const hs = at(66, 250, -24, 1);
const back = 'M20 -68C2 -66 -18 -50 -22 -32C-24 -20 -18 -12 -8 -12';
const belly = 'M36 -56C32 -42 20 -26 4 -16';
const leg1 = limb([[4, -20, 13], [16, -28, 10], [26, -22, 9], [30, -10, 8], [38, -2, 8], [48, 0, 7]]);
const leg2 = limb([[-12, -20, 13], [-20, -10, 10], [-30, -4, 8], [-42, 0, 8], [-50, 0, 7]]);
const arm = limb([[32, -52, 8], [40, -40, 7], [44, -28, 7]]);
const tail = 'M-23 -36C-31 -38 -31 -28 -24 -27';
const ear1 = limb([[42, -84, 9], [30, -90, 10], [18, -88, 9], [10, -78, 7], [6, -66, 4]]);
const ear2 = limb([[47, -83, 9], [38, -93, 10], [26, -95, 9], [16, -89, 7], [10, -78, 4]]);
const innerEars = limb([[36, -88, 3], [26, -90, 4], [16, -84, 3], [11, -74, 2]]) + 'Z' + limb([[42, -89, 3], [32, -94, 4], [22, -92, 3], [15, -84, 2]]) + 'Z';
// his head as on the cover (centre 0,0), hanging low and tired
const HT = `${HS} translate(44 -70) rotate(24)`;
const ht = (x, y) => hs(...at(44, -70, 24, 1)(x, y));
const head = 'M-19 1C-19 -11 -5 -17 7 -13C17 -10 21 -3 19 3C15 11 3 15 -7 13C-15 11 -19 7 -19 1Z';
const tiredEye = 'M-1 -4C-1 -9 7 -9 7 -4C7 1 -1 1 -1 -4ZM-2 -5L8 -5';
const pant = 'M7 5Q11 10 16 6';
const tongue = 'M11 8C10 14 12 18 15 17C17 16 16 12 15 8';
const whiskers = 'M19 1l8 2M19 3l7 5';
const puffs = tp(oval(29, 4, 4.5, 3.6) + oval(37, -2, 3.6, 3) + oval(39, 9, 3, 2.6), ht);

// joy marks round the cheering crowd
const joy = 'M300 121l-3 -6M312 115l0 -7M324 119l3 -6M342 80l-4 -5M354 76l0 -7M366 78l4 -5M290 236l-6 -2M294 227l-4 -5M350 227l4 -5M354 236l6 -2';

export default {
  title: 'Hooray for Tortoise!',
  seed: 35,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 264C36 260 70 246 100 226C124 208 146 190 180 186C250 182 330 184 400 183L400 300L0 300Z' },
    { c: PAL.red, o: 0.85, d: 'M152 108C164 101 174 115 186 110C179 122 167 124 152 129Z' },
    // tortoise
    { c: PAL.green, o: 0.7, t: TT, d: 'M-40 -6C-38 -34 -20 -46 0 -46C22 -46 38 -32 40 -6Z' },
    { c: PAL.ochre, o: 0.6, t: TT, d: 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30ZM36 -16C46 -22 52 -26 58 -28L60 -18C52 -14 44 -10 38 -6ZM26 -2L24 8L36 8L36 -3ZM-30 -3L-34 7L-22 8L-20 -2Z' },
    { c: PAL.rose, o: 0.5, t: TT, d: oval(63, -24, 4, 3) },
    // duck
    { c: PAL.ochre, o: 0.62, t: DT, d: duck + 'C2 -26 4 -30 4 -34C4 -47 -16 -47 -16 -34C-16 -30 -14 -27 -12 -25Z' + dWing2 },
    { c: PAL.ochre, o: 0.5, t: DT, d: dWing1 },
    { c: PAL.terracotta, o: 0.8, t: DT, d: bill },
    // rabbit
    { c: PAL.ochre, o: 0.45, t: RT, d: rabbit + rHead + rEars + 'Z' + rArm + 'Z' + rFoot + 'Z' },
    { c: PAL.grey, o: 0.45, t: RT, d: rabbit + rHead + rEars + 'Z' + rArm + 'Z' + rFoot + 'Z' },
    { c: PAL.rose, o: 0.6, t: RT, d: limb([[-15, -58, 3], [-17, -67, 4], [-18, -75, 2]]) + 'Z' + limb([[-7, -58, 3], [-5, -68, 4], [-4, -75, 2]]) + 'Z' + oval(-20, -44, 2) },
    // mole and molehill
    { c: PAL.terracotta, o: 0.55, t: MT, d: molehill + 'L-28 10L28 10Z' },
    { c: PAL.slate, o: 0.5, t: MT, d: mole + 'C10 -4 -10 -4 -13 -6Z' },
    { c: PAL.rose, o: 0.8, t: MT, d: mNose + 'Z' + mPaws },
    // hare
    { c: PAL.grey, o: 0.6, t: HS, d: `M20 -68C2 -66 -18 -50 -22 -32C-24 -20 -18 -12 -8 -12C-2 -14 0 -16 4 -16C20 -26 32 -42 36 -56C34 -64 28 -68 20 -68Z${leg1}Z${leg2}Z${arm}Z${ear1}Z${ear2}Z` },
    { c: PAL.grey, o: 0.6, t: HT, d: head },
    { c: PAL.rose, o: 0.55, t: HS, d: innerEars },
    { c: PAL.rose, o: 0.8, t: HT, d: 'M19 1C21 -1 23 1 21 4Z' + tongue + 'Z' },
    { c: PAL.sky, o: 0.8, d: 'M60 140C57 134 61 131 63 136C65 140 61 143 60 140ZM48 152C45 146 49 143 51 148C53 152 49 155 48 152Z' },
  ],
  whites: tp(eyeWhite, T) + tp('M-1 -5C-1 -5 7 -5 7 -5C7 1 -1 1 -1 -5Z', ht) + tp(oval(16, -22, 4), at(370, 160, 0, 0.9)) + tp('M32 -52C28 -40 20 -28 8 -20C10 -34 20 -46 32 -52Z', hs),
  lines:
    paths([hill, flag]) +
    paths([shell, neck, tHead, tLegs, tTail], TT) +
    paths([duck, duckHead, dWing2, dWing1], DT) +
    paths([rabbit, rHead, rEars, rArm, rFoot], RT) +
    paths([molehill, mole], MT) +
    paths([back, belly, leg1, leg2, arm, tail, ear1, ear2], HS) +
    paths([head], HT),
  fine:
    paths([
      joy,
      hatch(10, 280, 120, 278, 9, 6, 160, 6),
      hatch(200, 208, 290, 206, 8, 6, 160, 7),
      hatch(200, 286, 390, 284, 10, 6, 160, 8),
      tufts([[30, 266], [196, 189], [290, 188], [392, 187]], 9, 9),
    ]) +
    paths([shellRim, plates, tFace], TT) +
    paths([bill, duckFace, 'M10 -30q4 -4 8 -4M8 -22q5 -3 10 -2'], DT) +
    paths([rFace, hops], RT) +
    paths([clods, mNose, mPaws, mFace, claps], MT) +
    paths([tiredEye, pant, tongue, whiskers], HT) +
    paths([puffs]),
  fills: `<circle cx="73" cy="-33" r="2.6" transform="${TT}"/><circle cx="4" cy="-3" r="1.8" transform="${HT}"/>`,
  glints: `<circle cx="72.2" cy="-34" r="0.9" transform="${TT}"/>`,
};
