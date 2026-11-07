import { PAL, hatch, paths, tufts } from '../lib.mjs';

// Off to town: the farmer's cart bumps along the road behind a trotting horse, and the two mice
// peek out of the basket of cabbages at the back, straw hat and top hat.

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

// ---- The two heads, as on the cover (1.mjs coordinates) ----
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEars = 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106M118 104C116 88 126 78 136 82C144 88 138 100 126 106';
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const straw = 'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const cFur = cHead + 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106ZM118 104C116 88 126 78 136 82C144 88 138 100 126 106Z';
const cPink = 'M100 100C94 94 94 84 100 84C106 84 107 94 104 100ZM122 98C122 90 128 86 132 88C136 92 132 98 126 100ZM144 141C146 139 149 141 147 144Z';
const cHatW = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118Z';

const tHead = 'M310 146C314 128 304 116 290 116C276 116 266 126 258 138C266 146 280 150 292 150C302 150 308 148 310 146Z';
const tEars = 'M276 128C262 132 252 120 258 110C264 102 274 108 276 116M306 124C318 130 330 120 326 110C322 102 312 106 308 114';
const topHat = 'M278 110L280 58C290 54 304 54 312 58L314 110M280 58C286 64 306 64 312 58M266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const hatBand2 = 'M279 98C290 102 304 102 314 98';
const monocle = 'M272 130C272 122 284 122 284 130C284 138 272 138 272 130Z';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
const tFur = 'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150ZM276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z';
const tPink = 'M262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z';
const tHatW = 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';

// The cart rocks back on a bump: everything on it is tilted about the axle.
const tilt = R(-3, 150, 222);
const K = mover(tilt);
// Both look ahead down the road: Town Mouse is mirrored so he faces right too.
const CM = mover(tilt, T(152, 116), S(0.66), T(-114, -152));
const TM = mover(tilt, T(100, 114), S(-0.66, 0.66), T(-290, -148));

// ---- Cabbages in the wicker basket ----
const rimY = 132;
const dome = (x, top, r) => `M${x - r} ${rimY}C${x - r} ${top} ${x + r} ${top} ${x + r} ${rimY}Z`;
const heads = [dome(68, 96, 22), dome(126, 104, 20), dome(182, 98, 21)].map(K.d);
const cabbageMarks = K.d(
  'M62 112c6 2 10 8 10 18M76 116c-6 4-8 8-7 14M52 124c4-3 9-3 13 1M120 118c6 2 8 6 8 12M132 120c-4 3-6 6-5 10M176 112c6 2 10 8 10 18M190 116c-6 4-8 8-7 14M166 124c4-3 9-3 13 1',
);
// the basket: a woven rim band and sides above the cart rail
const basket = K.d('M44 131C80 137 172 137 206 131M44 131L45 136C80 142 172 142 205 136L206 131M46 136L52 154M204 136L198 154');
const basketW = K.d('M44 131C80 137 172 137 206 131L204 136L198 154L52 154L46 136Z');
const weave = K.d(hatch(50, 139, 200, 139, 20, 6, 62, 21, 0.15) + hatch(54, 146, 198, 146, 19, 6, 118, 22, 0.15) + 'M50 145C90 149 160 149 201 145');
const inBasket = K.d(`M-20 -20L420 -20L420 ${rimY + 3}C172 ${rimY + 9} 80 ${rimY + 9} -20 ${rimY + 3}Z`);

// ---- The cart ----
const box = K.d('M40 154L236 154L232 190L44 190Z');
const planks = K.d('M42 166L234 166M43 178L233 178M96 154L96 190M180 154L180 190');
const wheel = 'M114 222C114 202 130 186 150 186C170 186 186 202 186 222C186 242 170 258 150 258C130 258 114 242 114 222Z';
const wheelIn = 'M122 222C122 206 134 194 150 194C166 194 178 206 178 222C178 238 166 250 150 250C134 250 122 238 122 222Z';
const spokes =
  'M150 194L150 216M150 228L150 250M122 222L144 222M156 222L178 222M130 202L146 218M154 226L170 242M170 202L154 218M146 226L130 242M146 222C146 217 154 217 154 222C154 227 146 227 146 222Z';
const shaft = K.d('M236 168L254 167') + 'M254 163L326 164M253 169L324 170';

// ---- The horse, trotting to the right ----
const hBody = 'M262 152C280 142 320 142 338 152C354 162 354 186 342 196C334 202 318 204 304 202L278 202C262 202 250 192 250 178C250 166 254 156 262 152Z';
const hNeck = 'M314 148C322 128 332 110 344 100M346 168C352 152 356 136 360 124';
const hHead = 'M344 100C350 92 362 94 370 102C378 110 386 118 388 126C390 132 384 136 376 134C368 132 362 128 360 124';
const hEars = 'M348 98L346 84L356 95M354 96L358 83L362 99';
const hFace = 'M381 125c1-3 4-3 4 0M378 133l6-1M352 96c-2 4-6 6-9 6';
const hMane = 'M314 148c-5-1-7-4-7-8M320 136c-5-1-7-4-7-8M326 124c-5-1-7-4-7-8M333 113c-5-1-7-4-6-8M341 104c-4-2-6-5-4-9';
const hLegs =
  'M318 199C320 214 318 232 319 252M328 199C330 214 328 232 329 252M334 197L339 220L351 232M344 196L348 216L358 226M262 196C266 212 260 228 262 252M272 199C276 214 270 230 272 252M278 199C282 214 282 232 286 252M288 198C292 214 292 232 296 252';
const hooves = 'M317 252L331 252L332 258L316 258ZM351 232L358 226L363 231L357 237ZM260 252L274 252L275 258L259 258ZM284 252L298 252L299 258L283 258Z';
const hTail = 'M252 164C238 166 230 178 232 196C233 204 236 210 234 218M252 172C244 178 240 190 242 204';
const tailW = 'M252 164C238 166 230 178 232 196C233 204 236 210 234 218C240 210 242 204 242 204C240 190 244 178 252 172Z';
const collar = 'M314 146C326 150 338 158 344 172M322 140C334 146 346 154 352 166';
const collarW = 'M314 146C326 150 338 158 344 172L352 166C346 154 334 146 322 140Z';

// ---- The road, with bumps and dust ----
const road = 'M6 258C120 255 280 260 394 256';
// a pebble under the wheel gives the cart its bump
const pebble = 'M178 257C177 250 187 248 192 252C195 254 194 257 192 257Z';
const bumps = 'M184 244l-1-6M191 245l3-5M197 250l6-2M30 204l-16 0M34 214l-20 0M28 224l-14 0';
const jolts = 'M36 112c2-5 6-7 11-7M38 100c2-4 5-5 9-5M206 92c5 0 9 2 11 7M204 80c4 0 7 1 9 5';
const dust = 'M98 254c-4-6 2-12 8-8c2-6 12-4 10 4M226 254c-3-5 2-9 6-6c2-4 9-3 8 3';

export default {
  title: 'Off to town in the cabbage cart',
  seed: 54,
  defsExtra:
    `<clipPath id="behind-cabbages"><path clip-rule="evenodd" d="M-20 -20H420V320H-20Z${heads.join('')}"/></clipPath>` +
    `<clipPath id="in-basket"><path d="${inBasket}"/></clipPath>`,
  washes: [
    { c: PAL.grey, o: 0.35, d: 'M6 253C120 250 280 255 394 251L394 266C280 270 120 266 6 268Z' },
    { c: PAL.slate, o: 0.5, d: pebble },
    { c: PAL.sky, o: 0.55, d: box },
    { c: PAL.ochre, o: 0.6, d: wheel + wheelIn, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.55, d: basketW },
    { c: PAL.terracotta, o: 0.6, d: hBody + 'M314 148C322 128 332 110 344 100C350 92 362 94 370 102C378 110 386 118 388 126C390 132 384 136 376 134C368 132 362 128 360 124C356 136 352 152 346 168Z' + 'M318 199C320 214 318 232 319 252L329 252C328 232 330 214 328 199ZM334 197L339 220L351 232L358 226L348 216L344 196ZM262 196C266 212 260 228 262 252L272 252C270 230 276 214 272 199ZM278 199C282 214 282 232 286 252L296 252C292 232 292 214 288 198Z' + 'M348 98L346 84L356 95ZM354 96L358 83L362 99Z' },
    { c: PAL.ochre, o: 0.8, d: tailW + 'M344 100C332 110 322 128 314 148C308 144 305 138 307 132C310 122 318 110 330 102C334 98 340 96 344 100Z' },
    { c: PAL.slate, o: 0.8, d: collarW + hooves },
    { c: PAL.green, o: 0.68, d: heads.join('') },
    // the mice
    { c: PAL.grey, o: 0.7, d: CM.d(cFur) + TM.d(tFur) },
    { c: PAL.rose, o: 0.55, d: CM.d(cPink) + TM.d(tPink) },
    { c: PAL.ochre, o: 0.75, d: CM.d(cHatW) },
    { c: PAL.slate, o: 0.8, d: TM.d(tHatW) },
  ],
  whites: CM.d(ring(125, 138, 5)) + TM.d(ring(279, 131, 5)),
  lines:
    paths([road, pebble, box, wheel, shaft, basket, hBody, hNeck, hHead, hEars, hLegs, hTail]) +
    `<g clip-path="url(#in-basket)">${paths(heads)}</g>` +
    `<g clip-path="url(#behind-cabbages)">${paths([CM.d(cHead), CM.d(cEars), CM.d(strawHat), TM.d(tHead), TM.d(tEars), TM.d(topHat)])}</g>`,
  fine:
    paths([
      planks,
      wheelIn,
      spokes,
      weave,
      cabbageMarks,
      hFace,
      hMane,
      hooves,
      collar,
      bumps,
      jolts,
      dust,
      hatch(20, 266, 380, 264, 16, 6, 160, 5),
      tufts([[12, 256], [244, 257], [388, 255]], 8, 7),
    ]) +
    `<g clip-path="url(#behind-cabbages)">${paths([CM.d(hatBand), CM.d(straw), CM.d(cFace), TM.d(hatBand2), TM.d(monocle), TM.d(tFace)])}</g>`,
  fills: CM.dot(127, 138, 2.6) + TM.dot(277, 131, 2.6) + '<circle cx="365" cy="108" r="2.2"/>',
  glints: CM.dot(128, 137, 0.9) + TM.dot(278, 130, 0.9),
};
