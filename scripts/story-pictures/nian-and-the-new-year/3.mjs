import { PAL, hatch, tufts } from '../lib.mjs';
import { ARMS, at, compose, handOf, house, lantern, person, place, right } from './characters.mjs';

// Nian and the First New Year, 3: the old man, now in a bright red coat, decorates the
// grandmother's house: red paper already covers the door, one red lantern glows by the wall, and
// he reaches up to hang another under the eave, a sheet of red paper ready in his other hand.
const ground = 'M0 270C80 268 180 270 260 270C320 270 370 268 400 270';

const OM = 'translate(344 270) scale(1.05)';
const omArms = [ARMS.reach, right(ARMS.front)];
const [hx, hy] = at(OM, ...handOf(omArms[0]));
const [px, py] = at(OM, ...handOf(omArms[1]));
const paper = `M${px - 2} ${py - 22}L${px + 20} ${py - 18}L${px + 16} ${py + 6}L${px - 6} ${py + 2}Z`;

export default compose({
  title: 'Red paper and red lanterns',
  seed: 233,
  washes: [
    { c: PAL.slate, o: 0.16, d: 'M0 0L400 0L400 70C300 60 200 78 0 64Z' },
    { c: PAL.grey, o: 0.35, d: `${ground}L400 300L0 300Z` },
    { c: PAL.red, o: 0.85, d: paper },
  ],
  lines: [ground, paper],
  fine: [
    // pat, pat: little marks around the fresh paper
    `M${px + 26} ${py - 20}l6 -4M${px + 28} ${py - 8}l7 0M${px + 26} ${py + 4}l6 4`,
    hatch(20, 286, 380, 288, 12, 7, 168, 8),
    tufts([[280, 270], [20, 270]], 8, 6),
  ],
  parts: [
    place(house({ w: 200, h: 128, red: true, door: -8 }), 'translate(158 270)'),
    place(lantern(16), 'translate(44 144)'),
    place(lantern(16), `translate(${hx} ${hy - 6})`),
    place(person({ who: 'oldman', red: true, mood: 'content', arms: omArms, tilt: -6 }), OM),
  ],
});
