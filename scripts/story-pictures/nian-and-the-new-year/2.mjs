import { PAL, hatch, tufts } from '../lib.mjs';
import { ARMS, at, compose, handOf, house, person, place, right, walkingStick } from './characters.mjs';

// Nian and the First New Year, 2: at dusk, the old wanderer with his long white beard and his
// walking stick comes down the road to the village at sunset, and the kind
// grandmother, at the door of her tiled house, holds out a warm bowl of rice for him.
const ground = 'M0 268C80 266 180 268 260 268C320 268 370 266 400 268';
const hills = 'M0 196C30 176 54 150 80 146C104 150 116 172 140 168C168 150 190 120 214 118C236 122 250 150 270 160';
const sun = 'M318 70C318 60 326 54 336 54C346 54 354 60 354 70C354 80 346 86 336 86C326 86 318 80 318 70Z';

const OM = 'translate(100 270) scale(1.3)';
const omArms = [ARMS.down, right(ARMS.front)];
const [sx, sy] = at(OM, ...handOf(omArms[1]));
const GR = 'translate(250 270) scale(1.3)';
const grArms = [ARMS.give, right(ARMS.down)];
const [bx, by] = at(GR, ...handOf(grArms[0]));
const bowl = `M${bx - 15} ${by - 4}C${bx - 12} ${by + 10} ${bx + 12} ${by + 10} ${bx + 15} ${by - 4}Z`;
const rice = `M${bx - 14} ${by - 4}C${bx - 9} ${by - 14} ${bx + 9} ${by - 14} ${bx + 14} ${by - 4}Z`;
const steam = `M${bx - 4} ${by - 16}c-4 -6 4 -8 0 -14M${bx + 5} ${by - 15}c-4 -6 4 -8 0 -14`;

export default compose({
  title: 'A bowl of rice for the old man',
  seed: 223,
  washes: [
    { c: PAL.rose, o: 0.3, d: 'M0 60C120 50 280 50 400 60L400 220L0 220Z' },
    { c: PAL.ochre, o: 0.7, d: sun },
    { c: PAL.slate, o: 0.25, d: `${hills}L270 268L0 268Z` },
    { c: PAL.grey, o: 0.35, d: `${ground}L400 300L0 300Z` },
  ],
  lines: [ground, hills, bowl],
  fine: [sun, steam, rice, hatch(20, 284, 380, 286, 12, 7, 168, 6), tufts([[30, 268], [196, 268], [392, 268]], 8, 4)],
  parts: [
    place(house({ w: 150, h: 88 }), 'translate(330 268)'),
    { lines: [], fine: [], washes: [{ c: PAL.sky, o: 0.7, d: bowl }], whites: [rice], fills: [], glints: [] },
    place(walkingStick(), `translate(${sx} ${sy}) rotate(-4) scale(1.3)`),
    place(person({ who: 'oldman', arms: omArms, tilt: 4 }), OM),
    place(person({ who: 'granny', arms: grArms, tilt: -4 }), GR),
  ],
});
