import { PAL, hatch, transformPath, tufts } from '../lib.mjs';
import { cat, compose, place } from './characters.mjs';

// The Bremen Town Musicians, 4: a sad old Cat sits in the middle of the road with a face as long as
// three rainy days, under her own little rain cloud.
const CAT = 'translate(200 270) scale(1.6)';
const horizon = 'M0 122C100 116 300 118 400 122';
const road = 'M14 300C80 230 150 170 184 122M386 300C320 230 250 170 216 122';
const roadFill = 'M14 300C80 230 150 170 184 122L216 122C250 170 320 230 386 300Z';
// the Cat's outline, cut out of the background washes so she stays clean grey
const hull = transformPath('M-22 0C-28 -14 -26 -30 -16 -40L-14 -62L-15 -84L-4 -77L4 -77L15 -84L14 -62L16 -40C26 -30 28 -14 22 0Z', CAT);
const cloud = 'M150 70C140 70 134 62 138 54C138 44 150 38 158 44C162 32 182 28 190 40C198 32 216 34 218 46C230 44 240 54 234 64C232 70 226 72 218 72Z';
const drops = 'M156 84l-3 9M172 88l-3 9M188 84l-3 9M204 90l-3 9M220 84l-3 9M164 104l-2 6M196 106l-2 6M212 104l-2 6';

export default compose({
  title: 'A face as long as three rainy days',
  seed: 64,
  washes: [
    { c: PAL.green, o: 0.4, d: `${horizon}L400 300L0 300Z${hull}`, rule: 'evenodd' },
    { c: PAL.ochre, o: 0.5, d: `${roadFill}${hull}`, rule: 'evenodd' },
    { c: PAL.slate, o: 0.7, d: cloud },
    { c: PAL.sky, o: 0.5, d: cloud },
  ],
  lines: [road, horizon, cloud],
  fine: [drops, hatch(110, 290, 290, 290, 6, 6, 170, 2), tufts([[40, 170], [360, 180], [20, 270], [380, 266]], 10, 5)],
  parts: [place(cat({ pose: 'sit', mood: 'sad' }), CAT)],
});
