import { PAL, zed } from '../lib.mjs';
import { bed, boyArm, boyHead, compose, dot, place, rabbit } from './characters.mjs';

// The Velveteen Rabbit, 4: night after night the Boy sleeps with the velveteen rabbit, hugging him
// tight under his arm, his head on the big white pillow; a little moon looks in at the window.
const BT = 'translate(246 225) scale(1.55)';
const win = 'M300 20L378 20L378 96L300 96ZM339 20L339 96M300 58L378 58';
const moon = 'M364 30C354 30 348 38 350 46C352 54 360 56 366 54C360 50 358 42 364 30Z';

export default compose({
  title: 'The Boy asleep, hugging the velveteen rabbit',
  seed: 4204,
  washes: [
    { c: PAL.slate, o: 0.45, d: 'M300 20L378 20L378 96L300 96Z' },
    { c: PAL.ochre, o: 0.9, d: moon },
  ],
  lines: [win],
  fine: [moon, zed(88, 128, 9), zed(72, 98, 12), zed(84, 60, 15)],
  once: dot(314, 34, 0.6) + dot(322, 78, 0.6) + dot(366, 82, 0.6),
  parts: [
    place(bed({ qx: -82, qy: -10, hump: 24, F: 90 }), BT),
    place(boyHead({ mood: 'sleep' }), 'translate(104 184) rotate(-12) scale(1.8)'),
    place(rabbit({ mood: 'shut', upper: true }), 'translate(170 214) rotate(6) scale(1.02)'),
    boyArm([[130, 208, 16], [146, 192, 15], [168, 183, 14], [194, 187, 13]], 7.5),
  ],
});
