import { PAL, hatch, paths, tufts } from '../lib.mjs';

// Goodbye: Country Mouse, her little bundle on a stick over her shoulder, waves politely.
// Town Mouse flings out his paws in disbelief (his monocle pops out), offering a bowl of cream:
// "But you haven't even tried the cream!" The two stand just as they do on the cover.

const f1 = (n) => Math.round(n * 10) / 10;
const ell = (x, y, rx, ry = rx) => {
  const [kx, ky] = [rx * 0.552, ry * 0.552];
  const p = (...n) => n.map(f1).join(' ');
  return `M${p(x - rx, y)}C${p(x - rx, y - ky, x - kx, y - ry, x, y - ry)}C${p(x + kx, y - ry, x + rx, y - ky, x + rx, y)}C${p(x + rx, y + ky, x + kx, y + ry, x, y + ry)}C${p(x - kx, y + ry, x - rx, y + ky, x - rx, y)}Z`;
};

const floor = 'M8 256C120 252 280 258 392 253';

// --- Country Mouse (left, facing right), as on the cover
const cHead = 'M92 150C88 134 98 122 112 122C126 122 136 132 144 144C136 152 122 156 110 156C100 156 94 154 92 150Z';
const cEars = 'M100 106C88 98 88 80 100 78C110 77 114 92 108 106M118 104C116 88 126 78 136 82C144 88 138 100 126 106';
const strawHat = 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118';
const hatBand = 'M95 114C106 118 122 118 133 113';
const cBody = 'M98 156C86 178 84 222 92 248L134 248C142 222 138 180 128 156';
const patch = 'M102 206L118 204L120 220L104 222ZM104 206l2 3M110 205l1 3M116 204l1 3M105 220l1-3M111 221l1-3';
const cFeet = 'M96 248C90 256 102 259 114 256M124 248C124 256 134 259 144 255';
const cTail = 'M92 238C70 242 54 254 38 246C28 240 32 230 40 234';
const cFace = 'M144 141l12-4M145 145l13 0M144 149l12 4';
const cSmile = 'M133 150C136 153 140 152 142 149';
// her front paw waves; her back paw holds the stick on her shoulder, with the bundle behind
const cWave = 'M131 172C142 164 152 150 156 134';
const cWavePaw = 'M156 134C152 128 156 121 162 123C166 126 164 133 156 134Z';
const waveMarks = 'M170 118c4 3 6 8 5 13M176 110c6 4 9 11 8 18M150 112c-3 4-4 9-2 14';
const cBackArm = 'M100 170C94 176 92 168 96 160';
const stick = 'M114 182L58 120';
const bundle = 'M60 124C44 124 36 140 40 154C44 166 70 168 76 156C82 144 76 126 60 124ZM60 124L53 115M60 124L66 114';
const bundleWash = 'M60 124C44 124 36 140 40 154C44 166 70 168 76 156C82 144 76 126 60 124ZM60 124L53 115L57 113ZM60 124L66 114L69 117Z';
const bundleFolds = 'M48 132C52 142 52 152 48 160M64 130C68 140 70 150 68 160';

// --- Town Mouse (right, facing left), as on the cover
const tHead = 'M310 146C314 128 304 116 290 116C276 116 266 126 258 138C266 146 280 150 292 150C302 150 308 148 310 146Z';
const tEars = 'M276 128C262 132 252 120 258 110C264 102 274 108 276 116M306 124C318 130 330 120 326 110C322 102 312 106 308 114';
const topHat = 'M278 110L280 58C290 54 304 54 312 58L314 110M280 58C286 64 306 64 312 58M266 112C278 104 314 104 326 112C314 119 278 119 266 112Z';
const hatBand2 = 'M279 98C290 102 304 102 314 98';
const tBody = 'M276 152C264 174 262 220 270 248L312 248C320 220 318 180 306 152';
const vest = 'M279 160L292 190L305 160M270 234C282 238 302 238 314 234';
const bowTie = 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z';
const tFeet = 'M276 248C270 256 282 259 294 256M300 248C300 256 312 259 322 255';
const tTail = 'M312 238C334 242 346 252 360 246C370 240 364 230 356 234';
const tFace = 'M258 135l-12-4M257 139l-13 0M258 143l-12 4';
// "But you haven't even tried the cream!": eyes wide, mouth open, monocle popped out on its cord
const tBrow = 'M271 120C274 117 281 117 285 120';
const tMouth = 'M261 145C262 151 269 151 270 146';
const cord = 'M282 136C288 150 292 162 292 172';
const monocleOut = ell(293, 178, 6);
// his paws flung out: one offers a little bowl of cream, the other spreads wide
const tArms = 'M276 172C264 174 250 174 238 170M306 170C320 166 332 156 338 146';
const tOpenPaw = 'M338 146C336 140 342 136 346 139C349 142 346 147 340 148';
const fingers = 'M343 137l2-5M347 140l4-3M348 145l5 0';
const bowl = 'M206 160C208 174 236 174 238 160ZM204 160C212 156 232 156 240 160';
const bowlWash = 'M206 160C208 174 236 174 238 160Z';
const cream =
  'M209 159C206 148 214 140 220 142C222 134 232 136 232 144C238 146 238 154 235 159M220 142C222 138 226 136 229 138';
const creamWash = 'M209 159C206 148 214 140 220 142C222 134 232 136 232 144C238 146 238 154 235 159Z';
const bowlPaw = 'M232 170C228 176 236 180 240 175';
const drips = 'M202 170C200 174 200 178 203 178C205 176 204 173 202 170ZM198 186C196 190 196 193 199 193C201 191 200 189 198 186Z';
const surprise = 'M246 104l-8-6M252 94l-4-9M262 90l0-10';

export default {
  title: 'Country Mouse, with her little bag, politely says goodbye to her cousin',
  seed: 91,
  washes: [
    { c: PAL.grey, o: 0.45, d: 'M6 250C120 246 280 252 394 247L394 266C280 272 120 266 6 268Z' },
    // fur, both mice
    {
      c: PAL.grey,
      o: 0.7,
      d:
        cHead +
        'M100 106C88 98 88 80 100 78C110 77 114 92 108 106ZM118 104C116 88 126 78 136 82C144 88 138 100 126 106Z' +
        'M308 146C312 128 304 118 290 118C276 118 266 128 260 138C268 146 280 150 292 150Z' +
        'M276 128C262 132 252 120 258 110C264 102 274 108 276 116ZM306 124C318 130 330 120 326 110C322 102 312 106 308 114Z' +
        cWavePaw +
        'M338 146C336 140 342 136 346 139C349 142 346 147 340 148Z',
    },
    {
      c: PAL.rose,
      o: 0.55,
      d: 'M100 100C94 94 94 84 100 84C106 84 107 94 104 100ZM122 98C122 90 128 86 132 88C136 92 132 98 126 100ZM144 141C146 139 149 141 147 144ZM262 118C260 112 266 110 268 114C270 118 266 120 262 118ZM314 118C318 114 322 112 322 116C320 120 318 120 314 118ZM256 136C254 134 258 132 259 136Z',
    },
    { c: PAL.rose, o: 0.75, d: bundleWash },
    {
      c: PAL.ochre,
      o: 0.75,
      d: 'M76 124C84 115 142 113 150 122C142 129 84 131 76 124ZM94 120C94 104 132 102 134 118ZM286 200C286 196 292 196 292 200C292 204 286 204 286 200ZM286 214C286 210 292 210 292 214C292 218 286 218 286 214ZM286 228C286 224 292 224 292 228Z',
    },
    { c: PAL.ochre, o: 0.22, d: creamWash },
    { c: PAL.green, o: 0.62, d: 'M98 158C86 180 86 222 92 248L134 248C142 222 138 180 128 158C120 162 106 162 98 158Z' },
    { c: PAL.red, o: 0.78, d: 'M278 158C266 178 264 216 270 236C284 240 300 240 314 236C318 210 316 178 306 158L292 190Z' },
    {
      c: PAL.slate,
      o: 0.8,
      d: 'M278 110L280 58C290 54 304 54 312 58L314 110ZM266 112C278 104 314 104 326 112C314 119 278 119 266 112ZM270 238C268 244 270 248 272 250L312 250C314 246 314 240 314 236C300 240 284 240 270 238ZM276 248C270 256 282 259 294 256L292 250ZM300 248C300 256 312 259 322 255L312 249Z',
    },
    { c: PAL.sky, o: 0.75, d: 'M292 156L278 148L278 164ZM292 156L306 148L306 164Z' + bowlWash },
  ],
  whites: 'M120 138C120 132 130 132 130 138C130 144 120 144 120 138Z' + ell(278, 130, 6),
  lines: paths([
    floor,
    cHead,
    cEars,
    strawHat,
    cBody,
    cFeet,
    cTail,
    cWave,
    cWavePaw,
    cBackArm,
    stick,
    bundle,
    tHead,
    tEars,
    topHat,
    tBody,
    tFeet,
    tTail,
    tArms,
    tOpenPaw,
    bowl,
    cream,
    bowlPaw,
  ]),
  fine: paths([
    hatBand,
    patch,
    cFace,
    cSmile,
    bundleFolds,
    hatBand2,
    vest,
    bowTie,
    tFace,
    tBrow,
    tMouth,
    cord,
    monocleOut,
    fingers,
    drips,
    'M84 120l6 4M96 126l4 3M120 126l4 3M136 124l5 3',
    hatch(20, 264, 130, 264, 9, 6, 160, 3),
    hatch(250, 264, 380, 262, 9, 6, 160, 4),
    tufts([[22, 255], [370, 254]], 8, 7),
  ]),
  once: paths([waveMarks, surprise]),
  fills: `<circle cx="127" cy="138" r="2.4"/><circle cx="277" cy="130" r="1.9"/>`,
  glints: `<circle cx="128" cy="137" r="0.8"/><circle cx="278" cy="129" r="0.7"/><circle cx="46" cy="140" r="1.6"/><circle cx="58" cy="152" r="1.6"/><circle cx="70" cy="140" r="1.6"/><circle cx="52" cy="160" r="1.4"/><circle cx="66" cy="160" r="1.4"/>`,
};
