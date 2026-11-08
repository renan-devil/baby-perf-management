import { PAL, hatch, paths, transformPath, tufts } from '../lib.mjs';
import { E, elephant, f, limb } from './1.mjs';
import { PY, snakeBody } from './3.mjs';

// The Elephant's Child, 4: the great tug of war. The Crocodile, in the river, holds the little
// elephant's nose, which stretches long; the Python, wrapped round his back legs like a rope, pulls him
// the other way. Heave! Funny, not frightening.
const ET = 'translate(158 252)';
const pt = (x, y, t = ET) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);

// his back legs are drawn in two pieces, above and below the python's loop (elephant coordinates)
const loopY = -18;
const backLegBits =
  'M-48 -38L-47.6 -23.5M-47 -12.5L-46 0L-26 0L-25.3 -12.5M-24.4 -23.5L-23 -28' + 'M-10 -27L-10 -23.5M-10 -12.5L-10 -3L-25.5 -3';
// his tail shoots straight up in surprise
const tailUp = 'M-50 -62C-56 -70 -60 -80 -58 -90M-58 -90l-5 -5M-58 -90l0 -7M-58 -90l5 -5';
const frontKnee = E.knees.split('M')[2];
const el = elephant(ET, { nose: [], noseWash: '', look: [1.4, 0.4], skip: ['backLeg', 'farBackLeg', 'knees', 'tail'], extraLines: [backLegBits, tailUp] });

// his nose, stretched from his face to the Crocodile's jaws (picture coordinates)
const [rx, ry] = pt(64, -68.5);
const CT = 'translate(300 196) scale(0.9)';
const nosePts = [[rx, ry, 17], [rx + 18, ry + 7, 13], [rx + 40, ry + 15, 11], [272, 197, 10.5], [300, 196, 9.5]].map((p) => p.map(f));
const nose = limb(nosePts, true);
const noseWash = limb(nosePts);
const stretch = 'M238 182l2 -6M254 186l2 -6M270 188l2 -6M236 206l2 6M252 209l2 6M268 211l2 6';

// the Python: one loop round both back legs, then he stretches out on the bank and pulls, head first
const pyPts = [
  [-10, loopY, 11], [-30, loopY, 11.5], [-50, loopY + 1, 11.5], [-60, -14, 11.5], [-74, -18, 11], [-88, -27, 10.5], [-99, -38, 10],
].map(([x, y, w]) => [...pt(x, y), w]);
const py = snakeBody(pyPts);
const HT = `translate(${pt(-99, -38).join(' ')}) rotate(30) scale(1.25) translate(-6 0)`;

// The Crocodile in the river (own coordinates: facing left, snout tip on the nose at 0, 0)
const croc = {
  top: 'M0 -6C-6 -10 -3 -16 8 -17C26 -19 44 -22 58 -27C58 -42 78 -44 82 -30C88 -26 94 -20 98 -14',
  upperEdge: 'M0 -5.5L58 -5.5C62 -2 62 3 58 5.5',
  lowerEdge: 'M2 5.5L58 5.5',
  chin: 'M2 5.5C-2 10 2 14 10 14',
  teethUp: 'M8 -5.5l3 5l3 -5M20 -5.5l3 5l3 -5M32 -5.5l3 5l3 -5M44 -5.5l3 5l3 -5',
  teethDown: 'M14 5.5l3 -5l3 5M26 5.5l3 -5l3 5M38 5.5l3 -5l3 5',
  nostrils: 'M5 -15q2 -3 4 0',
  eye: 'M62 -31C62 -39 76 -39 76 -31C76 -24 62 -24 62 -31Z',
  brow: 'M60 -42Q68 -48 77 -44',
  ridges: 'M100 11q5 -8 10 0q5 -8 10 0',
};
const crocWash = 'M0 -6C-6 -10 -3 -16 8 -17C26 -19 44 -22 58 -27C58 -42 78 -44 82 -30C88 -26 94 -20 98 -14L100 14L10 14C2 14 -2 10 2 5.5Z M100 11q5 -8 10 0q5 -8 10 0Z';
const [cx, cy] = pt(65.5, -30.5, CT);

// river, bank and splashes
const bank = 'M10 258C70 254 150 260 214 256C236 254 256 258 270 262';
const water = 'M272 210L282 210M384 210C388 209 391 210 394 209';
const splash = 'M276 220l-8 -5M282 216l-3 -9M380 198l5 -6M386 206l7 -2';
const ripples = 'M300 226q10 -4 20 0M340 236q10 -4 20 0M360 220q8 -3 16 0M310 252q10 -4 20 0M362 262q10 -4 20 0';
const effort = 'M186 132l-4 -8M198 128l0 -9M210 132l4 -8';
const sweat = 'M174 138C170 144 172 148 176 148C180 148 180 144 174 138Z';

export default {
  title: 'Heave! The great tug of war',
  seed: 64,
  washes: [
    { c: PAL.sky, o: 0.5, d: 'M270 210C320 208 360 211 394 209L394 296L236 296C256 280 266 262 270 210Z' },
    { c: PAL.green, o: 0.38, d: 'M8 254C70 250 150 256 220 252C236 250 256 256 266 262L232 290C150 292 70 286 8 288Z' },
    ...el.washes,
    { c: PAL.slate, o: 0.32, d: noseWash },
    { c: PAL.grey, o: 0.55, d: noseWash },
    { c: PAL.green, o: 0.72, d: py.wash },
    { c: PAL.green, o: 0.72, t: HT, d: PY.wash },
    { c: PAL.ochre, o: 0.85, d: py.bands },
    { c: PAL.green, o: 0.75, t: CT, d: crocWash },
    // his nose, in the Crocodile's mouth
    { c: PAL.grey, o: 0.6, t: CT, d: 'M0 -5.5L58 -5.5C62 -2 62 3 58 5.5L0 5.5Z' },
    { c: PAL.slate, o: 0.3, t: CT, d: 'M0 -5.5L58 -5.5C62 -2 62 3 58 5.5L0 5.5Z' },
    { c: PAL.sky, o: 0.45, d: sweat },
  ],
  whites:
    el.whites +
    transformPath(PY.eye, HT) +
    transformPath(croc.eye + 'M8 -5.5l3 5l3 -5ZM20 -5.5l3 5l3 -5ZM32 -5.5l3 5l3 -5ZM44 -5.5l3 5l3 -5ZM14 5.5l3 -5l3 5ZM26 5.5l3 -5l3 5ZM38 5.5l3 -5l3 5Z', CT),
  lines:
    el.lines +
    paths([nose, py.outline, bank, water]) +
    paths([PY.head], HT) +
    paths([croc.top, croc.upperEdge, croc.lowerEdge, croc.chin, croc.ridges], CT),
  fine:
    el.fine +
    paths([stretch, py.rings, splash, ripples, effort, sweat, tufts([[70, 258], [210, 257]], 9, 6), hatch(40, 272, 220, 272, 8, 6, 165, 3)]) +
    paths([PY.smile, PY.eye], HT) + paths(['M' + frontKnee], ET) +
    paths([croc.teethUp, croc.teethDown, croc.nostrils, croc.eye, croc.brow], CT),
  fills:
    el.fills +
    `<circle cx="${f(pt(PY.pupil[0] - 1.5, PY.pupil[1] + 0.5, HT)[0])}" cy="${f(pt(PY.pupil[0] - 1.5, PY.pupil[1] + 0.5, HT)[1])}" r="2.1"/>` +
    `<circle cx="${f(cx)}" cy="${f(cy)}" r="2.8"/>`,
  glints: el.glints,
};
