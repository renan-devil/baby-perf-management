import { PAL, paths, transformPath } from '../lib.mjs';
import {
  foxCheek,
  foxEars,
  foxEye,
  foxFace,
  foxHead,
  foxInnerEars,
  foxNose,
  foxTail,
  foxTailMark,
  foxTailTip,
  ground,
  limb,
  walls,
  waterLine,
  wellFine,
  wellWashes,
} from './1.mjs';

// The Fox and the Goat, 2: in the same well, the goat stands up on his hind legs in the water with his
// front hooves against the wall, and the fox scrambles up his back and long curly horns to get out.
const f = (n) => Math.round(n * 10) / 10;
const tp = (d, t) => transformPath(d, t);
const pt = ([x, y], t) => transformPath(`M${x} ${y}`, t).split(' ').slice(1).map(Number);

// ---- The goat, drawn standing on all fours (hip joint at 0,0, facing right), then stood up on his
// hind legs against the right-hand wall; his head (with its horns) turns up on its own.
const GT = 'translate(216 210) rotate(-62) scale(0.98)';
const GHT = `${GT} translate(84 -40) rotate(44) scale(1.15) translate(-84 40)`;
const gBody = 'M-10 -14C-2 -22 22 -22 44 -24C60 -25 72 -18 76 -6C78 6 70 16 54 19C40 22 26 25 12 22C-2 19 -16 6 -10 -14Z';
const gHaunch = 'M4 -18C16 -10 18 6 8 16';
const gTail = 'M-10 -14C-18 -18 -22 -24 -18 -30';
const gNeck = 'M56 -21C64 -30 70 -38 78 -46M72 -4C80 -14 88 -24 94 -32';
const gFore1 = limb([[62, 8, 12], [72, 18, 9], [82, 28, 8], [92, 36, 8]]);
const gFore2 = limb([[52, 12, 12], [60, 24, 9], [68, 34, 8], [76, 42, 8]]);
const gHooves = 'M88 32L96 40L92 44L84 36ZM72 38L80 46L76 50L68 42Z';
const gFur = 'M20 -10l6 3M36 -12l6 3M28 4l6 2M48 2l5 2';
// head (and horns) around its own frame, before the turn
const gHead = 'M72 -44C70 -54 78 -60 88 -58C96 -56 104 -50 110 -44C114 -40 114 -34 110 -32C102 -30 92 -32 84 -34C78 -36 74 -38 72 -44Z';
const gBeard = 'M100 -32C102 -24 100 -18 96 -14C94 -22 94 -28 96 -32';
const gEar = 'M78 -50C70 -54 60 -54 54 -50C60 -46 70 -46 80 -46';
const gHorn1 = limb([[84, -57, 9], [80, -70, 8], [70, -79, 7], [57, -80, 6], [48, -73, 5], [50, -64, 4], [57, -62, 3]]);
const gHorn2 = limb([[91, -56, 8], [91, -69, 7], [85, -81, 6], [73, -88, 5], [62, -87, 4], [57, -81, 3]]);
const gHornRidges = 'M78 -68l6 3M70 -76l3 6M58 -78l0 6M50 -70l5 1M88 -70l5 -2M82 -80l3 5M72 -86l1 5';
const gFace = 'M88 -50C90 -53 95 -53 96 -50M106 -40l3 -1M98 -34Q103 -32 108 -35';
const gEye = [92, -48];
// his hind legs, in the picture's own coordinates, standing in the water
const gHind = 'M206 212C200 222 200 230 202 238M218 220C218 228 218 232 220 238M226 216C230 224 232 230 232 238M240 206C244 216 246 228 246 238';
const gHindWash = 'M202 212L242 204L246 238L202 238Z';
const splash = 'M190 232c4 -6 8 -8 12 -4M248 230c4 -6 10 -8 14 -4M184 246c8 -2 14 2 20 0M236 250c8 -2 14 2 20 0';

// ---- The fox from the cover (same head, ears and tail), now stretched out facing left: hind paws
// pushing on the goat's horns, front paws on top of the well wall, nose poking out into the air.
const FT = 'translate(0 0)';
const torso = 'M122 40C130 32 150 36 166 44C180 50 190 56 192 64C190 74 178 76 168 72C152 66 136 58 126 52C120 48 119 44 122 40Z';
const bib = 'M124 50C130 56 140 60 150 64C140 64 130 60 124 54Z';
const fore1 = limb([[128, 48, 10], [118, 50, 8], [108, 48, 7], [101, 44, 6]]);
const fore2 = limb([[136, 56, 10], [126, 60, 8], [118, 58, 7], [112, 52, 6]]);
const hind1 = limb([[184, 64, 13], [194, 70, 9], [203, 75, 7], [210, 78, 6]]);
const hind2 = limb([[174, 70, 11], [180, 78, 8], [188, 83, 6], [195, 86, 6]]);
const effort = 'M150 30l1 -6M160 33l3 -6M140 28l-1 -6';
const FHT = 'translate(126 36) scale(-1.2 1.2) rotate(-24)';
const FTT = 'translate(188 56) scale(-1.1 1.1) rotate(28)';
const foxShapes = [torso, fore1, fore2, hind1, hind2];

export default {
  title: 'Up the goat and out!',
  seed: 72,
  washes: [
    ...wellWashes,
    // goat
    { c: PAL.grey, o: 0.42, d: tp(`${gBody}${gFore1}Z${gFore2}Z`, GT) + tp(`${gHead}${gEar}Z`, GHT) + gHindWash },
    { c: PAL.ochre, o: 0.62, d: tp(`${gHorn1}Z${gHorn2}Z`, GHT) },
    { c: PAL.ink, o: 0.6, d: tp(gHooves, GT) },
    // fox
    { c: PAL.terracotta, o: 0.85, d: tp(foxShapes.join('Z') + 'Z', FT) + tp(foxHead + foxEars + 'Z', FHT) + tp(foxTail + 'Z', FTT) },
    { c: PAL.red, o: 0.25, d: tp(foxTail + 'Z', FTT) },
    { c: PAL.ink, o: 0.5, d: tp(foxInnerEars, FHT) },
  ],
  whites: tp(bib, FT) + tp(foxCheek, FHT) + tp(foxTailTip, FTT),
  lines:
    paths([ground, walls, waterLine]) +
    paths([gBody, gFore1, gFore2, gTail, gNeck], GT) +
    paths([gHead, gBeard, gEar, gHorn2, gHorn1], GHT) +
    paths([gHind]) +
    paths(foxShapes, FT) +
    paths([foxHead, foxEars], FHT) +
    paths([foxTail], FTT),
  fine:
    paths(wellFine) +
    paths([gHaunch, gFur], GT) +
    paths([gHornRidges, gFace], GHT) +
    paths([splash]) +
    paths([effort], FT) +
    paths([foxFace], FHT) +
    paths([foxTailMark], FTT),
  fills:
    `<circle cx="${pt(foxEye, FHT)[0]}" cy="${pt(foxEye, FHT)[1]}" r="2.5"/><circle cx="${pt(foxNose, FHT)[0]}" cy="${pt(foxNose, FHT)[1]}" r="2.4"/>` +
    `<circle cx="${pt(gEye, GHT)[0]}" cy="${pt(gEye, GHT)[1]}" r="2.1"/>`,
  glints: `<circle cx="${f(pt(foxEye, FHT)[0] - 0.7)}" cy="${f(pt(foxEye, FHT)[1] - 0.9)}" r="0.7"/>`,
};
