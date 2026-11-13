import { PAL } from '../lib.mjs';
import { E_ARMS, compose, emperor, place, trickster } from './characters.mjs';

// The Emperor's New Clothes, 2: two thin tricksters in patched coats bow very low in front of the
// Emperor, smiling slyly, and he looks at them, delighted.
const floor = 'M20 270C120 266 280 268 384 270';
// arms of a bowing trickster (in his upper body's own coordinates): one sweeps back, one to the chest
const bowArms = [
  [[-14, -128, 8], [-26, -112, 7], [-34, -96, 7], [-40, -84, 7]],
  [[14, -128, 8], [8, -112, 7], [0, -104, 7]],
];

export default compose({
  title: 'Your Majesty!',
  seed: 411,
  washes: [{ c: PAL.grey, o: 0.3, d: 'M20 268C120 262 280 264 384 268C390 276 360 284 300 284C220 288 120 288 70 284C36 282 14 276 20 268Z' }],
  lines: [floor],
  fine: ['M90 280l-8 1M250 281l-8 1M370 278l-8 1'],
  parts: [
    place(trickster({ who: 'b', lean: 48, tilt: -30, look: 1, arms: bowArms }), 'translate(42 272) scale(1.02)'),
    place(trickster({ who: 'a', lean: 60, tilt: -40, look: 1, arms: bowArms }), 'translate(158 272) scale(1.1)'),
    place(emperor({ dress: 'coat', mood: 'happy', look: -1, tilt: -6, arms: E_ARMS.hips }), 'translate(324 272) scale(1.25)'),
  ],
});
