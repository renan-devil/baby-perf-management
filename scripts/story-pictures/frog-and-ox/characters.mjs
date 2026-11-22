import { PAL } from '../lib.mjs';
import { dot, limb, oval } from '../stone-soup/characters.mjs';

// The Frog and the Ox: the little frog (normal and puffed up), her sisters, the ox and the lily pads,
// shared by the two pictures. Each is drawn once here and placed in each picture with a transform
// (place). The build only draws files named <n>.mjs, so this file is not a picture.

export { compose, place, merge, dot, oval, limb } from '../stone-soup/characters.mjs';

// ---------------------------------------------------------------------------------------------
// The little frog (sitting, bottom centre at 0,0, facing us), about 40 wide and 44 tall: a pear-shaped
// green body with a cream tummy, two round eyes on bumps, rosy cheeks and a little pink flower tucked
// behind her right eye (so we always know which frog she is). look: the pupils' shift [dx, dy].
// mood: 'wow' (gazing, a small round mouth), 'happy' (a smile), 'worried' (raised brows, wobbly mouth).
const fBody =
  'M-16 -2C-21 -10 -19 -21 -13 -26C-16 -29 -15 -34 -12 -37C-11 -44 -3 -45 -2.5 -38C-1 -37 1 -37 2.5 -38C3 -45 11 -44 12 -37C15 -34 16 -29 13 -26C19 -21 21 -10 16 -2C8 1 -8 1 -16 -2Z';
const fTummy = oval(0, -10, 9, 8);
// folded back legs at her sides, and webbed feet in front
const fHaunch = 'M-15 -4C-24 -5 -25 -16 -18 -19M15 -4C24 -5 25 -16 18 -19';
const fFeet = 'M-17 -1L-26 0L-22 1.5L-27 3L-16 2.5M17 -1L26 0L22 1.5L27 3L16 2.5';
const fLegsWash =
  'M-15 -4C-24 -5 -25 -16 -18 -19C-16 -12 -16 -8 -15 -4ZM15 -4C24 -5 25 -16 18 -19C16 -12 16 -8 15 -4ZM-17 -1L-26 0L-22 1.5L-27 3L-16 2.5ZM17 -1L26 0L22 1.5L27 3L16 2.5Z';
const fArms = 'M-8 -15C-10 -10 -10 -5 -9 0M8 -15C10 -10 10 -5 9 0';
const fToes = 'M-12.5 1l3.5 -1l3.5 1M5.5 1l3.5 -1l3.5 1';
const fSpots = dot(-15, -15, 1.4) + dot(14, -12, 1.2) + dot(-11, -30, 1.1);
const F_EYES = [[-7.3, -37.5], [7.3, -37.5]];
// the little flower behind her right eye: five rose petals and an ochre heart
const flower = (x, y, s = 1) =>
  [0, 72, 144, 216, 288].map((a) => {
    const r = (a * Math.PI) / 180;
    return oval(x + Math.cos(r) * 2.6 * s, y + Math.sin(r) * 2.6 * s, 2.1 * s, 2.1 * s);
  }).join('');

function faceMarks({ mood, look, eyes, eyeR, pupilR, mouthY, brows }) {
  const [lx, ly] = look;
  const fine = [];
  const fills = [];
  const glints = [];
  const whites = [];
  for (const [x, y] of eyes) {
    whites.push(dot(x, y, eyeR));
    fine.push(dot(x, y, eyeR));
    fills.push(dot(x + lx, y + ly, pupilR));
    glints.push(dot(x + lx - pupilR * 0.35, y + ly - pupilR * 0.4, pupilR * 0.3));
  }
  if (mood === 'worried') {
    const [[ax, ay], [bx, by]] = eyes;
    fine.push(`M${ax - 4} ${ay - eyeR - 1.5}l6 -2.5M${bx + 4} ${by - eyeR - 1.5}l-6 -2.5`);
    fine.push(`M-4.5 ${mouthY}q1.5 -1.6 3 0q1.5 1.6 3 0q1.5 -1.6 3 0`);
  } else if (mood === 'wow') {
    fine.push(`M-7 ${mouthY - 1}C-4 ${mouthY + 1} 4 ${mouthY + 1} 7 ${mouthY - 1}`);
    fills.push(oval(0, mouthY + 1.6, 1.8, 1.6));
  } else {
    fine.push(`M-8 ${mouthY - 1}C-4 ${mouthY + 3.5} 4 ${mouthY + 3.5} 8 ${mouthY - 1}`);
  }
  if (brows) fine.push(brows);
  return { fine, fills, glints, whites };
}

export function frog({ mood = 'happy', look = [0, 0], flowered = true, tint = PAL.green } = {}) {
  const m = faceMarks({ mood, look, eyes: F_EYES, eyeR: 3.4, pupilR: 1.8, mouthY: -27 });
  const washes = [
    { c: tint, o: 0.85, d: fBody + fTummy, rule: 'evenodd' },
    { c: tint, o: 0.75, d: fLegsWash },
    { c: PAL.ochre, o: 0.35, d: fTummy },
    { c: tint, o: 0.6, d: fSpots },
    { c: PAL.rose, o: 0.7, d: dot(-10.5, -28.5, 2) + dot(10.5, -28.5, 2) },
  ];
  const fine = [fArms, fToes, fFeet, ...m.fine];
  if (flowered) {
    washes.push({ c: PAL.rose, o: 0.9, d: flower(13, -42) }, { c: PAL.ochre, o: 0.9, d: dot(13, -42, 1.2) });
    fine.push(flower(13, -42));
  }
  return { lines: [fBody, fHaunch], fine, washes, whites: m.whites, fills: m.fills, glints: m.glints };
}

// ---------------------------------------------------------------------------------------------
// The little frog puffed up as round as a balloon (bottom centre at 0,0), about 64 wide and 70 tall:
// a big round green body with two eye bumps on top, popping eyes, bulging rosy cheeks, pressed lips,
// tiny arms and legs sticking out, and the same flower behind her right eye.
const pBody =
  'M-19 -59.7A32 32 0 1 0 19 -59.7A7.5 7.5 0 0 0 5 -63Q0 -60.5 -5 -63A7.5 7.5 0 0 0 -19 -59.7Z';
const pTummy = oval(0, -22, 19, 15);
const P_EYES = [[-12, -61.5], [12, -61.5]];
const pCheeks = oval(-15, -45, 6.5, 5.5) + oval(15, -45, 6.5, 5.5);
const pLimbs = [
  limb([[-30, -30, 5], [-38, -36, 4], [-42, -44, 3.5]]),
  limb([[30, -30, 5], [38, -36, 4], [42, -44, 3.5]]),
  limb([[-14, -4, 6], [-22, 1, 5], [-30, 2, 4]]),
  limb([[14, -4, 6], [22, 1, 5], [30, 2, 4]]),
];
const pFingers = 'M-42 -44l-3 -3M-42 -44l-1 -4.5M-42 -44l-4 -0.5M42 -44l3 -3M42 -44l1 -4.5M42 -44l4 -0.5M-30 2l-4 -2M-30 2l-4.5 1.5M-30 2l-3 3.5M30 2l4 -2M30 2l4.5 1.5M30 2l3 3.5';
const pSpots = dot(-24, -18, 1.8) + dot(22, -24, 1.5) + dot(-20, -50, 1.4) + dot(26, -42, 1.3);

export function puffedFrog({ look = [0, -0.5] } = {}) {
  const m = faceMarks({ mood: 'puffed', look, eyes: P_EYES, eyeR: 5.6, pupilR: 1.9, mouthY: -45 });
  // replace the default smile with tightly pressed lips between the cheeks
  m.fine.pop();
  m.fine.push('M-6 -45q3 1.2 6 0q3 -1.2 6 0', 'M-17 -67.5l5 -2.5M17 -67.5l-5 -2.5');
  return {
    lines: [pBody, ...pLimbs.slice(0, 2)],
    fine: [...pLimbs.slice(2), pFingers, pCheeks, 'M-19 -45q2 -2 4 0M15 -45q2 -2 4 0', flower(18, -69, 1.2), ...m.fine],
    washes: [
      { c: PAL.green, o: 0.85, d: pBody + pTummy + pCheeks, rule: 'evenodd' },
      { c: PAL.green, o: 0.8, d: pLimbs.map((d) => `${d}Z`).join('') },
      { c: PAL.ochre, o: 0.35, d: pTummy },
      { c: PAL.green, o: 0.6, d: pSpots },
      { c: PAL.rose, o: 0.75, d: pCheeks },
      { c: PAL.rose, o: 0.9, d: flower(18, -69, 1.2) },
      { c: PAL.ochre, o: 0.9, d: dot(18, -69, 1.4) },
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

// ---------------------------------------------------------------------------------------------
// A lily pad (centre at 0,0), w wide, seen from the side as a flat ellipse with a notch cut out.
export function lilyPad(w = 60) {
  const rx = w / 2;
  const ry = w * 0.16;
  const d = `M${rx * 0.12} ${-ry * 0.2}L${rx * 0.95} ${-ry * 0.55}C${rx * 1.1} ${ry * 0.2} ${rx * 0.6} ${ry} 0 ${ry}C${-rx * 0.6} ${ry} ${-rx} ${ry * 0.55} ${-rx} 0C${-rx} ${-ry * 0.55} ${-rx * 0.6} ${-ry} 0 ${-ry}C${rx * 0.35} ${-ry} ${rx * 0.6} ${-ry * 0.9} ${rx * 0.75} ${-ry * 0.8}Z`;
  const veins = `M${rx * 0.12} ${-ry * 0.2}L${-rx * 0.6} ${ry * 0.3}M${rx * 0.12} ${-ry * 0.2}L${-rx * 0.4} ${-ry * 0.6}M${rx * 0.12} ${-ry * 0.2}L${rx * 0.1} ${ry * 0.75}`;
  return { lines: [d], fine: [veins], washes: [{ c: PAL.green, o: 0.7, d }] };
}

// ---------------------------------------------------------------------------------------------
// The big brown ox (hooves at y = 0, facing left), about 200 long and 130 tall: a great barrel body,
// four strong legs with slate hooves, a broad head with a pale rosy muzzle, two curly horns, a floppy
// ear and a tufted tail. Brown is a terracotta wash with grey over it.
const oBody = 'M-50 -112C-20 -124 40 -122 66 -112C82 -104 84 -72 72 -58C44 -50 -10 -50 -42 -56';
const oBodyFill = `${oBody}C-56 -62 -60 -100 -50 -112Z`;
const oHead =
  'M-46 -114C-58 -118 -74 -112 -82 -100C-88 -90 -94 -78 -98 -68C-102 -58 -96 -50 -86 -51C-76 -52 -66 -58 -56 -66C-50 -70 -44 -72 -40 -70';
const oHeadFill = `${oHead}C-36 -86 -38 -104 -46 -114Z`;
const oMuzzle = 'M-97 -70C-102 -59 -96 -50 -86 -51C-80 -52 -76 -55 -74 -60C-80 -66 -88 -70 -97 -70Z';
const oHorns = 'M-70 -110C-74 -122 -66 -132 -56 -130C-50 -129 -50 -122 -55 -122M-80 -104C-90 -110 -96 -122 -90 -128C-86 -132 -80 -129 -82 -124';
const oHornsFill = 'M-70 -110C-74 -122 -66 -132 -56 -130C-50 -129 -50 -122 -55 -122C-60 -124 -63 -116 -64 -108ZM-80 -104C-90 -110 -96 -122 -90 -128C-86 -132 -80 -129 -82 -124C-86 -120 -82 -112 -76 -107Z';
const oEar = 'M-58 -106C-50 -112 -40 -112 -36 -106C-42 -100 -52 -100 -58 -106Z';
const oLegs = [
  limb([[-34, -60, 17], [-36, -30, 14], [-36, -4, 13]]),
  limb([[-16, -58, 16], [-16, -30, 13], [-15, -4, 12]]),
  limb([[44, -62, 20], [46, -32, 14], [44, -4, 13]]),
  limb([[62, -66, 18], [64, -34, 13], [64, -4, 12]]),
];
const oHooves = [-36, -15, 44, 64].map((x) => `M${x - 7} -6L${x + 7} -6L${x + 7.5} 0L${x - 7.5} 0Z`).join('');
const oTail = 'M74 -104C84 -96 86 -80 84 -62';
const oTuft = 'M84 -64C80 -58 80 -50 84 -46C88 -50 90 -58 84 -64Z';
const oMarks = 'M-30 -96C-22 -100 -14 -100 -6 -96M14 -104C24 -107 34 -106 42 -102M-90 -62l0.5 -2M-84 -61l0.5 -2';

export function ox() {
  return {
    lines: [...oLegs, oBody, oHead, oHorns, oTail],
    fine: [oMuzzle, oEar, oHooves, oTuft, oMarks, dot(-72, -92, 3.6)],
    washes: [
      // one wash per part: overlapping shapes in one path can cancel each other out
      ...[oBodyFill, oHeadFill, oLegs.map((d) => `${d}Z`).join('') + oEar + oTuft].map((d) => ({ c: PAL.terracotta, o: 0.7, d })),
      { c: PAL.grey, o: 0.45, d: oBodyFill },
      { c: PAL.rose, o: 0.6, d: oMuzzle },
      { c: PAL.ochre, o: 0.6, d: oHornsFill },
      { c: PAL.slate, o: 0.85, d: oHooves },
    ],
    whites: [dot(-72, -92, 3.6)],
    fills: [dot(-73, -92, 2)],
    glints: [dot(-73.8, -92.8, 0.6)],
  };
}
