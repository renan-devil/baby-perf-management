import { PAL, hatch, tufts } from '../lib.mjs';
import { CAT_H, at, toLocal, GD_H, GM_H, GP_H, cat, compose, dog, dot, girl, grandma, grandpa, mouse, place, turnip } from './characters.mjs';

// The Enormous Turnip, 5: POP! The turnip flies out of the ground, roots and all, and everybody tumbles
// over backwards in a happy heap, laughing, with the little mouse cheering on top.
const GY = 262;
const HOLE = [340, GY];
const ground = `M0 ${GY}C90 ${GY - 4} 190 ${GY + 2} 290 ${GY - 2}C340 ${GY - 4} 370 ${GY - 1} 400 ${GY - 3}`;
const hole = `M${HOLE[0] - 34} ${GY - 1}C${HOLE[0] - 30} ${GY - 8} ${HOLE[0] + 30} ${GY - 8} ${HOLE[0] + 34} ${GY - 1}C${HOLE[0] + 20} ${GY + 6} ${HOLE[0] - 20} ${GY + 6} ${HOLE[0] - 34} ${GY - 1}Z`;
// the burst: strokes fanning up out of the hole, and clods of earth flying
const f1 = (n) => Math.round(n * 10) / 10;
let burst = '';
for (let i = 0; i < 9; i++) {
  const a = ((-160 + i * 17.5) * Math.PI) / 180;
  const r1 = 44 + (i % 2) * 6;
  const r2 = r1 + 18 + (i % 3) * 6;
  burst += `M${f1(HOLE[0] + Math.cos(a) * r1)} ${f1(GY - 4 + Math.sin(a) * r1 * 0.8)}L${f1(HOLE[0] + Math.cos(a) * r2)} ${f1(GY - 4 + Math.sin(a) * r2 * 0.8)}`;
}
const whoosh = `M${HOLE[0] - 10} ${GY - 30}C${HOLE[0] - 20} ${GY - 80} ${HOLE[0] - 40} ${GY - 110} ${HOLE[0] - 64} ${GY - 126}M${HOLE[0] + 6} ${GY - 36}C${HOLE[0] - 2} ${GY - 90} ${HOLE[0] - 24} ${GY - 124} ${HOLE[0] - 48} ${GY - 144}`;
const clods = [dot(290, 196, 3.4), dot(372, 206, 3), dot(384, 190, 3.6), dot(392, 222, 2.6), dot(364, 176, 2.6), dot(276, 176, 2.6)].join('');

// each one sits down hard with the hip at (x, y), leaning back; limbs are given as picture points
const sit = (x, y, s, H) => `translate(${x} ${y}) scale(${s}) translate(0 ${H})`;
const w = (T, list) => list.map((pts) => pts.map(([x, y]) => toLocal(x, y, T)));
const S = 0.82;
const GP = sit(322, GY - 10, S, GP_H);
const GM = sit(256, GY - 9, S, GM_H);
const GD = sit(194, GY - 7, S, GD_H);
const CT = sit(56, GY - 5, 0.76, CAT_H);
// arms flung up and forward from the shoulder: [elbow, hand] offsets in picture units
const fling = (T, H, lean, shoulder, a, b) => {
  const [x, y] = at(...shoulder, `${T} translate(0 ${-H}) rotate(${lean})`);
  return w(T, [a, b].map((pts) => pts.map(([dx, dy]) => [x + dx, y + dy])));
};
// legs kicked up from the hip (or the hem of the skirt)
const kick = (T, H, from, a, b) => {
  const [x, y] = at(...from, `${T} translate(0 ${-H})`);
  return w(T, [a, b].map((pts) => pts.map(([dx, dy]) => [x + dx, y + dy])));
};

export default compose({
  title: 'Pop!',
  seed: 59,
  washes: [
    { c: PAL.ochre, o: 0.32, d: `M0 ${GY - 4}C90 ${GY - 8} 190 ${GY - 2} 290 ${GY - 6}C340 ${GY - 8} 370 ${GY - 5} 400 ${GY - 7}L400 296C300 300 100 298 0 296Z` },
    { c: PAL.terracotta, o: 0.85, d: hole },
    { c: PAL.ink, o: 0.35, d: hole },
  ],
  after: [{ c: PAL.terracotta, o: 0.9, d: clods }],
  lines: [ground, hole],
  fine: [hatch(14, 280, 386, 282, 12, 8, 172, 4), tufts([[392, GY - 3]], 9, 6), clods],
  once: `<path d="${burst}"/><path stroke-dasharray="7 6" d="${whoosh}"/>`,
  parts: [
    place(turnip({ whole: true }), 'translate(214 136) rotate(-30) scale(0.5)'),
    place(mouse({ arms: 'up', mood: 'laugh' }), `translate(18 ${GY - 1})`),
    place(cat({ mood: 'laugh', lean: -24, arms: fling(CT, CAT_H, -24, [2, -28], [[8, -8], [16, -18]], [[11, -3], [21, -10]]), legs: kick(CT, CAT_H, [0, 0], [[10, -6], [18, -14]], [[13, -2], [24, -4]]) }), CT),
    place(dog({ pose: 'pull', mood: 'laugh' }), `translate(112 ${GY - 37}) rotate(6) scale(0.68 -0.68)`),
    place(
      girl({
        mood: 'laugh',
        lean: -50,
        headTilt: -8,
        skirtTurn: -92,
        arms: fling(GD, GD_H, -50, [0, -31], [[10, -8], [20, -16]], [[11, 0], [22, -2]]),
        legs: kick(GD, GD_H, [24, 0], [[4, -3], [12, -10]], [[5, 0], [16, -1]]),
      }),
      GD,
    ),
    place(
      grandma({
        mood: 'laugh',
        lean: -44,
        headTilt: -8,
        skirtTurn: -92,
        arms: fling(GM, GM_H, -44, [1, -46], [[14, -10], [26, -22]], [[15, -1], [30, -4]]),
        legs: kick(GM, GM_H, [58, 2], [[4, -4], [14, -12]], [[6, 0], [18, -2]]),
      }),
      GM,
    ),
    place(
      grandpa({
        mood: 'laugh',
        lean: -40,
        headTilt: -8,
        // holding his tummy as he laughs
        arms: [[[10, -40], [22, -30]], [[16, -44], [24, -22]]].map((pts) => w(GP, [pts.map((p) => at(...p, `${GP} translate(0 ${-GP_H}) rotate(-40)`))])[0]),
        legs: kick(GP, GP_H, [0, 0], [[22, -16], [34, -40]], [[26, -6], [48, -14]]),
      }),
      GP,
    ),
  ],
});
