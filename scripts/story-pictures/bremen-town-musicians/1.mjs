import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { cat, compose, dog, donkey, place, rooster } from './characters.mjs';

// The Bremen Town Musicians, 1 (cover): the four friends walk one behind the other along a country
// road: the old Donkey in front, then the Dog, the Cat and the Rooster.
const hills = 'M0 196C60 184 120 190 180 198C240 186 320 182 400 192';
const road = 'M0 282C120 276 280 280 400 274';
const sun = 'M318 58C318 46 328 38 338 38C349 38 358 47 358 58C358 69 349 77 338 77C328 77 318 69 318 58Z';

export default compose({
  title: 'The Bremen Town Musicians',
  seed: 61,
  washes: [
    { c: PAL.ochre, o: 0.7, d: sun },
    { c: PAL.green, o: 0.32, d: `${hills}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.45, d: 'M0 236C120 230 280 232 400 228L400 274C280 280 120 276 0 282Z' },
  ],
  lines: [road, sun],
  fine: [
    rays(338, 58, 26, 38, 11, 5),
    hatch(30, 258, 380, 254, 11, 7, 175, 9),
    tufts([[20, 230], [150, 228], [360, 225], [60, 292], [250, 292]], 9, 4),
  ],
  parts: [
    place(rooster(), 'translate(47 262) scale(0.74)'),
    place(cat(), 'translate(122 262) scale(0.8)'),
    place(dog(), 'translate(210 262) scale(0.8)'),
    place(donkey(), 'translate(318 262) scale(0.8)'),
  ],
});
