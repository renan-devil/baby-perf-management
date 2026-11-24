import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, place, peter } from '../peter-rabbit/characters.mjs';
import { PETER_MORE_POSES, benjamin, onion } from './characters.mjs';

// The Tale of Benjamin Bunny, 1 (cover): in Mr McGregor's garden, Benjamin Bunny has put on the
// scarecrow's tam-o'-shanter. It is much too big for him and comes right down over his ears, and his
// cousin Peter, in his little blue jacket, reaches out to it, laughing.
const ground = 'M0 262C90 259 190 264 290 261C340 260 370 262 400 261';

// A corner of the old brick garden wall on the left, with leaves peeping over it
const wall = 'M0 104L58 102L58 262';
const bricks = 'M0 126L58 125M0 150L58 149M0 174L58 173M0 198L58 197M0 222L58 222M0 246L58 246M28 104L28 126M14 125L14 150M42 125L42 150M28 150L28 174M14 174L14 198M42 174L42 198M28 198L28 222M14 222L14 246M42 222L42 246';
const leaves = 'M2 104C-2 86 12 78 20 90C24 74 42 74 44 90C50 80 64 84 58 102';
const veins = 'M20 90l2 12M44 90l-2 12';
// A row of cabbages behind on the right
const cabbage = 'M332 230C328 220 334 212 346 212C358 212 364 220 360 230C352 233 340 233 332 230ZM362 232C360 222 366 214 378 214C390 214 398 222 394 232C386 235 370 235 362 232Z';
const cabbageLeaves = 'M346 212C340 218 340 226 346 230M346 212C352 218 352 226 346 230M378 214C372 220 372 228 378 232M378 214C384 220 384 228 378 232';
const rows = 'M300 236C340 233 370 235 400 234';

// Onions growing in the bed in front
const ONIONS = [
  [24, 284, 0.9],
  [60, 288, 0.8],
  [350, 284, 0.9],
  [384, 288, 0.8],
];

export default compose({
  title: 'Benjamin Bunny in a tam-o’-shanter much too big for him, next to Peter',
  seed: 91,
  washes: [
    { c: PAL.terracotta, o: 0.5, d: 'M0 104L58 102L58 262L0 262Z' },
    { c: PAL.green, o: 0.75, d: `${leaves}Z` },
    { c: PAL.green, o: 0.8, d: cabbage },
    { c: PAL.ochre, o: 0.4, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.25, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
  ],
  lines: [ground, wall, leaves, cabbage],
  fine: [bricks, veins, cabbageLeaves, rows, hatch(96, 280, 310, 282, 9, 6, 165, 4), tufts([[84, 262], [196, 263], [318, 261]], 8, 5)],
  parts: [
    place(peter({ pose: PETER_MORE_POSES.stand, mood: 'happy' }), 'translate(122 190) scale(1.8)'),
    place(benjamin({ pose: 'stand', tam: true }), 'translate(272 190) scale(-1.8 1.8)'),
    ...ONIONS.map(([x, y, s]) => place(onion(), `translate(${x} ${y}) scale(${s})`)),
  ],
});
