import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, house, lantern, nian, place } from './characters.mjs';

// Nian and the First New Year, 1 (cover): Nian, the big round fluffy green beast with one horn,
// peeps curiously at a glowing red lantern hanging from the eave of a village house, whose wooden
// door is covered with red paper. A few stars in the evening sky.
const ground = 'M0 272C80 268 180 270 260 270C320 270 370 268 400 270';
const star = (x, y, s = 4) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}`;

export default compose({
  title: 'Nian and the First New Year',
  seed: 211,
  washes: [
    { c: PAL.slate, o: 0.2, d: 'M0 0L400 0L400 96C300 86 200 104 0 90Z' },
    { c: PAL.grey, o: 0.35, d: `${ground}L400 300L0 300Z` },
  ],
  lines: [ground],
  fine: [
    star(40, 30),
    star(150, 22, 3),
    star(230, 48, 3),
    star(90, 70, 3),
    hatch(20, 286, 200, 288, 8, 7, 168, 4),
    tufts([[16, 272], [214, 270]], 8, 5),
  ],
  parts: [
    place(house({ w: 180, h: 92, red: true, door: 6 }), 'translate(338 270)'),
    place(lantern(17), 'translate(226 176)'),
    place(nian({ mood: 'curious', look: [3, -1.5] }), 'translate(112 268) scale(0.98)'),
  ],
});
