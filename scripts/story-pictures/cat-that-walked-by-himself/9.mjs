import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { baby, cat, compose, merge, place } from './characters.mjs';

// The Cat that Walked by Himself, 9: outside the Cave, the Cat rolls over on the grass and pats the
// Baby's fat toes with his paw, and the Baby, sitting on a soft skin rug, laughs and laughs.
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

// The skin rug the Baby sits on
const rug = 'M230 246C246 230 294 226 344 228C380 230 408 236 412 248C406 258 374 263 324 263C276 263 238 258 230 246Z';
const rugEdge = 'M236 251l-6 4M250 257l-4 5M394 256l6 4M408 249l7 2';

export default compose({
  title: 'The Cat rolls on the grass and pats the Baby’s toes, and the Baby laughs',
  seed: 309,
  washes: [
    { c: PAL.green, o: 0.36, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' },
    { c: PAL.grey, o: 0.45, d: rug },
    { c: PAL.ochre, o: 0.2, d: rug },
  ],
  lines: [ground, rug],
  fine: [
    rugEdge,
    hatch(14, 278, 388, 280, 12, 7, 165, 4),
    tufts([[20, 262], [60, 261], [376, 261]], 10, 10),
    // little bursts of laughter round the Baby's head
    rays(335, 146, 42, 53, 7, 5, -150).split('M').filter((_, i) => i >= 1 && i <= 4).map((d) => `M${d}`).join(''),
  ],
  // the two, a little larger about the ground line
  parts: [place(merge(place(cat({ pose: 'roll', mood: 'shut' }), 'translate(152 260) scale(1.9)'), place(baby(), 'translate(332 254) scale(-2 2)')), 'translate(-26 -31.4) scale(1.12)')],
});
