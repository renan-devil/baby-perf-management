import { PAL, hatch, tufts } from '../lib.mjs';
import { bird, compose, grandpa, mound, place, toLocal, turnip } from './characters.mjs';

// The Enormous Turnip, 1 (cover): Grandpa stands proudly beside his turnip, which has grown as big
// as he is. It sits half in the ground under huge green leaves; a little bird shelters under one.
const GY = 262;
const TT = `translate(254 ${GY}) scale(0.92)`;
const G = `translate(104 ${GY}) scale(0.92)`;
const ground = `M0 ${GY}C90 ${GY - 4} 190 ${GY + 2} 290 ${GY - 2}C340 ${GY - 4} 370 ${GY - 1} 400 ${GY - 3}`;

export default compose({
  title: 'The Enormous Turnip',
  seed: 41,
  washes: [{ c: PAL.ochre, o: 0.32, d: `M0 ${GY - 4}C90 ${GY - 8} 190 ${GY - 2} 290 ${GY - 6}C340 ${GY - 8} 370 ${GY - 5} 400 ${GY - 7}L400 296C300 300 100 298 0 296Z` }],
  lines: [ground],
  fine: [hatch(14, 280, 386, 282, 12, 8, 172, 4), tufts([[24, GY], [72, GY + 1], [384, GY - 3]], 9, 6)],
  parts: [
    place(mound(124), `translate(254 ${GY + 1})`),
    place(turnip(), TT),
    place(bird(), 'translate(326 182) scale(1.25)'),
    place(
      grandpa({
        mood: 'happy',
        headTilt: -4,
        arms: [
          [[-24, -104], [-12, -82]],
          [toLocal(146, 164, G), toLocal(176, 172, G)],
        ],
      }),
      G,
    ),
  ],
});
