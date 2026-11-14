import { PAL, hatch, rng } from '../lib.mjs';
import { compose, place, swallow, thumbelina } from './characters.mjs';

// Thumbelina, 7: deep in the dark tunnel, Thumbelina tucks a blanket of soft hay round a cold,
// sleeping swallow.
const tunnel = 'M0 252C0 130 100 70 200 70C300 70 400 130 400 252';
const outer = 'M0 150C20 70 100 24 200 24C300 24 380 70 400 150';
const earth = 'M0 252C0 130 100 70 200 70C300 70 400 130 400 252L400 150C380 70 300 24 200 24C100 24 20 70 0 150Z';
const floor = 'M0 252C100 248 300 256 400 250';
const roots = 'M150 74C152 90 148 100 152 112M152 96l8 8M262 76C258 92 264 104 258 116M260 98l-8 6M60 120C68 128 70 140 66 150';
const f = (n) => Math.round(n * 10) / 10;
// a straw-edged mound of hay: an oval outline with little spikes of straw sticking out
const mound = (cx, cy, rx, ry, seed, floor = 250) => {
  const r = rng(seed);
  let d = '';
  const n = 34;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI;
    const k = i % 2 ? 1 + 0.08 + r() * 0.08 : 1;
    const y = cy + Math.sin(a) * ry * k;
    d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rx * k)} ${f(Math.min(y, floor))}`;
  }
  return `${d}Z`;
};
const hay = mound(110, 220, 98, 34, 9);
// the blanket laid over the swallow's back, up to her neck
const cover = mound(170, 214, 70, 22, 4, 240);
const stones = 'M30 268C30 262 42 262 44 268ZM340 272C340 264 356 264 358 272Z';

export default compose({
  title: 'A blanket of hay for the swallow',
  seed: 107,
  washes: [
    { c: PAL.terracotta, o: 0.4, d: earth },
    { c: PAL.slate, o: 0.45, d: earth },
    { c: PAL.slate, o: 0.22, d: `${tunnel}Z` },
  ],
  after: [{ c: PAL.ochre, o: 0.7, d: hay }, { c: PAL.ochre, o: 0.6, d: cover }],
  lines: [tunnel, floor, hay, stones],
  once: `<path d="${cover}"/>`,
  fine: [
    roots,
    hatch(30, 226, 190, 198, 18, 14, 165, 21, 0.5),
    hatch(40, 242, 186, 226, 14, 12, 15, 22, 0.5),
    hatch(112, 214, 232, 206, 14, 12, 170, 31, 0.5),
    hatch(116, 226, 226, 222, 10, 10, 10, 32, 0.5),
    'M80 60l4 4M200 40l-3 5M320 54l4 3M30 120l3 4M370 120l-3 4', outer,
  ],
  parts: [
    place(swallow({ pose: 'asleep' }), 'translate(180 232) scale(1.55)'),
    place(thumbelina({ pose: 'kneel', arms: 'tuck', mood: 'happy' }), 'translate(336 252) scale(-1.22 1.22)'),
  ],
});
