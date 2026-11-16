import { PAL, hatch, paths, rays, transformPath, tufts } from '../lib.mjs';

// How the Rhinoceros Got His Skin, 1 (cover): on the beach by the Red Sea, the Parsee man (long robe,
// shining hat) bakes his huge cake on his little stove, while the Rhinoceros, whose skin still fits
// him tight and buttons up underneath, sniffs the smell from beside a palm tree.
// The characters and things are drawn here once, in their own coordinates; the other pictures import
// these shapes and place them with transforms.
export const f = (n) => Math.round(n * 10) / 10;

/** A point (x, y) moved by transform t. */
export const pt = (x, y, t) => transformPath(`M${x} ${y}`, t).slice(2).split(' ').map(Number);

/** A small circle as path data (arcs stay round under even scales, turns and mirrors). */
export const ring = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

// ---- The Rhinoceros: facing right, feet on y = 0, body centred on x = 0 ----
export const R = {
  back: 'M-62 -50C-60 -68 -44 -78 -20 -78C0 -78 12 -86 26 -84C34 -82 38 -76 40 -70',
  head: 'M40 -70C52 -62 64 -52 76 -44C84 -39 90 -36 93 -30C95 -25 92 -21 86 -20C78 -19 70 -21 63 -24C56 -27 50 -31 45 -35',
  horn: 'M77 -43C79 -56 84 -70 93 -84C94 -70 94 -52 91 -35',
  horn2: 'M63 -52C64 -58 67 -62 70 -64C71 -59 72 -54 72 -47',
  ear: 'M36 -80C33 -88 35 -96 40 -100C45 -94 46 -86 43 -76',
  frontLeg: 'M45 -35C43 -24 43 -12 43 0L25 0C25 -8 24 -15 23 -22',
  backLeg: 'M-62 -50C-63 -38 -59 -26 -55 -16C-55 -10 -55 -5 -55 0L-37 0C-37 -8 -38 -15 -40 -22',
  belly: 'M-40 -22C-20 -19 3 -19 23 -22',
  farBackLeg: 'M-37 -3L-25 -3C-25 -10 -26 -16 -27 -20',
  farFrontLeg: 'M43 -3L54 -3C54 -12 53 -22 51 -30',
  tail: 'M-61 -48C-67 -44 -69 -38 -69 -32M-69 -32l-3 5M-69 -32l0 6M-69 -32l3 5',
  // fine details
  toes: 'M-51 0q2 -3 4 0M-45 0q2 -3 4 0M29 0q2 -3 4 0M35 0q2 -3 4 0',
  nostril: 'M88 -28q2 -2 3 0',
  mouth: 'M82 -22Q76 -24 70 -23',
  earIn: 'M40 -94C42 -89 42 -84 41 -79',
  eye: 'M55 -52C55 -55 61 -55 61 -52C61 -49 55 -49 55 -52Z',
  pupil: [58.5, -52, 1.6],
  browSmug: 'M53 -58Q58 -61 63 -58',
  browGrumpy: 'M52 -61L63 -56',
  // the seam and three buttons under his tummy (before)
  seam: 'M-34 -21.5C-16 -18.5 4 -18.5 20 -21.5',
  // the folds of his skin (after): over the shoulders, round the hips, under the tummy, down the legs
  folds:
    'M30 -77C24 -62 25 -44 31 -30M24 -79C18 -64 19 -46 24 -33' +
    'M-36 -80C-44 -64 -44 -44 -38 -26M-42 -78C-50 -62 -50 -44 -45 -30' +
    'M-36 -16C-16 -10 6 -10 22 -17' +
    'M26 -13q8 3 16 0M27 -7q7 2 15 0M-54 -11q8 3 16 0M-54 -6q8 2 16 0M46 -40q4 6 2 12',
};
export const buttonAt = [[-24, -20], [-6, -19], [12, -20]];
R.buttons = buttonAt.map(([x, y]) => ring(x, y, 2.6)).join('');
R.bodyWash =
  'M-62 -52C-60 -68 -44 -80 -20 -80C0 -80 12 -88 26 -86C30 -86 33 -84 35 -82C34 -90 36 -96 40 -100C45 -94 46 -86 44 -76L40 -70C52 -62 64 -52 76 -44C84 -39 90 -36 93 -30C95 -25 92 -21 86 -20C78 -19 70 -21 63 -24L45 -35C43 -24 43 -12 43 0L25 0L23 -22C3 -19 -20 -19 -40 -22L-37 0L-55 0C-55 -10 -59 -26 -63 -38Z';
R.farLegWash = 'M-37 -3L-25 -3C-25 -10 -26 -16 -27 -21L-38 -21ZM43 -3L54 -3C54 -12 53 -22 51 -30L44 -34Z';
R.hornWash = 'M77 -43C79 -56 84 -70 93 -84C94 -70 94 -52 91 -35ZM63 -52C64 -58 67 -62 70 -64C71 -59 72 -54 72 -47Z';
R.foldWash = 'M24 -79C18 -64 19 -46 24 -33L31 -30C25 -44 24 -62 30 -77ZM-42 -78C-50 -62 -50 -44 -45 -30L-38 -26C-44 -44 -44 -64 -36 -80ZM-38 -18C-16 -12 6 -12 22 -19L22 -23C3 -20 -20 -20 -40 -22Z';

/**
 * The Rhinoceros placed by transform t. skin: 'tight' (buttons) or 'folded' (baggy folds, grumpy).
 * `skip` leaves out outline pieces (for a rhino half under water).
 */
export function rhino(t, { skin = 'tight', look = [0, 0], skip = [], wash = PAL.grey } = {}) {
  const keep = (k) => !skip.includes(k);
  const main = ['back', 'head', 'horn', 'horn2', 'ear', 'frontLeg', 'backLeg', 'belly', 'farBackLeg', 'farFrontLeg', 'tail'].filter(keep).map((k) => R[k]);
  const fine = [...['toes', 'nostril', 'mouth', 'earIn'].filter(keep).map((k) => R[k]), R.eye, skin === 'tight' ? R.browSmug : R.browGrumpy];
  if (skin === 'tight' && keep('belly')) fine.push(R.seam);
  if (skin === 'folded') fine.push(R.folds);
  const [cx, cy] = pt(R.pupil[0] + look[0], R.pupil[1] + look[1], t);
  const s = Math.hypot(...pt(1, 0, t).map((v, i) => v - pt(0, 0, t)[i]));
  const washes = [
    { c: wash, o: 0.62, t, d: R.bodyWash },
    { c: PAL.slate, o: 0.3, t, d: R.farLegWash },
    { c: PAL.ochre, o: 0.4, t, d: R.hornWash },
  ];
  if (skin === 'folded') washes.push({ c: PAL.slate, o: 0.35, t, d: R.foldWash });
  if (skin === 'tight' && keep('belly')) washes.push({ c: PAL.ochre, o: 0.9, t, d: R.buttons });
  return {
    washes,
    whites: transformPath(R.eye, t),
    lines: paths(main, t),
    fine: paths(fine, t) + (skin === 'tight' && keep('belly') ? paths([R.buttons], t) : ''),
    fills: `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R.pupil[2] * s)}"/>`,
  };
}

// ---- The Parsee man: facing the viewer, a little turned to the left, feet on y = 0 ----
export const M = {
  robe: 'M-13 -66C-19 -46 -25 -20 -29 0L29 0C25 -20 19 -46 13 -66',
  hem: 'M-29 0C-10 4 10 4 29 0',
  shoes: 'M-18 1C-24 1 -28 4 -26 6L-12 6M18 1C24 1 28 4 26 6L12 6',
  sash: 'M-17 -44C-6 -40 6 -40 17 -44',
  collar: 'M-7 -67L0 -58L7 -67',
  face: 'M-12 -82C-12 -96 12 -96 12 -82C12 -71 6 -66 0 -66C-6 -66 -12 -71 -12 -82Z',
  hat: 'M-14 -92C-12 -104 -10 -114 0 -117C10 -114 12 -104 14 -92Z',
  brim: 'M-17 -92C-6 -95 6 -95 17 -92',
  // fine details
  eyes: 'M-6 -84l0 1.5M5 -84l0 1.5',
  nose: 'M-1 -82q-2 3 1 4',
  smile: 'M-4 -74Q0 -70 4 -74',
  bigSmile: 'M-7 -76Q0 -68 7 -76Z',
  folds: 'M-6 -36C-8 -24 -10 -12 -11 -2M7 -36C9 -24 11 -12 12 -2',
  hatBand: 'M-13 -96C-4 -98 4 -98 13 -96',
};
M.robeWash = M.robe + 'C10 -70 6 -68 0 -68C-6 -68 -10 -70 -13 -66Z';
M.faceWash = M.face;
M.hatWash = M.hat + M.brim + 'L14 -90L-14 -90Z';

/** Two arms (sleeves and hands) as [inkPath, washPath] pairs, from the shoulders. */
export const ARMS = {
  // one hand on his hip, the other stirring with a spoon held out to the left
  stir: {
    ink: 'M-12 -62C-22 -58 -30 -54 -36 -50M-14 -54C-22 -50 -27 -47 -32 -44M12 -62C20 -56 22 -48 18 -42M14 -54C17 -50 17 -46 15 -44',
    hands: ring(-36, -46, 4) + ring(16, -43, 3.5),
    tool: 'M-38 -48L-50 -62',
    wash: 'M-12 -62C-22 -58 -30 -54 -36 -50L-32 -44C-27 -47 -22 -50 -14 -54ZM12 -62C20 -56 22 -48 18 -42L15 -44C17 -46 17 -50 14 -54Z',
  },
  // both arms hugging the palm trunk (he has climbed up), hands up above his head
  hug: {
    ink: 'M-12 -62C-16 -74 -16 -86 -14 -96M-6 -64C-8 -76 -8 -86 -7 -96M12 -62C16 -74 16 -86 14 -96M6 -64C8 -76 8 -86 7 -96',
    hands: ring(-11, -99, 4) + ring(11, -99, 4),
    tool: '',
    wash: 'M-12 -62C-16 -74 -16 -86 -14 -96L-7 -96C-8 -86 -8 -76 -6 -64ZM12 -62C16 -74 16 -86 14 -96L7 -96C8 -86 8 -76 6 -64Z',
  },
  // holding a sack out to the left with both hands, tipping it
  pour: {
    ink: 'M-12 -62C-22 -60 -30 -58 -38 -58M-13 -54C-22 -52 -29 -51 -36 -51M12 -62C4 -54 -12 -50 -26 -48M12 -54C4 -48 -10 -45 -24 -44',
    hands: ring(-40, -55, 4) + ring(-27, -46, 3.8),
    tool: '',
    wash: 'M-12 -62C-22 -60 -30 -58 -38 -58L-36 -51C-29 -51 -22 -52 -13 -54ZM12 -62C4 -54 -12 -50 -26 -48L-24 -44C-10 -45 4 -48 12 -54Z',
  },
};

/** The Parsee man placed by t, with an arm pose; `smile` is 'small' or 'big'; `hatOff` leaves his hat off. */
export function parsee(t, { arms = 'stir', smile = 'small', hatOff = false } = {}) {
  const A = ARMS[arms];
  const lines = [M.robe, M.face, M.shoes, A.ink, ...(A.tool ? [A.tool] : []), ...(hatOff ? [] : [M.hat, M.brim])];
  const fine = [M.hem, M.sash, M.collar, M.nose, M.folds, A.hands, smile === 'big' ? M.bigSmile : M.smile, ...(hatOff ? [] : [M.hatBand])];
  const eyes = smile === 'big' ? 'M-8 -84Q-6 -87 -4 -84M3 -84Q5 -87 7 -84' : '';
  const shine = hatOff ? '' : paths([rays(0, -106, 19, 28, 9, 4, -100)], t);
  return {
    washes: [
      { c: PAL.sky, o: 0.5, t, d: M.robeWash },
      { c: PAL.red, o: 0.55, t, d: 'M-17 -44C-6 -40 6 -40 17 -44L18 -39C6 -35 -6 -35 -18 -39Z' },
      { c: PAL.terracotta, o: 0.4, t, d: M.faceWash + A.hands },
      { c: PAL.rose, o: 0.6, t, d: ring(-8, -76, 2.6) + ring(8, -76, 2.6) },
      ...(hatOff ? [] : [{ c: PAL.ochre, o: 0.85, t, d: M.hatWash }]),
      { c: PAL.sky, o: 0.5, t, d: A.wash },
    ],
    lines: paths(lines, t),
    fine: paths(fine, t) + (smile === 'big' ? paths([eyes], t) : ''),
    once: shine,
    fills: smile === 'big' ? '' : paths([ring(-5.5, -83.5, 1.5) + ring(5, -83.5, 1.5)], t),
    glints: hatOff ? '' : `<path d="${transformPath('M-6 -108C-6 -112 -3 -114 -1 -114C-3 -111 -4 -108 -4 -104Z', t)}"/>`,
  };
}

// ---- The palm tree: base at 0, 0, leaning a little to the right, crown at (15, -150) ----
const trunkX = (h) => 15 * (h / 150) ** 1.6; // centre of the trunk at height h
const trunkW = (h) => 18 - (4 * h) / 150; // its width
/** The trunk's two sides and rings, leaving out heights inside `gap` [from, to] (something in front). */
function trunk(gap) {
  const hidden = (h) => gap && h > gap[0] && h < gap[1];
  let sides = '';
  let rings = '';
  for (const side of [-1, 1]) {
    let pen = false;
    for (let h = 0; h <= 150; h += 6) {
      if (hidden(h)) {
        pen = false;
        continue;
      }
      const x = f(trunkX(h) + (side * trunkW(h)) / 2);
      sides += `${pen ? 'L' : 'M'}${x} ${-h}`;
      pen = true;
    }
  }
  for (let h = 20; h < 145; h += 22) {
    if (hidden(h) || hidden(h + 3)) continue;
    const [x, w] = [trunkX(h), trunkW(h)];
    rings += `M${f(x - w / 2 + 1)} ${-h}q${f(w / 2 - 1)} 3 ${f(w - 2)} 0`;
  }
  return { sides, rings };
}
export const P = {
  fronds:
    'M15 -150C0 -168 -28 -172 -50 -160C-30 -162 -10 -158 15 -150Z' +
    'M15 -150C4 -176 -14 -190 -30 -192C-16 -180 -2 -166 15 -150Z' +
    'M15 -150C24 -176 44 -188 62 -186C46 -176 30 -164 15 -150Z' +
    'M15 -150C34 -166 62 -168 80 -152C60 -156 38 -156 15 -150Z' +
    'M15 -150C26 -158 44 -148 52 -126C40 -140 30 -146 15 -150Z' +
    'M15 -150C2 -154 -16 -144 -24 -124C-12 -138 0 -146 15 -150Z',
  veins: 'M12 -152C-6 -162 -26 -164 -42 -160M14 -154C2 -170 -12 -182 -24 -188M17 -154C28 -170 42 -180 56 -184M18 -152C36 -160 56 -162 72 -156',
  nuts: ring(10, -146, 4) + ring(19, -144, 4),
  trunkWash: 'M-9 0C-8 -50 -3 -100 8 -150L22 -148C13 -100 9 -50 9 0Z',
};
/** Where the trunk's centre is at height h (palm coordinates). */
export const palmAt = (h) => [trunkX(h), -h];

/** The palm tree placed by t; `gap` leaves out part of the trunk's ink (someone in front of it). */
export function palm(t, { gap } = {}) {
  const tr = trunk(gap);
  return {
    washes: [
      { c: PAL.ochre, o: 0.5, t, d: P.trunkWash },
      { c: PAL.green, o: 0.75, t, d: P.fronds },
      { c: PAL.terracotta, o: 0.7, t, d: P.nuts },
    ],
    lines: paths([tr.sides, P.fronds], t),
    fine: paths([tr.rings, P.veins, P.nuts], t),
  };
}

// ---- The stove (feet on y = 0) and the cake ----
export const S = {
  box: 'M-24 -38L24 -38L24 -8L-24 -8Z',
  top: 'M-28 -38L28 -38',
  legs: 'M-20 -8L-23 0M20 -8L23 0',
  door: 'M-11 -31L11 -31L11 -14L-11 -14Z',
  pipe: 'M14 -38L14 -48L20 -48L20 -38',
};
S.wash = 'M-24 -38L24 -38L24 -8L-24 -8Z';
S.fire = 'M-11 -14C-11 -22 -6 -26 -4 -30C-2 -24 2 -26 4 -30C6 -24 11 -22 11 -14Z';
// the cake: a big round drum, sitting on y = 0 (its own coordinates)
export const C = {
  side: 'M-34 -24L-34 -6C-34 4 34 4 34 -6L34 -24',
  top: 'M-34 -24C-34 -34 34 -34 34 -24C34 -14 -34 -14 -34 -24Z',
  icing: 'M-34 -22C-28 -12 -22 -18 -18 -10C-12 -14 -6 -8 0 -12C6 -8 12 -14 18 -10C22 -16 28 -12 34 -22',
};
C.wash = 'M-34 -24C-34 -34 34 -34 34 -24L34 -6C34 4 -34 4 -34 -6Z';
C.topWash = C.top;
C.currants = [[-18, -25], [-6, -28], [8, -24], [20, -27], [0, -21], [-24, -22], [14, -21]];

/** The cake placed by t. */
export function cake(t) {
  return {
    washes: [
      { c: PAL.terracotta, o: 0.6, t, d: C.wash },
      { c: PAL.ochre, o: 0.55, t, d: C.topWash },
    ],
    lines: paths([C.side, C.top], t),
    fine: paths([C.icing], t),
    fills: paths([C.currants.map(([x, y]) => ring(x, y, 1.6)).join('')], t),
  };
}

// ---- This picture ----
const RT = 'translate(112 256) scale(1.45)';
const rh = rhino(RT, { look: [1.4, -0.4] });
const ST = 'translate(290 256)';
const KT = 'translate(290 218) scale(0.95)';
const ck = cake(KT);
const MT = 'translate(360 256) scale(1.3)';
const man = parsee(MT);

// sniff: wavy smell lines from the cake to the Rhinoceros's nose, and steam
const smell = 'M266 176C258 166 250 176 242 168C236 162 230 166 226 162M262 190C256 182 250 190 244 184';
const steam = 'M276 180c-4 -6 4 -10 0 -16M290 176c-4 -6 4 -10 0 -16M304 180c-4 -6 4 -10 0 -16';

// sea, beach and the sun
const sea = 'M8 128C60 126 120 129 158 128M186 128C240 126 290 129 330 128';
const waves = 'M200 142q8 -4 16 0M246 150q8 -4 16 0M30 140q8 -4 16 0M100 136q8 -4 16 0';
const beach = 'M8 258C90 254 180 260 260 256C320 253 360 257 392 255';

export default {
  title: 'How the Rhinoceros Got His Skin',
  seed: 71,
  washes: [
    { c: PAL.sky, o: 0.45, d: 'M8 128C80 126 150 130 230 127C300 124 360 128 392 126L392 176C300 180 120 172 8 178Z' },
    { c: PAL.ochre, o: 0.35, d: 'M8 176C120 170 300 178 392 174L394 290C300 294 140 286 8 292Z' },
    { c: PAL.ochre, o: 0.6, d: 'M42 50C42 34 66 34 66 50C66 66 42 66 42 50Z' },
    ...rh.washes,
    { c: PAL.slate, o: 0.6, t: ST, d: S.wash },
    { c: PAL.red, o: 0.75, t: ST, d: S.fire },
    ...ck.washes,
    ...man.washes,
  ],
  whites: rh.whites,
  lines: rh.lines + paths([S.box, S.top, S.legs, S.pipe], ST) + ck.lines + man.lines + paths([beach]),
  fine:
    rh.fine +
    paths([S.door], ST) +
    ck.fine +
    man.fine +
    paths([smell, steam, sea, waves, rays(54, 50, 16, 27, 11, 3), tufts([[20, 258], [250, 257], [392, 255]], 8, 4), hatch(30, 276, 370, 274, 12, 6, 165, 5)]),
  once: man.once,
  fills: rh.fills + man.fills + ck.fills,
  glints: man.glints,
};
