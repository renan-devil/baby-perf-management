import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, goat, place } from './characters.mjs';

// The Two Goats, 1 (cover): a narrow log lies across a fast mountain stream between two rocky banks.
// The White Goat steps on from the left and the Brown Goat from the right: clip, clop! They walk
// towards each other, heads up, each sure the other will move back.
const leftBank = 'M0 150C20 146 40 150 56 158C66 176 64 204 74 226C80 242 70 262 60 300';
const rightBank = 'M400 146C380 142 360 148 346 156C334 176 338 204 326 226C320 244 330 266 340 300';
const leftRocks = 'M8 196C18 186 34 188 40 200M20 236C30 228 44 230 48 242M4 272C14 262 30 264 34 276';
const rightRocks = 'M392 192C382 182 366 184 360 196M382 238C372 230 358 232 352 244M396 270C386 262 372 264 366 276';
// The log: a long narrow trunk, its cut ends showing rings, a knot and a stub of branch.
const log = 'M36 158C120 165 280 165 364 156L366 170C280 179 120 179 34 172Z';
const logEnds = 'M36 158C30 160 30 170 34 172M364 156C370 158 371 168 366 170';
const logBark = 'M90 170c20 1 40 1 60 1M220 170c24 0 40 -1 58 -2M170 165c14 1 26 1 36 0M300 166c12 0 22 -1 30 -2';
const water = 'M62 192C120 186 280 186 338 190L336 300L64 300Z';
const waves = 'M90 214c10 -6 20 -6 30 0M150 230c10 -6 20 -6 30 0M230 216c10 -6 20 -6 30 0M270 244c10 -6 20 -6 30 0M110 262c10 -6 20 -6 30 0M200 276c10 -6 20 -6 30 0M300 280c8 -5 16 -5 24 0';
const rushLines = 'M70 206l40 -1M200 206l50 0M120 250l30 0M240 262l36 -1M90 288l40 0';
const peaks = 'M120 70L160 36L196 70M180 56L224 22L270 70';

export default compose({
  title: 'The Two Goats',
  seed: 61,
  washes: [
    { c: PAL.sky, o: 0.6, d: water },
    { c: PAL.grey, o: 0.65, d: `${leftBank}L0 300Z` },
    { c: PAL.grey, o: 0.65, d: `${rightBank}L400 300Z` },
    { c: PAL.slate, o: 0.3, d: 'M0 230C20 226 40 232 64 250L60 300L0 300ZM400 226C380 222 360 230 336 246L340 300L400 300Z' },
    { c: PAL.green, o: 0.55, d: 'M0 150C20 146 40 150 56 158L50 142C30 136 14 138 0 140ZM400 146C380 142 360 148 346 156L352 140C370 134 388 134 400 136Z' },
    { c: PAL.ochre, o: 0.7, d: log },
    { c: PAL.terracotta, o: 0.4, d: 'M34 172C120 179 280 179 366 170L366 164C280 172 120 172 34 166Z' },
    { c: PAL.slate, o: 0.25, d: `${peaks}Z` },
  ],
  lines: [leftBank, rightBank, log],
  fine: [
    logEnds,
    logBark,
    leftRocks,
    rightRocks,
    waves,
    'M36 162c3 2 3 6 0 7M366 160c3 2 3 6 0 7',
    hatch(4, 214, 50, 214, 5, 7, 120, 4),
    hatch(352, 214, 396, 214, 5, 7, 60, 5),
    tufts([[12, 146], [42, 150], [366, 146], [392, 142]], 9, 6),
  ],
  once: `<path d="${rushLines}" stroke-dasharray="6 6"/><path d="${peaks}" stroke-dasharray="14 5" opacity="0.5"/>`,
  parts: [
    place(goat({ coat: 'white' }), 'translate(98 166)'),
    place(goat({ coat: 'brown' }), 'translate(302 166) scale(-1 1)'),
  ],
});
