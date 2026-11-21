// Take the train: a little red steam train, an engine pulling two carriages, puffs along a track
// through green hills, while a cow in the field watches it go by.
import { PAL, paths, transformPath, tufts } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;
const rect = (x1, y1, x2, y2) => `M${x1} ${y1}L${x2} ${y1}L${x2} ${y2}L${x1} ${y2}Z`;
/** A window with a rounded top. */
const win = (x, y, w, h) => `M${x} ${y + h}L${x} ${y + 5}Q${x} ${y} ${x + 5} ${y}L${x + w - 5} ${y}Q${x + w} ${y} ${x + w} ${y + 5}L${x + w} ${y + h}Z`;

// Hills, field and track
const farHill = 'M0 128C40 108 92 98 140 112C180 124 214 118 252 102C292 86 344 90 400 112';
const nearHill = 'M0 168C60 150 120 150 170 162';
const rail = 'M0 200L400 200M0 203L400 203';
let sleepers = '';
for (let x = 6; x < 400; x += 17) sleepers += `M${x} 204L${x} 210`;
// Paper left around the train and the cow, so their colours stay clean.
const trainHalo = 'M28 204L28 118Q84 96 134 112Q184 96 232 102L232 98L300 98L312 112L312 94L352 94L354 130L374 204Z';

// Engine, facing right
const cab = rect(236, 110, 280, 172);
const cabWin = win(246, 122, 24, 22);
const cabRoof = 'M228 112Q258 98 288 112L288 116L228 116Z';
const boiler = 'M280 134L338 134C348 134 350 172 338 172L280 172Z';
const smokebox = 'M338 134C330 140 330 166 338 172';
const bands = 'M300 134L300 172M320 134L320 172';
const chimney = 'M322 134L324 112L318 102L346 102L340 112L340 134Z';
const dome = 'M296 134C296 122 312 122 312 134Z';
const footplate = 'M232 172L354 172L354 178L232 178Z';
const cowcatcher = 'M350 178L372 198L350 198Z';
const wheels = [
  [256, 185, 15],
  [292, 185, 15],
  [330, 190, 10],
  [154, 190, 10],
  [206, 190, 10],
  [54, 190, 10],
  [106, 190, 10],
];
const wheelRims = wheels.map(([x, y, r]) => dot(x, y, r)).join('');
const hubs = wheels.map(([x, y, r]) => `${dot(x, y, r * 0.3)}M${x - r * 0.7} ${y}L${x + r * 0.7} ${y}M${x} ${y - r * 0.7}L${x} ${y + r * 0.7}`).join('');
const rod = 'M256 190L292 190';

// Two carriages
const carriage = (x) => ({
  body: rect(x, 122, x + 88, 180),
  roof: `M${x - 6} 122Q${x + 44} 104 ${x + 94} 122Z`,
  windows: `${win(x + 10, 132, 18, 20)}${win(x + 35, 132, 18, 20)}${win(x + 60, 132, 18, 20)}`,
  trim: `M${x} 164L${x + 88} 164M${x} 168L${x + 88} 168`,
  under: rect(x + 4, 180, x + 84, 184),
});
const c1 = carriage(138);
const c2 = carriage(38);
const couplings = 'M226 176L236 176M126 176L138 176';

// Steam puffs drifting back, and speed lines behind
const puff = (cx, cy, r) =>
  `M${f(cx - r)} ${f(cy + r * 0.3)}C${f(cx - r * 1.3)} ${f(cy - r * 0.5)} ${f(cx - r * 0.5)} ${f(cy - r * 1.1)} ${f(cx)} ${f(cy - r * 0.8)}C${f(cx + r * 0.4)} ${f(cy - r * 1.3)} ${f(cx + r * 1.3)} ${f(cy - r * 0.9)} ${f(cx + r * 1.05)} ${f(cy - r * 0.1)}C${f(cx + r * 1.5)} ${f(cy + r * 0.4)} ${f(cx + r * 0.9)} ${f(cy + r * 1.05)} ${f(cx + r * 0.2)} ${f(cy + r * 0.8)}C${f(cx - r * 0.3)} ${f(cy + r * 1.1)} ${f(cx - r * 1.1)} ${f(cy + r)} ${f(cx - r)} ${f(cy + r * 0.3)}Z`;
const puffs = `${puff(330, 86, 11)}${puff(302, 66, 15)}${puff(262, 50, 18)}${puff(220, 40, 14)}`;
const speed = 'M6 132L26 132M2 148L22 148M8 164L26 164M210 30l-24 0M206 46l-18 0';

// The cow, facing right, looking up at the train (drawn at the left edge, then moved into the field)
const CW = (d) => transformPath(d, 'translate(18 0)');
// Paper left around the cow, so its patches and pink nose stay clean.
const cowHalo = CW('M30 284C28 262 30 246 36 240C44 230 70 228 100 234C104 220 122 210 140 218C154 226 156 244 146 252C134 258 120 256 112 264L111 298L84 298L84 282L74 282L74 298L44 298L42 286Z');
const cowBody = CW('M42 248C42 236 56 232 72 234C86 232 98 233 104 240C110 246 110 262 104 270C94 276 60 276 50 272C42 268 40 258 42 248Z');
const cowHead = CW('M100 244C100 232 108 224 118 222C126 220 134 222 138 226L146 232C150 236 148 246 142 248C136 250 130 248 124 250C114 254 104 254 100 244Z');
const muzzle = CW('M136 225C144 226 150 234 148 242C146 248 138 250 132 246C130 238 130 230 136 225Z');
const ear = CW('M108 228C100 222 92 222 90 226C94 232 102 232 108 232Z');
const earIn = CW('M104 228C99 225 95 225 94 227C97 230 101 230 104 230Z');
const horn = CW('M113 223C113 219 115 216 119 215');
const face = CW('M136 247q4 2 8 -1');
const legShape = CW('M62 268L70 268L69 292L63 292ZM86 268L94 268L93 292L87 292ZM48 266L57 266L56 294L49 294ZM98 266L107 266L106 294L99 294Z');
const cowHooves = CW('M63 288L69 288L69 292L63 292ZM87 288L93 288L93 292L87 292ZM49 290L56 290L56 294L49 294ZM99 290L106 290L106 294L99 294Z');
const cowTail = CW('M44 246C36 250 34 262 36 274');
const tailTuft = CW('M33 272C32 278 36 283 40 281C41 277 39 272 36 272Z');
const patches = CW('M60 238C70 236 78 242 76 250C74 258 62 258 58 252C54 246 56 240 60 238ZM86 252C96 250 102 258 100 264C96 270 84 268 82 262C80 256 82 252 86 252ZM102 236C106 230 112 230 114 236C112 242 106 244 102 240Z');
const udder = CW('M74 274C76 280 86 280 88 274Z');

export default {
  title: 'Take the train',
  seed: 229,
  washes: [
    { c: PAL.green, o: 0.32, d: `${farHill}L400 300L0 300Z${trainHalo}${cowHalo}`, rule: 'evenodd' },
    { c: PAL.green, o: 0.3, d: `${nearHill}L170 200L0 200Z` },
    { c: PAL.green, o: 0.38, d: `M0 196L400 196L400 300L0 300Z${cowHalo}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.45, d: 'M0 199L400 199L400 211L0 211Z' },
    { c: PAL.grey, o: 0.35, d: puffs },
    { c: PAL.red, o: 0.85, d: `${cab}${cabWin}`, rule: 'evenodd' },
    { c: PAL.red, o: 0.85, d: `${boiler}${c1.body}${c1.windows}${c2.body}${c2.windows}`, rule: 'evenodd' },
    { c: PAL.sky, o: 0.35, d: `${cabWin}${c1.windows}${c2.windows}` },
    { c: PAL.slate, o: 0.6, d: `${cabRoof}${c1.roof}${c2.roof}${chimney}` },
    { c: PAL.ink, o: 0.55, d: `${footplate}${cowcatcher}${c1.under}${c2.under}` },
    { c: PAL.slate, o: 0.55, d: wheelRims },
    { c: PAL.ochre, o: 0.85, d: `${dome}M298 134L302 134L302 172L298 172ZM318 134L322 134L322 172L318 172Z${rect(138, 164, 226, 168)}${rect(38, 164, 126, 168)}` },
    // cow
    { c: PAL.ink, o: 0.75, d: `${patches}${tailTuft}${cowHooves}` },
    { c: PAL.rose, o: 0.75, d: `${muzzle}${udder}${earIn}` },
    { c: PAL.green, o: 0.45, d: CW('M30 292C40 286 116 286 126 294C112 299 40 299 30 292Z') },
  ],
  lines: paths([
    farHill,
    rail,
    cab,
    cabRoof,
    boiler,
    chimney,
    dome,
    cowcatcher,
    c1.body,
    c1.roof,
    c2.body,
    c2.roof,
    wheelRims,
    cowBody,
    cowHead,
    cowTail,
    legShape,
  ]),
  fine: paths([
    nearHill,
    sleepers,
    cabWin,
    smokebox,
    bands,
    footplate,
    c1.windows,
    c2.windows,
    c1.trim,
    c2.trim,
    c1.under,
    c2.under,
    couplings,
    hubs,
    rod,
    puffs,
    muzzle,
    ear,
    horn,
    patches,
    udder,
    tailTuft,
    face,
    earIn,
    tufts([[146, 290], [30, 292], [170, 240], [250, 252], [340, 236], [380, 270], [210, 280], [300, 284]], 9, 11),
  ]),
  once: `<path d="${speed}" stroke-dasharray="10 4"/>`,
  fills: `<path d="${CW(`${dot(121.5, 231, 2.3)}${dot(144, 234, 1.3)}`)}"/>`,
  glints: `<path d="${CW(dot(120.8, 230.2, 0.7))}"/>`,
};
