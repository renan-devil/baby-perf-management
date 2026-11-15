import { PAL, hatch, tufts } from '../lib.mjs';
import { at, bird, compose, maLiang, place } from './characters.mjs';
import { limb } from '../stone-soup/characters.mjs';
import { waves } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 2: with no brush at all, Ma Liang draws a fish in the sand
// of the riverbank with a stick, while a little sparrow on a rock watches.
const M = 'translate(104 278) scale(1.5)';
const hand = [38, -60];
const [hx, hy] = at(...hand, M);
const tipX = 236;
const tipY = 262;
const stick = limb([[hx - 8, hy - 8, 4], [hx, hy, 4], [tipX, tipY, 3]]);
// the fish drawn in the sand, in plain scratchy lines
const fish =
  'M236 262C252 246 286 240 306 254C298 266 268 276 236 262ZM306 254L330 240L326 258L332 274Z' +
  'M250 258q4 -6 0 -10M258 262q-3 4 0 8';
const eye = 'M292 252m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0';
const rock = 'M318 218C312 200 326 186 346 186C366 186 384 198 380 218Z';

export default compose({
  title: 'Drawing in the sand',
  seed: 822,
  washes: [
    { c: PAL.sky, o: 0.25, d: 'M0 0L400 0L400 130L0 130Z' },
    { c: PAL.green, o: 0.55, d: 'M0 118C120 112 280 114 400 120L400 140L0 140Z' },
    { c: PAL.sky, o: 0.7, d: 'M0 138L400 138L400 206C280 212 120 210 0 204Z' },
    { c: PAL.ochre, o: 0.4, d: 'M0 202C120 208 280 210 400 204L400 300L0 300Z' },
    { c: PAL.grey, o: 0.85, d: rock },
    { c: PAL.terracotta, o: 0.8, d: `${stick}Z` },
  ],
  lines: ['M0 204C120 210 280 212 400 204', rock, stick, fish],
  fine: [
    waves(20, 380, 164, 6, 6),
    waves(60, 340, 186, 4, 5),
    eye,
    hatch(20, 240, 120, 290, 5, 6, 170, 822),
    hatch(340, 280, 390, 260, 3, 6, 170, 823),
    tufts([[30, 128], [180, 122], [330, 126]], 8, 822),
  ],
  parts: [
    place(
      maLiang({
        mood: 'peep',
        tilt: 10,
        arms: [
          [[-16, -84, 8], [-26, -72, 7.5], [-22, -58, 7]],
          [[16, -84, 8], [28, -72, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(bird({ wings: 'fold', sparrow: true }), 'translate(346 168) scale(-1.2 1.2)'),
  ],
});
