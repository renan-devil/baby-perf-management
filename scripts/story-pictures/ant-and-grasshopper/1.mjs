import { PAL, hatch, paths, rays, transformPath, tufts } from '../lib.mjs';

// The Ant and the Grasshopper, cover: on a hot summer day the green Grasshopper sits on a bent blade of
// grass playing his fiddle, while the little Ant walks below with a big grain of wheat on her back.
// The two characters are drawn here once, around their own origins, and picture 2 reuses them.

// --- The Grasshopper, around (0,0) = his hip; he faces right. ---
export const gHead = 'M-8 -66C-10 -82 6 -90 18 -86C30 -82 36 -68 30 -58C24 -50 8 -48 0 -53C-5 -56 -8 -61 -8 -66Z';
export const gThorax = 'M-9 2C-14 -16 -12 -38 -5 -52M12 2C16 -16 14 -36 9 -52';
export const gAbdomen = 'M6 -6C-20 -14 -52 -12 -72 -4C-80 0 -78 8 -70 10C-48 14 -18 12 6 6';
export const gRings = 'M-22 -10C-25 -3 -25 5 -22 11M-38 -10C-41 -3 -41 5 -38 11M-54 -8C-57 -2 -57 5 -54 10';
export const gWing = 'M-4 -22C-26 -19 -58 -11 -84 -2C-62 2 -30 -2 -6 -9';
export const gWingVein = 'M-12 -15C-32 -12 -54 -7 -72 -2';
export const gThigh = 'M4 -2C-6 -24 -22 -40 -36 -45C-43 -46 -44 -39 -40 -34C-30 -22 -16 -6 -8 6';
export const gThighStripe = 'M-4 -8C-12 -20 -22 -30 -34 -38';
export const gEyeWhite = 'M10 -74C10 -82 23 -82 23 -74C23 -67 10 -67 10 -74Z';
export const gHeadWash = 'M-7 -66C-8 -80 6 -88 18 -84C29 -80 34 -68 29 -59C23 -52 8 -50 0 -54C-5 -57 -7 -61 -7 -66Z';
export const gBodyWash =
  'M-9 2C-14 -16 -12 -38 -5 -52L9 -52C14 -36 16 -16 12 2ZM6 -6C-20 -14 -52 -12 -72 -4C-80 0 -78 8 -70 10C-48 14 -18 12 6 6ZM4 -2C-6 -24 -22 -40 -36 -45C-43 -46 -44 -39 -40 -34C-30 -22 -16 -6 -8 6Z';
export const gWingWash = 'M-4 -22C-26 -19 -58 -11 -84 -2C-62 2 -30 -2 -6 -9Z';
export const gCheek = 'M24 -62C24 -66 30 -66 30 -62C30 -59 24 -59 24 -62Z';

// Cover pose: antennae up, eyes shut with joy, hind leg dangling, arms playing.
const gAntennae = 'M6 -86C0 -108 -12 -122 -26 -126C-32 -127 -34 -121 -29 -119M15 -87C20 -110 32 -124 46 -127C52 -128 54 -122 49 -120';
const gShin = 'M-39 -38C-42 -20 -45 -2 -47 16L-38 18';
const gMidLegs = 'M2 6L4 18L12 20M-10 6L-16 16L-10 20';
const gJoy = 'M11 -73Q17 -80 23 -73M14 -59Q22 -52 29 -61';
// The fiddle under his chin; the bow arm crosses in front.
const F = 'translate(48 -56) rotate(55)';
const gArmNeck = 'M7 -42C28 -40 50 -52 66 -68L74 -76';
const gArmBow = 'M2 -36C14 -24 34 -24 52 -35';

// --- The fiddle, around (0,0) = middle of its body, neck pointing up. ---
export const fBody = 'M0 -22C-10 -22 -13 -14 -8 -8C-13 -3 -15 6 -11 14C-7 22 7 22 11 14C15 6 13 -3 8 -8C13 -14 10 -22 0 -22Z';
export const fNeck = 'M-2 -22L-2 -44M2 -22L2 -44M-2 -44C-6 -50 4 -55 5 -49C5 -47 3 -46 2 -44';
export const fDetail = 'M0 -44L0 14M-5 5L5 5M-6 -6C-5 -2 -6 1 -5 3M6 -6C5 -2 6 1 5 3M-3 14L3 14';
export const fWash = 'M0 -22C-10 -22 -13 -14 -8 -8C-13 -3 -15 6 -11 14C-7 22 7 22 11 14C15 6 13 -3 8 -8C13 -14 10 -22 0 -22ZM-2 -22L2 -22L2 -44L-2 -44Z';
const bow = 'M15 -95C16 -97 18 -97 19 -95L58 -31M16 -92L55 -31';

// --- The Ant, around (0,0) = between her feet on the ground; she faces right. ---
export const aGaster = 'M-30 -15C-31 -24 -16 -27 -8 -20C-4 -16 -6 -9 -12 -7C-21 -5 -29 -8 -30 -15Z';
export const aThorax = 'M-8 -17C-7 -22 3 -24 5 -19C6 -15 -5 -12 -8 -17Z';
export const aHead = 'M4 -24C4 -32 18 -34 20 -25C21 -18 14 -15 9 -16C6 -17 4 -20 4 -24Z';
export const aEyeWhite = 'M11 -26C11 -30 17 -30 17 -26C17 -23 11 -23 11 -26Z';
export const aSmile = 'M13 -19Q17 -17 19 -20';
export const aWash = 'M-30 -15C-31 -24 -16 -27 -8 -20C-4 -16 -6 -9 -12 -7C-21 -5 -29 -8 -30 -15ZM-8 -17C-7 -22 3 -24 5 -19C6 -15 -5 -12 -8 -17ZM4 -24C4 -32 18 -34 20 -25C21 -18 14 -15 9 -16C6 -17 4 -20 4 -24Z';
// Walking pose with the grain held on her back.
const aAntennae = 'M10 -31C10 -40 14 -45 20 -46M15 -31C19 -38 25 -40 30 -38';
const aLegs = 'M-5 -15L-12 -7L-17 0M-1 -14L-2 -6L-5 0M2 -15L8 -8L13 0';
const aArms = 'M-2 -20L-8 -32M3 -20L4 -33';
const grain = 'M-26 -38C-28 -48 -10 -56 6 -52C18 -49 20 -40 12 -35C0 -29 -22 -29 -26 -38Z';
const grainCrease = 'M-20 -40C-10 -45 2 -46 12 -42';

// --- Placing them in the meadow. ---
const G = 'translate(132 176) scale(1.25)';
const A = 'translate(290 252) scale(1.7)';
const at = (d, t) => transformPath(d, t);

const ground = 'M8 254C90 250 200 256 300 252C340 250 370 253 392 251';
const blade = 'M146 256C150 226 148 206 132 196C104 184 60 186 20 206M162 256C166 226 162 210 146 203C114 194 66 196 20 206';
const bladeWash = 'M146 256C150 226 148 206 132 196C104 184 60 186 20 206C66 196 114 194 146 203C162 210 166 226 162 256Z';
const sun = 'M318 64C318 50 330 40 343 40C356 40 366 51 366 64C366 78 355 88 342 88C329 88 318 77 318 64Z';
// Golden wheat behind the ant, and two little flowers.
const wheat = 'M362 252C362 210 366 170 372 130M380 252C380 216 384 186 392 156';
const ears =
  'M372 130c-6 4-6 10-2 12M372 130c6 4 6 10 2 12M370 142c-6 4-6 10-2 12M371 142c6 4 6 10 2 12M369 154c-6 4-6 10-2 12M370 154c6 3 6 9 2 11' +
  'M392 156c-6 4-6 10-2 12M392 156c6 4 5 10 1 12M390 168c-6 4-6 10-2 12M391 168c6 4 5 10 1 12';
const earsWash = 'M366 128C362 140 362 162 370 168C378 162 380 140 376 128ZM387 154C383 164 384 180 391 182C398 178 399 164 396 154Z';
const flowers = 'M196 254C196 238 198 226 202 216M222 254C222 242 220 234 216 226';
const petals = 'M202 216m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M216 226m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0';

// Music notes floating up from the fiddle.
const notes = [
  [64, 96, 1],
  [92, 66, 0.85],
  [262, 100, 1.1],
  [290, 70, 0.9],
];
const noteStems = notes.map(([x, y, s]) => `M${x + 5 * s} ${y}l0 ${-18 * s}q6 3 9 ${10 * s}`).join('');
const noteHeads = notes
  .map(([x, y, s]) => `<ellipse cx="${x}" cy="${y}" rx="${5.5 * s}" ry="${4 * s}" transform="rotate(-20 ${x} ${y})"/>`)
  .join('');

export default {
  title: 'The Grasshopper plays while the Ant works',
  seed: 41,
  washes: [
    { c: PAL.ochre, o: 0.75, d: 'M316 66C314 46 334 36 348 39C364 44 372 58 366 74C360 88 340 94 328 86C320 81 317 74 316 66Z' },
    { c: PAL.green, o: 0.4, d: 'M0 250C90 246 200 252 300 248C340 246 370 249 400 247L400 274C340 280 260 270 180 276C110 282 50 270 0 276Z' },
    { c: PAL.ochre, o: 0.5, d: 'M358 252C358 210 362 170 368 132L376 132C370 170 366 210 366 252ZM376 252C376 216 380 186 388 158L396 158C388 186 384 216 384 252Z' },
    { c: PAL.ochre, o: 0.7, d: earsWash },
    { c: PAL.rose, o: 0.75, d: 'M194 216C194 206 210 206 210 216C210 226 194 226 194 216ZM210 226C210 218 222 218 222 226C222 233 210 233 210 226Z' },
    { c: PAL.green, o: 0.6, d: bladeWash },
    { c: PAL.green, o: 0.85, d: at(gBodyWash + gHeadWash, G) },
    { c: PAL.green, o: 0.5, d: at(gWingWash + gThigh, G) },
    { c: PAL.ochre, o: 0.45, d: at(gWingWash, G) },
    { c: PAL.rose, o: 0.6, d: at(gCheek, G) },
    { c: PAL.terracotta, o: 0.85, d: at(fWash, `${G} ${F}`) },
    { c: PAL.terracotta, o: 0.85, d: at(aWash, A) },
    { c: PAL.ink, o: 0.3, d: at(aWash, A) },
    { c: PAL.ochre, o: 0.85, d: at(grain, A) },
  ],
  whites: at(aEyeWhite, A),
  lines:
    paths([ground, blade, sun, wheat, flowers, noteStems]) +
    paths([gHead, gThorax, gAbdomen, gWing, gThigh, gShin, gAntennae, gArmNeck, gArmBow, bow, gJoy], G) +
    paths([fBody, fNeck], `${G} ${F}`) +
    paths([aGaster, aThorax, aHead, aAntennae, aLegs, aArms, grain], A),
  fine:
    paths([
      ears,
      petals,
      rays(342, 64, 31, 44, 12, 5),
      hatch(20, 264, 140, 266, 9, 6, 160, 6),
      hatch(220, 262, 330, 262, 8, 6, 160, 7),
      tufts([[100, 254], [214, 254], [268, 253], [392, 251]], 9, 8),
      'M78 112c4-3 8-3 12 0M276 118c4-3 8-3 12 0',
    ]) +
    paths([gRings, gWingVein, gThighStripe, gMidLegs, hatch(-40, -30, -46, 12, 5, 4, 200, 3)], G) +
    paths([fDetail], `${G} ${F}`) +
    paths([aSmile, grainCrease, 'M-24 -3l-2 4M-12 -1l2 4', 'M28 -30l6-3M28 -36l5-6M-34 -38l-6-2M-32 -46l-6-5'], A),
  fills: noteHeads + `<circle cx="${290 + 14.8 * 1.7}" cy="${252 - 25.6 * 1.7}" r="2.4"/>`,
  glints: `<circle cx="${290 + 15.4 * 1.7}" cy="${252 - 26.4 * 1.7}" r="0.8"/>`,
};
