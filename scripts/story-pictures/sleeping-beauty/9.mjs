import { PAL, hatch, rng } from '../lib.mjs';
import { R_ARMS, compose, place, prince, rose, thorns, tower } from './characters.mjs';

// Picture 9: a young prince walks up to the hedge, and the thorny branches open by themselves into
// a path of pink roses.
const f = (n) => Math.round(n * 10) / 10;

const tops = [[168, 268], [164, 200], [176, 160], [204, 142], [236, 130], [268, 136], [300, 126], [332, 134], [364, 128], [406, 140]];
let hedgeOut = `M${tops[0][0]} ${tops[0][1]}C150 240 150 214 ${tops[1][0]} ${tops[1][1]}`;
for (let i = 2; i < tops.length; i++) {
  const [x0, y0] = tops[i - 1];
  const [x1, y1] = tops[i];
  hedgeOut += `C${f(x0 + (i === 2 ? -8 : 4))} ${f(y0 - 18)} ${f(x1 - 4)} ${f(y1 - 18)} ${x1} ${y1}`;
}
// the opening: an arch the branches have drawn back from
const opening = 'M246 266C244 230 250 196 286 190C322 196 330 230 328 266';
const hedgeWash = `${hedgeOut}L406 268Z${opening}Z`;

// Branches drawn aside round the opening, with thorns
const stems = 'M246 262C232 236 234 204 256 184C264 176 276 172 286 172M328 262C342 236 340 204 318 184C310 176 300 172 286 172M190 250C204 226 196 196 214 176M380 250C366 226 376 196 360 172';
const r = rng(19);
const thornPts = [[236, 230, 200], [240, 206, 230], [258, 182, 250], [338, 228, -20], [336, 204, -50], [318, 182, -70], [200, 226, 190], [206, 196, 220], [372, 224, -10], [370, 196, -40]].map(
  ([x, y, a]) => [x, y, a + (r() - 0.5) * 20],
);

// The rose path from the prince's feet into the opening
const path = 'M108 284C150 280 200 274 250 266L326 266C300 276 250 284 200 292L108 292Z';
const petals = [
  [140, 284, 4], [176, 278, 3.5], [214, 276, 4], [190, 288, 3.5], [240, 270, 3.5], [262, 278, 3], [286, 270, 3], [306, 274, 3], [158, 290, 3.5], [228, 284, 3],
];
const edgeRoses = [
  [244, 250, 9, PAL.rose], [248, 220, 9, PAL.rose], [262, 192, 9, PAL.rose], [286, 178, 9, PAL.rose], [310, 192, 9, PAL.rose],
  [326, 220, 9, PAL.rose], [330, 250, 9, PAL.rose], [196, 214, 8, PAL.red], [372, 206, 8, PAL.red], [214, 166, 7, PAL.rose], [356, 160, 7, PAL.rose],
];
const holes = edgeRoses.map(([x, y, s]) => rose(x, y, s).washes[0].d).join('');

const groundLine = 'M12 268C60 266 120 266 160 268';

export default compose({
  title: 'The Prince and the Rose Path',
  seed: 2909,
  washes: [
    { c: PAL.green, o: 0.8, d: hedgeWash + holes, rule: 'evenodd' },
    { c: PAL.green, o: 0.3, d: 'M12 268C80 266 140 266 168 268L168 284C120 286 60 286 12 284Z' },
    { c: PAL.rose, o: 0.35, d: path },
    { c: PAL.ochre, o: 0.25, d: `${opening}Z` },
  ],
  lines: [hedgeOut, opening, groundLine, stems],
  fine: [
    thorns(thornPts, 6),
    hatch(20, 278, 120, 278, 4, 6, 160, 2),
    'M262 262L262 236C262 226 282 226 282 236L282 262Z',
    ...petals.map(([x, y, s]) => `M${x - s} ${y}q${s} ${-s * 1.4} ${2 * s} 0q${-s} ${s * 1.2} ${-2 * s} 0Z`),
  ],
  parts: [
    place(tower({ w: 46, h: 20, window: false }), 'translate(286 128)'),
    { washes: [{ c: PAL.rose, o: 0.95, d: petals.map(([x, y, s]) => `M${x - s} ${y}q${s} ${-s * 1.4} ${2 * s} 0q${-s} ${s * 1.2} ${-2 * s} 0Z`).join('') }, { c: PAL.terracotta, o: 0.45, d: 'M262 262L262 236C262 226 282 226 282 236L282 262Z' }] },
    ...edgeRoses.map(([x, y, s, c]) => rose(x, y, s, c)),
    place(prince({ legs: 'walk', arms: R_ARMS.walk, look: 1, mood: 'happy' }), 'translate(96 270) scale(1.3)'),
  ],
});
