import { PAL, hatch, paths, rng, transformPath } from '../lib.mjs';
import { fBody, fDetail, fNeck, fWash, gAbdomen, gBodyWash, gEyeWhite, gHead, gHeadWash, gRings, gThigh, gThighStripe, gThorax, gWing, gWingVein, gWingWash } from './1.mjs';

// The Ant and the Grasshopper, 2: winter. Snow is falling; the Grasshopper, shivering, his fiddle under
// his arm, knocks at the little door of the Ant's house in a snowy mound. Light glows in its window.
const f1 = (n) => Math.round(n * 10) / 10;
const at = (d, t) => transformPath(d, t);

// The Grasshopper from the cover (same shapes and size), standing in the snow; his head droops a little.
const G = 'translate(220 210) scale(1.25)';
const HT = `${G} rotate(10 0 -52)`;
// This pose: drooping antennae, worried eye, wobbly mouth, legs down to the snow, one arm knocking,
// the other hugging himself with the fiddle tucked under it.
const gAntennae = 'M6 -86C-2 -100 -16 -104 -30 -98C-36 -95 -34 -89 -29 -91M15 -87C22 -102 36 -106 48 -100C53 -97 51 -91 47 -93';
const gWorry = 'M9 -86L21 -83M14 -58Q17 -61 20 -58Q23 -55 26 -58Q28 -60 30 -58';
const gShin = 'M-39 -38C-42 -16 -45 6 -47 26L-38 28';
const gMidLegs = 'M2 6L6 26L14 27M-10 6L-16 24L-9 27';
const gKnock = 'M8 -44C26 -40 46 -24 61 -8';
const gFist = 'M60 -9C62 -15 70 -15 72 -9C74 -3 66 1 62 -2C60 -4 59 -6 60 -9Z';
const gHug = 'M-4 -38C2 -24 14 -14 26 -18C30 -20 30 -24 26 -25';
const F = `${G} translate(14 -27) rotate(150) scale(0.85)`;

// The Ant's house: a snowy mound with a little arched door, a round lit window and a chimney.
const mound = 'M246 248C248 196 276 136 326 120C350 114 380 116 400 126';
const snowCap = 'M262 186C274 178 288 186 300 176C314 166 330 176 344 166C360 158 378 168 400 160';
const earthWash = 'M262 186C274 178 288 186 300 176C314 166 330 176 344 166C360 158 378 168 400 160L400 250L248 250C249 228 254 206 262 186Z';
const door = 'M292 248L292 204C292 178 332 178 332 204L332 248';
const doorWash = 'M292 248L292 204C292 178 332 178 332 204L332 248Z';
const planks = 'M305 186L305 246M319 186L319 246';
const windowRing = 'M354 196C354 182 376 182 376 196C376 210 354 210 354 196Z';
const windowBars = 'M365 184L365 208M355 196L375 196';
const chimney = 'M340 118L340 94L354 94L354 116M337 94L357 94';
const smoke = 'M348 88C340 78 354 70 348 58C342 48 354 40 350 28';
const smokeWash = 'M346 90C334 78 350 68 344 58C338 46 352 34 352 26C362 34 356 48 360 58C364 70 352 80 356 90Z';

const snow = 'M0 242C40 234 90 246 140 240C190 234 230 246 270 248C320 252 360 244 400 248';
const drifts = 'M30 262c20-4 40-4 60 0M150 268c24-4 48-4 70 0M300 264c20-3 40-3 58 0';

// Shivering marks around him, and knock marks on the door.
const shivers = 'M104 186c-4 4-4 10 0 14M96 182c-6 6-6 16 0 22M196 104c-4 3-5 8-3 12M189 100c-6 5-7 13-4 19M270 112c4 3 5 8 3 12M277 108c6 5 7 13 4 19';
const knocks = 'M314 190c3 3 4 8 2 12M321 186c5 4 6 12 3 18';

// Falling snow: paper flakes everywhere, and a few little ink stars.
const r = rng(19);
const flakes = [];
for (let i = 0; i < 70; i++) {
  const x = 6 + r() * 388;
  const y = 6 + r() * 230;
  if (x > 220 && x < 272 && y > 92 && y < 152) continue; // keep his face clear
  flakes.push(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(1.4 + r() * 1.6)}"/>`);
}
const stars = [
  [40, 40],
  [120, 70],
  [70, 130],
  [300, 60],
  [210, 30],
  [380, 70],
  [30, 200],
  [160, 150],
]
  .map(([x, y]) => `M${x - 3} ${y}l6 0M${x} ${y - 3}l0 6M${x - 2} ${y - 2}l4 4M${x + 2} ${y - 2}l-4 4`)
  .join('');

export default {
  title: 'The Grasshopper knocks at the Ant’s door in the snow',
  seed: 43,
  washes: [
    { c: PAL.slate, o: 0.36, d: 'M0 0L400 0L400 124C380 114 350 112 326 118C276 134 248 194 246 244C200 236 150 236 110 240C70 244 30 236 0 240Z' },
    { c: PAL.sky, o: 0.45, d: 'M0 246C40 238 90 250 140 244C190 238 230 250 270 252C320 256 360 248 400 252L400 262C340 270 260 258 200 266C120 274 60 260 0 266Z' },
    { c: PAL.terracotta, o: 0.55, d: earthWash },
    { c: PAL.ochre, o: 0.4, d: earthWash },
    { c: PAL.red, o: 0.8, d: doorWash },
    { c: PAL.ochre, o: 0.95, d: windowRing },
    { c: PAL.grey, o: 0.55, d: smokeWash + 'M340 118L340 94L354 94L354 116Z' },
    { c: PAL.green, o: 0.85, d: at(gBodyWash, G) + at(gHeadWash, HT) },
    { c: PAL.green, o: 0.5, d: at(gWingWash + gThigh, G) },
    { c: PAL.ochre, o: 0.45, d: at(gWingWash, G) },
    { c: PAL.terracotta, o: 0.85, d: at(fWash, F) },
  ],
  whites: at(gEyeWhite, HT),
  lines:
    paths([snow, mound, snowCap, door, windowRing, chimney, smoke]) +
    paths([gThorax, gAbdomen, gWing, gThigh, gShin, gKnock, gFist, gHug], G) +
    paths([gHead, gAntennae], HT) +
    paths([fBody, fNeck], F),
  fine:
    paths([planks, windowBars, drifts, shivers, knocks, stars, hatch(250, 262, 390, 262, 8, 6, 160, 4)]) +
    paths([gRings, gWingVein, gThighStripe, gMidLegs, hatch(-40, -30, -46, 20, 5, 4, 200, 3)], G) +
    paths([gWorry], HT) +
    paths([fDetail], F),
  fills: `<circle cx="326" cy="218" r="2.6"/><circle cx="19" cy="-73" r="3" transform="${HT}"/>`,
  glints: flakes.join('') + `<circle cx="20" cy="-75" r="0.9" transform="${HT}"/>`,
};
