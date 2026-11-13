import { PAL, hatch, tufts } from '../lib.mjs';
import { GB_LEGS, compose, gingerbread, oldMan, oldWoman, place } from './characters.mjs';

// The Gingerbread Man, 2: down the road he runs, laughing over his shoulder, and the little old man
// and the little old woman run after him as fast as they can, waving their arms: "Stop! Stop!"
// the road's near edge (its far edge is only the edge of the wash, so no line runs behind them)
const road = 'M0 286C120 280 260 282 400 274';
const roadWash = 'M0 236C100 230 220 232 400 226L400 274C260 282 120 280 0 286Z';
// puffs of dust kicked up behind them, and speed marks
const dust = 'M24 262c-6 -2 -8 -8 -2 -10c0 -6 8 -6 10 -2c6 -2 10 4 6 8c-2 4 -10 6 -14 4ZM136 266c-5 -2 -6 -7 -1 -8c0 -5 7 -5 8 -1c5 -1 8 3 5 6c-2 3 -8 5 -12 3ZM262 252c-5 -2 -6 -7 -1 -8c0 -5 7 -5 8 -1c5 -1 8 3 5 6c-2 3 -8 5 -12 3Z';
const speed = 'M262 178l-18 0M266 196l-22 1M262 214l-14 0';
// the Gingerbread Man looks back at them over his shoulder, arms flung out
const arms = [
  [[-20, -56], [-32, -62]],
  [[22, -46], [34, -40]],
];

export default compose({
  title: 'Run, run, as fast as you can!',
  seed: 62,
  washes: [
    { c: PAL.ochre, o: 0.38, d: roadWash },
    { c: PAL.grey, o: 0.5, d: dust },
  ],
  lines: [road],
  fine: [
    dust,
    speed,
    tufts([[12, 236], [136, 232], [262, 230], [392, 226]], 9, 4),
    hatch(30, 296, 380, 290, 10, 7, 172, 5),
  ],
  parts: [
    place(oldMan(), 'translate(72 270) scale(1.22)'),
    place(oldWoman(), 'translate(194 274) scale(1.22)'),
    place(gingerbread({ arms, legs: GB_LEGS.run, mood: 'laugh' }), 'translate(334 254) rotate(8) scale(1.25)'),
  ],
});
