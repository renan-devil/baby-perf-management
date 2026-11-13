import { PAL } from '../lib.mjs';
import { compose, loom, minister, place } from './characters.mjs';

// The Emperor's New Clothes, 4: the old Minister, with his round spectacles and long white beard,
// leans towards the loom and peers at it with wide, worried eyes. There is nothing on it at all!
const floor = 'M16 266C120 262 280 264 386 266';

export default compose({
  title: 'Oh dear!',
  seed: 431,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M16 264C120 258 280 260 386 264C392 272 360 280 300 280C220 284 120 284 70 280C36 278 10 272 16 264Z' },
    // two little drops of worry
    { c: PAL.sky, o: 0.9, d: 'M276 56C272 62 272 66 276 66C280 66 280 62 276 56ZM288 72C285 77 285 80 288 80C291 80 291 77 288 72Z' },
  ],
  lines: [floor],
  fine: [
    'M276 56C272 62 272 66 276 66C280 66 280 62 276 56ZM288 72C285 77 285 80 288 80C291 80 291 77 288 72Z',
    // "?" marks of a puzzled look, drawn as little lines
    'M200 70l-4 -10M212 66l0 -12M224 70l4 -10',
    'M60 274l-8 1M330 276l-8 1',
  ],
  parts: [
    place(loom(), 'translate(118 266) scale(1.02)'),
    place(
      minister({
        mood: 'worried',
        look: -1,
        lean: -14,
        tilt: -4,
        arms: [
          [[-22, -100, 10], [-30, -84, 9], [-14, -76, 9], [-6, -78, 9]],
          [[22, -100, 10], [30, -84, 9], [14, -76, 9], [6, -78, 9]],
        ],
      }),
      'translate(282 266) scale(1.4)',
    ),
  ],
});
