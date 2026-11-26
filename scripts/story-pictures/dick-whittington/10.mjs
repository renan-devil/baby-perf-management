import { PAL } from '../lib.mjs';
import { catSit, compose, mayor, place } from './1.mjs';

// Dick Whittington, 10: Dick, all grown up, is Lord Mayor of London, in a red robe with a gold chain
// and a velvet hat. He sits in his big chair and smiles, with a stripy kitten purring on his lap.
const floor = 'M20 268C120 265 280 266 380 268';

// the big chair behind him (seat at 0,0): two tall posts, an arched top, the seat's ends
const posts = 'M-54 52L-54 -128M54 52L54 -128';
const back = 'M-54 -128C-54 -150 -30 -166 0 -166C30 -166 54 -150 54 -128';
const knobs = 'M-58 -134a4 4 0 1 0 8 0a4 4 0 1 0 -8 0ZM50 -134a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z';
const seat = 'M-60 4L-38 4M38 4L60 4M-60 4L-60 12L-38 12M38 12L60 12L60 4';
// the red velvet of the back, with a hole where he sits in front of it
const velvet = 'M-48 -128C-48 -146 -28 -158 0 -158C28 -158 48 -146 48 -128L48 4L-48 4Z';
const him = 'M-38 4C-38 -30 -36 -64 -24 -74C-30 -100 -24 -128 0 -132C24 -128 30 -100 24 -74C36 -64 38 -30 38 4Z';
const S = 'translate(200 212) scale(1.2)';

export default compose({
  title: 'Lord Mayor of London',
  seed: 307,
  washes: [{ c: PAL.red, o: 0.25, d: 'M40 268C120 264 280 264 360 268L360 280C280 284 120 284 40 280Z' }],
  lines: [floor],
  parts: [
    place(
      {
        lines: [posts, back, seat],
        fine: [knobs],
        washes: [
          { c: PAL.ochre, o: 0.85, d: 'M-57 52L-51 52L-51 -128L-57 -128ZM51 52L57 52L57 -128L51 -128Z' + knobs },
          { c: PAL.terracotta, o: 0.4, d: 'M-57 52L-51 52L-51 -128L-57 -128ZM51 52L57 52L57 -128L51 -128Z' },
          { c: PAL.green, o: 0.6, d: velvet + him, rule: 'evenodd' },
          { c: PAL.ochre, o: 0.7, d: 'M-54 -128C-54 -150 -30 -166 0 -166C30 -166 54 -150 54 -128L48 -128C48 -146 28 -158 0 -158C-28 -158 -48 -146 -48 -128Z' },
        ],
      },
      S,
    ),
    place(mayor({ mood: 'happy' }), S),
    place(catSit({ mood: 'happy', tail: 'right' }), `${S} translate(0 16) scale(1.2)`),
  ],
});
