import { PAL, hatch } from '../lib.mjs';
import { ANNIE_ARMS, LM_LEGS, annie, baby, compose, littleMan, place, spoon, windowArch } from './characters.mjs';

// Rumpelstiltskin, 10: in a rage the little man jumps on a big wooden spoon and flies out of the
// window, whoosh, never to be seen again. The Queen hugs her baby close, and they live happily.
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const SP = 'translate(212 196) rotate(-24) scale(1.2)';
// the little man astride the spoon, both hands on the handle in front of him
const L = 'translate(266 196) rotate(-16) scale(1.45)';
const ride = [
  [[-11, -39, 5.5], [-6, -26, 5], [12, -22, 4.5]],
  [[11, -39, 5.5], [22, -30, 5], [26, -24, 4.5]],
];
// two little hearts above the Queen and her baby
const heart = (x, y) => `M${x} ${y}c-2 -4 -8 -3 -7 1c1 3 5 5 7 8c2 -3 6 -5 7 -8c1 -4 -5 -5 -7 -1Z`;
const hearts = heart(150, 104) + heart(162, 84);
const whoosh = 'M200 210C188 216 176 220 162 222M202 196C190 200 178 202 166 202M204 224C194 232 184 238 172 242';

export default compose({
  title: 'The little man flies out of the window on a big spoon, and the Queen hugs her baby',
  seed: 90,
  washes: [
    { c: PAL.ochre, o: 0.12, d: 'M8 40C20 14 140 10 220 12C320 14 392 22 394 80C398 160 396 230 392 272L6 272C2 200 0 120 8 40Z' },
    { c: PAL.red, o: 0.35, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
    { c: PAL.red, o: 0.85, d: hearts },
  ],
  lines: [floor],
  fine: [hearts, hatch(14, 284, 384, 286, 12, 8, 172, 4), whoosh, 'M330 70c3 -4 8 -4 10 0M352 92c3 -4 8 -4 10 0'],
  parts: [
    windowArch(204, 22, 180, 200, { night: false, open: true }),
    place(spoon(), SP),
    place(littleMan({ mood: 'grumpy', arms: ride, legs: LM_LEGS.sit }), L),
    place(
      annie({ mood: 'smile', queen: true, arms: ANNIE_ARMS.baby, tilt: -10, held: place(baby({ mood: 'happy' }), 'translate(-9 -62) rotate(-10) scale(1.12)') }),
      'translate(104 272) scale(1.42)',
    ),
  ],
});
