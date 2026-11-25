import { PAL, paths, transformPath, tufts } from '../lib.mjs';

// The Fox and the Goat, 1 (cover): the red fox has fallen into a deep stone well. Seen cut away, he
// sits in the water up to his tummy at the bottom and looks up at the round patch of sky far above.
const f = (n) => Math.round(n * 10) / 10;

/** A smooth limb (leg, horn) along a centreline of [x, y, width] points, open at the root. */
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

// ---- The well (shared with picture 2): shaft from x 120 to 280, stone walls 22 wide, ground at
// y 62, a low stone parapet above it, water from y 236.
export const WATER = 236;
export const ground = 'M18 63C40 61 70 63 98 62M302 62C330 63 360 61 384 63';
export const walls =
  'M98 62L98 280M120 62L120 274M280 62L280 274M302 62L302 280' +
  'M92 62L92 44L126 44L126 62M274 62L274 44L308 44L308 62M90 62L128 62M272 62L310 62' +
  'M98 280C150 288 250 288 302 280M120 274C170 279 230 279 280 274';
function stones() {
  let d = 'M92 53L126 53M109 44L109 53M100 53L100 62M118 53L118 62M274 53L308 53M291 44L291 53M282 53L282 62M300 53L300 62';
  for (const [a, b] of [[98, 120], [280, 302]]) {
    for (let y = 80, k = 0; y < 274; y += 18, k++) {
      d += `M${a} ${y}L${b} ${y + (k % 2 ? 1 : -1)}`;
      const x = a + (k % 2 ? 8 : 14) + (a > 200 ? 2 : 0);
      d += `M${x} ${y}L${x} ${y + 18}`;
    }
  }
  return d;
}
export const wellStones = stones();
export const waterLine = 'M120 236c10 -3 20 3 30 0s20 3 30 0s20 3 30 0s20 3 30 0s20 3 30 0s20 3 10 0';
export const wellWashes = [
  // a round patch of sky over the opening
  { c: PAL.sky, o: 0.55, d: 'M110 46C112 20 150 6 200 6C252 6 290 20 290 46C290 58 250 62 200 62C150 62 110 58 110 46Z' },
  // earth around the shaft, fading out
  { c: PAL.ochre, o: 0.28, d: 'M60 64C80 62 96 63 98 64L98 282C80 286 66 276 62 250C58 200 66 120 60 64ZM302 64C320 62 336 63 340 64C334 120 342 200 338 250C334 276 320 286 302 282Z' },
  { c: PAL.green, o: 0.45, d: 'M20 62C50 58 80 58 92 60L92 66C70 68 40 68 20 66ZM308 60C330 58 360 58 382 62L382 66C360 68 330 68 308 66Z' },
  // stone walls and parapet
  { c: PAL.grey, o: 0.55, d: 'M98 62L120 62L120 274L98 280ZM280 62L302 62L302 280L280 274ZM92 44L126 44L126 62L92 62ZM274 44L308 44L308 62L274 62Z' },
  { c: PAL.slate, o: 0.18, d: 'M120 62L280 62L280 236L120 236Z' },
  // water
  { c: PAL.sky, o: 0.7, d: 'M120 236c10 -3 20 3 30 0s20 3 30 0s20 3 30 0s20 3 30 0s20 3 30 0s20 3 10 0L280 274C230 279 170 279 120 274Z' },
];
export const wellFine = [
  wellStones,
  tufts([[30, 63], [66, 62], [334, 62], [372, 63]], 9, 4),
  'M140 254c8 -2 14 2 20 0M216 262c8 -2 14 2 20 0M246 250c6 -2 10 2 16 0',
];

// ---- The fox (shared with picture 2). Head drawn around (0,0) = back of his skull, facing right.
export const foxHead = 'M-14 6C-18 -6 -10 -16 2 -16C10 -16 16 -12 22 -8C30 -4 38 -1 42 2C40 7 30 9 20 11C8 15 -8 15 -14 6Z';
export const foxEars = 'M-11 -11C-15 -20 -17 -28 -15 -37C-8 -31 -4 -23 -2 -16M1 -16C3 -24 7 -32 13 -37C13 -28 12 -20 10 -13';
export const foxInnerEars = 'M-11 -15C-12 -22 -13 -27 -13 -32C-9 -27 -7 -22 -6 -17ZM4 -17C6 -23 8 -28 11 -32C11 -26 10 -21 9 -16Z';
export const foxCheek = 'M-12 7C0 13 18 12 32 7C22 14 -2 17 -12 7Z';
export const foxFace = 'M10 -6C12 -10 18 -10 20 -6M24 9Q32 9 38 6M2 -12l4 3';
export const foxEye = [15, -5.5];
export const foxNose = [41, 1.5];
// His bushy tail, from its root (0,0) out to the left, with a white tip.
export const foxTail = 'M0 -4C-16 -12 -36 -12 -52 -2C-58 2 -56 8 -48 8C-32 10 -14 6 0 4';
export const foxTailTip = 'M-50 -2C-46 -6 -42 -8 -38 -8C-38 -1 -42 5 -48 8C-56 8 -56 1 -50 -2Z';
export const foxTailMark = 'M-14 -2C-22 -4 -30 -3 -36 0';

// sitting in the water (0,0) = waterline under his middle
const FT = `translate(214 ${WATER}) scale(1.35)`;
const HT = `${FT} translate(4 -60) rotate(-48)`;
const TT = `${FT} translate(-26 -3) rotate(14) scale(0.85)`;
const back = 'M-6 -64C-26 -54 -32 -26 -28 0';
const chest = 'M16 -58C26 -42 26 -18 22 0';
const body = 'M-6 -64C-26 -54 -32 -26 -28 0L22 0C26 -18 26 -42 16 -58Z';
const bib = 'M12 -54C20 -40 20 -18 18 0L2 0C6 -20 6 -40 12 -54Z';
const fur = 'M-24 -30l5 2M-22 -18l5 2';
const ripples = 'M-44 2c6 -3 12 -3 16 -1M28 1c6 -3 14 -3 20 0M-64 14c8 -2 16 -2 22 0M30 14c8 -2 16 -2 22 0';
const drops = 'M-36 -12l-3 -4M38 -14l3 -4M-32 -20l-2 -3';

const tp = (d, t) => transformPath(d, t);
const pt = ([x, y], t) => transformPath(`M${x} ${y}`, t).split(' ').slice(1).map(Number);

export default {
  title: 'The Fox and the Goat',
  seed: 71,
  washes: [
    ...wellWashes,
    { c: PAL.terracotta, o: 0.85, d: tp(body, FT) + tp(foxHead, HT) + tp(foxEars + 'Z', HT) + tp(foxTail + 'Z', TT) },
    { c: PAL.red, o: 0.25, d: tp(foxTail + 'Z', TT) },
    { c: PAL.ink, o: 0.5, d: tp(foxInnerEars, HT) },
  ],
  whites: tp(bib, FT) + tp(foxCheek, HT) + tp(foxTailTip, TT),
  lines: paths([ground, walls, waterLine]) + paths([back, chest], FT) + paths([foxHead, foxEars], HT) + paths([foxTail], TT),
  fine: paths(wellFine) + paths([fur, ripples, drops], FT) + paths([foxFace], HT) + paths([foxTailMark], TT),
  fills: `<circle cx="${pt(foxEye, HT)[0]}" cy="${pt(foxEye, HT)[1]}" r="2.7"/><circle cx="${pt(foxNose, HT)[0]}" cy="${pt(foxNose, HT)[1]}" r="2.6"/>`,
  glints: `<circle cx="${f(pt(foxEye, HT)[0] - 0.8)}" cy="${f(pt(foxEye, HT)[1] - 1)}" r="0.8"/>`,
};
