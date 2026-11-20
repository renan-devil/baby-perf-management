import { PAL, hatch } from '../lib.mjs';
import { ANNIE_ARMS, LM_ARMS, annie, baby, compose, littleMan, place, windowArch } from './characters.mjs';

// Rumpelstiltskin, 6: a year later the miller's daughter is Queen, with a dear little baby. One day
// the little man comes back and holds out his hands for the baby.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
// a red curtain at the side of the room
const curtain = 'M330 16C336 80 340 160 350 270L400 270L400 16Z';
const folds = 'M362 30C364 100 366 180 372 266M384 30C384 110 386 190 390 266';

export default compose({
  title: 'The little man comes back and holds out his hands for the baby',
  seed: 86,
  washes: [
    { c: PAL.ochre, o: 0.12, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.red, o: 0.35, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.red, o: 0.75, d: curtain },
  ],
  lines: [floor, curtain],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), folds, 'M340 120C352 128 380 128 400 120'],
  parts: [
    windowArch(170, 30, 50, 70, { night: false }),
    place(
      annie({ mood: 'worried', queen: true, arms: ANNIE_ARMS.baby, held: place(baby({ mood: 'asleep' }), 'translate(-9 -62) rotate(-10) scale(1.12)') }),
      'translate(122 272) scale(1.42)',
    ),
    place(littleMan({ mood: 'sly', tilt: -4, arms: LM_ARMS.want }), 'translate(262 272) scale(-1.65 1.65)'),
  ],
});
