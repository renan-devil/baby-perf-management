import { PAL } from '../lib.mjs';
import { K_ARMS, captain, catSit, compose, dot, king, place } from './1.mjs';

// Dick Whittington, 9: the happy King gives the captain a big chest full of gold for the cat. One of
// her kittens, which will sail home with the gold, sits at the King's feet.
const CH = 'translate(212 270) scale(1.3)';
const floor = 'M10 272C120 269 280 270 390 272';

// the chest, bottom centre (0,0)
const box = 'M-42 0L-42 -40L42 -40L42 0Z';
const lid = 'M-42 -40L-36 -74L48 -74L42 -40';
const bands = 'M-26 0L-26 -40M26 0L26 -40M-23 -74L-25 -62M31 -74L29 -60';
const lock = 'M-5 -32L5 -32L5 -20L-5 -20Z';
const gold = 'M-40 -40C-38 -52 -26 -58 -14 -54C-6 -62 8 -62 16 -55C26 -60 38 -54 40 -40Z';
const coins = [
  [-28, -46], [-16, -50], [-4, -54], [8, -52], [20, -50], [32, -45], [-22, -42], [-10, -44], [2, -45], [14, -43], [26, -42],
];

export default compose({
  title: 'A chest of gold for the cat',
  seed: 293,
  washes: [{ c: PAL.red, o: 0.3, d: 'M20 272C120 268 280 268 380 272L380 284C280 288 120 288 20 284Z' }],
  lines: [floor],
  parts: [
    place(
      {
        lines: [lid, box, gold],
        fine: [bands, lock, ...coins.map(([x, y]) => dot(x, y, 4)), 'M-48 -6l6 0M-66 -2l6 0'],
        washes: [
          { c: PAL.terracotta, o: 0.8, d: box },
          { c: PAL.terracotta, o: 0.7, d: `${lid}Z${gold}`, rule: 'evenodd' },
          { c: PAL.ink, o: 0.15, d: `${lid}Z${gold}`, rule: 'evenodd' },
          { c: PAL.ochre, o: 1, d: gold },
          { c: PAL.ochre, o: 0.8, d: coins.map(([x, y]) => dot(x, y, 4)).join('') },
          { c: PAL.ochre, o: 0.9, d: lock + dot(-56, -3, 4) + dot(-70, 0, 4) + dot(54, -2, 4) },
        ],
        glints: [dot(-6, -57, 1.2), dot(18, -53, 1.2), dot(-26, -49, 1.2), dot(30, -48, 1.2)],
      },
      CH,
    ),
    place({ fine: [dot(-56, -3, 4), dot(-70, 0, 4), dot(54, -2, 4)] }, CH),
    // sparkles over the gold
    { fine: ['M206 150l0 -12M200 144l12 0M250 164l0 -9M245.5 159.5l9 0M170 168l0 -8M166 164l8 0'] },
    place(
      king({
        mood: 'laugh',
        arms: [K_ARMS.down[0], [[28, -94, 11], [44, -86, 10], [60, -82, 10], [72, -82, 10]]],
      }),
      'translate(92 270)',
    ),
    place(catSit({ mood: 'happy', tail: 'left', look: [1, 0] }), 'translate(34 272) scale(0.68)'),
    place(
      captain({
        mood: 'wow',
        arms: [
          [[-22, -94, 9], [-36, -86, 8.5], [-50, -80, 8.5]],
          [[22, -94, 9], [34, -104, 8.5], [40, -118, 8.5]],
        ],
      }),
      'translate(324 270) scale(1.05)',
    ),
  ],
});
