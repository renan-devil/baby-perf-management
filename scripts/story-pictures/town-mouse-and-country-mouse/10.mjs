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
const mHead = place(144, 144, 252, 214, 0.82, 22);

// her straw hat (picture 1), hung on its peg
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cHatWash = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';
const mHat = place(113, 104, 150, 122, 0.8, -10);
const peg = 'M150 112l2-10';

// --- The bed: a soft mound of moss, a rose blanket, a pillow; her long curly tail hangs out
const moss = 'M54 252C50 230 86 210 150 208C214 206 262 226 268 252';
const mossWash = 'M54 252C50 230 86 210 150 208C214 206 262 226 268 252C232 264 92 264 54 252Z';
let curls = '';
for (const [x, y] of [[70, 238], [92, 226], [252, 236], [238, 226], [84, 250], [250, 250], [168, 254], [120, 255], [206, 254]]) {
  curls += `M${x} ${y}c2-3 6-3 6 0c0 3-4 3-4 1`;
}
const blanket = 'M86 238C88 214 118 196 160 196C196 196 220 210 224 232C200 242 120 244 86 238Z';
const patchwork = 'M120 202C122 214 122 228 120 240M158 196C160 210 160 226 158 242M192 202C192 214 194 226 196 238M96 222C130 218 180 216 220 220';
const pillow = 'M214 226C210 214 228 206 250 210C270 214 276 228 264 234C250 238 224 236 214 226Z';
const tail = 'M88 236C68 236 50 242 44 254C40 264 52 270 60 264C66 258 60 252 54 256';
const paw = 'M240 222C236 226 240 232 246 230C250 228 250 222 246 220';

// --- The burrow: apple-tree roots overhead, the earth floor
const roots =
  'M-4 46C40 30 80 36 120 22C150 12 176 16 200 4M-4 62C46 46 90 52 130 36C160 24 190 26 214 10M404 34C370 26 346 32 318 22C300 16 284 10 270 -4M404 50C372 42 344 48 316 38';
const rootlets =
  'M40 50c2 8 0 14-4 18M96 40c-1 7 2 12 6 15M150 26c2 6 1 11-2 15M356 40c-2 7 0 12 4 16M330 36c1 5-1 9-4 12M196 14c3 6 3 11 0 15';
const rootWash = 'M-4 46C40 30 80 36 120 22C150 12 176 16 200 4L214 10C190 26 160 24 130 36C90 52 46 46 -4 62ZM404 34C370 26 346 32 318 22C300 16 284 10 270 -4L290 -4C300 10 330 26 404 50Z';
const floor = 'M8 262C120 259 280 263 392 260';
const earth = hatch(26, 276, 380, 274, 9, 6, 160, 4);
const pebbles = 'M24 120c2-2 5-1 5 1M60 160c2-2 5-1 5 1M30 200c2-2 5-1 5 1M372 220c2-2 5-1 5 1M360 186c2-2 5-1 5 1M210 100c2-2 5-1 5 1';

// --- The round window, with the night outside
const [wx, wy] = [304, 118];
const frame = ell(wx, wy, 54) + ell(wx, wy, 45);
const sill = 'M256 172C280 180 328 180 352 172';
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
    { c: PAL.green, o: 0.55, d: mossWash },
    { c: PAL.rose, o: 0.62, d: blanket },
    { c: PAL.grey, o: 0.7, d: T(cFur, mHead) + paw },
    { c: PAL.rose, o: 0.55, d: T(cPink, mHead) },
    { c: PAL.ochre, o: 0.75, d: T(cHatWash, mHat) },
  ],
  whites: pillow,
  lines: paths([
    roots,
    floor,
    frame,
    sill,
    moss,
    blanket,
    pillow,
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
    curls,
    patchwork,
    moon,
    owlEyes,
    owlFace,
    ...all([cFace, sleepyEye, sleepySmile], mHead),
    ...all([hatBand, straw], mHat),
  ]),
  once: paths([zed(214, 168, 9), zed(198, 142, 12), zed(176, 110, 15), pebbles]),
  fills: `<circle cx="327" cy="119.5" r="1.5"/><circle cx="337" cy="119.5" r="1.5"/>`,
  glints: stars.map(([x, y, r]) => `<path d="${star(x, y, r)}"/>`).join(''),
};
