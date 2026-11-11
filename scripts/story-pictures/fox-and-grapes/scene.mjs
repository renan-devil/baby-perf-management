import { PAL, hatch, tufts } from '../lib.mjs';
import { dot } from '../fox-and-crow/characters.mjs';

// The Fox and the Grapes: the scene shared by both pictures (an old stone wall on the right with a
// vine along its top and one big bunch of purple grapes hanging from it). The fox is the same red
// fox as in The Fox and the Crow (../fox-and-crow/characters.mjs). Not a picture: the build only
// draws files named <n>.mjs.

const f = (n) => Math.round(n * 10) / 10;

/** A bunch of grapes hanging from (x, y): rows of round grapes, widest at the top. */
export function grapes(x, y, r = 8) {
  const rows = [4, 3, 4, 3, 2, 1];
  const berries = [];
  rows.forEach((n, i) => {
    for (let k = 0; k < n; k++) berries.push(dot(f(x + (k - (n - 1) / 2) * r * 1.7 + (i % 2 ? 1 : -1)), f(y + 10 + i * r * 1.45), r));
  });
  const stem = `M${x} ${y + 4}C${x + 1} ${y - 4} ${x - 2} ${y - 10} ${x + 2} ${y - 16}`;
  return { berries, stem };
}

export const ground = 'M0 272C80 268 180 274 280 270C330 268 370 271 400 269';
const wallTop = 'M232 270L236 118C280 112 340 114 404 112';
const stones =
  'M236 150C260 148 300 150 330 148C360 147 380 148 404 147M236 186C270 184 310 186 350 184C376 183 392 184 404 184M235 222C266 220 300 223 340 221C370 220 390 221 404 220M234 256C264 254 300 257 340 255C370 254 390 255 404 254' +
  'M280 116L280 148M340 114L340 148M260 150L260 186M312 149L312 185M372 148L372 184M290 186L290 222M350 184L350 221M262 222L262 256M320 222L320 256M384 221L384 255';
// the vine: a twisty branch along the top of the wall and up to an overhanging arch
const vine = 'M404 104C372 98 352 108 330 96C310 84 300 70 280 64C262 58 244 62 232 70';
const vineTwigs = 'M330 96C336 86 346 82 356 84M280 64C274 54 276 46 284 40M300 74C304 80 302 88 296 92';
const leaf = (x, y, s) =>
  `M${x} ${y}C${f(x - 8 * s)} ${f(y - 4 * s)} ${f(x - 10 * s)} ${f(y - 14 * s)} ${f(x - 4 * s)} ${f(y - 18 * s)}C${f(x - 1 * s)} ${f(y - 12 * s)} ${f(x + 4 * s)} ${f(y - 20 * s)} ${f(x + 8 * s)} ${f(y - 14 * s)}C${f(x + 12 * s)} ${f(y - 8 * s)} ${f(x + 6 * s)} ${f(y - 2 * s)} ${x} ${y}Z`;
const leaves = leaf(356, 86, 1.1) + leaf(284, 42, 1) + leaf(236, 74, 0.9) + leaf(380, 104, 1) + leaf(318, 94, 0.9);

/** The wall, the vine and the bunch of grapes hanging at (gx, gy). */
export function scene(gx = 262, gy = 66) {
  const g = grapes(gx, gy);
  return {
    washes: [
      { c: PAL.green, o: 0.38, d: 'M0 268C80 264 180 270 280 266C330 264 370 267 400 265L400 300L0 300Z' },
      { c: PAL.grey, o: 0.55, d: 'M236 118C280 112 340 114 404 112L404 270L232 270Z' },
      { c: PAL.ochre, o: 0.18, d: 'M236 150C300 150 360 147 404 147L404 186L236 186Z' },
      { c: PAL.terracotta, o: 0.5, d: `${vine}L232 74C246 66 262 64 280 70C300 76 312 90 330 102C352 114 372 104 404 110Z` },
      { c: PAL.green, o: 0.75, d: leaves },
      { c: PAL.slate, o: 0.7, d: g.berries.join('') },
      { c: PAL.rose, o: 0.95, d: g.berries.join('') },
    ],
    lines: [ground, wallTop, vine, g.stem],
    fine: [stones, vineTwigs, leaves, ...g.berries, hatch(20, 284, 220, 286, 9, 6, 160, 6), tufts([[30, 271], [120, 272], [214, 271]], 9, 8)],
    glints: g.berries.slice(0, 12).map((b, i) => (i % 2 ? '' : b.replace(/^M([\d.]+) ([\d.]+).*/, (m, x, y) => dot(Number(x) + 4.5, Number(y) - 3, 1.6)))).join(''),
  };
}
