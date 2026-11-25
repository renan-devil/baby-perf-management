import { PAL, rng, tufts } from '../lib.mjs';
import { compose, gate, marie, oval, place, twinkle } from './characters.mjs';

// Mother Holle, 7: Mother Holle's great gate creaks open, and as Marie walks under it a shower of
// shining gold pours down all over her, tinkle, tinkle! She laughs, golden from head to toe.
export const GT = 'translate(200 276) scale(1.2)';
const ground = 'M24 276C120 273 290 273 380 276';

/** A shower of gold: coins (seen flat or edge-on) and glittering drops, inside [x1, y1, x2, y2]. */
function goldShower(x1, y1, x2, y2, n, seed) {
  const r = rng(seed);
  const fine = [];
  const coins = [];
  const drops = [];
  const glints = [];
  const placed = [];
  for (let tries = 0; placed.length < n && tries < n * 40; tries++) {
    const x = x1 + r() * (x2 - x1);
    const y = y1 + r() * (y2 - y1);
    if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < 13) || Math.hypot(x - 200, y - 146) < 26) continue;
    placed.push([x, y]);
    if (r() < 0.55) {
      const w = 4.5 * (0.4 + r() * 0.6);
      const d = oval(x, y, w, 4.5);
      fine.push(d);
      coins.push(d);
      glints.push(oval(x - w * 0.3, y - 1.5, w * 0.25, 1));
    } else {
      drops.push(oval(x, y, 2.2, 2.6));
      fine.push(`M${x} ${y - 5}l0 -5`);
    }
  }
  return { fine, washes: [{ c: PAL.ochre, o: 1, d: coins.join('') }, { c: PAL.ochre, o: 0.9, d: drops.join('') }], glints };
}
// the gold already lying round her feet
const pile = 'M150 276C156 266 170 262 180 266C186 260 214 260 220 266C230 262 244 266 250 276Z';

export default compose({
  title: 'A Shower of Gold',
  seed: 1407,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M20 274C120 266 290 266 384 274C380 286 300 292 200 292C110 292 24 286 20 274Z' },
    { c: PAL.ochre, o: 0.18, d: 'M162 52C180 46 220 46 238 52L238 276L162 276Z' },
    { c: PAL.ochre, o: 0.85, d: pile },
  ],
  lines: [ground],
  fine: [pile, 'M170 270q4 -3 8 0M196 266q4 -3 8 0M222 270q4 -3 8 0', tufts([[40, 276], [96, 276], [304, 276], [366, 276]], 9, 7)],
  parts: [
    place(gate(), GT),
    place(
      marie({
        mood: 'laugh',
        up: 1,
        gold: true,
        arms: [
          [[-12, -80, 7], [-20, -88, 6.5], [-25, -100, 6.5], [-26, -110, 6.5]],
          [[12, -80, 7], [20, -88, 6.5], [25, -100, 6.5], [26, -110, 6.5]],
        ],
      }),
      'translate(200 272) scale(1.3)',
    ),
    goldShower(164, 56, 236, 250, 30, 7),
    { fine: [twinkle(176, 80, 5), twinkle(226, 100, 6), twinkle(172, 200, 5), twinkle(230, 220, 5), twinkle(200, 58, 4)] },
  ],
});
