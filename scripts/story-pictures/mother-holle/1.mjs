import { PAL } from '../lib.mjs';
import { compose, flurry, holle, pillow, place } from './characters.mjs';

// Mother Holle, 1 (cover): Mother Holle leans out of the window of her little white house and shakes
// a big feather pillow; the feathers fly out and turn into snowflakes as they drift away.
export const HT = 'translate(128 306) scale(1.55)';
// the window: white wall round it, open terracotta shutters, a sill she leans on
const wall = 'M22 66C80 60 170 60 226 66L230 262C170 268 80 268 22 262Z';
const opening = 'M58 86L198 86L198 238L58 238Z';
const frame = 'M58 238L58 86L198 86L198 148M198 176L198 238';
const sill = 'M46 238L212 238L216 252L42 252Z';
const shutterL = 'M58 88L28 80L28 246L58 238';
const shutterR = 'M198 88L222 80L222 146M222 182L222 246L210 240';
const roof = 'M10 68L240 68L230 44L20 44Z';

export default compose({
  title: 'Mother Holle Shakes Her Pillow',
  seed: 1401,
  washes: [
    { c: PAL.grey, o: 0.16, d: `${wall}${opening}`, rule: 'evenodd' },
    { c: PAL.red, o: 0.75, d: roof },
    { c: PAL.terracotta, o: 0.6, d: `${shutterL}ZM198 88L222 80L222 246L210 240L198 238Z` },
    { c: PAL.ochre, o: 0.55, d: sill },
  ],
  lines: [frame, sill, shutterL, shutterR, roof],
  fine: [
    'M28 124L58 126M28 166L58 166M28 206L58 206M222 120L198 122',
    'M40 54l14 0M84 56l14 0M134 54l14 0M184 56l14 0M216 54l10 0',
    // shake marks round the pillow
    'M236 140q-6 -8 0 -18M252 136l4 -10M302 228q8 4 14 -4M306 246l8 4M226 252q-2 8 4 14',
  ],
  parts: [
    place(
      holle({
        mood: 'laugh',
        bust: true,
        arms: [
          [[-22, -80, 9], [-30, -66, 8], [-32, -54, 8], [-27, -48, 8]],
          [[22, -80, 9], [42, -88, 8], [60, -93, 8], [72, -95, 8]],
        ],
      }),
      HT,
    ),
    place(pillow(), 'translate(265 201) rotate(30) scale(1.45)'),
    flurry(318, 52, 394, 284, 18, 7),
    flurry(236, 226, 330, 292, 4, 9),
    flurry(236, 30, 330, 120, 5, 11),
  ],
});
