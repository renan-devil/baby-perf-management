import { PAL, hatch, tufts } from '../lib.mjs';
import { bone, cave, compose, dog, place, woman } from './characters.mjs';

// The Cat that Walked by Himself, 3: at the door of the Cave, her curtain of skins pulled aside, the
// Woman holds out a roasted bone, and Wild Dog stretches up his nose to sniff it.
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

export default compose({
  title: 'The Woman holds out a roasted bone to Wild Dog',
  seed: 303,
  washes: [{ c: PAL.green, o: 0.32, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' }],
  lines: [ground],
  fine: [hatch(14, 278, 388, 280, 12, 7, 165, 4), tufts([[24, 262], [96, 261], [168, 262]], 9, 3)],
  parts: [
    place(cave({ curtain: 'right', dark: 0.32 }), 'translate(300 262) scale(1.22)'),
    place(dog({ head: 'rotate(-26)' }), 'translate(144 262) scale(1.35)'),
    place(
      woman({
        arms: [null, [[4, -54, 8], [22, -46, 7], [38, -44, 6]]],
      }),
      'translate(282 262) scale(-1.1 1.1)',
    ),
    place(bone(), 'translate(234 160) rotate(-14) scale(1.15)'),
  ],
});
