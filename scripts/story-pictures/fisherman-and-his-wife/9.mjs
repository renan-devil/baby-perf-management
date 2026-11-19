import { PAL, hatch, rays, transformPath, tufts } from '../lib.mjs';
import { HUT_DOOR, I_ARMS, I_SIL_SIT_CHEEKS, at, compose, dot, hut, ilsebill, inverse, place } from './characters.mjs';

// The Fisherman and His Wife, 9: the castle, the throne and the crown are gone. There is the tiny
// crooked hut again, just as before, and Ilsebill sits on the doorstep in her old apron, hands on her
// cheeks, very surprised. The storm has stopped: the sea is calm and blue again and the sun shines.
const ground = 'M0 266C90 263 200 268 300 265C340 264 370 266 400 265';
const H = 'translate(168 266) scale(1.9)';
const [dx] = at(H, ...HUT_DOOR);
const I = `translate(${dx} 263) scale(1.06)`;
const sea = 'M284 206C316 203 350 207 400 204';

export default compose({
  title: 'Ilsebill back at the crooked hut',
  seed: 69,
  washes: [
    { c: PAL.sky, o: 0.55, d: `${sea}L400 262C360 260 316 262 284 263Z` },
    { c: PAL.ochre, o: 0.35, d: `${ground}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.85, d: dot(352, 52, 20) },
  ],
  lines: [ground, sea, dot(352, 52, 20)],
  fine: [
    rays(352, 52, 27, 40, 12, 9),
    'M300 222q8 -4 16 0M344 236q8 -4 16 0M374 216q6 -3 12 0',
    hatch(12, 284, 388, 286, 12, 6, 165, 4),
    tufts([[22, 266], [60, 266], [292, 265], [380, 265]], 9, 5),
    // surprise marks round her head
    `M${dx - 15} 141l-5 -7M${dx} 137l0 -8M${dx + 15} 141l5 -7`,
  ],
  parts: [
    place(hut({ cut: transformPath(transformPath(I_SIL_SIT_CHEEKS, I), inverse(H)) }), H),
    place(ilsebill({ pose: 'sit', mood: 'wow', arms: I_ARMS.cheeks }), I),
  ],
});
