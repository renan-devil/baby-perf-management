import { PAL } from '../lib.mjs';
import { compose, dot, emperor, merge, nightingale, note, place } from './characters.mjs';

// The Nightingale, 4: in the palace, the little nightingale sings on a golden perch, so sweetly
// that the Emperor closes his eyes and a tear rolls down his cheek.
const E = 'translate(120 448) scale(2.05)';
const B = 'translate(296 118) rotate(6) scale(-2.1 2.1)';
const pole = 'M292 146L292 272L300 272L300 146Z';
const bar = 'M250 142L342 142L342 150L250 150Z';
const base = 'M266 272C266 262 326 262 326 272L330 282L262 282Z';
const knobs = dot(248, 146, 5) + dot(344, 146, 5) + dot(296, 140, 4);

export default compose({
  title: 'The Emperor listens to the nightingale',
  seed: 1241,
  washes: [
    { c: PAL.ochre, o: 0.18, d: 'M0 0L400 0L400 282L150 282L150 300L0 300Z' },
    { c: PAL.red, o: 0.75, d: 'M372 0L394 0L394 282L372 282Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M150 282L400 282L400 300L150 300Z' },
    { c: PAL.ochre, o: 0.95, d: pole + bar + base + knobs },
  ],
  whites: 'M294 152L296 152L296 268L294 268Z',
  lines: [pole, bar, base, 'M372 0L372 282M394 0L394 282'],
  fine: [knobs, 'M190 282L262 282M330 282L400 282'],
  parts: [
    place(
      emperor({
        mood: 'tear',
        tilt: 8,
        upper: true,
      }),
      E,
    ),
    place(nightingale({ beak: 'open' }), B),
    merge(note(244, 92, 1.5), note(218, 64, 1.3), note(254, 50, 1.1)),
  ],
});
