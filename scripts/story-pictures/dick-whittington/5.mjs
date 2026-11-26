import { PAL, zed } from '../lib.mjs';
import { catPounce, compose, dickHead, mouse, place } from './1.mjs';

// Dick Whittington, 5: night in the attic. Under the sloping roof the stripy cat pounces, and the rats
// and mice run away as fast as they can. Dick sleeps in his little bed under the small moonlit window.
const floor = 'M10 256C120 252 280 254 390 256';
const roof = 'M14 170L176 22M30 182L192 34';
const win = 'M296 70L356 70L356 128L296 128Z';
const winBars = 'M326 70L326 128M296 99L356 99';
const moon = 'M338 80C330 82 328 94 336 98C330 100 322 94 324 86C326 80 332 78 338 80Z';

// the bed, its foot at the left: frame from x 226 to 384, mattress top at y 216, legs to the floor
const frame = 'M226 236L384 236M226 222L226 256M384 196L384 256M384 196C384 186 362 186 362 196L362 222';
const blanket = 'M232 222C230 206 250 200 280 200C310 200 336 202 346 208L360 222Z';
const pillow = 'M340 210C334 202 340 196 352 196C364 196 370 202 366 210C362 214 344 214 340 210Z';
const quilt = 'M262 202L264 222M296 200L298 222M326 203L328 222';

export default compose({
  title: 'The cat chases the rats away',
  seed: 251,
  washes: [
    // the night in the attic
    { c: PAL.slate, o: 0.3, d: 'M14 170L176 22L392 22L392 256L14 256Z' },
    { c: PAL.ochre, o: 0.55, d: 'M14 170L176 22L192 34L30 182Z' },
    { c: PAL.terracotta, o: 0.3, d: 'M14 170L176 22L192 34L30 182Z' },
    { c: PAL.slate, o: 0.75, d: win },
    { c: PAL.ochre, o: 0.95, d: moon },
    { c: PAL.terracotta, o: 0.55, d: blanket },
    { c: PAL.ochre, o: 0.6, d: 'M262 202L296 200L298 222L264 222Z' },
    { c: PAL.ochre, o: 0.45, d: 'M226 222L384 222L384 236L226 236ZM362 196C362 186 384 186 384 196L384 222L362 222Z' },
    { c: PAL.terracotta, o: 0.3, d: 'M226 222L384 222L384 236L226 236ZM362 196C362 186 384 186 384 196L384 222L362 222Z' },
  ],
  whites: pillow,
  lines: [floor, roof, win, frame, blanket, 'M226 222L362 222'],
  fine: [winBars, moon, quilt, pillow, zed(318, 160, 8), zed(332, 142, 11), 'M70 238l8 0M150 246l10 0M240 248l8 0'],
  parts: [
    place(dickHead({ mood: 'sleep' }), 'translate(344 194) rotate(-70) scale(0.9)'),
    place(catPounce({ mood: 'wow' }), 'translate(196 216) scale(-1.15 1.15)'),
    place(mouse({ big: true }), 'translate(96 254) scale(-1 1)'),
    place(mouse(), 'translate(40 240) scale(-1 1)'),
    place(mouse(), 'translate(126 226) scale(-0.9 0.9) rotate(-8)'),
  ],
});
