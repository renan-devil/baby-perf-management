import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { W_LEGS, axe, compose, ground, place, tree, woodcutter } from './1.mjs';

// The Three Wishes, 2: the woodcutter runs all the way home through the forest, waving his arms
// (his axe in one hand), shouting "Fanchon! We have three wishes!" His little cottage is just ahead.
const W = 'translate(160 252) scale(1.05)';
const arms = [
  [[-16, -84, 9], [-34, -94, 8], [-40, -118, 7]],
  [[16, -84, 9], [33, -92, 8], [42, -114, 7]],
];
// axe held up in his right hand (in his own coordinates)
const AX = 'translate(42 -104) rotate(24)';

// the cottage ahead
const walls = 'M300 251L300 200M372 250L372 200';
const roof = 'M290 204C304 190 318 174 336 160C352 174 368 190 382 204C356 200 316 200 290 204Z';
const door = 'M326 251L326 226C326 216 344 216 344 226L344 251';
const win = 'M352 214L366 214L366 228L352 228ZM359 214L359 228M352 221L366 221';
const chimney = 'M352 176L352 156L364 156L364 188';
const smoke = 'M358 150C352 142 362 136 356 128C350 120 360 114 356 106M364 118c4 -3 8 -1 9 2';

export default compose({
  title: 'The woodcutter runs home',
  seed: 72,
  washes: [
    { c: PAL.green, o: 0.36, d: `${ground}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.3, d: 'M326 250C300 260 262 266 200 270C150 274 108 280 50 300L90 300C140 288 170 282 210 280C270 274 310 264 344 250Z' },
    { c: PAL.ochre, o: 0.75, d: roof },
    { c: PAL.terracotta, o: 0.4, d: 'M300 200L372 200L372 250L300 250Z' },
    { c: PAL.terracotta, o: 0.75, d: `${door}Z` },
    { c: PAL.sky, o: 0.6, d: 'M352 214L366 214L366 228L352 228Z' },
    { c: PAL.grey, o: 0.6, d: 'M352 176L352 156L364 156L364 186Z' },
  ],
  lines: [ground, walls, roof, door, chimney],
  fine: [
    win,
    smoke,
    'M300 190l8 -6M314 180l8 -7M346 178l10 6M358 186l12 8', // thatch
    'M306 214l10 0M310 236l12 0M350 240l10 0', // stones
    hatch(10, 272, 110, 272, 8, 6, 160, 6),
    hatch(240, 280, 390, 272, 9, 6, 160, 7),
    tufts([[110, 252], [232, 252], [286, 252], [392, 250]], 9, 9),
    // speed lines and dust behind him
    'M76 180l30 2M82 196l26 0M72 212l28 -1',
    'M108 252C102 252 100 246 105 244C104 239 111 237 114 241C117 237 124 239 123 245C127 246 126 252 121 252M94 250C90 250 90 245 94 245C95 241 100 242 100 246',
    // excitement marks round his head
    rays(162, 118, 34, 44, 7, 3, -150).split('M').slice(0, 5).join('M'),
  ],
  parts: [
    place(tree(), 'translate(-26 0)'),
    place(tree(), 'translate(270 252) scale(0.52) translate(-44 -252)'),
    place(woodcutter({ mood: 'laugh', arms, legs: W_LEGS.run, tilt: 8 }), W),
    place(place(axe(), AX), `${W} rotate(8)`),
  ],
});
