import { PAL, hatch, tufts } from '../lib.mjs';
import { HANS_ARMS, HANS_LEGS, at, burst, compose, farmer, from, girl, goose, hans, parson, place, reach } from './characters.mjs';

// The Golden Goose, 4: a long silly line. Hans strides along with the golden goose under his arm, and
// behind him everybody who touched it is stuck, hand to back, hopping along in a wobbly row: the three
// innkeeper's daughters, the parson in his black hat and a farmer with his spade.
const GROUND = 274;
const ground = `M0 ${GROUND}C90 ${GROUND - 3} 200 ${GROUND + 2} 300 ${GROUND - 1}C340 ${GROUND - 2} 370 ${GROUND} 400 ${GROUND - 1}`;

const H = `translate(346 ${GROUND}) rotate(4) scale(1.3)`;
const GOOSE_IN_HANS = 'translate(-36 -58) scale(-0.72 0.72)';
// The followers, from the front of the line to the back: [x, hop, tilt, scale]
const line = [
  { x: 240, hop: 0, tilt: 8, s: 1.1, make: (o) => girl({ ...o, mood: 'wow', dress: PAL.green, hop: false }) },
  { x: 192, hop: -14, tilt: 2, s: 1.08, make: (o) => girl({ ...o, mood: 'puff', dress: PAL.sky, hop: true }) },
  { x: 144, hop: 0, tilt: 10, s: 1.08, make: (o) => girl({ ...o, mood: 'wow', dress: PAL.ochre, hop: false }) },
  { x: 96, hop: -12, tilt: 4, s: 1.08, make: (o) => parson({ ...o, mood: 'puff' }) },
  { x: 46, hop: 0, tilt: 9, s: 1.08, make: (o) => farmer({ ...o, mood: 'wow' }) },
];
const T = line.map((p) => `translate(${p.x} ${GROUND + p.hop}) rotate(${p.tilt}) scale(${p.s})`);
// Each one's hand: the first on the goose's back, the others on the back of the one in front.
const targets = [at(H, ...at(GOOSE_IN_HANS, -6, -28)), ...T.slice(0, -1).map((t) => at(t, -13, -64))];
const free = [
  [[-9, -80, 6.5], [-20, -70, 6], [-28, -78, 5.5]],
  [[-9, -80, 6.5], [-22, -86, 6], [-26, -100, 5.5]],
  [[-9, -80, 6.5], [-18, -68, 6], [-26, -64, 5.5]],
  [[-10, -84, 6.5], [-22, -92, 6], [-26, -106, 5.5]],
  [[-10, -84, 6.5], [-18, -72, 6], [-14, -60, 5.5]],
];
const people = line.map((p, i) => {
  const [hx, hy] = from(T[i], ...targets[i]);
  const shoulder = i < 3 ? [9, -80] : [10, -84];
  return place(p.make({ tilt: -p.tilt / 2, arms: [free[i], reach(...shoulder, hx, hy, 5)] }), T[i]);
});
// Little hop marks under the ones in the air, and puffs of dust behind the line.
const hops = line
  .filter((p) => p.hop)
  .map((p) => `M${p.x - 14} ${GROUND + 2}q4 -6 8 0M${p.x + 6} ${GROUND + 2}q4 -6 8 0`)
  .join('');
const dust = 'M14 266c-6 -2 -8 -8 -2 -10c0 -6 8 -6 10 -2';

export default compose({
  title: 'A long silly line of people stuck together',
  seed: 74,
  washes: [
    { c: PAL.green, o: 0.32, d: `M0 ${GROUND - 4}C90 ${GROUND - 7} 200 ${GROUND - 2} 300 ${GROUND - 5}C340 ${GROUND - 6} 370 ${GROUND - 4} 400 ${GROUND - 5}L400 300L0 300Z` },
  ],
  lines: [ground],
  fine: [hops, dust, hatch(20, 286, 380, 288, 12, 7, 165, 4), tufts([[10, GROUND], [270, GROUND - 1], [384, GROUND - 1]], 9, 5), burst(...targets[0], 9, 16, 6, 4, 250)],
  parts: [
    ...people.reverse(),
    place(hans({ mood: 'happy', tilt: 6, arms: HANS_ARMS.carryBack, legs: HANS_LEGS.walk, under: place(goose(), GOOSE_IN_HANS) }), H),
  ],
});
