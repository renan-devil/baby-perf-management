import { PAL } from '../lib.mjs';
import { E_ARMS, compose, emperor, mirror, place, trickster } from './characters.mjs';

// The Emperor's New Clothes, 7: the morning of the parade. The Emperor stands in front of the mirror
// in nothing but his spotty underpants, pushing his arm into a sleeve that isn't there, while the two
// tricksters hold up the "coat" and the "trousers"... which are nothing at all.
const floor = 'M16 266C120 262 280 264 386 266';

export default compose({
  title: 'How well they fit!',
  seed: 461,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M16 264C120 258 280 260 386 264C392 272 360 280 300 280C220 284 120 284 70 280C36 278 10 272 16 264Z' },
    { c: PAL.red, o: 0.45, d: 'M130 266C150 256 240 256 258 266C254 274 226 278 194 278C160 278 132 274 130 266Z' },
  ],
  lines: [floor],
  fine: [
    'M136 268C156 262 232 262 252 268',
    // little marks round the empty hands: they are holding... nothing!
    'M84 88l-5 -6M98 82l0 -9M112 86l4 -7',
    'M262 214l-8 -2M262 224l-8 2',
    'M40 274l-8 1M330 276l-8 1',
  ],
  parts: [
    place(mirror(), 'translate(360 266) scale(1.0)'),
    place(
      trickster({
        who: 'a',
        look: 1,
        arms: [
          [[-14, -128, 8], [-6, -112, 7], [14, -112, 7], [28, -122, 7]],
          [[14, -128, 8], [30, -134, 7], [44, -146, 7]],
        ],
      }),
      'translate(50 266) scale(1.02)',
    ),
    place(
      emperor({
        dress: 'pants',
        mood: 'proud',
        tilt: 4,
        arms: [
          [[-30, -98, 13], [-48, -100, 12], [-62, -102, 12], [-74, -104, 12]],
          E_ARMS.hips[1],
        ],
      }),
      'translate(196 266) scale(1.15)',
    ),
    place(
      trickster({
        who: 'b',
        look: -1,
        lean: -22,
        tilt: 16,
        arms: [
          [[-14, -128, 8], [-26, -114, 7], [-36, -100, 7], [-42, -94, 7]],
          [[14, -128, 8], [4, -110, 7], [-10, -98, 7], [-18, -92, 7]],
        ],
      }),
      'translate(314 266) scale(1.02)',
    ),
  ],
});
