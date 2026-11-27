import { PAL, hatch } from '../lib.mjs';
import { K_ARMS, at, compose, dot, king, place, sole } from './characters.mjs';

// Picture 1 (cover): the puzzled King, crown askew, scratching his head and holding up a pair of
// little dancing shoes worn right through the soles.
const K = 'translate(170 270) scale(1.32)';
const [hx, hy] = at(...K_ARMS.puzzle[1][3].slice(0, 2), K);
const S1 = 'translate(250 160) rotate(-10) scale(1.75)';
const S2 = 'translate(304 154) rotate(9) scale(1.75)';
const [t1x, t1y] = at(0, -24, S1);
const [t2x, t2y] = at(0, -24, S2);
const ribbons = `M${hx - 2} ${hy + 2}C${hx - 8} ${hy + 20} ${t1x + 4} ${t1y - 16} ${t1x} ${t1y}M${hx + 2} ${hy + 3}C${hx + 14} ${hy + 18} ${t2x - 6} ${t2y - 16} ${t2x} ${t2y}`;
const question = (x, y, s) => ({
  fine: [place({ lines: [`M-6 -8C-6 -17 7 -17 7 -8C7 -2 0 -2 0 5`] }, `translate(${x} ${y}) scale(${s})`).lines[0]],
  fills: [dot(x, y + 11 * s, 1.8 * s)],
});
const q1 = question(96, 64, 1.3);
const q2 = question(66, 96, 0.9);

export default compose({
  title: 'The Puzzled King',
  seed: 4101,
  washes: [{ c: PAL.grey, o: 0.35, d: 'M80 272C100 262 250 262 270 272C250 280 100 280 80 272Z' }],
  lines: [],
  fine: [ribbons, ...q1.fine, ...q2.fine, hatch(70, 276, 290, 276, 9, 6, 180, 4)],
  fills: q1.fills.join('') + q2.fills.join(''),
  parts: [place(king({ mood: 'puzzled', look: 1, arms: K_ARMS.puzzle, tilt: 20 }), K), place(sole(), S1), place(sole(), S2)],
});
