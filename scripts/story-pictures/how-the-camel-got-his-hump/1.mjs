import { PAL, hatch, paths, transformPath } from '../lib.mjs';

// How the Camel Got His Hump, 1 (cover): the lazy, grumpy Camel, with a perfectly flat back (no hump
// yet), stands in the sand chewing a prickly twig, his nose in the air and his eyes half-closed.
// The Camel is drawn here once, in his own coordinates, and the other pictures import these shapes:
// his body (with the flat back kept separate, so picture 5 can swap in the hump), his head (placed by
// its own transform) and a neck that is drawn to wherever the head is put.
export const f = (n) => Math.round(n * 10) / 10;

/** Where point (x, y) lands under transform t. */
export const at = (t, x, y) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);

// ---- The Camel's body: facing right, feet on y = 0, body centred on x = 0 ----
export const C = {
  back: 'M-52 -102C-30 -108 8 -108 30 -104',
  // the hump that puffs up in picture 5, in place of the flat back
  hump: 'M-52 -102C-56 -126 -40 -152 -12 -153C14 -153 32 -132 30 -104',
  rump: 'M-52 -102C-63 -99 -67 -88 -64 -76',
  hindLeg: 'M-64 -76C-61 -62 -55 -52 -55 -40L-56 -4Q-60 0 -52 0L-40 0Q-39 -4 -43 -6L-43 -40C-43 -50 -40 -58 -36 -64',
  farHindLeg: 'M-34 -62L-31 -40L-31 -6Q-34 -2 -27 -2L-18 -2Q-18 -6 -21 -8L-21 -40L-22 -60',
  belly: 'M-36 -64C-20 -58 2 -58 14 -62',
  foreLeg: 'M14 -62L14 -40L13 -4Q9 0 17 0L29 0Q30 -4 25 -6L25 -40L27 -58',
  farForeLeg: 'M30 -58L33 -40L34 -6Q31 -2 38 -2L46 -2Q46 -6 43 -8L43 -40L40 -64',
  chest: 'M27 -58C34 -62 40 -68 42 -78',
  tail: 'M-62 -94C-70 -88 -72 -76 -70 -62M-70 -62l-4 8M-70 -62l0 9M-70 -62l4 8',
  // fine details: knobbly knees, foot pads, a fold at the shoulder
  knees: 'M-57 -42q6 3 12 0M12 -42q6 3 12 0M-33 -42q5 3 10 0',
  pads: 'M-54 -2q3 -3 6 0M15 -2q3 -3 6 0',
  shoulder: 'M18 -90C14 -80 14 -70 18 -64',
};
// the two places the neck grows from: the withers (top) and the chest (front)
export const NECK_TOP = [30, -104];
export const NECK_FRONT = [42, -78];
C.bodyWash =
  'M-52 -102C-30 -108 8 -108 30 -104L42 -78C40 -68 34 -62 27 -58L25 -40L25 -6L13 -4L14 -62C2 -58 -20 -58 -36 -64C-40 -58 -43 -50 -43 -40L-43 -6L-56 -4L-55 -40C-55 -52 -61 -62 -64 -76C-67 -88 -63 -99 -52 -102Z';
C.humpWash = 'M-52 -102C-56 -126 -40 -152 -12 -153C14 -153 32 -132 30 -104C8 -108 -30 -108 -52 -102Z';
C.farLegWash = 'M-34 -62L-31 -40L-31 -6L-18 -2L-21 -40L-22 -60ZM30 -58L33 -40L34 -6L46 -2L43 -40L40 -64Z';

// ---- The Camel's head: facing right, its back (where the neck joins) at 0, 0 ----
export const H = {
  top: 'M-6 -8C-2 -18 8 -22 18 -20C28 -18 38 -14 44 -8C49 -3 49 4 45 8',
  lip: 'M45 8C41 12 35 12 31 10',
  jaw: 'M33 10C32 18 22 19 16 13C10 10 2 9 -5 8',
  ear: 'M1 -15C-4 -22 -2 -27 3 -26C6 -24 7 -20 6 -17',
  brow: 'M12 -18Q19 -17 25 -13',
  nostril: 'M40 -5q3 -1 4 2M46 2q-3 1 -3 5',
  // half-closed, sleepy-grumpy eye: a lid across the middle
  eyeLow: 'M14 -10C14 -6 24 -6 24 -10',
  lid: 'M13 -10.5L25 -10.5',
  lidTop: 'M14 -10C14 -15 24 -15 24 -10',
  // a wide-open eye, for surprise (picture 5)
  eyeOpen: 'M13 -10C13 -16 25 -16 25 -10C25 -4 13 -4 13 -10Z',
  pupilHalf: [19, -8.2, 1.8],
  pupilOpen: [19.5, -10, 2.3],
};
H.wash = H.top + H.lip.slice(H.lip.indexOf('C')) + 'L33 10' + H.jaw.slice(H.jaw.indexOf('C')) + 'Z';
H.earWash = H.ear + 'Z';
H.lidWash = H.lidTop + 'Z';
H.eyeWhiteHalf = H.eyeLow + 'Z';
// the prickly twig he chews, sticking out of the corner of his mouth
export const TWIG = {
  stick: 'M30 11L66 2',
  prickles: 'M40 8l-2 -6M47 6l1 -6M53 5l-1 6M59 3l2 -6M44 8l1 5M64 2l4 2',
  leaves: 'M50 5C52 -2 58 -4 60 -3C58 2 54 5 50 5ZM36 9C34 15 37 19 40 19C41 15 39 11 36 9Z',
};

/**
 * The Camel's ink, washes, whites and pupil, placed by transform t (camel coordinates → picture).
 * headT places the head in camel coordinates; the neck is drawn to it. hump puts the hump on his back,
 * eye is 'half' or 'open', look shifts the pupil, twig puts the prickly twig in his mouth.
 */
export function camel(t, { headT = 'translate(94 -130) rotate(-22) scale(1.3)', hump = false, eye = 'half', look = [0, 0], twig = true, neckTop: nt = [22, 4], neckFront: nf = [20, 14] } = {}) {
  const HT = `${t} ${headT}`;
  // neck: from the withers to the back of the head, and from the chest to under the jaw
  const jt = at(headT, -6, -8);
  const jb = at(headT, -5, 8);
  const back = at(headT, -1, 0).map((v, i) => v - at(headT, 0, 0)[i]); // points away from the snout
  const c2t = [f(jt[0] + back[0] * 24), f(jt[1] + back[1] * 24)];
  const c2f = [f(jb[0] + back[0] * 24), f(jb[1] + back[1] * 24)];
  const c1t = [NECK_TOP[0] + nt[0], NECK_TOP[1] + nt[1]];
  const c1f = [NECK_FRONT[0] + nf[0], NECK_FRONT[1] + nf[1]];
  const neckTop = `M${NECK_TOP.join(' ')}C${c1t.join(' ')} ${c2t.join(' ')} ${f(jt[0])} ${f(jt[1])}`;
  const neckFront = `M${NECK_FRONT.join(' ')}C${c1f.join(' ')} ${c2f.join(' ')} ${f(jb[0])} ${f(jb[1])}`;
  const neckWash = `${neckTop}L${f(jb[0])} ${f(jb[1])}C${c2f.join(' ')} ${c1f.join(' ')} ${NECK_FRONT.join(' ')}L${NECK_TOP[0] - 6} ${NECK_TOP[1] + 14}Z`;

  const main = [hump ? C.hump : C.back, C.rump, C.hindLeg, C.farHindLeg, C.belly, C.foreLeg, C.farForeLeg, C.chest, C.tail, neckTop, neckFront];
  const head = [H.top, H.lip, H.jaw, H.ear];
  const headFine = [H.brow, H.nostril, ...(eye === 'half' ? [H.eyeLow, H.lid, H.lidTop] : [H.eyeOpen])];
  const [px, py, pr] = eye === 'half' ? H.pupilHalf : H.pupilOpen;
  const [cx, cy] = at(HT, px + look[0], py + look[1]);
  const [gx, gy] = at(HT, px + look[0] - 0.7, py + look[1] - 0.8);
  const s = Math.hypot(...at(HT, 1, 0).map((v, i) => v - at(HT, 0, 0)[i]));
  const twigLines = twig ? [TWIG.stick] : [];
  return {
    washes: [
      // body, hump, neck and head in one wash, so the joins do not show (all drawn clockwise)
      { c: PAL.ochre, o: 0.62, d: transformPath(C.bodyWash + (hump ? C.humpWash : '') + neckWash, t) + transformPath(H.wash, HT) },
      { c: PAL.ochre, o: 0.5, d: transformPath(C.farLegWash, t) },
      { c: PAL.terracotta, o: 0.22, d: transformPath(C.farLegWash, t) },
      { c: PAL.terracotta, o: 0.45, d: transformPath(H.earWash, HT) },
      ...(eye === 'half' ? [{ c: PAL.terracotta, o: 0.55, d: transformPath(H.lidWash, HT) }] : []),
      ...(twig ? [{ c: PAL.green, o: 0.8, d: transformPath(TWIG.leaves, HT) }] : []),
    ],
    whites: transformPath(eye === 'half' ? H.eyeWhiteHalf : H.eyeOpen, HT),
    lines: paths(main, t) + paths([...head, ...twigLines], HT),
    fine: paths([C.knees, C.pads, C.shoulder], t) + paths([...headFine, ...(twig ? [TWIG.prickles, TWIG.leaves] : [])], HT),
    fills: `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(pr * s)}"/>`,
    glints: `<circle cx="${f(gx)}" cy="${f(gy)}" r="${f(0.7 * s)}"/>`,
  };
}

// ---- Desert bits shared by the pictures ----
/** A low sand dune line across the picture at height y, with its wash band. */
export function sand(y, seed = 4) {
  return {
    line: `M6 ${y + 2}C80 ${y - 3} 160 ${y + 4} 240 ${y}C310 ${y - 3} 360 ${y + 2} 394 ${y}`,
    wash: `M6 ${y}C80 ${y - 5} 160 ${y + 2} 240 ${y - 2}C310 ${y - 5} 360 ${y} 394 ${y - 2}L394 ${y + 24}C320 ${y + 30} 230 ${y + 20} 150 ${y + 26}C90 ${y + 30} 40 ${y + 22} 6 ${y + 24}Z`,
    ripples: hatch(40, y + 14, 360, y + 12, 9, 10, 178, seed, 0.5),
  };
}

// ---- This picture ----
const CT = 'translate(156 258) scale(1.3)';
const cm = camel(CT);
const ground = sand(258);

// a far dune and a small sun, the Howling Desert
const dune = 'M24 196C70 176 120 176 158 194M262 200C300 184 344 182 382 198';
const sun = 'M58 62C58 50 76 50 76 62C76 74 58 74 58 62Z';
const sunRays = 'M67 42l0 -8M81 48l6 -6M86 62l8 0M53 48l-6 -6M48 62l-8 0M81 76l6 6M53 76l-6 6';

export default {
  title: 'How the Camel Got His Hump',
  seed: 71,
  washes: [
    { c: PAL.ochre, o: 0.32, d: ground.wash },
    { c: PAL.ochre, o: 0.18, d: 'M24 196C70 176 120 176 158 194L158 200L24 200ZM262 200C300 184 344 182 382 198L382 204L262 204Z' },
    { c: PAL.ochre, o: 0.7, d: sun },
    ...cm.washes,
  ],
  whites: cm.whites,
  lines: cm.lines + paths([ground.line]),
  fine: cm.fine + paths([dune, sunRays, ground.ripples]) + paths([sun]),
  fills: cm.fills,
  glints: cm.glints,
};
