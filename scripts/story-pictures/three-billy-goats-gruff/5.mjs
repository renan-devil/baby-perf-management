import { PAL, rays, rng, tufts } from '../lib.mjs';
import { dot } from '../stone-soup/characters.mjs';
import { billy, compose, merge, place } from './characters.mjs';

// The Three Billy Goats Gruff, 5: up on the sunny green hill the three goats munch the long sweet
// grass, eyes closed with pleasure, their tummies round and full.
const hill = 'M0 222C60 206 150 198 230 200C300 202 360 196 400 190';
const sun = 'M42 50a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z';

/** A clump of long grass standing on (x, y), about h tall, its blades leaning towards a goat's mouth. */
function longGrass(x, y, h, seed) {
  const r = rng(seed);
  let d = '';
  let fill = '';
  for (let i = 0; i < 6; i++) {
    const bx = x + i * 3 - 8;
    const k = h * (0.7 + r() * 0.35);
    const lean = (r() - 0.6) * 14;
    const top = `${(bx + lean).toFixed(1)} ${(y - k).toFixed(1)}`;
    d += `M${bx} ${y}Q${(bx + lean * 0.2).toFixed(1)} ${(y - k * 0.6).toFixed(1)} ${top}`;
    fill += `M${bx - 2} ${y}Q${(bx + lean * 0.2 - 1).toFixed(1)} ${(y - k * 0.6).toFixed(1)} ${top}Q${(bx + lean * 0.2 + 2).toFixed(1)} ${(y - k * 0.6).toFixed(1)} ${bx + 2} ${y}Z`;
  }
  return { fine: [d], washes: [{ c: PAL.green, o: 0.95, d: fill }] };
}

const flowers = [
  [30, 240, PAL.rose],
  [120, 268, PAL.ochre],
  [190, 222, PAL.red],
  [250, 262, PAL.rose],
  [300, 236, PAL.ochre],
  [384, 216, PAL.red],
  [372, 260, PAL.ochre],
  [262, 214, PAL.rose],
];

export default compose({
  title: 'Snip, snap, snout',
  seed: 89,
  washes: [
    { c: PAL.green, o: 0.45, d: `${hill}L400 300L0 300Z` },
    { c: PAL.green, o: 0.3, d: 'M0 270C100 256 260 256 400 270L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.75, d: sun },
    ...flowers.map(([x, y, c]) => ({ c, o: 0.9, d: dot(x, y, 4) })),
  ],
  // The crest stops behind the great big goat, who stands in front of it.
  lines: ['M0 222C10 219 18 217 26 215', 'M134 202C166 199 198 199 230 200C300 202 360 196 400 190'],
  fine: [
    sun,
    rays(64, 50, 28, 42, 11, 9),
    'M86 74q6 -4 12 0M100 80q6 -4 12 0',
    tufts([[14, 220], [176, 200], [256, 201], [392, 191], [40, 276], [200, 290], [330, 280]], 9, 4),
    ...flowers.map(([x, y]) => dot(x, y, 4)),
  ],
  parts: [
    merge(longGrass(162, 256, 74, 3)),
    merge(longGrass(286, 220, 58, 5)),
    merge(longGrass(370, 204, 42, 7)),
    place(billy({ size: 'big', mood: 'munch', round: true, head: 22 }), 'translate(76 256) scale(1.05)'),
    place(billy({ size: 'middle', mood: 'munch', round: true, head: 22 }), 'translate(222 220) scale(0.8)'),
    place(billy({ size: 'little', mood: 'munch', round: true, head: 22 }), 'translate(330 204) scale(0.55)'),
  ],
});
