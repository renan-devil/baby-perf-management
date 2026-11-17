import { PAL, transformPath } from '../lib.mjs';
import { dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Sweet Porridge: the little girl, her mother, the kind old woman, a neighbour and the little black
// magic pot, shared by the five pictures. Each is drawn once here and placed in each picture with a
// transform (place). The build only draws files named <n>.mjs, so this file is not a picture.
// Standing characters have their feet at y = 0 and look at us.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

/** An arm (limb along pts) with a round hand at its end. */
function arm(pts, sleeve, o = 0.62, hand = 3.8) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.55, d: h }] };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. mood: 'happy', 'mmm' (eyes shut, a contented smile),
 * 'laugh' (eyes shut, mouth wide open), 'wow' (eyes wide and round, brows up, mouth an "O"), 'shout'
 * (brows up, mouth wide open), 'sad' (brows up in the middle, a little frown), 'peep' / 'peepL'
 * (looking right / left, a small smile).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const shut = `M${-ex - 3} ${ey}q3 -3.4 6 0M${ex - 3} ${ey}q3 -3.4 6 0`;
  const open = (dx = 0, rr = r) => {
    fills.push(dot(-ex + dx, ey, rr), dot(ex + dx, ey, rr));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.55), dot(ex + dx - 0.5, ey - 0.6, 0.55));
  };
  if (mood === 'mmm') {
    fine.push(shut, `M${-w} ${my - 1}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 9} ${w} ${my + 9} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(shut, mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'wow') {
    whites.push(dot(-ex, ey, r + 1.6), dot(ex, ey, r + 1.6));
    fine.push(dot(-ex, ey, r + 1.6), dot(ex, ey, r + 1.6), `M${-ex - 3} ${ey - 6}q3 -3 6 -1M${ex - 3} ${ey - 7}q3 -2 6 1`);
    fills.push(dot(-ex, ey + 0.4, r * 0.8), dot(ex, ey + 0.4, r * 0.8));
    const mouth = oval(0, my + 2, 3, 3.8);
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.8, d: mouth });
  } else if (mood === 'shout') {
    open(0, r);
    fine.push(`M${-ex - 3} ${ey - 5}q3 -2 6 -1M${ex + 3} ${ey - 5}q-3 -2 -6 -1`);
    const mouth = oval(0, my + 2, 3.4, 4.2);
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.85, d: mouth });
  } else if (mood === 'sad') {
    open(0, r * 0.9);
    fine.push(`M${-ex - 3} ${ey - 4}l5 -2M${ex + 3} ${ey - 4}l-5 -2`, `M-3 ${my + 2}q3 -3 6 0`);
  } else {
    const dx = mood === 'peep' ? 1.2 : mood === 'peepL' ? -1.2 : 0;
    open(dx);
    fine.push(mood === 'happy' ? `M${-w} ${my - 1}q${w} 5 ${2 * w} 0` : `M-3 ${my}q3 2.4 6 0`);
  }
  return { fine, fills, glints, washes, whites };
}

// ---------------------------------------------------------------------------------------------
// The little girl's head (centre of the face at 0,0): auburn (terracotta) hair parted on one side,
// with two long plaits tied with sky-blue ribbons, and rosy cheeks.
const gFace = 'M-12.6 -2C-13 8 -6 14 0 14C6 14 13 8 12.6 -2';
const gFaceFill = `${gFace}C10 -6 6 -9 -2 -9C-8 -8 -11 -6 -12.6 -2Z`;
const gHair = 'M-13.5 1C-16 -12 -9 -19 0 -19C9 -19 16 -12 13.5 1C11 -6 7 -9 -2 -9.5C-8 -8 -11 -5 -13.5 1Z';
const gPlaitL = limb([[-12, 1, 7], [-15, 11, 6.4], [-16, 22, 5.6]]);
const gPlaitR = limb([[12, 1, 7], [15, 11, 6.4], [16, 22, 5.6]]);
const gPlaitMarks = 'M-16 5q3 2 6 -1M-17 10q3 2 6 -1M-18 15q3 2 6 -1M-18 20q3 1 5 -1M10 4q3 3 6 1M11 9q3 3 6 1M12 14q3 3 6 1M13 19q2 2 5 1';
const gBows = 'M-16 26L-22 23L-21 30ZM-16 26L-10 23L-11 30ZM16 26L10 23L11 30ZM16 26L22 23L21 30Z';
const gTufts = 'M-18 28l-1 5M-16 28l0 6M-14 28l1 5M14 28l-1 5M16 28l0 6M18 28l1 5';
export function girlHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 4.5, ey: 0, my: 7, r: 1.7, w: 4 });
  return {
    lines: [gFace, gHair, gPlaitL, gPlaitR],
    fine: [gPlaitMarks, gBows, gTufts, 'M-6 -15q-2 4 -1 7M4 -16q3 3 4 7', 'M0.5 2c1.6 1.2 1.6 2.4 -0.5 2.8', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: gFaceFill },
      { c: PAL.terracotta, o: 0.85, d: `${gHair}${gPlaitL}Z${gPlaitR}Z` },
      { c: PAL.sky, o: 0.95, d: gBows },
      { c: PAL.rose, o: 0.7, d: dot(-7.5, 5, 2.4) + dot(7.5, 5, 2.4) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

// The little girl (feet at 0,0), about 100 tall: a green dress with a white collar and an ochre
// patch, grey stockings and red shoes. Head at (0, -80), turned by tilt; arms from the shoulders
// (±12, -62). legs: 'stand' or 'run' (striding to the right). upper: only the part above y = -36
// (she sits behind the table). hold: the dress line is left out where she holds the pot in front
// of her (between y = -52 and y = -26).
export const G_HEAD = [0, -80];
export const G_ARMS = {
  down: [
    [[-12, -62, 7], [-16, -52, 6.5], [-18, -42, 6.5], [-18, -36, 6.5]],
    [[12, -62, 7], [16, -52, 6.5], [18, -42, 6.5], [18, -36, 6.5]],
  ],
  // both hands holding the pot in front of her tummy, at (±21, -40)
  hold: [
    [[-12, -62, 7], [-19, -55, 6.5], [-23, -47, 6.5], [-22, -40, 6.5]],
    [[12, -62, 7], [19, -55, 6.5], [23, -47, 6.5], [22, -40, 6.5]],
  ],
  // hands cupped round her mouth, elbows out
  cup: [
    [[-12, -62, 7], [-22, -60, 6.5], [-18, -68, 6], [-9, -73, 5.5]],
    [[12, -62, 7], [22, -60, 6.5], [18, -68, 6], [9, -73, 5.5]],
  ],
};
const G_LEGS = {
  stand: [[[-7, -17, 4.5], [-7, -4, 4]], [[7, -17, 4.5], [7, -4, 4]]],
  run: [[[-6, -17, 4.5], [-12, -10, 4.2], [-22, -9, 4]], [[6, -17, 4.5], [14, -10, 4.2], [15, -2, 4]]],
};
export function girl({ mood = 'happy', tilt = 0, arms = G_ARMS.down, legs = 'stand', upper = false, hold = false } = {}) {
  const top = 'M-7 -67C-13 -65 -15 -60 -15 -54';
  const topR = 'M7 -67C13 -65 15 -60 15 -54';
  let sides;
  if (upper) sides = `${top}C-15 -48 -16 -42 -16 -36${topR}C15 -48 16 -42 16 -36`;
  else if (hold) sides = `M-7 -67C-12 -65.5 -14 -62 -14.6 -58M7 -67C12 -65.5 14 -62 14.6 -58M-20.7 -26C-21.3 -22 -22 -18 -22 -18C-8 -15 8 -15 22 -18C22 -18 21.3 -22 20.7 -26`;
  else sides = `${top}C-17 -42 -20 -30 -22 -18C-8 -15 8 -15 22 -18C20 -30 17 -42 15 -54C15 -60 13 -65 7 -67`;
  let fill = upper
    ? 'M-7 -67C-13 -65 -15 -60 -15 -54C-15 -48 -16 -42 -16 -36L16 -36C16 -42 15 -48 15 -54C15 -60 13 -65 7 -67Z'
    : 'M-7 -67C-13 -65 -15 -60 -15 -54C-17 -42 -20 -30 -22 -18C-8 -15 8 -15 22 -18C20 -30 17 -42 15 -54C15 -60 13 -65 7 -67Z';
  // holding the pot: green only above the porridge and below the pot, so the gold stays gold
  if (hold) {
    const dome = transformPath(POT_DOME, HOLD_POT).replace(/^M/, 'L');
    fill = `M-7 -67C-13 -65 -15 -60 -15 -54L-16.6 -48${dome}L15 -54C15 -60 13 -65 7 -67ZM-20.7 -26C-21.3 -22 -22 -18 -22 -18C-8 -15 8 -15 22 -18L20.7 -26Z`;
  }
  const collar = 'M-8 -67C-9 -61 -2 -59 0 -63C2 -59 9 -61 8 -67C4 -68 -4 -68 -8 -67Z';
  const patch = 'M5 -32L13 -33L14 -24L6 -23Z';
  const lines = [sides];
  const fine = [collar];
  const washes = [{ c: PAL.green, o: 0.7, d: fill }];
  if (!upper && !hold) {
    fine.push(patch, 'M7 -29l5 0M8 -26l4 0', 'M-12 -30l3 1M-8 -44q1 8 0 14');
    washes.push({ c: PAL.ochre, o: 0.8, d: patch });
  }
  if (!upper) {
    const legPts = G_LEGS[legs];
    const ls = legPts.map((p) => limb(p));
    const shoes = legPts.map((p) => {
      const [x, y] = p[p.length - 1];
      const dir = legs === 'run' && x < 0 ? -1 : x < 0 ? -1 : 1;
      return `M${x - 3.5} ${y}C${x + dir * 6} ${y - 1} ${x + dir * 8} ${y + 4} ${x + dir * 4} ${y + 5}L${x - dir * 3} ${y + 5}C${x - dir * 5} ${y + 4} ${x - dir * 5} ${y + 1} ${x - 3.5} ${y}Z`;
    });
    lines.push(...ls, ...shoes);
    washes.push({ c: PAL.grey, o: 0.6, d: ls.map((d) => `${d}Z`).join('') }, { c: PAL.red, o: 0.8, d: shoes.join('') });
  }
  const parts = arms.map((a) => arm(a, PAL.green, 0.7, 3.6));
  const head = place(girlHead({ mood }), `translate(${G_HEAD[0]} ${G_HEAD[1]}) rotate(${tilt})`);
  return merge({ lines, fine, washes, whites: [collar] }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// The mother's head (centre of the face at 0,0): the same auburn hair as her girl, pinned up in a
// round bun, and rosy cheeks.
const mFace = 'M-13 -3C-14 8 -7 15 0 15C7 15 14 8 13 -3';
const mFaceFill = `${mFace}C11 -8 6 -10 0 -10C-6 -10 -11 -8 -13 -3Z`;
const mHair = 'M-14 1C-17 -12 -10 -20 0 -20C10 -20 17 -12 14 1C12 -7 6 -10 0 -10C-6 -10 -12 -7 -14 1Z';
const mBun = oval(0, -24, 8.5, 6.5);
export function motherHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 7.5, r: 1.8, w: 4.5 });
  return {
    lines: [mBun, mHair, mFace],
    fine: ['M-4 -26q4 3 8 0M-8 -16q4 -2 8 -3M2 -16q4 0 7 3', 'M0.6 2c1.8 1.3 1.8 2.6 -0.6 3', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: mFaceFill },
      { c: PAL.terracotta, o: 0.85, d: `${mHair}${mBun}` },
      { c: PAL.rose, o: 0.65, d: dot(-8.5, 6, 2.6) + dot(8.5, 6, 2.6) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

// The mother (feet at 0,0), about 150 tall: a long rose dress with a white apron and slate shoes.
// Head at (0, -127), drawn 1.1 times bigger and turned by tilt; arms from the shoulders (±18, -104).
// upper: only the part above y = -70 (she sits behind the table).
export const M_HEAD = [0, -127];
export const M_ARMS = {
  down: [
    [[-18, -104, 9], [-23, -90, 8.5], [-25, -76, 8.5], [-24, -68, 8.5]],
    [[18, -104, 9], [23, -90, 8.5], [25, -76, 8.5], [24, -68, 8.5]],
  ],
  // both hands flung up in alarm
  up: [
    [[-18, -104, 9], [-32, -112, 8.5], [-40, -126, 8.5], [-44, -142, 8.5]],
    [[18, -104, 9], [32, -112, 8.5], [40, -126, 8.5], [44, -142, 8.5]],
  ],
};
export function mother({ mood = 'happy', tilt = 0, arms = M_ARMS.down, upper = false } = {}) {
  const top = 'M-9 -112C-19 -110 -24 -104 -24 -94';
  const topR = 'M9 -112C19 -110 24 -104 24 -94';
  const sides = upper
    ? `${top}C-24 -86 -25 -78 -25 -70${topR}C24 -86 25 -78 25 -70`
    : `${top}C-25 -66 -28 -32 -30 -5${topR}C25 -66 28 -32 30 -5C12 -1 -12 -1 -30 -5`;
  const fill = upper
    ? `${top}C-24 -86 -25 -78 -25 -70L25 -70C25 -78 24 -86 24 -94C24 -104 19 -110 9 -112Z`
    : `${top}C-25 -66 -28 -32 -30 -5C-12 -1 12 -1 30 -5C28 -32 25 -66 24 -94C24 -104 19 -110 9 -112Z`;
  const bib = 'M-11 -100L11 -100L13 -80L-13 -80Z';
  const apron = 'M-15 -80L15 -80C17 -56 19 -30 19 -12C6 -10 -6 -10 -19 -12C-19 -30 -17 -56 -15 -80Z';
  const neck = 'M-6 -112C-4 -108 4 -108 6 -112';
  const lines = [sides];
  const fine = [neck];
  const whites = [];
  const washes = [{ c: PAL.rose, o: 0.75, d: fill }];
  if (upper) {
    fine.push('M-11 -100L-12 -70M11 -100L12 -70M-11 -100L11 -100M-24 -80L24 -80');
    whites.push('M-11 -100L11 -100L12 -70L-12 -70Z');
  } else {
    const shoes = 'M-12 -3C-19 -3 -20 2 -15 2L-4 2L-4 -3M12 -3C19 -3 20 2 15 2L4 2L4 -3';
    lines.push(apron, bib, shoes);
    fine.push('M-25 -80L-15 -80M15 -80L25 -80', 'M-6 -60q1 14 0 30M7 -54q1 12 0 26', 'M-24 -36q-1 10 -2 20M24 -36q1 10 2 20');
    whites.push(apron, bib);
    washes.push({ c: PAL.slate, o: 0.8, d: `${shoes}Z` });
  }
  const parts = arms.map((a) => arm(a, PAL.rose, 0.75, 4.4));
  const head = place(motherHead({ mood }), `translate(${M_HEAD[0]} ${M_HEAD[1]}) rotate(${tilt}) scale(1.1)`);
  return merge({ lines, fine, washes, whites }, ...parts, head);
}

// ---------------------------------------------------------------------------------------------
// The kind old woman's head (centre of the face at 0,0): a terracotta knitted shawl worn over her
// head like a hood, a grey fringe, a big round rosy nose and crinkly smiling eyes.
const oFace = 'M-11 -4C-12 6 -6 13 0 13C6 13 12 6 11 -4';
const oFaceFill = `${oFace}C8 -9 -8 -9 -11 -4Z`;
const oFringe = 'M-11 -4C-9 -10 9 -10 11 -4C7 -7 -7 -7 -11 -4Z';
const oHood = 'M-17 12C-23 -2 -19 -21 0 -22C19 -21 23 -2 17 12C14 4 13 -6 11 -4C8 -11 -8 -11 -11 -4C-13 -6 -14 4 -17 12Z';
export function oldWomanHead({ mood = 'mmm' } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: -1, my: 8, r: 1.6, w: 4 });
  return {
    lines: [oHood, oFace],
    fine: [oFringe, 'M-9 -14q9 -5 18 0M-12 -6q12 -10 24 0', 'M-10 1l-3 -1M10 1l3 -1M-9 3l-3 1M9 3l3 1', ...m.fine],
    washes: [
      { c: PAL.terracotta, o: 0.85, d: oHood },
      { c: PAL.grey, o: 0.8, d: oFringe },
      { c: PAL.rose, o: 0.3, d: oFaceFill },
      { c: PAL.rose, o: 0.85, d: dot(0, 3, 3.2) },
      { c: PAL.rose, o: 0.55, d: dot(-7.5, 6, 2.3) + dot(7.5, 6, 2.3) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, dot(-0.8, 2, 0.8)],
  };
}

// The old woman (feet at 0,0), about 135 tall and a little bent: a long slate dress, her terracotta
// shawl over her head and shoulders down to a point, with a fringe of tassels. Head at (2, -112),
// drawn 1.15 times bigger; arms from the shoulders (±19, -92).
export const O_HEAD = [2, -112];
export const O_ARMS = {
  down: [
    [[-19, -92, 9], [-23, -80, 8.5], [-25, -68, 8.5], [-24, -60, 8.5]],
    [[19, -92, 9], [23, -80, 8.5], [25, -68, 8.5], [24, -60, 8.5]],
  ],
};
export function oldWoman({ mood = 'mmm', tilt = 0, arms = O_ARMS.down } = {}) {
  const sides = 'M-12 -98C-22 -94 -26 -84 -26 -74C-27 -50 -30 -24 -31 -4M12 -98C22 -94 26 -84 26 -74C27 -50 30 -24 31 -4C12 -1 -12 -1 -31 -4';
  // the slate shows only below the shawl, so the shawl keeps its colour
  const fill = 'M-28 -68C-16 -66 -6 -58 0 -50C6 -58 16 -66 28 -68L26.3 -68C27 -50 30 -24 31 -4C12 -1 -12 -1 -31 -4C-30 -24 -27 -50 -26.3 -68Z';
  const shawl = 'M-18 -101C-28 -95 -30 -82 -28 -68C-16 -66 -6 -58 0 -50C6 -58 16 -66 28 -68C30 -82 28 -95 18 -101C10 -97 -10 -97 -18 -101Z';
  const tassels = 'M-26 -67l-1 5M-20 -65l-1 5M-14 -62l-1 5M-8 -58l0 5M-3 -53l0 5M3 -53l0 5M8 -58l0 5M14 -62l1 5M20 -65l1 5M26 -67l1 5';
  const feet = 'M-12 -3C-18 -3 -19 2 -14 2L-4 2L-4 -3M12 -3C18 -3 19 2 14 2L4 2L4 -3';
  const parts = arms.map((a) => arm(a, PAL.terracotta, 0.8, 4.3));
  const head = place(oldWomanHead({ mood }), `translate(${O_HEAD[0]} ${O_HEAD[1]}) rotate(${tilt}) scale(1.15)`);
  return merge(
    {
      lines: [sides, feet],
      fine: ['M-10 -40q1 14 0 30M10 -46q1 16 0 36', 'M-20 -40q-1 10 -2 24'],
      washes: [
        { c: PAL.slate, o: 0.72, d: fill },
        { c: PAL.grey, o: 0.8, d: `${feet}Z` },
      ],
    },
    { lines: [shawl], fine: [tassels, 'M-20 -92q4 8 2 18M20 -92q-4 8 -2 18M-6 -80l6 6l6 -6'], washes: [{ c: PAL.terracotta, o: 0.85, d: shawl }] },
    ...parts,
    head,
  );
}

/** The old woman's knobbly walking stick, standing on (0,0), about 120 tall. */
export function stick() {
  const s = limb([[0, 0, 4.5], [2, -50, 5], [-1, -100, 4.8], [1, -118, 5.5]]);
  return {
    lines: [s],
    fine: ['M2 -40l4 -4M-1 -82l-4 -3'],
    washes: [{ c: PAL.terracotta, o: 0.75, d: `${s}Z` }, { c: PAL.ochre, o: 0.5, d: `${s}Z` }],
  };
}

// ---------------------------------------------------------------------------------------------
// A neighbour (feet at 0,0), about 90 tall, small and round: a red cap, an ochre jacket, slate
// trousers. arms up, waving.
export function neighbour() {
  const face = oval(0, -70, 10, 10);
  const cap = 'M-11 -72C-12 -86 12 -86 11 -72C4 -75 -4 -75 -11 -72Z';
  const body = 'M-13 -58C-18 -50 -19 -36 -17 -26L17 -26C19 -36 18 -50 13 -58C6 -61 -6 -61 -13 -58Z';
  const legs = 'M-15 -26L-14 -2L-4 -2L-3 -26M3 -26L4 -2L14 -2L15 -26';
  const armL = limb([[-12, -54, 7], [-22, -62, 6.5], [-28, -76, 6.5]]);
  const armR = limb([[12, -54, 7], [22, -62, 6.5], [28, -76, 6.5]]);
  const hands = dot(-28, -78, 3.6) + dot(28, -78, 3.6);
  const mouth = oval(0, -65, 2.4, 3);
  return {
    lines: [face, cap, body, legs, armL, armR],
    fine: [hands, mouth, 'M-6 -82l-3 4M8 -81l2 4'],
    washes: [
      { c: PAL.rose, o: 0.35, d: face },
      { c: PAL.red, o: 0.8, d: cap },
      { c: PAL.ochre, o: 0.75, d: `${body}${armL}Z${armR}Z` },
      { c: PAL.slate, o: 0.75, d: legs },
      { c: PAL.rose, o: 0.6, d: hands },
      { c: PAL.red, o: 0.8, d: mouth },
    ],
    fills: [dot(-4, -71, 1.5), dot(4, -71, 1.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// The little black magic pot (feet at 0,0), about 40 wide and 34 tall: a round black belly with two
// little ear handles and three stubby feet; the mouth is the ellipse at (0, -34). inside: 'empty'
// (dark inside), 'porridge' (golden porridge with bubbles), 'heap' (porridge bubbling up over the
// rim and dripping down the sides), 'flood' (only the drips and the front of the rim: the picture
// draws the great heap of porridge pouring out).
export const POT_MOUTH = [0, -34];
const POT_DOME = 'M-19 -34C-23 -40 -17 -46 -11 -44C-9 -52 3 -54 7 -47C13 -51 23 -45 19 -34';
/** Where the pot sits when the little girl holds it in front of her (in her own coordinates). */
export const HOLD_POT = 'translate(0 -18) scale(0.85)';
const pBelly = 'M-18 -34C-25 -27 -25 -14 -16 -8C-10 -4 10 -4 16 -8C25 -14 25 -27 18 -34';
const pDrips = 'M-13 -30C-14 -26 -15 -21 -12.5 -19C-10 -21 -10 -25 -9 -29.5ZM6 -29C7 -24 7 -17 9.5 -15C12 -17 12 -24 12.5 -30Z';
export function pot({ inside = 'porridge' } = {}) {
  const outer = oval(0, -34, 19, 5);
  const inner = oval(0, -34, 15, 3.2);
  const legs = [limb([[-11, -7, 4], [-12, 0, 3.5]]), limb([[11, -7, 4], [12, 0, 3.5]])];
  const ears = 'M-21 -30c-6 -1 -7 7 -1 8M21 -30c6 -1 7 7 1 8';
  const lines = [pBelly, ...legs, ears];
  const fine = ['M-17 -18q2 6 7 9'];
  const spill = inside === 'heap' || inside === 'flood';
  const darkBody = `${pBelly}C12 -37.5 -12 -37.5 -18 -34Z`;
  // the black is cut away where golden porridge shows in front of it
  const darkFront = `${pBelly}C18 -30 10 -28.5 0 -28.5C-10 -28.5 -18 -30 -18 -34Z`;
  const dark = spill ? `${darkFront}${pDrips}` : inside === 'porridge' ? `${darkBody}${inner}` : darkBody;
  const washes = [
    { c: PAL.slate, o: 0.9, d: dark, rule: 'evenodd' },
    { c: PAL.ink, o: 0.72, d: dark, rule: 'evenodd' },
    { c: PAL.slate, o: 0.9, d: legs.map((d) => `${d}Z`).join('') },
    { c: PAL.ink, o: 0.55, d: legs.map((d) => `${d}Z`).join('') },
  ];
  const glints = ['M-19 -28C-21 -22 -20 -17 -17 -13C-18 -19 -18 -24 -16 -29Z'];
  const fills = [];
  if (inside === 'empty') {
    lines.push(outer);
    fine.push(inner);
    washes.push({ c: PAL.ink, o: 0.6, d: inner });
  } else if (inside === 'porridge') {
    lines.push(outer);
    fine.push(inner, dot(-7, -34, 1.6), dot(5, -33.5, 1.2), dot(9, -35, 1));
    washes.push({ c: PAL.ochre, o: 0.85, d: inner });
  } else if (inside === 'flood') {
    // porridge pours out over the rim (the picture draws the great heap of it) and down the sides
    lines.push('M-19 -34C-19 -30 -10 -28.5 0 -28.5C10 -28.5 19 -30 19 -34');
    fine.push(pDrips);
    washes.push({ c: PAL.ochre, o: 0.9, d: pDrips });
  } else {
    // a golden dome of porridge rises over the rim (hiding its back) and two drips run down
    const dome = POT_DOME;
    const domeFill = `${dome}C19 -30 10 -29 0 -29C-10 -29 -19 -30 -19 -34Z`;
    const front = 'M-19 -34C-19 -30 -10 -28.5 0 -28.5C10 -28.5 19 -30 19 -34';
    lines.push(front, dome);
    fine.push(pDrips, dot(-8, -38, 2.2), dot(4, -42, 1.7), dot(11, -37, 1.4), dot(-2, -35, 1.2), 'M-14 -40q2 -3 5 -2M2 -48q3 -2 6 0');
    washes.push({ c: PAL.ochre, o: 0.9, d: `${domeFill}${pDrips}` });
  }
  return { lines, fine, washes, glints, fills };
}

/** Curls of steam rising from (0,0), about h tall. */
export function steam(n = 3, h = 40, gap = 12) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = f((i - (n - 1) / 2) * gap);
    d += `M${x} 0c-5 -${f(h / 6)} 5 -${f(h / 3)} 0 -${f(h / 2)}c-5 -${f(h / 6)} 5 -${f(h / 3)} 0 -${f(h / 2)}`;
  }
  return { fine: [d] };
}

/** A round white bowl (rim centre at 0,0), about 34 wide, with a band round it and porridge in it.
 * Its paper-white body hides whatever is behind it. */
export function bowl(full = true) {
  const body = 'M-17 0C-17 12 -9 16 0 16C9 16 17 12 17 0';
  const rim = oval(0, 0, 17, 4);
  const foot = 'M-7 15L-8 19L8 19L7 15';
  const inside = oval(0, 0, 14, 2.6);
  return {
    lines: [body, rim, foot],
    fine: ['M-16 5C-10 9 10 9 16 5', ...(full ? [inside] : [])],
    whites: [`${body}C17 4 -17 4 -17 0Z`, `${foot}Z`],
    washes: full ? [{ c: PAL.ochre, o: 0.9, d: inside }] : [],
  };
}

/** A wooden spoon from the handle end (0,0) to the bowl, along +y, about len long. */
export function spoon(len = 30) {
  const handle = limb([[0, 0, 2.6], [0, len - 6, 2.6]]);
  const b = oval(0, len - 3, 3.6, 5);
  return { lines: [handle, b], washes: [{ c: PAL.ochre, o: 0.85, d: `${handle}Z${b}` }, { c: PAL.terracotta, o: 0.3, d: `${handle}Z${b}` }] };
}

