import { PAL, hatch } from '../lib.mjs';
import { bench, candle, compose, dot, leather, place, shoemakerHead, wifeHead, windowPanes } from './characters.mjs';

// The Elves and the Shoemaker, 5: one snowy evening before Christmas, the shoemaker and his wife hide
// behind the curtain in the corner of the dark room and peep out at the workbench, quiet as two mice.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';

// the curtain on its rod, in soft folds; its edge is pulled back a little where they peep out
const rod = 'M8 34L176 34';
const curtain = 'M14 36C12 120 18 200 12 262C50 266 110 266 150 262C146 226 152 200 150 170C158 140 150 100 152 36Z';
const folds = 'M40 40C38 120 44 200 40 262M72 40C74 120 68 200 74 262M104 40C102 120 108 200 104 262M130 40C132 110 128 200 130 262';

// two pairs of feet peeping out under the curtain
const feet = 'M70 262C64 262 62 270 68 270L84 270L84 262ZM90 262L90 270L106 270C112 270 110 262 104 262Z';
const boots = 'M112 262C106 262 104 270 110 270L126 270L126 262ZM130 262L130 270L146 270C152 270 150 262 144 262Z';

// their fingers holding the curtain edge
const fingers = 'M148 150c4 -2 8 0 8 3c0 3 -4 4 -8 2M148 157c4 -1 7 1 7 3c0 3 -4 3 -7 2M150 198c4 -2 8 0 8 3c0 3 -4 4 -8 2M150 205c4 -1 7 1 7 3c0 3 -4 3 -7 2';

export default compose({
  title: 'Hiding behind the curtain',
  seed: 85,
  washes: [
    // the dark room
    { c: PAL.slate, o: 0.38, d: 'M4 20C80 8 300 10 396 22C400 120 398 200 396 274L4 274C0 200 2 100 4 20Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.red, o: 0.6, d: curtain },
    { c: PAL.slate, o: 0.7, d: feet },
    { c: PAL.terracotta, o: 0.85, d: boots },
    { c: PAL.rose, o: 0.55, d: fingers.replace(/c0 3 -4 4 -8 2/g, 'c0 3 -4 4 -8 2Z').replace(/c0 3 -4 3 -7 2/g, 'c0 3 -4 3 -7 2Z') },
  ],
  lines: [floor, rod, curtain, feet, boots, dot(8, 34, 4), dot(176, 34, 4)],
  fine: [folds, fingers, hatch(14, 284, 384, 286, 12, 8, 172, 4)],
  parts: [
    place(wifeHead({ mood: 'peepR' }), 'translate(166 126) rotate(10) scale(1.35)'),
    place(shoemakerHead({ mood: 'peepR' }), 'translate(166 178) rotate(12) scale(1.35)'),
    windowPanes(240, 42, 56, 50, { night: true, snow: [[248, 52], [262, 64], [252, 80], [276, 50], [288, 70], [270, 84], [286, 86]] }),
    place(bench({ w: 150, h: 76 }), 'translate(306 272)'),
    place(leather(), 'translate(292 186) scale(0.9)'),
    place(candle({ glow: 52 }), 'translate(356 188)'),
  ],
});
