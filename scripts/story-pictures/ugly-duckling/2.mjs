import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { compose, duckling, motherDuck, place } from './characters.mjs';

// The Ugly Duckling, 2: the biggest egg has hatched in the reed nest. The big grey duckling sits
// among the pieces of shell, and the mother duck stares at him in surprise.
const ground = 'M0 224C90 220 200 226 300 222C340 221 370 223 400 221';
const nest = 'M44 204C40 184 236 182 240 202C244 226 206 240 142 240C80 240 48 226 44 204Z';
const nestRim = 'M50 200C80 210 200 212 234 198';
const straw = 'M56 218l14 4M78 228l16 2M110 234l16 0M150 234l18 -1M186 230l16 -3M214 222l14 -5M64 208l-8 -6M228 208l8 -6M46 206l-10 2M240 204l10 -2';
// half egg shells with zigzag edges (cup at 0,0, open side up)
const shell = 'M-14 -2C-14 12 14 12 14 -2L10 -6L6 -1L2 -7L-2 -1L-6 -6L-10 -1Z';
const shells = [
  transformPath(shell, 'translate(50 194) rotate(-24) scale(1.25)'),
  transformPath(shell, 'translate(226 192) rotate(20) scale(1.2)'),
  transformPath(shell, 'translate(252 230) rotate(-30) scale(0.8)'),
];
const bits = 'M96 194l6 -3l3 4ZM196 190l5 2l-3 4ZM270 222l5 -1l0 5Z';
const reeds = 'M14 216C12 178 16 138 26 100M30 218C30 192 36 164 46 140M380 220C382 188 378 154 370 124M392 221C394 198 398 178 400 170';
const reedHeads = 'M25 104C21 90 25 78 30 76C34 80 32 94 26 104ZM45 144C42 132 45 122 50 121C53 125 51 136 45 144ZM371 128C367 114 371 102 376 101C380 105 378 118 371 128Z';
const surprise = 'M262 84l-6 -12M280 78l0 -14M298 82l7 -11';

export default compose({
  title: 'A big grey duckling hatches',
  seed: 72,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 220C90 216 200 222 300 218C340 217 370 219 400 217L400 290C300 294 100 292 0 290Z' },
    { c: PAL.green, o: 0.6, d: `${reeds}${reedHeads}` },
    { c: PAL.ochre, o: 0.6, d: nest },
    { c: PAL.terracotta, o: 0.3, d: 'M50 206C80 216 200 218 234 204C230 224 200 234 142 234C84 234 56 224 50 206Z' },
    { c: PAL.sky, o: 0.35, d: shells.join('') + bits },
  ],
  lines: [ground, nest, ...shells, reeds],
  fine: [
    nestRim,
    straw,
    bits,
    reedHeads,
    surprise,
    hatch(70, 218, 210, 224, 10, 9, 20, 3),
    hatch(20, 252, 380, 254, 10, 8, 170, 6),
    tufts([[262, 224], [300, 222], [356, 222], [12, 224]], 10, 4),
  ],
  parts: [place(duckling(), 'translate(140 205) scale(1.75)'), place(motherDuck({ surprised: true }), 'translate(312 216) scale(-1.55 1.55)')],
});
