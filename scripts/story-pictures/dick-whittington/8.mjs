import { PAL } from '../lib.mjs';
import { K_ARMS, catPounce, compose, dot, king, mouse, oval, place } from './1.mjs';

// Dick Whittington, 8: far away across the sea, the rats run all over the King's dinner table. The
// King throws up his hands, and Dick's cat leaps onto the table.
const floor = 'M10 272C120 269 280 270 390 272';
const top = 'M34 186L268 186';
const cloth = 'M34 186L268 186L272 222C250 228 236 220 220 226C196 230 180 222 160 228C130 232 110 222 90 228C66 232 46 222 30 224Z';
const legs = 'M50 226L50 270M254 226L254 270';
const folds = 'M90 190L88 226M160 190L160 226M220 190L221 224';

// roast chicken on a plate, plate centre (0,0)
const plate = oval(0, 0, 30, 6);
const chicken = 'M-24 -3C-26 -16 -12 -24 0 -24C12 -24 26 -16 24 -3Z';
const drum = 'M8 -14C12 -24 18 -30 22 -30C25 -27 22 -20 16 -10ZM-8 -14C-12 -24 -18 -30 -22 -30C-25 -27 -22 -20 -16 -10Z';
// a cake: two tiers and a cherry, bottom centre (0,0)
const cake1 = 'M-24 0L-24 -18C-14 -21 14 -21 24 -18L24 0Z';
const cake2 = 'M-14 -19L-14 -32C-8 -34 8 -34 14 -32L14 -19';
const icing = 'M-24 -18C-20 -12 -16 -12 -12 -17C-8 -12 -4 -12 0 -17C4 -12 8 -12 12 -17C16 -12 20 -12 24 -18';

export default compose({
  title: 'Rats on the King’s table',
  seed: 281,
  washes: [
    { c: PAL.sky, o: 0.3, d: 'M90 190L88 226L94 226ZM160 190L160 226L166 226ZM220 190L221 224L227 224Z' },
    { c: PAL.ochre, o: 0.7, d: 'M47 226L53 226L53 270L47 270ZM251 226L257 226L257 270L251 270Z' },
    { c: PAL.red, o: 0.3, d: 'M20 272C120 268 280 268 300 272L300 284C200 288 100 288 20 284Z' },
  ],
  lines: [floor, cloth, legs],
  fine: [top, folds],
  parts: [
    place(
      {
        lines: [plate, chicken, drum],
        fine: ['M-14 -8q4 -4 8 0M4 -10q4 -4 8 0', dot(24, -33, 2.6), dot(-24, -33, 2.6)],
        whites: [dot(24, -33, 2.6), dot(-24, -33, 2.6)],
        washes: [
          { c: PAL.grey, o: 0.6, d: plate },
          { c: PAL.ochre, o: 0.95, d: chicken + drum },
          { c: PAL.terracotta, o: 0.55, d: chicken + drum },
        ],
      },
      'translate(132 184)',
    ),
    place(
      {
        lines: [cake1, cake2, icing],
        fine: [oval(0, 0, 28, 4)],
        washes: [
          { c: PAL.rose, o: 0.85, d: `${cake1}${cake2}Z` },
          { c: PAL.grey, o: 0.5, d: oval(0, 0, 28, 4) },
          { c: PAL.red, o: 0.95, d: dot(0, -36, 4) },
        ],
        whites: ['M-24 -18C-20 -12 -16 -12 -12 -17C-8 -12 -4 -12 0 -17C4 -12 8 -12 12 -17C16 -12 20 -12 24 -18C14 -21 -14 -21 -24 -18Z'],
      },
      'translate(222 184)',
    ),
    place(mouse({ big: true }), 'translate(180 186)'),
    place(mouse(), 'translate(260 186)'),
    place(mouse(), 'translate(196 268)'),
    place(catPounce({ mood: 'wow' }), 'translate(92 138) rotate(10)'),
    place(king({ mood: 'wow', arms: K_ARMS.up }), 'translate(326 270)'),
  ],
});
