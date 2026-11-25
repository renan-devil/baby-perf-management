import { PAL, hatch, transformPath } from '../lib.mjs';
import { at, compose, dot, place, sausage, woodcutter } from './1.mjs';
import { F_ARMS, fanchon, fireplace, floor } from './3.mjs';

// The Three Wishes, 5: the sausage is off Fanchon's nose, and the woodcutter and Fanchon laugh and
// laugh until tears run down their cheeks. They cook the sausage and share it for supper by the fire:
// each holds up a half. The best supper they have ever had.
const FL = 'translate(0 14)';
const FP = 'translate(400 278) scale(0.7) translate(-310 -264)';
const W = 'translate(94 278) scale(1.32)';
const F = 'translate(224 278) scale(1.42)';
const wArms = [
  // a hand on his tummy, shaking with laughter
  [[-16, -84, 9], [-25, -64, 8], [-6, -56, 8]],
  // holding up his half of the sausage
  [[16, -84, 9], [34, -80, 8], [48, -96, 7]],
];
const fArms = [
  // holding up her half of the sausage
  [[-12, -86, 7], [-25, -80, 6.5], [-31, -100, 6]],
  F_ARMS.hips[1],
];
// each half sausage sits in a hand and points up and in, towards the other
const half = ([hx, hy], dir, tie) => {
  const pts = [0, 1, 2].map((i) => [hx + dir * (2 + i * 7), hy + 7 - i * 19, i === 1 ? 17 : 16]);
  return sausage(pts, { tie });
};
const wHand = at(W, 48, -96);
const fHand = at(F, -31, -100);
// tears of laughter
const [we, wy] = at(W, -10, -106);
const [fe, fy] = at(F, 8, -100);
const tears = dot(we, wy, 2) + dot(we - 2, wy + 8, 1.6) + dot(fe, fy, 1.8) + dot(fe + 2, fy + 8, 1.5);

export default compose({
  title: 'Sharing the sausage for supper',
  seed: 75,
  washes: [
    { c: PAL.ochre, o: 0.3, d: transformPath(`${floor}L400 284C300 290 100 290 0 284Z`, FL) },
    { c: PAL.ochre, o: 0.22, d: 'M282 236C284 196 334 180 368 186C398 192 404 236 400 278L286 278C282 266 282 250 282 236Z' },
  ],
  after: [{ c: PAL.sky, o: 0.75, d: tears }],
  lines: [transformPath(floor, FL)],
  fine: [
    // ha ha! laughing marks
    'M46 76q3 -6 9 -4M36 90q2 -6 8 -6M250 80q4 -5 9 -2M258 94q4 -4 9 -1',
    hatch(20, 290, 150, 290, 10, 5, 165, 3),
    hatch(180, 292, 300, 290, 8, 5, 165, 4),
  ],
  parts: [
    place(fireplace(), FP),
    place(woodcutter({ mood: 'laugh', arms: wArms }), W),
    place(fanchon({ mood: 'laugh', arms: fArms }), F),
    half(wHand, -0.1, false),
    half(fHand, 0.35, true),
  ],
});
