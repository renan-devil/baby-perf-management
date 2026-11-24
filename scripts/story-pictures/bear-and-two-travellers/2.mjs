import { PAL, hatch, tufts } from '../lib.mjs';
import { SNIFF, bear, bundle, compose, oval, place, short, tall } from './characters.mjs';

// The Bear and the Two Travellers, 2: the short friend lies flat on the ground with his eyes shut,
// keeping very still, while the big brown bear sniffs at his ear; the tall friend hides up in the tree,
// hugging the trunk, his own bundle left hanging on the branch.
// The short friend lies on his back, head to the right: turned a quarter turn, then mirrored.
const SHORTT = 'translate(68 242) scale(-1 1) rotate(-90)';
const BEART = 'translate(306 272) scale(0.78)';
const TALLT = 'translate(79 202) scale(0.68)';

// the tree on the left, with one branch out to the right for the tall friend to sit on
const trunk = 'M30 262C34 220 32 170 36 110C38 90 36 70 40 56M58 262C54 220 58 190 58 150M58 262C48 266 38 266 30 262';
// (the branch's edges stop behind the tall friend's dangling legs)
const branch = 'M58 156C70 156 84 156 96 156M116 154C126 153 138 151 150 149M58 166C70 166 84 166 96 166M116 164C126 162 138 160 150 156M150 149C154 150 154 155 150 156';
const crown =
  'M6 110C-1 92 5 64 22 60C22 34 46 14 72 20C90 4 126 8 136 24C156 22 166 40 156 52C148 58 128 52 112 46C98 44 84 46 72 54C64 80 58 100 44 110C32 120 16 120 6 110Z';
const bark = 'M42 200c3 6 3 12 0 18M44 236c-3 5-3 10 0 14M120 158l6 0';
// a second tree behind the bear, its trunk ending at the bear's back
const trunkR = 'M352 124C354 146 350 162 352 174M376 120C372 146 376 172 374 188';
const crownR =
  'M318 112C306 96 316 70 338 68C344 46 372 40 384 54C398 52 404 70 396 84C402 98 392 116 376 114C366 124 348 122 340 116C330 122 322 120 318 112Z';
const ground = 'M0 250C60 248 140 250 220 248C300 246 360 247 400 248L400 300L0 300Z';

export default compose({
  title: 'The bear sniffs the short friend while the tall friend hides in the tree',
  seed: 2311,
  washes: [
    { c: PAL.green, o: 0.3, d: ground },
    { c: PAL.slate, o: 0.25, d: oval(140, 274, 74, 9) + oval(300, 272, 88, 9) },
    { c: PAL.ochre, o: 0.55, d: 'M32 262C36 220 34 170 38 110C40 90 38 70 42 56L52 60C54 100 56 130 56 150C56 190 52 220 56 262Z' },
    { c: PAL.ochre, o: 0.55, d: 'M58 156C80 156 120 154 150 149L150 156C122 163 84 166 58 166Z' },
    { c: PAL.green, o: 0.72, d: crown },
    { c: PAL.ochre, o: 0.5, d: 'M354 118C356 146 352 162 354 174L372 188C374 172 370 146 374 116Z' },
    { c: PAL.green, o: 0.7, d: crownR },
  ],
  lines: [trunk, branch, crown, trunkR, crownR],
  fine: [
    bark,
    'M30 86c6 -6 14 -6 18 0M70 44c6 -6 14 -6 18 0M110 30c6 -6 14 -6 18 0M340 90c6 -6 14 -6 18 0M368 74c6 -6 14 -6 18 0',
    place({ fine: [SNIFF] }, BEART).fine[0],
    hatch(10, 290, 390, 292, 8, 5, 160, 3),
    tufts([[14, 262], [74, 266], [210, 280], [392, 266], [200, 296]], 9, 5),
  ],
  parts: [
    place(bundle(120, 152, 146, 150, PAL.red, 0.75), 'translate(0 0)'),
    place(tall({ mood: 'scared', arms: 'hug', legs: 'sit' }), TALLT),
    place(short({ mood: 'shut', arms: 'still' }), SHORTT),
    place(bear(), BEART),
  ],
});
