import { PAL, hatch } from '../lib.mjs';
import { bench, candle, compose, place, shoemaker, wife, windowPanes } from './characters.mjs';

// The Elves and the Shoemaker, cover: on a winter evening, in his little shop, the old shoemaker cuts
// out his very last piece of leather on the workbench while his wife holds up the candle for him.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const K = 1.25; // the characters' size in this picture
const BT = 272 - 76 * 1.2; // front edge of the bench top

// the hide of leather on the bench, with the outline of a sole being cut out (dashed)
const hide = 'M206 176C198 168 208 162 226 161C250 159 284 158 306 163C322 167 322 176 310 180C284 184 232 185 206 176Z';
const cut = 'M232 172C228 166 236 164 248 164C262 164 268 168 264 172C258 176 238 177 232 172Z';

const SM = `translate(272 ${BT + 52 * K}) scale(${K})`;
// the knife in his right hand (his own coordinates)
const knife = 'M12 -64L-4 -58L-3 -55L14 -60Z';

const W = `translate(78 274) scale(${K})`;

export default compose({
  title: 'The Elves and the Shoemaker',
  seed: 41,
  washes: [
    // the dark of the evening all around, warm near the candle
    { c: PAL.slate, o: 0.18, d: 'M30 60C40 20 140 14 220 16C320 18 384 30 388 90C394 160 392 230 380 272L22 274C14 200 20 120 30 60Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.terracotta, o: 0.75, d: hide },
  ],
  lines: [floor, hide],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4)],
  once: `<path stroke-dasharray="4 3" d="${cut}"/>`,
  parts: [
    windowPanes(318, 40, 56, 56, { night: true, snow: [[326, 50], [342, 60], [330, 74], [356, 50], [366, 70], [350, 86], [334, 88], [362, 90]] }),
    place(bench({ w: 180, h: 76 }), `translate(265 272) scale(1.2)`),
    place(
      shoemaker({
        mood: 'down',
        tilt: 4,
        upper: true,
        arms: [
          [[-20, -104, 10], [-34, -92, 9], [-38, -78, 9], [-30, -66, 9]],
          [[20, -104, 10], [34, -92, 9], [30, -76, 9], [16, -67, 9]],
        ],
      }),
      SM,
    ),
    place({ lines: [knife], washes: [{ c: PAL.grey, o: 0.8, d: knife }] }, SM),
    place(
      wife({
        mood: 'down',
        tilt: 6,
        arms: [
          [[-18, -100, 9], [-23, -86, 8], [-25, -72, 8], [-24, -64, 8]],
          [[18, -100, 9], [30, -94, 8], [40, -100, 8], [44, -110, 8]],
        ],
      }),
      W,
    ),
    place(candle({ glow: 56 }), `translate(${78 + 44 * K} ${274 - 108 * K}) scale(${K})`),
  ],
});
