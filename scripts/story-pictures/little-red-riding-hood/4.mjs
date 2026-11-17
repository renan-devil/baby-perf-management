import { PAL, tufts } from '../lib.mjs';
import { G_ARMS, basket, bunch, compose, flower, girl, place, wolf } from './characters.mjs';

// Little Red Riding Hood, 4: she has stepped off the path to pick flowers among the trees, one more
// and one more, while the wolf runs off the other way, straight to Grandmother's. Whoosh!
const ground = 'M0 236C90 230 200 238 300 232C340 230 372 232 400 230';
const path = 'M200 300C230 286 300 276 400 272L400 300Z';
// trees round her
const t1 = 'M24 234C28 180 22 110 30 50M46 234C42 180 46 110 42 50';
const c1 = 'M-6 54C-20 42 -10 16 12 16C20 0 54 -2 64 16C82 16 90 36 78 50C84 66 66 74 52 66C38 76 16 74 10 64C-4 66 -14 60 -6 54Z';
const t2 = 'M180 232C182 190 178 140 184 90M198 232C194 190 198 140 196 90';
const c2 = 'M156 94C142 84 150 62 170 60C178 46 208 44 218 60C232 62 234 82 224 92C230 108 212 114 200 106C188 116 168 114 162 104C150 106 146 98 156 94Z';
const flowers = [
  [14, 238, PAL.ochre], [62, 240, PAL.red], [76, 246, PAL.sky], [146, 240, PAL.rose],
  [158, 252, PAL.red], [112, 260, PAL.sky], [40, 262, PAL.red], [226, 244, PAL.ochre], [94, 236, PAL.rose],
];
// whoosh: speed lines behind the running wolf and little dust puffs at his heels
const speed = 'M262 150l-34 0M266 170l-40 0M262 190l-28 0M268 130l-22 0';
const dust = 'M262 250c-6 -8 -16 -6 -16 2c-6 -2 -10 6 -4 8M276 256c-4 -6 -12 -4 -12 2';

export default compose({
  title: 'Flowers, and a wolf in a hurry',
  seed: 109,
  washes: [
    { c: PAL.green, o: 0.42, d: 'M0 232C90 226 200 234 300 228C340 226 372 228 400 226L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.45, d: path },
    { c: PAL.ochre, o: 0.45, d: 'M24 234C28 180 22 110 30 60L42 60C46 110 42 180 46 234Z' },
    { c: PAL.green, o: 0.6, d: c1 },
    { c: PAL.ochre, o: 0.45, d: 'M180 232C182 190 178 140 184 100L196 100C198 140 194 190 198 232Z' },
    { c: PAL.green, o: 0.6, d: c2 },
  ],
  lines: [ground, t1, c1, t2, c2, speed],
  fine: [
    path.replace(/L400 300Z$/, ''),
    dust,
    'M20 30c3 -5 8 -5 10 0M50 40c3 -5 8 -5 10 0M186 80c3 -5 8 -5 10 0',
    tufts([[130, 236], [250, 234], [370, 232], [20, 280], [160, 286]], 9, 4),
  ],
  parts: [
    ...flowers.map(([x, y, c]) => place(flower(c), `translate(${x} ${y})`)),
    place(basket(), 'translate(70 228) scale(1.05)'),
    place(bunch(), 'translate(84 200) rotate(-40) scale(0.85)'),
    place(girl({ arms: G_ARMS.pickBunch, mood: 'happy', tilt: 10 }), 'translate(112 252) scale(1.25)'),
    place(flower(PAL.red, { h: 22 }), 'translate(155 252)'),
    place(wolf({ pose: 'run', mouth: 'grin' }), 'translate(330 256) scale(0.95)'),
  ],
});
