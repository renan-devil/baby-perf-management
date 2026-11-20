import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, dot, f, place, peter, sparrow } from './characters.mjs';

// The Tale of Peter Rabbit, 3: Peter, caught in the gooseberry net by the big brass buttons of his
// jacket, sits and cries big tears, while three friendly sparrows flutter round him: "Wriggle!"
const ground = 'M0 258C90 255 190 260 280 257C330 256 370 258 400 257';

// The gooseberry bush on the left, with striped green berries
const bush = 'M8 258C-4 230 0 196 18 182C10 156 30 130 56 134C66 108 104 106 116 130C140 126 156 150 146 172C162 188 158 226 140 258';
const stems = 'M60 258C62 230 58 210 66 190M92 258C90 232 96 214 88 196M66 214C56 206 46 206 38 210';
const BERRIES = [
  [40, 168],
  [74, 152],
  [104, 140],
  [128, 176],
  [30, 214],
  [116, 214],
  [84, 186],
];
const berries = BERRIES.map(([x, y]) => dot(x, y, 4.5)).join('');
const stripes = BERRIES.map(([x, y]) => `M${x} ${y - 4}q-2 4 0 8`).join('');

// The net: diamond meshes draped from the top of the bush over Peter's jacket to the ground.
// (u, v) in the unit square map onto a sagging four-cornered patch.
const C = { tl: [104, 118], tr: [300, 178], bl: [118, 258], br: [318, 258] };
function netAt(u, v) {
  const x = (1 - v) * ((1 - u) * C.tl[0] + u * C.tr[0]) + v * ((1 - u) * C.bl[0] + u * C.br[0]);
  const y = (1 - v) * ((1 - u) * C.tl[1] + u * C.tr[1]) + v * ((1 - u) * C.bl[1] + u * C.br[1]);
  const sag = Math.sin(Math.PI * u) * Math.sin(Math.PI * v);
  return [x + sag * 6, y + sag * 14];
}
function strand(u0, v0, u1, v1) {
  let d = '';
  for (let i = 0; i <= 8; i++) {
    const [x, y] = netAt(u0 + ((u1 - u0) * i) / 8, v0 + ((v1 - v0) * i) / 8);
    d += `${i ? 'L' : 'M'}${f(x)} ${f(y)}`;
  }
  return d;
}
let mesh = '';
const N = 6;
for (let k = 1; k < 2 * N; k++) {
  const c = k / N; // lines u + v = c and u - v = c - 1
  mesh += strand(Math.max(0, c - 1), Math.min(1, c), Math.min(1, c), Math.max(0, c - 1));
  const e = c - 1;
  mesh += strand(Math.max(0, e), Math.max(0, -e), Math.min(1, 1 + e), Math.min(1, 1 - e));
}
const netEdge = strand(0, 0, 1, 0) + strand(1, 0, 1, 1);
const netWash = `${strand(0, 0, 1, 0)}${strand(1, 0, 1, 1).replace('M', 'L')}${strand(1, 1, 0, 1).replace('M', 'L')}Z`;

export default compose({
  title: 'Peter is caught in the gooseberry net',
  seed: 83,
  washes: [
    { c: PAL.green, o: 0.34, d: 'M0 254C90 251 190 256 280 253C330 252 370 254 400 253L400 300L0 300Z' },
    { c: PAL.green, o: 0.7, d: `${bush}Z` },
    { c: PAL.green, o: 0.5, d: berries },
    { c: PAL.ochre, o: 0.3, d: berries },
    { c: PAL.grey, o: 0.18, d: netWash },
  ],
  lines: [ground, bush, netEdge],
  fine: [
    stems,
    berries,
    stripes,
    hatch(16, 276, 384, 278, 12, 7, 165, 5),
    tufts([[176, 258], [330, 257], [372, 257]], 9, 4),
  ],
  parts: [
    place(peter({ pose: 'sit', mood: 'cry', buttonR: 3.4 }), 'translate(228 196) scale(1.8)'),
    { fine: [mesh] },
    place(sparrow(), 'translate(150 66) rotate(-8) scale(1.2)'),
    place(sparrow(), 'translate(340 92) scale(-1.25 1.25) rotate(-10)'),
    place(sparrow(), 'translate(354 176) scale(-1.15 1.15) rotate(8)'),
  ],
});
