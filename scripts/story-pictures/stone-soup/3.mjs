import { PAL, hatch, tufts } from '../lib.mjs';
import { basket, cabbage, compose, onion, place, pot, spoon, traveller, woman } from './characters.mjs';

// Stone Soup, 3: an old woman in a red headscarf comes to the pot with her basket of onions and holds
// up a big green cabbage for the soup; the traveller, stirring, smiles at her.
const ground = 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269';
const W = 'translate(100 272) scale(1.28)';
const P = 'translate(222 268) scale(1.05)';
const T = 'translate(336 272) scale(1.1)';

export default compose({
  title: 'An onion and a cabbage too',
  seed: 75,
  washes: [{ c: PAL.ochre, o: 0.35, d: 'M0 268C90 264 190 270 290 266C340 264 370 267 400 265L400 296C300 300 100 298 0 296Z' }],
  lines: [ground],
  fine: [hatch(14, 284, 386, 286, 12, 8, 172, 4), tufts([[20, 270], [386, 268]], 9, 6)],
  parts: [
    place(
      woman({
        mood: 'peep',
        tilt: 6,
        arms: [
          [[-17, -90, 9], [-24, -78, 8], [-28, -66, 8], [-30, -58, 8]],
          [[17, -90, 9], [30, -96, 8], [42, -104, 8], [52, -112, 8]],
        ],
      }),
      W,
    ),
    // the basket of onions hangs from her hand; the cabbage is held up over the pot
    place(
      {
        ...basket(),
      },
      `${W} translate(-30 -16) scale(0.95)`,
    ),
    place(onion(), `${W} translate(-40 -46) rotate(-14) scale(0.95)`),
    place(onion(), `${W} translate(-26 -48) rotate(6) scale(0.95)`),
    place(onion(), `${W} translate(-14 -44) rotate(18) scale(0.9)`),
    place(cabbage(17), `${W} translate(58 -130)`),
    place(pot({ inside: 'water' }), P),
    place(
      traveller({
        mood: 'peepL',
        tilt: -6,
        arms: [
          [[-22, -108, 11], [-36, -112, 10], [-48, -118, 10], [-58, -122, 10]],
          [[22, -108, 11], [28, -90, 10], [30, -72, 10], [29, -62, 10]],
        ],
      }),
      T,
    ),
    place(spoon(52, { bowl: false }), 'translate(268 134) rotate(54)'),
  ],
});
