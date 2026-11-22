import { PAL, hatch, transformPath } from '../lib.mjs';
import { book, compose, emperor, emperorSeatedOutline, place, throne } from './characters.mjs';

// The Nightingale, 2: on his golden throne, the Emperor in his long yellow robe reads a big book
// about the wonders of his empire, and frowns in surprise: "A nightingale? I have never heard it!"
const T = 'translate(200 272) scale(1.12)';
const E = 'translate(200 268) scale(1.22)';
const hole = transformPath(emperorSeatedOutline(), E);
// surprise marks above his head
const marks = 'M168 82l-10 -7M164 96l-12 0M232 82l10 -7M236 96l12 0';

export default compose({
  title: 'The Emperor reads about the nightingale',
  seed: 1213,
  washes: [
    { c: PAL.ochre, o: 0.18, d: 'M0 0L400 0L400 282L0 282Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M0 282L400 282L400 300L0 300Z' },
  ],
  lines: [],
  fine: [marks, 'M0 282L400 282', hatch(20, 292, 120, 292, 3, 6, 175, 1213), hatch(290, 292, 390, 292, 3, 6, 175, 1214)],
  parts: [
    throne(T, hole),
    place(
      emperor({
        mood: 'frown',
        seated: true,
        arms: [
          [[-22, -116, 13], [-38, -96, 15], [-44, -74, 15]],
          [[22, -116, 13], [38, -96, 15], [44, -74, 15]],
        ],
      }),
      E,
    ),
    place(book(), `${E} translate(0 -76) scale(0.95)`),
  ],
});
