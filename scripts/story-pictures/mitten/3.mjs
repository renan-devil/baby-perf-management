import { PAL, hatch } from '../lib.mjs';
import { compose, dot, foxTail, hareEars, mitten, mittenInfo, place, wolf } from './characters.mjs';

// The Mitten, 3: four friends inside now, and the mitten is stretched round and fat, with Jumpy Hare's
// ears sticking out of the top of the cuff and Sister Fox's bushy tail hanging out of the bottom.
// Grey Wolf comes padding up through the snow and sniffs at it.
const k = 1.6;
const [mx, my] = [126, 252];
const MT = `translate(${mx} ${my}) scale(${k})`;
const { cx1, cy, ch } = mittenInfo(0.6);
const ox = mx + cx1 * k;
const oy = my + cy * k;
const oh = (ch + 2) * k; // half height of the opening

const snow = 'M300 172C340 168 370 170 400 166';
const shade =
  'M40 258C90 246 220 244 290 254C230 266 100 268 40 258Z' +
  'M300 174C340 170 370 172 400 168L400 180C370 182 330 184 300 186Z';
// the wolf's paw prints behind him
const prints = [[372, 268], [388, 274], [398, 266]].map(([x, y]) => `${dot(x, y, 2.2)}${dot(x - 3, y - 4, 1)}${dot(x + 1, y - 5, 1)}${dot(x + 4, y - 3, 1)}`).join('');
const flakes = [[40, 40], [130, 26], [250, 34], [320, 70], [380, 30], [60, 120], [350, 130]].map(([x, y]) => `M${x - 2} ${y}l4 0M${x} ${y - 2}l0 4`).join('');

export default compose({
  title: 'The mitten gets rather full',
  seed: 63,
  washes: [
    { c: PAL.sky, o: 0.3, d: shade },
    { c: PAL.slate, o: 0.35, d: prints },
  ],
  lines: [snow],
  fine: [hatch(20, 276, 110, 280, 5, 6, 170, 3), 'M240 204q-4 -4 -2 -9M232 208q-5 -3 -6 -8'],
  once: flakes,
  parts: [
    place(mitten({ fat: 0.6, creak: true, seed: 7 }), MT),
    place(hareEars(), `translate(${ox - 4} ${oy - oh + 14}) rotate(18) scale(1.6)`),
    place(foxTail(), `translate(${ox + 2} ${oy + oh - 12}) rotate(38) scale(1.45)`),
    place(wolf(), 'translate(328 260) scale(-1.2 1.2)'),
  ],
});
