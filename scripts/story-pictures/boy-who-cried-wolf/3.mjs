import { PAL, hatch, tufts } from '../lib.mjs';
import { PETER_ARMS, V_ARMS, compose, peter, place, right, sheep, villager } from './characters.mjs';

// The Boy Who Cried Wolf, 3: tricked again! The tired baker and farmer stand on the hilltop with
// their hands on their hips, frowning, while Peter giggles behind his hand.
const top = 'M0 252C90 240 300 238 400 250';
const topWash = `${top}L400 300L0 300Z`;

// beads of sweat beside the villagers' heads
const drop = (x, y) => `M${x} ${y}C${x - 3} ${y + 5} ${x - 3} ${y + 8} ${x} ${y + 8}C${x + 3} ${y + 8} ${x + 3} ${y + 5} ${x} ${y}Z`;
const drops = drop(48, 92) + drop(40, 106) + drop(222, 94) + drop(230, 108);

// giggle marks around Peter's head
const giggles = 'M324 112q4 -4 8 0q4 4 8 0M328 98q4 -4 8 0q4 4 8 0M266 112q-4 -4 -8 0q-4 4 -8 0';

export default compose({
  title: 'Tricked again',
  seed: 93,
  washes: [
    { c: PAL.green, o: 0.5, d: topWash },
    { c: PAL.sky, o: 0.6, d: drops },
  ],
  lines: [top],
  fine: [drops, giggles, tufts([[20, 250], [150, 244], [258, 242], [384, 248]], 8, 14), hatch(30, 280, 380, 280, 10, 7, 168, 15)],
  parts: [
    place(villager({ kind: 'baker', mood: 'cross', arms: [V_ARMS.hip, right(V_ARMS.hip)] }), 'translate(88 250) scale(1.12)'),
    place(villager({ kind: 'farmer', mood: 'cross', tilt: 6, arms: [V_ARMS.hip, right(V_ARMS.hip)] }), 'translate(182 246) scale(1.12)'),
    place(peter({ mood: 'giggle', tilt: -10, arms: [PETER_ARMS.belly, right(PETER_ARMS.mouth)] }), 'translate(296 246) scale(1.4)'),
    place(sheep({ head: 'munch' }), 'translate(366 270) scale(0.95)'),
  ],
});
