import { PAL, hatch, rng, transformPath, tufts } from '../lib.mjs';
import { compose, pig, place, wolf } from './characters.mjs';

// The Three Little Pigs, 3: the Big Bad Wolf huffs and puffs, and the straw house flies apart. Its
// roof sails away, straw flies everywhere, and the first little pig runs off as fast as he can.
const f = (n) => Math.round(n * 10) / 10;
const ground = 'M0 258C100 254 200 260 300 256C350 254 380 257 400 255';

// What is left of the straw house: a low, messy heap of straw with stalks sticking out every way
const heap = 'M218 258C220 246 232 238 246 240C254 230 272 230 280 238C292 236 304 244 306 258';
const heapStraw = 'M226 246l-8 -10M238 240l-4 -14M250 236l2 -14M262 232l6 -12M274 236l10 -10M288 240l12 -6M296 248l12 -2' + hatch(228, 250, 300, 250, 10, 12, 100, 3, 0.5);
// The roof, sailing away up and to the right
const RT = 'translate(300 86) rotate(24)';
const roof = 'M-44 22L-2 -26L44 22C20 28 -20 28 -44 22Z';
const roofStraw = 'M-30 18L-8 -12M-16 22L0 -16M0 24L6 -18M14 22L12 -12M28 20L16 -8M-36 14l4 -2M36 14l-6 -4';
const roofBand = 'M-40 16C-14 22 14 22 40 16';
// Loose straws flying in the wind: little ochre stalks, each a thin wash with an ink line
const r = rng(17);
let straws = '';
let strawFill = '';
for (let i = 0; i < 70 && straws.split('M').length < 34; i++) {
  const x = 186 + r() * 180;
  const y = 40 + r() * 196;
  if (x > 316 && y > 150) continue; // keep clear of the running pig
  if (x > 244 && x < 356 && y > 44 && y < 134) continue; // and of the roof
  if (x < 250 && y > 104 && y < 186) continue; // and of the gusts
  const a = (-40 + r() * 80) * (Math.PI / 180);
  const l = 12 + r() * 10;
  const [dx, dy] = [Math.cos(a) * l, Math.sin(a) * l];
  const [nx, ny] = [-Math.sin(a) * 1.6, Math.cos(a) * 1.6];
  straws += `M${f(x)} ${f(y)}l${f(dx)} ${f(dy)}`;
  strawFill += `M${f(x - nx)} ${f(y - ny)}l${f(dx)} ${f(dy)}l${f(2 * nx)} ${f(2 * ny)}l${f(-dx)} ${f(-dy)}Z`;
}
// HUFF and PUFF: gusts of wind from the wolf's mouth
const wind =
  'M174 130C196 122 214 134 238 126C250 122 256 130 251 136C246 140 239 135 244 130' +
  'M176 144C200 146 218 154 246 150' +
  'M174 116C190 104 208 106 226 98C234 95 240 100 235 106' +
  'M178 158C194 164 208 170 228 168';

export default compose({
  title: 'Huff and puff',
  seed: 43,
  washes: [
    { c: PAL.green, o: 0.4, d: 'M0 254C100 250 200 256 300 252C350 250 380 253 400 251L400 296C300 300 100 298 0 296Z' },
    { c: PAL.ochre, o: 0.75, d: `${heap}Z` },
    { c: PAL.ochre, o: 0.9, d: strawFill },
    { c: PAL.ochre, o: 0.75, d: transformPath(roof, RT) },
    { c: PAL.terracotta, o: 0.6, d: transformPath('M-40 16C-14 22 14 22 40 16L42 22C20 28 -20 28 -42 22Z', RT) },
  ],
  lines: [ground, heap, wind, transformPath(roof, RT)],
  fine: [
    heapStraw,
    transformPath(roofStraw + roofBand, RT),
    straws,
    'M326 222l-14 -2M322 234l-16 0M328 246l-12 2',
    hatch(20, 274, 380, 276, 11, 8, 170, 8),
    tufts([[14, 257], [196, 258], [392, 255]], 9, 7),
  ],
  parts: [
    place(wolf({ pose: 'puff' }), 'translate(86 258) scale(1.1)'),
    place(pig({ scarf: PAL.green, arms: ['up', 'up'], legs: 'run', mouth: 'open' }), 'translate(358 256) rotate(8) scale(1.05)'),
  ],
});
