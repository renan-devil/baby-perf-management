import { PAL, hatch, transformPath, zed } from '../lib.mjs';
import { cat, compose, mouse, place } from './characters.mjs';

// Belling the Cat, 2: there lies the big ginger Cat, fast asleep by the fire (z z z). Far away, by a
// leg of the kitchen table, the mice peep at him: the young mouse holds the little silver bell, with
// Grandpa Mouse and a friend behind him. Who is going to tie it on?
// The fireplace on the right: a stone surround with a dark opening, two logs and the flames.
const surround = 'M270 196L270 62L400 58M270 62L260 52L400 48';
const opening = 'M292 196L292 124C292 98 314 86 338 86C362 86 384 98 384 124L384 196';
const stones = 'M270 100L292 100M270 140L292 140M270 176L292 176M384 100L400 100M384 140L400 140M384 176L400 176M320 62L320 88M360 62L360 88';
const hearth = 'M258 196L400 196';
const FT = 'translate(22 0)';
const logs = transformPath('M282 196C278 186 290 180 300 184L352 184C362 182 368 192 360 196M290 184C300 176 340 176 350 184', FT);
const logFill = transformPath('M282 196C278 186 290 180 300 184L352 184C362 182 368 192 360 196Z', FT);
const flames = transformPath('M290 182C284 160 296 140 300 120C306 136 312 128 312 112C322 130 334 136 330 150C342 142 344 130 342 120C354 140 356 164 348 182Z', FT);
const flameIn = transformPath('M304 182C300 166 308 156 312 146C316 156 322 150 324 142C330 156 330 170 326 182Z', FT);
const legL = 'M4 0L5 262M24 0L23 262';
const boards = 'M0 284C120 281 280 281 400 284M24 284L14 300M130 282L126 300M250 282L254 300M370 284L378 300';

export default compose({
  title: 'The Sleeping Cat',
  seed: 73,
  washes: [
    { c: PAL.ochre, o: 0.35, d: 'M0 262C120 258 280 258 400 262L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.3, d: 'M210 262C210 200 270 150 338 150C390 150 400 200 400 262Z' },
    { c: PAL.grey, o: 0.6, d: `M260 52L400 48L400 196L384 196L384 124C384 98 362 86 338 86C314 86 292 98 292 124L292 196L270 196L270 62Z` },
    { c: PAL.slate, o: 0.7, rule: 'evenodd', d: `${opening}Z${flames}` },
    { c: PAL.red, o: 0.85, d: flames },
    { c: PAL.ochre, o: 0.95, rule: 'evenodd', d: `${flames}${flameIn}` },
    { c: PAL.ochre, o: 0.8, d: flameIn },
    { c: PAL.terracotta, o: 0.85, d: logFill },
    { c: PAL.terracotta, o: 0.75, d: 'M4 0L24 0L23 262L5 262Z' },
  ],
  lines: [surround, opening, hearth, legL],
  fine: [stones, logs, flames, boards, zed(222, 190, 10), zed(232, 162, 13), zed(244, 128, 16), hatch(262, 204, 296, 204, 4, 6, 100, 4)],
  parts: [
    place(cat(), 'translate(312 268) scale(0.8)'),
    place(mouse({ coat: 'brown', mood: 'worried' }), 'translate(52 254) scale(0.62)'),
    place(mouse({ coat: 'grey', old: true, mood: 'worried', tail: false }), 'translate(94 256) scale(0.64)'),
    place(mouse({ coat: 'fawn', arms: 'hold', mood: 'worried', withBell: true, tail: false }), 'translate(138 258) scale(0.66)'),
  ],
});
