import { PAL, parseTransform } from '../lib.mjs';
import { beakTip, compose, flyingGoose, place, tortoise } from './characters.mjs';

// The Talkative Tortoise, 3: up, up, up over the trees. The two geese fly side by side, each with
// one end of a long stick in its beak, and the tortoise hangs from the middle by her mouth, legs
// dangling, mouth shut tight.
const apply = (t, [x, y]) => {
  const m = parseTransform(t);
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
};
const GA = 'translate(80 92) scale(0.85)';
const GB = 'translate(284 72) scale(0.85)';
const [ax, ay] = apply(GA, beakTip('down'));
const [bx, by] = apply(GB, beakTip('down'));
const r1 = (n) => Math.round(n * 10) / 10;
// the stick: from just behind the first beak to just past the second, with a knot and a twig
const along = (t, dy = 0) => [r1(ax + (bx - ax) * t), r1(ay + (by - ay) * t + dy)];
const P = (t, dy) => along(t, dy).join(' ');
const stick = `M${P(-0.04, -2.2)}C${P(0.3, -3)} ${P(0.7, -2)} ${P(1.04, -2.2)}L${P(1.04, 2.2)}C${P(0.7, 2)} ${P(0.3, 3)} ${P(-0.04, 2.2)}Z`;
const twig = `M${P(0.78, -2)}l6 -9M${P(0.2, -2)}l-3 -7`;

// the tortoise, turned head-up, her mouth clamped on the middle of the stick
const turn = -72;
const local = `rotate(${turn}) scale(1)`;
const [mx, my] = apply(local, [80, -26]);
const [sx, sy] = along(0.5);
const T = `translate(${r1(sx - mx)} ${r1(sy - my + 1)}) ${local}`;
const down = Math.round((Math.atan2(Math.cos((turn * Math.PI) / 180), Math.sin((turn * Math.PI) / 180)) * 180) / Math.PI);

// treetops far below, and the flap marks
const trees =
  'M0 280C8 264 30 262 40 274C48 260 74 260 82 276C92 266 110 268 114 282' +
  'M280 284C288 268 310 264 320 278C328 264 352 262 360 276C370 266 390 268 400 280';
const treeFill =
  'M0 280C8 264 30 262 40 274C48 260 74 260 82 276C92 266 110 268 114 282L114 300L0 300Z' +
  'M280 284C288 268 310 264 320 278C328 264 352 262 360 276C370 266 390 268 400 280L400 300L280 300Z';
const flaps = 'M20 52q6 -4 12 0M14 66q6 -4 12 0M222 34q6 -4 12 0M216 48q6 -4 12 0';

export default compose({
  title: 'Up, up, up they went',
  seed: 45,
  washes: [
    { c: PAL.green, o: 0.6, d: treeFill },
    { c: PAL.sky, o: 0.22, d: 'M70 200C76 188 100 184 112 194C122 186 146 190 146 204C148 216 122 220 110 214C92 220 72 214 70 200Z' },
    { c: PAL.sky, o: 0.2, d: 'M300 170C306 158 330 154 342 164C352 156 376 160 376 174C378 186 352 188 340 184C322 190 300 184 300 170Z' },
    { c: PAL.ochre, o: 0.7, d: stick },
  ],
  lines: [trees, stick],
  fine: [twig, flaps],
  parts: [
    place(flyingGoose({ neck: 'down' }), GA),
    place(flyingGoose({ neck: 'down' }), GB),
    place(tortoise({ mouth: 'bite', legs: 'dangle', down }), T),
  ],
});
