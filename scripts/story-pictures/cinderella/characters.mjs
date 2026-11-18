import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Cinderella: the characters and props shared by the ten pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. Standing characters have their feet at y = 0 and face us; their eyes look left or
// right (look). Sitting characters sit on a flat seat at y = 0.

export { at, compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;

/** A five-pointed star of radius r, centre (x, y). */
export function star5(x, y, r) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const k = i % 2 ? r * 0.45 : r;
    d += `${i ? 'L' : 'M'}${f(x + Math.cos(a) * k)} ${f(y + Math.sin(a) * k)}`;
  }
  return `${d}Z`;
}

/** A twinkle: a little four-ray cross (ink) of size s at (x, y). */
export const twinkle = (x, y, s = 6) =>
  `M${f(x - s)} ${f(y)}L${f(x + s)} ${f(y)}M${f(x)} ${f(y - s)}L${f(x)} ${f(y + s)}M${f(x - s * 0.45)} ${f(y - s * 0.45)}L${f(x + s * 0.45)} ${f(y + s * 0.45)}M${f(x + s * 0.45)} ${f(y - s * 0.45)}L${f(x - s * 0.45)} ${f(y + s * 0.45)}`;

/** Sparkles: twinkles (ink) with a paper glint and a pale sky halo at each point [x, y, s]. */
export function sparkles(points) {
  return {
    fine: points.map(([x, y, s]) => twinkle(x, y, s)),
    washes: [{ c: PAL.sky, o: 0.45, d: points.map(([x, y, s]) => dot(x, y, s * 0.7)).join('') }],
    glints: points.map(([x, y, s]) => dot(x, y, Math.max(0.8, s * 0.18))),
  };
}

/** A heart, centre (x, y), size s. */
export const heart = (x, y, s = 8) =>
  `M${f(x)} ${f(y + s)}C${f(x - s * 1.6)} ${f(y)} ${f(x - s * 1.1)} ${f(y - s * 1.1)} ${f(x)} ${f(y - s * 0.35)}C${f(x + s * 1.1)} ${f(y - s * 1.1)} ${f(x + s * 1.6)} ${f(y)} ${f(x)} ${f(y + s)}Z`;

/** A falling tear, its tip at (x, y). */
export const tear = (x, y, s = 1) =>
  `M${f(x)} ${f(y)}C${f(x - 2.6 * s)} ${f(y + 4 * s)} ${f(x - 2.6 * s)} ${f(y + 6.5 * s)} ${f(x)} ${f(y + 6.5 * s)}C${f(x + 2.6 * s)} ${f(y + 6.5 * s)} ${f(x + 2.6 * s)} ${f(y + 4 * s)} ${f(x)} ${f(y)}Z`;

/** An arm (limb along pts) ending in a round hand; sleeve: wash colours {c, o}; skin: hand wash. */
function arm(pts, sleeve, hand = 4.2, skin = { c: PAL.rose, o: 0.55 }) {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.7, (hand * 0.9) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[pts.length - 1][2]]]);
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [...sleeve.map((w) => ({ ...w, d: Z(d) })), ...(skin ? [{ ...skin, d: h }] : [])] };
}

/** A plain shoe, ankle at (0,0), toe to the right (flip with scale(-1 1)). */
function shoe(c = PAL.slate, o = 0.85) {
  const d = 'M-5 -4C-7 1 -6 4 -2 4L11 4C15 4 15 -1 11 -2C7 -3 4 -4 -5 -4Z';
  return { lines: [d], washes: [{ c, o, d }] };
}

/**
 * The glass slipper, side view, toe to the right, about 38 long: the sole rests on y = 0 with a
 * small heel at the back. Pale sky glass with paper glints.
 */
export function slipper({ shine = true } = {}) {
  const d = 'M-15 -14C-17 -8 -16 -3 -14 -1L-14 6L-10 6L-9 1C2 2 12 4 19 3C25 2 24 -5 18 -7C11 -9 5 -10 -1 -10C-6 -10 -11 -11 -15 -14Z';
  const opening = 'M-15 -14C-10 -7 -5 -6 -1 -10';
  return {
    lines: [d],
    fine: [opening, 'M-9 1C-12 0 -14 -1 -14 -1', ...(shine ? ['M-20 -22l-4 -4M0 -18l0 -7M22 -14l5 -4M30 4l6 0'] : [])],
    washes: [
      { c: PAL.sky, o: 0.55, d },
      { c: PAL.slate, o: 0.2, d: 'M-14 -1L-14 6L-10 6L-9 1C2 2 12 4 19 3C21 2 22 1 22 0C14 1 4 0 -14 -1Z' },
    ],
    glints: ['M2 -6C8 -6 14 -5 17 -4C14 -3 8 -4 2 -5Z', dot(-11, -6, 1.2), dot(19, -3, 1)],
  };
}

/** A little glass slipper seen from the front-ish, peeping from under a skirt: toe tip at (0,0), size s. */
function slipperToe(s = 1) {
  const d = `M${-7 * s} 0C${-7 * s} ${-5 * s} ${7 * s} ${-5 * s} ${7 * s} 0C${7 * s} ${3 * s} ${-7 * s} ${3 * s} ${-7 * s} 0Z`;
  return { lines: [d], washes: [{ c: PAL.sky, o: 0.6, d }], glints: [dot(-2.5 * s, -1.4 * s, 1)] };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. look: -1, 0 or 1 (pupils left, middle, right);
 * up: 1 (looking up), -1 (looking down). mood: happy (dot eyes, smile), smile (eyes shut in a pleased
 * curve), sad (eyes shut, brows up in the middle, a down-turned mouth and tears), wow (eyes wide,
 * mouth an "o"), worried (wide eyes, brows up, a wobbly mouth), proud (heavy, haughty lids, brows
 * arched high, a smug little smile), effort (eyes squeezed shut, teeth gritted).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4, look = 0, up = 0 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const dx = look * 1.3;
  const dy = -up * 1.5;
  const pupils = (rr, oy = 0) => {
    fills.push(dot(-ex + dx, ey + dy + oy, rr), dot(ex + dx, ey + dy + oy, rr));
    glints.push(dot(-ex + dx - 0.5, ey + dy + oy - 0.6, 0.5), dot(ex + dx - 0.5, ey + dy + oy - 0.6, 0.5));
  };
  if (mood === 'smile') {
    fine.push(`M${-ex - 3} ${ey + 1}q3 -3.4 6 0M${ex - 3} ${ey + 1}q3 -3.4 6 0`, `M${-w} ${my - 0.5}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'sad') {
    fine.push(`M${-ex - 3} ${ey - 0.5}q3 2.6 6 0M${ex - 3} ${ey - 0.5}q3 2.6 6 0`);
    fine.push(`M${-ex - 3.5} ${ey - 4}L${-ex + 3} ${ey - 6.5}M${ex + 3.5} ${ey - 4}L${ex - 3} ${ey - 6.5}`);
    fine.push(`M${-w * 0.8} ${my + 2}q${w * 0.8} -3.5 ${w * 1.6} 0`);
    const tears = [tear(-ex - 1, ey + 2.5, 0.8), tear(ex + 1, ey + 2.5, 0.8), tear(-ex - 3, ey + 13, 0.7), tear(ex + 4, ey + 16, 0.7)].join('');
    fine.push(tears);
    washes.push({ c: PAL.sky, o: 1, d: tears });
  } else if (mood === 'wow' || mood === 'worried') {
    const rw = 3.2;
    whites.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    fine.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    pupils(1.5);
    if (mood === 'worried') {
      fine.push(`M${-ex - 4} ${ey - 5}l7 -2.6M${ex + 4} ${ey - 5}l-7 -2.6`);
      fine.push(`M${-w + 1} ${my + 1}q${(w - 1) / 2} -2.5 ${w - 1} 0q${(w - 1) / 2} 2.5 ${w - 1} 0`);
    } else {
      fine.push(`M${-ex - 3} ${ey - 6}q3 -2.4 6 0M${ex - 3} ${ey - 6}q3 -2.4 6 0`);
      const o = oval(0, my + 2, 2.6, 3.4);
      fine.push(o);
      washes.push({ c: PAL.red, o: 0.8, d: o });
    }
  } else if (mood === 'proud') {
    // heavy lids drawn flat across the top of the eyes, the pupils peeping under them
    fills.push(`M${-ex - 2.2 + dx} ${ey}a2.2 2 0 0 0 4.4 0ZM${ex - 2.2 + dx} ${ey}a2.2 2 0 0 0 4.4 0Z`);
    fine.push(`M${-ex - 3.4} ${ey - 0.2}l6.8 0.3M${ex - 3.4} ${ey + 0.1}l6.8 -0.3`);
    fine.push(`M${-ex - 3.5} ${ey - 6}q3.5 -3.4 7 -0.5M${ex + 3.5} ${ey - 6}q-3.5 -3.4 -7 -0.5`);
    fine.push(`M${-w * 0.7} ${my + 0.6}q${w * 0.8} 2.6 ${w * 1.5} -1.4`);
  } else if (mood === 'effort') {
    fine.push(`M${-ex - 3} ${ey - 3}l5 3l-5 3M${ex + 3} ${ey - 3}l-5 3l5 3`);
    const mouth = `M${-w} ${my}C${-w} ${my - 2.5} ${w} ${my - 2.5} ${w} ${my}C${w} ${my + 3} ${-w} ${my + 3} ${-w} ${my}Z`;
    fine.push(mouth, `M${-w + 0.5} ${my + 0.4}L${w - 0.5} ${my + 0.4}M${-w / 3} ${my - 1.6}l0 3.6M${w / 3} ${my - 1.6}l0 3.6`);
    whites.push(mouth);
  } else {
    pupils(r);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

// =============================================================================================
// CINDERELLA (feet at 0,0), about 120 tall: a young girl with ochre (golden-brown) hair gathered in
// a round bun on top of her head, a wisp of hair at each side of her face, rosy cheeks. Head at
// C_HEAD; arms from the shoulders (±12,-80).
//  - work clothes (gown: false): a plain brown-grey dress with a green patch at the hem, a white
//    apron with a sky-blue patch, wooden clogs, and a smudge of soot on her cheek;
//  - ball (gown: true): a wide sky-blue gown with silver at the waist and hem, puffed sleeves,
//    bare arms, a sky ribbon in her bun, and glass slippers peeping from under the hem; sparkly.
// sit: sitting on a seat at y = 0 (work clothes only), legs: [left, right] centrelines from the
// knees (or bare: true for a bare foot), hem: 'swish' for a gown whirling to the left (running),
// 'lift' for a skirt lifted in front to show her ankles and both glass slippers.
// =============================================================================================
export const C_HEAD = [0, -98];
export const C_ARMS = {
  down: [
    [[-12, -80, 7], [-17, -68, 6.5], [-20, -56, 6.5], [-20, -50, 6.5]],
    [[12, -80, 7], [17, -68, 6.5], [20, -56, 6.5], [20, -50, 6.5]],
  ],
  // holding the skirt out at each side
  skirt: [
    [[-12, -80, 7], [-20, -68, 6.5], [-28, -56, 6.5], [-32, -46, 6.5]],
    [[12, -80, 7], [20, -68, 6.5], [28, -56, 6.5], [32, -46, 6.5]],
  ],
  // hands together in the lap (sitting)
  lap: [
    [[-12, -80, 7], [-19, -68, 6.5], [-12, -58, 6.5], [-5, -56, 6.5]],
    [[12, -80, 7], [19, -68, 6.5], [12, -58, 6.5], [5, -56, 6.5]],
  ],
};
export function cinderellaHead({ mood = 'happy', look = 0, up = 0, gown = false } = {}) {
  const face = 'M-12 -2C-12.4 9 -6.5 14 0 14C6.5 14 12.4 9 12 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -12 -2Z`;
  const top = 'M-13 1C-15 -13 -8 -19 0 -19C8 -19 15 -13 13 1C11 -6 6 -10 0 -8C-5 -10 -11 -6 -13 1Z';
  const bun = 'M-7 -17C-10 -23 -6 -29 0 -29C6 -29 10 -23 7 -17C4 -19 -4 -19 -7 -17Z';
  const wisps = 'M-12.5 -2C-16 3 -16 8 -12.5 11M12.5 -2C16 3 16 8 12.5 11';
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: 7, r: 1.7, w: 3.6, look, up });
  const parts = [
    {
      lines: [face, top, bun],
      fine: [wisps, 'M-4 -14q2 3 1 6M3 -15q1 3 0 6', 'M-4 -25q4 -2 7 1', 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.3, d: faceFill },
        { c: PAL.ochre, o: 0.95, d: `${top}${bun}` },
        { c: PAL.rose, o: mood === 'sad' ? 0.85 : 0.7, d: dot(-8, 5, 2.4) + dot(8, 5, 2.4) },
        ...(gown ? [] : [{ c: PAL.grey, o: 0.55, d: oval(-8.5, 9, 2.6, 1.5) }]),
        ...m.washes,
      ],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
  ];
  if (gown) {
    // a sky ribbon tied round the bun, with a sparkle
    const band = 'M-9 -18C-4 -21 4 -21 9 -18L8.6 -15.6C4 -18 -4 -18 -8.6 -15.6Z';
    const bow = 'M9 -17C14 -22 17 -18 13 -15C17 -12 13 -9 9 -15Z';
    parts.push({ lines: [bow], fine: [band], washes: [{ c: PAL.sky, o: 1, d: `${band}${bow}` }], glints: [dot(-3, -24, 1.1)] });
  }
  return merge(...parts);
}
export function cinderella({ mood = 'happy', look = 0, up = 0, tilt = 0, arms, gown = false, sit = false, legs, bare = [false, false], hem = 'still' } = {}) {
  const parts = [];
  const dy = sit ? 42 : 0;
  const lift = (pts) => pts.map(([x, y, w]) => [x, y + dy, w]);
  const dressCol = [
    { c: PAL.grey, o: 0.85 },
    { c: PAL.terracotta, o: 0.22 },
  ];
  const gownCol = [{ c: PAL.sky, o: 0.95 }];
  if (gown) {
    const skirt =
      hem === 'swish'
        ? 'M-8 -84C-14 -82 -15 -76 -15 -68C-15 -62 -15 -58 -16 -54C-28 -46 -44 -30 -58 -14C-50 -10 -42 -8 -36 -6C-24 -2 -6 -2 10 -4C20 -5 28 -8 32 -10C28 -26 22 -42 16 -54C15 -58 15 -62 15 -68C15 -76 14 -82 8 -84'
        : hem === 'lift'
          ? 'M-8 -84C-14 -82 -15 -76 -15 -68C-15 -62 -15 -58 -16 -54C-24 -44 -36 -24 -42 -6C-32 -2 -22 -6 -16 -18C-8 -26 8 -26 16 -18C22 -6 32 -2 42 -6C36 -24 24 -44 16 -54C15 -58 15 -62 15 -68C15 -76 14 -82 8 -84'
          : 'M-8 -84C-14 -82 -15 -76 -15 -68C-15 -62 -15 -58 -16 -54C-24 -44 -36 -24 -42 -6C-14 0 14 0 42 -6C36 -24 24 -44 16 -54C15 -58 15 -62 15 -68C15 -76 14 -82 8 -84';
    const waist = 'M-15.5 -60C-5 -57 5 -57 15.5 -60L16 -54C5 -51 -5 -51 -16 -54Z';
    const hemBand =
      hem === 'swish'
        ? 'M-54 -18C-44 -12 -38 -11 -34 -10C-22 -6 -4 -6 10 -8C20 -9 26 -12 31 -14L32 -10C28 -8 20 -5 10 -4C-6 -2 -24 -2 -36 -6C-42 -8 -50 -10 -58 -14Z'
        : hem === 'lift'
          ? 'M-41 -12C-32 -8 -24 -12 -19 -22C-10 -30 10 -30 19 -22C24 -12 32 -8 41 -12L42 -6C32 -2 22 -6 16 -18C8 -26 -8 -26 -16 -18C-22 -6 -32 -2 -42 -6Z'
          : 'M-41 -12C-14 -6 14 -6 41 -12L42 -6C14 0 -14 0 -42 -6Z';
    const folds = hem === 'swish' ? 'M-10 -50q-14 16 -32 34M-2 -50q-4 20 -8 42M8 -50q8 18 14 40' : 'M-8 -50q-6 20 -14 42M0 -50l0 44M8 -50q6 20 14 42';
    const sleeves = `${oval(-14, -79, 6.5, 5)}${oval(14, -79, 6.5, 5)}`;
    // glass slippers peeping out under the hem
    if (hem === 'swish') parts.push(place(slipperToe(1.1), 'translate(16 -1) rotate(20)'));
    else if (hem === 'lift') {
      // the skirt lifted in front: her ankles and both glass slippers show, toes turned out
      const legLines = [limb([[-6, -24, 5.5], [-8, -6, 5]]), limb([[6, -24, 5.5], [8, -6, 5]])];
      parts.push({ lines: legLines, washes: legLines.map((d) => ({ c: PAL.rose, o: 0.4, d: Z(d) })) });
      parts.push(place(slipper({ shine: false }), 'translate(-7 -0.5) scale(-0.42 0.42)'), place(slipper({ shine: false }), 'translate(7 -0.5) scale(0.42)'));
    }
    else parts.push(place(slipperToe(1.15), 'translate(-12 0.5)'), place(slipperToe(1.15), 'translate(12 0.5)'));
    parts.push({
      lines: [skirt],
      fine: [folds, waist],
      washes: [
        ...gownCol.map((w) => ({ ...w, d: Z(skirt) })),
        { c: PAL.slate, o: 0.18, d: hemBand },
        { c: PAL.grey, o: 0.9, d: `${waist}${hemBand}` },
      ],
      glints:
        hem === 'swish'
          ? [dot(-30, -30, 1.3), dot(-12, -22, 1.1), dot(4, -36, 1.2), dot(18, -24, 1.1), dot(-42, -18, 1)]
          : [dot(-20, -26, 1.3), dot(-6, -36, 1.1), dot(10, -22, 1.3), dot(24, -34, 1.1), dot(0, -14, 1), dot(-30, -14, 1)],
    });
    parts.push({ lines: [sleeves], washes: [{ c: PAL.sky, o: 0.95, d: sleeves }] });
  } else {
    const legLines = (legs ?? (sit ? [
      [[-8, 10, 6], [-9, 20, 5.5], [-9, 26, 5]],
      [[8, 10, 6], [9, 20, 5.5], [9, 26, 5]],
    ] : [
      [[-7, -8, 5.5], [-7, -4, 5]],
      [[7, -8, 5.5], [7, -4, 5]],
    ])).map((l) => ({ l, d: limb(l) }));
    parts.push({ lines: legLines.map((x) => x.d), washes: legLines.map((x) => ({ c: PAL.rose, o: 0.4, d: Z(x.d) })) });
    legLines.forEach(({ l }, i) => {
      const [x, y] = l[l.length - 1];
      const [px] = l[l.length - 2];
      const dir = x === px ? (i ? 1 : -1) : Math.sign(x - px);
      if (bare[i]) {
        const foot = 'M-4 -3C-6 1 -5 4 -1 4L9 4C12 4 12 0 9 -1C6 -2 3 -3 -4 -3Z';
        parts.push(place({ lines: [foot], washes: [{ c: PAL.rose, o: 0.5, d: foot }] }, `translate(${x} ${y + 1}) scale(${dir * 0.75} 0.75)`));
      } else parts.push(place(shoe(PAL.terracotta, 0.8), `translate(${x} ${y + 1}) scale(${dir * 0.65} 0.65)`));
    });
    const dress = sit
      ? 'M-8 -42C-14 -40 -16 -34 -16 -26C-16 -22 -17 -18 -18 -15C-24 -10 -28 -2 -28 6C-26 12 -20 14 -14 12C-4 14 4 14 14 12C20 14 26 12 28 6C28 -2 24 -10 18 -15C17 -18 16 -22 16 -26C16 -34 14 -40 8 -42'
      : 'M-8 -84C-14 -82 -16 -76 -16 -68C-16 -60 -18 -50 -20 -40C-22 -28 -24 -18 -26 -8C-10 -4 10 -4 26 -8C24 -18 22 -28 20 -40C18 -50 16 -60 16 -68C16 -76 14 -82 8 -84';
    const apron = sit
      ? 'M-7 -36L7 -36L8 -20C12 -20 15 -16 17 -10L20 7C8 11 -8 11 -20 7L-17 -10C-15 -16 -12 -20 -8 -20Z'
      : 'M-7 -78L7 -78L8 -60C10 -60 12 -60 13 -60L17 -13C6 -9 -6 -9 -17 -13L-13 -60C-12 -60 -10 -60 -8 -60Z';
    const patch = sit ? 'M2 -6L10 -5L9 3L1 2Z' : 'M2 -38L10 -37L9 -29L1 -30Z';
    const hemPatch = sit ? '' : 'M-24 -20L-18 -19.5L-19 -12L-25 -12.6Z';
    parts.push({
      lines: [dress, apron],
      fine: [
        patch,
        sit ? 'M3 -5l1.5 1.5M7 -4l1.5 1.5M3 0l1.5 1.5M7 1l1.5 1.5' : 'M3 -37l1.5 1.5M7 -36l1.5 1.5M3 -32l1.5 1.5M7 -31l1.5 1.5',
        sit ? 'M-17 -10C-6 -7 6 -7 17 -10' : 'M-13 -60C-6 -57.5 6 -57.5 13 -60',
        hemPatch,
        sit ? '' : 'M-13 -58q-6 -2 -8 2q4 1 8 -1',
      ].filter(Boolean),
      washes: [
        ...dressCol.map((w) => ({ ...w, d: `${Z(dress)}${apron}`, rule: 'evenodd' })),
        { c: PAL.sky, o: 0.85, d: patch },
        ...(hemPatch ? [{ c: PAL.green, o: 0.9, d: hemPatch }] : []),
      ],
    });
  }
  const a = arms ?? (sit ? C_ARMS.lap : C_ARMS.down);
  parts.push(...a.map((p) => (gown ? arm(lift(p), [{ c: PAL.rose, o: 0.32 }], 3.8) : arm(lift(p), dressCol, 3.8))));
  const collar = `M-8 ${-84 + dy}C-5 ${-78 + dy} 5 ${-78 + dy} 8 ${-84 + dy}C4 ${-85 + dy} -4 ${-85 + dy} -8 ${-84 + dy}Z`;
  parts.push({ fine: [collar], washes: gown ? [{ c: PAL.rose, o: 0.3, d: collar }] : [] });
  parts.push(place(cinderellaHead({ mood, look, up, gown }), `translate(${C_HEAD[0]} ${C_HEAD[1] + dy}) rotate(${tilt})`));
  return merge(...parts);
}

// =============================================================================================
// THE FAIRY GODMOTHER (feet at 0,0), about 100 tall, small and round: fluffy white hair in a little
// bun, round spectacles, rosy cheeks and a kind smile, a rose shawl over a long round blue-grey
// cloak scattered with paper-white stars. Head at FG_HEAD; arms from the shoulders (±16,-60).
// wand(): her silver star-tipped wand, drawn separately from the hand to the tip.
// =============================================================================================
export const FG_HEAD = [0, -78];
export const FG_ARMS = {
  down: [
    [[-16, -60, 9], [-24, -46, 8], [-26, -36, 8], [-26, -32, 8]],
    [[16, -60, 9], [24, -46, 8], [26, -36, 8], [26, -32, 8]],
  ],
  // right arm raised forward, holding up the wand
  wave: [
    [[-16, -60, 9], [-24, -46, 8], [-20, -36, 8], [-14, -34, 8]],
    [[16, -60, 9], [30, -60, 8], [40, -70, 8], [44, -74, 8]],
  ],
};
export function godmotherHead({ mood = 'smile', look = 0 } = {}) {
  const face = 'M-15 -2C-15 -12 -8 -16 0 -16C8 -16 15 -12 15 -2C15 9 8 15 0 15C-8 15 -15 9 -15 -2Z';
  const hair = 'M-17 3C-23 -2 -21 -12 -15 -14C-14 -22 -4 -25 0 -22C4 -25 14 -22 15 -14C21 -12 23 -2 17 3C15 -6 10 -10 0 -10C-10 -10 -15 -6 -17 3Z';
  const bun = oval(0, -26, 7, 6);
  const m = faceMarks({ mood, ex: 5.4, ey: -1, my: 8, r: 1.6, w: 4, look });
  const specs = `${dot(-5.4, -1, 4)}${dot(5.4, -1, 4)}M-1.4 -1.6q1.4 -1.4 2.8 0`;
  return {
    lines: [face, hair, bun],
    fine: [specs, 'M-10 -16q4 -3 9 -2M2 -18q5 0 8 3', 'M0.6 1.4c1.6 1.2 1.6 2.6 -0.6 3', 'M-12 -1l-3 -1.2M12 -1l3 -1.2', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.4, d: face },
      { c: PAL.grey, o: 0.45, d: `${hair}${bun}` },
      { c: PAL.sky, o: 0.25, d: `${hair}${bun}` },
      { c: PAL.rose, o: 0.85, d: dot(-9, 6, 3) + dot(9, 6, 3) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
}
export function godmother({ mood = 'smile', look = 0, tilt = 0, arms = FG_ARMS.down } = {}) {
  const cloak = 'M-12 -64C-24 -60 -30 -46 -32 -28C-34 -16 -36 -8 -38 -2C-12 3 12 3 38 -2C36 -8 34 -16 32 -28C30 -46 24 -60 12 -64';
  const shawl = 'M-17 -64C-25 -56 -22 -46 -13 -46C-6 -46 -2 -51 0 -54C2 -51 6 -46 13 -46C22 -46 25 -56 17 -64C8 -68 -8 -68 -17 -64Z';
  const stars = [
    [-20, -20, 3],
    [-6, -32, 2.6],
    [12, -14, 3],
    [22, -34, 2.6],
    [-2, -10, 2.4],
  ];
  const feet = merge(place(shoe(PAL.slate), 'translate(-10 -3) scale(-0.7 0.7)'), place(shoe(PAL.slate), 'translate(10 -3) scale(0.7)'));
  return merge(
    feet,
    {
      lines: [cloak, shawl],
      fine: ['M-20 -40q-4 18 -8 36M20 -40q4 18 8 36', 'M0 -54l0 6'],
      washes: [
        { c: PAL.slate, o: 0.55, d: Z(cloak) },
        { c: PAL.sky, o: 0.6, d: Z(cloak) },
        { c: PAL.rose, o: 0.9, d: shawl },
      ],
      whites: stars.map(([x, y, r]) => star5(x, y, r)),
    },
    ...arms.map((a) => arm(a, [{ c: PAL.slate, o: 0.55 }, { c: PAL.sky, o: 0.6 }], 4.6)),
    place(godmotherHead({ mood, look }), `translate(${FG_HEAD[0]} ${FG_HEAD[1]}) rotate(${tilt})`),
  );
}
/** The wand: a thin stick from (x1, y1) (her hand) to (x2, y2) with a silver star at the tip. */
export function wand(x1, y1, x2, y2, r = 8) {
  const s = star5(x2, y2, r);
  return {
    lines: [`M${x1} ${y1}L${f(x2 - (x2 - x1) * 0.12)} ${f(y2 - (y2 - y1) * 0.12)}`, s],
    washes: [{ c: PAL.grey, o: 0.9, d: s }, { c: PAL.sky, o: 0.35, d: s }],
    glints: [dot(x2 - r * 0.2, y2 - r * 0.15, r * 0.18)],
  };
}

// =============================================================================================
// THE STEPSISTERS (feet at 0,0), about 140 tall, thin and very grand, noses in the air:
//  - 'red': a red gown with ochre spots and a white ruff, terracotta hair piled up very high in three
//    rolls, with an ochre feather at the side;
//  - 'gold': an ochre gown with terracotta spots and a white ruff, dark brown hair in two big round
//    side buns and a rose bow on top.
// Head at S_HEAD; arms from the shoulders (±13,-102). sit: sitting on a seat at y = 0 (dy = 44),
// legs: centrelines (from the knee) to override the dangling legs, bare: [left, right] bare feet.
// =============================================================================================
export const S_HEAD = [0, -118];
export const S_ARMS = {
  down: [
    [[-13, -102, 7], [-18, -88, 6.5], [-20, -74, 6.5], [-20, -68, 6.5]],
    [[13, -102, 7], [18, -88, 6.5], [20, -74, 6.5], [20, -68, 6.5]],
  ],
  // hands on hips
  hips: [
    [[-13, -102, 7], [-26, -88, 6.5], [-18, -70, 6.5], [-14, -68, 6.5]],
    [[13, -102, 7], [26, -88, 6.5], [18, -70, 6.5], [14, -68, 6.5]],
  ],
};
const SISTER = {
  red: { dress: PAL.red, dressO: 0.72, spots: PAL.ochre, hair: [{ c: PAL.terracotta, o: 0.95 }] },
  gold: { dress: PAL.ochre, dressO: 0.9, spots: PAL.terracotta, hair: [{ c: PAL.slate, o: 0.85 }, { c: PAL.terracotta, o: 0.55 }] },
};
export function sisterHead({ who = 'red', mood = 'proud', look = 0, up = 0 } = {}) {
  const face = 'M-12 -3C-12.6 8 -7 16 0 16C7 16 12.6 8 12 -3';
  const faceFill = `${face}C10 -9 6 -11 0 -9C-5 -11 -10 -9 -12 -3Z`;
  const hairCol = SISTER[who].hair;
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: 8.5, r: 1.6, w: 3.6, look, up });
  // a little turned-up nose
  const nose = 'M0 1.5c2.4 1.6 2.6 3.4 -0.4 3.6';
  const parts = [];
  if (who === 'red') {
    const hair = 'M-13 0C-17 -10 -16 -18 -12 -22C-18 -28 -16 -38 -10 -40C-14 -48 -8 -58 0 -58C8 -58 14 -48 10 -40C16 -38 18 -28 12 -22C16 -18 17 -10 13 0C11 -7 6 -10 0 -9C-5 -10 -11 -7 -13 0Z';
    const curl = 'M-12 -22C-4 -26 4 -26 12 -22M-10 -40C-4 -43 4 -43 10 -40M-3 -50c2 -4 7 -2 5 2c-1 2 -4 1 -3 -1';
    const feather = 'M10 -44C16 -56 26 -62 36 -62C32 -54 22 -46 12 -41Z';
    parts.push({
      lines: [hair, feather],
      fine: [curl, 'M12 -42L32 -60'],
      washes: [...hairCol.map((w) => ({ ...w, d: hair })), { c: PAL.ochre, o: 1, d: feather }],
    });
  } else {
    const top = 'M-13 0C-15 -12 -8 -19 0 -19C8 -19 15 -12 13 0C11 -7 6 -10 0 -9C-5 -10 -11 -7 -13 0Z';
    const buns = `${oval(-17, -8, 8, 9)}${oval(17, -8, 8, 9)}`;
    const bow = 'M0 -19C-6 -28 -14 -26 -11 -19C-14 -14 -6 -12 0 -19C6 -12 14 -14 11 -19C14 -26 6 -28 0 -19Z';
    parts.push({
      lines: [top, buns, bow],
      fine: ['M-20 -12q3 3 6 0M20 -12q-3 3 -6 0M-19 -4q3 2 5 -1M19 -4q-3 2 -5 -1'],
      washes: [...hairCol.map((w) => ({ ...w, d: `${top}${buns}` })), { c: PAL.rose, o: 1, d: bow }],
    });
  }
  parts.unshift({
    lines: [face],
    fine: [nose, ...m.fine],
    washes: [{ c: PAL.rose, o: 0.3, d: faceFill }, { c: PAL.rose, o: 0.75, d: dot(-8, 6, 2.6) + dot(8, 6, 2.6) }, ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  });
  return merge(...parts);
}
export function sister({ who = 'red', mood = 'proud', look = 0, up = 0, tilt = 0, arms = S_ARMS.down, sit = false, legs, bare = [false, false] } = {}) {
  const S = SISTER[who];
  const col = [{ c: S.dress, o: S.dressO }];
  const dy = sit ? 44 : 0;
  const lift = (pts) => pts.map(([x, y, w]) => [x, y + dy, w]);
  const parts = [];
  let gown;
  let frills;
  let spotsAt;
  if (sit) {
    gown = 'M-8 -60C-14 -58 -15 -52 -15 -44C-15 -36 -15 -28 -16 -22C-24 -16 -32 -6 -34 6C-32 14 -24 16 -16 14C-6 16 6 16 16 14C24 16 32 14 34 6C32 -6 24 -16 16 -22C15 -28 15 -36 15 -44C15 -52 14 -58 8 -60';
    frills = 'M-33 4q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0q4 4 8 0';
    spotsAt = [[-20, -4], [-6, 2], [10, -6], [22, 2], [0, -14]];
  } else {
    gown = 'M-8 -104C-14 -102 -15 -96 -15 -88C-15 -78 -15 -70 -16 -64C-26 -50 -34 -28 -38 -6C-14 0 14 0 38 -6C34 -28 26 -50 16 -64C15 -70 15 -78 15 -88C15 -96 14 -102 8 -104';
    frills = 'M-37 -12q4.6 4 9.2 0q4.6 4 9.2 0q4.6 4 9.2 0q4.6 4 9.2 0q4.6 4 9.2 0q4.6 4 9.2 0q4.6 4 9.2 0q4.6 4 9.2 0';
    spotsAt = [[-18, -40], [4, -48], [20, -30], [-24, -22], [-4, -26], [14, -16], [0, -76]];
  }
  const legDefault = sit
    ? [
        [[-9, 12, 6], [-10, 22, 5.5], [-10, 28, 5]],
        [[9, 12, 6], [10, 22, 5.5], [10, 28, 5]],
      ]
    : [
        [[-7, -8, 5.5], [-7, -4, 5]],
        [[7, -8, 5.5], [7, -4, 5]],
      ];
  const lg = (legs ?? legDefault).map((l) => ({ l, d: limb(l) }));
  parts.push({ lines: lg.map((x) => x.d), washes: lg.map((x) => ({ c: PAL.rose, o: 0.4, d: Z(x.d) })) });
  lg.forEach(({ l }, i) => {
    const [x, y] = l[l.length - 1];
    const [px] = l[l.length - 2];
    const dir = Math.abs(x - px) < 0.5 ? (i ? 1 : -1) : Math.sign(x - px);
    if (bare[i]) {
      // a big bare foot
      const foot = 'M-5 -5C-8 1 -6 5 -1 5L14 5C19 5 19 -1 14 -2C9 -3 4 -5 -5 -5Z';
      parts.push(place({ lines: [foot], fine: ['M14 -1l0 5M10 -2l0 6'], washes: [{ c: PAL.rose, o: 0.55, d: foot }] }, `translate(${x} ${y}) scale(${dir} 1)`));
    } else {
      const toe = 'M-5 -4C-7 1 -6 4 -2 4L13 4C17 4 18 0 16 -1C10 -2 4 -4 -5 -4Z';
      parts.push(place({ lines: [toe], washes: [{ c: S.dress, o: 0.9, d: toe }] }, `translate(${x} ${y + 1}) scale(${dir * 0.65} 0.65)`));
    }
  });
  const ruff = `M-14 ${-104 + dy}L-10 ${-98 + dy}L-6 ${-102 + dy}L-2 ${-97 + dy}L2 ${-102 + dy}L6 ${-97 + dy}L10 ${-102 + dy}L14 ${-98 + dy}L16 ${-105 + dy}C6 ${-109 + dy} -6 ${-109 + dy} -16 ${-105 + dy}Z`;
  const spots = spotsAt.map(([x, y]) => dot(x, y, 2)).join('');
  parts.push({
    lines: [gown],
    fine: [frills, spots],
    washes: [...col.map((w) => ({ ...w, d: Z(gown) })), { c: S.spots, o: 1, d: spots }],
  });
  parts.push(...arms.map((a) => arm(lift(a), col, 3.8)));
  parts.push({ fine: [ruff], whites: [ruff] });
  parts.push(place(sisterHead({ who, mood, look, up }), `translate(${S_HEAD[0]} ${S_HEAD[1] + dy}) rotate(${tilt})`));
  return merge(...parts);
}

// =============================================================================================
// THE PRINCE (feet at 0,0), about 140 tall: young, with wavy dark brown hair and a small gold crown,
// a green coat with gold trim and buttons and a white collar, slate breeches and terracotta boots.
// Head at P_HEAD; arms from the shoulders (±18,-102).
// =============================================================================================
export const P_HEAD = [0, -122];
export const P_ARMS = {
  down: [
    [[-18, -102, 10], [-26, -88, 9], [-28, -74, 9], [-28, -68, 9]],
    [[18, -102, 10], [26, -88, 9], [28, -74, 9], [28, -68, 9]],
  ],
};
function crown(w = 8, h = 12) {
  const d = `M${-w} 0L${-w - 2} ${-h}L${-w / 2} ${-h * 0.55}L0 ${-h - 3}L${w / 2} ${-h * 0.55}L${w + 2} ${-h}L${w} 0C${w / 3} -2 ${-w / 3} -2 ${-w} 0Z`;
  return { lines: [d], washes: [{ c: PAL.ochre, o: 1, d }, { c: PAL.red, o: 0.95, d: dot(0, -h * 0.35, 1.8) }] };
}
export function princeHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-13 -2C-13.4 9 -7 15 0 15C7 15 13.4 9 13 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -13 -2Z`;
  const hair = 'M-14 4C-18 -6 -14 -18 0 -19C14 -18 18 -6 14 4C13 -4 10 -8 6 -7C2 -11 -4 -10 -6 -7C-10 -8 -13 -4 -14 4Z';
  const m = faceMarks({ mood, ex: 5, ey: 0, my: 7.5, r: 1.7, w: 4, look });
  return merge(
    {
      lines: [face, hair],
      fine: ['M-9 -15q-3 3 -2 6M9 -15q3 3 2 6', 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
      washes: [
        { c: PAL.rose, o: 0.33, d: faceFill },
        { c: PAL.terracotta, o: 0.75, d: hair },
        { c: PAL.slate, o: 0.75, d: hair },
        { c: PAL.rose, o: 0.6, d: dot(-8.5, 5.5, 2.4) + dot(8.5, 5.5, 2.4) },
        ...m.washes,
      ],
      whites: m.whites,
      fills: m.fills,
      glints: m.glints,
    },
    place(crown(8, 12), 'translate(0 -17)'),
  );
}
export function prince({ mood = 'happy', look = 0, tilt = 0, arms = P_ARMS.down } = {}) {
  const coat = 'M-10 -108C-22 -106 -24 -96 -24 -84C-24 -70 -25 -56 -28 -40C-10 -35 10 -35 28 -40C25 -56 24 -70 24 -84C24 -96 22 -106 10 -108';
  const trim = 'M-27.4 -46C-10 -41 10 -41 27.4 -46L28 -40C10 -35 -10 -35 -28 -40Z';
  const belt = 'M-24.4 -68C-8 -64 8 -64 24.4 -68L24.6 -63C8 -59 -8 -59 -24.6 -63Z';
  const buttons = [-96, -86, -76, -54].map((y) => dot(0, y, 1.8)).join('');
  const legs = [limb([[-9, -40, 10], [-9, -6, 9]]), limb([[9, -40, 10], [9, -6, 9]])];
  const boots = 'M-15 -18L-15 -2C-24 -2 -24 3 -18 3L-3 3L-3 -18ZM15 -18L15 -2C24 -2 24 3 18 3L3 3L3 -18Z';
  const collar = 'M-11 -108C-6 -99 6 -99 11 -108C6 -111 -6 -111 -11 -108Z';
  return merge(
    { lines: legs, washes: legs.map((d) => ({ c: PAL.slate, o: 0.7, d: Z(d) })) },
    { lines: [boots], washes: [{ c: PAL.terracotta, o: 0.9, d: boots }] },
    {
      lines: [coat],
      fine: [collar, 'M0 -100L0 -40', buttons],
      washes: [
        { c: PAL.green, o: 0.9, d: Z(coat) },
        { c: PAL.ochre, o: 1, d: `${trim}${belt}${buttons}` },
      ],
      whites: [collar],
    },
    ...arms.map((a) => arm(a, [{ c: PAL.green, o: 0.9 }], 4.6)),
    place(princeHead({ mood, look }), `translate(${P_HEAD[0]} ${P_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE MESSENGER (feet at 0,0), about 128 tall: the prince's page, a young man with short terracotta
// hair, a red cap with a white feather, a sky-blue tabard with a gold edge over slate sleeves, slate
// hose and brown shoes. Head at M_HEAD; arms from the shoulders (±16,-92).
// =============================================================================================
export const M_HEAD = [0, -110];
export function messengerHead({ mood = 'happy', look = 0 } = {}) {
  const face = 'M-12 -2C-12.4 9 -6.5 14 0 14C6.5 14 12.4 9 12 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-5 -10 -10 -8 -12 -2Z`;
  const hair = 'M-13 4C-15 -6 -12 -12 -8 -12L8 -12C12 -12 15 -6 13 4C12 -2 9 -5 5 -5C1 -7 -4 -7 -6 -5C-10 -5 -12 -2 -13 4Z';
  const cap = 'M-15 -8C-16 -20 -6 -24 4 -22C12 -21 18 -16 16 -8C6 -11 -6 -11 -15 -8Z';
  const feather = 'M8 -21C16 -30 26 -32 34 -30C28 -24 18 -20 10 -18Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: 7, r: 1.6, w: 3.6, look });
  return {
    lines: [face, cap, feather],
    fine: [hair, 'M10 -19L30 -29', 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.33, d: faceFill },
      { c: PAL.terracotta, o: 0.9, d: hair },
      { c: PAL.red, o: 0.85, d: cap },
      { c: PAL.rose, o: 0.6, d: dot(-8, 5, 2.3) + dot(8, 5, 2.3) },
      ...m.washes,
    ],
    whites: [feather, ...m.whites],
    fills: m.fills,
    glints: m.glints,
  };
}
export function messenger({ mood = 'happy', look = 0, tilt = 0, arms } = {}) {
  const tunic = 'M-10 -96C-20 -94 -22 -86 -22 -76C-22 -64 -23 -52 -25 -38C-10 -34 10 -34 25 -38C23 -52 22 -64 22 -76C22 -86 20 -94 10 -96';
  const tabard = 'M-12 -92L12 -92L16 -38C6 -35 -6 -35 -16 -38Z';
  const legs = [limb([[-8, -38, 9], [-8, -5, 8]]), limb([[8, -38, 9], [8, -5, 8]])];
  const a = arms ?? [
    [[-16, -92, 9], [-24, -78, 8], [-26, -64, 8], [-26, -58, 8]],
    [[16, -92, 9], [24, -78, 8], [26, -64, 8], [26, -58, 8]],
  ];
  return merge(
    { lines: legs, washes: legs.map((d) => ({ c: PAL.slate, o: 0.7, d: Z(d) })) },
    place(shoe(PAL.terracotta), 'translate(-9 -2) scale(-0.8 0.8)'),
    place(shoe(PAL.terracotta), 'translate(9 -2) scale(0.8)'),
    {
      lines: [tunic, tabard],
      fine: ['M-14 -66C-4 -63 4 -63 14 -66'],
      washes: [
        { c: PAL.slate, o: 0.6, d: Z(tunic) },
        { c: PAL.sky, o: 0.95, d: tabard },
        { c: PAL.ochre, o: 1, d: 'M-14.6 -68C-4 -65 4 -65 14.6 -68L14.8 -64C4 -61 -4 -61 -14.8 -64Z' },
      ],
    },
    ...a.map((p) => arm(p, [{ c: PAL.slate, o: 0.6 }], 4.4)),
    place(messengerHead({ mood, look }), `translate(${M_HEAD[0]} ${M_HEAD[1]}) rotate(${tilt})`),
  );
}

/** The red velvet cushion with gold tassels (centre 0,0), about 56 wide. */
export function cushion() {
  const d = 'M-28 -2C-26 -10 -18 -12 0 -12C18 -12 26 -10 28 -2C26 6 18 8 0 8C-18 8 -26 6 -28 -2Z';
  const tassels = 'M-28 -2l-5 6l3 1ZM28 -2l5 6l-3 1Z';
  return {
    lines: [d],
    fine: [tassels, 'M-20 -4q20 6 40 0'],
    washes: [{ c: PAL.red, o: 0.85, d }, { c: PAL.ochre, o: 1, d: tassels }],
  };
}

// =============================================================================================
// THINGS AND ANIMALS
// =============================================================================================

/** A little grey mouse (feet at 0,0, about 34 long), facing right. */
export function mouse() {
  const body = 'M-12 -1C-14 -9 -6 -14 2 -13C8 -12 12 -8 16 -4C17 -2 16 -1 14 -1Z';
  const ear = dot(3, -13, 3.6);
  const tail = 'M-12 -3C-20 -2 -24 -8 -30 -6C-34 -5 -36 -1 -40 -2';
  return {
    lines: [body, ear],
    fine: [tail, 'M-6 -1l-4 3M-2 -1l3 3M6 -1l-3 3M9 -1l4 3', 'M15 -5l7 -2M15 -4l7 1'],
    washes: [
      { c: PAL.grey, o: 0.95, d: `${body}${ear}` },
      { c: PAL.slate, o: 0.35, d: body },
      { c: PAL.rose, o: 0.85, d: dot(3, -13, 2) + dot(16.4, -3.6, 1.4) },
    ],
    fills: [dot(9, -8, 1.2)],
  };
}

/** A big round orange pumpkin (bottom centre 0,0), about 104 wide and 74 tall with its stalk. */
export function pumpkin() {
  const body = 'M-40 -4C-52 -10 -54 -44 -36 -54C-24 -60 -12 -58 0 -56C12 -58 24 -60 36 -54C54 -44 52 -10 40 -4C28 2 12 0 0 -2C-12 0 -28 2 -40 -4Z';
  const ribs = 'M-20 -57C-32 -40 -32 -16 -20 -1M0 -56C-4 -40 -4 -16 0 -2M20 -57C32 -40 32 -16 20 -1';
  const stalk = 'M-3 -56C-4 -64 -2 -70 4 -74L9 -71C4 -67 3 -62 4 -56Z';
  return {
    lines: [body, stalk],
    fine: [ribs, 'M6 -66C12 -72 20 -70 18 -64C16 -60 12 -62 14 -66'],
    washes: [
      { c: PAL.terracotta, o: 0.9, d: body },
      { c: PAL.ochre, o: 0.65, d: body },
      { c: PAL.green, o: 1, d: stalk },
    ],
    glints: ['M-36 -40C-38 -30 -36 -22 -34 -18C-33 -24 -33 -32 -36 -40Z'],
  };
}

/**
 * The golden coach (bottom of the wheels at 0,0), facing right, about 150 long and 150 tall: a
 * round pumpkin body with ribs, an arched sky-blue window, a door, a curly stalk on top
 * with a little crown, two big wheels with spokes, and a shaft reaching forward to the right.
 */
export function coach() {
  const body = 'M-56 -40C-76 -54 -74 -106 -48 -124C-30 -136 -12 -134 0 -132C12 -134 30 -136 48 -124C74 -106 76 -54 56 -40C38 -30 14 -32 0 -34C-14 -32 -38 -30 -56 -40Z';
  const ribs = 'M-30 -132C-48 -110 -48 -60 -32 -34M30 -132C48 -110 48 -60 32 -34';
  const win = 'M-18 -76L-18 -100C-18 -114 18 -114 18 -100L18 -76Z';
  const door = 'M-24 -40L-24 -70M24 -40L24 -70';
  const stalk = 'M-3 -132C-4 -140 -2 -146 4 -150L9 -147C4 -143 3 -138 4 -132Z';
  const curl = 'M6 -144C14 -152 22 -148 20 -142C18 -138 13 -140 15 -144';
  const wheel = (cx, cy, r) => {
    let s = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + 0.3;
      s += `M${f(cx + Math.cos(a) * 4)} ${f(cy + Math.sin(a) * 4)}L${f(cx + Math.cos(a) * (r - 3))} ${f(cy + Math.sin(a) * (r - 3))}`;
    }
    return { rim: dot(cx, cy, r), hub: dot(cx, cy, 4), spokes: s };
  };
  const w1 = wheel(-42, -26, 26);
  const w2 = wheel(46, -22, 22);
  const shaft = 'M58 -46C76 -50 96 -52 118 -50';
  const scroll = 'M-60 -40C-64 -30 -56 -24 -52 -30M60 -40C66 -32 58 -26 54 -30';
  const glass = 'M-14 -78L-14 -98C-14 -108 14 -108 14 -98L14 -78Z';
  return {
    lines: [w1.rim, w2.rim, body, win, stalk, shaft],
    fine: [ribs, door, curl, w1.spokes, w2.spokes, w1.hub, w2.hub, scroll, 'M-18 -88L18 -88', 'M-24 -40L24 -40'],
    washes: [
      { c: PAL.ochre, o: 1, d: `${body}${win}`, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.25, d: 'M-56 -40C-76 -54 -74 -106 -48 -124C-30 -136 -40 -110 -40 -80C-40 -60 -36 -40 -32 -34C-40 -34 -50 -36 -56 -40Z' },
      { c: PAL.sky, o: 0.95, d: win },
      { c: PAL.green, o: 1, d: stalk },
      { c: PAL.ochre, o: 0.85, d: `${w1.rim}${w2.rim}` },
      { c: PAL.terracotta, o: 0.4, d: `${w1.rim}${w2.rim}` },
    ],
    glints: ['M-50 -110C-56 -96 -56 -80 -54 -70C-51 -82 -50 -96 -50 -110Z', dot(36, -110, 1.6), dot(10, -96, 1.4)],
  };
}

/**
 * A grey horse (hooves on y = 0) facing right, about 190 long and 170 tall, prancing with one
 * front hoof raised: a dappled grey coat, a slate mane and tail, a red collar and an ochre plume.
 */
export function horse() {
  const body = 'M-56 -84C-58 -100 -42 -106 -16 -104C10 -102 26 -106 40 -100C54 -92 56 -74 50 -64C42 -56 18 -58 -4 -58C-30 -58 -48 -58 -54 -68C-57 -72 -57 -78 -56 -84Z';
  const neck = 'M30 -102C38 -120 46 -136 58 -146M72 -120C64 -106 58 -88 52 -70';
  const head = 'M58 -146C60 -156 74 -160 82 -152C90 -142 98 -130 102 -120C104 -113 98 -107 90 -109C82 -111 76 -116 70 -120C62 -126 56 -136 58 -146Z';
  const ear = 'M62 -152L58 -166L70 -156';
  const mane = 'M62 -154C50 -150 40 -136 34 -122C31 -114 28 -108 26 -104C32 -104 36 -110 38 -114C40 -108 44 -112 46 -120C50 -116 52 -122 54 -130C58 -128 60 -136 60 -142Z';
  const tail = 'M-54 -90C-70 -96 -84 -86 -90 -66C-84 -72 -78 -72 -76 -70C-80 -56 -78 -44 -74 -36C-68 -50 -62 -70 -52 -80Z';
  const legs = [
    limb([[42, -66, 13], [56, -48, 11], [68, -48, 10], [72, -40, 9]]),
    limb([[30, -62, 13], [32, -34, 11], [32, -8, 9]]),
    limb([[-44, -64, 15], [-50, -38, 12], [-46, -16, 10], [-46, -8, 9]]),
    limb([[-28, -62, 14], [-26, -34, 11], [-24, -8, 9]]),
  ];
  const hooves = `${oval(74, -35, 6, 5)}${oval(32, -4, 6, 4.5)}${oval(-46, -4, 6, 4.5)}${oval(-24, -4, 6, 4.5)}`;
  const coat = `${body}Z${head}M30 -102C38 -120 46 -136 58 -146L72 -120C64 -106 58 -88 52 -70Z${legs.map(Z).join('')}${ear}Z`;
  const collar = 'M36 -112C46 -108 56 -106 66 -108L64 -100C54 -98 44 -100 34 -104Z';
  const plume = 'M66 -156C62 -168 66 -178 76 -184C76 -174 74 -164 70 -156Z';
  const dapples = [dot(-30, -90, 3), dot(-14, -80, 2.6), dot(4, -92, 2.8), dot(20, -78, 2.4), dot(-40, -76, 2.4), dot(34, -88, 2.2)].join('');
  return {
    lines: [tail, ...legs, body, neck, head, ear, mane],
    fine: [hooves, collar, plume, 'M96 -114q4 1 6 -2', 'M-44 -66q14 6 34 6'],
    washes: [
      { c: PAL.grey, o: 0.95, d: coat },
      { c: PAL.slate, o: 0.25, d: coat },
      { c: PAL.slate, o: 0.9, d: `${mane}${tail}` },
      { c: PAL.slate, o: 0.9, d: hooves },
      { c: PAL.red, o: 0.85, d: collar },
      { c: PAL.ochre, o: 1, d: plume },
    ],
    whites: [dapples],
    fills: [dot(76, -140, 2.6), oval(97, -116, 1.3, 1.8)],
    glints: [dot(75.3, -141, 0.8)],
  };
}

/**
 * The palace clock face (centre 0,0) of radius r: an ochre rim, twelve tick marks (a double one at
 * the top) and both hands pointing straight up at twelve.
 */
export function clock(r = 46) {
  const rim = dot(0, 0, r);
  const face = dot(0, 0, r - 7);
  let ticks = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6 - Math.PI / 2;
    const r1 = r - 11;
    const r2 = r - (i % 3 ? 15 : 19);
    if (i === 0) {
      ticks += `M-2.4 ${f(-r1)}L-2.4 ${f(-r2)}M2.4 ${f(-r1)}L2.4 ${f(-r2)}`;
    } else ticks += `M${f(Math.cos(a) * r1)} ${f(Math.sin(a) * r1)}L${f(Math.cos(a) * r2)} ${f(Math.sin(a) * r2)}`;
  }
  const hour = `M-3 2L0 ${f(-r * 0.45)}L3 2Z`;
  const minute = `M-2 2L0 ${f(-r * 0.66)}L2 2Z`;
  return {
    lines: [rim, face],
    fine: [ticks, hour, minute, dot(0, 0, 3)],
    washes: [
      { c: PAL.ochre, o: 1, d: `${rim}${face}`, rule: 'evenodd' },
      { c: PAL.paper, o: 1, d: face },
    ],
    fills: [hour, minute, dot(0, 0, 3)],
  };
}

/** A crescent moon (centre about 0,0), about 40 tall. */
export const moon = 'M4 -20C-8 -18 -16 -8 -14 4C-12 14 -2 20 8 18C0 14 -4 6 -4 -2C-4 -10 0 -16 4 -20Z';
