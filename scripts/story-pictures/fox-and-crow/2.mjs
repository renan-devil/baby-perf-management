import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, crow, fox, place } from './characters.mjs';

// The Fox and the Crow, 2: at the foot of the tree the Fox sits with his biggest smile and calls up
// sweetly to the Crow, who is still on her branch with the cheese in her beak.
const ground = 'M0 272C80 268 180 274 280 270C330 268 370 271 400 269';
// the same tree as on the cover, its branch higher up
const trunk = 'M334 271C338 230 332 160 340 60M368 271C362 230 368 160 362 60M328 272C342 266 358 266 374 272';
const bark = 'M346 238c3 6 3 12 0 18M354 160c-3 6 -3 12 0 16M350 80c2 4 2 8 0 12';
const crown =
  'M314 50C298 42 302 18 322 16C330 -2 360 -6 374 6C386 -4 404 0 404 14L404 86C394 94 380 90 372 82C362 92 342 90 334 80C318 82 306 66 314 50Z';
const branch = 'M340 72C290 84 200 106 118 119M340 88C290 98 200 118 118 130M92 122C70 125 50 128 28 132M92 132C70 133 50 133 28 132';
const twigs = 'M66 126C60 114 56 108 48 104M262 90C268 78 276 72 286 70';
const leaves = 'M48 104C40 96 44 88 52 88C54 96 52 100 48 104ZM286 70C288 60 298 58 302 64C296 68 292 70 286 70ZM30 132C22 127 22 119 28 117C32 121 32 127 30 132Z';
// little hearts floating up from the Fox's sweet words
const heart = (x, y, s) =>
  `M${x} ${y + 3 * s}C${x - 5 * s} ${y - s} ${x - 4 * s} ${y - 5 * s} ${x} ${y - 2.5 * s}C${x + 4 * s} ${y - 5 * s} ${x + 5 * s} ${y - s} ${x} ${y + 3 * s}Z`;
const hearts = heart(160, 156, 1.5) + heart(146, 141, 1.15) + heart(160, 133, 0.85);

export default compose({
  title: 'Good morning, Madam Crow!',
  seed: 42,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M0 268C80 264 180 270 280 266C330 264 370 267 400 265L400 300L0 300Z' },
    { c: PAL.green, o: 0.66, d: 'M316 48C302 40 306 20 324 20C332 4 360 0 372 10C384 2 400 4 400 18L400 82C392 90 380 86 372 78C362 88 344 86 336 76C320 78 310 64 316 48Z' },
    { c: PAL.green, o: 0.35, d: 'M334 58C346 48 370 46 388 54C398 62 392 74 380 76C364 78 342 74 334 58Z' },
    { c: PAL.ochre, o: 0.55, d: 'M336 270C340 230 334 160 342 62L362 62C366 160 360 230 366 270Z' },
    { c: PAL.terracotta, o: 0.45, d: 'M340 73C290 85 200 107 118 120L118 129C200 117 290 97 340 87ZM92 123C70 126 50 129 28 132C50 133 70 133 92 131Z' },
    { c: PAL.green, o: 0.75, d: leaves },
    { c: PAL.rose, o: 0.8, d: hearts },
  ],
  lines: [ground, trunk, branch, twigs, crown],
  fine: [
    bark,
    leaves,
    hearts,
    hatch(346, 110, 358, 250, 8, 8, 110, 3),
    'M326 36c3 -5 8 -5 10 0M354 20c3 -5 8 -5 10 0M380 40c3 -5 8 -5 10 0',
    hatch(20, 284, 300, 286, 12, 6, 160, 6),
    tufts([[30, 271], [110, 272], [300, 271], [390, 270]], 9, 8),
  ],
  parts: [place(crow(), 'translate(130 118)'), place(fox(), 'translate(236 270) scale(-1.05 1.05)')],
});
