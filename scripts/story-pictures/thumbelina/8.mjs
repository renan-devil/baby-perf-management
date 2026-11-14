import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { compose, dot, oval, place, swallow, thumbelina } from './characters.mjs';

// Thumbelina, 8: it is spring. The swallow flies up into the sunshine, and Thumbelina waves goodbye
// from the hole in the ground.
const ground = 'M0 250C80 246 160 252 240 249C310 246 360 251 400 248';
const hole = oval(98, 254, 56, 13);
const body = 'M72 244L124 244L124 262L72 262Z';
const holeFront = 'M42 254C48 265 76 270 98 270C120 270 148 265 154 254';
const sun = dot(360, 42, 22);
const flower = (x, y, c) => ({ d: `${dot(x - 4, y, 4)}${dot(x + 4, y, 4)}${dot(x, y - 4, 4)}${dot(x, y + 4, 4)}`, c, stem: `M${x} ${y + 6}L${x} 252` });
const flowers = [flower(222, 226, PAL.red), flower(260, 234, PAL.ochre), flower(340, 222, PAL.rose), flower(30, 230, PAL.ochre)];

export default compose({
  title: 'Goodbye, swallow',
  seed: 108,
  washes: [
    { c: PAL.ochre, o: 0.85, d: sun },
    { c: PAL.green, o: 0.55, d: 'M0 250C80 246 160 252 240 249C310 246 360 251 400 248L400 298C300 300 100 300 0 298Z' },
    { c: PAL.terracotta, o: 0.35, d: 'M0 250C80 246 160 252 240 249C310 246 360 251 400 248L400 298C300 300 100 300 0 298Z' },
    ...flowers.map((fl) => ({ c: fl.c, o: 0.85, d: fl.d })),
  ],
  after: [{ c: PAL.ink, o: 0.55, d: hole + body, rule: 'evenodd' }, { c: PAL.terracotta, o: 0.4, d: `${holeFront}C136 276 60 276 42 254Z` }],
  lines: [ground, sun, holeFront],
  fine: [
    rays(360, 42, 30, 44, 12, 6),
        ...flowers.map((fl) => fl.stem + fl.d),
    tufts([[200, 250], [300, 249], [380, 248], [18, 250], [186, 251]], 10, 4),
    hatch(30, 280, 380, 282, 10, 7, 170, 8),
  ],
  parts: [
    place(swallow({ pose: 'up' }), 'translate(280 128) rotate(-24) scale(1.08)'),
    place(thumbelina({ pose: 'upper', arms: 'wave', mood: 'happy' }), 'translate(98 314) scale(1.6)'),
  ],
});
