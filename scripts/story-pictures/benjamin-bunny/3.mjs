import { PAL, hatch } from '../lib.mjs';
import { compose, dot, place } from '../peter-rabbit/characters.mjs';
import { benjamin, peterHanky } from './characters.mjs';

// The Tale of Benjamin Bunny, 3: the two little rabbits come into the garden down the pear tree by the
// wall. Benjamin climbs down very neatly; Peter falls head first, bump, into the soft raked earth.
const ground = 'M0 262C90 259 190 264 290 261C340 260 370 262 400 261';

// The garden wall on the left, and the pear tree growing beside it, its branches leaning over the wall
const wall = 'M0 96L92 94L92 262';
const bricks = 'M0 118L92 117M0 142L92 141M0 166L92 165M0 190L92 190M0 214L92 214M0 238L92 238M30 96L30 118M64 95L64 117M16 117L16 141M48 117L48 141M80 117L80 141M30 141L30 165M64 141L64 165M16 165L16 190M48 165L48 190M80 165L80 190M30 190L30 214M64 190L64 214M16 214L16 238M48 214L48 238M80 214L80 238M30 238L30 262M64 238L64 262';
const trunk = 'M110 262C116 210 110 150 118 96C110 80 94 70 70 66M140 262C134 210 142 150 136 96C144 80 160 74 184 70M126 82L132 60';
const crown = 'M14 62C2 42 18 18 44 24C54 2 94 -4 112 14C128 -2 170 0 180 20C206 14 228 36 214 56C210 72 186 76 170 70C150 82 120 80 104 72C84 80 50 82 34 72C24 76 12 72 14 62Z';
const bark = 'M122 230l4 -12M126 170l-4 -14M120 124l4 -10';
const PEARS = [
  [46, 58],
  [86, 66],
  [150, 64],
  [194, 56],
  [118, 40],
];
const pear = (x, y) => `M${x} ${y - 14}C${x + 2} ${y - 8} ${x + 8} ${y - 6} ${x + 8} ${y + 1}C${x + 8} ${y + 7} ${x - 8} ${y + 7} ${x - 8} ${y + 1}C${x - 8} ${y - 6} ${x - 2} ${y - 8} ${x} ${y - 14}Z`;
const pears = PEARS.map(([x, y]) => pear(x, y)).join('');
const stalks = PEARS.map(([x, y]) => `M${x} ${y - 14}l1 -5`).join('');

// The soft, newly raked earth, with Peter's bump: a burst, and clods of earth flying
const rake = 'M150 274C200 272 250 274 300 272M170 288C230 286 300 288 380 286M220 268C280 266 340 268 390 266';
const bump = 'M256 252l-16 -4M254 236l-14 -10M362 250l16 -4M360 234l14 -10';
// and the way he came: a dotted arc from the branches down to the bump
const fall = 'M196 74C250 66 290 92 300 128';
const clods = [dot(266, 236, 3), dot(352, 230, 3.5), dot(276, 216, 2.5), dot(340, 212, 2.5)].join('');
const mound = 'M262 262C272 250 292 246 304 250C318 246 340 252 348 262';

export default compose({
  title: 'Benjamin climbs neatly down the pear tree, and Peter falls head first',
  seed: 93,
  washes: [
    { c: PAL.terracotta, o: 0.5, d: 'M0 96L92 94L92 262L0 262Z' },
    { c: PAL.terracotta, o: 0.45, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.4, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.5, d: mound + 'Z' + clods },
    { c: PAL.terracotta, o: 0.45, d: 'M110 262C116 210 110 150 118 96C110 80 94 70 70 66L184 70C160 74 144 80 136 96C142 150 134 210 140 262Z' },
    { c: PAL.green, o: 0.7, d: crown + pears, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.85, d: pears },
    { c: PAL.green, o: 0.25, d: pears },
  ],
  lines: [ground, wall, trunk, crown, mound, bump],
  fine: [bricks, bark, pears, stalks, rake, clods, hatch(10, 280, 140, 282, 4, 6, 165, 2)],
  once: `<path d="${fall}" stroke-dasharray="2 7"/>`,
  parts: [
    place(benjamin({ pose: 'climb', mood: 'happy' }), 'translate(172 194) scale(-1.45 1.45)'),
    place(peterHanky({ pose: 'tumble', mood: 'scared' }), 'translate(306 190) rotate(172) scale(1.55)'),
  ],
});
