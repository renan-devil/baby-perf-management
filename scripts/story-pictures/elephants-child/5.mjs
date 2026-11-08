import { PAL, hatch, paths, transformPath, tufts } from '../lib.mjs';
import { elephant, f, limb } from './1.mjs';

// The Elephant's Child, 5: back home, the little elephant, now with a long trunk, sprays water over
// his big, laughing mother (who still has a short bulgy nose). Splash! Splash!
const ET = 'translate(78 258)';
const pt = (x, y, t = ET) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);

// his new long trunk, lifted high and curling forward (his own coordinates)
const trunkPts = [[62, -68.5, 17], [80, -70, 13], [92, -82, 11], [95, -100, 10], [92, -116, 9.5], [98, -129, 9], [110, -133, 9]];
const trunk = limb(trunkPts);
const trunkRings = 'M84 -77l7 -5M90 -92l9 0M88 -108l9 1';
const nostril = 'M114 -136C116 -137 117 -132 115 -130';
const little = elephant(ET, { nose: [trunk], noseWash: trunk + 'Z', look: [1.2, -1] });

// his big mother, facing him and laughing, eyes screwed up with joy
const MT = 'translate(318 258) scale(-1.2 1.2)';
const laugh = 'M50 -63C52 -54 61 -52 64 -59Z';
const mother = elephant(MT, { eye: 'happy', skip: ['smile'], extraLines: [laugh] });
const laughMarks = 'M318 122l6 -6M326 134l8 -2M206 186l-8 2M208 198l-7 5';

// the water: three streams from the tip of his trunk, arching over onto her head, and drops
const [tx, ty] = pt(116, -133);
const streams = [
  `M${f(tx)} ${f(ty)}C${f(tx + 26)} ${f(ty - 54)} ${f(tx + 70)} ${f(ty - 60)} 284 118`,
  `M${f(tx + 2)} ${f(ty + 4)}C${f(tx + 26)} ${f(ty - 40)} ${f(tx + 62)} ${f(ty - 44)} 270 132`,
  `M${f(tx)} ${f(ty - 4)}C${f(tx + 28)} ${f(ty - 70)} ${f(tx + 82)} ${f(ty - 74)} 300 116`,
];
const streamWash = `M${f(tx)} ${f(ty - 6)}C${f(tx + 28)} ${f(ty - 74)} ${f(tx + 84)} ${f(ty - 78)} 304 116L266 134C${f(tx + 58)} ${f(ty - 38)} ${f(tx + 26)} ${f(ty - 34)} ${f(tx + 3)} ${f(ty + 6)}Z`;
const drop = (x, y, s = 1) => `M${x} ${y}C${x - 3 * s} ${y + 5 * s} ${x - 2 * s} ${y + 8 * s} ${x} ${y + 8 * s}C${x + 2 * s} ${y + 8 * s} ${x + 3 * s} ${y + 5 * s} ${x} ${y}Z`;
const drops = [drop(236, 120), drop(298, 116, 1.2), drop(314, 128), drop(224, 136, 0.9), drop(278, 98, 0.9)].join('');
const splash = 'M274 120l-6 -6M286 112l0 -9M300 108l6 -6';
const puddle = 'M244 264C250 268 280 270 306 267';

const ground = 'M10 262C90 258 180 264 260 260C320 257 360 261 392 259';

export default {
  title: 'Splash! The little elephant and his new trunk',
  seed: 65,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M8 258C90 254 180 260 260 256C320 253 360 257 394 255L394 278C330 284 240 274 160 280C90 284 40 276 8 278Z' },
    ...mother.washes,
    ...little.washes,
    { c: PAL.rose, o: 0.75, t: MT, d: laugh },
    { c: PAL.sky, o: 0.55, d: streamWash },
    { c: PAL.sky, o: 0.75, d: drops },
    { c: PAL.sky, o: 0.5, d: 'M234 262C244 256 290 254 318 260C308 270 258 272 234 262Z' },
  ],
  whites: little.whites,
  lines: mother.lines + little.lines + paths([ground]),
  fine:
    mother.fine +
    little.fine +
    paths([trunkRings, nostril], ET) +
    paths([...streams, drops, splash, laughMarks, puddle, tufts([[24, 262], [190, 262], [380, 259]], 9, 2), hatch(40, 274, 220, 274, 8, 6, 165, 9)]),
  fills: little.fills,
  glints: little.glints,
};
