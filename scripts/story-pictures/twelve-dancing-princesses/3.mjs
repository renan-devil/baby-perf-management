import { PAL, tufts } from '../lib.mjs';
import { O_HAND, S_ARMS, at, cloak, compose, oldWoman, place, soldier, tree } from './characters.mjs';

// Picture 3: in the forest, the old woman gives the soldier a soft grey cloak that makes whoever
// wears it invisible. Her bundle of sticks lies on the path.
const OW = 'translate(118 264) scale(1.32)';
const hand = at(...O_HAND, OW);
const S = 'translate(296 266) scale(1.25)';
const sHand = at(-52, -92, S);

export default compose({
  title: 'The Grey Cloak',
  seed: 4103,
  washes: [{ c: PAL.green, o: 0.4, d: 'M10 266C80 254 320 254 392 266C392 276 300 282 200 282C100 282 10 276 10 266Z' }],
  lines: [],
  fine: [tufts([[60, 268], [200, 272], [250, 270], [380, 270], [20, 270]], 9, 5)],
  parts: [
    place(tree({ r: 40, h: 96, seed: 2 }), 'translate(34 266)'),
    place(tree({ r: 38, h: 104, seed: 4 }), 'translate(368 266)'),
    place(oldWoman({ mood: 'smile', look: 1 }), OW),
    place(soldier({ mood: 'wow', look: -1, arms: S_ARMS.take }), S),
    cloak(hand[0] + 2, hand[1] + 2, sHand[0] - 3, sHand[1] + 2, 78),
  ],
});
