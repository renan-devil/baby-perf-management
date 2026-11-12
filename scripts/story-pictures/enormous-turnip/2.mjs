import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, grandpa, mound, place, toLocal, turnip } from './characters.mjs';

// The Enormous Turnip, 2: Grandpa holds the turnip's leaves and pulls with all his might, leaning
// right back, his face red, but the turnip does not move.
const GY = 262;
const TX = 272;
const TT = `translate(${TX} ${GY}) scale(0.84)`;
const G = `translate(136 ${GY}) scale(0.92)`;
const GRIP = [182, 154];
const ground = `M0 ${GY}C90 ${GY - 4} 190 ${GY + 2} 290 ${GY - 2}C340 ${GY - 4} 370 ${GY - 1} 400 ${GY - 3}`;
// effort: little strokes round Grandpa, drops of sweat
const heave = 'M84 122q-6 -6 -6 -14M76 136q-9 -3 -12 -10M74 154q-10 0 -14 -6M150 248q-6 -4 -12 -2M196 252q6 -5 12 -3';
const drops = `M80 90C77 95 77 98 80 99C83 98 83 95 80 90ZM70 102C67 107 67 110 70 111C73 110 73 107 70 102Z`;

export default compose({
  title: 'Grandpa pulls',
  seed: 43,
  washes: [{ c: PAL.ochre, o: 0.32, d: `M0 ${GY - 4}C90 ${GY - 8} 190 ${GY - 2} 290 ${GY - 6}C340 ${GY - 8} 370 ${GY - 5} 400 ${GY - 7}L400 296C300 300 100 298 0 296Z` }],
  after: [{ c: PAL.sky, o: 0.9, d: drops }],
  lines: [ground],
  fine: [hatch(14, 280, 386, 282, 12, 8, 172, 4), tufts([[24, GY], [60, GY + 1], [390, GY - 3]], 9, 6), drops],
  once: `<path d="${heave}"/>`,
  parts: [
    place(mound(124), `translate(${TX} ${GY + 1})`),
    place(
      turnip({
        leaves: [
          [-20, 120, 68, -0.25],
          [10, 116, 64, 0.1],
          [38, 124, 68, 0.32],
          [58, 112, 62, 0.36],
        ],
        grip: toLocal(...GRIP, TT),
        held: [
          [-8, 92, 56, -0.3],
          [22, 98, 58, 0.2],
        ],
      }),
      TT,
    ),
    place(
      grandpa({
        mood: 'strain',
        lean: -26,
        headTilt: -6,
        arms: [
          [toLocal(158, 162, G), toLocal(GRIP[0] - 2, GRIP[1] + 2, G)],
          [toLocal(162, 154, G), toLocal(GRIP[0] + 3, GRIP[1] - 1, G)],
        ],
        legs: [
          [[-2, -40], [-12, -6]],
          [[20, -42], [34, -6]],
        ],
      }),
      G,
    ),
  ],
});
