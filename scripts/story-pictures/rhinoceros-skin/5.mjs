import { PAL, hatch, paths, rng, tufts } from '../lib.mjs';
import { f, palm, rhino, ring } from './1.mjs';

// How the Rhinoceros Got His Skin, 5: itchy, scratchy! The grumpy Rhinoceros rubs and rubs his
// bottom against the palm tree; his skin, full of crumbs, has gone baggy, with great folds over his
// shoulders, round his hips, under his tummy and down his legs. Crumbs fall out, and the three buttons
// he rubbed off lie on the sand.

const PT = 'translate(84 262) scale(1.1)';
const pa = palm(PT);
const RT = 'translate(196 262) rotate(-3) scale(1.38)';
const rh = rhino(RT, { skin: 'folded', look: [0.6, 0.8] });

// rubbing, scratching and a grumpy little cloud
const rub = 'M110 154c-6 9 -6 21 0 30M119 142c-7 12 -7 28 0 40';
// the palm shakes
const shake = 'M40 70l-8 -4M36 84l-9 0M150 64l8 -5M156 78l9 -1';
const brow = 'M50 -63L64 -55';
// itchy marks: little bursts of short strokes just off his back and tummy
const itch = 'M150 126l-5 -8M160 120l0 -10M170 122l5 -8M236 104l-4 -9M246 100l0 -10M256 102l4 -9M300 120l2 -9M310 124l7 -7M130 228l-8 4M128 218l-9 -1';
const huff = 'M332 196c4 -2 8 -2 12 0M334 206c5 0 9 2 12 4';
const grr = 'M318 150c-3 -4 2 -8 6 -6c2 -5 9 -4 10 1c5 0 6 6 2 8c-2 4 -10 4 -12 1c-4 1 -8 -1 -6 -4Z';

// crumbs tumbling out from under his tummy, and the buttons he rubbed off
const r = rng(57);
let crumbs = '';
for (let i = 0; i < 26; i++) {
  const x = 150 + r() * 110;
  const y = 246 + r() * 18;
  const s = 1.3 + r() * 1.5;
  crumbs += `M${f(x - s)} ${f(y)}l${f(s)} ${f(-s * 0.8)}l${f(s)} ${f(s * 0.9)}l${f(-s * 0.7)} ${f(s)}Z`;
}
const falling = 'M176 240l1 4M196 238l-1 4M226 240l1 4M246 236l0 4';
const buttons = ring(300, 270, 3.4) + ring(316, 274, 3.4) + ring(352, 268, 3.4);
const buttonHoles = 'M299 270l2 0M315 274l2 0M351 268l2 0';

const beach = 'M8 264C90 260 180 266 260 262C320 259 360 263 392 261';
const sea = 'M8 132C80 130 150 134 160 133M282 131C330 129 370 132 392 131';

export default {
  title: 'Itchy, scratchy!',
  seed: 75,
  washes: [
    { c: PAL.sky, o: 0.45, d: 'M8 132C80 130 150 134 230 131C300 128 360 132 392 130L392 186C300 190 120 182 8 188Z' },
    { c: PAL.ochre, o: 0.38, d: 'M8 186C120 180 300 188 392 184L394 290C300 294 140 286 8 292Z' },
    ...pa.washes,
    ...rh.washes,
    { c: PAL.grey, o: 0.4, d: grr },
    { c: PAL.ochre, o: 0.85, d: crumbs },
    { c: PAL.ochre, o: 0.9, d: buttons },
  ],
  whites: rh.whites,
  lines: pa.lines + rh.lines + paths([brow], RT) + paths([beach]),
  fine:
    pa.fine +
    rh.fine +
    paths([rub, shake, itch, huff, grr, falling, crumbs, buttons, buttonHoles, sea, tufts([[24, 264], [380, 261]], 8, 10), hatch(30, 280, 370, 278, 12, 6, 165, 12)]),
  fills: rh.fills,
};
