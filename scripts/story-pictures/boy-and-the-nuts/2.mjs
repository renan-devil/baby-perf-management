import { PAL, transformPath } from '../lib.mjs';
import {
  FLOOR,
  TABLE_Y,
  TOM_SHOULDER,
  at,
  compose,
  floorHatch,
  floorWash,
  from,
  jar,
  jarNuts,
  merge,
  nut,
  place,
  tableGrain,
  tableLegs,
  tableTop,
  tableWash,
  tom,
  windowBars,
  windowFrame,
  windowGlass,
  windowIn,
  windowSill,
} from './1.mjs';

// The Boy and the Nuts, 2: Tom's fist, full of nuts, is stuck in the jar. The jar has tipped over
// on the table and he leans right back, tugging at it with all his might; rattle, rattle! His fist is
// much too big for the narrow neck, and big tears roll down his cheeks.
const f1 = (n) => Math.round(n * 10) / 10;

// The jar from the cover, lying on its side with its neck towards Tom, lifted a little by his pull.
const J = `translate(318 ${TABLE_Y - 26}) rotate(-78)`;
// Tom, leaning back.
const T = 'translate(132 271) rotate(-9) scale(1.85)';

// His arm goes straight into the neck; the fist (with the nuts) is inside, just past the neck.
const shoulder = [TOM_SHOULDER, -71];
const [wx, wy] = from(T, ...at(J, 0, -82));
const dx = wx - shoulder[0];
const dy = wy - shoulder[1];
const pull = [shoulder, [shoulder[0] + dx * 0.14, shoulder[1] + dy * 0.14 - 2], [shoulder[0] + dx * 0.55, shoulder[1] + dy * 0.55], [wx, wy]];
const fistAngle = (Math.atan2(-dx, dy) * 180) / Math.PI;
// Where the fist sits, in the jar's own coordinates: leave the nuts out there and in the neck.
const fistMid = from(J, ...at(T, wx + (dx / Math.hypot(dx, dy)) * 9, wy + (dy / Math.hypot(dx, dy)) * 9));
const skip = (x, y) => Math.hypot(x - fistMid[0], y - fistMid[1]) < 21 || (y < -78 && Math.abs(x) < 11);
// The other arm flung back and up, for balance.
const back = [[-TOM_SHOULDER, -71], [-20, -78], [-30, -86], [-38, -96]];

// Rattle marks: short strokes following the jar's upper side and its base, and jiggle marks under it.
const [cx] = at(J, 0, -50);
const rattle = transformPath(
  'M43 -24C45 -34 45 -46 42 -56M51 -28C53 -36 53 -44 51 -52M-14 9C-5 12 5 12 14 9M-10 16C-3 18 3 18 10 16',
  J,
);
const jiggle = `M${f1(cx - 40)} ${TABLE_Y - 3}l-6 -5M${f1(cx + 46)} ${TABLE_Y - 3}l6 -5`;
// Effort puffs and flying tears beside his face.
const [hx, hy] = at(T, 0, -91);
const drops = [
  [hx - 31, hy - 4, -50],
  [hx - 41, hy - 14, -70],
  [hx + 29, hy - 8, 50],
]
  .map(([x, y, a]) => {
    const r = (a * Math.PI) / 180;
    const p = (u, v) => `${f1(x + u * Math.cos(r) - v * Math.sin(r))} ${f1(y + u * Math.sin(r) + v * Math.cos(r))}`;
    return `M${p(0, -5)}C${p(3, -1)} ${p(3.5, 3)} ${p(0, 3.5)}C${p(-3.5, 3)} ${p(-3, -1)} ${p(0, -5)}Z`;
  })
  .join('');
const looseNuts = merge(nut('walnut', 356, TABLE_Y - 5.5, 30), nut('hazel', 372, TABLE_Y - 5.5, 12));

export default compose({
  title: 'Tom’s hand is stuck',
  seed: 58,
  washes: [
    floorWash,
    { c: PAL.sky, o: 0.5, d: windowIn },
    { c: PAL.ochre, o: 0.45, d: windowSill },
    { c: PAL.terracotta, o: 0.6, d: tableWash },
    { c: PAL.ochre, o: 0.4, d: tableWash },
    { c: PAL.sky, o: 1, d: drops },
    { c: PAL.slate, o: 0.25, d: drops },
  ],
  lines: [FLOOR, tableTop, tableLegs, windowFrame],
  fine: [tableGrain, floorHatch, windowIn, windowBars, windowGlass, drops, jiggle],
  once: `<path d="${rattle}"/>`,
  parts: [
    looseNuts,
    place(jar({ nuts: jarNuts({ skip }) }), J),
    place(tom({ mood: 'cry', arms: [back, pull], armOpts: [{}, { hand: 'fist', angle: fistAngle }], tilt: -12 }), T),
  ],
});
