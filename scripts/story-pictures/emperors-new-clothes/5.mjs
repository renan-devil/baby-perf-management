import { PAL } from '../lib.mjs';
import { candlestick, compose, needle, place, scissors, sparkle, trickster } from './characters.mjs';

// The Emperor's New Clothes, 5: late at night, by candlelight, one trickster snips the air with big
// scissors and the other sews with a needle that has no thread. Snip, snip! Stitch, stitch!
const floor = 'M16 266C120 262 280 264 386 266';
// the night: a soft slate wash all round, with a warm glow left round the candles
const night =
  'M30 40C110 14 290 14 370 40C394 110 394 200 376 262L24 262C6 200 6 110 30 40ZM200 70C250 70 290 110 290 160C290 210 250 250 200 250C150 250 110 210 110 160C110 110 150 70 200 70Z';

const snipArms = [
  [[-14, -128, 8], [-26, -112, 7], [-24, -96, 7]],
  [[14, -128, 8], [32, -126, 7], [50, -136, 7]],
];
const sewArms = [
  [[-14, -128, 8], [-30, -130, 7], [-42, -146, 7]],
  [[14, -128, 8], [2, -112, 7], [-16, -112, 7]],
];

export default compose({
  title: 'Snip, snip! Stitch, stitch!',
  seed: 441,
  washes: [
    { c: PAL.slate, o: 0.4, d: night, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.25, d: 'M200 80C244 80 280 116 280 160C280 204 244 240 200 240C156 240 120 204 120 160C120 116 156 80 200 80Z' },
    { c: PAL.grey, o: 0.3, d: 'M16 264C120 258 280 260 386 264C392 272 360 280 300 280C220 284 120 284 70 280C36 278 10 272 16 264Z' },
  ],
  lines: [floor],
  fine: [
    // snip marks by the scissors and a twinkle on the needle's empty eye
    'M156 74l-6 -8M168 70l0 -10M178 76l6 -6',
    'M60 274l-8 1M330 276l-8 1',
  ],
  parts: [
    place({ fine: [sparkle(5)] }, 'translate(286 66)'),
    place(candlestick(), 'translate(200 266) scale(1.25)'),
    place(trickster({ who: 'a', look: 1, mood: 'sly', arms: snipArms }), 'translate(96 266) scale(1.1)'),
    place(scissors(36), 'translate(163 101) rotate(-40) scale(1.1)'),
    place(trickster({ who: 'b', look: -1, mood: 'sly', arms: sewArms }), 'translate(310 266) scale(1.1)'),
    place(needle(36), 'translate(264 106) rotate(-70)'),
  ],
});
