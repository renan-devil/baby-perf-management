import { PAL, tufts } from '../lib.mjs';
import { at, bird, brush, compose, dot, maLiang, place, sparkle } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 1 (the cover): Ma Liang holds up the shining golden
// paintbrush and smiles, while a little painted bird flutters past.
const M = 'translate(190 290) scale(1.55)';
const hand = [42, -114];
const [hx, hy] = at(...hand, M);
const glow = dot(hx + 12, hy - 34, 58);

export default compose({
  title: 'Ma Liang and the golden paintbrush',
  seed: 811,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 262L0 262Z' },
    { c: PAL.ochre, o: 0.45, d: glow },
    { c: PAL.green, o: 0.55, d: 'M0 264C120 258 280 260 400 266L400 300L0 300Z' },
  ],
  fine: [tufts([[48, 286], [92, 280], [318, 284], [366, 278]], 10, 811), sparkle(hx - 50, hy - 70, 7), sparkle(hx + 44, hy - 84, 6), sparkle(hx + 52, hy - 18, 5)],
  parts: [
    place(
      maLiang({
        mood: 'happy',
        tilt: 6,
        arms: [
          [[-16, -84, 8], [-26, -72, 7.5], [-22, -58, 7]],
          [[16, -84, 8], [32, -96, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(brush(), `translate(${hx} ${hy}) rotate(24) scale(1.7)`),
    { washes: [{ c: PAL.ochre, o: 0.9, d: sparkle(hx - 50, hy - 70, 7) + sparkle(hx + 44, hy - 84, 6) + sparkle(hx + 52, hy - 18, 5) }] },
    place(bird({ wings: 'up' }), 'translate(78 92) rotate(-12) scale(1.3)'),
  ],
});
