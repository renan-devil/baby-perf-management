import { PAL, rays } from '../lib.mjs';
import { billy, compose, DECK, place, riverScene, troll, TROLL_ARMS } from './characters.mjs';

// The Three Billy Goats Gruff, 4: the great big grey goat lowers his curly horns and charges, and
// BUMP! The troll goes flying off the bridge, head over heels, towards the river below.
const G = `translate(116 ${DECK}) scale(1.15)`;
const BX = 230;
const BY = 108;
const burst = 'M0 -22L6 -8L20 -12L11 0L22 10L7 9L4 22L-3 9L-17 14L-9 1L-20 -10L-5 -8Z';
const burstAt = (t) => burst.replace(/(-?\d+) (-?\d+)/g, (_, x, y) => `${Number(x) + t[0]} ${Number(y) + t[1]}`);
const flight = 'M248 90C252 80 256 74 260 70M372 118C388 160 376 214 330 244';
const arrow = 'M334 231l-5 13l14 2';
const speed = 'M40 70l-26 0M44 88l-32 0M40 106l-24 0';

export default compose({
  title: 'Bump!',
  seed: 83,
  washes: [{ c: PAL.ochre, o: 0.85, d: burstAt([BX, BY]) }],
  fine: [burstAt([BX, BY]), rays(BX, BY, 26, 38, 9, 5), speed],
  once: `<path d="${flight}" stroke-dasharray="7 6"/><path d="${arrow}"/>`,
  parts: [
    riverScene({ gaps: [[46, 214]], railGaps: [[46, 214], [340, 366]] }),
    place(billy({ size: 'big', head: 38 }), G),
    place(troll({ mood: 'oops', arms: TROLL_ARMS.flail, legs: true, look: [0, -1] }), 'translate(284 72) rotate(100) scale(0.88)'),
  ],
});
