import { PAL, tufts } from '../lib.mjs';
import { compose, place, profileRabbit, rabbit } from './characters.mjs';
import { limb } from '../stone-soup/characters.mjs';

// The Velveteen Rabbit, 6: at the edge of the wood, two wild brown rabbits peep out of the tall
// bracken at the little velveteen rabbit, who sits on the grass and stares back at them.
const f = (n) => Math.round(n * 10) / 10;
const ground = 'M0 262C90 259 200 263 300 260C340 259 370 261 400 260';

/** A bracken frond: a stem curving from (x0, y0) through (cx, cy) to its tip (x1, y1), with leaflets. */
function frond(x0, y0, cx, cy, x1, y1, n = 9, w = 24) {
  const P = (t) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
  const stem = `M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}`;
  const pts = [];
  let leaflets = '';
  for (let i = 0; i <= n; i++) {
    const t = 0.35 + (0.65 * i) / n;
    const [x, y] = P(t);
    const [xa, ya] = P(Math.min(1, t + 0.01));
    const l = Math.hypot(xa - x, ya - y);
    const nx = -(ya - y) / l;
    const ny = (xa - x) / l;
    const k = (w / 2) * (1 - (i / n) * 0.85);
    pts.push([f(x), f(y), f(k * 2)]);
    if (i < n) leaflets += `M${f(x)} ${f(y)}L${f(x + nx * k + (xa - x) / l * k * 0.5)} ${f(y + ny * k + (ya - y) / l * k * 0.5)}M${f(x)} ${f(y)}L${f(x - nx * k + (xa - x) / l * k * 0.5)} ${f(y - ny * k + (ya - y) / l * k * 0.5)}`;
  }
  return { stem, leaflets, wash: `${limb(pts)}Z` };
}

const fronds = [
  frond(30, 262, 20, 170, 96, 130, 10, 30),
  frond(80, 262, 70, 190, 170, 180, 9, 26),
  frond(140, 262, 150, 200, 214, 214, 8, 22),
  frond(10, 262, 0, 200, 40, 160, 7, 22),
  frond(110, 262, 120, 150, 70, 96, 9, 26),
  frond(60, 262, 50, 220, 134, 228, 7, 20),
];

export default compose({
  title: 'Two wild rabbits peep out of the bracken',
  seed: 4206,
  washes: [
    { c: PAL.green, o: 0.36, d: 'M0 258C90 255 200 259 300 256C340 255 370 257 400 256L400 300L0 300Z' },
  ],
  after: fronds.map((fr, i) => ({ c: PAL.green, o: i % 2 ? 0.55 : 0.7, d: fr.wash })),
  lines: [ground, ...fronds.map((fr) => fr.stem)],
  fine: [...fronds.map((fr) => fr.leaflets), tufts([[230, 262], [380, 260], [270, 286], [180, 288]], 9, 5)],
  parts: [
    place(profileRabbit({ pose: 'peep' }), 'translate(58 214) scale(1.55)'),
    place(profileRabbit({ pose: 'peep', tint: 0.85 }), 'translate(118 236) scale(1.4)'),
    place(rabbit({ mood: 'look', look: [-1.5, -0.3] }), 'translate(312 264) scale(1.2)'),
  ],
});
