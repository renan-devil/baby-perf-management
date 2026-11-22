import { PAL, rays } from '../lib.mjs';
import { at, compose, dot, emperor, nightingale, palaceWindow, place } from './characters.mjs';
import { bumpy } from '../puss-in-boots/characters.mjs';

// The Nightingale, 10: in the morning sunshine, the Emperor, well again, stands at his open window
// in his yellow robe, and the little nightingale perches on his hand. "Good morning!"
const E = 'translate(126 284) scale(1.33)';
const hand = [58, -112];
const [hx, hy] = at(...hand, E);
const NB = `translate(${hx - 2} ${hy - 6 - 13 * 1.5}) scale(-1.5 1.5)`;
const WX = 252;
const WY = 56;
const WW = 100;
const WH = 116;
const sun = dot(WX + 64, WY + 38, 16);
const hills = `M${WX} ${WY + 90}C${WX + 30} ${WY + 78} ${WX + 60} ${WY + 86} ${WX + WW} ${WY + 76}L${WX + WW} ${WY + WH}L${WX} ${WY + WH}Z`;
const tree = bumpy(WX + 24, WY + 84, 11, 10, 7);

export default compose({
  title: 'Good morning, little nightingale',
  seed: 1327,
  washes: [
    { c: PAL.ochre, o: 0.16, d: 'M0 0L400 0L400 282L0 282Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M0 282L400 282L400 300L0 300Z' },
    { c: PAL.sky, o: 0.5, d: `M${WX} ${WY}L${WX + WW} ${WY}L${WX + WW} ${WY + WH}L${WX} ${WY + WH}Z${sun}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.85, d: sun },
    { c: PAL.green, o: 0.75, d: hills + tree },
  ],
  lines: ['M0 282L400 282'],
  fine: [sun, rays(WX + 64, WY + 38, 20, 28, 9, 1327), tree, `M${WX + 24} ${WY + 94}l0 8`],
  parts: [
    place(palaceWindow(WW, WH), `translate(${WX} ${WY})`),
    place(
      emperor({
        mood: 'happy',
        rosy: true,
        tilt: 6,
        arms: [
          [[-22, -116, 13], [-29, -98, 15], [-32, -80, 16]],
          [[22, -116, 13], [44, -110, 15], hand.concat(15)],
        ],
      }),
      E,
    ),
    place(nightingale({ beak: 'open' }), NB),
  ],
});
