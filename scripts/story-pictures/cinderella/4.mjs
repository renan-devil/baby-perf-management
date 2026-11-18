import { PAL } from '../lib.mjs';
import { FG_ARMS, at, coach, compose, godmother, horse, mouse, place, sparkles, wand } from './characters.mjs';

// Cinderella, 4: the magic. The fairy godmother touches the pumpkin with the star of her wand, and
// in a whirl of sparkles it has become a round golden coach on big wheels. A little grey mouse
// looks up along a trail of sparkles, and there stands a dappled grey horse with a red collar and
// an ochre plume, harnessed to the coach.
const floor = 'M8 272C120 269 290 269 394 272';
const gmT = 'translate(52 270) scale(1.3)';
const [hx, hy] = at(44, -74, gmT);
const coachT = 'translate(194 272) scale(0.9)';
const horseT = 'translate(322 272) scale(0.66)';
const [cx, cy] = at(118, -50, coachT);
const [kx, ky] = at(40, -104, horseT);
// a dotted trail of magic from the mouse to the horse
const trail = 'M318 266C308 258 298 248 294 236C290 226 292 214 298 206';

export default compose({
  title: 'The Pumpkin Coach',
  seed: 1204,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M14 270C120 262 290 262 388 270C384 280 290 284 200 284C120 284 16 280 14 270Z' },
  ],
  lines: [floor],
  fine: [`M${cx} ${cy}L${kx} ${ky}`],
  once: `<path d="${trail}" stroke-dasharray="2 5"/>`,
  parts: [
    place(coach(), coachT),
    place(horse(), horseT),
    place(godmother({ mood: 'happy', look: 1, arms: FG_ARMS.wave }), gmT),
    wand(hx, hy, hx + 30, hy - 6, 8.5),
    place(mouse(), 'translate(338 284) scale(-1.2 1.2)'),
    sparkles([
      [hx + 34, hy - 28, 7],
      [hx + 50, hy + 8, 5],
      [hx + 14, hy - 40, 4],
      [196, 76, 7],
      [252, 92, 5],
      [146, 96, 5],
      [286, 128, 5],
      [228, 54, 4],
      [304, 222, 4],
      [384, 236, 4],
      [370, 92, 5],
    ]),
  ],
});
