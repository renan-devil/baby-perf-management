import { PAL, transformPath } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';
import { goat } from '../two-goats/characters.mjs';

// The Three Billy Goats Gruff: the three goats, the troll and the wooden bridge, shared by the five
// pictures. The goats reuse the goat of The Two Goats (two-goats/characters.mjs) at three sizes;
// the troll and the bridge are drawn once here. The build only draws files named <n>.mjs, so this
// file is not a picture.

export { compose, place, merge, at } from '../two-goats/characters.mjs';

const close = (list) => list.map((d) => `${d}Z`).join('');

// ---------------------------------------------------------------------------------------------
// The goats. Each faces right with its feet at y = 0 (about 125 long, 130 tall at scale 1); place
// them with scale(0.5) (little), scale(0.75) (middle-sized) and scale(1) (great big) or in the same
// proportions. The little one is white, the middle-sized one brown, the great big one grey with
// big curly horns.

// Same path data as the goat's horns and ear in two-goats/characters.mjs, to swap them out.
const gHornNear = 'M45 -116C42 -128 34 -136 22 -138C18 -138 16 -136 19 -134C28 -132 34 -124 37 -113Z';
const gHornFar = 'M52 -118C52 -131 46 -140 35 -144C31 -145 29 -143 32 -141C40 -137 44 -128 44 -117Z';
const gHornRidges = 'M40 -122l-5 3M35 -128l-5 2M30 -133l-3 3M49 -125l-5 2M46 -132l-5 1M41 -138l-3 3';
const gNeckHead =
  'M26 -89C31 -100 36 -110 42 -116C48 -122 58 -120 62 -113C66 -106 72 -100 75 -93C77 -87 70 -83 64 -86C58 -89 54 -91 52 -92C49 -84 47 -76 45 -66';
const gEar = 'M42 -108C34 -109 26 -106 21 -101C29 -98 37 -100 43 -103Z';
const gMouth = 'M61 -91C63 -84 70 -82 75 -88C71 -87 66 -88 61 -91Z';

/** Where a path starts (its first point), to tell the head from the body. */
const start = (d) => {
  const m = transformPath(d, 'translate(0 0)').match(/M (-?[\d.]+) (-?[\d.]+)/);
  return [Number(m[1]), Number(m[2])];
};
const inHead = (d) => {
  const [x, y] = start(d);
  return x > 20 && y < -85;
};

/** Turns the goat's head and neck about the top of the neck (positive: head down). */
function tiltHead(g, angle) {
  const t = `rotate(${angle} 36 -78)`;
  const out = {};
  for (const [k, list] of Object.entries(g)) {
    out[k] = list.map((v) => {
      if (k === 'washes') return inHead(v.d) ? { ...v, d: transformPath(v.d, t) } : v;
      return inHead(v) ? transformPath(v, t) : v;
    });
  }
  return out;
}

// The great big goat's curly horns: a thick ram's horn curling back and round over the ear.
const curl = limb([
  [47, -114, 13],
  [46, -132, 12],
  [34, -144, 11],
  [18, -140, 10],
  [9, -126, 9],
  [13, -110, 8],
  [25, -104, 6.5],
  [33, -112, 5],
  [28, -121, 3.6],
  [22, -118, 2.4],
]);
const curlRidges = 'M40 -130l8 -6M28 -146l2 7M14 -136l7 3M8 -120l8 0M17 -106l4 -6M30 -103l-1 6';
const curlFar = limb([
  [54, -116, 9],
  [56, -132, 8],
  [50, -142, 6],
  [42, -144, 4],
]);

/** Small round belly, for well-fed goats on the hill. */
const belly = 'M-40 -58C-34 -28 20 -26 36 -54';

/**
 * One of the three goats. size: 'little' | 'middle' | 'big'. pose: 'walk' | 'tumble'.
 * mood: 'cross' (eye open), 'splash', or 'munch' (eye closed in a happy curve, a grass stalk in the mouth).
 * head: degrees to tip the head down (butting, grazing). round: a fat full belly.
 */
export function billy({ size = 'little', pose = 'walk', mood = 'cross', head = 0, round = false } = {}) {
  const coat = size === 'little' ? 'white' : 'brown';
  let g = goat({ coat, pose, mood: mood === 'munch' ? 'splash' : mood });
  if (mood === 'munch') {
    // Drop the "splash" face and draw a happy closed eye and a chewing mouth with a grass stalk.
    g.fine = g.fine.filter((d) => d !== 'M48 -109l5 2l-5 2' && d !== gMouth);
    g.washes = g.washes.filter((w) => w.d !== gMouth);
    g = merge(g, {
      fine: ['M47 -107q5 -5 10 0', 'M64 -88q5 3 10 -1', 'M70 -88C74 -80 79 -74 86 -70M71 -88C76 -84 82 -82 88 -82'],
      washes: [{ c: PAL.green, o: 0.9, d: 'M70 -88C74 -80 79 -74 86 -70L88 -82C82 -82 76 -84 71 -88Z' }, { c: PAL.rose, o: 0.5, d: dot(56, -98, 3) }],
    });
  }
  if (round) {
    const fill = coat === 'white' ? [] : [{ c: size === 'big' ? PAL.grey : PAL.terracotta, o: 0.85, d: `${belly}C14 -54 -14 -56 -40 -58Z` }];
    g = merge(g, { lines: [belly], washes: fill, whites: coat === 'white' ? [`${belly}C14 -54 -14 -56 -40 -58Z`] : [] });
  }
  if (size === 'big') {
    // A grey coat, and big curly horns instead of the plain ones (no ear: the horn curls over it).
    g = {
      ...g,
      lines: g.lines.filter((d) => d !== gHornNear && d !== gHornFar && d !== gEar),
      fine: g.fine.filter((d) => d !== gHornRidges),
      washes: g.washes
        .filter((w) => w.d !== `${gHornNear}${gHornFar}` && w.c !== PAL.rose)
        .map((w) => {
          if (w.d === `${gNeckHead}Z${gEar}`) return { ...w, c: PAL.grey, o: 0.95, d: `${gNeckHead}Z` };
          if (w.c === PAL.terracotta) return { ...w, c: PAL.grey, o: 0.95 };
          return w;
        }),
    };
    g = merge(
      { lines: [curlFar], washes: [{ c: PAL.ochre, o: 0.6, d: `${curlFar}Z` }] },
      g,
      {
        lines: [curl],
        fine: [curlRidges],
        washes: [
          { c: PAL.slate, o: 0.3, d: 'M-40 -82C-20 -88 20 -88 40 -86C46 -80 46 -74 44 -70C20 -78 -20 -78 -42 -74Z' },
          { c: PAL.ochre, o: 0.85, d: `${curl}Z` },
        ],
      },
    );
    if (round) g.washes = g.washes.map((w) => (w.c === PAL.terracotta ? { ...w, c: PAL.grey } : w));
  }
  return head ? tiltHead(g, head) : g;
}

// ---------------------------------------------------------------------------------------------
// The troll: grumpy but comic. A big lumpy green head (centre 0,0, about 56 wide) under shaggy slate
// hair, pointed ears, round saucer eyes, a big round rosy nose, a wart, a downturned mouth with two
// little tusks. mood: 'grumpy' (brows down) or 'oops' (brows up, mouth a round "o").
// look: [dx, dy] where the pupils look.
const tHead = 'M-24 -4C-26 -22 -14 -30 0 -30C14 -30 26 -22 25 -4C25 12 16 25 0 25C-16 25 -24 12 -24 -4Z';
const tHair =
  'M-25 -9L-35 -14L-28 -20L-37 -28L-26 -30L-30 -41L-18 -37L-16 -49L-6 -41L0 -53L6 -41L16 -49L18 -37L30 -41L26 -30L37 -28L28 -20L35 -14L25 -9C18 -21 -18 -21 -25 -9Z';
const tHairStrands = 'M-18 -24l-4 -7M-8 -27l-1 -9M4 -27l2 -9M14 -25l5 -7';
const tEarL = 'M-23 -6C-31 -13 -40 -14 -43 -10C-39 -1 -32 4 -23 4';
const tEarR = 'M23 -6C31 -13 40 -14 43 -10C39 -1 32 4 23 4';
const tEyes = [
  [-9.5, -10],
  [9.5, -10],
];
const tNose = oval(0, 4.5, 9, 7.5);
const tTusks = 'M-9 18L-8 11.5L-5 17ZM9 18L8 11.5L5 17Z';

export function trollHead({ mood = 'grumpy', look = [-2, 0] } = {}) {
  const [lx, ly] = look;
  const eyes = tEyes.map(([x, y]) => dot(x, y, 7.4));
  const face =
    mood === 'oops'
      ? {
          lines: ['M-17 -22q7 -6 14 -2M17 -22q-7 -6 -14 -2'],
          fine: [oval(0, 18, 4.6, 5)],
          washes: [{ c: PAL.red, o: 0.8, d: oval(0, 18, 4.6, 5) }],
        }
      : {
          lines: ['M-14 22C-8 16 8 16 14 22'],
          fine: [tTusks],
          whites: [tTusks],
          fills: ['M-21 -23L-2 -16L-3 -12L-20 -18Z', 'M21 -23L2 -16L3 -12L20 -18Z'],
        };
  return merge(
    {
      lines: [tEarL, tEarR, tHead, tHair, tNose],
      fine: [tHairStrands, ...eyes, 'M-35 -8q4 3 9 3M35 -8q-4 3 -9 3'],
      washes: [
        { c: PAL.green, o: 0.8, d: `${tHead}${tEarL}Z${tEarR}Z` },
        { c: PAL.slate, o: 0.35, d: 'M-24 -4C-24 12 -16 25 0 25C16 25 25 12 25 -4C20 12 10 18 0 18C-10 18 -20 12 -24 -4Z' },
        { c: PAL.slate, o: 0.85, d: tHair },
        { c: PAL.rose, o: 0.9, d: tNose },
        { c: PAL.rose, o: 0.45, d: dot(-15, 8, 3.4) + dot(15, 8, 3.4) },
      ],
      whites: eyes,
      fills: [...tEyes.map(([x, y]) => dot(x + lx, y + ly, 2.7)), dot(17, 1, 1.4)],
      glints: [...tEyes.map(([x, y]) => dot(x + lx - 0.8, y + ly - 0.9, 0.8)), dot(-3, 3, 1.6)],
    },
    face,
  );
}

/** A big green troll hand (a fist with knuckles) at (x, y). */
export function trollHand(x, y, r = 7.5) {
  const h = dot(x, y, r);
  return {
    lines: [h],
    fine: [`M${x - r * 0.5} ${y - r * 0.2}l0 ${r * 0.7}M${x} ${y - r * 0.3}l0 ${r * 0.8}M${x + r * 0.5} ${y - r * 0.2}l0 ${r * 0.7}`],
    washes: [{ c: PAL.green, o: 0.85, d: h }],
  };
}

function trollArm(pts) {
  const d = limb(pts);
  const [x, y] = pts[pts.length - 1];
  return merge({ lines: [d], washes: [{ c: PAL.green, o: 0.8, d: `${d}Z` }] }, trollHand(x, y));
}

export const TROLL_ARMS = {
  // Arms folded across the chest, hands tucked in.
  crossed: [
    [[-30, -38, 14], [-39, -22, 13], [-30, -9, 12], [16, -9, 12]],
    [[30, -38, 14], [39, -27, 13], [30, -22, 12], [-16, -23, 12]],
  ],
  // Flung up and out: whoops!
  flail: [
    [[-30, -36, 13], [-46, -48, 11], [-58, -68, 10]],
    [[30, -36, 13], [48, -46, 11], [62, -62, 10]],
  ],
};
const TROLL_LEGS = {
  flail: [
    [[-14, 6, 15], [-24, 24, 13], [-36, 34, 12]],
    [[14, 6, 15], [28, 18, 13], [42, 20, 12]],
  ],
};

/**
 * The troll's body (waist at 0,0, head centre at (0, -64)): broad and lumpy in a ragged slate tunic
 * with an ochre patch and a rope belt. cut: draw the body only above this y (he is behind the bridge). arms: TROLL_ARMS.
 * legs: true for his stumpy legs and big bare feet (when he flies).
 */
export function troll({ mood = 'grumpy', look = [-2, 0], arms = TROLL_ARMS.crossed, cut = null, legs = false } = {}) {
  const bottom = cut ?? 12;
  const sides = `M-36 ${bottom}C-38 -16 -38 -32 -30 -40C-20 -48 20 -48 30 -40C38 -32 38 -16 36 ${bottom}`;
  const hem = cut === null ? 'L28 16L20 9L12 17L4 10L-4 17L-12 10L-20 17L-28 10Z' : 'Z';
  const tunic = `${sides}${hem}`;
  const out = merge(
    {
      lines: [cut === null ? tunic : sides],
      fine: bottom > -2 ? ['M-36 -4C-14 1 14 1 36 -4', 'M-6 -1l-4 9M-2 0l2 9'] : [],
      washes: [
        { c: PAL.slate, o: 0.45, d: tunic },
        { c: PAL.ochre, o: 0.85, d: 'M8 -34L20 -35L21 -24L9 -23Z' },
      ],
    },
    { fine: ['M8 -34L20 -35L21 -24L9 -23Z'] },
  );
  const parts = [out];
  if (legs) {
    for (const pts of TROLL_LEGS.flail) {
      const d = limb(pts);
      const [x, y] = pts[pts.length - 1];
      const foot = oval(x + (x > 0 ? 6 : -6), y + 2, 11, 6.5);
      parts.push({ lines: [d, foot], fine: [`M${x + (x > 0 ? 12 : -12)} ${y - 3}l2 -2M${x + (x > 0 ? 14 : -14)} ${y + 1}l2 -1`], washes: [{ c: PAL.green, o: 0.8, d: `${d}Z${foot}` }] });
    }
  }
  parts.push(...arms.map(trollArm));
  parts.push(place(trollHead({ mood, look }), 'translate(0 -64)'));
  return merge(...parts);
}

// ---------------------------------------------------------------------------------------------
// The wooden bridge seen from the side: a deck of planks from x0 to x1 with its top at y (planks
// 14 deep, their ends showing), posts holding a top rail and a middle rail, and two trestle legs
// going down to `foot`. gaps: [[xa, xb], ...] where the rails stop so nothing shows through a
// goat or the troll. k: size (1 in the close pictures).
export function bridge({ x0, x1, y, foot, k = 1, gaps = [], railGaps = gaps, posts = null }) {
  const h = 14 * k;
  const deck = `M${x0} ${y}C${(2 * x0 + x1) / 3} ${y - 2 * k} ${(x0 + 2 * x1) / 3} ${y - 2 * k} ${x1} ${y}L${x1} ${y + h}C${(x0 + 2 * x1) / 3} ${y + h - 2 * k} ${(2 * x0 + x1) / 3} ${y + h - 2 * k} ${x0} ${y + h}Z`;
  let planks = '';
  for (let x = x0 + 16 * k; x < x1 - 6 * k; x += 16 * k) planks += `M${x.toFixed(1)} ${y + 1}l${(0.6 * k).toFixed(1)} ${(h - 3 * k).toFixed(1)}`;
  const n = Math.round((x1 - x0) / (60 * k));
  const postXs = posts ?? Array.from({ length: n + 1 }, (_, i) => x0 + 6 * k + ((x1 - x0 - 12 * k) * i) / n);
  const top = y - 36 * k;
  const mid = y - 18 * k;
  const postShapes = postXs.map((x) => `M${(x - 3 * k).toFixed(1)} ${y}L${(x - 3 * k).toFixed(1)} ${(top - 3 * k).toFixed(1)}L${(x + 3 * k).toFixed(1)} ${(top - 3 * k).toFixed(1)}L${(x + 3 * k).toFixed(1)} ${y}`);
  // A rail between posts, broken where a gap is.
  const rail = (ry, list) => {
    let d = '';
    const segs = [[x0, x1]];
    for (const [a, b] of list) {
      for (let i = segs.length - 1; i >= 0; i--) {
        const [s, e] = segs[i];
        if (b <= s || a >= e) continue;
        segs.splice(i, 1, ...[[s, a], [b, e]].filter(([p, q]) => q - p > 4));
      }
    }
    for (const [s, e] of segs) d += `M${s} ${ry}L${e} ${ry - 0.5}L${e} ${ry + 4 * k}L${s} ${ry + 4 * k}Z`;
    return d;
  };
  const visible = (x) => !gaps.some(([a, b]) => x > a - 4 && x < b + 4);
  const shownPosts = postShapes.filter((_, i) => visible(postXs[i]));
  const rails = rail(top, railGaps) + rail(mid, gaps);
  const legX = [x0 + (x1 - x0) * 0.32, x0 + (x1 - x0) * 0.68];
  const legs = legX.map((x) => `M${x - 5 * k} ${y + h}L${x - 7 * k} ${foot}M${x + 5 * k} ${y + h}L${x + 7 * k} ${foot}`).join('');
  const braces = legX.map((x) => `M${x - 6 * k} ${y + h + 6 * k}L${x - 26 * k} ${y + h}M${x + 6 * k} ${y + h + 6 * k}L${x + 26 * k} ${y + h}`).join('');
  const legShapes = legX.map((x) => `M${x - 5 * k} ${y + h}L${x - 7 * k} ${foot}L${x + 7 * k} ${foot}L${x + 5 * k} ${y + h}Z`).join('');
  return {
    lines: [deck, ...shownPosts, rails, legs],
    fine: [planks, braces],
    washes: [
      { c: PAL.ochre, o: 0.8, d: `${deck}${rails}${close(shownPosts)}` },
      { c: PAL.terracotta, o: 0.45, d: `M${x0} ${y + h * 0.55}L${x1} ${y + h * 0.55}L${x1} ${y + h}L${x0} ${y + h}Z${legShapes}` },
      { c: PAL.ochre, o: 0.55, d: legShapes },
    ],
  };
}

// ---------------------------------------------------------------------------------------------
// The river under the bridge, close up (pictures 2 to 4): rocky grassy banks at both ends, the
// bridge from x 34 to 366 with its deck top at y = 172, the river running underneath.
export const DECK = 172;
export function riverScene(opts = {}) {
  const leftBank = 'M0 186C14 182 28 182 38 186C46 212 40 250 52 300';
  const rightBank = 'M400 186C386 182 372 182 362 186C354 212 360 250 348 300';
  const water = 'M44 236C120 230 280 230 356 236L350 300L50 300Z';
  const waves = 'M80 252c10 -6 20 -6 30 0M150 268c10 -6 20 -6 30 0M240 254c10 -6 20 -6 30 0M290 280c10 -6 20 -6 30 0M110 286c10 -6 20 -6 30 0';
  const rocks = 'M8 222C18 212 30 214 34 226M6 266C16 256 30 258 34 270M392 222C382 212 370 214 366 226M394 266C384 256 370 258 366 270';
  const scene = {
    lines: [leftBank, rightBank],
    fine: [waves, rocks],
    washes: [
      { c: PAL.sky, o: 0.6, d: water },
      { c: PAL.grey, o: 0.6, d: `${leftBank}L0 300Z${rightBank}L400 300Z` },
      { c: PAL.green, o: 0.6, d: 'M0 186C14 182 28 182 38 186L40 196C28 192 14 192 0 196ZM400 186C386 182 372 182 362 186L360 196C372 192 386 192 400 196Z' },
    ],
  };
  return merge(scene, bridge({ x0: 34, x1: 366, y: DECK, foot: 254, ...opts }));
}
