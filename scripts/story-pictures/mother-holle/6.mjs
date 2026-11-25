import { PAL } from '../lib.mjs';
import { cloud, compose, dot, flurry, marie, merge, pillow, place } from './characters.mjs';

// Mother Holle, 6: high up in Mother Holle's house, Marie leans out of the window and shakes a
// feather pillow, fluff, fluff! The feathers turn into snow and fall, far below, on the roofs of a
// tiny village, where a little snowman already stands.
const MT = 'translate(84 216) scale(1.3)';
const wall = 'M8 30C50 26 130 26 160 30L162 168C130 172 50 172 8 168Z';
const opening = 'M32 46L140 46L140 154L32 154Z';
const frame = 'M32 154L32 46L140 46L140 82M140 124L140 154';
const sill = 'M24 154L148 154L151 165L21 165Z';
const shutterL = 'M32 48L12 42L12 160L32 154';
const roof = 'M0 32L168 32L160 12L8 12Z';

/** A tiny house in the village below (centre of its foot at x, y), with snow on its red roof. */
function house(x, y, w = 26, h = 20, s = 1) {
  const walls = `M${x - w / 2} ${y}L${x - w / 2} ${y - h}L${x + w / 2} ${y - h}L${x + w / 2} ${y}`;
  const roofD = `M${x - w / 2 - 4} ${y - h}L${x} ${y - h - 16 * s}L${x + w / 2 + 4} ${y - h}Z`;
  const snow = `M${x - w / 2 - 4} ${y - h}L${x} ${y - h - 16 * s}L${x + w / 2 + 4} ${y - h}C${x + w / 4} ${y - h - 6} ${x + 4} ${y - h - 2} ${x} ${y - h - 6}C${x - 4} ${y - h - 2} ${x - w / 4} ${y - h - 6} ${x - w / 2 - 4} ${y - h}Z`;
  const win = `M${x - 4} ${y - h + 6}L${x + 4} ${y - h + 6}L${x + 4} ${y - h + 13}L${x - 4} ${y - h + 13}Z`;
  return {
    fine: [walls, roofD, win, snow],
    washes: [
      { c: PAL.red, o: 0.75, d: roofD },
      { c: PAL.grey, o: 0.18, d: `${walls}Z` },
      { c: PAL.ochre, o: 0.85, d: win },
    ],
    whites: [snow],
  };
}
const village = merge(
  house(232, 270, 24, 18),
  house(270, 262, 30, 22, 1.2),
  house(312, 272, 24, 18),
  house(350, 264, 28, 20),
  // the church with its little spire
  {
    fine: ['M286 276L286 244L300 230L314 244L314 276', 'M300 230L300 206M296 212l8 0'],
    washes: [{ c: PAL.grey, o: 0.2, d: 'M286 276L286 244L300 230L314 244L314 276Z' }],
  },
  // a tiny snowman
  { fine: [dot(378, 280, 6), dot(378, 268, 4.2), 'M381 268l4 1'], whites: [dot(378, 280, 6), dot(378, 268, 4.2)], washes: [{ c: PAL.terracotta, o: 0.9, d: 'M381 267.5l4 1l-4 1Z' }] },
);

export default compose({
  title: 'Snow Falls on the World Below',
  seed: 1406,
  washes: [
    { c: PAL.grey, o: 0.16, d: `${wall}${opening}`, rule: 'evenodd' },
    { c: PAL.red, o: 0.75, d: roof },
    { c: PAL.terracotta, o: 0.6, d: `${shutterL}Z` },
    { c: PAL.ochre, o: 0.55, d: sill },
    // snowy ground of the village below
    { c: PAL.sky, o: 0.22, d: 'M200 276C240 266 330 262 396 268L396 292C330 296 250 296 200 288Z' },
  ],
  lines: [frame, sill, shutterL, roof],
  fine: [
    'M12 88L32 90M12 126L32 126',
    'M26 22l14 0M70 22l14 0M114 22l14 0M146 22l8 0',
    'M206 286C250 280 330 276 394 280',
    // shake marks
    'M166 74q-6 -8 0 -16M182 70l4 -10M226 150q8 4 12 -4',
  ],
  parts: [
    place(
      marie({
        mood: 'laugh',
        bust: true,
        arms: [
          [[-12, -80, 7], [-17, -68, 6.5], [-18, -58, 6.5], [-14, -52, 6.5]],
          [[12, -80, 7], [30, -86, 6.5], [48, -90, 6.5], [64, -92, 6.5]],
        ],
      }),
      MT,
    ),
    place(pillow(), 'translate(192 126) rotate(30) scale(1.05)'),
    village,
    cloud(100, 210, 110),
    cloud(36, 250, 60),
    cloud(190, 250, 70),
    flurry(222, 50, 300, 170, 6, 21, 0.15),
    flurry(250, 150, 396, 232, 12, 23, 0.95),
    flurry(300, 24, 396, 150, 9, 29, 0.6),
    flurry(190, 190, 250, 240, 2, 31, 0.9),
  ],
});
