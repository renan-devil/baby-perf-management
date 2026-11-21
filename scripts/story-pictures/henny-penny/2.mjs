import { PAL, hatch, tufts } from '../lib.mjs';
import { cocky, compose, ducky, goosey, henny, place } from './characters.mjs';

// Henny Penny, 2: off they march to tell the king! Along a lane winding up over the fields come
// Henny Penny in front, then Cocky Locky, Ducky Lucky and Goosey Loosey, one behind the other.
// The characters are drawn in characters.mjs.

// the fields, and the lane winding from the front of the picture away to the top left
const horizon = 'M0 148C90 140 220 146 400 132';
const field = 'M0 144C90 136 220 142 400 128L400 300L0 300Z';
const lane = 'M400 292C320 284 266 258 226 232C186 206 126 180 34 162L40 154C130 168 196 190 238 214C280 238 332 256 400 262Z';
const laneEdges = 'M400 292C320 284 266 258 226 232C186 206 126 180 34 162M40 154C130 168 196 190 238 214C280 238 332 256 400 262';

// little puffs of dust kicked up behind each bird
const puff = (x, y, s = 1) => `M${x} ${y}c${-4 * s} ${-6 * s} ${-12 * s} ${-4 * s} ${-11 * s} ${2 * s}M${x - 14 * s} ${y - 2 * s}c${-3 * s} ${-4 * s} ${-8 * s} ${-3 * s} ${-8 * s} ${1 * s}`;

export default compose({
  title: 'The birds march off in a line',
  seed: 43,
  parts: [
    {
      lines: [horizon],
      fine: [laneEdges, tufts([[30, 230], [120, 270], [360, 200], [300, 172], [190, 290]], 9, 4), hatch(250, 160, 390, 150, 6, 6, 150, 9), hatch(10, 200, 120, 214, 5, 6, 150, 3)],
      washes: [
        { c: PAL.green, o: 0.28, d: field },
        { c: PAL.ochre, o: 0.35, d: lane },
      ],
    },
    place(goosey({}), 'translate(66 158) rotate(-3) scale(0.8)'),
    place(ducky({}), 'translate(116 186) rotate(3) scale(0.92)'),
    place(cocky({}), 'translate(240 226) rotate(-3) scale(1.1)'),
    place(henny({ mood: 'worried', look: [1, 0] }), 'translate(326 268) rotate(3) scale(1.35)'),
    { fine: [puff(36, 156, 0.7), puff(88, 184, 0.8), puff(202, 224, 0.9), puff(280, 266)] },
  ],
});
