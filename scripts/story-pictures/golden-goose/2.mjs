import { PAL, hatch, tufts } from '../lib.mjs';
import { HANS_ARMS, HANS_LEGS, OLD_ARMS, at, cake, compose, hans, oldMan, place, slice } from './characters.mjs';

// The Golden Goose, 2: in the forest, Hans sits on a fallen log and shares his lunch (the dry crust has
// become a big sweet cake) with the little grey old man.
const H = 'translate(132 284) scale(1.5)';
const O = 'translate(268 244) scale(1.65)';
const ground = 'M0 282C90 278 200 284 300 280C340 279 370 281 400 280';

// The fallen log, drawn in pieces so that its lines stop where Hans and the old man sit in front.
const logTop = 'M58 216C70 214 90 214 102 215M160 215C180 214 205 214 226 215M310 215C320 214 330 214 340 215';
const logBottom = 'M58 260C70 261 90 261 104 260M156 260C200 261 280 261 340 260';
const logEnd = 'M340 215C352 215 356 238 352 250C349 258 344 260 340 260C330 260 326 240 328 230C330 220 334 215 340 215Z';
const rings = 'M340 226C346 228 346 246 340 248C334 246 334 230 340 226ZM340 234C342 236 342 240 340 241';
const logLeft = 'M58 216C52 222 50 230 54 236C50 244 52 252 58 260';
const bark = 'M76 230c8 2 14 1 20 -1M70 246c8 2 16 2 26 0M172 232c10 2 20 2 30 0M190 248c12 2 26 2 36 -1M304 248c8 1 14 1 20 -1';
const logWash = 'M58 216C90 213 300 213 340 215C350 216 356 238 352 250C349 258 344 260 340 260C280 262 100 262 58 260C52 252 50 244 54 236C50 230 52 222 58 216Z';

// Trees at the edges of the clearing
const treeL = 'M10 282C14 230 12 160 18 100M40 282C34 230 36 170 34 100M18 120C8 100 -4 92 -10 90';
const crownL = 'M-10 96C-24 70 -10 30 20 30C40 6 80 16 80 46C96 62 84 96 60 98C44 112 14 110 -10 96Z';
const treeR = 'M372 282C376 236 372 180 378 120M398 282C392 230 396 170 396 120';
const crownR = 'M352 118C334 98 346 56 376 54C392 30 430 36 430 60L430 124C404 132 370 132 352 118Z';

const [sx, sy] = at(H, ...HANS_ARMS.share[1][2]);
const [ex, ey] = at(O, ...OLD_ARMS.eat[0][2]);

export default compose({
  title: 'Hans shares his lunch with the little grey old man',
  seed: 72,
  washes: [
    { c: PAL.green, o: 0.34, d: 'M0 278C90 274 200 280 300 276C340 275 370 277 400 276L400 300L0 300Z' },
    { c: PAL.green, o: 0.62, d: crownL + crownR },
    { c: PAL.ochre, o: 0.5, d: 'M10 282C14 230 12 160 18 100L34 100C36 170 34 230 40 282ZM372 282C376 236 372 180 378 120L396 120C396 170 392 230 398 282Z' },
    { c: PAL.terracotta, o: 0.55, d: logWash },
    { c: PAL.ochre, o: 0.4, d: logWash },
    { c: PAL.ochre, o: 0.55, d: logEnd },
  ],
  lines: [ground, logTop, logBottom, logEnd, logLeft, treeL, crownL, treeR, crownR],
  fine: [
    rings,
    bark,
    'M20 70c3-5 8-5 10 0M50 50c3-5 8-5 10 0M370 80c3-5 8-5 10 0',
    hatch(20, 292, 380, 294, 12, 7, 165, 4),
    tufts([[60, 280], [176, 282], [236, 281], [316, 280], [356, 281]], 9, 5),
  ],
  parts: [
    place(cake(), 'translate(196 217) scale(1.15)'),
    place(oldMan({ mood: 'kind', arms: OLD_ARMS.eat }), O),
    place(slice(), `translate(${ex} ${ey - 4}) rotate(-14) scale(1.3)`),
    place(hans({ mood: 'happy', tilt: 8, arms: HANS_ARMS.share, legs: HANS_LEGS.sit }), H),
    place(slice(), `translate(${sx + 4} ${sy - 6}) rotate(8) scale(1.3)`),
  ],
});
