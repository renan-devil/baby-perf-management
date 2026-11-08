import { PAL, transformPath } from '../lib.mjs';
import { compose, duckling, flyingCut, flyingSwan, place } from './characters.mjs';

const SW = ['translate(74 154) rotate(-8) scale(0.78)', 'translate(198 114) rotate(-10) scale(0.82)', 'translate(320 74) rotate(-12) scale(0.78)'];
const sky = 'M30 70C30 30 120 22 200 30C260 14 360 24 380 50C398 80 392 130 360 156C300 186 200 190 140 186C70 196 14 180 12 140C6 110 20 90 30 70Z';

// The Ugly Duckling, 6: in the autumn sky, among the falling leaves, three big white birds with long
// necks fly over. The duckling watches them from the water, longing to go with them.

// a falling leaf (pointed oval with a midrib), centre 0,0
const leaf = 'M-8 0C-4 -6 4 -6 8 0C4 6 -4 6 -8 0ZM-8 0L10 0';
const leafAt = (x, y, a, s = 1) => transformPath(leaf, `translate(${x} ${y}) rotate(${a}) scale(${s})`);
const leavesO = [leafAt(40, 40, 30), leafAt(150, 176, -20), leafAt(352, 150, 60), leafAt(250, 22, 10, 0.9)].join('');
const leavesT = [leafAt(110, 206, 80), leafAt(300, 186, -40), leafAt(380, 96, 20, 0.9)].join('');
const leavesR = [leafAt(56, 180, -60, 0.9), leafAt(240, 160, 40, 0.9), leafAt(176, 30, -30, 0.8)].join('');
const drift = 'M28 52q-6 6 -2 12M346 160q6 6 2 12M104 216q-6 4 -4 10';

const water = 'M0 244C100 240 300 246 400 242';
const reedsL = 'M14 300C12 260 18 230 28 206M30 300C32 270 38 246 50 230M4 300C2 280 0 266 -4 256';
const reedsR = 'M386 300C388 262 384 232 374 208M372 300C370 276 364 258 352 246';
const heads = 'M27 210C23 196 27 186 32 184C36 188 34 200 28 210ZM375 212C371 198 375 188 380 186C384 190 382 202 375 212Z';

export default compose({
  title: 'Three white birds fly over',
  seed: 76,
  washes: [
    { c: PAL.sky, o: 0.3, rule: 'evenodd', d: sky + SW.map((t) => transformPath(flyingCut, t)).join('') },
    { c: PAL.sky, o: 0.45, d: 'M0 240C100 236 300 242 400 238L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.6, d: `${reedsL}${reedsR}${heads}` },
    { c: PAL.ochre, o: 0.85, d: leavesO },
    { c: PAL.terracotta, o: 0.8, d: leavesT },
    { c: PAL.red, o: 0.7, d: leavesR },
  ],
  lines: [reedsL, reedsR],
  fine: [water, heads, leavesO, leavesT, leavesR, drift, 'M150 270C170 276 230 276 252 270M130 282C150 286 170 286 186 282'],
  parts: [
    ...SW.map((t) => place(flyingSwan(), t)),
    place(duckling({ head: -34 }), 'translate(206 262) scale(1.3)'),
  ],
});
