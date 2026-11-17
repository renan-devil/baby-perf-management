import { PAL, transformPath } from '../lib.mjs';
import { dot, f, limb, oval } from '../stone-soup/characters.mjs';

// Little Red Riding Hood: the girl, the wolf, Mother, Grandmother, the woodcutter, the basket, the
// flowers, Grandmother's cottage and her furniture (bed, wardrobe, window, table), shared by the ten
// pictures. Each is drawn once here and placed in each picture with a transform (place). The build
// only draws files named <n>.mjs, so this file is not a picture. Standing characters have their feet
// at y = 0.

export { compose, place, merge, at, dot, oval, limb } from '../stone-soup/characters.mjs';

const tr = (d, t) => (t ? transformPath(d, t) : d);

/** An arm along pts with a round rosy hand at its end; sleeve is its colour. */
function arm(pts, sleeve, o = 0.62, hand = 4.2) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.6, d: h }] };
}

const join = (...parts) => {
  const out = { lines: [], fine: [], once: [], washes: [], whites: [], fills: [], glints: [] };
  for (const p of parts) for (const k of Object.keys(out)) out[k].push(...(p[k] ?? []));
  return out;
};

/**
 * Eyes and mouth of the people (the face centre at 0,0): eyes at (±ex, ey), mouth at my. mood:
 * 'happy', 'peep' (looking right), 'wow' (eyes wide, mouth a small "o"), 'scared' (eyes wide, brows
 * up, mouth wide open), 'laugh' (eyes squeezed shut, mouth open), 'stern' (a raised brow, a little
 * pursed smile).
 */
function faceMarks({ mood, ex = 4.5, ey = -1, my = 6, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 7} ${w} ${my + 7} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(`M${-ex - 3} ${ey}q3 -3.4 6 0M${ex - 3} ${ey}q3 -3.4 6 0`, mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'wow' || mood === 'scared') {
    whites.push(dot(-ex, ey, 2.9), dot(ex, ey, 2.9));
    fine.push(dot(-ex, ey, 2.9), dot(ex, ey, 2.9), `M${-ex - 3} ${ey - 5}q3 -2.5 6 -0.5M${ex - 3} ${ey - 5.5}q3 -2 6 0.5`);
    fills.push(dot(-ex, ey + 0.3, 1.4), dot(ex, ey + 0.3, 1.4));
    if (mood === 'wow') fills.push(oval(0, my + 1, 1.8, 2.3));
    else {
      const mouth = oval(0, my + 1.5, 3.2, 3.8);
      fine.push(mouth);
      washes.push({ c: PAL.red, o: 0.8, d: mouth });
    }
  } else {
    const dx = mood === 'peep' ? 1.2 : mood === 'peepL' ? -1.2 : 0;
    fills.push(dot(-ex + dx, ey, 1.8), dot(ex + dx, ey, 1.8));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.55), dot(ex + dx - 0.5, ey - 0.6, 0.55));
    if (mood === 'stern') fine.push(`M${-ex - 3} ${ey - 4.5}q3 -1.5 6 0.5M${ex - 3} ${ey - 6}q3 -2.5 6 -0.5`, `M-2.5 ${my}q2.5 1.6 5 0`);
    else if (mood === 'peep' || mood === 'peepL') fine.push(`M-3 ${my}q3 2.4 6 0`);
    else fine.push(`M${-w} ${my - 0.5}q${w} 4.5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

// ---------------------------------------------------------------------------------------------
// Little Red Riding Hood's head (centre of the face at 0,0): a round face with rosy cheeks and a dark
// fringe, framed by her cherry-red hood.
const gFace = oval(0, 0, 11.5, 12);
const gHood = 'M-15 13C-23 4 -22 -14 -10 -20C-2 -24 8 -23 15 -18C23 -10 23 4 15 13C8 16 -8 16 -15 13Z';
const gHoodRim = 'M-13 9C-17 0 -16 -12 -6 -15';
const gFringe = 'M-10.5 -4C-9.5 -11 -4 -13 0 -12.5C5 -13 10 -10 10.5 -4C8 -7 5 -6 3 -8.5C1 -6 -3 -6 -4 -8.5C-6 -6 -9 -6 -10.5 -4Z';

export function girlHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 4.5, ey: 0, my: 6 });
  return {
    lines: [gHood, gFace],
    fine: [gFringe, gHoodRim, ...m.fine],
    washes: [
      { c: PAL.red, o: 0.82, d: `${gHood}${gFace}`, rule: 'evenodd' },
      { c: PAL.rose, o: 0.3, d: gFace },
      { c: PAL.ink, o: 0.55, d: gFringe },
      { c: PAL.rose, o: 0.7, d: dot(-6.5, 5, 2.3) + dot(6.5, 5, 2.3) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

// Little Red Riding Hood (feet at 0,0), about 118 tall: her red hooded cape over a sky-blue dress,
// stick legs and slate shoes. Head at (0, -92), turned by tilt. arms: two limb centrelines that come
// out from under the cape (G_ARMS has the usual ones; the hands are at the ends). legs: 'stand',
// 'walk' or 'jump' (knees bent, off the ground).
export const G_HEAD = [0, -92];
export const G_ARMS = {
  down: [
    [[-17, -60, 7], [-21, -50, 6.5], [-22, -42, 6.5]],
    [[17, -60, 7], [21, -50, 6.5], [22, -42, 6.5]],
  ],
  // the right hand holds the basket handle at (24, -50)
  basket: [
    [[-17, -60, 7], [-22, -50, 6.5], [-23, -42, 6.5]],
    [[17, -62, 7], [24, -56, 6.5], [26, -50, 6.5]],
  ],
  // both hands in front, holding a bunch of flowers at (8, -58)
  hug: [
    [[-15, -64, 7], [-6, -56, 6.5], [4, -58, 6.5]],
    [[15, -64, 7], [16, -56, 6.5], [10, -58, 6.5]],
  ],
  // reaching out with the right hand to (38, -74), to take something
  take: [
    [[-17, -60, 7], [-22, -50, 6.5], [-23, -42, 6.5]],
    [[16, -64, 7], [28, -70, 6.5], [38, -74, 6.5]],
  ],
  // picking a flower: the right hand reaches down to (34, -32)
  pick: [
    [[-17, -60, 7], [-22, -50, 6.5], [-23, -42, 6.5]],
    [[17, -60, 7], [28, -46, 6.5], [34, -34, 6.5]],
  ],
  // picking a flower: the right hand reaches down to (34, -32), the left holds her bunch at (-22, -42)
  pickBunch: [
    [[-17, -60, 7], [-23, -50, 6.5], [-22, -42, 6.5]],
    [[17, -60, 7], [28, -46, 6.5], [34, -34, 6.5]],
  ],
  // flung up in surprise
  up: [
    [[-15, -66, 7], [-27, -78, 6.5], [-32, -94, 6.5]],
    [[15, -66, 7], [27, -78, 6.5], [32, -94, 6.5]],
  ],
};
const gCape = 'M-9 -80C-16 -74 -24 -56 -29 -34C-14 -29 14 -29 29 -34C24 -56 16 -74 9 -80';
const gCapeFill = `${gCape}C4 -82 -4 -82 -9 -80Z`;
const gCapeFolds = 'M-8 -60C-11 -50 -14 -42 -16 -33M9 -58C12 -50 14 -42 15 -33M0 -66L0 -31';
const gBow = 'M0 -78L-6 -82L-6 -74ZM0 -78L6 -82L6 -74Z';
const gDress = 'M-25 -33C-26 -28 -28 -24 -28 -19C-10 -16 10 -16 28 -19C28 -24 26 -28 25 -33';
const gDressFill = `${gDress}C10 -31 -10 -31 -25 -33Z`;
const G_LEGS = {
  stand: { legs: 'M-7 -18L-7 -4M7 -18L7 -4', shoes: [oval(-9, -2.5, 5.5, 3.2), oval(9, -2.5, 5.5, 3.2)] },
  walk: { legs: 'M-6 -18L-13 -5M6 -18L11 -4', shoes: [oval(-15, -3, 5.5, 3.2), oval(13, -2.5, 5.5, 3.2)] },
  jump: {
    legs: 'M-7 -18L-14 -10L-10 -2M7 -18L16 -12L14 -3',
    shoes: [transformPath(oval(-12, -1, 5.5, 3.2), 'rotate(-20 -12 -1)'), transformPath(oval(16, -2, 5.5, 3.2), 'rotate(20 16 -2)')],
  },
};

export function girl({ mood = 'happy', tilt = 0, arms = G_ARMS.down, legs = 'stand' } = {}) {
  const L = G_LEGS[legs];
  const parts = arms.map((a) => arm(a, PAL.sky, 0.6, 4));
  return join(
    {
      lines: [gCape, gDress, L.legs, ...L.shoes],
      fine: [gCapeFolds, gBow],
      washes: [
        { c: PAL.sky, o: 0.62, d: gDressFill },
        { c: PAL.red, o: 0.8, d: gCapeFill },
        { c: PAL.ochre, o: 0.85, d: gBow },
        { c: PAL.slate, o: 0.85, d: L.shoes.join('') },
      ],
    },
    ...parts,
    placeIn(girlHead({ mood }), `translate(${G_HEAD[0]} ${G_HEAD[1]}) rotate(${tilt})`),
  );
}

function placeIn(ch, t) {
  const out = {};
  for (const k of ['lines', 'fine', 'once', 'washes', 'whites', 'fills', 'glints']) {
    out[k] = (ch[k] ?? []).map((v) => (k === 'washes' ? { ...v, d: tr(v.d, t) } : tr(v, t)));
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// The basket (the hand holds the top of the handle at 0,0): an ochre wicker basket with a clean white
// cloth tucked over the top.
const bHandle = 'M-12 14C-12 -3 12 -3 12 14';
const bBody = 'M-17 13L-13 30C-6 33 6 33 13 30L17 13Z';
const bCloth = 'M-18 14C-13 6 -5 9 0 6C6 9 13 6 18 14C17 18 12 18 10 17L6 23L3 17C-6 18 -14 18 -18 14Z';
const bWeave = 'M-15 19L15 19M-14 25L14 25M-8 14L-6 31M0 15L0 32M8 14L6 31';
export function basket() {
  return {
    lines: [bHandle, bBody],
    fine: [bWeave, bCloth],
    washes: [{ c: PAL.ochre, o: 0.8, d: `${bBody}` }, { c: PAL.ochre, o: 0.6, d: limb([[-12, 14, 3], [-10, 2, 3], [0, -1, 3], [10, 2, 3], [12, 14, 3]]) }],
    whites: [bCloth],
  };
}

// ---------------------------------------------------------------------------------------------
// A flower (the stem foot at 0,0): a green stem with a leaf and a round five-petal blossom of colour c.
export function flower(c = PAL.red, { h = 18, r = 5 } = {}) {
  const petals = [0, 72, 144, 216, 288]
    .map((a) => {
      const rad = ((a - 90) * Math.PI) / 180;
      return dot(Math.cos(rad) * r * 0.7, -h + Math.sin(rad) * r * 0.7, r * 0.55);
    })
    .join('');
  const stem = `M0 0C1 ${f(-h * 0.4)} -1 ${f(-h * 0.7)} 0 ${-h}`;
  const leafD = `M0 ${f(-h * 0.35)}C4 ${f(-h * 0.5)} 8 ${f(-h * 0.45)} 9 ${f(-h * 0.55)}C6 ${f(-h * 0.3)} 3 ${f(-h * 0.3)} 0 ${f(-h * 0.35)}Z`;
  return {
    fine: [stem, leafD, petals],
    washes: [
      { c, o: 0.85, d: petals },
      { c: PAL.green, o: 0.8, d: leafD },
    ],
    fills: [dot(0, -h, r * 0.3)],
  };
}

/** A bunch of flowers (the hand holds the stems at 0,0). */
export function bunch() {
  const blooms = [
    [-10, -26, PAL.red, -18],
    [0, -32, PAL.ochre, 0],
    [10, -27, PAL.sky, 16],
    [-5, -20, PAL.rose, -8],
    [6, -20, PAL.red, 8],
  ];
  const parts = blooms.map(([x, y, c, a]) => placeIn(flower(c, { h: Math.hypot(x, y), r: 5 }), `rotate(${a})`));
  return join(...parts, { fine: ['M-4 2L4 2'] });
}

// ---------------------------------------------------------------------------------------------
// The wolf's head (the middle of his skull at 0,0), facing right: a long nose with a round black tip,
// big pointed ears, one big round goofy eye and a big wide smile. Comic, never scary.
// mouth: 'smile', 'grin' (smile with a pink tongue), 'roar' (jaw wide open, a pink tongue and two
// little blunt teeth) or 'tuck' (no jaw: the blanket is pulled up to his nose).
// cap: Grandmother's frilly white nightcap, his ears poking out. glasses: her round glasses.
const wForehead = 'M-19 4C-23 -8 -17 -20 -4 -21C6 -22 12 -17 17 -13';
const wSnout = 'M17 -13C26 -10 36 -9 43 -9C49 -8 51 -2 47 1';
const wJaw = 'M47 1C40 8 24 12 10 14C-2 16 -14 12 -19 4';
const wSnoutTuck = 'M17 -13C26 -10 36 -9 43 -9C49 -8 51 -3 48 -1';
const wEars = 'M-15 -15L-21 -42L-5 -21ZM-3 -21L3 -46L11 -18Z';
const wInnerEars = 'M-14 -20L-17 -35L-8 -22ZM-1 -23L3 -38L7 -20Z';
const wNose = oval(46, -6, 5, 4);
const wFur = 'M-19 6l-6 2M-17 10l-5 5M-12 13l-2 6';
const wBrow = 'M2 -19Q8 -22 14 -18';
const W_EYE = [8, -11];
const wLens = dot(8, -11, 7.5);
const wGlassesArm = 'M0.5 -11L-14 -8';
const wFarLens = 'M17 -13C19 -18 25 -19 28 -15M15.5 -11.5L18.5 -12.5';
// the roaring jaw, dropped open
const wUpperLip = 'M47 1C40 3 30 3 18 3';
const wJawRoar = 'M18 3C26 10 36 18 42 24C45 27 41 31 34 29C20 25 4 18 -19 4';
const wMouthRoar = 'M47 1C40 3 30 3 18 3C26 10 36 18 42 24C45 16 47 8 47 1Z';
const wTongue = 'M27 12C32 14 38 19 41 23C35 24 29 19 27 12Z';
const wTeeth = 'M38 2.5L39.5 7.5L41 2.3ZM29 3L30.5 7.5L32 3Z';
// the nightcap: a puffy white dome over his skull with a frill round his face and a rose ribbon
const frill = (() => {
  // scallops from (1,-22) down to (-8,10), behind his eye, bulging forward
  const n = 6;
  let d = 'M1 -22';
  const p = (t) => [1 * (1 - t) ** 2 + 2 * (1 - t) * t * -2 + -8 * t * t, -22 * (1 - t) ** 2 + 2 * (1 - t) * t * -6 + 10 * t * t];
  for (let i = 1; i <= n; i++) {
    const [x1, y1] = p(i / n);
    const [mx, my] = p((i - 0.5) / n);
    d += `Q${f(mx + 5)} ${f(my + 0.5)} ${f(x1)} ${f(y1)}`;
  }
  return d;
})();
const wCap = 'M1 -22C-6 -33 -24 -35 -32 -24C-40 -14 -38 2 -30 9C-24 13 -15 13 -8 10';
const wCapFill = `${wCap}C-4 0 -2 -10 1 -22Z`;
const wCapEars = 'M-26 -28L-31 -52L-14 -32ZM-12 -32L-6 -56L1 -28Z';
const wCapInnerEars = 'M-24 -32L-27 -46L-17 -34ZM-10 -33L-6 -48L-2 -31Z';
const wRibbon = 'M-8 10L-5 19M-8 10L-15 18M-8 10c-6 -4 -8 2 -2 2M-8 10c6 -4 7 2 1 2';

export function wolfHead({ mouth = 'smile', cap = false, glasses = false } = {}) {
  const tuck = mouth === 'tuck';
  const roar = mouth === 'roar';
  const snout = tuck ? wSnoutTuck : wSnout;
  const jaw = tuck ? '' : roar ? wJawRoar : wJaw;
  const outline = `${cap ? 'M1 -21.5C8 -21 12 -17 17 -13' : wForehead}${snout.slice(snout.indexOf('C'))}`;
  const ears = cap ? wCapEars : wEars;
  const inner = cap ? wCapInnerEars : wInnerEars;
  const headFill = tuck
    ? `${wForehead}${wSnoutTuck.slice(wSnoutTuck.indexOf('C'))}L-19 -1Z`
    : `${wForehead}${wSnout.slice(wSnout.indexOf('C'))}${(roar ? `${wUpperLip.slice(wUpperLip.indexOf('C'))}${wJawRoar.slice(wJawRoar.indexOf('C'))}` : wJaw.slice(wJaw.indexOf('C')))}Z`;
  const lines = [ears, outline];
  if (jaw) lines.push(jaw);
  const fine = [inner, tuck ? '' : wFur].filter(Boolean);
  const washes = [{ c: PAL.slate, o: 0.62, d: `${headFill}${ears}` }, { c: PAL.rose, o: 0.75, d: inner }];
  const whites = [dot(W_EYE[0], W_EYE[1], 5.5)];
  const fills = [wNose];
  const glints = [dot(44.5, -7.5, 1.1), dot(W_EYE[0] + 1.5, W_EYE[1] - 1, 0.8)];
  fine.push(dot(W_EYE[0], W_EYE[1], 5.5));
  if (roar) {
    fills.push(dot(W_EYE[0] + 0.5, W_EYE[1] + 0.3, 1.8));
    fine.push('M1 -20Q8 -26 15 -21');
    lines.push(wUpperLip);
    washes.push({ c: PAL.red, o: 0.8, d: wMouthRoar }, { c: PAL.rose, o: 0.95, d: wTongue });
    fine.push(wTongue);
    whites.push(wTeeth);
    fine.push(wTeeth);
  } else {
    fills.push(dot(W_EYE[0] + 1.5, W_EYE[1] + 0.5, 2.4));
    fine.push(wBrow);
    if (!tuck) {
      const smile = 'M46 1C40 10 26 11 15 1';
      lines.push(`${smile}q-3 -2 -2 -6`);
      if (mouth === 'grin') {
        const tongue = 'M30 6C32 10 37 10 38 6Z';
        fine.push(tongue);
        washes.push({ c: PAL.rose, o: 0.95, d: tongue });
      }
    }
  }
  if (cap) {
    lines.push(wCap, frill);
    fine.push('M-32 -10C-26 -16 -18 -18 -12 -18M-30 0C-24 -4 -18 -6 -12 -6', wRibbon);
    whites.push(`${wCapFill}`, `${frill}C-4 0 -2 -10 1 -22Z`);
    washes.push({ c: PAL.rose, o: 0.85, d: limb([[-8, 10, 3], [-5, 19, 3]]) + limb([[-8, 10, 3], [-15, 18, 3]]) });
  }
  if (glasses) {
    fine.push(wLens, wGlassesArm, wFarLens);
  }
  return { lines, fine, washes, whites, fills, glints };
}

// The wolf (feet at 0,0), about 175 tall, on his hind legs and facing right: a lanky grey body with a
// white belly, a bushy tail, long arms with paws and long legs with big floppy feet. Comic, not scary.
// pose: one of W_POSES (lean = how far his body bends forward at the hips, the arms, the legs, the
// head's turn). dress: Grandmother's pink nightdress. Head options as for wolfHead.
const wTorso = 'M-12 -116C-27 -106 -30 -72 -26 -52C-22 -40 -10 -36 2 -36C14 -36 24 -42 26 -58C28 -80 20 -108 8 -118';
const wTorsoFill = `${wTorso}C2 -121 -8 -120 -14 -116Z`;
const wBelly = 'M8 -96C-2 -86 -4 -62 2 -50C8 -42 18 -46 21 -56C24 -70 22 -88 15 -98Z';
const wTail = 'M-26 -50C-44 -50 -58 -58 -66 -74C-60 -73 -60 -80 -55 -82C-50 -74 -44 -68 -36 -66C-39 -72 -38 -78 -34 -80C-32 -72 -30 -66 -26 -62';
const wTailTip = 'M-66 -74C-60 -73 -60 -80 -55 -82C-53 -77 -51 -74 -49 -71C-55 -69 -61 -70 -66 -74Z';
const wDress = 'M-16 -117C-34 -104 -38 -70 -40 -32C-14 -26 16 -26 36 -32C34 -70 28 -104 10 -119';
const wDressFill = `${wDress}C3 -122 -9 -121 -16 -117Z`;
const wDressFrill = 'M-40 -32Q-36 -27 -32 -30Q-28 -25 -24 -28Q-20 -24 -16 -27Q-12 -23 -8 -26Q-4 -23 0 -26Q4 -23 8 -26Q12 -24 16 -27Q20 -24 24 -28Q28 -25 32 -29Q35 -27 36 -32';
const W_NECK = [10, -126];
const W_HIP = [0, -44];

export const W_POSES = {
  // upright, smiling, hands behind his back
  stand: {
    lean: 0,
    head: -6,
    arms: [
      [[-14, -108, 11], [-24, -86, 10], [-14, -66, 9]],
      [[14, -108, 11], [14, -86, 10], [2, -70, 9]],
    ],
    legs: [
      [[-10, -44, 15], [-14, -22, 12], [-14, -6, 11]],
      [[12, -44, 15], [14, -22, 12], [14, -6, 11]],
    ],
    feet: [[-14, 0, 0], [14, 0, 0]],
  },
  // a deep polite bow: bent forward, one paw on his tummy, the other sweeping out behind
  bow: {
    lean: 34,
    head: -16,
    arms: [
      [[-14, -108, 11], [-30, -86, 10], [-40, -64, 9]],
      [[14, -106, 11], [22, -84, 10], [8, -72, 9]],
    ],
    legs: [
      [[-8, -44, 15], [-14, -22, 12], [-16, -6, 11]],
      [[12, -44, 15], [20, -22, 12], [26, -6, 11]],
    ],
    feet: [[-16, 0, 0], [26, 0, 0]],
  },
  // running flat out, leaning forward, legs stretched front and back
  run: {
    lean: 28,
    head: -22,
    arms: [
      [[-14, -108, 11], [-30, -92, 10], [-48, -96, 9]],
      [[14, -108, 11], [30, -98, 10], [46, -106, 9]],
    ],
    legs: [
      [[-8, -44, 15], [-30, -30, 12], [-48, -20, 11]],
      [[12, -44, 15], [30, -28, 12], [40, -8, 11]],
    ],
    feet: [[-52, -16, -40], [42, 0, 0]],
  },
  // knocking at a door to his right: one paw raised in a fist
  knock: {
    lean: 4,
    head: -4,
    arms: [
      [[-14, -108, 11], [-24, -86, 10], [-16, -66, 9]],
      [[14, -108, 11], [38, -104, 10], [58, -112, 9]],
    ],
    legs: [
      [[-10, -44, 15], [-16, -22, 12], [-18, -6, 11]],
      [[12, -44, 15], [16, -22, 12], [18, -6, 11]],
    ],
    feet: [[-18, 0, 0], [18, 0, 0]],
  },
  // leaping up with a roar, arms flung wide, legs kicking
  leap: {
    lean: -6,
    head: -10,
    arms: [
      [[-14, -108, 11], [-36, -124, 10], [-44, -148, 9]],
      [[14, -104, 11], [40, -96, 10], [62, -86, 9]],
    ],
    legs: [
      [[-10, -44, 15], [-28, -30, 12], [-30, -10, 11]],
      [[12, -44, 15], [30, -36, 12], [44, -24, 11]],
    ],
    feet: [[-30, -4, 20], [46, -18, -30]],
  },
  // diving head first, arms stretched out in front
  dive: {
    lean: 72,
    head: -40,
    arms: [
      [[-14, -108, 11], [8, -128, 10], [28, -140, 9]],
      [[14, -108, 11], [34, -122, 10], [52, -130, 9]],
    ],
    legs: [
      [[-8, -44, 15], [-30, -40, 12], [-52, -40, 11]],
      [[10, -44, 15], [-12, -30, 12], [-34, -22, 11]],
    ],
    feet: [[-56, -36, -90], [-38, -18, -80]],
  },
};
const wFoot = 'M-6 0C-8 -8 8 -10 14 -5C17 -1 12 1 4 1C-1 1 -5 1 -6 0Z';
const wFootClaws = 'M10 -3l3 1M7 -1l3 1';

export function wolf({ pose = 'stand', mouth = 'smile', cap = false, glasses = false, dress = false } = {}) {
  const P = typeof pose === 'string' ? W_POSES[pose] : pose;
  const body = `rotate(${P.lean} ${W_HIP[0]} ${W_HIP[1]})`;
  const arms = P.arms.map((a) => limb(a.map(([x, y, w]) => [x, y, w])));
  // under the nightdress, the legs start at its hem
  const legs = P.legs.map((a) => limb(dress ? [[a[0][0] + (a[1][0] - a[0][0]) * 0.55, a[0][1] + (a[1][1] - a[0][1]) * 0.55, a[0][2] * 0.85], ...a.slice(1)] : a));
  const feet = P.feet.map(([x, y, a]) => transformPath(wFoot, `translate(${x} ${y}) rotate(${a})`));
  const claws = P.feet.map(([x, y, a]) => transformPath(wFootClaws, `translate(${x} ${y}) rotate(${a})`));
  const paws = P.arms.map((a) => dot(a[a.length - 1][0], a[a.length - 1][1], 5.5));
  const B = (d) => transformPath(d, body);
  const head = placeIn(wolfHead({ mouth, cap, glasses }), `${body} translate(${W_NECK[0] + 4} ${W_NECK[1] - 2}) rotate(${P.head})`);
  const torsoLines = dress ? [B(wDress), B(wDressFrill)] : [B(wTorso)];
  const tail = B(wTail);
  return join(
    {
      lines: [tail, ...legs, ...feet, ...torsoLines, B(arms[0]), B(arms[1])],
      fine: [...claws, ...(dress ? [B('M-6 -100l-4 30M14 -96l2 26')] : [B(wBelly)]), ...paws.map(B), B('M-26 -60l-5 -2M-27 -72l-5 -2M24 -100l4 -4')],
      washes: [
        { c: PAL.slate, o: 0.62, d: `${tail}Z${legs[0]}Z${legs[1]}Z${dress ? '' : B(wTorsoFill)}${B(`${arms[0]}Z${arms[1]}Z`)}` },
        { c: PAL.grey, o: 0.5, d: `${B(wTailTip)}${feet.join('')}` },
        { c: PAL.grey, o: 0.6, d: paws.map(B).join('') },
        ...(dress ? [{ c: PAL.rose, o: 0.75, d: `${B(wDressFill)}` }] : []),
      ],
      whites: dress ? [] : [B(wBelly)],
    },
    head,
  );
}

/** Just his head and one paw, as when he peeps round a tree (the back of his head at x = -19). */
/**
 * The back half of his peeping head (x <= 0) with its ears and paw, closed: a hole for it in the
 * wash of the tree trunk he peeps round, so the trunk's colour does not tint him.
 */
export const WOLF_PEEP_BACK =
  'M-19 4C-23 -8 -17 -20 -4 -21L0 -21.3L0 15.6C-6 15.5 -14 12 -19 4ZM-15 -15L-21 -42L-5 -21ZM-3 -21L0 -33L0 -21ZM-10 30C-8 26 -4 24 0 24L0 40C-6 40 -11 36 -10 30Z';

export function wolfPeep({ mouth = 'grin' } = {}) {
  const h = wolfHead({ mouth });
  const paw = 'M-10 30C-4 24 6 24 8 30C10 36 4 40 -2 40C-8 40 -12 36 -10 30Z';
  return join(h, { lines: [paw], fine: ['M4 28l3 -2M6 33l4 -1M4 38l3 1'], washes: [{ c: PAL.grey, o: 0.6, d: paw }] });
}

// ---------------------------------------------------------------------------------------------
// Mother (feet at 0,0), about 165 tall: a long green dress with a white apron, her terracotta hair
// in a bun. Head at (0, -140). arms: two limb centrelines (M_ARMS); 'finger' raises one finger on the
// left hand, which must then be at (-28, -150).
export const M_ARMS = {
  give: [
    [[-20, -116, 9], [-32, -126, 8], [-28, -148, 8]],
    [[20, -116, 9], [36, -98, 8], [48, -82, 8]],
  ],
};
const mFace = oval(0, 0, 12, 13);
const mHair = 'M-13 -2C-15 -12 -8 -17 0 -17C8 -17 15 -12 13 -2C10 -8 4 -10 -1 -9C-6 -10 -11 -7 -13 -2Z';
const mBun = oval(0, -21, 7.5, 6);
const mDress = 'M-10 -126C-20 -122 -24 -110 -24 -96C-26 -60 -32 -24 -36 -4C-14 0 14 0 36 -4C32 -24 26 -60 24 -96C24 -110 20 -122 10 -126';
const mDressFill = `${mDress}C4 -128 -4 -128 -10 -126Z`;
const mApron = 'M-14 -86L-18 -16C-6 -12 6 -12 18 -16L14 -86C6 -88 -6 -88 -14 -86Z';
export function mother({ mood = 'stern', arms = M_ARMS.give, finger = true } = {}) {
  const m = faceMarks({ mood, ex: 4.8, ey: 0, my: 6.5 });
  const head = {
    lines: [mFace, mBun],
    fine: [mHair, 'M-4 -21c3 -2 6 -2 8 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: mFace },
      { c: PAL.terracotta, o: 0.8, d: `${mHair}${mBun}` },
      { c: PAL.rose, o: 0.7, d: dot(-7, 5, 2.4) + dot(7, 5, 2.4) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  const parts = arms.map((a) => arm(a, PAL.green, 0.62, 4.6));
  const extra = finger ? { lines: [limb([[-28, -151, 3.4], [-28, -163, 3.4]])], washes: [{ c: PAL.rose, o: 0.6, d: limb([[-28, -151, 3.4], [-28, -163, 3.4]]) }] } : {};
  return join(
    {
      lines: [mDress, 'M-34 -4C-14 0 14 0 34 -4', mApron],
      fine: ['M-24 -84C-10 -80 10 -80 24 -84', 'M-8 -132L0 -124L8 -132'],
      washes: [{ c: PAL.green, o: 0.62, d: mDressFill }],
      whites: [mApron],
    },
    ...parts,
    extra,
    placeIn(head, 'translate(0 -140)'),
  );
}

// ---------------------------------------------------------------------------------------------
// Grandmother, seen from the waist up behind the table (the table top at y = 0): a round, kindly old
// face with round glasses and a grey bun, a rose shawl over a slate dress and a white lace collar.
// Head at (0, -62). She holds a teacup in her right hand at (26, -14).
const gmFace = oval(0, 0, 12.5, 13);
const gmHair = 'M-14 0C-17 -12 -8 -18 0 -18C8 -18 17 -12 14 0C12 -6 6 -10 0 -10C-6 -10 -12 -6 -14 0Z';
const gmBun = oval(0, -21, 8, 6);
const gmBody = 'M-10 -50C-24 -46 -32 -34 -34 0L34 0C32 -34 24 -46 10 -50';
const gmShawl = 'M-12 -50C-26 -46 -32 -34 -32 -20L-2 -10L32 -20C32 -34 26 -46 12 -50Z';
const gmCollar = 'M-10 -50Q-7 -45 -4 -48Q0 -43 4 -48Q7 -45 10 -50C4 -52 -4 -52 -10 -50Z';
export function grandmother({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 7 });
  const head = {
    lines: [gmFace, gmBun],
    fine: [gmHair, 'M-5 -21c3 -2 7 -2 10 0', dot(-5, 0, 5), dot(5, 0, 5), 'M-0.2 -0.5L0.2 -0.5M-10 -1L-13 -3M10 -1L13 -3', 'M-8 11q-2 2 -1 4M8 11q2 2 1 4', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: gmFace },
      { c: PAL.grey, o: 0.7, d: `${gmHair}${gmBun}` },
      { c: PAL.rose, o: 0.7, d: dot(-8, 6, 2.4) + dot(8, 6, 2.4) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  const armR = arm([[24, -38, 9], [30, -22, 8], [24, -14, 8]], PAL.slate, 0.6, 4.4);
  const armL = arm([[-24, -38, 9], [-30, -22, 8], [-22, -10, 8]], PAL.slate, 0.6, 4.4);
  return join(
    {
      lines: [gmBody, gmShawl],
      fine: [gmCollar, 'M-2 -10L-6 2M-2 -10L2 2'],
      washes: [
        { c: PAL.slate, o: 0.55, d: `${gmBody}Z` },
        { c: PAL.rose, o: 0.75, d: gmShawl },
      ],
      whites: [gmCollar],
    },
    armL,
    armR,
    placeIn(head, 'translate(0 -62)'),
  );
}

// ---------------------------------------------------------------------------------------------
// The woodcutter (feet at 0,0), about 210 tall: a big friendly man with a bushy terracotta beard, a
// green woolly cap, a checked terracotta shirt, a belt, slate trousers and big boots. His axe rests
// on his right shoulder (never swinging): the handle in his right hand, the blade behind his
// shoulder. upper: only the part above y = -96 (sitting behind the table; the table top at y = -96).
const wcFace = oval(0, 0, 13, 14);
const wcBeard = 'M-14 0C-16 14 -8 26 0 26C8 26 16 14 14 0C10 6 6 8 0 8C-6 8 -10 6 -14 0Z';
const wcCap = 'M-15 -4C-17 -18 -8 -26 0 -26C8 -26 17 -18 15 -4C6 -7 -6 -7 -15 -4Z';
const wcCapRib = 'M-14 -7C-6 -10 6 -10 14 -7M-14 -10C-6 -13 6 -13 14 -10';
const wcShirt = 'M-14 -162C-30 -158 -36 -146 -36 -130C-36 -116 -34 -106 -32 -96L32 -96C34 -106 36 -116 36 -130C36 -146 30 -158 14 -162';
const wcShirtFill = `${wcShirt}C6 -164 -6 -164 -14 -162Z`;
const wcChecks = (() => {
  let d = '';
  for (let x = -27; x <= 27; x += 9) d += `M${x} -154L${x} -100`;
  for (let y = -148; y <= -104; y += 9) d += `M-31 ${y}L31 ${y}`;
  return d;
})();
const wcBelt = 'M-33 -100L33 -100L33 -92L-33 -92Z';
const wcLegs = 'M-30 -92L-28 -12L-4 -12L-2 -78L2 -78L4 -12L28 -12L30 -92Z';
const wcBoots = 'M-30 -14C-34 -6 -36 0 -30 1L-4 1L-4 -14ZM4 -14L4 1L30 1C36 0 34 -6 30 -14Z';
// the axe: an ochre handle from his hand up over his shoulder, a grey blade behind it
const wcHandle = limb([[36, -106, 5], [34, -150, 5], [30, -186, 5], [28, -204, 5]]);
const wcBlade = 'M29 -200C40 -208 50 -210 56 -204C60 -194 58 -182 52 -176C46 -184 38 -190 30 -190Z';
export function woodcutter({ mood = 'happy', upper = false } = {}) {
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 6, w: 4.5 });
  const head = {
    lines: [wcFace, wcBeard, wcCap],
    fine: [wcCapRib, 'M-5 4q5 3 10 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: wcFace },
      { c: PAL.terracotta, o: 0.85, d: wcBeard },
      { c: PAL.green, o: 0.8, d: wcCap },
      { c: PAL.rose, o: 0.8, d: dot(0, 3, 3.2) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  const armR = arm([[30, -152, 12], [44, -134, 11], [36, -116, 10]], PAL.terracotta, 0.65, 6);
  const armL = arm(upper ? [[-30, -152, 12], [-40, -126, 11], [-28, -104, 10]] : [[-30, -152, 12], [-40, -126, 11], [-42, -100, 10]], PAL.terracotta, 0.65, 6);
  const parts = [
    {
      lines: [wcShirt, ...(upper ? [] : [wcBelt, wcLegs, wcBoots])],
      fine: [wcChecks, 'M-6 -160L0 -148L6 -160'],
      washes: [
        { c: PAL.terracotta, o: 0.6, d: wcShirtFill },
        ...(upper ? [] : [{ c: PAL.ink, o: 0.6, d: wcBelt }, { c: PAL.slate, o: 0.7, d: wcLegs }, { c: PAL.ink, o: 0.5, d: wcBoots }]),
      ],
    },
    armL,
  ];
  if (!upper) {
    parts.push({ lines: [wcHandle, wcBlade], fine: ['M54 -200C56 -194 56 -186 52 -180'], washes: [{ c: PAL.ochre, o: 0.8, d: wcHandle }, { c: PAL.grey, o: 0.85, d: wcBlade }] });
  }
  parts.push(armR, placeIn(head, 'translate(0 -178)'));
  const out = join(...parts);
  // in the shirt, the checks only show inside the shirt (the shirt wash keeps them tidy)
  return out;
}

// ---------------------------------------------------------------------------------------------
// An oak tree (the foot of the trunk at 0,0), about 150 tall: a thick ochre trunk and a big round
// green crown made of bumps.
const oakTrunk = 'M-12 0C-8 -24 -10 -50 -14 -70M12 0C8 -24 10 -50 16 -70M-2 -62L-20 -84M6 -64L22 -86';
const oakTrunkFill = 'M-12 0C-8 -24 -10 -50 -14 -70L16 -70C10 -50 8 -24 12 0Z';
const oakCrown =
  'M-52 -88C-66 -94 -64 -116 -48 -120C-50 -140 -28 -150 -14 -140C-6 -156 20 -156 28 -140C44 -148 62 -134 56 -118C70 -112 68 -90 54 -86C52 -72 32 -66 22 -74C12 -64 -10 -64 -18 -74C-30 -66 -50 -72 -52 -88Z';
export function oak({ seed = 0 } = {}) {
  return {
    lines: [oakTrunk, oakCrown],
    fine: ['M-30 -110c4 -6 10 -6 13 0M12 -126c4 -6 10 -6 13 0M24 -96c4 -6 10 -6 13 0M-16 -92c3 -5 8 -5 10 0', `M-4 -20c2 4 2 8 0 ${10 + seed}`],
    washes: [
      { c: PAL.ochre, o: 0.55, d: oakTrunkFill },
      { c: PAL.green, o: 0.7, d: oakCrown },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// Grandmother's little cottage (bottom centre at 0,0): tall cream walls, a steep terracotta roof, a
// chimney, a round-topped green door at the left end with a latch, and a little round window.
const ckWall = 'M-70 0L-70 -96L70 -96L70 0Z';
const ckRoof = 'M-78 -92L-28 -150L28 -150L78 -92C40 -98 -40 -98 -78 -92Z';
const ckChimney = 'M34 -136L34 -164L50 -164L50 -118';
const ckChimneyFill = 'M34 -136L34 -164L50 -164L50 -118Z';
const ckDoor = 'M-64 0L-64 -52C-64 -68 -36 -68 -36 -52L-36 0';
const ckWindow = oval(22, -50, 16, 16);
export const CK_DOOR = [-50, -32];
export function cottage() {
  return {
    lines: [ckWall, ckChimney, ckRoof, ckDoor, ckWindow],
    fine: [
      'M22 -66L22 -34M6 -50L38 -50',
      'M-64 -122l12 -12M-44 -136l12 -12M-14 -144l10 -6M14 -144l10 -2M46 -126l10 -10M62 -106l8 -8',
      'M-20 -20c4 -2 8 -2 10 0M50 -24c4 -2 8 -2 10 0M-12 -74c4 -2 8 -2 10 0M44 -82c4 -2 8 -2 10 0',
      'M-70 0l-8 4M70 0l8 4',
    ],
    washes: [
      { c: PAL.ochre, o: 0.3, d: ckWall },
      { c: PAL.terracotta, o: 0.75, d: ckRoof },
      { c: PAL.terracotta, o: 0.85, d: ckChimneyFill },
      { c: PAL.green, o: 0.75, d: `${ckDoor}Z` },
      { c: PAL.sky, o: 0.6, d: ckWindow },
    ],
    fills: [dot(-42, -32, 2)],
  };
}

// ---------------------------------------------------------------------------------------------
// Inside Grandmother's cottage.
// Her bed (bottom centre at 0,0), seen from the side: a tall ochre wooden headboard on the left, a low
// footboard on the right, a white pillow and a rose patchwork quilt. quilt: 'flat', 'wolf' (a long
// lump where the wolf lies, the quilt pulled up to y = -64 at the pillow) or 'tossed' (thrown back
// in a heap at the foot).
const bdHead = 'M-112 0L-112 -118C-112 -128 -94 -128 -94 -118L-94 0';
const bdFoot = 'M96 0L96 -86C96 -94 112 -94 112 -86L112 0';
const bdRail = 'M-94 -26L96 -26M-94 -40L96 -40';
const bdPillow = 'M-92 -50C-96 -60 -90 -70 -78 -70C-66 -72 -56 -68 -52 -62C-50 -56 -54 -50 -60 -50Z';
const QUILT = {
  flat: 'M-60 -52C-20 -54 40 -54 94 -52L96 -20C40 -18 -20 -18 -60 -20Z',
  wolf: 'M-88 -64C-74 -66 -62 -62 -50 -66C-30 -76 0 -74 20 -70C40 -66 60 -64 70 -70C80 -74 92 -68 94 -56L96 -20C40 -18 -20 -18 -84 -20Z',
  tossed: 'M30 -48C40 -60 60 -62 74 -58C88 -62 98 -54 96 -44L98 -18C80 -14 50 -16 34 -20C28 -28 26 -40 30 -48Z',
};
const bdSheet = 'M-92 -50L94 -50L94 -40L-92 -40Z';
export function bed({ quilt = 'flat' } = {}) {
  const q = QUILT[quilt];
  const patches = quilt === 'tossed' ? 'M48 -56L52 -18M72 -58L74 -16M32 -36C50 -38 80 -38 97 -34' : quilt === 'wolf' ? 'M-40 -70L-38 -20M0 -72L2 -19M40 -66L40 -18M-84 -42C-20 -44 40 -44 95 -40' : 'M-20 -53L-20 -19M20 -54L20 -18M60 -53L60 -19M-60 -36L95 -36';
  return {
    lines: [bdHead, bdFoot, bdRail, ...(quilt === 'wolf' ? [] : [bdPillow]), q],
    fine: [patches, 'M-108 -110c3 -3 7 -3 10 0', 'M100 -80c3 -3 7 -3 10 0'],
    washes: [
      { c: PAL.ochre, o: 0.72, d: `${bdHead}Z${bdFoot}Z` },
      { c: PAL.ochre, o: 0.5, d: 'M-94 -40L96 -40L96 -26L-94 -26Z' },
      { c: PAL.rose, o: 0.72, d: q },
      { c: PAL.red, o: 0.35, d: quilt === 'wolf' ? 'M-38 -70L0 -72L2 -44L-38 -44ZM40 -66L94 -56L95 -40L40 -42Z' : quilt === 'tossed' ? 'M52 -58L74 -58L74 -36L52 -36Z' : 'M-20 -53L20 -54L20 -36L-20 -36ZM60 -53L94 -52L95 -36L60 -36Z' },
    ],
    whites: [...(quilt === 'wolf' ? [] : [bdPillow]), ...(quilt === 'flat' ? [] : [])],
  };
}
/** The pillow alone (for when the wolf's head lies on it, drawn before him). */
export function pillow() {
  return { lines: [bdPillow], whites: [bdPillow] };
}

// The big wardrobe (bottom centre at 0,0), about 156 tall and 76 wide: terracotta, two doors with
// knobs, a carved top. peep: the left door is open a crack and Grandmother peeps out, glasses and all.
const wdBody = 'M-38 0L-38 -146L38 -146L38 0Z';
const wdTop = 'M-44 -146L-40 -156L40 -156L44 -146Z';
export function wardrobe({ peep = false } = {}) {
  const fine = ['M-32 -138L-4 -138L-4 -10L-32 -10ZM4 -138L32 -138L32 -10L4 -10Z', 'M-34 0L-34 6M34 0L34 6'];
  const fills = [dot(-8, -74, 2), dot(8, -74, 2)];
  const whites = [];
  const glints = [];
  const washes = [
    { c: PAL.terracotta, o: 0.62, d: `${wdBody}${wdTop}` },
  ];
  const lines = [wdBody, wdTop];
  if (peep) {
    // the doors open a crack in the middle: a dark gap with two eyes behind round glasses
    const gap = 'M-9 -132L7 -132L7 -36L-9 -36Z';
    washes.push({ c: PAL.ink, o: 0.8, d: gap });
    whites.push(dot(-4.5, -98, 3), dot(3, -98, 3));
    fills.push(dot(-3.8, -97.6, 1.4), dot(3.7, -97.6, 1.4));
    lines.push(gap);
  } else lines.push('M0 -146L0 0');
  return { lines, fine, washes, whites, fills, glints };
}

// A cottage window (centre at 0,0), 64 by 70, with sky-blue panes and cross bars. open: the window
// is wide open (empty frame, the casements swung out).
export function windowFrame({ open = false } = {}) {
  const frame = 'M-32 -35L32 -35L32 35L-32 35Z';
  const sill = 'M-38 35L38 35L38 42L-38 42Z';
  if (open) {
    const leftCase = 'M-32 -35L-48 -28L-48 40L-32 35';
    const rightCase = 'M32 -35L48 -28L48 40L32 35';
    return {
      lines: [frame, sill, leftCase, rightCase],
      fine: ['M-40 -31L-40 37M40 -31L40 37'],
      washes: [
        { c: PAL.sky, o: 0.5, d: frame },
        { c: PAL.green, o: 0.45, d: 'M-32 20C-16 12 10 16 32 10L32 35L-32 35Z' },
        { c: PAL.ochre, o: 0.7, d: `${sill}${leftCase}Z${rightCase}Z` },
      ],
    };
  }
  return {
    lines: [frame, sill],
    fine: ['M0 -35L0 35M-32 0L32 0'],
    washes: [
      { c: PAL.sky, o: 0.55, d: frame },
      { c: PAL.ochre, o: 0.7, d: sill },
    ],
  };
}

// A round wooden table (top centre at 0,0), 150 wide: a white cloth over it and two ochre legs.
export function table() {
  const top = 'M-76 0C-76 -8 76 -8 76 0C76 8 -76 8 -76 0Z';
  const cloth = 'M-76 0C-76 8 76 8 76 0L80 30Q72 36 64 31Q56 37 48 31Q40 37 32 31Q24 37 16 31Q8 37 0 31Q-8 37 -16 31Q-24 37 -32 31Q-40 37 -48 31Q-56 37 -64 31Q-72 36 -80 30Z';
  const legs = 'M-56 34L-58 78M-44 34L-44 78M56 34L58 78M44 34L44 78';
  return {
    lines: [top, cloth, legs],
    fine: [],
    washes: [{ c: PAL.ochre, o: 0.7, d: 'M-58 34L-58 78L-44 78L-44 34ZM44 34L44 78L58 78L56 34Z' }, { c: PAL.sky, o: 0.25, d: `${top}${cloth}` }],
    whites: [],
  };
}

// The cake on a plate (bottom centre at 0,0): a round sponge cake with white icing and a cherry.
export function cake({ slice = true } = {}) {
  const plate = 'M-30 0C-30 -5 30 -5 30 0C30 5 -30 5 -30 0Z';
  const body = slice ? 'M-22 -2L-22 -22C-14 -26 4 -26 10 -24L10 -2ZM10 -24L22 -20L22 -2L10 -2' : 'M-22 -2L-22 -22C-14 -27 14 -27 22 -22L22 -2Z';
  const icing = 'M-22 -22C-14 -27 4 -27 10 -25L22 -21C22 -16 18 -18 16 -14C14 -18 10 -16 8 -14C6 -18 2 -16 0 -14C-2 -18 -6 -16 -8 -14C-10 -18 -14 -16 -16 -14C-18 -18 -22 -16 -22 -22Z';
  return {
    lines: [plate, body],
    fine: [icing, 'M-22 -10L22 -10'],
    washes: [
      { c: PAL.ochre, o: 0.75, d: body },
      { c: PAL.sky, o: 0.3, d: plate },
      { c: PAL.red, o: 0.85, d: dot(-4, -28, 4) },
      { c: PAL.rose, o: 0.7, d: 'M-22 -11L22 -11L22 -9L-22 -9Z' },
    ],
    whites: [icing],
    fine2: [],
  };
}

// A jug (bottom centre at 0,0), 30 tall, sky blue with a handle.
export function jug() {
  const body = 'M-12 0C-16 -10 -14 -22 -10 -30L10 -30C14 -22 16 -10 12 0Z';
  const handle = 'M12 -24C22 -24 22 -8 12 -8';
  return { lines: [body, handle], fine: ['M-10 -30C-4 -33 4 -33 10 -30'], washes: [{ c: PAL.sky, o: 0.75, d: body }] };
}

// A teacup (bottom centre at 0,0).
export function cup(c = PAL.rose) {
  const body = 'M-8 -12L8 -12C8 -4 5 0 0 0C-5 0 -8 -4 -8 -12Z';
  return { lines: [body, 'M8 -10c5 0 5 6 0 6'], washes: [{ c, o: 0.7, d: body }] };
}
