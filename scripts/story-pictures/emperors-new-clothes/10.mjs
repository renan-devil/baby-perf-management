import { PAL } from '../lib.mjs';
import { compose, emperor, girl, place } from './characters.mjs';

// The Emperor's New Clothes, 10 (the end): wrapped in a big red blanket, his face as pink as can be,
// the Emperor laughs with the little girl, his new Royal Truth-Teller, who wears a small golden medal.
const floor = 'M30 266C120 262 280 264 370 266';

export default compose({
  title: 'The Royal Truth-Teller',
  seed: 491,
  washes: [{ c: PAL.grey, o: 0.3, d: 'M30 264C120 258 280 260 372 264C380 272 350 280 300 280C220 284 140 284 90 280C56 278 24 272 30 264Z' }],
  lines: [floor],
  fine: [
    // "ha ha!" marks round the two of them
    'M112 64l-8 -6M106 78l-10 0M300 132l8 -6M306 146l10 0M292 118l5 -8',
    'M60 272l-8 1M340 274l-8 1',
  ],
  parts: [
    place(
      emperor({
        dress: 'blanket',
        mood: 'laugh',
        blush: true,
        tilt: 8,
        arms: [
          [[-30, -98, 13], [-30, -84, 12], [-16, -78, 12], [-6, -80, 12]],
          [[30, -98, 13], [30, -84, 12], [16, -78, 12], [6, -82, 12]],
        ],
      }),
      'translate(170 266) scale(1.32)',
    ),
    place(
      girl({
        mood: 'laugh',
        medal: true,
        tilt: -8,
        arms: [
          [[-11, -58, 7], [-18, -48, 6.5], [-17, -38, 6.5]],
          [[11, -58, 7], [24, -68, 6.5], [32, -86, 6.5]],
        ],
      }),
      'translate(296 266) scale(1.4)',
    ),
  ],
});
