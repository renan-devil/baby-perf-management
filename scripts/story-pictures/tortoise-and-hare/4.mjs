import { PAL, hatch, paths, tufts } from '../lib.mjs';

// The Tortoise and the Hare, 4: Hare wakes with a jump under his oak, ears straight up in fright.
// Far away at the top of the hill, a tiny Tortoise is already beside the red flag.
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
// Short strokes radiating round (cx, cy) at the given angles (degrees): shock marks.
const burst = (cx, cy, r1, r2, angles) =>
  angles
    .map((a) => {
      const c = Math.cos((a * Math.PI) / 180);
      const s = Math.sin((a * Math.PI) / 180);
      return `M${f(cx + c * r1)} ${f(cy + s * r1)}L${f(cx + c * r2)} ${f(cy + s * r2)}`;
    })
    .join('');

const ground = 'M0 258C80 256 160 260 230 258C300 256 360 259 400 258';

// The old oak from the cover, crown drawn a little smaller
const CT = 'translate(-3 -1) scale(0.85 0.95)';
const crown =
  'M24 118C6 104 14 72 40 68C44 42 80 30 100 46C124 36 150 56 140 80C160 92 152 124 126 124C112 136 84 134 72 128C54 138 32 132 24 118Z';
const trunk = 'M30 258C36 226 32 184 42 132M66 258C58 226 62 186 58 132M30 258C38 262 58 262 66 258';
const branches = 'M44 140C34 126 22 118 12 112M56 136C68 122 82 114 94 110M50 130L50 108';
const bark = 'M40 196c3 6 3 12 0 18M52 168c-3 6-3 12 0 16M46 232c2 4 2 8 0 12';

// The distant hill, the red flag and a tiny Tortoise right beside it
const hill = 'M214 248C250 238 280 200 300 160C312 136 324 122 344 118C362 115 384 116 400 118';
const flag = 'M373 117L373 74M373 76C380 72 386 80 393 77C389 85 381 87 373 90';
const TT = 'translate(335.6 118.4) rotate(-17) scale(0.42)';
const shell = 'M-42 -6C-40 -36 -20 -48 0 -48C22 -48 40 -34 42 -6Z';
const neck = 'M36 -16C44 -22 52 -26 58 -28M38 -6C46 -10 54 -14 60 -18';
const tHead = 'M54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30Z';
const tLegs = 'M26 -2L24 8L36 8L36 -3M-30 -3L-34 7L-22 8L-20 -2';
const trail = 'M226 250C254 242 278 212 294 182C304 162 312 146 320 134';

// The hare sitting bolt upright (ground at y=0, facing right), drawn a little bigger than on the cover
const HS = 'translate(160 243) scale(1.25)';
const hs = at(160, 243, 0, 1.25);
const back = 'M-2 -74C-16 -68 -26 -44 -25 -22C-24 -8 -18 -1 -8 0';
const front = 'M17 -74C23 -62 22 -44 17 -30';
const haunch = 'M-20 -12C-22 -28 -8 -36 2 -28C8 -22 8 -10 3 -3';
const foot = 'M-8 0L34 0C40 0 40 -7 33 -8L6 -8';
const arm1 = limb([[16, -52, 8], [28, -54, 7], [40, -60, 8]]);
const arm2 = limb([[11, -58, 7], [20, -64, 6], [30, -72, 7]]);
const fingers = 'M44 -64l4 -3M45 -60l5 0M34 -77l2 -4M36 -74l4 -2';
const tail = 'M-24 -18C-32 -20 -32 -10 -25 -9';
const ear1 = limb([[-6, -100, 9], [-8, -118, 10], [-9, -136, 8], [-8, -151, 4]]);
const ear2 = limb([[4, -102, 9], [6, -120, 10], [9, -138, 8], [11, -152, 4]]);
const innerEars = limb([[-7, -106, 3], [-8, -119, 4], [-9, -135, 3], [-8, -145, 2]]) + 'Z' + limb([[4, -108, 3], [6, -121, 4], [9, -137, 3], [10, -146, 2]]) + 'Z';
const hopMarks = 'M-22 6q5 -3 10 0M6 6q5 -3 10 0M24 6q5 -3 10 0M-30 2l-5 2M40 2l5 2';
const fur = 'M-18 -64l-5 -4M-22 -54l-6 -2M-24 -42l-6 0';
// his head as on the cover (centre 0,0), tipped up towards the hill
const HT = `${HS} translate(10 -88) rotate(-10) scale(1.1)`;
const ht = (x, y) => hs(...at(10, -88, -10, 1.1)(x, y));
const head = 'M-19 1C-19 -11 -5 -17 7 -13C17 -10 21 -3 19 3C15 11 3 15 -7 13C-15 11 -19 7 -19 1Z';
const eye = 'M-2 -4C-2 -12 10 -12 10 -4C10 4 -2 4 -2 -4Z';
const oMouth = 'M11 8C11 4 16 4 16 8C16 12 11 12 11 8Z';
const whiskers = 'M19 1l11 -3M19 3l11 2M18 -1l9 -6';
const shock = burst(173, 133, 42, 52, [-178, -155, -134, -58, -38, -18, 2]);

export default {
  title: 'Hare wakes up with a jump',
  seed: 34,
  washes: [
    { c: PAL.green, o: 0.28, d: 'M200 258L214 248C250 238 280 200 300 160C312 136 324 122 344 118C362 115 384 116 400 118L400 258Z' },
    { c: PAL.green, o: 0.38, d: 'M0 254C80 252 160 256 230 254C300 252 360 255 400 254L400 300L0 300Z' },
    // oak
    { c: PAL.green, o: 0.68, t: CT, d: 'M22 114C8 100 18 74 42 72C48 48 80 38 98 52C122 42 146 60 136 82C154 94 146 120 124 120C110 130 84 128 72 122C56 130 34 126 22 114Z' },
    { c: PAL.green, o: 0.35, t: CT, d: 'M60 110C70 96 96 92 112 100C124 108 118 120 104 122C90 124 70 122 60 110Z' },
    { c: PAL.ochre, o: 0.55, d: 'M32 256C38 226 34 184 43 134L57 134C60 186 58 226 64 256Z' },
    // far away: the flag and Tortoise
    { c: PAL.red, o: 0.85, d: 'M373 76C380 72 386 80 393 77C389 85 381 87 373 90Z' },
    { c: PAL.green, o: 0.8, t: TT, d: 'M-40 -6C-38 -34 -20 -46 0 -46C22 -46 38 -32 40 -6Z' },
    { c: PAL.ochre, o: 0.7, t: TT, d: 'M-12 -36L10 -36L18 -22L8 -10L-10 -10L-18 -22ZM54 -30C56 -42 76 -44 82 -34C86 -26 78 -18 68 -18C60 -18 53 -22 54 -30ZM36 -16C46 -22 52 -26 58 -28L60 -18C52 -14 44 -10 38 -6Z' },
    // hare
    { c: PAL.grey, o: 0.3, d: 'M128 260C128 254 212 254 212 260C212 265 128 265 128 260Z' },
    { c: PAL.grey, o: 0.6, t: HS, d: `M-2 -74C-16 -68 -26 -44 -25 -22C-24 -8 -18 -1 -8 0L34 0C40 0 40 -7 33 -8L16 -8C20 -20 23 -44 22 -58C21 -66 19 -71 17 -74Z${ear1}Z${ear2}Z${arm1}Z${arm2}Z` },
    { c: PAL.grey, o: 0.6, t: HT, d: head },
    { c: PAL.rose, o: 0.55, t: HS, d: innerEars },
    { c: PAL.rose, o: 0.8, t: HT, d: 'M19 1C21 -1 23 1 21 4Z' },
    { c: PAL.red, o: 0.6, t: HT, d: oMouth },
    // a drop or two of fright
    { c: PAL.sky, o: 0.8, d: 'M140 112C137 106 141 103 143 108C145 112 141 115 140 112ZM132 126C129 120 133 117 135 122C137 126 133 129 132 126Z' },
  ],
  whites: tp(eye, ht) + tp('M15 -64C21 -52 20 -40 16 -32C10 -38 9 -54 15 -64Z', hs),
  lines:
    paths([ground, trunk, branches]) +
    paths([crown], CT) +
    paths([shell, tHead], TT) +
    paths([back, front, haunch, foot, arm1, arm2, tail, ear1, ear2], HS) +
    paths([head], HT),
  fine:
    paths([
      bark,
      hill,
      flag,
      shock,
      'M96 270l-4 0',
      hatch(70, 274, 180, 274, 9, 6, 160, 6),
      hatch(230, 274, 390, 272, 10, 6, 160, 7),
      hatch(300, 200, 390, 140, 8, 6, 150, 8),
      tufts([[100, 258], [222, 258], [380, 258], [16, 258]], 9, 9),
      tufts([[302, 160], [390, 118]], 5, 4),
    ]) +
    paths(['M52 60c3-5 8-5 10 0M96 54c3-5 8-5 10 0M124 70c3-5 8-5 10 0', hatch(108, 84, 134, 114, 7, 9, 125, 11), hatch(30, 104, 62, 122, 5, 8, 125, 12)], CT) +
    paths([neck, tLegs], TT) +
    paths([hopMarks, fingers, fur], HS) +
    paths([eye, oMouth, whiskers], HT),
  once: `<path d="${trail}" stroke-dasharray="0.1 7" stroke-width="2"/>`,
  fills: `<circle cx="6" cy="-6" r="1.8" transform="${HT}"/><circle cx="74" cy="-32" r="5" transform="${TT}"/>`,
};
