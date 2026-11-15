import { PAL, hatch, rays } from '../lib.mjs';
import { KR_ARMS, basket, brother, compose, handAt, kongRong, pear, place } from './characters.mjs';

// Kong Rong and the Pears, 2: Kong Rong, beaming, holds the smallest pear up high in one hand and
// with the other gives a big pear to his little brother, who reaches for it with a grin. The basket
// of pears waits on the floor, and the round window from the cover is behind them.
const ground = 'M0 263C90 260 190 265 290 262C340 261 370 263 400 261';
const window = 'M300 70C300 48 317 30 339 30C361 30 378 48 378 70C378 92 361 110 339 110C317 110 300 92 300 70Z';
const windowIn = 'M308 70C308 53 322 38 339 38C356 38 370 53 370 70C370 87 356 102 339 102C322 102 308 87 308 70Z';
const moon = 'M342 58C342 52 347 47 353 47C359 47 364 52 364 58C364 64 359 69 353 69C347 69 342 64 342 58Z';

const [KX, KS] = [168, 1.45];
const at = ([x, y]) => [KX + x * KS, 262 + y * KS];
const [sx, sy] = at(handAt(KR_ARMS.share[0], 5)); // the hand holding up the small pear
const [bx, by] = at(handAt(KR_ARMS.share[1], 5)); // the hand giving the big pear

export default compose({
  title: 'Kong Rong shares the pears',
  seed: 43,
  washes: [
    { c: PAL.ochre, o: 0.22, d: 'M0 232C100 228 300 234 400 230L400 290C300 294 100 292 0 290Z' },
    { c: PAL.sky, o: 0.45, d: windowIn },
    { c: PAL.slate, o: 0.22, d: windowIn },
    { c: PAL.ochre, o: 0.8, d: moon },
    { c: PAL.ochre, o: 0.25, d: `M${sx - 26} ${sy - 14}C${sx - 26} ${sy - 44} ${sx + 26} ${sy - 44} ${sx + 26} ${sy - 14}C${sx + 26} ${sy + 8} ${sx - 26} ${sy + 8} ${sx - 26} ${sy - 14}Z` },
  ],
  lines: [ground, window, windowIn],
  fine: [hatch(10, 278, 390, 278, 12, 7, 165, 5), 'M339 30L339 38M339 102L339 110M300 70L308 70M370 70L378 70', rays(sx, sy - 16, 19, 28, 9, 4, 10)],
  parts: [
    place(basket(), 'translate(58 226) scale(1.05)'),
    place(brother({ look: [-1, -0.6] }), 'translate(300 262) scale(1.35)'),
    place(kongRong({ mood: 'happy', look: [0.9, 0], arms: KR_ARMS.share }), `translate(${KX} 262) scale(${KS})`),
    pear(sx, sy - 9, 0.6, { tilt: -6 }),
    pear(bx + 14, by - 2, 1.35, { tilt: 8 }),
  ],
});
