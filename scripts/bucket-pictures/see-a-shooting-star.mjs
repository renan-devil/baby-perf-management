import { PAL, hatch, paths, tufts } from '../story-pictures/lib.mjs';

// See a shooting star: a big golden star streaks across the night sky over a hill, a moon and stars watching.
const f1 = (n) => Math.round(n * 10) / 10;
const star = (x, y, s = 4) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}`;
const dot = (x, y, r = 1.6) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
/** A crescent moon of radius r around (cx, cy), lit side on the left. */
const crescent = (cx, cy, r) =>
  `M${f1(cx + r * 0.2)} ${f1(cy - r)}C${f1(cx - r * 0.95)} ${f1(cy - r * 0.7)} ${f1(cx - r * 0.95)} ${f1(cy + r * 0.7)} ${f1(cx + r * 0.2)} ${f1(cy + r)}C${f1(cx - r * 0.15)} ${f1(cy + r * 0.5)} ${f1(cx - r * 0.15)} ${f1(cy - r * 0.5)} ${f1(cx + r * 0.2)} ${f1(cy - r)}Z`;
/** A five-pointed star of outer radius R around (cx, cy), turned by `turn` degrees. */
const fivePoint = (cx, cy, R, r, turn) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = ((turn - 90 + i * 36) * Math.PI) / 180;
    const k = i % 2 ? r : R;
    d += `${i ? 'L' : 'M'}${f1(cx + Math.cos(a) * k)} ${f1(cy + Math.sin(a) * k)}`;
  }
  return d + 'Z';
};

// The shooting star's head, and its tail going back up to the top left corner
const [hx, hy] = [292, 152];
const [tx, ty] = [36, 34];
const len = Math.hypot(hx - tx, hy - ty);
const [ux, uy] = [(tx - hx) / len, (ty - hy) / len]; // along the tail, away from the head
const [nx, ny] = [-uy, ux]; // across the tail
const at = (t, s) => [hx + ux * t + nx * s, hy + uy * t + ny * s];
const pt = (t, s) => at(t, s).map(f1).join(' ');

const head = fivePoint(hx, hy, 44, 19, 16);
const tail = `M${pt(6, -26)}C${pt(90, -18)} ${pt(180, -8)} ${pt(len, 0)}C${pt(180, 8)} ${pt(90, 18)} ${pt(6, 26)}Z`;
const tailCore = `M${pt(10, -13)}C${pt(70, -9)} ${pt(130, -4)} ${pt(210, 0)}C${pt(130, 4)} ${pt(70, 9)} ${pt(10, 13)}Z`;
const streaks = [
  [-17, 44, 130],
  [-17, 144, 176],
  [-6, 50, 216],
  [-6, 228, 252],
  [9, 48, 110],
  [9, 122, 190],
  [19, 44, 92],
]
  .map(([s, a, b]) => `M${pt(a, s * (1 - a / len))}L${pt(b, s * (1 - b / len))}`)
  .join('');
const sparkles = [
  [70, -26, 4],
  [150, 22, 4],
  [196, -20, 3],
  [118, -30, 3],
  [236, 14, 3],
  [44, 28, 3],
]
  .map(([t, s, k]) => star(...at(t, s).map(f1), k))
  .join('');
const sparkleDots = [
  [96, 24],
  [172, -12],
  [212, 16],
  [258, -10],
  [56, -14],
  [128, 6],
]
  .map(([t, s]) => dot(...at(t, s).map(f1), 1.3))
  .join('');
// little glints round the front of the star
const glow = [-50, -14, 22, 58, 94]
  .map((deg) => {
    const a = (deg * Math.PI) / 180;
    return `M${f1(hx + Math.cos(a) * 54)} ${f1(hy + Math.sin(a) * 54)}L${f1(hx + Math.cos(a) * 66)} ${f1(hy + Math.sin(a) * 66)}`;
  })
  .join('');

const hill = 'M0 240C70 222 150 214 220 220C290 226 350 244 400 250';
const hillFill = 'M0 236C70 218 150 210 220 216C290 222 350 240 400 246L400 300L0 300Z';
const sky = 'M0 0L400 0L400 246C350 240 290 222 220 216C150 210 70 218 0 236Z';

export default {
  title: 'See a shooting star',
  seed: 613,
  washes: [
    { c: PAL.slate, o: 0.32, d: sky },
    { c: PAL.green, o: 0.5, d: hillFill },
    { c: PAL.slate, o: 0.2, d: hillFill },
    { c: PAL.ochre, o: 0.5, d: tail },
    { c: PAL.ochre, o: 0.5, d: tailCore },
    { c: PAL.ochre, o: 0.92, d: head },
    { c: PAL.ochre, o: 0.85, d: crescent(352, 54, 22) },
  ],
  whites: `M${pt(30, -3)}L${pt(104, 0)}L${pt(30, 3)}Z`,
  lines: paths([hill, head]),
  fine: paths([
    streaks,
    sparkles,
    glow,
    crescent(352, 54, 22),
    star(212, 34, 4),
    star(318, 84, 3),
    star(110, 150, 4),
    star(380, 132, 3),
    star(40, 196, 3),
    star(170, 186, 3),
    star(258, 22, 3),
    hatch(20, 264, 380, 268, 11, 6, 165, 13),
    tufts([[28, 234], [120, 218], [214, 218], [300, 228], [372, 244], [180, 262]], 9, 17),
  ]),
  fills: `<path d="${sparkleDots}${dot(330, 22, 1.4)}${dot(150, 60, 1.2)}${dot(240, 120, 1.2)}${dot(80, 110, 1.3)}${dot(362, 196, 1.2)}${dot(20, 150, 1.1)}"/>`,
};
