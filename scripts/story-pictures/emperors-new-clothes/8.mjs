import { PAL, hatch } from '../lib.mjs';
import { bunting, compose, emperor, page, place } from './characters.mjs';

// The Emperor's New Clothes, 8: the Great Parade. Under the flags, the Emperor marches proudly down
// the street in his spotty underpants and his crown, nose in the air, while the two little pages
// behind him hold up the long cloak that isn't there.
const street = 'M0 268C100 264 300 266 400 268';
const pageArms = [
  [[-10, -54, 6.5], [-16, -66, 6], [-14, -80, 6]],
  [[10, -54, 6.5], [18, -66, 6], [22, -78, 6]],
];

export default compose({
  title: 'The Great Parade',
  seed: 471,
  washes: [{ c: PAL.grey, o: 0.35, d: 'M0 266C100 262 300 264 400 266L400 300L0 300Z' }],
  lines: [street],
  fine: [
    hatch(10, 282, 390, 284, 12, 9, 172, 4),
    // the pages' empty hands, holding up nothing at all
    'M72 152l-4 -7M128 154l4 -7M150 152l-4 -7M206 154l4 -7',
    // marching marks behind the Emperor
    'M226 236l-10 0M228 248l-12 2',
  ],
  parts: [
    place(bunting(-10, 24, 410, 30, 12, 14), ''),
    place(page({ who: 'b', mood: 'proud', look: 1, arms: pageArms }), 'translate(96 268) scale(1.3)'),
    place(page({ who: 'a', mood: 'proud', look: 1, arms: pageArms }), 'translate(174 268) scale(1.3)'),
    place(
      emperor({
        dress: 'pants',
        mood: 'proud',
        tilt: -16,
        toes: [1, 1],
        legs: [
          [[-14, -30, 12], [-16, -16, 10], [-14, -4, 10]],
          [[14, -30, 12], [30, -26, 10], [34, -12, 10]],
        ],
        arms: [
          [[-30, -98, 13], [-44, -84, 12], [-54, -72, 12], [-60, -66, 12]],
          [[30, -98, 13], [46, -104, 12], [56, -116, 12], [60, -124, 12]],
        ],
      }),
      'translate(296 268) scale(1.15)',
    ),
  ],
});
