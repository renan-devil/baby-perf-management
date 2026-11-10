import { PAL, hatch } from '../lib.mjs';
import { ELF_LEGS, bench, candle, compose, elf, place, shoe, shoePair } from './characters.mjs';

// The Elves and the Shoemaker, 6: at midnight two tiny elves in ragged clothes, with bare feet, sit on
// the workbench sewing and hammering as fast as they can. Stitch, stitch! Tap, tap!
const floor = 'M0 272C90 269 200 274 300 271C340 270 370 272 400 271';
const TOP = 172; // front edge of the bench top

// The sewing elf (sitting on the front edge, in its own coordinates): a shoe in its lap, the needle
// pulled high with a long thread.
const E1 = `translate(136 ${TOP + 14 * 1.9}) scale(1.9)`;
const needle = 'M22 -46L28 -56';
const thread = 'M24 -50C40 -44 34 -24 4 -18';

// The hammering elf (standing on the bench top), holding a shoe on a little wooden block, hammer
// raised high.
const E2 = 'translate(300 166) scale(1.9)';
const hammerFill = 'M5 -72L-5 -60L-8 -63L2 -75Z';
const hammer = `M12 -56L0 -66${hammerFill}`;
const block = 'M214 166L214 140L252 140L252 166M214 140L220 134L256 134L252 140M256 134L256 160L252 166';
const taps = 'M204 120q-6 -4 -6 -10M214 112q-4 -6 -2 -12M196 132q-8 -2 -10 -8';

export default compose({
  title: 'Two tiny elves at work',
  seed: 96,
  washes: [
    { c: PAL.slate, o: 0.36, d: 'M4 20C80 8 300 10 396 22C400 120 398 200 396 274L4 274C0 200 2 100 4 20Z' },
    { c: PAL.ochre, o: 0.3, d: 'M0 270C100 267 200 272 300 269C340 268 370 270 400 269L400 294C300 296 100 295 0 294Z' },
  ],
  after: [{ c: PAL.ochre, o: 0.7, d: 'M214 166L214 140L252 140L252 166ZM214 140L220 134L256 134L252 140ZM256 134L256 160L252 166L252 140Z' }],
  fine: [hatch(14, 284, 384, 286, 12, 8, 172, 4), taps],
  lines: [floor, block],
  parts: [
    place(bench({ w: 340, h: 100 }), 'translate(200 272)'),
    place(candle({ glow: 60 }), 'translate(54 168)'),
    place(shoePair({}), 'translate(342 182) scale(0.8)'),
    place(shoe({}), 'translate(212 140) scale(1.1)'),
    place(
      elf({
        hair: PAL.terracotta,
        legs: ELF_LEGS.sit,
        mood: 'down',
        arms: [
          [[-7, -32, 4.5], [-12, -24, 4], [-6, -18, 4]],
          [[7, -32, 4.5], [16, -38, 4], [22, -46, 4]],
        ],
      }),
      E1,
    ),
    place(
      {
        lines: [needle],
        fine: [thread],
        washes: [],
      },
      E1,
    ),
    place(shoe({}), `${E1} translate(-14 -14) scale(0.55)`),
    place(
      elf({
        hair: PAL.ochre,
        mood: 'down',
        arms: [
          [[-7, -32, 4.5], [-16, -26, 4], [-24, -18, 4]],
          [[7, -32, 4.5], [16, -42, 4], [12, -56, 4]],
        ],
      }),
      E2,
    ),
    place({ lines: [hammer], washes: [{ c: PAL.grey, o: 0.85, d: hammerFill }] }, E2),
  ],
});
