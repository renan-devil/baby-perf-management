import { PAL, hatch, transformPath } from '../lib.mjs';
import { dot, limb, merge } from '../stone-soup/characters.mjs';

// The Two Goats: the White Goat and the Brown Goat, shared by the two pictures. The goat is drawn
// once here and placed in each picture with a transform (place); flip with scale(-1 1). The build
// only draws files named <n>.mjs, so this file is not a picture.

export { compose, place, merge, at } from '../stone-soup/characters.mjs';

const close = (list) => list.map((d) => `${d}Z`).join('');

// ---------------------------------------------------------------------------------------------
// A goat seen from the side, facing right, feet at y = 0, about 125 long and 130 tall to the horn
// tips: a stocky body, a long head with two curved horns swept back, a sideways ear, a pointed
// beard, a short perky tail and thin legs with knobbly knees and dark split hooves.
// coat: 'white' (paper inside the ink, a little grey shading) or 'brown' (terracotta and ochre).
// pose: 'walk' (one front leg lifted: clip, clop) or 'tumble' (legs bent and kicking; turn the goat
// upside down for legs in the air).
// mood: 'cross' (eye open, a firm little mouth) or 'splash' (eye squeezed shut, mouth wide open).
const gTorso =
  'M-46 -60C-54 -72 -46 -88 -28 -88C-8 -90 12 -88 28 -90C42 -91 50 -80 48 -68C46 -56 36 -50 22 -50C4 -48 -16 -48 -32 -50C-40 -52 -44 -55 -46 -60Z';
const gNeckHead =
  'M26 -89C31 -100 36 -110 42 -116C48 -122 58 -120 62 -113C66 -106 72 -100 75 -93C77 -87 70 -83 64 -86C58 -89 54 -91 52 -92C49 -84 47 -76 45 -66';
const gMuzzle = 'M66 -101C72 -98 76 -94 75 -90C74 -86 69 -85 65 -87';
const gBeard = 'M58 -89C57 -82 58 -74 61 -68C63 -74 65 -81 66 -86';
const gEar = 'M42 -108C34 -109 26 -106 21 -101C29 -98 37 -100 43 -103Z';
const gHornNear = 'M45 -116C42 -128 34 -136 22 -138C18 -138 16 -136 19 -134C28 -132 34 -124 37 -113Z';
const gHornFar = 'M52 -118C52 -131 46 -140 35 -144C31 -145 29 -143 32 -141C40 -137 44 -128 44 -117Z';
const gHornRidges = 'M40 -122l-5 3M35 -128l-5 2M30 -133l-3 3M49 -125l-5 2M46 -132l-5 1M41 -138l-3 3';
const gTail = 'M-42 -82C-48 -88 -50 -96 -47 -102C-42 -98 -38 -92 -36 -86';
const gShade = 'M-46 -60C-40 -52 -10 -48 22 -50C38 -50 46 -58 48 -68C38 -60 10 -58 -20 -58C-34 -58 -42 -59 -46 -60Z';
const gBack = 'M-26 -84q12 -3 26 -1';
const gMouth = 'M61 -91C63 -84 70 -82 75 -88C71 -87 66 -88 61 -91Z';

// Leg centrelines ([x, y, width]); hooves at the end of each.
const LEGS = {
  walk: [
    [[-38, -56, 11], [-40, -30, 6.5], [-38, -5, 5.5]],
    [[-26, -54, 10], [-25, -30, 6.5], [-24, -5, 5.5]],
    [[28, -56, 10], [30, -30, 6.5], [30, -5, 5.5]],
    [[40, -58, 11], [48, -36, 6.5], [42, -20, 5.5]],
  ],
  tumble: [
    [[-38, -56, 11], [-54, -34, 6.5], [-50, -10, 5.5]],
    [[-26, -54, 10], [-18, -32, 6.5], [-28, -10, 5.5]],
    [[26, -56, 10], [16, -34, 6.5], [22, -10, 5.5]],
    [[38, -58, 11], [44, -36, 6.5], [36, -14, 5.5]],
  ],
};

/** A dark split hoof at the end of a leg, pointing along the leg's last segment. */
function hoof(pts) {
  const [x0, y0] = pts[pts.length - 2];
  const [x, y] = pts[pts.length - 1];
  const a = (Math.atan2(y - y0, x - x0) * 180) / Math.PI - 90;
  const t = `translate(${x} ${y}) rotate(${Math.round(a * 10) / 10})`;
  return { shape: transformPath('M-4 -3L4 -3L5 5L-5 5Z', t), split: transformPath('M0 1L0 5', t) };
}

export function goat({ coat = 'white', pose = 'walk', mood = 'cross' } = {}) {
  const legs = LEGS[pose].map(limb);
  const hooves = LEGS[pose].map(hoof);
  const hoofShapes = hooves.map((h) => h.shape).join('');
  const brown = coat === 'brown';
  const body = `${gTorso}${close(legs)}${gTail}Z`;
  const torso = {
    lines: [gTail, ...legs, gTorso],
    fine: [gBack, ...hooves.map((h) => h.split), hoofShapes, ...(brown ? [] : [hatch(-36, -54, 36, -54, 8, 6, 100, 5)])],
    washes: [
      ...(brown
        ? [
            { c: PAL.terracotta, o: 0.85, d: body },
            { c: PAL.ink, o: 0.35, d: `${gShade}${legs[0]}Z${legs[1]}Z` },
          ]
        : []),
      { c: PAL.ink, o: 0.85, d: hoofShapes },
    ],
    whites: brown ? [] : [body],
  };
  const face =
    mood === 'splash'
      ? {
          fine: ['M48 -109l5 2l-5 2', gMouth],
          washes: [{ c: PAL.red, o: 0.7, d: gMouth }],
        }
      : {
          whites: [dot(52, -107, 3.6)],
          fine: [dot(52, -107, 3.6), 'M47 -112q5 -4 11 -1', 'M67 -88q4 1 8 -2'],
          fills: [dot(53, -107, 2.1)],
          glints: [dot(52.2, -108.2, 0.7)],
        };
  const head = merge(
    {
      lines: [gHornFar, gNeckHead, gEar, gHornNear, gBeard],
      fine: [gMuzzle, gHornRidges],
      washes: [
        ...(brown
          ? [
              { c: PAL.terracotta, o: 0.85, d: `${gNeckHead}Z${gEar}` },
              { c: PAL.ochre, o: 0.45, d: `${gMuzzle}Z${gBeard}Z` },
              { c: PAL.ink, o: 0.35, d: `${gBeard}Z` },
            ]
          : [{ c: PAL.grey, o: 0.5, d: gBeard }]),
        { c: PAL.grey, o: 0.85, d: `${gHornNear}${gHornFar}` },
        { c: PAL.rose, o: 0.6, d: transformPath(gEar, 'translate(31 -104) scale(0.6) translate(-31 104)') },
      ],
      whites: brown ? [] : [`${gNeckHead}Z`],
      fills: [dot(72, -95, 1.3)],
    },
    face,
  );
  return merge(torso, head);
}
