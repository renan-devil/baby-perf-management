import { PAL, hatch, paths, rays, tufts } from '../lib.mjs';

// The Tortoise and the Hare, 3: "GO!" Hare shoots off like an arrow in a puff of dust, while Tortoise
// lifts one foot over the starting line Owl scratched in the dust. Owl watches from her post.
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

// The whole scene sits 15 higher than the cover's ground line; UP lifts the paths drawn in place.
const UP = 'translate(0 -15)';
const ground = 'M0 251C80 248 160 253 240 251C310 249 360 252 400 250';

// The starting line Owl scratched in the dust, running towards us from the foot of her post
const startLine = 'M70 251C68 262 65 274 61 289';
const scratches = 'M75 254C73 264 71 274 68 285M64 259l-6 1M62 269l-6 1M60 279l-5 1M81 262l4 -1M79 274l4 -1';

// Tortoise from the cover, just over the line, front foot lifted for her very first step
const TT = 'translate(128 232)';
const T = at(128, 232, 0, 1);
const shell = 'M-42 -6C-40 -36 -20 -48 0 -48C22 -48 40 -34 42 -6Z';
const shellRim = 'M-46 -5C-20 2 20 2 46 -5';
const plates = 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM-12 -36L-18 -45M10 -36L16 -45M18 -22L38 -24M8 -10L14 -4M-10 -10L-16 -4M-18 -22L-38 -24';
const neck = 'M36 -16C44 -22 52 -26 58 -28M38 -6C46 -10 54 -14 60 -18';
const tHead = 'M54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30Z';
const frontLeg = 'M27 -5C32 -3 38 -2 46 -3C49 -4 49 -9 46 -10C41 -11 37 -11 35 -13';
const backLeg = 'M-30 -3L-34 7L-22 8L-20 -2';
const tTail = 'M-44 -8L-54 -4L-44 -2';
const tFace = 'M64 -43l10 3M64 -25Q72 -19 82 -26M66 -32C66 -38 76 -38 76 -32C76 -26 66 -26 66 -32Z';
const eyeWhite = 'M66 -32C66 -38 76 -38 76 -32C76 -26 66 -26 66 -32Z';
const stepMarks = 'M33 3q7 4 15 0M54 -5q4 -3 3 -8';

// Owl on her post (post top at 0,0), waving the twig she drew the line with: GO!
const OT = 'translate(42 203) scale(1.1)';
const O = at(42, 203, 0, 1.1);
const post = 'M-5 1L-5 30M5 1L5 30M-7 1L7 1';
const owl = 'M-14 -4C-17 -18 -12 -34 0 -34C12 -34 17 -18 14 -4C12 1 -12 1 -14 -4Z';
const tufts2 = 'M-10 -31L-13 -41L-4 -34M10 -31L13 -41L4 -34';
const owlWing = limb([[12, -16, 9], [19, -26, 8], [25, -37, 6], [28, -44, 4]]);
const twig = 'M26 -42L40 -64M35 -56l6 -2M31 -50l-5 -4';
const burst = rays(87, 146, 8, 15, 7, 5, -20);
const owlSide = 'M-13 -18C-18 -12 -17 -5 -12 -2';
const owlEyes = 'M-11 -23C-11 -30 -1 -30 -1 -23C-1 -16 -11 -16 -11 -23ZM1 -23C1 -30 11 -30 11 -23C11 -16 1 -16 1 -23Z';
const owlMarks = 'M-2 -18L0 -13L2 -18M-6 -9l2 2l2 -2M2 -9l2 2l2 -2M-4 -1l0 3M-1 -1l0 3M2 -1l0 3M-2 10l3 4M1 20l-2 4';

// The hare, stretched out like an arrow in a long bound (body centre 0,0, facing right)
const HS = 'translate(320 163) rotate(-7) scale(1.05)';
const hs = at(320, 163, -7, 1.05);
const body = 'M28 -6C18 -14 0 -16 -18 -14C-30 -12 -38 -6 -36 2C-34 8 -26 10 -16 10C0 10 16 8 24 4';
const hindLeg1 = limb([[-26, 4, 15], [-44, 9, 11], [-64, 12, 8], [-84, 13, 8]]);
const hindLeg2 = limb([[-20, 8, 12], [-36, 16, 9], [-54, 22, 8], [-72, 25, 8]]);
const foreLeg1 = limb([[22, 2, 9], [36, 9, 8], [52, 13, 7], [62, 13, 7]]);
const foreLeg2 = limb([[16, 6, 8], [28, 14, 7], [42, 20, 6], [52, 22, 6]]);
const tail = 'M-34 -7C-42 -12 -45 -3 -38 0';
const ear1 = limb([[30, -18, 8], [16, -24, 9], [0, -27, 8], [-14, -29, 5]]);
const ear2 = limb([[35, -19, 8], [24, -29, 9], [10, -35, 8], [-3, -39, 5]]);
const innerEars = limb([[26, -21, 3], [14, -25, 4], [0, -27, 3], [-10, -28, 2]]) + 'Z' + limb([[31, -24, 3], [22, -30, 4], [10, -34, 3], [0, -37, 2]]) + 'Z';
// his head as on the cover (centre 0,0), dipped forward
const HT = `${HS} translate(42 -6) rotate(8)`;
const ht = (x, y) => hs(...at(42, -6, 8, 1)(x, y));
const head = 'M-19 1C-19 -11 -5 -17 7 -13C17 -10 21 -3 19 3C15 11 3 15 -7 13C-15 11 -19 7 -19 1Z';
const hareEye = 'M-1 -4C-1 -9 7 -9 7 -4C7 1 -1 1 -1 -4Z';
const grin = 'M7 5Q12 9 17 4';
const whiskers = 'M19 1l9 -3M19 4l9 2';

// speed lines and a puff of dust where he pushed off
const speed = 'M226 194L254 191M222 206L250 203M232 218L250 216M236 182L258 180';
const dust =
  'M240 250C232 251 228 244 234 240C231 233 239 228 245 233C247 226 257 225 260 232C266 229 274 234 271 241C277 243 276 250 269 250Z' +
  'M220 247C215 248 214 241 219 240C219 235 226 235 227 240C231 240 231 247 226 247ZM208 239C204 239 204 234 208 234C209 230 215 231 215 235C218 236 216 240 212 240Z';
const pebbles = 'M200 250l-4 -2M248 222l-2 -3M280 246l4 -3';

export default {
  title: 'Ready, steady, GO!',
  seed: 33,
  washes: [
    { c: PAL.green, o: 0.38, t: UP, d: 'M0 247C80 244 160 249 240 247C310 245 360 248 400 246L400 316L0 316Z' },
    { c: PAL.ochre, o: 0.35, t: UP, d: 'M30 252C60 250 90 252 110 254C106 266 98 280 86 292C66 294 48 290 38 284C44 272 42 262 30 252Z' },
    // tortoise
    { c: PAL.green, o: 0.7, t: TT, d: 'M-40 -6C-38 -34 -20 -46 0 -46C22 -46 38 -32 40 -6Z' },
    { c: PAL.ochre, o: 0.6, t: TT, d: `M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30ZM36 -16C46 -22 52 -26 58 -28L60 -18C52 -14 44 -10 38 -6Z${frontLeg}Z${backLeg}Z` },
    // owl and post
    { c: PAL.terracotta, o: 0.5, t: OT, d: owl + owlWing + 'Z' },
    { c: PAL.ochre, o: 0.55, t: OT, d: 'M-14 -26C-14 -32 -2 -32 0 -26C2 -32 14 -32 14 -26C14 -16 -14 -16 -14 -26ZM-2 -18L0 -13L2 -18Z' },
    { c: PAL.ochre, o: 0.6, t: OT, d: 'M-5 1L5 1L5 30L-5 30Z' },
    // hare
    { c: PAL.grey, o: 0.6, t: HS, d: `M28 -6C18 -14 0 -16 -18 -14C-30 -12 -38 -6 -36 2C-34 8 -26 10 -16 10C0 10 16 8 24 4Z${hindLeg1}Z${hindLeg2}Z${foreLeg1}Z${foreLeg2}Z${ear1}Z${ear2}Z` },
    { c: PAL.grey, o: 0.6, t: HT, d: head },
    { c: PAL.rose, o: 0.55, t: HS, d: innerEars },
    { c: PAL.rose, o: 0.8, t: HT, d: 'M19 1C21 -1 23 1 21 4Z' },
    // dust
    { c: PAL.grey, o: 0.28, t: UP, d: dust },
  ],
  whites: tp(eyeWhite, T) + tp(owlEyes, O) + tp(hareEye, ht) + tp('M-30 2C-20 6 0 6 16 4C4 10 -20 10 -30 2Z', hs),
  lines:
    paths([ground, startLine], UP) +
    paths([shell, neck, tHead, frontLeg, backLeg, tTail], TT) +
    paths([post, owl, owlWing, twig], OT) +
    paths([body, hindLeg1, hindLeg2, foreLeg1, foreLeg2, tail, ear1, ear2], HS) +
    paths([head], HT),
  fine:
    paths([
      scratches,
      speed,
      dust,
      pebbles,
      hatch(110, 272, 200, 272, 8, 6, 160, 6),
      hatch(220, 272, 390, 270, 10, 6, 160, 7),
      hatch(130, 294, 330, 294, 11, 6, 160, 5),
      tufts([[14, 251], [196, 252], [300, 251], [376, 250]], 9, 9),
      burst,
    ], UP) +
    paths([shellRim, plates, tFace, stepMarks], TT) +
    paths([tufts2, owlSide, owlEyes, owlMarks], OT) +
    paths([hareEye, grin, whiskers], HT),
  fills:
    `<circle cx="74" cy="-32.5" r="2.5" transform="${TT}"/>` +
    `<circle cx="-4" cy="-22.5" r="2.4" transform="${OT}"/><circle cx="8" cy="-22.5" r="2.4" transform="${OT}"/>` +
    `<circle cx="5" cy="-4" r="2" transform="${HT}"/>`,
  glints:
    `<circle cx="73.2" cy="-33.5" r="0.8" transform="${TT}"/>` +
    `<circle cx="-4.6" cy="-23.4" r="0.7" transform="${OT}"/><circle cx="7.4" cy="-23.4" r="0.7" transform="${OT}"/>`,
};
