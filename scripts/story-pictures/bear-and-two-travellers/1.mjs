import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { bundle, compose, place, short, tall } from './characters.mjs';

// The Bear and the Two Travellers, 1 (cover): two friends, a tall thin one and a short round one, walk
// side by side along a forest path, each with a bundle on a stick over his shoulder.
const TALLT = 'translate(164 272) scale(1.1)';
const SHORTT = 'translate(290 274) scale(1.1)';

const path = 'M0 236C80 232 170 238 250 234C310 231 360 230 400 232L400 290C330 286 250 292 170 292C100 292 40 290 0 292Z';
// the far edge of the path stops behind the friends, so it never runs across them
const pathEdges = 'M0 236C40 234 90 234 140 236M194 236C212 236 228 235 244 235M318 233C350 231 372 230 400 232M0 292C40 290 100 292 170 292C250 292 330 286 400 290';
// a tree at each side of the path, framing the friends (the left one a little smaller, LT)
const LT = 'translate(36 238) scale(0.8) translate(-39 -238)';
const trunkL = 'M26 238C30 200 28 150 34 110M52 238C46 200 50 150 48 110M26 238C34 242 46 242 52 238';
const crownL =
  'M8 110C-2 94 6 70 24 66C28 44 56 36 70 50C88 46 100 64 92 82C102 96 92 116 74 114C62 124 42 122 32 116C20 124 12 120 8 110Z';
const trunkR = 'M356 236C360 196 356 150 362 104M380 236C374 196 378 150 376 104M356 236C364 240 374 240 380 236';
const crownR =
  'M318 102C308 86 318 62 338 60C344 40 370 34 382 48C396 46 404 62 396 78C402 92 394 110 380 108C370 118 352 116 344 110C332 116 322 112 318 102Z';
// a little far-off tree behind, for the big forest
const farTrees = 'M98 214C88 196 96 176 110 176C124 176 130 196 120 214Z';
const farStems = 'M109 214L109 232';

export default compose({
  title: 'The Bear and the Two Travellers',
  seed: 2207,
  washes: [
    { c: PAL.green, o: 0.3, d: 'M0 232C80 228 170 234 250 230C310 227 360 226 400 228L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.45, d: path },
    { c: PAL.ochre, o: 0.55, d: transformPath('M28 238C32 200 30 150 34 110L48 110C48 150 46 200 50 238Z', LT) },
    { c: PAL.ochre, o: 0.55, d: 'M358 236C362 196 358 150 362 104L376 104C376 150 374 196 378 236Z' },
    { c: PAL.green, o: 0.7, d: transformPath(crownL, LT) },
    { c: PAL.green, o: 0.7, d: crownR },
    { c: PAL.green, o: 0.4, d: farTrees },
  ],
  lines: [pathEdges, transformPath(trunkL + crownL, LT), trunkR, crownR],
  fine: [
    transformPath('M38 196c3 6 3 12 0 18M42 150c-3 6-3 12 0 16M30 86c6 -6 14 -6 18 0M60 70c6 -6 14 -6 18 0', LT),
    'M366 190c3 6 3 12 0 18M370 140c-3 6-3 12 0 16',
    farTrees,
    farStems,
    'M340 80c6 -6 14 -6 18 0M366 66c6 -6 14 -6 18 0',
    hatch(20, 296, 380, 296, 8, 5, 160, 3),
    tufts([[16, 236], [84, 236], [212, 236], [336, 232], [394, 232], [120, 296], [300, 296]], 9, 5),
  ],
  parts: [
    place(bundle(20, -150, -56, -194, PAL.red), TALLT),
    place(tall(), TALLT),
    place(bundle(30, -80, -50, -92, PAL.ochre, 0.85), SHORTT),
    place(short(), SHORTT),
  ],
});
