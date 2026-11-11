import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place, pot, spoon, steam, stick, traveller } from './characters.mjs';

// Stone Soup, 1 (cover): the smiling traveller stirs his big black pot over a little fire with a long
// wooden spoon; the round grey stone lies in the bubbling water.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const T = 'translate(112 272) scale(1.18)';
const P = 'translate(262 268) scale(1.15)';

export default compose({
  title: 'Stone Soup',
  seed: 71,
  washes: [{ c: PAL.ochre, o: 0.35, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' }],
  lines: [ground],
  fine: [hatch(14, 284, 386, 286, 12, 8, 172, 4), tufts([[22, 270], [380, 268], [176, 272]], 9, 6)],
  parts: [
    place(stick(), 'translate(62 274) rotate(-4) scale(1.12)'),
    place(
      traveller({
        mood: 'happy',
        tilt: 6,
        arms: [
          [[-22, -108, 11], [-32, -96, 10], [-40, -86, 10], [-44, -82, 10]],
          [[22, -108, 11], [38, -112, 10], [50, -118, 10], [58, -124, 10]],
        ],
      }),
      T,
    ),
    place(spoon(60, { bowl: false }), 'translate(172 119) rotate(-68)'),
    place(pot({ inside: 'water' }), P),
    place(steam(3, 56), 'translate(262 122)'),
  ],
});
