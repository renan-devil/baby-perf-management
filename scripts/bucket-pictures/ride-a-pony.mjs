// Ride a pony: a chubby chestnut pony with a shaggy mane and forelock, saddled and bridled, stands on
// a little patch of grass, seen from the side and facing right, with a kind eye.
import { PAL, paths, transformPath, tufts } from '../story-pictures/lib.mjs';

const f = (n) => Math.round(n * 10) / 10;
const dot = (x, y, r, ry = r) => `M${f(x - r)} ${f(y)}a${r} ${ry} 0 1 0 ${f(2 * r)} 0a${r} ${ry} 0 1 0 ${f(-2 * r)} 0Z`;

/** A smooth leg along a centreline of [x, y, width] points, open at the top. */
function limb(pts) {
  const n = pts.length;
  const side = (s) =>
    pts.map(([x, y, w], i) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(n - 1, i + 1)];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return [x - (s * (b[1] - a[1]) * w) / 2 / l, y + (s * (b[0] - a[0]) * w) / 2 / l];
    });
  const curve = (P) =>
    P.slice(1)
      .map((p2, j) => {
        const p0 = P[Math.max(0, j - 1)];
        const p1 = P[j];
        const p3 = P[Math.min(P.length - 1, j + 2)];
        return `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
      })
      .join('');
  const L = side(1);
  const R = side(-1).reverse();
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)}L${f(R[0][0])} ${f(R[0][1])}${curve(R)}`;
}

// Everything is drawn around the pony, then enlarged to fill the frame.
const T = 'translate(-32 -14) scale(1.1)';
const P = (d) => transformPath(d, T);

// Ground: a little grass patch
const ground = 'M66 253C130 249 250 250 346 254';
const patch = 'M50 256C64 238 150 234 210 238C280 234 350 240 360 256C364 270 300 276 210 274C120 276 46 272 50 256Z';

// The pony, facing right, hooves on y = 252
const body = 'M238 128C212 136 168 136 140 124C118 116 100 130 102 152C104 172 114 188 132 198C160 212 222 212 248 196C264 186 272 168 266 148';
const head =
  'M316 88C326 100 334 108 338 120C342 132 334 142 322 142C312 142 302 140 294 136C284 132 278 126 276 120C272 132 268 142 264 154';
const crest = 'M226 134C232 106 250 82 280 72C296 68 308 76 316 88';
const ears = 'M282 74C278 60 280 50 286 42C294 50 296 62 294 72M272 78C266 66 266 56 270 48C276 54 280 62 280 72';
const earIn = 'M285 66C284 58 285 52 287 48C290 54 291 60 290 66Z';
const forelock = 'M282 70C296 62 310 70 316 82Q322 90 321 100Q317 94 313 93Q315 101 311 106Q308 98 304 94Q300 92 297 94Q298 86 292 82Q288 76 282 76Z';
const mane =
  'M222 136C220 124 224 112 230 104C234 94 240 88 246 84C252 76 260 70 268 68C274 62 282 62 288 66Q285 76 286 88Q280 82 274 84Q276 94 270 104Q266 96 261 93Q263 104 257 114Q253 106 249 102Q249 114 245 124Q241 117 238 112Q239 124 236 134Q232 127 229 124Q230 131 226 137Z';
const maneLocks = 'M282 70Q278 76 280 84M266 76Q266 86 266 96M252 88Q252 98 252 106M240 100Q240 110 241 118M230 112Q232 122 232 130';
const tail = 'M110 132C94 132 84 148 84 170C84 192 90 208 82 230L92 224L94 236L101 224L108 232L108 216C102 196 102 170 110 150Z';
const tailStrands = 'M96 150C92 172 94 196 90 220M102 158C98 180 100 200 98 222';
const legs = [
  limb([[252, 188, 22], [254, 216, 16], [254, 246, 15]]),
  limb([[230, 194, 17], [228, 218, 14], [228, 246, 14]]),
  limb([[124, 180, 28], [122, 206, 19], [128, 226, 15], [128, 246, 15]]),
  limb([[156, 196, 20], [154, 218, 15], [156, 246, 14]]),
];
const hooves = 'M245 244L263 244L265 253L243 253ZM220 244L236 244L237 253L219 253ZM119 244L137 244L139 253L117 253ZM148 244L164 244L165 253L147 253Z';
const feathers = 'M244 244l-3 4M248 244l-2 5M262 244l3 4M120 244l-3 4M136 244l3 4M221 244l-3 4M164 244l3 4';

// Saddle cloth, saddle, girth, stirrup, bridle and reins
const saddle = 'M162 124C160 114 166 108 172 112C182 122 204 124 220 116C226 110 234 110 234 120C234 132 230 148 226 166C212 172 194 172 178 168C172 156 170 142 166 128Z';
const clothWash = 'M156 126C150 148 154 168 164 182C190 188 224 188 242 178C246 160 244 140 240 124L234 122C234 110 226 110 220 116C204 124 182 122 172 112C166 108 160 114 162 124Z';
const cloth = 'M158 124C150 148 154 168 164 182C190 188 224 188 242 178C246 160 244 140 240 122';
// The coat wash leaves a hole where the saddle cloth sits, so the blue stays blue.
const coatHole = 'M238 128C212 136 168 136 140 124L157 129.5C150 148 154 168 164 182C190 188 224 188 242 178C246 160 244 140 245 133Z';
const saddleSeams = 'M168 126C190 132 212 130 230 124M222 126C226 140 226 152 222 162M160 178l78 -6';
const girth = 'M184 170L182 206M196 171L195 208';
const stirrup = 'M208 126L208 182M201 183L216 183L214 194C210 198 204 198 202 194Z';
const bridle = 'M286 74C288 98 298 118 318 132M298 120L330 104M296 114L326 99';
const bridleWash = 'M285 74C287 98 297 118 317 132L322 129C302 116 292 96 290 74ZM298 120L330 104L327 98L296 113Z';
const reins = 'M318 134C300 160 262 156 236 122';
const bit = dot(319, 133, 3.2);

// The pony's face: a kind eye and a little smile
const cheek = 'M288 106C296 116 300 126 294 134';
const nostril = 'M330 121q4 -1 5 3';
const mouth = 'M320 136q6 3 12 -2';
const eye = dot(303, 98, 5.4, 5);
const lid = 'M296 96q7 -9 15 -1';
const lashes = 'M297 93l-4 -2M300 90l-2 -4';

export default {
  title: 'Ride a pony',
  seed: 211,
  washes: [
    { c: PAL.green, o: 0.5, d: P(patch) },
    { c: PAL.slate, o: 0.25, d: P('M98 252C120 244 240 244 276 252C260 258 120 258 98 252Z') },
    { c: PAL.ochre, o: 0.82, d: P(`${body}Z${coatHole}`), rule: 'evenodd' },
    { c: PAL.ochre, o: 0.82, d: P(`M242 131C246 108 258 86 280 72C296 68 308 76 316 88${head.slice(7)}L266 148Z${ears}Z${legs.map((l) => `${l}Z`).join('')}`) },
    { c: PAL.terracotta, o: 0.45, d: P(`${legs[1]}Z${legs[3]}ZM132 198C160 212 222 212 248 196C230 204 170 206 140 192ZM104 150C108 172 118 186 132 196C122 180 116 166 112 146Z`) },
    { c: PAL.terracotta, o: 0.85, d: P(`${mane}${forelock}${tail}`) },
    { c: PAL.ink, o: 0.32, d: P(`${mane}${forelock}${tail}`) },
    { c: PAL.ink, o: 0.7, d: P(hooves) },
    { c: PAL.sky, o: 0.7, d: P(`${clothWash}${saddle}`), rule: 'evenodd' },
    { c: PAL.red, o: 0.82, d: P(saddle) },
    { c: PAL.red, o: 0.7, d: P(bridleWash) },
    { c: PAL.rose, o: 0.6, d: P(earIn) },
  ],
  whites: P(eye),
  lines: paths([ground, tail, ...legs, body, crest, head, ears, cloth, saddle, reins], T),
  fine: paths(
    [
      forelock,
      mane,
      maneLocks,
      tailStrands,
      earIn,
      hooves,
      feathers,
      saddleSeams,
      girth,
      stirrup,
      bridle,
      bit,
      cheek,
      nostril,
      mouth,
      lid,
      lashes,
      eye,
      'M120 140q8 6 12 18M262 160q-6 10 -6 22',
      tufts([[74, 254], [106, 256], [186, 257], [290, 256], [336, 254], [60, 264], [326, 266]], 9, 7),
      'M84 268l6 -3M296 270l8 -2M200 268l7 -1',
    ],
    T,
  ),
  fills: `<path d="${P(`${dot(304.4, 99, 3.9, 3.7)}${dot(332, 124, 1.4)}`)}"/>`,
  glints: `<path d="${P(`${dot(303.2, 97, 1.2)}${dot(306, 101.2, 0.6)}`)}"/>`,
};
