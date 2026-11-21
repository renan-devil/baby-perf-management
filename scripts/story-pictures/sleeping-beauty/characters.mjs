import { PAL, parseTransform } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';
import { sparkles, star5, twinkle } from '../cinderella/characters.mjs';

// Sleeping Beauty: the characters and props shared by the ten pictures, drawn once here and placed
// in each picture with a transform (place). The build only draws files named <n>.mjs, so this file
// is not a picture. Standing characters have their feet at y = 0 and face us; their eyes look left
// or right (look). Props stand on y = 0.

export { at, compose, dot, merge, oval, place, sparkles, star5, twinkle };

/** The local point of a character that the transform t sends to the picture point (x, y). */
export function toLocal(x, y, t) {
  const [a, b, c, d, e, g] = parseTransform(t);
  const det = a * d - b * c;
  return [(d * (x - e) - c * (y - g)) / det, (a * (y - g) - b * (x - e)) / det];
}

const Z = (d) => `${d}Z`;
const W = (c, o, d) => ({ c, o, d });

/** An arm along pts ending in a round hand; sleeve: wash colours [{c, o}]. */
export function arm(pts, sleeve, hand = 4, skin = { c: PAL.rose, o: 0.55 }) {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.7, (hand * 0.9) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[pts.length - 1][2]]]);
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [...sleeve.map((w) => ({ ...w, d: Z(d) })), ...(skin ? [{ ...skin, d: h }] : [])] };
}

/** Mirror a centreline (left arm -> right arm). */
export const right = (pts) => pts.map(([x, y, w]) => [-x, y, w]);

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. look: -1, 0, 1. mood: happy (dot eyes, smile),
 * asleep (eyes shut, calm little smile), smile (eyes shut in a pleased curve, big smile), cross
 * (brows down, a pout), worried (brows up, wobbly mouth), wow (round eyes, "o" mouth).
 */
export function faceMarks({ mood = 'happy', ex = 4.6, ey = 0, my = 7, r = 1.7, w = 3.6, look = 0 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const dx = look * 1.3;
  const pupils = (rr) => {
    fills.push(dot(-ex + dx, ey, rr), dot(ex + dx, ey, rr));
    glints.push(dot(-ex + dx - 0.5, ey - 0.6, 0.5), dot(ex + dx - 0.5, ey - 0.6, 0.5));
  };
  if (mood === 'asleep') {
    fine.push(`M${-ex - 3} ${ey - 0.5}q3 2.8 6 0M${ex - 3} ${ey - 0.5}q3 2.8 6 0`, `M${-w * 0.6} ${my}q${w * 0.6} 2.6 ${w * 1.2} 0`);
  } else if (mood === 'smile') {
    fine.push(`M${-ex - 3} ${ey + 1}q3 -3.4 6 0M${ex - 3} ${ey + 1}q3 -3.4 6 0`, `M${-w} ${my - 0.5}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'cross') {
    pupils(r);
    fine.push(`M${-ex - 3.5} ${ey - 5.5}L${-ex + 3} ${ey - 3}M${ex + 3.5} ${ey - 5.5}L${ex - 3} ${ey - 3}`);
    fine.push(`M${-w * 0.8} ${my + 1.6}q${w * 0.8} -3 ${w * 1.6} 0`);
  } else if (mood === 'worried' || mood === 'wow') {
    const rw = 3;
    whites.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    fine.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    fills.push(dot(-ex + dx, ey, 1.4), dot(ex + dx, ey, 1.4));
    if (mood === 'worried') {
      fine.push(`M${-ex - 4} ${ey - 5}l7 -2.4M${ex + 4} ${ey - 5}l-7 -2.4`);
      fine.push(`M${-w + 1} ${my + 1}q${(w - 1) / 2} -2.5 ${w - 1} 0q${(w - 1) / 2} 2.5 ${w - 1} 0`);
    } else {
      fine.push(`M${-ex - 3} ${ey - 6}q3 -2.4 6 0M${ex - 3} ${ey - 6}q3 -2.4 6 0`);
      const o = oval(0, my + 2, 2.2, 2.8);
      fine.push(o);
      washes.push(W(PAL.red, 0.8, o));
    }
  } else {
    pupils(r);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

const nose = 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6';
const cheeks = (x = 8, y = 5, r = 2.4, o = 0.7) => W(PAL.rose, o, dot(-x, y, r) + dot(x, y, r));

// =============================================================================================
// THE PRINCESS: long ochre hair falling past her shoulders, a small ochre crown with a red jewel, a
// rose dress with a red sash and puffed sleeves. Head at P_HEAD; shoulders at (±13, -81).
//  hair: 'long' (standing / sitting up) or 'spread' (lying down: the hair fanned on the pillow).
// =============================================================================================
export const P_HEAD = [0, -100];
export const P_ARMS = {
  down: [
    [[-13, -80, 6.5], [-18, -68, 6], [-21, -56, 6], [-21, -50, 6]],
    [[13, -80, 6.5], [18, -68, 6], [21, -56, 6], [21, -50, 6]],
  ],
  lap: [
    [[-13, -80, 6.5], [-19, -68, 6], [-12, -58, 6], [-5, -56, 6]],
    [[13, -80, 6.5], [19, -68, 6], [12, -58, 6], [5, -56, 6]],
  ],
  // reaching out to the right (towards the spindle)
  reach: [
    [[-13, -80, 6.5], [-18, -68, 6], [-21, -56, 6], [-21, -50, 6]],
    [[13, -80, 6.5], [26, -76, 6], [38, -72, 6], [46, -72, 6]],
  ],
  // both hands held out in front, to the right (sitting up, to the prince)
  hold: [
    [[-13, -80, 6.5], [-14, -66, 6], [-2, -60, 6], [10, -62, 6]],
    [[13, -80, 6.5], [24, -72, 6], [36, -68, 6], [44, -70, 6]],
  ],
};
export function princessHead({ mood = 'happy', look = 0, hair = 'long' } = {}) {
  const face = 'M-12 -2C-12.4 9 -6.5 14 0 14C6.5 14 12.4 9 12 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -12 -2Z`;
  const top = 'M-13 1C-15 -13 -8 -20 0 -20C8 -20 15 -13 13 1C11 -6 6 -9 0 -7C-5 -9 -11 -6 -13 1Z';
  const crown = 'M-8 -18L-9.5 -29L-4.5 -23.5L0 -31L4.5 -23.5L9.5 -29L8 -18C3 -20 -3 -20 -8 -18Z';
  const m = faceMarks({ mood, look });
  const locks =
    hair === 'long'
      ? 'M13 -1C16 9 18 21 21 31C16 34 11 33 7 29C10 23 11 17 11 8ZM-13 -1C-16 9 -18 21 -21 31C-16 34 -11 33 -7 29C-10 23 -11 17 -11 8Z'
      : 'M12 -2C18 1 24 4 29 10C23 14 16 13 11 8ZM-12 -2C-18 1 -24 4 -29 10C-23 14 -16 13 -11 8Z';
  const strands = hair === 'long' ? 'M15 8q2 10 3 18M-15 8q-2 10 -3 18' : 'M15 4q6 3 10 6M-15 4q-6 3 -10 6';
  return {
    lines: [face, top, locks],
    fine: [crown, strands, 'M-4 -14q2 3 1 6M3 -15q1 3 0 6', nose, ...m.fine],
    washes: [
      W(PAL.rose, 0.3, faceFill),
      W(PAL.ochre, 0.9, `${top}${locks}`),
      W(PAL.ochre, 1, crown),
      W(PAL.red, 0.9, dot(0, -22.5, 1.5)),
      cheeks(),
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, dot(-5, -24, 0.9)],
  };
}

const P_BODICE = 'M-8 -85C-13 -84 -14 -78 -14 -70C-14 -64 -14 -60 -15 -56';
const P_BODICE_R = 'C14 -60 14 -64 14 -70C14 -78 13 -84 8 -85';
function princessBody({ arms, upper = false }) {
  const parts = [];
  const sash = 'M-14.5 -61C-5 -58 5 -58 14.5 -61L15 -56C5 -53 -5 -53 -15 -56Z';
  const neck = 'M-8 -85C-4 -81 4 -81 8 -85';
  const sleeves = `${oval(-14, -80, 6, 5)}${oval(14, -80, 6, 5)}`;
  if (upper) {
    // only the bodice, down to the waist (y = -50): the rest is under the blanket
    const body = 'M-8 -85C-13 -84 -14 -78 -14 -70C-14 -64 -14 -60 -15 -56L-17 -50M17 -50L15 -56C14 -60 14 -64 14 -70C14 -78 13 -84 8 -85';
    const fill = 'M-8 -85C-13 -84 -14 -78 -14 -70C-14 -64 -14 -60 -15 -56L-17 -50L17 -50L15 -56C14 -60 14 -64 14 -70C14 -78 13 -84 8 -85Z';
    parts.push({ lines: [body], fine: [neck, sash], washes: [W(PAL.rose, 0.85, fill), W(PAL.red, 0.55, sash)] });
  } else {
    const dress = `${P_BODICE}C-23 -44 -33 -24 -38 -5C-14 1 14 1 38 -5C33 -24 23 -44 15 -56${P_BODICE_R}`;
    const shoes = `${oval(-9, 0, 5, 2.6)}${oval(9, 0, 5, 2.6)}`;
    parts.push({ lines: [shoes], washes: [W(PAL.slate, 0.8, shoes)] });
    parts.push({
      lines: [dress],
      fine: [neck, sash, 'M-8 -50q-6 20 -14 42M0 -50l0 44M8 -50q6 20 14 42'],
      washes: [W(PAL.rose, 0.85, Z(dress)), W(PAL.red, 0.55, sash)],
    });
  }
  parts.push({ lines: [sleeves], washes: [W(PAL.rose, 0.9, sleeves)] });
  for (const a of arms) parts.push(arm(a, [W(PAL.rose, 0.45)], 4));
  return merge(...parts);
}
export function princess({ mood = 'happy', look = 0, arms = P_ARMS.down, upper = false, hair = 'long' } = {}) {
  return merge(princessBody({ arms, upper }), place(princessHead({ mood, look, hair }), `translate(${P_HEAD[0]} ${P_HEAD[1]})`));
}

/**
 * The princess lying asleep on her back on top of a bed, seen from the side: the mattress top is
 * y = 0, her head (asleep, hair spread on the pillow) at (0, -16), her feet at x = 136, the skirt
 * falling softly over the front of the mattress down to y = 14.
 */
export function princessLying() {
  const dress = 'M11 -6C22 -14 38 -14 48 -9C70 -14 100 -22 122 -26C128 -16 130 0 127 13C100 15 70 14 30 4L14 2C10 0 9 -3 11 -6Z';
  const sash = 'M38 -11.5L44 -10L44 6L38 4.5Z';
  const folds = 'M116 -24C120 -12 122 0 120 13M62 -9q16 -2 26 -8M64 3q20 2 40 -2';
  const sleeve = oval(18, -8, 6, 5);
  const shoes = `${oval(136, -6, 2.6, 5)}${oval(136, 4, 2.6, 5)}`;
  const armD = arm([[18, -10, 6], [30, -14, 6], [42, -16, 6], [52, -14, 6]], [W(PAL.rose, 0.45)], 4);
  return merge(
    { lines: [shoes], fine: ['M127 -6L133 -6M127 4L133 4'], washes: [W(PAL.slate, 0.8, shoes)] },
    { lines: [dress], fine: [sash, folds], washes: [W(PAL.rose, 0.85, dress), W(PAL.red, 0.55, sash)] },
    { lines: [sleeve], washes: [W(PAL.rose, 0.9, sleeve)] },
    armD,
    place(princessHead({ mood: 'asleep', hair: 'spread' }), 'translate(0 -16) rotate(-18)'),
  );
}

// =============================================================================================
// FAIRIES: small (about 100 tall, feet at 0, they float), pale sky wings, a dress with a petal hem,
// hair in a topknot, a wand with an ochre star. who: 'young' (green dress, terracotta hair),
// 'sky' (sky dress, grey hair), 'gold' (ochre dress, slate hair). wand: [x, y] of the wand hand.
// =============================================================================================
export const F_HEAD = [0, -78];
const FAIRY = {
  young: { dress: PAL.green, hair: PAL.terracotta },
  sky: { dress: PAL.sky, hair: PAL.grey },
  gold: { dress: PAL.ochre, hair: PAL.slate },
};
export function fairyHead({ who = 'young', mood = 'happy', look = 0 } = {}) {
  const c = FAIRY[who];
  const face = 'M-10 -1C-10.3 8 -5.5 12 0 12C5.5 12 10.3 8 10 -1';
  const faceFill = `${face}C8 -6 4 -8 0 -6C-4 -8 -8 -6 -10 -1Z`;
  const top = 'M-11 1C-12 -10 -7 -16 0 -16C7 -16 12 -10 11 1C9 -5 5 -7 0 -6C-4 -7 -9 -5 -11 1Z';
  const knot = 'M-5 -15C-7 -21 -3 -25 1 -24C6 -23 7 -18 4 -15';
  const m = faceMarks({ mood, look, ex: 4, ey: 1, my: 7, w: 3, r: 1.5 });
  return {
    lines: [face, top, knot],
    fine: ['M-3 -11q2 3 1 5', 'M0.4 3.4c1.3 1 1.3 2 -0.4 2.3', ...m.fine],
    washes: [W(PAL.rose, 0.3, faceFill), W(c.hair, 0.9, `${top}${Z(knot)}`), cheeks(7, 5.5, 2, 0.65), ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}
export const F_ARMS = {
  down: [
    [[-10, -62, 5], [-14, -52, 4.6], [-16, -42, 4.6]],
    [[10, -62, 5], [14, -52, 4.6], [16, -42, 4.6]],
  ],
  wandOut: [
    [[-10, -62, 5], [-14, -52, 4.6], [-16, -42, 4.6]],
    [[10, -62, 5], [22, -60, 4.6], [34, -58, 4.6]],
  ],
  wandUp: [
    [[-10, -62, 5], [-14, -52, 4.6], [-16, -42, 4.6]],
    [[10, -62, 5], [20, -70, 4.6], [26, -82, 4.6]],
  ],
};
export function fairy({ who = 'young', mood = 'happy', look = 0, arms = F_ARMS.wandOut, wandTo = null } = {}) {
  const c = FAIRY[who];
  const parts = [];
  const wingL = 'M-4 -64C-10 -88 -34 -96 -38 -80C-42 -68 -24 -62 -6 -60ZM-6 -54C-18 -54 -26 -46 -22 -40C-18 -36 -10 -44 -6 -50Z';
  const wingR = 'M4 -64C10 -88 34 -96 38 -80C42 -68 24 -62 6 -60ZM6 -54C18 -54 26 -46 22 -40C18 -36 10 -44 6 -50Z';
  parts.push({ lines: [wingL, wingR], fine: ['M-8 -66q-12 -14 -24 -14M8 -66q12 -14 24 -14'], washes: [W(PAL.sky, 0.4, wingL + wingR)] });
  const legs = [limb([[-5, -12, 4.2], [-6, -5, 3.8], [-7, 0, 3.4]]), limb([[5, -12, 4.2], [6, -5, 3.8], [7, 0, 3.4]])];
  parts.push({ lines: legs, washes: legs.map((d) => W(PAL.rose, 0.4, Z(d))) });
  const dress =
    'M-6 -65C-10 -64 -11 -59 -11 -53L-12 -44C-18 -36 -25 -24 -29 -12L-22 -8L-15 -12L-8 -6L0 -11L8 -6L15 -12L22 -8L29 -12C25 -24 18 -36 12 -44L11 -53C11 -59 10 -64 6 -65';
  const neck = 'M-6 -65C-3 -62 3 -62 6 -65';
  parts.push({ lines: [dress], fine: [neck, 'M-11 -47C-4 -45 4 -45 11 -47', 'M-5 -40q-4 12 -10 24M5 -40q4 12 10 24'], washes: [W(c.dress, 0.85, Z(dress))] });
  for (const a of arms) parts.push(arm(a, [W(c.dress, 0.5)], 3.4));
  // the wand, from the second hand towards wandTo (or straight on)
  const [hx, hy] = arms[1][arms[1].length - 1];
  const [px, py] = arms[1][arms[1].length - 2];
  let [tx, ty] = wandTo ?? [hx + (hx - px) * 2.2, hy + (hy - py) * 2.2];
  const l = Math.hypot(tx - hx, ty - hy);
  [tx, ty] = [hx + ((tx - hx) * 26) / l, hy + ((ty - hy) * 26) / l];
  const star = star5(tx, ty, 6);
  parts.push({ lines: [`M${f(hx)} ${f(hy)}L${f(tx)} ${f(ty)}`], fine: [star], washes: [W(PAL.ochre, 1, star)] });
  parts.push(place(fairyHead({ who, mood, look }), `translate(${F_HEAD[0]} ${F_HEAD[1]})`));
  return merge(...parts);
}
/** Where the wand star of a fairy lies (same rule as fairy()). */
export function wandTip(arms = F_ARMS.wandOut, wandTo = null) {
  const [hx, hy] = arms[1][arms[1].length - 1];
  const [px, py] = arms[1][arms[1].length - 2];
  const [tx, ty] = wandTo ?? [hx + (hx - px) * 2.2, hy + (hy - py) * 2.2];
  const l = Math.hypot(tx - hx, ty - hy);
  return [hx + ((tx - hx) * 26) / l, hy + ((ty - hy) * 26) / l];
}

/**
 * The youngest fairy peeping round the left edge of something at x = 0 (a curtain): half her face,
 * one eye, her topknot, one wing tip and a hand holding the edge. Everything stays at x <= 0.
 */
export function fairyPeek() {
  const c = FAIRY.young;
  const face = 'M0 -9.5C-3 -11 -7 -11.5 -10 -9.5C-15 -6 -17 0 -16 4C-14 10 -8 12 -3 11.5C-1.5 11.3 -0.5 11 0 10.6';
  const top = 'M0 -13C-6 -18 -14 -16 -17 -8C-17.5 -4 -17 1 -16 3C-14 -4 -9 -7 -4 -7C-2 -6.6 -1 -6.6 0 -6.8';
  const knot = 'M-12 -15C-14 -21 -9 -25 -5 -24C-2 -23 -1 -19 -3 -15.6';
  const wing = 'M-4 -22C-10 -36 -26 -40 -28 -31C-30 -23 -16 -20 -6 -20';
  const hand = dot(-2, 20, 3.6);
  const m = place(faceMarks({ mood: 'wow', ex: 4, ey: 1, my: 5, w: 3 }), 'translate(-7 0)');
  return merge(m, {
    lines: [face, top, knot, wing],
    fine: [hand],
    washes: [
      W(PAL.rose, 0.3, `${face}Z`),
      W(c.hair, 0.9, `${top}Z${knot}Z`),
      W(PAL.sky, 0.4, `${wing}Z`),
      W(PAL.rose, 0.7, dot(-14, 6, 2)),
      W(PAL.rose, 0.55, hand),
    ],
  });
}

// =============================================================================================
// THE CROSS OLD FAIRY: tall, in a dark slate hooded cloak down to the ground, grey wisps of hair,
// a long nose, cross brows and a pout (grumpy, not frightening). Points to the right with a long
// finger (point: true, or an angle in degrees to point lower) or keeps her hands in her sleeves. A crooked walking stick in her left hand.
// =============================================================================================
export const O_HAND = [64, -92];
export function oldFairy({ point = true } = {}) {
  const cloak =
    'M0 -134C-15 -134 -22 -122 -22 -106C-23 -90 -26 -70 -30 -42C-34 -22 -40 -8 -44 0L44 0C40 -8 34 -22 30 -42C26 -70 23 -90 22 -106C22 -122 15 -134 0 -134Z';
  const faceHole = 'M-12 -108C-12 -118 -6 -122 0 -122C6 -122 12 -118 12 -108C12 -97 7 -90 0 -90C-7 -90 -12 -97 -12 -108Z';
  const hair = 'M-12 -110C-14 -104 -15 -98 -13 -94M12 -110C14 -104 15 -98 13 -94M-9 -118q4 -2 8 0q4 -2 8 0';
  const nose = 'M0.5 -106C3 -103 7 -100 8 -98.5C6 -96.8 3 -97.4 1 -98.6';
  const folds = 'M-10 -86q-6 40 -18 80M8 -86q4 40 14 80M-2 -60l0 56';
  const face = faceMarks({ mood: 'cross', ex: 4.6, ey: -109, my: -97, w: 3, r: 1.5 });
  const parts = [
    {
      lines: [cloak, faceHole],
      fine: [hair, nose, folds, ...face.fine.slice(0, 1), 'M-3.5 -93.5q3 -2.6 6 0'],
      washes: [{ ...W(PAL.slate, 0.95, cloak + faceHole), rule: 'evenodd' }, { ...W(PAL.slate, 0.35, cloak + faceHole), rule: 'evenodd' }, W(PAL.rose, 0.4, faceHole), W(PAL.grey, 0.9, 'M-12 -110C-14 -104 -15 -98 -13 -94L-11 -100ZM12 -110C14 -104 15 -98 13 -94L11 -100Z'), W(PAL.rose, 0.8, dot(-7, -102, 2) + dot(8, -102, 2))],
      fills: face.fills,
      glints: face.glints,
    },
  ];
  // the walking stick, left
  const stick = 'M-30 -70C-34 -86 -40 -90 -36 -98C-32 -104 -26 -100 -28 -94M-30 -70L-34 0';
  parts.push({ lines: [stick], washes: [W(PAL.terracotta, 0.6, limb([[-30, -70, 3], [-34, 0, 3]]))] });
  const hand = dot(-31, -66, 4);
  parts.push({ lines: [hand], washes: [W(PAL.rose, 0.55, hand)] });
  if (point) {
    // a wide sleeve out to the right, a bony hand and one long finger
    const sleeve = 'M14 -96C28 -100 40 -102 50 -100L52 -88C42 -88 30 -86 18 -80';
    const handR = 'M50 -99C55 -101 58 -98 59 -95L74 -95C76 -94 76 -92 74 -91L58 -90C56 -86 52 -86 51 -88';
    parts.push(
      place(
        {
          lines: [sleeve, handR],
          fine: ['M56 -91q2 2 0 4'],
          washes: [W(PAL.slate, 0.95, Z(sleeve)), W(PAL.rose, 0.55, Z(handR))],
        },
        `rotate(${point === true ? 0 : point} 16 -90)`,
      ),
    );
  }
  return merge(...parts);
}

// =============================================================================================
// THE KING: about 140 tall, a big ochre crown, a grey beard, a long red robe with a white
// ermine front edged in ink dots. Head at K_HEAD; shoulders at (±16, -92).
// =============================================================================================
export const K_HEAD = [0, -110];
export const K_ARMS = {
  down: [
    [[-16, -92, 9], [-22, -76, 8], [-25, -60, 8], [-24, -54, 8]],
    [[16, -92, 9], [22, -76, 8], [25, -60, 8], [24, -54, 8]],
  ],
  order: [
    [[-16, -92, 9], [-22, -76, 8], [-25, -60, 8], [-24, -54, 8]],
    [[16, -92, 9], [30, -96, 8], [42, -104, 8], [50, -112, 8]],
  ],
};
export function king({ mood = 'happy', look = 0, arms = K_ARMS.down } = {}) {
  const robe = 'M-12 -98C-22 -96 -27 -88 -28 -76C-32 -52 -40 -26 -44 -2C-14 3 14 3 44 -2C40 -26 32 -52 28 -76C27 -88 22 -96 12 -98';
  const ermine = 'M-6 -96L-8 -1L8 -1L6 -96Z';
  const hem = 'M-43 -8C-14 -3 14 -3 43 -8L44 -2C14 3 -14 3 -44 -2Z';
  const spots = [[0, -80], [-2, -60], [2, -40], [-1, -20], [-30, -4], [-14, -1.5], [16, -1.5], [32, -4]].map(([x, y]) => dot(x, y, 1.1)).join('');
  const parts = [
    {
      lines: [robe],
      fine: [ermine, hem, 'M-16 -70q-8 30 -18 62M16 -70q8 30 18 62'],
      washes: [W(PAL.red, 0.8, Z(robe))],
      whites: [ermine + hem],
      fills: [spots],
    },
  ];
  for (const a of arms) parts.push(arm(a, [W(PAL.red, 0.75)], 4.6));
  const face = 'M-13 -2C-13 8 -7 14 0 14C7 14 13 8 13 -2C13 -12 7 -16 0 -16C-7 -16 -13 -12 -13 -2Z';
  const beard = 'M-13 0C-15 14 -8 28 0 30C8 28 15 14 13 0C10 8 6 10 0 10C-6 10 -10 8 -13 0Z';
  const moust = 'M0 6C-4 3 -9 4 -10 8C-6 7 -3 8 0 7C3 8 6 7 10 8C9 4 4 3 0 6Z';
  const crown = 'M-12 -12L-14 -32L-7 -23L0 -35L7 -23L14 -32L12 -12C5 -15 -5 -15 -12 -12Z';
  const m = faceMarks({ mood, look, ex: 5, ey: -2, my: 6, w: 3 });
  const head = {
    lines: [face, beard, crown],
    fine: [moust, 'M-6 16q-1 6 0 10M6 16q1 6 0 10M0 18l0 8', 'M0.5 0.4c1.6 1.1 1.6 2.3 -0.5 2.6', ...m.fine.slice(0, 1)],
    washes: [W(PAL.rose, 0.35, face), W(PAL.grey, 0.75, beard + moust), W(PAL.ochre, 1, crown), W(PAL.red, 0.9, dot(0, -19, 1.8)), cheeks(8.5, 3, 2.4, 0.7)],
    fills: m.fills,
    glints: [...m.glints, dot(-7, -24, 0.9), dot(6, -26, 0.9)],
  };
  parts.push(place(head, `translate(${K_HEAD[0]} ${K_HEAD[1]})`));
  return merge(...parts);
}

// =============================================================================================
// THE CRADLE with the baby princess: a wooden cradle on rockers with a hood at the left, a rose
// blanket, the baby's round head on a little pillow with a curl of ochre hair. About 86 wide.
// =============================================================================================
export function cradle({ mood = 'asleep' } = {}) {
  const body = 'M-36 -40L-32 -10L32 -10L36 -40';
  const rim = 'M-38 -42L38 -42L38 -38L-38 -38Z';
  const hood = 'M-38 -40C-40 -62 -28 -70 -16 -66C-14 -58 -14 -48 -16 -40';
  const rockers = 'M-44 -6C-20 4 20 4 44 -6L44 -2C20 8 -20 8 -44 -2Z';
  const posts = 'M-26 -10L-28 -2M26 -10L28 -2';
  const blanket = 'M2 -42C8 -48 22 -50 34 -45L36 -40L2 -40Z';
  const headD = 'M-16 -48C-16 -56 -10 -60 -4 -60C3 -60 8 -56 8 -48C8 -42 3 -38 -4 -38C-10 -38 -16 -42 -16 -48Z';
  const m = place(faceMarks({ mood, ex: 3.6, ey: -49, my: -44, w: 2.2, r: 1.2 }), 'translate(-4 0)');
  const curl = 'M-6 -59c-1 -4 4 -5 4 -1';
  return merge(m, {
    lines: [body, rim, hood, rockers, posts, headD, blanket],
    fine: [curl, 'M-28 -30l56 0M-30 -20l60 0', 'M12 -44q8 -3 16 -2'],
    washes: [
      W(PAL.ochre, 0.6, Z(body) + rim + Z(hood) + rockers),
      W(PAL.terracotta, 0.25, Z(hood)),
      W(PAL.rose, 0.85, blanket),
      W(PAL.rose, 0.35, headD),
      W(PAL.ochre, 0.9, `${curl}Z`),
      W(PAL.rose, 0.7, dot(-10, -45, 1.6) + dot(2, -45, 1.6)),
    ],
  });
}

// =============================================================================================
// THE OLD SPINNING WOMAN: round and kind, grey hair in a bun, a terracotta shawl, a grey dress,
// a white apron. sit: on a stool (seat at y = -30). Head at S_HEAD (sitting: lower by 26).
// =============================================================================================
export const S_HEAD = [0, -92];
export function oldWomanHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-12 -2C-12 9 -6.5 14 0 14C6.5 14 12 9 12 -2C12 -11 7 -15 0 -15C-7 -15 -12 -11 -12 -2Z';
  const hair = 'M-12 -2C-14 -12 -8 -18 0 -18C8 -18 14 -12 12 -2C10 -8 6 -11 0 -10C-6 -11 -10 -8 -12 -2Z';
  const bun = 'M-6 -17C-8 -24 -3 -27 1 -26.5C6 -26 8 -22 5 -17';
  const m = faceMarks({ mood, look, ex: 4.6, ey: 0, my: 7.5, w: 3.4, r: 1.6 });
  return {
    lines: [face, hair, bun],
    fine: ['M-10 4q-2 1 -2 3M10 4q2 1 2 3', 'M-8 -6q2 -1 3 0M5 -6q2 -1 3 0', nose, ...m.fine],
    washes: [W(PAL.rose, 0.35, face), W(PAL.grey, 0.85, hair + Z(bun)), cheeks(8, 5, 2.4, 0.75), ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}
export const S_ARMS = {
  spin: [
    // left hand up, drawing the thread from the distaff; right hand out, the spindle hanging from it
    [[-14, -76, 7], [-24, -78, 6.5], [-30, -90, 6.5], [-30, -98, 6.5]],
    [[14, -76, 7], [24, -70, 6.5], [34, -68, 6.5], [40, -70, 6.5]],
  ],
  cheeks: [
    [[-14, -76, 7], [-22, -70, 6.5], [-16, -84, 6.5], [-12, -88, 6.5]],
    [[14, -76, 7], [22, -70, 6.5], [16, -84, 6.5], [12, -88, 6.5]],
  ],
};
export function oldWoman({ mood = 'happy', look = 0, arms = S_ARMS.spin, sit = false } = {}) {
  const dy = sit ? 26 : 0;
  const parts = [];
  const shift = (pts) => pts.map(([x, y, w]) => [x, y + dy, w]);
  const T = `translate(0 ${dy})`;
  if (sit) {
    // sitting on a low stool hidden under her wide skirt: the lap at y = -28, her shoes in front
    const skirt = 'M-18 -28C-30 -26 -36 -16 -38 -4C-12 0 12 0 38 -4C36 -16 30 -26 18 -28';
    const shoes = `${oval(-12, 0, 6, 3)}${oval(12, 0, 6, 3)}`;
    parts.push({ lines: [shoes], washes: [W(PAL.slate, 0.8, shoes)] });
    parts.push({ lines: [skirt], fine: ['M-24 -18q-4 6 -6 12M24 -18q4 6 6 12'], washes: [W(PAL.grey, 0.85, Z(skirt))] });
    const apron = 'M-13 -27C-14 -18 -15 -10 -15 -3C-5 -1 5 -1 15 -3C15 -10 14 -18 13 -27Z';
    parts.push({ lines: [apron], whites: [apron] });
  } else {
    const dress = 'M-18 -54C-24 -40 -30 -20 -34 -3C-12 1 12 1 34 -3C30 -20 24 -40 18 -54';
    const shoes = `${oval(-10, 0, 6, 3)}${oval(10, 0, 6, 3)}`;
    parts.push({ lines: [shoes], washes: [W(PAL.slate, 0.8, shoes)] });
    parts.push({ lines: [dress], fine: ['M-8 -30l-3 26M8 -30l3 26'], washes: [W(PAL.grey, 0.85, Z(dress))] });
    const apron = 'M-14 -52C-16 -36 -18 -18 -18 -8C-6 -5 6 -5 18 -8C18 -18 16 -36 14 -52Z';
    parts.push({ lines: [apron], whites: [apron] });
  }
  // round body with the shawl over the shoulders
  const top = 'M-12 -80C-20 -78 -22 -70 -20 -60C-19 -56 -18 -54 -18 -54L18 -54C18 -54 19 -56 20 -60C22 -70 20 -78 12 -80';
  const shawl = 'M-14 -80C-22 -78 -24 -70 -21 -62C-10 -56 0 -52 0 -50C0 -52 10 -56 21 -62C24 -70 22 -78 14 -80C6 -76 -6 -76 -14 -80Z';
  parts.push(
    place(
      {
        lines: [top, shawl],
        fine: ['M-6 -64l-3 6M6 -64l3 6M0 -54l0 6'],
        washes: [W(PAL.grey, 0.85, Z(top)), W(PAL.terracotta, 0.85, shawl)],
      },
      T,
    ),
  );
  for (const a of arms) parts.push(arm(shift(a), [W(PAL.grey, 0.7)], 4.2));
  parts.push(place(oldWomanHead({ mood, look }), `translate(${S_HEAD[0]} ${S_HEAD[1] + dy})`));
  return merge(...parts);
}

/** A spindle hanging from the thread: thread top at (0,0), the spindle below, about 40 long. */
export function spindle({ thread = 12, spin = true } = {}) {
  const t = thread;
  const shaft = `M0 ${t}L0 ${t + 40}`;
  const wool = `M-5 ${t + 18}C-5 ${t + 10} 5 ${t + 10} 5 ${t + 18}C5 ${t + 26} -5 ${t + 26} -5 ${t + 18}Z`;
  const whorl = `M-7 ${t + 32}L7 ${t + 32}L5 ${t + 36}L-5 ${t + 36}Z`;
  return {
    lines: [shaft, wool, whorl],
    fine: [`M0 0L0 ${t}`, ...(spin ? [`M-12 ${t + 30}q-3 4 0 8M12 ${t + 30}q3 4 0 8`] : [])],
    washes: [W(PAL.ochre, 0.55, wool), W(PAL.terracotta, 0.7, whorl), W(PAL.ochre, 0.4, `M-1.5 ${t}L1.5 ${t}L1.5 ${t + 40}L-1.5 ${t + 40}Z`)],
  };
}
/** The spindle lying on the floor, about 40 long, centre at (0,0). */
export function spindleDown() {
  return place(spindle({ thread: 0, spin: false }), 'rotate(-80) translate(0 -20)');
}

/** A distaff: a tall stick standing on a little foot, with a fluffy bundle of wool at the top. */
export function distaff() {
  const stick = 'M0 0L0 -100M-12 0L12 0';
  const fluff = 'M-8 -100C-14 -104 -14 -116 -6 -118C-6 -126 6 -126 6 -118C14 -116 14 -104 8 -100C4 -96 -4 -96 -8 -100Z';
  return { lines: [stick, fluff], fine: ['M-4 -110q4 3 8 0M-3 -104q3 2 6 0'], washes: [W(PAL.ochre, 0.5, 'M-1.5 0L-1.5 -100L1.5 -100L1.5 0Z'), W(PAL.grey, 0.35, fluff)] };
}

// =============================================================================================
// THE PRINCE: about 125 tall, short terracotta hair, a slate cap with a red feather, a sky tunic
// with an ochre belt, slate leggings and terracotta boots. Head at R_HEAD.
// legs: 'stand', 'walk' (striding to the right) or 'kneel' (kneeling on his right knee, the body
// lower by 26, facing left).
// =============================================================================================
export const R_HEAD = [0, -106];
export const R_ARMS = {
  down: [
    [[-14, -88, 7], [-19, -74, 6.5], [-22, -62, 6.5], [-22, -56, 6.5]],
    [[14, -88, 7], [19, -74, 6.5], [22, -62, 6.5], [22, -56, 6.5]],
  ],
  walk: [
    [[-14, -88, 7], [-22, -76, 6.5], [-30, -66, 6.5], [-34, -60, 6.5]],
    [[14, -88, 7], [20, -74, 6.5], [26, -64, 6.5], [32, -62, 6.5]],
  ],
  reach: [
    [[-14, -88, 7], [-28, -84, 6.5], [-42, -82, 6.5], [-50, -84, 6.5]],
    [[14, -88, 7], [19, -74, 6.5], [20, -62, 6.5], [18, -56, 6.5]],
  ],
};
export function princeHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-12 -2C-12.4 9 -6.5 14 0 14C6.5 14 12.4 9 12 -2';
  const faceFill = `${face}C10 -6 6 -9 0 -7C-5 -9 -10 -6 -12 -2Z`;
  const hair = 'M-13 2C-15 -12 -8 -19 0 -19C8 -19 15 -12 13 2C12 -3 10 -6 7 -6C4 -4 -2 -4 -5 -7C-8 -6 -11 -3 -13 2Z';
  const cap = 'M-14 -12C-14 -24 -2 -28 8 -26C16 -24 18 -18 16 -12C6 -16 -6 -16 -14 -12Z';
  const feather = 'M10 -24C18 -34 28 -38 34 -36C30 -30 20 -26 12 -22Z';
  const m = faceMarks({ mood, look });
  return {
    lines: [face, hair, cap, feather],
    fine: ['M14 -23C20 -29 26 -33 32 -35', 'M-9 -2l-2 6M9 -2l2 6', nose, ...m.fine],
    washes: [W(PAL.rose, 0.3, faceFill), W(PAL.terracotta, 0.85, hair), W(PAL.slate, 0.85, cap), W(PAL.red, 0.85, feather), cheeks(8, 5, 2.2, 0.6), ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}
export function prince({ mood = 'happy', look = 0, arms = R_ARMS.down, legs = 'stand' } = {}) {
  const parts = [];
  const dy = legs === 'kneel' ? 26 : 0;
  const T = `translate(0 ${dy})`;
  const L = {
    stand: [
      [[-7, -40, 8.5], [-8, -20, 7.5], [-8, -6, 7]],
      [[7, -40, 8.5], [8, -20, 7.5], [8, -6, 7]],
    ],
    walk: [
      [[-6, -40, 8.5], [-14, -22, 7.5], [-22, -6, 7]],
      [[6, -40, 8.5], [14, -22, 7.5], [20, -6, 7]],
    ],
    kneel: [
      [[-6, -14, 8.5], [-18, -18, 8], [-28, -20, 7.5], [-28, -10, 7], [-28, -6, 7]],
      [[6, -14, 8.5], [10, -6, 8], [12, -2, 7.5], [26, -2, 7]],
    ],
  }[legs];
  const boots =
    legs === 'kneel'
      ? ['M-34 -9C-34 -13 -22 -13 -22 -9L-22 0L-38 0C-40 -2 -38 -5 -34 -6Z', 'M22 -6L34 -6C36 -6 36 2 34 2L22 2Z']
      : legs === 'walk'
        ? ['M-27 -9L-17 -9L-17 0L-32 0C-34 -3 -31 -6 -27 -6Z', 'M15 -9L25 -9L25 -6C29 -6 33 -3 31 0L15 0Z']
        : ['M-13 -9L-3 -9L-3 0L-17 0C-18 -3 -16 -6 -13 -6Z', 'M3 -9L13 -9L13 -6C16 -6 18 -3 17 0L3 0Z'];
  const legLines = L.map((p) => limb(p));
  parts.push({ lines: legLines, washes: legLines.map((d) => W(PAL.slate, 0.7, Z(d))) });
  parts.push({ lines: boots, washes: boots.map((d) => W(PAL.terracotta, 0.85, d)) });
  const tunic = 'M-8 -92C-14 -91 -16 -86 -16 -78L-17 -58C-19 -52 -21 -46 -22 -38C-8 -35 8 -35 22 -38C21 -46 19 -52 17 -58L16 -78C16 -86 14 -91 8 -92';
  const belt = 'M-16.5 -62C-6 -59 6 -59 16.5 -62L17 -56C6 -53 -6 -53 -17 -56Z';
  const collar = 'M-8 -92C-4 -86 4 -86 8 -92';
  parts.push(
    place(
      {
        lines: [tunic],
        fine: [belt, collar, 'M0 -88l0 26', 'M-6 -52l-3 14M6 -52l3 14', dot(0, -59, 1.6)],
        washes: [W(PAL.sky, 0.95, Z(tunic)), W(PAL.ochre, 0.95, belt)],
      },
      T,
    ),
  );
  for (const a of arms) parts.push(place(arm(a, [W(PAL.sky, 0.8)], 4.2), T));
  parts.push(place(princeHead({ mood, look }), `translate(${R_HEAD[0]} ${R_HEAD[1] + dy})`));
  return merge(...parts);
}

// =============================================================================================
// PROPS
// =============================================================================================

/**
 * A bed seen from the side, standing on y = 0, mattress from -hw to hw (top at y = -40), a tall
 * headboard at the left, a low footboard at the right (foot: false to leave it out).
 * cover: 'sleep' (a blanket pulled up to the pillow, with the bump of a body), 'low' (a blanket
 * up to the waist of someone sitting up at x = sx), 'none' (just a plain mattress cover).
 * quilt: 'sky' (the royal bed) or 'patch' (the old woman's patchwork quilt).
 */
export function bed({ hw = 80, foot = true, cover = 'sleep', sx = -40, quilt = 'sky', gap, pillow } = {}) {
  const h = hw;
  const head = `M${-h - 8} 0L${-h - 8} -90C${-h - 8} -104 ${-h + 12} -104 ${-h + 12} -90L${-h + 12} 0`;
  const knobs = dot(-h - 8, -104, 3.4) + dot(-h + 12, -104, 3.4);
  const footB = `M${h - 4} 0L${h - 4} -60C${h - 4} -68 ${h + 12} -68 ${h + 12} -60L${h + 12} 0`;
  const rail = `M${-h + 12} -26L${h - 4} -26L${h - 4} -16L${-h + 12} -16Z`;
  const mEnd = foot ? h - 4 : h;
  const mattress = `M${-h + 12} -40L${mEnd} -40L${mEnd} -26L${-h + 12} -26Z`;
  // the parts of the mattress's top edge and of the pillow hidden by a blanket or a sleeper
  const [g0, g1] = gap ?? (cover === 'sleep' ? [-h + 40, mEnd] : cover === 'low' ? [sx - 26, mEnd] : [mEnd, mEnd]);
  const mLines = [`M${-h + 12} -40L${g0} -40`, ...(g1 < mEnd ? [`M${g1} -40L${mEnd} -40`] : []), `M${mEnd} -40L${mEnd} -26M${-h + 12} -26L${mEnd} -26`];
  const pillowD = `M${-h + 14} -42C${-h + 12} -54 ${-h + 22} -58 ${-h + 34} -56C${-h + 46} -56 ${-h + 50} -52 ${-h + 48} -44C${-h + 40} -40 ${-h + 24} -40 ${-h + 14} -42Z`;
  const pillowEnd = `M${-h + 24} -57C${-h + 16} -55 ${-h + 12} -50 ${-h + 14} -42C${-h + 17} -40 ${-h + 21} -40 ${-h + 25} -40.6`;
  const full = (pillow ?? (cover === 'none' && g0 >= -h + 48 ? 'full' : 'end')) === 'full';
  const wood = (d) => [W(PAL.ochre, 0.6, d), W(PAL.terracotta, 0.2, d)];
  const parts = [];
  const legs = foot ? '' : `M${h - 6} -16L${h - 6} 0L${h - 12} 0L${h - 12} -16`;
  parts.push({
    lines: [head, rail, ...(foot ? [footB] : [legs])],
    fine: [knobs, `M${-h - 4} -80l12 0M${-h - 4} -30l12 0`],
    washes: [...wood(Z(head) + rail + (foot ? Z(footB) : Z(legs))), W(PAL.ochre, 0.9, knobs)],
  });
  parts.push({ lines: [...mLines, full ? pillowD : pillowEnd], washes: [W(PAL.grey, 0.12, mattress), W(PAL.sky, 0.25, pillowD)] });
  const qc = quilt === 'sky' ? [W(PAL.sky, 0.75)] : [W(PAL.terracotta, 0.55)];
  const end = foot ? h - 2 : h + 4;
  let blanket;
  if (cover === 'sleep') {
    blanket = `M${-h + 44} -52C${-h + 64} -60 ${-h + 92} -60 ${-h + 112} -54C${-h + 132} -50 ${end - 8} -54 ${end - 4} -46C${end} -40 ${end} -32 ${end} -28C${f(h * 0.3)} -25 ${f(-h * 0.2)} -25 ${-h + 38} -28C${-h + 36} -32 ${-h + 38} -44 ${-h + 44} -52Z`;
  } else if (cover === 'low') {
    blanket = `M${sx - 26} -44C${sx - 10} -48 ${sx + 10} -48 ${sx + 26} -46C${sx + 50} -44 ${end - 10} -46 ${end - 4} -42C${end} -36 ${end} -30 ${end} -28C${f(h * 0.3)} -25 ${f(-h * 0.3)} -25 ${-h + 14} -28C${-h + 12} -30 ${-h + 12} -40 ${sx - 26} -44Z`;
  }
  if (blanket) {
    const deco =
      quilt === 'sky'
        ? [[60, -44], [90, -48], [120, -46], [150, -42], [75, -36], [105, -38], [135, -36]].filter(([x]) => -h + x > (cover === 'low' ? sx + 30 : -h + 50) && -h + x < end - 6).map(([x, y]) => dot(-h + x, y, 1.4))
        : [];
    const patches =
      quilt === 'patch'
        ? [W(PAL.ochre, 0.55, `M${-h + 50} -52L${-h + 80} -56L${-h + 80} -28L${-h + 50} -28Z`), W(PAL.green, 0.5, `M${-h + 110} -56L${-h + 140} -50L${-h + 140} -28L${-h + 110} -28Z`)]
        : [];
    parts.push({
      lines: [blanket],
      fine: [
        `M${cover === 'sleep' ? -h + 38 : -h + 14} -31C${f(-h * 0.2)} -28 ${f(h * 0.3)} -28 ${end} -31`,
        ...(quilt === 'patch' ? [`M${-h + 80} -56L${-h + 80} -28M${-h + 110} -56L${-h + 110} -28M${-h + 140} -50L${-h + 140} -28`] : []),
      ],
      washes: [...qc.map((w) => ({ ...w, d: blanket })), ...patches],
      glints: deco,
    });
  }
  return merge(...parts);
}

/** A rose bloom of radius r at (x, y): a red/rose round flower with a curl, and two leaves. */
export function rose(x, y, r = 6, c = PAL.rose, leaves = true) {
  const bloom = `M${f(x - r)} ${f(y)}C${f(x - r)} ${f(y - r * 0.9)} ${f(x - r * 0.3)} ${f(y - r)} ${f(x)} ${f(y - r * 0.85)}C${f(x + r * 0.4)} ${f(y - r * 1.05)} ${f(x + r)} ${f(y - r * 0.8)} ${f(x + r)} ${f(y)}C${f(x + r)} ${f(y + r * 0.8)} ${f(x + r * 0.5)} ${f(y + r)} ${f(x)} ${f(y + r)}C${f(x - r * 0.5)} ${f(y + r)} ${f(x - r)} ${f(y + r * 0.8)} ${f(x - r)} ${f(y)}Z`;
  const curl = `M${f(x - r * 0.4)} ${f(y)}C${f(x - r * 0.4)} ${f(y - r * 0.5)} ${f(x + r * 0.4)} ${f(y - r * 0.5)} ${f(x + r * 0.4)} ${f(y)}C${f(x + r * 0.4)} ${f(y + r * 0.4)} ${f(x - r * 0.1)} ${f(y + r * 0.4)} ${f(x - r * 0.1)} ${f(y + r * 0.05)}`;
  const leaf = leaves
    ? `M${f(x + r * 0.6)} ${f(y + r * 0.8)}q${f(r * 1.1)} ${f(r * 0.1)} ${f(r * 1.5)} ${f(r * 0.9)}q${f(-r * 1)} ${f(r * 0.2)} ${f(-r * 1.5)} ${f(-r * 0.9)}Z`
    : '';
  return {
    lines: [bloom],
    fine: [curl, ...(leaf ? [leaf] : [])],
    washes: [W(c, 0.95, bloom), ...(leaf ? [W(PAL.green, 0.8, leaf)] : [])],
  };
}

/** Thorns: little ink spikes along a list of [x, y, angle] points. */
export const thorns = (pts, len = 5) =>
  pts
    .map(([x, y, a]) => {
      const r = (a * Math.PI) / 180;
      return `M${f(x - Math.sin(r) * 2)} ${f(y + Math.cos(r) * 2)}L${f(x + Math.cos(r) * len)} ${f(y + Math.sin(r) * len)}L${f(x + Math.sin(r) * 2)} ${f(y - Math.cos(r) * 2)}`;
    })
    .join('');

/**
 * A round castle tower standing on y = 0, w wide, h tall to the eaves, with a pointed slate roof, a
 * little arched window and a red pennant. Its top (the roof tip) is at y = -h - w * 0.9 - 20.
 */
export function tower({ w = 50, h = 120, window = true, flag = true, roof = PAL.slate } = {}) {
  const x = w / 2;
  const wall = `M${-x} 0L${-x} ${-h}L${x} ${-h}L${x} 0`;
  const roofD = `M${-x - 6} ${-h}L0 ${f(-h - w * 1.1)}L${x + 6} ${-h}C${x / 2} ${-h + 4} ${-x / 2} ${-h + 4} ${-x - 6} ${-h}Z`;
  const tip = -h - w * 1.1;
  const pole = `M0 ${f(tip)}L0 ${f(tip - 18)}`;
  const pennant = `M0 ${f(tip - 18)}C6 ${f(tip - 20)} 12 ${f(tip - 14)} 18 ${f(tip - 15)}C12 ${f(tip - 10)} 6 ${f(tip - 12)} 0 ${f(tip - 10)}Z`;
  const win = `M-5 ${-h + 40}L-5 ${-h + 26}C-5 ${-h + 18} 5 ${-h + 18} 5 ${-h + 26}L5 ${-h + 40}Z`;
  const stones = `M${-x + 6} ${-h + 60}l10 0M${x - 18} ${-h + 76}l10 0M${-x + 10} ${-h + 96}l12 0M${x - 14} ${-h + 50}l8 0`;
  return {
    lines: [wall, roofD, ...(flag ? [pole, pennant] : []), ...(window ? [win] : [])],
    fine: [stones, `M${-x} ${-h + 8}C${-x / 2} ${-h + 12} ${x / 2} ${-h + 12} ${x} ${-h + 8}`],
    washes: [
      W(PAL.grey, 0.55, `${wall}Z`),
      W(roof, 0.85, roofD),
      ...(flag ? [W(PAL.red, 0.9, pennant)] : []),
      ...(window ? [W(PAL.slate, 0.8, win)] : []),
    ],
  };
}

/** A spinning wheel, standing on y = 0: a big spoked wheel, three legs and the spindle arm. */
export function spinningWheel() {
  const wheel = oval(0, -44, 24, 24);
  const inner = oval(0, -44, 19, 19);
  let spokes = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 6;
    spokes += `M${f(Math.cos(a) * 19)} ${f(-44 + Math.sin(a) * 19)}L${f(-Math.cos(a) * 19)} ${f(-44 - Math.sin(a) * 19)}`;
  }
  const base = 'M-30 -14L36 -14L36 -8L-30 -8Z';
  const legs = 'M-24 -8L-30 0M30 -8L36 0M4 -8L2 0M0 -44L0 -14';
  const armD = 'M30 -14L34 -34L40 -34M34 -34L44 -40';
  return {
    lines: [wheel, base, legs, armD],
    fine: [inner, spokes, dot(0, -44, 2.4)],
    washes: [W(PAL.ochre, 0.55, wheel), W(PAL.terracotta, 0.4, base)],
    whites: [inner],
  };
}

/** Flames, about 2w wide and h tall, standing on y = 0. */
export function flames(w = 60, h = 90) {
  const k = (x, y) => `${f((x * w) / 60)} ${f((y * h) / 90)}`;
  const outer = `M${k(-60, 0)}C${k(-64, -24)} ${k(-50, -40)} ${k(-40, -56)}C${k(-38, -40)} ${k(-30, -36)} ${k(-26, -40)}C${k(-30, -60)} ${k(-14, -78)} ${k(-2, -90)}C${k(0, -70)} ${k(10, -62)} ${k(16, -58)}C${k(18, -70)} ${k(30, -76)} ${k(36, -80)}C${k(34, -60)} ${k(46, -48)} ${k(50, -40)}C${k(54, -46)} ${k(56, -50)} ${k(58, -54)}C${k(66, -36)} ${k(64, -18)} ${k(60, 0)}Z`;
  const inner = `M${k(-36, 0)}C${k(-40, -16)} ${k(-26, -26)} ${k(-18, -36)}C${k(-16, -24)} ${k(-8, -22)} ${k(-4, -24)}C${k(-6, -40)} ${k(4, -50)} ${k(10, -56)}C${k(12, -40)} ${k(24, -30)} ${k(28, -22)}C${k(32, -28)} ${k(34, -30)} ${k(36, -32)}C${k(42, -18)} ${k(40, -8)} ${k(36, 0)}Z`;
  return { lines: [outer], fine: [inner], washes: [W(PAL.terracotta, 0.8, outer), W(PAL.ochre, 0.75, inner)] };
}

/** A curtain hanging from a rod at y = -h, from x = 0 (its left edge) to x = w, gathered at the foot. */
export function curtain({ w = 60, h = 200 } = {}) {
  const rod = `M-8 ${-h}L${w + 8} ${-h}`;
  const cloth = `M0 ${-h}C2 ${-h * 0.6} -4 ${-h * 0.3} 2 0L${w} 0L${w} ${-h}Z`;
  const folds = `M${w * 0.3} ${-h + 4}C${w * 0.32} ${-h * 0.6} ${w * 0.26} ${-h * 0.3} ${w * 0.3} -4M${w * 0.6} ${-h + 4}C${w * 0.62} ${-h * 0.6} ${w * 0.56} ${-h * 0.3} ${w * 0.62} -4`;
  return {
    lines: [rod, cloth],
    fine: [folds, dot(-8, -h, 3), dot(w + 8, -h, 3)],
    washes: [W(PAL.red, 0.6, cloth), W(PAL.ochre, 0.9, dot(-8, -h, 3) + dot(w + 8, -h, 3))],
  };
}

// =============================================================================================
// THE SLEEPING HOUSEHOLD (picture 7)
// =============================================================================================

/** The cook, asleep on a stool (seat at y = -30): round, white apron, tall white hat, grey moustache. */
export function cook() {
  const parts = [];
  const stool = 'M-24 -30L24 -30L24 -24L-24 -24ZM-20 -24L-24 0M20 -24L24 0';
  parts.push({ lines: [stool], washes: [W(PAL.ochre, 0.6, 'M-24 -30L24 -30L24 -24L-24 -24Z')] });
  const legs = [limb([[-10, -30, 10], [-14, -14, 9], [-14, -4, 8]]), limb([[10, -30, 10], [14, -14, 9], [14, -4, 8]])];
  const shoes = `${oval(-16, -1, 7, 3)}${oval(16, -1, 7, 3)}`;
  parts.push({ lines: [...legs, shoes], washes: [...legs.map((d) => W(PAL.slate, 0.7, Z(d))), W(PAL.slate, 0.9, shoes)] });
  const body = 'M-16 -80C-28 -76 -34 -60 -32 -44C-31 -36 -26 -30 -18 -28L18 -28C26 -30 31 -36 32 -44C34 -60 28 -76 16 -80C8 -84 -8 -84 -16 -80Z';
  const apron = 'M-16 -64C-18 -50 -18 -36 -16 -28L16 -28C18 -36 18 -50 16 -64C6 -60 -6 -60 -16 -64Z';
  parts.push({ lines: [body], fine: [apron, 'M-16 -64L-12 -78M16 -64L12 -78'], washes: [W(PAL.sky, 0.7, body)], whites: [apron] });
  // arms folded on the tummy, a ladle in one hand
  const a1 = arm([[-24, -72, 9], [-30, -56, 8], [-16, -46, 8], [-4, -46, 8]], [W(PAL.sky, 0.7)], 4.6);
  const a2 = arm([[24, -72, 9], [30, -56, 8], [18, -48, 8], [6, -48, 8]], [W(PAL.sky, 0.7)], 4.6);
  parts.push(a1, a2);
  const ladle = 'M8 -48L30 -64M30 -64C30 -72 42 -74 44 -66C46 -60 36 -56 30 -64Z';
  parts.push({ lines: [ladle], washes: [W(PAL.grey, 0.7, 'M30 -64C30 -72 42 -74 44 -66C46 -60 36 -56 30 -64Z')] });
  // the head, nodding to one side
  const face = 'M-13 -2C-13 9 -7 15 0 15C7 15 13 9 13 -2C13 -11 7 -15 0 -15C-7 -15 -13 -11 -13 -2Z';
  const hat = 'M-12 -10C-16 -18 -18 -30 -10 -36C-8 -44 8 -44 10 -36C18 -30 16 -18 12 -10C6 -13 -6 -13 -12 -10Z';
  const moust = 'M0 6C-4 3 -10 4 -12 9C-7 8 -3 9 0 8C3 9 7 8 12 9C10 4 4 3 0 6Z';
  const m = faceMarks({ mood: 'asleep', ex: 5, ey: 0, my: 11, w: 2.6 });
  const head = {
    lines: [face, hat],
    fine: [moust, 'M-10 -16C-4 -18 4 -18 10 -16', 'M0.5 1.4c1.6 1.1 1.6 2.3 -0.5 2.6', ...m.fine],
    washes: [W(PAL.rose, 0.4, face), W(PAL.grey, 0.8, moust), cheeks(9, 5, 2.6, 0.8)],
    whites: [hat],
  };
  parts.push(place(head, 'translate(4 -92) rotate(18)'));
  return merge(...parts);
}

/** A brick bread oven standing on y = 0, about 120 wide and 130 tall, its mouth glowing softly. */
export function oven() {
  const shell = 'M-60 0L-60 -70C-60 -110 -30 -130 0 -130C30 -130 60 -110 60 -70L60 0Z';
  const mouth = 'M-26 -30L-26 -56C-26 -74 26 -74 26 -56L26 -30Z';
  const ledge = 'M-34 -30L34 -30L34 -24L-34 -24Z';
  const chimney = 'M-10 -128L-10 -150L10 -150L10 -128';
  const bricks = 'M-50 -10l16 0M-20 -12l14 0M30 -10l18 0M-46 -90l14 0M30 -100l14 0M-10 -112l18 0M40 -60l12 0M-54 -50l12 0';
  const glow = 'M-20 -32C-20 -44 -10 -48 0 -46C10 -48 20 -44 20 -32Z';
  return {
    lines: [shell, mouth, ledge, chimney],
    fine: [bricks, 'M-14 -34c2 -6 6 -6 8 0M2 -36c2 -6 6 -6 8 0'],
    washes: [W(PAL.terracotta, 0.6, shell + Z(chimney)), W(PAL.slate, 0.75, mouth), W(PAL.ochre, 0.9, glow), W(PAL.red, 0.35, glow), W(PAL.grey, 0.5, ledge)],
  };
}

/** The dog, curled up asleep, lying on y = 0, about 70 long, head at the left resting on its paws. */
export function dogAsleep() {
  const body = 'M-14 -2C-16 -20 0 -30 18 -28C34 -26 42 -16 40 -4C39 0 34 2 26 2L-10 2C-13 2 -14 0 -14 -2Z';
  const head = oval(-24, -11, 13, 10);
  const snout = 'M-35 -14C-42 -13 -47 -8 -45 -3C-43 1 -36 1 -31 -1';
  const ear = 'M-24 -20C-16 -22 -12 -14 -14 -5C-15 -1 -20 -1 -20 -5C-20 -11 -22 -16 -24 -20Z';
  const paws = 'M-44 1C-46 4 -36 6 -26 4M-22 2C-24 5 -14 6 -8 3';
  const hind = 'M18 -4C22 -14 36 -14 38 -4';
  const tail = 'M40 -8C48 -12 50 -2 44 1C38 3 32 0 30 2';
  return {
    lines: [body, head, snout, ear, tail],
    fine: [paws, hind, 'M-33 -13q3 2.4 6 0', 'M2 -24q8 -3 16 -1'],
    washes: [W(PAL.ochre, 0.7, body + head + Z(snout)), W(PAL.terracotta, 0.85, ear), W(PAL.terracotta, 0.35, 'M6 -26C14 -30 26 -28 30 -22C22 -20 12 -20 6 -26Z'), W(PAL.ochre, 0.5, `${tail}Z`)],
    fills: [dot(-45, -6, 1.8)],
  };
}

/** The cat, curled up asleep in a ball, lying on y = 0, about 46 wide, head at the right. */
export function catAsleep() {
  const body = 'M-22 -2C-26 -16 -14 -28 2 -28C16 -28 24 -18 22 -6C21 0 14 2 4 2L-16 2C-20 2 -22 0 -22 -2Z';
  const head = 'M6 -10C6 -20 14 -24 22 -22C30 -20 32 -12 28 -5C25 0 18 1 12 0C8 -2 6 -5 6 -10Z';
  const ears = 'M10 -18L10 -27L16 -21M22 -22L28 -28L28 -18';
  const tail = 'M-22 -2C-20 6 4 8 12 2';
  return {
    lines: [body, head, ears, tail],
    fine: ['M12 -11q3 2.4 6 0M20 -11q3 2.4 6 0', 'M18 -6l0 1', 'M-10 -24q4 6 0 12M-2 -26q4 6 0 12', 'M30 -8l8 -1M30 -5l8 1'],
    washes: [W(PAL.grey, 0.85, body + head + `${ears}Z`), W(PAL.slate, 0.3, 'M-10 -24q4 6 0 12L-2 -14q4 -6 -2 -12Z'), W(PAL.grey, 0.7, `${tail}Z`), W(PAL.rose, 0.7, dot(17.5, -6, 1))],
  };
}

/** A cushion (red with ochre tassels) lying on y = 0, about 70 wide. */
export function cushion() {
  const d = 'M-34 0C-38 -6 -38 -14 -32 -18C-10 -22 10 -22 32 -18C38 -14 38 -6 34 0C10 3 -10 3 -34 0Z';
  const edge = 'M-32 -18C-38 -14 -38 -6 -34 0C-10 3 10 3 34 0C38 -6 38 -14 32 -18';
  const tassels = 'M-34 -18l-6 -4M-34 0l-6 3M34 -18l6 -4M34 0l6 3';
  return { lines: [edge], fine: [tassels, 'M-28 -6c10 2 46 2 56 0'], washes: [W(PAL.red, 0.7, d), W(PAL.ochre, 0.9, dot(-40, -22, 2) + dot(-40, 3, 2) + dot(40, -22, 2) + dot(40, 3, 2))] };
}

/** An oval rug lying flat on y = 0, about 2w wide, with a fringe; its far edge is left out
 * between gap[0] and gap[1] (hidden behind whoever lies on it). */
export function rug(w = 60, gap = [-46, 44]) {
  const front = `M${-w} 0C${-w} 9 ${-w * 0.5} 12 0 12C${w * 0.5} 12 ${w} 9 ${w} 0`;
  const backL = `M${-w} 0C${-w} -5 ${f(gap[0] - 10)} -9 ${gap[0]} -10`;
  const backR = `M${w} 0C${w} -5 ${f(gap[1] + 10)} -9 ${gap[1]} -10`;
  return {
    lines: [front, backL, backR],
    fine: [`M${-w + 12} 6C${-w * 0.4} 10 ${w * 0.4} 10 ${w - 12} 6`, `M${-w} -2l-6 0M${-w} 2l-6 1M${w} -2l6 0M${w} 2l6 1`],
    washes: [W(PAL.green, 0.55, `${front}L${gap[1]} 1L${gap[0]} 1Z${backL}L${gap[0]} 1L${-w} 1Z${backR}L${gap[1]} 1L${w} 1Z`), W(PAL.ochre, 0.45, `M${-w + 12} 6C${-w * 0.4} 10 ${w * 0.4} 10 ${w - 12} 6C${w * 0.4} 4 ${-w * 0.4} 4 ${-w + 12} 6Z`)],
  };
}
