import { PAL, hatch, tufts } from '../lib.mjs';
import { H_ARMS, compose, flowers, holle, marie, place } from './characters.mjs';

// Mother Holle, 5: at the end of the meadow stands a little white house with a red roof and smoke
// curling from the chimney. Mother Holle smiles from the doorway and waves; Marie, a little shy,
// looks up at her.
const ground = 'M14 268C120 265 290 265 390 268';
const wall = 'M156 268L156 116L384 116L384 268';
const roof = 'M140 120L200 52L340 52L398 120Z';
const chimney = 'M310 52L310 28L332 28L332 52';
const smoke = 'M318 22C310 16 324 10 316 2M330 20C338 14 330 8 340 2';
const door = 'M182 268L182 164C182 124 290 124 290 164L290 268';
const step = 'M178 268L294 268L296 277L176 277Z';
const win = 'M314 160L364 160L364 204L314 204ZM339 160L339 204M314 182L364 182';
const tiles = 'M166 106l14 0M196 86l14 0M236 70l14 0M276 88l14 0M316 72l14 0M350 104l14 0M300 106l14 0M220 104l14 0';
const flowerBox = 'M308 204L370 204L368 214L310 214Z';

export default compose({
  title: 'Mother Holle at Her Door',
  seed: 1405,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M10 266C120 258 290 258 394 266C390 282 300 290 200 290C110 290 14 284 10 266Z' },
    { c: PAL.grey, o: 0.14, d: `${wall}Z${door}`, rule: 'evenodd' },
    { c: PAL.red, o: 0.78, d: roof },
    { c: PAL.terracotta, o: 0.8, d: `${chimney}Z` },
    { c: PAL.ochre, o: 0.32, d: `${door}Z` },
    { c: PAL.grey, o: 0.5, d: step },
    { c: PAL.sky, o: 0.45, d: 'M314 160L364 160L364 204L314 204Z' },
    { c: PAL.terracotta, o: 0.7, d: flowerBox },
    { c: PAL.grey, o: 0.25, d: 'M312 24C304 16 320 10 312 2L342 2C334 8 342 16 332 22C328 26 318 26 312 24Z' },
  ],
  lines: [ground, wall, roof, chimney, door, win, flowerBox],
  fine: [
    step,
    smoke,
    tiles,
    hatch(30, 280, 380, 280, 12, 6, 160, 3),
    tufts([[24, 268], [130, 268], [384, 268]], 9, 3),
  ],
  parts: [
    place(holle({ mood: 'smile', look: -1, arms: H_ARMS.wave }), 'translate(236 266) scale(0.97)'),
    place(
      marie({
        mood: 'happy',
        look: 1,
        up: 1,
        tilt: 4,
        arms: [
          [[-12, -80, 7], [-16, -68, 6.5], [-12, -56, 6.5], [-4, -52, 6.5]],
          [[12, -80, 7], [16, -68, 6.5], [12, -56, 6.5], [4, -52, 6.5]],
        ],
      }),
      'translate(84 268) scale(1.1)',
    ),
    flowers([[314, 200], [328, 198], [342, 200], [356, 198], [40, 282], [360, 284], [150, 282]], 7),
  ],
});
