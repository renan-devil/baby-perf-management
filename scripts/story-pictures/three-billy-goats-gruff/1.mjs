import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { billy, bridge, compose, place } from './characters.mjs';

// The Three Billy Goats Gruff, 1 (cover): the three goats, the little white one in front, the
// middle-sized brown one and the great big grey one with curly horns, stand in a row on the near
// bank and look across the wooden bridge at the green hill on the other side, all sunny.
const nearBank = 'M0 208C80 206 180 206 250 208C258 220 262 236 264 252C266 270 262 286 258 300';
const farBank = 'M364 206C384 204 394 204 400 204M364 206C360 226 364 254 366 300';
const hill = 'M226 160C256 112 316 92 400 96';
const water = 'M262 246C290 242 330 242 364 246L366 300L258 300Z';
const waves = 'M276 262c8 -5 16 -5 24 0M326 266c8 -5 16 -5 24 0M290 284c8 -5 16 -5 24 0';
const B = bridge({ x0: 248, x1: 366, y: 198, foot: 262, k: 0.75 });

export default compose({
  title: 'The Three Billy Goats Gruff',
  seed: 71,
  washes: [
    { c: PAL.green, o: 0.5, d: `${hill}L400 96L400 206L364 206C330 198 280 196 240 190Z` },
    { c: PAL.green, o: 0.3, d: 'M290 124C320 104 360 98 400 100L400 140C360 140 320 138 290 124Z' },
    { c: PAL.sky, o: 0.6, d: water },
    { c: PAL.green, o: 0.6, d: `${nearBank}L0 300Z` },
    { c: PAL.grey, o: 0.55, d: 'M250 208C258 220 262 236 264 252C266 270 262 286 258 300L214 300C228 270 232 236 250 208Z' },
    { c: PAL.green, o: 0.6, d: 'M364 206C384 204 394 204 400 204L400 300L366 300C364 254 360 226 364 206Z' },
    { c: PAL.grey, o: 0.4, d: 'M364 206C360 226 364 254 366 300L384 300C380 260 378 230 380 206Z' },
    { c: PAL.ochre, o: 0.7, d: 'M318 40a18 18 0 1 0 36 0a18 18 0 1 0 -36 0Z' },
  ],
  lines: [nearBank, farBank, hill],
  fine: [
    waves,
    rays(336, 40, 24, 36, 10, 4),
    tufts([[16, 208], [100, 207], [180, 207], [238, 208], [384, 204], [268, 136], [312, 112], [356, 102], [388, 100]], 10, 7),
    hatch(236, 226, 248, 280, 4, 7, 160, 3),
  ],
  once: `<path d="M290 160c3 -4 7 -4 9 0M340 150c3 -4 7 -4 9 0M380 170c3 -4 7 -4 9 0" stroke-dasharray="3 3"/>`,
  parts: [
    B,
    place(billy({ size: 'big' }), 'translate(52 208) scale(0.92)'),
    place(billy({ size: 'middle' }), 'translate(140 208) scale(0.69)'),
    place(billy({ size: 'little' }), 'translate(214 208) scale(0.46)'),
  ],
});
