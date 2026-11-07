import { PAL, hatch, paths, zed } from '../lib.mjs';

// Home: under the roots of the old apple tree, Country Mouse sleeps curled up in her soft moss bed,
// her straw hat on its peg. Through the little round window: stars, a crescent moon and an owl.

// Parts are copied from picture 1 and placed by mapping their path data through an affine map, so
// lines and washes move together and the ink keeps its weight.
const f1 = (n) => Math.round(n * 10) / 10;
const place = (ax, ay, x, y, s = 1, deg = 0, flip = false) => {
  const r = (deg * Math.PI) / 180;
  const k = flip ? -1 : 1;
  const [a, b, c, d] = [s * Math.cos(r) * k, s * Math.sin(r) * k, -s * Math.sin(r), s * Math.cos(r)];
  return [a, b, c, d, x - a * ax - c * ay, y - b * ax - d * ay];
};
function T(path, m) {
  const [a, b, c, d, e, f] = m;
  const P = (x, y) => `${f1(a * x + c * y + e)} ${f1(b * x + d * y + f)}`;
  const V = (x, y) => `${f1(a * x + c * y)} ${f1(b * x + d * y)}`;
  const tok = path.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g) ?? [];
  let out = '';
  let cmd = 'M';
  let [cx, cy, sx, sy] = [0, 0, 0, 0];
  for (let i = 0; i < tok.length; ) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
    let C = cmd.toUpperCase();
    const rel = cmd !== C;
    if (C === 'Z') {
      out += 'Z';
      [cx, cy] = [sx, sy];
      continue;
    }
    const k = { M: 2, L: 2, T: 2, Q: 4, S: 4, C: 6, H: 1, V: 1 }[C];
    let v = tok.slice(i, (i += k)).map(Number);
    if (C === 'H') [C, v] = ['L', rel ? [v[0], 0] : [v[0], cy]];
    if (C === 'V') [C, v] = ['L', rel ? [0, v[0]] : [cx, v[0]]];
    const pairs = [];
    for (let j = 0; j < v.length; j += 2) pairs.push(rel ? V(v[j], v[j + 1]) : P(v[j], v[j + 1]));
    out += (rel ? C.toLowerCase() : C) + pairs.join(' ');
    [cx, cy] = rel ? [cx + v.at(-2), cy + v.at(-1)] : [v.at(-2), v.at(-1)];
    if (C === 'M') [sx, sy, cmd] = [cx, cy, rel ? 'l' : 'L'];
  }
  return out;
}
const ell = (x, y, rx, ry = rx) => {
  const [kx, ky] = [rx * 0.552, ry * 0.552];
  const p = (...n) => n.map(f1).join(' ');
  return `M${p(x - rx, y)}C${p(x - rx, y - ky, x - kx, y - ry, x, y - ry)}C${p(x + kx, y - ry, x + rx, y - ky, x + rx, y)}C${p(x + rx, y + ky, x + kx, y + ry, x, y + ry)}C${p(x - kx, y + ry, x - rx, y + ky, x - rx, y)}Z`;
};
const all = (list, m) => list.map((d) => T(d, m));
const star = (x, y, r) =>
  `M${f1(x)} ${f1(y - r)}L${f1(x + r * 0.28)} ${f1(y - r * 0.28)}L${f1(x + r)} ${f1(y)}L${f1(x + r * 0.28)} ${f1(y + r * 0.28)}L${f1(x)} ${f1(y + r)}L${f1(x - r * 0.28)} ${f1(y + r * 0.28)}L${f1(x - r)} ${f1(y)}L${f1(x - r * 0.28)} ${f1(y - r * 0.28)}Z`;

// --- Country Mouse's head without her hat (picture 1 coordinates), fast asleep
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEarsBare = 'M104 124C92 120 86 102 94 95C102 89 112 100 110 122M120 123C118 106 125 93 134 95C143 99 139 116 128 125';
const cFur = cHead + 'M104 124C92 120 86 102 94 95C102 89 112 100 110 122ZM120 123C118 106 125 93 134 95C143 99 139 116 128 125Z';
const cPink = 'M100 114C94 108 93 100 97 98C102 97 106 106 105 114ZM125 112C124 104 128 98 132 99C136 102 133 110 128 114ZM144 141C146 139 149 141 147 144Z';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const sleepyEye = 'M119 137C122 141 128 141 131 137';
const sleepySmile = 'M133 150C136 152 140 151 142 149';
const mHead = place(144, 144, 262, 214, 0.76, 16);

// her straw hat (picture 1), hung on a wooden peg in the wall
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cHatWash = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';
const mHat = place(113, 106, 160, 112, 0.78, -8);
const peg = 'M154 106L166 104L166 109L155 111Z';

// --- The bed: a round nest of soft moss with a rose blanket; her long curly tail hangs out
const rim = 'M46 230C70 220 120 216 160 216C204 216 250 220 276 230';
const nest = 'M46 230C44 246 76 260 160 260C244 260 278 246 276 230';
const mossWash = 'M46 230C70 220 120 216 160 216C204 216 250 220 276 230C278 246 244 260 160 260C76 260 44 246 46 230Z';
let curls = '';
for (const [x, y] of [[64, 238], [96, 244], [134, 248], [176, 249], [214, 246], [248, 238], [78, 252], [156, 256], [232, 252], [114, 234], [196, 236]]) {
  curls += `M${x} ${y}c2-3 6-3 6 0c0 3-4 3-4 1`;
}
const fluff = 'M52 228c2-4 6-5 9-3M74 222c3-3 7-3 9 0M232 221c3-2 7-2 9 1M256 225c3-2 7-1 8 2';
const blanket = 'M82 224C84 202 116 186 156 186C194 186 220 200 226 220';
const blanketWash = 'M82 224C84 202 116 186 156 186C194 186 220 200 226 220C190 216 120 216 82 224Z';
const stitches = 'M92 216C96 204 112 194 132 192M200 196C210 200 216 206 218 214';
const dots = [[118, 206], [146, 198], [176, 200], [200, 210], [134, 214], [162, 212], [104, 214]];
const tail = 'M84 222C66 224 50 232 46 246C44 258 56 266 64 260C70 254 64 248 58 252';
const paw = 'M244 214C240 218 242 224 248 223C253 222 254 216 250 213';

// --- The burrow: apple-tree roots overhead, a few pebbles in the earth walls, the floor
const roots =
  'M-4 28C30 20 62 38 98 32C132 26 152 10 178 -4M-4 52C34 44 66 58 102 52C136 46 158 30 192 -4M404 22C372 26 350 44 326 42C304 40 290 28 268 32M404 44C376 48 356 64 330 64C310 64 298 54 276 46';
const rootlets =
  'M30 50c2 8-1 15-5 19M70 54c-1 9 2 15 7 18M104 52c2 6 0 12-3 16M142 40c3 6 3 12 0 17M354 58c-2 8 0 14 5 18M314 62c1 6-1 11-5 14M392 46c-4 20 2 40-6 62M386 80c4 4 6 8 5 12';
const rootWash = 'M-4 28C30 20 62 38 98 32C132 26 152 10 178 -4L192 -4C158 30 136 46 102 52C66 58 34 44 -4 52ZM404 22C372 26 350 44 326 42C304 40 290 28 268 32L276 46C298 54 310 64 330 64C356 64 376 48 404 44Z';
const floor = 'M8 262C120 259 280 263 392 260';
const earth = hatch(26, 278, 380, 276, 9, 6, 160, 4);
const pebbles = ell(26, 132, 4, 3) + ell(40, 176, 3, 2.2) + ell(370, 206, 4, 3) + ell(356, 240, 3, 2.2) + ell(214, 92, 3, 2.4) + ell(60, 104, 2.5, 2);

// --- The round window, with the night outside
const [wx, wy] = [304, 118];
const frame = ell(wx, wy, 54) + ell(wx, wy, 45);
const sill = 'M262 176L346 176L344 182L264 182Z';
const acorn = 'M278 176C276 168 288 168 288 176ZM276 170C278 164 288 164 290 170C286 172 280 172 276 170ZM283 164l1-4';
const moon = 'M282 86C270 92 268 110 278 118C268 114 262 102 266 92C270 84 278 82 282 86Z';
const branch = 'M352 150C338 146 322 150 306 146C298 144 290 146 284 150M326 148l6-8';
const owl =
  'M326 147C318 146 314 136 316 126C317 118 320 112 322 108L326 112C330 110 334 110 338 112L342 108C344 112 347 118 347 126C348 136 344 146 336 147Z';
const owlFace = 'M329 124l3 4l3-4M326 134c3 2 9 2 12 0M325 140c3 2 11 2 14 0';
const owlEyes = ell(327, 119, 3.6) + ell(337, 119, 3.6);
const night = ell(wx, wy, 45) + moon + owl;
const stars = [
  [324, 82, 5],
  [340, 100, 3.5],
  [264, 136, 4],
  [300, 94, 3],
  [312, 136, 3.5],
  [284, 154, 3],
  [348, 128, 2.5],
];

export default {
  title: 'Back home, Country Mouse sleeps in her soft moss bed while the stars shine outside',
  seed: 101,
  washes: [
    { c: PAL.ochre, o: 0.35, d: rootWash },
    { c: PAL.grey, o: 0.4, d: 'M6 258C120 255 280 259 394 256L394 272C280 277 120 273 6 274Z' },
    // the window: deep blue night, with the moon and the owl left light
    { c: PAL.slate, o: 0.92, d: night, rule: 'evenodd' },
    { c: PAL.sky, o: 0.55, d: night, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.5, d: frame, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.4, d: moon },
    { c: PAL.terracotta, o: 0.5, d: owl },
    { c: PAL.ochre, o: 0.85, d: owlEyes },
    // the bed
    { c: PAL.ochre, o: 0.5, d: 'M262 176L346 176L344 182L264 182Z' + peg },
    { c: PAL.terracotta, o: 0.6, d: 'M276 170C278 164 288 164 290 170C286 172 280 172 276 170Z' },
    { c: PAL.ochre, o: 0.7, d: 'M278 176C276 170 288 170 288 176Z' },
    { c: PAL.green, o: 0.55, d: mossWash },
    { c: PAL.rose, o: 0.62, d: blanketWash },
    { c: PAL.grey, o: 0.7, d: T(cFur, mHead) + paw },
    { c: PAL.rose, o: 0.55, d: T(cPink, mHead) },
    { c: PAL.ochre, o: 0.75, d: T(cHatWash, mHat) },
  ],
  lines: paths([
    roots,
    floor,
    frame,
    sill,
    acorn,
    rim,
    nest,
    blanket,
    tail,
    paw,
    ...all([cHead, cEarsBare], mHead),
    T(strawHat, mHat),
    peg,
    branch,
    owl,
  ]),
  fine: paths([
    rootlets,
    earth,
    pebbles,
    curls,
    fluff,
    stitches,
    moon,
    owlEyes,
    owlFace,
    ...all([cFace, sleepyEye, sleepySmile], mHead),
    ...all([hatBand, straw], mHat),
  ]),
  once: paths([zed(228, 168, 9), zed(212, 142, 12), zed(192, 110, 15)]),
  fills: `<circle cx="327" cy="119.5" r="1.5"/><circle cx="337" cy="119.5" r="1.5"/>`,
  glints:
    stars.map(([x, y, r]) => `<path d="${star(x, y, r)}"/>`).join('') +
    dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`).join(''),
};
