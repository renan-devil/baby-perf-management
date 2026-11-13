import { PAL } from '../lib.mjs';
import { compose, emperor, emperorHead, mirror, place } from './characters.mjs';

// The Emperor's New Clothes, 1 (cover): the plump Emperor, in his grand purple coat and little gold
// crown, admires himself in a tall mirror, one hand on his hip and the other twirling his moustache.
const floor = 'M40 262C120 258 280 260 370 262';

export default compose({
  title: 'The Emperor’s New Clothes',
  seed: 401,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M40 260C120 254 280 256 372 260C380 268 350 276 300 276C220 280 140 280 90 276C56 274 34 268 40 260Z' },
    { c: PAL.red, o: 0.45, d: 'M98 266C120 256 220 256 240 266C236 274 206 278 168 278C130 278 100 274 98 266Z' },
  ],
  lines: [floor],
  fine: ['M104 268C130 262 210 262 234 268', 'M60 270l-8 1M330 270l-8 1M360 266l-6 1'],
  parts: [
    place(mirror({ glint: false }), 'translate(300 264) scale(1.3)'),
    // his reflection, looking back at him
    place(emperorHead({ mood: 'happy', look: -1 }), 'translate(300 112) scale(-0.95 0.95)'),
    place(
      emperor({
        dress: 'coat',
        mood: 'happy',
        look: 1,
        tilt: 6,
        arms: [
          [[-30, -98, 13], [-50, -86, 12], [-50, -72, 12], [-38, -66, 12]],
          [[30, -98, 13], [48, -100, 12], [62, -106, 12], [70, -112, 12]],
        ],
      }),
      'translate(150 266) scale(1.3)',
    ),
  ],
});
