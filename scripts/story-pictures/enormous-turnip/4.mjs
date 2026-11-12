import { PAL, hatch, tufts } from '../lib.mjs';
import { DOG_MOUTH, DOG_TAIL, GM_H, GP_H, at, cat, compose, dog, girl, grandma, grandpa, mouse, mound, place, skirtBack, toLocal, turnip } from './characters.mjs';

// The Enormous Turnip, 4: the whole line pulls: Grandpa holds the turnip, Grandma holds Grandpa, the
// Granddaughter holds Grandma, the Dog holds her skirt and the Cat holds the Dog's tail. At the end
// of the line, a tiny mouse peeps out of a tuft of grass.
const GY = 262;
const TX = 334;
const TT = `translate(${TX} ${GY}) scale(0.6)`;
const S = 0.64;
const G = `translate(250 ${GY}) scale(${S})`;
const GRIP = [282, 188];
const L = { gp: -26, gm: -22, gd: -18 };
const M = `translate(201 ${GY}) scale(${S})`;
const D = `translate(160 ${GY}) scale(${S})`;
const gpBack = at(-15, -22, `${G} translate(0 ${-GP_H}) rotate(${L.gp})`);
const gmBack = at(-13, -18, `${M} translate(0 ${-GM_H}) rotate(${L.gm})`);
// the dog's mouth holds the back of the girl's skirt; the cat's paws hold the tip of his tail
const skirt = at(...skirtBack(4), D);
const DS = 0.7;
const DG = `translate(${skirt[0] - DOG_MOUTH.pull[0] * DS} ${GY}) scale(${DS})`;
const tail = at(...DOG_TAIL.pull, DG);
const CS = 0.62;
const C = `translate(${tail[0] - 17} ${GY}) scale(${CS})`;
const MX = 13;
const ground = `M0 ${GY}C90 ${GY - 4} 190 ${GY + 2} 290 ${GY - 2}C340 ${GY - 4} 370 ${GY - 1} 400 ${GY - 3}`;
const grass = `M${MX - 10} ${GY}q-2 -10 -7 -16M${MX - 4} ${GY}q0 -6 -2 -9M${MX + 7} ${GY}q1 -6 3 -9M${MX + 12} ${GY}q3 -8 8 -12`;
const grassFill = `M${MX - 18} ${GY}C${MX - 16} ${GY - 8} ${MX - 14} ${GY - 12} ${MX - 17} ${GY - 16}C${MX - 8} ${GY - 10} ${MX + 12} ${GY - 10} ${MX + 20} ${GY - 12}C${MX + 18} ${GY - 8} ${MX + 18} ${GY - 4} ${MX + 18} ${GY}Z`;

export default compose({
  title: 'Everybody pulls',
  seed: 53,
  washes: [{ c: PAL.ochre, o: 0.32, d: `M0 ${GY - 4}C90 ${GY - 8} 190 ${GY - 2} 290 ${GY - 6}C340 ${GY - 8} 370 ${GY - 5} 400 ${GY - 7}L400 296C300 300 100 298 0 296Z` }],
  after: [{ c: PAL.green, o: 0.75, d: grassFill }],
  lines: [ground, grass],
  fine: [hatch(14, 280, 386, 282, 12, 8, 172, 4), tufts([[390, GY - 3]], 9, 6)],
  parts: [
    place(mound(124), `translate(${TX} ${GY + 1})`),
    place(
      turnip({
        leaves: [
          [-20, 120, 68, -0.25],
          [10, 116, 64, 0.1],
          [24, 122, 66, 0.26],
          [42, 104, 60, 0.26],
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
          [toLocal(GRIP[0] - 16, GRIP[1] + 6, G), toLocal(GRIP[0] - 2, GRIP[1] + 2, G)],
          [toLocal(GRIP[0] - 13, GRIP[1], G), toLocal(GRIP[0] + 3, GRIP[1] - 1, G)],
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
          [toLocal(gpBack[0] - 11, gpBack[1] + 5, M), toLocal(gpBack[0] - 1, gpBack[1] + 2, M)],
          [toLocal(gpBack[0] - 8, gpBack[1], M), toLocal(gpBack[0] + 2, gpBack[1] - 3, M)],
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
          [toLocal(gmBack[0] - 8, gmBack[1] + 4, D), toLocal(gmBack[0] - 1, gmBack[1] + 2, D)],
          [toLocal(gmBack[0] - 6, gmBack[1], D), toLocal(gmBack[0] + 2, gmBack[1] - 2, D)],
        ],
        legs: [
          [[0, -17], [-3, -4]],
          [[9, -17], [15, -4]],
        ],
      }),
      D,
    ),
    place(dog({ pose: 'pull', mood: 'strain' }), DG),
    place(
      cat({
        mood: 'strain',
        lean: -20,
        arms: [
          [toLocal(tail[0] - 4, tail[1] + 3, C), toLocal(tail[0] + 1, tail[1] + 1, C)],
          [toLocal(tail[0] - 3, tail[1] - 1, C), toLocal(tail[0] + 3, tail[1] - 1, C)],
        ],
        legs: [
          [[-2, -6], [-6, -3]],
          [[8, -6], [12, -3]],
        ],
      }),
      C,
    ),
    place(mouse({ arms: 'peep', mood: 'happy' }), `translate(${MX} ${GY - 11}) scale(0.8)`),
  ],
});
