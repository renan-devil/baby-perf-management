import { PAL } from '../lib.mjs';
import { compose, goldenBird, place, sparkle } from './characters.mjs';

// The Nightingale, 5: a gift for the Emperor! In the open box sits a golden mechanical bird,
// covered in sparkling jewels, with a little silver wind-up key in its back. Its lid lies on the floor.
const BIRD = 'translate(214 167) scale(2.3)';
const front = 'M120 218L280 218L280 282L120 282Z';
const top = 'M120 218L158 194L318 194L280 218Z';
const side = 'M280 218L318 194L318 258L280 282Z';
// the lid, put down on the floor in front of the box, its ribbon still tied
const lid = 'M24 284L34 252L104 258L98 292Z';
const lidFill = lid;
const ribbon = 'M192 218L210 218L210 282L192 282ZM294 209L302 204L302 268L294 273ZM60 255L74 256L68 290L54 289Z';
const bow = 'M67 256C50 240 40 256 56 262C62 264 64 260 67 256C70 238 92 244 84 258C80 264 72 260 67 256Z';
const shadow = 'M104 284C140 278 300 278 334 270L342 278C320 292 140 296 104 290Z';

export default compose({
  title: 'The golden bird in its box',
  seed: 1259,
  washes: [
    { c: PAL.grey, o: 0.35, d: shadow },
    { c: PAL.red, o: 0.55, d: lidFill },
    { c: PAL.red, o: 0.35, d: top },
    { c: PAL.red, o: 0.8, d: front },
    { c: PAL.red, o: 0.8, d: side },
    { c: PAL.slate, o: 0.3, d: side },
    { c: PAL.green, o: 0.85, d: ribbon + bow },
  ],
  lines: [lid, front, side, 'M120 218L158 194L318 194'],
  whites: 'M126 216L160 197L314 197L282 215Z',
  fine: [ribbon, bow, 'M134 212l12 -6M296 204l10 -5M270 212l14 -3', sparkle(70, 120, 8), sparkle(340, 70, 9), sparkle(110, 40, 6), sparkle(354, 150, 6), sparkle(290, 30, 5), sparkle(60, 190, 5)],
  parts: [place(goldenBird({ feet: false }), BIRD)],
});
