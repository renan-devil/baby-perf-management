import { PAL, transformPath } from '../lib.mjs';
import { dot, limb, merge, oval } from '../stone-soup/characters.mjs';

// The Great Race: little Rat, big kind Ox, sleepy Cat, the Jade Emperor and kind Dragon, shared by the
// five pictures. Each is drawn once here and placed in each picture with a transform (place); flip
// with scale(-1 1). The build only draws files named <n>.mjs, so this file is not a picture.

export { at, compose, dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

// ---------------------------------------------------------------------------------------------
// Rat, seen from the side, facing right, feet at y = 0, about 80 tall to the ear: a pear body with a
// cream belly, a long pointed snout with a pink nose, a round pink ear, a long thin tail.
// arms: two limb centrelines from the shoulder (near first). legs: 'stand' (two pink feet) or
// 'leap' (both hind legs stretched out behind). mood: 'happy', 'shout' (open mouth, calling).
export const R_ARMS = {
  down: [[[4, -36, 7], [12, -26, 6], [14, -18, 5.5]], null],
  // both paws forward and up, holding on (to Ox's horns) or reaching for the bank
  reach: [[[4, -36, 7], [22, -40, 6], [36, -46, 5.5]], [[-2, -38, 6.5], [16, -46, 6], [30, -54, 5.5]]],
  // paws cupped round the mouth, calling
  call: [[[4, -36, 7], [26, -32, 6], [36, -40, 5.5]], [[-2, -38, 6.5], [18, -36, 6], [30, -44, 5.5]]],
};
const rHead = 'M-6 -52C-8 -62 2 -68 12 -66C20 -64 28 -58 37 -52C41 -50 40 -46 36 -45C28 -42 14 -42 4 -43C-2 -44 -5 -47 -6 -52Z';
const rEar = 'M-1 -62C-12 -65 -13 -80 -2 -80C7 -80 10 -71 6 -65';
const rEarIn = 'M0 -66C-7 -68 -8 -76 -2 -76C4 -76 5 -71 3 -68Z';
const rEarFar = 'M10 -65C9 -73 17 -76 20 -70';
const rBody = 'M-10 -46C-22 -36 -22 -8 -12 -1C-4 3 10 3 14 -2C19 -12 18 -32 8 -44';
const rBelly = 'M5 -40C13 -30 14 -14 8 -4C3 -3 0 -10 1 -22C1 -30 2 -36 5 -40Z';
const rFeet = 'M-6 0C-8 -4 0 -5 6 -2L7 1L-6 1ZM6 0C6 -4 14 -5 19 -1L19 1L6 1Z';
const rLegs = [
  [[-8, -8, 9], [-22, -4, 7], [-36, 2, 5], [-44, 4, 5]],
  [[-4, -4, 8], [-16, 4, 6], [-28, 12, 5], [-36, 14, 5]],
];
const rTail = 'M-16 -10C-34 -6 -50 -12 -58 -24C-64 -33 -72 -35 -78 -29';

export function rat({ arms = R_ARMS.down, legs = 'stand', mood = 'happy' } = {}) {
  const [near, far] = arms;
  const nearArm = limb(near);
  const farArm = far ? limb(far) : null;
  const pawAt = (pts) => dot(pts[pts.length - 1][0], pts[pts.length - 1][1], 4);
  const paws = [pawAt(near), ...(far ? [pawAt(far)] : [])].join('');
  const legPaths = legs === 'leap' ? rLegs.map(limb) : [];
  const feet = legs === 'leap' ? rLegs.map((p) => dot(p[p.length - 1][0] - 2, p[p.length - 1][1], 4.5)).join('') : rFeet;
  const fur = `${rHead}${rEar}Z${rEarFar}Z${rBody}Z${nearArm}Z${farArm ? `${farArm}Z` : ''}${legPaths.map((d) => `${d}Z`).join('')}`;
  const face = {
    fine: ['M35 -47l14 -4M35 -46l14 3M34 -45l11 7'],
    fills: [dot(39, -50, 2.6), dot(19, -57, 2.3)],
    glints: [dot(18.3, -57.8, 0.7)],
    washes: [],
  };
  if (mood === 'shout') {
    const mouth = oval(30, -42, 3, 2.6);
    face.fine.push(mouth, 'M14 -63q5 -3 10 0');
    face.washes.push({ c: PAL.red, o: 0.8, d: mouth });
  } else face.fine.push('M26 -45q4 3 8 -1');
  return merge(
    {
      lines: [...(farArm ? [farArm] : []), rTail, rEarFar, ...legPaths, rBody, rEar, rHead, nearArm],
      fine: [feet, paws, 'M-12 -26q-4 4 -2 10'],
      washes: [
        { c: PAL.grey, o: 0.8, d: fur },
        { c: PAL.terracotta, o: 0.28, d: fur },
        { c: PAL.rose, o: 0.85, d: `${rEarIn}${feet}${paws}${dot(39, -50, 3)}` },
      ],
      whites: [rBelly],
    },
    face,
  );
}

// ---------------------------------------------------------------------------------------------
// Ox's head, swimming towards us: seen from the front, centre of the face at (0, 0), about 130 wide
// and 140 tall with the horns. A broad brown head with a curly forehead tuft, two big pale horns
// curving up (Rat sits between them and holds the right one), floppy ears, kind eyes and a big pink
// muzzle. back: his back, a low hump trailing behind on the left. The water line is near y = 26.
export const OX_SEAT = [12, -52];
const oHead = 'M-34 -42C-26 -58 26 -58 34 -42C42 -24 38 -4 32 10C28 20 -28 20 -32 10C-38 -4 -42 -24 -34 -42Z';
const oHorn = limb([[-26, -46, 13], [-40, -58, 10.5], [-47, -73, 8], [-44, -90, 4]]);
const mirror = (d) => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${-x} ${y}`);
const oHornR = mirror(oHorn);
const oEar = 'M-36 -32C-50 -40 -66 -36 -72 -26C-62 -18 -48 -20 -38 -24';
const oEarIn = 'M-42 -30C-52 -34 -62 -31 -66 -26C-58 -22 -50 -23 -43 -26Z';
const oMuzzle = 'M-30 14C-34 0 -20 -6 0 -6C20 -6 34 0 30 14C28 30 14 36 0 36C-14 36 -28 30 -30 14Z';
const oNostrils = 'M-14 14C-14 8 -6 8 -6 14C-6 18 -14 18 -14 14ZM6 14C6 8 14 8 14 14C14 18 6 18 6 14Z';
const oTuft = 'M-12 -52C-14 -60 -4 -64 -2 -56M-2 -54C-2 -64 10 -64 10 -54M8 -53C10 -60 18 -58 16 -50';
const oBack = 'M-34 0C-60 -18 -100 -20 -130 2C-140 10 -146 18 -150 24';
const oBackWash = 'M-34 0C-60 -18 -100 -20 -130 2C-140 10 -146 18 -150 26L-30 26Z';

export function ox({ mood = 'happy', back = true } = {}) {
  const earR = mirror(oEar);
  const coat = `${oHead}${oEar}Z${earR}Z`;
  const eyes =
    mood === 'wow'
      ? { fills: [dot(-15, -20, 3), dot(15, -20, 3)], glints: [dot(-16, -21, 0.9), dot(14, -21, 0.9)], fine: ['M-22 -30q7 -4 14 0M8 -30q7 -4 14 0'] }
      : { fine: ['M-22 -20q7 6 14 0M8 -20q7 6 14 0', 'M-22 -28q7 -3 14 0M8 -28q7 -3 14 0'] };
  return merge(
    {
      lines: [...(back ? [oBack] : []), oEar, earR, `${oHorn}Z`, `${oHornR}Z`, oHead, oMuzzle],
      fine: [oTuft, 'M-12 26q12 6 24 0', oNostrils, 'M-58 -10q10 -6 18 -2M-96 -12q12 -4 22 0'],
      washes: [
        { c: PAL.terracotta, o: 0.7, d: `${coat}${back ? oBackWash : ''}` },
        { c: PAL.ochre, o: 0.3, d: coat },
        { c: PAL.rose, o: 0.8, d: `${oMuzzle}${oEarIn}${mirror(oEarIn)}` },
        { c: PAL.ochre, o: 0.4, d: `${oHorn}Z${oHornR}Z` },
      ],
      whites: [],
      fills: [oNostrils],
    },
    eyes,
  );
}

// ---------------------------------------------------------------------------------------------
// The river: a band of water from y = top down to the bottom of the picture, with wavy lines.
export function water(top, { seed = 1, until = 400, shape } = {}) {
  const r = (i) => ((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1 + 1) % 1;
  const waves = [];
  for (let row = 0; row < 4; row++) {
    const y = top + 18 + row * 22;
    for (let k = 0; k < 4; k++) {
      const x = 20 + k * 100 + (row % 2) * 50 + r(row * 7 + k) * 20;
      if (x + 32 < until) waves.push(`M${x} ${y}q8 -6 16 0q8 6 16 0`);
    }
  }
  return {
    washes: [{ c: PAL.sky, o: 0.55, d: shape ?? `M0 ${top}C100 ${top - 4} 300 ${top + 4} 400 ${top}L400 300L0 300Z` }],
    fine: waves,
  };
}

// ---------------------------------------------------------------------------------------------
// The Jade Emperor, seated on his throne and seen from the front, feet at y = 0, about 210 tall
// with his hat. A kind old face with white eyebrows and a long white beard; a flat-topped crown
// (a board with strings of beads) over a dark cap; a wide imperial-yellow robe with red trim. His
// right hand (on our left) is raised, palm out, to announce; the other rests on his knee.
// The throne is red, with a rounded back.
const eFace = 'M-20 -150C-20 -168 20 -168 20 -150C20 -136 12 -126 0 -126C-12 -126 -20 -136 -20 -150Z';
const eCap = 'M-19 -158C-20 -172 -10 -178 0 -178C10 -178 20 -172 19 -158C10 -162 -10 -162 -19 -158Z';
const eBoard = 'M-38 -184L38 -184L36 -178L-36 -178Z';
const eStrings = 'M-34 -178l0 6M-34 -168l0 5M-27 -178l0 6M-27 -168l0 5M27 -178l0 6M27 -168l0 5M34 -178l0 6M34 -168l0 5';
const eBeads = [-34, -27, 27, 34].flatMap((x) => [dot(x, -170, 1.6), dot(x, -161, 1.6)]).join('');
const eBeard = 'M-12 -134C-16 -116 -10 -98 0 -86C10 -98 16 -116 12 -134C6 -128 -6 -128 -12 -134Z';
const eMoustache = 'M0 -138C-6 -142 -14 -138 -18 -128C-12 -134 -6 -134 0 -134C6 -134 12 -134 18 -128C14 -138 6 -142 0 -138Z';
const eBrows = 'M-16 -155C-12 -160 -6 -160 -3 -157L-6 -155C-9 -157 -12 -157 -16 -155ZM16 -155C12 -160 6 -160 3 -157L6 -155C9 -157 12 -157 16 -155Z';
const eEyes = 'M-14 -149q5 4 10 0M4 -149q5 4 10 0';
const eRobe =
  'M-24 -124C-40 -120 -54 -110 -58 -92C-62 -66 -66 -36 -74 -4C-50 2 50 2 74 -4C66 -36 62 -66 58 -92C54 -110 40 -120 24 -124Z';
const eCollar = 'M-14 -126L8 -92M14 -126L-4 -100';
const eBelt = 'M-50 -72C-20 -66 20 -66 50 -72L50 -62C20 -56 -20 -56 -50 -62Z';
const eHem = 'M-74 -4C-50 2 50 2 74 -4L72 -14C50 -8 -50 -8 -72 -14Z';
const eSleeveUp = 'M-48 -112C-62 -108 -76 -122 -84 -142C-86 -150 -74 -156 -68 -150C-62 -138 -56 -128 -44 -124';
const eHandUp = 'M-84 -146C-90 -152 -90 -164 -86 -170C-84 -174 -80 -172 -80 -168L-79 -176C-78 -180 -73 -179 -73 -175L-72 -178C-71 -182 -66 -181 -66 -177L-66 -174C-64 -177 -60 -176 -61 -172C-62 -164 -64 -156 -70 -150Z';
const eSleeveDown = 'M48 -112C62 -100 66 -78 58 -60C52 -52 40 -52 32 -58';
const eHandDown = 'M32 -58C26 -60 22 -54 24 -50C28 -46 34 -48 36 -54Z';
const eShoes = 'M-30 0C-34 -6 -18 -8 -14 -2L-14 2L-30 2ZM14 -2C18 -8 34 -6 30 0L30 2L14 2Z';
const tBack = 'M-106 -60L-106 -176C-106 -212 106 -212 106 -176L106 -60';
const tInner = 'M-94 -66L-94 -172C-94 -198 94 -198 94 -172L94 -66Z';
const tSeat = 'M-116 -60L-62 -60M62 -60L116 -60L116 -46L66 -46M-66 -46L-116 -46L-116 -60M-110 -46L-110 4M110 -46L110 4';
const tSeatWash = 'M-116 -60L-60 -60L-64 -46L-116 -46ZM116 -60L60 -60L64 -46L116 -46Z';
const tKnobs = dot(-106, -182, 5) + dot(106, -182, 5);

export function emperor() {
  return {
    lines: [tBack, tInner, tSeat, eRobe, eSleeveDown, eSleeveUp, eFace, eCap, eBoard, eBeard],
    fine: [eStrings, eBeads, eMoustache, eBrows, eEyes, eCollar, eBelt, eHem, eHandUp, eHandDown, eShoes, 'M-6 -140q6 3 12 0', tKnobs],
    washes: [
      { c: PAL.red, o: 0.7, rule: 'evenodd', d: `${tBack}Z${tInner}` },
      { c: PAL.red, o: 0.7, d: tSeatWash },
      { c: PAL.ochre, o: 0.25, d: tInner },
      { c: PAL.ochre, o: 0.55, d: tKnobs },
      { c: PAL.ochre, o: 0.85, d: `${eRobe}${eSleeveUp}Z${eSleeveDown}Z` },
      { c: PAL.red, o: 0.75, d: `${eBelt}${eHem}M-14 -126L8 -92L14 -96L-6 -126Z` },
      { c: PAL.ink, o: 0.75, d: `${eCap}${eBoard}${eShoes}` },
      { c: PAL.rose, o: 0.3, d: `${eFace}${eHandUp}${eHandDown}` },
      { c: PAL.rose, o: 0.5, d: dot(-13, -138, 4) + dot(13, -138, 4) },
      { c: PAL.green, o: 0.7, d: dot(0, -181, 3.5) },
    ],
    whites: [eBeard, eMoustache, eBrows],
  };
}

// Little curly clouds (in the Chinese way: round puffs ending in a spiral), centre (0, 0), about
// 120 wide.
export function cloud() {
  const d = 'M-60 6C-66 -6 -54 -16 -42 -10C-40 -24 -20 -28 -10 -18C-4 -30 18 -30 24 -18C34 -26 52 -20 50 -6C62 -6 66 6 56 10C30 14 -30 14 -60 6Z';
  const curls = 'M-42 -10C-40 -2 -30 -2 -30 -8C-30 -12 -36 -12 -36 -8M24 -18C22 -10 30 -6 34 -10C36 -14 32 -16 30 -13M-10 -18C-10 -10 0 -10 0 -14';
  return { lines: [d], fine: [curls], washes: [{ c: PAL.sky, o: 0.35, d }], whites: [] };
}

// ---------------------------------------------------------------------------------------------
// Cat, fast asleep after his big lunch: a grey tabby lying on his side, floor at y = 0, his head on
// the left resting on the ground and turned towards us (eyes shut, a little smile), his round full
// white tummy facing us, paws folded on it, his striped tail curling up on the right. About 200
// wide and 90 tall.
const cBody = 'M-40 -60C-20 -88 50 -90 72 -62C88 -40 84 -6 58 0L-30 0C-50 -6 -56 -36 -40 -60Z';
const cTummy = 'M-18 -38C-18 -62 46 -64 48 -38C48 -14 30 -4 14 -4C-2 -4 -18 -14 -18 -38Z';
const cHead = 'M-86 -30C-86 -48 -74 -58 -60 -58C-46 -58 -34 -48 -34 -30C-34 -14 -46 -4 -60 -4C-74 -4 -86 -14 -86 -30Z';
const cEars = 'M-82 -42L-84 -68L-68 -55M-52 -56L-36 -66L-38 -42';
const cEarsIn = 'M-80 -46L-81 -61L-71 -54ZM-48 -54L-40 -60L-41 -46Z';
const cFace = 'M-76 -32q5 4 10 0M-54 -32q5 4 10 0M-60 -17q-3 4 -7 2M-60 -17q3 4 7 2';
const cNose = 'M-63 -22L-57 -22L-60 -18Z';
const cWhiskers = 'M-70 -20l-22 -3M-70 -17l-21 4M-50 -20l22 -3M-50 -17l21 4';
const cPaws = 'M-28 -56C-36 -54 -36 -44 -28 -44C-20 -44 -18 -54 -28 -56ZM-24 -34C-32 -32 -32 -22 -24 -22C-16 -22 -14 -32 -24 -34Z';
const cLeg = 'M62 -10C78 -14 96 -8 100 0C90 4 70 4 58 0';
const cTail = limb([[74, -30, 13], [96, -40, 11], [104, -60, 9], [96, -76, 7]]);
const cStripes = 'M-20 -78C-14 -70 -12 -62 -14 -56M2 -84C6 -76 8 -68 6 -62M26 -86C30 -78 30 -70 28 -64M50 -78C52 -70 52 -62 50 -56M68 -60C64 -54 60 -50 56 -46';
const cHeadStripes = 'M-66 -56l2 7M-60 -58l0 8M-54 -56l-2 7';
const cTailStripes = 'M92 -34l8 -9M102 -50l9 -3M100 -66l7 3';

export function cat() {
  const fur = `${cBody}${cHead}${cTail}Z${cLeg}Z`;
  return {
    lines: [cTail, cBody, cLeg, cHead, cEars],
    fine: [cTummy, cPaws, cFace, cWhiskers, cStripes, cHeadStripes, cTailStripes],
    washes: [
      { c: PAL.grey, o: 0.7, d: `${fur}M-82 -42L-84 -68L-68 -55ZM-52 -56L-36 -66L-38 -42Z` },
      { c: PAL.slate, o: 0.35, d: `${cBody}${cTail}Z` },
      { c: PAL.rose, o: 0.8, d: `${cEarsIn}${cNose}` },
      { c: PAL.rose, o: 0.35, d: dot(-74, -24, 4) + dot(-46, -24, 4) },
    ],
    whites: [cTummy, 'M-72 -20C-70 -10 -50 -10 -48 -20C-54 -26 -66 -26 -72 -20Z'],
    fills: [cNose],
  };
}

// A fish skeleton (head on the left, centre 0,0, about 50 wide), all that is left of lunch.
export function fishbone() {
  return {
    lines: ['M-26 0C-22 -8 -14 -10 -10 -6C-12 -2 -12 2 -10 6C-14 10 -22 8 -26 0Z', 'M-10 0L20 0M20 0L30 -8L30 8Z'],
    fine: ['M-4 -7L-2 7M4 -8L6 8M12 -7L13 7', 'M-19 -2l0 0'],
    washes: [],
    fills: [dot(-19, -2, 1.5)],
  };
}

// ---------------------------------------------------------------------------------------------
// Dragon, in the Chinese way: long and wingless, a green snake-like body winding through the sky,
// red fins along his back, a cream belly, four little clawed legs, a kind face with big eyes, little
// antlers, a flowing mane and long whiskers. Drawn in place (whole picture coordinates): the body
// follows SPINE from the neck (left) to the tip of the tail (right); the head faces left.
const SPINE = [
  [118, 96, 26], [150, 76, 28], [188, 64, 28], [224, 82, 26], [252, 112, 24], [290, 124, 20], [326, 102, 16],
  [350, 74, 12], [370, 58, 8], [386, 52, 5],
];
const f1 = (n) => Math.round(n * 10) / 10;
// a point on the body: segment i, fraction t along it, side s (-1 top, +1 bottom, 0 middle)
function onBody(i, t, s) {
  const [ax, ay, aw] = SPINE[i];
  const [bx, by, bw] = SPINE[i + 1];
  const l = Math.hypot(bx - ax, by - ay);
  const nx = -(by - ay) / l;
  const ny = (bx - ax) / l;
  const w = (aw + (bw - aw) * t) / 2;
  return [ax + (bx - ax) * t + nx * w * s, ay + (by - ay) * t + ny * w * s, nx, ny, (bx - ax) / l, (by - ay) / l];
}
function dragonBits() {
  let fins = '';
  let scales = '';
  let belly = '';
  for (let i = 0; i < SPINE.length - 2; i++) {
    for (const t of [0.25, 0.75]) {
      const [x, y, nx, ny, tx, ty] = onBody(i, t, -1);
      const h = SPINE[i][2] * 0.45;
      fins += `M${f1(x - tx * 5)} ${f1(y - ty * 5)}L${f1(x - nx * h + tx * 3)} ${f1(y - ny * h + ty * 3)}L${f1(x + tx * 6)} ${f1(y + ty * 6)}Z`;
      const [mx, my] = onBody(i, t, -0.15);
      scales += `M${f1(mx - tx * 4)} ${f1(my - ty * 4)}q${f1(tx * 4 + nx * 4)} ${f1(ty * 4 + ny * 4)} ${f1(tx * 8)} ${f1(ty * 8)}`;
      const [bx, by] = onBody(i, t, 0.75);
      belly += `M${f1(bx - nx * 4)} ${f1(by - ny * 4)}l${f1(nx * 6)} ${f1(ny * 6)}`;
    }
  }
  return { fins, scales, belly };
}
const dBody = limb(SPINE.map(([x, y, w]) => [x, y, w]));
const dBellyBand = limb(SPINE.slice(0, -1).map((p, i) => {
  const [x, y] = onBody(Math.min(i, SPINE.length - 2), i === SPINE.length - 2 ? 1 : 0, 0.62);
  return [x, y, p[2] * 0.32];
}));
const dHead = 'M126 84C118 72 96 72 86 80C74 80 62 86 58 96C56 106 64 112 76 112C90 114 108 114 120 108C128 102 132 92 126 84Z';
const dJaw = 'M60 102C70 108 84 108 96 104';
const dEye = 'M92 88C92 80 104 80 104 88C104 96 92 96 92 88Z';
const dBrow = 'M88 80C94 74 104 74 108 80';
const dNose = 'M62 92q3 -3 6 0';
const dWhiskers = 'M64 104C54 112 46 110 40 120C36 128 42 132 46 126M66 90C56 82 48 84 42 76C38 70 40 66 46 68';
const dAntlers = `${limb([[110, 78, 5], [114, 64, 4], [118, 52, 3]])}Z${limb([[115, 63, 3], [124, 58, 2.5]])}Z${limb([[120, 80, 5], [128, 66, 4], [134, 54, 3]])}Z${limb([[129, 64, 3], [138, 62, 2.5]])}Z`;
const dMane = 'M124 80C130 70 140 76 146 68C150 76 146 82 156 80C156 88 150 90 158 96C150 100 144 96 140 104C134 100 132 108 126 106C128 98 122 92 124 80Z';
const dLegs = [
  limb([[162, 80, 9], [160, 96, 7], [152, 108, 6]]),
  limb([[204, 76, 9], [208, 92, 7], [202, 104, 6]]),
  limb([[274, 128, 8], [274, 142, 6], [268, 152, 5]]),
  limb([[304, 122, 8], [310, 136, 6], [306, 146, 5]]),
];
const dClaws = 'M148 108l-5 4M152 110l-2 6M156 109l2 5M198 104l-5 4M202 106l-2 6M206 105l2 5M264 152l-5 3M268 154l-2 5M272 153l2 4M302 146l-5 3M306 148l-2 5M310 147l2 4';

export function dragon() {
  const { fins, scales, belly } = dragonBits();
  const legs = dLegs.map((d) => `${d}Z`).join('');
  // the head and everything on it, drawn a little bigger around the neck
  const H = (d) => transformPath(d, 'translate(124 96) scale(1.3) translate(-124 -96)');
  return {
    lines: [...dLegs, dBody, H(dMane), H(dAntlers), H(dHead)],
    fine: [fins, scales, belly, ...[dJaw, dEye, dBrow, dNose, dWhiskers, 'M96 106q8 3 16 -1'].map(H), dClaws],
    washes: [
      { c: PAL.red, o: 0.75, d: fins },
      { c: PAL.ochre, o: 0.75, d: H(dMane) },
      { c: PAL.green, o: 0.8, d: `${dBody}Z${H(dHead)}${legs}` },
      { c: PAL.ochre, o: 0.7, d: `${dBellyBand}Z${H(dAntlers)}` },
      { c: PAL.rose, o: 0.4, d: H(dot(84, 100, 5)) },
    ],
    whites: [H(dEye)],
    fills: [H(dot(99, 89, 3))],
    glints: [H(dot(98, 88, 0.9))],
  };
}

// A little village house with a curved, upturned roof (door at the front), ground at y = 0, about
// 70 wide.
export function house() {
  const walls = 'M-24 0L-24 -26L24 -26L24 0Z';
  const roof = 'M-38 -22C-30 -26 -22 -40 0 -44C22 -40 30 -26 38 -22C30 -28 -30 -28 -38 -22Z';
  const ridge = 'M-14 -44L14 -44';
  const door = 'M-6 0L-6 -16L6 -16L6 0';
  const win = 'M12 -18L20 -18L20 -10L12 -10ZM16 -18L16 -10';
  return {
    lines: [walls, roof],
    fine: [ridge, door, win],
    washes: [
      { c: PAL.ochre, o: 0.35, d: walls },
      { c: PAL.slate, o: 0.6, d: roof },
      { c: PAL.red, o: 0.7, d: `${door}Z` },
    ],
  };
}
