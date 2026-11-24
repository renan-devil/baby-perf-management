import { PAL, hatch, rays, tufts } from '../lib.mjs';
import { at, compose, place, peter } from '../peter-rabbit/characters.mjs';
import { PETER_MORE_POSES, benjamin, bundle, oldBunny } from './characters.mjs';

// The Tale of Benjamin Bunny, 5: old Mr Benjamin Bunny, Benjamin's father, marches the two little
// rabbits straight home along the lane: he strides in front with his stick, Benjamin follows in the
// big tam, and Peter comes last, carrying the bundle of onions in the red handkerchief.
const ground = 'M0 262C90 259 190 264 290 261C340 260 370 262 400 261';

// The lane: two wheel ruts, and the late afternoon sun
const ruts = 'M0 276C120 273 260 277 400 274M0 290C120 287 260 291 400 288';
const sun = 'M28 40C28 28 52 28 52 40C52 52 28 52 28 40Z';
// little puffs of dust behind the old rabbit's marching feet
const dust = 'M262 256c-4 -6 2 -10 6 -6c2 -6 10 -4 8 2M146 258c-3 -5 2 -8 5 -5c2 -5 8 -3 7 2';

// where everyone walks (feet on the lane)
const OLD = 'translate(318 194) scale(1.55)';
const BEN = 'translate(192 208) scale(1.35)';
const PETER = 'translate(68 208) scale(1.35)';
// Peter's front paw, in his own coordinates: hand at the end of his first arm, turned with his torso
const [px, py] = at(PETER, ...at('rotate(6)', 24, -1.5));

export default compose({
  title: 'Old Mr Benjamin Bunny marches the two little rabbits home',
  seed: 95,
  washes: [
    { c: PAL.ochre, o: 0.4, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.terracotta, o: 0.2, d: 'M0 258C90 255 190 260 290 257C340 256 370 258 400 257L400 300L0 300Z' },
    { c: PAL.ochre, o: 0.6, d: sun },
    { c: PAL.terracotta, o: 0.25, d: sun },
  ],
  lines: [ground, sun],
  fine: [ruts, rays(40, 40, 18, 28, 9, 5), dust, hatch(20, 282, 380, 283, 10, 6, 165, 7), tufts([[140, 262], [262, 262], [394, 261]], 8, 2)],
  parts: [
    place(oldBunny(), OLD),
    place(benjamin({ pose: 'walk', tam: true }), BEN),
    place(peter({ pose: PETER_MORE_POSES.carry, mood: 'happy' }), PETER),
    place(bundle(), `translate(${px} ${py}) scale(0.95)`),
  ],
});
