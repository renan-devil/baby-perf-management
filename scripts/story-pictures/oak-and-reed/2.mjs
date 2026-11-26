import { PAL, hatch, paths, rng, transformPath, tufts } from '../lib.mjs';
import {
  oakBark,
  oakBranches,
  oakCrown,
  oakCrownShade,
  oakCrownWash,
  oakLeafMarks,
  oakRootFlares,
  oakShadeHatch,
  oakTrunk,
  oakTrunkWash,
  reed,
} from './1.mjs';

// The Oak and the Reed, 2: the great storm. The little reed bends low over the water and lets the wind
// pass; the proud oak, who would not bend, tips over, his roots lifting out of the ground.
const tp = (d, t) => transformPath(d, t);

// The oak from the cover, turned about the tip of his right-hand root as he falls
const OT = 'translate(150 262) rotate(48) scale(1.05) translate(-42 -6)';
// his roots and the clod of earth they pull up (below his trunk, hidden on the cover)
const clod = 'M-44 6C-42 18 -24 26 -2 25C18 24 34 16 44 6Z';
const roots = 'M-34 8C-40 18 -48 22 -58 24M-18 12C-20 24 -26 32 -34 38M-2 14C-2 26 -6 34 -12 42M12 12C14 22 12 30 6 36M26 10C30 18 32 24 30 30';
const rootHairs = 'M-48 22l-4 6M-28 32l-6 2M-8 36l-4 6M10 28l6 4';
// his face, now very surprised
const oakSurprised = 'M-11 -60c0-5 7-5 7 0c0 5-7 5-7 0zM4 -60c0-5 7-5 7 0c0 5-7 5-7 0zM-4 -46c0-5 8-5 8 0c0 5-8 5-8 0zM-12 -68l7 -2M5 -70l7 2';

// The reed from the cover, curled right over the pond, with her blades swept along
const RT = 'translate(252 258)';
const R = reed(110, 120, 44);

// ground with the hole the roots came out of, and the stormy pond
const ground = 'M0 254C20 253 40 254 58 256M150 260C170 256 190 254 214 254C224 254 236 255 246 257';
const hole = 'M58 256C72 270 120 274 150 260';
const pond = 'M246 257C262 251 296 251 326 252C356 253 380 255 396 260C394 268 374 274 340 276C296 278 258 276 242 270C234 266 236 260 246 257Z';
const waves = 'M262 266q6 -5 12 0q6 -5 12 0M306 269q6 -5 12 0q6 -5 12 0M352 264q5 -4 10 0q5 -4 10 0';
const splashes = 'M362 250l-1 -7M368 251l3 -6M374 254l6 -4';

// storm clouds, wind and rain
const cloud1 = 'M8 46C2 30 20 18 36 24C42 8 70 4 82 18C96 8 118 16 116 34C128 40 124 58 108 60C98 70 72 68 62 60C48 70 22 66 18 56C10 58 4 52 8 46Z';
const cloud2 = 'M300 34C296 20 312 12 324 18C332 4 356 4 364 16C378 12 392 22 388 36C394 46 382 56 370 52C360 60 340 58 334 50C322 56 304 50 300 40Z';
const wind =
  'M6 100C40 92 70 96 96 108C110 115 108 128 96 126C86 124 88 112 98 112' +
  'M4 140C36 134 62 138 86 150' +
  'M8 176C26 172 42 173 56 178' +
  'M200 10C230 20 256 24 288 22M222 230C240 226 254 228 266 236';
// rain: short slanting dashes scattered over the sky, kept off the clouds
const rand = rng(17);
let rain = '';
const [cx, cy] = tp('M0 -138', OT).split(' ').slice(1).map(Number);
for (let i = 0; i < 200 && rain.split('M').length < 36; i++) {
  const [x, y] = [8 + rand() * 384, 70 + rand() * 160];
  if (Math.hypot((x - cx) / 1.25, y - cy) < 98 || (x > 250 && y > 170) || (x < 160 && y > 180)) continue;
  rain += `M${Math.round(x)} ${Math.round(y)}l-4 11`;
}
const leaf = (x, y, a) => tp('M0 0c4 -6 11 -6 14 0c-4 6 -11 6 -14 0zM0 0l14 0', `translate(${x} ${y}) rotate(${a})`);
const leaves = [leaf(352, 100, -20), leaf(326, 138, 30), leaf(372, 170, 10), leaf(250, 30, 15)];

export default {
  title: 'The great storm',
  seed: 43,
  washes: [
    { c: PAL.slate, o: 0.55, d: cloud1 + cloud2 },
    { c: PAL.green, o: 0.4, d: 'M0 252C20 251 40 252 58 254C80 270 120 272 150 258C170 254 200 252 246 255C238 262 238 268 244 272C200 278 100 280 0 276Z' },
    { c: PAL.terracotta, o: 0.45, d: 'M60 257C74 268 118 272 148 261C126 262 90 262 60 257Z' },
    { c: PAL.slate, o: 0.6, d: 'M248 258C264 252 296 252 326 253C356 254 378 256 394 260C392 267 372 273 340 275C296 277 260 275 244 269C238 265 239 260 248 258Z' },
    { c: PAL.sky, o: 0.5, d: 'M248 258C264 252 296 252 326 253C356 254 378 256 394 260C392 267 372 273 340 275C296 277 260 275 244 269C238 265 239 260 248 258Z' },
    { c: PAL.terracotta, o: 0.55, d: tp(clod, OT) },
    { c: PAL.green, o: 0.68, d: tp(oakCrownWash, OT) },
    { c: PAL.green, o: 0.35, d: tp(oakCrownShade, OT) },
    { c: PAL.ochre, o: 0.55, d: tp(oakTrunkWash, OT) },
    { c: PAL.green, o: 0.75, d: tp(R.stem + R.blades, RT) + leaves.join('') },
    { c: PAL.terracotta, o: 0.85, d: tp(R.head, RT) },
    { c: PAL.slate, o: 0.35, d: tp(R.head, RT) },
  ],
  lines:
    paths([oakCrown, oakTrunk, oakRootFlares, oakBranches, roots, clod], OT) +
    paths([R.stem, R.head, R.blades], RT) +
    paths([ground, hole, pond, cloud1, cloud2]),
  fine:
    paths([oakBark, oakLeafMarks, oakSurprised, oakShadeHatch, rootHairs], OT) +
    paths([R.spike, R.headMarks], RT) +
    paths([
      wind,
      waves,
      splashes,
      ...leaves,
      rain,
      hatch(10, 266, 50, 268, 3, 6, 160, 3),
      hatch(160, 268, 240, 266, 5, 6, 160, 4),
      tufts([[20, 254], [178, 256], [244, 255]], 9, 5),
    ]),
};
