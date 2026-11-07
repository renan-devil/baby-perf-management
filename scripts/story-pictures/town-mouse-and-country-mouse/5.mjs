import { PAL, hatch, paths } from '../lib.mjs';

// The grand dining room: a long table laid with a pink-iced cake, a cheese as big as a cartwheel,
// pears and grapes, a wobbly jelly and a bowl of cream under a sparkling chandelier. The two tiny
// mice stand at the foot of the table and gaze up.

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
// Here: head tipped back to look up, paws clasped in wonder.
const cArms = 'M98 170C94 184 108 192 120 188M130 172C138 182 134 190 126 190';
const cPaws = 'M118 186C118 182 128 182 128 187C128 191 118 191 118 186Z';
// her tail curls up behind her, clear of her cousin's feet
const cTail = 'M92 238C80 238 70 232 68 220C66 208 76 202 82 208C86 212 82 218 78 214';

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
// Here: head tipped back too, one paw held up towards the feast.
const tArmUp = 'M282 168C272 168 262 164 252 158';
const tPawUp = 'M252 158l-5-5M252 158l-7-1M253 159l-5 3';

// Placements: both face the table; Town Mouse is mirrored. Heads tip back about the neck.
const sc = 0.5;
const CB = mover(T(92, 258), S(sc), T(-117, -256));
const CH = mover(T(92, 258), S(sc), T(-117, -256), R(-30, 114, 156));
const TB = mover(T(38, 258), S(-sc * 0.94, sc * 0.94), T(-298, -256));
const TH = mover(T(38, 258), S(-sc * 0.94, sc * 0.94), T(-298, -256), R(28, 292, 152));

// ---- The table ----
const floor = 'M6 258C120 256 280 259 394 257';
// the far edge of the table top only shows between the dishes
const top = 'M118 120L404 120M118 120L130 110L155 110M161 110L194 110M266 110L272 110M318 110L330 110M360 110L368 110';
const cloth = 'M118 120L116 174C122 182 130 182 136 176C142 184 152 184 158 176C164 184 174 184 180 176C186 184 196 184 202 176C208 184 218 184 224 176C230 184 240 184 246 176C252 184 262 184 268 176C274 184 284 184 290 176C296 184 306 184 312 176C318 184 328 184 334 176C340 184 350 184 356 176C362 184 372 184 378 176C384 184 394 184 400 176L404 176';
const folds = 'M136 124L136 172M180 124L180 172M224 124L224 172M268 124L268 172M312 124L312 172M356 124L356 172';
const leg = (x) =>
  `M${x - 3} 182L${x - 3} 190C${x - 9} 194 ${x - 9} 206 ${x - 3} 210L${x - 2} 248C${x - 6} 250 ${x - 6} 256 ${x - 2} 258M${x + 3} 182L${x + 3} 190C${x + 9} 194 ${x + 9} 206 ${x + 3} 210L${x + 2} 248C${x + 6} 250 ${x + 6} 256 ${x + 2} 258`;
const legs = [leg(134), leg(268), leg(392)];
const legW = (x) => `M${x - 3} 182L${x - 3} 190C${x - 9} 194 ${x - 9} 206 ${x - 3} 210L${x - 2} 248C${x - 6} 250 ${x - 6} 256 ${x - 2} 258L${x + 2} 258C${x + 6} 256 ${x + 6} 250 ${x + 2} 248L${x + 3} 210C${x + 9} 206 ${x + 9} 194 ${x + 3} 190L${x + 3} 182Z`;

// ---- The feast ----
// a pink-iced cake on a stand, with a cherry on top
const stand = 'M130 104L190 104M134 104C140 108 180 108 186 104M158 107L158 114M150 120C150 114 166 114 166 120';
const cake = 'M138 104L138 84L182 84L182 104M146 84L146 68L174 68L174 84';
const icing = 'M136 86C136 80 184 80 184 86C182 92 178 92 177 87C175 94 170 94 168 88C165 95 159 95 157 88C154 94 148 94 147 88C145 93 139 93 136 86ZM144 70C144 64 176 64 176 70C174 75 170 75 169 71C167 76 162 76 160 71C158 76 153 76 151 71C149 75 145 75 144 70Z';
const cherry = 'M155 60C155 54 165 54 165 60C165 66 155 66 155 60ZM160 55C160 50 163 47 167 46';
// a cheese as big as a cartwheel, full of holes
const cheese = 'M194 92C194 80 266 80 266 92L266 116C266 128 194 128 194 116ZM194 92C194 104 266 104 266 92';
const cheeseHoles = 'M204 110C204 106 212 106 212 110C212 114 204 114 204 110ZM222 114C222 109 232 109 232 114C232 119 222 119 222 114ZM244 108C244 104 251 104 251 108C251 112 244 112 244 108ZM256 117C256 114 261 114 261 117ZM214 89C214 87 220 87 220 89C220 91 214 91 214 89ZM238 92C238 90 246 90 246 92C246 94 238 94 238 92ZM230 85C230 84 234 84 234 85';
// a fruit bowl with pears and a bunch of grapes
const bowl = 'M272 98C276 112 314 112 318 98ZM290 111L292 116L284 120L306 120L298 116L300 111';
const pear = (x, y) => `M${x} ${y}C${x - 3} ${y + 6} ${x - 10} ${y + 12} ${x - 9} ${y + 20}C${x - 8} ${y + 27} ${x + 8} ${y + 27} ${x + 9} ${y + 20}C${x + 10} ${y + 12} ${x + 3} ${y + 6} ${x} ${y}ZM${x} ${y}l1-5`;
const pears = pear(286, 74) + pear(302, 78);
const grape = (x, y) => `M${x - 3.2} ${y}C${x - 3.2} ${y - 4.2} ${x + 3.2} ${y - 4.2} ${x + 3.2} ${y}C${x + 3.2} ${y + 4.2} ${x - 3.2} ${y + 4.2} ${x - 3.2} ${y}Z`;
const grapeAt = [[312, 96], [318, 97], [315, 102], [321, 103], [318, 108], [323, 110], [320, 115]];
const grapes = grapeAt.map(([x, y]) => grape(x, y)).join('');
// a wobbly red jelly on a plate
const jelly = 'M332 116C330 104 332 92 345 88C358 92 360 104 358 116ZM328 118C334 122 356 122 362 118';
const jellyMarks = 'M338 114C337 106 339 98 343 92M350 114C351 106 350 98 347 92M326 100c-3 3-3 7 0 10M322 98c-4 4-4 10 0 14M364 100c3 3 3 7 0 10M368 98c4 4 4 10 0 14';
// a bowl of cream
const creamBowl = 'M368 104C370 120 396 120 398 104ZM378 117L376 120L390 120L388 117';
const cream = 'M368 104C368 96 374 92 380 94C382 86 392 86 394 94C398 94 400 100 398 104';
const creamMarks = 'M378 99c3-2 6-2 8 1M386 92c-2-2-1-5 1-6';

// ---- The chandelier ----
const chain = 'M270 -2L270 16';
const chand = 'M262 16C262 12 278 12 278 16L276 30C276 36 264 36 264 30ZM264 24C252 32 236 32 228 24M276 24C288 32 304 32 312 24M266 30C258 40 248 40 244 34M274 30C282 40 292 40 296 34';
const candles = 'M225 24L225 14L231 14L231 24M309 24L309 14L315 14L315 24M241 34L241 24L247 24L247 34M293 34L293 24L299 24L299 34M267 13L267 3L273 3L273 13';
const flames = 'M228 13C224 9 227 4 228 2C229 4 232 9 228 13ZM312 13C308 9 311 4 312 2C313 4 316 9 312 13ZM244 23C240 19 243 14 244 12C245 14 248 19 244 23ZM296 23C292 19 295 14 296 12C297 14 300 19 296 23Z';
const crystals = 'M236 30l0 6M236 39C234 39 234 43 236 45C238 43 238 39 236 39ZM304 30l0 6M304 39C302 39 302 43 304 45C306 43 306 39 304 39ZM270 36l0 7M270 46C268 46 268 51 270 53C272 51 272 46 270 46Z';
const sparkle = (x, y, s) => `M${x - s} ${y}L${x + s} ${y}M${x} ${y - s}L${x} ${y + s}`;
const sparkles = sparkle(214, 40, 4) + sparkle(326, 42, 4) + sparkle(252, 56, 3) + sparkle(290, 58, 3) + sparkle(204, 14, 3) + sparkle(338, 16, 3);

export default {
  title: 'The grand dining room',
  seed: 55,
  washes: [
    { c: PAL.grey, o: 0.45, d: 'M6 252C120 250 280 254 394 251L394 266C280 270 120 266 6 268Z' },
    // a soft glow around the chandelier
    { c: PAL.ochre, o: 0.18, d: 'M206 30C206 -6 334 -6 334 30C334 66 206 66 206 30Z' },
    { c: PAL.terracotta, o: 0.55, d: legW(134) + legW(268) + legW(392) },
    // the feast
    { c: PAL.ochre, o: 0.5, d: 'M138 104L138 84L182 84L182 104ZM146 84L146 68L174 68L174 84Z' },
    { c: PAL.rose, o: 0.85, d: icing },
    { c: PAL.red, o: 0.85, d: 'M155 60C155 54 165 54 165 60C165 66 155 66 155 60Z' },
    { c: PAL.ochre, o: 0.85, d: 'M194 92C194 80 266 80 266 92L266 116C266 128 194 128 194 116Z' },
    { c: PAL.green, o: 0.7, d: pears },
    { c: PAL.slate, o: 0.75, d: grapes },
    { c: PAL.rose, o: 0.5, d: grapes },
    { c: PAL.sky, o: 0.6, d: bowl + creamBowl },
    { c: PAL.red, o: 0.75, d: 'M332 116C330 104 332 92 345 88C358 92 360 104 358 116Z' },
    // the chandelier
    { c: PAL.ochre, o: 0.85, d: chand + flames },
    // the mice
    { c: PAL.grey, o: 0.7, d: CH.d(cFur) + TH.d(tFur) },
    { c: PAL.rose, o: 0.55, d: CH.d(cPink) + TH.d(tPink) },
    { c: PAL.ochre, o: 0.75, d: CH.d(cHatW) },
    { c: PAL.green, o: 0.62, d: CB.d(cDress) },
    { c: PAL.red, o: 0.78, d: TB.d(tVestW) },
    { c: PAL.slate, o: 0.8, d: TH.d(tHatW) + TB.d(tLegsW) },
    { c: PAL.sky, o: 0.75, d: TB.d(bowTie) },
    { c: PAL.ochre, o: 0.85, d: TB.d(tButtons) },
  ],
  whites: CH.d(ring(125, 137, 6.5)) + TH.d(ring(279, 130, 6.5)),
  lines: paths([
    floor,
    top,
    cloth,
    ...legs,
    stand,
    cake,
    cheese,
    bowl,
    pears,
    jelly,
    creamBowl,
    cream,
    chand,
    CH.d(cHead),
    CH.d(cEars),
    CH.d(strawHat),
    CB.d(cBody),
    CB.d(cArms),
    CB.d(cPaws),
    CB.d(cFeet),
    CB.d(cTail),
    TH.d(tHead),
    TH.d(tEars),
    TH.d(topHat),
    TB.d(tBody),
    TB.d(tArm),
    TB.d(tArmUp),
    TB.d(cane),
    TB.d(tFeet),
    TB.d(tTail),
  ]),
  fine: paths([
    folds,
    icing,
    cherry,
    cheeseHoles,
    grapes,
    jellyMarks,
    creamMarks,
    chain,
    candles,
    flames,
    crystals,
    sparkles,
    CH.d(hatBand),
    CH.d(straw),
    CB.d(patch),
    CH.d(cFace),
    TH.d(hatBand2),
    TH.d(monocle),
    TH.d(tFace),
    TB.d(tPawUp),
    TB.d(vest),
    hatch(14, 266, 120, 266, 9, 6, 160, 3),
    hatch(150, 266, 384, 264, 14, 6, 160, 4),
  ]),
  fills: CH.dot(127, 134, 3) + TH.dot(277, 127, 3),
  glints:
    CH.dot(128, 133, 1.1) +
    TH.dot(278, 126, 1.1) +
    '<circle cx="341" cy="96" r="1.6"/><circle cx="339" cy="104" r="1"/><circle cx="236" cy="42" r="0.9"/><circle cx="304" cy="42" r="0.9"/><circle cx="270" cy="49" r="0.9"/>',
};
