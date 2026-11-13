import { PAL } from '../lib.mjs';
import { compose, goldBag, loom, place, stool, trickster } from './characters.mjs';

// The Emperor's New Clothes, 3: the two tricksters sit on their stools on either side of the big
// empty wooden loom, waving their hands busily over nothing at all, with the fat bag of gold beside
// them. Clickety-clack!
const floor = 'M16 266C120 262 280 264 386 266';
// hands busy in the air in front of the loom (upper-body coordinates)
const weaveR = [
  [[-14, -128, 8], [0, -108, 7], [24, -100, 7], [40, -104, 7]],
  [[14, -128, 8], [30, -120, 7], [46, -126, 7]],
];
const weaveL = [
  [[-14, -128, 8], [-30, -120, 7], [-46, -126, 7]],
  [[14, -128, 8], [0, -108, 7], [-24, -100, 7], [-40, -104, 7]],
];

export default compose({
  title: 'Clickety-clack',
  seed: 421,
  washes: [{ c: PAL.grey, o: 0.3, d: 'M16 264C120 258 280 260 386 264C392 272 360 280 300 280C220 284 120 284 70 280C36 278 10 272 16 264Z' }],
  lines: [floor],
  // "clickety-clack" marks round the busy hands
  fine: ['M136 104l-6 -6M144 96l-2 -9M264 104l6 -6M256 96l2 -9', 'M60 274l-8 1M330 276l-8 1'],
  parts: [
    place(loom(), 'translate(200 266) scale(1.02)'),
    place(stool(), 'translate(96 266)'),
    place(stool(), 'translate(304 266)'),
    place(trickster({ who: 'a', pose: 'sit', look: 1, arms: weaveR }), 'translate(96 266) scale(1.02)'),
    place(trickster({ who: 'b', pose: 'sit', look: -1, arms: weaveL }), 'translate(304 266) scale(1.02)'),
    place(goldBag(), 'translate(354 266) scale(0.85)'),
  ],
});
