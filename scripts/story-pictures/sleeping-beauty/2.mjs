import { PAL, hatch, rays } from '../lib.mjs';
import { F_ARMS, compose, cradle, fairy, place, sparkles, toLocal } from './characters.mjs';

// Picture 2: at the christening feast, two good fairies float down over the cradle and touch the
// sleeping baby with their wands, giving her their gifts.
const CRADLE = 'translate(200 264) scale(1.75)';
const LEFT = 'translate(82 210) rotate(10) scale(1.5)';
const RIGHT = 'translate(318 210) rotate(-10) scale(-1.5 1.5)';
const STAR_L = [172, 140];
const STAR_R = [226, 138];

const floor = 'M30 264C140 260 260 260 370 264';
const glow = ([x, y]) => `M${x - 14} ${y}a14 14 0 1 0 28 0a14 14 0 1 0 -28 0Z`;

export default compose({
  title: 'The Good Fairies’ Gifts',
  seed: 2202,
  washes: [
    { c: PAL.grey, o: 0.28, d: 'M30 264C140 260 260 260 370 264L372 282C260 286 140 286 28 282Z' },
    { c: PAL.ochre, o: 0.35, d: glow(STAR_L) + glow(STAR_R) },
  ],
  lines: [floor],
  fine: [hatch(40, 274, 360, 274, 9, 6, 160, 5), rays(...STAR_L, 9, 17, 7, 3), rays(...STAR_R, 9, 17, 7, 4, 20)],
  parts: [
    place(cradle({ mood: 'smile' }), CRADLE),
    place(fairy({ who: 'sky', mood: 'smile', arms: F_ARMS.wandOut, wandTo: toLocal(...STAR_L, LEFT) }), LEFT),
    place(fairy({ who: 'gold', mood: 'happy', look: 1, arms: F_ARMS.wandOut, wandTo: toLocal(...STAR_R, RIGHT) }), RIGHT),
    sparkles([
      [198, 118, 6],
      [150, 104, 5],
      [250, 100, 5],
      [200, 76, 6],
    ]),
  ],
});
