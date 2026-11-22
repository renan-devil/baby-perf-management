import { PAL, hatch, transformPath } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Goose That Laid the Golden Eggs: the farmer, his wife, the white goose, her straw nest on a hay
// bale and the golden egg, shared by the two pictures. Each is drawn once here and placed in each
// picture with a transform (place). The build only draws files named <n>.mjs, so this file is not a
// picture. Standing people have their feet at y = 0 and look at us.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

/** An arm along pts: a sleeve of colour c with a round rosy hand at its end. */
function arm(pts, c, o = 0.6, hand = 4.6) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c, o, d: `${d}Z` }, { c: PAL.rose, o: 0.6, d: h }] };
}

/**
 * Eyes, brows and mouth (the face centre at 0,0, eyes at ±ex, ey). mood: 'wow' (eyes wide, a round
 * "oh" mouth, brows raised) or 'cross' (frowning brows, a grumpy turned-down mouth). look shifts the
 * pupils sideways.
 */
function faceMarks({ mood, ex, ey, my, look = 0 }) {
  if (mood === 'cross') {
    return {
      fills: [dot(-ex + look, ey, 1.8), dot(ex + look, ey, 1.8)],
      glints: [],
      fine: [`M${-ex - 4} ${ey - 6}L${-ex + 3} ${ey - 3}M${ex + 4} ${ey - 6}L${ex - 3} ${ey - 3}`, `M-5 ${my + 2}q5 -4 10 0`],
      whites: [],
    };
  }
  return {
    whites: [dot(-ex, ey, 3), dot(ex, ey, 3)],
    fine: [dot(-ex, ey, 3), dot(ex, ey, 3), `M${-ex - 3} ${ey - 6.5}q3 -2.5 6 -0.5M${ex - 3} ${ey - 7}q3 -2 6 0.5`],
    fills: [dot(-ex + look, ey + 0.3, 1.5), dot(ex + look, ey + 0.3, 1.5), oval(0, my + 1, 2.3, 3)],
    glints: [],
  };
}

// ---------------------------------------------------------------------------------------------
// The farmer's head (centre of the face at 0,0): a wide straw hat, a big rosy nose and a bushy
// terracotta beard round his chin.
const fFace = 'M-12.5 -6C-13.5 4 -8 13 0 13C8 13 13.5 4 12.5 -6';
const fFaceFill = `${fFace}C8 -9 -8 -9 -12.5 -6Z`;
const fBeard = 'M-13 0C-15 12 -8 22 0 22C8 22 15 12 13 0C10 8 6 11 0 11C-6 11 -10 8 -13 0Z';
const fBrim = 'M-30 -8C-26 -15 -14 -17 0 -17C14 -17 26 -15 31 -8C33 -4 29 -2 24 -4C14 -8 -14 -8 -24 -4C-29 -2 -33 -4 -30 -8Z';
const fCrown = 'M-14 -16C-16 -28 -10 -34 0 -34C10 -34 16 -28 14 -16';
const fBand = 'M-14 -16C-14.5 -18 -14.5 -20 -14.2 -22C-5 -24 5 -24 14.2 -22C14.5 -20 14.5 -18 14 -16C5 -18 -5 -18 -14 -16Z';
export function farmerHead({ mood = 'wow', look = 0 } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: -1, my: 6.5, look });
  return {
    lines: [fFace, fBrim, fCrown, fBeard],
    fine: [fBand, 'M-20 -10l3 -4M-10 -12l2 -4M6 -12l2 -4M18 -11l3 -4', 'M-6 -30l1 6M4 -31l-1 6', 'M-8 14q2 3 1 5M8 14q-2 3 -1 5', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: fFaceFill },
      { c: PAL.ochre, o: 0.85, d: `${fBrim}${fCrown}Z` },
      { c: PAL.red, o: 0.8, d: fBand },
      { c: PAL.terracotta, o: 0.85, d: fBeard },
      { c: PAL.rose, o: 0.85, d: dot(0, 2.5, 3.4) },
      { c: PAL.rose, o: 0.55, d: dot(-9, 4, 2.4) + dot(9, 4, 2.4) },
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, dot(-0.8, 1.4, 0.8)],
  };
}

// The farmer (feet at 0,0), about 150 tall: a sky-blue smock over grey trousers, slate boots. Head at
// (0, -122), turned by tilt; arms: two limb centrelines from the shoulders (±15, -102).
export const F_HEAD = [0, -122];
export const F_ARMS = {
  // amazed: the right hand flung up, the left hand open at his side
  wow: [
    [[-15, -102, 9], [-26, -86, 8], [-34, -72, 8]],
    [[15, -102, 9], [28, -110, 8], [34, -128, 8]],
  ],
  // both hands grab the nest to his right (at about x 34 to 62, y -46)
  shake: [
    [[-15, -102, 9], [2, -76, 8], [34, -47, 8]],
    [[15, -102, 9], [38, -80, 8], [62, -45, 8]],
  ],
};
const fSmock = 'M-12 -108C-20 -106 -22 -98 -22 -88C-24 -74 -26 -60 -28 -46C-10 -42 10 -42 28 -46C26 -60 24 -74 22 -88C22 -98 20 -106 12 -108C6 -105 -6 -105 -12 -108Z';
const fCollar = 'M-8 -107C-4 -101 4 -101 8 -107';
const fLegs = 'M-18 -45L-17 -8L-4 -8L-3 -44M3 -44L4 -8L17 -8L18 -45';
const fBoots = 'M-17 -8C-26 -8 -28 1 -22 1L-3 1L-4 -8ZM17 -8C26 -8 28 1 22 1L3 1L4 -8Z';
export function farmer({ mood = 'wow', look = 0, tilt = 0, arms = F_ARMS.wow } = {}) {
  return merge(
    {
      lines: [fLegs, fBoots, fSmock],
      fine: [fCollar, 'M0 -102L0 -80', dot(0, -94, 1.3), dot(0, -86, 1.3), 'M-14 -64q-1 8 -2 16M14 -66q1 8 2 18', 'M-10 -30l0 14M10 -30l0 14'],
      washes: [
        { c: PAL.sky, o: 0.7, d: fSmock },
        { c: PAL.grey, o: 0.8, d: 'M-18 -45L-17 -8L-4 -8L-3 -44ZM3 -44L4 -8L17 -8L18 -45Z' },
        { c: PAL.slate, o: 0.9, d: fBoots },
      ],
    },
    ...arms.map((a) => arm(a, PAL.sky, 0.7)),
    place(farmerHead({ mood, look }), `translate(${F_HEAD[0]} ${F_HEAD[1]}) rotate(${tilt}) scale(1.1)`),
  );
}

// ---------------------------------------------------------------------------------------------
// The farmer's wife's head (centre of the face at 0,0): terracotta hair in a round bun on top, a
// red flower tucked in it, rosy cheeks.
const wFace = 'M-11.6 -3C-12.5 6 -7 13 0 13C7 13 12.5 6 11.6 -3';
const wFaceFill = `${wFace}C8 -7 4 -9 0 -8C-4 -9 -8 -7 -11.6 -3Z`;
const wHair = 'M-12 -2C-14 -13 -8 -18 0 -18C8 -18 14 -13 12 -2C10 -7 5 -9 0 -8C-5 -9 -10 -7 -12 -2Z';
const wBun = 'M-8 -17C-10 -26 -4 -30 0 -30C5 -30 10 -26 8 -17';
export function wifeHead({ mood = 'wow', look = 0 } = {}) {
  const m = faceMarks({ mood, ex: 4.5, ey: 0, my: 6.5, look });
  return {
    lines: [wFace, wHair, wBun],
    fine: ['M-4 -24q3 2 6 -2M-6 -13q3 -2 6 -2', 'M0.5 2c1.5 1.2 1.5 2.4 -0.5 2.8', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: wFaceFill },
      { c: PAL.terracotta, o: 0.85, d: `${wHair}${wBun}Z` },
      { c: PAL.red, o: 0.9, d: dot(9, -16, 3.2) },
      { c: PAL.rose, o: 0.7, d: dot(-7.5, 5, 2.4) + dot(7.5, 5, 2.4) },
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

// The wife (feet at 0,0), about 132 tall: a long green dress, a white apron and a red neckerchief.
// Head at (0, -110); arms from the shoulders (±13, -92).
export const W_HEAD = [0, -110];
export const W_ARMS = {
  // amazed: both hands clasped up by her cheeks
  wow: [
    [[-13, -92, 8], [-24, -86, 7.5], [-15, -103, 7]],
    [[13, -92, 8], [24, -86, 7.5], [15, -103, 7]],
  ],
};
const wDress = 'M-10 -97C-18 -95 -20 -88 -20 -80C-21 -56 -25 -30 -28 -6C-10 -2 10 -2 28 -6C25 -30 21 -56 20 -80C20 -88 18 -95 10 -97C5 -94 -5 -94 -10 -97Z';
const wApron = 'M-13 -62L13 -62C15 -44 17 -26 17 -10C6 -8 -6 -8 -17 -10C-17 -26 -15 -44 -13 -62Z';
const wScarf = 'M-11 -98C-6 -92 6 -92 11 -98C12 -94 8 -86 0 -82C-8 -86 -12 -94 -11 -98Z';
const wFeet = 'M-12 -4C-18 -4 -19 2 -14 2L-4 2L-4 -4ZM12 -4C18 -4 19 2 14 2L4 2L4 -4Z';
export function wife({ mood = 'wow', look = 0, tilt = 0, arms = W_ARMS.wow } = {}) {
  return merge(
    {
      lines: [wFeet, wDress, wApron],
      fine: [wScarf, 'M-6 -40q1 10 0 22M7 -46q1 14 0 28', 'M-21 -30q-1 10 -2 18M21 -30q1 10 2 18', 'M-13 -62L-18 -76M13 -62L18 -76'],
      washes: [
        { c: PAL.green, o: 0.65, d: wDress },
        { c: PAL.red, o: 0.85, d: wScarf },
        { c: PAL.slate, o: 0.85, d: wFeet },
      ],
      whites: [wApron],
    },
    ...arms.map((a) => arm(a, PAL.green, 0.65, 4.2)),
    place(wifeHead({ mood, look }), `translate(${W_HEAD[0]} ${W_HEAD[1]}) rotate(${tilt})`),
  );
}

// ---------------------------------------------------------------------------------------------
// The goose's head (centre 0,0), beak to the right: a round white head, an orange beak with a knob,
// a beady eye. The outline is left open where the neck joins: neck 'up' (sitting, the neck below
// the head, joining at (-8, 4) and (5, 6.5)) or 'back' (flying, the neck behind, joining at (-9, -2)
// and (2, 8)). honk: the beak wide open and the eye wide (frightened).
const gTop = 'M8 -4C6 -10 -2 -11 -7 -7';
const gOpen = {
  up: [`${gTop}C-10 -4 -10 1 -8 4`, 'M8 3C7 5 6 6 5 6.5'],
  back: [`${gTop}C-9 -5 -9.5 -3.5 -9 -2`, 'M8 3C6 6 4 7 2 8'],
};
const gHeadFill = 'M8 -4C6 -10 -2 -11 -7 -7C-11 -3 -10 4 -5 7C0 9 6 7 8 3Z';
function gooseHead({ honk = false, neck = 'up' } = {}) {
  const beak = honk ? 'M7 -4C13 -8 19 -10 24 -10C20 -6 14 -3 8 -1ZM8 2C14 3 19 6 23 9C18 9 12 7 7 4Z' : 'M7 -4C12 -5 18 -3 22 0C18 2 12 3 7 3Z';
  const knob = oval(8, -3.5, 2.6, 2.4);
  const eye = honk ? [dot(0, -2, 2.6)] : [];
  return {
    lines: [...gOpen[neck], beak],
    fine: [knob, ...eye, honk ? 'M-4 -8q3 -4 7 -2' : ''].filter(Boolean),
    washes: [{ c: PAL.terracotta, o: 0.9, d: beak }, { c: PAL.ochre, o: 0.9, d: beak }, { c: PAL.terracotta, o: 0.9, d: knob }],
    whites: [gHeadFill, ...eye],
    fills: [dot(honk ? 0.5 : 0, -2, honk ? 1.4 : 1.7)],
    glints: [dot(-0.5, -2.6, 0.5)],
  };
}

// The goose sitting (the middle of her bottom at 0,0, where she sinks into the straw), facing right,
// about 90 long and 90 tall: a plump white body with a little tail flicked up behind, a folded wing
// and a long curving neck. The body's outline stops at the straw and where the neck joins.
const sBack = 'M-34 2C-40 -6 -42 -14 -40 -20C-44 -24 -47 -30 -48 -34C-40 -34 -32 -34 -26 -32C-14 -38 0 -38 12 -33';
const sBreast = 'M34 -24C37 -18 37 -10 35 -4C34 -1 32 0 29 0';
const sNeckFront = 'M34 -26C40 -40 38 -52 32 -60C28 -66 30 -72 32.6 -76';
const sNeckBack = 'M12 -33C20 -44 20 -54 16 -62C13 -68 15 -74 19.5 -77.2';
const sFill = `${sBack}L34 -26C37 -18 37 -10 35 -4C34 -1 32 0 29 0L-34 2Z${sNeckFront}L19.5 -77.2C15 -74 13 -68 16 -62C20 -54 20 -44 12 -33Z`;
const sWing = 'M24 -18C14 -30 -10 -32 -26 -22C-32 -18 -36 -15 -42 -15C-34 -10 -26 -8 -16 -8C-2 -8 14 -10 24 -18Z';
const sFeathers = 'M-34 -14l8 -1M-26 -12l9 -1M-16 -12q8 -2 14 -6M-4 -12q8 -2 14 -6M-44 -30l6 2';
export function gooseSitting() {
  return merge(
    {
      lines: [sBack, sBreast, sNeckFront, sNeckBack, sWing],
      fine: [sFeathers, 'M26 -6q-4 3 -10 3'],
      whites: [sFill],
    },
    place(gooseHead(), 'translate(27 -82) rotate(-6)'),
  );
}

// The goose flying (the middle of her body at 0,0), heading right: neck stretched forward, big wings
// beating up and orange feet tucked behind, about 130 long and 100 tall.
const yBody = 'M18 -13C8 -18 -12 -18 -30 -6C-34 -8 -40 -8 -46 -4L-32 4C-28 10 -18 16 -4 16C12 16 24 10 30 2';
const yNeckTop = 'M18 -13C24 -17 30 -20 36.8 -20.4';
const yNeckBottom = 'M30 2C36 -2 44 -8 49.4 -12.5';
const yFill = `${yBody}L49.4 -12.5L36.8 -20.4Z`;
const yWingFar = 'M6 -12C10 -32 18 -52 30 -70C36 -58 34 -42 28 -32C32 -28 30 -20 24 -14Z';
const yWingNear =
  'M-18 -8C-24 -30 -36 -52 -50 -74C-44 -70 -38 -68 -34 -68C-32 -62 -28 -60 -22 -60C-20 -54 -16 -52 -10 -52C-8 -46 -2 -44 2 -44C4 -34 6 -22 6 -10Z';
const yFeathers = 'M-36 -62L-24 -32M-24 -56L-14 -28M-12 -48L-6 -24M18 -50L18 -30M24 -40L20 -24';
const yFeet = 'M-16 14L-30 22L-24 16L-32 18L-18 10ZM-6 16L-18 26L-14 18L-20 20L-8 12Z';
export function gooseFlying({ honk = true } = {}) {
  return merge(
    {
      lines: [yWingFar, yBody, yNeckTop, yNeckBottom, yWingNear, yFeet],
      fine: [yFeathers, 'M-24 8q8 4 16 4', 'M-42 -2l6 0'],
      washes: [{ c: PAL.terracotta, o: 0.85, d: yFeet }, { c: PAL.ochre, o: 0.8, d: yFeet }, { c: PAL.grey, o: 0.35, d: yWingFar }],
      whites: [yFill, yWingNear],
    },
    place(gooseHead({ honk, neck: 'back' }), 'translate(46 -20) rotate(-10)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The hay bale (the middle of its bottom at 0,0), 110 wide and 44 tall, with the round straw nest on
// top (its rim at about y -56), tipped by tilt degrees when shaken. The goose sits at NEST_SEAT.
export const NEST_SEAT = [-8, -60];
const bale = 'M-55 0L-53 -44L53 -44L55 0Z';
const baleTop = 'M-53 -44C-46 -50 46 -50 53 -44';
const baleTies = 'M-26 -46L-27 0M26 -46L27 0';
// the nest: a thick ring of straw, its front lip in front of the goose
const nestBack = 'M-54 -58C-50 -70 50 -70 54 -58';
const nestFront = 'M-58 -56C-40 -63 40 -63 58 -56C61 -46 46 -38 0 -38C-46 -38 -61 -46 -58 -56Z';
export function baleAndNest({ tilt = 0 } = {}) {
  const nt = (d) => (tilt ? transformPath(d, `rotate(${tilt} 0 -50)`) : d);
  const straw = [
    hatch(-48, -24, 48, -24, 16, 12, 80, 51),
    hatch(-50, -52, 50, -52, 14, 10, 160, 52, 0.5),
    hatch(-52, -46, 52, -46, 14, 10, 20, 53, 0.5),
  ];
  return {
    lines: [bale, nt(nestFront), nt(nestBack)],
    fine: [baleTop, baleTies, straw[0], nt(straw[1]), nt(straw[2])],
    washes: [
      { c: PAL.ochre, o: 0.55, d: bale },
      { c: PAL.ochre, o: 0.75, d: nt(nestFront) },
      { c: PAL.terracotta, o: 0.35, d: nt(nestFront) },
      { c: PAL.ochre, o: 0.45, d: nt(`${nestBack}C40 -60 -40 -60 -54 -58Z`) },
    ],
  };
}

// The golden egg (the middle of its bottom at 0,0), 22 wide and 30 tall, shining.
const egg = 'M0 0C-8 0 -11 -7 -11 -13C-11 -22 -6 -30 0 -30C6 -30 11 -22 11 -13C11 -7 8 0 0 0Z';
export function goldenEgg() {
  return {
    lines: [egg],
    washes: [{ c: PAL.ochre, o: 0.95, d: egg }, { c: PAL.terracotta, o: 0.35, d: 'M4 -2C9 -5 10 -12 9 -18C7 -10 4 -6 -2 -2Z' }],
    whites: ['M-6 -18C-6 -23 -3 -26 -1 -26C-3 -22 -4 -19 -5 -15Z'],
  };
}
