import { PAL, hatch, tufts } from '../lib.mjs';
import { LADY_ARMS, compose, fanchonBack, jug, lady, place, well } from './characters.mjs';

// Diamonds and Toads, 3: back at the well in the wood, a grand lady in a beautiful golden gown asks
// for a drink. Proud Fanchon folds her arms, sticks her nose in the air and turns away. Hmph!
const LT = 'translate(78 264) scale(1.42)';
const WT = 'translate(196 264) scale(1.3)';
const FT = 'translate(318 264) scale(1.5)';
const JT = 'translate(268 266) scale(1.15)';

const ground = 'M0 264C90 260 200 268 300 262C340 260 372 262 400 261';
// a tree of the wood on the far right
const trunkR = 'M384 264C386 230 384 196 388 160M396 264C393 230 396 200 395 160';
const crownR = 'M362 168C350 150 364 124 388 126C396 106 420 108 422 128L422 176C406 184 376 184 362 168Z';

export default compose({
  title: 'Diamonds and Toads',
  seed: 4103,
  washes: [
    { c: PAL.green, o: 0.36, d: 'M0 260C90 256 200 264 300 258C340 256 372 258 400 257L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.45, d: 'M384 264C386 230 384 196 388 160L395 160C396 200 393 230 396 264Z' },
    { c: PAL.green, o: 0.5, d: crownR },
  ],
  lines: [ground, trunkR, crownR],
  fine: [
    hatch(40, 278, 360, 274, 14, 6, 160, 8),
    tufts([[24, 262], [150, 264], [256, 266], [290, 263]], 9, 6),
    // "hmph!": puffs from her turned-up nose
    'M346 100q6 -4 8 -11M352 106q8 -2 12 -8M354 114q8 1 13 -3',
  ],
  parts: [
    place(well(), WT),
    place(lady({ mood: 'kind', arms: LADY_ARMS.ask }), LT),
    place(fanchonBack({ tilt: 8 }), FT),
    place(jug({ silver: true }), JT),
  ],
});
