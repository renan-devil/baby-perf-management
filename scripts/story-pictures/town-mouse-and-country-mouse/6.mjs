import { PAL, hatch, paths } from '../lib.mjs';

// Country Mouse sits on the tablecloth and takes a big bite of an enormous wheel of holey cheese,
// eyes as round as buttons; Town Mouse, very pleased with himself, waves a paw at the feast.

// Parts are copied from picture 1 and placed by mapping their path data through an affine map, so
// lines, washes, eye whites and pupils move together and the ink keeps its weight.
const f1 = (n) => Math.round(n * 10) / 10;
const place = (ax, ay, x, y, s = 1, deg = 0, flip = false) => {
  const r = (deg * Math.PI) / 180;
  const k = flip ? -1 : 1;
  const [a, b, c, d] = [s * Math.cos(r) * k, s * Math.sin(r) * k, -s * Math.sin(r), s * Math.cos(r)];
  return [a, b, c, d, x - a * ax - c * ay, y - b * ax - d * ay];
};
const at = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
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

// --- Country Mouse's head, ears and straw hat (picture 1 coordinates, snout tip at 144,144)
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEars = 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106M118 104C116 88 126 78 136 82C144 88 138 100 126 106';
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const cFur = cHead + 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106ZM118 104C116 88 126 78 136 82C144 88 138 100 126 106Z';
const cPink = 'M100 100C94 94 94 84 100 84C106 84 107 94 104 100ZM122 98C122 90 128 86 132 88C136 92 132 98 126 100ZM144 141C146 139 149 141 147 144Z';
const cHatWash = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';
// eyes as round as buttons, and a full cheek
const cEyeRing = ell(124, 136, 6.6);
const cCheek = 'M128 150C133 154 139 153 142 149';

// --- Town Mouse (picture 1 coordinates, facing left; drawn here flipped to face right)
const tHead = 'M310 146C314 128 304 116 290 116C276 116 266 126 258 138C266 146 280 150 292 150C302 150 308 148 310 146Z';
const tEars = 'M276 128C262 132 252 120 258 110C264 102 274 108 276 116M306 124C318 130 330 120 326 110C322 102 312 106 308 114';
const topHat = 'M278 110L280 58C290 54 304 54 312 58L314 110M280 58C286 64 306 64 312 58M266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const hatBand2 = 'M279 98C290 102 304 102 314 98';
const monocle = 'M272 130C272 122 284 122 284 130C284 138 272 138 272 130ZM284 132C290 146 294 160 290 172';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
const tFur = 'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150ZM276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z';
const tPink = 'M262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z';
const tHatWash = 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const smugEye = 'M273 132C276 128 281 128 284 131';
const smile = 'M263 142C266 145 270 145 273 142';
const tBody = 'M276 152C264 174 262 220 270 248L312 248C320 220 318 180 306 152';
const vest = 'M279 160L292 190L305 160M270 234C282 238 302 238 314 234';
const bowTie = 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z';
const tArm = 'M306 172C318 182 322 192 322 200M322 200C328 200 330 206 324 208';
const cane = 'M324 204L334 256M324 204C324 196 334 194 336 200';
const tFeet = 'M276 248C270 256 282 259 294 256M300 248C300 256 312 259 322 255';
const tTail = 'M312 238C334 242 346 252 360 246C370 240 364 230 356 234';
const tVestWash = 'M278 158C266 178 264 216 270 236C284 240 300 240 314 236C318 210 316 178 306 158L292 190Z';
const tSlate = 'M270 238C268 244 270 248 272 250L312 250C314 246 314 240 314 236C300 240 284 240 270 238ZM276 248C270 256 282 259 294 256L292 250ZM300 248C300 256 312 259 322 255L312 249Z';
const tTieWash = 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z';
const buttons = ell(289, 200, 3) + ell(289, 214, 3) + ell(289, 228, 3);

const tPaw = 'M111 182C109 176 113 170 119 170C124 170 126 176 122 180C119 183 114 184 111 182Z';

// Placements
const mT = place(292, 258, 74, 238, 0.8, 0, true); // town mouse body, standing on the table
const [nx, ny] = at(mT, 292, 151);
const mTH = place(292, 151, nx, ny, 0.8, -14, true); // his head, chin up
const mC = place(144, 144, 223, 177, 0.85, 3); // country mouse head, snout in the cheese
const mHat = mC;

// --- The table: top edge, a hanging cloth with soft folds and a scalloped hem
const tableTop = 'M8 238C120 235 280 240 392 236';
let hem = 'M12 270';
let lace = '';
for (let i = 0; i < 16; i++) {
  hem += `q11.8 ${i % 2 ? 9 : 11} 23.5 0`;
  lace += `M${f1(21.5 + i * 23.5)} 274.5l1.5 0`;
}
const clothSides = 'M9 239C9 250 11 260 12 270M391 237C391 250 389 260 388 270';
const border = 'M11 255C120 258 280 254 389 256M11 262C120 265 280 261 389 263';
const folds = 'M82 270c-2-5-1-10 2-14M176 270c2-5 1-10-2-14M270 270c-2-5-1-10 2-14M364 270c2-5 1-10-2-14';
const clothWash = `M8 238C120 235 280 240 392 236L388 270${'q-11.8 10 -23.5 0'.repeat(16)}Z`;
const borderWash = 'M11 255C120 258 280 254 389 256L389 263C280 261 120 265 11 262Z';

// --- The cheese wheel, with a big bite out of its side
const cheeseTop = ell(296, 120, 92, 22);
const bite = 'C216 148 228 150 228 158C236 160 238 170 231 174C239 178 238 190 230 192C234 200 222 206 204 204';
const biteBack = 'C222 206 234 200 230 192C238 190 239 178 231 174C238 170 236 160 228 158C228 150 216 148 204 148';
const cheese = `M204 120L204 148${bite}L204 212C204 224 245 234 296 234C347 234 388 224 388 212L388 120`;
const cheeseSide = `M204 120C204 132 245 142 296 142C347 142 388 132 388 120L388 212C388 224 347 234 296 234C245 234 204 224 204 212L204 204${biteBack}Z`;
const sideHoles = [
  [272, 200, 11, 7.5],
  [324, 172, 9.5, 7],
  [364, 204, 7, 5.5],
  [270, 164, 5, 4],
  [314, 218, 5, 3.5],
  [356, 156, 4.5, 3.5],
  [248, 216, 4, 3],
];
const topHoles = [
  [252, 116, 9, 3.6],
  [332, 126, 10, 4.2],
  [300, 106, 5, 2],
  [358, 112, 6, 2.4],
];
const holes = [...sideHoles, ...topHoles].map(([x, y, rx, ry]) => ell(x, y, rx, ry)).join('');
const holeShade = sideHoles.map(([x, y, rx, ry]) => ell(x, y, rx, ry) + ell(x, y + ry * 0.3, rx * 0.85, ry * 0.68)).join('');

// --- Country Mouse sitting, hugging the cheese, tail curled up with delight
const cBody = 'M178 182C166 195 160 216 162 236L204 236C207 222 206 202 202 186';
const cDress = 'M179 184C167 197 162 216 164 235L203 235C206 222 205 204 201 188C194 191 186 190 179 184Z';
const cPatch = 'M170 210L182 208L184 220L172 222ZM172 210l1 3M177 209l1 3M174 222l1-3M180 221l1-3';
const cArm = 'M196 193C200 202 203 208 207 210';
const cPaw = 'M207 210C206 205 211 202 216 204C220 206 219 212 214 214C211 215 208 213 207 210Z';
const cPaws = 'M213 205l2 3M216 207l1 3';
const cFeet = 'M200 234C203 240 214 240 218 236M166 235C164 240 172 242 178 240';
const cTail = 'M164 228C144 234 126 230 120 216C114 202 128 194 136 202C141 208 136 214 130 211';
const joy = 'M148 128l-10-5M155 110l-7-8M173 98l-2-10M195 94l3-10M215 102l7-7';
const crumbs = 'M219 190l3-2l2 3l-3 1ZM222 160l3-1l1 3l-3 1ZM212 241l4-3l3 4l-4 2ZM226 240l3-2l2 3l-3 1ZM198 242l2-3l3 2Z';

export default {
  title: 'Country Mouse takes a big bite of the enormous cheese',
  seed: 61,
  washes: [
    { c: PAL.sky, o: 0.26, d: clothWash },
    { c: PAL.rose, o: 0.55, d: borderWash },
    { c: PAL.grey, o: 0.4, d: 'M140 236C150 230 190 230 206 236ZM28 238C36 232 112 232 120 238Z' },
    { c: PAL.ochre, o: 0.42, d: cheeseTop },
    { c: PAL.ochre, o: 0.78, d: cheeseSide },
    { c: PAL.ochre, o: 0.55, d: holeShade, rule: 'evenodd' },
    // fur
    { c: PAL.grey, o: 0.7, d: T(cFur, mC) + T(tFur, mTH) + cPaw + tPaw },
    { c: PAL.rose, o: 0.55, d: T(cPink, mC) + T(tPink, mTH) + T(ell(126, 148, 4.5, 3), mC) },
    { c: PAL.ochre, o: 0.75, d: T(cHatWash, mHat) + T(buttons, mT) + crumbs },
    { c: PAL.green, o: 0.62, d: cDress },
    { c: PAL.red, o: 0.78, d: T(tVestWash, mT) },
    { c: PAL.slate, o: 0.8, d: T(tHatWash, mTH) + T(tSlate, mT) },
    { c: PAL.sky, o: 0.75, d: T(tTieWash, mT) },
  ],
  whites: T(ell(124, 136, 6.2), mC),
  lines: paths([
    tableTop,
    clothSides,
    hem,
    cheeseTop,
    cheese,
    cBody,
    cTail,
    cArm,
    cPaw,
    cFeet,
    ...all([cHead, cEars], mC),
    T(strawHat, mHat),
    ...all([tHead, tEars, topHat], mTH),
    ...all([tBody, tArm, cane, tFeet, tTail], mT),
    // his free paw, waved at the feast
    'M92 167C98 180 104 186 111 182',
    tPaw,
  ]),
  fine: paths([
    folds,
    border,
    holes,
    crumbs,
    hatch(330, 222, 380, 206, 6, 8, 115, 5),
    cPatch,
    cPaws,
    joy,
    'M118 171l1 3M122 172l0 3',
    ...all([cFace, cEyeRing, cCheek], mC),
    ...all([hatBand, straw], mHat),
    ...all([hatBand2, monocle, tFace, smugEye, smile], mTH),
    ...all([vest, bowTie], mT),
  ]),
  once: paths([lace]),
  fills: `<path d="${T(ell(124.6, 136.4, 3.1), mC)}"/>`,
  glints: `<path d="${T(ell(125.8, 135.2, 1), mC)}"/>`,
};
