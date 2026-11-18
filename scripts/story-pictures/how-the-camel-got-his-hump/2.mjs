import { PAL, paths, transformPath } from '../lib.mjs';
import { at, camel, f, sand } from './1.mjs';

// How the Camel Got His Hump, 2: the Horse, with a saddle on his back, trots up and asks the Camel to
// come and trot like the rest of them; the Camel turns up his nose ("Humph!").
// The Horse is drawn here once, and picture 3 imports him.

// ---- The Horse: facing right, feet on y = 0, body centred on x = 0 ----
export const HO = {
  back: 'M-48 -82C-30 -88 0 -88 22 -86',
  rump: 'M-48 -82C-60 -80 -64 -70 -62 -60',
  hindLeg: 'M-62 -60C-60 -48 -54 -40 -54 -30L-54 -6L-56 0L-43 0L-44 -6L-44 -30C-42 -40 -40 -46 -36 -50',
  farHindLeg: 'M-32 -48L-30 -8L-31 -2L-19 -2L-20 -8L-22 -48',
  belly: 'M-36 -50C-20 -46 0 -46 14 -50',
  foreLeg: 'M14 -50L15 -6L14 0L27 0L26 -6L26 -48',
  // the near front leg lifted in a trot, in place of foreLeg
  foreLegUp: 'M14 -50C15 -42 16 -36 18 -31L5 -20L10 -12L28 -26C28 -36 27 -42 26 -48',
  farForeLeg: 'M30 -48L31 -8L30 -2L42 -2L41 -8L38 -56',
  chest: 'M26 -48C34 -52 38 -60 38 -70',
  neckTop: 'M22 -86C30 -100 38 -112 46 -122',
  neckFront: 'M38 -70C46 -80 54 -90 60 -102',
  head: 'M46 -122C50 -132 58 -134 64 -130C70 -124 78 -114 83 -106C86 -100 83 -93 77 -93C71 -93 66 -97 60 -102',
  ear: 'M50 -129L47 -142L57 -132',
  tail: 'M-60 -76C-72 -72 -79 -56 -77 -38C-73 -48 -68 -56 -63 -64',
  // fine details
  mane: 'M24 -88l-8 -4M27 -93l-8 -4M30 -98l-8 -4M33 -103l-8 -3M36 -108l-8 -3M39 -113l-8 -3M42 -118l-7 -3M45 -123l-6 -4M53 -132l-1 8M56 -131l3 6',
  hooves: 'M-55 -5L-43 -5M15 -5L26 -5M-31 -6L-20 -6M31 -6L41 -6',
  nostril: 'M77 -101q3 0 3 3',
  smile: 'M82 -97Q78 -95 74 -97',
  brow: 'M57 -122Q62 -125 67 -121',
  // a cross, frowning brow (picture 3)
  crossBrow: 'M56 -125L67 -119',
  eye: 'M58 -115C58 -120 66 -120 66 -115C66 -110 58 -110 58 -115Z',
  pupil: [62.5, -115, 2],
  // the saddle, its blanket and the girth with a stirrup
  saddle: 'M-24 -87C-28 -94 -27 -101 -20 -99C-14 -93 -2 -93 4 -97C10 -100 11 -93 8 -87',
  blanket: 'M-30 -86C-32 -79 -32 -73 -28 -68C-12 -66 2 -66 12 -70C14 -76 14 -82 14 -87',
  girth: 'M-6 -70L-5 -49M-3 -60L-9 -52L0 -52Z',
};
HO.bodyWash =
  'M-48 -82C-30 -88 0 -88 22 -86L46 -122C50 -132 58 -134 64 -130C70 -124 78 -114 83 -106C86 -100 83 -93 77 -93C71 -93 66 -97 60 -102L38 -70C38 -60 34 -52 26 -48L26 -6L14 -6L14 -50C0 -46 -20 -46 -36 -50C-40 -46 -42 -40 -44 -30L-44 -6L-54 -6L-54 -30C-54 -40 -60 -48 -62 -60C-64 -70 -60 -80 -48 -82Z';
HO.liftedLegWash = 'M14 -50C15 -42 16 -36 18 -31L5 -20L10 -12L28 -26C28 -36 27 -42 26 -48Z';
HO.liftedHoof = 'M5 -20L10 -12L14.5 -15.5L9.5 -23.5Z';
HO.farLegWash = 'M-32 -48L-30 -8L-20 -8L-22 -48ZM30 -48L31 -8L41 -8L38 -56Z';
HO.maneWash = 'M22 -86C30 -100 38 -112 46 -122L52 -132L44 -128L36 -116L28 -104L16 -92Z';
HO.tailWash = HO.tail + 'Z';
HO.saddleWash = HO.saddle + 'C0 -88 -14 -88 -24 -87Z';
HO.blanketWash = HO.blanket + 'Z';
HO.hoofFills = (lifted) => HO.hooves.replace(/M(-?\d+) (-?\d+)L(-?\d+) (-?\d+)/g, (m, a, b, c, d) => (lifted && a === '15' ? '' : `M${a} ${b}L${c} ${d}L${c} 0L${a} 0Z`)) + (lifted ? HO.liftedHoof : '');
HO.cheek = 'M68 -106C68 -109 74 -109 74 -106C74 -103 68 -103 68 -106Z';

/** The Horse placed by transform t; lifted puts up his front leg, cross gives him a frown. */
export function horse(t, { lifted = false, cross = false, look = [0, 0] } = {}) {
  const main = [HO.back, HO.rump, HO.hindLeg, HO.farHindLeg, HO.belly, lifted ? HO.foreLegUp : HO.foreLeg, HO.farForeLeg, HO.chest, HO.neckTop, HO.neckFront, HO.head, HO.ear, HO.tail, HO.saddle, HO.blanket];
  const fine = [HO.mane, lifted ? HO.hooves.replace('M15 -5L26 -5', '') : HO.hooves, HO.nostril, HO.eye, HO.girth, cross ? HO.crossBrow : HO.brow, cross ? 'M82 -96Q78 -98 74 -96' : HO.smile];
  const [cx, cy] = at(t, HO.pupil[0] + look[0], HO.pupil[1] + look[1]);
  const [gx, gy] = at(t, HO.pupil[0] + look[0] - 0.7, HO.pupil[1] + look[1] - 0.8);
  const s = Math.hypot(...at(t, 1, 0).map((v, i) => v - at(t, 0, 0)[i]));
  return {
    washes: [
      { c: PAL.terracotta, o: 0.6, d: transformPath(lifted ? HO.bodyWash.replace('L26 -6L14 -6L14 -50', 'L14 -50') + HO.liftedLegWash : HO.bodyWash, t) },
      { c: PAL.terracotta, o: 0.35, d: transformPath(HO.farLegWash, t) },
      { c: PAL.slate, o: 0.6, d: transformPath(HO.maneWash + HO.tailWash, t) },
      { c: PAL.ochre, o: 0.7, d: transformPath(HO.blanketWash, t) },
      { c: PAL.red, o: 0.75, d: transformPath(HO.saddleWash, t) },
      { c: PAL.rose, o: 0.5, d: transformPath(HO.cheek, t) },
    ],
    whites: transformPath(HO.eye, t),
    lines: paths(main, t),
    fine: paths(fine, t),
    fills: `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(HO.pupil[2] * s)}"/>` + `<path d="${transformPath(HO.hoofFills(lifted), t)}"/>`,
    glints: `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(0.7 * s)}"/>`,
  };
}

// ---- This picture ----
// the Horse on the left, trotting up; the Camel on the right, facing him, nose turned right up
const HT = 'translate(100 256) scale(1.15)';
const ho = horse(HT, { lifted: true });
const CT = 'translate(318 256) scale(1.12) scale(-1 1)';
const CHT = 'translate(80 -128) rotate(-44) scale(1.3)';
const cm = camel(CT, { headT: CHT, neckTop: [14, -8], neckFront: [16, 2] });
const ground = sand(256, 6);

// "Camel, oh Camel...": little lines from the Horse's mouth; "Humph!": a puff from the Camel's nose
const talk = 'M206 140l10 -4M208 149l11 0M206 158l10 4';
// the puff sits just off the end of his nose, wherever the head is
const [nx, ny] = at(`${CT} ${CHT}`, 62, -10);
const puff = transformPath('M0 0C-4 -6 2 -12 8 -9C10 -15 20 -14 20 -7C26 -7 27 1 21 3C20 8 11 9 9 5C4 8 -2 4 0 0Z', `translate(${nx - 20} ${ny - 4})`);
const trot = 'M40 238l-10 -2M44 248l-12 1';

export default {
  title: 'The Horse asks the Camel to trot',
  seed: 72,
  washes: [{ c: PAL.ochre, o: 0.32, d: ground.wash }, ...ho.washes, ...cm.washes, { c: PAL.grey, o: 0.3, d: puff }],
  whites: ho.whites + cm.whites,
  lines: ho.lines + cm.lines + paths([ground.line]),
  fine: ho.fine + cm.fine + paths([ground.ripples, talk, puff, trot]),
  fills: ho.fills + cm.fills,
  glints: ho.glints + cm.glints,
};
