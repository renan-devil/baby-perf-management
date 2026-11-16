import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, hare, hedgehog, place } from './characters.mjs';

// The Hare and the Hedgehog, 3: "I'm already here!" Hare reaches the far end of the field and skids
// to a stop in a cloud of dust, ears straight up, paws flung up in surprise. A hedgehog has popped up
// out of the next furrow, waving. (Is it Hedgehog? The picture keeps the secret.)
const ground = 'M0 262C90 259 200 264 300 261C350 260 380 262 400 261';
const horizon = 'M0 132C80 128 180 134 260 130C320 128 370 131 400 129';
// the furrows run across the picture: ridges as stripes of wash, ink only where nobody stands
const ridge = (y, w) => `M0 ${y}C100 ${y - 3} 300 ${y + 3} 400 ${y}L400 ${y + w}C300 ${y + w + 3} 100 ${y + w - 3} 0 ${y + w}Z`;
const furrowInk = 'M0 152C30 151 60 151 84 151M0 180C30 179 60 179 80 179M0 212C30 211 60 211 78 211M354 150C370 150 386 150 400 150M356 182C372 182 388 182 400 182M352 216C370 216 386 215 400 215M210 150C222 150 236 150 248 150';
// the hedge at the end of the field
const hedge = 'M300 130C306 116 322 114 330 122C338 110 356 110 362 122C370 114 388 114 400 120';
// his tracks: a long dotted line down the furrow behind him
const tracks = 'M0 246C30 248 60 250 92 252';
// skid: dust thrown up in front of his feet, and skid lines
const dust =
  'M214 258C206 260 200 252 206 247C202 240 210 234 216 239C218 232 228 231 230 238C236 235 244 240 240 247C246 250 244 258 238 258Z' +
  'M232 236C228 237 226 231 231 229C231 225 237 225 238 229C242 229 242 235 238 236Z';
const skid = 'M110 268L150 268M120 274L168 274M98 262l-10 0';
// fright marks round his head and a big "!" above it
const shock = 'M92 128l-10 -3M94 114l-9 -6M160 104l8 -6M166 118l10 -3';
const bang = 'M132 18L130 36M130 44l0 1';

export default compose({
  title: 'I am already here!',
  seed: 43,
  washes: [
    { c: PAL.terracotta, o: 0.28, d: 'M0 132C80 128 180 134 260 130C320 128 370 131 400 129L400 262C380 262 350 260 300 261C200 264 90 259 0 262Z' },
    { c: PAL.terracotta, o: 0.28, d: ridge(160, 12) + ridge(192, 14) + ridge(226, 16) },
    { c: PAL.green, o: 0.4, d: 'M0 258C90 255 200 260 300 257C350 256 380 258 400 257L400 300L0 300Z' },
    { c: PAL.green, o: 0.55, d: `${hedge}L400 131L300 131Z` },
    { c: PAL.grey, o: 0.35, d: dust },
  ],
  lines: [ground, horizon, hedge],
  fine: [furrowInk, dust, skid, shock, hatch(20, 282, 160, 282, 10, 6, 160, 6), hatch(220, 284, 390, 282, 10, 6, 160, 7), tufts([[30, 262], [380, 261]], 9, 9)],
  once: `<path d="${tracks}" stroke-dasharray="0.1 9" stroke-width="2.4"/><path d="${bang}" stroke-width="3.2"/>`,
  parts: [
    place(hare({ face: 'shock', ears: 'up', arms: 'up', tilt: -6 }), 'translate(130 262) rotate(-10) scale(1.3)'),
    place(hedgehog({ arm: 'wave', eye: 'open', mouth: 'grin' }), 'translate(318 262) scale(-1.55 1.55)'),
  ],
});
