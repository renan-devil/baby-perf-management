import { PAL, hatch, tufts } from '../lib.mjs';
import { cat, chick, compose, dog, duck, hen, henWingTip, loaf, oven, place } from './characters.mjs';

// The Little Red Hen, 2: the little red hen holds up the warm golden loaf she has baked all by
// herself, steam curling up from it, her two chicks at her feet. The cat, the dog and the duck,
// smelling the bread, come running.
const S = 1.6;
const [HX, HY] = [126, 268];
const [tx, ty] = henWingTip('up');
const [lx, ly] = [HX + tx * S + 26, HY + ty * S - 9];
const ground = 'M0 270C90 266 190 272 290 268C340 266 370 269 400 267';
// dust puffs behind the runners
const dust = 'M366 168l14 -4M364 178l16 0M362 188l14 4';

export default compose({
  title: 'The warm loaf',
  seed: 62,
  washes: [{ c: PAL.green, o: 0.35, d: 'M0 266C90 262 190 268 290 264C340 262 370 265 400 263L400 296C300 300 100 298 0 296Z' }],
  lines: [ground],
  fine: [hatch(20, 284, 380, 286, 11, 8, 170, 6), tufts([[244, 268], [392, 266], [74, 268]], 9, 6), dust],
  parts: [
    place(oven(), 'translate(30 269) scale(0.68)'),
    place(hen({ wing: 'up' }), `translate(${HX} ${HY}) scale(${S})`),
    place(loaf(), `translate(${lx} ${ly}) scale(1.3)`),
    place(chick(), 'translate(88 270) scale(1.2)'),
    place(chick(), 'translate(194 271) scale(-1.2 1.2)'),
    place(dog({ pose: 'run' }), 'translate(268 270) scale(-1 1)'),
    place(cat({ pose: 'run' }), 'translate(360 266) scale(-0.84 0.84)'),
    place(duck({ pose: 'run' }), 'translate(316 180) scale(-1.05 1.05)'),
  ],
});
