import { PAL, hatch, paths, tufts } from '../lib.mjs';

// Lunch on a big leaf: Country Mouse proudly offers her wheat, hazelnut, blackberry and cheese;
// Town Mouse leans in to poke the blackberry with one fingertip, nose high in the air.

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
// Here: the back paw on her hip, the front paw held out palm up over the lunch, a proud smile.
const cArm = 'M98 168C84 172 78 186 88 198';
const cArmFront = 'M130 172C140 184 148 192 158 196';
const cPaw = 'M158 196C160 190 168 189 171 193C169 198 162 200 158 196ZM171 193l5-3M170 196l6 0';
const cTail = 'M92 238C70 242 54 254 38 246C28 240 32 230 40 234';
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
const tFeet = 'M276 248C270 256 282 259 294 256M300 248C300 256 312 259 322 255';
const tTail = 'M312 238C334 242 346 252 360 246C370 240 364 230 356 234';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
const tFur = 'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150ZM276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z';
const tPink = 'M262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z';
const tHatW = 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const tVestW = 'M278 158C266 178 264 216 270 236C284 240 300 240 314 236C318 210 316 178 306 158L292 190Z';
const tButtons = 'M286 200C286 196 292 196 292 200C292 204 286 204 286 200ZM286 214C286 210 292 210 292 214C292 218 286 218 286 214ZM286 228C286 224 292 224 292 228Z';
// Here: eyes shut and nose up (smug), shoes on the ground, leaning in from the hips.
const tLid = 'M273 130C276 134 282 134 285 130M274 132l-3 2M278 134l-1 3';
const tTrousersW = 'M270 238C268 244 270 248 272 250L312 250C314 246 314 240 314 236C300 240 284 240 270 238Z';
const tShoesW = 'M276 248C270 256 282 259 294 256L292 250ZM300 248C300 256 312 259 322 255L312 249Z';

// Placements
const CM = mover(T(84, 256), S(0.88), T(-117, -256));
const TF = mover(T(328, 256), S(0.88), T(-298, -256));
const TB = mover(T(328, 256), S(0.88), T(-298, -256), R(-11, 291, 250));
const TH = mover(T(328, 256), S(0.88), T(-298, -256), R(-11, 291, 250), R(32, 292, 152));
const P = (x, y) => `${r1(x)} ${r1(y)}`;
const [mx, my] = TH.pt(283, 134);
const [kx, ky] = TB.pt(291, 172);
const cord = `M${P(mx, my)}C${P(mx + 3, my + 10)} ${P(kx + 4, ky - 12)} ${P(kx, ky)}`;
// the poking arm bows out from his shoulder; one fingertip touches the blackberry
const [sx, sy] = TB.pt(280, 168);
const [fx, fy] = [270, 222];
const tPoke = `M${P(sx, sy)}C${P(sx - 16, sy + 4)} ${P(fx - 4, fy - 30)} ${P(fx + 3, fy - 15)}M${P(fx + 3, fy - 15)}c-4-1-8 2-7 6c1 3 5 4 8 1M${P(fx + 1, fy - 7)}L${P(fx, fy)}`;
const tPokePaw = `M${P(fx + 4, fy - 10)}l3 1M${P(fx + 4, fy - 12)}l3 0`;
// the cane, from his back paw down to the ground
const [hx, hy] = TB.pt(324, 204);
const tCane = `M${P(hx, hy)}L${P(hx + 7, 256)}M${P(hx, hy)}C${P(hx - 1, hy - 7)} ${P(hx + 8, hy - 9)} ${P(hx + 10, hy - 3)}`;

// ---- The leaf and the lunch on it ----
// the ground line stops where the leaf lies on it
const ground = 'M8 256C40 255 76 254 104 254M302 255C332 255 362 254 392 253';
const leaf = 'M112 254C134 236 196 226 244 229C268 231 284 239 296 250C284 260 262 268 232 270C188 272 138 268 112 254Z';
const leafStem = 'M134 263C128 267 124 271 117 272';
const veins = 'M116 254C124 253 130 253 136 253M126 258c8 4 16 7 26 8M176 261c8 3 16 5 26 6M242 263c6 2 12 3 18 3M136 249c6-5 12-8 20-10M204 238c4-3 8-5 12-6';
// a little piece of cheese (the cover's wedge, small)
const CH = mover(T(146, 256), S(0.36), T(-192, -256));
const cheese = CH.d('M152 256L244 256L244 206ZM244 206L230 196L140 248L152 256');
const cheeseW = CH.d('M152 256L244 256L244 206L230 196L140 248Z');
const cheeseHoles = CH.d('M206 236C206 228 220 228 220 236C220 244 206 244 206 236ZM226 222C226 216 236 216 236 222C236 228 226 228 226 222ZM186 248C186 244 194 244 194 248');
// grains of wheat
const grain = (x, y, a) => mover(T(x, y), R(a)).d('M-5 0C-5 -4 5 -4 5 0C5 4 -5 4 -5 0ZM-3 0L3 0');
const grains = [grain(184, 252, -20), grain(196, 246, 15), grain(198, 256, -5), grain(210, 250, 35), grain(186, 241, 60)];
// a hazelnut
const nut = 'M232 227C241 228 246 236 246 245C246 254 240 259 232 259C224 259 218 254 218 245C218 236 223 228 232 227Z';
const nutW1 = 'M232 227C241 228 246 236 246 245C238 249 226 249 218 245C218 236 223 228 232 227Z';
const nutW2 = 'M218 245C226 249 238 249 246 245C246 254 240 259 232 259C224 259 218 254 218 245Z';
const nutMarks = 'M232 227l1-4M219 246C226 249 238 249 245 246M223 251l1 2M229 252l0 2M235 252l-1 2M240 250l-1 2M226 233c-2 3-3 7-3 10M238 233c2 3 3 7 3 10';
// a blackberry: a cluster of little drupelets
const drupe = (x, y) => `M${x - 4} ${y}C${x - 4} ${y - 5.2} ${x + 4} ${y - 5.2} ${x + 4} ${y}C${x + 4} ${y + 5.2} ${x - 4} ${y + 5.2} ${x - 4} ${y}Z`;
const berryAt = [
  [262, 230], [270, 228], [278, 231],
  [257, 238], [265, 237], [273, 237], [281, 239],
  [258, 246], [266, 245], [274, 245], [281, 247],
  [263, 253], [271, 253], [278, 253],
];
const berry = 'M253 240C252 229 262 223 270 224C280 225 287 233 286 243C285 253 277 259 269 259C260 259 254 251 253 240Z';
const drupes = berryAt.map(([x, y]) => drupe(x, y)).join('');
const berryStalk = 'M258 226C256 222 252 220 248 220M258 226l-7 1M258 226l-2-6';

export default {
  title: 'Lunch on a leaf',
  seed: 53,
  washes: [
    { c: PAL.grey, o: 0.45, d: 'M6 250C120 246 280 252 394 247L394 266C280 272 120 266 6 268Z' },
    { c: PAL.green, o: 0.68, d: leaf },
    { c: PAL.ochre, o: 0.8, d: cheeseW + grains.join('') },
    { c: PAL.terracotta, o: 0.7, d: nutW1 },
    { c: PAL.ochre, o: 0.6, d: nutW2 },
    { c: PAL.slate, o: 0.92, d: berry },
    { c: PAL.rose, o: 0.45, d: berry },
    // the mice
    { c: PAL.grey, o: 0.7, d: CM.d(cFur) + TH.d(tFur) },
    { c: PAL.rose, o: 0.55, d: CM.d(cPink + ring(117, 147, 4.5, 3.5)) + TH.d(tPink) },
    { c: PAL.ochre, o: 0.75, d: CM.d(cHatW) },
    { c: PAL.green, o: 0.62, d: CM.d(cDress) },
    { c: PAL.red, o: 0.78, d: TB.d(tVestW) },
    { c: PAL.slate, o: 0.8, d: TH.d(tHatW) + TB.d(tTrousersW) + TF.d(tShoesW) },
    { c: PAL.sky, o: 0.75, d: TB.d(bowTie) },
    { c: PAL.ochre, o: 0.85, d: TB.d(tButtons) },
  ],
  whites: CM.d(ring(125, 138, 5)),
  lines: paths([
    ground,
    leaf,
    cheese,
    nut,
    berry,
    CM.d(cHead),
    CM.d(cEars),
    CM.d(strawHat),
    CM.d(cBody),
    CM.d(cArm),
    CM.d(cArmFront),
    CM.d(cFeet),
    CM.d(cTail),
    TH.d(tHead),
    TH.d(tEars),
    TH.d(topHat),
    TB.d(tBody),
    TB.d(tArm),
    TF.d(tFeet),
    TB.d(tTail),
    tPoke,
    tCane,
  ]),
  fine: paths([
    leafStem,
    veins,
    cheeseHoles,
    ...grains,
    nutMarks,
    drupes,
    berryStalk,
    CM.d(hatBand),
    CM.d(straw),
    CM.d(patch),
    CM.d(cFace),
    CM.d(cSmile),
    CM.d(cPaw),
    TH.d(hatBand2),
    TH.d(monocle),
    TH.d(tLid),
    TH.d(tFace),
    cord,
    TB.d(vest),
    TB.d(bowTie),
    tPokePaw,
    hatch(14, 266, 100, 266, 7, 6, 160, 3),
    hatch(304, 264, 390, 262, 6, 6, 160, 4),
    tufts([[16, 255], [388, 254]], 8, 7),
  ]),
  fills: CM.dot(127, 138, 2.4),
  glints: CM.dot(128, 137, 0.8) + berryAt.map(([x, y]) => `<circle cx="${x - 1.5}" cy="${y - 1.8}" r="0.9"/>`).join(''),
};
