import { PAL } from '../lib.mjs';
import { cloud, compose, emperor, place } from './characters.mjs';

// The Great Race, 2: the Jade Emperor, who rules the sky, sits on his red throne among the clouds and
// raises his hand, smiling: "Come to my Great Race!"
const rays = 'M120 72l-14 -8M116 92l-16 0M120 112l-14 8';

export default compose({
  title: 'The Jade Emperor announces the race',
  seed: 42,
  washes: [{ c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 300L0 300Z' }],
  fine: [rays],
  parts: [
    place(cloud(), 'translate(56 60) scale(0.7)'),
    place(cloud(), 'translate(350 74) scale(-0.6 0.6)'),
    place(emperor(), 'translate(208 258) scale(1.12)'),
    place(cloud(), 'translate(110 268) scale(1.3)'),
    place(cloud(), 'translate(300 272) scale(-1.4 1.3)'),
  ],
});
