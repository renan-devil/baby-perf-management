import { PAL, rng } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// Mother Holle: the characters and props shared by the ten pictures, drawn once here and placed in
// each picture with a transform (place). The build only draws files named <n>.mjs, so this file is
// not a picture. Standing characters have their feet at y = 0 and face us; their eyes look left or
// right (look).

export { at, compose, dot, f, limb, merge, oval, place };

const Z = (d) => `${d}Z`;

/** A scalloped (frilly) closed outline around (cx, cy): n bumps between radii r and r + bump. */
function frill(cx, cy, r, n, bump, from = 0, to = 360, close = true) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = ((from + ((to - from) * i) / n) * Math.PI) / 180;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else {
      const m = ((from + ((to - from) * (i - 0.5)) / n) * Math.PI) / 180;
      d += `Q${f(cx + Math.cos(m) * (r + bump * 2))} ${f(cy + Math.sin(m) * (r + bump * 2))} ${f(x)} ${f(y)}`;
    }
  }
  return close ? Z(d) : d;
}

/** A wavy hem from (x1, y) to (x2, y): n little downward scallops. */
function scallops(x1, x2, y, n, depth = 4) {
  let d = '';
  const w = (x2 - x1) / n;
  for (let i = 0; i < n; i++) d += `Q${f(x1 + w * (i + 0.5))} ${f(y + depth)} ${f(x1 + w * (i + 1))} ${f(y)}`;
  return d;
}

/** A four-ray twinkle (ink) of size s at (x, y). */
export const twinkle = (x, y, s = 6) =>
  `M${f(x - s)} ${f(y)}L${f(x + s)} ${f(y)}M${f(x)} ${f(y - s)}L${f(x)} ${f(y + s)}M${f(x - s * 0.4)} ${f(y - s * 0.4)}L${f(x + s * 0.4)} ${f(y + s * 0.4)}M${f(x + s * 0.4)} ${f(y - s * 0.4)}L${f(x - s * 0.4)} ${f(y + s * 0.4)}`;

/** A falling white feather, centre (x, y), length s, turned by a degrees. */
export function feather(x, y, s = 14, a = 0) {
  const t = `translate(${x} ${y}) rotate(${a}) scale(${s / 14})`;
  const vane = 'M-7 0C-5 -4 2 -5 7 -1C3 3 -4 3 -7 0Z';
  return place({ fine: [vane, 'M-9 0.5L6 -0.5', 'M-2 -2l1 2M2 -2.5l1 2'], washes: [{ c: PAL.grey, o: 0.22, d: vane }] }, t);
}

/** A snowflake (six ink rays with little branches and a pale sky halo) at (x, y), radius s. */
export function snowflake(x, y, s = 6) {
  let d = '';
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + 0.3;
    const [c, n] = [Math.cos(a), Math.sin(a)];
    d += `M${f(x)} ${f(y)}L${f(x + c * s)} ${f(y + n * s)}`;
    const [bx, by] = [x + c * s * 0.6, y + n * s * 0.6];
    for (const t of [0.6, -0.6]) {
      const b = a + t;
      d += `M${f(bx)} ${f(by)}L${f(bx + Math.cos(b) * s * 0.35)} ${f(by + Math.sin(b) * s * 0.35)}`;
    }
  }
  return { fine: [d], washes: [{ c: PAL.sky, o: 0.5, d: dot(x, y, s * 0.95) }] };
}

/**
 * Feathers turning into snow inside the box [x1, y1, x2, y2]: feathers on the side nearest the
 * pillow (from = 'left' or 'top'), snowflakes further away. n: how many.
 */
export function flurry(x1, y1, x2, y2, n, seed = 1, from = 'left', gap = 20) {
  const r = rng(seed);
  const parts = [];
  const placed = [];
  for (let tries = 0; placed.length < n && tries < n * 40; tries++) {
    const x = x1 + r() * (x2 - x1);
    const y = y1 + r() * (y2 - y1);
    if (placed.some(([px, py]) => Math.hypot(px - x, py - y) < gap)) continue;
    placed.push([x, y]);
    const k = from === 'left' ? (x - x1) / (x2 - x1) : (y - y1) / (y2 - y1);
    if (r() < k * 1.2 - 0.1) parts.push(snowflake(x, y, 4.5 + r() * 3));
    else parts.push(feather(x, y, 15 + r() * 7, -70 + r() * 140));
  }
  return merge(...parts);
}

/** An arm along pts ending in a round hand; sleeve: wash colours [{c, o}]. */
function arm(pts, sleeve, hand = 4, skin = { c: PAL.rose, o: 0.55 }) {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.7, (hand * 0.9) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[pts.length - 1][2]]]);
  const h = dot(x, y, hand);
  return { lines: [d], fine: [h], washes: [...sleeve.map((w) => ({ ...w, d: Z(d) })), { ...skin, d: h }] };
}

/** A plain shoe, ankle at (0,0), toe to the right (flip with scale(-1 1)). */
function shoe(c, o = 0.85) {
  const d = 'M-5 -4C-7 1 -6 4 -2 4L11 4C15 4 15 -1 11 -2C7 -3 4 -4 -5 -4Z';
  return { lines: [d], washes: [{ c, o, d }] };
}

/** Legs from the hem to the feet, with shoes; legs: [left, right] centrelines. */
function legsAndShoes(legs, shoeCol) {
  const parts = [];
  const ls = legs.map((l) => ({ l, d: limb(l) }));
  parts.push({ lines: ls.map((x) => x.d), washes: ls.map((x) => ({ c: PAL.rose, o: 0.4, d: Z(x.d) })) });
  ls.forEach(({ l }, i) => {
    const [x, y] = l[l.length - 1];
    const [px] = l[l.length - 2];
    const dir = Math.abs(x - px) < 0.5 ? (i ? 1 : -1) : Math.sign(x - px);
    parts.push(place(shoe(shoeCol), `translate(${x} ${y + 1}) scale(${dir * 0.65} 0.65)`));
  });
  return merge(...parts);
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. look: -1, 0, 1 (pupils left, middle, right);
 * up: 1 (looking up), -1 (looking down). mood: happy (dot eyes, smile), smile (eyes shut in a
 * pleased curve, smile), laugh (eyes shut, open mouth), wow (round eyes, mouth an "o"), worried
 * (round eyes, brows up, wobbly mouth), proud (eyes shut with lashes, brows high, a smug little
 * mouth: nose in the air), sooty (big white eyes and a white "o" in a black face).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4, look = 0, up = 0 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const whites = [];
  const dx = look * 1.3;
  const dy = -up * 1.4;
  const pupils = (rr) => {
    fills.push(dot(-ex + dx, ey + dy, rr), dot(ex + dx, ey + dy, rr));
    glints.push(dot(-ex + dx - 0.5, ey + dy - 0.6, 0.5), dot(ex + dx - 0.5, ey + dy - 0.6, 0.5));
  };
  if (mood === 'smile') {
    fine.push(`M${-ex - 3} ${ey + 1}q3 -3.4 6 0M${ex - 3} ${ey + 1}q3 -3.4 6 0`, `M${-w} ${my - 0.5}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'laugh') {
    fine.push(`M${-ex - 3} ${ey + 1}q3 -3.4 6 0M${ex - 3} ${ey + 1}q3 -3.4 6 0`);
    const mouth = `M${-w - 1} ${my - 1}C${-w} ${my + 8} ${w} ${my + 8} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.75, d: mouth });
  } else if (mood === 'wow' || mood === 'worried' || mood === 'sooty') {
    const rw = mood === 'sooty' ? 3.8 : 3.2;
    whites.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    fine.push(dot(-ex, ey, rw), dot(ex, ey, rw));
    pupils(1.5);
    if (mood === 'worried') {
      fine.push(`M${-ex - 4} ${ey - 5}l7 -2.6M${ex + 4} ${ey - 5}l-7 -2.6`);
      fine.push(`M${-w + 1} ${my + 1}q${(w - 1) / 2} -2.5 ${w - 1} 0q${(w - 1) / 2} 2.5 ${w - 1} 0`);
    } else {
      fine.push(`M${-ex - 3} ${ey - 6}q3 -2.4 6 0M${ex - 3} ${ey - 6}q3 -2.4 6 0`);
      const o = oval(0, my + 2, 2.8, 3.6);
      fine.push(o);
      if (mood === 'sooty') {
        whites.push(o);
        washes.push({ c: PAL.red, o: 0.5, d: oval(0, my + 2.6, 1.8, 2.2) });
      } else washes.push({ c: PAL.red, o: 0.8, d: o });
    }
  } else if (mood === 'proud') {
    // eyes shut in a smug downward curve with lashes, brows arched high, a pursed little mouth
    fine.push(`M${-ex - 3} ${ey - 0.5}q3 2.8 6 0M${ex - 3} ${ey - 0.5}q3 2.8 6 0`);
    fine.push(`M${-ex - 2.6} ${ey + 0.6}l-1.6 1.4M${ex + 2.6} ${ey + 0.6}l1.6 1.4`);
    fine.push(`M${-ex - 3.5} ${ey - 5}q3.5 -3.6 7 -0.6M${ex + 3.5} ${ey - 5}q-3.5 -3.6 -7 -0.6`);
    fine.push(`M${-w * 0.6} ${my + 1}q${w * 0.6} -1.6 ${w * 1.2} 0`);
    fine.push(`M-1 ${(ey + my) / 2 - 1}q2.2 -1.6 3 0.8`);
  } else {
    pupils(r);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes, whites };
}

// =============================================================================================
// MARIE (feet at 0,0), about 118 tall: a kind girl with ochre hair parted in the middle and one
// long plait over her shoulder tied with a sky ribbon, rosy cheeks, a plain sky-blue dress with a
// little white collar and a slate belt, slate shoes. Head at M_HEAD; arms from the shoulders
// (±12, -80). gold: covered all over in shining gold (picture 7, 8).
// =============================================================================================
export const M_HEAD = [0, -98];
export const M_ARMS = {
  down: [
    [[-12, -80, 7], [-17, -68, 6.5], [-20, -56, 6.5], [-20, -50, 6.5]],
    [[12, -80, 7], [17, -68, 6.5], [20, -56, 6.5], [20, -50, 6.5]],
  ],
  // both arms up and out, palms to the sky
  up: [
    [[-12, -80, 7], [-26, -88, 6.5], [-36, -102, 6.5], [-40, -112, 6.5]],
    [[12, -80, 7], [26, -88, 6.5], [36, -102, 6.5], [40, -112, 6.5]],
  ],
};
export const M_LEGS = [
  [[-7, -8, 5.5], [-7, -4, 5]],
  [[7, -8, 5.5], [7, -4, 5]],
];
export function marieHead({ mood = 'happy', look = 0, up = 0, gold = false } = {}) {
  const face = 'M-12 -2C-12.4 9 -6.5 14 0 14C6.5 14 12.4 9 12 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-6 -10 -10 -8 -12 -2Z`;
  const top = 'M-13 2C-15 -13 -8 -19 0 -19C8 -19 15 -13 13 2C12 -5 7 -9 0.5 -10C-6 -9 -12 -5 -13 2Z';
  // the plait, hanging from behind her right ear over her shoulder
  const plaitPts = [[13, 4], [14.5, 11], [15.5, 18], [16, 25]];
  const plait = plaitPts.map(([x, y]) => oval(x, y, 4, 4.4)).join('');
  const tuft = 'M14 29C12 33 12 36 13 37M16 29C16 33 17 36 18.5 37M15 29L15 37';
  const bow = 'M16 28C11 24 10 31 15 29.5C19 33 22 26 16 28Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: 7, r: 1.7, w: 3.6, look, up });
  return merge({
    lines: [face, top, plait],
    fine: ['M0.5 -18.5C0.2 -15 0.4 -12 0.5 -10', 'M-6 -14q-3 4 -4 9M7 -14q3 4 4 9', tuft, bow, 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.ochre, o: 0.95, d: `${top}${plait}` },
      { c: PAL.ochre, o: 0.6, d: 'M13 29L18.5 37L13 37Z' },
      { c: PAL.sky, o: 1, d: bow },
      { c: PAL.rose, o: 0.7, d: dot(-8, 5, 2.4) + dot(8, 5, 2.4) },
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, ...(gold ? [dot(-6, -14, 1.2), dot(7, -12, 1)] : [])],
  });
}
export function marie({ mood = 'happy', look = 0, up = 0, tilt = 0, arms = M_ARMS.down, legs = M_LEGS, gold = false } = {}) {
  const parts = [];
  const dressCol = [{ c: PAL.sky, o: 0.8 }, { c: PAL.slate, o: 0.12 }];
  parts.push(legsAndShoes(legs, PAL.slate));
  const dress = 'M-8 -84C-14 -82 -16 -76 -16 -68C-16 -60 -18 -50 -20 -40C-22 -28 -24 -18 -26 -8C-10 -4 10 -4 26 -8C24 -18 22 -28 20 -40C18 -50 16 -60 16 -68C16 -76 14 -82 8 -84';
  const belt = 'M-16.4 -62C-6 -59.5 6 -59.5 16.4 -62L16.8 -57C6 -54.5 -6 -54.5 -16.8 -57Z';
  parts.push({
    lines: [dress],
    fine: [belt, 'M-7 -50q-5 18 -10 38M7 -50q5 18 10 38', 'M-26 -8C-10 -4 10 -4 26 -8'],
    washes: [...dressCol.map((w) => ({ ...w, d: Z(dress) })), { c: PAL.slate, o: 0.6, d: belt }],
  });
  parts.push(...arms.map((p) => arm(p, dressCol, 3.8)));
  const collar = 'M-9 -84C-7 -78 -2 -78 0 -81C2 -78 7 -78 9 -84C4 -86 -4 -86 -9 -84Z';
  parts.push({ fine: [collar], whites: [collar] });
  if (gold) {
    // gold all over: coins and glints on her dress and hair
    const r = rng(77);
    const spots = [];
    for (let i = 0; i < 26; i++) {
      const y = -82 + r() * 76;
      const half = 9 + ((y + 84) / 76) * 15;
      spots.push([(r() * 2 - 1) * half, y]);
    }
    parts.push({
      washes: [{ c: PAL.ochre, o: 0.95, d: spots.map(([x, y]) => dot(x, y, 2.3)).join('') }],
      fine: spots.slice(0, 10).map(([x, y]) => dot(x, y, 2.3)),
      glints: spots.map(([x, y]) => dot(x - 0.6, y - 0.6, 0.7)),
    });
  }
  parts.push(place(marieHead({ mood, look, up, gold }), `translate(${M_HEAD[0]} ${M_HEAD[1]}) rotate(${tilt})`));
  return merge(...parts);
}

// =============================================================================================
// LOTTE (feet at 0,0), about 118 tall: Marie's lazy sister. A mop of dark slate curls with a big red
// bow, a frilly rose dress with red dots and a red sash, red shoes. In her proud mood her eyes are
// shut and her nose is in the air. Head at L_HEAD; arms from the shoulders (±12, -80).
// soot: drenched in sticky black soot (picture 10).
// =============================================================================================
export const L_HEAD = [0, -98];
export const L_ARMS = {
  down: [
    [[-12, -80, 7], [-17, -68, 6.5], [-20, -56, 6.5], [-20, -50, 6.5]],
    [[12, -80, 7], [17, -68, 6.5], [20, -56, 6.5], [20, -50, 6.5]],
  ],
  // swinging as she marches along
  swing: [
    [[-12, -80, 7], [-22, -70, 6.5], [-30, -60, 6.5], [-34, -54, 6.5]],
    [[12, -80, 7], [16, -68, 6.5], [16, -56, 6.5], [14, -50, 6.5]],
  ],
  // flung up in dismay
  up: [
    [[-12, -80, 7], [-26, -88, 6.5], [-34, -102, 6.5], [-36, -112, 6.5]],
    [[12, -80, 7], [26, -88, 6.5], [34, -102, 6.5], [36, -112, 6.5]],
  ],
};
export function lotteHead({ mood = 'proud', look = 0, up = 0, soot = false } = {}) {
  const face = 'M-12 -2C-12.4 9 -6.5 14 0 14C6.5 14 12.4 9 12 -2';
  const faceFill = `${face}C10 -8 6 -10 0 -8C-6 -10 -10 -8 -12 -2Z`;
  // a mop of curls round the top and sides of her head
  const curls = `${frill(0, -3, 14, 11, 2.2, 150, 390, false)}C13 2 12 -4 9 -8C4 -12 -4 -12 -9 -8C-12 -4 -13 2 -12 4Z`;
  const bow = 'M6 -17C2 -27 -6 -24 0 -16C-6 -10 4 -6 6 -15C10 -6 20 -10 13 -16C20 -24 10 -27 6 -17Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 0, my: 7.5, r: 1.7, w: 3.4, look, up });
  return merge({
    lines: [face, curls],
    fine: ['M-12 -10q3 -2 2 3M-6 -16q3 -1 2 3M3 -15q3 -1 2 3M10 -9q3 -1 2 3M-15 0q3 -1 2 3M14 1q3 -1 2 3', bow, 'M6 -17l0 3', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.3, d: faceFill },
      { c: PAL.slate, o: 0.9, d: curls },
      { c: PAL.ink, o: 0.35, d: curls },
      { c: PAL.red, o: 0.9, d: bow },
      { c: PAL.rose, o: 0.75, d: dot(-8, 5, 2.4) + dot(8, 5, 2.4) },
      ...(soot ? [{ c: PAL.ink, o: 0.75, d: `${faceFill}` }] : []),
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  });
}
export function lotte({ mood = 'proud', look = 0, up = 0, tilt = 0, arms = L_ARMS.down, legs = M_LEGS, soot = false } = {}) {
  const parts = [];
  const dressCol = [{ c: PAL.rose, o: 0.85 }];
  parts.push(legsAndShoes(legs, PAL.red));
  const dress = `M-8 -84C-14 -82 -16 -76 -16 -68C-16 -62 -16 -58 -17 -54C-26 -44 -34 -26 -36 -10${scallops(-36, 36, -10, 9, 5)}C34 -26 26 -44 17 -54C16 -58 16 -62 16 -68C16 -76 14 -82 8 -84`;
  const sash = 'M-16.4 -60C-6 -57.5 6 -57.5 16.4 -60L17 -54C6 -51.5 -6 -51.5 -17 -54Z';
  const sashBow = 'M14 -57C20 -62 24 -56 18 -55C24 -52 20 -46 14 -55ZM15 -55l6 12M16 -55l1 13';
  const spots = [[-14, -40], [2, -44], [14, -36], [-22, -24], [-6, -28], [10, -22], [24, -20], [-26, -14], [-2, -15], [18, -12]];
  parts.push({
    lines: [dress],
    fine: [sash, sashBow, 'M-30 -14C-10 -10 10 -10 30 -14'],
    washes: [
      ...dressCol.map((w) => ({ ...w, d: Z(dress) })),
      { c: PAL.red, o: 0.85, d: `${sash}M14 -57C20 -62 24 -56 18 -55C24 -52 20 -46 14 -55Z` },
      { c: PAL.red, o: 0.7, d: spots.map(([x, y]) => dot(x, y, 1.8)).join('') },
    ],
  });
  parts.push(...arms.map((p) => arm(p, dressCol, 3.8)));
  const collar = 'M-9 -84C-7 -78 -2 -78 0 -81C2 -78 7 -78 9 -84C4 -86 -4 -86 -9 -84Z';
  parts.push({ fine: [collar], whites: soot ? [] : [collar] });
  parts.push(place(lotteHead({ mood, look, up, soot }), `translate(${L_HEAD[0]} ${L_HEAD[1]}) rotate(${tilt})`));
  if (soot) {
    // sticky black soot all over: a dark coat from the head down, dripping off her elbows and hem
    const coat =
      'M-18 -118C-20 -128 -8 -134 2 -132C14 -134 22 -124 18 -112C17 -104 15 -96 14 -86C18 -82 22 -78 24 -74L28 -62C24 -58 20 -58 18 -60C22 -50 30 -36 34 -20' +
      'C35 -16 34 -12 32 -12C31 -4 28 -4 28 -10C25 -8 22 -8 21 -10C20 -2 16 -2 16 -9C12 -7 8 -8 6 -9C5 -1 1 -1 1 -9C-3 -7 -8 -8 -11 -9C-12 -3 -16 -3 -16 -10C-20 -8 -24 -9 -26 -11C-27 -5 -31 -5 -31 -12C-34 -14 -35 -18 -33 -22C-29 -36 -22 -50 -18 -60C-20 -58 -25 -58 -28 -62L-24 -74C-22 -78 -18 -82 -14 -86C-15 -96 -17 -106 -18 -118Z';
    const drips = 'M-36 -112l0 10M36 -112l0 8M-38 -96l0 9M32 -96l-1 9M-8 2l0 6M12 2l0 5';
    parts.push({ fine: [drips], washes: [{ c: PAL.ink, o: 0.55, d: coat }, { c: PAL.slate, o: 0.6, d: coat }, { c: PAL.ink, o: 0.6, d: 'M-37 -108c-2 3 -2 6 0 6c2 0 2 -3 0 -6ZM35 -108c-2 3 -2 6 0 6c2 0 2 -3 0 -6Z' }] });
  }
  return merge(...parts);
}

// =============================================================================================
// MOTHER HOLLE (feet at 0,0), about 132 tall and wide: a kind old woman with a big round smiling
// face, rosy cheeks and a round nose, grey curls under a big frilly white bonnet tied with a red bow
// under her chin, a terracotta dress and a long white apron. Head at H_HEAD; arms from the
// shoulders (±22, -80). bust: only down to the waist (y = -44), for leaning out of a window.
// =============================================================================================
export const H_HEAD = [0, -104];
export const H_ARMS = {
  down: [
    [[-22, -80, 10], [-30, -64, 9], [-32, -50, 9], [-32, -44, 9]],
    [[22, -80, 10], [30, -64, 9], [32, -50, 9], [32, -44, 9]],
  ],
  // one arm waving, the other on her apron
  wave: [
    [[-22, -80, 10], [-36, -84, 9], [-46, -100, 9], [-48, -110, 9]],
    [[22, -80, 10], [28, -66, 9], [20, -54, 9], [14, -52, 9]],
  ],
};
export function holleHead({ mood = 'smile', look = 0 } = {}) {
  const face = 'M-17 0C-17 -11 -9 -17 0 -17C9 -17 17 -11 17 0C17 11 9 18 0 18C-9 18 -17 11 -17 0Z';
  const bonnet = frill(0, -3, 25, 18, 1.8, 0, 360);
  const brim = 'M-21 8C-24 -6 -16 -22 0 -22C16 -22 24 -6 21 8';
  const curls = 'M-15 -6C-17 -12 -11 -12 -10 -9C-9 -14 -3 -14 -3 -10C-2 -14 4 -14 4 -10C5 -14 11 -14 11 -9C12 -12 18 -11 15 -6C10 -10 -10 -10 -15 -6Z';
  const bow = 'M0 19C-7 13 -12 22 -5 23C-1 23 1 23 5 23C12 22 7 13 0 19ZM-2 22l-4 9M2 22l4 9';
  const m = faceMarks({ mood, ex: 6.4, ey: 0, my: 8.5, r: 2, w: 6, look });
  return merge({
    lines: [bonnet, face],
    fine: [brim, curls, 'M-2.6 2.5C-3 6.5 3 6.5 2.6 2.5', 'M-24 -10q4 3 4 8M24 -10q-4 3 -4 8', bow, ...m.fine],
    washes: [
      { c: PAL.grey, o: 0.2, d: `${bonnet}${face}`, rule: 'evenodd' },
      { c: PAL.sky, o: 0.12, d: brim + 'C16 -14 -16 -14 -21 8Z' },
      { c: PAL.rose, o: 0.35, d: face },
      { c: PAL.grey, o: 0.75, d: curls },
      { c: PAL.rose, o: 0.8, d: dot(-10.5, 7, 3.4) + dot(10.5, 7, 3.4) + oval(0, 4.4, 3, 2.6) },
      { c: PAL.red, o: 0.9, d: 'M0 19C-7 13 -12 22 -5 23C-1 23 1 23 5 23C12 22 7 13 0 19Z' },
      ...m.washes,
    ],
    whites: [`${bonnet}${face}`, ...m.whites],
    fills: m.fills,
    glints: m.glints,
  });
}
export function holle({ mood = 'smile', look = 0, tilt = 0, arms = H_ARMS.down, bust = false } = {}) {
  const parts = [];
  const dressCol = [{ c: PAL.terracotta, o: 0.7 }];
  const apronCol = [{ c: PAL.grey, o: 0.14 }];
  if (!bust) {
    parts.push(place(shoe(PAL.slate), 'translate(-14 -2) scale(-0.7 0.7)'), place(shoe(PAL.slate), 'translate(14 -2) scale(0.7)'));
    const dress = 'M-12 -86C-24 -84 -30 -74 -30 -60C-30 -42 -36 -22 -40 -6C-14 0 14 0 40 -6C36 -22 30 -42 30 -60C30 -74 24 -84 12 -86';
    const apron = 'M-14 -78L14 -78L15 -62C17 -62 19 -62 20 -62L23 -10C8 -6 -8 -6 -23 -10L-20 -62C-19 -62 -17 -62 -15 -62Z';
    const strings = 'M-20 -62C-26 -63 -29 -62 -30 -60M20 -62C26 -63 29 -62 30 -60';
    const pocket = 'M-14 -40L-2 -40L-3 -28C-7 -26 -10 -26 -13 -28Z';
    parts.push({
      lines: [dress, apron],
      fine: [strings, pocket, 'M-20 -62C-8 -59 8 -59 20 -62', 'M6 -54q2 18 4 40M-6 -10q0 -8 0 -12'],
      washes: [...dressCol.map((w) => ({ ...w, d: `${Z(dress)}${apron}`, rule: 'evenodd' })), ...apronCol.map((w) => ({ ...w, d: apron }))],
    });
  } else {
    const dress = 'M-12 -86C-24 -84 -30 -74 -30 -60L-31 -44L31 -44L30 -60C30 -74 24 -84 12 -86';
    const apron = 'M-14 -78L14 -78L15 -62C17 -62 19 -62 20 -62L20.6 -44L-20.6 -44L-20 -62C-19 -62 -17 -62 -15 -62Z';
    parts.push({
      lines: [dress, apron],
      fine: ['M-20 -62C-26 -63 -29 -62 -30 -60M20 -62C26 -63 29 -62 30 -60', 'M-20 -62C-8 -59 8 -59 20 -62'],
      washes: [...dressCol.map((w) => ({ ...w, d: `${Z(dress)}${apron}`, rule: 'evenodd' })), ...apronCol.map((w) => ({ ...w, d: apron }))],
    });
  }
  parts.push(...arms.map((p) => arm(p, dressCol, 5)));
  parts.push(place(holleHead({ mood, look }), `translate(${H_HEAD[0]} ${H_HEAD[1]}) rotate(${tilt})`));
  return merge(...parts);
}

// =============================================================================================
// Props
// =============================================================================================

/** A big feather pillow, centre (0,0), about 64 × 40, white with a little sky stripe. */
export function pillow() {
  const d = 'M-30 -18C-14 -14 14 -14 30 -18C34 -6 34 6 30 18C14 14 -14 14 -30 18C-34 6 -34 -6 -30 -18Z';
  const corners = 'M-30 -18l-6 -4M30 -18l6 -4M-30 18l-6 4M30 18l6 4';
  return {
    lines: [d],
    fine: [corners, 'M-22 -6C-8 -3 8 -3 22 -6M-22 2C-8 5 8 5 22 2'],
    washes: [{ c: PAL.grey, o: 0.18, d }, { c: PAL.sky, o: 0.55, d: 'M-22 -6C-8 -3 8 -3 22 -6L22 2C8 5 -8 5 -22 2Z' }],
    whites: [d],
  };
}

/** A golden loaf, centre (0,0), about 30 × 15, with three slashes. face: tiny eyes and a calling mouth. */
export function loaf({ face = false } = {}) {
  const d = 'M-15 4C-17 -4 -10 -9 0 -9C10 -9 17 -4 15 4C10 7 -10 7 -15 4Z';
  const fine = face ? [] : ['M-8 -6l3 4M-1 -7l3 4M6 -6l3 4'];
  const fills = face ? [dot(-4.5, -2, 1.3), dot(4.5, -2, 1.3)] : [];
  const washes = [{ c: PAL.ochre, o: 0.95, d }, { c: PAL.terracotta, o: 0.4, d: 'M-15 4C-16 -1 -13 -5 -8 -7C-10 -2 -10 2 -6 6C-10 6 -13 5 -15 4Z' }];
  if (face) {
    const mouth = oval(0, 2.4, 2, 2.4);
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.8, d: mouth });
  }
  return { lines: [d], fine, washes, fills };
}

/**
 * The big round bread oven (centre of its base at 0,0), about 150 wide and 130 tall: a terracotta
 * brick dome on a stone base, a little chimney, and an arched mouth glowing with warm light.
 */
export const OVEN_MOUTH = [0, -50];
export function oven() {
  const base = 'M-74 0L-72 -34L72 -34L74 0Z';
  const dome = 'M-66 -34C-68 -90 -34 -116 0 -116C34 -116 68 -90 66 -34';
  const mouth = 'M-26 -34L-26 -56C-26 -74 26 -74 26 -56L26 -34Z';
  const chimney = 'M24 -110L26 -132L42 -132L40 -100';
  const bricks =
    'M-50 -90l10 -4M-30 -102l10 -2M10 -104l10 2M38 -92l10 4M-56 -66l10 -1M44 -64l12 0M-48 -46l10 0M40 -46l12 0M-36 -80l8 -2M30 -80l8 2' +
    'M-60 -24l0 -10M-36 -24l0 10M-10 -24l0 -10M14 -24l0 10M40 -24l0 -10M60 -24l0 10M-72 -17L72 -17';
  return {
    lines: [base, dome, mouth, chimney],
    fine: [bricks, 'M-30 -30C-10 -27 10 -27 30 -30', 'M-62 -36C-30 -40 30 -40 62 -36'],
    washes: [
      { c: PAL.terracotta, o: 0.6, d: `${Z(`${dome}`)}${mouth}`, rule: 'evenodd' },
      { c: PAL.terracotta, o: 0.85, d: 'M24 -110L26 -132L42 -132L40 -100Z' },
      { c: PAL.grey, o: 0.55, d: base },
      { c: PAL.slate, o: 0.55, d: mouth },
      { c: PAL.ochre, o: 0.85, d: 'M-20 -34L-20 -52C-20 -66 20 -66 20 -52L20 -34Z' },
      { c: PAL.red, o: 0.25, d: 'M-14 -34L-14 -48C-14 -58 14 -58 14 -48L14 -34Z' },
    ],
  };
}

/**
 * The old stone well (centre of its front foot at 0,0): a round stone wall 104 wide and 52 high
 * with its dark water seen from above, two wooden posts, a little terracotta roof, and a bucket
 * on a rope. rim: the middle of the front of the rim, (0, -52).
 */
export const WELL_RIM = [0, -52];
export function well({ roof = true } = {}) {
  const wall = 'M-52 -52L-52 -6C-30 4 30 4 52 -6L52 -52';
  const rimTop = oval(0, -52, 52, 13);
  const water = oval(0, -51, 42, 8.5);
  const stones =
    'M-52 -38C-30 -30 30 -30 52 -38M-52 -22C-30 -14 30 -14 52 -22' +
    'M-36 -47l0 12M-8 -44l0 12M20 -45l0 12M44 -49l0 12M-46 -33l0 13M-20 -30l0 14M8 -30l0 14M34 -32l0 13M-34 -18l0 14M-6 -15l0 15M24 -16l0 14M46 -20l0 12';
  const lines = [wall, rimTop];
  const fine = [stones, water];
  const washes = [
    { c: PAL.grey, o: 0.7, d: `M-52 -52L-52 -6C-30 4 30 4 52 -6L52 -52C52 -40 -52 -40 -52 -52Z` },
    { c: PAL.grey, o: 0.45, d: `${rimTop}${water}`, rule: 'evenodd' },
    { c: PAL.slate, o: 0.85, d: water },
    { c: PAL.sky, o: 0.4, d: water },
    { c: PAL.green, o: 0.5, d: 'M-50 -10C-44 -14 -40 -8 -34 -12L-34 -2C-40 -2 -46 -4 -50 -6ZM30 -2C34 -8 40 -6 44 -10L48 -7C42 -4 36 -2 30 -2Z' },
  ];
  if (roof) {
    const posts = 'M-46 -56L-46 -128M-40 -55L-40 -128M46 -56L46 -128M40 -55L40 -128';
    const roofD = 'M-62 -124L0 -158L62 -124L54 -118L0 -146L-54 -118Z';
    const axle = 'M-40 -112L40 -112';
    const rope = 'M10 -112L10 -84';
    const bucket = 'M2 -84L18 -84L16 -70L4 -70Z';
    lines.push(posts, roofD, bucket);
    fine.push(axle, rope, 'M2 -84C4 -92 16 -92 18 -84', 'M-20 -136l8 -4M14 -142l8 4M30 -134l10 5');
    washes.push(
      { c: PAL.ochre, o: 0.65, d: 'M-46 -56L-40 -55L-40 -128L-46 -128ZM46 -56L40 -55L40 -128L46 -128Z' },
      { c: PAL.red, o: 0.7, d: roofD },
      { c: PAL.terracotta, o: 0.7, d: bucket },
    );
  }
  return { lines, fine, washes };
}

/** Rings on the water of the well, round (x, y) in well coordinates, and the spindle sinking. */
export function ripple(x = 6, y = -51) {
  const spindle = `M${x - 11} ${y + 2.5}L${x + 11} ${y - 2.5}`;
  const whorl = oval(x - 5, y + 1.2, 3, 3.6);
  return {
    lines: [spindle],
    fine: [oval(x, y, 18, 4.2), oval(x, y, 28, 6.2), whorl],
    washes: [{ c: PAL.terracotta, o: 0.9, d: whorl }],
    glints: [oval(x + 14, y - 3, 3, 0.8), oval(x - 18, y + 2, 3, 0.8)],
  };
}

/**
 * The tall gate (centre of its threshold at 0,0): two stone pillars 26 wide whose inner faces are
 * 70 apart, joined at the top by a round arch, about 210 tall, with its two wooden doors swung
 * open. Under the arch, from y = -186 down, is where the gold (or soot) pours.
 */
export const GATE_TOP = -186;
export function gate() {
  const pillarL = 'M-61 0L-61 -170L-35 -170L-35 0';
  const pillarR = 'M61 0L61 -170L35 -170L35 0';
  const arch = 'M-66 -170C-66 -214 66 -214 66 -170L56 -170C56 -202 -56 -202 -56 -170Z';
  const capsL = 'M-66 -170L-30 -170M-66 -164L-30 -164';
  const capsR = 'M66 -170L30 -170M66 -164L30 -164';
  const inner = 'M-35 -164C-35 -192 35 -192 35 -164';
  const doorL = 'M-61 -2L-90 8L-90 -150L-61 -164';
  const doorR = 'M61 -2L90 8L90 -150L61 -164';
  const stones = 'M-61 -130L-35 -130M-61 -90L-35 -90M-61 -50L-35 -50M61 -130L35 -130M61 -90L35 -90M61 -50L35 -50M-48 -150l0 20M-50 -110l0 20M-46 -70l0 20M-48 -30l0 20M48 -150l0 20M50 -110l0 20M46 -70l0 20M48 -30l0 20';
  const planks = 'M-70 0L-70 -156M-80 4L-80 -153M70 0L70 -156M80 4L80 -153M-90 -40L-61 -44M-90 -110L-61 -120M90 -40L61 -44M90 -110L61 -120';
  return {
    lines: [pillarL, pillarR, arch, doorL, doorR],
    fine: [capsL, capsR, inner, stones, planks, 'M-18 -196l0 -6M0 -200l0 -6M18 -196l0 -6'],
    washes: [
      { c: PAL.grey, o: 0.6, d: `${Z(pillarL)}${Z(pillarR)}${arch}` },
      { c: PAL.terracotta, o: 0.55, d: `${Z(doorL)}${Z(doorR)}` },
      { c: PAL.ochre, o: 0.3, d: 'M-35 -164C-35 -192 35 -192 35 -164Z' },
    ],
  };
}

/**
 * The cockerel (feet at 0,0), facing right, about 80 tall: an ochre body with terracotta wings
 * and hackles, a red comb and wattle, and a big arching tail of green and slate feathers. crow:
 * head up, beak wide open.
 */
export function cockerel({ crow = true } = {}) {
  const body = 'M-22 -30C-26 -46 -10 -54 4 -50C8 -58 12 -68 16 -72C24 -80 36 -74 34 -64C32 -56 28 -48 26 -40C26 -24 14 -16 0 -16C-12 -16 -20 -22 -22 -30Z';
  const hackles = 'M6 -50C10 -58 14 -66 18 -70C22 -60 24 -50 26 -42C20 -44 12 -46 6 -50Z';
  const wing = 'M-12 -36C-4 -46 12 -44 16 -32C10 -24 -4 -24 -12 -36Z';
  const tail1 = limb([[-18, -34, 10], [-30, -50, 10], [-34, -68, 8], [-26, -82, 4]]);
  const tail2 = limb([[-20, -30, 9], [-36, -40, 9], [-46, -56, 7], [-44, -70, 4]]);
  const tail3 = limb([[-20, -26, 8], [-38, -30, 8], [-52, -40, 6], [-56, -52, 3]]);
  const comb = 'M17 -72C14 -80 19 -84 22 -79C22 -87 29 -88 29 -80C32 -86 38 -83 34 -74Z';
  const beak = crow ? 'M33 -70L46 -79L35 -66M34 -63L46 -60L33 -60' : 'M34 -68L44 -65L34 -62';
  const beakFill = crow ? 'M33 -70L46 -79L35 -66ZM34 -63L46 -60L33 -60Z' : 'M34 -68L44 -65L34 -62Z';
  const wattle = 'M31 -60C32 -52 26 -50 26 -57Z';
  const legs = 'M-2 -16L-4 0M8 -16L10 0';
  const toes = 'M-11 1L3 1M-4 1l-4 -3M4 1L17 1M10 1l-3 -3';
  return {
    lines: [tail3, tail2, tail1, body, comb, beak, legs],
    fine: [hackles, wing, wattle, toes, 'M-6 -36q6 2 12 0M-4 -32q6 2 12 0'],
    washes: [
      { c: PAL.slate, o: 0.75, d: Z(tail2) },
      { c: PAL.green, o: 0.8, d: `${Z(tail1)}${Z(tail3)}` },
      { c: PAL.ochre, o: 0.85, d: body },
      { c: PAL.terracotta, o: 0.75, d: `${hackles}${wing}` },
      { c: PAL.red, o: 0.9, d: `${comb}${wattle}` },
      { c: PAL.ochre, o: 1, d: beakFill },
    ],
    whites: [dot(27, -67, 2.6)],
    fills: [dot(27.6, -67.3, 1.5)],
    glints: [dot(27.1, -67.9, 0.5)],
  };
}

/** Crowing marks in front of a beak at (x, y), opening to the right. */
export const crowMarks = (x, y) =>
  `M${x} ${y - 10}q8 10 0 20M${x + 8} ${y - 16}q12 16 0 32M${x + 16} ${y - 22}q16 22 0 44`;

/** An apple tree (centre of the foot of the trunk at 0,0), about 190 tall; apples: [x, y] on the crown. */
export function appleTree({ apples = [] } = {}) {
  const trunk = 'M-12 0C-8 -30 -10 -70 -8 -100M12 0C8 -30 10 -70 10 -100M-12 0C-6 3 6 3 12 0';
  const branches = 'M-6 -96C-20 -112 -34 -120 -46 -124M6 -98C20 -114 34 -120 48 -126M0 -100L2 -130';
  const crown = 'M-78 -126C-96 -144 -84 -176 -56 -176C-50 -200 -14 -208 4 -192C26 -208 66 -196 64 -170C90 -164 92 -128 70 -118C56 -100 24 -104 10 -110C-6 -100 -36 -100 -48 -108C-64 -104 -78 -112 -78 -126Z';
  const bark = 'M-2 -30c3 6 3 12 0 18M2 -70c-3 6 -3 12 0 16';
  return {
    lines: [trunk, branches, crown],
    fine: [bark, 'M-60 -160c3 -5 8 -5 10 0M-20 -184c3 -5 8 -5 10 0M30 -176c3 -5 8 -5 10 0M50 -140c3 -5 8 -5 10 0'],
    washes: [
      { c: PAL.ochre, o: 0.55, d: 'M-12 0C-8 -30 -10 -70 -8 -100L10 -100C10 -70 8 -30 12 0Z' },
      { c: PAL.green, o: 0.7, d: crown },
      { c: PAL.green, o: 0.35, d: 'M-50 -118C-30 -130 30 -132 56 -122C40 -110 20 -112 10 -114C-6 -106 -34 -106 -50 -118Z' },
      ...apples.map(([x, y]) => ({ c: PAL.red, o: 0.85, d: dot(x, y, 6) })),
    ],
    glints: apples.map(([x, y]) => dot(x - 2, y - 2, 1.2)),
    once: apples.map(([x, y]) => `M${x} ${y - 6}l1 -4`),
  };
}

/** A red apple at (x, y), radius 7; falling: with little motion lines above. */
export function apple(x, y, falling = false) {
  const d = dot(x, y, 7);
  return {
    fine: [d, `M${x} ${y - 7}l1.5 -4`, ...(falling ? [`M${x - 4} ${y - 12}l0 -6M${x + 4} ${y - 13}l0 -6`] : [])],
    washes: [{ c: PAL.red, o: 0.85, d }, { c: PAL.green, o: 0.9, d: `M${x + 1} ${y - 9}c3 -3 7 -2 7 0c-3 2 -5 2 -7 0Z` }],
    glints: [dot(x - 2.4, y - 2.4, 1.4)],
  };
}

/** Daisies and buttercups at the given points. */
export function flowers(points, seed = 4) {
  const r = rng(seed);
  const fine = [];
  const washes = [];
  const whites = [];
  for (const [x, y] of points) {
    const yellow = r() < 0.4;
    const petals = frill(x, y, 2, 6, 1.4);
    fine.push(petals, `M${x} ${y + 3}l0 7`);
    if (yellow) washes.push({ c: PAL.ochre, o: 0.9, d: petals });
    else {
      whites.push(petals);
      washes.push({ c: PAL.ochre, o: 1, d: dot(x, y, 1.4) });
    }
  }
  return { fine, washes, whites };
}

/** A soft round cloud, centre (x, y), width w. */
export function cloud(x, y, w = 60) {
  const k = w / 60;
  const d = `M${x - 30 * k} ${y + 6 * k}C${x - 40 * k} ${y + 6 * k} ${x - 38 * k} ${y - 8 * k} ${x - 26 * k} ${y - 6 * k}C${x - 24 * k} ${y - 18 * k} ${x - 6 * k} ${y - 20 * k} ${x} ${y - 10 * k}C${x + 8 * k} ${y - 22 * k} ${x + 28 * k} ${y - 16 * k} ${x + 26 * k} ${y - 4 * k}C${x + 38 * k} ${y - 4 * k} ${x + 38 * k} ${y + 8 * k} ${x + 28 * k} ${y + 7 * k}Z`;
  return { fine: [d], washes: [{ c: PAL.sky, o: 0.3, d }] };
}
