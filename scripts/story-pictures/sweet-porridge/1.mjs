import { PAL, hatch, tufts } from '../lib.mjs';
import { G_ARMS, HOLD_POT, compose, girl, place, pot, steam } from './characters.mjs';

// Sweet Porridge, 1 (cover): the little girl holds the little black magic pot in both hands, and
// warm golden porridge bubbles up over its edge; curls of steam rise and little sparkles of magic
// twinkle round it.
const ground = 'M0 276C90 272 190 278 290 274C340 272 370 275 400 273';
const G = 'translate(200 284) scale(2.3)';
// four-pointed sparkles
const sparkle = (x, y, s) => `M${x} ${y - s}Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y}Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s}Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y}Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s}Z`;
const sparkles = [sparkle(110, 150, 9), sparkle(296, 132, 11), sparkle(84, 208, 6), sparkle(316, 196, 7), sparkle(132, 92, 5), sparkle(276, 74, 6)].join('');

export default compose({
  title: 'Sweet Porridge',
  seed: 141,
  washes: [
    { c: PAL.ochre, o: 0.32, d: 'M0 272C90 268 190 274 290 270C340 268 370 271 400 269L400 298C300 300 100 299 0 298Z' },
    { c: PAL.ochre, o: 0.85, d: sparkles },
  ],
  lines: [ground],
  fine: [sparkles, hatch(14, 288, 386, 290, 12, 8, 172, 4), tufts([[30, 274], [372, 272], [94, 276], [318, 275]], 9, 6)],
  parts: [
    place(girl({ mood: 'laugh', arms: G_ARMS.hold, hold: true }), G),
    place(pot({ inside: 'heap' }), `${G} ${HOLD_POT}`),
    place(steam(1, 40), 'translate(158 172) rotate(-62)'),
    place(steam(1, 40), 'translate(242 172) rotate(62)'),
  ],
});
