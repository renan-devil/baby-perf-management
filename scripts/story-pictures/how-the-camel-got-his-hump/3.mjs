import { PAL, hatch, paths, transformPath, tufts } from '../lib.mjs';
import { at, f } from './1.mjs';
import { horse } from './2.mjs';

// How the Camel Got His Hump, 3: the Three (the Ox with his wooden yoke, the Dog with a stick in his
// mouth and the Horse with his saddle) meet at the edge of the desert, tired and cross from working
// double, and grumble. Grass on the left, the sand of the desert running off to the right.

/** Pupil and glint circles for an eye centre (x, y, r) under transform t. */
function eyeDots(t, [x, y, r]) {
  const [cx, cy] = at(t, x, y);
  const [gx, gy] = at(t, x - 0.6, y - 0.7);
  const s = Math.hypot(...at(t, 1, 0).map((v, i) => v - at(t, 0, 0)[i]));
  return { fill: `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * s)}"/>`, glint: `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(0.6 * s)}"/>` };
}

// ---- The Ox: facing right, feet on y = 0 ----
const OX = {
  back: 'M-50 -70C-30 -76 0 -77 24 -74',
  rump: 'M-50 -70C-60 -68 -62 -56 -58 -46',
  hindLeg: 'M-58 -46C-56 -36 -52 -30 -52 -22L-52 -5L-53 0L-39 0L-40 -5L-41 -22C-40 -30 -38 -36 -34 -40',
  farHindLeg: 'M-30 -38L-29 -6L-30 -2L-18 -2L-19 -6L-21 -38',
  belly: 'M-34 -40C-16 -34 2 -34 15 -38',
  foreLeg: 'M15 -38L15 -5L14 0L28 0L27 -5L28 -40',
  farForeLeg: 'M31 -38L32 -6L31 -2L43 -2L42 -6L40 -44',
  dewlap: 'M28 -40C36 -40 42 -44 46 -50',
  neck: 'M44 -72C48 -70 52 -68 54 -66',
  head: 'M54 -66C60 -72 70 -71 75 -64C80 -57 84 -48 83 -42C82 -36 75 -33 69 -35C62 -37 54 -43 46 -50',
  horn: 'M58 -70C54 -80 56 -88 63 -90C61 -84 62 -77 65 -71M71 -68C74 -77 80 -81 86 -80C81 -77 78 -72 76 -65',
  ear: 'M55 -62C49 -64 43 -60 42 -56C46 -55 51 -56 55 -58',
  tail: 'M-57 -64C-64 -56 -66 -40 -64 -24M-64 -24l-4 7M-64 -24l0 8M-64 -24l4 7',
  // the wooden yoke across his shoulders, and the bow round his neck
  yoke: 'M16 -86L50 -74L48 -66L14 -78Z',
  bow: 'M26 -74C22 -60 30 -48 40 -48C46 -48 48 -56 46 -66',
  // fine details
  hooves: 'M-52 -5L-40 -5M15 -5L27 -5M-29 -6L-19 -6M32 -6L42 -6',
  nostril: 'M76 -41q2 -2 4 0',
  grumpy: 'M74 -36Q70 -38 66 -36',
  brow: 'M62 -63L72 -58',
  eye: 'M64 -55C64 -59 71 -59 71 -55C71 -51 64 -51 64 -55Z',
  pupil: [67.5, -54, 1.8],
  grain: 'M22 -82L44 -74M20 -78l6 2',
};
OX.wash =
  'M-50 -70C-30 -76 0 -77 24 -74L44 -72L54 -66C60 -72 70 -71 75 -64C80 -57 84 -48 83 -42C82 -36 75 -33 69 -35C62 -37 54 -43 46 -50C42 -44 36 -40 28 -40L27 -5L15 -5L15 -38C2 -34 -16 -34 -34 -40C-38 -36 -40 -30 -41 -22L-40 -5L-52 -5L-52 -22C-52 -30 -56 -36 -58 -46C-62 -56 -60 -68 -50 -70Z';
OX.farLegs = 'M-30 -38L-29 -6L-19 -6L-21 -38ZM31 -38L32 -6L42 -6L40 -44Z';
OX.muzzle = 'M70 -36C74 -42 82 -46 83 -42C82 -36 75 -33 70 -36Z';
OX.horns = 'M58 -70C54 -80 56 -88 63 -90C61 -84 62 -77 65 -71ZM71 -68C74 -77 80 -81 86 -80C81 -77 78 -72 76 -65Z';
OX.hoofFills = 'M-52 -5L-40 -5L-39 0L-53 0ZM15 -5L27 -5L28 0L14 0ZM-29 -6L-19 -6L-18 -2L-30 -2ZM32 -6L42 -6L43 -2L31 -2Z';

// ---- The Dog: facing right, feet on y = 0 ----
const DOG = {
  back: 'M-24 -34C-10 -37 6 -37 16 -35',
  hindLeg: 'M-24 -34C-31 -32 -32 -24 -30 -18L-30 -2L-31 0L-22 0L-22 -3L-21 -16',
  belly: 'M-21 -16C-10 -14 2 -14 10 -16',
  farHindLeg: 'M-17 -15L-16 -2L-10 -2L-11 -15',
  foreLeg: 'M10 -16L10 -3L9 0L18 0L17 -3L18 -20',
  farForeLeg: 'M20 -20L21 -2L27 -2L25 -24',
  head: 'M16 -35C13 -44 18 -54 28 -55C36 -56 40 -51 42 -47L48 -45C53 -44 53 -37 47 -36L40 -36C36 -32 30 -30 25 -32C22 -27 20 -24 18 -20',
  ear: 'M22 -52C14 -51 11 -43 13 -36C17 -35 21 -41 24 -47',
  tail: 'M-26 -31C-33 -27 -36 -20 -36 -12',
  // the stick he carries in his mouth
  stick: 'M24 -40L60 -37L60 -33L24 -36ZM52 -37l4 -6',
  // fine details
  brow: 'M31 -51L38 -48',
  eye: 'M32 -46C32 -49 37 -49 37 -46C37 -43 32 -43 32 -46Z',
  pupil: [34.8, -45.5, 1.3],
  spot: 'M-14 -34C-14 -28 -4 -27 -2 -33',
};
DOG.wash =
  'M-24 -34C-10 -37 6 -37 16 -35C13 -44 18 -54 28 -55C36 -56 40 -51 42 -47L48 -45C53 -44 53 -37 47 -36L40 -36C36 -32 30 -30 25 -32C22 -27 20 -24 18 -20L17 -3L10 -3L10 -16C2 -14 -10 -14 -21 -16L-22 -3L-30 -2L-30 -18C-32 -24 -31 -32 -24 -34Z';
DOG.farLegs = 'M-17 -15L-16 -2L-10 -2L-11 -15ZM20 -20L21 -2L27 -2L25 -24Z';
DOG.earWash = DOG.ear + 'Z';
DOG.spotWash = DOG.spot + 'C-6 -36 -12 -36 -14 -34Z';
DOG.nose = 'M49 -44C52 -44 53 -40 50 -39C47 -39 46 -43 49 -44Z';

// ---- This picture ----
const OT = 'translate(76 252) scale(1.05)';
const DT = 'translate(204 253) scale(1.15)';
const HT = 'translate(316 252) scale(0.92) scale(-1 1)';
const ho = horse(HT, { cross: true });
const ox = eyeDots(OT, OX.pupil);
const dg = eyeDots(DT, DOG.pupil);

// grass on the left, giving way to the sand of the desert on the right
const ground = 'M4 254C80 250 160 256 240 252C310 249 360 254 396 252';
const grassWash = 'M4 252C60 248 120 254 180 251L190 266C130 272 60 266 4 272Z';
const sandWash = 'M150 252C220 254 300 248 396 250L396 274C320 280 230 270 160 276Z';
const dune = 'M250 168C290 150 340 148 392 162';
// grumbling: a scribbly cloud above them, and drops of sweat
const grumble0 = 'M150 40C146 30 156 22 166 26C170 16 186 16 190 24C198 18 212 22 212 32C220 34 220 46 210 48C208 56 196 58 190 52C184 58 170 58 166 50C156 54 146 48 150 40Z';
const scribble0 = 'M162 40C166 34 170 46 174 38C178 32 182 46 186 38C190 32 194 46 198 38';
const GT = 'translate(-14 78) scale(1.25 1.15) translate(-30 -20)';
const grumble = transformPath(grumble0, GT);
const scribble = transformPath(scribble0, GT);
const sweat = 'M0 0C-2 4 -3 6 -3 8C-3 10 3 10 3 8C3 6 2 4 0 0Z';
const drops = [at(OT, 82, -76), at(HT, 90, -128), at(DT, 46, -62)].map(([x, y]) => transformPath(sweat, `translate(${x} ${y})`)).join('');

export default {
  title: 'The Horse, the Dog and the Ox, cross',
  seed: 73,
  washes: [
    { c: PAL.green, o: 0.4, d: grassWash },
    { c: PAL.ochre, o: 0.32, d: sandWash },
    { c: PAL.ochre, o: 0.16, d: dune + 'L392 172L250 172Z' },
    { c: PAL.slate, o: 0.5, d: transformPath(OX.wash, OT) },
    { c: PAL.slate, o: 0.3, d: transformPath(OX.farLegs, OT) },
    { c: PAL.rose, o: 0.55, d: transformPath(OX.muzzle, OT) },
    { c: PAL.paper, o: 1, d: transformPath(OX.horns, OT) },
    { c: PAL.ochre, o: 0.5, d: transformPath(OX.horns, OT) },
    { c: PAL.terracotta, o: 0.75, d: transformPath(OX.yoke, OT) },
    { c: PAL.grey, o: 0.45, d: transformPath(DOG.wash, DT) },
    { c: PAL.grey, o: 0.3, d: transformPath(DOG.farLegs, DT) },
    { c: PAL.terracotta, o: 0.55, d: transformPath(DOG.earWash + DOG.spotWash, DT) },
    { c: PAL.ochre, o: 0.85, d: transformPath('M24 -40L60 -37L60 -33L24 -36Z', DT) },
    ...ho.washes,
    { c: PAL.grey, o: 0.28, d: grumble },
    { c: PAL.sky, o: 0.8, d: drops },
  ],
  whites: transformPath(OX.eye, OT) + transformPath(DOG.eye, DT) + ho.whites,
  lines:
    paths([OX.back, OX.rump, OX.hindLeg, OX.farHindLeg, OX.belly, OX.foreLeg, OX.farForeLeg, OX.dewlap, OX.neck, OX.head, OX.horn, OX.ear, OX.tail, OX.yoke, OX.bow], OT) +
    paths([DOG.back, DOG.hindLeg, DOG.belly, DOG.farHindLeg, DOG.foreLeg, DOG.farForeLeg, DOG.head, DOG.ear, DOG.tail, DOG.stick], DT) +
    ho.lines +
    paths([ground]),
  fine:
    paths([OX.hooves, OX.nostril, OX.grumpy, OX.brow, OX.eye, OX.grain], OT) +
    paths([DOG.brow, DOG.eye, DOG.spot], DT) +
    ho.fine +
    paths([grumble, scribble, drops, dune, tufts([[20, 254], [70, 252], [130, 254]], 9, 7), hatch(230, 266, 380, 264, 6, 9, 178, 5, 0.5)]),
  fills: ox.fill + dg.fill + `<path d="${transformPath(OX.hoofFills, OT)}"/><path d="${transformPath(DOG.nose, DT)}"/>` + ho.fills,
  glints: ox.glint + dg.glint + ho.glints,
};
