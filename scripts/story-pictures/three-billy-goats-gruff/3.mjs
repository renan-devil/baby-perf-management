import { billy, compose, DECK, place, riverScene, troll, TROLL_ARMS } from './characters.mjs';

// The Three Billy Goats Gruff, 3: the middle-sized brown goat stops in the middle of the bridge and
// talks to the troll, who leans over the rail with his arms crossed, grumpy and listening.
const T = `translate(292 ${DECK - 20}) rotate(-8) scale(1.05)`;
const talk = 'M226 92q8 -4 14 2M224 104q10 -2 16 4';

export default compose({
  title: 'Wait for my big brother',
  seed: 79,
  fine: [talk],
  parts: [
    riverScene({ gaps: [[76, 216]], railGaps: [[76, 216], [246, 340]] }),
    place(billy({ size: 'middle' }), `translate(132 ${DECK}) scale(0.95)`),
    place(troll({ arms: TROLL_ARMS.crossed, look: [-3, 0.5], cut: 20 / 1.05 }), T),
  ],
});
