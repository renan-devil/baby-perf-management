import { PAL, hatch, tufts } from '../lib.mjs';
import { COW_UDDER, compose, cow, merge, milkPot, place, stool, woman } from './characters.mjs';

// The Cat that Walked by Himself, 5: the Woman sits on her little stool, leaning in to milk Wild Cow,
// and the warm white milk squirts and froths up in the clay pot under the udder.
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

// Drawn at the size of the scene (cow at x = 270, ground at y = 262), then the group is enlarged.
const [ux, uy] = [270 + COW_UDDER[0], 262 + COW_UDDER[1]];
const squirts = `M${ux - 6} ${uy + 6}l0 12M${ux + 1} ${uy + 8}l0 10M${ux + 7} ${uy + 6}l0 10`;
const group = merge(
  place(cow({ nearHind: false, tail: 'none' }), 'translate(270 262)'),
  { fine: [squirts] },
  place(milkPot(), 'translate(246 262) scale(0.95)'),
  place(stool(), 'translate(176 262) scale(1.25)'),
  place(woman({ pose: 'sit', lean: 28, arms: [null, [[4, -54, 8], [24, -40, 7], [42, -27, 6]]] }), 'translate(176 262) scale(1.25)'),
);

export default compose({
  title: 'The Woman milks the Cow, and the warm milk froths in her pot',
  seed: 305,
  washes: [{ c: PAL.green, o: 0.32, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' }],
  lines: [ground],
  fine: [hatch(14, 278, 388, 280, 12, 7, 165, 4), tufts([[30, 262], [80, 261], [380, 261]], 9, 7)],
  parts: [place(group, 'translate(-110 -92) scale(1.35)')],
});
