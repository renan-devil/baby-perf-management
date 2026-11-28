import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, jug, oldWoman, place, rose, well } from './characters.mjs';

// Diamonds and Toads, 1 (cover): at the well in the wood, Rose holds up her earthenware jug so that a
// poor old woman, bent over her stick, can drink.
export const OT = 'translate(70 262) scale(1.5)';
export const RT = 'translate(190 262) scale(1.5)';
export const WT = 'translate(318 262) scale(1.3)';
const JT = `${RT} translate(-15 -62) rotate(-60) scale(1.1)`;

const ground = 'M0 262C90 258 200 266 300 260C340 258 372 260 400 259';
// a tree of the wood on the left, another far on the right
const trunkL = 'M14 262C18 220 16 160 22 110M36 262C30 220 34 170 32 110';
const crownL = 'M-10 118C-24 96 -8 64 20 66C30 40 66 40 72 64C92 70 88 104 66 110C56 126 20 130 -10 118Z';
const trunkR = 'M384 262C386 230 384 196 388 170M396 262C393 230 396 200 395 170';
const crownR = 'M366 176C356 160 368 136 388 138C396 120 420 122 422 140L422 182C408 188 380 188 366 176Z';

export default compose({
  title: 'Diamonds and Toads',
  seed: 4101,
  washes: [
    { c: PAL.green, o: 0.36, d: 'M0 258C90 254 200 262 300 256C340 254 372 256 400 255L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.5, d: 'M14 262C18 220 16 160 22 110L32 110C34 170 30 220 36 262Z' },
    { c: PAL.green, o: 0.6, d: crownL },
    { c: PAL.ochre, o: 0.45, d: 'M384 262C386 230 384 196 388 170L395 170C396 200 393 230 396 262Z' },
    { c: PAL.green, o: 0.5, d: crownR },
  ],
  lines: [ground, trunkL, crownL, trunkR, crownR],
  fine: [
    hatch(20, 80, 60, 108, 6, 8, 125, 4),
    'M14 80c3 -5 8 -5 10 0M46 60c3 -5 8 -5 10 0',
    'M24 200c3 6 3 12 0 18M28 150c-3 6 -3 12 0 16',
    hatch(60, 276, 380, 272, 14, 6, 160, 8),
    tufts([[120, 262], [250, 264], [280, 262], [50, 260], [372, 260]], 9, 6),
    // drops of water by the spout
    'M134 166q-2 4 0 6q2 -2 0 -6M140 176q-1.6 3 0 4.6q1.6 -1.6 0 -4.6',
  ],
  parts: [
    place(well(), WT),
    place(oldWoman(), OT),
    place(
      rose({
        mood: 'happy',
        look: -2,
        plaitRight: true,
        arms: [
          [[-11, -80, 7], [-18, -88, 6.5], [-21, -84, 6.5]],
          [[11, -80, 7], [4, -68, 6.5], [-14, -60, 6.5]],
        ],
      }),
      RT,
    ),
    place(jug(), JT),
  ],
});
