import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Cao Chong Weighs the Elephant: the big grey elephant, the great lord and little Cao Chong, drawn
// once here and placed in each picture with a transform (place). The build only draws files named
// <n>.mjs, so this file is not a picture. Standing characters have their feet at y = 0.

export { at, compose, dot, f, merge, oval, place };

const Z = (d) => `${d}Z`;

// =============================================================================================
// THE ELEPHANT (feet at y = 0, about 135 tall and 175 long), facing LEFT: a big round back, a
// floppy ear, a long trunk curling out at the tip, four pillar legs and a little tufted tail.
// =============================================================================================
const elBack = 'M-46 -112C-28 -130 10 -134 36 -122C62 -110 72 -84 68 -54C66 -42 62 -34 60 -30';
const elHead = 'M-46 -112C-58 -124 -82 -122 -92 -106C-99 -94 -97 -82 -94 -76';
const elTrunk = limb([
  [-86, -80, 22],
  [-93, -60, 17],
  [-96, -38, 13],
  [-96, -20, 10.5],
  [-102, -9, 8.5],
  [-110, -8, 7],
]);
const elChin = 'M-76 -72C-72 -64 -64 -60 -54 -58';
const elMouth = 'M-74 -68C-70 -62 -64 -62 -62 -66';
const elFrontLeg = 'M-54 -58L-54 0L-30 0L-30 -40';
const elFarFront = 'M-30 -3L-14 -3L-14 -38';
const elBelly = 'M-14 -38C-2 -42 12 -42 22 -38';
const elFarBack = 'M22 -38L22 -3L38 -3';
const elBackLeg = 'M38 -38L38 0L61 0L60 -30';
const elEar = 'M-54 -108C-38 -122 -14 -114 -12 -92C-10 -72 -22 -58 -38 -60C-48 -62 -50 -70 -58 -76';
const elEarIn = 'M-44 -100C-32 -106 -22 -98 -22 -88C-22 -78 -28 -72 -36 -72';
const elTail = 'M66 -74C74 -66 76 -54 74 -42M74 -42l-4 8M74 -42l1 9M74 -42l5 7';
const elToes = 'M-52 0q3 -4 6 0M-44 0q3 -4 6 0M-37 0q3 -4 6 0M40 0q3 -4 6 0M48 0q3 -4 6 0M55 0q2 -4 5 0';
const elTrunkLines = 'M-100 -46q5 1 9 -1M-100 -36q5 1 9 -1M-100 -26q4 1 8 -1M-104 -15q3 2 6 0';
const elKnees = 'M-50 -20q8 3 16 0M42 -20q8 3 15 0';
const elWrinkles = 'M10 -110q6 4 12 2M30 -96q5 3 10 1M-2 -64q6 2 12 0';
const elEye = [-72, -96];
const elBodyWash =
  'M-46 -114C-28 -132 10 -136 36 -124C62 -112 72 -84 68 -54C66 -42 62 -34 61 0L38 0L38 -3L22 -3L22 -38C12 -42 -2 -42 -14 -38L-14 -3L-30 -3L-30 0L-54 0L-54 -58C-64 -60 -72 -64 -76 -72L-80 -76C-90 -76 -98 -84 -96 -96C-94 -112 -80 -124 -64 -122C-56 -121 -50 -118 -46 -114Z';
const elFarWash = 'M-30 -40L-30 -3L-14 -3L-14 -38ZM22 -38L22 -3L38 -3L38 -38Z';
const elEarWash = Z(elEar) + 'C-58 -76 -60 -96 -54 -108Z';

/** The elephant; look: pupil offset [dx, dy]. */
export function elephant({ look = [0, 0] } = {}) {
  const [ex, ey] = elEye;
  return {
    lines: [elBack, elHead, elTrunk, elChin, elFrontLeg, elFarFront, elBelly, elFarBack, elBackLeg, elEar, elTail],
    fine: [elEarIn, elToes, elTrunkLines, elKnees, elWrinkles, elMouth, `M${ex - 6} ${ey - 9}q6 -4 12 -1`, oval(ex, ey, 4.2, 4.6)],
    washes: [
      { c: PAL.grey, o: 0.75, d: Z(elTrunk) + elBodyWash },
      { c: PAL.slate, o: 0.35, d: elBodyWash },
      { c: PAL.slate, o: 0.25, d: Z(elTrunk) },
      { c: PAL.slate, o: 0.45, d: elFarWash },
      { c: PAL.slate, o: 0.32, d: elEarWash },
      { c: PAL.rose, o: 0.55, d: 'M-42 -98C-32 -102 -24 -96 -24 -88C-24 -80 -30 -74 -36 -74C-40 -82 -40 -90 -42 -98Z' },
    ],
    whites: [oval(ex, ey, 4.2, 4.6)],
    fills: [dot(ex + look[0], ey + 0.5 + look[1], 2.3)],
    glints: [dot(ex + look[0] - 0.8, ey - 0.4 + look[1], 0.8)],
  };
}

// =============================================================================================
// Faces: a round face with dot eyes looking left or right (look), small brows and a little mouth.
// =============================================================================================
function face({ r, look = 0, lookY = 0, mood = 'happy', eyeY = -1, ex = 0.32 }) {
  const dx = look * 1.2;
  const dy = lookY * 1.1;
  const e = r * ex;
  const fills = [dot(-e + dx, eyeY + dy, 1.8), dot(e + dx, eyeY + dy, 1.8)];
  const glints = [dot(-e + dx - 0.5, eyeY + dy - 0.6, 0.55), dot(e + dx - 0.5, eyeY + dy - 0.6, 0.55)];
  const my = r * 0.45;
  const fine = [];
  if (mood === 'puzzled') {
    // one brow up, one flat; a small wavy mouth
    fine.push(`M${-e - 3} ${eyeY - 6}q3 -3.5 6 -1.5M${e - 3} ${eyeY - 5}l6 -0.5`);
    fine.push(`M${-3.5} ${my + 3}q1.75 -1.6 3.5 0q1.75 1.6 3.5 0`);
  } else if (mood === 'bright') {
    // eyebrows up, a big open smile
    fine.push(`M${-e - 3} ${eyeY - 5.5}q3 -2.5 6 0M${e - 3} ${eyeY - 5.5}q3 -2.5 6 0`);
    const m = `M${-4.5} ${my - 1}C${-4} ${my + 5} ${4} ${my + 5} ${4.5} ${my - 1}C${2} ${my} ${-2} ${my} ${-4.5} ${my - 1}Z`;
    fine.push(m);
    return { fine, fills, glints, washes: [{ c: PAL.red, o: 0.8, d: m }] };
  } else {
    fine.push(`M${-e - 3} ${eyeY - 5}q3 -2 6 0M${e - 3} ${eyeY - 5}q3 -2 6 0`);
    fine.push(`M-4 ${my}q4 3.5 8 0`);
  }
  return { fine, fills, glints, washes: [] };
}

// =============================================================================================
// THE GREAT LORD (feet at 0,0), about 150 tall: a long red-brown robe crossed at the neck with an
// ochre sash, wide sleeves, a small black cap with a little crown piece on top, a neat short beard.
// Head centre at L_HEAD. pose: 'puzzled' (one hand at his chin, the other hidden in his sleeve).
// =============================================================================================
export const L_HEAD = [0, -128];
const lFace = oval(0, 0, 14, 16);
const lCap = 'M-14 -6C-15 -18 -8 -22 0 -22C8 -22 15 -18 14 -6C8 -10 -8 -10 -14 -6Z';
const lCapTop = 'M-6 -20L-7 -31C-3 -33 3 -33 7 -31L6 -20';
const lBeard = 'M-4 13C-3 18 -1 22 0 24C1 22 3 18 4 13C2 14 -2 14 -4 13Z';
const lTache = 'M-6 5.5C-3 3.5 -1 4 0 4.6C1 4 3 3.5 6 5.5';
export function lordHead({ look = 0, mood = 'puzzled' } = {}) {
  const m = face({ r: 14, look, mood, eyeY: -2 });
  return {
    lines: [lFace, lCap, lCapTop],
    fine: [lTache, lBeard, 'M-14 -2q-3 2 0 6M14 -2q3 2 0 6', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.35, d: lFace },
      { c: PAL.ink, o: 0.85, d: lCap + Z(lCapTop) },
      { c: PAL.ink, o: 0.6, d: lBeard },
      { c: PAL.rose, o: 0.5, d: dot(-8, 5, 2.6) + dot(8, 5, 2.6) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}

const lRobe = 'M-12 -112C-26 -108 -32 -92 -34 -70C-36 -46 -40 -20 -44 -2C-20 2 20 2 44 -2C40 -20 36 -46 34 -70C32 -92 26 -108 12 -112';
const lCollar = 'M-12 -112L6 -84M12 -112L-1 -94';
const lSash = 'M-34 -70C-12 -64 12 -64 34 -70L34.5 -62C12 -56 -12 -56 -34.5 -62Z';
const lHem = 'M-43 -10C-20 -6 20 -6 43 -10';
const lFolds = 'M-18 -54q-4 24 -8 50M16 -54q4 24 7 50M0 -56l0 54';
const lShoes = 'M-22 -1C-26 3 -20 6 -12 5L-6 0M22 -1C26 3 20 6 12 5L6 0';

/** The lord. pose 'puzzled': right hand (on our right) up at his chin, left arm down in its sleeve. */
export function lord({ look = 1, mood = 'puzzled' } = {}) {
  // a wide sleeve falling from the shoulder (our left), the hand tucked inside
  const sleeveL = 'M-24 -104C-40 -96 -46 -74 -48 -54C-48 -46 -42 -42 -34 -44C-30 -60 -28 -78 -24 -92';
  // the other arm bent up across the chest, the hand at the chin
  const sleeveR = 'M22 -104C32 -98 34 -86 29 -80C24 -75 16 -80 9 -88C6 -92 6 -96 9 -100';
  const hand = oval(9, -108, 5, 4.6);
  return merge(
    {
      lines: [lRobe, sleeveL, sleeveR, lShoes],
      fine: [lCollar, lSash, lHem, lFolds, 'M-44 -50q6 -3 10 0M10 -92q8 6 16 4', hand],
      washes: [
        { c: PAL.terracotta, o: 0.8, d: Z(lRobe) + Z(sleeveL) + Z(sleeveR) },
        { c: PAL.ochre, o: 0.95, d: lSash + 'M-43 -10C-20 -6 20 -6 43 -10L44 -2C20 2 -20 2 -44 -2Z' },
        { c: PAL.ink, o: 0.8, d: Z(lShoes) },
      ],
      whites: ['M-12 -112L0 -96L12 -112C6 -114 -6 -114 -12 -112Z'],
    },
    place(lordHead({ look, mood }), `translate(${L_HEAD[0]} ${L_HEAD[1]})`),
    { lines: [hand], washes: [{ c: PAL.rose, o: 0.55, d: hand }] },
  );
}

// =============================================================================================
// LITTLE CAO CHONG (feet at 0,0), about 92 tall: a sky-blue tunic crossed at the neck with a green
// sash, grey trousers, black hair with a little topknot tied with a red ribbon.
// Head centre at C_HEAD; arms from the shoulders (±10, -54). arms: two centrelines [[x, y, w]…].
// =============================================================================================
export const C_HEAD = [0, -70];
export const C_ARMS = {
  down: [
    [[-10, -53, 8], [-15, -42, 7.5], [-17, -32, 7.5]],
    [[10, -53, 8], [15, -42, 7.5], [17, -32, 7.5]],
  ],
};
const cFace = oval(0, 0, 12, 13);
const cHair = 'M-12.5 -1C-14 -12 -7 -15 0 -15C7 -15 14 -12 12.5 -1C9 -8 4 -9 0 -7C-4 -9 -9 -8 -12.5 -1Z';
const cBun = oval(0, -19, 5.5, 5);
export function boyHead({ look = 0, lookY = 0, mood = 'happy' } = {}) {
  const m = face({ r: 12, look, lookY, mood, eyeY: 1, ex: 0.36 });
  const tie = 'M-5 -14.5C-2 -13 2 -13 5 -14.5';
  return {
    lines: [cFace, cHair, cBun],
    fine: [tie, 'M-12 2q-3 2 0 5M12 2q3 2 0 5', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: cFace },
      { c: PAL.ink, o: 0.85, d: cHair + cBun },
      { c: PAL.red, o: 0.95, d: 'M-5.5 -15.5C-2 -12.5 2 -12.5 5.5 -15.5L5 -13C2 -11 -2 -11 -5 -13Z' },
      { c: PAL.rose, o: 0.6, d: dot(-7, 6, 2.3) + dot(7, 6, 2.3) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}

function arm(pts, hand = 3.8) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: PAL.sky, o: 0.85, d: Z(d) }, { c: PAL.rose, o: 0.55, d: h }] };
}

export function boy({ look = 0, lookY = 0, mood = 'happy', arms = C_ARMS.down, tilt = 0 } = {}) {
  const tunic = 'M-9 -58C-15 -56 -17 -50 -17 -42C-18 -34 -19 -26 -20 -20C-7 -17 7 -17 20 -20C19 -26 18 -34 17 -42C17 -50 15 -56 9 -58';
  const collar = 'M-9 -58L4 -40M9 -58L-1 -50';
  const sash = 'M-17.5 -36C-6 -33 6 -33 17.5 -36L18 -31C6 -28 -6 -28 -18 -31Z';
  const legs = [limb([[-7, -19, 8], [-7, -3, 7]]), limb([[7, -19, 8], [7, -3, 7]])];
  const shoes = 'M-3 -3C-4 1 -10 2 -13 0C-13 -3 -11 -4 -9 -4ZM3 -3C4 1 10 2 13 0C13 -3 11 -4 9 -4Z';
  return merge(
    {
      lines: [...legs, shoes, tunic],
      fine: [collar, sash, 'M-10 -26l2 -6M10 -27l-2 -5'],
      washes: [
        { c: PAL.grey, o: 0.6, d: legs.map(Z).join('') },
        { c: PAL.ink, o: 0.8, d: shoes },
        { c: PAL.sky, o: 0.9, d: Z(tunic) },
        { c: PAL.green, o: 0.95, d: sash },
      ],
      whites: ['M-9 -58L0 -47L9 -58C4 -60 -4 -60 -9 -58Z'],
    },
    ...arms.map((a) => arm(a)),
    place(boyHead({ look, lookY, mood }), `translate(${C_HEAD[0]} ${C_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// Scenery: river ripples and a wavy bank.
// =============================================================================================
/** Little wavy ripple strokes, one per [x, y, length]. */
export const ripples = (list) =>
  list.map(([x, y, l]) => `M${x} ${y}q${f(l / 4)} -2.5 ${f(l / 2)} 0q${f(l / 4)} 2.5 ${f(l / 2)} 0`).join('');
