import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { compose, dot, duckling, limb, place } from './characters.mjs';

// The Ugly Duckling, 4: alone in the wide marsh, the duckling hides in the reeds. A big, friendly
// brown dog pokes his nose in, sniffs him, and trots off with his tail wagging.

// The dog (feet at 0,0, facing right), drawn here once; placed facing left.
const body = 'M-50 -60C-48 -78 -20 -84 10 -82C34 -80 46 -72 48 -58C50 -46 40 -38 20 -38L-30 -38C-46 -38 -52 -48 -50 -60Z';
const legs = [
  limb([[-40, -44, 18], [-44, -22, 12], [-40, -4, 11]]),
  limb([[-28, -42, 14], [-26, -22, 11], [-24, -4, 10]]),
  limb([[26, -44, 15], [30, -22, 11], [32, -4, 10]]),
  limb([[38, -46, 14], [46, -28, 11], [56, -18, 10]]),
];
const paws = 'M-48 0C-48 -4 -34 -4 -32 0ZM-32 0C-32 -4 -18 -4 -16 0ZM24 0C24 -4 38 -4 40 0ZM52 -22C56 -26 64 -20 62 -14Z';
const head = 'M42 -76C44 -96 58 -108 74 -106C88 -104 96 -96 98 -88C100 -80 94 -74 84 -74C76 -74 70 -70 64 -64C58 -58 48 -60 42 -66';
const ear = 'M60 -104C50 -102 46 -88 48 -76C56 -78 62 -88 65 -100Z';
const tongue = 'M84 -76C85 -68 90 -64 93 -70C93 -73 91 -76 88 -77Z';
const face = 'M80 -78q6 4 13 -2M90 -100q6 0 8 4';
const tail = limb([[-48, -64, 9], [-62, -76, 7], [-66, -94, 6], [-60, -106, 5]]);
const wags = 'M-74 -100l-8 -3M-72 -112l-8 -5M-66 -122l-4 -7';
const sniffs = 'M106 -86l7 -1M105 -80l7 3M104 -93l6 -5';
const spots = 'M-20 -76C-14 -82 -2 -80 0 -72C-6 -66 -16 -68 -20 -76Z';
const DT = 'translate(292 254) scale(-1.38 1.38)';

// the reeds the duckling hides in
const stems = 'M44 268C42 220 46 170 54 120M70 268C70 228 74 190 84 150M96 270C98 230 96 196 92 160M126 270C126 236 132 204 142 176M150 270C152 240 158 216 168 196M24 266C20 236 14 210 6 192M112 270C116 226 118 190 116 140';
const leaves = 'M56 230C66 210 80 200 92 196M118 240C108 222 98 214 84 210M138 232C146 220 156 214 168 212M32 244C24 228 16 222 6 220';
const heads = 'M53 124C49 110 53 98 58 96C62 100 60 114 54 124ZM83 154C80 142 83 132 88 131C91 135 89 146 83 154ZM115 144C111 130 114 118 119 117C123 121 122 134 116 144ZM141 180C138 168 141 158 146 157C149 161 147 172 141 180Z';

export default compose({
  title: 'Hiding in the reeds',
  seed: 74,
  washes: [
    { c: PAL.sky, o: 0.45, d: 'M0 236C40 232 120 236 190 240C200 252 196 268 186 282C120 288 50 286 0 284Z' },
    { c: PAL.green, o: 0.4, d: 'M180 252C240 248 320 252 400 248L400 290C320 294 240 292 176 290Z' },
    { c: PAL.terracotta, o: 0.6, d: transformPath(`${body}${legs.join('Z')}Z${head}Z${tail}Z`, DT) },
    { c: PAL.ochre, o: 0.45, d: transformPath(`${body}${head}Z`, DT) },
    { c: PAL.terracotta, o: 0.55, d: transformPath(ear + spots, DT) },
    { c: PAL.rose, o: 0.85, d: transformPath(tongue, DT) },
  ],
  after: [{ c: PAL.green, o: 0.65, d: `${stems}${leaves}${heads}` }],
  whites: transformPath(dot(76, -93, 3.4), DT),
  lines: [
    'M176 252C240 248 320 252 400 248',
    ...[body, ...legs, head, ear, tail].map((d) => transformPath(d, DT)),
    stems,
    leaves,
  ],
  fine: [
    heads,
    ...[paws, tongue, face, wags, sniffs, dot(76, -93, 3.4)].map((d) => transformPath(d, DT)),
    'M10 256C30 260 60 260 80 256M120 262C140 266 160 266 176 262',
    hatch(200, 268, 390, 270, 8, 8, 172, 4),
    tufts([[196, 252], [270, 251], [384, 249]], 10, 7),
  ],
  fills: `<path d="${transformPath(dot(98, -89, 4), DT)}"/><path d="${transformPath(dot(77, -93, 2), DT)}"/>`,
  parts: [place(duckling({ head: 8 }), 'translate(84 250) scale(1.3)')],
});
