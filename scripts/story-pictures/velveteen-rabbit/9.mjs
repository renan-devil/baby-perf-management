import { PAL, transformPath, tufts } from '../lib.mjs';
import { compose, dot, fairy, place, rabbit, sparkle } from './characters.mjs';

// The Velveteen Rabbit, 9: where his tear fell, a wonderful flower has grown; out of it steps the tiny
// nursery fairy, who stands on the open flower and kisses the shabby little rabbit on his nose.
const ground = 'M0 270C90 267 200 271 300 268C340 267 370 269 400 268';
const FX = 232;
const FY = 228;
// the open flower: five pointed petals fanning up round its heart, on a tall stem with two leaves
const petal = 'M0 0C-6 -8 -6 -22 0 -30C6 -22 6 -8 0 0Z';
const petals = [-70, -36, 0, 36, 70].map((a) => transformPath(petal, `translate(${FX} ${FY + 6}) rotate(${a}) scale(1.05 1)`)).join('');
const cup = `M${FX - 18} ${FY}C${FX - 14} ${FY + 12} ${FX + 14} ${FY + 12} ${FX + 18} ${FY}C${FX + 10} ${FY + 4} ${FX - 10} ${FY + 4} ${FX - 18} ${FY}Z`;
const stem = `M${FX} ${FY + 10}C${FX - 4} ${FY + 30} ${FX + 4} ${FY + 44} ${FX} 270`;
const leaves = `M${FX - 1} 248C${FX - 16} 236 ${FX - 30} 238 ${FX - 38} 244C${FX - 26} 254 ${FX - 12} 254 ${FX - 1} 248ZM${FX + 1} 236C${FX + 12} 226 ${FX + 24} 226 ${FX + 30} 230C${FX + 22} 240 ${FX + 12} 240 ${FX + 1} 236Z`;

export default compose({
  title: 'The fairy kisses the rabbit',
  seed: 4209,
  washes: [
    { c: PAL.green, o: 0.3, d: 'M0 266C90 263 200 267 300 264C340 263 370 265 400 264L400 300L0 300Z' },
    { c: PAL.red, o: 0.6, d: petals },
    { c: PAL.ochre, o: 0.8, d: cup },
    { c: PAL.green, o: 0.75, d: leaves },
  ],
  lines: [ground, stem, petals],
  fine: [cup, leaves, sparkle(150, 90, 8), sparkle(330, 70, 6), sparkle(110, 160, 5), sparkle(190, 120, 4), sparkle(360, 160, 5), tufts([[40, 270], [120, 270], [380, 268]], 10, 5)],
  once: dot(170, 140, 0.8) + dot(140, 120, 0.8) + dot(180, 170, 0.8) + dot(206, 150, 0.8),
  parts: [
    place(rabbit({ mood: 'shut', shabby: true }), 'translate(304 274) rotate(-18) scale(1.6)'),
    place(fairy({ lean: 30 }), `translate(${FX} ${FY + 3}) scale(1.75)`),
  ],
});
