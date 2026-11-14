import { PAL, hatch } from '../lib.mjs';
import { at, compose, place, swallow, thumbelina } from './characters.mjs';

// Thumbelina, 9: Thumbelina rides on the swallow's back, high over the mountains and the sea, with her
// hair blowing in the wind.
const SW = 'translate(190 160) rotate(-4) scale(1.45)';
const [sx, sy] = at(24, -18, SW);
const mountains = 'M0 268L34 222L52 240L86 196L122 246L140 232L172 272';
const snow = 'M76 210L86 196L96 212L90 208L84 214L80 208ZM28 230L34 222L40 232L35 229L31 233Z';
const sea = 'M150 272C220 266 300 270 400 264L400 300L150 300Z';
const waves = 'M200 282q8 -5 16 0q8 -5 16 0M290 278q8 -5 16 0q8 -5 16 0M240 294q8 -5 16 0M350 290q8 -5 16 0';
const cloud = (x, y) => `M${x} ${y}C${x - 4} ${y - 12} ${x + 10} ${y - 20} ${x + 20} ${y - 14}C${x + 26} ${y - 24} ${x + 44} ${y - 22} ${x + 46} ${y - 10}C${x + 58} ${y - 10} ${x + 58} ${y + 4} ${x + 46} ${y + 4}C${x + 30} ${y + 6} ${x + 12} ${y + 6} ${x + 4} ${y + 4}C${x - 4} ${y + 4} ${x - 6} ${y} ${x} ${y}Z`;
const wind = 'M28 120l-22 0M34 136l-28 2M330 40l30 -2M340 56l40 0';

export default compose({
  title: 'Flying south on the swallow',
  seed: 109,
  washes: [
    { c: PAL.slate, o: 0.45, d: `${mountains}Z` },
    { c: PAL.sky, o: 0.6, d: sea },
    { c: PAL.sky, o: 0.25, d: cloud(310, 214) + cloud(40, 40) },
  ],
  whites: snow,
  lines: [mountains, 'M150 272C220 266 300 270 400 264', cloud(310, 214), cloud(40, 40)],
  fine: [snow, waves, wind, hatch(20, 262, 150, 262, 6, 8, 120, 3)],
  parts: [
    place(swallow({ pose: 'carry' }), SW),
    place(thumbelina({ pose: 'upper', arms: 'hold', mood: 'joy', wind: true }), `translate(${sx} ${sy + 36 * 1.25}) rotate(-6) scale(1.25)`),
  ],
});
