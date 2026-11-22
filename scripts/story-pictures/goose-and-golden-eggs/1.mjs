import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { F_ARMS, NEST_SEAT, at, baleAndNest, compose, farmer, goldenEgg, gooseSitting, place, wife } from './characters.mjs';

// The Goose That Laid the Golden Eggs, 1 (cover): in the barn, the farmer and his wife stare in wonder
// at their white goose, sitting in her straw nest on a hay bale beside a shining golden egg.
const BT = 'translate(204 272) scale(1.3)'; // the hay bale and nest
const GT = `${BT} translate(${NEST_SEAT[0]} ${NEST_SEAT[1]})`; // the goose in the nest
const [ex, ey] = at(42, -57, BT); // the golden egg, on the nest's front lip
const ET = `translate(${ex} ${ey}) scale(1.35)`;
// the barn behind: a soft wall of planks and a beam
const wall = 'M24 272C14 210 22 120 60 60C140 30 270 30 340 60C384 120 390 210 378 272Z';
const floor = 'M0 272C100 268 300 268 400 272';

export default compose({
  title: 'The Goose That Laid the Golden Eggs',
  seed: 307,
  washes: [
    { c: PAL.terracotta, o: 0.22, d: wall },
    { c: PAL.ochre, o: 0.4, d: 'M0 270C100 266 300 266 400 270L400 300L0 300Z' },
  ],
  lines: [floor],
  fine: [
    rays(ex, ey - 21, 25, 40, 11, 8, 10),
    hatch(20, 286, 380, 286, 16, 8, 165, 9, 0.5),
    tufts([[20, 272], [150, 272], [262, 272], [390, 272]], 8, 11),
  ],
  parts: [
    place(baleAndNest(), BT),
    place(gooseSitting(), GT),
    place(goldenEgg(), ET),
    place(farmer({ mood: 'wow', look: 1.2, arms: F_ARMS.wow }), 'translate(74 276) scale(1.4)'),
    place(wife({ mood: 'wow', look: -1.2 }), 'translate(332 276) scale(1.45)'),
  ],
});
