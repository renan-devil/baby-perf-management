import { PAL } from '../lib.mjs';
import { compose, emperor, loom, minister, place } from './characters.mjs';

// The Emperor's New Clothes, 6: the Emperor has come to see his new clothes. The old Minister
// points proudly at the loom, but the Emperor stares at it with his mouth wide open: he can see
// nothing at all!
const floor = 'M16 266C120 262 280 264 386 266';

export default compose({
  title: 'Magnificent?',
  seed: 451,
  washes: [{ c: PAL.grey, o: 0.3, d: 'M16 264C120 258 280 260 386 264C392 272 360 280 300 280C220 284 120 284 70 280C36 278 10 272 16 264Z' }],
  lines: [floor],
  // the Minister's pointing finger
  fine: ['M156 136l-10 -2', 'M312 46l-4 -10M324 42l0 -12M336 46l4 -10', 'M60 274l-8 1M330 276l-8 1'],
  parts: [
    place(loom(), 'translate(78 266) scale(0.95)'),
    place(
      minister({
        mood: 'proud',
        tilt: -6,
        arms: [
          [[-22, -100, 10], [-38, -100, 9], [-54, -106, 9], [-64, -112, 9]],
          [[22, -100, 10], [30, -86, 9], [33, -72, 9], [33, -64, 9]],
        ],
      }),
      'translate(234 266) scale(1.15)',
    ),
    place(
      emperor({
        dress: 'coat',
        mood: 'wow',
        look: -1,
        tilt: 4,
        arms: [
          [[-30, -98, 13], [-44, -98, 12], [-40, -114, 12], [-29, -124, 12]],
          [[30, -98, 13], [44, -98, 12], [40, -114, 12], [29, -124, 12]],
        ],
      }),
      'translate(337 266) scale(1.15)',
    ),
  ],
});
