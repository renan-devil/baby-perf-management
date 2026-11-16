import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, hare, hedgehog, place } from './characters.mjs';

// The Hare and the Hedgehog, 5: the secret is out! Two hedgehogs, exactly alike (the same drawing),
// stand side by side and wave; Mrs Hedgehog winks. Hare, sitting up on the grass, still tired, holds
// his tummy and laughs.
const ground = 'M0 262C90 259 200 264 300 261C350 260 380 262 400 261';
const horizon = 'M0 132C80 128 180 134 260 130C320 128 370 131 400 129';
const field = 'M0 132C80 128 180 134 260 130C320 128 370 131 400 129L400 262C380 262 350 260 300 261C200 264 90 259 0 262Z';
const furrows = 'M250 131C252 150 254 166 256 180M150 133C140 142 128 148 116 152M60 133C46 139 30 143 10 147';
const hedge = 'M300 130C306 116 322 114 330 122C338 110 356 110 362 122C370 114 388 114 400 120';
// his laugh, and a last drop of effort
const laugh = 'M262 118l-8 -5M258 132l-10 -1M272 104l-5 -8';
const drop = 'M366 140C363 134 367 131 369 136C371 140 367 143 366 140Z';
// "hello!" marks by the waving paws
const hello = 'M130 208l4 -6M138 214l7 -3M244 208l4 -6M252 214l7 -3';

export default compose({
  title: 'Two hedgehogs!',
  seed: 45,
  washes: [
    { c: PAL.terracotta, o: 0.3, d: field },
    { c: PAL.ochre, o: 0.22, d: field },
    { c: PAL.green, o: 0.42, d: 'M0 258C90 255 200 260 300 257C350 256 380 258 400 257L400 300L0 300Z' },
    { c: PAL.green, o: 0.55, d: `${hedge}L400 131L300 131Z` },
    { c: PAL.sky, o: 0.8, d: drop },
  ],
  lines: [ground, horizon, hedge],
  fine: [furrows, laugh, drop, hello, hatch(20, 282, 180, 282, 10, 6, 160, 6), hatch(230, 284, 390, 282, 9, 6, 160, 7), tufts([[20, 262], [196, 262], [384, 261]], 9, 9)],
  parts: [
    place(hedgehog({ arm: 'wave', eye: 'open', mouth: 'grin' }), 'translate(60 263) scale(1.3)'),
    place(hedgehog({ arm: 'wave', eye: 'wink', mouth: 'grin' }), 'translate(174 263) scale(1.3)'),
    place(hare({ face: 'laugh', ears: 'up', arms: 'belly', tilt: -16 }), 'translate(330 262) scale(-1.22 1.22)'),
  ],
});
