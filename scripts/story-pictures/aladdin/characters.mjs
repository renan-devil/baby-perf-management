import { PAL, transformPath } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';
import { bumpy } from '../puss-in-boots/characters.mjs';

// Aladdin and the Magic Lamp: Aladdin (a boy, later a young man), the sorcerer, the Genie of the
// Lamp, the Genie of the Ring, the lamp, Aladdin's mother, the Princess and the Sultan, drawn once
// here and placed in each picture with a transform (place). The build only draws files named
// <n>.mjs, so this file is not a picture. Standing characters have their feet at y = 0 and look at
// us; flip with scale(-1 1).

export { at, bumpy, compose, dot, limb, merge, oval, place };

const Z = (d) => `${d}Z`;

/** An arm (limb along pts) ending in a round hand of colour hc. */
function arm(pts, c, o, r, hc = PAL.rose, ho = 0.6) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const h = dot(x, y, r);
  return { lines: [d], fine: [h], washes: [{ c, o, d: Z(d) }, { c: hc, o: ho, d: h }] };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. mood: happy, wow, laugh, peep / peepL (looking
 * right / left), grin (wide open smile), wink, sly (half-closed eyes, a smirk), cross, snore
 * (eyes shut, mouth open), shh (looking left, lips pressed).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const eye = (x, dx = 0, rr = r) => {
    fills.push(dot(x + dx, ey, rr));
    glints.push(dot(x + dx - 0.5, ey - 0.6, 0.55));
  };
  const eyes = (dx = 0, rr = r) => {
    eye(-ex, dx, rr);
    eye(ex, dx, rr);
  };
  const shutUp = `M${-ex - 3} ${ey}q3 -3.4 6 0M${ex - 3} ${ey}q3 -3.4 6 0`;
  const shutDown = `M${-ex - 3} ${ey - 1}q3 3 6 0M${ex - 3} ${ey - 1}q3 3 6 0`;
  const openMouth = `M${-w - 1} ${my - 1}C${-w} ${my + 8} ${w} ${my + 8} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
  if (mood === 'laugh') {
    fine.push(shutUp, openMouth);
    washes.push({ c: PAL.red, o: 0.75, d: openMouth });
  } else if (mood === 'snore') {
    const m = oval(0, my + 1.5, 2.8, 3.4);
    fine.push(shutDown, m);
    washes.push({ c: PAL.red, o: 0.6, d: m });
  } else if (mood === 'grin' || mood === 'wink') {
    if (mood === 'wink') {
      fine.push(`M${-ex - 3} ${ey}q3 -3.4 6 0`);
      eye(ex);
    } else eyes();
    fine.push(openMouth);
    washes.push({ c: PAL.red, o: 0.75, d: openMouth });
  } else if (mood === 'wow') {
    eyes(0, r + 0.5);
    fills.push(oval(0, my + 1.5, 2.4, 3));
    fine.push(`M${-ex - 3} ${ey - 5}q3 -2 6 0M${ex - 3} ${ey - 5}q3 -2 6 0`);
  } else if (mood === 'sly') {
    eyes(1);
    fine.push(`M${-ex - 3.2} ${ey - 1.4}l6.4 0.6M${ex - 3.2} ${ey - 0.8}l6.4 -0.6`, `M${-w} ${my}q${w} 4 ${2 * w} -2`);
  } else if (mood === 'cross') {
    eyes();
    fine.push(`M${-ex - 3.5} ${ey - 5}l7 2.5M${ex + 3.5} ${ey - 5}l-7 2.5`, `M${-w} ${my + 2}q${w} -4 ${2 * w} 0`);
  } else if (mood === 'shh') {
    eyes(-1.3);
    fine.push(`M-2.5 ${my + 0.5}q2.5 1.2 5 0`);
  } else {
    const dx = mood === 'peep' ? 1.3 : mood === 'peepL' ? -1.3 : 0;
    eyes(dx);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

// =============================================================================================
// THE LAMP: a classic brass oil lamp, base at (0,0), spout pointing right, its tip at LAMP_SPOUT.
// look: 'dusty' (dull, greyish), 'old' (plain brass) or 'shiny' (bright, with glints).
// =============================================================================================
export const LAMP_SPOUT = [49, -23];
const lampBowl =
  'M-24 -11C-24 -19 -10 -22 2 -22C14 -22 22 -19 27 -15C33 -18 40 -22 47 -24C49 -24.5 50.5 -22.5 49 -21.5C42 -17 34 -10 26 -7C18 -4 8 -5 0 -5C-14 -5 -24 -5 -24 -11Z';
const lampLid = 'M-9 -21C-9 -28 7 -28 7 -21';
const lampKnob = 'M-1 -27C-4 -29 -3 -33 -1 -33C1 -33 2 -29 -1 -27Z';
const lampHandle = 'M-23 -14C-34 -15 -39 -23 -34 -28C-30 -32 -23 -28 -21 -21';
const lampFoot = 'M-9 -5L-11 0L9 0L7 -5';
export function lamp({ look = 'old' } = {}) {
  const washes = [
    { c: PAL.ochre, o: look === 'dusty' ? 0.7 : 0.9, d: `${lampBowl}${lampLid}Z${lampKnob}M-9 -5L-11 0L9 0L7 -5Z` },
    { c: PAL.terracotta, o: 0.35, d: 'M-23 -10C-14 -6 10 -5 26 -8C18 -4 8 -5 0 -5C-14 -5 -22 -6 -23 -10ZM-9 -5L-11 0L9 0L7 -5Z' },
  ];
  if (look === 'dusty') washes.push({ c: PAL.grey, o: 0.6, d: `${lampBowl}${lampLid}Z` });
  const fine = ['M-22 -12C-8 -9 12 -9 26 -13', 'M-34 -28C-36 -26 -36 -24 -35 -22'];
  if (look === 'dusty') fine.push('M-12 -15l2 0M2 -17l1.5 0M14 -13l1.5 0M-4 -24l1 0');
  return {
    lines: [lampBowl, lampLid, lampHandle, lampFoot],
    fine: [...fine, lampKnob],
    washes,
    glints: look === 'dusty' ? [] : ['M-15 -16C-9 -19 -1 -19.5 5 -18.5C-1 -17.5 -9 -16.5 -14 -14Z', 'M-4 -25C-2 -26 0 -26 2 -25.5C0 -25 -2 -24.5 -4 -24Z'],
  };
}

// =============================================================================================
// THE RING: a little gold ring with a red stone, round (0,0).
// =============================================================================================
export function ring(r = 4) {
  const o = dot(0, 0, r);
  return { fine: [o, dot(0, -r - 1.5, 1.8)], washes: [{ c: PAL.ochre, o: 1, d: o }, { c: PAL.red, o: 0.95, d: dot(0, -r - 1.5, 1.8) }] };
}

// =============================================================================================
// ALADDIN (feet at 0,0): a boy about 118 tall, or (grown) a young man about 145 tall with the same
// face. A striped ochre tunic with a red sash, grey trousers, sandals, a slate cap with a little
// red tassel. Head at A_HEAD (or A_HEAD_G when grown); arms from the shoulders (±14,-79), or
// (±16,-98) when grown. legs: two centrelines from the hips in the boy's coordinates, each ending
// on a sandal ({pts, toe: ±1}).
// =============================================================================================
export const A_HEAD = [0, -96];
export const A_HEAD_G = [0, -121];
export const A_ARMS = {
  down: [
    [[-14, -79, 8.5], [-21, -68, 8], [-24, -56, 8], [-25, -48, 8]],
    [[14, -79, 8.5], [21, -68, 8], [24, -56, 8], [25, -48, 8]],
  ],
};
export const A_ARMS_G = {
  down: [
    [[-16, -98, 9.5], [-24, -84, 9], [-27, -70, 9], [-28, -60, 9]],
    [[16, -98, 9.5], [24, -84, 9], [27, -70, 9], [28, -60, 9]],
  ],
};
export const A_LEGS = {
  stand: [
    { pts: [[-9, -34, 13], [-10, -18, 11.5], [-10, -5, 10]], toe: -1 },
    { pts: [[9, -34, 13], [10, -18, 11.5], [10, -5, 10]], toe: 1 },
  ],
  sit: [
    { pts: [[-8, -32, 13], [-20, -26, 12.5], [-24, -14, 11], [-24, -5, 10]], toe: -1 },
    { pts: [[8, -32, 13], [20, -26, 12.5], [24, -14, 11], [24, -5, 10]], toe: 1 },
  ],
  // creeping on tiptoe to the right
  tiptoe: [
    { pts: [[-8, -34, 13], [-16, -20, 11.5], [-24, -9, 10]], toe: -1, tip: true },
    { pts: [[8, -34, 13], [14, -20, 11.5], [16, -6, 10]], toe: 1, tip: true },
  ],
};
export function aladdinHead({ mood = 'happy' } = {}) {
  const face = 'M-12 -4C-12.5 7 -7 14 0 14C7 14 12.5 7 12 -4';
  const faceFill = `${face}C10 -9 -10 -9 -12 -4Z`;
  const cap = 'M-12.5 -8C-13 -18 -7 -23 0 -23C7 -23 13 -18 12.5 -8C5 -10.5 -5 -10.5 -12.5 -8Z';
  const tassel = 'M8 -28L5 -20.5L12.5 -22Z';
  const hair = 'M-13.5 -2C-16 1 -15.5 4 -12.5 6L-12 -3C-12 -5 -9 -5 -7 -6C-4 -4 -1 -6 1 -5C4 -6 7 -4 9 -5C11 -5 12 -4 12 -3L12.5 6C15.5 4 16 1 13.5 -2C14 -6 13 -9 12.5 -8C5 -10.5 -5 -10.5 -12.5 -8C-13 -9 -14 -6 -13.5 -2Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 0.5, my: 7.5, w: 4 });
  return {
    lines: [face, cap, 'M0 -23C1 -27 4 -29 8 -28'],
    fine: [
      'M-12.5 -11C-5 -14 5 -14 12.5 -11',
      tassel,
      'M-12.5 -8C-14 -5 -16 0 -12.5 6M12.5 -8C14 -5 16 0 12.5 6M-12 -3C-9 -5 -9 -5 -7 -6C-4 -4 -1 -6 1 -5C4 -6 7 -4 9 -5C11 -5 12 -4 12 -3',
      'M0.5 2c1.6 1.2 1.6 2.6 -0.6 3',
      ...m.fine,
    ],
    washes: [
      { c: PAL.rose, o: 0.32, d: faceFill },
      { c: PAL.slate, o: 0.75, d: cap },
      { c: PAL.red, o: 0.9, d: tassel },
      { c: PAL.ink, o: 0.6, d: hair },
      { c: PAL.rose, o: 0.6, d: dot(-8, 6, 2.4) + dot(8, 6, 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, 'M-8 -15C-6 -18 -3 -20 0 -20.5C-3 -18.5 -5 -16 -6.5 -13Z'],
  };
}
function sandal({ pts, toe, tip }) {
  const [x, y] = pts[pts.length - 1];
  const foot = tip ? oval(x + toe * 3, -3.5, 6, 3.2) : oval(x + toe * 3, -3.2, 7.5, 3.4);
  const sole = tip ? `M${x + toe * -2} -1.5L${x + toe * 9} -1` : `M${x - 7 + toe * 3} 0L${x + 8 + toe * 3} 0`;
  return {
    lines: [sole],
    fine: [foot, `M${x - 3 + toe * 3} -5.5l1 5M${x + 3 + toe * 3} -5.5l-1 5`],
    washes: [{ c: PAL.rose, o: 0.5, d: foot }, { c: PAL.terracotta, o: 0.7, d: `${sole}l0 -1.6L${x - 7 + toe * 3} -1.6Z` }],
  };
}
export function aladdin({ grown = false, mood = 'happy', tilt = 0, arms, legs = A_LEGS.stand, belt = true } = {}) {
  const tunic = 'M-8 -83C-17 -81 -20 -73 -20 -64C-20 -54 -22 -44 -24 -33C-10 -30 10 -30 24 -33C22 -44 20 -54 20 -64C20 -73 17 -81 8 -83';
  const sash = 'M-21 -57C-7 -53 7 -53 21 -57L21.5 -50C7 -46 -7 -46 -21.5 -50Z';
  const stripe = (x) => `M${x} -80L${x + 5} -80.5L${x + 6.5} -32L${x - 1} -32Z`;
  const stripes = stripe(-15) + stripe(-2.5) + stripe(10);
  const legParts = legs.map((l) => {
    const d = limb(l.pts);
    return merge({ lines: [d], washes: [{ c: PAL.grey, o: 0.6, d: Z(d) }, { c: PAL.slate, o: 0.2, d: Z(d) }] }, sandal(l));
  });
  const body = merge(
    ...legParts,
    {
      lines: [tunic],
      fine: ['M-6 -82L0 -75L6 -82', 'M-23 -38C-8 -35 8 -35 23 -38', 'M-15 -53l-3 8M14 -53l4 7'],
      washes: [
        { c: PAL.ochre, o: 0.75, d: Z(tunic) },
        { c: PAL.terracotta, o: 0.55, d: stripes },
      ],
    },
    belt ? { lines: [sash], washes: [{ c: PAL.red, o: 0.85, d: sash }] } : {},
  );
  const placed = grown ? place(body, 'scale(1.1 1.22)') : body;
  const armList = arms ?? (grown ? A_ARMS_G.down : A_ARMS.down);
  const armParts = armList.map((a) => arm(a, PAL.ochre, 0.75, grown ? 5 : 4.6));
  const [hx, hy] = grown ? A_HEAD_G : A_HEAD;
  const head = place(aladdinHead({ mood }), `translate(${hx} ${hy}) rotate(${tilt}) scale(${grown ? 1.08 : 1})`);
  return merge(placed, ...armParts, head);
}

// =============================================================================================
// THE SORCERER (feet at 0,0): tall and thin, about 215 tall to the tip of his hat. A long black
// beard, a big hooked nose, bushy brows, a tall pointed slate hat with an ochre moon, a long
// grey-slate robe and curly slippers. Head at S_HEAD; arms from the shoulders (±13,-128), thin,
// ending in bony hands. disguise: a terracotta lamp-seller's headcloth instead of the hat, and a
// patched terracotta robe.
// =============================================================================================
export const S_HEAD = [0, -150];
export const S_ARMS = {
  down: [
    [[-13, -128, 8], [-20, -112, 7.5], [-23, -96, 7], [-24, -84, 7]],
    [[13, -128, 8], [20, -112, 7.5], [23, -96, 7], [24, -84, 7]],
  ],
};
/** A thin bony hand at the end of an arm, fingers pointing along the arm's last segment. */
function boneHand(pts) {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const [ux, uy] = [(x - px) / l, (y - py) / l];
  const [vx, vy] = [-uy, ux];
  const h = dot(x + ux * 2, y + uy * 2, 3.6);
  let fingers = '';
  for (const s of [-2.6, -0.8, 1, 2.8]) {
    const bx = x + ux * 4 + vx * s;
    const by = y + uy * 4 + vy * s;
    const len = 6 - Math.abs(s) * 0.5;
    fingers += `M${f(bx)} ${f(by)}q${f(ux * len * 0.6 + vx * s * 0.3)} ${f(uy * len * 0.6 + vy * s * 0.3)} ${f(ux * len + vx * s * 0.2)} ${f(uy * len + vy * s * 0.2)}`;
  }
  return { fine: [h, fingers], washes: [{ c: PAL.rose, o: 0.5, d: h }] };
}
function sorcArm(pts, c = PAL.grey) {
  const d = limb(pts);
  return merge({ lines: [d], washes: [{ c, o: 0.6, d: Z(d) }, { c: PAL.slate, o: c === PAL.grey ? 0.45 : 0, d: Z(d) }] }, boneHand(pts));
}
const sHat = 'M-17 -10C-12 -30 -6 -54 2 -76C8 -80 14 -77 13 -71C11 -70 9 -72 9 -74C8 -52 11 -30 17 -10';
const sBrim = 'M-23 -9C-11 -14 11 -14 23 -9C25 -5 21 -4 17 -6C6 -9 -6 -9 -17 -6C-21 -4 -25 -5 -23 -9Z';
const sMoon = 'M-3 -40C-8 -36 -7 -28 -1 -26C-6 -26 -10 -30 -9 -35C-8 -39 -6 -40 -3 -40Z';
export function sorcererHead({ mood = 'sly', disguise = false, hatTilt = 0 } = {}) {
  const face = 'M-11 -8C-12 3 -8 10 0 10C8 10 12 3 11 -8';
  const faceFill = `${face}C9 -12 -9 -12 -11 -8Z`;
  const beard = 'M-11 0C-14 18 -8 42 0 60C8 42 14 18 11 0C8 6 4 8 0 7C-4 8 -8 6 -11 0Z';
  const nose = 'M-1 -4C2 -7 8 -3 8 3C8 6 5 7 2 5';
  const tache = 'M-8 4C-5 1 -2 1 0 2.5C2 1 5 1 8 4C5 6 2 5 0 4C-2 5 -5 6 -8 4Z';
  const parts = [];
  const lines = [face, beard, nose];
  const fine = ['M-6 14q1 14 4 26M5 16q0 12 -3 24M0 12l0 20', 'M-11 -7q-4 0 -3 6M11 -7q4 0 3 6', tache];
  const washes = [
    { c: PAL.rose, o: 0.3, d: faceFill },
    { c: PAL.ink, o: 0.72, d: beard },
    { c: PAL.ink, o: 0.8, d: tache },
    { c: PAL.rose, o: 0.65, d: `${nose}C0 4 -2 0 -1 -4Z` },
  ];
  const fills = [];
  const glints = [];
  // eyes and brows (the beard hides the mouth, which shows as a pale line under the moustache)
  const ex = 5;
  const ey = -3;
  if (mood === 'snore') {
    fine.push(`M${-ex - 3} ${ey - 1}q3 3 6 0M${ex - 3} ${ey - 1}q3 3 6 0`);
    const m = oval(0, 10, 3, 3.6);
    parts.push({ fine: [m], washes: [{ c: PAL.red, o: 0.6, d: m }] });
  } else {
    const dx = mood === 'peepL' ? -1 : 1;
    fills.push(dot(-ex + dx, ey, 1.7), dot(ex + dx, ey, 1.7));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.5), dot(ex + dx - 0.5, ey - 0.6, 0.5));
    if (mood === 'laugh' || mood === 'sly' || mood === 'peepL') {
      const m = 'M-6 7.5C-3 11 3 11 6 7.5C3 9 -3 9 -6 7.5Z';
      parts.push({ fine: [m], washes: [{ c: PAL.red, o: 0.7, d: m }] });
    }
  }
  const brows = mood === 'snore' ? 'M-10 -9l7 1M10 -9l-7 1' : 'M-10 -10C-7 -11 -4 -9 -2 -6.5M10 -10C7 -11 4 -9 2 -6.5';
  parts.push({ lines: [brows] });
  if (disguise) {
    const cloth = 'M-12 -8C-16 -18 -10 -24 0 -24C10 -24 16 -18 12 -8C14 -4 16 2 19 8C15 8 12 4 11 -1C6 -6 -6 -6 -12 -8Z';
    const band = 'M-13 -9C-4 -12 4 -12 13 -9L12.5 -5C4 -8 -4 -8 -12.5 -5Z';
    parts.push({
      lines: [cloth],
      fine: [band, 'M-6 -20q4 -2 8 0'],
      washes: [{ c: PAL.terracotta, o: 0.75, d: cloth }, { c: PAL.ochre, o: 0.85, d: band }],
    });
  } else {
    parts.push(
      place(
        {
          lines: [sHat, sBrim],
          fine: [sMoon, 'M-14 -16C-4 -19 4 -19 14 -16'],
          washes: [
            { c: PAL.slate, o: 0.9, d: `${sHat}C6 -12 -6 -12 -17 -10Z` },
            { c: PAL.slate, o: 0.9, d: sBrim },
            { c: PAL.ochre, o: 0.95, d: sMoon },
          ],
          glints: [dot(6, -50, 0.9), dot(-6, -20, 0.8)],
        },
        `rotate(${hatTilt} 0 -8)`,
      ),
    );
  }
  return merge({ lines, fine, washes, fills, glints }, ...parts);
}
export function sorcerer({ mood = 'sly', tilt = 0, arms = S_ARMS.down, disguise = false } = {}) {
  const robe = 'M-9 -131C-18 -129 -20 -119 -20 -107C-21 -80 -24 -40 -30 -5C-10 -1 10 -1 30 -5C24 -40 21 -80 20 -107C20 -119 18 -129 9 -131';
  const shoes = 'M-6 -3C-14 -3 -21 -2 -25 -7C-25 -1 -19 3 -6 3ZM6 -3C14 -3 21 -2 25 -7C25 -1 19 3 6 3Z';
  const c = disguise ? PAL.terracotta : PAL.grey;
  const robeWashes = disguise
    ? [{ c: PAL.terracotta, o: 0.55, d: Z(robe) }, { c: PAL.ochre, o: 0.8, d: 'M-14 -40L-4 -41L-4 -30L-14 -29ZM6 -84L14 -84L14 -75L6 -75Z' }]
    : [{ c: PAL.grey, o: 0.65, d: Z(robe) }, { c: PAL.slate, o: 0.5, d: Z(robe) }];
  const body = {
    lines: [robe, shoes],
    fine: ['M-20 -92C-8 -88 8 -88 20 -92', 'M-4 -88q-3 40 -8 82M6 -88q2 40 6 82', disguise ? 'M-14 -40L-4 -41L-4 -30L-14 -29ZM6 -84L14 -84L14 -75L6 -75Z' : ''].filter(Boolean),
    washes: [...robeWashes, { c: PAL.ink, o: 0.6, d: shoes }, { c: disguise ? PAL.ochre : PAL.slate, o: 0.9, d: 'M-20 -94C-8 -90 8 -90 20 -94L20 -89C8 -85 -8 -85 -20 -89Z' }],
  };
  const armParts = arms.map((a) => sorcArm(a, c));
  const head = place(sorcererHead({ mood, disguise }), `translate(0 -150) rotate(${tilt})`);
  return merge(body, ...armParts, head);
}

// =============================================================================================
// THE GENIE OF THE LAMP: enormous, a warm terracotta-and-ochre smoke body that tapers into a
// smoky tail. The tail starts at (0,0) (put that on the lamp's spout) and curls up to the right
// into his chest (centre x = 45). A big red turban with an ochre jewel, a curly black moustache,
// bushy brows, a gold earring, and his arms folded. About 238 tall. mood: happy, wow, laugh.
// =============================================================================================
export const G_HEAD = [45, -196];
export function genieHead({ mood = 'happy' } = {}) {
  const head = 'M-18 2C-19 14 -10 22 0 22C10 22 19 14 18 2C18 -10 10 -15 0 -15C-10 -15 -18 -10 -18 2Z';
  const turban = 'M-23 -3C-30 -18 -22 -40 0 -44C22 -40 30 -18 23 -3C12 -10 -12 -10 -23 -3Z';
  const wraps = 'M-25 -14C-12 -22 12 -25 26 -16M-21 -28C-9 -35 9 -36 21 -29';
  const jewel = oval(0, -16, 4, 5);
  const plume = 'M0 -21C-3 -32 -1 -44 7 -52C5 -44 5 -32 2 -21Z';
  const tache = 'M0 7C-4 4 -10 4 -14 7.5C-16 9.5 -18.5 8 -17.5 5C-19.5 8 -18 12 -14 11.5C-9 11 -4 10 0 10.5C4 10 9 11 14 11.5C18 12 19.5 8 17.5 5C18.5 8 16 9.5 14 7.5C10 4 4 4 0 7Z';
  const m =
    mood === 'laugh'
      ? { fine: ['M-10 0q3 -3.4 6 0M4 0q3 -3.4 6 0'], fills: [], glints: [] }
      : { fine: [], fills: [dot(-7, 0, mood === 'wow' ? 2.6 : 2.1), dot(7, 0, mood === 'wow' ? 2.6 : 2.1)], glints: [dot(-7.6, -0.7, 0.6), dot(6.4, -0.7, 0.6)] };
  const mouth =
    mood === 'wow'
      ? { fills: [oval(0, 17.5, 3, 3.4)] }
      : mood === 'laugh'
        ? { fine: ['M-7 14C-6 22 6 22 7 14C3 15 -3 15 -7 14Z'], washes: [{ c: PAL.red, o: 0.8, d: 'M-7 14C-6 22 6 22 7 14C3 15 -3 15 -7 14Z' }] }
        : { fine: ['M-6 15.5q6 5 12 0'] };
  return merge(
    {
      lines: [head, turban],
      fine: [wraps, jewel, plume, 'M-18 0q-6 0 -5 6q1 4 5 2M18 0q6 0 5 6q-1 4 -5 2', 'M0 1c3 1 3 5 0 6', 'M-12 -8q5 -4 10 -1M2 -9q5 -3 10 1', tache],
      washes: [
        { c: PAL.terracotta, o: 0.55, d: head },
        { c: PAL.ochre, o: 0.45, d: head },
        { c: PAL.red, o: 0.85, d: turban },
        { c: PAL.ochre, o: 1, d: `${jewel}${plume}` },
        { c: PAL.ink, o: 0.85, d: tache },
        { c: PAL.ink, o: 0.7, d: 'M-12 -8q5 -4 10 -1l0 1.5q-5 -3 -10 1ZM2 -9q5 -3 10 1l0 1.5q-5 -3 -10 -1Z' },
        { c: PAL.rose, o: 0.7, d: dot(-11, 9, 3) + dot(11, 9, 3) },
      ],
      glints: ['M-7 -36C-3 -39 3 -39 7 -38C3 -37 -3 -36 -7 -34Z', dot(-1, -17.5, 1.2)],
    },
    m,
    mouth,
    place(ring(3), 'translate(-21 10)'),
  );
}
/**
 * THE GENIE OF THE LAMP: enormous, a warm terracotta-and-ochre smoke body that tapers into a
 * smoky tail. The tail starts at (0,0) (put that on the lamp's spout) and curls up to the right
 * into his chest (centre x = 45). A big red turban with an ochre jewel and plume, a curly black
 * moustache, bushy brows, a gold earring, and his arms folded. About 250 tall. mood: happy, wow, laugh.
 */
export function genie({ mood = 'happy', smoke = true, k = 1 } = {}) {
  // k < 1 makes the tail shorter (the waist sits at y = -100k)
  const tail = limb([[45, -104, 56], [44, -80, 42], [46, -52, 28], [36, -26, 18], [18, -8, 10], [3, -1, 4]].map(([x, y, w]) => [x, y * k, w]));
  const tailFill = Z(tail);
  const up = `translate(0 ${f(100 * (1 - k))})`;
  // the body: shoulders and the visible bits of the sides (the folded arms hide the rest)
  const torso = 'M15 -100C5 -112 1 -132 5 -150C9 -165 24 -172 45 -172C66 -172 81 -165 85 -150C89 -132 85 -112 75 -100C60 -95 30 -95 15 -100Z';
  const shoulders = 'M14 -164C24 -172 66 -172 76 -164';
  const sides = 'M10 -116C10 -108 13 -103 16 -100M80 -116C80 -108 77 -103 74 -100';
  const sash = 'M14 -106C30 -100 60 -100 76 -106L78 -97C60 -91 30 -91 12 -97Z';
  const upperL = 'M16 -165C4 -164 -6 -152 -8 -138C-10 -126 -4 -116 6 -116';
  const upperR = 'M74 -165C86 -164 96 -152 98 -138C100 -126 94 -116 84 -116';
  const forearm = 'M2 -138C14 -150 76 -150 88 -138C96 -130 94 -118 84 -116C66 -124 24 -124 6 -116C-4 -118 -6 -130 2 -138Z';
  const armsFill = `${upperL}L16 -140Z${upperR}L74 -140Z`;
  const skin = (d) => [{ c: PAL.terracotta, o: 0.55, d }, { c: PAL.ochre, o: 0.45, d }];
  const parts = [
    {
      lines: [tail],
      fine: [transformPath('M30 -72q8 6 18 0M24 -46q6 4 12 0M40 -86q6 4 10 -2', `scale(1 ${k})`)],
      washes: skin(tailFill),
    },
    place(
      merge(
        {
          lines: [shoulders, sides, upperL, upperR, forearm],
          // fingers tucked over the upper arms, and a chest line
          fine: ['M-4 -140q2 -4 5 -1q2 -4 5 -1q2 -4 5 0M80 -141q2 -4 5 -1q2 -4 5 -1q2 -4 5 0', 'M45 -160q-10 4 -18 2M45 -160q10 4 18 2'],
          washes: [...skin(torso), ...skin(armsFill), { c: PAL.terracotta, o: 0.4, d: forearm }, { c: PAL.red, o: 0.7, d: sash }],
        },
        { lines: [sash] },
        place(genieHead({ mood }), 'translate(45 -192) scale(1.35)'),
      ),
      up,
    ),
  ];
  if (smoke) {
    const puffs = bumpy(8, -6, 14, 9, 7, 1.3) + bumpy(30, -14, 12, 9, 6, 1.3) + bumpy(-6, -16, 9, 7, 6, 1.3);
    parts.unshift({ fine: [puffs], washes: [{ c: PAL.grey, o: 0.35, d: puffs }, { c: PAL.ochre, o: 0.25, d: puffs }] });
  }
  return merge(...parts);
}

// =============================================================================================
// THE GENIE OF THE RING: small and green, pointy ears, a cheeky wink and grin, waving. His smoky
// tail starts at (0,0) (on the ring) and his head is at (0,-62). About 75 tall.
// =============================================================================================
export function ringGenie({ mood = 'wink' } = {}) {
  const tail = limb([[0, -32, 18], [5, -20, 11], [-2, -9, 6], [0, -1, 2.5]]);
  const body = oval(0, -40, 12.5, 11);
  const head = oval(0, -62, 11.5, 10.5);
  const ears = 'M-10 -65L-26 -73L-10 -58M10 -65L26 -73L10 -58';
  const earFill = 'M-10 -65L-26 -73L-10 -58ZM10 -65L26 -73L10 -58Z';
  const armL = limb([[-10, -46, 5.5], [-18, -54, 5], [-22, -64, 4.5]]);
  const armR = limb([[10, -46, 5.5], [19, -50, 5], [25, -58, 4.5]]);
  const hands = dot(-22, -66, 3.4) + dot(26, -60, 3.4);
  const m = faceMarks({ mood, ex: 4.2, ey: -64, my: -57, r: 1.6, w: 4 });
  const green = (d, o = 0.8) => ({ c: PAL.green, o, d });
  return merge(
    {
      lines: [tail, body, head, ears, armL, armR, 'M-1 -72C-3 -77 0 -81 4 -79'],
      fine: [hands, 'M-6 -44q6 4 12 0', 'M-5 -14q4 3 9 0M-2 -26q4 3 8 0', `M${-4.2 - 3} -68.5l5 1M${4.2 + 3} -68.5l-5 1`],
      washes: [green(Z(tail), 0.5), green(body), green(head), green(earFill), green(Z(armL) + Z(armR)), green(hands), { c: PAL.rose, o: 0.5, d: dot(-7, -59, 1.8) + dot(7, -59, 1.8) }],
    },
    m,
  );
}

// =============================================================================================
// ALADDIN'S MOTHER (feet at 0,0), about 122 tall and round: a rose headscarf, a sky-blue dress, a
// white apron. pose: 'stand', 'sit' (fallen back on the floor, legs in the air) or 'kneel'
// (kneeling, facing right). arms: two centrelines from the shoulders (±21,-36) of her upper body,
// in its own coordinates (waist at 0,0).
// =============================================================================================
export const M_ARMS = {
  down: [
    [[-21, -36, 9], [-28, -24, 8.5], [-31, -12, 8.5], [-31, -4, 8.5]],
    [[21, -36, 9], [28, -24, 8.5], [31, -12, 8.5], [31, -4, 8.5]],
  ],
};
export function motherHead({ mood = 'happy' } = {}) {
  const scarf = 'M-17 6C-19 -10 -12 -21 0 -21C12 -21 19 -10 17 6C17 14 12 18 6 19L-6 19C-12 18 -17 14 -17 6Z';
  const face = 'M-11 -1C-12 8 -6 14 0 14C6 14 12 8 11 -1C11 -8 6 -11 0 -11C-6 -11 -11 -8 -11 -1Z';
  const knot = 'M10 16C16 18 20 24 18 30C14 28 12 24 10 20Z';
  const m = faceMarks({ mood, ex: 4.2, ey: 0, my: 7, r: 1.7, w: 3.8 });
  return {
    lines: [scarf, face],
    fine: [knot, 'M-14 -8C-8 -14 8 -14 14 -8', 'M0.4 2c1.4 1 1.4 2.2 -0.5 2.6', 'M-4 -9q4 -2 8 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.85, d: `${scarf}${face}`, rule: 'evenodd' },
      { c: PAL.rose, o: 0.85, d: knot },
      { c: PAL.red, o: 0.35, d: `${scarf}${face}`, rule: 'evenodd' },
      { c: PAL.rose, o: 0.3, d: face },
      { c: PAL.ink, o: 0.55, d: 'M-10 -4C-9 -9 -4 -11 0 -10C4 -11 9 -9 10 -4C6 -7 -6 -7 -10 -4Z' },
      { c: PAL.rose, o: 0.65, d: dot(-7, 5, 2.4) + dot(7, 5, 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
}
export function mother({ pose = 'stand', mood = 'happy', tilt = 0, arms = M_ARMS.down } = {}) {
  const bodice = 'M-10 -44C-22 -42 -28 -32 -28 -18L-30 -2C-10 2 10 2 30 -2L28 -18C28 -32 22 -42 10 -44';
  const upper = merge(
    { lines: [bodice], fine: ['M-6 -43q6 5 12 0'], washes: [{ c: PAL.sky, o: 0.8, d: Z(bodice) }, { c: PAL.slate, o: 0.2, d: Z(bodice) }] },
    ...arms.map((a) => arm(a, PAL.sky, 0.8, 4.8)),
    place(motherHead({ mood }), `translate(0 -58) rotate(${tilt}) scale(1.05)`),
  );
  const parts = [];
  if (pose === 'stand') {
    const skirt = 'M-30 -44C-34 -30 -38 -14 -36 -2C-12 2 12 2 36 -2C38 -14 34 -30 30 -44';
    const apron = 'M-18 -43L18 -43L22 -7C8 -4 -8 -4 -22 -7Z';
    const shoes = 'M-18 0C-24 0 -25 5 -19 5L-6 5L-6 0ZM18 0C24 0 25 5 19 5L6 5L6 0Z';
    parts.push(
      { lines: [skirt, shoes], fine: [apron, 'M-8 -30q8 3 16 0'], washes: [{ c: PAL.sky, o: 0.8, d: Z(skirt) }, { c: PAL.slate, o: 0.2, d: Z(skirt) }, { c: PAL.ink, o: 0.6, d: shoes }], whites: [apron] },
      place(upper, 'translate(0 -42)'),
    );
  } else if (pose === 'sit') {
    const skirt = 'M-28 -30C-40 -24 -46 -12 -44 0C-14 4 20 4 40 0C40 -12 34 -24 24 -32';
    const legA = limb([[14, -12, 11], [32, -24, 10], [46, -38, 9]]);
    const legB = limb([[20, -6, 11], [40, -12, 10], [56, -24, 9]]);
    const shoeA = 'M42 -42C44 -50 54 -50 54 -44C54 -40 48 -38 44 -38Z';
    const shoeB = 'M52 -28C54 -36 64 -36 64 -30C64 -26 58 -24 54 -24Z';
    parts.push(
      { lines: [legA, legB, shoeA, shoeB], washes: [{ c: PAL.rose, o: 0.4, d: Z(legA) + Z(legB) }, { c: PAL.ink, o: 0.6, d: shoeA + shoeB }] },
      { lines: [skirt], fine: ['M-30 -10q14 4 30 2'], washes: [{ c: PAL.sky, o: 0.8, d: Z(skirt) }, { c: PAL.slate, o: 0.2, d: Z(skirt) }] },
      place(upper, 'translate(-4 -28) rotate(-20)'),
    );
  } else {
    // kneeling, facing right: the skirt spreads on the floor, the soles of her shoes peep out behind
    const skirt = 'M-28 -44C-40 -32 -48 -14 -46 0C-14 3 14 3 38 0C38 -16 34 -32 28 -44';
    const soles = 'M-50 -2C-56 -4 -56 -12 -50 -12C-46 -12 -45 -6 -46 -2Z';
    const apron = 'M-16 -43L18 -43L24 -4C8 -2 -6 -2 -20 -4Z';
    parts.push(
      { lines: [soles], washes: [{ c: PAL.ink, o: 0.6, d: soles }] },
      { lines: [skirt], fine: [apron], washes: [{ c: PAL.sky, o: 0.8, d: Z(skirt) }, { c: PAL.slate, o: 0.2, d: Z(skirt) }], whites: [apron] },
      place(upper, 'translate(0 -42)'),
    );
  }
  return merge(...parts);
}

// =============================================================================================
// PRINCESS BADROULBADOUR (feet at 0,0), about 132 tall: a rose gown with a red sash and gold hem,
// long dark hair, a little gold tiara. Head at (0,-110); arms from the shoulders (±14,-90).
// pose: 'stand', 'upper' (cut at the waist, y = -58, for a balcony or window) or 'ride' (sitting
// side-saddle, the skirt hanging down to the right; the seat is at y = -40).
// =============================================================================================
export const PR_ARMS = {
  down: [
    [[-14, -90, 7], [-21, -80, 6.5], [-25, -70, 6.5], [-26, -64, 6.5]],
    [[14, -90, 7], [21, -80, 6.5], [25, -70, 6.5], [26, -64, 6.5]],
  ],
};
export function princessHead({ mood = 'happy' } = {}) {
  const face = 'M-11 -4C-11.5 6 -6 12 0 12C6 12 11.5 6 11 -4';
  const faceFill = `${face}C9 -9 -9 -9 -11 -4Z`;
  const hair =
    'M-11 -3C-9 -9 -4 -10 0 -8C4 -10 9 -9 11 -3C13 8 13 20 18 32C10 35 5 28 10 14C11 8 11 2 11 -3M-11 -3C-13 8 -13 20 -18 32C-10 35 -5 28 -10 14C-11 8 -11 2 -11 -3C-15 -16 -7 -20 0 -20C7 -20 15 -16 11 -3';
  const hairFill =
    'M-11 -3C-9 -9 -4 -10 0 -8C4 -10 9 -9 11 -3C13 8 13 20 18 32C10 35 5 28 10 14C12 4 12 -1 11 -3C15 -16 7 -20 0 -20C-7 -20 -15 -16 -11 -3C-12 -1 -12 4 -10 14C-5 28 -10 35 -18 32C-13 20 -13 8 -11 -3Z';
  const tiara = 'M-8 -15L-6 -22L-3 -17L0 -25L3 -17L6 -22L8 -15C3 -17 -3 -17 -8 -15Z';
  const m = faceMarks({ mood, ex: 4.2, ey: 0, my: 6.5, r: 1.6, w: 3.6 });
  return {
    lines: [face, hair, tiara],
    fine: ['M0.4 1.5c1.4 1 1.4 2.2 -0.5 2.6', 'M-14 10q2 8 0 16M14 10q-2 8 0 16', `M-6.8 -2.6l-1.2 -1.2M6.8 -2.6l1.2 -1.2`, ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.ink, o: 0.7, d: hairFill },
      { c: PAL.terracotta, o: 0.35, d: hairFill },
      { c: PAL.ochre, o: 1, d: tiara },
      { c: PAL.red, o: 0.9, d: dot(0, -19, 1.6) },
      { c: PAL.rose, o: 0.65, d: dot(-7, 4.5, 2.2) + dot(7, 4.5, 2.2) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, 'M-7 -14C-4 -17 0 -18 3 -17C0 -16 -4 -14 -6 -12Z'],
  };
}
export function princess({ pose = 'stand', mood = 'happy', tilt = 0, arms = PR_ARMS.down } = {}) {
  const parts = [];
  if (pose === 'stand') {
    const dress = 'M-9 -96C-16 -94 -18 -86 -18 -78C-20 -60 -27 -30 -35 -2C-12 2 12 2 35 -2C27 -30 20 -60 18 -78C18 -86 16 -94 9 -96';
    const hem = 'M-32 -12C-12 -8 12 -8 32 -12L35 -2C12 2 -12 2 -35 -2Z';
    parts.push({
      lines: [dress],
      fine: ['M-32 -12C-12 -8 12 -8 32 -12', 'M-10 -50q-2 18 -5 38M10 -50q2 18 5 38'],
      washes: [{ c: PAL.rose, o: 0.85, d: Z(dress) }, { c: PAL.ochre, o: 0.85, d: hem }],
    });
  } else if (pose === 'ride') {
    const top = 'M-9 -96C-16 -94 -18 -86 -18 -78L-18 -56C-6 -53 6 -53 18 -56L18 -78C18 -86 16 -94 9 -96';
    const skirt = 'M-20 -60C-28 -50 -26 -30 -20 -6C-6 -2 18 -2 34 -8C30 -30 26 -48 20 -60';
    const hem = 'M-21 -14C-6 -10 18 -10 32 -16L34 -8C18 -2 -6 -2 -20 -6Z';
    const slipper = 'M6 -4C8 4 20 4 24 0C20 -2 14 -4 6 -4Z';
    parts.push({
      lines: [slipper, skirt, top],
      fine: ['M-21 -14C-6 -10 18 -10 32 -16', 'M-4 -54q0 20 -4 40M10 -54q4 20 6 40'],
      washes: [{ c: PAL.red, o: 0.8, d: slipper }, { c: PAL.rose, o: 0.85, d: Z(skirt) + Z(top) }, { c: PAL.ochre, o: 0.85, d: hem }],
    });
  } else {
    const top = 'M-9 -96C-16 -94 -18 -86 -18 -78C-19 -70 -20 -64 -21 -58L21 -58C20 -64 19 -70 18 -78C18 -86 16 -94 9 -96';
    parts.push({ lines: [top], washes: [{ c: PAL.rose, o: 0.85, d: Z(top) }] });
  }
  const sash = 'M-18 -74C-6 -70 6 -70 18 -74L19 -66C6 -62 -6 -62 -19 -66Z';
  parts.push({ lines: [sash], fine: ['M-9 -96C-6 -90 6 -90 9 -96'], washes: [{ c: PAL.red, o: 0.75, d: sash }] });
  parts.push(...arms.map((a) => arm(a, PAL.rose, 0.85, 3.8)));
  parts.push(place(princessHead({ mood }), `translate(0 -110) rotate(${tilt}) scale(1.05)`));
  return merge(...parts);
}

// =============================================================================================
// THE SULTAN, sitting on a big red cushion (cushion bottom at 0,0), about 150 tall: plump, a big
// white turban with a red jewel and a white plume, a round white beard, an ochre robe with a red
// sash. Head at (0,-118); arms from the shoulders (±30,-92).
// =============================================================================================
export const SU_ARMS = {
  down: [
    [[-30, -92, 12], [-44, -78, 11], [-50, -64, 11], [-50, -56, 11]],
    [[30, -92, 12], [44, -78, 11], [50, -64, 11], [50, -56, 11]],
  ],
};
export function sultanHead({ mood = 'happy' } = {}) {
  const face = 'M-14 -2C-15 9 -8 15 0 15C8 15 15 9 14 -2C14 -8 8 -11 0 -11C-8 -11 -14 -8 -14 -2Z';
  const beard = 'M-14 4C-17 18 -10 30 0 30C10 30 17 18 14 4C10 11 5 12 0 10.5C-5 12 -10 11 -14 4Z';
  const turban = 'M-25 -4C-32 -20 -22 -42 0 -44C22 -42 32 -20 25 -4C14 -10 -14 -10 -25 -4Z';
  const wraps = 'M-26 -14C-14 -24 14 -26 27 -16M-22 -28C-10 -36 10 -36 22 -28';
  const jewel = oval(0, -18, 4.5, 5.5);
  const plume = 'M2 -22C2 -34 8 -46 18 -52C14 -44 10 -34 6 -21Z';
  const m = faceMarks({ mood, ex: 5, ey: -1, my: 6.5, r: 1.9, w: 3.6 });
  return {
    lines: [face, beard, turban],
    fine: [wraps, jewel, plume, 'M-8 6.5C-5 4 -2 4.5 0 5.5C2 4.5 5 4 8 6.5', 'M-7 16q2 5 1 8M7 16q-2 5 -1 8M0 18l0 7', 'M-9 -6q3 -2 6 0M3 -6q3 -2 6 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: face },
      { c: PAL.grey, o: 0.3, d: beard },
      { c: PAL.grey, o: 0.3, d: turban },
      { c: PAL.red, o: 0.95, d: jewel },
      { c: PAL.rose, o: 0.85, d: dot(0, 2, 3) },
      { c: PAL.rose, o: 0.6, d: dot(-9, 4, 2.6) + dot(9, 4, 2.6) },
      ...m.washes,
    ],
    whites: [beard, turban, plume],
    fills: m.fills,
    glints: [...m.glints, dot(-1.5, -20, 1.2)],
  };
}
export function sultan({ mood = 'happy', tilt = 0, arms = SU_ARMS.down } = {}) {
  const cushion = 'M-60 -6C-64 -22 -56 -30 -40 -30C-10 -34 20 -34 46 -30C60 -28 66 -20 62 -6C30 2 -30 2 -60 -6Z';
  const tassels = 'M-60 -6l-6 6M-62 -24l-7 -3M62 -6l6 6M60 -24l7 -3';
  const robe = 'M-16 -100C-34 -96 -46 -78 -48 -54C-50 -38 -48 -28 -44 -22C-14 -16 14 -16 44 -22C48 -28 50 -38 48 -54C46 -78 34 -96 16 -100';
  const sash = 'M-47 -50C-16 -44 16 -44 47 -50L47 -41C16 -35 -16 -35 -47 -41Z';
  const slippers = 'M-26 -20C-34 -16 -38 -12 -42 -16C-40 -8 -30 -8 -22 -14ZM26 -20C34 -16 38 -12 42 -16C40 -8 30 -8 22 -14Z';
  return merge(
    {
      lines: [cushion, robe, sash, slippers],
      fine: [tassels, 'M0 -96L0 -50M0 -40L0 -20', 'M-40 -20q40 6 80 0', dot(-4, -84, 1.5) + dot(-4, -72, 1.5) + dot(-4, -60, 1.5)],
      washes: [
        { c: PAL.red, o: 0.7, d: cushion },
        { c: PAL.terracotta, o: 0.4, d: cushion },
        { c: PAL.ochre, o: 0.8, d: Z(robe) },
        { c: PAL.red, o: 0.8, d: sash },
        { c: PAL.red, o: 0.8, d: slippers },
      ],
    },
    ...arms.map((a) => arm(a, PAL.ochre, 0.8, 5.6)),
    place(sultanHead({ mood }), `translate(0 -118) rotate(${tilt}) scale(1.1)`),
  );
}

/** Little sparkle stars (four-pointed) at the given points, of size s. */
export function sparkles(points, s = 5) {
  return points.map(([x, y, k = 1]) => `M${x} ${y - s * k}L${x} ${y + s * k}M${x - s * k} ${y}L${x + s * k} ${y}`).join('');
}

/** Jewels (round gems with a glint) in red, green and blue: [[x, y, colour, r]]. */
export function jewels(list) {
  const out = { fine: [], washes: [], glints: [] };
  for (const [x, y, c, r = 4] of list) {
    const d = oval(x, y, r, r * 1.1);
    out.fine.push(d);
    out.washes.push({ c, o: 0.95, d });
    out.glints.push(dot(x - r * 0.35, y - r * 0.4, r * 0.28));
  }
  return out;
}
