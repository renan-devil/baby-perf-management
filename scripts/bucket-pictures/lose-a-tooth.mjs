import { PAL, hatch, paths, transformPath } from '../story-pictures/lib.mjs';

// Lose a tooth: a little smiling tooth on the pillow, and the tooth mouse flying in with a shiny coin.
const f1 = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r = 1.6) => `M${f1(x - r)} ${f1(y)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const star = (x, y, s = 4) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}`;
/** A four-pointed twinkle around (x, y). */
const twinkle = (x, y, s) => `M${x} ${y - s}Q${x} ${y} ${x + s * 0.7} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s * 0.7} ${y}Q${x} ${y} ${x} ${y - s}Z`;
/** A crescent moon of radius r around (cx, cy), lit side on the left. */
const crescent = (cx, cy, r) =>
  `M${f1(cx + r * 0.2)} ${f1(cy - r)}C${f1(cx - r * 0.95)} ${f1(cy - r * 0.7)} ${f1(cx - r * 0.95)} ${f1(cy + r * 0.7)} ${f1(cx + r * 0.2)} ${f1(cy + r)}C${f1(cx - r * 0.15)} ${f1(cy + r * 0.5)} ${f1(cx - r * 0.15)} ${f1(cy - r * 0.5)} ${f1(cx + r * 0.2)} ${f1(cy - r)}Z`;

// The pillow, on the bed with the blanket below. Its top edge goes behind the tooth.
const pillowRest =
  'C276 148 288 158 280 170C290 196 290 220 280 244C288 256 276 264 262 256C208 264 112 264 58 256C44 262 32 254 40 242C30 218 30 194 40 168C34 156 46 148 58 154';
const pillow = `M190 148C216 147 240 150 262 154${pillowRest}C76 151 94 149 110 148`;
const creases = 'M58 154C66 162 70 170 70 178M262 154C254 162 250 170 250 178M58 256C66 248 70 240 72 232M262 256C254 248 250 240 248 232M216 214C230 220 244 222 256 218';
const blanket = 'M0 262C90 258 200 266 300 262C340 260 370 262 400 260';
const blanketFold = 'M0 274C90 270 200 278 300 274C340 272 370 274 400 272';

// The tooth (a molar with two roots), drawn around (0, 0) and set on the pillow
const TOOTH = 'translate(150 176) scale(1.45)';
const crown = 'M-26 -10C-30 -30 -16 -38 -8 -32C-4 -36 4 -36 8 -32C16 -38 30 -30 26 -10';
const tooth = `${crown}C24 2 21 12 18 24C16 34 10 38 6 30C4 24 2 18 0 18C-2 18 -4 24 -6 30C-10 38 -16 34 -18 24C-21 12 -24 2 -26 -10Z`;
// the pillow and the tooth's crown together, kept out of the night wash
const pillowAndTooth = `M58 154C76 151 94 149 110 148${transformPath(crown, TOOTH).replace(/^M/, 'L')}L190 148C216 147 240 150 262 154${pillowRest}Z`;
const toothFace = 'M-7 0Q0 7 7 0';
const toothShade = 'M14 -28C24 -26 28 -18 26 -10C24 2 21 12 18 24C16 32 12 34 9 32C14 22 18 6 18 -6C18 -16 16 -24 14 -28Z';

// The tooth mouse with little fairy wings, flying in from the right with a coin (facing left)
const MOUSE = 'translate(304 90) rotate(-10) scale(1.3)';
const mouse = 'M-48 4C-40 -4 -30 -14 -18 -16C-6 -18 4 -22 16 -22C32 -22 40 -10 40 2C40 14 30 20 16 20C4 20 -8 16 -16 12C-26 10 -38 10 -48 4Z';
const ear = 'M-24 -16C-30 -28 -16 -36 -8 -28C-4 -23 -6 -18 -10 -16';
const tail = 'M40 6C54 10 64 4 64 -6C64 -14 56 -16 52 -10';
const arms = 'M-14 12C-20 15 -26 17 -31 18M-8 15C-14 21 -22 25 -31 26';
const feet = 'M14 20l-2 8M26 18l3 7';
const whiskers = 'M-42 2l-6 -7M-42 5l-10 -1M-41 8l-7 5';
const wingA = 'M6 -20C-2 -34 0 -52 14 -54C28 -56 30 -40 20 -30C16 -26 10 -22 6 -20Z';
const wingB = 'M8 -20C20 -30 34 -32 38 -24C40 -16 28 -14 12 -18Z';
const veins = 'M8 -24C10 -34 12 -42 16 -48M12 -21C20 -24 28 -25 33 -23';
const coin = 'M-52 24C-52 14 -32 14 -32 24C-32 34 -52 34 -52 24Z';
const coinRim = 'M-48 24C-48 18 -36 18 -36 24C-36 30 -48 30 -48 24Z';
// the coin shines (on the side away from the paws)
const shine = [100, 130, 160, 190, 220, 250]
  .map((deg) => {
    const a = (deg * Math.PI) / 180;
    const [c, n] = [Math.cos(a), Math.sin(a)];
    return `M${f1(-42 + c * 14)} ${f1(24 + n * 14)}L${f1(-42 + c * 20)} ${f1(24 + n * 20)}`;
  })
  .join('');

const sparkles = twinkle(212, 136, 7) + twinkle(96, 120, 6) + twinkle(214, 70, 5) + twinkle(372, 132, 5);
const stars = [star(150, 30, 4), star(330, 22, 3), star(380, 60, 3), star(100, 74, 3), star(30, 128, 3), star(352, 196, 3)].join('');

export default {
  title: 'Lose a tooth',
  seed: 659,
  washes: [
    // the night in the bedroom, round the pillow (the pillow stays bright)
    { c: PAL.slate, o: 0.22, rule: 'evenodd', d: 'M0 0L400 0L400 262C370 264 340 262 300 264C200 268 90 260 0 264Z' + pillowAndTooth + transformPath(wingA + wingB, MOUSE) },
    { c: PAL.sky, o: 0.5, rule: 'evenodd', d: pillowAndTooth + transformPath(tooth, TOOTH) },
    { c: PAL.rose, o: 0.55, d: 'M0 262C90 258 200 266 300 262C340 260 370 262 400 260L400 300L0 300Z' },
    { c: PAL.grey, o: 0.3, t: TOOTH, d: toothShade },
    { c: PAL.rose, o: 0.6, t: TOOTH, d: 'M-20 -4C-20 -8 -14 -8 -14 -4C-14 0 -20 0 -20 -4ZM14 -4C14 -8 20 -8 20 -4C20 0 14 0 14 -4Z' },
    { c: PAL.sky, o: 0.5, t: MOUSE, d: wingA + wingB },
    { c: PAL.grey, o: 0.75, t: MOUSE, d: mouse + 'M-24 -16C-30 -28 -16 -36 -8 -28C-4 -23 -6 -18 -10 -16Z' },
    { c: PAL.rose, o: 0.7, t: MOUSE, d: 'M-20 -19C-23 -27 -14 -30 -11 -26C-9 -22 -11 -19 -15 -18ZM-51 4C-51 1 -46 1 -46 4C-46 7 -51 7 -51 4Z' },
    { c: PAL.ochre, o: 0.95, t: MOUSE, d: coin },
    { c: PAL.ochre, o: 0.85, d: crescent(52, 50, 22) },
    { c: PAL.ochre, o: 0.7, d: sparkles },
  ],
  lines: paths([pillow, blanket]) + paths([tooth], TOOTH) + paths([mouse, ear, tail, wingA, wingB, coin, arms], MOUSE),
  fine:
    paths([creases, blanketFold, crescent(52, 50, 22), sparkles, stars, hatch(20, 286, 380, 290, 10, 6, 165, 31)]) +
    paths([toothFace], TOOTH) +
    paths([feet, whiskers, veins, coinRim, shine], MOUSE),
  fills: `<path d="${transformPath(dot(-8, -10, 2.6) + dot(8, -10, 2.6), TOOTH)}${transformPath(dot(-31, -5, 2.3), MOUSE)}${dot(352, 36, 1.4)}${dot(366, 28, 1.3)}${dot(382, 22, 1.2)}${dot(200, 22, 1.2)}"/>`,
  glints: `<path d="${transformPath(dot(-8.8, -11, 0.9) + dot(7.2, -11, 0.9), TOOTH)}${transformPath(dot(-45, 20, 1.8) + dot(-31.7, -5.9, 0.7), MOUSE)}"/>`,
};
