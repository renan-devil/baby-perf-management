import { PAL, hatch, rays, tufts, zed } from '../lib.mjs';
import { cat, compose, dog, duck, grain, hen, henWingTip, place, wheat } from './characters.mjs';

// The Little Red Hen, 1 (cover): the little red hen stands proudly in front and holds up the grain of
// wheat she has found, while behind her the duck sits about, the cat sleeps curled up and the dog
// lies with his chin on his paws.
const S = 2.05;
const [HX, HY] = [100, 270];
const [tx, ty] = henWingTip('up');
const [gx, gy] = [HX + tx * S + 4, HY + ty * S - 6];
const back = 'M200 201C250 199 320 197 400 199';
const ground = 'M0 266C90 262 190 268 290 264C340 262 370 265 400 263';

export default compose({
  title: 'The Little Red Hen',
  seed: 61,
  washes: [
    { c: PAL.ochre, o: 0.35, d: 'M0 200C80 196 160 202 250 198C320 195 370 199 400 197L400 296C300 300 100 298 0 296Z' },
    { c: PAL.green, o: 0.35, d: 'M0 262C90 258 190 264 290 260C340 258 370 261 400 259L400 296C300 300 100 298 0 296Z' },
  ],
  lines: [ground],
  fine: [
    back,
    hatch(20, 282, 380, 284, 11, 8, 170, 4),
    tufts([[12, 263], [210, 265], [392, 261], [306, 199]], 9, 5),
    rays(gx, gy, 13, 23, 10, 7),
  ],
  once: `<path d="${zed(352, 146, 7)}${zed(362, 128, 9)}${zed(350, 102, 12)}"/>`,
  parts: [
    place(wheat(), 'translate(14 272) rotate(-8) scale(1.5)'),
    place(wheat(), 'translate(384 272) rotate(6) scale(1.4)'),
    place(duck({ pose: 'sit' }), 'translate(246 199) scale(1.28)'),
    place(cat({ pose: 'sleep' }), 'translate(338 199) scale(1.15)'),
    place(dog({ pose: 'lie' }), 'translate(322 268) scale(1.45)'),
    place(hen({ wing: 'up' }), `translate(${HX} ${HY}) scale(${S})`),
    place(grain(), `translate(${gx} ${gy}) rotate(-30) scale(1.8)`),
  ],
});
