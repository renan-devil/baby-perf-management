import { PAL, hatch } from '../lib.mjs';
import { compose, dot, frog, limb, place, plate, princessHead } from './characters.mjs';

// The Frog Prince, 7: the frog sits on the table and gobbles the soup from the princess's little golden
// plate (slurp, gulp, munch!), while the princess, at her place behind the table, pulls a grumpy face.
const top = 'M0 222C100 218 300 218 400 222';
const clothEdge = 'M0 250C100 246 300 246 400 250';
// a little cake with a cherry on top, and a few crumbs
const cake = 'M30 220L34 204L66 204L70 220M36 204C36 192 64 192 64 204';
const cherry = dot(50, 186, 5);
const crumbs = 'M112 228l2 0M124 232l2 0M96 234l2 0';
// the frog's long tongue, slurping from the plate
const F = 'translate(146 222) scale(2)';
const tongue = limb([[13, -26, 3.6], [24, -30, 3.4], [34, -22, 3.2], [40, -6, 3], [42, 2, 3]]);
const slurp = 'M28 -42q6 -4 10 -2M40 -38q6 0 10 4';

// the princess at her place (centre of her face at 0,0, in its own coordinates): shoulders in her rose
// dress and her arms folded on the table
const P = 'translate(318 150) scale(1.75)';
const bust = 'M-27 41C-27 30 -20 22 -8 20L8 20C20 22 27 30 27 41';
const neck = 'M-3 13L-3 20M3 13L3 20';
const armsFolded = limb([[-22, 30, 8], [-20, 38, 7], [0, 40, 7], [16, 38, 7]]);
const armsFolded2 = limb([[22, 30, 8], [20, 37, 7], [2, 36, 7], [-14, 35, 7]]);

export default compose({
  title: 'Slurp, gulp, munch!',
  seed: 57,
  washes: [
    { c: PAL.sky, o: 0.35, d: 'M0 222C100 218 300 218 400 222L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.6, d: 'M30 220L34 204L66 204L70 220ZM36 204C36 192 64 192 64 204Z' },
    { c: PAL.red, o: 0.9, d: cherry },
    { c: PAL.rose, o: 0.6, t: P, d: `${bust}Z` },
    { c: PAL.rose, o: 0.55, t: P, d: `${armsFolded}Z${armsFolded2}Z` },
    { c: PAL.terracotta, o: 0.7, d: 'M210 226C214 221 242 221 246 226C240 230 216 230 210 226Z' },
  ],
  lines: [top, cake],
  fine: [clothEdge, cherry, crumbs, 'M50 181q2 -6 6 -8', hatch(20, 270, 380, 272, 12, 7, 172, 4)],
  parts: [
    place(frog({ mood: 'chew', look: [2, 1.5], mouth: true }), F),
    place({ lines: [tongue], fine: [slurp], washes: [{ c: PAL.red, o: 0.6, d: `${tongue}Z` }] }, F),
    place(plate(60), 'translate(228 228)'),
    place({ lines: [bust, armsFolded, armsFolded2], fine: [neck] }, P),
    place(princessHead({ mood: 'cross' }), `${P} rotate(-8)`),
  ],
});
