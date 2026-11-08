import { PAL, hatch, paths, transformPath, tufts } from '../lib.mjs';
import { elephant, f, limb } from './1.mjs';

// The Elephant's Child, 2: the little elephant looks up and asks the tall Giraffe a question; the
// Giraffe bends her long neck and frowns down at him.
const ET = 'translate(104 262) scale(1.12)';
const el = elephant(ET, { look: [1, -1.6] });

// his question, drawn as a scratchy "?" above his head
const QT = 'translate(150 112) rotate(10) scale(1.3)';
const question = 'M-6 -10C-6 -18 8 -19 8 -10C8 -4 1 -3 1 4';

// The Giraffe, standing on the right (picture coordinates)
const body = 'M314 150C334 140 364 140 378 150C388 158 388 176 378 184C364 191 344 192 326 190C316 191 306 190 298 186C290 182 288 172 290 164';
const neckPts = [[302, 166, 26], [284, 132, 17], [266, 106, 13], [254, 94, 12]];
const neck = limb(neckPts, true);
const neckWash = limb(neckPts);
const legAt = (x, lean) => limb([[x, 182, 12], [x + lean * 0.4, 222, 8], [x + lean, 260, 8]]);
const legs = [legAt(300, -4), legAt(318, 2), legAt(358, -2), legAt(374, 4)];
const hooves = 'M291 262l10 0M314 262l11 0M351 262l10 0M373 262l11 0';
const tail = 'M384 156C392 166 394 180 391 196';
const tailTuft = 'M391 196C386 202 388 210 392 212C396 208 397 201 391 196Z';
const mane = hatch(308, 150, 260, 98, 9, 7, -50, 3, 0.3);

// her head (own coordinates, muzzle to the left), bent down towards the little elephant
const HT = 'translate(250 92) rotate(-32) scale(1.4) translate(-12 2)';
const head = 'M14 -10C8 -16 -6 -14 -16 -7C-26 0 -32 4 -30 10C-28 15 -18 14 -8 12C4 10 14 6 16 0';
const ossicones = 'M7 -11L5 -23M13 -9L15 -21';
const ear = 'M15 -5C22 -11 29 -9 31 -5C27 -1 21 -1 16 -1';
const eye = 'M-3 -3L7 -4.5C8 -1 5 2 2 2C-1 2 -3 0 -3 -3Z';
const lid = 'M-4 -2.8L8 -4.7';
const brow = 'M-7 -6L9 -11';
const mouth = 'M-27 12Q-22 8 -15 12';
const nostril = 'M-27 3l3 1';
const headWash = head + 'Z' + ear + 'Z';

// her patches (picture coordinates)
const patch = (x, y, s) => `M${x} ${y}C${x + 6 * s} ${y - 5 * s} ${x + 13 * s} ${y - 2 * s} ${x + 12 * s} ${y + 5 * s}C${x + 11 * s} ${y + 11 * s} ${x + 3 * s} ${y + 12 * s} ${x - 1 * s} ${y + 7 * s}C${x - 3 * s} ${y + 4 * s} ${x - 2 * s} ${y + 1 * s} ${x} ${y}Z`;
const patches = [
  [320, 152, 1.3], [342, 150, 1.2], [362, 156, 1.1], [330, 170, 1.1], [352, 172, 1.2], [304, 168, 1],
  [288, 132, 0.9], [272, 116, 0.8], [258, 104, 0.6], [298, 148, 0.8],
].map(([x, y, s]) => patch(x, y, s)).join('');

const P = (x, y, t) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);
const [gx, gy] = P(2.5, -1, HT);
const knob = (x, y) => P(x, y, HT);

const ground = 'M14 262C90 258 180 264 260 260C320 257 360 261 392 259';

export default {
  title: 'The little elephant asks the Giraffe a question',
  seed: 62,
  washes: [
    { c: PAL.green, o: 0.38, d: 'M12 258C90 254 180 260 260 256C320 253 360 257 394 255L394 278C330 284 240 274 160 280C90 284 40 276 12 278Z' },
    ...el.washes,
    { c: PAL.ochre, o: 0.62, d: 'M314 150C334 140 364 140 378 150C388 158 388 176 378 184C350 194 316 192 298 186C290 182 288 172 290 164Z' + neckWash + 'Z' + legs.join('Z') + 'Z' },
    { c: PAL.ochre, o: 0.62, t: HT, d: headWash },
    { c: PAL.terracotta, o: 0.6, d: patches },
    { c: PAL.terracotta, o: 0.7, d: tailTuft },
    { c: PAL.terracotta, o: 0.6, d: 'M308 150L262 96L258 104L302 156Z' },
  ],
  whites: el.whites + transformPath(eye, HT),
  lines: el.lines + paths([question], QT) + paths([body, neck, ...legs, tail, tailTuft, ground]) + paths([head, ossicones, ear, brow, lid], HT),
  fine:
    el.fine +
    paths([hooves, mane, tufts([[30, 262], [196, 262], [252, 261], [384, 259]], 9, 7), hatch(60, 276, 340, 274, 12, 6, 165, 2)]) +
    paths([eye, mouth, nostril], HT),
  fills:
    el.fills +
    `<circle cx="${f(P(1, 4, QT)[0])}" cy="${f(P(1, 13, QT)[1])}" r="2.6"/>` +
    `<circle cx="${f(gx)}" cy="${f(gy)}" r="2.2"/>` +
    `<circle cx="${f(knob(5, -23)[0])}" cy="${f(knob(5, -23)[1])}" r="3.2"/><circle cx="${f(knob(15, -21)[0])}" cy="${f(knob(15, -21)[1])}" r="3.2"/>`,
  glints: el.glints,
};
