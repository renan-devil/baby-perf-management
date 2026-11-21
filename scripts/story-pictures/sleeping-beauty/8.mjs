import { PAL, rng } from '../lib.mjs';
import { compose, place, rose, thorns, tower } from './characters.mjs';

// Picture 8: a great hedge of brambles and thorny roses grows all round the sleeping castle, until
// only the tops of the towers peep out.
const f = (n) => Math.round(n * 10) / 10;

// The bumpy top of the hedge: scallops from left to right (x, y of each bump's end).
const tops = [[-6, 176], [30, 160], [62, 168], [96, 150], [128, 160], [158, 146], [186, 154], [218, 142], [248, 152], [278, 144], [310, 158], [340, 150], [372, 164], [406, 156]];
let hedgeTop = `M${tops[0][0]} ${tops[0][1]}`;
for (let i = 1; i < tops.length; i++) {
  const [x0, y0] = tops[i - 1];
  const [x1, y1] = tops[i];
  hedgeTop += `C${f(x0 + 4)} ${f(y0 - 18)} ${f(x1 - 4)} ${f(y1 - 18)} ${x1} ${y1}`;
}
const hedge = `${hedgeTop}L406 276C300 280 100 280 -6 276Z`;

// Bramble stems curling through the hedge, with thorns
const stems =
  'M4 250C40 220 70 236 96 206C118 182 150 196 170 176M392 246C360 222 330 240 300 212C280 192 250 204 232 180M120 268C150 238 190 250 210 220C226 198 252 222 270 196M20 200C34 186 54 192 64 178M346 194C360 184 378 190 390 180';
const r = rng(8);
const thornPts = [];
for (const [x, y] of [[30, 236], [62, 232], [90, 212], [130, 192], [156, 186], [370, 232], [334, 232], [296, 208], [262, 196], [150, 246], [186, 246], [214, 216], [246, 214], [40, 192], [372, 188]]) {
  thornPts.push([x, y, -90 + (r() - 0.5) * 80]);
}
const curls = 'M168 176c6 -6 14 0 8 6M234 180c-6 -6 -14 0 -8 6M270 196c4 -8 14 -4 8 4';

const blooms = [
  [44, 214, 9, PAL.rose], [112, 236, 10, PAL.red], [176, 206, 9, PAL.rose], [236, 238, 10, PAL.rose], [300, 228, 9, PAL.red],
  [352, 206, 9, PAL.rose], [80, 178, 8, PAL.red], [204, 172, 8, PAL.red], [318, 176, 8, PAL.rose], [140, 170, 7, PAL.rose],
  [24, 256, 8, PAL.rose], [380, 258, 8, PAL.rose], [266, 256, 7, PAL.red], [160, 258, 7, PAL.rose],
];

// the roses are cut out of the green, so they stay bright
const holes = blooms.map(([x, y, sz]) => rose(x, y, sz).washes[0].d).join('');

export default compose({
  title: 'The Great Hedge of Roses',
  seed: 2808,
  washes: [
    { c: PAL.green, o: 0.8, d: hedge + holes, rule: 'evenodd' },
    { c: PAL.green, o: 0.35, d: `M20 230C60 200 120 214 160 190C200 176 240 196 280 186C330 176 370 200 396 196L396 270C300 274 100 274 4 270Z${holes}`, rule: 'evenodd' },
  ],
  lines: [hedgeTop, stems],
  fine: [thorns(thornPts, 6), curls],
  parts: [
    place(tower({ w: 58, h: 30, window: true }), 'translate(214 150)'),
    place(tower({ w: 40, h: 16, window: false }), 'translate(112 158)'),
    place(tower({ w: 42, h: 18, window: false }), 'translate(312 156)'),
    ...blooms.map(([x, y, s, c]) => rose(x, y, s, c)),
  ],
});
