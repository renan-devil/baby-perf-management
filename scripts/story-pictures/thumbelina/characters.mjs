import { PAL, transformPath } from '../lib.mjs';
import { dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Thumbelina: the characters shared by the ten pictures, drawn once here and placed in each picture
// with a transform (place). The build only draws files named <n>.mjs, so this file is not a picture.
// Standing characters have their feet at y = 0 and look at us; birds and beetles fly to the right.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

/** Eyes at (±ex, ey), mouth at my. mood: 'happy', 'sleep' (eyes shut, tiny mouth), 'wow' (round
 * mouth), 'joy' (eyes shut in a smile, mouth open), 'peep' / 'peepL' (looking right / left). */
function faceMarks({ mood, ex = 4.5, ey = 0, my = 7, r = 1.7, w = 4 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  if (mood === 'sleep') {
    fine.push(`M${-ex - 2.6} ${ey}q2.6 2.6 5.2 0M${ex - 2.6} ${ey}q2.6 2.6 5.2 0`, `M-1.6 ${my}q1.6 1.2 3.2 0`);
  } else if (mood === 'joy') {
    const mouth = `M${-w} ${my - 1}C${-w} ${my + 6} ${w} ${my + 6} ${w} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w} ${my - 1}Z`;
    fine.push(`M${-ex - 2.6} ${ey + 1}q2.6 -3.2 5.2 0M${ex - 2.6} ${ey + 1}q2.6 -3.2 5.2 0`, mouth);
    washes.push({ c: PAL.red, o: 0.7, d: mouth });
  } else {
    const dx = mood === 'peep' ? 1.2 : mood === 'peepL' ? -1.2 : 0;
    fills.push(dot(-ex + dx, ey, r), dot(ex + dx, ey, r));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.5), dot(ex + dx - 0.5, ey - 0.6, 0.5));
    if (mood === 'wow') fills.push(dot(0, my + 1, 1.8));
    else fine.push(`M${-w} ${my}q${w} 4.4 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

/** An arm along pts with a round hand; skin-coloured, with a puffed sleeve at the shoulder. */
function arm(pts, sleeve = PAL.rose) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const [sx, sy] = pts[0];
  const h = dot(x, y, 3.4);
  const puff = oval(sx, sy + 1, 5.4, 4.6);
  return {
    lines: [d, puff],
    fine: [h],
    washes: [{ c: PAL.rose, o: 0.3, d: `${d}Z${h}` }, { c: sleeve, o: 0.8, d: puff }],
  };
}

// ---------------------------------------------------------------------------------------------
// Thumbelina's head (centre of the face at 0,0): long ochre hair with a parted fringe falling to her
// shoulders, a little red flower behind her ear, rosy cheeks. wind: the hair streams out to the left.
const tFace = 'M-12.6 -2C-13 8 -6 14 0 14C6 14 13 8 12.6 -2';
const tFaceFill = `${tFace}C11 -8 6 -10 0 -8C-5 -10 -10 -8 -12.6 -2Z`;
const tCap = 'M-13 -1C-15 -13 -8 -19 0 -19C8 -19 15 -13 13 -1C11 -8 6 -10 0 -8C-5 -10 -10 -8 -13 -1Z';
const tLockL = 'M-12 -10C-20 -4 -22 12 -20 28C-19 33 -14 34 -11 30C-13 22 -13 12 -12 2';
const tLockR = 'M12 -10C20 -4 22 12 20 28C19 33 14 34 11 30C13 22 13 12 12 2';
const tWind = 'M-10 -15C-26 -20 -44 -12 -62 -18C-56 -8 -46 -2 -32 -2C-42 4 -52 8 -62 6C-50 18 -30 16 -12 4';
const tFlower = (x, y) => [dot(x - 2.6, y, 2.4), dot(x + 2.6, y, 2.4), dot(x, y - 2.6, 2.4), dot(x, y + 2.6, 2.4)].join('');

export function thumbHead({ mood = 'happy', wind = false } = {}) {
  const m = faceMarks({ mood });
  const locks = wind ? [tWind] : [tLockL, tLockR];
  const flower = tFlower(wind ? 11 : 12, -11);
  return {
    lines: [...locks, tFace, tCap],
    fine: ['M-5 -12q2 3 1 5M3 -14q1 3 0 5', 'M0.5 2c1.6 1.2 1.6 2.4 -0.5 2.8', flower, ...m.fine],
    washes: [
      { c: PAL.ochre, o: 0.9, d: locks.map((d) => `${d}Z`).join('') + tCap },
      { c: PAL.rose, o: 0.3, d: tFaceFill },
      { c: PAL.red, o: 0.85, d: flower },
      { c: PAL.rose, o: 0.7, d: dot(-7.5, 5, 2.4) + dot(7.5, 5, 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, dot(wind ? 11 : 12, -11, 1)],
  };
}

// Thumbelina (feet at 0,0), about 100 tall: a rose dress with a petal hem and puffed sleeves. Head at
// (0,-80); arms from the shoulders (±12,-62).
// pose: 'stand' (legs and little terracotta slippers), 'upper' (only above y = -36: in a flower, in a
// hole, on the swallow's back), 'kneel' (shorter, the skirt spread on the ground).
// arms: a key of TH_ARMS or two centrelines. wings: gauzy wings behind her (picture 10).
// leaf: wrapped in a big dry leaf like a hooded cape (picture 5).
export const TH_HEAD = [0, -80];
export const TH_ARMS = {
  down: [
    [[-12, -62, 6], [-16, -52, 5.5], [-18, -42, 5], [-18, -36, 5]],
    [[12, -62, 6], [16, -52, 5.5], [18, -42, 5], [18, -36, 5]],
  ],
  wave: [
    [[-12, -62, 6], [-16, -52, 5.5], [-18, -42, 5], [-18, -36, 5]],
    [[12, -62, 6], [22, -70, 5.5], [28, -84, 5], [30, -96, 5]],
  ],
  up: [
    [[-12, -62, 6], [-22, -70, 5.5], [-28, -84, 5], [-30, -94, 5]],
    [[12, -62, 6], [22, -70, 5.5], [28, -84, 5], [30, -94, 5]],
  ],
  open: [
    [[-12, -62, 6], [-22, -58, 5.5], [-32, -62, 5], [-38, -70, 5]],
    [[12, -62, 6], [22, -58, 5.5], [32, -62, 5], [38, -70, 5]],
  ],
  knock: [
    [[-12, -62, 6], [-16, -52, 5.5], [-18, -42, 5], [-18, -36, 5]],
    [[12, -62, 6], [22, -60, 5.5], [32, -66, 5], [38, -72, 5]],
  ],
  hold: [
    [[-12, -62, 6], [-8, -50, 5.5], [2, -44, 5], [10, -42, 5]],
    [[12, -62, 6], [18, -50, 5.5], [24, -42, 5], [28, -38, 5]],
  ],
  tuck: [
    [[-12, -62, 6], [-4, -52, 5.5], [8, -46, 5], [18, -44, 5]],
    [[12, -62, 6], [22, -54, 5.5], [32, -46, 5], [40, -42, 5]],
  ],
};
const dressSides =
  'M-7 -67C-13 -65 -15 -60 -15 -54C-17 -42 -20 -30 -24 -16Q-18 -10 -12 -15Q-6 -9 0 -14Q6 -9 12 -15Q18 -10 24 -16C20 -30 17 -42 15 -54C15 -60 13 -65 7 -67';
const dressUpper = 'M-7 -67C-13 -65 -15 -60 -15 -54C-15 -48 -16 -42 -16 -36M7 -67C13 -65 15 -60 15 -54C15 -48 16 -42 16 -36';
const dressUpperFill = 'M-7 -67C-13 -65 -15 -60 -15 -54C-15 -48 -16 -42 -16 -36L16 -36C16 -42 15 -48 15 -54C15 -60 13 -65 7 -67Z';
const skirtKneel = 'M-16 -22C-20 -14 -26 -6 -32 0Q-24 5 -16 0Q-8 5 0 0Q8 5 16 0Q24 5 32 0C26 -6 20 -14 16 -22';
const sash = 'M-15 -46q15 4 30 0';
const bow = 'M0 -44l-6 -3l0 6ZM0 -44l6 -3l0 6Z';
// The whole girl's outline, to leave her out of a cape wash.
const silhouette =
  'M0 -102C-16 -102 -24 -90 -22 -76C-22 -70 -19 -66 -15 -62C-17 -42 -20 -30 -24 -16L24 -16C20 -30 17 -42 15 -62C19 -66 22 -70 22 -76C24 -90 16 -102 0 -102Z';
/** The part of standing Thumbelina below the line y = top (from -54 down to her feet), to leave her
 * out of a wash she stands in (fill-rule evenodd; the wash must cover all of this part). */
export function thumbCutBelow(top) {
  const x = Math.round((15 + (9 * (top + 54)) / 38) * 10) / 10;
  return `M${-x} ${top}L-24 -16L-12 -12L-10 1L10 1L12 -12L24 -16L${x} ${top}Z`;
}
const capeOut = 'M-30 -14C-34 -34 -30 -50 -24 -62C-30 -72 -32 -90 -22 -104C-14 -114 -6 -118 0 -128C6 -118 14 -114 22 -104C32 -90 30 -72 24 -62C30 -50 34 -34 30 -14';
const capeVeins = 'M-22 -104C-26 -96 -27 -86 -26 -76M-26 -54C-30 -44 -31 -32 -30 -22M22 -104C26 -96 27 -86 26 -76M26 -54C30 -44 31 -32 30 -22M0 -112l-10 -2M0 -118l8 -1';
const wingR = 'M10 -62C16 -82 28 -100 42 -102C52 -100 50 -84 38 -73C48 -73 52 -65 48 -59C42 -53 24 -53 12 -56';
const wingL = transformPath(wingR, 'scale(-1 1)');
const wingVeins = 'M14 -60C22 -76 32 -90 40 -98M14 -58C24 -61 36 -62 46 -61';

export function thumbelina({ mood = 'happy', tilt = 0, arms = 'down', pose = 'stand', wings = false, leaf = false, wind = false } = {}) {
  const A = typeof arms === 'string' ? TH_ARMS[arms] : arms;
  const upper = pose !== 'stand';
  const lines = [upper ? dressUpper : dressSides];
  const fine = [sash, bow];
  const washes = [{ c: PAL.rose, o: 0.78, d: upper ? dressUpperFill : `${dressSides}Z` }, { c: PAL.red, o: 0.7, d: bow }];
  if (pose === 'stand') {
    const legs = [limb([[-6, -15, 4], [-6, -4, 3.6]]), limb([[6, -15, 4], [6, -4, 3.6]])];
    const shoes = 'M-5 -4C-11 -4 -12 1 -8 1L-2 1L-2 -4ZM5 -4C11 -4 12 1 8 1L2 1L2 -4Z';
    lines.push(...legs, shoes);
    washes.push({ c: PAL.rose, o: 0.3, d: legs.map((d) => `${d}Z`).join('') }, { c: PAL.terracotta, o: 0.85, d: shoes });
    fine.push('M-12 -30l3 1M10 -26l-3 1');
  }
  const back = [];
  if (wings) {
    back.push({
      lines: [wingR, wingL],
      fine: [wingVeins, transformPath(wingVeins, 'scale(-1 1)')],
      washes: [{ c: PAL.sky, o: 0.4, d: `${wingR}Z${wingL}Z` }],
    });
  }
  if (leaf) {
    back.push({
      lines: [capeOut],
      fine: [capeVeins, 'M0 -128L0 -102', 'M0 -128q2 -7 7 -9'],
      washes: [
        { c: PAL.ochre, o: 0.8, d: `${capeOut}Z${silhouette}`, rule: 'evenodd' },
        { c: PAL.terracotta, o: 0.65, d: `${capeOut}Z${silhouette}`, rule: 'evenodd' },
      ],
    });
  }
  const parts = A.map((a) => arm(a));
  const head = place(thumbHead({ mood, wind }), `translate(${TH_HEAD[0]} ${TH_HEAD[1]}) rotate(${tilt})`);
  let girl = merge(...back, { lines, fine, washes }, ...parts, head);
  if (pose === 'kneel') {
    girl = merge(
      {
        lines: [skirtKneel],
        fine: ['M-14 -8q2 4 0 7M12 -10q-2 4 0 7'],
        washes: [{ c: PAL.rose, o: 0.78, d: `${skirtKneel}Z` }],
      },
      place(girl, 'translate(0 14)'),
    );
  }
  return girl;
}

// ---------------------------------------------------------------------------------------------
// The swallow, flying to the right (centre of the body at 0,0), about 170 from beak to tail tips:
// a slate-blue back and wings, a white front, a red throat and a long forked tail.
// pose: 'carry' (far wing up behind, near wing down: room for a rider on her back), 'up' (both wings
// raised, flying off), 'asleep' (lying still with her wings folded and her eyes shut, belly at y = 12).
const swBody =
  'M67 -9C67 -19 60 -25 51 -25C43 -25 37 -21 33 -16C14 -16 -6 -14 -20 -10C-34 -7 -46 -6 -58 -6L-98 -24L-72 -1L-100 8L-58 4C-40 8 -14 16 14 14C34 13 48 10 58 4C64 1 67 -4 67 -9Z';
const swBack = 'M67 -9C67 -19 60 -25 51 -25C43 -25 37 -21 33 -16C14 -16 -6 -14 -20 -10C-34 -7 -46 -6 -58 -6L-98 -24L-72 -1L-100 8L-58 4C-30 2 10 0 40 -2C50 -3 58 -3 64 -1Z';
const swThroat = 'M64 -2C60 5 52 7 45 4C49 -1 56 -4 63 -3Z';
const swBeak = 'M66 -12L76 -8L66 -5';
const swBelly = 'M-40 6C-20 8 0 8 20 6M-10 10l2 -3M6 11l2 -3M22 9l2 -3';
const swWings = {
  carry: {
    far: 'M8 -15C-2 -44 -24 -70 -62 -90C-50 -68 -42 -50 -38 -36C-34 -26 -26 -18 -16 -12Z',
    near: 'M28 2C22 26 4 48 -32 66C-22 46 -18 30 -16 18C-14 10 -6 4 4 2Z',
    farMarks: 'M-22 -30l-10 -2M-30 -44l-10 -2M-38 -58l-10 -2',
    nearMarks: 'M-4 18l-10 2M-10 32l-10 2M-18 46l-10 2',
  },
  up: {
    far: 'M18 -16C14 -44 2 -72 -22 -96C-18 -72 -18 -52 -16 -36C-15 -26 -10 -18 -2 -14Z',
    near: 'M32 -12C34 -42 26 -74 8 -100C8 -74 4 -54 2 -38C0 -26 4 -18 12 -12Z',
    farMarks: 'M-14 -40l-6 -6M-16 -56l-5 -7',
    nearMarks: 'M6 -36l-6 -6M8 -54l-6 -7M8 -72l-5 -7',
  },
};
const swFold = 'M44 -16C26 -22 -8 -18 -48 -8L-86 -10C-60 0 -20 4 30 0C38 -1 42 -8 44 -16Z';
const swFoldMarks = 'M-30 -6l10 2M-14 -10l10 2M2 -12l10 2M-62 -6l12 1';
const swBodyFold =
  'M67 -9C67 -19 60 -25 51 -25C43 -25 37 -21 33 -16C14 -16 -6 -14 -20 -10C-34 -7 -46 -6 -58 -6L-96 -12L-60 2C-40 8 -14 16 14 14C34 13 48 10 58 4C64 1 67 -4 67 -9Z';
const swBackFold = 'M67 -9C67 -19 60 -25 51 -25C43 -25 37 -21 33 -16C14 -16 -6 -14 -20 -10C-34 -7 -46 -6 -58 -6L-96 -12L-60 2C-30 2 10 0 40 -2C50 -3 58 -3 64 -1Z';

export function swallow({ pose = 'carry' } = {}) {
  const asleep = pose === 'asleep';
  const body = asleep ? swBodyFold : swBody;
  const backD = asleep ? swBackFold : swBack;
  const eye = dot(55, -12, 3.2);
  const out = {
    lines: [body, swBeak],
    fine: [swBelly, `${swBeak}Z`],
    washes: [
      { c: PAL.slate, o: 0.9, d: backD },
      { c: PAL.ink, o: 0.25, d: backD },
      { c: PAL.red, o: 0.8, d: swThroat + dot(64, -15, 2.6) },
      { c: PAL.ink, o: 0.7, d: `${swBeak}Z` },
    ],
    whites: [],
    fills: [],
    glints: [],
  };
  if (asleep) {
    out.lines.push(swFold);
    out.fine.push(swFoldMarks, 'M51 -12q4 3 8 0');
    out.whites.push(eye);
    out.washes.push({ c: PAL.slate, o: 0.6, d: swFold });
  } else {
    const w = swWings[pose];
    const wings = {
      lines: [w.far, w.near],
      fine: [w.farMarks, w.nearMarks],
      washes: [
        { c: PAL.slate, o: 0.85, d: w.far },
        { c: PAL.ink, o: 0.3, d: w.far },
        { c: PAL.slate, o: 0.85, d: w.near },
        { c: PAL.ink, o: 0.15, d: w.near },
      ],
    };
    out.whites.push(eye);
    out.fills.push(dot(56, -12, 1.9));
    out.glints.push(dot(55.4, -12.7, 0.6));
    return merge(out, wings);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// The toad, peeping over a sill (the sill top at y = 0, centre x = 0), about 150 wide: a big green
// wet head with two bulging googly eyes looking down to the left, a wide silly grin, ochre warts,
// shiny wet glints and webbed hands gripping the sill.
const tdHead =
  'M-72 0C-76 -22 -62 -42 -38 -48C-40 -64 -26 -72 -16 -68C-8 -65 -6 -58 -8 -52C2 -55 12 -55 20 -52C18 -60 22 -68 32 -70C44 -71 50 -60 46 -48C66 -42 78 -22 74 0';
const tdMouth = 'M-52 -22C-30 -10 30 -10 56 -24M-55 -25q2 2 3 3M56 -24q2 -1 3 -3';
const tdHand = (x) => {
  const toes = [oval(x - 10, 2, 4.5, 6), oval(x, 4, 4.5, 6.5), oval(x + 10, 2, 4.5, 6)];
  return toes.join('');
};
export function toad() {
  const eyes = dot(-22, -57, 9) + dot(32, -59, 9);
  const hands = tdHand(-44) + tdHand(48);
  return {
    lines: [tdHead, hands],
    fine: [tdMouth, 'M-6 -36q2 -2 4 0M8 -36q2 -2 4 0', 'M-60 -12q4 -6 2 -12M62 -12q-4 -6 -2 -12', eyes],
    washes: [
      { c: PAL.green, o: 0.85, d: `${tdHead}Z` },
      { c: PAL.ochre, o: 0.35, d: `${tdHead}Z` },
      { c: PAL.ochre, o: 0.85, d: dot(-46, -30, 3.6) + dot(-30, -40, 2.6) + dot(48, -32, 3.6) + dot(34, -42, 2.6) + dot(4, -46, 2.4) + dot(-60, -8, 2.6) + dot(62, -8, 2.6) },
      { c: PAL.rose, o: 0.5, d: dot(-46, -18, 5) + dot(50, -18, 5) },
      { c: PAL.green, o: 0.8, d: hands },
      { c: PAL.sky, o: 0.8, d: 'M-74 -30c-3 5 -3 9 0 9c3 0 3 -4 0 -9ZM80 -34c-3 5 -3 9 0 9c3 0 3 -4 0 -9Z' },
    ],
    whites: [eyes],
    fills: [dot(-25, -54, 3.8), dot(29, -56, 3.8)],
    glints: [dot(-26, -55.5, 1.1), dot(28, -57.5, 1.1), oval(-30, -62, 3, 1.5), oval(40, -62, 3, 1.5), oval(-50, -36, 4, 1.6), oval(10, -48, 4, 1.4)],
  };
}

// ---------------------------------------------------------------------------------------------
// The may-beetle, flying to the right (centre of the body at 0,0), about 130 long: a round shiny
// slate body with paper glints, a dark head with feelers, brown wing cases lifted, gauzy wings, and
// thin legs; his two front legs reach down to (26..38, 40) to hold someone round the waist.
const btBody = 'M-40 4C-42 -14 -22 -26 2 -26C24 -26 40 -14 40 2C40 18 22 28 0 28C-22 28 -40 20 -40 4Z';
const btHead = 'M36 -10C40 -20 54 -22 60 -14C66 -6 62 6 52 8C44 9 38 4 36 -2';
const btCaseFar = 'M10 -24C4 -46 14 -64 32 -66C38 -54 32 -38 18 -24Z';
const btCaseNear = 'M-6 -24C-20 -44 -18 -64 -2 -72C10 -60 10 -40 4 -24Z';
const btWing = 'M-10 -20C-34 -48 -64 -66 -92 -62C-80 -46 -54 -28 -24 -14Z';
const btWing2 = 'M0 -24C-14 -58 -34 -80 -60 -88C-56 -68 -40 -44 -14 -22Z';
const btFeelers = 'M58 -18C62 -28 70 -34 78 -34M54 -20C54 -32 58 -42 66 -46';
const btClubs = `${dot(80, -34, 3)}${dot(68, -47, 3)}`;
const btLegs = 'M-10 26L-18 38L-28 42M-26 20L-40 28L-52 30';
const btFront = 'M28 18L40 26L36 40M18 24L22 34L26 42';
/** front: the front legs as path data (to reach round someone), or the default dangling ones. */
export function beetle({ front = btFront } = {}) {
  return {
    lines: [btWing, btWing2, btCaseFar, btBody, btCaseNear, btHead, btLegs, front],
    fine: [btFeelers, btClubs, 'M-30 8C-18 16 18 16 32 6', 'M-26 -6l6 -4M-14 -14l6 -3', 'M52 0q5 3 9 -1'],
    washes: [
      { c: PAL.sky, o: 0.3, d: btWing + btWing2 },
      { c: PAL.slate, o: 0.85, d: btBody },
      { c: PAL.green, o: 0.35, d: btBody },
      { c: PAL.ink, o: 0.65, d: `${btHead}Z${btClubs}` },
      { c: PAL.terracotta, o: 0.8, d: btCaseFar + btCaseNear },
    ],
    whites: [dot(52, -10, 3.4)],
    fills: [dot(53, -10, 1.8)],
    glints: [oval(-14, -12, 10, 3.4), oval(14, 18, 6, 2), oval(-2, -46, 2, 6)],
  };
}

// ---------------------------------------------------------------------------------------------
// The field mouse (feet at 0,0), about 100 tall to the ear tips: soft grey-brown fur, big round
// pink ears, whiskers, a white apron and a red kerchief, a curly tail. arms: 'down' or 'open'.
const fmBody = 'M-22 -4C-28 -24 -24 -50 -10 -58C-4 -61 4 -61 10 -58C24 -50 28 -24 22 -4C12 0 -12 0 -22 -4Z';
const fmHead = 'M-16 -68C-18 -82 -8 -90 0 -90C8 -90 18 -82 16 -68C14 -60 6 -55 0 -55C-6 -55 -14 -60 -16 -68Z';
const fmEars = `${dot(-16, -88, 10)}${dot(16, -88, 10)}`;
const fmApron = 'M-14 -40C-5 -37 5 -37 14 -40L16 -8C5 -6 -5 -6 -16 -8Z';
const fmKerchief = 'M-12 -58C-4 -54 4 -54 12 -58L0 -46Z';
const fmTail = 'M18 -8C34 -4 44 -14 40 -26C38 -32 32 -32 32 -26';
const fmFeet = `${oval(-10, -1, 8, 3.5)}${oval(10, -1, 8, 3.5)}`;
const FM_ARMS = {
  down: [
    [[-18, -50, 6], [-24, -40, 5.5], [-24, -30, 5]],
    [[18, -50, 6], [24, -40, 5.5], [24, -30, 5]],
  ],
  open: [
    [[-18, -50, 6], [-28, -50, 5.5], [-36, -58, 5]],
    [[18, -50, 6], [26, -42, 5.5], [24, -32, 5]],
  ],
};
export function fieldMouse({ arms = 'down', mood = 'happy' } = {}) {
  const A = FM_ARMS[arms].map(limb);
  const m = faceMarks({ mood, ex: 6, ey: -73, my: -62, r: 2, w: 3 });
  return {
    lines: [fmTail, fmBody, fmEars, fmHead, ...A, fmFeet, fmApron, fmKerchief],
    fine: ['M-6 -66l-12 -2M-6 -64l-12 3M6 -66l12 -2M6 -64l12 3', dot(-16, -88, 5.5) + dot(16, -88, 5.5), ...m.fine],
    washes: [
      { c: PAL.grey, o: 0.85, d: `${fmBody}${fmHead}${fmEars}${A.map((d) => `${d}Z`).join('')}${fmFeet}` },
      { c: PAL.terracotta, o: 0.25, d: `${fmBody}${fmHead}` },
      { c: PAL.rose, o: 0.85, d: dot(-16, -88, 5.5) + dot(16, -88, 5.5) + dot(0, -66, 2.6) + `${fmTail}C30 -18 30 -14 18 -4Z` },
      { c: PAL.red, o: 0.8, d: fmKerchief },
      ...m.washes,
    ],
    whites: [fmApron],
    fills: m.fills,
    glints: m.glints,
  };
}

// ---------------------------------------------------------------------------------------------
// The mole (feet at 0,0), about 115 tall: a round body in a black velvet coat with a white shirt
// front and a gold watch chain, a long pink nose, big pink spade paws folded on his tummy, and his
// eyes shut tight (he cannot see, and does not like the sun).
const mlBody = 'M-36 -4C-46 -32 -42 -78 -20 -96C-10 -104 10 -104 20 -96C42 -78 46 -32 36 -4C20 2 -20 2 -36 -4Z';
const mlFace = 'M-18 -78C-18 -94 -8 -98 0 -98C8 -98 18 -94 18 -78C18 -70 10 -66 0 -66C-10 -66 -18 -70 -18 -78Z';
const mlShirt = 'M-12 -62L12 -62L0 -30Z';
const mlNose = 'M-6 -76C-5 -70 -3 -64 0 -60C3 -64 5 -70 6 -76Z';
const mlPaws = `${oval(-14, -34, 13, 9)}${oval(14, -30, 13, 9)}`;
const mlFeet = `${oval(-16, -2, 10, 4)}${oval(16, -2, 10, 4)}`;
const mlClaws = 'M-26 -30l-4 4M-22 -28l-3 5M-18 -27l-2 5M24 -26l4 4M20 -24l3 5M16 -23l2 5';
export function mole() {
  const velvet = `${mlBody}${mlFace}${mlShirt}${mlPaws}`;
  return {
    lines: [mlBody, mlFace, mlShirt, mlPaws, mlFeet],
    fine: [mlNose, mlClaws, 'M-12 -82q3 2 6 0M6 -82q3 2 6 0', 'M-6 -66l-14 -2M-6 -64l-14 3M6 -66l14 -2M6 -64l14 3', 'M8 -42C14 -36 18 -40 22 -46', 'M-30 -60q-4 14 -4 30M30 -60q4 14 4 30'],
    washes: [
      { c: PAL.ink, o: 0.55, d: velvet, rule: 'evenodd' },
      { c: PAL.slate, o: 0.6, d: velvet, rule: 'evenodd' },
      { c: PAL.grey, o: 0.55, d: mlFace },
      { c: PAL.rose, o: 0.9, d: mlNose + mlPaws + mlFeet },
      { c: PAL.red, o: 0.5, d: dot(0, -61, 3.4) },
      { c: PAL.ochre, o: 0.9, d: dot(23, -47, 2.4) },
    ],
    fills: [dot(-1.4, -60, 0.8), dot(1.4, -60, 0.8)],
  };
}

// ---------------------------------------------------------------------------------------------
// The flower prince (feet at 0,0), about the same size as Thumbelina: short terracotta curls, a gold
// crown with red jewels, a white tunic with a petal hem, slate tights and gauzy wings like hers.
const prTunic =
  'M-7 -67C-13 -65 -15 -60 -15 -54C-16 -46 -17 -36 -19 -26L-14 -20L-8 -26L-3 -20L2 -26L8 -20L13 -26L19 -26C17 -36 16 -46 15 -54C15 -60 13 -65 7 -67';
const prHair = 'M-13 -2C-17 -8 -15 -18 -8 -19C-4 -22 4 -22 8 -19C15 -18 17 -8 13 -2C10 -8 4 -9 0 -8C-4 -9 -10 -8 -13 -2Z';
const prCrown = 'M-11 -17L-12 -30L-6 -23L0 -32L6 -23L12 -30L11 -17C4 -19 -4 -19 -11 -17Z';
export function prince({ mood = 'peepL', arms } = {}) {
  const A = arms ?? [
    [[-12, -62, 6], [-16, -52, 5.5], [-18, -42, 5], [-18, -36, 5]],
    [[12, -62, 6], [20, -56, 5.5], [26, -48, 5], [30, -44, 5]],
  ];
  const legs = [limb([[-6, -24, 4.5], [-6, -4, 4]]), limb([[6, -24, 4.5], [6, -4, 4]])];
  const shoes = 'M-5 -4C-11 -4 -12 1 -8 1L-2 1L-2 -4ZM5 -4C11 -4 12 1 8 1L2 1L2 -4Z';
  const m = faceMarks({ mood, ex: 4.5, ey: 0, my: 7 });
  const head = {
    lines: [tFace, prHair, prCrown],
    fine: ['M-8 -14q2 2 4 0M4 -14q2 2 4 0', 'M0.5 2c1.6 1.2 1.6 2.4 -0.5 2.8', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: tFaceFill },
      { c: PAL.terracotta, o: 0.85, d: prHair },
      { c: PAL.ochre, o: 0.95, d: prCrown },
      { c: PAL.red, o: 0.9, d: dot(0, -24, 1.8) + dot(-7, -22, 1.4) + dot(7, -22, 1.4) },
      { c: PAL.rose, o: 0.7, d: dot(-7.5, 5, 2.4) + dot(7.5, 5, 2.4) },
    ],
    fills: m.fills,
    glints: m.glints,
  };
  const arms2 = A.map((a) => arm(a, PAL.sky));
  return merge(
    {
      lines: [wingR, wingL],
      fine: [wingVeins, transformPath(wingVeins, 'scale(-1 1)')],
      washes: [{ c: PAL.sky, o: 0.4, d: `${wingR}Z${wingL}Z` }],
    },
    {
      lines: [prTunic, ...legs, shoes],
      fine: ['M-15 -46q15 4 30 0'],
      washes: [
        { c: PAL.sky, o: 0.35, d: `${prTunic}Z` },
        { c: PAL.slate, o: 0.6, d: legs.map((d) => `${d}Z`).join('') },
        { c: PAL.ochre, o: 0.8, d: `${shoes}` },
        { c: PAL.ochre, o: 0.85, d: 'M-15 -48q15 4 30 0l0 4q-15 4 -30 0Z' },
      ],
    },
    ...arms2,
    place(head, `translate(0 -80)`),
  );
}

export { f };
