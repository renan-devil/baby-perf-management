import { PAL, transformPath } from '../lib.mjs';
import { compose, goat, place } from './characters.mjs';

// The Two Goats, 2: they pushed and pushed until the log wobbled, and SPLASH! Both goats tumble off
// into the cold stream, legs in the air, with big drops flying everywhere. The empty log still wobbles
// above them between the rocky banks.
const leftBank = 'M0 40C16 36 30 40 42 48C52 90 46 140 58 176C64 196 56 230 50 300';
const rightBank = 'M400 36C384 32 370 38 358 46C348 90 354 140 342 176C336 196 344 230 350 300';
const leftRocks = 'M6 110C16 100 30 102 36 114M14 178C24 170 38 172 42 184M4 236C14 226 30 228 34 240';
const rightRocks = 'M394 108C384 98 370 100 364 112M386 180C376 172 362 174 358 186M396 238C386 230 372 232 366 244';
// The log, tipped a little and shaking: wobble marks at both ends.
const LT = 'translate(0 -48) rotate(-3 200 98)';
const logRaw = 'M30 92C120 99 280 99 370 90L372 104C280 113 120 113 28 106Z';
const log = transformPath(logRaw, LT);
const logEnds = transformPath('M30 92C24 94 24 104 28 106M370 90C376 92 377 102 372 104', LT);
const logBark = transformPath('M90 104c20 1 40 1 60 1M220 104c24 0 40 -1 58 -2M170 99c14 1 26 1 36 0', LT);
const wobble = 'M16 34c-5 8 -5 18 0 26M8 38c-4 6 -4 12 0 18M386 26c5 8 5 18 0 26M394 30c4 6 4 12 0 18M120 30l-3 -9M128 29l-1 -10M272 24l3 -9M280 23l1 -10';
// The stream, its splashing surface and the spray thrown up round each goat.
const water = 'M54 228C120 222 280 222 346 226L344 300L56 300Z';
const surface = 'M54 228C70 225 86 226 96 230M304 230C316 225 332 224 346 226';
// Splash sheets thrown up where the goats hit the water: spiky tops (inked) over a flat base (not inked).
function spray(x0, x1, base, heights) {
  const step = (x1 - x0) / (2 * heights.length);
  let top = `M${x0} ${base}`;
  heights.forEach((h, i) => {
    top += `L${x0 + (2 * i + 1) * step} ${base - h}L${x0 + (2 * i + 2) * step} ${i === heights.length - 1 ? base : base - 8}`;
  });
  return { top, shape: `${top}C${x1 - 10} ${base + 6} ${x0 + 10} ${base + 6} ${x0} ${base}Z` };
}
const sprays = [spray(92, 156, 240, [20, 46, 30, 54]), spray(184, 216, 236, [42, 62, 38]), spray(244, 308, 240, [54, 30, 46, 20])];
const ripples = 'M90 250C140 262 260 262 310 250M90 262c10 -6 20 -6 30 0M200 250c10 -6 20 -6 30 0M280 270c10 -6 20 -6 30 0M150 282c10 -6 20 -6 30 0';
const DROP = 'M0 -9C4 -3 5 2 0 5C-5 2 -4 -3 0 -9Z';
const drops = [
  [200, 158, 0, 1.9], [184, 128, -20, 1.5], [216, 126, 20, 1.5], [200, 98, 0, 1.2], [170, 102, -40, 1.1],
  [230, 100, 40, 1.1], [80, 222, -60, 1.3], [320, 222, 60, 1.3], [150, 150, -40, 1.2], [250, 150, 40, 1.2],
]
  .map(([x, y, a, s]) => transformPath(DROP, `translate(${x} ${y}) rotate(${a}) scale(${s})`))
  .join('');

export default compose({
  title: 'Splash!',
  seed: 67,
  washes: [
    { c: PAL.sky, o: 0.62, d: water },
    { c: PAL.grey, o: 0.65, d: `${leftBank}L0 300Z` },
    { c: PAL.grey, o: 0.65, d: `${rightBank}L400 300Z` },
    { c: PAL.slate, o: 0.3, d: 'M0 170C20 166 40 174 56 190L52 300L0 300ZM400 168C380 164 360 172 344 188L348 300L400 300Z' },
    { c: PAL.green, o: 0.55, d: 'M0 40C16 36 30 40 42 48L38 32C24 26 12 28 0 30ZM400 36C384 32 370 38 358 46L362 30C376 24 390 24 400 26Z' },
    { c: PAL.ochre, o: 0.7, d: log },
    { c: PAL.terracotta, o: 0.4, d: transformPath('M28 106C120 113 280 113 372 104L372 98C280 106 120 106 28 100Z', LT) },
    { c: PAL.sky, o: 0.75, d: `${sprays.map((x) => x.shape).join('')}${drops}` },
  ],
  lines: [leftBank, rightBank, log],
  fine: [logEnds, logBark, leftRocks, rightRocks, wobble, surface, ripples, ...sprays.map((x) => x.top), drops],
  parts: [
    place(goat({ coat: 'white', pose: 'tumble', mood: 'splash' }), 'translate(98 106) rotate(160) scale(-0.95 0.95)'),
    place(goat({ coat: 'brown', pose: 'tumble', mood: 'splash' }), 'translate(302 106) rotate(-160) scale(0.95)'),
  ],
});
