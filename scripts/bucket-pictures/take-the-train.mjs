// Take the train: a little red steam train, an engine pulling two carriages, puffs along a track
// through green hills, while a cow in the field watches it go by.
import { PAL, paths, tufts } from '../story-pictures/lib.mjs';

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
const cowHalo = 'M30 238C34 224 64 222 92 224C100 208 132 206 144 218C150 232 140 246 116 252C116 272 110 294 98 296C80 298 48 298 38 290C28 280 26 252 30 238Z';

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
const lamp = 'M342 120L350 120L350 128L342 128Z';
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

// The cow, facing right, looking up at the train
const cowBody = 'M46 244C46 234 58 230 72 232C84 230 96 231 102 236C108 242 108 256 102 264C92 270 62 270 52 266C46 262 44 252 46 244Z';
const cowHead = 'M100 240C98 228 104 220 114 218C122 216 130 218 136 224C140 228 140 236 134 238C128 240 122 242 116 246C108 250 102 248 100 240Z';
const muzzle = 'M126 222C134 220 140 226 139 232C138 238 132 240 127 238C122 234 122 226 126 222Z';
const ear = 'M106 224C100 220 94 220 92 224C96 228 102 228 106 226Z';
const horn = 'M110 218C110 212 114 208 118 208';
const legShape = 'M51 262L57 262L57 287L51 287ZM57 264L63 264L63 289L57 289ZM89 264L95 264L95 289L89 289ZM95 262L101 262L101 287L95 287Z';
const cowHooves = 'M51 284L57 284L57 288L51 288ZM57 286L63 286L63 290L57 290ZM89 286L95 286L95 290L89 290ZM95 284L101 284L101 288L95 288Z';
const cowTail = 'M47 244C40 248 38 258 40 270';
const tailTuft = 'M37 268C36 274 40 278 43 276C44 272 42 268 40 268Z';
const patches = 'M60 236C68 234 76 238 74 246C72 254 62 254 58 248C54 244 56 238 60 236ZM86 248C94 246 100 252 98 258C94 264 84 262 82 256C80 252 82 248 86 248ZM104 222C108 218 114 218 116 222C114 228 108 230 104 226Z';
const udder = 'M74 268C76 274 84 274 86 268Z';

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
    { c: PAL.ochre, o: 0.85, d: `${dome}${lamp}M298 134L302 134L302 172L298 172ZM318 134L322 134L322 172L318 172Z${rect(138, 164, 226, 168)}${rect(38, 164, 126, 168)}` },
    // cow
    { c: PAL.ink, o: 0.75, d: `${patches}${tailTuft}${cowHooves}` },
    { c: PAL.rose, o: 0.75, d: `${muzzle}${udder}` },
    { c: PAL.green, o: 0.45, d: 'M30 288C40 280 110 280 122 288C112 296 40 296 30 288Z' },
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
    lamp,
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
    'M131 229l2 1M131 233l2 1',
    tufts([[130, 290], [24, 292], [170, 240], [250, 252], [340, 236], [380, 270], [210, 280], [300, 284]], 9, 11),
  ]),
  once: `<path d="${speed}" stroke-dasharray="10 4"/>`,
  fills: `<path d="${dot(117, 226, 2)}"/>`,
};
