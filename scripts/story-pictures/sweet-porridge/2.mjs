import { PAL } from '../lib.mjs';
import { compose, dot, girl, oldWoman, place, pot, stick } from './characters.mjs';

// Sweet Porridge, 2: in the snowy winter wood, by the old tree stump, a kind old woman in a
// terracotta shawl, leaning on her stick, holds out the little black pot, and the little girl
// reaches up to take it.
const ground = 'M0 266C70 262 150 268 230 264C300 261 360 266 400 263';
// bare trees at the edges, their branches capped with snow
const treeL = 'M18 266C22 200 16 120 24 -4M44 266C38 200 46 120 40 -4M38 150C54 136 66 120 86 112M40 172C50 164 58 160 74 158M24 96C12 84 4 70 -4 62';
const treeLFill = 'M20 266C24 200 18 120 26 -4L40 -4C44 120 36 200 42 266Z';
const treeR = 'M366 266C370 200 362 120 368 -4M390 266C384 200 392 120 386 -4M368 128C350 114 336 98 314 92M368 168C356 160 344 156 330 156M388 70C398 60 404 54 410 50';
const treeRFill = 'M368 266C372 200 364 120 370 -4L384 -4C390 120 382 200 388 266Z';
const snowCaps =
  'M58 128C66 120 78 112 88 110C84 116 72 122 60 132ZM316 90C330 92 344 100 356 110C346 108 332 100 316 96ZM330 154C340 152 352 154 362 160C352 160 340 158 330 158ZM-2 60C6 64 14 72 20 80C12 76 4 70 -2 66Z';
// the old tree stump, with a cap of snow
const stumpSide = 'M48 262C50 246 50 230 48 218M96 262C94 246 94 230 96 218';
const stumpSnow = 'M46 216C46 206 56 204 64 208C70 202 84 202 90 208C98 206 102 214 98 220C92 216 84 214 72 214C60 214 52 216 46 216Z';
const stumpRoots = 'M48 262C44 264 40 266 36 266M96 262C100 264 104 266 108 266';
// soft snow mounds and falling flakes
const mounds = 'M110 280C130 272 160 272 176 280M240 284C262 276 292 276 310 284M14 288C30 282 50 282 64 288';
const flakeAt = (x, y, s) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}M${x - s * 0.7} ${y - s * 0.7}L${x + s * 0.7} ${y + s * 0.7}M${x - s * 0.7} ${y + s * 0.7}L${x + s * 0.7} ${y - s * 0.7}`;
const flakes = [
  flakeAt(110, 40, 4),
  flakeAt(170, 22, 3),
  flakeAt(236, 48, 4),
  flakeAt(300, 26, 3.5),
  flakeAt(150, 84, 3),
  flakeAt(332, 200, 3),
  flakeAt(70, 176, 3),
  flakeAt(196, 110, 3),
].join('');
const dots = [dot(134, 60, 1.6), dot(210, 30, 1.4), dot(262, 82, 1.6), dot(92, 74, 1.4), dot(336, 50, 1.4), dot(28, 220, 1.4), dot(352, 236, 1.6), dot(186, 150, 1.4)].join('');

const G = 'translate(124 270) scale(1.5)';
const W = 'translate(270 270) scale(1.35)';

export default compose({
  title: 'The little black pot',
  seed: 143,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M0 262C70 258 150 264 230 260C300 257 360 262 400 259L400 300L0 300Z' },
    { c: PAL.sky, o: 0.4, d: mounds.replace(/(\d)M/g, '$1ZM') + 'Z' },
    { c: PAL.grey, o: 0.55, d: `${treeLFill}${treeRFill}` },
    { c: PAL.terracotta, o: 0.35, d: `${treeLFill}${treeRFill}` },
    { c: PAL.ochre, o: 0.55, d: 'M48 218C50 230 50 246 48 262L96 262C94 246 94 230 96 218Z' },
    { c: PAL.terracotta, o: 0.4, d: 'M48 218C50 230 50 246 48 262L96 262C94 246 94 230 96 218Z' },
    { c: PAL.sky, o: 0.45, d: snowCaps },
    { c: PAL.sky, o: 0.35, d: stumpSnow },
    { c: PAL.sky, o: 0.8, d: dots },
  ],
  whites: stumpSnow,
  lines: [ground, treeL, treeR, stumpSide, stumpSnow, stumpRoots],
  fine: [snowCaps, 'M72 211C68 213 64 214 60 214', mounds, flakes, 'M28 210c3 6 3 12 0 18M378 190c-3 6 -3 12 0 18M30 60c2 4 2 8 0 12'],
  once: `<path d="M58 226c2 10 2 20 0 30M74 232c-2 8 -2 16 0 24M88 224c2 8 2 16 0 24"/>`,
  parts: [
    place(stick(), 'translate(314 272) rotate(2) scale(1.05)'),
    place(
      oldWoman({
        mood: 'mmm',
        tilt: -8,
        arms: [
          [[-19, -92, 9], [-28, -86, 8.5], [-35, -79, 8.5], [-41, -74, 8.5]],
          [[19, -92, 9], [25, -80, 8.5], [30, -68, 8.5], [32, -60, 8.5]],
        ],
      }),
      W,
    ),
    place(
      girl({
        mood: 'peep',
        tilt: 6,
        arms: [
          [[-12, -62, 7], [-16, -52, 6.5], [-18, -42, 6.5], [-18, -36, 6.5]],
          [[12, -62, 7], [19, -65, 6.5], [24, -67, 6.5], [28, -67, 6.5]],
        ],
      }),
      G,
    ),
    place(pot({ inside: 'empty' }), 'translate(188 205) scale(1.275)'),
  ],
});
