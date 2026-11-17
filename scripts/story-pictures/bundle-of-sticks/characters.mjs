import { PAL } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// The Bundle of Sticks: the old farmer, his three sons, the bundle of sticks, a single stick and the
// red string, shared by the two pictures. Each is drawn once here and placed in each picture with a
// transform (place). The build only draws files named <n>.mjs, so this file is not a picture.
// Standing characters have their feet at y = 0 and look at us.

export { compose, place, merge, at } from '../stone-soup/characters.mjs';

const f = (n) => Math.round(n * 10) / 10;

/** Where the picture point (x, y) lies in the coordinates of a character placed at (px, py), turned by rot and scaled by s. */
export function local(x, y, px, py, rot = 0, s = 1) {
  const a = (-rot * Math.PI) / 180;
  const dx = (x - px) / s;
  const dy = (y - py) / s;
  return [f(dx * Math.cos(a) - dy * Math.sin(a)), f(dx * Math.sin(a) + dy * Math.cos(a))];
}

/** An arm from the shoulder to the hand, its elbow pushed out sideways by bend, with a round rosy hand. */
function arm(shoulder, hand, { bend = 0, w = 9, sleeve, o = 0.65, r = 4.4 }) {
  const [sx, sy] = shoulder;
  const [hx, hy] = hand;
  const l = Math.hypot(hx - sx, hy - sy) || 1;
  const ex = (sx + hx) / 2 + (-(hy - sy) / l) * bend;
  const ey = (sy + hy) / 2 + ((hx - sx) / l) * bend;
  const d = limb([[sx, sy, w], [f(ex), f(ey), w * 0.92], [hx, hy, w * 0.86]]);
  const h = dot(hx, hy, r);
  return { lines: [d], fine: [h], washes: [{ c: sleeve, o, d: `${d}Z` }, { c: PAL.rose, o: 0.6, d: h }] };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. mood: 'happy' (open eyes, smile), 'laugh' (eyes
 * squeezed shut, mouth wide open), 'strain' (eyes screwed tight, gritted teeth, pulling hard).
 */
function faceMarks({ mood, ex, ey, my, w = 5, r = 1.8 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  if (mood === 'laugh') {
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 9} ${w} ${my + 9} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(`M${-ex - 3} ${ey}q3 -3.4 6 0M${ex - 3} ${ey}q3 -3.4 6 0`, mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'strain') {
    // > <  eyes and a wide gritted grin
    fine.push(`M${-ex - 3} ${ey - 2.5}l5 2.5l-5 2.5M${ex + 3} ${ey - 2.5}l-5 2.5l5 2.5`);
    const mw = w * 0.7;
    const mouth = `M${-mw} ${my - 1.5}L${mw} ${my - 1.5}L${mw} ${my + 2}L${-mw} ${my + 2}Z`;
    fine.push(mouth, `M${-mw} ${my + 0.3}L${mw} ${my + 0.3}`);
    whites.push(mouth);
  } else {
    fills.push(dot(-ex, ey, r), dot(ex, ey, r));
    glints.push(dot(-ex - 0.5, ey - 0.6, 0.55), dot(ex - 0.5, ey - 0.6, 0.55));
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

// ---------------------------------------------------------------------------------------------
// The old farmer's head (centre of the face at 0,0): a wide ochre straw hat with a red band, bushy
// white eyebrows, a round rosy nose and a big white beard down over his chest.
const fFace = 'M-13 -7C-15 2 -14 8 -12 12M13 -7C15 2 14 8 12 12';
const fFaceFill = 'M-13 -7C-15 2 -14 8 -12 12L12 12C14 8 15 2 13 -7C8 -10 -8 -10 -13 -7Z';
const fBeard =
  'M-13 3C-18 12 -16 26 -10 34C-6 40 -2 44 0 46C2 44 6 40 10 34C16 26 18 12 13 3C10 9 6 10 3 9C1 11 -1 11 -3 9C-6 10 -10 9 -13 3Z';
const fBeardCurls = 'M-8 20q2 4 0 8M0 24q2 4 0 8M8 20q2 4 0 8M-4 34q2 3 0 6M5 33q2 3 0 6';
const fMoustache = 'M-9 7C-5 3 -1 4 0 6C1 4 5 3 9 7C6 10 2 10 0 8C-2 10 -6 10 -9 7Z';
const fBrows = 'M-9 -5q4 -4 8 -1M1 -6q4 -3 8 1';
const fBrim = 'M-34 -9C-28 -16 -16 -18 0 -18C16 -18 28 -16 35 -9C38 -5 33 -3 28 -5C18 -9 -18 -9 -28 -4C-34 -2 -38 -5 -34 -9Z';
const fCrown = 'M-16 -16C-18 -28 -12 -36 0 -36C12 -36 18 -28 16 -16';
const fBand = 'M-16.5 -17C-17 -20 -17 -22 -16.8 -24C-6 -27 6 -27 16.8 -24C17 -22 17 -20 16.5 -17C6 -19 -6 -19 -16.5 -17Z';
const fStraw = 'M-26 -10l4 -3M-14 -12l3 -3M14 -12l-3 -3M26 -10l-4 -3M-8 -32l2 4M6 -33l-1 4';
export function farmerHead({ mood = 'happy' } = {}) {
  const m = faceMarks({ mood, ex: 5.2, ey: -1, my: 12, w: 3.5, r: 1.8 });
  const nose = dot(0, 3, 3.6);
  return {
    lines: [fFace, fBeard, fBrim, fCrown],
    fine: [fBeardCurls, fMoustache, fBrows, fStraw, 'M-13 -6q-4 3 -2 8M13 -6q4 3 2 8', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: fFaceFill },
      { c: PAL.grey, o: 0.25, d: fBeard },
      { c: PAL.ochre, o: 0.85, d: `${fBrim}${fCrown}Z` },
      { c: PAL.red, o: 0.8, d: fBand },
      { c: PAL.rose, o: 0.85, d: nose },
      { c: PAL.rose, o: 0.6, d: dot(-9, 4, 2.4) + dot(9, 4, 2.4) },
      ...m.washes,
    ],
    whites: [fBeard, fMoustache, ...m.whites],
    fills: m.fills,
    glints: [...m.glints, dot(-1, 1.8, 0.9)],
  };
}

// The old farmer (feet at 0,0), about 175 tall: a long slate-blue smock with a belt of rope, grey
// trousers and terracotta boots. Head at (0, -140), drawn 1.15 times bigger; shoulders at (±21, -112).
// arms: [left hand, right hand] in his own coordinates (and how much each elbow bends).
export const F_SHOULDERS = [[-21, -110], [21, -110]];
export function farmer({ mood = 'happy', hands = [[-30, -62], [30, -62]], bends = [6, -6], tilt = 0 } = {}) {
  const smock =
    'M-12 -118C-22 -116 -26 -108 -26 -98C-27 -78 -30 -58 -32 -40C-14 -37 14 -37 32 -40C30 -58 27 -78 26 -98C26 -108 22 -116 12 -118Z';
  const legs = 'M-17 -39L-16 -8M-4 -38L-4 -8M4 -38L4 -8M17 -39L16 -8';
  const legFill = 'M-17 -39L-16 -8L-4 -8L-4 -38ZM4 -38L4 -8L16 -8L17 -39Z';
  const boots = 'M-16 -8C-25 -8 -27 1 -21 1L-3 1L-4 -8ZM16 -8C25 -8 27 1 21 1L3 1L4 -8Z';
  const belt = 'M-28 -68C-10 -65 10 -65 28 -68';
  const lines = [smock, legs, boots];
  const fine = [belt, 'M-28 -68l-4 12M-26 -67l1 12', 'M-14 -56q2 8 0 14M12 -60q2 10 1 18', 'M-4 -112l4 8l4 -8'];
  const washes = [
    { c: PAL.slate, o: 0.6, d: smock },
    { c: PAL.ochre, o: 0.8, d: limb([[-28, -68, 3], [0, -65.5, 3], [28, -68, 3]]) },
    { c: PAL.grey, o: 0.75, d: legFill },
    { c: PAL.terracotta, o: 0.9, d: boots },
  ];
  const arms = F_SHOULDERS.map((s, i) => arm(s, hands[i], { bend: bends[i], w: 11, sleeve: PAL.slate, o: 0.6, r: 5 }));
  const head = place(farmerHead({ mood }), `translate(0 -140) rotate(${tilt}) scale(1.15)`);
  return merge({ lines, fine, washes }, head, ...arms);
}

// ---------------------------------------------------------------------------------------------
// The three sons, all built the same way with different sizes, colours and hair:
//  - eldest: tall (about 135), dark brown hair, green shirt, ochre trousers;
//  - middle: about 112, ginger hair, red shirt, slate trousers;
//  - youngest: small (about 86), fair curly hair with a tuft, sky-blue shirt, ochre shorts.
export const SONS = {
  eldest: { leg: 56, body: 46, sw: 17, hs: 1.05, shirt: PAL.green, trousers: PAL.ochre, hair: 'dark' },
  middle: { leg: 44, body: 38, sw: 15, hs: 1, shirt: PAL.red, trousers: PAL.slate, hair: 'ginger' },
  youngest: { leg: 30, body: 30, sw: 13, hs: 0.95, shirt: PAL.sky, trousers: PAL.ochre, hair: 'fair' },
};

const bFace = 'M-12.6 -3C-13 8 -6 14 0 14C6 14 13 8 12.6 -3';
const bFaceFill = `${bFace}C11 -8 6 -10 0 -8C-5 -10 -10 -8 -12.6 -3Z`;
const HAIR = {
  // short and tidy, a side parting
  dark: 'M-13.4 -1C-16 -14 -8 -21 0 -21C9 -21 16 -14 13.4 -1C12 -6 9 -9 5 -9C2 -7 -2 -10 -5 -11C-8 -8 -11 -6 -13.4 -1Z',
  // spiky on top
  ginger: 'M-13.4 -1C-16 -12 -12 -18 -8 -19L-7 -25L-2 -20L2 -26L5 -20L10 -24L10 -18C15 -14 16 -8 13.4 -1C11 -7 6 -9 2 -8C-2 -10 -8 -8 -13.4 -1Z',
  // round and curly, a tuft sticking up
  fair: 'M-13.4 -1C-17 -5 -16 -12 -12 -14C-12 -19 -6 -21 -2 -19C2 -22 9 -21 10 -16C15 -15 17 -7 13.4 -1C11 -6 6 -9 1 -8C-4 -10 -10 -7 -13.4 -1Z',
};
const HAIR_COL = { dark: [PAL.terracotta, PAL.ink, 0.35], ginger: [PAL.terracotta, PAL.ochre, 0.4], fair: [PAL.ochre, PAL.ochre, 0.3] };
const HAIR_EXTRA = {
  dark: 'M-6 -16q5 -3 10 -1M5 -10q3 -4 7 -3',
  ginger: 'M-8 -12q3 -2 6 0M3 -13q3 -2 6 1',
  fair: 'M-1 -19C-2 -26 3 -29 6 -26C3 -27 1 -24 2 -21M-9 -11q2 -3 5 -1M4 -12q3 -2 5 1',
};

export function sonHead(who, { mood = 'happy' } = {}) {
  const k = SONS[who].hair;
  const m = faceMarks({ mood, ex: 4.6, ey: 1, my: 7.5, w: 4, r: 1.7 });
  const [c1, c2, o2] = HAIR_COL[k];
  const freckles = k === 'ginger' ? 'M-8 4.5l0.5 0M-6 6l0.5 0M7 4.5l0.5 0M5.5 6l0.5 0' : '';
  return {
    lines: [bFace, HAIR[k]],
    fine: [HAIR_EXTRA[k], 'M0.5 3c1.6 1.2 1.6 2.4 -0.5 2.8', 'M-12.6 0q-4 1 -1 6M12.6 0q4 1 1 6', freckles, ...m.fine].filter(Boolean),
    washes: [
      { c: PAL.rose, o: 0.3, d: bFaceFill },
      { c: c1, o: 0.85, d: HAIR[k] },
      { c: c2, o: o2, d: HAIR[k] },
      { c: PAL.rose, o: 0.65, d: dot(-7.5, 6, 2.4) + dot(7.5, 6, 2.4) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}

/** Where a son's head and shoulders are, in his own coordinates (feet at 0,0). */
export function sonFrame(who) {
  const s = SONS[who];
  const top = -(s.leg + s.body);
  return { head: [0, f(top - 12 * s.hs)], shoulders: [[-s.sw, top + 6], [s.sw, top + 6]], hip: -s.leg };
}

/** A son (feet at 0,0). hands: [left, right] in his own coordinates; tilt turns the head. */
export function son(who, { mood = 'happy', hands, bends = [5, -5], tilt = 0 } = {}) {
  const s = SONS[who];
  const fr = sonFrame(who);
  const top = -(s.leg + s.body);
  const hip = -s.leg;
  const hw = s.sw + 1;
  const shirt = `M-6 ${top}C${-s.sw - 2} ${top + 1} ${-s.sw - 1} ${top + 8} ${-s.sw} ${top + 14}L${-hw} ${hip + 4}C-6 ${hip + 6} 6 ${hip + 6} ${hw} ${hip + 4}L${s.sw} ${top + 14}C${s.sw + 1} ${top + 8} ${s.sw + 2} ${top + 1} 6 ${top}Z`;
  const collar = `M-6 ${top}L0 ${top + 6}L6 ${top}`;
  const short = who === 'youngest';
  const legEnd = short ? hip + s.leg * 0.45 : -6;
  const trousers = `M${-hw + 1} ${hip + 3}L${-hw + 1} ${f(legEnd)}L-1 ${f(legEnd)}L0 ${hip + 10}L1 ${f(legEnd)}L${hw - 1} ${f(legEnd)}L${hw - 1} ${hip + 3}Z`;
  const lw = Math.max(4, s.sw * 0.32);
  const legs = short
    ? [limb([[-7, f(legEnd - 2), lw], [-7, -5, lw]]), limb([[7, f(legEnd - 2), lw], [7, -5, lw]])]
    : [];
  const shoes = `M-3 -6C${-hw - 1} -6 ${-hw - 2} 1 ${-hw + 2} 1L-1 1L-1 -6ZM3 -6C${hw + 1} -6 ${hw + 2} 1 ${hw - 2} 1L1 1L1 -6Z`;
  const lines = [shirt, trousers, ...legs, shoes];
  const fine = [collar];
  const washes = [
    { c: s.shirt, o: 0.65, d: shirt },
    { c: s.trousers, o: 0.75, d: trousers },
    { c: PAL.terracotta, o: 0.85, d: shoes },
  ];
  if (legs.length) washes.push({ c: PAL.rose, o: 0.4, d: legs.map((d) => `${d}Z`).join('') });
  if (who === 'middle') fine.push(`M-${s.sw - 3} ${top + 16}l${2 * s.sw - 6} 0M-${s.sw - 2} ${top + 26}l${2 * s.sw - 4} 0`); // a striped jumper
  if (who === 'eldest') fine.push(`M0 ${top + 6}L0 ${hip + 4}`, dot(-3, top + 14, 1.3), dot(-3, top + 24, 1.3), dot(-3, top + 34, 1.3));
  if (who === 'youngest') fine.push(`M-4 ${top + 12}l8 0l0 7l-8 0Z`); // a pocket
  const h = hands ?? [
    [-s.sw - 5, hip + 6],
    [s.sw + 5, hip + 6],
  ];
  const arms = fr.shoulders.map((sh, i) => arm(sh, h[i], { bend: bends[i], w: s.sw * 0.55, sleeve: s.shirt, o: 0.65, r: s.sw * 0.26 }));
  const head = place(sonHead(who, { mood }), `translate(${fr.head[0]} ${fr.head[1]}) rotate(${tilt}) scale(${s.hs})`);
  return merge({ lines, fine, washes }, ...arms, head);
}

// ---------------------------------------------------------------------------------------------
// The bundle (centre at 0,0), lying along x, about 100 long and 24 thick: five knobbly sticks tied
// tight with red string in two places, a red bow on the right-hand tie.
const STICKS = [
  [-48, 47, -9],
  [-51, 50, -4.5],
  [-46, 52, 0],
  [-50, 46, 4.5],
  [-47, 51, 9],
];
const stickPath = (x1, x2, y, w = 6) => limb([[x1, y, w], [f((x1 + x2) / 2), y + 0.7, w], [x2, y, w]]);
const TIES = [-22, 24];
const BOW = 'M24 -12C18 -22 12 -22 16 -14C18 -12 22 -12 24 -12ZM24 -12C30 -22 36 -20 32 -13C29 -11 26 -11 24 -12Z';
export function bundle() {
  const sticks = STICKS.map(([a, b, y]) => stickPath(a, b, y));
  const ends = STICKS.map(([, b, y]) => oval(b, y, 1.8, 2.6)).join('');
  const ties = TIES.map((x) => `M${x - 3} -13C${x - 4} -4 ${x - 4} 4 ${x - 3} 13L${x + 3} 13C${x + 4} 4 ${x + 4} -4 ${x + 3} -13Z`).join('');
  return {
    lines: [sticks[0], sticks[4], ties, BOW],
    fine: [sticks[1], sticks[2], sticks[3], ends, 'M24 -12L19 -3M24 -12L29 -4', 'M-34 -3l3 -2M6 2l3 -2M36 -6l3 -2'],
    washes: [
      { c: PAL.terracotta, o: 0.65, d: sticks.map((d) => `${d}Z`).join('') },
      { c: PAL.ochre, o: 0.4, d: sticks.map((d) => `${d}Z`).join('') },
      { c: PAL.red, o: 0.95, d: ties },
      { c: PAL.red, o: 0.9, d: BOW },
      { c: PAL.ochre, o: 0.8, d: ends },
    ],
  };
}

// A single stick snapped in two (the break at 0,0): two halves meeting in a "V" pointing up, each
// about 34 long, with jagged ends, held by the hands at (±hx, hy). Returned with the burst marks.
export function snappedStick({ open = 34 } = {}) {
  const a = (open * Math.PI) / 180;
  const half = (side) => {
    const [ex, ey] = [side * 38 * Math.cos(a), 38 * Math.sin(a)];
    return limb([[side * 1.5, 0, 5], [f(ex / 2), f(ey / 2 + 1), 5.2], [f(ex), f(ey), 5]]);
  };
  const halves = [half(-1), half(1)];
  const jag = 'M-3 -1l2 -4l1 3l2 -4l1 4M2 -1l2 -3l1 3';
  return {
    lines: halves,
    fine: [jag],
    washes: [
      { c: PAL.terracotta, o: 0.7, d: halves.map((d) => `${d}Z`).join('') },
      { c: PAL.ochre, o: 0.45, d: halves.map((d) => `${d}Z`).join('') },
    ],
  };
}

/** Where the two hands go on a snapped stick (break at 0,0) opened by open degrees. */
export const snapHands = (open = 34) => [-1, 1].map((side) => [f(side * 24 * Math.cos((open * Math.PI) / 180)), f(24 * Math.sin((open * Math.PI) / 180))]);

/** "Crack!" marks round the break of a snapped stick (0,0), out to the sides and up, and a few flying splinters. */
export function crack() {
  let d = '';
  const angles = [-178, -158, -136, -112, -68, -44, -22, -2];
  angles.forEach((deg, i) => {
    const ang = (deg * Math.PI) / 180;
    const r1 = 10 + (i % 2) * 2;
    const r2 = r1 + 10 + (i % 3) * 2;
    d += `M${f(Math.cos(ang) * r1)} ${f(Math.sin(ang) * r1)}L${f(Math.cos(ang) * r2)} ${f(Math.sin(ang) * r2)}`;
  });
  const splinters = 'M-9 -14l-3 -3M9 -15l2 -4';
  return { fine: [d, splinters] };
}

// ---------------------------------------------------------------------------------------------
// The red string, untied, lying in a loose wiggle on the ground (centre 0,0), about 60 wide.
export function string() {
  const s = 'M-30 2C-24 -6 -14 -4 -10 2C-6 8 4 8 6 0C8 -6 16 -8 20 -2C24 4 30 4 32 -2';
  return { lines: [s], washes: [{ c: PAL.red, o: 0.9, d: limb([[-30, 2, 3], [-20, -3, 3], [-10, 2, 3], [0, 6, 3], [6, 0, 3], [14, -5, 3], [22, 1, 3], [32, -2, 3]]) }] };
}

/** A loose stick lying on the ground (centre 0,0), about 100 long. */
export function looseStick(len = 100) {
  const d = stickPath(-len / 2, len / 2, 0);
  return {
    lines: [d],
    fine: [oval(len / 2, 0, 1.6, 2.4)],
    washes: [
      { c: PAL.terracotta, o: 0.7, d: `${d}Z` },
      { c: PAL.ochre, o: 0.45, d: `${d}Z` },
    ],
  };
}

