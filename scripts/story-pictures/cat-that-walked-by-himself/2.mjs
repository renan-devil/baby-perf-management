import { PAL, hatch } from '../lib.mjs';
import { caveInside, compose, fire, log, man, place, roast, stool, woman } from './characters.mjs';

// The Cat that Walked by Himself, 2: in the Cave, the Woman sits on her stool and roasts meat over the
// fire on a long stick, and the Man sits on a log beside her with a big smile.
const floor = 'M0 262C90 259 200 264 300 261C350 260 380 261 400 260';

export default compose({
  title: 'In the Cave, the Woman roasts meat over the fire',
  seed: 302,
  washes: [{ c: PAL.ochre, o: 0.3, d: 'M0 258C90 255 200 260 300 257C350 256 380 257 400 256L400 300L0 300Z' }],
  lines: [floor],
  fine: [hatch(14, 278, 388, 280, 12, 7, 165, 4)],
  parts: [
    caveInside(),
    place(fire({ size: 1.4 }), 'translate(300 262)'),
    place(log(44), 'translate(58 262) scale(1.3)'),
    place(man(), 'translate(66 262) scale(1.4)'),
    place(stool(), 'translate(184 262) scale(1.4)'),
    place(
      woman({
        pose: 'sit',
        arms: [
          [[-2, -54, 8], [16, -42, 7], [30, -44, 6]],
          [[4, -54, 8], [20, -38, 7], [34, -40, 6]],
        ],
      }),
      'translate(184 262) scale(1.4)',
    ),
    place(roast(), 'translate(278 176) rotate(-5) scale(1.1)'),
  ],
});
