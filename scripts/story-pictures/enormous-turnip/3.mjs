import { PAL, hatch, tufts } from '../lib.mjs';
import { GM_H, GP_H, at, compose, girl, grandma, grandpa, mound, place, toLocal, turnip } from './characters.mjs';

// The Enormous Turnip, 3: Grandpa, Grandma and the little Granddaughter pull together in a line,
// each holding on to the one in front, and Grandpa holding the turnip's leaves.
const GY = 262;
const TX = 314;
const TT = `translate(${TX} ${GY}) scale(0.7)`;
const S = 0.8;
const G = `translate(200 ${GY}) scale(${S})`;
const GRIP = [240, 170];
const L = { gp: -26, gm: -22, gd: -18 };
const M = `translate(130 ${GY}) scale(${S})`;
const D = `translate(70 ${GY}) scale(${S})`;
// the point each one holds: the back of the waist of the one in front
const gpBack = at(-15, -22, `${G} translate(0 ${-GP_H}) rotate(${L.gp})`);
const gmBack = at(-13, -18, `${M} translate(0 ${-GM_H}) rotate(${L.gm})`);
const ground = `M0 ${GY}C90 ${GY - 4} 190 ${GY + 2} 290 ${GY - 2}C340 ${GY - 4} 370 ${GY - 1} 400 ${GY - 3}`;
const heave = 'M34 156q-6 -6 -6 -14M28 172q-9 -3 -12 -10M26 190q-10 0 -14 -6';

export default compose({
  title: 'Pulling together',
  seed: 47,
  washes: [{ c: PAL.ochre, o: 0.32, d: `M0 ${GY - 4}C90 ${GY - 8} 190 ${GY - 2} 290 ${GY - 6}C340 ${GY - 8} 370 ${GY - 5} 400 ${GY - 7}L400 296C300 300 100 298 0 296Z` }],
  lines: [ground],
  fine: [hatch(14, 280, 386, 282, 12, 8, 172, 4), tufts([[22, GY], [390, GY - 3]], 9, 6)],
  once: `<path d="${heave}"/>`,
  parts: [
    place(mound(124), `translate(${TX} ${GY + 1})`),
    place(
      turnip({
        leaves: [
          [-20, 120, 68, -0.25],
          [10, 116, 64, 0.1],
          [38, 124, 68, 0.32],
          [54, 108, 62, 0.3],
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
        lean: L.gp,
        headTilt: -6,
        arms: [
          [toLocal(220, 178, G), toLocal(GRIP[0] - 2, GRIP[1] + 2, G)],
          [toLocal(224, 170, G), toLocal(GRIP[0] + 3, GRIP[1] - 1, G)],
        ],
        legs: [
          [[-2, -40], [-12, -6]],
          [[20, -42], [34, -6]],
        ],
      }),
      G,
    ),
    place(
      grandma({
        mood: 'strain',
        lean: L.gm,
        headTilt: -4,
        sway: 8,
        arms: [
          [toLocal(gpBack[0] - 14, gpBack[1] + 6, M), toLocal(gpBack[0] - 1, gpBack[1] + 2, M)],
          [toLocal(gpBack[0] - 10, gpBack[1], M), toLocal(gpBack[0] + 2, gpBack[1] - 3, M)],
        ],
        legs: [
          [[2, -12], [10, -5]],
          [[14, -12], [22, -5]],
        ],
      }),
      M,
    ),
    place(
      girl({
        mood: 'strain',
        lean: L.gd,
        headTilt: -4,
        sway: 4,
        arms: [
          [toLocal(gmBack[0] - 10, gmBack[1] + 5, D), toLocal(gmBack[0] - 1, gmBack[1] + 2, D)],
          [toLocal(gmBack[0] - 8, gmBack[1], D), toLocal(gmBack[0] + 2, gmBack[1] - 2, D)],
        ],
        legs: [
          [[0, -17], [-3, -4]],
          [[9, -17], [15, -4]],
        ],
      }),
      D,
    ),
  ],
});
