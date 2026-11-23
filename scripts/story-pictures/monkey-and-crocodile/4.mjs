import { PAL } from '../lib.mjs';
import { BACK, M_POSE, compose, dot, monkey, place, ripple, swimCroc } from './characters.mjs';

// The Monkey and the Crocodile, 4: right in the middle of the wide river, far from both banks, the
// crocodile turns his head round to tell the truth, and the monkey on his back thinks very hard, one
// finger on his chin.
const CT = 'translate(262 206) scale(1.3)';
const seat = BACK(-112);
const MT = `${CT} translate(${seat[0]} ${seat[1] + 2}) scale(1.25)`;
// his head turned right round to look back at the monkey, on a short curved neck
const HEAD = 'translate(22 -46) rotate(8) scale(-1 1)';
const NECK = 'M0 10C16 6 26 -10 25 -30C24 -40 24 -50 23 -58M-8 -21C-2 -26 1 -31 2 -37';
// (drawn the same way round as his body's wash, so the two join without a gap)
const NECK_FILL = 'M-6 10L-8 -21C-2 -26 1 -31 2 -40L23 -58C24 -50 24 -40 25 -30C26 -10 16 6 0 10Z';

const river = 'M0 104C100 100 300 104 400 100L400 280C300 288 200 280 100 286C60 288 30 284 0 288Z';
// the banks, far away on both sides
const farBanks = 'M0 103C20 101 40 102 58 100M344 100C364 99 382 100 400 99';
const waterline = 'M48 219C80 218 110 220 140 219M276 219C300 220 330 218 356 219';
// what the monkey is thinking: little bubbles rising to a curly question mark
const thought = 'M122 46C122 36 136 34 138 42C140 50 130 52 130 60M130 68l0.1 0.1';
const bubbles = dot(132, 94, 2) + dot(128, 84, 2.8);

export default compose({
  title: 'In the middle of the river',
  seed: 704,
  washes: [
    { c: PAL.sky, o: 0.5, d: river },
    { c: PAL.sky, o: 0.35, d: 'M0 196C120 192 260 198 400 194L400 276C300 284 200 276 100 282C60 284 30 280 0 284Z' },
    { c: PAL.green, o: 0.5, d: 'M0 103C20 101 40 102 58 100L58 104L0 106ZM344 100C364 99 382 100 400 99L400 103L344 104Z' },
  ],
  lines: [farBanks],
  fine: [
    waterline,
    thought,
    bubbles,
    ripple(120, 140, 24),
    ripple(230, 124, 22),
    ripple(350, 150, 24),
    ripple(30, 170, 22),
    ripple(40, 256, 28),
    ripple(190, 262, 30),
    ripple(340, 252, 26),
  ],
  parts: [place(swimCroc({ mood: 'talk', head: HEAD, neck: NECK, neckFill: NECK_FILL, look: [0.8, 0.6] }), CT), place(monkey({ mood: 'think', pose: M_POSE.think }), MT)],
});
