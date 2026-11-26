import { PAL, tufts } from '../lib.mjs';
import { catSit, compose, dick, dot, girl, place } from './1.mjs';

// Dick Whittington, 4: in the street, Dick gives his only penny to a girl for her stripy cat.
const ground = 'M14 272C120 268 280 270 386 272';
const D = 'translate(126 270) scale(1.35)';
const G = 'translate(286 270) scale(1.4)';
// his hand, holding out the penny (picture coordinates)
const coin = [212, 160];

export default compose({
  title: 'A penny for a cat',
  seed: 241,
  washes: [
    { c: PAL.grey, o: 0.35, d: 'M20 272C120 266 280 268 380 272L376 284C280 288 120 288 24 284Z' },
    { c: PAL.ochre, o: 1, d: dot(coin[0], coin[1], 7) },
  ],
  lines: [ground, dot(coin[0], coin[1], 7)],
  fine: [
    `M${coin[0] - 2.5} ${coin[1] - 2}q2.5 -2 5 0q-5 3 0 5q-2.5 1.5 -5 -0.5`,
    'M196 150l-5 -5M212 143l0 -7M228 150l5 -5',
    tufts([[40, 272], [360, 272]], 8, 6),
    'M60 280l12 0M180 282l10 0M320 281l12 0',
  ],
  parts: [
    place(
      dick({
        mood: 'happy',
        look: [1.2, 0],
        arms: [
          [[-17, -40, 8], [-22, -28, 7.5], [-25, -16, 7.5], [-26, -9, 7.5]],
          [[17, -40, 8], [30, -38, 7.5], [44, -38, 7.5], [56, -40, 7.5]],
        ],
      }),
      D,
    ),
    place(
      girl({
        mood: 'happy',
        look: [-1.2, 0],
        apron: false,
        arms: [
          [[-14, -76, 7], [-22, -60, 6.5], [-20, -40, 6.5], [-8, -28, 6.5]],
          [[14, -76, 7], [22, -60, 6.5], [20, -40, 6.5], [8, -28, 6.5]],
        ],
      }),
      G,
    ),
    place(catSit({ mood: 'happy', tail: 'down', look: [-1, 0] }), `${G} translate(0 -22) scale(0.86)`),
  ],
});
