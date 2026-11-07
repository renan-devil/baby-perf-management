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
const hill = 'M0 266C40 262 80 248 112 232C134 220 152 210 182 207C250 204 330 206 400 205';

// The red flag, just behind Tortoise now
const flag = 'M152 211L152 124M152 126C164 119 174 133 186 128C179 140 167 142 152 147';

// Tortoise from the cover, past the flag, smiling at her friends
const TT = 'translate(214 205) scale(0.96)';
const T = at(214, 205, 0, 0.96);
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
const DT = 'translate(334 206)';
const duck = 'M-12 -25C-22 -20 -24 -6 -14 -1C-4 3 12 2 19 -4C22 -8 23 -14 24 -21C19 -18 13 -19 7 -23';
const duckHead = 'M-16 -34C-16 -47 4 -47 4 -34C4 -26 -2 -23 -6 -23C-12 -23 -16 -27 -16 -34Z';
const bill = 'M-15 -39L-29 -39L-15 -34ZM-15 -32L-27 -28L-14 -29Z';
const dWing1 = limb([[2, -16, 10], [6, -30, 9], [8, -44, 7], [6, -54, 4]]);
const dWing2 = limb([[12, -18, 9], [20, -30, 8], [26, -42, 6], [28, -50, 4]]);
const duckFace = 'M-10 -37Q-7 -41 -4 -37';

// Rabbit (facing left) hopping for joy
const RT = 'translate(378 192)';
const rabbit = 'M10 -10C18 -16 18 -32 8 -38C0 -42 -10 -38 -12 -28C-14 -18 -8 -8 2 -8Z';
const rHead = oval(-10, -46, 10, 9);
const rEars = limb([[-14, -54, 7], [-17, -67, 8], [-19, -79, 5]]) + limb([[-7, -55, 7], [-5, -68, 8], [-3, -80, 5]]);
const rArm = limb([[-8, -30, 6], [-18, -36, 5], [-24, -46, 6]]);
const rFoot = limb([[6, -12, 9], [12, -4, 7], [20, 0, 6]]);
const rFace = 'M-15 -48Q-12 -52 -9 -48M-19 -42Q-16 -39 -13 -42';
const hops = 'M-6 14q6 -4 12 0M10 10q5 -3 10 0';

// Little mole popping out of a molehill, clapping
const MT = 'translate(322 266)';
const molehill = 'M-28 8C-24 -6 -12 -12 0 -12C12 -12 24 -6 28 8';
const clods = 'M-20 4l3 -2M14 -2l3 2M22 4l2 -3';
const mole = 'M-13 -6C-15 -20 -9 -32 1 -32C11 -32 15 -20 13 -6';
const mNose = 'M-9 -24C-14 -26 -18 -26 -19 -23C-17 -20 -13 -20 -9 -20';
const mPaws = oval(-5, -13, 5, 4) + oval(4, -14, 5, 4);
const mFace = 'M-4 -26Q-2 -28 0 -26M4 -26Q6 -28 8 -26';
const claps = 'M-1 -24l-1 -5M-8 -21l-4 -3M9 -21l4 -3';

// The hare, trudging up the slope behind (facing right, feet at y=0)
const HS = 'translate(70 247) rotate(-16)';
const hs = at(70, 247, -16, 1);
const back = 'M2 -68C-14 -62 -26 -44 -26 -28C-26 -18 -20 -12 -12 -12';
const belly = 'M18 -54C18 -40 10 -24 -2 -16';
const leg1 = limb([[-6, -18, 13], [4, -10, 10], [12, -4, 8], [22, -2, 8], [32, -2, 7]]);
const leg2 = limb([[-18, -20, 13], [-26, -10, 10], [-32, -2, 8], [-44, 0, 8], [-52, 0, 7]]);
const arm = limb([[12, -54, 8], [18, -42, 7], [20, -30, 7]]);
const tail = 'M-25 -36C-33 -38 -33 -28 -26 -27';
const ear1 = limb([[12, -88, 9], [2, -93, 10], [-8, -89, 9], [-15, -79, 7], [-18, -67, 4]]);
const ear2 = limb([[17, -88, 9], [9, -97, 10], [-3, -98, 9], [-13, -91, 7], [-19, -81, 4]]);
const innerEars = limb([[6, -91, 3], [-4, -92, 4], [-11, -85, 3], [-15, -76, 2]]) + 'Z' + limb([[10, -94, 3], [0, -98, 4], [-9, -94, 3], [-15, -86, 2]]) + 'Z';
// his head as on the cover (centre 0,0), hanging low
const HT = `${HS} translate(22 -76) rotate(14)`;
const ht = (x, y) => hs(...at(22, -76, 14, 1)(x, y));
const head = 'M-19 1C-19 -11 -5 -17 7 -13C17 -10 21 -3 19 3C15 11 3 15 -7 13C-15 11 -19 7 -19 1Z';
const tiredEye = 'M-1 -4C-1 -9 7 -9 7 -4C7 1 -1 1 -1 -4ZM-2 -5L8 -5';
const pant = 'M8 6C11 9 15 9 17 6';
const tongue = 'M11 8C10 13 12 17 15 16C17 15 16 11 15 8';
const whiskers = 'M19 1l8 2M19 3l7 5';
const puffs = oval(132, 168, 5, 4) + oval(143, 160, 4, 3.4) + oval(150, 170, 3.4, 3);

// joy marks round the cheering crowd
const joy = 'M300 136l-3 -6M312 130l0 -7M324 134l3 -6M356 112l-4 -5M368 108l0 -7M380 110l4 -5M300 236l-6 -2M304 228l-4 -5M344 228l4 -5M348 236l6 -2';

export default {
  title: 'Hooray for Tortoise!',
  seed: 35,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 262C40 258 80 244 112 228C134 216 152 206 182 203C250 200 330 202 400 201L400 300L0 300Z' },
    { c: PAL.red, o: 0.85, d: 'M152 126C164 119 174 133 186 128C179 140 167 142 152 147Z' },
    // tortoise
    { c: PAL.green, o: 0.7, t: TT, d: 'M-40 -6C-38 -34 -20 -46 0 -46C22 -46 38 -32 40 -6Z' },
    { c: PAL.ochre, o: 0.6, t: TT, d: 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30ZM36 -16C46 -22 52 -26 58 -28L60 -18C52 -14 44 -10 38 -6ZM26 -2L24 8L36 8L36 -3ZM-30 -3L-34 7L-22 8L-20 -2Z' },
    { c: PAL.rose, o: 0.5, t: TT, d: oval(63, -24, 4, 3) },
    // duck
    { c: PAL.ochre, o: 0.62, t: DT, d: duck + 'C2 -26 4 -30 4 -34C4 -47 -16 -47 -16 -34C-16 -30 -14 -27 -12 -25Z' + dWing1 + 'Z' + dWing2 + 'Z' },
    { c: PAL.terracotta, o: 0.8, t: DT, d: bill },
    // rabbit
    { c: PAL.terracotta, o: 0.45, t: RT, d: rabbit + rHead + rEars + 'Z' + rArm + 'Z' + rFoot + 'Z' },
    { c: PAL.rose, o: 0.6, t: RT, d: limb([[-15, -58, 3], [-17, -67, 4], [-18, -75, 2]]) + 'Z' + limb([[-7, -58, 3], [-5, -68, 4], [-4, -75, 2]]) + 'Z' + oval(-20, -44, 2) },
    // mole and molehill
    { c: PAL.terracotta, o: 0.55, t: MT, d: molehill + 'L-28 10L28 10Z' },
    { c: PAL.slate, o: 0.7, t: MT, d: mole + 'C10 -4 -10 -4 -13 -6Z' },
    { c: PAL.rose, o: 0.8, t: MT, d: mNose + 'Z' + mPaws },
    // hare
    { c: PAL.grey, o: 0.6, t: HS, d: `M2 -68C-14 -62 -26 -44 -26 -28C-26 -18 -20 -12 -12 -12C-6 -14 0 -16 2 -16C10 -24 18 -40 18 -54C16 -62 10 -68 2 -68Z${leg1}Z${leg2}Z${arm}Z${ear1}Z${ear2}Z` },
    { c: PAL.grey, o: 0.6, t: HT, d: head },
    { c: PAL.rose, o: 0.55, t: HS, d: innerEars },
    { c: PAL.rose, o: 0.8, t: HT, d: 'M19 1C21 -1 23 1 21 4Z' + tongue + 'Z' },
    { c: PAL.sky, o: 0.8, d: 'M58 150C55 144 59 141 61 146C63 150 59 153 58 150ZM48 162C45 156 49 153 51 158C53 162 49 165 48 162Z' },
  ],
  whites: tp(eyeWhite, T) + tp('M-1 -4C-1 -9 7 -9 7 -4C7 1 -1 1 -1 -4Z', ht) + tp(oval(16, -22, 4), (x, y) => at(378, 192, 0, 1)(x, y)) + tp('M14 -50C16 -38 10 -26 2 -20C2 -32 6 -44 14 -50Z', hs),
  lines:
    paths([hill, flag]) +
    paths([shell, neck, tHead, tLegs, tTail], TT) +
    paths([duck, duckHead, dWing1, dWing2], DT) +
    paths([rabbit, rHead, rEars, rArm, rFoot], RT) +
    paths([molehill, mole], MT) +
    paths([back, belly, leg1, leg2, arm, tail, ear1, ear2], HS) +
    paths([head], HT),
  fine:
    paths([
      joy,
      puffs,
      hatch(10, 280, 120, 278, 9, 6, 160, 6),
      hatch(200, 226, 290, 224, 8, 6, 160, 7),
      hatch(200, 286, 390, 284, 10, 6, 160, 8),
      tufts([[30, 266], [196, 206], [290, 206], [392, 205]], 9, 9),
    ]) +
    paths([shellRim, plates, tFace], TT) +
    paths([bill, duckFace], DT) +
    paths([rFace, hops], RT) +
    paths([clods, mNose, mPaws, mFace, claps], MT) +
    paths([tiredEye, pant, tongue, whiskers], HT),
  fills: `<circle cx="73" cy="-33" r="2.6" transform="${TT}"/><circle cx="4" cy="-3" r="1.8" transform="${HT}"/>`,
  glints: `<circle cx="72.2" cy="-34" r="0.9" transform="${TT}"/>`,
};
