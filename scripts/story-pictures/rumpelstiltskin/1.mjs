import { PAL, hatch } from '../lib.mjs';
import { LM_ARMS, LM_LEGS, at, compose, goldHeap, littleMan, place, spool, sparkles, stool, straw, wheel, whirr, windowArch } from './characters.mjs';

// Rumpelstiltskin, cover: at night, in a room full of straw, the funny little man with the long beard
// sits on a stool at the spinning wheel and spins the straw into golden thread. Whirr goes the wheel!
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const W = 'translate(288 272) scale(1.6)';
const S = 'translate(118 272) scale(2)';
const L = 'translate(118 263) scale(2.1)';
const [hx, hy] = at(L, ...LM_ARMS.spin[1][2]);
const [bx, by] = at(W, -54, -60);
const [cx, cy] = at(W, 4, -64);
// the golden thread from his fingers to the bobbin
const thread = `M${hx + 2} ${hy - 1}C${hx + 8} ${hy - 8} ${bx - 8} ${by + 6} ${bx} ${by}`;
// more golden thread winding off the bobbin, down in loops to the heap of gold on the floor
const [dx, dy] = at(W, -44, -56);
const trail = `M${dx} ${dy}C${dx - 4} ${dy + 20} ${dx + 18} ${dy + 26} ${dx + 10} ${dy + 40}C${dx + 2} ${dy + 52} ${dx + 30} ${dy + 60} ${dx + 40} ${dy + 74}C${dx + 50} ${dy + 86} ${dx + 70} ${dy + 84} 312 274`;
// a tuft of straw in his other hand
const [sx, sy] = at(L, ...LM_ARMS.spin[0][2]);
const tuft = `M${sx} ${sy}l-10 -14M${sx} ${sy}l-3 -17M${sx} ${sy}l4 -16M${sx} ${sy}l-14 -6M${sx} ${sy}l-8 10`;
// loose straw on the floor
const loose = 'M150 284l14 -3M176 290l12 2M60 288l16 -4M226 292l14 -1M20 292l10 3M250 282l10 -4';

export default compose({
  title: 'Rumpelstiltskin',
  seed: 81,
  washes: [
    { c: PAL.slate, o: 0.16, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.terracotta, o: 0.22, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
  ],
  lines: [floor],
  fine: [tuft, hatch(14, 284, 384, 286, 12, 8, 172, 4), loose, whirr(cx, cy, 58, [[-75, -35], [-15, 20], [130, 170], [195, 230]])],
  once: `<path stroke="${PAL.ochre}" stroke-width="3" d="${thread}${trail}"/>`,
  parts: [
    windowArch(176, 26, 42, 56),
    place(straw(120, 96, 11), 'translate(14 274)'),
    place(straw(90, 70, 13), 'translate(392 274)'),
    place(wheel(), W),
    place(stool(22, 13), S),
    place(littleMan({ mood: 'sly', tilt: 6, arms: LM_ARMS.spin, legs: LM_LEGS.sit }), L),
    place(goldHeap(60, 26, 3), 'translate(330 292)'),
    place(spool(), 'translate(270 292) scale(1.2)'),
    place(spool(), 'translate(372 294) scale(1.2)'),
    sparkles([[300, 254, 6], [362, 256, 5], [212, 150, 6], [236, 196, 4.5], [336, 112, 5]]),
  ],
});
