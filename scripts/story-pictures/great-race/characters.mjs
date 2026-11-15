import { PAL } from '../lib.mjs';
import { dot, limb, merge, oval, place } from '../stone-soup/characters.mjs';

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
export function water(top, { seed = 1 } = {}) {
  const r = (i) => ((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1 + 1) % 1;
  const waves = [];
  for (let row = 0; row < 4; row++) {
    const y = top + 18 + row * 22;
    for (let k = 0; k < 4; k++) {
      const x = 20 + k * 100 + (row % 2) * 50 + r(row * 7 + k) * 20;
      waves.push(`M${x} ${y}q8 -6 16 0q8 6 16 0`);
    }
  }
  return {
    washes: [{ c: PAL.sky, o: 0.55, d: `M0 ${top}C100 ${top - 4} 300 ${top + 4} 400 ${top}L400 300L0 300Z` }],
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
