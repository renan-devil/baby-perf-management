import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, duckling, littleDuckling, motherDuck, place } from './characters.mjs';

// The Ugly Duckling, cover: on the pond the mother duck leads her little yellow ducklings, and the
// big grey duckling paddles along behind them all.
const ripples = (x, y, w) => `M${x - w} ${y + 5}C${x - w / 2} ${y + 9} ${x + w / 2} ${y + 9} ${x + w} ${y + 4}M${x - w - 16} ${y + 13}C${x - w - 8} ${y + 15} ${x - w + 4} ${y + 15} ${x - w + 12} ${y + 12}`;
const farBank = 'M0 112C70 102 150 108 220 103C290 98 350 106 400 100';
const pad = (x, y, s) => `M${x - 20 * s} ${y}C${x - 20 * s} ${y - 8 * s} ${x + 20 * s} ${y - 8 * s} ${x + 20 * s} ${y}C${x + 20 * s} ${y + 7 * s} ${x - 20 * s} ${y + 7 * s} ${x - 20 * s} ${y}ZM${x} ${y}L${x + 14 * s} ${y - 5 * s}`;
const pads = pad(48, 264, 1) + pad(92, 274, 0.7) + pad(350, 262, 0.9);
const sun = 'M48 52C48 36 72 36 72 52C72 68 48 68 48 52Z';

export default compose({
  title: 'The Ugly Duckling',
  seed: 71,
  washes: [
    { c: PAL.green, o: 0.45, d: 'M0 112C70 102 150 108 220 103C290 98 350 106 400 100L400 128C300 132 100 134 0 130Z' },
    { c: PAL.sky, o: 0.5, d: 'M0 128C100 132 300 130 400 126L400 240C300 246 100 238 0 244Z' },
    { c: PAL.sky, o: 0.25, d: 'M10 242C120 246 280 248 390 242L390 284C280 290 120 288 10 284Z' },
    { c: PAL.green, o: 0.65, d: pads },
    { c: PAL.ochre, o: 0.5, d: sun },
  ],
  lines: [farBank],
  fine: [
    sun,
    pads,
    tufts([[30, 109], [140, 107], [262, 102], [380, 101]], 9, 5),
    ripples(76, 205, 56),
    ripples(156, 203, 20),
    ripples(196, 207, 20),
    ripples(235, 201, 20),
    ripples(322, 207, 66),
    hatch(130, 232, 300, 234, 5, 12, 178, 4),
    hatch(160, 262, 300, 264, 4, 12, 178, 8),
  ],
  parts: [
    place(duckling(), 'translate(78 205) scale(1.5)'),
    place(littleDuckling(), 'translate(156 203) scale(1.5)'),
    place(littleDuckling(), 'translate(196 207) scale(1.5)'),
    place(littleDuckling(), 'translate(235 201) scale(1.5)'),
    place(motherDuck(), 'translate(322 207) scale(1.3)'),
  ],
});
