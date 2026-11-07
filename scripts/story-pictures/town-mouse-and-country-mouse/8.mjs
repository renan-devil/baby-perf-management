import { PAL, hatch, paths } from '../lib.mjs';

// WOOF! Two big dogs come bounding into the dining room, tails wagging, and a chair goes over.
// In the mouse hole at the bottom of the wall, Country Mouse covers her eyes while Town Mouse
// calmly straightens his bow tie.

// Parts are copied from picture 1 and placed by mapping their path data through an affine map, so
// lines, washes, eye whites and pupils move together and the ink keeps its weight.
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

// --- Country Mouse (picture 1 coordinates), covering her eyes with her paw
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEars = 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106M118 104C116 88 126 78 136 82C144 88 138 100 126 106';
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cBody = 'M98 156C86 178 84 222 92 248L134 248C142 222 138 180 128 156';
const patch = 'M102 206L118 204L120 220L104 222ZM104 206l2 3M110 205l1 3M116 204l1 3M105 220l1-3M111 221l1-3';
const cFeet = 'M96 248C90 256 102 259 114 256M124 248C124 256 134 259 144 255';
const cTail = 'M92 238C70 242 54 254 38 246C28 240 32 230 40 234';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const cFur = cHead + 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106ZM118 104C116 88 126 78 136 82C144 88 138 100 126 106Z';
const cPink = 'M100 100C94 94 94 84 100 84C106 84 107 94 104 100ZM122 98C122 90 128 86 132 88C136 92 132 98 126 100ZM144 141C146 139 149 141 147 144Z';
const cHatWash = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';
const cDress = 'M98 158C86 180 86 222 92 248L134 248C142 222 138 180 128 158C120 162 106 162 98 158Z';
const cArm = 'M130 170C142 166 144 152 136 144';
const cPaw = 'M136 144C134 136 124 132 118 136C114 140 118 148 126 148C130 148 134 147 136 144Z';
const cPawToes = 'M120 138l3 2M119 143l4 1';
const cBackArm = 'M98 172C92 162 94 150 102 144';
const shiver = 'M74 160c-4 6-4 12 0 18M66 166c-3 4-3 8 0 12M154 176c4 6 4 12 0 18';
const cSil =
  'M74 124L88 114L88 84L100 74L112 80L116 98L122 82L134 78L144 86L140 104L152 120L146 130L148 144L142 152L132 156L142 190L140 250L146 258L90 260L86 220L88 180L98 156L90 150L86 130Z';

// --- Town Mouse (picture 1 coordinates), calmly straightening his bow tie
const tHead = 'M310 146C314 128 304 116 290 116C276 116 266 126 258 138C266 146 280 150 292 150C302 150 308 148 310 146Z';
const tEars = 'M276 128C262 132 252 120 258 110C264 102 274 108 276 116M306 124C318 130 330 120 326 110C322 102 312 106 308 114';
const topHat = 'M278 110L280 58C290 54 304 54 312 58L314 110M280 58C286 64 306 64 312 58M266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const hatBand2 = 'M279 98C290 102 304 102 314 98';
const monocle = 'M272 130C272 122 284 122 284 130C284 138 272 138 272 130ZM284 132C290 146 294 160 290 172';
const tBody = 'M276 152C264 174 262 220 270 248L312 248C320 220 318 180 306 152';
const vest = 'M279 160L292 190L305 160M270 234C282 238 302 238 314 234';
const bowTie = 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z';
const tFeet = 'M276 248C270 256 282 259 294 256M300 248C300 256 312 259 322 255';
const tTail = 'M312 238C334 242 346 252 360 246C370 240 364 230 356 234';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
const tFur = 'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150ZM276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z';
const tPink = 'M262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z';
const tHatWash = 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const tVestWash = 'M278 158C266 178 264 216 270 236C284 240 300 240 314 236C318 210 316 178 306 158L292 190Z';
const tSlate = 'M270 238C268 244 270 248 272 250L312 250C314 246 314 240 314 236C300 240 284 240 270 238ZM276 248C270 256 282 259 294 256L292 250ZM300 248C300 256 312 259 322 255L312 249Z';
const buttons = ell(289, 200, 3) + ell(289, 214, 3) + ell(289, 228, 3);
const lid = 'M274 129C277 127 281 127 284 129';
const tArms = 'M308 170C318 172 316 160 307 156M276 172C268 170 268 160 277 156';
const tPaws = 'M307 156C303 150 309 146 312 150C314 153 311 157 307 156ZM277 156C273 152 278 147 281 150C283 153 281 157 277 156Z';
const cane = 'M330 256L322 198M322 198C322 190 332 188 334 194';
const tSil =
  'M254 112L266 106L278 104L280 56L312 54L314 104L326 106L332 112L326 116L330 124L318 132L312 150L318 190L320 250L324 258L272 260L264 220L266 180L276 152L262 146L254 140L256 120Z';

// --- Wall, skirting board, floor and the mouse hole
// (the skirting stops behind the dogs' legs and at the hole)
const skirt = [
  [0, 86],
  [112, 138],
  [262, 298],
  [322, 400],
].map(([a, b]) => `M${a} 222L${b} 222M${a} 228L${b} 228`).join('');
const floor = 'M0 262C120 260 280 263 400 261';
const boards = hatch(14, 280, 386, 280, 12, 9, 170, 6) + hatch(30, 294, 370, 294, 9, 9, 170, 8);
const hole = 'M138 262L138 206C138 168 166 140 200 140C234 140 262 168 262 206L262 262';
const holeWash = 'M138 262L138 206C138 168 166 140 200 140C234 140 262 168 262 206L262 262Z';
const holeEdge = 'M144 252C144 214 152 166 196 150';

// --- Placements: both mice stand in the mouth of the hole
const mC = place(116, 258, 170, 262, 0.52);
const mT = place(296, 258, 232, 262, 0.52);

// --- Two big dogs, seen from the tail end, bounding off to either side (the golden one is drawn
// here facing left; the spotty one is the same shape flipped and a little smaller)
const dogBody =
  'M-10 44C30 34 72 30 100 36C124 40 138 56 136 76C134 102 128 118 120 130C124 144 130 156 128 168C124 186 122 214 122 244M-10 128C24 126 52 118 76 108C70 124 70 138 74 146C82 158 92 168 98 182C102 200 102 222 104 244';
const dogPaw = 'M104 244C92 246 90 262 104 262L130 262C142 262 138 246 122 244';
const dogToes = 'M114 262l1-6M122 262l1-6';
const dogFarLeg = 'M54 122C54 138 48 150 40 160M70 130C68 146 62 160 54 170M40 160C30 160 28 172 38 175C46 177 52 174 54 170';
const dogWash =
  'M-10 44C30 34 72 30 100 36C124 40 138 56 136 76C134 102 128 118 120 130C124 144 130 156 128 168C124 186 122 214 122 244C136 248 140 262 130 262L104 262C90 262 92 246 104 244C102 222 102 200 98 182C92 168 82 158 74 146C70 138 70 124 76 108C52 118 24 126 -10 128ZM54 122L70 130C68 146 62 160 54 170C52 174 46 177 38 175C28 172 30 160 40 160C48 150 54 138 54 122Z';
const fluff = 'M134 98l7 3M130 112l7 4M124 124l6 5M128 150l6 2';
const goldTail = 'M128 46C144 38 152 24 152 6';
const feathers = 'M146 40l7 5M151 30l8 2M153 18l8-1M126 52l3 6';
const goldTailWash = 'M124 44C138 36 144 22 144 4C150 -2 162 4 160 14C158 32 148 50 130 58Z';
const wag = 'M166 6c6 5 8 11 6 17M174 -2c8 7 10 15 8 23M138 -2c-6 3-8 8-7 13';
const mDogA = place(0, 262, -4, 262, 0.92);
const mDogB = place(0, 262, 406, 262, 0.86, 0, true);
const whipTail = 'M130 54C146 48 154 34 156 14';
const whipTailWash = 'M128 50C142 44 150 30 151 12L160 14C159 36 148 54 132 60Z';
const spots = [
  [96, 52, 6, 4.5], [70, 44, 4, 3], [40, 50, 5, 4], [114, 92, 4, 5.5], [92, 78, 3.5, 3], [58, 80, 5, 4],
  [20, 70, 4, 3], [110, 126, 3, 4], [104, 178, 3, 4.5], [118, 214, 3, 3.5], [86, 112, 3, 2.5], [128, 66, 3.5, 3],
  [44, 104, 3.5, 2.5], [66, 154, 3, 3],
].map(([x, y, rx, ry]) => ell(x, y, rx, ry)).join('');
const dust = 'M54 264c-6-2-10-6-8-10M44 262c-4-3-5-7-2-10M348 264c6-2 10-6 8-10M358 262c4-3 5-7 2-10';

// --- The chair, knocked over on its back, legs in the air
// (drawn from the front, then laid on its side)
const mChair = place(0, 0, 56, 264, 0.74, -84);
const chair =
  'M-30 0L30 0L26 -10L-26 -10ZM-30 0L-30 6L30 6L30 0M-27 6L-27 52M-21 6L-21 52M27 6L27 52M21 6L21 52M-22 -10L-22 -2M22 -10L22 -2M-25 -10L-27 -64M25 -10L27 -64M-30 -64C-10 -71 10 -71 30 -64L30 -56C10 -62 -10 -62 -30 -56ZM-11 -12L-12 -58M0 -12L0 -59M11 -12L12 -58M-27 34L27 34';
const chairWash = 'M-30 -64C-10 -71 10 -71 30 -64L30 -56C10 -62 -10 -62 -30 -56ZM-30 0L30 0L30 6L-30 6ZM-27 6L-21 6L-21 52L-27 52ZM21 6L27 6L27 52L21 52ZM-25 -10L-21 -10L-23 -58L-27 -58ZM25 -10L21 -10L23 -58L27 -58Z';
const cushion = 'M-30 0L30 0L26 -10L-26 -10Z';
const bump = 'M96 238l6-4M98 248l7 0M8 224l-4-6M20 220l-1-7';

export default {
  title: 'Hiding in the hole in the wall while two big dogs bound past',
  seed: 81,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M0 222L400 222L400 262C280 263 120 260 0 262Z' },
    { c: PAL.grey, o: 0.42, d: 'M0 262C120 260 280 263 400 261L400 300L0 300Z' },
    { c: PAL.slate, o: 0.9, d: holeWash + T(cSil, mC) + T(tSil, mT), rule: 'evenodd' },
    { c: PAL.ochre, o: 0.72, d: T(dogWash + goldTailWash, mDogA) },
    { c: PAL.grey, o: 0.2, d: T(dogWash + whipTailWash, mDogB) },
    { c: PAL.terracotta, o: 0.55, d: T(chairWash, mChair) },
    { c: PAL.rose, o: 0.6, d: T(cushion, mChair) },
    // mice
    { c: PAL.grey, o: 0.7, d: T(cFur + cPaw, mC) + T(tFur + tPaws, mT) },
    { c: PAL.rose, o: 0.55, d: T(cPink, mC) + T(tPink, mT) },
    { c: PAL.ochre, o: 0.75, d: T(cHatWash, mC) + T(buttons, mT) },
    { c: PAL.green, o: 0.62, d: T(cDress, mC) },
    { c: PAL.red, o: 0.78, d: T(tVestWash, mT) },
    { c: PAL.slate, o: 0.8, d: T(tHatWash + tSlate, mT) },
    { c: PAL.sky, o: 0.75, d: T(bowTie, mT) },
  ],
  whites: T(ell(279, 131, 5), mT),
  lines: paths([
    skirt,
    floor,
    hole,
    ...all([dogBody, dogPaw, dogFarLeg, goldTail], mDogA),
    ...all([dogBody, dogPaw, dogFarLeg, whipTail], mDogB),
    T(chair, mChair),
    ...all([cHead, cEars, strawHat, cBody, cFeet, cTail, cArm, cBackArm, cPaw], mC),
    ...all([tHead, tEars, topHat, tBody, tFeet, tTail, tArms, cane], mT),
  ]),
  fine: paths([
    boards,
    holeEdge,
    ...all([dogToes, fluff, feathers], mDogA),
    T(dogToes, mDogB),
    ...all([hatBand, straw, patch, cFace, cPawToes], mC),
    ...all([hatBand2, monocle, vest, bowTie, tFace, lid, tPaws], mT),
  ]),
  once: paths([T(wag, mDogA), T(wag, mDogB), dust, bump, T(shiver, mC)]),
  fills: `<path d="${T(ell(278, 131.5, 2.2), mT)}"/><path d="${T(spots, mDogB)}"/>`,
};
