import { PAL, hatch } from '../lib.mjs';
import { compose, emperor, father, girl, merge, place } from './characters.mjs';

// The Emperor's New Clothes, 9: in the crowd, a little girl sitting on her father's shoulders points
// at the Emperor and laughs: "But he's only wearing his underpants!" Far down the street, the Emperor
// marches on, nose in the air.
const street = 'M0 270C100 266 300 268 400 270';

// the girl sits on her father's shoulders, her legs either side of his head; he holds her ankles
const pair = merge(
  father({
    mood: 'happy',
    look: 1,
    tilt: 4,
    arms: [
      [[-20, -106, 10], [-34, -110, 9], [-30, -122, 9]],
      [[20, -106, 10], [34, -110, 9], [30, -122, 9]],
    ],
  }),
  place(
    girl({
      mood: 'laugh',
      sit: true,
      tilt: -6,
      arms: [
        [[-11, -58, 7], [-18, -48, 6.5], [-14, -40, 6.5]],
        [[11, -58, 7], [28, -60, 6.5], [44, -60, 6.5]],
      ],
    }),
    'translate(0 -114)',
  ),
);

export default compose({
  title: 'Only his underpants!',
  seed: 481,
  washes: [{ c: PAL.grey, o: 0.35, d: 'M0 268C100 264 300 266 400 268L400 300L0 300Z' }],
  lines: [street],
  fine: [
    hatch(10, 284, 390, 286, 12, 9, 172, 6),
    // "ha ha!" marks round the laughing girl
    'M66 36l-8 -6M62 50l-10 0M176 22l6 -8M186 32l9 -4',
  ],
  parts: [
    place(pair, 'translate(124 270) scale(1.12)'),
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
      'translate(310 270) scale(0.8)',
    ),
  ],
});
