import { PAL, hatch } from '../lib.mjs';
import { compose, fox, place } from '../fox-and-crow/characters.mjs';
import { scene } from './scene.mjs';

// The Fox and the Grapes, 2: HOP! The fox leaps as high as he can, stretching up towards the
// grapes, but his nose is still out of reach. Dust puffs where he took off; little arcs for the hops.
const s = scene();
const dust = 'M70 270C64 262 70 254 78 258C80 250 92 250 94 258C102 254 110 262 104 270';
// the arcs of earlier hops along the ground
const hops = 'M20 268Q40 240 60 266M60 266Q80 236 100 264';
// little "whoosh" marks under the jumping fox
const whoosh = 'M120 236l-12 12M136 244l-10 12M108 222l-12 10';
// his shadow on the ground, far below him
const shadow = 'M120 272C130 266 180 266 196 272C180 276 132 276 120 272Z';
// a little gap between his nose and the grapes
const reach = 'M232 152l6 -6M240 158l8 -4';

export default compose({
  title: 'Hop! Hop! HOP!',
  seed: 62,
  washes: [...s.washes, { c: PAL.ochre, o: 0.4, d: `${dust}Z` }, { c: PAL.slate, o: 0.35, d: shadow }],
  lines: [...s.lines],
  fine: [...s.fine, dust, whoosh, reach, hatch(60, 276, 110, 278, 4, 5, 150, 9)],
  once: `<path d="${hops}" stroke-dasharray="3 6"/>`,
  glints: s.glints,
  parts: [place(fox(), 'translate(168 214) rotate(-14) scale(1.2)')],
});
