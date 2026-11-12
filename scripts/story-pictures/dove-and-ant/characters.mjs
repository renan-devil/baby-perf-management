import { PAL, transformPath } from '../lib.mjs';
import { dot, limb, oval } from '../stone-soup/characters.mjs';

// The Dove and the Ant: the white dove, the little black ant, the leaf and the hunter, shared by the
// two pictures. Each is drawn once here and placed in each picture with a transform (place). The
// build only draws files named <n>.mjs, so this file is not a picture.

export { compose, place, merge, at } from '../stone-soup/characters.mjs';

// ---------------------------------------------------------------------------------------------
// The dove (centre of the body near 0,0), facing left: a round white head with a small ochre beak,
// a plump white body and a fanned tail to the right. wings: 'folded' (perched, little rosy feet at
// y = 18) or 'up' (flying, one big wing raised over her back, the far wing in grey behind). She is
// white: plain paper inside the ink.
const dBody =
  'M-36 -21C-34 -31 -20 -33 -14 -25C-10 -18 -3 -12 8 -11C24 -10 36 -13 52 -20L57 -11L49 -6C36 4 14 12 -4 10C-18 8 -26 1 -28 -7C-30 -11 -33 -12 -36 -13Z';
const dBeak = 'M-36 -21L-46 -16L-36 -13Z';
const dTail = 'M38 -10L54 -15M36 -5L52 -9';
const dFolded = 'M-14 -12C0 -17 22 -13 38 -7C28 4 6 6 -6 2C-12 -2 -15 -7 -14 -12Z';
const dFoldedMarks = 'M4 -4C12 -2 20 -2 28 -5M10 2C16 2 22 1 27 -1';
const dWingUp = 'M-8 -11C-15 -36 -6 -60 10 -78C12 -71 16 -69 21 -71C20 -64 24 -60 31 -62C30 -55 34 -51 41 -52C38 -45 42 -41 49 -42C44 -35 44 -28 40 -23C36 -17 32 -13 28 -12C16 -11 2 -11 -8 -11Z';
const dWingUpMarks = 'M16 -66C14 -52 14 -36 12 -20M27 -58C24 -46 22 -32 20 -18M37 -48C34 -38 30 -28 27 -18M2 -48C2 -36 2 -26 2 -16';
const dFarWing = 'M-2 -14C-6 -30 -14 -44 -26 -54C-22 -40 -18 -28 -10 -16Z';
const dFeet = 'M0 9L-1 18M-1 18l-4 2M-1 18l3 2M12 9L12 18M12 18l-4 2M12 18l3 2';

export function dove({ wings = 'folded' } = {}) {
  const up = wings === 'up';
  const lines = [dBody, dBeak, up ? dWingUp : dFolded];
  const fine = [dTail, up ? dWingUpMarks : dFoldedMarks];
  const washes = [{ c: PAL.ochre, o: 0.85, d: dBeak }];
  if (up) {
    lines.unshift(dFarWing);
    washes.push({ c: PAL.grey, o: 0.3, d: dFarWing });
  } else {
    fine.push(dFeet);
  }
  return {
    lines,
    fine,
    washes,
    whites: [`${dBody}${up ? dWingUp : ''}`],
    fills: [dot(-28, -22, 2.2)],
    glints: [dot(-28.7, -22.8, 0.7)],
  };
}

// ---------------------------------------------------------------------------------------------
// The little black ant (feet at y = 0), facing right and drawn far bigger than life (about 46 long):
// a round abdomen, a small thorax and a round head with a big friendly eye and two curly antennae.
// legs: 'walk' (six legs on the ground) or 'kick' (in the water: legs waving, front legs raised).
const aAbd = oval(-14, -12, 12, 9);
const aTho = oval(3, -11, 6, 5);
const aHead = oval(17, -15, 8, 7.5);
const aAnt = 'M20 -22C22 -30 28 -34 33 -31M14 -22C14 -30 18 -36 23 -37';
const aLegs = {
  walk: 'M-2 -8L-8 -3L-12 0M3 -7L2 -2L1 0M7 -8L11 -3L15 0',
  kick: 'M-2 -8L-10 -6L-14 -12M3 -7L0 0L-4 3M7 -8L14 -6L18 0M5 -14L12 -22L18 -28M0 -14L-2 -22L4 -28',
};
const aLegsFar = { walk: 'M-4 -9L-11 -5L-15 -1M2 -9L5 -4L7 -1M6 -10L12 -6L18 -3', kick: '' };

export function ant({ legs = 'walk' } = {}) {
  const body = `${aAbd}${aTho}${aHead}`;
  return {
    lines: [aAbd, aTho, aHead, aLegs[legs]],
    fine: [aAnt, aLegsFar[legs]].filter(Boolean),
    washes: [{ c: PAL.ink, o: 0.85, d: body }],
    whites: [dot(20, -16, 3.2)],
    fills: [dot(21, -16, 1.6), dot(33, -31, 1.6), dot(23, -37, 1.6)],
    glints: [dot(-18, -16, 1.6), dot(20.4, -16.8, 0.6)],
  };
}

// ---------------------------------------------------------------------------------------------
// A green leaf, about 56 long, lying flat (centre at 0,0, pointing right), with a midrib and veins.
const lOut = 'M-28 0C-18 -12 10 -14 28 -2C12 10 -14 12 -28 0Z';
const lVeins = 'M-32 2L24 -2M-8 0l8 -7M6 -1l7 -6M-8 1l8 6M6 0l6 5';
export function leaf() {
  return { lines: [lOut], fine: [lVeins], washes: [{ c: PAL.green, o: 0.85, d: lOut }] };
}

// ---------------------------------------------------------------------------------------------
// The hunter (feet at y = 0), about 175 tall, facing right: a kindly round face with a rosy nose and a
// grey moustache, a green hat with a little feather, an ochre jacket, slate trousers and terracotta
// boots. He stands on his left leg, the other knee lifted, and holds a rope net up behind him.
// mood: 'creep' (eyes open, tiptoe smile) or 'ouch' (eyes squeezed shut, mouth wide open).
const hFace = 'M-15 -146C-17 -132 -10 -118 0 -118C11 -118 18 -132 16 -146';
const hFaceFill = `${hFace}C10 -150 -10 -150 -15 -146Z`;
const hBrim = 'M-24 -146C-16 -151 16 -152 26 -146C28 -142 22 -141 16 -143C6 -145 -8 -145 -18 -142C-24 -141 -28 -143 -24 -146Z';
const hCrown = 'M-15 -148C-16 -162 -8 -170 2 -170C12 -170 18 -162 16 -148';
const hFeather = 'M-12 -158C-20 -164 -26 -172 -28 -180C-20 -176 -14 -168 -10 -160Z';
const hNose = oval(7, -134, 4.5, 4);
const hMoustache = 'M-4 -128C0 -131 4 -130 7 -128C10 -130 14 -131 18 -128C14 -124 10 -125 7 -127C4 -125 0 -124 -4 -128Z';
const hCoat = 'M-15 -116C-22 -110 -26 -90 -27 -62L25 -62C24 -90 22 -110 15 -116C8 -119 -8 -119 -15 -116Z';
const hBelt = 'M-26 -74L24 -74';
const hLegStand = limb([[-10, -63, 13], [-11, -40, 12], [-11, -10, 11]]);
const hLegLift = limb([[11, -63, 13], [26, -48, 12], [24, -28, 11]]);
const hBootStand = 'M-17 -11C-18 -4 -18 0 -14 1L4 1C6 -3 2 -6 -4 -7L-5 -11Z';
const hBootLift = 'M18 -30C14 -24 14 -20 18 -19L34 -16C37 -19 34 -23 29 -25L30 -30Z';
const hArmBack = limb([[-14, -110, 10], [-22, -100, 9], [-24, -111, 9]]);
const hArmFront = limb([[13, -110, 10], [12, -92, 9], [-2, -100, 9]]);
const HANDS = [[-24, -111], [-2, -100]];
// The net: a short pole from his hands up behind his back, a long hoop and a baggy rope net.
const hPole = 'M10 -97L-52 -129L-50 -124L10 -92Z';
const hPoleLine = 'M10 -97L-52 -129M10 -92L-50 -124';
const hHoop = transformPath(oval(0, 0, 13, 29), 'translate(-75 -139) rotate(-61)');
const hBag = 'M-100 -150C-112 -126 -104 -100 -88 -96C-76 -94 -66 -108 -56 -124';
const hMesh = 'M-88 -150L-102 -118M-76 -142L-94 -100M-64 -134L-80 -98M-98 -134L-74 -122L-58 -122M-102 -116L-82 -110L-66 -112';

export function hunter({ mood = 'ouch' } = {}) {
  const fine = [hMoustache, hBelt, hMesh, 'M-4 -116L0 -108L4 -116'];
  const fills = [];
  const glints = [];
  const washes = [
    { c: PAL.ochre, o: 0.75, d: hCoat },
    { c: PAL.slate, o: 0.7, d: `${hLegStand}Z${hLegLift}Z` },
    { c: PAL.terracotta, o: 0.85, d: `${hBootStand}${hBootLift}` },
    { c: PAL.rose, o: 0.35, d: hFaceFill },
    { c: PAL.rose, o: 0.75, d: hNose },
    { c: PAL.green, o: 0.8, d: `${hBrim}${hCrown}Z` },
    { c: PAL.red, o: 0.7, d: hFeather },
    { c: PAL.grey, o: 0.7, d: hMoustache },
    { c: PAL.ochre, o: 0.65, d: `${hArmBack}Z${hArmFront}Z` },
    { c: PAL.rose, o: 0.6, d: HANDS.map(([x, y]) => dot(x, y, 4.5)).join('') },
    { c: PAL.terracotta, o: 0.5, d: `${hPole}` },
    { c: PAL.ochre, o: 0.3, d: `${hBag}L-100 -150Z` },
  ];
  if (mood === 'ouch') {
    fine.push('M-9 -141l5 2l-5 2M12 -141l-5 2l5 2');
    const mouth = oval(6, -122, 4, 3.2);
    fine.push(mouth);
    washes.push({ c: PAL.red, o: 0.8, d: mouth });
  } else {
    fills.push(dot(-5, -139, 1.8), dot(10, -139, 1.8));
    glints.push(dot(-5.5, -139.6, 0.55), dot(9.5, -139.6, 0.55));
  }
  return {
    lines: [hBag, hHoop, hPoleLine, hArmBack, hLegStand, hLegLift, hBootStand, hBootLift, hCoat, hFace, hBrim, hCrown, hArmFront],
    fine: [...fine, hFeather, hNose, ...HANDS.map(([x, y]) => dot(x, y, 4.5))],
    washes,
    fills,
    glints,
  };
}
