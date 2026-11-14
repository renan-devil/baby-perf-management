import { PAL, hatch } from '../lib.mjs';
import { compose, fieldMouse, mole, place, thumbelina } from './characters.mjs';

// Thumbelina, 6: in the field mouse's warm kitchen, Thumbelina tells a story, while the mole in his
// black velvet coat listens with his eyes closed.
const burrow = 'M8 266C4 150 80 40 200 36C320 40 396 150 392 266';
const floor = 'M8 262C120 258 280 264 392 262';
const rug = 'M40 268C40 252 120 246 200 246C280 246 360 252 360 268C360 282 280 288 200 288C120 288 40 282 40 268Z';
const shelf = 'M150 92L250 92';
const jars = 'M160 92L160 74C160 70 176 70 176 74L176 92M188 92L188 66C188 62 200 62 200 66L200 92M212 92L214 78C214 72 236 72 238 78L240 92';

export default compose({
  title: 'A story for the mole',
  seed: 106,
  washes: [
    { c: PAL.ochre, o: 0.2, d: `${burrow}Z` },
    { c: PAL.red, o: 0.4, d: rug },
    { c: PAL.ochre, o: 0.6, d: 'M160 92L160 74C160 70 176 70 176 74L176 92ZM212 92L214 78C214 72 236 72 238 78L240 92Z' },
    { c: PAL.green, o: 0.6, d: 'M188 92L188 66C188 62 200 62 200 66L200 92Z' },
  ],
  lines: [burrow, floor, shelf, rug],
  fine: [jars, hatch(60, 276, 340, 276, 9, 5, 0, 7), hatch(150, 98, 250, 98, 6, 6, 90, 4)],
  parts: [
    place(fieldMouse({ mood: 'happy' }), 'translate(76 262) scale(1.38)'),
    place(thumbelina({ arms: 'open', mood: 'joy' }), 'translate(186 262) scale(1.2)'),
    place(mole(), 'translate(310 262) scale(1.55)'),
  ],
});
