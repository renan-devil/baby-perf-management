import { PAL, hatch, tufts } from '../lib.mjs';
import { bat, cat, compose, place, whisper } from './characters.mjs';

// The Cat that Walked by Himself, 8: the little Bat hangs upside down from the rock and whispers the
// news to the Cat, who sits up and listens: "There is a Baby in the Cave."
const ground = 'M0 262C90 259 190 264 290 261C340 260 380 261 400 260';

// A rock overhanging from the left, its underside where the Bat hangs
const rock = 'M-10 30C60 22 160 30 236 50C262 58 270 74 252 82C210 90 150 86 104 100C70 112 52 160 48 262L-10 262Z';
const cracks = 'M30 60l20 8l6 16M150 46l-6 14M210 62l-12 8M70 140l10 6M60 200l12 -4';

// Night: a few stars and a thin moon
const stars = [
  [300, 40],
  [356, 74],
  [330, 120],
  [376, 30],
].map(([x, y]) => `M${x - 4} ${y}l8 0M${x} ${y - 4}l0 8`).join('');
const moon = 'M352 150C342 152 336 162 340 172C344 180 356 182 362 176C354 176 348 170 348 162C348 158 349 154 352 150Z';

export default compose({
  title: 'The little Bat hangs upside down and whispers the news to the Cat',
  seed: 308,
  washes: [
    { c: PAL.green, o: 0.32, d: 'M0 258C90 255 190 260 290 257C340 256 380 257 400 256L400 300L0 300Z' },
    { c: PAL.grey, o: 0.6, d: rock },
    { c: PAL.slate, o: 0.22, d: rock },
    { c: PAL.ochre, o: 0.9, d: moon },
  ],
  lines: [ground, rock],
  fine: [cracks, hatch(14, 278, 388, 280, 12, 7, 165, 4), tufts([[70, 262], [150, 261], [360, 261]], 9, 9), place({ fine: [whisper(1.5)] }, 'translate(204 166) rotate(22)').fine[0]],
  once: `<path d="${stars}" stroke-width="1.2"/>`,
  parts: [place(bat(), 'translate(184 88) scale(2.1)'), place(cat({ pose: 'sit', mood: 'up' }), 'translate(240 262) scale(1.65)')],
});
