import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';
import { bumpy } from '../puss-in-boots/characters.mjs';

// Ma Liang and the Magic Paintbrush: Ma Liang, the kind old man of the dream, the Emperor, the old
// farmer, the village children, the water buffalo, the little painted bird, the golden paintbrush,
// the boat with the red sail and the waves, drawn once here and placed in each picture with a
// transform (place); flip with scale(-1 1). The build only draws files named <n>.mjs, so this file
// is not a picture. Standing characters have their feet at y = 0 and look at us. Simple village
// clothes of old China; the Emperor in a yellow robe and a black official's hat with two wings.

export { at, bumpy, compose, dot, merge, oval, place };

const Z = (d) => `${d}Z`;
const W = (list, d) => list.map((w) => ({ ...w, d }));

/** An arm (limb along pts) in a sleeve (list of washes), ending in a round hand of radius r. */
function arm(pts, sleeve, r) {
  // the sleeve stops at the wrist, so the hand keeps its own colour
  const n = pts.length;
  const [x, y] = pts[n - 1];
  const [px, py] = pts[n - 2];
  const l = Math.hypot(x - px, y - py);
  const k = Math.min(0.8, (r * 0.75) / l);
  const d = limb([...pts.slice(0, -1), [f(x - (x - px) * k), f(y - (y - py) * k), pts[n - 1][2]]]);
  const h = dot(x, y, r);
  return { lines: [d], fine: [h], washes: [...W(sleeve, Z(d)), { c: PAL.rose, o: 0.6, d: h }] };
}

/** A leg (limb along pts) in trousers, with a cloth shoe pointing to dir (-1 left, 1 right). */
function leg(pts, trousers, dir, size = 1) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  const s = oval(x + dir * 2.5 * size, y + 4.5 * size, 7 * size, 4.2 * size);
  return {
    lines: [d, s],
    fine: [`M${f(x - 4.5 * size)} ${f(y - 5 * size)}q${f(4.5 * size)} 2 ${f(9 * size)} 0`],
    washes: [...W(trousers, Z(d)), { c: PAL.slate, o: 0.85, d: s }, { c: PAL.ink, o: 0.35, d: s }],
  };
}

/**
 * Eyes and mouth: eyes at (±ex, ey), mouth at my. mood: 'happy', 'shut' (beaming, eyes closed),
 * 'sleep' (eyes closed, calm), 'wow' / 'wowR' (eyes wide, brows up, a small "o"), 'peep' / 'peepL'
 * (looking right / left), 'laugh', 'cross' (brows down, a firm mouth), 'think' (looking up, lips
 * pressed), 'worried' (brows up in the middle, a wobbly mouth).
 */
function faceMarks({ mood, ex, ey, my, r = 1.8, w = 4.5 }) {
  const fine = [];
  const fills = [];
  const glints = [];
  const washes = [];
  const closed = (up) => `M${-ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0M${ex - 3} ${ey}q3 ${up ? -3.4 : 3} 6 0`;
  const eyes = (dx = 0, rr = r, dy = 0) => {
    fills.push(dot(-ex + dx, ey + dy, rr), dot(ex + dx, ey + dy, rr));
    glints.push(dot(-ex + dx - 0.5, ey + dy - 0.6, 0.55), dot(ex + dx - 0.5, ey + dy - 0.6, 0.55));
  };
  if (mood === 'laugh') {
    const m = `M${-w - 1} ${my - 1}C${-w} ${my + 8} ${w} ${my + 8} ${w + 1} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1} ${my - 1}Z`;
    fine.push(closed(true), m);
    washes.push({ c: PAL.red, o: 0.75, d: m });
  } else if (mood === 'shut') {
    fine.push(closed(true), `M${-w} ${my}q${w} 5 ${2 * w} 0`);
  } else if (mood === 'sleep') {
    fine.push(closed(false), `M${-w + 2} ${my + 1}q${w - 2} 2.5 ${2 * w - 4} 0`);
  } else if (mood === 'wow' || mood === 'wowR') {
    eyes(mood === 'wowR' ? 1.2 : 0, r + 0.5);
    fine.push(`M${-ex - 3} ${ey - 5}q3 -2.4 6 0M${ex - 3} ${ey - 5}q3 -2.4 6 0`);
    fills.push(oval(0, my + 1.5, 2.3, 2.9));
  } else if (mood === 'cross') {
    eyes();
    fine.push(`M${-ex - 3.5} ${ey - 6}L${-ex + 3} ${ey - 3.5}M${ex + 3.5} ${ey - 6}L${ex - 3} ${ey - 3.5}`, `M${-w + 1} ${my + 1.5}q${w - 1} -2 ${2 * w - 2} 0`);
  } else if (mood === 'think') {
    eyes(1, r, -1);
    fine.push(`M${-w + 1.5} ${my + 0.5}q${w - 1.5} 2.2 ${2 * w - 3} -0.5`);
  } else if (mood === 'worried') {
    eyes(0, r + 0.3);
    fine.push(`M${-ex - 3} ${ey - 4.5}L${-ex + 3} ${ey - 6.5}M${ex + 3} ${ey - 4.5}L${ex - 3} ${ey - 6.5}`, `M${-w + 1} ${my + 1}q${(w - 1) / 2} -2 ${w - 1} 0q${(w - 1) / 2} 2 ${w - 1} 0`);
  } else {
    const dx = mood === 'peep' ? 1.3 : mood === 'peepL' ? -1.3 : 0;
    eyes(dx);
    fine.push(`M${-w} ${my}q${w} 5 ${2 * w} 0`);
  }
  return { fine, fills, glints, washes };
}

const HAIR = [
  { c: PAL.slate, o: 0.9 },
  { c: PAL.ink, o: 0.5 },
];

/**
 * A village body (feet at 0,0), about 120 tall: a jacket that crosses over at the front, tied with
 * a sash, wide trousers and cloth shoes. Shoulders at (±16,-84), hips at (±8,-46). jacket, sash,
 * trousers: lists of washes. upper: only above y = -62.
 */
function villager({ jacket, sash, trousers, arms, legs, upper, head, hairUnder = [] }) {
  const coat = upper
    ? 'M-9 -90C-18 -88 -21 -80 -21 -70C-21 -66 -21 -64 -21.2 -62M21.2 -62C21 -64 21 -66 21 -70C21 -80 18 -88 9 -90'
    : 'M-9 -90C-18 -88 -21 -80 -21 -70C-21 -62 -22 -54 -23 -43C-8 -40 8 -40 23 -43C22 -54 21 -62 21 -70C21 -80 18 -88 9 -90';
  const coatFill = upper ? 'M-9 -90C-18 -88 -21 -80 -21 -70C-21 -66 -21 -64 -21.2 -62L21.2 -62C21 -64 21 -66 21 -70C21 -80 18 -88 9 -90C6 -93 -6 -93 -9 -90Z' : Z(`${coat}C6 -93 -6 -93 -9 -90`);
  // the front crosses from the left shoulder down to the right side, with two knot buttons
  const front = 'M-8 -90C-3 -82 4 -74 12 -66';
  const sashD = 'M-21.5 -61C-8 -58 8 -58 21.5 -61L21.6 -56C8 -53 -8 -53 -21.6 -56Z';
  const ends = 'M10 -55L12 -44L16 -45L14 -55';
  const legParts = upper ? [] : legs.map((l) => leg(l.pts, trousers, l.dir));
  return merge(
    ...legParts,
    {
      lines: [coat],
      fine: [front, 'M-4 -91L2 -86', ...(upper ? [] : [sashD, ends])],
      once: ['M4 -78l2.5 0M9 -71l2.5 0'],
      washes: [...W(jacket, coatFill), ...(upper ? [] : [...W(sash, sashD), ...W(sash, Z(ends))])],
    },
    ...arms.map((a) => arm(a, jacket, 4.3)),
    ...hairUnder,
    head,
  );
}

// =============================================================================================
// MA LIANG (feet at 0,0), about 128 tall: black hair with a straight fringe and a little topknot
// tied with a red ribbon, rosy cheeks, an indigo-blue jacket crossed over at the front with a red
// sash, grey trousers, black cloth shoes. Head at ML_HEAD; arms from the shoulders (±16,-84);
// legs two { pts, dir } from the hips (±8,-46). upper: only above y = -62.
// =============================================================================================
export const ML_HEAD = [0, -104];
export const ML_ARMS = {
  down: [
    [[-16, -84, 8], [-21, -71, 7.5], [-24, -58, 7]],
    [[16, -84, 8], [21, -71, 7.5], [24, -58, 7]],
  ],
};
export const ML_LEGS = {
  stand: [
    { pts: [[-8, -46, 11], [-9, -27, 10.5], [-10, -8, 10]], dir: -1 },
    { pts: [[8, -46, 11], [9, -27, 10.5], [10, -8, 10]], dir: 1 },
  ],
};
export function maLiangHead({ mood = 'happy' } = {}) {
  const face = 'M-12.5 -3C-13 8 -7 14 0 14C7 14 13 8 12.5 -3';
  const faceFill = `${face}C11 -10 -11 -10 -12.5 -3Z`;
  const hair = 'M-13.5 1C-15.5 -11 -9 -19 0 -19C9 -19 15.5 -11 13.5 1C12.5 -3 11 -5 8 -5.5C4 -6.5 -4 -6.5 -8 -5.5C-11 -5 -12.5 -3 -13.5 1Z';
  const bun = oval(0, -23, 6.5, 5.2);
  const ribbon = 'M-5.6 -20C-2 -18.6 2 -18.6 5.6 -20L5.4 -17.4C2 -16 -2 -16 -5.4 -17.4Z';
  const tails = 'M5 -18.5C8 -17 10 -14 11 -11M5 -18.5C9 -19 12 -18 14 -16';
  const m = faceMarks({ mood, ex: 4.6, ey: 1, my: 8, w: 4 });
  return {
    lines: [face, hair, bun],
    fine: ['M-12.6 -1q-4.5 0 -3 6M12.6 -1q4.5 0 3 6', 'M0.5 2.5c1.6 1.2 1.6 2.6 -0.6 3', ribbon, tails, 'M-5 -15q3 -2 6 -3M3 -14q3 -1 5 0', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: faceFill },
      { c: PAL.rose, o: 0.4, d: 'M-12.6 -1q-4.5 0 -3 6ZM12.6 -1q4.5 0 3 6Z' },
      ...W(HAIR, hair + bun),
      { c: PAL.red, o: 0.9, d: ribbon },
      { c: PAL.rose, o: 0.6, d: dot(-8, 5, 2.4) + dot(8, 5, 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: [...m.glints, 'M-6 -15q4 -3 9 -3q-5 1 -9 3Z'],
  };
}
const ML_JACKET = [
  { c: PAL.sky, o: 0.85 },
  { c: PAL.slate, o: 0.4 },
];
export function maLiang({ mood = 'happy', tilt = 0, arms = ML_ARMS.down, legs = ML_LEGS.stand, upper = false } = {}) {
  return villager({
    jacket: ML_JACKET,
    sash: [{ c: PAL.red, o: 0.8 }],
    trousers: [{ c: PAL.grey, o: 0.6 }, { c: PAL.slate, o: 0.2 }],
    arms,
    legs,
    upper,
    head: place(maLiangHead({ mood }), `translate(${ML_HEAD[0]} ${ML_HEAD[1]}) rotate(${tilt})`),
  });
}

// =============================================================================================
// THE GOLDEN PAINTBRUSH: held at (0,0), the handle running up along -y to the black tip at about
// (0,-46), a red tassel hanging from the end below the hand. shine: little rays round it.
// =============================================================================================
export function brush({ shine = true, wet = null } = {}) {
  const handle = limb([[0, 10, 4.6], [0, -30, 4.2]]);
  const ferrule = 'M-2.6 -30L2.6 -30L3 -34L-3 -34Z';
  const tip = 'M-3 -34C-4.5 -38 -2 -44 0 -48C2 -44 4.5 -38 3 -34Z';
  const tassel = 'M0 10C-1 14 -3 18 -4 22M0 10C0 14 0 18 0 23M0 10C1 14 3 18 4 22';
  const rays = shine ? 'M-9 -46l-6 -3M-8 -38l-7 1M0 -54l0 -7M8 -48l6 -5M9 -38l7 0M-7 -24l-5 2M7 -22l5 2' : '';
  return {
    lines: [handle, tip],
    fine: [ferrule, tassel, 'M-1 6l2 0M-1 -20l2 0', rays].filter(Boolean),
    washes: [
      { c: PAL.ochre, o: 0.95, d: Z(handle) },
      { c: PAL.ochre, o: 0.6, d: Z(handle) },
      { c: PAL.ochre, o: 0.95, d: ferrule },
      { c: wet ?? PAL.ink, o: wet ? 0.95 : 0.7, d: tip },
      { c: PAL.red, o: 0.85, d: 'M0 10C-2 14 -4 18 -5 22L5 22C4 18 2 14 0 10Z' },
    ],
    glints: ['M-1.6 4L-1.2 -24L-0.2 -24L-0.4 4Z'],
  };
}

// =============================================================================================
// THE KIND OLD MAN OF THE DREAM (feet at 0,0), about 150 tall: a bald head with a little white
// topknot, long white eyebrows, kind closed smiling eyes, a long white beard and moustache, a long
// pale celadon robe with wide sleeves and a slate sash. Head at OM_HEAD; arms from the shoulders (±18,-104).
// =============================================================================================
export const OM_HEAD = [0, -122];
export const OM_ARMS = {
  down: [
    [[-18, -104, 13], [-24, -86, 13], [-26, -70, 12]],
    [[18, -104, 13], [24, -86, 13], [26, -70, 12]],
  ],
};
const ROBE = [
  { c: PAL.sky, o: 0.4 },
  { c: PAL.green, o: 0.3 },
];
export function oldMan({ arms = OM_ARMS.down } = {}) {
  const scalp = 'M-11 -4C-12 -16 -6 -22 0 -22C6 -22 12 -16 11 -4';
  const knot = oval(0, -25, 5.5, 4.2);
  const tuftL = 'M-11 -8C-16 -7 -17 0 -13 3C-12 0 -11.5 -3 -11 -4Z';
  const tuftR = 'M11 -8C16 -7 17 0 13 3C12 0 11.5 -3 11 -4Z';
  const brows = 'M-9 -6C-6 -9 -3 -8 -1.5 -6M9 -6C6 -9 3 -8 1.5 -6';
  const browTails = 'M-9 -6C-12 -5 -13 -2 -13 1M9 -6C12 -5 13 -2 13 1';
  const beard = 'M-10 3C-12 16 -8 32 0 48C8 32 12 16 10 3C6 9 3 9.5 0 8C-3 9.5 -6 9 -10 3Z';
  const tache = 'M0 5.5C-3 4 -7 5 -9 9C-6 8 -3 8 0 7.5C3 8 6 8 9 9C7 5 3 4 0 5.5Z';
  const head = {
    lines: [Z(`${scalp}C11.5 5 7 11 0 11C-7 11 -11.5 5 -11 -4`), knot, beard],
    fine: [brows, browTails, tuftL, tuftR, tache, 'M-4 18q-1 10 1 20M4 18q1 8 -1 16M0 14l0 14', 'M-7.5 -1q2.5 -2.8 5 0M2.5 -1q2.5 -2.8 5 0', 'M0.4 1.5c1.4 1 1.4 2.4 -0.5 2.8'],
    washes: [
      { c: PAL.rose, o: 0.35, d: Z(`${scalp}C11.5 5 7 11 0 11C-7 11 -11.5 5 -11 -4`) },
      { c: PAL.rose, o: 0.6, d: dot(-7, 4, 2.2) + dot(7, 4, 2.2) },
    ],
    whites: [beard, knot, tuftL, tuftR, tache],
    glints: ['M-6 -18q4 -2 7 -1q-4 0 -7 1Z'],
  };
  const robe = 'M-9 -108C-19 -106 -23 -96 -24 -84C-26 -56 -30 -28 -33 -2C-12 2 12 2 33 -2C30 -28 26 -56 24 -84C23 -96 19 -106 9 -108';
  const robeFill = Z(`${robe}C5 -111 -5 -111 -9 -108`);
  const front = 'M-8 -108C-3 -98 4 -90 10 -82';
  const sash = 'M-24 -72C-8 -69 8 -69 24 -72L24 -66C8 -63 -8 -63 -24 -66Z';
  const shoes = 'M-14 -1C-22 -2 -24 3 -18 4L-5 4L-5 -1ZM14 -1C22 -2 24 3 18 4L5 4L5 -1Z';
  return merge(
    {
      lines: [shoes, robe],
      fine: [front, sash, 'M-12 -50q-3 20 -5 44M10 -44q3 18 4 38'],
      washes: [...W(ROBE, robeFill), { c: PAL.slate, o: 0.6, d: sash }, { c: PAL.slate, o: 0.8, d: shoes }],
    },
    ...arms.map((a) => arm(a, ROBE, 4.4)),
    place(head, `translate(${OM_HEAD[0]} ${OM_HEAD[1]})`),
  );
}

// =============================================================================================
// THE EMPEROR (feet at 0,0), about 165 tall: a calm, round face with a neat black moustache and a
// little beard, a black official's hat with a raised back and two long flat wings, a long yellow
// robe with a red collar and a round red emblem, and wide sleeves. Head at E_HEAD; arms from the
// shoulders (±22,-116). seated: sitting on his throne (knees just under the belt); upper: only
// above y = -70 (in the boat). mood as faceMarks, plus 'greedy' (eyes wide, a big grin).
// =============================================================================================
export const E_HEAD = [0, -138];
export const E_ARMS = {
  down: [
    [[-22, -116, 14], [-30, -96, 14], [-32, -80, 13]],
    [[22, -116, 14], [30, -96, 14], [32, -80, 13]],
  ],
};
const YELLOW = [{ c: PAL.ochre, o: 0.7 }];
const BLACK = [
  { c: PAL.slate, o: 0.95 },
  { c: PAL.ink, o: 0.6 },
];
export function emperorHat() {
  const cap = 'M-15 -2C-16 -14 -10 -21 0 -21C10 -21 16 -14 15 -2C8 -4.5 -8 -4.5 -15 -2Z';
  const back = 'M-9 -18C-10 -30 -5 -35 0 -35C5 -35 10 -30 9 -18Z';
  const wings = 'M-14 -12L-44 -15C-46 -13 -46 -9 -44 -8L-14 -7ZM14 -12L44 -15C46 -13 46 -9 44 -8L14 -7Z';
  return { lines: [back, cap, wings], washes: W(BLACK, back + cap + wings), glints: ['M-9 -14q4 -4 9 -4q-5 2 -9 4Z'] };
}
export function emperorHead({ mood = 'happy', hat = true } = {}) {
  const face = 'M-14 -3C-14.5 9 -7 16 0 16C7 16 14.5 9 14 -3';
  const faceFill = `${face}C10 -6 -10 -6 -14 -3Z`;
  const tache = 'M0 7.5C-3 6 -7 6.5 -9.5 10C-6 9.5 -3 9 0 9C3 9 6 9.5 9.5 10C7 6.5 3 6 0 7.5Z';
  const goatee = 'M-2.5 13.5C-2 17 -1 19 0 20C1 19 2 17 2.5 13.5C1 14.5 -1 14.5 -2.5 13.5Z';
  const greedy = mood === 'greedy';
  const m = faceMarks({ mood: greedy ? 'wow' : mood, ex: 5.2, ey: 1, my: 10, w: 4 });
  if (greedy) {
    m.fills.pop();
    m.fine.push('M-5 11.5C-3 14.5 3 14.5 5 11.5');
  }
  const head = {
    lines: [face, 'M-14 -3q-4 0 -3 6M14 -3q4 0 3 6'],
    fine: [tache, goatee, 'M0.4 3c1.6 1.2 1.6 2.6 -0.6 3', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.32, d: faceFill },
      ...W(HAIR, tache + goatee),
      { c: PAL.rose, o: 0.5, d: dot(-9, 6, 2.4) + dot(9, 6, 2.4) },
      ...m.washes,
    ],
    fills: m.fills,
    glints: m.glints,
  };
  return hat ? merge(head, emperorHat()) : head;
}
/** The outline of the seated Emperor's robe and head, to leave a hole for him in what is behind. */
export function emperorSeatedOutline() {
  const body =
    'M-12 -124C-24 -122 -29 -112 -30 -98C-31 -86 -34 -76 -40 -68C-46 -60 -46 -44 -42 -34C-40 -22 -40 -10 -38 -2C-12 1 12 1 38 -2C40 -10 40 -22 42 -34C46 -44 46 -60 40 -68C34 -76 31 -86 30 -98C29 -112 24 -122 12 -124C6 -127 -6 -127 -12 -124Z';
  return body + oval(E_HEAD[0], E_HEAD[1] - 2, 15, 14);
}
export function emperor({ mood = 'happy', tilt = 0, arms = E_ARMS.down, seated = false, upper = false, hat = true } = {}) {
  const top = 'M-12 -124C-24 -122 -29 -112 -30 -98';
  const topR = 'M12 -124C24 -122 29 -112 30 -98';
  let body;
  let fill;
  if (upper) {
    body = `${top}L-31 -70${topR}L31 -70`;
    fill = 'M-12 -124C-24 -122 -29 -112 -30 -98L-31 -70L31 -70L30 -98C29 -112 24 -122 12 -124Z';
  } else if (seated) {
    // a wide lap with round knees, the robe falling to the feet
    body = `${top}C-31 -86 -34 -76 -40 -68C-46 -60 -46 -44 -42 -34C-40 -22 -40 -10 -38 -2C-12 1 12 1 38 -2C40 -10 40 -22 42 -34C46 -44 46 -60 40 -68C34 -76 31 -86 30 -98C29 -112 24 -122 12 -124`;
    fill = Z(`${body}C6 -127 -6 -127 -12 -124`);
  } else {
    body = `${top}C-32 -70 -36 -36 -40 -2C-14 2 14 2 40 -2C36 -36 32 -70 30 -98C29 -112 24 -122 12 -124`;
    fill = Z(`${body}C6 -127 -6 -127 -12 -124`);
  }
  const collar = 'M-12 -124C-6 -116 0 -110 6 -104L10 -108C5 -114 2 -119 -2 -126C-6 -126 -9 -125 -12 -124Z';
  const belt = 'M-30 -86C-10 -82 10 -82 30 -86L30 -80C10 -76 -10 -76 -30 -80Z';
  const emblem = dot(14, -100, 6);
  const swirl = 'M10 -100c2 -4 7 -3 7 1c0 3 -4 4 -5 1';
  const lines = [body];
  const fine = [collar, belt, emblem, swirl];
  const washes = [...W(YELLOW, fill), { c: PAL.red, o: 0.85, d: collar }, { c: PAL.red, o: 0.8, d: belt }, { c: PAL.red, o: 0.7, d: emblem }];
  if (!upper) {
    // a red hem and the tips of black shoes
    const hem = seated ? 'M-40 -12C-14 -9 14 -9 40 -12L38 -2C12 1 -12 1 -38 -2Z' : 'M-39 -12C-14 -8 14 -8 39 -12L40 -2C14 2 -14 2 -40 -2Z';
    const shoes = 'M-22 0C-30 0 -32 6 -26 6L-10 6L-10 0ZM22 0C30 0 32 6 26 6L10 6L10 0Z';
    lines.push(shoes);
    fine.push(hem, seated ? 'M-40 -68C-28 -62 -12 -60 -2 -62M40 -68C28 -62 12 -60 2 -62M0 -60L0 -12' : 'M-6 -76q-2 30 -4 62M10 -70q2 26 2 56');
    washes.push({ c: PAL.red, o: 0.8, d: hem }, ...W(BLACK, shoes));
  }
  return merge(
    { lines, fine, washes },
    ...arms.map((a) => arm(a, YELLOW, 5)),
    place(emperorHead({ mood, hat }), `translate(${E_HEAD[0]} ${E_HEAD[1]}) rotate(${tilt})`),
  );
}

// =============================================================================================
// THE OLD FARMER (feet at 0,0), about 135 tall: a wide pointed straw hat, a short grey beard, a
// faded terracotta jacket with a grey sash, rolled grey trousers. Same build as Ma Liang, scaled
// 1.08 when placed. Head at ML_HEAD.
// =============================================================================================
export function farmerHead({ mood = 'happy' } = {}) {
  const face = 'M-12.5 -3C-13 8 -7 14 0 14C7 14 13 8 12.5 -3';
  const faceFill = `${face}C11 -10 -11 -10 -12.5 -3Z`;
  const hat = 'M-34 -2L0 -26L34 -2C22 1 -22 1 -34 -2Z';
  const beard = 'M-8 9C-8 16 -4 21 0 22C4 21 8 16 8 9C5 12 -5 12 -8 9Z';
  const m = faceMarks({ mood, ex: 4.6, ey: 2, my: 7.5, w: 3.6 });
  return {
    lines: [face, hat, beard],
    fine: ['M-12.6 0q-4.5 0 -3 6M12.6 0q4.5 0 3 6', 'M0.5 3c1.6 1.2 1.6 2.6 -0.6 3', 'M-22 -8L0 -26L-8 -1M14 -12L0 -26L8 -1', 'M-9 -3q-3 1 -4 4M9 -3q3 1 4 4', ...m.fine],
    washes: [
      { c: PAL.rose, o: 0.35, d: faceFill },
      { c: PAL.ochre, o: 0.85, d: hat },
      { c: PAL.terracotta, o: 0.25, d: hat },
      { c: PAL.rose, o: 0.55, d: dot(-8, 6, 2.2) + dot(8, 6, 2.2) },
      ...m.washes,
    ],
    whites: [beard],
    fills: m.fills,
    glints: m.glints,
  };
}
export function farmer({ mood = 'happy', tilt = 0, arms = ML_ARMS.down, legs = ML_LEGS.stand } = {}) {
  return villager({
    jacket: [{ c: PAL.terracotta, o: 0.6 }, { c: PAL.grey, o: 0.4 }],
    sash: [{ c: PAL.slate, o: 0.6 }],
    trousers: [{ c: PAL.grey, o: 0.55 }],
    arms,
    legs,
    upper: false,
    head: place(farmerHead({ mood }), `translate(${ML_HEAD[0]} ${ML_HEAD[1]}) rotate(${tilt})`),
  });
}

// =============================================================================================
// THE VILLAGE CHILDREN (feet at 0,0), the same build as Ma Liang, placed at about 0.75: 'girl' (two
// black buns with red ribbons, a rose jacket, a green sash) and 'boy' (a round shaved head with a
// little tuft, a green jacket, an ochre sash).
// =============================================================================================
export function childHead({ kind = 'girl', mood = 'happy' } = {}) {
  const face = 'M-12.5 -3C-13 8 -7 14 0 14C7 14 13 8 12.5 -3';
  const faceFill = `${face}C11 -10 -11 -10 -12.5 -3Z`;
  const m = faceMarks({ mood, ex: 4.6, ey: 1.5, my: 8, w: 4 });
  const base = {
    fine: ['M-12.6 -1q-4.5 0 -3 6M12.6 -1q4.5 0 3 6', ...m.fine],
    washes: [{ c: PAL.rose, o: 0.32, d: faceFill }, { c: PAL.rose, o: 0.6, d: dot(-8, 6, 2.4) + dot(8, 6, 2.4) }, ...m.washes],
    fills: m.fills,
    glints: m.glints,
  };
  if (kind === 'girl') {
    const hair = 'M-13.5 1C-15.5 -11 -9 -19 0 -19C9 -19 15.5 -11 13.5 1C11 -5 6 -7 0 -6C-6 -7 -11 -5 -13.5 1Z';
    const buns = oval(-13, -15, 6, 5.5) + oval(13, -15, 6, 5.5);
    const ribbons = dot(-8.5, -12, 2.4) + dot(8.5, -12, 2.4);
    return merge(base, {
      lines: [face, hair, buns],
      fine: [ribbons, 'M0 -18L0 -7'],
      washes: [...W(HAIR, hair + buns), { c: PAL.red, o: 0.9, d: ribbons }],
    });
  }
  const scalp = 'M-12.5 -3C-13.5 -14 -7 -19 0 -19C7 -19 13.5 -14 12.5 -3';
  const tuft = 'M-4 -18C-5 -24 -1 -27 2 -25C4 -24 4 -20 3 -18.5Z';
  return merge(base, {
    lines: [face, scalp, tuft],
    washes: [{ c: PAL.rose, o: 0.3, d: Z(`${scalp}C11 -10 -11 -10 -12.5 -3`) }, { c: PAL.slate, o: 0.3, d: Z(`${scalp}C11 -6 -11 -6 -12.5 -3`) }, ...W(HAIR, tuft)],
  });
}
export function child({ kind = 'girl', mood = 'happy', tilt = 0, arms = ML_ARMS.down, legs = ML_LEGS.stand } = {}) {
  const girl = kind === 'girl';
  return villager({
    jacket: girl ? [{ c: PAL.rose, o: 0.8 }, { c: PAL.red, o: 0.2 }] : [{ c: PAL.green, o: 0.8 }],
    sash: girl ? [{ c: PAL.green, o: 0.85 }] : [{ c: PAL.ochre, o: 0.9 }],
    trousers: [{ c: PAL.grey, o: 0.55 }],
    arms,
    legs,
    upper: false,
    head: place(childHead({ kind, mood }), `translate(${ML_HEAD[0]} ${ML_HEAD[1]}) rotate(${tilt})`),
  });
}

// =============================================================================================
// THE WATER BUFFALO (feet at 0,0), side view facing left, its face turned a little to us: a big
// grey body, wide curved horns, a pale muzzle, a thin tail. About 170 long, 110 tall to the horns.
// =============================================================================================
export const BUFFALO_NECK = [-56, -66];
export function buffalo() {
  const body = 'M-52 -82C-64 -76 -66 -54 -60 -42C-44 -34 34 -34 54 -40C66 -46 68 -66 60 -78C50 -90 22 -92 0 -90C-20 -90 -40 -88 -52 -82Z';
  const xs = [-46, -30, 34, 50];
  const legsD = xs.map((x) => `M${x - 6} -38L${x - 5} -6L${x + 5} -6L${x + 6} -38`).join('');
  const hooves = xs.map((x) => `M${x - 5.5} -6L${x + 5.5} -6L${x + 6} 1L${x - 6} 1Z`).join('');
  const head = 'M-54 -72C-66 -80 -84 -78 -92 -66C-98 -56 -96 -44 -86 -38C-76 -34 -64 -40 -58 -50C-55 -56 -53 -64 -54 -72Z';
  const muzzle = oval(-88, -46, 9.5, 7.5);
  const horns = 'M-82 -76C-96 -76 -110 -84 -112 -98C-104 -90 -96 -86 -84 -86C-80 -84 -79 -80 -82 -76ZM-64 -78C-52 -82 -42 -92 -42 -106C-48 -96 -56 -92 -66 -88C-70 -86 -69 -80 -64 -78Z';
  const ear = 'M-58 -72C-50 -74 -46 -70 -48 -66C-52 -66 -56 -67 -58 -70Z';
  const tail = 'M60 -72C70 -66 72 -50 70 -32';
  const tuft = 'M66 -34C64 -26 72 -24 74 -30C74 -34 70 -36 68 -34Z';
  return {
    lines: [body, legsD, hooves, tail, head, horns, ear, muzzle],
    fine: [tuft, 'M-92 -46l0 0.5M-84 -46l0 0.5', 'M-20 -84q10 -4 22 -2M10 -60q12 6 30 2', 'M-80 -62q3 -2 6 0'],
    washes: [
      { c: PAL.grey, o: 0.85, d: `${body}${head}${legsD}Z${ear}` },
      { c: PAL.slate, o: 0.45, d: `${body}${head}${legsD}Z${ear}` },
      { c: PAL.grey, o: 0.4, d: horns },
      { c: PAL.ochre, o: 0.3, d: horns },
      { c: PAL.rose, o: 0.55, d: muzzle },
      { c: PAL.slate, o: 0.9, d: hooves + tuft },
    ],
    fills: [dot(-77, -60, 2.1)],
    glints: [dot(-77.6, -60.6, 0.6)],
  };
}

/** The wooden plough, its blade in the ground at (0,0) and its handles rising to the right. */
export function plough() {
  const beam = limb([[-70, -38, 4], [-10, -16, 4.5], [4, -10, 4.5]]);
  const handle = limb([[0, 0, 5], [18, -36, 4.5], [30, -60, 4.5]]);
  const blade = 'M-6 -2L8 -6L12 2L-2 4Z';
  return {
    lines: [beam, handle, blade],
    washes: [{ c: PAL.terracotta, o: 0.75, d: Z(beam) + Z(handle) }, { c: PAL.ochre, o: 0.4, d: Z(beam) + Z(handle) }, { c: PAL.grey, o: 0.9, d: blade }],
  };
}

// =============================================================================================
// THE LITTLE PAINTED BIRD (centre 0,0), flying to the right: a round sky-blue body, a red tail,
// a bright black eye and an ochre beak. wings: 'up' or 'down'. About 40 wide.
// =============================================================================================
export function bird({ wings = 'up', sparrow = false } = {}) {
  const body = 'M-12 2C-12 -6 -4 -10 4 -9C10 -8 13 -4 13 0C13 6 6 9 -2 9C-8 9 -12 7 -12 2Z';
  const tail = 'M-11 0L-24 -6L-21 2L-25 8L-10 5Z';
  const beak = 'M13 -3L20 -1L13 2Z';
  const wing =
    wings === 'up'
      ? 'M-4 -6C-8 -16 -4 -24 4 -26C4 -18 6 -12 6 -6Z'
      : wings === 'fold'
        ? 'M-10 0C-6 -6 4 -6 8 0C4 4 -4 4 -10 0Z'
        : 'M-4 2C-6 10 -2 16 6 18C6 12 7 6 6 2Z';
  const feet = wings === 'fold' ? ['M-2 9l-1 6M3 9l1 6M-5 15l4 0M2 15l4 0'] : [];
  return {
    lines: [body, tail, wing],
    fine: [beak, 'M-1 -12q3 -1 4 2', ...feet],
    washes: [
      { c: sparrow ? PAL.terracotta : PAL.sky, o: sparrow ? 0.6 : 0.95, d: body },
      { c: sparrow ? PAL.grey : PAL.red, o: 0.9, d: tail },
      { c: sparrow ? PAL.terracotta : PAL.sky, o: 0.8, d: wing },
      { c: PAL.slate, o: 0.3, d: wing },
      { c: PAL.ochre, o: 0.95, d: beak },
      { c: PAL.rose, o: 0.5, d: 'M-6 4C-2 8 6 8 10 3C6 5 -2 5 -6 4Z' },
    ],
    fills: [dot(7, -3, 1.8)],
    glints: [dot(6.5, -3.6, 0.55)],
  };
}

// =============================================================================================
// THE BOAT (centre of the deck at 0,0), about 150 long: a wooden hull with an ochre stripe, a mast
// and a red Chinese sail with bamboo battens. sail: 'full' (bellying out to the right, in the wind)
// or 'flat'.
// =============================================================================================
export function boat({ sail = 'full' } = {}) {
  const hull = 'M-76 -8C-70 -4 -66 0 -62 2L62 2C66 0 70 -4 76 -10C70 6 50 18 0 18C-50 18 -70 6 -76 -8Z';
  const rim = 'M-74 -6C-40 2 40 2 74 -8';
  const stripe = 'M-68 4C-40 10 40 10 68 2C64 8 56 12 50 13C20 15 -20 15 -50 13C-58 11 -64 8 -68 4Z';
  const mast = 'M-4 0L-4 -118';
  const sailD =
    sail === 'full'
      ? 'M-2 -114C20 -112 40 -104 52 -88C60 -70 60 -44 52 -20C40 -14 18 -12 -2 -12Z'
      : 'M-2 -114L34 -110C38 -80 38 -44 34 -14L-2 -12Z';
  const battens =
    sail === 'full'
      ? 'M-2 -94C20 -92 42 -90 56 -82M-2 -74C20 -72 46 -70 59 -64M-2 -54C22 -52 46 -50 59 -46M-2 -34C20 -32 42 -30 56 -27'
      : 'M-2 -94L36 -92M-2 -74L37 -73M-2 -54L37 -53M-2 -34L36 -33';
  return {
    lines: [hull, mast, sailD],
    fine: [rim, battens, 'M-40 -1L-40 12M0 0L0 16M40 -1L40 12'],
    washes: [
      { c: PAL.terracotta, o: 0.75, d: hull },
      { c: PAL.grey, o: 0.35, d: hull },
      { c: PAL.ochre, o: 0.9, d: stripe },
      { c: PAL.red, o: 0.82, d: sailD },
      { c: PAL.terracotta, o: 0.8, d: limb([[-4, 0, 4], [-4, -118, 3.5]]) + 'Z' },
    ],
  };
}

/** A wavy line of n waves from x0 to x1 at height y, each amp tall; curl: little foam hooks. */
export function waves(x0, x1, y, n, amp, curl = false) {
  const w = (x1 - x0) / n;
  let d = `M${f(x0)} ${f(y)}`;
  for (let i = 0; i < n; i++) {
    const x = x0 + i * w;
    d += `C${f(x + w * 0.25)} ${f(y - amp)} ${f(x + w * 0.6)} ${f(y - amp)} ${f(x + w * 0.7)} ${f(y - amp * 0.4)}`;
    if (curl) d += `C${f(x + w * 0.62)} ${f(y - amp * 0.9)} ${f(x + w * 0.5)} ${f(y - amp * 0.5)} ${f(x + w * 0.58)} ${f(y - amp * 0.3)}M${f(x + w * 0.7)} ${f(y - amp * 0.4)}`;
    d += `C${f(x + w * 0.8)} ${f(y + amp * 0.1)} ${f(x + w * 0.9)} ${f(y)} ${f(x + w)} ${f(y)}`;
  }
  return d;
}

/** A swirl of wind starting at (x,y) blowing to the right, about len long. */
export function wind(x, y, len, s = 1) {
  return `M${f(x)} ${f(y)}C${f(x + len * 0.4)} ${f(y - 6 * s)} ${f(x + len * 0.75)} ${f(y + 4 * s)} ${f(x + len)} ${f(y - 4 * s)}c${f(6 * s)} ${f(-6 * s)} ${f(0)} ${f(-14 * s)} ${f(-6 * s)} ${f(-10 * s)}c${f(-4 * s)} ${f(3 * s)} ${f(-1 * s)} ${f(8 * s)} ${f(4 * s)} ${f(6 * s)}`;
}

/** A sparkle (four-pointed star) of size s at (x,y), as path data for a wash or a fine line. */
export const sparkle = (x, y, s) => `M${f(x)} ${f(y - s)}Q${f(x + s * 0.18)} ${f(y - s * 0.18)} ${f(x + s)} ${f(y)}Q${f(x + s * 0.18)} ${f(y + s * 0.18)} ${f(x)} ${f(y + s)}Q${f(x - s * 0.18)} ${f(y + s * 0.18)} ${f(x - s)} ${f(y)}Q${f(x - s * 0.18)} ${f(y - s * 0.18)} ${f(x)} ${f(y - s)}Z`;
