import { PAL, hatch, rng, tufts } from '../lib.mjs';
import { bumpy } from '../puss-in-boots/characters.mjs';
import { cat, compose, f, oval, place } from './characters.mjs';

// The Cat that Walked by Himself, 1 (cover): the Cat walks all alone through the Wet Wild Woods, his
// tail held high, between dark dripping trees, under a thin moon, with puddles at his feet.
const ground = 'M0 250C80 247 160 252 240 249C310 247 360 250 400 248';

// Dark wet trees: a trunk with two branches and a bumpy crown of leaves.
function tree(x, y, h, w, seed) {
  const t = w * 0.24; // half the trunk's width at the top
  const left = `M${x - w / 2 - 6} ${y}C${x - w / 2 + 2} ${y - 6} ${x - t - 2} ${y - h * 0.4} ${x - t} ${y - h}`;
  const right = `M${x + w / 2 + 6} ${y}C${x + w / 2 - 2} ${y - 6} ${x + t + 2} ${y - h * 0.4} ${x + t} ${y - h}`;
  const trunk = left + right;
  const trunkWash = `${left}L${x + t} ${y - h}C${x + t + 2} ${y - h * 0.4} ${x + w / 2 - 2} ${y - 6} ${x + w / 2 + 6} ${y}Z`;
  const branches = `M${x - t} ${y - h * 0.72}C${x - 16} ${y - h * 0.8} ${x - 26} ${y - h * 0.86} ${x - 36} ${y - h * 0.98}M${x + t} ${y - h * 0.8}C${x + 14} ${y - h * 0.86} ${x + 22} ${y - h * 0.92} ${x + 30} ${y - h * 1.04}`;
  const crown = bumpy(x - 6, y - h - 18, w * 2.2, h * 0.36, 10, 1.2, -80 + seed * 11) + bumpy(x + w * 0.9, y - h - 2, w * 1.3, h * 0.24, 7, 1.22, -60 + seed * 7);
  const bark = hatch(x - w / 4, y - 8, x - 2, y - h * 0.6, 5, 12, 95, seed) + hatch(x + w / 5, y - 20, x + 2, y - h * 0.7, 3, 10, 85, seed + 4);
  return { trunk, trunkWash, branches, crown, bark };
}
const T = [tree(44, 252, 120, 34, 1), tree(356, 250, 106, 30, 2)];

// Puddles with rings where the drops fall
const puddles = [oval(108, 262, 34, 6), oval(300, 266, 40, 7)];
const rings = 'M98 262c4 -2 10 -2 14 0M292 266c5 -2 12 -2 16 0M314 264c3 -1.5 6 -1.5 8 0';

// Rain: thin slanting strokes, scattered over the sky
const r = rng(17);
let rain = '';
for (let i = 0; i < 38; i++) {
  const x = 10 + r() * 380;
  const y = 10 + r() * 200;
  const nearCat = x > 130 && x < 270 && y > 60;
  if (!nearCat) rain += `M${f(x)} ${f(y)}l-3 9`;
}

// A thin moon peeping between the trees
const moon = 'M206 20C192 22 184 36 190 50C196 62 212 64 222 56C210 56 200 48 200 36C200 30 202 24 206 20Z';

export default compose({
  title: 'The Cat walks all alone through the Wet Wild Woods',
  seed: 301,
  washes: [
    { c: PAL.green, o: 0.3, d: 'M0 246C80 243 160 248 240 245C310 243 360 246 400 244L400 300L0 300Z' },
    { c: PAL.slate, o: 0.18, d: 'M0 246C80 243 160 248 240 245C310 243 360 246 400 244L400 300L0 300Z' },
    ...T.flatMap((t) => [
      { c: PAL.slate, o: 0.65, d: t.trunkWash },
      { c: PAL.green, o: 0.62, d: t.crown },
      { c: PAL.slate, o: 0.45, d: t.crown },
    ]),
    { c: PAL.sky, o: 0.55, d: puddles.join('') },
    { c: PAL.ochre, o: 0.9, d: moon },
  ],
  lines: [ground, ...T.flatMap((t) => [t.trunk, t.crown])],
  fine: [
    ...T.flatMap((t) => [t.branches, t.bark]),
    ...puddles,
    rings,
    hatch(14, 274, 388, 276, 12, 7, 165, 4),
    tufts([[16, 250], [160, 250], [236, 249], [390, 248]], 9, 6),
  ],
  once: `<path d="${rain}" stroke-width="1.1" opacity="0.6"/>`,
  parts: [place(cat({ pose: 'walk' }), 'translate(196 248) scale(1.95)')],
});
