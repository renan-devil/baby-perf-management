import { PAL, transformPath } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Milkmaid and Her Pail: Perrette and her wooden pail of milk, shared by the two pictures. Each
// is drawn once here and placed in each picture with a transform (place). The build only draws files
// named <n>.mjs, so this file is not a picture. Perrette stands with her feet at y = 0.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

/** An arm along pts: a white blouse sleeve with a round rosy hand at its end. */
function arm(pts, hand = 4.2) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  // the white sleeve stops short of the hand, so the paper white does not cover its rosy wash
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.max(0, 1 - (hand * 1.1) / l);
  const sleeve = limb([...pts.slice(0, -1), [px + (x - px) * k, py + (y - py) * k, pts[pts.length - 1][2]]]);
  return { lines: [d], fine: [h], whites: [`${sleeve}Z`], washes: [{ c: PAL.rose, o: 0.7, d: h }] };
}

/**
 * Eyes and mouth (the face centre at 0,0). mood: 'happy' (eyes looking right, a wide smile) or
 * 'wow' (eyes wide open, a round "oh" mouth).
 */
function faceMarks(mood) {
  if (mood === 'wow') {
    return {
      whites: [dot(-4, -1, 2.9), dot(5, -1, 2.9)],
      fine: [dot(-4, -1, 2.9), dot(5, -1, 2.9), 'M-7 -6q3 -2.5 6 -0.5M2 -6.5q3 -2 6 0.5'],
      fills: [dot(-3.4, -0.7, 1.4), dot(5.6, -0.7, 1.4), oval(0.5, 6.5, 2, 2.6)],
      washes: [],
      glints: [],
    };
  }
  return {
    fills: [dot(-3.2, -1, 1.8), dot(5.8, -1, 1.8)],
    glints: [dot(-3.7, -1.6, 0.55), dot(5.3, -1.6, 0.55)],
    fine: ['M-4 5q5 5 10 0', 'M-6.5 -5.5q3 -1.8 6 -0.3M3 -6q3 -1.8 6 0'],
    washes: [],
    whites: [],
  };
}

// Perrette's head (centre of the face at 0,0): a round face with rosy cheeks, golden hair with a
// thick plait behind, and a little rolled cloth pad on top to carry the pail (its top at 0, -16).
const hFace = oval(0, 0, 11, 12);
const hHair = 'M-11.5 -1C-13 -11 -7 -15.5 0 -15.5C7 -15.5 13 -11 11.5 -1C10 -6 6 -9 1 -10C-3 -8 -8 -7 -11.5 -1Z';
const hPlait = limb([[-9, 3, 6.5], [-14, 10, 6], [-16, 18, 5]]);
const hPlaitMarks = 'M-13 6l5 1M-15 10.5l5 1.5M-16.5 15l4.5 1';
const hRibbon = 'M-16 20L-21 24L-17 26ZM-16 20L-12 25L-15 26Z';
const hPad = oval(0, -14.5, 9.5, 2.6);
export const HEAD_TOP = -16; // where the pail sits, in head coordinates

export function head({ mood = 'happy' } = {}) {
  const m = faceMarks(mood);
  return {
    lines: [hPlait, hFace, hHair],
    fine: [hPlaitMarks, hRibbon, hPad, 'M1 -10C1 -13 0 -14 -1 -15.5', ...m.fine],
    washes: [
      { c: PAL.ochre, o: 0.85, d: `${hHair}${hPlait}Z` },
      { c: PAL.rose, o: 0.3, d: hFace },
      { c: PAL.rose, o: 0.75, d: dot(-7, 5, 2.4) + dot(8.5, 5, 2.4) },
      { c: PAL.red, o: 0.85, d: hRibbon },
      ...m.washes,
    ],
    whites: [hPad, ...m.whites],
    fills: m.fills,
    glints: m.glints,
  };
}

// Perrette (feet at 0,0), about 114 tall to the top of her head: a white blouse, a red laced bodice,
// a green skirt with a white apron, stick legs and slate shoes. Head at (0, -98), turned by tilt.
export const P_HEAD = [0, -98];
export const P_ARMS = {
  // walking: the right hand steadies the pail at (17, -128), the left arm swings back
  steady: [
    [[-11, -80, 7.5], [-19, -68, 6.5], [-24, -57, 6.5]],
    [[11, -80, 7.5], [25, -96, 6.5], [18, -122, 6.5]],
  ],
  // both arms flung up for joy
  up: [
    [[-11, -80, 7.5], [-25, -92, 6.5], [-32, -108, 6.5]],
    [[11, -80, 7.5], [25, -92, 6.5], [33, -108, 6.5]],
  ],
};
const bBodice = 'M-11 -85C-14 -76 -14 -64 -12 -52L12 -52C14 -64 14 -76 11 -85';
const bBodiceFill = 'M-11 -85C-14 -76 -14 -64 -12 -52L12 -52C14 -64 14 -76 11 -85C5 -82 -5 -82 -11 -85Z';
const bCollar = 'M-8 -87C-4 -82 4 -82 8 -87';
const bLaces = 'M-4 -78L4 -73M4 -78L-4 -73M-4 -69L4 -64M4 -69L-4 -64M-4 -60L4 -56M4 -60L-4 -56';
const bBlouse = 'M-11 -85C-6 -90 6 -90 11 -85C5 -82 -5 -82 -11 -85Z';
const bSkirt = 'M-12 -52C-20 -40 -26 -28 -30 -16C-12 -12 12 -12 30 -16C26 -28 20 -40 12 -52';
const bSkirtFill = `${bSkirt}Z`;
const bApron = 'M-9 -51C-11 -40 -13 -28 -14 -17C-5 -15 5 -15 14 -17C13 -28 11 -40 9 -51Z';
const bFolds = 'M-20 -30C-22 -26 -23 -22 -24 -17M21 -32C23 -26 23 -22 24 -18M0 -46L0 -24';
const P_LEGS = {
  walk: { legs: 'M-6 -15L-14 -4M6 -15L14 -4', shoes: [oval(-16, -2.5, 5.5, 3.2), oval(16, -2.5, 5.5, 3.2)] },
  // a skip: the left knee bent back, the right leg kicked forward
  skip: {
    legs: 'M-6 -15L-15 -9L-21 -15M6 -15L14 -8L20 -4',
    shoes: [transformPath(oval(-23, -16, 5.5, 3.2), 'rotate(-40 -23 -16)'), transformPath(oval(23, -3, 5.5, 3.2), 'rotate(25 23 -3)')],
  },
};

export function perrette({ mood = 'happy', tilt = 0, arms = P_ARMS.steady, legs = 'walk' } = {}) {
  const L = P_LEGS[legs];
  return merge(
    {
      lines: [bSkirt, bBodice, L.legs, ...L.shoes],
      fine: [bLaces, bCollar, bFolds, bApron, bBlouse],
      washes: [
        { c: PAL.green, o: 0.65, d: bSkirtFill },
        { c: PAL.red, o: 0.8, d: bBodiceFill },
        { c: PAL.slate, o: 0.85, d: L.shoes.join('') },
      ],
      whites: [bApron, bBlouse],
    },
    place(head({ mood }), headT(tilt)),
    ...arms.map((a) => arm(a)),
  );
}

/** The transform that puts the head (and the pail resting on it) in place on Perrette's body. */
export const headT = (tilt = 0) => `translate(${P_HEAD[0]} ${P_HEAD[1]}) rotate(${tilt})`;

// The wooden pail (the middle of its bottom at 0,0), 24 tall: ochre staves, two slate hoops, a thin
// handle and fresh white milk right up to the brim. spilling: no milk on top (it is pouring out).
const pBody = 'M-11 0L-14 -24L14 -24L11 0Z';
const pRim = oval(0, -24, 14, 3.5);
const pHoops = 'M-11.6 -5C-4 -3.6 4 -3.6 11.6 -5M-13.3 -18.5C-4 -17 4 -17 13.3 -18.5';
const pStaves = 'M-5 -1L-6.5 -21M5 -1L6.5 -21M0 -1L0 -21';
const pHandle = 'M-14 -23C-14 -38 14 -38 14 -23';

export function pail({ spilling = false } = {}) {
  return {
    lines: [pBody, pRim],
    fine: [pHoops, pStaves, pHandle],
    washes: [
      { c: PAL.ochre, o: 0.82, d: pBody },
      { c: PAL.slate, o: 0.7, d: 'M-11.6 -5C-4 -3.6 4 -3.6 11.6 -5L11.4 -7C4 -5.6 -4 -5.6 -11.4 -7ZM-13.3 -18.5C-4 -17 4 -17 13.3 -18.5L13.1 -20.5C4 -19 -4 -19 -13.1 -20.5Z' },
      spilling ? { c: PAL.ochre, o: 0.5, d: pRim } : { c: PAL.sky, o: 0.25, d: pRim },
    ],
    whites: spilling ? [] : [oval(0, -24, 12.5, 2.6)],
  };
}
