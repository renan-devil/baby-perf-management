import { PAL, tufts } from '../lib.mjs';
import { at, boy, compose, elephant, place, ripples } from './characters.mjs';

// Cao Chong Weighs the Elephant, 2: the elephant stands in a wooden boat on the river, which has sunk
// lower in the water; from the bank, little Cao Chong points at the red mark he drew on the boat's
// side, right where the water comes up to.
const W = 232; // the waterline on the boat

// the boat: a flat wooden boat with turned-up ends, seen from the side
const hullTop = 'M104 178C118 192 140 198 166 198L330 198C356 198 378 190 394 176';
const hull = `${hullTop}C390 200 378 230 352 246L156 246C128 236 112 206 104 178`;
const rail = 'M110 190C126 200 146 204 166 204L330 204C354 204 374 198 390 188';
const planks = 'M126 220C140 226 150 228 166 228L330 228C350 228 368 222 380 214M148 240L340 240';
const water = `M6 ${W}C40 ${W - 3} 70 ${W + 3} 104 ${W}`;
const waterOnBoat = `M118 ${W}C200 ${W - 2} 300 ${W + 2} 372 ${W}C380 ${W - 2} 390 ${W + 1} 396 ${W}`;
const mark = `M140 ${W - 11}L188 ${W - 12}L188 ${W - 2}L140 ${W - 1}Z`;

// the bank on the left where Cao Chong stands
const bank = 'M4 210C30 206 60 208 92 214C100 220 104 226 108 234';
const B = 'translate(52 212) scale(1.18)';

const pointing = [
  [[-10, -53, 8], [-15, -42, 7.5], [-17, -32, 7.5]],
  [[10, -53, 8], [22, -47, 7.5], [34, -41, 7]],
];
const [hx, hy] = at(34, -41, B);
// a dotted line from his finger to the mark, so the eye follows where he points
const guide = `M${hx + 6} ${hy + 3}Q${hx + 40} ${hy + 10} 138 ${W - 8}`;

export default compose({
  title: 'The elephant in the boat',
  seed: 72,
  washes: [
    { c: PAL.sky, o: 0.45, d: 'M4 196C100 190 250 194 396 186L396 300L4 300Z' },
    { c: PAL.sky, o: 0.6, d: `M4 ${W}C100 ${W - 4} 250 ${W + 4} 396 ${W}L396 300L4 300Z` },
    { c: PAL.green, o: 0.6, d: 'M4 210C30 206 60 208 92 214C100 220 104 226 108 234C80 240 40 238 4 242Z' },
    { c: PAL.ochre, o: 0.4, d: 'M4 222C40 220 80 226 104 232C80 238 40 238 4 240Z' },
    { c: PAL.terracotta, o: 0.7, d: `${hull}Z${mark}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.55, d: `${hull}Z${mark}`, rule: 'evenodd' },
    { c: PAL.terracotta, o: 0.4, d: 'M110 190C126 200 146 204 166 204L330 204C354 204 374 198 390 188L394 176C378 190 356 198 330 198L166 198C140 198 118 192 104 178Z' },
    
  ],
  lines: [hull, water, waterOnBoat, bank],
  fine: [
    rail,
    planks,
    ripples([[30, 252, 22], [80, 270, 20], [140, 262, 22], [220, 282, 24], [300, 262, 20], [360, 276, 22], [20, 288, 16], [170, 290, 18], [270, 294, 16], [380, 250, 12]]),
    ripples([[110, 196, 14], [36, 196, 16]]),
    tufts([[16, 209], [84, 212]], 8, 8),
    // splashes by the boat's ends: it has just sunk lower
    'M100 224l-8 -8M98 230l-10 -2M384 214l6 -8',
  ],
  after: [{ c: PAL.red, o: 1, d: mark }],
  once: `<path d="${guide}" stroke-dasharray="0.1 6" stroke-width="2.4"/>`,
  parts: [
    // the elephant standing in the boat, its feet on the boat's edge
    place(elephant({ look: [-1.6, 1.2] }), 'translate(258 199)'),
    { fine: [mark] },
    place(boy({ look: 1, lookY: 1, mood: 'bright', arms: pointing }), B),
  ],
});
