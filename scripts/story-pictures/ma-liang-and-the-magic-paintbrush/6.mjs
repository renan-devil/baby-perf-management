import { PAL, hatch } from '../lib.mjs';
import { at, brush, compose, dot, maLiang, place, sparkle } from './characters.mjs';
import { limb } from '../stone-soup/characters.mjs';

// Ma Liang and the Magic Paintbrush, 6: locked in a room by the greedy rich man, Ma Liang paints
// a ladder on the wall, right up to the little window high above. Swish, swish, swoosh…
const M = 'translate(150 284) scale(1.42)';
const hand = [42, -122];
const [hx, hy] = at(...hand, M);
const win = 'M282 26L352 26L352 82L282 82Z';
const sill = 'M276 82L358 82L358 90L276 90Z';
// the ladder: two rails leaning from the floor to the window sill, with rungs between them
const railL = limb([[226, 286, 7], [282, 90, 6]]);
const railR = limb([[276, 286, 7], [330, 90, 6]]);
const rungs = [0.12, 0.3, 0.48, 0.66, 0.84]
  .map((t) => {
    const [x1, y1] = [226 + (282 - 226) * t, 286 + (90 - 286) * t];
    const [x2, y2] = [276 + (330 - 276) * t, 286 + (90 - 286) * t];
    return limb([[x1, y1, 5], [x2, y2, 5]]);
  });
// the locked door on the left, with a big padlock
const door = 'M10 286L10 120C10 104 78 104 78 120L78 286';
const lock = 'M54 196L70 196L70 214L54 214Z';
const shackle = 'M57 196C57 186 67 186 67 196';
const stones = 'M100 60l40 0M180 40l40 0M120 140l36 0M200 120l30 0M110 230l30 0M330 150l40 0M350 220l30 0M240 30l24 0';

export default compose({
  title: 'The painted ladder',
  seed: 866,
  washes: [
    { c: PAL.grey, o: 0.55, d: 'M0 0L400 0L400 286L0 286Z' },
    { c: PAL.sky, o: 0.8, d: win },
    { c: PAL.terracotta, o: 0.5, d: 'M0 286L400 286L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.75, d: `${door}Z` },
    { c: PAL.slate, o: 0.45, d: `${door}Z` },
    { c: PAL.slate, o: 0.9, d: lock },
    { c: PAL.ink, o: 0.4, d: lock },
    { c: PAL.ochre, o: 0.9, d: [railL, railR, ...rungs].map((d) => `${d}Z`).join('') },
    { c: PAL.terracotta, o: 0.45, d: [railL, railR, ...rungs].map((d) => `${d}Z`).join('') },
  ],
  whites: dot(330, 44, 7),
  lines: [win, sill, door, railL, railR, ...rungs, lock, shackle],
  fine: [stones, 'M44 120L44 286', 'M300 40q6 -5 12 0q6 -5 12 0', hatch(90, 292, 390, 292, 6, 6, 175, 866)],
  parts: [
    place(
      maLiang({
        mood: 'happy',
        tilt: 10,
        arms: [
          [[-16, -84, 8], [-26, -72, 7.5], [-22, -58, 7]],
          [[16, -84, 8], [32, -102, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(brush({ shine: false, wet: PAL.terracotta }), `translate(${hx} ${hy}) rotate(78) scale(1.4)`),
    { fine: [sparkle(302, 116, 7), sparkle(262, 140, 5)], washes: [{ c: PAL.ochre, o: 0.95, d: sparkle(302, 116, 7) + sparkle(262, 140, 5) }] },
  ],
});
