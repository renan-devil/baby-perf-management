import { PAL, hatch, zed } from '../lib.mjs';
import { bed, compose, merge, place, princessHead, rose, twinkle } from './characters.mjs';

// Picture 1 (cover): the princess fast asleep in her bed in the tower room, wild roses climbing
// round the window, the moon looking in.
const BED = 'translate(150 266) scale(1.45)';
const HEAD = `${BED} translate(-37 -60) rotate(-18)`;
const WIN = 'translate(78 26) scale(0.8)';

const floor = 'M14 266C120 262 280 262 390 266';

// The arched window with the night outside and a wild rose climbing round it (window-local).
const win = 'M262 206L262 96C262 50 356 50 356 96L356 206Z';
const bars = 'M309 58L309 206M262 132L356 132';
const sill = 'M252 206L366 206L366 216L252 216Z';
const moon = 'M332 80C320 76 312 88 318 100C322 108 332 110 338 104C328 104 322 92 332 80Z';
const vine =
  'M246 298C240 240 254 190 250 160C246 120 256 70 284 50C302 38 330 38 346 48C362 58 370 80 368 104C366 140 374 170 368 200C364 230 372 270 370 298';
const leaves = [
  [248, 250, 30], [244, 176, -30], [252, 120, 20], [266, 72, -40], [330, 40, 10], [362, 70, 60], [370, 150, 120], [366, 232, 160], [370, 280, 150],
].map(([x, y, a]) => {
  const r = (a * Math.PI) / 180;
  const c = Math.cos(r) * 10;
  const s = Math.sin(r) * 10;
  return `M${x} ${y}q${(c - s * 0.5).toFixed(1)} ${(s + c * 0.5).toFixed(1)} ${(c * 1.4).toFixed(1)} ${(s * 1.4).toFixed(1)}q${(-c * 0.9 + s * 0.4).toFixed(1)} ${(-s * 0.9 - c * 0.4).toFixed(1)} ${(-c * 1.4).toFixed(1)} ${(-s * 1.4).toFixed(1)}Z`;
});
const windowWithRoses = merge(
  {
    lines: [win, sill, vine],
    fine: [bars, moon, ...leaves, twinkle(282, 84, 5), twinkle(340, 150, 5), twinkle(290, 180, 4)],
    washes: [
      { c: PAL.slate, o: 0.75, d: win },
      { c: PAL.ochre, o: 1, d: moon },
      { c: PAL.grey, o: 0.6, d: sill },
      { c: PAL.green, o: 0.75, d: leaves.join('') },
    ],
  },
  rose(250, 196, 9, PAL.rose),
  rose(256, 96, 8, PAL.red),
  rose(300, 44, 9, PAL.rose),
  rose(352, 52, 8, PAL.rose),
  rose(368, 122, 9, PAL.red),
  rose(368, 186, 8, PAL.rose),
  rose(246, 140, 7, PAL.red, false),
  rose(372, 250, 8, PAL.rose, false),
  rose(244, 262, 7, PAL.red, false),
);

export default compose({
  title: 'The Sleeping Princess',
  seed: 2101,
  washes: [{ c: PAL.grey, o: 0.28, d: 'M14 266C120 262 280 262 390 266L392 284C280 288 120 288 12 284Z' }],
  lines: [floor],
  fine: [hatch(30, 276, 380, 276, 10, 6, 160, 4), zed(126, 150, 9), zed(146, 122, 12), zed(172, 86, 16)],
  parts: [place(windowWithRoses, WIN), place(bed({ hw: 70, cover: 'sleep' }), BED), place(princessHead({ mood: 'asleep', hair: 'spread' }), HEAD)],
});
