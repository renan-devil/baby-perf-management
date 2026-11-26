import { PAL, zed } from '../lib.mjs';
import { catPounce, compose, dickHead, mouse, place } from './1.mjs';

// Dick Whittington, 5: night in the attic. Under the sloping roof the stripy cat pounces, and the rats
// and mice run away as fast as they can. Dick sleeps in his little bed under the small moonlit window.
const floor = 'M10 256C120 252 280 254 390 256';
const roof = 'M14 170L176 22M30 182L192 34';
const win = 'M296 70L356 70L356 128L296 128Z';
const winBars = 'M326 70L326 128M296 99L356 99';
const moon = 'M338 80C330 82 328 94 336 98C330 100 322 94 324 86C326 80 332 78 338 80Z';

// the bed, its foot at the left: frame from x 262 to 384, legs to the floor
const frame = 'M262 236L384 236M262 222L262 256M384 196L384 256M384 196C384 186 362 186 362 196L362 222';
const blanket = 'M266 222C264 208 278 202 296 202C316 202 330 204 338 210L362 222Z';
const pillow = 'M336 208C330 198 340 190 352 190C364 190 372 198 366 208C362 214 340 214 336 208Z';
const quilt = 'M290 203L291 222M316 203L317 222';

export default compose({
  title: 'The cat chases the rats away',
  seed: 251,
  washes: [
    // the night in the attic
    { c: PAL.slate, o: 0.24, d: 'M14 170L176 22L392 22L392 256L14 256Z' },
    { c: PAL.ochre, o: 0.55, d: 'M14 170L176 22L192 34L30 182Z' },
    { c: PAL.terracotta, o: 0.3, d: 'M14 170L176 22L192 34L30 182Z' },
    { c: PAL.slate, o: 0.75, d: win },
    { c: PAL.ochre, o: 0.95, d: moon },
    { c: PAL.terracotta, o: 0.55, d: blanket },
    { c: PAL.ochre, o: 0.6, d: 'M290 203L316 203L317 222L291 222Z' },
    { c: PAL.ochre, o: 0.45, d: 'M262 222L384 222L384 236L262 236ZM362 196C362 186 384 186 384 196L384 222L362 222Z' },
    { c: PAL.terracotta, o: 0.3, d: 'M262 222L384 222L384 236L262 236ZM362 196C362 186 384 186 384 196L384 222L362 222Z' },
  ],
  whites: pillow,
  lines: [floor, roof, win, frame, blanket, 'M262 222L362 222'],
  fine: [winBars, moon, quilt, pillow, zed(326, 160, 8), zed(340, 142, 11), 'M70 238l8 0M150 246l10 0M220 248l8 0', 'M120 236l14 0M126 242l10 0M66 224l12 0M70 230l8 0M168 214l12 0M170 220l8 0'],
  parts: [
    place(dickHead({ mood: 'sleep' }), 'translate(346 196) rotate(-24) scale(0.85)'),
    place(catPounce({ mood: 'wow' }), 'translate(180 214) scale(-1.1 1.1)'),
    place(mouse({ big: true }), 'translate(86 254) scale(-1 1)'),
    place(mouse(), 'translate(34 238) scale(-1 1)'),
    place(mouse(), 'translate(150 254) scale(-0.9 0.9)'),
  ],
});
