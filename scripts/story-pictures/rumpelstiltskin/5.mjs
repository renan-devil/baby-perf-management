import { PAL, hatch } from '../lib.mjs';
import { ANNIE_ARMS, LM_ARMS, annie, at, compose, littleMan, place, spool, stool, straw, wheel, windowArch } from './characters.mjs';

// Rumpelstiltskin, 5: on the third night Annie has nothing left to give. The little man climbs on a
// stool to be as tall as she is, points his finger and asks her to promise him her first baby.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const S = 'translate(160 272) scale(1.6)';
const L = 'translate(160 222) scale(1.6)';
// his pointing finger
const [fx, fy] = at(L, ...LM_ARMS.point[1][2]);
const finger = `M${fx} ${fy - 4}l1 -9`;

export default compose({
  title: 'On a stool, the little man asks Annie to promise him her first baby',
  seed: 85,
  washes: [
    { c: PAL.slate, o: 0.16, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.terracotta, o: 0.22, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
  ],
  lines: [floor],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), finger, `M${fx - 7} ${fy - 16}l-4 -3M${fx + 7} ${fy - 16}l4 -3M${fx} ${fy - 20}l0 -5`],
  parts: [
    windowArch(200, 30, 42, 56),
    place(wheel(), 'translate(58 272) scale(0.95)'),
    place(spool(), 'translate(24 292) scale(1.1)'),
    place(spool(), 'translate(104 294) scale(1.1)'),
    place(straw(80, 60, 31), 'translate(376 274)'),
    place(stool(30), S),
    place(littleMan({ mood: 'sly', tilt: 6, arms: LM_ARMS.point }), L),
    place(annie({ mood: 'worried', arms: ANNIE_ARMS.worried, tilt: -6 }), 'translate(282 272) scale(1.36)'),
  ],
});
