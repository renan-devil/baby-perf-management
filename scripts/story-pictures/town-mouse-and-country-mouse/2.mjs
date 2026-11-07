import { PAL, hatch, paths, tufts } from '../lib.mjs';

// Town Mouse arrives at Country Mouse's round door under the roots of the old apple tree. She waves
// him in, broom in paw; he tips his nose up and wrinkles it.

// The mice keep the cover's coordinates (1.mjs) and are moved by mapping their path data, so the
// ink keeps the book's line weight at every size (a transform with a non-scaling stroke would not).
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
const T = (x, y) => [1, 0, 0, 1, x, y];
const S = (sx, sy = sx) => [sx, 0, 0, sy, 0, 0];
const R = (deg, cx = 0, cy = 0) => {
  const a = (deg * Math.PI) / 180;
  return mul(T(cx, cy), mul([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0], T(-cx, -cy)));
};
const r1 = (n) => Math.round(n * 10) / 10;
function mover(...ms) {
  const m = ms.reduce(mul);
  const pt = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const lin = (x, y) => [m[0] * x + m[2] * y, m[1] * x + m[3] * y];
  const d = (path) => {
    const tk = path.match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g);
    let out = '';
    let c = '';
    for (let i = 0; i < tk.length; ) {
      if (/[A-Za-z]/.test(tk[i])) c = tk[i++];
      else if (c === 'M') c = 'L';
      else if (c === 'm') c = 'l';
      if (c === 'Z' || c === 'z') {
        out += 'Z';
        continue;
      }
      const n = { M: 1, L: 1, T: 1, Q: 2, S: 2, C: 3 }[c.toUpperCase()];
      if (!n) throw new Error(`unsupported path command ${c}`);
      const f = c === c.toUpperCase() ? pt : lin;
      out += c;
      for (let k = 0; k < n; k++) {
        const [x, y] = f(+tk[i++], +tk[i++]);
        out += `${k ? ' ' : ''}${r1(x)} ${r1(y)}`;
      }
    }
    return out;
  };
  const k = Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
  const dot = (x, y, r) => {
    const [a, b] = pt(x, y);
    return `<circle cx="${r1(a)}" cy="${r1(b)}" r="${r1(r * k)}"/>`;
  };
  return { d, pt, k, dot };
}
const ring = (cx, cy, rx, ry = rx) =>
  `M${cx - rx} ${cy}C${cx - rx} ${cy - ry * 1.3} ${cx + rx} ${cy - ry * 1.3} ${cx + rx} ${cy}C${cx + rx} ${cy + ry * 1.3} ${cx - rx} ${cy + ry * 1.3} ${cx - rx} ${cy}Z`;

// ---- Country Mouse, as on the cover (facing right, feet at 117,256) ----
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEars = 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106M118 104C116 88 126 78 136 82C144 88 138 100 126 106';
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cBody = 'M98 156C86 178 84 222 92 248L134 248C142 222 138 180 128 156';
const patch = 'M102 206L118 204L120 220L104 222ZM104 206l2 3M110 205l1 3M116 204l1 3M105 220l1-3M111 221l1-3';
const cFeet = 'M96 248C90 256 102 259 114 256M124 248C124 256 134 259 144 255';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const cFur = cHead + 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106ZM118 104C116 88 126 78 136 82C144 88 138 100 126 106Z';
const cPink = 'M100 100C94 94 94 84 100 84C106 84 107 94 104 100ZM122 98C122 90 128 86 132 88C136 92 132 98 126 100ZM144 141C146 139 149 141 147 144Z';
const cHatW = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';
const cDress = 'M98 158C86 180 86 222 92 248L134 248C142 222 138 180 128 158C120 162 106 162 98 158Z';
// Here: a broom in the back paw, the front paw held out in welcome, a smile and a rosy cheek.
const broom = 'M60 108L72 228';
const bristles = 'M64 226C60 236 56 246 52 257C64 259 78 259 88 256C84 246 80 236 78 228';
const bristleMarks = 'M64 226L78 228M66 234L61 255M71 235L70 257M75 235L81 255';
const cArm = 'M98 170C88 178 78 186 72 192M76 198C68 198 66 190 72 188';
const cArmFront = 'M130 172C140 182 150 182 160 174';
const cPaw = 'M160 174l5-7M161 176l8-3M161 178l8 1';
const cTail = 'M92 234C80 228 72 214 60 208C48 202 38 210 42 218C46 224 54 220 52 214';
const cSmile = 'M127 149Q133 152 138 147';

// ---- Town Mouse, as on the cover (facing left, feet at 298,256) ----
const tHead = 'M310 146C314 128 304 116 290 116C276 116 266 126 258 138C266 146 280 150 292 150C302 150 308 148 310 146Z';
const tEars = 'M276 128C262 132 252 120 258 110C264 102 274 108 276 116M306 124C318 130 330 120 326 110C322 102 312 106 308 114';
const topHat = 'M278 110L280 58C290 54 304 54 312 58L314 110M280 58C286 64 306 64 312 58M266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const hatBand2 = 'M279 98C290 102 304 102 314 98';
const monocle = 'M272 130C272 122 284 122 284 130C284 138 272 138 272 130Z';
const tBody = 'M276 152C264 174 262 220 270 248L312 248C320 220 318 180 306 152';
const vest = 'M279 160L292 190L305 160M270 234C282 238 302 238 314 234';
const bowTie = 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z';
const tArm = 'M306 172C318 182 322 192 322 200M322 200C328 200 330 206 324 208';
const cane = 'M324 204L334 256M324 204C324 196 334 194 336 200';
const tFeet = 'M276 248C270 256 282 259 294 256M300 248C300 256 312 259 322 255';
const tTail = 'M312 238C334 242 346 252 360 246C370 240 364 230 356 234';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
const tFur = 'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150ZM276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z';
const tPink = 'M262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z';
const tHatW = 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const tLegsW = 'M270 238C268 244 270 248 272 250L312 250C314 246 314 240 314 236C300 240 284 240 270 238ZM276 248C270 256 282 259 294 256L292 250ZM300 248C300 256 312 259 322 255L312 249Z';
const tVestW = 'M278 158C266 178 264 216 270 236C284 240 300 240 314 236C318 210 316 178 306 158L292 190Z';
const tButtons = 'M286 200C286 196 292 196 292 200C292 204 286 204 286 200ZM286 214C286 210 292 210 292 214C292 218 286 218 286 214ZM286 228C286 224 292 224 292 228Z';
// Here: a sniffy half-lidded eye and a wrinkled nose.
const tLid = 'M273 130C276 128 282 128 285 130';
const tWrinkles = 'M261 129q4 0 6 4M265 125q4 0 6 4M269 121q4 0 5 4';

// Placements: Country Mouse by her door, Town Mouse on the path, both a little smaller than on the cover.
const CM = mover(T(206, 256), S(0.8), T(-117, -256));
const TB = mover(T(332, 256), S(0.8), T(-298, -256));
const TH = mover(T(332, 256), S(0.8), T(-298, -256), R(12, 292, 150));
const [mx, my] = TH.pt(283, 134);
const [kx, ky] = TB.pt(291, 172);
const cord = `M${r1(mx)} ${r1(my)}C${r1(mx + 3)} ${r1(my + 10)} ${r1(kx + 4)} ${r1(ky - 12)} ${r1(kx)} ${r1(ky)}`;

// ---- The old apple tree, its round door and the moss bed inside ----
const ground = 'M8 256C120 252 280 258 392 253';
const crown =
  'M-6 62C-10 36 10 16 36 20C50 4 88 2 104 14C122 2 162 4 176 18C200 8 240 18 242 42C258 52 252 76 232 78C222 90 198 92 186 82C172 94 146 94 134 84C120 94 98 92 90 84C74 94 50 90 40 82C24 90 -2 84 -6 62Z';
const trunk = 'M32 84C27 112 25 140 24 163M18 236C13 245 5 249 -6 250M112 84C108 120 110 170 116 204C120 230 132 246 150 254';
const branches = 'M54 84C58 74 64 66 72 60M90 86C94 76 102 68 112 64';
const doorway = 'M36 256L36 186C36 150 92 150 92 186L92 256';
const doorLeaf = 'M36 156C27 160 20 172 18 188L18 254L36 256';
const doorMarks = 'M25 164L25 254M30 160L30 255M21 206C21 202 27 202 27 206C27 210 21 210 21 206Z';
const bed = 'M40 256C38 240 48 232 62 235C76 230 90 238 88 256';
const pillow = 'M44 239C42 230 58 228 62 234C64 239 50 243 44 239Z';
const mossMarks = 'M54 248c2-2 4-2 5 0M68 242c2-2 4-2 5 0M78 249c2-2 4-2 5 0M64 252c2-2 4-2 5 0M48 252c2-2 4-2 5 0';
// an acorn-cup cup on the doorstep
const acorn = 'M96 244C96 258 116 258 116 244C110 241 102 241 96 244ZM105 256l0 3';
const acornMarks = 'M99 247l3 3M103 246l3 3M107 246l3 3M111 247l2 3M100 251l3 2M106 251l3 2';
const bark = 'M98 116c-3 8-3 16 0 22M40 124c3 6 3 12 0 18M104 168c-2 5-2 10 0 14';
const apple = (x, y) => `M${x} ${y - 7}C${x - 9} ${y - 11} ${x - 11} ${y + 6} ${x} ${y + 8}C${x + 11} ${y + 6} ${x + 9} ${y - 11} ${x} ${y - 7}Z`;
const apples = [apple(50, 66), apple(140, 70), apple(204, 64), apple(112, 40)];
const stems = 'M50 59l-1-5M140 63l1-5M204 57l0-5M112 33l1-5';
const leafMarks = 'M24 44c3-5 8-5 10 0M76 30c3-5 8-5 10 0M150 34c3-5 8-5 10 0M196 36c3-5 8-5 10 0M168 60c3-5 8-5 10 0M80 64c3-5 8-5 10 0';

export default {
  title: 'Town Mouse comes to visit',
  seed: 52,
  washes: [
    { c: PAL.grey, o: 0.45, d: 'M6 250C120 246 280 252 394 247L394 266C280 272 120 266 6 268Z' },
    { c: PAL.green, o: 0.55, d: crown },
    // trunk, with the doorway left out so the inside reads as an opening
    {
      c: PAL.ochre,
      o: 0.5,
      rule: 'evenodd',
      d: 'M32 84C26 120 26 170 22 204C18 228 10 244 -6 250L-6 262L152 262C132 246 120 230 116 204C110 170 108 120 112 84Z' + doorway + 'Z',
    },
    // a warm glow inside, around the moss bed
    { c: PAL.ochre, o: 0.5, rule: 'evenodd', d: doorway + 'Z' + bed + 'Z' },
    { c: PAL.terracotta, o: 0.35, rule: 'evenodd', d: doorway + 'Z' + bed + 'Z' },
    { c: PAL.terracotta, o: 0.65, d: doorLeaf + 'Z' + acorn },
    { c: PAL.green, o: 0.8, d: bed + 'Z' },
    { c: PAL.red, o: 0.8, d: apples.join('') },
    // the mice
    { c: PAL.grey, o: 0.7, d: CM.d(cFur) + TH.d(tFur) },
    { c: PAL.rose, o: 0.55, d: CM.d(cPink + ring(117, 147, 4.5, 3.5)) + TH.d(tPink) },
    { c: PAL.ochre, o: 0.75, d: CM.d(cHatW + bristles + 'Z') },
    { c: PAL.green, o: 0.62, d: CM.d(cDress) },
    { c: PAL.red, o: 0.78, d: TB.d(tVestW) },
    { c: PAL.slate, o: 0.8, d: TH.d(tHatW) + TB.d(tLegsW) },
    { c: PAL.sky, o: 0.75, d: TB.d(bowTie) },
    { c: PAL.ochre, o: 0.85, d: TB.d(tButtons) },
  ],
  whites: pillow + CM.d(ring(125, 138, 5)) + TH.d('M274 130C274 137 284 137 284 130Z'),
  lines: paths([
    ground,
    crown,
    trunk,
    doorway,
    doorLeaf,
    bed,
    acorn,
    ...apples,
    CM.d(cHead),
    CM.d(cEars),
    CM.d(strawHat),
    CM.d(cBody),
    CM.d(cArm),
    CM.d(cArmFront),
    CM.d(broom),
    CM.d(bristles),
    CM.d(cFeet),
    CM.d(cTail),
    TH.d(tHead),
    TH.d(tEars),
    TH.d(topHat),
    TB.d(tBody),
    TB.d(tArm),
    TB.d(cane),
    TB.d(tFeet),
    TB.d(tTail),
  ]),
  fine: paths([
    branches,
    bark,
    doorMarks,
    pillow,
    mossMarks,
    acornMarks,
    stems,
    leafMarks,
    CM.d(hatBand),
    CM.d(straw),
    CM.d(patch),
    CM.d(cFace),
    CM.d(cSmile),
    CM.d(cPaw),
    CM.d(bristleMarks),
    TH.d(hatBand2),
    TH.d(monocle),
    TH.d(tLid),
    TH.d(tWrinkles),
    TH.d(tFace),
    cord,
    TB.d(vest),
    TB.d(bowTie),
    hatch(20, 266, 130, 266, 9, 6, 160, 3),
    hatch(250, 264, 380, 262, 9, 6, 160, 4),
    tufts([[180, 255], [392, 254]], 8, 7),
  ]),
  fills: CM.dot(127, 138, 2.4) + TH.dot(277, 132.5, 2),
  glints: CM.dot(128, 137, 0.8),
};
