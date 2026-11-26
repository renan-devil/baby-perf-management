import { PAL, zed } from '../lib.mjs';
import { compose, dick, fitz, place } from './1.mjs';

// Dick Whittington, 3: tired and hungry, Dick has fallen asleep curled up on a doorstep. The kind
// merchant Mr Fitzwarren comes home and bends down to him.
const ground = 'M10 280C120 277 280 279 390 280';
const door = 'M44 226L44 100C44 64 142 64 142 100L142 226';
const frame = 'M32 226L32 98C32 50 154 50 154 98L154 226';
const planks = 'M68 226L68 72M93 226L93 66M118 226L118 72';
const step = 'M20 226L250 226L254 252L16 252Z';
const step2 = 'M8 252L262 252L266 278L4 278Z';

export default compose({
  title: 'Asleep on the doorstep',
  seed: 233,
  washes: [
    { c: PAL.terracotta, o: 0.6, d: `${door}Z` },
    { c: PAL.ochre, o: 0.4, d: `${door}Z` },
    { c: PAL.grey, o: 0.7, d: `${frame}L142 226L142 100C142 64 44 64 44 100L44 226Z` },
    { c: PAL.grey, o: 0.6, d: step + step2 },
  ],
  lines: [ground, frame, door, step, step2],
  fine: [
    planks,
    'M124 160a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z',
    'M50 120l-4 0M50 190l-4 0',
    zed(224, 100, 9),
    zed(240, 80, 12),
  ],
  parts: [
    place(
      dick({
        pose: 'sit',
        mood: 'sleep',
        tilt: 22,
        lean: 6,
        arms: [
          [[-17, -40, 8], [-18, -24, 7.5], [-8, -12, 7.5], [4, -10, 7.5]],
          [[17, -40, 8], [20, -24, 7.5], [12, -12, 7.5], [2, -6, 7.5]],
        ],
      }),
      'translate(200 228) scale(1.35)',
    ),
    place(
      fitz({
        mood: 'smile',
        lean: -16,
        arms: [
          [[-26, -96, 10], [-38, -99, 9.5], [-50, -100, 9.5]],
          [[26, -96, 10], [32, -80, 9.5], [30, -64, 9.5], [26, -56, 9.5]],
        ],
      }),
      'translate(322 280) scale(1.3)',
    ),
  ],
});
