import { PAL, hatch, tufts } from '../lib.mjs';
import { at, buffalo, BUFFALO_NECK, compose, farmer, place, plough } from './characters.mjs';

// Ma Liang and the Magic Paintbrush, 5: the old farmer, laughing with joy, ploughs his field
// with the big grey water buffalo that Ma Liang has just painted for him.
const B = 'translate(176 254) scale(1.12)';
const P = 'translate(298 262)';
const F = 'translate(356 268) scale(1.05)';
const [bx, by] = at(-70, -38, P);
const [nx, ny] = at(...BUFFALO_NECK, B);
const rope = `M${bx} ${by}C${bx - 40} ${by - 14} ${nx + 40} ${ny + 6} ${nx} ${ny}`;
const yoke = `M${nx - 6} ${ny - 18}C${nx - 2} ${ny - 8} ${nx + 2} ${ny + 4} ${nx + 4} ${ny + 14}`;

export default compose({
  title: 'The buffalo pulls the plough',
  seed: 855,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 0L400 0L400 150L0 150Z' },
    { c: PAL.green, o: 0.5, d: 'M0 146C120 140 280 142 400 148L400 300L0 300Z' },
    // the ploughed strip behind the plough
    { c: PAL.terracotta, o: 0.5, d: 'M300 262L400 250L400 290L300 280Z' },
  ],
  lines: [rope],
  fine: [
    'M300 268L400 258M300 274L400 268M300 280L400 278',
    yoke,
    tufts([[30, 290], [70, 274], [150, 290], [262, 292]], 9, 855),
    tufts([[40, 170], [140, 160], [230, 170], [340, 160]], 7, 856),
    hatch(20, 230, 120, 230, 4, 6, 170, 857),
  ],
  parts: [
    place(buffalo(), B),
    place(plough(), P),
    place(
      farmer({
        mood: 'laugh',
        tilt: -6,
        arms: [
          [[-16, -84, 8], [-26, -70, 7.5], [-30, -60, 7]],
          [[16, -84, 8], [8, -68, 7.5], [-22, -56, 7]],
        ],
      }),
      F,
    ),
  ],
});
