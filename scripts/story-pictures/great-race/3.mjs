import { PAL, rays, zed } from '../lib.mjs';
import { R_ARMS, cat, compose, fishbone, place, rat } from './characters.mjs';

// The Great Race, 3: after his big lunch of fish, Cat sleeps in the sun with his round full tummy,
// zzz… Little Rat stands beside him, paws round his mouth, calling: "Cat! Wake up! It's time!"
const ground = 'M0 252C100 249 300 253 400 250';
const bowl = 'M222 238C222 254 254 254 254 238ZM218 238L258 238';
const sun = 'M36 44C36 30 58 30 58 44C58 58 36 58 36 44Z';
const callMarks = 'M262 176l-10 -6M258 190l-12 0M262 204l-10 6';

export default compose({
  title: 'Cat sleeps after his big lunch',
  seed: 43,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 248C100 245 300 249 400 246L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.75, d: sun },
    { c: PAL.sky, o: 0.6, d: 'M222 238C222 254 254 254 254 238Z' },
  ],
  lines: [ground, bowl, sun],
  fine: [rays(47, 44, 18, 30, 10, 3), callMarks, zed(66, 128, 12), zed(86, 104, 16), zed(112, 74, 20)],
  parts: [
    place(cat(), 'translate(104 252) scale(1.05)'),
    place(fishbone(), 'translate(160 274) rotate(-8) scale(0.9)'),
    place(rat({ arms: R_ARMS.call, mood: 'shout' }), 'translate(312 252) scale(-1.08 1.08)'),
  ],
});
