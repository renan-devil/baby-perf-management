import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { V_ARMS, compose, dot, peter, place, right, rock, sheep, sheepPeek, villager } from './characters.mjs';

// The Boy Who Cried Wolf, 5: early next morning, the sun comes up and everybody searches the hill.
// The baker and the farmer find the frightened sheep peeping out from behind the rocks, safe and
// sound, and Peter hugs the littlest lamb.
const top = 'M0 252C100 244 300 244 400 254';
const topWash = `${top}L400 300L0 300Z`;

// the morning sun, just up
const sun = dot(56, 62, 22);

// Peter's arms cradling the lamb he holds against his chest, its head by his cheek
const hug = [
  [[-9, -68, 6.5], [-21, -52, 5.5], [-4, -42, 5.5]],
  [[9, -68, 6.5], [21, -50, 5.5], [6, -42, 5.5]],
];

// little joy marks
const hearts = 'M244 92c-2 -5 4 -7 5 -2c1 -5 7 -3 5 2l-5 5ZM146 100c-2 -4 3 -6 4 -2c1 -4 6 -2 4 2l-4 4Z';

export default compose({
  title: 'Safe and sound',
  seed: 95,
  washes: [
    { c: PAL.rose, o: 0.25, d: 'M0 130C120 120 280 130 400 120L400 254L0 254Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 196C120 188 280 196 400 190L400 254L0 254Z' },
    { c: PAL.ochre, o: 0.85, d: sun },
    { c: PAL.green, o: 0.5, d: topWash },
    { c: PAL.rose, o: 0.8, d: hearts },
  ],
  lines: [top],
  fine: [
    sun,
    rays(56, 62, 30, 44, 12, 23, 8),
    hearts,
    tufts([[110, 250], [180, 246], [244, 246], [300, 248]], 8, 18),
    hatch(30, 282, 380, 282, 10, 7, 168, 19),
  ],
  parts: [
    place(sheepPeek({}), 'translate(52 218) scale(1.15)'),
    place(rock(76, 42), 'translate(50 256)'),
    place(sheepPeek({ mood: 'content' }), 'translate(352 218) scale(-1.15 1.15)'),
    place(rock(78, 42), 'translate(352 258)'),
    place(villager({ kind: 'baker', mood: 'happy', tilt: -6, arms: [V_ARMS.fwd, right(V_ARMS.down)] }), 'translate(112 252) scale(1.12)'),
    place(villager({ kind: 'farmer', mood: 'happy', tilt: 6, arms: [V_ARMS.down, right(V_ARMS.fwd)] }), 'translate(290 252) scale(1.12)'),
    place(peter({ mood: 'content', tilt: 10, arms: hug }), 'translate(200 256) scale(1.5)'),
    place(sheep({ mood: 'content' }), 'translate(200 186) scale(0.85)'),
  ],
});
