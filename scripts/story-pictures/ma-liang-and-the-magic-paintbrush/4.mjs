import { PAL, hatch } from '../lib.mjs';
import { at, bird, brush, compose, maLiang, place } from './characters.mjs';
import { limb } from '../stone-soup/characters.mjs';

// Ma Liang and the Magic Paintbrush, 4: swish, swish, swoosh… and it came to life! The little
// bird Ma Liang has just painted flies right off the paper on the table, and he watches, amazed.
const M = 'translate(104 286) scale(1.5)';
const hand = [40, -76];
const [hx, hy] = at(...hand, M);
const top = 'M190 214L340 214L352 226L178 226Z';
const legs = [limb([[192, 226, 7], [194, 276, 7]]), limb([[338, 226, 7], [336, 276, 7]])];
const paper = 'M206 210L318 206L326 218L200 222Z';
// where the bird was painted: an empty, faint outline on the paper
const ghost = 'M246 214C248 210 258 208 266 209C272 210 274 213 272 216C268 218 254 219 246 216Z';
const trail = 'M262 204C258 178 262 150 282 128M276 206C280 182 286 160 300 142';

export default compose({
  title: 'The bird flies off the paper',
  seed: 844,
  washes: [
    { c: PAL.ochre, o: 0.22, d: 'M0 0L400 0L400 262L0 262Z' },
    { c: PAL.terracotta, o: 0.35, d: 'M0 262C120 258 280 258 400 262L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.75, d: top + legs.map((d) => `${d}Z`).join('') },
    { c: PAL.ochre, o: 0.4, d: top },
  ],
  whites: paper,
  lines: [top, ...legs, paper],
  fine: [ghost, trail, 'M268 112q-8 5 -16 3M272 124q-8 5 -15 4', hatch(30, 284, 380, 284, 6, 8, 175, 844), 'M184 232L346 232'],
  parts: [
    place(
      maLiang({
        mood: 'wowR',
        tilt: 6,
        arms: [
          [[-16, -84, 8], [-26, -72, 7.5], [-20, -58, 7]],
          [[16, -84, 8], [30, -82, 7.5], [hand[0], hand[1], 7]],
        ],
      }),
      M,
    ),
    place(brush({ shine: false, wet: PAL.red }), `translate(${hx} ${hy}) rotate(121) scale(1.4)`),
    place(bird({ wings: 'up' }), 'translate(318 96) rotate(-24) scale(1.7)'),
  ],
});
