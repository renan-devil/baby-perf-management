import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { PETER_ARMS, V_ARMS, at, bucket, compose, handOf, peter, place, right, sheep, stick, villager, wool } from './characters.mjs';

// The Boy Who Cried Wolf, 2: the baker and the farmer run puffing up the hill with a stick and a
// bucket to chase the wolf away, while at the top Peter rolls in the grass, laughing.
const hill = 'M0 288C90 284 170 262 236 228C286 202 330 192 400 190';
const hillWash = `${hill}L400 300L0 300Z`;
const cloud = 'M30 52C26 42 40 38 44 44C48 34 66 36 66 46C76 46 76 56 66 56L32 56C24 56 24 50 30 52Z';

const BT = 'translate(82 286) rotate(8) scale(1.12)';
const bakerArms = [V_ARMS.back, right(V_ARMS.up)];
const [sx, sy] = at(BT, ...handOf(bakerArms[1]));
const FT = 'translate(196 252) rotate(12) scale(1.12)';
const farmerArms = [V_ARMS.back, right(V_ARMS.fwd)];
const [bx, by] = at(FT, ...handOf(farmerArms[1]));

// puffs of breath behind their heads
const [p1x, p1y] = at(BT, -22, -122);
const [p2x, p2y] = at(FT, -22, -122);
const puff = (x, y) => [wool(x, y, 7, 5, 6, 1.3), wool(x - 14, y + 5, 5, 3.6, 5, 1.3), wool(x - 24, y + 9, 3, 2.4, 5, 1.3)];
const puffs = [...puff(p1x, p1y), ...puff(p2x, p2y)];

// Peter, lying on his back on the hilltop with his legs kicking in the air
const PT = 'translate(250 194) rotate(80) scale(-1.3 1.3)';
const [hx, hy] = at(PT, 0, -86);

export default compose({
  title: 'Puff, puff, puff',
  seed: 92,
  washes: [
    { c: PAL.sky, o: 0.35, d: cloud },
    { c: PAL.green, o: 0.5, d: hillWash },
  ],
  lines: [hill, cloud],
  fine: [
    ...puffs,
    rays(hx, hy - 4, 26, 34, 7, 5, 180),
    tufts([[30, 287], [140, 276], [226, 234], [300, 204], [390, 190]], 8, 12),
    hatch(250, 282, 390, 282, 6, 7, 168, 13),
  ],
  parts: [
    place(sheep({ head: 'munch' }), 'translate(372 250) scale(-0.95 0.95)'),
    place(stick(), `translate(${sx} ${sy}) rotate(20) scale(1.05)`),
    place(villager({ kind: 'baker', mood: 'puff', arms: bakerArms, legs: 'run' }), BT),
    place(villager({ kind: 'farmer', mood: 'puff', arms: farmerArms, legs: 'run' }), FT),
    place(bucket(), `translate(${bx} ${by}) rotate(8)`),
    place(peter({ mood: 'laugh', tilt: 72, arms: [PETER_ARMS.belly, right(PETER_ARMS.belly)], legs: 'kick' }), PT),
  ],
});
