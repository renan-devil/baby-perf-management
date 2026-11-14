import { DECK, billy, compose, place, riverScene, trollHand, trollHead } from './characters.mjs';

// The Three Billy Goats Gruff, 2: trip, trap! The little white goat trots onto the wooden bridge,
// and the troll's grumpy green head pops up over the side, his big hands gripping the planks.
const TX = 280;
const pop = 'M218 122l-10 -6M220 104l-12 -2M342 122l10 -6M340 104l12 -2M280 46l0 -10M252 56l-4 -9M308 56l4 -9';

export default compose({
  title: 'Who is that trotting over my bridge?',
  seed: 73,
  fine: [pop],
  parts: [
    riverScene({ gaps: [[86, 166], [222, 338]], railGaps: [[70, 186], [222, 338]] }),
    place(billy({ size: 'little' }), `translate(124 ${DECK}) scale(0.75)`),
    place(trollHead({ look: [-3.2, 0.6] }), `translate(${TX} 128) scale(1.32)`),
    trollHand(TX - 40, DECK - 2, 9),
    trollHand(TX + 40, DECK - 2, 9),
  ],
});
