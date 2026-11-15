import { PAL, tufts } from '../lib.mjs';
import { R_ARMS, compose, ox, place, rat, water } from './characters.mjs';

// The Great Race, 4: just as Ox reaches the bank, Rat jumps off his head… Hop! He flies over the
// water and lands on the grass first, right by the red flag. Ox looks up in surprise.
const bank = 'M232 300C236 260 238 222 250 196C270 184 320 180 400 180';
const flag = 'M372 184L372 116M372 118C380 112 388 122 396 118C392 126 384 130 372 134';
const hopArc = 'M132 96C146 62 180 50 204 70';
const speed = 'M188 104l-20 -4M186 116l-22 0M190 128l-18 4';
const ripples = 'M40 216q12 -6 24 0M190 214q10 -5 20 0M84 232q14 -5 28 0';

export default compose({
  title: 'Hop! Rat jumps first onto the bank',
  seed: 44,
  washes: [
    { c: PAL.green, o: 0.6, d: 'M232 300C236 260 238 222 250 196C270 184 320 180 400 180L400 300Z' },
    { c: PAL.red, o: 0.85, d: 'M372 118C380 112 388 122 396 118C392 126 384 130 372 134Z' },
  ],
  after: [{ c: PAL.green, o: 0.3, d: 'M232 300C236 260 238 222 250 196C270 184 320 180 400 180L400 300Z' }],
  lines: [bank, flag],
  fine: [speed, ripples, tufts([[300, 186], [342, 182], [266, 214], [320, 240], [380, 228]], 8, 5)],
  once: `<path d="${hopArc}" stroke-dasharray="3 6"/>`,
  parts: [
    place(ox({ mood: 'wow' }), 'translate(124 186) scale(1.1)'),
    water(206, { seed: 5, until: 236, shape: 'M0 206C80 203 180 208 246 204C240 230 236 260 232 300L0 300Z' }),
    place(rat({ arms: R_ARMS.reach, legs: 'leap' }), 'translate(256 140) rotate(12) scale(0.95)'),
  ],
});
