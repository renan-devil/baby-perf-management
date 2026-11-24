import { PAL, hatch, tufts } from '../lib.mjs';
import { at, cat, cave, compose, place, woman } from './characters.mjs';

// The Cat that Walked by Himself, 7: the Cat sits up very straight, his tail curled round his paws,
// and looks up at the Woman in the door of the Cave. She holds up one finger: "If ever I say one word
// in your praise…" It is a bargain.
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

const W = 'translate(318 262) scale(-1.04 1.04)';
const armUp = [[4, -54, 8], [22, -56, 7], [34, -64, 6]];
// her raised hand, in the picture (arm centrelines are in hip coordinates, 54 above her feet)
const [hx, hy] = at(W, armUp[2][0], armUp[2][1] - 54);
const finger = `M${hx + 1} ${hy - 4}C${hx + 1} ${hy - 9} ${hx} ${hy - 12} ${hx - 1} ${hy - 14}`;

export default compose({
  title: 'The Cat sits up very straight and makes a bargain with the Woman',
  seed: 307,
  washes: [{ c: PAL.green, o: 0.32, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' }],
  lines: [ground],
  fine: [hatch(14, 278, 388, 280, 12, 7, 165, 4), tufts([[24, 262], [70, 261], [212, 262]], 9, 8)],
  parts: [
    place(cave({ curtain: 'right', dark: 0.3, narrow: 0.5 }), 'translate(334 262) scale(1.22)'),
    place(woman({ arms: [null, armUp], headTilt: 10 }), W),
    { lines: [finger], washes: [{ c: PAL.rose, o: 0.5, d: `${finger}Z` }] },
    place(cat({ pose: 'sit', mood: 'up' }), 'translate(136 262) scale(1.7)'),
  ],
});
