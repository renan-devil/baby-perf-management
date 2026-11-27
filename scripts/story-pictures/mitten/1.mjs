import { PAL, hatch } from '../lib.mjs';
import { closed, compose, dog, grandfather, littleMitten, place } from './characters.mjs';

// The Mitten, 1 (cover): Grandfather walks home through the snowy forest with his little dog, and one
// red mitten slips off his hand and drops behind him in the snow. The snow is the paper itself.
const snow = 'M0 222C60 216 120 220 180 226C250 232 320 222 400 218';
const snowShade =
  'M0 224C60 218 120 222 180 228C250 234 320 224 400 220L400 236C320 238 250 246 180 242C120 238 60 236 0 238Z' +
  'M120 268C170 262 230 264 280 272C230 278 170 278 120 268Z';

// a snowy fir on the left: three tiers, snow (paper) along the top of each
const fir = closed([[64, 60], [44, 102], [54, 101], [32, 146], [46, 144], [22, 190], [106, 190], [82, 144], [96, 146], [74, 101], [84, 102]]);
const firSnow = 'M64 62C58 76 52 88 46 100C54 96 60 92 64 92C70 94 76 98 82 100C76 88 70 76 64 62ZM50 138C56 132 64 130 70 134C74 130 82 134 88 140M34 186C44 178 56 178 64 184C72 178 88 178 100 186';
const trunk = 'M58 190L58 224M70 190L70 224';
// a bare tree on the right
const bare = 'M366 226C364 190 368 150 362 100M378 226C378 190 380 150 376 100M366 160C352 146 344 132 336 124M370 140C384 126 394 114 398 108M364 118C356 104 352 92 350 80M376 112C382 98 384 86 390 76';

// where the mitten is falling, with little speed marks above it and a puff of snow where it lands
const M = 'translate(146 200) rotate(-24) scale(1.05)';
const fall = 'M128 150q-3 7 0 14M140 144q-3 8 0 16M152 148q-3 6 0 12';
const flakes = [[30, 30], [120, 40], [180, 24], [250, 50], [320, 30], [370, 60], [210, 90], [300, 110], [140, 110], [20, 120], [390, 150]]
  .map(([x, y]) => `M${x - 2.5} ${y}l5 0M${x} ${y - 2.5}l0 5`)
  .join('');
// footprints in the snow behind Grandfather
const prints = [[90, 238], [112, 242], [134, 240], [158, 245], [182, 243], [204, 247]].map(([x, y]) => `M${x - 4} ${y}q4 -2.5 8 0q-4 2.5 -8 0`).join('');

export default compose({
  title: 'Grandfather and the red mitten',
  seed: 61,
  washes: [
    { c: PAL.sky, o: 0.3, d: snowShade },
    { c: PAL.sky, o: 0.16, d: 'M0 0L400 0L400 120C300 110 200 128 100 116C60 112 20 116 0 120Z' },
    { c: PAL.green, o: 0.62, d: fir },
    { c: PAL.ochre, o: 0.55, d: 'M58 190L70 190L70 224L58 224Z' },
    { c: PAL.grey, o: 0.55, d: 'M367 226C365 190 369 150 363 102L375 102C379 150 377 190 377 226Z' },
  ],
  whites: firSnow,
  lines: [snow, fir, trunk, bare],
  fine: [firSnow, fall, hatch(96, 252, 300, 256, 9, 7, 170, 4), hatch(20, 244, 80, 240, 4, 6, 170, 5), 'M128 210q6 -6 12 -2M152 208q6 -6 12 0'],
  once: flakes + prints,
  parts: [place(grandfather(), 'translate(238 246) scale(1.15)'), place(dog(), 'translate(322 246) scale(1.45)'), place(littleMitten(), M)],
});
