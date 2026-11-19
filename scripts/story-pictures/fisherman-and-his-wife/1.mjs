import { PAL, transformPath } from '../lib.mjs';
import { at, boat, compose, fisherman, flounder, oval, place } from './characters.mjs';

// The Fisherman and His Wife, cover: out on the calm blue sea, the old fisherman sits in his little
// rowing boat and holds up the big flat flounder he has just caught. The flounder is talking to him
// ("Please let me go!"), and the fisherman stares, amazed.
const sea = 'M0 241C40 237 70 243 110 240C160 236 230 242 290 239C340 236 370 241 400 239';
const waterL = 'M0 241C30 238 60 243 104 240';
const waterR = 'M300 240C330 236 370 241 400 239';
const blade = oval(0, 0, 14, 5);
const BL = 'translate(60 270) rotate(148)';
const B = 'translate(200 228) scale(1.25)';
const F = 'translate(158 285) scale(1.35)';
const FISH = 'translate(72 -113) scale(0.95)'; // in the fisherman's own coordinates
const hold = [
  [[-15, -84, 8], [6, -70, 7], [42, -96, 6]],
  [[15, -84, 8], [40, -80, 7], [64, -96, 6]],
];
const [mx, my] = at(F, ...at(FISH, -36, 2)); // the flounder's mouth
const talk = `M${mx - 4} ${my - 10}l-4 -9M${mx - 10} ${my - 6}l-9 -5M${mx + 3} ${my - 13}l1 -9`;

export default compose({
  title: 'The fisherman and the talking flounder',
  seed: 61,
  washes: [
    { c: PAL.sky, o: 0.55, d: `${sea}L400 300L0 300Z` },
    { c: PAL.sky, o: 0.3, d: 'M0 272C80 268 160 276 240 272C300 269 360 274 400 272L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.6, d: transformPath(blade, BL) },
  ],
  lines: [waterL, waterR, 'M124 226L72 262', transformPath(blade, BL)],
  fine: [
    talk,
    'M22 258q8 -5 16 0M326 258q8 -5 16 0M354 280q8 -5 16 0M100 284q8 -5 16 0M230 288q8 -5 16 0',
    'M84 252q10 -4 20 0M298 250q10 -4 20 0',
    'M318 48q6 -6 12 0q6 -6 12 0M348 72q4 -4 8 0q4 -4 8 0',
  ],
  parts: [
    place(boat(), B),
    place(fisherman({ mood: 'wow', arms: hold, legs: false, look: [1.6, -0.3] }), F),
    place(place(flounder({ talk: true, look: [-1.2, 0.6] }), FISH), F),
  ],
});
