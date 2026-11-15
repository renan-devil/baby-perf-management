import { PAL } from '../lib.mjs';
import { bedroomWindow, candle, compose, pile, place, princess } from './characters.mjs';

// The Princess and the Pea, 4: "Here is your bed, my dear." The bed is now so tall that it nearly
// touches the ceiling: twenty mattresses and the feather quilts on top. The princess, seen from
// behind, climbs a long, long ladder all the way up. A candle on the floor, the night at the window.
const X = 292;
const P = pile({ n: 20, q: 3, w: 150, h: 9, seed: 5 });
const top = 288 + P.top;
// the ladder, leaning on the pile: foot at F, top at T, rails 24 apart
const F = [118, 288];
const T = [X - 74, top + 4];
const len = Math.hypot(T[0] - F[0], T[1] - F[1]);
const ux = (T[0] - F[0]) / len;
const uy = (T[1] - F[1]) / len;
const [nx, ny] = [-uy * 13, ux * 13];
const p = (t, s) => [F[0] + (T[0] - F[0]) * t + nx * s, F[1] + (T[1] - F[1]) * t + ny * s];
const f = (n) => Math.round(n * 10) / 10;
const seg = (a, b) => `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`;
// the princess (scale 0.85) stands on rung 4 and holds rung 9 above her head; the ladder behind her
// is left out (one layer of ink), so only the rails and rungs below and above her are drawn
const RUNGS = 11;
const S = 0.85;
const tFeet = 4 / (RUNGS + 1);
const tHead = tFeet + (116 * S) / len;
const rails = [-1, 1].map((s) => seg(p(0, s), p(tFeet + 0.01, s)) + seg(p(tHead, s), p(1.04, s))).join('');
let rungs = '';
for (let i = 1; i <= RUNGS; i++) {
  const t = i / (RUNGS + 1);
  if (t < tFeet + 0.01 || t > tHead) rungs += seg(p(t, -1), p(t, 1));
}
const railFill = [-1, 1]
  .map((s) =>
    [
      [0, tFeet + 0.01],
      [tHead, 1.04],
    ]
      .map(([a, b]) => `M${f(p(a, s)[0] - 2)} ${f(p(a, s)[1])}L${f(p(b, s)[0] - 2)} ${f(p(b, s)[1])}L${f(p(b, s)[0] + 2)} ${f(p(b, s)[1])}L${f(p(a, s)[0] + 2)} ${f(p(a, s)[1])}Z`)
      .join(''),
  )
  .join('');
const angle = (Math.atan2(ux, -uy) * 180) / Math.PI;
const [sx, sy] = p(tFeet, 0);
const floor = 'M16 288C120 285 290 285 392 288';

export default compose({
  title: 'Up the Ladder',
  seed: 851,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M20 288C110 280 300 280 390 288C386 296 300 300 200 300C110 300 24 296 20 288Z' },
    { c: PAL.terracotta, o: 0.85, d: railFill },
  ],
  lines: [floor, rails],
  fine: [rungs],
  parts: [
    place(bedroomWindow(), 'translate(20 190) scale(0.72)'),
    place(candle(), 'translate(70 286) scale(1.2)'),
    place(P.drawing, `translate(${X} 288)`),
    place(
      princess({
        back: true,
        arms: [
          [[-12, -80, 7], [-20, -96, 6.5], [-19, -112, 6.5], [-16, -125, 6.5]],
          [[12, -80, 7], [20, -96, 6.5], [19, -112, 6.5], [16, -125, 6.5]],
        ],
      }),
      `translate(${f(sx)} ${f(sy)}) rotate(${f(angle)}) scale(${S})`,
    ),
  ],
});
