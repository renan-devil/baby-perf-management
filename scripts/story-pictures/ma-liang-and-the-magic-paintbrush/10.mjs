import { PAL, tufts } from '../lib.mjs';
import { at, brush, child, compose, maLiang, place, sparkle } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 10: back in his village, Ma Liang paints a kite for the
// children. Swish, swish, swoosh… and up it flies! The little girl claps and the little boy holds
// the string, laughing.
const M = 'translate(206 286) scale(1.22)';
const hand = [40, -120];
const [hx, hy] = at(...hand, M);
const G = 'translate(112 288) scale(0.9)';
const K = 'translate(318 288) scale(0.9)';
const kHand = [30, -118];
const [kx, ky] = at(...kHand, K);
// the kite: a red diamond with an ochre cross, and a tail of little bows
const kite = 'M318 30L346 56L322 96L292 60Z';
const cross = 'M318 30L322 96M292 60L346 56';
const tail = 'M322 96C316 112 330 124 322 140C316 152 326 162 320 174';
const bows = 'M314 116l8 -4l0 8ZM326 112l-4 4l6 4ZM318 148l6 -4l0 8ZM330 146l-6 2l6 6Z';
const string = `M${kx} ${ky}C${kx + 6} ${ky - 40} ${310} ${110} 318 92`;
// a little house with a curved tiled roof, at the back
const wall = 'M-4 158L70 158L70 236L-4 236Z';
const roof = 'M-10 162C10 154 60 154 78 162C84 158 88 152 90 146C70 136 0 136 -20 146Z';
const door = 'M20 236L20 198L44 198L44 236';

export default compose({
  title: 'A kite for the children',
  seed: 900,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 236L0 236Z' },
    { c: PAL.green, o: 0.55, d: 'M0 236C120 230 280 232 400 238L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.4, d: wall },
    { c: PAL.slate, o: 0.75, d: roof },
    { c: PAL.terracotta, o: 0.7, d: `${door}Z` },
    { c: PAL.red, o: 0.85, d: kite },
    { c: PAL.ochre, o: 0.9, d: bows },
  ],
  lines: [wall, roof, door, kite],
  fine: [cross, tail, bows, string, 'M-14 150C10 144 60 144 84 150', tufts([[160, 292], [256, 290], [376, 290], [40, 290]], 9, 900), sparkle(276, 40, 6), sparkle(360, 92, 5)],
  after: [{ c: PAL.ochre, o: 0.9, d: sparkle(276, 40, 6) + sparkle(360, 92, 5) }],
  parts: [
    place(
      child({
        kind: 'girl',
        mood: 'laugh',
        arms: [
          [[-16, -84, 8], [-12, -68, 7.5], [-2, -72, 7]],
          [[16, -84, 8], [14, -66, 7.5], [4, -72, 7]],
        ],
      }),
      G,
    ),
    place(
      maLiang({
        mood: 'shut',
        tilt: 8,
        arms: [
          [[-16, -84, 8], [-26, -72, 7.5], [-22, -58, 7]],
          [[16, -84, 8], [32, -102, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(brush({ shine: false, wet: PAL.red }), `translate(${hx} ${hy}) rotate(40) scale(1.4)`),
    place(
      child({
        kind: 'boy',
        mood: 'laugh',
        tilt: -6,
        arms: [
          [[-16, -84, 8], [-26, -72, 7.5], [-24, -58, 7]],
          [[16, -84, 8], [26, -102, 7.5], [kHand[0], kHand[1], 7]],
        ],
      }),
      K,
    ),
  ],
});
