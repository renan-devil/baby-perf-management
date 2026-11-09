import { PAL, hatch, tufts } from '../lib.mjs';
import { brick, compose, dot, pig, pigHand, place, trowel } from './characters.mjs';

// The Three Little Pigs, 2: brick by brick, the third little pig builds his house (tap, tap, tap),
// while far behind him his two brothers play: one jumps for joy, one throws a ball.
const ground = 'M0 256C100 252 200 258 300 254C350 252 380 255 400 253';
const hill = 'M278 240C298 212 346 198 400 200';

// The half-built wall, course by course, stepping down to the right like a staircase.
const H = 13;
let wall = '';
let wallFill = '';
for (let i = 0; i < 7; i++) {
  const y = 255 - H * (i + 1);
  const x0 = 18 + (i % 2 ? 12 : 0);
  const x1 = Math.min(204, 244 - i * 15);
  for (let x = x0; x + 20 <= x1; x += 25) {
    const r = `M${x} ${y + 1}L${x + 23} ${y + 1}L${x + 23} ${y + H - 1}L${x} ${y + H - 1}Z`;
    wall += r;
    wallFill += r;
  }
}
const marks = 'M156 150l-5 -6M166 146l0 -9M176 150l5 -6';

const S = 1.42;
const PX = 236;
const [hx, hy] = pigHand('out', -1);
const [tx, ty] = pigHand('down', 1);
const ball = dot(373, 120, 11);

export default compose({
  title: 'Brick by brick',
  seed: 42,
  washes: [
    { c: PAL.green, o: 0.3, d: `${hill}L400 256L270 256Z` },
    { c: PAL.green, o: 0.42, d: 'M0 252C100 248 200 254 300 250C350 248 380 251 400 249L400 294C300 298 100 296 0 294Z' },
    { c: PAL.red, o: 0.72, d: wallFill },
    { c: PAL.terracotta, o: 0.35, d: 'M18 230L200 230L200 254L18 254Z' },
    { c: PAL.sky, o: 0.75, d: ball },
  ],
  lines: [ground, hill, ball],
  fine: [
    wall,
    marks,
    'M363 116C369 122 377 124 383 120M366 111Q373 114 381 111',
    'M302 208l4 -6M316 210l0 -8M330 208l-4 -6',
    hatch(20, 272, 380, 274, 11, 8, 170, 6),
    tufts([[10, 255], [200, 256], [300, 254], [392, 253]], 9, 4),
  ],
  parts: [
    place(pig({ scarf: PAL.green, arms: ['up', 'up'], legs: 'jump', mouth: 'open' }), 'translate(316 192) scale(0.78)'),
    place(pig({ scarf: PAL.sky, arms: ['up', 'up'], mouth: 'open' }), 'translate(370 204) scale(0.78)'),
    place(pig({ scarf: PAL.slate, arms: ['out', 'down'] }), `translate(${PX} 254) scale(${S})`),
    place(brick(), `translate(${PX + hx * S - 4} ${254 + hy * S - 6}) scale(1.1)`),
    place(trowel(), `translate(${PX + tx * S} ${254 + ty * S}) rotate(25) scale(1.5)`),
  ],
});
