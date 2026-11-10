import { PAL, hatch, rays } from '../lib.mjs';
import { bench, compose, place, shoePair, shoemaker, wife, windowPanes } from './characters.mjs';

// The Elves and the Shoemaker, 2: the next morning, a pair of beautiful finished shoes stands on the
// workbench, shining like new chestnuts. The shoemaker and his wife (in her nightcap) stare, amazed.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const K = 1.15;

export default compose({
  title: 'A pair of finished shoes',
  seed: 52,
  washes: [
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    // morning sun coming in at the window
    { c: PAL.ochre, o: 0.85, d: 'M184 66C184 56 192 50 200 50C208 50 216 56 216 66Z' },
    { c: PAL.ochre, o: 0.18, d: 'M150 20C190 10 250 14 262 40C272 70 250 100 200 104C150 100 132 60 150 20Z' },
  ],
  lines: [floor],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), rays(200, 66, 22, 34, 7, 11, 190), rays(202, 160, 54, 68, 12, 5)],
  parts: [
    windowPanes(164, 30, 72, 56, { night: false }),
    place(bench({ w: 170, h: 76 }), 'translate(200 272) scale(1.2)'),
    place(shoePair({}), 'translate(156 178) scale(2.2)'),
    place(
      shoemaker({
        mood: 'wow',
        arms: [
          [[-20, -104, 10], [-34, -110, 9], [-40, -124, 9], [-42, -138, 9]],
          [[20, -104, 10], [34, -110, 9], [40, -124, 9], [42, -138, 9]],
        ],
      }),
      `translate(70 274) scale(${K})`,
    ),
    place(
      wife({
        mood: 'wow',
        cap: true,
        arms: [
          [[-18, -100, 9], [-30, -96, 8], [-26, -110, 8], [-16, -118, 8]],
          [[18, -100, 9], [30, -96, 8], [26, -110, 8], [16, -118, 8]],
        ],
      }),
      `translate(330 274) scale(${K})`,
    ),
  ],
});
