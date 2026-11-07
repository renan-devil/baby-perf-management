import { PAL, hatch, paths } from '../lib.mjs';

// "RUN!" The big ginger cat leaps up onto a chair at the end of the table and looks straight at the
// two mice, who race away across the tablecloth; behind them the jelly tips over with a splosh.

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

// --- Country Mouse (picture 1 coordinates, facing right); her hat has flown off, so her ears
// reach down to her head
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEarsBare = 'M105 124C94 125 85 116 87 105C89 95 99 91 106 96C112 101 112 112 110 122M120 123C116 113 117 101 125 96C133 92 141 99 139 109C138 117 133 122 127 125';
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const cFur =
  cHead + 'M105 124C94 125 85 116 87 105C89 95 99 91 106 96C112 101 112 112 110 122ZM120 123C116 113 117 101 125 96C133 92 141 99 139 109C138 117 133 122 127 125Z';
const cPink = 'M97 116C92 112 91 104 95 101C100 99 105 106 104 114ZM126 114C123 108 125 100 130 99C135 99 136 107 131 113ZM144 141C146 139 149 141 147 144Z';
const cHatWash = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';
const cBrow = 'M118 128C121 125 127 125 131 128';
const cRun = {
  body: 'M98 156C88 176 86 204 90 226L136 226C140 204 138 178 128 156',
  dress: 'M98 158C88 178 88 204 92 225L134 225C138 204 136 180 128 158C120 162 106 162 98 158Z',
  patch: 'M104 196L118 194L120 208L106 210ZM106 196l1 3M112 195l1 3M108 210l1-3M114 209l1-3',
  legs: 'M126 224C132 234 138 242 142 248M102 224C94 230 86 232 80 230',
  feet: 'M138 250C140 244 152 244 158 248C158 253 146 254 138 250ZM80 230C76 223 66 222 64 228C66 233 76 234 80 230Z',
  arms: 'M128 168C138 162 144 152 146 142M100 168C90 164 84 156 82 146',
  paws: 'M146 142C144 136 150 132 154 135C157 139 152 143 146 142ZM82 146C78 141 82 135 86 137C89 140 87 145 82 146Z',
  tail: 'M92 218C74 222 58 218 46 210C38 204 40 196 48 198',
};

// --- Town Mouse (picture 1 coordinates, facing left), running, one paw holding his hat on
const tHead = 'M310 146C314 128 304 116 290 116C276 116 266 126 258 138C266 146 280 150 292 150C302 150 308 148 310 146Z';
const tEars = 'M276 128C262 132 252 120 258 110C264 102 274 108 276 116M306 124C318 130 330 120 326 110C322 102 312 106 308 114';
const topHat = 'M278 110L280 58C290 54 304 54 312 58L314 110M280 58C286 64 306 64 312 58M266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const hatBand2 = 'M279 98C290 102 304 102 314 98';
const monocle = 'M272 130C272 122 284 122 284 130C284 138 272 138 272 130ZM284 132C290 146 294 160 290 172';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
const tFur = 'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150ZM276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z';
const tPink = 'M262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z';
const tHatWash = 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const tBrow = 'M272 121C275 118 281 118 285 121';
const vest = 'M279 160L292 190L305 160';
const bowTie = 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z';
const buttons = ell(289, 200, 3) + ell(289, 214, 3);
const tRun = {
  body: 'M276 152C264 174 262 212 268 230L314 230C320 212 318 180 306 152',
  vestWash: 'M278 158C266 178 264 212 269 229L313 229C318 210 316 178 306 158L292 190Z',
  hem: 'M268 230C282 234 302 234 314 230',
  legs: 'M276 230L264 246L274 250L286 232M302 230L318 238L322 230L312 226',
  legWash: 'M268 230L314 230L322 230L318 238L302 232L286 232L274 250L264 246Z',
  shoes: 'M264 246C256 246 252 254 258 256C264 258 274 256 274 250M322 230C328 226 336 230 333 236C331 239 324 240 318 238',
  shoeWash: 'M264 246C256 246 252 254 258 256C264 258 274 256 274 250ZM322 230C328 226 336 230 333 236C331 239 324 240 318 238Z',
  arms: 'M306 168C318 156 326 136 326 118M276 172C266 178 258 180 250 178',
  paws: 'M326 118C322 112 328 107 333 110C336 113 332 118 326 118ZM250 178C244 180 242 174 246 171C249 169 253 172 252 175Z',
  cane: 'M234 196L262 162M262 162C264 156 272 156 272 162',
  tail: 'M312 224C334 228 352 222 364 212C372 204 366 196 360 200',
};

// --- The ginger cat's head from picture 1, with its cropped half completed (three-quarter view)
const catHead =
  'M413 40L392 14L380 34C370 32 360 22 356 18C352 32 352 44 356 52C350 64 352 80 362 90C372 98 390 100 402 96C412 92 418 80 415 66C419 56 418 48 413 40Z';
const catEyes = 'M362 58C366 52 376 52 380 58C376 64 366 64 362 58ZM389 58C393 52 403 52 407 57C403 63 393 64 389 58Z';
const catNose = 'M372 70L380 70L376 75Z';
const catMarks =
  'M376 75L376 80M376 80C372 84 368 84 366 80M376 80C380 84 384 84 386 80M358 74l-28-5M358 79l-28 1M359 84l-25 6M393 74l28-5M393 79l28 1M392 84l25 6M370 34l2 7M378 32l0 8M386 34l-2 7';
const catEars = 'M360 30C358 36 358 42 362 46L370 38ZM392 22L386 34L398 34Z';
const catPupils = 'M368.5 53.5L370 58L368.5 62.5L367 58ZM394.5 53.5L396 58L394.5 62.5L393 58Z';
const mCat = place(383, 58, 314, 126, 1.0, -6);

// The cat's body: rearing up from the chair seat, front paws on the table's edge, tail up
const catBody =
  'M296 160C288 172 280 180 268 184M306 170C298 182 290 188 278 192M342 156C356 166 366 186 366 208C366 228 360 244 348 250M314 176C320 198 324 222 326 246M326 246C322 252 334 254 344 251M348 250C348 254 358 255 362 251';
const catBodyWash =
  'M296 160L268 184L276 194C290 188 300 180 314 176C320 198 324 222 326 246C322 252 334 254 344 251L348 250C360 244 366 228 366 208C366 186 356 166 342 156L320 154Z';
const catPaws = 'M268 184C260 182 256 188 260 192C264 196 274 196 276 192M278 192C270 192 268 198 274 200C280 202 288 200 288 196';
const catPawWash = 'M268 184C260 182 256 188 260 192C264 196 274 196 276 192ZM278 192C270 192 268 198 274 200C280 202 288 200 288 196Z';
const claws = 'M258 188l-3 2M259 192l-3 2M268 197l-3 1M268 200l-2 3';
const catTail = 'M364 226C374 224 378 212 374 198C370 186 372 172 366 164C362 158 354 160 356 166';
const catTailWash = 'M364 220C370 218 372 210 369 199C365 186 366 170 361 163C356 156 350 162 354 168C360 176 358 188 362 200C365 212 362 222 362 230L366 232C378 228 382 214 378 198Z';
const stripes = 'M346 176c4 4 6 8 6 12M352 196c4 3 6 7 6 11M342 216c4 2 7 5 8 9M366 196l7-2M365 180l7 1';
const thump = 'M318 246l-7-3M318 252l-8 1M364 244l7-4M366 250l8 0';

// --- Table and chair: a plain white cloth with a scalloped hem and a turned leg, as on the
// table in picture 5; the chair is wooden with a rose cushion, like the one in picture 8
const tableTop = 'M8 196C100 193 180 198 262 194';
let hem = 'M10 234';
for (let i = 0; i < 11; i++) hem += `q11.2 ${i % 2 ? 9 : 10} 22.4 0`;
const clothEdge = 'M262 194C264 210 263 222 256 234';
const folds = [54.8, 99.6, 144.4, 189.2, 234].map((x) => `M${x} 198L${x} 231`).join('');
const floor = 'M176 292C250 290 330 293 394 290';
const lx = 236;
const legSide = (k) =>
  `M${lx + 3 * k} 242L${lx + 3 * k} 246C${lx + 9 * k} 249 ${lx + 9 * k} 259 ${lx + 3 * k} 262L${lx + 2 * k} 284C${lx + 6 * k} 286 ${lx + 6 * k} 291 ${lx + 2 * k} 292`;
const tableLeg = legSide(-1) + legSide(1);
const tableLegWash = `${legSide(-1)}L${lx + 2} 292C${lx + 6} 291 ${lx + 6} 286 ${lx + 2} 284L${lx + 3} 262C${lx + 9} 259 ${lx + 9} 249 ${lx + 3} 246L${lx + 3} 242Z`;
const chair =
  'M290 252L390 252L390 260L290 260ZM296 260L294 293M306 260L306 289M380 260L383 293M372 260L372 289M384 252L388 150M377 252L380 154M376 152C380 144 392 144 396 150M379 184L386 183M379 216L385 215';
const chairWash = 'M294 260L298 260L296 293L292 293ZM380 260L384 260L385 293L381 293ZM382 252L386 150L394 150L390 252ZM376 152C380 144 392 144 396 150Z';
const cushion = 'M290 252L390 252L390 260L290 260Z';

// --- The jelly, tumbling over: a fluted mould, with a splosh
const mJelly = place(26, 0, 226, 195, 1.05, 30); // pivoting on its right edge, toppling towards the cat
const jelly =
  'M-26 0C-29 -7 -25 -11 -27 -17C-29 -25 -21 -28 -21 -34C-21 -42 -13 -46 -6 -46L6 -46C13 -46 21 -42 21 -34C21 -28 29 -25 27 -17C25 -11 29 -7 26 0C10 4 -10 4 -26 0Z';
const jellyRidges = 'M-15 -1C-18 -12 -14 -24 -13 -38M-5 -1C-6 -16 -5 -32 -4 -45M5 -1C6 -16 5 -32 4 -45M15 -1C18 -12 14 -24 13 -38M-6 -46C-3 -43 3 -43 6 -46';
const splash =
  'M238 156C234 150 235 144 239 143C242 146 242 152 238 156ZM250 166C250 160 254 156 257 158C258 162 254 166 250 166ZM226 146C224 140 226 134 230 134C232 138 230 144 226 146ZM246 178C250 174 256 174 258 176C256 180 250 180 246 178Z';
const splat = 'M226 196C232 190 246 189 254 192C258 192 262 194 262 196C250 199 236 199 226 196Z';
const wobble = 'M186 152c-3-3-3-6 0-9M178 160c-3-2-3-5 0-8';

// --- Placements of the mice (both run to the left)
const mCR = place(150, 254, 132, 196, 0.72, -12, true); // country mouse body, front foot on the table
const [cnx, cny] = at(mCR, 113, 156);
const mCH = place(113, 156, cnx, cny, 0.72, -14, true); // her head
const mHatFly = place(113, 118, 186, 70, 0.66, 26, true); // her hat, flying off behind her
const mTR = place(258, 257, 44, 196, 0.72, -10); // town mouse body, front foot on the table
const [tnx, tny] = at(mTR, 292, 151);
const mTH = place(292, 151, tnx, tny, 0.72, -6); // his head

const speed = 'M178 180l16 0M182 168l12 0M104 182l16 0M108 170l12 0';
const fright = 'M140 92l-3-9M152 90l3-8M58 58l-4-7M72 52l1-9';

export default {
  title: 'A big ginger cat jumps onto a chair and the two mice run across the table',
  seed: 71,
  washes: [
    { c: PAL.grey, o: 0.42, d: 'M176 291C250 289 330 292 394 289L394 299C330 301 250 299 176 300Z' },
    { c: PAL.terracotta, o: 0.5, d: chairWash + tableLegWash },
    { c: PAL.rose, o: 0.6, d: cushion },
    { c: PAL.terracotta, o: 0.72, d: T(catHead, mCat) + catBodyWash + catTailWash + catPawWash },
    { c: PAL.rose, o: 0.6, d: T(catNose + catEars, mCat) },
    { c: PAL.ochre, o: 0.85, d: T(catEyes, mCat) },
    { c: PAL.red, o: 0.55, d: T(jelly, mJelly) + splash + splat },
    // mice
    { c: PAL.grey, o: 0.7, d: T(cFur, mCH) + T(tFur, mTH) + T(cRun.paws, mCR) + T(tRun.paws, mTR) },
    { c: PAL.rose, o: 0.55, d: T(cPink, mCH) + T(tPink, mTH) },
    { c: PAL.ochre, o: 0.75, d: T(cHatWash, mHatFly) + T(buttons, mTR) },
    { c: PAL.green, o: 0.62, d: T(cRun.dress, mCR) },
    { c: PAL.red, o: 0.78, d: T(tRun.vestWash, mTR) },
    { c: PAL.slate, o: 0.8, d: T(tHatWash, mTH) + T(tRun.legWash + tRun.shoeWash, mTR) },
    { c: PAL.sky, o: 0.75, d: T(bowTie, mTR) },
  ],
  whites: T(ell(125, 137, 5.6), mCH) + T(ell(278, 130, 5.6), mTH),
  lines: paths([
    floor,
    tableTop,
    clothEdge,
    hem,
    tableLeg,
    chair,
    T(catHead, mCat),
    T(catEyes, mCat),
    catBody,
    catPaws,
    catTail,
    T(jelly, mJelly),
    ...all([cHead, cEarsBare], mCH),
    T(strawHat, mHatFly),
    ...all([cRun.body, cRun.legs, cRun.feet, cRun.arms, cRun.paws, cRun.tail], mCR),
    ...all([tHead, tEars, topHat], mTH),
    ...all([tRun.body, tRun.legs, tRun.shoes, tRun.arms, tRun.cane, tRun.tail], mTR),
  ]),
  fine: paths([
    folds,
    T(catNose, mCat),
    T(catMarks, mCat),
    stripes,
    claws,
    T(jellyRidges, mJelly),
    splash,
    splat,
    ...all([cFace, cBrow], mCH),
    ...all([hatBand, straw], mHatFly),
    T(cRun.patch, mCR),
    ...all([hatBand2, monocle, tFace, tBrow], mTH),
    ...all([vest, bowTie, tRun.hem, tRun.paws], mTR),
  ]),
  once: paths([thump, speed, fright, wobble]),
  fills: [T(catPupils, mCat), T(ell(126.5, 137, 1.8), mCH), T(ell(276.5, 130, 1.8), mTH)].map((d) => `<path d="${d}"/>`).join(''),
  glints: `<path d="${T(ell(-9, -26, 2.5, 6), mJelly)}"/><path d="${T(ell(-2, -38, 2, 1.5), mJelly)}"/>`,
};
