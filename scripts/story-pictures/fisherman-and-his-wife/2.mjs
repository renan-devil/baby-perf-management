import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { HUT_DOOR, I_ARMS, I_SIL_HIPS, at, compose, hut, ilsebill, inverse, place } from './characters.mjs';

// The Fisherman and His Wife, 2: Ilsebill stands in the doorway of the tiny crooked hut by the sea,
// hands on her hips and cross: "You let him go? And you didn't wish for anything?"
const ground = 'M0 266C90 263 200 268 300 265C340 264 370 266 400 265';
const H = 'translate(168 266) scale(1.9)';
const [dx] = at(H, ...HUT_DOOR);
const I = `translate(${dx} 267) scale(1.06)`;
const sea = 'M284 206C316 203 350 207 400 204';

export default compose({
  title: 'Ilsebill in the door of the crooked hut',
  seed: 62,
  washes: [
    { c: PAL.sky, o: 0.55, d: `${sea}L400 262C360 260 316 262 284 263Z` },
    { c: PAL.ochre, o: 0.35, d: `${ground}L400 300L0 300Z` },
  ],
  lines: [ground, sea],
  fine: [
    'M300 222q8 -4 16 0M344 236q8 -4 16 0M374 216q6 -3 12 0',
    hatch(12, 284, 388, 286, 12, 6, 165, 4),
    tufts([[22, 266], [60, 266], [292, 265], [380, 265]], 9, 5),
    'M191 43c-6 -8 4 -12 -2 -20c-5 -7 4 -12 0 -18', // smoke
    `M${dx + 36} 258l7 -4M${dx + 38} 265l8 0`, // tap, tap
  ],
  parts: [place(hut({ cut: transformPath(transformPath(I_SIL_HIPS, I), inverse(H)) }), H), place(ilsebill({ mood: 'cross', arms: I_ARMS.hips }), I)],
});
