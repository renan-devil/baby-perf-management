import { PAL, hatch, tufts } from '../lib.mjs';
import { LADY_ARMS, compose, fanchon, flower, jug, lady, place, well } from './characters.mjs';

// Diamonds and Toads, 5: back at the well, Fanchon says sorry in a tiny voice and carefully holds up
// the jug for the fairy, the grand lady again. And out of her mouth falls... a little pink rose.
const LT = 'translate(86 264) scale(1.42)';
const FT = 'translate(212 264) scale(1.5)';
const WT = 'translate(322 264) scale(1.3)';
const JT = `${FT} translate(-36 -74) scale(1.05)`;

const ground = 'M0 264C90 260 200 268 300 262C340 260 372 262 400 261';
// a tree of the wood on the far right, behind the well
const trunkR = 'M386 264C388 230 386 196 390 164M398 264C395 230 398 200 397 164';
const crownR = 'M366 172C354 154 368 128 390 130C398 112 420 114 422 132L422 180C408 188 380 188 366 172Z';

export default compose({
  title: 'Diamonds and Toads',
  seed: 4105,
  washes: [
    { c: PAL.green, o: 0.36, d: 'M0 260C90 256 200 264 300 258C340 256 372 258 400 257L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.45, d: 'M386 264C388 230 386 196 390 164L397 164C398 200 395 230 398 264Z' },
    { c: PAL.green, o: 0.5, d: crownR },
  ],
  lines: [ground, trunkR, crownR],
  fine: [
    hatch(40, 278, 380, 274, 14, 6, 160, 8),
    tufts([[150, 264], [262, 266], [24, 262], [60, 262]], 9, 6),
    // the little rose tumbling from her mouth
    'M222 128q8 -2 14 2M226 120q8 -6 16 -4',
  ],
  parts: [
    place(well(), WT),
    place(lady({ mood: 'happy', arms: LADY_ARMS.wand }), LT),
    place(
      fanchon({
        mood: 'shy',
        tilt: -8,
        look: -1.5,
        arms: [
          [[-11, -80, 7], [-22, -84, 6.5], [-30, -86, 6.5]],
          [[11, -80, 7], [2, -70, 6.5], [-30, -72, 6.5]],
        ],
      }),
      FT,
    ),
    place(jug({ silver: true }), JT),
    place(flower(PAL.rose, 1.7), 'translate(252 136) rotate(-20)'),
  ],
});
