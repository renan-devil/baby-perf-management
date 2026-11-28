import { PAL, hatch } from '../lib.mjs';
import { MOTHER_ARMS, compose, diamond, flower, mother, pearl, place, rose } from './characters.mjs';

// Diamonds and Toads, 2: back home, Rose says "I'm sorry, Mother", and out of her mouth tumble roses,
// pearls and shining diamonds. Plink, plink, plonk! Her mother throws up her hands in amazement.
const RT = 'translate(112 262) scale(1.5)';
const MT = 'translate(298 262) scale(1.5)';

const floor = 'M0 262C100 258 220 265 300 260C340 258 372 260 400 259';
// a little cottage window on the wall behind them
const win = 'M178 36L230 36L230 88L178 88Z';
const winBars = 'M204 36L204 88M178 62L230 62';
const sill = 'M172 88L236 88L238 96L170 96Z';

// what falls from her mouth, along a curve down to the floor: [kind, x, y, size or turn]
const falling = [
  ['rose', 136, 130, 1.4],
  ['pearl', 152, 142],
  ['diamond', 160, 160, 1.4],
  ['rose', 170, 184, 1.3],
  ['pearl', 178, 204],
  ['diamond', 184, 224, 1.3],
];
// the little heap on the floor
const heap = [
  ['diamond', 178, 254, 1.3],
  ['rose', 196, 250, 1.3],
  ['pearl', 211, 256],
  ['pearl', 218, 248],
  ['diamond', 230, 255, 1.2],
  ['rose', 246, 253, 1.2],
  ['pearl', 190, 241],
];
const put = ([kind, x, y, s]) =>
  place(kind === 'rose' ? flower(PAL.red, s) : kind === 'pearl' ? pearl(4.2) : diamond(s), `translate(${x} ${y})`);

export default compose({
  title: 'Diamonds and Toads',
  seed: 4102,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 258C100 254 220 261 300 256C340 254 372 256 400 255L400 300L0 300Z' },
    { c: PAL.sky, o: 0.45, d: win },
    { c: PAL.terracotta, o: 0.6, d: sill },
  ],
  lines: [floor, win, sill],
  fine: [
    winBars,
    hatch(20, 280, 380, 276, 12, 10, 175, 5),
    // plink! sparkle marks near the heap
    'M166 236l-6 -4M258 242l6 -4M254 232l5 -6M198 232l0 -7M222 234l3 -6',
  ],
  parts: [
    place(
      rose({
        mood: 'talk',
        look: 1.5,
        arms: [
          [[-11, -80, 7], [-13, -66, 6.5], [-3, -60, 6.5]],
          [[11, -80, 7], [13, -66, 6.5], [3, -60, 6.5]],
        ],
      }),
      RT,
    ),
    place(mother({ mood: 'wow', arms: MOTHER_ARMS.wide, tilt: -6 }), MT),
    ...falling.map(put),
    ...heap.map(put),
  ],
});
