import { PAL, hatch } from '../lib.mjs';
import { ANNIE_ARMS, LM_ARMS, LM_HEAD, annie, at, baby, compose, shine, littleMan, place, windowArch } from './characters.mjs';

// Rumpelstiltskin, 9: the Queen smiles and asks, "Is your name ... Rumpelstiltskin?" The little man is
// so surprised that his beard stands on end and his hat jumps off his head.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const L = 'translate(290 272) scale(1.7)';
const [lx, ly] = at(L, LM_HEAD[0], LM_HEAD[1] - 2);

export default compose({
  title: 'The Queen guesses his name, and the little man is so surprised his beard stands on end',
  seed: 89,
  washes: [
    { c: PAL.ochre, o: 0.12, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.red, o: 0.35, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
  ],
  lines: [floor],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), shine(lx, ly - 6, 60, 80, 9, 195, 345)],
  parts: [
    windowArch(176, 30, 50, 70, { night: false }),
    place(
      annie({ mood: 'smile', queen: true, arms: ANNIE_ARMS.ask, tilt: 6, held: place(baby({ mood: 'happy' }), 'translate(-9 -62) rotate(-10) scale(1.12)') }),
      'translate(116 272) scale(1.42)',
    ),
    place(littleMan({ mood: 'shock', beard: 'up', arms: LM_ARMS.shock, hat: 'translate(3 -18) rotate(-16)' }), L),
  ],
});
