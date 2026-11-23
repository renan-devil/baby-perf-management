import { PAL, rng, transformPath } from '../lib.mjs';
import { compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Velveteen Rabbit: the velveteen rabbit (as a toy, then shabby, then real), the Boy, the Skin
// Horse, the clockwork mouse, the wild rabbits and the tiny fairy, drawn once here and placed in each
// picture with a transform (place); flip with scale(-1 1). The build only draws files named <n>.mjs,
// so this file is not a picture.

export { compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;

/** A soft irregular blob (a spot of colour) around (x, y), about rx by ry. */
export function blob(x, y, rx, ry, seed = 1) {
  const r = rng(seed);
  const n = 7;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 0.8 + r() * 0.35;
    return [x + Math.cos(a) * rx * k, y + Math.sin(a) * ry * k];
  });
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${mid(pts[n - 1], pts[0]).map(f).join(' ')}`;
  for (let i = 0; i < n; i++) d += `Q${pts[i].map(f).join(' ')} ${mid(pts[i], pts[(i + 1) % n]).map(f).join(' ')}`;
  return `${d}Z`;
}

/** A teardrop (tip up) of height h, its tip at (x, y). */
export const tear = (x, y, h) =>
  `M${f(x)} ${f(y)}C${f(x - h * 0.34)} ${f(y + h * 0.55)} ${f(x - h * 0.44)} ${f(y + h)} ${f(x)} ${f(y + h)}C${f(x + h * 0.44)} ${f(y + h)} ${f(x + h * 0.34)} ${f(y + h * 0.55)} ${f(x)} ${f(y)}Z`;

/** A four-pointed sparkle centred on (x, y), of half-size s. */
export const sparkle = (x, y, s) =>
  `M${f(x)} ${f(y - s)}L${f(x)} ${f(y + s)}M${f(x - s)} ${f(y)}L${f(x + s)} ${f(y)}M${f(x - s * 0.4)} ${f(y - s * 0.4)}L${f(x + s * 0.4)} ${f(y + s * 0.4)}M${f(x + s * 0.4)} ${f(y - s * 0.4)}L${f(x - s * 0.4)} ${f(y + s * 0.4)}`;

// =============================================================================================
// THE VELVETEEN RABBIT, a toy, sitting and facing us (bottom centre at 0,0), about 60 wide and 124
// tall with his ears: a plump white velveteen body with big brown (terracotta) spots, a brown patch
// round his left eye, two long ears lined with pink satin (the left one flopping out sideways),
// black boot-button eyes, a pink nose and thread whiskers. Head centre at R_HEAD.
// mood: 'happy', 'look' (eyes turned to the side by look [dx, dy]), 'shut' (eyes closed, smiling),
// 'sad' (brows up, a tear rolling down his nose). shabby: rubbed pale, fewer spots, a loose thread
// and a darn. upper: only above y = -24 (the rest hidden in a stocking, a sack or a hug).
// =============================================================================================
export const R_HEAD = [0, -62];
const rHead = oval(0, -62, 19, 16.5);
const rEarL = limb([[-8, -75, 11], [-12, -92, 13], [-15, -108, 11], [-16, -120, 6]]);
const rEarR = limb([[8, -75, 11], [17, -89, 13], [28, -100, 11], [37, -106, 6]]);
const rLiningL = limb([[-9, -82, 4], [-12, -94, 6.5], [-14.5, -107, 5], [-15.5, -115, 2]]);
const rLiningR = limb([[12, -82, 4], [18.5, -91, 6.5], [27.5, -99.5, 5], [33, -103.5, 2]]);
const rBody = 'M-12 -49C-24 -45 -30 -32 -27 -16C-26 -10 -24 -6 -22 -4M12 -49C24 -45 30 -32 27 -16C26 -10 24 -6 22 -4';
const rBodyFill = 'M-12 -49C-24 -45 -30 -32 -27 -16C-26 -10 -24 -6 -22 -4L22 -4C24 -6 26 -10 27 -16C30 -32 24 -45 12 -49C6 -51 -6 -51 -12 -49Z';
const rBodyUpper = 'M-12 -49C-24 -45 -29 -34 -28.5 -24M12 -49C24 -45 29 -34 28.5 -24';
const rBodyUpperFill = 'M-12 -49C-24 -45 -29 -34 -28.5 -24L28.5 -24C29 -34 24 -45 12 -49C6 -51 -6 -51 -12 -49Z';
const rFeet = oval(-13, -6, 11, 6.5) + oval(13, -6, 11, 6.5);
const rPads = oval(-13, -6, 4.5, 3) + oval(13, -6, 4.5, 3);
const rArms = ['M-22 -40C-26 -32 -24 -25 -16 -25', 'M22 -40C26 -32 24 -25 16 -25'];
const rNose = 'M-3 -57C-1.5 -58.5 1.5 -58.5 3 -57C2 -55 1 -54.3 0 -54.3C-1 -54.3 -2 -55 -3 -57Z';
const rMouth = 'M0 -54.3L0 -52M-4 -51.3Q-2 -49.6 0 -52Q2 -49.6 4 -51.3';
const rWhiskers = 'M-6 -55.5l-13 -2.5M-6 -53.5l-12 2.5M6 -55.5l13 -2.5M6 -53.5l12 2.5';
const rEyes = [[-7, -64], [7, -64]];
// his spots: the patch round his left eye, one on the right ear and the rest on his tummy and feet
const SPOTS = [
  [8, -66, 8.5, 7, 3],
  [-15, -32, 6.5, 6, 5],
  [14, -20, 7, 6.5, 7],
  [-6, -38, 4.5, 4, 9],
  [5, -12, 4.5, 3.5, 11],
  [-14, -5, 5, 3.5, 13],
  [26, -101, 4.5, 3.4, 15],
];
const SHABBY_SPOTS = [0, 1, 2, 5];

function rabbitFace(mood, look) {
  const fine = [rMouth, rWhiskers, rNose];
  const fills = [];
  const glints = [];
  const washes = [];
  const [lx, ly] = mood === 'look' ? look : [0, 0];
  if (mood === 'shut') {
    fine.push('M-10 -64q3 2.8 6 0M4 -64q3 2.8 6 0', 'M-4 -51q4 3.4 8 0');
  } else {
    for (const [x, y] of rEyes) {
      fills.push(dot(x + lx, y + ly, 2.5));
      glints.push(dot(x + lx - 0.7, y + ly - 0.8, 0.75));
    }
  }
  if (mood === 'sad') {
    fine.push('M-11 -69L-4 -71.5M11 -69L4 -71.5');
    const t = tear(2, -53.5, 9.5);
    fine.push(t);
    washes.push({ c: PAL.sky, o: 0.95, d: t });
  }
  return { fine, fills, glints, washes };
}

export function rabbit({ mood = 'happy', look = [1.2, 0], shabby = false, upper = false } = {}) {
  const spotO = shabby ? 0.5 : 0.82;
  const spots = SPOTS.filter((s, i) => (!shabby || SHABBY_SPOTS.includes(i)) && (!upper || s[1] < -26)).map(([x, y, rx, ry, s]) => blob(x, y, rx, ry, s));
  const body = upper ? rBodyUpper : rBody;
  const bodyFill = upper ? rBodyUpperFill : rBodyFill;
  const face = rabbitFace(mood, look);
  const lines = [rEarL, rEarR, rHead, body];
  const fine = [...(upper ? [] : [rFeet, rArms[0], rArms[1]]), 'M-9 -79c2 -2 4 -2 6 -1M3 -79c2 -1 4 -1 6 1', ...face.fine];
  const washes = [
    // a faint warm tint for the velveteen (greyer when he is old and rubbed)
    { c: shabby ? PAL.grey : PAL.ochre, o: shabby ? 0.3 : 0.14, d: bodyFill + Z(rEarL) + Z(rEarR) + (upper ? '' : rFeet) },
    { c: shabby ? PAL.grey : PAL.ochre, o: shabby ? 0.3 : 0.14, d: rHead },
    { c: PAL.rose, o: shabby ? 0.45 : 0.85, d: Z(rLiningL) + Z(rLiningR) },
    { c: PAL.terracotta, o: spotO, d: spots.join('') },
    { c: PAL.rose, o: shabby ? 0.5 : 0.9, d: rNose },
    ...(upper ? [] : [{ c: PAL.rose, o: shabby ? 0.3 : 0.5, d: rPads }]),
    ...face.washes,
  ];
  if (!shabby) fine.push(rLiningL, rLiningR);
  if (shabby) {
    // a darned rub on his side, a loose thread and a seam coming undone at his ear
    fine.push('M-24 -40l4 1M-25 -36l4 1M-25 -32l4 1', 'M-8 -91l4 1.5M-8 -95l4 1.5', upper ? 'M27 -30c6 2 6 8 12 8c4 0 5 4 9 3' : 'M26 -14c6 2 6 8 12 8c4 0 5 4 9 3');
  }
  return { lines, fine, washes, fills: face.fills, glints: face.glints, whites: [] };
}

// =============================================================================================
// A RABBIT IN PROFILE (facing right, middle of the body at 0,0), about 96 long: used for the wild
// rabbits (plain brown) and for the velveteen rabbit once he is Real (white with the same brown
// spots and pink-lined ears). pose: 'hop' (stretched in a bound, hind legs out behind) or 'peep'
// (head, ears and chest only, the rest hidden in bracken, chest bottom at y = 4).
// =============================================================================================
const pHead = 'M17 -28C16 -36 24 -41 32 -41C40 -41 46 -35 46 -29C46 -23 40 -18 32 -18C24 -18 18 -22 17 -28Z';
const EAR1 = limb([[24, -38, 7], [14, -48, 8.5], [2, -54, 7], [-7, -56, 3.5]]);
const EAR2 = limb([[29, -40, 7], [24, -53, 8.5], [17, -63, 7], [11, -68, 3.5]]);
const LINING1 = limb([[20, -44, 2.5], [13, -49, 4], [3, -53, 3], [-3, -55, 1.2]]);
const LINING2 = limb([[26, -47, 2.5], [22.5, -54, 4], [17, -61, 3], [13, -65, 1.2]]);
const pHop =
  'M25 -19C30 -12 34 -4 38 1C42 5 48 6 46 10C42 12 32 10 22 6C10 10 -8 10 -20 7C-28 11 -40 16 -50 15C-53 12 -46 8 -36 2C-40 -5 -39 -13 -32 -19C-24 -26 -8 -28 6 -27C11 -27 15 -29 18 -32';
const pHopFill = `${pHop}C18 -30 20 -22 25 -19Z`;
const pThigh = 'M-6 -8C-16 -16 -30 -10 -30 2';
const pTail = oval(-37, -9, 6, 5.5);
const pPeep = 'M19 -22C14 -14 12 -4 13 4M33 -18C38 -10 40 -2 40 4';
const pPeepFill = 'M19 -22C14 -14 12 -4 13 4L40 4C40 -2 38 -10 33 -18Z';
const pNose = 'M44.5 -31C46 -31.5 47.5 -30.5 47 -29C46.5 -27.8 44.5 -28.2 44.5 -31Z';
const pFace = 'M46 -28q0 3 -3 4M47 -29l9 -3M47 -27l9 1M46 -26l7 4';
const P_SPOTS = [
  [33, -31, 7, 6, 21],
  [-14, -16, 9, 7, 23],
  [6, -16, 6, 5, 25],
  [-26, 0, 6, 5, 27],
  [10, -55, 4, 3, 29],
];

export function profileRabbit({ pose = 'hop', real = false, tint = 1, ears = 0 } = {}) {
  // ears: how far (degrees) the ears are turned up from lying back
  const e1 = ears ? `rotate(${ears} 24 -38)` : '';
  const e2 = ears ? `rotate(${ears * 0.6} 29 -40)` : '';
  const pEar1 = e1 ? transformPath(EAR1, e1) : EAR1;
  const pEar2 = e2 ? transformPath(EAR2, e2) : EAR2;
  const pLining1 = e1 ? transformPath(LINING1, e1) : LINING1;
  const pLining2 = e2 ? transformPath(LINING2, e2) : LINING2;
  const body = pose === 'hop' ? pHop : pPeep;
  const bodyFill = pose === 'hop' ? pHopFill : pPeepFill;
  const lines = [pEar1, pEar2, pHead, body];
  const fine = [pFace, pNose, ...(pose === 'hop' ? [pThigh, pTail] : [])];
  const all = pHead + Z(pEar1) + Z(pEar2);
  let washes;
  if (real) {
    const spots = P_SPOTS.filter((s) => pose === 'hop' || s[1] < -20).map(([x, y, rx, ry, s]) => (s === 29 && e1 ? transformPath(blob(x, y, rx, ry, s), e1) : blob(x, y, rx, ry, s)));
    washes = [
      { c: PAL.ochre, o: 0.12, d: bodyFill },
      { c: PAL.ochre, o: 0.12, d: all },
      { c: PAL.terracotta, o: 0.82, d: spots.join('') },
      { c: PAL.rose, o: 0.85, d: Z(pLining1) + Z(pLining2) },
    ];
    fine.push(pLining1, pLining2);
  } else {
    washes = [
      { c: PAL.terracotta, o: 0.55 * tint, d: bodyFill },
      { c: PAL.terracotta, o: 0.55 * tint, d: all },
      { c: PAL.grey, o: 0.55 * tint, d: bodyFill },
      { c: PAL.grey, o: 0.55 * tint, d: all },
      { c: PAL.rose, o: 0.4, d: Z(pLining1) + Z(pLining2) },
    ];
  }
  washes.push({ c: PAL.rose, o: 0.9, d: pNose });
  return {
    lines,
    fine,
    washes,
    whites: pose === 'hop' && !real ? [pTail] : [],
    fills: [dot(35, -32, 2.3)],
    glints: [dot(34.3, -32.8, 0.7)],
  };
}

/**
 * The velveteen rabbit as a toy seen from the side (facing right, sitting, ground at y = 32): the
 * profile head and pink-lined ears above, a plump sitting body with a round haunch, a front paw and a
 * bobble tail, his brown spots, boot-button eye and thread whiskers. Used when he must turn his face
 * to someone. mood: 'happy' or 'shut' (eye closed, smiling). shabby: as for rabbit().
 */
export function toyProfile({ mood = 'happy', shabby = false, ears = 22 } = {}) {
  const e1 = `rotate(${ears} 24 -38)`;
  const e2 = `rotate(${ears * 0.6} 29 -40)`;
  const ear1 = transformPath(EAR1, e1);
  const ear2 = transformPath(EAR2, e2);
  const lin = transformPath(LINING1, e1) + 'Z' + transformPath(LINING2, e2) + 'Z';
  const body = 'M19 -22C8 -16 -10 -4 -16 10C-20 20 -16 30 -6 32L42 32C44 26 42 18 38 10C35 2 34 -8 33 -18';
  const bodyFill = `${body}C30 -20 24 -22 19 -22Z`;
  const haunch = 'M-2 32C-8 18 2 6 14 10C22 14 24 24 20 32';
  const paw = 'M30 32C28 22 30 12 34 6';
  const tail = oval(-17, 20, 5.5, 5.5);
  const spots = (shabby ? [[33, -31, 7, 6, 21], [8, 18, 7, 6, 23]] : [[33, -31, 7, 6, 21], [8, 18, 7, 6, 23], [4, -6, 6, 5, 25], [-10, 12, 5, 6, 27]]).map(([x, y, rx, ry, sd]) => blob(x, y, rx, ry, sd));
  const tint = shabby ? PAL.grey : PAL.ochre;
  const tintO = shabby ? 0.3 : 0.14;
  const fine = [pFace, pNose, haunch, paw, tail, 'M47 -28l12 -4M47 -26l12 2'];
  const fills = [];
  const glints = [];
  if (mood === 'shut') fine.push('M31.5 -33q3.2 2.8 6.4 0', 'M43 -24q-2 2 -5 1.5');
  else {
    fills.push(dot(35, -32, 2.5));
    glints.push(dot(34.3, -32.8, 0.75));
  }
  if (shabby) fine.push('M-12 0l4 1M-14 5l4 1M-15 10l4 1', 'M40 20c6 2 6 8 12 8c4 0 5 4 9 3');
  else fine.push(transformPath(LINING1, e1), transformPath(LINING2, e2));
  return {
    lines: [ear1, ear2, pHead, body],
    fine,
    washes: [
      { c: tint, o: tintO, d: bodyFill + tail },
      { c: tint, o: tintO, d: pHead + Z(ear1) + Z(ear2) },
      { c: PAL.rose, o: shabby ? 0.45 : 0.85, d: lin },
      { c: PAL.terracotta, o: shabby ? 0.5 : 0.82, d: spots.join('') },
      { c: PAL.rose, o: shabby ? 0.5 : 0.9, d: pNose },
    ],
    fills,
    glints,
  };
}

// =============================================================================================
// THE BOY's head (centre 0,0), about 32 wide: a round face, a mop of golden (ochre) hair with a
// tuft on top, rosy cheeks. mood: 'happy', 'sleep' (eyes shut, a little smile), 'ill' (heavy
// half-shut eyes, tired brows, a small mouth, hot red cheeks and a drop of sweat).
// =============================================================================================
const bFace = 'M-14 -2C-14.5 9 -8 16 0 16C8 16 14.5 9 14 -2';
const bFaceFill = `${bFace}C12 -12 -12 -12 -14 -2Z`;
const bHair = 'M-15.5 2C-18 -10 -11 -18 0 -18C11 -18 18 -10 15.5 2C14 -4 10 -7.5 6 -6.5C3 -9 -3 -9.5 -6 -7C-10 -8 -14 -5 -15.5 2Z';
const bTuft = 'M-2 -17.5C-3 -22 0 -25 3 -24C1 -22 1 -20 2 -18';
const bEars = 'M-14 0C-18 -1 -19 5 -14.5 6M14 0C18 -1 19 5 14.5 6';

export function boyHead({ mood = 'happy' } = {}) {
  const fine = [bEars, 'M0 3c1.5 1 1.5 2.4 -0.5 2.8'];
  const fills = [];
  const glints = [];
  const washes = [
    { c: PAL.rose, o: 0.3, d: bFaceFill },
    { c: PAL.ochre, o: 0.85, d: bHair + bTuft },
  ];
  if (mood === 'sleep') {
    fine.push('M-8.5 1q3 2.6 6 0M2.5 1q3 2.6 6 0', 'M-3 9.5q3 2 6 0');
    washes.push({ c: PAL.rose, o: 0.55, d: dot(-8.5, 7, 2.8) + dot(8.5, 7, 2.8) });
  } else if (mood === 'ill') {
    fine.push('M-9 0.5q3.2 -1.4 6.4 0M2.6 0.5q3.2 -1.4 6.4 0', 'M-9 -4.5L-3 -5.5M9 -4.5L3 -5.5', 'M-2 10.5l4 0');
    fills.push('M-8.6 0.8q2.9 2.4 5.6 0ZM3 0.8q2.9 2.4 5.6 0Z');
    const drop = tear(13, -9, 6);
    fine.push(drop);
    washes.push({ c: PAL.red, o: 0.6, d: oval(-8.5, 6.5, 4.2, 3.4) + oval(8.5, 6.5, 4.2, 3.4) }, { c: PAL.rose, o: 0.35, d: bFaceFill }, { c: PAL.sky, o: 0.9, d: drop });
  } else {
    for (const x of [-5.5, 5.5]) {
      fills.push(dot(x, 1, 1.9));
      glints.push(dot(x - 0.5, 0.4, 0.55));
    }
    fine.push('M-4.5 8.5q4.5 4.5 9 0');
    washes.push({ c: PAL.rose, o: 0.55, d: dot(-9, 6.5, 2.6) + dot(9, 6.5, 2.6) });
  }
  return { lines: [bFace, bHair, bTuft], fine, washes, fills, glints };
}

/** A pyjama sleeve (limb along pts) with a round hand at its end: the Boy's arm. */
export function boyArm(pts, r = 4.4) {
  const n = pts.length;
  const [x, y] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.8, (r * 0.8) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[n - 1][2]]]);
  const h = dot(x, y, r);
  return { lines: [d], fine: [h], washes: [{ c: PAL.sky, o: 0.75, d: Z(d) }, { c: PAL.rose, o: 0.5, d: h }] };
}

// =============================================================================================
// THE BOY standing, side-on and walking to the right (feet at 0,0), about 100 tall, in his sky-blue
// pyjamas with slate stripes and bare feet, both arms reaching forward to (hx, hy) (the handles
// of the wheelbarrow). Head at B_HEAD.
// =============================================================================================
export const B_HEAD = [2, -82];
export function boy({ mood = 'happy', hands = [36, -44] } = {}) {
  const top = 'M-9 -66C-15 -62 -16 -52 -15 -40C-15 -36 -14 -33 -13 -31L13 -31C14 -36 14 -46 12 -56C11 -62 8 -66 4 -67C0 -68 -5 -68 -9 -66Z';
  const legs = [limb([[-6, -33, 11], [-10, -18, 9.5], [-14, -4, 8.5]]), limb([[5, -33, 11], [10, -18, 9.5], [15, -4, 8.5]])];
  const feet = 'M-19 -3C-21 1 -17 2 -9 1.5C-8 -1 -8 -3 -10 -4ZM10 -4C9 -1 10 1.5 14 1.5C20 2 23 0 21 -3Z';
  const stripes = 'M-14 -56L11 -58M-15 -46L13 -48M-15 -37L13 -38M-12 -24L-1 -26M5 -26L14 -24M-14 -12L-5 -14M8 -14L17 -12';
  const [hx, hy] = hands;
  const arm = boyArm([[2, -62, 10], [12, -54, 9], [24, -48, 8.5], [hx, hy, 8]]);
  const arm2 = boyArm([[-4, -60, 10], [6, -51, 9], [18, -46, 8.5], [hx - 4, hy + 2, 8]]);
  return merge(
    arm2,
    {
      lines: [top, ...legs, feet],
      fine: [stripes],
      washes: [
        { c: PAL.sky, o: 0.75, d: top + legs.map(Z).join('') },
        { c: PAL.rose, o: 0.5, d: feet },
      ],
    },
    arm,
    place(boyHead({ mood }), `translate(${B_HEAD[0]} ${B_HEAD[1]})`),
  );
}

// =============================================================================================
// THE BED (seen from the side, mattress top at y = 0, x from -150 to 150), with a wooden headboard
// on the left, a big white pillow and a patchwork quilt pulled up to y = qy at the pillow. The
// quilt's top edge starts at qx (where the Boy's chin is).
// =============================================================================================
export function bed({ qx = -60, qy = -22, hump = 10, F = 150 } = {}) {
  const E = F - 18; // the inside of the footboard
  const head = 'M-150 30L-150 -78C-150 -92 -126 -92 -126 -78L-126 30';
  const foot = `M${F} 30L${F} -30C${F} -40 ${E} -40 ${E} -30L${E} 30`;
  const frame = `M-126 6L${E} 6M-126 30L${E} 30M-144 30L-144 42M${F - 6} 30L${F - 6} 42`;
  const pillow = 'M-124 -6C-128 -26 -118 -40 -96 -40C-80 -40 -64 -38 -56 -32C-50 -26 -54 -10 -60 -4';
  const quilt = `M${qx} ${qy}C${qx + 40} ${qy - hump} ${qx + 90} ${qy - hump * 0.6} ${E - 4} -10C${E + 2} 0 ${E + 2} 14 ${E - 2} 22C60 26 -40 26 -122 20C-126 12 -124 2 -120 -2C-104 -6 ${qx - 16} ${qy + 4} ${qx} ${qy}Z`;
  const fold = `M${qx} ${qy}C${qx - 10} ${qy + 8} -108 4 -120 -2`;
  const xs = [];
  for (let x = -112; x + 28 <= E - 6; x += 42) xs.push(x);
  const sq = (list) => list.map((x) => `M${x} 4L${x + 28} 4L${x + 28} 21L${x} 21Z`).join('');
  const woodWash = Z(head) + Z(foot) + `M-126 6L${E} 6L${E} 30L-126 30Z`;
  return {
    lines: [head, foot, frame, pillow, quilt],
    fine: [fold, `M-121 4L${E - 2} 4`, sq(xs), `M-138 -60l0 20M-138 -20l0 30M${F - 9} -18l0 16`],
    washes: [
      { c: PAL.ochre, o: 0.55, d: woodWash },
      { c: PAL.terracotta, o: 0.3, d: woodWash },
      { c: PAL.grey, o: 0.18, d: Z(pillow) },
      { c: PAL.green, o: 0.55, d: quilt },
      { c: PAL.rose, o: 0.6, d: sq(xs.filter((x, i) => i % 2 === 0)) },
      { c: PAL.ochre, o: 0.6, d: sq(xs.filter((x, i) => i % 2 === 1)) },
    ],
  };
}

// =============================================================================================
// THE SKIN HORSE, lying down on his tummy and facing left (bottom at y = 0), about 170 long: an
// old brown toy horse, his coat worn into bald patches with the seams showing, a few hairs left in
// his mane, a sparse tail of thread, folded legs with dark hooves and a kind, wise eye.
// talking: his mouth a little open.
// =============================================================================================
const hBody = 'M-36 -42C-18 -52 30 -52 52 -42C66 -34 66 -12 54 -4C30 1 -16 1 -38 -4';
const hBodyFill = `${hBody}C-46 -14 -44 -34 -36 -42Z`;
const hNeck = 'M-44 -10C-50 -26 -54 -44 -60 -58M-34 -43C-38 -56 -42 -66 -46 -74';
const hHead =
  'M-46 -74C-52 -84 -64 -86 -72 -80C-80 -72 -88 -60 -92 -50C-95 -42 -90 -36 -82 -38C-76 -40 -68 -48 -62 -56';
const hHeadFill = `${hHead}L-60 -58L-46 -74Z`;
const hNeckFill = 'M-44 -10C-50 -26 -54 -44 -60 -58L-46 -74C-42 -66 -38 -56 -34 -43C-40 -30 -44 -20 -44 -10Z';
const hEars = 'M-58 -82L-56 -94L-50 -80M-64 -82L-66 -93L-58 -84';
const hForeLeg = limb([[-36, -10, 11], [-52, -6, 10], [-68, -4, 9]]);
const hHindLeg = limb([[40, -8, 13], [24, -2, 11], [8, -1, 10]]);
const hHooves = 'M-70 -9L-78 -9L-78 1L-70 1ZM6 -6L-2 -6L-2 4L6 4Z';
const hMane = 'M-40 -66c-6 0 -8 -4 -10 -8M-37 -56c-6 1 -9 -2 -12 -5M-35 -46c-5 2 -9 0 -11 -2M-48 -78c-2 -5 -6 -7 -9 -6';
const hTail = 'M60 -36C70 -34 74 -26 76 -14M61 -34C72 -34 80 -26 84 -18M60 -33C66 -28 68 -20 68 -10';
const hPatches = [oval(-6, -32, 11, 7), oval(30, -22, 9, 7.5), oval(-78, -60, 4.5, 3.5)];
const hSeams = 'M-16 -35l2 3M-11 -39l1 3M-3 -39l0 3M4 -36l-1 3M22 -26l2 2.5M28 -29l0 3M36 -27l-1 3M-82 -62l1 2M-75 -63l0 2.5';

export function skinHorse({ talking = true } = {}) {
  const mouth = talking ? 'M-91 -46C-86 -44 -82 -46 -80 -48M-88 -43C-85 -40 -82 -42 -81 -45' : 'M-91 -45C-86 -43 -82 -45 -80 -47';
  const coat = hBodyFill + hHeadFill + hNeckFill;
  return {
    lines: [hHindLeg, hBody, hNeck, hHead, hEars, hForeLeg, hTail],
    fine: [hHooves, hMane, ...hPatches, hSeams, mouth, 'M-86 -55c1.5 -1 3 -1 4 0', 'M-62 -76c3 -1 6 0 7 2'],
    washes: [
      // brown coat with bare holes where the hair has been loved off
      { c: PAL.terracotta, o: 0.62, d: coat + hPatches.join(''), rule: 'evenodd' },
      { c: PAL.grey, o: 0.45, d: coat + hPatches.join(''), rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.62, d: Z(hForeLeg) + Z(hHindLeg) },
      { c: PAL.ochre, o: 0.25, d: hPatches.join('') },
      { c: PAL.slate, o: 0.9, d: hHooves },
      { c: PAL.grey, o: 0.5, d: 'M-40 -66c-6 0 -8 -4 -10 -8l3 -1c2 3 4 6 9 7Z' },
    ],
    fills: [dot(-74, -66, 2.2)],
    glints: [dot(-74.6, -66.7, 0.6)],
  };
}

// =============================================================================================
// THE CLOCKWORK MOUSE (feet at y = 0, facing right), about 64 long: a smooth grey tin mouse with
// a round ear, a long curly tail and a silver key in his back; his nose stuck proudly in the air
// and his eye shut tight with scorn.
// =============================================================================================
export function clockworkMouse() {
  const body = 'M-24 -3C-28 -14 -18 -24 -4 -24C6 -24 12 -22 15 -19M22 -14C21 -6 16 -1 10 -1L-18 -1C-21 -1 -23 -2 -24 -3';
  const bodyFill = 'M-24 -3C-28 -14 -18 -24 -4 -24C6 -24 12 -22 15 -19L22 -14C21 -6 16 -1 10 -1L-18 -1C-21 -1 -23 -2 -24 -3Z';
  const head = 'M12 -20C8 -28 12 -36 20 -37C26 -38 32 -42 41 -48C39 -40 36 -32 32 -26C29 -20 24 -15 17 -15C14 -15 13 -17 12 -20Z';
  const ear = oval(13, -38, 6, 6.5);
  const tail = 'M-24 -6C-34 -4 -40 -10 -38 -18C-36 -24 -30 -22 -31 -18';
  const key = 'M-6 -24L-6 -33';
  const bow = oval(-12, -37, 6, 3.6) + oval(0, -37, 6, 3.6);
  const feet = 'M-12 -1L-14 2L-8 2M6 -1L4 2L10 2';
  const rivets = 'M-14 -10l0 0.1M-6 -6l0 0.1M2 -12l0 0.1';
  const whiskers = 'M38 -44l7 -8M38 -43l10 -4M37 -42l8 1';
  return {
    lines: [tail, body, head, ear, key, bow],
    fine: [feet, whiskers, 'M21 -32q3 2.6 6 0', 'M23 -34.5l5 -1.5', 'M-16 -16C-8 -18 0 -16 6 -12'],
    once: [rivets],
    washes: [
      { c: PAL.grey, o: 0.85, d: bodyFill + head },
      { c: PAL.slate, o: 0.35, d: bodyFill + head },
      { c: PAL.grey, o: 0.85, d: ear },
      { c: PAL.rose, o: 0.7, d: oval(13, -38, 3.4, 3.8) + dot(41, -48, 2.4) },
      { c: PAL.slate, o: 0.75, d: bow },
    ],
    whites: ['M-14 -20C-8 -22 0 -22 4 -21C-2 -19 -8 -18 -14 -16Z'],
  };
}

// =============================================================================================
// THE TINY FAIRY (feet at 0,0), about 46 tall: a little girl-fairy in a rose petal dress, with
// golden hair, gauzy sky-blue wings and a tiny star wand. lean: tilt forward (degrees, to the right).
// =============================================================================================
export function fairy({ lean = 0 } = {}) {
  const dress = 'M-3 -28C-6 -24 -9 -16 -11 -10C-7 -12 -5 -9 -2 -11C1 -9 4 -12 7 -10C5 -16 4 -24 2 -28C1 -29 -2 -29 -3 -28Z';
  const legs = 'M-3 -11L-4 0M3 -11L4 0M-6 0L-3 0M3 0L6 0';
  const head = oval(0, -34, 5, 5.5);
  const hair = 'M-5.5 -33C-7 -40 -3 -42 0 -42C4 -42 7 -40 5.5 -33C4 -37 1 -38 -1 -37C-3 -38 -5 -36 -5.5 -33Z';
  const bun = dot(-3, -42, 2.3);
  const wings = 'M-2 -26C-12 -36 -22 -34 -20 -26C-19 -20 -10 -20 -2 -24ZM-2 -24C-10 -20 -16 -12 -12 -9C-8 -7 -4 -14 -2 -22Z';
  const arm = 'M2 -26C6 -26 9 -28 11 -31';
  const arm2 = 'M-2 -26C-5 -22 -6 -18 -5 -15';
  const wand = 'M-5 -15L-12 -24';
  const out = {
    lines: [wings, dress, head],
    fine: [legs, hair, bun, arm, arm2, wand, sparkle(-13, -26, 3.5), 'M2 -32q1.5 1 2.5 0'],
    washes: [
      { c: PAL.sky, o: 0.55, d: wings },
      { c: PAL.rose, o: 0.9, d: dress },
      { c: PAL.rose, o: 0.3, d: head },
      { c: PAL.ochre, o: 0.9, d: hair + bun },
      { c: PAL.ochre, o: 0.9, d: dot(-13, -26, 2.6) },
    ],
    fills: [dot(2.2, -34.5, 0.9)],
  };
  return lean ? place(out, `rotate(${lean})`) : out;
}
