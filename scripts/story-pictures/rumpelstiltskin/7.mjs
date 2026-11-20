import { PAL, hatch } from '../lib.mjs';
import { ANNIE_ARMS, LM_ARMS, LM_HEAD, annie, at, compose, littleMan, place, windowArch } from './characters.mjs';

// Rumpelstiltskin, 7: the Queen reads out a very, very long list of names, so long that it unrolls
// right down to the floor, and the little man shakes his head at every one: "No! No! No!"
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const Q = 'translate(104 272) scale(1.42)';
const [hx, hy] = at(Q, ...ANNIE_ARMS.scroll[1][2]);
// the list: a roller in her hand, the paper hanging down to the floor and running along it
const x0 = hx - 2;
const roller = `M${x0 - 2} ${hy - 4}L${x0 + 38} ${hy - 4}L${x0 + 38} ${hy + 4}L${x0 - 2} ${hy + 4}Z`;
const paper = `M${x0 + 1} ${hy + 4}C${x0 + 3} ${hy + 50} ${x0 - 1} ${hy + 90} ${x0 + 2} 262C${x0 + 4} 272 ${x0 + 12} 278 ${x0 + 30} 278L232 280C244 280 248 270 240 266C234 263 228 268 232 272L${x0 + 34} 268C${x0 + 38} 260 ${x0 + 36} ${hy + 60} ${x0 + 35} ${hy + 4}Z`;
// names: scribbly lines down the paper and along the floor
let names = '';
for (let y = hy + 14; y < 254; y += 9) names += `M${x0 + 7} ${y}c3 -2 5 2 8 0s5 -2 ${8 + ((y * 7) % 9)} 0`;
for (let x = x0 + 44; x < 222; x += 18) names += `M${x} 274c3 -2 5 2 8 0s4 -1 6 0`;
const L = 'translate(312 272) scale(1.62)';
const [lx, ly] = at(L, LM_HEAD[0], LM_HEAD[1]);
// shaking his head: swishes either side of it
const shake = `M${lx - 34} ${ly - 18}c-6 8 -6 20 0 28M${lx - 42} ${ly - 12}c-4 6 -4 12 0 18M${lx + 34} ${ly - 18}c6 8 6 20 0 28M${lx + 42} ${ly - 12}c4 6 4 12 0 18`;

export default compose({
  title: 'The Queen reads a very long list of names, and the little man shakes his head',
  seed: 87,
  washes: [
    { c: PAL.ochre, o: 0.12, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.red, o: 0.35, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.terracotta, o: 0.8, d: roller },
  ],
  whites: paper,
  lines: [floor, roller, paper],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), names, shake],
  parts: [
    windowArch(200, 30, 50, 70, { night: false }),
    place(annie({ mood: 'happy', queen: true, arms: ANNIE_ARMS.scroll, tilt: 4 }), Q),
    place(littleMan({ mood: 'no', arms: LM_ARMS.hips }), L),
  ],
});
