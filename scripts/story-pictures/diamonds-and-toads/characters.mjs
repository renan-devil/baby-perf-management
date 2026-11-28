import { PAL, transformPath } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Diamonds and Toads: Rose, Fanchon, the fairy (as a poor old woman and as a grand lady), the mother,
// the well in the wood, the jugs, and the roses, pearls, diamonds, frogs and toads, shared by the
// five pictures. Each is drawn once here and placed in each picture with a transform (place). The
// build only draws files named <n>.mjs, so this file is not a picture. Standing characters have their
// feet at y = 0 and face us.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

/** An arm along pts: a sleeve in the dress colour with a round rosy hand at its end. */
function arm(pts, sleeve, o = 0.7, hand = 4.2) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  // the sleeve wash stops short of the hand, so the hand keeps its own rosy colour
  const [px, py] = pts[pts.length - 2];
  const k = Math.max(0, 1 - (hand * 1.1) / Math.hypot(x - px, y - py));
  const cuff = limb([...pts.slice(0, -1), [px + (x - px) * k, py + (y - py) * k, pts[pts.length - 1][2]]]);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${cuff}Z` }, { c: PAL.rose, o: 0.6, d: h }] };
}

/**
 * Eyes, brows and mouth (the face centre at 0,0). mood:
 *  'happy' a wide smile; 'kind' a soft smile, eyes looking down a little; 'talk' an open little
 *  mouth (speaking); 'wow' eyes wide, brows up, a round "oh"; 'eek' eyes wide, brows up, a big open
 *  mouth; 'smug' eyes shut under haughty lids, a small pout; 'shout' eyes shut tight, a wide open
 *  mouth; 'shy' eyes shut looking down, a tiny "o"; 'grump' frowning brows, mouth turned down.
 */
function faceMarks(mood, s = 1) {
  const ex = 4.5 * s;
  const ey = -1;
  const my = 5.5 * s;
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const open = (r = 1.8) => {
    fills.push(dot(-ex, ey, r), dot(ex, ey, r));
    glints.push(dot(-ex - 0.5, ey - 0.6, 0.55), dot(ex - 0.5, ey - 0.6, 0.55));
  };
  if (mood === 'happy') {
    open();
    fine.push(`M${-4 * s} ${my - 1}q${4 * s} ${5 * s} ${8 * s} 0`);
  } else if (mood === 'kind') {
    fine.push(`M${-ex - 2.6} ${ey}q2.6 2.6 5.2 0M${ex - 2.6} ${ey}q2.6 2.6 5.2 0`, `M${-3.5 * s} ${my}q${3.5 * s} ${3.5 * s} ${7 * s} 0`);
  } else if (mood === 'talk') {
    open();
    const m = oval(0, my + 1, 2.6 * s, 2.2 * s);
    fine.push(m);
    washes.push({ c: PAL.red, o: 0.7, d: m });
  } else if (mood === 'wow' || mood === 'eek') {
    whites.push(dot(-ex, ey, 2.9), dot(ex, ey, 2.9));
    fine.push(dot(-ex, ey, 2.9), dot(ex, ey, 2.9), `M${-ex - 3} ${ey - 5.5}q3 -2.6 6 -0.6M${ex - 3} ${ey - 6.1}q3 -2 6 0.6`);
    fills.push(dot(-ex, ey, 1.3), dot(ex, ey, 1.3));
    if (mood === 'wow') fills.push(oval(0, my + 2, 2 * s, 2.6 * s));
    else {
      const m = `M${-4.5 * s} ${my}C${-4.5 * s} ${my + 7 * s} ${4.5 * s} ${my + 7 * s} ${4.5 * s} ${my}C${2 * s} ${my - 1.2} ${-2 * s} ${my - 1.2} ${-4.5 * s} ${my}Z`;
      fine.push(m);
      washes.push({ c: PAL.red, o: 0.8, d: m });
    }
  } else if (mood === 'smug') {
    fine.push(`M${-ex - 3} ${ey}q3 1.8 6 0M${ex - 3} ${ey}q3 1.8 6 0M${-ex - 3.5} ${ey - 3.5}l6 -1.5M${ex - 2.5} ${ey - 5}l6 1.5`, `M${-2 * s} ${my + 1}q${2 * s} -1.6 ${4 * s} 0`);
  } else if (mood === 'shout') {
    fine.push(`M${-ex - 3} ${ey}l3 -1.6l3 1.6M${ex - 3} ${ey}l3 -1.6l3 1.6`);
    const m = oval(0, my + 1.8, 4 * s, 3.4 * s);
    fine.push(m);
    washes.push({ c: PAL.red, o: 0.85, d: m });
  } else if (mood === 'shy') {
    fine.push(`M${-ex - 2.6} ${ey + 0.6}q2.6 2.4 5.2 0M${ex - 2.6} ${ey + 0.6}q2.6 2.4 5.2 0`);
    fills.push(oval(0, my + 1.5, 1.5 * s, 1.8 * s));
  } else if (mood === 'grump') {
    open(1.7);
    fine.push(`M${-ex - 3} ${ey - 5}l6 2M${ex + 3} ${ey - 5}l-6 2`, `M${-4 * s} ${my + 2.5}q${4 * s} ${-3.5 * s} ${8 * s} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

const cheeks = (dx, y, r) => ({ c: PAL.rose, o: 0.7, d: dot(-dx, y, r) + dot(dx, y, r) });

// ---------------------------------------------------------------------------------------------
// The two sisters share one body (feet at 0,0, about 112 tall, head centre at (0, -97)): a plain
// dress with a little collar, stick legs and slate shoes. Rose's dress is sky blue with a white
// apron; Fanchon's is rose red with a red sash. arms: two limb centrelines from the shoulders.
export const S_HEAD = [0, -99];
const sDress =
  'M-10 -86C-13 -76 -13 -62 -12 -54C-20 -42 -27 -28 -31 -15C-12 -11 12 -11 31 -15C27 -28 20 -42 12 -54C13 -62 13 -76 10 -86C4 -89 -4 -89 -10 -86Z';
const sWaist = 'M-12 -54C-4 -52 4 -52 12 -54';
const sCollar = 'M-7 -87C-4 -82 4 -82 7 -87';
const sApron = 'M-9 -53C-11 -42 -13 -30 -14 -19C-5 -17 5 -17 14 -19C13 -30 11 -42 9 -53Z';
const sSash = 'M-12 -55C-4 -53 4 -53 12 -55L12.5 -50C4 -48 -4 -48 -12.5 -50Z';
const sBow = 'M8 -52L16 -46L12 -42ZM8 -52L14 -56L15 -50Z';
const sFolds = 'M-20 -32C-22 -27 -23 -22 -24 -17M21 -33C23 -27 23 -22 24 -18';
const sLegs = 'M-6 -13L-7 -4M6 -13L7 -4';
const sShoes = oval(-8, -2.5, 5.5, 3.2) + oval(8, -2.5, 5.5, 3.2);
export const ARMS = {
  down: [
    [[-11, -80, 7], [-16, -68, 6.5], [-19, -56, 6.5]],
    [[11, -80, 7], [16, -68, 6.5], [19, -56, 6.5]],
  ],
  crossed: [
    [[-11, -80, 7], [-17, -68, 6.5], [6, -64, 6.5]],
    [[11, -80, 7], [17, -70, 6.5], [-5, -69, 6.5]],
  ],
};

function sisterBody(colour, { apron = false, arms = ARMS.down, o = 0.7 } = {}) {
  return merge(
    {
      lines: [sDress, sLegs, sShoes],
      fine: [sWaist, sCollar, sFolds, ...(apron ? [sApron] : [sSash, sBow])],
      washes: [
        { c: colour, o, d: sDress },
        { c: PAL.slate, o: 0.85, d: sShoes },
        ...(apron ? [] : [{ c: PAL.red, o: 0.8, d: sSash + sBow }]),
      ],
      whites: apron ? [sApron] : [],
    },
    ...arms.map((a) => arm(a, colour, o)),
  );
}

// Heads (centre of the face at 0,0). The face outline stops under the hair.
const hFace = 'M-11 -2C-11.5 8 -6 12 0 12C6 12 11.5 8 11 -2';
const hFaceFill = `${hFace}C10 -8 4 -10 0 -10C-4 -10 -10 -8 -11 -2Z`;
const hHair = 'M-11.5 -1C-13.5 -11 -7 -15.5 0 -15.5C7 -15.5 13.5 -11 11.5 -1C10 -6 6 -9 1 -10C-3 -8 -8 -7 -11.5 -1Z';

// Rose: a dark plait over her right shoulder (on our left), tied with a sky-blue ribbon.
const plait = limb([[-11, 0, 6], [-15, 9, 6], [-16.5, 21, 5]]);
const plaitMarks = 'M-13 3.5l-5 -1M-14.5 9l-5 0M-15 14.5l-4.5 0.5';
const ribbon = 'M-16 22L-11.5 26L-14.5 27.5ZM-17 22L-21.5 26L-18.5 27.5Z';
export function roseHead({ mood = 'happy', look = 0, plaitRight = false } = {}) {
  const m = place(faceMarks(mood), `translate(${look} 0)`);
  // plaitRight: the plait over the other shoulder (when her arms are busy on that side)
  const flip = (d) => (plaitRight ? transformPath(d, 'scale(-1 1)') : d);
  const [rPlait, rPlaitMarks, rRibbon] = [plait, plaitMarks, ribbon].map(flip);
  return {
    lines: [hFace, hHair, rPlait],
    fine: [rPlaitMarks, rRibbon, 'M1 -10C1 -13 0 -14 -1 -15.5', `M${look} 2.5c1.4 1 1.4 2 -0.4 2.4`, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: hFaceFill },
      { c: PAL.ink, o: 0.72, d: `${hHair}${rPlait}Z` },
      { c: PAL.sky, o: 0.9, d: rRibbon },
      cheeks(7, 5, 2.3),
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

export function rose({ mood = 'happy', arms = ARMS.down, tilt = 0, look = 0, plaitRight = false } = {}) {
  return merge(sisterBody(PAL.sky, { apron: true, arms }), place(roseHead({ mood, look, plaitRight }), headT(tilt)));
}

// Fanchon: terracotta hair pulled up in a high round bun with a red ribbon; a little turned-up nose.
const fBun = oval(0, -21, 8, 7);
const fRibbon = 'M-6 -16C-2 -14 2 -14 6 -16L6 -13C2 -11 -2 -11 -6 -13Z';
export function fanchonHead({ mood = 'smug', look = 0 } = {}) {
  const m = place(faceMarks(mood), `translate(${look} 0)`);
  return {
    lines: [hFace, hHair, fBun],
    fine: [fRibbon, 'M-4 -13q4 -4 8 0M-1 -24q2 2 1 5', `M${look - 0.5} 2.5q1.5 0.6 1.5 2.4q-1 0.4 -2 0`, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: hFaceFill },
      { c: PAL.terracotta, o: 0.9, d: `${hHair}${fBun}` },
      { c: PAL.red, o: 0.9, d: fRibbon },
      cheeks(7, 5, 2.3),
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

export function fanchon({ mood = 'smug', arms = ARMS.crossed, tilt = 0, look = 0 } = {}) {
  return merge(sisterBody(PAL.rose, { arms, o: 0.75 }), place(fanchonHead({ mood, look }), headT(tilt)));
}

// Fanchon seen from behind (she turns her back): the back of her head all hair, the bun on top, her
// sash tied in a big bow at the back, and her hands on her hips.
export const ARMS_AKIMBO = [
  [[-11, -80, 7], [-25, -68, 6.5], [-14, -57, 6.5]],
  [[11, -80, 7], [25, -68, 6.5], [14, -57, 6.5]],
];
const fBackHair = oval(0, 0, 11.5, 12.5);
const fBackBow = 'M0 -52L-10 -60L-11 -46ZM0 -52L10 -60L11 -46ZM-1 -52L-5 -38M1 -52L5 -38';
export function fanchonBack({ tilt = 0 } = {}) {
  const head = place(
    {
      lines: [fBackHair, fBun],
      fine: [fRibbon, 'M-4 -6q-2 6 -1 14M3 -8q2 7 0 15M-1 -24q2 2 1 5', 'M-11 -2q-3 2 0 5M11 -2q3 2 0 5'],
      washes: [
        { c: PAL.terracotta, o: 0.9, d: `${fBackHair}${fBun}` },
        { c: PAL.red, o: 0.9, d: fRibbon },
        { c: PAL.rose, o: 0.6, d: 'M-11 -2q-3 2 0 5ZM11 -2q3 2 0 5Z' },
      ],
    },
    headT(tilt),
  );
  return merge(
    {
      lines: [sDress, sLegs, sShoes],
      fine: [sWaist, sFolds, 'M0 -86L0 -56', fBackBow],
      washes: [
        { c: PAL.rose, o: 0.75, d: sDress },
        { c: PAL.slate, o: 0.85, d: sShoes },
        { c: PAL.red, o: 0.8, d: `${sSash}M0 -52L-10 -60L-11 -46ZM0 -52L10 -60L11 -46Z` },
      ],
    },
    ...ARMS_AKIMBO.map((a) => arm(a, PAL.rose, 0.75)),
    head,
  );
}

/** The transform that puts a sister's head in place on her body, turned by tilt (degrees). */
export const headT = (tilt = 0) => `translate(${S_HEAD[0]} ${S_HEAD[1]}) rotate(${tilt})`;

// ---------------------------------------------------------------------------------------------
// The fairy as a poor old woman (feet at 0,0, about 96 tall, bent forward towards the right): a
// grey shawl over her head and back, a dull ochre skirt with a sky-blue patch, a long stick in her
// left hand; her right hand reaches up (pts below). Face centre at (19, -72).
export const OLD_FACE = [19, -72];
const oSkirt = 'M-20 -3C-19 -20 -14 -38 -7 -50L20 -50C23 -36 27 -18 29 -3C12 1 -4 1 -20 -3Z';
const oShawl = 'M-15 -42C-20 -60 -10 -84 9 -90C25 -95 35 -86 33 -72C32 -62 28 -52 24 -44C12 -38 -2 -37 -15 -42Z';
const oShawlTail = 'M-15 -42C-18 -34 -18 -26 -14 -20C-10 -28 -6 -34 -2 -38';
const oOpening = 'M10 -76C9 -86 28 -88 29 -76C30 -66 25 -61 19 -61C13 -61 10 -66 10 -76Z';
const oPatch = 'M4 -26L15 -27L15 -15L5 -14Z';
const oShoes = oval(-6, -2.5, 6, 3.2) + oval(14, -2.5, 6, 3.2);
const oStick = limb([[44, 0, 4.2], [43, -26, 4.6], [44, -46, 4.4], [42, -52, 5.2]]);
export const OLD_REACH = [[16, -54, 6.5], [30, -60, 6], [40, -70, 6]];
export function oldWoman({ reach = null, mood = 'kind' } = {}) {
  const m = faceMarks(mood, 0.85);
  const face = place(
    {
      fine: ['M-1 2c1.6 1 1.6 2.2 -0.6 2.6', 'M-8 7q1.5 1.5 0 3M8 7q-1.5 1.5 0 3', 'M-5 -7q-2 -1.6 -4 0M5 -7q2 -1.6 4 0', ...m.fine],
      washes: [cheeks(6, 4, 2), ...m.washes],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
    `translate(${OLD_FACE[0]} ${OLD_FACE[1]}) scale(0.95)`,
  );
  const hold = [[20, -54, 6.5], [32, -50, 6], [42, -47, 6]];
  return merge(
    {
      lines: [oSkirt, oShawl, oShawlTail, oOpening, oStick, oShoes],
      fine: [oPatch, 'M2 -46C6 -40 10 -40 14 -46M-6 -40q4 6 6 12', 'M12 -84q-4 2 -3 8M27 -84q3 3 2 8', 'M0 -36q2 10 0 20M20 -40q2 10 2 22'],
      washes: [
        { c: PAL.ochre, o: 0.45, d: oSkirt },
        { c: PAL.terracotta, o: 0.25, d: oSkirt },
        { c: PAL.sky, o: 0.75, d: oPatch },
        { c: PAL.grey, o: 0.85, d: `${oShawl}${oOpening}${oShawlTail}C-10 -28 -6 -34 -2 -38Z`, rule: 'evenodd' },
        { c: PAL.rose, o: 0.32, d: oOpening },
        { c: PAL.slate, o: 0.85, d: oShoes },
        { c: PAL.terracotta, o: 0.7, d: `${oStick}Z` },
      ],
    },
    face,
    arm(hold, PAL.grey, 0.8),
    ...(reach ? [arm(reach, PAL.grey, 0.8)] : []),
  );
}

// ---------------------------------------------------------------------------------------------
// The fairy as a grand lady (feet at 0,0, about 140 tall): a wide ochre gown with puffed sleeves and
// a scalloped hem, silver hair in a bun, a little golden tiara with a sparkle. Face centre (0,-114).
// arms: two limb centrelines from the shoulders (±12, -98); wand: a thin wand with a star in the
// right hand.
export const LADY_HEAD = [0, -114];
const lGown =
  'M-10 -102C-13 -92 -13 -80 -11 -70C-22 -54 -32 -30 -38 -4C-14 1 14 1 38 -4C32 -30 22 -54 11 -70C13 -80 13 -92 10 -102C4 -105 -4 -105 -10 -102Z';
const lHem = 'M-38 -4C-36 -10 -30 -10 -28 -3M-28 -3C-26 -9 -20 -9 -18 -2M-18 -2C-16 -8 -10 -8 -8 -1M-8 -1C-6 -7 0 -7 2 -1M2 -1C4 -7 10 -7 12 -2M12 -2C14 -8 20 -8 22 -3M22 -3C24 -9 30 -9 32 -4';
const lWaist = 'M-11 -70C-4 -67 4 -67 11 -70';
const lPuffs = oval(-13, -95, 6, 5) + oval(13, -95, 6, 5);
const lFace = 'M-10.5 -2C-11 8 -5.5 12 0 12C5.5 12 11 8 10.5 -2';
const lFaceFill = `${lFace}C9.5 -8 4 -10 0 -10C-4 -10 -9.5 -8 -10.5 -2Z`;
const lHair = 'M-11 -1C-13 -11 -7 -15.5 0 -15.5C7 -15.5 13 -11 11 -1C9 -7 5 -9 0 -9C-5 -9 -9 -7 -11 -1Z';
const lBun = oval(0, -18, 6.5, 5);
const lTiara = 'M-8 -13L-6 -20L-3 -15L0 -23L3 -15L6 -20L8 -13C3 -14.5 -3 -14.5 -8 -13Z';
const lDots = [[-20, -40], [14, -48], [-6, -26], [24, -22], [-26, -16], [4, -12], [-10, -56], [6, -38]];
export const LADY_ARMS = {
  // right hand holds the wand up beside her, left hand open towards the right
  ask: [
    [[-12, -98, 7.5], [-22, -86, 6.5], [-27, -74, 6.5]],
    [[12, -98, 7.5], [26, -90, 6.5], [38, -88, 6.5]],
  ],
  // both hands out a little, the left one holding the wand
  wand: [
    [[-12, -98, 7.5], [-24, -88, 6.5], [-30, -100, 6.5]],
    [[12, -98, 7.5], [24, -88, 6.5], [34, -84, 6.5]],
  ],
};
/** A five-pointed star (sparkle) of radius r at (x, y). */
export function star(x, y, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const k = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${Math.round((x + Math.cos(a) * k) * 10) / 10} ${Math.round((y + Math.sin(a) * k) * 10) / 10}`;
  }
  return `${d}Z`;
}
/** A little four-pointed twinkle at (x, y). */
export const twinkle = (x, y, r) => `M${x} ${y - r}L${x} ${y + r}M${x - r} ${y}L${x + r} ${y}M${x - r * 0.5} ${y - r * 0.5}L${x + r * 0.5} ${y + r * 0.5}M${x + r * 0.5} ${y - r * 0.5}L${x - r * 0.5} ${y + r * 0.5}`;

export function lady({ mood = 'kind', arms = LADY_ARMS.ask, wandHand = 0 } = {}) {
  const m = faceMarks(mood);
  const [wx, wy] = arms[wandHand][arms[wandHand].length - 1];
  const wandTip = [wx - 4, wy - 30];
  const wand = `M${wx + 1} ${wy + 4}L${wandTip[0]} ${wandTip[1] + 6}`;
  const wStar = star(wandTip[0], wandTip[1], 7);
  const head = place(
    {
      lines: [lFace, lHair, lBun],
      fine: [lTiara, 'M-4 -12q4 -3 8 0', 'M0 2.5c1.4 1 1.4 2 -0.4 2.4', twinkle(0, -28, 3.5), ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.3, d: lFaceFill },
        { c: PAL.grey, o: 0.55, d: `${lHair}${lBun}` },
        { c: PAL.ochre, o: 0.95, d: lTiara },
        cheeks(6.5, 5, 2.2),
        ...m.washes,
      ],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
    `translate(${LADY_HEAD[0]} ${LADY_HEAD[1]})`,
  );
  return merge(
    {
      lines: [lGown, lPuffs],
      fine: [lHem, lWaist, 'M-16 -40C-18 -30 -20 -20 -22 -6M16 -42C18 -30 20 -20 22 -6M0 -66L0 -6', wand, wStar, 'M-6 -102C-3 -98 3 -98 6 -102'],
      once: [twinkle(wandTip[0] + 11, wandTip[1] - 6, 3), twinkle(wandTip[0] - 10, wandTip[1] + 4, 2.4)],
      washes: [
        { c: PAL.ochre, o: 0.72, d: lGown },
        { c: PAL.ochre, o: 0.5, d: lPuffs },
        { c: PAL.terracotta, o: 0.5, d: lDots.map(([x, y]) => dot(x, y, 2.2)).join('') },
        { c: PAL.ochre, o: 0.95, d: wStar },
      ],
    },
    ...arms.map((a) => arm(a, PAL.ochre, 0.62)),
    head,
  );
}

// ---------------------------------------------------------------------------------------------
// The mother (feet at 0,0, about 120 tall, stout): a slate dress, a white apron, a white mob cap over
// grey hair. Face centre (0, -100), a bit bigger than the girls'. arms from the shoulders (±15, -82).
export const M_HEAD = [0, -100];
const mDress =
  'M-14 -86C-22 -74 -24 -60 -23 -48C-31 -36 -35 -20 -36 -7C-14 -3 14 -3 36 -7C35 -20 31 -36 23 -48C24 -60 22 -74 14 -86C6 -90 -6 -90 -14 -86Z';
const mApron = 'M-14 -50C-16 -38 -18 -24 -19 -10C-6 -8 6 -8 19 -10C18 -24 16 -38 14 -50C5 -48 -5 -48 -14 -50Z';
const mBib = 'M-8 -50L-8 -70L8 -70L8 -50';
const mLegs = 'M-9 -6L-10 -4M9 -6L10 -4';
const mShoes = oval(-11, -2.5, 6.5, 3.4) + oval(11, -2.5, 6.5, 3.4);
const mFace = 'M-13 -2C-13.5 9 -7 14 0 14C7 14 13.5 9 13 -2';
const mFaceFill = `${mFace}C11 -8 5 -10 0 -10C-5 -10 -11 -8 -13 -2Z`;
const mHair = 'M-13.5 -1C-14 -8 -10 -12 0 -12C10 -12 14 -8 13.5 -1C11 -6 6 -8 0 -8C-6 -8 -11 -6 -13.5 -1Z';
const mCap = 'M-15 -7C-18 -16 -10 -24 0 -24C10 -24 18 -16 15 -7C10 -11 -10 -11 -15 -7Z';
export const MOTHER_ARMS = {
  up: [
    [[-15, -82, 8], [-28, -92, 7], [-34, -108, 7]],
    [[15, -82, 8], [28, -92, 7], [34, -108, 7]],
  ],
  wide: [
    [[-15, -82, 8], [-30, -84, 7], [-40, -96, 7]],
    [[15, -82, 8], [30, -84, 7], [40, -96, 7]],
  ],
};
export function mother({ mood = 'wow', arms = MOTHER_ARMS.up, tilt = 0 } = {}) {
  const m = faceMarks(mood, 1.1);
  const head = place(
    {
      lines: [mFace, mCap],
      fine: [mHair, 'M-10 -14q3 -3 6 0M4 -14q3 -3 6 0', 'M-0.5 2c2 0.8 2.4 2.6 -0.2 3.4', 'M-12 7q-2 2 0 4', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.35, d: mFaceFill },
        { c: PAL.grey, o: 0.8, d: mHair },
        cheeks(8, 5, 2.6),
        ...m.washes,
      ],
      whites: [mCap, ...m.whites],
      fills: m.fills,
      glints: m.glints,
    },
    `translate(${M_HEAD[0]} ${M_HEAD[1]}) rotate(${tilt})`,
  );
  return merge(
    {
      lines: [mDress, mLegs, mShoes],
      fine: [mApron, mBib, 'M-9 -88C-4 -83 4 -83 9 -88', 'M-27 -26C-28 -20 -29 -14 -30 -8M27 -26C28 -20 29 -14 30 -8'],
      washes: [
        { c: PAL.slate, o: 0.72, d: mDress },
        { c: PAL.ink, o: 0.55, d: mShoes },
      ],
      whites: [mApron, `${mBib}Z`],
    },
    ...arms.map((a) => arm(a, PAL.slate, 0.72, 4.8)),
    head,
  );
}

// ---------------------------------------------------------------------------------------------
// The round stone well (the middle of its front bottom at 0,0), about 128 tall to the roof top: a
// low round wall of grey stones, two wooden posts, a little terracotta roof, a crank and a bucket on
// a rope.
const wWall = 'M-36 -38L-36 -2C-22 5 22 5 36 -2L36 -38';
const wRim = oval(0, -38, 36, 9);
const wWater = oval(0, -38, 30, 6);
const wStones =
  'M-36 -26C-22 -20 22 -20 36 -26M-36 -14C-22 -8 22 -8 36 -14M-22 -33L-22 -21M2 -29L2 -19M24 -32L24 -21M-30 -20L-30 -10M-10 -19L-10 -8M14 -19L14 -9M30 -16L30 -6M-24 -8L-24 1M0 -6L0 3M22 -7L22 1';
const wPosts = 'M-30 -40L-30 -104M-24 -42L-24 -104M30 -40L30 -104M24 -42L24 -104';
const wRoof = 'M-46 -100L0 -128L46 -100C30 -97 -30 -97 -46 -100Z';
const wBar = 'M-24 -86L34 -86';
const wCrank = 'M34 -86L42 -86L42 -76L48 -76';
const wRope = 'M6 -86L6 -62';
const wBucket = 'M-1 -62L13 -62L11 -50L1 -50Z';
export function well() {
  return {
    lines: [wWall, wRim, wPosts, wRoof],
    fine: [wStones, wBar, wCrank, wRope, wBucket, 'M-30 -96l-6 -4M30 -96l6 -4', 'M-20 -108l40 0M-10 -116l20 0'],
    washes: [
      { c: PAL.grey, o: 0.6, d: `${wWall}C22 -47 -22 -47 -36 -38Z` },
      { c: PAL.slate, o: 0.75, d: wWater },
      { c: PAL.ochre, o: 0.7, d: 'M-30 -40L-30 -104L-24 -104L-24 -42ZM30 -40L30 -104L24 -104L24 -42Z' },
      { c: PAL.terracotta, o: 0.8, d: wRoof },
      { c: PAL.ochre, o: 0.6, d: wBucket },
    ],
    whites: [],
  };
}

// ---------------------------------------------------------------------------------------------
// Jugs (the middle of the bottom at 0,0, 26 tall, the spout on the left at (-10, -27)). The
// earthenware jug is terracotta; the silver jug is slate with a shine. pouring: a stream of water
// from the spout (only makes sense once the jug is tipped).
const jBody = 'M-7 0C-14 -5 -14 -15 -8 -20L-6 -24L6 -24L8 -20C14 -15 14 -5 7 0Z';
const jSpout = 'M-6 -24L-11 -28L-5 -26';
const jHandle = 'M9 -19C17 -19 17 -6 10 -4';
const jBand = 'M-11.6 -13C-4 -11 4 -11 11.6 -13';
export const JUG_SPOUT = [-11, -28];
export function jug({ silver = false } = {}) {
  const body = jBody + 'M-6 -24L-11 -28L-5 -26Z';
  return {
    lines: [jBody, jHandle],
    fine: [jSpout, jBand],
    washes: silver
      ? [{ c: PAL.slate, o: 0.55, d: body }, { c: PAL.grey, o: 0.5, d: body }]
      : [{ c: PAL.terracotta, o: 0.85, d: body }, { c: PAL.ochre, o: 0.45, d: 'M-11.6 -13C-4 -11 4 -11 11.6 -13L11 -9C4 -7 -4 -7 -11 -9Z' }],
    whites: silver ? ['M5 -19C9 -16 9 -8 6 -4C7 -9 7 -14 5 -19Z'] : [],
  };
}

// ---------------------------------------------------------------------------------------------
// Little treasures (centre at 0,0): a rose (red or pink, with a green leaf), a pearl, a diamond, a
// daisy.
export function flower(c = PAL.red, s = 1) {
  const head = oval(0, 0, 5.5, 5);
  const spiral = 'M-1 -1c1.5 -1.6 3.2 0 2 1.4c-1.6 1.6 -4 0.4 -3.6 -1.8M-4.5 1.5q3 3 7 1';
  const leaf = 'M2 4C6 4 10 7 11 10C7 10 4 8 2 4Z';
  const t = `scale(${s})`;
  return place(
    {
      fine: [head, spiral, leaf, 'M0 5L2 11'],
      washes: [
        { c, o: 0.9, d: head },
        { c: PAL.green, o: 0.85, d: leaf },
      ],
    },
    t,
  );
}
export const pearl = (r = 3.2) => ({ fine: [dot(0, 0, r)], whites: [dot(0, 0, r)], washes: [{ c: PAL.grey, o: 0.25, d: dot(0.8, 0.8, r * 0.8) }], glints: [] });
export function diamond(s = 1) {
  const d = 'M-6 -2L-3 -5L3 -5L6 -2L0 6Z';
  return place(
    {
      fine: [d, 'M-6 -2L6 -2M-3 -5L-1.5 -2L0 6M3 -5L1.5 -2'],
      washes: [{ c: PAL.sky, o: 0.95, d }],
      once: [twinkle(6, -7, 2.4)],
    },
    `scale(${s})`,
  );
}

// ---------------------------------------------------------------------------------------------
// Frogs and toads (the middle of the bottom at 0,0, about 20 wide, looking at us). A frog is green
// and smooth with big round eyes on top; a toad is fatter, brown (ochre and grey) and warty.
// leap: a frog seen from the side in mid-jump (centre at 0,0, nose to the right, back legs stretched
// out behind); point the jump with a rotate.
export function frog({ toad = false, leap = false } = {}) {
  const colour = (d) =>
    toad ? [{ c: PAL.ochre, o: 0.7, d }, { c: PAL.grey, o: 0.7, d }] : [{ c: PAL.green, o: 0.9, d }];
  if (leap) {
    const body = 'M-10 1C-10 -6 -2 -9 6 -8C12 -7 15 -3 14 1C12 5 4 7 -2 6C-7 6 -10 4 -10 1Z';
    const eye = dot(7, -8, 3.2) + dot(1.5, -8.5, 2.8);
    const legs = 'M-8 3C-12 7 -16 8 -20 7L-26 9M-20 7L-25 4M-7 -3C-12 -4 -16 -5 -19 -6L-25 -4M-19 -6L-24 -9M10 5L15 10M5 6L7 12';
    const warts = toad ? dot(-3, -2, 1) + dot(2, 2, 1) + dot(-6, 2, 0.9) : '';
    return {
      lines: [body, eye, legs],
      fine: ['M9 0q3 1.6 5 -0.6'],
      washes: colour(body + eye),
      whites: [dot(7, -8, 2.1), dot(1.5, -8.5, 1.8)],
      fills: [dot(7.6, -8, 1.2) + dot(2, -8.5, 1), warts].filter(Boolean),
    };
  }
  const w = toad ? 12 : 10;
  const body = `M${-w} 0C${-w - 2} -7 ${-w + 3} -13 0 -13C${w - 3} -13 ${w + 2} -7 ${w} 0C${w / 2} 2 ${-w / 2} 2 ${-w} 0Z`;
  const eyes = dot(-5, -13, 3.4) + dot(5, -13, 3.4);
  const legs = `M${-w} -3C${-w - 7} -5 ${-w - 7} 2 ${-w + 1} 1M${w} -3C${w + 7} -5 ${w + 7} 2 ${w - 1} 1`;
  const feet = 'M-4 0l-2 2M-1 0l0 2M4 0l2 2M1 0l0 2';
  const warts = toad ? dot(-6, -6, 1.1) + dot(5, -4, 1.1) + dot(0, -9, 0.9) + dot(8, -8, 0.9) + dot(-2, -3, 0.9) : '';
  return {
    lines: [body, eyes, legs],
    fine: [feet, toad ? 'M-5 -6q5 3 10 0' : 'M-4 -6q4 3 8 0'],
    washes: colour(body + eyes),
    whites: [dot(-5, -13, 2.2), dot(5, -13, 2.2)],
    fills: [dot(-5, -13, 1.2) + dot(5, -13, 1.2), warts].filter(Boolean),
  };
}

/** A path data helper: moves d by t (re-exported for scene shapes). */
export const tp = transformPath;
