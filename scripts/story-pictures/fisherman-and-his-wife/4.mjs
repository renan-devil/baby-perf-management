import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { I_ARMS, I_SIL_SIT, compose, dot, hen, ilsebill, place } from './characters.mjs';

// The Fisherman and His Wife, 4: the old hut is gone! In its place stands a pretty little cottage with
// a red roof, a garden full of flowers and an apple tree, and hens going cluck, cluck by the door.
// Ilsebill sits on a bench by the wall: "We'll see."
const ground = 'M0 264C90 262 200 266 300 263C340 262 370 264 400 263';
const I = 'translate(100 264) scale(0.98)';
const sil = transformPath(I_SIL_SIT, I);
const wall = 'M60 264L60 150L240 150L240 264';
const roof = 'M46 154L150 80L254 154Z';
const chimney = 'M196 112L196 84L214 84L214 125';
const door = 'M142 264L142 206C142 190 172 190 172 206L172 264';
const win = 'M192 178L228 178L228 214L192 214Z';
const bench = 'M62 236L72 236M128 236L138 236M64 236L64 264M136 236L136 264M60 232L140 232';
// The apple tree
const trunk = 'M324 264C328 236 326 210 330 186M344 264C338 238 340 210 338 186M324 264C332 268 340 268 344 264';
const crown = 'M290 170C272 154 280 120 306 116C312 92 346 84 362 102C384 96 400 120 390 140C402 156 388 184 364 182C350 196 322 194 312 186C298 192 282 184 290 170Z';
const apples = [[300, 140], [322, 120], [350, 116], [372, 138], [334, 160], [362, 166], [312, 172], [380, 160]].map(([x, y]) => dot(x, y, 4.4)).join('');
// Flowers along the front of the garden
const fl = [[16, 276], [36, 286], [54, 272], [152, 282], [176, 288], [200, 278], [226, 290], [252, 280], [300, 288], [356, 282], [384, 274], [374, 294], [186, 250], [204, 246], [222, 252], [238, 244], [24, 252], [42, 246]];
const stems = fl.map(([x, y]) => `M${x} ${y + 4}l0 ${y < 262 ? 14 : 9}M${x} ${y + 9}q4 -3 6 -1`).join('');
const blossoms = (k) => fl.filter((_, i) => i % 3 === k).map(([x, y]) => dot(x, y, 5.2)).join('');

export default compose({
  title: 'Ilsebill at the pretty cottage',
  seed: 64,
  washes: [
    { c: PAL.ochre, o: 0.35, d: `${wall}Z${sil}`, rule: 'evenodd' },
    { c: PAL.red, o: 0.78, d: roof },
    { c: PAL.terracotta, o: 0.55, d: `${chimney}Z` },
    { c: PAL.terracotta, o: 0.7, d: `${door}Z` },
    { c: PAL.sky, o: 0.5, d: win },
    { c: PAL.green, o: 0.32, d: `${ground}L400 300L0 300Z` },
    { c: PAL.green, o: 0.7, d: crown },
    { c: PAL.ochre, o: 0.6, d: 'M325 264C329 236 327 210 331 186L338 186C340 210 338 238 343 264Z' },
    { c: PAL.red, o: 0.85, d: apples + blossoms(0) },
    { c: PAL.rose, o: 0.85, d: blossoms(1) },
    { c: PAL.ochre, o: 0.9, d: blossoms(2) },
    { c: PAL.terracotta, o: 0.6, d: 'M60 232L140 232L140 236L60 236Z' },
  ],
  lines: [ground, wall, roof, chimney, door, win, trunk, crown, bench],
  fine: [
    'M210 178L210 214M192 196L228 196',
    'M182 178l0 36M238 178l0 36', // shutters
    dot(164, 234, 1.6),
    'M84 144l10 -6M116 122l10 -6M146 100l10 -6M130 144l10 -6M176 126l10 -6M214 146l10 -6', // roof tiles
    'M201 78c-5 -7 4 -11 -1 -18c-4 -6 4 -10 0 -16',
    apples,
    stems,
    hatch(304, 156, 376, 104, 6, 8, 125, 11),
    tufts([[110, 266], [140, 268], [280, 272], [340, 268]], 9, 5),
  ],
  parts: [
    place(ilsebill({ pose: 'sit', mood: 'proud', arms: I_ARMS.lap }), I),
    place(hen({ peck: true }), 'translate(252 270) scale(1.25)'),
    place(hen(), 'translate(306 270) scale(-1.25 1.25)'),
  ],
});
