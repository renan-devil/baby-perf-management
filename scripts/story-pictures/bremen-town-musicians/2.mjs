import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, donkey, place } from './characters.mjs';

// The Bremen Town Musicians, 2: the old Donkey sets off down the long road, with the little roofs
// and towers of Bremen far away on the hill.
const hills = 'M0 150C70 136 150 140 220 132C290 124 350 128 400 138';
// the road winds away from the front towards the town
const road = 'M150 300C190 262 300 236 290 200C282 176 270 158 286 140M260 300C300 262 344 234 316 200C302 182 296 160 298 140';
const town = [
  'M262 140L262 118L274 118L274 140',
  'M260 118L268 104L276 118',
  'M276 140L276 106L284 106L284 140M274 106L280 88L286 106',
  'M286 140L286 122L300 122L300 140M284 122L293 112L302 122',
  'M302 140L302 112L310 112L310 140M300 112L306 100L312 112',
  'M312 140L312 126L324 126L324 140M310 126L318 118L326 126',
];
const gate = 'M24 300L24 196M54 300L54 196M24 214L54 208M24 240L54 234M24 266L54 260M24 214L54 260';

export default compose({
  title: 'The Donkey sets off for Bremen',
  seed: 62,
  washes: [
    { c: PAL.sky, o: 0.35, d: 'M0 0L400 0L400 140C350 128 290 124 220 132C150 140 70 136 0 150Z' },
    { c: PAL.green, o: 0.42, d: `${hills}L400 300L0 300Z` },
    { c: PAL.ochre, o: 0.5, d: 'M150 300C190 262 300 236 290 200C282 176 270 158 286 140L298 140C296 160 302 182 316 200C344 234 300 262 260 300Z' },
    { c: PAL.terracotta, o: 0.85, d: 'M260 118L268 104L276 118ZM274 106L280 88L286 106ZM284 122L293 112L302 122ZM300 112L306 100L312 112ZM310 126L318 118L326 126Z' },
    { c: PAL.grey, o: 0.6, d: 'M262 140L262 118L274 118L274 140ZM276 140L276 106L284 106L284 140ZM286 140L286 122L300 122L300 140ZM302 140L302 112L310 112L310 140ZM312 140L312 126L324 126L324 140Z' },
    { c: PAL.ochre, o: 0.6, d: 'M24 300L24 196L54 196L54 300Z' },
  ],
  lines: [hills, road, gate],
  fine: [
    ...town,
    'M266 128l0 4M280 116l0 5M292 130l0 4M306 122l0 4M318 132l0 4',
    hatch(160, 290, 250, 286, 5, 6, 170, 4),
    tufts([[80, 250], [200, 290], [360, 250], [340, 180], [100, 180]], 9, 6),
  ],
  parts: [place(donkey(), 'translate(136 262) scale(1.05)')],
});
