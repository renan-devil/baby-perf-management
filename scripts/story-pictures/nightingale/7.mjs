import { PAL } from '../lib.mjs';
import { at, compose, emperor, goldenBird, place } from './characters.mjs';

// The Nightingale, 7: one evening, "whirr... clunk!" Something snaps inside the golden bird: a
// spring pops out of its side and the music stops. The Emperor holds it sadly in his hands.
const E = 'translate(122 452) scale(2.1)';
const hand = [66, -110];
const [hx, hy] = at(...hand, E);
const GB = `translate(${hx + 4} ${hy - 46}) scale(2)`;

export default compose({
  title: 'The golden bird is broken',
  seed: 1289,
  washes: [{ c: PAL.ochre, o: 0.16, d: 'M0 0L400 0L400 300L0 300Z' }, { c: PAL.red, o: 0.75, d: 'M372 0L394 0L394 300L372 300Z' }],
  lines: ['M372 0L372 300M394 0L394 300'],
  fine: ['M356 180l10 -8M358 198l12 0M330 110l6 -10'],
  parts: [
    place(goldenBird({ broken: true }), GB),
    place(
      emperor({
        mood: 'sad',
        tilt: 10,
        upper: true,
        arms: [
          [[-22, -116, 13], [-6, -92, 15], [48, -98, 15]],
          [[22, -116, 13], [44, -100, 15], hand.concat(15)],
        ],
      }),
      E,
    ),
  ],
});
