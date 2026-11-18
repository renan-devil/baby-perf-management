import { PAL } from '../lib.mjs';
import { at, cinderella, compose, cushion, place, slipper, sparkles } from './characters.mjs';

// Cinderella, 9: back in the kitchen, Cinderella in her patched apron sits on a little stool and
// holds out her foot: the glass slipper slides on and fits perfectly, shining. Smiling, she holds
// up the other glass slipper, which she has taken from her apron pocket. Her old wooden clogs lie
// on the floor, and the empty red cushion waits beside her.
const floor = 'M10 272C120 269 290 269 392 272';
const cT = 'translate(170 214) scale(1.75)';
const stoolEnds = 'M121 214L109 214L109 226L121 226M219 214L231 214L231 226L219 226';
const stoolLegs = 'M112 226L110 272M228 226L230 272';
// her right leg reaches forward, the slipper on her foot; her left foot is bare
const LEGS = [
  [[-8, 10, 6], [-9, 20, 5.5], [-9, 28, 5]],
  [[8, 10, 6], [24, 18, 5.5], [38, 22, 5]],
];
// (sitting lowers her arms by 42, so the raised hand is at -112 + 42)
const [px, py] = at(-36, -70, cT);
// the clogs, kicked off
const clog = 'M-12 -8C-14 0 -12 4 -6 4L12 4C18 4 18 -4 12 -6C6 -8 0 -10 -12 -8Z';

export default compose({
  title: 'It Fits!',
  seed: 1209,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M14 270C120 262 290 262 388 270C384 280 290 284 200 284C120 284 16 280 14 270Z' },
    { c: PAL.terracotta, o: 0.85, d: `${stoolEnds.replace(/M219/, 'ZM219')}Z` },
  ],
  lines: [floor, stoolEnds, stoolLegs],
  parts: [
    place({ lines: [clog], washes: [{ c: PAL.terracotta, o: 0.85, d: clog }] }, 'translate(52 266) rotate(-8)'),
    place({ lines: [clog], washes: [{ c: PAL.terracotta, o: 0.85, d: clog }] }, 'translate(80 268) rotate(14) scale(-1 1)'),
    place(cushion(), 'translate(340 262)'),
    place(
      cinderella({
        sit: true,
        mood: 'happy',
        look: 1,
        tilt: 6,
        legs: LEGS,
        bare: [true, false],
        glass: [false, true],
        arms: [
          [[-12, -80, 7], [-26, -86, 6.5], [-32, -100, 6.5], [-36, -112, 6.5]],
          [[12, -80, 7], [20, -68, 6.5], [16, -58, 6.5], [10, -56, 6.5]],
        ],
      }),
      cT,
    ),
    place(slipper(), `translate(${px + 2} ${py - 10}) rotate(-12) scale(0.8)`),
    sparkles([
      [282, 222, 7],
      [298, 252, 5],
      [262, 196, 4],
      [px - 26, py - 34, 5],
      [px + 30, py - 30, 4],
    ]),
  ],
});
