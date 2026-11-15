import { PAL, tufts } from '../lib.mjs';
import { OX_SEAT, R_ARMS, compose, ox, place, rat, water } from './characters.mjs';

// The Great Race, 1 (cover): big kind Ox swims across the wide river, and little Rat rides on his
// head, holding on to his horns. On the right, the far bank with the red finishing flag.
const OX = 'translate(190 168) scale(1.3)';
const bank = 'M296 200C312 176 350 162 400 160';
const flag = 'M362 164L362 104M362 106C370 100 378 110 386 106C382 114 374 118 362 122';
const ripples = 'M84 206q12 -6 24 0M246 206q10 -5 20 0M262 216q12 -5 24 0M120 220q14 -5 28 0M30 214q10 -4 20 0';

export default compose({
  title: 'The Great Race',
  seed: 41,
  washes: [
    { c: PAL.green, o: 0.6, d: 'M296 202C312 176 350 162 400 160L400 202Z' },
    { c: PAL.red, o: 0.85, d: 'M362 106C370 100 378 110 386 106C382 114 374 118 362 122Z' },
  ],
  lines: [bank, flag],
  fine: [ripples, tufts([[326, 178], [352, 168], [384, 162]], 7, 4)],
  parts: [
    place(ox(), OX),
    place(rat({ arms: R_ARMS.reach }), `${OX} translate(${OX_SEAT.join(' ')}) scale(0.8)`),
    water(200, { seed: 2 }),
  ],
});
