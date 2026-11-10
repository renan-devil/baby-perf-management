import { PAL, hatch, tufts } from '../lib.mjs';
import { PETER_ARMS, compose, crook, house, peter, place, right, sheep } from './characters.mjs';

// The Boy Who Cried Wolf, cover: on top of the big green hill, Peter cups his hands round his
// mouth and shouts as loudly as he can, his woolly sheep grazing around him. Far below, the
// village roofs.
const hill = 'M0 262C50 236 120 190 200 186C278 184 338 214 400 246';
const hillWash = 'M0 262C50 236 120 190 200 186C278 184 338 214 400 246L400 300L0 300Z';

// shout marks on both sides of his head
const shout = 'M150 56C143 66 143 80 150 90M139 49C130 63 130 83 139 97M250 56C257 66 257 80 250 90M261 49C270 63 270 83 261 97';

// two little clouds
const cloud = (x, y) => `M${x} ${y}C${x - 4} ${y - 10} ${x + 10} ${y - 14} ${x + 14} ${y - 8}C${x + 18} ${y - 18} ${x + 36} ${y - 16} ${x + 36} ${y - 6}C${x + 46} ${y - 6} ${x + 46} ${y + 4} ${x + 36} ${y + 4}L${x + 2} ${y + 4}C${x - 6} ${y + 4} ${x - 6} ${y - 2} ${x} ${y}Z`;

export default compose({
  title: 'The Boy Who Cried Wolf',
  seed: 91,
  washes: [
    { c: PAL.sky, o: 0.35, d: `${cloud(40, 54)}${cloud(318, 40)}` },
    { c: PAL.green, o: 0.5, d: hillWash },
    { c: PAL.green, o: 0.3, d: 'M290 290C300 276 340 268 400 268L400 300L290 300Z' },
  ],
  lines: [hill, cloud(40, 54), cloud(318, 40)],
  fine: [
    shout,
    tufts([[70, 236], [134, 206], [228, 192], [300, 214], [372, 240], [36, 268]], 8, 11),
    hatch(40, 282, 260, 286, 9, 7, 168, 12),
  ],
  parts: [
    place(crook(), 'translate(250 198) rotate(10) scale(1.15)'),
    place(peter({ mood: 'call', arms: [PETER_ARMS.cup, right(PETER_ARMS.cup)] }), 'translate(200 194) scale(1.45)'),
    place(sheep({ head: 'munch' }), 'translate(96 238) scale(0.9)'),
    place(sheep({}), 'translate(306 236) scale(-0.95 0.95)'),
    place(sheep({ mood: 'content' }), 'translate(150 272) scale(1.05)'),
    place(sheep({ head: 'munch' }), 'translate(262 278) scale(-1 1)'),
    place(house(20), 'translate(346 272)'),
    place(house(16), 'translate(374 274)'),
  ],
});
