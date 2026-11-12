import { PAL, hatch, tufts } from '../lib.mjs';
import { boot, compose, place, puss, pussLocal, youth } from './characters.mjs';

// Puss in Boots, 2: Puss already has one red boot on; standing on it, he lifts his bare foot and
// holds the second boot open in both paws, ready to pull it on. The miller's son, in his old
// patched clothes, throws up his hands in surprise.
const ground = 'M20 268C100 264 220 270 300 266C340 265 370 268 384 267';
const lean = 8;
// the second boot, held up by its cuff beside the bare foot (in Puss's own coordinates)
const B = [50, -66];
const paw = (dx, dy) => pussLocal(B[0] + dx, B[1] + dy, lean);
const P = 'translate(250 268) scale(1.35)';

export default compose({
  title: 'A pair of red boots',
  seed: 103,
  washes: [{ c: PAL.green, o: 0.38, d: 'M16 266C100 260 220 266 300 262C340 261 370 264 388 264L388 290C300 294 100 294 16 290Z' }],
  lines: [ground],
  fine: [tufts([[34, 268], [372, 266], [196, 268]], 10, 4), hatch(30, 280, 370, 282, 10, 8, 172, 9)],
  parts: [
    place(
      youth({
        mood: 'wow',
        tilt: 6,
        arms: [
          [[-21, -108, 9], [-32, -114, 8.5], [-38, -126, 8.5], [-40, -136, 8.5]],
          [[21, -108, 9], [32, -114, 8.5], [38, -126, 8.5], [40, -136, 8.5]],
        ],
      }),
      'translate(104 268) scale(1.28)',
    ),
    place(
      puss({
        mood: 'happy',
        lean,
        tail: 'left',
        tilt: 6,
        legs: [
          { hip: [-9, -52], top: [-10, -34], toe: -1 },
          { hip: [9, -52], top: [28, -38], toe: 1, bare: true, turn: 30 },
        ],
        arms: [
          [[-15, -80, 8], [-30, -86, 7], [-40, -96, 7]],
          [[15, -80, 8], [32, -74, 7], [...paw(2, -4), 7]],
        ],
      }),
      P,
    ),
    place(boot(), `${P} translate(${B[0]} ${B[1]}) rotate(-34)`),
    // little marks: the boot wiggles
    { fine: ['M318 196q6 -2 8 -9M322 206q8 0 12 -8M188 212l-8 -4M186 222l-9 0'] },
  ],
});
