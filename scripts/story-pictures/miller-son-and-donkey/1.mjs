import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { compose, donkey, dot, miller, place, son } from './characters.mjs';

// The Miller, His Son and the Donkey, 1 (cover): the miller and his son walk along the country road to
// market, one each side of their little grey donkey, all three happy, clip-clop.
const SONT = 'translate(66 268) scale(1.25)';
const DONKT = 'translate(184 266) scale(1.12)';
const MILLT = 'translate(332 270) scale(1.22)';
const road = 'M0 250C90 246 200 248 300 244C340 242 370 242 400 242L400 284C360 282 320 282 260 285C170 290 80 289 0 292Z';
const roadEdges = 'M0 250C90 246 200 248 300 244C340 242 370 242 400 242M0 292C80 289 170 290 260 285C320 282 360 282 400 284';
const hills = 'M0 206C40 194 90 190 140 198C180 204 220 194 262 188C310 182 360 190 400 198';
// the lead rope from the donkey's halter to the miller's back hand
const rope = 'M270 180C274 190 278 192 284 190';
// the mill at home, small on the far hill: a slate tower and its four sails
const mill = 'M118 197L121 170L133 170L136 197M117 170L127 162L137 170';
const sails = 'M127 166L111 150M127 166L143 150M127 166L111 182M127 166L143 182';
// clip-clop: little hoof-beat marks behind the donkey
const clip = 'M106 256c-3 -2 -6 -1 -8 2M100 264c-3 -2 -6 -1 -8 2M128 258c-3 -2 -6 -1 -8 2';

export default compose({
  title: 'The Miller, His Son and the Donkey',
  seed: 1121,
  washes: [
    { c: PAL.green, o: 0.32, d: `${hills}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.45, d: road },
    { c: PAL.ochre, o: 0.7, d: dot(196, 52, 15) },
    { c: PAL.slate, o: 0.45, d: 'M118 197L121 170L133 170L136 197Z' },
    { c: PAL.terracotta, o: 0.6, d: 'M117 170L127 162L137 170Z' },
  ],
  lines: [roadEdges],
  fine: [
    'M0 206C30 197 60 192 90 191M220 191C240 189 252 188 262 188C276 186 286 185 296 184',
    dot(196, 52, 15),
    rays(196, 52, 20, 29, 9, 4),
    mill,
    sails,
    rope,
    clip,
    hatch(30, 296, 380, 296, 9, 5, 160, 3),
    tufts([[16, 246], [120, 202], [384, 240], [250, 194], [140, 296], [360, 296]], 9, 5),
  ],
  parts: [place(son(), SONT), place(donkey(), DONKT), place(miller(), MILLT)],
});
