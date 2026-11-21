import { PAL, hatch } from '../lib.mjs';
import { compose, cradle, curtain, fairyPeek, oldFairy, place } from './characters.mjs';

// Picture 3: the cross old fairy in her dark cloak points her long finger at the cradle, while the
// youngest fairy peeps out from behind a curtain.
const floor = 'M16 266C140 262 260 262 330 264';

export default compose({
  title: 'The Cross Old Fairy',
  seed: 2303,
  washes: [{ c: PAL.grey, o: 0.28, d: 'M16 266C140 262 260 262 334 264L334 282C260 286 140 286 14 284Z' }],
  lines: [floor],
  fine: [hatch(30, 276, 320, 276, 8, 6, 160, 6), 'M190 150l8 -4M192 162l10 0M186 138l3 -8'],
  parts: [
    place(oldFairy({ point: 16 }), 'translate(78 266) scale(1.5)'),
    place(cradle({ mood: 'asleep' }), 'translate(252 264) scale(1.5)'),
    place(fairyPeek(), 'translate(334 138) scale(1.6)'),
    place(curtain({ w: 76, h: 236 }), 'translate(334 270)'),
  ],
});
