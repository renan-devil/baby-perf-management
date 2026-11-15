import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, cottage, eggBasket, hen, jack, mother, place, shine } from './characters.mjs';

// Jack and the Beanstalk, 8: home again! Jack's mother hugs him tight, "Oh, Jack, I'm sorry I was
// cross", beside the little brown hen and a basket full of golden eggs. The cottage behind them.
const M = 'translate(130 290) scale(1.5)';
const J = 'translate(212 292) scale(1.5)';

export default compose({
  title: 'Home again',
  seed: 281,
  washes: [
    { c: PAL.sky, o: 0.28, d: 'M0 0L400 0L400 212L0 212Z' },
    { c: PAL.green, o: 0.45, d: 'M0 212C100 206 300 208 400 212L400 300L0 300Z' },
  ],
  fine: [tufts([[20, 240], [40, 286], [384, 236], [250, 228]], 9, 21), hatch(10, 296, 390, 296, 8, 6, 170, 5)],
  parts: [
    place(cottage({ dark: false }), 'translate(334 210) scale(0.55)'),
    place(
      mother({
        mood: 'shut',
        tilt: 14,
        arms: [
          [[-17, -102, 8], [-26, -88, 7.5], [-28, -74, 7]],
          [[17, -102, 8], [40, -88, 7.5], [66, -72, 7]],
        ],
      }),
      M,
    ),
    place(
      jack({
        mood: 'laugh',
        tilt: -8,
        arms: [
          [[-16, -84, 8], [-28, -82, 7.5], [-38, -78, 7]],
          [[16, -84, 8], [24, -70, 7.5], [28, -58, 7]],
        ],
      }),
      J,
    ),
    place(eggBasket(), 'translate(298 290) scale(1.4)'),
    place(shine(26), 'translate(298 244)'),
    place(hen(), 'translate(366 290) scale(-1.4 1.4)'),
  ],
});
