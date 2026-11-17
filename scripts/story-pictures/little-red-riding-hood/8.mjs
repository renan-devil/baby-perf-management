import { PAL, hatch } from '../lib.mjs';
import { FLOOR, boards, floorWash } from './6.mjs';
import { G_ARMS, bed, compose, flower, girl, place, wolf } from './characters.mjs';

// Little Red Riding Hood, 8: "All the better to EAT you with!" The wolf leaps out of bed with a roar
// (a very silly roar), and she jumps back. Her flowers fly up into the air. AAAH!
const B = 'translate(120 260)';
const flying = [
  [262, 70, PAL.red, -30],
  [300, 44, PAL.ochre, 10],
  [340, 64, PAL.sky, 40],
  [372, 40, PAL.rose, 70],
  [284, 110, PAL.rose, -60],
  [376, 100, PAL.red, 30],
];
// a burst round the roar and little leap marks
const burst = 'M232 76l12 -6M236 92l14 2M228 60l8 -10M210 54l2 -12';
const jump = 'M300 250l-8 6M318 252l0 9M338 250l8 6';

export default compose({
  title: 'All the better to eat you with!',
  seed: 127,
  washes: [floorWash],
  lines: [FLOOR],
  fine: [boards, hatch(10, 276, 390, 280, 10, 6, 170, 9), burst, jump],
  parts: [
    place(bed({ quilt: 'tossed' }), B),
    place(wolf({ pose: 'leap', mouth: 'roar', cap: true, glasses: true, dress: true }), 'translate(150 214) rotate(6) scale(0.86)'),
    ...flying.map(([x, y, c, a]) => place(flower(c, { h: 20 }), `translate(${x} ${y}) rotate(${a})`)),
    place(girl({ arms: G_ARMS.up, legs: 'jump', mood: 'scared', tilt: 8 }), 'translate(322 242) rotate(10) scale(1.2)'),
  ],
});
