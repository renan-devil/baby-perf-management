import { PAL, hatch, tufts } from '../lib.mjs';
import { compose, marie, oval, place, ripple, well } from './characters.mjs';

// Mother Holle, 2: Marie has dropped her spindle into the old stone well. She leans over the rim and
// peers down at the rings on the dark water, where the spindle is sinking. Her stool and her ball
// of wool are left behind on the grass.
export const WT = 'translate(262 278) scale(1.8)';
const ground = 'M14 278C120 275 290 275 390 278';
// her little stool and the ball of wool
const stool = 'M22 242L68 242L66 248L24 248ZM28 248L22 278M62 248L68 278M45 248L45 276';
const wool = oval(48, 232, 10, 9);
const thread = 'M56 236C76 242 66 268 92 272';
const plop = 'M262 150l-5 -12M278 146l0 -14M294 150l5 -12';

export default compose({
  title: 'The Spindle Falls into the Well',
  seed: 1402,
  washes: [
    { c: PAL.green, o: 0.35, d: 'M10 276C120 268 290 268 394 276C390 288 300 296 200 296C110 296 14 290 10 276Z' },
    { c: PAL.ochre, o: 0.7, d: 'M22 242L68 242L66 248L24 248ZM28 248L22 278L26 278L32 248ZM62 248L68 278L64 278L58 248Z' },
    { c: PAL.rose, o: 0.75, d: wool },
  ],
  lines: [ground, stool, wool],
  fine: [
    thread,
    plop,
    'M40 226c4 2 10 2 14 -2M42 236c4 2 10 2 14 -2M44 224c2 4 2 10 0 14',
    hatch(110, 288, 380, 288, 12, 6, 160, 6),
    tufts([[16, 278], [86, 278], [372, 278]], 9, 5),
    'M300 60c4 -5 9 -5 12 0c3 -5 8 -5 12 0M330 84c3 -4 7 -4 9 0c3 -4 7 -4 9 0',
  ],
  parts: [
    place(well({ roof: false }), WT),
    place(ripple(10, -51), WT),
    place(
      marie({
        mood: 'worried',
        look: 1,
        up: -1,
        tilt: 6,
        arms: [
          [[-12, -80, 7], [-2, -72, 6.5], [10, -68, 6.5], [20, -68, 6.5]],
          [[12, -80, 7], [20, -76, 6.5], [27, -73, 6.5], [31, -72, 6.5]],
        ],
      }),
      'translate(108 278) rotate(22) scale(1.6)',
    ),
  ],
});
