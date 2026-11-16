import { PAL, hatch } from '../lib.mjs';
import { K_ARMS, P_ARMS, compose, dot, king, place, plate, princess } from './characters.mjs';

// The Frog Prince, 6: at the dinner table, the king puts down his spoon, raises one finger and tells
// the sulking princess (arms folded, nose in the air): "A promise is a promise."
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
// the table with its long cloth, seen from the front
const cloth = 'M24 196L256 196L258 252C240 258 222 250 204 256C186 262 168 252 150 258C132 262 114 252 96 258C78 262 60 252 42 258C34 260 26 256 22 252Z';
const top = 'M24 196L256 196';
const legs = 'M40 258L40 272M240 256L240 272';
// on the table: a soup tureen, little cakes with cherries, and the princess's golden plate
const tureen = 'M54 196C50 180 58 172 74 172C90 172 98 180 94 196M64 172C64 166 84 166 84 172M74 166l0 -4';
const cakes = 'M108 196L110 188L126 188L128 196M112 188C112 182 124 182 124 188';
const cherry = dot(118, 180, 3);

export default compose({
  title: 'A promise is a promise',
  seed: 56,
  washes: [
    { c: PAL.ochre, o: 0.28, d: 'M0 268C100 265 200 270 300 267C340 266 370 268 400 267L400 294C300 296 100 295 0 294Z' },
    { c: PAL.sky, o: 0.35, d: cloth },
    { c: PAL.grey, o: 0.5, d: 'M54 196C50 180 58 172 74 172C90 172 98 180 94 196Z' },
    { c: PAL.terracotta, o: 0.6, d: 'M108 196L110 188L126 188L128 196ZM112 188C112 182 124 182 124 188Z' },
    { c: PAL.red, o: 0.9, d: cherry },
  ],
  lines: [floor, cloth, legs, tureen],
  fine: [top, cakes, cherry, hatch(14, 284, 384, 286, 12, 7, 172, 4), 'M30 226C100 230 180 230 250 226'],
  parts: [
    place(king({ mood: 'stern', arms: K_ARMS.finger, finger: true }), 'translate(150 196) scale(1.45)'),
    place(plate(44), 'translate(222 194)'),
    place(princess({ mood: 'cross', tilt: -10, arms: P_ARMS.fold }), 'translate(330 276) scale(1.4)'),
  ],
});
