import { PAL } from '../lib.mjs';
import { F_ARMS, baleAndNest, compose, dot, farmer, gooseFlying, place } from './characters.mjs';

// The Goose That Laid the Golden Eggs, 2: the impatient farmer grabs the nest with both hands and
// shakes it, shake, shake, shake! The frightened goose honks and flaps away out of the barn door.
const BT = 'translate(184 276) scale(1.2)'; // the hay bale, the nest tipped by the shaking
// the barn wall inside, and the open doorway on the right with the sky, a hill and the hedge outside
const wall = 'M18 276C10 210 18 120 50 64C110 40 200 34 258 40L258 276Z';
const door = 'M266 276L266 40L388 40L388 276';
const doorFrame = 'M258 276L258 32L396 32L396 276';
const sky = 'M266 40L388 40L388 250L266 250Z';
const hill = 'M266 236C300 222 345 216 388 224L388 262L266 262Z';
const hedge = 'M266 244C270 230 284 230 290 238C296 226 312 226 316 238C322 228 336 230 338 240C346 230 360 232 362 242C370 234 384 236 388 244L388 270L266 270Z';
const floor = 'M0 276C100 272 200 272 258 274';
// shake marks round the nest, straw flying off it, two loose white feathers
const shakes = 'M112 214q-8 8 -2 18M104 210q-10 12 -2 24M262 200q6 6 0 14M168 156q4 -6 10 -6M196 152q6 -4 12 -2';
const strawBits = 'M140 176l8 -6M160 168l2 -9M222 170l6 4M236 184l9 -2M190 162l-3 -8M130 192l-8 -3';
const feather = (x, y, a) => `M${x} ${y}c6 ${-4 - a} 14 ${-4 - a} 18 0c-6 ${4 - a} -12 ${4 - a} -18 0Z`;
const feathers = feather(214, 118, 1) + feather(170, 104, -1);

export default compose({
  title: 'The Goose That Laid the Golden Eggs',
  seed: 313,
  washes: [
    { c: PAL.terracotta, o: 0.22, d: wall },
    { c: PAL.ochre, o: 0.4, d: 'M0 274C100 270 300 270 400 274L400 300L0 300Z' },
    { c: PAL.sky, o: 0.55, d: sky },
    { c: PAL.green, o: 0.4, d: hill },
    { c: PAL.green, o: 0.75, d: hedge },
    { c: PAL.terracotta, o: 0.7, d: 'M258 276L258 32L396 32L396 276L388 276L388 40L266 40L266 276Z' },
    { c: PAL.ochre, o: 0.7, d: dot(358, 68, 11) },
  ],
  whites: feathers,
  lines: [floor, doorFrame, door, 'M266 244C270 230 284 230 290 238C296 226 312 226 316 238C322 228 336 230 338 240C346 230 360 232 362 242C370 234 384 236 388 244'],
  fine: [shakes, strawBits, feathers, 'M174 103l10 0M218 117l10 0'],
  parts: [
    place(baleAndNest({ tilt: -8 }), BT),
    place(farmer({ mood: 'cross', look: 1.5, tilt: 6, arms: F_ARMS.shake }), 'translate(84 276) scale(1.4)'),
    place(gooseFlying(), 'translate(314 132) scale(1.05)'),
  ],
});
