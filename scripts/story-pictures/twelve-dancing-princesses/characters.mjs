import { PAL } from '../lib.mjs';
import { at, compose, dot, f, limb, merge, oval, place } from '../stone-soup/characters.mjs';
import { arm, faceMarks } from '../sleeping-beauty/characters.mjs';
import { sparkles, star5, twinkle } from '../cinderella/characters.mjs';

// The Twelve Dancing Princesses: the characters and props shared by the ten pictures, drawn once
// here and placed in each picture with a transform (place). The build only draws files named
// <n>.mjs, so this file is not a picture. Standing characters have their feet at y = 0 and face us;
// their eyes look left or right (look). Sitting characters sit on the chair (chair()) at y = 0.

export { at, compose, dot, merge, oval, place, sparkles, star5, twinkle };

const Z = (d) => `${d}Z`;
const W = (c, o, d) => ({ c, o, d });
const cheeks = (x = 7.5, y = 5, r = 2.3, o = 0.7) => W(PAL.rose, o, dot(-x, y, r) + dot(x, y, r));
const shift = (pts, dx = 0, dy = 0) => pts.map(([x, y, w]) => [x + dx, y + dy, w]);
const mirror = (pts) => pts.map(([x, y, w]) => [-x, y, w]);

/**
 * Eyes and mouth. Moods from Sleeping Beauty (happy, asleep, smile, cross, worried, wow) and these:
 * puzzled (eyes up, one brow raised, a wiggly mouth), laugh (eyes shut, mouth wide open), snore
 * (eyes shut, mouth a round "o"), peek (one eye shut, one open looking sideways: pretending to
 * sleep), puff (eyes squeezed, cheeks blown out, a tiny "o").
 */
export function face({ mood = 'happy', look = 0, ex = 4.6, ey = 0, my = 7, w = 3.6 }) {
  const out = { fine: [], fills: [], glints: [], washes: [], whites: [] };
  const shutDown = `M${-ex - 3} ${ey - 0.5}q3 2.8 6 0M${ex - 3} ${ey - 0.5}q3 2.8 6 0`;
  const shutUp = `M${-ex - 3} ${ey + 1}q3 -3.4 6 0M${ex - 3} ${ey + 1}q3 -3.4 6 0`;
  if (mood === 'puzzled') {
    out.fills.push(dot(-ex + look * 1.2, ey - 0.8, 1.7), dot(ex + look * 1.2, ey - 0.8, 1.7));
    out.glints.push(dot(-ex + look * 1.2 - 0.5, ey - 1.4, 0.5), dot(ex + look * 1.2 - 0.5, ey - 1.4, 0.5));
    out.fine.push(`M${-ex - 3.5} ${ey - 5}l7 0.6M${ex - 3.5} ${ey - 7}q3.5 -3 7 0`);
    out.fine.push(`M${-w} ${my + 1}q${w / 2} -2 ${w} 0q${w / 2} 2 ${w} -0.5`);
  } else if (mood === 'laugh') {
    const mouth = `M${-w - 1.5} ${my - 1}C${-w} ${my + 7} ${w} ${my + 7} ${w + 1.5} ${my - 1}C${w / 2} ${my} ${-w / 2} ${my} ${-w - 1.5} ${my - 1}Z`;
    out.fine.push(shutUp, mouth);
    out.washes.push(W(PAL.red, 0.75, mouth));
  } else if (mood === 'snore') {
    const o = oval(0, my + 1.5, 2, 2.4);
    out.fine.push(shutDown, o);
    out.washes.push(W(PAL.red, 0.6, o));
  } else if (mood === 'peek') {
    out.fine.push(`M${-ex - 3} ${ey - 0.5}q3 2.8 6 0`);
    out.fills.push(dot(ex + 1.2, ey, 1.6));
    out.glints.push(dot(ex + 0.7, ey - 0.6, 0.5));
    out.fine.push(`M${-w} ${my}q${w} 3.5 ${2 * w} -1`);
  } else if (mood === 'puff') {
    out.fine.push(`M${-ex - 2.5} ${ey - 2}l4 2l-4 2M${ex + 2.5} ${ey - 2}l-4 2l4 2`);
    out.fills.push(dot(0, my + 1, 1.6));
    out.washes.push(cheeks(7.5, my - 1, 3.6, 0.85));
  } else {
    return faceMarks({ mood, look, ex, ey, my, w });
  }
  return out;
}

const nose = 'M0.5 2.4c1.5 1.1 1.5 2.3 -0.5 2.6';

/** Turns placed ink into a faint dashed outline: someone wearing the cloak of invisibility. */
export function ghost(ch) {
  const once = [...ch.lines, ...ch.fine].map((d) => `<path d="${d}" stroke-dasharray="2.5 4.5" opacity="0.7"/>`).join('');
  return { once, washes: ch.washes.map((w) => ({ c: PAL.grey, o: 0.08, d: w.d })) };
}

// =============================================================================================
// THE KING: about 155 tall and round, a tall ochre crown (tilt to knock it askew), bushy grey
// eyebrows, a big grey cloud of a beard, a red robe with an ermine cape collar and an ochre belt.
// Head at K_HEAD; shoulders at (±22, -98).
// =============================================================================================
export const K_HEAD = [0, -120];
export const K_ARMS = {
  down: [
    [[-22, -98, 9], [-31, -80, 8], [-35, -62, 8], [-34, -56, 8]],
    [[22, -98, 9], [31, -80, 8], [35, -62, 8], [34, -56, 8]],
  ],
  // left hand scratching the side of his head, right hand held high (holding something up)
  puzzle: [
    [[-22, -98, 9], [-38, -108, 8], [-28, -128, 8], [-16, -131, 8]],
    [[22, -98, 9], [40, -108, 8], [46, -128, 8], [47, -140, 8]],
  ],
  // both hands up, open, in surprise
  wonder: [
    [[-22, -98, 9], [-38, -98, 8], [-46, -110, 8], [-48, -118, 8]],
    [[22, -98, 9], [38, -98, 8], [46, -110, 8], [48, -118, 8]],
  ],
};
export function kingHead({ mood = 'happy', look = 0, tilt = 0 } = {}) {
  const top = 'M-13 3C-14 -10 -8 -18 0 -18C8 -18 14 -10 13 3';
  const beard = 'M-13 2C-18 8 -16 16 -12 20C-12 26 -6 30 -2 30C0 33 4 32 6 29C10 30 14 25 13 20C17 14 18 7 13 2C10 8 6 9 3 8C1 10 -1 10 -3 8C-6 9 -10 8 -13 2Z';
  const moust = 'M0 7C-3 4 -9 4 -12 8C-8 7 -4 9 0 8C4 9 8 7 12 8C9 4 3 4 0 7Z';
  const hair = 'M-13 -4C-19 -6 -20 2 -15 4M13 -4C19 -6 20 2 15 4';
  const crown = 'M-12 -14L-13 -32L-6 -23L0 -36L6 -23L13 -32L12 -14C5 -17 -5 -17 -12 -14Z';
  const t = `translate(${f(tilt * 0.25)} ${f(Math.abs(tilt) * 0.08)}) rotate(${tilt} 0 -15)`;
  const tp = (d) => place({ lines: [d] }, t).lines[0];
  const m = face({ mood, look, ex: 5, ey: -4, my: 9, w: 2.6 });
  const brows = mood === 'puzzled' ? '' : 'M-9.5 -9q4 -3 7.5 -1M2 -10q4 -2 7.5 1';
  return {
    lines: [top, beard, tp(crown)],
    fine: [moust, hair, brows, 'M-7 17q-1 5 1 9M6 17q1 5 -1 9M0 19l0 8', ...m.fine.filter((d) => !d.includes('q') || mood !== 'happy' || true)],
    washes: [
      W(PAL.rose, 0.35, Z(`${top}C9 6 -9 6 -13 3`)),
      W(PAL.rose, 0.6, oval(0, 2.4, 2.8, 2.4)),
      W(PAL.grey, 0.75, beard + moust),
      W(PAL.grey, 0.6, 'M-13 -4C-19 -6 -20 2 -15 4ZM13 -4C19 -6 20 2 15 4Z'),
      W(PAL.ochre, 1, tp(crown)),
      W(PAL.red, 0.9, tp(dot(0, -20, 1.8))),
      cheeks(9, 0, 2.3, 0.6),
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, tp(dot(-7, -25, 0.9)), tp(dot(7, -25, 0.9))],
  };
}
export function king({ mood = 'happy', look = 0, arms = K_ARMS.down, tilt = 0 } = {}) {
  const robe = 'M-14 -104C-26 -101 -32 -92 -34 -76C-37 -52 -41 -26 -44 -2C-14 3 14 3 44 -2C41 -26 37 -52 34 -76C32 -92 26 -101 14 -104';
  const collar = 'M-24 -100C-31 -95 -31 -86 -24 -83C-12 -79 12 -79 24 -83C31 -86 31 -95 24 -100C12 -105 -12 -105 -24 -100Z';
  // the cape collar's middle is hidden by the beard
  const collarEdge = 'M-15 -103C-22 -102 -31 -95 -31 -89C-31 -84 -24 -82 -15 -80.5M15 -103C22 -102 31 -95 31 -89C31 -84 24 -82 15 -80.5';
  const belt = 'M-37 -62C-12 -56 12 -56 37 -62L38 -55C12 -49 -12 -49 -38 -55Z';
  const hem = 'M-43 -9C-14 -4 14 -4 43 -9L44 -2C14 3 -14 3 -44 -2Z';
  const spots = [[-20, -92], [-8, -86], [6, -86], [18, -92], [-30, -5], [-12, -2], [12, -2], [30, -5]].map(([x, y]) => dot(x, y, 1.1)).join('');
  const shoes = `${oval(-14, 0, 7, 3)}${oval(14, 0, 7, 3)}`;
  const parts = [
    { lines: [shoes], washes: [W(PAL.slate, 0.8, shoes)] },
    {
      lines: [robe],
      fine: [collarEdge, belt, hem, 'M-20 -50q-6 22 -14 42M20 -50q6 22 14 42M0 -79L0 -59M0 -49L0 -6', dot(0, -59, 3)],
      washes: [{ ...W(PAL.red, 0.78, Z(robe) + collar), rule: 'evenodd' }, W(PAL.ochre, 0.9, belt + dot(0, -59, 3))],
      whites: [hem],
      fills: [spots],
    },
  ];
  for (const a of arms) parts.push(arm(a, [W(PAL.red, 0.72)], 5));
  parts.push(place(kingHead({ mood, look, tilt }), `translate(${K_HEAD[0]} ${K_HEAD[1]}) scale(1.18)`));
  return merge(...parts);
}

// =============================================================================================
// THE SOLDIER: about 150 tall, a kind round face, short terracotta hair, a slate cap with a red
// band, a long old slate coat with a red collar, ochre buttons and a grey patch, grey trousers and
// dusty terracotta boots. Head at S_HEAD (S_HEAD_SIT sitting); shoulders at (±19, -110), or 26
// lower when he sits. sit: on a chair seat at y = -40 (chair()). upper: down to the waist only.
// =============================================================================================
export const S_HEAD = [0, -128];
export const S_SIT = 26;
export const S_ARMS = {
  down: [
    [[-19, -109, 8], [-25, -92, 7], [-28, -76, 7], [-28, -70, 7]],
    [[19, -109, 8], [25, -92, 7], [28, -76, 7], [28, -70, 7]],
  ],
  // both hands held out in front, to the left (taking something)
  take: [
    [[-19, -109, 8], [-32, -100, 7], [-44, -94, 7], [-52, -92, 7]],
    [[19, -109, 8], [14, -94, 7], [-6, -90, 7], [-22, -90, 7]],
  ],
  // right hand out to his left, low, tipping a cup (picture right)
  pour: [
    [[-19, -109, 8], [-26, -94, 7], [-22, -78, 7], [-14, -74, 7]],
    [[19, -109, 8], [32, -98, 7], [44, -88, 7], [52, -84, 7]],
  ],
  // hands folded on his tummy (asleep, or pretending)
  fold: [
    [[-19, -109, 8], [-26, -94, 7], [-16, -80, 7], [-6, -78, 7]],
    [[19, -109, 8], [26, -94, 7], [16, -80, 7], [6, -78, 7]],
  ],
  // dancing: both arms up and out
  dance: [
    [[-19, -109, 8], [-32, -118, 7], [-40, -132, 7], [-42, -140, 7]],
    [[19, -109, 8], [32, -118, 7], [40, -132, 7], [42, -140, 7]],
  ],
  // reaching up to the right, snapping a twig
  snap: [
    [[-19, -109, 8], [-25, -92, 7], [-28, -76, 7], [-28, -70, 7]],
    [[19, -109, 8], [32, -120, 7], [42, -134, 7], [48, -142, 7]],
  ],
  // holding things up in his right hand to show them (to the left), left hand down
  show: [
    [[-19, -109, 8], [-34, -104, 7], [-46, -108, 7], [-52, -114, 7]],
    [[19, -109, 8], [25, -92, 7], [28, -76, 7], [28, -70, 7]],
  ],
  // sitting in the boat, hands on his knees
  knees: [
    [[-19, -109, 8], [-24, -94, 7], [-22, -80, 7], [-20, -74, 7]],
    [[19, -109, 8], [24, -94, 7], [22, -80, 7], [20, -74, 7]],
  ],
};
export function soldierHead({ mood = 'happy', look = 0 } = {}) {
  const faceD = 'M-12 -8C-13 4 -7 13 0 13C7 13 13 4 12 -8';
  const ears = 'M-12 -3C-16 -4 -16 3 -12 3M12 -3C16 -4 16 3 12 3';
  const hair = 'M-12 -8C-14 -12 -13 -15 -11 -16L-11 -10ZM12 -8C14 -12 13 -15 11 -16L11 -10Z';
  const cap = 'M-11 -13L-12 -30C-4 -33 4 -33 12 -30L11 -13';
  const band = 'M-11.4 -19C-4 -21 4 -21 11.4 -19L11.2 -14C4 -16 -4 -16 -11.2 -14Z';
  const brim = 'M-14 -13C-6 -16 6 -16 14 -13C12 -9 -12 -9 -14 -13Z';
  const m = face({ mood, look, ex: 4.8, ey: -3, my: 6, w: 3.6 });
  return {
    lines: [faceD, cap, brim],
    fine: [ears, band, nose, 'M-3 -26q3 -2 6 0', ...m.fine],
    washes: [
      W(PAL.rose, 0.32, Z(`${faceD}C8 -11 -8 -11 -12 -8`)),
      W(PAL.rose, 0.4, Z(ears)),
      W(PAL.terracotta, 0.85, hair),
      W(PAL.slate, 0.85, Z(cap)),
      W(PAL.red, 0.85, band),
      W(PAL.slate, 1, brim),
      W(PAL.ochre, 1, dot(0, -25, 2)),
      cheeks(8, 3, 2.3, 0.65),
      ...m.washes,
    ],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, dot(-0.6, -25.6, 0.7)],
  };
}
export function soldier({ mood = 'happy', look = 0, arms = S_ARMS.down, sit = false, upper = false } = {}) {
  const dy = sit ? S_SIT : 0;
  const parts = [];
  const torso = 'M-10 -114C-18 -113 -21 -106 -21 -96C-21 -84 -21 -74 -22 -64';
  const torsoR = 'C21 -74 21 -84 21 -96C21 -106 18 -113 10 -114';
  let coat;
  if (upper) coat = `${torso}L-22 -60M22 -60L22 -64${torsoR}`;
  else if (sit) coat = `${torso}C-26 -63 -31 -61 -31 -58C-31 -56 -29 -55 -26 -55L26 -55C29 -55 31 -56 31 -58C31 -61 26 -63 22 -64${torsoR}`;
  else coat = `${torso}C-23 -56 -24 -48 -26 -40C-10 -36 10 -36 26 -40C24 -48 23 -56 22 -64${torsoR}`;
  const coatFill = upper ? `${torso}L-22 -60L22 -60L22 -64${torsoR}Z` : Z(coat);
  const collar = 'M-10 -114L-4 -104L0 -112L4 -104L10 -114C4 -116 -4 -116 -10 -114Z';
  const front = upper ? 'M0 -110L0 -62' : sit ? 'M0 -110L0 -56' : 'M0 -110L0 -38';
  const buttons = [-102, -92, -82, -72].map((y) => dot(-4.5, y, 1.5) + dot(4.5, y, 1.5)).join('');
  const patch = 'M-17 -84l7 -1l1 7l-7 1Z';
  const epaulettes = `${oval(-17, -111, 6, 3)}${oval(17, -111, 6, 3)}`;
  parts.push({
    lines: [coat],
    fine: [collar, front, epaulettes, patch, 'M-16.5 -82.5l1 0.5M-14.5 -78.7l1 0.6', ...(upper || sit ? [] : ['M-14 -62q-4 10 -8 20M14 -62q4 10 8 20'])],
    washes: [W(PAL.slate, 0.78, coatFill), W(PAL.red, 0.85, collar), W(PAL.ochre, 0.95, epaulettes + buttons), W(PAL.grey, 0.8, patch)],
    fills: [],
    glints: [],
  });
  parts.push({ fine: [buttons] });
  for (const a of arms) parts.push(arm(a, [W(PAL.slate, 0.72)], 4.8));
  parts.push(place(soldierHead({ mood, look }), `translate(${S_HEAD[0]} ${S_HEAD[1]})`));
  const top = dy ? place(merge(...parts), `translate(0 ${dy})`) : merge(...parts);
  if (upper) return top;
  // the legs, drawn where they land: straight when he stands, shins only under his lap when he sits
  const boot = 'M-15 -14L-15 -3C-20 -3 -24 -1 -23 1L-4 1L-4 -14Z';
  const boots = boot + place({ lines: [boot] }, 'scale(-1 1)').lines[0];
  const legs = sit ? 'M-16 -29L-15 -14M-4 -14L-5 -29M16 -29L15 -14M4 -14L5 -29' : 'M-17 -39L-15 -14M-4 -14L-3 -37M17 -39L15 -14M4 -14L3 -37';
  const legFill = sit ? 'M-16 -29L-15 -14L-4 -14L-5 -29ZM16 -29L15 -14L4 -14L5 -29Z' : 'M-17 -39L-15 -14L-4 -14L-3 -37ZM17 -39L15 -14L4 -14L3 -37Z';
  return merge(
    { lines: [legs, boots], fine: ['M-14 -9l3 1M14 -9l-3 1'], washes: [W(PAL.grey, 0.75, legFill), W(PAL.terracotta, 0.8, boots), W(PAL.grey, 0.3, 'M-23 1L-4 1L-4 -4L-20 -3Z')] },
    top,
  );
}

// =============================================================================================
// THE PRINCESSES: about 125 tall. who: 'eldest' (rose dress, terracotta hair in a bun, tiara),
// 'youngest' (sky dress, ochre hair in two bunches with red bows, a little crown; drawn smaller by
// youngest()), or a sister: { dress, hair } colours with long hair. Head at P_HEAD; shoulders at
// (±13, -84). twirl: -1, 0, 1 swings the skirt. upper: down to the waist only.
// =============================================================================================
export const P_HEAD = [0, -100];
export const P_ARMS = {
  down: [
    [[-13, -83, 6], [-18, -70, 5.5], [-21, -58, 5.5], [-21, -52, 5.5]],
    [[13, -83, 6], [18, -70, 5.5], [21, -58, 5.5], [21, -52, 5.5]],
  ],
  // both hands in front, at the waist (holding shoes)
  hold: [
    [[-13, -83, 6], [-19, -70, 5.5], [-12, -60, 5.5], [-5, -58, 5.5]],
    [[13, -83, 6], [19, -70, 5.5], [12, -60, 5.5], [5, -58, 5.5]],
  ],
  // right arm pointing down to the right (tapping), left arm down
  tap: [
    [[-13, -83, 6], [-18, -70, 5.5], [-21, -58, 5.5], [-21, -52, 5.5]],
    [[13, -83, 6], [26, -74, 5.5], [38, -64, 5.5], [45, -58, 5.5]],
  ],
  // both arms out, the left one up (dancing with someone on her right)
  danceR: [
    [[-13, -83, 6], [-24, -92, 5.5], [-30, -104, 5.5], [-31, -111, 5.5]],
    [[13, -83, 6], [25, -84, 5.5], [36, -88, 5.5], [42, -91, 5.5]],
  ],
  // hands clapped together in front of her chest (laughing)
  clap: [
    [[-13, -83, 6], [-19, -72, 5.5], [-9, -72, 5.5], [-3, -76, 5.5]],
    [[13, -83, 6], [19, -72, 5.5], [9, -72, 5.5], [3, -76, 5.5]],
  ],
  // one hand fanning her face (right), the other in her lap
  fan: [
    [[-13, -83, 6], [-19, -70, 5.5], [-12, -60, 5.5], [-6, -58, 5.5]],
    [[13, -83, 6], [24, -80, 5.5], [25, -94, 5.5], [21, -102, 5.5]],
  ],
  // beckoning: left hand up by her face, right hand down
  shh: [
    [[-13, -83, 6], [-22, -78, 5.5], [-20, -92, 5.5], [-15, -98, 5.5]],
    [[13, -83, 6], [18, -70, 5.5], [21, -58, 5.5], [21, -52, 5.5]],
  ],
};
const SISTER = { eldest: { dress: PAL.rose, trim: PAL.red, hair: PAL.terracotta }, youngest: { dress: PAL.sky, trim: PAL.slate, hair: PAL.ochre } };
export function princessHead({ who = 'eldest', hair: hairC, mood = 'happy', look = 0 } = {}) {
  const look_ = SISTER[who] ?? {};
  const hc = hairC ?? look_.hair ?? PAL.ochre;
  const faceD = 'M-11 -1C-11.4 8 -6 13 0 13C6 13 11.4 8 11 -1';
  const top = 'M-12 2C-14 -12 -7 -18 0 -18C7 -18 14 -12 12 2C10 -5 5 -8 0 -6C-5 -8 -10 -5 -12 2Z';
  const m = face({ mood, look, ex: 4.4, ey: 1, my: 7.5, w: 3.2 });
  const lines = [faceD, top];
  const fine = [nose, ...m.fine];
  const washes = [W(PAL.rose, 0.3, Z(`${faceD}C9 -7 -9 -7 -11 -1`)), cheeks(7, 5.5, 2.2, 0.7), ...m.washes];
  const glints = [...m.glints];
  let hairD = top;
  if (who === 'eldest') {
    const bun = oval(0, -23, 6.5, 5);
    const tiara = 'M-8 -15.5L-7 -21L-3.5 -17.5L0 -22L3.5 -17.5L7 -21L8 -15.5C3 -17.2 -3 -17.2 -8 -15.5Z';
    const curls = 'M-12 1C-16 5 -15 10 -12 11C-14 8 -13 5 -11 4ZM12 1C16 5 15 10 12 11C14 8 13 5 11 4Z';
    lines.push(bun, curls);
    fine.push(tiara, 'M-3 -25q3 -2 6 0');
    hairD += bun + curls;
    washes.push(W(PAL.ochre, 1, tiara), W(PAL.red, 0.9, dot(0, -18.6, 1.3)));
    glints.push(dot(-4.8, -18.2, 0.7), dot(4.8, -18.2, 0.7));
  } else if (who === 'youngest') {
    const bunches = `${oval(-16, -2, 5, 7.5)}${oval(16, -2, 5, 7.5)}`;
    const bows = 'M-14 -10l-5 -3l0 6ZM-14 -10l4 -4l1 6ZM14 -10l5 -3l0 6ZM14 -10l-4 -4l-1 6Z';
    const crown = 'M-6 -16.5L-7 -25L-3 -21L0 -27L3 -21L7 -25L6 -16.5C2 -18 -2 -18 -6 -16.5Z';
    lines.push(bunches);
    fine.push(bows, crown, 'M-17 -1q1 4 0 7M17 -1q-1 4 0 7');
    hairD += bunches;
    washes.push(W(PAL.red, 0.85, bows), W(PAL.ochre, 1, crown));
    glints.push(dot(0, -22, 0.8));
  } else {
    const locks = 'M12 0C15 10 16 20 18 28C14 31 9 30 6 27C9 21 10 15 10 7ZM-12 0C-15 10 -16 20 -18 28C-14 31 -9 30 -6 27C-9 21 -10 15 -10 7Z';
    const crown = 'M-6 -16.5L-7 -24L-3 -20.5L0 -26L3 -20.5L7 -24L6 -16.5C2 -18 -2 -18 -6 -16.5Z';
    lines.push(locks);
    fine.push(crown);
    hairD += locks;
    washes.push(W(PAL.ochre, 1, crown));
  }
  washes.push(W(hc, 0.85, hairD));
  return { lines, fine, washes, whites: m.whites, fills: m.fills, glints };
}
export function princess({ who = 'eldest', dress, hair, mood = 'happy', look = 0, arms = P_ARMS.down, twirl = 0, upper = false, shoes = true } = {}) {
  const c = SISTER[who] ?? {};
  const dc = dress ?? c.dress ?? PAL.green;
  const tc = c.trim ?? PAL.ochre;
  const parts = [];
  const bodice = 'M-7 -88C-12 -87 -13 -81 -13 -73C-13 -67 -13 -63 -14 -58';
  const bodiceR = 'C13 -63 13 -67 13 -73C13 -81 12 -87 7 -88';
  const sash = 'M-13.5 -63C-5 -60 5 -60 13.5 -63L14 -58C5 -55 -5 -55 -14 -58Z';
  const neck = 'M-7 -88C-3 -84 3 -84 7 -88';
  const t = twirl * 9;
  if (upper) {
    const body = `${bodice}L-15 -50M15 -50L14 -58${bodiceR}`;
    parts.push({ lines: [body], fine: [neck, sash], washes: [W(dc, 0.85, `${bodice}L-15 -50L15 -50L14 -58${bodiceR}Z`), W(tc, 0.55, sash)] });
  } else {
    const skirt = `${bodice}C-22 -46 ${-32 + t} -26 ${-37 + t * 1.2} ${-5 + twirl * 6}C${-13 + t} ${1 + twirl * 2} ${13 + t} ${1 - twirl * 2} ${37 + t * 1.2} ${-5 - twirl * 6}C${32 + t} -26 22 -46 14 -58${bodiceR}`;
    const hemLine = `M${-34 + t * 1.2} ${-11 + twirl * 6}C${-12 + t} ${-5 + twirl * 2} ${12 + t} ${-5 - twirl * 2} ${34 + t * 1.2} ${-11 - twirl * 6}`;
    if (shoes) {
      const sh = `${oval(-8 + t * 0.3, 0, 4.5, 2.4)}${oval(8 + t * 0.3, 0, 4.5, 2.4)}`;
      parts.push({ lines: [sh], washes: [W(PAL.red, 0.85, sh)] });
    }
    parts.push({
      lines: [skirt],
      fine: [neck, sash, hemLine, `M-7 -52q${-6 + t / 2} 20 ${-14 + t} 40M7 -52q${6 + t / 2} 20 ${14 + t} 40`],
      washes: [W(dc, 0.85, Z(skirt)), W(tc, 0.55, sash), W(tc, 0.35, Z(`${hemLine}L${37 + t * 1.2} ${-5 - twirl * 6}C${13 + t} ${1 - twirl * 2} ${-13 + t} ${1 + twirl * 2} ${-37 + t * 1.2} ${-5 + twirl * 6}`))],
    });
  }
  const sleeves = `${oval(-13, -82, 5.5, 4.5)}${oval(13, -82, 5.5, 4.5)}`;
  parts.push({ lines: [sleeves], washes: [W(dc, 0.9, sleeves)] });
  for (const a of arms) parts.push(arm(a, [W(dc, 0.45)], 3.8));
  parts.push(place(princessHead({ who, hair, mood, look }), `translate(${P_HEAD[0]} ${P_HEAD[1]})`));
  return merge(...parts);
}
/** The youngest princess: a little smaller than her sisters. */
export const youngest = (opts = {}) => place(princess({ who: 'youngest', ...opts }), 'scale(0.86)');

// =============================================================================================
// A PRINCE: about 145 tall, dark curly slate hair under a thin ochre circlet, a tunic (green by
// default, any colour) with an ochre belt, grey tights and terracotta boots. Head at R_HEAD;
// shoulders at (±16, -100). sit: on a chair seat at y = -40. upper: to the waist only.
// =============================================================================================
export const R_HEAD = [0, -118];
export const R_ARMS = {
  down: [
    [[-16, -99, 7.5], [-22, -84, 6.5], [-25, -70, 6.5], [-25, -64, 6.5]],
    [[16, -99, 7.5], [22, -84, 6.5], [25, -70, 6.5], [25, -64, 6.5]],
  ],
  // dangling down beside a chair (asleep)
  dangle: [
    [[-16, -99, 7.5], [-24, -86, 6.5], [-30, -72, 6.5], [-33, -62, 6.5]],
    [[16, -99, 7.5], [24, -86, 6.5], [30, -72, 6.5], [33, -62, 6.5]],
  ],
  // hands folded on his tummy
  fold: [
    [[-16, -99, 7.5], [-23, -86, 6.5], [-14, -74, 6.5], [-5, -73, 6.5]],
    [[16, -99, 7.5], [23, -86, 6.5], [14, -74, 6.5], [5, -73, 6.5]],
  ],
  // dancing with someone on his left: left arm out to her, right arm up
  danceL: [
    [[-16, -99, 7.5], [-28, -98, 6.5], [-40, -100, 6.5], [-46, -102, 6.5]],
    [[16, -99, 7.5], [27, -108, 6.5], [33, -120, 6.5], [34, -127, 6.5]],
  ],
  // rowing: both fists forward and low on the oars
  row: [
    [[-16, -99, 7.5], [-24, -86, 6.5], [-24, -74, 6.5], [-20, -68, 6.5]],
    [[16, -99, 7.5], [24, -86, 6.5], [24, -74, 6.5], [20, -68, 6.5]],
  ],
};
export function princeHead({ mood = 'happy', look = 0 } = {}) {
  const faceD = 'M-12 -6C-12.5 6 -7 13 0 13C7 13 12.5 6 12 -6';
  const curls = 'M-13 -2C-17 -6 -15 -12 -12 -12C-13 -18 -6 -21 -2 -18C1 -22 9 -21 10 -16C15 -16 16 -9 13 -2C11 -7 7 -9 2 -8C-3 -10 -9 -8 -13 -2Z';
  const circlet = 'M-12 -12C-4 -15 4 -15 12 -12L11.5 -9C4 -12 -4 -12 -11.5 -9ZM-2 -13.6L0 -18L2 -13.6Z';
  const m = face({ mood, look, ex: 4.6, ey: -1, my: 6.5, w: 3.6 });
  return {
    lines: [faceD, curls],
    fine: [circlet, nose, 'M-8 -15q2 2 0 4M5 -17q2 2 1 4', ...m.fine],
    washes: [W(PAL.rose, 0.32, Z(`${faceD}C8 -9 -8 -9 -12 -6`)), W(PAL.slate, 0.85, curls), W(PAL.ochre, 1, circlet), cheeks(8, 4, 2.3, 0.65), ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: [...m.glints, dot(0, -14, 0.6)],
  };
}
export function prince({ tunic = PAL.green, mood = 'happy', look = 0, arms = R_ARMS.down, sit = false, upper = false, tilt = 0 } = {}) {
  const parts = [];
  const torso = 'M-9 -104C-16 -103 -19 -96 -19 -86C-19 -78 -19 -72 -20 -66';
  const torsoR = 'C19 -72 19 -78 19 -86C19 -96 16 -103 9 -104';
  let body;
  if (upper) body = `${torso}L-20 -60M20 -60L20 -66${torsoR}`;
  else if (sit) body = `${torso}C-24 -64 -29 -62 -29 -60C-29 -58 -27 -57 -24 -57L24 -57C27 -57 29 -58 29 -60C29 -62 24 -64 20 -66${torsoR}`;
  else body = `${torso}C-21 -60 -22 -55 -24 -50C-8 -46 8 -46 24 -50C22 -55 21 -60 20 -66${torsoR}`;
  const fill = upper ? `${torso}L-20 -60L20 -60L20 -66${torsoR}Z` : Z(body);
  const belt = 'M-19.6 -72C-6 -69 6 -69 19.6 -72L20 -66C6 -63 -6 -63 -20 -66Z';
  const neck = 'M-9 -104C-4 -99 4 -99 9 -104';
  parts.push({
    lines: [body],
    fine: [neck, belt, 'M0 -101L0 -73', ...(upper || sit ? [] : ['M-10 -63q-3 6 -6 12M10 -63q3 6 6 12'])],
    washes: [W(tunic, 0.8, fill), W(PAL.ochre, 0.9, belt)],
  });
  for (const a of arms) parts.push(arm(a, [W(tunic, 0.6)], 4.5));
  parts.push(place(princeHead({ mood, look }), `translate(${R_HEAD[0]} ${R_HEAD[1]}) rotate(${tilt})`));
  const upperPart = sit ? place(merge(...parts), `translate(0 ${S_SIT})`) : merge(...parts);
  if (upper) return upperPart;
  const top = sit ? -31 : -48;
  const boot = 'M-14 -14L-14 -3C-19 -3 -22 -1 -21 1L-4 1L-5 -14Z';
  const boots = boot + place({ lines: [boot] }, 'scale(-1 1)').lines[0];
  const legs = `M-15 ${top}L-14 -14M-5 -14L-4 ${top}M15 ${top}L14 -14M5 -14L4 ${top}`;
  const legFill = `M-15 ${top}L-14 -14L-5 -14L-4 ${top}ZM15 ${top}L14 -14L5 -14L4 ${top}Z`;
  return merge({ lines: [legs, boots], washes: [W(PAL.grey, 0.7, legFill), W(PAL.terracotta, 0.8, boots)] }, upperPart);
}

// =============================================================================================
// THE OLD WOMAN: about 115 tall, a little bent, a grey shawl over her head, wisps of white hair, a
// big nose, a terracotta skirt and a walking stick in her left hand. Her right hand holds things
// out to the right at O_HAND.
// =============================================================================================
export const O_HAND = [44, -70];
export function oldWoman({ mood = 'smile', look = 1 } = {}) {
  const skirt = 'M-14 -62C-22 -44 -28 -22 -30 -2C-10 2 12 2 30 -2C28 -22 22 -44 14 -62Z';
  const shawl = 'M-8 -92C-16 -90 -21 -84 -24 -72L-27 -62C-14 -56 -6 -50 2 -45C10 -50 18 -56 28 -62L25 -72C22 -84 16 -90 8 -92';
  const shawlEdge = 'M-24 -60l-1 5M-17 -56l-1 5M-10 -52l-1 5M-3 -48l0 5M6 -48l0 5M13 -52l1 5M20 -57l1 5';
  const apron = 'M-10 -48C-12 -34 -12 -18 -10 -4L10 -4C12 -18 12 -34 10 -48Z';
  const faceD = 'M-11 -2C-11 8 -5 12 1 12C7 12 11 8 11 -2C11 -10 6 -13 0 -13C-6 -13 -11 -10 -11 -2Z';
  const bigNose = 'M0 1C4 1 6 5 4 7C2 8.5 -2 8 -2 5';
  const wisps = 'M-10 -8q-3 2 -2 6M10 -8q3 2 2 6';
  const m = face({ mood, look, ex: 4.6, ey: -2, my: 8, w: 3 });
  const head = {
    lines: [faceD],
    fine: [bigNose, wisps, 'M-9 -1q-2 1 -2 3M9 -1q2 1 2 3', ...m.fine],
    washes: [W(PAL.rose, 0.35, faceD), W(PAL.rose, 0.6, Z(bigNose)), cheeks(7.5, 4, 2.2, 0.65), ...m.washes],
    whites: m.whites,
    fills: m.fills,
    glints: m.glints,
  };
  const hood = 'M-14 -1C-18 -14 -10 -24 0 -24C10 -24 18 -14 14 -1C12 -10 8 -15 0 -15C-8 -15 -12 -10 -14 -1Z';
  const shoes = `${oval(-10, 0, 6, 2.6)}${oval(10, 0, 6, 2.6)}`;
  const stick = 'M-30 -72L-36 0';
  return merge(
    { lines: [shoes], washes: [W(PAL.slate, 0.8, shoes)] },
    { lines: [skirt], fine: ['M-6 -50q-4 20 -10 46M6 -50q4 20 10 46'], washes: [W(PAL.terracotta, 0.7, skirt)] },
    { lines: [apron], washes: [W(PAL.ochre, 0.35, apron)], whites: [] },
    { lines: [shawl], fine: [shawlEdge], washes: [W(PAL.grey, 0.75, Z(shawl))] },
    { lines: [stick], fine: ['M-31 -72q-2 -6 3 -8'], washes: [] },
    arm([[-15, -86, 7], [-23, -80, 6], [-28, -75, 6], [-30, -72, 6]], [W(PAL.grey, 0.7)], 4.4),
    arm([[15, -86, 7], [28, -82, 6], [38, -76, 6], O_HAND.concat(6)], [W(PAL.grey, 0.7)], 4.4),
    place(head, 'translate(3 -104)'),
    place({ lines: [hood], washes: [W(PAL.grey, 0.85, hood)] }, 'translate(3 -104)'),
  );
}

/** The grey cloak of invisibility held up by its two top corners (x1, y1) and (x2, y2), falling
 * drop below them in soft folds. */
export function cloak(x1, y1, x2, y2, drop = 80) {
  const mx = (x1 + x2) / 2;
  const sag = Math.abs(x2 - x1) * 0.12;
  const yb = Math.max(y1, y2) + drop;
  const top = `M${f(x1)} ${f(y1)}C${f(x1 + (x2 - x1) * 0.3)} ${f(y1 + sag)} ${f(x1 + (x2 - x1) * 0.7)} ${f(y2 + sag)} ${f(x2)} ${f(y2)}`;
  const w = x2 - x1;
  const hem = `C${f(x2 + 6)} ${f(y2 + drop * 0.5)} ${f(x2 + 4)} ${f(yb - 10)} ${f(x2 + 8)} ${f(yb)}C${f(x2 - w * 0.15)} ${f(yb - 6)} ${f(mx + w * 0.2)} ${f(yb + 6)} ${f(mx)} ${f(yb - 2)}C${f(mx - w * 0.2)} ${f(yb + 6)} ${f(x1 + w * 0.15)} ${f(yb - 6)} ${f(x1 - 8)} ${f(yb)}C${f(x1 - 4)} ${f(yb - 10)} ${f(x1 - 6)} ${f(y1 + drop * 0.5)} ${f(x1)} ${f(y1)}`;
  const d = `${top}${hem}Z`;
  const folds = [0.25, 0.5, 0.75]
    .map((k) => {
      const x = x1 + w * k;
      const y = y1 + (y2 - y1) * k + sag * 0.8;
      return `M${f(x)} ${f(y + 4)}C${f(x - 3)} ${f(y + drop * 0.4)} ${f(x + 3)} ${f(y + drop * 0.7)} ${f(x + (k - 0.5) * 8)} ${f(yb - 6)}`;
    })
    .join('');
  return {
    lines: [d],
    fine: [folds],
    washes: [W(PAL.grey, 0.72, d), W(PAL.slate, 0.22, d)],
  };
}

/** A bundle of sticks tied with string, lying on the ground at y = 0, about 60 long. */
export function sticks() {
  const s = 'M-30 -4L30 -10M-30 -10L32 -4M-28 -16L30 -14M-32 -2L28 -2M-29 -8L33 -16';
  const tie = 'M-6 -20q-2 10 0 20M8 -20q2 10 0 20';
  return { lines: [s], fine: [tie], washes: [W(PAL.terracotta, 0.45, 'M-32 -18L33 -18L33 0L-32 0Z')] };
}

// =============================================================================================
// PROPS
// =============================================================================================

/** A wooden chair seen from the front: seat top at y = -40, posts up to -120. gap: the half-width of
 * the seat edge hidden by whoever sits on it. */
export function chair({ gap = 0, back = true, cutR } = {}) {
  const right = cutR ? `M34 -40L34 ${cutR[1]}M34 ${cutR[0]}L34 -118` : 'M34 -40L34 -118';
  const posts = back ? `M-34 -40L-34 -118${right}M-38 -118L-30 -118M30 -118L38 -118` : '';
  const knobs = back ? dot(-34, -122, 3.6) + dot(34, -122, 3.6) : '';
  const seatEdge = gap ? `M-38 -40L${-gap} -40M${gap} -40L38 -40M-38 -34L${-gap} -34M${gap} -34L38 -34M-38 -40L-38 -34M38 -40L38 -34` : 'M-38 -40L38 -40L38 -34L-38 -34Z';
  const legs = 'M-35 -34L-35 0M-30 -34L-30 0M35 -34L35 0M30 -34L30 0';
  const wood = `${back ? 'M-36 -40L-36 -118L-32 -118L-32 -40ZM36 -40L36 -118L32 -118L32 -40Z' : ''}M-38 -40L38 -40L38 -34L-38 -34ZM-35 -34L-35 0L-30 0L-30 -34ZM35 -34L35 0L30 0L30 -34Z`;
  return { lines: [posts, seatEdge, legs].filter(Boolean), fine: [knobs].filter(Boolean), washes: [W(PAL.ochre, 0.6, wood), W(PAL.terracotta, 0.25, wood), W(PAL.ochre, 0.9, knobs || 'M0 0Z')] };
}

/** A cup, base at y = 0, about 12 wide; tip: degrees to tip it (around its base); milk inside. */
export function cup({ milk = true } = {}) {
  const body = 'M-6 -13L-5 0L5 0L6 -13';
  const rim = oval(0, -13, 6, 1.8);
  const handle = 'M5.6 -10C10 -10 10 -3 5.2 -3';
  return { lines: [body, rim], fine: [handle], washes: [W(PAL.sky, 0.55, Z(body)), ...(milk ? [] : [])], whites: milk ? [rim] : [] };
}

/** A flowerpot with a little plant and a red flower, base at y = 0, about 34 wide. */
export function flowerpot() {
  const pot = 'M-14 -26L-11 0L11 0L14 -26Z';
  const rim = 'M-17 -32L17 -32L17 -25L-17 -25Z';
  const leaves = 'M0 -32C-2 -42 -10 -48 -18 -46C-14 -40 -8 -34 0 -32ZM0 -32C2 -44 10 -50 18 -50C14 -42 8 -36 0 -32ZM0 -32C-1 -42 0 -54 2 -62';
  const flower = 'M2 -62C-3 -66 -1 -72 3 -70C5 -75 11 -72 8 -68C13 -66 10 -60 6 -62C5 -57 0 -58 2 -62Z';
  return {
    lines: [pot, rim],
    fine: [leaves, flower],
    washes: [W(PAL.terracotta, 0.8, pot + rim), W(PAL.green, 0.8, 'M0 -32C-2 -42 -10 -48 -18 -46C-14 -40 -8 -34 0 -32ZM0 -32C2 -44 10 -50 18 -50C14 -42 8 -36 0 -32Z'), W(PAL.red, 0.85, flower), W(PAL.ochre, 1, dot(4.5, -66, 1.8))],
  };
}

/** A tall arched wooden door with a keyhole, bottom at y = 0, about 70 wide and 150 tall. */
export function door() {
  const d = 'M-35 0L-35 -115C-35 -160 35 -160 35 -115L35 0';
  const frame = 'M-42 0L-42 -115C-42 -168 42 -168 42 -115L42 0';
  const planks = 'M-12 -145L-12 0M12 -145L12 0';
  const hinges = 'M-35 -110L-18 -110M-35 -30L-18 -30';
  const key = 'M20 -66C17 -66 17 -61 19 -60L18 -54L22 -54L21 -60C23 -61 23 -66 20 -66Z';
  return {
    lines: [d],
    fine: [frame, planks, hinges, dot(24, -74, 2.5)],
    washes: [W(PAL.ochre, 0.55, Z(d)), W(PAL.terracotta, 0.35, Z(d)), W(PAL.grey, 0.45, `${frame}L35 0L35 -115C35 -160 -35 -160 -35 -115L-35 0Z`)],
    fills: [key],
  };
}

/** A small bed seen from its foot end (for a row of twelve beds): bottom at y = 0, about 46 wide. */
export function bedEnd({ quilt = PAL.rose, empty = false } = {}) {
  const head = 'M-24 -34L-24 -58C-24 -70 24 -70 24 -58L24 -34';
  const foot = 'M-30 0L-30 -22C-30 -28 30 -28 30 -22L30 0';
  const lump = empty ? 'M-26 -26C-24 -34 -10 -32 0 -34C10 -36 22 -32 26 -26' : 'M-26 -26C-26 -40 -10 -44 0 -42C10 -46 26 -40 26 -26';
  const pillow = 'M-14 -38C-16 -48 16 -48 14 -38';
  const knobs = dot(-24, -60, 3) + dot(24, -60, 3) + dot(-30, -24, 3) + dot(30, -24, 3);
  return {
    lines: [foot, head, lump],
    fine: [pillow, knobs],
    washes: [W(PAL.ochre, 0.6, Z(foot) + Z(head) + knobs), W(PAL.sky, 0.25, Z(pillow)), W(quilt, 0.65, Z(`${lump}L26 -22L-26 -22`))],
  };
}

/** A pair of worn-out dancing shoes, side view, toes to the right, sole on y = 0, about 30 long, with
 * holes in the soles. */
export function shoe({ c = PAL.red } = {}) {
  const d = 'M-15 0C-17 -6 -14 -10 -9 -10C-6 -6 4 -6 8 -8C13 -9 17 -5 16 0C6 2 -6 2 -15 0Z';
  const opening = 'M-9 -10C-6 -6 4 -6 8 -8';
  const hole = 'M-2 1.5L0 -1L3 0.5L5 -1.5L7 1Z';
  const ribbon = 'M-9 -10C-12 -16 -8 -20 -5 -16M-9 -10C-14 -12 -18 -10 -17 -6';
  return { lines: [d], fine: [opening, ribbon], washes: [W(c, 0.85, d)], whites: [hole], once: [hole] };
}

/** The sole of a dancing shoe seen from below, toe up, worn right through: centre (0,0), 18×46. */
export function sole({ c = PAL.red } = {}) {
  const upper = 'M0 -24C8 -24 11 -14 10 -6C9 3 10 11 7 18C5 25 -5 25 -7 18C-10 11 -9 3 -10 -6C-11 -14 -8 -24 0 -24Z';
  const s = 'M0 -21C6 -21 8 -13 7 -6C6 2 7 10 5 15C3 21 -3 21 -5 15C-7 10 -6 2 -7 -6C-8 -13 -6 -21 0 -21Z';
  const hole = 'M-4 -9L-1 -12L1 -10L4 -11L5 -7L3 -5L4 -2L0 -1L-2 -3L-4 -2L-3 -5Z';
  const heelHole = 'M-2 12L1 10L3 13L0 15Z';
  return {
    lines: [upper, hole],
    fine: [s, heelHole, 'M-3 -18l2 1M3 6l-2 1'],
    washes: [W(c, 0.85, upper), W(PAL.terracotta, 0.45, s)],
    whites: [hole + heelHole],
  };
}

/** A little twig with leaves of a colour (slate: silver, ochre: gold, sky: diamond), base at (0,0),
 * pointing up, about 40 long. */
export function twig(c = PAL.slate, sparkle = true) {
  const stem = 'M0 0C1 -12 -1 -26 2 -40M1 -16C5 -20 9 -22 12 -22M0 -28C-4 -31 -8 -32 -11 -32';
  const leaf = (x, y, a) => place({ lines: ['M0 0C2 -4 6 -5 9 -4C7 -1 3 1 0 0Z'] }, `translate(${x} ${y}) rotate(${a})`).lines[0];
  const leaves = [leaf(12, -22, -20), leaf(-11, -32, 200), leaf(2, -40, -70), leaf(1, -10, -30), leaf(0, -20, 210)].join('');
  return {
    lines: [stem],
    fine: [leaves],
    washes: [W(c, 0.9, leaves)],
    glints: sparkle ? [dot(13.5, -24, 0.9), dot(-13, -33.5, 0.9), dot(1.4, -44, 0.9)] : [],
  };
}

/** A tree with leaves of a colour, trunk base at (0,0), crown of radius r; glint: shiny leaves. */
export function tree({ c = PAL.green, r = 40, h = 70, seed = 1, shiny = false, o = 0.6 } = {}) {
  const cy = -h - r * 0.6;
  const bumps = 9;
  let d = '';
  for (let i = 0; i <= bumps; i++) {
    const a = (i / bumps) * Math.PI * 2 + seed;
    const x = f(Math.cos(a) * r);
    const y = f(cy + Math.sin(a) * r * 0.85);
    if (i === 0) d += `M${x} ${y}`;
    else {
      const am = ((i - 0.5) / bumps) * Math.PI * 2 + seed;
      d += `Q${f(Math.cos(am) * r * 1.28)} ${f(cy + Math.sin(am) * r * 1.1)} ${x} ${y}`;
    }
  }
  d += 'Z';
  const trunk = `M-6 0C-4 -20 -5 ${-h + 10} -7 ${-h}M6 0C4 -20 5 ${-h + 10} 7 ${-h}`;
  const branch = `M-2 ${-h - 4}L-16 ${-h - 22}M3 ${-h - 6}L14 ${-h - 26}`;
  const glints = [];
  const marks = [];
  if (shiny) {
    for (let i = 0; i < 12; i++) {
      const a = i * 2.4 + seed;
      const k = 0.25 + ((i * 37) % 10) / 14;
      const x = Math.cos(a) * r * k;
      const y = cy + Math.sin(a) * r * 0.75 * k;
      glints.push(dot(x, y, 1.3));
      marks.push(`M${f(x - 3)} ${f(y + 2)}q3 -5 6 0`);
    }
  }
  return {
    lines: [d, trunk],
    fine: [shiny ? '' : branch, ...marks].filter(Boolean),
    washes: [W(c, o, d), W(PAL.terracotta, 0.55, `M-6 0C-4 -20 -5 ${-h + 10} -7 ${-h}L7 ${-h}C5 ${-h + 10} 4 -20 6 0Z`)],
    glints,
  };
}

/** A music note (a quaver) with its head at (x, y), size s. */
export function note(x, y, s = 1) {
  const head = place({ lines: [oval(0, 0, 4.2, 3)] }, `translate(${x} ${y}) rotate(-20) scale(${s})`).lines[0];
  const stem = `M${f(x + 3.8 * s)} ${f(y - 1 * s)}L${f(x + 3.8 * s)} ${f(y - 20 * s)}q${f(2 * s)} ${f(6 * s)} ${f(8 * s)} ${f(8 * s)}`;
  return { fine: [stem], fills: [head] };
}

/** "Crack!" burst lines around (x, y). */
export const crack = (x, y, s = 1) =>
  [[-1, -1], [1, -1.2], [1.3, 0.3], [-1.3, 0.2], [0.2, -1.5]]
    .map(([a, b]) => `M${f(x + a * 6 * s)} ${f(y + b * 6 * s)}L${f(x + a * 13 * s)} ${f(y + b * 13 * s)}`)
    .join('');

/** A side-view rowing boat, gunwale at y = 0 from x = -60 to 64 (scale it). */
export function boat({ c = PAL.terracotta } = {}) {
  const hull = 'M-66 -4C-56 18 54 20 70 -6C40 0 -40 0 -66 -4Z';
  const plank = 'M-60 6C-30 12 30 12 62 4';
  return { lines: [hull], fine: [plank], washes: [W(c, 0.7, hull), W(PAL.ochre, 0.3, hull)] };
}

/** Little "tip-toe" lines and a scattering of sparkles are drawn in the pictures. */
export { limb, f };
