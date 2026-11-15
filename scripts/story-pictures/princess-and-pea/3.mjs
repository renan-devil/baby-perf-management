import { PAL } from '../lib.mjs';
import { Q_ARMS, at, bedroomWindow, compose, pea, place, queen } from './characters.mjs';

// The Princess and the Pea, 3: in the guest bedroom, the old Queen has taken all the bedding off the
// bed (it lies in a heap on the floor); night has come to the window. Smiling to herself, she leans over the bare wooden boards and,
// pinched between her finger and thumb, puts down one tiny green pea, which glints.
const headboard = 'M18 266L18 112C18 84 72 84 72 112L72 266';
const knobs = 'M14 112C14 104 24 104 24 112ZM66 112C66 104 76 104 76 112Z';
const footboard = 'M196 266L196 182C196 176 210 176 210 182L210 266';
const rail = 'M72 198L196 198L196 216L72 216Z';
const boards = 'M72 186L196 186L196 198L72 198Z';
const slats = 'M92 186l0 12M112 186l0 12M132 186l0 12M152 186l0 12M174 186l0 12';
const grain = 'M30 134q6 30 0 60M56 124q-4 30 2 70M100 207c20 -1 40 -1 60 1M203 200q2 20 0 40';
const floor = 'M10 266C120 263 290 263 392 266';
// the bedding, taken off and piled on the floor: a striped blanket and a pillow
const heap = 'M350 266C346 254 356 244 370 246C378 240 392 242 396 252C398 258 398 264 396 266Z';
const pillow = 'M356 248C354 238 362 232 374 235C384 237 388 244 382 249C374 252 362 252 356 248Z';
const heapStripes = 'M356 258q8 -4 16 -2M372 262q10 -5 20 -3';

const QT = 'translate(270 266) scale(1.25)';
const Q = queen({
  mood: 'smile',
  look: -1,
  tilt: -8,
  lean: -8,
  arms: [
    [[-22, -104, 11], [-46, -104, 10], [-68, -104, 10], [-86, -100, 10]],
    Q_ARMS.down[1],
  ],
});
// where her hand lands (the arm leans with her body round (0,-10))
const [hx, hy] = at(-86, -100, `${QT} rotate(-8 0 -10)`);

export default compose({
  title: 'One Tiny Pea',
  seed: 837,
  washes: [
    { c: PAL.grey, o: 0.3, d: 'M10 264C120 258 290 258 392 264C394 274 300 280 200 280C110 280 10 276 10 264Z' },
    { c: PAL.terracotta, o: 0.8, d: `${headboard}Z${footboard}Z${rail}` },
    { c: PAL.ochre, o: 0.6, d: boards },
    { c: PAL.ochre, o: 0.95, d: knobs },
    { c: PAL.sky, o: 0.7, d: heap },
    { c: PAL.red, o: 0.4, d: heap },
  ],
  whites: pillow,
  lines: [floor, headboard, footboard, rail, boards, heap, pillow],
  fine: [knobs, slats, grain, heapStripes],
  parts: [place(bedroomWindow(), 'translate(108 128) scale(0.6)'), place(Q, QT), place(pea({ r: 5.5, shine: true }), `translate(${hx - 2} ${hy + 8})`)],
});
