// Fly a kite: a diamond kite high among soft clouds, its bow-tie tail streaming, the string curving down.
import { PAL, paths, transformPath } from '../story-pictures/lib.mjs';

// The kite: four corners and the point where its two sticks cross.
const [top, right, bottom, left, mid] = [[276, 22], [336, 82], [266, 168], [214, 74], [272, 78]];
const pt = ([x, y]) => `${x} ${y}`;
const kite = `M${pt(top)}L${pt(right)}L${pt(bottom)}L${pt(left)}Z`;
const sticks = `M${pt(top)}L${pt(bottom)}M${pt(left)}L${pt(right)}`;
const panel = (a, b) => `M${pt(a)}L${pt(b)}L${pt(mid)}Z`;

// The tail, streaming downwind, with bows tied along it.
const tail = 'M266 168C268 182 274 188 280 192C292 200 304 204 310 214C318 228 318 240 312 250C306 260 306 270 316 276';
const bowAt = (x, y, a) => `translate(${x} ${y}) rotate(${a})`;
const bow = 'M0 0L-13 -8C-15 -3 -15 3 -13 8ZM0 0L13 -8C15 -3 15 3 13 8Z';
const knot = 'M-3 0C-3 -3.5 3 -3.5 3 0C3 3.5 -3 3.5 -3 0Z';
const bows = [bowAt(280, 192, 30), bowAt(310, 214, 62), bowAt(313, 248, 110), bowAt(316, 276, 40)];

// The bridle, and the string sagging a little on its way down to the bottom corner.
const bridle = 'M272 78L234 128L268 142';
const string = 'M234 128C206 196 120 260 12 292';

// Soft clouds and the wind.
const cloud1 = 'M34 84C22 84 20 68 34 66C34 52 54 46 64 56C70 42 94 42 100 56C112 50 128 58 124 72C136 74 136 88 122 88C100 92 58 92 34 84Z';
const cloud2 = 'M60 186C48 186 48 172 60 172C62 162 78 158 86 166C92 158 108 160 110 170C120 170 122 184 110 186C96 190 74 190 60 186Z';
const cloud3 = 'M346 50C338 50 338 40 346 40C348 32 360 30 366 36C372 30 384 34 384 42C392 44 390 54 382 54C372 56 356 56 346 50Z';
const wind =
  'M140 124C164 116 190 116 206 124C216 130 212 142 202 140C194 138 196 128 204 128M150 140C166 136 180 136 190 140M158 32C176 26 196 26 208 34C216 40 212 50 204 48C198 46 200 40 206 40M352 118C364 112 378 112 388 118';

export default {
  title: 'Fly a kite',
  seed: 281,
  washes: [
    // the sky, with the clouds and the kite left as paper
    {
      c: PAL.sky,
      o: 0.34,
      rule: 'evenodd',
      d: 'M18 52C14 24 70 12 140 18C200 10 270 6 340 14C384 18 396 44 388 80C384 120 376 150 350 164C320 176 296 162 276 178C240 198 200 186 160 200C120 214 70 222 40 206C16 192 22 160 16 130C12 100 20 80 18 52Z' + kite + cloud1 + cloud2 + cloud3,
    },
    { c: PAL.slate, o: 0.25, d: 'M36 86C60 94 100 94 122 90C116 98 60 100 36 86ZM62 188C78 192 98 192 110 188C102 196 74 196 62 188Z' },
    // the kite's four panels
    { c: PAL.red, o: 0.82, d: panel(top, left) + panel(bottom, right) },
    { c: PAL.ochre, o: 0.85, d: panel(right, top) + panel(left, bottom) },
    // the bows
    { c: PAL.sky, o: 0.8, d: transformPath(bow, bows[0]) + transformPath(bow, bows[2]) },
    { c: PAL.green, o: 0.8, d: transformPath(bow, bows[1]) + transformPath(bow, bows[3]) },
  ],
  whites: 'M262 40C266 36 270 34 272 32C270 40 268 46 266 52Z',
  lines: paths([kite]) + paths(bows.map((b) => transformPath(bow, b))),
  fine: paths([sticks, bridle, tail, cloud1, cloud2, cloud3, wind]) + paths(bows.map((b) => transformPath(knot, b))),
  once: `<path d="${string}" stroke-width="1.2"/>`,
};
